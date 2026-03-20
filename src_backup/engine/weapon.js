;(function(LBQ) {

const { WeaponType, CombatCard, DistanceCard } = LBQ;
const { WEAPON_ZONES, COMBAT_CARD_BASE, CARD_TYPE_MAP, CardType } = LBQ;

/**
 * 判断兵器在指定距离是否处于优势区间
 * @param {string} weapon
 * @param {number} distance
 * @returns {boolean}
 */
function isAdvantage(weapon, distance) {
  return WEAPON_ZONES[weapon].advantage.includes(distance);
}

/**
 * 判断兵器在指定距离是否处于劣势区间
 * @param {string} weapon
 * @param {number} distance
 * @returns {boolean}
 */
function isDisadvantage(weapon, distance) {
  return WEAPON_ZONES[weapon].disadvantage.includes(distance);
}

/**
 * 获取指定武器在指定距离下的被禁用卡牌列表
 * @param {string} weapon
 * @param {number} distance
 * @returns {string[]}
 */
function getDisabledCards(weapon, distance) {
  const disabled = [];
  
  switch (weapon) {
    case WeaponType.SHORT_BLADE:
      // 远距区(3): 劈砍禁用（中距区可用）
      if (distance >= 3) disabled.push(CombatCard.SLASH);
      break;

    case WeaponType.SPEAR:
      // 劣势区(0): 劈砍、卸力禁用
      if (distance === 0) {
        disabled.push(CombatCard.SLASH, CombatCard.DEFLECT);
      }
      break;

    case WeaponType.SWORD:
      // 距离0: 劈砍禁用
      if (distance === 0) disabled.push(CombatCard.SLASH);
      // 距离3: 点刺和劈砍禁用
      if (distance === 3) disabled.push(CombatCard.THRUST, CombatCard.SLASH);
      break;

    case WeaponType.STAFF:
      // 距离0: 劈砍禁用
      if (distance === 0) disabled.push(CombatCard.SLASH);
      break;

    case WeaponType.GREAT_BLADE:
      // 距离0: 劈砍、卸力禁用
      if (distance === 0) {
        disabled.push(CombatCard.SLASH, CombatCard.DEFLECT);
      }
      break;

    case WeaponType.DUAL_STAB:
      // 距离2-3: 劈砍、卸力禁用（极端近战兵器）
      if (distance >= 2) {
        disabled.push(CombatCard.SLASH, CombatCard.DEFLECT);
      }
      break;
  }

  return disabled;
}

/**
 * 获取兵器在指定距离下的伤害修正值
 * @param {string} weapon
 * @param {number} distance
 * @param {string} combatCard
 * @returns {number} 伤害加成/减成值
 */
function getDamageModifier(weapon, distance, combatCard) {
  const adv = isAdvantage(weapon, distance);
  const disadv = isDisadvantage(weapon, distance);

  switch (weapon) {
    case WeaponType.SHORT_BLADE:
      if (adv && combatCard === CombatCard.THRUST) return +1;
      if (adv && combatCard === CombatCard.SLASH) return +1;
      if (distance >= 3) return -1; // 仅远距区攻击-1
      break;

    case WeaponType.SPEAR:
      if (adv && combatCard === CombatCard.SLASH) return +2;
      if (disadv && combatCard === CombatCard.THRUST) return -1;
      break;

    case WeaponType.SWORD:
      if (disadv && distance === 0) return -1; // 贴身所有攻击 -1
      break;

    case WeaponType.STAFF:
      // 优势区内劈砍伤害 -1 (内置代价)
      if (adv && combatCard === CombatCard.SLASH) return -1;
      if (disadv) return -1; // 贴身所有攻击 -1
      break;

    case WeaponType.GREAT_BLADE:
      if (adv && combatCard === CombatCard.SLASH) return +3;
      if (disadv && combatCard === CombatCard.THRUST) return -1;
      break;

    case WeaponType.DUAL_STAB:
      if (adv && combatCard === CombatCard.THRUST) return +1;
      if (disadv) return -1;
      break;
  }

  return 0;
}

/**
 * 获取兵器在指定距离下的卡牌消耗修正
 * @param {string} weapon
 * @param {number} distance
 * @param {string} combatCard
 * @returns {number}
 */
function getCostModifier(weapon, distance, combatCard) {
  const adv = isAdvantage(weapon, distance);
  if (!adv) return 0;

  switch (weapon) {
    case WeaponType.SHORT_BLADE:
      if (combatCard === CombatCard.DODGE) return -1;
      if (combatCard === CombatCard.THRUST) return -1;
      break;
    case WeaponType.SPEAR:
      if (combatCard === CombatCard.BLOCK) return -1;
      break;
    case WeaponType.SWORD:
      if (combatCard === CombatCard.DEFLECT) return -1;
      if (combatCard === CombatCard.BLOCK) return -1;
      break;
    case WeaponType.STAFF:
      if (combatCard === CombatCard.BLOCK) return -1;
      break;
    case WeaponType.GREAT_BLADE:
      // 格挡额外减免劈砍伤害是在combat里处理，不是消耗减免
      break;
    case WeaponType.DUAL_STAB:
      if (combatCard === CombatCard.THRUST) return -1; // 点刺永远便宜
      if (combatCard === CombatCard.DODGE) return -1;
      break;
  }
  return 0;
}

/**
 * 获取格挡对劈砍的减免值
 * @param {string} weapon 格挡方的武器
 * @param {number} distance
 * @returns {number}
 */
function getBlockSlashReduction(weapon, distance) {
  // 大刀优势区格挡减免 2 而非 1
  if (weapon === WeaponType.GREAT_BLADE && isAdvantage(weapon, distance)) {
    return 2;
  }
  return 1; // 基础减免
}

/**
 * 检查是否有「点刺打断闪避」的特殊规则
 * @param {string} thrustWeapon - 点刺方的武器
 * @param {number} distance
 * @returns {boolean}
 */
function canThrustBreakDodge(thrustWeapon, distance) {
  return isAdvantage(thrustWeapon, distance);
}

/**
 * 检查卸力成功后是否造成僵直（剑的卸力不造成僵直）
 * @param {string} weapon
 * @returns {boolean}
 */
function deflectCausesStagger(weapon) {
  return weapon !== WeaponType.SWORD;
}

/**
 * 检查卸力成功后自身架势值变化（剑为 -2）
 * @param {string} weapon
 * @returns {number}
 */
function deflectSelfStanceChange(weapon) {
  if (weapon === WeaponType.SWORD) return -2;
  return 0;
}

/**
 * 获取虚晃的架势加成
 * @param {string} weapon
 * @param {number} distance
 * @returns {number} 总架势值 (基础2 + 可能的额外)
 */
function getFeintStanceValue(weapon, distance) {
  const base = 2;
  if (weapon === WeaponType.STAFF && isAdvantage(weapon, distance)) {
    return base + 1; // 棍优势区 +3
  }
  if (weapon === WeaponType.SHORT_BLADE && isAdvantage(weapon, distance)) {
    return base + 1; // 短刀优势区 +3
  }
  if (weapon === WeaponType.DUAL_STAB && isAdvantage(weapon, distance)) {
    return base + 1; // 双刺优势区 +3
  }
  return base;
}

/**
 * 检查是否有推距离效果
 * @param {string} weapon 攻击方武器
 * @param {number} distance
 * @param {string} combatCard
 * @param {string} opponentCard
 * @returns {number} 推距离数值 (0=不推)
 */
function getPushDistance(weapon, distance, combatCard, opponentCard) {
  // 大刀优势区劈砍命中推 +1
  if (weapon === WeaponType.GREAT_BLADE && isAdvantage(weapon, distance)
      && combatCard === CombatCard.SLASH) {
    return 1;
  }
  // 棍优势区虚晃命中格挡推 +1
  if (weapon === WeaponType.STAFF && isAdvantage(weapon, distance)
      && combatCard === CombatCard.FEINT && opponentCard === CombatCard.BLOCK) {
    return 1;
  }
  return 0;
}

Object.assign(LBQ, {
  isAdvantage, isDisadvantage, getDisabledCards, getDamageModifier,
  getCostModifier, getBlockSlashReduction, canThrustBreakDodge,
  deflectCausesStagger, deflectSelfStanceChange, getFeintStanceValue, getPushDistance
});

})(window.LBQ);
