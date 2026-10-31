/* ==========================================================
   Smart Widget (load AFTER dashboard.js and dashboard-voice-lit.js)
   Replaces the old word player: tap any lit word / Words-list word / Hyperlinked word
   and a mobile-first sheet opens at the bottom of the page. No Assistant tab needed.

   Layout (phone first, big 52px targets):
        [word]  <- tap = play the ORIGINAL once          (label says what the buttons target)
        [ x2 ][ x3 ][ x5 ]   repeat buttons
        [      PLAY      ]   play once
        [====== seek ======] time
     left column:  MIC (record yourself)  and  COMPARE (original, then yours)

   Which clip do the play / x2 / x3 / x5 buttons repeat?
     - default: the ORIGINAL voice
     - after you press COMPARE: the COMPARISON (original -> yours) until you tap the word again
     - the label above the buttons always says which one is active
   Recording: mic is opened and warmed up first, a blurred full-screen shield says
     "WAIT, not recording yet" with 3-2-1 and a live level bar, then turns red "RECORDING NOW".
     Everything before the GO moment is cut away, so the first word is never missed.
   Also here: tap-highlight / selection-box fix for phones.
   ========================================================== */
(function () {
  'use strict';
  var T = {
    en: { orig: 'Original voice', cmp: 'Comparison: original, then yours', missing: 'No recording for this word yet', fail: 'Could not load the recording',
          nomic: 'Microphone is blocked. Allow it in the browser settings.', prep: 'Getting the microphone ready…', wait: 'WAIT. Not recording yet. Do not speak.', go: 'RECORDING NOW. Speak!',
          stop: 'Stop', cancel: 'Cancel', silent: 'Nothing was recorded, try again', yours: 'Yours', hint: 'Tap the word for the original', nowait: 'Record yourself first' },
    ar: { orig: 'الصوت الأصلي', cmp: 'المقارنة: الأصلي ثم صوتك', missing: 'لا يوجد تسجيل لهذه الكلمة بعد', fail: 'تعذر تحميل التسجيل',
          nomic: 'الميكروفون محظور. اسمح به من إعدادات المتصفح.', prep: 'جاري تجهيز الميكروفون…', wait: 'انتظر. لم يبدأ التسجيل بعد. لا تتكلم.', go: 'التسجيل يعمل الآن. تكلم!',
          stop: 'إيقاف', cancel: 'إلغاء', silent: 'لم يُسجَّل أي صوت، حاول مرة أخرى', yours: 'صوتك', hint: 'اضغط على الكلمة لسماع الأصلي', nowait: 'سجّل صوتك أولاً' },
    eg: { orig: 'الصوت الأصلي', cmp: 'المقارنة: الأصلي وبعده صوتك', missing: 'الكلمة دي لسه مفيهاش صوت', fail: 'مقدرتش أحمّل الصوت',
          nomic: 'المايك مقفول. افتحه من إعدادات المتصفح.', prep: 'بجهّز المايك…', wait: 'استنى. لسه مبدأش تسجيل. ما تتكلمش.', go: 'بيسجّل دلوقتي. اتكلم!',
          stop: 'وقّف', cancel: 'إلغاء', silent: 'مفيش صوت اتسجل، جرب تاني', yours: 'صوتك', hint: 'دوس على الكلمة تسمع الأصلي', nowait: 'سجّل صوتك الأول' }
  };
  var L = function () { var l = 'en'; try { l = lang; } catch (e) {} return T[l] || T.en; };
  var H = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var tf = function (s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  var S = { word: '', key: '', urls: null, target: 'orig', tk: 0, ld: 0, audio: null, rec: null, recs: {}, recording: false, abort: false, act: 0, actCmp: false };
  var el = null;

  /* ---------- styles (+ phone tap-highlight / selection fix) ---------- */
  (function () {
    var s = document.createElement('style'); s.id = 'swCss';
    s.textContent = [
      '*{-webkit-tap-highlight-color:transparent}',
      '.vx,.aww,.rt-link,.cap,.itm,.itc,.hnd,.pc,.cpb,button{-webkit-touch-callout:none;touch-action:manipulation}',
      '.vx,.aww,.rt-link{-webkit-user-select:none;user-select:none;outline:none}',
      'button:focus:not(:focus-visible),[role=button]:focus:not(:focus-visible){outline:none}',
      '.sw{position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(100vw,440px);z-index:100000;box-sizing:border-box;padding:14px 14px calc(14px + env(safe-area-inset-bottom));border-radius:22px 22px 0 0;background:rgba(15,23,42,.985);color:#e2e8f0;border:1px solid rgba(148,163,184,.3);border-bottom:0;box-shadow:0 -14px 44px rgba(0,0,0,.5);font-family:inherit;animation:swUp .22s ease-out;overflow:hidden}',
      'body.light-theme .sw{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}',
      '@keyframes swUp{from{transform:translate(-50%,40px);opacity:0}to{transform:translate(-50%,0);opacity:1}}',
      '.sw button{font:inherit;border:0;cursor:pointer}',
      '.sw-x{position:absolute;top:8px;inset-inline-end:10px;width:32px;height:32px;border-radius:50%;background:rgba(148,163,184,.18);color:inherit;font-size:1.2rem;line-height:1}',
      '.sw-w{display:block;width:calc(100% - 44px);margin:0 auto 4px;padding:6px 8px;background:none;color:inherit;font-size:1.25rem;font-weight:800;text-align:center;overflow-wrap:anywhere}',
      '.sw-tg{text-align:center;font-size:.74rem;opacity:.85;margin-bottom:10px;min-height:1.1em}',
      '.sw-tg b{color:#fbbf24}',
      '.sw-main{display:flex;gap:10px;align-items:stretch}',
      '.sw-side{display:flex;flex-direction:column;gap:10px;justify-content:flex-end}',
      '.sw-col{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}',
      '.sw-rep{display:flex;gap:10px}',
      '.sw-rep button,.sw-play{height:52px;border-radius:14px;font-weight:800;font-size:1.05rem}',
      '.sw-rep button{flex:1;background:rgba(148,163,184,.16);color:inherit;border:1px solid rgba(148,163,184,.35)}',
      '.sw-play{width:100%;background:#34d399;color:#06281b}',
      '.sw .on{background:#f59e0b!important;color:#0f172a!important;border-color:#f59e0b!important}',
      '.sw-ic{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.15rem}',
      '.sw-mic{background:#ef4444;color:#fff}',
      '.sw-cmp{background:#3b82f6;color:#fff}',
      '.sw-cmp:disabled{opacity:.3}',
      '.sw-cmp.pulse{animation:swPulse 1.2s ease-in-out 3}',
      '@keyframes swPulse{50%{box-shadow:0 0 0 8px rgba(59,130,246,.25)}}',
      '.sw-bar{display:flex;align-items:center;gap:8px}',
      '.sw-bar input{flex:1;min-width:0;height:28px;accent-color:#34d399}',
      '.sw-bar span{flex:none;font-size:.7rem;opacity:.75;font-variant-numeric:tabular-nums}',
      '.sw-msg{margin-top:8px;text-align:center;font-size:.82rem;color:#fbbf24}',
      '.sw button:disabled{opacity:.35;cursor:not-allowed}',
      '.sw-ov{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;text-align:center;background:rgba(2,6,23,.82);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#fff}',
      '.sw-ov[hidden]{display:none}',
      '.sw-big{width:104px;height:104px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:900;border:4px solid #f59e0b;color:#f59e0b}',
      '.sw-ov.go .sw-big{border-color:#ef4444;color:#ef4444;animation:swRec 1s ease-in-out infinite}',
      '@keyframes swRec{50%{box-shadow:0 0 0 14px rgba(239,68,68,.25)}}',
      '.sw-ot{font-size:1.05rem;font-weight:800;color:#f59e0b}',
      '.sw-ov.go .sw-ot{color:#ef4444}',
      '.sw-lv{width:min(260px,80%);height:10px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden}',
      '.sw-lv i{display:block;height:100%;width:0;background:#34d399;transition:width .06s}',
      '.sw-ob{display:flex;gap:10px}',
      '.sw-ob button{height:48px;padding:0 22px;border-radius:14px;font-weight:800;background:rgba(255,255,255,.16);color:#fff}',
      '.sw-ob button.stop{background:#ef4444}'
    ].join(''); document.head.appendChild(s);
  })();

  /* ---------- DOM ---------- */
  var q = function (sel) { return el && el.querySelector(sel); };
  function ensure() {
    if (el && el.isConnected) return el;
    el = document.createElement('div'); el.id = 'sw'; el.className = 'sw'; el.setAttribute('dir', 'ltr');
    el.innerHTML =
      '<button type="button" class="sw-x" data-x aria-label="Close">&times;</button>' +
      '<button type="button" class="sw-w" data-word dir="auto"></button>' +
      '<div class="sw-tg" data-tg dir="auto"></div>' +
      '<div class="sw-main">' +
        '<div class="sw-side">' +
          '<button type="button" class="sw-ic sw-cmp" data-cmp aria-label="Compare" disabled><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/></svg></button>' +
          '<button type="button" class="sw-ic sw-mic" data-mic aria-label="Record"><i class="fa-solid fa-microphone"></i></button>' +
        '</div>' +
        '<div class="sw-col">' +
          '<div class="sw-rep"><button type="button" data-n="2">2</button><button type="button" data-n="3">3</button><button type="button" data-n="5">5</button></div>' +
          '<button type="button" class="sw-play" data-n="1" aria-label="Play"><i class="fa-solid fa-play"></i></button>' +
          '<div class="sw-bar"><input type="range" min="0" max="1000" value="0" aria-label="Seek"><span data-tm>0:00 / 0:00</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="sw-msg" data-msg hidden></div>' +
      '<div class="sw-ov" data-ov hidden><div class="sw-big" data-big></div><div class="sw-ot" data-ot></div><div class="sw-lv"><i data-lv></i></div><div class="sw-tm" data-rt></div><div class="sw-ob" data-ob></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { e.stopPropagation(); });          // taps inside never reach the feed's "tap outside closes" handler
    el.querySelector('[data-x]').onclick = close;
    el.querySelector('[data-word]').onclick = function () { if (!S.urls) return; S.target = 'orig'; paint(); run(1, 'orig'); };
    el.querySelectorAll('[data-n]').forEach(function (b) { b.onclick = function () { onPlay(+b.dataset.n); }; });
    el.querySelector('[data-cmp]').onclick = onCompare;
    el.querySelector('[data-mic]').onclick = startRec;
    var sk = el.querySelector('input'); sk.oninput = function () { var a = S.audio; if (a && a.duration) a.currentTime = sk.value / 1000 * a.duration; };
    return el;
  }
  function msg(t) { var m = q('[data-msg]'); if (!m) return; m.textContent = t || ''; m.hidden = !t; }
  function paint() {
    if (!el) return; var t = L(), ok = !!S.urls;
    q('[data-word]').textContent = S.word; q('[data-word]').disabled = !ok;
    var cmpOn = S.target === 'cmp';
    q('[data-tg]').innerHTML = ok ? '<b>' + H(cmpOn ? t.cmp : t.orig) + '</b>' + (S.rep ? ' · ' + S.rep : '') : '';
    el.querySelectorAll('[data-n]').forEach(function (b) { b.disabled = !ok || (cmpOn && !S.rec); b.classList.toggle('on', S.act === +b.dataset.n); });
    var pl = q('.sw-play'); pl.innerHTML = '<i class="fa-solid ' + (S.act === 1 ? 'fa-stop' : 'fa-play') + '"></i>';
    var c = q('[data-cmp]'); c.disabled = !ok || !S.rec; c.classList.toggle('on', S.actCmp);
  }

  /* ---------- playback ---------- */
  function stopAll() {
    S.tk++; S.act = 0; S.actCmp = false; S.rep = '';
    if (S.audio) { try { S.audio.pause(); } catch (e) {} S.audio = null; }
    tick(null); paint();
  }
  function tick(a) {
    if (!el) return; var sk = q('input'), tm = q('[data-tm]'), d = a && isFinite(a.duration) ? a.duration : 0;
    sk.value = a && d ? Math.round(a.currentTime / d * 1000) : 0;
    tm.textContent = tf(a ? a.currentTime : 0) + ' / ' + tf(d);
  }
  function clip(url, my) {
    return new Promise(function (res) {
      if (my !== S.tk) return res();
      var a = new Audio(url); S.audio = a;
      a.ontimeupdate = a.onloadedmetadata = function () { if (S.audio === a) tick(a); };
      a.onended = a.onerror = function () { res(); };
      a.play().catch(function () { res(); });
    });
  }
  async function run(n, mode) {
    if (!S.urls) return;
    stopAll(); var my = S.tk;
    S.act = n; S.actCmp = mode === 'cmp'; paint();
    for (var i = 0; i < n; i++) {
      if (my !== S.tk) return;
      S.rep = n > 1 ? (i + 1) + '/' + n : ''; paint();
      for (var k = 0; k < S.urls.length; k++) { await clip(S.urls[k], my); if (my !== S.tk) return; if (k < S.urls.length - 1) await sleep(300); }
      if (mode === 'cmp' && S.rec) { await sleep(450); if (my !== S.tk) return; await clip(S.rec.url, my); if (my !== S.tk) return; }
      if (i < n - 1) await sleep(550);
    }
    if (my === S.tk) stopAll();
  }
  function onPlay(n) {
    if (S.act === n) { stopAll(); return; }                       // pressing the active button stops it
    if (S.target === 'cmp' && !S.rec) S.target = 'orig';
    run(n, S.target);
  }
  function onCompare() {
    if (!S.rec) { msg(L().nowait); return; }
    if (S.actCmp && S.act === 1) { stopAll(); return; }
    S.target = 'cmp'; run(1, 'cmp');
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
    var AC = window.AudioContext || window.webkitAudioContext, ctx = new AC(), an = ctx.createAnalyser(), data = new Uint8Array(512), raf = 0, live = true;
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
    for (var c = 3; c >= 1 && !S.abort; c--) { ov('wait', String(c), t.wait, false); await sleep(800); }
    var goAt = performance.now();
    if (!S.abort) {
      /* 2) GO: from here on it is recorded, with a big red shield */
      ov('go', '<i class="fa-solid fa-circle"></i>', t.go, true);
      var rt = q('[data-rt]'), iv = setInterval(function () { rt.textContent = tf((performance.now() - goAt) / 1000); }, 250);
      var auto = setTimeout(stopNow, 20000);
      await stopped; clearInterval(iv); clearTimeout(auto);
    } else { stopNow(); await stopped; }
    var endAt = performance.now();
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
    S.rec = S.recs[S.key] = { url: url }; S.target = 'orig'; paint();
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
    S.word = word; S.key = wpClean(word); S.urls = null; S.target = 'orig'; S.rec = S.recs[S.key] || null; msg('');
    paint();
    var my = ++S.ld, urls = null, err = '';
    try { urls = await wpResolve(word); } catch (e) { urls = undefined; err = e && e.message || ''; }
    if (my !== S.ld || !el) return;
    if (!urls) { msg(urls === null ? L().missing : L().fail + (err ? ' (' + err + ')' : '')); return; }
    S.urls = urls; paint(); run(1, 'orig');
  };

  /* tap outside the sheet closes ONLY the sheet (not the feed); tapping another word just switches to it */
  document.addEventListener('click', function (e) {
    if (!el || S.recording) return;
    var t = e.target; if (el.contains(t)) return;
    if (t.closest && t.closest('.vx, .aww, .rt-link')) return;
    e.stopPropagation(); e.preventDefault(); close();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el && !S.recording) close(); });
})();