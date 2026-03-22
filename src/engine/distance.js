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
