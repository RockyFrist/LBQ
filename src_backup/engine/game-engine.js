;(function(LBQ) {

const { GamePhase, createGameState } = LBQ;
const { MAX_STAMINA, STAMINA_RECOVERY, MAX_STANCE, EXECUTION_DAMAGE, MAX_DISTANCE, MIN_DISTANCE, WEAPON_ZONES } = LBQ;
const { resolveDistance, getDistanceCardCost } = LBQ;
const { getCombatCardCost } = LBQ;
const { resolveCombat } = LBQ;

/**
 * 初始化新对局
 */
function initGame(playerWeapon, aiWeapon, aiLevel) {
  const state = createGameState(playerWeapon, aiWeapon, aiLevel);
  state.phase = GamePhase.INFO_SYNC;
  return state;
}

/**
 * 执行一个完整回合
 * @param {object} state - 当前 gameState（不会被修改）
 * @param {object} playerAction - { distanceCard, combatCard }
 * @param {object} aiAction - { distanceCard, combatCard }
 * @returns {object} 新的 gameState
 */
function executeRound(state, playerAction, aiAction) {
  // 深拷贝状态
  let s = JSON.parse(JSON.stringify(state));
  s.round += 1;
  s.log = [];

  s.log.push(`══════ 第 ${s.round} 回合 ══════`);

  // ① 信息同步 + 体力恢复
  s = stepRecoverStamina(s);

  // 清除上回合的僵直（选牌时已经用过了约束）
  s.player.staggered = false;
  s.ai.staggered = false;

  // ② ③ 双方出牌（已由参数传入）

  // ④ 距离结算
  s = stepDistanceResolve(s, playerAction.distanceCard, aiAction.distanceCard);

  // ⑤ 攻防结算
  s = stepCombatResolve(s, playerAction.combatCard, aiAction.combatCard);

  // ⑥ 状态结算：处决检查
  s = stepStatusResolve(s);

  // ⑦ 回合判定
  s = stepRoundEnd(s);

  // 记录历史
  s.history.push({
    round: s.round,
    playerDistance: playerAction.distanceCard,
    playerCombat: playerAction.combatCard,
    aiDistance: aiAction.distanceCard,
    aiCombat: aiAction.combatCard,
  });

  return s;
}

// ─── ① 体力恢复 ───
function stepRecoverStamina(s) {
  const pOld = s.player.stamina;
  const aOld = s.ai.stamina;
  s.player.stamina = Math.min(MAX_STAMINA, s.player.stamina + STAMINA_RECOVERY);
  s.ai.stamina = Math.min(MAX_STAMINA, s.ai.stamina + STAMINA_RECOVERY);
  if (s.player.stamina !== pOld) {
    s.log.push(`玩家体力恢复：${pOld} → ${s.player.stamina}`);
  }
  if (s.ai.stamina !== aOld) {
    s.log.push(`AI体力恢复：${aOld} → ${s.ai.stamina}`);
  }
  return s;
}

// ─── ④ 距离结算 ───
function stepDistanceResolve(s, pDist, aDist) {
  const oldDist = s.distance;
  s.distance = resolveDistance(oldDist, pDist, aDist);

  // 扣除距离卡消耗
  const pStreak = s.player.distanceCardStreak.card === pDist ? s.player.distanceCardStreak.count : 0;
  const aStreak = s.ai.distanceCardStreak.card === aDist ? s.ai.distanceCardStreak.count : 0;

  const pCost = getDistanceCardCost(pDist, pStreak, s.player.weapon, oldDist, WEAPON_ZONES);
  const aCost = getDistanceCardCost(aDist, aStreak, s.ai.weapon, oldDist, WEAPON_ZONES);

  s.player.stamina -= pCost;
  s.ai.stamina -= aCost;

  // 更新连续使用追踪
  if (s.player.distanceCardStreak.card === pDist) {
    s.player.distanceCardStreak.count += 1;
  } else {
    s.player.distanceCardStreak = { card: pDist, count: 1 };
  }
  if (s.ai.distanceCardStreak.card === aDist) {
    s.ai.distanceCardStreak.count += 1;
  } else {
    s.ai.distanceCardStreak = { card: aDist, count: 1 };
  }

  s.log.push(`距离变化：${oldDist} → ${s.distance}`);
  return s;
}

// ─── ⑤ 攻防结算 ───
function stepCombatResolve(s, pCombat, aCombat) {
  // 消耗基于新距离（距离结算后）
  const pStreak = s.player.combatCardStreak.card === pCombat ? s.player.combatCardStreak.count : 0;
  const aStreak = s.ai.combatCardStreak.card === aCombat ? s.ai.combatCardStreak.count : 0;

  const pCost = getCombatCardCost(pCombat, pStreak, s.player.weapon, s.distance);
  const aCost = getCombatCardCost(aCombat, aStreak, s.ai.weapon, s.distance);

  s.player.stamina -= pCost;
  s.ai.stamina -= aCost;

  // 更新连续使用追踪
  if (s.player.combatCardStreak.card === pCombat) {
    s.player.combatCardStreak.count += 1;
  } else {
    s.player.combatCardStreak = { card: pCombat, count: 1 };
  }
  if (s.ai.combatCardStreak.card === aCombat) {
    s.ai.combatCardStreak.count += 1;
  } else {
    s.ai.combatCardStreak = { card: aCombat, count: 1 };
  }

  // 结算交互矩阵
  const effects = resolveCombat(s, pCombat, aCombat);

  // 应用效果
  s.player.hp += effects.player.hpChange;
  s.ai.hp += effects.ai.hpChange;
  s.player.stance += effects.player.stanceChange;
  s.ai.stance += effects.ai.stanceChange;

  // 僵直标记（本回合新设置的）
  if (effects.player.staggered) s.player.staggered = true;
  if (effects.ai.staggered) s.ai.staggered = true;

  // 推距离
  if (effects.distancePush !== 0) {
    const oldDist = s.distance;
    s.distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, s.distance + effects.distancePush));
    if (s.distance !== oldDist) {
      s.log.push(`距离被推动：${oldDist} → ${s.distance}`);
    }
  }

  // 合并日志
  s.log.push(...effects.log);

  return s;
}

