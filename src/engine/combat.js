import { CombatCard } from '../types.js';
import { COMBAT_CARD_BASE, MAX_DISTANCE, MIN_DISTANCE } from '../constants.js';
import { getDamageModifier, isAdvantage,
  deflectCausesStagger, getFeintStanceValue,
  getPushDistance, getBlockSlashReduction,
  isBlockPerfect, blockBonusStance,
  slashBonusStance, blockPushDistance, calcAttackStance } from './weapon.js';

function emptyEffects() {
  return {
    player: { hpChange: 0, stanceChange: 0, staggered: false },
    ai:     { hpChange: 0, stanceChange: 0, staggered: false },
    distancePush: 0,
    log: [],
  };
}

function calcDamage(combatCard, attackerWeapon, distance) {
  const base = COMBAT_CARD_BASE[combatCard].damage;
  const mod = getDamageModifier(attackerWeapon, distance, combatCard);
  return Math.max(0, base + mod);
}

export function resolveCombat(state, pCard, aCard) {
  const fx = emptyEffects();
  const dist = state.distance;
  const pW = state.player.weapon;
  const aW = state.ai.weapon;

  if (pCard === aCard) {
    return resolveMirror(fx, pCard, pW, aW, dist);
  }

  resolvePair(fx, pCard, aCard, pW, aW, dist);
  return fx;
}

function resolveMirror(fx, card, pW, aW, dist) {
  switch (card) {
    case CombatCard.BLOCK:
      fx.log.push('双方空过');
      break;

    case CombatCard.DEFLECT:
      fx.player.stanceChange += 2;
      fx.ai.stanceChange += 2;
      fx.log.push('卸力对碰，双方各+2架势');
      break;

    case CombatCard.SLASH: {
      const pDmg = calcDamage(CombatCard.SLASH, pW, dist);
      const aDmg = calcDamage(CombatCard.SLASH, aW, dist);
      fx.player.hpChange -= aDmg;
      fx.ai.hpChange -= pDmg;
      // 劣势区攻击架势减半
      fx.player.stanceChange += calcAttackStance(1, aW, dist);
      fx.ai.stanceChange += calcAttackStance(1, pW, dist);
      // 棍优势区劈砍额外+2架势
      const pSlashBonus = slashBonusStance(pW, dist);
      const aSlashBonus = slashBonusStance(aW, dist);
      if (pSlashBonus > 0) fx.ai.stanceChange += pSlashBonus;
      if (aSlashBonus > 0) fx.player.stanceChange += aSlashBonus;
      if (pW === 'spear' && isAdvantage(pW, dist)) fx.ai.stanceChange += 1;
      if (aW === 'spear' && isAdvantage(aW, dist)) fx.player.stanceChange += 1;
      const pPush = getPushDistance(pW, dist, CombatCard.SLASH, CombatCard.SLASH);
      const aPush = getPushDistance(aW, dist, CombatCard.SLASH, CombatCard.SLASH);
      fx.distancePush += pPush + aPush;
      fx.log.push(`互砍：玩家受${aDmg}伤，AI受${pDmg}伤`);
      break;
    }

    case CombatCard.THRUST: {
      const pDmg = calcDamage(CombatCard.THRUST, pW, dist);
      const aDmg = calcDamage(CombatCard.THRUST, aW, dist);
      fx.player.hpChange -= aDmg;
      fx.ai.hpChange -= pDmg;
      fx.player.stanceChange += calcAttackStance(1, aW, dist);
      fx.ai.stanceChange += calcAttackStance(1, pW, dist);
      fx.log.push(`互刺：玩家受${aDmg}伤，AI受${pDmg}伤`);
      break;
    }

    case CombatCard.FEINT:
      fx.log.push('双方虚晃，空过');
      break;
  }
  return fx;
}

