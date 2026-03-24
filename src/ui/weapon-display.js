import { CombatCard, DistanceCard, WeaponType } from '../types.js';
import { WEAPON_NAMES, WEAPON_EMOJI, WEAPON_ZONES, DISTANCE_NAMES } from '../constants.js';

// ═══════ Shared Display Constants ═══════
// Used by animation.js, renderer.js, setup-screen.js

export const COMBAT_CARD_INFO = {
  [CombatCard.DEFLECT]: { emoji: '🤺', type: '防', desc: '反制重击+识破擒拿，克重击/擒拿' },
  [CombatCard.SLASH]:   { emoji: '⚡', type: '攻', desc: '3伤+1架势，高威力' },
  [CombatCard.THRUST]:  { emoji: '🎯', type: '攻', desc: '1伤+1架势，快速打击' },
  [CombatCard.BLOCK]:   { emoji: '🛡️', type: '防', desc: '减免攻击伤害' },
  [CombatCard.FEINT]:   { emoji: '🌀', type: '攻', desc: '0伤+3架势，克格挡/闪避，被卸力识破' },
};

export const DISTANCE_CARD_INFO = {
  [DistanceCard.ADVANCE]: { emoji: '⬆️', desc: '冲步：间距-1' },
  [DistanceCard.RETREAT]: { emoji: '⬇️', desc: '撤步：间距+1' },
  [DistanceCard.HOLD]:    { emoji: '⏸️', desc: '不变' },
  [DistanceCard.DODGE]:   { emoji: '💨', desc: '闪避(耗2体力，短刀/双刺耗1)：闪开重击/轻击，无法躲擒拿' },
};

export const FIGHTER_POSITIONS = {
  0: { player: 42, ai: 58 },
  1: { player: 35, ai: 65 },
  2: { player: 24, ai: 76 },
  3: { player: 12, ai: 88 },
};

// ═══════ Weapon Trait Data ═══════

// Trait categories: core=核心独有, buff=数值增益, weak=弱势
const T = (cat, text) => ({ cat, text });

export const WEAPON_TRAITS = {
  [WeaponType.SHORT_BLADE]: {
    style: '近身刺客',
    traits: [
      T('core', '优势区闪避反击1伤'),
      T('core', '闪避仅耗1体力'),
      T('buff', '优势区擒拿+4架势'),
      T('weak', '远距(3)重击无伤'),
    ],
  },
  [WeaponType.SPEAR]: {
    style: '中远控距',
    traits: [
      T('core', '优势区格挡弹枪→推距+1'),
      T('buff', '优势区重击5伤，额外+1架势'),
      T('weak', '贴身(0)重击无伤'),
    ],
  },
  [WeaponType.SWORD]: {
    style: '均衡防反',
    traits: [
      T('core', '卸力不僵直，自身回2架势'),
      T('core', '优势区格挡完全免重击'),
      T('weak', '贴身重击仅1伤，远距重击无伤'),
    ],
  },
  [WeaponType.STAFF]: {
    style: '广域压制',
    traits: [
      T('core', '优势区擒拿命中格挡→推距+1'),
      T('core', '优势区格挡给对手+1架势'),
      T('buff', '优势区擒拿+4架势 / 重击+2架势'),
      T('weak', '贴身(0)重击无伤'),
    ],
  },
  [WeaponType.GREAT_BLADE]: {
    style: '重击爆发',
    traits: [
      T('core', '优势区重击命中→推距+1'),
      T('core', '优势区格挡减2伤(常规1)'),
      T('buff', '优势区重击6伤(全场最高)'),
      T('weak', '贴身(0)重击无伤'),
    ],
  },
  [WeaponType.DUAL_STAB]: {
    style: '贴身缠斗',
    traits: [
      T('core', '闪避成功→对手+2架势'),
      T('core', '闪避仅耗1体力'),
      T('buff', '贴身：轻击3伤(追击) / 擒拿+4架势'),
      T('weak', '中远距(2-3)重击无伤'),
    ],
  },
};

const TRAIT_CAT_META = {
  core: { label: '特', cls: 'wz-cat-core' },
  buff: { label: '强', cls: 'wz-cat-buff' },
  weak: { label: '弱', cls: 'wz-cat-weak' },
};
const CAT_ORDER = ['core', 'buff', 'weak'];

// ═══════ Weapon Skill Cards (未开发) ═══════

const WEAPON_SKILLS = {
  [WeaponType.SHORT_BLADE]: [{ name: '贴身步', emoji: '👣', desc: '间距-1，贴身区额外减体力消耗' }],
  [WeaponType.SPEAR]:       [{ name: '撑杆退', emoji: '🔱', desc: '间距+1，阻止对手下回合靠近超过1格' }],
  [WeaponType.SWORD]:       [{ name: '游身换位', emoji: '🌊', desc: '间距不变，获得下回合优先结算权' }],
  [WeaponType.STAFF]:       [{ name: '拨草寻蛇', emoji: '🐍', desc: '间距+1，并给对手+1架势' }],
  [WeaponType.GREAT_BLADE]: [{ name: '沉肩带步', emoji: '🏋️', desc: '间距-1，下回合重击消耗-1' }],
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

  const sortedTraits = info ? [...info.traits].sort((a, b) => CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat)) : [];
  const traits = sortedTraits.map(t => {
    const meta = TRAIT_CAT_META[t.cat];
    return `<span class="wz-trait ${meta.cls}"><span class="wz-cat-label">${meta.label}</span>${t.text}</span>`;
  }).join('');

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
