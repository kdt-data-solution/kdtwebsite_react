import '../styles/style.css';
import { apiFetch, apiUpload, fetchMe, logout, isAuthenticated, API_BASE } from '../utils/auth.js';
import { showAlert, showConfirm } from '../utils/modal.js';
import { toastSuccess, toastError } from '../utils/toast.js';

const LOGIN_URL = `${import.meta.env.BASE_URL}login.html`;

if (!isAuthenticated()) {
  window.location.href = LOGIN_URL;
}

const userLabel = document.getElementById('admin-user');
const logoutBtn = document.getElementById('logout-btn');
const refreshBtn = document.getElementById('refresh-btn');
const pageTitle = document.getElementById('page-title');
const navLinks = document.querySelectorAll('.nav-link');
const navMsgCount = document.getElementById('nav-msg-count');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');

const statTotal = document.getElementById('stat-total');
const statLatest = document.getElementById('stat-latest');
const statPortfolio = document.getElementById('stat-portfolio');
const statMedia = document.getElementById('stat-media');
const table = document.getElementById('messages-table');
const tbody = document.getElementById('messages-body');
const msgStatus = document.getElementById('messages-status');

logoutBtn.addEventListener('click', async () => {
  const ok = await showConfirm('Are you sure you want to sign out?', {
    title: 'Sign out',
    confirmText: 'Sign out',
    variant: 'info',
  });
  if (ok) logout();
});
refreshBtn.addEventListener('click', loadAll);

// Sidebar toggle (mobile)
function openSidebar() {
  sidebar.classList.remove('-translate-x-full');
  sidebarBackdrop.classList.remove('hidden');
}
function closeSidebar() {
  sidebar.classList.add('-translate-x-full');
  sidebarBackdrop.classList.add('hidden');
}
sidebarToggle.addEventListener('click', () => {
  if (sidebar.classList.contains('-translate-x-full')) openSidebar();
  else closeSidebar();
});
sidebarBackdrop.addEventListener('click', closeSidebar);

// View switching
const VIEW_TITLES = { dashboard: 'Dashboard', messages: 'Messages', portfolio: 'Portfolio', media: 'Media', settings: 'Settings' };

function showView(view) {
  document.querySelectorAll('.view').forEach((el) => el.classList.add('hidden'));
  document.getElementById(`view-${view}`)?.classList.remove('hidden');
  pageTitle.textContent = VIEW_TITLES[view] || 'Dashboard';
  navLinks.forEach((link) => {
    const active = link.dataset.view === view;
    link.classList.toggle('bg-background/10', active);
    link.classList.toggle('text-white', active);
  });
  if (window.innerWidth < 1024) closeSidebar();
}

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const view = link.dataset.view;
    history.replaceState(null, '', `#${view}`);
    showView(view);
  });
});

document.querySelector('.view-all-messages')?.addEventListener('click', (e) => {
  e.preventDefault();
  history.replaceState(null, '', '#messages');
  showView('messages');
});

const initialView = (location.hash || '#dashboard').slice(1);
showView(VIEW_TITLES[initialView] ? initialView : 'dashboard');

// Helpers
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function formatDate(s) {
  if (!s) return '';
  const d = new Date(s.replace(' ', 'T') + 'Z');
  return isNaN(d) ? s : d.toLocaleString();
}

// Convert any stored date string to YYYY-MM-DD for <input type="date">.
function toIsoDate(s) {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d)) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function loadMe() {
  try {
    const { user } = await fetchMe();
    if (user.role !== 'admin') {
      await showAlert('This account is not an admin.', { variant: 'error', title: 'Access denied' });
      logout();
      return null;
    }
    if (userLabel) userLabel.textContent = `${user.name || user.email}`;
    return user;
  } catch {
    logout();
    return null;
  }
}

let dashMsgView = 'list';

function renderDashMessages() {
  const container = document.getElementById('dashboard-messages');
  const recent = window.__recentMessages || [];
  if (!container) return;

  if (recent.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-500">No messages yet.</p>';
    return;
  }

  if (dashMsgView === 'grid') {
    container.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${recent.map((m, i) => `
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 hover:shadow-sm transition dash-msg flex flex-col" data-idx="${i}">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center text-xs font-bold flex-shrink-0">${escapeHtml((m.name || '?')[0].toUpperCase())}</div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">${escapeHtml(m.name)}</p>
            <p class="text-[10px] text-gray-400 truncate">${escapeHtml(m.email)}</p>
          </div>
        </div>
        <p class="text-xs text-gray-700 line-clamp-3 flex-grow">${escapeHtml(m.message)}</p>
        <p class="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-200">${formatDate(m.created_at)}</p>
      </div>
    `).join('')}</div>`;
  } else {
    container.innerHTML = `<div class="divide-y divide-gray-100">${recent.map((m, i) => `
      <div class="px-2 py-3 hover:bg-gray-50 flex items-start gap-3 cursor-pointer dash-msg rounded-md" data-idx="${i}">
        <div class="w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">${escapeHtml((m.name || '?')[0].toUpperCase())}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-medium text-gray-900 truncate">${escapeHtml(m.name)}</p>
            <span class="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">${formatDate(m.created_at)}</span>
          </div>
          <p class="text-xs text-gray-500 truncate">${escapeHtml(m.email)}</p>
          <p class="text-xs text-gray-600 mt-1 line-clamp-2">${escapeHtml(m.message)}</p>
        </div>
      </div>
    `).join('')}</div>`;
  }

  container.querySelectorAll('.dash-msg').forEach(el => {
    el.addEventListener('click', () => {
      const m = recent[el.dataset.idx];
      if (m) openMessageModal(m);
    });
  });
}

function setMsgView(view) {
  dashMsgView = view;
  document.querySelectorAll('.msg-view-btn').forEach(b => {
    b.classList.remove('bg-foreground', 'text-white');
    b.classList.add('text-gray-500', 'hover:text-black');
    const img = b.querySelector('img');
    if (img) img.classList.add('invert');
  });
  const active = document.getElementById(`msg-view-${view}`);
  if (active) {
    active.classList.add('bg-foreground', 'text-white');
    active.classList.remove('text-gray-500', 'hover:text-black');
    const img = active.querySelector('img');
    if (img) img.classList.remove('invert');
  }
  renderDashMessages();
}

document.getElementById('msg-view-list')?.addEventListener('click', () => setMsgView('list'));
document.getElementById('msg-view-grid')?.addEventListener('click', () => setMsgView('grid'));

function openMessageModal(m) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 px-4';
  overlay.innerHTML = `
    <div class="bg-background rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900">Message Details</h3>
        <button data-close class="text-gray-500 hover:text-black text-xl leading-none">&times;</button>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-foreground text-white flex items-center justify-center text-sm font-bold flex-shrink-0">${escapeHtml((m.name || '?')[0].toUpperCase())}</div>
          <div>
            <p class="text-sm font-semibold text-gray-900">${escapeHtml(m.name)}</p>
            <a href="mailto:${escapeHtml(m.email)}" class="text-xs text-gray-500 hover:underline">${escapeHtml(m.email)}</a>
          </div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
          <p class="text-xs text-gray-500 mb-1">Received: ${formatDate(m.created_at)}</p>
          <p class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">${escapeHtml(m.message)}</p>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <a href="mailto:${escapeHtml(m.email)}?subject=Re: Message from ${encodeURIComponent(m.name)}" class="bg-foreground text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-2xl transition">Reply via Email</a>
          <button data-close class="px-4 py-2 text-sm text-gray-700 hover:text-black">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => overlay.remove()));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
  });
}