function resolvePair(fx, pCard, aCard, pW, aW, dist) {
  // ━━━ 卸力 vs X ━━━
  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.SLASH) {
    applyDeflectSuccess(fx, 'player', 'ai', pW);
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.SLASH) {
    applyDeflectSuccess(fx, 'ai', 'player', aW);
    return;
  }

  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.THRUST) {
    const dmg = calcDamage(CombatCard.THRUST, aW, dist);
    fx.player.hpChange -= dmg;
    fx.player.stanceChange += calcAttackStance(1, aW, dist);
    fx.log.push(`玩家卸力失败遇点刺：受${dmg}伤+${calcAttackStance(1, aW, dist)}架势`);
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.THRUST) {
    const dmg = calcDamage(CombatCard.THRUST, pW, dist);
    fx.ai.hpChange -= dmg;
    fx.ai.stanceChange += calcAttackStance(1, pW, dist);
    fx.log.push(`AI卸力失败遇点刺：受${dmg}伤+${calcAttackStance(1, pW, dist)}架势`);
    return;
  }

  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.FEINT) {
    const st = calcAttackStance(2, aW, dist);
    fx.player.stanceChange += st;
    fx.log.push(`玩家卸力被虚晃骗：+${st}架势`);
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.FEINT) {
    const st = calcAttackStance(2, pW, dist);
    fx.ai.stanceChange += st;
    fx.log.push(`AI卸力被虚晃骗：+${st}架势`);
    return;
  }

  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.BLOCK) {
    fx.player.stanceChange += 1;
    fx.log.push('玩家卸力失败(遇格挡)：+1架势');
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.BLOCK) {
    fx.ai.stanceChange += 1;
    fx.log.push('AI卸力失败(遇格挡)：+1架势');
    return;
  }

  // ━━━ 劈砍 vs 点刺 ━━━
  if (pCard === CombatCard.SLASH && aCard === CombatCard.THRUST) {
    applySlashHit(fx, 'player', 'ai', pW, aW, dist, CombatCard.THRUST);
    return;
  }
  if (aCard === CombatCard.SLASH && pCard === CombatCard.THRUST) {
    applySlashHit(fx, 'ai', 'player', aW, pW, dist, CombatCard.THRUST);
    return;
  }

  // ━━━ 劈砍 vs 格挡 ━━━
  if (pCard === CombatCard.SLASH && aCard === CombatCard.BLOCK) {
    const dmg = calcDamage(CombatCard.SLASH, pW, dist);
    const reduction = getBlockSlashReduction(aW, dist);
    // 剑优势区完美格挡：劈砍完全免伤
    const finalDmg = isBlockPerfect(aW, dist) ? 0 : Math.max(0, dmg - reduction);
    fx.ai.hpChange -= finalDmg;
    fx.ai.stanceChange += calcAttackStance(1, pW, dist);
    // 棍优势区格挡震退：攻击方+1架势
    const bStance = blockBonusStance(aW, dist);
    if (bStance > 0) fx.player.stanceChange += bStance;
    if (pW === 'spear' && isAdvantage(pW, dist)) fx.ai.stanceChange += 1;
    // 棍劈砍优势区额外架势
    const sBonus = slashBonusStance(pW, dist);
    if (sBonus > 0) fx.ai.stanceChange += sBonus;
    const push = getPushDistance(pW, dist, CombatCard.SLASH, CombatCard.BLOCK);
    // 长枪优势区格挡弹枪：推开对手
    const bPush = blockPushDistance(aW, dist);
    fx.distancePush += push + bPush;
    if (isBlockPerfect(aW, dist)) {
      fx.log.push(`玩家劈砍被完美格挡(剑)：AI完全免伤`);
    } else {
      fx.log.push(`玩家劈砍破格挡：AI受${finalDmg}伤(减免${reduction})+架势`);
    }
    return;
  }
  if (aCard === CombatCard.SLASH && pCard === CombatCard.BLOCK) {
    const dmg = calcDamage(CombatCard.SLASH, aW, dist);
    const reduction = getBlockSlashReduction(pW, dist);
    const finalDmg = isBlockPerfect(pW, dist) ? 0 : Math.max(0, dmg - reduction);
    fx.player.hpChange -= finalDmg;
    fx.player.stanceChange += calcAttackStance(1, aW, dist);
    const bStance = blockBonusStance(pW, dist);
    if (bStance > 0) fx.ai.stanceChange += bStance;
    if (aW === 'spear' && isAdvantage(aW, dist)) fx.player.stanceChange += 1;
    const sBonus = slashBonusStance(aW, dist);
    if (sBonus > 0) fx.player.stanceChange += sBonus;
    const push = getPushDistance(aW, dist, CombatCard.SLASH, CombatCard.BLOCK);
    const bPush = blockPushDistance(pW, dist);
    fx.distancePush += push + bPush;
    if (isBlockPerfect(pW, dist)) {
      fx.log.push(`AI劈砍被完美格挡(剑)：玩家完全免伤`);
    } else {
      fx.log.push(`AI劈砍破格挡：玩家受${finalDmg}伤(减免${reduction})+架势`);
    }
    return;
  }

  // ━━━ 劈砍 vs 虚晃 ━━━
  if (pCard === CombatCard.SLASH && aCard === CombatCard.FEINT) {
    applySlashHit(fx, 'player', 'ai', pW, aW, dist, CombatCard.FEINT);
    return;
  }
  if (aCard === CombatCard.SLASH && pCard === CombatCard.FEINT) {
    applySlashHit(fx, 'ai', 'player', aW, pW, dist, CombatCard.FEINT);
    return;
  }

  // ━━━ 点刺 vs 格挡 ━━━
  if (pCard === CombatCard.THRUST && aCard === CombatCard.BLOCK) {
    const bStance = blockBonusStance(aW, dist);
    if (bStance > 0) fx.player.stanceChange += bStance;
    const bPush = blockPushDistance(aW, dist);
    if (bPush > 0) fx.distancePush += bPush;
    fx.log.push(`玩家点刺被格挡完全抵消${bStance > 0 ? '，棍震退+1架势' : ''}${bPush > 0 ? '，被弹枪推开' : ''}`);
    return;
  }
  if (aCard === CombatCard.THRUST && pCard === CombatCard.BLOCK) {
    const bStance = blockBonusStance(pW, dist);
    if (bStance > 0) fx.ai.stanceChange += bStance;
    const bPush = blockPushDistance(pW, dist);
    if (bPush > 0) fx.distancePush += bPush;
    fx.log.push(`AI点刺被格挡完全抵消${bStance > 0 ? '，棍震退+1架势' : ''}${bPush > 0 ? '，被弹枪推开' : ''}`);
    return;
  }

  // ━━━ 点刺 vs 虚晃 ━━━
  if (pCard === CombatCard.THRUST && aCard === CombatCard.FEINT) {
    const dmg = calcDamage(CombatCard.THRUST, pW, dist);
    fx.ai.hpChange -= dmg;
    fx.ai.stanceChange += calcAttackStance(1, pW, dist);
    fx.log.push(`玩家点刺命中：AI受${dmg}伤+${calcAttackStance(1, pW, dist)}架势`);
    return;
  }
  if (aCard === CombatCard.THRUST && pCard === CombatCard.FEINT) {
    const dmg = calcDamage(CombatCard.THRUST, aW, dist);
    fx.player.hpChange -= dmg;
    fx.player.stanceChange += calcAttackStance(1, aW, dist);
    fx.log.push(`AI点刺命中：玩家受${dmg}伤+${calcAttackStance(1, aW, dist)}架势`);
    return;
  }

  // ━━━ 格挡 vs 虚晃 ━━━
  if (pCard === CombatCard.BLOCK && aCard === CombatCard.FEINT) {
    const stVal = getFeintStanceValue(aW, dist);
    const st = calcAttackStance(stVal, aW, dist);
    fx.player.stanceChange += st;
    const push = getPushDistance(aW, dist, CombatCard.FEINT, CombatCard.BLOCK);
    fx.distancePush += push;
    fx.log.push(`AI虚晃命中格挡：玩家+${st}架势${push ? '，距离+' + push : ''}`);
    return;
  }
  if (aCard === CombatCard.BLOCK && pCard === CombatCard.FEINT) {
    const stVal = getFeintStanceValue(pW, dist);
    const st = calcAttackStance(stVal, pW, dist);
    fx.ai.stanceChange += st;
    const push = getPushDistance(pW, dist, CombatCard.FEINT, CombatCard.BLOCK);
    fx.distancePush += push;
    fx.log.push(`玩家虚晃命中格挡：AI+${st}架势${push ? '，距离+' + push : ''}`);
    return;
  }

  fx.log.push('双方空过');
}

