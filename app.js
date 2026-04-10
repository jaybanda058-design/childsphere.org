/* ============================================================
   CHILDSPHERE CORE — app.js
   Stats, Admin Dashboard, Games, Sections, PWA, WhatsApp
============================================================ */

// ============================================================
// STATS (real-time tracking, starts at zero)
// ============================================================
const CS_STATS_KEY = 'cs_stats_v2';

function getStats() {
  try {
    const s = JSON.parse(localStorage.getItem(CS_STATS_KEY) || '{}');
    return {
      visitors:  s.visitors  || 0,
      logins:    s.logins    || 0,
      signups:   s.signups   || 0,
      pending:   s.pending   || 0,
      opps:      s.opps      || 0,
      videos:    s.videos    || 0,
      stories:   s.stories   || 0,
      donations: s.donations || 0,
      ...s
    };
  } catch { return { visitors:0, logins:0, signups:0, pending:0, opps:0, videos:0, stories:0, donations:0 }; }
}
function saveStats(s) { localStorage.setItem(CS_STATS_KEY, JSON.stringify(s)); }
function trackStat(key, val) {
  const s = getStats();
  s[key] = (typeof val === 'number' && val > 0 && key !== 'pending') ? (s[key] || 0) + val : val;
  saveStats(s);
  updateAdminStats();
}
function trackVisitor() {
  const today = new Date().toDateString();
  const key   = 'cs_visit_' + today;
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1');
    trackStat('visitors', 1);
  }
}

function updateAdminStats() {
  const s = getStats();
  const all = getAllApplications();
  s.pending = all.filter(a => a.status === 'pending').length;
  s.opps    = (window.OPPORTUNITIES_DATA || []).length;
  s.videos  = (window.videosData || window.VIDEOS_DATA || []).length;
  s.stories = (window.BLOG_DATA || []).length;
  saveStats(s);
  const users = Object.keys(getStoredUsers()).length;
  safeSet('aStat_visitors',  s.visitors);
  safeSet('aStat_logins',    s.logins);
  safeSet('aStat_signups',   users);
  safeSet('aStat_pending',   s.pending);
  safeSet('aStat_opps',      s.opps);
  safeSet('aStat_videos',    s.videos);
  safeSet('aStat_stories',   s.stories);
  safeSet('aStat_donations', s.donations);
}

function safeSet(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

// ============================================================
// ACTIVITY LOG
// ============================================================
let activityLog = [];
function logActivity(msg, level = 'info') {
  activityLog.unshift({ msg, level, time: new Date().toLocaleTimeString() });
  if (activityLog.length > 100) activityLog.pop();
  renderActivityLog();
  updateAdminStats();
}
function renderActivityLog() {
  const el = document.getElementById('activityLog'); if (!el) return;
  if (activityLog.length === 0) {
    el.innerHTML = '<div style="color:rgba(255,255,255,.3);font-size:.82rem;text-align:center;padding:1rem">No activity yet</div>';
    return;
  }
  el.innerHTML = activityLog.map(e => `
    <div class="log-item">
      <div class="log-dot ${e.level === 'warn' ? 'warn' : e.level === 'success' ? 'success' : ''}"></div>
      <span>${e.msg}</span><span class="log-time">${e.time}</span>
    </div>`).join('');
}

// ============================================================
// LANGUAGE
// ============================================================
let currentLang = localStorage.getItem('cs_lang') || 'en';

function setLang(code) {
  currentLang = code;
  localStorage.setItem('cs_lang', code);
  const L = (window.I18N || {})[code] || (window.I18N || {}).en || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (L[k] !== undefined) el.textContent = L[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-ph');
    if (L[k] !== undefined) el.placeholder = L[k];
  });
  const btn = document.getElementById('langBtn');
  if (btn) btn.innerHTML = code === 'fr'
    ? '🇫🇷 Français <i class="fa-solid fa-chevron-down fa-xs"></i>'
    : '🇬🇧 English <i class="fa-solid fa-chevron-down fa-xs"></i>';
  closeLangMenu();
}

function toggleLangMenu(e) { e.stopPropagation(); document.getElementById('langDropdown')?.classList.toggle('open'); }
function closeLangMenu()    { document.getElementById('langDropdown')?.classList.remove('open'); }

// ============================================================
// THEME
// ============================================================
function toggleTheme() {
  const dark = document.body.classList.toggle('dark');
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('cs_theme', dark ? 'dark' : 'light');
}
(function applyTheme() {
  if (localStorage.getItem('cs_theme') === 'dark') {
    document.body.classList.add('dark');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = 'fa-solid fa-sun';
  }
})();

// ============================================================
// MOBILE MENU + NAV MORE
// ============================================================
function toggleMobile() {
  const d = document.getElementById('mobileDrawer');
  const i = document.getElementById('hamIcon');
  const open = d.classList.contains('open');
  d.classList.toggle('open');
  if (i) i.className = open ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
}
function closeMobile() {
  document.getElementById('mobileDrawer')?.classList.remove('open');
  const i = document.getElementById('hamIcon'); if (i) i.className = 'fa-solid fa-bars';
}
function toggleNavMore(e) { e.stopPropagation(); document.getElementById('navMoreDropdown')?.classList.toggle('open'); }
function closeNavMore()    { document.getElementById('navMoreDropdown')?.classList.remove('open'); }
document.addEventListener('click', () => { closeNavMore(); closeLangMenu(); });

// ============================================================
// MODALS
// ============================================================
function openModal(id) {
  const m = document.getElementById(id); if (!m) return;
  m.classList.add('open'); document.body.style.overflow = 'hidden';
  clearAuthErrors?.();
}
function closeModal(id) {
  const m = document.getElementById(id); if (!m) return;
  m.classList.remove('open');
  if (!document.querySelector('.modal.open')) document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
    closeAdminPanel();
    closeVideoLightbox();
  }
});

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type = 'success') {
  let c = document.getElementById('toastContainer');
  if (!c) { c = document.createElement('div'); c.id = 'toastContainer'; document.body.appendChild(c); }
  const icons = { success:'fa-check-circle', error:'fa-exclamation-circle', info:'fa-info-circle', warn:'fa-triangle-exclamation' };
  const item  = document.createElement('div');
  item.className = `toast-item toast-${type}`;
  item.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i> ${msg}`;
  c.appendChild(item);
  setTimeout(() => { item.classList.add('out'); setTimeout(() => item.remove(), 400); }, 4000);
}

// ============================================================
// MOBILE AUTH UPDATE
// ============================================================
function updateMobileAuth() {
  const ma = document.getElementById('mobileAuth'); if (!ma) return;
  const u = window.currentUser;
  ma.innerHTML = u
    ? `<span style="font-weight:700;color:var(--blue)">Hi, ${u.name}</span>
       <button onclick="logout();closeMobile()" class="btn-nav-outline w100" style="margin-top:.5rem">Logout</button>`
    : `<button onclick="closeMobile();openModal('loginModal')" class="btn-nav-outline w100" data-i18n="nav_login">Login</button>
       <button onclick="closeMobile();openModal('signupModal')" class="btn-nav-primary w100" data-i18n="nav_signup">Sign Up</button>`;
}

function requireLogin(cb) {
  if (!window.currentUser) { showToast('Please login or sign up to continue', 'info'); openModal('loginModal'); return; }
  if (cb) cb();
}
function requireAdmin(cb) {
  if (!window.currentUser) { showToast('Please login first', 'info'); openModal('loginModal'); return; }
  if (!window.isAdminUser) { showToast('Admin access required', 'error'); return; }
  if (cb) cb();
}

// ============================================================
// WHATSAPP FLOATING BUTTON
// ============================================================
function initWhatsApp() {
  const wa = document.createElement('a');
  wa.id = 'waBtn';
  wa.href = 'https://wa.me/260971000000?text=EMERGENCY%3A%20I%20need%20Childsphere%20help.%20My%20location%3A%20';
  wa.target = '_blank'; wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Emergency WhatsApp');
  wa.innerHTML = `<i class="fa-brands fa-whatsapp"></i><span class="wa-label">Emergency Help</span>`;
  document.body.appendChild(wa);
}

// ============================================================
// NAVBAR SCROLL
// ============================================================
window.addEventListener('scroll', () => {
  const n = document.getElementById('navbar');
  if (n) n.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ============================================================
// HERO SECTION — fix dark/light mode look
// ============================================================
function renderHero() {
  const L = (window.I18N || {})[currentLang] || {};
  const tagEl = document.getElementById('heroTag');
  const h1El  = document.getElementById('heroH1');
  const subEl = document.getElementById('heroSub');
  if (tagEl) tagEl.textContent = L.hero_tag || 'Youth-Led Movement · Global';
  if (h1El)  h1El.innerHTML = `${L.hero_h1 || 'Every Child Has a Voice.'}<br><span class="hero-accent">${L.hero_accent || 'We Amplify It.'}</span>`;
  if (subEl) subEl.textContent = L.hero_sub || "Childsphere champions children's rights, wellbeing and dignity — through education, creative programs, emergency support, and community action.";
}

// ============================================================
// SCROLL REVEAL + COUNTERS
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target || '0');
  if (!target) return;
  let cur = 0; const step = target / 60;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = target >= 1000 ? Math.floor(cur).toLocaleString() : Math.floor(cur);
    if (cur >= target) clearInterval(t);
  }, 20);
}

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.count-num').forEach(animateCounter);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// ============================================================
// GALLERY
// ============================================================
let galleryData = window.GALLERY_DATA || [];
let currentFolder = 'all';

function renderGallery() {
  const grid = document.getElementById('galleryGrid'); if (!grid) return;
  const filtered = currentFolder === 'all' ? galleryData : galleryData.filter(p => p.folder === currentFolder);
  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-images"></i><p>No photos yet in this folder.</p></div>';
    return;
  }
  grid.innerHTML = filtered.map(p => `
    <div class="gphoto reveal" onclick="openPhotoLightbox('${p.src}','${p.caption.replace(/'/g,"\\'")}')">
      <img src="${p.src}" alt="${p.caption}" loading="lazy">
      <div class="gphoto-overlay"><span>${p.caption}</span></div>
    </div>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}
