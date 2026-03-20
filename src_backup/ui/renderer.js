;(function(LBQ) {

const { COMBAT_CARD_NAMES, DISTANCE_CARD_NAMES, WEAPON_NAMES, DISTANCE_NAMES,
  MAX_HP, MAX_STAMINA, MAX_STANCE, WEAPON_ZONES, STAMINA_RECOVERY,
  COMBAT_CARD_BASE, CARD_TYPE_MAP, WEAPON_EMOJI } = LBQ;
const { CombatCard, DistanceCard, WeaponType, CardType } = LBQ;
const { getAvailableCombatCards, getAvailableDistanceCards, getCombatCardCost, getTotalCost } = LBQ;
const { getDistanceCardCost } = LBQ;

// ═══════ Display Constants ═══════

const COMBAT_CARD_INFO = {
  [CombatCard.DODGE]:   { emoji: '💨', type: '防', desc: '回避攻击，成功时对手+1架势' },
  [CombatCard.DEFLECT]: { emoji: '🤺', type: '防', desc: '反制劈砍/点刺，伤害+僵直' },
  [CombatCard.SLASH]:   { emoji: '⚡', type: '攻', desc: '3伤害+1架势，高威力' },
  [CombatCard.THRUST]:  { emoji: '🎯', type: '攻', desc: '1伤害+1架势，低消耗' },
  [CombatCard.BLOCK]:   { emoji: '🛡️', type: '防', desc: '减免攻击伤害' },
  [CombatCard.FEINT]:   { emoji: '🌀', type: '攻', desc: '0伤害+2架势，克格挡' },
};

const DISTANCE_CARD_INFO = {
  [DistanceCard.ADVANCE]: { emoji: '⬆️', desc: '距离-1' },
  [DistanceCard.RETREAT]: { emoji: '⬇️', desc: '距离+1' },
  [DistanceCard.HOLD]:    { emoji: '⏸️', desc: '不变' },
};

// Fighter position mapping based on distance
const FIGHTER_POSITIONS = {
  0: { player: 42, ai: 58 },  // 贴身 — 非常近
  1: { player: 35, ai: 65 },  // 近战 — 较近
  2: { player: 24, ai: 76 },  // 中距 — 适中
  3: { player: 12, ai: 88 },  // 远距 — 很远
};

// ═══════ Render: Setup Screen ═══════
function renderSetup(app, onStart) {
  app.innerHTML = `
    <div class="setup-screen">
      <h1>⚔️ 冷刃博弈</h1>
      <p class="subtitle">以「距离管控」为核心的回合制冷兵器对战</p>
      <div class="setup-form">
        <div class="setup-row">
          <label>你的兵器</label>
          <select id="sel-player">
            ${Object.entries(WEAPON_NAMES).map(([k, v]) =>
              `<option value="${k}">${WEAPON_EMOJI[k] || ''} ${v}</option>`
            ).join('')}
          </select>
        </div>
        <div class="setup-row">
          <label>对手兵器</label>
          <select id="sel-ai">
            ${Object.entries(WEAPON_NAMES).map(([k, v]) =>
              `<option value="${k}">${WEAPON_EMOJI[k] || ''} ${v}</option>`
            ).join('')}
          </select>
        </div>
        <div class="setup-row">
          <label>AI 难度</label>
          <select id="sel-level">
            <option value="1">1 - 纯随机</option>
            <option value="2">2 - 基础规则</option>
            <option value="3" selected>3 - 简单策略</option>
            <option value="4">4 - 普通策略</option>
            <option value="5">5 - 高级策略</option>
            <option value="6">6 - 顶级高手</option>
          </select>
        </div>
        <button class="btn-start" id="btn-start">开始对局</button>
        <div class="setup-btns-row">
          <button class="btn-sim" id="btn-sim">📊 对战模拟</button>
          <button class="btn-sim" id="btn-config">⚙️ 参数配置</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('sel-ai').value = WeaponType.SPEAR;

  document.getElementById('btn-start').addEventListener('click', () => {
    onStart(
      document.getElementById('sel-player').value,
      document.getElementById('sel-ai').value,
      parseInt(document.getElementById('sel-level').value)
    );
  });

  document.getElementById('btn-sim').addEventListener('click', () => {
    LBQ.showSimulationModal();
  });

  document.getElementById('btn-config').addEventListener('click', () => {
    showConfigModal();
  });
}

// ═══════ Render: Game Main UI ═══════
function renderGame(app, state, selection, uiState, callbacks) {
  const html = `
    <div class="game-wrapper">
      ${buildTopBar(state, uiState)}
      <div class="game-layout">
        ${buildPlayerPanel(state, selection)}
        ${buildCenterArea(state, uiState)}
        ${buildAiPanel(state)}
      </div>
      ${buildBottomBar()}
    </div>
    ${buildTutorialModal()}
    ${buildRulesModal()}
  `;
  app.innerHTML = html;
  bindAllEvents(state, selection, uiState, callbacks);
}

// ─── Top Bar ───
function buildTopBar(state, uiState) {
  return `
    <div class="top-bar">
      <div class="game-title">⚔️ 冷刃博弈</div>
      <div class="top-controls">
        <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
        <select class="diff-select" data-action="difficulty">
          ${[1,2,3,4,5,6].map(d =>
            `<option value="${d}" ${d === state.aiLevel ? 'selected' : ''}>难度${d}</option>`
          ).join('')}
        </select>
        <button class="ctrl-btn" data-action="newgame">🎮 新对局</button>
        <button class="ctrl-btn" data-action="reset">🔄 重置</button>
        <button class="ctrl-btn" data-action="pause">${uiState.isPaused ? '▶️ 继续' : '⏸️ 暂停'}</button>
        <button class="ctrl-btn" data-action="undo" ${!uiState.canUndo ? 'disabled' : ''}>⏪ 回退</button>
        <span class="round-badge">第 ${state.round + 1} 回合</span>
      </div>
    </div>
  `;
}

// ─── Player Panel (Left) ───
function buildPlayerPanel(state, selection) {
  const p = state.player;
  const dist = state.distance;
  const stagger = p.staggered ? '<span class="stagger-badge">⚠ 僵直</span>' : '';
  const projectedStamina = Math.min(MAX_STAMINA, p.stamina + STAMINA_RECOVERY);

  // Card availability
  const projected = { ...p, stamina: projectedStamina };
  const availDist = getAvailableDistanceCards(projected, dist);
  const availCombat = getAvailableCombatCards(projected, dist);

  // Cost preview
  let totalCost = 0;
  let costValid = true;
  if (selection.distanceCard && selection.combatCard) {
    totalCost = getTotalCost(selection.distanceCard, selection.combatCard, projected, dist);
    costValid = totalCost <= projectedStamina;
  }

  return `
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">👤</span>
        <span class="panel-name">玩家 ${stagger}</span>
        <span class="weapon-badge">${WEAPON_EMOJI[p.weapon] || ''} ${WEAPON_NAMES[p.weapon]}</span>
      </div>
      ${buildStatBars(p, 'player')}
      <div class="divider"></div>
      <div class="card-sel-title">🃏 选择出牌</div>
      <div class="cost-preview">
        <span>消耗: <span class="${costValid ? 'cost-val' : 'cost-warn'}">${totalCost}</span></span>
        <span>可用: <span class="cost-val">${projectedStamina}</span> 体力</span>
      </div>
      <div class="card-group-label">距离卡（必选）</div>
      <div class="cards-row">
        ${buildDistanceCards(state, selection, projected, availDist)}
      </div>
      <div class="card-group-label">攻防卡（必选）</div>
      <div class="cards-grid compact">
        ${buildCombatCards(state, selection, projected, availCombat)}
      </div>
      <button class="btn-confirm" id="btn-confirm"
        ${(!selection.distanceCard || !selection.combatCard) ? 'disabled' : ''}>
        确认出牌
      </button>
    </div>
  `;
}

function buildStatBars(p, side) {
  const nextStamina = Math.min(MAX_STAMINA, p.stamina + STAMINA_RECOVERY);
  const recoveryText = nextStamina > p.stamina ? `<span class="stamina-recovery">下回合+${STAMINA_RECOVERY}→${nextStamina}</span>` : '';
  return `
    ${buildOneBar('❤️ 气血', 'hp', p.hp, MAX_HP)}
    ${buildOneBar('💪 体力', 'stamina', p.stamina, MAX_STAMINA)}
    ${recoveryText}
    ${buildOneBar('⚡ 架势', 'stance', p.stance, MAX_STANCE, p.stance >= 4)}
  `;
}

function buildOneBar(label, type, val, max, danger) {
  const pct = Math.max(0, (val / max) * 100);
  const dangerCls = danger ? ' danger' : '';
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar ${type}${dangerCls}" style="width: ${pct}%"></div>
      </div>
      <span class="stat-value">${val}/${max}</span>
    </div>
  `;
}

function buildDistanceCards(state, selection, projected, availDist) {
  const p = state.player;
  const dist = state.distance;
  return Object.values(DistanceCard).map(card => {
    const avail = availDist.includes(card);
    const sel = selection.distanceCard === card;
    const info = DISTANCE_CARD_INFO[card];
    const streak = p.distanceCardStreak.card === card ? p.distanceCardStreak.count : 0;
    const cost = getDistanceCardCost(card, streak, p.weapon, dist, WEAPON_ZONES);
    return `
      <div class="dist-card ${sel ? 'selected' : ''} ${!avail ? 'disabled' : ''}"
           data-type="distance" data-card="${card}">
        <span class="dc-emoji">${info.emoji}</span>
        <span class="dc-name">${DISTANCE_CARD_NAMES[card]}</span>
        <span class="dc-cost">${cost}体</span>
      </div>
    `;
  }).join('');
}

function buildCombatCards(state, selection, projected, availCombat) {
  const p = state.player;
  const dist = state.distance;
  return Object.values(CombatCard).map(card => {
    const avail = availCombat.includes(card);
    const sel = selection.combatCard === card;
    const info = COMBAT_CARD_INFO[card];
    const base = COMBAT_CARD_BASE[card];
    const streak = p.combatCardStreak.card === card ? p.combatCardStreak.count : 0;
    const cost = getCombatCardCost(card, streak, p.weapon, dist);
    const typeCls = info.type === '攻' ? 'atk' : 'def';
    return `
      <div class="combat-card ${sel ? 'selected' : ''} ${!avail ? 'disabled' : ''}"
           data-type="combat" data-card="${card}">
        <div class="cc-top">
          <span class="cc-emoji">${info.emoji}</span>
          <span class="cc-name">${COMBAT_CARD_NAMES[card]}</span>
          <span class="cc-type ${typeCls}">${info.type}</span>
        </div>
        <div class="cc-footer">
          <span>${cost}体</span>
          <span>P${base.priority}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ─── Center Area ───
function buildCenterArea(state, uiState) {
  return `
    <div class="center-area">
      ${uiState.isPaused ? '<div class="paused-banner">⏸ 游戏已暂停 — 点击「继续」恢复</div>' : ''}
      ${buildSituationHint(state)}
      ${buildDistanceZones(state)}
      <div class="arena-wrapper">
        ${buildBattleArena(state)}
        ${buildLastRoundResult(state)}
      </div>
      ${buildBattleLog(state)}
    </div>
  `;
}

// ─── Situation Hint (实时策略提示) ───
function buildSituationHint(state) {
  const p = state.player;
  const ai = state.ai;
  const dist = state.distance;
  const pZones = WEAPON_ZONES[p.weapon];
  const aZones = WEAPON_ZONES[ai.weapon];
  const pInAdv = pZones.advantage.includes(dist);
  const aInAdv = aZones.advantage.includes(dist);
  const pInDis = pZones.disadvantage.includes(dist);

  const hints = [];

  // 距离提示
  if (pInAdv && !aInAdv) {
    hints.push('✅ 你在优势距离！攻击伤害加成、消耗减免');
  } else if (aInAdv && !pInAdv) {
    hints.push('⚠️ 对手在优势距离！考虑拉开/靠近改变距离');
  } else if (pInAdv && aInAdv) {
    hints.push('⚔️ 双方都在优势区，正面较量！');
  } else if (pInDis) {
    hints.push('❌ 你在劣势区，快调整距离！');
  }

  // 架势提示
  if (p.stance >= 4) {
    hints.push('🔴 你架势快满了！被攻击可能触发处决(-5血)');
  } else if (ai.stance >= 4) {
    hints.push('🟢 对手架势快满了！攻击/虚晃可触发处决');
  }

  // 体力提示
  if (p.stamina <= 2) {
    hints.push('💤 体力不足，考虑用低消耗牌');
  }

  // 僵直提示
  if (p.staggered) {
    hints.push('😵 僵直中！本回合无法使用攻击卡');
  }
  if (ai.staggered) {
    hints.push('💥 对手僵直！无法使用攻击卡，进攻好时机');
  }

  // 默认提示
  if (hints.length === 0) {
    hints.push('💡 选择1张距离卡 + 1张攻防卡，点确认出牌');
  }

  return `<div class="situation-hint">${hints.join('<span class="hint-sep">|</span>')}</div>`;
}

function buildDistanceZones(state) {
  const pZones = WEAPON_ZONES[state.player.weapon];
  const aZones = WEAPON_ZONES[state.ai.weapon];

  const cells = [0, 1, 2, 3].map(d => {
    const isCurrent = d === state.distance;
    const pAdv = pZones.advantage.includes(d);
    const aAdv = aZones.advantage.includes(d);

    let cls = 'zone-cell';
    if (isCurrent) cls += ' current';
    if (pAdv && !aAdv) cls += ' player-adv';
    if (aAdv && !pAdv) cls += ' ai-adv';

    return `
      <div class="${cls}">
        <div class="zone-name">${DISTANCE_NAMES[d]}</div>
        ${isCurrent ? '<div class="zone-marker">⚔</div>' : ''}
        <div class="zone-tags">
          ${pAdv ? '<span class="zone-tag ptag">★玩家</span>' : ''}
          ${aAdv ? '<span class="zone-tag atag">★AI</span>' : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="distance-zones">
      <div class="zone-header">📍 距离管控区</div>
      <div class="zone-bar">${cells}</div>
    </div>
  `;
}

function buildBattleArena(state) {
  const pos = FIGHTER_POSITIONS[state.distance] || FIGHTER_POSITIONS[2];
  const pHpPct = (state.player.hp / MAX_HP * 100).toFixed(0);
  const aHpPct = (state.ai.hp / MAX_HP * 100).toFixed(0);
  const pStPct = (state.player.stance / MAX_STANCE * 100).toFixed(0);
  const aStPct = (state.ai.stance / MAX_STANCE * 100).toFixed(0);

  // Distance line between fighters
  const lineLeft = pos.player;
  const lineWidth = pos.ai - pos.player;

  return `
    <div class="battle-arena">
      <div class="arena-title">⚔️ 战斗场景</div>
      <div class="arena-stage" id="arena-stage">
        <div class="arena-dist-label">${DISTANCE_NAMES[state.distance]}</div>
        <div class="arena-dist-line" style="left:${lineLeft}%;width:${lineWidth}%"></div>
        <div class="fighter player-fighter" id="player-fighter" style="left:${pos.player}%">
          <div class="fighter-weapon-icon">${WEAPON_EMOJI[state.player.weapon] || '🗡️'}</div>
          <div class="fighter-body">${state.player.staggered ? '😵' : '🧑'}</div>
          <div class="fighter-label">玩家</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-p" style="width:${pHpPct}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${pStPct}%"></div></div>
          </div>
        </div>
        <div class="fighter ai-fighter" id="ai-fighter" style="left:${pos.ai}%">
          <div class="fighter-weapon-icon">${WEAPON_EMOJI[state.ai.weapon] || '🔱'}</div>
          <div class="fighter-body">${state.ai.staggered ? '😵' : '🤖'}</div>
          <div class="fighter-label">AI</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-a" style="width:${aHpPct}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${aStPct}%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildLastRoundResult(state) {
  if (state.history.length === 0) {
    return `<div class="round-result-banner">等待出牌...</div>`;
  }
  const last = state.history[state.history.length - 1];
  const pDistName = DISTANCE_CARD_NAMES[last.playerDistance];
  const pCombatName = COMBAT_CARD_NAMES[last.playerCombat];
  const aDistName = DISTANCE_CARD_NAMES[last.aiDistance];
  const aCombatName = COMBAT_CARD_NAMES[last.aiCombat];
  const pEmoji = COMBAT_CARD_INFO[last.playerCombat] ? COMBAT_CARD_INFO[last.playerCombat].emoji : '';
  const aEmoji = COMBAT_CARD_INFO[last.aiCombat] ? COMBAT_CARD_INFO[last.aiCombat].emoji : '';

  return `
    <div class="round-result-banner">
      <span class="rrb-label">第${state.round}回合</span>
      <span class="rrb-player">👤 ${pDistName}+${pEmoji}${pCombatName}</span>
      <span class="rrb-vs">VS</span>
      <span class="rrb-ai">🤖 ${aDistName}+${aEmoji}${aCombatName}</span>
    </div>
  `;
}

function buildBattleLog(state) {
  const lines = state.log.map(line => {
    let cls = 'log-line';
    if (line.includes('处决') || line.includes('伤')) cls += ' damage';
    if (line.includes('══')) cls += ' highlight';
    if (line.includes('闪避成功') || line.includes('格挡')) cls += ' good';
    return `<div class="${cls}">${line}</div>`;
  }).join('');

  return `
    <div class="battle-log" id="battle-log">
      <div class="log-title">📜 战斗日志</div>
      ${lines || '<div class="log-line">等待对局开始...</div>'}
    </div>
  `;
}

// ─── AI Panel (Right) ───
function buildAiPanel(state) {
  const ai = state.ai;
  const projectedStamina = Math.min(MAX_STAMINA, ai.stamina + STAMINA_RECOVERY);
  const stagger = ai.staggered ? '<span class="stagger-badge">⚠ 僵直</span>' : '';
  const zones = WEAPON_ZONES[ai.weapon];
  const advNames = zones.advantage.map(d => DISTANCE_NAMES[d]).join('、');
  const disNames = zones.disadvantage.map(d => DISTANCE_NAMES[d]).join('、');

  return `
    <div class="side-panel ai-side">
      <div class="panel-header">
        <span class="panel-icon">🤖</span>
        <span class="panel-name">AI ${stagger}</span>
        <span class="weapon-badge">${WEAPON_EMOJI[ai.weapon] || ''} ${WEAPON_NAMES[ai.weapon]}</span>
      </div>
      ${buildStatBars(ai, 'ai')}
      <div class="weapon-info-box">
        <div class="info-title">兵器特性</div>
        <div class="info-adv">✦ 优势区: ${advNames}</div>
        <div class="info-dis">✧ 劣势区: ${disNames}</div>
      </div>
      <div class="divider"></div>
      ${buildAiLastAction(state)}
      <div class="divider"></div>
      ${buildHistoryPanel(state)}
    </div>
  `;
}

function buildAiLastAction(state) {
  if (state.history.length === 0) {
    return `
      <div class="ai-last-action">
        <div class="ala-title">🎴 AI上回合出牌</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;
  }
  const last = state.history[state.history.length - 1];
  const distInfo = DISTANCE_CARD_INFO[last.aiDistance];
  const combatInfo = COMBAT_CARD_INFO[last.aiCombat];
  return `
    <div class="ai-last-action">
      <div class="ala-title">🎴 AI上回合出牌</div>
      <div class="ala-cards">
        <div class="ala-card">${distInfo.emoji} ${DISTANCE_CARD_NAMES[last.aiDistance]}</div>
        <div class="ala-card">${combatInfo.emoji} ${COMBAT_CARD_NAMES[last.aiCombat]} <span class="cc-type ${combatInfo.type === '攻' ? 'atk' : 'def'}">${combatInfo.type}</span></div>
      </div>
    </div>
  `;
}

function buildHistoryPanel(state) {
  const items = state.history.map((h, i) => {
    const pDist = DISTANCE_CARD_NAMES[h.playerDistance];
    const pCombat = COMBAT_CARD_NAMES[h.playerCombat];
    const aDist = DISTANCE_CARD_NAMES[h.aiDistance];
    const aCombat = COMBAT_CARD_NAMES[h.aiCombat];
    const pEmoji = COMBAT_CARD_INFO[h.playerCombat] ? COMBAT_CARD_INFO[h.playerCombat].emoji : '';
    const aEmoji = COMBAT_CARD_INFO[h.aiCombat] ? COMBAT_CARD_INFO[h.aiCombat].emoji : '';
    return `
      <div class="history-item">
        <div class="h-round">回合 ${i + 1}</div>
        <div class="h-player">👤 ${pDist} + ${pEmoji} ${pCombat}</div>
        <div class="h-ai">🤖 ${aDist} + ${aEmoji} ${aCombat}</div>
      </div>
    `;
  }).reverse().join('');

  return `
    <div class="history-section">
      <div class="history-title">📜 历史记录</div>
      <div class="history-list" id="history-list">
        ${items || '<div class="history-item"><div class="h-detail">暂无记录</div></div>'}
      </div>
    </div>
  `;
}

// ─── Bottom Bar ───
function buildBottomBar() {
  return `
    <div class="bottom-bar">
      <div class="rule-summary">
        <span>距离管控</span>为第一核心 |
        <span>双向架势</span>为胜负根基 |
        <span>攻防预判</span>为博弈循环
      </div>
      <button class="btn-rules" data-action="rules">📖 完整规则</button>
    </div>
  `;
}

// ─── Tutorial Modal ───
function buildTutorialModal() {
  return `
    <div class="modal-overlay" id="modal-tutorial">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title">📚 新手引导</div>
          <button class="modal-close" data-close="tutorial">关闭</button>
        </div>
        <div class="modal-content-text">
          <h4>🎯 游戏目标</h4>
          <p>将对手的气血值归零即可获胜！控制架势条，避免被处决（-5血）。</p>

          <h4>⚔️ 核心机制</h4>
          <ul>
            <li><strong>距离管控</strong>：不同兵器在不同距离有优势/劣势，距离控制是胜负的关键</li>
            <li><strong>架势系统</strong>：被攻击/虚晃会增加架势值，满5触发处决扣5血</li>
            <li><strong>体力系统</strong>：每回合恢复3体力，操作消耗体力，连续使用同一卡牌消耗递增</li>
          </ul>

          <h4>🃏 出牌流程</h4>
          <ol>
            <li>选择 <strong>1张距离调整卡</strong>：靠近 / 远离 / 站稳</li>
            <li>选择 <strong>1张攻防操作卡</strong>：闪避 / 卸力 / 劈砍 / 点刺 / 格挡 / 虚晃</li>
            <li>点击 <strong>确认出牌</strong></li>
            <li>系统自动结算：先距离，再攻防（按优先级）</li>
          </ol>

          <h4>🎴 卡牌说明</h4>
          <ul>
            <li><strong>💨 闪避</strong>（优先级1）：防守卡，回避攻击成功时对手+1架势</li>
            <li><strong>🤺 卸力</strong>（优先级2）：防守卡，反制劈砍/点刺，造成2伤+僵直</li>
            <li><strong>⚡ 劈砍</strong>（优先级3）：攻击卡，3伤害+1架势，高消耗</li>
            <li><strong>🎯 点刺</strong>（优先级4）：攻击卡，1伤害+1架势，低消耗快出</li>
            <li><strong>🛡️ 格挡</strong>（优先级5）：防守卡，减免劈砍/点刺伤害</li>
            <li><strong>🌀 虚晃</strong>（优先级6）：攻击卡，0伤害但+2架势，克制格挡</li>
          </ul>

          <h4>🏹 兵器特性</h4>
          <ul>
            <li><strong>🗡️ 短刀</strong>：贴身+近战优势，闪避减免，点刺加伤</li>
            <li><strong>🔱 长枪</strong>：中距+远距优势，劈砍加伤大，格挡减免</li>
            <li><strong>⚔️ 剑</strong>：近战+中距优势，卸力不造成僵直改为减自身架势</li>
            <li><strong>🏏 棍</strong>：近战+中距+远距优势（最宽），虚晃加成，但劈砍伤害-1</li>
            <li><strong>🪓 大刀</strong>：仅中距优势，劈砍超高伤害+推距离</li>
          </ul>

          <h4>💡 操作技巧</h4>
          <ul>
            <li>再次点击已选卡牌可取消选择</li>
            <li>灰色卡牌表示不可用（距离/体力/僵直限制）</li>
            <li>⏪ 回退按钮可撤销上一回合</li>
            <li>关注架势值！ 架势满5会被处决扣5血</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// ─── Rules Modal ───
function buildRulesModal() {
  return `
    <div class="modal-overlay" id="modal-rules">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title">📖 完整规则</div>
          <button class="modal-close" data-close="rules">关闭</button>
        </div>
        <div class="modal-content-text">
          <h4>📐 距离系统</h4>
          <ul>
            <li>4个距离区间：贴身区(0) → 近战区(1) → 中距区(2) → 远距区(3)</li>
            <li>初始距离：中距区(2)</li>
            <li>双方距离效果叠加：如玩家靠近(-1) + AI远离(+1) = 距离不变</li>
          </ul>

          <h4>⚡ 体力系统</h4>
          <ul>
            <li>体力上限8，每回合恢复3（不超上限）</li>
            <li>所有操作消耗体力，先扣体力再结算</li>
            <li>连续使用同一卡牌，消耗逐回合+1</li>
            <li>兵器在优势区有特定卡牌消耗减免</li>
          </ul>

          <h4>⚔️ 攻防结算（按优先级）</h4>
          <ul>
            <li>优先级：闪避(1) > 卸力(2) > 劈砍(3) > 点刺(4) > 格挡(5) > 虚晃(6)</li>
            <li>卸力成功反制劈砍/点刺：造成反伤+僵直</li>
            <li>格挡减免劈砍/点刺伤害</li>
            <li>虚晃骗出格挡：+架势值</li>
          </ul>

          <h4>🎭 架势与处决</h4>
          <ul>
            <li>被攻击/虚晃命中会增加架势值</li>
            <li>架势值达到5触发「处决」：扣5血 + 架势清零</li>
            <li>架势管理是游戏核心策略之一</li>
          </ul>

          <h4>💫 僵直状态</h4>
          <ul>
            <li>被卸力成功反制后进入僵直</li>
            <li>僵直状态持续1回合，期间所有攻击卡禁用</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// ═══════ Event Binding ═══════
function bindAllEvents(state, selection, uiState, callbacks) {
  // Card selection
  document.querySelectorAll('.dist-card:not(.disabled), .combat-card:not(.disabled)').forEach(el => {
    el.addEventListener('click', () => {
      callbacks.onSelect(el.dataset.type, el.dataset.card);
    });
  });

  // Confirm
  const confirmBtn = document.getElementById('btn-confirm');
  if (confirmBtn && !confirmBtn.disabled) {
    confirmBtn.addEventListener('click', () => callbacks.onConfirm());
  }

  // Top bar controls
  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.dataset.action;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'click', () => {
      switch(action) {
        case 'tutorial': toggleModal('modal-tutorial', true); break;
        case 'rules': toggleModal('modal-rules', true); break;
        case 'newgame': callbacks.onNewGame(); break;
        case 'reset': callbacks.onReset(); break;
        case 'pause': callbacks.onTogglePause(); break;
        case 'undo': callbacks.onUndo(); break;
        case 'difficulty':
          callbacks.onDifficultyChange(parseInt(el.value));
          break;
      }
    });
  });

  // Modal close buttons
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      toggleModal('modal-' + el.dataset.close, false);
    });
  });

  // Click modal overlay to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
}

function toggleModal(id, show) {
  const el = document.getElementById(id);
  if (el) {
    if (show) el.classList.add('active');
    else el.classList.remove('active');
  }
}

// ═══════ Render: Result Screen ═══════
function renderResult(app, state, onRestart, onBack) {
  let title, cls;
  if (state.winner === 'player') { title = '🏆 胜利！'; cls = 'win'; }
  else if (state.winner === 'ai') { title = '💀 败北'; cls = 'lose'; }
  else { title = '🤝 平局'; cls = 'draw'; }

  // Insert a banner at the top of center-area instead of a full overlay
  const center = document.querySelector('.center-area');
  if (!center) return;

  const banner = document.createElement('div');
  banner.className = 'game-over-banner ' + cls;
  banner.innerHTML = `
    <div class="gob-title">${title}</div>
    <div class="gob-stats">
      回合${state.round} ｜ 
      👤 HP ${state.player.hp}/${MAX_HP} ｜ 
      🤖 HP ${state.ai.hp}/${MAX_HP}
    </div>
    <div class="gob-btns">
      <button class="gob-btn restart" id="btn-restart-same">🔄 再来一局</button>
      <button class="gob-btn back" id="btn-back-setup">🏠 返回选择</button>
    </div>
  `;

  center.insertBefore(banner, center.firstChild);

  document.getElementById('btn-restart-same').addEventListener('click', () => {
    onRestart();
  });
  document.getElementById('btn-back-setup').addEventListener('click', () => {
    onBack();
  });
}

// ═══════ Battle Animations ═══════
function triggerBattleAnimations(state, prevState) {
  if (!prevState || state.history.length === 0) return;

  const last = state.history[state.history.length - 1];
  const pCombat = last.playerCombat;
  const aCombat = last.aiCombat;
  const pFighter = document.getElementById('player-fighter');
  const aFighter = document.getElementById('ai-fighter');
  const stage = document.getElementById('arena-stage');
  if (!pFighter || !aFighter || !stage) return;

  // Player animation
  if (CARD_TYPE_MAP[pCombat] === CardType.ATTACK) {
    pFighter.classList.add('anim-attack-p');
  } else if (pCombat === CombatCard.DODGE) {
    pFighter.classList.add('anim-dodge');
  }

  // AI animation
  if (CARD_TYPE_MAP[aCombat] === CardType.ATTACK) {
    aFighter.classList.add('anim-attack-a');
  } else if (aCombat === CombatCard.DODGE) {
    aFighter.classList.add('anim-dodge');
  }

  // Hit effects (damage taken)
  if (state.player.hp < prevState.player.hp) {
    pFighter.classList.add('anim-hit');
    showFloatDmg(stage, pFighter, `-${prevState.player.hp - state.player.hp}`, 'damage');
  }
  if (state.ai.hp < prevState.ai.hp) {
    aFighter.classList.add('anim-hit');
    showFloatDmg(stage, aFighter, `-${prevState.ai.hp - state.ai.hp}`, 'damage');
  }

  // Stance effects
  if (state.player.stance > prevState.player.stance) {
    showFloatDmg(stage, pFighter, `+${state.player.stance - prevState.player.stance} 架势`, 'stance');
  }
  if (state.ai.stance > prevState.ai.stance) {
    showFloatDmg(stage, aFighter, `+${state.ai.stance - prevState.ai.stance} 架势`, 'stance');
  }

  // Clean up animations after they play
  setTimeout(() => {
    pFighter.classList.remove('anim-attack-p', 'anim-dodge', 'anim-hit', 'anim-shake');
    aFighter.classList.remove('anim-attack-a', 'anim-dodge', 'anim-hit', 'anim-shake');
  }, 600);
}

function showFloatDmg(stage, fighter, text, type) {
  const el = document.createElement('div');
  el.className = 'float-dmg' + (type === 'stance' ? ' stance-dmg' : '');
  el.textContent = text;
  el.style.left = fighter.style.left;
  el.style.top = '30%';
  stage.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ═══════ Scroll Log ═══════
function scrollLogToBottom() {
  const log = document.getElementById('battle-log');
  if (log) log.scrollTop = log.scrollHeight;
}

// ═══════ Config Modal ═══════
function showConfigModal() {
  const old = document.getElementById('cfg-modal');
  if (old) old.remove();

  const { CONFIG_META, CONFIG_DEFAULTS, getCurrentConfig, getConfigDiff,
    saveConfig, resetConfig, applyConfig, WEAPON_NAMES: wNames, WEAPON_EMOJI: wEmoji } = LBQ;
  const cfg = getCurrentConfig();
  const DIST_LABELS = ['0-贴身', '1-近战', '2-中距', '3-远距'];

  const modal = document.createElement('div');
  modal.id = 'cfg-modal';
  modal.className = 'sim-modal-overlay';

  // 数值参数行
  let numericRows = '';
  for (const [key, meta] of Object.entries(CONFIG_META)) {
    const val = cfg[key];
    const def = CONFIG_DEFAULTS[key];
    const changed = val !== def;
    numericRows += `
      <div class="cfg-row">
        <label>${meta.label}</label>
        <input type="number" id="cfg-${key}" value="${val}" min="${meta.min}" max="${meta.max}" step="${meta.step}" />
        <span class="cfg-default${changed ? ' cfg-changed' : ''}">(默认: ${def})</span>
      </div>`;
  }

  // 兵器区间行
  let weaponRows = '';
  for (const [weapon, zones] of Object.entries(cfg.WEAPON_ZONES)) {
    const name = (wEmoji[weapon] || '') + ' ' + (wNames[weapon] || weapon);
    const defZones = CONFIG_DEFAULTS.WEAPON_ZONES[weapon];
    const advChanged = defZones && JSON.stringify(zones.advantage) !== JSON.stringify(defZones.advantage);
    const disadvChanged = defZones && JSON.stringify(zones.disadvantage) !== JSON.stringify(defZones.disadvantage);

    weaponRows += `
      <div class="cfg-weapon-block">
        <div class="cfg-weapon-name">${name}</div>
        <div class="cfg-zone-row">
          <label>优势区</label>
          <div class="cfg-checkboxes" data-weapon="${weapon}" data-type="advantage">
            ${DIST_LABELS.map((lbl, i) => `<label class="cfg-cb"><input type="checkbox" value="${i}" ${zones.advantage.includes(i) ? 'checked' : ''} /> ${lbl}</label>`).join('')}
          </div>
          ${advChanged ? '<span class="cfg-changed-dot">●</span>' : ''}
        </div>
        <div class="cfg-zone-row">
          <label>劣势区</label>
          <div class="cfg-checkboxes" data-weapon="${weapon}" data-type="disadvantage">
            ${DIST_LABELS.map((lbl, i) => `<label class="cfg-cb"><input type="checkbox" value="${i}" ${zones.disadvantage.includes(i) ? 'checked' : ''} /> ${lbl}</label>`).join('')}
          </div>
          ${disadvChanged ? '<span class="cfg-changed-dot">●</span>' : ''}
        </div>
      </div>`;
  }

  // 差异面板
  const diffs = getConfigDiff(cfg);
  let diffHtml = '';
  if (diffs.length > 0) {
    diffHtml = `<div class="cfg-diff"><strong>与默认值差异：</strong>` +
      diffs.map(d => `<div class="cfg-diff-item"><span class="cfg-diff-label">${d.label}</span> <span class="cfg-diff-old">${d.default}</span> → <span class="cfg-diff-new">${d.current}</span></div>`).join('') +
      `</div>`;
  }

  modal.innerHTML = `
    <div class="sim-modal-box cfg-modal-box">
      <div class="sim-header">
        <h2>⚙️ 参数配置</h2>
        <button class="sim-close" id="cfg-close">✕</button>
      </div>
      <div class="cfg-section">
        <h3>基础数值</h3>
        ${numericRows}
      </div>
      <div class="cfg-section">
        <h3>兵器区间</h3>
        ${weaponRows}
      </div>
      <div id="cfg-diff-area">${diffHtml}</div>
      <div class="cfg-actions">
        <button class="cfg-btn cfg-save" id="cfg-save">💾 保存</button>
        <button class="cfg-btn cfg-reset" id="cfg-reset">↩ 恢复默认</button>
        <button class="cfg-btn cfg-cancel" id="cfg-cancel">取消</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Events
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('cfg-close').addEventListener('click', () => modal.remove());
  document.getElementById('cfg-cancel').addEventListener('click', () => modal.remove());

  document.getElementById('cfg-save').addEventListener('click', () => {
    const newCfg = gatherConfigFromUI();
    saveConfig(newCfg);
    applyConfig(newCfg);
    modal.remove();
    // 刷新差异显示
    alert('配置已保存！下次对局生效。');
  });

  document.getElementById('cfg-reset').addEventListener('click', () => {
    resetConfig();
    modal.remove();
    alert('已恢复默认配置！');
  });

  // 输入变化时实时更新差异
  modal.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      const newCfg = gatherConfigFromUI();
      const diffs = getConfigDiff(newCfg);
      const diffArea = document.getElementById('cfg-diff-area');
      if (diffs.length > 0) {
        diffArea.innerHTML = `<div class="cfg-diff"><strong>与默认值差异：</strong>` +
          diffs.map(d => `<div class="cfg-diff-item"><span class="cfg-diff-label">${d.label}</span> <span class="cfg-diff-old">${d.default}</span> → <span class="cfg-diff-new">${d.current}</span></div>`).join('') +
          `</div>`;
      } else {
        diffArea.innerHTML = '<div class="cfg-diff"><em>无差异（全部为默认值）</em></div>';
      }
    });
  });
}

function gatherConfigFromUI() {
  const { CONFIG_META, getCurrentConfig } = LBQ;
  const cfg = getCurrentConfig();

  // 数值
  for (const key of Object.keys(CONFIG_META)) {
    const el = document.getElementById(`cfg-${key}`);
    if (el) cfg[key] = parseInt(el.value) || CONFIG_META[key].min;
  }

  // 兵器区间
  document.querySelectorAll('.cfg-checkboxes').forEach(container => {
    const weapon = container.dataset.weapon;
    const type = container.dataset.type;
    const checked = [];
    container.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      checked.push(parseInt(cb.value));
    });
    if (!cfg.WEAPON_ZONES[weapon]) cfg.WEAPON_ZONES[weapon] = { advantage: [], disadvantage: [] };
    cfg.WEAPON_ZONES[weapon][type] = checked.sort();
  });

  return cfg;
}

// ═══════ Export ═══════
Object.assign(LBQ, {
  renderSetup, renderGame, renderResult, scrollLogToBottom,
  triggerBattleAnimations
});

})(window.LBQ);
