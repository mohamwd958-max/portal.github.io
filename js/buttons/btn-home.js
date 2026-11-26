/* =====================================================================
   SIDEBAR BUTTON: home
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + الصفحة الرئيسية كلها (التحية، البحث، واقتراحات الطالب) + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-home.js"></script>
   و index.html بينده عليه بـ thx = كل الأدوات المشتركة اللي بيدّيها index.html (R, W, L, STR, esc, MOD, openLayer ...)
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.home = function (thx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v9.5a.5.5 0 0 0 .5.5h4v-5.5h4V20h4a.5.5 0 0 0 .5-.5V10"/>';
    thx.IC.home = ICON;
    thx.STR.en.i_home = 'Home'; thx.STR.ar.i_home = 'الرئيسية';

    /* ---- the screen: الكود اتنقل من index.html زي ما هو (الصفحة الرئيسية) ---- */
/* there is no main page any more: "back" lands on the dashboard */
  /* ================= Home page (main page): welcome, smart search bar, the student's own most-opened buttons ================= */
  /* placeholder questions about the buttons students use most; each button is asked about in several ways.
     [Arabic, English, button it opens]. Kept short so one question fits the bar on a phone. Tapping the question opens that button. */
  const HQ = [
    ['هل تريد سماع صوتك؟', 'Want to hear your own voice?', 'mirror'],
    ['كيف تُنطق هذه الكلمة؟', 'How is this word said?', 'passist'],
    ['أين كلماتي المحفوظة؟', 'Where are my saved words?', 'ydict'],
    ['تريد تدريبًا على الإملاء؟', 'Want dictation practice?', 'dict'],
    ['أين نصوص اليوم؟', "Where are today's texts?", 'res'],
    ['احكم على نفسك بصدى صوتك', 'Judge yourself by your echo', 'mirror'],
    ['تريد تحسين نطقك؟', 'Want better pronunciation?', 'passist'],
    ['تريد مراجعة كلماتك؟', 'Review your words?', 'ydict'],
    ['اكتب ما تسمعه', 'Write what you hear', 'dict'],
    ['تريد مساحة للرسم والكتابة؟', 'Want a board to draw on?', 'space'],
    ['سجّل صوتك واستمع إليه', 'Record yourself, listen back', 'mirror'],
    ['تريد قطعة للقراءة؟', 'Want a passage to read?', 'res'],
    ['أين الفيديوهات والصوتيات؟', 'Where are the videos?', 'library'],
    ['كيف أتابع تقدمي؟', 'How am I progressing?', 'dash'],
    ['هل نطقك سليم؟ اسمع نفسك', 'Is your accent right? Listen', 'mirror'],
    ['أضف كلمة جديدة لقاموسك', 'Add a word to your dictionary', 'ydict']
  ];
const HKW = {   /* words that lead the search to a page */
    dash: 'لوحة تحكم تقدم متابعة dashboard progress', translate: 'ترجم ترجمة لغات ملف translat language file', store: 'متجر سعر أسعار اسعار store price shop',
    dict: 'إملاء املاء dictation', mirror: 'مماراة مرآة مرايا صوتي صدى mirror echo voice', space: 'مساحة space', library: 'مكتبة وسائط media library', support: 'دعم مساعدة سياسات support help policy', ydict: 'قاموس كلماتي your dictionary', passist: 'نطق مساعد pronunciation assistant'
  };
