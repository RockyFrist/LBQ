import { WeaponType, CombatCard, DistanceCard } from './types.js';
import { WEAPON_NAMES, WEAPON_EMOJI, gameConfig } from './constants.js';
import { initGame, executeRound } from './engine/game-engine.js';
import { aiDecide } from './ai/ai.js';
import { getAvailableCombatCards, getAvailableDistanceCards } from './engine/card-validator.js';

const ALL_WEAPONS = Object.values(WeaponType);
const MAX_ROUNDS = 50;

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

function runOneGame(playerWeapon, aiWeapon, playerLevel, aiLevel) {
  let state = initGame(playerWeapon, aiWeapon, aiLevel);
  let rounds = 0;
  while (!state.gameOver && rounds < MAX_ROUNDS) {
    const rawAiAction = aiDecide(state);
    const flipped = flipState(state, playerLevel);
    const rawPlayerAction = aiDecide(flipped);

    // Validate: aiDecide may return invalid cards for the actual combatant
    const playerAction = getValidAction(rawPlayerAction, state.player, state.distance);
    const aiAction = getValidAction(rawAiAction, state.ai, state.distance);

    state = executeRound(state, playerAction, aiAction);
    rounds++;
  }
  return state.winner || 'draw';
}

function runSimulation(playerLevel, aiLevel, numGames) {
  const results = {};
  for (const w1 of ALL_WEAPONS) {
    results[w1] = {};
    for (const w2 of ALL_WEAPONS) {
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

export function showSimulationModal() {
  const old = document.getElementById('sim-modal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'sim-modal';
  modal.className = 'sim-modal-overlay';
  modal.innerHTML = `
    <div class="sim-modal-box">
      <div class="sim-header">
        <h2>📊 对战模拟系统</h2>
        <button class="sim-close" id="sim-close">✕</button>
      </div>
      <div class="sim-config">
        <div class="sim-row">
          <label>左侧(行) AI等级</label>
          <select id="sim-player-level">
            <option value="1">1 - 纯随机</option>
            <option value="2">2 - 基础规则</option>
            <option value="3">3 - 简单策略</option>
            <option value="4">4 - 普通策略</option>
            <option value="5" selected>5 - 高级策略</option>
            <option value="6">6 - 顶级高手</option>
          </select>
        </div>
        <div class="sim-row">
          <label>右侧(列) AI等级</label>
          <select id="sim-ai-level">
            <option value="1">1 - 纯随机</option>
            <option value="2">2 - 基础规则</option>
            <option value="3">3 - 简单策略</option>
            <option value="4">4 - 普通策略</option>
            <option value="5" selected>5 - 高级策略</option>
            <option value="6">6 - 顶级高手</option>
          </select>
        </div>
        <div class="sim-row">
          <label>每组对局数</label>
          <select id="sim-num-games">
            <option value="50">50 (快速)</option>
            <option value="100" selected>100 (标准)</option>
            <option value="500">500 (精确)</option>
            <option value="1000">1000 (超精确)</option>
          </select>
        </div>
        <button class="sim-run-btn" id="sim-run">▶ 开始模拟</button>
      </div>
      <div class="sim-results" id="sim-results">
        <p class="sim-hint">点击「开始模拟」运行AI对战模拟<br>行 = 左侧武器, 列 = 右侧武器<br>格内数字 = 左侧胜率%</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('sim-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.getElementById('sim-run').addEventListener('click', () => {
    const pLevel = parseInt(document.getElementById('sim-player-level').value);
    const aLevel = parseInt(document.getElementById('sim-ai-level').value);
    const numGames = parseInt(document.getElementById('sim-num-games').value);

    const resultsDiv = document.getElementById('sim-results');
    resultsDiv.innerHTML = '<p class="sim-loading">⏳ 模拟运行中…</p>';

    setTimeout(() => {
      const results = runSimulation(pLevel, aLevel, numGames);
      renderSimResults(resultsDiv, results, numGames, pLevel, aLevel);
    }, 50);
  });
}

function renderSimResults(container, results, numGames, pLevel, aLevel) {
  const weapons = ALL_WEAPONS;
  const emoji = WEAPON_EMOJI || {};
  const names = WEAPON_NAMES;

  let totalWins = 0, totalGames = 0;
  for (const w1 of weapons) {
    for (const w2 of weapons) {
      totalWins += results[w1][w2].wins;
      totalGames += numGames;
    }
  }
  const overallRate = (totalWins / totalGames * 100).toFixed(1);

  let html = `<div class="sim-summary">L${pLevel} vs L${aLevel} · 每组${numGames}局 · 左侧总胜率 <strong>${overallRate}%</strong></div>`;

  html += '<table class="sim-table"><thead><tr><th>左↓ \\ 右→</th>';
  for (const w of weapons) {
    html += `<th>${emoji[w] || ''} ${names[w].slice(0, 2)}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (const w1 of weapons) {
    html += `<tr><td class="sim-row-header">${emoji[w1] || ''} ${names[w1]}</td>`;
    for (const w2 of weapons) {
      const r = results[w1][w2];
      const winRate = Math.round(r.wins / numGames * 100);
      const cellClass = getCellClass(winRate);
      const tooltip = `胜${r.wins} 负${r.losses} 平${r.draws}`;
      html += `<td class="sim-cell ${cellClass}" title="${tooltip}">${winRate}%</td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table>';

  html += '<div class="sim-ranking"><strong>武器综合胜率排名：</strong>';
  const ranking = weapons.map(w => {
    let wWins = 0, wTotal = 0;
    for (const w2 of weapons) {
      wWins += results[w][w2].wins;
      wTotal += numGames;
    }
    return { weapon: w, rate: Math.round(wWins / wTotal * 100) };
  }).sort((a, b) => b.rate - a.rate);

  html += ranking.map((r, i) =>
    `<span class="sim-rank-item">${i + 1}. ${emoji[r.weapon] || ''} ${names[r.weapon]} ${r.rate}%</span>`
  ).join(' ');
  html += '</div>';

  container.innerHTML = html;
}

function getCellClass(winRate) {
  if (winRate >= 65) return 'sim-hot';
  if (winRate >= 55) return 'sim-warm';
  if (winRate >= 45) return 'sim-neutral';
  if (winRate >= 35) return 'sim-cool';
  return 'sim-cold';
}
