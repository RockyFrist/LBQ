import { WeaponType, CombatCard, DistanceCard, CardType } from './types.js';

// ===== 基础数值（可被 config 覆盖）=====
// 使用对象以支持运行时修改
export const gameConfig = {
  MAX_HP: 10,
  MAX_STANCE: 5,
  EXECUTION_DAMAGE: 5,
  INITIAL_DISTANCE: 2,
  MAX_STAMINA: 4,
  STAMINA_RECOVERY: 1,
};

export const MIN_DISTANCE = 0;
export const MAX_DISTANCE = 3;

export const DISTANCE_NAMES = ['贴身区', '近战区', '中距区', '远距区'];

export const CARD_TYPE_MAP = {
  [CombatCard.DEFLECT]: CardType.DEFENSE,
  [CombatCard.SLASH]: CardType.ATTACK,
  [CombatCard.THRUST]: CardType.ATTACK,
  [CombatCard.BLOCK]: CardType.DEFENSE,
  [CombatCard.FEINT]: CardType.ATTACK,
};

export const COMBAT_CARD_BASE = {
  [CombatCard.DEFLECT]: { cost: 3, staminaCost: 0, damage: 2, stanceToOpponent: 2, priority: 2 },
  [CombatCard.SLASH]:   { cost: 3, staminaCost: 0, damage: 3, stanceToOpponent: 1, priority: 3 },
  [CombatCard.THRUST]:  { cost: 1, staminaCost: 0, damage: 1, stanceToOpponent: 1, priority: 4 },
  [CombatCard.BLOCK]:   { cost: 2, staminaCost: 0, damage: 0, stanceToOpponent: 0, priority: 5 },
  [CombatCard.FEINT]:   { cost: 1, staminaCost: 0, damage: 0, stanceToOpponent: 2, priority: 6 },
};

export const DISTANCE_CARD_BASE = {
  [DistanceCard.ADVANCE]: { cost: 2, delta: -1 },
  [DistanceCard.RETREAT]: { cost: 2, delta: +1 },
  [DistanceCard.HOLD]:    { cost: 0, delta: 0 },
  [DistanceCard.DODGE]:   { cost: 2, delta: 0 },
};

export const COMBAT_CARD_NAMES = {
  [CombatCard.DEFLECT]: '卸力',
  [CombatCard.SLASH]: '重击',
  [CombatCard.THRUST]: '轻击',
  [CombatCard.BLOCK]: '格挡',
  [CombatCard.FEINT]: '擒拿',
};

export const DISTANCE_CARD_NAMES = {
  [DistanceCard.ADVANCE]: '冲步',
  [DistanceCard.RETREAT]: '撤步',
  [DistanceCard.HOLD]: '扎马',
  [DistanceCard.DODGE]: '闪避',
};

export const WEAPON_NAMES = {
  [WeaponType.SHORT_BLADE]: '短刀',
  [WeaponType.SPEAR]: '长枪',
  [WeaponType.SWORD]: '剑',
  [WeaponType.STAFF]: '棍',
  [WeaponType.GREAT_BLADE]: '大刀',
  [WeaponType.DUAL_STAB]: '双刺',
};

export const WEAPON_EMOJI = {
  [WeaponType.SHORT_BLADE]: '🗡️',
  [WeaponType.SPEAR]: '🔱',
  [WeaponType.SWORD]: '⚔️',
  [WeaponType.STAFF]: '🏑',
  [WeaponType.GREAT_BLADE]: '🪓',
  [WeaponType.DUAL_STAB]: '🥢',
};

export const WEAPON_ZONES = {
  [WeaponType.SHORT_BLADE]: { advantage: [0, 1], disadvantage: [2, 3] },
  [WeaponType.SPEAR]:       { advantage: [2, 3], disadvantage: [0] },
  [WeaponType.SWORD]:       { advantage: [1, 2], disadvantage: [0, 3] },
  [WeaponType.STAFF]:       { advantage: [1, 2, 3], disadvantage: [0] },
  [WeaponType.GREAT_BLADE]: { advantage: [2], disadvantage: [0] },
  [WeaponType.DUAL_STAB]:   { advantage: [0], disadvantage: [2, 3] },
};