const HT = {
    ar: { hi: 'مرحبًا بك', hiG: 'مرحبًا بك ضيفنا', how: 'كيف أستطيع مساعدتك اليوم؟', ask: 'اسأل أو ابحث…', plus: 'إضافة', img: 'صورة', shot: 'لقطة شاشة', link: 'رابط', code: 'نص أو كود', mic: 'تسجيل صوتي', stop: 'إيقاف',
      send: 'بحث', add: 'إضافة', linkPh: 'الصق الرابط هنا', codePh: 'الصق النص أو الكود هنا',
      noMic: 'التسجيل الصوتي غير مدعوم في هذا المتصفح. جرّب Chrome أو Edge أو Safari.', noAudio: 'لم أجد ميكروفونًا يعمل. تأكد من توصيله ومن اختياره في إعدادات الجهاز.', netErr: 'تعذّر الاتصال بخدمة التعرف على الصوت. تحقق من الإنترنت وحاول مرة أخرى.', srErr: 'تعذّر التعرف على الكلام', noSpeech: 'لم أسمع شيئًا. اضغط الميكروفون وتحدّث.', micDenied: 'لم يُسمح باستخدام الميكروفون.', noShot: 'التقاط الشاشة غير مدعوم هنا، اختر صورة بدلًا منها.',
      found: 'قد يساعدك هذا:', none: 'لم أجد خدمة مطابقة. جرّب كلمات أخرى أو تصفّح الخدمات بالأسفل.', att: 'مرفق', rm: 'إزالة', listening: 'جارٍ الاستماع…' },
    en: { hi: 'Welcome', hiG: 'Hello guest', how: 'How can I help you today?', ask: 'Ask or search…', plus: 'Add', img: 'Image', shot: 'Screenshot', link: 'Link', code: 'Text or code', mic: 'Record voice', stop: 'Stop',
      send: 'Search', add: 'Add', linkPh: 'Paste the link here', codePh: 'Paste text or code here',
      noMic: 'Voice recording is not supported in this browser. Try Chrome, Edge or Safari.', noAudio: 'No working microphone found. Check it is connected and selected in your device settings.', netErr: 'Could not reach the speech service. Check your internet and try again.', srErr: 'Speech recognition problem', noSpeech: 'I did not hear anything. Press the microphone and speak.', micDenied: 'Microphone access was not allowed.', noShot: 'Screen capture is not supported here, choose an image instead.',
      found: 'This may help:', none: 'No matching service found. Try other words or browse the services below.', att: 'Attachment', rm: 'Remove', listening: 'Listening…' }
  };
