import { GamePhase, DistanceCard, CardType, createGameState } from '../types.js';
import { gameConfig, WEAPON_ZONES, MAX_DISTANCE, MIN_DISTANCE, DISTANCE_CARD_BASE, COMBAT_CARD_BASE, CARD_TYPE_MAP } from '../constants.js';
import { resolveDistance } from './distance.js';
import { resolveCombat, resolveOneSided } from './combat.js';
import { canThrustBreakDodge, dodgeCounterDamage, calcAttackStance, getDodgeCostReduction } from './weapon.js';

export function initGame(playerWeapon, aiWeapon, aiLevel) {
  const state = createGameState(playerWeapon, aiWeapon, aiLevel);
  state.phase = GamePhase.INFO_SYNC;
  return state;
}

export function executeRound(state, playerAction, aiAction) {
  let s = JSON.parse(JSON.stringify(state));
  s.round += 1;
  s.log = [];

  s.log.push(`══════ 第 ${s.round} 回合 ══════`);

  s.player.staggered = false;
  s.ai.staggered = false;

  // 记录本回合身法卡供体力回复判断使用
  s._lastPDist = playerAction.distanceCard;
  s._lastADist = aiAction.distanceCard;

  s = stepDistanceResolve(s, playerAction.distanceCard, aiAction.distanceCard);
  s = stepCombatResolve(s, playerAction.combatCard, aiAction.combatCard);
  s = stepStatusResolve(s);
  s = stepRoundEnd(s);

  s.history.push({
    round: s.round,
    playerDistance: playerAction.distanceCard,
    playerCombat: playerAction.combatCard,
    aiDistance: aiAction.distanceCard,
    aiCombat: aiAction.combatCard,
    pMoveInterrupted: s._pInterrupted || false,
    aMoveInterrupted: s._aInterrupted || false,
  });
  delete s._pInterrupted;
  delete s._aInterrupted;

  return s;
}

function stepDistanceResolve(s, pDist, aDist) {
  const oldDist = s.distance;

  // 闪避：身法层，delta=0，不产生移动
  s._pDodging = pDist === DistanceCard.DODGE;
  s._aDodging = aDist === DistanceCard.DODGE;

  // 记录移动方向，供后续打断判定使用
  s._pMoveDelta = DISTANCE_CARD_BASE[pDist].delta;
  s._aMoveDelta = DISTANCE_CARD_BASE[aDist].delta;

  s.distance = resolveDistance(oldDist, pDist, aDist);

  // 体力消耗：冲步/撤步/闪避各耗2点（短刀/双刺闪避减1）
  let pCost = DISTANCE_CARD_BASE[pDist]?.cost ?? 0;
  let aCost = DISTANCE_CARD_BASE[aDist]?.cost ?? 0;
  if (pDist === DistanceCard.DODGE) pCost = Math.max(0, pCost - getDodgeCostReduction(s.player.weapon));
  if (aDist === DistanceCard.DODGE) aCost = Math.max(0, aCost - getDodgeCostReduction(s.ai.weapon));
  s.player.stamina = Math.max(0, s.player.stamina - pCost);
  s.ai.stamina = Math.max(0, s.ai.stamina - aCost);
  if (pCost > 0) s.log.push(`玩家身法消耗：-${pCost}体力`);
  if (aCost > 0) s.log.push(`AI身法消耗：-${aCost}体力`);

  s.log.push(`间距变化：${oldDist} → ${s.distance}`);
  return s;
}

