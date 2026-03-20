;(function(LBQ) {

const { DistanceCard } = LBQ;
const { DISTANCE_CARD_BASE, MIN_DISTANCE, MAX_DISTANCE } = LBQ;

/**
 * 计算双方距离卡叠加后的新距离
 * @param {number} currentDistance
 * @param {string} playerCard - DistanceCard
 * @param {string} aiCard - DistanceCard
 * @returns {number}
 */
function resolveDistance(currentDistance, playerCard, aiCard) {
  const playerDelta = DISTANCE_CARD_BASE[playerCard].delta;
  const aiDelta = DISTANCE_CARD_BASE[aiCard].delta;
  const raw = currentDistance + playerDelta + aiDelta;
  return Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, raw));
}

/**
 * 获取距离卡的实际消耗（含连续递增 + 兵器减免）
 * @param {string} card - DistanceCard
 * @param {number} streak - 当前连续使用次数（0 表示第一次）
 * @param {string} weapon - WeaponType
 * @param {number} distance - 当前距离（用于判兵器优势区免费移动）
 * @param {import('../constants.js').WEAPON_ZONES} zones
 * @returns {number}
 */
function getDistanceCardCost(card, streak, weapon, distance, weaponZones) {
  const base = DISTANCE_CARD_BASE[card].cost;
  if (base === 0) return 0; // 站稳永远0

  // 兵器优势区移动减免
  const zones = weaponZones[weapon];
  const inAdvantage = zones.advantage.includes(distance);

  if (inAdvantage) {
    // 短刀优势区靠近减免
    if (weapon === 'short_blade' && card === DistanceCard.ADVANCE) return Math.max(0, Math.floor((base + streak) / 2));
    // 长枪/棍/大刀优势区远离减免
    if ((weapon === 'spear' || weapon === 'staff' || weapon === 'great_blade') 
        && card === DistanceCard.RETREAT) return Math.max(0, Math.floor((base + streak) / 2));
  }

  // 短刀非优势区时靠近也有减免（快速接近能力）
  if (weapon === 'short_blade' && !inAdvantage && card === DistanceCard.ADVANCE) {
    return Math.max(0, Math.floor((base + streak) / 2));
  }

  // 双刺靠近永远减半（极端接近能力）
  if (weapon === 'dual_stab' && card === DistanceCard.ADVANCE) {
    return Math.max(0, Math.floor((base + streak) / 2));
  }

  return base + streak;
}

Object.assign(LBQ, { resolveDistance, getDistanceCardCost });

})(window.LBQ);
