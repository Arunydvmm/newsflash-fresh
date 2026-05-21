/* ═══════════════════════════════════════════════
   NEWSFLASH — Frontend App
   All API calls go to backend (no localStorage)
═══════════════════════════════════════════════ */

// ── CONFIG ────────────────────────────────────
// Change this to your deployed backend URL
// You can also update it from Admin → Settings
let API_BASE = localStorage.getItem('nf_api_url') || '';

// ── STATE ─────────────────────────────────────
let allArticles   = [];
let currentPage   = 1;
let currentFilter = 'all';
let currentQuery  = '';
let currentArticleId = null;
let adminToken    = localStorage.getItem('nf_token') || '';
let currentTags   = [];

const CATEGORIES = ['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion'];

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  document.getElementById('top-date').textContent = new Date().toLocaleDateString('en-IN', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
  buildCategoryTags();
  loadArticles();
  handleRoute();
  window.addEventListener('popstate', handleRoute);
});

function handleRoute() {
  const hash = location.hash;
  if (hash.startsWith('#article/')) {
    const id = hash.replace('#article/','');
    openArticle(id);
  } else {
    showHome();
  }
}

// ── API HELPERS ───────────────────────────────
async function apiFetch(path, opts = {}) {
  const url = API_BASE + path;
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ── ARTICLES LOADING ──────────────────────────
async function loadArticles(reset = true) {
  if (reset) { currentPage = 1; allArticles = []; }
  const params = new URLSearchParams({ page: currentPage, limit: 12 });
  if (currentFilter !== 'all') params.set('category', currentFilter);
  if (currentQuery) params.set('q', currentQuery);

  try {
    const data = await apiFetch('/api/articles?' + params);
    if (reset) allArticles = data.articles;
    else allArticles = [...allArticles, ...data.articles];

    renderHero();
    renderGrid();
    renderTicker();
    renderTrending();

    const hasMore = data.total > allArticles.length;
    document.getElementById('load-more-wrap').classList.toggle('hidden', !hasMore);
    document.getElementById('articles-empty').classList.toggle('hidden', allArticles.length > 0);
  } catch (e) {
    if (!API_BASE) {
      showEmptyWithHint();
    } else {
      showToast('Failed to load articles: ' + e.message, 'error');
    }
  }
}

function showEmptyWithHint() {
  const el = document.getElementById('articles-empty');
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="icon">⚙️</div>
    <p>Backend not configured yet.</p>
    <p style="margin-top:8px;font-size:13px;">Go to <b>Admin → Settings → API URL</b> and enter your backend URL, then save.</p>
  `;
}

async function loadMoreArticles() {
  currentPage++;
  await loadArticles(false);
}

// ── RENDER HERO ───────────────────────────────
function renderHero() {
  const published = allArticles.filter(a => a.status === 'published');
  const heroMain  = document.getElementById('hero-main');
  const heroSide  = document.getElementById('hero-side');

  if (!published.length) {
    heroMain.innerHTML = '';
    heroSide.innerHTML = '';
    return;
  }

  const main = published[0];
  heroMain.innerHTML = `
    <img src="${main.featuredImage || ''}" alt="${esc(main.title)}"
         onerror="this.src='';this.style.display='none';this.nextElementSibling.style.display='flex'"
         style="width:100%;height:${window.innerWidth < 768 ? '220px' : '420px'};object-fit:cover;border-radius:6px" />
    <div style="display:none;width:100%;height:${window.innerWidth < 768 ? '220px' : '420px'};background:linear-gradient(135deg,#222,#444);border-radius:6px;align-items:center;justify-content:center;font-size:60px">
      ${main.emoji || '📰'}
    </div>
    <div class="hero-main-overlay">
      <span class="category-tag">${main.category}</span>
      <h2>${esc(main.title)}</h2>
      <p>${esc(main.summary || '')}</p>
    </div>
  `;
  heroMain.onclick = () => openArticle(main._id);

  heroSide.innerHTML = published.slice(1, 4).map(a => `
    <div class="hero-side-card" onclick="openArticle('${a._id}')">
      ${a.featuredImage
        ? `<img src="${a.featuredImage}" alt="${esc(a.title)}" onerror="this.style.display='none'" />`
        : `<div style="width:90px;height:70px;background:linear-gradient(135deg,#eee,#ccc);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">${a.emoji || '📰'}</div>`
      }
      <div class="hero-side-card-body">
        <div class="cat">${a.category}</div>
        <h3>${esc(a.title)}</h3>
        <div class="meta">${timeAgo(a.createdAt)}</div>
      </div>
    </div>
  `).join('');
}

// ── RENDER GRID ───────────────────────────────
function renderGrid() {
  const grid = document.getElementById('articles-grid');
  const articles = currentFilter === 'all'
    ? allArticles.filter(a => a.status === 'published').slice(4)
    : allArticles.filter(a => a.status === 'published');

  if (!articles.length && currentFilter !== 'all') {
    grid.innerHTML = '';
    document.getElementById('articles-empty').classList.remove('hidden');
    return;
  }
  document.getElementById('articles-empty').classList.add('hidden');
  grid.innerHTML = articles.map(a => articleCard(a)).join('');
}

function articleCard(a) {
  return `
    <div class="article-card" onclick="openArticle('${a._id}')">
      ${a.featuredImage
        ? `<img class="article-card-img" src="${a.featuredImage}" alt="${esc(a.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="article-card-img-placeholder" style="display:none">${a.emoji || '📰'}</div>`
        : `<div class="article-card-img-placeholder">${a.emoji || '📰'}</div>`
      }
      <div class="article-card-body">
        <div class="cat">${a.category}</div>
        <h3>${esc(a.title)}</h3>
        <p class="summary">${esc(a.summary || '')}</p>
        <div class="meta">
          <span>${a.author || 'NewsFlash Desk'}</span>
          <span>${timeAgo(a.createdAt)}</span>
        </div>
      </div>
    </div>
  `;
}

// ── TICKER ────────────────────────────────────
function renderTicker() {
  const published = allArticles.filter(a => a.status === 'published').slice(0, 8);
  if (!published.length) return;
  const items = published.map(a =>
    `<span onclick="openArticle('${a._id}')">${esc(a.title)}</span>`
  ).join('');
  const ticker = document.getElementById('ticker-inner');
  ticker.innerHTML = items + items; // doubled for seamless loop
}

// ── TRENDING ──────────────────────────────────
function renderTrending() {
  const list = document.getElementById('trending-list');
  const sorted = [...allArticles]
    .filter(a => a.status === 'published')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
  list.innerHTML = sorted.map((a, i) => `
    <li onclick="openArticle('${a._id}')">
      <div class="trending-num">${i + 1}</div>
      <div>
        <h4>${esc(a.title)}</h4>
        <div class="meta">${a.category} · ${timeAgo(a.createdAt)}</div>
      </div>
    </li>
  `).join('') || '<li style="font-family:var(--font-ui);font-size:13px;color:var(--grey-500);padding:10px 0">No articles yet</li>';
}

function buildCategoryTags() {
  const wrap = document.getElementById('category-tags');
  wrap.innerHTML = CATEGORIES.map(c =>
    `<button class="category-tag-btn" onclick="filterCategory('${c}')">${c}</button>`
  ).join('');
}

// ── OPEN ARTICLE ──────────────────────────────
async function openArticle(id) {
  try {
    const a = await apiFetch('/api/articles/' + id);
    currentArticleId = id;
    location.hash = '#article/' + id;

    document.getElementById('article-category-label').textContent = a.category;
    document.getElementById('article-title').textContent = a.title;
    document.getElementById('author-avatar').textContent = a.authorInitials || (a.author || 'NF').slice(0,2).toUpperCase();
    document.getElementById('author-name').textContent = a.author || 'NewsFlash Desk';
    document.getElementById('article-date').textContent = new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    document.getElementById('article-body').innerHTML = a.body || '';

    const img = document.getElementById('article-hero-img');
    const cap = document.getElementById('article-img-caption');
    if (a.featuredImage) {
      img.src = a.featuredImage;
      img.classList.remove('hidden');
      if (a.imageCaption) { cap.textContent = a.imageCaption; cap.classList.remove('hidden'); }
      else cap.classList.add('hidden');
    } else { img.classList.add('hidden'); cap.classList.add('hidden'); }

    const hlBox  = document.getElementById('article-highlights');
    const hlList = document.getElementById('highlights-list');
    if (a.highlights && a.highlights.length) {
      hlList.innerHTML = a.highlights.map(h => `<li>${esc(h)}</li>`).join('');
      hlBox.classList.remove('hidden');
    } else { hlBox.classList.add('hidden'); }

    const srcBox  = document.getElementById('article-sources');
    const srcList = document.getElementById('sources-list');
    if (a.sources && a.sources.length) {
      srcList.innerHTML = a.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener" style="color:var(--accent)">${esc(s.label || s.url)}</a></li>`).join('');
      srcBox.classList.remove('hidden');
    } else { srcBox.classList.add('hidden'); }

    document.getElementById('home-page').classList.add('hidden');
    const ap = document.getElementById('article-page');
    ap.style.display = 'block';
    window.scrollTo(0, 0);
  } catch (e) {
    showToast('Could not load article', 'error');
  }
}

