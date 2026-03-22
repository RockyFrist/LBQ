import { CombatCard, DistanceCard, CardType } from '../types.js';
import { COMBAT_CARD_BASE, CARD_TYPE_MAP, WEAPON_ZONES, MIN_DISTANCE, MAX_DISTANCE, gameConfig, DISTANCE_CARD_BASE } from '../constants.js';

export function getAvailableCombatCards(playerState, distance, reservedStamina = 0) {
  const { weapon, staggered, stamina } = playerState;
  const allCards = Object.values(CombatCard);

  return allCards.filter(card => {
    if (staggered && CARD_TYPE_MAP[card] === CardType.ATTACK) return false;
    return true;
  });
}

export function getAvailableDistanceCards(playerState, distance) {
  const { stamina } = playerState;
  const allCards = Object.values(DistanceCard);

  return allCards.filter(card => {
    if (card === DistanceCard.HOLD) return true;
    if (card === DistanceCard.ADVANCE && distance <= MIN_DISTANCE) return false;
    if (card === DistanceCard.RETREAT && distance >= MAX_DISTANCE) return false;
    // 体力不足无法使用冲步/撤步
    const cost = DISTANCE_CARD_BASE[card]?.cost ?? 0;
    if (stamina < cost) return false;
    return true;
  });
}

export function validateAction(distCard, combatCard, playerState, distance) {
  const availDist = getAvailableDistanceCards(playerState, distance);
  if (!availDist.includes(distCard)) {
    return { valid: false, reason: '身法卡不可用' };
  }
  // 计算身法卡已预留的体力，传入攻防卡可用性检查
  const distCost = DISTANCE_CARD_BASE[distCard]?.cost ?? 0;
  const availCombat = getAvailableCombatCards(playerState, distance, distCost);
  if (!availCombat.includes(combatCard)) {
    return { valid: false, reason: '攻防卡不可用（体力不足）' };
  }
  return { valid: true };
}
