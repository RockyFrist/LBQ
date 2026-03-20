/**
 * combat.js — 6×6 攻防交互矩阵结算
 * 
 * resolveCombat(state, playerCard, aiCard) → effects
 * effects = { player: {...}, ai: {...}, distancePush, log[] }
 */
;(function(LBQ) {

const { CombatCard } = LBQ;
const { COMBAT_CARD_BASE, MAX_DISTANCE, MIN_DISTANCE } = LBQ;
const { getDamageModifier, isAdvantage, canThrustBreakDodge,
  deflectCausesStagger, getFeintStanceValue,
  getPushDistance, getBlockSlashReduction } = LBQ;

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

/**
 * 结算攻防交互（主入口）
 */
function resolveCombat(state, pCard, aCard) {
  const fx = emptyEffects();
  const dist = state.distance;
  const pW = state.player.weapon;
  const aW = state.ai.weapon;

  // 同卡对碰
  if (pCard === aCard) {
    return resolveMirror(fx, pCard, pW, aW, dist);
  }

  // 非对称对决：用 (攻击方, 防守方) 的方式，按优先级高的先结算
  // 优先级: DODGE(1) > DEFLECT(2) > SLASH(3) > THRUST(4) > BLOCK(5) > FEINT(6)
  resolvePair(fx, pCard, aCard, pW, aW, dist);

  return fx;
}

/**
 * 同卡对碰处理
 */
function resolveMirror(fx, card, pW, aW, dist) {
  switch (card) {
    case CombatCard.DODGE:
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
      fx.player.stanceChange += 1;
      fx.ai.stanceChange += 1;
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
      fx.player.stanceChange += 1;
      fx.ai.stanceChange += 1;
      fx.log.push(`互刺：玩家受${aDmg}伤，AI受${pDmg}伤`);
      break;
    }

    case CombatCard.FEINT:
      fx.log.push('双方虚晃，空过');
      break;
  }
  return fx;
}

/**
 * 非对称对决：处理所有 30 种非同卡组合
 * pCard=玩家出牌, aCard=AI出牌
 * pW=玩家武器, aW=AI武器
 */
function resolvePair(fx, pCard, aCard, pW, aW, dist) {

  // ━━━ 闪避 vs 攻击 ━━━
  if (pCard === CombatCard.DODGE && aCard === CombatCard.SLASH) {
    // 玩家闪避AI劈砍
    fx.ai.stanceChange += 1;
    if (pW === 'dual_stab') { fx.ai.stanceChange += 1; fx.log.push('玩家(双刺)闪避了AI的劈砍，AI+2架势'); }
    else fx.log.push('玩家闪避了AI的劈砍，AI+1架势');
    return;
  }
  if (aCard === CombatCard.DODGE && pCard === CombatCard.SLASH) {
    fx.player.stanceChange += 1;
    if (aW === 'dual_stab') { fx.player.stanceChange += 1; fx.log.push('AI(双刺)闪避了玩家的劈砍，玩家+2架势'); }
    else fx.log.push('AI闪避了玩家的劈砍，玩家+1架势');
    return;
  }

  if (pCard === CombatCard.DODGE && aCard === CombatCard.THRUST) {
    // 特殊：AI点刺在优势区可破闪避
    if (canThrustBreakDodge(aW, dist)) {
      const dmg = calcDamage(CombatCard.THRUST, aW, dist);
      fx.player.hpChange -= dmg;
      fx.player.stanceChange += 1;
      fx.log.push(`AI点刺打断闪避(优势区)：玩家受${dmg}伤+1架势`);
    } else {
      fx.ai.stanceChange += 1;
      if (pW === 'dual_stab') { fx.ai.stanceChange += 1; fx.log.push('玩家(双刺)闪避了AI的点刺，AI+2架势'); }
      else fx.log.push('玩家闪避了AI的点刺，AI+1架势');
    }
    return;
  }
  if (aCard === CombatCard.DODGE && pCard === CombatCard.THRUST) {
    if (canThrustBreakDodge(pW, dist)) {
      const dmg = calcDamage(CombatCard.THRUST, pW, dist);
      fx.ai.hpChange -= dmg;
      fx.ai.stanceChange += 1;
      fx.log.push(`玩家点刺打断闪避(优势区)：AI受${dmg}伤+1架势`);
    } else {
      fx.player.stanceChange += 1;
      if (aW === 'dual_stab') { fx.player.stanceChange += 1; fx.log.push('AI(双刺)闪避了玩家的点刺，玩家+2架势'); }
      else fx.log.push('AI闪避了玩家的点刺，玩家+1架势');
    }
    return;
  }

  // 闪避 vs 防守/虚晃 → 空过
  if (pCard === CombatCard.DODGE && (aCard === CombatCard.DEFLECT || aCard === CombatCard.BLOCK || aCard === CombatCard.FEINT)) {
    fx.log.push('双方空过');
    return;
  }
  if (aCard === CombatCard.DODGE && (pCard === CombatCard.DEFLECT || pCard === CombatCard.BLOCK || pCard === CombatCard.FEINT)) {
    fx.log.push('双方空过');
    return;
  }

  // ━━━ 卸力 vs X ━━━
  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.SLASH) {
    // 玩家卸力反制AI劈砍
    applyDeflectSuccess(fx, 'player', 'ai', pW);
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.SLASH) {
    applyDeflectSuccess(fx, 'ai', 'player', aW);
    return;
  }

  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.THRUST) {
    // 卸力失败遇点刺：吃伤害，自身+1架势
    const dmg = calcDamage(CombatCard.THRUST, aW, dist);
    fx.player.hpChange -= dmg;
    fx.player.stanceChange += 1;
    fx.log.push(`玩家卸力失败遇点刺：受${dmg}伤+1架势`);
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.THRUST) {
    const dmg = calcDamage(CombatCard.THRUST, pW, dist);
    fx.ai.hpChange -= dmg;
    fx.ai.stanceChange += 1;
    fx.log.push(`AI卸力失败遇点刺：受${dmg}伤+1架势`);
    return;
  }

  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.FEINT) {
    // 被虚晃骗：+2架势
    fx.player.stanceChange += 2;
    fx.log.push('玩家卸力被虚晃骗：+2架势');
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.FEINT) {
    fx.ai.stanceChange += 2;
    fx.log.push('AI卸力被虚晃骗：+2架势');
    return;
  }

  if (pCard === CombatCard.DEFLECT && aCard === CombatCard.BLOCK) {
    // 卸力遇格挡：轻惩罚+1
    fx.player.stanceChange += 1;
    fx.log.push('玩家卸力失败(遇格挡)：+1架势');
    return;
  }
  if (aCard === CombatCard.DEFLECT && pCard === CombatCard.BLOCK) {
    fx.ai.stanceChange += 1;
    fx.log.push('AI卸力失败(遇格挡)：+1架势');
    return;
  }

  // ━━━ 劈砍 vs 点刺 ━━━ (已排除vs闪避、卸力)
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
    const finalDmg = Math.max(0, dmg - reduction);
    fx.ai.hpChange -= finalDmg;
    fx.ai.stanceChange += 1;
    if (pW === 'spear' && isAdvantage(pW, dist)) fx.ai.stanceChange += 1;
    const push = getPushDistance(pW, dist, CombatCard.SLASH, CombatCard.BLOCK);
    fx.distancePush += push;
    fx.log.push(`玩家劈砍破格挡：AI受${finalDmg}伤(减免${reduction})+架势`);
    return;
  }
  if (aCard === CombatCard.SLASH && pCard === CombatCard.BLOCK) {
    const dmg = calcDamage(CombatCard.SLASH, aW, dist);
    const reduction = getBlockSlashReduction(pW, dist);
    const finalDmg = Math.max(0, dmg - reduction);
    fx.player.hpChange -= finalDmg;
    fx.player.stanceChange += 1;
    if (aW === 'spear' && isAdvantage(aW, dist)) fx.player.stanceChange += 1;
    const push = getPushDistance(aW, dist, CombatCard.SLASH, CombatCard.BLOCK);
    fx.distancePush += push;
    fx.log.push(`AI劈砍破格挡：玩家受${finalDmg}伤(减免${reduction})+架势`);
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
    fx.log.push('玩家点刺被格挡完全抵消');
    return;
  }
  if (aCard === CombatCard.THRUST && pCard === CombatCard.BLOCK) {
    fx.log.push('AI点刺被格挡完全抵消');
    return;
  }

  // ━━━ 点刺 vs 虚晃 ━━━
  if (pCard === CombatCard.THRUST && aCard === CombatCard.FEINT) {
    const dmg = calcDamage(CombatCard.THRUST, pW, dist);
    fx.ai.hpChange -= dmg;
    fx.ai.stanceChange += 1;
    fx.log.push(`玩家点刺命中：AI受${dmg}伤+1架势`);
    return;
  }
  if (aCard === CombatCard.THRUST && pCard === CombatCard.FEINT) {
    const dmg = calcDamage(CombatCard.THRUST, aW, dist);
    fx.player.hpChange -= dmg;
    fx.player.stanceChange += 1;
    fx.log.push(`AI点刺命中：玩家受${dmg}伤+1架势`);
    return;
  }

  // ━━━ 格挡 vs 虚晃 ━━━
  if (pCard === CombatCard.BLOCK && aCard === CombatCard.FEINT) {
    const stVal = getFeintStanceValue(aW, dist);
    fx.player.stanceChange += stVal;
    const push = getPushDistance(aW, dist, CombatCard.FEINT, CombatCard.BLOCK);
    fx.distancePush += push;
    fx.log.push(`AI虚晃命中格挡：玩家+${stVal}架势${push ? '，距离+' + push : ''}`);
    return;
  }
  if (aCard === CombatCard.BLOCK && pCard === CombatCard.FEINT) {
    const stVal = getFeintStanceValue(pW, dist);
    fx.ai.stanceChange += stVal;
    const push = getPushDistance(pW, dist, CombatCard.FEINT, CombatCard.BLOCK);
    fx.distancePush += push;
    fx.log.push(`玩家虚晃命中格挡：AI+${stVal}架势${push ? '，距离+' + push : ''}`);
    return;
  }

  // ━━━ 格挡 vs 格挡 已在 mirror, 其他防守对碰 ━━━
  // 格挡vs卸力 → 已在上面卸力vs格挡处理
  // 虚晃vs卸力 → 已在上面卸力vs虚晃处理

  // 兜底
  fx.log.push('双方空过');
}