// ── SHOW HOME ─────────────────────────────────
function showHome() {
  location.hash = '';
  document.getElementById('home-page').classList.remove('hidden');
  document.getElementById('article-page').style.display = 'none';
  window.scrollTo(0, 0);
}

// ── FILTER ────────────────────────────────────
function filterCategory(cat) {
  currentFilter = cat;
  currentQuery  = '';
  document.querySelectorAll('#nav-links a').forEach(a => a.classList.remove('active'));
  const navMap = { all:'Home', India:'India', World:'World', Business:'Business', Technology:'Tech', Sports:'Sports', Science:'Science', Entertainment:'Entertainment', Health:'Health' };
  document.querySelectorAll('#nav-links a').forEach(a => {
    if (a.textContent.trim() === (navMap[cat] || cat)) a.classList.add('active');
  });
  document.getElementById('section-label').textContent = cat === 'all' ? 'Latest News' : cat;
  showHome();
  loadArticles();
}

// ── SEARCH ────────────────────────────────────
function handleSearch(e) {
  e.preventDefault();
  currentQuery  = document.getElementById('search-input').value.trim();
  currentFilter = 'all';
  document.getElementById('section-label').textContent = `Results for "${currentQuery}"`;
  showHome();
  loadArticles();
}

// ── SHARE ─────────────────────────────────────
function shareArticle(platform) {
  const url   = encodeURIComponent(location.href);
  const title = encodeURIComponent(document.getElementById('article-title').textContent);
  const links = {
    whatsapp: `https://wa.me/?text=${title}%20${url}`,
    twitter:  `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  };
  window.open(links[platform], '_blank');
}

// ── ADMIN ─────────────────────────────────────
function openAdmin() {
  document.getElementById('admin-overlay').classList.add('active');
  if (adminToken) {
    showAdminPanel();
  } else {
    document.getElementById('admin-login').style.display = 'flex';
    document.getElementById('admin-panel').classList.remove('active');
  }
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('active');
}

document.getElementById('admin-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('admin-overlay')) closeAdmin();
});

async function doLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errEl    = document.getElementById('login-error');
  errEl.classList.add('hidden');

  if (!username || !password) { errEl.textContent = 'Please enter credentials.'; errEl.classList.remove('hidden'); return; }

  try {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    adminToken = data.token;
    localStorage.setItem('nf_token', adminToken);
    showAdminPanel();
  } catch (e) {
    errEl.textContent = 'Invalid credentials.';
    errEl.classList.remove('hidden');
  }
}

function doLogout() {
  adminToken = '';
  localStorage.removeItem('nf_token');
  document.getElementById('admin-panel').classList.remove('active');
  document.getElementById('admin-login').style.display = 'flex';
  closeAdmin();
}

async function showAdminPanel() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').classList.add('active');
  await loadAdminStats();
  await loadAdminArticles();
}

function showAdminSection(name, el) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-link').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  if (el) el.classList.add('active');

  if (name === 'articles') loadAdminArticles();
  if (name === 'dashboard') loadAdminStats();
  if (name === 'new-article') resetForm();
}

async function loadAdminStats() {
  try {
    const s = await apiFetch('/api/admin/stats');
    document.getElementById('stat-total').textContent     = s.total;
    document.getElementById('stat-published').textContent = s.published;
    document.getElementById('stat-drafts').textContent    = s.drafts;
    document.getElementById('stat-views').textContent     = s.views.toLocaleString();

    // Recent list
    const recents = await apiFetch('/api/admin/articles');
    document.getElementById('recent-articles-list').innerHTML = recents.slice(0, 5).map(a => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--grey-100);font-family:var(--font-ui);font-size:13px">
        <div>
          <div style="font-weight:600">${esc(a.title)}</div>
          <div style="color:var(--grey-500);font-size:11px">${a.category} · ${timeAgo(a.createdAt)}</div>
        </div>
        <span class="status-badge ${a.status}">${a.status}</span>
      </div>
    `).join('');
  } catch(e) { /* silent */ }
}

