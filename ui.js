// ui.js
window.UI = {
  esc: (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  rp: (a) => {
    const formatted = 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(Number(a) || 0));
    return `<span class="money-val" data-val="${formatted}">${formatted}</span>`;
  },
  rpPlain: (a) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(Number(a) || 0)),

  BrandLogo: () => `
    <span class="brand-mark">
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 12 H50 V38 L32 52 L14 38 Z" stroke="#C8F169" stroke-width="5" stroke-linejoin="miter"/>
        <line x1="14" y1="20" x2="34" y2="20" stroke="#C8F169" stroke-width="4"/>
        <circle cx="33" cy="34" r="9.5" fill="#C8F169"/>
        <path d="M19 45 L29 35 L34 40 L45 27" stroke="#143B2D" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 45 L29 35 L34 40 L45 27" stroke="#C8F169" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        <polygon points="48,23 39,24 46,32" fill="#C8F169"/>
      </svg>
    </span>
    <span>saku.</span>`,

  EyeIcon: (hidden) => hidden
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,

  Loader: (text = 'Menyiapkan ruang keuanganmu...') => `
    <div class="loader-screen">
      <div class="spinner"></div>
      <div style="font-size:14px;">${UI.esc(text)}</div>
    </div>`,

  Login: () => `<div class="auth-body"><div class="auth-container"><div class="auth-left"><div class="eyebrow" style="color:var(--lime);">KENALI UANGMU. PEGANG KENDALINYA.</div><h1>Gajian bukan cuma numpang lewat.</h1><p>Mulai dari kebiasaan kecil, bangun dana darurat, lalu investasi dengan lebih percaya diri.</p><div class="card-sim"><span>Satu langkah lebih tenang</span><div class="flex-between"><div><div style="font-size:13px; color:#fff; margin-bottom:4px;">Dana daruratmu</div><div class="val">Rp6.000.000</div></div><div style="color:var(--lime); font-weight:700; font-size:16px;">25%</div></div><div class="progress-bar mt-4" style="background:rgba(255,255,255,0.14);"><span style="width:25%; background:var(--lime);"></span></div><div class="sub mt-4">Selangkah lebih dekat ke target Rp24.000.000</div></div><div style="display:flex; gap:18px; margin-top:32px; font-size:11.5px; color:#B3CEC2;"><span>01 Kenali kondisi</span><span>02 Temukan metode</span><span>03 Mulai konsisten</span></div></div><div class="auth-right"><div class="flex-between" style="margin-bottom:36px;"><a href="#dashboard" class="navbar-logo" style="font-size:26px;">${UI.BrandLogo()}</a><div style="font-size:13.5px; color:var(--text-muted);">Belum punya akun? <a href="#register" class="btn outline" style="padding:8px 16px; margin-left:10px; font-size:13px;">Daftar gratis</a></div></div><h2>Uang tertata,<br>pikiran lebih lega.</h2><p class="sub">Masuk dan lanjutkan langkah kecilmu hari ini.</p><div id="auth-error"></div><form id="login-form" class="form-stack"><label>Email<input type="email" name="email" required placeholder="nama@email.com"></label><label>Kata sandi<input type="password" name="password" required placeholder="Masukkan kata sandi"></label><div class="flex-between" style="font-size:13px;"><label style="flex-direction:row; align-items:center; gap:8px; font-weight:400; color:var(--text-muted); cursor:pointer;"><input type="checkbox" style="width:16px; height:16px; accent-color:var(--green-dark);"> Ingat saya</label><a href="#" id="btn-forgot-password" style="font-weight:600; color:var(--green-dark);">Lupa kata sandi?</a></div><button class="btn primary full" style="margin-top:8px;">Masuk ke Saku</button></form><p style="font-size:12px; color:var(--text-muted); margin-top:28px; line-height:1.5;">Dengan masuk, kamu menyetujui Ketentuan Layanan<br>dan Kebijakan Privasi Saku.</p></div></div></div>`,

  Register: () => `<div class="auth-body"><div class="auth-container"><div class="auth-left"><div class="eyebrow" style="color:var(--lime);">MULAI DARI SINI</div><h1>Mulai dari sini.</h1><p>Satu langkah kecil buat hubungan yang lebih sehat sama uang.</p></div><div class="auth-right"><div class="flex-between" style="margin-bottom:36px;"><a href="#login" class="navbar-logo" style="font-size:26px;">${UI.BrandLogo()}</a><div style="font-size:13.5px; color:var(--text-muted);">Sudah punya akun? <a href="#login" class="btn outline" style="padding:8px 16px; margin-left:10px; font-size:13px;">Masuk</a></div></div>
  <div id="register-step-1">
    <h2>Bikin akun dulu</h2>
    <p class="sub">Isi data di bawah. Kami akan mengirim kode OTP ke emailmu untuk verifikasi.</p>
    <div id="auth-error"></div>
    <form id="register-form" class="form-stack">
      <label>Nama panggilan<input name="name" required placeholder="Contoh: Fatih"></label>
      <label>Email<input type="email" name="email" required placeholder="nama@email.com"></label>
      <label>Kata sandi<input type="password" name="password" required minlength="6" placeholder="Minimal 6 karakter"></label>
      <button class="btn primary full" style="margin-top:8px;">Kirim Kode OTP</button>
    </form>
  </div>
  <div id="register-step-2" style="display:none;">
    <h2>Verifikasi OTP</h2>
    <p class="sub" id="register-otp-desc">Masukkan 8 digit kode OTP yang telah dikirim ke emailmu.</p>
    <div id="otp-register-error"></div>
    <form id="register-otp-form" class="form-stack">
      <label>Kode OTP (8 Digit)
        <input type="text" name="otp_code" class="otp-input" maxlength="8" inputmode="numeric" pattern="[0-9]{8}" required placeholder="••••••••">
      </label>
      <button type="submit" class="btn primary full" id="btn-verify-signup-otp">Verifikasi & Aktifkan Akun</button>
      <button type="button" class="btn outline full" id="btn-resend-signup-otp">Kirim Ulang Kode OTP</button>
    </form>
  </div>
  <p style="text-align:center; font-size:13.5px; color:var(--text-muted); margin-top:24px;">Sudah punya akun? <a href="#login" style="color:var(--green-dark); font-weight:700; text-decoration:underline;">Masuk di sini</a></p></div></div></div>`,

  ForgotModal: () => `
    <div class="modal-overlay" id="forgot-modal-overlay">
      <div class="modal-box" style="text-align:left; max-width:420px;">
        <div class="flex-between" style="margin-bottom:16px;">
          <h3 style="margin:0;">Reset Kata Sandi (OTP)</h3>
          <button type="button" id="btn-close-forgot" style="background:none; border:none; font-size:18px; cursor:pointer; color:var(--text-muted);">✕</button>
        </div>
        <div id="forgot-step-1">
          <p style="text-align:left; margin-bottom:20px;">Masukkan email akun Saku kamu. Kami akan mengirimkan <b>kode OTP 8 digit</b> untuk membuat kata sandi baru.</p>
          <form id="forgot-form" class="form-stack" style="gap:16px;">
            <label>Email terdaftar
              <input type="email" name="reset_email" required placeholder="nama@email.com">
            </label>
            <div class="modal-actions">
              <button type="button" class="btn outline" id="btn-cancel-forgot">Batal</button>
              <button type="submit" class="btn primary" id="btn-send-reset">Kirim Kode OTP</button>
            </div>
          </form>
        </div>
        <div id="forgot-step-2" style="display:none;">
          <p style="text-align:left; margin-bottom:16px;" id="forgot-otp-desc">Masukkan kode OTP dari email dan kata sandi barumu.</p>
          <form id="forgot-otp-form" class="form-stack" style="gap:14px;">
            <label>Kode OTP (8 Digit)
              <input type="text" name="otp_code" class="otp-input" maxlength="8" inputmode="numeric" pattern="[0-9]{8}" required placeholder="••••••••">
            </label>
            <label>Kata sandi baru
              <input type="password" name="new_password" required minlength="6" placeholder="Minimal 6 karakter">
            </label>
            <div class="modal-actions mt-4">
              <button type="button" class="btn outline" id="btn-resend-reset-otp">Kirim Ulang</button>
              <button type="submit" class="btn primary" id="btn-verify-reset-otp">Simpan Sandi</button>
            </div>
          </form>
        </div>
      </div>
    </div>`,

  Shell: (active, content, user) => {
    const meta = user?.user_metadata || {};
    const name = meta.name || user?.email?.split('@')[0] || 'Pengguna';
    const initial = (name.charAt(0) || 'U').toUpperCase();
    const avatarColor = meta.avatar_color || '#143B2D';
    const textColor = avatarColor === '#C8F169' ? '#143B2D' : '#FFFFFF';
    const avatarUrl = meta.avatar_url || '';

    const avatarInner = avatarUrl
      ? `<img src="${UI.esc(avatarUrl)}" alt="Foto profil">`
      : UI.esc(initial);

    return `<nav class="top-navbar">
      <a href="#dashboard" class="navbar-logo">${UI.BrandLogo()}</a>
      <div class="navbar-links" id="navbar-links">
        <div class="nav-glass-indicator" id="nav-glass-indicator"></div>
        <a href="#dashboard" data-nav="dashboard" class="${active === 'dashboard' ? 'active' : ''}">Dashboard</a>
        <a href="#transaksi" data-nav="transaksi" class="${active === 'transaksi' ? 'active' : ''}">Transaksi</a>
        <a href="#data" data-nav="data" class="${active === 'data' ? 'active' : ''}">Data keuangan</a>
        <a href="#investasi" data-nav="investasi" class="${active === 'investasi' ? 'active' : ''}">Metode saving</a>
        <a href="#refleksi" data-nav="refleksi" class="${active === 'refleksi' ? 'active' : ''}">Refleksi</a>
      </div>
      <div class="navbar-right">
        <div class="user-badge" id="btn-open-profile" title="Edit Profil">
          <div class="avatar" style="background:${avatarColor}; color:${textColor};">${avatarInner}</div>
          <span class="user-name">${UI.esc(name)}</span>
          <span style="font-size:11px; color:var(--text-muted);">Edit</span>
        </div>
        <a href="#logout" style="font-size:13px; color:#C62828; font-weight:600; padding:6px 10px; border-radius:8px;">Keluar</a>
      </div>
    </nav>
    <div class="page-wrapper" id="page-wrapper">${content}</div>
    <nav class="mobile-bottom-nav">
      <a href="#dashboard" class="${active === 'dashboard' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        <span>Dashboard</span>
      </a>
      <a href="#transaksi" class="${active === 'transaksi' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>Transaksi</span>
      </a>
      <a href="#data" class="${active === 'data' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <span>Data</span>
      </a>
      <a href="#investasi" class="${active === 'investasi' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        <span>Metode</span>
      </a>
      <a href="#refleksi" class="${active === 'refleksi' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>Refleksi</span>
      </a>
    </nav>`;
  },

  Onboarding: (user) => {
    const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Teman';
    return `<div class="onboarding-card">
      <div class="eyebrow" style="color:var(--green-dark);">SELAMAT DATANG DI SAKU</div>
      <h1 style="font:700 32px var(--font-heading); margin:0 0 12px;">Halo, ${UI.esc(name)}!</h1>
      <p style="color:var(--text-muted); font-size:15px; line-height:1.6; max-width:500px; margin:0 auto;">
        Sebelum melihat peta keuangan dan rekomendasi metode menabung, mari kenali dulu kondisi keuanganmu saat ini dalam 2 menit.
      </p>
      <div class="onboarding-steps">
        <div class="onboarding-step-box">
          <div style="font-weight:800; color:var(--green-dark); margin-bottom:6px;">01 • Arus Kas</div>
          <div style="font-size:12.5px; color:var(--text-muted); line-height:1.5;">Catat gaji bersih dan estimasi pengeluaran rutin bulananmu.</div>
        </div>
        <div class="onboarding-step-box">
          <div style="font-weight:800; color:var(--green-dark); margin-bottom:6px;">02 • Dana Darurat</div>
          <div style="font-size:12.5px; color:var(--text-muted); line-height:1.5;">Hitung target cadangan aman sesuai jumlah tanggunganmu.</div>
        </div>
        <div class="onboarding-step-box">
          <div style="font-weight:800; color:var(--green-dark); margin-bottom:6px;">03 • Aset & Tujuan</div>
          <div style="font-size:12.5px; color:var(--text-muted); line-height:1.5;">Simulasikan kapan target tercapai tanpa mengganggu hidup sehari-hari.</div>
        </div>
      </div>
      <a href="#data" class="btn primary" style="padding:16px 32px; font-size:15px;">Mulai Isi Data Keuangan →</a>
    </div>`;
  },

  ProfileModal: (user) => {
    const meta = user?.user_metadata || {};
    const name = meta.name || user?.email?.split('@')[0] || '';
    const initial = (name.charAt(0) || 'U').toUpperCase();
    const currentColor = meta.avatar_color || '#143B2D';
    const avatarUrl = meta.avatar_url || '';
    const colors = ['#143B2D', '#2E7D32', '#1565C0', '#6A1B9A', '#D84315', '#C8F169'];

    const previewContent = avatarUrl
      ? `<img src="${UI.esc(avatarUrl)}" alt="Preview foto">`
      : UI.esc(initial);

    return `<div class="modal-overlay" id="profile-modal-overlay">
      <div class="modal-box" style="text-align:left; max-width:450px;">
        <div class="flex-between" style="margin-bottom:16px;">
          <h3 style="margin:0;">Edit Profil & Keamanan</h3>
          <button type="button" id="btn-close-profile" style="background:none; border:none; font-size:18px; cursor:pointer; color:var(--text-muted);">✕</button>
        </div>

        <div id="profile-main-view">
          <div class="avatar-preview" id="profile-avatar-preview" style="background:${currentColor}; color:${currentColor === '#C8F169' ? '#143B2D' : '#FFFFFF'};">
            ${previewContent}
          </div>
          <div class="avatar-photo-actions">
            <input type="file" id="input-avatar-file" accept="image/png, image/jpeg, image/webp" style="display:none;">
            <button type="button" class="btn outline" id="btn-choose-photo" style="padding:8px 14px; font-size:12px;">Unggah Foto (Maks 5MB)</button>
            <button type="button" class="btn outline" id="btn-remove-photo" style="padding:8px 14px; font-size:12px; color:#C62828; ${avatarUrl ? '' : 'display:none;'}">Hapus Foto</button>
          </div>
          <p style="text-align:center; font-size:12px; color:var(--text-muted); margin-bottom:10px;">Atau pilih warna avatar inisial</p>
          <div class="color-picker-group" id="avatar-color-picker">
            ${colors.map(c => `<div class="color-option ${c === currentColor ? 'selected' : ''}" data-color="${c}" style="background:${c};"></div>`).join('')}
          </div>
          <form id="profile-form" class="form-stack" style="gap:14px;">
            <input type="hidden" name="avatar_color" id="input-avatar-color" value="${currentColor}">
            <input type="hidden" name="remove_photo" id="input-remove-photo" value="0">
            <label>Nama Panggilan
              <input type="text" name="name" id="input-profile-name" value="${UI.esc(name)}" required placeholder="Masukkan nama panggilan">
            </label>
            <label>Email
              <input type="email" value="${UI.esc(user.email)}" disabled style="background:#F3F4F6; color:var(--text-muted); cursor:not-allowed;">
            </label>
            <label>Ganti Kata Sandi Baru (Wajib Verifikasi OTP Email)
              <input type="password" name="new_password" id="input-profile-password" minlength="6" placeholder="Kosongkan jika tidak ingin ganti sandi">
            </label>
            <div class="modal-actions mt-4">
              <button type="button" class="btn outline" id="btn-cancel-profile">Batal</button>
              <button type="submit" class="btn primary" id="btn-save-profile">Simpan Perubahan</button>
            </div>
          </form>
        </div>

        <div id="profile-otp-view" style="display:none;">
          <div class="alert warning" style="font-size:13px; margin-bottom:16px;">
            Demi keamanan akun, masukkan <b>8 digit kode OTP</b> yang baru dikirim ke <b>${UI.esc(user.email)}</b> untuk mengonfirmasi perubahan kata sandi.
          </div>
          <form id="profile-otp-form" class="form-stack" style="gap:14px;">
            <label>Kode OTP (8 Digit)
              <input type="text" name="otp_code" class="otp-input" maxlength="8" inputmode="numeric" pattern="[0-9]{8}" required placeholder="••••••••">
            </label>
            <div class="modal-actions mt-4">
              <button type="button" class="btn outline" id="btn-resend-profile-otp">Kirim Ulang</button>
              <button type="submit" class="btn primary" id="btn-confirm-profile-otp">Verifikasi & Ganti Sandi</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
  },

  EditTxModal: (tx) => {
    const isIncome = tx.type === 'income';
    const categories = isIncome
      ? [
          { val: 'Gaji Bulanan', label: 'Gaji Bulanan' },
          { val: 'Bonus / THR', label: 'Bonus / THR' },
          { val: 'Freelance / Sampingan', label: 'Freelance / Sampingan' },
          { val: 'Hasil Investasi', label: 'Hasil Investasi' }
        ]
      : [
          { val: 'Kebutuhan Pokok', label: 'Kebutuhan Pokok (Makan, Tagihan, Transport)' },
          { val: 'Keinginan', label: 'Keinginan (Jajan, Hiburan, Belanja)' },
          { val: 'Cicilan / Utang', label: 'Cicilan / Utang' },
          { val: 'Dana Darurat & Investasi', label: 'Setoran Dana Darurat / Investasi' }
        ];

    return `<div class="modal-overlay" id="edit-tx-modal-overlay">
      <div class="modal-box" style="text-align:left; max-width:450px;">
        <div class="flex-between" style="margin-bottom:16px;">
          <h3 style="margin:0;">Edit Transaksi</h3>
          <button type="button" id="btn-close-edit-tx" style="background:none; border:none; font-size:18px; cursor:pointer; color:var(--text-muted);">✕</button>
        </div>
        <form id="edit-tx-form" class="form-stack" style="gap:14px;">
          <label>Jenis Transaksi
            <select name="type" id="edit-tx-type">
              <option value="expense" ${!isIncome ? 'selected' : ''}>Pengeluaran (-)</option>
              <option value="income" ${isIncome ? 'selected' : ''}>Pemasukan (+)</option>
            </select>
          </label>
          <label>Kategori
            <select name="category" id="edit-tx-category">
              ${categories.map(c => `<option value="${UI.esc(c.val)}" ${tx.category === c.val ? 'selected' : ''}>${UI.esc(c.label)}</option>`).join('')}
            </select>
          </label>
          <label>Nominal (Rp)
            <input type="number" name="amount" id="edit-tx-amount" value="${UI.esc(tx.amount)}" required min="1">
            <div class="rp-preview" id="edit-tx-rp-preview">${UI.rpPlain(tx.amount)}</div>
          </label>
          <label>Tanggal
            <input type="date" name="tx_date" value="${UI.esc(tx.tx_date)}" required>
          </label>
          <label>Catatan singkat
            <input type="text" name="note" value="${UI.esc(tx.note || '')}" required placeholder="Contoh: Makan siang, Kopi, Bonus proyek">
          </label>
          <div class="modal-actions mt-4">
            <button type="button" class="btn outline" id="btn-delete-tx-modal" style="color:#C62828; border-color:rgba(241,107,107,0.35);">Hapus</button>
            <button type="submit" class="btn primary" id="btn-update-tx">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>`;
  },

  Dashboard: (c, profile, txSummary, hideNumbers = false) => {
    const depText = c.dependents === 0 ? 'tanpa tanggungan (3× pengeluaran)' : (c.dependents === 1 ? '1 tanggungan (6× pengeluaran)' : `${c.dependents}+ tanggungan (9× pengeluaran)`);
    const incomeLabel = profile.income_type === 'fixed' ? 'Pendapatan tetap' : 'Pendapatan tidak tetap';
    const maxSliderVal = Math.max(c.income, c.monthlySavingAll, 10000000);

    let alertHtml = '';
    if (c.monthlySavingAll < 0) {
      alertHtml = `<div class="alert danger mb-4 mt-4"><b>Pengeluaranmu melebihi gaji sebesar ${UI.rp(Math.abs(c.monthlySavingAll))}.</b><br><span style="font-size:13px;">Prioritaskan pangkas pos keinginan (${UI.rp(c.wants)}) terlebih dahulu agar arus kas kembali positif.</span></div>`;
    } else if (c.needsOver > 0) {
      alertHtml = `<div class="alert warning mb-4 mt-4"><b>Kurangi pos kebutuhan sekitar ${UI.rp(c.needsOver)} agar sesuai target metode ${UI.esc(c.method)}.</b><br><span style="font-size:13px;">Kebutuhan saat ini ${UI.rp(c.needs)}, idealnya maksimal ${UI.rp(c.targetNeeds)}. Cicilan minimum tetap diprioritaskan.</span></div>`;
    } else if (c.wants > c.income * 0.30) {
      alertHtml = `<div class="alert warning mb-4 mt-4"><b>Porsi keinginanmu mencapai ${(c.income > 0 ? (c.wants / c.income * 100).toFixed(0) : 0)}% dari gaji.</b><br><span style="font-size:13px;">Batas ideal keinginan adalah 30% (${UI.rp(c.income * 0.3)}). Selisihnya bisa dialihkan untuk mempercepat dana darurat.</span></div>`;
    } else {
      alertHtml = `<div class="alert success mb-4 mt-4"><b>Arus kas bulan ini sehat!</b><br><span style="font-size:13px;">Rasio pengeluaranmu berada di angka ${c.ratio.toFixed(0)}% dengan sisa dana ${UI.rp(c.monthlySavingAll)} yang siap dialokasikan.</span></div>`;
    }

    return `<div class="page-heading flex-between">
      <div>
        <div class="eyebrow">RENCANA KEUANGAN PRIBADIMU</div>
        <h1>Uangmu mulai punya arah.</h1>
        <p>Kenali pengeluaran, amankan cadangan, baru melangkah lebih jauh.</p>
      </div>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <button type="button" id="btn-toggle-privacy" class="privacy-pill ${hideNumbers ? 'is-hidden' : ''}" title="Sembunyikan atau tampilkan nominal saldo">
          ${UI.EyeIcon(hideNumbers)}
          <span id="privacy-pill-label">${hideNumbers ? 'Tampilkan saldo' : 'Sembunyikan'}</span>
        </button>
        <button type="button" id="btn-export-csv" class="btn outline" style="border-radius:99px; padding:10px 18px;">Export CSV</button>
        <a href="#data" class="btn primary" style="border-radius:99px; padding:10px 20px;">Edit data</a>
      </div>
    </div>
  
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">Gaji bersih / bulan</div><div class="stat-value">${UI.rp(c.income)}</div><div class="stat-foot">${incomeLabel}</div></div>
      <div class="stat-card"><div class="stat-label">Estimasi pengeluaran / bulan</div><div class="stat-value">${UI.rp(c.expenses)}</div><div class="stat-foot">${c.ratio.toFixed(0)}% dari gaji bersih</div></div>
      <div class="stat-card"><div class="stat-label">Sisa anggaran bulanan</div><div class="stat-value" style="${c.monthlySavingAll < 0 ? 'color:#C62828;' : ''}">${UI.rp(c.monthlySavingAll)}</div><div class="stat-foot">${Math.max(0, 100 - c.ratio).toFixed(0)}% siap dialokasikan</div></div>
    </div>

    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">Total aset likuid tercatat</div><div class="stat-value">${UI.rp(c.assets)}</div><div class="stat-foot">Darurat ${UI.rp(c.emergency)} + investasi ${UI.rp(c.investments)}</div></div>
      <div class="stat-card"><div class="stat-label">Kekayaan bersih likuid</div><div class="stat-value">${UI.rp(c.netWorth)}</div><div class="stat-foot">Aset ${UI.rp(c.assets)} – utang ${UI.rp(c.debt)}</div></div>
      <div class="stat-card" style="background:#FAFBF9;">
        <div class="flex-between"><div class="stat-label">Realisasi pengeluaran bulan ini</div><a href="#transaksi" style="font-size:12px; font-weight:700; color:var(--green-dark); background:#EAF5E9; padding:3px 10px; border-radius:99px;">+ Catat</a></div>
        <div class="stat-value">${UI.rp(txSummary.monthExpense)}</div>
        <div class="stat-foot">${txSummary.count} transaksi tercatat bulan ini</div>
      </div>
    </div>

    <div class="dashboard-split" style="grid-template-columns:1.35fr 1fr;">
      <div class="method-recommend-card" style="margin-bottom:0; align-items:flex-start;">
        <div style="width:100%;">
          <div class="flex-between">
            <div class="method-badge">${c.isManualMethod ? 'METODE PILIHAN MANUAL' : 'METODE UNTUKMU'}</div>
            <div style="font-size:10px; color:var(--lime); letter-spacing:1px; font-weight:700;">${c.isManualMethod ? 'DIKUNCI PENGGUNA' : 'DIREKOMENDASIKAN'}</div>
          </div>
          <h2>${UI.esc(c.method)}</h2>
          <p style="color:#fff; font-size:18px; font-weight:600; margin-bottom:8px;">Bangun rasa aman, selangkah demi selangkah.</p>
          <p>${UI.esc(c.reason)}</p>
          <div style="font-size:12.5px; margin-top:14px; color:#B3CEC2;">${incomeLabel} • Rasio pengeluaran ${c.ratio.toFixed(0)}% • ${c.emergency >= c.target ? 'Dana darurat sudah aman.' : 'Dana darurat belum penuh.'}</div>
          <div style="margin-top:24px; display:flex; gap:12px; flex-wrap:wrap;"><a href="#investasi" class="btn lime" style="padding:10px 18px;">Ganti / atur metode</a><a href="#transaksi" class="btn outline" style="padding:10px 18px; background:rgba(255,255,255,0.08); color:#fff; border-color:rgba(255,255,255,0.2);">Catat transaksi</a></div>
        </div>
      </div>
      
      <div class="panel">
        <div class="flex-between"><div class="stat-label">DANA DARURAT</div><div style="font-size:11.5px; color:var(--text-muted); font-weight:600;">tercapai</div></div>
        <div class="stat-value" style="margin:6px 0 12px;">${c.progress.toFixed(0)}%</div>
        <div class="progress-bar"><span style="width:${c.progress}%"></span></div>
        <div class="flex-between mt-4" style="font-size:12px; margin-bottom:10px;">
          <span style="color:var(--text-muted);">Terkumpul<br><b style="color:var(--text-main); font-size:14.5px;">${UI.rp(c.emergency)}</b></span>
          <span style="color:var(--text-muted); text-align:right;">Target<br><b style="color:var(--text-main); font-size:14.5px;">${UI.rp(c.target)}</b></span>
        </div>
        <div style="font-size:11.5px; color:var(--text-muted); text-align:right; margin-bottom:16px;">${c.targetMultiplier} × ${UI.rp(c.expenses)} pengeluaran<br>Untuk kamu dengan ${depText}.</div>
        <div style="background:var(--bg); border-radius:var(--radius-sm); padding:14px 16px;">
          <b style="display:block; margin-bottom:4px; font-size:13px;">${c.months === null ? 'Belum ada sisa dana' : (c.months === 0 ? 'Target dana darurat tercapai' : c.months + ' bulan menuju target')}</b>
          <span style="font-size:12px; color:var(--text-muted);">${c.months === 0 ? 'Kamu sudah siap fokus penuh pada investasi jangka panjang.' : `Jika seluruh sisa ${UI.rp(Math.max(0, c.monthlySavingAll))} / bulan dialokasikan ke dana darurat.`}</span>
        </div>
      </div>
    </div>

    ${alertHtml}

    <div class="dashboard-split mt-4">
      <div class="panel">
        <div class="flex-between mb-4"><h2 style="font:700 18px var(--font-heading); margin:0;">Proporsi Arus Kas</h2><span class="eyebrow" style="margin:0;">RENCANA BULANAN</span></div>
        <div class="chart-wrapper">
          <canvas id="cashflow-chart"></canvas>
        </div>
      </div>

      <div class="panel">
        <div class="flex-between mb-4"><h2 style="font:700 18px var(--font-heading); margin:0;">Rencana setiap rupiah (${UI.esc(c.method)})</h2><span class="eyebrow" style="margin:0;">TARGET / BULAN</span></div>
        <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">Alokasi ideal berdasarkan gaji bersih ${UI.rp(c.income)}.</p>
        <div style="display:flex; height:12px; border-radius:99px; overflow:hidden; margin-bottom:20px; gap:2px;">
          ${c.allocations.map(a => `<div style="width:${a.pct}%; background:${a.color};"></div>`).join('')}
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:12px; font-size:13.5px;">
          ${c.allocations.map(a => `
            <div class="flex-between">
              <span style="display:flex; align-items:center; gap:8px;"><span style="width:10px; height:10px; border-radius:3px; background:${a.color}; display:inline-block;"></span> ${UI.esc(a.label)}</span>
              <b>${a.pct}% &nbsp;&nbsp; ${UI.rp(c.income * (a.pct / 100))}</b>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div style="margin-top:48px; padding-top:32px; border-top:1px dashed var(--border-strong);">
      <div class="panel" style="padding:32px;">
        <div class="flex-between mb-4" style="flex-wrap:wrap; gap:12px;">
          <div>
            <span style="display:inline-block; background:rgba(245, 158, 11, 0.16); color:#F59E0B; border:1px solid rgba(245, 158, 11, 0.3); font-size:11px; font-weight:800; padding:5px 12px; border-radius:99px; letter-spacing:0.6px; margin-bottom:10px;">ANTI-FOMO CHECK</span>
            <h2 style="font:700 22px var(--font-heading); margin:0;">Jangan buru-buru ikut tren investasi.</h2>
          </div>
          <span class="eyebrow" style="margin:0;">SIMULASI SANTAI</span>
        </div>
        <p style="color:var(--text-muted); font-size:14px; line-height:1.6; margin-bottom:24px; max-width:740px;">
          Banyak orang tergiur ikut investasi karena takut ketinggalan tren, padahal tabungan daruratnya belum aman. Saat ini kamu masih butuh <b style="color:var(--text-main);">${UI.rp(c.gap)}</b> lagi supaya dana daruratmu penuh. Coba geser angka di bawah untuk melihat bedanya:
        </p>
        
        <div class="form-grid-2 mb-4">
          <div style="background:var(--bg); padding:18px; border-radius:var(--radius-md); border:1px solid var(--border);">
            <label style="font-size:13px; font-weight:700; display:block; margin-bottom:4px; color:var(--text-main);">1. Uang sisa yang bisa ditabung tiap bulan (Rp)</label>
            <span style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:10px;">Total uang nganggur setelah semua kebutuhan & jajan terbayar.</span>
            <input type="number" id="sim-rutin" value="${Math.max(0, c.monthlySavingAll)}" placeholder="Masukkan nominal..." style="margin-bottom:12px;">
            <input type="range" id="sim-rutin-slider" min="0" max="${maxSliderVal}" step="50000" value="${Math.min(maxSliderVal, Math.max(0, c.monthlySavingAll))}">
          </div>
          <div style="background:var(--bg); padding:18px; border-radius:var(--radius-md); border:1px solid var(--border);">
            <label style="font-size:13px; font-weight:700; display:block; margin-bottom:4px; color:var(--text-main);">2. Kalau sebagian langsung dipakai investasi (Rp)</label>
            <span style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:10px;">Uang yang langsung ditaruh ke saham, reksadana, kripto, atau emas.</span>
            <input type="number" id="sim-invest" value="${c.monthlyInvestPlan}" placeholder="Masukkan nominal..." style="margin-bottom:12px;">
            <input type="range" id="sim-invest-slider" min="0" max="${maxSliderVal}" step="50000" value="${Math.min(maxSliderVal, c.monthlyInvestPlan)}">
          </div>
        </div>
        
        <div class="form-grid-2 mt-4">
          <div style="background:rgba(34, 197, 94, 0.12); padding:22px; border-radius:var(--radius-md); border:1px solid rgba(34, 197, 94, 0.3);">
            <div class="eyebrow" style="color:#22C55E;">FOKUS PENUH KE DANA DARURAT DULU</div>
            <div id="res-no-invest" style="font-size:32px; font-family:var(--font-heading); font-weight:700; margin:6px 0; color:var(--text-main);">${c.monthsNoInvest === null ? '∞' : c.monthsNoInvest + ' bulan'}</div>
            <div id="res-no-invest-sub" style="font-size:13px; color:var(--text-muted);">Nabung ${UI.rp(Math.max(0, c.monthlySavingAll))} / bulan • Aman dulu baru gas investasi.</div>
          </div>
          <div style="background:rgba(245, 158, 11, 0.12); padding:22px; border-radius:var(--radius-md); border:1px solid rgba(245, 158, 11, 0.3);">
            <div class="eyebrow" style="color:#F59E0B;">SAMBIL IKUT INVESTASI (FOMO)</div>
            <div id="res-with-invest" style="font-size:32px; font-family:var(--font-heading); font-weight:700; margin:6px 0; color:var(--text-main);">${c.monthsWithInvest === null ? '∞' : c.monthsWithInvest + ' bulan'}</div>
            <div id="res-with-invest-sub" style="font-size:13px; color:var(--text-muted);">Sisa ${UI.rp(c.monthlyEmergWithInvest)} / bulan ke darurat • Dana darurat jadi lebih lama tercapai.</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  Transaksi: (txs, filterInfo, periodBudget) => {
    const totalIn = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalOut = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const todayStr = new Date().toISOString().split('T')[0];
    const { periodType, filterValue, periodLabel } = filterInfo;

    let pickerHtml = '';
    if (periodType === 'daily') {
      pickerHtml = `<input type="date" id="tx-filter-value" value="${UI.esc(filterValue)}" style="padding:10px 14px; font-size:13.5px;">`;
    } else if (periodType === 'weekly') {
      pickerHtml = `<input type="week" id="tx-filter-value" value="${UI.esc(filterValue)}" style="padding:10px 14px; font-size:13.5px;">`;
    } else if (periodType === 'yearly') {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 6 }, (_, i) => String(currentYear - 3 + i));
      pickerHtml = `<select id="tx-filter-value" style="padding:10px 14px; font-size:13.5px; min-width:120px;">
        ${years.map(y => `<option value="${y}" ${y === filterValue ? 'selected' : ''}>Tahun ${y}</option>`).join('')}
      </select>`;
    } else {
      pickerHtml = `<input type="month" id="tx-filter-value" value="${UI.esc(filterValue)}" style="padding:10px 14px; font-size:13.5px;">`;
    }

    return `<div class="page-heading flex-between">
      <div>
        <div class="eyebrow">JURNAL KEUANGAN</div>
        <h1>Catatan Transaksi</h1>
        <p>Pantau setiap rupiah yang masuk dan keluar agar tidak meleset dari rencana.</p>
      </div>
      <div style="display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap;">
        <div>
          <label style="font-size:12px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Periode</label>
          <select id="tx-period-type" style="padding:10px 14px; font-size:13.5px;">
            <option value="daily" ${periodType === 'daily' ? 'selected' : ''}>Harian</option>
            <option value="weekly" ${periodType === 'weekly' ? 'selected' : ''}>Mingguan</option>
            <option value="monthly" ${periodType === 'monthly' ? 'selected' : ''}>Bulanan</option>
            <option value="yearly" ${periodType === 'yearly' ? 'selected' : ''}>Tahunan</option>
          </select>
        </div>
        <div>
          <label style="font-size:12px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Pilih Waktu</label>
          ${pickerHtml}
        </div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">Pemasukan tercatat</div><div class="stat-value" style="color:#1B5E20;">+${UI.rp(totalIn)}</div><div class="stat-foot">${UI.esc(periodLabel)}</div></div>
      <div class="stat-card"><div class="stat-label">Pengeluaran tercatat</div><div class="stat-value" style="color:#C62828;">-${UI.rp(totalOut)}</div><div class="stat-foot">Estimasi batas periode: ${UI.rp(periodBudget)}</div></div>
      <div class="stat-card"><div class="stat-label">Sisa anggaran periode ini</div><div class="stat-value" style="${periodBudget - totalOut < 0 ? 'color:#C62828;' : ''}">${UI.rp(periodBudget - totalOut)}</div><div class="stat-foot">${periodBudget > 0 ? Math.round((totalOut / periodBudget) * 100) : 0}% terpakai dari batas</div></div>
    </div>

    <div class="form-split-layout">
      <div class="panel">
        <div class="flex-between mb-4">
          <h2 style="font:700 19px var(--font-heading); margin:0;">Riwayat Transaksi (${txs.length})</h2>
          <span class="eyebrow" style="margin:0;">${UI.esc(periodLabel)}</span>
        </div>
        ${txs.length === 0 ? `<div style="text-align:center; padding:48px 20px; color:var(--text-muted);">
          Belum ada transaksi tercatat pada periode ini.<br>Mulai catat transaksi pertamamu di samping!
        </div>` : `
          <div>
            ${txs.map(t => `
              <div class="tx-row">
                <div style="display:flex; align-items:center; gap:14px;">
                  <div class="tx-badge ${t.type === 'income' ? 'income' : 'expense'}">${t.type === 'income' ? '↑' : '↓'}</div>
                  <div>
                    <div style="font-weight:700; font-size:14px;">${UI.esc(t.category)} ${t.note ? `<span style="font-weight:400; color:var(--text-muted);">• ${UI.esc(t.note)}</span>` : ''}</div>
                    <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">${UI.esc(t.tx_date)}</div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                  <b style="font-size:15px; color:${t.type === 'income' ? '#1B5E20' : '#C62828'};">${t.type === 'income' ? '+' : '-'}${UI.rp(t.amount)}</b>
                  <button type="button" class="btn-edit-tx" data-id="${t.id}" title="Edit Transaksi">Edit</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div>
        <div class="panel">
          <h3 style="font:700 18px var(--font-heading); margin:0 0 16px;">Catat Transaksi Baru</h3>
          <form id="tx-form" class="form-stack" style="gap:15px;">
            <label>Jenis Transaksi
              <select name="type" id="tx-type-select">
                <option value="expense">Pengeluaran (-)</option>
                <option value="income">Pemasukan (+)</option>
              </select>
            </label>
            <label>Kategori
              <select name="category" id="tx-category-select">
                <option value="Kebutuhan Pokok">Kebutuhan Pokok (Makan, Tagihan, Transport)</option>
                <option value="Keinginan">Keinginan (Jajan, Hiburan, Belanja)</option>
                <option value="Cicilan / Utang">Cicilan / Utang</option>
                <option value="Dana Darurat & Investasi">Setoran Dana Darurat / Investasi</option>
              </select>
            </label>
            <label>Nominal (Rp)
              <input type="number" name="amount" id="tx-amount-input" required min="1" placeholder="Contoh: 50000">
              <div class="quick-chips">
                <button type="button" class="chip-btn" data-add="15000">+15rb</button>
                <button type="button" class="chip-btn" data-add="25000">+25rb</button>
                <button type="button" class="chip-btn" data-add="50000">+50rb</button>
                <button type="button" class="chip-btn" data-add="100000">+100rb</button>
                <button type="button" class="chip-btn" data-add="250000">+250rb</button>
              </div>
              <div class="rp-preview" id="tx-rp-preview"></div>
            </label>
            <label>Tanggal
              <input type="date" name="tx_date" value="${todayStr}" required>
            </label>
            <label>Catatan singkat
              <input type="text" name="note" required placeholder="Contoh: Makan siang, Kopi, Bonus proyek">
            </label>
            <button type="submit" class="btn primary full" id="btn-save-tx">Simpan Transaksi</button>
          </form>
        </div>
      </div>
    </div>`;
  },

  Data: (p) => `<div class="page-heading"><div class="eyebrow">01 KONDISI KEUANGAN &nbsp;&nbsp;&nbsp; — &nbsp;&nbsp;&nbsp; 02 REKOMENDASI UNTUKMU</div><h1>Kenalan dulu dengan uangmu.</h1><p>Isi kondisi saat ini. Tidak perlu sempurna, kamu bisa mengubahnya kapan saja.</p></div><div id="data-error"></div>
  <form id="data-form" class="form-split-layout"><div>
    <div class="form-section">
      <h2>01 <span>Pemasukan & pengeluaran</span></h2>
      <div class="form-grid-2">
        <label>Gaji bersih per bulan (G)
          <input type="number" name="monthly_income" value="${UI.esc(p.monthly_income)}" required placeholder="Contoh: 8000000">
          <div class="rp-preview" data-for="monthly_income">${p.monthly_income ? UI.rpPlain(p.monthly_income) : ''}</div>
        </label>
        <label>Jenis pendapatan
          <select name="income_type"><option value="fixed" ${p.income_type === 'fixed' ? 'selected' : ''}>Tetap</option><option value="irregular" ${p.income_type === 'irregular' ? 'selected' : ''}>Tidak tetap</option></select>
          <span class="hint">Pilih "Tidak tetap" jika penghasilan fluktuatif (freelance/komisi).</span>
        </label>
      </div>
      <div class="form-grid-2 mt-4">
        <label>Kebutuhan pokok per bulan
          <input type="number" name="needs_expense" value="${UI.esc(p.needs_expense)}" required placeholder="Makan, kos/kontrakan, listrik">
          <div class="rp-preview" data-for="needs_expense">${p.needs_expense ? UI.rpPlain(p.needs_expense) : ''}</div>
          <span class="hint">Di luar cicilan utang (cicilan diisi di bagian 03).</span>
        </label>
        <label>Keinginan per bulan
          <input type="number" name="wants_expense" value="${UI.esc(p.wants_expense)}" required placeholder="Nongkrong, hobi, langganan">
          <div class="rp-preview" data-for="wants_expense">${p.wants_expense ? UI.rpPlain(p.wants_expense) : ''}</div>
          <span class="hint">Hiburan, jajan, belanja non-esensial, dan lainnya.</span>
        </label>
      </div>
      <div style="background:var(--bg); padding:16px 18px; border-radius:var(--radius-sm); margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:13px; font-weight:600;">Total pengeluaran + cicilan (P)</span>
        <span id="live-total-expense" style="font-size:16px; font-weight:700; color:var(--green-dark);">${UI.rpPlain((Number(p.needs_expense) || 0) + (Number(p.wants_expense) || 0) + (Number(p.debt_installment) || 0))} / bulan</span>
      </div>
    </div>

    <div class="form-section">
      <h2>02 <span>Dana darurat & tanggungan</span></h2>
      <div class="form-grid-2">
        <label>Dana darurat terkumpul (DD)
          <input type="number" name="emergency_fund" value="${UI.esc(p.emergency_fund)}" required placeholder="Saldo tabungan darurat">
          <div class="rp-preview" data-for="emergency_fund">${p.emergency_fund ? UI.rpPlain(p.emergency_fund) : ''}</div>
        </label>
        <label>Jumlah tanggungan (T)
          <select name="dependents">
            <option value="0" ${Number(p.dependents) === 0 ? 'selected' : ''}>0 — Sendiri</option>
            <option value="1" ${Number(p.dependents) === 1 ? 'selected' : ''}>1 — Satu tanggungan</option>
            <option value="2" ${Number(p.dependents) >= 2 ? 'selected' : ''}>2+ — Berkeluarga</option>
          </select>
        </label>
      </div>
      <p style="font-size:11.5px; color:var(--text-muted); margin-top:12px; margin-bottom:0;">Target otomatis: 0 tanggungan = 3×, 1 tanggungan = 6×, 2 atau lebih = 9× pengeluaran bulanan.</p>
    </div>

    <div class="form-section">
      <h2>03 <span>Aset & kewajiban</span></h2>
      <div class="form-grid-2">
        <label>Aset lain: investasi, emas
          <input type="number" name="investments" value="${UI.esc(p.investments)}" placeholder="0">
          <div class="rp-preview" data-for="investments">${p.investments ? UI.rpPlain(p.investments) : ''}</div>
          <span class="hint">Reksadana, saham, emas, deposito (bukan dana darurat).</span>
        </label>
        <label>Sisa total utang
          <input type="number" name="total_debt" value="${UI.esc(p.total_debt)}" placeholder="0">
          <div class="rp-preview" data-for="total_debt">${p.total_debt ? UI.rpPlain(p.total_debt) : ''}</div>
          <span class="hint">Isi 0 jika tidak memiliki utang/cicilan.</span>
        </label>
      </div>
      <div class="form-grid-2 mt-4">
        <label>Cicilan minimum per bulan
          <input type="number" name="debt_installment" value="${UI.esc(p.debt_installment)}" placeholder="0">
          <div class="rp-preview" data-for="debt_installment">${p.debt_installment ? UI.rpPlain(p.debt_installment) : ''}</div>
          <span class="hint">Otomatis digabungkan ke dalam porsi kebutuhan bulanan.</span>
        </label>
        <label>Usia — opsional
          <input type="number" name="age" value="${UI.esc(p.age)}" placeholder="Contoh: 25">
          <span class="hint">Hanya sebagai referensi profil, tidak membatasi pilihanmu.</span>
        </label>
      </div>
    </div>

    <div class="form-section">
      <h2>04 <span>Rencana investasi</span></h2>
      <p>Untuk simulasi dampak investasi terhadap kecepatan penuhnya dana darurat.</p>
      <div class="form-grid-2">
        <label>Investasi yang direncanakan / bulan
          <input type="number" name="plan_investment" value="${UI.esc(p.plan_investment)}" placeholder="0">
          <div class="rp-preview" data-for="plan_investment">${p.plan_investment ? UI.rpPlain(p.plan_investment) : ''}</div>
        </label>
        <div style="display:flex; flex-direction:column; justify-content:center; background:var(--bg); padding:16px; border-radius:var(--radius-sm);">
          <span style="font-size:12px; font-weight:600; color:var(--text-muted);">Estimasi setoran dana darurat</span>
          <span id="live-emerg-deposit" style="font-size:16px; font-weight:700; color:var(--green-dark); margin-top:4px;">${UI.rpPlain(Math.max(0, (Number(p.monthly_income)||0) - (Number(p.needs_expense)||0) - (Number(p.wants_expense)||0) - (Number(p.debt_installment)||0) - (Number(p.plan_investment)||0)))} / bulan</span>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="sidebar-info dark">
      <div class="eyebrow" style="color:var(--lime);">BUKAN SOAL GAJI BESAR</div>
      <h3>Mulai dari tahu<br>posisimu hari ini.</h3>
      <p>Angka-angka ini membantu memilih metode yang sesuai dengan kondisimu, bukan sekadar mengikuti tren.</p>
      <div style="font-size:12.5px; margin-top:16px; color:#B3CEC2; line-height:1.75;">
        <b style="color:#fff;">1. Pahami arus uang</b><br>Bandingkan pengeluaran dengan gaji bersihmu.<br><br>
        <b style="color:#fff;">2. Amankan dana darurat</b><br>Target menyesuaikan pengeluaran dan jumlah tanggungan.<br><br>
        <b style="color:#fff;">3. Investasi dengan sadar</b><br>Bangun fondasi dulu sebelum mengejar imbal hasil tinggi.
      </div>
    </div>
    
    <div class="panel">
      <h3 style="font:700 18px var(--font-heading); margin:0 0 8px;">Prinsip Prioritas Saku</h3>
      <p style="font-size:12.5px; color:var(--text-muted); line-height:1.6; margin-bottom:16px;">Urutan kesehatan finansial yang dijadikan acuan perhitungan otomatis di dashboardmu:</p>
      <div style="background:rgba(34, 197, 94, 0.12); border:1px solid rgba(34, 197, 94, 0.28); padding:14px; border-radius:var(--radius-sm); margin-bottom:10px;">
        <div style="font-size:11px; font-weight:700; color:#22C55E;">01 • KENDALI ARUS KAS</div>
        <div style="font-size:12px; color:var(--text-main); margin-top:4px; line-height:1.5;">Menjaga total pengeluaran & cicilan tetap di bawah 80% penghasilan bulanan.</div>
      </div>
      <div style="background:rgba(245, 158, 11, 0.12); border:1px solid rgba(245, 158, 11, 0.28); padding:14px; border-radius:var(--radius-sm); margin-bottom:10px;">
        <div style="font-size:11px; font-weight:700; color:#F59E0B;">02 • SABUK PENGAMAN</div>
        <div style="font-size:12px; color:var(--text-main); margin-top:4px; line-height:1.5;">Dana darurat adalah bantalan agar kamu tidak perlu menjual investasi saat rugi ketika butuh dana mendadak.</div>
      </div>
      <div style="background:rgba(59, 130, 246, 0.12); border:1px solid rgba(59, 130, 246, 0.28); padding:14px; border-radius:var(--radius-sm);">
        <div style="font-size:11px; font-weight:700; color:#3B82F6;">03 • KENDALI PENUH</div>
        <div style="font-size:12px; color:var(--text-main); margin-top:4px; line-height:1.5;">Kamu memegang kendali penuh atas setiap keputusan. Angka di sini adalah cermin untuk membantumu berpikir jernih.</div>
      </div>
    </div>

    <div style="margin-top:20px;">
      <button type="submit" class="btn primary full" id="btn-submit" style="padding:15px;">Simpan & perbarui</button>
      <p style="text-align:center; font-size:11.5px; color:var(--text-muted); margin-top:12px;">Data terenkripsi dan bisa kamu ubah kapan saja.</p>
    </div>
  </div>
  </form>`,

  Investasi: (c, p) => `<div class="page-heading flex-between">
    <div>
      <div class="eyebrow">CARA MENABUNG, VERSI KAMU</div>
      <h1>Metode boleh beda. Tujuannya tetap sama.</h1>
      <p>Gunakan rekomendasi otomatis sistem atau pilih metode secara manual sesuai kebutuhanmu.</p>
    </div>
    ${c.isManualMethod ? `<button type="button" id="btn-reset-method" class="btn outline">Kembalikan ke Otomatis (${UI.esc(c.autoMethod)})</button>` : ''}
  </div>
  
  <div class="alert success mb-4" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; background:#EAF5E9; border:1px solid #C8E6C9;">
    <div>
      <b>Metode aktif: ${UI.esc(c.method)} ${c.isManualMethod ? '(Dipilih Manual)' : '(Rekomendasi Sistem)'}</b><br>
      <span style="font-size:13px;">${p.income_type === 'fixed' ? 'Pendapatan tetap' : 'Pendapatan tidak tetap'} • Rasio ${c.ratio.toFixed(0)}% • Dana darurat ${UI.rp(c.emergency)} dari target ${UI.rp(c.target)}.</span>
    </div>
    <b style="font-size:16px;">${c.gap > 0 ? 'Kurang ' + UI.rp(c.gap) : 'Dana darurat aman'}</b>
  </div>

  <div class="method-grid">
    ${['50/30/20', '80/20', '40/30/20/10', 'ZBB'].map(m => {
      const isActive = c.method === m;
      const isAutoRec = c.autoMethod === m;
      return `<div class="method-card ${isActive ? 'active' : ''}" style="${isActive ? 'background:linear-gradient(155deg, #143B2D 0%, #0E2B21 100%); color:#fff; border-color:var(--green-dark);' : ''}">
        <div class="eyebrow" style="${isActive ? 'color:var(--lime);' : ''}">
          ${isActive ? 'AKTIF DIGUNAKAN' : (isAutoRec ? 'REKOMENDASI SISTEM' : (m==='50/30/20'?'SEIMBANG':(m==='80/20'?'PRAKTIS':(m==='ZBB'?'SETIAP RUPIAH BERPERAN':'PRIORITAS DARURAT'))))}
        </div>
        <div class="method-title" style="${isActive ? 'color:#fff;' : ''}">${m}</div>
        <div style="font-size:12.5px; line-height:1.6; margin-bottom:18px; ${isActive ? 'color:#B3CEC2;' : 'color:var(--text-muted);'}">
          ${m === '50/30/20' ? 'Ruang untuk kebutuhan, keinginan, dan masa depan.<br><br>50% kebutuhan<br>30% keinginan<br>20% tabungan / investasi<br><br>Dana darurat aman dan rasio pengeluaran ≤70%.' : 
            m === '80/20' ? 'Dua pos saja, supaya lebih mudah konsisten.<br><br>80% semua pengeluaran<br>20% tabungan / investasi<br><br>Dana darurat aman dan rasio >70% hingga 80%.' : 
            m === '40/30/20/10' ? 'Tetap menabung sambil membangun dana darurat.<br><br>40% kebutuhan<br>30% keinginan<br>20% tabungan / investasi<br>10% dana darurat<br><br>Pendapatan tetap, rasio ≤80%, dan dana darurat belum penuh.' : 
            'Beri tugas untuk setiap rupiah, hingga sisa alokasi nol.<br><br>Gaji - seluruh alokasi = 0<br>Termasuk tabungan<br>Rinci setiap kategori<br><br>Pendapatan tidak tetap atau rasio pengeluaran >80%.'}
        </div>
        <button type="button" class="btn ${isActive ? 'lime' : 'outline'} btn-select-method" data-method="${m}" ${isActive ? 'disabled' : ''}>
          ${isActive ? 'Sedang digunakan' : 'Gunakan metode ini'}
        </button>
      </div>`;
    }).join('')}
  </div>

  <div class="panel mt-6" style="padding:32px;">
    <h2 style="font:700 22px var(--font-heading); margin:0 0 8px;">Bagaimana sistem menentukan rekomendasi?</h2>
    <p style="color:var(--text-muted); font-size:13.5px; margin-bottom:24px;">Kondisi dicek berurutan. Kondisi pertama yang cocok menjadi rekomendasi otomatis untukmu.</p>
    <div style="display:grid; gap:10px; font-size:13.5px;">
      <div class="flex-between" style="padding:14px 16px; border-radius:var(--radius-sm); ${p.income_type !== 'fixed' ? 'background:#EAF5E9; font-weight:700; color:var(--green-dark);' : 'background:var(--bg);'}"><span><b style="display:inline-block; width:30px;">01</b> Pendapatan tidak tetap</span><b>ZBB</b></div>
      <div class="flex-between" style="padding:14px 16px; border-radius:var(--radius-sm); ${p.income_type === 'fixed' && c.ratio > 80 ? 'background:#EAF5E9; font-weight:700; color:var(--green-dark);' : 'background:var(--bg);'}"><span><b style="display:inline-block; width:30px;">02</b> Rasio >80% atau pengeluaran ≥ gaji</span><b>ZBB</b></div>
      <div class="flex-between" style="padding:14px 16px; border-radius:var(--radius-sm); ${c.autoMethod === '40/30/20/10' ? 'background:#EAF5E9; font-weight:700; color:var(--green-dark);' : 'background:var(--bg);'}"><span><b style="display:inline-block; width:30px;">03</b> Rasio ≤80% dan dana darurat belum penuh</span><b>40/30/20/10</b></div>
      <div class="flex-between" style="padding:14px 16px; border-radius:var(--radius-sm); ${c.autoMethod === '50/30/20' ? 'background:#EAF5E9; font-weight:700; color:var(--green-dark);' : 'background:var(--bg);'}"><span><b style="display:inline-block; width:30px;">04</b> Dana darurat aman dan rasio ≤70%</span><b>50/30/20</b></div>
      <div class="flex-between" style="padding:14px 16px; border-radius:var(--radius-sm); ${c.autoMethod === '80/20' ? 'background:#EAF5E9; font-weight:700; color:var(--green-dark);' : 'background:var(--bg);'}"><span><b style="display:inline-block; width:30px;">05</b> Dana darurat aman dan rasio >70% hingga 80%</span><b>80/20</b></div>
    </div>
  </div>`,

  Refleksi: (c, notes = []) => `<div class="page-heading"><div class="eyebrow">SPENDING CHECK</div><h1>Pause sebentar, cek kondisi</h1><p>Bukan buat menghakimi. Catatanmu tersimpan aman di cloud dan sinkron di semua perangkat.</p></div>
  <div class="dashboard-split">
    <div class="panel">
      <div class="eyebrow">KEINGINAN VS. GAJI</div>
      <div class="stat-value" style="font-size:48px; margin:16px 0;">${c.income > 0 ? (c.wants / c.income * 100).toFixed(1) : 0}%</div>
      <p style="color:var(--text-muted); margin-bottom:20px;">Porsi pengeluaran keinginan (${UI.rp(c.wants)}) dari pendapatan bersihmu (${UI.rp(c.income)}).</p>
      ${c.reflection ? `<div class="alert warning">${UI.esc(c.reflection)}</div>` : `<div class="alert success">Porsi keinginanmu belum melewati 30% dari gaji. Pertahankan!</div>`}
    </div>
    <div class="panel">
      <div class="eyebrow">CATATAN REFLEKSI</div>
      <h2 style="font:700 20px var(--font-heading); margin:12px 0;">Apa yang paling kamu butuhkan sekarang: rasa aman atau menambah investasi?</h2>
      <textarea id="reflection-input" placeholder="Tulis pertimbangan atau evaluasi keuanganmu bulan ini..." style="height:120px; resize:none;"></textarea>
      <button type="button" id="btn-save-reflection" class="btn primary mt-4">Simpan Catatan</button>

      <div class="mt-6">
        <div class="eyebrow">RIWAYAT CATATANMU (${notes.length})</div>
        <div id="reflection-list">
          ${notes.length === 0 ? `<p style="font-size:13px; color:var(--text-muted);">Belum ada catatan refleksi tersimpan.</p>` : notes.map(n => {
            const dateStr = new Date(n.created_at).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            return `<div class="note-item">
              <div class="note-item-head">
                <span>${UI.esc(dateStr)}</span>
                <button type="button" class="btn-delete-note" data-id="${n.id}" style="background:none; border:none; color:#C62828; cursor:pointer; font-size:11.5px; font-weight:600;">Hapus</button>
              </div>
              <p>${UI.esc(n.content)}</p>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>`
};