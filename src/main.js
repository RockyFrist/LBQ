import { initGame, executeRound } from './engine/game-engine.js';
import { aiDecide } from './ai/ai.js';
import { renderGame, renderResult, scrollLogToBottom } from './ui/renderer.js';
import { renderTitleScreen, renderBattleSetup, renderTowerWeaponSelect } from './ui/setup-screen.js';
import { playRoundAnimation } from './ui/animation.js';
import { showToast } from './ui/toast.js';
import { validateAction } from './engine/card-validator.js';
import { createTowerState, getTowerFloor, advanceTowerFloor, isTowerComplete } from './tower/tower.js';
import { renderFloorIntro, renderTowerBetween, renderTowerVictory, renderTowerGameOver } from './tower/tower-ui.js';
import { gameConfig } from './constants.js';
import { initConfig } from './config.js';

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

// ═══════ Tower state ═══════
let towerState = null;
let towerFloorData = null;

// ═══════ UI helpers ═══════
function getUiState() {
  return { isPaused, canUndo: stateStack.length > 0 };
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
  };
}

// ═══════ Title Screen ═══════
function showTitle() {
  resetGameVars();
  towerState = null;
  towerFloorData = null;
  renderTitleScreen(app, {
    onTower: () => renderTowerWeaponSelect(app, startTower, showTitle),
    onBattle: () => renderBattleSetup(app, startBattle, showTitle),
  });
}

function resetGameVars() {
  gameState = null;
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  stateStack = [];
  isPaused = false;
  animating = false;
}

// ═══════ Free Battle Mode ═══════
function startBattle(playerWeapon, aiWeapon, aiLevel) {
  towerState = null;
  startConfig = { playerWeapon, aiWeapon, aiLevel };
  resetGameVars();
  gameState = initGame(playerWeapon, aiWeapon, aiLevel);
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
  render();
}

function handleTowerBattleEnd() {
  if (!towerState) return;

  if (gameState.winner === 'player') {
    const prevHp = towerState.playerHp;
    towerState = advanceTowerFloor(towerState, gameState.player.hp);
    if (isTowerComplete(towerState)) {
      renderTowerVictory(app, towerState, showTitle);
    } else {
      renderTowerBetween(app, towerState, prevHp, showFloorIntro);
    }
  } else {
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
    selection.distanceCard = selection.distanceCard === card ? null : card;
  } else {
    selection.combatCard = selection.combatCard === card ? null : card;
  }
  render();
}

async function handleConfirm() {
  if (animating || isPaused || gameState.gameOver) return;
  if (!selection.distanceCard || !selection.combatCard) return;

  const check = validateAction(selection.distanceCard, selection.combatCard, gameState.player, gameState.distance);
  if (!check.valid) {
    showToast(check.reason, 'warn');
    return;
  }

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
    startBattle(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.aiLevel);
  } else {
    showTitle();
  }
}

function handleTogglePause() {
  if (gameState.gameOver) return;
  isPaused = !isPaused;
  render();
}

function handleDifficultyChange(level) {
  if (gameState) gameState.aiLevel = level;
}

showTitle();
