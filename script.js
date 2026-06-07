/* ============================================================
   CONFIG — site name, colors, features
   ============================================================ */
const CONFIG = {
    siteName: 'Islamic Knowledge Hub',
    baseUrl: window.location.origin,
    defaultTheme: 'dark',
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
    prayerApiUrl: 'https://api.aladhan.com/v1/timingsByCity',
    prayerCity: 'Mecca',
    prayerCountry: 'Saudi Arabia',
};

/* ============================================================
   STATE — localStorage-backed store
   ============================================================ */
const STATE = {
    pages: JSON.parse(localStorage.getItem('ikh_pages') || '[]'),
    navItems: JSON.parse(localStorage.getItem('ikh_nav') || '[]'),
    adminHash: localStorage.getItem('ikh_admin_hash') || null,
    session: JSON.parse(localStorage.getItem('ikh_session') || 'null'),
    theme: localStorage.getItem('ikh_theme') || CONFIG.defaultTheme,
    bookmarks: JSON.parse(localStorage.getItem('ikh_bookmarks') || '[]'),
};

// Default nav if empty
if (STATE.navItems.length === 0) {
    STATE.navItems = [
        { label: 'Home', path: '#home', type: 'static' },
        { label: 'Search', path: '#search', type: 'anchor' },
    ];
    saveState('nav');
}

function saveState(key) {
    switch(key) {
        case 'pages':
            localStorage.setItem('ikh_pages', JSON.stringify(STATE.pages));
            break;
        case 'nav':
            localStorage.setItem('ikh_nav', JSON.stringify(STATE.navItems));
            break;
        case 'admin':
            localStorage.setItem('ikh_admin_hash', STATE.adminHash);
            break;
        case 'session':
            localStorage.setItem('ikh_session', JSON.stringify(STATE.session));
            break;
        case 'theme':
            localStorage.setItem('ikh_theme', STATE.theme);
            document.documentElement.setAttribute('data-theme', STATE.theme);
            break;
        case 'bookmarks':
            localStorage.setItem('ikh_bookmarks', JSON.stringify(STATE.bookmarks));
            break;
    }
}

/* ============================================================
   AUTH — login, session, admin gate
   ============================================================ */
function checkFirstRun() {
    return !STATE.adminHash;
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function generateSession() {
    return crypto.randomUUID();
}

function isSessionValid() {
    if (!STATE.session) return false;
    const now = Date.now();
    return now - STATE.session.created < CONFIG.sessionDuration;
}

function isAdmin() {
    return isSessionValid();
}

function showAuthModal(mode = 'setup') {
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-title');
    title.textContent = mode === 'setup' ? 'Admin Setup' : 'Admin Login';
    modal.classList.remove('hidden');
    
    document.getElementById('auth-form').onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('auth-username').value;
        const password = document.getElementById('auth-password').value;
        
        if (mode === 'setup') {
            const hash = await hashPassword(password);
            STATE.adminHash = JSON.stringify({ username, hash });
            saveState('admin');
            loginSuccess();
        } else {
            const stored = JSON.parse(STATE.adminHash);
            const inputHash = await hashPassword(password);
            if (stored.hash === inputHash && stored.username === username) {
                loginSuccess();
            } else {
                alert('Invalid credentials');
            }
        }
        
        modal.classList.add('hidden');
    };
}

function loginSuccess() {
    STATE.session = {
        id: generateSession(),
        created: Date.now()
    };
    saveState('session');
    updateAdminUI();
}

function logout() {
    STATE.session = null;
    saveState('session');
    updateAdminUI();
}

function updateAdminUI() {
    const toolbar = document.getElementById('admin-toolbar');
    if (isAdmin()) {
        toolbar.classList.remove('hidden');
    } else {
        toolbar.classList.add('hidden');
    }
}

/* ============================================================
   ROUTER — handles navigation
   ============================================================ */
