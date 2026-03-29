// ===== 枚举常量 =====

/** 兵器类型 */
export const WeaponType = Object.freeze({
  SHORT_BLADE: 'short_blade',
  SPEAR: 'spear',
  SWORD: 'sword',
  STAFF: 'staff',
  GREAT_BLADE: 'great_blade',
  DUAL_STAB: 'dual_stab',
});

/** 身法卡 */
export const DistanceCard = Object.freeze({
  HOLD: 'hold',
  ADVANCE: 'advance',
  RETREAT: 'retreat',
  DODGE: 'dodge',
});

/** 攻防操作卡 */
export const CombatCard = Object.freeze({
  DEFLECT: 'deflect',
  SLASH: 'slash',
  THRUST: 'thrust',
  BLOCK: 'block',
  FEINT: 'feint',
});

/** 卡牌类型分类 */
export const CardType = Object.freeze({
  ATTACK: 'attack',
  DEFENSE: 'defense',
});

/** 游戏阶段 */
export const GamePhase = Object.freeze({
  SETUP: 'setup',
  INFO_SYNC: 'info_sync',
  PLAYER_PICK: 'player_pick',
  AI_PICK: 'ai_pick',
  DISTANCE_RESOLVE: 'distance_resolve',
  COMBAT_RESOLVE: 'combat_resolve',
  STATUS_RESOLVE: 'status_resolve',
  ROUND_END: 'round_end',
  GAME_OVER: 'game_over',
});

export function createPlayerState(weapon) {
  return {
    weapon,
    hp: 10,
    stance: 5,
    stamina: 4,
    staggered: false,
  };
}

export function createGameState(playerWeapon, aiWeapon, aiLevel) {
  return {
    distance: 2,
    round: 0,
    phase: GamePhase.SETUP,
    player: createPlayerState(playerWeapon),
    ai: createPlayerState(aiWeapon),
    aiLevel,
    aiName: null,
    aiTitle: null,
    history: [],
    log: [],
    gameOver: false,
    winner: null,
  };
}
