/**
 * 双刺武器诊断测试
 * 运行: node test-dual-stab.js
 * 检测 dual_stab vs sword/staff 的 0% 胜率问题
 */

import { WeaponType, CombatCard, DistanceCard, CardType } from './src/types.js';
import { gameConfig, WEAPON_ZONES, CARD_TYPE_MAP, WEAPON_NAMES } from './src/constants.js';
import { initGame, executeRound } from './src/engine/game-engine.js';
import { aiDecide } from './src/ai/ai.js';
import { getAvailableCombatCards, getAvailableDistanceCards } from './src/engine/card-validator.js';
import { getDisabledCards } from './src/engine/weapon.js';

const MAX_ROUNDS = 50;
let totalErrors = 0;
let totalWarnings = 0;

function log(msg) { console.log(msg); }
function err(msg) { console.error(`❌ ERROR: ${msg}`); totalErrors++; }
function warn(msg) { console.warn(`⚠ WARN: ${msg}`); totalWarnings++; }
function pass(msg) { console.log(`✅ ${msg}`); }

// ─── 从 simulator.js 复制的核心函数 ───

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
  const MAX_STAMINA = gameConfig.MAX_STAMINA;
  const STAMINA_RECOVERY = gameConfig.STAMINA_RECOVERY;
  const projected = { ...playerState, stamina: Math.min(MAX_STAMINA, playerState.stamina + STAMINA_RECOVERY) };
  const validCombat = getAvailableCombatCards(projected, distance);
  const validDist = getAvailableDistanceCards(projected, distance);

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

// ─── 测试 1: 可用卡牌检查 ───

function testAvailableCards() {
  log('\n══════ 测试1: 双刺各距离可用卡牌 ══════');

  for (let dist = 0; dist <= 3; dist++) {
    const playerState = {
      weapon: WeaponType.DUAL_STAB,
      hp: 10, stamina: 8, stance: 0,
      staggered: false,
      combatCardStreak: { card: null, count: 0 },
      distanceCardStreak: { card: null, count: 0 },
    };
    const combat = getAvailableCombatCards(playerState, dist);
    const distance = getAvailableDistanceCards(playerState, dist);
    const disabled = getDisabledCards(WeaponType.DUAL_STAB, dist);

    log(`  距离${dist}: 禁用${JSON.stringify(disabled)} 可用战斗${JSON.stringify(combat)} 距离${JSON.stringify(distance)}`);

    if (combat.length === 0) err(`距离${dist}时双刺无可用战斗卡!`);
    if (distance.length === 0) err(`距离${dist}时双刺无可用距离卡!`);

    // 被眩晕时
    playerState.staggered = true;
    const combatStaggered = getAvailableCombatCards(playerState, dist);
    log(`  距离${dist}(僵直): 可用战斗${JSON.stringify(combatStaggered)}`);
    if (combatStaggered.length === 0) err(`距离${dist}僵直时双刺无可用战斗卡!`);
  }

  // 低体力情况
  for (let stamina = 0; stamina <= 3; stamina++) {
    const playerState = {
      weapon: WeaponType.DUAL_STAB,
      hp: 10, stamina, stance: 0,
      staggered: false,
      combatCardStreak: { card: null, count: 0 },
      distanceCardStreak: { card: null, count: 0 },
    };
    const combat = getAvailableCombatCards(playerState, 2);
    log(`  距离2 体力${stamina}: 可用${JSON.stringify(combat)}`);
    if (combat.length === 0) warn(`距离2体力${stamina}时双刺无可用战斗卡`);
  }

  pass('可用卡牌检查完成');
}

// ─── 测试 2: 单局详细追踪 ───