function switchFolder(folder, btn) {
  currentFolder = folder;
  document.querySelectorAll('.gfolder').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery();
}
function openPhotoLightbox(src, caption) {
  const lb = document.createElement('div');
  lb.className = 'photo-lb';
  lb.innerHTML = `<div class="photo-lb-inner"><img src="${src}" alt="${caption}"><p>${caption}</p></div>
    <button class="photo-lb-close" onclick="this.closest('.photo-lb').remove()"><i class="fa-solid fa-xmark"></i></button>`;
  lb.onclick = e => { if (e.target === lb) lb.remove(); };
  document.body.appendChild(lb);
}

function showUploadModal() { requireAdmin(() => openModal('uploadModal')); }
function handleUpload(e) {
  e.preventDefault();
  const title   = document.getElementById('uploadTitle').value;
  const folder  = document.getElementById('uploadFolder').value;
  const url     = document.getElementById('uploadUrl').value;
  const caption = document.getElementById('uploadCaption').value || title;
  galleryData.unshift({ id: 'g' + Date.now(), src: url, caption, folder });
  closeModal('uploadModal'); e.target.reset(); renderGallery();
  showToast(`Photo uploaded to ${folder}!`, 'success');
  logActivity(`Admin uploaded photo: "${title}"`, 'success');
}

// ============================================================
// OPPORTUNITIES
// ============================================================
let opportunities = [];

function renderOpportunities() {
  const grid = document.getElementById('oppsGrid'); if (!grid) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const active = opportunities.filter(o => new Date(o.deadline) >= today);
  opportunities = active;
  trackStat('opps', active.length);

  if (!active.length) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-clipboard-list"></i><p>No open opportunities right now. Check back soon!</p></div>';
    return;
  }
  const typeColors = { training:'#1D4ED8:#EFF6FF', volunteer:'#047857:#ECFDF5', event:'#C2410C:#FFF7ED', scholarship:'#5B21B6:#F5F3FF' };
  grid.innerHTML = active.map(o => {
    const [color, bg] = (typeColors[o.type] || '#475569:#F1F5F9').split(':');
    const dl   = new Date(o.deadline).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    const days = Math.ceil((new Date(o.deadline) - today) / 86400000);
    const urg  = days <= 7 ? `<span class="opp-urgent"><i class="fa-solid fa-fire"></i> ${days}d left!</span>` : '';
    const safeTitle = o.title.replace(/'/g,"\\'");

    // Admin sees info notice, not apply button
    const actionHtml = window.isAdminUser
      ? `<div class="admin-no-apply-notice"><i class="fa-solid fa-shield-halved"></i> Admins manage opportunities — use the Admin panel to review applications.</div>`
      : `<button onclick="openOppApplyForm('${o.id}','${safeTitle}','${o.deadline}')" class="opp-apply-btn">Apply Now <i class="fa-solid fa-arrow-right"></i></button>`;

    return `<div class="opp-card reveal">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
        <span class="opp-type" style="background:${bg};color:${color}">${o.type}</span>${urg}
      </div>
      <h4>${o.title}</h4><p>${o.desc}</p>
      <div class="opp-meta">
        <span><i class="fa-regular fa-calendar"></i> ${dl}</span>
        <span><i class="fa-solid fa-users"></i> Ages ${o.ageRange}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${o.location}</span>
      </div>
      ${actionHtml}
    </div>`;
  }).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  updateAdminStats();
}

function openOppApplyForm(id, title, deadline) {
  if (!window.currentUser) {
    showToast('Please login or sign up to apply', 'info');
    openModal('loginModal');
    return;
  }
  if (window.isAdminUser) {
    showToast('Admins cannot apply — use Admin panel to manage applications', 'info');
    return;
  }
  // Check already applied
  const apps = getAllApplications();
  const already = apps.find(a => a.uid === window.currentUser.uid && a.oppId === id);
  if (already) {
    showToast('You have already applied for this opportunity.', 'info');
    return;
  }
  // Pre-fill from profile
  const u = window.currentUser;
  document.getElementById('oppApplyId').value       = id;
  document.getElementById('oppApplyOppTitle').value  = title;
  document.getElementById('oppApplyTitle').textContent = 'Apply: ' + title;
  document.getElementById('appFullName').value  = u.name || '';
  document.getElementById('appAge').value       = u.age  || '';
  document.getElementById('appEmail').value     = u.email || '';
  document.getElementById('appPhone').value     = u.phone || '';
  document.getElementById('appLocation').value  = [u.city, u.country].filter(Boolean).join(', ');
  document.getElementById('appWhy').value       = '';
  document.getElementById('appExperience').value= '';
  openModal('oppApplyModal');
}

function submitOppApplication(e) {
  e.preventDefault();
  const id    = document.getElementById('oppApplyId').value;
  const title = document.getElementById('oppApplyOppTitle').value;
  const app = {
    id: Date.now(),
    type: 'Opportunity Application',
    name: document.getElementById('appFullName').value,
    oppId: id,
    oppTitle: title,
    uid: window.currentUser.uid,
    email: document.getElementById('appEmail').value,
    phone: document.getElementById('appPhone').value,
    location: document.getElementById('appLocation').value,
    age: document.getElementById('appAge').value,
    motivation: document.getElementById('appWhy').value,
    experience: document.getElementById('appExperience').value,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    details: { email: document.getElementById('appEmail').value }
  };
  const apps = getAllApplications();
  apps.unshift(app);
  saveApplications(apps);
  addInboxMessage(window.currentUser.uid, {
    type: 'application', subject: 'Application Received ✓',
    body: `Your application for "${title}" has been received. We'll review it and notify you via this inbox.`,
    status: 'pending',
  });
  closeModal('oppApplyModal');
  e.target.reset();
  showToast(`Application submitted for "${title}"! Check your inbox.`, 'success');
  logActivity(`${app.name} applied for: ${title}`, 'info');
  trackStat('pending', 1);
  updateAdminStats();
}

