/* Maintenance gate: runs BEFORE dashboard.js. While maintenance is ON the dashboard never loads. */
(function () {
  'use strict';
  var SB = 'https://vkfexceitwjmxncwceqb.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI';
  var PORTAL = 'index.html', EVERY = 15000;
  var ls = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var VIEW = /vt=[A-Za-z0-9]+/.test(location.hash || '');
  var tok = ls('thabit_trainee_token');
  console.log('[maintenance] gate loaded, token:', !!tok, 'view:', VIEW);
  if (VIEW || !tok) { window.__mtGate = Promise.resolve(false); return; }

  var TX = {
    en: { t: 'We are upgrading the page', b: 'Please wait until further notice.', s: 'No need to contact us. We will let you know as soon as we are done.', back: 'Back to portal' },
    ar: { t: 'نعمل الآن على تطوير الصفحة', b: 'من فضلك انتظر حتى إشعار آخر.', s: 'لا داعي للتواصل معنا، سنُعلمك فور الانتهاء.', back: 'الرجوع للبوابة' },
    eg: { t: 'الصفحة بتتحدّث دلوقتي', b: 'من فضلك استنى لحد إشعار تاني.', s: 'مش لازم تكلمنا، هنبلغك أول ما نخلص.', back: 'الرجوع للبوابة' }
  };
  var L = function () { return TX[ls('thabit_lang')] || TX.en; };

  var hide = document.createElement('style');
  hide.textContent = 'html.mtchk body>*:not(.mt){visibility:hidden!important}';
  document.head.appendChild(hide); document.documentElement.classList.add('mtchk');

  function isM(n) { var m = n && n.meta; return !!m && (m.maintenance === true || m.maintenance === 'true'); }
  function fetchState() {
    return fetch(SB + '/rest/v1/rpc/trainee_notifications', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_token: tok }) })
      .then(function (r) { return r.json(); })
      .then(function (a) { console.log('[maintenance] notifications:', a); return Array.isArray(a) ? a.some(isM) : null; })
      .catch(function (e) { console.warn('[maintenance] fetch failed', e); return null; });
  }

  function wipe() {
    var t = tok;
    try { localStorage.removeItem('thabit_trainee_token'); localStorage.removeItem('currentTrainee'); localStorage.removeItem('thabit_intro_tok'); } catch (e) {}
    try { sessionStorage.setItem('thabit_no_autologin', '1'); } catch (e) {}
    try { fetch(SB + '/rest/v1/rpc/trainee_logout', { method: 'POST', keepalive: true, headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_token: t }) }); } catch (e) {}
  }
  function goPortal() {
    window.removeEventListener('popstate', goPortal);
    wipe();
    location.replace(PORTAL);
  }

  function gear(cx, cy, r, n, d) {
    var p = [], steps = n * 4, k, a, rr;
    for (k = 0; k < steps; k++) { a = k / steps * Math.PI * 2; rr = (k % 4 < 2) ? r + d : r; p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1)); }
    return 'M' + p.join('L') + 'Z';
  }
  function art() {
    var stars = '', i, x, y;
    for (i = 0; i < 26; i++) { x = (i * 97 % 236) + 2; y = (i * 53 % 226) + 4; stars += '<circle cx="' + x + '" cy="' + y + '" r="' + (0.7 + (i % 3) * 0.5) + '" fill="#fff"><animate attributeName="opacity" values=".12;.9;.12" dur="' + (2 + (i % 5) * .7) + 's" begin="' + (i % 7) * .3 + 's" repeatCount="indefinite"/></circle>'; }
    return '<svg viewBox="0 0 240 230" width="260" height="250" aria-hidden="true" style="overflow:visible">'
      + '<defs><radialGradient id="mtG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fbbf24" stop-opacity=".28"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient></defs>'
      + '<circle cx="120" cy="115" r="112" fill="url(#mtG)"/>' + stars
      + '<g fill="none" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 7px rgba(251,191,36,.7))">'
      + '<g stroke="#fbbf24" stroke-width="3"><path d="' + gear(100, 128, 40, 10, 9) + '"/><circle cx="100" cy="128" r="17"/><circle cx="100" cy="128" r="5" fill="#fbbf24"/><animateTransform attributeName="transform" type="rotate" from="0 100 128" to="360 100 128" dur="14s" repeatCount="indefinite"/></g>'
      + '<g stroke="#e2e8f0" stroke-width="2.6"><path d="' + gear(170, 70, 24, 7, 7) + '"/><circle cx="170" cy="70" r="9"/><animateTransform attributeName="transform" type="rotate" from="360 170 70" to="0 170 70" dur="10s" repeatCount="indefinite"/></g></g></svg>';
  }

  var ov = null;
  function retext() {
    var t = L(), r = document.documentElement;
    ov.setAttribute('dir', r.dir === 'ltr' ? 'ltr' : 'rtl');
    ov.querySelector('[data-t]').textContent = t.t; ov.querySelector('[data-b]').textContent = t.b;
    ov.querySelector('[data-s]').textContent = t.s; ov.querySelector('[data-k]').textContent = t.back;
  }
  function show() {
    if (ov) { retext(); return; }
    var s = document.createElement('style');
    s.textContent = '.mt{position:fixed;inset:0;z-index:2147483600;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:24px;text-align:center;font-family:Cairo,Inter,sans-serif;visibility:visible!important}'
      + '.mt h1{margin:14px 0 4px;font-size:clamp(1.3rem,5vw,1.9rem);font-weight:800;color:#fbbf24}'
      + '.mt p{margin:0;font-size:1rem;opacity:.92;max-width:360px;line-height:1.7}.mt .mts{font-size:.82rem;opacity:.55;margin-top:6px}'
      + '.mt .mtb{width:min(240px,70vw);height:4px;border-radius:4px;background:rgba(255,255,255,.14);overflow:hidden;margin-top:18px}'
      + '.mt .mtb i{display:block;height:100%;width:40%;background:linear-gradient(90deg,transparent,#fbbf24,transparent);animation:mtSl 1.8s ease-in-out infinite}'
      + '@keyframes mtSl{from{transform:translateX(-120%)}to{transform:translateX(320%)}}'
      + '.mt .mtk{margin-top:22px;padding:9px 20px;border-radius:999px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;font:600 .85rem Cairo,Inter,sans-serif;cursor:pointer}';
    document.head.appendChild(s);
    ov = document.createElement('div'); ov.className = 'mt'; ov.setAttribute('role', 'status');
    ov.innerHTML = art() + '<h1 data-t></h1><p data-b></p><p class="mts" data-s></p><div class="mtb"><i></i></div><button type="button" class="mtk" data-k></button>';
    document.body.appendChild(ov);
    ov.querySelector('[data-k]').onclick = goPortal;
    document.documentElement.style.overflow = 'hidden';
    try { history.pushState({ mt: 1 }, '', location.href); } catch (e) {}
    window.addEventListener('popstate', goPortal);
    retext();
  }

  function poll() {
    var run = function () { fetchState().then(function (on) { if (on === false) location.reload(); }); };
    setInterval(run, EVERY);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) run(); });
  }

  window.__mtGate = Promise.race([fetchState(), new Promise(function (r) { setTimeout(function () { r(null); }, 4000); })]).then(function (on) {
    if (on === true) {
      var go = function () { show(); poll(); };
      if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
    }
    document.documentElement.classList.remove('mtchk');
    return on === true;
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted && !ls('thabit_trainee_token')) location.replace(PORTAL);
  });
})();
