import { CombatCard, DistanceCard, WeaponType } from '../types.js';
import { WEAPON_NAMES, WEAPON_EMOJI, WEAPON_ZONES, DISTANCE_NAMES } from '../constants.js';

// ═══════ Shared Display Constants ═══════
// Used by animation.js, renderer.js, setup-screen.js

export const COMBAT_CARD_INFO = {
  [CombatCard.DEFLECT]: { emoji: '🤺', type: '防', desc: '反制劈砍，成功2伤+2架势+僵直' },
  [CombatCard.SLASH]:   { emoji: '⚡', type: '攻', desc: '3伤+1架势，高威力' },
  [CombatCard.THRUST]:  { emoji: '🎯', type: '攻', desc: '1伤+1架势，快速打击' },
  [CombatCard.BLOCK]:   { emoji: '🛡️', type: '防', desc: '减免攻击伤害' },
  [CombatCard.FEINT]:   { emoji: '🌀', type: '攻', desc: '0伤+2架势，克格挡/卸力' },
};

export const DISTANCE_CARD_INFO = {
  [DistanceCard.ADVANCE]: { emoji: '⬆️', desc: '冲步：间距-1' },
  [DistanceCard.RETREAT]: { emoji: '⬇️', desc: '撤步：间距+1' },
  [DistanceCard.HOLD]:    { emoji: '⏸️', desc: '不变' },
  [DistanceCard.DODGE]:   { emoji: '💨', desc: '闪避(耗2体力)：闪开攻击+出攻防卡' },
};

export const FIGHTER_POSITIONS = {
  0: { player: 42, ai: 58 },
  1: { player: 35, ai: 65 },
  2: { player: 24, ai: 76 },
  3: { player: 12, ai: 88 },
};

// ═══════ Weapon Trait Data ═══════

export const WEAPON_TRAITS = {
  [WeaponType.SHORT_BLADE]: {
    style: '近身刺客',
    traits: ['优势区点刺破闪避', '优势区闪避反击1伤', '远距劈砍几乎无效'],
  },
  [WeaponType.SPEAR]: {
    style: '中远控距',
    traits: ['优势区劈砍+2伤', '劈砍额外+1架势', '优势区格挡弹枪推1距', '贴身劈砍几乎无力'],
  },
  [WeaponType.SWORD]: {
    style: '均衡防反',
    traits: ['卸力不僵直/自身-2架势', '优势区完美格挡(劈砍免伤)', '贴身远距劈砍削弱'],
  },
  [WeaponType.STAFF]: {
    style: '广域压制',
    traits: ['虚晃+3架势+推距', '优势区劈砍额外+2架势', '优势区格挡震退+1架势', '贴身劈砍几乎无力'],
  },
  [WeaponType.GREAT_BLADE]: {
    style: '重击爆发',
    traits: ['优势区劈砍+3伤(共6)', '劈砍命中→推距+1', '格挡额外减1伤', '贴身劈砍几乎无力'],
  },
  [WeaponType.DUAL_STAB]: {
    style: '贴身缠斗',
    traits: ['贴身点刺追击+1伤', '闪避成功→对手+2架势', '贴身命中额外+1架势'],
  },
};

// ═══════ Weapon Skill Cards (未开发) ═══════

const WEAPON_SKILLS = {
  [WeaponType.SHORT_BLADE]: [{ name: '贴身步', emoji: '👣', desc: '间距-1，贴身区额外减体力消耗' }],
  [WeaponType.SPEAR]:       [{ name: '撑杆退', emoji: '🔱', desc: '间距+1，阻止对手下回合靠近超过1格' }],
  [WeaponType.SWORD]:       [{ name: '游身换位', emoji: '🌊', desc: '间距不变，获得下回合优先结算权' }],
  [WeaponType.STAFF]:       [{ name: '拨草寻蛇', emoji: '🐍', desc: '间距+1，并给对手+1架势' }],
  [WeaponType.GREAT_BLADE]: [{ name: '沉肩带步', emoji: '🏋️', desc: '间距-1，下回合劈砍消耗-1' }],
  [WeaponType.DUAL_STAB]:   [{ name: '蛇行缠步', emoji: '🥢', desc: '间距-2，消耗2体力' }],
};

export function buildWeaponSkillCards(weapon) {
  const skills = WEAPON_SKILLS[weapon] || [];
  return skills.map(skill => `
    <div class="dist-card disabled weapon-skill-card" title="${skill.desc}（未开发）">
      <span class="dc-emoji">${skill.emoji}</span>
      <span class="dc-name">${skill.name}</span>
      <span class="dc-cost">🔒</span>
    </div>
  `).join('');
}

// ═══════ Graphical Weapon Zone Strip ═══════

export function buildWeaponZoneStrip(weapon, currentDist = null) {
  const zones = WEAPON_ZONES[weapon];
  const info = WEAPON_TRAITS[weapon];

  const cells = [0, 1, 2, 3].map(d => {
    const isAdv = zones.advantage.includes(d);
    const isDis = zones.disadvantage.includes(d);
    const isCur = d === currentDist;
    let cls = 'wz-cell';
    if (isAdv) cls += ' wz-adv';
    else if (isDis) cls += ' wz-dis';
    else cls += ' wz-neutral';
    if (isCur) cls += ' wz-current';

    const marker = isAdv ? '★' : isDis ? '✗' : '·';
    return `<div class="${cls}">
      <div class="wz-dist-name">${DISTANCE_NAMES[d]}</div>
      <div class="wz-marker">${marker}</div>
      ${isCur ? '<div class="wz-here">▲</div>' : ''}
    </div>`;
  }).join('');

  const traits = info ? info.traits.map(t => `<span class="wz-trait">${t}</span>`).join('') : '';

  return `
    <div class="wz-strip">
      <div class="wz-header">${WEAPON_EMOJI[weapon]} ${WEAPON_NAMES[weapon]} · ${info?.style || ''}</div>
      <div class="wz-bar">${cells}</div>
      ${traits ? `<div class="wz-traits">${traits}</div>` : ''}
    </div>
  `;
}

// ═══════ Weapon Pick Card (for selection grids) ═══════

export function buildWeaponPickCard(weapon, selected = false) {
  const info = WEAPON_TRAITS[weapon];
  return `
    <div class="weapon-pick-btn ${selected ? 'selected' : ''}" data-weapon="${weapon}">
      <span class="wpb-emoji">${WEAPON_EMOJI[weapon]}</span>
      <span class="wpb-name">${WEAPON_NAMES[weapon]}</span>
      <span class="wpb-style">${info?.style || ''}</span>
    </div>
  `;
}