function showPostOpportunityModal() { requireAdmin(() => openModal('postOppModal')); }
function handlePostOpportunity(e) {
  e.preventDefault();
  const opp = {
    id: 'opp_' + Date.now(),
    title:    document.getElementById('oppTitle').value,
    type:     document.getElementById('oppType').value,
    desc:     document.getElementById('oppDesc').value,
    deadline: document.getElementById('oppDeadline').value,
    ageRange: document.getElementById('oppAgeRange').value,
    location: document.getElementById('oppLocation').value || 'Worldwide',
  };
  opportunities.unshift(opp);
  closeModal('postOppModal'); e.target.reset(); renderOpportunities();
  showToast(`Opportunity "${opp.title}" published!`, 'success');
  logActivity(`Admin posted opportunity: ${opp.title}`, 'success');
}

// ============================================================
// TEAM
// ============================================================
let teamMembers = window.TEAM_DATA || [];

function renderTeam() {
  const grid = document.getElementById('teamGrid'); if (!grid) return;
  if (!teamMembers.length) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-people-group"></i><p>Team members will appear here once added by admin.</p></div>';
    return;
  }
  grid.innerHTML = teamMembers.map(m => `
    <div class="team-card reveal">
      <div class="team-photo-wrap">
        ${m.photo ? `<img src="${m.photo}" alt="${m.name}" loading="lazy">` : `<div class="team-photo-placeholder">${m.name.charAt(0)}</div>`}
      </div>
      <div class="team-body">
        <h4>${m.name}</h4>
        <div class="team-role">${m.role}</div>
        <p>${m.bio || ''}</p>
        <div class="team-socials">
          ${m.linkedin ? `<a href="${m.linkedin}" target="_blank" rel="noopener" class="social-link linkedin"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
          ${m.instagram ? `<a href="${m.instagram}" target="_blank" rel="noopener" class="social-link instagram"><i class="fa-brands fa-instagram"></i></a>` : ''}
          ${m.facebook ? `<a href="${m.facebook}" target="_blank" rel="noopener" class="social-link facebook"><i class="fa-brands fa-facebook-f"></i></a>` : ''}
        </div>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

function showAddTeamModal()  { requireAdmin(() => openModal('addTeamModal')); }
function handleAddTeam(e) {
  e.preventDefault();
  const social_choice = document.getElementById('teamSocialType')?.value;
  const social_url    = document.getElementById('teamSocialUrl')?.value;
  const member = {
    id: 'tm_' + Date.now(),
    name:      document.getElementById('teamName').value,
    role:      document.getElementById('teamRole').value,
    photo:     document.getElementById('teamPhoto').value || '',
    bio:       document.getElementById('teamBio').value,
    linkedin:  social_choice === 'linkedin'  ? social_url : '',
    instagram: social_choice === 'instagram' ? social_url : '',
    facebook:  social_choice === 'facebook'  ? social_url : '',
  };
  teamMembers.push(member);
  closeModal('addTeamModal'); e.target.reset(); renderTeam();
  showToast(`${member.name} added to the team!`, 'success');
  logActivity(`Admin added team member: ${member.name}`, 'success');
}

// ============================================================
// BLOG / STORIES
// ============================================================
let blogPosts = window.BLOG_DATA || [];

function renderBlog() {
  const grid = document.getElementById('blogGrid'); if (!grid) return;
  if (!blogPosts.length) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-pen"></i><p>Stories will appear here once published by admin.</p></div>';
    return;
  }
  grid.innerHTML = blogPosts.map(p => `
    <div class="blog-card reveal">
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <div class="blog-body">
        <span class="blog-cat">${p.category}</span>
        <h4>${p.title}</h4>
        <p>${p.excerpt}</p>
        <a href="#" onclick="openBlogPost('${p.id}');return false;" class="blog-link">Read story <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}
function openBlogPost(id) {
  const p = blogPosts.find(b => String(b.id) === String(id)); if (!p) return;
  document.getElementById('blogModalContent').innerHTML = `
    <img src="${p.img}" alt="${p.title}" style="width:100%;border-radius:var(--r12);margin-bottom:1.5rem;max-height:280px;object-fit:cover;">
    <span class="blog-cat" style="margin-bottom:.75rem;display:inline-block">${p.category}</span>
    <h2 style="font-size:1.5rem;margin-bottom:1rem;color:var(--ink)">${p.title}</h2>
    <p style="color:var(--muted);line-height:1.8;margin-bottom:1rem">${p.excerpt}</p>
    ${p.body ? `<p style="color:var(--muted);line-height:1.8">${p.body}</p>` : '<p style="color:var(--muted)">Full article coming soon.</p>'}`;
  openModal('blogModal');
}
function showPostBlogModal()  { requireAdmin(() => openModal('postBlogModal')); }
function handlePostBlog(e) {
  e.preventDefault();
  const post = {
    id: 'blog_' + Date.now(),
    title:    document.getElementById('blogTitle').value,
    category: document.getElementById('blogCategory').value,
    img:      document.getElementById('blogImg').value || 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=500&q=80',
    excerpt:  document.getElementById('blogExcerpt').value,
    body:     document.getElementById('blogBody')?.value || '',
    publishedAt: new Date().toISOString(),
  };
  blogPosts.unshift(post);
  window.BLOG_DATA = blogPosts;
  closeModal('postBlogModal'); e.target.reset(); renderBlog();
  trackStat('stories', 1);
  showToast(`Story "${post.title}" published!`, 'success');
  logActivity(`Admin published story: ${post.title}`, 'success');
}

// ============================================================
// VIDEOS — folder-based system
// ============================================================
let videosData = window.VIDEOS_DATA || [];

const videoTopicMeta = {
  rights:    { label:'Rights Education',  color:'#1D4ED8', bg:'#EFF6FF', icon:'fa-scale-balanced' },
  wellbeing: { label:'Wellbeing & Health',color:'#15803D', bg:'#F0FDF4', icon:'fa-heart-pulse' },
  emergency: { label:'Emergency Safety',  color:'#BE123C', bg:'#FFF1F2', icon:'fa-shield-halved' },
  leadership:{ label:'Youth Leadership',  color:'#6D28D9', bg:'#F5F3FF', icon:'fa-people-group' },
  events:    { label:'Events',            color:'#D97706', bg:'#FFF7ED', icon:'fa-calendar-star' },
};

function extractYoutubeId(input) {
  if (!input) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  const m = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : input.trim();
}

function getAgeGroup(age) {
  if (!age) return 'all';
  if (age <= 3)  return 'baby';
  if (age <= 6)  return '0-6';
  if (age <= 12) return '7-12';
  if (age <= 18) return '13-18';
  return '19-24';
}

function applyAgeTheme(age) {
  document.body.classList.remove('age-baby','age-child');
  if (!age) return;
  if (age <= 3) document.body.classList.add('age-baby');
  else if (age <= 6) document.body.classList.add('age-child');
}

function buildVideoCard(v, savedVideos) {
  const m = videoTopicMeta[v.category] || { label: v.category, color:'#475569', bg:'#F1F5F9', icon:'fa-film' };
  const saved = savedVideos.includes(v.id);
  const safeTitle = v.title.replace(/'/g,"\\'").replace(/"/g,'&quot;');
  return `<div class="video-card">
    <div class="video-thumb" onclick="openVideoLightbox('${v.youtubeId}','${safeTitle}','${v.id}')">
      <img src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg" alt="${v.title}" loading="lazy">
      <div class="video-play-btn"><i class="fa-solid fa-play"></i></div>
      <span class="video-cat-badge" style="background:${m.bg};color:${m.color}"><i class="fa-solid ${m.icon}"></i> ${m.label}</span>
    </div>
    <div class="video-body">
      <h4>${v.title}</h4><p>${v.desc || ''}</p>
      <div class="video-actions">
        <button onclick="toggleSaveVideo('${v.id}',this)" class="vid-action-btn ${saved?'saved':''}">
          <i class="fa-${saved?'solid':'regular'} fa-bookmark"></i> ${saved?'Saved':'Save'}
        </button>
        <button onclick="shareVideo('${v.youtubeId}','${safeTitle}')" class="vid-action-btn">
          <i class="fa-solid fa-share-nodes"></i> Share
        </button>
      </div>
    </div>
  </div>`;
}

function renderVideos() {
  const container = document.getElementById('videoFoldersContainer'); if (!container) return;
  const savedVideos = JSON.parse(localStorage.getItem('cs_saved_videos') || '[]');
  const userAge  = window.currentUser?.age;
  const ageGroup = userAge ? getAgeGroup(userAge) : null;
  const PREVIEW  = 3;

  // Update age note
  if (ageGroup && ageGroup !== 'all') {
    const noteEl = document.getElementById('videoAgeNote');
    if (noteEl) noteEl.textContent = `Showing age-matched content first for you.`;
  }

  const topics = ['rights','wellbeing','emergency','leadership','events'];
  let html = '';

  topics.forEach(topic => {
    const m = videoTopicMeta[topic];
    let vids = videosData.filter(v => v.category === topic);
    if (!vids.length) return;

    // Sort age-matched first
    if (ageGroup && ageGroup !== 'all') {
      const match = vids.filter(v => !v.ageGroups || v.ageGroups.includes('all') || v.ageGroups.includes(ageGroup));
      const rest  = vids.filter(v => v.ageGroups && !v.ageGroups.includes('all') && !v.ageGroups.includes(ageGroup));
      vids = [...match, ...rest];
    }

    const preview = vids.slice(0, PREVIEW);
    const more    = vids.slice(PREVIEW);
    const fid     = 'vfolder_' + topic;

    html += `<div class="video-topic-folder" id="${fid}">
      <div class="video-folder-header" onclick="toggleVideoFolder('${fid}')">
        <div class="video-folder-left">
          <div class="video-folder-icon" style="background:${m.bg};color:${m.color}">
            <i class="fa-solid ${m.icon}"></i>
          </div>
          <div>
            <div class="video-folder-title">${m.label}</div>
            <span class="video-folder-count">${vids.length} video${vids.length!==1?'s':''}</span>
          </div>
        </div>
        <div class="video-folder-right">
          <i class="fa-solid fa-chevron-down video-folder-chevron"></i>
        </div>
      </div>
      <div class="video-folder-body">
        <div class="video-folder-grid">${preview.map(v=>buildVideoCard(v,savedVideos)).join('')}</div>
        ${more.length ? `
        <div id="vmore_${topic}" style="display:none">
          <div class="video-folder-grid" style="margin-top:1.25rem">${more.map(v=>buildVideoCard(v,savedVideos)).join('')}</div>
        </div>
        <button class="video-more-btn" id="vmorebtn_${topic}" onclick="toggleMoreVideos('${topic}')">
          <i class="fa-solid fa-plus-circle"></i> Show ${more.length} more video${more.length!==1?'s':''}
        </button>` : ''}
      </div>
    </div>`;
  });

  container.innerHTML = html || '<div class="empty-state"><i class="fa-solid fa-film"></i><p>No videos posted yet. Admin can add videos using the buttons above.</p></div>';
}

function toggleVideoFolder(fid) {
  document.getElementById(fid)?.classList.toggle('expanded');
}

function toggleMoreVideos(topic) {
  const el  = document.getElementById('vmore_' + topic);
  const btn = document.getElementById('vmorebtn_' + topic);
  if (!el || !btn) return;
  const showing = el.style.display !== 'none';
  el.style.display = showing ? 'none' : 'block';
  btn.innerHTML = showing
    ? `<i class="fa-solid fa-plus-circle"></i> Show more videos`
    : `<i class="fa-solid fa-minus-circle"></i> Show fewer videos`;
}

// kept for nav compat
function switchVideoTopic(topic) {
  const fid = 'vfolder_' + topic;
  const el  = document.getElementById(fid);
  if (el) { el.classList.add('expanded'); el.scrollIntoView({behavior:'smooth',block:'start'}); }
}

function openVideoLightbox(youtubeId, title, videoId) {
  const lb = document.getElementById('videoLightbox');
  document.getElementById('videoLightboxInner').innerHTML =
    `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" title="${title}" frameborder="0"
     allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen
     style="width:100%;height:100%;display:block;border-radius:12px;"></iframe>`;
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Track in user's recently watched
  if (window.currentUser && videoId) {
    const watched = JSON.parse(localStorage.getItem('cs_watched_' + window.currentUser.uid) || '[]');
    if (!watched.includes(videoId)) watched.unshift(videoId);
    localStorage.setItem('cs_watched_' + window.currentUser.uid, JSON.stringify(watched.slice(0, 20)));
  }
}
function closeVideoLightbox() {
  const lb = document.getElementById('videoLightbox'); if (!lb) return;
  lb.style.display = 'none';
  document.getElementById('videoLightboxInner').innerHTML = '';
  document.body.style.overflow = '';
}

function toggleSaveVideo(videoId, btn) {
  if (!window.currentUser) { showToast('Login to save videos', 'info'); openModal('loginModal'); return; }
  const saved = JSON.parse(localStorage.getItem('cs_saved_videos') || '[]');
  const idx   = saved.indexOf(videoId);
  if (idx > -1) {
    saved.splice(idx, 1);
    btn.className = 'vid-action-btn';
    btn.innerHTML = '<i class="fa-regular fa-bookmark"></i> Save';
    showToast('Video removed from saved', 'info');
  } else {
    saved.unshift(videoId);
    btn.className = 'vid-action-btn saved';
    btn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Saved';
    showToast('Video saved!', 'success');
  }
  localStorage.setItem('cs_saved_videos', JSON.stringify(saved));
}

function shareVideo(youtubeId, title) {
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  if (navigator.share) {
    navigator.share({ title: title, text: `Watch "${title}" on Childsphere`, url });
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('Video link copied!', 'success'));
  }
}

function showUploadVideoModal()      { requireAdmin(() => openModal('uploadVideoModal')); }
function showUploadEventVideoModal() { requireAdmin(() => openModal('uploadEventVideoModal')); }

function handleUploadVideo(e) {
  e.preventDefault();
  const v = {
    id: 'v' + Date.now(),
    title:     document.getElementById('videoTitle').value,
    youtubeId: extractYoutubeId(document.getElementById('videoUrl').value),
    category:  document.getElementById('videoCategory').value,
    desc:      document.getElementById('videoDesc').value,
    ageGroups: ['all'],
  };
  videosData.unshift(v);
  closeModal('uploadVideoModal'); e.target.reset(); renderVideos();
  trackStat('videos', 1);
  showToast(`Video "${v.title}" posted!`, 'success');
  logActivity(`Admin posted video: "${v.title}" [${v.category}]`, 'success');
}

function handleUploadEventVideo(e) {
  e.preventDefault();
  const date  = document.getElementById('evVideoDate').value;
  const loc   = document.getElementById('evVideoLocation').value || 'Worldwide';
  const fd    = date ? new Date(date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '';
  const v = {
    id: 'v' + Date.now(),
    title:     document.getElementById('evVideoTitle').value,
    youtubeId: extractYoutubeId(document.getElementById('evVideoUrl').value),
    category:  'events',
    desc:      [document.getElementById('evVideoDesc').value, fd && `📍 ${loc} · ${fd}`].filter(Boolean).join(' — '),
    ageGroups: ['all'],
  };
  videosData.unshift(v);
  closeModal('uploadEventVideoModal'); e.target.reset(); renderVideos();
  trackStat('videos', 1);
  showToast(`Event video "${v.title}" posted!`, 'success');
  logActivity(`Admin posted event video: "${v.title}"`, 'success');
}

// ============================================================
// GAMES ENGINE
// ============================================================
let currentGame = null;
let gameScore   = 0;
let gameTimer   = null;
let gameTimeLeft = 0;

function openGame(gameId) {
  const game = (window.GAMES || []).find(g => g.id === gameId);
  if (!game) return;
  currentGame = game;
  const modal = document.getElementById('gameModal');
  const body  = document.getElementById('gameBody');
  document.getElementById('gameTitle').textContent = game.title;
  gameScore = 0;
  if (gameTimer) clearInterval(gameTimer);

  if (game.type === 'quiz')        body.innerHTML = renderQuizGame(game);
  if (game.type === 'matching')    body.innerHTML = renderMatchingGame(game);
  if (game.type === 'word_scramble') body.innerHTML = renderWordScramble(game);
  if (game.type === 'emoji_story') body.innerHTML = renderEmojiStory(game);
  if (game.type === 'scenario')    body.innerHTML = renderScenarioGame(game);

  openModal('gameModal');
}

// --- Quiz Game ---
let quizIndex = 0;
function renderQuizGame(game) {
  quizIndex = 0;
  return renderQuizQuestion(game);
}
function renderQuizQuestion(game) {
  if (quizIndex >= game.questions.length) return renderGameResult(game, gameScore, game.questions.length * 10);
  const q = game.questions[quizIndex];
  return `
    <div class="game-quiz">
      <div class="game-progress">
        <div class="game-progress-bar" style="width:${(quizIndex/game.questions.length)*100}%"></div>
      </div>
      <div class="game-score-display">Score: <strong>${gameScore}</strong> &nbsp;|&nbsp; Q${quizIndex+1}/${game.questions.length}</div>
      <div class="game-question">${q.q}</div>
      <div class="game-options">
        ${q.options.map((opt, i) => `<button class="game-option" onclick="answerQuiz(${i}, ${q.correct})">${opt}</button>`).join('')}
      </div>
    </div>`;
}
function answerQuiz(chosen, correct) {
  const btns = document.querySelectorAll('.game-option');
  btns.forEach((b, i) => {
    b.disabled = true;
    b.classList.add(i === correct ? 'correct' : i === chosen && chosen !== correct ? 'wrong' : 'dim');
  });
  if (chosen === correct) gameScore += 10;
  setTimeout(() => {
    quizIndex++;
    document.getElementById('gameBody').innerHTML = renderQuizQuestion(currentGame);
  }, 1200);
}

// --- Matching Game ---
let matchSelected = null;
let matchSolved   = 0;
function renderMatchingGame(game) {
  matchSelected = null; matchSolved = 0;
  const shuffledRights   = [...game.pairs].sort(() => Math.random() - .5);
  const shuffledArticles = [...game.pairs].sort(() => Math.random() - .5);
  gameTimeLeft = 90; // 90 second timer
  gameTimer = setInterval(() => {
    gameTimeLeft--;
    safeSet('matchTimer', gameTimeLeft + 's');
    if (gameTimeLeft <= 0) { clearInterval(gameTimer); endMatchingGame(game, false); }
  }, 1000);
  return `
    <div class="game-matching">
      <div class="game-score-display">
        Match all pairs! &nbsp;|&nbsp; Timer: <strong id="matchTimer">90s</strong> &nbsp;|&nbsp; Score: <strong id="matchScore">0</strong>
      </div>
      <div class="match-grid">
        <div class="match-col">
          ${shuffledRights.map((p,i) => `<button class="match-item" data-type="right" data-idx="${i}" data-right="${p.right}" onclick="selectMatch(this)">${p.right}</button>`).join('')}
        </div>
        <div class="match-col">
          ${shuffledArticles.map((p,i) => `<button class="match-item" data-type="article" data-idx="${i}" data-article="${p.article}" onclick="selectMatch(this)">${p.article}</button>`).join('')}
        </div>
      </div>
    </div>`;
}
function selectMatch(btn) {
  if (btn.classList.contains('matched')) return;
  if (!matchSelected) {
    matchSelected = btn;
    btn.classList.add('selected');
    return;
  }
  if (matchSelected === btn) { btn.classList.remove('selected'); matchSelected = null; return; }

  const a = matchSelected, b = btn;
  const right   = (a.dataset.type === 'right'   ? a : b).dataset.right;
  const article = (a.dataset.type === 'article' ? a : b).dataset.article;
  const pair    = (currentGame.pairs || []).find(p => p.right === right && p.article === article);

  if (pair) {
    a.classList.replace('selected', 'matched'); b.classList.add('matched');
    gameScore += 10; matchSolved++;
    safeSet('matchScore', gameScore);
    if (matchSolved >= currentGame.pairs.length) { clearInterval(gameTimer); endMatchingGame(currentGame, true); }
  } else {
    a.classList.add('wrong-flash'); b.classList.add('wrong-flash');
    setTimeout(() => { a.classList.remove('selected','wrong-flash'); b.classList.remove('wrong-flash'); }, 700);
  }
  matchSelected = null;
}
function endMatchingGame(game, won) {
  document.getElementById('gameBody').innerHTML = renderGameResult(game, gameScore, game.pairs.length * 10, won ? '🎉 All matched!' : '⏰ Time\'s up!');
}

// --- Word Scramble ---
let scrambleIndex = 0;
function renderWordScramble(game) {
  scrambleIndex = 0;
  return renderScrambleWord(game);
}
function renderScrambleWord(game) {
  if (scrambleIndex >= game.words.length) return renderGameResult(game, gameScore, game.words.length * 15);
  const { word, hint } = game.words[scrambleIndex];
  const scrambled = word.split('').sort(() => Math.random() - .5).join('');
  return `
    <div class="game-scramble">
      <div class="game-score-display">Word ${scrambleIndex+1}/${game.words.length} &nbsp;|&nbsp; Score: <strong>${gameScore}</strong></div>
      <div class="scramble-hint"><i class="fa-solid fa-lightbulb"></i> ${hint}</div>
      <div class="scramble-word">${scrambled.split('').map(l => `<span class="scramble-letter">${l}</span>`).join('')}</div>
      <div class="fg" style="max-width:320px;margin:.5rem auto">
        <input type="text" id="scrambleInput" placeholder="Type the word..." style="text-align:center;text-transform:uppercase;letter-spacing:.15em;font-weight:700" autocomplete="off">
      </div>
      <div style="display:flex;gap:.75rem;justify-content:center;margin-top:.5rem">
        <button class="btn btn-primary" onclick="checkScramble('${word}')">Check Answer</button>
        <button class="btn btn-outline-blue" onclick="skipScramble()">Skip</button>
      </div>
      <div id="scrambleResult" style="text-align:center;margin-top:.75rem;font-weight:700;min-height:1.5em"></div>
    </div>`;
}
function checkScramble(answer) {
  const input = document.getElementById('scrambleInput');
  const res   = document.getElementById('scrambleResult');
  if (!input || !res) return;
  if (input.value.trim().toUpperCase() === answer.toUpperCase()) {
    gameScore += 15;
    res.innerHTML = '<span style="color:#059669">✓ Correct! +15 points</span>';
    setTimeout(() => { scrambleIndex++; document.getElementById('gameBody').innerHTML = renderScrambleWord(currentGame); }, 1000);
  } else {
    res.innerHTML = `<span style="color:#E11D48">✗ Not quite. Answer: ${answer}</span>`;
    setTimeout(() => { scrambleIndex++; document.getElementById('gameBody').innerHTML = renderScrambleWord(currentGame); }, 1500);
  }
}
function skipScramble() { scrambleIndex++; document.getElementById('gameBody').innerHTML = renderScrambleWord(currentGame); }

// --- Emoji Story ---
let emojiIndex = 0;
function renderEmojiStory(game) {
  emojiIndex = 0;
  return renderEmojiCard(game);
}
function renderEmojiCard(game) {
  if (emojiIndex >= game.stories.length) return renderGameResult(game, gameScore, game.stories.length * 5);
  const { emoji, meaning } = game.stories[emojiIndex];
  return `
    <div class="game-emoji">
      <div class="game-score-display">Story ${emojiIndex+1}/${game.stories.length}</div>
      <div class="emoji-display">${emoji}</div>
      <p style="text-align:center;color:var(--muted);margin:.75rem 0 1.25rem">${meaning}</p>
      <div style="text-align:center">
        <button class="btn btn-primary" onclick="nextEmojiCard()">Next Story <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>`;
}
function nextEmojiCard() {
  gameScore += 5; emojiIndex++;
  document.getElementById('gameBody').innerHTML = renderEmojiCard(currentGame);
}

// --- Scenario/Leadership Game ---
let scenarioIndex = 0; let scenarioScore = 0;
function renderScenarioGame(game) {
  scenarioIndex = 0; scenarioScore = 0;
  return renderScenario(game);
}
function renderScenario(game) {
  if (scenarioIndex >= game.scenarios.length) return renderGameResult(game, scenarioScore, game.scenarios.length * 10, `Your leadership score: ${scenarioScore}/${game.scenarios.length*10}`);
  const s = game.scenarios[scenarioIndex];
  return `
    <div class="game-scenario">
      <div class="game-score-display">Situation ${scenarioIndex+1}/${game.scenarios.length} &nbsp;|&nbsp; Score: <strong>${scenarioScore}</strong></div>
      <div class="scenario-situation">${s.situation}</div>
      <div class="game-options">
        ${s.options.map((opt,i) => `<button class="game-option" onclick="chooseScenario(${opt.score},${i})">${opt.text}</button>`).join('')}
      </div>
    </div>`;
}
function chooseScenario(score, idx) {
  const btns = document.querySelectorAll('.game-option');
  btns.forEach((b,i) => { b.disabled = true; if (i === idx) b.classList.add(score > 5 ? 'correct' : 'wrong'); });
  scenarioScore += score;
  setTimeout(() => { scenarioIndex++; document.getElementById('gameBody').innerHTML = renderScenario(currentGame); }, 1200);
}

// --- Game Result ---
function renderGameResult(game, score, maxScore, extraMsg) {
  const pct  = maxScore ? Math.round((score / maxScore) * 100) : 100;
  const stars = pct >= 80 ? '⭐⭐⭐' : pct >= 50 ? '⭐⭐' : '⭐';
  const msg   = pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good effort!" : "Keep practising!";
  return `
    <div class="game-result">
      <div class="result-stars">${stars}</div>
      <h3>${msg}</h3>
      <div class="result-score">${score}<span>/${maxScore}</span></div>
      <p style="color:var(--muted)">${extraMsg || ''}</p>
      <div style="display:flex;gap:.75rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openGame('${game.id}')">Play Again</button>
        <button class="btn btn-outline-blue" onclick="closeModal('gameModal')">Close</button>
      </div>
    </div>`;
}

function renderGamesGrid() {
  const grid = document.getElementById('gamesGrid'); if (!grid) return;
  const userAge = window.currentUser?.age;
  const ageGroup = userAge ? getAgeGroup(userAge) : null;
  const games = (window.GAMES || []).filter(g =>
    !ageGroup || g.ageGroups.includes(ageGroup) || g.ageGroups.includes('all')
  );
  if (!games.length) { grid.innerHTML = '<p style="color:var(--muted)">No games available for your age group yet.</p>'; return; }
  grid.innerHTML = games.map(g => `
    <div class="game-card reveal" onclick="openGame('${g.id}')">
      <div class="game-icon" style="background:${g.bg};color:${g.color}"><i class="fa-solid ${g.icon}"></i></div>
      <div class="game-info">
        <h4>${g.title}</h4>
        <p>${g.desc}</p>
        <div class="game-ages">Ages: ${g.ageGroups.join(', ')}</div>
      </div>
      <button class="game-play-btn" style="background:${g.color}">Play <i class="fa-solid fa-play"></i></button>
    </div>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

// ============================================================
// ACTIVITIES
// ============================================================
function switchAge(panelId, btn) {
  document.querySelectorAll('.act-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.age-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(panelId)?.classList.add('active');
  btn.classList.add('active');
}

// ============================================================
// DONATION
// ============================================================
let selectedDonateAmount = 200;
let selectedDonateMethod = 'sonka';

function renderDonateAmounts() {
  const wrap = document.getElementById('donateAmounts'); if (!wrap) return;
  const amounts = [
    { k:50,   label:'Funds one session' },
    { k:200,  label:'Trains a peer educator', featured:true },
    { k:500,  label:'Sponsors a month' },
    { k:1000, label:'Funds a full program' },
  ];
  wrap.innerHTML = amounts.map(a => `
    <div class="d-amt ${a.featured ? 'd-featured' : ''}" onclick="selectDonateAmount(${a.k},this)">
      K${a.k}<span>${a.label}</span>
    </div>`).join('');
}
function selectDonateAmount(k, el) {
  selectedDonateAmount = k;
  document.querySelectorAll('.d-amt').forEach(d => d.classList.remove('d-active'));
  el.classList.add('d-active');
}
function selectDonateMethod(method, btn) {
  selectedDonateMethod = method;
  document.querySelectorAll('.donate-method-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('donateMethodPanel').innerHTML = method === 'sonka'
    ? `<div class="donate-method-info"><i class="fa-solid fa-mobile-screen" style="color:#0284C7;font-size:1.5rem"></i><div><strong>Sonka Mobile Payment</strong><p>Fast mobile money payment via Sonka — works with MTN, Airtel, Zamtel</p><button onclick="doSonkaDonate()" class="btn btn-white donate-btn" style="margin-top:.75rem"><i class="fa-solid fa-hand-holding-heart"></i> Donate K${selectedDonateAmount} via Sonka</button></div></div>`
    : `<div class="donate-method-info"><i class="fa-solid fa-building-columns" style="color:#059669;font-size:1.5rem"></i><div><strong>International Bank Transfer</strong><p>For international donors. Transfer in USD or GBP.</p><div class="bank-details"><div><span>Bank:</span> Zambia National Commercial Bank (Zanaco)</div><div><span>Account:</span> 0000 1234 5678 90</div><div><span>SWIFT:</span> ZNCOZMLX</div><div><span>USD Equivalent:</span> ~$${Math.round(selectedDonateAmount/25)}</div></div></div></div>`;
}
function doSonkaDonate() {
  window.open(`https://sonka.co.zm?amount=${selectedDonateAmount}&org=childsphere&ref=web`, '_blank', 'noopener');
  trackStat('donations', 1);
  showToast(`Redirecting to Sonka for K${selectedDonateAmount}...`, 'success');
  logActivity(`Donation initiated: K${selectedDonateAmount} via Sonka`, 'success');
}

// ============================================================
// PILLAR MODALS
// ============================================================
const pillars = {
  1: { title:'Rights Education', color:'#1D4ED8', bg:'#EFF6FF', icon:'fa-scale-balanced', body:`<p>Every child in Zambia has 54 fundamental rights under the UN Convention on the Rights of the Child (UNCRC). Yet most children have never heard of even one.</p><ul><li><strong>Weekly school sessions</strong> — 30+ schools across 12+ districts</li><li><strong>Community circles</strong> — churches, markets and community centres</li><li><strong>Rights songs and games</strong> — joyful, memorable learning</li><li><strong>Digital rights library</strong> — free resources for any child with a phone</li><li><strong>Peer educator networks</strong> — youth aged 19–24 trained to facilitate</li></ul>` },
  2: { title:'Wellbeing & Health', color:'#15803D', bg:'#F0FDF4', icon:'fa-heart-pulse', body:`<p>A child who does not feel safe, healthy or emotionally supported cannot learn, grow or advocate for themselves.</p><ul><li><strong>Mental health first aid</strong> — training children and caregivers</li><li><strong>Body autonomy and safety</strong> — age-appropriate consent education</li><li><strong>Nutrition and physical health</strong> — health screenings at events</li><li><strong>Trauma-informed care</strong> — all facilitators trained sensitively</li><li><strong>Safe spaces</strong> — regular drop-in sessions</li></ul>` },
  3: { title:'Emergency Protection', color:'#BE123C', bg:'#FFF1F2', icon:'fa-shield-halved', body:`<p>When a child is in immediate danger, every second counts. Our network operates 24/7.</p><ul><li><strong>Direct hotline</strong> — +260 971 000 000 (call or WhatsApp)</li><li><strong>Police liaison</strong> — Zambia Police child protection unit</li><li><strong>Social welfare referral</strong> — immediate case worker referral</li><li><strong>Emergency shelter</strong> — 3 registered shelters</li><li><strong>Follow-up support</strong> — every case followed for 90 days</li></ul>` },
  4: { title:'Youth Leadership', color:'#6D28D9', bg:'#F5F3FF', icon:'fa-people-group', body:`<p>The most powerful advocates for children's rights are other young people.</p><ul><li><strong>Peer Educator Certification</strong> — 6-week training, certificate and stipend</li><li><strong>Rights Ambassadors</strong> — 6-month school-based program</li><li><strong>Community Champions</strong> — district-level campaign leaders</li><li><strong>Youth Advisory Council</strong> — co-designing Childsphere programs</li><li><strong>Leadership retreats</strong> — annual residential program</li></ul>` },
};
function openPillarModal(n) {
  const p = pillars[n]; if (!p) return;
  document.getElementById('pillarContent').innerHTML = `
    <div class="pillar-detail">
      <div class="pillar-d-tag" style="background:${p.bg};color:${p.color}"><i class="fa-solid ${p.icon}"></i> Our Focus</div>
      <h2>${p.title}</h2>${p.body}
    </div>`;
  openModal('pillarModal');
}

// ============================================================
// PARTNER FORMS
// ============================================================
function handlePartnerForm(e) {
  e.preventDefault();
  const org = document.getElementById('partnerOrg').value;
  const contact = document.getElementById('partnerContact').value;
  const type = document.getElementById('partnerType').value;
  addToPendingSubmissions('Partnership Request', `${org} (${contact})`, { type, how: document.getElementById('partnerHow').value });
  closeModal('partnerFormModal'); e.target.reset();
  showToast(`Partnership request from ${org} received! We'll be in touch within 5 business days.`, 'success');
  logActivity(`New partnership request: ${org} — ${type}`, 'info');
}
function handleYouthPartner(e) {
  e.preventDefault();
  const name = document.getElementById('youthName').value;
  addToPendingSubmissions('Youth Partner Application', name, { role: document.getElementById('youthRole').value, age: document.getElementById('youthAge').value });
  closeModal('partnerModal'); e.target.reset();
  showToast(`Application received, ${name}! Our team will contact you within 48 hours.`, 'success');
  logActivity(`Youth partner application: ${name}`, 'info');
}

// ============================================================
// NEWSLETTER (with admin broadcast)
// ============================================================
const CS_NEWSLETTER_KEY = 'cs_newsletter_subs';
function getNewsletterSubs() { try { return JSON.parse(localStorage.getItem(CS_NEWSLETTER_KEY) || '[]'); } catch { return []; } }
function saveNewsletterSubs(s) { localStorage.setItem(CS_NEWSLETTER_KEY, JSON.stringify(s)); }

function handleNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value.trim();
  if (!email) return;
  const subs = getNewsletterSubs();
  if (!subs.includes(email)) { subs.push(email); saveNewsletterSubs(subs); }
  showToast('Subscribed! Welcome to the Childsphere newsletter.', 'success');
  logActivity(`Newsletter signup: ${email}`, 'info');
  e.target.reset();
  trackStat('newsletter_subs', subs.length);
}

function showNewsletterBroadcast() { requireAdmin(() => openModal('newsletterBroadcastModal')); }
function handleNewsletterBroadcast(e) {
  e.preventDefault();
  const subject = document.getElementById('broadcastSubject').value;
  const body    = document.getElementById('broadcastBody').value;
  const subs    = getNewsletterSubs();
  // In production: call email API here. For now, log it.
  showToast(`Broadcast sent to ${subs.length} subscriber${subs.length !== 1 ? 's' : ''}!`, 'success');
  logActivity(`Admin broadcast: "${subject}" → ${subs.length} subscribers`, 'success');
  closeModal('newsletterBroadcastModal'); e.target.reset();
}

// ============================================================
// USER DASHBOARD (My Applications, Inbox, Saved Videos)
// ============================================================
function openUserDashboard() {
  if (!window.currentUser) { openModal('loginModal'); return; }
  renderUserDashboard();
  openModal('userDashboardModal');
}

function renderUserDashboard() {
  const u = window.currentUser;
  // Applications tab
  const apps = getAllApplications().filter(a => a.uid === u.uid);
  const appHtml = apps.length ? apps.map(a => `
    <div class="dash-app-item">
      <div class="dash-app-info">
        <strong>${a.oppTitle || a.type}</strong>
        <span class="dash-app-date">${new Date(a.submittedAt).toLocaleDateString('en-GB')}</span>
      </div>
      <span class="dash-status dash-status-${a.status}">${a.status}</span>
    </div>`).join('')
    : '<div class="dash-empty">No applications yet. Browse <a href="#opportunities" onclick="closeModal(\'userDashboardModal\')">opportunities</a>.</div>';
  document.getElementById('dashApps').innerHTML = appHtml;

  // Inbox tab
  const msgs = getUserInbox(u.uid);
  const inboxHtml = msgs.length ? msgs.map(m => `
    <div class="dash-msg-item ${m.read ? '' : 'unread'}" onclick="markMsgRead('${u.uid}','${m.id}',this)">
      <div class="dash-msg-icon ${m.status || 'pending'}"><i class="fa-solid ${m.type === 'application' ? 'fa-file-alt' : 'fa-envelope'}"></i></div>
      <div class="dash-msg-body">
        <strong>${m.subject}</strong>
        <p>${m.body}</p>
        <span class="dash-app-date">${new Date(m.time).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
      </div>
      ${!m.read ? '<div class="unread-dot"></div>' : ''}
    </div>`).join('')
    : '<div class="dash-empty">Your inbox is empty.</div>';
  document.getElementById('dashInbox').innerHTML = inboxHtml;

  // Saved videos
  const savedIds  = JSON.parse(localStorage.getItem('cs_saved_videos') || '[]');
  const savedVids = (window.videosData || window.VIDEOS_DATA || []).filter(v => savedIds.includes(v.id));
  document.getElementById('dashSavedVideos').innerHTML = savedVids.length
    ? savedVids.map(v => `
      <div class="dash-video-item" onclick="openVideoLightbox('${v.youtubeId}','${v.title.replace(/'/g,"\\'")}','${v.id}')">
        <img src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg" alt="${v.title}">
        <span>${v.title}</span>
      </div>`).join('')
    : '<div class="dash-empty">No saved videos yet.</div>';

  // Profile
  document.getElementById('dashProfile').innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">${u.name.charAt(0).toUpperCase()}</div>
      <div class="profile-info">
        <h3>${u.name}</h3>
        <p><i class="fa-solid fa-envelope"></i> ${u.email || '—'}</p>
        <p><i class="fa-solid fa-phone"></i> ${u.phone || '—'}</p>
        <p><i class="fa-solid fa-location-dot"></i> ${u.city || ''} ${u.country ? ', ' + u.country : ''}</p>
        <p><i class="fa-solid fa-calendar"></i> Joined ${new Date(u.joinedAt).toLocaleDateString('en-GB', { month:'long', year:'numeric' })}</p>
      </div>
    </div>`;

  updateInboxBadge(u.uid);
}

function markMsgRead(uid, msgId, el) {
  const msgs = getUserInbox(uid);
  const msg  = msgs.find(m => String(m.id) === String(msgId));
  if (msg) { msg.read = true; saveUserInbox(uid, msgs); }
  el.classList.remove('unread');
  const dot = el.querySelector('.unread-dot');
  if (dot) dot.remove();
  updateInboxBadge(uid);
}

function switchDashTab(tab, btn) {
  document.querySelectorAll('.dash-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('dash' + tab).classList.add('active');
  btn.classList.add('active');
}

// ============================================================
// ADMIN PANEL
// ============================================================
function openAdminPanel() {
  updateAdminStats();
  renderPendingTable();
  renderAllUsersTable();
  renderActivityLog();
  renderNewsletterCount();
  document.getElementById('adminPanel').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeAdminPanel() {
  const p = document.getElementById('adminPanel');
  if (p) p.style.display = 'none';
  document.body.style.overflow = '';
}

function renderPendingTable() {
  const tbody = document.getElementById('pendingBody'); if (!tbody) return;
  const all = getAllApplications();
  const pending = all.filter(a => a.status === 'pending');
  if (!pending.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,.3);padding:1.5rem">No pending submissions</td></tr>';
    return;
  }
  tbody.innerHTML = pending.map(item => {
    const details = item.motivation
      ? `<div style="font-size:.75rem;color:#94A3B8;margin-top:3px;max-width:280px">
           <b>Why:</b> ${item.motivation.substring(0,100)}${item.motivation.length>100?'…':''}
           ${item.experience ? `<br><b>Exp:</b> ${item.experience.substring(0,80)}${item.experience.length>80?'…':''}` : ''}
           ${item.age ? `<br><b>Age:</b> ${item.age}` : ''}
           ${item.location ? `<br><b>Location:</b> ${item.location}` : ''}
         </div>` : '';
    return `<tr>
      <td>${item.type}</td>
      <td>${item.name}${details}</td>
      <td>${item.email || item.details?.email || '—'}</td>
      <td>${item.oppTitle || item.details?.city || '—'}</td>
      <td>${new Date(item.submittedAt).toLocaleDateString('en-GB')}</td>
      <td>
        <button class="admin-btn-approve" onclick="approveSubmission('${item.id}')">Approve</button>
        <button class="admin-btn-deny" onclick="denySubmission('${item.id}')">Deny</button>
      </td>
    </tr>`;
  }).join('');
}

function approveSubmission(id) {
  const all  = getAllApplications();
  const item = all.find(a => a.id == id); if (!item) return;
  item.status = 'approved';
  saveApplications(all);
  // Notify user via inbox
  if (item.uid) addInboxMessage(item.uid, {
    type: 'application', subject: 'Application Approved ✓',
    body: `Great news! Your application for "${item.oppTitle || item.type}" has been approved. Our team will contact you soon with next steps.`,
    status: 'approved',
  });
  renderPendingTable(); updateAdminStats();
  showToast(`Approved: ${item.name}`, 'success');
  logActivity(`Admin approved: ${item.name} — ${item.type}`, 'success');
}

function denySubmission(id) {
  if (!confirm('Deny this submission?')) return;
  const all  = getAllApplications();
  const item = all.find(a => a.id == id); if (!item) return;
  item.status = 'denied';
  saveApplications(all);
  if (item.uid) addInboxMessage(item.uid, {
    type: 'application', subject: 'Application Update',
    body: `Thank you for applying for "${item.oppTitle || item.type}". Unfortunately we are unable to proceed with your application at this time. We encourage you to apply again in the future.`,
    status: 'denied',
  });
  renderPendingTable(); updateAdminStats();
  showToast(`Denied: ${item.name}`, 'info');
  logActivity(`Admin denied: ${item.name} — ${item.type}`, 'warn');
}

function renderAllUsersTable() {
  const tbody = document.getElementById('allUsersBody'); if (!tbody) return;
  const users = Object.values(getStoredUsers());
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,.3);padding:1.5rem">No registered users yet</td></tr>';
    return;
  }
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone || '—'}</td>
      <td>${u.city || ''} ${u.country ? ', ' + u.country : ''}</td>
      <td>${new Date(u.joinedAt).toLocaleDateString('en-GB')}</td>
    </tr>`).join('');
}

function renderNewsletterCount() {
  const subs = getNewsletterSubs();
  safeSet('newsletterCount', subs.length + ' subscriber' + (subs.length !== 1 ? 's' : ''));
}

// ============================================================
// PWA
// ============================================================
let deferredInstallPrompt = null;
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredInstallPrompt = e;
    const b = document.getElementById('installBanner'); if (b) b.style.display = 'flex';
  });
  window.addEventListener('appinstalled', () => {
    const b = document.getElementById('installBanner'); if (b) b.style.display = 'none';
    deferredInstallPrompt = null;
    showToast('Childsphere installed on your device!', 'success');
  });
}
function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(r => { if (r.outcome === 'accepted') showToast('Installing...', 'success'); deferredInstallPrompt = null; });
}
function dismissInstall() { const b = document.getElementById('installBanner'); if (b) b.style.display = 'none'; }

