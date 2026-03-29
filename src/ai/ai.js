import { CombatCard, DistanceCard, CardType } from '../types.js';
import { WEAPON_ZONES, CARD_TYPE_MAP, COMBAT_CARD_BASE, DISTANCE_CARD_BASE } from '../constants.js';
import { getAvailableCombatCards, getAvailableDistanceCards } from '../engine/card-validator.js';
import { isAdvantage, isDisadvantage } from '../engine/weapon.js';

export function aiDecide(state) {
  const level = state.aiLevel;
  let result;
  switch (level) {
    case 1: result = aiLevel1(state); break;
    case 2: result = aiLevel2(state); break;
    case 3: result = aiLevel3(state); break;
    case 4: result = aiLevel4(state); break;
    case 5: result = aiLevel5(state); break;
    case 6: result = aiLevel6(state); break;
    case 7: result = aiLevel7(state); break;
    case 8: result = aiLevel8(state); break;
    default: result = aiLevel1(state); break;
  }
  // 闪避归身法层：验证所选组合的体力是否足够，不够则降级选牌
  return validateAiDecision(state, result);
}

function validateAiDecision(state, decision) {
  const reservedStamina = DISTANCE_CARD_BASE[decision.distanceCard]?.cost ?? 0;
  const validCombat = getAvailableCombatCards(state.ai, state.distance, reservedStamina);
  if (!validCombat.includes(decision.combatCard)) {
    decision.combatCard = pick(validCombat);
  }
  return decision;
}

