import { initGame, executeRound } from './engine/game-engine.js';
import { aiDecide } from './ai/ai.js';
import { renderGame, renderResult, scrollLogToBottom } from './ui/renderer.js';
import { renderTitleScreen, renderBattleSetup, renderTowerWeaponSelect, renderAiVsAiSetup } from './ui/setup-screen.js';
import { playRoundAnimation } from './ui/animation.js';
import { showToast } from './ui/toast.js';
import { validateAction } from './engine/card-validator.js';
import { createTowerState, getTowerFloor, advanceTowerFloor, isTowerComplete } from './tower/tower.js';
import { renderFloorIntro, renderTowerBetween, renderTowerVictory, renderTowerGameOver } from './tower/tower-ui.js';
import { gameConfig } from './constants.js';
import { initConfig } from './config.js';
import { flipState, getValidAction } from './engine/simulation.js';
import { sfxCardSelect, sfxCardDeselect, sfxConfirm, sfxToastWarn,
  sfxVictory, sfxDefeat, sfxBattleStart, sfxClick, sfxFloorClear, sfxGameOver } from './ui/sound.js';

// 启动时恢复用户配置
initConfig();

const app = document.getElementById('app');

let gameState = null;
let prevState = null;
let selection = { distanceCard: null, combatCard: null };
let stateStack = [];
let isPaused = false;
let startConfig = null;
let animating = false;

// ═══════ AI vs AI (spectator) state ═══════
let spectatorMode = false;
let playerAiLevel = null;
let autoPlayTimer = null;
let autoPlaySpeed = 800;

// ═══════ Tower state ═══════
let towerState = null;
let towerFloorData = null;

// ═══════ UI helpers ═══════
function getUiState() {
  return {
    isPaused,
    canUndo: stateStack.length > 0,
    spectator: spectatorMode,
    autoPlaySpeed,
  };
}

function getCallbacks() {
  return {
    onSelect: handleSelect,
    onConfirm: handleConfirm,
    onUndo: handleUndo,
    onReset: handleReset,
    onNewGame: handleNewGame,
    onTogglePause: handleTogglePause,
    onDifficultyChange: handleDifficultyChange,
    onSpeedChange: handleSpeedChange,
  };
}

// ═══════ Title Screen ═══════
function showTitle() {
  resetGameVars();
  spectatorMode = false;
  playerAiLevel = null;
  towerState = null;
  towerFloorData = null;
  renderTitleScreen(app, {
    onTower: () => renderTowerWeaponSelect(app, startTower, showTitle),
    onBattle: () => renderBattleSetup(app, startBattle, showTitle),
    onAiVsAi: () => renderAiVsAiSetup(app, startAiVsAi, showTitle),
  });
}

function resetGameVars() {
  gameState = null;
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  stateStack = [];
  isPaused = false;
  animating = false;
  if (autoPlayTimer) { clearTimeout(autoPlayTimer); autoPlayTimer = null; }
}

// ═══════ Free Battle Mode ═══════
function startBattle(playerWeapon, aiWeapon, aiLevel) {
  towerState = null;
  startConfig = { playerWeapon, aiWeapon, aiLevel };
  resetGameVars();
  gameState = initGame(playerWeapon, aiWeapon, aiLevel);
  sfxBattleStart();
  render();
}

// ═══════ Tower Mode ═══════
function startTower(playerWeapon) {
  towerState = createTowerState(playerWeapon);
  startConfig = null;
  showFloorIntro();
}

function showFloorIntro() {
  towerFloorData = getTowerFloor(towerState);
  if (!towerFloorData) {
    renderTowerVictory(app, towerState, showTitle);
    return;
  }
  renderFloorIntro(app, towerState, towerFloorData, startFloorBattle, showTitle);
}

function startFloorBattle() {
  const fd = towerFloorData;
  resetGameVars();
  gameState = initGame(towerState.playerWeapon, fd.weapon, fd.aiLevel);
  gameState.aiName = fd.npc;
  gameState.aiTitle = fd.title;
  // Carry over tower HP
  gameState.player.hp = towerState.playerHp;
  startConfig = null;  // prevent "restart same" in tower mode
  sfxBattleStart();
  render();
}

function handleTowerBattleEnd() {
  if (!towerState) return;

  if (gameState.winner === 'player') {
    const prevHp = towerState.playerHp;
    towerState = advanceTowerFloor(towerState, gameState.player.hp);
    if (isTowerComplete(towerState)) {
      sfxVictory();
      renderTowerVictory(app, towerState, showTitle);
    } else {
      sfxFloorClear();
      renderTowerBetween(app, towerState, prevHp, showFloorIntro);
    }
  } else {
    sfxGameOver();
    towerState.gameOver = true;
    renderTowerGameOver(app, towerState, towerFloorData,
      () => startTower(towerState.playerWeapon), showTitle);
  }
}

// ═══════ Shared game logic ═══════
function render() {
  renderGame(app, gameState, selection, getUiState(), getCallbacks());
  scrollLogToBottom();
}

