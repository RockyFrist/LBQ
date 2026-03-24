import { WeaponType, CombatCard } from '../types.js';
import { WEAPON_ZONES } from '../constants.js';

// ═══════ WEAPON_PROFILES — 单一数据来源 ═══════
// 每个兵器只定义与默认值不同的属性

const DEFAULTS = {
  deflectStagger: true,     // 卸力成功是否造成僵直
  deflectSelfStance: 0,     // 卸力成功后自身架势变化
  blockSlashReduction: 1,   // 格挡对重击的基础减伤
  advBlockSlashReduction: 0,// 优势区格挡对重击的额外减伤
  advDodgeCounter: 0,       // 优势区闪避反击伤害
  advBlockPerfect: false,   // 优势区完美格挡(重击免伤)
  advBlockBonusStance: 0,   // 优势区格挡给对手额外架势
  advSlashBonusStance: 0,   // 优势区重击命中额外架势
  advBlockPushDist: 0,      // 优势区格挡推距
  advFeintBonusStance: 0,   // 优势区擒拿额外架势
  dodgeCostReduction: 0,     // 闪避体力消耗减免
  damageRules: [],          // 伤害修正规则 [{adv, disadv, dist, minDist, card, mod}]
  pushRules: [],            // 推距规则 [{card, vs, adv, push}]
};

const WEAPON_PROFILES = {
  [WeaponType.SHORT_BLADE]: {
    advDodgeCounter: 1,
    advFeintBonusStance: 1,
    dodgeCostReduction: 1,
    damageRules: [
      { minDist: 3, card: CombatCard.SLASH, mod: -3 },
    ],
  },
  [WeaponType.SPEAR]: {
    advBlockPushDist: 1,
    damageRules: [
      { adv: true, card: CombatCard.SLASH, mod: +2 },
      { dist: 0, card: CombatCard.SLASH, mod: -3 },
    ],
  },
  [WeaponType.SWORD]: {
    deflectStagger: false,
    deflectSelfStance: -2,
    advBlockPerfect: true,
    damageRules: [
      { dist: 0, card: CombatCard.SLASH, mod: -2 },
      { dist: 3, card: CombatCard.SLASH, mod: -3 },
    ],
  },
  [WeaponType.STAFF]: {
    advBlockBonusStance: 1,
    advSlashBonusStance: 2,
    advFeintBonusStance: 1,
    damageRules: [
      { dist: 0, card: CombatCard.SLASH, mod: -3 },
    ],
    pushRules: [
      { card: CombatCard.FEINT, vs: CombatCard.BLOCK, adv: true, push: 1 },
    ],
  },
  [WeaponType.GREAT_BLADE]: {
    advBlockSlashReduction: 1,
    damageRules: [
      { adv: true, card: CombatCard.SLASH, mod: +3 },
      { dist: 0, card: CombatCard.SLASH, mod: -3 },
    ],
    pushRules: [
      { card: CombatCard.SLASH, adv: true, push: 1 },
    ],
  },
  [WeaponType.DUAL_STAB]: {
    advFeintBonusStance: 1,
    dodgeCostReduction: 1,
    damageRules: [
      { adv: true, card: CombatCard.THRUST, mod: +1 },
      { disadv: true, card: CombatCard.SLASH, mod: -3 },
    ],
  },
};

// ═══════ Profile 查询 ═══════

function prof(weapon) {
  const p = WEAPON_PROFILES[weapon];
  return p ? { ...DEFAULTS, ...p } : { ...DEFAULTS };
}

// ═══════ 通用距离判定 ═══════

export function isAdvantage(weapon, distance) {
  return WEAPON_ZONES[weapon].advantage.includes(distance);
}

export function isDisadvantage(weapon, distance) {
  return WEAPON_ZONES[weapon].disadvantage.includes(distance);
}

// ═══════ 伤害修正 ═══════

export function getDamageModifier(weapon, distance, combatCard) {
  const p = prof(weapon);
  for (const r of p.damageRules) {
    if (r.card !== combatCard) continue;
    if (r.adv && !isAdvantage(weapon, distance)) continue;
    if (r.disadv && !isDisadvantage(weapon, distance)) continue;
    if (r.dist !== undefined && r.dist !== distance) continue;
    if (r.minDist !== undefined && distance < r.minDist) continue;
    return r.mod;
  }
  return 0;
}

// ═══════ 质变机制 ═══════

export function dodgeCounterDamage(weapon, distance) {
  return isAdvantage(weapon, distance) ? prof(weapon).advDodgeCounter : 0;
}

export function isBlockPerfect(weapon, distance) {
  return isAdvantage(weapon, distance) && prof(weapon).advBlockPerfect;
}

export function blockBonusStance(weapon, distance) {
  return isAdvantage(weapon, distance) ? prof(weapon).advBlockBonusStance : 0;
}

export function slashBonusStance(weapon, distance) {
  return isAdvantage(weapon, distance) ? prof(weapon).advSlashBonusStance : 0;
}

export function blockPushDistance(weapon, distance) {
  return isAdvantage(weapon, distance) ? prof(weapon).advBlockPushDist : 0;
}

export function getBlockSlashReduction(weapon, distance) {
  const p = prof(weapon);
  return p.blockSlashReduction + (isAdvantage(weapon, distance) ? p.advBlockSlashReduction : 0);
}

export function deflectCausesStagger(weapon) {
  return prof(weapon).deflectStagger;
}

export function deflectSelfStanceChange(weapon) {
  return prof(weapon).deflectSelfStance;
}

export function getFeintStanceValue(weapon, distance) {
  const base = 3;
  return base + (isAdvantage(weapon, distance) ? prof(weapon).advFeintBonusStance : 0);
}

export function getDodgeCostReduction(weapon) {
  return prof(weapon).dodgeCostReduction;
}

export function getPushDistance(weapon, distance, combatCard, opponentCard) {
  if (!isAdvantage(weapon, distance)) return 0;
  const p = prof(weapon);
  for (const r of p.pushRules) {
    if (r.card !== combatCard) continue;
    if (r.adv && !isAdvantage(weapon, distance)) continue;
    if (r.vs && r.vs !== opponentCard) continue;
    return r.push;
  }
  return 0;
}

// ═══════ 通用规则(非兵器特定) ═══════

export function canThrustBreakDodge(thrustWeapon, distance) {
  return isAdvantage(thrustWeapon, distance);
}

export function calcAttackStance(baseStance, attackerWeapon, distance) {
  if (isDisadvantage(attackerWeapon, distance)) return Math.floor(baseStance / 2);
  return baseStance;
}