async function loadHealth() {
  try {
    const [portfolio, articles] = await Promise.all([
      apiFetch('/api/portfolio'),
      apiFetch('/api/articles'),
    ]);
    statPortfolio.textContent = portfolio.length;
    statMedia.textContent = articles.length;
  } catch {
    statPortfolio.textContent = '0';
    statMedia.textContent = '0';
  }
}

async function loadMessages() {
  msgStatus.textContent = 'Loading...';
  msgStatus.classList.remove('hidden');
  table.classList.add('hidden');
  try {
    const messages = await apiFetch('/api/contact', { auth: true });
    statTotal.textContent = messages.length;
    statLatest.textContent = messages[0] ? formatDate(messages[0].created_at) : 'No messages yet';

    if (messages.length > 0) {
      navMsgCount.textContent = messages.length;
      navMsgCount.classList.remove('hidden');
    } else {
      navMsgCount.classList.add('hidden');
    }

    // Dashboard preview
    const dashMsgs = document.getElementById('dashboard-messages');
    if (dashMsgs) {
      window.__recentMessages = messages.slice(0, 8);
      renderDashMessages();
    }

    if (messages.length === 0) {
      msgStatus.textContent = 'No messages yet.';
      return;
    }

    tbody.innerHTML = messages.map((m) => `
      <tr class="hover:bg-gray-50">
        <td class="px-5 py-3 text-gray-500">#${m.id}</td>
        <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(m.name)}</td>
        <td class="px-5 py-3 text-gray-700"><a class="hover:underline" href="mailto:${escapeHtml(m.email)}">${escapeHtml(m.email)}</a></td>
        <td class="px-5 py-3 text-gray-700 max-w-md"><div class="line-clamp-2 whitespace-pre-wrap">${escapeHtml(m.message)}</div></td>
        <td class="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">${formatDate(m.created_at)}</td>
        <td class="px-5 py-3 text-right">
          <button data-id="${m.id}" class="delete-btn text-xs text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 w-20 py-1.5 rounded-md font-medium transition">Delete</button>
        </td>
      </tr>
    `).join('');

    msgStatus.classList.add('hidden');
    table.classList.remove('hidden');

    tbody.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const ok = await showConfirm(`Delete message #${btn.dataset.id}? This cannot be undone.`, {
          title: 'Delete message',
          confirmText: 'Delete',
          variant: 'error',
        });
        if (!ok) return;
        try {
          await apiFetch(`/api/contact/${btn.dataset.id}`, { method: 'DELETE', auth: true });
          toastSuccess('Message deleted.');
          await loadMessages();
        } catch (err) {
          toastError(err.message);
        }
      });
    });
  } catch (err) {
    msgStatus.textContent = `Failed to load messages: ${err.message}`;
  }
}

async function loadAll() {
  await Promise.all([loadHealth(), loadMessages(), loadPortfolio(), loadArticles()]);
}

// ---------- Portfolio CRUD ----------
const CATEGORIES = [
  { value: 'architecture', label: 'Architecture & Engineering' },
  { value: 'data', label: 'Data Science & Analytics' },
  { value: 'software', label: 'Software Development' },
];

function imgUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

let allPortfolio = [];
let portfolioView = 'list';

async function loadPortfolio() {
  const status = document.getElementById('portfolio-status');
  const list = document.getElementById('portfolio-list');
  if (!status || !list) return;
  status.textContent = 'Loading...';
  status.classList.remove('hidden');
  list.innerHTML = '';
  try {
    allPortfolio = await apiFetch('/api/portfolio');
    if (allPortfolio.length === 0) {
      status.textContent = 'No projects yet. Click + Add project to create one.';
      return;
    }
    renderPortfolioList();
  } catch (err) {
    status.textContent = `Failed to load: ${err.message}`;
  }
}

let portfolioViewMode = 'list';

