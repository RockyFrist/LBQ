;(function(LBQ) {

const { WeaponType, CombatCard, DistanceCard, CardType } = LBQ;

// ===== 基础数值 =====
const MAX_HP = 10;
const MAX_STAMINA = 8;
const STAMINA_RECOVERY = 3;
const MAX_STANCE = 5;
const EXECUTION_DAMAGE = 5;
const INITIAL_DISTANCE = 2;
const MIN_DISTANCE = 0;
const MAX_DISTANCE = 3;

// ===== 距离区间名称 =====
const DISTANCE_NAMES = ['贴身区', '近战区', '中距区', '远距区'];

// ===== 卡牌分类 =====
const CARD_TYPE_MAP = {
  [CombatCard.DODGE]: CardType.DEFENSE,
  [CombatCard.DEFLECT]: CardType.DEFENSE,
  [CombatCard.SLASH]: CardType.ATTACK,
  [CombatCard.THRUST]: CardType.ATTACK,
  [CombatCard.BLOCK]: CardType.DEFENSE,
  [CombatCard.FEINT]: CardType.ATTACK,
};

// ===== 攻防卡牌基础数值 =====
const COMBAT_CARD_BASE = {
  [CombatCard.DODGE]:   { cost: 2, damage: 0, stanceToOpponent: 1, priority: 1 },
  [CombatCard.DEFLECT]: { cost: 3, damage: 2, stanceToOpponent: 2, priority: 2 },
  [CombatCard.SLASH]:   { cost: 3, damage: 3, stanceToOpponent: 1, priority: 3 },
  [CombatCard.THRUST]:  { cost: 1, damage: 1, stanceToOpponent: 1, priority: 4 },
  [CombatCard.BLOCK]:   { cost: 2, damage: 0, stanceToOpponent: 0, priority: 5 },
  [CombatCard.FEINT]:   { cost: 1, damage: 0, stanceToOpponent: 2, priority: 6 },
};

// ===== 距离卡基础消耗 =====
const DISTANCE_CARD_BASE = {
  [DistanceCard.ADVANCE]: { cost: 1, delta: -1 },
  [DistanceCard.RETREAT]: { cost: 1, delta: +1 },
  [DistanceCard.HOLD]:    { cost: 0, delta: 0 },
};

// ===== 卡牌中文名 =====
const COMBAT_CARD_NAMES = {
  [CombatCard.DODGE]: '闪避',
  [CombatCard.DEFLECT]: '卸力',
  [CombatCard.SLASH]: '劈砍',
  [CombatCard.THRUST]: '点刺',
  [CombatCard.BLOCK]: '格挡',
  [CombatCard.FEINT]: '虚晃',
};

const DISTANCE_CARD_NAMES = {
  [DistanceCard.ADVANCE]: '靠近',
  [DistanceCard.RETREAT]: '远离',
  [DistanceCard.HOLD]: '站稳',
};

const WEAPON_NAMES = {
  [WeaponType.SHORT_BLADE]: '短刀',
  [WeaponType.SPEAR]: '长枪',
  [WeaponType.SWORD]: '剑',
  [WeaponType.STAFF]: '棍',
  [WeaponType.GREAT_BLADE]: '大刀',
  [WeaponType.DUAL_STAB]: '双刺',
};

const WEAPON_EMOJI = {
  [WeaponType.SHORT_BLADE]: '🗡️',
  [WeaponType.SPEAR]: '🔱',
  [WeaponType.SWORD]: '⚔️',
  [WeaponType.STAFF]: '🏑',
  [WeaponType.GREAT_BLADE]: '🪓',
  [WeaponType.DUAL_STAB]: '🥢',
};

// ===== 兵器优劣势区间定义 =====
const WEAPON_ZONES = {
  [WeaponType.SHORT_BLADE]: {
    advantage: [0, 1],
    disadvantage: [2, 3],
  },
  [WeaponType.SPEAR]: {
    advantage: [2, 3],
    disadvantage: [0],
  },
  [WeaponType.SWORD]: {
    advantage: [1, 2],
    disadvantage: [0, 3],
  },
  [WeaponType.STAFF]: {
    advantage: [1, 2, 3],
    disadvantage: [0],
  },
  [WeaponType.GREAT_BLADE]: {
    advantage: [2],
    disadvantage: [0],
  },
  [WeaponType.DUAL_STAB]: {
    advantage: [0],
    disadvantage: [2, 3],
  },
};

Object.assign(LBQ, {
  MAX_HP, MAX_STAMINA, STAMINA_RECOVERY, MAX_STANCE, EXECUTION_DAMAGE,
  INITIAL_DISTANCE, MIN_DISTANCE, MAX_DISTANCE, DISTANCE_NAMES,
  CARD_TYPE_MAP, COMBAT_CARD_BASE, DISTANCE_CARD_BASE,
  COMBAT_CARD_NAMES, DISTANCE_CARD_NAMES, WEAPON_NAMES, WEAPON_EMOJI, WEAPON_ZONES
});

})(window.LBQ);