function navigateTo(path) {
    if (path.startsWith('#home') || path === 'index.html') {
        renderHomePage();
    } else if (path === '#search') {
        renderSearchPage();
    } else if (path.startsWith('pages/')) {
        window.location.href = path;
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
}

/* ============================================================
   RENDERER — builds home page HTML dynamically
   ============================================================ */
function renderHomePage() {
    const app = document.getElementById('app');
    
    const featuredPages = STATE.pages.slice(0, 3);
    const latestPages = STATE.pages.slice(0, 6);
    const categories = ['Quran', 'Hadith', 'Fiqh', 'Seerah', 'Aqeedah'];
    
    app.innerHTML = `
        <section class="hero">
            <div class="bismillah">﷽</div>
            <h1>Islamic Knowledge Hub</h1>
            <p>Discover authentic Islamic knowledge through Quran, Hadith, and scholarly works</p>
            <div class="hero-cta">
                <button class="btn-primary" onclick="document.querySelector('.search-bar').focus()">
                    🔍 Explore Knowledge
                </button>
                <button class="btn-primary" onclick="navigateTo('#search')">
                    📚 Browse Library
                </button>
            </div>
        </section>
        
        <div class="container">
            <input type="text" class="search-bar" placeholder="Search articles, topics, Quran verses..." 
                   oninput="handleSearch(this.value)">
            
            ${featuredPages.length > 0 ? `
                <section style="padding: 2rem 0;">
                    <h2 style="margin-bottom: 1rem;">⭐ Featured Content</h2>
                    <div class="cards-grid">
                        ${featuredPages.map(page => createCard(page)).join('')}
                    </div>
                </section>
            ` : ''}
            
            <section style="padding: 2rem 0;">
                <h2 style="margin-bottom: 1rem;">📖 Categories</h2>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${categories.map(cat => `
                        <span class="category-pill" style="cursor: pointer; font-size: 1rem;" 
                              onclick="filterByCategory('${cat}')">${cat}</span>
                    `).join('')}
                </div>
            </section>
            
            <div class="widgets-section">
                <div class="widget" id="prayer-widget">
                    <h3>🕌 Prayer Times</h3>
                    <div id="prayer-times">Loading...</div>
                </div>
                <div class="widget" id="calendar-widget">
                    <h3>📅 Islamic Calendar</h3>
                    <div id="islamic-date"></div>
                </div>
                <div class="widget" id="daily-widget">
                    <h3>📜 Verse of the Day</h3>
                    <div id="daily-verse"></div>
                </div>
            </div>
            
            ${latestPages.length > 0 ? `
                <section style="padding: 2rem 0;">
                    <h2 style="margin-bottom: 1rem;">📝 Latest Articles</h2>
                    <div class="cards-grid">
                        ${latestPages.map(page => createCard(page)).join('')}
                    </div>
                </section>
            ` : `
                <section style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p>No articles yet. Admin can create content using the Page Builder.</p>
                </section>
            `}
        </div>
    `;
    
    // Load widgets
    loadPrayerTimes();
    loadIslamicDate();
    loadDailyVerse();
}

function createCard(page) {
    return `
        <div class="card" onclick="navigateTo('${page.path}')">
            <span class="category-pill">${page.category}</span>
            <h3>${page.title}</h3>
            <p>${page.description || 'Click to read more...'}</p>
            <small style="color: var(--text-muted);">${formatDate(page.createdAt)}</small>
        </div>
    `;
}

function renderSearchPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container" style="padding: 2rem;">
            <h2>🔍 Search Knowledge Base</h2>
            <input type="text" class="search-bar" placeholder="Search..." oninput="handleSearch(this.value)">
            <div id="search-results" class="cards-grid"></div>
        </div>
    `;
}

function handleSearch(query) {
    if (!query) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }
    
    const results = STATE.pages.filter(page => 
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        (page.tags && page.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) ||
        (page.category && page.category.toLowerCase().includes(query.toLowerCase()))
    );
    
    const container = document.getElementById('search-results');
    if (container) {
        container.innerHTML = results.map(page => createCard(page)).join('') || 
            '<p style="color: var(--text-muted);">No results found</p>';
    }
}

function filterByCategory(category) {
    const results = STATE.pages.filter(page => page.category === category);
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container" style="padding: 2rem;">
            <h2>📚 ${category}</h2>
            <div class="cards-grid">
                ${results.map(page => createCard(page)).join('') || '<p>No articles in this category yet.</p>'}
            </div>
            <button class="btn-primary" onclick="renderHomePage()" style="margin-top: 1rem;">← Back to Home</button>
        </div>
    `;
}

/* ============================================================
   NAV MANAGER — renders floating nav
   ============================================================ */