function pick(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function getAvail(state) {
  const dist = state.distance;
  const ai = state.ai;
  const distCards = getAvailableDistanceCards(ai, dist);
  const combatCards = getAvailableCombatCards(ai, dist);
  return { distCards, combatCards };
}

function getWeaponAdvZone(weapon) {
  return WEAPON_ZONES[weapon].advantage;
}

function directionToAdvantage(weapon, currentDist) {
  const advZone = getWeaponAdvZone(weapon);
  if (advZone.includes(currentDist)) return DistanceCard.HOLD;
  const avg = advZone.reduce((a, b) => a + b, 0) / advZone.length;
  return currentDist > avg ? DistanceCard.ADVANCE : DistanceCard.RETREAT;
}

// ═══════ 新克制表（方案A：擒拿克闪避+格挡, 卸力克重击+擒拿）═══════
// 重击 赢 轻击/擒拿, 输 卸力
// 轻击 赢 卸力/擒拿, 输 重击/格挡
// 格挡 赢 轻击, 输 重击/擒拿
// 卸力 赢 重击/擒拿, 输 轻击
// 擒拿 赢 格挡/闪避, 输 重击/轻击/卸力

function getCounter(opCard, available) {
  // 返回当前新规则下对指定卡的最优克制
  const map = {
    [CombatCard.SLASH]:   [CombatCard.DEFLECT, CombatCard.BLOCK],  // 卸力大胜, 格挡减伤
    [CombatCard.THRUST]:  [CombatCard.BLOCK, CombatCard.SLASH],    // 格挡完抵, 重击碾压
    [CombatCard.FEINT]:   [CombatCard.DEFLECT, CombatCard.SLASH, CombatCard.THRUST], // 卸力识破, 重击/轻击直伤
    [CombatCard.BLOCK]:   [CombatCard.FEINT, CombatCard.SLASH],    // 擒拿骗, 重击破
    [CombatCard.DEFLECT]: [CombatCard.THRUST, CombatCard.BLOCK],   // 轻击穿透, 格挡无伤
  };
  const choices = map[opCard] || [];
  for (const c of choices) {
    if (available.includes(c)) return c;
  }
  return null;
}

// ═══════ 通用辅助 ═══════

// 分析玩家近N回合攻防卡频率
function analyzePlayerCombat(history, n) {
  const recent = history.slice(-n);
  const freq = {};
  for (const c of Object.values(CombatCard)) freq[c] = 0;
  recent.forEach(h => freq[h.playerCombat]++);
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return { freq, sorted, mostUsed: sorted[0]?.[0], mostCount: sorted[0]?.[1] || 0 };
}

// 分析玩家近N回合身法卡频率
function analyzePlayerDist(history, n) {
  const recent = history.slice(-n);
  const freq = {};
  for (const c of Object.values(DistanceCard)) freq[c] = 0;
  recent.forEach(h => freq[h.playerDistance]++);
  return freq;
}

// 闪避评估：对手攻击威胁高时闪避
function shouldDodge(state, distCards, urgency) {
  if (!distCards.includes(DistanceCard.DODGE)) return false;
  if (state.ai.stamina < 2) return false;
  const aiStance = state.ai.stance;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const playerInAdv = WEAPON_ZONES[playerWeapon]?.advantage.includes(dist);

  // 低架势时闪避逃生
  if (aiStance <= 2 && Math.random() < urgency + 0.15) return true;
  // 对手在优势区时闪避
  if (playerInAdv && Math.random() < urgency) return true;
  return false;
}

// 智能身法选择（通用，各级共用，参数控制精度）
function chooseDistCard(state, distCards, opts = {}) {
  const { weapon, stamina } = state.ai;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const aiAdvZone = WEAPON_ZONES[weapon].advantage;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const aiInAdv = aiAdvZone.includes(dist);
  const playerInAdv = playerAdvZone.includes(dist);

  const dodgeUrgency = opts.dodgeUrgency || 0;
  const staminaAware = opts.staminaAware || false;
  const escapeChance = opts.escapeChance || 0.4;

  // 闪避评估
  if (dodgeUrgency > 0 && shouldDodge(state, distCards, dodgeUrgency)) {
    return DistanceCard.DODGE;
  }

  // 体力管理：低体力时优先扎马
  if (staminaAware && stamina <= 1 && !playerInAdv) {
    return DistanceCard.HOLD;
  }

  let distCard;
  if (playerInAdv && !aiInAdv) {
    // 对手在优势区→逃离
    const toAdv = directionToAdvantage(weapon, dist);
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = Math.random() < escapeChance ? escapeDir : toAdv;
  } else if (aiInAdv && !playerInAdv) {
    distCard = DistanceCard.HOLD;
  } else if (aiInAdv && playerInAdv) {
    // 双方都在优势区→尝试找只对自己有利的距离
    const bestDist = aiAdvZone.filter(d => !playerAdvZone.includes(d));
    if (bestDist.length) {
      const target = bestDist[0];
      distCard = target < dist ? DistanceCard.ADVANCE : (target > dist ? DistanceCard.RETREAT : DistanceCard.HOLD);
    } else {
      const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
      distCard = distCards.includes(escapeDir) ? escapeDir : DistanceCard.HOLD;
    }
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }

  if (!distCards.includes(distCard)) distCard = pick(distCards);
  return distCard;
}

// ═══════ Level 1 — 村口恶霸（有倾向的随机）═══════
// 不完全随机，有基本偏好：趋向优势区，优势区偏攻击，非优势偏防御
function aiLevel1(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const dist = state.distance;

  // 身法：60%概率往优势区走，40%随机
  let distCard;
  if (Math.random() < 0.6) {
    distCard = directionToAdvantage(weapon, dist);
    if (!distCards.includes(distCard)) distCard = pick(distCards);
  } else {
    distCard = pick(distCards);
  }

  // 攻防：优势区偏攻击，否则均匀但稍偏格挡
  let combatCard;
  if (isAdvantage(weapon, dist)) {
    const atk = combatCards.filter(c => CARD_TYPE_MAP[c] === CardType.ATTACK);
    combatCard = atk.length && Math.random() < 0.65 ? pick(atk) : pick(combatCards);
  } else {
    // 非优势区稍偏防御
    const opts = [CombatCard.BLOCK, CombatCard.THRUST, CombatCard.SLASH].filter(c => combatCards.includes(c));
    combatCard = opts.length ? weightedPick(opts, [3, 2, 1]) : pick(combatCards);
  }
  return { distanceCard: distCard, combatCard };
}

// ═══════ Level 2 — 山贼学徒（基本反应）═══════
// 会看上一回合出牌并尝试克制，40%概率成功读到
function aiLevel2(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const dist = state.distance;
  const history = state.history;

  let distCard = chooseDistCard(state, distCards, { escapeChance: 0.3 });

  let combatCard;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 40%概率反制上回合
  if (lastRound && Math.random() < 0.4) {
    combatCard = getCounter(lastRound.playerCombat, combatCards);
  }

  if (!combatCard) {
    if (isAdvantage(weapon, dist)) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? pick(opts) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.THRUST].filter(c => combatCards.includes(c));
      combatCard = opts.length ? pick(opts) : pick(combatCards);
    }
  }
  return { distanceCard: distCard, combatCard };
}

