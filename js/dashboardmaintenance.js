/* ==========================================================
   Maintenance screen (load AFTER dashboard.js)
   When the admin sends the "update" message, the trainee's dashboard is replaced by a
   black full-screen page ("we are upgrading the page, please wait until further notice").
   It checks every 15 seconds. When the admin ends the update, the page reloads by itself.
   The signal is a normal row in the existing `notifications` table:
       kind = 'message'  and  meta = {"maintenance": true}
   so NO new SQL is needed. The admin panel sends / removes it (adminpanel-maint.js).
   Not shown in the admin's "Dashboard view" popup (VIEW mode).
   ========================================================== */
(function () {
  'use strict';
  if (typeof VIEW !== 'undefined' && VIEW) return;
  var TX = {
    en: { t: 'We are upgrading the page', b: 'Please wait until further notice.', s: 'No need to contact us. We will let you know as soon as we are done.' },
    ar: { t: 'نعمل الآن على تطوير الصفحة', b: 'من فضلك انتظر حتى إشعار آخر.', s: 'لا داعي للتواصل معنا، سنُعلمك فور الانتهاء.' },
    eg: { t: 'الصفحة بتتحدّث دلوقتي', b: 'من فضلك استنى لحد إشعار تاني.', s: 'مش لازم تكلمنا، هنبلغك أول ما نخلص.' }
  };
  var ov = null, EVERY = 15000;
  var L = function () { var l = 'en'; try { l = lang; } catch (e) {} return TX[l] || TX.en; };

  function gear(cx, cy, r, n, d) {
    var p = [], steps = n * 4, k, a, rr;
    for (k = 0; k < steps; k++) {
      a = k / steps * Math.PI * 2; rr = (k % 4 < 2) ? r + d : r;
      p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1));
    }
    return 'M' + p.join('L') + 'Z';
  }
  function art() {
    var stars = '', i, x, y;
    for (i = 0; i < 26; i++) {
      x = (i * 97 % 236) + 2; y = (i * 53 % 226) + 4;
      stars += '<circle cx="' + x + '" cy="' + y + '" r="' + (0.7 + (i % 3) * 0.5) + '" fill="#fff"><animate attributeName="opacity" values=".12;.9;.12" dur="' + (2 + (i % 5) * .7) + 's" begin="' + (i % 7) * .3 + 's" repeatCount="indefinite"/></circle>';
    }
    return '<svg viewBox="0 0 240 230" width="260" height="250" aria-hidden="true" style="overflow:visible">'
      + '<defs><radialGradient id="mtG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fbbf24" stop-opacity=".28"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient></defs>'
      + '<circle cx="120" cy="115" r="112" fill="url(#mtG)"/>' + stars
      + '<g fill="none" stroke="#fbbf24" stroke-opacity=".35" stroke-dasharray="3 7"><ellipse cx="120" cy="115" rx="108" ry="40" transform="rotate(-24 120 115)"><animateTransform attributeName="transform" type="rotate" from="-24 120 115" to="336 120 115" dur="40s" repeatCount="indefinite"/></ellipse>'
      + '<ellipse cx="120" cy="115" rx="108" ry="40" transform="rotate(40 120 115)"><animateTransform attributeName="transform" type="rotate" from="40 120 115" to="-320 120 115" dur="55s" repeatCount="indefinite"/></ellipse></g>'
      + '<g fill="none" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 7px rgba(251,191,36,.7))">'
      + '<g stroke="#fbbf24" stroke-width="3"><path d="' + gear(100, 128, 40, 10, 9) + '"/><circle cx="100" cy="128" r="17"/><circle cx="100" cy="128" r="5" fill="#fbbf24"/><animateTransform attributeName="transform" type="rotate" from="0 100 128" to="360 100 128" dur="14s" repeatCount="indefinite"/></g>'
      + '<g stroke="#e2e8f0" stroke-width="2.6"><path d="' + gear(170, 70, 24, 7, 7) + '"/><circle cx="170" cy="70" r="9"/><animateTransform attributeName="transform" type="rotate" from="360 170 70" to="0 170 70" dur="10s" repeatCount="indefinite"/></g></g>'
      + '<g fill="#fbbf24" transform="translate(196 150)"><path d="M0-14L3-3L14 0L3 3L0 14L-3 3L-14 0L-3-3Z"><animateTransform attributeName="transform" type="scale" values="1;1.35;1" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.55;1" dur="2.4s" repeatCount="indefinite"/></path></g>'
      + '<g fill="#fff" transform="translate(36 56)"><path d="M0-8L2-2L8 0L2 2L0 8L-2 2L-8 0L-2-2Z"><animate attributeName="opacity" values=".2;1;.2" dur="3s" repeatCount="indefinite"/></path></g>'
      + '</svg>';
  }
  function show() {
    if (ov) return;
    var s = document.createElement('style'); s.id = 'mtCss';
    s.textContent = '.mt{position:fixed;inset:0;z-index:2147483600;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:24px;text-align:center;font-family:Cairo,Inter,sans-serif;animation:mtIn .5s ease-out}'
      + '@keyframes mtIn{from{opacity:0}to{opacity:1}}'
      + '.mt h1{margin:14px 0 4px;font-size:clamp(1.3rem,5vw,1.9rem);font-weight:800;color:#fbbf24}'
      + '.mt p{margin:0;font-size:1rem;opacity:.92;max-width:360px;line-height:1.7}'
      + '.mt .mts{font-size:.82rem;opacity:.55;margin-top:6px}'
      + '.mt .mtb{width:min(240px,70vw);height:4px;border-radius:4px;background:rgba(255,255,255,.14);overflow:hidden;margin-top:18px}'
      + '.mt .mtb i{display:block;height:100%;width:40%;border-radius:4px;background:linear-gradient(90deg,transparent,#fbbf24,transparent);animation:mtSl 1.8s ease-in-out infinite}'
      + '@keyframes mtSl{from{transform:translateX(-120%)}to{transform:translateX(320%)}}';
    document.head.appendChild(s);
    ov = document.createElement('div'); ov.className = 'mt'; ov.setAttribute('role', 'status');
    ov.innerHTML = art() + '<h1 data-t></h1><p data-b></p><p class="mts" data-s></p><div class="mtb"><i></i></div>';
    document.body.appendChild(ov);
    document.documentElement.style.overflow = 'hidden';
    retext();
  }
  function retext() {
    if (!ov) return; var t = L(), r = document.documentElement;
    ov.setAttribute('dir', r.dir === 'ltr' ? 'ltr' : 'rtl');
    ov.querySelector('[data-t]').textContent = t.t; ov.querySelector('[data-b]').textContent = t.b; ov.querySelector('[data-s]').textContent = t.s;
  }
  var isM = function (n) { var m = n && n.meta; return !!m && (m.maintenance === true || m.maintenance === 'true'); };
  async function check() {
    var t; try { t = tok(); } catch (e) { return; }
    if (!t) return;
    var r; try { r = await rpc('trainee_notifications', { p_token: t }); } catch (e) { return; }
    if (!Array.isArray(r)) return;                       // network / server hiccup: keep the current state
    var on = r.some(isM);
    if (on) { if (!ov) show(); else retext(); }
    else if (ov) location.reload();                      // the admin ended the update
  }
  function start() { check(); setInterval(check, EVERY); document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();