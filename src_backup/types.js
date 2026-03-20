window.LBQ = {};

;(function(LBQ) {

// ===== 枚举常量 =====

/** 兵器类型 */
const WeaponType = Object.freeze({
  SHORT_BLADE: 'short_blade',   // 短刀
  SPEAR: 'spear',               // 长枪
  SWORD: 'sword',               // 剑
  STAFF: 'staff',               // 棍
  GREAT_BLADE: 'great_blade',   // 长柄大刀
  DUAL_STAB: 'dual_stab',       // 双刺
});

/** 距离调整卡 */
const DistanceCard = Object.freeze({
  ADVANCE: 'advance',   // 靠近对手
  RETREAT: 'retreat',    // 远离对手
  HOLD: 'hold',          // 站稳
});

/** 攻防操作卡 */
const CombatCard = Object.freeze({
  DODGE: 'dodge',       // 闪避 (优先级 1)
  DEFLECT: 'deflect',   // 卸力 (优先级 2)
  SLASH: 'slash',       // 劈砍 (优先级 3)
  THRUST: 'thrust',     // 点刺 (优先级 4)
  BLOCK: 'block',       // 格挡 (优先级 5)
  FEINT: 'feint',       // 虚晃 (优先级 6)
});

/** 卡牌类型分类 */
const CardType = Object.freeze({
  ATTACK: 'attack',
  DEFENSE: 'defense',
});

/** 游戏阶段 */
const GamePhase = Object.freeze({
  SETUP: 'setup',               // 对局配置
  INFO_SYNC: 'info_sync',       // ① 信息同步
  PLAYER_PICK: 'player_pick',   // ② 玩家出牌
  AI_PICK: 'ai_pick',           // ③ AI出牌
  DISTANCE_RESOLVE: 'distance_resolve', // ④ 距离结算
  COMBAT_RESOLVE: 'combat_resolve',     // ⑤ 攻防结算
  STATUS_RESOLVE: 'status_resolve',     // ⑥ 状态结算
  ROUND_END: 'round_end',       // ⑦ 回合判定
  GAME_OVER: 'game_over',
});

/**
 * 创建玩家状态
 * @param {string} weapon - WeaponType 枚举值
 * @returns {PlayerState}
 */
function createPlayerState(weapon) {
  return {
    weapon,
    hp: 10,
    stamina: 8,
    stance: 0,
    staggered: false,  // 僵直
    // 连续使用追踪
    distanceCardStreak: { card: null, count: 0 },
    combatCardStreak: { card: null, count: 0 },
  };
}

/**
 * 创建游戏状态
 * @param {string} playerWeapon
 * @param {string} aiWeapon
 * @param {number} aiLevel
 * @returns {GameState}
 */
function createGameState(playerWeapon, aiWeapon, aiLevel) {
  return {
    distance: 2,  // 初始距离: 中距区
    round: 0,
    phase: GamePhase.SETUP,
    player: createPlayerState(playerWeapon),
    ai: createPlayerState(aiWeapon),
    aiLevel,
    history: [],  // {round, playerDistance, playerCombat, aiDistance, aiCombat, result}
    log: [],
    gameOver: false,
    winner: null, // 'player' | 'ai' | 'draw' | null
  };
}

Object.assign(LBQ, { WeaponType, DistanceCard, CombatCard, CardType, GamePhase, createPlayerState, createGameState });

})(window.LBQ);
