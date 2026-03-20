;(function(LBQ) {

const { CombatCard, DistanceCard, CardType } = LBQ;
const { WEAPON_ZONES, CARD_TYPE_MAP, COMBAT_CARD_BASE, MAX_STAMINA, STAMINA_RECOVERY } = LBQ;
const { getAvailableCombatCards, getAvailableDistanceCards } = LBQ;
const { isAdvantage, isDisadvantage } = LBQ;

/**
 * AI 选牌入口
 * @param {object} state - gameState
 * @returns {{ distanceCard: string, combatCard: string }}
 */
function aiDecide(state) {
  const level = state.aiLevel;
  switch (level) {
    case 1: return aiLevel1(state);
    case 2: return aiLevel2(state);
    case 3: return aiLevel3(state);
    case 4: return aiLevel4(state);
    case 5: return aiLevel5(state);
    case 6: return aiLevel6(state);
    default: return aiLevel1(state);
  }
}

// ─── 工具函数 ───

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
  // 预算恢复后的体力（executeRound 先恢复体力再扣费）
  const ai = Object.assign({}, state.ai, {
    stamina: Math.min(MAX_STAMINA, state.ai.stamina + STAMINA_RECOVERY)
  });
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

// ─── 难度 1：纯随机 ───
function aiLevel1(state) {
  const { distCards, combatCards } = getAvail(state);
  return { distanceCard: pick(distCards), combatCard: pick(combatCards) };
}

// ─── 难度 2：基础规则 ───
function aiLevel2(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const dist = state.distance;

  // 距离：向优势区移动
  let distCard = directionToAdvantage(weapon, dist);
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  // 攻防：优势区选高伤害，劣势区选低消耗。不用虚晃和卸力
  const filtered = combatCards.filter(c => c !== CombatCard.FEINT && c !== CombatCard.DEFLECT);
  const pool = filtered.length > 0 ? filtered : combatCards;

  let combatCard;
  if (isAdvantage(weapon, dist)) {
    // 选伤害最高的
    combatCard = pool.reduce((best, c) => {
      const dmg = COMBAT_CARD_BASE[c].damage;
      const bestDmg = COMBAT_CARD_BASE[best].damage;
      return dmg > bestDmg ? c : best;
    }, pool[0]);
  } else {
    // 选消耗最低的
    combatCard = pool.reduce((best, c) => {
      const cost = COMBAT_CARD_BASE[c].cost;
      const bestCost = COMBAT_CARD_BASE[best].cost;
      return cost < bestCost ? c : best;
    }, pool[0]);
  }

  return { distanceCard: distCard, combatCard };
}

// ─── 难度 3：简单策略 ───
function aiLevel3(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  // 距离：向自身优势区移动，如果在对手优势区则优先逃离
  let distCard;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const playerInAdv = playerAdvZone.includes(dist);

  if (playerInAdv && Math.random() < 0.5) {
    // 50%概率意识到要逃离对手优势区
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = distCards.includes(escapeDir) ? escapeDir : directionToAdvantage(weapon, dist);
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  // 攻防：具备基础反制意识
  let combatCard;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 读牌：对手上回合出什么就针对性反制
  if (lastRound) {
    const counter = getSimpleCounter(lastRound.playerCombat, combatCards);
    if (counter && Math.random() < 0.55) {
      combatCard = counter;
    }
  }

  if (!combatCard) {
    // 架势意识
    if (state.player.stance >= 4 && combatCards.includes(CombatCard.THRUST)) {
      combatCard = CombatCard.THRUST; // 压处决
    } else if (isAdvantage(weapon, dist)) {
      const attacks = combatCards.filter(c => CARD_TYPE_MAP[c] === CardType.ATTACK);
      combatCard = attacks.length ? weightedPick(attacks, attacks.map(() => 1)) : pick(combatCards);
    } else {
      const defs = combatCards.filter(c => c === CombatCard.DODGE || c === CombatCard.BLOCK);
      combatCard = defs.length && Math.random() < 0.6 ? pick(defs) : pick(combatCards);
    }
  }

  return { distanceCard: distCard, combatCard };
}

// 简单反制表（Level 3 使用）
function getSimpleCounter(opCard, available) {
  const map = {
    [CombatCard.SLASH]: CombatCard.DEFLECT,
    [CombatCard.THRUST]: CombatCard.BLOCK,
    [CombatCard.FEINT]: CombatCard.THRUST,
    [CombatCard.BLOCK]: CombatCard.FEINT,
    [CombatCard.DODGE]: CombatCard.SLASH,
    [CombatCard.DEFLECT]: CombatCard.FEINT,
  };
  const c = map[opCard];
  return c && available.includes(c) ? c : null;
}

// ─── 难度 4：普通策略 ───
function aiLevel4(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  // 距离：双方武器意识 + 对手近期移动倾向
  let distCard;
  const aiAdvZone = WEAPON_ZONES[weapon].advantage;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const aiInAdv = aiAdvZone.includes(dist);
  const playerInAdv = playerAdvZone.includes(dist);

  if (playerInAdv && !aiInAdv) {
    // 对手在优势区→逃离
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = distCards.includes(escapeDir) ? escapeDir : directionToAdvantage(weapon, dist);
  } else if (aiInAdv) {
    distCard = DistanceCard.HOLD;
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  // 攻防：基于对手近期模式 + 架势/体力管理
  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;

  // 自身高架势→优先防守
  if (aiStance >= 3) {
    const safe = combatCards.filter(c => c === CombatCard.DODGE || c === CombatCard.BLOCK);
    if (safe.length) { combatCard = pick(safe); }
  }

  // 对手高架势→压处决
  if (!combatCard && playerStance >= 3) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) { combatCard = pick(pressure); }
  }

  // 读牌反制（分析近2回合模式）
  if (!combatCard && history.length >= 2) {
    const last2 = history.slice(-2);
    const playerCards = last2.map(h => h.playerCombat);
    // 连续同一张牌→高概率反制
    if (playerCards[0] === playerCards[1]) {
      const counter = getSimpleCounter(playerCards[1], combatCards);
      if (counter && Math.random() < 0.7) combatCard = counter;
    }
    // 非连续但有偏好
    if (!combatCard) {
      const counter = getSimpleCounter(playerCards[1], combatCards);
      if (counter && Math.random() < 0.5) combatCard = counter;
    }
  }

  // 体力管理
  if (!combatCard && state.ai.stamina <= 2) {
    const cheap = combatCards.filter(c => COMBAT_CARD_BASE[c].cost <= 1);
    if (cheap.length) combatCard = pick(cheap);
  }

  // 默认：距离适配
  if (!combatCard) {
    if (aiInAdv) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.DODGE, CombatCard.THRUST].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 1]) : pick(combatCards);
    }
  }

  return { distanceCard: distCard, combatCard };
}

