import { CombatCard, DistanceCard, CardType } from '../types.js';
import { COMBAT_CARD_NAMES, DISTANCE_CARD_NAMES, WEAPON_NAMES, DISTANCE_NAMES,
  gameConfig, WEAPON_ZONES, COMBAT_CARD_BASE, CARD_TYPE_MAP, WEAPON_EMOJI, DISTANCE_CARD_BASE } from '../constants.js';
import { getAvailableCombatCards, getAvailableDistanceCards } from '../engine/card-validator.js';
import { getDamageModifier, getDodgeCostReduction, canThrustBreakDodge } from '../engine/weapon.js';
import { getActiveTraits, explainCombatMatchup } from '../engine/combat-explain.js';
import { buildGuideContent, buildRulesContent } from './tutorial-content.js';
import { COMBAT_CARD_INFO, DISTANCE_CARD_INFO, FIGHTER_POSITIONS,
  buildWeaponZoneStrip, buildWeaponSkillCards } from './weapon-display.js';
import { isMuted, setMuted, getSfxVolume, setSfxVolume } from './sound.js';
export { COMBAT_CARD_INFO, DISTANCE_CARD_INFO, FIGHTER_POSITIONS };








// ═══════ Render: Game Main UI ═══════
export function renderGame(app, state, selection, uiState, callbacks) {
  const spectator = uiState.spectator;
  const leftPanel = spectator
    ? buildSpectatorLeftPanel(state, uiState)
    : buildPlayerPanel(state, selection);

  const html = `
    <div class="game-wrapper">
      ${buildTopBar(state, uiState)}
      <div class="game-layout">
        ${leftPanel}
        ${buildCenterArea(state, uiState)}
        ${buildAiPanel(state, spectator)}
      </div>
      ${buildBottomBar()}
    </div>
    ${buildTutorialModal()}
    ${buildRoundDetailModal()}
  `;
  app.innerHTML = html;
  bindAllEvents(state, selection, uiState, callbacks);
}

// ─── Top Bar ───
function buildTopBar(state, uiState) {
  const muteBtn = `<button class="ctrl-btn" data-action="togglemute">${isMuted() ? '🔇' : '🔊'}</button>`;
  const volSlider = `<input type="range" class="vol-slider" data-action="volume" min="0" max="100" value="${Math.round(getSfxVolume() * 100)}" title="音量">`;
  if (uiState.spectator) {
    return `
      <div class="top-bar">
        <div class="game-title">🦗 斗蛐蛐</div>
        <div class="top-controls">
          <button class="ctrl-btn" data-action="tutorial">📚 引导</button>
          <button class="ctrl-btn" data-action="newgame">🏠 返回</button>
          <button class="ctrl-btn" data-action="pause">${uiState.isPaused ? '▶️ 继续' : '⏸️ 暂停'}</button>
          ${muteBtn}${volSlider}
          <span class="round-badge">第 ${state.round + 1} 回合</span>
        </div>
      </div>
    `;
  }
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
        ${muteBtn}${volSlider}
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

  const availDist = getAvailableDistanceCards(p, dist);
  const reservedStamina = selection.distanceCard ? (DISTANCE_CARD_BASE[selection.distanceCard]?.cost ?? 0) : 0;
  const availCombat = getAvailableCombatCards(p, dist, reservedStamina);

  return `
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">👤</span>
        <span class="panel-name">玩家 ${stagger}</span>
        <span class="weapon-badge">${WEAPON_EMOJI[p.weapon] || ''} ${WEAPON_NAMES[p.weapon]}</span>
      </div>
      ${buildStatBars(p, 'player')}
      ${buildWeaponZoneStrip(p.weapon, state.distance)}
      <div class="divider"></div>
      <div class="card-sel-title">🃏 选择出牌</div>
      <div class="card-group-label">身法卡（必选）</div>
      <div class="cards-row">
        ${buildDistanceCards(state, selection, p, availDist)}
      </div>
      <div class="card-group-label weapon-skill-label">🔒 兵器专属身法 <span class="dev-tag">未开发</span></div>
      <div class="cards-row weapon-skills-row">
        ${buildWeaponSkillCards(state.player.weapon)}
      </div>
      <div class="card-group-label">攻防卡（必选）</div>
      <div class="cards-grid compact">
        ${buildCombatCards(state, selection, p, availCombat)}
      </div>
      <button class="btn-confirm" id="btn-confirm"
        ${(!selection.distanceCard || !selection.combatCard) ? 'disabled' : ''}>
        确认出牌
      </button>
    </div>
  `;
}

function buildStatBars(p, side) {
  const MAX_HP = gameConfig.MAX_HP;
  const MAX_STANCE = gameConfig.MAX_STANCE;
  const MAX_STAMINA = gameConfig.MAX_STAMINA;
  return `
    ${buildOneBar('❤️ 气血', 'hp', p.hp, MAX_HP)}
    ${buildOneBar('💨 体力', 'stamina', p.stamina, MAX_STAMINA, false)}
    ${buildOneBar('⚡ 架势', 'stance', p.stance, MAX_STANCE, p.stance >= 4)}
  `;
}