// ═══════ Level 3 — 武馆弟子（战术意识）═══════
// 侦察2回合模式，55%反制。知道趁僵直进攻。基本架势管理。
function aiLevel3(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const dist = state.distance;
  const history = state.history;

  let distCard = chooseDistCard(state, distCards, {
    staminaAware: true,
    escapeChance: 0.45,
    dodgeUrgency: 0.15,
  });

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 自身低架势→防御自保（混合格挡/卸力，避免被擒拿反复刷）
  if (aiStance <= 1) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length && Math.random() < 0.7) combatCard = pick(safe);
  } else if (aiStance <= 2 && Math.random() < 0.5) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length) combatCard = pick(safe);
  }

  // 对手僵直→重击
  if (!combatCard && state.player.staggered) {
    const atk = [CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (atk.length) combatCard = atk[0];
  }

  // 对手低架势→施压
  if (!combatCard && playerStance <= 2) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pick(pressure);
  }

  // 55%反制上回合
  if (!combatCard && lastRound && Math.random() < 0.55) {
    combatCard = getCounter(lastRound.playerCombat, combatCards);
  }

  // 2回合重复检测
  if (!combatCard && history.length >= 2) {
    const last2 = history.slice(-2).map(h => h.playerCombat);
    if (last2[0] === last2[1]) {
      const counter = getCounter(last2[1], combatCards);
      if (counter && Math.random() < 0.65) combatCard = counter;
    }
  }

  if (!combatCard) {
    if (isAdvantage(weapon, dist)) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.THRUST, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 1]) : pick(combatCards);
    }
  }
  return { distanceCard: distCard, combatCard };
}

// ═══════ Level 4 — 镖局镖师（老练战斗）═══════
// 3回合频率分析，65%反制。连招链(擒拿→重击)。体力管理+闪避。
function aiLevel4(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const dist = state.distance;
  const history = state.history;

  let distCard = chooseDistCard(state, distCards, {
    staminaAware: true,
    escapeChance: 0.55,
    dodgeUrgency: 0.2,
  });

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 低架势→防御自保（混合选择避免可预测）
  if (aiStance <= 1) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length && Math.random() < 0.75) combatCard = pick(safe);
  } else if (aiStance <= 2) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length && Math.random() < 0.55) combatCard = pick(safe);
  }

  // 僵直惩罚→重击
  if (!combatCard && state.player.staggered) {
    if (combatCards.includes(CombatCard.SLASH)) combatCard = CombatCard.SLASH;
  }

  // 对手低架势→施压处决
  if (!combatCard && playerStance <= 2) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  // 连招链：上回合擒拿成功骗出格挡/卸力→这回合重击
  if (!combatCard && lastRound) {
    if (lastRound.aiCombat === CombatCard.FEINT
      && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)
      && combatCards.includes(CombatCard.SLASH)) {
      combatCard = CombatCard.SLASH;
    }
    // 上回合重击被卸力→改用轻击
    if (!combatCard && lastRound.aiCombat === CombatCard.SLASH
      && lastRound.playerCombat === CombatCard.DEFLECT
      && combatCards.includes(CombatCard.THRUST)) {
      combatCard = CombatCard.THRUST;
    }
  }

  // 3回合频率分析，65%反制
  if (!combatCard && history.length >= 2) {
    const { mostUsed, mostCount } = analyzePlayerCombat(history, 3);
    if (mostCount >= 2) {
      const counter = getCounter(mostUsed, combatCards);
      if (counter && Math.random() < 0.65) combatCard = counter;
    }
  }

  // 回退：上回合反制
  if (!combatCard && lastRound && Math.random() < 0.55) {
    combatCard = getCounter(lastRound.playerCombat, combatCards);
  }

  if (!combatCard) {
    if (isAdvantage(weapon, dist)) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.THRUST, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2]) : pick(combatCards);
    }
  }
  return { distanceCard: distCard, combatCard };
}