function applyDeflectSuccess(fx, deflector, attacker, deflectorWeapon) {
  const dmg = COMBAT_CARD_BASE[CombatCard.DEFLECT].damage;
  fx[attacker].hpChange -= dmg;
  fx[attacker].stanceChange += 2;
  const lbl = deflector === 'player' ? '玩家' : 'AI';

  if (deflectCausesStagger(deflectorWeapon)) {
    fx[attacker].staggered = true;
    fx.log.push(`${lbl}卸力反制成功：对手受${dmg}伤+2架势+僵直`);
  } else {
    fx[deflector].stanceChange -= 2;
    fx.log.push(`${lbl}(剑)卸力反制成功：对手受${dmg}伤+2架势，自身-2架势`);
  }
}

function applySlashHit(fx, slasher, victim, slasherWeapon, victimWeapon, dist, victimCard) {
  const dmg = calcDamage(CombatCard.SLASH, slasherWeapon, dist);
  fx[victim].hpChange -= dmg;
  fx[victim].stanceChange += calcAttackStance(1, slasherWeapon, dist);
  
  // 棍优势区劈砍额外+2架势(弱伤高控)
  const sBonus = slashBonusStance(slasherWeapon, dist);
  if (sBonus > 0) fx[victim].stanceChange += sBonus;

  if (slasherWeapon === 'spear' && isAdvantage(slasherWeapon, dist)) {
    fx[victim].stanceChange += 1;
  }

  const push = getPushDistance(slasherWeapon, dist, CombatCard.SLASH, victimCard);
  fx.distancePush += push;

fx.log.push(`${slasher === 'player' ? '玩家' : 'AI'}劈砍命中：对手受${dmg}伤+架势${push ? '，距离+' + push : ''}`);
}

