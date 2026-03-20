;(function(LBQ) {

const { WeaponType, initGame, executeRound, aiDecide } = LBQ;
const { WEAPON_NAMES, WEAPON_EMOJI } = LBQ;

const ALL_WEAPONS = Object.values(WeaponType);
const MAX_ROUNDS = 50;

/**
 * 翻转游戏状态，让 aiDecide 为"玩家"侧做决策
 */
function flipState(state, playerAiLevel) {
  const s = JSON.parse(JSON.stringify(state));
  const tmp = s.player;
  s.player = s.ai;
  s.ai = tmp;
  s.aiLevel = playerAiLevel;
  // 翻转历史记录的视角
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
 * 运行一场模拟对局
 * @returns {'player'|'ai'|'draw'}
 */
function runOneGame(playerWeapon, aiWeapon, playerLevel, aiLevel) {
  let state = initGame(playerWeapon, aiWeapon, aiLevel);
  const { CombatCard, DistanceCard } = LBQ;
  const fallbackCombat = CombatCard.THRUST;
  const fallbackDist = DistanceCard.HOLD;
  let rounds = 0;
  while (!state.gameOver && rounds < MAX_ROUNDS) {
    const aiAction = aiDecide(state);
    const flipped = flipState(state, playerLevel);
    const playerAction = aiDecide(flipped);
    // 防御：确保卡牌有效
    if (!playerAction.combatCard) playerAction.combatCard = fallbackCombat;
    if (!playerAction.distanceCard) playerAction.distanceCard = fallbackDist;
    if (!aiAction.combatCard) aiAction.combatCard = fallbackCombat;
    if (!aiAction.distanceCard) aiAction.distanceCard = fallbackDist;
    state = executeRound(state, playerAction, aiAction);
    rounds++;
  }
  return state.winner || 'draw';
}

/**
 * 运行完整模拟
 * @param {number} playerLevel - 模拟"玩家"侧AI等级
 * @param {number} aiLevel - 模拟对手AI等级
 * @param {number} numGames - 每个武器组合的对局数
 * @returns {Object} results[playerWeapon][aiWeapon] = {wins, losses, draws}
 */
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

// ═══════ 模拟界面 ═══════

function showSimulationModal() {
  // 清除已有的modal
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
            <option value="3" selected>3 - 简单策略</option>
            <option value="4">4 - 普通策略</option>
            <option value="5">5 - 高级策略</option>
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
            <option value="30">30 (快速)</option>
            <option value="50" selected>50 (标准)</option>
            <option value="100">100 (精确)</option>
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

    // 用 setTimeout 让 loading 先渲染出来
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

  // 统计总体胜率
  let totalWins = 0, totalGames = 0;
  for (const w1 of weapons) {
    for (const w2 of weapons) {
      totalWins += results[w1][w2].wins;
      totalGames += numGames;
    }
  }
  const overallRate = Math.round(totalWins / totalGames * 100);

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
      html += `<td class="sim-cell ${cellClass}" title="${tooltip}">${winRate}</td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table>';

  // 武器总胜率排名
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

Object.assign(LBQ, { showSimulationModal });

})(window.LBQ);