async function loadAdminArticles() {
  const tbody = document.getElementById('admin-articles-tbody');
  tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;font-family:var(--font-ui)"><div class="spinner"></div></td></tr>';
  try {
    const articles = await apiFetch('/api/admin/articles');
    if (!articles.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;font-family:var(--font-ui);color:var(--grey-500)">No articles yet. Create your first one!</td></tr>';
      return;
    }
    tbody.innerHTML = articles.map(a => `
      <tr>
        <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(a.title)}</td>
        <td>${a.category}</td>
        <td><span class="status-badge ${a.status}">${a.status}</span></td>
        <td>
          <button class="action-btn edit" onclick="editArticle('${a._id}')">Edit</button>
          <button class="action-btn delete" onclick="deleteArticle('${a._id}','${esc(a.title)}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:24px;font-family:var(--font-ui);color:var(--red)">${e.message}</td></tr>`;
  }
}

// ── IMAGE UPLOAD ──────────────────────────────
async function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const progress = document.getElementById('upload-progress');
  const preview  = document.getElementById('f-image-preview');
  const prompt   = document.getElementById('upload-prompt');

  progress.textContent = 'Uploading…';
  progress.classList.remove('hidden');
  prompt.style.display = 'none';

  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(API_BASE + '/api/upload', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + adminToken },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    document.getElementById('f-image-url').value = data.url;
    preview.src = data.url;
    preview.style.display = 'block';
    progress.textContent = '✅ Uploaded!';
    showToast('Image uploaded!', 'success');
  } catch(e) {
    progress.textContent = '❌ Upload failed: ' + e.message;
    showToast('Image upload failed', 'error');
  }
}

