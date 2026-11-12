/* Thabit Space: بيربط لوحة الأدمن (adminpanel.js) فوق اللوحة اللانهائية (board.js).
   - مش بيعمل أي حاجة إلا لو فيه جلسة أدمن أو الرابط فيه ?admin  (الزوار بيشوفوا اللوحة العادية بس)
   - بيحمّل كود الأدمن وقت الحاجة بس، فالزائر العادي مش بيحمّل ولا سطر منه
   - اللوحة بتتحفظ في Supabase (space_boards)، وأماكن الأزرار والنوافذ في admin_ui_state */
(function () {
  'use strict';
  const Q = new URLSearchParams(location.search);
  const SESSION_KEY = 'thabit_admin_session';
  const hasSession = () => { try { const x = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); return !!(x && x.refresh_token); } catch { return false; } };
  if (!Q.has('admin') && !hasSession()) return;
  if (!window.ThabitBoard) { console.error('[board-admin] board.js لازم يتحمّل الأول'); return; }

  /* لو ملفاتك في أماكن تانية، عدّلها قبل تحميل السكريبت: window.THABIT_ADMIN = { page:'...', css:[...], js:[...] } */
  const CFG = Object.assign({
    page: 'adminpanel.html',
    css: ['Css/adminpanel.css', 'Css/richtext.css', 'board-admin.css'],
    js: ['js/adminpanel.js', 'js/adminpanelmaint.js', 'js/adminvoicenote.js'],
    tailwind: 'https://cdn.tailwindcss.com',
    fa: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  }, window.THABIT_ADMIN || {});

  const loadCss = href => new Promise(res => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href;
    l.onload = l.onerror = () => res(); document.head.appendChild(l);
  });
  const loadJs = src => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.async = false;
    s.onload = () => res(); s.onerror = () => rej(new Error('تعذّر تحميل ' + src)); document.head.appendChild(s);
  });
  function fail(msg) {
    console.error('[board-admin]', msg);
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:100001;background:#7f1d1d;color:#fff;padding:10px 16px;border-radius:10px;font:600 13px Cairo,sans-serif;direction:rtl;max-width:90vw';
    d.textContent = 'لوحة الأدمن: ' + msg; document.body.appendChild(d);
  }

  /* ---------------- state ---------------- */
  let saved = { buttons: {}, windows: {} };     /* المحفوظ في Supabase */
  let started = false, zTop = 1, lastDrag = 0;
  const seenBtn = new WeakSet();
  const $ = id => document.getElementById(id);
  const toast = (m, err) => { try { window.showToast(m, !!err); } catch { } };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------- cloud ---------------- */
  const api = {
    fetch: (p, o) => window.sbFetch(p, o),
    get url() { return window.SUPABASE_URL || SUPABASE_URL; },
    get key() { return window.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY; },
    token: () => window.SB_ACCESS_TOKEN || SUPABASE_ANON_KEY
  };
  async function startCloud() {
    if (started) return; started = true;
    buildControls();
    window.ThabitBoard.enterCloud(api);
    await loadLayout();
  }

  /* ---------------- layout (أماكن الأزرار والنوافذ) ---------------- */
  async function loadLayout() {
    try {
      const r = await (await sbFetch('admin_ui_state?select=value&key=eq.layout')).json();
      if (Array.isArray(r) && r[0] && r[0].value) saved = Object.assign({ buttons: {}, windows: {} }, r[0].value);
    } catch (e) { console.warn('[board-admin] layout', e.message); }
    applyButtons();
    Object.keys(window.WSE || {}).forEach(k => { const el = WSE[k].el; if (el && el.style.display !== 'none') placeWindow(k); });
  }
  function setPos(el, x, y) { el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px'; }
  function applyBtn(b) {
    const p = saved.buttons[b.dataset.ws];
    if (p) { b.classList.add('ba-free'); setPos(b, clamp(p.x, 0, innerWidth - 60), clamp(p.y, 0, innerHeight - 40)); }
    else { b.classList.remove('ba-free'); b.style.left = b.style.top = ''; }
  }
  function applyButtons() { document.querySelectorAll('#adminLauncher .ws-lb').forEach(b => { seenBtn.add(b); applyBtn(b); }); }

  function defaultPos(el) {
    const others = [...document.querySelectorAll('#adminWs .ws-w')].filter(w => w !== el && w.style.display !== 'none');
    const W = el.offsetWidth || 380;
    let x = 90, y = 118;
    if (others.length) {
      const right = Math.max(...others.map(w => w.offsetLeft + w.offsetWidth));
      if (right + 12 + W <= innerWidth - 8) { x = right + 12; y = Math.min(...others.map(w => w.offsetTop)); }
      else { x = 90 + others.length * 28; y = 118 + others.length * 28; }
    }
    return { x: clamp(x, 0, Math.max(0, innerWidth - 120)), y: clamp(y, 0, Math.max(0, innerHeight - 60)) };
  }
  function placeWindow(k) {
    const w = window.WSE && WSE[k]; if (!w) return;
    const el = w.el, p = saved.windows[k];
    el.style.width = el.style.height = '';
    if (p) {
      if (p.w) el.style.width = p.w + 'px';
      if (p.h) el.style.height = p.h + 'px';
      setPos(el, clamp(p.x, -200, innerWidth - 80), clamp(p.y, 0, innerHeight - 40));
    } else { const d = defaultPos(el); setPos(el, d.x, d.y); }
    el.style.zIndex = ++zTop;
  }
  const anyOpen = () => Object.keys(window.WSE || {}).some(k => WSE[k].el.style.display !== 'none');

  async function saveLayout() {
    const snap = { buttons: {}, windows: Object.assign({}, saved.windows) };
    document.querySelectorAll('#adminLauncher .ws-lb.ba-free').forEach(b => {
      const r = b.getBoundingClientRect(); snap.buttons[b.dataset.ws] = { x: Math.round(r.left), y: Math.round(r.top) };
    });
    Object.keys(window.WSE || {}).forEach(k => {
      const el = WSE[k].el; if (el.style.display === 'none') return;
      const p = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth };
      if (el.style.height) p.h = el.offsetHeight;
      snap.windows[k] = p;
    });
    try {
      await persistLayout(snap); saved = snap; toast('اتحفظت أماكن الأزرار والنوافذ ✓');
    } catch (e) { toast('فشل حفظ الأماكن: ' + e.message + ' (شغّل 01_space.sql)', true); }
  }
  function persistLayout(v) {
    return sbFetch('admin_ui_state?on_conflict=key', {
      method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ key: 'layout', value: v, updated_at: new Date().toISOString() })
    });
  }
  async function resetLayout() {
    const empty = { buttons: {}, windows: {} };
    try { await persistLayout(empty); } catch (e) { toast('فشل مسح الأماكن المحفوظة: ' + e.message, true); return; }
    saved = empty; applyButtons();
    Object.keys(window.WSE || {}).forEach(k => { if (WSE[k].el.style.display !== 'none') placeWindow(k); });
    toast('رجعت الأماكن للوضع الأصلي ✓');
  }

  /* ---------------- dragging ---------------- */
  function onPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    const win = e.target.closest && e.target.closest('#adminWs .ws-w');
    if (win) win.style.zIndex = ++zTop;
    const hd = e.target.closest && e.target.closest('#adminWs .ws-h');
    const lb = e.target.closest && e.target.closest('#adminLauncher .ws-lb');
    let el, kind;
    if (hd && !e.target.closest('button')) { el = hd.closest('.ws-w'); kind = 'win'; }
    else if (lb) { el = lb; kind = 'btn'; }
    else return;
    const r = el.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY, dx = sx - r.left, dy = sy - r.top;
    let moving = false;
    const cap = kind === 'win' ? hd : el;
    try { cap.setPointerCapture(e.pointerId); } catch { }
    const move = ev => {
      if (!moving) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
        moving = true; el.classList.add('ba-drag');
        if (kind === 'btn') el.classList.add('ba-free');   /* الزرار يطلع من الصف ويتحرك بحرية */
      }
      const W = el.offsetWidth;
      const x = kind === 'win' ? clamp(ev.clientX - dx, 80 - W, innerWidth - 80) : clamp(ev.clientX - dx, 0, innerWidth - W);
      const y = clamp(ev.clientY - dy, 0, innerHeight - 40);
      setPos(el, x, y); ev.preventDefault();
    };
    const up = () => {
      cap.removeEventListener('pointermove', move); cap.removeEventListener('pointerup', up); cap.removeEventListener('pointercancel', up);
      try { cap.releasePointerCapture(e.pointerId); } catch { }
      el.classList.remove('ba-drag'); if (moving) lastDrag = Date.now();
    };
    cap.addEventListener('pointermove', move); cap.addEventListener('pointerup', up); cap.addEventListener('pointercancel', up);
  }

  /* ---------------- controls (حفظ / رجوع / إخفاء / خروج) ---------------- */
  function buildControls() {
    if ($('baCtl')) return;
    const c = document.createElement('div'); c.id = 'baCtl';
    c.innerHTML =
      '<button type="button" data-a="save" title="احفظ أماكن الأزرار والنوافذ الحالية"><i class="fa-solid fa-thumbtack"></i></button>' +
      '<button type="button" data-a="reset" title="رجّع الأماكن للوضع الأصلي"><i class="fa-solid fa-rotate-left"></i></button>' +
      '<button type="button" data-a="hide" title="إخفاء لوحة الأدمن (اللوحة فقط)"><i class="fa-solid fa-eye-slash"></i></button>' +
      '<button type="button" data-a="out" title="تسجيل خروج"><i class="fa-solid fa-right-from-bracket"></i></button>';
    c.addEventListener('click', e => {
      const a = e.target.closest('button'); if (!a) return;
      ({ save: saveLayout, reset: resetLayout, hide: () => setHidden(true), out: () => window.adminLogout() })[a.dataset.a]();
    });
    const s = document.createElement('button'); s.id = 'baShow'; s.type = 'button'; s.hidden = true; s.title = 'إظهار لوحة الأدمن';
    s.innerHTML = '<i class="fa-solid fa-eye"></i>'; s.onclick = () => setHidden(false);
    document.body.append(c, s);
  }
  function setHidden(h) {
    const o = $('adminModalOverlay'); if (o) o.classList.toggle('ba-hidden', h);
    const c = $('baCtl'); if (c) c.classList.toggle('ba-off', h);
    const s = $('baShow'); if (s) s.hidden = !h;
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    CFG.css.forEach(h => { if (!/board-admin\.css$/.test(h)) loadCss(h); });
    loadCss(CFG.fa);
    const html = await (await fetch(CFG.page, { cache: 'no-cache' })).text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    ['generalToast', 'thaAuth', 'adminModalOverlay', 'floatingWindowsRoot'].forEach(id => {
      const n = doc.getElementById(id); if (n && !$(id)) document.body.appendChild(document.importNode(n, true));
    });
    /* لازم يتحمّل بعد كل ستايلات الأدمن عشان يغلبها */
    CFG.css.filter(h => /board-admin\.css$/.test(h)).forEach(h => loadCss(h));
    await loadJs(CFG.tailwind).catch(() => { });
    for (const src of CFG.js) await loadJs(src);

    /* ----- تعديلات بعد تحميل كود الأدمن وقبل ما يبدأ ----- */
    const showView = window.showAdminView;
    window.showAdminView = function (v) { if (v === 'home') return; return showView.apply(this, arguments); };   /* من غير فتح Dashboard تلقائي */
    const openMain = window.openAdminMainPanel;
    window.openAdminMainPanel = function () { const r = openMain.apply(this, arguments); startCloud(); return r; };
    window.toggleAdminPanel = function () { const o = $('adminModalOverlay'); setHidden(!(o && o.classList.contains('ba-hidden'))); };
    window.goToPortal = function () { location.replace(location.pathname); };
    window.adminLogout = async function () {
      try { await window.ThabitBoard.flush(); } catch { }
      try { if (window.SB_ACCESS_TOKEN) await fetch(SUPABASE_URL + '/auth/v1/logout', { method: 'POST', headers: sbHeaders() }); } catch { }
      clearAdminSession(); location.replace(location.pathname);
    };
    const open0 = window.openWin;
    window.openWin = function (k) {
      const had = window.WSE && WSE[k] && WSE[k].el.style.display !== 'none';
      const r = open0.apply(this, arguments);
      if (!had) placeWindow(k);
      return r;
    };
    const close0 = window.closeWin;
    window.closeWin = function (k) {
      const r = close0.apply(this, arguments);
      if (!anyOpen()) applyButtons();                      /* لما كله يتقفل، الأزرار ترجع لمكانها */
      return r;
    };

    const L = $('adminLauncher');
    if (L) {
      L.addEventListener('click', e => { if (Date.now() - lastDrag < 400) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
      new MutationObserver(() => {
        L.querySelectorAll('.ws-lb').forEach(b => { if (!seenBtn.has(b)) { seenBtn.add(b); applyBtn(b); } });
      }).observe(L, { childList: true });
    }
    document.addEventListener('pointerdown', onPointerDown, true);

    /* كتابة/لصق جوه نوافذ الأدمن ما تتحسبش اختصارات أو لصق صور للوحة */
    const guard = e => {
      const t = e.target;
      if (t && t.closest && (t.closest('.ws-w, .ds-ov, .sp-pop, #thaAuth') || t.isContentEditable)) e.stopPropagation();
    };
    document.body.addEventListener('keydown', guard); document.body.addEventListener('paste', guard);

    window.dispatchEvent(new Event('DOMContentLoaded'));   /* adminpanel.js بيشتغل على الحدث ده */
  }
  boot().catch(e => fail(e.message || e));
})();