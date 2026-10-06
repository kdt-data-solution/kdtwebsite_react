export function setupContactNavigation(win, doc, ready, applyContext) {
  let navigation = 0;

  function cancelPendingNavigation() {
    navigation += 1;
  }

  async function landOnContact({ focus = false, smooth = false } = {}) {
    const current = ++navigation;
    if (win.location.hash !== '#contact') return;
    await ready;
    let fontTimer;
    try {
      await Promise.race([
        doc.fonts?.ready,
        new Promise(resolve => { fontTimer = setTimeout(resolve, 1000); }),
      ]);
    } finally {
      clearTimeout(fontTimer);
    }
    win.requestAnimationFrame(() => {
      if (current !== navigation || win.location.hash !== '#contact') return;
      const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
      doc.getElementById('contact')?.scrollIntoView({ behavior: smooth && !reducedMotion ? 'smooth' : 'instant' });
      if (focus) doc.getElementById('contact-heading')?.focus({ preventScroll: true });
    });
  }

  function restoreContact() {
    applyContext(win.location.search);
    landOnContact();
  }

  doc.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== win.location.origin || url.pathname !== win.location.pathname || url.hash !== '#contact') return;
    event.preventDefault();
    if (url.href !== win.location.href) win.history.pushState(null, '', url);
    applyContext(url.search);
    landOnContact({ focus: true, smooth: true });
  });

  win.addEventListener('popstate', restoreContact);
  win.addEventListener('hashchange', restoreContact);
  win.addEventListener('pageshow', event => {
    if (event.persisted) restoreContact();
  });
  // A visitor who starts interacting during loading keeps control of their position.
  win.addEventListener('wheel', cancelPendingNavigation, { passive: true });
  win.addEventListener('touchstart', cancelPendingNavigation, { passive: true });
  doc.addEventListener('pointerdown', cancelPendingNavigation);
  doc.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Tab'].includes(event.key)) cancelPendingNavigation();
  });
  restoreContact();
}
