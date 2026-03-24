import { CombatCard, WeaponType } from '../types.js';
import { COMBAT_CARD_NAMES, COMBAT_CARD_BASE, WEAPON_NAMES, WEAPON_EMOJI, WEAPON_ZONES } from '../constants.js';
import { isAdvantage, isDisadvantage, getDamageModifier, getBlockSlashReduction, isBlockPerfect } from './weapon.js';

/**
 * 获取当前武器在指定距离下生效的特性标签
 * 用于 UI 显示，但逻辑判定在 engine 层完成
 */
export function getActiveTraits(weapon, dist) {
  const adv = isAdvantage(weapon, dist);
  const disadv = isDisadvantage(weapon, dist);
  const traits = [];

  if (adv) traits.push({ icon: '★', text: '优势区', cls: 'trait-buff' });
  if (disadv) traits.push({ icon: '✗', text: '劣势区', cls: 'trait-nerf' });

  switch (weapon) {
    case WeaponType.SHORT_BLADE:
      if (adv) {
        traits.push({ icon: '🎯', text: '轻击破闪避', cls: 'trait-buff' });
        traits.push({ icon: '🗡️', text: '闪避时反击1伤', cls: 'trait-buff' });
      }
      if (dist >= 3) traits.push({ icon: '⚠', text: '重击几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.SPEAR:
      if (adv) {
        traits.push({ icon: '🔱', text: '重击+2伤+额外架势', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '格挡弹枪推1距', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '重击几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.SWORD:
      if (adv) {
        traits.push({ icon: '⚔️', text: '卸力不造成僵直', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '完美格挡(重击免伤)', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '重击大幅削弱', cls: 'trait-nerf' });
      if (dist === 3) traits.push({ icon: '⚠', text: '重击大幅削弱', cls: 'trait-nerf' });
      break;
    case WeaponType.STAFF:
      if (adv) {
        traits.push({ icon: '🏑', text: '擒拿+3架势', cls: 'trait-buff' });
        traits.push({ icon: '↗', text: '擒拿破格挡→推距', cls: 'trait-buff' });
        traits.push({ icon: '⚡', text: '重击额外+2架势', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '格挡震退+1架势', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '重击几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.GREAT_BLADE:
      if (adv) {
        traits.push({ icon: '🪓', text: '重击+3伤(共6)', cls: 'trait-buff' });
        traits.push({ icon: '↗', text: '重击命中→推距+1', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '格挡额外减1伤', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '重击几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.DUAL_STAB:
      if (adv) {
        traits.push({ icon: '🥢', text: '轻击追击+1伤', cls: 'trait-buff' });
        traits.push({ icon: '💨', text: '闪避→对手+2架势', cls: 'trait-buff' });
        traits.push({ icon: '✦', text: '命中额外+1架势', cls: 'trait-buff' });
      }
      if (disadv) traits.push({ icon: '⚠', text: '重击几乎无效', cls: 'trait-nerf' });
      break;
  }

  return traits;
}

/**
 * 解释两张攻防卡的对战结果（用于回合详解弹窗）
 * 返回描述性文本数组
 */
export function explainCombatMatchup(pCard, aCard, pW, aW, dist) {
  const lines = [];
  const pName = COMBAT_CARD_NAMES[pCard];
  const aName = COMBAT_CARD_NAMES[aCard];

  lines.push(`玩家出 <strong>${pName}</strong> vs AI出 <strong>${aName}</strong>`);

  if (pCard === aCard) {
    switch (pCard) {
      case CombatCard.BLOCK: case CombatCard.FEINT:
        lines.push('双方出了相同的牌 → <strong>空过</strong>，无事发生');
        break;
      case CombatCard.DEFLECT:
        lines.push('卸力对碰 → <strong>双方各+2架势</strong>');
        break;
      case CombatCard.SLASH:
        lines.push('互砍 → <strong>双方各受重击伤害+1架势</strong>');
        break;
      case CombatCard.THRUST:
        lines.push('互刺 → <strong>双方各受轻击伤害+1架势</strong>');
        break;
    }
    return lines;
  }

  explainPair(lines, pCard, aCard, pW, aW, dist, '玩家');
  if (lines.length === 1) {
    explainPair(lines, aCard, pCard, aW, pW, dist, 'AI');
  }

  // 武器特殊加成说明
  if (isAdvantage(pW, dist)) {
    const dmgMod = getDamageModifier(pW, dist, pCard);
    if (dmgMod > 0) lines.push(`📈 玩家 ${WEAPON_NAMES[pW]} 优势区加成：${pName}伤害+${dmgMod}`);
  }
  if (isAdvantage(aW, dist)) {
    const dmgMod = getDamageModifier(aW, dist, aCard);
    if (dmgMod > 0) lines.push(`📈 AI ${WEAPON_NAMES[aW]} 优势区加成：${aName}伤害+${dmgMod}`);
  }

  return lines;
}

function explainPair(lines, attacker, defender, aWeapon, dWeapon, dist, label) {
  if (attacker === CombatCard.DEFLECT) {
    if (defender === CombatCard.SLASH) {
      lines.push(`${label}卸力 vs 重击 → <strong>卸力反制成功！</strong>重击方受2伤+2架势+僵直`);
      if (aWeapon === 'sword') lines.push(`（⚔️ 剑的卸力：不造成僵直，改为自身-2架势）`);
    } else if (defender === CombatCard.THRUST) {
      lines.push(`${label}卸力 vs 轻击 → <strong>卸力失败</strong>（轻击穿透卸力），卸力方受轻击伤害+1架势`);
    } else if (defender === CombatCard.FEINT) {
      lines.push(`${label}卸力 vs 擒拿 → <strong>卸力识破！</strong>擒拿方+2架势`);
    } else if (defender === CombatCard.BLOCK) {
      lines.push(`${label}卸力 vs 格挡 → <strong>卸力落空</strong>，卸力方+1架势`);
    }
  } else if (attacker === CombatCard.SLASH) {
    const baseDmg = COMBAT_CARD_BASE[CombatCard.SLASH].damage;
    const mod = getDamageModifier(aWeapon, dist, CombatCard.SLASH);
    const dmg = Math.max(0, baseDmg + mod);
    const dmgNote = mod < 0 ? `（势区惩罚${mod}，实际${dmg}伤）` : '';
    if (defender === CombatCard.THRUST) {
      lines.push(`${label}重击 vs 轻击 → <strong>重击克制轻击！</strong>轻击方受${dmg}伤+1架势${dmgNote}`);
    } else if (defender === CombatCard.BLOCK) {
      const reduction = getBlockSlashReduction(dWeapon, dist);
      if (isBlockPerfect(dWeapon, dist)) {
        lines.push(`${label}重击 vs 格挡 → <strong>完美格挡！</strong>格挡方完全免伤${dmgNote}`);
      } else {
        const afterBlock = Math.max(0, dmg - reduction);
        lines.push(`${label}重击 vs 格挡 → <strong>重击破格挡</strong>，格挡方减免${reduction}伤后受${afterBlock}伤+1架势${dmgNote}`);
      }
    } else if (defender === CombatCard.FEINT) {
      lines.push(`${label}重击 vs 擒拿 → <strong>重击命中！</strong>擒拿方受${dmg}伤+1架势${dmgNote}`);
    }
  } else if (attacker === CombatCard.THRUST) {
    const baseDmg = COMBAT_CARD_BASE[CombatCard.THRUST].damage;
    const mod = getDamageModifier(aWeapon, dist, CombatCard.THRUST);
    const dmg = Math.max(0, baseDmg + mod);
    const dmgNote = mod !== 0 ? `（距离修正${mod > 0 ? '+' : ''}${mod}，实际${dmg}伤）` : '';
    if (defender === CombatCard.BLOCK) {
      lines.push(`${label}轻击 vs 格挡 → <strong>格挡完全抵消</strong>轻击，无伤害`);
    } else if (defender === CombatCard.FEINT) {
      lines.push(`${label}轻击 vs 擒拿 → <strong>轻击命中！</strong>擒拿方受${dmg}伤+1架势${dmgNote}`);
    }
  } else if (attacker === CombatCard.BLOCK) {
    if (defender === CombatCard.FEINT) {
      lines.push(`${label}格挡 vs 擒拿 → <strong>格挡被擒拿骗</strong>，格挡方+3架势`);
    }
  }
}