function renderPortfolioList() {
  const status = document.getElementById('portfolio-status');
  const list = document.getElementById('portfolio-list');
  const activeBtn = document.querySelector('.portfolio-filter-btn.bg-foreground');
  const filter = activeBtn?.dataset.filter || 'all';
  const filtered = filter === 'all' ? allPortfolio : allPortfolio.filter(p => p.category === filter);

  if (filtered.length === 0) {
    status.textContent = filter === 'all' ? 'No projects yet.' : 'No projects in this category.';
    status.classList.remove('hidden');
    list.innerHTML = '';
    return;
  }
  status.classList.add('hidden');

  if (portfolioViewMode === 'grid') {
    list.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[calc(100vh-280px)] overflow-y-auto';
    list.innerHTML = filtered.map(p => `
      <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition flex flex-col h-full">
        <div class="h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
          ${p.image_url ? `<img src="${imgUrl(p.image_url)}" class="w-full h-full object-cover" alt=""/>` : '<div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>'}
        </div>
        <div class="p-3 flex flex-col flex-grow">
          <p class="font-medium text-sm text-gray-900 truncate">${escapeHtml(p.title)}</p>
          <p class="text-[10px] text-gray-500 mt-1 truncate">${escapeHtml(categoryLabel(p.category))}</p>
          <div class="flex gap-2 mt-auto pt-3">
            <button data-edit="${p.id}" class="flex-1 text-xs text-gray-800 bg-gray-200 hover:bg-gray-300 py-1.5 rounded-md font-medium transition text-center">Edit</button>
            <button data-delete="${p.id}" class="flex-1 text-xs text-white bg-red-600 hover:bg-red-700 py-1.5 rounded-md font-medium transition text-center">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    list.className = 'divide-y divide-gray-100 max-h-[calc(100vh-280px)] overflow-y-auto';
    list.innerHTML = filtered.map(p => `
      <div class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
        <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          ${p.image_url ? `<img src="${imgUrl(p.image_url)}" class="w-full h-full object-cover" alt=""/>` : ''}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm text-gray-900 truncate">${escapeHtml(p.title)}</p>
          <p class="text-xs text-gray-500">${escapeHtml(categoryLabel(p.category))} · /${escapeHtml(p.slug)}</p>
        </div>
        <button data-edit="${p.id}" class="text-xs text-gray-800 bg-gray-200 border border-gray-200 hover:bg-gray-300 hover:border-gray-300 w-20 py-1.5 rounded-md font-medium transition">Edit</button>
        <button data-delete="${p.id}" class="text-xs text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 w-20 py-1.5 rounded-md font-medium transition">Delete</button>
      </div>
    `).join('');
  }

  list.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openPortfolioForm(allPortfolio.find(i => i.id == b.dataset.edit))));
  list.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => deletePortfolio(b.dataset.delete)));
}

function setPortfolioView(view) {
  portfolioViewMode = view;
  document.querySelectorAll('.portfolio-view-btn').forEach(b => {
    b.classList.remove('bg-foreground', 'text-white');
    b.classList.add('text-gray-500', 'hover:text-black');
    const img = b.querySelector('img');
    if (img) img.classList.add('invert');
  });
  const active = document.getElementById(`portfolio-view-${view}`);
  if (active) {
    active.classList.add('bg-foreground', 'text-white');
    active.classList.remove('text-gray-500', 'hover:text-black');
    const img = active.querySelector('img');
    if (img) img.classList.remove('invert');
  }
  renderPortfolioList();
}

document.getElementById('portfolio-view-list')?.addEventListener('click', () => setPortfolioView('list'));
document.getElementById('portfolio-view-grid')?.addEventListener('click', () => setPortfolioView('grid'));

document.querySelectorAll('.portfolio-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.portfolio-filter-btn').forEach(b => {
      b.classList.remove('bg-foreground', 'text-white');
      b.classList.add('text-gray-700', 'border', 'border-gray-200', 'hover:bg-gray-100');
    });
    btn.classList.add('bg-foreground', 'text-white');
    btn.classList.remove('text-gray-700', 'border', 'border-gray-200', 'hover:bg-gray-100');
    renderPortfolioList();
  });
});

function categoryLabel(key) {
  return CATEGORIES.find(c => c.value === key)?.label || key;
}

async function deletePortfolio(id) {
  const ok = await showConfirm('Delete this project? This cannot be undone.', {
    title: 'Delete project', confirmText: 'Delete', variant: 'error',
  });
  if (!ok) return;
  try {
    await apiFetch(`/api/portfolio/${id}`, { method: 'DELETE', auth: true });
    toastSuccess('Project deleted.');
    await loadPortfolio();
  } catch (err) {
    toastError(err.message);
  }
}

function openPortfolioForm(item = null) {
  const isEdit = !!item;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] flex items-start justify-center bg-foreground/50 px-4 py-10 overflow-y-auto';
  overlay.innerHTML = `
    <div class="bg-background rounded-lg shadow-xl w-full max-w-lg">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900">${isEdit ? 'Edit project' : 'Add project'}</h3>
        <button data-close class="text-gray-500 hover:text-black text-xl leading-none">&times;</button>
      </div>
      <form id="portfolio-form" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(item?.title || '')}" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select name="category" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black">
            ${CATEGORIES.map(c => `<option value="${c.value}" ${item?.category === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date</label>
          <input name="date" type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(toIsoDate(item?.date) || '')}" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Tags <span class="text-gray-400">(comma-separated)</span></label>
          <input name="tags" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(item?.tags || '')}" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="4" maxlength="500" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black">${escapeHtml(item?.description || '')}</textarea>
          <p class="text-[10px] text-gray-400 text-right mt-1 char-count" data-max="500"></p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Image ${isEdit ? '<span class="text-gray-400">(leave empty to keep current)</span>' : ''}</label>
          <input name="image" type="file" accept="image/*" class="hidden file-input" />
          <div class="flex items-center gap-2">
            <button type="button" class="choose-file-btn bg-gray-200 text-gray-800 text-xs px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition">Choose a file</button>
            <span class="text-xs text-gray-500 file-label">No file chosen</span>
            <button type="button" class="clear-file-btn text-red-500 hover:text-red-700 hidden" title="Remove file">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
          <div class="file-preview mt-2 hidden">
            <img class="max-h-32 rounded border border-gray-200" />
          </div>
          ${item?.image_url ? `
            <div class="mt-2 flex items-center gap-3">
              <img src="${imgUrl(item.image_url)}" class="max-h-24 rounded border border-gray-200" />
              <button type="button" class="remove-image-btn text-red-500 hover:text-red-700" title="Remove image">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>` : ''}
        </div>
        <p class="text-xs text-red-600 hidden" data-error></p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" data-close class="px-4 py-2 text-sm text-gray-700 hover:text-black">Cancel</button>
          <button type="submit" class="bg-foreground text-white px-5 py-2 rounded-md text-sm font-medium hover:shadow-2xl">${isEdit ? 'Save changes' : 'Create'}</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const counter = ta.parentElement.querySelector('.char-count');
    if (!counter) return;
    const max = ta.getAttribute('maxlength');
    const update = () => { counter.textContent = `${ta.value.length} / ${max}`; };
    ta.addEventListener('input', update);
    update();
  });
  overlay.querySelectorAll('.choose-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      if (input) input.click();
    });
  });
  overlay.querySelectorAll('.file-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const wrapper = inp.parentElement;
      const label = wrapper.querySelector('.file-label');
      const clearBtn = wrapper.querySelector('.clear-file-btn');
      const preview = wrapper.querySelector('.file-preview');
      const previewImg = preview?.querySelector('img');
      if (inp.files[0]) {
        if (label) label.textContent = inp.files[0].name;
        if (clearBtn) clearBtn.classList.remove('hidden');
        if (preview && previewImg) {
          previewImg.src = URL.createObjectURL(inp.files[0]);
          preview.classList.remove('hidden');
        }
      } else {
        if (label) label.textContent = 'No file chosen';
        if (clearBtn) clearBtn.classList.add('hidden');
        if (preview) preview.classList.add('hidden');
      }
    });
  });
  overlay.querySelectorAll('.clear-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      const label = wrapper.querySelector('.file-label');
      const preview = wrapper.querySelector('.file-preview');
      if (input) { input.value = ''; }
      if (label) label.textContent = 'No file chosen';
      btn.classList.add('hidden');
      if (preview) preview.classList.add('hidden');
    });
  });
  overlay.querySelectorAll('.remove-image-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div');
      const form = overlay.querySelector('form');
      let flag = form.querySelector('input[name="remove_image"]');
      if (!flag) {
        flag = document.createElement('input');
        flag.type = 'hidden';
        flag.name = 'remove_image';
        flag.value = 'true';
        form.appendChild(flag);
      }
      wrapper.remove();
    });
  });
  overlay.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => overlay.remove()));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#portfolio-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get('image')?.size) fd.delete('image');
    const errEl = overlay.querySelector('[data-error]');
    errEl.classList.add('hidden');
    try {
      const path = isEdit ? `/api/portfolio/${item.id}` : '/api/portfolio';
      const method = isEdit ? 'PUT' : 'POST';
      await apiUpload(path, fd, method);
      overlay.remove();
      toastSuccess(isEdit ? 'Project updated.' : 'Project created.');
      await loadPortfolio();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  });
}

document.getElementById('portfolio-add-btn')?.addEventListener('click', () => openPortfolioForm());

// ---------- Articles CRUD ----------
let allArticles = [];

async function loadArticles() {
  const status = document.getElementById('article-status');
  const list = document.getElementById('article-list');
  if (!status || !list) return;
  status.textContent = 'Loading...';
  status.classList.remove('hidden');
  list.innerHTML = '';
  try {
    allArticles = await apiFetch('/api/articles');
    if (allArticles.length === 0) {
      status.textContent = 'No articles yet. Click + Add article to create one.';
      return;
    }
    renderArticleList();
  } catch (err) {
    status.textContent = `Failed to load: ${err.message}`;
  }
}

let articleViewMode = 'list';

function renderArticleList() {
  const status = document.getElementById('article-status');
  const list = document.getElementById('article-list');
  const activeBtn = document.querySelector('.article-filter-btn.bg-foreground');
  const filter = activeBtn?.dataset.filter || 'all';
  const filtered = filter === 'all' ? allArticles : allArticles.filter(a => a.category === filter);

  if (filtered.length === 0) {
    status.textContent = filter === 'all' ? 'No articles yet.' : `No articles in this category.`;
    status.classList.remove('hidden');
    list.innerHTML = '';
    return;
  }
  status.classList.add('hidden');

  if (articleViewMode === 'grid') {
    list.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[calc(100vh-280px)] overflow-y-auto';
    list.innerHTML = filtered.map(a => `
      <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition flex flex-col h-full">
        <div class="h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
          ${a.image_url ? `<img src="${imgUrl(a.image_url)}" class="w-full h-full object-cover" alt=""/>` : '<div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>'}
        </div>
        <div class="p-3 flex flex-col flex-grow">
          <p class="font-medium text-sm text-gray-900 line-clamp-2 leading-snug h-[2.5rem]">${escapeHtml(a.title)}</p>
          <p class="text-[10px] text-gray-500 mt-1 truncate">${escapeHtml(categoryLabel(a.category))} · ${escapeHtml(a.author || '—')} · ${escapeHtml(a.date || '')}</p>
          <div class="flex gap-2 mt-auto pt-3">
            <button data-edit="${a.id}" class="flex-1 text-xs text-gray-800 bg-gray-200 hover:bg-gray-300 py-1.5 rounded-md font-medium transition text-center">Edit</button>
            <button data-delete="${a.id}" class="flex-1 text-xs text-white bg-red-600 hover:bg-red-700 py-1.5 rounded-md font-medium transition text-center">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    list.className = 'divide-y divide-gray-100 max-h-[calc(100vh-280px)] overflow-y-auto';
    list.innerHTML = filtered.map(a => `
      <div class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
        <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          ${a.image_url ? `<img src="${imgUrl(a.image_url)}" class="w-full h-full object-cover" alt=""/>` : ''}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm text-gray-900 truncate">${escapeHtml(a.title)}</p>
          <p class="text-xs text-gray-500 truncate">${escapeHtml(categoryLabel(a.category))} · ${escapeHtml(a.author || '—')} · ${escapeHtml(a.date || '')}</p>
        </div>
        <button data-edit="${a.id}" class="text-xs text-gray-800 bg-gray-200 border border-gray-200 hover:bg-gray-300 hover:border-gray-300 w-20 py-1.5 rounded-md font-medium transition">Edit</button>
        <button data-delete="${a.id}" class="text-xs text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 w-20 py-1.5 rounded-md font-medium transition">Delete</button>
      </div>
    `).join('');
  }

  list.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openArticleForm(allArticles.find(i => i.id == b.dataset.edit))));
  list.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => deleteArticle(b.dataset.delete)));
}

