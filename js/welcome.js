/* ===== Content you edit (later: loaded per student from the database) ===== */
const CFG = {
  name: 'عبد الحليم',
  hh: 7, mm: 0, ap: 'PM',          // session time
  tz: 'cairo',                      // 'cairo' or 'makkah'
  basic: 3, skill: 2, last: 3,      // days per week (core / skills), last week of month
  amount: 3000, cur: 'EGP',         // monthly fee
  expect: [],                       // expectation lines, e.g. ['...', '...']
  policiesUrl: '#'                  // link to the full Regulations & Policies page
};

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let lang = 'ar', i = 0;
const STEPS = ['lang', 'hello', 'intro', 'sched', 'sess', 'exp', 'money', 'pol', 'done'];

const ar = {
  hello: n => `أهلاً ${n}`, introT: 'نظرة سريعة على ما اتفقنا عليه في الجلسة السابقة',
  introS: 'خمس نقاط قصيرة. اضغط «فهمت» لتنتقل للتالية.', start: 'هيا نبدأ', ok: 'فهمت', agree: 'أوافق',
  t: { sched: 'المواعيد', sess: 'الجلسات', exp: 'التوقعات', money: 'المقابل المادي', pol: 'السياسات والأحكام' },
  sched: (t, z) => `جلساتنا الساعة ${t} بتوقيت ${z}.`,
  sess: (d, b, s, l) => `${d} أيام في الأسبوع: ${b} أساسي و${s} مهاري. آخر أسبوع في الشهر ${l} أيام فقط، ثم إجازة حتى بداية الشهر الجديد.`,
  basic: 'أساسي', skill: 'مهاري', expEmpty: '(هنا تُكتب التوقعات)', expS: 'ما نتوقعه منك، وما تتوقعه منا:',
  per: '/ شهرياً', moneyS: 'المبلغ الشهري المتفق عليه.',
  polS: 'قبل أن نبدأ، اقرأ السياسات والشروط كاملة.', polL: 'اقرأ السياسات كاملة',
  doneT: 'تم حفظ ملخّص الاتفاق في ملفك', doneS: 'تقدر ترجع له في أي وقت.', enter: 'ادخل الداشبورد', chg: 'تغيير اللغة',
  rc: ['اللغة', 'الموعد', 'الأيام', 'المبلغ'], tzs: { cairo: 'القاهرة', makkah: 'مكة المكرمة' }, am: 'صباحاً', pm: 'مساءً'
};
const L = {
  ar,
  eg: Object.assign({}, ar, {
    hello: n => `أهلاً يا ${n}`, introT: 'لمحة سريعة على اللي اتفقنا عليه في الجلسة اللي فاتت',
    introS: 'خمس نقط قصيرة. دوس «فهمت» وكمّل.', start: 'يلا نبدأ', t: Object.assign({}, ar.t, { money: 'الفلوس', pol: 'السياسات والشروط' }),
    sched: (t, z) => `ميعادنا الساعة ${t} بتوقيت ${z}.`,
    sess: (d, b, s, l) => `${d} أيام في الأسبوع: ${b} أساسي و${s} مهاري. آخر أسبوع في الشهر ${l} أيام بس، وبعدها أجازة لحد أول الشهر الجديد.`,
    expEmpty: '(هنا هتتكتب التوقعات)', expS: 'اللي متوقعينه منك، واللي تتوقعه مننا:', per: '/ شهرياً', moneyS: 'المبلغ الشهري اللي اتفقنا عليه.',
    polS: 'قبل ما نبدأ، اقرأ السياسات والشروط كاملة.', doneT: 'ملخّص الاتفاق اتحفظ في ملفك', doneS: 'تقدر ترجعله في أي وقت.', agree: 'موافق'
  }),
  en: {
    hello: n => `Welcome, ${n}`, introT: 'A quick look at what we agreed on in our last session',
    introS: 'Five short points. Tap “Understood” to move on.', start: 'Let’s start', ok: 'Understood', agree: 'I agree',
    t: { sched: 'Schedule', sess: 'Sessions', exp: 'Expectations', money: 'Fees', pol: 'Regulations & Policies' },
    sched: (t, z) => `Our sessions are at ${t}, ${z} time.`,
    sess: (d, b, s, l) => `${d} days a week: ${b} core and ${s} skills. The last week of each month has only ${l} days, then a break until the new month starts.`,
    basic: 'Core', skill: 'Skills', expEmpty: '(Expectations go here)', expS: 'What we expect from you, and what you can expect from us:',
    per: '/ month', moneyS: 'The monthly fee we agreed on.',
    polS: 'Before we start, please read the full policies and terms.', polL: 'Read the full policies',
    doneT: 'Your agreement summary was saved to your profile', doneS: 'You can come back to it anytime.', enter: 'Enter dashboard', chg: 'Change language',
    rc: ['Language', 'Time', 'Days', 'Fee'], tzs: { cairo: 'Cairo', makkah: 'Makkah' }, am: 'AM', pm: 'PM'
  }
};

