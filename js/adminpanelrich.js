/* ==========================================================
   Admin rich-text editor (loads AFTER adminpanel.js and richtext.js).
   Adds a formatting toolbar + floating live preview on every long-text popup:
   QOL, TFL, Notes, AND now the notification message (ntBody), the bulk Task
   description (tkBody) and the Monthly obligations message (moBody).
   Stored value stays plain text with markers (see richtext.js).
   ========================================================== */
(function () {
  'use strict';
  if (!window.ThabitRich || typeof window.dsTextPop !== 'function') {
    console.warn('adminpanel-rich: load richtext.js and adminpanel.js first');
    return;
  }
  var R = window.ThabitRich;
  /* which popups get the toolbar */
  var RICH_FIELD = /^(?:ds_(?:qol|tefl|notes)_\d+|ntBody|tkBody|moBody)$/;
  var NAMES = { qol: 'QOL', tefl: 'TFL', notes: 'Notes' };
  var FIXED = { ntBody: 'Notification', tkBody: 'Task', moBody: 'Monthly obligations' };
  var COLORS = [['gold', 'ذهبي'], ['green', 'أخضر'], ['red', 'أحمر'], ['blue', 'أزرق'], ['purple', 'بنفسجي'], ['orange', 'برتقالي'], ['gray', 'رمادي']];
  var lastPos = null, lastTheme = null;

  (function () {
    if (document.getElementById('rtAdminCss')) return;
    var s = document.createElement('style'); s.id = 'rtAdminCss';
    s.textContent = [
      '.rt-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px;margin-bottom:8px;border:1px solid #334155;border-radius:12px;background:#0b1220}',
      '.rt-tb{min-width:34px;height:34px;padding:0 10px;border-radius:9px;border:1px solid #475569;background:transparent;color:#e2e8f0;font:700 13px Cairo,Inter,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}',
      '.rt-tb:hover{border-color:#fbbf24}.rt-tb.on{background:#f59e0b;border-color:#f59e0b;color:#0f172a}',
      '.rt-link-btn{color:#38bdf8}',
      '.rt-sw{width:22px;height:22px;border-radius:50%;border:2px solid rgba(148,163,184,.55);cursor:pointer;padding:0}',
      '.rt-sw:hover{transform:scale(1.15);border-color:#fff}',
      '.rt-sep2{width:1px;height:22px;background:#334155;margin:0 2px}',
      '.rt-prev{position:fixed;z-index:2147483100;width:min(380px,calc(100vw - 24px));max-height:70vh;display:flex;flex-direction:column;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6);border:1px solid rgba(245,158,11,.55);font-family:Cairo,Inter,sans-serif}',
      '.rt-prev.rt-dark{background:#0b1220;color:#f1f5f9}.rt-prev.rt-light{background:#ffffff;color:#0f172a}',
      '.rt-prev-h{display:flex;align-items:center;gap:6px;padding:8px 10px;cursor:grab;touch-action:none;user-select:none;background:rgba(245,158,11,.14);border-bottom:1px solid rgba(148,163,184,.3)}',
      '.rt-prev-h:active{cursor:grabbing}',
      '.rt-prev-h b{flex:1;font-size:12px;color:var(--rt-gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.rt-ib{width:28px;height:28px;border-radius:8px;border:1px solid rgba(148,163,184,.45);background:transparent;color:inherit;cursor:pointer;font-size:12px}',
      '.rt-ib:hover{border-color:#f59e0b}',
      '.rt-prev-b{padding:12px;overflow:auto;font-size:15px}',
      '.rt-prev-f{padding:6px 12px 10px;font-size:11px;opacity:.75;border-top:1px dashed rgba(148,163,184,.3)}',
      '.rt-empty{opacity:.55;font-size:12px;text-align:center;padding:14px 0}',
      '.rt-prev.rt-collapsed .rt-prev-b,.rt-prev.rt-collapsed .rt-prev-f{display:none}'
    ].join('');
    document.head.appendChild(s);
  })();

  function Ops(ta, after) {
    function sel() {
      var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
      while (s < e && /\s/.test(v.charAt(s))) s++;
      while (e > s && /\s/.test(v.charAt(e - 1))) e--;
      return { s: s, e: e, v: v };
    }
    function done(s, e) { ta.focus(); ta.setSelectionRange(s, e); after(); }

    function wrap(open, close) {
      var x = sel(), s = x.s, e = x.e, v = x.v, t = v.slice(s, e);
      if (s >= open.length && v.slice(s - open.length, s) === open && v.slice(e, e + close.length) === close) {
        ta.setRangeText(t, s - open.length, e + close.length, 'preserve');
        return done(s - open.length, s - open.length + t.length);
      }
      if (t.length >= open.length + close.length && t.indexOf(open) === 0 && t.slice(-close.length) === close) {
        var inner = t.slice(open.length, t.length - close.length);
        ta.setRangeText(inner, s, e, 'preserve');
        return done(s, s + inner.length);
      }
      if (s === e) { ta.setRangeText(open + close, s, e, 'preserve'); return done(s + open.length, s + open.length); }
      ta.setRangeText(open + t + close, s, e, 'preserve');
      done(s + open.length, s + open.length + t.length);
    }

    function color(tok) {
      var x = sel(), s = x.s, e = x.e, v = x.v, t = v.slice(s, e);
      var before = /\{\{(gold|green|red|blue|purple|orange|gray):$/.exec(v.slice(0, s));
      if (before && v.slice(e, e + 2) === '}}') {
        var os = s - before[0].length;
        if (before[1] === tok) { ta.setRangeText(t, os, e + 2, 'preserve'); return done(os, os + t.length); }
        var open = '{{' + tok + ':';
        ta.setRangeText(open + t + '}}', os, e + 2, 'preserve');
        return done(os + open.length, os + open.length + t.length);
      }
      if (s === e) { var o2 = '{{' + tok + ':'; ta.setRangeText(o2 + '}}', s, e, 'preserve'); return done(s + o2.length, s + o2.length); }
      var o = '{{' + tok + ':';
      ta.setRangeText(o + t + '}}', s, e, 'preserve');
      done(s + o.length, s + o.length + t.length);
    }

    function clear() {
      var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
      if (s === e) {
        if (!confirm('تمسح كل التنسيق من النص كله؟ (الألوان والبولد والـ Hyperlinked)')) return;
        ta.value = R.strip(v); return done(0, 0);
      }
      var t = R.strip(v.slice(s, e));
      ta.setRangeText(t, s, e, 'preserve'); done(s, s + t.length);
    }
    return { wrap: wrap, color: color, clear: clear };
  }

  function Preview(ov, ta, label, keyName) {
    var el = document.createElement('div');
    var theme = lastTheme || (document.body.classList.contains('light-theme') ? 'light' : 'dark');
    el.className = 'rt-prev rt-' + theme;
    el.innerHTML =
      '<div class="rt-prev-h" data-h>' +
        '<i class="fa-solid fa-grip-lines" style="opacity:.6"></i>' +
        '<b>معاينة · ' + R.esc(keyName || label) + ' · زي ما الطالب هيشوفها</b>' +
        '<button type="button" class="rt-ib" data-p="left" title="يسار"><i class="fa-solid fa-arrow-left"></i></button>' +
        '<button type="button" class="rt-ib" data-p="right" title="يمين"><i class="fa-solid fa-arrow-right"></i></button>' +
        '<button type="button" class="rt-ib" data-p="theme" title="جرّب الثيم التاني"><i class="fa-solid fa-circle-half-stroke"></i></button>' +
        '<button type="button" class="rt-ib" data-p="fold" title="طي / فتح"><i class="fa-solid fa-chevron-down"></i></button>' +
      '</div>' +
      '<div class="rt-prev-b" dir="auto"></div><div class="rt-prev-f"></div>';
    ov.appendChild(el);
    var body = el.querySelector('.rt-prev-b'), foot = el.querySelector('.rt-prev-f'), head = el.querySelector('[data-h]');

    function place() {
      var vw = window.innerWidth, vh = window.innerHeight, w = el.offsetWidth || 380;
      if (lastPos) { el.style.left = Math.min(Math.max(8, lastPos.x), Math.max(8, vw - w - 8)) + 'px'; el.style.top = Math.min(Math.max(8, lastPos.y), Math.max(8, vh - 80)) + 'px'; el.style.right = el.style.bottom = 'auto'; return; }
      if (vw >= 900) { el.style.right = '16px'; el.style.top = '84px'; el.style.left = el.style.bottom = 'auto'; }
      else { el.style.left = '8px'; el.style.right = '8px'; el.style.width = 'auto'; el.style.bottom = '8px'; el.style.top = 'auto'; el.style.maxHeight = '38vh'; }
    }
    function snap(side) {
      var top = el.getBoundingClientRect().top;
      el.style.width = ''; el.style.maxHeight = ''; el.style.bottom = 'auto'; el.style.top = Math.max(8, top) + 'px';
      if (side === 'left') { el.style.left = '12px'; el.style.right = 'auto'; } else { el.style.right = '12px'; el.style.left = 'auto'; }
      lastPos = { x: el.getBoundingClientRect().left, y: Math.max(8, top) };
    }
    function update() {
      var t = ta.value;
      body.innerHTML = t.trim() ? R.render(t) : '<div class="rt-empty">اكتب في الخانة اللي فوق وهتظهر النتيجة هنا</div>';
      var w = R.links(t);
      foot.innerHTML = w.length ? 'كلمات Hyperlinked (' + w.length + '): <span class="rt-link">' + w.map(R.esc).join('</span> · <span class="rt-link">') + '</span>' : 'مفيش كلمات Hyperlinked';
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-p]'); if (!b) return;
      var p = b.dataset.p;
      if (p === 'left' || p === 'right') snap(p);
      else if (p === 'theme') { theme = theme === 'dark' ? 'light' : 'dark'; lastTheme = theme; el.classList.remove('rt-dark', 'rt-light'); el.classList.add('rt-' + theme); }
      else if (p === 'fold') el.classList.toggle('rt-collapsed');
    });
    var drag = null;
    head.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      var r = el.getBoundingClientRect(); drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      head.setPointerCapture(e.pointerId); e.preventDefault();
    });
    head.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var x = Math.min(Math.max(4, e.clientX - drag.dx), window.innerWidth - 60), y = Math.min(Math.max(4, e.clientY - drag.dy), window.innerHeight - 44);
      el.style.width = ''; el.style.maxHeight = ''; el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.right = el.style.bottom = 'auto';
      lastPos = { x: x, y: y };
    });
    var end = function () { drag = null; };
    head.addEventListener('pointerup', end); head.addEventListener('pointercancel', end);
    function onResize() { if (!ov.isConnected) return window.removeEventListener('resize', onResize); if (lastPos) place(); }
    window.addEventListener('resize', onResize);

    place(); update();
    return { update: update, el: el, toggle: function () { el.style.display = el.style.display === 'none' ? '' : 'none'; } };
  }

  /* ---------- toolbar (shared by popups and inline fields) ---------- */
  function makeBar(ops, onToggle) {
    var bar = document.createElement('div');
    bar.className = 'rt-bar'; bar.setAttribute('dir', 'ltr');
    bar.innerHTML =
      '<button type="button" class="rt-tb" data-a="b" title="Bold (Ctrl+B)"><i class="fa-solid fa-bold"></i></button>' +
      '<button type="button" class="rt-tb" data-a="i" title="Italic (Ctrl+I)"><i class="fa-solid fa-italic"></i></button>' +
      '<button type="button" class="rt-tb" data-a="u" title="Underline (Ctrl+U)"><i class="fa-solid fa-underline"></i></button>' +
      '<span class="rt-sep2"></span>' +
      COLORS.map(function (c) { return '<button type="button" class="rt-sw" data-c="' + c[0] + '" title="' + c[1] + '" style="background:var(--rt-' + c[0] + ',' + ({gold:'#fbbf24',green:'#34d399',red:'#f43f5e',blue:'#60a5fa',purple:'#a78bfa',orange:'#fb923c',gray:'#94a3b8'})[c[0]] + ')"></button>'; }).join('') +
      '<span class="rt-sep2"></span>' +
      '<button type="button" class="rt-tb rt-link-btn" data-a="k" title="Hyperlinked (Ctrl+K): الكلمة هتتنطق للطالب لما يدوس عليها"><i class="fa-solid fa-link"></i> Hyperlinked</button>' +
      '<button type="button" class="rt-tb" data-a="x" title="مسح التنسيق"><i class="fa-solid fa-eraser"></i></button>' +
      (onToggle ? '<span style="flex:1"></span><button type="button" class="rt-tb on" data-a="v" title="إظهار / إخفاء المعاينة"><i class="fa-solid fa-eye"></i></button>' : '');
    bar.addEventListener('mousedown', function (e) { e.preventDefault(); });
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.c) return ops.color(b.dataset.c);
      switch (b.dataset.a) {
        case 'b': ops.wrap('**', '**'); break;
        case 'i': ops.wrap('__', '__'); break;
        case 'u': ops.wrap('++', '++'); break;
        case 'k': ops.wrap('[[', ']]'); break;
        case 'x': ops.clear(); break;
        case 'v': if (onToggle) { onToggle(); b.classList.toggle('on'); } break;
      }
    });
    return bar;
  }
  function shortcuts(el, ops) {
    el.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
      var k = e.key.toLowerCase(), map = { b: ['**', '**'], i: ['__', '__'], u: ['++', '++'], k: ['[[', ']]'] };
      if (!map[k]) return;
      e.preventDefault(); ops.wrap(map[k][0], map[k][1]);
    });
  }

  /* ---------- every long-text popup (QOL, TFL, Notes, profile fields, messages, task text...) ---------- */
  function enhancePopup(ov) {
    var ta = ov.querySelector('textarea.ds-ta'); if (!ta) return;
    var lb = ov.querySelector('.ds-box b'), label = lb ? lb.textContent : '';
    var pv = Preview(ov, ta, label, label), ops = Ops(ta, function () { pv.update(); });
    ta.addEventListener('input', function () { pv.update(); });
    ta.parentNode.insertBefore(makeBar(ops, pv.toggle), ta);
    shortcuts(ta, ops);
  }

  /* ---------- short single fields (task title / badge / description, notification title...) ---------- */
  var INLINE = '#ntTitle,#tkTitle,#tkBadge,#moTitle,#dsi_title,#dsi_badge,#dsi_body';
  function enhanceInline(el) {
    el.setAttribute('data-rt', '1');
    var box = document.createElement('div');
    box.className = 'rt-inl'; box.style.cssText = 'display:none;margin-top:6px;padding:8px 10px;border:1px dashed #475569;border-radius:10px;font-size:13px';
    var upd = function () { var v = el.value; box.style.display = v.trim() ? '' : 'none'; box.innerHTML = v.trim() ? R.render(v) : ''; };
    var ops = Ops(el, upd);
    var bar = makeBar(ops, null); bar.style.marginBottom = '6px';
    el.parentNode.insertBefore(bar, el);
    el.parentNode.insertBefore(box, el.nextSibling);
    el.addEventListener('input', upd); shortcuts(el, ops); upd();
  }

  var queued = false;
  function scan() {
    queued = false;
    document.querySelectorAll('.ds-ov:not([data-rt])').forEach(function (ov) {
      if (ov.querySelector('textarea.ds-ta')) { ov.setAttribute('data-rt', '1'); enhancePopup(ov); }
    });
    document.querySelectorAll(INLINE).forEach(function (el) { if (!el.hasAttribute('data-rt') && el.parentNode) enhanceInline(el); });
  }
  new MutationObserver(function () { if (!queued) { queued = true; requestAnimationFrame(scan); } })
    .observe(document.body, { childList: true, subtree: true });
  scan();

  /* one-line summary on the form shows clean text, without the markers */
  var origRefresh = window.dsRefreshPf;
  if (typeof origRefresh === 'function') {
    window.dsRefreshPf = function (id) {
      origRefresh.apply(this, arguments);
      var pf = document.getElementById(id + '_pf');
      if (pf && !pf.classList.contains('empty')) pf.textContent = R.strip(pf.textContent);
    };
  }

  /* the small preview under the notification composer renders the real formatting now */
  window.ntPreview = function () {
    var b = document.getElementById('ntBody'), p = document.getElementById('ntPrev'); if (!b || !p) return;
    var v = b.value.trim(); p.style.display = v ? '' : 'none'; p.innerHTML = v ? R.render(v) : '';
  };
})();