/**
 * 卸力成功效果
 */
function applyDeflectSuccess(fx, deflector, attacker, deflectorWeapon) {
  const dmg = COMBAT_CARD_BASE[CombatCard.DEFLECT].damage; // 2
  fx[attacker].hpChange -= dmg;
  fx[attacker].stanceChange += 2;
  const lbl = deflector === 'player' ? '玩家' : 'AI';

  if (deflectCausesStagger(deflectorWeapon)) {
    fx[attacker].staggered = true;
    fx.log.push(`${lbl}卸力反制成功：对手受${dmg}伤+2架势+僵直`);
  } else {
    // 剑：不造成僵直，自身-2架势
    fx[deflector].stanceChange -= 2;
    fx.log.push(`${lbl}(剑)卸力反制成功：对手受${dmg}伤+2架势，自身-2架势`);
  }
}

/**
 * 劈砍命中效果（用于 vs 点刺、虚晃等低优先级卡）
 */
function applySlashHit(fx, slasher, victim, slasherWeapon, victimWeapon, dist, victimCard) {
  const dmg = calcDamage(CombatCard.SLASH, slasherWeapon, dist);
  fx[victim].hpChange -= dmg;
  fx[victim].stanceChange += 1;
  const lbl = slasher === 'player' ? '玩家' : 'AI';
  
  // 长枪劈砍额外+1架势
  if (slasherWeapon === 'spear' && isAdvantage(slasherWeapon, dist)) {
    fx[victim].stanceChange += 1;
  }

  // 推距离
  const push = getPushDistance(slasherWeapon, dist, CombatCard.SLASH, victimCard);
  fx.distancePush += push;

  fx.log.push(`${lbl}劈砍命中：对手受${dmg}伤+架势${push ? '，距离+' + push : ''}`);
}
Object.assign(LBQ, { resolveCombat });

})(window.LBQ);