function renderNav() {
    const nav = document.getElementById('main-nav');
    
    // Group pages by category
    const categories = {};
    STATE.pages.forEach(page => {
        if (!categories[page.category]) {
            categories[page.category] = [];
        }
        categories[page.category].push(page);
    });
    
    nav.innerHTML = `
        <div class="nav-container">
            <a href="#" class="nav-brand" onclick="renderHomePage(); return false;">☪️ ${CONFIG.siteName}</a>
            <ul class="nav-links">
                ${STATE.navItems.map(item => {
                    if (item.type === 'static') {
                        return `<li><a href="${item.path}" onclick="navigateTo('${item.path}'); return false;">${item.label}</a></li>`;
                    }
                    return '';
                }).join('')}
                ${Object.entries(categories).map(([cat, pages]) => `
                    <li class="nav-dropdown">
                        <a href="#" onclick="return false;">${cat} ▼</a>
                        <div class="nav-dropdown-menu">
                            ${pages.map(p => `<a href="${p.path}">${p.title}</a>`).join('')}
                        </div>
                    </li>
                `).join('')}
                <li><button class="theme-toggle" onclick="toggleTheme()">${STATE.theme === 'dark' ? '☀️' : '🌙'}</button></li>
            </ul>
        </div>
    `;
}

function toggleTheme() {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    saveState('theme');
    renderNav();
}

/* ============================================================
   PAGE BUILDER — drag-drop block editor UI
   ============================================================ */
let currentBlocks = [];

function openPageBuilder() {
    if (!isAdmin()) {
        alert('Please login first (Ctrl+Shift+A)');
        return;
    }
    currentBlocks = [];
    document.getElementById('page-builder-modal').classList.remove('hidden');
    document.getElementById('blocks-container').innerHTML = '';
}

function addBlock(type) {
    const block = createBlockData(type);
    currentBlocks.push(block);
    renderBlocks();
}

