/* ============================================================
   CHILDSPHERE AUTH — auth.js
   Self-contained auth: works on any live site, no backend needed.
   SHA-256 hashing via Web Crypto API (built into every browser).
   Sessions persist across refreshes via localStorage.
============================================================ */

const CS_USERS_KEY   = 'cs_users_v3';
const CS_SESSION_KEY = 'cs_session_v3';
const CS_INBOX_KEY   = 'cs_inbox_v1';
const CS_APPS_KEY    = 'cs_applications_v1';

// ---- Admin credentials (change to your real ones) ----------
const ADMIN_ACCOUNTS = [
  { email: 'admin@childsphere.zm', password: '123456', name: 'Admin' },
];
// -----------------------------------------------------------

window.currentUser = null;
window.isAdminUser = false;

// Hash password with SHA-256 + site salt (browser built-in)
async function hashPassword(password) {
  const data = new TextEncoder().encode(password + 'cs_salt_v3_2025');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredUsers() {
  try { return JSON.parse(localStorage.getItem(CS_USERS_KEY) || '{}'); } catch { return {}; }
}
function saveStoredUsers(u) { localStorage.setItem(CS_USERS_KEY, JSON.stringify(u)); }
function getSession()       { try { return JSON.parse(localStorage.getItem(CS_SESSION_KEY) || 'null'); } catch { return null; } }
function saveSession(u)     { localStorage.setItem(CS_SESSION_KEY, JSON.stringify(u)); }
function clearSession()     { localStorage.removeItem(CS_SESSION_KEY); }

// Applications store
function getAllApplications() { try { return JSON.parse(localStorage.getItem(CS_APPS_KEY) || '[]'); } catch { return []; } }
function saveApplications(a)  { localStorage.setItem(CS_APPS_KEY, JSON.stringify(a)); }

// Inbox store
function getUserInbox(uid) {
  try {
    const all = JSON.parse(localStorage.getItem(CS_INBOX_KEY) || '{}');
    return all[uid] || [];
  } catch { return []; }
}
function saveUserInbox(uid, msgs) {
  const all = JSON.parse(localStorage.getItem(CS_INBOX_KEY) || '{}');
  all[uid] = msgs;
  localStorage.setItem(CS_INBOX_KEY, JSON.stringify(all));
}
function addInboxMessage(uid, msg) {
  const msgs = getUserInbox(uid);
  msgs.unshift({ id: Date.now(), ...msg, read: false, time: new Date().toISOString() });
  saveUserInbox(uid, msgs);
  // Update unread badge
  updateInboxBadge(uid);
}
function updateInboxBadge(uid) {
  const msgs = getUserInbox(uid);
  const unread = msgs.filter(m => !m.read).length;
  const badge = document.getElementById('inboxBadge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }
}

// ---- Signup -----------------------------------------------
async function handleSignup(e) {
  e.preventDefault();
  const btn      = e.target.querySelector('[type="submit"]');
  const origText = btn.innerHTML;
  const name     = document.getElementById('signupName').value.trim();
  const age      = parseInt(document.getElementById('signupAge').value);
  const email    = document.getElementById('signupEmail').value.trim().toLowerCase();
  const phone    = document.getElementById('signupPhone').value.trim();
  const country  = document.getElementById('signupCountry').value;
  const city     = document.getElementById('signupCity').value;
  const pass     = document.getElementById('signupPass').value;

  if (!name || !email || !country || !city || !pass) {
    return showAuthError('signupError', 'Please fill in all required fields.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return showAuthError('signupError', 'Please enter a valid email address.');
  }
  if (pass.length < 6) {
    return showAuthError('signupError', 'Password must be at least 6 characters.');
  }

  setBtnLoading(btn, true);
  try {
    const users = getStoredUsers();
    if (users[email]) {
      return showAuthError('signupError', 'An account with that email already exists. Please login.');
    }
    const passwordHash = await hashPassword(pass);
    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
    const user = { uid, name, age, email, phone, country, city, role:'member', joinedAt: new Date().toISOString(), passwordHash };
    users[email] = user;
    saveStoredUsers(users);

    const { passwordHash:_, ...sessionUser } = user;
    saveSession(sessionUser);
    window.currentUser = sessionUser;
    window.isAdminUser = false;

    closeModal('signupModal');
    e.target.reset();
    clearSignupCities();
    showUserUI();
    showToast(`Welcome to Childsphere, ${name}! 🎉`, 'success');
    logActivity(`New signup: ${name} from ${city}, ${country}`, 'info');
    addToPendingSubmissions('Account Signup', name, { age, country, city, email, phone });
    trackStat('signups', 1);
  } catch(err) {
    showAuthError('signupError', 'Signup failed. Please try again.');
    console.error(err);
  } finally {
    setBtnLoading(btn, false, origText);
  }
}

// ---- Login ------------------------------------------------
async function handleLogin(e) {
  e.preventDefault();
  const btn      = e.target.querySelector('[type="submit"]');
  const origText = btn.innerHTML;
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass     = document.getElementById('loginPass').value;

  if (!email || !pass) {
    return showAuthError('loginError', 'Please enter your email and password.');
  }

  setBtnLoading(btn, true);
  try {
    // Check admin first
    const admin = ADMIN_ACCOUNTS.find(a => a.email.toLowerCase() === email && a.password === pass);
    if (admin) {
      const adminSession = { uid:'admin_001', name:'Admin', email: admin.email, role:'admin', joinedAt: new Date().toISOString() };
      saveSession(adminSession);
      window.currentUser = adminSession;
      window.isAdminUser = true;
      closeModal('loginModal');
      e.target.reset();
      showUserUI();
      showToast('Welcome back, Admin! Dashboard is ready.', 'success');
      logActivity('Admin logged in', 'success');
      trackStat('logins', 1);
      return;
    }

    // Regular user
    const users = getStoredUsers();
    if (!users[email]) {
      return showAuthError('loginError', 'No account found with that email. Please sign up first.');
    }
    const hashed = await hashPassword(pass);
    if (users[email].passwordHash !== hashed) {
      return showAuthError('loginError', 'Incorrect password. Please try again.');
    }

    const { passwordHash:_, ...sessionUser } = users[email];
    saveSession(sessionUser);
    window.currentUser = sessionUser;
    window.isAdminUser = false;
    closeModal('loginModal');
    e.target.reset();
    showUserUI();
    showToast(`Welcome back, ${sessionUser.name}!`, 'success');
    logActivity(`User logged in: ${sessionUser.name}`, 'success');
    trackStat('logins', 1);
    updateInboxBadge(sessionUser.uid);
  } catch(err) {
    showAuthError('loginError', 'Login failed. Please try again.');
    console.error(err);
  } finally {
    setBtnLoading(btn, false, origText);
  }
}

// ---- Forgot Password --------------------------------------
async function handleForgotPassword(e) {
  e.preventDefault();
  const btn      = e.target.querySelector('[type="submit"]');
  const origText = btn.innerHTML;
  const email    = document.getElementById('forgotEmail').value.trim().toLowerCase();
  const newPass  = document.getElementById('forgotNewPass').value;

  if (!email || !newPass) return showAuthError('forgotError', 'Please fill in all fields.');
  if (newPass.length < 6)  return showAuthError('forgotError', 'New password must be at least 6 characters.');

  setBtnLoading(btn, true);
  try {
    const users = getStoredUsers();
    if (!users[email]) {
      return showAuthError('forgotError', 'No account found with that email address.');
    }
    users[email].passwordHash = await hashPassword(newPass);
    saveStoredUsers(users);
    closeModal('forgotModal');
    e.target.reset();
    showToast('Password reset successfully! You can now login.', 'success');
  } catch(err) {
    showAuthError('forgotError', 'Reset failed. Please try again.');
  } finally {
    setBtnLoading(btn, false, origText);
  }
}

// ---- Logout -----------------------------------------------
function logout() {
  clearSession();
  window.currentUser = null;
  window.isAdminUser = false;
  document.getElementById('authBtns').style.display = 'flex';
  document.getElementById('userMenu').style.display = 'none';
  document.getElementById('adminBtn').style.display = 'none';
  document.body.classList.remove('admin-logged-in');
  updateMobileAuth();
  showToast('Logged out. See you soon!', 'info');
  logActivity('User logged out', 'info');
}

// ---- Restore session on page load -------------------------
function restoreSession() {
  const s = getSession();
  if (!s) return;
  window.currentUser = s;
  window.isAdminUser = s.role === 'admin';
  showUserUI();
  if (s.uid) updateInboxBadge(s.uid);
}

// ---- UI Helpers -------------------------------------------
function showUserUI() {
  document.getElementById('authBtns').style.display = 'none';
  document.getElementById('userMenu').style.display = 'flex';
  const u = window.currentUser;
  document.getElementById('greeting').textContent = `Hi, ${u.name}`;
  document.getElementById('userAvatar').textContent = u.name.charAt(0).toUpperCase();
  if (window.isAdminUser) {
    document.getElementById('adminBtn').style.display = 'inline-flex';
    document.body.classList.add('admin-logged-in');
    const fbStatus = document.getElementById('fbStatus');
    if (fbStatus) { fbStatus.textContent = 'Live ✓'; fbStatus.style.color = '#34D399'; }
  }
  // Apply age-based theme
  if (typeof applyAgeTheme === 'function') applyAgeTheme(u.age);
  // Re-render opportunities so admin notice shows correctly
  if (typeof renderOpportunities === 'function') renderOpportunities();
  updateMobileAuth();
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}
function clearAuthErrors() {
  ['loginError','signupError','forgotError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function setBtnLoading(btn, loading, origText) {
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = '<span class="auth-spinner"></span> Please wait...';
  } else {
    btn.disabled = false;
    if (origText) btn.innerHTML = origText;
  }
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('i');
  input.type  = input.type === 'password' ? 'text' : 'password';
  icon.className = input.type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
}

function updatePasswordStrength(val) {
  const bar   = document.getElementById('passBar');
  const label = document.getElementById('passLabel');
  if (!bar || !label) return;
  let score = 0;
  if (val.length >= 6)  score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { pct:'0%', color:'#E11D48', text:'Enter a password' },
    { pct:'20%', color:'#E11D48', text:'Too weak' },
    { pct:'40%', color:'#F59E0B', text:'Weak' },
    { pct:'60%', color:'#F59E0B', text:'Fair' },
    { pct:'80%', color:'#059669', text:'Good' },
    { pct:'100%', color:'#059669', text:'Strong ✓' },
  ];
  const l = levels[score] || levels[0];
  bar.style.width = l.pct; bar.style.background = l.color;
  label.textContent = l.text; label.style.color = l.color;
}

// Country → City dropdown
function populateCountries() {
  const sel = document.getElementById('signupCountry'); if (!sel) return;
  sel.innerHTML = '<option value="">Select country</option>';
  (window.COUNTRIES || []).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code; opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

function onCountryChange(code) {
  const citySelect = document.getElementById('signupCity'); if (!citySelect) return;
  const country = (window.COUNTRIES || []).find(c => c.code === code);
  citySelect.innerHTML = '<option value="">Select city / town</option>';
  if (country) {
    country.cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city; opt.textContent = city;
      citySelect.appendChild(opt);
    });
    citySelect.disabled = false;
  } else {
    citySelect.disabled = true;
  }
}
function clearSignupCities() {
  const c = document.getElementById('signupCity'); if (c) c.innerHTML = '';
}

// Pending submissions (for admin review)
function addToPendingSubmissions(type, name, details) {
  const all = getAllApplications();
  all.unshift({
    id: Date.now(),
    type, name, details,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    uid: window.currentUser?.uid || 'guest',
  });
  saveApplications(all);
  trackStat('pending', all.filter(a => a.status === 'pending').length);
}