function setArticleView(view) {
  articleViewMode = view;
  document.querySelectorAll('.article-view-btn').forEach(b => {
    b.classList.remove('bg-foreground', 'text-white');
    b.classList.add('text-gray-500', 'hover:text-black');
    const img = b.querySelector('img');
    if (img) img.classList.add('invert');
  });
  const active = document.getElementById(`article-view-${view}`);
  if (active) {
    active.classList.add('bg-foreground', 'text-white');
    active.classList.remove('text-gray-500', 'hover:text-black');
    const img = active.querySelector('img');
    if (img) img.classList.remove('invert');
  }
  renderArticleList();
}

document.getElementById('article-view-list')?.addEventListener('click', () => setArticleView('list'));
document.getElementById('article-view-grid')?.addEventListener('click', () => setArticleView('grid'));

document.querySelectorAll('.article-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.article-filter-btn').forEach(b => {
      b.classList.remove('bg-foreground', 'text-white');
      b.classList.add('text-gray-700', 'border', 'border-gray-200', 'hover:bg-gray-100');
    });
    btn.classList.add('bg-foreground', 'text-white');
    btn.classList.remove('text-gray-700', 'border', 'border-gray-200', 'hover:bg-gray-100');
    renderArticleList();
  });
});

async function deleteArticle(id) {
  const ok = await showConfirm('Delete this article? This cannot be undone.', {
    title: 'Delete article', confirmText: 'Delete', variant: 'error',
  });
  if (!ok) return;
  try {
    await apiFetch(`/api/articles/${id}`, { method: 'DELETE', auth: true });
    toastSuccess('Article deleted.');
    await loadArticles();
  } catch (err) {
    toastError(err.message);
  }
}

