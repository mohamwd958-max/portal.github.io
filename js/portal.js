/* THABIT Portal JavaScript — separated from portal.html */
try {
    if (localStorage.getItem('thabit_theme') === 'light') {
        document.body.classList.add('light-theme');
    }
} catch (e) {}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdTjCpH7KYgNX0jV_rOmupRF2kaR1CH6RtH0wTkOccqmyuIB4zsmUD0GqKPrxaiBqd-A/exec";

const PAGE_I18N = {
    en: {
        loginTitle: "Login",
        username: "Username",
        usernamePh: "Enter username...",
        password: "Password",
        passwordPh: "Enter password...",
        getIn: "Get In",
        checking: "Checking...",
        notYet: "Not a Thabit Yet ?",
        servicesDesc: "Pick your time slot, upload the required files, and confirm your payment with ease.",
        wantJoin: "Want to join ?",
        bookingPortal: "Direct Booking Portal",
        aboutTitle: "About Us",
        aboutDesc: "THABIT is a state-of-the-art educational ecosystem built to bridge the gap between mentors and trainees.",
        clickView: "Click to view",
        assistShort: "Assistant",
        assistTitle: "Pronunciation Assistant",
        themeTitle: "Light / Dark",
        errEmpty: "Please enter username and password!",
        welcome: "Welcome, {name}! Redirecting...",
        errWrong: "Wrong username or password!",
        errConn: "Could not reach the database, check your connection."
    },
    ar: {
        loginTitle: "تسجيل الدخول",
        username: "اسم المستخدم",
        usernamePh: "أدخل اسم المستخدم...",
        password: "كلمة المرور",
        passwordPh: "أدخل كلمة المرور...",
        getIn: "دخول",
        checking: "جارٍ التحقق...",
        notYet: "لست من ثابت بعد؟",
        servicesDesc: "قم باختيار ميعادك، ورفع الملفات المطلوبة، وإثبات الدفع بكل سهولة ويسر.",
        wantJoin: "هل تريد الانضمام؟",
        bookingPortal: "بوابة الحجز المباشر",
        aboutTitle: "من نحن",
        aboutDesc: "ثابت منظومة تعليمية متطورة صُممت لسد الفجوة بين المدربين والمتدربين.",
        clickView: "اضغط للعرض",
        assistShort: "المساعد",
        assistTitle: "مساعد النطق",
        themeTitle: "فاتح / داكن",
        errEmpty: "من فضلك أدخل اسم المستخدم وكلمة المرور!",
        welcome: "أهلاً بك، {name}! جارٍ التحويل...",
        errWrong: "خطأ في اسم المستخدم أو كلمة المرور!",
        errConn: "تعذر الاتصال بقاعدة البيانات، تأكد من الاتصال."
    },
    eg: {
        loginTitle: "دخول",
        username: "اسم المستخدم",
        usernamePh: "اكتب اسم المستخدم...",
        password: "الباسورد",
        passwordPh: "اكتب الباسورد...",
        getIn: "ادخل",
        checking: "بنتأكد...",
        notYet: "لسه مش من ثابت؟",
        servicesDesc: "اختار ميعادك، وارفع الملفات المطلوبة، وأثبت الدفع بكل سهولة.",
        wantJoin: "عايز تنضم؟",
        bookingPortal: "بوابة الحجز المباشر",
        aboutTitle: "احنا مين",
        aboutDesc: "ثابت منظومة تعليمية متطورة اتعملت عشان تقرّب بين المدرب والمتدرب.",
        clickView: "دوس عشان تشوف",
        assistShort: "المساعد",
        assistTitle: "مساعد النطق",
        themeTitle: "فاتح / داكن",
        errEmpty: "اكتب اسم المستخدم والباسورد!",
        welcome: "أهلاً يا {name}! جاري التحويل...",
        errWrong: "اسم المستخدم أو الباسورد غلط!",
        errConn: "مش قادر أوصل للداتابيز، اتأكد من النت."
    }
};

let currentLang = 'en';
let isLightTheme = false;

function thabitSave(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
}

function thabitLoad(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
}