// ═══════ Level 5 — 江湖武师（深层读心）═══════
// 5回合分析。反制成功率75%。识别玩家身法卡习惯并预判。主动变招打破节奏。
function aiLevel5(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  // 身法：分析玩家移动倾向
  let distCard;
  if (history.length >= 3) {
    const distFreq = analyzePlayerDist(history, 4);
    const playerLikesDodge = distFreq[DistanceCard.DODGE] >= 2;
    // 对手喜欢闪避→擒拿能穿透闪避，优先擒拿（在攻防卡选择中体现）
    // 对手喜欢冲步→考虑撤步保持距离
    if (distFreq[DistanceCard.ADVANCE] >= 3 && distCards.includes(DistanceCard.RETREAT)) {
      distCard = DistanceCard.RETREAT;
    }
  }
  if (!distCard) {
    distCard = chooseDistCard(state, distCards, {
      staminaAware: true,
      escapeChance: 0.6,
      dodgeUrgency: 0.3,
    });
  }

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 低架势→防御自保（高级AI预判玩家会出擒拿破格挡，混入攻击反制）
  if (aiStance <= 1) {
    // 预判玩家看到低架势会出擒拿→用重击/轻击惩罚
    const antiFeint = [CombatCard.SLASH, CombatCard.THRUST].filter(c => combatCards.includes(c));
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (Math.random() < 0.35 && antiFeint.length) {
      combatCard = pick(antiFeint);
    } else if (safe.length) {
      combatCard = pick(safe);
    }
  } else if (aiStance <= 2) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length && Math.random() < 0.6) combatCard = pick(safe);
  }

  // 僵直惩罚
  if (!combatCard && state.player.staggered) {
    if (combatCards.includes(CombatCard.SLASH)) combatCard = CombatCard.SLASH;
  }

  // 对手低架势→精准施压
  if (!combatCard && playerStance <= 2) {
    const pressure = [CombatCard.FEINT, CombatCard.SLASH, CombatCard.THRUST].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  // 连招链
  if (!combatCard && lastRound) {
    if (lastRound.aiCombat === CombatCard.FEINT
      && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)
      && combatCards.includes(CombatCard.SLASH)) {
      combatCard = CombatCard.SLASH;
    }
    if (!combatCard && lastRound.aiCombat === CombatCard.SLASH
      && lastRound.playerCombat === CombatCard.DEFLECT
      && combatCards.includes(CombatCard.THRUST)) {
      combatCard = CombatCard.THRUST;
    }
    // 上回合对手闪避→这回合擒拿穿透
    if (!combatCard && lastRound.playerDistance === DistanceCard.DODGE && combatCards.includes(CombatCard.FEINT)) {
      if (Math.random() < 0.6) combatCard = CombatCard.FEINT;
    }
  }

  // 5回合频率分析，75%反制
  if (!combatCard && history.length >= 3) {
    const { mostUsed, mostCount, sorted } = analyzePlayerCombat(history, 5);
    if (mostCount >= 2) {
      const counter = getCounter(mostUsed, combatCards);
      if (counter && Math.random() < 0.75) combatCard = counter;
    }
    // 次高频也考虑
    if (!combatCard && sorted[1] && sorted[1][1] >= 2) {
      const counter = getCounter(sorted[1][0], combatCards);
      if (counter && Math.random() < 0.5) combatCard = counter;
    }
  }

  // 上回合反制
  if (!combatCard && lastRound && Math.random() < 0.6) {
    combatCard = getCounter(lastRound.playerCombat, combatCards);
  }

  if (!combatCard) {
    if (isAdvantage(weapon, dist)) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2, 1]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.THRUST, CombatCard.DEFLECT, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2, 1]) : pick(combatCards);
    }
  }
  return { distanceCard: distCard, combatCard };
}

