/* =====================================================================
   SIDEBAR BUTTON: home
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + الصفحة الرئيسية كلها (البحث، الكروت، السلايدز) + الشاشة بتاعته.
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
  /* ================= Home page (main page): welcome, smart search bar, quick buttons, service slides ================= */
  const HQ = window.THHomeQuestions || [
    ['ما الذي تقدمونه؟', 'What do you offer?'],
    ['كيف أبدأ معكم؟', 'How do I get started?'],
    ['ما هي خدمات الترجمة المتاحة؟', 'Which translation services are available?'],
    ['هل تقدمون تعليقًا صوتيًا؟', 'Do you provide voice over?'],
    ['ما اللغات التي تترجمون منها وإليها؟', 'Which languages do you translate?'],
    ['كم تستغرق الترجمة؟', 'How long does a translation take?'],
    ['ما هي الحلول الرقمية؟', 'What are your digital solutions?'],
    ['كيف أحجز استشارة شخصية؟', 'How do I book a personal consultation?'],
    ['ماذا تعرض لوحة التحكم؟', 'What does the dashboard show?'],
    ['كيف أتابع تقدمي؟', 'How can I track my progress?'],
    ['ما هو رفيق الإملاء؟', 'What is Dictation Pal?'],
    ['كيف تعمل غرفة المماراة؟', 'How does the Mirroring Room work?'],
    ['ما أسعار خدماتكم؟', 'What are your prices?'],
    ['هل يمكنني رفع ملف للترجمة؟', 'Can I upload a file for translation?'],
    ['ماذا يوجد في متجركم؟', 'What is in your store?'],
    ['كيف أتواصل مع فريق الدعم؟', 'How do I contact support?'],
    ['هل توجد دورات للمبتدئين؟', 'Are there courses for beginners?'],
    ['كيف أختار الخدمة المناسبة لي؟', 'How do I choose the right service?']
  ];
