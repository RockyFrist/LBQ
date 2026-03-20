import { GamePhase, createGameState } from '../types.js';
import { gameConfig, WEAPON_ZONES, MAX_DISTANCE, MIN_DISTANCE } from '../constants.js';
import { resolveDistance, getDistanceCardCost } from './distance.js';
import { getCombatCardCost } from './card-validator.js';
import { resolveCombat } from './combat.js';

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

  s = stepDistanceResolve(s, playerAction.distanceCard, aiAction.distanceCard);
  s = stepCombatResolve(s, playerAction.combatCard, aiAction.combatCard);
  s = stepStatusResolve(s);

  const pStaminaAfterCost = s.player.stamina;
  const aStaminaAfterCost = s.ai.stamina;

  s = stepRecoverStamina(s);
  s = stepRoundEnd(s);

  s.history.push({
    round: s.round,
    playerDistance: playerAction.distanceCard,
    playerCombat: playerAction.combatCard,
    aiDistance: aiAction.distanceCard,
    aiCombat: aiAction.combatCard,
    pStaminaAfterCost,
    aStaminaAfterCost,
  });

  return s;
}

function stepRecoverStamina(s) {
  const MAX_STAMINA = gameConfig.MAX_STAMINA;
  const STAMINA_RECOVERY = gameConfig.STAMINA_RECOVERY;
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

function stepDistanceResolve(s, pDist, aDist) {
  const oldDist = s.distance;
  s.distance = resolveDistance(oldDist, pDist, aDist);

  const pStreak = s.player.distanceCardStreak.card === pDist ? s.player.distanceCardStreak.count : 0;
  const aStreak = s.ai.distanceCardStreak.card === aDist ? s.ai.distanceCardStreak.count : 0;

  const pCost = getDistanceCardCost(pDist, pStreak, s.player.weapon, oldDist, WEAPON_ZONES);
  const aCost = getDistanceCardCost(aDist, aStreak, s.ai.weapon, oldDist, WEAPON_ZONES);

  s.player.stamina -= pCost;
  s.ai.stamina -= aCost;

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

  s.log.push(`间距变化：${oldDist} → ${s.distance}`);
  return s;
}

function stepCombatResolve(s, pCombat, aCombat) {
  const pStreak = s.player.combatCardStreak.card === pCombat ? s.player.combatCardStreak.count : 0;
  const aStreak = s.ai.combatCardStreak.card === aCombat ? s.ai.combatCardStreak.count : 0;

  const pCost = getCombatCardCost(pCombat, pStreak, s.player.weapon, s.distance);
  const aCost = getCombatCardCost(aCombat, aStreak, s.ai.weapon, s.distance);

  s.player.stamina -= pCost;
  s.ai.stamina -= aCost;

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

  const effects = resolveCombat(s, pCombat, aCombat);

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

  if (effects.distancePush !== 0) {
    const oldDist = s.distance;
    s.distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, s.distance + effects.distancePush));
    if (s.distance !== oldDist) {
      s.log.push(`间距被推动：${oldDist} → ${s.distance}`);
    }
  }

  s.log.push(...effects.log);
  return s;
}

function stepStatusResolve(s) {
  const MAX_STANCE = gameConfig.MAX_STANCE;
  const EXECUTION_DAMAGE = gameConfig.EXECUTION_DAMAGE;

  s.player.stance = Math.max(0, s.player.stance);
  s.ai.stance = Math.max(0, s.ai.stance);

  s.player.stamina = Math.max(0, s.player.stamina);
  s.ai.stamina = Math.max(0, s.ai.stamina);

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
