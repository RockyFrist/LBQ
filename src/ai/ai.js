import { CombatCard, DistanceCard, CardType } from '../types.js';
import { WEAPON_ZONES, CARD_TYPE_MAP, COMBAT_CARD_BASE, gameConfig } from '../constants.js';
import { getAvailableCombatCards, getAvailableDistanceCards } from '../engine/card-validator.js';
import { isAdvantage, isDisadvantage } from '../engine/weapon.js';

export function aiDecide(state) {
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

function aiLevel1(state) {
  const { distCards, combatCards } = getAvail(state);
  return { distanceCard: pick(distCards), combatCard: pick(combatCards) };
}

function aiLevel2(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const dist = state.distance;

  let distCard = directionToAdvantage(weapon, dist);
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  const filtered = combatCards.filter(c => c !== CombatCard.FEINT && c !== CombatCard.DEFLECT);
  const pool = filtered.length > 0 ? filtered : combatCards;

  let combatCard;
  if (isAdvantage(weapon, dist)) {
    combatCard = pool.reduce((best, c) => {
      const dmg = COMBAT_CARD_BASE[c].damage;
      const bestDmg = COMBAT_CARD_BASE[best].damage;
      return dmg > bestDmg ? c : best;
    }, pool[0]);
  } else {
    combatCard = pool.reduce((best, c) => {
      const cost = COMBAT_CARD_BASE[c].cost;
      const bestCost = COMBAT_CARD_BASE[best].cost;
      return cost < bestCost ? c : best;
    }, pool[0]);
  }

  return { distanceCard: distCard, combatCard };
}

function aiLevel3(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  let distCard;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const playerInAdv = playerAdvZone.includes(dist);

  if (playerInAdv && Math.random() < 0.5) {
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = distCards.includes(escapeDir) ? escapeDir : directionToAdvantage(weapon, dist);
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  let combatCard;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  if (lastRound) {
    const counter = getSimpleCounter(lastRound.playerCombat, combatCards);
    if (counter && Math.random() < 0.55) {
      combatCard = counter;
    }
  }

  if (!combatCard) {
    if (state.player.stance >= 4 && combatCards.includes(CombatCard.THRUST)) {
      combatCard = CombatCard.THRUST;
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

function aiLevel4(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  let distCard;
  const aiAdvZone = WEAPON_ZONES[weapon].advantage;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const aiInAdv = aiAdvZone.includes(dist);
  const playerInAdv = playerAdvZone.includes(dist);

  if (playerInAdv && !aiInAdv) {
    const toAdv = directionToAdvantage(weapon, dist);
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    if (toAdv !== DistanceCard.HOLD && toAdv !== escapeDir) {
      distCard = Math.random() < 0.6 ? toAdv : escapeDir;
    } else {
      distCard = escapeDir;
    }
  } else if (aiInAdv) {
    distCard = DistanceCard.HOLD;
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;

  if (aiStance >= 3) {
    const safe = combatCards.filter(c => c === CombatCard.DODGE || c === CombatCard.BLOCK);
    if (safe.length) { combatCard = pick(safe); }
  }

  if (!combatCard && playerStance >= 3) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) { combatCard = pick(pressure); }
  }

  if (!combatCard && history.length >= 2) {
    const last2 = history.slice(-2);
    const playerCards = last2.map(h => h.playerCombat);
    if (playerCards[0] === playerCards[1]) {
      const counter = getSimpleCounter(playerCards[1], combatCards);
      if (counter && Math.random() < 0.7) combatCard = counter;
    }
    if (!combatCard) {
      const counter = getSimpleCounter(playerCards[1], combatCards);
      if (counter && Math.random() < 0.5) combatCard = counter;
    }
  }

  if (!combatCard && state.ai.stamina <= 2) {
    const cheap = combatCards.filter(c => COMBAT_CARD_BASE[c].cost <= 1);
    if (cheap.length) combatCard = pick(cheap);
  }

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

function aiLevel5(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  let distCard;
  const aiAdvZone = WEAPON_ZONES[weapon].advantage;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const aiInAdv = aiAdvZone.includes(dist);
  const playerInAdv = playerAdvZone.includes(dist);

  if (playerInAdv && !aiInAdv) {
    const toAdv = directionToAdvantage(weapon, dist);
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    if (toAdv !== DistanceCard.HOLD && toAdv !== escapeDir) {
      distCard = Math.random() < 0.65 ? toAdv : escapeDir;
    } else {
      distCard = escapeDir;
    }
  } else if (aiInAdv && !playerInAdv) {
    distCard = DistanceCard.HOLD;
    if (!distCards.includes(distCard)) distCard = directionToAdvantage(weapon, dist);
  } else if (aiInAdv && playerInAdv) {
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    distCard = distCards.includes(escapeDir) ? escapeDir : DistanceCard.HOLD;
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;

  const recent = history.slice(-5);
  const freq = {};
  for (const c of Object.values(CombatCard)) freq[c] = 0;
  recent.forEach(h => freq[h.playerCombat]++);
  const topCards = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const mostUsed = topCards[0] ? topCards[0][0] : null;
  const mostUsedCount = topCards[0] ? topCards[0][1] : 0;

  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  if (aiStance >= 4) {
    const safe = [CombatCard.DODGE, CombatCard.BLOCK].filter(c => combatCards.includes(c));
    if (safe.length) combatCard = pick(safe);
  }

  if (!combatCard && playerStance >= 3) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT, CombatCard.SLASH].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  if (!combatCard && lastRound) {
    if (lastRound.aiCombat === CombatCard.FEINT
      && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)
      && combatCards.includes(CombatCard.SLASH)) {
      combatCard = CombatCard.SLASH;
    }
    if (!combatCard && state.player.staggered && combatCards.includes(CombatCard.SLASH)) {
      combatCard = CombatCard.SLASH;
    }
  }

  if (!combatCard && mostUsedCount >= 2) {
    const counter = getSmartCounter(mostUsed, combatCards, playerWeapon, dist);
    if (counter && Math.random() < 0.8) combatCard = counter;
  }

  if (!combatCard && lastRound) {
    const counter = getSmartCounter(lastRound.playerCombat, combatCards, playerWeapon, dist);
    if (counter && Math.random() < 0.6) combatCard = counter;
  }

  if (!combatCard && state.ai.stamina <= 2) {
    const cheap = combatCards.filter(c => COMBAT_CARD_BASE[c].cost <= 1);
    if (cheap.length) combatCard = pick(cheap);
  }

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

function getSmartCounter(opCard, available, opWeapon, dist) {
  const counters = {
    [CombatCard.SLASH]: [CombatCard.DEFLECT, CombatCard.DODGE],
    [CombatCard.THRUST]: [CombatCard.BLOCK, CombatCard.DODGE],
    [CombatCard.FEINT]: [CombatCard.THRUST, CombatCard.SLASH],
    [CombatCard.BLOCK]: [CombatCard.FEINT, CombatCard.SLASH],
    [CombatCard.DODGE]: [CombatCard.SLASH, CombatCard.FEINT],
    [CombatCard.DEFLECT]: [CombatCard.THRUST, CombatCard.FEINT],
  };
  const choices = counters[opCard] || [];
  for (const c of choices) {
    if (available.includes(c)) return c;
  }
  return null;
}

function aiLevel6(state) {
  const { distCards, combatCards } = getAvail(state);
  const weapon = state.ai.weapon;
  const playerWeapon = state.player.weapon;
  const dist = state.distance;
  const history = state.history;

  let distCard;
  const aiAdvZone = WEAPON_ZONES[weapon].advantage;
  const playerAdvZone = WEAPON_ZONES[playerWeapon].advantage;
  const aiInAdv = aiAdvZone.includes(dist);
  const playerInAdv = playerAdvZone.includes(dist);

  let predictedPlayerMove = null;
  if (history.length >= 2) {
    const last3 = history.slice(-3);
    const advCount = last3.filter(h => h.playerDistance === DistanceCard.ADVANCE).length;
    const retCount = last3.filter(h => h.playerDistance === DistanceCard.RETREAT).length;
    if (advCount > retCount) predictedPlayerMove = DistanceCard.ADVANCE;
    else if (retCount > advCount) predictedPlayerMove = DistanceCard.RETREAT;
  }

  if (playerInAdv && !aiInAdv) {
    const toAdv = directionToAdvantage(weapon, dist);
    const escapeDir = dist < 2 ? DistanceCard.RETREAT : DistanceCard.ADVANCE;
    if (toAdv !== DistanceCard.HOLD && toAdv !== escapeDir) {
      distCard = Math.random() < 0.7 ? toAdv : escapeDir;
    } else {
      distCard = escapeDir;
    }
  } else if (aiInAdv && !playerInAdv) {
    distCard = DistanceCard.HOLD;
    if (!distCards.includes(distCard)) distCard = directionToAdvantage(weapon, dist);
  } else if (aiInAdv && playerInAdv) {
    const bestDist = aiAdvZone.filter(d => !playerAdvZone.includes(d));
    if (bestDist.length) {
      const target = bestDist[0];
      distCard = target < dist ? DistanceCard.ADVANCE : (target > dist ? DistanceCard.RETREAT : DistanceCard.HOLD);
    } else {
      distCard = DistanceCard.HOLD;
    }
  } else {
    distCard = directionToAdvantage(weapon, dist);
  }
  if (!distCards.includes(distCard)) distCard = pick(distCards);

  let combatCard;
  const aiStance = state.ai.stance;
  const playerStance = state.player.stance;
  const lastRound = history.length > 0 ? history[history.length - 1] : null;

  if (aiStance >= 3) {
    const safe = [CombatCard.DODGE, CombatCard.BLOCK].filter(c => combatCards.includes(c));
    if (safe.length) combatCard = pick(safe);
  }

  if (!combatCard && playerStance >= 3) {
    const pressure = [CombatCard.THRUST, CombatCard.FEINT].filter(c => combatCards.includes(c));
    if (pressure.length) combatCard = pressure[0];
  }

  if (!combatCard && state.player.staggered) {
    const atk = [CombatCard.SLASH, CombatCard.FEINT].filter(c => combatCards.includes(c));
    if (atk.length) combatCard = atk[0];
  }

  if (!combatCard && lastRound && lastRound.aiCombat === CombatCard.FEINT
    && (lastRound.playerCombat === CombatCard.BLOCK || lastRound.playerCombat === CombatCard.DEFLECT)
    && combatCards.includes(CombatCard.SLASH)) {
    combatCard = CombatCard.SLASH;
  }

  if (!combatCard && history.length >= 3) {
    const recent = history.slice(-6);
    const freq = {};
    for (const c of Object.values(CombatCard)) freq[c] = 0;
    recent.forEach(h => freq[h.playerCombat]++);

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const top1 = sorted[0], top2 = sorted[1];

    if (top1[1] >= 2) {
      const counter = getSmartCounter(top1[0], combatCards, playerWeapon, dist);
      if (counter) combatCard = counter;
    }

    if (!combatCard && lastRound && top1[0] !== lastRound.playerCombat && top2 && top2[1] >= 1) {
      const counter = getSmartCounter(top2[0], combatCards, playerWeapon, dist);
      if (counter && Math.random() < 0.5) combatCard = counter;
    }
  }

  if (!combatCard && lastRound) {
    const counter = getSmartCounter(lastRound.playerCombat, combatCards, playerWeapon, dist);
    if (counter) combatCard = counter;
  }

  if (!combatCard && state.ai.stamina <= 2) {
    const cheap = combatCards.filter(c => COMBAT_CARD_BASE[c].cost <= 1);
    if (cheap.length) combatCard = pick(cheap);
  }

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