function runDetailedGame(playerWeapon, aiWeapon, playerLevel, aiLevel, verbose) {
  let state;
  try {
    state = initGame(playerWeapon, aiWeapon, aiLevel);
  } catch (e) {
    err(`initGame 异常: ${e.message}`);
    return { winner: 'error', rounds: 0, errors: [e.message], replacements: 0 };
  }

  let rounds = 0;
  const errors = [];
  let replacements = 0;

  while (!state.gameOver && rounds < MAX_ROUNDS) {
    let rawAiAction, rawPlayerAction, flipped;

    try {
      rawAiAction = aiDecide(state);
    } catch (e) {
      err(`aiDecide(state) 异常 round ${rounds + 1}: ${e.message}`);
      errors.push(`aiDecide(state): ${e.message}`);
      break;
    }

    try {
      flipped = flipState(state, playerLevel);
      rawPlayerAction = aiDecide(flipped);
    } catch (e) {
      err(`aiDecide(flipped) 异常 round ${rounds + 1}: ${e.message}`);
      errors.push(`aiDecide(flipped): ${e.message}`);
      break;
    }

    // 验证 AI 返回的原始卡牌
    if (!rawPlayerAction.combatCard) {
      warn(`Round ${rounds + 1}: Player AI 返回 combatCard=undefined`);
    }
    if (!rawPlayerAction.distanceCard) {
      warn(`Round ${rounds + 1}: Player AI 返回 distanceCard=undefined`);
    }
    if (!rawAiAction.combatCard) {
      warn(`Round ${rounds + 1}: AI 返回 combatCard=undefined`);
    }
    if (!rawAiAction.distanceCard) {
      warn(`Round ${rounds + 1}: AI 返回 distanceCard=undefined`);
    }

    const playerAction = getValidAction(rawPlayerAction, state.player, state.distance);
    const aiAction = getValidAction(rawAiAction, state.ai, state.distance);

    const pReplaced = rawPlayerAction.combatCard !== playerAction.combatCard;
    const aReplaced = rawAiAction.combatCard !== aiAction.combatCard;
    if (pReplaced) replacements++;
    if (aReplaced) replacements++;

    if (verbose) {
      const pMark = pReplaced ? ` [被替换: ${rawPlayerAction.combatCard}→${playerAction.combatCard}]` : '';
      const aMark = aReplaced ? ` [被替换: ${rawAiAction.combatCard}→${aiAction.combatCard}]` : '';
      log(`  R${rounds + 1} dist=${state.distance} | P(${state.player.weapon}): hp=${state.player.hp} st=${state.player.stamina} stn=${state.player.stance}${state.player.staggered ? ' 僵直' : ''} → ${playerAction.distanceCard}+${playerAction.combatCard}${pMark}`);
      log(`         | A(${state.ai.weapon}): hp=${state.ai.hp} st=${state.ai.stamina} stn=${state.ai.stance}${state.ai.staggered ? ' 僵直' : ''} → ${aiAction.distanceCard}+${aiAction.combatCard}${aMark}`);
    }

    try {
      state = executeRound(state, playerAction, aiAction);
    } catch (e) {
      err(`executeRound 异常 round ${rounds + 1}: ${e.message}\n${e.stack}`);
      errors.push(`executeRound: ${e.message}`);
      break;
    }

    rounds++;

    // 异常检测
    if (state.player.stamina < 0) {
      warn(`Round ${rounds}: Player 体力为负 ${state.player.stamina}`);
    }
    if (state.ai.stamina < 0) {
      warn(`Round ${rounds}: AI 体力为负 ${state.ai.stamina}`);
    }
  }

  if (rounds >= MAX_ROUNDS && !state.gameOver) {
    if (verbose) warn(`达到最大回合数 ${MAX_ROUNDS}，判平局`);
  }

  if (verbose) {
    log(`  结果: ${state.winner || 'draw'} (${rounds}回合, ${replacements}次卡牌替换)`);
  }

  return { winner: state.winner || 'draw', rounds, errors, replacements };
}

function testDetailedGames() {
  log('\n══════ 测试2: 详细单局追踪 (dual_stab vs sword) ══════');
  for (let i = 0; i < 3; i++) {
    log(`\n--- 第 ${i + 1} 局 ---`);
    runDetailedGame(WeaponType.DUAL_STAB, WeaponType.SWORD, 5, 5, true);
  }

  log('\n══════ 测试2b: 详细单局追踪 (dual_stab vs staff) ══════');
  for (let i = 0; i < 3; i++) {
    log(`\n--- 第 ${i + 1} 局 ---`);
    runDetailedGame(WeaponType.DUAL_STAB, WeaponType.STAFF, 5, 5, true);
  }

  pass('详细追踪完成');
}