// ─── 难度 5：高级策略 ───
function aiLevel5(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  // ─ 距离策略：全局最优距离管控 ─
  let distCard;
  const aiAdvZone = WEAPON_ZONES[weapon].advantage;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const aiInAdv = aiAdvZone.includes(dist);
  const playerInAdv = playerAdvZone.includes(dist);

  if (playerInAdv && !aiInAdv) {
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = distCards.includes(escapeDir) ? escapeDir : directionToAdvantage(weapon, dist);
  } else if (aiInAdv && !playerInAdv) {
    distCard = DistanceCard.HOLD;
    if (!distCards.includes(distCard)) distCard = directionToAdvantage(weapon, dist);
  } else if (aiInAdv && playerInAdv) {
    // 双方都在优势区→尝试离开对手优势区
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = distCards.includes(escapeDir) ? escapeDir : DistanceCard.HOLD;
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  // ─ 攻防策略：深度模式识别 + 最优反制 ─
  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;

  // 频率分析：近5回合出牌偏好
  const recent = history.slice(-5);
  const freq = {};
  for (const c of Object.values(CombatCard)) freq[c] = 0;
  recent.forEach(h => freq[h.playerCombat]++);
  const topCards = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const mostUsed = topCards[0] ? topCards[0][0] : null;
  const mostUsedCount = topCards[0] ? topCards[0][1] : 0;

  // 连招系统
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 优先级1：自身高架势→必须防守
  if (aiStance >= 4) {
    const safe = [CombatCard.DODGE, CombatCard.BLOCK].filter(c => combatCards.includes(c));
    if (safe.length) combatCard = pick(safe);
  }

  // 优先级2：对手高架势→压处决
  if (!combatCard && playerStance >= 3) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0]; // 选最快的
  }

  // 优先级3：连招后续
  if (!combatCard && lastRound) {
    // 上回合虚晃命中防守→这回合劈砍
    if (lastRound.aiCombat === CombatCard.FEINT
      && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)
      && combatCards.includes(CombatCard.SLASH)) {
      combatCard = CombatCard.SLASH;
    }
    // 上回合卸力成功对手僵直→趁机劈砍
    if (!combatCard && state.player.staggered && combatCards.includes(CombatCard.SLASH)) {
      combatCard = CombatCard.SLASH;
    }
  }

  // 优先级4：基于频率的精确反制
  if (!combatCard && mostUsedCount >= 2) {
    const counter = getSmartCounter(mostUsed, combatCards, playerWeapon, dist);
    if (counter && Math.random() < 0.8) combatCard = counter;
  }

  // 优先级5：读上回合出牌反制
  if (!combatCard && lastRound) {
    const counter = getSmartCounter(lastRound.playerCombat, combatCards, playerWeapon, dist);
    if (counter && Math.random() < 0.6) combatCard = counter;
  }

  // 优先级6：体力管理
  if (!combatCard && state.ai.stamina <= 2) {
    const cheap = combatCards.filter(c => COMBAT_CARD_BASE[c].cost <= 1);
    if (cheap.length) combatCard = pick(cheap);
  }

  // 默认：距离适配进攻/防守
  if (!combatCard) {
    if (aiInAdv) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 3, 2]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.DODGE, CombatCard.THRUST].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 3, 1]) : pick(combatCards);
    }
  }

  return { distanceCard: distCard, combatCard };
}

