import { WEAPON_EMOJI, WEAPON_NAMES, gameConfig } from '../constants.js';
import { buildWeaponZoneStrip } from '../ui/weapon-display.js';
import { TOWER_FLOORS, HP_RECOVERY_PER_FLOOR } from './tower.js';
import { sfxClick, sfxTowerVictory, sfxGameOver } from '../ui/sound.js';

// ═══════ Floor Introduction Screen ═══════

export function renderFloorIntro(app, towerState, floorData, onFight, onBack) {
  const MAX_HP = gameConfig.MAX_HP;
  const floorNum = towerState.currentFloor + 1;
  const wEmoji = WEAPON_EMOJI[floorData.weapon] || '❓';
  const wName = WEAPON_NAMES[floorData.weapon] || '???';
  const pEmoji = WEAPON_EMOJI[towerState.playerWeapon] || '🗡️';
  const pName = WEAPON_NAMES[towerState.playerWeapon] || '???';

  app.innerHTML = `
    <div class="tower-screen">
      <div class="tower-floor-header">🗼 江湖行 · 第 ${floorNum} / ${TOWER_FLOORS.length} 关</div>
      <div class="tower-progress">
        ${TOWER_FLOORS.map((_, i) =>
          `<span class="tp-dot ${i < towerState.currentFloor ? 'tp-done' : i === towerState.currentFloor ? 'tp-cur' : ''}">${i + 1}</span>`
        ).join('')}
      </div>
      <div class="tower-npc-display">
        <div class="tower-npc-weapon">${wEmoji}</div>
        <div class="tower-npc-name">${floorData.npc}</div>
        <div class="tower-npc-title">「${floorData.title}」</div>
        <div class="tower-npc-wp">持 ${wEmoji} ${wName}</div>
      </div>
      <div class="tower-quote">❝ ${floorData.taunt} ❞</div>
      <div class="tower-story">${floorData.intro}</div>
      <div class="tower-player-info">
        <div class="tower-hp">❤️ 你的气血: <strong>${towerState.playerHp}</strong> / ${MAX_HP}</div>
        <div class="tower-your-weapon">${pEmoji} ${pName}</div>
      </div>
      <div class="tower-matchup">
        ${buildWeaponZoneStrip(towerState.playerWeapon)}
        <div class="tower-matchup-vs">VS</div>
        ${buildWeaponZoneStrip(floorData.weapon)}
      </div>
      <button class="primary-btn" id="btn-fight">⚔ 应战</button>
      <button class="link-btn" id="btn-back">放弃 · 返回</button>
    </div>
  `;

  document.getElementById('btn-fight').addEventListener('click', () => { sfxClick(); onFight(); });
  document.getElementById('btn-back').addEventListener('click', () => { sfxClick(); onBack(); });
}

// ═══════ Between-Floors Screen ═══════

export function renderTowerBetween(app, towerState, prevHp, onContinue) {
  const MAX_HP = gameConfig.MAX_HP;
  const floorNum = towerState.currentFloor;
  const prevFloor = TOWER_FLOORS[floorNum - 1];
  const actualHeal = MAX_HP - prevHp;

  const nextFloor = TOWER_FLOORS[floorNum];
  let nextPreview = '';
  if (nextFloor) {
    const nwEmoji = WEAPON_EMOJI[nextFloor.weapon] || '❓';
    const nwName = WEAPON_NAMES[nextFloor.weapon] || '???';
    nextPreview = `
      <div class="tower-next-preview">
        <div class="tower-next-label">下一关: 第 ${floorNum + 1} 关</div>
        <div class="tower-next-npc">${nextFloor.npc} 「${nextFloor.title}」</div>
        <div class="tower-next-wp">${nwEmoji} ${nwName}</div>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="tower-screen">
      <div class="tower-floor-header">✅ 第 ${floorNum} 关 — 胜利!</div>
      <div class="tower-between-msg">${prevFloor.npc} 已被击败</div>
      <div class="tower-between-hp">
        ❤️ 恢复气血 <span class="heal">已回满</span>
        <br/>
        ❤️ 当前气血: ${prevHp} → <strong>${towerState.playerHp}</strong> / ${MAX_HP}
      </div>
      ${nextPreview}
      <button class="primary-btn" id="btn-continue">继续前进 →</button>
    </div>
  `;

  document.getElementById('btn-continue').addEventListener('click', onContinue);
}

// ═══════ Tower Victory Screen ═══════

export function renderTowerVictory(app, towerState, onBack) {
  const pName = WEAPON_NAMES[towerState.playerWeapon];
  const pEmoji = WEAPON_EMOJI[towerState.playerWeapon];

  app.innerHTML = `
    <div class="tower-screen tower-victory">
      <h1>🏆 武林至尊</h1>
      <p class="tower-result-sub">击败全部 ${TOWER_FLOORS.length} 位强敌!</p>
      <div class="tower-result-stats">
        ❤️ 最终气血: ${towerState.playerHp} / ${gameConfig.MAX_HP}<br/>
        ${pEmoji} 使用兵器: ${pName}
      </div>
      <p class="tower-victory-msg">
        自此，江湖中流传着一个新的传说——<br/>
        一位持${pName}的无名侠客，从乡野一路打到山巅，<br/>
        击败了天下第一高手萧无名。
      </p>
      <button class="primary-btn" id="btn-back">🏠 返回</button>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', onBack);
}

// ═══════ Tower Game Over Screen ═══════

export function renderTowerGameOver(app, towerState, floorData, onRetry, onBack) {
  app.innerHTML = `
    <div class="tower-screen tower-gameover">
      <h1>💀 败北</h1>
      <p class="tower-result-sub">止步于第 ${towerState.currentFloor + 1} 关</p>
      <div class="tower-result-npc">
        败于 ${floorData.npc}「${floorData.title}」之手
      </div>
      <button class="primary-btn" id="btn-retry">🔄 重新挑战</button>
      <button class="link-btn" id="btn-back">🏠 返回</button>
    </div>
  `;

  document.getElementById('btn-retry').addEventListener('click', onRetry);
  document.getElementById('btn-back').addEventListener('click', onBack);
}
