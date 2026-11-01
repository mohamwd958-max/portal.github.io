/* ==========================================================
   Smart Widget (load AFTER dashboard.js and dashboard-voice-lit.js)
   STEP 1: new look.
     - floating sheet with space on left / right / bottom (like the notes pop-up)
     - header: word + Arabic translation + copy button
     - left column (top -> bottom): COMPARE, RECORD, PLAY (bottom corner)
     - right: YOU track (top), small play-yours button beside RECORD, ORIGINAL track (bottom)
     - last row: download + speed buttons (look only for now, they work in step 4)
   Working now: play original once / stop, record (3-2-1 shield + tones), compare (original then yours), play yours.
   Coming next: long-press counts 2/3/5 (step 2), trimming (step 3), download + speed (step 4).
   ========================================================== */
(function () {
  'use strict';
  var T = {
    en: { orig: 'Original', you: 'You', missing: 'No recording for this word yet', fail: 'Could not load the recording',
          nomic: 'Microphone is blocked. Allow it in the browser settings.', prep: 'Wait a moment…', wait: 'Wait a moment…', go: 'Record now',
          stop: 'Stop', cancel: 'Cancel', silent: 'Nothing was recorded, try again', nowait: 'Record yourself first', copied: 'Copied' },
    ar: { orig: 'الأصلي', you: 'أنت', missing: 'لا يوجد تسجيل لهذه الكلمة بعد', fail: 'تعذر تحميل التسجيل',
          nomic: 'الميكروفون محظور. اسمح به من إعدادات المتصفح.', prep: 'انتظر قليلاً…', wait: 'انتظر قليلاً…', go: 'سجّل الآن',
          stop: 'إيقاف', cancel: 'إلغاء', silent: 'لم يُسجَّل أي صوت، حاول مرة أخرى', nowait: 'سجّل صوتك أولاً', copied: 'تم النسخ' },
    eg: { orig: 'الأصلي', you: 'إنت', missing: 'الكلمة دي لسه مفيهاش صوت', fail: 'مقدرتش أحمّل الصوت',
          nomic: 'المايك مقفول. افتحه من إعدادات المتصفح.', prep: 'استنى شوية…', wait: 'استنى شوية…', go: 'سجّل دلوقتي',
          stop: 'وقّف', cancel: 'إلغاء', silent: 'مفيش صوت اتسجل، جرب تاني', nowait: 'سجّل صوتك الأول', copied: 'اتنسخ' }
  };
  var L = function () { var l = 'en'; try { l = lang; } catch (e) {} return T[l] || T.en; };
  var H = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var tf = function (s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  var AC = window.AudioContext || window.webkitAudioContext;

  var S = {
    word: '', key: '', urls: null, tk: 0, ld: 0, audio: null, rec: null, recs: {}, recording: false, abort: false,
    mode: '', act: 0, aw: '', off: 0,
    peaks: { o: null, y: null }, prog: { o: 0, y: 0 }, total: 0, yDur: 0, ar: ''
  };
  var el = null;

  /* ---------- styles ---------- */
  (function () {
    var s = document.createElement('style'); s.id = 'swCss';
    s.textContent = `
*{-webkit-tap-highlight-color:transparent}
.vx,.aww,.rt-link,.cap,.itm,.itc,.hnd,.pc,.cpb,button{-webkit-touch-callout:none;touch-action:manipulation}
.vx,.aww,.rt-link{-webkit-user-select:none;user-select:none;outline:none}
button:focus:not(:focus-visible),[role=button]:focus:not(:focus-visible){outline:none}
.sw{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(calc(100vw - 28px),420px);z-index:100000;box-sizing:border-box;padding:12px;border-radius:24px;background:rgba(15,23,42,.985);color:#e2e8f0;border:1px solid rgba(148,163,184,.3);box-shadow:0 14px 44px rgba(0,0,0,.55);font-family:inherit;animation:swUp .22s ease-out;overflow:hidden}
body.light-theme .sw{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}
@keyframes swUp{from{transform:translate(-50%,40px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
.sw button{font:inherit;border:0;cursor:pointer;color:inherit}
.sw-x{position:absolute;top:8px;inset-inline-end:8px;z-index:3;width:30px;height:30px;border-radius:50%;background:rgba(148,163,184,.22);font-size:1.15rem;line-height:1;padding:0}
.sw-hd{margin-bottom:12px;padding:16px 40px 12px;border-radius:18px;background:rgba(148,163,184,.1);text-align:center}
body.light-theme .sw-hd{background:rgba(15,23,42,.06)}
.sw-w{display:block;width:100%;padding:2px 0;background:none;font-size:1.3rem;font-weight:800;text-align:center;overflow-wrap:anywhere}
.sw-ar{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:6px;font-size:1.05rem;font-weight:700;opacity:.9}
.sw-ar[hidden]{display:none}
.sw-cp{flex:none;width:28px;height:28px;border-radius:8px;background:transparent;color:#fbbf24;font-size:.95rem;padding:0}
body.light-theme .sw-cp{color:#b45309}
.sw-cp.done{color:#34d399}
.sw-g{display:grid;grid-template-columns:52px minmax(0,1fr);gap:10px 12px;align-items:center}
.sw-ic{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.15rem;padding:0}
.sw-cmp,.sw-play{background:#f59e0b;color:#1a1204!important}
.sw-mic{background:#ef4444}
.sw-ic:disabled{opacity:.35;cursor:not-allowed}
.sw-ic.on,.sw-yp.on{box-shadow:0 0 0 3px rgba(251,191,36,.45)}
.sw-cmp.pulse{animation:swPulse 1.2s ease-in-out 3}
@keyframes swPulse{50%{box-shadow:0 0 0 8px rgba(245,158,11,.3)}}
.sw-r2{display:flex;align-items:center;gap:10px;min-height:52px}
.sw-yp{width:38px;height:38px;border-radius:50%;background:rgba(245,158,11,.16);border:1px solid rgba(245,158,11,.55)!important;color:#f59e0b!important;font-size:.9rem;padding:0}
.sw-yp:disabled{opacity:.3;cursor:not-allowed}
.sw-r4{display:flex;align-items:center;gap:10px}
.sw-sm{width:34px;height:34px;border-radius:50%;background:rgba(148,163,184,.16);border:1px solid rgba(148,163,184,.4)!important;font-size:.85rem;padding:0}
.sw-tk{position:relative;height:56px;border-radius:12px;background:rgba(148,163,184,.08);border:1px solid rgba(148,163,184,.28);overflow:hidden;cursor:pointer}
body.light-theme .sw-tk{background:rgba(15,23,42,.04)}
.sw-tk canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.sw-tl{position:absolute;top:3px;inset-inline-start:14px;font-size:.62rem;font-weight:600;opacity:.75;pointer-events:none;z-index:2}
.sw-tt{position:absolute;top:3px;inset-inline-end:14px;font-size:.62rem;opacity:.75;font-variant-numeric:tabular-nums;pointer-events:none;z-index:2}
.sw-hn{position:absolute;top:0;bottom:0;width:8px;background:#fbbf24;z-index:2;pointer-events:none}
.sw-hn.l{left:0;border-radius:12px 0 0 12px}
.sw-hn.r{right:0;border-radius:0 12px 12px 0}
.sw-ph{position:absolute;top:0;bottom:0;width:2px;margin-left:-1px;background:#fff;z-index:2;pointer-events:none;display:none}
.sw-msg{margin-top:10px;text-align:center;font-size:.82rem;color:#fbbf24}
.sw-ov{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;text-align:center;background:rgba(2,6,23,.82);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#fff}
.sw-ov[hidden]{display:none}
.sw-big{display:none}
.sw-tm{font-size:1rem;font-variant-numeric:tabular-nums;opacity:.85}
.sw-ot{font-size:1.6rem;font-weight:800;color:#f59e0b}
.sw-ov.go .sw-ot{color:#ef4444}
.sw-lv{width:min(260px,80%);height:10px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden}
.sw-lv i{display:block;height:100%;width:0;background:#34d399;transition:width .06s}
.sw-ob{display:flex;gap:10px}
.sw-ob button{height:48px;padding:0 22px;border-radius:14px;font-weight:800;background:rgba(255,255,255,.16);color:#fff}
.sw-ob button.stop{background:#ef4444}`;
    document.head.appendChild(s);
  })();

  /* ---------- DOM ---------- */
  var q = function (sel) { return el && el.querySelector(sel); };
  var TK = function (w) { return q('.sw-tk[data-t="' + w + '"]'); };
  function ensure() {
    if (el && el.isConnected) return el;
    el = document.createElement('div'); el.id = 'sw'; el.className = 'sw'; el.setAttribute('dir', 'ltr');
    el.innerHTML =
      '<button type="button" class="sw-x" data-x aria-label="Close">&times;</button>' +
      '<div class="sw-hd">' +
        '<button type="button" class="sw-w" data-word dir="auto"></button>' +
        '<div class="sw-ar" data-ar hidden><span data-artxt dir="rtl"></span><button type="button" class="sw-cp" data-cp aria-label="Copy"><i class="fa-regular fa-copy"></i></button></div>' +
      '</div>' +
      '<div class="sw-g">' +
        '<button type="button" class="sw-ic sw-cmp" data-cmp aria-label="Compare" disabled><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/></svg></button>' +
        '<div class="sw-tk" data-t="y"><span class="sw-tl" data-lb="y"></span><span class="sw-tt" data-tm="y">0:00 / 0:00</span><canvas></canvas><i class="sw-hn l"></i><i class="sw-hn r"></i><i class="sw-ph"></i></div>' +
        '<button type="button" class="sw-ic sw-mic" data-mic aria-label="Record"></button>' +
        '<div class="sw-r2"><button type="button" class="sw-yp" data-yp aria-label="Play yours" disabled><i class="fa-solid fa-play"></i></button></div>' +
        '<button type="button" class="sw-ic sw-play" data-n="1" aria-label="Play"><i class="fa-solid fa-play"></i></button>' +
        '<div class="sw-tk" data-t="o"><span class="sw-tl" data-lb="o"></span><span class="sw-tt" data-tm="o">0:00 / 0:00</span><canvas></canvas><i class="sw-hn l"></i><i class="sw-hn r"></i><i class="sw-ph"></i></div>' +
        '<span></span>' +
        '<div class="sw-r4"><button type="button" class="sw-sm" data-dl aria-label="Download"><i class="fa-solid fa-download"></i></button><button type="button" class="sw-sm" data-spd aria-label="Speed"><i class="fa-solid fa-bolt"></i></button></div>' +
      '</div>' +
      '<div class="sw-msg" data-msg hidden></div>' +
      '<div class="sw-ov" data-ov hidden><div class="sw-big" data-big></div><div class="sw-ot" data-ot></div><div class="sw-lv"><i data-lv></i></div><div class="sw-tm" data-rt></div><div class="sw-ob" data-ob></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { e.stopPropagation(); });          // taps inside never reach the feed's "tap outside closes" handler
    q('[data-x]').onclick = close;
    q('[data-word]').onclick = function () { if (!S.urls) return; run(1, 'orig'); };
    q('[data-n]').onclick = function () { onPlay(1); };
    q('[data-cmp]').onclick = onCompare;
    q('[data-yp]').onclick = onYours;
    q('[data-mic]').onclick = startRec;
    q('[data-cp]').onclick = onCopy;
    ['o', 'y'].forEach(function (w) { TK(w).addEventListener('click', function (e) { seekTrack(w, e); }); });
    requestAnimationFrame(function () { draw('o'); draw('y'); });
    return el;
  }
  function msg(t) { var m = q('[data-msg]'); if (!m) return; m.textContent = t || ''; m.hidden = !t; }
  function paint() {
    if (!el) return; var t = L(), ok = !!S.urls;
    q('[data-word]').textContent = S.word; q('[data-word]').disabled = !ok;
    var ar = q('[data-ar]'); ar.hidden = !S.ar; q('[data-artxt]').textContent = S.ar || '';
    q('[data-lb="o"]').textContent = t.orig; q('[data-lb="y"]').textContent = t.you;
    var playing = function (m) { return S.mode === m && S.act > 0; };
    var pl = q('[data-n]'); pl.disabled = !ok; pl.innerHTML = '<i class="fa-solid ' + (playing('orig') ? 'fa-stop' : 'fa-play') + '"></i>'; pl.classList.toggle('on', playing('orig'));
    var c = q('[data-cmp]'); c.disabled = !ok || !S.rec; c.classList.toggle('on', playing('cmp'));
    var y = q('[data-yp]'); y.disabled = !S.rec; y.innerHTML = '<i class="fa-solid ' + (playing('you') ? 'fa-stop' : 'fa-play') + '"></i>'; y.classList.toggle('on', playing('you'));
  }

  /* ---------- copy the Arabic translation ---------- */
  function onCopy() {
    var b = q('[data-cp]'), txt = S.ar || ''; if (!txt) return;
    var done = function () { b.classList.add('done'); b.innerHTML = '<i class="fa-solid fa-check"></i>'; setTimeout(function () { if (b.isConnected) { b.classList.remove('done'); b.innerHTML = '<i class="fa-regular fa-copy"></i>'; } }, 1300); };
    var old = function () { var t = document.createElement('textarea'); t.value = txt; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove(); done(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, old); else old();
  }
  /* Arabic translation from the word row (first column whose value is Arabic text and whose name looks like translation / arabic / meaning) */
  async function getAr(word) {
    var c = wpClean(word); if (!c) return '';
    var h = { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } }, rows = null;
    try {
      var r = await fetch(SB + '/rest/v1/words_table?select=*&limit=1&word_key=eq.' + encodeURIComponent(c), h);
      if (!r.ok) r = await fetch(SB + '/rest/v1/words_table?select=*&limit=1&word=ilike.' + encodeURIComponent(String(word).trim().replace(/[\\%_]/g, function (m) { return '\\' + m; })), h);
      if (r.ok) rows = await r.json();
    } catch (e) {}
    var row = Array.isArray(rows) && rows[0]; if (!row) return '';
    var ks = Object.keys(row), k = ks.find(function (x) { return /^(ar|arabic|translation|meaning)$/i.test(x); }) || ks.find(function (x) { return /arab|transl|mean/i.test(x); });
    var v = k && row[k];
    return typeof v === 'string' && /[\u0600-\u06FF]/.test(v) ? v.trim() : '';
  }

  /* ---------- waveforms ---------- */
  function peaksFrom(buf, n) {
    var ch = buf.getChannelData(0), step = Math.max(1, Math.floor(ch.length / n)), out = [], i, j, m;
    for (i = 0; i < n; i++) { m = 0; for (j = i * step; j < Math.min(ch.length, (i + 1) * step); j++) { var v = Math.abs(ch[j]); if (v > m) m = v; } out.push(m); }
    return out;
  }
  function fake(word) {
    var out = [], h = 7, i; for (i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) >>> 0;
    for (i = 0; i < 90; i++) { h = (h * 1664525 + 1013904223) >>> 0; out.push(.25 + (h % 1000) / 1000 * .6); }
    return out;
  }
  async function loadPeaks(urls, my) {
    var ctx = null;
    try {
      ctx = new AC(); var parts = [], total = 0;
      for (var i = 0; i < urls.length; i++) {
        var ab = await (await fetch(urls[i])).arrayBuffer();
        var buf = await new Promise(function (res, rej) { var p = ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
        parts.push(buf); total += buf.duration;
      }
      var all = [];
      parts.forEach(function (b) { all = all.concat(peaksFrom(b, Math.max(6, Math.round(100 * b.duration / total)))); });
      if (my === S.ld) { S.peaks.o = all; S.total = total; }
    } catch (e) { if (my === S.ld) { S.peaks.o = fake(S.word); S.total = 0; } }
    try { if (ctx) ctx.close(); } catch (e) {}
    if (my === S.ld) draw('o');
  }
  async function loadYou(url) {
    var ctx = null;
    try {
      ctx = new AC(); var ab = await (await fetch(url)).arrayBuffer();
      var buf = await new Promise(function (res, rej) { var p = ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
      S.peaks.y = peaksFrom(buf, 100); S.yDur = buf.duration;
    } catch (e) { S.peaks.y = fake(S.word + '!'); S.yDur = 0; }
    try { if (ctx) ctx.close(); } catch (e) {}
    S.prog.y = 0; draw('y');
  }
  function draw(w) {
    if (!el) return; var box = TK(w); if (!box) return; var cv = box.querySelector('canvas'), dpr = window.devicePixelRatio || 1;
    var W = box.clientWidth, Hh = box.clientHeight; if (!W || !Hh) return;
    cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr);
    var x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, Hh);
    var light = document.body.classList.contains('light-theme'), mid = Hh / 2, pk = S.peaks[w], pr = S.prog[w] || 0;
    if (!pk) {   // empty: dotted centre line
      x.strokeStyle = light ? 'rgba(15,23,42,.3)' : 'rgba(148,163,184,.5)'; x.lineWidth = 2; x.setLineDash([2, 6]); x.lineCap = 'round';
      x.beginPath(); x.moveTo(14, mid); x.lineTo(W - 14, mid); x.stroke(); return;
    }
    var pad = 14, span = W - pad * 2, n = Math.min(pk.length, Math.floor(span / 4)), mx = Math.max.apply(null, pk) || 1, i;
    x.lineCap = 'round'; x.lineWidth = 2;
    for (i = 0; i < n; i++) {
      var a = Math.floor(i * pk.length / n), b = Math.max(a + 1, Math.floor((i + 1) * pk.length / n)), v = 0, j;
      for (j = a; j < b; j++) if (pk[j] > v) v = pk[j];
      var hh = Math.max(3, v / mx * (Hh - 22)), px = pad + (i + .5) * span / n;
      x.strokeStyle = (i + .5) / n <= pr ? '#fbbf24' : (light ? 'rgba(15,23,42,.35)' : 'rgba(148,163,184,.55)');
      x.beginPath(); x.moveTo(px, mid - hh / 2); x.lineTo(px, mid + hh / 2); x.stroke();
    }
  }
  function mark(w, cur, tot) {   // playhead + time
    if (!el) return; var box = TK(w), ph = box.querySelector('.sw-ph'), tm = box.querySelector('[data-tm]');
    S.prog[w] = tot ? Math.min(1, cur / tot) : 0;
    ph.style.display = cur > 0 ? 'block' : 'none'; ph.style.left = (S.prog[w] * 100) + '%';
    tm.textContent = tf(cur) + ' / ' + tf(tot); draw(w);
  }
  function seekTrack(w, e) {
    var a = S.audio; if (!a || S.aw !== w || !a.duration) return;
    if (w === 'o' && S.urls && S.urls.length > 1) return;
    var r = TK(w).getBoundingClientRect(), f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    a.currentTime = f * a.duration;
  }

  /* ---------- playback ---------- */
  function resetTracks() {
    ['o', 'y'].forEach(function (w) {
      S.prog[w] = 0; if (!el) return; var box = TK(w); box.querySelector('.sw-ph').style.display = 'none';
      box.querySelector('[data-tm]').textContent = '0:00 / ' + tf(w === 'o' ? S.total : S.yDur); draw(w);
    });
  }
  function stopAll() {
    S.tk++; S.mode = ''; S.act = 0; S.aw = '';
    if (S.audio) { try { S.audio.pause(); } catch (e) {} S.audio = null; }
    resetTracks(); paint();
  }
  function clip(url, my, w, off) {
    return new Promise(function (res) {
      if (my !== S.tk) return res();
      var a = new Audio(url); S.audio = a; S.aw = w;
      var tick = function () {
        if (S.audio !== a || !el) return;
        var d = isFinite(a.duration) ? a.duration : 0, other = w === 'o' ? 'y' : 'o';
        if (S.prog[other]) { S.prog[other] = 0; var ob = TK(other); ob.querySelector('.sw-ph').style.display = 'none'; draw(other); }
        var tot = w === 'o' ? (S.total || d) : (S.yDur || d);
        mark(w, off + a.currentTime, tot);
      };
      a.ontimeupdate = a.onloadedmetadata = tick;
      a.onended = a.onerror = function () { res(); };
      a.play().catch(function () { res(); });
    });
  }
  async function run(n, mode) {
    if (mode !== 'you' && !S.urls) return;
    if (mode !== 'orig' && !S.rec) return;
    stopAll(); var my = S.tk;
    S.mode = mode; S.act = n; paint();
    for (var i = 0; i < n; i++) {
      if (my !== S.tk) return;
      if (mode !== 'you') {
        var off = 0;
        for (var k = 0; k < S.urls.length; k++) {
          await clip(S.urls[k], my, 'o', off); if (my !== S.tk) return;
          if (S.audio && isFinite(S.audio.duration)) off += S.audio.duration;
          if (k < S.urls.length - 1) await sleep(300);
        }
      }
      if (mode === 'cmp') { await sleep(450); if (my !== S.tk) return; }
      if (mode === 'cmp' || mode === 'you') { await clip(S.rec.url, my, 'y', 0); if (my !== S.tk) return; }
      if (i < n - 1) await sleep(550);
    }
    if (my === S.tk) stopAll();
  }
  function onPlay(n) {
    if (S.mode === 'orig' && S.act) { stopAll(); return; }          // pressing it while it plays stops it
    run(n, 'orig');
  }
  function onYours() {
    if (!S.rec) { msg(L().nowait); return; }
    if (S.mode === 'you' && S.act) { stopAll(); return; }
    run(1, 'you');
  }
  function onCompare() {
    if (!S.rec) { msg(L().nowait); return; }
    if (S.mode === 'cmp' && S.act) { stopAll(); return; }
    run(1, 'cmp');
  }

  /* ---------- recording ---------- */
  function wav(buf, from, to) {
    var sr = buf.sampleRate, ch = buf.getChannelData(0), s = Math.max(0, Math.floor(from * sr)), e = Math.min(ch.length, Math.floor(to * sr)), n = Math.max(0, e - s), i;
    var v = new DataView(new ArrayBuffer(44 + n * 2));
    var w = function (o, t) { for (var j = 0; j < t.length; j++) v.setUint8(o + j, t.charCodeAt(j)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    for (i = 0; i < n; i++) { var x = Math.max(-1, Math.min(1, ch[s + i])); v.setInt16(44 + i * 2, x < 0 ? x * 0x8000 : x * 0x7fff, true); }
    return new Blob([v], { type: 'audio/wav' });
  }
  /* the same kind of "ta-dat" tone the Claude app plays: rising = start, falling = done */
  function beep(ctx, up) {
    return new Promise(function (res) {
      try {
        if (ctx.state === 'suspended') ctx.resume();
        var f = up ? [660, 990] : [990, 660], t0 = ctx.currentTime + 0.02;
        f.forEach(function (hz, i) {
          var o = ctx.createOscillator(), g = ctx.createGain(), s = t0 + i * 0.14;
          o.type = 'sine'; o.frequency.value = hz;
          g.gain.setValueAtTime(0.0001, s); g.gain.linearRampToValueAtTime(0.4, s + 0.015); g.gain.exponentialRampToValueAtTime(0.001, s + 0.12);
          o.connect(g); g.connect(ctx.destination); o.start(s); o.stop(s + 0.13);
        });
        setTimeout(res, 360);
      } catch (e) { res(); }
    });
  }
  function ov(state, big, text, withStop) {
    var o = q('[data-ov]'), t = L(); o.hidden = false; o.className = 'sw-ov' + (state === 'go' ? ' go' : '');
    q('[data-big]').innerHTML = big; q('[data-ot]').textContent = text;
    q('[data-ob]').innerHTML = (withStop ? '<button type="button" class="stop" data-stop>' + H(t.stop) + '</button>' : '') + '<button type="button" data-cancel>' + H(t.cancel) + '</button>';
  }
  async function startRec() {
    if (S.recording) return;
    var t = L(); stopAll(); msg('');
    if (!navigator.mediaDevices || !window.MediaRecorder) { msg(t.nomic); return; }
    var stream;
    ov('wait', '<i class="fa-solid fa-microphone"></i>', t.prep, false); S.recording = true; S.abort = false;
    q('[data-rt]').textContent = '';
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
    catch (e) { S.recording = false; q('[data-ov]').hidden = true; msg(t.nomic); return; }
    var ctx = new AC(), an = ctx.createAnalyser(), data = new Uint8Array(512), raf = 0, live = true;
    try { ctx.createMediaStreamSource(stream).connect(an); } catch (e) {}
    var lv = q('[data-lv]');
    (function meter() { if (!live) return; an.getByteTimeDomainData(data); var p = 0; for (var i = 0; i < data.length; i++) p = Math.max(p, Math.abs(data[i] - 128)); lv.style.width = Math.min(100, p / 64 * 100) + '%'; raf = requestAnimationFrame(meter); })();
    var mr = new MediaRecorder(stream), chunks = [], started = new Promise(function (r) { mr.onstart = r; });
    mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    var stopped = new Promise(function (r) { mr.onstop = r; });
    var finish = function () { live = false; cancelAnimationFrame(raf); try { stream.getTracks().forEach(function (x) { x.stop(); }); } catch (e) {} try { ctx.close(); } catch (e) {} };
    mr.start(200); await started; var t0 = performance.now();
    var stopNow = function () { if (mr.state !== 'inactive') mr.stop(); };
    q('[data-ob]').onclick = function (e) { if (e.target.closest('[data-cancel]')) { S.abort = true; stopNow(); } else if (e.target.closest('[data-stop]')) stopNow(); };

    /* 1) microphone is already on and warming up: the shield says WAIT, nothing is kept from this part */
    ov('wait', '', t.wait, false); await sleep(1300);
    if (!S.abort) await beep(ctx, true);                 // start tone (it finishes BEFORE goAt, so it is never part of the recording)
    var goAt = performance.now();
    if (!S.abort) {
      /* 2) GO: from here on it is recorded */
      ov('go', '', t.go, true);
      var rt = q('[data-rt]'), iv = setInterval(function () { rt.textContent = tf((performance.now() - goAt) / 1000); }, 250);
      var auto = setTimeout(stopNow, 20000);
      await stopped; clearInterval(iv); clearTimeout(auto);
    } else { stopNow(); await stopped; }
    var endAt = performance.now();
    if (!S.abort) await beep(ctx, false);                // end tone, after the recorder has already stopped
    finish(); S.recording = false; q('[data-ov]').hidden = true;
    if (S.abort) return;

    /* 3) cut everything before GO (and the tap sound at the end) */
    var blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' }), url = null, secs = 0;
    try {
      var ctx2 = new AC(), ab = await blob.arrayBuffer();
      var buf = await new Promise(function (res, rej) { var p = ctx2.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
      var from = Math.max(0, (goAt - t0) / 1000 - 0.05), to = Math.max(from, buf.duration - 0.12);
      secs = to - from; if (secs >= 0.25) url = URL.createObjectURL(wav(buf, from, to));
      try { ctx2.close(); } catch (e) {}
    } catch (e) { url = URL.createObjectURL(blob); secs = (endAt - goAt) / 1000; }   // cannot decode here: keep it untrimmed
    if (!url) { msg(t.silent); return; }
    if (S.recs[S.key] && S.recs[S.key].url) { try { URL.revokeObjectURL(S.recs[S.key].url); } catch (e) {} }
    S.rec = S.recs[S.key] = { url: url }; paint();
    loadYou(url);
    var cb = q('[data-cmp]'); cb.classList.remove('pulse'); void cb.offsetWidth; cb.classList.add('pulse');
  }

  /* ---------- open / close ---------- */
  function close() {
    if (S.recording) { S.abort = true; var m = q('[data-ob] [data-cancel]'); if (m) m.click(); }
    S.ld++; stopAll(); if (el) { el.remove(); el = null; }
  }
  window.wpOpen = async function (word) {
    word = String(word == null ? '' : word).trim(); if (!word) return;
    if (S.recording) return;
    try { if (window.ThabitRichStudent) ThabitRichStudent.stop(); } catch (e) {}
    try { wpClose(); } catch (e) {}                                // the old player, if it is somehow open
    stopAll(); ensure();
    S.word = word; S.key = wpClean(word); S.urls = null; S.ar = ''; S.rec = S.recs[S.key] || null;
    S.peaks = { o: null, y: null }; S.prog = { o: 0, y: 0 }; S.total = 0; S.yDur = 0; msg('');
    resetTracks(); paint();
    if (S.rec) loadYou(S.rec.url);
    var my = ++S.ld, urls = null, err = '';
    getAr(word).then(function (a) { if (my === S.ld && el) { S.ar = a; paint(); } });
    try { urls = await wpResolve(word); } catch (e) { urls = undefined; err = e && e.message || ''; }
    if (my !== S.ld || !el) return;
    if (!urls) { msg(urls === null ? L().missing : L().fail + (err ? ' (' + err + ')' : '')); return; }
    S.urls = urls; paint(); loadPeaks(urls, my); run(1, 'orig');
  };

  /* tap outside the sheet closes ONLY the sheet (not the feed); tapping another word just switches to it */
  document.addEventListener('click', function (e) {
    if (!el || S.recording) return;
    var t = e.target; if (el.contains(t)) return;
    if (t.closest && t.closest('.vx, .aww, .rt-link')) return;
    e.stopPropagation(); e.preventDefault(); close();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el && !S.recording) close(); });
  window.addEventListener('resize', function () { if (el) { draw('o'); draw('y'); } });
})();