/* Drawn picture of the dashboard (numbers, charts) used as the background of the Digital Solutions card */
  const DASH_ART = (() => {
    const bars = [38, 62, 48, 80, 66, 92, 74].map((h, i) => '<rect x="' + (324 + i * 34) + '" y="' + (388 - h * 1.5) + '" width="20" height="' + (h * 1.5) + '" rx="5" fill="' + (i === 5 ? '#34d399' : '#2b8f6e') + '"/>').join('');
    const card = (x, v, l, c) => '<rect x="' + x + '" y="92" width="150" height="82" rx="14" fill="#18202a" stroke="#263241"/><text x="' + (x + 16) + '" y="126" font-size="13" fill="#8a97a8">' + l + '</text><text x="' + (x + 16) + '" y="158" font-size="30" font-weight="800" fill="' + c + '">' + v + '</text>';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="Inter,Arial,sans-serif">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34d399" stop-opacity=".45"/><stop offset="1" stop-color="#34d399" stop-opacity="0"/></linearGradient></defs>' +
      '<rect width="800" height="500" fill="#0e1319"/>' +
      '<rect x="0" y="0" width="86" height="500" fill="#121920"/><rect x="22" y="26" width="42" height="42" rx="12" fill="#34d399"/>' +
      [0, 1, 2, 3, 4].map(i => '<rect x="26" y="' + (100 + i * 52) + '" width="34" height="34" rx="10" fill="' + (i === 0 ? '#1f2c38' : '#161e27') + '"/>').join('') +
      '<text x="114" y="56" font-size="22" font-weight="800" fill="#e8eef5">Dashboard</text><rect x="620" y="34" width="150" height="30" rx="15" fill="#18202a"/><circle cx="748" cy="49" r="9" fill="#34d399"/>' +
      card(114, '87%', 'Progress', '#34d399') + card(280, '1,284', 'Words', '#e8eef5') + card(446, '36 h', 'Practice', '#60a5fa') + card(612, '12', 'Tasks', '#fbbf24') +
      '<rect x="114" y="196" width="190" height="196" rx="16" fill="#18202a" stroke="#263241"/><circle cx="209" cy="294" r="52" fill="none" stroke="#263241" stroke-width="16"/><circle cx="209" cy="294" r="52" fill="none" stroke="#34d399" stroke-width="16" stroke-linecap="round" stroke-dasharray="285 327" transform="rotate(-90 209 294)"/><text x="209" y="302" text-anchor="middle" font-size="24" font-weight="800" fill="#e8eef5">87%</text>' +
      '<rect x="320" y="196" width="450" height="196" rx="16" fill="#18202a" stroke="#263241"/>' + bars +
      '<path d="M334 340 L376 320 L418 332 L460 290 L502 304 L544 262 L586 276 L628 238 L670 250 L740 216 L740 380 L334 380 Z" fill="url(#g)" opacity=".7"/><path d="M334 340 L376 320 L418 332 L460 290 L502 304 L544 262 L586 276 L628 238 L670 250 L740 216" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="114" y="408" width="656" height="60" rx="14" fill="#18202a" stroke="#263241"/>' + [0, 1, 2, 3].map(i => '<rect x="136" y="' + (424 + 0) + '" width="0" height="0"/>').join('') +
      '<rect x="136" y="428" width="120" height="10" rx="5" fill="#2b3949"/><rect x="136" y="446" width="80" height="8" rx="4" fill="#223040"/><rect x="560" y="428" width="190" height="14" rx="7" fill="#263241"/><rect x="560" y="428" width="150" height="14" rx="7" fill="#34d399"/>' +
      '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  })();
const HS = [   /* slides: key = the page it opens; picture = assets/home/<key>.jpg (put the real screenshot there) */
    ['dash', 'لوحة التحكم', 'Dashboard', 'تابع تقدمك ومهامك ونتائجك في مكان واحد', 'Track your progress, tasks and results in one place'],
    ['translate', 'الترجمة', 'Translation', 'ترجمة دقيقة وسريعة بين اللغات التي تحتاجها', 'Accurate, fast translation between the languages you need'],
    ['voice', 'التعليق الصوتي', 'Voice Over', 'أصوات احترافية تمنح مشروعك حضورًا حقيقيًا', 'Professional voices that give your project real presence'],
    ['digital', 'الحلول الرقمية', 'Digital Solutions', 'أدوات وحلول رقمية مصممة حول احتياجك', 'Digital tools and solutions built around your needs'],
    ['consult', 'الاستشارة الشخصية', 'Personal Consultation', 'جلسة مباشرة لتحديد الخطوة التالية المناسبة لك', 'A one-to-one session to find your right next step'],
    ['store', 'متجرنا', 'Our Store', 'منتجات وموارد جاهزة لدعم رحلتك', 'Ready-made products and resources to support your journey']
  ];
const HKW = {   /* words that lead the search to a page */
    dash: 'لوحة تحكم تقدم متابعة dashboard progress', translate: 'ترجم ترجمة لغات ملف translat language file', voice: 'صوت تعليق voice',
    digital: 'رقمي رقمية حلول موقع تطبيق digital website app', consult: 'استشار حجز موعد consult book', store: 'متجر سعر أسعار اسعار store price shop',
    dict: 'إملاء املاء dictation', mirror: 'مماراة مرآة مرايا mirror', space: 'مساحة space', library: 'مكتبة وسائط media library', support: 'دعم مساعدة سياسات support help policy', ydict: 'قاموس كلماتي your dictionary', passist: 'نطق مساعد pronunciation assistant', train: 'تدريب دورة مبتدئ train course'
  };
const HT = {
    ar: { hi: 'مرحبًا بك', hiG: 'مرحبًا بك ضيفنا', how: 'كيف أستطيع مساعدتك اليوم؟', ask: 'اسأل أو ابحث…', plus: 'إضافة', img: 'صورة', shot: 'لقطة شاشة', link: 'رابط', code: 'نص أو كود', mic: 'تسجيل صوتي', stop: 'إيقاف',
      send: 'بحث', add: 'إضافة', linkPh: 'الصق الرابط هنا', codePh: 'الصق النص أو الكود هنا', b1: 'استعرض خدماتنا', b2: 'افتح لوحة التحكم', b3: 'احجز استشارة',
      noMic: 'التسجيل الصوتي غير مدعوم في هذا المتصفح. جرّب Chrome أو Edge أو Safari.', noAudio: 'لم أجد ميكروفونًا يعمل. تأكد من توصيله ومن اختياره في إعدادات الجهاز.', netErr: 'تعذّر الاتصال بخدمة التعرف على الصوت. تحقق من الإنترنت وحاول مرة أخرى.', srErr: 'تعذّر التعرف على الكلام', noSpeech: 'لم أسمع شيئًا. اضغط الميكروفون وتحدّث.', micDenied: 'لم يُسمح باستخدام الميكروفون.', noShot: 'التقاط الشاشة غير مدعوم هنا، اختر صورة بدلًا منها.',
      found: 'قد يساعدك هذا:', none: 'لم أجد خدمة مطابقة. جرّب كلمات أخرى أو تصفّح الخدمات بالأسفل.', att: 'مرفق', rm: 'إزالة', listening: 'جارٍ الاستماع…' },
    en: { hi: 'Welcome', hiG: 'Hello guest', how: 'How can I help you today?', ask: 'Ask or search…', plus: 'Add', img: 'Image', shot: 'Screenshot', link: 'Link', code: 'Text or code', mic: 'Record voice', stop: 'Stop',
      send: 'Search', add: 'Add', linkPh: 'Paste the link here', codePh: 'Paste text or code here', b1: 'Explore our services', b2: 'Open the dashboard', b3: 'Book a consultation',
      noMic: 'Voice recording is not supported in this browser. Try Chrome, Edge or Safari.', noAudio: 'No working microphone found. Check it is connected and selected in your device settings.', netErr: 'Could not reach the speech service. Check your internet and try again.', srErr: 'Speech recognition problem', noSpeech: 'I did not hear anything. Press the microphone and speak.', micDenied: 'Microphone access was not allowed.', noShot: 'Screen capture is not supported here, choose an image instead.',
      found: 'This may help:', none: 'No matching service found. Try other words or browse the services below.', att: 'Attachment', rm: 'Remove', listening: 'Listening…' }
  };
let homeStop = () => { };   /* stops the typing loop, the slide timer and the microphone of the page that is leaving */

  function homeCss() {
    if (thx.R.getElementById('thHomeCss')) return;
    const st = document.createElement('style'); st.id = 'thHomeCss';
    st.textContent = `
      .sdi.hm{width:auto;display:inline-flex;height:38px;margin:0 4px 12px;padding:0 18px 0 14px;border-radius:999px;background:var(--chip);border:1px solid var(--sbd);gap:10px;font-weight:800}.sdi.hm span{flex:none}.sdi.hm svg{width:19px;height:19px}.sdi.hm.on{background:var(--btn);color:var(--onbtn)}
      .hm-w{min-height:100%;display:flex;flex-direction:column;align-items:center;padding:0 0 40px}
      .hm-hero{width:100%;max-width:760px;min-height:min(62vh,560px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:48px 14px 30px;text-align:center}
      .hm-hi{font:800 clamp(26px,4.6vw,40px)/1.3 Cairo,Inter,sans-serif;color:var(--ink);letter-spacing:.005em}
      .hm-hi small{display:block;margin-top:6px;font:600 clamp(15px,2.3vw,20px) Cairo,Inter,sans-serif;color:var(--ink2)}
      .hm-bar{position:relative;width:100%;direction:ltr;display:flex;align-items:flex-end;gap:6px;padding:8px;border-radius:30px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);box-shadow:0 10px 34px rgba(0,0,0,.14);transition:box-shadow .5s var(--ease),border-color .4s ease}
      .hm-bar:focus-within{border-color:var(--gbd);box-shadow:0 14px 44px rgba(0,0,0,.24)}
      .hm-ib{position:relative;flex:1;min-width:0;min-height:44px;display:flex;align-items:center}
      .hm-ta{width:100%;max-height:150px;min-height:44px;padding:11px 4px;border:0;outline:0;resize:none;background:transparent;color:var(--ink);font:600 15.5px/1.5 Cairo,Inter,sans-serif;text-align:start;unicode-bidi:plaintext}
      .hm-ph{position:absolute;inset:0 4px;display:flex;align-items:center;pointer-events:none;color:var(--ink2);font:600 15.5px Cairo,Inter,sans-serif;white-space:nowrap;overflow:hidden;opacity:0;transition:opacity .3s ease}
      .hm-ph span{overflow:hidden;text-overflow:ellipsis;max-width:100%}
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
      .hm-qb{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;width:100%}
      .hm-qb button{height:40px;padding:0 18px;border-radius:999px;border:1px solid var(--sbd);background:var(--chip);color:var(--ink);font:700 13px Cairo,Inter,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .3s,scale .8s var(--ease)}
      @media(hover:hover){.hm-qb button:hover{background:var(--gbg);scale:1.04}}
      .hm-qb button:active{scale:.95;transition:scale .3s ease-out}
      .hm-res{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
      .hm-res button{height:36px;padding:0 16px;border-radius:999px;border:1px solid var(--gbd);background:var(--btn);color:var(--onbtn);font:800 12.5px Cairo,Inter,sans-serif;cursor:pointer}
      .hm-sl{width:100%;max-width:1100px;display:flex;flex-direction:column;gap:14px;align-items:center}
      .hm-row{width:100%;direction:ltr;display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px 6px}
      .hm-row::-webkit-scrollbar{display:none}
      .hm-s{position:relative;flex:0 0 min(88%,560px);aspect-ratio:16/10;scroll-snap-align:center;border-radius:26px;overflow:hidden;border:1px solid var(--sbd);cursor:pointer;text-align:start;color:#fff;display:flex;align-items:flex-end;padding:0;-webkit-tap-highlight-color:transparent;background-color:#2a2d38;background-size:cover;background-position:center;transition:scale .9s var(--ease)}
      @media(hover:hover){.hm-s:hover{scale:1.015}}
      .hm-s:active{scale:.985;transition:scale .4s ease-out}
      .hm-s div{width:100%;padding:44px 22px 20px;background:linear-gradient(0deg,rgba(8,10,16,.88) 0%,rgba(8,10,16,.55) 55%,rgba(8,10,16,0) 100%)}
      .hm-s b{display:block;font:800 clamp(19px,3vw,26px) Cairo,Inter,sans-serif;margin-bottom:4px}
      .hm-s span{display:block;font:600 clamp(13px,1.9vw,15.5px)/1.55 Cairo,Inter,sans-serif;color:rgba(255,255,255,.86)}
      .hm-dots{display:flex;gap:8px}
      .hm-dots i{width:7px;height:7px;border-radius:50%;background:var(--ink2);opacity:.35;transition:opacity .4s ease,width .5s var(--ease),border-radius .5s var(--ease)}
      .hm-dots i.on{opacity:.95;width:22px;border-radius:6px}
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
        '<div class="hm-qb"><button type="button" data-q="svc">' + thx.esc(T.b1) + '</button><button type="button" data-q="dash">' + thx.esc(T.b2) + '</button><button type="button" data-q="consult">' + thx.esc(T.b3) + '</button></div>' +
      '</div>' +
      '<div class="hm-sl" id="hmSl"><div class="hm-row" id="hmRow">' +
        HS.map(s => '<button type="button" class="hm-s" data-k="' + s[0] + '" dir="' + (ar ? 'rtl' : 'ltr') + '" style="background-image:linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,0)),url(' + (s[0] === 'digital' ? '"' + DASH_ART + '"' : 'assets/home/' + s[0] + '.jpg') + '),linear-gradient(150deg,#5a6070,#2a2d38)"><div><b>' + thx.esc(ar ? s[1] : s[2]) + '</b><span>' + thx.esc(ar ? s[3] : s[4]) + '</span></div></button>').join('') +
      '</div><div class="hm-dots" id="hmDots">' + HS.map(() => '<i></i>').join('') + '</div></div></div>';

    const q = id => b.querySelector('#' + id), bar = q('hmBar'), ta = q('hmTa'), ph = q('hmPh').firstChild, note = q('hmNote'), res = q('hmRes'), att = q('hmAtt'),
      menu = q('hmMenu'), pop = q('hmPop'), file = q('hmFile'), mic = q('hmMic'), row = q('hmRow'), dots = [...q('hmDots').children];
    let alive = true, rec = null, base = '', files = [], timer = 0;
    const say = m => { note.textContent = m || ''; };
    const sync = () => { bar.classList.toggle('has', !!ta.value.trim() || files.length > 0); };
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 150) + 'px'; };
    ta.addEventListener('input', () => { grow(); sync(); });

    /* ----- placeholder questions: typed fast, held two seconds, then gone; Arabic then its English twin ----- */
    (async () => {
      const list = HQ.map(p => ar ? p[0] : p[1]);   /* only the language that is selected */
      let i = 0; const box = q('hmPh');
      while (alive && b.isConnected) {
        if (document.hidden) { await sleep(500); continue; }
        const s = list[i++ % list.length]; box.dir = /[\u0600-\u06FF]/.test(s) ? 'rtl' : 'ltr';
        box.style.opacity = 1;
        for (let c = 1; c <= s.length && alive; c++) { ph.textContent = s.slice(0, c); await sleep(24); }
        await sleep(2000); box.style.opacity = 0; await sleep(350); ph.textContent = ''; await sleep(120);
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

    /* ----- three quick buttons ----- */
    b.querySelector('.hm-qb').addEventListener('click', e => {
      const x = e.target.closest('[data-q]'); if (!x) return;
      if (x.dataset.q === 'svc') q('hmSl').scrollIntoView({ behavior: 'smooth', block: 'start' }); else thx.openLayer(x.dataset.q);
    });

    /* ----- service slides ----- */
    row.addEventListener('click', e => { const s = e.target.closest('.hm-s'); if (s) thx.openLayer(s.dataset.k); });
    const slides = [...row.children];
    const cur2 = () => { const mid = row.scrollLeft + row.clientWidth / 2; let bi = 0, bd = 1e9; slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid); if (d < bd) { bd = d; bi = i; } }); return bi; };
    const mark = () => { const c = cur2(); dots.forEach((d, i) => d.classList.toggle('on', i === c)); };
    const go2 = i => { const s = slides[i]; if (s) row.scrollTo({ left: s.offsetLeft - (row.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' }); };
    row.addEventListener('scroll', mark, { passive: true }); mark();
    let held = false; ['pointerenter', 'pointerdown', 'touchstart'].forEach(ev => row.addEventListener(ev, () => { held = true; }, { passive: true }));
    ['pointerleave', 'touchend'].forEach(ev => row.addEventListener(ev, () => { held = false; }, { passive: true }));
    timer = setInterval(() => { if (!alive || !b.isConnected) { clearInterval(timer); return; } if (held || document.hidden) return; go2((cur2() + 1) % slides.length); }, 5200);

    homeStop = () => { alive = false; clearInterval(timer); micStop(); files.forEach(f => { if (f.img) { try { URL.revokeObjectURL(f.img); } catch (e) { } } }); homeStop = () => { }; };
  }

    /* ---- اللي index.html والملفات التانية بتستخدمه من الزرار ده ---- */
    return {
      id: 'home', render: renderHome,
      stop: function () { homeStop(); },
      get homeCss() { return homeCss; }
    };
  };
})();
