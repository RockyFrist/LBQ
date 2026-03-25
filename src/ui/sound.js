// ═══════ Sound Effects Module (Web Audio API Synthesis) ═══════
// All sounds are procedurally generated — no external files needed.

let audioCtx = null;
let masterGain = null;
let sfxVolume = 0.5;
let musicVolume = 0.3;
let muted = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = sfxVolume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function getMaster() {
  getCtx();
  return masterGain;
}

// ─── Volume Control ───
export function setSfxVolume(v) {
  sfxVolume = Math.max(0, Math.min(1, v));
  if (masterGain) masterGain.gain.value = muted ? 0 : sfxVolume;
  try { localStorage.setItem('lbq_sfxVol', sfxVolume); } catch {}
}
export function getSfxVolume() { return sfxVolume; }

export function setMuted(m) {
  muted = m;
  if (masterGain) masterGain.gain.value = muted ? 0 : sfxVolume;
  try { localStorage.setItem('lbq_muted', m ? '1' : '0'); } catch {}
}
export function isMuted() { return muted; }

// Restore saved settings
try {
  const sv = localStorage.getItem('lbq_sfxVol');
  if (sv !== null) sfxVolume = parseFloat(sv);
  const sm = localStorage.getItem('lbq_muted');
  if (sm === '1') muted = true;
} catch {}

// ─── Primitive Helpers ───
function playNoise(duration, filterFreq, filterType, gain, attack, decay) {
  const ctx = getCtx();
  const len = duration * ctx.sampleRate;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType || 'lowpass';
  filter.frequency.value = filterFreq || 2000;

  const env = ctx.createGain();
  const now = ctx.currentTime;
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(gain || 0.3, now + (attack || 0.01));
  env.gain.linearRampToValueAtTime(0, now + duration);

  src.connect(filter);
  filter.connect(env);
  env.connect(getMaster());
  src.start(now);
  src.stop(now + duration);
}

function playTone(freq, duration, type, gain, attack, decay) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  osc.type = type || 'sine';
  osc.frequency.value = freq;

  const env = ctx.createGain();
  const now = ctx.currentTime;
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(gain || 0.3, now + (attack || 0.01));
  env.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(env);
  env.connect(getMaster());
  osc.start(now);
  osc.stop(now + duration);
}

function playToneSeq(notes, type, gain) {
  const ctx = getCtx();
  const now = ctx.currentTime;
  let t = now;
  for (const [freq, dur] of notes) {
    const osc = ctx.createOscillator();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain || 0.25, t + 0.01);
    env.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(env);
    env.connect(getMaster());
    osc.start(t);
    osc.stop(t + dur);
    t += dur * 0.85;
  }
}

// ═══════ UI Sound Effects ═══════

export function sfxClick() {
  playTone(800, 0.08, 'sine', 0.15, 0.005, 0.07);
}

export function sfxCardSelect() {
  playTone(600, 0.06, 'square', 0.1, 0.005, 0.05);
  playTone(900, 0.08, 'sine', 0.12, 0.02, 0.06);
}

export function sfxCardDeselect() {
  playTone(500, 0.06, 'sine', 0.08, 0.005, 0.05);
}

export function sfxConfirm() {
  playToneSeq([[520, 0.08], [780, 0.12]], 'sine', 0.2);
}

export function sfxCancel() {
  playToneSeq([[500, 0.08], [350, 0.12]], 'sine', 0.15);
}

export function sfxToastWarn() {
  playToneSeq([[400, 0.1], [300, 0.15]], 'triangle', 0.15);
}

export function sfxToastInfo() {
  playTone(660, 0.12, 'sine', 0.1, 0.005, 0.1);
}

// ═══════ Combat Sound Effects ═══════

/** 重击/劈砍 — 沉重金属挥砍 */
export function sfxSlash() {
  playNoise(0.25, 3000, 'bandpass', 0.35, 0.005, 0.2);
  playTone(150, 0.15, 'sawtooth', 0.2, 0.005, 0.12);
}

/** 轻击/突刺 — 快速穿刺音 */
export function sfxThrust() {
  playNoise(0.12, 5000, 'highpass', 0.25, 0.005, 0.1);
  playTone(400, 0.08, 'square', 0.15, 0.005, 0.07);
}

/** 格挡 — 金属撞击盾牌 */
export function sfxBlock() {
  playTone(200, 0.2, 'triangle', 0.25, 0.005, 0.15);
  playNoise(0.1, 1500, 'lowpass', 0.2, 0.005, 0.08);
}

/** 卸力 — 刀锋擦划 */
export function sfxDeflect() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.linearRampToValueAtTime(200, now + 0.2);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.2, now + 0.02);
  env.gain.linearRampToValueAtTime(0, now + 0.25);
  osc.connect(env);
  env.connect(getMaster());
  osc.start(now);
  osc.stop(now + 0.25);
  playNoise(0.15, 4000, 'highpass', 0.15, 0.01, 0.12);
}

/** 擒拿 — 短促抓握 */
export function sfxFeint() {
  playTone(300, 0.1, 'square', 0.12, 0.005, 0.08);
  playNoise(0.08, 2000, 'lowpass', 0.15, 0.01, 0.06);
}

/** 闪避 — 风声呼啸 */
export function sfxDodge() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.linearRampToValueAtTime(800, now + 0.1);
  osc.frequency.linearRampToValueAtTime(200, now + 0.3);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.15, now + 0.05);
  env.gain.linearRampToValueAtTime(0, now + 0.3);
  osc.connect(env);
  env.connect(getMaster());
  osc.start(now);
  osc.stop(now + 0.3);
  playNoise(0.2, 6000, 'highpass', 0.1, 0.02, 0.15);
}

