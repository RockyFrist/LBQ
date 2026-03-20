import { CombatCard } from '../types.js';
import { COMBAT_CARD_NAMES, DISTANCE_CARD_NAMES, DISTANCE_NAMES, gameConfig } from '../constants.js';
import { COMBAT_CARD_INFO, DISTANCE_CARD_INFO, FIGHTER_POSITIONS } from './renderer.js';

// ═══════ Battle Animations ═══════

// Collision description mapping for each card pair
const COLLISION_FX = {
  // ── 闪避 vs X ──
  [`${CombatCard.DODGE}_${CombatCard.SLASH}`]:   { pAnim: 'anim-dodge',    aAnim: 'anim-slash-miss',  spark: '💨', desc: '闪避劈砍' },
  [`${CombatCard.SLASH}_${CombatCard.DODGE}`]:    { pAnim: 'anim-slash-miss', aAnim: 'anim-dodge',     spark: '💨', desc: '劈砍被闪' },
  [`${CombatCard.DODGE}_${CombatCard.THRUST}`]:   { pAnim: 'anim-dodge',    aAnim: 'anim-thrust-miss', spark: '💨', desc: '闪避点刺' },
  [`${CombatCard.THRUST}_${CombatCard.DODGE}`]:   { pAnim: 'anim-thrust-miss', aAnim: 'anim-dodge',    spark: '💨', desc: '点刺被闪' },
  // ── 卸力 vs X ──
  [`${CombatCard.DEFLECT}_${CombatCard.SLASH}`]:  { pAnim: 'anim-deflect',  aAnim: 'anim-recoil',     spark: '🤺', desc: '卸力反制!' },
  [`${CombatCard.SLASH}_${CombatCard.DEFLECT}`]:  { pAnim: 'anim-recoil',   aAnim: 'anim-deflect',    spark: '🤺', desc: '被卸力反制!' },
  [`${CombatCard.DEFLECT}_${CombatCard.THRUST}`]: { pAnim: 'anim-deflect-fail', aAnim: 'anim-thrust-p', spark: '🎯', desc: '卸力失败' },
  [`${CombatCard.THRUST}_${CombatCard.DEFLECT}`]: { pAnim: 'anim-thrust-p', aAnim: 'anim-deflect-fail', spark: '🎯', desc: '穿透卸力' },
  [`${CombatCard.DEFLECT}_${CombatCard.FEINT}`]:  { pAnim: 'anim-deflect-fail', aAnim: 'anim-feint-a', spark: '🌀', desc: '虚晃骗卸力' },
  [`${CombatCard.FEINT}_${CombatCard.DEFLECT}`]:  { pAnim: 'anim-feint-p', aAnim: 'anim-deflect-fail', spark: '🌀', desc: '虚晃骗卸力' },
  // ── 劈砍 vs X ──
  [`${CombatCard.SLASH}_${CombatCard.SLASH}`]:    { pAnim: 'anim-clash-p',  aAnim: 'anim-clash-a',    spark: '⚡', desc: '互砍!' },
  [`${CombatCard.SLASH}_${CombatCard.THRUST}`]:   { pAnim: 'anim-slash-p',  aAnim: 'anim-hit',        spark: '⚡', desc: '劈砍命中' },
  [`${CombatCard.THRUST}_${CombatCard.SLASH}`]:   { pAnim: 'anim-hit',      aAnim: 'anim-slash-a',    spark: '⚡', desc: '被劈中' },
  [`${CombatCard.SLASH}_${CombatCard.BLOCK}`]:    { pAnim: 'anim-slash-p',  aAnim: 'anim-block-hit',  spark: '🛡️', desc: '劈砍破格挡' },
  [`${CombatCard.BLOCK}_${CombatCard.SLASH}`]:    { pAnim: 'anim-block-hit', aAnim: 'anim-slash-a',   spark: '🛡️', desc: '格挡被破' },
  [`${CombatCard.SLASH}_${CombatCard.FEINT}`]:    { pAnim: 'anim-slash-p',  aAnim: 'anim-hit',        spark: '⚡', desc: '劈砍命中' },
  [`${CombatCard.FEINT}_${CombatCard.SLASH}`]:    { pAnim: 'anim-hit',      aAnim: 'anim-slash-a',    spark: '⚡', desc: '被劈中' },
  // ── 点刺 vs X ──
  [`${CombatCard.THRUST}_${CombatCard.THRUST}`]:  { pAnim: 'anim-thrust-p', aAnim: 'anim-thrust-a',   spark: '🎯', desc: '互刺!' },
  [`${CombatCard.THRUST}_${CombatCard.BLOCK}`]:   { pAnim: 'anim-thrust-miss', aAnim: 'anim-block',   spark: '🛡️', desc: '被格挡' },
  [`${CombatCard.BLOCK}_${CombatCard.THRUST}`]:   { pAnim: 'anim-block',    aAnim: 'anim-thrust-miss', spark: '🛡️', desc: '格挡成功' },
  [`${CombatCard.THRUST}_${CombatCard.FEINT}`]:   { pAnim: 'anim-thrust-p', aAnim: 'anim-hit',        spark: '🎯', desc: '点刺命中' },
  [`${CombatCard.FEINT}_${CombatCard.THRUST}`]:   { pAnim: 'anim-hit',      aAnim: 'anim-thrust-a',   spark: '🎯', desc: '被点刺' },
  // ── 格挡 vs 虚晃 ──
  [`${CombatCard.BLOCK}_${CombatCard.FEINT}`]:    { pAnim: 'anim-block-tricked', aAnim: 'anim-feint-a', spark: '🌀', desc: '虚晃骗格挡' },
  [`${CombatCard.FEINT}_${CombatCard.BLOCK}`]:    { pAnim: 'anim-feint-p', aAnim: 'anim-block-tricked', spark: '🌀', desc: '虚晃骗格挡' },
  // ── 同类/空过 ──
  [`${CombatCard.DODGE}_${CombatCard.DODGE}`]:    { pAnim: 'anim-dodge',    aAnim: 'anim-dodge',      spark: null, desc: '双闪空过' },
  [`${CombatCard.BLOCK}_${CombatCard.BLOCK}`]:    { pAnim: 'anim-block',    aAnim: 'anim-block',      spark: null, desc: '双挡空过' },
  [`${CombatCard.FEINT}_${CombatCard.FEINT}`]:    { pAnim: 'anim-idle',     aAnim: 'anim-idle',       spark: null, desc: '双晃空过' },
  [`${CombatCard.DEFLECT}_${CombatCard.DEFLECT}`]:{ pAnim: 'anim-clash-p',  aAnim: 'anim-clash-a',    spark: '⚡', desc: '卸力对碰' },
};

