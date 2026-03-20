// ═══════ Toast Notification ═══════
export function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `game-toast toast-${type}`;
  el.textContent = msg;
  container.appendChild(el);
  // trigger reflow then animate in
  void el.offsetWidth;
  el.classList.add('toast-show');
  setTimeout(() => {
    el.classList.add('toast-hide');
    el.addEventListener('animationend', () => el.remove());
  }, 2200);
}