// ─── 测试 3: 批量胜率统计 ───

function testWinRates() {
  log('\n══════ 测试3: 批量胜率统计 (100局) ══════');
  const NUM_GAMES = 100;

  const matchups = [
    [WeaponType.DUAL_STAB, WeaponType.SHORT_BLADE],
    [WeaponType.DUAL_STAB, WeaponType.SPEAR],
    [WeaponType.DUAL_STAB, WeaponType.SWORD],
    [WeaponType.DUAL_STAB, WeaponType.STAFF],
    [WeaponType.DUAL_STAB, WeaponType.GREAT_BLADE],
    [WeaponType.DUAL_STAB, WeaponType.DUAL_STAB],
    [WeaponType.SWORD, WeaponType.DUAL_STAB],
    [WeaponType.STAFF, WeaponType.DUAL_STAB],
  ];

  for (const [w1, w2] of matchups) {
    let wins = 0, losses = 0, draws = 0;
    let totalReplacements = 0;
    let errorGames = 0;

    for (let g = 0; g < NUM_GAMES; g++) {
      const result = runDetailedGame(w1, w2, 5, 5, false);
      if (result.errors.length > 0) errorGames++;
      totalReplacements += result.replacements;
      if (result.winner === 'player') wins++;
      else if (result.winner === 'ai') losses++;
      else draws++;
    }

    const winRate = wins;
    const tag = (w1 === WeaponType.DUAL_STAB && (w2 === WeaponType.SWORD || w2 === WeaponType.STAFF))
      ? (winRate === 0 ? ' ❌ 0%胜率!' : winRate < 10 ? ' ⚠ 极低胜率' : '')
      : '';

    log(`  ${WEAPON_NAMES[w1]} vs ${WEAPON_NAMES[w2]}: ${wins}W ${losses}L ${draws}D (${winRate}%)  替换${totalReplacements}次 错误${errorGames}局${tag}`);
  }

  pass('批量统计完成');
}

// ─── 测试 4: getValidAction 正确性 ───

function testGetValidAction() {
  log('\n══════ 测试4: getValidAction 正确性验证 ══════');

  // 场景: dual_stab 距离2, 被 flipState 后 AI 给出的卡
  const state = initGame(WeaponType.DUAL_STAB, WeaponType.SWORD, 5);
  const flipped = flipState(state, 5);

  // 模拟 AI 为 dual_stab 返回 SLASH (在距离2应被禁用)
  const badAction = { combatCard: CombatCard.SLASH, distanceCard: DistanceCard.HOLD };
  const fixed = getValidAction(badAction, state.player, state.distance);

  if (fixed.combatCard === CombatCard.SLASH) {
    err('getValidAction 未过滤距离2的双刺 SLASH!');
  } else {
    pass(`getValidAction 正确替换了 SLASH → ${fixed.combatCard}`);
  }

  // 场景: dual_stab 距离2, DEFLECT 也应被禁
  const badAction2 = { combatCard: CombatCard.DEFLECT, distanceCard: DistanceCard.HOLD };
  const fixed2 = getValidAction(badAction2, state.player, state.distance);

  if (fixed2.combatCard === CombatCard.DEFLECT) {
    err('getValidAction 未过滤距离2的双刺 DEFLECT!');
  } else {
    pass(`getValidAction 正确替换了 DEFLECT → ${fixed2.combatCard}`);
  }

  // 场景: 正常卡应该不被替换
  const goodAction = { combatCard: CombatCard.THRUST, distanceCard: DistanceCard.ADVANCE };
  const kept = getValidAction(goodAction, state.player, state.distance);
  if (kept.combatCard !== CombatCard.THRUST) {
    err(`getValidAction 错误地替换了合法卡 THRUST → ${kept.combatCard}`);
  } else {
    pass('getValidAction 保留了合法的 THRUST');
  }

  // 场景: AI 返回 undefined
  const nullAction = { combatCard: undefined, distanceCard: undefined };
  const rescued = getValidAction(nullAction, state.player, state.distance);
  if (!rescued.combatCard || !rescued.distanceCard) {
    err(`getValidAction 未能修复 undefined 卡: combat=${rescued.combatCard} dist=${rescued.distanceCard}`);
  } else {
    pass(`getValidAction 修复了 undefined → combat=${rescued.combatCard} dist=${rescued.distanceCard}`);
  }

  pass('getValidAction 测试完成');
}