function buildOneBar(label, type, val, max, danger) {
  const pct = Math.max(0, (val / max) * 100);
  const dangerCls = danger ? ' danger' : '';
  return `
    <div class="stat-row" data-stat="${type}">
      <span class="stat-label">${label}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar ${type}${dangerCls}" data-max="${max}" style="width: ${pct}%"></div>
      </div>
      <span class="stat-value">${val}/${max}</span>
    </div>
  `;
}

function buildDistanceCards(state, selection, projected, availDist) {
  const p = state.player;
  const dist = state.distance;
  const cardOrder = [DistanceCard.ADVANCE, DistanceCard.RETREAT, DistanceCard.HOLD, DistanceCard.DODGE];
  return cardOrder.map(card => {
    const avail = availDist.includes(card);
    const sel = selection.distanceCard === card;
    const info = DISTANCE_CARD_INFO[card];
    let cost = DISTANCE_CARD_BASE[card]?.cost ?? 0;
    if (card === DistanceCard.DODGE && p.weapon) {
      cost = Math.max(0, cost - getDodgeCostReduction(p.weapon));
    }

    const tips = [info.desc];
    if (cost > 0) tips.push(`耗${cost}体力`);
    if (!avail && cost > 0 && p.stamina < cost) tips.push(`⛔ 体力不足（需要${cost}）`);
    const tooltip = tips.join('\n');

    return `
      <div class="dist-card ${sel ? 'selected' : ''} ${!avail ? 'disabled' : ''}"
           data-type="distance" data-card="${card}" title="${tooltip}">
        <span class="dc-emoji">${info.emoji}</span>
        <span class="dc-name">${DISTANCE_CARD_NAMES[card]}</span>
        ${cost > 0 ? `<span class="dc-cost">${cost}体</span>` : ''}
      </div>
    `;
  }).join('');
}

function getCardDisableReason(card, weapon, distance, staggered, stamina, reservedStamina) {
  if (staggered && CARD_TYPE_MAP[card] === CardType.ATTACK) return '⛔ 僵直中，无法使用攻击';
  return '';
}

function buildCombatCards(state, selection, projected, availCombat) {
  const p = state.player;
  const dist = state.distance;
  const reservedStamina = selection.distanceCard ? (DISTANCE_CARD_BASE[selection.distanceCard]?.cost ?? 0) : 0;
  return Object.values(CombatCard).map(card => {
    const avail = availCombat.includes(card);
    const sel = selection.combatCard === card;
    const info = COMBAT_CARD_INFO[card];
    const base = COMBAT_CARD_BASE[card];
    const typeCls = info.type === '攻' ? 'atk' : 'def';

    // Build rich tooltip
    const tips = [info.desc];
    const dmgMod = getDamageModifier(p.weapon, dist, card);
    if (dmgMod > 0) tips.push(`📈 优势区加成：伤害+${dmgMod}`);
    if (dmgMod < 0 && dmgMod >= -2) tips.push(`📉 劣势区减益：伤害${dmgMod}`);
    if (dmgMod <= -3) tips.push(`⚠️ 距离不佳：伤害${dmgMod}，几乎无效`);
    if (!avail) tips.push(getCardDisableReason(card, p.weapon, dist, p.staggered, p.stamina, reservedStamina));
    const tooltip = tips.join('\n');

    // "weak" class for heavily penalized cards (dmg reduced to 0)
    const weakCls = (dmgMod <= -3 && base.damage > 0) ? 'cc-weak' : '';

    return `
      <div class="combat-card ${sel ? 'selected' : ''} ${!avail ? 'disabled' : ''} ${weakCls}"
           data-type="combat" data-card="${card}" title="${tooltip}">
        <div class="cc-top">
          <span class="cc-emoji">${info.emoji}</span>
          <span class="cc-name">${COMBAT_CARD_NAMES[card]}</span>
          <span class="cc-type ${typeCls}">${info.type}</span>
        </div>
        <div class="cc-desc">${info.desc}</div>
        <div class="cc-footer">
          <span>伤${base.damage}</span>
          <span>P${base.priority}</span>
          ${dmgMod !== 0 ? `<span class="cc-mod ${dmgMod > 0 ? 'buff' : 'nerf'}">${dmgMod > 0 ? '+' : ''}${dmgMod}伤</span>` : ''}
        </div>
        ${weakCls ? '<div class="cc-weak-tag">⚠ 距离不佳</div>' : ''}
      </div>
    `;
  }).join('');
}
// ─── Center Area ───
function buildCenterArea(state, uiState) {
  const spectator = uiState.spectator;
  return `
    <div class="center-area">
      ${uiState.isPaused ? '<div class="paused-banner">⏸ 已暂停 — 点击「继续」恢复</div>' : ''}
      ${spectator ? '' : buildSituationHint(state)}
      <div class="arena-wrapper">
        ${buildBattleArena(state, spectator)}
        ${buildLastRoundResult(state, spectator)}
      </div>
      ${buildArenaZoneRibbon(state, spectator)}
      ${buildBattleLog(state)}
    </div>
  `;
}

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

  if (pInAdv && !aInAdv) {
    hints.push('✅ 你在优势间距！攻击伤害加成');
  } else if (aInAdv && !pInAdv) {
    hints.push('⚠️ 对手在优势间距！考虑用身法调整间距');
  } else if (pInAdv && aInAdv) {
    hints.push('⚔️ 双方都在优势区，正面较量！');
  } else if (pInDis) {
    hints.push('❌ 你在劣势区，攻击受削弱！');
  }

  if (p.stance >= 4) {
    hints.push('🔴 你架势快满了！被攻击可能触发处决(-5血)');
  } else if (ai.stance >= 4) {
    hints.push('🟢 对手架势快满了！攻击/擒拿可触发处决');
  }

  if (p.stamina <= 1) {
    hints.push('🔋 体力不足！只能扎马，无法进退');
  } else if (ai.stamina <= 1) {
    hints.push('🎯 对手体力不足！无法移动，趁机调整间距');
  }

  if (p.staggered) {
    hints.push('😵 僵直中！本回合无法使用攻击卡');
  }
  if (ai.staggered) {
    hints.push('💥 对手僵直！无法使用攻击卡，进攻好时机');
  }

  if (hints.length === 0) {
    hints.push('💡 选择1张身法卡 + 1张攻防卡，点确认出牌');
  }

  // Build weapon trait activation tags
  const traits = getActiveTraits(p.weapon, dist);
  const traitHtml = traits.length > 0
    ? `<div class="trait-tags">${traits.map(t => `<span class="trait-tag ${t.cls}">${t.icon} ${t.text}</span>`).join('')}</div>`
    : '';

  return `<div class="situation-hint">${hints.join('<span class="hint-sep">|</span>')}</div>${traitHtml}`;
}

