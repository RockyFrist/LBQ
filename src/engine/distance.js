import { DistanceCard } from '../types.js';
import { DISTANCE_CARD_BASE, MIN_DISTANCE, MAX_DISTANCE } from '../constants.js';

/**
 * 计算双方身法卡叠加后的新距离
 */
export function resolveDistance(currentDistance, playerCard, aiCard) {
  const playerDelta = DISTANCE_CARD_BASE[playerCard].delta;
  const aiDelta = DISTANCE_CARD_BASE[aiCard].delta;
  const raw = currentDistance + playerDelta + aiDelta;
  return Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, raw));
}

/**
 * 获取身法卡的实际消耗（含连续递增 + 兵器减免）
 */
export function getDistanceCardCost(card, streak, weapon, distance, weaponZones) {
  const base = DISTANCE_CARD_BASE[card].cost;
  if (base === 0) return 0; // 扎马永远0

  // 兵器优势区移动减免
  const zones = weaponZones[weapon];
  const inAdvantage = zones.advantage.includes(distance);

  if (inAdvantage) {
    if (weapon === 'short_blade' && card === DistanceCard.ADVANCE) return Math.max(0, Math.floor((base + streak) / 2));
    if ((weapon === 'spear' || weapon === 'staff' || weapon === 'great_blade') 
        && card === DistanceCard.RETREAT) return Math.max(0, Math.floor((base + streak) / 2));
  }

  if (weapon === 'short_blade' && !inAdvantage && card === DistanceCard.ADVANCE) {
    return Math.max(0, Math.floor((base + streak) / 2));
  }

  if (weapon === 'dual_stab' && card === DistanceCard.ADVANCE) {
    return Math.max(0, Math.floor((base + streak) / 2));
  }

  return base + streak;
}