// ─── ⑥ 状态结算 ───
function stepStatusResolve(s) {
  // 架势值 clamp
  s.player.stance = Math.max(0, s.player.stance);
  s.ai.stance = Math.max(0, s.ai.stance);

  // 体力下限 clamp（防止负数导致下回合无卡可出）
  s.player.stamina = Math.max(0, s.player.stamina);
  s.ai.stamina = Math.max(0, s.ai.stamina);

  // 双刺贴身压迫光环：距离0时给对手+1架势
  if (s.distance === 0) {
    if (s.player.weapon === 'dual_stab') {
      s.ai.stance += 1;
      s.log.push('🥢 双刺贴身压迫：AI+1架势');
    }
    if (s.ai.weapon === 'dual_stab') {
      s.player.stance += 1;
      s.log.push('🥢 双刺贴身压迫：玩家+1架势');
    }
  }

  // 处决检查
  if (s.player.stance >= MAX_STANCE) {
    s.player.hp -= EXECUTION_DAMAGE;
    s.player.stance = 0;
    s.log.push(`⚔ 玩家被处决！-${EXECUTION_DAMAGE}气血`);
  }
  if (s.ai.stance >= MAX_STANCE) {
    s.ai.hp -= EXECUTION_DAMAGE;
    s.ai.stance = 0;
    s.log.push(`⚔ AI被处决！-${EXECUTION_DAMAGE}气血`);
  }

  // HP clamp
  s.player.hp = Math.max(0, s.player.hp);
  s.ai.hp = Math.max(0, s.ai.hp);

  return s;
}

// ─── ⑦ 回合判定 ───
function stepRoundEnd(s) {
  const pDead = s.player.hp <= 0;
  const aDead = s.ai.hp <= 0;

  if (pDead && aDead) {
    s.gameOver = true;
    s.winner = 'draw';
    s.phase = GamePhase.GAME_OVER;
    s.log.push('双方同时倒下——平局！');
  } else if (pDead) {
    s.gameOver = true;
    s.winner = 'ai';
    s.phase = GamePhase.GAME_OVER;
    s.log.push('玩家气血归零——AI胜利！');
  } else if (aDead) {
    s.gameOver = true;
    s.winner = 'player';
    s.phase = GamePhase.GAME_OVER;
    s.log.push('AI气血归零——玩家胜利！');
  } else {
    s.phase = GamePhase.INFO_SYNC;
  }

  return s;
}

Object.assign(LBQ, { initGame, executeRound });

})(window.LBQ);
