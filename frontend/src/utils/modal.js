// Lightweight promise-based modal replacements for alert() / confirm().
// Renders into a single root element appended to <body>.

let root;

function ensureRoot() {
  if (root) return root;
  root = document.createElement('div');
  root.id = 'modal-root';
  document.body.appendChild(root);
  return root;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function render({ title, message, variant = 'info', confirmText = 'OK', cancelText = null }) {
  return new Promise((resolve) => {
    const host = ensureRoot();

    const accent = {
      info: 'text-gray-900',
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-amber-600',
    }[variant] || 'text-gray-900';

    const confirmClasses =
      variant === 'error' || variant === 'warning'
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-black hover:bg-gray-800 text-white';

    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 animate-[fadeIn_0.15s_ease-out]';
    overlay.innerHTML = `
      <div role="dialog" aria-modal="true" class="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div class="px-6 pt-6 pb-4">
          ${title ? `<h3 class="text-base font-semibold ${accent} mb-2">${escapeHtml(title)}</h3>` : ''}
          <p class="text-sm text-gray-700 whitespace-pre-wrap">${escapeHtml(message)}</p>
        </div>
        <div class="flex justify-end gap-2 bg-gray-50 px-6 py-3 border-t border-gray-200">
          ${cancelText ? `<button data-act="cancel" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black">${escapeHtml(cancelText)}</button>` : ''}
          <button data-act="ok" class="px-4 py-2 text-sm font-medium rounded-md ${confirmClasses}">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    function close(result) {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      resolve(result);
    }
    function onKey(e) {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Enter') close(true);
    }

    overlay.querySelector('[data-act="ok"]').addEventListener('click', () => close(true));
    overlay.querySelector('[data-act="cancel"]')?.addEventListener('click', () => close(false));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });
    document.addEventListener('keydown', onKey);

    host.appendChild(overlay);
    overlay.querySelector('[data-act="ok"]').focus();
  });
}

export function showAlert(message, options = {}) {
  return render({
    title: options.title ?? 'Notice',
    message,
    variant: options.variant ?? 'info',
    confirmText: options.confirmText ?? 'OK',
  });
}

export function showConfirm(message, options = {}) {
  return render({
    title: options.title ?? 'Please confirm',
    message,
    variant: options.variant ?? 'warning',
    confirmText: options.confirmText ?? 'Confirm',
    cancelText: options.cancelText ?? 'Cancel',
  });
}