let homeStop = () => { };   /* stops the typing loop and the microphone of the page that is leaving */

  function homeCss() {
    if (thx.R.getElementById('thHomeCss')) return;
    const st = document.createElement('style'); st.id = 'thHomeCss';
    st.textContent = `
      .sdi.hm{width:auto;display:inline-flex;height:38px;margin:0 4px 12px;padding:0 18px 0 14px;border-radius:999px;background:var(--chip);border:1px solid var(--sbd);gap:10px;font-weight:800}.sdi.hm span{flex:none}.sdi.hm svg{width:19px;height:19px}.sdi.hm.on{background:var(--btn);color:var(--onbtn)}
      .hm-w{min-height:100%;display:flex;flex-direction:column;align-items:center;padding:0 0 40px}
      .hm-hero{width:100%;max-width:760px;min-height:min(78vh,640px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:48px 14px 30px;text-align:center}
      .hm-hi{font:800 clamp(26px,4.6vw,40px)/1.3 Cairo,Inter,sans-serif;color:var(--ink);letter-spacing:.005em}
      .hm-hi small{display:block;margin-top:6px;font:600 clamp(15px,2.3vw,20px) Cairo,Inter,sans-serif;color:var(--ink2)}
      .hm-bar{position:relative;width:100%;direction:ltr;display:flex;align-items:flex-end;gap:6px;padding:8px;border-radius:30px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);box-shadow:0 10px 34px rgba(0,0,0,.14);transition:box-shadow .5s var(--ease),border-color .4s ease}
      .hm-bar:focus-within{border-color:var(--gbd);box-shadow:0 14px 44px rgba(0,0,0,.24)}
      .hm-ib{position:relative;flex:1;min-width:0;min-height:44px;display:flex;align-items:center}
      .hm-ta{width:100%;max-height:150px;min-height:44px;padding:11px 4px;border:0;outline:0;resize:none;background:transparent;color:var(--ink);font:600 15.5px/1.5 Cairo,Inter,sans-serif;text-align:start;unicode-bidi:plaintext}
      .hm-ph{position:absolute;inset:0 4px;display:flex;align-items:center;pointer-events:none;color:var(--ink2);font:600 15.5px Cairo,Inter,sans-serif;white-space:nowrap;overflow:hidden;opacity:0;transition:opacity .3s ease}
      .hm-ph span{overflow:hidden;text-overflow:ellipsis;max-width:100%;pointer-events:auto;cursor:pointer;border-radius:8px;transition:color .25s}
      @media(hover:hover){.hm-ph span:hover{color:var(--ink);text-decoration:underline;text-underline-offset:4px}}
      .hm-bar.has .hm-ph,.hm-bar:focus-within .hm-ph,.hm-bar.rec .hm-ph{display:none}
      .hm-ib2{flex:none;width:44px;height:44px;border-radius:50%;border:0;background:transparent;color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .3s,scale .7s var(--ease)}
      @media(hover:hover){.hm-ib2:hover{background:var(--chip)}}
      .hm-ib2:active{scale:.9;transition:scale .3s ease-out}
      .hm-ib2 svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .hm-bar.rec .hm-mic{background:#ef4444;color:#fff;animation:hmPulse 1.4s ease-in-out infinite}
      @keyframes hmPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.45)}50%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}
      .hm-go{background:var(--btn);color:var(--onbtn)}
      .hm-bar:not(.has):not(.rec) .hm-go{display:none}
      .hm-att{width:100%;direction:ltr;display:flex;flex-wrap:wrap;gap:8px;margin-top:-6px}
      .hm-att:empty{display:none}
      .hm-chipa{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:5px 6px 5px 5px;border-radius:14px;background:var(--chip);border:1px solid var(--sbd);font:600 12.5px Cairo,Inter,sans-serif;color:var(--ink)}
      .hm-chipa img{width:34px;height:34px;border-radius:9px;object-fit:cover}
      .hm-chipa i{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:var(--gbg);font-style:normal;font-weight:800;font-size:11px}
      .hm-chipa span{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;unicode-bidi:plaintext}
      .hm-chipa button{border:0;background:transparent;color:var(--ink2);font-size:16px;line-height:1;cursor:pointer;padding:2px 6px}
      .hm-menu,.hm-pop{position:absolute;left:8px;top:calc(100% + 8px);z-index:6;border-radius:20px;background:var(--pn);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(34px) saturate(1.6);backdrop-filter:blur(34px) saturate(1.6);box-shadow:0 18px 44px rgba(0,0,0,.3);color:var(--ink);opacity:0;visibility:hidden;translate:0 -6px;transition:opacity .3s ease,translate .4s var(--ease),visibility 0s .4s}
      .hm-menu.on,.hm-pop.on{opacity:1;visibility:visible;translate:0 0;transition-delay:0s}
      .hm-menu{padding:6px;min-width:190px;direction:inherit}
      .hm-menu button{display:flex;align-items:center;gap:12px;width:100%;height:42px;padding:0 12px;border:0;border-radius:13px;background:transparent;color:var(--ink);font:600 13.5px Cairo,Inter,sans-serif;text-align:start;cursor:pointer}
      @media(hover:hover){.hm-menu button:hover{background:var(--chip)}}
      .hm-menu svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
      .hm-pop{width:min(360px,calc(100% - 16px));padding:12px;display:flex;flex-direction:column;gap:10px;direction:inherit}
      .hm-pop input,.hm-pop textarea{width:100%;padding:11px 12px;border-radius:13px;border:1px solid var(--gbd);background:var(--gfield);color:var(--ink);font:600 14px Cairo,Inter,sans-serif;outline:0;resize:vertical;direction:ltr;text-align:start;unicode-bidi:plaintext}
      .hm-pop textarea{min-height:110px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px}
      .hm-pop .btn{height:38px;border-radius:12px;font-size:12.5px}
      .hm-note{min-height:20px;font:600 13px Cairo,Inter,sans-serif;color:var(--ink2);text-align:center}
      .hm-res{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
      .hm-res button{height:36px;padding:0 16px;border-radius:999px;border:1px solid var(--gbd);background:var(--btn);color:var(--onbtn);font:800 12.5px Cairo,Inter,sans-serif;cursor:pointer}
      .hm-top{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;width:100%}
      .hm-top:empty{display:none}
      .hm-top button{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 12px;border-radius:999px;border:1px solid var(--sbd);background:var(--chip);color:var(--ink);font:700 13px Cairo,Inter,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:0;translate:0 6px;animation:hmTopIn .5s var(--ease) forwards;transition:background .3s,scale .8s var(--ease)}
      .hm-top button svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
      @media(hover:hover){.hm-top button:hover{background:var(--gbg);scale:1.04}}
      .hm-top button:active{scale:.95;transition:scale .3s ease-out}
      @keyframes hmTopIn{to{opacity:1;translate:0 0}}
      @media(prefers-reduced-motion:reduce){.hm-top button{animation:none;opacity:1;translate:0 0}}
    `;
    thx.R.appendChild(st);
  }