function openArticleForm(item = null) {
  const isEdit = !!item;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] flex items-start justify-center bg-foreground/50 px-4 py-10 overflow-y-auto';
  overlay.innerHTML = `
    <div class="bg-background rounded-lg shadow-xl w-full max-w-2xl">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900">${isEdit ? 'Edit article' : 'Add article'}</h3>
        <button data-close class="text-gray-500 hover:text-black text-xl leading-none">&times;</button>
      </div>
      <form id="article-form" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(item?.title || '')}" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Author</label>
            <input name="author" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(item?.author || '')}" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <input name="date" type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(toIsoDate(item?.date) || '')}" />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select name="category" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black">
              ${CATEGORIES.map(c => `<option value="${c.value}" ${item?.category === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Tags <span class="text-gray-400">(comma-separated)</span></label>
          <input name="tags" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(item?.tags || '')}" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Body <span class="text-gray-400">(separate paragraphs with a blank line)</span></label>
          <textarea name="body" rows="10" maxlength="5000" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black font-mono">${escapeHtml(item?.body || '')}</textarea>
          <p class="text-[10px] text-gray-400 text-right mt-1 char-count" data-max="5000"></p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Image ${isEdit ? '<span class="text-gray-400">(leave empty to keep current)</span>' : ''}</label>
          <input name="image" type="file" accept="image/*" class="hidden file-input" />
          <div class="flex items-center gap-2">
            <button type="button" class="choose-file-btn bg-gray-200 text-gray-800 text-xs px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition">Choose a file</button>
            <span class="text-xs text-gray-500 file-label">No file chosen</span>
            <button type="button" class="clear-file-btn text-red-500 hover:text-red-700 hidden" title="Remove file">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
          <div class="file-preview mt-2 hidden">
            <img class="max-h-32 rounded border border-gray-200" />
          </div>
          ${item?.image_url ? `
            <div class="mt-2 flex items-center gap-3">
              <img src="${imgUrl(item.image_url)}" class="max-h-24 rounded border border-gray-200" />
              <button type="button" class="remove-image-btn text-red-500 hover:text-red-700" title="Remove image">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>` : ''}
        </div>
        <p class="text-xs text-red-600 hidden" data-error></p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" data-close class="px-4 py-2 text-sm text-gray-700 hover:text-black">Cancel</button>
          <button type="submit" class="bg-foreground text-white px-5 py-2 rounded-md text-sm font-medium hover:shadow-2xl">${isEdit ? 'Save changes' : 'Create'}</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const counter = ta.parentElement.querySelector('.char-count');
    if (!counter) return;
    const max = ta.getAttribute('maxlength');
    const update = () => { counter.textContent = `${ta.value.length} / ${max}`; };
    ta.addEventListener('input', update);
    update();
  });
  overlay.querySelectorAll('.choose-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      if (input) input.click();
    });
  });
  overlay.querySelectorAll('.file-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const wrapper = inp.parentElement;
      const label = wrapper.querySelector('.file-label');
      const clearBtn = wrapper.querySelector('.clear-file-btn');
      const preview = wrapper.querySelector('.file-preview');
      const previewImg = preview?.querySelector('img');
      if (inp.files[0]) {
        if (label) label.textContent = inp.files[0].name;
        if (clearBtn) clearBtn.classList.remove('hidden');
        if (preview && previewImg) {
          previewImg.src = URL.createObjectURL(inp.files[0]);
          preview.classList.remove('hidden');
        }
      } else {
        if (label) label.textContent = 'No file chosen';
        if (clearBtn) clearBtn.classList.add('hidden');
        if (preview) preview.classList.add('hidden');
      }
    });
  });
  overlay.querySelectorAll('.clear-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      const label = wrapper.querySelector('.file-label');
      const preview = wrapper.querySelector('.file-preview');
      if (input) { input.value = ''; }
      if (label) label.textContent = 'No file chosen';
      btn.classList.add('hidden');
      if (preview) preview.classList.add('hidden');
    });
  });
  overlay.querySelectorAll('.remove-image-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div');
      const form = overlay.querySelector('form');
      let flag = form.querySelector('input[name="remove_image"]');
      if (!flag) {
        flag = document.createElement('input');
        flag.type = 'hidden';
        flag.name = 'remove_image';
        flag.value = 'true';
        form.appendChild(flag);
      }
      wrapper.remove();
    });
  });
  overlay.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => overlay.remove()));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#article-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get('image')?.size) fd.delete('image');
    const errEl = overlay.querySelector('[data-error]');
    errEl.classList.add('hidden');
    try {
      const path = isEdit ? `/api/articles/${item.id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';
      await apiUpload(path, fd, method);
      overlay.remove();
      toastSuccess(isEdit ? 'Article updated.' : 'Article created.');
      await loadArticles();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  });
}

document.getElementById('article-add-btn')?.addEventListener('click', () => openArticleForm());

// ---------- Services CRUD ----------
async function loadServices() {
  const status = document.getElementById('service-status');
  const list = document.getElementById('service-list');
  if (!status || !list) return;
  status.textContent = 'Loading...';
  status.classList.remove('hidden');
  list.innerHTML = '';
  try {
    const items = await apiFetch('/api/services');
    if (!items.length) {
      status.textContent = 'No services yet.';
      return;
    }
    status.classList.add('hidden');
    list.innerHTML = items.map(s => `
      <div class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm text-gray-900 truncate">${escapeHtml(s.title.replace(/<[^>]+>/g, ' ').trim())}</p>
          <p class="text-xs text-gray-500">/${escapeHtml(s.slug)} · ${s.offerings.length} offerings</p>
        </div>
        <button data-edit="${s.id}" class="text-xs text-gray-800 bg-gray-200 border border-gray-200 hover:bg-gray-300 hover:border-gray-300 w-20 py-1.5 rounded-md font-medium transition">Edit</button>
        <button data-delete="${s.id}" class="text-xs text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 w-20 py-1.5 rounded-md font-medium transition">Delete</button>
      </div>
    `).join('');
    list.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openServiceForm(items.find(i => i.id == b.dataset.edit))));
    list.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => deleteService(b.dataset.delete)));
  } catch (err) {
    status.textContent = `Failed to load: ${err.message}`;
  }
}

async function deleteService(id) {
  const ok = await showConfirm('Delete this service? This cannot be undone.', { title: 'Delete service', confirmText: 'Delete', variant: 'error' });
  if (!ok) return;
  try {
    await apiFetch(`/api/services/${id}`, { method: 'DELETE', auth: true });
    await loadServices();
  } catch (err) {
    toastError(err.message);
  }
}

function openServiceForm(item = null) {
  const isEdit = !!item;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] flex items-start justify-center bg-foreground/50 px-4 py-10 overflow-y-auto';
  overlay.innerHTML = `
    <div class="bg-background rounded-lg shadow-xl w-full max-w-2xl">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900">${isEdit ? 'Edit service' : 'Add service'}</h3>
        <button data-close class="text-gray-500 hover:text-black text-xl leading-none">&times;</button>
      </div>
      <form id="service-form" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Title * <span class="text-gray-400">(use &lt;br/&gt; to break lines)</span></label>
          <input name="title" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(item?.title || '')}" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Slug ${isEdit ? '<span class="text-gray-400">(leave empty to keep current)</span>' : '<span class="text-gray-400">(auto if blank)</span>'}</label>
          <input name="slug" placeholder="${escapeHtml(item?.slug || 'e.g. architecture')}" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="3" maxlength="500" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black">${escapeHtml(item?.description || '')}</textarea>
          <p class="text-[10px] text-gray-400 text-right mt-1 char-count" data-max="500"></p>
        </div>
        <p class="text-xs text-red-600 hidden" data-error></p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" data-close class="px-4 py-2 text-sm text-gray-700 hover:text-black">Cancel</button>
          <button type="submit" class="bg-foreground text-white px-5 py-2 rounded-md text-sm font-medium hover:shadow-2xl">${isEdit ? 'Save changes' : 'Create'}</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const counter = ta.parentElement.querySelector('.char-count');
    if (!counter) return;
    const max = ta.getAttribute('maxlength');
    const update = () => { counter.textContent = `${ta.value.length} / ${max}`; };
    ta.addEventListener('input', update);
    update();
  });
  overlay.querySelectorAll('.choose-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      if (input) input.click();
    });
  });
  overlay.querySelectorAll('.file-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const wrapper = inp.parentElement;
      const label = wrapper.querySelector('.file-label');
      const clearBtn = wrapper.querySelector('.clear-file-btn');
      const preview = wrapper.querySelector('.file-preview');
      const previewImg = preview?.querySelector('img');
      if (inp.files[0]) {
        if (label) label.textContent = inp.files[0].name;
        if (clearBtn) clearBtn.classList.remove('hidden');
        if (preview && previewImg) {
          previewImg.src = URL.createObjectURL(inp.files[0]);
          preview.classList.remove('hidden');
        }
      } else {
        if (label) label.textContent = 'No file chosen';
        if (clearBtn) clearBtn.classList.add('hidden');
        if (preview) preview.classList.add('hidden');
      }
    });
  });
  overlay.querySelectorAll('.clear-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      const label = wrapper.querySelector('.file-label');
      const preview = wrapper.querySelector('.file-preview');
      if (input) { input.value = ''; }
      if (label) label.textContent = 'No file chosen';
      btn.classList.add('hidden');
      if (preview) preview.classList.add('hidden');
    });
  });
  overlay.querySelectorAll('.remove-image-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div');
      const form = overlay.querySelector('form');
      let flag = form.querySelector('input[name="remove_image"]');
      if (!flag) {
        flag = document.createElement('input');
        flag.type = 'hidden';
        flag.name = 'remove_image';
        flag.value = 'true';
        form.appendChild(flag);
      }
      wrapper.remove();
    });
  });
  overlay.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => overlay.remove()));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = overlay.querySelector('[data-error]');
    errEl.classList.add('hidden');
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get('title'),
      description: fd.get('description'),
    };
    if (fd.get('slug')) payload.slug = fd.get('slug');
    try {
      const path = isEdit ? `/api/services/${item.id}` : '/api/services';
      const method = isEdit ? 'PUT' : 'POST';
      await apiFetch(path, { method, body: payload, auth: true });
      overlay.remove();
      toastSuccess(isEdit ? 'Service updated.' : 'Service created.');
      await loadServices();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  });
}

