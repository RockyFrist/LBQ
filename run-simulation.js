/**
 * 冷刃博弈 - 1000局全武器对战模拟
 * 运行: node run-simulation.js
 */

import { WeaponType, CombatCard, DistanceCard } from './src/types.js';
import { WEAPON_NAMES, gameConfig } from './src/constants.js';
import { initGame, executeRound } from './src/engine/game-engine.js';
import { aiDecide } from './src/ai/ai.js';
import { getAvailableCombatCards, getAvailableDistanceCards } from './src/engine/card-validator.js';

const ALL_WEAPONS = Object.values(WeaponType);
const MAX_ROUNDS = 50;
const NUM_GAMES = 1000;
const AI_LEVEL = 5; // 高级策略 vs 高级策略

function flipState(state, playerAiLevel) {
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

function getValidAction(action, playerState, distance) {
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

function runOneGame(playerWeapon, aiWeapon) {
  let state = initGame(playerWeapon, aiWeapon, AI_LEVEL);
  let rounds = 0;
  while (!state.gameOver && rounds < MAX_ROUNDS) {
    const rawAiAction = aiDecide(state);
    const flipped = flipState(state, AI_LEVEL);
    const rawPlayerAction = aiDecide(flipped);
    const playerAction = getValidAction(rawPlayerAction, state.player, state.distance);
    const aiAction = getValidAction(rawAiAction, state.ai, state.distance);
    state = executeRound(state, playerAction, aiAction);
    rounds++;
  }
  return { winner: state.winner || 'draw', rounds };
}

console.log(`\n═══════════════════════════════════════════`);
console.log(`  冷刃博弈 · 全武器对战模拟 (${NUM_GAMES}局/组)`);
console.log(`  AI等级: ${AI_LEVEL} vs ${AI_LEVEL}`);
console.log(`═══════════════════════════════════════════\n`);

const results = {};
const weaponStats = {};

for (const w of ALL_WEAPONS) {
  weaponStats[w] = { totalWins: 0, totalLosses: 0, totalDraws: 0, totalGames: 0 };
}

for (const w1 of ALL_WEAPONS) {
  results[w1] = {};
  for (const w2 of ALL_WEAPONS) {
    let wins = 0, losses = 0, draws = 0, totalRounds = 0;
    for (let g = 0; g < NUM_GAMES; g++) {
      const r = runOneGame(w1, w2);
      if (r.winner === 'player') wins++;
      else if (r.winner === 'ai') losses++;
      else draws++;
      totalRounds += r.rounds;
    }
    results[w1][w2] = { wins, losses, draws, avgRounds: (totalRounds / NUM_GAMES).toFixed(1) };
    
    weaponStats[w1].totalWins += wins;
    weaponStats[w1].totalLosses += losses;
    weaponStats[w1].totalDraws += draws;
    weaponStats[w1].totalGames += NUM_GAMES;
    
    if (w1 !== w2) {
      weaponStats[w2].totalWins += losses;
      weaponStats[w2].totalLosses += wins;
      weaponStats[w2].totalDraws += draws;
      weaponStats[w2].totalGames += NUM_GAMES;
    }
  }
}

// Print win rate matrix
const nameMap = {};
for (const w of ALL_WEAPONS) nameMap[w] = WEAPON_NAMES[w];

console.log('【胜率矩阵】行 = 左侧武器(player), 列 = 右侧武器(ai), 数字=左侧胜率%\n');

const header = '        ' + ALL_WEAPONS.map(w => nameMap[w].padStart(6)).join(' ');
console.log(header);
console.log('─'.repeat(header.length));

for (const w1 of ALL_WEAPONS) {
  const row = ALL_WEAPONS.map(w2 => {
    const r = results[w1][w2];
    const wr = ((r.wins / NUM_GAMES) * 100).toFixed(1);
    return wr.padStart(6);
  }).join(' ');
  console.log(`${nameMap[w1].padEnd(6)} ${row}`);
}

// Print overall stats
console.log('\n\n【武器总胜率排名】(镜像对称: A打B计入双方)');
console.log('─'.repeat(60));

const rankings = ALL_WEAPONS.map(w => {
  const s = weaponStats[w];
  const wr = ((s.totalWins / s.totalGames) * 100).toFixed(1);
  return { weapon: w, name: nameMap[w], winRate: parseFloat(wr), ...s };
}).sort((a, b) => b.winRate - a.winRate);

for (const r of rankings) {
  const bar = '█'.repeat(Math.round(r.winRate / 2));
  console.log(`${r.name.padEnd(6)} ${String(r.winRate).padStart(5)}% ${bar}  (胜${r.totalWins} 负${r.totalLosses} 平${r.totalDraws})`);
}

// Print draws analysis
console.log('\n\n【平局分析】');
let totalDraws = 0;
let totalAllGames = 0;
for (const w1 of ALL_WEAPONS) {
  for (const w2 of ALL_WEAPONS) {
    totalDraws += results[w1][w2].draws;
    totalAllGames += NUM_GAMES;
  }
}
console.log(`总平局率: ${((totalDraws / totalAllGames) * 100).toFixed(1)}%`);

// Print notable matchups
console.log('\n\n【值得关注的对局】(胜率偏差>15% 的非镜像对局)');
console.log('─'.repeat(60));
for (const w1 of ALL_WEAPONS) {
  for (const w2 of ALL_WEAPONS) {
    if (w1 >= w2) continue; // avoid duplicates
    const r = results[w1][w2];
    const wr = (r.wins / NUM_GAMES) * 100;
    if (Math.abs(wr - 50) > 15) {
      const favored = wr > 50 ? nameMap[w1] : nameMap[w2];
      const unfavored = wr > 50 ? nameMap[w2] : nameMap[w1];
      const actualWr = wr > 50 ? wr.toFixed(1) : (100 - wr).toFixed(1);
      console.log(`  ${favored} vs ${unfavored}: ${actualWr}% 胜率 (平均${r.avgRounds}回合)`);
    }
  }
}

// Print mirror match analysis
console.log('\n\n【镜像对局分析】(同武器对决,理想应接近50%)');
console.log('─'.repeat(60));
for (const w of ALL_WEAPONS) {
  const r = results[w][w];
  const wr = ((r.wins / NUM_GAMES) * 100).toFixed(1);
  const drawRate = ((r.draws / NUM_GAMES) * 100).toFixed(1);
  console.log(`  ${nameMap[w]}: player胜${wr}% 平${drawRate}% (平均${r.avgRounds}回合)`);
}

console.log('\n═══════════════════════════════════════════');
console.log('  模拟完成');
console.log('═══════════════════════════════════════════');