function renderHome(b) {
    homeStop(); homeCss();
    const T = HT[thx.L], ar = thx.L === 'ar', sleep = ms => new Promise(r => setTimeout(r, ms));
    /* greeting: by the time of day, a different line on every visit; the first name comes from the member's name / username (omar.elsayed -> Omar). "guest" only for a real guest. */
    const U0 = (thx.cfg.getUser && thx.cfg.getUser()) || {}, isGuest = !!thx.cfg.guard;
    const nm0 = thx.thName(U0.name || U0.username || '', ar), first = nm0.n;
    const GR = (() => {
      const h = new Date().getHours(), per = h >= 5 && h < 12 ? 'm' : h >= 12 && h < 17 ? 'a' : 'e', g = nm0.g, f = g === 'f';
      let pool;
      if (isGuest) pool = ar ? ['مرحبًا بك ضيفنا', 'أهلًا بك ضيفنا', 'أهلًا وسهلًا بضيفنا'] : ['Welcome, guest', 'Hello, guest', 'Hi, guest'];
      else if (ar) {
        const y = first ? ' ' + first : '', ya = first ? ' يا ' + first : '', on = g ? (f ? ' عليكِ' : ' عليك') : '';
        const P = { m: 'صباح الخير' + on + ya, a: 'نهارك سعيد' + ya, e: 'مساء الخير' + on + ya };
        pool = [P[per], 'أهلًا' + y, (g ? (f ? 'مرحبًا بكِ' : 'مرحبًا بك') : 'مرحبًا') + y, (f ? 'أهلًا بعودتكِ' : 'أهلًا بعودتك') + y, (f ? 'نورتينا' : 'نورتنا') + ya, (f ? 'سعيد برؤيتكِ' : 'سعيد برؤيتك') + ya, 'يا هلا' + y, 'أهلًا وسهلًا' + y, (f ? 'حياكِ الله' : 'حياك الله') + y];
      } else {
        const E = { m: 'Good morning', a: 'Good afternoon', e: 'Good evening' }, any = ['Hey', 'Hello', 'Welcome back', "What's up", 'Nice to see you', 'Great to have you back', 'Hi there', 'Good to see you again'];
        pool = [E[per]].concat(any).map(s => s + (first ? ', ' + first : ''));
      }
      const kk = 'thGrt:' + thx.L + (isGuest ? 'g' : per);
      let i = 0; try { i = (parseInt(localStorage.getItem(kk) || '-1', 10) + 1) % pool.length; localStorage.setItem(kk, String(i)); } catch (e) { i = Math.floor(Math.random() * pool.length); }
      return pool[i];
    })();
    const SV = {
      plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
      mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
      stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>',
      go: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
      img: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.7"/><path d="M21 16l-5-5-8 9"/></svg>',
      shot: '<svg viewBox="0 0 24 24"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><rect x="8" y="9" width="8" height="6" rx="1.5"/></svg>',
      link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/></svg>',
      code: '<svg viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>'
    };
    b.innerHTML = '<div class="hm-w" dir="' + (ar ? 'rtl' : 'ltr') + '">' +
      '<div class="hm-hero">' +
        '<div class="hm-hi">' + thx.esc(GR) + (isGuest || ar ? '' : ',') + '<small>' + thx.esc(T.how) + '</small></div>' +
        '<div class="hm-bar" id="hmBar">' +
          '<button type="button" class="hm-ib2" id="hmPlus" aria-label="' + thx.esc(T.plus) + '">' + SV.plus + '</button>' +
          '<div class="hm-ib"><textarea class="hm-ta" id="hmTa" rows="1" dir="auto" aria-label="' + thx.esc(T.ask) + '"></textarea><div class="hm-ph" id="hmPh"><span></span></div></div>' +
          '<button type="button" class="hm-ib2 hm-go" id="hmGo" aria-label="' + thx.esc(T.send) + '">' + SV.go + '</button>' +
          '<button type="button" class="hm-ib2 hm-mic" id="hmMic" aria-label="' + thx.esc(T.mic) + '">' + SV.mic + '</button>' +
          '<div class="hm-menu" id="hmMenu" dir="' + (ar ? 'rtl' : 'ltr') + '">' +
            '<button type="button" data-a="img">' + SV.img + '<span>' + thx.esc(T.img) + '</span></button>' +
            '<button type="button" data-a="shot">' + SV.shot + '<span>' + thx.esc(T.shot) + '</span></button>' +
            '<button type="button" data-a="link">' + SV.link + '<span>' + thx.esc(T.link) + '</span></button>' +
            '<button type="button" data-a="code">' + SV.code + '<span>' + thx.esc(T.code) + '</span></button>' +
          '</div>' +
          '<div class="hm-pop" id="hmPop" dir="' + (ar ? 'rtl' : 'ltr') + '"></div>' +
          '<input type="file" id="hmFile" accept="image/*" hidden>' +
        '</div>' +
        '<div class="hm-att" id="hmAtt"></div>' +
        '<div class="hm-note" id="hmNote"></div>' +
        '<div class="hm-res" id="hmRes"></div>' +
        '<div class="hm-top" id="hmTop"></div>' +
      '</div></div>';


    const q = id => b.querySelector('#' + id), bar = q('hmBar'), ta = q('hmTa'), ph = q('hmPh').firstChild, note = q('hmNote'), res = q('hmRes'), att = q('hmAtt'),
      menu = q('hmMenu'), pop = q('hmPop'), file = q('hmFile'), mic = q('hmMic'), top = q('hmTop');
    let alive = true, rec = null, base = '', files = [];
    const say = m => { note.textContent = m || ''; };
    const sync = () => { bar.classList.toggle('has', !!ta.value.trim() || files.length > 0); };
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 150) + 'px'; };
    ta.addEventListener('input', () => { grow(); sync(); });

    /* ----- placeholder questions: typed fast, held two seconds, then gone; only the selected language. Tapping one opens its button ----- */
    let hqKey = '';
    q('hmPh').firstChild.addEventListener('click', e => { e.stopPropagation(); if (hqKey && ph.textContent) { if (window.thHit) window.thHit(hqKey); thx.openLayer(hqKey); } });
    (async () => {
      let i = 0; const box = q('hmPh');
      while (alive && b.isConnected) {
        if (document.hidden) { await sleep(500); continue; }
        const it = HQ[i++ % HQ.length], s = ar ? it[0] : it[1]; hqKey = it[2]; box.dir = ar ? 'rtl' : 'ltr';
        box.style.opacity = 1;
        for (let c = 1; c <= s.length && alive; c++) { ph.textContent = s.slice(0, c); await sleep(24); }
        await sleep(2000); box.style.opacity = 0; await sleep(350); ph.textContent = ''; hqKey = ''; await sleep(120);
      }
    })();

    /* ----- voice: written live while speaking (the browser's free speech recognition), then it stays editable ----- */
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let wantRec = false, recFail = 0, fatal = false;
    function micStop() { wantRec = false; if (rec) { try { rec.stop(); } catch (e) { } } }
    const recUi = on => { bar.classList.toggle('rec', on); mic.innerHTML = on ? SV.stop : SV.mic; mic.setAttribute('aria-label', on ? T.stop : T.mic); };
    const recMsg = c => c === 'not-allowed' || c === 'service-not-allowed' ? T.micDenied : c === 'audio-capture' ? T.noAudio : c === 'network' ? T.netErr : T.srErr + ' (' + c + ')';
    function recStart() {
      const my = new SR(), t0 = Date.now(); rec = my; my.lang = ar ? 'ar-EG' : 'en-US'; my.interimResults = true; my.continuous = true;
      base = ta.value ? ta.value.replace(/\s+$/, '') + ' ' : '';
      my.onresult = e => {
        let fin = '', tmp = '';
        for (let i = 0; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) fin += r[0].transcript; else tmp += r[0].transcript; }
        recFail = 0; say(''); ta.value = base + fin + tmp; grow(); sync();
      };
      my.onerror = e => { if (e.error === 'no-speech' || e.error === 'aborted') return; fatal = true; wantRec = false; say(recMsg(e.error)); };
      my.onend = () => {
        if (rec === my) rec = null;
        if (wantRec && alive && b.isConnected) {   /* the browser ended it by itself (a pause on a computer): keep listening */
          recFail = Date.now() - t0 < 1500 ? recFail + 1 : 0;
          if (recFail <= 3) { setTimeout(() => { if (wantRec && alive && !rec) recStart(); }, 250); return; }
          wantRec = false; say(T.noSpeech);
        }
        recUi(false); if (alive && !fatal) { if (!note.textContent || note.textContent === T.listening) say(''); ta.focus(); }
      };
      try { my.start(); recUi(true); say(T.listening); } catch (e) { rec = null; wantRec = false; recUi(false); say(T.srErr); }
    }
    mic.onclick = () => {
      if (rec || wantRec) { micStop(); return; }
      if (!SR) { say(T.noMic); return; }
      fatal = false; recFail = 0; wantRec = true; say(''); recStart();
    };

    /* ----- the + menu: image, screenshot, link, text or code ----- */
    const closeAll = () => { menu.classList.remove('on'); pop.classList.remove('on'); };
    const addAtt = a => { files.push(a); drawAtt(); sync(); };
    function drawAtt() {
      att.innerHTML = files.map((f, i) => '<span class="hm-chipa">' + (f.img ? '<img alt="" src="' + f.img + '">' : '<i>' + thx.esc(f.tag) + '</i>') + '<span>' + thx.esc(f.name) + '</span><button type="button" data-rm="' + i + '" aria-label="' + thx.esc(T.rm) + '">×</button></span>').join('');
    }
    att.addEventListener('click', e => { const x = e.target.closest('[data-rm]'); if (x) { files.splice(+x.dataset.rm, 1); drawAtt(); sync(); } });
    q('hmPlus').onclick = e => { e.stopPropagation(); pop.classList.remove('on'); menu.classList.toggle('on'); };
    b.firstChild.addEventListener('click', e => { if (!e.target.closest('#hmMenu,#hmPop,#hmPlus')) closeAll(); });
    file.onchange = () => { const f = file.files && file.files[0]; if (f) addAtt({ kind: 'image', name: f.name, img: URL.createObjectURL(f), file: f }); file.value = ''; };
    function textPop(kind) {
      const code = kind === 'code';
      pop.innerHTML = (code ? '<textarea id="hmPv" placeholder="' + thx.esc(T.codePh) + '"></textarea>' : '<input id="hmPv" type="url" placeholder="' + thx.esc(T.linkPh) + '">') + '<button type="button" class="btn" id="hmPa">' + thx.esc(T.add) + '</button>';
      menu.classList.remove('on'); pop.classList.add('on');
      const v = pop.querySelector('#hmPv'); setTimeout(() => v.focus(), 60);
      const done = () => { const val = v.value.trim(); if (!val) return; addAtt(code ? { kind: 'code', name: val.slice(0, 40), tag: '</>', text: val } : { kind: 'link', name: val, tag: '↗', url: val }); pop.classList.remove('on'); };
      pop.querySelector('#hmPa').onclick = done;
      if (!code) v.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); done(); } });
    }
    menu.addEventListener('click', async e => {
      const a = e.target.closest('[data-a]'); if (!a) return; const k = a.dataset.a;
      if (k === 'img') { menu.classList.remove('on'); file.click(); }
      else if (k === 'link' || k === 'code') textPop(k);
      else if (k === 'shot') {
        menu.classList.remove('on');
        if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) { say(T.noShot); file.click(); return; }
        try {
          const st = await navigator.mediaDevices.getDisplayMedia({ video: true }), v = document.createElement('video'); v.srcObject = st; v.muted = true; await v.play();
          await sleep(250); const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0);
          st.getTracks().forEach(t => t.stop());
          c.toBlob(bl => { if (bl) addAtt({ kind: 'screenshot', name: T.shot + '.png', img: URL.createObjectURL(bl), file: bl }); }, 'image/png');
        } catch (err) { /* cancelled */ }
      }
    });

    /* ----- search: finds the page that fits what was typed / said ----- */
    const norm = s => String(s).toLowerCase().replace(/[\u064B-\u065F\u0670]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
    function search() {
      micStop(); closeAll();
      const t = norm(ta.value.trim()); res.innerHTML = ''; say('');
      if (!t) return;
      const hits = Object.keys(HKW).filter(k => {
        const names = norm((thx.STR.ar['i_' + k] || '') + ' ' + (thx.STR.en['i_' + k] || '') + ' ' + HKW[k]);
        return names.split(/\s+/).some(w => w.length > 1 && (t.indexOf(w) >= 0 || (t.length > 2 && w.indexOf(t) >= 0)));
      });
      if (!hits.length) { say(T.none); return; }
      say(T.found); res.innerHTML = hits.slice(0, 4).map(k => '<button type="button" data-k="' + k + '">' + thx.esc(thx.STR[thx.L]['i_' + k]) + '</button>').join('');
    }
    res.addEventListener('click', e => { const x = e.target.closest('[data-k]'); if (x) thx.openLayer(x.dataset.k); });
    q('hmGo').onclick = search;
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); search(); } });

    /* ----- the student's own suggestions: the buttons he opens most (counted in Supabase, trainee_button_usage), straight under the bar ----- */
    const openTop = k => { if (window.thHit) window.thHit(k); thx.openLayer(k); };
    top.addEventListener('click', e => { const x = e.target.closest('[data-k]'); if (x) openTop(x.dataset.k); });
    res.addEventListener('click', e => { const x = e.target.closest('[data-k]'); if (x && window.thHit) window.thHit(x.dataset.k); }, true);
    (async () => {
      for (let n = 0; n < 20 && !window.thTopButtons; n++) await sleep(250);   /* the session script of home.html loads after this file */
      if (!window.thTopButtons || !alive || !b.isConnected) return;
      let keys = []; try { keys = await window.thTopButtons(4); } catch (e) { return; }
      if (!alive || !b.isConnected) return;
      top.innerHTML = (keys || []).filter(k => k !== 'home' && thx.IC[k] && thx.STR[thx.L]['i_' + k] && thx.R.querySelector('#side .sdi[data-k="' + k + '"]')).slice(0, 4)
        .map((k, i) => '<button type="button" data-k="' + k + '" style="animation-delay:' + (i * 70) + 'ms"><svg viewBox="0 0 24 24" aria-hidden="true">' + thx.IC[k] + '</svg><span>' + thx.esc(thx.STR[thx.L]['i_' + k]) + '</span></button>').join('');
    })();

    homeStop = () => { alive = false; micStop(); files.forEach(f => { if (f.img) { try { URL.revokeObjectURL(f.img); } catch (e) { } } }); homeStop = () => { }; };
  }

    /* ---- اللي index.html والملفات التانية بتستخدمه من الزرار ده ---- */
    return {
      id: 'home', render: renderHome,
      stop: function () { homeStop(); },
      get homeCss() { return homeCss; }
    };
  };
})();
