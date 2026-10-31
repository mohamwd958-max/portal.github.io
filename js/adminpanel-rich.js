/* ==========================================================
   Admin rich-text editor (loads AFTER adminpanel.js and richtext.js).
   It wraps the existing dsTextPop popup, so the capsule / numbering / divider
   tools keep working, and adds on QOL, TFL and Notes:
     - a formatting toolbar (bold, italic, underline, theme-safe colors,
       Hyperlinked, clear formatting) + Ctrl/Cmd + B / I / U / K
     - a floating live preview you can drag, snap left/right, collapse,
       and flip between dark/light to check the colors in both themes
   The stored value stays plain text with small markers (see richtext.js).
   ========================================================== */
(function () {
  'use strict';
  if (!window.ThabitRich || typeof window.dsTextPop !== 'function') {
    var why = !window.ThabitRich ? 'js/richtext.js مش محمّل' : 'js/adminpanel.js لسه ما عرّفش dsTextPop (ترتيب السكريبتات)';
    console.error('[adminpanel-rich] NOT ACTIVE: ' + why);
    try { if (typeof showToast === 'function') showToast('محرر التنسيق مش شغال: ' + why, true, true); } catch (e) {}
    return;
  }
  console.info('[adminpanel-rich] v2026-10-31b active');
  var R = window.ThabitRich;
  var RICH_FIELD = /./;                                   // EVERY text field that opens the writing popup
  var NAME_RE = /^ds_(qol|tefl|notes)_\d+$/;
  var NAMES = { qol: 'QOL', tefl: 'TFL', notes: 'Notes' };
  var COLORS = [['gold', 'ذهبي'], ['green', 'أخضر'], ['red', 'أحمر'], ['purple', 'بنفسجي'], ['orange', 'برتقالي'], ['gray', 'رمادي']];
  var lastPos = null;            // the preview remembers where you left it
  var lastTheme = null;          // and which theme you last checked
  var lastW = '';                // and the width it had (side snaps are narrower)

  /* ---------- styles ---------- */
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
      '.rt-prev{position:fixed;z-index:2147483100;width:min(720px,calc(100vw - 24px));max-height:38vh;display:flex;flex-direction:column;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6);border:1px solid rgba(245,158,11,.55);font-family:Cairo,Inter,sans-serif}',
      '.rt-prev.rt-dark{background:#0b1220;color:#f1f5f9}.rt-prev.rt-light{background:#ffffff;color:#0f172a}',
      '.rt-prev-h{display:flex;align-items:center;gap:6px;padding:8px 10px;cursor:grab;touch-action:none;user-select:none;background:rgba(245,158,11,.14);border-bottom:1px solid rgba(148,163,184,.3)}',
      '.rt-prev-h:active{cursor:grabbing}',
      '.rt-prev-h b{flex:1;font-size:12px;color:var(--rt-gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.rt-ib{width:28px;height:28px;border-radius:8px;border:1px solid rgba(148,163,184,.45);background:transparent;color:inherit;cursor:pointer;font-size:12px}',
      '.rt-ib:hover{border-color:#f59e0b}',
      '.rt-prev-b{padding:12px;overflow:auto;font-size:15px;min-height:0;flex:1}',
      '.rt-prev .rich>.rcap{margin:0 0 8px}',
      '.rt-prev .rcap>.rp,.rt-prev .rcap>.rl{margin:0;padding:8px 12px;border-radius:12px;background:rgba(148,163,184,.1)}',
      '.rt-prev .rcap>.rl{padding-inline-start:30px}',
      '.rt-prev .vb{display:inline-block;width:1.5px;height:1em;margin:0 .65em;vertical-align:-.15em;background:currentColor;opacity:.22;border-radius:1px}',
      '.rt-prev .cpb{display:inline-flex;align-items:center;gap:5px;margin:2px 0 0;padding:3px 4px;color:#fbbf24;font:700 .75rem/1.2 Inter,Cairo,sans-serif}',
      '.rt-prev.rt-light .cpb{color:#b45309}',
      '.rt-prev-f{padding:6px 12px 10px;font-size:11px;opacity:.75;border-top:1px dashed rgba(148,163,184,.3)}',
      '.rt-empty{opacity:.55;font-size:12px;text-align:center;padding:14px 0}',
      '.rt-prev.rt-collapsed .rt-prev-b,.rt-prev.rt-collapsed .rt-prev-f{display:none}',
      '.rt-prev .rt-link{color:#7dd3fc!important;text-decoration:none!important;border:0!important;box-shadow:none!important;cursor:pointer}',
      '.rt-prev.rt-light .rt-link{color:#0369a1!important}',
      '.rt-bub{position:fixed;z-index:2147483200;display:none;align-items:center;gap:4px;padding:4px;border-radius:12px;background:#0f172a;border:1px solid rgba(245,158,11,.65);box-shadow:0 10px 30px rgba(0,0,0,.55);font-family:Cairo,Inter,sans-serif;user-select:none;-webkit-user-select:none;touch-action:none}',
      '.rt-bub.show{display:flex}',
      '.rt-bub button{height:32px;min-width:32px;padding:0 9px;border-radius:9px;border:1px solid #475569;background:transparent;color:#e2e8f0;font:700 12px Cairo,Inter,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}',
      '.rt-bub button:hover{border-color:#fbbf24;background:rgba(251,191,36,.12)}',
      '.rt-bub button.rt-bk{color:#7dd3fc;border-color:rgba(125,211,252,.55)}'
    ].join('');
    document.head.appendChild(s);
  })();

  /* ---------- text operations on the textarea ---------- */
  function Ops(ta, after) {
    function sel() {
      var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
      while (s < e && /\s/.test(v.charAt(s))) s++;          // never wrap the spaces around a word
      while (e > s && /\s/.test(v.charAt(e - 1))) e--;
      return { s: s, e: e, v: v };
    }
    function done(s, e) { ta.focus(); ta.setSelectionRange(s, e); after(); }

    function wrap(open, close) {
      var x = sel(), s = x.s, e = x.e, v = x.v, t = v.slice(s, e);
      if (s >= open.length && v.slice(s - open.length, s) === open && v.slice(e, e + close.length) === close) {      // markers just outside -> remove
        ta.setRangeText(t, s - open.length, e + close.length, 'preserve');
        return done(s - open.length, s - open.length + t.length);
      }
      if (t.length >= open.length + close.length && t.indexOf(open) === 0 && t.slice(-close.length) === close) {      // markers inside the selection -> remove
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
      if (before && v.slice(e, e + 2) === '}}') {                          // already colored from outside
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
    function link() {
      var x = sel(), t = x.v.slice(x.s, x.e);
      if (t.indexOf('\n') === -1) return wrap('[[', ']]');
      var lines = t.split('\n'), allOn = true, any = false;
      lines.forEach(function (ln) { var c = ln.trim(); if (!c) return; any = true; if (!(c.indexOf('[[') === 0 && c.slice(-2) === ']]')) allOn = false; });
      if (!any) return;
      var out = lines.map(function (ln) {
        var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(ln); if (!m[2]) return ln;
        var core = allOn ? m[2].slice(2, -2) : '[[' + m[2].replace(/\[\[|\]\]/g, '') + ']]';
        return m[1] + core + m[3];
      }).join('\n');
      ta.setRangeText(out, x.s, x.e, 'preserve'); done(x.s, x.s + out.length);
    }
    return { wrap: wrap, color: color, clear: clear, link: link };
  }

  /* ---------- floating preview: same renderer as the student dashboard (capsules, numbering, dividers, copy button) ---------- */
  var D_NUM = /^\s*(\d+|[a-zA-Z])[.)]\s+/, D_BUL = /^\s*[-•*]\s+/;
  var D_COPY = '<span class="cpb"><i class="fa-regular fa-copy"></i><span>نسخ</span></span>';
  function dEscv(x) {                                                   // markers first, then "|" -> thin divider (never inside a tag)
    return R.inline(R.esc(x)).replace(/(<[^>]+>)|\s*\|\s*/g, function (m, tag) { return tag ? tag : '<i class="vb"></i>'; });
  }
  function dBlock(blk) {
    var ls = blk.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).filter(function (l) { return l.trim(); });
    if (!ls.length) return '';
    if (ls.every(function (l) { return D_NUM.test(l); }))
      return '<ol class="rl" dir="auto"' + (/^\s*[a-zA-Z][.)]/.test(ls[0]) ? ' type="a"' : '') + '>' + ls.map(function (l) { return '<li>' + dEscv(l.replace(D_NUM, '')) + '</li>'; }).join('') + '</ol>';
    if (ls.every(function (l) { return D_BUL.test(l); }))
      return '<ul class="rl" dir="auto">' + ls.map(function (l) { return '<li>' + dEscv(l.replace(D_BUL, '')) + '</li>'; }).join('') + '</ul>';
    return '<p class="rp" dir="auto">' + ls.map(dEscv).join('<br>') + '</p>';
  }
  function dashRender(txt) {
    return '<div class="rich">' + String(txt || '').trim().split(/\n\s*\n/).filter(function (x) { return x.trim(); })
      .map(function (x) { return '<div class="rcap">' + dBlock(x) + D_COPY + '</div>'; }).join('') + '</div>';
  }

  function Preview(ov, ta, label, keyName) {
    var el = document.createElement('div');
    var theme = lastTheme || (document.body.classList.contains('light-theme') ? 'light' : 'dark');
    el.className = 'rt-prev rt-' + theme;
    if (lastW) el.style.width = lastW;
    el.innerHTML =
      '<div class="rt-prev-h" data-h>' +
        '<i class="fa-solid fa-grip-lines" style="opacity:.6"></i>' +
        '<b>معاينة مباشرة · ' + R.esc(keyName || label) + ' · زي ما الطالب هيشوفها</b>' +
        '<button type="button" class="rt-ib" data-p="left" title="يسار"><i class="fa-solid fa-arrow-left"></i></button>' +
        '<button type="button" class="rt-ib" data-p="bottom" title="تحت في النص"><i class="fa-solid fa-arrow-down"></i></button>' +
        '<button type="button" class="rt-ib" data-p="right" title="يمين"><i class="fa-solid fa-arrow-right"></i></button>' +
        '<button type="button" class="rt-ib" data-p="theme" title="جرّب الثيم التاني"><i class="fa-solid fa-circle-half-stroke"></i></button>' +
        '<button type="button" class="rt-ib" data-p="fold" title="طي / فتح"><i class="fa-solid fa-chevron-down"></i></button>' +
      '</div>' +
      '<div class="rt-prev-b" dir="auto"></div><div class="rt-prev-f"></div>';
    ov.appendChild(el);
    var body = el.querySelector('.rt-prev-b'), foot = el.querySelector('.rt-prev-f'), head = el.querySelector('[data-h]');

    function place() {                                                  // default: docked at the bottom, centred
      var vw = window.innerWidth, vh = window.innerHeight, w = el.offsetWidth || 380;
      if (lastPos) {
        el.style.left = Math.min(Math.max(8, lastPos.x), Math.max(8, vw - w - 8)) + 'px';
        el.style.top = Math.min(Math.max(8, lastPos.y), Math.max(8, vh - 80)) + 'px';
        el.style.right = el.style.bottom = 'auto'; return;
      }
      el.style.left = Math.max(8, (vw - w) / 2) + 'px'; el.style.right = 'auto'; el.style.top = 'auto'; el.style.bottom = '12px';
    }
    function snap(side) {
      var top = Math.min(Math.max(8, el.getBoundingClientRect().top), Math.max(8, window.innerHeight - 80));
      lastW = el.style.width = 'min(380px,calc(100vw - 24px))';
      el.style.bottom = 'auto'; el.style.top = top + 'px';
      if (side === 'left') { el.style.left = '12px'; el.style.right = 'auto'; } else { el.style.right = '12px'; el.style.left = 'auto'; }
      lastPos = { x: el.getBoundingClientRect().left, y: top };
    }
    var shown = null;
    function update() {
      var t = ta.value; shown = t;
      body.innerHTML = t.trim() ? dashRender(t) : '<div class="rt-empty">اكتب في الخانة اللي فوق وهتظهر النتيجة هنا</div>';
      var w = R.links(t);
      foot.innerHTML = w.length ? 'كلمات Hyperlinked (' + w.length + '): <span class="rt-link">' + w.map(R.esc).join('</span> · <span class="rt-link">') + '</span>' : 'مفيش كلمات Hyperlinked';
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-p]'); if (!b) return;
      var p = b.dataset.p;
      if (p === 'left' || p === 'right') snap(p);
      else if (p === 'bottom') { lastPos = null; lastW = ''; el.style.width = ''; place(); }
      else if (p === 'theme') { theme = theme === 'dark' ? 'light' : 'dark'; lastTheme = theme; el.classList.remove('rt-dark', 'rt-light'); el.classList.add('rt-' + theme); }
      else if (p === 'fold') el.classList.toggle('rt-collapsed');
    });
    /* dragging by the header */
    var drag = null;
    head.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      var r = el.getBoundingClientRect(); drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      head.setPointerCapture(e.pointerId); e.preventDefault();
    });
    head.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var x = Math.min(Math.max(4, e.clientX - drag.dx), window.innerWidth - 60), y = Math.min(Math.max(4, e.clientY - drag.dy), window.innerHeight - 44);
      el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.right = el.style.bottom = 'auto';
      lastPos = { x: x, y: y };
    });
    var end = function () { drag = null; };
    head.addEventListener('pointerup', end); head.addEventListener('pointercancel', end);
    function onResize() { if (!ov.isConnected) return window.removeEventListener('resize', onResize); place(); }
    window.addEventListener('resize', onResize);
    /* real time: every keystroke, plus a light check for changes the popup makes by itself (auto numbering, paste, ...) */
    var iv = setInterval(function () { if (!ov.isConnected) return clearInterval(iv); if (ta.value !== shown) update(); }, 200);

    place(); update();
    return { update: update, el: el, toggle: function () { el.style.display = el.style.display === 'none' ? '' : 'none'; } };
  }

  /* ---------- floating bubble: appears right above the selected text ---------- */
  function caretXY(ta, pos) {                       // where a character index sits on screen (mirror-div trick)
    var cs = getComputedStyle(ta), d = document.createElement('div'), st = d.style;
    ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'wordSpacing', 'textIndent', 'textTransform', 'lineHeight', 'tabSize',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'textAlign'].forEach(function (k) { st[k] = cs[k]; });
    st.boxSizing = 'border-box'; st.position = 'absolute'; st.visibility = 'hidden'; st.left = '-9999px'; st.top = '0';
    st.whiteSpace = 'pre-wrap'; st.wordWrap = 'break-word'; st.overflow = 'hidden';
    st.width = (ta.clientWidth + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)) + 'px';
    d.setAttribute('dir', cs.direction);
    d.textContent = ta.value.slice(0, pos);
    var m = document.createElement('span'); m.textContent = '\u200b'; d.appendChild(m);
    document.body.appendChild(d);
    var r = ta.getBoundingClientRect(), fs = parseFloat(cs.fontSize) || 16, lh = parseFloat(cs.lineHeight) || fs * 1.4;
    var out = { x: r.left + parseFloat(cs.borderLeftWidth) + m.offsetLeft - ta.scrollLeft, y: r.top + parseFloat(cs.borderTopWidth) + m.offsetTop - ta.scrollTop, h: lh };
    d.remove(); return out;
  }
  function Bubble(ov, ta, act) {
    var el = document.createElement('div'); el.className = 'rt-bub'; el.setAttribute('dir', 'ltr');
    el.innerHTML =
      '<button type="button" class="rt-bk" data-a="k" title="Hyperlinked (Ctrl+K)"><i class="fa-solid fa-link"></i> Hyperlinked</button>' +
      '<button type="button" data-a="b" title="Bold (Ctrl+B)"><i class="fa-solid fa-bold"></i></button>' +
      '<button type="button" data-a="i" title="Italic (Ctrl+I)"><i class="fa-solid fa-italic"></i></button>';
    ov.appendChild(el);
    var raf = 0;
    function hide() { el.classList.remove('show'); }
    function hasSel() { var s = ta.selectionStart, e = ta.selectionEnd; return s !== e && ta.value.slice(s, e).trim().length > 0 && document.activeElement === ta; }
    function place() {
      if (!ov.isConnected) return;
      if (!hasSel()) return hide();
      var A = caretXY(ta, ta.selectionStart), B = caretXY(ta, ta.selectionEnd), tr = ta.getBoundingClientRect();
      if (A.y + A.h < tr.top || A.y > tr.bottom) return hide();                         // selection scrolled out of the box
      el.classList.add('show');
      var w = el.offsetWidth, h = el.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
      var same = Math.abs(A.y - B.y) < A.h / 2, x = same ? (A.x + B.x) / 2 : A.x;
      var coarse = window.matchMedia && matchMedia('(pointer:coarse)').matches;           // on phones the system menu sits above the text, so go below
      var top = coarse ? B.y + B.h + 10 : A.y - h - 8;
      if (top < 6) top = B.y + B.h + 8;
      if (top + h > vh - 6) top = Math.max(6, A.y - h - 8);
      el.style.left = Math.min(Math.max(6, x - w / 2), Math.max(6, vw - w - 6)) + 'px';
      el.style.top = top + 'px';
    }
    function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); }
    ['select', 'mouseup', 'keyup', 'touchend', 'input', 'focus', 'scroll'].forEach(function (ev) { ta.addEventListener(ev, schedule); });
    ta.addEventListener('blur', function () { setTimeout(function () { if (document.activeElement !== ta) hide(); }, 150); });
    function onSel() { if (!ov.isConnected) return document.removeEventListener('selectionchange', onSel); if (document.activeElement === ta) schedule(); }
    document.addEventListener('selectionchange', onSel);
    function onResize() { if (!ov.isConnected) return window.removeEventListener('resize', onResize); schedule(); }
    window.addEventListener('resize', onResize);
    /* run on pointerdown + keep the focus in the textarea, so the selection is never lost */
    el.addEventListener('pointerdown', function (e) { var b = e.target.closest('button'); e.preventDefault(); if (b) act(b.dataset.a); });
    el.addEventListener('mousedown', function (e) { e.preventDefault(); });
    el.addEventListener('click', function (e) { e.preventDefault(); });
    return { schedule: schedule, hide: hide, el: el };
  }

  /* ---------- wrap the existing popup ---------- */
  var original = window.dsTextPop;
  window.dsTextPop = function (hiddenId, label) {
    original.apply(this, arguments);
    if (!RICH_FIELD.test(hiddenId)) return;
    var ov = document.body.lastElementChild;
    if (!ov || !ov.classList.contains('ds-ov')) return;
    var ta = ov.querySelector('textarea.ds-ta'); if (!ta) return;
    var keyName = NAMES[(NAME_RE.exec(hiddenId) || [])[1]] || label;

    var bub, pv = Preview(ov, ta, label, keyName), ops = Ops(ta, function () { pv.update(); if (bub) bub.schedule(); });
    function doAct(a) { if (a === 'k') ops.link(); else if (a === 'b') ops.wrap('**', '**'); else if (a === 'i') ops.wrap('__', '__'); }
    bub = Bubble(ov, ta, doAct);
    ta.addEventListener('input', function () { pv.update(); });

    var bar = document.createElement('div');
    bar.className = 'rt-bar'; bar.setAttribute('dir', 'ltr');
    bar.innerHTML =
      '<button type="button" class="rt-tb" data-a="b" title="Bold (Ctrl+B)"><i class="fa-solid fa-bold"></i></button>' +
      '<button type="button" class="rt-tb" data-a="i" title="Italic (Ctrl+I)"><i class="fa-solid fa-italic"></i></button>' +
      '<button type="button" class="rt-tb" data-a="u" title="Underline (Ctrl+U)"><i class="fa-solid fa-underline"></i></button>' +
      '<span class="rt-sep2"></span>' +
      COLORS.map(function (c) { return '<button type="button" class="rt-sw" data-c="' + c[0] + '" title="' + c[1] + '" style="background:var(--rt-' + c[0] + ')"></button>'; }).join('') +
      '<span class="rt-sep2"></span>' +
      '<button type="button" class="rt-tb rt-link-btn" data-a="k" title="Hyperlinked (Ctrl+K): الكلمة هتتنطق للطالب لما يدوس عليها"><i class="fa-solid fa-link"></i> Hyperlinked</button>' +
      '<button type="button" class="rt-tb" data-a="x" title="مسح التنسيق"><i class="fa-solid fa-eraser"></i></button>' +
      '<span style="flex:1"></span>' +
      '<button type="button" class="rt-tb on" data-a="v" title="إظهار / إخفاء المعاينة"><i class="fa-solid fa-eye"></i></button>';
    ta.parentNode.insertBefore(bar, ta);

    bar.addEventListener('mousedown', function (e) { e.preventDefault(); });           // keep the selection in the textarea
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.c) return ops.color(b.dataset.c);
      switch (b.dataset.a) {
        case 'b': ops.wrap('**', '**'); break;
        case 'i': ops.wrap('__', '__'); break;
        case 'u': ops.wrap('++', '++'); break;
        case 'k': ops.link(); break;
        case 'x': ops.clear(); break;
        case 'v': pv.toggle(); b.classList.toggle('on'); break;
      }
    });
    ta.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
      var k = e.key.toLowerCase(), map = { b: ['**', '**'], i: ['__', '__'], u: ['++', '++'], k: 1 };
      if (!map[k]) return;
      e.preventDefault(); if (k === 'k') ops.link(); else ops.wrap(map[k][0], map[k][1]);
    });
  };

  /* the small one-line summary on the form shows clean text, without the markers */
  var origRefresh = window.dsRefreshPf;
  if (typeof origRefresh === 'function') {
    window.dsRefreshPf = function (id) {
      origRefresh.apply(this, arguments);
      if (!RICH_FIELD.test(id)) return;
      var pf = document.getElementById(id + '_pf');
      if (pf && !pf.classList.contains('empty')) pf.textContent = R.strip(pf.textContent);
    };
  }
})();