function stepCombatResolve(s, pCombat, aCombat) {
  // ═══════ 闪避结算（身法层判定，在攻防结算前处理）═══════
  const pDodging = s._pDodging;
  const aDodging = s._aDodging;
  let pDodgeSuccess = false, aDodgeSuccess = false;
  let pCascade = false, aCascade = false;
  let pDodgeDmgToPlayer = 0, aDodgeDmgToAi = 0; // 闪避反击造成的直接伤害追踪

  // 同时判定双方闪避结果（基于原始攻防卡）
  if (pDodging) {
    if (aCombat === 'feint') {
      // 擒拿穿透闪避：擒拿不被闪避规避，闪避落空
      s.log.push('🎭 AI擒拿穿透闪避！玩家闪避落空');
    } else if (aCombat && CARD_TYPE_MAP[aCombat] === CardType.ATTACK) {
      if (aCombat === 'thrust' && canThrustBreakDodge(s.ai.weapon, s.distance)) {
        pCascade = true;
        s.log.push('⚡ 玩家闪避被AI轻击打断(优势区)！攻防卡取消');
      } else {
        pDodgeSuccess = true;
        s.log.push('💨 玩家闪避成功！AI攻击无效');
        // 短刀闪避反击
        const counterDmg = dodgeCounterDamage(s.player.weapon, s.distance);
        if (counterDmg > 0) {
          s.ai.hp -= counterDmg;
          aDodgeDmgToAi -= counterDmg;
          s.log.push(`🗡️ 闪避反击！AI受${counterDmg}伤`);
        }
        // 双刺闪避+2架势
        if (s.player.weapon === 'dual_stab') {
          s.ai.stance += 2;
          s.log.push('🥢 双刺闪避成功：AI+2架势');
        }
      }
    } else {
      s.log.push('💨 玩家闪避落空(对手无攻击)');
    }
  }

  if (aDodging) {
    if (pCombat === 'feint') {
      // 擒拿穿透闪避：擒拿不被闪避规避，闪避落空
      s.log.push('🎭 玩家擒拿穿透闪避！AI闪避落空');
    } else if (pCombat && CARD_TYPE_MAP[pCombat] === CardType.ATTACK) {
      if (pCombat === 'thrust' && canThrustBreakDodge(s.player.weapon, s.distance)) {
        aCascade = true;
        s.log.push('⚡ AI闪避被玩家轻击打断(优势区)！攻防卡取消');
      } else {
        aDodgeSuccess = true;
        s.log.push('💨 AI闪避成功！玩家攻击无效');
        const counterDmg = dodgeCounterDamage(s.ai.weapon, s.distance);
        if (counterDmg > 0) {
          s.player.hp -= counterDmg;
          pDodgeDmgToPlayer -= counterDmg;
          s.log.push(`🗡️ 闪避反击！玩家受${counterDmg}伤`);
        }
        if (s.ai.weapon === 'dual_stab') {
          s.player.stance += 2;
          s.log.push('🥢 双刺闪避成功：玩家+2架势');
        }
      }
    } else {
      s.log.push('💨 AI闪避落空(对手无攻击)');
    }
  }

  // 确定有效攻防卡
  let effectiveP = pCascade ? null : pCombat;
  let effectiveA = aCascade ? null : aCombat;
  if (pDodgeSuccess) effectiveA = null; // 闪避成功→对手攻击无效
  if (aDodgeSuccess) effectiveP = null;

  // ═══════ 攻防结算 ═══════
  let effects;
  if (effectiveP && effectiveA) {
    effects = resolveCombat(s, effectiveP, effectiveA);
  } else if (effectiveP && !effectiveA) {
    effects = resolveOneSided(s, 'player', effectiveP);
  } else if (!effectiveP && effectiveA) {
    effects = resolveOneSided(s, 'ai', effectiveA);
  } else {
    // 双方卡牌都被取消
    effects = { player: { hpChange: 0, stanceChange: 0, staggered: false },
                ai: { hpChange: 0, stanceChange: 0, staggered: false },
                distancePush: 0, log: ['双方攻防均被取消'] };
  }

  s.player.hp += effects.player.hpChange;
  s.ai.hp += effects.ai.hpChange;
  s.player.stance += effects.player.stanceChange;
  s.ai.stance += effects.ai.stanceChange;

  if (effects.player.staggered) s.player.staggered = true;
  if (effects.ai.staggered) s.ai.staggered = true;

  // 双刺贴身命中加成：距离0时，卡牌生效则额外+1架势
  if (s.distance === 0) {
    if (s.player.weapon === 'dual_stab' &&
        (effects.ai.hpChange < 0 || effects.ai.stanceChange > 0 || effects.ai.staggered)) {
      s.ai.stance += 1;
      s.log.push('🥢 双刺贴身命中：AI额外+1架势');
    }
    if (s.ai.weapon === 'dual_stab' &&
        (effects.player.hpChange < 0 || effects.player.stanceChange > 0 || effects.player.staggered)) {
      s.player.stance += 1;
      s.log.push('🥢 双刺贴身命中：玩家额外+1架势');
    }
  }

  // 双刺追击：贴身轻击命中（造成伤害）时追加1点伤害
  if (s.distance === 0) {
    if (s.player.weapon === 'dual_stab' && effectiveP === 'thrust' && effects.ai.hpChange < 0) {
      s.ai.hp -= 1;
      s.log.push('🥢 双刺追击：贴身轻击二连，AI额外受1伤');
    }
    if (s.ai.weapon === 'dual_stab' && effectiveA === 'thrust' && effects.player.hpChange < 0) {
      s.player.hp -= 1;
      s.log.push('🥢 双刺追击：贴身轻击二连，玩家额外受1伤');
    }
  }

  if (effects.distancePush !== 0) {
    const oldDist = s.distance;
    s.distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, s.distance + effects.distancePush));
    if (s.distance !== oldDist) {
      s.log.push(`间距被推动：${oldDist} → ${s.distance}`);
    }
  }

  s.log.push(...effects.log);

  // 攻击打断身法：移动中遭到攻击命中，移动取消
  // 包括闪避反击造成的直接伤害和攻防结算造成的伤害
  const pTotalHpLoss = effects.player.hpChange + (pDodgeDmgToPlayer ?? 0);
  const aTotalHpLoss = effects.ai.hpChange + (aDodgeDmgToAi ?? 0);
  s._pInterrupted = false;
  s._aInterrupted = false;
  if ((s._pMoveDelta ?? 0) !== 0 && pTotalHpLoss < 0) {
    s.distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, s.distance - s._pMoveDelta));
    s._pInterrupted = true;
    s.log.push('⚡ 玩家身法被打断！攻击命中，移动未完成');
  }
  if ((s._aMoveDelta ?? 0) !== 0 && aTotalHpLoss < 0) {
    s.distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, s.distance - s._aMoveDelta));
    s._aInterrupted = true;
    s.log.push('⚡ AI身法被打断！攻击命中，移动未完成');
  }
  delete s._pMoveDelta;
  delete s._aMoveDelta;
  delete s._pDodging;
  delete s._aDodging;

  return s;
}