function applyTheme(light) {
    isLightTheme = light;
    document.body.classList.toggle('light-theme', light);
    const ic = document.getElementById('themeIcon');
    if (ic) ic.className = light ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function toggleTheme() {
    applyTheme(!isLightTheme);
    thabitSave('thabit_theme', isLightTheme ? 'light' : 'dark');
}

function setLanguage(lang) {
    if (!PAGE_I18N[lang]) lang = 'en';
    currentLang = lang;
    thabitSave('thabit_lang', lang);

    const ids = { ar: 'floatBtnAr', en: 'floatBtnEn', eg: 'floatBtnEg' };
    Object.keys(ids).forEach(k => {
        const b = document.getElementById(ids[k]);
        if (b) b.classList.toggle('active', k === lang);
    });

    const root = document.documentElement;
    root.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
    root.setAttribute('lang', lang === 'ar' ? 'ar' : (lang === 'eg' ? 'arz' : 'en'));

    const t = PAGE_I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const v = t[el.dataset.i18n];
        if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const v = t[el.dataset.i18nPh];
        if (v !== undefined) el.placeholder = v;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const v = t[el.dataset.i18nTitle];
        if (v !== undefined) el.title = v;
    });

    if (typeof onLanguageApplied === 'function') onLanguageApplied(lang, t);
    if (typeof applyReportLanguage === 'function') applyReportLanguage();
}

function initThabitUI() {
    applyTheme(thabitLoad('thabit_theme') === 'light');
    const saved = thabitLoad('thabit_lang');
    setLanguage(saved && PAGE_I18N[saved] ? saved : 'en');
    
    // لو في جلسة سابقة (أدمن/ترينر أو متدرب) حوّله فوراً لصفحته حسب دوره
    resumeSession();
}

function runCinematicIntro() {
    const introOverlay = document.getElementById('cinematicIntroOverlay');
    const loginScreen = document.getElementById('login-screen');
    if (!introOverlay || !loginScreen) return;

    loginScreen.classList.remove('page-content-hidden');
    loginScreen.classList.add('page-content-visible', 'active');
    window.setTimeout(() => {
        introOverlay.classList.add('fade-out');
        window.setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 260);
    }, 820);
}

function switchPortalCard(cardName, event) {
    const cardLogin = document.getElementById('cardLogin');
    if (cardLogin) {
        cardLogin.classList.add('active-card', 'card-pinned');
        cardLogin.classList.remove('side-card');
    }
    const target = event && event.target;
    const clickedInteractive = target && target.closest('input, button, a, textarea, select, label');
    const username = document.getElementById('username');
    if (!clickedInteractive && username) {
        try { username.focus({ preventScroll: true }); } catch (_) { username.focus(); }
        try { const end = username.value.length; username.setSelectionRange(end, end); } catch (_) {}
    }
}

function togglePassVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

/* ===================== ROLE-AWARE LOGIN =====================
   admin   -> Admin Panel          (only the owner)
   trainer -> Trainer page         (future; NEVER the admin panel)
   trainee -> Dashboard
   The role always comes from the database (my_role()), never from the browser. */
const ROLE_ROUTES = {
    admin:   'adminpanel.html',
    trainer: 'trainer.html',      // صفحة الترينر مستقبلاً
    trainee: 'dashboard.html'
};
const STAFF_SESSION_KEYS = {
    admin:   'thabit_admin_session',            // نفس المفتاح والصيغة اللي لوحة الأدمن بتقراها
    trainer: 'thabit_trainer_session'
};

function sbHeaders(token) {
    return {
        apikey: REPORT_SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + (token || REPORT_SUPABASE_ANON_KEY),
        'Content-Type': 'application/json'
    };
}