// 智能反制（Level 5-6 使用，考虑兵器和距离）
function getSmartCounter(opCard, available, opWeapon, dist) {
  // 精确克制链 + 备选
  const counters = {
    [CombatCard.SLASH]: [CombatCard.DEFLECT, CombatCard.DODGE],
    [CombatCard.THRUST]: [CombatCard.BLOCK, CombatCard.DODGE],
    [CombatCard.FEINT]: [CombatCard.THRUST, CombatCard.SLASH],
    [CombatCard.BLOCK]: [CombatCard.FEINT, CombatCard.SLASH],
    [CombatCard.DODGE]: [CombatCard.SLASH, CombatCard.FEINT], // 攻击破闪避
    [CombatCard.DEFLECT]: [CombatCard.THRUST, CombatCard.FEINT], // 点刺穿卸力
  };
  const choices = counters[opCard] || [];
  for (const c of choices) {
    if (available.includes(c)) return c;
  }
  return null;
}

// ─── 难度 6：顶级高手 ───
function aiLevel6(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  // ─ 距离：最优距离管控，预测玩家移动 ─
  let distCard;
  const aiAdvZone = WEAPON_ZONES[weapon].advantage;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const aiInAdv = aiAdvZone.includes(dist);
  const playerInAdv = playerAdvZone.includes(dist);

  // 预测玩家移动方向
  let predictedPlayerMove = null;
  if (history.length >= 2) {
    const last3 = history.slice(-3);
    const advCount = last3.filter(h => h.playerDistance === DistanceCard.ADVANCE).length;
    const retCount = last3.filter(h => h.playerDistance === DistanceCard.RETREAT).length;
    if (advCount > retCount) predictedPlayerMove = DistanceCard.ADVANCE;
    else if (retCount > advCount) predictedPlayerMove = DistanceCard.RETREAT;
  }

  if (playerInAdv && !aiInAdv) {
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = distCards.includes(escapeDir) ? escapeDir : directionToAdvantage(weapon, dist);
  } else if (aiInAdv && !playerInAdv) {
    distCard = DistanceCard.HOLD;
    // 如果预测玩家也在往AI优势区走，就保持
    if (!distCards.includes(distCard)) distCard = directionToAdvantage(weapon, dist);
  } else if (aiInAdv && playerInAdv) {
    // 想办法去「只有我优势、对手不优势」的距离
    const bestDist = aiAdvZone.filter(d => !playerAdvZone.includes(d));
    if (bestDist.length) {
      const target = bestDist[0];
      distCard = target < dist ? DistanceCard.ADVANCE : (target > dist ? DistanceCard.RETREAT : DistanceCard.HOLD);
    } else {
      // 无法避免重叠，保持
      distCard = DistanceCard.HOLD;
    }
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  // ─ 攻防：全历史频率分析 + 博弈论混合策略 ─
  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  // 自身高架势→必须保命
  if (aiStance >= 3) {
    const safe = [CombatCard.DODGE, CombatCard.BLOCK].filter(c => combatCards.includes(c));
    if (safe.length) combatCard = pick(safe);
  }

  // 对手高架势→确定性压制
  if (!combatCard && playerStance >= 3) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  // 对手僵直→全力进攻
  if (!combatCard && state.player.staggered) {
    const atk = [CombatCard.SLASH, CombatCard.FEINT].filter(c => combatCards.includes(c));
    if (atk.length) combatCard = atk[0];
  }

  // 连招：虚晃命中防守后→劈砍
  if (!combatCard && lastRound && lastRound.aiCombat === CombatCard.FEINT
    && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)
    && combatCards.includes(CombatCard.SLASH)) {
    combatCard = CombatCard.SLASH;
  }

  // 高级频率分析：找对手出牌模式
  if (!combatCard && history.length >= 3) {
    // 统计近期频率
    const recent = history.slice(-6);
    const freq = {};
    for (const c of Object.values(CombatCard)) freq[c] = 0;
    recent.forEach(h => freq[h.playerCombat]++);

    // 找前两热门出牌
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const top1 = sorted[0], top2 = sorted[1];

    // 对前两热门牌做双重反制
    if (top1[1] >= 2) {
      const counter = getSmartCounter(top1[0], combatCards, playerWeapon, dist);
      if (counter) combatCard = counter;
    }

    // 如果top1和上回合不同→预测对手可能会变招
    if (!combatCard && lastRound && top1[0] !== lastRound.playerCombat && top2 && top2[1] >= 1) {
      // 预测对手换到top2
      const counter = getSmartCounter(top2[0], combatCards, playerWeapon, dist);
      if (counter && Math.random() < 0.5) combatCard = counter;
    }
  }

  // 读单回合牌面
  if (!combatCard && lastRound) {
    const counter = getSmartCounter(lastRound.playerCombat, combatCards, playerWeapon, dist);
    if (counter) combatCard = counter;
  }

  // 体力管理
  if (!combatCard && state.ai.stamina <= 2) {
    const cheap = combatCards.filter(c => COMBAT_CARD_BASE[c].cost <= 1);
    if (cheap.length) combatCard = pick(cheap);
  }

  // 默认：混合策略（加入少量随机性防止被读）
  if (!combatCard) {
    if (aiInAdv) {
      const opts = [CombatCard.SLASH, CombatCard.THRUST, CombatCard.FEINT, CombatCard.BLOCK].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 2, 2, 1]) : pick(combatCards);
    } else {
      const opts = [CombatCard.BLOCK, CombatCard.DODGE, CombatCard.THRUST, CombatCard.DEFLECT].filter(c => combatCards.includes(c));
      combatCard = opts.length ? weightedPick(opts, [3, 3, 1, 1]) : pick(combatCards);
    }
  }

  return { distanceCard: distCard, combatCard };
}

Object.assign(LBQ, { aiDecide });

})(window.LBQ);
