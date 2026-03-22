import { CombatCard, DistanceCard } from '../types.js';
import { initGame, executeRound } from './game-engine.js';
import { aiDecide } from '../ai/ai.js';
import { getAvailableCombatCards, getAvailableDistanceCards } from './card-validator.js';

const MAX_ROUNDS = 50;

/**
 * 翻转状态：把 AI 视角当作"玩家"来让 aiDecide 为其选牌
 */
export function flipState(state, playerAiLevel) {
  const s = JSON.parse(JSON.stringify(state));
  const tmp = s.player;
  s.player = s.ai;
  s.ai = tmp;
  s.aiLevel = playerAiLevel;
  s.history = s.history.map(h => ({
    round: h.round,
    playerDistance: h.aiDistance,
    playerCombat: h.aiCombat,
    aiDistance: h.playerDistance,
    aiCombat: h.playerCombat,
  }));
  return s;
}

/**
 * 验证 AI 选出的动作是否合法，不合法则随机回退
 */
export function getValidAction(action, playerState, distance) {
  const validCombat = getAvailableCombatCards(playerState, distance);
  const validDist = getAvailableDistanceCards(playerState, distance);

  let combat = action.combatCard;
  let dist = action.distanceCard;

  if (!combat || !validCombat.includes(combat)) {
    combat = validCombat.length > 0
      ? validCombat[Math.floor(Math.random() * validCombat.length)]
      : CombatCard.BLOCK;
  }
  if (!dist || !validDist.includes(dist)) {
    dist = validDist.length > 0
      ? validDist[Math.floor(Math.random() * validDist.length)]
      : DistanceCard.HOLD;
  }

  return { combatCard: combat, distanceCard: dist };
}

/**
 * 运行一局 AI vs AI 对战，返回胜者 'player'|'ai'|'draw'
 */
export function runOneGame(playerWeapon, aiWeapon, playerLevel, aiLevel) {
  let state = initGame(playerWeapon, aiWeapon, aiLevel);
  let rounds = 0;
  while (!state.gameOver && rounds < MAX_ROUNDS) {
    const rawAiAction = aiDecide(state);
    const flipped = flipState(state, playerLevel);
    const rawPlayerAction = aiDecide(flipped);

    const playerAction = getValidAction(rawPlayerAction, state.player, state.distance);
    const aiAction = getValidAction(rawAiAction, state.ai, state.distance);

    state = executeRound(state, playerAction, aiAction);
    rounds++;
  }
  return state.winner || 'draw';
}

/**
 * 运行全武器对阵模拟
 */
export function runSimulation(weapons, playerLevel, aiLevel, numGames) {
  const results = {};
  for (const w1 of weapons) {
    results[w1] = {};
    for (const w2 of weapons) {
      let wins = 0, losses = 0, draws = 0;
      for (let g = 0; g < numGames; g++) {
        const winner = runOneGame(w1, w2, playerLevel, aiLevel);
        if (winner === 'player') wins++;
        else if (winner === 'ai') losses++;
        else draws++;
      }
      results[w1][w2] = { wins, losses, draws };
    }
  }
  return results;
}
