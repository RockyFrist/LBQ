;(function(LBQ) {

const STORAGE_KEY = 'lbq2_config';

// ═══════ 默认配置（与 constants.js 保持一致）═══════
const DEFAULTS = {
  // 基础数值
  MAX_HP: 10,
  MAX_STAMINA: 8,
  STAMINA_RECOVERY: 3,
  MAX_STANCE: 5,
  EXECUTION_DAMAGE: 5,
  INITIAL_DISTANCE: 2,

  // 兵器优劣势区间
  WEAPON_ZONES: {
    short_blade:  { advantage: [0, 1], disadvantage: [2, 3] },
    spear:        { advantage: [2, 3], disadvantage: [0] },
    sword:        { advantage: [1, 2], disadvantage: [0, 3] },
    staff:        { advantage: [1, 2, 3], disadvantage: [0] },
    great_blade:  { advantage: [2], disadvantage: [0] },
    dual_stab:    { advantage: [0], disadvantage: [2, 3] },
  },
};

// ═══════ 配置项元信息 ═══════
const CONFIG_META = {
  MAX_HP:            { label: '最大气血', min: 5, max: 30, step: 1 },
  MAX_STAMINA:       { label: '最大体力', min: 4, max: 16, step: 1 },
  STAMINA_RECOVERY:  { label: '回合恢复体力', min: 1, max: 8, step: 1 },
  MAX_STANCE:        { label: '处决架势阈值', min: 3, max: 10, step: 1 },
  EXECUTION_DAMAGE:  { label: '处决伤害', min: 2, max: 15, step: 1 },
  INITIAL_DISTANCE:  { label: '初始距离', min: 0, max: 3, step: 1 },
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 从 localStorage 加载配置，覆盖到 LBQ 的实际常量上
 */
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * 保存配置到 localStorage
 */
function saveConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 将配置应用到 LBQ 运行时常量
 */
function applyConfig(cfg) {
  if (!cfg) return;
  // 数值型常量
  for (const key of Object.keys(CONFIG_META)) {
    if (cfg[key] !== undefined) {
      LBQ[key] = cfg[key];
    }
  }
  // 兵器区间
  if (cfg.WEAPON_ZONES) {
    for (const [weapon, zones] of Object.entries(cfg.WEAPON_ZONES)) {
      if (LBQ.WEAPON_ZONES[weapon]) {
        LBQ.WEAPON_ZONES[weapon] = deepClone(zones);
      }
    }
  }
}

/**
 * 恢复默认
 */
function resetConfig() {
  localStorage.removeItem(STORAGE_KEY);
  applyConfig(deepClone(DEFAULTS));
}

/**
 * 获取当前配置与默认值的差异
 */
function getConfigDiff(cfg) {
  if (!cfg) return [];
  const diffs = [];
  for (const key of Object.keys(CONFIG_META)) {
    const def = DEFAULTS[key];
    const cur = cfg[key];
    if (cur !== undefined && cur !== def) {
      diffs.push({ key, label: CONFIG_META[key].label, default: def, current: cur });
    }
  }
  // 兵器区间差异
  if (cfg.WEAPON_ZONES) {
    const { WEAPON_NAMES } = LBQ;
    for (const [weapon, zones] of Object.entries(cfg.WEAPON_ZONES)) {
      const def = DEFAULTS.WEAPON_ZONES[weapon];
      if (!def) continue;
      const advChanged = JSON.stringify(zones.advantage) !== JSON.stringify(def.advantage);
      const disadvChanged = JSON.stringify(zones.disadvantage) !== JSON.stringify(def.disadvantage);
      if (advChanged || disadvChanged) {
        const name = WEAPON_NAMES[weapon] || weapon;
        if (advChanged) {
          diffs.push({
            key: `${weapon}_adv`, label: `${name} 优势区`,
            default: def.advantage.join(','), current: zones.advantage.join(','),
          });
        }
        if (disadvChanged) {
          diffs.push({
            key: `${weapon}_disadv`, label: `${name} 劣势区`,
            default: def.disadvantage.join(','), current: zones.disadvantage.join(','),
          });
        }
      }
    }
  }
  return diffs;
}

/**
 * 获取当前有效配置（合并默认+自定义）
 */
function getCurrentConfig() {
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

// 启动时自动加载配置
const saved = loadConfig();
if (saved) applyConfig(saved);

Object.assign(LBQ, {
  CONFIG_DEFAULTS: DEFAULTS,
  CONFIG_META,
  loadConfig, saveConfig, applyConfig, resetConfig,
  getConfigDiff, getCurrentConfig,
});

})(window.LBQ);