// ── TAGS ──────────────────────────────────────
function handleTagInput(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,/g,'');
    if (val && !currentTags.includes(val)) {
      currentTags.push(val);
      renderTags();
    }
    e.target.value = '';
  }
}

function removeTag(tag) {
  currentTags = currentTags.filter(t => t !== tag);
  renderTags();
}

function renderTags() {
  const wrap = document.getElementById('tags-wrap');
  const input = wrap.querySelector('input');
  wrap.querySelectorAll('.tag-chip').forEach(el => el.remove());
  currentTags.forEach(tag => {
    const chip = document.createElement('div');
    chip.className = 'tag-chip';
    chip.innerHTML = `${esc(tag)}<button onclick="removeTag('${esc(tag)}')" type="button">×</button>`;
    wrap.insertBefore(chip, input);
  });
  document.getElementById('f-tags').value = JSON.stringify(currentTags);
}

// ── RICH TEXT ─────────────────────────────────
function fmt(cmd, val) {
  document.getElementById('article-body-editor').focus();
  document.execCommand(cmd, false, val);
}

// ── ARTICLE FORM ──────────────────────────────
function resetForm() {
  document.getElementById('form-title').textContent = 'New Article';
  document.getElementById('edit-article-id').value = '';
  document.getElementById('f-title').value = '';
  document.getElementById('f-category').value = 'India';
  document.getElementById('f-status').value = 'draft';
  document.getElementById('f-author').value = '';
  document.getElementById('f-initials').value = '';
  document.getElementById('f-summary').value = '';
  document.getElementById('f-image-url').value = '';
  document.getElementById('f-image-caption').value = '';
  document.getElementById('f-image-preview').style.display = 'none';
  document.getElementById('upload-prompt').style.display = 'block';
  document.getElementById('upload-progress').classList.add('hidden');
  document.getElementById('article-body-editor').innerHTML = '';
  document.getElementById('f-highlights').value = '';
  document.getElementById('f-video-url').value = '';
  document.getElementById('f-video-title').value = '';
  document.getElementById('f-emoji').value = '';
  currentTags = [];
  renderTags();
}

