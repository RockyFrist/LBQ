import { initGame, executeRound } from './engine/game-engine.js';
import { aiDecide } from './ai/ai.js';
import { renderSetup, renderGame, renderResult, scrollLogToBottom } from './ui/renderer.js';
import { playRoundAnimation } from './ui/animation.js';
import { showToast } from './ui/toast.js';
import { validateAction } from './engine/card-validator.js';

const app = document.getElementById('app');

let gameState = null;
let prevState = null;
let selection = { distanceCard: null, combatCard: null };
let stateStack = [];
let isPaused = false;
let startConfig = null;
let animating = false;

function getUiState() {
  return {
    isPaused,
    canUndo: stateStack.length > 0,
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
  };
}

function showSetup() {
  gameState = null;
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  stateStack = [];
  isPaused = false;
  renderSetup(app, startGame);
}

function startGame(playerWeapon, aiWeapon, aiLevel) {
  startConfig = { playerWeapon, aiWeapon, aiLevel };
  gameState = initGame(playerWeapon, aiWeapon, aiLevel);
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  stateStack = [];
  isPaused = false;
  render();
}

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

  /* Lock input & play animation */
  animating = true;
  const wrapper = app.querySelector('.game-wrapper');
  if (wrapper) wrapper.classList.add('animating');

  render();                                        // render new state (arena, panels, log)
  await playRoundAnimation(prevState, gameState);  // async animation sequence

  animating = false;
  if (wrapper) wrapper.classList.remove('animating');

  if (gameState.gameOver) {
    renderResult(app, gameState, handleRestartSame, showSetup);
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
  if (!startConfig) return;
  startGame(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.aiLevel);
}

function handleNewGame() {
  showSetup();
}

function handleRestartSame() {
  if (startConfig) {
    startGame(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.aiLevel);
  } else {
    showSetup();
  }
}

function handleTogglePause() {
  if (gameState.gameOver) return;
  isPaused = !isPaused;
  render();
}

function handleDifficultyChange(level) {
  if (gameState) {
    gameState.aiLevel = level;
  }
}

showSetup();