const tstr = () => { const T = L[lang], m = String(CFG.mm).padStart(2, '0');
  return lang === 'en' ? `${CFG.hh}:${m} ${CFG.ap}` : `${CFG.hh}:${m} ${CFG.ap === 'PM' ? T.pm : T.am}`; };

/* ===== Illustrations ===== */
const ART = {
  sched() {
    const h = (CFG.hh % 12) * 30 + CFG.mm * .5, m = CFG.mm * 6;
    let ticks = ''; for (let k = 0; k < 12; k++) ticks += `<line x1="60" y1="10" x2="60" y2="${k % 3 ? 14 : 17}" stroke="#6b7280" stroke-width="2" transform="rotate(${k * 30} 60 60)"/>`;
    const days = [0, 1, 2, 3, 4, 5, 6].map(k => `<span class="dayc" style="animation-delay:${1.2 + k * .15}s;width:14px;height:14px;border-radius:50%;display:inline-block;margin:0 3px;background:${k < CFG.basic + CFG.skill ? 'var(--acc)' : 'var(--line)'}"></span>`).join('');
    return `<div><svg viewBox="0 0 120 120" width="150"><circle cx="60" cy="60" r="54" fill="#0d0d10" stroke="var(--acc)" stroke-width="3"/>${ticks}
      <line class="hand" style="--a:${m}deg" x1="60" y1="60" x2="60" y2="22" stroke="#e5e7eb" stroke-width="3" stroke-linecap="round"/>
      <line class="hand" style="--a:${h}deg" x1="60" y1="60" x2="60" y2="34" stroke="var(--acc)" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="var(--acc)"/></svg>
      <div dir="ltr" style="margin-top:6px">${days}</div></div>`;
  },
  sess() {
    const p = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="#4b5563"/><path d="M${x - 20} ${y + 32}q20 -26 40 0z" fill="#4b5563"/>`;
    return `<svg viewBox="0 0 280 190" width="290"><rect x="4" y="4" width="272" height="182" rx="14" fill="#101013" stroke="#2a2a30"/>
      <circle class="blink" cx="22" cy="19" r="4" fill="#ef4444"/><text x="32" y="23" font-size="10" fill="#9aa0a6">Meet</text>
      <rect x="14" y="32" width="122" height="62" rx="8" fill="#1b1b20"/>${p(75, 54)}
      <rect x="144" y="32" width="122" height="62" rx="8" fill="#1b1b20"/>${p(205, 54)}
      <rect x="14" y="100" width="122" height="62" rx="8" fill="#1b1b20"/>${p(75, 122)}<circle class="pulse" cx="75" cy="122" r="16" fill="none" stroke="var(--acc)" stroke-width="2"/>
      <rect x="144" y="100" width="122" height="62" rx="8" fill="#1b1b20"/>
      <rect class="type" x="156" y="114" width="98" height="5" rx="2.5" fill="var(--blue)"/><rect class="type" style="animation-delay:.5s" x="156" y="128" width="80" height="5" rx="2.5" fill="#6b7280"/><rect class="type" style="animation-delay:1s" x="156" y="142" width="90" height="5" rx="2.5" fill="#6b7280"/>
      <circle cx="112" cy="174" r="7" fill="#374151"/><circle cx="140" cy="174" r="7" fill="#374151"/><circle cx="168" cy="174" r="7" fill="#ef4444"/></svg>`;
  },
  exp() {
    return `<svg viewBox="0 0 200 180" width="210"><path d="M46 180q54 -56 108 0z" fill="#1f1f24"/><circle cx="100" cy="100" r="42" fill="#1f1f24" stroke="#4b5563" stroke-width="3"/>
      <circle cx="86" cy="96" r="4" fill="#e5e7eb"/><circle cx="114" cy="96" r="4" fill="#e5e7eb"/><path d="M80 84l12 -4M120 84l-12 -4" stroke="#9aa0a6" stroke-width="3" stroke-linecap="round"/>
      <path d="M88 120q12 -7 24 0" stroke="#9aa0a6" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="124" cy="130" r="10" fill="#374151"/>
      <text class="fl" x="150" y="54" font-size="26" fill="var(--acc)" font-weight="900">?</text>
      <text class="fl" style="animation-delay:.8s" x="48" y="50" font-size="26" fill="var(--blue)" font-weight="900">!</text>
      <text class="fl" style="animation-delay:1.6s" x="102" y="28" font-size="26" fill="var(--acc)" font-weight="900">?</text></svg>`;
  },
  money() {
    const coins = [10, 40, 75, 110, 140].map((x, k) => `<span class="coin" style="left:${x}px;animation-delay:${k * .45}s">$</span>`).join('');
    return `<div class="money">${coins}<svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="46" fill="none" stroke="#1b1b20" stroke-width="8"/><circle class="ring" cx="85" cy="85" r="46" fill="none" stroke="var(--acc)" stroke-width="8" stroke-linecap="round" transform="rotate(-90 85 85)"/></svg>
      <div class="amt"><span id="cnt">0</span><small>${esc(CFG.cur)}</small></div></div>`;
  },
  pol() {
    return `<svg viewBox="0 0 200 170" width="200"><rect x="70" y="150" width="60" height="9" rx="3" fill="#4b5563"/><line x1="100" y1="40" x2="100" y2="150" stroke="#6b7280" stroke-width="5"/>
      <g class="beam"><line x1="40" y1="40" x2="160" y2="40" stroke="var(--acc)" stroke-width="5" stroke-linecap="round"/>
      <path d="M40 40L28 90M40 40L52 90M160 40L148 90M160 40L172 90" stroke="#6b7280" stroke-width="2" fill="none"/>
      <path d="M20 90H60Q40 114 20 90Z" fill="var(--acc)"/><path d="M140 90H180Q160 114 140 90Z" fill="var(--acc)"/></g><circle cx="100" cy="40" r="6" fill="var(--acc)"/></svg>`;
  }
};

/* ===== Views ===== */
const dots = k => { const a = ['sched', 'sess', 'exp', 'money', 'pol'], at = a.indexOf(STEPS[k]);
  return at < 0 ? '' : `<div class="dots">${a.map((_, n) => `<i class="${n <= at ? 'on' : ''}"></i>`).join('')}</div>`; };
const section = (key, art, body, label) => { const T = L[lang];
  return `${dots(i)}<div class="art">${art}</div><h2>${T.t[key]}</h2>${body}<button class="btn" id="next">${label || T.ok}</button>`; };
const chips = () => { const T = L[lang]; let s = '';
  for (let k = 0; k < CFG.basic; k++) s += `<b class="a">${T.basic}</b>`;
  for (let k = 0; k < CFG.skill; k++) s += `<b class="s">${T.skill}</b>`; return `<div class="chips">${s}</div>`; };

const VIEWS = {
  lang() { return `<h1>ما هي لغتك المفضّلة؟</h1><p>اللغة التي تفضّل أن يكون الموقع بها.</p>
    <div class="langs"><button class="btn" data-l="ar">عربي</button><button class="btn" data-l="en">English</button><button class="btn" data-l="eg">مصري</button></div>`; },
  hello() { const T = L[lang]; return `<h1 style="font-size:36px">${esc(T.hello(CFG.name))}</h1><p>${T.introT}</p><button class="btn" id="next">${T.start}</button>`; },
  intro() { const T = L[lang]; return `<h1>${T.introT}</h1><p>${T.introS}</p><button class="btn" id="next">${T.start}</button>`; },
  sched() { const T = L[lang]; return section('sched', ART.sched(), `<p>${esc(T.sched(tstr(), T.tzs[CFG.tz]))}</p>`); },
  sess() { const T = L[lang]; return section('sess', ART.sess(), `${chips()}<p>${esc(T.sess(CFG.basic + CFG.skill, CFG.basic, CFG.skill, CFG.last))}</p>`); },
  exp() { const T = L[lang], items = CFG.expect.length ? CFG.expect : [T.expEmpty];
    return section('exp', ART.exp(), `<p>${T.expS}</p><ul class="ex">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`); },
  money() { const T = L[lang]; return section('money', ART.money(), `<p>${T.moneyS} <b style="color:var(--fg)">${CFG.amount.toLocaleString('en')} ${esc(CFG.cur)} ${T.per}</b></p>`); },
  pol() { const T = L[lang]; return section('pol', ART.pol(), `<p>${T.polS}</p><a class="lnk" href="${esc(CFG.policiesUrl)}" target="_blank" rel="noopener">${T.polL}</a>`, T.agree); },
  done() { const T = L[lang], r = T.rc;
    return `<div class="art" style="min-height:90px;font-size:60px">✓</div><h2>${T.doneT}</h2><p>${T.doneS}</p>
      <div class="rcpt"><b>${r[0]}:</b> ${{ ar: 'عربي', eg: 'مصري', en: 'English' }[lang]}<br><b>${r[1]}:</b> ${esc(tstr())} (${T.tzs[CFG.tz]})<br><b>${r[2]}:</b> ${CFG.basic} + ${CFG.skill}<br><b>${r[3]}:</b> ${CFG.amount.toLocaleString('en')} ${esc(CFG.cur)}</div>
      <button class="btn" onclick="alert('prototype')">${T.enter}</button><br><button class="btn ghost" id="chg">${T.chg}</button>`; }
};

function countUp() {
  const el = $('#cnt'); if (!el) return; const t0 = performance.now();
  (function f(t) { const k = Math.min(1, (t - t0) / 1800); el.textContent = Math.round(CFG.amount * (1 - Math.pow(1 - k, 3))).toLocaleString('en'); if (k < 1) requestAnimationFrame(f); })(t0);
}
function save() {
  try { localStorage.setItem('thabit_welcome', JSON.stringify({ lang, seenAt: new Date().toISOString(), time: tstr(), tz: CFG.tz, basic: CFG.basic, skill: CFG.skill, amount: CFG.amount, cur: CFG.cur })); } catch (e) {}
}
function render() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'ar'; document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  const key = i === 0 ? 'lang' : STEPS[i];
  document.documentElement.dir = key === 'lang' ? 'rtl' : document.documentElement.dir;   /* the language question is always Arabic */
  $('#app').innerHTML = `<div class="step">${VIEWS[key]()}</div>`;
  document.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { lang = b.dataset.l; i = 1; render(); });
  const n = $('#next'); if (n) n.onclick = () => { i++; if (STEPS[i] === 'done') save(); render(); };
  const c = $('#chg'); if (c) c.onclick = () => { i = 0; render(); };
  if (key === 'money') countUp();
}
render();