document.getElementById('service-add-btn')?.addEventListener('click', () => openServiceForm());

// ---------- Products CRUD ----------
async function loadProducts() {
  const status = document.getElementById('product-status');
  const list = document.getElementById('product-list');
  if (!status || !list) return;
  status.textContent = 'Loading...';
  status.classList.remove('hidden');
  list.innerHTML = '';
  try {
    const items = await apiFetch('/api/products');
    if (!items.length) {
      status.textContent = 'No products yet.';
      return;
    }
    status.classList.add('hidden');
    list.innerHTML = items.map(p => `
      <div class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
        <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          ${p.image_url ? `<img src="${imgUrl(p.image_url)}" class="w-full h-full object-cover" alt=""/>` : ''}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm text-gray-900 truncate">${escapeHtml(p.title)}${p.coming_soon ? ' <span class="text-[10px] text-gray-500">(coming soon)</span>' : ''}</p>
          <p class="text-xs text-gray-500">/${escapeHtml(p.slug)} · ${p.actions.length} actions · ${p.benefits.length} benefits</p>
        </div>
        <button data-edit="${p.id}" class="text-xs text-gray-800 bg-gray-200 border border-gray-200 hover:bg-gray-300 hover:border-gray-300 w-20 py-1.5 rounded-md font-medium transition">Edit</button>
        <button data-delete="${p.id}" class="text-xs text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 w-20 py-1.5 rounded-md font-medium transition">Delete</button>
      </div>
    `).join('');
    list.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openProductForm(items.find(i => i.id == b.dataset.edit))));
    list.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => deleteProduct(b.dataset.delete)));
  } catch (err) {
    status.textContent = `Failed to load: ${err.message}`;
  }
}

