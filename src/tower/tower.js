import { WeaponType } from '../types.js';
import { gameConfig } from '../constants.js';

// ═══════ Tower Floor Data ═══════

export const TOWER_FLOORS = [
  {
    floor: 1, npc: '李大壮', title: '村口恶霸',
    weapon: WeaponType.STAFF, aiLevel: 1,
    intro: '路经偏僻村落，一名壮汉持棍拦路。',
    taunt: '此路是我开！留下买路钱！',
  },
  {
    floor: 2, npc: '赵三', title: '山贼喽啰',
    weapon: WeaponType.SHORT_BLADE, aiLevel: 2,
    intro: '山间小道，草丛中窜出一名手持短刀的毛贼。',
    taunt: '识相的把包袱留下！',
  },
  {
    floor: 3, npc: '钱小六', title: '镖局镖师',
    weapon: WeaponType.SPEAR, aiLevel: 2,
    intro: '误入镖队行进路线，一名镖师持枪喝止。',
    taunt: '何方人物？报上名来！',
  },
  {
    floor: 4, npc: '孙铁柱', title: '武馆弟子',
    weapon: WeaponType.SWORD, aiLevel: 3,
    intro: '途经武馆，一名弟子欣然邀战。',
    taunt: '久闻大名，请赐教！',
  },
  {
    floor: 5, npc: '周大锤', title: '铁匠侠客',
    weapon: WeaponType.GREAT_BLADE, aiLevel: 3,
    intro: '铁匠铺旁，一名大汉扛着长柄大刀拦住去路。',
    taunt: '我这把大刀早已饥渴难耐！',
  },
  {
    floor: 6, npc: '吴影', title: '暗巷刺客',
    weapon: WeaponType.DUAL_STAB, aiLevel: 4,
    intro: '夜入小巷，身后传来阴冷的脚步声……',
    taunt: '…………',
  },
  {
    floor: 7, npc: '郑云飞', title: '青衫剑客',
    weapon: WeaponType.SWORD, aiLevel: 4,
    intro: '客栈饮酒，邻桌青衫剑客放下酒杯，缓缓起身。',
    taunt: '以剑会友，不醉不归。',
  },
  {
    floor: 8, npc: '王长风', title: '枪法名家',
    weapon: WeaponType.SPEAR, aiLevel: 5,
    intro: '擂台之上，白发老者持枪而立，气势如渊。',
    taunt: '老夫征战三十年，尚未一败。',
  },
  {
    floor: 9, npc: '陈残雪', title: '独臂刀客',
    weapon: WeaponType.GREAT_BLADE, aiLevel: 5,
    intro: '古道尽头，独臂刀客横刀冷立，杀意凛然。',
    taunt: '这条路的尽头，只能有一个人。',
  },
  {
    floor: 10, npc: '萧无名', title: '绝世高手',
    weapon: null,
    aiLevel: 6,
    intro: '山巅之上，一个看不清面容的身影背对着你。',
    taunt: '你终于来了。',
  },
];

export const HP_RECOVERY_PER_FLOOR = 3;

// ═══════ Tower State Management ═══════

export function createTowerState(playerWeapon) {
  return {
    playerWeapon,
    currentFloor: 0,
    playerHp: gameConfig.MAX_HP,
    completed: false,
    gameOver: false,
  };
}

export function getTowerFloor(towerState) {
  const floor = TOWER_FLOORS[towerState.currentFloor];
  if (!floor) return null;
  if (!floor.weapon) {
    const weapons = Object.values(WeaponType);
    return { ...floor, weapon: weapons[Math.floor(Math.random() * weapons.length)] };
  }
  return floor;
}

export function advanceTowerFloor(towerState, endPlayerHp) {
  const ts = { ...towerState };
  ts.playerHp = Math.min(gameConfig.MAX_HP, endPlayerHp + HP_RECOVERY_PER_FLOOR);
  ts.currentFloor += 1;
  if (ts.currentFloor >= TOWER_FLOORS.length) {
    ts.completed = true;
  }
  return ts;
}

export function isTowerComplete(towerState) {
  return towerState.completed;
}
