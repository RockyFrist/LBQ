import { CombatCard, WeaponType } from '../types.js';
import { COMBAT_CARD_NAMES, WEAPON_NAMES, WEAPON_EMOJI, WEAPON_ZONES } from '../constants.js';
import { isAdvantage, isDisadvantage, getDamageModifier } from './weapon.js';

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
        traits.push({ icon: '🎯', text: '点刺破闪避', cls: 'trait-buff' });
        traits.push({ icon: '🗡️', text: '闪避时反击1伤', cls: 'trait-buff' });
      }
      if (dist >= 3) traits.push({ icon: '⚠', text: '劈砍几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.SPEAR:
      if (adv) {
        traits.push({ icon: '🔱', text: '劈砍+2伤+额外架势', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '格挡弹枪推1距', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '劈砍几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.SWORD:
      if (adv) {
        traits.push({ icon: '⚔️', text: '卸力不造成僵直', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '完美格挡(劈砍免伤)', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '劈砍大幅削弱', cls: 'trait-nerf' });
      if (dist === 3) traits.push({ icon: '⚠', text: '劈砍大幅削弱', cls: 'trait-nerf' });
      break;
    case WeaponType.STAFF:
      if (adv) {
        traits.push({ icon: '🏑', text: '虚晃+3架势', cls: 'trait-buff' });
        traits.push({ icon: '↗', text: '虚晃破格挡→推距', cls: 'trait-buff' });
        traits.push({ icon: '⚡', text: '劈砍额外+2架势', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '格挡震退+1架势', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '劈砍几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.GREAT_BLADE:
      if (adv) {
        traits.push({ icon: '🪓', text: '劈砍+3伤(共6)', cls: 'trait-buff' });
        traits.push({ icon: '↗', text: '劈砍命中→推距+1', cls: 'trait-buff' });
        traits.push({ icon: '🛡️', text: '格挡额外减1伤', cls: 'trait-buff' });
      }
      if (dist === 0) traits.push({ icon: '⚠', text: '劈砍几乎无效', cls: 'trait-nerf' });
      break;
    case WeaponType.DUAL_STAB:
      if (adv) {
        traits.push({ icon: '🥢', text: '点刺追击+1伤', cls: 'trait-buff' });
        traits.push({ icon: '💨', text: '闪避→对手+2架势', cls: 'trait-buff' });
        traits.push({ icon: '✦', text: '命中额外+1架势', cls: 'trait-buff' });
      }
      if (disadv) traits.push({ icon: '⚠', text: '劈砍几乎无效', cls: 'trait-nerf' });
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
        lines.push('互砍 → <strong>双方各受劈砍伤害+1架势</strong>');
        break;
      case CombatCard.THRUST:
        lines.push('互刺 → <strong>双方各受点刺伤害+1架势</strong>');
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
      lines.push(`${label}卸力 vs 劈砍 → <strong>卸力反制成功！</strong>劈砍方受2伤+2架势+僵直`);
      if (aWeapon === 'sword') lines.push(`（⚔️ 剑的卸力：不造成僵直，改为自身-2架势）`);
    } else if (defender === CombatCard.THRUST) {
      lines.push(`${label}卸力 vs 点刺 → <strong>卸力失败</strong>（点刺穿透卸力），卸力方受点刺伤害+1架势`);
    } else if (defender === CombatCard.FEINT) {
      lines.push(`${label}卸力 vs 虚晃 → <strong>卸力被骗</strong>，卸力方+2架势`);
    } else if (defender === CombatCard.BLOCK) {
      lines.push(`${label}卸力 vs 格挡 → <strong>卸力落空</strong>，卸力方+1架势`);
    }
  } else if (attacker === CombatCard.SLASH) {
    if (defender === CombatCard.THRUST) {
      lines.push(`${label}劈砍 vs 点刺 → <strong>劈砍克制点刺！</strong>点刺方受劈砍全伤+1架势，劈砍方不受伤`);
    } else if (defender === CombatCard.BLOCK) {
      lines.push(`${label}劈砍 vs 格挡 → <strong>劈砍破格挡</strong>，格挡方减免1伤后仍受伤+1架势`);
    } else if (defender === CombatCard.FEINT) {
      lines.push(`${label}劈砍 vs 虚晃 → <strong>劈砍命中！</strong>虚晃方受劈砍全伤+1架势`);
    }
  } else if (attacker === CombatCard.THRUST) {
    if (defender === CombatCard.BLOCK) {
      lines.push(`${label}点刺 vs 格挡 → <strong>格挡完全抵消</strong>点刺，无伤害`);
    } else if (defender === CombatCard.FEINT) {
      lines.push(`${label}点刺 vs 虚晃 → <strong>点刺命中！</strong>虚晃方受点刺伤+1架势`);
    }
  } else if (attacker === CombatCard.BLOCK) {
    if (defender === CombatCard.FEINT) {
      lines.push(`${label}格挡 vs 虚晃 → <strong>格挡被虚晃骗</strong>，格挡方+2架势`);
    }
  }
}