function getCollisionFx(pCard, aCard) {
  const key = `${pCard}_${aCard}`;
  return COLLISION_FX[key] || { pAnim: 'anim-idle', aAnim: 'anim-idle', spark: null, desc: '' };
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function showFloatDmg(stage, fighter, text, type) {
  const el = document.createElement('div');
  const cls = type === 'stance' ? ' stance-dmg' : type === 'heal' ? ' heal' : '';
  el.className = 'float-dmg' + cls;
  el.textContent = text;
  el.style.left = fighter.style.left;
  el.style.top = '30%';
  stage.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ═══════ Stat Bar Animation Helpers ═══════
function setBarValue(panelSel, type, val, max) {
  const panel = document.querySelector(panelSel);
  if (!panel) return;
  const row = panel.querySelector(`.stat-row[data-stat="${type}"]`);
  if (!row) return;
  const bar = row.querySelector('.stat-bar');
  const valEl = row.querySelector('.stat-value');
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width = Math.max(0, (val / max) * 100) + '%';
    void bar.offsetWidth;
  }
  if (valEl) valEl.textContent = `${Math.max(0, val)}/${max}`;
}

function animateBar(panelSel, type, newVal, max, duration = 500) {
  const panel = document.querySelector(panelSel);
  if (!panel) return;
  const row = panel.querySelector(`.stat-row[data-stat="${type}"]`);
  if (!row) return;
  const bar = row.querySelector('.stat-bar');
  const valEl = row.querySelector('.stat-value');
  if (bar) {
    bar.style.transition = `width ${duration}ms ease`;
    bar.style.width = Math.max(0, (newVal / max) * 100) + '%';
  }
  if (valEl) valEl.textContent = `${Math.max(0, Math.round(newVal))}/${max}`;
}

function showBarPop(panelSel, type, text, popType = 'cost') {
  const panel = document.querySelector(panelSel);
  if (!panel) return;
  const row = panel.querySelector(`.stat-row[data-stat="${type}"]`);
  if (!row) return;
  row.style.position = 'relative';
  const pop = document.createElement('div');
  pop.className = `stat-pop stat-pop-${popType}`;
  pop.textContent = text;
  row.appendChild(pop);
  void pop.offsetWidth;
  pop.classList.add('stat-pop-show');
  setTimeout(() => {
    pop.classList.add('stat-pop-hide');
    pop.addEventListener('animationend', () => pop.remove());
  }, 1500);
}

function flashBar(panelSel, type, flashClass) {
  const panel = document.querySelector(panelSel);
  if (!panel) return;
  const row = panel.querySelector(`.stat-row[data-stat="${type}"]`);
  if (!row) return;
  const bar = row.querySelector('.stat-bar');
  if (!bar) return;
  bar.classList.add(flashClass);
  setTimeout(() => bar.classList.remove(flashClass), 800);
}

function showCenterSpark(stage, emoji, desc) {
  const el = document.createElement('div');
  el.className = 'clash-spark';
  el.innerHTML = `<span class="spark-emoji">${emoji}</span><span class="spark-desc">${desc}</span>`;
  stage.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function showActionTag(stage, fighter, emoji, text, side) {
  const el = document.createElement('div');
  el.className = `action-tag action-tag-${side}`;
  el.innerHTML = `<span class="at-emoji">${emoji}</span><span class="at-text">${text}</span>`;
  el.style.left = fighter.style.left;
  stage.appendChild(el);
  return el;
}

// ═══════ Phase-Based Round Animation ═══════
export async function playRoundAnimation(prevState, newState) {
  const stage = document.getElementById('arena-stage');
  const pFighter = document.getElementById('player-fighter');
  const aFighter = document.getElementById('ai-fighter');
  if (!stage || !pFighter || !aFighter) return;

  const last = newState.history[newState.history.length - 1];
  const pCombat = last.playerCombat;
  const aCombat = last.aiCombat;
  const pDist = last.playerDistance;
  const aDist = last.aiDistance;

  const MAX_HP = gameConfig.MAX_HP;
  const MAX_STAMINA = gameConfig.MAX_STAMINA;
  const MAX_STANCE = gameConfig.MAX_STANCE;

  // Intermediate stamina (after costs, before recovery)
  const pStAfterCost = last.pStaminaAfterCost;
  const aStAfterCost = last.aStaminaAfterCost;
  const pTotalCost = prevState.player.stamina - pStAfterCost;
  const aTotalCost = prevState.ai.stamina - aStAfterCost;
  const pRecovAmt = newState.player.stamina - pStAfterCost;
  const aRecovAmt = newState.ai.stamina - aStAfterCost;

  // ── Reset fighters to OLD positions ──
  const oldPos = FIGHTER_POSITIONS[prevState.distance] || FIGHTER_POSITIONS[2];
  const newPos = FIGHTER_POSITIONS[newState.distance] || FIGHTER_POSITIONS[2];
  pFighter.style.transition = 'none';
  aFighter.style.transition = 'none';
  pFighter.style.left = oldPos.player + '%';
  aFighter.style.left = oldPos.ai + '%';
  const distLine = stage.querySelector('.arena-dist-line');
  const distLabel = stage.querySelector('.arena-dist-label');
  if (distLine) {
    distLine.style.transition = 'none';
    distLine.style.left = oldPos.player + '%';
    distLine.style.width = (oldPos.ai - oldPos.player) + '%';
  }
  if (distLabel) distLabel.textContent = DISTANCE_NAMES[prevState.distance];
  void pFighter.offsetWidth;

  // ── Reset ALL stat bars to prevState values ──
  setBarValue('.player-side', 'hp', prevState.player.hp, MAX_HP);
  setBarValue('.player-side', 'stamina', prevState.player.stamina, MAX_STAMINA);
  setBarValue('.player-side', 'stance', prevState.player.stance, MAX_STANCE);
  setBarValue('.ai-side', 'hp', prevState.ai.hp, MAX_HP);
  setBarValue('.ai-side', 'stamina', prevState.ai.stamina, MAX_STAMINA);
  setBarValue('.ai-side', 'stance', prevState.ai.stance, MAX_STANCE);

  const pDistInfo = DISTANCE_CARD_INFO[pDist];
  const aDistInfo = DISTANCE_CARD_INFO[aDist];
  const pCombatInfo = COMBAT_CARD_INFO[pCombat];
  const aCombatInfo = COMBAT_CARD_INFO[aCombat];

  // ── Phase 1: Distance Card + Movement (0.8s) ──
  const pDistTag = showActionTag(stage, pFighter, pDistInfo.emoji, DISTANCE_CARD_NAMES[pDist], 'player');
  const aDistTag = showActionTag(stage, aFighter, aDistInfo.emoji, DISTANCE_CARD_NAMES[aDist], 'ai');

  if (newState.distance !== prevState.distance) {
    pFighter.style.transition = 'left 0.6s ease';
    aFighter.style.transition = 'left 0.6s ease';
    if (distLine) distLine.style.transition = 'left 0.6s ease, width 0.6s ease';
    pFighter.style.left = newPos.player + '%';
    aFighter.style.left = newPos.ai + '%';
    if (distLine) {
      distLine.style.left = newPos.player + '%';
      distLine.style.width = (newPos.ai - newPos.player) + '%';
    }
    if (distLabel) distLabel.textContent = DISTANCE_NAMES[newState.distance];
  }

  await wait(800);

  pFighter.style.transition = '';
  aFighter.style.transition = '';
  if (distLine) distLine.style.transition = '';

  // Fade out distance tags
  pDistTag.classList.add('at-fade');
  aDistTag.classList.add('at-fade');
  setTimeout(() => { pDistTag.remove(); aDistTag.remove(); }, 350);

  // ── Phase 2: Combat Card + Collision + Stamina Cost (0.9s) ──
  const pCombatTag = showActionTag(stage, pFighter, pCombatInfo.emoji, COMBAT_CARD_NAMES[pCombat], 'player');
  const aCombatTag = showActionTag(stage, aFighter, aCombatInfo.emoji, COMBAT_CARD_NAMES[aCombat], 'ai');

  const fx = getCollisionFx(pCombat, aCombat);
  if (fx.pAnim) pFighter.classList.add(fx.pAnim);
  if (fx.aAnim) aFighter.classList.add(fx.aAnim);
  if (fx.spark) showCenterSpark(stage, fx.spark, fx.desc);

  // Animate stamina cost deduction
  if (pTotalCost > 0) {
    animateBar('.player-side', 'stamina', pStAfterCost, MAX_STAMINA, 500);
    showBarPop('.player-side', 'stamina', `-${pTotalCost} 体力`, 'cost');
    flashBar('.player-side', 'stamina', 'bar-flash-cost');
  }
  if (aTotalCost > 0) {
    animateBar('.ai-side', 'stamina', aStAfterCost, MAX_STAMINA, 500);
    showBarPop('.ai-side', 'stamina', `-${aTotalCost} 体力`, 'cost');
    flashBar('.ai-side', 'stamina', 'bar-flash-cost');
  }

  await wait(700);

  // Fade combat tags
  pCombatTag.classList.add('at-fade');
  aCombatTag.classList.add('at-fade');
  setTimeout(() => { pCombatTag.remove(); aCombatTag.remove(); }, 350);

  // ── Phase 3: Damage / Stance / Execution (1.0s) ──
  const pHpLoss = prevState.player.hp - newState.player.hp;
  const aHpLoss = prevState.ai.hp - newState.ai.hp;
  const pStGain = newState.player.stance - prevState.player.stance;
  const aStGain = newState.ai.stance - prevState.ai.stance;
  const EXEC_DMG = gameConfig.EXECUTION_DAMAGE;
  const pExecuted = prevState.player.stance < MAX_STANCE && newState.player.stance === 0 && pHpLoss >= EXEC_DMG;
  const aExecuted = prevState.ai.stance < MAX_STANCE && newState.ai.stance === 0 && aHpLoss >= EXEC_DMG;

  if (pHpLoss > 0) {
    pFighter.classList.add('anim-hit');
    showFloatDmg(stage, pFighter, `-${pHpLoss}`, 'damage');
    animateBar('.player-side', 'hp', newState.player.hp, MAX_HP, 500);
    showBarPop('.player-side', 'hp', `-${pHpLoss} 气血`, 'cost');
    flashBar('.player-side', 'hp', 'bar-flash-cost');
  }
  if (aHpLoss > 0) {
    aFighter.classList.add('anim-hit');
    showFloatDmg(stage, aFighter, `-${aHpLoss}`, 'damage');
    animateBar('.ai-side', 'hp', newState.ai.hp, MAX_HP, 500);
    showBarPop('.ai-side', 'hp', `-${aHpLoss} 气血`, 'cost');
    flashBar('.ai-side', 'hp', 'bar-flash-cost');
  }

  await wait(350);

  if (!pExecuted) {
    if (pStGain > 0) {
      showFloatDmg(stage, pFighter, `+${pStGain} 架势`, 'stance');
      animateBar('.player-side', 'stance', newState.player.stance, MAX_STANCE, 400);
      showBarPop('.player-side', 'stance', `+${pStGain} 架势`, 'warn');
      flashBar('.player-side', 'stance', 'bar-flash-warn');
    } else if (pStGain < 0) {
      showFloatDmg(stage, pFighter, `${pStGain} 架势`, 'heal');
      animateBar('.player-side', 'stance', newState.player.stance, MAX_STANCE, 400);
      showBarPop('.player-side', 'stance', `${pStGain} 架势`, 'buff');
    }
  } else {
    animateBar('.player-side', 'stance', 0, MAX_STANCE, 400);
    showBarPop('.player-side', 'stance', '⚔ 处决!', 'exec');
  }

  if (!aExecuted) {
    if (aStGain > 0) {
      showFloatDmg(stage, aFighter, `+${aStGain} 架势`, 'stance');
      animateBar('.ai-side', 'stance', newState.ai.stance, MAX_STANCE, 400);
      showBarPop('.ai-side', 'stance', `+${aStGain} 架势`, 'warn');
      flashBar('.ai-side', 'stance', 'bar-flash-warn');
    } else if (aStGain < 0) {
      showFloatDmg(stage, aFighter, `${aStGain} 架势`, 'heal');
      animateBar('.ai-side', 'stance', newState.ai.stance, MAX_STANCE, 400);
      showBarPop('.ai-side', 'stance', `${aStGain} 架势`, 'buff');
    }
  } else {
    animateBar('.ai-side', 'stance', 0, MAX_STANCE, 400);
    showBarPop('.ai-side', 'stance', '⚔ 处决!', 'exec');
  }

  if (pExecuted || aExecuted) {
    stage.classList.add('execution-flash');
  }

  await wait(650);

  // ── Phase 4: Stamina Recovery (0.7s) ──
  if (pRecovAmt > 0) {
    animateBar('.player-side', 'stamina', newState.player.stamina, MAX_STAMINA, 400);
    showBarPop('.player-side', 'stamina', `+${pRecovAmt} 恢复`, 'buff');
    flashBar('.player-side', 'stamina', 'bar-flash-buff');
  }
  if (aRecovAmt > 0) {
    animateBar('.ai-side', 'stamina', newState.ai.stamina, MAX_STAMINA, 400);
    showBarPop('.ai-side', 'stamina', `+${aRecovAmt} 恢复`, 'buff');
    flashBar('.ai-side', 'stamina', 'bar-flash-buff');
  }

  if (pRecovAmt > 0 || aRecovAmt > 0) await wait(700);

  // ── Cleanup ──
  const ALL_ANIM_CLASSES = [
    'anim-attack-p', 'anim-attack-a', 'anim-dodge', 'anim-hit', 'anim-shake',
    'anim-slash-p', 'anim-slash-a', 'anim-slash-miss', 'anim-thrust-p', 'anim-thrust-a',
    'anim-thrust-miss', 'anim-deflect', 'anim-deflect-fail', 'anim-recoil',
    'anim-block', 'anim-block-hit', 'anim-block-tricked', 'anim-feint-p', 'anim-feint-a',
    'anim-clash-p', 'anim-clash-a', 'anim-idle',
  ];
  pFighter.classList.remove(...ALL_ANIM_CLASSES);
  aFighter.classList.remove(...ALL_ANIM_CLASSES);
  stage.classList.remove('execution-flash');
}

// Legacy alias
export function triggerBattleAnimations(state, prevState) {
  if (prevState && state.history.length > 0) playRoundAnimation(prevState, state);
}
