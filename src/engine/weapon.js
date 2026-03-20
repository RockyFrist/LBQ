import { WeaponType, CombatCard } from '../types.js';
import { WEAPON_ZONES, COMBAT_CARD_BASE } from '../constants.js';

export function isAdvantage(weapon, distance) {
  return WEAPON_ZONES[weapon].advantage.includes(distance);
}

export function isDisadvantage(weapon, distance) {
  return WEAPON_ZONES[weapon].disadvantage.includes(distance);
}

export function getDisabledCards(weapon, distance) {
  const disabled = [];
  
  switch (weapon) {
    case WeaponType.SHORT_BLADE:
      if (distance >= 3) disabled.push(CombatCard.SLASH);
      break;
    case WeaponType.SPEAR:
      if (distance === 0) {
        disabled.push(CombatCard.SLASH, CombatCard.DEFLECT);
      }
      break;
    case WeaponType.SWORD:
      if (distance === 0) disabled.push(CombatCard.SLASH);
      if (distance === 3) disabled.push(CombatCard.THRUST, CombatCard.SLASH);
      break;
    case WeaponType.STAFF:
      if (distance === 0) disabled.push(CombatCard.SLASH);
      break;
    case WeaponType.GREAT_BLADE:
      if (distance === 0) {
        disabled.push(CombatCard.SLASH, CombatCard.DEFLECT);
      }
      break;
    case WeaponType.DUAL_STAB:
      if (distance >= 2) {
        disabled.push(CombatCard.SLASH, CombatCard.DEFLECT);
      }
      break;
  }

  return disabled;
}

export function getDamageModifier(weapon, distance, combatCard) {
  const adv = isAdvantage(weapon, distance);
  const disadv = isDisadvantage(weapon, distance);

  switch (weapon) {
    case WeaponType.SHORT_BLADE:
      if (adv && combatCard === CombatCard.THRUST) return +1;
      if (adv && combatCard === CombatCard.SLASH) return +1;
      if (distance >= 3) return -1;
      break;
    case WeaponType.SPEAR:
      if (adv && combatCard === CombatCard.SLASH) return +2;
      if (disadv && combatCard === CombatCard.THRUST) return -1;
      break;
    case WeaponType.SWORD:
      if (disadv && distance === 0) return -1;
      break;
    case WeaponType.STAFF:
      if (adv && combatCard === CombatCard.SLASH) return -1;
      if (disadv) return -1;
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

export function getCostModifier(weapon, distance, combatCard) {
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
      break;
    case WeaponType.DUAL_STAB:
      if (combatCard === CombatCard.THRUST) return -1;
      if (combatCard === CombatCard.DODGE) return -1;
      break;
  }
  return 0;
}

export function getBlockSlashReduction(weapon, distance) {
  if (weapon === WeaponType.GREAT_BLADE && isAdvantage(weapon, distance)) {
    return 2;
  }
  return 1;
}

export function canThrustBreakDodge(thrustWeapon, distance) {
  return isAdvantage(thrustWeapon, distance);
}

export function deflectCausesStagger(weapon) {
  return weapon !== WeaponType.SWORD;
}

export function deflectSelfStanceChange(weapon) {
  if (weapon === WeaponType.SWORD) return -2;
  return 0;
}

export function getFeintStanceValue(weapon, distance) {
  const base = 2;
  if (weapon === WeaponType.STAFF && isAdvantage(weapon, distance)) {
    return base + 1;
  }
  if (weapon === WeaponType.SHORT_BLADE && isAdvantage(weapon, distance)) {
    return base + 1;
  }
  if (weapon === WeaponType.DUAL_STAB && isAdvantage(weapon, distance)) {
    return base + 1;
  }
  return base;
}

export function getPushDistance(weapon, distance, combatCard, opponentCard) {
  if (weapon === WeaponType.GREAT_BLADE && isAdvantage(weapon, distance)
      && combatCard === CombatCard.SLASH) {
    return 1;
  }
  if (weapon === WeaponType.STAFF && isAdvantage(weapon, distance)
      && combatCard === CombatCard.FEINT && opponentCard === CombatCard.BLOCK) {
    return 1;
  }
  return 0;
}
