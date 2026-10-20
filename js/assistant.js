/* ==========================================================
   THABIT SYSTEM - ALL-IN-ONE SCRIPT (Melted Version)
   ================================================          */

// 2. CORE APP LOGIC, SLIDERS & AUDIO ENGINE
let isAdminAuthenticated = false;
const SUPABASE_URL = "https://vkfexceitwjmxncwceqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
const BUCKET_NAME = "audio-files";

// دالة تنظيف الكلمات لمنع خطأ ReferenceError
function cleanWordString(str) {
    if (!str) return '';
    return String(str)
        .trim()
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”]/g, "");
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        applyThemeState(localStorage.getItem('thabit_theme') === 'light');
        const savedLang = localStorage.getItem('thabit_lang') || 'en';
        setLanguage(savedLang);
    } catch (e) {
        setLanguage('en');
    }

    setMeaningMode('ar');
    fetchSmartTranslation();
    initSliders();
    checkMainWordStatus(document.getElementById('wordInput').value);
    injectDownloadModalHtml();

    setupRepeatButtonsDirectly();

    // Global Click Handler: Clicking anywhere outside buttons stops all audio/playback
    document.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('.custom-slider-track') && !e.target.closest('#downloadConfirmModal')) {
            stopAllAudio();
        }
    });
});

function handleAdminTriggerClick() { 
    window.location.href = 'adminpanel.html'; 
}

function handleMainWordInput(value) {
    fetchSmartTranslation();
    checkMainWordStatus(value);
}

// Sliders Logic
const totalSegments = 18;
let sliderValues = { speed: 0.5, wait: 0.75, comma: 0.75 };
const speedOptions = [0.75, 0.85, 0.95, 1.0, 1.1, 'lightning'];
const waitOptions = [100, 300, 500, 700, 1000, 'lightning'];
const commaOptions = [150, 300, 500, 800, 1200, 'lightning'];

