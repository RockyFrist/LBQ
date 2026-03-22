import { WEAPON_EMOJI, WEAPON_NAMES } from '../constants.js';
import { CONFIG_META, CONFIG_DEFAULTS, getCurrentConfig, getConfigDiff,
  saveConfig, resetConfig, applyConfig } from '../config.js';
import { showToast } from './toast.js';

// ═══════ Config Modal ═══════
export function showConfigModal() {
  const old = document.getElementById('cfg-modal');
  if (old) old.remove();

  const cfg = getCurrentConfig();
  const DIST_LABELS = ['0-贴身', '1-近战', '2-中距', '3-远距'];

  const modal = document.createElement('div');
  modal.id = 'cfg-modal';
  modal.className = 'sim-modal-overlay';

  let numericRows = '';
  for (const [key, meta] of Object.entries(CONFIG_META)) {
    const val = cfg[key];
    const def = CONFIG_DEFAULTS[key];
    const changed = val !== def;
    numericRows += `
      <div class="cfg-row">
        <label>${meta.label}</label>
        <input type="number" id="cfg-${key}" value="${val}" min="${meta.min}" max="${meta.max}" step="${meta.step}" />
        <span class="cfg-default${changed ? ' cfg-changed' : ''}">(默认: ${def})</span>
      </div>`;
  }

  let weaponRows = '';
  for (const [weapon, zones] of Object.entries(cfg.WEAPON_ZONES)) {
    const name = (WEAPON_EMOJI[weapon] || '') + ' ' + (WEAPON_NAMES[weapon] || weapon);
    const defZones = CONFIG_DEFAULTS.WEAPON_ZONES[weapon];
    const advChanged = defZones && JSON.stringify(zones.advantage) !== JSON.stringify(defZones.advantage);
    const disadvChanged = defZones && JSON.stringify(zones.disadvantage) !== JSON.stringify(defZones.disadvantage);

    weaponRows += `
      <div class="cfg-weapon-block">
        <div class="cfg-weapon-name">${name}</div>
        <div class="cfg-zone-row">
          <label>优势区</label>
          <div class="cfg-checkboxes" data-weapon="${weapon}" data-type="advantage">
            ${DIST_LABELS.map((lbl, i) => `<label class="cfg-cb"><input type="checkbox" value="${i}" ${zones.advantage.includes(i) ? 'checked' : ''} /> ${lbl}</label>`).join('')}
          </div>
          ${advChanged ? '<span class="cfg-changed-dot">●</span>' : ''}
        </div>
        <div class="cfg-zone-row">
          <label>劣势区</label>
          <div class="cfg-checkboxes" data-weapon="${weapon}" data-type="disadvantage">
            ${DIST_LABELS.map((lbl, i) => `<label class="cfg-cb"><input type="checkbox" value="${i}" ${zones.disadvantage.includes(i) ? 'checked' : ''} /> ${lbl}</label>`).join('')}
          </div>
          ${disadvChanged ? '<span class="cfg-changed-dot">●</span>' : ''}
        </div>
      </div>`;
  }

  const diffs = getConfigDiff(cfg);
  let diffHtml = '';
  if (diffs.length > 0) {
    diffHtml = `<div class="cfg-diff"><strong>与默认值差异：</strong>` +
      diffs.map(d => `<div class="cfg-diff-item"><span class="cfg-diff-label">${d.label}</span> <span class="cfg-diff-old">${d.default}</span> → <span class="cfg-diff-new">${d.current}</span></div>`).join('') +
      `</div>`;
  }

  modal.innerHTML = `
    <div class="sim-modal-box cfg-modal-box">
      <div class="sim-header">
        <h2>⚙️ 参数配置</h2>
        <button class="sim-close" id="cfg-close">✕</button>
      </div>
      <div class="cfg-section">
        <h3>基础数值</h3>
        ${numericRows}
      </div>
      <div class="cfg-section">
        <h3>兵器区间</h3>
        ${weaponRows}
      </div>
      <div id="cfg-diff-area">${diffHtml}</div>
      <div class="cfg-actions">
        <button class="cfg-btn cfg-save" id="cfg-save">💾 保存</button>
        <button class="cfg-btn cfg-reset" id="cfg-reset">↩ 恢复默认</button>
        <button class="cfg-btn cfg-cancel" id="cfg-cancel">取消</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('cfg-close').addEventListener('click', () => modal.remove());
  document.getElementById('cfg-cancel').addEventListener('click', () => modal.remove());

  document.getElementById('cfg-save').addEventListener('click', () => {
    const newCfg = gatherConfigFromUI();
    saveConfig(newCfg);
    applyConfig(newCfg);
    modal.remove();
    showToast('✅ 配置已保存！下次对局生效。', 'success');
  });

  document.getElementById('cfg-reset').addEventListener('click', () => {
    resetConfig();
    modal.remove();
    showToast('↩ 已恢复默认配置！', 'info');
  });

  modal.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      const newCfg = gatherConfigFromUI();
      const diffs = getConfigDiff(newCfg);
      const diffArea = document.getElementById('cfg-diff-area');
      if (diffs.length > 0) {
        diffArea.innerHTML = `<div class="cfg-diff"><strong>与默认值差异：</strong>` +
          diffs.map(d => `<div class="cfg-diff-item"><span class="cfg-diff-label">${d.label}</span> <span class="cfg-diff-old">${d.default}</span> → <span class="cfg-diff-new">${d.current}</span></div>`).join('') +
          `</div>`;
      } else {
        diffArea.innerHTML = '<div class="cfg-diff"><em>无差异（全部为默认值）</em></div>';
      }
    });
  });
}

function gatherConfigFromUI() {
  const cfg = getCurrentConfig();

  for (const key of Object.keys(CONFIG_META)) {
    const el = document.getElementById(`cfg-${key}`);
    if (el) cfg[key] = parseInt(el.value) || CONFIG_META[key].min;
  }

  document.querySelectorAll('.cfg-checkboxes').forEach(container => {
    const weapon = container.dataset.weapon;
    const type = container.dataset.type;
    const checked = [];
    container.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      checked.push(parseInt(cb.value));
    });
    if (!cfg.WEAPON_ZONES[weapon]) cfg.WEAPON_ZONES[weapon] = { advantage: [], disadvantage: [] };
    cfg.WEAPON_ZONES[weapon][type] = checked.sort();
  });

  return cfg;
}