async function editArticle(id) {
  try {
    const a = await apiFetch('/api/articles/' + id);
    document.getElementById('form-title').textContent = 'Edit Article';
    document.getElementById('edit-article-id').value  = a._id;
    document.getElementById('f-title').value           = a.title || '';
    document.getElementById('f-category').value        = a.category || 'India';
    document.getElementById('f-status').value          = a.status || 'draft';
    document.getElementById('f-author').value          = a.author || '';
    document.getElementById('f-initials').value        = a.authorInitials || '';
    document.getElementById('f-summary').value         = a.summary || '';
    document.getElementById('f-image-url').value       = a.featuredImage || '';
    document.getElementById('f-image-caption').value   = a.imageCaption || '';
    document.getElementById('f-highlights').value      = (a.highlights || []).join('\n');
    document.getElementById('f-video-url').value       = a.videoUrl || '';
    document.getElementById('f-video-title').value     = a.videoTitle || '';
    document.getElementById('f-emoji').value           = a.emoji || '';
    document.getElementById('article-body-editor').innerHTML = a.body || '';

    if (a.featuredImage) {
      const prev = document.getElementById('f-image-preview');
      prev.src = a.featuredImage;
      prev.style.display = 'block';
      document.getElementById('upload-prompt').style.display = 'none';
    }

    currentTags = a.tags || [];
    renderTags();

    showAdminSection('new-article');
  } catch(e) {
    showToast('Failed to load article', 'error');
  }
}

async function saveArticle() {
  const id    = document.getElementById('edit-article-id').value;
  const title = document.getElementById('f-title').value.trim();
  const body  = document.getElementById('article-body-editor').innerHTML.trim();

  if (!title) { showToast('Please enter a headline', 'error'); return; }
  if (!body || body === '<br>') { showToast('Article body is required', 'error'); return; }

  const payload = {
    title,
    category:      document.getElementById('f-category').value,
    status:        document.getElementById('f-status').value,
    author:        document.getElementById('f-author').value.trim(),
    authorInitials: document.getElementById('f-initials').value.trim(),
    summary:       document.getElementById('f-summary').value.trim(),
    featuredImage: document.getElementById('f-image-url').value,
    imageCaption:  document.getElementById('f-image-caption').value.trim(),
    body,
    highlights:    document.getElementById('f-highlights').value.split('\n').map(h => h.trim()).filter(Boolean),
    tags:          currentTags,
    videoUrl:      document.getElementById('f-video-url').value.trim(),
    videoTitle:    document.getElementById('f-video-title').value.trim(),
    emoji:         document.getElementById('f-emoji').value.trim(),
  };

  try {
    if (id) {
      await apiFetch('/api/articles/' + id, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Article updated!', 'success');
    } else {
      await apiFetch('/api/articles', { method: 'POST', body: JSON.stringify(payload) });
      showToast('Article published!', 'success');
    }
    resetForm();
    showAdminSection('articles');
    loadArticles();
  } catch(e) {
    showToast('Save failed: ' + e.message, 'error');
  }
}

function cancelForm() {
  resetForm();
  showAdminSection('articles');
}

async function deleteArticle(id, title) {
  if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
  try {
    await apiFetch('/api/articles/' + id, { method: 'DELETE' });
    showToast('Article deleted', 'success');
    loadAdminArticles();
    loadArticles();
  } catch(e) {
    showToast('Delete failed', 'error');
  }
}

// ── SETTINGS ──────────────────────────────────
async function saveSettings() {
  try {
    await apiFetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({
        siteName: document.getElementById('s-site-name').value,
        tagline:  document.getElementById('s-tagline').value,
      }),
    });
    showToast('Settings saved!', 'success');
  } catch(e) {
    showToast('Failed: ' + e.message, 'error');
  }
}

function saveApiUrl() {
  const url = document.getElementById('s-api-url').value.trim().replace(/\/$/, '');
  if (!url) { showToast('Please enter a URL', 'error'); return; }
  API_BASE = url;
  localStorage.setItem('nf_api_url', url);
  showToast('API URL saved! Reloading…', 'success');
  setTimeout(() => location.reload(), 1200);
}

// ── UTILS ─────────────────────────────────────
function esc(str) {
  return String(str || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day:'numeric', month:'short' });
}

// ── TOAST ─────────────────────────────────────
let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = '', 3000);
}