async function deleteProduct(id) {
  const ok = await showConfirm('Delete this product? This cannot be undone.', { title: 'Delete product', confirmText: 'Delete', variant: 'error' });
  if (!ok) return;
  try {
    await apiFetch(`/api/products/${id}`, { method: 'DELETE', auth: true });
    await loadProducts();
  } catch (err) {
    toastError(err.message);
  }
}

function openProductForm(item = null) {
  const isEdit = !!item;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] flex items-start justify-center bg-foreground/50 px-4 py-10 overflow-y-auto';
  const actionsJson = JSON.stringify(item?.actions || [{ label: 'Request a Demo', href: '#contact' }], null, 2);
  const stepsJson = JSON.stringify(item?.steps || [{ label: 'Step 1', desc: '' }], null, 2);
  const benefitsJson = JSON.stringify(item?.benefits || [{ title: '', icon: 'smile' }], null, 2);

  overlay.innerHTML = `
    <div class="bg-background rounded-lg shadow-xl w-full max-w-3xl">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900">${isEdit ? 'Edit product' : 'Add product'}</h3>
        <button data-close class="text-gray-500 hover:text-black text-xl leading-none">&times;</button>
      </div>
      <form id="product-form" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(item?.title || '')}" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Slug ${isEdit ? '<span class="text-gray-400">(leave empty to keep current)</span>' : '<span class="text-gray-400">(auto if blank)</span>'}</label>
          <input name="slug" placeholder="${escapeHtml(item?.slug || 'e.g. membership')}" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select name="category" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black">
            ${CATEGORIES.map(c => `<option value="${c.value}" ${item?.category === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date</label>
          <input name="date" type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" value="${escapeHtml(toIsoDate(item?.date) || '')}" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="3" maxlength="500" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black">${escapeHtml(item?.description || '')}</textarea>
          <p class="text-[10px] text-gray-400 text-right mt-1 char-count" data-max="500"></p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Features <span class="text-gray-400">(press Enter to add)</span></label>
          <div class="flex flex-wrap gap-2 mb-2" id="product-features-tags">
            ${(item?.features || '').split(',').filter(Boolean).map(f => `
              <span class="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-xs text-gray-800 px-2.5 py-1 rounded-full">
                ${escapeHtml(f.trim())}
                <button type="button" class="remove-tag text-gray-500 hover:text-red-600 text-sm leading-none">&times;</button>
              </span>
            `).join('')}
          </div>
          <input id="product-features-input" type="text" placeholder="e.g. User Registration" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
          <input type="hidden" name="features" value="${escapeHtml(item?.features || '')}" />
        </div>
        <div class="flex items-end">
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="coming_soon" value="true" ${item?.coming_soon ? 'checked' : ''} class="rounded" />
            Coming soon
          </label>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Image ${isEdit ? '<span class="text-gray-400">(leave empty to keep current)</span>' : ''}</label>
          <input name="image" type="file" accept="image/*" class="hidden file-input" />
          <div class="flex items-center gap-2">
            <button type="button" class="choose-file-btn bg-gray-200 text-gray-800 text-xs px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition">Choose a file</button>
            <span class="text-xs text-gray-500 file-label">No file chosen</span>
            <button type="button" class="clear-file-btn text-red-500 hover:text-red-700 hidden" title="Remove file">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
          <div class="file-preview mt-2 hidden">
            <img class="max-h-32 rounded border border-gray-200" />
          </div>
          ${item?.image_url ? `
            <div class="mt-2 flex items-center gap-3">
              <img src="${imgUrl(item.image_url)}" class="max-h-24 rounded border border-gray-200" />
              <button type="button" class="remove-image-btn text-red-500 hover:text-red-700" title="Remove image">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>` : ''}
        </div>
        <p class="text-xs text-red-600 hidden" data-error></p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" data-close class="px-4 py-2 text-sm text-gray-700 hover:text-black">Cancel</button>
          <button type="submit" class="bg-foreground text-white px-5 py-2 rounded-md text-sm font-medium hover:shadow-2xl">${isEdit ? 'Save changes' : 'Create'}</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const counter = ta.parentElement.querySelector('.char-count');
    if (!counter) return;
    const max = ta.getAttribute('maxlength');
    const update = () => { counter.textContent = `${ta.value.length} / ${max}`; };
    ta.addEventListener('input', update);
    update();
  });
  overlay.querySelectorAll('.choose-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      if (input) input.click();
    });
  });
  overlay.querySelectorAll('.file-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const wrapper = inp.parentElement;
      const label = wrapper.querySelector('.file-label');
      const clearBtn = wrapper.querySelector('.clear-file-btn');
      const preview = wrapper.querySelector('.file-preview');
      const previewImg = preview?.querySelector('img');
      if (inp.files[0]) {
        if (label) label.textContent = inp.files[0].name;
        if (clearBtn) clearBtn.classList.remove('hidden');
        if (preview && previewImg) {
          previewImg.src = URL.createObjectURL(inp.files[0]);
          preview.classList.remove('hidden');
        }
      } else {
        if (label) label.textContent = 'No file chosen';
        if (clearBtn) clearBtn.classList.add('hidden');
        if (preview) preview.classList.add('hidden');
      }
    });
  });
  overlay.querySelectorAll('.clear-file-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div').parentElement;
      const input = wrapper.querySelector('.file-input');
      const label = wrapper.querySelector('.file-label');
      const preview = wrapper.querySelector('.file-preview');
      if (input) { input.value = ''; }
      if (label) label.textContent = 'No file chosen';
      btn.classList.add('hidden');
      if (preview) preview.classList.add('hidden');
    });
  });
  overlay.querySelectorAll('.remove-image-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('div');
      const form = overlay.querySelector('form');
      let flag = form.querySelector('input[name="remove_image"]');
      if (!flag) {
        flag = document.createElement('input');
        flag.type = 'hidden';
        flag.name = 'remove_image';
        flag.value = 'true';
        form.appendChild(flag);
      }
      wrapper.remove();
    });
  });
  // Features tag input
  const featuresContainer = overlay.querySelector('#product-features-tags');
  const featuresInput = overlay.querySelector('#product-features-input');
  const featuresHidden = overlay.querySelector('input[name="features"]');
  if (featuresInput && featuresContainer && featuresHidden) {
    function syncFeatures() {
      const tags = [...featuresContainer.querySelectorAll('span')].map(s => s.firstChild.textContent.trim());
      featuresHidden.value = tags.join(',');
    }
    function addTag(text) {
      const t = text.trim();
      if (!t) return;
      const existing = [...featuresContainer.querySelectorAll('span')].map(s => s.firstChild.textContent.trim().toLowerCase());
      if (existing.includes(t.toLowerCase())) return;
      const span = document.createElement('span');
      span.className = 'inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-xs text-gray-800 px-2.5 py-1 rounded-full';
      span.innerHTML = `${escapeHtml(t)}<button type="button" class="remove-tag text-gray-500 hover:text-red-600 text-sm leading-none">&times;</button>`;
      span.querySelector('.remove-tag').addEventListener('click', () => { span.remove(); syncFeatures(); });
      featuresContainer.appendChild(span);
      syncFeatures();
    }
    featuresInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); addTag(featuresInput.value); featuresInput.value = ''; }
    });
    featuresContainer.querySelectorAll('.remove-tag').forEach(btn => {
      btn.addEventListener('click', () => { btn.closest('span').remove(); syncFeatures(); });
    });
  }

  overlay.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => overlay.remove()));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = overlay.querySelector('[data-error]');
    errEl.classList.add('hidden');

    // Validate JSON fields client-side, then re-stringify into the FormData
    const fd = new FormData(e.currentTarget);
    if (fd.has('actions')) {
      try { JSON.parse(fd.get('actions') || '[]'); }
      catch { errEl.textContent = 'actions: invalid JSON'; errEl.classList.remove('hidden'); return; }
    }
    if (!fd.get('image')?.size) fd.delete('image');
    if (!fd.get('coming_soon')) fd.set('coming_soon', 'false');
    if (!fd.get('slug')) fd.delete('slug');

    try {
      const path = isEdit ? `/api/products/${item.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      await apiUpload(path, fd, method);
      overlay.remove();
      toastSuccess(isEdit ? 'Product updated.' : 'Product created.');
      await loadProducts();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  });
}

document.getElementById('product-add-btn')?.addEventListener('click', () => openProductForm());

// ---------- Settings ----------
async function loadSettings() {
  try {
    const data = await apiFetch('/api/settings');
    for (const key of Object.keys(data)) {
      const el = document.getElementById(`set-${key}`);
      if (el) el.value = data[key] || '';
    }
  } catch {}

  try {
    const { user } = await fetchMe();
    const nameEl = document.getElementById('settings-name');
    const emailEl = document.getElementById('settings-email');
    if (nameEl) nameEl.value = user.name || '';
    if (emailEl) emailEl.value = user.email || '';
  } catch {}
}


document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.querySelector('.eye-open').classList.toggle('hidden', !isPassword);
    btn.querySelector('.eye-closed').classList.toggle('hidden', isPassword);
  });
});

document.getElementById('settings-profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  try {
    await apiFetch('/api/auth/profile', {
      method: 'PUT', auth: true,
      body: { name: fd.get('name'), email: fd.get('email') },
    });
    toastSuccess('Profile updated.');
  } catch (err) {
    toastError(err.message);
  }
});

document.getElementById('settings-password-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  try {
    await apiFetch('/api/auth/change-password', {
      method: 'PUT', auth: true,
      body: { current_password: fd.get('current_password'), new_password: fd.get('new_password') },
    });
    e.currentTarget.reset();
    toastSuccess('Password updated.');
  } catch (err) {
    toastError(err.message);
  }
});

document.getElementById('settings-site-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const body = Object.fromEntries(fd.entries());
  try {
    await apiFetch('/api/settings', { method: 'PUT', auth: true, body });
    toastSuccess('Site info saved.');
  } catch (err) {
    toastError(err.message);
  }
});

document.getElementById('test-email-btn')?.addEventListener('click', async () => {
  const input = document.getElementById('test-email-input');
  const email = input?.value?.trim();
  if (!email) { toastError('Enter an email address.'); return; }
  const btn = document.getElementById('test-email-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    const res = await apiFetch('/api/settings/test-email', { method: 'POST', auth: true, body: { email } });
    toastSuccess(res.message || 'Test email sent!');
  } catch (err) {
    toastError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Test';
  }
});

(async function init() {
  const user = await loadMe();
  if (!user) return;
  await loadAll();
  await loadSettings();
})();
