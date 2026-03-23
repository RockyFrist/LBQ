import { CombatCard, DistanceCard } from '../types.js';
import { COMBAT_CARD_NAMES, DISTANCE_CARD_NAMES, DISTANCE_NAMES, gameConfig, DISTANCE_CARD_BASE } from '../constants.js';
import { COMBAT_CARD_INFO, DISTANCE_CARD_INFO, FIGHTER_POSITIONS } from './weapon-display.js';

// ═══════ Battle Animations ═══════

// Collision description mapping for each card pair
const COLLISION_FX = {
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
  [`${CombatCard.BLOCK}_${CombatCard.BLOCK}`]:    { pAnim: 'anim-block',    aAnim: 'anim-block',      spark: null, desc: '双挡空过' },
  [`${CombatCard.FEINT}_${CombatCard.FEINT}`]:    { pAnim: 'anim-idle',     aAnim: 'anim-idle',       spark: null, desc: '双晃空过' },
  [`${CombatCard.DEFLECT}_${CombatCard.DEFLECT}`]:{ pAnim: 'anim-clash-p',  aAnim: 'anim-clash-a',    spark: '⚡', desc: '卸力对碰' },
  // ── 卸力 vs 格挡 ──
  [`${CombatCard.DEFLECT}_${CombatCard.BLOCK}`]:  { pAnim: 'anim-deflect-fail', aAnim: 'anim-block',   spark: '🛡️', desc: '卸力被挡' },
  [`${CombatCard.BLOCK}_${CombatCard.DEFLECT}`]:  { pAnim: 'anim-block',    aAnim: 'anim-deflect-fail', spark: '🛡️', desc: '格挡卸力' },
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

function showInterruptFlash(stage, fighter) {
  const el = document.createElement('div');
  el.className = 'float-dmg interrupt-dmg';
  el.textContent = '⚡ 身法被打断';
  el.style.left = fighter.style.left;
  el.style.top = '12%';
  stage.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

function showRoundBanner(stage, text) {
  const old = stage.querySelector('.round-banner');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'round-banner';
  el.textContent = text;
  stage.appendChild(el);
  setTimeout(() => { el.classList.add('rb-fade'); setTimeout(() => el.remove(), 500); }, 1000);
}

function setArenaDepth(stage, dist) {
  stage.style.setProperty('--arena-cam', dist);
  stage.classList.remove('dist-0', 'dist-1', 'dist-2', 'dist-3');
  stage.classList.add('dist-' + dist);
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
  const MAX_STANCE = gameConfig.MAX_STANCE;
  const MAX_STAMINA = gameConfig.MAX_STAMINA;

  // ── Reset fighters to OLD positions ──
  const oldPos = FIGHTER_POSITIONS[prevState.distance] || FIGHTER_POSITIONS[2];
  const newPos = FIGHTER_POSITIONS[newState.distance] || FIGHTER_POSITIONS[2];
  pFighter.style.transition = 'none';
  aFighter.style.transition = 'none';
  pFighter.style.left = oldPos.player + '%';
  aFighter.style.left = oldPos.ai + '%';

  // ── 战斗者 emoji 回退到 prevState（避免僵直图标提前出现）──
  const pBodyEl = pFighter.querySelector('.fighter-body');
  const aBodyEl = aFighter.querySelector('.fighter-body');
  if (pBodyEl) pBodyEl.textContent = prevState.player.staggered ? '😵' : '🧑';
  if (aBodyEl) aBodyEl.textContent = prevState.ai.staggered ? '😵' : (prevState.aiName ? '👤' : '🤖');
  const distLine = stage.querySelector('.arena-dist-line');
  const distLabel = stage.querySelector('.arena-dist-label');
  if (distLine) {
    distLine.style.transition = 'none';
    distLine.style.left = oldPos.player + '%';
    distLine.style.width = (oldPos.ai - oldPos.player) + '%';
  }
  if (distLabel) distLabel.textContent = DISTANCE_NAMES[prevState.distance];
  setArenaDepth(stage, prevState.distance);
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

  // ── Phase 0: 回合标题 ──
  showRoundBanner(stage, `⚔️  第 ${newState.round} 回合`);
  await wait(1200);

  // ── Phase 1: 身法 (顺序独立移动) ──
  const pDelta = DISTANCE_CARD_BASE[pDist]?.delta ?? 0;
  const aDelta = DISTANCE_CARD_BASE[aDist]?.delta ?? 0;
  const intendedDist = Math.max(0, Math.min(3, prevState.distance + pDelta + aDelta));
  const intendedPos = FIGHTER_POSITIONS[intendedDist] || FIGHTER_POSITIONS[2];
  const hasInterrupt = last.pMoveInterrupted || last.aMoveInterrupted;

  // 1a: 玩家身法 — 意图动画 + 独立滑动
  const pDistTag = showActionTag(stage, pFighter, pDistInfo.emoji, DISTANCE_CARD_NAMES[pDist], 'player');
  const pTarget = intendedPos.player;
  const pCurrLeft = parseFloat(pFighter.style.left);
  const aBeforeMove = parseFloat(aFighter.style.left);

  if (pDelta !== 0) {
    pFighter.classList.add(pDelta < 0 ? 'anim-dash-in' : 'anim-dash-out');
    if (Math.abs(pTarget - pCurrLeft) > 0.5) {
      pFighter.style.transition = 'left 0.5s ease';
      pFighter.style.left = pTarget + '%';
      if (distLine) {
        distLine.style.transition = 'left 0.5s ease, width 0.5s ease';
        distLine.style.left = pTarget + '%';
        distLine.style.width = (aBeforeMove - pTarget) + '%';
      }
    }
    await wait(600);
    pFighter.classList.remove('anim-dash-in', 'anim-dash-out');
  } else if (pDist === DistanceCard.DODGE) {
    pFighter.classList.add('anim-dodge');
    await wait(550);
    pFighter.classList.remove('anim-dodge');
  } else {
    pFighter.classList.add('anim-brace');
    if (Math.abs(pTarget - pCurrLeft) > 0.5) {
      pFighter.style.transition = 'left 0.5s ease';
      pFighter.style.left = pTarget + '%';
      if (distLine) {
        distLine.style.transition = 'left 0.5s ease, width 0.5s ease';
        distLine.style.left = pTarget + '%';
        distLine.style.width = (aBeforeMove - pTarget) + '%';
      }
    }
    await wait(550);
    pFighter.classList.remove('anim-brace');
  }

  // 1b: AI身法 — 意图动画 + 独立滑动
  const aDistTag = showActionTag(stage, aFighter, aDistInfo.emoji, DISTANCE_CARD_NAMES[aDist], 'ai');
  const aTarget = intendedPos.ai;
  const pAfterMove = parseFloat(pFighter.style.left);

  if (aDelta !== 0) {
    aFighter.classList.add(aDelta < 0 ? 'anim-dash-in' : 'anim-dash-out');
    if (Math.abs(aTarget - aBeforeMove) > 0.5) {
      aFighter.style.transition = 'left 0.5s ease';
      aFighter.style.left = aTarget + '%';
      if (distLine) {
        distLine.style.transition = 'width 0.5s ease';
        distLine.style.width = (aTarget - pAfterMove) + '%';
      }
    }
    await wait(600);
    aFighter.classList.remove('anim-dash-in', 'anim-dash-out');
  } else if (aDist === DistanceCard.DODGE) {
    aFighter.classList.add('anim-dodge');
    await wait(550);
    aFighter.classList.remove('anim-dodge');
  } else {
    aFighter.classList.add('anim-brace');
    if (Math.abs(aTarget - aBeforeMove) > 0.5) {
      aFighter.style.transition = 'left 0.5s ease';
      aFighter.style.left = aTarget + '%';
      if (distLine) {
        distLine.style.transition = 'width 0.5s ease';
        distLine.style.width = (aTarget - pAfterMove) + '%';
      }
    }
    await wait(550);
    aFighter.classList.remove('anim-brace');
  }

  if (distLabel) distLabel.textContent = DISTANCE_NAMES[intendedDist];
  setArenaDepth(stage, intendedDist);
  pFighter.style.transition = '';
  aFighter.style.transition = '';
  if (distLine) distLine.style.transition = '';



  // 身法体力消耗
  const pStaminaAfterCost = Math.max(0, prevState.player.stamina - (DISTANCE_CARD_BASE[pDist]?.cost ?? 0));
  const aStaminaAfterCost = Math.max(0, prevState.ai.stamina - (DISTANCE_CARD_BASE[aDist]?.cost ?? 0));
  const pDistCostActual = prevState.player.stamina - pStaminaAfterCost;
  const aDistCostActual = prevState.ai.stamina - aStaminaAfterCost;
  if (pDistCostActual > 0) {
    animateBar('.player-side', 'stamina', pStaminaAfterCost, MAX_STAMINA, 400);
    showBarPop('.player-side', 'stamina', `-${pDistCostActual} 体力`, 'cost');
    flashBar('.player-side', 'stamina', 'bar-flash-cost');
  }
  if (aDistCostActual > 0) {
    animateBar('.ai-side', 'stamina', aStaminaAfterCost, MAX_STAMINA, 400);
    showBarPop('.ai-side', 'stamina', `-${aDistCostActual} 体力`, 'cost');
    flashBar('.ai-side', 'stamina', 'bar-flash-cost');
  }
  if (pDistCostActual > 0 || aDistCostActual > 0) await wait(400);

  // Fade out distance tags
  pDistTag.classList.add('at-fade');
  aDistTag.classList.add('at-fade');
  setTimeout(() => { pDistTag.remove(); aDistTag.remove(); }, 350);

  await wait(350); // 身法→攻防过渡停顿

  // ── Phase 2: 攻防卡 + 过招 ──
  const pCombatTag = showActionTag(stage, pFighter, pCombatInfo.emoji, COMBAT_CARD_NAMES[pCombat], 'player');
  await wait(350);
  const aCombatTag = showActionTag(stage, aFighter, aCombatInfo.emoji, COMBAT_CARD_NAMES[aCombat], 'ai');
  await wait(400);

  const fx = getCollisionFx(pCombat, aCombat);
  if (fx.pAnim) pFighter.classList.add(fx.pAnim);
  if (fx.aAnim) aFighter.classList.add(fx.aAnim);
  if (fx.spark) showCenterSpark(stage, fx.spark, fx.desc);

  await wait(900);

  // ── 攻防动画结束后，更新僵直 emoji（此时视觉上已能看到受创效果）──
  if (pBodyEl) pBodyEl.textContent = newState.player.staggered ? '😵' : '🧑';
  if (aBodyEl) aBodyEl.textContent = newState.ai.staggered ? '😵' : (newState.aiName ? '👤' : '🤖');

  // Fade combat tags
  pCombatTag.classList.add('at-fade');
  aCombatTag.classList.add('at-fade');
  setTimeout(() => { pCombatTag.remove(); aCombatTag.remove(); }, 350);

  await wait(300); // 攻防→结算过渡

  // ── Phase 2.5: 打断 / 击退 ──
  if (intendedDist !== newState.distance) {
    if (hasInterrupt) {
      if (last.pMoveInterrupted) {
        pFighter.classList.add('anim-shake');
        showInterruptFlash(stage, pFighter);
      }
      if (last.aMoveInterrupted) {
        aFighter.classList.add('anim-shake');
        showInterruptFlash(stage, aFighter);
      }
      await wait(400);
    } else {
      showCenterSpark(stage, '💥', '击退!');
      await wait(300);
    }
    pFighter.style.transition = 'left 0.4s ease-out';
    aFighter.style.transition = 'left 0.4s ease-out';
    if (distLine) distLine.style.transition = 'left 0.4s ease-out, width 0.4s ease-out';
    pFighter.style.left = newPos.player + '%';
    aFighter.style.left = newPos.ai + '%';
    if (distLine) {
      distLine.style.left = newPos.player + '%';
      distLine.style.width = (newPos.ai - newPos.player) + '%';
    }
    if (distLabel) distLabel.textContent = DISTANCE_NAMES[newState.distance];
    setArenaDepth(stage, newState.distance);
    await wait(500);
    pFighter.classList.remove('anim-shake');
    aFighter.classList.remove('anim-shake');
    pFighter.style.transition = '';
    aFighter.style.transition = '';
    if (distLine) distLine.style.transition = '';
  }

  // ── Phase 3: 伤害 / 架势 / 处决 (逐步揭示) ──
  const pHpLoss = prevState.player.hp - newState.player.hp;
  const aHpLoss = prevState.ai.hp - newState.ai.hp;
  const pStGain = newState.player.stance - prevState.player.stance;
  const aStGain = newState.ai.stance - prevState.ai.stance;
  const EXEC_DMG = gameConfig.EXECUTION_DAMAGE;
  const pExecuted = prevState.player.stance < MAX_STANCE && newState.player.stance === 0 && pHpLoss >= EXEC_DMG;
  const aExecuted = prevState.ai.stance < MAX_STANCE && newState.ai.stance === 0 && aHpLoss >= EXEC_DMG;

  // ── 3a: 气血伤害逐一揭示 ──
  if (pHpLoss > 0) {
    pFighter.classList.add('anim-hit');
    showFloatDmg(stage, pFighter, `-${pHpLoss}`, 'damage');
    animateBar('.player-side', 'hp', newState.player.hp, MAX_HP, 500);
    showBarPop('.player-side', 'hp', `-${pHpLoss} 气血`, 'cost');
    flashBar('.player-side', 'hp', 'bar-flash-cost');
    await wait(600);
  }
  if (aHpLoss > 0) {
    aFighter.classList.add('anim-hit');
    showFloatDmg(stage, aFighter, `-${aHpLoss}`, 'damage');
    animateBar('.ai-side', 'hp', newState.ai.hp, MAX_HP, 500);
    showBarPop('.ai-side', 'hp', `-${aHpLoss} 气血`, 'cost');
    flashBar('.ai-side', 'hp', 'bar-flash-cost');
    await wait(600);
  }
  if (pHpLoss === 0 && aHpLoss === 0) await wait(300);

  // ── 3b: 架势变化逐一揭示 ──
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
  if (pExecuted || pStGain !== 0) await wait(450);

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
  if (aExecuted || aStGain !== 0) await wait(450);

  if (pExecuted || aExecuted) {
    stage.classList.add('execution-flash');
    await wait(500);
  }

  await wait(pExecuted || aExecuted ? 500 : 600);

  // ── Phase 4: 体力回复 (0.5s) ──
  const pRecov = newState.player.stamina - pStaminaAfterCost;
  const aRecov = newState.ai.stamina - aStaminaAfterCost;
  if (pRecov > 0) {
    animateBar('.player-side', 'stamina', newState.player.stamina, MAX_STAMINA, 400);
    showBarPop('.player-side', 'stamina', `+${pRecov} 体力`, 'buff');
    flashBar('.player-side', 'stamina', 'bar-flash-buff');
  }
  if (aRecov > 0) {
    animateBar('.ai-side', 'stamina', newState.ai.stamina, MAX_STAMINA, 400);
    showBarPop('.ai-side', 'stamina', `+${aRecov} 体力`, 'buff');
    flashBar('.ai-side', 'stamina', 'bar-flash-buff');
  }
  if (pRecov > 0 || aRecov > 0) await wait(500);

  // ── Cleanup ──
  const ALL_ANIM_CLASSES = [
    'anim-attack-p', 'anim-attack-a', 'anim-dodge', 'anim-hit', 'anim-shake',
    'anim-slash-p', 'anim-slash-a', 'anim-slash-miss', 'anim-thrust-p', 'anim-thrust-a',
    'anim-thrust-miss', 'anim-deflect', 'anim-deflect-fail', 'anim-recoil',
    'anim-block', 'anim-block-hit', 'anim-block-tricked', 'anim-feint-p', 'anim-feint-a',
    'anim-clash-p', 'anim-clash-a', 'anim-idle',
    'anim-dash-in', 'anim-dash-out', 'anim-brace',
  ];
  pFighter.classList.remove(...ALL_ANIM_CLASSES);
  aFighter.classList.remove(...ALL_ANIM_CLASSES);
  stage.classList.remove('execution-flash');
}

// Legacy alias
export function triggerBattleAnimations(state, prevState) {
  if (prevState && state.history.length > 0) playRoundAnimation(prevState, state);
}