function handleSelect(type, card) {
  if (animating || isPaused || gameState.gameOver) return;
  if (type === 'distance') {
    if (selection.distanceCard === card) { sfxCardDeselect(); selection.distanceCard = null; }
    else { sfxCardSelect(); selection.distanceCard = card; }
  } else {
    if (selection.combatCard === card) { sfxCardDeselect(); selection.combatCard = null; }
    else { sfxCardSelect(); selection.combatCard = card; }
  }
  render();
}

async function handleConfirm() {
  if (animating || isPaused || gameState.gameOver) return;
  if (!selection.distanceCard || !selection.combatCard) return;

  const check = validateAction(selection.distanceCard, selection.combatCard, gameState.player, gameState.distance);
  if (!check.valid) {
    sfxToastWarn();
    showToast(check.reason, 'warn');
    return;
  }

  sfxConfirm();

  stateStack.push(JSON.parse(JSON.stringify(gameState)));
  prevState = JSON.parse(JSON.stringify(gameState));

  const aiAction = aiDecide(gameState);
  const playerAction = { distanceCard: selection.distanceCard, combatCard: selection.combatCard };
  gameState = executeRound(gameState, playerAction, aiAction);

  selection = { distanceCard: null, combatCard: null };

  animating = true;
  const wrapper = app.querySelector('.game-wrapper');
  if (wrapper) wrapper.classList.add('animating');

  render();
  await playRoundAnimation(prevState, gameState);

  animating = false;
  if (wrapper) wrapper.classList.remove('animating');

  if (gameState.gameOver) {
    if (towerState) {
      handleTowerBattleEnd();
    } else {
      if (gameState.winner === 'player') sfxVictory(); else sfxDefeat();
      renderResult(app, gameState, handleRestartSame, showTitle);
    }
  }
}

function handleUndo() {
  if (stateStack.length === 0) return;
  gameState = stateStack.pop();
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  isPaused = false;
  render();
}

function handleReset() {
  if (towerState) {
    startFloorBattle();
  } else if (startConfig) {
    startBattle(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.aiLevel);
  }
}

function handleNewGame() {
  showTitle();
}

function handleRestartSame() {
  if (startConfig) {
    if (spectatorMode && startConfig.playerAiLevel != null) {
      startAiVsAi(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.playerAiLevel, startConfig.aiLevel);
    } else {
      startBattle(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.aiLevel);
    }
  } else {
    showTitle();
  }
}

function handleTogglePause() {
  if (gameState.gameOver) return;
  isPaused = !isPaused;
  render();
  if (spectatorMode) {
    if (isPaused) {
      if (autoPlayTimer) { clearTimeout(autoPlayTimer); autoPlayTimer = null; }
    } else {
      scheduleAutoPlay();
    }
  }
}

function handleDifficultyChange(level) {
  if (gameState) gameState.aiLevel = level;
}

// ═══════ AI vs AI Spectator Mode ═══════
function startAiVsAi(leftWeapon, rightWeapon, leftLevel, rightLevel) {
  towerState = null;
  resetGameVars();
  spectatorMode = true;
  playerAiLevel = leftLevel;
  autoPlaySpeed = 800;

  gameState = initGame(leftWeapon, rightWeapon, rightLevel);
  gameState.spectatorMode = true;
  startConfig = { playerWeapon: leftWeapon, aiWeapon: rightWeapon, aiLevel: rightLevel, playerAiLevel: leftLevel };

  render();
  scheduleAutoPlay();
}

function scheduleAutoPlay() {
  if (autoPlayTimer) { clearTimeout(autoPlayTimer); autoPlayTimer = null; }
  if (!gameState || gameState.gameOver || isPaused || animating) return;
  autoPlayTimer = setTimeout(runAutoPlayRound, Math.max(autoPlaySpeed, 50));
}

async function runAutoPlayRound() {
  autoPlayTimer = null;
  if (!gameState || gameState.gameOver || isPaused || animating) return;

  const aiAction = aiDecide(gameState);
  const flipped = flipState(gameState, playerAiLevel);
  const rawPlayerAction = aiDecide(flipped);

  const playerAction = getValidAction(rawPlayerAction, gameState.player, gameState.distance);
  const validAiAction = getValidAction(aiAction, gameState.ai, gameState.distance);

  prevState = JSON.parse(JSON.stringify(gameState));
  gameState = executeRound(gameState, playerAction, validAiAction);

  animating = true;
  const wrapper = app.querySelector('.game-wrapper');
  if (wrapper) wrapper.classList.add('animating');

  render();

  if (autoPlaySpeed > 0) {
    await playRoundAnimation(prevState, gameState);
  }

  animating = false;
  if (wrapper) wrapper.classList.remove('animating');

  if (gameState.gameOver) {
    if (gameState.winner === 'player') sfxVictory(); else sfxDefeat();
    renderResult(app, gameState, handleRestartSame, showTitle);
  } else {
    scheduleAutoPlay();
  }
}

function handleSpeedChange(speed) {
  autoPlaySpeed = speed;
  render();
  if (spectatorMode && !isPaused && !animating && !gameState.gameOver) {
    scheduleAutoPlay();
  }
}

showTitle();