// ═══════ Level 6 — 一流高手（全局策略）═══════
// 深度频率分析+多层连招+完美惩罚+闪避预判。85%读心率。
function aiLevel6(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 身法：读玩家身法习惯
  let distCard;
  if (history.length >= 3) {
    const distFreq = analyzePlayerDist(history, 5);
    // 对手频繁闪避→保持距离出擒拿
    if (distFreq[DistanceCard.DODGE] >= 2) {
      if (isAdvantage(weapon, dist)) distCard = DistanceCard.HOLD;
      else distCard = directionToAdvantage(weapon, dist);
    }
    // 对手频繁冲步→反向利用
    if (!distCard && distFreq[DistanceCard.ADVANCE] >= 3) {
      if (isAdvantage(weapon, dist)) distCard = DistanceCard.HOLD; // 他冲过来正好
      else distCard = distCards.includes(DistanceCard.RETREAT) ? DistanceCard.RETREAT : directionToAdvantage(weapon, dist);
    }
  }
  if (!distCard) {
    distCard = chooseDistCard(state, distCards, {
      staminaAware: true,
      escapeChance: 0.65,
      dodgeUrgency: 0.35,
    });
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;

  // 低架势→防御（高手AI预判玩家反套路，不固定格挡）
  if (aiStance <= 1) {
    // 高手知道玩家会用擒拿打格挡，所以混入攻击反制
    const antiFeint = [CombatCard.SLASH, CombatCard.THRUST].filter(c => combatCards.includes(c));
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    // 如果最近玩家频繁用擒拿，加大攻击概率
    const recentFeints = history.slice(-3).filter(h => h.playerCombat === CombatCard.FEINT).length;
    const attackChance = recentFeints >= 1 ? 0.45 : 0.3;
    if (Math.random() < attackChance && antiFeint.length) {
      combatCard = pick(antiFeint);
    } else if (safe.length) {
      combatCard = pick(safe);
    }
  } else if (aiStance <= 2) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length && Math.random() < 0.55) combatCard = pick(safe);
  }

  // 僵直惩罚
  if (!combatCard && state.player.staggered) {
    combatCard = combatCards.includes(CombatCard.SLASH) ? CombatCard.SLASH : null;
  }

  // 低架势施压
  if (!combatCard && playerStance <= 2) {
    const pressure = [CombatCard.FEINT, CombatCard.THRUST, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  // 多层连招
  if (!combatCard && lastRound) {
    // 擒拿→重击 (对手上回合被骗出防御)
    if (lastRound.aiCombat === CombatCard.FEINT
      && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)) {
      combatCard = combatCards.includes(CombatCard.SLASH) ? CombatCard.SLASH : null;
    }
    // 重击被卸力→轻击穿透
    if (!combatCard && lastRound.aiCombat === CombatCard.SLASH && lastRound.playerCombat === CombatCard.DEFLECT) {
      combatCard = combatCards.includes(CombatCard.THRUST) ? CombatCard.THRUST : null;
    }
    // 轻击被格挡→擒拿破格挡
    if (!combatCard && lastRound.aiCombat === CombatCard.THRUST && lastRound.playerCombat === CombatCard.BLOCK) {
      combatCard = combatCards.includes(CombatCard.FEINT) ? CombatCard.FEINT : null;
    }
    // 对手上回合闪避→这回合擒拿穿透
    if (!combatCard && lastRound.playerDistance === DistanceCard.DODGE) {
      if (combatCards.includes(CombatCard.FEINT) && Math.random() < 0.7) combatCard = CombatCard.FEINT;
    }
  }

  // 6回合深度频率分析，85%
  if (!combatCard && history.length >= 3) {
    const { mostUsed, mostCount, sorted } = analyzePlayerCombat(history, 6);
    if (mostCount >= 2) {
      const counter = getCounter(mostUsed, combatCards);
      if (counter && Math.random() < 0.85) combatCard = counter;
    }
    if (!combatCard && sorted[1]?.[1] >= 2) {
      const counter = getCounter(sorted[1][0], combatCards);
      if (counter && Math.random() < 0.6) combatCard = counter;
    }
  }

  if (!combatCard && lastRound) {
    combatCard = getCounter(lastRound.playerCombat, combatCards);
  }

  if (!combatCard) {
    if (isAdvantage(weapon, dist)) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 3, 2, 1]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.DEFLECT, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2, 1]) : pick(combatCards);
    }
  }
  return { distanceCard: distCard, combatCard };
}

