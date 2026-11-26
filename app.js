/* app.js */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://fcvdpcpvxnjudjxrlegi.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_-8BgJ5TqD77cQlHALIudOA_f5OJuEK3';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const $ = (sel) => document.querySelector(sel);
  let hideBalances = false;
  let cashflowChartInstance = null;
  let lastNavRect = null;
  let lastMobileNavRect = null;

  /* ===== AUTO LOGOUT 5 MENIT IDLE / TUTUP BROWSER ===== */
  const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 menit
  const LAST_ACTIVE_KEY = 'saku_last_active';
  let idleTimer = null;

  async function forceSessionExpired() {
    clearTimeout(idleTimer);
    localStorage.removeItem(LAST_ACTIVE_KEY);
    await supabase.auth.signOut();
    lastNavRect = null;
    lastMobileNavRect = null;
    window.location.hash = '#login';
    setTimeout(() => {
      showToast('Sesi berakhir setelah 5 menit tidak aktif. Silakan login ulang.', 'error');
    }, 150);
  }

  function recordActivity() {
    const hash = window.location.hash || '#login';
    if (hash === '#login' || hash === '#register') return;

    const now = Date.now();
    const prev = Number(localStorage.getItem(LAST_ACTIVE_KEY) || 0);
    if (prev && (now - prev) >= SESSION_TIMEOUT_MS) {
      forceSessionExpired();
      return;
    }

    localStorage.setItem(LAST_ACTIVE_KEY, String(now));
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      forceSessionExpired();
    }, SESSION_TIMEOUT_MS);
  }

  ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, recordActivity, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) recordActivity();
  });

  /* ===== PERSISTENT SHELL RENDERER (AGAR NAVBAR TIDAK DI-RECREATE) ===== */
  function renderInShell(activeTab, pageHtml, user) {
    const existingNavbar = $('.top-navbar');
    const existingWrapper = $('.page-wrapper');

    if (existingNavbar && existingWrapper) {
      const temp = document.createElement('div');
      temp.innerHTML = UI.Shell(activeTab, pageHtml, user);
      const nextWrapper = temp.querySelector('.page-wrapper');

      if (nextWrapper) {
        existingWrapper.replaceWith(nextWrapper);
      } else {
        $('#app').innerHTML = UI.Shell(activeTab, pageHtml, user);
        syncNavGlassIndicator(false);
        return;
      }

      const targetHash = '#' + activeTab;
      document.querySelectorAll('#navbar-links a[data-nav]').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === targetHash);
      });
      document.querySelectorAll('.mobile-bottom-nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === targetHash);
      });

      syncNavGlassIndicator(true);
    } else {
      $('#app').innerHTML = UI.Shell(activeTab, pageHtml, user);
      syncNavGlassIndicator(false);
    }
  }

  /* ===== CUSTOM LIQUID GLASS SELECT DROPDOWN ===== */
  function initGlassSelects(root = document) {
    root.querySelectorAll('select').forEach(select => {
      if (select.dataset.glassInit === '1') {
        syncGlassSelectUI(select);
        return;
      }
      select.dataset.glassInit = '1';
      select.style.display = 'none';

      const wrapper = document.createElement('div');
      wrapper.className = 'glass-select';
      if (select.style.minWidth) wrapper.style.minWidth = select.style.minWidth;

      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'glass-select-trigger';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'glass-select-label';

      const arrowSpan = document.createElement('span');
      arrowSpan.className = 'glass-select-arrow';
      arrowSpan.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

      trigger.appendChild(labelSpan);
      trigger.appendChild(arrowSpan);

      const menu = document.createElement('div');
      menu.className = 'glass-select-menu';

      wrapper.appendChild(trigger);
      wrapper.appendChild(menu);
      select.parentNode.insertBefore(wrapper, select.nextSibling);
      select._glassWrapper = wrapper;

      syncGlassSelectUI(select);

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('is-open');
        document.querySelectorAll('.glass-select.is-open').forEach(el => el.classList.remove('is-open'));
        if (!isOpen) wrapper.classList.add('is-open');
      });
    });
  }

  function syncGlassSelectUI(select) {
    const wrapper = select._glassWrapper;
    if (!wrapper) return;
    const labelSpan = wrapper.querySelector('.glass-select-label');
    const menu = wrapper.querySelector('.glass-select-menu');

    const selectedOpt = select.options[select.selectedIndex] || select.options[0];
    labelSpan.textContent = selectedOpt ? selectedOpt.textContent : '';

    menu.innerHTML = '';
    Array.from(select.options).forEach((opt, idx) => {
      const item = document.createElement('div');
      item.className = 'glass-select-option' + (idx === select.selectedIndex ? ' is-selected' : '');
      item.innerHTML = `<span>${UI.esc(opt.textContent)}</span>${idx === select.selectedIndex ? '<span class="glass-check">✓</span>' : ''}`;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        select.value = opt.value;
        wrapper.classList.remove('is-open');
        syncGlassSelectUI(select);
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      menu.appendChild(item);
    });
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.glass-select.is-open').forEach(el => el.classList.remove('is-open'));
  });

  function syncNavGlassIndicator(animate = true) {
    // 1. Desktop & Tablet Top Navbar Pill
    const container = $('#navbar-links');
    const indicator = $('#nav-glass-indicator');
    const activeLink = container ? container.querySelector('a.active') : null;
    if (container && indicator && activeLink) {
      const targetLeft = activeLink.offsetLeft;
      const targetWidth = activeLink.offsetWidth;

      if (!animate) {
        indicator.style.transition = 'none';
      } else {
        indicator.style.transition = 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), width 0.34s cubic-bezier(0.22, 1, 0.36, 1)';
      }

      indicator.style.transform = `translate3d(${targetLeft}px, 0, 0)`;
      indicator.style.width = `${targetWidth}px`;
      lastNavRect = { left: targetLeft, width: targetWidth };

      container.querySelectorAll('a[data-nav]').forEach(link => {
        if (link.dataset.glassBound === '1') return;
        link.dataset.glassBound = '1';
        link.addEventListener('pointerdown', () => {
          const nextLeft = link.offsetLeft;
          const nextWidth = link.offsetWidth;
          indicator.style.transition = 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), width 0.34s cubic-bezier(0.22, 1, 0.36, 1)';
          indicator.style.transform = `translate3d(${nextLeft}px, 0, 0)`;
          indicator.style.width = `${nextWidth}px`;
          lastNavRect = { left: nextLeft, width: nextWidth };
          container.querySelectorAll('a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        });
      });
    }

    // 2. Mobile Bottom Navbar Sliding Pill
    const mobileNav = $('.mobile-bottom-nav');
    if (mobileNav) {
      let mIndicator = mobileNav.querySelector('.mobile-nav-indicator');
      if (!mIndicator) {
        mIndicator = document.createElement('div');
        mIndicator.className = 'mobile-nav-indicator';
        mobileNav.prepend(mIndicator);
      }

      const activeMobileLink = mobileNav.querySelector('a.active');
      if (activeMobileLink && activeMobileLink.offsetWidth > 0) {
        const targetLeft = activeMobileLink.offsetLeft;
        const targetWidth = activeMobileLink.offsetWidth;

        if (!animate) {
          mIndicator.style.transition = 'none';
        } else {
          mIndicator.style.transition = 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), width 0.34s cubic-bezier(0.22, 1, 0.36, 1)';
        }

        mIndicator.style.transform = `translate3d(${targetLeft}px, 0, 0)`;
        mIndicator.style.width = `${targetWidth}px`;
        lastMobileNavRect = { left: targetLeft, width: targetWidth };
      }

      mobileNav.querySelectorAll('a').forEach(link => {
        if (link.dataset.mobileGlassBound === '1') return;
        link.dataset.mobileGlassBound = '1';
        link.addEventListener('pointerdown', () => {
          const nextLeft = link.offsetLeft;
          const nextWidth = link.offsetWidth;
          mIndicator.style.transition = 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), width 0.34s cubic-bezier(0.22, 1, 0.36, 1)';
          mIndicator.style.transform = `translate3d(${nextLeft}px, 0, 0)`;
          mIndicator.style.width = `${nextWidth}px`;
          lastMobileNavRect = { left: nextLeft, width: nextWidth };
          mobileNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        });
      });
    }
  }

  window.addEventListener('resize', () => syncNavGlassIndicator(false));

  function applyPrivacyState(animate = false) {
    document.querySelectorAll('.money-val').forEach(el => {
      const original = el.getAttribute('data-val') || el.textContent;
      const targetText = hideBalances ? 'Rp ••••••' : original;
      if (el.textContent === targetText) return;

      if (animate) {
        el.classList.add('is-switching');
        setTimeout(() => {
          el.textContent = targetText;
          el.classList.remove('is-switching');
        }, 120);
      } else {
        el.textContent = targetText;
      }
    });

    const btnPrivacy = $('#btn-toggle-privacy');
    if (btnPrivacy) {
      btnPrivacy.classList.toggle('is-hidden', hideBalances);
      btnPrivacy.innerHTML = `${UI.EyeIcon(hideBalances)}<span>${hideBalances ? 'Tampilkan saldo' : 'Sembunyikan'}</span>`;
    }
  }

  function getISOWeekString(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  function getDefaultFilterValue(periodType) {
    const now = new Date();
    if (periodType === 'daily') return now.toISOString().slice(0, 10);
    if (periodType === 'weekly') return getISOWeekString(now);
    if (periodType === 'yearly') return String(now.getFullYear());
    return now.toISOString().slice(0, 7);
  }

  function getPeriodRange(periodType, filterValue) {
    const val = filterValue || getDefaultFilterValue(periodType);

    if (periodType === 'daily') {
      const label = new Date(val + 'T00:00:00').toLocaleDateString('id-ID', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
      });
      return { startDate: val, endDate: val, periodLabel: label, budgetFactor: 1 / 30 };
    }

    if (periodType === 'weekly') {
      const [yStr, wStr] = val.split('-W');
      const y = Number(yStr);
      const w = Number(wStr);
      const simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
      const dow = simple.getUTCDay();
      const monday = new Date(simple);
      if (dow <= 4) monday.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
      else monday.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
      const sunday = new Date(monday);
      sunday.setUTCDate(monday.getUTCDate() + 6);

      const startDate = monday.toISOString().slice(0, 10);
      const endDate = sunday.toISOString().slice(0, 10);
      const fmt = (d) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return {
        startDate,
        endDate,
        periodLabel: `Minggu ${w} (${fmt(monday)} – ${fmt(sunday)} ${y})`,
        budgetFactor: 1 / 4
      };
    }

    if (periodType === 'yearly') {
      return {
        startDate: `${val}-01-01`,
        endDate: `${val}-12-31`,
        periodLabel: `Tahun ${val}`,
        budgetFactor: 12
      };
    }

    const [y, m] = val.split('-').map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    const label = new Date(y, m - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    return {
      startDate: `${val}-01`,
      endDate: `${val}-${String(lastDay).padStart(2, '0')}`,
      periodLabel: label,
      budgetFactor: 1
    };
  }

  function calculateFinance(d, user = null) {
    const income = Math.max(0, Number(d.monthly_income) || 0);
    const needs = Math.max(0, Number(d.needs_expense) || 0) + Math.max(0, Number(d.debt_installment) || 0);
    const wants = Math.max(0, Number(d.wants_expense) || 0);
    const expenses = needs + wants;
    const emergency = Math.max(0, Number(d.emergency_fund) || 0);
    const dependents = parseInt(d.dependents, 10) || 0;
    const debt = Math.max(0, Number(d.total_debt) || 0);
    const ratio = income > 0 ? (expenses / income) * 100 : 0;
    const targetMultiplier = dependents <= 0 ? 3 : (dependents === 1 ? 6 : 9);
    const target = expenses * targetMultiplier;
    const gap = Math.max(0, target - emergency);
    
    let autoMethod = 'ZBB';
    if (d.income_type === 'fixed' && ratio <= 80 && emergency >= target && ratio <= 70) {
      autoMethod = '50/30/20';
    } else if (d.income_type === 'fixed' && ratio <= 80 && emergency >= target && ratio > 70) {
      autoMethod = '80/20';
    } else if (d.income_type === 'fixed' && ratio <= 80 && emergency < target) {
      autoMethod = '40/30/20/10';
    }

    const manualMethod = user?.user_metadata?.preferred_method || null;
    const isManualMethod = Boolean(manualMethod && ['50/30/20', '80/20', '40/30/20/10', 'ZBB'].includes(manualMethod));
    const method = isManualMethod ? manualMethod : autoMethod;

    let reason = 'Setiap rupiah diberi tugas jelas hingga sisa alokasi nol.';
    let allocations = [
      { label: 'Kebutuhan & Cicilan', pct: 50, color: '#143B2D' },
      { label: 'Keinginan', pct: 20, color: '#8BB5A3' },
      { label: 'Tabungan & Investasi', pct: 20, color: '#C8F169' },
      { label: 'Dana Darurat', pct: 10, color: '#F4B860' }
    ];
    let targetNeeds = income * 0.5;

    if (method === '50/30/20') {
      reason = isManualMethod ? 'Metode seimbang pilihanmu untuk kebutuhan, keinginan, dan masa depan.' : 'Dana darurat aman & pengeluaran terkendali.';
      allocations = [
        { label: 'Kebutuhan', pct: 50, color: '#143B2D' },
        { label: 'Keinginan', pct: 30, color: '#8BB5A3' },
        { label: 'Tabungan / Investasi', pct: 20, color: '#C8F169' }
      ];
      targetNeeds = income * 0.5;
    } else if (method === '80/20') {
      reason = isManualMethod ? 'Metode praktis dua pos pilihanmu agar lebih mudah konsisten.' : 'Dana darurat aman. Metode 80/20 praktis untukmu.';
      allocations = [
        { label: 'Semua Pengeluaran (Kebutuhan & Keinginan)', pct: 80, color: '#143B2D' },
        { label: 'Tabungan / Investasi', pct: 20, color: '#C8F169' }
      ];
      targetNeeds = income * 0.8;
    } else if (method === '40/30/20/10') {
      reason = isManualMethod ? 'Fokus menabung sambil mempercepat pembangunan dana darurat.' : 'Dana darurat belum penuh, prioritas bangun cadangan aman.';
      allocations = [
        { label: 'Kebutuhan', pct: 40, color: '#143B2D' },
        { label: 'Keinginan', pct: 30, color: '#8BB5A3' },
        { label: 'Tabungan / Investasi', pct: 20, color: '#C8F169' },
        { label: 'Dana Darurat', pct: 10, color: '#F4B860' }
      ];
      targetNeeds = income * 0.4;
    }

    const needsOver = method === '80/20' ? Math.max(0, expenses - targetNeeds) : Math.max(0, needs - targetNeeds);
    const monthlySavingAll = income - expenses;
    const monthlyInvestPlan = Number(d.plan_investment) || 0;
    const monthsNoInvest = (gap <= 0) ? 0 : (monthlySavingAll > 0 ? Math.ceil(gap / monthlySavingAll) : null);
    const monthlyEmergWithInvest = Math.max(0, monthlySavingAll - monthlyInvestPlan);
    const monthsWithInvest = (gap <= 0) ? 0 : (monthlyEmergWithInvest > 0 ? Math.ceil(gap / monthlyEmergWithInvest) : null);
    
    const months = gap <= 0 ? 0 : (monthlySavingAll > 0 ? Math.ceil(gap / monthlySavingAll) : null);
    const reflection = income > 0 && wants > income * 0.30 ? 'Porsi keinginanmu sudah lebih dari 30% gaji. Mana yang bisa ditunda agar tujuan utamamu tetap berjalan?' : null;
    const assets = emergency + Math.max(0, Number(d.savings) || 0) + Math.max(0, Number(d.investments) || 0) + Math.max(0, Number(d.other_assets) || 0);
    
    return {
      income, needs, wants, expenses, emergency, dependents, targetMultiplier,
      ratio, target, gap, method, autoMethod, isManualMethod, reason, allocations, targetNeeds, needsOver,
      monthlySavingAll, monthlyInvestPlan, monthsNoInvest, monthsWithInvest,
      monthlyEmergWithInvest, months, reflection, assets,
      netWorth: assets - debt, debt, investments: Number(d.investments) || 0,
      progress: target > 0 ? Math.min(100, (emergency / target) * 100) : 0
    };
  }

  async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY) || 0);
    if (lastActive && (Date.now() - lastActive) >= SESSION_TIMEOUT_MS) {
      localStorage.removeItem(LAST_ACTIVE_KEY);
      await supabase.auth.signOut();
      return null;
    }

    recordActivity();
    return session.user;
  }

  async function render() {
    const hash = window.location.hash || '#login';

    if (hash === '#logout') {
      showLogoutModal();
      return;
    }

    if (!$('.top-navbar')) {
      $('#app').innerHTML = UI.Loader();
    }
    const user = await getUser();

    if (!user) {
      clearTimeout(idleTimer);
      lastNavRect = null;
      lastMobileNavRect = null;
      if (hash === '#register') attachRegisterEvents();
      else attachLoginEvents();
      return;
    }

    if (hash.startsWith('#dashboard')) await loadDashboard(user);
    else if (hash.startsWith('#transaksi')) await loadTransaksi(user);
    else if (hash.startsWith('#data')) await loadData(user);
    else if (hash.startsWith('#refleksi')) await loadRefleksi(user);
    else if (hash.startsWith('#investasi')) await loadInvestasi(user);
    else if (hash.startsWith('#onboarding')) {
      renderInShell('dashboard', UI.Onboarding(user), user);
      attachProfileEvents(user);
    } else {
      window.location.hash = '#dashboard';
    }
    initGlassSelects();
    applyPrivacyState();
  }

  function attachLoginEvents() {
    $('#app').innerHTML = UI.Login();
    $('#login-form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const btn = ev.target.querySelector('button');
      btn.textContent = 'Memproses...';
      btn.disabled = true;

      const fd = new FormData(ev.target);
      const { error } = await supabase.auth.signInWithPassword({
        email: String(fd.get('email')).trim(),
        password: String(fd.get('password'))
      });
      if (error) {
        $('#auth-error').innerHTML = `<div class="alert danger">${UI.esc(error.message)}</div>`;
        btn.textContent = 'Masuk ke Saku';
        btn.disabled = false;
        return;
      }
      localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
      window.location.hash = '#dashboard';
    });

    const btnForgot = $('#btn-forgot-password');
    if (btnForgot) {
      btnForgot.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotModal();
      });
    }
  }

  function showForgotModal() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = UI.ForgotModal();
    const overlay = wrapper.firstElementChild;
    document.body.appendChild(overlay);

    let resetEmail = '';
    const close = () => overlay.remove();
    $('#btn-close-forgot').addEventListener('click', close);
    $('#btn-cancel-forgot').addEventListener('click', close);

    $('#forgot-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#btn-send-reset');
      btn.textContent = 'Mengirim OTP...';
      btn.disabled = true;

      resetEmail = new FormData(e.target).get('reset_email').trim();
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);

      if (error) {
        showToast('Gagal mengirim OTP: ' + error.message, 'error');
        btn.textContent = 'Kirim Kode OTP';
        btn.disabled = false;
        return;
      }

      $('#forgot-step-1').style.display = 'none';
      $('#forgot-step-2').style.display = 'block';
      $('#forgot-otp-desc').innerHTML = `Masukkan 6 digit kode OTP yang dikirim ke <b>${UI.esc(resetEmail)}</b> beserta kata sandi barumu.`;
      showToast('Kode OTP 6 digit telah dikirim ke emailmu!', 'success');
    });

    $('#btn-resend-reset-otp').addEventListener('click', async () => {
      if (!resetEmail) return;
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) showToast('Gagal kirim ulang: ' + error.message, 'error');
      else showToast('Kode OTP baru telah dikirim ulang!', 'success');
    });

    $('#forgot-otp-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#btn-verify-reset-otp');
      btn.textContent = 'Memverifikasi...';
      btn.disabled = true;

      const fd = new FormData(e.target);
      const token = String(fd.get('otp_code')).trim();
      const newPassword = String(fd.get('new_password'));

      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: resetEmail,
        token,
        type: 'recovery'
      });

      if (verifyErr) {
        showToast('Kode OTP salah atau kedaluwarsa: ' + verifyErr.message, 'error');
        btn.textContent = 'Simpan Sandi';
        btn.disabled = false;
        return;
      }

      const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
      if (updateErr) {
        showToast('Gagal menyimpan kata sandi baru: ' + updateErr.message, 'error');
        btn.textContent = 'Simpan Sandi';
        btn.disabled = false;
        return;
      }

      close();
      localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
      showToast('Kata sandi berhasil diubah! Selamat datang kembali.', 'success');
      window.location.hash = '#dashboard';
    });
  }

  function attachRegisterEvents() {
    $('#app').innerHTML = UI.Register();
    let pendingEmail = '';

    $('#register-form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const btn = ev.target.querySelector('button');
      btn.textContent = 'Mengirim OTP...';
      btn.disabled = true;

      const fd = new FormData(ev.target);
      pendingEmail = String(fd.get('email')).trim();
      const { error } = await supabase.auth.signUp({
        email: pendingEmail,
        password: String(fd.get('password')),
        options: { data: { name: String(fd.get('name')).trim() } }
      });
      
      if (error) {
        $('#auth-error').innerHTML = `<div class="alert danger">${UI.esc(error.message)}</div>`;
        btn.textContent = 'Kirim Kode OTP';
        btn.disabled = false;
        return;
      }

      $('#register-step-1').style.display = 'none';
      $('#register-step-2').style.display = 'block';
      $('#register-otp-desc').innerHTML = `Masukkan 6 digit kode OTP yang dikirim ke <b>${UI.esc(pendingEmail)}</b>.`;
      showToast('Kode OTP 6 digit telah dikirim ke emailmu!', 'success');
    });

    $('#btn-resend-signup-otp').addEventListener('click', async () => {
      if (!pendingEmail) return;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail
      });
      if (error) showToast('Gagal kirim ulang: ' + error.message, 'error');
      else showToast('Kode OTP baru telah dikirim ke emailmu!', 'success');
    });

    $('#register-otp-form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const btn = $('#btn-verify-signup-otp');
      btn.textContent = 'Memverifikasi...';
      btn.disabled = true;

      const token = String(new FormData(ev.target).get('otp_code')).trim();
      const { error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token,
        type: 'signup'
      });

      if (error) {
        $('#otp-register-error').innerHTML = `<div class="alert danger">Kode OTP tidak valid: ${UI.esc(error.message)}</div>`;
        btn.textContent = 'Verifikasi & Aktifkan Akun';
        btn.disabled = false;
        return;
      }

      localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
      showToast('Email terverifikasi! Selamat datang di Saku.', 'success');
      window.location.hash = '#onboarding';
    });
  }

  function renderCashflowChart(c) {
    const canvas = document.getElementById('cashflow-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (cashflowChartInstance) {
      cashflowChartInstance.destroy();
    }

    const sisa = Math.max(0, c.monthlySavingAll);
    const hasData = c.needs > 0 || c.wants > 0 || sisa > 0;

    cashflowChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: hasData ? ['Kebutuhan & Cicilan', 'Keinginan', 'Sisa / Tabungan'] : ['Belum ada data'],
        datasets: [{
          data: hasData ? [c.needs, c.wants, sisa] : [1],
          backgroundColor: hasData ? ['#143B2D', '#8BB5A3', '#C8F169'] : ['#E5E7EB'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 16,
              font: { family: "'DM Sans', sans-serif", size: 12.5 }
            }
          },
          tooltip: {
            enabled: hasData,
            callbacks: {
              label: (ctx) => hideBalances ? ` ${ctx.label}: Rp ••••••` : ` ${ctx.label}: ${UI.rpPlain(ctx.raw)}`
            }
          }
        }
      }
    });
  }

  function exportFinanceCSV(c, profile, txs) {
    const rows = [
      ['RINGKASAN KEUANGAN SAKU', new Date().toLocaleDateString('id-ID')],
      ['Metode Aktif', c.method],
      ['Gaji Bersih / Bulan', c.income],
      ['Kebutuhan & Cicilan', c.needs],
      ['Keinginan', c.wants],
      ['Total Pengeluaran Bulanan', c.expenses],
      ['Sisa Anggaran Bulanan', c.monthlySavingAll],
      ['Dana Darurat Terkumpul', c.emergency],
      ['Target Dana Darurat', c.target],
      ['Investasi / Emas', c.investments],
      ['Sisa Utang', c.debt],
      ['Kekayaan Bersih Likuid', c.netWorth],
      [],
      ['RIWAYAT TRANSAKSI BULAN INI'],
      ['Tanggal', 'Jenis', 'Kategori', 'Nominal', 'Catatan'],
      ...txs.map(t => [t.tx_date, t.type === 'income' ? 'Pemasukan' : 'Pengeluaran', t.category, t.amount, t.note || '-'])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Saku_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('File CSV berhasil diunduh!', 'success');
  }

  async function loadDashboard(user) {
    const { data: profile } = await supabase.from('financial_profiles').select('*').eq('user_id', user.id).single();
    if (!profile) {
      window.location.hash = '#onboarding';
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const { startDate, endDate } = getPeriodRange('monthly', currentMonth);
    const { data: monthTxs } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('tx_date', startDate)
      .lte('tx_date', endDate);

    const txs = monthTxs || [];
    const monthExpense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const txSummary = { monthExpense, count: txs.length };
    
    const c = calculateFinance(profile, user);

    // Potong Sisa Anggaran Bulanan secara otomatis dengan total transaksi pengeluaran bulan ini
    c.monthlySavingAll = c.monthlySavingAll - monthExpense;
    c.monthlyEmergWithInvest = Math.max(0, c.monthlySavingAll - c.monthlyInvestPlan);
    c.monthsNoInvest = (c.gap <= 0) ? 0 : (c.monthlySavingAll > 0 ? Math.ceil(c.gap / c.monthlySavingAll) : null);
    c.monthsWithInvest = (c.gap <= 0) ? 0 : (c.monthlyEmergWithInvest > 0 ? Math.ceil(c.gap / c.monthlyEmergWithInvest) : null);
    c.months = c.monthsNoInvest;

    renderInShell('dashboard', UI.Dashboard(c, profile, txSummary, hideBalances), user);
    attachProfileEvents(user);
    renderCashflowChart(c);
    applyPrivacyState();

    const btnPrivacy = $('#btn-toggle-privacy');
    if (btnPrivacy) {
      btnPrivacy.addEventListener('click', () => {
        hideBalances = !hideBalances;
        applyPrivacyState(true);
      });
    }

    const btnExport = $('#btn-export-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => exportFinanceCSV(c, profile, txs));
    }

    const simRutin = $('#sim-rutin');
    const simInvest = $('#sim-invest');
    const simRutinSlider = $('#sim-rutin-slider');
    const simInvestSlider = $('#sim-invest-slider');

    const updateSimulation = () => {
      const newRutin = Number(simRutin ? simRutin.value : c.monthlySavingAll) || 0;
      const newInvest = Number(simInvest ? simInvest.value : c.monthlyInvestPlan) || 0;
      const gap = c.gap;
      
      const monthsNoInvest = (gap <= 0) ? 0 : (newRutin > 0 ? Math.ceil(gap / newRutin) : null);
      const monthlyEmergWithInvest = Math.max(0, newRutin - newInvest);
      const monthsWithInvest = (gap <= 0) ? 0 : (monthlyEmergWithInvest > 0 ? Math.ceil(gap / monthlyEmergWithInvest) : null);
      
      const noInvestText = $('#res-no-invest');
      const noInvestSub = $('#res-no-invest-sub');
      const withInvestText = $('#res-with-invest');
      const withInvestSub = $('#res-with-invest-sub');
      
      if (noInvestText) noInvestText.innerHTML = monthsNoInvest === null ? '∞' : monthsNoInvest + ' bulan';
      if (noInvestSub) noInvestSub.innerHTML = `${UI.rp(newRutin)} / bulan ke dana darurat`;
      if (withInvestText) withInvestText.innerHTML = monthsWithInvest === null ? '∞' : monthsWithInvest + ' bulan';
      if (withInvestSub) withInvestSub.innerHTML = `${UI.rp(monthlyEmergWithInvest)} / bulan ke dana darurat`;
      applyPrivacyState();
    };

    if (simRutin) {
      simRutin.addEventListener('input', () => {
        if (simRutinSlider) simRutinSlider.value = simRutin.value;
        updateSimulation();
      });
    }
    if (simRutinSlider) {
      simRutinSlider.addEventListener('input', () => {
        if (simRutin) simRutin.value = simRutinSlider.value;
        updateSimulation();
      });
    }
    if (simInvest) {
      simInvest.addEventListener('input', () => {
        if (simInvestSlider) simInvestSlider.value = simInvest.value;
        updateSimulation();
      });
    }
    if (simInvestSlider) {
      simInvestSlider.addEventListener('input', () => {
        if (simInvest) simInvest.value = simInvestSlider.value;
        updateSimulation();
      });
    }
  }

  function showEditTxModal(tx, user, periodType, activeValue) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = UI.EditTxModal(tx);
    const overlay = wrapper.firstElementChild;
    document.body.appendChild(overlay);
    initGlassSelects(overlay);

    const closeModal = () => overlay.remove();
    $('#btn-close-edit-tx').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    const editTypeSelect = $('#edit-tx-type');
    const editCatSelect = $('#edit-tx-category');
    editTypeSelect.addEventListener('change', () => {
      if (editTypeSelect.value === 'income') {
        editCatSelect.innerHTML = `
          <option value="Gaji Bulanan">Gaji Bulanan</option>
          <option value="Bonus / THR">Bonus / THR</option>
          <option value="Freelance / Sampingan">Freelance / Sampingan</option>
          <option value="Hasil Investasi">Hasil Investasi</option>
        `;
      } else {
        editCatSelect.innerHTML = `
          <option value="Kebutuhan Pokok">Kebutuhan Pokok (Makan, Tagihan, Transport)</option>
          <option value="Keinginan">Keinginan (Jajan, Hiburan, Belanja)</option>
          <option value="Cicilan / Utang">Cicilan / Utang</option>
          <option value="Dana Darurat & Investasi">Setoran Dana Darurat / Investasi</option>
        `;
      }
      syncGlassSelectUI(editCatSelect);
    });

    const editAmountInp = $('#edit-tx-amount');
    const editRpPrev = $('#edit-tx-rp-preview');
    editAmountInp.addEventListener('input', () => {
      editRpPrev.textContent = Number(editAmountInp.value) > 0 ? UI.rpPlain(editAmountInp.value) : '';
    });

    $('#btn-delete-tx-modal').addEventListener('click', async () => {
      const btnDel = $('#btn-delete-tx-modal');
      btnDel.textContent = 'Menghapus...';
      btnDel.disabled = true;

      const { error: delErr } = await supabase.from('transactions').delete().eq('id', tx.id);
      if (delErr) {
        showToast('Gagal menghapus: ' + delErr.message, 'error');
        btnDel.textContent = 'Hapus';
        btnDel.disabled = false;
        return;
      }
      closeModal();
      showToast('Transaksi dihapus.', 'success');
      loadTransaksi(user, periodType, activeValue);
    });

    $('#edit-tx-form').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btnUpd = $('#btn-update-tx');
      btnUpd.textContent = 'Menyimpan...';
      btnUpd.disabled = true;

      const fd = new FormData(ev.target);
      const payload = {
        type: fd.get('type'),
        category: fd.get('category'),
        amount: Number(fd.get('amount')) || 0,
        tx_date: fd.get('tx_date'),
        note: String(fd.get('note') || '').trim()
      };

      const { error: updErr } = await supabase.from('transactions').update(payload).eq('id', tx.id);
      if (updErr) {
        showToast('Gagal memperbarui transaksi: ' + updErr.message, 'error');
        btnUpd.textContent = 'Simpan Perubahan';
        btnUpd.disabled = false;
        return;
      }

      closeModal();
      showToast('Transaksi berhasil diperbarui!', 'success');
      loadTransaksi(user, periodType, activeValue);
    });
  }

  async function loadTransaksi(user, periodType = 'monthly', filterValue = null) {
    const activeValue = filterValue || getDefaultFilterValue(periodType);
    const { startDate, endDate, periodLabel, budgetFactor } = getPeriodRange(periodType, activeValue);

    const [{ data: profile }, { data: txs, error }] = await Promise.all([
      supabase.from('financial_profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('transactions').select('*').eq('user_id', user.id).gte('tx_date', startDate).lte('tx_date', endDate).order('tx_date', { ascending: false }).order('created_at', { ascending: false })
    ]);

    if (error) {
      showToast('Gagal memuat transaksi: ' + error.message, 'error');
    }

    const monthlyExpenses = profile ? calculateFinance(profile, user).expenses : 0;
    const periodBudget = Math.round(monthlyExpenses * budgetFactor);
    const filterInfo = { periodType, filterValue: activeValue, periodLabel };

    renderInShell('transaksi', UI.Transaksi(txs || [], filterInfo, periodBudget), user);
    attachProfileEvents(user);
    initGlassSelects();
    applyPrivacyState();

    const periodSelect = $('#tx-period-type');
    if (periodSelect) {
      periodSelect.addEventListener('change', () => {
        const nextType = periodSelect.value;
        loadTransaksi(user, nextType, getDefaultFilterValue(nextType));
      });
    }

    const filterInput = $('#tx-filter-value');
    if (filterInput) {
      filterInput.addEventListener('change', () => {
        if (filterInput.value) {
          loadTransaksi(user, periodType, filterInput.value);
        }
      });
    }

    const amountInp = $('#tx-amount-input');
    const rpPrev = $('#tx-rp-preview');
    const updateTxPreview = () => {
      if (amountInp && rpPrev) {
        rpPrev.textContent = Number(amountInp.value) > 0 ? UI.rpPlain(amountInp.value) : '';
      }
    };
    if (amountInp) amountInp.addEventListener('input', updateTxPreview);

    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const addVal = Number(chip.getAttribute('data-add')) || 0;
        if (amountInp) {
          amountInp.value = (Number(amountInp.value) || 0) + addVal;
          updateTxPreview();
        }
      });
    });

    const typeSelect = $('#tx-type-select');
    const catSelect = $('#tx-category-select');
    if (typeSelect && catSelect) {
      typeSelect.addEventListener('change', () => {
        if (typeSelect.value === 'income') {
          catSelect.innerHTML = `
            <option value="Gaji Bulanan">Gaji Bulanan</option>
            <option value="Bonus / THR">Bonus / THR</option>
            <option value="Freelance / Sampingan">Freelance / Sampingan</option>
            <option value="Hasil Investasi">Hasil Investasi</option>
          `;
        } else {
          catSelect.innerHTML = `
            <option value="Kebutuhan Pokok">Kebutuhan Pokok (Makan, Tagihan, Transport)</option>
            <option value="Keinginan">Keinginan (Jajan, Hiburan, Belanja)</option>
            <option value="Cicilan / Utang">Cicilan / Utang</option>
            <option value="Dana Darurat & Investasi">Setoran Dana Darurat / Investasi</option>
          `;
        }
        syncGlassSelectUI(catSelect);
      });
    }

    const txForm = $('#tx-form');
    if (txForm) {
      txForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const btn = $('#btn-save-tx');
        btn.textContent = 'Menyimpan...';
        btn.disabled = true;

        const fd = new FormData(ev.target);
        const payload = {
          user_id: user.id,
          type: fd.get('type'),
          category: fd.get('category'),
          amount: Number(fd.get('amount')) || 0,
          tx_date: fd.get('tx_date'),
          note: String(fd.get('note') || '').trim()
        };

        const { error: insErr } = await supabase.from('transactions').insert(payload);
        if (insErr) {
          showToast('Gagal menyimpan transaksi: ' + insErr.message, 'error');
          btn.textContent = 'Simpan Transaksi';
          btn.disabled = false;
          return;
        }

        showToast('Transaksi berhasil dicatat!', 'success');
        loadTransaksi(user, periodType, activeValue);
      });
    }

    document.querySelectorAll('.btn-edit-tx').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tx = (txs || []).find(item => String(item.id) === String(id));
        if (tx) showEditTxModal(tx, user, periodType, activeValue);
      });
    });
  }

  async function loadData(user) {
    const { data: pRaw } = await supabase.from('financial_profiles').select('*').eq('user_id', user.id).single();
    const p = pRaw || { monthly_income: '', income_type: 'fixed', needs_expense: '', wants_expense: '', debt_installment: '', emergency_fund: '', dependents: 0, savings: '', investments: '', other_assets: '', total_debt: '', age: '', plan_investment: '' };
    renderInShell('data', UI.Data(p), user);
    attachProfileEvents(user);
    initGlassSelects();
    
    const incomeIn = $('input[name="monthly_income"]');
    const needsIn = $('input[name="needs_expense"]');
    const wantsIn = $('input[name="wants_expense"]');
    const debtIn = $('input[name="debt_installment"]');
    const planIn = $('input[name="plan_investment"]');
    const totalEl = $('#live-total-expense');
    const emergDepEl = $('#live-emerg-deposit');

    document.querySelectorAll('#data-form input[type="number"]').forEach(inp => {
      inp.addEventListener('input', () => {
        const preview = document.querySelector(`.rp-preview[data-for="${inp.name}"]`);
        if (preview) {
          const val = Number(inp.value);
          preview.textContent = val > 0 ? UI.rpPlain(val) : '';
        }
      });
    });

    const updateTotals = () => {
      const inc = Number(incomeIn?.value) || 0;
      const n = Number(needsIn?.value) || 0;
      const w = Number(wantsIn?.value) || 0;
      const d = Number(debtIn?.value) || 0;
      const pl = Number(planIn?.value) || 0;
      if (totalEl) totalEl.innerHTML = `${UI.rpPlain(n + w + d)} / bulan`;
      if (emergDepEl) emergDepEl.innerHTML = `${UI.rpPlain(Math.max(0, inc - (n + w + d) - pl))} / bulan`;
    };

    [incomeIn, needsIn, wantsIn, debtIn, planIn].forEach(el => {
      if (el) el.addEventListener('input', updateTotals);
    });
    
    $('#data-form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const btn = $('#btn-submit');
      btn.textContent = 'Menyimpan...';
      btn.disabled = true;

      const fd = new FormData(ev.target);
      const v = {};
      ['monthly_income','needs_expense','wants_expense','debt_installment','emergency_fund','dependents','savings','investments','other_assets','total_debt','age','plan_investment'].forEach(f => v[f] = Number(fd.get(f)) || 0);
      v.income_type = fd.get('income_type');
      v.user_id = user.id;

      const { error } = await supabase.from('financial_profiles').upsert(v, { onConflict: 'user_id' });
      if (error) {
        $('#data-error').innerHTML = `<div class="alert danger">${UI.esc(error.message)}</div>`;
        btn.textContent = 'Simpan & perbarui';
        btn.disabled = false;
        return;
      }
      showToast('Data keuangan berhasil diperbarui!', 'success');
      window.location.hash = '#dashboard';
    });
  }

  async function loadInvestasi(user) {
    const { data: p } = await supabase.from('financial_profiles').select('*').eq('user_id', user.id).single();
    if (!p) { window.location.hash = '#onboarding'; return; }
    const c = calculateFinance(p, user);
    renderInShell('investasi', UI.Investasi(c, p), user);
    attachProfileEvents(user);
    applyPrivacyState();

    document.querySelectorAll('.btn-select-method').forEach(btn => {
      btn.addEventListener('click', async () => {
        const chosen = btn.getAttribute('data-method');
        btn.textContent = 'Menerapkan...';
        btn.disabled = true;

        const { data: updated, error } = await supabase.auth.updateUser({
          data: { preferred_method: chosen }
        });

        if (error) {
          showToast('Gagal mengganti metode: ' + error.message, 'error');
          btn.disabled = false;
          return;
        }

        showToast(`Metode ${chosen} berhasil diterapkan!`, 'success');
        loadInvestasi(updated.user);
      });
    });

    const btnResetMethod = $('#btn-reset-method');
    if (btnResetMethod) {
      btnResetMethod.addEventListener('click', async () => {
        btnResetMethod.disabled = true;
        const { data: updated, error } = await supabase.auth.updateUser({
          data: { preferred_method: null }
        });

        if (error) {
          showToast('Gagal mereset metode: ' + error.message, 'error');
          btnResetMethod.disabled = false;
          return;
        }

        showToast('Metode dikembalikan ke rekomendasi otomatis sistem.', 'success');
        loadInvestasi(updated.user);
      });
    }
  }

  async function loadRefleksi(user) {
    const [{ data: p }, { data: notes, error }] = await Promise.all([
      supabase.from('financial_profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('reflection_notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    if (!p) { window.location.hash = '#onboarding'; return; }
    if (error) {
      showToast('Pastikan tabel reflection_notes sudah dibuat di Supabase.', 'error');
    }

    const c = calculateFinance(p, user);
    renderInShell('refleksi', UI.Refleksi(c, notes || []), user);
    attachProfileEvents(user);
    applyPrivacyState();

    const btnSave = $('#btn-save-reflection');
    const textarea = $('#reflection-input');

    if (btnSave && textarea) {
      btnSave.addEventListener('click', async () => {
        const text = textarea.value.trim();
        if (!text) {
          showToast('Tulis catatan refleksimu dulu sebelum menyimpan.', 'error');
          return;
        }
        btnSave.textContent = 'Menyimpan...';
        btnSave.disabled = true;

        const { error: insErr } = await supabase.from('reflection_notes').insert({
          user_id: user.id,
          content: text
        });

        if (insErr) {
          showToast('Gagal menyimpan catatan: ' + insErr.message, 'error');
          btnSave.textContent = 'Simpan Catatan';
          btnSave.disabled = false;
          return;
        }

        showToast('Catatan refleksi tersimpan di cloud!', 'success');
        loadRefleksi(user);
      });
    }

    document.querySelectorAll('.btn-delete-note').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const { error: delErr } = await supabase.from('reflection_notes').delete().eq('id', id);
        if (delErr) {
          showToast('Gagal menghapus catatan: ' + delErr.message, 'error');
          return;
        }
        showToast('Catatan dihapus.', 'success');
        loadRefleksi(user);
      });
    });
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:${type === 'error' ? '#EF5350' : '#C8F169'}; display:inline-block;"></span> <span>${UI.esc(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate3d(0, -16px, 0)';
      toast.style.transition = 'all 0.25s';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function showLogoutModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <h3>Keluar dari Saku?</h3>
        <p>Pastikan semua data keuanganmu sudah tersimpan sebelum meninggalkan halaman.</p>
        <div class="modal-actions">
          <button class="btn outline" id="btn-cancel-logout">Batal</button>
          <button class="btn primary" id="btn-confirm-logout">Ya, Keluar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('btn-cancel-logout').addEventListener('click', () => {
      overlay.remove();
      window.location.hash = '#dashboard';
    });

    document.getElementById('btn-confirm-logout').addEventListener('click', async () => {
      clearTimeout(idleTimer);
      localStorage.removeItem(LAST_ACTIVE_KEY);
      await supabase.auth.signOut();
      lastNavRect = null;
      lastMobileNavRect = null;
      window.location.hash = '#login';
      overlay.remove();
    });
  }

  function attachProfileEvents(user) {
    const btnOpen = document.getElementById('btn-open-profile');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => showProfileModal(user));
    }
  }

  function showProfileModal(user) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = UI.ProfileModal(user);
    const overlay = wrapper.firstElementChild;
    document.body.appendChild(overlay);

    const preview = document.getElementById('profile-avatar-preview');
    const nameInput = document.getElementById('input-profile-name');
    const colorInput = document.getElementById('input-avatar-color');
    const passInput = document.getElementById('input-profile-password');
    const fileInput = document.getElementById('input-avatar-file');
    const removePhotoInput = document.getElementById('input-remove-photo');
    const btnChoosePhoto = document.getElementById('btn-choose-photo');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');

    let selectedFile = null;
    let currentAvatarUrl = user?.user_metadata?.avatar_url || '';
    let pendingNewPassword = '';

    btnChoosePhoto.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 5 MB.', 'error');
        fileInput.value = '';
        return;
      }
      selectedFile = file;
      removePhotoInput.value = '0';
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.innerHTML = `<img src="${ev.target.result}" alt="Preview">`;
        btnRemovePhoto.style.display = 'inline-flex';
      };
      reader.readAsDataURL(file);
    });

    btnRemovePhoto.addEventListener('click', () => {
      selectedFile = null;
      currentAvatarUrl = '';
      removePhotoInput.value = '1';
      fileInput.value = '';
      const val = nameInput.value.trim();
      preview.textContent = (val.charAt(0) || 'U').toUpperCase();
      btnRemovePhoto.style.display = 'none';
    });

    nameInput.addEventListener('input', () => {
      if (!selectedFile && (!currentAvatarUrl || removePhotoInput.value === '1')) {
        const val = nameInput.value.trim();
        preview.textContent = (val.charAt(0) || 'U').toUpperCase();
      }
    });

    document.querySelectorAll('.color-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        opt.classList.add('selected');
        const selectedColor = opt.getAttribute('data-color');
        colorInput.value = selectedColor;
        preview.style.background = selectedColor;
        preview.style.color = selectedColor === '#C8F169' ? '#143B2D' : '#FFFFFF';
      });
    });

    const closeModal = () => overlay.remove();
    document.getElementById('btn-close-profile').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-profile').addEventListener('click', closeModal);

    document.getElementById('profile-form').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btnSave = document.getElementById('btn-save-profile');
      btnSave.textContent = 'Menyimpan...';
      btnSave.disabled = true;

      const newName = nameInput.value.trim();
      const newColor = colorInput.value;
      const newPass = passInput.value;

      if (newPass && newPass.length < 6) {
        showToast('Kata sandi baru minimal 6 karakter.', 'error');
        btnSave.textContent = 'Simpan Perubahan';
        btnSave.disabled = false;
        return;
      }

      let finalAvatarUrl = removePhotoInput.value === '1' ? '' : currentAvatarUrl;

      if (selectedFile) {
        const ext = selectedFile.name.split('.').pop() || 'jpg';
        const filePath = `${user.id}/avatar-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadErr) {
          showToast('Gagal mengunggah foto (pastikan bucket avatars sudah dibuat): ' + uploadErr.message, 'error');
          btnSave.textContent = 'Simpan Perubahan';
          btnSave.disabled = false;
          return;
        }

        const { data: pubData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = pubData.publicUrl;
      }

      const { error: metaErr } = await supabase.auth.updateUser({
        data: {
          name: newName,
          avatar_color: newColor,
          avatar_url: finalAvatarUrl
        }
      });

      if (metaErr) {
        showToast('Gagal memperbarui profil: ' + metaErr.message, 'error');
        btnSave.textContent = 'Simpan Perubahan';
        btnSave.disabled = false;
        return;
      }

      if (newPass) {
        pendingNewPassword = newPass;
        const { error: otpErr } = await supabase.auth.resetPasswordForEmail(user.email);
        if (otpErr) {
          showToast('Profil tersimpan, tapi gagal mengirim OTP ganti sandi: ' + otpErr.message, 'error');
          btnSave.textContent = 'Simpan Perubahan';
          btnSave.disabled = false;
          return;
        }

        document.getElementById('profile-main-view').style.display = 'none';
        document.getElementById('profile-otp-view').style.display = 'block';
        showToast('Kode OTP 6 digit telah dikirim ke emailmu!', 'success');
        return;
      }

      closeModal();
      showToast('Profil berhasil diperbarui!', 'success');
      render();
    });

    document.getElementById('btn-resend-profile-otp').addEventListener('click', async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) showToast('Gagal kirim ulang OTP: ' + error.message, 'error');
      else showToast('Kode OTP baru telah dikirim!', 'success');
    });

    document.getElementById('profile-otp-form').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btnConfirm = document.getElementById('btn-confirm-profile-otp');
      btnConfirm.textContent = 'Memverifikasi...';
      btnConfirm.disabled = true;

      const token = String(new FormData(ev.target).get('otp_code')).trim();
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: user.email,
        token,
        type: 'recovery'
      });

      if (verifyErr) {
        showToast('Kode OTP salah atau kedaluwarsa: ' + verifyErr.message, 'error');
        btnConfirm.textContent = 'Verifikasi & Ganti Sandi';
        btnConfirm.disabled = false;
        return;
      }

      const { error: passErr } = await supabase.auth.updateUser({ password: pendingNewPassword });
      if (passErr) {
        showToast('Gagal memperbarui kata sandi: ' + passErr.message, 'error');
        btnConfirm.textContent = 'Verifikasi & Ganti Sandi';
        btnConfirm.disabled = false;
        return;
      }

      closeModal();
      showToast('Profil & kata sandi berhasil diperbarui!', 'success');
      render();
    });
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('load', render);
})();
