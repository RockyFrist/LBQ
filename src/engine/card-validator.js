import { CombatCard, DistanceCard, CardType } from '../types.js';
import { COMBAT_CARD_BASE, CARD_TYPE_MAP, WEAPON_ZONES, MIN_DISTANCE, MAX_DISTANCE } from '../constants.js';
import { getDisabledCards, getCostModifier } from './weapon.js';
import { getDistanceCardCost } from './distance.js';

export function getCombatCardCost(card, streak, weapon, distance) {
  const base = COMBAT_CARD_BASE[card].cost;
  const effectiveStreak = (weapon === 'dual_stab' && card === CombatCard.THRUST) ? 0 : streak;
  let cost = base + effectiveStreak;
  cost += getCostModifier(weapon, distance, card);
  return Math.max(0, cost);
}

export function getAvailableCombatCards(playerState, distance) {
  const { weapon, stamina, staggered, combatCardStreak } = playerState;
  const disabled = getDisabledCards(weapon, distance);
  const allCards = Object.values(CombatCard);

  return allCards.filter(card => {
    if (disabled.includes(card)) return false;
    if (staggered && CARD_TYPE_MAP[card] === CardType.ATTACK) return false;
    const streak = combatCardStreak.card === card ? combatCardStreak.count : 0;
    const cost = getCombatCardCost(card, streak, weapon, distance);
    if (cost > stamina) return false;
    return true;
  });
}

export function getAvailableDistanceCards(playerState, distance) {
  const { weapon, stamina, distanceCardStreak } = playerState;
  const allCards = Object.values(DistanceCard);

  return allCards.filter(card => {
    if (card === DistanceCard.HOLD) return true;
    if (card === DistanceCard.ADVANCE && distance <= MIN_DISTANCE) return false;
    if (card === DistanceCard.RETREAT && distance >= MAX_DISTANCE) return false;
    const streak = distanceCardStreak.card === card ? distanceCardStreak.count : 0;
    const cost = getDistanceCardCost(card, streak, weapon, distance, WEAPON_ZONES);
    if (cost > stamina) return false;
    return true;
  });
}

export function getTotalCost(distCard, combatCard, playerState, distance) {
  const { weapon, distanceCardStreak, combatCardStreak } = playerState;
  const dStreak = distanceCardStreak.card === distCard ? distanceCardStreak.count : 0;
  const cStreak = combatCardStreak.card === combatCard ? combatCardStreak.count : 0;
  const dCost = getDistanceCardCost(distCard, dStreak, weapon, distance, WEAPON_ZONES);
  const cCost = getCombatCardCost(combatCard, cStreak, weapon, distance);
  return dCost + cCost;
}

export function validateAction(distCard, combatCard, playerState, distance) {
  const availDist = getAvailableDistanceCards(playerState, distance);
  if (!availDist.includes(distCard)) {
    return { valid: false, reason: '身法卡不可用' };
  }
  const availCombat = getAvailableCombatCards(playerState, distance);
  if (!availCombat.includes(combatCard)) {
    return { valid: false, reason: '攻防卡不可用' };
  }
  const total = getTotalCost(distCard, combatCard, playerState, distance);
  if (total > playerState.stamina) {
    return { valid: false, reason: '体力不足' };
  }
  return { valid: true };
}