// ─── 测试 5: flipState + aiDecide 一致性 ───

function testFlipStateConsistency() {
  log('\n══════ 测试5: flipState + aiDecide 一致性 ══════');

  const state = initGame(WeaponType.DUAL_STAB, WeaponType.SWORD, 5);
  const flipped = flipState(state, 5);

  // 验证 flip 后角色正确
  if (flipped.ai.weapon !== WeaponType.DUAL_STAB) {
    err(`flip 后 ai.weapon 应为 dual_stab, 实际为 ${flipped.ai.weapon}`);
  } else {
    pass('flip 后 ai.weapon = dual_stab 正确');
  }

  if (flipped.player.weapon !== WeaponType.SWORD) {
    err(`flip 后 player.weapon 应为 sword, 实际为 ${flipped.player.weapon}`);
  } else {
    pass('flip 后 player.weapon = sword 正确');
  }

  // aiDecide(flipped) 应为 dual_stab 决策
  const action = aiDecide(flipped);
  log(`  aiDecide(flipped) 返回: combat=${action.combatCard} dist=${action.distanceCard}`);

  // 在距离2, dual_stab 不应选 SLASH/DEFLECT
  const disabled = getDisabledCards(WeaponType.DUAL_STAB, state.distance);
  if (disabled.includes(action.combatCard)) {
    warn(`AI 为 dual_stab 在距离${state.distance}选了禁用卡 ${action.combatCard} (getValidAction 会修复)`);
  }

  pass('flipState 一致性测试完成');
}

// ─── 测试 6: 距离控制检测 ───

function testDistanceControl() {
  log('\n══════ 测试6: 距离控制统计 ══════');

  // 跑10局 dual_stab vs sword, 统计距离分布
  const distCounts = [0, 0, 0, 0]; // dist 0-3
  let totalRounds = 0;

  for (let g = 0; g < 10; g++) {
    let state = initGame(WeaponType.DUAL_STAB, WeaponType.SWORD, 5);
    let rounds = 0;
    while (!state.gameOver && rounds < MAX_ROUNDS) {
      const rawAiAction = aiDecide(state);
      const flipped = flipState(state, 5);
      const rawPlayerAction = aiDecide(flipped);
      const playerAction = getValidAction(rawPlayerAction, state.player, state.distance);
      const aiAction = getValidAction(rawAiAction, state.ai, state.distance);

      distCounts[state.distance]++;
      totalRounds++;

      state = executeRound(state, playerAction, aiAction);
      rounds++;
    }
  }

  log(`  距离分布(${totalRounds}回合): 距离0=${distCounts[0]}(${(distCounts[0]/totalRounds*100).toFixed(1)}%) 距离1=${distCounts[1]}(${(distCounts[1]/totalRounds*100).toFixed(1)}%) 距离2=${distCounts[2]}(${(distCounts[2]/totalRounds*100).toFixed(1)}%) 距离3=${distCounts[3]}(${(distCounts[3]/totalRounds*100).toFixed(1)}%)`);

  if (distCounts[0] === 0) {
    warn('双刺从未到达距离0(优势区)! 距离控制可能有问题');
  }

  pass('距离控制统计完成');
}

// ─── 运行所有测试 ───

console.log('╔══════════════════════════════════════╗');
console.log('║   冷刃博弈 - 双刺武器诊断测试       ║');
console.log('╚══════════════════════════════════════╝');

try {
  testAvailableCards();
  testGetValidAction();
  testFlipStateConsistency();
  testDetailedGames();
  testDistanceControl();
  testWinRates();
} catch (e) {
  err(`测试运行异常: ${e.message}\n${e.stack}`);
}

console.log('\n══════════════════════════════════════');
console.log(`测试完成: ${totalErrors} 个错误, ${totalWarnings} 个警告`);
if (totalErrors > 0) {
  console.log('❌ 存在错误，需要修复！');
  process.exit(1);
} else {
  console.log('✅ 所有测试通过');
  process.exit(0);
}