// ═══════ Level 7 — 宗师（反读心+变招）═══════
// 在高读心基础上加入"反读心"：主动变招防止被玩家反制。自身也避免出牌模式化。
function aiLevel7(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 身法
  let distCard;
  if (history.length >= 3) {
    const distFreq = analyzePlayerDist(history, 5);
    if (distFreq[DistanceCard.DODGE] >= 2) {
      distCard = isAdvantage(weapon, dist) ? DistanceCard.HOLD : directionToAdvantage(weapon, dist);
    }
  }
  if (!distCard) {
    distCard = chooseDistCard(state, distCards, {
      staminaAware: true,
      escapeChance: 0.7,
      dodgeUrgency: 0.35,
    });
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;

  // 检查AI自身是否出牌过于模式化（连续2回合出同一张）→ 强制变招
  let aiRepeat = false;
  if (history.length >= 2) {
    const last2ai = history.slice(-2).map(h => h.aiCombat);
    aiRepeat = last2ai[0] === last2ai[1];
  }

  // 低架势→防御（宗师AI反读心：玩家看到低架势会出擒拿，AI反制）
  if (aiStance <= 1) {
    const antiFeint = [CombatCard.SLASH, CombatCard.THRUST].filter(c => combatCards.includes(c));
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    const recentFeints = history.slice(-3).filter(h => h.playerCombat === CombatCard.FEINT).length;
    const attackChance = recentFeints >= 1 ? 0.5 : 0.35;
    if (Math.random() < attackChance && antiFeint.length) {
      combatCard = pick(antiFeint);
    } else if (safe.length) {
      combatCard = pick(safe);
    }
  } else if (aiStance <= 2) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length && Math.random() < 0.5) combatCard = pick(safe);
  }

  // 僵直惩罚
  if (!combatCard && state.player.staggered) {
    combatCard = combatCards.includes(CombatCard.SLASH) ? CombatCard.SLASH : null;
  }

  // 处决压力
  if (!combatCard && playerStance <= 2) {
    const pressure = [CombatCard.FEINT, CombatCard.THRUST, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  // 多层连招
  if (!combatCard && lastRound) {
    if (lastRound.aiCombat === CombatCard.FEINT
      && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)) {
      combatCard = combatCards.includes(CombatCard.SLASH) ? CombatCard.SLASH : null;
    }
    if (!combatCard && lastRound.aiCombat === CombatCard.SLASH && lastRound.playerCombat === CombatCard.DEFLECT) {
      combatCard = combatCards.includes(CombatCard.THRUST) ? CombatCard.THRUST : null;
    }
    if (!combatCard && lastRound.aiCombat === CombatCard.THRUST && lastRound.playerCombat === CombatCard.BLOCK) {
      combatCard = combatCards.includes(CombatCard.FEINT) ? CombatCard.FEINT : null;
    }
    if (!combatCard && lastRound.playerDistance === DistanceCard.DODGE) {
      if (combatCards.includes(CombatCard.FEINT)) combatCard = CombatCard.FEINT;
    }
  }

  // 深度频率分析
  if (!combatCard && history.length >= 3) {
    const { mostUsed, mostCount, sorted } = analyzePlayerCombat(history, 6);
    if (mostCount >= 2) {
      const counter = getCounter(mostUsed, combatCards);
      if (counter) combatCard = counter; // 近乎100%读取
    }
    if (!combatCard && sorted[1]?.[1] >= 2) {
      const counter = getCounter(sorted[1][0], combatCards);
      if (counter && Math.random() < 0.7) combatCard = counter;
    }
  }

  if (!combatCard && lastRound) {
    combatCard = getCounter(lastRound.playerCombat, combatCards);
  }

  // 反模式化：如果AI连续出同一张牌，20%概率随机换一张
  if (combatCard && aiRepeat && lastRound && combatCard === lastRound.aiCombat && Math.random() < 0.2) {
    const others = combatCards.filter(c => c !== combatCard);
    if (others.length) combatCard = pick(others);
  }

  if (!combatCard) {
    if (isAdvantage(weapon, dist)) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 3, 2, 1]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.DEFLECT, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2, 1]) : pick(combatCards);
    }
  }
  return { distanceCard: distCard, combatCard };
}