async function staffSignIn(email, password) {
    const r = await fetch(`${REPORT_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST', headers: sbHeaders(), body: JSON.stringify({ email: email, password: password })
    });
    const j = await r.json().catch(() => null);
    if (r.ok && j && j.access_token) return { ok: true, session: j };
    return { ok: false, status: r.status };
}

async function fetchMyRole(accessToken) {
    try {
        const r = await fetch(`${REPORT_SUPABASE_URL}/rest/v1/rpc/my_role`, {
            method: 'POST', headers: sbHeaders(accessToken), body: '{}'
        });
        if (!r.ok) return null;
        const role = await r.json().catch(() => null);
        return (role === 'admin' || role === 'trainer') ? role : null;
    } catch (e) { return null; }
}

function saveStaffSession(j, role) {
    // Keep both schemas: portal.js uses access/refresh/exp,
    // while adminpanel.js expects access_token/refresh_token/expires_at.
    const expiresAtMs = Date.now() + (j.expires_in || 3600) * 1000;
    const sess = {
        access: j.access_token,
        refresh: j.refresh_token,
        exp: expiresAtMs,
        access_token: j.access_token,
        refresh_token: j.refresh_token,
        expires_at: Math.floor(expiresAtMs / 1000)
    };
    try { sessionStorage.setItem(STAFF_SESSION_KEYS[role], JSON.stringify(sess)); } catch (e) {}
}

/* Safe auto-redirect: only leave the portal if the target page really exists.
   Otherwise stay here (a wrong path used to send everyone to a GitHub 404 on every visit). */
async function goIfExists(url) {
    try {
        const r = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        if (r.ok) { window.location.href = url; return true; }
        console.error('[Thabit] Auto-redirect skipped, page not found (' + r.status + '): ' + new URL(url, location.href).href);
    } catch (e) {
        console.error('[Thabit] Auto-redirect skipped, request failed for ' + url, e);
    }
    return false;
}

async function resumeSession() {
    try {
        for (const role of ['admin', 'trainer']) {
            let s = null;
            try { s = JSON.parse(sessionStorage.getItem(STAFF_SESSION_KEYS[role]) || 'null'); } catch (e) {}
            if (s && s.access && s.exp > Date.now() + 30000) {
                const real = await fetchMyRole(s.access);
                if (real === role) { if (await goIfExists(ROLE_ROUTES[role])) return; }
                try { sessionStorage.removeItem(STAFF_SESSION_KEYS[role]); } catch (e) {}
            }
        }
    } catch (e) {}
    if (localStorage.getItem('thabit_trainee_token')) await goIfExists(ROLE_ROUTES.trainee);
}

async function handleLogin() {
    const t = PAGE_I18N[currentLang];
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const alertBox = document.getElementById('webAlertBox');
    const btn = document.getElementById('btnLoginBtn');

    const say = (msg, kind, ms) => {
        alertBox.innerText = msg;
        alertBox.className = 'show ' + (kind === 'ok' ? 'alert-success' : 'alert-error');
        if (ms) setTimeout(() => { alertBox.classList.remove('show'); }, ms);
    };
    const reset = () => { btn.innerText = t.getIn; btn.disabled = false; };

    if (!u || !p) { say(t.errEmpty, 'err', 3000); return; }

    btn.innerText = t.checking;
    btn.disabled = true;

    try {
        // 1) أي إدخال فيه @ -> جرّب دخول الأدمن/الترينر عبر Supabase Auth (حتى لو @thabit.com)
        if (u.includes('@')) {
            const res = await staffSignIn(u, p);
            if (res.ok) {
                const role = await fetchMyRole(res.session.access_token);
                if (role) {
                    saveStaffSession(res.session, role);
                    say(t.welcome.replace('{name}', u.split('@')[0]), 'ok');
                    setTimeout(() => { window.location.href = ROLE_ROUTES[role]; }, 800);
                    return;
                }
                // مسجّل في Auth لكن مش أدمن ولا ترينر -> ارفض
                say(t.errWrong, 'err', 4000); reset(); return;
            }
            if (res.status === 429) { say('Too many attempts. Try again in 15 minutes.', 'err', 4000); reset(); return; }
            // فشل دخول الستاف -> ممكن يكون متدرب بإيميل مخصص، كمّل لمسار المتدرب
        }

        // 2) مسار المتدرب (زي ما كان)
        const uname = u.includes('@') ? u : u + '@thabit.com';
        const response = await fetch(`${REPORT_SUPABASE_URL}/rest/v1/rpc/trainee_login`, {
            method: 'POST',
            headers: sbHeaders(),
            body: JSON.stringify({ p_username: uname, p_password: p })
        });
        const data = await response.json().catch(() => null);

        if (response.ok && data && data.token) {
            say(t.welcome.replace('{name}', data.profile.trainee), 'ok');
            localStorage.setItem('thabit_trainee_token', data.token);
            localStorage.setItem('currentTrainee', JSON.stringify(data.profile));
            setTimeout(() => { window.location.href = ROLE_ROUTES.trainee; }, 1000);
        } else {
            let msg = t.errWrong;
            if (data && data.message === 'too_many_attempts') msg = 'Too many attempts. Try again in 15 minutes.';
            else if (!response.ok) msg = 'Server error ' + response.status + ': ' + ((data && (data.message || data.hint || data.error)) || 'unknown');
            console.warn('trainee_login response:', response.status, data);
            say(msg, 'err', 4000);
            reset();
        }
    } catch (err) {
        console.error('login failed:', err);
        say(t.errConn + ' (' + (err && err.message) + ')', 'err', 4000);
        reset();
    }
}

function initThabitLogoAction() {
    const logo = document.getElementById('thabitPortalLogo');
    if (!logo || logo.dataset.actionReady === 'true') return;

    logo.dataset.actionReady = 'true';
    const returnToPortal = () => window.location.reload();

    logo.addEventListener('click', returnToPortal);
    logo.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            returnToPortal();
        }
    });
} 

window.addEventListener('load', () => {
    try { initThabitUI(); } catch (e) { console.error('THABIT UI init failed:', e); }
    try { initThabitLogoAction(); } catch (e) { console.error('THABIT logo init failed:', e); }
    try { initReportModal(); } catch (e) { console.error('THABIT report init failed:', e); }
    try { runCinematicIntro(); } catch (e) { console.error('THABIT intro init failed:', e); }
});


/* ---------- Supabase & Admin Panel Shared Logic (Disabled admin button mounting) ---------- */
(function(){
  var SB="https://vkfexceitwjmxncwceqb.supabase.co";
  var KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
  var SESSKEY="thabit_admin_session";
  var $=function(i){return document.getElementById(i)};
  function H(x){var h={apikey:KEY,Authorization:"Bearer "+KEY};for(var k in x)h[k]=x[k];return h}
  var defs={},order=[],over={},hooks=[];
  try{over=JSON.parse(localStorage.getItem("thabit_cms")||"{}")||{}}catch(e){over={}}
  function lang(){try{return localStorage.getItem("thabit_lang")||"en"}catch(e){return"en"}}
  function cache(){try{localStorage.setItem("thabit_cms",JSON.stringify(over))}catch(e){}}
  function R(key,label,type,page,def,hint){defs[key]={label:label,type:type,page:page,def:def,hint:hint||""};order.push(key)}
  function defOf(k){var d=defs[k];if(!d)return"";var v=d.def;if(typeof v==="function")v=v(lang());else if(v&&typeof v&&typeof v==="object")v=v[lang()]||v.en;return v==null?"":v}
  function hasOv(k){return over[k]!==undefined&&over[k]!==""}
  function get(k){return hasOv(k)?over[k]:defOf(k)}
  function sub(s){return String(s).replace(/\{fee\}/g,get("pl.lateFee")).replace(/\{price\}/g,get("pl.price"))}
  function apply(){
    document.querySelectorAll("[data-cms]").forEach(function(el){
      var k=el.getAttribute("data-cms"),d=defs[k];if(!d)return;
      if(el.hasAttribute("data-cms-ov")&&!hasOv(k))return;
      var v=get(k);
      if(d.type==="image"){if(v){el.src=v;el.style.display=""}else{el.removeAttribute("src");el.style.display="none"}}
      else if(d.type==="list"){el.innerHTML="";String(v).split("\n").forEach(function(s){if(!s.trim())return;var li=document.createElement("li");li.textContent=sub(s.trim());el.appendChild(li)})}
      else el.textContent=sub(v);
    });
    hooks.forEach(function(f){try{f()}catch(e){}});
  }
  function sess(){try{return JSON.parse(sessionStorage.getItem(SESSKEY)||"null")}catch(e){return null}}
  function setSess(x){try{if(x)sessionStorage.setItem(SESSKEY,JSON.stringify(x));else sessionStorage.removeItem(SESSKEY)}catch(e){}}
  function keep(j){setSess({access:j.access_token,refresh:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000})}
  function ensure(){
    var x=sess();if(!x)return Promise.resolve(null);
    if(x.exp>Date.now()+30000)return Promise.resolve(x.access);
    return fetch(SB+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:H({"Content-Type":"application/json"}),body:JSON.stringify({refresh_token:x.refresh})}).then(function(r){return r.ok?r.json():null}).then(function(j){if(!j||!j.access_token){setSess(null);return null}keep(j);return j.access_token}).catch(function(){return null});
  }
  function adminFetch(url,o){return ensure().then(function(t){if(!t)throw new Error("auth");o=o||{};o.headers=Object.assign({apikey:KEY,Authorization:"Bearer "+t},o.headers||{});return fetch(url,o)})}
  function load(){
    return fetch(SB+"/rest/v1/site_content?select=key,value",{headers:H()}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(rows){var m={};rows.forEach(function(r){m[r.key]=r.value});over=m;cache();apply()}).catch(function(){})
  }

  R("portal.servicesDesc","Booking card text","textarea","Portal",{en:"Pick your time slot, upload the required files, and confirm your payment with ease.",ar:"قم باختيار ميعادك، ورفع الملفات المطلوبة، وإثبات الدفع بكل سهولة ويسر.",eg:"اختار ميعادك، وارفع الملفات المطلوبة، وأثبت الدفع بكل سهولة."});
  R("portal.aboutDesc","About Us text","textarea","Portal",{en:"THABIT is a state-of-the-art educational ecosystem built to bridge the gap between mentors and trainees.",ar:"ثابت منظومة تعليمية متطورة صُممت لسد الفجوة بين المدربين والمتدربين.",eg:"ثابت منظومة تعليمية متطورة اتعملت عشان تقرّب بين المدرب والمتدرب."});
  R("dash.subtitle","Dashboard subtitle","text","Dashboard",{en:"Your personal trainee dashboard in the Thabit system",ar:"لوحة قيادة المتدرب الخاصة بك في نظام Thabit",eg:"لوحة التحكم بتاعتك كمتدرب في نظام Thabit"});
  R("assist.headerSub","Assistant header subtitle","text","Assistant",{en:"pronounce on the go",ar:"انطق وأنت في طريقك",eg:"انطق وانت ماشي"});

  function mount(){
    // تم إلغاء إضافة زر الـ Admin Panel نهائياً بناءً على طلبك
  }
  mount();
  apply();load();
})();


/* Failsafe: ensure the login screen is visible if initialization is delayed. */
setTimeout(function () {
            var o = document.getElementById('cinematicIntroOverlay');
            var s = document.getElementById('login-screen');
            if (o) o.style.display = 'none';
            if (s) { s.classList.remove('page-content-hidden'); s.classList.add('page-content-visible', 'active'); }
        }, 1800);


/* ===== Report a problem — copied from Overall's modal flow ===== */
const REPORT_SUPABASE_URL = "https://vkfexceitwjmxncwceqb.supabase.co";
const REPORT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
let lastReportAt = 0;

function reportText(key) {
    const lang = currentLang || thabitLoad('thabit_lang') || 'en';
    const texts = {
      en: {
        title:'Report a problem', intro:'Tell us exactly what happened so we can fix it.',
        name:'Your name', namePh:'Enter your name...', details:'What exactly is the problem?',
        detailsPh:'Describe what you did, what you expected, and what happened instead...',
        cancel:'Cancel', send:'Send', nameReq:'Please enter your name.',
        problemReq:'Please describe the problem in detail (at least a few words).',
        wait:'Please wait a moment before sending another report.',
        sent:'Your report was sent. Thank you!', fail:'Could not send the report. Please try again.'
      },
      ar: {
        title:'الإبلاغ عن مشكلة', intro:'اشرح لنا ما حدث بالتفصيل حتى نتمكن من إصلاحه.',
        name:'اسمك', namePh:'اكتب اسمك...', details:'ما المشكلة بالتحديد؟',
        detailsPh:'اشرح ما فعلته، وما كنت تتوقعه، وما الذي حدث بدلاً من ذلك...',
        cancel:'إلغاء', send:'إرسال', nameReq:'من فضلك اكتب اسمك.',
        problemReq:'من فضلك اشرح المشكلة بالتفصيل (بضع كلمات على الأقل).',
        wait:'انتظر لحظة قبل إرسال بلاغ آخر.',
        sent:'تم إرسال بلاغك. شكرًا لك!', fail:'تعذر إرسال البلاغ، حاول مرة أخرى.'
      },
      eg: {
        title:'بلّغ عن مشكلة', intro:'احكيلنا اللي حصل بالتفصيل عشان نصلحه.',
        name:'اسمك', namePh:'اكتب اسمك هنا...', details:'إيه المشكلة بالظبط؟',
        detailsPh:'احكي عملت إيه، وكنت مستني إيه، وإيه اللي حصل بدل كده...',
        cancel:'إلغاء', send:'ابعت', nameReq:'اكتب اسمك الأول.',
        problemReq:'احكي المشكلة بالتفصيل (كام كلمة على الأقل).',
        wait:'استنى شوية قبل ما تبعت بلاغ تاني.',
        sent:'بلاغك وصل. شكرًا ليك!', fail:'مقدرتش أبعت البلاغ، جرّب تاني.'
      }
    };
    const t = texts[lang] || texts.en;
    return t[key] || texts.en[key] || key;
}
function applyReportLanguage() {
    const map = {
      rpTitle:'title', rpIntro:'intro', rpNameLabel:'name', rpDetailsLabel:'details',
      rpSendLabel:'send', rpCancelBtn:'cancel'
    };
    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'rpCancelBtn') el.textContent = reportText('cancel');
        else el.textContent = reportText(map[id]);
      }
    });
    const n = document.getElementById('rpName');
    const p = document.getElementById('rpProblem');
    if (n) n.placeholder = reportText('namePh');
    if (p) p.placeholder = reportText('detailsPh');
    const overlay = document.getElementById('reportOverlay');
    if (overlay) overlay.dir = (currentLang === 'en') ? 'ltr' : 'rtl';
}
function openReportModal() {
    const name = document.getElementById('rpName');
    const problem = document.getElementById('rpProblem');
    const username = document.getElementById('username');
    const err = document.getElementById('rpErr');
    if (!name || !problem) return;
    name.value = username ? username.value.trim() : '';
    problem.value = '';
    err.textContent = '';
    applyReportLanguage();
    document.getElementById('reportOverlay').classList.add('open');
    window.setTimeout(() => (name.value ? problem : name).focus(), 80);
}
function closeReportModal() {
    const overlay = document.getElementById('reportOverlay');
    if (overlay) overlay.classList.remove('open');
}
function showReportToast(message, type) {
    const el = document.getElementById('reportToast');
    if (!el) return;
    el.textContent = message;
    el.className = 'show ' + (type === 'error' ? 'error' : 'success');
    clearTimeout(showReportToast.timer);
    showReportToast.timer = setTimeout(() => { el.className = ''; }, 3000);
}
async function submitReport() {
    const nameEl = document.getElementById('rpName');
    const probEl = document.getElementById('rpProblem');
    const err = document.getElementById('rpErr');
    const btn = document.getElementById('rpSendBtn');
    const name = nameEl.value.trim();
    const problem = probEl.value.trim();
    if (!name) { err.textContent = reportText('nameReq'); nameEl.focus(); return; }
    if (problem.length < 10) { err.textContent = reportText('problemReq'); probEl.focus(); return; }
    if (Date.now() - lastReportAt < 20000) { err.textContent = reportText('wait'); return; }
    err.textContent = '';
    btn.disabled = true;
    const hdrs = {
      'Content-Type':'application/json',
      apikey:REPORT_SUPABASE_ANON_KEY,
      Authorization:'Bearer ' + REPORT_SUPABASE_ANON_KEY
    };
    const saveP = fetch(REPORT_SUPABASE_URL + '/rest/v1/reports', {
      method:'POST',
      headers:Object.assign({Prefer:'return=minimal'}, hdrs),
      body:JSON.stringify({name:name, problem:problem, page:location.pathname})
    }).then(r => r.ok).catch(() => false);
    const tgP = fetch(REPORT_SUPABASE_URL + '/functions/v1/send-telegram', {
      method:'POST', headers:hdrs,
      body:JSON.stringify({name:name, problem:problem})
    }).then(r => r.ok).catch(() => false);
    const results = await Promise.all([saveP, tgP]);
    btn.disabled = false;
    if (results[0] || results[1]) {
      lastReportAt = Date.now();
      closeReportModal();
      showReportToast(reportText('sent'), 'success');
    } else {
      err.textContent = reportText('fail');
    }
}
function initReportModal() {
    const trigger = document.getElementById('floatBtnReport');
    if (trigger) trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openReportModal();
    });
    const close = document.getElementById('rpCloseBtn');
    const cancel = document.getElementById('rpCancelBtn');
    const send = document.getElementById('rpSendBtn');
    if (close) close.addEventListener('click', closeReportModal);
    if (cancel) cancel.addEventListener('click', closeReportModal);
    if (send) send.addEventListener('click', submitReport);
    const overlay = document.getElementById('reportOverlay');
    if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeReportModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeReportModal(); });
}