function stepStatusResolve(s) {
  const MAX_STANCE = gameConfig.MAX_STANCE;
  const EXECUTION_DAMAGE = gameConfig.EXECUTION_DAMAGE;

  s.player.stance = Math.max(0, s.player.stance);
  s.ai.stance = Math.max(0, s.ai.stance);

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

  s.player.hp = Math.max(0, s.player.hp);
  s.ai.hp = Math.max(0, s.ai.hp);

  return s;
}

function stepRoundEnd(s) {
  const MAX_STAMINA = gameConfig.MAX_STAMINA;
  const RECOVERY = gameConfig.STAMINA_RECOVERY;

  // 体力恢复：每回合+1，扎马额外+1（共+2）
  const pLastDist = s.history.length > 0 ? s.history[s.history.length - 1].playerDistance : null;
  const aLastDist = s.history.length > 0 ? s.history[s.history.length - 1].aiDistance : null;
  // 注意: 历史尚未 push，当前回合的身法卡在当前回合未入历史，通过参数传入
  const pHold = s._lastPDist === 'hold';
  const aHold = s._lastADist === 'hold';
  const pRecov = pHold ? RECOVERY + 1 : RECOVERY;
  const aRecov = aHold ? RECOVERY + 1 : RECOVERY;

  s.player.stamina = Math.min(MAX_STAMINA, s.player.stamina + pRecov);
  s.ai.stamina = Math.min(MAX_STAMINA, s.ai.stamina + aRecov);

  // 清除临时身法卡记录
  delete s._lastPDist;
  delete s._lastADist;

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
