// Lightweight toast notification system matching KDT design (black/white minimal).

let container;

function ensureContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none';
  document.body.appendChild(container);
  return container;
}

function iconSvg(type) {
  switch (type) {
    case 'success':
      return `<svg class="w-5 h-5 text-black-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
    case 'error':
      return `<svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;
    case 'warning':
      return `<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.54 21h18.92a1 1 0 00.85-1.46l-8.6-14.86a1 1 0 00-1.71 0z"/></svg>`;
    default:
      return `<svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16h.01M12 8v4"/></svg>`;
  }
}

function borderColor(type) {
  switch (type) {
    case 'success': return 'border-l-black-500';
    case 'error': return 'border-l-red-500';
    case 'warning': return 'border-l-amber-500';
    default: return 'border-l-gray-500';
  }
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {{ type?: 'success'|'error'|'warning'|'info', duration?: number, title?: string }} options
 */
export function toast(message, { type = 'info', duration = 4000, title = '' } = {}) {
  const host = ensureContainer();

  const el = document.createElement('div');
  el.className = `pointer-events-auto bg-white border border-gray-200 ${borderColor(type)} border-l-4 rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 max-w-sm w-full transform translate-x-full transition-transform duration-300 ease-out`;

  el.innerHTML = `
    ${iconSvg(type)}
    <div class="flex-1 min-w-0">
      ${title ? `<p class="text-sm font-semibold text-gray-900 leading-tight">${escapeHtml(title)}</p>` : ''}
      <p class="text-xs text-gray-600 ${title ? 'mt-0.5' : ''} leading-relaxed">${escapeHtml(message)}</p>
    </div>
    <button class="text-gray-400 hover:text-gray-700 flex-shrink-0 text-lg leading-none mt-0.5">&times;</button>
  `;

  const closeBtn = el.querySelector('button');
  const remove = () => {
    el.classList.remove('translate-x-0');
    el.classList.add('translate-x-full');
    setTimeout(() => el.remove(), 300);
  };
  closeBtn.addEventListener('click', remove);

  host.appendChild(el);

  // Trigger slide-in
  requestAnimationFrame(() => {
    el.classList.remove('translate-x-full');
    el.classList.add('translate-x-0');
  });

  // Auto dismiss
  if (duration > 0) {
    setTimeout(remove, duration);
  }
}

export function toastSuccess(message, title = 'Success') {
  toast(message, { type: 'success', title });
}

export function toastError(message, title = 'Error') {
  toast(message, { type: 'error', title, duration: 6000 });
}

export function toastWarning(message, title = 'Warning') {
  toast(message, { type: 'warning', title });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