/** 兵器碰撞/互砍 — 金属铿锵 */
export function sfxClash() {
  playTone(250, 0.08, 'square', 0.3, 0.002, 0.06);
  playTone(500, 0.12, 'sawtooth', 0.2, 0.005, 0.1);
  playNoise(0.18, 3500, 'bandpass', 0.3, 0.005, 0.15);
}

/** 受击/伤害 — 钝击 */
export function sfxHit() {
  playNoise(0.15, 800, 'lowpass', 0.35, 0.005, 0.12);
  playTone(100, 0.12, 'sine', 0.25, 0.005, 0.1);
}

/** 处决 — 重击+特殊音效 */
export function sfxExecution() {
  playNoise(0.3, 600, 'lowpass', 0.4, 0.005, 0.25);
  playTone(80, 0.3, 'sawtooth', 0.3, 0.005, 0.25);
  setTimeout(() => {
    playTone(60, 0.4, 'sine', 0.25, 0.01, 0.35);
    playNoise(0.2, 2000, 'bandpass', 0.25, 0.02, 0.15);
  }, 150);
}

/** 僵直/打断 — 嗡鸣 */
export function sfxStagger() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(80, now + 0.3);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.2, now + 0.02);
  env.gain.linearRampToValueAtTime(0, now + 0.35);
  osc.connect(env);
  env.connect(getMaster());
  osc.start(now);
  osc.stop(now + 0.35);
}

/** 击退 */
export function sfxKnockback() {
  playNoise(0.2, 1200, 'lowpass', 0.25, 0.005, 0.15);
  playTone(200, 0.15, 'triangle', 0.15, 0.01, 0.12);
}

// ═══════ Movement Sound Effects ═══════

/** 冲步 — 快速脚步 */
export function sfxDashIn() {
  playNoise(0.1, 3000, 'lowpass', 0.15, 0.005, 0.08);
  playTone(250, 0.06, 'sine', 0.1, 0.005, 0.05);
}

/** 撤步 — 退后脚步 */
export function sfxDashOut() {
  playNoise(0.12, 2000, 'lowpass', 0.12, 0.005, 0.1);
  playTone(180, 0.08, 'sine', 0.08, 0.005, 0.06);
}

/** 原地站稳 */
export function sfxBrace() {
  playNoise(0.06, 1500, 'lowpass', 0.08, 0.005, 0.04);
}

// ═══════ Game Flow Sound Effects ═══════

/** 回合开始 — 短促鼓点 */
export function sfxRoundStart() {
  playTone(120, 0.15, 'triangle', 0.2, 0.005, 0.12);
  playNoise(0.1, 800, 'lowpass', 0.15, 0.02, 0.08);
}

/** 胜利 — 升调号角 */
export function sfxVictory() {
  playToneSeq([
    [523, 0.15], [659, 0.15], [784, 0.15], [1047, 0.3],
  ], 'triangle', 0.25);
  setTimeout(() => {
    playToneSeq([[784, 0.12], [1047, 0.25]], 'sine', 0.15);
  }, 200);
}

/** 失败 — 降调号角 */
export function sfxDefeat() {
  playToneSeq([
    [400, 0.2], [350, 0.2], [300, 0.25], [200, 0.4],
  ], 'triangle', 0.2);
}

/** 闯关通过 — 短嘹亮 */
export function sfxFloorClear() {
  playToneSeq([
    [600, 0.1], [800, 0.1], [1000, 0.2],
  ], 'sine', 0.2);
}

/** 塔全通 — 凯旋 */
export function sfxTowerVictory() {
  playToneSeq([
    [523, 0.12], [659, 0.12], [784, 0.15], [1047, 0.15], [1319, 0.25],
  ], 'triangle', 0.3);
  setTimeout(() => {
    playToneSeq([[1047, 0.1], [1319, 0.15], [1568, 0.3]], 'sine', 0.2);
  }, 300);
}

/** 游戏结束 — 沉重 */
export function sfxGameOver() {
  playToneSeq([
    [300, 0.25], [250, 0.25], [200, 0.3], [150, 0.5],
  ], 'sawtooth', 0.15);
}

/** 对局开始 — 拔刀/铿 */
export function sfxBattleStart() {
  playNoise(0.15, 5000, 'highpass', 0.2, 0.005, 0.1);
  setTimeout(() => {
    playTone(400, 0.1, 'sawtooth', 0.15, 0.005, 0.08);
    playTone(600, 0.15, 'sine', 0.12, 0.02, 0.1);
  }, 80);
}

/** 体力恢复 */
export function sfxStaminaRecover() {
  playTone(500, 0.08, 'sine', 0.08, 0.005, 0.06);
  playTone(700, 0.1, 'sine', 0.06, 0.03, 0.07);
}

/** 架势增加 */
export function sfxStanceUp() {
  playTone(350, 0.1, 'triangle', 0.12, 0.005, 0.08);
}

/** 架势减少 */
export function sfxStanceDown() {
  playTone(600, 0.08, 'sine', 0.08, 0.005, 0.06);
  playTone(800, 0.1, 'sine', 0.06, 0.02, 0.07);
}

// ═══════ Sound for combat card type ═══════
const COMBAT_SFX_MAP = {
  slash:   sfxSlash,
  thrust:  sfxThrust,
  block:   sfxBlock,
  deflect: sfxDeflect,
  feint:   sfxFeint,
};

export function sfxForCombatCard(card) {
  const fn = COMBAT_SFX_MAP[card];
  if (fn) fn();
}

// Initialize audio context on first user interaction
function initOnInteraction() {
  getCtx();
  document.removeEventListener('click', initOnInteraction);
  document.removeEventListener('keydown', initOnInteraction);
}
document.addEventListener('click', initOnInteraction);
document.addEventListener('keydown', initOnInteraction);