function buildArenaZoneRibbon(state, spectator = false) {
  const pZones = WEAPON_ZONES[state.player.weapon];
  const aZones = WEAPON_ZONES[state.ai.weapon];
  const dist = state.distance;
  const pIcon = spectator ? '🤖左' : '👤';
  const aIcon = spectator ? '🤖右' : '🤖';

  const buildRow = (label, zones) => {
    const cells = [0, 1, 2, 3].map(d => {
      const isAdv = zones.advantage.includes(d);
      const isDis = zones.disadvantage.includes(d);
      const isCur = d === dist;
      let cls = 'azr-cell';
      if (isAdv) cls += ' azr-adv';
      else if (isDis) cls += ' azr-dis';
      if (isCur) cls += ' azr-current';
      const mark = isAdv ? '★' : isDis ? '✗' : '';
      return `<span class="${cls}">${mark}${DISTANCE_NAMES[d]}</span>`;
    }).join('');
    return `<div class="azr-row"><span class="azr-label">${label}</span>${cells}</div>`;
  };

  return `
    <div class="arena-zone-ribbon">
      ${buildRow(pIcon, pZones)}
      ${buildRow(aIcon, aZones)}
    </div>
  `;
}

function buildBattleArena(state, spectator = false) {
  const MAX_HP = gameConfig.MAX_HP;
  const MAX_STANCE = gameConfig.MAX_STANCE;
  const pos = FIGHTER_POSITIONS[state.distance] || FIGHTER_POSITIONS[2];
  const pHpPct = (state.player.hp / MAX_HP * 100).toFixed(0);
  const aHpPct = (state.ai.hp / MAX_HP * 100).toFixed(0);
  const pStPct = (state.player.stance / MAX_STANCE * 100).toFixed(0);
  const aStPct = (state.ai.stance / MAX_STANCE * 100).toFixed(0);

  const lineLeft = pos.player;
  const lineWidth = pos.ai - pos.player;

  const playerLabel = spectator ? '左方' : '玩家';
  const aiLabel = state.aiName || (spectator ? '右方' : 'AI');
  const playerBody = state.player.staggered ? '😵' : (spectator ? '🤖' : '🧑');
  const aiBody = state.ai.staggered ? '😵' : (state.aiName ? '👤' : '🤖');

  return `
    <div class="battle-arena">
      <div class="arena-title">⚔️ 战斗场景</div>
      <div class="arena-stage dist-${state.distance}" id="arena-stage" style="--arena-cam:${state.distance}">
        <div class="arena-parallax-far"></div>
        <div class="arena-parallax-mid"></div>
        <div class="arena-dist-label">${DISTANCE_NAMES[state.distance]}</div>
        <div class="arena-dist-line" style="left:${lineLeft}%;width:${lineWidth}%"></div>
        <div class="fighter player-fighter" id="player-fighter" style="left:${pos.player}%">
          <div class="fighter-weapon-icon">${WEAPON_EMOJI[state.player.weapon] || '🗡️'}</div>
          <div class="fighter-body">${playerBody}</div>
          <div class="fighter-label">${playerLabel}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-p" style="width:${pHpPct}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${pStPct}%"></div></div>
          </div>
        </div>
        <div class="fighter ai-fighter" id="ai-fighter" style="left:${pos.ai}%">
          <div class="fighter-weapon-icon">${WEAPON_EMOJI[state.ai.weapon] || '🔱'}</div>
          <div class="fighter-body">${aiBody}</div>
          <div class="fighter-label">${aiLabel}</div>
          <div class="mini-bars">
            <div class="mini-bar"><div class="mini-bar-fill hp-a" style="width:${aHpPct}%"></div></div>
            <div class="mini-bar"><div class="mini-bar-fill stance-f" style="width:${aStPct}%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildLastRoundResult(state, spectator = false) {
  if (state.history.length === 0) {
    return `<div class="round-result-banner">${spectator ? '等待开战...' : '等待出牌...'}</div>`;
  }
  const last = state.history[state.history.length - 1];
  const pDistName = DISTANCE_CARD_NAMES[last.playerDistance];
  const pCombatName = COMBAT_CARD_NAMES[last.playerCombat];
  const aDistName = DISTANCE_CARD_NAMES[last.aiDistance];
  const aCombatName = COMBAT_CARD_NAMES[last.aiCombat];
  const pEmoji = COMBAT_CARD_INFO[last.playerCombat] ? COMBAT_CARD_INFO[last.playerCombat].emoji : '';
  const aEmoji = COMBAT_CARD_INFO[last.aiCombat] ? COMBAT_CARD_INFO[last.aiCombat].emoji : '';
  const pIcon = spectator ? '🤖' : '👤';

  return `
    <div class="round-result-banner">
      <span class="rrb-label">第${state.round}回合</span>
      <span class="rrb-player">${pIcon} ${pDistName}+${pEmoji}${pCombatName}</span>
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

// ─── Spectator Left Panel (AI vs AI) ───
function buildSpectatorLeftPanel(state, uiState) {
  const p = state.player;
  const stagger = p.staggered ? '<span class="stagger-badge">⚠ 僵直</span>' : '';

  return `
    <div class="side-panel player-side">
      <div class="panel-header">
        <span class="panel-icon">🤖</span>
        <span class="panel-name">左方 ${stagger}</span>
        <span class="weapon-badge">${WEAPON_EMOJI[p.weapon] || ''} ${WEAPON_NAMES[p.weapon]}</span>
      </div>
      ${buildStatBars(p, 'player')}
      ${buildWeaponZoneStrip(p.weapon, state.distance)}
      <div class="divider"></div>
      ${buildPlayerLastAction(state)}
      <div class="divider"></div>
      ${buildSpeedControls(uiState)}
    </div>
  `;
}

function buildPlayerLastAction(state) {
  if (state.history.length === 0) {
    return `
      <div class="ai-last-action">
        <div class="ala-title">🀴 左方上回合</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;
  }
  const last = state.history[state.history.length - 1];
  const distInfo = DISTANCE_CARD_INFO[last.playerDistance];
  const combatInfo = COMBAT_CARD_INFO[last.playerCombat];
  return `
    <div class="ai-last-action">
      <div class="ala-title">🀴 左方上回合</div>
      <div class="ala-cards">
        <div class="ala-card">${distInfo.emoji} ${DISTANCE_CARD_NAMES[last.playerDistance]}</div>
        <div class="ala-card">${combatInfo.emoji} ${COMBAT_CARD_NAMES[last.playerCombat]} <span class="cc-type ${combatInfo.type === '攻' ? 'atk' : 'def'}">${combatInfo.type}</span></div>
      </div>
    </div>
  `;
}

function buildSpeedControls(uiState) {
  const speeds = [
    { label: '慢速', value: 2000 },
    { label: '正常', value: 800 },
    { label: '快速', value: 100 },
    { label: '极速', value: 0 },
  ];
  return `
    <div class="speed-controls">
      <div class="speed-title">⏩ 播放速度</div>
      <div class="speed-btns">
        ${speeds.map(s =>
          `<button class="speed-btn ${uiState.autoPlaySpeed === s.value ? 'active' : ''}" data-speed="${s.value}">${s.label}</button>`
        ).join('')}
      </div>
    </div>
  `;
}

// ─── AI Panel (Right) ───
function buildAiPanel(state, spectator = false) {
  const ai = state.ai;
  const stagger = ai.staggered ? '<span class="stagger-badge">⚠ 僵直</span>' : '';
  const icon = state.aiName ? '👤' : '🤖';
  const name = state.aiName || (spectator ? '右方' : 'AI');
  const actionTitle = spectator ? '🀴 右方上回合出牌' : '🀴 AI上回合出牌';

  return `
    <div class="side-panel ai-side">
      <div class="panel-header">
        <span class="panel-icon">${icon}</span>
        <span class="panel-name">${name} ${stagger}</span>
        <span class="weapon-badge">${WEAPON_EMOJI[ai.weapon] || ''} ${WEAPON_NAMES[ai.weapon]}</span>
      </div>
      ${buildStatBars(ai, 'ai')}
      ${buildWeaponZoneStrip(ai.weapon, state.distance)}
      <div class="divider"></div>
      ${buildAiLastAction(state, actionTitle)}
      <div class="divider"></div>
      ${buildHistoryPanel(state, spectator)}
    </div>
  `;
}

function buildAiLastAction(state, title) {
  const actionTitle = title || '🀴 AI上回合出牌';
  if (state.history.length === 0) {
    return `
      <div class="ai-last-action">
        <div class="ala-title">${actionTitle}</div>
        <div class="ala-waiting">等待第一回合...</div>
      </div>
    `;
  }
  const last = state.history[state.history.length - 1];
  const distInfo = DISTANCE_CARD_INFO[last.aiDistance];
  const combatInfo = COMBAT_CARD_INFO[last.aiCombat];
  return `
    <div class="ai-last-action">
      <div class="ala-title">${actionTitle}</div>
      <div class="ala-cards">
        <div class="ala-card">${distInfo.emoji} ${DISTANCE_CARD_NAMES[last.aiDistance]}</div>
        <div class="ala-card">${combatInfo.emoji} ${COMBAT_CARD_NAMES[last.aiCombat]} <span class="cc-type ${combatInfo.type === '攻' ? 'atk' : 'def'}">${combatInfo.type}</span></div>
      </div>
    </div>
  `;
}

function buildHistoryPanel(state, spectator = false) {
  const pIcon = spectator ? '🤖左' : '👤';
  const aIcon = spectator ? '🤖右' : '🤖';
  const items = state.history.map((h, i) => {
    const pDist = DISTANCE_CARD_NAMES[h.playerDistance];
    const pCombat = COMBAT_CARD_NAMES[h.playerCombat];
    const aDist = DISTANCE_CARD_NAMES[h.aiDistance];
    const aCombat = COMBAT_CARD_NAMES[h.aiCombat];
    const pEmoji = COMBAT_CARD_INFO[h.playerCombat] ? COMBAT_CARD_INFO[h.playerCombat].emoji : '';
    const aEmoji = COMBAT_CARD_INFO[h.aiCombat] ? COMBAT_CARD_INFO[h.aiCombat].emoji : '';
    const interrupted = h.pMoveInterrupted ? ' 🔙' : '';
    const aiInterrupted = h.aMoveInterrupted ? ' 🔙' : '';
    return `
      <div class="history-item history-clickable" data-round-idx="${i}" title="点击查看本回合详细解释">
        <div class="h-round">回合 ${i + 1} <span class="h-explain-hint">🔍</span></div>
        <div class="h-player">${pIcon} ${pDist} + ${pEmoji} ${pCombat}${interrupted}</div>
        <div class="h-ai">${aIcon} ${aDist} + ${aEmoji} ${aCombat}${aiInterrupted}</div>
      </div>
    `;
  }).reverse().join('');

  return `
    <div class="history-section">
      <div class="history-title">📜 历史记录 <span class="history-hint">点击回合查看详情</span></div>
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
        <span>身法控距</span>为第一核心 |
        <span>双向架势</span>为胜负根基 |
        <span>攻防预判</span>为博弈循环
      </div>
      <button class="btn-rules" data-action="rules">📖 完整规则</button>
    </div>
  `;
}

// ─── Tutorial Modal (tabbed: 新手入门 / 完整规则) ───
function buildTutorialModal() {
  return `
    <div class="modal-overlay" id="modal-tutorial">
      <div class="modal-box modal-box-wide">
        <div class="modal-header">
          <div class="modal-tabs">
            <button class="modal-tab active" data-tab="guide">📚 新手入门</button>
            <button class="modal-tab" data-tab="rules">📖 完整规则</button>
          </div>
          <button class="modal-close" data-close="tutorial">✕</button>
        </div>
        <div class="modal-content-text tab-content active" id="tab-guide">
          ${buildGuideContent()}
        </div>

        <!-- Tab: 完整规则 -->
        <div class="modal-content-text tab-content" id="tab-rules">
          ${buildRulesContent()}
        </div>
      </div>
    </div>
  `;
}

// ─── Round Detail Modal ───
function buildRoundDetailModal() {
  return `
    <div class="modal-overlay" id="modal-round-detail">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="round-detail-title">🔍 回合详情</div>
          <button class="modal-close" data-close="round-detail">关闭</button>
        </div>
        <div class="modal-content-text" id="round-detail-content"></div>
      </div>
    </div>
  `;
}

function explainOneSidedCard(side, card, ownWeapon, oppWeapon, dist, cardNames, weaponNames) {
  const lbl = side === 'player' ? '玩家' : 'AI';
  const name = cardNames[card];
  if (card === CombatCard.BLOCK || card === CombatCard.DEFLECT) {
    return `${lbl}出 <strong>${name}</strong>：<span style="color:#aaa">防守落空（无攻击可接）</span>`;
  }
  if (card === CombatCard.SLASH) {
    const base = COMBAT_CARD_BASE[CombatCard.SLASH].damage;
    const mod = getDamageModifier(ownWeapon, dist, CombatCard.SLASH);
    const dmg = Math.max(0, base + mod);
    return `${lbl}出 <strong>${name}</strong> 命中（对手无防守）：对手受 <strong>${dmg} 伤 +1 架势</strong>`;
  }
  if (card === CombatCard.THRUST) {
    const base = COMBAT_CARD_BASE[CombatCard.THRUST].damage;
    const mod = getDamageModifier(ownWeapon, dist, CombatCard.THRUST);
    const dmg = Math.max(0, base + mod);
    return `${lbl}出 <strong>${name}</strong> 命中（对手无防守）：对手受 <strong>${dmg} 伤 +1 架势</strong>`;
  }
  if (card === CombatCard.FEINT) {
    return `${lbl}出 <strong>${name}</strong>（对手无防守）：对手 <strong>+2 架势</strong>`;
  }
  return `${lbl}出 <strong>${name}</strong>`;
}

function showRoundExplanation(state, roundIdx) {
  const h = state.history[roundIdx];
  if (!h) return;

  const pDistName = DISTANCE_CARD_NAMES[h.playerDistance];
  const pCombatName = COMBAT_CARD_NAMES[h.playerCombat];
  const aDistName = DISTANCE_CARD_NAMES[h.aiDistance];
  const aCombatName = COMBAT_CARD_NAMES[h.aiCombat];
  const pEmoji = COMBAT_CARD_INFO[h.playerCombat]?.emoji || '';
  const aEmoji = COMBAT_CARD_INFO[h.aiCombat]?.emoji || '';
  const pW = state.player.weapon;
  const aW = state.ai.weapon;

  // Calculate distance before this round
  // Walk through history to reconstruct distance at each round
  let dist = gameConfig.INITIAL_DISTANCE ?? 2;
  for (let i = 0; i < roundIdx; i++) {
    const prev = state.history[i];
    const pDelta = DISTANCE_CARD_BASE[prev.playerDistance]?.delta ?? 0;
    const aDelta = DISTANCE_CARD_BASE[prev.aiDistance]?.delta ?? 0;
    dist = Math.max(0, Math.min(3, dist + pDelta + aDelta));
    // Account for interrupts: if a move was interrupted, undo that side's delta
    if (prev.pMoveInterrupted) dist = Math.max(0, Math.min(3, dist - pDelta));
    if (prev.aMoveInterrupted) dist = Math.max(0, Math.min(3, dist - aDelta));
  }
  const distBefore = dist;

  // Calculate distance after movement (before interrupt)
  const pDelta = DISTANCE_CARD_BASE[h.playerDistance]?.delta ?? 0;
  const aDelta = DISTANCE_CARD_BASE[h.aiDistance]?.delta ?? 0;
  const distAfterMove = Math.max(0, Math.min(3, distBefore + pDelta + aDelta));

  // Final distance after possible interrupt
  let distFinal = distAfterMove;
  if (h.pMoveInterrupted) distFinal = Math.max(0, Math.min(3, distFinal - pDelta));
  if (h.aMoveInterrupted) distFinal = Math.max(0, Math.min(3, distFinal - aDelta));

  const pAdvBefore = WEAPON_ZONES[pW]?.advantage.includes(distAfterMove);
  const aAdvBefore = WEAPON_ZONES[aW]?.advantage.includes(distAfterMove);

  // Build explanation
  const lines = [];

  lines.push(`<h4>📋 第 ${roundIdx + 1} 回合概要</h4>`);
  lines.push(`<div class="rd-cards">`);
  lines.push(`<div class="rd-card-row"><span class="rd-p">👤 玩家：</span>${pDistName} + ${pEmoji} ${pCombatName}（${WEAPON_EMOJI[pW]} ${WEAPON_NAMES[pW]}）</div>`);
  lines.push(`<div class="rd-card-row"><span class="rd-a">🤖 AI：</span>${aDistName} + ${aEmoji} ${aCombatName}（${WEAPON_EMOJI[aW]} ${WEAPON_NAMES[aW]}）</div>`);
  lines.push(`</div>`);

  // Step 1: Distance
  lines.push(`<h4>① 身法结算</h4>`);
  lines.push(`<ul>`);
  lines.push(`<li>回合前间距：<strong>${DISTANCE_NAMES[distBefore]}(${distBefore})</strong></li>`);
  if (pDelta !== 0 || aDelta !== 0) {
    lines.push(`<li>玩家${pDistName}(${pDelta > 0 ? '+' : ''}${pDelta}) + AI${aDistName}(${aDelta > 0 ? '+' : ''}${aDelta})</li>`);
    lines.push(`<li>移动后间距：<strong>${DISTANCE_NAMES[distAfterMove]}(${distAfterMove})</strong></li>`);
  } else if (h.playerDistance === 'dodge' || h.aiDistance === 'dodge') {
    const pDesc = h.playerDistance === 'dodge' ? '闪避' : '扎马';
    const aDesc = h.aiDistance === 'dodge' ? '闪避' : '扎马';
    lines.push(`<li>玩家${pDesc} + AI${aDesc}，间距不变</li>`);
  } else {
    lines.push(`<li>双方扎马，间距不变</li>`);
  }
  if (pAdvBefore) lines.push(`<li>✅ 玩家 ${WEAPON_NAMES[pW]} 在优势区</li>`);
  if (aAdvBefore) lines.push(`<li>⚠️ AI ${WEAPON_NAMES[aW]} 在优势区</li>`);
  lines.push(`</ul>`);

  // Step 2: Combat — account for dodge interactions
  lines.push(`<h4>② 攻防结算</h4>`);
  lines.push(`<ul>`);

  // ── Derive effective cards after dodge resolution ──
  const pDodging = h.playerDistance === DistanceCard.DODGE;
  const aDodging = h.aiDistance === DistanceCard.DODGE;
  let effectivePCard = h.playerCombat;
  let effectiveACard = h.aiCombat;
  const isAttack = c => CARD_TYPE_MAP[c] === CardType.ATTACK;

  // Player dodging
  if (pDodging) {
    if (h.aiCombat === CombatCard.FEINT) {
      lines.push(`<li>🎭 <strong>AI擒拿穿透闪避！</strong>玩家闪避落空，攻防正常结算</li>`);
    } else if (isAttack(h.aiCombat)) {
      if (h.aiCombat === CombatCard.THRUST && canThrustBreakDodge(aW, distAfterMove)) {
        lines.push(`<li>⚡ <strong>玩家闪避被AI轻击打断</strong>（优势区穿透）！双方攻防卡均取消</li>`);
        effectivePCard = null;
        effectiveACard = null;
      } else {
        lines.push(`<li>💨 <strong>玩家闪避成功！</strong>AI的${COMBAT_CARD_NAMES[h.aiCombat]}被完全破解</li>`);
        effectiveACard = null;
      }
    } else {
      lines.push(`<li>💨 玩家闪避落空（AI未出攻击牌），攻防正常结算</li>`);
    }
  }

  // AI dodging
  if (aDodging) {
    if (h.playerCombat === CombatCard.FEINT) {
      lines.push(`<li>🎭 <strong>玩家擒拿穿透闪避！</strong>AI闪避落空，攻防正常结算</li>`);
    } else if (isAttack(h.playerCombat)) {
      if (h.playerCombat === CombatCard.THRUST && canThrustBreakDodge(pW, distAfterMove)) {
        lines.push(`<li>⚡ <strong>AI闪避被玩家轻击打断</strong>（优势区穿透）！双方攻防卡均取消</li>`);
        effectivePCard = null;
        effectiveACard = null;
      } else {
        lines.push(`<li>💨 <strong>AI闪避成功！</strong>玩家的${COMBAT_CARD_NAMES[h.playerCombat]}被完全破解</li>`);
        effectivePCard = null;
      }
    } else {
      lines.push(`<li>💨 AI闪避落空（玩家未出攻击牌），攻防正常结算</li>`);
    }
  }

  // ── Show effective card resolution ──
  if (effectivePCard && effectiveACard) {
    const combatExplanation = explainCombatMatchup(effectivePCard, effectiveACard, pW, aW, distAfterMove);
    combatExplanation.forEach(l => lines.push(`<li>${l}</li>`));
  } else if (effectivePCard && !effectiveACard) {
    // Player's card fires one-sided (AI card cancelled by dodge)
    lines.push(`<li>${explainOneSidedCard('player', effectivePCard, pW, aW, distAfterMove, COMBAT_CARD_NAMES, WEAPON_NAMES)}</li>`);
  } else if (!effectivePCard && effectiveACard) {
    // AI's card fires one-sided (player card cancelled by dodge)
    lines.push(`<li>${explainOneSidedCard('ai', effectiveACard, aW, pW, distAfterMove, COMBAT_CARD_NAMES, WEAPON_NAMES)}</li>`);
  } else {
    lines.push(`<li><span style="color:#aaa">双方攻防均被取消</span></li>`);
  }

  lines.push(`</ul>`);

  // Step 3: Interrupt
  if (h.pMoveInterrupted || h.aMoveInterrupted) {
    lines.push(`<h4>③ ⚡ 身法打断</h4>`);
    lines.push(`<ul>`);
    if (h.pMoveInterrupted) {
      lines.push(`<li>玩家在移动中（${pDistName}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`);
    }
    if (h.aMoveInterrupted) {
      lines.push(`<li>AI在移动中（${aDistName}）受到HP伤害 → <strong>移动被取消</strong>，间距回退</li>`);
    }
    lines.push(`<li>最终间距：<strong>${DISTANCE_NAMES[distFinal]}(${distFinal})</strong></li>`);
    lines.push(`</ul>`);
  }

  // Summary
  lines.push(`<h4>📍 最终间距</h4>`);
  lines.push(`<p><strong>${DISTANCE_NAMES[distFinal]}(${distFinal})</strong></p>`);

  const titleEl = document.getElementById('round-detail-title');
  const contentEl = document.getElementById('round-detail-content');
  if (titleEl) titleEl.textContent = `🔍 第 ${roundIdx + 1} 回合详解`;
  if (contentEl) contentEl.innerHTML = lines.join('\n');
  toggleModal('modal-round-detail', true);
}

// ═══════ Event Binding ═══════
function bindAllEvents(state, selection, uiState, callbacks) {
  document.querySelectorAll('.dist-card:not(.disabled), .combat-card:not(.disabled)').forEach(el => {
    el.addEventListener('click', () => {
      callbacks.onSelect(el.dataset.type, el.dataset.card);
    });
  });

  const confirmBtn = document.getElementById('btn-confirm');
  if (confirmBtn && !confirmBtn.disabled) {
    confirmBtn.addEventListener('click', () => callbacks.onConfirm());
  }

  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.dataset.action;
    if (action === 'volume') {
      el.addEventListener('input', () => {
        setSfxVolume(parseInt(el.value) / 100);
      });
      return;
    }
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'click', () => {
      switch(action) {
        case 'tutorial': toggleModal('modal-tutorial', true); switchTab('guide'); break;
        case 'rules': toggleModal('modal-tutorial', true); switchTab('rules'); break;
        case 'newgame': callbacks.onNewGame(); break;
        case 'reset': callbacks.onReset(); break;
        case 'pause': callbacks.onTogglePause(); break;
        case 'undo': callbacks.onUndo(); break;
        case 'togglemute':
          setMuted(!isMuted());
          el.textContent = isMuted() ? '🔇' : '🔊';
          break;
        case 'difficulty':
          callbacks.onDifficultyChange(parseInt(el.value));
          break;
      }
    });
  });

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      toggleModal('modal-' + el.dataset.close, false);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  // Tab switching in tutorial modal
  document.querySelectorAll('#modal-tutorial .modal-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // History round click -> explain
  document.querySelectorAll('.history-clickable').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.roundIdx);
      showRoundExplanation(state, idx);
    });
  });

  // Speed controls (spectator mode)
  document.querySelectorAll('.speed-btn').forEach(el => {
    el.addEventListener('click', () => {
      if (callbacks.onSpeedChange) callbacks.onSpeedChange(parseInt(el.dataset.speed));
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

function switchTab(tabName) {
  document.querySelectorAll('#modal-tutorial .modal-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  document.querySelectorAll('#modal-tutorial .tab-content').forEach(c => {
    c.classList.toggle('active', c.id === 'tab-' + tabName);
  });
}

// ═══════ Render: Result Screen ═══════
export function renderResult(app, state, onRestart, onBack) {
  const MAX_HP = gameConfig.MAX_HP;
  const spectator = state.spectatorMode;
  let title, cls;
  if (spectator) {
    if (state.winner === 'player') { title = '🏆 左方胜出！'; cls = 'win'; }
    else if (state.winner === 'ai') { title = '🏆 右方胜出！'; cls = 'lose'; }
    else { title = '🤝 平局'; cls = 'draw'; }
  } else {
    if (state.winner === 'player') { title = '🏆 胜利！'; cls = 'win'; }
    else if (state.winner === 'ai') { title = '💀 败北'; cls = 'lose'; }
    else { title = '🤝 平局'; cls = 'draw'; }
  }

  const pLabel = spectator ? '🤖 左方' : '👤';
  const aLabel = spectator ? '🤖 右方' : (state.aiName ? '👤' : '🤖');
  const aName = spectator ? '右方' : (state.aiName || 'AI');

  const center = document.querySelector('.center-area');
  if (!center) return;

  const banner = document.createElement('div');
  banner.className = 'game-over-banner ' + cls;
  banner.innerHTML = `
    <div class="gob-title">${title}</div>
    <div class="gob-stats">
      回合${state.round} ｜ 
      ${pLabel} HP ${state.player.hp}/${MAX_HP} ｜ 
      ${aLabel} ${aName} HP ${state.ai.hp}/${MAX_HP}
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

// ═══════ Scroll Log ═══════
export function scrollLogToBottom() {
  const log = document.getElementById('battle-log');
  if (log) log.scrollTop = log.scrollHeight;
}