// ============================================================
// MAIN INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Reveal observer
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Restore auth session
  restoreSession();

  // Apply age-based theme if logged in
  if (window.currentUser?.age) applyAgeTheme(window.currentUser.age);

  // Apply language
  setLang(currentLang);

  // Render all sections
  renderHero();
  renderGallery();
  renderVideos();
  renderOpportunities();
  renderTeam();
  renderBlog();
  renderGamesGrid();
  renderDonateAmounts();

  // Ensure first activity panel is active
  const firstPanel = document.querySelector('.act-panel');
  if (firstPanel && !document.querySelector('.act-panel.active')) {
    firstPanel.classList.add('active');
  }

  // Initialize donate method
  const firstMethod = document.querySelector('.donate-method-btn');
  if (firstMethod) firstMethod.classList.add('active');
  const donatePanel = document.getElementById('donateMethodPanel');
  if (donatePanel) {
    donatePanel.innerHTML = `<div class="donate-method-info"><i class="fa-solid fa-mobile-screen" style="color:#1E7DC2;font-size:1.5rem"></i><div><strong>Sonka Mobile Payment</strong><p>Fast mobile money payment — works with MTN, Airtel, Zamtel</p><button onclick="doSonkaDonate()" class="btn btn-white donate-btn" style="margin-top:.75rem"><i class="fa-solid fa-hand-holding-heart"></i> Donate via Sonka</button></div></div>`;
  }

  // Init PWA & WhatsApp
  initPWA();
  initWhatsApp();

  // Track visitor
  trackVisitor();
  logActivity('Visitor arrived at Childsphere', 'info');

  // Populate countries for signup
  populateCountries();

  console.log('%c Childsphere Ready ', 'background:#1E7DC2;color:white;padding:4px 12px;border-radius:6px;font-weight:bold');
});
