;(function(LBQ) {

const { CombatCard, DistanceCard, CardType } = LBQ;
const { COMBAT_CARD_BASE, CARD_TYPE_MAP, WEAPON_ZONES, MIN_DISTANCE, MAX_DISTANCE } = LBQ;
const { getDisabledCards, getCostModifier } = LBQ;
const { getDistanceCardCost } = LBQ;

/**
 * 获取攻防卡的实际消耗（含连续递增 + 兵器消耗减免）
 * @param {string} card - CombatCard
 * @param {number} streak - 当前连续使用次数（0 = 第一次）
 * @param {string} weapon
 * @param {number} distance
 * @returns {number}
 */
function getCombatCardCost(card, streak, weapon, distance) {
  const base = COMBAT_CARD_BASE[card].cost;
  // 双刺特殊：点刺连续递增不生效
  const effectiveStreak = (weapon === 'dual_stab' && card === CombatCard.THRUST) ? 0 : streak;
  let cost = base + effectiveStreak;

  // 兵器优势区消耗减免（统一使用 getCostModifier）
  cost += getCostModifier(weapon, distance, card);

  return Math.max(0, cost);
}

/**
 * 获取可用的攻防卡列表
 * @param {object} playerState - { weapon, stamina, staggered, combatCardStreak }
 * @param {number} distance
 * @returns {string[]} 可用的 CombatCard 列表
 */
function getAvailableCombatCards(playerState, distance) {
  const { weapon, stamina, staggered, combatCardStreak } = playerState;
  const disabled = getDisabledCards(weapon, distance);
  const allCards = Object.values(CombatCard);

  return allCards.filter(card => {
    // 被禁用的卡
    if (disabled.includes(card)) return false;

    // 僵直：禁止所有攻击卡
    if (staggered && CARD_TYPE_MAP[card] === CardType.ATTACK) return false;

    // 体力不足
    const streak = combatCardStreak.card === card ? combatCardStreak.count : 0;
    const cost = getCombatCardCost(card, streak, weapon, distance);
    if (cost > stamina) return false;

    return true;
  });
}

/**
 * 获取可用的距离卡列表
 * @param {object} playerState - { weapon, stamina, distanceCardStreak }
 * @param {number} distance - 当前距离
 * @returns {string[]} 可用的 DistanceCard 列表
 */
function getAvailableDistanceCards(playerState, distance) {
  const { weapon, stamina, distanceCardStreak } = playerState;
  const allCards = Object.values(DistanceCard);

  return allCards.filter(card => {
    // 站稳永远可用
    if (card === DistanceCard.HOLD) return true;

    // 边界检查：在最近距离不能再靠近，最远距离不能再远离
    if (card === DistanceCard.ADVANCE && distance <= MIN_DISTANCE) return false;
    if (card === DistanceCard.RETREAT && distance >= MAX_DISTANCE) return false;

    // 体力不足
    const streak = distanceCardStreak.card === card ? distanceCardStreak.count : 0;
    const cost = getDistanceCardCost(card, streak, weapon, distance, WEAPON_ZONES);
    if (cost > stamina) return false;

    return true;
  });
}

/**
 * 计算本回合总消耗（距离卡 + 攻防卡）
 * @param {string} distCard
 * @param {string} combatCard
 * @param {object} playerState
 * @param {number} distance
 * @returns {number}
 */
function getTotalCost(distCard, combatCard, playerState, distance) {
  const { weapon, distanceCardStreak, combatCardStreak } = playerState;
  const dStreak = distanceCardStreak.card === distCard ? distanceCardStreak.count : 0;
  const cStreak = combatCardStreak.card === combatCard ? combatCardStreak.count : 0;
  const dCost = getDistanceCardCost(distCard, dStreak, weapon, distance, WEAPON_ZONES);
  const cCost = getCombatCardCost(combatCard, cStreak, weapon, distance);
  return dCost + cCost;
}

/**
 * 验证出牌组合是否合法
 * @param {string} distCard
 * @param {string} combatCard
 * @param {object} playerState
 * @param {number} distance
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateAction(distCard, combatCard, playerState, distance) {
  const availDist = getAvailableDistanceCards(playerState, distance);
  if (!availDist.includes(distCard)) {
    return { valid: false, reason: '距离卡不可用' };
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

Object.assign(LBQ, { getCombatCardCost, getAvailableCombatCards, getAvailableDistanceCards, getTotalCost, validateAction });

})(window.LBQ);
