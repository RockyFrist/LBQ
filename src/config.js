import { gameConfig, WEAPON_ZONES, WEAPON_NAMES } from './constants.js';

const STORAGE_KEY = 'lbq2_config';

// 从 constants.js 的初始值生成默认值，消除重复定义
function buildDefaults() {
  const wz = {};
  for (const [k, v] of Object.entries(WEAPON_ZONES)) {
    wz[k] = { advantage: [...v.advantage], disadvantage: [...v.disadvantage] };
  }
  return { ...gameConfig, WEAPON_ZONES: wz };
}

const DEFAULTS = buildDefaults();

export const CONFIG_META = {
  MAX_HP:            { label: '最大气血', min: 5, max: 30, step: 1 },
  MAX_STANCE:        { label: '处决架势阈值', min: 3, max: 10, step: 1 },
  EXECUTION_DAMAGE:  { label: '处决伤害', min: 2, max: 15, step: 1 },
  INITIAL_DISTANCE:  { label: '初始间距', min: 0, max: 3, step: 1 },
  MAX_STAMINA:       { label: '最大体力', min: 2, max: 8, step: 1 },
  STAMINA_RECOVERY:  { label: '体力回复/回合', min: 1, max: 3, step: 1 },
};

export const CONFIG_DEFAULTS = DEFAULTS;

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    return true;
  } catch (e) {
    return false;
  }
}

export function applyConfig(cfg) {
  if (!cfg) return;
  for (const key of Object.keys(CONFIG_META)) {
    if (cfg[key] !== undefined) {
      gameConfig[key] = cfg[key];
    }
  }
  if (cfg.WEAPON_ZONES) {
    for (const [weapon, zones] of Object.entries(cfg.WEAPON_ZONES)) {
      if (WEAPON_ZONES[weapon]) {
        WEAPON_ZONES[weapon] = deepClone(zones);
      }
    }
  }
}

export function resetConfig() {
  localStorage.removeItem(STORAGE_KEY);
  applyConfig(deepClone(DEFAULTS));
}

export function getConfigDiff(cfg) {
  if (!cfg) return [];
  const diffs = [];
  for (const key of Object.keys(CONFIG_META)) {
    const def = DEFAULTS[key];
    const cur = cfg[key];
    if (cur !== undefined && cur !== def) {
      diffs.push({ key, label: CONFIG_META[key].label, default: def, current: cur });
    }
  }
  if (cfg.WEAPON_ZONES) {
    for (const [weapon, zones] of Object.entries(cfg.WEAPON_ZONES)) {
      const def = DEFAULTS.WEAPON_ZONES[weapon];
      if (!def) continue;
      const advChanged = JSON.stringify(zones.advantage) !== JSON.stringify(def.advantage);
      const disadvChanged = JSON.stringify(zones.disadvantage) !== JSON.stringify(def.disadvantage);
      if (advChanged || disadvChanged) {
        const name = WEAPON_NAMES[weapon] || weapon;
        if (advChanged) {
          diffs.push({ key: weapon + '_adv', label: name + ' 优势区', default: def.advantage.join(','), current: zones.advantage.join(',') });
        }
        if (disadvChanged) {
          diffs.push({ key: weapon + '_disadv', label: name + ' 劣势区', default: def.disadvantage.join(','), current: zones.disadvantage.join(',') });
        }
      }
    }
  }
  return diffs;
}

export function getCurrentConfig() {
  const saved = loadConfig();
  if (!saved) return deepClone(DEFAULTS);
  const merged = deepClone(DEFAULTS);
  for (const key of Object.keys(CONFIG_META)) {
    if (saved[key] !== undefined) merged[key] = saved[key];
  }
  if (saved.WEAPON_ZONES) {
    for (const [weapon, zones] of Object.entries(saved.WEAPON_ZONES)) {
      if (merged.WEAPON_ZONES[weapon]) {
        merged.WEAPON_ZONES[weapon] = deepClone(zones);
      }
    }
  }
  return merged;
}

/** 启动时调用一次，从 localStorage 恢复配置 */
export function initConfig() {
  const saved = loadConfig();
  if (saved) applyConfig(saved);
}
