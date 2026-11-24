/* =====================================================================
   SIDEBAR BUTTON: mirror
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + غرفة المماراة كلها + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-mirror.js"></script>
   و index.html بينده عليه بـ thx = كل الأدوات المشتركة اللي بيدّيها index.html (R, W, L, STR, esc, MOD, openLayer ...)
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.mirror = function (thx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<rect x="5.5" y="2.5" width="13" height="16" rx="6.5"/><path d="M9.5 7c.8-.8 1.7-1.2 2.7-1.2M12 18.5V21M8.5 21.5h7"/>';
    thx.IC.mirror = ICON;
    thx.STR.en.i_mirror = 'Mirroring Room'; thx.STR.ar.i_mirror = 'غرفة المماراة';

    /* ---- the screen: الكود اتنقل من index.html زي ما هو (غرفة المماراة) ---- */
/* ================= Mirror Room (غرفة المماراة) ================= */
  let mirStop = () => { };
let mirWarned = false;   /* kept in memory only: a refresh or a log out brings the warning back */

  const MT = {
    ar: { wT: 'تنبيه هام', wP: 'ارتدِ سماعة الرأس قبل استخدام غرفة المماراة. لا تستخدم هذه الأداة من غير سماعة، وتأكد أنك لابس السماعة فعلًا وأنك جالس في مكان هادئ.', wTap: 'اضغط في أي مكان للمتابعة',
      start: 'لنبدأ', stop: 'لنتوقف هنا', armed: 'اضغط «لنبدأ» للبدء', listen: 'تحدّث… سأعيد كلامك بعد أن تصمت', hear: 'أسمعك…', echo: 'صدى صوتك', pending: 'جلسة معلقة رقم {n} — اضغط «لنبدأ» لإكمالها',
      tr: 'النص المكتوب', ph: 'اكتب هنا، أو فعّل «النص المكتوب» ليُكتب كلامك هنا…', sess: 'جلسة مماراة رقم', saved: 'تم حفظ الجلسة', dl: 'تحميل', dlt: 'تحميل النص', prev: 'الجلسات السابقة',
      noSr: 'النص المكتوب غير مدعوم في هذا المتصفح، يمكنك الكتابة يدويًا.', micDenied: 'لم يُسمح باستخدام الميكروفون.', srErr: 'تعذّر التعرف على الكلام', lang: 'لغة النص', copy: 'نسخ', share: 'مشاركة', dltx: 'تحميل', copied: 'تم النسخ', save: 'حفظ الجلسة', trial: 'جلسة تجريبية — لم تُحفظ' },
    en: { wT: 'Important notice', wP: 'Put on your headphones before using the Mirror Room. Do not use this tool without headphones, make sure you are really wearing them, and that you are sitting somewhere quiet.', wTap: 'Tap anywhere to continue',
      start: 'Let\'s start', stop: 'Let\'s stop here', armed: 'Press "Let\'s start" to begin', listen: 'Speak... I will repeat you when you pause', hear: 'Listening...', echo: 'Your voice echo', pending: 'Unfinished session #{n} - press "Let\'s start" to continue it',
      tr: 'Transcript', ph: 'Write here, or turn on Transcript to have your speech written here...', sess: 'Mirror session #', saved: 'Session saved', dl: 'Download', dlt: 'Download text', prev: 'Previous sessions',
      noSr: 'The transcript is not supported in this browser, you can type it by hand.', micDenied: 'Microphone access was not allowed.', srErr: 'Speech recognition problem', lang: 'Text language', copy: 'Copy', share: 'Share', dltx: 'Download', copied: 'Copied', save: 'Save session', trial: 'Practice session - not saved' }
  };