function getActiveSpeed() {
    let idx = Math.floor(sliderValues.speed * (speedOptions.length - 1));
    let val = speedOptions[Math.max(0, Math.min(speedOptions.length - 1, idx))];
    return val === 'lightning' ? 1.4 : val;
}
function getActiveWaitTime() {
    let idx = Math.floor(sliderValues.wait * (waitOptions.length - 1));
    let val = waitOptions[Math.max(0, Math.min(waitOptions.length - 1, idx))];
    return val === 'lightning' ? 50 : val;
}
function getActiveCommaWait() {
    let idx = Math.floor(sliderValues.comma * (commaOptions.length - 1));
    let val = commaOptions[Math.max(0, Math.min(commaOptions.length - 1, idx))];
    return val === 'lightning' ? 50 : val;
}
function initSliders() {
    ['speed', 'wait', 'comma'].forEach(type => {
        const track = document.getElementById(`slider${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (!track) return;
        track.innerHTML = '<div class="custom-slider-thumb" id="thumb' + type.charAt(0).toUpperCase() + type.slice(1) + '"></div>';
        for (let i = 0; i < totalSegments; i++) {
            const seg = document.createElement('div');
            seg.className = "custom-slider-segment";
            seg.id = `seg-${type}-${i}`;
            track.appendChild(seg);
        }
        updateSliderVisuals(type);
    });
}
function updateSliderVisuals(type) {
    const val = sliderValues[type];
    const thumbName = `thumb${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const thumb = document.getElementById(thumbName);
    if (thumb) thumb.style.left = `${val * 100}%`;

    if (type === 'speed') {
        let cur = getActiveSpeed();
        const el = document.getElementById('valSpeed');
        if (el) el.innerHTML = cur === 1.4 ? '<i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i>' : cur + 'x';
    } else if (type === 'wait') {
        let cur = getActiveWaitTime();
        const el = document.getElementById('valWait');
        if (el) el.innerHTML = cur === 50 ? '<i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i>' : cur + 'ms';
    } else if (type === 'comma') {
        let cur = getActiveCommaWait();
        const el = document.getElementById('valComma');
        if (el) el.innerHTML = cur === 50 ? '<i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i>' : cur + 'ms';
    }

    const activeCount = Math.round(val * totalSegments);
    for (let i = 0; i < totalSegments; i++) {
        const seg = document.getElementById(`seg-${type}-${i}`);
        if (!seg) continue;
        if (i < activeCount) {
            let colorClass = i < 3 ? "bg-rose-600" : i < 6 ? "bg-orange-500" : i < 9 ? "bg-yellow-400" : i < 12 ? "bg-lime-500" : i < 15 ? "bg-emerald-500" : "bg-sky-500";
            seg.className = `custom-slider-segment ${colorClass}`;
        } else {
            seg.className = "custom-slider-segment bg-slate-700 light-theme:bg-slate-300";
        }
    }
}

let activeSliderType = null;
function startSliderDrag(e, type) {
    e.stopPropagation(); e.preventDefault();
    activeSliderType = type;
    updateSliderPositionFromEvent(e, type);
    window.addEventListener('mousemove', onSliderDrag);
    window.addEventListener('mouseup', stopSliderDrag);
    window.addEventListener('touchmove', onSliderDrag);
    window.addEventListener('touchend', stopSliderDrag);
}
function onSliderDrag(e) { if (activeSliderType) updateSliderPositionFromEvent(e, activeSliderType); }
function updateSliderPositionFromEvent(e, type) {
    const track = document.getElementById(`slider${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    let pos = (clientX - rect.left) / rect.width;
    sliderValues[type] = Math.max(0, Math.min(1, pos));
    updateSliderVisuals(type);
}
function stopSliderDrag() {
    activeSliderType = null;
    window.removeEventListener('mousemove', onSliderDrag);
    window.removeEventListener('mouseup', stopSliderDrag);
    window.removeEventListener('touchmove', onSliderDrag);
    window.removeEventListener('touchend', stopSliderDrag);
}

// Translations & UI
const translations = {
    en: { headerSub: "pronounce on the go", adminPanelTitle: "Fedawy Admin Panel", adminTrainerOnly: "Trainer Only", adminWordLabel: "word (s):", uploadSaveBtn: "Upload & Save to Database", labelName: "Your name *", namePlaceholder: "Enter trainee name here...", labelWord: "your word (s) *", wordPlaceholder: "Type words...", speakBtn: "Listen once", downloadBtn: "Take words", labelTrans: "Translation / Meaning", arabicMeaningBtn: "Arabic", englishMeaningBtn: "English", reportBroken: "Broken Word" },
    ar: { headerSub: "انطق وأنت في طريقك", adminPanelTitle: "لوحة إدارة الفداوي", adminTrainerOnly: "للمدرب فقط", adminWordLabel: "الكلمة (الكلمات):", uploadSaveBtn: "رفع وحفظ في قاعدة البيانات", labelName: "اسمك *", namePlaceholder: "اكتب اسم المتدرب هنا...", labelWord: "كلمتك (كلماتك) *", wordPlaceholder: "اكتب الكلمات...", speakBtn: "استمع مرة واحدة", downloadBtn: "خذ كلماتك", labelTrans: "الترجمة / المعنى", arabicMeaningBtn: "عربي", englishMeaningBtn: "إنجليزي", reportBroken: "صوت تالف" },
    eg: { headerSub: "انطق وانت ماشي", adminPanelTitle: "لوحة تحكم الفداوي", adminTrainerOnly: "للمدرب بس", adminWordLabel: "الكلمة (الكلمات):", uploadSaveBtn: "ارفع واحفظ في الداتابيز", labelName: "اسمك *", namePlaceholder: "اكتب اسمك هنا يا بطل...", labelWord: "كلمتك (كلماتك) *", wordPlaceholder: "اكتب الكلمات...", speakBtn: "اسمع مرة واحدة", downloadBtn: "خد كلماتك", labelTrans: "الترجمة والمعنى", arabicMeaningBtn: "عربي", englishMeaningBtn: "إنجليزي", reportBroken: "صوت بايظ" }
};
function setLanguage(lang) {
    try { localStorage.setItem('thabit_lang', lang); } catch (e) {}
    document.querySelectorAll('.circle-badge-btn').forEach(btn => {
        if(btn.id !== 'floatBtnTheme' && btn.id !== 'floatBtnAdmin') btn.classList.remove('active');
    });
    if (lang === 'ar') document.getElementById('floatBtnAr')?.classList.add('active');
    else if (lang === 'en') document.getElementById('floatBtnEn')?.classList.add('active');
    else if (lang === 'eg') document.getElementById('floatBtnEg')?.classList.add('active');

    const t = translations[lang];
    const htmlRoot = document.getElementById('htmlRoot');
    if (htmlRoot) {
        htmlRoot.setAttribute('dir', 'ltr');
        htmlRoot.setAttribute('lang', lang);
    }

    const hSub = document.getElementById('uiHeaderSub'); if (hSub) hSub.textContent = t.headerSub;
    const lName = document.getElementById('uiLabelName'); if (lName) lName.innerHTML = `<i class="fa-solid fa-user text-indigo-400"></i> ${t.labelName}`;
    const nInput = document.getElementById('userNameInput'); if (nInput) nInput.placeholder = t.namePlaceholder;
    const lWord = document.getElementById('uiLabelWord'); if (lWord) lWord.innerHTML = `<i class="fa-solid fa-pen-nib text-indigo-400"></i> ${t.labelWord}`;
    const wInput = document.getElementById('wordInput'); if (wInput) wInput.placeholder = t.wordPlaceholder;
    const sBtn = document.getElementById('uiSpeakBtn'); if (sBtn) sBtn.textContent = t.speakBtn;
    const dBtn = document.getElementById('uiDownloadBtn'); if (dBtn) dBtn.textContent = t.downloadBtn;
    const lTrans = document.getElementById('uiLabelTrans'); if (lTrans) lTrans.innerHTML = `<i class="fa-solid fa-language text-indigo-400"></i> ${t.labelTrans}`;
    const mAr = document.getElementById('modeArBtn'); if (mAr) mAr.textContent = t.arabicMeaningBtn;
    const mEn = document.getElementById('modeEnBtn'); if (mEn) mEn.textContent = t.englishMeaningBtn;
    if (typeof applyExtraI18n === 'function') applyExtraI18n(lang);
}

let isLightTheme = false;
function applyThemeState(light) {
    isLightTheme = light;
    document.getElementById('bodyRoot')?.classList.toggle('light-theme', light);
    const tIcon = document.getElementById('themeIcon');
    if (tIcon) tIcon.className = light ? "fa-solid fa-sun text-xs" : "fa-solid fa-moon text-xs";
}
function toggleTheme() {
    applyThemeState(!isLightTheme);
    try { localStorage.setItem('thabit_theme', isLightTheme ? 'light' : 'dark'); } catch (e) {}
}

async function fetchSmartTranslation() {
    const wordInput = document.getElementById('wordInput');
    const query = wordInput ? wordInput.value.trim() : "";
    const outputDiv = document.getElementById('translationOutput');
    if (!outputDiv) return;
    if (!query) { outputDiv.textContent = currentMeaningMode === 'ar' ? "ثابت" : "Stable"; return; }
    try {
        const targetLang = currentMeaningMode === 'ar' ? 'ar' : 'en';
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        let translatedText = "";
        if (data && data[0]) data[0].forEach(item => { if (item[0]) translatedText += item[0]; });
        if (translatedText) outputDiv.textContent = translatedText;
    } catch (err) {}
}

let currentMeaningMode = 'ar';
function setMeaningMode(mode) {
    currentMeaningMode = mode;
    document.getElementById('modeArBtn')?.classList.toggle('on', mode === 'ar');
    document.getElementById('modeEnBtn')?.classList.toggle('on', mode === 'en');
    fetchSmartTranslation();
}


// 3. EXTRAS, I18N, AUDIO ENGINE & REPORTS
const XT = {
  en: {
    reportMissing: "Report Missing", reportBroken: "Broken Word", wordSpeed: "Word Speed", smartMenu: "Smart Menu",
    waitTime: "Multi-repeat Wait", commaTime: "Between Words Pause",
    yourTurn: "Your turn", stop: "Stop", comparison: "Comparison", footerTag: "Pronounce on the go",
    themeTitle: "Toggle theme", meanAr: "Arabic meaning", meanEn: "English meaning", adminTitleBtn: "Fedawy Admin Panel", reportTitleBtn: "Report a problem",
    listenGoogle: "Listen to Google Translation", phExample: "e.g. Hello",
    rpTitle: "Report a problem", rpIntro: "Tell us exactly what happened so we can fix it.",
    rpName: "Your name", rpNamePh: "Enter your name...", rpDetails: "What exactly is the problem?",
    rpDetailsPh: "Describe what you did, what you expected, and what happened instead...",
    rpCancel: "Cancel", rpSend: "Send",
    rpNameReq: "Please enter your name.", rpProblemReq: "Please describe the problem in detail.",
    rpSentOk: "Your report was sent. Thank you!", rpFail: "Could not send the report. Please try again.",
    rpWait: "Please wait a moment before sending another report.",
    typeWord: "Type a word first!", notInDb: "This word isn't in the database yet — press Report Missing.",
    noAudioFor: "No audio for: ", dbFail: "Could not reach the database, check your connection.",
    recordFirst: "Record your voice first with “Your turn”.", recSaved: "Your recording is saved ✓ — try Comparison.",
    micDenied: "Please allow microphone access first.", dlOk: "Words downloaded ✓", dlFiles: "Files downloaded ✓",
    dlFail: "Download failed, please try again.", missingSending: "Sending the word to the trainer...",
    missingOk: "🚨 Reported! The trainer received your word.", missingFail: "Could not send the report.",
    missingEmpty: "Type a word or sentence first!", nameRequired: "Please enter your name first!",
    brokenOk: "🚨 Reported! Broken word sent successfully.", brokenFail: "Could not send the broken word report.",
    dlConfirmTitle: "Download Audio", dlConfirmText: "Do you really want to download the audio files?", dlYes: "Yes", dlNo: "No"
  },
  ar: {
    reportMissing: "بلّغ عن كلمة ناقصة", reportBroken: "صوت تالف", wordSpeed: "سرعة الكلمة", smartMenu: "قائمة ذكية",
    waitTime: "الانتظار بين التكرارات", commaTime: "التوقف بين الكلمات",
    yourTurn: "دورك", stop: "إيقاف", comparison: "المقارنة", footerTag: "انطق وأنت في طريقك",
    themeTitle: "الوضع الفاتح / الداكن", meanAr: "المعنى بالعربية", meanEn: "المعنى بالإنجليزية", adminTitleBtn: "لوحة إدارة الفداوي", reportTitleBtn: "الإبلاغ عن مشكلة",
    listenGoogle: "استمع لنطق جوجل", phExample: "مثال: Hello",
    rpTitle: "الإبلاغ عن مشكلة", rpIntro: "اشرح لنا ما حدث بالتفصيل حتى نتمكن من إصلاحه.",
    rpName: "اسمك", rpNamePh: "اكتب اسمك...", rpDetails: "ما المشكلة بالتحديد؟",
    rpDetailsPh: "اشرح ما فعلته، وما كنت تتوقعه...",
    rpCancel: "إلغاء", rpSend: "إرسال",
    rpNameReq: "من فضلك اكتب اسمك.", rpProblemReq: "من فضلك اشرح المشكلة بالتفصيل.",
    rpSentOk: "تم إرسال بلاغك. شكرًا لك!", rpFail: "تعذر إرسال البلاغ، حاول مرة أخرى.",
    rpWait: "انتظر لحظة قبل إرسال بلاغ آخر.",
    typeWord: "اكتب كلمة أولاً!", notInDb: "هذه الكلمة غير موجودة بعد — اضغط «بلّغ عن كلمة ناقصة».",
    noAudioFor: "لا يوجد صوت لـ: ", dbFail: "تعذر الاتصال بقاعدة البيانات.",
    recordFirst: "سجّل صوتك أولاً بزر «دورك».", recSaved: "تم حفظ تسجيلك ✓",
    micDenied: "اسمح للمتصفح باستخدام الميكروفون أولاً.", dlOk: "تم تنزيل الكلمات ✓", dlFiles: "تم تنزيل الملفات ✓",
    dlFail: "فشل التنزيل، حاول مرة أخرى.", missingSending: "جارٍ إرسال الكلمة إلى المدرب...",
    missingOk: "🚨 تم التبليغ! وصلت الكلمة إلى المدرب.", missingFail: "تعذر إرسال البلاغ.",
    missingEmpty: "اكتب كلمة أو جملة أولاً!", nameRequired: "من فضلك اكتب اسمك في حقل الاسم أولاً!",
    brokenOk: "🚨 تم الإبلاغ! تم إرسال الكلمة التالفة بنجاح.", brokenFail: "تعذر إرسال بلاغ الصوت التالف.",
    dlConfirmTitle: "تنزيل الملفات الصوتية", dlConfirmText: "هل تريد حقاً تنزيل الملفات الصوتية على جهازك؟", dlYes: "نعم", dlNo: "لا"
  },
  eg: {
    reportMissing: "بلّغ إن الكلمة ناقصة", reportBroken: "صوت بايظ", wordSpeed: "سرعة الكلمة", smartMenu: "قايمة ذكية",
    waitTime: "الانتظار بين كل تكرار", commaTime: "الوقفة بين الكلمات",
    yourTurn: "دورك انت", stop: "وقّف", comparison: "قارن", footerTag: "انطق وانت ماشي",
    themeTitle: "فاتح / داكن", meanAr: "المعنى بالعربي", meanEn: "المعنى بالإنجليزي", adminTitleBtn: "لوحة تحكم الفداوي", reportTitleBtn: "بلّغ عن مشكلة",
    listenGoogle: "اسمع نطق جوجل", phExample: "مثال: Hello",
    rpTitle: "بلّغ عن مشكلة", rpIntro: "احكيلنا اللي حصل بالتفصيل عشان نصلحه.",
    rpName: "اسمك", rpNamePh: "اكتب اسمك هنا...", rpDetails: "إيه المشكلة بالظبط؟",
    rpDetailsPh: "احكي عملت إيه...",
    rpCancel: "إلغاء", rpSend: "ابعت",
    rpNameReq: "اكتب اسمك الأول.", rpProblemReq: "احكي المشكلة بالتفصيل.",
    rpSentOk: "بلاغك وصل. شكرًا ليك!", rpFail: "مقدرتش أبعت البلاغ.",
    rpWait: "استنى شوية قبل ما تبعت بلاغ تاني.",
    typeWord: "اكتب كلمة الأول!", notInDb: "الكلمة دي لسه مش في الداتابيز.",
    noAudioFor: "مفيش صوت لـ: ", dbFail: "مش قادر أوصل للداتابيز.",
    recordFirst: "سجّل صوتك الأول.", recSaved: "تسجيلك اتحفظ ✓",
    micDenied: "اسمح للمتصفح يستخدم المايك الأول.", dlOk: "الكلمات اتنزّلت ✓", dlFiles: "الملفات اتنزّلت ✓",
    dlFail: "التنزيل فشل.", missingSending: "بنبعت الكلمة للمدرب...",
    missingOk: "🚨 اتبلّغ! وصلت للمدرب.", missingFail: "مقدرتش أبعت.",
    missingEmpty: "اكتب كلمة الأول!", nameRequired: "اكتب اسمك في حقل الاسم الأول!",
    brokenOk: "🚨 اتبلّغ! الصوت البايظ اتعبر عنه بنجاح.", brokenFail: "مقدرتش أبعت البلاغ.",
    dlConfirmTitle: "تحميل الصوت", dlConfirmText: "عايز بجد تنزل الملفات الصوتية دي عندك؟", dlYes: "آه", dlNo: "لا"
  }
};
let uiLang = 'en';
try { const l = localStorage.getItem('thabit_lang'); if (l && XT[l]) uiLang = l; } catch (e) {}
function T(k) { const d = XT[uiLang] || XT.en; return d[k] !== undefined ? d[k] : (XT.en[k] !== undefined ? XT.en[k] : k); }
function applyExtraI18n(lang) {
  if (XT[lang]) uiLang = lang;
  document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = T(el.dataset.t); });
  document.querySelectorAll('[data-tp]').forEach(function (el) { el.placeholder = T(el.dataset.tp); });
  document.querySelectorAll('[data-tt]').forEach(function (el) { el.title = T(el.dataset.tt); });
  const rb = document.querySelector('#recordYourVoiceBtn span');
  if (rb) rb.textContent = mainRecording ? T('stop') : T('yourTurn');
  
  const mTitle = document.getElementById('dlModalTitle');
  const mText = document.getElementById('dlModalText');
  const mYes = document.getElementById('dlModalYes');
  const mNo = document.getElementById('dlModalNo');
  if (mTitle) mTitle.textContent = T('dlConfirmTitle');
  if (mText) mText.textContent = T('dlConfirmText');
  if (mYes) mYes.textContent = T('dlYes');
  if (mNo) mNo.textContent = T('dlNo');
}
window.addEventListener('DOMContentLoaded', function () { applyExtraI18n(uiLang); });

let toastTimer = null;
function showGeneralToast(msg, type) {
  const el = document.getElementById('generalToast');
  const ic = document.getElementById('generalToastIcon');
  if (!el || !ic) return;
  const kind = type === 'red' ? 'red' : (type === 'orange' || type === 'error') ? 'orange' : 'success';
  el.className = 'show t-' + kind;
  ic.className = 'fa-solid ' + (kind === 'success' ? 'fa-circle-check' : kind === 'red' ? 'fa-circle-exclamation' : 'fa-triangle-exclamation');
  const msgEl = document.getElementById('generalToastMsg');
  if (msgEl) msgEl.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.className = ''; }, 2200);
}
function toggleSlidersDrawer(e) {
  if (e && e.target && e.target.closest && e.target.closest('.custom-slider-track')) return;
  const d = document.getElementById('slidersDrawerWrapper');
  const ic = document.getElementById('drawerToggleIcon');
  if (!d) return;
  const collapsed = d.classList.toggle('collapsed');
  if (ic) ic.style.transform = collapsed ? '' : 'rotate(180deg)';
}

let lastReportAt = 0;
function openReportModal() {
  const nameEl = document.getElementById('rpName');
  const userEl = document.getElementById('userNameInput');
  if (nameEl) nameEl.value = (userEl ? userEl.value : '').trim();
  const probEl = document.getElementById('rpProblem');
  if (probEl) probEl.value = '';
  const errEl = document.getElementById('rpErr');
  if (errEl) errEl.textContent = '';
  document.getElementById('reportOverlay')?.classList.add('open');
}
function closeReportModal() { document.getElementById('reportOverlay')?.classList.remove('open'); }
async function submitReport() {
  if (typeof ID !== 'undefined' && ID.ok) return idSubmitReport();
  const nameEl = document.getElementById('rpName'), probEl = document.getElementById('rpProblem'), err = document.getElementById('rpErr'), btn = document.getElementById('rpSendBtn');
  const name = nameEl ? nameEl.value.trim() : '', problem = probEl ? probEl.value.trim() : '';
  if (!name) { if (err) err.textContent = T('rpNameReq'); return; }
  if (problem.length < 10) { if (err) err.textContent = T('rpProblemReq'); return; }
  if (btn) btn.disabled = true;
  const hdrs = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY };
  const saveP = fetch(SUPABASE_URL + '/rest/v1/reports', { method: 'POST', headers: Object.assign({ Prefer: 'return=minimal' }, hdrs), body: JSON.stringify({ name: name, problem: problem, page: location.pathname }) }).then(r => r.ok).catch(() => false);
  const tgP = fetch(SUPABASE_URL + '/functions/v1/send-telegram', { method: 'POST', headers: hdrs, body: JSON.stringify({ name: name, problem: problem }) }).then(r => r.ok).catch(() => false);
  const results = await Promise.all([saveP, tgP]);
  if (btn) btn.disabled = false;
  if (results[0] || results[1]) { closeReportModal(); showGeneralToast(T('rpSentOk'), 'success'); } else { if (err) err.textContent = T('rpFail'); }
}

async function reportMissingWord() {
  if (typeof ID !== 'undefined' && ID.ok) return idReportWords('missing');
  const wEl = document.getElementById('wordInput');
  const uEl = document.getElementById('userNameInput');
  const wordVal = wEl ? wEl.value.trim() : '';
  const traineeName = uEl ? uEl.value.trim() : '';
  if (!traineeName) { showGeneralToast(T('nameRequired'), 'red'); uEl?.focus(); return; }
  if (!wordVal) { showGeneralToast(T('missingEmpty'), 'red'); return; }
  showGeneralToast(T('missingSending'), 'orange');
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/due_words_table', {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ word: wordVal, trainee_name: traineeName, created_at: new Date().toISOString(), status: 'pending' })
    });
    if (!res.ok) throw new Error();
    showGeneralToast(T('missingOk'), 'success');
  } catch (e) { showGeneralToast(T('missingFail'), 'red'); }
}

async function reportBrokenWord() {
  if (typeof ID !== 'undefined' && ID.ok) return idReportWords('broken');
  const wEl = document.getElementById('wordInput');
  const uEl = document.getElementById('userNameInput');
  const wordVal = wEl ? wEl.value.trim() : '';
  const traineeName = uEl ? uEl.value.trim() : '';

  if (!traineeName) {
    showGeneralToast(T('nameRequired'), 'red');
    uEl?.focus();
    return;
  }
  if (!wordVal) {
    showGeneralToast(T('missingEmpty'), 'red');
    return;
  }

  showGeneralToast(T('missingSending'), 'orange');
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/broken_words_table', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        word: wordVal,
        trainee_name: traineeName,
        created_at: new Date().toISOString()
      })
    });

    if (!res.ok) throw new Error();
    showGeneralToast(T('brokenOk'), 'success');
  } catch (e) {
    showGeneralToast(T('brokenFail'), 'red');
  }
}

let wordsCache = null, wordsCacheAt = 0, statusTimer = null;
let currentAudio = null, currentResolve = null, playToken = 0;
let userRecBlob = null, userRecUrl = null;
let mainRecorder = null, mainChunks = [], mainRecording = false, mainTimerId = null, mainSeconds = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function splitWords(str) { return String(str || '').split(/[,،\n]+/).map(x => x.trim()).filter(Boolean); }
async function getWordsList(force) {
  if (!force && wordsCache && Date.now() - wordsCacheAt < 15000) return wordsCache;
  const res = await fetch(SUPABASE_URL + '/rest/v1/words_table?select=word,audio_url', { headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY } });
  const d = await res.json();
  wordsCache = Array.isArray(d) ? d : [];
  wordsCacheAt = Date.now();
  return wordsCache;
}
function findAudio(list, part) {
  const c = cleanWordString(part);
  let url = null;
  list.forEach(r => { if (r.word && r.audio_url && cleanWordString(r.word) === c) url = r.audio_url; });
  return url;
}
function checkMainWordStatus() { clearTimeout(statusTimer); statusTimer = setTimeout(runWordStatusCheck, 300); }
async function runWordStatusCheck() {
    const input = document.getElementById('wordInput');
    const btn = document.getElementById('reportMissingBtn');
    if (!input) return;

    input.classList.remove('word-found', 'word-missing');

    if (btn) {
        btn.classList.remove('pop-pulse');
        btn.style.display = '';
    }

    const parts = splitWords(input.value);

    if (!parts.length) {
        if (btn) btn.style.display = '';
        return;
    }

    try {
        const results = await Promise.all(
            parts.map(async (part) => {
                const res = await fetch(
                    SUPABASE_URL + '/rest/v1/rpc/check_word_status',
                    {
                        method: 'POST',
                        headers: {
                            apikey: SUPABASE_ANON_KEY,
                            Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            p_word: part
                        })
                    }
                );

                if (!res.ok) throw new Error();

                return await res.json();
            })
        );

        if (results.every(status => status === 'found')) {
            input.classList.add('word-found');

            if (btn) {
                btn.style.display = 'none';
                btn.classList.remove('pop-pulse');
            }

            return;
        }

        if (results.some(status => status === 'pending')) {
            input.classList.add('word-missing');

            if (btn) {
                btn.style.display = 'none';
                btn.classList.remove('pop-pulse');
            }

            showGeneralToast(
                uiLang === 'ar'
                    ? 'الكلمة دي اتبلغ عنها قبل كده وهننطقها لك في أقرب وقت ممكن.'
                    : uiLang === 'eg'
                        ? 'الكلمة دي اتبلغ عنها قبل كده وهننطقها لك في أقرب وقت ممكن.'
                        : 'This word was already reported. We will add its pronunciation as soon as possible.',
                'orange'
            );

            return;
        }

        input.classList.add('word-missing');

        if (btn) {
            btn.style.display = '';
            btn.classList.add('pop-pulse');
        }

        showGeneralToast(
            uiLang === 'ar'
                ? 'الكلمة دي مش موجودة. تقدر تبلغ عنها عشان ننطقها لك في أقرب وقت ممكن.'
                : uiLang === 'eg'
                    ? 'الكلمة دي مش موجودة. تقدر تبلغ عنها عشان ننطقها لك في أقرب وقت ممكن.'
                    : 'This word is not available. You can report it so we can add its pronunciation as soon as possible.',
            'orange'
        );

    } catch (e) {
        input.classList.remove('word-found', 'word-missing');

        if (btn) {
            btn.style.display = '';
            btn.classList.remove('pop-pulse');
        }
    }
}
function stopAllAudio() {
  playToken++;
  if (currentAudio) { try { currentAudio.pause(); } catch (e) {} currentAudio = null; }
  if (currentResolve) { const r = currentResolve; currentResolve = null; r(); }
  document.querySelectorAll('.playing-active').forEach(b => b.classList.remove('playing-active'));
}
function playUrl(url, token, rate) {
  return new Promise(resolve => {
    if (token !== playToken) return resolve();
    const a = new Audio(url);
    a.playbackRate = rate || 1;
    currentAudio = a; currentResolve = resolve;
    const done = () => { if (currentResolve === resolve) currentResolve = null; resolve(); };
    a.onended = done; a.onerror = done;
    a.play().catch(done);
  });
}
async function playSeq(urls, token) {
  for (let i = 0; i < urls.length; i++) {
    if (token !== playToken) return;
    await playUrl(urls[i], token, getActiveSpeed());
    if (i < urls.length - 1 && token === playToken) await sleep(getActiveCommaWait());
  }
}
async function resolveWordUrls() {
  const wEl = document.getElementById('wordInput');
  const parts = splitWords(wEl ? wEl.value : '');
  if (!parts.length) { showGeneralToast(T('typeWord'), 'red'); return null; }
  let list;
  try { list = await getWordsList(); } catch (e) { showGeneralToast(T('dbFail'), 'red'); return null; }
  const urls = [], missing = [];
  parts.forEach(p => { const u = findAudio(list, p); if (u) urls.push(u); else missing.push(p); });
  if (!urls.length) { showGeneralToast(T('notInDb'), 'orange'); return null; }
  return urls;
}
function markBtn(btn, on) { 
  document.querySelectorAll('.playing-active').forEach(b => b.classList.remove('playing-active'));
  if (btn && on) btn.classList.add('playing-active'); 
}

function triggerRecordBtnPulse() {
    const recBtn = document.getElementById('recordYourVoiceBtn');
    if (!recBtn) return;
    recBtn.classList.remove('ring-4', 'ring-amber-500', 'animate-bounce');
    void recBtn.offsetWidth;
    recBtn.classList.add('ring-4', 'ring-amber-500', 'animate-bounce');
    setTimeout(() => {
        recBtn.classList.remove('ring-4', 'ring-amber-500', 'animate-bounce');
    }, 2000);
}

// Global Listen Functions
window.runListen = async function(times, btn) {
  stopAllAudio();
  const token = playToken;
  markBtn(btn, true);
  try {
    const urls = await resolveWordUrls();
    if (!urls || token !== playToken) return;
    for (let i = 0; i < times; i++) {
      if (token !== playToken) break;
      await playSeq(urls, token);
      if (i < times - 1 && token === playToken) await sleep(getActiveWaitTime());
    }
  } finally { 
    if (token === playToken) markBtn(btn, false); 
  }
};

function setupRepeatButtonsDirectly() {
    const listenRep2 = document.getElementById('btnListenRep2');
    const listenRep3 = document.getElementById('btnListenRep3');
    const listenRep5 = document.getElementById('btnListenRep5');
    
    const compRep2 = document.getElementById('btnCompRep2');
    const compRep3 = document.getElementById('btnCompRep3');
    const compRep5 = document.getElementById('btnCompRep5');

    if (listenRep2) listenRep2.onclick = (e) => { e.stopPropagation(); window.runListen(2, listenRep2); };
    if (listenRep3) listenRep3.onclick = (e) => { e.stopPropagation(); window.runListen(3, listenRep3); };
    if (listenRep5) listenRep5.onclick = (e) => { e.stopPropagation(); window.runListen(5, listenRep5); };

    if (compRep2) compRep2.onclick = (e) => { e.stopPropagation(); window.runComparison(2, compRep2); };
    if (compRep3) compRep3.onclick = (e) => { e.stopPropagation(); window.runComparison(3, compRep3); };
    if (compRep5) compRep5.onclick = (e) => { e.stopPropagation(); window.runComparison(5, compRep5); };
}

// Global Comparison Functions
window.runComparison = async function(times, btn) {
  const wEl = document.getElementById('wordInput');
  const parts = splitWords(wEl ? wEl.value : '');
  if (!parts.length) { 
      showGeneralToast(T('typeWord'), 'red'); 
      return; 
  }

  if (!userRecUrl) { 
      showGeneralToast(T('recordFirst'), 'orange'); 
      triggerRecordBtnPulse();
      return; 
  }

  stopAllAudio();
  const token = playToken;
  markBtn(btn, true);
  try {
    const urls = await resolveWordUrls();
    if (!urls || token !== playToken) return;
    for (let i = 0; i < times; i++) {
      if (token !== playToken) break;
      await playSeq(urls, token);
      if (token !== playToken) break;
      await sleep(150);
      await playUrl(userRecUrl, token, 1);
      if (i < times - 1 && token === playToken) await sleep(getActiveWaitTime());
    }
  } finally { 
    if (token === playToken) markBtn(btn, false); 
  }
};

window.triggerComparisonPlayback = function() {
    window.runComparison(1, document.getElementById('compareBtn'));
};

// Blur Modal Injection and Download Logic
function injectDownloadModalHtml() {
    if (document.getElementById('downloadConfirmModal')) return;
    const modalHtml = `
    <div id="downloadConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 opacity-0 pointer-events-none">
        <div class="bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-black rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl flex flex-col gap-4 transform scale-95 transition-transform duration-300">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-download"></i>
                </div>
                <h3 id="dlModalTitle" class="text-base font-bold text-white light-theme:text-black">Download Audio</h3>
            </div>
            <p id="dlModalText" class="text-xs text-slate-300 light-theme:text-slate-700 leading-relaxed">Do you really want to download the audio files?</p>
            <div class="flex items-center gap-3 mt-2">
                <button type="button" id="dlModalNo" onclick="closeDownloadModal(false)" class="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 light-theme:bg-slate-200 light-theme:hover:bg-slate-300 text-xs font-bold transition">No</button>
                <button type="button" id="dlModalYes" onclick="closeDownloadModal(true)" class="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md">Yes</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

let pendingDownloadUrls = null;
window.downloadCombinedAudioPackage = async function() {
    const wEl = document.getElementById('wordInput');
    const parts = splitWords(wEl ? wEl.value : '');
    if (!parts.length) {
        showGeneralToast(T('typeWord'), 'red');
        return;
    }
    const urls = await resolveWordUrls();
    if (!urls || !urls.length) return;

    pendingDownloadUrls = urls;
    openDownloadModal();
};

function openDownloadModal() {
    const modal = document.getElementById('downloadConfirmModal');
    if (!modal) return;
    applyExtraI18n(uiLang);
    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.querySelector(':scope > div').classList.remove('scale-95');
}

window.closeDownloadModal = async function(confirmed) {
    const modal = document.getElementById('downloadConfirmModal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    
    const modalBox = modal.querySelector('div');
    if (modalBox) modalBox.classList.add('scale-95');

    if (confirmed && pendingDownloadUrls) {
        showGeneralToast(T('dlOk'), 'success');
        for (let i = 0; i < pendingDownloadUrls.length; i++) {
            let url = pendingDownloadUrls[i];
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `thabit_word_${i + 1}.mp3`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } catch (e) {
                const a = document.createElement('a');
                a.href = url;
                a.download = `thabit_word_${i + 1}.mp3`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            await sleep(400);
        }
    }
    pendingDownloadUrls = null;
};

async function toggleMainRecording() {
  const btn = document.getElementById('recordYourVoiceBtn'), icon = document.getElementById('mainRecordIcon'), label = btn ? btn.querySelector('span') : null, timer = document.getElementById('mainRecordTimerDisplay');
  if (!mainRecording) {
    stopAllAudio();
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true });
      mainRecorder = new MediaRecorder(st); mainChunks = [];
      mainRecorder.ondataavailable = e => { if (e.data.size > 0) mainChunks.push(e.data); };
      mainRecorder.onstop = () => {
        st.getTracks().forEach(t => t.stop());
        userRecBlob = new Blob(mainChunks, { type: mainRecorder.mimeType || 'audio/webm' });
        if (userRecUrl) URL.revokeObjectURL(userRecUrl);
        userRecUrl = URL.createObjectURL(userRecBlob);
        showGeneralToast(T('recSaved'), 'success');
      };
      mainRecorder.start(); mainRecording = true;
      if (icon) icon.className = 'fa-solid fa-stop'; 
      if (label) label.textContent = T('stop');
      mainSeconds = 0; 
      if (timer) timer.textContent = '00:00';
      mainTimerId = setInterval(() => {
        mainSeconds++;
        if (timer) timer.textContent = String(Math.floor(mainSeconds / 60)).padStart(2, '0') + ':' + String(mainSeconds % 60).padStart(2, '0');
      }, 1000);
    } catch (e) { showGeneralToast(T('micDenied'), 'red'); }
  } else {
    try { mainRecorder.stop(); } catch (e) {}
    mainRecording = false; clearInterval(mainTimerId);
    if (icon) icon.className = 'fa-solid fa-microphone'; 
    if (label) label.textContent = T('yourTurn');
  }
}

// 4. SIDE BAR HOVER TOOLTIP (same behaviour as overall)
(function () {
  var tipTimer = null;
  function tipEl() { return document.getElementById('barTip'); }
  function hideTip(btn) {
    clearTimeout(tipTimer);
    var tip = tipEl(); if (tip) tip.classList.remove('show');
    if (btn && btn.dataset.tipText) { btn.title = btn.dataset.tipText; delete btn.dataset.tipText; }
  }
  function bind() {
    document.querySelectorAll('#mobileFloatingBar .circle-badge-btn').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        var text = btn.title; if (!text) return;
        btn.dataset.tipText = text; btn.title = '';
        tipTimer = setTimeout(function () {
          var tip = tipEl(); if (!tip) return;
          var r = btn.getBoundingClientRect();
          tip.textContent = text;
          tip.style.left = (r.right + 12) + 'px';
          tip.style.top = (r.top + r.height / 2) + 'px';
          tip.classList.add('show');
        }, 450);
      });
      btn.addEventListener('mouseleave', function () { hideTip(btn); });
      btn.addEventListener('click', function () { hideTip(btn); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ==========================================================
   Trainee identity (from the dashboard login) + QOL suggestions
   - The name always comes from the database via the login token.
   - No token (page opened on its own) = old behaviour, typed name.
   ========================================================== */
const ID = { ok: false, token: null, name: '', id: null };
let QOL_DAYS = [];
const gid = id => document.getElementById(id);
const idRpc = (fn, body) => fetch(SUPABASE_URL + '/rest/v1/rpc/' + fn, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
});
const IDT = {
    en: { sug: 'Suggested words from your QOL', none: 'No QOL words yet', more: 'more', sent: n => n + ' word(s) have no pronunciation yet. Sent to us as high priority.', allMissing: 'None of these have a pronunciation yet. We were notified (high priority).', fail: 'Could not send the missing words' },
    ar: { sug: 'كلمات مقترحة من QOL الخاص بك', none: 'لا توجد كلمات QOL بعد', more: 'أخرى', sent: n => 'عدد ' + n + ' كلمة ليس لها نطق بعد، وتم إبلاغنا بها بأولوية عالية.', allMissing: 'لا يوجد نطق لأي من هذه الكلمات بعد، وتم إبلاغنا بها بأولوية عالية.', fail: 'تعذر إرسال الكلمات الناقصة' },
    eg: { sug: 'كلمات مقترحة من الـ QOL بتاعك', none: 'مفيش كلمات QOL لسه', more: 'كمان', sent: n => n + ' كلمة لسه ملهاش نطق، وبلّغنا بيها بأولوية عالية.', allMissing: 'مفيش نطق لأي كلمة منهم لسه، وبلّغنا بيهم بأولوية عالية.', fail: 'معرفناش نبعت الكلمات الناقصة' }
};
const idT = k => ((IDT[typeof uiLang !== 'undefined' ? uiLang : 'en'] || IDT.en)[k]);

function qolItems(txt) {
    const seen = new Set(), out = [];
    String(txt || '').split(/[\n,،;؛]+/).forEach(s => {
        const v = s.replace(/^\s*(?:\d+|[a-zA-Z])[.)]\s+/, '').replace(/^\s*[-•*]\s+/, '').trim();
        const k = v.toLowerCase();
        if (v && !seen.has(k)) { seen.add(k); out.push(v); }
    });
    return out;
}

async function initIdentity() {
    let tok = null;
    try { tok = localStorage.getItem('thabit_trainee_token'); } catch (e) {}
    if (!tok) return;
    try {
        const r = await idRpc('assistant_whoami', { p_token: tok });
        const j = r.ok ? await r.json() : null;
        if (!j || !j.name) return;
        Object.assign(ID, { ok: true, token: tok, name: j.name, id: j.id });
        const u = gid('userNameInput');
        if (u) { u.value = j.name; u.readOnly = true; }
        const lab = gid('uiLabelName'); if (lab && lab.parentElement) lab.parentElement.style.display = 'none';
        const rp = gid('rpName');
        if (rp) { rp.value = j.name; rp.readOnly = true; rp.style.display = 'none'; if (rp.previousElementSibling) rp.previousElementSibling.style.display = 'none'; }
        loadQol();
    } catch (e) { /* stay in manual-name mode */ }
}
window.addEventListener('DOMContentLoaded', initIdentity);

async function loadQol() {
    try {
        const r = await idRpc('assistant_qol', { p_token: ID.token, p_days: 7 });
        QOL_DAYS = r.ok ? await r.json() : [];
    } catch (e) { QOL_DAYS = []; }
    if (!Array.isArray(QOL_DAYS)) QOL_DAYS = [];
    renderQol();
}

function renderQol() {
    const w = gid('wordInput'); if (!w) return;
    const row = w.closest('.flex.items-center.gap-2.w-full') || w.parentElement;
    let box = gid('qolBox');
    if (!box) { box = document.createElement('div'); box.id = 'qolBox'; row.insertAdjacentElement('afterend', box); }
    const days = QOL_DAYS.map((d, i) => ({ d, i, items: qolItems(d.qol) })).filter(x => x.items.length);
    if (!days.length) { box.style.display = 'none'; return; }
    box.style.display = '';
    box.className = 'flex flex-col gap-2 relative z-10';
    const fmt = s => { try { return new Date(s + 'T12:00:00').toLocaleDateString(uiLang === 'en' ? 'en-GB' : 'ar-EG', { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) { return s; } };
    box.innerHTML = `
      <div class="text-[11px] font-semibold flex items-center gap-2 opacity-90"><i class="fa-solid fa-lightbulb text-amber-400"></i><span>${idT('sug')}</span></div>
      <div class="flex flex-col gap-2" style="max-height:176px;overflow:auto;padding-inline-end:2px">
        ${days.map(x => `
          <button type="button" data-qi="${x.i}" class="th-sub w-full text-start rounded-xl border px-3 py-2 flex flex-col gap-1 hover:border-amber-400 transition" style="cursor:pointer">
            <span class="flex items-center justify-between gap-2 text-[11px] font-bold text-amber-300"><span>${fmt(x.d.date)}</span><span class="opacity-70 font-medium" dir="auto">${x.d.title ? String(x.d.title).replace(/</g, '&lt;') : ''}</span></span>
            <span class="text-xs break-words" dir="auto">${x.items.slice(0, 4).map(s => s.replace(/</g, '&lt;')).join(' · ')}${x.items.length > 4 ? ` · +${x.items.length - 4} ${idT('more')}` : ''}</span>
          </button>`).join('')}
      </div>`;
    box.querySelectorAll('[data-qi]').forEach(b => b.onclick = () => useQolDay(+b.dataset.qi, b));
}

async function useQolDay(i, btn) {
    const day = QOL_DAYS[i]; if (!day) return;
    const items = qolItems(day.qol); if (!items.length) return;
    let list;
    try { list = await getWordsList(true); } catch (e) { showGeneralToast(T('dbFail'), 'red'); return; }
    const found = [], missing = [];
    items.forEach(p => (findAudio(list, p) ? found : missing).push(p));

    const w = gid('wordInput');
    w.value = found.join(', ');                       // only words that have a pronunciation, comma separated
    document.querySelectorAll('#qolBox [data-qi]').forEach(b => b.style.borderColor = '');
    if (btn) btn.style.borderColor = '#fbbf24';
    handleMainWordInput(w.value);

    if (missing.length) {                             // no pronunciation -> straight to the due list, high priority
        try {
            const r = await idRpc('assistant_word_report', { p_token: ID.token, p_kind: 'missing', p_words: missing, p_priority: 'high' });
            if (!r.ok) throw new Error();
            showGeneralToast(found.length ? idT('sent')(missing.length) : idT('allMissing'), 'orange');
        } catch (e) { showGeneralToast(idT('fail'), 'red'); }
    }
}

async function idReportWords(kind) {
    const w = gid('wordInput'), val = w ? w.value.trim() : '';
    if (!val) { showGeneralToast(T('missingEmpty'), 'red'); return; }
    showGeneralToast(T('missingSending'), 'orange');
    try {
        const r = await idRpc('assistant_word_report', { p_token: ID.token, p_kind: kind, p_words: splitWords(val), p_priority: 'normal' });
        if (!r.ok) throw new Error();
        showGeneralToast(T(kind === 'missing' ? 'missingOk' : 'brokenOk'), 'success');
    } catch (e) { showGeneralToast(T(kind === 'missing' ? 'missingFail' : 'brokenFail'), 'red'); }
}

async function idSubmitReport() {
    const probEl = gid('rpProblem'), err = gid('rpErr'), btn = gid('rpSendBtn');
    const problem = probEl ? probEl.value.trim() : '';
    if (problem.length < 10) { if (err) err.textContent = T('rpProblemReq'); return; }
    if (btn) btn.disabled = true;
    const hdrs = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY };
    const saveP = idRpc('assistant_report', { p_token: ID.token, p_problem: problem, p_page: location.pathname }).then(r => r.ok ? r.json() : false).catch(() => false);
    const tgP = fetch(SUPABASE_URL + '/functions/v1/send-telegram', { method: 'POST', headers: hdrs, body: JSON.stringify({ name: ID.name, problem: problem }) }).then(r => r.ok).catch(() => false);
    const results = await Promise.all([saveP, tgP]);
    if (btn) btn.disabled = false;
    if (results[0] === true || results[1]) { closeReportModal(); showGeneralToast(T('rpSentOk'), 'success'); } else { if (err) err.textContent = T('rpFail'); }
}
