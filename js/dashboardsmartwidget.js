/* ==========================================================
   Smart Widget (load AFTER dashboard.js and dashboard-voice-lit.js)
   - floating sheet with space on left / right / bottom; splits the screen with the notes pop-up
   - header: word + Arabic translation + copy button
   - left column (top -> bottom): COMPARE, RECORD, PLAY (bottom corner)
   - right: YOU track (top), small play-yours button beside RECORD, ORIGINAL track (bottom)
   - long press on a play button: 2 / 3 / 5 repeats; two quick taps: back to once
   - yellow handles: only the part between them plays; the round arrows button above each track puts them back
   - record with a selected part on the YOU track: only that part is re-recorded and joined into the old recording
   - download (original / yours / comparison) and speed (voice speed + wait between), both applied to playback and files
   ========================================================== */
(function () {
  'use strict';
  var T = {
    en: { orig: 'Original', you: 'You', missing: 'No recording for this word yet', fail: 'Could not load the recording',
          nomic: 'Microphone is blocked. Allow it in the browser settings.', prep: 'Wait a moment…', wait: 'Wait a moment…', go: 'Record now',
          stop: 'Stop', cancel: 'Cancel', silent: 'Nothing was recorded, try again', nowait: 'Record yourself first', copied: 'Copied',
          part: 'Record the selected part', dlO: 'Original', dlY: 'Yours', dlC: 'Compare', spd: 'Voice speed', wt: 'Wait between', dlBusy: 'Preparing the file…', dlFail: 'Could not prepare the file', unit: 's' },
    ar: { orig: 'الأصلي', you: 'أنت', missing: 'لا يوجد تسجيل لهذه الكلمة بعد', fail: 'تعذر تحميل التسجيل',
          nomic: 'الميكروفون محظور. اسمح به من إعدادات المتصفح.', prep: 'انتظر قليلاً…', wait: 'انتظر قليلاً…', go: 'سجّل الآن',
          stop: 'إيقاف', cancel: 'إلغاء', silent: 'لم يُسجَّل أي صوت، حاول مرة أخرى', nowait: 'سجّل صوتك أولاً', copied: 'تم النسخ',
          part: 'سجّل الجزء المحدد', dlO: 'الأصلي', dlY: 'صوتك', dlC: 'المقارنة', spd: 'سرعة الصوت', wt: 'الانتظار بينهما', dlBusy: 'جاري تجهيز الملف…', dlFail: 'تعذر تجهيز الملف', unit: 'ث' },
    eg: { orig: 'الأصلي', you: 'إنت', missing: 'الكلمة دي لسه مفيهاش صوت', fail: 'مقدرتش أحمّل الصوت',
          nomic: 'المايك مقفول. افتحه من إعدادات المتصفح.', prep: 'استنى شوية…', wait: 'استنى شوية…', go: 'سجّل دلوقتي',
          stop: 'وقّف', cancel: 'إلغاء', silent: 'مفيش صوت اتسجل، جرب تاني', nowait: 'سجّل صوتك الأول', copied: 'اتنسخ',
          part: 'سجّل الجزء المحدد', dlO: 'الأصلي', dlY: 'صوتك', dlC: 'المقارنة', spd: 'سرعة الصوت', wt: 'الانتظار بينهم', dlBusy: 'بيجهّز الملف…', dlFail: 'معرفتش أجهّز الملف', unit: 'ث' }
  };
  var L = function () { var l = 'en'; try { l = lang; } catch (e) {} return T[l] || T.en; };
  var H = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var tf = function (s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  var AC = window.AudioContext || window.webkitAudioContext;

  var CFG_KEY = 'thabit_sw_cfg', SPEEDS = [0.5, 0.75, 1, 1.25], WAITS = [0.5, 1, 2, 3];
  var S = {
    word: '', key: '', urls: null, tk: 0, ld: 0, audio: null, rec: null, recs: {}, recording: false, abort: false,
    mode: '', act: 0, aw: '', off: 0,
    peaks: { o: null, y: null }, prog: { o: 0, y: 0 }, total: 0, yDur: 0, ar: '',
    cnt: { o: 1, y: 1 }, swallow: false, trim: { o: [0, 1], y: [0, 1] }, durs: null, pcmO: null, cfg: cfgLoad()
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
.sw-hn{position:absolute;top:0;bottom:0;width:10px;background:#fbbf24;z-index:3;touch-action:none;cursor:ew-resize}
.sw-hn::before{content:"";position:absolute;top:0;bottom:0;left:-14px;right:-14px}
.sw-hn.l{left:0;border-radius:10px 0 0 10px}
.sw-hn.r{left:calc(100% - 10px);border-radius:0 10px 10px 0}
.sw-dm{position:absolute;top:0;bottom:0;background:rgba(2,6,23,.6);z-index:1;pointer-events:none}
body.light-theme .sw-dm{background:rgba(255,255,255,.65)}
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
.sw-ob button.stop{background:#ef4444}
.sw-ic,.sw-yp{position:relative;touch-action:none;-webkit-user-select:none;user-select:none}
.sw-bd{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:#0f172a;color:#fbbf24;border:2px solid #fbbf24;font:800 .68rem/16px Inter,sans-serif;text-align:center;cursor:pointer}
.sw-bd[hidden]{display:none}
.sw-yp .sw-bd{top:-6px;right:-6px;min-width:18px;height:18px;line-height:14px;font-size:.62rem}
body.light-theme .sw-bd{background:#fff;color:#b45309;border-color:#b45309}
.sw-cn{position:absolute;z-index:4;display:flex;gap:8px;padding:6px;border-radius:999px;background:rgba(15,23,42,.96);border:1px solid rgba(148,163,184,.35);box-shadow:0 8px 24px rgba(0,0,0,.5);animation:swPop .16s ease-out}
body.light-theme .sw-cn{background:#fff;border-color:rgba(15,23,42,.2)}
.sw-cn button{width:38px;height:38px;border-radius:50%;background:rgba(148,163,184,.18);font-weight:800;font-size:.95rem;padding:0;border:1px solid rgba(148,163,184,.4)!important;transition:transform .12s,background .12s}
.sw-cn button.hv{background:#f59e0b;color:#1a1204;transform:scale(1.18);border-color:#f59e0b!important}
@keyframes swPop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}
/* split screen: when a notes pop-up is open together with the widget, the notes take the top part and the widget the bottom part */
html.swsplit #mdl{padding-bottom:calc(var(--swh,0px) + 26px + env(safe-area-inset-bottom,0px))}
html.swsplit #mdl .mbox{max-height:calc(100vh - 40px - var(--swh,0px) - env(safe-area-inset-bottom,0px));max-height:calc(100dvh - 40px - var(--swh,0px) - env(safe-area-inset-bottom,0px))}
.sw-rs{position:absolute;top:3px;left:50%;transform:translateX(-50%);z-index:4;width:20px;height:20px;border-radius:50%;padding:0;background:rgba(148,163,184,.28);display:flex;align-items:center;justify-content:center;opacity:.35;transition:opacity .2s}
.sw-rs.act{opacity:1}
.sw-rs svg{display:block}
.sw-sm:disabled{opacity:.35;cursor:not-allowed}
.sw-sm.on{background:#f59e0b;color:#1a1204;border-color:#f59e0b!important}
.sw-pp{position:absolute;z-index:6;padding:10px;border-radius:16px;background:rgba(15,23,42,.98);border:1px solid rgba(148,163,184,.35);box-shadow:0 10px 30px rgba(0,0,0,.55);animation:swPop .16s ease-out}
body.light-theme .sw-pp{background:#fff;border-color:rgba(15,23,42,.2)}
.sw-pp .pr{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.sw-pp .pr+.pr{margin-top:10px}
.sw-pp .pl{flex:0 0 100%;font-size:.66rem;font-weight:700;opacity:.7}
.sw-pp .ch{min-width:44px;height:32px;padding:0 12px;border-radius:999px;background:rgba(148,163,184,.18);border:1px solid rgba(148,163,184,.4)!important;font-weight:700;font-size:.78rem}
.sw-pp .ch.on{background:#f59e0b;color:#1a1204;border-color:#f59e0b!important}
.sw-pp .ch:disabled{opacity:.35;cursor:not-allowed}`;
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
        '<div class="sw-tk" data-t="y"><span class="sw-tl" data-lb="y"></span><span class="sw-tt" data-tm="y">0:00 / 0:00</span><canvas></canvas><button type="button" class="sw-rs" aria-label="Reset"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12H3M6.5 8.5L3 12l3.5 3.5M14 12h7M17.5 8.5L21 12l-3.5 3.5"/></svg></button><i class="sw-dm l"></i><i class="sw-dm r"></i><i class="sw-hn l"></i><i class="sw-hn r"></i><i class="sw-ph"></i></div>' +
        '<button type="button" class="sw-ic sw-mic" data-mic aria-label="Record"></button>' +
        '<div class="sw-r2"><button type="button" class="sw-yp" data-yp aria-label="Play yours" disabled><i class="fa-solid fa-play" data-ic></i><b class="sw-bd" hidden></b></button></div>' +
        '<button type="button" class="sw-ic sw-play" data-n="1" aria-label="Play"><i class="fa-solid fa-play" data-ic></i><b class="sw-bd" hidden></b></button>' +
        '<div class="sw-tk" data-t="o"><span class="sw-tl" data-lb="o"></span><span class="sw-tt" data-tm="o">0:00 / 0:00</span><canvas></canvas><button type="button" class="sw-rs" aria-label="Reset"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12H3M6.5 8.5L3 12l3.5 3.5M14 12h7M17.5 8.5L21 12l-3.5 3.5"/></svg></button><i class="sw-dm l"></i><i class="sw-dm r"></i><i class="sw-hn l"></i><i class="sw-hn r"></i><i class="sw-ph"></i></div>' +
        '<span></span>' +
        '<div class="sw-r4"><button type="button" class="sw-sm" data-dl aria-label="Download"><i class="fa-solid fa-download"></i></button><button type="button" class="sw-sm" data-spd aria-label="Speed"><i class="fa-solid fa-bolt"></i></button></div>' +
      '</div>' +
      '<div class="sw-msg" data-msg hidden></div>' +
      '<div class="sw-ov" data-ov hidden><div class="sw-big" data-big></div><div class="sw-ot" data-ot></div><div class="sw-lv"><i data-lv></i></div><div class="sw-tm" data-rt></div><div class="sw-ob" data-ob></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { e.stopPropagation(); if (!e.target.closest('button,.sw-tk,.sw-bd,.sw-pp')) stopAll(); });   // taps inside never reach the feed's handler; an empty spot stops the sound
    el.addEventListener('pointerdown', function (e) { if (PP && !PP.el.contains(e.target) && !e.target.closest('[data-dl],[data-spd]')) closePP(); });
    q('[data-x]').onclick = close;
    q('[data-word]').onclick = function () { if (!S.urls) return; run(1, 'orig'); };
    attachCount(q('[data-n]'), 'o', function () { onPlay(S.cnt.o); });
    attachCount(q('[data-yp]'), 'y', onYours);
    q('[data-cmp]').onclick = onCompare;
    q('[data-mic]').onclick = startRec;
    q('[data-cp]').onclick = onCopy;
    ['o', 'y'].forEach(function (w) {
      TK(w).addEventListener('click', function (e) { if (e.target.closest('.sw-hn,.sw-rs')) return; seekTrack(w, e); });
      attachTrim(w);
      TK(w).querySelector('.sw-rs').onclick = function (e) { e.stopPropagation(); stopAll(); S.trim[w] = [0, 1]; applyTrim(w); };   // both handles back to the far ends
    });
    q('[data-dl]').onclick = openDl; q('[data-spd]').onclick = openSpd;
    requestAnimationFrame(function () { draw('o'); draw('y'); });
    watchSplit();
    return el;
  }
  function msg(t) { var m = q('[data-msg]'); if (!m) return; m.textContent = t || ''; m.hidden = !t; }
  function paint() {
    if (!el) return; var t = L(), ok = !!S.urls;
    q('[data-word]').textContent = S.word; q('[data-word]').disabled = !ok;
    var ar = q('[data-ar]'); ar.hidden = !S.ar; q('[data-artxt]').textContent = S.ar || '';
    q('[data-lb="o"]').textContent = t.orig; q('[data-lb="y"]').textContent = t.you;
    var playing = function (m) { return S.mode === m && S.act > 0; };
    var bd = function (b, v) { var x = b.querySelector('.sw-bd'); x.hidden = !(v > 1); x.textContent = v; };
    var pl = q('[data-n]'); pl.disabled = !ok; pl.querySelector('[data-ic]').className = 'fa-solid ' + (playing('orig') ? 'fa-stop' : 'fa-play'); pl.classList.toggle('on', playing('orig')); bd(pl, S.cnt.o);
    var c = q('[data-cmp]'); c.disabled = !ok || !S.rec; c.classList.toggle('on', playing('cmp'));
    var y = q('[data-yp]'); y.disabled = !S.rec; y.querySelector('[data-ic]').className = 'fa-solid ' + (playing('you') ? 'fa-stop' : 'fa-play'); y.classList.toggle('on', playing('you')); bd(y, S.cnt.y);
    applyTrim('o'); applyTrim('y');
    q('[data-dl]').disabled = !S.urls && !S.rec;
    q('[data-spd]').classList.toggle('on', S.cfg.speed !== 1 || S.cfg.wait !== 0.5);
  }

  /* ---------- copy the Arabic translation ---------- */
  function onCopy() {
    var b = q('[data-cp]'), txt = S.ar || ''; if (!txt) return;
    var done = function () { b.classList.add('done'); b.innerHTML = '<i class="fa-solid fa-check"></i>'; setTimeout(function () { if (b.isConnected) { b.classList.remove('done'); b.innerHTML = '<i class="fa-regular fa-copy"></i>'; } }, 1300); };
    var old = function () { var t = document.createElement('textarea'); t.value = txt; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove(); done(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, old); else old();
  }
  /* Arabic translation of the word, from Supabase words_table.
     The column is found automatically (a column whose value is Arabic text). If the console says it could not be found,
     write the exact column name here, e.g.  var AR_COL = 'translation';  */
  var AR_COL = '';
  var AR = { col: null }, AR_SKIP = /^(id|word|word_key|audio_url|created_at|updated_at)$/i, AR_NAME = /arab|transl|mean|^ar(_|$)|_ar$/i;
  var AR_GUESS = ['translation', 'arabic', 'ar', 'meaning', 'arabic_translation', 'translation_ar', 'ar_translation', 'arabic_meaning', 'meaning_ar', 'word_ar', 'arabic_word', 'ar_meaning'];
  var isAr = function (v) { return typeof v === 'string' && /[\u0600-\u06FF]/.test(v); };
  async function sb(qs) {
    try {
      var r = await fetch(SB + '/rest/v1/words_table?' + qs, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
      return { ok: r.ok, status: r.status, body: r.ok ? await r.json() : null };
    } catch (e) { return { ok: false, status: 0, body: null }; }
  }
  async function arCol() {   // once per page load
    if (AR.col !== null) return AR.col;
    if (AR_COL) return (AR.col = AR_COL);
    var r = await sb('select=*&limit=30'), rows = r.ok && Array.isArray(r.body) ? r.body : [], i, j, ks;
    for (i = 0; i < rows.length; i++) { ks = Object.keys(rows[i]); for (j = 0; j < ks.length; j++) if (!AR_SKIP.test(ks[j]) && !/url/i.test(ks[j]) && isAr(rows[i][ks[j]])) return (AR.col = ks[j]); }
    if (rows[0]) {
      var k0 = Object.keys(rows[0]).find(function (k) { return AR_NAME.test(k) && !AR_SKIP.test(k); });
      if (k0) return (AR.col = k0);
      console.info('[smart widget] words_table columns:', Object.keys(rows[0]));
    }
    for (i = 0; i < AR_GUESS.length; i++) { var p = await sb('select=' + AR_GUESS[i] + '&limit=1'); if (p.ok) return (AR.col = AR_GUESS[i]); }   // select=* may be blocked: try likely names one by one
    console.warn('[smart widget] could not find the Arabic column in words_table (select=* answered ' + r.status + '). Write its name in AR_COL (search for "var AR_COL" in dashboardsmartwidget.js).');
    return (AR.col = '');
  }
  async function arOne(col, word) {
    var c = wpClean(word); if (!c) return '';
    var qs = ['word_key=eq.' + encodeURIComponent(c), 'word=ilike.' + encodeURIComponent(String(word).trim().replace(/[\\%_]/g, function (m) { return '\\' + m; }))], i, k;
    for (k = 0; k < qs.length; k++) {
      var r = await sb('select=' + encodeURIComponent(col) + '&limit=5&' + qs[k]), rows = r.ok && Array.isArray(r.body) ? r.body : [];
      for (i = 0; i < rows.length; i++) if (isAr(rows[i][col])) return rows[i][col].trim();
    }
    return '';
  }
  async function getAr(word) {
    var col = await arCol(); if (!col) return '';
    var v = await arOne(col, word); if (v) return v;
    var parts = String(word).split(/[,\u060C\n]+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (parts.length < 2) return '';
    var all = await Promise.all(parts.map(function (x) { return arOne(col, x); }));
    return all.every(Boolean) ? all.join(' \u060C ') : '';
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
      if (my === S.ld) { S.peaks.o = all; S.total = total; S.durs = parts.map(function (b) { return b.duration; }); S.pcmO = parts.map(function (b) { return { d: b.getChannelData(0), sr: b.sampleRate }; }); }
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
  function clip(url, my, w, off, sg) {
    return new Promise(function (res) {
      if (my !== S.tk) return res();
      sg = sg || {};
      var a = new Audio(), iv = null, done = false, s = 0, e = Infinity;
      a.preload = 'auto'; S.audio = a; S.aw = w;
      var fin = function () { if (done) return; done = true; clearInterval(iv); res(); };
      var tick = function () {
        if (S.audio !== a || !el) return;
        var d = isFinite(a.duration) ? a.duration : 0, other = w === 'o' ? 'y' : 'o';
        if (S.prog[other]) { S.prog[other] = 0; var ob = TK(other); ob.querySelector('.sw-ph').style.display = 'none'; draw(other); }
        var tot = w === 'o' ? (S.total || d) : (S.yDur || d);
        mark(w, off + a.currentTime, tot);
      };
      /* only the selected part (between the two handles) is played */
      a.onloadedmetadata = function () {
        if (done || S.audio !== a || my !== S.tk) { fin(); return; }
        var d = a.duration;
        if (sg.fr && isFinite(d)) { s = sg.fr[0] * d; e = sg.fr[1] * d; } else { if (sg.s != null) s = sg.s; if (sg.e != null) e = sg.e; }
        if (s > 0.01) { try { a.currentTime = s; } catch (x) {} }
        if (w === 'o') { a.playbackRate = S.cfg.speed; try { a.preservesPitch = true; a.webkitPreservesPitch = true; a.mozPreservesPitch = true; } catch (x) {} }   // voice speed applies to the original only
        tick(); a.play().catch(fin);
        iv = setInterval(function () {
          if (S.audio !== a || my !== S.tk) { fin(); return; }
          tick(); if (a.currentTime >= e - 0.02) { a.pause(); fin(); }
        }, 30);
      };
      a.onended = fin; a.onerror = fin;
      a.src = url;
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
        var sg = segs();
        for (var k = 0; k < sg.length; k++) {
          await clip(sg[k].url, my, 'o', sg[k].off, sg[k]); if (my !== S.tk) return;
          if (k < sg.length - 1) await sleep(300);
        }
      }
      if (mode === 'cmp') { await sleep(S.cfg.wait * 1000); if (my !== S.tk) return; }
      if (mode === 'cmp' || mode === 'you') { await clip(S.rec.url, my, 'y', 0, { fr: S.trim.y }); if (my !== S.tk) return; }
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
    run(S.cnt.y, 'you');
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
    var t = L(); stopAll(); msg(''); closePP();
    var tr = S.trim.y, part = (S.rec && S.rec.pcm && (tr[0] > .001 || tr[1] < .999)) ? { a: tr[0], b: tr[1], old: S.rec.pcm } : null;   // a part is selected on YOU: only that part is re-recorded
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
      ov('go', '', part ? t.part : t.go, true);
      var rt = q('[data-rt]'), iv = setInterval(function () { rt.textContent = tf((performance.now() - goAt) / 1000); }, 250);
      var auto = setTimeout(stopNow, 20000);
      await stopped; clearInterval(iv); clearTimeout(auto);
    } else { stopNow(); await stopped; }
    var endAt = performance.now();
    if (!S.abort) await beep(ctx, false);                // end tone, after the recorder has already stopped
    finish(); S.recording = false; q('[data-ov]').hidden = true;
    if (S.abort) return;

    /* 3) cut everything before GO (and the tap sound at the end) */
    var blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' }), url = null, secs = 0, pcm = null;
    try {
      var ctx2 = new AC(), ab = await blob.arrayBuffer();
      var buf = await new Promise(function (res, rej) { var p = ctx2.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
      var from = Math.max(0, (goAt - t0) / 1000 - 0.05), to = Math.max(from, buf.duration - 0.12);
      secs = to - from;
      if (secs >= 0.25) pcm = { d: buf.getChannelData(0).slice(Math.floor(from * buf.sampleRate), Math.floor(to * buf.sampleRate)), sr: buf.sampleRate };
      try { ctx2.close(); } catch (e) {}
    } catch (e) { url = URL.createObjectURL(blob); secs = (endAt - goAt) / 1000; }   // cannot decode here: keep it untrimmed
    var span = null;
    if (pcm && part) { var mg = joinPart(part.old, pcm, part.a, part.b); pcm = mg.pcm; span = mg.span; }   // the new take replaces ONLY the selected part
    if (pcm) url = URL.createObjectURL(pcmWav(pcm));
    if (!url) { msg(t.silent); return; }
    if (S.recs[S.key] && S.recs[S.key].url) { try { URL.revokeObjectURL(S.recs[S.key].url); } catch (e) {} }
    S.rec = S.recs[S.key] = { url: url, pcm: pcm }; S.trim.y = span || [0, 1]; paint();   // the handles stay around the part that was just recorded
    loadYou(url);
    var cb = q('[data-cmp]'); cb.classList.remove('pulse'); void cb.offsetWidth; cb.classList.add('pulse');
  }

  /* ---------- long press on a play button: 2 / 3 / 5 repeats ---------- */
  function attachCount(btn, key, act) {
    var lp = null, pop = null, st = null;
    var closePop = function () { if (pop) { pop.remove(); pop = null; } st = null; };
    var choose = function (v) { S.cnt[key] = v; closePop(); paint(); };
    var hover = function (e) {
      var hv = 0; if (!pop) return 0;
      pop.querySelectorAll('button').forEach(function (b) {
        var r = b.getBoundingClientRect(), on = e.clientX > r.left - 6 && e.clientX < r.right + 6 && e.clientY > r.top - 14 && e.clientY < r.bottom + 14;
        b.classList.toggle('hv', on); if (on) hv = +b.dataset.v;
      });
      return hv;
    };
    var openPop = function () {
      if (!st || btn.disabled) return;
      st.open = true; S.swallow = true; try { navigator.vibrate && navigator.vibrate(12); } catch (x) {}
      pop = document.createElement('div'); pop.className = 'sw-cn';
      pop.innerHTML = [2, 3, 5].map(function (v) { return '<button type="button" data-v="' + v + '">' + v + '</button>'; }).join('');
      var sr = el.getBoundingClientRect(), br = btn.getBoundingClientRect();
      pop.style.left = (br.right - sr.left + 8) + 'px'; pop.style.top = (br.top - sr.top + br.height / 2 - 25) + 'px';
      pop.querySelectorAll('button').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); choose(+b.dataset.v); }; });
      el.appendChild(pop);
      try { btn.setPointerCapture(st.id); } catch (x) {}
    };
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    btn.addEventListener('pointerdown', function (e) {
      if (btn.disabled || e.button > 0) return;
      if (e.target.closest('.sw-bd')) return;
      closePop(); st = { x: e.clientX, y: e.clientY, id: e.pointerId, open: false, hv: 0 };
      clearTimeout(lp); lp = setTimeout(openPop, 450);
    });
    btn.addEventListener('pointermove', function (e) {
      if (!st) return;
      if (!st.open) { if (Math.hypot(e.clientX - st.x, e.clientY - st.y) > 10) { clearTimeout(lp); st = null; } return; }
      st.hv = hover(e);
    });
    var up = function (e) {
      clearTimeout(lp); if (!st) return;
      var s = st; st = s.open ? s : null;
      if (s.open) {
        if (e.type === 'pointerup' && s.hv) choose(s.hv);         // finger slid onto a number and lifted: that is the choice
        setTimeout(function () { S.swallow = false; }, 500);     // the click that follows a long press must not play
      }
    };
    btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up);
    var last = 0;
    btn.onclick = function () {
      if (S.swallow) { S.swallow = false; return; }
      var now = Date.now();
      if (S.cnt[key] > 1 && now - last < 400) { last = 0; S.cnt[key] = 1; stopAll(); return; }   // two quick taps: back to once
      last = now; act();
    };
    btn.querySelector('.sw-bd').onclick = function (e) { e.stopPropagation(); S.cnt[key] = 1; paint(); };   // tap the little number to go back to once
    el.addEventListener('pointerdown', function (e) { if (pop && !pop.contains(e.target) && !btn.contains(e.target)) closePop(); });
  }

  /* ---------- trim handles: only the part between them plays ---------- */
  function segs() {   // pieces of the ORIGINAL to play, inside the selection
    var A = S.trim.o[0], B = S.trim.o[1];
    if (S.urls.length === 1) return [{ url: S.urls[0], off: 0, fr: [A, B] }];
    var durs = S.durs && S.durs.length === S.urls.length ? S.durs : null;
    if (!durs) return S.urls.map(function (u) { return { url: u, off: 0 }; });     // lengths unknown: play everything
    var tot = durs.reduce(function (a, b) { return a + b; }, 0), off = 0, out = [];
    S.urls.forEach(function (u, k) {
      var d = durs[k], s = Math.max(0, A * tot - off), e = Math.min(d, B * tot - off);
      if (e - s > 0.03) out.push({ url: u, off: off, s: s, e: e });
      off += d;
    });
    return out.length ? out : S.urls.map(function (u) { return { url: u, off: 0 }; });
  }
  function applyTrim(w) {
    if (!el) return; var box = TK(w); if (!box) return; var t = S.trim[w], on = !!S.peaks[w];
    box.querySelector('.sw-hn.l').style.left = (t[0] * 100) + '%';
    box.querySelector('.sw-hn.r').style.left = 'calc(' + (t[1] * 100) + '% - 10px)';
    var dl = box.querySelector('.sw-dm.l'), dr = box.querySelector('.sw-dm.r');
    dl.style.left = '0'; dl.style.width = (t[0] * 100) + '%'; dr.style.left = (t[1] * 100) + '%'; dr.style.width = ((1 - t[1]) * 100) + '%';
    box.querySelectorAll('.sw-hn').forEach(function (h) { h.style.opacity = on ? 1 : .45; });
    box.querySelector('.sw-rs').classList.toggle('act', t[0] > .001 || t[1] < .999);
  }
  function attachTrim(w) {
    var box = TK(w), GAP = 0.04;
    box.querySelectorAll('.sw-hn').forEach(function (h) {
      var isL = h.classList.contains('l'), d = null;
      h.addEventListener('pointerdown', function (e) {
        if (!S.peaks[w]) return;
        e.preventDefault(); e.stopPropagation(); stopAll();
        d = { moved: false, a: S.trim[w][0], b: S.trim[w][1] };
        try { h.setPointerCapture(e.pointerId); } catch (x) {}
      });
      h.addEventListener('pointermove', function (e) {
        if (!d) return;
        var r = box.getBoundingClientRect(), f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), t = S.trim[w];
        if (isL) t[0] = Math.min(f, t[1] - GAP); else t[1] = Math.max(f, t[0] + GAP);
        if (t[0] !== d.a || t[1] !== d.b) d.moved = true;
        applyTrim(w);
      });
      var up = function (e) {
        if (!d) return; var m = d.moved; d = null;
        if (m && e.type === 'pointerup') run(1, w === 'o' ? 'orig' : 'you');       // let go of a handle: the selected part plays by itself
      };
      h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
    });
  }

  /* ---------- audio helpers ---------- */
  function pcmWav(p) { return wav({ sampleRate: p.sr, getChannelData: function () { return p.d; } }, 0, p.d.length / p.sr); }
  function resamp(d, from, to) {
    if (from === to) return d;
    var n = Math.round(d.length * to / from), o = new Float32Array(n), r = from / to, i;
    for (i = 0; i < n; i++) { var x = i * r, k = Math.floor(x), f = x - k, a = d[k] || 0, b = d[k + 1] != null ? d[k + 1] : a; o[i] = a + (b - a) * f; }
    return o;
  }
  /* new take `nw` replaces the part [a, b] (fractions) of the old recording; the rest of the old recording stays exactly as it was */
  function joinPart(old, nw, a, b) {
    var sr = old.sr, nd = resamp(nw.d, nw.sr, sr).slice(), L0 = old.d.length, ia = Math.floor(a * L0), ib = Math.floor(b * L0), f = Math.min(Math.floor(sr * 0.005), nd.length >> 1), i;
    for (i = 0; i < f; i++) { var g = i / f; nd[i] *= g; nd[nd.length - 1 - i] *= g; }      // 5 ms fades so the joins do not click
    var out = new Float32Array(ia + nd.length + (L0 - ib));
    out.set(old.d.subarray(0, ia), 0); out.set(nd, ia); out.set(old.d.subarray(ib), ia + nd.length);
    return { pcm: { d: out, sr: sr }, span: [ia / out.length, (ia + nd.length) / out.length] };
  }
  function stretch(x, sr, rate) {   // change the speed without changing the pitch (WSOLA)
    if (Math.abs(rate - 1) < 0.01 || x.length < 4096) return x;
    var N = Math.round(sr * 0.04); N -= N % 2;
    var Hs = N / 2, Ha = Hs * rate, tol = Math.round(N / 4), i, d, oi;
    var outLen = Math.ceil(x.length / rate) + N, y = new Float32Array(outLen), w = new Float32Array(outLen), win = new Float32Array(N), prev = -1;
    for (i = 0; i < N; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    for (oi = 0; ; oi++) {
      var o = oi * Hs; if (o + N > outLen) break;
      var tgt = Math.round(oi * Ha), best = tgt; if (tgt + N > x.length) break;
      if (oi > 0 && prev >= 0) {
        var ref = prev + Hs, bc = -Infinity;
        if (ref + Hs <= x.length) {
          for (d = -tol; d <= tol; d += 2) {
            var p = tgt + d; if (p < 0 || p + Hs > x.length) continue;
            var c = 0; for (i = 0; i < Hs; i += 4) c += x[ref + i] * x[p + i];
            if (c > bc) { bc = c; best = p; }
          }
        }
      }
      if (best + N > x.length) best = x.length - N;
      for (i = 0; i < N; i++) { y[o + i] += x[best + i] * win[i]; w[o + i] += win[i]; }
      prev = best;
    }
    var n = Math.min(outLen, Math.floor(x.length / rate)), out = new Float32Array(n);
    for (i = 0; i < n; i++) out[i] = w[i] > 1e-3 ? y[i] / w[i] : 0;
    return out;
  }

  /* ---------- settings: voice speed + wait between (saved on this device, applied at once) ---------- */
  function cfgLoad() {
    var o = { speed: 1, wait: 0.5 };
    try { var j = JSON.parse(localStorage.getItem(CFG_KEY) || 'null'); if (j && SPEEDS.indexOf(+j.speed) > -1) o.speed = +j.speed; if (j && WAITS.indexOf(+j.wait) > -1) o.wait = +j.wait; } catch (e) {}
    return o;
  }
  function cfgSave() { try { localStorage.setItem(CFG_KEY, JSON.stringify(S.cfg)); } catch (e) {} }

  /* ---------- small pop-up above the bottom buttons (download choices / speed) ---------- */
  var PP = null;
  function closePP() { if (PP) { PP.el.remove(); PP = null; } }
  function openPP(kind, btn, html, wire) {
    if (PP && PP.kind === kind) { closePP(); return; }
    closePP();
    var p = document.createElement('div'); p.className = 'sw-pp'; p.innerHTML = html; el.appendChild(p);
    var sr = el.getBoundingClientRect(), br = btn.getBoundingClientRect();
    p.style.left = Math.max(8, Math.min(br.left - sr.left, sr.width - p.offsetWidth - 8)) + 'px'; p.style.bottom = (sr.bottom - br.top + 8) + 'px';
    PP = { kind: kind, el: p }; wire(p);
  }
  function openDl() {
    var t = L(), b = function (k, lab, on) { return '<button type="button" class="ch" data-k="' + k + '"' + (on ? '' : ' disabled') + '>' + H(lab) + '</button>'; };
    openPP('dl', q('[data-dl]'), '<div class="pr">' + b('o', t.dlO, !!S.urls) + b('y', t.dlY, !!S.rec) + b('c', t.dlC, !!(S.urls && S.rec)) + '</div>', function (p) {
      p.querySelectorAll('.ch').forEach(function (x) { x.onclick = function (e) { e.stopPropagation(); closePP(); download(x.dataset.k); }; });
    });
  }
  function openSpd() {
    var t = L(), c = S.cfg;
    var row = function (lab, key, list, cur, fmt) { return '<div class="pr"><div class="pl">' + H(lab) + '</div>' + list.map(function (v) { return '<button type="button" class="ch' + (v === cur ? ' on' : '') + '" data-key="' + key + '" data-v="' + v + '">' + fmt(v) + '</button>'; }).join('') + '</div>'; };
    openPP('spd', q('[data-spd]'), row(t.spd, 'speed', SPEEDS, c.speed, function (v) { return v + '×'; }) + row(t.wt, 'wait', WAITS, c.wait, function (v) { return v + t.unit; }), function (p) {
      p.querySelectorAll('.ch').forEach(function (x) {
        x.onclick = function (e) {
          e.stopPropagation(); S.cfg[x.dataset.key] = +x.dataset.v; cfgSave();
          p.querySelectorAll('.ch[data-key="' + x.dataset.key + '"]').forEach(function (z) { z.classList.toggle('on', z === x); });
          if (S.audio && S.aw === 'o' && x.dataset.key === 'speed') S.audio.playbackRate = S.cfg.speed;     // also changes what is playing right now
          paint();
        };
      });
    });
  }

  /* ---------- download: the selected parts, with the chosen speed / wait applied ---------- */
  function origPcm() {   // selected part of the original as one buffer, at the chosen speed
    var P = S.pcmO; if (!P || !S.urls || P.length !== S.urls.length) return null;
    var A = S.trim.o[0], B = S.trim.o[1], sr = P[0].sr, tot = 0, off = 0, parts = [], n = 0, pos = 0;
    P.forEach(function (p) { tot += p.d.length / p.sr; });
    P.forEach(function (p) {
      var dur = p.d.length / p.sr, s = Math.max(0, A * tot - off), e = Math.min(dur, B * tot - off);
      if (e - s > 0.03) parts.push(resamp(p.d.subarray(Math.floor(s * p.sr), Math.floor(e * p.sr)), p.sr, sr));
      off += dur;
    });
    if (!parts.length) return null;
    var gap = Math.round(sr * 0.3);
    parts.forEach(function (x, k) { n += x.length + (k ? gap : 0); });
    var all = new Float32Array(n);
    parts.forEach(function (x, k) { if (k) pos += gap; all.set(x, pos); pos += x.length; });
    return { d: stretch(all, sr, S.cfg.speed), sr: sr };
  }
  function yourPcm() {   // selected part of your recording
    var p = S.rec && S.rec.pcm; if (!p) return null;
    var a = Math.floor(S.trim.y[0] * p.d.length), b = Math.max(a + 1, Math.floor(S.trim.y[1] * p.d.length));
    return { d: p.d.subarray(a, b), sr: p.sr };
  }
  function saveBlob(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 8000);
  }
  async function download(kind) {
    var t = L(), nm = (S.word.replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 40) || 'word'), my = S.ld;
    try { itToast(t.dlBusy); } catch (e) {}
    await sleep(40);
    try {
      var o = kind !== 'y' ? origPcm() : null, y = kind !== 'o' ? yourPcm() : null;
      if (kind === 'o') {
        if (o) saveBlob(pcmWav(o), nm + '-original.wav');
        else if (S.urls && S.urls[0]) { var a = document.createElement('a'); a.href = S.urls[0]; a.download = nm + '-original'; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }   // cannot decode it here: the plain file
        else throw new Error('no audio');
      } else if (kind === 'y') {
        if (y) saveBlob(pcmWav(y), nm + '-you.wav');
        else if (S.rec) saveBlob(await (await fetch(S.rec.url)).blob(), nm + '-you.webm');
        else throw new Error('no recording');
      } else {
        if (!o || !y) throw new Error('missing part');
        var yy = resamp(y.d, y.sr, o.sr), gap = Math.round(o.sr * S.cfg.wait), out = new Float32Array(o.d.length + gap + yy.length);
        out.set(o.d, 0); out.set(yy, o.d.length + gap);
        saveBlob(pcmWav({ d: out, sr: o.sr }), nm + '-compare.wav');
      }
    } catch (e) { console.warn('[smart widget] download failed', e); try { itToast(t.dlFail); } catch (x) {} }
  }

  /* ---------- split screen with the notes pop-up ---------- */
  var SPLIT = { ro: null, mo: null };
  function syncSplit() {
    var m = document.getElementById('mdl'), on = !!(el && m && m.classList.contains('open')), r = document.documentElement;
    if (on) r.style.setProperty('--swh', el.getBoundingClientRect().height + 'px');
    r.classList.toggle('swsplit', on);
  }
  function watchSplit() {
    var m = document.getElementById('mdl');
    if (m && !SPLIT.mo) { SPLIT.mo = new MutationObserver(syncSplit); SPLIT.mo.observe(m, { attributes: true, attributeFilter: ['class'] }); }
    if (window.ResizeObserver) { if (SPLIT.ro) SPLIT.ro.disconnect(); SPLIT.ro = new ResizeObserver(syncSplit); SPLIT.ro.observe(el); }
    syncSplit();
  }

  /* ---------- open / close ---------- */
  function close() {
    if (S.recording) { S.abort = true; var m = q('[data-ob] [data-cancel]'); if (m) m.click(); }
    S.ld++; stopAll(); PP = null; if (el) { el.remove(); el = null; }
    if (SPLIT.ro) SPLIT.ro.disconnect(); syncSplit();
  }
  window.wpOpen = async function (word) {
    word = String(word == null ? '' : word).trim(); if (!word) return;
    if (S.recording) return;
    try { if (window.ThabitRichStudent) ThabitRichStudent.stop(); } catch (e) {}
    try { wpClose(); } catch (e) {}                                // the old player, if it is somehow open
    stopAll(); ensure(); closePP();
    S.word = word; S.key = wpClean(word); S.urls = null; S.ar = ''; S.rec = S.recs[S.key] || null;
    S.peaks = { o: null, y: null }; S.prog = { o: 0, y: 0 }; S.total = 0; S.yDur = 0; S.durs = null; S.pcmO = null; S.trim = { o: [0, 1], y: [0, 1] }; msg('');
    resetTracks(); paint();
    if (S.rec) loadYou(S.rec.url);
    var my = ++S.ld, urls = null, err = '';
    getAr(word).then(function (a) { if (my === S.ld && el) { S.ar = a; paint(); } }).catch(function (e) { console.warn('[smart widget] translation lookup failed', e); });
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
    e.stopPropagation(); e.preventDefault();
    if (document.documentElement.classList.contains('swsplit') && t.closest && t.closest('#mdl .mbox')) { stopAll(); return; }   // tapping the notes beside the widget only stops the sound
    close();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el && !S.recording) close(); });
  window.addEventListener('resize', function () { if (el) { draw('o'); draw('y'); } });
})();
