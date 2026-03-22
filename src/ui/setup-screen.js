import { WeaponType } from '../types.js';
import { WEAPON_NAMES, WEAPON_EMOJI } from '../constants.js';
import { buildWeaponZoneStrip, buildWeaponPickCard } from './weapon-display.js';
import { showSimulationModal } from '../simulator.js';
import { showConfigModal } from './modals.js';
import { buildGuideContent, buildRulesContent } from './tutorial-content.js';

// ═══════ Title Screen ═══════

export function renderTitleScreen(app, callbacks) {
  app.innerHTML = `
    <div class="title-screen">
      <h1>⚔️ 冷刃博弈</h1>
      <p class="subtitle">以「身法控距」为核心的回合制冷兵器对战</p>
      <div class="mode-cards">
        <div class="mode-card" id="mode-tower">
          <div class="mc-icon">🗼</div>
          <div class="mc-name">江湖行</div>
          <div class="mc-desc">十关闯荡，逐层挑战<br/>体验完整的江湖历程</div>
        </div>
        <div class="mode-card" id="mode-battle">
          <div class="mc-icon">⚔</div>
          <div class="mc-name">自由对战</div>
          <div class="mc-desc">自选兵器与难度<br/>自由切磋，钻研武学</div>
        </div>
      </div>
      <div class="title-btns">
        <button id="btn-title-tutorial">📖 新手引导</button>
        <button id="btn-title-sim">📊 对战模拟</button>
        <button id="btn-title-config">⚙️ 参数配置</button>
      </div>
    </div>
  `;

  document.getElementById('mode-tower').addEventListener('click', callbacks.onTower);
  document.getElementById('mode-battle').addEventListener('click', callbacks.onBattle);
  document.getElementById('btn-title-tutorial').addEventListener('click', () => showTutorialPopup());
  document.getElementById('btn-title-sim').addEventListener('click', () => showSimulationModal());
  document.getElementById('btn-title-config').addEventListener('click', () => showConfigModal());
}

// ═══════ Free Battle Setup ═══════

export function renderBattleSetup(app, onStart, onBack) {
  const defaultPlayer = WeaponType.SHORT_BLADE;
  const defaultAi = WeaponType.SPEAR;

  app.innerHTML = `
    <div class="mode-setup">
      <button class="back-link" id="btn-back">← 返回</button>
      <h2>⚔ 自由对战</h2>
      <div class="battle-setup-cols">
        <div class="setup-weapon-col">
          <div class="setup-col-title">👤 你的兵器</div>
          <select id="sel-player" class="setup-select">
            ${Object.entries(WEAPON_NAMES).map(([k, v]) =>
              `<option value="${k}">${WEAPON_EMOJI[k] || ''} ${v}</option>`
            ).join('')}
          </select>
          <div id="player-wz">${buildWeaponZoneStrip(defaultPlayer)}</div>
        </div>
        <div class="setup-vs">VS</div>
        <div class="setup-weapon-col">
          <div class="setup-col-title">🤖 对手兵器</div>
          <select id="sel-ai" class="setup-select">
            ${Object.entries(WEAPON_NAMES).map(([k, v]) =>
              `<option value="${k}">${WEAPON_EMOJI[k] || ''} ${v}</option>`
            ).join('')}
          </select>
          <div id="ai-wz">${buildWeaponZoneStrip(defaultAi)}</div>
        </div>
      </div>
      <div class="setup-row-center">
        <label>AI 难度</label>
        <select id="sel-level" class="setup-select">
          <option value="1">1 - 纯随机</option>
          <option value="2">2 - 基础规则</option>
          <option value="3" selected>3 - 简单策略</option>
          <option value="4">4 - 普通策略</option>
          <option value="5">5 - 高级策略</option>
          <option value="6">6 - 顶级高手</option>
        </select>
      </div>
      <button class="primary-btn" id="btn-start">开始对局</button>
    </div>
  `;

  document.getElementById('sel-ai').value = defaultAi;

  document.getElementById('sel-player').addEventListener('change', e => {
    document.getElementById('player-wz').innerHTML = buildWeaponZoneStrip(e.target.value);
  });
  document.getElementById('sel-ai').addEventListener('change', e => {
    document.getElementById('ai-wz').innerHTML = buildWeaponZoneStrip(e.target.value);
  });
  document.getElementById('btn-start').addEventListener('click', () => {
    onStart(
      document.getElementById('sel-player').value,
      document.getElementById('sel-ai').value,
      parseInt(document.getElementById('sel-level').value)
    );
  });
  document.getElementById('btn-back').addEventListener('click', onBack);
}

// ═══════ Tower Weapon Select ═══════

export function renderTowerWeaponSelect(app, onStart, onBack) {
  let selected = WeaponType.SHORT_BLADE;

  function draw() {
    app.innerHTML = `
      <div class="mode-setup">
        <button class="back-link" id="btn-back">← 返回</button>
        <h2>🗼 江湖行 — 选择你的兵器</h2>
        <p class="setup-hint">兵器将伴随你走完全部十关</p>
        <div class="weapon-pick-grid">
          ${Object.values(WeaponType).map(w => buildWeaponPickCard(w, w === selected)).join('')}
        </div>
        <div id="weapon-preview">${buildWeaponZoneStrip(selected)}</div>
        <button class="primary-btn" id="btn-start">⚔ 启程</button>
      </div>
    `;

    document.querySelectorAll('.weapon-pick-btn').forEach(el => {
      el.addEventListener('click', () => {
        selected = el.dataset.weapon;
        draw();
      });
    });
    document.getElementById('btn-start').addEventListener('click', () => onStart(selected));
    document.getElementById('btn-back').addEventListener('click', onBack);
  }

  draw();
}

// ═══════ Standalone Tutorial Popup ═══════

function showTutorialPopup(initialTab = 'guide') {
  const old = document.getElementById('standalone-tutorial');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'standalone-tutorial';
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal-box modal-box-wide">
      <div class="modal-header">
        <div class="modal-tabs">
          <button class="modal-tab ${initialTab === 'guide' ? 'active' : ''}" data-tab="guide">📚 新手入门</button>
          <button class="modal-tab ${initialTab === 'rules' ? 'active' : ''}" data-tab="rules">📖 完整规则</button>
        </div>
        <button class="modal-close" id="tut-close">✕</button>
      </div>

      <!-- Tab: 新手入门 -->
      <div class="modal-content-text tab-content ${initialTab === 'guide' ? 'active' : ''}" id="setup-tab-guide">
        ${buildGuideContent()}
      </div>

      <!-- Tab: 完整规则 -->
      <div class="modal-content-text tab-content ${initialTab === 'rules' ? 'active' : ''}" id="setup-tab-rules">
        ${buildRulesContent()}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.getElementById('tut-close').addEventListener('click', () => overlay.remove());
  // Tab switching
  overlay.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t === tab));
      overlay.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'setup-tab-' + tab.dataset.tab));
    });
  });
}