// ═══════ Level 8 — 绝世高手（博弈论最优）═══════
// 近完美决策：二阶预测（预判玩家的预判），纳什混合策略，完美血量/架势/体力管理
function aiLevel8(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // ── 身法：最优区位控制 ──
  let distCard;
  const aiInAdv = isAdvantage(weapon, dist);
  const playerInAdv = isAdvantage(playerWeapon, dist);

  // 分析玩家身法倾向
  if (history.length >= 3) {
    const distFreq = analyzePlayerDist(history, 5);
    // 对手频繁闪避→占位不动（擒拿穿透闪避）
    if (distFreq[DistanceCard.DODGE] >= 2 && aiInAdv) {
      distCard = DistanceCard.HOLD;
    }
  }

  if (!distCard) {
    // 体力管理：极低体力+不在危险处→扎马
    if (state.ai.stamina <= 1 && !playerInAdv && state.ai.stance > 2) {
      distCard = DistanceCard.HOLD;
    }
  }

  if (!distCard) {
    // 低架势时闪避逃生（更积极）
    if (shouldDodge(state, distCards, 0.45)) {
      distCard = DistanceCard.DODGE;
    }
  }

  if (!distCard) {
    distCard = chooseDistCard(state, distCards, {
      staminaAware: true,
      escapeChance: 0.75,
      dodgeUrgency: 0,
    });
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  // ── 攻防：多层决策树 ──
  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;
  const aiHp = state.ai.hp;
  const playerHp = state.player.hp;

  // 第0优先级：架势极低→防御为主，但预判玩家用擒拿破格挡
  if (aiStance <= 1) {
    const antiFeint = [CombatCard.SLASH, CombatCard.THRUST].filter(c => combatCards.includes(c));
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    // 二阶预判：玩家看到低架势→出擒拿→AI用攻击惩罚
    const recentFeints = history.slice(-3).filter(h => h.playerCombat === CombatCard.FEINT).length;
    const attackChance = recentFeints >= 1 ? 0.5 : 0.35;
    if (Math.random() < attackChance && antiFeint.length) {
      combatCard = pick(antiFeint);
    } else if (safe.length) {
      combatCard = pick(safe);
    }
  }
  if (!combatCard && aiStance <= 2) {
    const safe = [CombatCard.BLOCK, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
    if (safe.length && Math.random() < 0.55) combatCard = pick(safe);
  }

  // 僵直→重击（无风险最大伤害）
  if (!combatCard && state.player.staggered) {
    combatCard = combatCards.includes(CombatCard.SLASH) ? CombatCard.SLASH : null;
  }

  // 对手濒死→追杀（选伤害最高的攻击）
  if (!combatCard && playerHp <= 3) {
    if (isAdvantage(weapon, dist) && combatCards.includes(CombatCard.SLASH)) {
      combatCard = CombatCard.SLASH;
    } else if (combatCards.includes(CombatCard.THRUST)) {
      combatCard = CombatCard.THRUST;
    }
  }

  // 对手低架势→精准施压
  if (!combatCard && playerStance <= 2) {
    const pressure = [CombatCard.FEINT, CombatCard.THRUST, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  // 二阶预测：根据AI上回合出牌，预测玩家会出什么反制，再反制那个反制
  if (!combatCard && lastRound) {
    // 玩家看到AI上回合出X，可能这回合出Y来克制
    const aiLastCard = lastRound.aiCombat;
    const playerProbableCounter = getCounter(aiLastCard, Object.values(CombatCard));
    if (playerProbableCounter) {
      const antiCounter = getCounter(playerProbableCounter, combatCards);
      if (antiCounter && Math.random() < 0.6) combatCard = antiCounter;
    }
  }

  // 多层连招
  if (!combatCard && lastRound) {
    if (lastRound.aiCombat === CombatCard.FEINT
      && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)) {
      combatCard = combatCards.includes(CombatCard.SLASH) ? CombatCard.SLASH : null;
    }
    if (!combatCard && lastRound.aiCombat === CombatCard.SLASH && lastRound.playerCombat === CombatCard.DEFLECT) {
      combatCard = combatCards.includes(CombatCard.THRUST) ? CombatCard.THRUST : null;
    }
    if (!combatCard && lastRound.aiCombat === CombatCard.THRUST && lastRound.playerCombat === CombatCard.BLOCK) {
      combatCard = combatCards.includes(CombatCard.FEINT) ? CombatCard.FEINT : null;
    }
    if (!combatCard && lastRound.playerDistance === DistanceCard.DODGE) {
      combatCard = combatCards.includes(CombatCard.FEINT) ? CombatCard.FEINT : null;
    }
  }

  // 深度频率分析（近乎100%读取）
  if (!combatCard && history.length >= 2) {
    const { mostUsed, mostCount, sorted } = analyzePlayerCombat(history, 8);
    if (mostCount >= 2) {
      const counter = getCounter(mostUsed, combatCards);
      if (counter) combatCard = counter;
    }
    if (!combatCard && sorted[1]?.[1] >= 2) {
      const counter = getCounter(sorted[1][0], combatCards);
      if (counter) combatCard = counter;
    }
  }

  if (!combatCard && lastRound) {
    combatCard = getCounter(lastRound.playerCombat, combatCards);
  }

  // 混合策略：即使有读到的牌，20%概率打乱（防止玩家反读AI的模式）
  if (combatCard && history.length >= 4 && Math.random() < 0.15) {
    // 选另一张合理的牌（非纯随机，而是次优解）
    const others = combatCards.filter(c => c !== combatCard);
    if (others.length) {
      const weights = others.map(c => {
        if (CARD_TYPE_MAP[c] === CardType.ATTACK && isAdvantage(weapon, dist)) return 3;
        if (c === CombatCard.BLOCK && aiStance <= 3) return 2;
        return 1;
      });
      combatCard = weightedPick(others, weights);
    }
  }

  if (!combatCard) {
    if (isAdvantage(weapon, dist)) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [4, 3, 2, 1]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.DEFLECT, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 3, 2, 1]) : pick(combatCards);
    }
  }
  return { distanceCard: distCard, combatCard };
}