/**
 * 单方面结算：一方的攻防卡被闪避机制取消后，另一方卡牌单独生效
 * @param {object} state - 当前游戏状态（含 distance, player, ai）
 * @param {string} activeSide - 'player' 或 'ai'（有效卡的一方）
 * @param {string} card - 有效的攻防卡
 */
export function resolveOneSided(state, activeSide, card) {
  const fx = emptyEffects();
  const dist = state.distance;
  const weapon = state[activeSide].weapon;
  const victim = activeSide === 'player' ? 'ai' : 'player';
  const lbl = activeSide === 'player' ? '玩家' : 'AI';

  switch (card) {
    case CombatCard.SLASH: {
      const dmg = calcDamage(CombatCard.SLASH, weapon, dist);
      fx[victim].hpChange -= dmg;
      fx[victim].stanceChange += calcAttackStance(1, weapon, dist);
      const sBonus = slashBonusStance(weapon, dist);
      if (sBonus > 0) fx[victim].stanceChange += sBonus;
      if (weapon === 'spear' && isAdvantage(weapon, dist)) fx[victim].stanceChange += 1;
      const push = getPushDistance(weapon, dist, CombatCard.SLASH, null);
      fx.distancePush += push;
      fx.log.push(`${lbl}劈砍命中(对手闪避失败)：对手受${dmg}伤+架势`);
      break;
    }
    case CombatCard.THRUST: {
      const dmg = calcDamage(CombatCard.THRUST, weapon, dist);
      fx[victim].hpChange -= dmg;
      fx[victim].stanceChange += calcAttackStance(1, weapon, dist);
      fx.log.push(`${lbl}点刺命中(对手闪避失败)：对手受${dmg}伤`);
      break;
    }
    case CombatCard.FEINT: {
      const stVal = getFeintStanceValue(weapon, dist);
      const st = calcAttackStance(stVal, weapon, dist);
      fx[victim].stanceChange += st;
      fx.log.push(`${lbl}虚晃命中(对手闪避失败)：对手+${st}架势`);
      break;
    }
    // 防守卡单独生效 = 无事发生
    case CombatCard.DEFLECT:
    case CombatCard.BLOCK:
      fx.log.push(`${lbl}防守落空(无攻击可防)`);
      break;
  }
  return fx;
}
