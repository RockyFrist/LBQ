;(function(LBQ) {

const { initGame, executeRound } = LBQ;
const { aiDecide } = LBQ;
const { renderSetup, renderGame, renderResult, scrollLogToBottom, triggerBattleAnimations } = LBQ;
const { validateAction } = LBQ;

const app = document.getElementById('app');

let gameState = null;
let prevState = null;          // previous state for animation diffing
let selection = { distanceCard: null, combatCard: null };
let stateStack = [];           // for undo
let isPaused = false;
let startConfig = null;        // { playerWeapon, aiWeapon, aiLevel } for restart
let pendingAnimation = false;  // flag: only animate once after confirm

// ═══════ UI State helper ═══════
function getUiState() {
  return {
    isPaused,
    canUndo: stateStack.length > 0,
  };
}

// ═══════ Callbacks object ═══════
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

// ═══════ Setup ═══════
function showSetup() {
  gameState = null;
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  stateStack = [];
  isPaused = false;
  renderSetup(app, startGame);
}

// ═══════ Start Game ═══════
function startGame(playerWeapon, aiWeapon, aiLevel) {
  startConfig = { playerWeapon, aiWeapon, aiLevel };
  gameState = initGame(playerWeapon, aiWeapon, aiLevel);
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  stateStack = [];
  isPaused = false;
  render();
}

// ═══════ Render ═══════
function render() {
  renderGame(app, gameState, selection, getUiState(), getCallbacks());
  scrollLogToBottom();
  // Trigger battle animations only once after confirm
  if (pendingAnimation && prevState) {
    triggerBattleAnimations(gameState, prevState);
    pendingAnimation = false;
  }
}

// ═══════ Card Selection ═══════
function handleSelect(type, card) {
  if (isPaused || gameState.gameOver) return;
  if (type === 'distance') {
    selection.distanceCard = selection.distanceCard === card ? null : card;
  } else {
    selection.combatCard = selection.combatCard === card ? null : card;
  }
  render();
}

// ═══════ Confirm ═══════
function handleConfirm() {
  if (isPaused || gameState.gameOver) return;
  if (!selection.distanceCard || !selection.combatCard) return;

  // Validate
  const check = validateAction(selection.distanceCard, selection.combatCard, gameState.player, gameState.distance);
  if (!check.valid) {
    alert(check.reason);
    return;
  }

  // Save state for undo
  stateStack.push(JSON.parse(JSON.stringify(gameState)));
  prevState = JSON.parse(JSON.stringify(gameState));

  // AI decision
  const aiAction = aiDecide(gameState);

  // Execute round
  const playerAction = { distanceCard: selection.distanceCard, combatCard: selection.combatCard };
  gameState = executeRound(gameState, playerAction, aiAction);

  // Reset selection
  selection = { distanceCard: null, combatCard: null };
  pendingAnimation = true;

  // Render
  render();

  // Check game over
  if (gameState.gameOver) {
    setTimeout(() => {
      renderResult(app, gameState, handleRestartSame, showSetup);
    }, 800);
  }
}

// ═══════ Undo ═══════
function handleUndo() {
  if (stateStack.length === 0) return;
  gameState = stateStack.pop();
  prevState = null;
  selection = { distanceCard: null, combatCard: null };
  isPaused = false;
  render();
}

// ═══════ Reset (same config) ═══════
function handleReset() {
  if (!startConfig) return;
  startGame(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.aiLevel);
}

// ═══════ New Game (back to setup) ═══════
function handleNewGame() {
  showSetup();
}

// ═══════ Restart same config ═══════
function handleRestartSame() {
  if (startConfig) {
    startGame(startConfig.playerWeapon, startConfig.aiWeapon, startConfig.aiLevel);
  } else {
    showSetup();
  }
}

// ═══════ Pause ═══════
function handleTogglePause() {
  if (gameState.gameOver) return;
  isPaused = !isPaused;
  render();
}

// ═══════ Difficulty Change ═══════
function handleDifficultyChange(level) {
  if (gameState) {
    gameState.aiLevel = level;
  }
}

// ═══════ GO! ═══════
showSetup();

})(window.LBQ);