function createBlockData(type) {
    const id = Date.now().toString();
    switch(type) {
        case 'heading':
            return { id, type: 'heading', data: { level: 2, text: 'New Heading' } };
        case 'paragraph':
            return { id, type: 'paragraph', data: { text: 'Write your paragraph here...' } };
        case 'quran-verse':
            return { id, type: 'quran-verse', data: { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful', ref: '1:1' } };
        case 'hadith':
            return { id, type: 'hadith', data: { text: 'Actions are judged by intentions...', source: 'Bukhari', grading: 'Sahih' } };
        case 'quote':
            return { id, type: 'quote', data: { text: 'Seek knowledge from the cradle to the grave.', attribution: 'Prophet Muhammad ﷺ' } };
        case 'callout':
            return { id, type: 'callout', data: { type: 'info', text: 'Important note here...' } };
        default:
            return { id, type: 'paragraph', data: { text: '' } };
    }
}

function renderBlocks() {
    const container = document.getElementById('blocks-container');
    container.innerHTML = currentBlocks.map((block, index) => `
        <div class="block-item" draggable="true">
            <strong>${block.type.toUpperCase()}</strong>
            <button onclick="removeBlock(${index})" style="float: right; background: none; border: none; color: red; cursor: pointer;">✕</button>
            ${renderBlockEditor(block, index)}
        </div>
    `).join('');
}

function renderBlockEditor(block, index) {
    switch(block.type) {
        case 'heading':
            return `<input value="${block.data.text}" onchange="updateBlock(${index}, 'text', this.value)" placeholder="Heading text">`;
        case 'paragraph':
            return `<textarea onchange="updateBlock(${index}, 'text', this.value)" rows="3">${block.data.text}</textarea>`;
        case 'quran-verse':
            return `
                <input value="${block.data.arabic}" onchange="updateBlock(${index}, 'arabic', this.value)" placeholder="Arabic text">
                <input value="${block.data.translation}" onchange="updateBlock(${index}, 'translation', this.value)" placeholder="Translation">
                <input value="${block.data.ref}" onchange="updateBlock(${index}, 'ref', this.value)" placeholder="Reference (e.g., 2:255)">
            `;
        case 'hadith':
            return `
                <textarea onchange="updateBlock(${index}, 'text', this.value)" rows="2">${block.data.text}</textarea>
                <input value="${block.data.source}" onchange="updateBlock(${index}, 'source', this.value)" placeholder="Source">
                <input value="${block.data.grading}" onchange="updateBlock(${index}, 'grading', this.value)" placeholder="Grading">
            `;
        case 'quote':
            return `
                <textarea onchange="updateBlock(${index}, 'text', this.value)" rows="2">${block.data.text}</textarea>
                <input value="${block.data.attribution}" onchange="updateBlock(${index}, 'attribution', this.value)" placeholder="Attribution">
            `;
        case 'callout':
            return `<input value="${block.data.text}" onchange="updateBlock(${index}, 'text', this.value)" placeholder="Callout text">`;
        default:
            return '';
    }
}

function updateBlock(index, field, value) {
    const block = currentBlocks[index];
    block.data[field] = value;
}

function removeBlock(index) {
    currentBlocks.splice(index, 1);
    renderBlocks();
}

/* ============================================================
   PAGE GENERATOR — produces and downloads new .html files
   ============================================================ */
function publishPage() {
    const title = document.getElementById('page-title').value;
    const category = document.getElementById('page-category').value;
    const tags = document.getElementById('page-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    
    if (!title || !category) {
        alert('Please fill in title and category');
        return;
    }
    
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    
    const page = {
        title,
        slug,
        category,
        tags,
        description: currentBlocks.find(b => b.type === 'paragraph')?.data?.text?.substring(0, 150) || '',
        blocks: currentBlocks,
        createdAt: new Date().toISOString(),
    };
    
    // Generate and download the HTML file
    const html = generatePageHTML(page);
    downloadFile(html, `pages/${slug}.html`);
    
    // Register in localStorage
    STATE.pages.push({
        title: page.title,
        slug: page.slug,
        path: `pages/${page.slug}.html`,
        category: page.category,
        tags: page.tags,
        description: page.description,
        createdAt: page.createdAt,
    });
    saveState('pages');
    
    // Close modal
    document.getElementById('page-builder-modal').classList.add('hidden');
    document.getElementById('page-title').value = '';
    document.getElementById('page-category').value = '';
    document.getElementById('page-tags').value = '';
    currentBlocks = [];
    
    // Update UI
    renderNav();
    renderHomePage();
    
    alert('✅ Page generated and downloaded! Place it in your /pages/ folder.');
}

function generatePageHTML(page) {
    return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | ${CONFIG.siteName}</title>
    <meta name="description" content="${page.description}">
    <meta property="og:title" content="${page.title}">
    <meta property="og:type" content="article">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <nav id="main-nav"></nav>
    
    <article class="content-page" id="app">
        <header class="page-header">
            <nav class="breadcrumb">
                <a href="../index.html">Home</a> / 
                <a href="../index.html#${page.category.toLowerCase()}">${page.category}</a> / 
                <span>${page.title}</span>
            </nav>
            <h1 class="page-title">${page.title}</h1>
            <div class="page-meta">
                <span class="category-pill">${page.category}</span>
                <span>${formatDate(page.createdAt)}</span>
            </div>
        </header>
        
        <div class="page-content">
            ${renderBlocksToHTML(page.blocks)}
        </div>
    </article>
    
    <script src="../app.js"><\/script>
    <script>
        // Load navigation on generated pages
        if (typeof renderNav === 'function') {
            renderNav();
        }
    <\/script>
</body>
</html>`;
}

function renderBlocksToHTML(blocks) {
    return blocks.map(block => {
        switch(block.type) {
            case 'heading':
                return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
            case 'paragraph':
                return `<p>${block.data.text}</p>`;
            case 'quran-verse':
                return `
                    <div class="quran-block">
                        <div class="quran-arabic">${block.data.arabic}</div>
                        <div class="quran-translation">${block.data.translation}</div>
                        <div class="quran-reference">— Quran ${block.data.ref}</div>
                    </div>
                `;
            case 'hadith':
                return `
                    <div class="hadith-block">
                        <p class="hadith-text">${block.data.text}</p>
                        <p class="hadith-source">— ${block.data.source} (${block.data.grading})</p>
                    </div>
                `;
            case 'quote':
                return `
                    <blockquote class="block-quote">
                        <p>${block.data.text}</p>
                        <footer>— ${block.data.attribution}</footer>
                    </blockquote>
                `;
            case 'callout':
                return `<div class="callout-info">📌 ${block.data.text}</div>`;
            default:
                return '';
        }
    }).join('');
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* ============================================================
   WIDGETS — prayer times, Islamic calendar, daily verses
   ============================================================ */
async function loadPrayerTimes() {
    try {
        const response = await fetch(`${CONFIG.prayerApiUrl}?city=${CONFIG.prayerCity}&country=${CONFIG.prayerCountry}`);
        const data = await response.json();
        const timings = data.data.timings;
        
        const container = document.getElementById('prayer-times');
        if (container) {
            container.innerHTML = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
                .map(prayer => `
                    <div class="prayer-time">
                        <span>${prayer}</span>
                        <span class="time">${timings[prayer]}</span>
                    </div>
                `).join('');
        }
    } catch (error) {
        console.error('Prayer times load error:', error);
        const container = document.getElementById('prayer-times');
        if (container) container.innerHTML = '<p>Unable to load prayer times</p>';
    }
}

function loadIslamicDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', options).format(today);
    
    const container = document.getElementById('islamic-date');
    if (container) {
        container.innerHTML = `<p style="font-size: 1.1rem;">${hijriDate}</p>`;
    }
}

function loadDailyVerse() {
    const verses = [
        { arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', translation: 'And indeed, you are of a great moral character.', ref: '68:4' },
        { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease.', ref: '94:6' },
        { arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ', translation: 'And I did not create the jinn and mankind except to worship Me.', ref: '51:56' },
    ];
    
    const verse = verses[Math.floor(Math.random() * verses.length)];
    const container = document.getElementById('daily-verse');
    if (container) {
        container.innerHTML = `
            <div class="quran-arabic" style="font-size: 1.2rem; text-align: center;">${verse.arabic}</div>
            <p style="text-align: center; font-style: italic;">${verse.translation}</p>
            <p style="text-align: center; color: var(--gold-light);">— Quran ${verse.ref}</p>
        `;
    }
}

/* ============================================================
   UTILITIES
   ============================================================ */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function estimateReadingTime(blocks) {
    const text = blocks.map(b => b.data.text || b.data.translation || '').join(' ');
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

/* ============================================================
   ADMIN FUNCTIONS
   ============================================================ */
function managePages() {
    if (!isAdmin()) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container" style="padding: 2rem;">
            <h2>📋 Manage Pages</h2>
            <div class="cards-grid">
                ${STATE.pages.map((page, index) => `
                    <div class="card">
                        <span class="category-pill">${page.category}</span>
                        <h3>${page.title}</h3>
                        <p>/${page.path}</p>
                        <button class="btn-sm" onclick="deletePage(${index})">🗑️ Delete</button>
                    </div>
                `).join('') || '<p>No pages created yet.</p>'}
            </div>
            <button class="btn-primary" onclick="renderHomePage()" style="margin-top: 1rem;">← Back to Home</button>
        </div>
    `;
}

function deletePage(index) {
    if (confirm('Delete this page? This cannot be undone.')) {
        STATE.pages.splice(index, 1);
        saveState('pages');
        renderNav();
        managePages();
    }
}

function editNav() {
    if (!isAdmin()) return;
    const newLabel = prompt('Add navigation item label:');
    if (newLabel) {
        const newPath = prompt('Path (e.g., #about):');
        STATE.navItems.push({ label: newLabel, path: newPath, type: 'static' });
        saveState('nav');
        renderNav();
    }
}

/* ============================================================
   INIT — boots the app
   ============================================================ */
function init() {
    // Set theme
    document.documentElement.setAttribute('data-theme', STATE.theme);
    
    // Render nav and home page
    renderNav();
    renderHomePage();
    updateAdminUI();
    
    // Secret admin trigger (Ctrl+Shift+A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            if (isAdmin()) {
                alert('Already logged in as admin');
            } else if (checkFirstRun()) {
                showAuthModal('setup');
            } else {
                showAuthModal('login');
            }
        }
    });
    
    // Footer admin link
    document.getElementById('secret-login-trigger').addEventListener('click', () => {
        if (isAdmin()) {
            alert('Already logged in as admin');
        } else if (checkFirstRun()) {
            showAuthModal('setup');
        } else {
            showAuthModal('login');
        }
    });
    
    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.add('hidden');
        });
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    console.log('🕌 Islamic Knowledge Hub initialized');
    console.log('💡 Tip: Press Ctrl+Shift+A for admin panel');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