function uKey() { const u = (thx.cfg.getUser && thx.cfg.getUser()) || {}; return u.username || u.email || u.name || 'guest'; }
function mirFlag() { return 'thMirOpen:' + uKey(); }
function mirIsOpen() { try { return !!localStorage.getItem(mirFlag()); } catch (e) { return false; } }
const mirDb = {
    db: null,
    open() { return new Promise((res, rej) => { if (this.db) return res(this.db); try { const r = indexedDB.open('thMirror', 1); r.onupgradeneeded = () => { r.result.createObjectStore('s', { keyPath: 'id' }); }; r.onsuccess = () => { this.db = r.result; res(this.db); }; r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); },
    all(user) { return this.open().then(db => new Promise((res, rej) => { const q = db.transaction('s').objectStore('s').getAll(); q.onsuccess = () => res((q.result || []).filter(x => x.user === user)); q.onerror = () => rej(q.error); })).catch(() => []); },
    del(id) { return this.open().then(db => new Promise(res => { const tx = db.transaction('s', 'readwrite'); tx.objectStore('s').delete(id); tx.oncomplete = () => res(true); tx.onerror = () => res(false); })).catch(() => false); },
    put(rec) { return this.open().then(db => new Promise((res, rej) => { const tx = db.transaction('s', 'readwrite'); tx.objectStore('s').put(rec); tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); })).catch(() => false); }
  };
function mirCss() {
    if (thx.R.getElementById('thMirCss')) return;
    const st = document.createElement('style'); st.id = 'thMirCss';
    st.textContent = `
      .sdi.hm{margin:0 6px 6px}
      .sdi[data-k="messenger"]{display:none}
      @media(min-width:1180px){.sdi[data-k="messenger"]{display:flex}}
      .sdh{margin:3px 14px 6px;font-size:15px}
      .sdg{font:700 12.5px Cairo,Inter,sans-serif;color:var(--ink2);margin:16px 14px 6px}
      #W{--sbh:rgba(255,255,255,.07)}#W.light{--sbh:rgba(28,26,22,.06)}
      .sdi{width:calc(100% - 12px);height:44px;margin:0 6px 6px;font-size:14.6px;transition:background .35s,scale .9s var(--ease),translate .9s var(--ease)}
      .sdi:hover,.sdi.on,.sdi.hm.on{background:var(--sbh);color:var(--ink)}
      @media(hover:hover){.sdi:hover{scale:1.012;translate:0 -1px}}
      .sdi:active{scale:.965;translate:0 1px;transition:scale .22s ease-out,translate .22s ease-out,background .35s}
      .lpa>*{margin-block:0}       .lpp>*,.lpl>*{margin-block:0}       .lpb{flex:1;display:flex;flex-direction:column;gap:6px}.lpb .dmsg{margin:auto 0}       .lday{font:700 12.5px Cairo,Inter,sans-serif;color:var(--ink2);margin:12px 4px 4px;text-align:start}.lday:first-child{margin-top:0}       .ltile{position:relative;width:100%}.ltile img{width:100%;cursor:zoom-in}       .ltx{position:absolute;top:4px;inset-inline-end:4px;width:24px;height:24px;border:0;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font:700 12px Inter,sans-serif;line-height:24px;padding:0;cursor:pointer}       .lk{position:relative;padding-inline-end:42px!important;text-align:start!important}.lk a{display:block;direction:ltr;text-align:start;word-break:break-all;color:#60a5fa;font:500 14px/1.6 Inter,sans-serif;text-decoration:none}.lk .ltx{top:50%;transform:translateY(-50%);background:var(--gbd);color:var(--ink)}
      .lsw{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:2px 0 14px}
      .lsw button{height:34px;padding:0 16px;border-radius:999px;border:1px solid var(--gbd);background:var(--gfield);color:var(--ink);font:700 12.5px Cairo,Inter,sans-serif;cursor:pointer;transition:background .3s,scale .6s var(--ease)}
      .lsw button.on{background:var(--btn);color:var(--onbtn);border-color:var(--btn)}
      .lsw button:active{scale:.95;transition:scale .2s ease-out}
      .lab{flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px}
      .lpc audio{width:100%;height:36px;margin-top:8px}
      .sdl{margin:10px 16px}
      .sdl.sp{margin:20px 16px}
      .sdr + .sdl.sp{margin-top:22px!important}
      .sdr{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-start;gap:8px 10px;margin:8px 12px 0}.sdr .sdi{margin:0!important;flex:none}.sdr .sdi.hm{width:auto!important;flex:3 1 0;min-width:0;padding-inline:10px;height:40px!important;justify-content:center;border-radius:999px;background:var(--chip);border:1px solid var(--sbd)}.sdr .sdi.st{flex:1 1 0!important;width:auto!important;min-width:0}.sdr .sdbr{flex:0 0 100%;height:0;margin-top:-8px}.sdr .sdi.sup{height:40px;font-size:0}.sdr .sdi.sup svg{width:20px;height:20px}
      .sps{height:14px}
      .sdi.st[data-k="messenger"]{display:inline-flex}.sdi.st{position:relative;margin-inline-start:6px}.sdi .bdg{position:absolute;top:-4px;inset-inline-end:-4px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:999px;background:#ef4444;color:#fff;font:800 9px/16px Inter,Cairo,sans-serif;text-align:center;box-shadow:0 0 0 2px var(--pn,#181c20),0 2px 6px rgba(239,68,68,.55);pointer-events:none;display:none}.sdi .bdg.on{display:block}
      .sdi.st{width:38px;height:38px;padding:0;margin:0 0 6px;display:inline-flex;justify-content:center;border-radius:999px;background:var(--chip);border:1px solid var(--sbd)}.sdi.st svg{width:18px;height:18px}.sdi.st.on{background:var(--btn);color:var(--onbtn)}
      .mrwrap{position:relative;height:100%;min-height:100%}
      .pcard.dpc.mr-card{height:100%;max-width:none;align-items:center!important;justify-content:flex-start!important;padding:22px 16px!important}
      .mr-w{width:100%;max-width:560px;display:flex;flex-direction:column;align-items:center;gap:14px}
      .mr-orb{position:relative;width:min(300px,76vw);aspect-ratio:1;flex:none}
      .mr-orb canvas{width:100%;height:100%;display:block}
      .mr-ctr{position:absolute;left:50%;top:50%;translate:-50% -50%;width:15%;aspect-ratio:1;min-width:44px;border-radius:50%;border:0;background:#fff;color:#0c0c0c;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.35);transition:scale .7s var(--ease);-webkit-tap-highlight-color:transparent}
      .mr-ctr:hover{scale:1.06}.mr-ctr:active{scale:.93;transition:scale .3s ease-out}.mr-ctr svg{width:46%;height:46%}
      .mr-st{min-height:22px;text-align:center;font:700 13.5px Cairo,Inter,sans-serif;color:var(--ink2)}
      .mr-btns{display:flex;gap:10px}.mr-btns .btn{width:auto;min-width:120px;padding:0 22px}.mr-btns .btn:disabled{opacity:.4;cursor:default}
      .mr-tr{display:flex;gap:10px;align-items:center;justify-content:center}
      .mr-sw{display:inline-flex;align-items:center;gap:10px;height:34px;padding:0 14px 0 8px;border-radius:999px;border:1px solid var(--gbd);background:var(--gfield);color:var(--ink);font:700 12.5px Cairo,Inter,sans-serif;cursor:pointer}
      .mr-sw i{width:30px;height:18px;border-radius:999px;background:var(--chip);position:relative;transition:background .4s}
      .mr-sw i::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--ink);transition:translate .4s var(--ease)}
      .mr-sw.on i{background:#34d399}.mr-sw.on i::after{translate:12px 0;background:#fff}
      .mr-lg{height:34px;min-width:66px;padding:0 12px;border-radius:999px;border:1px solid var(--gbd);background:var(--gfield);color:var(--ink);font:800 12px Inter,sans-serif;cursor:pointer}
      .mr-ta{unicode-bidi:plaintext;text-align:start;min-height:120px}
      .mr-int{min-height:18px;width:100%;text-align:center;font:500 12.5px Cairo,Inter,sans-serif;color:var(--ink2);unicode-bidi:plaintext}
      .mr-rc,.mr-row{width:100%;border:1px solid var(--gbd);border-radius:16px;padding:12px 14px;background:var(--gfield);text-align:center}
      .mr-rc b{display:block;color:#34d399;font:800 14px Cairo,Inter,sans-serif}.mr-rc small{display:block;margin:2px 0 8px;color:var(--ink2);font:600 12px Cairo,Inter,sans-serif}
      .mr-pt{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;margin:8px 0}
      .mr-pt audio{height:36px;max-width:100%}
      .mr-dl{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;border:1px solid var(--gbd);background:var(--chip);color:var(--ink);font:700 11.5px Cairo,Inter,sans-serif;text-decoration:none}
      .mr-dl svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
      .mr-prev{width:100%;display:flex;flex-direction:column;gap:8px}
      .mr-prev h4{font:800 13px Cairo,Inter,sans-serif;color:var(--ink2);text-align:center;margin:6px 0}
      .mr-row summary{cursor:pointer;font:700 13px Cairo,Inter,sans-serif;list-style:none}.mr-row summary::-webkit-details-marker{display:none}
      .mr-row small{color:var(--ink2);font-weight:600;margin-inline-start:8px}
      .mr-tx{margin-top:8px;text-align:start;unicode-bidi:plaintext;font:500 13px/1.7 Inter,Cairo,sans-serif;color:var(--ink2);white-space:pre-wrap}
      .mr-warn{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;padding:24px;border-radius:20px;text-align:center;cursor:pointer;background:#0b0d13;transition:opacity .45s ease}
      #W.light .mr-warn{background:#e4e6ec}
      button.mr-dl{cursor:pointer}
      .mr-warn.off{opacity:0;pointer-events:none}
      .mr-wb{max-width:380px;padding:26px 22px;border-radius:24px;border:1px solid var(--gbd);background:var(--pn);color:var(--ink)}
      .mr-wb svg{width:48px;height:48px;stroke:#ef4444;fill:rgba(239,68,68,.12);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;margin-bottom:10px;animation:mrTri 2.6s ease-in-out infinite}
      @keyframes mrTri{0%,100%{filter:drop-shadow(0 0 2px rgba(239,68,68,.25));scale:1}50%{filter:drop-shadow(0 0 13px rgba(239,68,68,.9));scale:1.07}}
      .mr-wb h3{font:800 19px Cairo,Inter,sans-serif;margin-bottom:8px}
      .mr-wb p{font:600 14px/1.8 Cairo,Inter,sans-serif;color:var(--ink2);margin-bottom:14px}
      .mr-wb em{font:700 12px Cairo,Inter,sans-serif;font-style:normal;opacity:.7}
      @media(min-width:876px){.mr-warn{border-radius:24px}}
    `;
    thx.R.appendChild(st);
  }
function renderMirror(b) {
    mirStop(); mirCss();
    const T = MT[thx.L], ar = thx.L === 'ar', user = uKey();
    const SV = {
      play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
      stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>',
      dl: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>',
      tri: '<svg viewBox="0 0 24 24"><path d="M12 3.5L22 20.5H2z"/><path d="M12 10v5M12 17.6v.1"/></svg>',
      cp: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
      sh: '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/></svg>'
    };
    b.classList.remove('full');
    b.innerHTML = '<div class="mrwrap" dir="' + (ar ? 'rtl' : 'ltr') + '"><div class="pcard dpc mr-card"><div class="mr-w">' +
      '<div class="mr-orb"><canvas id="mrC" width="420" height="420"></canvas><button type="button" class="mr-ctr" id="mrCtr" aria-label="' + T.start + '">' + SV.play + '</button></div>' +
      '<div class="mr-st" id="mrSt"></div>' +
      '<div class="mr-btns"><button type="button" class="btn" id="mrStart">' + T.start + '</button><button type="button" class="btn ghost" id="mrStop" disabled>' + T.stop + '</button></div>' +
      '<div class="mr-tr"><button type="button" class="mr-sw on" id="mrTr" aria-pressed="true"><i></i><span>' + T.tr + '</span></button><button type="button" class="mr-lg" id="mrLg" aria-label="' + T.lang + '" title="' + T.lang + '">' + (ar ? 'العربية' : 'English') + '</button></div>' +
      '<textarea class="dta mr-ta" id="mrTa" dir="auto" rows="5" placeholder="' + T.ph + '" spellcheck="false"></textarea>' +
      '<div class="mr-tr"><button type="button" class="mr-dl" id="mrCp">' + SV.cp + '<span>' + T.copy + '</span></button><button type="button" class="mr-dl" id="mrSh">' + SV.sh + '<span>' + T.share + '</span></button><button type="button" class="mr-dl" id="mrDx">' + SV.dl + '<span>' + T.dltx + '</span></button></div>' +
      '<div class="mr-int" id="mrInt"></div><div id="mrRes" style="width:100%"></div><div class="mr-prev" id="mrPrev"></div>' +
      '</div></div>' +
      '<div class="mr-warn' + (mirWarned ? ' off' : '') + '" id="mrWarn"><div class="mr-wb">' + SV.tri + '<h3>' + T.wT + '</h3><p>' + T.wP + '</p><em>' + T.wTap + '</em></div></div></div>';

    const q = id => b.querySelector('#' + id);
    const cv = q('mrC'), g = cv.getContext('2d'), S = cv.width, cx = S / 2, cy = S / 2, Ro = S * 0.38;
    const st = q('mrSt'), ta = q('mrTa'), intr = q('mrInt'), res = q('mrRes'), prev = q('mrPrev'), warn = q('mrWarn'), ctr = q('mrCtr');
    const SRC = window.SpeechRecognition || window.webkitSpeechRecognition;
    let alive = true, running = false, state = 'idle', ctx = null, stream = null, src = null, proc = null, dest = null, playGain = null, playAn = null, bufSrc = null, rec = null, recChunks = [], mime = '';
    let sess = null, sessions = [], urls = [], purls = [], trOn = true, srLang = ar ? 'ar-EG' : 'en-US', sr = null, starting = false, fails = 0, srT0 = 0, ivTxt = '';
    let lvl = 0, hue = 214, tm = 0, curRms = 0, floor = 0.006, quietUntil = 0, ring = [], chunks = [], spk = false, hot = 0, voiced = 0, lastVoice = 0, raf = 0, last = performance.now(), saveT = 0, frameMs = 43, maxFrames = 40000;
    const abuf = new Float32Array(1024);

    /* ----- the orb ----- */
    const nz = document.createElement('canvas'); nz.width = nz.height = 96;
    { const n = nz.getContext('2d'), id = n.createImageData(96, 96); for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() < .5 ? 255 : 0; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = Math.random() * 90; } n.putImageData(id, 0, 0); }
    const pat = g.createPattern(nz, 'repeat');
    const BL = Array.from({ length: 8 }, (_, i) => ({ a: Math.random() * 6.28, sp: .35 + Math.random() * .7, rx: .25 + Math.random() * .35, ry: .25 + Math.random() * .35, r: .45 + Math.random() * .3, dark: i % 3 === 2, hs: (Math.random() - .5) * 26 }));
    function draw(now) {
      if (!alive || !b.isConnected) return;
      raf = requestAnimationFrame(draw);
      if (document.hidden) { last = now; return; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      let target = 0;
      if (running) {
        let r = curRms;
        if (state === 'playing' && playAn) { playAn.getFloatTimeDomainData(abuf); let s = 0; for (let i = 0; i < abuf.length; i++) s += abuf[i] * abuf[i]; r = Math.sqrt(s / abuf.length); }
        else if (r < Math.max(floor * 2, .009)) r = 0;
        if (state !== 'idle' && r > .006) target = Math.min(1, Math.pow(r * 6, .7));
      }
      lvl += (target - lvl) * (target > lvl ? .35 : .09);
      hue += ((state === 'playing' ? 268 : 214) - hue) * .06;
      tm += dt * (.15 + 2.1 * lvl);
      g.clearRect(0, 0, S, S);
      g.save(); g.beginPath(); g.arc(cx, cy, Ro, 0, 6.2832); g.clip();
      const bg = g.createRadialGradient(cx - Ro * .2, cy - Ro * .25, Ro * .1, cx, cy, Ro);
      bg.addColorStop(0, 'hsl(' + hue + ',70%,18%)'); bg.addColorStop(1, 'hsl(' + (hue + 6) + ',75%,6%)');
      g.fillStyle = bg; g.fillRect(0, 0, S, S);
      BL.forEach(o => {
        const x = cx + Math.cos(tm * o.sp + o.a) * Ro * o.rx * (1 + lvl * .9), y = cy + Math.sin(tm * o.sp * 1.13 + o.a * 1.7) * Ro * o.ry * (1 + lvl * .9),
          r = Ro * (o.r + .25 * lvl + .08 * Math.sin(tm * o.sp * 2 + o.a)), gr = g.createRadialGradient(x, y, 0, x, y, r);
        if (o.dark) { gr.addColorStop(0, 'hsla(' + (hue + 8) + ',80%,4%,.75)'); gr.addColorStop(1, 'hsla(' + (hue + 8) + ',80%,4%,0)'); }
        else { gr.addColorStop(0, 'hsla(' + (hue + o.hs) + ',92%,' + (48 + 14 * lvl) + '%,' + (.45 + .4 * lvl) + ')'); gr.addColorStop(1, 'hsla(' + (hue + o.hs) + ',92%,50%,0)'); }
        g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
      });
      g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .9; g.fillStyle = pat; g.fillRect(0, 0, S, S); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      const ed = g.createRadialGradient(cx, cy, Ro * .62, cx, cy, Ro); ed.addColorStop(0, 'rgba(0,0,0,0)'); ed.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = ed; g.fillRect(0, 0, S, S);
      g.restore();
    }
    raf = requestAnimationFrame(draw);

    /* ----- status ----- */
    function ui() {
      let m = !running ? (sess ? T.pending.replace('{n}', sess.n) : T.armed) : state === 'playing' ? T.echo : state === 'speaking' ? T.hear : T.listen;
      if (!running && !SRC) m += ' — ' + T.noSr;
      st.textContent = m; ctr.innerHTML = running ? SV.stop : SV.play;
      q('mrStart').disabled = running; q('mrStop').disabled = !running;
    }

    /* ----- sound ----- */
    function ensureCtx() { if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; ctx = new AC(); } if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    function chime(up) {
      try {
        ensureCtx(); const t0 = ctx.currentTime, f = up ? [740, 988] : [988, 740];
        f.forEach((fr, i) => { const o = ctx.createOscillator(), gn = ctx.createGain(), t = t0 + i * .15; o.type = 'sine'; o.frequency.value = fr; gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.2, t + .02); gn.gain.exponentialRampToValueAtTime(.0001, t + .13); o.connect(gn); gn.connect(ctx.destination); o.start(t); o.stop(t + .15); });
      } catch (e) { }
      quietUntil = performance.now() + 450;
    }
    function pickMime() { const c = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']; for (const m of c) { try { if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m; } catch (e) { } } return ''; }

    function finishUtt() {
      const now = performance.now(), cut = Math.max(0, Math.round((now - lastVoice) / frameMs) - 6);
      let arr = chunks; chunks = []; spk = false; hot = 0;
      const enough = voiced >= 4; voiced = 0;
      if (cut) arr = arr.slice(0, Math.max(1, arr.length - cut));
      state = 'listening';
      if (!enough) { ui(); return; }
      playUtt(arr);
    }
    function playUtt(arr) {
      let n = 0; arr.forEach(a => n += a.length);
      const buf = ctx.createBuffer(1, n, ctx.sampleRate), ch = buf.getChannelData(0); let o = 0;
      arr.forEach(a => { for (let i = 0; i < a.length; i++) ch[o + i] = a[i] / 32768; o += a.length; });
      const mine = ctx.createBufferSource(); mine.buffer = buf; mine.connect(playGain); bufSrc = mine;
      state = 'playing'; ui();
      mine.onended = () => { if (bufSrc !== mine) return; bufSrc = null; if (!running) return; ring = []; quietUntil = performance.now() + 300; state = 'listening'; ui(); };
      mine.start();
    }
    function frame(d) {
      if (!running) return;
      let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i];
      const rms = Math.sqrt(s / d.length); curRms = rms;
      const now = performance.now();
      if (state === 'playing' || now < quietUntil) return;
      const i16 = new Int16Array(d.length);
      for (let i = 0; i < d.length; i++) { const v = d[i] < -1 ? -1 : d[i] > 1 ? 1 : d[i]; i16[i] = v < 0 ? v * 32768 : v * 32767; }
      const thr = Math.max(floor * 3.2, .014), lo = Math.max(floor * 2, .009);
      if (!spk) {
        ring.push(i16); if (ring.length > 8) ring.shift();
        floor = Math.min(.03, Math.max(.002, floor * .97 + rms * .03));
        if (rms > thr) { if (++hot >= 2) { spk = true; chunks = ring; ring = []; lastVoice = now; voiced = 0; state = 'speaking'; ui(); } } else hot = 0;
      } else {
        chunks.push(i16);
        if (rms > lo) { lastVoice = now; voiced++; }
        if (now - lastVoice >= 1000 || chunks.length > maxFrames) finishUtt();
      }
    }

    /* ----- sessions ----- */
    const fmt = s => { try { return new Date(s.end || s.at).toLocaleString(ar ? 'ar-EG' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return ''; } };
    function partsHtml(s, arr) {
      return s.parts.map((p, i) => { const u = URL.createObjectURL(p); arr.push(u); const ext = /mp4/.test(p.type) ? 'm4a' : /ogg/.test(p.type) ? 'ogg' : 'webm';
        return '<div class="mr-pt"><audio controls preload="metadata" src="' + u + '"></audio><a class="mr-dl" download="mirror-room-' + s.n + (s.parts.length > 1 ? '-' + (i + 1) : '') + '.' + ext + '" href="' + u + '">' + SV.dl + '<span>' + T.dl + '</span></a></div>'; }).join('');
    }
    function textDl(s, arr) {
      if (!(s.text || '').trim()) return '';
      const u = URL.createObjectURL(new Blob([s.text], { type: 'text/plain;charset=utf-8' })); arr.push(u);
      return '<div class="mr-pt"><a class="mr-dl" download="mirror-room-' + s.n + '.txt" href="' + u + '">' + SV.dl + '<span>' + T.dlt + '</span></a></div>';
    }
    function drawPrev() {
      purls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) { } }); purls = [];
      const done = sessions.filter(s => s.state === 'done').sort((x, y) => y.n - x.n);
      prev.innerHTML = done.length ? '<h4>' + T.prev + '</h4>' + done.map(s => '<details class="mr-row"><summary>' + T.sess + ' #' + s.n + '<small>' + thx.esc(fmt(s)) + '</small></summary>' + partsHtml(s, purls) + textDl(s, purls) + (s.text ? '<div class="mr-tx">' + thx.esc(s.text) + '</div>' : '') + '</details>').join('') : '';
    }
    function showRes(s, trial) {
      res.innerHTML = '<div class="mr-rc"><b>' + T.sess + ' #' + s.n + '</b><small>' + (trial ? T.trial : T.saved) + '</small>' + partsHtml(s, urls) + textDl(s, urls) + (trial ? '<div class="mr-pt"><button type="button" class="mr-dl" id="mrSave"><span>' + T.save + '</span></button></div>' : '') + '</div>';
      const sv = res.querySelector('#mrSave');
      if (sv) sv.onclick = async () => {
        if (sessions.some(x => x.id === s.id)) s.n = sessions.reduce((m, x) => Math.max(m, x.n || 0), 0) + 1;
        s.id = user + ':' + s.n; s.state = 'done'; sessions.push(s); await mirDb.put(s); sv.remove(); res.querySelector('small').textContent = T.saved; drawPrev();
      };
      try { res.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { }
    }
    function saveText() { if (!sess) return; sess.text = ta.value; clearTimeout(saveT); saveT = setTimeout(() => mirDb.put(sess), 400); }
    ta.addEventListener('input', saveText);
    const ready = mirDb.all(user).then(a => {
      if (!alive) return; sessions = a;
      const o = a.filter(s => s.state === 'open').sort((x, y) => y.n - x.n)[0];
      if (o) { if (o.live) { o.parts.push(o.live); o.live = null; mirDb.put(o); } sess = o; if (!ta.value) ta.value = o.text || ''; try { localStorage.setItem(mirFlag(), String(o.n)); } catch (e) { } }
      else { try { localStorage.removeItem(mirFlag()); } catch (e) { } }
      thx.MOD.dict.updBadge(); drawPrev(); ui();
    });
    async function newSess() {
      const n = sessions.reduce((m, s) => Math.max(m, s.n || 0), 0) + 1;
      sess = { id: user + ':' + n, user, n, state: 'open', text: ta.value || '', parts: [], live: null, mime: '', at: Date.now() };
      sessions.push(sess); await mirDb.put(sess);
      try { localStorage.setItem(mirFlag(), String(n)); } catch (e) { } thx.MOD.dict.updBadge();
    }
    async function startSession() {
      if (running || starting) return;
      starting = true; fails = 0; if (trOn) srStart();
      await ready; ensureCtx();
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true } }); }
      catch (e) { starting = false; try { sr && sr.abort(); } catch (x) { } st.textContent = T.micDenied; return; }
      if (!alive) { starting = false; stream.getTracks().forEach(t => t.stop()); return; }
      if (running) { stream.getTracks().forEach(t => t.stop()); return; }
      if (!sess) await newSess();
      src = ctx.createMediaStreamSource(stream); dest = ctx.createMediaStreamDestination(); proc = ctx.createScriptProcessor(2048, 1, 1);
      const zero = ctx.createGain(); zero.gain.value = 0;
      src.connect(proc); proc.connect(zero); zero.connect(ctx.destination); src.connect(dest);
      playGain = ctx.createGain(); playAn = ctx.createAnalyser(); playAn.fftSize = 1024;
      playGain.connect(playAn); playAn.connect(ctx.destination); playGain.connect(dest);
      frameMs = 2048 / ctx.sampleRate * 1000; maxFrames = Math.floor(ctx.sampleRate * 1800 / 2048);
      ring = []; chunks = []; spk = false; hot = 0; voiced = 0; floor = .006; curRms = 0;
      mime = pickMime(); recChunks = [];
      try { rec = new MediaRecorder(dest.stream, mime ? { mimeType: mime } : undefined); } catch (e) { rec = null; }
      if (rec) {
        const s0 = sess;
        rec.ondataavailable = ev => { if (ev.data && ev.data.size) { recChunks.push(ev.data); s0.mime = mime || rec.mimeType; s0.live = new Blob(recChunks, { type: s0.mime }); mirDb.put(s0); } };
        rec.start(5000);
      }
      proc.onaudioprocess = ev => frame(ev.inputBuffer.getChannelData(0));
      running = true; starting = false; state = 'listening'; chime(true); ui(); if (trOn) srStart(); intr.textContent = trOn && !SRC ? T.noSr : '';
    }
    function endAudio(done) {
      if (!running) return Promise.resolve();
      running = false; state = 'idle'; spk = false; chunks = []; ring = [];
      setIv(''); try { sr && sr.abort(); } catch (e) { }
      try { proc.onaudioprocess = null; src.disconnect(); proc.disconnect(); } catch (e) { }
      if (bufSrc) { try { bufSrc.onended = null; bufSrc.stop(); } catch (e) { } bufSrc = null; }
      try { playGain.disconnect(); } catch (e) { }
      if (stream) stream.getTracks().forEach(t => t.stop());
      const s = sess, txt = ta.value, r = rec, mm = mime;
      return new Promise(resolve => {
        const fin = () => {
          const blob = recChunks.length ? new Blob(recChunks, { type: mm || (r && r.mimeType) || 'audio/webm' }) : null;
          if (blob && blob.size) s.parts.push(blob);
          s.live = null; s.text = txt; if (done) { s.state = 'done'; s.end = Date.now(); }
          recChunks = []; mirDb.put(s).then(resolve);
        };
        if (r && r.state !== 'inactive') { r.onstop = fin; try { r.stop(); } catch (e) { fin(); } } else fin();
      });
    }
    async function stopSession() {
      if (!running) return;
      chime(false);
      const s = sess; await endAudio(true);
      try { localStorage.removeItem(mirFlag()); } catch (e) { } thx.MOD.dict.updBadge();
      const task = !!(window.thMirrorTask || (thx.cfg.mirrorTask && thx.cfg.mirrorTask()));   /* only a task given by the trainer is saved by itself; a practice run is saved only if the trainee asks */
      if (!task) { sessions = sessions.filter(x => x !== s); await mirDb.del(s.id); }
      sess = null; ui(); showRes(s, !task); drawPrev();
    }

    /* ----- transcript: the words appear live in the text box (the grey tail is still being recognised) ----- */
    function setIv(t) {
      if (ivTxt && ta.value.endsWith(ivTxt)) ta.value = ta.value.slice(0, ta.value.length - ivTxt.length);
      ivTxt = '';
      if (t) { ivTxt = (ta.value && !/\s$/.test(ta.value) ? ' ' : '') + t; ta.value += ivTxt; ta.scrollTop = ta.scrollHeight; }
    }
    function onSr(e) {
      if (!(running || starting) || !trOn) return;
      let finals = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i], t = r[0].transcript; if (r.isFinal) finals += ' ' + t; else interim += ' ' + t; }
      if (intr.textContent.indexOf(T.srErr) === 0) intr.textContent = '';
      fails = 0; setIv('');
      if (finals.trim()) { ta.value += (ta.value && !/\s$/.test(ta.value) ? ' ' : '') + finals.trim(); saveText(); }
      if (interim.trim()) setIv(interim.trim());
    }
    const wantSr = () => running || starting;
    const srMsg = c => c === 'audio-capture' ? T.srErr + ' — لا يوجد ميكروفون يعمل / no working microphone' : c === 'network' ? T.srErr + ' — network' : T.srErr + ' (' + c + ')';
    function srStart() {
      if (!SRC || !alive || !wantSr() || sr) return;
      try {
        const my = new SRC(); sr = my; srT0 = Date.now(); my.lang = srLang; my.continuous = true; my.interimResults = true; my.onresult = onSr;
        my.onerror = ev => { if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { fails = 99; intr.textContent = T.micDenied; } else if (ev.error !== 'no-speech' && ev.error !== 'aborted') intr.textContent = srMsg(ev.error); };
        my.onend = () => { if (sr === my) sr = null; setIv(''); if (!alive || !wantSr() || fails > 8) return; fails = Date.now() - srT0 < 2500 ? fails + 1 : 0; setTimeout(srStart, Math.min(8000, 400 * Math.pow(2, fails))); };
        my.start();
      } catch (e) { sr = null; }
    }

    /* ----- buttons ----- */
    q('mrStart').onclick = startSession; q('mrStop').onclick = stopSession;
    ctr.onclick = () => running ? stopSession() : startSession();
    q('mrTr').onclick = e => { trOn = !trOn; e.currentTarget.classList.toggle('on', trOn); e.currentTarget.setAttribute('aria-pressed', trOn ? 'true' : 'false'); intr.textContent = trOn && !SRC ? T.noSr : ''; if (trOn && running) { fails = 0; srStart(); } };
    const flash = m => { st.textContent = m; setTimeout(ui, 1400); };
    q('mrCp').onclick = async () => { const t = ta.value; if (!t.trim()) return; try { await navigator.clipboard.writeText(t); } catch (e) { ta.select(); try { document.execCommand('copy'); } catch (x) { } } flash(T.copied); };
    q('mrSh').onclick = async () => { const t = ta.value; if (!t.trim()) return; if (navigator.share) { try { await navigator.share({ text: t }); } catch (e) { } } else { try { await navigator.clipboard.writeText(t); flash(T.copied); } catch (e) { } } };
    q('mrDx').onclick = () => { const t = ta.value; if (!t.trim()) return; const u = URL.createObjectURL(new Blob([t], { type: 'text/plain;charset=utf-8' })), a = document.createElement('a'); a.href = u; a.download = 'mirror-room-transcript.txt'; b.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 3000); };
    q('mrLg').onclick = e => { srLang = srLang.indexOf('ar') === 0 ? 'en-US' : 'ar-EG'; e.currentTarget.textContent = srLang.indexOf('ar') === 0 ? 'العربية' : 'English'; try { sr && sr.abort(); } catch (x) { } };
    warn.onclick = () => { mirWarned = true; warn.classList.add('off'); ensureCtx(); };
    ui();

    mirStop = () => {
      alive = false; starting = false; try { sr && sr.abort(); } catch (e) { } cancelAnimationFrame(raf); clearTimeout(saveT);
      if (sess) sess.text = ta.value;
      const fin = () => { urls.concat(purls).forEach(u => { try { URL.revokeObjectURL(u); } catch (e) { } }); try { ctx && ctx.close(); } catch (e) { } };
      if (running) endAudio(false).then(fin); else { if (sess) mirDb.put(sess); fin(); }
      mirStop = () => { };
    };
  }

    /* ---- اللي index.html والملفات التانية بتستخدمه من الزرار ده ---- */
    return {
      id: 'mirror', render: renderMirror,
      stop: function () { mirStop(); },
      get uKey() { return uKey; },
      get mirIsOpen() { return mirIsOpen; },
      get mirDb() { return mirDb; },
      get mirCss() { return mirCss; }
    };
  };
})();
