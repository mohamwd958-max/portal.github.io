(function () {   /* old bar buttons (Add / Language / Theme / Profile) never show: hidden at once, and any saved old order is erased */
  try { const h = document.createElement('style'); h.id = 'thNoOld'; h.textContent = '#plusBtn,#floatBtnTheme,#profBtn,#langBtn,[data-bk="assist"],[data-bk="lang"],[data-bk="theme"],[data-bk="logout"]{display:none!important}'; (document.head || document.documentElement).appendChild(h); } catch (e) { }
  try { const o = JSON.parse(localStorage.getItem('thabit_bar_order') || '[]'); if (Array.isArray(o)) { const n = o.filter(k => ['home', 'reload', 'feed', 'msgr', 'days', 'space', 'edit'].includes(k)); if (n.length !== o.length) localStorage.setItem('thabit_bar_order', JSON.stringify(n)); } } catch (e) { }
})();
/* Thabit trainee dashboard: token -> Supabase RPC. No sheet, no direct table reads. */
console.info('[dashboard] build 2026-11-08 feed-restored-v5');
const SB = "https://vkfexceitwjmxncwceqb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
const TOKEN_KEY = 'thabit_trainee_token', PORTAL = 'index.html';
const T = {
  en: { hi: 'Welcome, ', today: 'Today', week: 'This week', month: 'This month', all: 'Since start', last: 'Last session', info: 'My info', req: 'Send a request', hist: 'Sessions', send: 'Send', sessions: 'Sessions',
        performance: 'Performance', attitude: 'Attitude', soft_skills: 'Soft skills', tefl: 'TEFL', qol: 'QOL', none: 'No data yet', ph: 'Write your request...', overall: 'Overall progress', avg: 'Average', tap: 'Tap a dot to see why', revision: 'Revision', compliance: 'Compliance', attendance: 'Attendance', metrics: 'Scores & details', todo: 'To-Do', donet: 'Done tasks', alldone: 'All caught up ✓', handtip: 'Not sure about a task? Tap the ! next to it and tell me.', handq: 'What is unclear about this task?', sent: 'Sent ✓', fail: 'Could not send, try again', year: 'Year', duration: 'Time in program', subs: 'Sessions & sub titles', notes: 'Notes' },
  ar: { hi: 'أهلاً ', today: 'اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر', all: 'منذ البداية', last: 'آخر جلسة', info: 'بياناتي', req: 'إرسال طلب', hist: 'الجلسات', send: 'إرسال', sessions: 'الجلسات',
        performance: 'الأداء', attitude: 'السلوك', soft_skills: 'المهارات الشخصية', tefl: 'TEFL', qol: 'QOL', none: 'لا توجد بيانات بعد', ph: 'اكتب طلبك...', overall: 'التقدم العام', avg: 'المتوسط', tap: 'اضغط على نقطة لمعرفة السبب', revision: 'المراجعة', compliance: 'الالتزام', attendance: 'الحضور', metrics: 'الأرقام والتفاصيل', todo: 'المهام', donet: 'المهام المنتهية', alldone: 'خلصت كل المهام ✓', handtip: 'مش فاهم تاسك؟ اضغط على ! اللي جنبها وقولي.', handq: 'إيه اللي مش واضح في التاسك دي؟', sent: 'اتبعت ✓', fail: 'ما اتبعتش، حاول تاني', year: 'سنة', duration: 'وقت البرنامج', subs: 'الجلسات والعناوين', notes: 'ملاحظات' },
};
T.eg = Object.assign({}, T.ar, { hi: 'أهلاً ', last: 'آخر جلسة ليك' });
T.en.lmonth = 'Last month'; T.ar.lmonth = 'الشهر الماضي'; T.eg.lmonth = 'الشهر اللي فات';
let D = null, range = 'week', lang = 'en', CUR = [], SER = null;
const $ = id => document.getElementById(id);
function thK() {
  try {
    if (localStorage.getItem('thabit_view') !== 'desktop') return 1;
    const a = Math.min(screen.width, screen.height); if (!(a < 700)) return 1;
    const dw = innerWidth > innerHeight ? Math.max(screen.width, screen.height) : a;
    return Math.max(1, innerWidth / dw);
  } catch (e) { return 1; }
}
function thKApply() { const k = thK(), r = document.documentElement; r.style.setProperty('--bk', k); if (k > 1.05) r.setAttribute('data-dv', '1'); else r.removeAttribute('data-dv'); }
thKApply(); window.addEventListener('resize', thKApply);
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Trainer view: the admin panel opens dashboard.html#vt=<temporary token>. Read-only, never touches the trainee's real login. */
const VT = ((location.hash || '').match(/vt=([A-Za-z0-9]+)/) || [])[1] || null, VIEW = !!VT;
if (VIEW) document.documentElement.classList.add('viewmode');
const VIEW_BLOCK = ['trainee_check_item', 'trainee_set_item_time', 'trainee_set_task', 'trainee_raise_hand', 'trainee_send_request', 'trainee_day_request', 'trainee_msg_mark', 'trainee_submit_report', 'trainee_notifications_read', 'trainee_mark_notifs_read', 'trainee_msg_send', 'trainee_msg_mark_read', 'trainee_logout'];
const tok = () => VIEW ? VT : (() => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } })();
const rpc = (fn, body) => (VIEW && VIEW_BLOCK.includes(fn)) ? Promise.resolve(null) : fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

const THB_LANG_LBL = { en: 'En', ar: 'عربي', eg: 'مصري' };
function setLanguage(l) {
  lang = l; try { localStorage.setItem('thabit_lang', l); } catch (e) {}
  const lt = $('langTxt'); if (lt) lt.textContent = THB_LANG_LBL[l] || l;
  const r = $('htmlRoot'); r.lang = l; r.dir = l === 'en' ? 'ltr' : 'rtl';
  if (D) { render(); if (typeof updateFeed === 'function') updateFeed(); }
}
function toggleTheme() {
  const light = $('bodyRoot').classList.toggle('light-theme');
  $('themeIcon').className = 'fa-solid text-sm ' + (light ? 'fa-sun' : 'fa-moon');
  try { localStorage.setItem('thabit_theme', light ? 'light' : 'dark'); } catch (e) {}
  try { const tb = $('floatBtnTheme'); if (tb) tb.blur(); } catch (e) {}
}


async function logout() {
  if (VIEW) { try { parent.postMessage({ thabitView: 'close' }, '*'); } catch (e) {} return; }
  const t = tok(); try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('currentTrainee'); localStorage.removeItem('thabit_intro_tok'); } catch (e) {}
  if (t) { try { await rpc('trainee_logout', { p_token: t }); } catch (e) {} }
  location.href = PORTAL;
}



function inRange(r) {
  if (range === 'all') return true;
  if (range === 'today') return r.supply_date === itToday();
  { const W = thWin(); if (W) return r.supply_date >= W.s && r.supply_date <= W.e; }   // week / this month / last month = real calendar days (Cairo)
  const d = new Date(r.supply_date + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0);
  const days = Math.round((n - d) / 864e5);
  return days >= 0 && days < ({ week: 7, month: 30, year: 365 })[range];
}
/* Default range: today (only if a session was taken today) -> week -> month -> everything. "Today" is hidden when there is nothing today. */
const hasToday = () => !!(D && D.rows.some(r => r.supply_date === itToday()));
function autoRange() {
  const keep = range; let pick = 'all';
  for (const k of ['today', 'week', 'month']) { range = k; if (D.rows.some(inRange)) { pick = k; break; } }
  range = keep; return pick;
}
function spark(vals) {
  if (vals.length < 2) return '';
  const mn = Math.min(...vals), mx = Math.max(...vals), sp = (mx - mn) || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 300},${60 - ((v - mn) / sp) * 50}`).join(' ');
  return `<svg class="ch" viewBox="0 0 300 70" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
const MET = ['performance', 'attitude', 'soft_skills', 'compliance', 'attendance'];
const MD = [], TK = [], mk = (title, text, ear) => MD.push([title, text, ear || '']) - 1;
/* Ear toggle per container (Notes / TEFL / QOL): QOL is on by default, the others off. Saved on this device. */
const EAR_DEF = { qol: 1, tefl: 0, notes: 0 };
const earOn = k => { let s = {}; try { s = JSON.parse(localStorage.getItem('thabit_ear') || '{}') || {}; } catch (e) {} return k in s ? !!s[k] : !!EAR_DEF[k]; };
const earSet = (k, v) => { let s = {}; try { s = JSON.parse(localStorage.getItem('thabit_ear') || '{}') || {}; } catch (e) {} s[k] = v ? 1 : 0; try { localStorage.setItem('thabit_ear', JSON.stringify(s)); } catch (e) {} };
/* ===== Copy button: copies a text, then turns into a disabled "✓ Copied" ===== */
const CPT = {}; let CPN = 0;
const cpBtn = txt => { const id = ++CPN; CPT[id] = String(txt == null ? '' : txt); return `<button type="button" class="cpb" data-cp="${id}"><i class="fa-regular fa-copy"></i><span>${lang === 'en' ? 'Copy' : 'نسخ'}</span></button>`; };
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.cpb'); if (!b) return;
  e.stopImmediatePropagation(); e.preventDefault();
  if (b.disabled) return;
  const txt = CPT[b.dataset.cp] || '';
  const done = () => { b.disabled = true; b.classList.add('done'); b.innerHTML = `<i class="fa-solid fa-check"></i><span>${lang === 'en' ? 'Copied' : 'تم النسخ'}</span>`; };
  const old = () => { const t = document.createElement('textarea'); t.value = txt; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove(); done(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, old); else old();
}, true);
let HAND_NEW = true, DTL_OPEN = false; try { HAND_NEW = !localStorage.getItem('thabit_hand_seen'); } catch (e) {}
function val(r, k) {
  if (k === 'avg') { const v = MET.map(m => r[m]).filter(x => x != null).map(Number); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; }
  return r[k] == null ? null : Number(r[k]);
}
const DAYS = { week: 7, month: 30, year: 365 };
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const hm = v => { const p = String(v || '').split(':'); return p.length > 1 ? (+p[0]) * 60 + (+p[1]) : null; };
const mins = r => { if (r.total_minutes != null) return Number(r.total_minutes) || 0; const a = hm(r.start_time), b = hm(r.end_time); return a == null || b == null ? 0 : (b >= a ? b - a : b + 1440 - a); };
const fmtDur = m => { const H = lang === 'en' ? 'h' : 'س', M = lang === 'en' ? 'min' : 'د'; return m < 60 ? `${m} ${M}` : `${Math.floor(m / 60)}${H}` + (m % 60 ? ` ${m % 60}${M}` : ''); };
const delta = d => `<div class="${d > 0 ? 'up' : d < 0 ? 'down' : 'flat'}">${d > 0 ? '▲ +' : d < 0 ? '▼ ' : '■ '}${d}</div>`;
/* cumulative series: days (<=31 days) or months; y max = 10 x days in the window */
function series(rows) {
  const n = new Date(); n.setHours(0, 0, 0, 0);
  let st = new Date(n), en = new Date(n);
  const W = thWin();
  if (W) { st = new Date(W.s + 'T00:00:00'); en = new Date(W.e + 'T00:00:00'); }
  else if (range === 'all') { if (rows.length) { st = new Date(rows[0].supply_date + 'T00:00:00'); const l = new Date(rows[rows.length - 1].supply_date + 'T00:00:00'); if (l > en) en = l; } }
  else st.setDate(st.getDate() - (range === 'today' ? 0 : DAYS[range] - 1));
  const days = Math.round((en - st) / 864e5) + 1, monthly = days > 31, bk = [], idx = {};
  if (!monthly) for (let i = 0; i < days; i++) { const d = new Date(st); d.setDate(d.getDate() + i); const k = ymd(d); idx[k] = bk.length; bk.push({ label: k.slice(5), rows: [] }); }
  else { const d = new Date(st.getFullYear(), st.getMonth(), 1); while (d <= en) { const k = ymd(d).slice(0, 7); idx[k] = bk.length; bk.push({ label: k.slice(2), rows: [] }); d.setMonth(d.getMonth() + 1); } }
  rows.forEach(r => { const i = idx[monthly ? r.supply_date.slice(0, 7) : r.supply_date]; if (i != null) bk[i].rows.push(r); });
  const cum = {};
  MET.forEach(k => { let s = 0; cum[k] = bk.map(b => { b.rows.forEach(r => s += Number(r[k]) || 0); return s; }); });
  cum.avg = bk.map((_, i) => +(MET.reduce((a, k) => a + cum[k][i], 0) / MET.length).toFixed(1));
  return { bk, cum, max: 10 * days };
}
function smooth(p) {
  const n = p.length; if (n < 2) return '';
  let d = `M${p[0][0]},${p[0][1]}`; if (n === 2) return d + `L${p[1][0]},${p[1][1]}`;
  const dx = [], m = [], t = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) { const h = dx[i] / 3; d += `C${p[i][0] + h},${p[i][1] + t[i] * h} ${p[i + 1][0] - h},${p[i + 1][1] - t[i + 1] * h} ${p[i + 1][0]},${p[i + 1][1]}`; }
  return d;
}
function chart(S, keys, o) {
  const W = o.W, H = o.H, L = o.L, R = 22, Tp = 12, B = o.f + 10, n = S.bk.length, step = Math.ceil(n / o.lab);
  const x = i => n < 2 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (n - 1), y = v => Tp + (1 - v / S.max) * (H - Tp - B);
  let s = `<svg class="c2${CINTRO.played ? '' : ' ci'}" viewBox="0 0 ${W} ${H}" data-l="${L}" data-b="${H - B}">`;
  if (o.grad) s += `<defs><linearGradient id="thOvG" gradientUnits="userSpaceOnUse" x1="${L}" y1="0" x2="${W - R}" y2="0"><stop offset="0" stop-color="#ff5d55"/><stop offset=".34" stop-color="#ffc247"/><stop offset=".67" stop-color="#22d3a6"/><stop offset="1" stop-color="#4c8dff"/></linearGradient></defs>`;
  let tx = ''; [0, S.max / 2, S.max].forEach(g => tx += `<text class="tx" x="${L - 6}" y="${y(g) + o.f / 3}" text-anchor="end" font-size="${o.f}">${Math.round(g)}</text>`);
  S.bk.forEach((b, i) => { if (i % step === 0) tx += `<text class="tx" x="${x(i)}" y="${H - 3}" text-anchor="middle" font-size="${o.f}">${b.label}</text>`; });
  keys.forEach(k => {
    const li = keys.indexOf(k);
    s += `<path class="ln ${k}" pathLength="1" style="--li:${li}${o.grad && k === 'avg' ? ';stroke:url(#thOvG)' : ''}" fill="none" stroke-width="${o.w}" d="${smooth(S.cum[k].map((v, i) => [x(i), y(v)]))}"/>`;
    if (k !== 'avg') S.bk.forEach((b, i) => { if (b.rows.some(r => r[k] != null && r[k] !== '')) { const cx = x(i), cy = y(S.cum[k][i]), at = `data-k="${k}" data-i="${i}" data-cx="${cx}" data-cy="${cy}"`;
      s += `<circle class="dot ${k}" style="--d:${(n < 2 ? 0 : i / (n - 1)).toFixed(3)};--li:${li}" cx="${cx}" cy="${cy}" r="${o.r}" ${at}/><circle class="dot hit" cx="${cx}" cy="${cy}" r="${o.hit}" ${at}/>`; } });
  });
  return s + tx + '<line class="xh xv" style="display:none"/><line class="xh xz" style="display:none"/></svg>';
}
function kpi(key, rows, all, S) {
  const t = T[lang], vals = rows.map(r => r[key]).filter(v => v != null && v !== '').map(Number).filter(Number.isFinite);
  let h = `<div class="thabit-card dcard"><h4>${t[key]}</h4>`;
  if (!vals.length) return h + `<div class="sm">${t.none}</div>${chart(S, [key], { W: 300, H: 150, L: 30, f: 9, w: 1.6, r: 2.6, hit: 15, lab: 5 })}</div>`;
  const cur = vals[vals.length - 1];
  const before = all.filter(r => r[key] != null && !rows.includes(r)).map(r => Number(r[key]));
  const base = before.length ? before[before.length - 1] : vals[0];
  return h + `<div class="big">${cur} <span class="sm">/ 10</span></div>${delta(+(cur - base).toFixed(2))}${chart(S, [key], { W: 300, H: 150, L: 30, f: 9, w: 1.6, r: 2.6, hit: 15, lab: 5 })}<div class="sm" id="why_${key}">${t.tap}</div></div>`;
}
function overall(rows, S) {
  const t = T[lang], ra = r => { const v = MET.map(m => r[m]).filter(x => x != null).map(Number); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; };
  const vals = rows.map(ra).filter(v => v != null);
  if (!vals.length) return `<h4>${t.overall}</h4><div class="sm">${t.none}</div>`;
  const cur = vals[vals.length - 1], base = vals.length > 1 ? vals[vals.length - 2] : cur;
  const col = { performance: '#ef4444', attitude: '#3b82f6', soft_skills: '#10b981', compliance: '#f97316', attendance: '#06b6d4', avg: 'var(--avg)' };
  return `<h4>${t.overall}</h4><div class="big">${cur} <span class="sm">/ 10</span></div>${delta(+(cur - base).toFixed(1))}` +
    chart(S, ['avg'], { W: 700, H: 300, L: 40, f: 13, w: 3, r: 3.4, hit: 20, lab: 10, grad: true });
}
const listCard = (title, rows, fn) => { const it = rows.slice().reverse().map(fn).filter(Boolean).join('');
  return `<div class="thabit-card dcard"><h4>${title}</h4><div class="lst caps">${it || `<div class="sm">${T[lang].none}</div>`}</div></div>`; };
const item = (r, body) => `<div class="it"><div class="dt">${r.supply_date}</div>${body}</div>`;

/* ===== Sessions popup (opened from the Sessions card at the top) ===== */
const LF = [['supply_date','Date'],['session_number','Session #'],['group_name','Group'],['session_title','Title'],['sub_title','Sub title'],['start_time','Start'],['end_time','End'],
  ['compliance','Compliance'],['revision','Revision'],['revision_details','Revision details'],['notes','Notes'],['tefl','TEFL'],['qol','QOL'],['attitude','Attitude'],['attitude_details','Attitude details'],
  ['soft_skills','Soft skills'],['soft_skills_details','Soft skills details'],['attendance','Attendance'],['attendance_details','Attendance details'],['performance','Performance'],['why','Why'],['performance_details','Performance details'],
  ['weak_points','Weak points'],['tasks','Tasks'],['left_overs','Left overs'],['plans','Plans']];
const sessLine = (a, b) => !b ? '' : String(b).length > 90 ? `<div class="row"><span class="sm">${a}</span><b class="more" dir="auto" onclick="openModal(${mk(a, b)})">${esc(String(b).slice(0, 90))}…</b></div>` : `<div class="row"><span class="sm">${a}</span><b>${esc(b)}</b></div>`;
function renderSessions(rows) {
  const t = T[lang], loc = lang === 'en' ? 'en-GB' : 'ar-EG', parts = D.parts || [];
  const hm5 = v => v ? String(v).slice(0, 5) : '';
  $('ssT').textContent = t.hist;
  $('ssSum').innerHTML = `<span><b>${rows.length}</b> ${t.sessions}</span><span><b>${fmtDur(rows.reduce((a, r) => a + mins(r), 0))}</b></span>`;
  $('ssList').innerHTML = rows.length ? rows.slice().reverse().map((r, n) => {      // newest first, always pinned on top
    let day = ''; try { day = new Date(r.supply_date + 'T12:00:00').toLocaleDateString(loc, { weekday: 'long' }); } catch (e) {}
    const ps = parts.filter(p => p.supply_date === r.supply_date).sort((a, b) => a.part_no - b.part_no);
    const approx = (Number(r.around_h) || 0) + (Number(r.around_m) || 0) > 0 || ps.some(p => (Number(p.around_h) || 0) + (Number(p.around_m) || 0) > 0);
    const m = mins(r), time = r.start_time || r.end_time ? `${hm5(r.start_time)}\u2013${hm5(r.end_time)}` : '';
    return `<details class="ssi"${n === 0 ? ' open' : ''}><summary><div class="ssd"><b>${esc(day)}</b><span>${esc(r.supply_date)}</span><i>#${esc(r.session_number ?? '')}</i></div>`
      + (r.session_title ? `<div class="sst" dir="auto">${esc(r.session_title)}</div>` : '')
      + `<div class="sss">${time ? `<span>${esc(time)}</span>` : ''}${m ? `<span>${approx ? '\u2248 ' : ''}${fmtDur(m)}</span>` : ''}</div></summary>`
      + (ps.length > 1 ? `<div class="ssp">${ps.map(p => `<span>${p.part_no} \u00b7 ${esc(hm5(p.start_time))}\u2013${esc(hm5(p.end_time))}${p.present === false ? ' \u2717' : ''}</span>`).join('')}</div>` : '')
      + `<div class="ssdet">${LF.map(f => sessLine(f[1], r[f[0]])).join('')}</div></details>`;
  }).join('') : `<div class="sm">${t.none}</div>`;
}
function openSessions() { $('ssm').classList.add('open'); }
function closeSessions() { $('ssm').classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSessions(); });

/* ===== Requests: what + details + one required follow-up question ===== */
const RQT = {
  en: { what: 'What is your request?', whatPh: 'e.g. Move Tuesday’s session', msg: 'Details / reason', fin: 'When will you be able to pay?', ses: 'How long will this situation last?',
        need: 'Please answer the question before sending', needWhat: 'Please write your request', needMsg: 'Please add the details',
        durs: [['today', 'Today only'], ['2-3d', '2–3 days'], ['1w', 'About a week'], ['2w', 'About 2 weeks'], ['1m', 'About a month'], ['1m+', 'More than a month']] },
  ar: { what: 'ما هو طلبك؟', whatPh: 'مثال: تأجيل جلسة الثلاثاء', msg: 'التفاصيل / السبب', fin: 'متى ستتمكن من السداد؟', ses: 'كم ستستمر هذه الظروف؟',
        need: 'من فضلك أجب عن السؤال قبل الإرسال', needWhat: 'اكتب طلبك من فضلك', needMsg: 'أضف التفاصيل من فضلك',
        durs: [['today', 'اليوم فقط'], ['2-3d', 'من يومين إلى 3 أيام'], ['1w', 'حوالي أسبوع'], ['2w', 'حوالي أسبوعين'], ['1m', 'حوالي شهر'], ['1m+', 'أكثر من شهر']] },
  eg: { what: 'إيه طلبك؟', whatPh: 'مثلاً: تأجيل سيشن التلات', msg: 'التفاصيل / السبب', fin: 'هتقدر تدفع إمتى؟', ses: 'الموضوع ده هيطول قد إيه؟',
        need: 'جاوب على السؤال الأول قبل ما تبعت', needWhat: 'اكتب طلبك الأول', needMsg: 'ضيف التفاصيل الأول',
        durs: [['today', 'النهاردة بس'], ['2-3d', 'يومين تلاتة'], ['1w', 'حوالي أسبوع'], ['2w', 'حوالي أسبوعين'], ['1m', 'حوالي شهر'], ['1m+', 'أكتر من شهر']] }
};
const rqT = () => RQT[lang] || RQT.en;
function rqLabels() { rqUI(); }
function rqFollowUI(reset) {
  const t = rqT(), ty = $('rqType').value, c = $('rqFollow'), old = $('rqFollowVal'), changed = reset || c.dataset.type !== ty, keep = !reset && old && c.dataset.type === ty ? old.value : '';
  c.dataset.type = ty;
  const star = ' <b class="rqreq">*</b>';
  if (ty === 'financial') c.innerHTML = `<label class="rql">${t.fin}${star}</label><input type="date" id="rqFollowVal" min="${ymd(new Date())}" value="${keep}">`;
  else if (ty === 'session') c.innerHTML = `<label class="rql">${t.ses}${star}</label><div class="rqdur">${t.durs.map(d => `<button type="button" class="rqdc${d[0] === keep ? ' on' : ''}" data-v="${d[0]}">${d[1]}</button>`).join('')}</div><input type="hidden" id="rqFollowVal" value="${keep}">`;
  else c.innerHTML = '';
  if (changed && c.innerHTML) { c.classList.remove('rqfi'); void c.offsetWidth; c.classList.add('rqfi'); }
}

function render() {

  thAutoApply();   // Today only when a session was taken today; otherwise This week (until the trainee picks something himself)
  const t = T[lang], all = D.rows, rows = CUR = all.filter(inRange), p = D.profile || {}, S = SER = series(rows);
  MD.length = 0; TK.length = 0;
  { const hl = $('hello'); hl.textContent = t.hi + (p.trainee || ''); if (window.Thabit) Thabit.setProfile(p.trainee); if (window.Thabit && Thabit.hasName && Thabit.hasName()) { hl.textContent = ''; hl.style.display = 'none'; } } $('kAccT').textContent = t.metrics;
  thRangeUI();
  { const last = rows.length ? rows[rows.length - 1].supply_date : '', n = $('rngNote');
    if (n) { n.hidden = range === 'today' || !last; n.textContent = (lang === 'en' ? 'Last day counted: ' : 'آخر يوم محسوب: ') + last; } }
  $('kpis').innerHTML = `<div class="thabit-card dcard" onclick="openSessions()" role="button" tabindex="0" style="display:flex;gap:14px;cursor:pointer"><div style="flex:1"><h4>${t.sessions} <i class="fa-solid fa-up-right-from-square" style="font-size:.75em;opacity:.55"></i></h4><div class="big">${rows.length}</div></div><div style="flex:1;border-inline-start:1px solid var(--border-color);padding-inline-start:14px"><h4>${t.duration}</h4><div class="big">${fmtDur(rows.reduce((a, r) => a + mins(r), 0))}</div></div></div>` + MET.map(k => kpi(k, rows, all, S)).join('');
  $('overall').innerHTML = overall(rows, S); thDetRefresh();
  $('lists').innerHTML = tasksCard() + dandanaCard() + cap(all, 'notes', t.notes) + cap(all, 'tefl', 'TEFL') + cap(all, 'qol', 'QOL') + scratchCard(); thListsApply();   // the time filter affects the charts only: Notes / TEFL / QOL always show everything
  { const e = $('tInfo'); if (e) e.textContent = t.info; }
  rqUI();
  const L = all[all.length - 1], line = sessLine;
  const IF = [['status_as_of_today','Status'],['days_a_week','Days / week'],['session_time','Session time'],['subscription','Subscription']];
  $('info').innerHTML = IF.map(f => line(f[1], p[f[0]]) + (f[0] === 'session_time' ? line(lang === 'en' ? 'Time zone' : 'التوقيت', tzNowLabel()) : '')).join('');
  infoFold();
  renderSessions(rows);
  watchTodo();
  renderAvatar();
  requestAnimationFrame(() => { fitCaps(); fitTk(); });
  tkRefill();
}
const fetchDone = () => rpc('trainee_done_tasks', { p_token: tok() }).then(a => Array.isArray(a) ? a : []).catch(() => []);
/* ===== Scratches: screenshots / drawings from the trainer's board (Board system), shown in the Notes section =====
   Data: D.scratches = [{ id, image_url, title?, created_at | date }]  (newest first is fine, it is sorted here).
   Not connected yet: set SCR_RPC to the RPC name (it gets { p_token }) once the Board system is linked, or put `scratches` inside the trainee_dashboard result. */
const SCR_RPC = null;
const SCRX = {
  en: { t: 'Scratches', none: 'No scratches yet', prev: 'Previous', next: 'Next', zoom: 'Tap the picture to zoom' },
  ar: { t: 'خربشات', none: 'لا توجد خربشات بعد', prev: 'السابق', next: 'التالي', zoom: 'اضغط على الصورة للتكبير' },
  eg: { t: 'خربشات', none: 'لسه مفيش خربشات', prev: 'السابق', next: 'التالي', zoom: 'دوس على الصورة عشان تكبّرها' }
};
const SCRT = () => SCRX[lang] || SCRX.en;
const fetchScratches = () => SCR_RPC ? rpc(SCR_RPC, { p_token: tok() }).then(a => Array.isArray(a) ? a : []).catch(() => []) : Promise.resolve([]);
const scrOk = u => /^(https?:\/\/|data:image\/)/i.test(String(u || ''));
function scrList() {
  return ((D && D.scratches) || []).map(x => ({ url: x.image_url || x.url || x.image || x.src || '', title: x.title || '', date: String(x.date || x.created_at || '').slice(0, 10) }))
    .filter(x => scrOk(x.url)).sort((a, b) => b.date.localeCompare(a.date));
}
let SCR_I = 0;
function scratchCard() {
  const t = SCRT(), l = scrList(), shown = l.slice(0, 4);
  const th = shown.map((x, i) => `<button type="button" class="scrt" onclick="openScratch(${i})" aria-label="${esc(x.title || x.date || t.t)}"><img src="${esc(x.url)}" alt="" loading="lazy">${i === 3 && l.length > 4 ? `<span class="scrm">+${l.length - 3}</span>` : ''}</button>`).join('');
  return `<div class="thabit-card dcard" id="scratchCard"><h4>${t.t}</h4>${l.length ? `<div class="scrg">${th}</div>` : `<div class="sm">${t.none}</div>`}</div>`;
}
function openScratch(i) {
  const l = scrList(); if (!l.length) return; SCR_I = (i + l.length) % l.length;
  const x = l[SCR_I], t = SCRT();
  $('mdl').dataset.ear = ''; $('mdl').classList.add('scr'); $('mT').textContent = (x.title || t.t) + (x.date ? ' · ' + x.date : '');
  $('mB').innerHTML = `<div class="scrv"><img class="scrimg" src="${esc(x.url)}" alt="" onclick="this.parentNode.classList.toggle('scrz')"></div><div class="scrn"><button type="button" class="btn2" onclick="openScratch(${SCR_I + 1})">${t.prev}</button><span class="sm">${SCR_I + 1} / ${l.length}</span><button type="button" class="btn2" onclick="openScratch(${SCR_I - 1})">${t.next}</button></div><div class="sm" style="text-align:center;margin-top:6px">${t.zoom}</div>`;
  $('mdl').classList.add('open');
}
(function () { const st = document.createElement('style'); st.textContent = `
.scrg{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:8px;margin-top:6px}
.scrt{position:relative;aspect-ratio:1;padding:0;border:1px solid var(--border-color);border-radius:12px;overflow:hidden;background:rgba(148,163,184,.1);cursor:pointer}
.scrt img{width:100%;height:100%;object-fit:cover;display:block}
.scrm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(2,6,23,.6);color:#fff;font-weight:800;font-size:1rem}
#mdl.scr .mbox{max-width:min(96vw,1100px)}
.scrv{overflow:auto;max-height:68vh;border-radius:12px;background:rgba(148,163,184,.08);text-align:center}
.scrimg{max-width:100%;height:auto;display:inline-block;cursor:zoom-in}
.scrv.scrz .scrimg{max-width:none;cursor:zoom-out}
.scrn{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}.scrn .btn2{padding:7px 14px;font-size:.78rem}`; document.head.appendChild(st); })();
const cap = (rows, key, title) => {
  const list = rows.slice().reverse().filter(r => r[key]).map(r => ({ date: r.supply_date, text: String(r[key]) }));
  const mi = MD.push([title, '', key, list]) - 1;
  const it = list.map((x, n) => `<button type="button" class="cap" data-n="${n}"><span class="dt">${x.date}</span><span dir="auto">${esc(rtStrip(x.text).replace(/\s+/g, ' ').slice(0, 70))}</span></button>`).join('');
  const ear = lang === 'en' ? 'Pronunciation' : 'النطق';
  return `<div class="thabit-card dcard earc" data-md="${mi}"><div class="earh"><h4>${title}</h4><div class="earbar"><button type="button" class="ear${earOn(key) ? ' on' : ''}" data-ear="${key}" aria-pressed="${earOn(key)}" aria-label="${ear}" title="${ear}"><i class="fa-solid fa-ear-listen"></i></button></div></div><div class="lst">${it || `<div class="sm">${T[lang].none}</div>`}</div></div>`;
};
/* one cell and a quarter of the next one (only one cell: just that one). Nothing scrolls inside: a tap anywhere opens the whole container. */
function fitCaps() {
  document.querySelectorAll('.earc .lst').forEach(l => {
    const c = [...l.children].filter(x => x.classList.contains('cap')); l.style.maxHeight = '';
    if (!c.length || !c[0].offsetHeight) return;
    if (c.length < 2) { l.style.maxHeight = 'none'; return; }
    l.style.maxHeight = (c[0].offsetHeight + (parseFloat(getComputedStyle(c[0]).marginBottom) || 0) + c[1].offsetHeight * 0.25) + 'px';
  });
}
window.addEventListener('resize', fitCaps);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCaps);
/* a tap on the container (cell, text, empty space, anything except the options bar) pops the whole container up */
document.addEventListener('click', e => {
  const c = e.target.closest && e.target.closest('.earc'); if (!c || e.target.closest('.earbar')) return;
  const cell = e.target.closest('.cap'); openModal(+c.dataset.md, cell ? +cell.dataset.n : 0);
});
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.ear'); if (!b) return;
  e.stopPropagation(); e.preventDefault();
  const on = !b.classList.contains('on'); earSet(b.dataset.ear, on);
  b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  b.classList.remove('shk', 'cls'); void b.offsetWidth; b.classList.add(on ? 'shk' : 'cls');
  setTimeout(() => b.classList.remove('shk', 'cls'), 1100);
}, true);
/* ===== Rich notes: 1. / a. = related ideas, "-" = separate points, blank line = new capsule ===== */
const escv0 = s => (window.ThabitRich ? ThabitRich.inline(esc(s)) : esc(s)).replace(/(<[^>]+>)|\s*\|\s*/g, (m, tag) => tag ? tag : '<i class="vb"></i>');   // markers first, then "|" -> divider (never inside a tag)
/* [text](https://link) = a real link the student can tap, inside any rich text */
const LNK_RE = /\[([^\]\n]{1,200})\]\((https?:\/\/[^\s)]{3,2000})\)/g;
const escv = s => {
  s = String(s == null ? '' : s); let out = '', last = 0, m; LNK_RE.lastIndex = 0;
  while ((m = LNK_RE.exec(s))) { out += escv0(s.slice(last, m.index)) + `<a class="alk" href="${esc(m[2])}" target="_blank" rel="noopener noreferrer">${esc(m[1])}</a>`; last = m.index + m[0].length; }
  return out + escv0(s.slice(last));
};
function rich(txt) {
  return String(txt || '').trim().split(/\n\s*\n/).filter(b => b.trim()).map(b => {
    const ls = b.split('\n').map(l => l.trimEnd()).filter(l => l.trim()), NUM = /^\s*(\d+|[a-zA-Z])[.)]\s+/, BUL = /^\s*[-•*]\s+/;
    if (ls.every(l => NUM.test(l))) return `<ol class="rl" dir="auto"${/^\s*[a-zA-Z][.)]/.test(ls[0]) ? ' type="a"' : ''}>${ls.map(l => `<li>${escv(l.replace(NUM, ''))}</li>`).join('')}</ol>`;
    if (ls.every(l => BUL.test(l))) return `<ul class="rl" dir="auto">${ls.map(l => `<li>${escv(l.replace(BUL, ''))}</li>`).join('')}</ul>`;
    return `<p class="rp" dir="auto">${ls.map(escv).join('<br>')}</p>`;
  }).join('');
}

/* ===== Per-capsule copy: every block (separated by a blank line) gets its own copy button ===== */
const richC = txt => String(txt || '').trim().split(/\n\s*\n/).filter(b => b.trim()).map(b => `<div class="rcap">${rich(b)}${cpBtn(rtStrip(b.trim()))}</div>`).join('');
(function () { const s = document.createElement('style'); s.textContent = `
.rcap{margin:0 0 8px}
.rcap>.rp,.rcap>.rl{margin:0;padding:8px 12px;border-radius:12px;background:rgba(148,163,184,.1)}
.rcap>.rl{padding-inline-start:30px}
.rcap .cpb{margin-top:2px}
.dnr{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:3px 0}.dnr .chip{margin:0}`; document.head.appendChild(s); })();

/* ===== Tasks & Dandana from supply_items: always visible; the clock only unlocks the check ===== */
const ITT = {
  en: { tasks: 'Tasks', dnd: 'Dandana', opens: 'Opens', ready: 'Ready, tap the circle', closed: 'Closed', waiting: 'Opens after your session ends', saved: 'Saved', not_yet: 'Not open yet', all_done: 'Already completed', no_plan: 'Opens after your session ends', fail: 'Could not save, try again', est: ' (estimated)', endsIn: 'Ends in', closedDue: 'Closed due to:', why_hours18: 'more than 18 hours passed since your last session', why_next_session: 'your next session is close', why_holiday: 'the weekend break', hol: 'You are on the weekend break. Tasks are paused until Saturday.', missed: 'Missed', done: 'Done', u: { d: 'd', h: 'h', m: 'm' } },
  ar: { tasks: 'المهام', dnd: 'دندنة', opens: 'تفتح', ready: 'جاهزة، اضغط على الدائرة', closed: 'أُغلقت', waiting: 'تفتح بعد انتهاء جلستك', saved: 'تم الحفظ', not_yet: 'لم يحن موعدها بعد', all_done: 'تم إكمالها', no_plan: 'تفتح بعد انتهاء جلستك', fail: 'تعذر الحفظ، حاول مرة أخرى', est: ' (تقديري)', endsIn: 'ينتهي بعد', closedDue: 'أُغلقت بسبب:', why_hours18: 'مرّ أكثر من 18 ساعة على آخر جلسة', why_next_session: 'اقترب موعد جلستك القادمة', why_holiday: 'بدأت الإجازة الأسبوعية', hol: 'أنت في إجازة نهاية الأسبوع. المهام متوقفة حتى السبت.', missed: 'فائتة', done: 'تمت', u: { d: 'ي', h: 'س', m: 'د' } },
  eg: { tasks: 'التاسكس', dnd: 'دندنة', opens: 'بتفتح', ready: 'جاهزة، دوس على الدايرة', closed: 'اتقفلت', waiting: 'بتفتح بعد ما السيشن تخلص', saved: 'اتسجلت', not_yet: 'لسه معادها ما جاش', all_done: 'خلصتها قبل كده', no_plan: 'بتفتح بعد ما السيشن تخلص', fail: 'معرفناش نسجل، جرب تاني', est: ' (تقريبًا)', endsIn: 'بتنتهي بعد', closedDue: 'اتقفلت بسبب:', why_hours18: 'عدّى أكتر من 18 ساعة على آخر سيشن', why_next_session: 'ميعاد السيشن الجاية قرّب', why_holiday: 'بدأت الإجازة', hol: 'إنت في إجازة نهاية الأسبوع. التاسكس واقفة لحد السبت.', missed: 'فاتت', done: 'خلصت', u: { d: 'ي', h: 'س', m: 'د' } }
};
ITT.en.why_range = 'the time range you were given has ended';
ITT.ar.why_range = 'انتهت المدة المحددة';
ITT.eg.why_range = 'المدة المحددة خلصت';
ITT.en.hol_m = 'Monthly break: sessions are paused until the 1st of next month. Enjoy!';
ITT.ar.hol_m = 'إجازة آخر الشهر: الجلسات متوقفة حتى أول الشهر الجديد. استمتع!';
ITT.eg.hol_m = 'إجازة آخر الشهر: السيشنز واقفة لحد أول الشهر الجاي. انبسط!';
Object.assign(ITT.en, { att: 'Attachments', att1: 'Attachment', openlk: 'Open link', starts: 'Starts', dl: 'Your deadline', fin_before: 'Finish these before the deadline.' });
Object.assign(ITT.ar, { att: 'المرفقات', att1: 'مرفق', openlk: 'فتح الرابط', starts: 'البداية', dl: 'الموعد النهائي', fin_before: 'يجب إنهاء المطلوب قبل الموعد النهائي.' });
Object.assign(ITT.eg, { att: 'المرفقات', att1: 'مرفق', openlk: 'افتح اللينك', starts: 'بدأت', dl: 'الديدلاين بتاعك', fin_before: 'المفروض تخلّص الحاجات دي قبله.' });
const itT = () => ITT[lang] || ITT.en;
const DTL2 = {};
const itToday = () => new Date(cairoNow()).toISOString().slice(0, 10);
function itState(it) {
  const p = it.plan, done = (it.checks || []).length;
  if (!p) return { k: 'wait' };
  if (done >= p.n_eff) return { k: 'done' };
  const now = cairoNow();
  if (now > p.deadline) return { k: 'closed', why: p.deadline_reason };
  const o = p.opens[done];
  return now >= o ? { k: 'open', o } : { k: 'lock', o };
}
function fmtOpen(ms) {
  const d = new Date(ms), n = new Date(cairoNow()), h = d.getUTCHours(), tm = `${(h % 12) || 12}:${String(d.getUTCMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  if (d.toISOString().slice(0, 10) === n.toISOString().slice(0, 10)) return tm;
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG', { weekday: 'short', timeZone: 'UTC' }) + ' ' + tm;
}
const itClosedToday = x => !!(x.plan && new Date(x.plan.deadline).toISOString().slice(0, 10) === itToday());
const itShown = x => { const k = itState(x).k; return k !== 'done' && k !== 'closed'; };
function fmtLeft(ms) {
  const u = itT().u, m = Math.max(0, Math.floor(ms / 60000)), dd = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
  const out = []; if (dd) out.push(dd + u.d); if (h || dd) out.push(h + u.h); if (!dd) out.push(mm + u.m);
  return out.join(' ');
}
const cdHtml = dl => `<i class="fa-regular fa-clock"></i> ${itT().endsIn} ${fmtLeft(dl - cairoNow())} \u00b7 ${fmtOpen(dl)}`;
/* ===== Monthly break (automatic, nothing to enter in Supabase) =====
   Last MB.week days of every month (any month length): only the first MB.work days are sessions,
   the rest is a break until the 1st of the next month. Change these two numbers to adjust the rule. */
const MB = { week: 7, work: 3 };
function inMonthBreak(ms) {   // ms = Cairo wall-clock timestamp (same format as cairoNow())
  const d = new Date(ms), last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  return d.getUTCDate() > last - MB.week + MB.work;
}
const monthBreak = () => inMonthBreak(cairoNow());
const isHoliday = () => { const n = new Date(cairoNow()), w = n.getUTCDay(); return (w === 4 && n.getUTCHours() >= 12) || w === 5 || monthBreak(); };
const holBanner = () => isHoliday() ? `<div class="hol"><i class="fa-solid fa-umbrella-beach"></i> ${monthBreak() ? itT().hol_m : itT().hol}</div>` : '';
const closedText = x => { const t = itT(), p = x.plan; return `${t.closedDue} ${t['why_' + (p && p.deadline_reason)] || ''}`.trim(); };
setInterval(() => { document.querySelectorAll('.cd[data-dl]').forEach(el => { const dl = +el.dataset.dl; if (dl - cairoNow() <= 0) { render(); return; } el.innerHTML = cdHtml(dl); }); }, 30000);

(function () { const s = document.createElement('style'); s.textContent = `
.itt{position:relative;height:50px;margin:10px 30px 0;flex:1}
.itt::before{content:"";position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(148,163,184,.3)}
.ittp{position:absolute;top:0;width:0}
.ittp i{position:absolute;left:-6px;top:0;width:12px;height:12px;border-radius:50%;background:rgba(148,163,184,.45)}
.ittp i.on{background:#34d399}.ittp i.nx{background:#fbbf24}
.ittp span{position:absolute;left:0;transform:translateX(-50%);top:16px;font-size:.62rem;white-space:nowrap;opacity:.8}
.ittp span.lo2{top:30px}
.itl2{display:flex;align-items:flex-start;gap:8px;margin-top:8px}`; document.head.appendChild(s); })();
const DLET = { en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], ar: ['أ', 'إ', 'ث', 'ر', 'خ', 'ج', 'س'] };
function fmtOpenS(ms) {   // short label for the timeline: day letter + time, so labels never run into each other
  const d = new Date(ms), h = d.getUTCHours(), en = lang === 'en', L = (DLET[lang] || DLET.ar)[d.getUTCDay()];
  return `<b>${L}</b> ${(h % 12) || 12}:${String(d.getUTCMinutes()).padStart(2, '0')}${en ? (h < 12 ? ' AM' : ' PM') : (h < 12 ? ' ص' : ' م')}`;
}
const tlHtml = (p, d, s, da) => {
  da = da || ((j, c) => `class="${c}"`);
  const o = p && p.opens; if (!o || o.length < 2) return '';
  const a = Math.min(...o), span = Math.max(...o) - a; if (!(span > 0)) return '';
  return `<div class="itt" dir="ltr">${o.map((t, j) => `<div class="ittp" style="left:${((t - a) / span * 100).toFixed(2)}%"><i ${da(j, j < d ? 'on' : (j === d && s.k === 'open' ? 'nx' : ''))}></i><span class="${j % 2 ? 'lo2' : ''}">${fmtOpenS(t)}</span></div>`).join('')}</div>`;
};

/* ===== Applications (Monthly obligations) = ordinary tasks whose body ends with
   @@app@@{"s":startMs,"e":endMs,"l":[{"d":"description","u":"https://link"}]}
   The marker is hidden here; its links become the Attachments cards under the text. ===== */
const APP_MARK = '@@app@@', ATTMAP = {};
function appSplit(body) {
  const s = String(body == null ? '' : body), i = s.lastIndexOf(APP_MARK);
  if (i < 0) return { text: s, app: null };
  let j = null; try { j = JSON.parse(s.slice(i + APP_MARK.length)); } catch (e) { }
  return { text: s.slice(0, i).trim(), app: j && typeof j === 'object' ? j : null };
}
const attOk = u => /^https?:\/\//i.test(String(u || ''));
function fmtDT(ms) {
  const d = new Date(ms), h = d.getUTCHours(), tm = `${(h % 12) || 12}:${String(d.getUTCMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) + ' · ' + tm;
}
function appExtra(it, app, atts, endAt) {
  if (!app) return '';
  const t = itT(); ATTMAP[it.id] = atts;
  const cards = atts.length ? `<div class="atw"><div class="ath"><i class="fa-solid fa-paperclip"></i> ${t.att}</div><div class="atl">${atts.map((a, j) => `<button type="button" class="atc" onclick="openAtt(${it.id},${j})"><i class="fa-solid fa-link"></i><span dir="auto">${esc(a.d || a.u)}</span></button>`).join('')}</div></div>` : '';
  const st = +app.s || (it.plan && it.plan.opens && it.plan.opens[0]) || 0, en = +endAt || +app.e || 0;
  const when = (st || en) ? `<div class="apd">${st ? `<div><i class="fa-regular fa-calendar-plus"></i> ${t.starts}: <b>${esc(fmtDT(st))}</b></div>` : ''}${en ? `<div><i class="fa-regular fa-flag"></i> ${t.dl}: <b>${esc(fmtDT(en))}</b></div>` : ''}<div class="sm">${t.fin_before}</div></div>` : '';
  return cards + when;
}
/* tap an attachment card: its description + the link in a small card; tapping the link opens the real site */
function openAtt(id, j) {
  TKOPEN = null;
  const a = (ATTMAP[id] || [])[j]; if (!a) return; const t = itT();
  let host = a.u; try { const u = new URL(a.u); host = u.hostname.replace(/^www\./, '') + (u.pathname.length > 1 ? u.pathname : ''); } catch (e) { }
  $('mdl').dataset.ear = ''; $('mT').textContent = t.att1;
  $('mB').innerHTML = `<div class="atd"><div class="atdd" dir="auto">${esc(a.d || '')}</div><a class="atlk" href="${esc(a.u)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i><span dir="ltr">${esc(host)}</span><small>${t.openlk}</small></a></div>`;
  $('mdl').classList.add('open');
}
(function () { const s = document.createElement('style'); s.textContent = `
a.alk{color:#7dd3fc;text-decoration:underline;text-underline-offset:3px;font-weight:700;cursor:pointer;pointer-events:auto!important}
body.light-theme a.alk{color:#0369a1}
.atw{margin-top:10px}.ath{font-size:.72rem;font-weight:800;letter-spacing:.4px;opacity:.7;margin-bottom:6px}.ath i{margin-inline-end:4px}
.atl{display:flex;flex-wrap:wrap;gap:8px}
.atc{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:12px;border:1px solid rgba(125,211,252,.45);background:rgba(125,211,252,.08);color:inherit;font:inherit;font-size:.8rem;font-weight:700;cursor:pointer;text-align:start}
.atc i{color:#7dd3fc;flex:none}.atc span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.atc:active{transform:scale(.98)}
.apd{margin-top:10px;padding:8px 12px;border-radius:12px;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);font-size:.78rem;line-height:1.9}
.apd i{margin-inline-end:6px;color:#fbbf24}
.atd{display:flex;flex-direction:column;gap:12px}
.atdd{font-size:.95rem;line-height:1.8;overflow-wrap:anywhere}
.atlk{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;border:1px solid rgba(125,211,252,.55);background:rgba(125,211,252,.1);color:#7dd3fc;text-decoration:none;font-weight:800;overflow:hidden}
.atlk span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.atlk small{opacity:.75;font-weight:600}
body.light-theme .atlk,body.light-theme .atc i{color:#0369a1}`; document.head.appendChild(s); })();

/* vertical timeline (top = first check, bottom = last): dots on the left, the time written to the right of each dot */
const tlVHtml = (p, d, s) => {
  const o = p && p.opens; if (!o || o.length < 2) return '';
  const n = p.n_eff || o.length;
  return `<div class="vt">${o.slice(0, n).map((t, j) => `<div class="vtr"><i class="${j < d ? 'on' : (j === d && s.k === 'open' ? 'nx' : '')}"></i><span>${fmtOpenS(t)}</span></div>`).join('')}</div>`;
};
function itemRow(it) {
  const t = itT(), s = itState(it), p = it.plan, n = p ? p.n_eff : it.repeats, d = (it.checks || []).length;
  const ap = appSplit(it.body), atts = ap.app && Array.isArray(ap.app.l) ? ap.app.l.filter(a => a && attOk(a.u)) : [];
  const i = TK.push({ date: it.date, no: (it.kind === 'dandana' ? 100 : 0) + it.no, text: [it.title, it.badge, ap.text.replace(/\[([^\]\n]+)\]\(https?:\/\/[^\s)]+\)/g, '$1')].filter(Boolean).join(' - ') }) - 1;
  const icon = { done: 'fa-check', open: '', lock: 'fa-lock', wait: 'fa-hourglass-half', closed: 'fa-ban' }[s.k];
  const hi = it.priority === 'high' ? '<span class="hi">HIGH</span>' : '';
  const head = it.kind === 'dandana'
    ? `<b dir="ltr">${esc(it.title || '')}</b>${it.badge ? `<i class="itv"></i><span class="itar" dir="rtl">${esc(it.badge)}</span>` : ''}`
    : `<b dir="auto">${esc(it.title || '')}</b>${hi}${it.badge ? `<i class="itv"></i><span class="itbd" dir="auto">${esc(it.badge)}</span>` : ''}`;
  const eds = VIEW ? [] : tkEditable(it);
  const da = (j, c) => `class="${c}"`;
  const dots = Array.from({ length: n }, (_, j) => `<i ${da(j, j < d ? 'on' : (j === d && s.k === 'open' ? 'nx' : ''))}></i>`).join('<b></b>');
  const TP_ = TPK[lang] || TPK.en;
  const pickBtn = eds.length ? (tpUsed(it.id)
    ? `<button type="button" class="tpkb used" disabled><i class="fa-solid fa-check"></i> ${TP_.used}</button>`
    : `<button type="button" class="tpkb" onclick="event.stopPropagation();tkPersonalize(${it.id})"><i class="fa-regular fa-clock"></i> ${TP_.choose}</button>`) : '';
  const endAt = p && p.custom && p.range_end ? p.range_end : (p && p.deadline);   // range-based items show the end of the range
  const vt = tlVHtml(p, d, s), bodyHtml = (ap.text ? `<div class="itd rich">${rich(ap.text)}</div>` : '') + appExtra(it, ap.app, atts, endAt);
  const status = s.k === 'lock' ? `${t.opens} ${fmtOpen(s.o)}${p && p.estimated ? t.est : ''}` : s.k === 'open' ? t.ready : s.k === 'closed' ? closedText(it) : s.k === 'wait' ? t.waiting : '';
  return `<div class="itm"><button type="button" class="itc ${s.k}${TKNEW.has(it.id) ? ' itpop' : ''}" ${s.k === 'open' ? `onclick="checkItem(${it.id})"` : 'disabled'} aria-label="check">${icon ? `<i class="fa-solid ${icon}"></i>` : ''}</button>`
    + `<div class="itb2"><div class="ith">${head}</div>`
    + (vt ? `<div class="itsp" dir="ltr"><div class="itsl">${vt}<span class="sm itcnt">${d}/${n}</span></div><div class="itsd" dir="auto">${bodyHtml}</div></div>`
           : `${bodyHtml}<div class="itl">${dots}<span class="sm" style="margin-inline-start:8px">${d}/${n}</span></div>`)
    + `<div class="itg"><span style="width:${Math.round(100 * d / n)}%"></span></div>`
    + (status ? `<div class="its">${esc(status)}</div>` : '')
    + ((s.k === 'lock' || s.k === 'open') && p ? `<div class="its cd" data-dl="${endAt}">${cdHtml(endAt)}</div>` : '') + pickBtn + `</div>`
    + `</div>`;
}
const TKT = {
  en: { tasks: 'Tasks', urgent: 'Urgent', prev: 'Previous', log: 'Log', logT: 'Done tasks', none: 'Nothing here' },
  ar: { tasks: 'المهام', urgent: 'عاجل', prev: 'السابقة', log: 'السجل', logT: 'المهام المنجزة', none: 'لا يوجد شيء' },
  eg: { tasks: 'التاسكس', urgent: 'عاجل', prev: 'اللي فاتت', log: 'السجل', logT: 'التاسكس الخلصانة', none: 'مفيش حاجة' }
};
let TKOPEN = null, TKL = {};
const tkHead = x => {
  const t2 = itT(), k = itState(x).k, ok = k === 'done';
  return `<summary><div class="ssd"><b dir="auto">${esc(x.title || '')}</b><span>${esc(x.date)}</span><i>${(x.checks || []).length}/${x.plan ? x.plan.n_eff : x.repeats}</i></div>${x.badge ? `<div class="sst" dir="auto">${esc(x.badge)}</div>` : ''}<div class="sss"><span style="${ok ? 'color:#34d399' : 'color:#fb7185'}">${ok ? t2.done : t2.missed}</span>${x.kind === 'dandana' ? `<span>${esc(t2.dnd)}</span>` : ''}${k === 'closed' ? `<span>${esc(closedText(x))}</span>` : ''}</div></summary>`;
};
/* preview cell inside the card: just a look, a tap anywhere opens the whole container */
const tkLogCell = x => `<div class="ssi tkprev">${tkHead(x).replace(/^<summary>|<\/summary>$/g, '')}</div>`;
/* cell inside the container pop-up: opens its own details */
const tkLogDet = x => {
  const s = itState(x), p = x.plan, ap = appSplit(x.body), atts = ap.app && Array.isArray(ap.app.l) ? ap.app.l.filter(a => a && attOk(a.u)) : [];
  const endAt = p && p.custom && p.range_end ? p.range_end : (p && p.deadline);
  return `<details class="ssi">${tkHead(x)}<div class="ssdet">${ap.text ? `<div class="rich" dir="auto">${rich(ap.text)}</div>` : ''}${appExtra(x, ap.app, atts, endAt)}${s.k === 'closed' ? `<div class="row"><b dir="auto">${esc(closedText(x))}</b></div>` : ''}${window.thDispHtml ? thDispHtml(x) : ''}</div></details>`;
};
const tkGroup = list => { const by = {}; list.forEach(x => (by[x.date] = by[x.date] || []).push(x));
  return Object.keys(by).sort().reverse().map(dt => `<div class="it"><div class="dt">${dt}</div>${by[dt].sort((a, b) => a.no - b.no).map(itemRow).join('')}</div>`).join(''); };
/* ===== Collapsed cell: ONE cell per container (title, number, date). The check circle is not even drawn until the trainee has opened the container once. ===== */
const TKSEEN_KEY = 'thabit_tk_seen'; let TKNEW = new Set(), TKDIRTY = false;
const tkSeen = () => { try { return JSON.parse(localStorage.getItem(TKSEEN_KEY) || '{}') || {}; } catch (e) { return {}; } };
const tkCell = x => {
  if (!x) return '';
  const s = itState(x), seen = !!tkSeen()[x.id], t2 = itT();
  const icon = { done: 'fa-check', open: '', lock: 'fa-lock', wait: 'fa-hourglass-half', closed: 'fa-ban' }[s.k];
  const lbl = x.kind === 'dandana' ? t2.dnd : (lang === 'en' ? 'Task' : 'تاسك');
  return `<div class="tkcell"><div class="tkcm"><div class="tkc1"><b>${esc(lbl)} #${esc(x.no)}</b><span class="sm">${esc(x.date)}</span></div><div class="tkc2" dir="auto">${esc(x.title || '')}${x.badge ? ' · ' + esc(x.badge) : ''}</div></div>`
    + (seen ? `<span class="tkdot ${s.k}" aria-hidden="true">${icon ? `<i class="fa-solid ${icon}"></i>` : ''}</span>` : '') + `</div>`;
};
const tkEmpty = () => `<div class="tkcell tkempty"><div class="tkcm"><div class="tkc2">${esc((TKT[lang] || TKT.en).none)}</div></div></div>`;
const tkEmptyFull = () => `<div class="sm" style="padding:10px 4px">${esc((TKT[lang] || TKT.en).none)}</div>`;
function tkSec(key, cls, title, n, cells, full, mt, ids) {
  TKL[key] = { t: mt, f: full, ids: ids || [] };
  return `<div class="tkc ${cls}" data-k="${key}"><div class="tkt">${title}<b>${n || ''}</b></div><div class="tkl">${cells}</div></div>`;
}
function tasksCard() {
  const t = TKT[lang] || TKT.en, its = (D.items || []).filter(x => x.kind === 'task');
  const fin = its.filter(x => !itShown(x)).sort((a, b) => b.date.localeCompare(a.date) || a.no - b.no);
  const today = itToday(), pend = its.filter(itShown);
  const urg = pend.filter(x => x.date === today || x.priority === 'high').sort((a, b) => (b.priority === 'high') - (a.priority === 'high') || b.date.localeCompare(a.date) || a.no - b.no);
  const prv = pend.filter(x => !(x.date === today || x.priority === 'high'));
  /* the card and BOTH containers are always there, even when empty (an empty one just says "nothing here"; the old one can always be opened) */
  const c1 = tkSec('tk:urg', 'urg', t.urgent, urg.length, urg.length ? tkCell(urg[0]) : tkEmpty(), () => urg.length ? tkGroup(urg) : tkEmptyFull(), `${t.tasks} · ${t.urgent}`, urg.map(x => x.id));
  const c2 = tkSec('tk:prv', 'prv', t.prev, prv.length + fin.length, (prv[0] || fin[0]) ? tkCell(prv[0] || fin[0]) : tkEmpty(), () => (prv.length + fin.length) ? (prv.length ? tkGroup(prv) : '') + fin.map(tkLogDet).join('') : tkEmptyFull(), `${t.tasks} · ${t.prev}`, prv.concat(fin).map(x => x.id));
  return `<div class="thabit-card dcard" id="taskCard">${holBanner()}<div class="tkh"><h4>${t.tasks}</h4></div><div class="tk2">${c1}${c2}</div></div>`;
}

/* ===== "Choose your time": the student moves the check time of a dot that has not come yet =====
   Rules: never into the past, never after the deadline, only dots not checked yet. Nothing is forced:
   close to a session (3h before the next one / 1h after the last one) he only gets a recommendation once. */
const TPK = {
  en: { choose: 'Personalize', done: 'Done', pick: 'Pick a time', now: 'Do it now', save: 'Save', cancel: 'Cancel', saved: 'Time saved ✓', fail: 'Could not save, try again', gone: 'This time has already passed', rec: 'Recommendation', sure: 'I am sure, continue', change: 'Change time',
        wb: 'Reviewing within 3 hours before your next session is not recommended.', wa: 'Reviewing within an hour after your last session is not recommended.' },
  ar: { choose: 'تخصيص', done: 'تم', pick: 'اختر وقتاً', now: 'افعلها الآن', save: 'حفظ', cancel: 'إلغاء', saved: 'تم حفظ الوقت ✓', fail: 'تعذر الحفظ، حاول مرة أخرى', gone: 'هذا الوقت مرّ بالفعل', rec: 'توصية', sure: 'أنا متأكد، تابع', change: 'تغيير الوقت',
        wb: 'لا يُنصح بالمراجعة خلال الثلاث ساعات التي تسبق جلستك القادمة.', wa: 'لا يُنصح بالمذاكرة خلال الساعة التي تلي آخر جلسة.' },
  eg: { choose: 'تخصيص', done: 'تم', pick: 'اختار وقت', now: 'اعملها دلوقتي', save: 'حفظ', cancel: 'إلغاء', saved: 'الوقت اتحفظ ✓', fail: 'معرفناش نحفظ، جرب تاني', gone: 'الوقت ده عدّى خلاص', rec: 'نصيحة', sure: 'متأكد، كمّل', change: 'غيّر الوقت',
        wb: 'مش مُفضّل تراجع في التلات ساعات اللي قبل سيشنك الجاية.', wa: 'مش مُفضّل تذاكر في الساعة اللي بعد آخر سيشن.' }
};
let TEDIT = null, TP = null;
Object.assign(TPK.en, { gap: 'Two checks of the same task can not be at the same time. The gap between them must be at least 30 minutes.', after: 'Put it 30 min after the previous', before: 'Put it 30 min before the next' });
Object.assign(TPK.ar, { gap: 'لا يمكن أن تكون مرتان من نفس المهمة في نفس الوقت. يجب أن يكون الفاصل بينهما 30 دقيقة على الأقل.', after: 'ضعها بعد السابقة بنصف ساعة', before: 'ضعها قبل التالية بنصف ساعة' });
Object.assign(TPK.eg, { gap: 'ما ينفعش مرتين من نفس التاسك يبقوا في نفس الوقت. لازم يبقى بينهم نص ساعة على الأقل.', after: 'حطها بعد اللي قبلها بنص ساعة', before: 'حطها قبل اللي بعدها بنص ساعة' });
Object.assign(TPK.en, { used: 'Time already changed today', once: 'You can change the times only once a day. After you save, no more changes today.', drag: 'Drag the dots to the time you want' });
Object.assign(TPK.ar, { used: 'تم تغيير الوقت اليوم', once: 'يمكنك تغيير الأوقات مرة واحدة فقط في اليوم. بعد الحفظ لا يمكن التغيير مرة أخرى اليوم.', drag: 'اسحب النقاط إلى الوقت الذي تريده' });
Object.assign(TPK.eg, { used: 'غيّرت الوقت النهاردة خلاص', once: 'تقدر تغيّر الأوقات مرة واحدة بس في اليوم. بعد ما تحفظ مفيش تغيير تاني النهاردة.', drag: 'اسحب النقط للوقت اللي عايزه' });
const TK_GAP = 30 * 6e4;
/* when the last finished check of this item happened (Cairo wall-clock ms), or null */
function tkLastCheck(it) {
  const off = cairoNow() - Date.now(); let best = null;
  (it.checks || []).forEach(c => {
    const v = c && typeof c === 'object' ? (c.at || c.checked_at || c.created_at || c.ts || c.time || c.t) : c;
    let ms = typeof v === 'number' ? (v < 1e11 ? v * 1000 : v) : Date.parse(v);
    if (Number.isFinite(ms)) { ms += off; if (best == null || ms > best) best = ms; }
  });
  return best;
}
/* once a day per task (kept on this device) */
const TPU_KEY = 'thabit_tp_used';
const tpUsedMap = () => { try { return JSON.parse(localStorage.getItem(TPU_KEY) || '{}') || {}; } catch (e) { return {}; } };
const tpUsed = id => tpUsedMap()[id] === itToday();
function tpMarkUsed(id) { const m = tpUsedMap(), td = itToday(); Object.keys(m).forEach(k => { if (m[k] !== td) delete m[k]; }); m[id] = td; try { localStorage.setItem(TPU_KEY, JSON.stringify(m)); } catch (e) {} }
/* the "Choose your time" button: one dot = the normal time picker; more than one = a full-screen timeline where he drags the dots */
function tkPersonalize(id) {
  const T = TPK[lang] || TPK.en, it = (D.items || []).find(x => x.id === id); if (!it || !it.plan || VIEW) return;
  const eds = tkEditable(it);
  if (!eds.length) { itToast(T.gone); render(); return; }
  if (tpUsed(id)) { itToast(T.used); return; }
  if (eds.length === 1) tkPick(id, eds[0]); else tkTimeline(id, eds);
}
function tkTlClose() { const o = $('tpt'); if (o) o.remove(); }
function tkTimeline(id, eds) {
  const it = (D.items || []).find(x => x.id === id), p = it && it.plan; if (!p) return;
  const T = TPK[lang] || TPK.en; tkTlClose(); tkClose();
  const now = Math.floor(cairoNow() / 6e4) * 6e4, endMax = Math.floor((p.deadline - 6e4) / 6e4) * 6e4;
  const o0 = p.opens.slice(0, p.n_eff), W = o0.slice(), n = o0.length;
  const A = Math.min(now, ...o0), B = Math.max(endMax, ...o0, A + 36e5), span = B - A, half = span / 2, H = 330, TOP = 24;
  /* the period is cut in two halves, drawn side by side as two vertical lines (time runs top to bottom): small and with room to write the times */
  const o = document.createElement('div'); o.id = 'tpt'; o.className = 'tpt';
  o.innerHTML = `<div class="tptb" dir="auto"><div class="tpt1">${esc(it.title || '')}</div><div class="sm">${esc(T.drag)}</div><div class="sm tpo">${esc(T.once)}</div>`
    + `<div class="tvw" dir="ltr" style="height:${TOP + H + 26}px">`
    + [0, 1].map(c => `<div class="tvc" style="left:${c * 50}%"><div class="tvl" style="top:${TOP}px;height:${H}px"></div><div class="tvh" style="top:0">${fmtOpenS(A + c * half)}</div><div class="tvh" style="top:${TOP + H + 6}px">${fmtOpenS(A + (c + 1) * half)}</div></div>`).join('')
    + `</div><div class="tpval" id="tpval">&nbsp;</div><div class="tpwarn" id="tpwarn" hidden></div>`
    + `<div class="tpbs"><button type="button" class="tpc">${T.cancel}</button><button type="button" class="tps">${T.save}</button></div></div>`;
  document.body.appendChild(o);
  const wrap = o.querySelector('.tvw'), els = o0.map((_, j) => { const d = document.createElement('div'); d.className = 'tvd ' + (eds.includes(j) ? 'ed' : 'fx'); d.dataset.j = j; d.innerHTML = '<i></i><span></span>'; wrap.appendChild(d); return d; });
  const warn = $('tpwarn'), val = $('tpval'), sv = o.querySelector('.tps'); let conf = false, wt = null;
  const upd = () => {
    const pos = els.map((_, j) => { const c = W[j] - A >= half ? 1 : 0, y = TOP + Math.min(1, Math.max(0, (W[j] - A - c * half) / half)) * H; return { j, c, y }; });
    pos.forEach(q => { const d = els[q.j]; d.style.left = `calc(${q.c * 50}% + 16px)`; d.style.top = q.y + 'px'; d.querySelector('span').innerHTML = fmtOpenS(W[q.j]); });
    [0, 1].forEach(c => { let last = -1e9; pos.filter(q => q.c === c).sort((a, b) => a.y - b.y).forEach(q => { const ly = Math.max(q.y, last + 15); els[q.j].querySelector('span').style.top = (ly - q.y - 8) + 'px'; last = ly; }); });   // labels never sit on top of each other
  };
  const note = m => { warn.textContent = m; warn.hidden = !m; clearTimeout(wt); if (m) wt = setTimeout(() => { if (!conf) warn.hidden = true; }, 3200); };
  upd();
  let drag = null;
  wrap.addEventListener('pointerdown', e => { const d = e.target.closest('.tvd.ed'); if (!d) return; e.preventDefault(); drag = { j: +d.dataset.j, id: e.pointerId }; d.classList.add('drag'); try { wrap.setPointerCapture(e.pointerId); } catch (x) {} });
  wrap.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const j = drag.j, r = wrap.getBoundingClientRect(), c = (e.clientX - r.left) < r.width / 2 ? 0 : 1, fy = Math.min(1, Math.max(0, (e.clientY - r.top - TOP) / H)), raw = A + c * half + fy * half;
    const lo = Math.max(now, j > 0 ? W[j - 1] + TK_GAP : now), hi = Math.min(endMax, j + 1 < n ? W[j + 1] - TK_GAP : endMax);
    if (lo > hi) return;
    let ms = Math.round(raw / 3e5) * 3e5, hit = false;
    if (ms < lo) { ms = lo; hit = j > 0 && raw < W[j - 1] + TK_GAP && raw > now; } else if (ms > hi) { ms = hi; hit = j + 1 < n && raw > W[j + 1] - TK_GAP && raw < endMax; }
    W[j] = ms; conf = false; sv.textContent = T.save; upd(); val.textContent = fmtDT(ms);
    if (hit) note(T.gap); else if (!conf) warn.hidden = true;
  });
  const up = e => { if (!drag || e.pointerId !== drag.id) return; const d = els[drag.j]; if (d) d.classList.remove('drag'); drag = null; };
  wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  o.querySelector('.tpc').onclick = tkTlClose;
  o.addEventListener('click', e => { if (e.target === o) tkTlClose(); });
  sv.onclick = async () => {
    const changed = eds.filter(j => W[j] !== o0[j]);
    if (!changed.length) { tkTlClose(); return; }
    const ws = [...new Set(changed.map(j => tkWarn(W[j])).filter(Boolean))];
    if (ws.length && !conf) { conf = true; warn.innerHTML = `<b>${esc(T.rec)}</b><br>` + ws.map(esc).join('<br>'); warn.hidden = false; sv.textContent = T.sure; return; }
    tkTlClose(); let ok = 0;
    for (const j of changed) { const r = await rpc('trainee_set_item_time', { p_token: tok(), p_item_id: id, p_idx: j, p_open_ms: W[j] }).catch(() => null); if (r === true) ok++; }
    if (ok) { tpMarkUsed(id); D.times = await fetchTimes(); mergeTimes(); render(); itToast(T.saved); } else itToast(T.fail);
  };
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('tpt')) tkTlClose(); });
const tkIso = ms => new Date(ms).toISOString().slice(0, 16);
function tkEditable(it) {   // indexes of the dots that can still be moved
  const p = it.plan; if (!p || (it.kind !== 'task' && it.kind !== 'dandana') || !Array.isArray(p.opens)) return [];
  const k = itState(it).k; if (k !== 'lock' && k !== 'open') return [];
  const now = cairoNow(), out = [];
  for (let j = (it.checks || []).length; j < p.n_eff; j++) if (p.opens[j] > now) out.push(j);
  return out;
}
function tkEditToggle(id) { TEDIT = TEDIT === id ? null : id; render(); }
const fetchTimes = () => rpc('trainee_item_times', { p_token: tok() }).then(o => o && typeof o === 'object' && !Array.isArray(o) && !o.message && !o.code ? o : {}).catch(() => ({}));
function mergeTimes() {   // the student's own choices sit on top of the planned times
  const ov = (D && D.times) || {};
  ((D && D.items) || []).forEach(it => {
    const p = it.plan; if (!p || !Array.isArray(p.opens)) return;
    if (!p.opens0) p.opens0 = p.opens.slice();
    const o = ov[it.id];
    p.opens = p.opens0.map((x, j) => o && o[j] != null && Number.isFinite(+o[j]) ? +o[j] : x);
  });
}
function tkWarn(ms) {
  const T = TPK[lang] || TPK.en, sc = schedule();
  if (sc) { const nx = nextAfter(sc, ms - 1); if (nx && nx >= ms && nx - ms < 3 * 36e5) return T.wb; }
  const rows = (D && D.rows) || [], L = rows[rows.length - 1];
  if (L && L.end_time) {
    const e0 = hm(L.end_time), s0 = hm(L.start_time); let e = Date.parse(L.supply_date + 'T00:00:00Z') + e0 * 6e4;
    if (s0 != null && e0 < s0) e += 864e5;
    if (ms >= e && ms - e < 36e5) return T.wa;
  }
  return '';
}
function tkClose() { const o = $('tpk'); if (o) o.remove(); TP = null; }
function tkPick(id, j) {
  const it = (D.items || []).find(x => x.id === id); if (!it || !it.plan) return;
  const T = TPK[lang] || TPK.en;
  if (!tkEditable(it).includes(j)) { itToast(T.gone); render(); return; }
  const now = Math.floor(cairoNow() / 6e4) * 6e4, max = Math.floor((it.plan.deadline - 6e4) / 6e4) * 6e4;
  if (!(max > now)) { itToast(T.gone); return; }
  const cur = Math.min(max, Math.max(now, Math.floor(it.plan.opens[j] / 6e4) * 6e4));
  TP = { id, j, min: now, max, ms: cur };
  tkClose(); TP = { id, j, min: now, max, ms: cur };
  const o = document.createElement('div'); o.id = 'tpk'; o.className = 'tpk';
  o.innerHTML = `<div class="tpb" dir="auto"><div class="tpbt">${esc(it.title || '')} · ${j + 1}/${it.plan.n_eff}</div><div class="sm" style="margin-bottom:6px">${esc(T.once)}</div><div class="tpl" id="tpl"></div>`
    + `<input type="range" id="tpr" min="0" max="${(max - now) / 6e4}" step="1" value="${(cur - now) / 6e4}" dir="ltr">`
    + `<input type="datetime-local" id="tpd" min="${tkIso(now)}" max="${tkIso(max)}" value="${tkIso(cur)}" dir="ltr">`
    + `<div class="tpbs"><button type="button" class="tpnow">${T.now}</button><button type="button" class="tps">${T.save}</button><button type="button" class="tpc">${T.cancel}</button></div></div>`;
  document.body.appendChild(o);
  const lab = () => { $('tpl').textContent = fmtDT(TP.ms); }, set = ms => { TP.ms = Math.min(TP.max, Math.max(TP.min, Math.round(ms / 6e4) * 6e4)); $('tpr').value = (TP.ms - TP.min) / 6e4; $('tpd').value = tkIso(TP.ms); lab(); };
  lab();
  $('tpr').oninput = e => set(TP.min + (+e.target.value) * 6e4);
  $('tpd').onchange = e => { const v = Date.parse(e.target.value + ':00Z'); set(Number.isFinite(v) ? v : TP.ms); };
  o.querySelector('.tpnow').onclick = () => tkTry(Math.floor(cairoNow() / 6e4) * 6e4);
  o.querySelector('.tps').onclick = () => tkTry(TP.ms);
  o.querySelector('.tpc').onclick = tkClose;
  o.addEventListener('click', e => { if (e.target === o) tkClose(); });
}
function tkTry(ms) {
  const T = TPK[lang] || TPK.en, b0 = document.querySelector('#tpk .tpb');
  /* the one hard rule: at least 30 minutes between the checks of the same task */
  const it = TP && (D.items || []).find(x => x.id === TP.id), p = it && it.plan;
  if (p && b0) {
    const d = (it.checks || []).length, j = TP.j, prev = j > d ? p.opens[j - 1] : tkLastCheck(it), next = j + 1 < p.n_eff ? p.opens[j + 1] : null;
    let sug = null, key = '';
    if (prev != null && ms < prev + TK_GAP) { sug = prev + TK_GAP; key = 'after'; }
    else if (next != null && ms > next - TK_GAP) { sug = next - TK_GAP; key = 'before'; }
    if (key) {
      const okSug = sug >= TP.min && sug <= TP.max && (prev == null || sug >= prev + TK_GAP) && (next == null || sug <= next - TK_GAP);
      b0.innerHTML = `<div class="tpbt">${T.rec}</div><div class="tpl" style="font-weight:600">${esc(T.gap)}</div><div class="tpbs"><button type="button" class="tpc">${T.change}</button>${okSug ? `<button type="button" class="tps">${T[key]}</button>` : ''}</div>`;
      b0.querySelector('.tpc').onclick = () => { const id = TP.id, jj = TP.j; tkPick(id, jj); };
      const sb = b0.querySelector('.tps'); if (sb) sb.onclick = () => tkTry(sug);
      return;
    }
  }
  const w = tkWarn(ms); if (!w) { tkSend(ms); return; }
  const b = document.querySelector('#tpk .tpb'); if (!b) { tkSend(ms); return; }
  b.innerHTML = `<div class="tpbt">${T.rec}</div><div class="tpl" style="font-weight:600">${esc(w)}</div><div class="tpbs"><button type="button" class="tpc">${T.change}</button><button type="button" class="tps">${T.sure}</button></div>`;
  b.querySelector('.tps').onclick = () => tkSend(ms);
  b.querySelector('.tpc').onclick = () => { const id = TP.id, j = TP.j; tkPick(id, j); };
}
async function tkSend(ms) {
  const T = TPK[lang] || TPK.en, id = TP && TP.id, j = TP && TP.j; tkClose(); if (id == null) return;
  /* show the new time at once, then confirm with the server (rolled back if it fails) */
  if (!D.times) D.times = {};
  const before = D.times[id], mine = Array.isArray(before) ? before.slice() : Object.assign({}, before || {}); mine[j] = ms;
  D.times[id] = mine; mergeTimes(); render();
  const ok = await rpc('trainee_set_item_time', { p_token: tok(), p_item_id: id, p_idx: j, p_open_ms: ms }).catch(() => null);
  if (ok === true) { tpMarkUsed(id); D.times = await fetchTimes(); mergeTimes(); render(); itToast(T.saved); }
  else { if (before === undefined) delete D.times[id]; else D.times[id] = before; mergeTimes(); render(); itToast(T.fail); }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('tpk')) tkClose(); });
(function () { const st = document.createElement('style'); st.textContent = `
.tpkb{margin-top:8px;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;border:1px solid rgba(52,211,153,.55);background:rgba(52,211,153,.12);color:#34d399;font:700 .74rem Inter,Cairo,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.tpkb.on{background:#34d399;color:#04231a}
body.light-theme .tpkb:not(.on){color:#047857}
.ittp i.ed,.itl i.ed{background:#34d399!important;box-shadow:0 0 0 4px rgba(52,211,153,.3);cursor:pointer;animation:tpPulse 1.6s ease-in-out infinite}
.itl i.ed{position:relative}
.ittp i.ed::after,.itl i.ed::after{content:"";position:absolute;inset:-12px}
@keyframes tpPulse{50%{box-shadow:0 0 0 8px rgba(52,211,153,.1)}}
.tpk{position:fixed;inset:0;z-index:10070;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.5);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.tpb{box-sizing:border-box;width:min(92vw,380px);padding:16px;border-radius:20px;background:rgba(15,23,42,.96);color:#f1f5f9;border:1px solid rgba(255,255,255,.2);box-shadow:0 18px 50px rgba(0,0,0,.55);font:600 .85rem Inter,Cairo,sans-serif}
body.light-theme .tpb{background:rgba(255,255,255,.97);color:#0f172a;border-color:rgba(15,23,42,.18)}
.tpbt{font-weight:800;margin-bottom:8px;overflow-wrap:anywhere}
.tpl{margin:6px 0 10px;color:#34d399;font-weight:800;line-height:1.6}
body.light-theme .tpl{color:#047857}
.tpb input[type=range]{width:100%;accent-color:#34d399;height:28px;touch-action:pan-x}
.tpb input[type=datetime-local]{width:100%;box-sizing:border-box;margin-top:6px;padding:8px 10px;border-radius:12px;border:1px solid rgba(148,163,184,.4);background:rgba(148,163,184,.12);color:inherit;font:inherit}
.tpbs{display:flex;gap:8px;margin-top:14px}
.tpbs button{flex:1;padding:9px 6px;border-radius:12px;border:1px solid rgba(148,163,184,.45);background:rgba(148,163,184,.14);color:inherit;font:700 .76rem Inter,Cairo,sans-serif;cursor:pointer}
.tpbs .tps{background:#34d399;border-color:#34d399;color:#04231a}
.tpbs .tpnow{border-color:rgba(251,191,36,.6);color:#fbbf24;background:rgba(251,191,36,.12)}`; document.head.appendChild(st); })();
const DNX = { en: { cur: 'Current' }, ar: { cur: 'الحالية' }, eg: { cur: 'الحالية' } };
function dandanaCard() {
  const t = TKT[lang] || TKT.en, t2 = itT(), its = (D.items || []).filter(x => x.kind === 'dandana');
  const pend = its.filter(itShown), fin = its.filter(x => !itShown(x)).sort((a, b) => b.date.localeCompare(a.date) || a.no - b.no), cur = (DNX[lang] || DNX.en).cur;
  const c1 = tkSec('dn:cur', 'urg', cur, pend.length, pend.length ? tkCell(pend[0]) : tkEmpty(), () => pend.length ? tkGroup(pend) : tkEmptyFull(), `${t2.dnd} · ${cur}`, pend.map(x => x.id));
  const c2 = tkSec('dn:old', 'prv', t.prev, fin.length, fin.length ? tkCell(fin[0]) : tkEmpty(), () => fin.length ? fin.map(tkLogDet).join('') : tkEmptyFull(), `${t2.dnd} · ${t.prev}`, fin.map(x => x.id));
  return `<div class="thabit-card dcard" id="dandanaCard"><div class="tkh"><h4>${t2.dnd}</h4></div><div class="tk2">${c1}${c2}</div></div>`;
}
function openTkModal(key) {
  const o = TKL[key]; if (!o) return; TKOPEN = key;
  /* first time this container is opened: its circles pop in (once), and from now on they are drawn in the collapsed cell too */
  const seen = tkSeen(); TKNEW = new Set((o.ids || []).filter(id => !seen[id]));
  if (TKNEW.size && !VIEW) { (o.ids || []).forEach(id => { seen[id] = 1; }); try { localStorage.setItem(TKSEEN_KEY, JSON.stringify(seen)); } catch (e) {} TKDIRTY = true; }
  $('mdl').dataset.ear = ''; $('mT').textContent = o.t; $('mB').innerHTML = `<div class="tkm">${o.f()}</div>`;
  TKNEW = new Set();
  $('mdl').classList.add('open');
  const box = document.querySelector('#mdl .mbox'); if (box) box.scrollTop = 0;
}
function tkRefill() {   // after a check / re-render, keep the open container pop-up up to date
  if (!TKOPEN || !TKL[TKOPEN] || !$('mdl').classList.contains('open') || !document.querySelector(`[data-k="${TKOPEN}"]`)) return;
  const box = document.querySelector('#mdl .mbox'), y = box ? box.scrollTop : 0;
  $('mB').innerHTML = `<div class="tkm">${TKL[TKOPEN].f()}</div>`; if (box) box.scrollTop = y;
}
/* a tap anywhere on a container (except the check circle / links) opens the whole list */
document.addEventListener('click', e => {
  const c = e.target.closest && e.target.closest('#taskCard .tkc, #dandanaCard .tkc'); if (!c) return;
  if (e.target.closest('button,a,.ed')) return;
  openTkModal(c.dataset.k);
});
/* each list shows one cell and a quarter of the next one, so you know there is more below; scroll to see it */
function fitTk() {
  document.querySelectorAll('#taskCard .tkl, #dandanaCard .tkl').forEach(l => {
    const c = [...l.children]; l.style.maxHeight = ''; l.style.overflowY = '';
    if (c.length < 2 || !c[0].offsetHeight) return;
    l.style.overflowY = 'hidden';
    l.style.maxHeight = (c[0].offsetHeight + (parseFloat(getComputedStyle(c[0]).marginBottom) || 0) + c[1].offsetHeight * 0.25) + 'px';
  });
}
window.addEventListener('resize', fitTk);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTk);
(function () { const st = document.createElement('style'); st.textContent = `
.tk2.one{grid-template-columns:1fr!important}
/* ===== Facebook-style bottom tab bar: fixed, full width, icons evenly spaced, no dividers ===== */
html #mobileFloatingBar,html[data-dv] #mobileFloatingBar,html[data-bar] #mobileFloatingBar{position:fixed!important;left:0!important;right:0!important;top:auto!important;bottom:0!important;margin:0 auto!important;transform:none!important;width:min(100%,520px)!important;max-width:none!important;height:calc(54px + env(safe-area-inset-bottom,0px))!important;min-height:0!important;box-sizing:border-box!important;padding:0 8px env(safe-area-inset-bottom,0px)!important;flex-direction:row!important;flex-wrap:nowrap!important;justify-content:space-around!important;align-items:center!important;gap:0!important;border-radius:16px 16px 0 0!important;border-bottom-width:0!important}
@media(max-width:600px){html #mobileFloatingBar,html[data-dv] #mobileFloatingBar,html[data-bar] #mobileFloatingBar{width:100%!important;border-radius:0!important;border-left-width:0!important;border-right-width:0!important}}
html #mobileFloatingBar .bar-divider{display:none!important}
/* one icon-to-circle ratio everywhere (about 45%): bar buttons and pop-out buttons */
html #mobileFloatingBar svg.asv,html #mobileFloatingBar [data-bk="assist"] svg{width:16px!important;height:16px!important}
html #langPop .lgi>i,html #langPop .lgi .plS{font-size:20px!important}
html #langPop .lgi .plA svg{width:21px!important;height:21px!important}
html #langPop .lgi svg:not(.asv){width:21px!important;height:21px!important}
html #thHint .thnx,html[data-bar="bottom"] #thHint .thnx{bottom:calc(66px + env(safe-area-inset-bottom,0px))!important}
/* each of the 3 sections sits in the vertical middle of the screen */
html .thsec{justify-content:center!important}
.tkl{overflow:hidden;cursor:pointer}
.tkl>.ssi.tkprev{cursor:pointer}
.ittp span b{font-size:.78rem;margin-inline-end:3px}.ittp span{unicode-bidi:isolate}
#taskCard *,#dandanaCard *{scrollbar-width:none!important;-ms-overflow-style:none!important}
#taskCard *::-webkit-scrollbar,#dandanaCard *::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
#dandanaCard{grid-column:1/-1}
.tkl::-webkit-scrollbar{display:none;width:0;height:0}
.lst{scrollbar-width:none;-ms-overflow-style:none}.lst::-webkit-scrollbar{display:none;width:0;height:0}
/* same look as the Notes / TEFL / QOL cells */
.tkl>.it,.tkl>.ssi,.tkm>.it,.tkm>.ssi{box-sizing:border-box;margin:0 0 8px;padding:10px 14px;border-radius:16px;border:1px solid rgba(148,163,184,.22);background:rgba(148,163,184,.08)}
.tkl>.it>.dt,.tkm>.it>.dt{text-align:center;font-weight:700;margin-bottom:6px}
#taskCard .itc,#dandanaCard .itc{zoom:.8}`; document.head.appendChild(st); })();
/* tap any finished / missed item in the log: its full details (text, attachments, dates, status) open in the pop-up */
function openLogItem(id) {
  TKOPEN = null;
  const x = (D.items || []).find(i => i.id === id); if (!x) return;
  const t2 = itT(), s = itState(x), p = x.plan, n = p ? p.n_eff : x.repeats, d = (x.checks || []).length;
  const ap = appSplit(x.body), atts = ap.app && Array.isArray(ap.app.l) ? ap.app.l.filter(a => a && attOk(a.u)) : [];
  const endAt = p && p.custom && p.range_end ? p.range_end : (p && p.deadline);
  $('mdl').dataset.ear = ''; $('mT').textContent = x.title || '';
  $('mB').innerHTML = `<div class="sm" style="margin-bottom:8px">${esc(x.date)}${x.badge ? ' · <span dir="auto">' + esc(x.badge) + '</span>' : ''}</div>`
    + (ap.text ? `<div class="rich" dir="auto">${rich(ap.text)}</div>` : '')
    + appExtra(x, ap.app, atts, endAt)
    + `<div class="sss" style="margin-top:10px"><span style="${s.k === 'done' ? 'color:#34d399' : 'color:#fb7185'}">${s.k === 'done' ? t2.done : t2.missed}</span><span>${d}/${n}</span>${s.k === 'closed' ? `<span>${esc(closedText(x))}</span>` : ''}</div>` + (window.thDispHtml ? thDispHtml(x) : '');
  $('mdl').classList.add('open');
}
function itemsCard(kind) {
  const t = itT(), its = (D.items || []).filter(x => x.kind === kind);
  if (!its.length) return '';
  const group = list => { const by = {}; list.forEach(x => (by[x.date] = by[x.date] || []).push(x));
    return Object.keys(by).sort().reverse().map(dt => `<div class="it"><div class="dt">${dt}</div>${by[dt].sort((a, b) => a.no - b.no).map(itemRow).join('')}</div>`).join(''); };
  const pend = its.filter(itShown), fin = its.filter(x => !itShown(x));
  return `<div class="thabit-card dcard" id="${kind}Card"><h4>${kind === 'task' ? t.tasks : t.dnd}</h4><div class="lst">${pend.length ? group(pend) : `<div class="sm">${T[lang].alldone}</div>`}</div>`
    + (fin.length ? `<details class="dtl" ${DTL2[kind] ? 'open' : ''} ontoggle="DTL2['${kind}']=this.open"><summary>${T[lang].donet}</summary><div class="lst">${group(fin)}</div></details>` : '') + '</div>';
}
function itToast(m) { const e = document.createElement('div'); e.className = 'ittoast'; e.textContent = m; document.body.appendChild(e); setTimeout(() => e.remove(), 2400); }
async function checkItem(id) {
  const t = itT(), r = await rpc('trainee_check_item', { p_token: tok(), p_item_id: id }).catch(() => null);
  const f = await rpc('trainee_items', { p_token: tok() }).catch(() => null);
  if (f && Array.isArray(f.items)) { D.items = f.items; mergeTimes(); }
  render();
  itToast(r && r.ok ? t.saved : (r && t[r.reason]) || t.fail);
}
setInterval(() => { if (typeof D !== 'undefined' && D && (D.items || []).some(it => { const s = itState(it); return s.k === 'lock' && cairoNow() >= s.o; })) render(); }, 20000);

function parseTasks(r) {
  return String(r.tasks || '').split('\n').map(l => l.trim()).filter(Boolean).map((l, i) => {
    const p = l.split('/');
    if (p.length >= 4 && /^\d+$/.test(p[0].trim())) return { date: r.supply_date, no: +p[0], type: p[1].trim(), det: p[2].trim(), text: p.slice(3).join('/').trim() };
    return { date: r.supply_date, no: i + 1, type: '', det: '', text: l };
  });
}
function todoCard(all) {
  const t = T[lang], done = new Set((D.done || []).map(d => d.supply_date + '#' + d.task_no));
  const days = all.slice().reverse().map(r => ({ date: r.supply_date, tasks: parseTasks(r) })).filter(d => d.tasks.length);
  if (!days.length && (D.items || []).some(i => i.kind === 'task')) return '';
  const task = (k, dn) => { const i = TK.push(k) - 1; return `<div class="tk${dn ? ' dn' : ''}"><input type="checkbox" ${dn ? 'checked' : ''} onchange="toggleTask(${i},this.checked)"><div class="tkb" dir="auto">${k.type || k.det ? `<div><b>${esc(k.type)}</b> <span class="sm">${esc(k.det)}</span></div>` : ''}<div>${esc(k.text)}</div></div></div>`; };
  const split = f => days.map(d => ({ date: d.date, tasks: d.tasks.filter(k => done.has(k.date + '#' + k.no) === f) })).filter(d => d.tasks.length);
  const blk = (d, f) => `<div class="it"><div class="dt">${d.date}</div>${d.tasks.map(k => task(k, f)).join('')}</div>`;
  const pend = split(false), fin = split(true);
  return `<div class="thabit-card dcard" id="todoCard"><h4>${t.todo}</h4>${HAND_NEW ? `<div class="tip" id="handTip">${t.handtip}</div>` : ''}<div class="lst">${pend.length ? pend.map(d => blk(d, false)).join('') : `<div class="sm">${days.length ? t.alldone : t.none}</div>`}</div>` +
    (fin.length ? `<details class="dtl" ${DTL_OPEN ? 'open' : ''} ontoggle="DTL_OPEN=this.open"><summary>${t.donet}</summary><div class="lst">${fin.map(d => blk(d, true)).join('')}</div></details>` : '') + '</div>';
}
async function toggleTask(i, on) {
  const k = TK[i]; D.done = (D.done || []).filter(d => !(d.supply_date === k.date && d.task_no === k.no));
  if (on) D.done.push({ supply_date: k.date, task_no: k.no });
  render();
  const ok = await rpc('trainee_set_task', { p_token: tok(), p_date: k.date, p_no: k.no, p_text: k.text, p_done: on }).catch(() => null);
  if (ok !== true) { D.done = await fetchDone(); render(); }
}
function openModal(i, focus) {
  TKOPEN = null;
  const m = MD[i]; $('mdl').dataset.ear = m[2] && earOn(m[2]) ? '1' : ''; $('mT').textContent = m[0];
  $('mB').innerHTML = m[3] ? `<div class="rich">${m[3].map((x, n) => `<div class="cti" data-n="${n}"><div class="dt ctd">${esc(x.date)}</div>${richC(x.text)}</div>`).join('')}</div>` : `<div class="rich">${richC(m[1])}</div>`;
  $('mdl').classList.add('open');
  const box = document.querySelector('#mdl .mbox'), t = m[3] && focus ? $('mB').querySelector(`.cti[data-n="${focus}"]`) : null;
  box.scrollTop = t ? t.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 8 : 0;
}
function closeModal() { $('mdl').classList.remove('open', 'scr'); TKOPEN = null; if (TKDIRTY) { TKDIRTY = false; render(); } }   // render: the collapsed cells now show their circle
function raiseHand(i) {
  const k = TK[i], t = T[lang]; $('mdl').dataset.ear = ''; HAND_NEW = false; try { localStorage.setItem('thabit_hand_seen', '1'); } catch (e) {}
  $('mT').textContent = `${k.date} · #${k.no}`;
  $('mB').innerHTML = `<div class="sm" dir="auto" style="margin-bottom:8px">${esc(k.text)}</div><div style="margin-bottom:6px">${t.handq}</div><textarea id="hMsg" rows="4" maxlength="1000"></textarea><button type="button" class="btn2" id="hBtn">${t.send}</button><div id="hRes" class="sm" style="margin-top:8px"></div>`;
  $('hBtn').onclick = async () => {
    const m = $('hMsg').value.trim(); if (!m) return; $('hBtn').disabled = true;
    const ok = await rpc('trainee_raise_hand', { p_token: tok(), p_date: k.date, p_no: k.no, p_task: k.text, p_message: m }).catch(() => null);
    if (ok === true) { $('hRes').textContent = t.sent; setTimeout(closeModal, 1200); } else { $('hRes').textContent = t.fail; $('hBtn').disabled = false; }
  };
  $('mdl').classList.add('open');
}
function watchTodo() {
  const c = $('todoCard') || $('taskCard'), tip = $('handTip'); if (!c || !tip) return;
  const go = () => { tip.classList.add('show'); setTimeout(() => { try { localStorage.setItem('thabit_hand_seen', '1'); } catch (e) {} }, 10000); };
  if (!window.IntersectionObserver) return go();
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { go(); o.disconnect(); } }, { threshold: .6 }).observe(c);
}



async function load() {
  if (window.__mtGate && await window.__mtGate) return;   // maintenance ON: the dashboard never loads
  const d = tok() ? await rpc('trainee_dashboard', { p_token: tok() }).catch(() => null) : null;
  if (!d || !d.profile) { if (VIEW) { $('hello').style.display = ''; $('hello').textContent = lang === 'en' ? 'Could not open this trainee (view link expired). Close and open it again.' : 'تعذر فتح الطالب (انتهى الرابط). أغلق وافتحه من جديد.'; return; }
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    $('hello').style.display = ''; $('hello').innerHTML = `<a href="${PORTAL}" style="color:#fbbf24">${tok() === null ? 'Please log in from the portal first →' : 'Session not valid, log in again →'}</a>`;
    console.warn('Thabit dashboard: no valid session', d);
    if (location.protocol !== 'file:') setTimeout(() => { location.href = PORTAL; }, 2500);
    return; }
  d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0'))); applyPrefLang(d.profile); USER_TZ = tzFromProfile(d.profile); D = d; range = 'today'; D.done = await fetchDone(); { const f = await rpc('trainee_items', { p_token: tok() }).catch(e => ({ fetchError: String(e) })); if (f && Array.isArray(f.items)) D.items = f.items; else { if (!Array.isArray(D.items)) D.items = []; console.warn('[tasks] trainee_items did not return {items:[...]}:', f); } console.info('[tasks] items:', D.items.length, 'kinds:', D.items.map(i => i.kind).join(',')); } D.notes = await fetchNotes(); D.bill = await fetchBill(); D.times = await fetchTimes(); mergeTimes(); if (!Array.isArray(D.scratches)) D.scratches = await fetchScratches(); render(); try { history.scrollRestoration = 'manual'; } catch (e) {} window.scrollTo(0, 0); setTimeout(() => window.scrollTo(0, 0), 350); setTimeout(thDiag, 900);   // always open on the first section (Tasks / Dandana) try { initFloat(); } catch (e) { console.error('[feed]', e); try { chartsGo(); } catch (x) {} }
}



async function sendReq() {
  const t = rqT(), x = RQX[lang] || RQX.en, ty = $('rqType').value, what = $('rqWhat').value.trim(), det = $('rqMsg').value.trim(), fv = $('rqFollowVal') ? $('rqFollowVal').value : '', btn = $('rqBtn');
  const err = (m, el) => { const e = $('rqErr'); e.textContent = m; e.hidden = false; const sh = $('rqsheet'); sh.classList.remove('shk'); void sh.offsetWidth; sh.classList.add('shk'); if (el && el.focus) try { el.focus(); } catch (z) {} };
  $('rqErr').hidden = true;
  if (!what) return err(t.needWhat, $('rqWhat'));
  if (!det) return err(t.needMsg, $('rqMsg'));
  if (ty !== 'other' && !fv) return err(t.need, $('rqFollowVal'));
  let tail = '';
  if (ty === 'financial') tail = `\n\n[PAYMENT DATE] ${fv}`;
  if (ty === 'session') { const d = RQT.en.durs.find(z => z[0] === fv); tail = `\n\n[EXPECTED DURATION] ${d ? d[1] : fv}`; }
  const msg = `[REQUEST] ${what}\n[DETAILS] ${det}${tail}`.slice(0, 2000);
  btn.disabled = true; btn.classList.add('busy'); btn.querySelector('span').textContent = x.sending;
  const ok = await rpc('trainee_send_request', { p_token: tok(), p_type: ty, p_message: msg }).catch(() => null);
  if (ok === true) {
    rpc('trainee_submit_report', { p_token: tok(), p_type: ty, p_title: what.slice(0, 140), p_details: det.slice(0, 1500), p_follow: fv || null }).catch(() => null);   // also saved, field by field, in the trainee_reports table (silent: the old request above keeps working either way)
    btn.classList.remove('busy'); btn.classList.add('ok'); btn.querySelector('i').className = 'fa-solid fa-check'; btn.querySelector('span').textContent = x.sent;
    setTimeout(() => {
      $('rqWhat').value = ''; $('rqMsg').value = ''; rqFollowUI(true); closeRq();
      btn.disabled = false; btn.classList.remove('ok'); btn.querySelector('i').className = 'fa-solid fa-paper-plane'; btn.querySelector('span').textContent = x.send;
    }, 1100);
    rqRefresh();
  } else {
    btn.disabled = false; btn.classList.remove('busy'); btn.querySelector('span').textContent = x.send; err(x.fail);
  }
}
window.addEventListener('DOMContentLoaded', () => {
  try { if (localStorage.getItem('thabit_theme') === 'light') { $('bodyRoot').classList.add('light-theme'); $('themeIcon').className = 'fa-solid fa-sun text-sm'; } } catch (e) {}
  let l = 'en'; try { l = localStorage.getItem('thabit_lang') || 'en'; } catch (e) {}
  setLanguage(l); load();
});

document.addEventListener('click', e => {
  const tip = $('barTip'), d = e.target.closest && e.target.closest('.dot');
  document.querySelectorAll('svg .xh').forEach(l => l.style.display = 'none');
  if (!d) { tip.classList.remove('show'); return; }
  const sv = d.closest('svg'), cx = +d.dataset.cx, cy = +d.dataset.cy, gl = +sv.dataset.l, gb = +sv.dataset.b, xv = sv.querySelector('.xv'), xz = sv.querySelector('.xz');
  if (xv && xz && isFinite(cx) && isFinite(cy)) { xv.setAttribute('x1', cx); xv.setAttribute('x2', cx); xv.setAttribute('y1', cy); xv.setAttribute('y2', gb); xz.setAttribute('x1', gl); xz.setAttribute('x2', cx); xz.setAttribute('y1', cy); xz.setAttribute('y2', cy); xv.style.display = ''; xz.style.display = ''; }
  const i = +d.dataset.i, k = d.dataset.k, b = SER.bk[i], v = SER.cum[k][i], r = b.rows[b.rows.length - 1];
  const sc = b.rows.reduce((a, x) => a + (Number(x[k]) || 0), 0);
  tip.textContent = `${b.label} · ${T[lang][k]} ${v} (+${sc})`;
  const bx = d.getBoundingClientRect(); tip.style.left = (bx.left + bx.width / 2) + 'px'; tip.style.top = (bx.top - 8) + 'px'; tip.classList.add('show');
  const w = $('why_' + k), why = k === 'performance' ? (r.why || r.performance_details) : k === 'attendance' ? (r.attendance_details || r.attendance_why) : r[k + '_details'];
  if (w) w.innerHTML = `${b.label} · +${sc} → ${v}` + (why ? `<br><span dir="auto">${esc(why)}</span>` : '');
});

/* phone accordions: tap header to open, tap anywhere else to close */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('.acc');
  document.querySelectorAll('.acc.open').forEach(x => { if (x !== a) x.classList.remove('open'); });
  if (a && e.target.closest('.acch')) a.classList.toggle('open');
});

/* ---- Next session + Dandana (all times in Cairo wall-clock) ---- */
const DAYRX = [/sun|اح?د|(^|[\s,\/])حد/i, /mon|اتنين|[إا]ثنين/i, /tue|تلات|ثلاث/i, /wed|[اأ]ربع/i, /thu|خميس/i, /fri|جمع/i, /sat|سبت/i];
const TX = () => lang === 'en' ? { nxt: 'Next session', startsIn: 'Your session starts in', rip: 'Rest in peace', dnd: 'Dandana', tom: tm => `Your session is tomorrow at ${tm}`, inD: (n, tm) => `Your session is in ${n} days at ${tm}` }
  : { nxt: 'الجلسة الجاية', startsIn: 'جلستك هتبدأ بعد', rip: 'ريست إن بيس', dnd: 'دندنة', tom: tm => `جلستك بكرة الساعة ${tm}`, inD: (n, tm) => n === 2 ? `جلستك بعد يومين الساعة ${tm}` : `جلستك بعد ${n} أيام الساعة ${tm}` };
let USER_TZ = 'Africa/Cairo';
function tzFromProfile(p) {
  const x = String((p && (p.location || p.residence_mostly)) || '').toLowerCase();
  return /سعود|ksa|saudi|riyadh|الرياض|jeddah|جدة|مكة|makkah|mecca|medina|المدينة|dammam|الدمام|khobar|الخبر/.test(x) ? 'Asia/Riyadh' : 'Africa/Cairo';
}
function cairoNow() {
  const g = {}; new Intl.DateTimeFormat('en-GB', { timeZone: USER_TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).forEach(x => g[x.type] = +x.value);
  return Date.UTC(g.year, g.month - 1, g.day, g.hour, g.minute, g.second);
}
function schedule() {
  const p = D.profile || {}, rows = D.rows, txt = [p.days_a_week, p.session_time].join(' ');
  let days = DAYRX.map((r, i) => r.test(txt) ? i : -1).filter(i => i >= 0);
  if (!days.length) days = [...new Set(rows.slice(-8).map(r => new Date(r.supply_date + 'T00:00:00Z').getUTCDay()))];
  let h = null, m = 0; const mt = String(p.session_time || '').match(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|ص|م)?/i);
  if (mt) { h = +mt[1]; m = +(mt[2] || 0); const x = (mt[3] || '').toLowerCase(); if ((x === 'pm' || x === 'م') && h < 12) h += 12; else if ((x === 'am' || x === 'ص') && h === 12) h = 0; else if (!x && h >= 1 && h <= 8) h += 12; if (h > 23) h = null; }
  if (h == null) { const L = [...rows].reverse().find(r => r.start_time); if (L) { h = +L.start_time.slice(0, 2); m = +L.start_time.slice(3, 5); } }
  return h == null || !days.length ? null : { days, h, m };
}
function nextAfter(sc, from) {
  const d0 = new Date(from); d0.setUTCHours(0, 0, 0, 0);
  for (let i = 0; i < 20; i++) { const d = new Date(d0.getTime() + i * 864e5); if (!sc.days.includes(d.getUTCDay()) || inMonthBreak(d.getTime())) continue; const t = d.getTime() + (sc.h * 60 + sc.m) * 6e4; if (t > from) return t; }
  return null;
}
function nxState() {
  const sc = schedule(); if (!sc) return null;
  const now = cairoNow(), t0 = Math.floor(now / 864e5) * 864e5, isDay = sc.days.includes(new Date(now).getUTCDay()) && !inMonthBreak(now), nxt = nextAfter(sc, now);
  return { sc, nxt, st: isDay ? (now < t0 + (sc.h * 60 + sc.m) * 6e4 ? 'count' : 'started') : 'off', n: nxt ? Math.round((Math.floor(nxt / 864e5) * 864e5 - t0) / 864e5) : 0 };
}
function dndState() {
  const di = (D.items || []).filter(i => i.kind === 'dandana');
  if (di.length) { const last = di.reduce((m, i) => i.date > m ? i.date : m, '');
    const sc0 = schedule();   // dandana lives from its session until the NEXT session starts, then it goes away (a newer upload replaces it earlier)
    if (sc0) { const n0 = nextAfter(sc0, Date.parse(last + 'T00:00:00Z') + 864e5); if (n0 && cairoNow() >= n0) return null; }
    else if (cairoNow() - Date.parse(last + 'T00:00:00Z') > 7 * 864e5) return null;
    return { r: { supply_date: last }, items: di.filter(i => i.date === last).sort((a, b) => a.no - b.no).map(i => [i.title, i.badge].filter(Boolean).join(' - ')) }; }
  const rows = D.rows.filter(r => r.dandana && String(r.dandana).trim()); if (!rows.length) return null;
  const r = rows[rows.length - 1], sc = schedule();
  if (sc) { const n = nextAfter(sc, Date.parse(r.supply_date + 'T00:00:00Z') + 864e5); if (n && cairoNow() >= n) return null; }
  return { r, items: String(r.dandana).split(/[\/\n]+/).map(x => x.trim()).filter(Boolean) };
}
const fmtT = sc => `${(sc.h % 12) || 12}:${String(sc.m).padStart(2, '0')} ${sc.h < 12 ? 'AM' : 'PM'}`;
/* ===== Session time shown in the trainee's own country time =====
   The admin always writes the session time in Cairo time. The trainee's basic_info.location decides which clock he sees
   (case-insensitive, Arabic or English, spelling does not have to be exact). No match / empty = Cairo.
   Summer / winter time is read from the real time-zone rules for that exact date, nothing to maintain. */
const TZ_CAIRO = 'Africa/Cairo';
const TZ_LIST = [
  { rx: /مصر|egypt|cairo|القاهر|الاسكندر|اسكندر|alexandria|giza|الجيز/, tz: TZ_CAIRO, n: { en: 'Cairo time', ar: 'بتوقيت القاهرة', eg: 'بتوقيت القاهرة' } },
  { rx: /سعود|saudi|\bksa\b|riyadh|رياض|jeddah|جده|mecca|makkah|مكه|medina|madinah|المدينه المنوره|dammam|دمام|khobar|الخبر|tabuk|تبوك|abha|ابها/, tz: 'Asia/Riyadh', n: { en: 'Mecca time', ar: 'بتوقيت مكة المكرمة', eg: 'بتوقيت مكة المكرمة' } },
  { rx: /امارات|emirates|\buae\b|dubai|دبي|abu ?dhabi|ابو ?ظبي|sharjah|شارقه|ajman|عجمان/, tz: 'Asia/Dubai', n: { en: 'UAE time', ar: 'بتوقيت الإمارات', eg: 'بتوقيت الإمارات' } },
  { rx: /كويت|kuwait/, tz: 'Asia/Kuwait', n: { en: 'Kuwait time', ar: 'بتوقيت الكويت', eg: 'بتوقيت الكويت' } },
  { rx: /قطر|qatar|doha|الدوحه/, tz: 'Asia/Qatar', n: { en: 'Qatar time', ar: 'بتوقيت قطر', eg: 'بتوقيت قطر' } },
  { rx: /بحرين|bahrain|manama|المنامه/, tz: 'Asia/Bahrain', n: { en: 'Bahrain time', ar: 'بتوقيت البحرين', eg: 'بتوقيت البحرين' } },
  { rx: /\boman\b|muscat|مسقط|سلطنه عمان/, tz: 'Asia/Muscat', n: { en: 'Oman time', ar: 'بتوقيت عُمان', eg: 'بتوقيت عُمان' } },
  { rx: /اردن|jordan|amman/, tz: 'Asia/Amman', n: { en: 'Jordan time', ar: 'بتوقيت الأردن', eg: 'بتوقيت الأردن' } },
  { rx: /عراق|iraq|baghdad|بغداد/, tz: 'Asia/Baghdad', n: { en: 'Iraq time', ar: 'بتوقيت العراق', eg: 'بتوقيت العراق' } },
  { rx: /ليبيا|libya|tripoli|طرابلس/, tz: 'Africa/Tripoli', n: { en: 'Libya time', ar: 'بتوقيت ليبيا', eg: 'بتوقيت ليبيا' } },
  { rx: /تركيا|turkey|turkiye|istanbul|اسطنبول/, tz: 'Europe/Istanbul', n: { en: 'Turkey time', ar: 'بتوقيت تركيا', eg: 'بتوقيت تركيا' } },
  { rx: /بريطانيا|انجلترا|\buk\b|united kingdom|england|britain|london|لندن/, tz: 'Europe/London', n: { en: 'UK time', ar: 'بتوقيت بريطانيا', eg: 'بتوقيت بريطانيا' } },
  { rx: /المانيا|germany|berlin|برلين/, tz: 'Europe/Berlin', n: { en: 'Germany time', ar: 'بتوقيت ألمانيا', eg: 'بتوقيت ألمانيا' } }
];
const TZ_DST = { en: ['summer time', 'winter time'], ar: ['توقيت صيفي', 'توقيت شتوي'], eg: ['توقيت صيفي', 'توقيت شتوي'] };
const tzNorm = v => String(v == null ? '' : v).toLowerCase().replace(/[ً-ٟـ]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
function traineeZone() {
  const p = (D && D.profile) || {}, x = tzNorm(p.location);
  return (x && TZ_LIST.find(z => z.rx.test(x))) || TZ_LIST[0];
}
const TZ_FMT = {};
function zoneWall(ms, tz) {   // real instant -> that zone's wall clock, encoded like cairoNow() (UTC fields = wall fields)
  const f = TZ_FMT[tz] || (TZ_FMT[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' })), g = {};
  f.formatToParts(new Date(ms)).forEach(x => g[x.type] = +x.value);
  return Date.UTC(g.year, g.month - 1, g.day, g.hour, g.minute, g.second);
}
const zoneOff = (ms, tz) => zoneWall(ms, tz) - Math.floor(ms / 1000) * 1000;
function localSession(nxtWall) {   // nxtWall = the session start as a Cairo wall-clock timestamp -> {h, m, label, days}
  const z = traineeZone(), lang3 = TZ_LIST.length && (z.n[lang] ? lang : 'en');
  let T = nxtWall - zoneOff(nxtWall - 72e5, TZ_CAIRO); T = nxtWall - zoneOff(T, TZ_CAIRO);   // the real instant of that Cairo time
  const w = new Date(zoneWall(T, z.tz)), y = new Date(T).getUTCFullYear();
  const oj = zoneOff(Date.UTC(y, 0, 15), z.tz), ol = zoneOff(Date.UTC(y, 6, 15), z.tz), o = zoneOff(T, z.tz);
  let label = z.n[lang3];
  if (oj !== ol) label += ` (${TZ_DST[lang3][o === Math.max(oj, ol) ? 0 : 1]})`;
  const nowL = zoneWall(Date.now(), z.tz);
  return { h: w.getUTCHours(), m: w.getUTCMinutes(), label, days: Math.round((Math.floor(w.getTime() / 864e5) - Math.floor(nowL / 864e5))) };
}
function tzNowLabel() {   // the trainee's own time zone, with summer / winter time where that country has it
  const z = traineeZone(), l = z.n[lang] ? lang : 'en', now = Date.now(), y = new Date(now).getUTCFullYear();
  const oj = zoneOff(Date.UTC(y, 0, 15), z.tz), ol = zoneOff(Date.UTC(y, 6, 15), z.tz), o = zoneOff(now, z.tz);
  return z.n[l] + (oj !== ol ? ` (${TZ_DST[l][o === Math.max(oj, ol) ? 0 : 1]})` : '');
}
/* "My info" card is folded: tap its title to open / close (state is kept while the page re-renders) */
function infoFold() {
  const h = $('tInfo'), b = $('info'); if (!h || !b) return;
  if (!h.dataset.fold) { h.dataset.fold = '1'; b.hidden = true; h.setAttribute('role', 'button'); h.tabIndex = 0;
    const tg = () => { b.hidden = !b.hidden; h.classList.toggle('open', !b.hidden); };
    h.addEventListener('click', tg); h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } }); }
}
const fmtHM = (h, m) => `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
/* small hand-drawn clock for the Next-session card: the hands point to the session time */
function clockSvg(h, m) {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  return `<svg class="nxclk" viewBox="0 0 56 56" width="52" height="52" aria-hidden="true">`
    + `<circle cx="28" cy="28" r="25" fill="none" stroke="#fbbf24" stroke-width="3"/>`
    + `<g stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".75"><path d="M28 7.5v3.2M28 45.3v3.2M7.5 28h3.2M45.3 28h3.2"/></g>`
    + `<g class="hh" style="--a:${ha.toFixed(1)}deg"><line x1="28" y1="28" x2="28" y2="16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g>`
    + `<g class="hh" style="--a:${ma}deg"><line x1="28" y1="28" x2="28" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>`
    + `<circle cx="28" cy="28" r="2.4" fill="currentColor"/></svg>`;
}
function nextCard(s) {
  let tm = fmtT(s.sc), lbl = '', n = s.n, ch = s.sc.h, cm = s.sc.m;
  try { if (s.nxt) { const L = localSession(s.nxt); tm = fmtHM(L.h, L.m); lbl = L.label; ch = L.h; cm = L.m; if (L.days >= 1) n = L.days; } } catch (e) { console.warn('[next session tz]', e); }
  const wrapClk = inner => `<div class="nxrow"><div class="nxc">${clockSvg(ch, cm)}</div><div class="nxtx" dir="${lang === 'en' ? 'ltr' : 'rtl'}">${inner}</div></div>`;
  const t = TX(), when = n === 1 ? t.tom(tm) : t.inD(n, tm), zl = lbl ? `<div class="sm" dir="auto">${esc(lbl)}</div>` : '';
  if (s.st === 'count') return { id: 'nxt', noX: true, isNew: false, html: wrapClk(`<h3>${t.nxt}</h3><div>${t.startsIn}</div><div class="cdn cd" data-t="${s.nxt}">--:--:--</div><div class="sm" dir="auto">${esc(tm)}${lbl ? ' · ' + esc(lbl) : ''}</div>`) };
  return { id: 'nxt', noX: true, isNew: false, cls: s.st === 'off' ? 'rest' : '', html: wrapClk(`<h3>${t.nxt}</h3>${s.st === 'off' ? `<div class="cdn">${t.rip}</div>` : ''}<div>${when}</div>${zl}`) };
}
const dndSeenKey = 'thabit_dnd_seen';
const dndNew = d => { try { return localStorage.getItem(dndSeenKey) !== d.r.supply_date; } catch (e) { return false; } };
const dndCard = d => ({ id: 'dnd', isNew: dndNew(d), html: `<h3>${TX().dnd}</h3><div dir="auto">${d.items.map(x => `<div class="dnr"><span class="chip">${esc(x)}</span>${cpBtn(x)}</div>`).join('')}</div><div class="sm" style="margin-top:8px">${d.r.supply_date}</div>` });
function openPop(cards, from) {
  const o = $('pop'); o.innerHTML = '<div class="pcs">' + cards.filter(Boolean).map(c => `<div class="pc ${c.cls || ''}" data-cid="${c.id || ''}">${c.noX ? '' : '<button type="button" class="x">×</button>'}${c.html}</div>`).join('') + '</div>'; o.classList.add('open');
  peekWords(o);
  o.querySelectorAll('.pc').forEach(pc => pc.addEventListener('click', e => {   // clicks inside a card never close the feed; X closes only its own card
    const x = e.target.closest && e.target.closest('.x');
    if (x) { e.preventDefault(); dismissCard(pc.dataset.cid); pc.remove(); if (!o.querySelector('.pc')) closePop(); }
    else if (pc.classList.contains('nf')) {   // notification card: tap opens the details, "Understood" closes it for good
      if (e.target.closest('.ackb')) { e.preventDefault(); thn_ackCard(pc); }
      else if (!pc.classList.contains('acked') && (!pc.classList.contains('open') || e.target.closest('.nfh'))) thn_toggleNf(pc);
    }
    e.stopPropagation();
  }));
  if (from) { const b = from.getBoundingClientRect(); o.querySelectorAll('.pc').forEach(c => { const r = c.getBoundingClientRect(); c.style.setProperty('--dx', (b.left + b.width / 2 - r.left - r.width / 2) + 'px'); c.style.setProperty('--dy', (b.top + b.height / 2 - r.top - r.height / 2) + 'px'); }); }
}
const THN_MAX = 8;
function thn_older() {
  const o = $('pop'), box = o && o.querySelector('.pcs'); if (!box) return;
  const nf = [...box.querySelectorAll('.pc.nf')]; if (nf.length <= THN_MAX) return;
  const rest = nf.slice(THN_MAX); rest.forEach(c => { c.hidden = true; });
  const b = document.createElement('button'); b.type = 'button'; b.className = 'seeold';
  b.textContent = ({ en: 'See previous notifications', ar: 'عرض الإشعارات السابقة', eg: 'شوف الإشعارات السابقة' })[lang] || 'See previous notifications';
  b.onclick = e => { e.stopPropagation(); rest.forEach(c => { c.hidden = false; }); b.remove(); };
  box.appendChild(b);
}
const thn_openPop0 = openPop;
openPop = function (cards, from) { thn_openPop0(cards, from); try { thn_older(); } catch (e) { console.warn('[feed older]', e); } };
const closePop = () => { $('pop').classList.remove('open'); $('pop').innerHTML = ''; INTRO.hold = false; if (typeof D !== 'undefined' && D) updateFeed(); };
/* ===== Feed: next session + dandana + notifications + payment, all inside ONE button ===== */
const NTX = {
  en: { feed: 'Feed', notes: 'Notifications', msg: 'Message from your trainer', word: w => `Your word “${w}” is ready. You can listen to it now.`, reply: 'The trainer replied to your request', billT: 'Payment', cur: 'EGP',
        past: (p, t, s, due) => `A gentle reminder that there is an amount of <b>${p}</b> EGP from last month, which makes the total due <b>${t}</b> EGP. Please make sure to pay this amount before <b>${due}</b>.`,
        tot: (s, due) => `A gentle reminder that this month's subscription is <b>${s}</b> EGP. Please make sure to pay it before <b>${due}</b>.`,
        left: n => n <= 0 ? 'Today is the last day' : n === 1 ? 'Only 1 day left' : n + ' days left' },
  ar: { feed: 'فيد', notes: 'الإشعارات', msg: 'رسالة من المدرب', word: w => `كلمتك «${w}» جاهزة، تقدر تسمعها الآن.`, reply: 'رد المدرب على طلبك', billT: 'المدفوعات', cur: 'جنيه',
        past: (p, t, s, due) => `تذكير لطيف بأن هناك مبلغًا من الشهر السابق بقيمة <b>${p}</b> جنيه، وهذا يجعل الإجمالي المطلوب <b>${t}</b> جنيه. رجاءً تأكد من دفع هذا المبلغ المستحق قبل يوم <b>${due}</b>.`,
        tot: (s, due) => `تذكير لطيف بأن مبلغ اشتراك هذا الشهر <b>${s}</b> جنيه. رجاءً تأكد من دفعه قبل يوم <b>${due}</b>.`,
        left: n => n <= 0 ? 'اليوم هو آخر يوم' : n === 1 ? 'باقي يوم واحد' : n === 2 ? 'باقي يومان' : 'باقي ' + n + ' أيام' },
  eg: { feed: 'فيد', notes: 'الإشعارات', msg: 'رسالة من المدرب', word: w => `كلمتك «${w}» جاهزة، تقدر تسمعها دلوقتي.`, reply: 'المدرب رد على طلبك', billT: 'المدفوعات', cur: 'جنيه',
        past: (p, t, s, due) => `تذكير لطيف إن فيه مبلغ من الشهر اللي فات بقيمة <b>${p}</b> جنيه، وده بيخلي الإجمالي المطلوب <b>${t}</b> جنيه. ياريت تتأكد إنك تدفع المبلغ المستحق ده قبل يوم <b>${due}</b>.`,
        tot: (s, due) => `تذكير لطيف إن اشتراك الشهر ده <b>${s}</b> جنيه. ياريت تتأكد إنك تدفعه قبل يوم <b>${due}</b>.`,
        left: n => n <= 0 ? 'النهاردة آخر يوم' : n === 1 ? 'باقي يوم واحد' : n === 2 ? 'باقي يومين' : 'باقي ' + n + ' أيام' }
};
const NT = () => NTX[lang] || NTX.en;
const fetchNotes = () => rpc('trainee_notifications', { p_token: tok() }).then(a => { if (!Array.isArray(a)) console.warn('[feed] trainee_notifications failed:', a); return Array.isArray(a) ? a : []; }).catch(e => { console.warn('[feed] trainee_notifications error:', e); return []; });
const fetchBill = () => rpc('trainee_billing', { p_token: tok() }).then(b => b && typeof b === 'object' && !Array.isArray(b) && !b.message && !b.code ? b : null).catch(() => null);
function billState() {
  const b = D && D.bill; if (!b) return null;
  { const c = new Date(cairoNow()); if (b.paid_month && b.paid_month === `${c.getUTCFullYear()}-${String(c.getUTCMonth() + 1).padStart(2, '0')}`) return null; }   // marked paid this month by the admin: no payment reminder (resets next month)
  const num = v => { const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0; };
  const sub = num(b.subscription), past = num(b.past_due); if (!sub && !past) return null;
  const n = new Date(cairoNow()), day = n.getUTCDate(), last = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 0)).getUTCDate();
  const win = day > last - 5 || day <= 7;                  // last 5 days of the month, until the 7th
  if (!win) return null;                                   // after the 7th nothing is sent (even with an old balance)
  const y = n.getUTCFullYear(), mo = n.getUTCMonth(), prevLast = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const start = day > 7 ? Date.UTC(y, mo, last - 4) : Date.UTC(y, mo - 1, prevLast - 4);   // first day of the window
  if (Math.round((Date.UTC(y, mo, day) - start) / 864e5) % 2) return null;               // every 2 days
  if (thn_isAcked('bill:' + itToday())) return null;           // pressed "Understood" today: not again today
  return { sub, past, total: sub + past, win, early: day <= 7 };
}
function billDue() {   // the next 7th, as d/m/yyyy (7/11/2026)
  const n = new Date(cairoNow()); let y = n.getUTCFullYear(), m = n.getUTCMonth() + 1;
  if (n.getUTCDate() > 7) { m++; if (m > 12) { m = 1; y++; } }
  return `7/${m}/${y}`;
}
function billLeft() {   // days until the next 7th
  const n = new Date(cairoNow()), m = n.getUTCMonth() + (n.getUTCDate() > 7 ? 1 : 0);
  return Math.round((Date.UTC(n.getUTCFullYear(), m, 7) - Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate())) / 864e5);
}
/* ===== Notification cards: collapsed (type only) -> tap = details + "Understood" -> check mark, thanks, gone.
   Counted in the Feed button: the trainer's notifications + the automatic payment reminder. Nothing else. ===== */
const thn_NCX = {
  en: { money: 'Finance', system: 'Dashboard', note: 'Notification', update: 'Update', alert: 'Important', reply: 'Reply', tap: 'Tap to read', ok: 'Understood', thanks: 'Thank you' },
  ar: { money: 'مالي', system: 'لوحة البيانات', note: 'إشعار', update: 'تحديث', alert: 'مهم', reply: 'رد', tap: 'اضغط للقراءة', ok: 'فهمت', thanks: 'شكراً لك' },
  eg: { money: 'مالي', system: 'لوحة البيانات', note: 'إشعار', update: 'تحديث', alert: 'مهم', reply: 'رد', tap: 'دوس واقرا', ok: 'فهمت', thanks: 'شكراً ليك' }
};
const thn_NCT = () => thn_NCX[lang] || thn_NCX.en;
const thn_ACKK = 'thabit_ack', thn_OPNK = 'thabit_nopen'; let thn_ACKS = {};
try { thn_ACKS = JSON.parse(localStorage.getItem(thn_ACKK) || '{}') || {}; } catch (e) { thn_ACKS = {}; }
const thn_isAcked = k => k in thn_ACKS;
function thn_ackSet(k) {
  thn_ACKS[k] = Date.now(); const cut = Date.now() - 40 * 864e5; Object.keys(thn_ACKS).forEach(x => { if (thn_ACKS[x] < cut) delete thn_ACKS[x]; });
  if (!VIEW) try { localStorage.setItem(thn_ACKK, JSON.stringify(thn_ACKS)); } catch (e) {}
}
function thn_openedSet(k) {   // remembers that the details were opened (first time only), on this device
  if (VIEW) return; try { const o = JSON.parse(localStorage.getItem(thn_OPNK) || '{}') || {}; if (!o[k]) { o[k] = Date.now(); localStorage.setItem(thn_OPNK, JSON.stringify(o)); } } catch (e) {}
}
const thn_nKey = n => n.id != null ? 'n' + n.id : n.kind + '|' + n.created_at;
function noteText(n) {
  const t = NT(), m = n.meta || {};
  if (n.kind === 'request_reply') return { h: esc(t.reply), b: m.reply ? rich(m.reply) : '' };
  return { h: esc(n.title || t.msg), b: rich(n.body || '') };
}
/* one icon per notification category: general = bell, financial = wallet, system = gear, app update = arrow, policy / restriction = warning, reply to a request = chat bubble.
   Category comes from notification.meta.category (money | system | update | alert | reply | note) or, if absent, from its kind. */
const THN_ICON = { money: 'fa-wallet', system: 'fa-gear', note: 'fa-bell', update: 'fa-circle-arrow-up', alert: 'fa-triangle-exclamation', reply: 'fa-comment-dots' };
function noteCat(n) {
  const m = (n && n.meta) || {}, c = String(m.category || m.cat || '').toLowerCase(), k = String((n && n.kind) || '').toLowerCase();
  if (THN_ICON[c]) return c;
  if (/pay|bill|money|financ|fee|subscri|discount|promo|offer|coupon|voucher|refund|invoice|price|cost|wallet|cash|credit|debt|balance|due|salary|scholar/.test(k) || /خصم|تخفيض|فلوس|دفع|سداد|مدفوع|مصاريف|مصروف|اشتراك|فاتور|مبلغ|رسوم|استرداد|مستحق|منح|عرض خاص|discount|payment|refund|invoice|\bfee|\begp\b/i.test(String((n && n.title) || ''))) return 'money';
  if (k === 'request_reply') return 'reply';
  if (/policy|restrict/.test(k)) return 'alert';
  if (/update/.test(k)) return 'update';
  if (/system|maint/.test(k)) return 'system';
  return 'note';
}
function thn_nCard(key, cat, headHtml, bodyHtml, dt, read) {
  const c = thn_NCT(), rd = read == null ? (key in thn_opened()) : !!read;
  const snip = (() => { const d = document.createElement('div'); d.innerHTML = bodyHtml || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140); })();
  return { id: 'n:' + key, noX: true, cnt: !rd, isNew: !rd, cls: 'nf ' + cat + (rd ? ' read' : ' unread'),
    html: `<div class="nfh" role="button" tabindex="0"><span class="nfi ${cat}"><i class="fa-solid ${THN_ICON[cat] || 'fa-bell'}"></i></span><div class="nfm"><div class="nfc" dir="auto">${headHtml || c[cat]}</div><div class="nft2" dir="auto">${esc(snip)}</div></div><span class="nfd">${esc(dt)}</span><i class="fa-solid fa-chevron-down nfv"></i></div>`
      + `<div class="nfb" hidden><div class="rich" dir="auto">${bodyHtml}</div></div>` };
}
function thn_toggleNf(pc) {
  if (!pc.classList.contains('open')) document.querySelectorAll('#pop .pc.nf.open:not(.acked)').forEach(o => { if (o !== pc) { o.classList.remove('open'); const b = o.querySelector('.nfb'); if (b) b.hidden = true; } });   // one at a time: opening a notification folds the others
  const on = !pc.classList.contains('open'); pc.classList.toggle('open', on); pc.querySelector('.nfb').hidden = !on;
  if (on) { thn_openedSet(pc.dataset.cid.slice(2)); pc.classList.remove('unread'); pc.classList.add('read'); if (typeof updateFeed === 'function') updateFeed(); }
}
function thn_ackCard(pc) {
  const o = $('pop'); thn_ackSet(pc.dataset.cid.slice(2)); pc.classList.add('acked');
  pc.innerHTML = `<div class="ackdone"><i class="fa-solid fa-circle-check"></i><div>${thn_NCT().thanks}</div></div>`;
  setTimeout(() => { pc.classList.add('out'); setTimeout(() => { pc.remove(); updateFeed(); if (!o.querySelector('.pc')) closePop(); }, 350); }, 1100);
}
function billCard(s) {
  const t = NT(), fmt = v => String(v), due = billDue(), left = billLeft();
  const body = `<div class="billb" dir="auto">${s.past > 0 ? t.past(fmt(s.past), fmt(s.total), fmt(s.sub), due) : t.tot(fmt(s.sub), due)}</div>`
    + (left <= 2 ? `<div class="billl" dir="auto"><i class="fa-regular fa-clock"></i> ${t.left(left)}</div>` : '');
  return thn_nCard('bill:' + itToday(), 'money', t.billT, body, itToday());
}
/* the trainer's notifications: not read, not "Understood" on this device, and younger than 24 hours */
const thn_opened = () => { try { return JSON.parse(localStorage.getItem(thn_OPNK) || '{}') || {}; } catch (e) { return {}; } };
const thn_isRead = n => !!n.read_at || thn_isAcked(thn_nKey(n)) || (thn_nKey(n) in thn_opened());
function thn_noteList() {
  const now = Date.now();
  return (((D && D.notes) || []).concat(window.thLocalNotes ? thLocalNotes() : [])).filter(n => !WORD_KINDS.includes(n.kind))
    .slice().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}
function thn_noteCardN(n) {
  const loc = lang === 'en' ? 'en-GB' : 'ar-EG', x = noteText(n); let dt = '';
  try { dt = new Date(n.created_at).toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) {}
  return thn_nCard(thn_nKey(n), noteCat(n), x.h, x.b, dt, thn_isRead(n));
}
(function () { const st = document.createElement('style'); st.textContent = `
.thabit-card #tInfo{cursor:pointer;display:flex;align-items:center;justify-content:space-between;margin:0;-webkit-user-select:none;user-select:none}
#tInfo::after{content:"";width:8px;height:8px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);transition:transform .2s;opacity:.7;flex:none}
#tInfo.open::after{transform:rotate(-135deg)}
#info{margin-top:10px}
.lgi .pfi{font-size:23px;line-height:1}
.pc .nxrow{display:flex;align-items:center;gap:16px;direction:ltr}
.pc .nxc{flex:none;display:flex;align-items:center;justify-content:center}
.pc .nxtx{flex:1;min-width:0}
.pc .nxtx h3{margin-top:0}
.nxclk{display:block}
.nxclk .hh{transform-box:view-box;transform-origin:28px 28px;transform:rotate(var(--a,0deg));animation:nxSpin 1.2s cubic-bezier(.3,.7,.25,1) 1}
@keyframes nxSpin{from{transform:rotate(calc(var(--a,0deg) - 360deg))}}
@media(prefers-reduced-motion:reduce){.nxclk .hh{animation:none}}
.pc.nf .nfv{font-size:.7rem;opacity:.6;transition:transform .2s}.pc.nf.open .nfv{transform:rotate(180deg);margin-inline-start:auto}
/* feed look: frosted-glass cards, like phone notifications */
#pop .pcs{gap:10px}
#pop .pc{background:rgba(30,41,59,.5)!important;-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5);border:1px solid rgba(255,255,255,.14)!important;border-radius:22px!important;box-shadow:0 8px 24px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08)!important}
body.light-theme #pop .pc{background:rgba(255,255,255,.6)!important;border-color:rgba(255,255,255,.75)!important;box-shadow:0 8px 24px rgba(15,23,42,.14),inset 0 1px 0 rgba(255,255,255,.9)!important}
.pc.nf{padding:12px 14px}
.pc.nf .nfh{display:flex;align-items:center;gap:11px;cursor:pointer}
.pc.nf .nfi{flex:none;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.95rem;color:#fff;background:linear-gradient(145deg,#94a3b8,#64748b);box-shadow:0 2px 6px rgba(0,0,0,.25)}
.pc.nf .nfi.money{background:linear-gradient(145deg,#fbbf24,#f59e0b)}
.pc.nf .nfi.system{background:linear-gradient(145deg,#94a3b8,#475569)}
.pc.nf .nfi.update{background:linear-gradient(145deg,#a78bfa,#7c3aed)}
.pc.nf .nfi.alert{background:linear-gradient(145deg,#fb7185,#e11d48)}
.pc.nf .nfi.reply{background:linear-gradient(145deg,#34d399,#059669)}
.pc.nf .nfi.note{background:linear-gradient(145deg,#60a5fa,#3b82f6)}
.pc.nf .nfm{flex:1;min-width:0}
.pc.nf .nfc{font-weight:700;font-size:.9rem;line-height:1.2}
.pc.nf .nft2{font-size:.74rem;opacity:.6;margin-top:1px}
.pc.nf.open .nft2{display:none}
.pc.nf .nfd{font-size:.7rem;opacity:.6;white-space:nowrap}
.pc.nf .nfb{margin-top:10px}.pc.nf .ackb{margin-top:12px;width:100%}
.pc.nf .nth{font-weight:700;margin-bottom:6px}
.pc.nf.acked{text-align:center;transition:opacity .35s,transform .35s}
.pc.nf.out{opacity:0;transform:scale(.96)}
.ackdone{padding:14px 0}.ackdone i{font-size:2.2rem;color:#34d399;animation:ackPop .5s cubic-bezier(.2,.8,.3,1.2)}.ackdone div{margin-top:8px;font-weight:700}
@keyframes ackPop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}`; document.head.appendChild(st); })();
const cairoDay = iso => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date(iso)); } catch (e) { return ''; } };
const WORD_KINDS = ['assistant_words', 'word_ready'];

/* Order: Next session first, then the cards with something new, then the rest. Each card = ONE notification (badge counts cards, not messages). */
function feedCards() {
  const s = nxState(), bs = billState();
  const nts = thn_noteList().map(thn_noteCardN);
  if (bs) nts.unshift(billCard(bs));
  return [...nts].sort((a, b) => (b.cnt ? 1 : 0) - (a.cnt ? 1 : 0));   /* unread on top, read below (stable: newest first inside each group) */   // the next session now lives in the Days page (thDays), not here   // the feed holds ONLY the next session + notifications (Dandana / Assistant words are not here); only notification cards (cnt) are counted
}
/* The X on a card = "I read it": only then it stops counting. Closing the pop-up by tapping outside does NOT mark anything as read.
   Next session + Assistant words have no X, so they always count. */
function dismissCard(id) {
  if (VIEW || !id) return;
  try {
    if (id === 'bill') localStorage.setItem('thabit_bill_read', itToday());
    if (id === 'dnd') { const d = dndState(); if (d) localStorage.setItem(dndSeenKey, d.r.supply_date); }
  } catch (e) {}
  if (id === 'notes' && ((D && D.notes) || []).some(n => !n.read_at)) { D.notes.forEach(n => { if (!n.read_at) n.read_at = new Date().toISOString(); }); rpc('trainee_notifications_read', { p_token: tok() }).catch(() => {}); }
  updateFeed();
}
const INTRO = { hold: false, run: false };
const INTRO_KEY = 'thabit_intro_tok';
const introDone = () => { try { return !VIEW && !!tok() && localStorage.getItem(INTRO_KEY) === tok(); } catch (e) { return false; } };
const feedCount = () => feedCards().filter(c => c.cnt).length;


function updateFeed() {
  const btn = $('feedBtn'), cards = feedCards(), n = cards.filter(c => c.cnt).length, bd = $('feedBadge'), fn = $('feedNum');
  btn.hidden = !cards.length; btn.setAttribute('aria-label', NT().feed);
  if (btn.dataset.bk && btn._hid !== btn.hidden) { btn._hid = btn.hidden; if (typeof layoutBar === 'function') layoutBar(); }
  bd.hidden = true; bd.textContent = n;
  if (fn) {
    const txt = n > 99 ? '99+' : String(n || '');
    if (n && fn.textContent !== txt) {
      fn.textContent = txt; fn.classList.toggle('l2', txt.length > 1);
      fn.classList.remove('bump'); void fn.offsetWidth; fn.classList.add('bump');
    }
    // plus -> number only after the intro finished and the pop-up was closed
    btn.classList.toggle('num', n > 0 && !INTRO.hold && btn.classList.contains('done'));
  }
  if (cards.length && btn.classList.contains('empty') && window._popDone && !INTRO.run) runIntro(btn);
}

function openFeed(from) {
  const c = feedCards(); if (!c.length) return;
  openPop(c, from);
}
/* Important = app updates, policy updates, restrictions (kind), or any notification with meta.important = true. Only these may pop up by themselves, once each. */
const IMP_KINDS = ['update', 'app_update', 'policy', 'policy_update', 'restriction', 'restrictions'];
const IMP_SEEN = new Set();
const isImp = n => !!n && (IMP_KINDS.includes(n.kind) || !!(n.meta && n.meta.important));
const impKey = n => String(n.id != null ? n.id : n.created_at);
const impUnread = () => thn_noteList().filter(n => isImp(n) && !thn_isRead(n) && !IMP_SEEN.has(impKey(n)));
const impMark = () => impUnread().forEach(n => IMP_SEEN.add(impKey(n)));
/* gentle attention instead of a pop-up: the Feed button glows; for important updates the plus also turns */
function attention(spin) {
  glowFeed();
  if (spin) { const b = $('feedBtn'); b.classList.remove('upd'); void b.offsetWidth; b.classList.add('upd'); setTimeout(() => b.classList.remove('upd'), 4800); }
}
function glowFeed() { const b = $('feedBtn'); b.classList.remove('glow'); void b.offsetWidth; b.classList.add('glow'); setTimeout(() => b.classList.remove('glow'), 4200); }
/* Intro: white empty ring -> plus drawn (horizontal, then vertical) in white -> pop + moving colours -> feed pop-up -> badge after it closes */
function runIntro(btn) {
  try { runIntro2(btn); } catch (e) { console.error('[feed intro]', e); INTRO.hold = false; try { btn.classList.remove('empty'); btn.classList.add('done'); updateFeed(); } catch (x) {} chartsGo(); }
}
function runIntro2(btn) {
  INTRO.run = true; INTRO.hold = true; CINTRO.wait = true; $('feedBadge').hidden = true;
  btn.classList.remove('empty'); btn.classList.add('draw');
  setTimeout(() => btn.classList.add('done', 'pop'), 760);
  setTimeout(() => {
    try { if (!VIEW && tok()) localStorage.setItem(INTRO_KEY, tok()); } catch (e) {}
    const c = feedCards(); CINTRO.popShown = true;
    if (c.length && impUnread().length) { impMark(); openPop(c, btn); }       // only important updates pop up by themselves
    else { INTRO.hold = false; updateFeed(); chartsGo(); if (c.some(x => x.noX || x.isNew)) attention(false); }
  }, 1150);
}
function refreshNotes() {
  if (!D || INTRO.hold) return Promise.resolve();
  const before = feedCount();
  return fetchNotes().then(list => {
    D.notes = list; updateFeed();
    if (impUnread().length && !$('pop').classList.contains('open')) { impMark(); openPop(feedCards(), $('feedBtn')); }
    else if (feedCount() > before) attention(((D && D.notes) || []).some(n => isImp(n) && !n.read_at));
  });
}
function initFloat() {
  const btn = $('feedBtn');
  if (!window._popDone) {
    window._popDone = true;
    if (!feedCards().length) { btn.hidden = true; setTimeout(chartsGo, 300); }
    else if (introDone()) { btn.classList.remove('empty'); btn.classList.add('done'); updateFeed(); setTimeout(chartsGo, 300); }   // refresh: no animation, no pop-up
    else runIntro(btn);
  } else updateFeed();
  if (!window._ntPoll) {
    window._ntPoll = setInterval(refreshNotes, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshNotes(); });
  }
}
window.addEventListener('DOMContentLoaded', () => {
  $('feedBtn').onclick = e => { e.stopPropagation(); openFeed($('feedBtn')); };
  setInterval(() => { const n = cairoNow(); document.querySelectorAll('.cd[data-t]').forEach(e => { const x = Math.max(0, Math.floor((+e.dataset.t - n) / 1000)); e.textContent = [Math.floor(x / 3600), Math.floor(x % 3600 / 60), x % 60].map(v => String(v).padStart(2, '0')).join(':'); }); }, 1000);
});

/* ===== Panels: Assistant / Profile open as popups over the dashboard; tapping outside parks them as tabs beside the Next-session button ===== */
window.Panels = (function () {
  const SRC = 'assistant.html', NUDGE_EVERY = 5 * 60 * 1000, NUDGE_SHOW = 15 * 1000;
  const MSG = { en: 'I am sleepy :) ', ar: 'أريد أن أرتاح قليلا', eg: 'لسه محتاجني؟' };
  const TTL = { assistant: { en: 'Assistant', ar: 'المساعد', eg: 'المساعد' }, profile: { en: 'Profile', ar: 'ملفي', eg: 'ملفي' } };
  const ASSIST_SVG = '<svg class="asv" viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M11.5 4.5c-3.6 0-6.5 2.9-6.5 6.5 0 2.1.9 3.9 2.4 5.2.5.4.8 1 .8 1.7V21h7.6v-3h1.3c.9 0 1.6-.7 1.6-1.6v-2.1l1.4-.7c.5-.2.6-.8.3-1.2l-2-2.9C18.6 6.4 15.4 4.5 11.5 4.5z"/><path d="M7.4 23.5c0-1 .8-1.8 1.8-1.8h6.6c1 0 1.8.8 1.8 1.8V27H7.4z"/><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M23.6 10.2l3.2-1.2"/><path d="M24.2 13.4h3.6"/><path d="M23.6 16.6l3.2 1.2"/></g></svg>';
  const DEF = { assistant: { icon: 'fa-microphone-lines', svg: ASSIST_SVG, color: '#34d399' }, profile: { icon: 'fa-user', color: '#fbbf24' } };
  let cur = null, loadedKey = null, nudgeT = null, hideT = null; const mins = [];
  const L = () => (typeof lang !== 'undefined' && MSG[lang]) ? lang : 'en';
  const key = () => L() + (document.body.classList.contains('light-theme') ? 'l' : 'd');
  const lock = on => { document.documentElement.style.overflow = on ? 'hidden' : ''; };

  function dock() {
    $('dock').innerHTML = mins.map((id, ix) => `<div class="aswrap dkw ${dkSide(id)}" data-id="${id}" style="${dkStyle(id, ix)}"><button type="button" class="dk" data-p="${id}" style="background:${DEF[id].color}" aria-label="${TTL[id][L()]}" title="${TTL[id][L()]}">${DEF[id].svg || `<i class="fa-solid ${DEF[id].icon}"></i>`}</button><span class="dkx" data-x="${id}" role="button" tabindex="0" aria-label="Close" title="Close">×</span>${id === 'assistant' ? '<div class="asn" id="asNudge" role="button" tabindex="0" hidden></div>' : ''}</div>`).join('');
    $('dock').querySelectorAll('.dk').forEach(b => b.onclick = e => open(b.dataset.p, e));
    $('dock').querySelectorAll('.dkx').forEach(x => { x.onclick = e => { e.stopPropagation(); dismiss(x.dataset.x); }; x.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(x.dataset.x); } }; });
    const n = $('asNudge'); if (n) n.onclick = e => open('assistant', e);
    dkDrag();
  }
  function dismiss(id) {
    const i = mins.indexOf(id); if (i > -1) mins.splice(i, 1);
    if (id === 'assistant') { $('asFrame').removeAttribute('src'); loadedKey = null; stopNudge(); }
    dock(); if (mins.includes('assistant')) nudge();
  }
  function stopNudge() { clearTimeout(nudgeT); clearTimeout(hideT); }
  function nudge() {
    clearTimeout(nudgeT);
    nudgeT = setTimeout(() => {
      if (!mins.includes('assistant')) return;
      const n = $('asNudge'), b = $('dock').querySelector('.dk[data-p="assistant"]');
      if (n && b && !document.hidden) {
        n.textContent = MSG[L()]; n.hidden = false;
        b.classList.remove('shk'); void b.offsetWidth; b.classList.add('shk');
        hideT = setTimeout(() => { n.hidden = true; b.classList.remove('shk'); }, NUDGE_SHOW);
      }
      nudge();
    }, NUDGE_EVERY);
  }
  function show(id) {
    ['assistant', 'profile'].forEach(p => $('pp-' + p).hidden = p !== id);
    $('asm').hidden = false; lock(true);
  }
  function open(id, e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!DEF[id]) return;
    if (cur === id) return;
    /* no parked tabs for bar buttons: switching just replaces the one that was open */
    const i = mins.indexOf(id); if (i > -1) mins.splice(i, 1);
    if (id === 'assistant') {
      const f = $('asFrame');
      if (!f.getAttribute('src') || loadedKey !== key()) { f.src = SRC; loadedKey = key(); }
      stopNudge();
    }
    if (id === 'profile') { const c = $('info') && $('info').closest('.thabit-card'); if (c && !$('pcard').contains(c)) { c.classList.remove('acc'); c.style.marginBottom = '0'; $('pcard').appendChild(c); } }
    cur = id; show(id); dock();
    if (mins.includes('assistant')) nudge();
  }
  function min() {
    if (!cur) return;
    cur = null; $('asm').hidden = true; lock(false); dock();   /* just hides (the assistant frame and the profile keep their state); no tab */
  }
  function close() {
    if (!cur) return;
    if (cur === 'assistant') { $('asFrame').removeAttribute('src'); loadedKey = null; stopNudge(); }
    cur = null; $('asm').hidden = true; lock(false); dock();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') min(); });
  return { open, min, close, dismiss };
})();
window.openAssistant = e => Panels.open('assistant', e);

/* ===== Mini scrollbar for cards that scroll inside the dashboard (arrow / tiny thumb / arrow) ===== */
function initMiniBars() {
  return;   /* mini scrollbar removed: lists scroll by touch / wheel, no bar */
  const arrow = d => `<button type="button" class="mbb" data-d="${d}" aria-label="${d < 0 ? 'Up' : 'Down'}"><svg width="10" height="10" viewBox="0 0 10 10"><path d="${d < 0 ? 'M1.5 6.5L5 3l3.5 3.5' : 'M1.5 3.5L5 7l3.5-3.5'}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
  document.querySelectorAll('.lst').forEach(el => {
    if (el.dataset.mb || el.closest('.earc')) return;
    el.dataset.mb = '1';
    const w = document.createElement('div'); w.className = 'mbw';
    el.parentNode.insertBefore(w, el); w.appendChild(el);
    const bar = document.createElement('div'); bar.className = 'mb';
    bar.innerHTML = arrow(-1) + '<div class="mbt"><div class="mbh"></div></div>' + arrow(1);
    w.appendChild(bar);
    const track = bar.querySelector('.mbt'), thumb = bar.querySelector('.mbh');
    const upd = () => {
      const over = el.scrollHeight > el.clientHeight + 4;
      w.classList.toggle('has', over);
      if (!over) return;
      const p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      thumb.style.transform = 'translateY(' + ((track.clientHeight - thumb.offsetHeight) * p) + 'px)';
    };
    el.addEventListener('scroll', upd, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(upd).observe(el);
    let drag = null;
    thumb.addEventListener('pointerdown', e => { drag = { y: e.clientY, top: el.scrollTop }; thumb.setPointerCapture(e.pointerId); e.preventDefault(); });
    thumb.addEventListener('pointermove', e => { if (!drag) return; el.scrollTop = drag.top + (e.clientY - drag.y) * ((el.scrollHeight - el.clientHeight) / Math.max(1, track.clientHeight - thumb.offsetHeight)); });
    ['pointerup', 'pointercancel'].forEach(ev => thumb.addEventListener(ev, () => { drag = null; }));
    bar.querySelectorAll('.mbb').forEach(b => { let tm; const go = () => el.scrollBy({ top: +b.dataset.d * 70 }); b.addEventListener('pointerdown', () => { go(); tm = setInterval(go, 90); }); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => clearInterval(tm))); });
    upd();
  });
}
(function () {
  const root = $('lists'); if (!root) return;
  let q = 0;
  new MutationObserver(() => { cancelAnimationFrame(q); q = requestAnimationFrame(initMiniBars); }).observe(root, { childList: true, subtree: true });
  initMiniBars();
})();

/* ===== Assistant words: a pinned card that exists ONLY on days when words were uploaded (Cairo day). No X, gone at midnight. ===== */
const ASX = {
  en: { t: 'New words', open: 'Open Assistant' },
  ar: { t: 'كلمات جديدة', open: 'افتح المساعد' },
  eg: { t: 'كلمات جديدة', open: 'افتح المساعد' }
};
(function () { const s = document.createElement('style'); s.textContent = `
.pc.as .awn{display:inline-block;min-width:20px;padding:0 7px;margin-inline-start:6px;border-radius:999px;background:#34d399;color:#06281b;font-size:.72rem;font-weight:700;text-align:center;vertical-align:middle}
.aw{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:2px 14px;margin-top:8px;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none;transition:max-height .25s ease}
.aw::-webkit-scrollbar{display:none;width:0;height:0}
.aw span{display:flex;align-items:center;gap:7px;font-size:.84rem;line-height:1.25;padding:4px 0;border-bottom:1px dashed rgba(148,163,184,.22);overflow-wrap:anywhere}
.aw span::before{content:"";flex:none;width:5px;height:5px;border-radius:50%;background:#34d399}
.billl{margin-top:6px;font-size:.8rem;font-weight:700;color:#fbbf24}
.aww{cursor:pointer}.aww:hover{color:#34d399}
/* hyperlinked words: no underline, just a slightly different colour */
.rt-link{text-decoration:none!important;border-bottom:0!important;box-shadow:none!important;background:none!important;color:#7dd3fc!important;cursor:pointer}
body.light-theme .rt-link{color:#0369a1!important}
/* word player pop-up */
.wp{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);width:min(92vw,360px);z-index:99999;background:rgba(15,23,42,.97);color:#e2e8f0;border:1px solid rgba(148,163,184,.3);border-radius:16px;padding:12px 14px;box-shadow:0 12px 36px rgba(0,0,0,.45)}
body.light-theme .wp{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}
.wpw{font-weight:700;margin-bottom:8px;text-align:center;overflow-wrap:anywhere}
.wpr{display:flex;align-items:center;gap:8px}
.wpb{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:#34d399;color:#06281b;cursor:pointer;display:flex;align-items:center;justify-content:center}
.wpb.dl{background:transparent;color:inherit;border:1px solid rgba(148,163,184,.45)}
.wp input[type=range]{flex:1;min-width:0;accent-color:#34d399}
.wpt{flex:none;font-size:.68rem;opacity:.75;font-variant-numeric:tabular-nums}
.wpn{flex:none;font-size:.68rem;opacity:.6}
.wpm{font-size:.82rem;text-align:center;opacity:.85}`; document.head.appendChild(s); })();
const asNotes = () => ((D && D.notes) || []).filter(n => WORD_KINDS.includes(n.kind) && cairoDay(n.created_at) === itToday());
function asWords() {
  const seen = new Set(), out = [];
  asNotes().slice().sort((a, b) => String(a.created_at).localeCompare(String(b.created_at))).forEach(n => {
    const m = n.meta || {}; (n.kind === 'word_ready' ? [m.word] : (m.words || [])).forEach(w => {
      w = String(w == null ? '' : w).trim(); const k = w.toLowerCase();
      if (w && !seen.has(k)) { seen.add(k); out.push(w); }
    });
  });
  return out;
}
function asCard() {
  const w = asWords(); if (!w.length) return null;
  const t = ASX[lang] || ASX.en;
  return { id: 'as', noX: true, cls: 'as', isNew: asNotes().some(n => !n.read_at),
    html: `<h3>${t.t}<span class="awn">${w.length}</span></h3><div class="aw" dir="auto">${w.map(x => `<span class="aww" role="button" tabindex="0" dir="auto" data-w="${esc(x)}" onclick="wpOpen(this.dataset.w)" onkeydown="if(event.key==='Enter')wpOpen(this.dataset.w)">${esc(x)}</span>`).join('')}</div>`
      + `<div style="margin-top:10px"><button type="button" class="btn2" onclick="event.stopPropagation();closePop();Panels.open('assistant',event)">${t.open}</button></div>` };
}

/* ===== Word player pop-up (tap a word in the Assistant card): play/pause, seek bar, download ===== */
const WPX = {
  en: { missing: 'No recording for this word yet', fail: 'Could not load the recording', dl: 'Download', dls: 'Downloading…' },
  ar: { missing: 'لا يوجد تسجيل لهذه الكلمة بعد', fail: 'تعذر تحميل التسجيل', dl: 'تحميل', dls: 'جاري التحميل…' },
  eg: { missing: 'الكلمة دي لسه مفيهاش صوت', fail: 'مقدرتش أحمّل الصوت', dl: 'تحميل', dls: 'بيتحمّل…' }
};
const WP = { urls: [], i: 0, a: null, word: '', tk: 0 };
const fmtS = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
function wpClose() { WP.tk++; if (WP.a) { try { WP.a.pause(); } catch (e) {} WP.a = null; } const el = $('wp'); if (el) el.remove(); }
function wpMsg(t) { const el = $('wp'); if (!el) return; el.querySelector('.wpr').style.display = 'none'; const m = el.querySelector('.wpm'); m.textContent = t; m.hidden = false; }
function wpLoad(auto) {
  const el = $('wp'); if (!el) return;
  if (WP.a) { try { WP.a.pause(); } catch (e) {} }
  const a = WP.a = new Audio(WP.urls[WP.i]), my = WP.tk;
  const pb = el.querySelector('.wpp'), sk = el.querySelector('input'), tm = el.querySelector('.wpt'), part = el.querySelector('.wpn');
  let drag = false;
  const live = () => my === WP.tk && WP.a === a;
  const sync = () => { if (!live()) return; const d = a.duration || 0; if (!drag) sk.value = d ? Math.round(a.currentTime / d * 1000) : 0; tm.textContent = fmtS(a.currentTime) + ' / ' + fmtS(d); };
  const icon = () => { if (live()) pb.innerHTML = `<i class="fa-solid ${a.paused ? 'fa-play' : 'fa-pause'}"></i>`; };
  part.textContent = WP.urls.length > 1 ? (WP.i + 1) + '/' + WP.urls.length : '';
  a.ontimeupdate = sync; a.onloadedmetadata = sync; a.onplay = icon; a.onpause = icon;
  a.onended = () => { if (!live()) return; if (WP.i < WP.urls.length - 1) { WP.i++; setTimeout(() => { if (my === WP.tk) wpLoad(true); }, 350); } else { a.currentTime = 0; sync(); icon(); } };
  a.onerror = () => { if (live()) wpMsg((WPX[lang] || WPX.en).fail); };
  pb.onclick = () => { if (a.paused) a.play().catch(() => {}); else a.pause(); };
  sk.oninput = () => { drag = true; if (a.duration) { a.currentTime = sk.value / 1000 * a.duration; tm.textContent = fmtS(a.currentTime) + ' / ' + fmtS(a.duration); } };
  sk.onchange = () => { drag = false; };
  sk.value = 0; sync(); icon();
  if (auto) a.play().catch(() => {});
}

/* ----- word -> audio lookup in Supabase words_table (same matching as the Assistant: cleaned word, exact) ----- */
const wpClean = v => !v ? '' : String(v).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"\u201C\u201D\u2018\u2019]/g, '').replace(/\s+/g, ' ').trim();
const wpParts = v => String(v || '').split(/[,\u060C\n]+/).map(x => x.trim()).filter(Boolean);
const wpCache = {}; let wpKeyOK = true;
async function wpQuery(qs) {
  const r = await fetch(`${SB}/rest/v1/words_table?select=audio_url&audio_url=not.is.null&limit=1&${qs}`, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
  const rows = await r.json(); return Array.isArray(rows) && rows[0] ? rows[0].audio_url : null;
}
async function wpLookup(word) {
  const c = wpClean(word); if (!c) return null;
  if (wpCache[c]) return wpCache[c];
  let u = null;
  if (wpKeyOK) { try { u = await wpQuery('word_key=eq.' + encodeURIComponent(c)); } catch (e) { if (e.status === 400 || e.status === 404) wpKeyOK = false; else throw e; } }
  if (!u) u = await wpQuery('word=ilike.' + encodeURIComponent(String(word).trim().replace(/[\\%_]/g, m => '\\' + m)));
  if (u) wpCache[c] = u;
  return u;
}
async function wpResolve(text) {   // whole text first; "a, b" -> every part, only if all parts exist
  const u = await wpLookup(text); if (u) return [u];
  const parts = wpParts(text); if (parts.length < 2) return null;
  const us = await Promise.all(parts.map(wpLookup)); return us.every(Boolean) ? us : null;
}
async function wpOpen(word) {
  word = String(word == null ? '' : word).trim(); if (!word) return;
  if (window.ThabitRichStudent) { try { ThabitRichStudent.stop(); } catch (e) {} }
  wpClose();
  const my = ++WP.tk, x = WPX[lang] || WPX.en;
  WP.word = word; WP.urls = []; WP.i = 0;
  const el = document.createElement('div'); el.id = 'wp'; el.className = 'wp';
  el.innerHTML = `<div class="wpw" dir="auto">${esc(word)}</div><div class="wpr" dir="ltr"><button type="button" class="wpb wpp" aria-label="Play/Pause"><i class="fa-solid fa-play"></i></button><input type="range" min="0" max="1000" value="0" aria-label="Seek"><span class="wpt">0:00 / 0:00</span><span class="wpn"></span></div><div class="wpm" dir="auto" hidden></div>`;
  document.body.appendChild(el);
  // download button removed for now (wpDownload below is kept, unused, to bring it back later)
  let urls, err = '';
  try { urls = await wpResolve(word); } catch (e) { urls = undefined; err = e && e.message || String(e); console.error('[word player] lookup failed for "' + word + '":', e); }
  if (my !== WP.tk) return;
  if (!urls) { wpMsg(urls === null ? x.missing : x.fail + (err ? ' (' + err + ')' : '')); return; }
  WP.urls = urls; wpLoad(true);
}
async function wpDownload() {
  const url = WP.urls[WP.i]; if (!url) return;
  const x = WPX[lang] || WPX.en;
  const ext = ((url.split('?')[0].match(/\.(mp3|wav|m4a|ogg|webm|aac)$/i)) || [0, 'mp3'])[1].toLowerCase();
  const name = (WP.word.replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 60) || 'word') + (WP.urls.length > 1 ? '-' + (WP.i + 1) : '') + '.' + ext;
  const go = (href, blank) => { const a = document.createElement('a'); a.href = href; a.download = name; a.rel = 'noopener'; if (blank) a.target = '_blank'; document.body.appendChild(a); a.click(); a.remove(); };
  itToast(x.dls);
  if (/\/storage\/v1\//.test(url)) { go(url + (url.includes('?') ? '&' : '?') + 'download=' + encodeURIComponent(name)); return; }   // server sends Content-Disposition: attachment
  try {
    const r = await fetch(url); if (!r.ok) throw new Error('dl');
    const u = URL.createObjectURL(await r.blob()); go(u); setTimeout(() => URL.revokeObjectURL(u), 8000);
  } catch (e) { go(url, true); }
}
/* tap outside the player closes ONLY the player (the feed stays); tapping another word just switches to it */
document.addEventListener('click', e => {
  const w = $('wp'); if (!w) return;
  const t = e.target;
  if (w.contains(t) || (t.closest && t.closest('.aww, .rt-link'))) return;
  e.stopPropagation(); e.preventDefault(); wpClose();
}, true);
/* tap outside the feed (and outside the player / Feed button) closes the whole feed */
document.addEventListener('click', e => {
  const o = $('pop'); if (!o || !o.classList.contains('open')) return;
  if (e.target.closest && e.target.closest('.pc, #wp, #feedBtn')) return;
  closePop();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('wp')) wpClose(); });

/* ===== Words list: shows 4.5 rows first (last row half cut = "there is more below"); after the first scroll it settles to 5 full rows ===== */
function peekWords(root) {
  root.querySelectorAll('.aw').forEach(aw => {
    const sp = aw.querySelectorAll('.aww'); if (!sp.length) return;
    const tops = [...new Set([...sp].map(x => x.offsetTop))].sort((a, b) => a - b);
    if (tops.length <= 5) { aw.style.maxHeight = ''; return; }          // fits: nothing to hint
    const gap = parseFloat(getComputedStyle(aw).rowGap) || 0, full = tops[5] - tops[0] - gap, half = tops[4] - tops[0] + (tops[5] - tops[4] - gap) / 2;
    aw.style.maxHeight = half + 'px';
    let t = null;
    const settle = () => { aw.removeEventListener('scroll', onScroll); aw.style.maxHeight = full + 'px'; };
    const onScroll = () => { clearTimeout(t); t = setTimeout(settle, 180); };
    aw.addEventListener('scroll', onScroll, { passive: true });
  });
}


/* ===== Background lock: while the feed or the word player is open, the page behind never scrolls ===== */
(function () { const st = document.createElement('style'); st.textContent = `
html.bgl,html.bgl body{overflow:hidden!important}
#pop,.pc,.aw,.ntl,.lst{overscroll-behavior:contain}
.pkh{scrollbar-width:none;-ms-overflow-style:none}.pkh::-webkit-scrollbar{display:none;width:0;height:0}`; document.head.appendChild(st); })();
const bgLocked = () => { const p = $('pop'); return !!((p && p.classList.contains('open')) || $('wp')); };
let lockOn = false;
const syncLock = () => { const l = bgLocked(); document.documentElement.classList.toggle('bgl', l); if (l === lockOn) return; lockOn = l; const m = l ? 'addEventListener' : 'removeEventListener'; document[m]('wheel', onLockWheel, { passive: false }); document[m]('touchmove', onLockMove, { passive: false }); };
function pkScroller(t, dy) {   // a scrollable element inside the feed / player that can still move in this direction
  const host = t && t.closest ? t.closest('#pop, #wp') : null; if (!host) return null;
  for (let e = t; e; e = e.parentElement) {
    const oy = getComputedStyle(e).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && e.scrollHeight > e.clientHeight + 1 && (dy > 0 ? e.scrollTop + e.clientHeight < e.scrollHeight - 1 : e.scrollTop > 0)) return e;
    if (e === host) break;
  }
  return null;
}
function onLockWheel(e) { if (bgLocked() && !pkScroller(e.target, e.deltaY)) e.preventDefault(); }
let pkY = 0;
document.addEventListener('touchstart', e => { pkY = e.touches[0].clientY; }, { passive: true });
function onLockMove(e) {
  if (!bgLocked()) return;
  const y = e.touches[0].clientY, dy = pkY - y; pkY = y;
  if (e.target.closest && e.target.closest('input[type=range]')) return;
  if (!pkScroller(e.target, dy)) e.preventDefault();
}
window.addEventListener('DOMContentLoaded', () => {
  const p = $('pop'); if (p) new MutationObserver(syncLock).observe(p, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(syncLock).observe(document.body, { childList: true });   // the player (#wp) is added to / removed from body
  syncLock();
});

/* ===== Peek hint for every long text area: the last line shows half-cut until the first scroll, then it settles to the normal size ===== */
const PK_BOXES = '.lst, .ntl, #mB, #ssList, #logList';      // scroll boxes that already have a height from the CSS: keep that height, only add the hint
const PK_TEXT = [['.nt .rich', 5], ['.itd.rich', 5]];      // text blocks: capped at 5 lines (a 6th line starts -> hint + scroll)
function peekEl(el, lines) {
  if (el.dataset.pk || (el.closest && el.closest('.earc'))) return;
  const cs = getComputedStyle(el), u = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) || 14) * 1.45;
  let H;
  if (lines) {
    H = lines * u; if (el.scrollHeight <= H + 1) return;     // fits in 5 lines: nothing to hint
    el.style.overflowY = 'auto'; el.classList.add('pkh');
  } else {
    H = el.clientHeight; if (H < 2 * u || el.scrollHeight <= H + 2 || !/auto|scroll/.test(cs.overflowY)) return;
  }
  let cand = 0;
  for (const c of el.children) { if (c.offsetTop < H) cand = c.offsetTop + c.offsetHeight / 2; else break; }
  let cut = H - u / 2; if (cand >= H * 0.6 && cand < cut) cut = cand;
  el.dataset.pk = '1';
  el.style.transition = 'max-height .25s ease'; el.style.maxHeight = cut + 'px';
  let t = null;
  const settle = () => {
    el.removeEventListener('scroll', onScroll);
    el.style.maxHeight = H + 'px';
    setTimeout(() => { if (!lines) el.style.maxHeight = ''; el.style.transition = ''; }, 320);
  };
  const onScroll = () => { clearTimeout(t); t = setTimeout(settle, 180); };
  el.addEventListener('scroll', onScroll, { passive: true });
}
function peekAll() {
  PK_TEXT.forEach(([sel, n]) => document.querySelectorAll(sel).forEach(el => peekEl(el, n)));
  document.querySelectorAll(PK_BOXES).forEach(el => peekEl(el, 0));
}
(function () { let q = 0; const run = () => { clearTimeout(q); q = setTimeout(() => requestAnimationFrame(peekAll), 150); };
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true }); window.addEventListener('DOMContentLoaded', run); })();


/* ===== Chart intro: once per page load, AFTER the feed pop-up is closed (or at once if there is no pop-up).
   Lines start invisible and are drawn from zero, slowly and smoothly; the dots appear as the line reaches them. ===== */
const CINTRO = { played: false, wait: false, popShown: false };
(function () { const st = document.createElement('style'); st.textContent = `
svg.c2 .ln{stroke-linecap:round;stroke-linejoin:round}
svg.c2 .dot{stroke:none;stroke-width:0}
svg.c2 .dot.performance{filter:drop-shadow(0 0 2.5px #ef4444)}
svg.c2 .dot.attitude{filter:drop-shadow(0 0 2.5px #3b82f6)}
svg.c2 .dot.soft_skills{filter:drop-shadow(0 0 2.5px #10b981)}
svg.c2 .dot.compliance{filter:drop-shadow(0 0 2.5px #f97316)}
svg.c2 .dot.attendance{filter:drop-shadow(0 0 2.5px #06b6d4)}
svg.c2.ci .ln{stroke-dasharray:1;stroke-dashoffset:1}
svg.c2.ci .dot:not(.hit){opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.2)}
svg.c2.ci.go .ln{animation:thLn 2.6s cubic-bezier(.45,.05,.2,1) forwards;animation-delay:calc(var(--li,0) * .12s)}
svg.c2.ci.go .dot:not(.hit){animation:thDot .55s cubic-bezier(.2,.8,.3,1.15) forwards;animation-delay:calc(var(--d,0) * 2.3s + var(--li,0) * .12s + .2s)}
@keyframes thLn{to{stroke-dashoffset:0}}
@keyframes thDot{to{opacity:1;transform:scale(1)}}
@media(prefers-reduced-motion:reduce){svg.c2.ci .ln{stroke-dasharray:none;stroke-dashoffset:0;animation:none!important}svg.c2.ci .dot:not(.hit){opacity:1;transform:none;animation:none!important}}`; document.head.appendChild(st); })();
function chartsGo() {
  if (CINTRO.played) return; CINTRO.played = true; CINTRO.wait = false;
  const fb = $('feedBtn'); if (fb) fb.classList.add('live');            // the heartbeat line of the Feed button starts drawing too
  const els = document.querySelectorAll('svg.c2.ci:not(.go)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('go')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('go'); io.unobserve(en.target); } }), { threshold: 0.2 });
  els.forEach(e => io.observe(e));       // a chart inside a closed accordion draws when it is opened
}
window.addEventListener('DOMContentLoaded', () => {
  const p = $('pop'); if (!p) return;
  new MutationObserver(() => { if (CINTRO.wait && CINTRO.popShown && !p.classList.contains('open')) setTimeout(chartsGo, 350); }).observe(p, { attributes: true, attributeFilter: ['class'] });
});
/* page open: on a refresh the button is already complete (no flash of the empty ring); first time after login -> empty white ring */
(function(){ const b=document.getElementById('feedBtn'); if(b&&b.classList.contains('empty')){ try{ if(!VIEW&&tok()&&localStorage.getItem('thabit_intro_tok')===tok()){ b.classList.remove('empty'); b.classList.add('done'); } }catch(e){} } })();


/* ===== Profile picture: pick -> crop (drag + zoom) -> filter -> saved as a 320x320 square (shown round, like WhatsApp) ===== */
const AV_DEFAULT = 'assets/default-avatar.jpg';
const AVK = ['most_recent_picture_url', 'image_url', 'picture_url', 'photo_url', 'avatar_url', 'image', 'picture'];   // first one found in the profile row is used
const avUrl = () => { const p = (D && D.profile) || {}; for (const k of AVK) if (p[k]) return p[k]; return ''; };
const AVX = {
  en: { add: 'Add your picture', change: 'Change picture', save: 'Save', cancel: 'Cancel', zoom: 'Zoom', bright: 'Brightness', saving: 'Saving…', fail: 'Could not save, try again', saved: 'Picture saved ✓', f: { none: 'Original', bw: 'B&W', warm: 'Warm', cool: 'Cool', vivid: 'Vivid', fade: 'Fade' } },
  ar: { add: 'أضف صورتك', change: 'تغيير الصورة', save: 'حفظ', cancel: 'إلغاء', zoom: 'تكبير', bright: 'السطوع', saving: 'جاري الحفظ…', fail: 'تعذر الحفظ، حاول مرة أخرى', saved: 'تم حفظ الصورة ✓', f: { none: 'الأصلية', bw: 'أبيض وأسود', warm: 'دافئ', cool: 'بارد', vivid: 'زاهي', fade: 'باهت' } },
  eg: { add: 'ضيف صورتك', change: 'غيّر الصورة', save: 'حفظ', cancel: 'إلغاء', zoom: 'تكبير', bright: 'السطوع', saving: 'بيتحفظ…', fail: 'معرفناش نحفظ، جرب تاني', saved: 'الصورة اتحفظت ✓', f: { none: 'الأصلية', bw: 'أبيض وأسود', warm: 'دافي', cool: 'بارد', vivid: 'زاهي', fade: 'باهت' } }
};
const AVT = () => AVX[lang] || AVX.en;
const AVF = { none: '', bw: 'grayscale(1) contrast(1.05)', warm: 'sepia(.35) saturate(1.2) hue-rotate(-8deg)', cool: 'saturate(1.1) hue-rotate(12deg) brightness(1.03)', vivid: 'saturate(1.6) contrast(1.1)', fade: 'contrast(.85) brightness(1.1) saturate(.8)' };
const AVS = 320, AV = { img: null, z: 1, ox: 0, oy: 0, f: 'none', b: 1, drag: null };
function renderAvatar() {
  const box = $('avBox'); if (!box) return;
  const u = avUrl(), shown = u || AV_DEFAULT, img = $('avImg'), btn = $('avBtn');
  if (img.getAttribute('src') !== shown) img.src = shown; box.classList.add('has');   // no picture yet -> the Thabit default picture
  btn.textContent = u ? AVT().change : AVT().add; btn.hidden = VIEW;
  try { if (window.Thabit && Thabit.setAvatar) Thabit.setAvatar(u || AV_DEFAULT); } catch (e) {}                 // header profile button (brand.js) can listen to either of these
  try { document.dispatchEvent(new CustomEvent('thabit:avatar', { detail: { url: u || AV_DEFAULT } })); } catch (e) {}
}
function avDraw() {
  const c = $('avCv'), x = c.getContext('2d'), im = AV.img; if (!im) return;
  const sc = Math.max(AVS / im.naturalWidth, AVS / im.naturalHeight) * AV.z, w = im.naturalWidth * sc, h = im.naturalHeight * sc;
  const mx = (w - AVS) / 2, my = (h - AVS) / 2;
  AV.ox = Math.max(-mx, Math.min(mx, AV.ox)); AV.oy = Math.max(-my, Math.min(my, AV.oy));
  x.clearRect(0, 0, AVS, AVS); x.fillStyle = '#000'; x.fillRect(0, 0, AVS, AVS);
  x.filter = ((AVF[AV.f] || '') + ' brightness(' + AV.b + ')').trim();
  x.drawImage(im, AVS / 2 - w / 2 + AV.ox, AVS / 2 - h / 2 + AV.oy, w, h);
  x.filter = 'none';
}
function avLabels() {
  const t = AVT();
  $('avLz').textContent = t.zoom; $('avLb').textContent = t.bright; $('avSave').textContent = t.save; $('avCancel').textContent = t.cancel;
  $('avF').innerHTML = Object.keys(AVF).map(k => `<button type="button" data-f="${k}" class="${k === AV.f ? 'on' : ''}">${t.f[k]}</button>`).join('');
}
function avOpen(file) {
  const u = URL.createObjectURL(file), im = new Image();
  im.onload = () => {
    AV.img = im; AV.z = 1; AV.ox = 0; AV.oy = 0; AV.f = 'none'; AV.b = 1;
    $('avZ').value = 1; $('avB').value = 1; $('avMsg').textContent = ''; $('avSave').disabled = false;
    avLabels(); avDraw(); $('avm').classList.add('open'); URL.revokeObjectURL(u);
  };
  im.onerror = () => { URL.revokeObjectURL(u); itToast(AVT().fail); };
  im.src = u;
}
function avClose() { $('avm').classList.remove('open'); AV.img = null; }
async function avSave() {
  const t = AVT(), b = $('avSave'); b.disabled = true; b.textContent = t.saving; $('avMsg').textContent = '';
  const url = $('avCv').toDataURL('image/jpeg', 0.85);
  const ok = await rpc('trainee_set_avatar', { p_token: tok(), p_url: url }).catch(() => null);
  if (ok === true) {
    D.profile = D.profile || {}; D.profile[AVK.find(k => k in D.profile) || 'most_recent_picture_url'] = url;
    renderAvatar(); avClose(); itToast(t.saved);
  } else { $('avMsg').textContent = t.fail; b.disabled = false; b.textContent = t.save; }
}
window.addEventListener('DOMContentLoaded', () => {
  if (!$('avBtn')) return;
  $('avBtn').onclick = () => $('avFile').click();
  $('avFile').onchange = e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) avOpen(f); };
  $('avZ').oninput = e => { AV.z = +e.target.value; avDraw(); };
  $('avB').oninput = e => { AV.b = +e.target.value; avDraw(); };
  $('avF').onclick = e => { const b = e.target.closest('button[data-f]'); if (!b) return; AV.f = b.dataset.f; $('avF').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); avDraw(); };
  $('avCancel').onclick = avClose; $('avSave').onclick = avSave;
  $('avm').addEventListener('click', e => { if (e.target === $('avm')) avClose(); });
  const cv = $('avCv');
  cv.addEventListener('pointerdown', e => { AV.drag = { x: e.clientX, y: e.clientY, ox: AV.ox, oy: AV.oy }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (!AV.drag) return; const k = AVS / cv.getBoundingClientRect().width; AV.ox = AV.drag.ox + (e.clientX - AV.drag.x) * k; AV.oy = AV.drag.oy + (e.clientY - AV.drag.y) * k; avDraw(); });
  ['pointerup', 'pointercancel'].forEach(ev => cv.addEventListener(ev, () => { AV.drag = null; }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('avm').classList.contains('open')) avClose(); });
});


/* ===== Language: taken from basic_info.preferred_language (مصر / عربي / انجلش); one button, pick another from a blurred pop-up ===== */
function normLang(v) {
  const x = String(v == null ? '' : v).trim().toLowerCase(); if (!x) return null;
  if (/مصر|egy|^eg/.test(x)) return 'eg';
  if (/عرب|^ar/.test(x)) return 'ar';
  if (/انج|إنج|ingl|engl|^en/.test(x)) return 'en';
  return null;
}
function applyPrefLang(p) {   // applied when the column value is new/changed; after that the trainee's own pick on this device stays
  const raw = p && p.preferred_language, n = normLang(raw); if (!n) return;
  let last = null; try { last = localStorage.getItem('thabit_lang_pref'); } catch (e) {}
  if (last !== String(raw)) { try { localStorage.setItem('thabit_lang_pref', String(raw)); } catch (e) {} setLanguage(n); }
}




(function () {
/* ===== Sidebar placement + pop-out options (language / pen) =====
   - The bar can sit on the left, the right or the bottom. Pop-outs always open AWAY from the side the bar is on.
   - Placement is saved on this device (thabit_bar_place) and stays until the trainee changes it by hand. */
const BTX = {
  en: { right: 'Move to the right', left: 'Move to the left', bottom: 'Move to the bottom', free: 'Move freely', hint: 'Drag the bar where you want it, then let go to pin it', pinned: 'Position pinned' },
  ar: { right: 'انقل لليمين', left: 'انقل لليسار', bottom: 'انقل للأسفل', free: 'تحريك حر', hint: 'اسحب الشريط للمكان الذي تريده ثم اتركه ليتثبت', pinned: 'تم تثبيت المكان' },
  eg: { right: 'انقله لليمين', left: 'انقله للشمال', bottom: 'نزّله تحت', free: 'حرّكه براحتك', hint: 'اسحب الشريط للمكان اللي عايزه وسيبه يتثبت', pinned: 'المكان اتثبت' }
};
const BT = () => BTX[lang] || BTX.en;
const BAR_KEY = 'thabit_bar_place';
const barEl = () => $('mobileFloatingBar');
/* which side of the screen the bar is on right now (read from where it really is, so it works whatever the stylesheet does) */
function barSide() {
  const r = barEl().getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  if (r.width > r.height * 1.2) return cy > innerHeight / 2 ? 'bottom' : 'top';
  return cx < innerWidth / 2 ? 'left' : 'right';
}
function placeGet() {
  try { const p = JSON.parse(localStorage.getItem(BAR_KEY) || 'null'); if (p && /^(left|right|bottom)$/.test(p.dock)) return { dock: p.dock, pos: isFinite(p.pos) && p.pos !== null ? Math.min(1, Math.max(0, +p.pos)) : .5 }; } catch (e) {}
  return null;
}
function placeSet(p) { try { localStorage.setItem(BAR_KEY, JSON.stringify(p)); } catch (e) {} }
/* p = {dock, pos}: dock = left | right | bottom, pos = where the bar's centre sits along that edge (0..1). No saved place = the stylesheet's own default. */
function applyPlace(p) {
  const bar = barEl(), root = document.documentElement;
  root.setAttribute('data-bar', 'bottom'); bar.style.removeProperty('--bp'); return;   /* fixed bottom tab bar: no side placement */
  if (bar.classList.contains('moving') && !p) return;
  p = p || placeGet();
  if (!p) { root.removeAttribute('data-bar'); bar.style.removeProperty('--bp'); return; }
  root.setAttribute('data-bar', p.dock);
  const vert = p.dock !== 'bottom', size = vert ? innerHeight : innerWidth, r = bar.getBoundingClientRect(), half = (vert ? r.height : r.width) / 2, lo = half + 8, hi = size - half - 8;
  bar.style.setProperty('--bp', (lo > hi ? size / 2 : Math.min(hi, Math.max(lo, p.pos * size))) / thK() + 'px');
}
function hopBar() { const b = barEl(); b.classList.remove('hop'); void b.offsetWidth; b.classList.add('hop'); setTimeout(() => b.classList.remove('hop'), 650); }
function dockTo(side) {
  const r = barEl().getBoundingClientRect(), from = barSide(), keep = (from === 'left' || from === 'right') && side !== 'bottom';
  const p = { dock: side, pos: keep ? (r.top + r.height / 2) / innerHeight : .5 };
  placeSet(p); applyPlace(p); hopBar();
}

/* ----- free move: drag the bar along its edge, let go = pinned for good ----- */
let MV = null;
function moveStart() {
  const bar = barEl(); if (bar.classList.contains('moving')) return;
  let side = barSide(); if (side === 'top') side = 'bottom';
  if (!placeGet()) { const r = bar.getBoundingClientRect(); applyPlace({ dock: side, pos: side === 'bottom' ? (r.left + r.width / 2) / innerWidth : (r.top + r.height / 2) / innerHeight }); }
  bar.classList.add('moving'); itToast(BT().hint);
}
function moveEnd(pinned) {
  const bar = barEl(); if (!bar.classList.contains('moving')) return;
  bar.classList.remove('moving', 'grabbing'); MV = null;
  if (pinned) itToast(BT().pinned); else applyPlace();
}
(function () {
  const bar = barEl();
  bar.addEventListener('pointerdown', e => {
    if (!bar.classList.contains('moving')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const vert = document.documentElement.getAttribute('data-bar') !== 'bottom', r = bar.getBoundingClientRect();
    MV = { id: e.pointerId, vert, p0: vert ? e.clientY : e.clientX, c0: vert ? r.top + r.height / 2 : r.left + r.width / 2, half: (vert ? r.height : r.width) / 2, c: null, moved: false };
    try { bar.setPointerCapture(e.pointerId); } catch (x) {}
    bar.classList.add('grabbing');
  }, true);
  bar.addEventListener('pointermove', e => {
    if (!MV || e.pointerId !== MV.id) return;
    const d = (MV.vert ? e.clientY : e.clientX) - MV.p0; if (!MV.moved && Math.abs(d) < 4) return; MV.moved = true;
    const size = MV.vert ? innerHeight : innerWidth, lo = MV.half + 8, hi = size - MV.half - 8;
    MV.c = lo > hi ? size / 2 : Math.min(hi, Math.max(lo, MV.c0 + d));
    bar.style.setProperty('--bp', MV.c / thK() + 'px');
  });
  const up = e => {
    if (!MV || e.pointerId !== MV.id) return;
    const m = MV; MV = null;
    if (m.moved && e.type === 'pointerup') { placeSet({ dock: document.documentElement.getAttribute('data-bar'), pos: m.c / (m.vert ? innerHeight : innerWidth) }); moveEnd(true); }
    else moveEnd(false);
  };
  bar.addEventListener('pointerup', up); bar.addEventListener('pointercancel', up);
  document.addEventListener('pointerdown', e => { if (bar.classList.contains('moving') && !bar.contains(e.target)) moveEnd(false); }, true);
  window.addEventListener('resize', () => applyPlace());
  if (window.ResizeObserver) new ResizeObserver(() => applyPlace()).observe(bar);
  applyPlace();
})();

/* ----- pop-outs: round buttons that slide out of the bar, away from the side it sits on ----- */
let pickT = null, pickBtn = null, pkFly = null, pkS = null;
const pkReduce = () => window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
function pkSolid(c, light) { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (m) { const p = m[1].split(',').map(parseFloat); if (p.length < 4 || p[3] > .5) return c; } return light ? 'rgba(255,255,255,.96)' : 'rgba(15,23,42,.94)'; }
function pkFlyDone(f) { f.el.remove(); f.btn.classList.remove('pk-hide'); if (pkFly === f) pkFly = null; }
const PK_SC = 1.3;
/* the pressed button leaves the bar (a copy flies out; the original stays empty in the bar) and lands on the stage, away from the bar */
function pkFlyOut(pop, btn, sx, sy, bx, by) {
  const K = thK(), r = btn.getBoundingClientRect(), cs = getComputedStyle(btn), light = document.body.classList.contains('light-theme');
  const el = document.createElement('div'); el.className = 'pkfly'; el.innerHTML = btn.innerHTML;
  const s = el.style; s.left = r.left / K + 'px'; s.top = r.top / K + 'px'; s.width = r.width / K + 'px'; s.height = r.height / K + 'px';
  s.borderRadius = '50%'; s.color = cs.color; s.font = cs.font; s.background = pkSolid(cs.backgroundColor, light);
  s.border = cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor; s.transformOrigin = '50% 50%';
  pop.appendChild(el);
  const dx = (sx - bx) / K, dy = (sy - by) / K;
  const f = pkFly = { el, btn, anim: null, timer: null, st: 'translate(' + dx + 'px,' + dy + 'px) scale(' + PK_SC + ')', sh: '0 16px 40px rgba(0,0,0,.6)' };
  btn.classList.add('pk-hide');
  el.onclick = e => { e.stopPropagation(); pickClose(); };
  if (pkReduce() || !el.animate) { s.transform = f.st; s.boxShadow = f.sh; if (btn.id === 'plusBtn') el.classList.add('rot'); return; }
  f.anim = el.animate([
    { transform: 'translate(0,0) scale(1)', boxShadow: '0 0 0 rgba(0,0,0,0)' },
    { transform: 'translate(' + dx * .6 + 'px,' + dy * .6 + 'px) scale(' + (PK_SC + .35) + ')', offset: .55 },
    { transform: f.st, boxShadow: f.sh }
  ], { duration: 640, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'forwards' });
  if (btn.id === 'plusBtn') requestAnimationFrame(() => el.classList.add('rot'));
}
function pkFlyBack(now) {
  const f = pkFly; if (!f || f.back) return;
  f.back = true; f.el.classList.remove('rot');
  if (now || pkReduce() || !f.el.animate) { pkFlyDone(f); return; }
  if (f.anim) f.anim.cancel();
  f.el.style.transform = f.st; f.el.style.boxShadow = f.sh;
  f.anim = f.el.animate([{ transform: f.st, boxShadow: f.sh }, { transform: 'translate(0,0) scale(1)', boxShadow: '0 0 0 rgba(0,0,0,0)' }], { duration: 300, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
  f.anim.onfinish = () => pkFlyDone(f); f.timer = setTimeout(() => pkFlyDone(f), 420);
}
/* second level: an option that has its own options (o.sub) fans them out sideways from itself, across the free space. Only one fan is open at a time. */
function pickSubClose() {
  const pop = $('langPop');
  pop.querySelectorAll('.lgi.sub').forEach(b => { b.classList.add('out'); setTimeout(() => b.remove(), 210); });
  pop.querySelectorAll('.lgi.sel').forEach(b => b.classList.remove('sel'));
  if (pkS) pkS.subI = -1;
}
function pickSubOpen(i) {
  const s = pkS, pop = $('langPop'); if (!s) return;
  if (s.subI === i) { pickSubClose(); tourStop(); return; }
  pickSubClose(); s.subI = i;
  const o = s.list[i], info = o.sub(), sub = info.list, K = s.K, STEP = (s.S + s.G) * K, x = s.pts[i][0], y = s.pts[i][1];
  const horizRow = s.ux !== 0;                                   // options sit in a row -> their fan goes up or down, toward the roomier side
  let dx = 0, dy = 0; if (horizRow) dy = (innerHeight - y) >= y ? 1 : -1; else dx = (innerWidth - x) >= x ? 1 : -1;
  const sp = [];
  pop.insertAdjacentHTML('beforeend', sub.map((q, j) => {
    const px = x + dx * (j + 1) * STEP, py = y + dy * (j + 1) * STEP; sp.push([px, py]);
    return `<button type="button" class="lgi sub${q.cur ? ' cur' : ''}" data-j="${j}" title="${esc(q.title || '')}" aria-label="${esc(q.title || '')}" style="left:${px / K - s.S / 2}px;top:${py / K - s.S / 2}px;--fx:${(x - px) / K}px;--fy:${(y - py) / K}px;--i:${j}">${q.html}</button>`;
  }).join(''));
  const own = pop.querySelector('.lgi[data-i="' + i + '"]'); if (own) own.classList.add('sel');
  pop.querySelectorAll('.lgi.sub').forEach(b => b.onclick = e => { e.stopPropagation(); const q = sub[+b.dataset.j]; if (q.keep) q.on(); else { pickClose(); q.on(); } });
  tourStart(info.key || '', sp, horizRow ? 'bottom' : 'left', [[s.sx, s.sy, 32 * K]].concat(s.pts.map(c => [c[0], c[1], (s.S / 2 + 4) * K])));
}
function pickOpen(btn, list, key0, fx) {   // fx = { side } -> the pressed button itself acts as the "bar" (used by the time filter)
  const K = thK(), pop = $('langPop'), br = (fx ? btn : barEl()).getBoundingClientRect(), r = btn.getBoundingClientRect(), side = fx ? fx.side : barSide();
  const S = 46, G = 10, M = (S / 2 + 8) * K, bx = r.left + r.width / 2, by = r.top + r.height / 2, cl = (v, a, b) => Math.min(b, Math.max(a, v));
  const cr = r.width * PK_SC / 2, ST = cr + 34 * K, D0 = cr + (10 + S / 2) * K, STEP = (S + G) * K;
  if (pop.classList.contains('open') && !pop.classList.contains('closing') && pickBtn === btn) { pickClose(); return; }   // second tap on the same button = close
  clearTimeout(pickT); pop.classList.remove('closing'); pop.dataset.side = side;
  pop.dataset.lab = (side === 'bottom' || side === 'top') ? (bx > innerWidth / 2 ? 'l' : 'r') : '';
  document.documentElement.classList.add('pk-open');
  /* same button opening again (e.g. the old pen -> customize): keep its copy on the stage instead of flying it again */
  let keep = null;
  if (pkFly && pkFly.btn === btn) { keep = pkFly; clearTimeout(keep.timer); keep.back = false; if (keep.anim) keep.anim.cancel(); keep.el.style.transform = keep.st; keep.el.style.boxShadow = keep.sh; if (btn.id === 'plusBtn') keep.el.classList.add('rot'); }
  else if (pkFly) pkFlyDone(pkFly);
  if (pickBtn && pickBtn !== btn) pickBtn.classList.remove('pk-on'); pickBtn = btn; btn.classList.add('pk-on');
  const key = key0 || ({ langBtn: 'lang', barEdit: 'star', plusBtn: 'plus', profBtn: 'prof' })[btn.id] || '', pts = [];
  /* stage = where the pressed button sits, away from the bar; its options fan out beyond it */
  let sx, sy, ux = 0, uy = 0;
  if (side === 'left') { sx = br.right + ST; sy = cl(by, M, innerHeight - M); ux = 1; }
  else if (side === 'right') { sx = br.left - ST; sy = cl(by, M, innerHeight - M); ux = -1; }
  else if (side === 'top') { sy = br.bottom + ST; sx = cl(bx, M, innerWidth - M); uy = 1; }
  else { sy = br.top - ST; sx = cl(bx, M, innerWidth - M); uy = -1; }
  pop.innerHTML = list.map((o, i) => {
    const d = D0 + i * STEP, x = sx + ux * d, y = sy + uy * d;
    pts.push([x, y]);
    return `<button type="button" class="lgi${o.cur ? ' cur' : ''}" data-i="${i}" title="${esc(o.title || '')}" aria-label="${esc(o.title || '')}" style="left:${x / K - S / 2}px;top:${y / K - S / 2}px;--fx:${(sx - x) / K}px;--fy:${(sy - y) / K}px;--i:${i}">${o.html}</button>`;
  }).join('');
  pkS = { list, pts, ux, uy, sx, sy, K, S, G, subI: -1 };
  if (keep) pop.appendChild(keep.el); else pkFlyOut(pop, btn, sx, sy, bx, by);
  pop.classList.add('open');
  pop.querySelectorAll('.lgi').forEach(b => b.onclick = e => { e.stopPropagation(); const i = +b.dataset.i, o = list[i]; if (o.sub) pickSubOpen(i); else { pickClose(); o.on(); } });
  tourStart(key, pts, side, [[sx, sy, 32 * K]]);
}
function pickClose(now) {
  tourStop();
  const pop = $('langPop'); if (!pop.classList.contains('open')) return;
  clearTimeout(pickT); document.documentElement.classList.remove('pk-open'); if (pickBtn) { pickBtn.classList.remove('pk-on'); pickBtn = null; } pkS = null;
  pkFlyBack(now);
  if (now || pkReduce()) { pop.classList.remove('open', 'closing'); pop.innerHTML = ''; return; }
  pop.classList.add('closing');
  pickT = setTimeout(() => { pop.classList.remove('open', 'closing'); pop.innerHTML = ''; }, 340);
}
function closeLang() { pickClose(); }
const ASSIST_SVG_SM = '<svg class="asv" viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M11.5 4.5c-3.6 0-6.5 2.9-6.5 6.5 0 2.1.9 3.9 2.4 5.2.5.4.8 1 .8 1.7V21h7.6v-3h1.3c.9 0 1.6-.7 1.6-1.6v-2.1l1.4-.7c.5-.2.6-.8.3-1.2l-2-2.9C18.6 6.4 15.4 4.5 11.5 4.5z"/><path d="M7.4 23.5c0-1 .8-1.8 1.8-1.8h6.6c1 0 1.8.8 1.8 1.8V27H7.4z"/><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M23.6 10.2l3.2-1.2"/><path d="M24.2 13.4h3.6"/><path d="M23.6 16.6l3.2 1.2"/></g></svg>';
function openProf(btn) {
  const ar = lang !== 'en';
  pickOpen(btn || $('profBtn'), [
    { html: '<i class="fa-solid fa-user pfi"></i>', title: ar ? 'ملفي' : 'Profile', label: ar ? 'ملفي' : 'Profile', on: () => Panels.open('profile') },
    { html: '<i class="fa-solid fa-right-from-bracket pfi" style="color:#f43f5e"></i>', title: ar ? 'تسجيل الخروج' : 'Log out', label: ar ? 'تسجيل الخروج' : 'Log out', on: () => window.logout && window.logout() }
  ]);
}
function setView(v) { try { localStorage.setItem('thabit_view', v); } catch (e) {} try { (window.top || window).location.reload(); } catch (e) { location.reload(); } }
function viewSubList() {
  const ar = lang !== 'en', wide = innerWidth > 700, U = UIT[lang] || UIT.en;
  return [
    { html: wide ? '<i class="fa-solid fa-mobile-screen"></i>' : '<i class="fa-solid fa-desktop"></i>', title: wide ? (ar ? 'شكل التليفون' : 'Phone view') : (ar ? 'شكل الديسكتوب' : 'Desktop view'), on: () => setView(wide ? 'phone' : 'desktop') },
    { html: '<i class="fa-solid fa-text-height"></i>', title: U.zoom, keep: 1, on: () => startAdjust('zoom') },
    { html: '<i class="fa-solid fa-sun"></i>', title: U.bri, keep: 1, on: () => startAdjust('bri') },
    { html: '<i class="fa-solid fa-language"></i>', title: ar ? 'اللغة' : 'Language', sub: () => {   // language lives here now (the old language button is gone from the bar)
        const lbl = { en: 'EN', ar: 'عربي', eg: 'مصري' };
        return { key: 'lang', list: ['en', 'ar', 'eg'].filter(x => x !== lang).map(l => ({ html: lbl[l], title: lbl[l], on: () => { if (l !== lang) setLanguage(l); } })) };
      } }
  ];
}
function openStar(btn) { pickOpen(btn || $('barEdit'), viewSubList(), 'view'); }
function openPlus(btn) {
  const ar = lang !== 'en';
  pickOpen(btn || $('plusBtn'), [
    { html: '<span class="plA">' + ASSIST_SVG_SM + '</span>', title: ar ? 'المساعد' : 'Assistant', label: ar ? 'المساعد' : 'Assistant', on: () => Panels.open('assistant') },
    { html: '<span class="plS"><i class="fa-solid fa-paper-plane"></i></span>', title: ar ? 'الطلبات' : 'Requests', label: ar ? 'الطلبات' : 'Requests', on: () => openRq() }
  ]);
}
function openLang(btn) {
  const lbl = { en: 'EN', ar: 'عربي', eg: 'مصري' };
  pickOpen(btn, ['en', 'ar', 'eg'].filter(x => x !== lang).map(l => ({ html: lbl[l], title: lbl[l], on: () => { if (l !== lang) setLanguage(l); } })));
}
const BIC = {
  box: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3" y="4.5" width="18" height="15" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  right: '<rect x="13.6" y="6.3" width="6.1" height="11.4" rx="2" fill="currentColor"/></svg>',
  left: '<rect x="4.3" y="6.3" width="6.1" height="11.4" rx="2" fill="currentColor"/></svg>',
  bottom: '<rect x="4.8" y="12.9" width="14.4" height="4.8" rx="2" fill="currentColor"/></svg>',
  free: '<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="M6 3.5v15.2l4.1-3.9 2.7 5.7 2.4-1.1-2.7-5.6h5.7z" fill="currentColor"/></svg>'
};
function barSubList() {
  const t = BT(), toLeft = barSide() === 'right';
  return [
    { html: BIC.box + (toLeft ? BIC.left : BIC.right), title: toLeft ? t.left : t.right, on: () => dockTo(toLeft ? 'left' : 'right') },
    { html: BIC.box + BIC.bottom, title: t.bottom, on: () => dockTo('bottom') },
    { html: BIC.free, title: t.free, on: moveStart }
  ];
}
function openBarOpts(btn) { pickOpen(btn || $('barEdit'), barSubList(), 'cust'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') { pickClose(); moveEnd(false); } });

window.thPick = pickOpen; window.openStar = openStar; window.openProf = openProf; window.openPlus = openPlus; window.openLang = openLang; window.closeLang = closeLang; window.openBarOpts = openBarOpts; window.closeBarOpts = closeLang;
})();

/* ===== Sidebar / floating bar: Feed lives inside it on phones, long-press any icon to move it ===== */
const THB_BAR_DEF = ['home', 'reload', 'feed', 'msgr', 'days', 'space', 'edit'];
function barOrder() {
  let o = []; try { o = JSON.parse(localStorage.getItem('thabit_bar_order') || '[]'); } catch (e) {}
  o = (Array.isArray(o) ? o : []).filter(k => THB_BAR_DEF.includes(k)); const hadHome = o.includes('home'); THB_BAR_DEF.forEach(k => { if (!o.includes(k)) o.push(k); }); o = o.filter(k => k !== 'home' && k !== 'space'); o.unshift('home'); o.push('space'); return o;   /* Home always leftmost, Space always rightmost */
}
function layoutBar() {
  const bar = $('mobileFloatingBar'), els = {}, edit = $('barEdit'); if (edit) edit.dataset.bk = 'edit';
  bar.querySelectorAll(':scope > [data-bk]').forEach(e => els[e.dataset.bk] = e);
  bar.querySelectorAll(':scope > .bar-divider').forEach(d => d.remove());
  const list = barOrder().map(k => els[k]).filter(e => e && !e.hidden);
  list.forEach((e, i) => { bar.appendChild(e); if (i < list.length - 1) { const d = document.createElement('div'); d.className = 'bar-divider'; bar.appendChild(d); } });
  /* More (+) is now an ordinary icon in the order, so it can be moved too */
}
(function () {
  const bar = $('mobileFloatingBar'), mq = window.matchMedia('(max-width:600px)');

                                                                                                                                                                                                                                                       
    
function placeFeed() {
  const b = $('feedBtn');
  if (b.parentNode !== bar) { b.dataset.bk = 'feed'; bar.appendChild(b); layoutBar(); }
}



  
  if (mq.addEventListener) mq.addEventListener('change', placeFeed); else if (mq.addListener) mq.addListener(placeFeed);
  layoutBar(); placeFeed();

  /* long press (0.45s) on an icon -> it lifts, drag it along the bar, release to drop; the order is remembered on this device */
  let drag = null, timer = null, sx = 0, sy = 0, swallow = false;
  const items = () => [...bar.querySelectorAll(':scope > [data-bk]')].filter(e => !e.hidden);
  const ctr = (e, ax) => { const r = e.getBoundingClientRect(); return ax === 'x' ? r.left + r.width / 2 : r.top + r.height / 2; };
  function begin(it, ev) {
    const a = items(); let ax = 'x';
    if (a.length > 1) { const r1 = a[0].getBoundingClientRect(), r2 = a[1].getBoundingClientRect(); ax = Math.abs(r2.left - r1.left) >= Math.abs(r2.top - r1.top) ? 'x' : 'y'; }
    drag = { it, ax, rev: a.length > 1 && ctr(a[0], ax) > ctr(a[1], ax), id: ev.pointerId };
    bar.classList.add('dragging'); it.classList.add('lifting');
    try { navigator.vibrate && navigator.vibrate(15); } catch (e) {}
    move(ev);
  }
  function move(ev) {
    const it = drag.it, ax = drag.ax, p = ax === 'x' ? ev.clientX : ev.clientY;
    it.style.removeProperty('--lift');
    it.style.transform = '';
    const sib = items().filter(x => x !== it); let before = 0;
    sib.forEach(x => { if (ctr(x, ax) < p) before++; });
    const di = drag.rev ? sib.length - before : before;
    if (sib.length) { const ref = di < sib.length ? sib[di] : sib[sib.length - 1].nextSibling; if (it.nextSibling !== ref && it !== ref) bar.insertBefore(it, ref); }
    const d = p - ctr(it, ax);
    const tf = (ax === 'x' ? 'translateX(' : 'translateY(') + d + 'px) scale(1.15)'; it.style.transform = tf; it.style.setProperty('--lift', tf);
  }
  function end() {
    clearTimeout(timer);
    if (!drag) return;
    const it = drag.it; drag = null;
    it.style.transform = ''; it.style.removeProperty('--lift'); it.classList.remove('lifting'); bar.classList.remove('dragging');
    try { const prev = barOrder(), vis = items().map(x => x.dataset.bk), q = vis.slice(); const full = prev.map(k => vis.includes(k) ? q.shift() : k); vis.forEach(k => { if (!full.includes(k)) full.push(k); }); localStorage.setItem('thabit_bar_order', JSON.stringify(full)); } catch (e) {}
    layoutBar(); swallow = true; setTimeout(() => { swallow = false; }, 400);
  }
  bar.addEventListener('pointerdown', e => {
    const it = e.target.closest && e.target.closest('[data-bk]'); if (!it || it.parentNode !== bar || it.id === 'floatBtnTheme') return;   /* theme button: a plain tap button, can't be lifted or moved */
    sx = e.clientX; sy = e.clientY; clearTimeout(timer); timer = setTimeout(() => begin(it, e), 380);
  });
  document.addEventListener('pointermove', e => { if (drag) { move(e); return; } if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) { clearTimeout(timer); timer = null; } });   // listeners on the document: moving the icon in the DOM must not end the drag
  ['pointerup', 'pointercancel'].forEach(ev => document.addEventListener(ev, end));
  bar.addEventListener('touchmove', e => { if (drag) e.preventDefault(); }, { passive: false });
  bar.addEventListener('contextmenu', e => e.preventDefault());
  bar.addEventListener('click', e => { if (swallow) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
})();

/* ===== Rich text everywhere on the student dashboard =====
   Whatever the admin writes can carry:  **bold**  __italic__  ++underline++  {{gold:colored}}  [[hyperlinked word]]
   Any text node on the page that contains these markers is turned into styled HTML (also text added later).
   A tap on a hyperlinked word opens the same word player as the Words list. */
function rtStrip(s) { return window.ThabitRich ? ThabitRich.strip(s) : String(s == null ? '' : s); }
(function () {
  const R = window.ThabitRich; if (!R) { console.warn('dashboard: richtext.js is not loaded, formatting markers will show as plain text'); return; }
  const HAS = /\[\[[^\[\]\n]+?\]\]|\*\*[\s\S]+?\*\*|__[\s\S]+?__|\+\+[\s\S]+?\+\+|\{\{(?:gold|green|red|blue|purple|orange|gray):[\s\S]+?\}\}/;
  const SKIP = 'script,style,textarea,input,select,option,code,pre,.rt-link';
  function convert(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.nodeValue.length > 3 && HAS.test(n.nodeValue) && !(n.parentElement && n.parentElement.closest(SKIP))) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const hits = []; while (w.nextNode()) hits.push(w.currentNode);
    hits.forEach(n => { const t = document.createElement('template'); t.innerHTML = R.inline(R.esc(n.nodeValue)); n.replaceWith(t.content); });
  }
  const pending = new Set(); let timer = null;
  const mo = new MutationObserver(recs => {
    recs.forEach(r => {
      if (r.type === 'characterData') { if (r.target.parentElement) pending.add(r.target.parentElement); return; }
      r.addedNodes.forEach(n => { if (n.nodeType === 1) pending.add(n); else if (n.nodeType === 3 && n.parentElement) pending.add(n.parentElement); });
    });
    if (pending.size) { clearTimeout(timer); timer = setTimeout(flush, 40); }
  });
  const watch = () => mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  function flush() {
    mo.disconnect();                                   // our own edits must not trigger us again
    try { pending.forEach(el => { if (el.isConnected) convert(el); }); } catch (e) { console.error('[rich text]', e); }
    pending.clear(); watch();
  }
  const start = () => { try { convert(document.body); } catch (e) { console.error('[rich text]', e); } watch(); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);

  /* tap a hyperlinked word -> word player (capture phase, so the feed / modal underneath do not react to the tap) */
  const linkOf = e => e.target && e.target.closest && e.target.closest('#mdl[data-ear="1"] .rt-link[data-word]');
  document.addEventListener('click', e => { const s = linkOf(e); if (!s) return; e.preventDefault(); e.stopPropagation(); wpOpen(s.getAttribute('data-word')); }, true);
  document.addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const s = linkOf(e); if (s) { e.preventDefault(); wpOpen(s.getAttribute('data-word')); } });
})();








/* ==========================================================
   Voice-lit words (paste at the END of dashboard.js)
   Any word / phrase on the dashboard that has a recording in Supabase words_table
   lights up in ONE fixed colour (same in dark and light theme) and plays on tap.
   - scans: Tasks, Dandana, Notes, TEFL, QOL (#lists), the full-text modal (#mB),
     and the Dandana / Notifications cards inside the feed
   - matching = same as the Assistant: wpClean(text) == words_table.word_key
     (longest phrase wins, up to 6 words)
   - words uploaded today or yesterday (Cairo days) get a tiny "press" hint,
     once per page load, when they first scroll into view
   - nothing to maintain: new uploads show up on the next refresh / re-render
     (and the page re-checks by itself every 2 minutes)
   Needs the column words_table.word_key (already used by the Assistant).
   created_at is optional: without it the lighting works, only the hint is skipped.
   ========================================================== */
(function () {
  'use strict';
  var C_QOL = '224,38,138', C_OTH = '31,182,255';   // QOL = pink, every other place = phosphor blue (R,G,B). Fixed in dark and light theme.
  var MAXN = 6, BATCH = 40, PAR = 4, MAXKEYS = 800, TTL_HIT = 600000, TTL_MISS = 120000, HINT_DAYS = 1;
  var ROOTS = '#mdl[data-ear="1"] #mB';
  var SKIP = 'script,style,textarea,input,select,option,code,pre,.cpb,.hnd,.itc,.vx,.rt-link,.aww,.dt,.sm,.tkt,.its,.cd,.cdn,.hi,.nth,.logb,summary,h3,h4,.awn,.billb,.billl';
  var HAS = /\[\[[^\[\]\n]+?\]\]|\*\*[\s\S]+?\*\*|__[\s\S]+?__|\+\+[\s\S]+?\+\+|\{\{(?:gold|green|red|blue|purple|orange|gray):[\s\S]+?\}\}/;   // left for the rich-text converter
  var TOKEN = /[\p{L}\p{M}\p{N}]+(?:['\u2019\-][\p{L}\p{M}\p{N}]+)*/gu;
  var GAP = /^[ \t\u00a0]+$/;

  var cache = {}; try { cache = JSON.parse(sessionStorage.getItem('thabitVoiceLit') || '{}') || {}; } catch (e) { cache = {}; }
  var hasCreated = true, disabled = false, running = false, again = false, hinted = new Set(), io = null, mo = null, timer = null;

  (function () { var s = document.createElement('style'); s.id = 'vxCss'; s.textContent = [
    '.vx{font-weight:600;cursor:pointer;background:none;-webkit-tap-highlight-color:transparent}',
    '.vx.vq{color:rgb(' + C_QOL + ')!important;text-shadow:0 0 8px rgba(' + C_QOL + ',.6)}',
    '.vx.vo{color:rgb(' + C_OTH + ')!important;text-shadow:0 0 8px rgba(' + C_OTH + ',.65)}',
    '.vx.vq.vx-tap{animation:vxTapQ 1.2s ease-out 1}',
    '.vx.vo.vx-tap{animation:vxTapO 1.2s ease-out 1}',
    '@keyframes vxTapQ{0%,100%{text-shadow:0 0 8px rgba(' + C_QOL + ',.6)}22%{text-shadow:0 0 4px rgba(' + C_QOL + ',1),0 0 16px rgba(' + C_QOL + ',1)}}',
    '@keyframes vxTapO{0%,100%{text-shadow:0 0 8px rgba(' + C_OTH + ',.65)}22%{text-shadow:0 0 4px rgba(' + C_OTH + ',1),0 0 16px rgba(' + C_OTH + ',1)}}',
    '@media(prefers-reduced-motion:reduce){.vx.vx-tap{animation:none}}'].join(''); document.head.appendChild(s); })();

  function keyOf(s) { var k = wpClean(s); return k.length >= 2 && !/^\d+$/.test(k) ? k : ''; }
  function fresh(k) { var c = cache[k]; return !!c && Date.now() - c.t < (c.f ? TTL_HIT : TTL_MISS); }
  function save() { try { sessionStorage.setItem('thabitVoiceLit', JSON.stringify(cache)); } catch (e) {} }
  function isNew(ms) {
    if (!ms) return false;
    var d = (Date.parse(itToday()) - Date.parse(cairoDay(new Date(ms).toISOString()))) / 864e5;
    return d >= 0 && d <= HINT_DAYS;
  }

  /* ---------- Supabase lookup: 40 keys per request ---------- */
  function q(keys, withC) {
    var list = keys.map(function (k) { return '"' + k + '"'; }).join(',');
    return fetch(SB + '/rest/v1/words_table?select=' + (withC ? 'word_key,created_at' : 'word_key') + '&audio_url=not.is.null&word_key=in.(' + encodeURIComponent(list) + ')',
      { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  }
  async function one(b) {
    try {
      var r = await q(b, hasCreated);
      if (!r.ok && r.status === 400 && hasCreated) { hasCreated = false; r = await q(b, false); }   // no created_at column: lighting still works
      if (!r.ok) { if (r.status === 400) { disabled = true; console.warn('[voice-lit] words_table.word_key is missing, feature is off'); } return; }
      var rows = await r.json(), now = Date.now(), found = {};
      (Array.isArray(rows) ? rows : []).forEach(function (x) {
        var c = x.created_at ? Date.parse(x.created_at) || 0 : 0;
        if (!found[x.word_key] || (c && c < found[x.word_key].c)) found[x.word_key] = { f: 1, c: c, t: now };
      });
      b.forEach(function (k) { cache[k] = found[k] || { f: 0, c: 0, t: now }; });
    } catch (e) { console.warn('[voice-lit] lookup failed', e); }   // not cached, so it is retried next time
  }
  async function lookup(keys) {
    var bs = []; for (var i = 0; i < keys.length; i += BATCH) bs.push(keys.slice(i, i + BATCH));
    for (var j = 0; j < bs.length; j += PAR) await Promise.all(bs.slice(j, j + PAR).map(one));
  }

  /* ---------- text nodes -> words ---------- */
  function collect() {
    var out = [];
    document.querySelectorAll(ROOTS).forEach(function (root) {
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
        var v = n.nodeValue, p = n.parentElement;
        if (v.length < 2 || !p || !/\p{L}/u.test(v) || HAS.test(v) || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      } });
      while (w.nextNode()) out.push(w.currentNode);
    });
    return out;
  }
  function toks(v) { var a = [], m; TOKEN.lastIndex = 0; while ((m = TOKEN.exec(v))) a.push({ s: m.index, e: m.index + m[0].length }); return a; }
  function gapsOk(v, t, i, n) { for (var j = i + 1; j < i + n; j++) if (!GAP.test(v.slice(t[j - 1].e, t[j].s))) return false; return true; }

  /* QOL = the QOL card in the dashboard, or the full-text modal opened from it (its title says QOL) */
  function isQol(n) {
    var p = n.parentElement; if (!p) return false;
    if (p.closest('#mB')) { var t = document.getElementById('mT'); return !!t && /\bQOL\b/i.test(t.textContent); }
    var c = p.closest('.dcard'), h = c && c.querySelector('h4');
    return !!h && /^QOL$/i.test(h.textContent.trim());
  }
  function apply(nodes) {
    nodes.forEach(function (x) {
      x.q = isQol(x.n);
      if (!x.n.isConnected || x.n.nodeValue !== x.v) return;
      var v = x.v, t = x.t, frag = document.createDocumentFragment(), pos = 0, hit = false, i = 0;
      while (i < t.length) {
        var got = 0;
        for (var n = Math.min(MAXN, t.length - i); n >= 1; n--) {
          if (!gapsOk(v, t, i, n)) continue;
          var s = v.slice(t[i].s, t[i + n - 1].e), k = keyOf(s), c = k && cache[k];
          if (c && c.f) {
            if (t[i].s > pos) frag.appendChild(document.createTextNode(v.slice(pos, t[i].s)));
            var sp = document.createElement('span');
            sp.className = 'vx ' + (x.q ? 'vq' : 'vo') + (isNew(c.c) ? ' vxn' : '');
            sp.setAttribute('data-word', s); sp.setAttribute('data-k', k); sp.setAttribute('role', 'button'); sp.setAttribute('tabindex', '0');
            sp.textContent = s; frag.appendChild(sp);
            pos = t[i + n - 1].e; hit = true; got = n; break;
          }
        }
        i += got || 1;
      }
      if (hit) { if (pos < v.length) frag.appendChild(document.createTextNode(v.slice(pos))); x.n.replaceWith(frag); }
    });
  }

  /* ---------- the tiny "press" hint: once per page load, when the word first scrolls into view ---------- */
  function watchHints() {
    document.querySelectorAll('.vx.vxn:not([data-vo])').forEach(function (el) {
      el.setAttribute('data-vo', '1');
      if (hinted.has(el.getAttribute('data-k'))) return;
      if (!('IntersectionObserver' in window)) { tap(el, 0); return; }
      io = io || new IntersectionObserver(function (ents) {
        var n = 0;
        ents.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); tap(en.target, n++); } });
      }, { threshold: 0.6 });
      io.observe(el);
    });
  }
  function tap(el, idx) {
    var k = el.getAttribute('data-k'); if (hinted.has(k)) return; hinted.add(k);
    setTimeout(function () { el.classList.add('vx-tap'); setTimeout(function () { el.classList.remove('vx-tap'); }, 1400); }, idx * 160);
  }

  /* ---------- run ---------- */
  async function run() {
    if (disabled) return;
    if (running) { again = true; return; }
    running = true;
    try {
      var nodes = collect().map(function (n) { var v = n.nodeValue; return { n: n, v: v, t: toks(v) }; }).filter(function (x) { return x.t.length; });
      var need = {}, cnt = 0;
      nodes.forEach(function (x) {
        for (var i = 0; i < x.t.length; i++) for (var n = 1; n <= MAXN && i + n <= x.t.length; n++) {
          if (!gapsOk(x.v, x.t, i, n)) break;
          var k = keyOf(x.v.slice(x.t[i].s, x.t[i + n - 1].e));
          if (k && !fresh(k) && !need[k] && cnt < MAXKEYS) { need[k] = 1; cnt++; }
        }
      });
      var ks = Object.keys(need);
      if (ks.length) { await lookup(ks); save(); }
      if (disabled) return;
      if (mo) mo.disconnect();                       // our own edits must not trigger us again
      try { apply(nodes); watchHints(); } finally { if (mo) watch(); }
    } catch (e) { console.error('[voice-lit]', e); }
    finally { running = false; if (again) { again = false; schedule(300); } }
  }
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(run, ms == null ? 400 : ms); }   // a bit after the rich-text converter, so [[..]] / ** markers are never split
  function watch() { mo.observe(document.body, { childList: true, subtree: true, characterData: true }); }

  /* tap = play the recording (same player as the Words list) */
  document.addEventListener('click', function (e) {
    var s = e.target && e.target.closest && e.target.closest('.vx'); if (!s) return;
    e.preventDefault(); e.stopPropagation(); wpOpen(s.getAttribute('data-word'));
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var s = e.target && e.target.closest && e.target.closest('.vx'); if (s) { e.preventDefault(); wpOpen(s.getAttribute('data-word')); }
  });

  function start() {
    mo = new MutationObserver(function () { schedule(); });
    watch(); schedule(600);
    setInterval(function () { if (!document.hidden) schedule(0); }, 120000);     // picks up new uploads while the page stays open
    document.addEventListener('visibilitychange', function () { if (!document.hidden) schedule(200); });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();




/* ===== Phone: only the card in the middle band of the screen gets the light sweep ===== */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('lit', e.isIntersecting)), { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
  const seen = new WeakSet(); let t = 0;
  const scan = () => document.querySelectorAll('.thabit-card,.test-card').forEach(c => { if (!seen.has(c)) { seen.add(c); io.observe(c); } });
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 100); }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', scan);
})();

/* ===== Send-request popup (opened from the + button) ===== */
/* ===== Requests: hub (New request / Past requests) -> pop-ups. Nothing is open by default. =====
   History source: RQ_SRC = 'dashboard' reads D.requests (the old requests table, where the admin panel replies today);
   switch to 'reports' to read the new trainee_reports table once the admin panel replies there. */
const RQ_SRC = 'dashboard';
const RQX = {
  en: { title: 'Requests', newB: 'Send a new request', oldB: 'Past requests', newT: 'New request', oldT: 'Past requests', detPh: 'Tell us more…',
        types: { session: 'Session time', financial: 'Financial', other: 'Other' }, send: 'Send', sending: 'Sending…', sent: 'Sent ✓', fail: 'Could not send, try again',
        empty: 'No requests yet', reply: 'Answer', noReply: 'No answer yet', pay: 'Payment date', dur: 'Expected duration',
        st: { open: 'Open', closed: 'Closed', resolved: 'Resolved', rejected: 'Rejected', accepted: 'Accepted' } },
  ar: { title: 'الطلبات', newB: 'إرسال طلب جديد', oldB: 'الطلبات القديمة', newT: 'طلب جديد', oldT: 'الطلبات القديمة', detPh: 'اكتب التفاصيل هنا…',
        types: { session: 'موعد الجلسة', financial: 'مالي', other: 'أخرى' }, send: 'إرسال', sending: 'جاري الإرسال…', sent: 'تم الإرسال ✓', fail: 'تعذر الإرسال، حاول مرة أخرى',
        empty: 'لا توجد طلبات بعد', reply: 'الرد', noReply: 'لا يوجد رد بعد', pay: 'تاريخ الدفع', dur: 'المدة المتوقعة',
        st: { open: 'مفتوح', closed: 'مغلق', resolved: 'تم الحل', rejected: 'مرفوض', accepted: 'مقبول' } },
  eg: { title: 'الطلبات', newB: 'ابعت طلب جديد', oldB: 'الطلبات القديمة', newT: 'طلب جديد', oldT: 'الطلبات القديمة', detPh: 'اكتب التفاصيل هنا…',
        types: { session: 'معاد السيشن', financial: 'مالي', other: 'حاجة تانية' }, send: 'ابعت', sending: 'بيتبعت…', sent: 'اتبعت ✓', fail: 'معرفناش نبعت، جرب تاني',
        empty: 'لسه مفيش طلبات', reply: 'الرد', noReply: 'لسه مفيش رد', pay: 'تاريخ الدفع', dur: 'المدة المتوقعة',
        st: { open: 'مفتوح', closed: 'مقفول', resolved: 'اتحل', rejected: 'مرفوض', accepted: 'مقبول' } }
};
const RQ_ST = { open: ['open', 'opened', 'new', 'pending', 'seen', 'in_progress', 'in progress', 'waiting'], closed: ['closed', 'close'], resolved: ['resolved', 'solved', 'done', 'completed'], rejected: ['rejected', 'declined', 'denied'], accepted: ['accepted', 'agreed', 'agree', 'approved'] };
const rqStatus = v => { const x = String(v == null ? '' : v).trim().toLowerCase(); for (const k in RQ_ST) if (RQ_ST[k].includes(x)) return k; return 'open'; };
const rqDate = v => { if (!v) return ''; const d = new Date(v); if (isNaN(d)) return String(v).slice(0, 10); try { return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return String(v).slice(0, 10); } };
function rqItems() {
  const x = RQX[lang] || RQX.en, raw = RQ_SRC === 'reports' ? ((D && D.reports) || []) : ((D && D.requests) || []);
  const out = raw.map(r => {
    const m = String(r.message || ''), g = k => { const mm = m.match(new RegExp('\\[' + k + '\\]\\s*([\\s\\S]*?)(?=\\n\\[[A-Z ]+\\]|$)')); return mm ? mm[1].trim() : ''; };
    let title = r.title || g('REQUEST') || m.split('\n')[0] || '', details = r.details || g('DETAILS'), follow = '';
    const pay = r.payment_date || g('PAYMENT DATE'), dur = r.expected_duration ? ((RQT[lang] || RQT.en).durs.find(z => z[0] === r.expected_duration) || [0, r.expected_duration])[1] : g('EXPECTED DURATION');
    if (pay) follow = x.pay + ': ' + pay; else if (dur) follow = x.dur + ': ' + dur;
    const reply = String(r.admin_reply || '').trim();
    return { date: r.created_at || r.sent_at || r.inserted_at || r.date || '', type: r.type || r.report_type || '', title, details, follow, st: rqStatus(r.status), reply, rdate: reply ? (r.replied_at || r.reply_date || r.updated_at || '') : '' };
  });
  if (out.every(r => !r.date)) out.reverse(); else out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return out;
}
function rqHistFill() {
  const x = RQX[lang] || RQX.en, items = rqItems(), b = $('rqoList'); if (!b) return;
  b.innerHTML = items.length ? items.map(r => `<div class="rqh"><div class="rqhh"><span class="rqd">${esc(rqDate(r.date))}</span><span class="rqp ${r.st}">${esc(x.st[r.st])}</span></div>`
    + (r.type ? `<span class="rqty">${esc(x.types[r.type] || r.type)}</span>` : '')
    + `<div class="rqt" dir="auto">${esc(r.title)}</div>` + (r.details ? `<div class="rqmm" dir="auto">${esc(r.details)}</div>` : '') + (r.follow ? `<div class="sm" dir="auto">${esc(r.follow)}</div>` : '')
    + `<div class="rqa${r.reply ? '' : ' no'}"><div class="rqal">${esc(x.reply)}${r.reply && r.rdate ? ' · ' + esc(rqDate(r.rdate)) : ''}</div><div dir="auto">${r.reply ? esc(r.reply) : esc(x.noReply)}</div></div></div>`).join('')
    : `<div class="sm" style="text-align:center;padding:22px 0">${esc(x.empty)}</div>`;
}
async function rqRefresh() {
  try {
    if (RQ_SRC === 'reports') { const a = await rpc('trainee_reports', { p_token: tok() }).catch(() => null); if (Array.isArray(a)) D.reports = a; }
    else { const d = await rpc('trainee_dashboard', { p_token: tok() }).catch(() => null); if (d && Array.isArray(d.requests)) D.requests = d.requests; }
  } catch (e) {}
  rqUI();
}
function rqUI() {
  const x = RQX[lang] || RQX.en, t = rqT(), S = (id, v, prop) => { const e = $(id); if (e) e[prop || 'textContent'] = v; };
  S('rqmT', x.title); S('rqBNew', x.newB); S('rqBOld', x.oldB); S('rqnT', x.newT); S('rqoT', x.oldT);
  S('rqLWhat', t.what); S('rqWhat', t.whatPh, 'placeholder'); S('rqLMsg', t.msg); S('rqMsg', x.detPh, 'placeholder');
  const sb = $('rqBtn'); if (sb && !sb.disabled && !sb.classList.contains('ok')) sb.querySelector('span').textContent = x.send;
  document.querySelectorAll('#rqTypes .rqch').forEach(b => { b.querySelector('span').textContent = x.types[b.dataset.t]; });
  const n = rqItems().filter(r => r.st === 'open').length, c = $('rqBCnt'); if (c) { c.textContent = n; c.hidden = !n; }
  const f = $('rqFollow'); if (f && f.dataset.lang !== lang) { f.dataset.lang = lang; rqFollowUI(false); }   // only a language change rebuilds the follow-up question (never while the student is typing)
  if ($('rqo') && $('rqo').classList.contains('open')) rqHistFill();
}
function rqBuild() {
  const m = $('rqm'); if (!m || m.dataset.nb) return; m.dataset.nb = '1';
  m.innerHTML = `<div class="ssbox rqs"><div class="ssh"><b id="rqmT"></b><button type="button" onclick="closeRq()" aria-label="Close">&times;</button></div><div class="rqhb">`
    + `<button type="button" class="rqbig" onclick="openRqNew()"><i class="fa-solid fa-paper-plane"></i><span id="rqBNew"></span></button>`
    + `<button type="button" class="rqbig alt" onclick="openRqHist()"><i class="fa-solid fa-clock-rotate-left"></i><span id="rqBOld"></span><em id="rqBCnt" hidden></em></button></div></div>`;
  const n = document.createElement('div'); n.className = 'ssm rqov'; n.id = 'rqn'; n.onclick = e => { if (e.target === n) closeRq(); };
  n.innerHTML = `<div class="ssbox rqs" id="rqsheet"><div class="ssh"><button type="button" class="rqback" onclick="rqBack()" aria-label="Back"><i class="fa-solid fa-chevron-left"></i></button><b id="rqnT"></b><button type="button" onclick="closeRq()" aria-label="Close">&times;</button></div>`
    + `<div id="rqTypes" class="rqtypes"><button type="button" class="rqch on" data-t="session"><i class="fa-regular fa-calendar"></i><span></span></button><button type="button" class="rqch" data-t="financial"><i class="fa-solid fa-wallet"></i><span></span></button><button type="button" class="rqch" data-t="other"><i class="fa-solid fa-ellipsis"></i><span></span></button></div>`
    + `<input type="hidden" id="rqType" value="session"><label class="rql" id="rqLWhat"></label><input type="text" id="rqWhat" maxlength="140" autocomplete="off"><label class="rql" id="rqLMsg"></label><textarea id="rqMsg" rows="4" maxlength="1500"></textarea>`
    + `<div id="rqFollow"></div><div id="rqErr" class="rqerr" hidden></div><button type="button" class="rqsend" id="rqBtn" onclick="sendReq()"><i class="fa-solid fa-paper-plane"></i><span></span></button></div>`;
  const o = document.createElement('div'); o.className = 'ssm rqov'; o.id = 'rqo'; o.onclick = e => { if (e.target === o) closeRq(); };
  o.innerHTML = `<div class="ssbox rqs"><div class="ssh"><button type="button" class="rqback" onclick="rqBack()" aria-label="Back"><i class="fa-solid fa-chevron-left"></i></button><b id="rqoT"></b><button type="button" onclick="closeRq()" aria-label="Close">&times;</button></div><div class="sslist" id="rqoList"></div></div>`;
  m.after(n); n.after(o);
  n.addEventListener('click', e => {
    const c = e.target.closest && e.target.closest('.rqch'), d = e.target.closest && e.target.closest('.rqdc');
    if (c) { $('rqType').value = c.dataset.t; n.querySelectorAll('.rqch').forEach(b => b.classList.toggle('on', b === c)); $('rqErr').hidden = true; rqFollowUI(true); }
    if (d) { $('rqFollowVal').value = d.dataset.v; n.querySelectorAll('.rqdc').forEach(b => b.classList.toggle('on', b === d)); $('rqErr').hidden = true; }
  });
  rqUI(); rqFollowUI(true);
}
(function () { const st = document.createElement('style'); st.textContent = `
#rqm .ssbox,.rqov .ssbox{width:min(440px,100%)}
.rqs{animation:rqIn .35s cubic-bezier(.16,1,.3,1);overflow:auto}
@keyframes rqIn{from{opacity:0;transform:translateY(18px) scale(.95)}to{opacity:1;transform:none}}
.rqs .ssh b{flex:1;text-align:start}
.rqs .ssh{gap:8px}
.rqback{flex:none}html[dir=rtl] .rqback i{transform:scaleX(-1)}
.rqhb{display:flex;flex-direction:column;gap:10px;margin-top:6px}
.rqbig{display:flex;align-items:center;gap:12px;width:100%;padding:16px 18px;border-radius:18px;border:0;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#111;font:800 .95rem Inter,Cairo,sans-serif;cursor:pointer;text-align:start;box-shadow:0 8px 22px rgba(245,158,11,.25);transition:transform .15s,box-shadow .2s;-webkit-tap-highlight-color:transparent}
.rqbig i{font-size:1.15rem;flex:none}.rqbig span{flex:1}
.rqbig:active{transform:scale(.97)}
.rqbig.alt{background:rgba(148,163,184,.12);color:inherit;border:1px solid rgba(148,163,184,.4);box-shadow:none}
.rqbig em{font-style:normal;min-width:22px;padding:1px 8px;border-radius:999px;background:#fbbf24;color:#111;font-size:.75rem;font-weight:800;text-align:center}
.rqtypes{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 10px}
.rqch{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:999px;border:1px solid rgba(148,163,184,.45);background:rgba(148,163,184,.1);color:inherit;font:700 .8rem Inter,Cairo,sans-serif;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .15s}
.rqch:active{transform:scale(.95)}
.rqch.on{background:#fbbf24;border-color:#fbbf24;color:#111}
#rqn .rql{display:block;margin:12px 2px 6px;font-size:.74rem;font-weight:700;letter-spacing:.3px;opacity:.8}
.rqreq{color:#f87171}
#rqn input[type=text],#rqn input[type=date],#rqn textarea{display:block;width:100%;box-sizing:border-box;margin:0;padding:12px 14px;border-radius:14px;border:1px solid var(--th-input-border,rgba(148,163,184,.4));background:var(--th-input-bg,rgba(148,163,184,.1));color:var(--text-color,inherit);font:500 .9rem Inter,Cairo,sans-serif;outline:0;transition:border-color .2s,box-shadow .2s;resize:vertical}
#rqn input:focus,#rqn textarea:focus{border-color:#fbbf24;box-shadow:0 0 0 3px rgba(251,191,36,.2)}
body.light-theme #rqn input[type=text],body.light-theme #rqn input[type=date],body.light-theme #rqn textarea{background:#fff;color:#0f172a}
#rqn ::placeholder{opacity:.45}
.rqdur{display:flex;gap:7px;flex-wrap:wrap}
.rqdc{padding:7px 12px;border-radius:999px;border:1px solid rgba(148,163,184,.45);background:rgba(148,163,184,.1);color:inherit;font:600 .76rem Inter,Cairo,sans-serif;cursor:pointer;transition:background .2s,color .2s}
.rqdc.on{background:rgba(251,191,36,.2);border-color:#fbbf24;color:#fbbf24}
body.light-theme .rqdc.on{color:#92400e}
.rqfi{animation:rqFade .3s ease-out}
@keyframes rqFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.rqerr{margin-top:12px;padding:8px 12px;border-radius:12px;background:rgba(244,63,94,.12);border:1px solid rgba(244,63,94,.4);color:#fb7185;font-size:.8rem;font-weight:600}
.rqs.shk{animation:rqShk .4s}
@keyframes rqShk{0%,100%{transform:none}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
.rqsend{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;margin-top:16px;padding:14px;border-radius:16px;border:0;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#111;font:800 .95rem Inter,Cairo,sans-serif;cursor:pointer;box-shadow:0 8px 22px rgba(245,158,11,.28);transition:transform .15s,background .3s,box-shadow .2s}
.rqsend:active{transform:scale(.97)}
.rqsend.busy{opacity:.75;cursor:wait}.rqsend.busy i{animation:rqFly 1s ease-in-out infinite}
.rqsend.ok{background:linear-gradient(135deg,#34d399,#10b981);color:#04231a;box-shadow:0 8px 22px rgba(16,185,129,.3)}
@keyframes rqFly{50%{transform:translate(4px,-4px) rotate(-12deg)}}
.rqh{padding:12px 14px;border-radius:16px;border:1px solid rgba(148,163,184,.25);background:rgba(148,163,184,.08)}
.rqhh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.rqd{font-size:.74rem;opacity:.7;font-weight:600}
.rqp{font-size:.7rem;font-weight:800;padding:2px 10px;border-radius:999px;border:1px solid currentColor}
.rqp.open{color:#fbbf24}.rqp.closed{color:#94a3b8}.rqp.resolved{color:#34d399}.rqp.rejected{color:#fb7185}.rqp.accepted{color:#38bdf8}
body.light-theme .rqp.open{color:#b45309}body.light-theme .rqp.resolved{color:#047857}body.light-theme .rqp.accepted{color:#0369a1}
.rqty{display:inline-block;margin-bottom:4px;font-size:.68rem;font-weight:700;padding:1px 9px;border-radius:999px;background:rgba(148,163,184,.2)}
.rqt{font-weight:700;font-size:.92rem;overflow-wrap:anywhere}
.rqmm{margin-top:3px;font-size:.84rem;opacity:.85;overflow-wrap:anywhere;white-space:pre-wrap}
.rqa{margin-top:10px;padding:9px 12px;border-radius:12px;background:rgba(52,211,153,.1);border-inline-start:3px solid #34d399;font-size:.85rem;overflow-wrap:anywhere}
.rqa.no{background:rgba(148,163,184,.08);border-inline-start-color:rgba(148,163,184,.4);opacity:.7}
.rqal{font-size:.68rem;font-weight:800;letter-spacing:.4px;text-transform:uppercase;opacity:.75;margin-bottom:2px}
@media(prefers-reduced-motion:reduce){.rqs,.rqfi,.rqs.shk,.rqsend.busy i{animation:none}}`; document.head.appendChild(st); })();
function openRq() { rqBuild(); closeRq(); rqUI(); const m = $('rqm'); if (m) m.classList.add('open'); }
function closeRq() { ['rqm', 'rqn', 'rqo'].forEach(id => { const e = $(id); if (e) e.classList.remove('open'); }); }
function openRqNew() { closeRq(); rqUI(); $('rqErr').hidden = true; $('rqn').classList.add('open'); }
function openRqHist() { closeRq(); rqHistFill(); $('rqo').classList.add('open'); rqRefresh(); }
function rqBack() { openRq(); }
window.openRq = openRq; window.closeRq = closeRq; window.openRqNew = openRqNew; window.openRqHist = openRqHist; window.rqBack = rqBack;
rqBuild();
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeRq(); });

/* ===== Touch = scroll. A finger that moves is a scroll, never a click: only a real tap or a long press (finger stays still) can act ===== */
(function () {
  let sx = 0, sy = 0, moved = false;
  document.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; moved = false; }, { passive: true, capture: true });
  document.addEventListener('touchmove', e => { if (moved) return; const t = e.touches[0]; if (Math.abs(t.clientX - sx) > 8 || Math.abs(t.clientY - sy) > 8) moved = true; }, { passive: true, capture: true });
  document.addEventListener('click', e => { if (moved && e.isTrusted) { e.stopImmediatePropagation(); e.preventDefault(); } moved = false; }, true);
})();


/* ===== Pop-out buttons: the pressed button stays visible (above the blur); labels flip to the roomy side so nothing is cut at the screen edge ===== */
(function () { const st = document.createElement('style'); st.textContent = `
/* focus mode: the page + the rest of the bar sit under the blur; only the pressed button (a copy) flies out above it */
#mobileFloatingBar .pk-hide{visibility:hidden}
.pkfly{position:fixed;z-index:3;box-sizing:border-box;display:flex;align-items:center;justify-content:center;margin:0;padding:0;cursor:pointer;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);will-change:transform}
.pkfly svg{transition:transform .55s cubic-bezier(.34,1.5,.5,1)}
.pkfly.rot svg{transform:rotate(225deg)}
/* the parked tabs (assistant / profile) follow the bar: hidden with it, back with it */
#dock .aswrap{transition:opacity .3s,visibility 0s}
html.bar-hid #dock .aswrap{opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s,visibility 0s .3s}
.lgp[data-lab="l"] .lgl{left:auto!important;right:calc(100% + 8px)!important;top:50%!important;transform:translateY(-50%)!important}
.lgp[data-lab="r"] .lgl{left:calc(100% + 8px)!important;right:auto!important;top:50%!important;transform:translateY(-50%)!important}
.lgl{max-width:calc(100vw - 96px);overflow:hidden;text-overflow:ellipsis}
/* parked tab: small, long-press + drag to the left or right edge */
:root{--dk:44px}
@media(max-width:600px){:root{--dk:36px}}
.aswrap.dkw{position:fixed;z-index:61;width:var(--dk);height:var(--dk);touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.aswrap.dkw.sr{right:14px;left:auto}
.aswrap.dkw.sl{left:14px;right:auto}
.aswrap.dkw.dragging{transition:none;z-index:70}
.aswrap.dkw .dk{width:100%;height:100%;padding:0;border:0;border-radius:50%;color:#111;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.4);font-size:calc(var(--dk) * .42);transition:transform .2s}
.aswrap.dkw .dk .asv{width:calc(var(--dk) * .5);height:calc(var(--dk) * .5)}
.aswrap.dkw .dk.shk{animation:asShk .9s ease-in-out 2}
.aswrap.dkw.dragging .dk{transform:scale(1.12);box-shadow:0 8px 22px rgba(0,0,0,.55)}
.aswrap.dkw .dkx{top:-6px;right:-6px;width:18px;height:18px;font-size:13px}
.aswrap.dkw.sl .dkx{right:auto;left:-6px}
.aswrap.sr .asn{left:auto!important;right:calc(100% + 10px)!important}
.aswrap.sl .asn{right:auto!important;left:calc(100% + 10px)!important}
.aswrap.sl .asn::after{inset-inline-end:auto;right:auto;left:-5px}
@media(max-width:600px){
 .aswrap.sr .asn{left:auto!important;right:0!important;top:auto!important;bottom:calc(100% + 12px)!important}
 .aswrap.sl .asn{right:auto!important;left:0!important;top:auto!important;bottom:calc(100% + 12px)!important}
 .aswrap.sr .asn::after{top:auto;bottom:-5px;left:auto;right:14px;inset-inline-end:auto}
 .aswrap.sl .asn::after{top:auto;bottom:-5px;right:auto;left:14px}
}
/* Feed button: the plus turns when there is an important update (instead of a pop-up) */
.feed.upd .fdp{animation:fdTurn 1.5s cubic-bezier(.4,0,.2,1) 3}
@keyframes fdTurn{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(1.25)}100%{transform:rotate(360deg) scale(1)}}
@media(prefers-reduced-motion:reduce){.feed.upd .fdp{animation:none}}`; document.head.appendChild(st); })();

const DK_KEY = 'thabit_dock_pos';
const dkAll = () => { try { return JSON.parse(localStorage.getItem(DK_KEY) || '{}') || {}; } catch (e) { return {}; } };
const dkSide = id => (dkAll()[id] && dkAll()[id].s === 'l') ? 'sl' : 'sr';
const dkSize = () => (matchMedia('(max-width:600px)').matches ? 36 : 44);
function dkStyle(id, ix) {
  const o = dkAll()[id], size = dkSize(), def = (matchMedia('(max-width:600px)').matches ? 84 : 92) + ix * (size + 10);
  const b = o && typeof o.b === 'number' ? Math.max(8, Math.min(innerHeight - size - 8, o.b)) : def;
  return 'bottom:' + b + 'px';
}
function dkDrag() {
  document.querySelectorAll('#dock .aswrap.dkw').forEach(w => {
    if (w.dataset.dg) return; w.dataset.dg = '1';
    let timer = null, st = null, moved = false, swallow = false;
    const begin = e => { st.on = true; w.classList.add('dragging'); try { w.setPointerCapture(e.pointerId); } catch (x) {} try { navigator.vibrate && navigator.vibrate(12); } catch (x) {} };
    w.addEventListener('pointerdown', e => {
      if (e.target.closest('.dkx, .asn')) return;
      const r = w.getBoundingClientRect(); st = { x: e.clientX, y: e.clientY, l: r.left, t: r.top, on: false }; moved = false;
      clearTimeout(timer); timer = setTimeout(() => begin(e), 380);
    });
    w.addEventListener('pointermove', e => {
      if (!st) return;
      if (!st.on) { if (Math.hypot(e.clientX - st.x, e.clientY - st.y) > 8) { clearTimeout(timer); st = null; } return; }
      moved = true; const size = w.offsetWidth;
      const l = Math.max(4, Math.min(innerWidth - size - 4, st.l + e.clientX - st.x)), t = Math.max(4, Math.min(innerHeight - size - 4, st.t + e.clientY - st.y));
      w.style.left = l + 'px'; w.style.right = 'auto'; w.style.bottom = 'auto'; w.style.top = t + 'px';
    });
    const end = () => {
      clearTimeout(timer); if (!st) return;
      const on = st.on; st = null; if (!on) return;
      const r = w.getBoundingClientRect(), side = (r.left + r.width / 2) < innerWidth / 2 ? 'l' : 'r', b = Math.max(8, innerHeight - r.bottom);
      w.classList.remove('dragging', 'sl', 'sr'); w.classList.add(side === 'l' ? 'sl' : 'sr');
      w.style.left = ''; w.style.right = ''; w.style.top = ''; w.style.bottom = b + 'px';
      const all = dkAll(); all[w.dataset.id] = { s: side, b }; try { localStorage.setItem(DK_KEY, JSON.stringify(all)); } catch (x) {}
      swallow = moved; setTimeout(() => { swallow = false; }, 350);
    };
    w.addEventListener('pointerup', end); w.addEventListener('pointercancel', end);
    w.addEventListener('touchmove', e => { if (st && st.on) e.preventDefault(); }, { passive: false });
    w.addEventListener('contextmenu', e => e.preventDefault());
    w.addEventListener('click', e => { if (swallow) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  });
}
window.addEventListener('resize', () => document.querySelectorAll('#dock .aswrap.dkw').forEach(w => { const o = dkAll()[w.dataset.id]; if (o && typeof o.b === 'number') w.style.bottom = Math.max(8, Math.min(innerHeight - w.offsetHeight - 8, o.b)) + 'px'; }));


/* ===== First-time tour for the bar buttons: a hand-drawn green arrow points at each option, one by one ===== */
const TOUR_KEY = 'thabit_tour', TOUR_DAYS = 4;
const tourGet = () => { try { return JSON.parse(localStorage.getItem(TOUR_KEY) || '{}') || {}; } catch (e) { return {}; } };
const tourSet = o => { try { localStorage.setItem(TOUR_KEY, JSON.stringify(o)); } catch (e) {} };
/* shown on every open for 4 days (counted from the first time), until the student taps "Got it" */
function tourWanted(key) {
  if (VIEW || !key) return false;
  const r = tourGet()[key] || {};
  return !r.done && (!r.first || Date.now() - r.first < TOUR_DAYS * 864e5);
}
const TOURX = {
  en: { ok: "Got it, don't show again", end: 'That is all. Tap an icon to use it.' },
  ar: { ok: 'فهمت، لا تعرض التوضيح مرة أخرى', end: 'هذا كل شيء. اضغط على أي أيقونة لاستخدامها.' },
  eg: { ok: 'فهمت، متعرضش تاني', end: 'ده كل حاجة. دوس على أي أيقونة عشان تستخدمها.' }
};
function tourTips(key, side) {
  const t3 = (a, b, c) => lang === 'en' ? a : (lang === 'ar' ? b : c);
  if (key === 'lang') {
    const L = { en: t3('Switch the site to English', 'تحويل الموقع إلى الإنجليزية', 'حوّل الموقع للإنجليزي'), ar: t3('Switch to formal Arabic', 'تحويل الموقع إلى العربية الفصحى', 'حوّل الموقع للعربي الفصحى'), eg: t3('Switch to Egyptian Arabic', 'تحويل الموقع إلى اللهجة المصرية', 'حوّل الموقع للمصري') };
    return ['en', 'ar', 'eg'].filter(x => x !== lang).map(x => L[x]);
  }
  if (key === 'prof') return [t3('Your profile: your info, and you can change your picture', 'ملفك الشخصي: بياناتك، ويمكنك تغيير صورتك', 'ملفك الشخصي: بياناتك، وتقدر تغيّر صورتك'), t3('Log out of your account', 'تسجيل الخروج من حسابك', 'اطلع من حسابك')];
  if (key === 'plus') return [t3('The Assistant: listen to words and send what you are missing', 'المساعد: استمع إلى الكلمات وأرسل ما ينقصك', 'المساعد: تسمع منه الكلمات وتبعتله اللي ناقصك'), t3('Requests: send a new request to your trainer, or see your past requests and the answers', 'الطلبات: أرسل طلبًا جديدًا إلى المدرب، أو شاهد طلباتك القديمة وردودها', 'الطلبات: ابعت طلب جديد للمدرب، أو شوف طلباتك القديمة وردودها')];
  if (key === 'star') return [t3('Customize: move the bar to the left, right, bottom or anywhere you like', 'تخصيص: انقل الشريط لليسار أو اليمين أو الأسفل أو أي مكان تريده', 'تخصيص: انقل الشريط شمال أو يمين أو تحت أو أي مكان تحبه'), t3('View: phone / desktop view, text and icon size, and brightness', 'العرض: شكل التليفون أو الديسكتوب، وحجم الأيقونات والخطوط، والسطوع', 'العرض: شكل التليفون أو الديسكتوب، وحجم الأيقونات والخط، والسطوع')];
  if (key === 'view') { const wide = innerWidth > 700; return [wide ? t3('Phone view: shows the site the way it looks on a phone', 'شكل التليفون: يعرض الموقع كما يظهر على الهاتف', 'شكل التليفون: بيعرض الموقع زي ما بيبان على التليفون') : t3('Desktop view: shows the full desktop layout (the bar stays big)', 'شكل الديسكتوب: يعرض التصميم الكامل للكمبيوتر (ويبقى الشريط كبيرًا)', 'شكل الديسكتوب: بيعرض التصميم الكامل بتاع الكمبيوتر (والشريط بيفضل كبير)'), t3('Text & icon size: make everything bigger or smaller and watch it live', 'حجم الأيقونات والخطوط: كبّر كل شيء أو صغّره وشاهد النتيجة مباشرة', 'حجم الأيقونات والخط: كبّر أو صغّر كل حاجة وشوف النتيجة على طول'), t3('Brightness of this app only (not your phone)', 'سطوع هذا التطبيق فقط (وليس هاتفك)', 'سطوع التطبيق ده بس (مش سطوع تليفونك)'), t3('Language: switch the site language', 'اللغة: تغيير لغة الموقع', 'اللغة: غيّر لغة الموقع')]; }
  if (key === 'cust') return [side === 'right' ? t3('Move the bar to the left side', 'نقل الشريط إلى اليسار', 'انقل الشريط للشمال') : t3('Move the bar to the right side', 'نقل الشريط إلى اليمين', 'انقل الشريط لليمين'), t3('Move the bar to the bottom', 'نقل الشريط إلى الأسفل', 'نزّل الشريط تحت'), t3('Free move: drag the bar anywhere, let go to pin it', 'تحريك حر: اسحب الشريط إلى أي مكان ثم اتركه ليتثبت', 'تحريك حر: اسحب الشريط لأي مكان وسيبه يتثبت')];
  return null;
}
(function () { const st = document.createElement('style'); st.textContent = `
.tour{position:fixed;inset:0;z-index:10040;pointer-events:none}
.tour .tsv{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.tour path{fill:none;stroke:#34d399;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;opacity:0;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}
.tour path.go{opacity:1;animation:tDraw .4s ease-out forwards}
@keyframes tDraw{to{stroke-dashoffset:0}}
.tbub{position:absolute;box-sizing:border-box;padding:9px 11px;border-radius:14px;background:#0f172a;color:#f1f5f9;border:1px solid rgba(255,255,255,.22);box-shadow:0 10px 28px rgba(0,0,0,.5);font-size:.8rem;line-height:1.45;opacity:0;transition:opacity .25s}
body.light-theme .tbub{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}
.tbub .tt{font-weight:600}
.tbub .tok{pointer-events:auto;margin-top:8px;padding:5px 12px;border-radius:999px;border:1px solid rgba(52,211,153,.6);background:rgba(52,211,153,.16);color:#34d399;font:700 .74rem Inter,Cairo,sans-serif;cursor:pointer}
body.light-theme .tbub .tok{color:#047857}
@media(prefers-reduced-motion:reduce){.tour path.go{animation:none;stroke-dashoffset:0}}`; document.head.appendChild(st); })();

var TOUR = null;   // var: closeLang() can run (bar hidden at load) before this line
function tourStop() {
  if (!TOUR) return; const T = TOUR; TOUR = null;
  T.dead = true; clearTimeout(T.t); document.removeEventListener('pointerdown', T.onDown, true); T.root.remove();
}
/* every tip sits right beside its own button, joined by a plain line (no arrow head). Tips appear one after another and ALL stay until the trainee
   taps an empty part of the screen (back next time) or taps "Got it" (never again). */
function tourStart(key, pts, side, avoid) {
  tourStop();
  if (!tourWanted(key) || !pts || !pts.length) return;
  const tips = tourTips(key, side); if (!tips || !tips.length) return;
  const n = Math.min(tips.length, pts.length);
  const sv = tourGet(); sv[key] = sv[key] || {}; if (!sv[key].first) { sv[key].first = Date.now(); tourSet(sv); }
  const X = TOURX[lang] || TOURX.en, root = document.createElement('div'); root.className = 'tour';
  root.innerHTML = '<svg class="tsv" aria-hidden="true"></svg>';
  document.body.appendChild(root);
  const svg = root.querySelector('.tsv'), NS = 'http://www.w3.org/2000/svg';
  const T = TOUR = { root, t: null, dead: false, onDown: null };
  T.onDown = e => { if (e.target.closest && e.target.closest('.tok')) return; tourStop(); };
  document.addEventListener('pointerdown', T.onDown, true);
  const K = thK(), vw = innerWidth, vh = innerHeight, W = Math.min(210 * K, vw - 24), R = 23 * K, GAP = 16 * K, barR = $('mobileFloatingBar').getBoundingClientRect();
  const order = (side === 'bottom' || side === 'top') ? ['left', 'right', 'up', 'down'] : ['up', 'down', 'left', 'right'];
  const circles = pts.map(c => [c[0], c[1], R + 4 * K]).concat(avoid || []), placed = [];
  const hitCircle = (l, t, h, c) => { const nx = Math.min(l + W, Math.max(l, c[0])), ny = Math.min(t + h, Math.max(t, c[1])); return Math.hypot(nx - c[0], ny - c[1]) < c[2]; };
  const hitBar = (l, t, h) => l < barR.right + 6 && l + W > barR.left - 6 && t < barR.bottom + 6 && t + h > barR.top - 6;
  const hitPlaced = (l, t, h) => placed.some(p => l < p.r + 6 && l + W > p.l - 6 && t < p.b + 6 && t + h > p.t - 6);
  function spot(i, h) {
    const [x, y] = pts[i];
    for (const d of order) {
      let l, t;
      if (d === 'left') { l = x - R - GAP - W; t = y - h / 2; if (l < 8) continue; }
      else if (d === 'right') { l = x + R + GAP; t = y - h / 2; if (l + W > vw - 8) continue; }
      else if (d === 'up') { l = x - W / 2; t = y - R - GAP - h; if (t < 8) continue; }
      else { l = x - W / 2; t = y + R + GAP; if (t + h > vh - 8) continue; }
      l = Math.min(vw - 8 - W, Math.max(8, l)); t = Math.min(vh - 8 - h, Math.max(8, t));
      if (hitBar(l, t, h) || hitPlaced(l, t, h) || circles.some(c => hitCircle(l, t, h, c))) continue;
      return { l, t };
    }
    return { l: Math.max(8, (vw - W) / 2), t: Math.min(vh - 8 - h, Math.max(8, vh * .12 + i * (h + 10))) };   // no free spot beside it: top of the screen
  }
  function line(box, h, x, y) {
    const ax = Math.min(box.l + W, Math.max(box.l, x)), ay = Math.min(box.t + h, Math.max(box.t, y)), dx = x - ax, dy = y - ay, len = Math.hypot(dx, dy);
    if (len < R + 4) return null;
    return `M${ax / K},${ay / K} L${(x - dx / len * (R + 2)) / K},${(y - dy / len * (R + 2)) / K}`;
  }
  function show(i, last) {
    if (T.dead) return;
    const bub = document.createElement('div'); bub.className = 'tbub'; bub.style.width = W / K + 'px';
    bub.innerHTML = `<div class="tt" dir="auto">${esc(tips[i])}</div>` + (last ? `<button type="button" class="tok">${esc(X.ok)}</button>` : '');
    root.appendChild(bub);
    const h = bub.getBoundingClientRect().height, box = spot(i, h); placed.push({ l: box.l, t: box.t, r: box.l + W, b: box.t + h });
    bub.style.left = box.l / K + 'px'; bub.style.top = box.t / K + 'px'; void bub.offsetWidth; bub.style.opacity = 1;
    const d = line(box, h, pts[i][0], pts[i][1]);
    if (d) { const p = document.createElementNS(NS, 'path'); p.setAttribute('pathLength', '1'); p.setAttribute('d', d); svg.appendChild(p); void p.getBoundingClientRect(); p.classList.add('go'); }
    if (last) bub.querySelector('.tok').onclick = e => { e.stopPropagation(); const o = tourGet(); o[key] = o[key] || {}; o[key].done = 1; tourSet(o); tourStop(); };
  }
  let i = 0;
  const next = () => { if (T.dead) return; show(i, i === n - 1); i++; if (i < n) T.t = setTimeout(next, 1100); };
  T.t = setTimeout(next, 900);
}

/* ===== View options: text & icon size + brightness of THIS app (not the phone's). Live preview, saved on this device. ===== */
const UI_KEY = 'thabit_ui', UI_DEF = { zoom: 1, bri: 1 };
const UIT = {
  en: { zoom: 'Text & icon size', bri: 'Brightness', save: 'Save', discard: 'Discard', def: 'Back to default', saved: 'Saved ✓', reset: 'Back to default ✓' },
  ar: { zoom: 'حجم الأيقونات والخطوط', bri: 'السطوع', save: 'حفظ', discard: 'تجاهل', def: 'الافتراضي', saved: 'تم الحفظ ✓', reset: 'تمت العودة للافتراضي ✓' },
  eg: { zoom: 'حجم الأيقونات والخط', bri: 'السطوع', save: 'حفظ', discard: 'تجاهل', def: 'الافتراضي', saved: 'اتحفظ ✓', reset: 'رجعنا للافتراضي ✓' }
};
const uiGet = () => { try { const o = JSON.parse(localStorage.getItem(UI_KEY) || 'null') || {}; return { zoom: isFinite(o.zoom) ? +o.zoom : 1, bri: 1 }; } catch (e) { return Object.assign({}, UI_DEF); } };
function uiApply(o) {
  document.documentElement.style.setProperty('--ui-zoom', o.zoom);
  let v = $('thBri'); if (!v) { v = document.createElement('div'); v.id = 'thBri'; document.body.appendChild(v); }
  if (o.bri < 1) { v.style.background = '#000'; v.style.mixBlendMode = 'normal'; v.style.opacity = String(Math.min(.8, 1 - o.bri)); }
  else if (o.bri > 1) { v.style.background = '#fff'; v.style.mixBlendMode = 'soft-light'; v.style.opacity = String(Math.min(1, (o.bri - 1) * 1.6)); }
  else v.style.opacity = '0';
}
(function () { const st = document.createElement('style'); st.textContent = `
.wrap{zoom:var(--ui-zoom,1)}
#thBri{position:fixed;inset:0;z-index:10050;pointer-events:none;opacity:0}
html[data-dv] #mobileFloatingBar,html[data-dv] #thGhost,html[data-dv] #langPop,html[data-dv] #thAdj,html[data-dv] .tour{zoom:var(--bk)}
html[data-dv] #mobileFloatingBar{max-width:calc((100vw - 28px)/var(--bk))!important}
.lgi.sel{border-color:#34d399}
.lgi.out{animation:lgOut .2s cubic-bezier(.4,0,1,1) forwards!important;animation-delay:0s!important;pointer-events:none}
html.adj-on #langPop,html.adj-on #mobileFloatingBar,html.adj-on #thGhost,html.adj-on #dock .aswrap{visibility:hidden!important;pointer-events:none}
#thAdj{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);transform:translateX(-50%);z-index:10060;width:min(92vw,400px);box-sizing:border-box;padding:14px 16px;border-radius:20px;background:rgba(15,23,42,.94);color:#f1f5f9;border:1px solid rgba(255,255,255,.2);box-shadow:0 14px 40px rgba(0,0,0,.55);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);font:600 .85rem Inter,Cairo,sans-serif}
body.light-theme #thAdj{background:rgba(255,255,255,.95);color:#0f172a;border-color:rgba(15,23,42,.18)}
#thAdj[hidden]{display:none}
#thAdj .adjt{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
#thAdj .adjv{color:#34d399;font-weight:800}
#thAdj input[type=range]{width:100%;margin:6px 0 2px;touch-action:pan-x;accent-color:#34d399;height:28px}
#thAdj .adjb{display:flex;gap:8px;margin-top:12px;animation:lgpIn .3s ease-out both}
#thAdj .adjb[hidden]{display:none}
#thAdj .adjb button{flex:1;padding:9px 6px;border-radius:12px;border:1px solid rgba(148,163,184,.45);background:rgba(148,163,184,.14);color:inherit;font:700 .76rem Inter,Cairo,sans-serif;cursor:pointer}
#thAdj .adjb button[data-a=save]{background:#34d399;border-color:#34d399;color:#04231a}`; document.head.appendChild(st); })();
let ADJ = null;
function startAdjust(kind) {
  const U = UIT[lang] || UIT.en; tourStop();
  let p = $('thAdj');
  if (!p) {
    p = document.createElement('div'); p.id = 'thAdj'; p.hidden = true;
    p.innerHTML = '<div class="adjt"><span class="adjl"></span><span class="adjv"></span></div><input type="range" class="adjr"><div class="adjb" hidden><button type="button" data-a="discard"></button><button type="button" data-a="def"></button><button type="button" data-a="save"></button></div>';
    document.body.appendChild(p);
    const r = p.querySelector('.adjr'), show = () => { if (ADJ) p.querySelector('.adjb').hidden = false; };
    r.addEventListener('input', () => { if (!ADJ) return; ADJ.cur[ADJ.kind] = +r.value; uiApply(ADJ.cur); p.querySelector('.adjv').textContent = Math.round(r.value * 100) + '%'; });
    r.addEventListener('change', show); r.addEventListener('pointerup', show); r.addEventListener('touchend', show);
    p.querySelectorAll('.adjb button').forEach(b => b.onclick = e => { e.stopPropagation(); endAdjust(b.dataset.a); });
  }
  ADJ = { kind, base: uiGet(), cur: uiGet() };
  const r = p.querySelector('.adjr'), cfg = kind === 'zoom' ? { min: .8, max: 1.4 } : { min: .6, max: 1.4 };
  r.min = cfg.min; r.max = cfg.max; r.step = .05; r.value = ADJ.cur[kind];
  p.querySelector('.adjl').textContent = U[kind]; p.querySelector('.adjv').textContent = Math.round(ADJ.cur[kind] * 100) + '%';
  const bb = p.querySelector('.adjb'); bb.hidden = true;
  p.querySelector('[data-a=discard]').textContent = U.discard; p.querySelector('[data-a=def]').textContent = U.def; p.querySelector('[data-a=save]').textContent = U.save;
  p.hidden = false; document.documentElement.classList.add('adj-on');   // menu + bar vanish, the dashboard is all you see
}
function endAdjust(mode) {
  if (!ADJ) return; const a = ADJ, U = UIT[lang] || UIT.en; ADJ = null;
  if (mode === 'save') { try { localStorage.setItem(UI_KEY, JSON.stringify(a.cur)); } catch (e) {} uiApply(a.cur); itToast(U.saved); }
  else if (mode === 'def') { try { localStorage.removeItem(UI_KEY); } catch (e) {} uiApply(UI_DEF); itToast(U.reset); }
  else uiApply(a.base);
  $('thAdj').hidden = true; document.documentElement.classList.remove('adj-on');   // back to the menu exactly where we left it
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && ADJ) { e.stopImmediatePropagation(); endAdjust('discard'); } }, true);
uiApply(uiGet());


/* ==========================================================
   Time filter, page sections, progress details
   - ONE round black/white button at the top corner of the page (before the Overall card). One tap: the other options orbit around it,
     everything behind is blurred. Pick one and the button comes back with the new choice.
   - Default: TODAY only when a session was really taken today; otherwise THIS WEEK. Then This month, and Last month (orange, the past).
   - Ranges are real calendar ranges on the Cairo clock (new month at 12:00 AM). The week = the 7 days Saturday to Friday that today is in.
   - The page is 3 sections, one at a time: 1 Overall progress (+ a small arrow that opens the score cards), 2 Tasks + Dandana, 3 Notes / TEFL / QOL.
   ========================================================== */
function thWin() {
  if (range !== 'week' && range !== 'month' && range !== 'lmonth') return null;
  const n = new Date(cairoNow()), y = n.getUTCFullYear(), m = n.getUTCMonth(), d = n.getUTCDate(), ymdU = x => x.toISOString().slice(0, 10), td = ymdU(n);
  if (range === 'month') return { s: ymdU(new Date(Date.UTC(y, m, 1))), e: td };
  if (range === 'lmonth') return { s: ymdU(new Date(Date.UTC(y, m - 1, 1))), e: ymdU(new Date(Date.UTC(y, m, 0))) };
  return { s: ymdU(new Date(Date.UTC(y, m, d - (n.getUTCDay() + 1) % 7))), e: td };   // week starts on Saturday
}
const thRX = {
  en: { dett: 'Scores & details', aria: 'Time range', more: 'Progress details' },
  ar: { dett: 'الأرقام والتفاصيل', aria: 'الفترة الزمنية', more: 'تفاصيل التقدم' },
  eg: { dett: 'الأرقام والتفاصيل', aria: 'الفترة الزمنية', more: 'تفاصيل التقدم' }
};
let thDay = '', thManual = false;
function thHas(k) { const keep = range; range = k; const ok = !!(D && D.rows.some(inRange)); range = keep; return ok; }
function thOpts() { const o = []; if (hasToday()) o.push('today'); o.push('week', 'month'); if (thHas('lmonth')) o.push('lmonth'); return o; }
function thAuto() { if (hasToday()) return 'today'; for (const k of ['week', 'month', 'lmonth']) if (thHas(k)) return k; return 'week'; }
function thAutoApply() {
  if (!D) return;
  const td = itToday(); if (thDay && thDay !== td) thManual = false;   // a new day starts: back to the automatic choice
  if (!thManual || !thOpts().includes(range)) { range = thAuto(); thManual = false; }
}
function thRangeUI() {
  const r = $('rng'); if (!r) return; r.style.display = '';
  const t = T[lang] || T.en, x = thRX[lang] || thRX.en;
  r.innerHTML = `<button type="button" class="thrb${range === 'lmonth' ? ' lm' : ''}" aria-haspopup="true" aria-label="${esc(x.aria + ': ' + (t[range] || ''))}" onclick="thRangeOpen(this)"><span>${esc(t[range] || '')}</span></button>`;
  thDay = itToday();
}
/* pressed: the button grows and flips its colours, the page is blurred, the other options spiral out around it as round buttons */
function thRangeOpen(btn) {
  thRangeClose(true);
  const t = T[lang] || T.en, r = btn.getBoundingClientRect(), W = document.documentElement.clientWidth, H = innerHeight, S = 54, R = 98;
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2, toLeft = cx > W / 2, others = thOpts().filter(k => k !== range), step = 38;
  const ov = document.createElement('div'); ov.id = 'thRov';
  ov.innerHTML = `<button type="button" class="thrb pressed${range === 'lmonth' ? ' lm' : ''}" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px"><span>${esc(t[range] || '')}</span></button>`
    + others.map((k, i) => {
      const a = (90 + (toLeft ? 1 : -1) * (i + 1) * step) * Math.PI / 180, x = Math.max(S / 2 + 8, Math.min(W - S / 2 - 8, cx + R * Math.cos(a))), y = Math.max(S / 2 + 8, Math.min(H - S / 2 - 8, cy + R * Math.sin(a)));
      return `<button type="button" class="thro${k === 'lmonth' ? ' lm' : ''}" data-k="${k}" data-ax="${cx - x}" data-ay="${cy - y}" data-a="${(toLeft ? 1 : -1) * (i + 1) * step}" style="left:${x - S / 2}px;top:${y - S / 2}px"><span>${esc(t[k] || '')}</span></button>`;
    }).join('');
  document.body.appendChild(ov); btn.style.visibility = 'hidden'; ov._btn = btn; document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => { const c = ov.querySelector('.pressed'); if (c) c.classList.add('big'); });
  ov.querySelectorAll('.thro').forEach((b, i) => {
    const R0 = R, da = +b.dataset.a, pts = [];
    for (let q = 0; q <= 8; q++) { const p = q / 8, ang = (90 + da * p) * Math.PI / 180, fa = (90 + da) * Math.PI / 180; pts.push({ transform: `translate(${R0 * p * Math.cos(ang) - R0 * Math.cos(fa)}px,${R0 * p * Math.sin(ang) - R0 * Math.sin(fa)}px) scale(${.3 + .7 * p})`, opacity: Math.min(1, p * 3) }); }
    if (b.animate) b.animate(pts, { duration: 520, delay: i * 70, easing: 'cubic-bezier(.2,.8,.25,1)', fill: 'backwards' });
  });
  ov.addEventListener('click', e => {
    const o = e.target.closest('.thro');
    if (o) { range = o.dataset.k; thManual = true; thRangeClose(true); render(); } else thRangeClose();
  });
}
function thRangeClose(now) {
  const ov = $('thRov'); if (!ov) return;
  if (ov._btn) ov._btn.style.visibility = '';
  document.documentElement.style.overflow = '';
  if (now) { ov.remove(); return; }
  ov.classList.add('out'); setTimeout(() => ov.remove(), 180);
}
setInterval(() => { if (typeof D !== 'undefined' && D && thDay && itToday() !== thDay) render(); }, 30000);   // midnight: a new day / month starts by itself

/* ===== the three sections ===== */
function thSections() {
  const wrap = document.querySelector('.wrap'); if (!wrap || wrap.dataset.ths) return;
  const top = wrap.querySelector('.top'), ov = $('overall'), lists = $('lists'), kacc = $('kpiAcc');
  if (!top || !ov || !lists) return; wrap.dataset.ths = '1';
  const mk = id => { const e = document.createElement('section'); e.className = 'thsec'; e.id = id; return e; };
  const s1 = mk('thS1'), s2 = mk('thS2'), s3 = mk('thS3');
  /* page order: 1 = greeting + Tasks / Dandana, 2 = chart (with its time filter), 3 = Notes / TEFL / QOL */
  const rr = document.createElement('div'); rr.id = 'thRngRow'; const rg = $('rng'), rn = $('rngNote'); if (rg) rr.appendChild(rg); if (rn) rr.appendChild(rn);
  wrap.insertBefore(s2, top); s2.appendChild(top); s2.appendChild(lists);
  wrap.appendChild(s3); wrap.appendChild(s1); s1.appendChild(rr); s1.appendChild(ov);   // order: 1 tasks + dandana, 2 notes / TEFL / QOL, 3 numbers (chart)
  const ar = document.createElement('button'); ar.type = 'button'; ar.id = 'thArrow'; ar.className = 'tharr'; ar.innerHTML = '<svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><g class="pq"><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" fill="none" stroke="#fbbf24" stroke-width="1.6"/><path d="M17.25 15.6v3.8M15.35 17.5h3.8" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round"/></g></svg>'; ar.setAttribute('aria-label', (thRX[lang] || thRX.en).more);
  ar.addEventListener('click', () => thDetOpen()); s1.appendChild(ar);
  const l2 = document.createElement('div'); l2.className = 'grid'; l2.id = 'lists2'; s3.appendChild(l2);
  const det = document.createElement('div'); det.id = 'thDet';
  det.innerHTML = '<div class="tdb"><button type="button" class="tdx" aria-label="Close">×</button><div class="tdh"></div></div>';
  document.body.appendChild(det);
  if (kacc) det.querySelector('.tdb').appendChild(kacc);   // the real score cards live in the pop-up, so everything inside keeps working
  det.querySelector('.tdx').addEventListener('click', thDetClose);
  det.addEventListener('click', e => { if (!e.target.closest('.tdb')) thDetClose(); });
  const h = document.createElement('div'); h.id = 'thHint'; h.innerHTML = '<div class="thdots"></div><button type="button" class="thnx" aria-label="Next"><i class="fa-solid fa-chevron-down"></i></button>';
  document.body.appendChild(h);
  h.querySelector('.thnx').addEventListener('click', () => { const sc = thSecs(), i = thCur(); sc[i >= sc.length - 1 ? 0 : i + 1].scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  window.addEventListener('scroll', thHintRefresh, { passive: true }); window.addEventListener('resize', thHintRefresh);
  thHintRefresh();
}
const thSecs = () => [...document.querySelectorAll('.thsec')].filter(e => !e.hidden);
function thCur() { const sc = thSecs(); let b = 0, bd = 1e9; sc.forEach((e, i) => { const d = Math.abs(e.getBoundingClientRect().top); if (d < bd) { bd = d; b = i; } }); return b; }
function thHintRefresh() {
  const h = $('thHint'); if (!h) return; const sc = thSecs(), i = thCur();
  h.hidden = sc.length < 2;
  h.querySelector('.thdots').innerHTML = sc.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('');
  h.querySelector('.thnx').classList.toggle('up', i >= sc.length - 1);
  if (i > 0 && !VIEW && !window._thLH) { window._thLH = 1; let seen = false; try { seen = !!localStorage.getItem('thabit_lists_hint'); } catch (e) {} if (!seen) setTimeout(() => { try { localStorage.setItem('thabit_lists_hint', '1'); } catch (e) {} itToast(thLX[lang] || thLX.en); }, 1200); }   // the drag tip shows once, when the cards come into view
}

/* ===== details pop-up (the five score cards) ===== */
function thDetFill() {
  const el = $('thDet'); if (!el || !D) return;
  const t = T[lang] || T.en, x = thRX[lang] || thRX.en, rows = CUR;
  el.querySelector('.tdh').innerHTML = `<b>${x.dett}</b><span>${esc((t[range] || '') + ' · ' + rows.length + ' ' + t.sessions + ' · ' + fmtDur(rows.reduce((a, r) => a + mins(r), 0)))}</span>`;
}
function thDetOpen() { const el = $('thDet'); if (!el) return; thRangeClose(true); thDetFill(); el.classList.add('open'); document.documentElement.style.overflow = 'hidden'; }
function thDetClose() { const el = $('thDet'); if (el) el.classList.remove('open'); document.documentElement.style.overflow = ''; const tp = $('barTip'); if (tp) tp.classList.remove('show'); }
function thDetRefresh() { const el = $('thDet'); if (el && el.classList.contains('open')) thDetFill(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') { thDetClose(); thRangeClose(); } });
thSections();

(function () { const st = document.createElement('style'); st.textContent = `
/* --- the time button --- */
#rng{display:flex;align-items:center}
#rng .thrb,#thRov .thrb{box-sizing:border-box;width:48px;height:48px;padding:3px;margin:0;border-radius:50%;border:2px solid #fff;background:#000;color:#fff;display:grid;place-items:center;text-align:center;cursor:pointer;font:700 9.5px/1.15 Inter,Cairo,sans-serif;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.4);transition:transform .3s cubic-bezier(.2,.9,.3,1.3),background .25s,color .25s,border-color .25s,box-shadow .3s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
#rng .thrb span,#thRov .thrb span,#thRov .thro span{display:block;max-width:100%;overflow-wrap:anywhere;text-wrap:balance}
#rng .thrb:active{transform:scale(.93)}
body.light-theme #rng .thrb,body.light-theme #thRov .thrb{background:#fff;color:#000;border-color:#000;box-shadow:0 6px 18px rgba(15,23,42,.22)}
#rng .thrb.lm,#thRov .thrb.lm{color:#fb923c;border-color:#fb923c}
#thRov{position:fixed;inset:0;z-index:3000;background:rgba(2,6,23,.4);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);animation:tdIn .2s ease-out}
body.light-theme #thRov{background:rgba(255,255,255,.35)}
#thRov.out{opacity:0;transition:opacity .18s}
#thRov .thrb.pressed{position:fixed;z-index:3001;background:#fff;color:#000;border-color:#fff;box-shadow:0 16px 44px rgba(0,0,0,.55)}
body.light-theme #thRov .thrb.pressed{background:#000;color:#fff;border-color:#000}
#thRov .thrb.pressed.lm{background:#fb923c;color:#1a0f00;border-color:#fb923c}
#thRov .thrb.pressed.big{transform:scale(1.25)}
#thRov .thro{position:fixed;z-index:3001;box-sizing:border-box;width:54px;height:54px;padding:3px;border-radius:50%;border:2px solid #fff;background:#000;color:#fff;display:grid;place-items:center;text-align:center;cursor:pointer;font:700 10.5px/1.15 Inter,Cairo,sans-serif;overflow:hidden;box-shadow:0 10px 26px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent;touch-action:manipulation}
#thRov .thro:active{transform:scale(.92)}
body.light-theme #thRov .thro{background:#fff;color:#000;border-color:#000;box-shadow:0 10px 26px rgba(15,23,42,.25)}
#thRov .thro.lm{color:#fb923c;border-color:#fb923c}
/* --- sections: one at a time --- */
html{scroll-snap-type:y mandatory}
.wrap{padding:0!important}
.thsec[hidden]{display:none!important}
.thsec{box-sizing:border-box;position:relative;min-height:100vh;min-height:calc(100vh / var(--ui-zoom,1));min-height:calc(100svh / var(--ui-zoom,1));padding:90px 30px 110px;display:flex;flex-direction:column;justify-content:flex-start;scroll-snap-align:start;scroll-snap-stop:always}
@media(min-width:601px){.thsec{padding-bottom:70px}}
@media(max-width:600px){.thsec{padding:64px 22px 110px}}
.thsec>.top{order:-3}.thsec>#overall{order:-2}
#thS1>#overall{margin-bottom:0!important}
#thRngRow{order:-3;display:grid;grid-template-columns:1fr auto;column-gap:10px;align-items:center;margin:2px 0 6px}
#thRngRow #rng{grid-column:2;grid-row:1}#thRngRow #rngNote{grid-column:1;grid-row:1;margin:0}
#thS1 #overall svg.c2{max-height:min(40vh,380px)}   /* on a big screen the chart stays small enough that the arrow below it is always on screen */
#thHint{position:fixed;z-index:30;inset:0;pointer-events:none}
#thHint[hidden]{display:none!important}
#thHint .thdots{position:absolute;inset-inline-end:7px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:7px}
#thHint .thdots i{display:block;width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.25;transition:height .25s,opacity .25s,background .25s}
#thHint .thdots i.on{height:18px;border-radius:3px;opacity:.85}
#thHint{color:#94a3b8}body.light-theme #thHint{color:#475569}
#thHint .thnx{position:absolute;left:50%;bottom:22px;margin-left:-19px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(148,163,184,.4);background:rgba(15,23,42,.45);color:#e2e8f0;display:flex;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;font-size:.85rem;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);-webkit-tap-highlight-color:transparent;animation:thBob 1.8s ease-in-out infinite}
body.light-theme #thHint .thnx{background:rgba(255,255,255,.7);color:#0f172a;border-color:rgba(15,23,42,.25)}
#thHint .thnx i{transition:transform .35s}
#thHint .thnx.up{animation:none}#thHint .thnx.up i{transform:rotate(180deg)}
@media(max-width:600px){#thHint .thnx{bottom:84px}}
html[data-bar="bottom"] #thHint .thnx{bottom:84px}
@keyframes thBob{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
@media(prefers-reduced-motion:reduce){#thHint .thnx{animation:none}.tharr .pq{animation:none!important}}
/* --- the little arrow under Overall progress --- */
.tharr{align-self:center;margin:12px auto 0;width:48px;height:48px;border-radius:50%;border:1px solid rgba(148,163,184,.4);background:rgba(148,163,184,.12);color:inherit;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .2s,transform .2s;-webkit-tap-highlight-color:transparent;order:5}
.tharr:hover{background:rgba(251,191,36,.18)}.tharr:active{transform:scale(.92)}
.tharr svg{display:block;overflow:visible}
.tharr .pq{transform-box:fill-box;transform-origin:center;animation:thPls 2s ease-in-out infinite}
@keyframes thPls{0%,60%,100%{transform:scale(1) rotate(0)}30%{transform:scale(1.22) rotate(90deg)}}
@keyframes tdIn{from{opacity:0}to{opacity:1}}
/* --- details pop-up: a finger of space from the bottom and from both sides, tap anywhere outside to leave --- */
#thDet{position:fixed;inset:0;z-index:2000;display:none;align-items:center;justify-content:center;padding:16px 16px calc(72px + env(safe-area-inset-bottom,0px));background:rgba(2,6,23,.45);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
body.light-theme #thDet{background:rgba(255,255,255,.4)}
#thDet.open{display:flex;animation:tdIn .25s ease-out}
#thDet .tdb{position:relative;box-sizing:border-box;zoom:var(--ui-zoom,1);width:min(1000px,100%);max-height:100%;overflow:auto;border-radius:24px;padding:18px 14px 14px;background:rgba(15,23,42,.94);color:#e2e8f0;border:1px solid rgba(148,163,184,.25);box-shadow:0 20px 60px rgba(0,0,0,.5);overscroll-behavior:contain;animation:thPop .32s cubic-bezier(.2,.9,.3,1.15)}
body.light-theme #thDet .tdb{background:rgba(255,255,255,.97);color:#0f172a}
@keyframes thPop{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:none}}
#thDet .tdh{display:flex;flex-direction:column;gap:2px;margin:0 36px 12px;text-align:center}
#thDet .tdh span{font-size:.78rem;opacity:.7}
#thDet .tdx{position:absolute;top:8px;inset-inline-end:10px;width:30px;height:30px;border:0;border-radius:50%;background:rgba(148,163,184,.18);color:inherit;font-size:1.2rem;line-height:1;cursor:pointer}
#thDet #kpiAcc>.acch{display:none!important}
#thDet #kpiAcc>.accb{display:block!important}
#thDet .grid{margin-bottom:0}
#barTip{z-index:100000}
/* --- floating bar: every button the same circle, every drawing the same size --- */
html #mobileFloatingBar>[data-bk],html #mobileFloatingBar #barEdit,html #mobileFloatingBar #langBtn,html #mobileFloatingBar>.feed{box-sizing:border-box!important;width:34px!important;height:34px!important;min-width:34px!important;max-width:34px!important;padding:0!important;border-radius:50%!important}
html #mobileFloatingBar #langBtn{font-size:11px!important;font-weight:800!important;line-height:1!important;letter-spacing:0!important;white-space:nowrap}
html #mobileFloatingBar #langBtn span{display:block;line-height:1;white-space:nowrap}
html #mobileFloatingBar .circle-badge-btn i{font-size:15px!important;line-height:1}
html #mobileFloatingBar #plusBtn svg,html #mobileFloatingBar #profBtn svg{width:22px!important;height:22px!important}
html #mobileFloatingBar>.feed .fdp{width:22px!important;height:22px!important}
html #mobileFloatingBar #barEdit{opacity:.85}
/* --- the + pop-out: coloured, bigger icons that move when it opens --- */
.lgi .plA,.lgi .plS{display:flex;align-items:center;justify-content:center;width:100%;height:100%}
.lgi .plA{color:#34d399}
.lgi .plA svg{width:30px;height:30px;overflow:visible;animation:plPop .6s cubic-bezier(.3,1.6,.5,1) .3s both}
.lgi .plA svg g path{transform-box:fill-box;transform-origin:0 50%;animation:plWave 1.5s ease-in-out infinite both}
.lgi .plA svg g path:nth-child(1){animation-delay:.35s}.lgi .plA svg g path:nth-child(2){animation-delay:.5s}.lgi .plA svg g path:nth-child(3){animation-delay:.65s}
@keyframes plWave{0%,100%{opacity:.35;transform:scaleX(.55)}45%{opacity:1;transform:scaleX(1.15)}}
@keyframes plPop{from{transform:scale(.6)}to{transform:scale(1)}}
.lgi .plS{color:#38bdf8;font-size:22px;overflow:hidden;border-radius:50%}
.lgi .plS i{display:block;animation:plFly .85s cubic-bezier(.2,.85,.25,1) .35s both}
@keyframes plFly{0%{opacity:0;transform:translate(-21px,21px) scale(.35) rotate(-18deg)}55%{opacity:1;transform:translate(2px,-2px) scale(1.18) rotate(6deg)}100%{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.lgi .plA svg,.lgi .plA svg g path,.lgi .plS i{animation:none!important}}`; document.head.appendChild(st); })();


/* ==========================================================
   Cards area (Tasks / Dandana / Notes / TEFL / QOL): a finger-wide space between the cards, and each card can be moved:
   press and hold a card (about half a second), then drag it where you want it. The order is remembered on this device.
   Works with touch and mouse, on the phone and the computer.
   ========================================================== */
const thLX = {
  en: 'Tip: press and hold any card, then drag it to where you want it',
  ar: 'نصيحة: اضغط مطولاً على أي كارت ثم اسحبه إلى المكان الذي تريده',
  eg: 'نصيحة: دوس دوسة طويلة على أي كارت واسحبه للمكان اللي عايزه'
};
const thCardKey = el => el.id === 'taskCard' ? 'tasks' : el.id === 'dandanaCard' ? 'dandana' : ((el.querySelector && el.querySelector('.ear') && el.querySelector('.ear').dataset.ear) || el.id || '');
const THL_KEYS = ['notes', 'tefl', 'qol', 'scratchCard'];
function thListsApply() {
  const L = $('lists'), L2 = $('lists2'); if (!L) return;
  if (L2) { L2.innerHTML = ''; [...L.children].filter(k => THL_KEYS.includes(thCardKey(k))).forEach(k => L2.appendChild(k)); }   // section 2 = tasks + dandana, section 3 = notes / TEFL / QOL
  [L, L2].forEach(x => {
    if (!x) return;
    let ord = []; try { ord = JSON.parse(localStorage.getItem(x.id === 'lists2' ? 'thabit_lists2_order' : 'thabit_lists_order') || '[]') || []; } catch (e) {}
    if (ord.length) {
      const kids = [...x.children], nat = new Map(kids.map((k, i) => [k, i])), at = k => { const i = ord.indexOf(thCardKey(k)); return i < 0 ? 100 + nat.get(k) : i; };
      kids.slice().sort((a, b) => at(a) - at(b)).forEach(k => x.appendChild(k));
    }
    thListsBind(x);
  });
  const s2 = $('thS2'), s3 = $('thS3'); { const tp = document.querySelector('.top'), s1 = $('thS1'), empty = !L.children.length;   // greeting lives with the Tasks section; if that one is empty it moves to the chart section so it never disappears
    if (tp && s1 && s2) { if (empty) { if (tp.parentNode !== s1) s1.insertBefore(tp, s1.firstChild); } else if (tp.parentNode !== s2) s2.insertBefore(tp, s2.firstChild); }
    if (s2) s2.hidden = empty; } if (s3) s3.hidden = !(L2 && L2.children.length);   // an empty section is not shown
  thHintRefresh();
}
function thListsBind(L) {
  if (!L || L.dataset.thb || VIEW) return; L.dataset.thb = '1';
  let dr = null, timer = null, px = 0, py = 0, swallow = 0, raf = 0, lx = 0, ly = 0, lastSwap = 0;
  const kids = () => [...L.children];
  const cardOf = t => { let e = t; while (e && e.parentElement !== L) e = e.parentElement; return e && e.parentElement === L ? e : null; };
  const place = (x, y) => { const it = dr.it; it.style.transform = ''; const n = it.getBoundingClientRect(); it.style.transform = `translate(${x - dr.ox - n.left}px,${y - dr.oy - n.top}px) scale(1.03)`; };
  const retarget = (x, y) => {
    if (Date.now() - lastSwap < 120) return;
    const it = dr.it, ks = kids().filter(k => k !== it);
    const t = ks.find(k => { const r = k.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }); if (!t) return;
    it.style.transform = ''; const n = it.getBoundingClientRect(), r = t.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2, vy = Math.abs(cy - (n.top + n.height / 2)) >= Math.abs(cx - (n.left + n.width / 2));
    const all = kids(), before = all.indexOf(it) > all.indexOf(t), rtl = getComputedStyle(L).direction === 'rtl';
    const past = vy ? (before ? y < cy : y > cy) : ((before !== rtl) ? x < cx : x > cx);   // only swap once the finger is past the middle of the other card (no flicker)
    if (!past) return;
    const rects = new Map(ks.map(k => [k, k.getBoundingClientRect()]));
    L.insertBefore(it, before ? t : t.nextSibling); lastSwap = Date.now();
    ks.forEach(k => { const a = rects.get(k), b = k.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top; if ((dx || dy) && k.animate) k.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 200, easing: 'ease-out' }); });
  };
  const move = (x, y) => { lx = x; ly = y; retarget(x, y); place(x, y); };
  const tick = () => { if (!dr) return; if (ly < 80) scrollBy(0, -(80 - ly) / 5); else if (ly > innerHeight - 80) scrollBy(0, (ly - (innerHeight - 80)) / 5); place(lx, ly); raf = requestAnimationFrame(tick); };
  const begin = it => {
    timer = null; const r = it.getBoundingClientRect();
    dr = { it, ox: px - r.left, oy: py - r.top }; lx = px; ly = py;
    it.classList.add('thlift'); L.classList.add('thdrag'); document.documentElement.style.scrollSnapType = 'none';
    try { navigator.vibrate && navigator.vibrate(15); } catch (e) {}
    try { getSelection().removeAllRanges(); } catch (e) {}
    place(px, py); raf = requestAnimationFrame(tick);
  };
  const end = () => {
    clearTimeout(timer); timer = null; if (!dr) return;
    const it = dr.it; dr = null; cancelAnimationFrame(raf);
    it.style.transition = 'transform .2s'; it.style.transform = '';
    setTimeout(() => { it.style.transition = ''; it.classList.remove('thlift'); L.classList.remove('thdrag'); document.documentElement.style.scrollSnapType = ''; }, 230);
    try { localStorage.setItem(L.id === 'lists2' ? 'thabit_lists2_order' : 'thabit_lists_order', JSON.stringify(kids().map(thCardKey))); } catch (e) {}
    swallow = Date.now() + 400;
  };
  L.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    if (e.target.closest && e.target.closest('input,textarea,select,.mb,.earbar,.hnd,.itc,.cpb')) return;
    const it = cardOf(e.target); if (!it) return;
    px = e.clientX; py = e.clientY; clearTimeout(timer); timer = setTimeout(() => begin(it), 450);
  });
  document.addEventListener('pointermove', e => {
    if (dr) { e.preventDefault(); move(e.clientX, e.clientY); return; }
    if (timer && Math.hypot(e.clientX - px, e.clientY - py) > 8) { clearTimeout(timer); timer = null; }
  });
  ['pointerup', 'pointercancel'].forEach(ev => document.addEventListener(ev, end));
  L.addEventListener('touchmove', e => { if (dr) e.preventDefault(); }, { passive: false });
  L.addEventListener('contextmenu', e => { if (dr || timer) e.preventDefault(); });
  L.addEventListener('click', e => { if (Date.now() < swallow) { e.stopPropagation(); e.preventDefault(); } }, true);
}
(function () { const st = document.createElement('style'); st.textContent = `
:root{--thgap:14px}
#lists>*,#lists2>*{-webkit-touch-callout:none}
#lists.thdrag,#lists.thdrag *,#lists2.thdrag,#lists2.thdrag *{-webkit-user-select:none;user-select:none}
#lists>.thlift,#lists2>.thlift{position:relative;z-index:60;cursor:grabbing;box-shadow:0 22px 50px rgba(0,0,0,.5)!important;will-change:transform}
#lists2{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
@media(max-width:600px){#lists2{grid-template-columns:1fr 1fr}#lists2>:first-child{grid-column:1/-1}}`; document.head.appendChild(st); })();

/* ==========================================================
   Bar buttons: free buttons (no box behind, no border, no light sweep), a small pop on hover.
   Only the bar itself keeps its border. The language button is hidden (it lives in the gear menu now),
   and the star becomes a gear drawn the same way (filled, one colour).
   To go back to the old look, delete this block.
   ========================================================== */
(function () {
  const st = document.createElement('style'); st.id = 'thFreeBar'; st.textContent = `
html #mobileFloatingBar #langBtn{display:none!important}
html #mobileFloatingBar>[data-bk]:not(.feed),html #mobileFloatingBar #barEdit{border:0!important;outline:0!important;box-shadow:none!important;-webkit-tap-highlight-color:transparent!important;-webkit-appearance:none;appearance:none}
html #mobileFloatingBar>[data-bk]:not(.feed),html #mobileFloatingBar #barEdit{background:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
html #mobileFloatingBar>[data-bk]:not(.feed):hover,html #mobileFloatingBar>[data-bk]:not(.feed):active,html #mobileFloatingBar>[data-bk]:not(.feed):focus,html #mobileFloatingBar>[data-bk]:not(.feed):focus-visible,html #mobileFloatingBar #barEdit:hover,html #mobileFloatingBar #barEdit:active,html #mobileFloatingBar #barEdit:focus,html #mobileFloatingBar #barEdit:focus-visible{background:transparent!important;outline:0!important;box-shadow:none!important;border:0!important}
html #mobileFloatingBar>[data-bk]:not(.feed)::before,html #mobileFloatingBar>[data-bk]:not(.feed)::after,html #mobileFloatingBar #barEdit::before,html #mobileFloatingBar #barEdit::after,html #mobileFloatingBar .circle-badge-btn:not(.feed)::before,html #mobileFloatingBar .circle-badge-btn:not(.feed)::after{content:none!important;display:none!important;background:none!important;animation:none!important}
html #mobileFloatingBar>[data-bk]:not(.feed),html #mobileFloatingBar #barEdit{transition:transform .18s cubic-bezier(.2,.9,.3,1.4)}
@media(hover:hover){html #mobileFloatingBar>[data-bk]:not(.feed):not(.lifting):not(.pk-on):not(.pk-hide):hover,html #mobileFloatingBar #barEdit:not(.pk-on):not(.pk-hide):hover{transform:scale(1.14)}}
html #mobileFloatingBar #barEdit svg.gear{width:22px;height:22px;display:block}`; document.head.appendChild(st);
  const GEAR = '<svg class="gear" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>';
  const go = () => { const e = document.getElementById('barEdit'); if (e && !e.querySelector('svg.gear')) e.innerHTML = GEAR; const l = document.getElementById('langBtn'); if (l) l.hidden = true; };
  go(); window.addEventListener('DOMContentLoaded', go);
})();

/* ==========================================================
   Collapsed task cells + circle pop + the "Choose your time" timeline
   ========================================================== */
(function () {
  const st = document.createElement('style'); st.textContent = `
.tkcell{display:flex;align-items:center;gap:10px;box-sizing:border-box;padding:10px 14px;border-radius:16px;border:1px solid rgba(148,163,184,.22);background:rgba(148,163,184,.08);cursor:pointer}
.tkcm{flex:1;min-width:0}
.tkc1{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;font-size:.8rem}
.tkc1 b{font-weight:800}
.tkc2{margin-top:2px;font-size:.88rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tkdot{flex:none;margin-inline-start:auto;width:26px;height:26px;border-radius:50%;border:2px solid rgba(148,163,184,.6);display:flex;align-items:center;justify-content:center;font-size:.7rem;pointer-events:none}
.tkdot.open{border-color:#fbbf24}.tkdot.done{border-color:#34d399;background:#34d399;color:#04231a}.tkdot.closed{border-color:#fb7185;color:#fb7185}
.itc.itpop{animation:itPop .65s cubic-bezier(.2,.9,.3,1.3) both}
@keyframes itPop{0%{transform:scale(0);opacity:0;box-shadow:0 0 0 0 rgba(251,191,36,.7)}55%{transform:scale(1.4);opacity:1}100%{transform:scale(1);box-shadow:0 0 0 14px rgba(251,191,36,0)}}
@media(prefers-reduced-motion:reduce){.itc.itpop{animation:none}}
.tpkb.used{opacity:.6;cursor:default;border-color:rgba(148,163,184,.5);background:rgba(148,163,184,.12);color:inherit}
/* timeline: nothing else on screen */
.tpt{position:fixed;inset:0;z-index:10075;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.97)}
body.light-theme .tpt{background:rgba(255,255,255,.98)}
.tptb{box-sizing:border-box;width:min(96vw,620px);text-align:center;color:#f1f5f9;font:600 .85rem Inter,Cairo,sans-serif}
body.light-theme .tptb{color:#0f172a}
.tpt1{font-weight:800;font-size:1.05rem;margin-bottom:6px;overflow-wrap:anywhere}
.tpo{margin-top:4px;color:#fbbf24}
body.light-theme .tpo{color:#b45309}
.tptl{position:relative;height:96px;margin:34px 34px 8px;touch-action:none}
.tptr{position:absolute;left:0;right:0;top:20px;height:3px;border-radius:3px;background:rgba(148,163,184,.4)}
.tpd{position:absolute;top:0;width:0;height:60px;touch-action:none}
.tpd i{position:absolute;left:-14px;top:7px;width:28px;height:28px;border-radius:50%;background:rgba(148,163,184,.55);box-sizing:border-box}
.tpd.ed i{background:#34d399;box-shadow:0 0 0 5px rgba(52,211,153,.28);cursor:grab}
.tpd.ed.drag i{cursor:grabbing;transform:scale(1.2);box-shadow:0 0 0 9px rgba(52,211,153,.22)}
.tpd.ed::after{content:"";position:absolute;left:-26px;top:-4px;width:52px;height:52px}
.tpd span{position:absolute;left:0;transform:translateX(-50%);top:42px;font-size:.66rem;white-space:nowrap;opacity:.85;unicode-bidi:isolate}
.tpd span.lo2{top:60px}
.tpd span b{font-size:.78rem;margin-inline-end:3px}
.tpval{min-height:1.6em;margin:16px 0 4px;color:#34d399;font-weight:800}
body.light-theme .tpval{color:#047857}
.tpwarn{margin:8px 0;padding:8px 12px;border-radius:12px;background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.4);color:#fbbf24;line-height:1.6}
body.light-theme .tpwarn{color:#92400e}
.tpwarn[hidden]{display:none}
.tpt .tpbs{max-width:360px;margin-inline:auto}`; document.head.appendChild(st);
})();

/* temporary diagnostics: prints where the Tasks / Dandana cards are (console only, nothing on screen). Safe to delete. */
function thDiag() {
  try {
    const secs = [...document.querySelectorAll('.thsec')].map(s => s.id + ' hidden=' + s.hidden + ' display=' + getComputedStyle(s).display + ' h=' + Math.round(s.getBoundingClientRect().height));
    const info = id => { const c = document.getElementById(id); if (!c) return id + ': NOT IN DOM'; const r = c.getBoundingClientRect(), cs = getComputedStyle(c), s = c.closest('.thsec'); return id + ': section=' + (s && s.id) + ' display=' + cs.display + ' visibility=' + cs.visibility + ' opacity=' + cs.opacity + ' w=' + Math.round(r.width) + ' h=' + Math.round(r.height) + ' top=' + Math.round(r.top + scrollY) + ' htmlLen=' + c.innerHTML.length; };
    const L = document.getElementById('lists');
    console.info('[diag] sections:', secs.join(' | '));
    console.info('[diag]', info('taskCard'));
    console.info('[diag]', info('dandanaCard'));
    console.info('[diag] #lists children:', L ? [...L.children].map(e => e.id || e.className).join(',') : 'no #lists', '| scripts:', [...document.scripts].map(s => (s.src || 'inline').split('/').pop()).join(','));
    console.info('[diag] items by state:', (D.items || []).map(i => i.kind + ':' + itState(i).k).join(','));
    const w = ms => ms ? new Date(ms).toISOString().slice(5, 16).replace('T', ' ') : '-';
    console.info('[diag] now(wall):', w(cairoNow()), '| tz:', USER_TZ);
    (D.items || []).forEach(i => { const p = i.plan; console.info('[diag] item', i.id, i.kind, 'date=' + i.date, 'no=' + i.no, 'state=' + itState(i).k, 'checks=' + (i.checks || []).length + '/' + (p ? p.n_eff : i.repeats), p ? 'opens=' + (p.opens || []).map(w).join(',') + ' deadline=' + w(p.deadline) + ' reason=' + p.deadline_reason : 'NO PLAN'); });
  } catch (e) { console.warn('[diag] failed', e); }
}

(function(){const st=document.createElement('style');st.textContent='.tkcell.tkempty{opacity:.6}.tkcell.tkempty .tkc2{font-weight:500}';document.head.appendChild(st);})();

/* vertical timelines: in the item (first quarter = line + dots, times written to the right of each dot; the other three quarters = details) and in the full-screen editor */
(function () { const st = document.createElement('style'); st.textContent = `
.itsp{display:flex;gap:10px;align-items:flex-start;margin-top:4px}
.itsl{flex:0 0 28%;min-width:96px;max-width:150px}
.itsd{flex:1;min-width:0}
.itsd>.itd{margin-top:0}
.vt{position:relative}
.vt::before{content:"";position:absolute;left:5px;top:12px;bottom:12px;width:2px;border-radius:2px;background:rgba(148,163,184,.35)}
.vtr{display:flex;align-items:center;gap:7px;height:28px}
.vtr i{position:relative;z-index:1;flex:none;width:12px;height:12px;border-radius:50%;background:rgba(148,163,184,.55)}
.vtr i.on{background:#34d399}.vtr i.nx{background:#fbbf24;box-shadow:0 0 0 3px rgba(251,191,36,.25)}
.vtr span{font-size:.66rem;white-space:nowrap;opacity:.85;unicode-bidi:isolate}
.vtr span b{font-size:.74rem;margin-inline-end:3px}
.itcnt{display:block;margin-top:4px;padding-left:1px}
.tpt{overflow:auto}
.tvw{position:relative;margin:12px auto 4px;width:min(100%,380px);touch-action:none;-webkit-user-select:none;user-select:none}
.tvc{position:absolute;top:0;width:50%;height:100%}
.tvl{position:absolute;left:16px;width:3px;margin-left:-1px;border-radius:3px;background:rgba(148,163,184,.4)}
.tvh{position:absolute;left:26px;font-size:.62rem;opacity:.55;white-space:nowrap;unicode-bidi:isolate}
.tvd{position:absolute;width:0;height:0;touch-action:none}
.tvd i{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;background:rgba(148,163,184,.55);box-sizing:border-box}
.tvd.ed i{background:#34d399;box-shadow:0 0 0 5px rgba(52,211,153,.28);cursor:grab}
.tvd.ed.drag i{cursor:grabbing;transform:scale(1.15);box-shadow:0 0 0 9px rgba(52,211,153,.22)}
.tvd.ed::after{content:"";position:absolute;left:-26px;top:-26px;width:52px;height:52px}
.tvd span{position:absolute;left:22px;top:-8px;font-size:.7rem;white-space:nowrap;opacity:.95;unicode-bidi:isolate;pointer-events:none}
.tvd span b{font-size:.8rem;margin-inline-end:3px}`; document.head.appendChild(st); })();






/* ===== Light bar/header, softer sweep, soft tilted outline star for Feed, outline theme icon ===== */
(function () {
  const old = document.getElementById('thSoftUI'); if (old) old.remove();
  const st = document.createElement('style'); st.id = 'thSoftUI';
  st.textContent = `
/* 1) bottom bar: solid, a hair lighter than the page */
html #mobileFloatingBar{background:#181c20!important;background-image:none!important;border:1px solid rgba(255,255,255,.07)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
body.light-theme #mobileFloatingBar{background:#fbfcfe!important;border-color:rgba(15,23,42,.08)!important}
/* top header (logo) - guessed names, see note */
body>header,body>nav,.th-header,.thabit-header,#thHeader,#brandBar,.brand-bar,.site-header,.navbar{background:#181c20!important;background-image:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
body.light-theme>header,body.light-theme>nav,body.light-theme .th-header,body.light-theme .thabit-header,body.light-theme #thHeader,body.light-theme #brandBar,body.light-theme .brand-bar,body.light-theme .site-header,body.light-theme .navbar{background:#fbfcfe!important}

/* 2) softer light sweep */
.thabit-card::before,.test-card::before{opacity:.35!important}

/* 3) Feed button: plain, hollow red soft star, red number dot on top */
html #mobileFloatingBar>.feed,#feedBtn{position:relative!important;background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important;outline:0!important}
#feedBtn .fdp{position:static!important;display:contents!important}
#feedBtn .fdw,#feedBtn .fdg,#feedBtn .fdb{display:none!important}
#feedBtn .fstar{width:30px;height:30px;display:block;overflow:visible;transform:rotate(-13deg)}
#feedBtn .fstar path{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round}
#feedBtn #feedNum{position:absolute!important;inset:auto!important;top:3px;right:3px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:999px;display:block;
 background:#ef4444!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#fff!important;-webkit-text-fill-color:#fff!important;
 font:800 10px/16px Inter,Cairo,sans-serif!important;text-align:center;opacity:0;transform:none!important;animation:none!important}
#feedBtn.num #feedNum{opacity:1}

/* 4) theme icon: outline */
#themeIcon{font-weight:400!important}`;
  document.head.appendChild(st);

  /* chubby star with rounded corners (thick round stroke softens the tips) */
  const STAR = '<svg class="fstar" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3L15.06 7.79L20.56 9.22L16.95 13.61L17.29 19.28L12 17.2L6.71 19.28L7.05 13.61L3.44 9.22L8.94 7.79Z"/></svg>';
  function putStar() {
    const b = document.getElementById('feedBtn'); if (!b || b.querySelector('.fstar')) return;
    b.insertAdjacentHTML('afterbegin', STAR);
  }
  function hollowTheme() {
    const i = document.getElementById('themeIcon'); if (!i) return;
    if (i.classList.contains('fa-solid')) { i.classList.remove('fa-solid'); i.classList.add('fa-regular'); }
  }
  function init() {
    document.querySelectorAll('#feedBtn .fstar').forEach(e => e.remove());
    putStar(); hollowTheme();
    const i = document.getElementById('themeIcon');
    if (i) new MutationObserver(hollowTheme).observe(i, { attributes: true, attributeFilter: ['class'] });
    const b = document.getElementById('feedBtn');
    if (b) new MutationObserver(putStar).observe(b, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();








/* ===== Feed star: thin outline (same weight as the theme icon), softly rounded corners, slight tilt ===== */
(function () {
  const st = document.createElement('style');
  st.textContent = `
#feedBtn .fstar{width:28px;height:28px;transform:rotate(-12deg)}
#feedBtn .fstar path{stroke-width:1.35!important;stroke-linejoin:round;stroke-linecap:round;fill:none}`;
  document.head.appendChild(st);

  /* star with each corner rounded by a small curve */
  const cx = 12, cy = 12, R = 9.6, r = 4.8, d = 1.4, P = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r : R; P.push([cx + k * Math.cos(a), cy + k * Math.sin(a)]); }
  const toward = (a, b, t) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [a[0] + dx / l * t, a[1] + dy / l * t]; };
  let path = '';
  P.forEach((p, i) => {
    const t = i % 2 ? d * 0.6 : d, a = toward(p, P[(i + 9) % 10], t), b = toward(p, P[(i + 1) % 10], t);
    path += (i ? 'L' : 'M') + a[0].toFixed(2) + ',' + a[1].toFixed(2) + 'Q' + p[0].toFixed(2) + ',' + p[1].toFixed(2) + ' ' + b[0].toFixed(2) + ',' + b[1].toFixed(2);
  });
  path += 'Z';

  const fix = () => document.querySelectorAll('#feedBtn .fstar path').forEach(p => p.setAttribute('d', path));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { fix(); setTimeout(fix, 300); });
  else { fix(); setTimeout(fix, 300); }
})();





/* ===== Calendar: opens from the profile button. Week (default) / Month / Year, Google-Calendar style ===== */
(function () {
  const X = {
    en: { cal: 'Calendar', week: 'Week', month: 'Month', year: 'Year', today: 'Today', none: 'No session on this day', sess: 'Session' },
    ar: { cal: 'التقويم', week: 'أسبوع', month: 'شهر', year: 'سنة', today: 'اليوم', none: 'لا توجد جلسة في هذا اليوم', sess: 'جلسة' },
    eg: { cal: 'التقويم', week: 'أسبوع', month: 'شهر', year: 'سنة', today: 'النهاردة', none: 'مفيش سيشن في اليوم ده', sess: 'سيشن' }
  };
  const T3 = () => X[lang] || X.en, loc = () => lang === 'en' ? 'en-GB' : 'ar-EG';
  const P = s => new Date(s + 'T00:00:00Z'), Y = d => d.toISOString().slice(0, 10), AD = (d, n) => new Date(d.getTime() + n * 864e5);
  const WS = d => AD(d, -((d.getUTCDay() + 1) % 7));                       // week starts on Saturday, like the rest of the dashboard
  const dim = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const addM = (d, n) => { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)); t.setUTCDate(Math.min(d.getUTCDate(), dim(t.getUTCFullYear(), t.getUTCMonth()))); return t; };
  const fmt = (d, o) => d.toLocaleDateString(loc(), Object.assign({ timeZone: 'UTC' }, o));
  const num = n => n.toLocaleString(loc(), { useGrouping: false });
  let view = 'week', cur = null;
  const isOff = d => { const w = d.getUTCDay(); return w === 4 || w === 5; };          // Thursday + Friday = days off (default)
  const CZ = () => ({
    en: { off: 'This day is a day off', cust: 'Customize', apology: 'Apologize', resched: 'Request a time change', other: 'Other', ph: 'Describe exactly what you want...', send: 'Send', need: 'Please write what you want first', sent: 'Sent ✓', fail: 'Could not send, try again', prev: 'Preview mode: nothing was sent' },
    ar: { off: 'هذا اليوم إجازة', cust: 'تخصيص', apology: 'تقديم اعتذار', resched: 'طلب تغيير موعد', other: 'أخرى', ph: 'اوصف ما تريده بالضبط...', send: 'إرسال', need: 'اكتب ما تريده أولاً', sent: 'تم الإرسال ✓', fail: 'لم يتم الإرسال، حاول مرة أخرى', prev: 'وضع المعاينة: لم يُرسل شيء' },
    eg: { off: 'اليوم ده إجازة', cust: 'تخصيص', apology: 'تقديم اعتذار', resched: 'طلب تغيير ميعاد', other: 'أخرى', ph: 'اوصفلي اللي انت عايزه بالظبط...', send: 'إرسال', need: 'اكتب اللي انت عايزه الأول', sent: 'اتبعت ✓', fail: 'ما اتبعتش، حاول تاني', prev: 'وضع المعاينة: مفيش حاجة اتبعتت' }
  }[lang] || {});
  let cz = { d: '', step: 'closed', opt: '' };

  const st = document.createElement('style');
  st.textContent = `
#thCal{position:fixed;inset:0;z-index:10030;display:none;align-items:center;justify-content:center;padding:14px 14px calc(14px + env(safe-area-inset-bottom,0px));background:rgba(2,6,23,.5);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
#thCal.open{display:flex;animation:tdIn .2s ease-out}
#thCal .cbox{box-sizing:border-box;width:min(460px,100%);max-height:100%;overflow:auto;border-radius:24px;padding:14px;background:#0f172a;color:#f1f5f9;border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 60px rgba(0,0,0,.5);animation:thPop .3s cubic-bezier(.2,.9,.3,1.15);touch-action:pan-y}
body.light-theme #thCal .cbox{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.12)}
#thCal .ch{display:flex;align-items:center;gap:6px;margin-bottom:10px}
#thCal .ct{flex:1;text-align:center;font-weight:800;font-size:1rem}
#thCal .cb{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:rgba(148,163,184,.18);color:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.8rem}
html[dir=rtl] #thCal .cb i.fa-chevron-left,html[dir=rtl] #thCal .cb i.fa-chevron-right{transform:scaleX(-1)}
#thCal .ctd{flex:none;padding:0 12px;width:auto;font:700 .74rem Inter,Cairo,sans-serif}
#thCal .cs{display:flex;gap:4px;padding:3px;margin-bottom:12px;border-radius:999px;background:rgba(148,163,184,.14)}
#thCal .cs button{flex:1;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:inherit;font:700 .76rem Inter,Cairo,sans-serif;cursor:pointer}
#thCal .cs button.on{background:#fbbf24;color:#111}
#thCal .cg{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
#thCal .cw{text-align:center;font-size:.68rem;font-weight:700;opacity:.55;padding:2px 0}
#thCal .cd{position:relative;aspect-ratio:1;min-width:0;padding:0;border:1px solid transparent;border-radius:14px;background:transparent;color:inherit;font:600 .9rem Inter,Cairo,sans-serif;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
#thCal .cd.out{opacity:.3}
#thCal .cd.td{border-color:#fbbf24}
#thCal .cd.sel{background:#fbbf24;color:#111;border-color:#fbbf24}
#thCal .cd i.dt2{width:5px;height:5px;border-radius:50%;background:#34d399}
#thCal .cd.sel i.dt2{background:#111}
#thCal .cd i.no{visibility:hidden}
#thCal .cg.wk .cd{aspect-ratio:auto;padding:12px 0;border-radius:16px;background:rgba(148,163,184,.1)}
#thCal .cg.wk .cd.sel{background:#fbbf24}
#thCal .cg.wk .cd small{font-size:.64rem;opacity:.7;font-weight:700}
#thCal .cy{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
#thCal .cm{padding:8px 6px;border-radius:14px;border:1px solid rgba(148,163,184,.22);background:rgba(148,163,184,.07);color:inherit;cursor:pointer;text-align:center}
#thCal .cm.cur{border-color:#fbbf24}
#thCal .cm b{display:block;font-size:.74rem;margin-bottom:4px}
#thCal .cm .cg{gap:1px}
#thCal .cm .mn{font-size:.5rem;aspect-ratio:auto;padding:1px 0;border-radius:3px;line-height:1.5;opacity:.8}
#thCal .cm .mn.s{background:rgba(52,211,153,.35);opacity:1}
#thCal .cm .mn.t{outline:1px solid #fbbf24}
#thCal .cx{margin-top:12px;display:flex;flex-direction:column;gap:8px}
#thCal .cl{padding:10px 12px;border-radius:14px;border:1px solid rgba(148,163,184,.25);background:rgba(148,163,184,.08);border-inline-start:3px solid #34d399}
#thCal .cl b{font-size:.88rem}#thCal .cl span{display:block;font-size:.76rem;opacity:.7;margin-top:2px}
#thCal .ce{text-align:center;font-size:.8rem;opacity:.6;padding:6px 0}
#thCal .cd.off{color:#ef4444;background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.4)}
#thCal .cg.wk .cd.off{background:rgba(239,68,68,.14)}
#thCal .cd.sel.off,#thCal .cg.wk .cd.sel.off{background:#ef4444;color:#fff;border-color:#ef4444}
#thCal .cm .mn.of{color:#ef4444}
#thCal .cl.off{border-inline-start-color:#ef4444;background:rgba(239,68,68,.1);text-align:center}
#thCal .cl.off b{color:#ef4444}
#thCal .czb{width:100%;margin-top:10px;padding:11px;border:0;border-radius:14px;background:rgba(148,163,184,.16);color:inherit;font:800 .86rem Cairo,Inter,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
#thCal .czb.on{background:#fbbf24;color:#111}
#thCal .czo{margin-top:8px;display:flex;flex-direction:column;gap:6px}
#thCal .czo button{padding:11px 12px;border:0;border-radius:12px;background:rgba(148,163,184,.12);color:inherit;font:700 .84rem Cairo,Inter,sans-serif;cursor:pointer;text-align:center}
#thCal .czo button:disabled{opacity:.35;cursor:default}
#thCal .czf{margin-top:8px;display:flex;flex-direction:column;gap:8px}
#thCal .czt{text-align:center;font-weight:800;font-size:.86rem}
#thCal .czta{width:100%;box-sizing:border-box;min-height:96px;padding:10px 12px;border-radius:12px;border:1px solid rgba(148,163,184,.3);background:rgba(148,163,184,.08);color:inherit;font:600 .86rem Cairo,Inter,sans-serif;resize:vertical}
#thCal .czerr{color:#f43f5e;font-size:.76rem;font-weight:700;text-align:center}
#thCal .czr{display:flex;gap:8px}
#thCal .czr button{padding:11px 14px;border:0;border-radius:12px;background:rgba(148,163,184,.16);color:inherit;font:800 .84rem Cairo,Inter,sans-serif;cursor:pointer}
#thCal .czr .czs{flex:1;background:#34d399;color:#04231a}
#thCal .czr button:disabled{opacity:.6}`;
  document.head.appendChild(st);

  const box = document.createElement('div'); box.id = 'thCal';
  box.innerHTML = '<div class="cbox"></div>';
  document.body.appendChild(box);
  const body = box.querySelector('.cbox');

  const sessions = () => { const m = {}; ((typeof D !== 'undefined' && D && D.rows) || []).forEach(r => (m[r.supply_date] = m[r.supply_date] || []).push(r)); return m; };

  function title() {
    if (view === 'year') return num(cur.getUTCFullYear());
    if (view === 'month') return fmt(cur, { month: 'long', year: 'numeric' });
    const a = WS(cur), b = AD(a, 6);
    return a.getUTCMonth() === b.getUTCMonth() ? num(a.getUTCDate()) + ' – ' + fmt(b, { day: 'numeric', month: 'short', year: 'numeric' }) : fmt(a, { day: 'numeric', month: 'short' }) + ' – ' + fmt(b, { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function cell(d, S, today, extra) {
    const k = Y(d), has = S[k];
    return `<button type="button" class="cd${k === Y(cur) ? ' sel' : ''}${k === today ? ' td' : ''}${extra || ''}${isOff(d) ? ' off' : ''}" data-d="${k}">${view === 'week' ? `<small>${fmt(d, { weekday: 'short' })}</small>` : ''}<span>${num(d.getUTCDate())}</span><i class="dt2${has ? '' : ' no'}"></i></button>`;
  }
  function weekHead() { const a = WS(P('2024-01-06')); return Array.from({ length: 7 }, (_, i) => `<div class="cw">${fmt(AD(a, i), { weekday: 'short' })}</div>`).join(''); }
  function details(S) { return czWrap(details0(S)); }
  function czWrap(html) {
    const c = CZ(), k = Y(cur), today = itToday(), lastOk = Y(AD(WS(P(today)), 13));   // this week + next week
    const off = isOff(cur), ok = !off && k >= today && k <= lastOk;
    if (cz.d !== k) cz = { d: k, step: 'closed', opt: '' };
    let pre = off ? `<div class="cx"><div class="cl off"><b>${esc(c.off)}</b></div></div>` : '', post = '';
    if (ok) {
      post = `<button type="button" class="czb${cz.step !== 'closed' ? ' on' : ''}" data-cz="toggle"><i class="fa-solid fa-sliders"></i>${esc(c.cust)}</button>`;
      if (cz.step === 'opts') post += `<div class="czo"><button type="button" data-cz="opt:apology">${esc(c.apology)}</button><button type="button" data-cz="opt:reschedule">${esc(c.resched)}</button><button type="button" data-cz="opt:other">${esc(c.other)}</button><button type="button" disabled>—</button></div>`;
      if (cz.step === 'form') { const nm = { apology: c.apology, reschedule: c.resched, other: c.other }[cz.opt] || '';
        post += `<div class="czf"><div class="czt">${esc(nm)}</div><textarea class="czta" rows="4" maxlength="1500" placeholder="${esc(c.ph)}"></textarea><div class="czerr" hidden></div><div class="czr"><button type="button" data-cz="back" aria-label="Back"><i class="fa-solid fa-arrow-left"></i></button><button type="button" class="czs" data-cz="send">${esc(c.send)}</button></div></div>`; }
    }
    return pre + html + post;
  }
  function details0(S) {
    const t = T3(), rows = S[Y(cur)] || [], hm5 = v => v ? String(v).slice(0, 5) : '';
    return `<div class="cx">` + (rows.length ? rows.map(r => `<div class="cl"><b dir="auto">${esc(t.sess)} #${esc(r.session_number == null ? '' : r.session_number)}${r.session_title ? ' · ' + esc(r.session_title) : ''}</b>${r.sub_title ? `<span dir="auto">${esc(r.sub_title)}</span>` : ''}${r.start_time || r.end_time ? `<span>${esc(hm5(r.start_time))}–${esc(hm5(r.end_time))}</span>` : ''}</div>`).join('') : `<div class="ce">${t.none}</div>`) + `</div>`;
  }
  function render() {
    const t = T3(), S = sessions(), today = itToday();
    let h = `<div class="ch"><button type="button" class="cb" data-a="prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button><div class="ct">${esc(title())}</div><button type="button" class="cb" data-a="next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button><button type="button" class="cb ctd" data-a="today">${t.today}</button></div>`
      + `<div class="cs">${['week', 'month', 'year'].map(v => `<button type="button" data-v="${v}" class="${v === view ? 'on' : ''}">${t[v]}</button>`).join('')}</div>`;
    if (view === 'week') {
      const a = WS(cur);
      h += `<div class="cg wk">${Array.from({ length: 7 }, (_, i) => cell(AD(a, i), S, today)).join('')}</div>` + details(S);
    } else if (view === 'month') {
      const y = cur.getUTCFullYear(), m = cur.getUTCMonth(), first = new Date(Date.UTC(y, m, 1)), st0 = WS(first), rows = Math.ceil(((first - st0) / 864e5 + dim(y, m)) / 7);
      h += `<div class="cg">${weekHead()}${Array.from({ length: rows * 7 }, (_, i) => { const d = AD(st0, i); return cell(d, S, today, d.getUTCMonth() === m ? '' : ' out'); }).join('')}</div>` + details(S);
    } else {
      const y = cur.getUTCFullYear();
      h += `<div class="cy">${Array.from({ length: 12 }, (_, m) => {
        const first = new Date(Date.UTC(y, m, 1)), st0 = WS(first), rows = Math.ceil(((first - st0) / 864e5 + dim(y, m)) / 7);
        const cells = Array.from({ length: rows * 7 }, (_, i) => { const d = AD(st0, i), k = Y(d); return d.getUTCMonth() === m ? `<div class="cd mn${S[k] ? ' s' : ''}${k === today ? ' t' : ''}${isOff(d) ? ' of' : ''}">${num(d.getUTCDate())}</div>` : '<div></div>'; }).join('');
        return `<button type="button" class="cm${m === cur.getUTCMonth() ? ' cur' : ''}" data-m="${m}"><b>${fmt(first, { month: 'long' })}</b><div class="cg">${cells}</div></button>`;
      }).join('')}</div>`;
    }
    body.innerHTML = h;
  }
  function step(n) {
    if (view === 'week') cur = AD(cur, 7 * n);
    else if (view === 'month') cur = addM(cur, n);
    else cur = addM(cur, 12 * n);
    render();
  }
  body.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'), v = e.target.closest('[data-v]'), d = e.target.closest('.cd[data-d]'), m = e.target.closest('.cm[data-m]');
    if (a) { if (a.dataset.a === 'today') { cur = P(itToday()); render(); } else step(a.dataset.a === 'next' ? 1 : -1); }
    else if (v) { view = v.dataset.v; render(); }
    else if (d) { cur = P(d.dataset.d); render(); }
    else if (m) { cur = new Date(Date.UTC(cur.getUTCFullYear(), +m.dataset.m, Math.min(cur.getUTCDate(), dim(cur.getUTCFullYear(), +m.dataset.m)))); view = 'month'; render(); }
  });
  body.addEventListener('click', async e => {
    const z = e.target.closest('[data-cz]'); if (!z) return;
    const a = z.dataset.cz, c = CZ();
    if (a === 'toggle') { cz.step = cz.step === 'closed' ? 'opts' : 'closed'; render(); }
    else if (a.startsWith('opt:')) { cz.opt = a.slice(4); cz.step = 'form'; render(); const t = body.querySelector('.czta'); if (t) t.focus(); }
    else if (a === 'back') { cz.step = 'opts'; render(); }
    else if (a === 'send') {
      const ta = body.querySelector('.czta'), er = body.querySelector('.czerr'), txt = ta ? ta.value.trim() : '';
      if (!txt) { er.textContent = c.need; er.hidden = false; return; }
      if (typeof VIEW !== 'undefined' && VIEW) { try { itToast(c.prev); } catch (x) { } return; }
      z.disabled = true; er.hidden = true;
      const date = cz.d, kind = cz.opt, good = r => r === true || (r && r.ok === true);
      let ok = good(await rpc('trainee_day_request', { p_token: tok(), p_date: date, p_kind: kind, p_text: txt.slice(0, 1500) }).catch(() => null));
      if (!ok) {   // the new table is not there yet: the same message still reaches the trainer as a normal request + report
        const title = `[DAY ${kind.toUpperCase()}] ${date}`;
        ok = (await rpc('trainee_send_request', { p_token: tok(), p_type: 'other', p_message: `${title}\n${txt}`.slice(0, 2000) }).catch(() => null)) === true;
        if (ok) rpc('trainee_submit_report', { p_token: tok(), p_type: 'other', p_title: title.slice(0, 140), p_details: txt.slice(0, 1500), p_follow: date }).catch(() => null);
      }
      if (ok) { cz = { d: date, step: 'closed', opt: '' }; render(); try { itToast(c.sent); } catch (x) { } }
      else { z.disabled = false; er.textContent = c.fail; er.hidden = false; }
    }
  });
  /* swipe left / right = next / previous */
  let sx = 0, sy = 0;
  body.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  body.addEventListener('touchend', e => {
    if (e.target.closest && e.target.closest('.czf,.czo')) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step((dx < 0) !== (document.documentElement.dir === 'rtl') ? 1 : -1);
  }, { passive: true });

  function openCal() { cur = P(itToday()); view = 'week'; render(); box.classList.add('open'); document.documentElement.style.overflow = 'hidden'; }
  function closeCal() { box.classList.remove('open'); document.documentElement.style.overflow = ''; }
  box.addEventListener('click', e => { if (e.target === box) closeCal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) closeCal(); });
  window.openCal = openCal; window.closeCal = closeCal;

  /* the profile button's pop-out: Profile, Calendar, Log out */
  window.openProf = function (btn) {
    const ar = lang !== 'en';
    window.thPick(btn || $('profBtn'), [
      { html: '<i class="fa-solid fa-user pfi"></i>', title: ar ? 'ملفي' : 'Profile', on: () => Panels.open('profile') },
      { html: '<i class="fa-regular fa-calendar-days pfi" style="color:#38bdf8"></i>', title: T3().cal, on: openCal },
      { html: '<i class="fa-solid fa-right-from-bracket pfi" style="color:#f43f5e"></i>', title: ar ? 'تسجيل الخروج' : 'Log out', on: () => window.logout && window.logout() }
    ]);
  };
  /* tour tip for the new option (same order as the buttons) */
  const _tt = tourTips;
  tourTips = function (key, side) {
    const r = _tt(key, side);
    if (key === 'prof' && r) r.splice(1, 0, lang === 'en' ? 'Calendar: week, month and year, with your session days marked' : lang === 'ar' ? 'التقويم: أسبوع وشهر وسنة، وأيام جلساتك معلّمة' : 'التقويم: أسبوع وشهر وسنة، وأيام سيشناتك معلّمة');
    return r;
  };
})();




/* ===== Feed star: hover pop, wiggle when there are notifications, small red badge on its top-right ===== */
(function () {
  const st = document.createElement('style');
  st.textContent = `
/* soft pop on hover / press, like the other bar buttons */
#feedBtn .fstar{transition:transform .25s cubic-bezier(.3,1.6,.5,1)}
@media(hover:hover){#feedBtn:hover .fstar{transform:rotate(-12deg) scale(1.18)}}
#feedBtn:active .fstar{transform:rotate(-12deg) scale(.94)}

/* wiggle: the star straightens a little, then tilts back (twice) */
#feedBtn .fstar.fwig{animation:fstarWig 1.6s ease-in-out 1}
@keyframes fstarWig{
  0%{transform:rotate(-12deg)}
  22%{transform:rotate(2deg) scale(1.1)}
  44%{transform:rotate(-12deg)}
  66%{transform:rotate(2deg) scale(1.1)}
  100%{transform:rotate(-12deg)}
}
@media(prefers-reduced-motion:reduce){#feedBtn .fstar.fwig{animation:none}}

/* small red badge sitting on the star's top-right corner */
html #feedBtn #feedNum{
  top:1px!important;right:1px!important;left:auto!important;bottom:auto!important;
  min-width:15px!important;height:15px!important;padding:0 4px!important;
  font:800 9px/15px Inter,Cairo,sans-serif!important;
  background:#ef4444!important;color:#fff!important;-webkit-text-fill-color:#fff!important;
  border-radius:999px!important;box-shadow:0 0 0 2px rgba(239,68,68,.25),0 2px 6px rgba(239,68,68,.55)!important;
  transform:scale(.4);transition:transform .35s cubic-bezier(.3,1.7,.5,1),opacity .25s}
html #feedBtn.num #feedNum{transform:scale(1)}
html #feedBtn #feedNum.l2{font-size:8px!important}`;
  document.head.appendChild(st);

  let played = false;
  function wiggle() {
    const b = document.getElementById('feedBtn'), s = b && b.querySelector('.fstar');
    if (!s || played || !b.classList.contains('num')) return;
    played = true;
    s.classList.remove('fwig'); void s.getBoundingClientRect(); s.classList.add('fwig');
    setTimeout(() => s.classList.remove('fwig'), 1800);
  }
  function init() {
    const b = document.getElementById('feedBtn'); if (!b) return;
    new MutationObserver(wiggle).observe(b, { attributes: true, attributeFilter: ['class'] });
    wiggle();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


/* ===== Faster notifications: parallel loading, instant badge, shorter polling ===== */
(function () {
  /* 1) load the small pieces together instead of one after another */
  const _load = window.load || load;
  load = async function () {
    if (window.__mtGate && await window.__mtGate) return;
    const t = tok();
    const dP = t ? rpc('trainee_dashboard', { p_token: t }).catch(() => ({ __net: true })) : Promise.resolve(null);
    const nP = t ? fetchNotes() : Promise.resolve([]);        // start notes + the rest at the same time as the dashboard
    const bP = t ? fetchBill() : Promise.resolve(null);
    const dnP = t ? fetchDone() : Promise.resolve([]);
    const tmP = t ? fetchTimes() : Promise.resolve({});
    const d = await dP;
    if (!d || d.__net || !d.profile) { return _load(); }      // anything unusual: fall back to the original flow
    d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0')));
    applyPrefLang(d.profile); USER_TZ = tzFromProfile(d.profile); D = d; range = 'today';
    [D.notes, D.bill, D.done, D.times] = await Promise.all([nP, bP, dnP, tmP]);
    mergeTimes();
    const sP = Array.isArray(D.scratches) ? Promise.resolve(D.scratches) : fetchScratches();
    D.scratches = await sP;
    render();
    try { initFloat(); } catch (e) { console.error('[feed]', e); try { chartsGo(); } catch (x) {} }
  };

  /* 2) show the number right away, don't wait for the intro animation */
  const _upd = updateFeed;
  updateFeed = function () {
    _upd();
    try {
      const b = document.getElementById('feedBtn'), n = feedCount();
      if (b && n > 0 && !b.classList.contains('empty')) b.classList.add('num');
    } catch (e) {}
  };

  /* 3) check for new notifications every 10 seconds (was 30), and when the tab comes back */
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { if (window._ntPoll) clearInterval(window._ntPoll); window._ntPoll = setInterval(() => { if (!document.hidden) refreshNotes(); }, 10000); }, 3000);
  });
})();


/* ===== Calm mode: nothing moves on its own. Motion only on hover / press. ===== */
(function () {
  const st = document.createElement('style');
  st.textContent = `
/* card light sweep: hidden, runs once only while hovered / pressed */
.thabit-card::before,.test-card::before{animation:none!important;opacity:0!important}
@media(hover:hover){.thabit-card:hover::before,.test-card:hover::before{opacity:.5!important;animation:thabitCardSwipeSlow 2.4s linear 1!important}}
.thabit-card:active::before,.test-card:active::before{opacity:.5!important;animation:thabitCardSwipeSlow 2.4s linear 1!important}

/* arrow under the chart, ghost, bounce arrow, pulsing circles */
.tharr .pq{animation:none!important}
.tharr:hover .pq{animation:thPls 1s ease-in-out 1!important}
#thHint .thnx{animation:none!important}
#thHint .thnx:hover{animation:thBob 1s ease-in-out 1!important}
#thGhost,#thGhost.on{animation:none!important}
#thGhost:hover{animation:ghFloat 1.2s ease-in-out 1!important}
#thGhost.on ellipse{animation:none!important;fill:#22d3a6}
#thGhost.on:hover ellipse{animation:ghEye 2.4s linear 1!important}
.itc.open{animation:none!important}
.itc.open:hover{animation:itp 1.8s 1!important}
.hnd.wv,.ittp i.ed,.itl i.ed{animation:none!important}
.lgi .plA svg g path{animation-iteration-count:2!important}

/* attention effects that played by themselves */
.tkcell.pop{animation:none!important}
.vx.vx-tap{animation:none!important}`;
  document.head.appendChild(st);
})();


/* ===== Calendar: "Submit an apology" button. Pick days / weeks / months, write the reason, send. ===== */
(function () {
  const X = {
    en: { btn: 'Submit an apology', title: 'Apology', day: 'Day', week: 'Week', month: 'Month', sel: n => n + (n === 1 ? ' day selected' : ' days selected'), none: 'Tap the days you will miss', reason: 'Reason / notes', ph: 'Write the reason here…', send: 'Send', sending: 'Sending…', sent: 'Sent ✓', fail: 'Could not send, try again', needR: 'Please write the reason', pre: 'Apology: ' },
    ar: { btn: 'تقديم اعتذار', title: 'تقديم اعتذار', day: 'يوم', week: 'أسبوع', month: 'شهر', sel: n => 'تم اختيار ' + n + ' يوم', none: 'اضغط على الأيام التي ستغيب عنها', reason: 'السبب / ملاحظات', ph: 'اكتب السبب هنا…', send: 'إرسال', sending: 'جاري الإرسال…', sent: 'تم الإرسال ✓', fail: 'تعذر الإرسال، حاول مرة أخرى', needR: 'اكتب السبب من فضلك', pre: 'اعتذار: ' },
    eg: { btn: 'تقديم اعتذار', title: 'تقديم اعتذار', day: 'يوم', week: 'أسبوع', month: 'شهر', sel: n => 'اخترت ' + n + ' يوم', none: 'دوس على الأيام اللي هتغيب فيها', reason: 'السبب / ملاحظات', ph: 'اكتب السبب هنا…', send: 'ابعت', sending: 'بيتبعت…', sent: 'اتبعت ✓', fail: 'معرفناش نبعت، جرب تاني', needR: 'اكتب السبب الأول', pre: 'اعتذار: ' }
  };
  const T3 = () => X[lang] || X.en, loc = () => lang === 'en' ? 'en-GB' : 'ar-EG';
  const P = s => new Date(s + 'T00:00:00Z'), Y = d => d.toISOString().slice(0, 10), AD = (d, n) => new Date(d.getTime() + n * 864e5);
  const WS = d => AD(d, -((d.getUTCDay() + 1) % 7));
  const dim = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const fmt = (d, o) => d.toLocaleDateString(loc(), Object.assign({ timeZone: 'UTC' }, o));
  const num = n => n.toLocaleString(loc(), { useGrouping: false });
  let mode = 'day', sel = new Set(), vm = null, busy = false;

  const st = document.createElement('style');
  st.textContent = `
#thCal .cexb{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:14px;padding:10px;border-radius:14px;border:1px dashed rgba(251,191,36,.6);background:rgba(251,191,36,.08);color:#fbbf24;font:700 .8rem Inter,Cairo,sans-serif;cursor:pointer}
body.light-theme #thCal .cexb{color:#92400e}
#thExc{position:fixed;inset:0;z-index:10035;display:none;align-items:center;justify-content:center;padding:14px;background:rgba(2,6,23,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
#thExc.open{display:flex;animation:tdIn .2s ease-out}
#thExc .xb{box-sizing:border-box;width:min(440px,100%);max-height:100%;overflow:auto;border-radius:24px;padding:14px;background:#0f172a;color:#f1f5f9;border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 60px rgba(0,0,0,.5);animation:thPop .3s cubic-bezier(.2,.9,.3,1.15)}
body.light-theme #thExc .xb{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.12)}
#thExc .xh{display:flex;align-items:center;gap:6px;margin-bottom:10px}
#thExc .xt{flex:1;text-align:center;font-weight:800}
#thExc .xc{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:rgba(148,163,184,.18);color:inherit;cursor:pointer;font-size:.8rem}
html[dir=rtl] #thExc .xc i{transform:scaleX(-1)}
#thExc .xm{display:flex;gap:6px;margin-bottom:10px}
#thExc .xm button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px 4px;border-radius:12px;border:1px solid rgba(148,163,184,.4);background:transparent;color:inherit;font:700 .76rem Inter,Cairo,sans-serif;cursor:pointer}
#thExc .xm button.on{border-color:#fbbf24;background:rgba(251,191,36,.16);color:#fbbf24}
body.light-theme #thExc .xm button.on{color:#92400e}
#thExc .xg{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
#thExc .xw{text-align:center;font-size:.66rem;font-weight:700;opacity:.55}
#thExc .xd{aspect-ratio:1;min-width:0;padding:0;border:1px solid transparent;border-radius:12px;background:transparent;color:inherit;font:600 .85rem Inter,Cairo,sans-serif;cursor:pointer}
#thExc .xd.out{opacity:.25}
#thExc .xd.past{opacity:.25;cursor:default;text-decoration:line-through}
#thExc .xd.td{border-color:#fbbf24}
#thExc .xd.s{background:#fbbf24;color:#111}
#thExc .xs{margin:10px 0 4px;text-align:center;font-size:.8rem;font-weight:700;color:#fbbf24}
body.light-theme #thExc .xs{color:#92400e}
#thExc .xr{margin-top:6px;font-size:.74rem;opacity:.7;text-align:center;overflow-wrap:anywhere}
#thExc .xf{margin-top:10px;animation:rqFade .3s ease-out}
#thExc .xf[hidden]{display:none}
#thExc .xf label{display:block;margin:0 2px 6px;font-size:.74rem;font-weight:700;opacity:.8}
#thExc textarea{display:block;width:100%;box-sizing:border-box;margin:0;padding:12px;border-radius:14px;border:1px solid rgba(148,163,184,.4);background:rgba(148,163,184,.1);color:inherit;font:500 .9rem Inter,Cairo,sans-serif;outline:0;resize:vertical}
body.light-theme #thExc textarea{background:#fff;color:#0f172a}
#thExc .xe{margin-top:8px;color:#fb7185;font-size:.78rem;font-weight:600}
#thExc .xe:empty{display:none}
#thExc .xsend{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:12px;padding:12px;border:0;border-radius:14px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#111;font:800 .9rem Inter,Cairo,sans-serif;cursor:pointer}
#thExc .xsend:disabled{opacity:.7;cursor:default}
#thExc .xsend.ok{background:linear-gradient(135deg,#34d399,#10b981);color:#04231a}`;
  document.head.appendChild(st);

  
  const ov = document.createElement('div'); ov.id = 'thExc'; ov.innerHTML = '<div class="xb"></div>';
  document.body.appendChild(ov);
  const xb = ov.querySelector('.xb');

  function build() {
    const t = T3();
    xb.innerHTML = `<div class="xh"><button type="button" class="xc" data-a="prev"><i class="fa-solid fa-chevron-left"></i></button><div class="xt" id="xT"></div><button type="button" class="xc" data-a="next"><i class="fa-solid fa-chevron-right"></i></button><button type="button" class="xc" data-a="close">&times;</button></div>`
      + `<div class="xm" id="xM"></div><div class="xg" id="xG"></div><div class="xs" id="xS"></div><div class="xr" id="xR"></div>`
      + `<div class="xf" id="xF" hidden><label>${esc(t.reason)} <b style="color:#f87171">*</b></label><textarea id="xTxt" rows="3" maxlength="1200" placeholder="${esc(t.ph)}"></textarea><div class="xe" id="xE"></div><button type="button" class="xsend" id="xSend" data-a="send"><i class="fa-solid fa-paper-plane"></i><span>${esc(t.send)}</span></button></div>`;
    paint();
  }
  function ranges() {
    const a = [...sel].sort(), out = []; let s = null, p = null;
    a.forEach(k => { if (s && Y(AD(P(p), 1)) === k) p = k; else { if (s) out.push([s, p]); s = p = k; } });
    if (s) out.push([s, p]);
    return out.map(r => r[0] === r[1] ? r[0] : r[0] + ' → ' + r[1]);
  }
  function paint() {
    const t = T3(), today = itToday(), y = vm.getUTCFullYear(), m = vm.getUTCMonth(), first = new Date(Date.UTC(y, m, 1)), st0 = WS(first), rows = Math.ceil(((first - st0) / 864e5 + dim(y, m)) / 7);
    xb.querySelector('#xT').textContent = fmt(vm, { month: 'long', year: 'numeric' });
    xb.querySelector('#xM').innerHTML = ['day', 'week', 'month'].map(k => `<button type="button" data-m="${k}" class="${k === mode ? 'on' : ''}"><i class="fa-regular ${k === mode ? 'fa-square-check' : 'fa-square'}"></i>${t[k]}</button>`).join('');
    const wk = WS(P('2024-01-06'));
    xb.querySelector('#xG').innerHTML = Array.from({ length: 7 }, (_, i) => `<div class="xw">${fmt(AD(wk, i), { weekday: 'short' })}</div>`).join('')
      + Array.from({ length: rows * 7 }, (_, i) => { const d = AD(st0, i), k = Y(d); return `<button type="button" class="xd${d.getUTCMonth() === m ? '' : ' out'}${k < today ? ' past' : ''}${k === today ? ' td' : ''}${sel.has(k) ? ' s' : ''}" data-d="${k}">${num(d.getUTCDate())}</button>`; }).join('');
    xb.querySelector('#xS').textContent = sel.size ? t.sel(sel.size) : t.none;
    xb.querySelector('#xR').textContent = ranges().join('  ·  ');
    xb.querySelector('#xF').hidden = !sel.size;
  }
  function pick(k) {
    const d = P(k), today = itToday(); let list;
    if (mode === 'day') list = [k];
    else if (mode === 'week') { const a = WS(d); list = Array.from({ length: 7 }, (_, i) => Y(AD(a, i))); }
    else { const y = d.getUTCFullYear(), m = d.getUTCMonth(); list = Array.from({ length: dim(y, m) }, (_, i) => Y(new Date(Date.UTC(y, m, i + 1)))); }
    list = list.filter(x => x >= today); if (!list.length) return;
    const all = list.every(x => sel.has(x)); list.forEach(x => all ? sel.delete(x) : sel.add(x));
    paint();
  }
  async function send() {
    if (busy) return;
    const t = T3(), txt = xb.querySelector('#xTxt'), er = xb.querySelector('#xE'), btn = xb.querySelector('#xSend'), reason = txt.value.trim();
    if (!sel.size) return;
    if (!reason) { er.textContent = t.needR; txt.focus(); return; }
    er.textContent = ''; busy = true; btn.disabled = true; btn.querySelector('span').textContent = t.sending;
    const rg = ranges(), title = (X.en.pre + rg.join(', ')).slice(0, 140);
    const msg = `[REQUEST] ${title}\n[DETAILS] ${reason}\n\n[EXPECTED DURATION] ${sel.size} days`.slice(0, 2000);
    const ok = await rpc('trainee_send_request', { p_token: tok(), p_type: 'session', p_message: msg }).catch(() => null);
    if (ok === true) {
      rpc('trainee_submit_report', { p_token: tok(), p_type: 'session', p_title: title, p_details: (reason + '\n\n' + rg.join('\n')).slice(0, 1500), p_follow: rg.join(', ').slice(0, 200) }).catch(() => null);
      btn.classList.add('ok'); btn.querySelector('span').textContent = t.sent;
      try { rqRefresh(); } catch (e) {}
      setTimeout(() => { close(); }, 1100);
    } else { busy = false; btn.disabled = false; btn.querySelector('span').textContent = t.send; er.textContent = t.fail; }
    if (ok === true) busy = false;
  }
  function open() { sel = new Set(); mode = 'day'; vm = new Date(Date.UTC(+itToday().slice(0, 4), +itToday().slice(5, 7) - 1, 1)); busy = false; build(); ov.classList.add('open'); }
  function close() { ov.classList.remove('open'); }
  window.openExcuse = open;

  xb.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'), m = e.target.closest('[data-m]'), d = e.target.closest('.xd[data-d]');
    if (a) {
      const k = a.dataset.a;
      if (k === 'close') close();
      else if (k === 'send') send();
      else { vm = new Date(Date.UTC(vm.getUTCFullYear(), vm.getUTCMonth() + (k === 'next' ? 1 : -1), 1)); paint(); }
    } else if (m) { mode = m.dataset.m; paint(); }
    else if (d && !d.classList.contains('past')) pick(d.dataset.d);
  });
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('open')) { e.stopImmediatePropagation(); close(); } }, true);

  /* put the button at the bottom of the calendar (it is redrawn on every page / view change) */
  const cal = document.querySelector('#thCal .cbox');
  if (cal) {
    const add = () => {
      if (cal.querySelector('.cexb')) return;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'cexb';
      b.innerHTML = `<i class="fa-regular fa-calendar-xmark"></i><span>${esc(T3().btn)}</span>`;
      b.onclick = open; cal.appendChild(b);
    };
    new MutationObserver(add).observe(cal, { childList: true });
    add();
  }
})();



/* ===== Dotted bars, one-time card glow, bigger moon / reload, icon-only pop-outs, yellow date calendar icon ===== */
(function () {
  const st = document.createElement('style'); st.id = 'thDotsUI';
  st.textContent = `
/* 1) bottom bar + top header: same colour, tiny soft dots */
html #mobileFloatingBar,.thHdr{
  background-color:#181c20!important;
  background-image:radial-gradient(circle,rgba(255,255,255,.13) 1px,transparent 1.3px)!important;
  background-size:9px 9px!important;background-position:0 0!important;
  -webkit-backdrop-filter:none!important;backdrop-filter:none!important}
html #mobileFloatingBar{border:1px solid rgba(255,255,255,.07)!important}
body.light-theme #mobileFloatingBar,body.light-theme .thHdr{
  background-color:#eef1f5!important;
  background-image:radial-gradient(circle,rgba(15,23,42,.14) 1px,transparent 1.3px)!important}

/* 2) cards: no light at all, except one soft pass (class added once per section) */
html .thabit-card::before,html .test-card::before{animation:none!important;opacity:0!important}
html .thabit-card.lit1::before,html .test-card.lit1::before{opacity:.3!important;animation:thabitCardSwipeSlow 2.4s linear 1!important}

/* 3) bigger moon + reload (sun and the rest stay as they are) */
html #mobileFloatingBar #themeIcon.fa-moon{font-size:25px!important}
html #mobileFloatingBar [data-bk="reload"] i{font-size:25px!important}

/* 4) pop-out icons: no border, no background, just the icon */
html .lgi,html .pkfly{background:none!important;border:0!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
html .lgi svg,html .lgi i,html .lgi .plA,html .lgi .plS,html .pkfly svg,html .pkfly i{filter:drop-shadow(0 2px 5px rgba(0,0,0,.65))}
html .lgi.cur{color:#fbbf24!important}
html .lgi:hover{transform:scale(1.12)}



/* calendar icon with today's date */
.calico{position:relative;display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center}
.calico svg{width:30px;height:30px;display:block}`;
  document.head.appendChild(st);

  /* top header: find the fixed bar at the top of the page (the one with the logo) and tag it */
  function tagHeader() {
    const skip = new Set(['mobileFloatingBar', 'pop', 'thDet', 'thHint', 'langPop', 'asm', 'thGhost', 'dock', 'thBri', 'barTip', 'thGH']);   /* thGH = the new glass header: it must never get the old header look (dots / dark background) */
    const gh = document.getElementById('thGH'); if (gh) gh.classList.remove('thHdr');
    [...document.body.children].forEach(el => {
      if (!el.id || !skip.has(el.id)) {
        const cs = getComputedStyle(el), r = el.getBoundingClientRect();
        if ((cs.position === 'fixed' || cs.position === 'sticky') && r.top < 6 && r.width > innerWidth * 0.5 && r.height > 20 && r.height < 130 && el.tagName !== 'SECTION' && !skip.has(el.id)) el.classList.add('thHdr');
      }
    });
  }
  [300, 1200, 3000].forEach(t => setTimeout(tagHeader, t));
  window.addEventListener('load', tagHeader);

  /* one soft glow the first time each page section comes into view */
  const seen = new Set();
  function watchSections() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) { seen.delete(e.target.id); return; } if (seen.has(e.target.id)) return;
      seen.add(e.target.id);
      const cards = [...e.target.querySelectorAll('.thabit-card,.test-card')];
      cards.forEach(c => c.classList.add('lit1'));
      setTimeout(() => cards.forEach(c => c.classList.remove('lit1')), 1800);
    }), { threshold: [0, 0.35] });
    document.querySelectorAll('.thsec').forEach(s => io.observe(s));
  }
  setTimeout(watchSections, 800);

  /* theme button: outline moon / sun after every toggle */
  const fixTheme = () => { const i = document.getElementById('themeIcon'); if (i && i.classList.contains('fa-solid')) { i.classList.remove('fa-solid'); i.classList.add('fa-regular'); } };
  document.addEventListener('DOMContentLoaded', () => { const i = document.getElementById('themeIcon'); fixTheme(); if (i) new MutationObserver(fixTheme).observe(i, { attributes: true, attributeFilter: ['class'] }); });

  /* account pop-out: calendar icon = yellow outline with today's date number */
  function calIcon() {
    const d = parseInt(itToday().slice(8), 10);
    return '<span class="calico"><svg viewBox="0 0 32 32" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="6" width="23" height="21.5" rx="5"/><path d="M4.5 12.5h23M10.5 3.5v5M21.5 3.5v5"/><text x="16" y="23.4" text-anchor="middle" font-family="Inter,Cairo,sans-serif" font-weight="800" font-size="11" stroke="none" fill="#fbbf24">' + d + '</text></svg></span>';
  }
  window.openProf = function (btn) {
    const ar = lang !== 'en', cal = lang === 'en' ? 'Calendar' : 'التقويم';
    window.thPick(btn || document.getElementById('profBtn'), [
      { html: '<i class="fa-regular fa-user pfi"></i>', title: ar ? 'ملفي' : 'Profile', on: () => Panels.open('profile') },
      { html: calIcon(), title: cal, on: () => window.openCal && window.openCal() },
      { html: '<i class="fa-solid fa-right-from-bracket pfi" style="color:#f43f5e"></i>', title: ar ? 'تسجيل الخروج' : 'Log out', on: () => window.logout && window.logout() }
    ]);
  };
})();


/* ===== One fixed size system: everything follows the Settings button ===== */
(function () {
  const old = document.getElementById('thSizeFix'); if (old) old.remove();
  const st = document.createElement('style'); st.id = 'thSizeFix';
  st.textContent = `
/* --- bottom bar: every button the same box, every icon the same size as the Settings icon --- */
html #mobileFloatingBar>[data-bk],html #mobileFloatingBar #barEdit,html #mobileFloatingBar #langBtn,html #mobileFloatingBar>.feed{
  width:44px!important;height:44px!important;min-width:44px!important;max-width:44px!important}
html #mobileFloatingBar .circle-badge-btn i,
html #mobileFloatingBar #themeIcon,
html #mobileFloatingBar #themeIcon.fa-moon,
html #mobileFloatingBar [data-bk="reload"] i,
html #mobileFloatingBar #barEdit i{font-size:21px!important;line-height:1!important}
html #mobileFloatingBar #plusBtn svg,
html #mobileFloatingBar #profBtn svg,
html #mobileFloatingBar svg.asv{width:24px!important;height:24px!important}
html #mobileFloatingBar>.feed .fstar{width:26px!important;height:26px!important}
html #mobileFloatingBar #langBtn{font-size:15px!important}

/* --- pop-out icons: all the same size as the icons inside the Settings pop-out --- */
html #langPop .lgi i,
html #langPop .lgi .pfi,
html #langPop .lgi>i,
html #langPop .lgi .plS,
html #langPop .lgi .plS i,
html .pkfly i{font-size:20px!important;line-height:1!important}
html #langPop .lgi svg,
html #langPop .lgi .plA svg,
html #langPop .lgi svg:not(.asv){width:21px!important;height:21px!important}
html #langPop .lgi .calico,
html #langPop .lgi .calico svg{width:23px!important;height:23px!important}
html #langPop .lgi .plA,html #langPop .lgi .plS{width:100%;height:100%}`;
  document.head.appendChild(st);
})();

/* ===== Top header (#thBrand) = same look as the bottom bar ===== */
(function () {
  const old = document.getElementById('thHdrSame'); if (old) old.remove();
  const st = document.createElement('style'); st.id = 'thHdrSame';
  st.textContent = `
html #thBrand{
  background-color:#181c20!important;
  background-image:radial-gradient(circle,rgba(255,255,255,.13) 1px,transparent 1.3px)!important;
  background-size:9px 9px!important;background-position:0 0!important;
  border:0!important;border-bottom:1px solid rgba(255,255,255,.07)!important;
  box-shadow:none!important;
  -webkit-backdrop-filter:none!important;backdrop-filter:none!important}
body.light-theme~#thBrand,body.light-theme #thBrand{
  background-color:#eef1f5!important;
  background-image:radial-gradient(circle,rgba(15,23,42,.14) 1px,transparent 1.3px)!important;
  border-bottom-color:rgba(15,23,42,.08)!important}`;
  document.head.appendChild(st);
})();

/* ===== Light theme fix: bar + header turn white with visible dots ===== */
(function () {
  const old = document.getElementById('thLightFix'); if (old) old.remove();
  const st = document.createElement('style'); st.id = 'thLightFix';
  st.textContent = `
html body.light-theme #mobileFloatingBar,
html body.light-theme~#thBrand,html body.light-theme #thBrand{
  background-color:#f4f6f9!important;
  background-image:radial-gradient(circle,rgba(15,23,42,.30) 1.1px,transparent 1.5px)!important;
  background-size:9px 9px!important;
  border-color:rgba(15,23,42,.12)!important;
  box-shadow:none!important}
html body.light-theme~#thBrand,html body.light-theme #thBrand{
  border:0!important;border-bottom:1px solid rgba(15,23,42,.12)!important;color:#0f172a!important}
html body.light-theme #mobileFloatingBar{border:1px solid rgba(15,23,42,.12)!important}`;
  document.head.appendChild(st);
})();

/* ===== Taller bar with labels + centered pop-out menu (lower quarter of the screen) ===== */
(function () {
  const LBL = {
    reload: { en: 'Reload', ar: 'تحديث', eg: 'تحديث' },
    assist: { en: 'Add', ar: 'إضافة', eg: 'إضافة' },
    lang: { en: 'Language', ar: 'اللغة', eg: 'اللغة' },
    theme: { en: 'Theme', ar: 'الوضع', eg: 'الوضع' },
    logout: { en: 'Profile', ar: 'الحساب', eg: 'الحساب' },
    feed: { en: 'Feed', ar: 'فيد', eg: 'فيد' },
    edit: { en: 'More', ar: 'المزيد', eg: 'المزيد' },
    space: { en: 'Space', ar: 'سبيس', eg: 'سبيس' }
  };
  const L = () => (typeof lang !== 'undefined' && lang) || 'en';

  const st = document.createElement('style'); st.id = 'thLabels';
  st.textContent = `
html body #mobileFloatingBar>[data-bk],html body #mobileFloatingBar #barEdit,html body #mobileFloatingBar #langBtn,html body #mobileFloatingBar>.feed{
  width:60px!important;min-width:60px!important;max-width:60px!important;height:58px!important;
  flex-direction:column!important;gap:3px!important;justify-content:center!important;align-items:center!important;border-radius:12px!important}
html body #mobileFloatingBar{height:calc(70px + env(safe-area-inset-bottom,0px))!important}
.thl{display:block;font:700 9.5px/1.1 Cairo,Inter,sans-serif;opacity:.8;white-space:nowrap;color:#cbd5e1;letter-spacing:0;pointer-events:none}
body.light-theme .thl{color:#334155}
html body #mobileFloatingBar #langBtn{font-size:15px!important}
html body #mobileFloatingBar #feedBtn #feedNum{top:0!important;right:8px!important}

#thMenu{position:fixed;inset:0;z-index:10025;display:none;background:rgba(2,6,23,.4);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
body.light-theme #thMenu{background:rgba(255,255,255,.4)}
#thMenu.open{display:block;animation:tdIn .2s ease-out}
#thMenu .tmr{position:absolute;left:0;right:0;top:66%;display:flex;flex-wrap:wrap;justify-content:center;gap:22px 26px;padding:0 18px}
#thMenu .tmi{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:76px;background:none;border:0;padding:0;color:#f1f5f9;cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:0;animation:tmIn .35s cubic-bezier(.2,.9,.3,1.2) forwards;animation-delay:calc(var(--i,0)*.06s)}
body.light-theme #thMenu .tmi{color:#0f172a}
#thMenu .tmi .tic{width:46px;height:46px;display:flex;align-items:center;justify-content:center;font-size:26px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.55))}
#thMenu .tmi .tic svg{width:30px;height:30px}
#thMenu .tmi .tlb{font:700 .78rem Cairo,Inter,sans-serif;text-align:center;max-width:110px}
#thMenu .tmi:active{transform:scale(.92)}
@keyframes tmIn{from{opacity:0;transform:translateY(14px) scale(.85)}to{opacity:1;transform:none}}`;
  document.head.appendChild(st);

  
  /* ---- labels under the bar buttons ---- */
  function labels() {
    const bar = document.getElementById('mobileFloatingBar'); if (!bar) return;
    const map = [['[data-bk="reload"]', 'reload'], ['#plusBtn', 'assist'], ['#langBtn', 'lang'], ['#floatBtnTheme', 'theme'], ['#profBtn', 'logout'], ['#feedBtn', 'feed'], ['#barEdit', 'edit'], ['#spaceBtn', 'space']];
    map.forEach(([sel, k]) => {
      const b = bar.querySelector(sel); if (!b) return;
      let s = b.querySelector(':scope>.thl'); if (!s) { s = document.createElement('span'); s.className = 'thl'; b.appendChild(s); }
      s.textContent = LBL[k][L()] || LBL[k].en;
    });
    const eb = bar.querySelector('#barEdit'), ic = eb && eb.querySelector(':scope>i');   /* Settings became More (+) */
    if (ic && !ic.classList.contains('fa-plus')) ic.className = 'fa-solid fa-plus text-sm';
  }
  [100, 600, 1500, 3500].forEach(t => setTimeout(labels, t));
  new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const fb = () => document.getElementById('feedBtn'); const iv = setInterval(() => { if (fb() && fb().parentNode === document.getElementById('mobileFloatingBar')) { labels(); clearInterval(iv); } }, 500);

  /* ---- centered menu ---- */
  const menu = document.createElement('div'); menu.id = 'thMenu'; menu.innerHTML = '<div class="tmr"></div>';
  document.body.appendChild(menu);
  const row = menu.querySelector('.tmr');
  const close = () => menu.classList.remove('open');
  menu.addEventListener('click', e => { if (e.target === menu || e.target === row) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  function show(items) {
    row.innerHTML = '';
    items.forEach((it, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tmi'; b.style.setProperty('--i', i);
      b.innerHTML = `<span class="tic">${it.icon}</span><span class="tlb" dir="auto">${it.label}</span>`;
      b.onclick = e => { e.stopPropagation(); close(); setTimeout(it.on, 60); };
      row.appendChild(b);
    });
    menu.classList.add('open');
  }
  const t3 = (a, b, c) => L() === 'en' ? a : (L() === 'ar' ? b : c);

  const ASSIST = '<svg viewBox="0 0 32 32" fill="#34d399"><path d="M11.5 4.5c-3.6 0-6.5 2.9-6.5 6.5 0 2.1.9 3.9 2.4 5.2.5.4.8 1 .8 1.7V21h7.6v-3h1.3c.9 0 1.6-.7 1.6-1.6v-2.1l1.4-.7c.5-.2.6-.8.3-1.2l-2-2.9C18.6 6.4 15.4 4.5 11.5 4.5z"/><path d="M7.4 23.5c0-1 .8-1.8 1.8-1.8h6.6c1 0 1.8.8 1.8 1.8V27H7.4z"/><g fill="none" stroke="#34d399" stroke-width="1.7" stroke-linecap="round"><path d="M23.6 10.2l3.2-1.2"/><path d="M24.2 13.4h3.6"/><path d="M23.6 16.6l3.2 1.2"/></g></svg>';
  const calIcon = () => '<svg viewBox="0 0 32 32" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="6" width="23" height="21.5" rx="5"/><path d="M4.5 12.5h23M10.5 3.5v5M21.5 3.5v5"/><text x="16" y="23.4" text-anchor="middle" font-family="Inter,Cairo,sans-serif" font-weight="800" font-size="11" stroke="none" fill="#fbbf24">' + parseInt(itToday().slice(8), 10) + '</text></svg>';

  window.openPlus = () => show([
    { icon: ASSIST, label: t3('Assistant', 'المساعد', 'المساعد'), on: () => Panels.open('assistant') },
    { icon: '<i class="fa-solid fa-paper-plane" style="color:#38bdf8"></i>', label: t3('Requests', 'الطلبات', 'الطلبات'), on: () => openRq() }
  ]);
  window.openLang = () => {
    const nm = { en: 'English', ar: 'عربي', eg: 'مصري' };
    show(['en', 'ar', 'eg'].filter(x => x !== L()).map(x => ({ icon: `<span style="font:800 15px Inter,Cairo,sans-serif">${x === 'en' ? 'EN' : x === 'ar' ? 'عربي' : 'مصري'}</span>`, label: nm[x], on: () => setLanguage(x) })));
  };
  window.openProf = () => show([
    { icon: '<i class="fa-regular fa-user"></i>', label: t3('Profile', 'ملفي', 'ملفي'), on: () => Panels.open('profile') },
    { icon: calIcon(), label: t3('Calendar', 'التقويم', 'التقويم'), on: () => window.openCal && window.openCal() },
    { icon: '<i class="fa-solid fa-right-from-bracket" style="color:#f43f5e"></i>', label: t3('Log out', 'تسجيل الخروج', 'تسجيل الخروج'), on: () => window.logout && window.logout() }
  ]);
  window.openStar = () => {
    const U = UIT[L()] || UIT.en;
    show([
      { icon: '<i class="fa-solid fa-circle-half-stroke"></i>', label: t3('Theme', 'الوضع', 'الوضع'), on: () => toggleTheme() },
      { icon: '<i class="fa-regular fa-user"></i>', label: t3('Profile', 'الحساب', 'الحساب'), on: () => window.openProf && window.openProf() },
      { icon: '<i class="fa-solid fa-globe"></i>', label: t3('Language', 'اللغة', 'اللغة'), on: () => window.openLang && window.openLang() },
      { icon: '<i class="fa-solid fa-text-height"></i>', label: U.zoom, on: () => startAdjust('zoom') },
      { icon: '<i class="fa-solid fa-sun"></i>', label: U.bri, on: () => startAdjust('bri') }
    ]);
  };
})();

/* ===== Fixes: badge over the corner; light theme = dots never sit on the written text; header theme ===== */
(function () {
  const st = document.createElement('style'); st.id = 'thFixes2'; st.textContent = `
/* notification number: straddles the star's corner, nothing clips it */
html #mobileFloatingBar,html #mobileFloatingBar>.feed,html #feedBtn,html #feedBtn .fdp{overflow:visible!important}
html body #mobileFloatingBar #feedBtn #feedNum{top:3px!important;left:calc(50% + 9px)!important;right:auto!important;z-index:5!important;box-shadow:0 0 0 2px #181c20!important}
html body.light-theme #mobileFloatingBar #feedBtn #feedNum{box-shadow:0 0 0 2px #f4f6f9!important}
/* bar buttons: equal slices (even spacing), icon centred in the upper part, every label on the same line */
html body #mobileFloatingBar>[data-bk]:not(#z),html body #mobileFloatingBar #barEdit:not(#z),html body #mobileFloatingBar>.feed:not(#z){flex:1 1 0!important;width:auto!important;min-width:0!important;max-width:76px!important;position:relative!important;padding:0 0 16px!important;justify-content:center!important;margin:0!important}
html body #mobileFloatingBar .thl{position:absolute!important;left:0;right:0;bottom:5px;text-align:center}
/* theme button: never moves, never tilts, the sun/moon swap happens inside a fixed box */
html body #mobileFloatingBar #floatBtnTheme:not(#z),html body #mobileFloatingBar #floatBtnTheme:not(#z):hover,html body #mobileFloatingBar #floatBtnTheme:not(#z):active,html body #mobileFloatingBar #floatBtnTheme:not(#z):focus{transform:none!important;transition:none!important;translate:none!important;rotate:none!important;outline:0!important}
html body #mobileFloatingBar #themeIcon:not(#z){display:flex!important;align-items:center;justify-content:center;width:26px;height:26px;transform:none!important;transition:none!important;font-size:21px!important;line-height:1!important}
/* light theme: softer dots + a clear patch around the bar labels and the header name */
html body.light-theme #mobileFloatingBar,html body.light-theme~#thBrand,html body.light-theme #thBrand{background-image:radial-gradient(circle,rgba(15,23,42,.13) 1.1px,transparent 1.5px)!important}
html body.light-theme .thl{opacity:1;color:#1e293b;text-shadow:0 0 2px #f4f6f9,0 0 2px #f4f6f9,0 0 4px #f4f6f9,0 0 4px #f4f6f9,0 0 6px #f4f6f9}
html body.light-theme~#thBrand .thb-n,html body.light-theme #thBrand .thb-n{text-shadow:0 0 2px #f4f6f9,0 0 2px #f4f6f9,0 0 4px #f4f6f9,0 0 4px #f4f6f9}
/* chart details: axis text drawn over the dots and never blocks taps; light theme dots get a clean ring */
svg.c2 .tx{pointer-events:none}
body.light-theme svg.c2 .tx{paint-order:stroke;stroke:rgba(255,255,255,.95);stroke-width:3px;stroke-linejoin:round}
body.light-theme svg.c2 .dot:not(.hit){filter:none!important;stroke:#fff;stroke-width:1.2px}
body.light-theme #barTip{background:#fff!important;color:#0f172a!important;border:1px solid rgba(15,23,42,.15)!important;box-shadow:0 6px 18px rgba(15,23,42,.18)!important}
#barTip{pointer-events:none}`;
  document.head.appendChild(st);
})();


/* ==========================================================
   Dispute: a closed (missed) Task / Dandana can be disputed from the Log / History.
   1) "I did it for real but forgot to check it here" -> a request goes to the trainer (trainee_send_request + trainee_submit_report,
      so it lands in Requests / Reports in Supabase), the score is given back by the server function trainee_dispute_item,
      and a notification tells him we believe him.
   2) "I didn't do it, neither for real nor here" -> nothing changes, a notification tells him his score stays.
   One dispute per item (remembered on this device and, when the server function exists, on the server).
   ========================================================== */
(function () {
  const DK = 'thabit_disputes', NK = 'thabit_local_notes';
  const X = {
    en: { btn: 'Dispute', ttl: 'What really happened?', o1: 'I did it for real, but forgot to check it here', o2: "I didn't do it, neither for real nor here", sending: 'Sending…', fail: 'Could not send, try again', sent1: 'Dispute sent', sent2: 'Score unchanged', close: 'Close',
      n1t: 'Dispute accepted', n1b: (t, a, b) => `Done, we trust you. The score for “${t}” is back.${a != null ? ` Your compliance is now ${a}${b != null ? ` (was ${b})` : ''}.` : ''} You can see it in the dashboard.`, left: 'Dispute open for', expired: 'The 24-hour dispute window for this item has ended', already: 'You already disputed this item', nothing: 'Nothing to restore: this item has no missed checks',
      n1pt: 'Dispute received', n1pb: t => `We received your dispute for “${t}”. The trainer will review it and you will be notified.`,
      n2t: 'Your score stays the same', n2b: t => `Unfortunately your compliance score for “${t}” will not change, because you did not do it, neither for real nor here. Try to finish the next one before its deadline.` },
    ar: { btn: 'اعتراض', ttl: 'ماذا حدث فعلًا؟', o1: 'أنجزتها فعلًا لكن نسيت تأشيرها هنا', o2: 'لم أنجزها، لا فعليًا ولا هنا', sending: 'جارٍ الإرسال…', fail: 'تعذر الإرسال، حاول مرة أخرى', sent1: 'تم إرسال الاعتراض', sent2: 'الدرجة لم تتغير', close: 'إغلاق',
      n1t: 'تم قبول الاعتراض', n1b: (t, a, b) => `تم، نحن نصدّقك. عادت درجتك في «${t}».${a != null ? ` أصبح التزامك الآن ${a}${b != null ? ` (كان ${b})` : ''}.` : ''} يمكنك رؤيته في لوحة البيانات.`, left: 'الاعتراض متاح لمدة', expired: 'انتهت مهلة الاعتراض (24 ساعة) لهذا العنصر', already: 'سبق أن اعترضت على هذا العنصر', nothing: 'لا يوجد ما يُستعاد: لا توجد فحوصات فائتة في هذا العنصر',
      n1pt: 'تم استلام اعتراضك', n1pb: t => `استلمنا اعتراضك على «${t}». سيراجعه المدرب وسيصلك إشعار.`,
      n2t: 'درجتك لن تتغير', n2b: t => `للأسف لن تتغير درجتك في الالتزام بخصوص «${t}»، لأنك لم تنجزها لا فعليًا ولا هنا. حاول إنهاء القادمة قبل موعدها النهائي.` },
    eg: { btn: 'اعتراض', ttl: 'إيه اللي حصل بجد؟', o1: 'عملتها بجد بس نسيت أشيّكها هنا', o2: 'ما عملتهاش، لا بجد ولا هنا', sending: 'بيتبعت…', fail: 'معرفناش نبعت، جرب تاني', sent1: 'الاعتراض اتبعت', sent2: 'الدرجة زي ما هي', close: 'إغلاق',
      n1t: 'الاعتراض اتقبل', n1b: (t, a, b) => `تمام، صدّقناك. الدرجة بتاعة «${t}» رجعت.${a != null ? ` الالتزام بتاعك بقى ${a}${b != null ? ` (كان ${b})` : ''}.` : ''} تقدر تشوفه في الداشبورد.`, left: 'الاعتراض متاح لمدة', expired: 'مهلة الاعتراض (24 ساعة) خلصت على العنصر ده', already: 'انت اعترضت على العنصر ده قبل كده', nothing: 'مفيش حاجة تترجع: العنصر ده مفيهوش شيكات فاتت',
      n1pt: 'استلمنا اعتراضك', n1pb: t => `استلمنا اعتراضك على «${t}». المدرب هيراجعه وهيوصلك إشعار.`,
      n2t: 'درجتك زي ما هي', n2b: t => `للأسف رقمك في الكومبلاينس في «${t}» مش هيتغير، لأنك ما خلصتهاش لا بجد ولا هنا. حاول تخلّص الجاية قبل الديدلاين.` }
  };
  const T = () => X[lang] || X.en;
  const rd = k => { try { return JSON.parse(localStorage.getItem(k) || (k === NK ? '[]' : '{}')) || (k === NK ? [] : {}); } catch (e) { return k === NK ? [] : {}; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  window.thLocalNotes = () => rd(NK).filter(n => n && Date.now() - Date.parse(n.created_at) < 864e5);
  const addNote = (title, body, cat) => {
    const a = rd(NK).filter(n => Date.now() - Date.parse(n.created_at) < 864e5); a.push({ id: null, kind: 'dispute', title, body, created_at: new Date().toISOString(), read_at: null, meta: { category: cat } });
    wr(NK, a); try { updateFeed(); } catch (e) {}
  };

  /* the dispute stays open for 24 hours after the item closed (its deadline), then it is over */
  const WIN = 864e5, dispLeft = x => { const p = x && x.plan; return p && p.deadline ? p.deadline + WIN - cairoNow() : -1; };
  window.thDispHtml = x => {
    if (VIEW || !x || itState(x).k !== 'closed') return '';
    const t = T(), got = rd(DK)[x.id];
    if (got) return `<div class="thdst"><i class="fa-solid ${got === 'did' ? 'fa-circle-check' : 'fa-ban'}"></i> ${esc(got === 'did' ? t.sent1 : t.sent2)}</div>`;
    const left = dispLeft(x); if (left <= 0) return '';
    return `<button type="button" class="thdb" onclick="event.stopPropagation();thDispute(${x.id})"><i class="fa-regular fa-flag"></i> ${esc(t.btn)}</button><div class="thdst" style="display:block;margin-top:4px;font-weight:600">${esc(t.left)} ${esc(fmtLeft(left))}</div>`;
  };

  const st = document.createElement('style'); st.textContent = `
.thdb{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:7px 14px;border-radius:999px;border:1px solid rgba(251,191,36,.55);background:rgba(251,191,36,.1);color:#fbbf24;font:700 .78rem Cairo,Inter,sans-serif;cursor:pointer}
.thdb:active{transform:scale(.96)}
.thdst{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font:700 .78rem Cairo,Inter,sans-serif;opacity:.75}
body.light-theme .thdb{color:#92400e;border-color:rgba(180,83,9,.5);background:rgba(251,191,36,.18)}
#thDisp{position:fixed;inset:0;z-index:100050;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
#thDisp.open{display:flex}
#thDisp .db{box-sizing:border-box;width:min(94vw,420px);border-radius:22px;padding:18px 16px 16px;background:rgba(15,23,42,.97);color:#e2e8f0;border:1px solid rgba(148,163,184,.25);box-shadow:0 20px 60px rgba(0,0,0,.5);font:600 .9rem Cairo,Inter,sans-serif}
body.light-theme #thDisp{background:rgba(255,255,255,.5)}
body.light-theme #thDisp .db{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}
#thDisp .dt{font-weight:800;font-size:1.02rem;text-align:center;margin-bottom:4px}
#thDisp .ds{font-size:.8rem;opacity:.7;text-align:center;margin-bottom:12px;overflow-wrap:anywhere}
#thDisp .dopt{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:13px 14px;border-radius:14px;border:1px solid rgba(148,163,184,.35);background:rgba(148,163,184,.1);color:inherit;font:inherit;text-align:start;cursor:pointer}
#thDisp .dopt:active{transform:scale(.98)}
#thDisp .dopt:disabled{opacity:.6;cursor:default}
#thDisp .dopt.a{border-color:rgba(52,211,153,.6);background:rgba(52,211,153,.12)}
#thDisp .dopt.b{border-color:rgba(251,113,133,.55);background:rgba(251,113,133,.1)}
#thDisp .de{min-height:1.2em;margin-top:8px;text-align:center;color:#fb7185;font-size:.8rem}
#thDisp .dx{display:block;margin:6px auto 0;border:0;background:none;color:inherit;opacity:.65;font:inherit;cursor:pointer;padding:6px 12px}`;
  document.head.appendChild(st);

  const ov = document.createElement('div'); ov.id = 'thDisp'; document.body.appendChild(ov);
  let busy = false;
  const close = () => { if (!busy) ov.classList.remove('open'); };
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });

  window.thDispute = id => {
    const x = (D.items || []).find(i => i.id === id); if (!x || VIEW || itState(x).k !== 'closed' || rd(DK)[id]) return;
    if (dispLeft(x) <= 0) { itToast(T().expired); try { render(); } catch (e) {} return; }
    const t = T(); busy = false;
    ov.innerHTML = `<div class="db"><div class="dt">${esc(t.ttl)}</div><div class="ds" dir="auto">${esc(x.title || '')} · ${esc(x.date)}</div>`
      + `<button type="button" class="dopt a" data-c="did" dir="auto">${esc(t.o1)}</button><button type="button" class="dopt b" data-c="not" dir="auto">${esc(t.o2)}</button><div class="de"></div><button type="button" class="dx">${esc(t.close)}</button></div>`;
    ov.querySelector('.dx').onclick = close;
    ov.querySelectorAll('.dopt').forEach(b => b.onclick = () => choose(x, b.dataset.c));
    ov.classList.add('open');
  };

  async function choose(x, ch) {
    if (busy) return; busy = true;
    const t = T(), btns = ov.querySelectorAll('.dopt'), er = ov.querySelector('.de'); btns.forEach(b => b.disabled = true); er.textContent = t.sending; er.style.color = 'inherit';
    const unlock = m => { busy = false; btns.forEach(b => b.disabled = false); er.style.color = '#fb7185'; er.textContent = m; };
    if (dispLeft(x) <= 0) { busy = false; ov.classList.remove('open'); itToast(t.expired); try { render(); } catch (e) {} return; }
    const prof = (D && D.profile) || {}, name = prof.trainee || '', title = x.title || '', now = new Date(cairoNow()).toISOString().replace('T', ' ').slice(0, 16);
    const p = x.plan, kind = x.kind === 'dandana' ? 'Dandana' : 'Task';
    /* 1) the server checks the 24h window, gives the score back ("did") and answers { ok:true, score_before, score_after } (or true) */
    const r = await rpc('trainee_dispute_item', { p_token: tok(), p_item_id: x.id, p_choice: ch }).catch(() => null);
    const obj = r && typeof r === 'object' ? r : null;
    if (obj && obj.ok === false) {
      busy = false; ov.classList.remove('open');
      if (obj.reason === 'already') { const m = rd(DK); m[x.id] = ch; wr(DK, m); itToast(t.already); } else itToast(obj.reason === 'nothing' ? t.nothing : t.expired);
      try { render(); } catch (e) {} return;
    }
    const serverDone = r === true || (obj && obj.ok === true);
    const pick = (o, ks) => { for (const k of ks) if (o && o[k] != null && o[k] !== '') return o[k]; return null; };
    const after = pick(obj, ['score_after', 'after', 'new_score']), before = pick(obj, ['score_before', 'before', 'old_score']);
    /* 2) "did it": the trainer always gets the request too (Requests / Reports), with who / what / when */
    if (ch === 'did') {
      const msg = `[REQUEST] Dispute: ${kind} #${x.no} - ${title}`.slice(0, 140);
      const full = `[DISPUTE] ${title}\n[DETAILS] The trainee says he DID this ${kind.toLowerCase()} for real but forgot to check it on the dashboard.\n[TRAINEE] ${name}\n[ITEM] ${kind} #${x.no} | date ${x.date} | id ${x.id}\n[CLOSED] ${p ? 'deadline ' + new Date(p.deadline).toISOString().replace('T', ' ').slice(0, 16) + (p.deadline_reason ? ' (' + p.deadline_reason + ')' : '') : 'n/a'}\n[SENT AT] ${now} (Cairo)\n[CHOICE] did_it_but_forgot_to_check\n[SCORE] ${serverDone ? 'restored automatically' + (after != null ? ' (' + (before != null ? before + ' -> ' : '') + after + ')' : '') : 'NOT restored yet, waiting for your review'}`.slice(0, 2000);
      const ok = await rpc('trainee_send_request', { p_token: tok(), p_type: 'other', p_message: full }).catch(() => null);
      if (ok !== true && !serverDone) return unlock(t.fail);
      if (ok === true) rpc('trainee_submit_report', { p_token: tok(), p_type: 'other', p_title: msg, p_details: full.slice(0, 1500), p_follow: null }).catch(() => null);
    }
    const m = rd(DK); m[x.id] = ch; wr(DK, m);
    if (ch === 'did') {
      if (serverDone) { try { await load(); } catch (e) {} addNote(t.n1t, t.n1b(title, after, before), 'note'); }
      else addNote(t.n1pt, t.n1pb(title), 'note');
    } else addNote(t.n2t, t.n2b(title), 'alert');
    busy = false; ov.classList.remove('open'); itToast(ch === 'did' ? t.sent1 : t.sent2);
    const wasLog = $('mdl').classList.contains('open') && $('mT').textContent === title;
    try { render(); } catch (e) {} if (wasLog) openLogItem(x.id);
  }
})();


/* ==========================================================
   Push notifications: asks once (a tap is required by the browser), then keeps the phone's subscription synced.
   Works through ThabitPush (pwa.js). Nothing shows when push is unsupported (e.g. iPhone Safari outside the installed app).
   ========================================================== */
(function () {
  const ASK = 'thabit_push_ask', SYNC = 'thabit_push_sync';
  const X = {
    en: { ttl: 'Get notified when Thabit sends you something', yes: 'Turn on', no: 'Not now', on: 'Notifications are on', blocked: 'Notifications are blocked in your phone or browser settings' },
    ar: { ttl: 'احصل على إشعار عندما يرسل لك ثابت شيئًا جديدًا', yes: 'تفعيل', no: 'لاحقًا', on: 'تم تفعيل الإشعارات', blocked: 'الإشعارات محظورة من إعدادات الهاتف أو المتصفح' },
    eg: { ttl: 'خد إشعار لما ثابت يبعتلك حاجة جديدة', yes: 'فعّل', no: 'مش دلوقتي', on: 'الإشعارات اتفعلت', blocked: 'الإشعارات مقفولة من إعدادات التليفون أو المتصفح' }
  };
  const T = () => X[lang] || X.en, P = () => window.ThabitPush;
  const ls = (k, v) => { try { if (v === undefined) return +localStorage.getItem(k) || 0; localStorage.setItem(k, String(v)); } catch (e) {} return 0; };

  async function sync(ask) {
    const p = P(); if (!p || !p.supported || !tok()) return false;
    const s = await p.subscribe(!!ask); if (!s) return false;
    const r = await rpc('trainee_push_subscribe', { p_token: tok(), p_endpoint: s.endpoint, p_p256dh: s.p256dh, p_auth: s.auth, p_lang: lang }).catch(() => null);
    if (r === true) ls(SYNC, Date.now());
    return r === true;
  }
  /* can also be wired to a settings button later: thEnablePush() */
  window.thEnablePush = async () => {
    const ok = await sync(true), t = T();
    itToast(ok ? t.on : (window.Notification && Notification.permission === 'denied' ? t.blocked : t.no));
    return ok;
  };

  const st = document.createElement('style'); st.textContent = `
#thPush{position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);z-index:100040;max-width:440px;margin:0 auto;display:flex;align-items:center;gap:10px;box-sizing:border-box;padding:12px 14px;border-radius:18px;background:rgba(15,23,42,.97);color:#e2e8f0;border:1px solid rgba(148,163,184,.3);box-shadow:0 14px 40px rgba(0,0,0,.45);font:600 .85rem/1.5 Cairo,Inter,sans-serif}
#thPush b{flex:1;min-width:0;font-weight:700}
#thPush button{border:0;border-radius:11px;padding:8px 14px;font:700 .8rem Cairo,Inter,sans-serif;cursor:pointer;flex:none}
#thPush .y{background:#fbbf24;color:#111}#thPush .n{background:none;color:inherit;opacity:.65;padding:8px 6px}
body.light-theme #thPush{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}`;
  document.head.appendChild(st);

  function ask() {
    if (document.getElementById('thPush')) return;
    const t = T(), c = document.createElement('div'); c.id = 'thPush';
    c.innerHTML = `<i class="fa-regular fa-bell"></i><b dir="auto">${esc(t.ttl)}</b><button class="y" type="button">${esc(t.yes)}</button><button class="n" type="button">${esc(t.no)}</button>`;
    c.querySelector('.n').onclick = () => { ls(ASK, Date.now()); c.remove(); };
    c.querySelector('.y').onclick = async () => { c.remove(); ls(ASK, Date.now()); await window.thEnablePush(); };
    document.body.appendChild(c);
  }
  function run() {
    const p = P(); if (VIEW || !p || !p.supported || !window.Notification) return;
    if (Notification.permission === 'granted') { if (Date.now() - ls(SYNC) > 864e5) sync(false); return; }   // keep it fresh once a day
    if (Notification.permission !== 'default') return;                                                      // blocked: never nag
    if (Date.now() - ls(ASK) < 7 * 864e5) return;                                                           // asked in the last 7 days
    ask();
  }
  let tries = 0; const iv = setInterval(() => {
    if (++tries > 90) return clearInterval(iv);
    if (typeof D !== 'undefined' && D && D.profile && tok()) { clearInterval(iv); setTimeout(run, 3500); }
  }, 1000);
})();


/* ===== Opened from a push notification: go straight to the notifications ===== */
(function () {
  const go = async () => {
    try { const a = await fetchNotes(); if (D) { D.notes = a; updateFeed(); } } catch (e) {}   // fresh list first
    try { openFeed(); } catch (e) {}
  };
  const when = fn => { let n = 0; const iv = setInterval(() => { if (++n > 120) return clearInterval(iv); if (typeof D !== 'undefined' && D && D.profile && tok()) { clearInterval(iv); setTimeout(fn, 600); } }, 500); };
  if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'thabit-open-feed') go(); });   // app already open
  if (location.hash === '#th-feed') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} when(go); }                // app was closed
})();





/* ==========================================================
   Library (paste at the END of dashboard.js, after task-uploads.js)
   - "Library" item in the + menu: two tabs, Audio and Images, everything since the start, search only (no date filter)
   - listen / view / download / share. No edit, no delete.
   - image upload pop-up: drag & drop zone on computers + a short quality notice; voice pop-up: a quiet-place notice
   ========================================================== */
(function () {
  const X = {
    en: { lib: 'Library', aud: 'Audio', img: 'Images', search: 'Search by task or day…', none: 'Nothing here yet', dl: 'Download', sh: 'Share', copied: 'Link copied ✓', fail: 'Could not load your library', loading: 'Loading…', task: 'Task',
          nImg: 'Important: the photo must be clear and every word readable. Mind the lighting and keep the writing sharp, because I will grade it from the photo.',
          nAud: 'Make sure you record in a quiet place so your voice comes out 100% clear.', drag: 'Drag anything here', lnk: 'Links', dew: 'Dew Words', pend: 'Not sent yet', me: 'You', trn: 'Trainer', cp: 'Copy', cpd: 'Copied ✓' },
    ar: { lib: 'المكتبة', aud: 'الصوت', img: 'الصور', search: 'ابحث باسم المهمة أو اليوم…', none: 'لا يوجد شيء بعد', dl: 'تحميل', sh: 'مشاركة', copied: 'تم نسخ الرابط ✓', fail: 'تعذر تحميل المكتبة', loading: 'جاري التحميل…', task: 'مهمة',
          nImg: 'مهم: يجب أن تكون الصورة واضحة والكلام كله مقروء. راعِ الإضاءة وأن تظهر الكلمات بوضوح لأنني سأقيّمها من الصورة.',
          nAud: 'تأكد أنك تسجل في مكان هادئ حتى يخرج صوتك واضحًا 100%.', drag: 'اسحب أي ملف هنا', lnk: 'الروابط', dew: 'Dew Words', pend: 'لم يُرسل بعد', me: 'أنت', trn: 'المدرب', cp: 'نسخ', cpd: 'تم النسخ ✓' },
    eg: { lib: 'المكتبة', aud: 'الصوت', img: 'الصور', search: 'دوّر باسم التاسك أو اليوم…', none: 'لسه مفيش حاجة', dl: 'تحميل', sh: 'مشاركة', copied: 'اللينك اتنسخ ✓', fail: 'معرفناش نحمّل المكتبة', loading: 'بيتحمّل…', task: 'تاسك',
          nImg: 'مهم: الصورة لازم تبقى واضحة والكلام كله مقروء. راعي الإضاءة وإن الكلمات تبان بوضوح عشان أنا اللي هقيّمها.',
          nAud: 'اتأكد إنك بتسجل في مكان هادي عشان صوتك يطلع واضح 100%.', drag: 'اسحب أي حاجة هنا', lnk: 'اللينكات', dew: 'Dew Words', pend: 'لسه ما اتبعتش', me: 'أنت', trn: 'المدرب', cp: 'كوبي', cpd: 'اتنسخ ✓' }
  };
  const T = () => X[lang] || X.en;
  const LIB = { rows: [], tab: 'audio', q: '', view: [] };

  const st = document.createElement('style');
  st.textContent = `
#thLib{position:fixed;inset:0;z-index:2147483100;display:none;align-items:center;justify-content:center;padding:12px 12px calc(12px + env(safe-area-inset-bottom,0px));background:rgba(2,6,23,.6);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
#thLib.open{display:flex}
#thLib .lb{box-sizing:border-box;width:min(560px,100%);height:min(86vh,720px);display:flex;flex-direction:column;border-radius:22px;padding:14px;background:#0f172a;color:#f1f5f9;border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 60px rgba(0,0,0,.5)}
body.light-theme #thLib .lb{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.12)}
#thLib .lh{display:flex;align-items:center;gap:8px;margin-bottom:10px}
#thLib .lh b{flex:1;font-size:1.05rem}
#thLib .lx{width:32px;height:32px;border-radius:50%;border:0;background:rgba(148,163,184,.2);color:inherit;font-size:1.2rem;cursor:pointer}
#thLib .lt{display:flex;overflow-x:auto;gap:4px;padding:3px;border-radius:999px;background:rgba(148,163,184,.14);margin-bottom:10px}
#thLib .lt button{flex:1 0 auto;white-space:nowrap;padding:8px 10px;border:0;border-radius:999px;background:transparent;color:inherit;font:700 .8rem Inter,Cairo,sans-serif;cursor:pointer}
#thLib .lt button.on{background:#fbbf24;color:#111}
#thLib .lq{width:100%;box-sizing:border-box;margin-bottom:10px;padding:10px 12px;border-radius:12px;border:1px solid rgba(148,163,184,.4);background:rgba(148,163,184,.1);color:inherit;font:500 .9rem Inter,Cairo,sans-serif;outline:0}
#thLib .ll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
#thLib .ld{margin:14px 0 6px;font-size:.74rem;font-weight:800;opacity:.65}
#thLib .lc{padding:10px 12px;border-radius:14px;border:1px solid rgba(148,163,184,.25);background:rgba(148,163,184,.08);margin-bottom:8px}
#thLib .lc b{display:block;font-size:.86rem;overflow-wrap:anywhere}
#thLib .lc small{opacity:.65;font-size:.72rem}
#thLib audio{width:100%;margin-top:8px}
#thLib .la{display:flex;gap:8px;margin-top:8px}
#thLib .la button,#thLibV .la button{padding:6px 12px;border-radius:999px;border:1px solid rgba(148,163,184,.45);background:transparent;color:inherit;font:700 .74rem Inter,Cairo,sans-serif;cursor:pointer}
#thLib .lg{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
#thLib .lg button{position:relative;aspect-ratio:1;padding:0;border:1px solid rgba(148,163,184,.3);border-radius:12px;overflow:hidden;background:rgba(148,163,184,.1);cursor:pointer}
#thLib .lg img{width:100%;height:100%;object-fit:cover;display:block}
#thLib .le{text-align:center;opacity:.6;padding:30px 0;font-size:.85rem}
#thLibV{position:fixed;inset:0;z-index:2147483101;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:14px;background:rgba(2,6,23,.92)}
#thLibV.open{display:flex}
#thLibV img{max-width:100%;max-height:76vh;border-radius:12px;object-fit:contain}
#thLibV .la{display:flex;gap:8px;color:#f1f5f9}
.upn{margin:0 0 14px;padding:9px 12px;border-radius:12px;background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.4);color:#fbbf24;font-size:.78rem;font-weight:600;line-height:1.6;text-align:start}
body.light-theme .upn{color:#92400e}
.updz{margin:0 0 12px;padding:16px 10px;border:2px dashed rgba(148,163,184,.55);border-radius:16px;font-size:.8rem;opacity:.85;transition:background .15s,border-color .15s}
#thUp.dz .updz{background:rgba(56,189,248,.14);border-color:#38bdf8;opacity:1}`;
  document.head.appendChild(st);

  /* ---------- the library window ---------- */
  const ov = document.createElement('div'); ov.id = 'thLib';
  ov.innerHTML = '<div class="lb"><div class="lh"><b></b><button type="button" class="lx" aria-label="Close">&times;</button></div><div class="lt"></div><input class="lq" type="search" autocomplete="off"><div class="ll"></div></div>';
  document.body.appendChild(ov);
  const vw = document.createElement('div'); vw.id = 'thLibV';
  vw.innerHTML = '<img alt=""><div class="la"></div>';
  document.body.appendChild(vw);
  const $l = s => ov.querySelector(s);

  const pub = r => `${SB}/storage/v1/object/public/${r.bucket}/${String(r.path).split('/').map(encodeURIComponent).join('/')}`;
  const dayKey = r => { try { return cairoDay(r.created_at) || String(r.created_at).slice(0, 10); } catch (e) { return String(r.created_at).slice(0, 10); } };
  const dayLbl = k => { try { return new Date(k + 'T12:00:00Z').toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); } catch (e) { return k; } };
  const timeLbl = r => { try { return new Date(r.created_at).toLocaleTimeString(lang === 'en' ? 'en-GB' : 'ar-EG', { hour: 'numeric', minute: '2-digit', timeZone: 'Africa/Cairo' }); } catch (e) { return ''; } };
  const ext = r => (String(r.path).match(/\.([a-z0-9]+)$/i) || [0, r.kind === 'audio' ? 'webm' : 'jpg'])[1];

  function paintText(tab, q, t) {
    let rows = [];
    if (tab === 'links') {
      const seen = new Set();
      ((window.thMessenger && thMessenger.msgs && thMessenger.msgs()) || []).forEach(m => {
        const body = String(m.body || ''), urls = m.kind === 'link' ? [body.trim()] : (body.match(/https?:\/\/[^\s<>"']+/gi) || []);
        urls.forEach(u => { if (!/^https?:\/\//i.test(u)) return; const k = m.id + '|' + u; if (seen.has(k)) return; seen.add(k); rows.push({ created_at: m.created_at, text: u, url: u, who: m.sender === 'trainer' ? t.trn : t.me }); });
      });
    } else rows = ((window.thDew && thDew.rows && thDew.rows()) || []).map(r => ({ created_at: r.created_at, text: r.text, source: r.source, pending: r.pending }));
    rows = rows.filter(r => !q || `${r.text} ${r.source || ''} ${dayKey(r)} ${dayLbl(dayKey(r))}`.toLowerCase().includes(q))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    LIB.view = rows;
    if (!rows.length) { $l('.ll').innerHTML = `<div class="le">${esc(t.none)}</div>`; return; }
    let html = '', cur = '';
    rows.forEach((r, i) => {
      const k = dayKey(r); if (k !== cur) { cur = k; html += `<div class="ld">${esc(dayLbl(k))}</div>`; }
      if (tab === 'links') html += `<div class="lc"><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" dir="auto" style="color:#53bdeb;overflow-wrap:anywhere">${esc(r.text)}</a><br><small>${esc(r.who)} · ${esc(timeLbl(r))}</small></div>`;
      else html += `<div class="lc"><b dir="auto" style="font-weight:600;line-height:1.7">${esc(r.text)}</b><small>${esc(timeLbl(r))}${r.source ? ' · ' + esc(r.source) : ''}${r.pending ? ' · ⏳ ' + esc(t.pend) : ''}</small>`
        + `<div class="la"><button type="button" data-a="dcopy" data-i="${i}"><i class="fa-regular fa-copy"></i> ${esc(t.cp)}</button></div></div>`;
    });
    $l('.ll').innerHTML = html;
  }
  function paint() {
    const t = T(), tab = LIB.tab, q = LIB.q.trim().toLowerCase();
    $l('.lh b').textContent = t.lib; $l('.lq').placeholder = t.search;
    const tabs = [['audio', 'fa-microphone', t.aud], ['image', 'fa-image', t.img], ['links', 'fa-link', t.lnk], ['dew', 'fa-ear-listen', t.dew]];
    $l('.lt').innerHTML = tabs.map(([k, ic, lb]) => `<button type="button" data-t="${k}" class="${tab === k ? 'on' : ''}"><i class="fa-solid ${ic}"></i> ${esc(lb)}</button>`).join('');
    if (tab === 'links' || tab === 'dew') return paintText(tab, q, t);
    const kind = tab === 'audio' ? 'audio' : 'image';
    LIB.view = LIB.rows.filter(r => r.kind === kind && (!q || `${r.title || ''} ${dayKey(r)} ${dayLbl(dayKey(r))}`.toLowerCase().includes(q)))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    if (!LIB.view.length) { $l('.ll').innerHTML = `<div class="le">${esc(t.none)}</div>`; return; }
    let html = '', cur = '', open = false;
    LIB.view.forEach((r, i) => {
      const k = dayKey(r);
      if (k !== cur) { if (open) html += '</div>'; cur = k; html += `<div class="ld">${esc(dayLbl(k))}</div>`; open = false; if (kind === 'image') { html += '<div class="lg">'; open = true; } }
      if (kind === 'audio') {
        html += `<div class="lc"><b dir="auto">${esc(r.title || t.task)}</b><small>${esc(timeLbl(r))}</small><audio controls preload="none" src="${esc(pub(r))}"></audio>`
          + `<div class="la"><button type="button" data-a="dl" data-i="${i}"><i class="fa-solid fa-download"></i> ${t.dl}</button><button type="button" data-a="sh" data-i="${i}"><i class="fa-solid fa-share-nodes"></i> ${t.sh}</button></div></div>`;
      } else html += `<button type="button" data-a="view" data-i="${i}" aria-label="${esc(r.title || '')}"><img loading="lazy" src="${esc(pub(r))}" alt=""></button>`;
    });
    if (open) html += '</div>';
    $l('.ll').innerHTML = html;
  }

  async function dl(r) {
    const name = `thabit-${dayKey(r)}-${r.kind}.${ext(r)}`, u = pub(r);
    try {
      const b = await (await fetch(u)).blob(), a = document.createElement('a'), o = URL.createObjectURL(b);
      a.href = o; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(o), 8000);
    } catch (e) { window.open(u, '_blank', 'noopener'); }
  }
  async function share(r) {
    const u = pub(r);
    if (navigator.share) { try { await navigator.share({ title: r.title || T().lib, url: u }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(u); itToast(T().copied); }
    catch (e) { const a = document.createElement('textarea'); a.value = u; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); itToast(T().copied); } catch (x) {} a.remove(); }
  }
  function showImg(i) {
    const r = LIB.view[i]; if (!r) return;
    vw.querySelector('img').src = pub(r);
    vw.querySelector('.la').innerHTML = `<button type="button" data-a="dl2"><i class="fa-solid fa-download"></i> ${T().dl}</button><button type="button" data-a="sh2"><i class="fa-solid fa-share-nodes"></i> ${T().sh}</button><button type="button" data-a="x">&times;</button>`;
    vw._r = r; vw.classList.add('open');
  }
  vw.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'), r = vw._r;
    if (a && a.dataset.a === 'dl2') dl(r); else if (a && a.dataset.a === 'sh2') share(r);
    else if (!e.target.closest('img')) vw.classList.remove('open');
  });
  ov.addEventListener('click', e => {
    if (e.target === ov || e.target.closest('.lx')) { closeLib(); return; }
    const tb = e.target.closest('.lt [data-t]'); if (tb) { LIB.tab = tb.dataset.t; paint(); return; }
    const a = e.target.closest('[data-a]'); if (!a) return;
    const r = LIB.view[+a.dataset.i]; if (!r) return;
    if (a.dataset.a === 'dcopy') { try { navigator.clipboard.writeText(r.text); itToast(T().cpd); } catch (e) { } }
    else if (a.dataset.a === 'dl') dl(r); else if (a.dataset.a === 'sh') share(r); else showImg(+a.dataset.i);
  });
  $l('.lq').addEventListener('input', e => { LIB.q = e.target.value; paint(); });
  function closeLib() { ov.classList.remove('open'); vw.classList.remove('open'); ov.querySelectorAll('audio').forEach(a => { try { a.pause(); } catch (e) {} }); if (!document.body.classList.contains('thfp-open')) document.documentElement.style.overflow = ''; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (vw.classList.contains('open')) vw.classList.remove('open'); else if (ov.classList.contains('open')) closeLib(); } });

  async function openLib(tab) {
    if (typeof tab === 'string') LIB.tab = tab;
    ov.classList.add('open'); document.documentElement.style.overflow = 'hidden';
    $l('.lq').value = LIB.q; paint(); $l('.ll').innerHTML = `<div class="le">${esc(T().loading)}</div>`;
    if (window.thDew) thDew.refresh().then(() => { if (ov.classList.contains('open') && LIB.tab === 'dew') paint(); }).catch(() => { });
    try {
      const a = await rpc('trainee_library', { p_token: tok() });
      if (!Array.isArray(a)) throw new Error('bad');
      LIB.rows = a;
    } catch (e) { if (LIB.tab === 'audio' || LIB.tab === 'image') { $l('.ll').innerHTML = `<div class="le">${esc(T().fail)}</div>`; return; } LIB.rows = []; }
    paint();
  }
  window.openLibrary = openLib; window.closeLibrary = closeLib;

  /* ---------- an item in the + menu ---------- */
  const _op = window.openPlus;
  window.openPlus = function () {
    const r = _op.apply(this, arguments);
    const row = document.querySelector('#thMenu .tmr');
    if (row && !row.querySelector('[data-lib]')) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tmi'; b.dataset.lib = '1';
      b.style.setProperty('--i', row.children.length);
      b.innerHTML = `<span class="tic"><i class="fa-solid fa-photo-film" style="color:#a78bfa"></i></span><span class="tlb" dir="auto">${esc(T().lib)}</span>`;
      b.onclick = e => { e.stopPropagation(); const m = document.getElementById('thMenu'); if (m) m.classList.remove('open'); setTimeout(openLib, 60); };
      row.appendChild(b);
    }
    return r;
  };

  /* ---------- upload pop-up extras: quality / quiet notice + drag & drop (computers) ---------- */
  const fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  const up = document.getElementById('thUp');
  if (up) {
    const enhance = () => {
      const box = up.querySelector('.ub'); if (!box) return;
      const isImg = !!box.querySelector('#upPick'), isAud = !!box.querySelector('#upMic'); if (!isImg && !isAud) return;
      const t = T();
      if (!box.querySelector('.upn')) { const n = document.createElement('div'); n.className = 'upn'; n.textContent = isImg ? t.nImg : t.nAud; const h = box.querySelector('.ut'); if (h) h.after(n); else box.prepend(n); }
      if (isImg && fine && !box.querySelector('.updz')) { const z = document.createElement('div'); z.className = 'updz'; z.innerHTML = `<i class="fa-solid fa-arrow-down-long"></i> ${esc(t.drag)}`; const p = box.querySelector('#upPrev'); if (p) p.before(z); }
    };
    new MutationObserver(enhance).observe(up, { childList: true, subtree: true });
    ['dragenter', 'dragover'].forEach(ev => up.addEventListener(ev, e => { e.preventDefault(); if (up.querySelector('#upPick')) up.classList.add('dz'); }));
    up.addEventListener('dragleave', e => { if (e.target === up) up.classList.remove('dz'); });
    up.addEventListener('drop', e => {
      e.preventDefault(); up.classList.remove('dz');
      const inp = up.querySelector('input[type=file]'), f = e.dataTransfer && [...e.dataTransfer.files].find(x => /^image\//.test(x.type));
      if (!inp || !f) return;
      try { const d = new DataTransfer(); d.items.add(f); inp.files = d.files; inp.dispatchEvent(new Event('change')); } catch (x) { console.warn('[drop]', x); }
    });
  }
})();


/* Closing time = the end of the range only, and everything closes Wednesday 23:59 (Cairo) */
(function () {
  const _mt = mergeTimes;
  mergeTimes = function () {
    _mt();
    ((D && D.items) || []).forEach(it => {
      const p = it.plan; if (!p) return;
      if (p._d0 === undefined) {
        p._d0 = +p.deadline;
        p._r0 = (p.range_end != null && Number.isFinite(+p.range_end)) ? +p.range_end : null;
        p._why0 = p.deadline_reason;
      }
      const base = p._r0 != null ? p._r0 : p._d0;
      if (!Number.isFinite(base)) return;
      let end = base, why = p._r0 != null ? 'range' : p._why0;
      const st = (p.opens0 && p.opens0.length) ? p.opens0[0] : (p.opens && p.opens[0]);
      if (Number.isFinite(st)) {
        const d = new Date(st);
        let cut = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + (3 - d.getUTCDay() + 7) % 7, 23, 59, 0);
        if (cut < st) cut += 7 * 864e5;
        if (cut < end) { end = cut; why = 'holiday'; }
      }
      p.deadline = end; p.deadline_reason = why;
      if (p._r0 != null) p.range_end = end;
    });
  };
})();
/* ==========================================================
   Options (student side) + Messenger look   (paste at the END of dashboard.js)
   REPLACES the earlier "Options (student side)" block (delete it first, from its comment to the end of the file, then paste this).
   - icon row under the content (Reply / Copy / Share), no background, no text
   - NEW Messenger button (a small dove) next to the Feed button in the bottom bar
   - Reply opens the Messenger as a centered pop-up (WhatsApp look): mic on the left, a typing field, a paperclip on the right
     (photo / link / screenshot / video). Tap outside = it parks as a small tab on the edge (tap it to reopen, x to close).
   - LOOK ONLY: typing + Send just adds your bubble here (today's date, time, two grey ticks). Nothing is saved or sent anywhere,
     mic and attachment buttons do nothing yet, no unread number yet.
   ========================================================== */
(function () {
  if (window.__opx) return; window.__opx = 1;

  const L = {
    en: { reply: 'Reply', copy: 'Copy', share: 'Share', copied: 'Copied ✓', msgr: 'Messenger', ph: 'Message', rto: 'Replying to', photo: 'Photo', link: 'Link', shot: 'Screenshot', video: 'Video', min: 'Minimize', close: 'Close' },
    ar: { reply: 'رد', copy: 'نسخ', share: 'مشاركة', copied: 'تم النسخ ✓', msgr: 'ميسنجر', ph: 'اكتب رسالة', rto: 'رد على', photo: 'صورة', link: 'رابط', shot: 'لقطة شاشة', video: 'فيديو', min: 'تصغير', close: 'إغلاق' },
    eg: { reply: 'ريبلاي', copy: 'كوبي', share: 'شير', copied: 'اتنسخ ✓', msgr: 'ميسنجر', ph: 'اكتب رسالة', rto: 'رد على', photo: 'صورة', link: 'لينك', shot: 'سكرين شوت', video: 'فيديو', min: 'تصغير', close: 'قفل' }
  };
  const T = () => L[(typeof lang === 'string' && lang) || 'en'] || L.en;
  const LIBL = () => ({ en: 'Library', ar: 'المكتبة', eg: 'المكتبة' }[(typeof lang === 'string' && lang) || 'en'] || 'Library');
  const LIBSVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/></svg>';
  const OPTS = [{ id: 'reply', icon: 'fa-solid fa-reply' }, { id: 'copy', icon: 'fa-regular fa-copy' }, { id: 'share', icon: 'fa-solid fa-share-nodes' }];

  const css = document.createElement('style'); css.id = 'opxCss';
  css.textContent = `
.opx-bar{display:flex;align-items:center;gap:2px;margin-top:6px}
.opx-i{background:none;border:0;padding:6px 10px;color:inherit;opacity:.7;font-size:16px;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent}
.opx-i:hover{opacity:1}.opx-i:active{opacity:1;transform:scale(.88)}
.opx-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483003;background:rgba(15,23,42,.96);color:#fff;border:1px solid rgba(255,255,255,.2);padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.4)}
#mgrBtn{background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important;position:relative;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:0;-webkit-tap-highlight-color:transparent}
#mgrBtn:active{transform:scale(.92)}
#mgrBtn .mgr-ico{display:block;width:26px;height:26px;flex:none;background-color:#2dd4bf;-webkit-mask:url(data:image/png;base64,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) center/contain no-repeat;mask:url(data:image/png;base64,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) center/contain no-repeat}
body.light-theme #mgrBtn .mgr-ico{background-color:#0d9488}
.mgr-veil{position:fixed;inset:0;z-index:2147483000;background:rgba(2,6,23,.55);display:none}
.mgr-pop{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483001;width:min(400px,94vw);height:min(560px,86vh);display:none;flex-direction:column;background:#0b141a;color:#e9edef;border:1px solid rgba(255,255,255,.14);border-radius:20px;overflow:hidden;box-shadow:0 18px 54px rgba(0,0,0,.6);direction:ltr}
.mgr-h{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#202c33}
.mgr-av{width:34px;height:34px;border-radius:50%;background:rgba(31,182,255,.2);color:rgb(31,182,255);display:flex;align-items:center;justify-content:center;font-size:16px}
.mgr-h b{flex:1;font-size:15px}
.mgr-hb{width:30px;height:30px;border-radius:50%;border:0;background:transparent;color:#aebac1;font-size:13px;cursor:pointer}
.mgr-hb:hover{background:rgba(255,255,255,.08)}
.mgr-list{flex:1;overflow:auto;padding:12px 10px;display:flex;flex-direction:column;gap:4px;background:#0b141a}
.mgr-day{align-self:center;margin:8px 0;padding:3px 10px;border-radius:8px;background:#182229;color:#8696a0;font-size:11px}
.mgr-b{align-self:flex-end;max-width:82%;padding:6px 8px 4px;border-radius:10px 10px 2px 10px;background:#005c4b;color:#e9edef}
.mgr-t{font-size:14px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}
.mgr-m{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:2px;font-size:10px;color:rgba(233,237,239,.6)}
.mgr-tk{font-size:11px;color:#8696a0}.mgr-b.seen .mgr-tk{color:#53bdeb}
.mgr-q{border-inline-start:3px solid rgb(31,182,255);background:rgba(0,0,0,.22);border-radius:6px;padding:4px 8px;margin-bottom:4px;font-size:12px;color:#c5d0d6;max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere}
.mgr-quote{display:flex;align-items:flex-start;gap:8px;padding:6px 12px;background:#182229;color:#aebac1;font-size:12px}
.mgr-quote span{flex:1;min-width:0;max-height:34vh;overflow-y:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.45}
.mgr-att{display:flex;justify-content:space-around;padding:10px 8px;background:#182229;border-top:1px solid rgba(255,255,255,.06)}
.mgr-ab{display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:none;color:#aebac1;font-size:10px;cursor:pointer}
.mgr-ab i{width:42px;height:42px;border-radius:50%;background:#2a3942;display:flex;align-items:center;justify-content:center;font-size:17px;color:rgb(31,182,255)}
.mgr-comp{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#202c33}
.mgr-ic{width:40px;height:40px;flex:none;border-radius:50%;border:0;background:#2a3942;color:#aebac1;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.mgr-ic:active{transform:scale(.92)}
.mgr-in{flex:1;min-width:0;height:40px;border-radius:20px;border:0;outline:0;padding:0 14px;background:#2a3942;color:#e9edef;font:inherit;font-size:14px}
.mgr-in::placeholder{color:#8696a0}
.mgr-send{background:rgb(31,182,255);color:#06283d}
.mgr-tab{position:fixed;right:0;top:40%;z-index:2147483000;display:none;flex-direction:column;align-items:center;gap:2px;padding:6px 4px;background:#202c33;border:1px solid rgba(255,255,255,.14);border-right:0;border-radius:14px 0 0 14px;box-shadow:0 6px 18px rgba(0,0,0,.45)}
.mgr-tab button{width:34px;height:34px;border:0;border-radius:50%;background:transparent;color:rgb(31,182,255);font-size:17px;cursor:pointer}
.mgr-tab button.x{height:24px;font-size:11px;color:#8696a0}`;
  document.head.appendChild(css);

  function toast(m) {
    const t = document.createElement('div'); t.className = 'opx-toast'; t.textContent = m; document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  /* ---------- Messenger ---------- */
  const M = { mode: 'closed', built: false, quote: '', lastDay: '', nested: false, msgs: [], sig: '', loaded: false, busy: false, sending: false, timer: null };   /* nested = opened from inside something (Reply): only then it may park as a tab */
  const el = {};
  function build() {
    if (M.built) return; M.built = true; const t = T();
    el.veil = document.createElement('div'); el.veil.className = 'mgr-veil';
    el.pop = document.createElement('div'); el.pop.className = 'mgr-pop'; el.pop.dataset.view = 'list';
    el.pop.innerHTML = `<div class="mgr-h"><button type="button" class="mgr-hb" data-back hidden aria-label="${t.close}"><i class="fa-solid fa-chevron-left"></i></button><button type="button" class="mgr-hb mgr-lib" data-lib aria-label="${LIBL()}" title="${LIBL()}">${LIBSVG}</button><span class="mgr-hav mgr-logo" data-hav hidden></span><b data-title dir="auto"></b>
        <button type="button" class="mgr-hb" data-x aria-label="${t.close}" title="${t.close}"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="mgr-cells" data-cells></div>
      <div class="mgr-chat">
      <div class="mgr-list" data-list></div>
      <div class="mgr-quote" data-quote hidden><i class="fa-solid fa-reply"></i><span dir="auto"></span><button type="button" class="mgr-hb" data-qx aria-label="${t.close}"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="mgr-att" data-att hidden>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-image"></i>${t.photo}</button>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-link"></i>${t.link}</button>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-camera"></i>${t.shot}</button>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-video"></i>${t.video}</button></div>
      <div class="mgr-comp"><button type="button" class="mgr-ic" data-mic aria-label="record"><i class="fa-solid fa-microphone"></i></button>
        <textarea class="mgr-in" data-in rows="1" dir="auto" placeholder="${t.ph}" enterkeyhint="send" autocomplete="off" autocapitalize="sentences"></textarea>
        <span class="mgr-sc"><button type="button" class="mgr-ic mgr-send" data-send hidden aria-label="send"><i class="fa-solid fa-paper-plane"></i></button>
        <button type="button" class="mgr-ic mgr-nl" data-nl aria-label="new line"><i class="fa-solid fa-turn-down fa-rotate-90"></i></button></span>
        <button type="button" class="mgr-ic" data-clip aria-label="attach"><i class="fa-solid fa-paperclip"></i></button></div>
      </div>`;
    document.body.append(el.veil, el.pop);
    const q = s => el.pop.querySelector(s);
    el.list = q('[data-list]'); el.in = q('[data-in]'); el.send = q('[data-send]'); el.att = q('[data-att]'); el.quote = q('[data-quote]');
    el.list.addEventListener('click', e => { if (!e.target.closest('.mgr-b,.mgr-eri')) mkClose(); });   /* tap anywhere else = the emoji bar goes and the spacing is back */
    el.title = q('[data-title]'); el.hav = q('[data-hav]'); el.back = q('[data-back]'); el.cells = q('[data-cells]');
    el.veil.addEventListener('pointerdown', leave);                /* tap outside: nested = park as a tab, from the bar = just hide (draft stays) */
    q('[data-x]').onclick = () => askClose();
    q('[data-lib]').onclick = () => { if (window.openLibrary) window.openLibrary(); };
    el.back.onclick = () => { M.nested = false; setView('list'); };
    q('[data-clip]').onclick = () => { el.att.hidden = !el.att.hidden; };
    el.att.querySelectorAll('.mgr-ab').forEach(b => b.onclick = () => { el.att.hidden = true; });   /* look only */
    q('[data-mic]').onclick = () => { };                                                           /* look only */
    q('[data-qx]').onclick = () => setQuote('');
    el.in.addEventListener('input', () => { el.send.hidden = !el.in.value.trim(); mDraftSet(el.in.value); fitIn(); });
    el.in.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
    el.send.onclick = sendMsg;
    /* auto-grow */
    window.fitIn = () => { const mx = Math.round(((window.visualViewport && visualViewport.height) || innerHeight) * 0.4); el.in.style.setProperty('height', 'auto', 'important'); el.in.style.setProperty('height', Math.min(Math.max(el.in.scrollHeight, 40), mx) + 'px', 'important'); el.in.style.overflowY = el.in.scrollHeight > mx ? 'auto' : 'hidden'; };
    /* restore the draft (like WhatsApp) */
    { const dv = mDraft(); if (dv) { el.in.value = dv; el.send.hidden = false; fitIn(); } }
    /* new-line button: tap = one line, hold = a new line every ~0.3s */
    { const nl = q('[data-nl]'); let tm = null, iv = null;
      const ins = () => { const a = el.in, st = a.selectionStart == null ? a.value.length : a.selectionStart, en = a.selectionEnd == null ? st : a.selectionEnd; a.setRangeText('\n', st, en, 'end'); a.dispatchEvent(new Event('input')); a.scrollTop = a.scrollHeight; };
      const stop = () => { clearTimeout(tm); clearInterval(iv); tm = iv = null; };
      nl.addEventListener('pointerdown', e => { e.preventDefault(); try { nl.setPointerCapture(e.pointerId); } catch (x) { } stop(); ins(); tm = setTimeout(() => { iv = setInterval(ins, 320); }, 450); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => nl.addEventListener(ev, stop));
      nl.addEventListener('contextmenu', e => e.preventDefault()); }
    /* phone keyboard: only when you tap the field; the field rides on top of the keyboard, the newest message stays right above it */
    { const vv = window.visualViewport;
      const fitVV = () => { if (!mgrPhone() || !vv || el.pop.style.display === 'none') return; el.pop.style.setProperty('height', vv.height + 'px', 'important'); el.pop.style.setProperty('top', vv.offsetTop + 'px', 'important'); if (document.activeElement === el.in) el.list.scrollTop = el.list.scrollHeight; };
      if (vv) { vv.addEventListener('resize', fitVV); vv.addEventListener('scroll', () => { window.scrollTo(0, 0); fitVV(); }); }
      el.in.addEventListener('focus', () => setTimeout(() => { fitVV(); el.list.scrollTop = el.list.scrollHeight; }, 250));
      el.in.addEventListener('blur', () => setTimeout(fitVV, 250));
      let ty = 0; el.list.addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
      el.list.addEventListener('touchmove', e => { if (document.activeElement === el.in && e.touches[0].clientY - ty > 14) el.in.blur(); }, { passive: true }); }   /* pull the messages down to read older ones = the keyboard goes away */
  }
  const DK = () => 'thabit_mdraft:' + String(tok() || 'x').slice(0, 16);
  const mDraft = () => { try { return (typeof VIEW !== 'undefined' && VIEW) ? '' : (localStorage.getItem(DK()) || ''); } catch (e) { return ''; } };
  const mDraftSet = v => { try { if (typeof VIEW !== 'undefined' && VIEW) return; v && v.trim() ? localStorage.setItem(DK(), v) : localStorage.removeItem(DK()); } catch (e) { } };
  const DLB = () => ({ en: 'Draft', ar: 'مسودة', eg: 'مسودة' }[(typeof lang === 'string' && lang) || 'en'] || 'Draft');
  const hasDraft = () => !!(el.in && el.in.value.trim());   /* only what the student typed counts as a change */
  /* tap outside / minimize: a tab only for a nested Messenger; one opened from the bar button is simply hidden (nothing is cleared) */
  function leave() { if (M.nested) askClose(); else setMode('closed'); }   /* no tabs anywhere: nested = same as X (asks only if something was typed); from the bar = just hides, the draft stays */
  function discard() { el.in.value = ''; el.send.hidden = true; mDraftSet(''); fitIn(); setQuote(''); }
  const CF = { en: ['Are you sure? Some things are not saved.', 'Discard', 'Stay'], ar: ['هل أنت متأكد؟ هناك أشياء لم تُحفظ.', 'تجاهل', 'ابقَ'], eg: ['متأكد؟ فيه حاجات لسه ما اتحفظتش.', 'امسح وقفل', 'استنى'] };
  function askClose() {
    if (true) { M.nested = false; M.view = 'list'; setQuote(''); setMode('closed'); return; }
    setMode('open');
    const c = CF[(typeof lang === 'string' && lang) || 'en'] || CF.en;
    const o = document.createElement('div');
    o.style.cssText = 'position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;background:rgba(2,6,23,.7);padding:20px';
    o.innerHTML = '<div style="background:#202c33;border-radius:16px;padding:18px;max-width:300px;text-align:center"><div dir="auto" style="font-weight:700;margin-bottom:14px"></div><div style="display:flex;gap:8px;justify-content:center"><button type="button" data-y class="mgr-ic" style="width:auto;padding:0 16px;font-size:13px;background:#b42318;color:#fff"></button><button type="button" data-n class="mgr-ic" style="width:auto;padding:0 16px;font-size:13px"></button></div></div>';
    o.querySelector('div>div').textContent = c[0]; o.querySelector('[data-y]').textContent = c[1]; o.querySelector('[data-n]').textContent = c[2];
    o.querySelector('[data-n]').onclick = () => o.remove();
    o.querySelector('[data-y]').onclick = () => { o.remove(); discard(); M.nested = false; M.view = 'list'; setMode('closed'); };
    el.pop.appendChild(o);
  }
  /* ---------- Messages are stored in Supabase (trainee_messages), shown WhatsApp-style, in the trainee's own country time ---------- */
  const MX = {
    en: { today: 'Today', yest: 'Yesterday', fail: 'Could not send, try again', voice: 'Voice message', photo: 'Photo' },
    ar: { today: 'اليوم', yest: 'أمس', fail: 'تعذر الإرسال، حاول مرة أخرى', voice: 'رسالة صوتية', photo: 'صورة' },
    eg: { today: 'النهاردة', yest: 'امبارح', fail: 'معرفناش نبعت، جرب تاني', voice: 'رسالة صوتية', photo: 'صورة' }
  };
  const MXT = () => MX[(typeof lang === 'string' && lang) || 'en'] || MX.en;
  const mTz = () => { try { return traineeZone().tz; } catch (e) { return 'Africa/Cairo'; } };
  const mLoc = () => (typeof lang === 'string' && lang === 'en') ? 'en-GB' : 'ar-EG';
  const mDayKey = iso => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: mTz() }).format(new Date(iso)); } catch (e) { return String(iso).slice(0, 10); } };
  function mDayLabel(iso) {
    const k = mDayKey(iso), now = Date.now(), t = MXT();
    if (k === mDayKey(new Date(now).toISOString())) return t.today;
    if (k === mDayKey(new Date(now - 864e5).toISOString())) return t.yest;
    try { return new Date(iso).toLocaleDateString(mLoc(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: mTz() }); } catch (e) { return k; }
  }
  const mTime = iso => { try { return new Date(iso).toLocaleTimeString(mLoc(), { hour: '2-digit', minute: '2-digit', timeZone: mTz() }); } catch (e) { return ''; } };
  (function () { const s = document.createElement('style'); s.textContent = '.mgr-b.in{align-self:flex-start;background:#202c33;border-radius:10px 10px 10px 2px}.mgr-b a{color:#53bdeb;text-decoration:underline;overflow-wrap:anywhere}.mgr-send:disabled{opacity:.5}'; document.head.appendChild(s); })();
  (function () {
    const s = document.createElement('style'); s.id = 'mgrCss2'; s.textContent = `
.mgr-pop [hidden]{display:none!important}
.mgr-logo{background:#fff url(data:image/png;base64,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) center/contain no-repeat!important;border:0!important}
.mgr-hav{width:32px;height:32px;border-radius:50%;flex:none}
.mgr-chat{flex:1;min-height:0;display:flex;flex-direction:column}
.mgr-pop[data-view=list] .mgr-chat{display:none}
.mgr-pop[data-view=chat] .mgr-cells{display:none}
.mgr-cells{flex:1;overflow:auto;padding:6px 0;background:#0b141a}
.mgr-cell{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:11px 14px;border:0;background:transparent;color:#e9edef;font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mgr-cell:active{background:rgba(255,255,255,.06)}
.mgr-cell.soon{cursor:default;opacity:.7;border-top:1px solid rgba(255,255,255,.06)}
.mgr-cell.soon:active{background:transparent}
.mgr-ca{width:46px;height:46px;flex:none;border-radius:50%;background:#2a3942;color:#8696a0;display:flex;align-items:center;justify-content:center;font-size:19px}
.mgr-cell.soon .mgr-ca{background:transparent;border:1.5px dashed #54656f}
.mgr-cb{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.mgr-c1,.mgr-c2{display:flex;align-items:center;gap:6px;min-width:0}
.mgr-c1 b{flex:1;min-width:0;font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mgr-c1 em{font-style:normal;font-size:11px;color:#8696a0;flex:none}
.mgr-cp{flex:1;min-width:0;font-size:13px;color:#8696a0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mgr-cp.wrap{white-space:normal;line-height:1.45}
.mgr-cell.unr .mgr-c1 b,.mgr-cell.unr .mgr-cp{font-weight:800;color:#fff}
.mgr-cell.unr .mgr-c1 em{font-weight:800;color:#2dd4bf}
.mgr-cn{flex:none;min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:#2dd4bf;color:#06283d;font:800 11px/20px Inter,Cairo,sans-serif;text-align:center}
.mgr-dots{display:inline-flex;align-items:center;gap:2px;flex:none}
.mgr-dots i{display:block;width:4.5px;height:4.5px;border-radius:50%;background:#8696a0}
.mgr-dots.green i{background:#22c55e}
.mgr-dots.red i{background:#ef4444}
.mgr-m .mgr-dots{margin-inline-start:2px}
#mgrNum{display:none;position:absolute!important;top:9px;left:calc(50% + 12px);z-index:5;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:999px;background:#ef4444;color:#fff;-webkit-text-fill-color:#fff;font:800 9px/16px Inter,Cairo,sans-serif;text-align:center;box-shadow:0 0 0 2px #181c20,0 2px 6px rgba(239,68,68,.55);pointer-events:none}
#mgrNum.on{display:block}
#mgrNum.l2{font-size:8px}
#mgrNum.bump{animation:mgrBump .4s cubic-bezier(.3,1.7,.5,1)}
@keyframes mgrBump{0%{transform:scale(.4)}100%{transform:scale(1)}}
body.light-theme #mgrNum{box-shadow:0 0 0 2px #f4f6f9,0 2px 6px rgba(239,68,68,.55)}`;
    document.head.appendChild(s);
  })();

  /* texts of the new list view */
  const MY = {
    en: { title: 'Thabit Messenger', req: 'Requests', reqSub: 'Send a request or a report', asst: 'Assistant', asstSub: 'Your words and practice', more: 'You can add more members', soon: 'You can chat with other trainees from here later. Soon, God willing.' },
    ar: { title: 'ثابت ميسنجر', req: 'الطلبات', reqSub: 'ابعت طلب أو تقرير', asst: 'المساعد', asstSub: 'كلماتك وتدريبك', more: 'تقدر تضيف أعضاء آخرين', soon: 'تقدر تتواصل مع متدربين آخرين من هنا لاحقًا. قريبًا إن شاء الله' },
    eg: { title: 'ثابت ميسنجر', req: 'الطلبات', reqSub: 'ابعت طلب أو تقرير', asst: 'المساعد', asstSub: 'كلماتك وتدريبك', more: 'تقدر تضيف ناس تانية', soon: 'هتقدر تكلم متدربين تانيين من هنا بعدين. قريب إن شاء الله' }
  };
  const MYT = () => MY[(typeof lang === 'string' && lang) || 'en'] || MY.en;
  /* the name shown for the trainer (set window.TH_TRAINER_NAME to change it) */
  const TN = () => window.TH_TRAINER_NAME || ({ en: 'Fadawy', ar: 'فداوي', eg: 'فداوي' }[(typeof lang === 'string' && lang) || 'en'] || 'Trainer');
  const mIsUnread = x => x.sender === 'trainer' && !x.read_at;
  const mUnreadList = () => M.msgs.filter(mIsUnread);

  /* read marks: two grey dots = reached the database, two green dots = the trainer read it, one red dot = did not reach us */
  function mDots(m) {
    let st, n = 2;
    if (m._st === 'fail') { st = 'red'; n = 1; }
    else if (m._st === 'pending') { const old = Date.now() - new Date(m.created_at).getTime() > 1500; st = old ? 'red' : 'gray'; n = 1; }
    else if (m.read_at) st = 'green';
    else { st = 'gray'; if (!(m.delivered_at || M.peerOnline)) n = 1; }   /* saved, but the other side has not opened the app: one dot */
    return '<span class="mgr-dots ' + st + '">' + (n === 1 ? '<i></i>' : '<i></i><i></i>') + '</span>';
  }
  /* ---------- message actions: tap = reactions + Reply / Delete, swipe right = Reply, Delete for me / for everyone ---------- */
  const AXT = {
    en: { edited: 'edited', del: 'This message was deleted', reply: 'Reply', delete: 'Delete', ttl: 'Delete message?', forMe: 'Delete for me', forAll: 'Delete for everyone', cancel: 'Cancel' },
    ar: { edited: 'معدّلة', del: 'تم حذف هذه الرسالة', reply: 'رد', delete: 'حذف', ttl: 'حذف الرسالة؟', forMe: 'حذف لدي', forAll: 'حذف للجميع', cancel: 'إلغاء' },
    eg: { edited: 'معدّلة', del: 'الرسالة دي اتمسحت', reply: 'رد', delete: 'مسح', ttl: 'تمسح الرسالة؟', forMe: 'مسح عندي', forAll: 'مسح للكل', cancel: 'إلغاء' }
  };
  const AX = () => AXT[(typeof lang === 'string' && lang) || 'en'] || AXT.en;
  const MKK = () => 'thabit_mmk:' + String(tok() || 'x').slice(0, 16);
  const mkAll = () => { if (!M.mk) { try { M.mk = JSON.parse(localStorage.getItem(MKK()) || '{}') || {}; } catch (e) { M.mk = {}; } } return M.mk; };
  const mkOf = id => mkAll()[String(id)] || {};
  const mkSave = () => { try { localStorage.setItem(MKK(), JSON.stringify(M.mk)); } catch (e) { } };
  const mkSet = (id, patch) => { const a = mkAll(); a[String(id)] = Object.assign({}, a[String(id)] || {}, patch); mkSave(); };
  const mkSend = (kind, id, emoji, text) => { if (VIEW) return; const a = { p_token: tok(), p_message_id: String(id), p_kind: kind, p_emoji: emoji || null }; if (kind === 'edit') a.p_text = String(text || '').slice(0, 4000); rpc('trainee_msg_mark', a).catch(() => null); };
  /* the database is the master copy: deletions and the trainer's reactions come from there; nothing is ever erased from it */
  async function mkPull() {
    if (VIEW || !tok() || Date.now() < (M.mkOff || 0) || Date.now() - (M.mkAt || 0) < 2900) return; M.mkAt = Date.now();
    const r = await rpc('trainee_msg_marks_list', { p_token: tok() }).catch(() => null);
    if (!(r && r.ok && Array.isArray(r.marks))) { M.mkOff = Date.now() + 60000; return; }
    const srv = {}; r.marks.forEach(x => { const id = String(x.message_id), o = srv[id] = srv[id] || {};
      if (x.kind === 'del_all') o.all = 1; else if (x.kind === 'del_me' && x.side !== 'trainer') o.me = 1; else if (x.kind === 'react') { if (x.side === 'trainer') o.rr = x.emoji; else o.rt = x.emoji; } else if (x.kind === 'edit') o.ed = x.body; });
    const all = mkAll(); let ch = false;
    new Set([...Object.keys(all), ...Object.keys(srv)]).forEach(id => {
      const l = all[id] || {}, v = srv[id] || {}, n = Object.assign({}, l);
      n.all = l.all || v.all || 0; n.me = l.me || v.me || 0; n.rr = v.rr || ''; n.ed = (l.edAt && Date.now() - l.edAt < 10000) ? l.ed : (v.ed || l.ed || '');
      if (!(l.rtAt && Date.now() - l.rtAt < 10000)) n.rt = v.rt || '';
      if (JSON.stringify(n) !== JSON.stringify(l)) { all[id] = n; ch = true; }
    });
    if (ch) { mkSave(); mRender(); lRender(); }
  }
  const EMO = '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😎 🤩 🥳 😏 😒 😔 😢 😭 😤 😡 🤯 😱 😮 😴 🤔 🙄 😬 🤗 🤝 👍 👎 👏 🙌 🙏 💪 👌 ✌️ 🤞 👀 ❤️ 🧡 💛 💚 💙 💜 🖤 💔 💯 🔥 ✨ ⭐ 🎉 ✅ ❌ ❓ ❗ 💡 📌 📚 📝 ⏰ 🎯 🚀 ☕ 🌹'.split(' ');
  function closeOv() { const o = el.pop && el.pop.querySelector('.mgr-ov'); if (o) o.remove(); }
  function ovNew() { closeOv(); const ov = document.createElement('div'); ov.className = 'mgr-ov'; ov.addEventListener('pointerdown', e => { if (e.target === ov) closeOv(); }); el.pop.appendChild(ov); return ov; }
  function mkClose() { closeOv(); const tb = el.pop && el.pop.querySelector('.mgr-tb'); if (tb) tb.remove(); document.body.classList.remove('thb-act'); const had = M.erId != null || M.selId != null; M.erId = null; M.selId = null; if (had) mRender(); }
  function closeAct() { mkClose(); }
  function mkReact(m, e) { const cur = mkOf(m.id).rt; if (cur === e) { mkSet(m.id, { rt: '', rtAt: Date.now() }); mkSend('unreact', m.id); } else { mkSet(m.id, { rt: e, rtAt: Date.now() }); mkSend('react', m.id, e); } closeAct(); mRender(); }
  function mkReply(m) { closeAct(); const q = (m.kind === 'audio' ? MXT().voice : m.kind === 'image' ? MXT().photo : (mkOf(m.id).ed || m.body || '')); setQuote(q); try { el.in.focus({ preventScroll: true }); } catch (e) { } }
  function mkDelete(m) {
    const a = AX(), mine = m.sender !== 'trainer', ov = ovNew();
    const sh = document.createElement('div'); sh.className = 'mgr-ds';
    const h = document.createElement('div'); h.className = 'mgr-dt'; h.textContent = a.ttl; sh.appendChild(h);
    const add = (label, cls, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls || ''; b.textContent = label; b.onclick = fn; sh.appendChild(b); };
    add(a.forMe, 'd', () => { mkSet(m.id, { me: 1 }); mkSend('del_me', m.id); closeAct(); mRender(); lRender(); });
    if (mine) add(a.forAll, 'd', () => { mkSet(m.id, { all: 1 }); mkSend('del_all', m.id); closeAct(); mRender(); lRender(); });   /* only YOUR messages can be deleted for everyone */
    add(a.cancel, '', closeAct);
    ov.appendChild(sh);
  }
  function mkPicker(m) {
    const ov = ovNew();
    const pk = document.createElement('div'); pk.className = 'mgr-pk';
    EMO.forEach(e => { const b = document.createElement('button'); b.type = 'button'; b.textContent = e; b.onclick = () => mkReact(m, e); pk.appendChild(b); });
    ov.appendChild(pk);
  }
  /* tap = the reactions bar right under that message (no blur, the messages below simply move down) */
  function mkBar(m) {
    const mine = m.sender !== 'trainer', mk = mkOf(m.id), bar = document.createElement('div'); bar.className = 'mgr-eri'; bar.style.alignSelf = mine ? 'flex-end' : 'flex-start';
    ['👍', '❤️', '😂', '😮', '😢', '🙏'].forEach(e => { const x = document.createElement('button'); x.type = 'button'; x.textContent = e; if (mk.rt === e) x.className = 'on'; x.onclick = ev => { ev.stopPropagation(); mkReact(m, e); }; bar.appendChild(x); });
    const pl = document.createElement('button'); pl.type = 'button'; pl.className = 'pl'; pl.innerHTML = '<i class="fa-solid fa-plus"></i>'; pl.onclick = ev => { ev.stopPropagation(); mkPicker(m); }; bar.appendChild(pl);
    return bar;
  }
  /* long press = the top bar: a pencil (edit, only your own messages) and a bin */
  function mkTop(m) {
    mkClose(); M.selId = m.id; const mine = m.sender !== 'trainer';
    const tb = document.createElement('div'); tb.className = 'mgr-tb';
    const bt = (icon, fn, cls) => { const x = document.createElement('button'); x.type = 'button'; x.className = cls || ''; x.innerHTML = '<i class="fa-solid ' + icon + '"></i>'; x.onclick = fn; return x; };
    const L = document.createElement('div'); L.appendChild(bt('fa-xmark', mkClose));
    const R = document.createElement('div');
    if (mine && (!m.kind || m.kind === 'text')) R.appendChild(bt('fa-pen', () => mkEdit(m)));
    R.appendChild(bt('fa-trash', () => mkDelete(m), 'rd'));
    tb.append(L, R); el.pop.appendChild(tb); document.body.classList.add('thb-act'); mRender();
  }
  function mkEdit(m) {
    const cur = mkOf(m.id).ed || m.body || ''; mkClose();
    if (M.prevDraft == null) M.prevDraft = el.in.value;
    M.editId = m.id; el.in.value = cur; el.send.hidden = !cur.trim(); fitIn();
    el.quote.hidden = false; el.quote.querySelector('span').textContent = '✎ ' + cur;
    try { el.in.focus({ preventScroll: true }); } catch (e) { }
  }
  function mkApplyEdit() {
    const v = el.in.value.trim(); if (!v) return; const id = M.editId;
    mkSet(id, { ed: v, edAt: Date.now() }); mkSend('edit', id, null, v);
    el.in.value = M.prevDraft || ''; M.prevDraft = null; M.editId = null; el.send.hidden = !el.in.value.trim(); fitIn(); setQuote(''); mRender(); lRender();
  }
  function mAttach(b, m, mk) {
    if (String(M.selId) === String(m.id)) b.classList.add('sel');
    if (mk.rt || mk.rr) { const rx = document.createElement('div'); rx.className = 'mgr-rx'; rx.textContent = (mk.rr || '') + (mk.rt || ''); b.appendChild(rx); b.classList.add('hasrx'); }
    if (m._st || VIEW) return;
    let sx = 0, sy = 0, dx = 0, on = false, mv = false, lt = null;
    const lp = () => { b.dataset.lp = '1'; setTimeout(() => { delete b.dataset.lp; }, 600); mkTop(m); };
    b.addEventListener('touchstart', e => { if (e.touches.length !== 1) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; on = true; mv = false; b.style.transition = 'none'; clearTimeout(lt); lt = setTimeout(lp, 480); }, { passive: true });
    b.addEventListener('touchmove', e => { if (!on) return; const x = e.touches[0].clientX - sx, y = e.touches[0].clientY - sy; if (Math.abs(x) > 8 || Math.abs(y) > 8) clearTimeout(lt); if (!mv && Math.abs(y) > Math.abs(x)) { on = false; return; } if (x <= 0) { dx = 0; if (mv) b.style.transform = ''; return; } if (x > 8) mv = true; dx = Math.min(x, 90); if (mv) b.style.transform = 'translateX(' + dx + 'px)'; }, { passive: true });
    b.addEventListener('touchend', () => { clearTimeout(lt); if (!on && !mv) return; on = false; b.style.transition = 'transform .2s'; b.style.transform = ''; if (mv) { b.dataset.sw = '1'; setTimeout(() => { delete b.dataset.sw; }, 450); } if (dx >= 60 && !mkOf(m.id).all) mkReply(m); dx = 0; mv = false; }, { passive: true });
    b.addEventListener('touchcancel', () => { clearTimeout(lt); on = false; }, { passive: true });
    b.addEventListener('contextmenu', e => { e.preventDefault(); if (!b.dataset.lp) lp(); });
    b.addEventListener('click', e => {
      if (b.dataset.sw || b.dataset.lp) return; if (e.target.closest && e.target.closest('a')) return;
      const now = Date.now();
      if (M.lastTap && String(M.lastTap.id) === String(m.id) && now - M.lastTap.t < 320) { M.lastTap = null; if (mkOf(m.id).rt !== '👌') mkReact(m, '👌'); else mkClose(); return; }   /* double tap = OK 👌 */
      M.lastTap = { id: m.id, t: now };
      const was = String(M.erId) === String(m.id); mkClose(); if (was) return;
      M.erId = m.id; mRender(); const br = el.list.querySelector('.mgr-eri'); if (br && br.scrollIntoView) br.scrollIntoView({ block: 'nearest' });
    });
  }
  function mBubble(m) {
    const b = document.createElement('div'), mine = m.sender !== 'trainer', t = MXT(), mk0 = mkOf(m.id);
    if (mk0.all || mk0.me) {
      b.className = 'mgr-b del' + (mine ? '' : ' in'); b.dataset.id = m.id;
      const tx0 = document.createElement('div'); tx0.className = 'mgr-t'; tx0.dir = 'auto'; tx0.innerHTML = '<i class="fa-solid fa-ban"></i> <span></span>'; tx0.lastChild.textContent = AX().del; b.appendChild(tx0);
      const mm0 = document.createElement('div'); mm0.className = 'mgr-m'; mm0.innerHTML = '<span></span>'; mm0.firstChild.textContent = mTime(m.created_at); b.appendChild(mm0);
      return b;
    }
    b.className = 'mgr-b' + (mine ? '' : ' in') + (mine && m.read_at ? ' seen' : ''); b.dataset.id = m.id;
    if (m.quote) { const qq = document.createElement('div'); qq.className = 'mgr-q'; qq.dir = 'auto'; qq.textContent = m.quote; b.appendChild(qq); }
    const tx = document.createElement('div'); tx.className = 'mgr-t'; tx.dir = 'auto';
    if (m.kind === 'link' || m.kind === 'audio' || m.kind === 'image') {
      const u = m.kind === 'link' ? m.body : m.url;
      if (/^https?:\/\//i.test(u || '')) { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = m.kind === 'link' ? u : (m.kind === 'audio' ? t.voice : t.photo); tx.appendChild(a); }
      else tx.textContent = m.body || '';
    } else tx.textContent = m.body || '';
    if (mk0.ed && (!m.kind || m.kind === 'text')) tx.textContent = mk0.ed;
    b.appendChild(tx);
    const mm = document.createElement('div'); mm.className = 'mgr-m';
    mm.innerHTML = '<span></span>' + (mine ? mDots(m) : '');
    mm.firstChild.textContent = mTime(m.created_at) + (mk0.ed ? ' · ' + AX().edited : ''); b.appendChild(mm);
    mAttach(b, m, mk0);
    if (m._st === 'fail') { b.style.cursor = 'pointer'; b.onclick = () => { m._st = 'pending'; m.created_at = new Date().toISOString(); mRender(); mPost(m); }; }   /* tap a red message = try again */
    return b;
  }
  function mRender() {
    if (!el.list) return;
    const l = el.list, atEnd = l.scrollHeight - l.scrollTop - l.clientHeight < 80 || !M.loaded; let day = '';
    l.innerHTML = '';
    M.msgs.forEach(m => {
      const k = mDayKey(m.created_at);
      if (k !== day) { day = k; const d = document.createElement('div'); d.className = 'mgr-day'; d.textContent = mDayLabel(m.created_at); l.appendChild(d); }
      l.appendChild(mBubble(m));
      if (String(M.erId) === String(m.id)) l.appendChild(mkBar(m));
    });
    M.loaded = true; if (atEnd) l.scrollTop = l.scrollHeight;
  }
  /* the number on the Messenger button = how many PEOPLE sent something not read yet (not how many messages) */
  function mBadge() {
    const b = document.getElementById('mgrNum'); if (!b) return;
    const n = new Set(mUnreadList().map(x => x.sender_id || 'trainer')).size;
    const txt = n > 99 ? '99+' : (n ? String(n) : '');
    if (b.textContent !== txt) { b.textContent = txt; b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump'); }
    b.classList.toggle('on', n > 0); b.classList.toggle('l2', txt.length > 1);
  }
  function mCellTime(iso) {
    const k = mDayKey(iso), now = Date.now();
    if (k === mDayKey(new Date(now).toISOString())) return mTime(iso);
    if (k === mDayKey(new Date(now - 864e5).toISOString())) return MXT().yest;
    try { return new Date(iso).toLocaleDateString(mLoc(), { day: 'numeric', month: 'numeric', year: '2-digit', timeZone: mTz() }); } catch (e) { return k; }
  }
  /* the list: the trainer first (bold when something is unread), then a "soon" cell */
  function lRender() {
    if (!el.cells) return; const t = MYT(), last = M.msgs[M.msgs.length - 1], un = mUnreadList().length;
    let prev = '', tm = '';
    if (last) { prev = last.kind === 'audio' ? MXT().voice : last.kind === 'image' ? MXT().photo : (last.body || ''); tm = mCellTime(last.created_at); }
    if (last && (mkOf(last.id).all || mkOf(last.id).me)) prev = AX().del;
    const dr = mDraft(); if (dr) { prev = dr.replace(/\s+/g, ' '); tm = ''; }
    el.cells.dir = (typeof lang === 'string' && lang === 'en') ? 'ltr' : 'rtl';
    el.cells.innerHTML = `<button type="button" class="mgr-cell${un ? ' unr' : ''}" data-open>
        <span class="mgr-ca mgr-logo"></span>
        <span class="mgr-cb"><span class="mgr-c1"><b dir="auto">${esc(TN())}</b><em>${esc(tm)}</em></span>
          <span class="mgr-c2">${!dr && last && last.sender !== 'trainer' ? mDots(last) : ''}<span class="mgr-cp" dir="auto">${dr ? `<i class="mgr-dr">${DLB()}: </i>` : ''}${esc(prev)}</span>${un ? `<span class="mgr-cn">${un}</span>` : ''}</span></span></button>
      <button type="button" class="mgr-cell" data-req><span class="mgr-ca" style="color:#38bdf8"><i class="fa-solid fa-paper-plane"></i></span>
        <span class="mgr-cb"><span class="mgr-c1"><b dir="auto">${esc(t.req)}</b></span><span class="mgr-c2"><span class="mgr-cp" dir="auto">${esc(t.reqSub)}</span></span></span></button>
      <button type="button" class="mgr-cell" data-as><span class="mgr-ca" style="color:#34d399"><i class="fa-solid fa-microphone-lines"></i></span>
        <span class="mgr-cb"><span class="mgr-c1"><b dir="auto">${esc(t.asst)}</b></span><span class="mgr-c2"><span class="mgr-cp" dir="auto">${esc(t.asstSub)}</span></span></span></button>`;
    el.cells.querySelector('[data-open]').onclick = () => setView('chat');
    /* Requests / Assistant: the Messenger steps aside (phone: stays underneath so Back returns to it) and the other screen opens */
    const away = () => { if (mgrPhone()) { M.susp = true; el.pop.style.display = 'none'; } else setMode('closed'); };
    el.cells.querySelector('[data-req]').onclick = () => { if (typeof openRq !== 'function') return; away(); openRq(); };
    el.cells.querySelector('[data-as]').onclick = () => { if (!window.Panels) return; away(); Panels.open('assistant'); };
  }
  const mgrPhone = () => matchMedia('(max-width:820px) and (pointer:coarse)').matches;
  const mRenderAll = () => { mBadge(); lRender(); mRender(); };
  const mSig = a => a.filter(x => !x._st).map(x => x.id + ':' + (x.read_at ? 1 : 0) + (x.delivered_at ? 1 : 0)).join(',') + '|' + (M.peerOnline ? 1 : 0);
  /* the trainer's messages count as read only while his conversation is really open on screen */
  function mMarkRead() {
    if (VIEW || !tok() || M.mode !== 'open' || M.view !== 'chat') return;
    const un = mUnreadList(); if (!un.length) return;
    rpc('trainee_msg_mark_read', { p_token: tok() }).then(r => {
      if (r && r.ok === false) return;
      const now = new Date().toISOString(); un.forEach(x => { x.read_at = now; }); M.sig = mSig(M.msgs); mRenderAll();
    }).catch(() => null);
  }
  async function mLoad() {
    if (M.busy || !tok()) return; M.busy = true;
    try {
      const r = await rpc('trainee_msg_list', { p_token: tok(), p_after: 0 }).catch(() => null);
      if (r && r.ok && Array.isArray(r.messages)) {
        const sig = mSig(r.messages);
        if (sig !== M.sig || !M.fetched) { M.msgs = r.messages.concat(M.msgs.filter(x => x._st)); M.sig = sig; M.fetched = true; mRenderAll(); }
        mMarkRead(); mkPull();
      }
    } finally { M.busy = false; }
  }
  function setView(v) {
    M.view = v; if (!el.pop) return; el.pop.dataset.view = v;
    el.title.textContent = v === 'chat' ? TN() : MYT().title; el.back.hidden = v !== 'chat'; el.hav.hidden = v !== 'chat';
    if (v === 'chat') { mRender(); el.list.scrollTop = el.list.scrollHeight; if (!mgrPhone()) setTimeout(() => { try { el.in.focus({ preventScroll: true }); } catch (e) { } }, 60); mMarkRead(); }
    else lRender();
  }
  function setMode(m) {
    build(); const was = M.mode; M.mode = m; M.susp = false;
    el.veil.style.display = m === 'open' ? 'block' : 'none';
    el.pop.style.display = m === 'open' ? 'flex' : 'none';
    if (m !== 'open') { el.att.hidden = true; clearInterval(M.timer); M.timer = null; }
    if (m === 'open') {
      setView(M.view || 'list');
      if (was !== 'open') { mLoad(); clearInterval(M.timer); M.timer = setInterval(() => { if (document.hidden) return; const gap = M.view === 'chat' ? 1500 : 5000; if (Date.now() - (M.lastPoll || 0) >= gap - 50) { M.lastPoll = Date.now(); mLoad(); } }, 500); }   /* chat open = a check every 1.5s (a new message shows up almost at once); the list = every 5s */
    }
  }
  function setQuote(s) {
    if (!s && M.editId) { M.editId = null; if (M.prevDraft != null) { el.in.value = M.prevDraft; M.prevDraft = null; fitIn(); el.send.hidden = !el.in.value.trim(); } }
    M.quote = s || ''; el.quote.hidden = !M.quote; el.quote.querySelector('span').textContent = M.quote;
  }
  async function mPost(tmp) {
    const r = await rpc('trainee_msg_send', { p_token: tok(), p_kind: 'text', p_body: tmp.body, p_quote: tmp.quote || null }).catch(() => null);
    const i = M.msgs.indexOf(tmp);
    if (r && r.ok && r.message) { if (i >= 0) M.msgs.splice(i, 1); if (!M.msgs.some(x => x.id === r.message.id)) M.msgs.push(r.message); }
    else { tmp._st = 'fail'; itToast(MXT().fail); }          /* stays in the chat with a red dot; tap it to send again */
    M.sig = mSig(M.msgs); M.loaded = false; mRenderAll();
  }
  function sendMsg() {
    if (M.editId) return mkApplyEdit();
    const v = el.in.value.trim(); if (!v) return;
    const tmp = { id: 't' + Date.now() + Math.random().toString(36).slice(2, 6), sender: 'trainee', kind: 'text', body: v, quote: M.quote || null, created_at: new Date().toISOString(), _st: 'pending' };
    M.msgs.push(tmp); el.in.value = ''; el.send.hidden = true; mDraftSet(''); fitIn(); setQuote(''); M.loaded = false; mRenderAll();
    setTimeout(() => { if (tmp._st === 'pending') mRender(); }, 1600);   /* still not sent after 1.6s -> the dot turns red */
    mPost(tmp);
  }
  function openMessenger(quote) { build(); M.nested = quote !== undefined; if (quote !== undefined) M.view = 'chat'; setMode('open'); if (quote !== undefined) setQuote(quote); }   /* Reply goes straight into the chat with the quote */
  window.thMessenger = {
    open: openMessenger, dock: () => leave(), close: () => askClose(),
    state: () => ({ open: M.mode === 'open', chat: M.view === 'chat' }),
    back: () => { if (M.view === 'chat') { M.nested = false; setView('list'); } },      /* chat -> the list */
    hide: () => { M.nested = false; setMode('closed'); },                              /* closes it, the typed draft stays */
    suspend: on => { if (!el.pop) return; if (on && M.mode === 'open') { M.susp = true; el.pop.style.display = 'none'; } else if (M.susp) { M.susp = false; if (M.mode === 'open') el.pop.style.display = 'flex'; } },
    name: () => TN(),
    msgs: () => M.msgs.slice(),
    reload: () => mLoad(),
    visible: () => M.mode === 'open' && !M.susp
  };
  /* presence: any sign of life (touch, mouse, key, scroll, copy...) in the last 10s = online. Never from the admin "view as" page. */
  let lastAct = Date.now();
  ['pointerdown', 'pointermove', 'touchstart', 'touchmove', 'keydown', 'scroll', 'wheel', 'click', 'input', 'copy', 'paste', 'focus'].forEach(ev => window.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true, capture: true }));
  /* every 10s: tell the server whether the student is active, and learn whether the trainer is online */
  const ping = () => {
    if (VIEW || !tok() || document.hidden) return;
    rpc('trainee_presence_ping', { p_token: tok(), p_active: Date.now() - lastAct <= 10500 }).then(r => {
      if (r && r.ok) { const on = !!r.trainer_online; if (on !== M.peerOnline) { M.peerOnline = on; mRenderAll(); } }
    }).catch(() => null);
  };
  setTimeout(ping, 2000); setInterval(ping, 10000);
  setInterval(() => { if (M.mode === 'open' && M.view === 'chat') ping(); }, 3000);   /* chat open: online / read status refreshes every 3s instead of 10s */
  /* background check: the number on the button stays right even while the pop-up is closed */
  setTimeout(() => { if (!document.hidden) mLoad(); }, 1500);
  setInterval(() => { if (!document.hidden && M.mode !== 'open') mLoad(); }, 10000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) mLoad(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && M.mode === 'open') leave(); }, true);

  /* the Messenger button (message-in-a-bottle), right next to the Feed button: same box, icon on top and a label under it like the others */
  const LBL = { en: 'Messenger', ar: 'ميسنجر', eg: 'ميسنجر' };
  const lbl = () => LBL[(typeof lang === 'string' && lang) || 'en'] || LBL.en;
  function installDove() {
    if (document.getElementById('mgrBtn')) return true;
    const f = document.getElementById('feedBtn'); if (!f) return false;
    const b = f.cloneNode(false); b.id = 'mgrBtn'; b.dataset.bk = 'msgr'; b.removeAttribute('onclick'); b.removeAttribute('style'); b.type = 'button';
    b.className = (f.className || '').replace(/\b(upd|glow|live|empty|num|open)\b/g, '').trim();
    b.title = lbl(); b.setAttribute('aria-label', lbl());
    b.innerHTML = '<span class="mgr-ico"></span><span class="thl"></span><span id="mgrNum"></span>';
    b.querySelector('.thl').textContent = lbl();
    b.onclick = e => { e.stopPropagation(); build(); M.nested = false; setMode(M.mode === 'open' ? 'closed' : 'open'); };   /* from the bar: never a tab */
    f.insertAdjacentElement('afterend', b); mBadge(); return true;
  }
  { let n = 0; const iv = setInterval(() => { if (installDove() || ++n > 120) clearInterval(iv); }, 500); }
  setInterval(() => { const l = document.querySelector('#mgrBtn .thl'); if (l && l.textContent !== lbl()) { l.textContent = lbl(); const b = document.getElementById('mgrBtn'); b.title = lbl(); } }, 2000);

  /* ---------- the icon row ---------- */
  const txt = e => e ? (e.innerText || e.textContent || '').trim() : '';
  function ctxOf(btn) {
    const it = btn.closest('.itm'); if (it) return { title: txt(it.querySelector('.ith b')), text: [txt(it.querySelector('.ith b')), txt(it.querySelector('.itd'))].filter(Boolean).join('\n') };
    const nf = btn.closest('.pc.nf'); if (nf) return { title: txt(nf.querySelector('.nth')), text: [txt(nf.querySelector('.nth')), txt(nf.querySelector('.nfb .rich'))].filter(Boolean).join('\n') };
    if (btn.closest('#mdl')) return { title: txt(document.getElementById('mT')), text: [txt(document.getElementById('mT')), txt(document.getElementById('mB'))].filter(Boolean).join('\n') };
    return { title: '', text: '' };
  }
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return true; } catch (e) { }
    try { const a = document.createElement('textarea'); a.value = s; a.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok; } catch (e) { return false; }
  }
  async function act(id, btn) {
    const c = ctxOf(btn);
    if (id === 'reply') return openMessenger(c.text || c.title || '');
    if (id === 'copy') { if (await copyText(c.text)) toast(T().copied); return; }
    if (id === 'share') {
      if (navigator.share) { try { await navigator.share({ text: c.text }); } catch (e) { } return; }
      if (await copyText(c.text)) toast(T().copied);
    }
  }
  window.addEventListener('click', e => {
    const b = e.target && e.target.closest && e.target.closest('.opx-i'); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation(); act(b.getAttribute('data-id'), b);
  }, true);

  const bar = () => {
    const w = document.createElement('div'); w.className = 'opx-bar';
    w.innerHTML = OPTS.map(o => `<button type="button" class="opx-i" data-id="${o.id}" aria-label="${T()[o.id]}" title="${T()[o.id]}"><i class="${o.icon}"></i></button>`).join('');
    return w;
  };
  function scan() {
    document.querySelectorAll('.itm').forEach(it => {
      if (it.querySelector('.opx-bar')) return;
      const a = it.querySelector('.itd') || it.querySelector('.ith'); if (a && a.parentNode) a.insertAdjacentElement('afterend', bar());
    });
    document.querySelectorAll('.pc.nf .nfb').forEach(nb => { if (!nb.querySelector('.opx-bar')) nb.insertBefore(bar(), nb.querySelector('.ackb') || null); });
    const m = document.getElementById('mdl'), mb = document.getElementById('mB');
    if (m && mb && !m.querySelector('.opx-bar')) mb.insertAdjacentElement('afterend', bar());
  }
  let q = 0;
  const sched = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; try { scan(); } catch (e) { console.warn('[options]', e); } }); };
  const start = () => { new MutationObserver(sched).observe(document.body, { childList: true, subtree: true }); scan(); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
/* ===== Bar: Theme + Profile now live inside Settings; even icon / label / border spacing; hover grows only the icon ===== */
(function () {
  const old = document.getElementById('thBarFinal'); if (old) old.remove();
  const st = document.createElement('style'); st.id = 'thBarFinal';
  st.textContent = `
html body #mobileFloatingBar #floatBtnTheme,html body #mobileFloatingBar #profBtn{display:none!important}
html body #mobileFloatingBar>[data-bk]:not(#z),html body #mobileFloatingBar #barEdit:not(#z),html body #mobileFloatingBar #mgrBtn:not(#z){
  position:relative!important;box-sizing:border-box!important;height:58px!important;padding:0 0 20px!important;margin:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;overflow:visible!important}
html body #mobileFloatingBar>[data-bk]:not(#z):not(.lifting):not(.pk-on):not(.pk-hide):hover,html body #mobileFloatingBar #barEdit:not(#z):not(.pk-on):not(.pk-hide):hover,html body #mobileFloatingBar #mgrBtn:not(#z):hover{transform:none!important}
html body #mobileFloatingBar>[data-bk]:not(#z)>i,html body #mobileFloatingBar>[data-bk]:not(#z)>svg,html body #mobileFloatingBar #barEdit>svg,html body #mobileFloatingBar #barEdit>i,html body #mobileFloatingBar #mgrBtn .mgr-ico{transition:transform .18s cubic-bezier(.2,.9,.3,1.4);transform-origin:50% 50%}
@media(hover:hover){
html body #mobileFloatingBar>[data-bk]:not(#z):hover>i,html body #mobileFloatingBar>[data-bk]:not(#z):hover>svg,html body #mobileFloatingBar #barEdit:hover>svg,html body #mobileFloatingBar #barEdit:hover>i,html body #mobileFloatingBar #mgrBtn:hover .mgr-ico{transform:scale(1.1)}}
html body #mobileFloatingBar #mgrBtn .mgr-ico{width:26px!important;height:26px!important;flex:none}
html body #mobileFloatingBar .thl,html body #mobileFloatingBar #mgrBtn .thl{position:absolute!important;left:0;right:0;bottom:10px;text-align:center;line-height:1.1}
html body #mobileFloatingBar #feedBtn #feedNum{top:9px!important;left:calc(50% + 12px)!important;right:auto!important}`;
  document.head.appendChild(st);
})();

/* ==========================================================
   Settings / Add menus as ONE big container with raised cells (accordion).
   - header: icon (left), title (centre), X. Cells below, top to bottom (phone and desktop alike).
   - tap a cell: its options open under it; tap an option that has options: they open under it too. Only one open per level; tap an open one: it folds.
   - Settings: Theme (Dark / Light), Language, Font size (Small / Normal / Large + a small preview box), Account (Profile / Calendar / Log out).
     Changes are held until Save. Tap outside or X with unsaved changes = asks first. No tabs anywhere.
   - Theme, Language and Account are no longer bar buttons (they only live here). Brightness is gone.
   ========================================================== */
(function () {
  const tr = (a, b, c) => { const l = (typeof lang === 'string' && lang) || 'en'; return l === 'en' ? a : (l === 'ar' ? b : c); };
  const FS = { small: .9, normal: 1, large: 1.15 };
  const sizeOf = z => z < .95 ? 'small' : (z > 1.05 ? 'large' : 'normal');

  const old = document.getElementById('thSetCss'); if (old) old.remove();
  const css = document.createElement('style'); css.id = 'thSetCss';
  css.textContent = `
#thSet{position:fixed;inset:0;z-index:10040;display:none;justify-content:center;align-items:flex-start;padding:max(14px,env(safe-area-inset-top)) 14px calc(90px + env(safe-area-inset-bottom));background:rgba(2,6,23,.5);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);overflow:auto;box-sizing:border-box}
#thSet.open{display:flex}
#thSet .tsc{position:relative;width:min(440px,100%);margin:auto 0;padding:12px;border-radius:22px;background:rgba(15,23,42,.97);color:#f1f5f9;border:1px solid rgba(255,255,255,.14);box-shadow:0 18px 50px rgba(0,0,0,.55);box-sizing:border-box;font-family:Cairo,Inter,sans-serif}
body.light-theme #thSet .tsc{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.14)}
#thSet .tsh{display:flex;direction:ltr;align-items:center;gap:10px;padding:4px 6px 12px}
#thSet .tsh .tsi{width:30px;text-align:center;font-size:20px;flex:none}
#thSet .tsh b{flex:1;text-align:center;font-size:1.02rem;font-weight:800}
#thSet .tsx{width:30px;height:30px;flex:none;border:0;border-radius:50%;background:rgba(148,163,184,.18);color:inherit;cursor:pointer;font-size:14px}
#thSet .tsl{margin-bottom:8px;border-radius:14px;background:rgba(148,163,184,.12);border:1px solid rgba(148,163,184,.24);box-shadow:0 3px 0 rgba(0,0,0,.22),0 6px 14px rgba(0,0,0,.18)}
body.light-theme #thSet .tsl{background:#f1f5f9;border-color:rgba(15,23,42,.12);box-shadow:0 2px 0 rgba(15,23,42,.1),0 5px 12px rgba(15,23,42,.08)}
#thSet .tsl .tsl{background:rgba(148,163,184,.14);box-shadow:none;margin:6px 0 0}
#thSet .tsr{display:flex;direction:ltr;align-items:center;gap:10px;padding:12px 14px;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}
#thSet .tsr .tsi{width:26px;text-align:center;font-size:18px;flex:none}
#thSet .tsr .tst{flex:1;text-align:center;font-weight:700;font-size:.9rem;overflow-wrap:anywhere}
#thSet .tsr .tsv{width:26px;text-align:center;font-size:12px;opacity:.6;flex:none;transition:transform .2s}
#thSet .tsl.op>.tsr .tsv{transform:rotate(180deg)}
#thSet .tsl.sel>.tsr{color:#34d399}
#thSet .tsb{padding:0 10px 10px;display:none}
#thSet .tsl.op>.tsb{display:block}
#thSet .tsp{margin-top:8px;padding:16px 10px;border-radius:12px;text-align:center;background:rgba(148,163,184,.12);border:1px dashed rgba(148,163,184,.4);overflow:hidden}
#thSet .tsp b{display:block;font-weight:800;line-height:1.2}
#thSet .tsp span{display:block;opacity:.75;line-height:1.3;margin-top:4px}
#thSet .tsf{margin-top:4px}
#thSet .tsf button{width:100%;padding:12px;border:0;border-radius:14px;background:#34d399;color:#04231a;font:800 .9rem Cairo,Inter,sans-serif;cursor:pointer}
#thSet .tsq{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;padding:18px;border-radius:22px;background:rgba(2,6,23,.78)}
#thSet .tsq>div{background:#1e293b;color:#f1f5f9;border-radius:16px;padding:18px;max-width:320px;text-align:center}
#thSet .tsq p{margin:0 0 14px;font-weight:700;line-height:1.5}
#thSet .tsq .bb{display:flex;gap:8px}
#thSet .tsq button{flex:1;padding:10px 8px;border-radius:12px;border:0;font:700 .8rem Cairo,Inter,sans-serif;cursor:pointer;background:#475569;color:#fff}
#thSet .tsq button.y{background:#b42318}`;
  document.head.appendChild(css);

  let root = null, cfg = null, openMap = {};

  function ensure() {
    if (root) return;
    root = document.createElement('div'); root.id = 'thSet'; document.body.appendChild(root);
    root.addEventListener('pointerdown', e => { if (e.target === root) tryClose(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('open')) { if (document.querySelector('#thCal.open,#asm:not([hidden]),.ssm.open')) return; e.stopImmediatePropagation(); tryClose(); } }, true);
  }
  const dirty = () => !!(cfg && cfg.dirty && cfg.dirty());
  function closeNow() { root.classList.remove('open'); root.innerHTML = ''; cfg = null; }
  function tryClose() {
    if (!cfg) return;
    if (!dirty()) return closeNow();
    const q = document.createElement('div'); q.className = 'tsq';
    q.innerHTML = '<div><p></p><div class="bb"><button type="button" class="y"></button><button type="button" class="n"></button></div></div>';
    q.querySelector('p').textContent = tr('Are you sure you want to leave before saving your changes?', 'هل أنت متأكد أنك تريد الخروج قبل حفظ التغييرات؟', 'متأكد إنك عايز تطلع قبل ما تحفظ التغييرات؟');
    q.querySelector('.y').textContent = tr('Leave without saving', 'خروج بدون حفظ', 'اطلع من غير حفظ');
    q.querySelector('.n').textContent = tr('No, go back', 'لا، ارجع', 'لا، ارجع');
    q.querySelector('.n').onclick = () => q.remove();
    q.querySelector('.y').onclick = () => { if (cfg.discard) cfg.discard(); closeNow(); };
    root.querySelector('.tsc').appendChild(q);
  }

  function cell(it, path, level) {
    const w = document.createElement('div'), kids = it.children && it.children(), isOpen = openMap[path.slice(0, path.lastIndexOf('/'))] === path;
    w.className = 'tsl' + (isOpen ? ' op' : '') + (it.selected && it.selected() ? ' sel' : '');
    const r = document.createElement('div'); r.className = 'tsr'; r.setAttribute('role', 'button'); r.tabIndex = 0;
    r.innerHTML = `<span class="tsi">${it.icon || ''}</span><span class="tst" dir="auto"></span><span class="tsv">${kids || it.preview ? '<i class="fa-solid fa-chevron-down"></i>' : (it.selected && it.selected() ? '<i class="fa-solid fa-check"></i>' : '')}</span>`;
    r.querySelector('.tst').textContent = it.label;
    const act = () => {
      if (kids || it.preview) { const par = path.slice(0, path.lastIndexOf('/')); openMap[par] = isOpen ? null : path; draw(); }   /* open one at a time; tap an open one = fold */
      else if (it.pick) { it.pick(); draw(); }
      else if (it.on) { const f = it.on; if (it.keep) f(); else { closeNow(); setTimeout(f, 60); } }
    };
    r.onclick = act; r.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } };
    w.appendChild(r);
    if (isOpen) {
      const b = document.createElement('div'); b.className = 'tsb';
      (kids || []).forEach((k, i) => b.appendChild(cell(k, path + '/' + i, level + 1)));
      if (it.preview) b.appendChild(it.preview());
      w.appendChild(b);
    }
    return w;
  }
  function draw() {
    const keep = root.scrollTop; root.innerHTML = '';
    const c = document.createElement('div'); c.className = 'tsc';
    const h = document.createElement('div'); h.className = 'tsh';
    h.innerHTML = `<span class="tsi">${cfg.icon}</span><b dir="auto"></b><button type="button" class="tsx" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>`;
    h.querySelector('b').textContent = cfg.title; h.querySelector('.tsx').onclick = tryClose;
    c.appendChild(h);
    cfg.items().forEach((it, i) => c.appendChild(cell(it, 'r/' + i, 0)));
    if (dirty()) {
      const f = document.createElement('div'); f.className = 'tsf'; f.innerHTML = '<button type="button"></button>';
      f.firstChild.textContent = tr('Save', 'حفظ', 'حفظ'); f.firstChild.onclick = () => { const s = cfg.save; closeNow(); s(); }; c.appendChild(f);
    }
    root.appendChild(c); root.scrollTop = keep;
  }
  function panel(c) { ensure(); cfg = c; openMap = {}; root.classList.add('open'); draw(); }

  /* ---------- Add menu ---------- */
  window.openPlus = () => panel({
    title: tr('Add', 'إضافة', 'إضافة'), icon: '<i class="fa-solid fa-plus"></i>',
    items: () => [
      { icon: '<i class="fa-solid fa-microphone-lines" style="color:#34d399"></i>', label: tr('Assistant', 'المساعد', 'المساعد'), keep: 1, on: () => Panels.open('assistant') },
      { icon: '<i class="fa-solid fa-paper-plane" style="color:#38bdf8"></i>', label: tr('Requests', 'الطلبات', 'الطلبات'), keep: 1, on: () => openRq() }
    ]
  });

  /* ---------- Settings ---------- */
  window.openStar = () => {
    const isLight = () => document.body.classList.contains('light-theme'), curLang = () => (typeof lang === 'string' && lang) || 'en';
    const base = { theme: isLight() ? 'light' : 'dark', lang: curLang(), size: sizeOf(uiGet().zoom) };
    const P = Object.assign({}, base);
    const nm = { en: 'English', ar: 'عربي', eg: 'مصري' };
    const preview = () => {
      const d = document.createElement('div'), f = FS[P.size];
      d.className = 'tsp'; d.innerHTML = '<b></b><span></span>';
      d.firstChild.style.fontSize = (24 * f) + 'px'; d.firstChild.textContent = 'ثابت';
      d.lastChild.style.fontSize = (13 * f) + 'px'; d.lastChild.textContent = tr('This is how the text will look', 'هكذا سيبدو النص', 'كده شكل الكلام');
      return d;
    };
    /* every change is applied and saved the moment it is picked (no Save button); a small message tells the student it was applied */
    const applyNow = key => {
      try {
        if (key === 'theme') { if ((P.theme === 'light') !== isLight()) toggleTheme(); }
        else if (key === 'size') { const o = { zoom: FS[P.size], bri: 1 }; try { localStorage.setItem(UI_KEY, JSON.stringify(o)); } catch (e) { } uiApply(o); }
        else if (key === 'lang') { if (P.lang !== curLang()) setLanguage(P.lang); }
        itToast(tr('Change applied ✓', 'تم تطبيق التغيير ✓', 'التغيير اتطبق ✓'));
      } catch (e) { console.warn('[settings]', e); }
    };
    const opt = (key, val, label, icon) => ({ icon: icon || '', label, pick: () => { if (P[key] === val) return; P[key] = val; applyNow(key); }, selected: () => P[key] === val });
    panel({
      title: tr('More', 'المزيد', 'المزيد'), icon: '<i class="fa-solid fa-plus"></i>',
      dirty: () => false,   /* nothing waits for a Save any more */
      discard: () => { },
      save: () => {
        if (P.theme !== base.theme) toggleTheme();
        if (P.size !== base.size) { const o = { zoom: FS[P.size], bri: 1 }; try { localStorage.setItem(UI_KEY, JSON.stringify(o)); } catch (e) { } uiApply(o); }
        if (P.lang !== base.lang) setLanguage(P.lang);
        try { itToast(tr('Saved ✓', 'تم الحفظ ✓', 'اتحفظ ✓')); } catch (e) { }
      },
      items: () => [
        { icon: '<i class="fa-solid fa-circle-half-stroke"></i>', label: tr('Theme', 'الوضع', 'الوضع'), children: () => [
          opt('theme', 'dark', tr('Dark', 'داكن', 'دارك'), '<i class="fa-solid fa-moon"></i>'),
          opt('theme', 'light', tr('Light', 'فاتح', 'وايت'), '<i class="fa-solid fa-sun"></i>')] },
        { icon: '<i class="fa-solid fa-globe"></i>', label: tr('Language', 'اللغة', 'اللغة'), children: () => ['en', 'ar', 'eg'].map(x => opt('lang', x, nm[x])) },
        { icon: '<i class="fa-solid fa-text-height"></i>', label: tr('Font size', 'حجم الخط', 'حجم الخط'), children: () => [
          opt('size', 'small', tr('Small', 'صغير', 'صغير')), opt('size', 'normal', tr('Normal', 'عادي', 'عادي')), opt('size', 'large', tr('Large', 'كبير', 'كبير'))], preview },
        { icon: '<i class="fa-regular fa-user"></i>', label: tr('Account', 'الحساب', 'الحساب'), children: () => [
          { icon: '<i class="fa-regular fa-user"></i>', label: tr('Profile', 'ملفي', 'ملفي'), keep: 1, on: () => Panels.open('profile') },
          { icon: '<i class="fa-solid fa-right-from-bracket" style="color:#f43f5e"></i>', label: tr('Log out', 'تسجيل الخروج', 'تسجيل الخروج'), on: () => window.logout && window.logout() }] }
      ]
    });
  };

  /* ---------- Theme / Language / Account buttons never show on the bar (inline !important beats every stylesheet) ---------- */
  setInterval(() => ['floatBtnTheme', 'profBtn', 'langBtn', 'plusBtn'].forEach(id => { const b = document.getElementById(id); if (b && b.style.getPropertyValue('display') !== 'none') b.style.setProperty('display', 'none', 'important'); }), 400);
})();

/* ==========================================================
   PHONE ONLY (touch + narrow screen): every option opens as a FULL PAGE instead of a pop-up.
   - Notifications, Messenger (and its Chat / Requests / Assistant), Settings, Requests, Assistant, Profile
   - nothing behind can be tapped; leave with the X, the Back button, or the phone's back gesture / button
   - while a page is open the main page options (bottom bar, top logo, tabs) are hidden
   - back gesture = one step back (chat -> messenger list -> main page). On the main page: the first pull asks
     "sure you want to exit?", a second pull within 3.5 s leaves. The student stays signed in.
   Computers are not touched at all.
   ========================================================== */
(function () {
  if (window.__thfp) return; window.__thfp = 1;
  const PH = () => matchMedia('(max-width:820px) and (pointer:coarse)').matches;
  const tr = (a, b, c) => { const l = (typeof lang === 'string' && lang) || 'en'; return l === 'en' ? a : (l === 'ar' ? b : c); };
  const G = id => document.getElementById(id);

  const st = document.createElement('style'); st.id = 'thFpCss';
  st.textContent = `
#plusBtn,[data-bk="plus"],html body #mobileFloatingBar #plusBtn,html body #mobileFloatingBar [data-bk="assist"]{display:none!important}
#thFpBar{display:none}
.thfp-dead{pointer-events:none!important}
.thfp-toast{position:fixed;left:50%;bottom:calc(28px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483004;max-width:88vw;text-align:center;background:rgba(15,23,42,.96);color:#fff;border:1px solid rgba(255,255,255,.2);padding:11px 16px;border-radius:16px;font:700 13px/1.4 Cairo,Inter,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4)}
@media (max-width:820px) and (pointer:coarse){
:root{--fp-bg:#12161b;--fp-fg:#e9edef;--fp-glass:rgba(14,18,23,.6)}
body.light-theme{--fp-bg:#f4f6f9;--fp-fg:#0f172a;--fp-glass:rgba(244,246,249,.62)}
#thFpBar{position:fixed;top:0;left:0;right:0;z-index:2147483002;height:calc(52px + env(safe-area-inset-top));box-sizing:border-box;padding:env(safe-area-inset-top) 8px 0;align-items:center;gap:8px;direction:ltr;background:transparent;color:var(--fp-fg);pointer-events:none}
body.thfp-open #thFpBar{display:flex}
#thFpBar b{margin-inline-end:48px;flex:1;min-width:0;text-align:center;font:800 15px Cairo,Inter,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#thFpBar button{pointer-events:auto;width:40px;height:40px;flex:none;border:0;border-radius:0;background:none!important;color:inherit;font-size:19px;cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}
#thFpBar button:active{transform:scale(.92)}
/* the main page options disappear while a page is open */
body.thfp-open #mobileFloatingBar,body.thfp-open #thBrand,body.thfp-open #dock,body.thfp-open #mgrBtn{visibility:hidden!important}
/* every screen = the whole page */
#pop.open,#asm:not([hidden]),#rqm.open,#rqn.open,#rqo.open,#thSet.open{position:fixed!important;inset:0!important;left:0!important;top:0!important;right:0!important;bottom:0!important;width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;margin:0!important;border-radius:0!important;transform:none!important;box-sizing:border-box!important;background:var(--fp-glass)!important;-webkit-backdrop-filter:blur(7px) saturate(1.15)!important;backdrop-filter:blur(7px) saturate(1.15)!important;padding:calc(60px + env(safe-area-inset-top)) 12px calc(18px + env(safe-area-inset-bottom))!important;overflow:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
#pop.open,#rqm.open,#rqn.open,#rqo.open{display:flex!important;flex-direction:column;align-items:center}
#pop.open .pcs{margin:auto 0!important;width:100%;max-width:480px}
#rqm .ssbox,#rqn .ssbox,#rqo .ssbox{margin:auto!important}
#asm:not([hidden]){padding:calc(52px + env(safe-area-inset-top)) 0 0!important;overflow:hidden!important}
#asm>*,#asm #pp-assistant,#asm #pp-profile{width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;border-radius:0!important;box-shadow:none!important;margin:0!important}
#asm #pp-profile{overflow:auto}
#asm iframe,#asFrame{width:100%!important;height:100%!important;border:0!important}
#rqm .ssbox,#rqn .ssbox,#rqo .ssbox{width:min(440px,100%)!important;max-height:none!important}
#rqm .ssh,#rqn .ssh,#rqo .ssh,#thSet .tsh,.mgr-h{display:none!important}
#asm .asx{display:none!important}
.mgr-veil{display:none!important}
.mgr-pop{left:0!important;top:0!important;transform:none!important;width:100%!important;max-width:none!important;height:100%!important;height:100dvh!important;border-radius:0!important;border:0!important;box-shadow:none!important;padding-top:calc(52px + env(safe-area-inset-top))!important;box-sizing:border-box!important;background:rgba(11,20,26,.68)!important;-webkit-backdrop-filter:blur(7px) saturate(1.15);backdrop-filter:blur(7px) saturate(1.15)}
.mgr-cells,.mgr-list{background:transparent!important}
.mgr-comp{background:rgba(32,44,51,.85)!important}
.mgr-comp{padding-bottom:calc(8px + env(safe-area-inset-bottom))!important}
}`;
  document.head.appendChild(st);

  const bar = document.createElement('div'); bar.id = 'thFpBar';
  bar.innerHTML = '<button type="button" data-b aria-label="Back"><i class="fa-solid fa-chevron-left"></i></button><b dir="auto"></b>';
  document.body.appendChild(bar);

  function toast(m) {
    document.querySelectorAll('.thfp-toast').forEach(x => x.remove());
    const t = document.createElement('div'); t.className = 'thfp-toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3500);
  }

  /* which screens are open right now, in the order they were opened */
  let order = [];
  function openKeys() {
    const k = [], m = window.thMessenger && thMessenger.state ? thMessenger.state() : { open: false };
    if (m.open) { k.push('mgr'); if (m.chat) k.push('mgrchat'); }
    const on = id => { const e = G(id); return !!(e && e.classList.contains('open')); };
    if (on('pop')) k.push('pop');
    const a = G('asm'); if (a && !a.hidden) k.push('asm');
    if (on('rqm') || on('rqn') || on('rqo')) k.push('rq1');
    if (on('rqn') || on('rqo')) k.push('rq2');
    if (on('thSet')) k.push('set');
    if (on('thDays')) k.push('days');
    if (on('thCal')) k.push('cal');
    if (on('thLib')) k.push('lib');
    if (on('thSpace')) k.push('space');
    return k;
  }
  function refresh() { const cur = openKeys(); order = order.filter(k => cur.includes(k)).concat(cur.filter(k => !order.includes(k))); }
  function closeLayer(k) {
    try {
      if (k === 'mgrchat') thMessenger.back();
      else if (k === 'mgr') thMessenger.hide();
      else if (k === 'pop') closePop();
      else if (k === 'asm') Panels.min();
      else if (k === 'rq2') rqBack();
      else if (k === 'rq1') closeRq();
      else if (k === 'cal') window.closeCal && window.closeCal();
      else if (k === 'days') window.thDays && window.thDays.close();
      else if (k === 'lib') window.closeLibrary && window.closeLibrary();
      else if (k === 'space') window.thSpace && thSpace.close();
      else if (k === 'set') { const x = document.querySelector('#thSet .tsx'); if (x) x.click(); }
    } catch (e) { console.warn('[fullpage] close', k, e); }
  }
  function title(k) {
    if (k === 'mgr') return tr('Thabit Messenger', 'ثابت ميسنجر', 'ثابت ميسنجر');
    if (k === 'mgrchat') return (window.thMessenger && thMessenger.name && thMessenger.name()) || '';
    if (k === 'pop') return tr('Feed', 'فيد', 'فيد');
    if (k === 'asm') { const p = G('pp-profile'); return p && !p.hidden ? tr('Profile', 'ملفي', 'ملفي') : tr('Assistant', 'المساعد', 'المساعد'); }
    if (k === 'rq1' || k === 'rq2') return tr('Requests', 'الطلبات', 'الطلبات');
    if (k === 'days') return tr('Time', 'الوقت', 'تايم');
    if (k === 'space') return tr('Space', 'سبيس', 'سبيس');
    if (k === 'set') { const b = document.querySelector('#thSet .tsh b'); return (b && b.textContent) || tr('Settings', 'الإعدادات', 'الإعدادات'); }
    return '';
  }

  /* history: [root] [guard] [screen 1] [screen 2] ... -> the phone's back gesture / button steps back one screen */
  let pos = 1, prog = false, armed = false, armT = 0;
  (function init() {
    if (!PH()) return;
    try {
      const h = history.state;
      if (h && h.thfp) { pos = h.i; if (pos === 0) { history.pushState({ thfp: 1, i: 1 }, ''); pos = 1; } }
      else { history.replaceState({ thfp: 1, i: 0 }, ''); history.pushState({ thfp: 1, i: 1 }, ''); pos = 1; }
    } catch (e) { }
  })();

  /* dead background: the page is frozen where it was (scroll position kept), every part of it is inert; it wakes up when the last screen closes */
  let locked = false, keepY = 0;
  function lockPage(on) {
    if (on === locked) return; locked = on;
    const b = document.body.style, h = document.documentElement.style;
    if (on) { keepY = window.scrollY || document.documentElement.scrollTop || 0; b.position = 'fixed'; b.top = (-keepY) + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; h.overflow = 'hidden'; }
    else { b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = ''; h.overflow = ''; window.scrollTo(0, keepY); }
  }
  function sync() {
    refresh();
    const top = order[order.length - 1], ph = PH();
    document.body.classList.toggle('thfp-open', ph && order.length > 0);
    lockPage(ph && order.length > 0);
    if (window.thMessenger && thMessenger.suspend) thMessenger.suspend(ph && order.includes('mgr') && top !== 'mgr' && top !== 'mgrchat' && top !== 'lib');
    if (!ph) return;
    const t = bar.querySelector('b'), tt = title(top); if (t.textContent !== tt) t.textContent = tt;
    const want = order.length + 1;
    try {
      if (want > pos) { for (let i = pos + 1; i <= want; i++) history.pushState({ thfp: 1, i }, ''); pos = want; }
      else if (want < pos && !prog) { prog = true; setTimeout(() => { prog = false; }, 700); history.go(want - pos); }
    } catch (e) { }
  }
  window.addEventListener('popstate', e => {
    if (!PH()) return;
    const i = e.state && e.state.thfp ? e.state.i : 0;
    if (prog) { prog = false; pos = i; return; }
    pos = i;
    if (i === 0) {                                               /* pulled back past the main page = wants to leave */
      refresh(); let n = 0; while (order.length && n++ < 8) { closeLayer(order[order.length - 1]); refresh(); }
      if (armed && Date.now() - armT < 3500) { armed = false; history.back(); return; }
      armed = true; armT = Date.now();
      toast(tr('Are you sure you want to exit? Swipe back once more to leave.', 'متأكد إنك عايز تخرج؟ اسحب مرة كمان للخروج.', 'متأكد إنك عايز تطلع؟ شد مرة كمان عشان تطلع.'));
      try { history.pushState({ thfp: 1, i: 1 }, ''); pos = 1; } catch (er) { }
      return;
    }
    refresh(); let n = 0;
    while (order.length > i - 1 && n++ < 8) { const before = order.length; closeLayer(order[order.length - 1]); refresh(); if (order.length === before) break; }
    sync();                                                      /* a screen that refused to close (unsaved Settings) gets its history step back */
  });

  bar.querySelector('[data-b]').onclick = () => { refresh(); if (order.length) closeLayer(order[order.length - 1]); sync(); };

  /* nothing behind a full page reacts to taps: a tap on the empty edge of a screen never closes it */
  const ROOTS = ['pop', 'asm', 'rqm', 'rqn', 'rqo', 'thSet', 'thCal', 'thDays'];
  ['pointerdown', 'mousedown', 'click'].forEach(ev => document.addEventListener(ev, e => {
    if (PH() && e.target && e.target.id && ROOTS.includes(e.target.id)) e.stopImmediatePropagation();
  }, true));

  setInterval(sync, 150);
  window.thFpSync = sync;
})();


/* ==========================================================
   Glass blur + calendar full page + no titles + skeleton loading (Thabit logo)
   Appended at the END of dashboard.js. Delete this block to go back.
   ========================================================== */
const TH_LOGO = 'url(data:image/png;base64,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)';
(function () {
  const old = document.getElementById('thGlassCss'); if (old) old.remove();
  const st = document.createElement('style'); st.id = 'thGlassCss';
  st.textContent = `
:root{--thlogo:__LOGO_URL__}
/* real frosted glass: only faint colour / light / motion hints come through, no details */
html :is(#pop,.ssm,#thCal,#thExc,#thLib,#thMenu,#thRov,#thDet,#tpk,#thDisp,#thPush,#thSet,#asm,.mgr-veil){-webkit-backdrop-filter:blur(48px) saturate(1.6)!important;backdrop-filter:blur(48px) saturate(1.6)!important;background-color:rgba(8,12,20,.5)!important}
body.light-theme :is(#pop,.ssm,#thCal,#thExc,#thLib,#thMenu,#thRov,#thDet,#tpk,#thDisp,#thSet,#asm,.mgr-veil){background-color:rgba(238,242,248,.52)!important}
/* full pages (phone rules): much stronger blur, nearly opaque, so only blurred glows remain */
html :is(#pop.open,#asm:not([hidden]),#rqm.open,#rqn.open,#rqo.open,#thSet.open,#thCal.open,#thLib.open,.ssm.open,.mgr-pop){-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:#000!important}
body.light-theme :is(#pop.open,#asm:not([hidden]),#rqm.open,#rqn.open,#rqo.open,#thSet.open,#thCal.open,#thLib.open,.ssm.open,.mgr-pop){background:#f4f6f9!important}
html .mgr-pop :is(.mgr-h,.mgr-cells,.mgr-list){background:transparent!important}
/* a page is open: header = only the logo (no background, no name, never moves); bar hidden; arrow sits right of the logo */
html.th-page body #thBrand,html.th-page body.light-theme #thBrand{visibility:visible!important;background:none!important;background-image:none!important;border:0!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;pointer-events:none!important;z-index:2147483003!important}
html.th-page :is(#mobileFloatingBar,#dock,#thHint,#feedBtn,#mgrBtn){visibility:hidden!important}
html.th-page #thFpBar,html.th-page .thbk{padding-left:64px!important}
html.th-page #thFpBar button{margin-top:-9px}
#pop .pc{-webkit-backdrop-filter:blur(30px) saturate(1.6)!important;backdrop-filter:blur(30px) saturate(1.6)!important}
/* the calendar is a full page too (like Settings) and sits above it, so Back returns to Settings */
#thCal{z-index:10060!important}
html #thCal.open{padding:calc(60px + env(safe-area-inset-top)) 0 calc(18px + env(safe-area-inset-bottom))!important;align-items:flex-start!important}
#thCal .cbox{width:min(560px,100%)!important;max-height:none!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
#asm,.ssm{z-index:10060!important}
/* no page title / name in the top bar: only the back arrow, no circle */
#thFpBar b{display:none!important}
/* skeleton: while loading / refreshing */
.th-sk{position:absolute;inset:0;z-index:4;border-radius:inherit;overflow:hidden;pointer-events:none;background:rgba(148,163,184,.1)}
.th-sk::before{content:"";position:absolute;inset:0;width:60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.2),transparent);transform:translateX(-120%);animation:thSkSweep 1.5s ease-in-out infinite}
.th-sk::after{content:"";position:absolute;left:50%;top:50%;width:min(46px,55%);aspect-ratio:1;max-height:70%;transform:translate(-50%,-50%);background:currentColor;opacity:.16;-webkit-mask:var(--thlogo) center/contain no-repeat;mask:var(--thlogo) center/contain no-repeat}
@keyframes thSkSweep{to{transform:translateX(260%)}}
html.th-skel :is(.thabit-card,.test-card,.tkcell,.cap,.scrt,.dnr,.ssi){position:relative}
html.th-skel :is(.thabit-card,.test-card,.tkcell,.cap,.scrt,.dnr,.ssi)>*:not(.th-sk){visibility:hidden!important}
html.th-skel :is(.itc,.tkdot,.thrb,.ear,.tharr){position:relative;background:rgba(148,163,184,.18)!important;border-color:transparent!important;color:transparent!important;animation:none!important}
html.th-skel :is(.itc,.tkdot,.thrb,.tharr,.ear)>*:not(.th-sk){visibility:hidden!important}
html.th-skel :is(.thabit-card,.test-card) svg.c2{visibility:hidden}
/* (old bar skeleton tiles removed: while loading, the bar / header only get a light streak passing under the glass, see thSkFlash) */
@media(prefers-reduced-motion:reduce){.th-sk::before{animation:none}}`.replace('__LOGO_URL__', TH_LOGO);
  document.head.appendChild(st);

  /* the skeleton is a full-screen layer drawn by brand.js (thSkelOv): it covers every load / refresh (F5, Ctrl+R, Ctrl+Shift+R, browser reload, pull down at the top) */
  window.thSkel = function (on) { if (!window.thSkelOv) return; if (on) thSkelOv.show(); else thSkelOv.hide(); };
  const _l = load;
  load = async function () { try { await _l(); } finally { if (window.thSkelOv) thSkelOv.hide(); } };
  /* the refresh button is gone: pull down / F5 / the browser refresh do the job */
  const killReload = () => document.querySelectorAll('#mobileFloatingBar [data-bk="reload"]').forEach(e => { e.hidden = true; e.remove(); });
  killReload(); setInterval(killReload, 500);
})();

/* which page is open -> html.th-page (header = logo only) and html.th-name (name shows only on the main page and inside Account) */
(function () {
  const on = id => { const e = document.getElementById(id); return !!(e && e.classList.contains('open')); };
  let last = '';
  setInterval(() => {
    const asm = document.getElementById('asm'), asmOpen = !!(asm && !asm.hidden), prof = document.getElementById('pp-profile'), profOpen = asmOpen && !!(prof && !prof.hidden);
    const mgr = [...document.querySelectorAll('.mgr-pop')].some(e => getComputedStyle(e).display !== 'none');
    const page = on('pop') || asmOpen || on('rqm') || on('rqn') || on('rqo') || on('thSet') || on('thCal') || on('thDays') || on('thLib') || !!document.querySelector('.ssm.open') || mgr;
    const acct = [...document.querySelectorAll('#thSet .tsl.op>.tsr .tst')].some(e => /^(Account|الحساب)$/.test(e.textContent.trim()));
    const name = !page || profOpen || on('thCal') || (on('thSet') && acct);
    const k = page + '|' + name; if (k === last) return; last = k;
    const r = document.documentElement; r.classList.toggle('th-page', page); r.classList.toggle('th-name', name);
  }, 120);
})();

/* ==========================================================
   Smart text selection + Dew Words (the ear button)      (appended at the END of dashboard.js)
   - press and hold a word inside any text (notes, TEFL / QOL / FAQ pop-ups, task descriptions): it is selected
   - two green handles: drag either one to stretch the selection (it snaps to whole words)
   - while dragging, a small loupe above the finger shows exactly what is selected, from the first word to the last
   - options appear next to the selection: Reply (opens the Messenger with the text quoted), Copy, Ear (sends it to Dew Words)
   - Ear = saved for the trainer (admin panel > Dew Words) and for the student (Library > Dew Words)
   - computers (mouse): the normal selection is kept, only the options bar appears
   ========================================================== */
(function () {
  if (window.__thSel) return; window.__thSel = 1;

  const lg = () => (typeof lang === 'string' && lang) || 'en';
  const tr = (a, b, c) => { const l = lg(); return l === 'en' ? a : (l === 'ar' ? b : c); };
  const say = m => { try { itToast(m); } catch (e) { } };
  const ROOTS = ['#mB', '.pc.nf .rich', '.itm .itd'];
  const SKIP = 'button,a,input,textarea,select,audio,video,.opx-bar,.earbar,.ear,[contenteditable="true"]';
  const rootOf = n => { const e = n && (n.nodeType === 1 ? n : n.parentElement); if (!e || !e.closest) return null; for (const s of ROOTS) { const r = e.closest(s); if (r) return r; } return null; };
  const coarse = () => matchMedia('(pointer:coarse)').matches;

  const css = document.createElement('style'); css.id = 'thSelCss';
  css.textContent = `
@media (pointer:coarse){#mB,.pc.nf .rich,.itm .itd{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}}
#mB ::selection,.pc.nf .rich ::selection,.itm .itd ::selection{background:rgba(52,211,153,.35)}
.thsel-ui{position:fixed;z-index:2147483200;-webkit-tap-highlight-color:transparent}
.thsel-bar{z-index:2147483205}
.thsel-hl{position:fixed;z-index:2147483190;pointer-events:none;background:rgba(52,211,153,.32);border-radius:3px;display:none}
.thsel-h{width:44px;height:54px;touch-action:none;cursor:grab;display:none;flex-direction:column;align-items:center}
.thsel-h i{display:block;width:2px;height:10px;background:#10b981}
.thsel-h b{display:block;width:22px;height:22px;border-radius:50%;background:#10b981;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);box-sizing:border-box}
.thsel-bar{display:none;align-items:center;gap:2px;padding:4px 6px;border-radius:14px;background:rgba(15,23,42,.97);color:#f1f5f9;border:1px solid rgba(255,255,255,.18);box-shadow:0 8px 24px rgba(0,0,0,.45);direction:ltr}
.thsel-bar button{width:44px;height:38px;border:0;background:none;color:inherit;opacity:.85;font-size:16px;cursor:pointer;border-radius:10px}
.thsel-bar button:active{opacity:1;background:rgba(255,255,255,.12)}
body.light-theme .thsel-bar{background:rgba(255,255,255,.98);color:#0f172a;border-color:rgba(15,23,42,.16)}
.thsel-loupe{position:fixed;z-index:2147483210;pointer-events:none;display:none;max-width:min(320px,88vw);box-sizing:border-box;padding:8px 12px;border-radius:14px;background:rgba(15,23,42,.98);color:#f1f5f9;border:2px solid #10b981;box-shadow:0 10px 30px rgba(0,0,0,.5);font:600 14px/1.5 Cairo,Inter,sans-serif;overflow-wrap:anywhere;text-align:start}
.thsel-loupe mark{background:none;color:#34d399;font-weight:800;text-decoration:underline}
body.light-theme .thsel-loupe{background:#fff;color:#0f172a}
.mgr-lib{display:flex;align-items:center;justify-content:center}
.ittoast{z-index:2147483600!important}`;
  document.head.appendChild(css);

  /* ---------- words of a text area, in reading order ---------- */
  const RTLRE = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
  const WORD = /[\p{L}\p{N}\p{M}]+(?:['’\-][\p{L}\p{N}\p{M}]+)*/gu;
  function indexWords(root) {
    const out = [], tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.parentElement && n.parentElement.closest(SKIP)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n;
    while ((n = tw.nextNode())) {
      const d = n.data; WORD.lastIndex = 0; let m;
      while ((m = WORD.exec(d))) out.push({ n, s: m.index, e: m.index + m[0].length, rtl: RTLRE.test(m[0]), rc: null });
    }
    return out;
  }
  const rg = w => { const r = document.createRange(); r.setStart(w.n, w.s); r.setEnd(w.n, w.e); return r; };
  const rectsOf = w => [...rg(w).getClientRects()].filter(r => r.width > 0 && r.height > 0);
  function nearest(words, x, y, maxD) {
    let best = -1, bd = Infinity;
    for (let i = 0; i < words.length; i++) {
      const rs = words[i].rc || (words[i].rc = rectsOf(words[i]));
      for (const r of rs) {
        const dx = x < r.left ? r.left - x : (x > r.right ? x - r.right : 0), dy = y < r.top ? r.top - y : (y > r.bottom ? y - r.bottom : 0);
        const d = Math.hypot(dx, dy * 2.5);
        if (d < bd) { bd = d; best = i; if (d === 0) return best; }
      }
    }
    return bd <= maxD ? best : -1;
  }

  /* ---------- state + the little pieces on screen ---------- */
  let S = null, lp = null, swallow = 0, barEl = null, h0 = null, h1 = null, loupe = null;
  const hlEls = [];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const textOf = () => {
    if (!S) return ''; if (S.native) return S.text;
    const w1 = S.words[S.a], w2 = S.words[S.b], r = document.createRange(); r.setStart(w1.n, w1.s); r.setEnd(w2.n, w2.e);
    return r.toString().replace(/\s+/g, ' ').trim();
  };

  function mkHandle() {
    const d = document.createElement('div'); d.className = 'thsel-ui thsel-h'; d.innerHTML = '<i></i><b></b>'; document.body.appendChild(d);
    d.addEventListener('pointerdown', e => {
      if (!S || S.native) return; e.preventDefault(); e.stopPropagation();
      try { d.setPointerCapture(e.pointerId); } catch (x) { }
      S.words.forEach(w => { w.rc = null; });
      const side = S.hs[0] === d ? 'start' : 'end', anchor = side === 'start' ? S.b : S.a;
      const w = S.words[side === 'start' ? S.a : S.b], rr = rectsOf(w), r = side === 'start' ? rr[0] : rr[rr.length - 1];
      S.drag = { el: d, side, anchor, y0: e.clientY, mid: r ? (r.top + r.bottom) / 2 : e.clientY };
      if (barEl) barEl.style.display = 'none';
      layout(); showLoupe(e.clientX, e.clientY);
    });
    d.addEventListener('pointermove', e => {
      if (!S || !S.drag || S.drag.el !== d) return; e.preventDefault();
      const i = nearest(S.words, e.clientX, S.drag.mid + (e.clientY - S.drag.y0), Infinity);
      if (i >= 0) { const a = S.drag.anchor; S.a = Math.min(i, a); S.b = Math.max(i, a); if (i < a) S.drag.side = 'start'; else if (i > a) S.drag.side = 'end'; layout(); }
      showLoupe(e.clientX, e.clientY);
    });
    const end = () => { if (!S || !S.drag || S.drag.el !== d) return; S.drag = null; if (loupe) loupe.style.display = 'none'; layout(); };
    d.addEventListener('pointerup', end); d.addEventListener('pointercancel', end);
    return d;
  }
  function ensureUI() {
    if (barEl) return;
    barEl = document.createElement('div'); barEl.className = 'thsel-ui thsel-bar';
    barEl.innerHTML = '<button type="button" data-k="reply"><i class="fa-solid fa-reply"></i></button><button type="button" data-k="copy"><i class="fa-regular fa-copy"></i></button><button type="button" data-k="ear"><i class="fa-solid fa-ear-listen"></i></button>';
    barEl.addEventListener('mousedown', e => e.preventDefault());   /* keeps a mouse selection alive while the bar is used */
    barEl.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (b && S) act(b.dataset.k); });
    /* touch: act on release too, so a quick tap right after dragging a handle is never lost (the click that follows finds nothing left to do) */
    let dn = null;
    barEl.addEventListener('pointerdown', e => { dn = e.target.closest && e.target.closest('button[data-k]'); });
    barEl.addEventListener('pointerup', e => { const b = e.target.closest && e.target.closest('button[data-k]'); if (e.pointerType !== 'mouse' && b && b === dn && S) act(b.dataset.k); dn = null; });
    document.body.appendChild(barEl);
    h0 = mkHandle(); h1 = mkHandle();
  }
  function clearSel() {
    S = null; lp = null;
    hlEls.forEach(d => { d.style.display = 'none'; });
    if (barEl) barEl.style.display = 'none';
    if (h0) { h0.style.display = 'none'; h1.style.display = 'none'; }
    if (loupe) loupe.style.display = 'none';
  }
  function showLoupe(x, y) {
    if (!S || !S.drag) return;
    if (!loupe) { loupe = document.createElement('div'); loupe.className = 'thsel-loupe'; document.body.appendChild(loupe); }
    const ws = textOf().split(' '), L = ws.length > 14 ? ws.slice(0, 6).concat(['…'], ws.slice(-6)) : ws, mi = S.drag.side === 'end' ? L.length - 1 : 0;
    loupe.textContent = ''; loupe.dir = 'auto';
    L.forEach((w, i) => { const el = document.createElement(i === mi ? 'mark' : 'span'); el.textContent = w + (i < L.length - 1 ? ' ' : ''); loupe.appendChild(el); });
    loupe.style.display = 'block';
    const w = loupe.offsetWidth, h = loupe.offsetHeight;
    loupe.style.left = clamp(x - w / 2, 8, innerWidth - w - 8) + 'px';
    loupe.style.top = (y - h - 70 < 8 ? y + 70 : y - h - 70) + 'px';
  }

  function lineRects() {
    const rs = []; for (let i = S.a; i <= S.b; i++) rectsOf(S.words[i]).forEach(r => rs.push(r));
    const out = [];
    rs.forEach(r => {
      const l = out[out.length - 1];
      if (l && Math.abs(l.top - r.top) < 4 && Math.abs(l.bottom - r.bottom) < 6 && (r.left - l.right < 14 || l.left - r.right < 14)) { l.left = Math.min(l.left, r.left); l.right = Math.max(l.right, r.right); l.top = Math.min(l.top, r.top); l.bottom = Math.max(l.bottom, r.bottom); }
      else out.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
    });
    return out;
  }
  function placeBar(left, right, top, bottom) {
    ensureUI(); barEl.style.display = 'flex';
    const L = { reply: tr('Reply', 'رد', 'ريبلاي'), copy: tr('Copy', 'نسخ', 'كوبي'), ear: tr('Send to Dew Words', 'إرسال إلى Dew Words', 'ابعت لـ Dew Words') };
    barEl.querySelectorAll('button').forEach(b => { b.title = L[b.dataset.k]; b.setAttribute('aria-label', L[b.dataset.k]); });
    const w = barEl.offsetWidth, cx = (left + right) / 2, below = top - 56 < 8;
    barEl.style.left = clamp(cx - w / 2, 8, innerWidth - w - 8) + 'px';
    barEl.style.top = (below ? bottom + (S && S.native ? 8 : 62) : top - 52) + 'px';
  }
  function layout() {
    if (!S) return;
    if (S.native) {
      const rc = S.range.getBoundingClientRect(); if (!rc.width && !rc.height) return clearSel();
      placeBar(rc.left, rc.right, rc.top, rc.bottom); return;
    }
    if (!S.root.isConnected || !S.words[S.a].n.isConnected || !S.words[S.b].n.isConnected) return clearSel();
    const lr = lineRects();
    if (!lr.length) { hlEls.forEach(d => { d.style.display = 'none'; }); if (barEl) barEl.style.display = 'none'; h0.style.display = h1.style.display = 'none'; return; }
    while (hlEls.length < lr.length) { const d = document.createElement('div'); d.className = 'thsel-hl'; document.body.appendChild(d); hlEls.push(d); }
    hlEls.forEach((d, i) => { const r = lr[i]; if (!r) { d.style.display = 'none'; return; } d.style.cssText = `display:block;left:${r.left - 1}px;top:${r.top}px;width:${r.right - r.left + 2}px;height:${r.bottom - r.top}px`; });
    /* which handle sits where (while dragging, the dragged one always stays on the side being moved) */
    if (S.drag) { const o = S.drag.el === h0 ? h1 : h0; S.hs = S.drag.side === 'start' ? [S.drag.el, o] : [o, S.drag.el]; }
    const fw = S.words[S.a], lw = S.words[S.b], fr = rectsOf(fw)[0], lrr = rectsOf(lw).slice(-1)[0];
    if (fr && lrr) {
      const sx = fw.rtl ? fr.right : fr.left, ex = lw.rtl ? lrr.left : lrr.right;
      const put = (el, x, y) => { el.style.display = (y < -10 || y > innerHeight) ? 'none' : 'flex'; el.style.left = (x - 22) + 'px'; el.style.top = (y - 2) + 'px'; };
      put(S.hs[0], sx, fr.bottom); put(S.hs[1], ex, lrr.bottom);
    }
    if (!S.drag) {
      ensureUI();
      placeBar(Math.min(...lr.map(r => r.left)), Math.max(...lr.map(r => r.right)), lr[0].top, lr[lr.length - 1].bottom);
    }
  }
  let raf = 0; const soon = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; try { layout(); } catch (e) { } }); };
  window.addEventListener('scroll', soon, true); window.addEventListener('resize', soon);
  setInterval(() => { if (S) soon(); }, 400);

  /* ---------- press and hold = select the word under the finger ---------- */
  function fire() {
    if (!lp) return; const { x, y, root } = lp; lp = null;
    const words = indexWords(root); if (!words.length) return;
    const i = nearest(words, x, y, 30); if (i < 0) return;
    clearSel(); ensureUI();
    S = { root, words, a: i, b: i, hs: [h0, h1], drag: null };
    swallow = Infinity; try { navigator.vibrate && navigator.vibrate(12); } catch (e) { }
    layout();
  }
  const cancelLp = () => { if (lp) { clearTimeout(lp.t); lp = null; } };
  document.addEventListener('pointerdown', e => {
    if (e.target.closest && e.target.closest('.thsel-ui')) return;
    cancelLp(); if (S) clearSel();
    if (e.pointerType === 'mouse') return;
    const root = rootOf(e.target); if (!root || (e.target.closest && e.target.closest(SKIP))) return;
    lp = { x: e.clientX, y: e.clientY, root, t: setTimeout(fire, 430) };
  }, true);
  document.addEventListener('pointermove', e => { if (lp && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) cancelLp(); }, true);
  ['pointerup', 'pointercancel'].forEach(ev => document.addEventListener(ev, () => { cancelLp(); if (swallow === Infinity) swallow = Date.now() + 500; }, true));
  document.addEventListener('scroll', cancelLp, true);
  /* the tap that ends a long press must not also open a word / play a recording underneath */
  document.addEventListener('click', e => { if (Date.now() < swallow && !(e.target.closest && e.target.closest('.thsel-ui'))) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  document.addEventListener('contextmenu', e => { if (coarse() && rootOf(e.target)) e.preventDefault(); }, true);

  /* ---------- computers: normal mouse selection, only the options bar is added ---------- */
  document.addEventListener('pointerup', e => {
    if (e.pointerType !== 'mouse') return;
    setTimeout(() => {
      const sel = window.getSelection(); if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const r = sel.getRangeAt(0), root = rootOf(r.commonAncestorContainer); if (!root) return;
      const text = sel.toString().replace(/\s+/g, ' ').trim(); if (!text) return;
      clearSel(); ensureUI(); S = { native: true, root, text, range: r.cloneRange() }; layout();
    }, 0);
  }, true);
  document.addEventListener('selectionchange', () => { if (S && S.native) { const sel = window.getSelection(); if (!sel || sel.isCollapsed) clearSel(); } });

  /* ---------- the options ---------- */
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return true; } catch (e) { }
    try { const a = document.createElement('textarea'); a.value = s; a.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok; } catch (e) { return false; }
  }
  function sourceOf(root) {
    const t = e => e ? String(e.innerText || e.textContent || '').trim() : '';
    let s = '';
    if (root.matches && root.matches('#mB')) s = t(document.getElementById('mT'));
    else { const nf = root.closest('.pc.nf'); if (nf) s = t(nf.querySelector('.nth')); else { const it = root.closest('.itm'); if (it) s = t(it.querySelector('.ith b')); } }
    return s.slice(0, 120);
  }
  async function act(k) {
    if (!S) return;
    const text = textOf(), src = sourceOf(S.root); clearSel();
    if (!text) return;
    if (k === 'reply') { if (window.thMessenger && thMessenger.open) thMessenger.open(text); }
    else if (k === 'copy') { if (await copyText(text)) say(tr('Copied ✓', 'تم النسخ ✓', 'اتنسخ ✓')); }
    else if (k === 'ear') { if (window.thDew) window.thDew.add(text, src); }
  }

  /* ---------- Dew Words: saved for the trainer (admin panel) and for the student (Library) ---------- */
  const DK = 'thabit_dew_q';
  const dq = () => { try { const a = JSON.parse(localStorage.getItem(DK) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const dqSet = a => { try { localStorage.setItem(DK, JSON.stringify(a.slice(-100))); } catch (e) { } };
  const DW = { rows: [], busy: false };
  const viewOnly = () => { try { return !!VIEW; } catch (e) { return false; } };
  async function flush() {
    if (DW.busy) return false; DW.busy = true;
    try {
      if (viewOnly() || !tok()) return false;
      for (const x of dq()) {
        const r = await rpc('trainee_dew_save', { p_token: tok(), p_text: x.text, p_source: x.source || null, p_client_id: x.id }).catch(() => null);
        if (!(r && r.ok)) return false;
        dqSet(dq().filter(y => y.id !== x.id));
        DW.rows.push({ id: r.id || x.id, client_id: x.id, text: x.text, source: x.source, created_at: r.created_at || x.at });
      }
      return true;
    } finally { DW.busy = false; }
  }
  window.thDew = {
    add: async (text, source) => {
      text = String(text || '').trim().slice(0, 1000); if (!text) return;
      if (viewOnly()) { say(tr('Preview mode: nothing was sent', 'وضع المعاينة: لم يُرسل شيء', 'وضع المعاينة: مفيش حاجة اتبعتت')); return; }
      dqSet(dq().concat([{ id: 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), text, source: String(source || '').slice(0, 120), at: new Date().toISOString() }]));
      const ok = await flush();
      say(ok ? tr('Sent to Dew Words ✓', 'تم الإرسال إلى Dew Words ✓', 'اتبعتت لـ Dew Words ✓')
        : tr('Saved here, it will be sent when the connection is back', 'تم الحفظ هنا وسيُرسل عند عودة الاتصال', 'اتحفظت هنا وهتتبعت أول ما الاتصال يرجع'));
    },
    rows: () => { const have = new Set(DW.rows.map(r => r.client_id).filter(Boolean)); return DW.rows.concat(dq().filter(x => !have.has(x.id)).map(x => ({ client_id: x.id, text: x.text, source: x.source, created_at: x.at, pending: true }))); },
    refresh: async () => {
      if (viewOnly() || !tok()) return; await flush();
      const r = await rpc('trainee_dew_list', { p_token: tok() }).catch(() => null);
      if (r && r.ok && Array.isArray(r.rows)) DW.rows = r.rows.map(x => ({ id: x.id, client_id: x.client_id, text: x.text, source: x.source, created_at: x.created_at }));
    },
    flush
  };
  setTimeout(flush, 4000); setInterval(flush, 60000); window.addEventListener('online', flush);

  /* ---------- phone: the Library button on the top bar (three upright bars), only while the Messenger is the open page ---------- */
  const LIBSVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/></svg>';
  setInterval(() => {
    const bar = document.getElementById('thFpBar'); if (!bar) return;
    let b = bar.querySelector('[data-lib]');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.dataset.lib = '1'; b.innerHTML = LIBSVG; b.style.display = 'none';
      b.onclick = () => { if (window.openLibrary) window.openLibrary(); };
      const back = bar.querySelector('[data-b]'); if (back) back.insertAdjacentElement('afterend', b); else bar.appendChild(b);
    }
    const L = tr('Library', 'المكتبة', 'المكتبة'); if (b.title !== L) { b.title = L; b.setAttribute('aria-label', L); }
    const show = !!(window.thMessenger && thMessenger.visible && thMessenger.visible()) && document.body.classList.contains('thfp-open');
    const want = show ? 'flex' : 'none'; if (b.style.display !== want) b.style.display = want;
  }, 300);
})();


/* ==========================================================
   DAYS button (next to Notifications / Messenger / Settings) + Days page
   - button: small calendar icon with TODAY's number inside, label "Days", red number badge like Notifications
   - page: the "Next session" card (moved here from Notifications, same card, always pinned) + Calendar
   - opens like the other pages: full page on phones, centred box on computers
   Appended at the END of dashboard.js. Delete this block to remove it.
   ========================================================== */
(function () {
  if (window.__thDays) return; window.__thDays = 1;
  const tr = (a, b, c) => { const l = (typeof lang === 'string' && lang) || 'en'; return l === 'en' ? a : (l === 'ar' ? b : c); };
  const G = id => document.getElementById(id);
  const SEEN = 'thabit_days_seen';
  const todayStr = () => { try { return itToday(); } catch (e) { return new Date().toISOString().slice(0, 10); } };
  const dayNum = () => String(parseInt(todayStr().slice(8, 10), 10));

  const css = document.createElement('style'); css.id = 'thDaysCss';
  css.textContent = `
#daysBtn{background:transparent!important;border:0!important;box-shadow:none!important;cursor:pointer;-webkit-tap-highlight-color:transparent;color:#fbbf24}
html body #mobileFloatingBar #daysBtn>svg.dys{width:28px!important;height:28px!important;display:block;flex:none;overflow:visible}
#daysBtn .dys .fr{fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
#daysBtn .dys .rg{stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
#daysBtn .dys text{fill:currentColor;font:800 11px/1 Inter,Cairo,sans-serif;text-anchor:middle}
body.light-theme #daysBtn{color:#d97706}
#daysNum{display:none;position:absolute!important;top:9px;left:calc(50% + 12px);z-index:5;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:999px;background:#ef4444;color:#fff;-webkit-text-fill-color:#fff;font:800 9px/16px Inter,Cairo,sans-serif;text-align:center;box-shadow:0 0 0 2px #181c20,0 2px 6px rgba(239,68,68,.55);pointer-events:none}
#daysNum.on{display:block}
#daysNum.l2{font-size:8px}
#daysNum.bump{animation:mgrBump .4s cubic-bezier(.3,1.7,.5,1)}
body.light-theme #daysNum{box-shadow:0 0 0 2px #f4f6f9,0 2px 6px rgba(239,68,68,.55)}
html.th-page #daysBtn{visibility:hidden!important}

#thDays{position:fixed;inset:0;z-index:10040;display:none;justify-content:center;align-items:flex-start;padding:max(14px,env(safe-area-inset-top)) 14px calc(90px + env(safe-area-inset-bottom));background:rgba(2,6,23,.5);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);overflow:auto;box-sizing:border-box}
#thDays.open{display:flex}
#thDays .tsc{position:relative;width:min(440px,100%);margin:auto 0;padding:12px;border-radius:22px;background:rgba(15,23,42,.97);color:#f1f5f9;border:1px solid rgba(255,255,255,.14);box-shadow:0 18px 50px rgba(0,0,0,.55);box-sizing:border-box;font-family:Cairo,Inter,sans-serif}
body.light-theme #thDays .tsc{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.14)}
#thDays .tsh{display:flex;direction:ltr;align-items:center;gap:10px;padding:4px 6px 12px}
#thDays .tsh .tsi{width:30px;text-align:center;font-size:20px;flex:none;color:#fbbf24}
#thDays .tsh b{flex:1;text-align:center;font-size:1.02rem;font-weight:800}
#thDays .tsx{width:30px;height:30px;flex:none;border:0;border-radius:50%;background:rgba(148,163,184,.18);color:inherit;cursor:pointer;font-size:14px}
#thDays .dcard{margin-bottom:10px;padding:14px;border-radius:16px;background:rgba(148,163,184,.12);border:1px solid rgba(148,163,184,.24);box-shadow:0 3px 0 rgba(0,0,0,.22),0 6px 14px rgba(0,0,0,.18)}
body.light-theme #thDays .dcard{background:#f1f5f9;border-color:rgba(15,23,42,.12);box-shadow:0 2px 0 rgba(15,23,42,.1),0 5px 12px rgba(15,23,42,.08)}
#thDays .dcard .nxrow{display:flex;align-items:center;gap:16px;direction:ltr}
#thDays .dcard .nxc{flex:none;display:flex;align-items:center;justify-content:center}
#thDays .dcard .nxtx{flex:1;min-width:0}
#thDays .dcard .nxtx h3{margin:0 0 4px;font-size:1rem}
#thDays .dcard .sm{font-size:.78rem;opacity:.7;margin-top:4px}
#thDays .dcard .cdn{font-weight:800;font-size:1.25rem;letter-spacing:.02em}
#thDays .dcard.none{text-align:center;opacity:.75;font-weight:700;font-size:.9rem}
#thDays .drow{display:flex;direction:ltr;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;cursor:pointer;background:rgba(148,163,184,.12);border:1px solid rgba(148,163,184,.24);box-shadow:0 3px 0 rgba(0,0,0,.22),0 6px 14px rgba(0,0,0,.18);-webkit-tap-highlight-color:transparent;user-select:none}
body.light-theme #thDays .drow{background:#f1f5f9;border-color:rgba(15,23,42,.12);box-shadow:0 2px 0 rgba(15,23,42,.1),0 5px 12px rgba(15,23,42,.08)}
#thDays .drow .tsi{width:26px;text-align:center;font-size:18px;flex:none}
#thDays .drow .tst{flex:1;text-align:center;font-weight:700;font-size:.9rem}
#thDays .drow .tsv{width:26px;text-align:center;font-size:12px;opacity:.6;flex:none}
html.th-page #thDays .tsh{display:none}
@media (max-width:820px) and (pointer:coarse){
#thDays.open{position:fixed!important;inset:0!important;width:100%!important;max-width:none!important;height:100%!important;margin:0!important;border-radius:0!important;padding:calc(60px + env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom))!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:#000!important;display:flex}
body.light-theme #thDays.open{background:#f4f6f9!important}
#thDays .tsh{display:none!important}
#thDays .tsc{width:min(480px,100%);background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0 auto auto}
}`;
  document.head.appendChild(css);

  /* ---------- the button ---------- */
  const SVG = () => `<svg class="dys" viewBox="0 0 28 28" aria-hidden="true"><rect class="fr" x="3.5" y="5.5" width="21" height="19" rx="4.5"/><path class="rg" d="M9.5 3v5M18.5 3v5"/><path class="fr" d="M3.5 11h21"/><text x="14" y="21.2" id="dysTxt">${dayNum()}</text></svg>`;
  const LBL = () => tr('Time', 'الوقت', 'تايم');
  function install() {
    if (G('daysBtn')) return true;
    const bar = G('mobileFloatingBar'), anchor = G('mgrBtn') || G('feedBtn');
    if (!bar || !anchor) return false;
    const b = document.createElement('button'); b.type = 'button'; b.id = 'daysBtn'; b.dataset.bk = 'days';
    b.className = (G('feedBtn').className || '').replace(/\b(upd|glow|live|empty|num|open|done)\b/g, '').trim();
    b.title = LBL(); b.setAttribute('aria-label', LBL());
    b.innerHTML = SVG() + '<span class="thl"></span><span id="daysNum"></span>';
    b.querySelector('.thl').textContent = LBL();
    b.onclick = e => { e.stopPropagation(); toggle(); };
    anchor.insertAdjacentElement('afterend', b);
    try { if (typeof layoutBar === 'function') layoutBar(); } catch (e) { }
    return true;
  }
  { let n = 0; const iv = setInterval(() => { if (install() || ++n > 120) clearInterval(iv); }, 500); }

  /* today's number + label follow the Cairo date and the language */
  setInterval(() => {
    const t = G('dysTxt'); if (t && t.textContent !== dayNum()) t.textContent = dayNum();
    const l = document.querySelector('#daysBtn .thl'); if (l && l.textContent !== LBL()) { l.textContent = LBL(); const b = G('daysBtn'); b.title = LBL(); b.setAttribute('aria-label', LBL()); }
  }, 2000);

  /* ---------- the badge: a number on the button when there is something new ----------
     Right now: a session day that has not been looked at yet = 1.  Change thDays.count() to add more kinds of updates. */
  function count() {
    try {
      if (typeof VIEW !== 'undefined' && VIEW) return 0;
      if (typeof D === 'undefined' || !D) return 0;
      const s = nxState(); if (!s) return 0;
      let n = 0;
      if ((s.st === 'count' || s.st === 'started') && localStorage.getItem(SEEN) !== todayStr()) n++;
      return n;
    } catch (e) { return 0; }
  }
  function badge() {
    const el = G('daysNum'); if (!el) return;
    const n = count(), txt = n > 99 ? '99+' : String(n || '');
    if (!n) { el.classList.remove('on'); el.textContent = ''; return; }
    if (el.textContent !== txt) { el.textContent = txt; el.classList.toggle('l2', txt.length > 1); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    el.classList.add('on');
  }
  setInterval(badge, 3000); setTimeout(badge, 1500);

  /* ---------- the page ---------- */
  let root = null;
  function ensure() {
    if (root) return;
    root = document.createElement('div'); root.id = 'thDays'; document.body.appendChild(root);
    root.addEventListener('pointerdown', e => { if (e.target === root) close(); });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !root.classList.contains('open')) return;
      if (document.querySelector('#thCal.open')) return;
      e.stopImmediatePropagation(); close();
    }, true);
  }
  function card() {
    let h = '';
    try { const s = (typeof D !== 'undefined' && D) ? nxState() : null; if (s) h = nextCard(s).html; } catch (e) { console.warn('[days] next session', e); }
    return h ? `<div class="dcard pc nxt">${h}</div>` : `<div class="dcard none">${esc(tr('No upcoming session yet', 'لا توجد جلسة قادمة بعد', 'مفيش سيشن جاية لسه'))}</div>`;
  }
  function draw() {
    if (!root || !root.classList.contains('open')) return;
    const cal = tr('Calendar', 'التقويم', 'التقويم');
    root.innerHTML = `<div class="tsc"><div class="tsh"><span class="tsi"><i class="fa-regular fa-calendar-days"></i></span><b>${esc(LBL())}</b><button type="button" class="tsx" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div>`
      + `<div id="dysCard">${card()}</div>`
      + `<div class="drow" role="button" tabindex="0" id="dysCal"><span class="tsi"><i class="fa-regular fa-calendar"></i></span><span class="tst">${esc(cal)}</span><span class="tsv"><i class="fa-solid fa-chevron-right"></i></span></div></div>`;
    root.querySelector('.tsx').onclick = close;
    const c = G('dysCal'); c.onclick = () => { if (window.openCal) window.openCal(); };
    c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } };
  }
  function open() {
    ensure();
    try { if (!(typeof VIEW !== 'undefined' && VIEW)) localStorage.setItem(SEEN, todayStr()); } catch (e) { }
    root.classList.add('open'); draw(); badge();
  }
  function close() { if (!root) return; root.classList.remove('open'); root.innerHTML = ''; }
  function toggle() { if (root && root.classList.contains('open')) close(); else open(); }

  window.thDays = { open, close, toggle, count };
})();


/* ==========================================================
   Pull-down refresh (phones): at the very top, pull down from anywhere. A round button comes down WITH the finger and a
   smooth spiral (a circle winding inside a circle) draws itself from the centre outwards the closer you get to the
   trigger line (about a quarter of the screen). Let go past the line = refresh. Let go early, or move back up = the
   spiral un-draws and the button goes back up, nothing refreshes. Appended at the END of dashboard.js.
   ========================================================== */
(function () {
  if (window.__thPull) return; window.__thPull = 1;
  const TRIG = () => Math.max(140, Math.round(innerHeight * 0.27)), EDGE = 2, SZ = 46;
  const st = document.createElement('style'); st.id = 'thPullCss';
  st.textContent = `
html,body{overscroll-behavior-y:none}
#thPull{position:fixed;left:50%;top:0;z-index:2147483002;width:${SZ}px;height:${SZ}px;margin-left:-${SZ / 2}px;border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transform:translate3d(0,-${SZ + 10}px,0);will-change:transform,opacity;background:#1e293b;color:#f8fafc;box-shadow:0 6px 18px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.1)}
body.light-theme #thPull{background:#fff;color:#0f172a;box-shadow:0 6px 18px rgba(15,23,42,.22),0 0 0 1px rgba(15,23,42,.08)}
#thPull.back{transition:transform .3s cubic-bezier(.3,1.1,.5,1),opacity .25s}
#thPull svg{width:34px;height:34px;display:block;overflow:visible}
#thPull .sp{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 1;stroke-dashoffset:1}
#thPull.spin svg{animation:thPullSpin .9s linear infinite}
@keyframes thPullSpin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){#thPull.spin svg{animation:none}}`;
  document.head.appendChild(st);
  /* spiral path: starts as a dot in the centre and winds outwards ~2.3 turns */
  let d = '', TURNS = 2.3, N = 140;
  for (let i = 0; i <= N; i++) { const k = i / N, a = k * TURNS * 2 * Math.PI - Math.PI / 2, r = 1 + 14 * k; d += (i ? 'L' : 'M') + (17 + r * Math.cos(a)).toFixed(2) + ' ' + (17 + r * Math.sin(a)).toFixed(2); }
  const el = document.createElement('div'); el.id = 'thPull';
  el.innerHTML = '<svg viewBox="0 0 34 34" aria-hidden="true"><path class="sp" pathLength="1" d="' + d + '"/></svg>';
  document.body.appendChild(el);
  const SP = el.querySelector('.sp'), SVG = el.querySelector('svg');
  const draw = p => { SP.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, p))); };
  draw(0);

  const PH = () => matchMedia('(pointer:coarse)').matches || navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  const atTop = () => Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0) <= EDGE;
  const vis = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const pageOpen = () => document.body.classList.contains('thfp-open') || document.documentElement.classList.contains('th-page')
    || [...document.querySelectorAll('#pop.open,#asm:not([hidden]),#rqm.open,#rqn.open,#rqo.open,#thSet.open,#thCal.open,#thDays.open,#thLib.open,.ssm.open,#wp,.mgr-pop')].some(vis);
  function innerScroll(t) {
    for (let e = t; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.scrollTop > 2) return true;
    }
    return false;
  }
  let g = null, busy = false, crossed = false;
  const top = dist => Math.min(dist, TRIG()) - SZ - 10;   /* same distance as the finger, stops at the line */
  function paint() {
    const p = Math.min(1, g.d / TRIG());
    el.style.opacity = String(Math.min(1, g.d / 20));
    el.style.transform = `translate3d(0,${top(g.d)}px,0) scale(${0.7 + 0.3 * Math.min(1, p * 2)})`;
    draw(p);                                                   /* 0 at the start, complete at the line, un-draws when you go back */
    SVG.style.transform = `rotate(${Math.round(Math.min(1, p) * 160)}deg)`;
  }
  function reset() { el.classList.add('back'); el.classList.remove('spin'); el.style.opacity = '0'; el.style.transform = `translate3d(0,-${SZ + 10}px,0)`; draw(0); SVG.style.transform = ''; setTimeout(() => el.classList.remove('back'), 330); }
  async function refresh() {
    busy = true; el.classList.add('back'); draw(1); SVG.style.transform = ''; el.style.opacity = '1';
    el.style.transform = `translate3d(0,${top(TRIG()) }px,0) scale(1)`; el.classList.add('spin');
    const t0 = Date.now();
    try { if (window.thSkel) window.thSkel(true); await load(); } catch (e) { console.warn('[pull refresh]', e); }
    setTimeout(() => { busy = false; reset(); }, Math.max(0, 700 - (Date.now() - t0)));
  }
  document.addEventListener('touchstart', e => {
    g = null;
    if (window.__thPP || busy || !PH() || e.touches.length !== 1 || pageOpen()) return;
    if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"],#mobileFloatingBar,.thsel-ui')) return;
    if (!atTop() || innerScroll(e.target)) return;
    const t = e.touches[0]; g = { y: t.clientY, x: t.clientX, d: 0, on: false }; crossed = false; el.classList.remove('back');
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!g) return;
    const t = e.touches[0], dy = t.clientY - g.y;
    if (!g.on) {
      if (dy < 4 || Math.abs(t.clientX - g.x) > Math.abs(dy)) { if (dy < -6) g = null; return; }
      if (!atTop()) { g = null; return; }
      g.on = true;
    }
    g.d = Math.max(0, dy);                                     /* 1:1 with the finger, no extra pull needed */
    if (e.cancelable) e.preventDefault();
    paint();
    if (g.d >= TRIG()) { try { navigator.vibrate && navigator.vibrate(10); } catch (x) { } g = null; refresh(); }   /* circle complete = refresh, right away */
  }, { passive: false });
  const end = () => { if (!g) return; const go = g.on && g.d >= TRIG(), on = g.on; g = null; if (go) refresh(); else if (on) reset(); };
  document.addEventListener('touchend', end, { passive: true });
  document.addEventListener('touchcancel', () => { if (g && g.on) reset(); g = null; }, { passive: true });
})();


/* ==========================================================
   Pages (phones): the top bar holds ONLY the logo.
   - the back arrow is gone from the top; every page except the Messenger gets a small back button at the bottom
   - the Messenger has no back button at all (phone back gesture still steps back); its Library button is now a
     borderless full-width cell right under the logo, Library icon at the left start
   Appended at the END of dashboard.js. Delete this block to go back.
   ========================================================== */
(function () {
  if (window.__thBot) return; window.__thBot = 1;
  const tr = (a, b, c) => { const l = (typeof lang === 'string' && lang) || 'en'; return l === 'en' ? a : (l === 'ar' ? b : c); };
  const PH = () => matchMedia('(max-width:820px) and (pointer:coarse)').matches;
  const css = document.createElement('style'); css.id = 'thBotCss';
  css.textContent = `
#thFpBar [data-b],#thFpBar [data-lib]{display:none!important}
#thBackB,#thLibCell{display:none}
@media (max-width:820px) and (pointer:coarse){
#thBackB{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));margin-left:-24px;z-index:2147483003;width:48px;height:48px;border:0;border-radius:50%;background:rgba(30,41,59,.92);color:#f1f5f9;font-size:18px;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.4);-webkit-tap-highlight-color:transparent;cursor:pointer}
body.light-theme #thBackB{background:rgba(255,255,255,.95);color:#0f172a;box-shadow:0 6px 18px rgba(15,23,42,.2)}
#thBackB:active{transform:scale(.92)}
body.thb-back #thBackB{display:flex}
#thLibCell{position:fixed;left:0;right:0;top:calc(52px + env(safe-area-inset-top));height:46px;z-index:2147483003;box-sizing:border-box;padding:0 14px;align-items:center;justify-content:flex-start;gap:10px;direction:ltr;border:0;background:transparent;color:inherit;font:800 .9rem Cairo,Inter,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
body.light-theme #thLibCell{color:#0f172a}
#thLibCell svg{width:22px;height:22px;flex:none}
body.thb-lib #thLibCell{display:flex}
body.thb-lib .mgr-pop{padding-top:calc(100px + env(safe-area-inset-top))!important}
}`;
  document.head.appendChild(css);
  const back = document.createElement('button'); back.type = 'button'; back.id = 'thBackB'; back.setAttribute('aria-label', 'Back'); back.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  back.onclick = () => { const b = document.querySelector('#thFpBar [data-b]'); if (b) b.click(); };
  const lib = document.createElement('button'); lib.type = 'button'; lib.id = 'thLibCell';
  lib.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/></svg><span></span>';
  lib.onclick = () => { if (window.openLibrary) window.openLibrary(); };
  document.body.appendChild(back); document.body.appendChild(lib);
  setInterval(() => {
    const b = document.body, ph = PH() && b.classList.contains('thfp-open');
    const mgr = !!(window.thMessenger && thMessenger.visible && thMessenger.visible());
    const libOpen = !!document.querySelector('#thLib.open');
    b.classList.toggle('thb-back', ph && !mgr);
    b.classList.toggle('thb-lib', ph && mgr && !libOpen);
    const sp = lib.querySelector('span'), t = tr('Library', 'المكتبة', 'المكتبة'); if (sp.textContent !== t) sp.textContent = t;
  }, 200);
})();


/* Messenger composer look: a growing text box, borderless newline button, Draft label in the list */
(function () {
  const c = document.createElement('style'); c.id = 'thMgrCss';
  c.textContent = `.mgr-comp{align-items:flex-end!important}
.mgr-in{min-height:40px;max-height:40vh;padding:10px 14px!important;line-height:20px;resize:none;overflow-y:auto;box-sizing:border-box;border-radius:20px!important;display:block}
.mgr-ic{flex:none}
.mgr-nl{touch-action:manipulation;user-select:none;-webkit-user-select:none}
.mgr-dr{font-style:normal;color:#25d366;font-weight:700}`;
  document.head.appendChild(c);
})();


/* Messenger message actions look */
(function () {
  const c = document.createElement('style'); c.id = 'thMgrAct';
  c.textContent = `.mgr-b{position:relative;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:pan-y;cursor:pointer;transition:transform .2s}
.mgr-b.hasrx{margin-bottom:14px}
.mgr-rx{position:absolute;bottom:-13px;inset-inline-end:10px;padding:1px 6px;border-radius:12px;background:#202c33;border:1px solid #0b141a;font-size:13px;line-height:18px}
.mgr-b.del{cursor:default}
.mgr-b.del .mgr-t{font-style:italic;opacity:.65;font-size:13px}
.mgr-ov{position:absolute;inset:0;z-index:7;background:rgba(0,0,0,.4)}
.mgr-eri{display:flex;align-items:center;gap:2px;padding:4px 8px;margin:2px 6px 8px;border-radius:24px;background:#202c33;box-shadow:0 4px 14px rgba(0,0,0,.45);animation:mgrEri .16s ease-out}
@keyframes mgrEri{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.mgr-eri button{width:36px;height:36px;border:0;border-radius:50%;background:transparent;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}
.mgr-eri button:active{transform:scale(1.25)}
.mgr-eri button.on{background:rgba(255,255,255,.16)}
.mgr-eri button.pl{background:#2a3942;color:#aebac1;font-size:14px;margin-inline-start:4px}
.mgr-b.sel{box-shadow:0 0 0 2px rgba(31,182,255,.85)}
.mgr-tb{position:absolute;left:0;right:0;top:0;height:52px;z-index:8;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#202c33;direction:ltr}
.mgr-tb>div{display:flex;gap:6px}
.mgr-tb button{width:42px;height:42px;border:0;border-radius:50%;background:transparent;color:#e9edef;font-size:18px;cursor:pointer}
.mgr-tb button.rd{color:#f87171}
.mgr-sc{display:flex;flex-direction:column;gap:6px;align-self:flex-end;flex:none}
@media (max-width:820px) and (pointer:coarse){.mgr-tb{top:calc(52px + env(safe-area-inset-top));height:46px}}
body.thb-act #thLibCell{display:none!important}
.mgr-eb{position:absolute;display:flex;align-items:center;gap:2px;padding:5px 8px;border-radius:26px;background:#202c33;box-shadow:0 8px 24px rgba(0,0,0,.5)}
.mgr-eb button{width:38px;height:38px;border:0;border-radius:50%;background:transparent;font-size:23px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}
.mgr-eb button:active{transform:scale(1.25)}
.mgr-eb button.on{background:rgba(255,255,255,.16)}
.mgr-eb button.pl{background:#2a3942;color:#aebac1;font-size:15px;margin-inline-start:4px}
.mgr-am{position:absolute;min-width:180px;border-radius:14px;background:#202c33;box-shadow:0 8px 24px rgba(0,0,0,.5);overflow:hidden}
.mgr-am button{display:flex;align-items:center;gap:12px;width:100%;padding:13px 16px;border:0;background:transparent;color:#e9edef;font:600 14px Cairo,Inter,sans-serif;cursor:pointer;text-align:start}
.mgr-am button+button{border-top:1px solid rgba(255,255,255,.07)}
.mgr-am button i{width:18px;text-align:center;color:#8696a0}
.mgr-am button:last-child{color:#f87171}.mgr-am button:last-child i{color:#f87171}
.mgr-ds{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(300px,86%);padding:14px;border-radius:18px;background:#202c33;display:flex;flex-direction:column;gap:8px;box-shadow:0 12px 34px rgba(0,0,0,.55)}
.mgr-dt{text-align:center;font-weight:800;font-size:14px;color:#e9edef;padding:2px 0 6px}
.mgr-ds button{padding:12px;border:0;border-radius:12px;background:#2a3942;color:#e9edef;font:700 13.5px Cairo,Inter,sans-serif;cursor:pointer}
.mgr-ds button.d{background:rgba(248,113,113,.16);color:#f87171}
.mgr-pk{position:absolute;left:10px;right:10px;bottom:10px;max-height:52%;overflow:auto;padding:8px;border-radius:18px;background:#202c33;display:grid;grid-template-columns:repeat(8,1fr);gap:2px;box-shadow:0 8px 24px rgba(0,0,0,.5)}
.mgr-pk button{aspect-ratio:1;border:0;background:transparent;font-size:22px;cursor:pointer;border-radius:10px}
.mgr-pk button:active{background:rgba(255,255,255,.12)}`;
  document.head.appendChild(c);
})();

/* ==========================================================
   SPACE: the trainee's own board (button on the bar). Opens as a full page, saves by itself.
   board.html?student=1 runs in a frame; it talks to Supabase through trainee_space_* functions using the trainee token.
   ========================================================== */
(function () {
  if (window.thSpace) return;
  const bar = document.getElementById('mobileFloatingBar'); if (!bar) return;
  const G = id => document.getElementById(id);
  const css = document.createElement('style'); css.id = 'thSpaceCss';
  css.textContent = `
#thSpace{position:fixed;inset:0;z-index:10030;display:none;background:#fff}
body:not(.light-theme) #thSpace{background:#17171b}
#thSpace.open{display:block}
#thSpace iframe{width:100%;height:100%;border:0;display:block;background:transparent}
#thSpace .tsx{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:2;width:36px;height:36px;border:0;border-radius:50%;background:rgba(15,23,42,.88);color:#fff;font-size:20px;line-height:1;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35)}
@media (max-width:820px) and (pointer:coarse){#thSpace{padding-top:calc(52px + env(safe-area-inset-top))}#thSpace .tsx{display:none}}`;
  document.head.appendChild(css);

  const box = document.createElement('div'); box.id = 'thSpace';
  box.innerHTML = '<button type="button" class="tsx" aria-label="Close">&times;</button>';
  document.body.appendChild(box);
  let fr = null;
  function open() {
    if (!fr) {
      fr = document.createElement('iframe'); fr.title = 'Space'; fr.setAttribute('allow', 'clipboard-read; clipboard-write; display-capture; fullscreen');
      fr.src = 'board.html?student=1' + (VIEW ? '&mode=view#vt=' + VT : '');
      box.appendChild(fr);
    }
    box.classList.add('open');
    if (window.thFpSync) thFpSync();
    probe();
  }
  /* If Space cannot load, say exactly why on screen (missing file, or the server function is missing / rejected the token) */
  let probed = false;
  async function probe() {
    if (probed) return; probed = true;
    const bad = [];
    for (const u of ['board.html', 'Css/board.css', 'css/board.css', 'js/board.js']) {
      try {
        const r = await fetch(u, { cache: 'no-store' }), t = r.ok ? await r.text() : '', ty = r.headers.get('content-type') || '';
        const asset = /\.(css|js)$/.test(u), isCss = /\.css$/.test(u);
        if (!r.ok) { if (u !== 'css/board.css') bad.push(u + '  ->  HTTP ' + r.status); }   /* css/board.css is only a second guess for the folder case */
        else if (asset && (/^\s*</.test(t) || t.length < (isCss ? 300 : 3000))) bad.push(u + '  ->  not a real ' + (isCss ? 'CSS' : 'JS') + ' file (' + t.length + ' bytes, ' + ty + ')');
        else if (u === 'css/board.css') bad.push('css/board.css exists but board.html asks for Css/board.css (capital C): the page loads without styles');
      } catch (e) { bad.push(u + '  ->  ' + e.message); }
    }
    try {
      const t = tok();
      if (!t) bad.push('no trainee token on this device (log in again)');
      else { const r = await rpc('trainee_space_list', { p_token: t }); if (r && !Array.isArray(r) && (r.message || r.code)) bad.push('trainee_space_list  ->  ' + (r.message || r.code) + (r.hint ? ' (' + r.hint + ')' : '')); }
    } catch (e) { bad.push('trainee_space_list  ->  ' + e.message); }
    if (!bad.length) return;
    console.warn('[space] problems:', bad);
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:12px;right:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:5;padding:12px 14px;border-radius:14px;background:rgba(127,29,29,.92);color:#fff;font:600 12px/1.5 Inter,Cairo,sans-serif;direction:ltr;text-align:left;white-space:pre-wrap;word-break:break-word';
    d.textContent = 'Space problem:\n' + bad.join('\n') + '\n(tap to close)';
    d.onclick = () => d.remove();
    box.appendChild(d);
  }
  function close() {
    try { fr && fr.contentWindow.ThabitBoard && fr.contentWindow.ThabitBoard.flush(); } catch (e) { }   /* saves by itself, nothing to ask */
    box.classList.remove('open');
    if (window.thFpSync) thFpSync();
  }
  box.querySelector('.tsx').onclick = close;
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  window.thSpace = { open, close };

  const b = document.createElement('button');
  b.type = 'button'; b.id = 'spaceBtn'; b.dataset.bk = 'space'; b.className = 'circle-badge-btn'; b.title = 'Space'; b.setAttribute('aria-label', 'Space');
  b.style.color = '#38bdf8'; b.innerHTML = '<svg class="spco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20v-3.8L16.2 4a1.9 1.9 0 0 1 2.7 0l1.1 1.1a1.9 1.9 0 0 1 0 2.7L7.8 20z"/><path d="M13.6 6.7l3.7 3.7"/></svg>';
  b.onclick = open;
  bar.appendChild(b);
  try { layoutBar(); } catch (e) { }
})();


/* ==========================================================
   v3 (end of dashboard.js): thinner Space + Feed, More = hollow plus, no dots on bars, coal-black page,
   glass cards, bar icons movable (incl. More). Delete this block to go back.
   ========================================================== */
(function () {
  const st = document.createElement('style'); st.id = 'thV3';
  st.textContent = `
/* thin line icons, same visual size */
html body #mobileFloatingBar #feedBtn .fstar{width:25px!important;height:25px!important}
html body #mobileFloatingBar #feedBtn .fstar path{stroke-width:1!important}
html body #mobileFloatingBar #spaceBtn svg.spco{width:25px!important;height:25px!important;display:block;flex:none}
html body #mobileFloatingBar #barEdit svg.plusout{width:25px!important;height:25px!important;display:block;flex:none}
html body #mobileFloatingBar #barEdit svg.plusout path{fill:none!important;stroke:currentColor;stroke-width:1.1;stroke-linejoin:round}
html body #mobileFloatingBar #spaceBtn svg.spco *{stroke-width:1.1!important}
html body #mobileFloatingBar #daysBtn>svg.dys{width:25px!important;height:25px!important}
html body #mobileFloatingBar #daysBtn .dys .fr{stroke-width:1.1!important}
html body #mobileFloatingBar #daysBtn .dys .rg{stroke-width:1.2!important}
html body #mobileFloatingBar #daysBtn .dys text{font-weight:600!important;font-size:10px!important}

/* first floor (Tasks / Applications): starts right under the header, no empty gap above the first card */
@media(max-width:700px){
html body .thsec.th-first:not(#z){justify-content:flex-start!important;padding-top:calc(56px + env(safe-area-inset-top,0px))!important}
html body .thsec.th-first>.top{margin-top:0!important}}
html,body{overscroll-behavior-y:none!important}
html body #thBrand:not(#z),html body .thHdr:not(#z){background:#181c20!important;background-image:none!important;border:0!important;border-bottom:1px solid rgba(255,255,255,.07)!important;box-shadow:none!important}
html body.light-theme #thBrand:not(#z),html body.light-theme .thHdr:not(#z){background:#f4f6f9!important;border-bottom-color:rgba(15,23,42,.12)!important}
html body #thBrand .thb-n:not(#z){display:none!important}

/* bars: plain solid grey, no dots */
html body #mobileFloatingBar:not(#z),html body .thHdr:not(#z),html body #thBrand:not(#z),
html body.light-theme #mobileFloatingBar:not(#z),html body.light-theme .thHdr:not(#z),html body.light-theme #thBrand:not(#z),html body.light-theme~#thBrand:not(#z){background-image:none!important}

/* coal-black page (dark theme) */
html:has(body:not(.light-theme)),html body:not(.light-theme){background-color:#050506!important;background-image:none!important}

/* glass cards: soft blur + a thin bright edge */
html body :is(.thabit-card,.test-card,.dcard){-webkit-backdrop-filter:blur(24px) saturate(1.3)!important;backdrop-filter:blur(24px) saturate(1.3)!important}
html body:not(.light-theme) :is(.thabit-card,.test-card,.dcard){background:rgba(255,255,255,.045)!important;border:1px solid rgba(255,255,255,.09)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.11),0 10px 30px rgba(0,0,0,.45)!important}
html body.light-theme :is(.thabit-card,.test-card,.dcard){box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 8px 26px rgba(15,23,42,.1)!important}
/* the one light pass (class lit1 is added by the section watcher, once per visit) */
/* no light at all except ONE slow pass, left -> right, 1.5s, then gone */
html body .thabit-card:not(.lit1)::before,html body .test-card:not(.lit1)::before{animation:none!important;opacity:0!important;display:none!important}
html body .thabit-card.lit1::before,html body .test-card.lit1::before{content:""!important;display:block!important;position:absolute!important;inset:0!important;width:auto!important;height:auto!important;transform:none!important;border-radius:inherit!important;pointer-events:none!important;opacity:1!important;
  background:linear-gradient(105deg,transparent 0%,transparent 38%,rgba(255,255,255,.17) 50%,transparent 62%,transparent 100%) 100% 0/300% 100% no-repeat!important;
  animation:thShine 1.5s ease-in-out 1 forwards!important}
@keyframes thShine{from{background-position:100% 0}to{background-position:0% 0}}
html body.light-theme .thabit-card.lit1::before,html body.light-theme .test-card.lit1::before{background-image:linear-gradient(105deg,transparent 0%,transparent 38%,rgba(255,255,255,.75) 50%,transparent 62%,transparent 100%)!important}

/* long-press move: the icon follows the finger, nothing slows it or pins it */
html body #mobileFloatingBar>[data-bk]{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html body #mobileFloatingBar .lifting:not(#a):not(#b):not(#c){transform:var(--lift,none)!important;transition:none!important;z-index:9;opacity:.95}`;
  document.head.appendChild(st);

  /* More: hollow plus outline instead of the gear (a plus-shaped outline, same family as the Feed star) */
  const PLUS = () => { const t = document.createElement('template'); t.innerHTML = '<svg class="gear plusout" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9.3 3.4h5.4v5.9h5.9v5.4h-5.9v5.9H9.3v-5.9H3.4V9.3h5.9z"/></svg>'; return t.content.firstChild; };
  function fix() {
    const e = document.getElementById('barEdit'); if (!e || e.querySelector('svg.plusout')) return;
    const old = e.querySelector(':scope>svg.gear') || e.querySelector(':scope>i');
    if (old) old.replaceWith(PLUS()); else e.insertBefore(PLUS(), e.firstChild);
  }
  /* closed outline with softly rounded corners */
  const rp = (pts, rf) => { const n = pts.length; let d = ''; for (let i = 0; i < n; i++) { const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], r = rf(i);
    const t = (q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), k = Math.min(r, l / 2) / l; return [p[0] + dx * k, p[1] + dy * k]; }, s = t(a), e = t(b);
    d += (i ? 'L' : 'M') + s[0].toFixed(2) + ' ' + s[1].toFixed(2) + 'Q' + p[0].toFixed(2) + ' ' + p[1].toFixed(2) + ' ' + e[0].toFixed(2) + ' ' + e[1].toFixed(2); } return d + 'Z'; };
  const w = 2.9, L = 8.6, c = 12, PL = [[c - w, c - L], [c + w, c - L], [c + w, c - w], [c + L, c - w], [c + L, c + w], [c + w, c + w], [c + w, c + L], [c - w, c + L], [c - w, c + w], [c - L, c + w], [c - L, c - w], [c - w, c - w]];
  const PLUS_D = rp(PL, i => (i === 2 || i === 5 || i === 8 || i === 11) ? 1.5 : 2.6);
  const PEN_D = rp([[4, 20], [5.2, 15.26], [13.9, 6.56], [17.44, 10.1], [8.74, 18.8]], i => i === 0 ? 0.9 : 1.9) + 'M11.07 9.39L14.61 12.93';
  function roundIcons() {
    document.querySelectorAll('#barEdit svg.plusout path').forEach(p => { if (p.getAttribute('d') !== PLUS_D) p.setAttribute('d', PLUS_D); });
    document.querySelectorAll('#spaceBtn svg.spco').forEach(s => { if (s.dataset.r) return; s.dataset.r = 1; s.innerHTML = '<path d="' + PEN_D + '"/>'; s.setAttribute('stroke-linejoin', 'round'); });
    const f = [...document.querySelectorAll('.thsec')].filter(e => !e.hidden)[0];
    document.querySelectorAll('.thsec.th-first').forEach(x => { if (x !== f) x.classList.remove('th-first'); }); if (f) f.classList.add('th-first');
  }
  setInterval(roundIcons, 800); roundIcons();
  const start = () => { fix(); const e = document.getElementById('barEdit'); if (e) new MutationObserver(fix).observe(e, { childList: true }); [200, 800, 2000, 4000].forEach(t => setTimeout(fix, t)); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
/* ==========================================================
   v4 (end of dashboard.js): GLASS bar + GLASS header (empty), bar never hides,
   swipe left/right = previous/next page, bar button of the open panel = green, others dim grey.
   Delete this block to go back.
   ========================================================== */
(function () {
  const st = document.createElement('style'); st.id = 'thGlassV4';
  st.textContent = `
/* ---------- 1) the bar never disappears ---------- */
html body #mobileFloatingBar:not(#z):not(#y),
html.th-page body #mobileFloatingBar:not(#z):not(#y),
html.adj-on body #mobileFloatingBar:not(#z):not(#y),
body.thfp-open #mobileFloatingBar:not(#z):not(#y){
  display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483010!important}
html body #mobileFloatingBar:not(#z):not(#y)>*{visibility:visible}
html body #mobileFloatingBar:not(#z):not(#y)>.pk-hide{visibility:hidden}

/* ---------- 2) real glass: almost clear, very strong blur, thin bright edge ---------- */
html body #mobileFloatingBar:not(#z):not(#y),
html body #thBrand:not(#z):not(#y),
html body .thHdr:not(#z):not(#y){
  background:rgba(24,28,32,.16)!important;background-color:rgba(24,28,32,.16)!important;background-image:none!important;
  -webkit-backdrop-filter:blur(34px) saturate(1.9) brightness(1.05)!important;
  backdrop-filter:blur(34px) saturate(1.9) brightness(1.05)!important;
  border:1px solid rgba(255,255,255,.22)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -1px 0 rgba(255,255,255,.06),0 8px 30px rgba(0,0,0,.25)!important}
html body.light-theme #mobileFloatingBar:not(#z):not(#y),
html body.light-theme #thBrand:not(#z):not(#y),
html body.light-theme .thHdr:not(#z):not(#y){
  background:rgba(255,255,255,.22)!important;background-color:rgba(255,255,255,.22)!important;background-image:none!important;
  border:1px solid rgba(255,255,255,.7)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 8px 30px rgba(15,23,42,.12)!important}
/* header: edge only at the bottom, same width as before (no size change) */
html body #thBrand:not(#z):not(#y),html body .thHdr:not(#z):not(#y){border-top:0!important;border-left:0!important;border-right:0!important}

/* ---------- 3) header is just a piece of glass: no name, no logo, nothing inside ---------- */
html body #thBrand:not(#z):not(#y) *,html body .thHdr:not(#z):not(#y) *{visibility:hidden!important;pointer-events:none!important}
html body #thBrand:not(#z):not(#y)::before,html body #thBrand:not(#z):not(#y)::after,
html body .thHdr:not(#z):not(#y)::before,html body .thHdr:not(#z):not(#y)::after{content:none!important;display:none!important}

/* icons stay readable on the clear glass */
html body #mobileFloatingBar>[data-bk] svg,html body #mobileFloatingBar>[data-bk] i,html body #mobileFloatingBar>.feed .fdp,html body #mobileFloatingBar>.mgrBtn svg{
  filter:drop-shadow(0 1px 3px rgba(0,0,0,.55))}
body.light-theme #mobileFloatingBar>[data-bk] svg,body.light-theme #mobileFloatingBar>[data-bk] i{filter:drop-shadow(0 1px 2px rgba(255,255,255,.7))}

/* ---------- 4) open panel = green, the rest = soft grey ---------- */
html.th-tabs body #mobileFloatingBar>[data-bk]:not(.th-on):not(#z),
html.th-tabs body #mobileFloatingBar>#feedBtn:not(.th-on):not(#z),
html.th-tabs body #mobileFloatingBar>#mgrBtn:not(.th-on):not(#z){color:#9aa3ad!important;opacity:.6!important}
html body #mobileFloatingBar>.th-on:not(#z){color:#34d399!important;opacity:1!important}
html body #mobileFloatingBar>.th-on:not(#z) svg,html body #mobileFloatingBar>.th-on:not(#z) i{color:#34d399!important}
html body #mobileFloatingBar>#feedBtn.th-on:not(#z){border-color:#34d399!important}
html body #mobileFloatingBar>[data-bk],html body #mobileFloatingBar>.feed{transition:color .25s,opacity .25s,border-color .25s}

/* ---------- v5: Home + page tabs ---------- */
html body #mobileFloatingBar:not(#z):not(#y){direction:ltr!important}
html body #mobileFloatingBar:not(#z):not(#y)>[data-bk]:not(.pk-hide):not(#z),html body #mobileFloatingBar:not(#z):not(#y)>#feedBtn:not(.pk-hide):not(#z),html body #mobileFloatingBar:not(#z):not(#y)>#mgrBtn:not(.pk-hide):not(#z),html body #mobileFloatingBar:not(#z):not(#y)>#daysBtn:not(.pk-hide):not(#z){visibility:visible!important}
html body #mobileFloatingBar .thl{color:#fff!important;opacity:1!important}
html body.light-theme #mobileFloatingBar .thl{color:#0f172a!important}
html body #mobileFloatingBar>[data-bk]:not(.th-on):not(#feedBtn):not(#z) :is(svg,i,.mgr-ico){filter:grayscale(1) brightness(2.2)}
html body.light-theme #mobileFloatingBar>[data-bk]:not(.th-on):not(#feedBtn):not(#z) :is(svg,i,.mgr-ico){filter:grayscale(1) brightness(.35)}
html body #mobileFloatingBar>#feedBtn.th-on:not(#z) .fdw path{stroke:#34d399!important}
#homeBtn svg.hmo{width:24px;height:24px;fill:none!important;stroke:currentColor!important;stroke-width:1.7}
html #thMenu,html #langPop{z-index:2147483020!important}
#thBackB{display:none!important}
/* feed page */
#pop.open{overflow-y:auto}
#pop .pc.nf{width:100%;box-sizing:border-box}
#pop .pc.nf.unread{background:rgba(96,165,250,.30)!important;border-color:rgba(147,197,253,.65)!important}
#pop .pc.nf.unread .nfc{font-weight:800}
#pop .pc.nf.read{background:rgba(15,23,42,.25)!important;border-color:rgba(255,255,255,.06)!important}
#pop .pc.nf.read .nfi,#pop .pc.nf.read .nfc,#pop .pc.nf.read .nft2,#pop .pc.nf.read .nfd{opacity:.5}
body.light-theme #pop .pc.nf.unread{background:rgba(96,165,250,.32)!important;border-color:rgba(59,130,246,.55)!important}
body.light-theme #pop .pc.nf.read{background:rgba(255,255,255,.3)!important;border-color:rgba(255,255,255,.5)!important}
.pc.nf:not(.open) .nft2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
#pop .seeold{display:block;margin:6px auto 4px;padding:11px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.3);background:rgba(148,163,184,.18);color:inherit;font:700 .85rem Cairo,Inter,sans-serif;cursor:pointer}
@media (max-width:820px) and (pointer:coarse){
html #pop.open{justify-content:flex-start!important}
html #pop.open .pcs{margin:0 auto!important;padding-top:calc(58px + env(safe-area-inset-top,0px));width:100%;max-width:480px}
}
/* bar: only the top edge line (no left / right / bottom border) */
html body #mobileFloatingBar:not(#z):not(#y){border:0!important;border-top:1px solid rgba(255,255,255,.22)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 8px 30px rgba(0,0,0,.25)!important}
html body.light-theme #mobileFloatingBar:not(#z):not(#y){border:0!important;border-top:1px solid rgba(255,255,255,.7)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 8px 30px rgba(15,23,42,.12)!important}
/* buttons: plain white, never dim; only the open page's icon is green; the notification circle and the numbers are always lit */
html.th-tabs body #mobileFloatingBar>[data-bk]:not(.th-on):not(#z),html.th-tabs body #mobileFloatingBar>#feedBtn:not(.th-on):not(#z),html.th-tabs body #mobileFloatingBar>#mgrBtn:not(.th-on):not(#z){color:#fff!important;opacity:1!important}
html.th-tabs body.light-theme #mobileFloatingBar>[data-bk]:not(.th-on):not(#z),html.th-tabs body.light-theme #mobileFloatingBar>#feedBtn:not(.th-on):not(#z),html.th-tabs body.light-theme #mobileFloatingBar>#mgrBtn:not(.th-on):not(#z){color:#0f172a!important}
html body #mobileFloatingBar #feedNum,html body #mobileFloatingBar #mgrNum,html body #mobileFloatingBar #daysNum,html body #mobileFloatingBar .fdb{opacity:1!important;filter:none!important}
/* Feed star = same as the other icons: white, and green only while it is the open page. The red number circle is untouched. */
html body #mobileFloatingBar>#feedBtn .fstar path{stroke:currentColor!important}
@media (max-width:820px) and (pointer:coarse){
#thDays.open,#pop.open,#thSet.open{padding-bottom:calc(96px + env(safe-area-inset-bottom))!important;box-sizing:border-box!important}
#thSpace{padding-bottom:calc(84px + env(safe-area-inset-bottom))}
.mgr-pop{padding-bottom:calc(84px + env(safe-area-inset-bottom))!important}
}`;
  document.head.appendChild(st);

  /* tag the header (same rule the file already uses) */
  function tagHdr() {
    const b = document.getElementById('thBrand'); if (b) b.classList.add('thHdr');
    [...document.body.children].forEach(el => {
      if (el.id === 'mobileFloatingBar' || el.tagName === 'SECTION' || el.tagName === 'SCRIPT') return;
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      if ((cs.position === 'fixed' || cs.position === 'sticky') && r.top < 6 && r.width > innerWidth * .5 && r.height > 20 && r.height < 130 && !el.classList.contains('thHdr') && !/^(pop|thDet|thHint|langPop|asm|thGhost|dock|thBri|barTip|thMenu|ptr)$/.test(el.id)) el.classList.add('thHdr');
    });
  }
  [200, 800, 2000, 4000, 8000].forEach(t => setTimeout(tagHdr, t)); window.addEventListener('load', tagHdr);

  /* ---------- v5: Home button + pages (Home, Notifications, Messenger, Days, Space) ---------- */
  const PAGES = ['home', 'feed', 'msgr', 'days', 'edit', 'space'];
  const BTN = { home: 'homeBtn', feed: 'feedBtn', msgr: 'mgrBtn', days: 'daysBtn', space: 'spaceBtn', edit: 'barEdit' };
  const SWAP = false;   /* false: finger moves right -> left = next page (the one on the right in the bar). true = reversed */
  const $q = s => document.querySelector(s);
  const HL = () => { const l = (typeof lang === 'string' && lang) || 'en'; return l === 'en' ? 'Home' : 'الرئيسية'; };

  function installHome() {
    const bar = $q('#mobileFloatingBar'); if (!bar) return;
    let b = document.getElementById('homeBtn');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'homeBtn'; b.dataset.bk = 'home'; b.className = 'circle-badge-btn';
      b.setAttribute('aria-label', 'Home');
      b.innerHTML = '<svg class="hmo" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.5 9.6v9.6a.8.8 0 0 0 .8.8h11.4a.8.8 0 0 0 .8-.8V9.6"/><path d="M9.8 20v-5a.8.8 0 0 1 .8-.8h2.8a.8.8 0 0 1 .8.8v5"/></svg><span class="thl"></span>';
      bar.appendChild(b);
      try { layoutBar(); } catch (e) { }
    }
    const l = b.querySelector('.thl'); if (l && l.textContent !== HL()) { l.textContent = HL(); b.title = HL(); }
  }
  installHome(); setInterval(installHome, 1000);

  /* which page is on screen now */
  function curKey() {
    if ($q('#thMenu.open')) return 'edit';
    if ($q('#thSpace.open')) return 'space';
    if ($q('#thDays.open')) return 'days';
    if (window.thMessenger && thMessenger.visible && thMessenger.visible()) return 'msgr';
    if ($q('#pop.open')) return 'feed';
    if ($q('#asm:not([hidden]),#rqm.open,#rqn.open,#rqo.open,#thSet.open,#thCal.open,#thLib.open')) return 'edit';
    return 'home';
  }
  /* the pages in the order of the bar (the user's own order; Home first by default) */
  function pages() {
    const bar = $q('#mobileFloatingBar'), o = typeof barOrder === 'function' ? barOrder() : PAGES;
    return o.filter(k => PAGES.includes(k)).filter(k => { const b = document.getElementById(BTN[k]); return b && b.parentNode === bar && !b.hidden && getComputedStyle(b).display !== 'none'; });
  }
  const edges = ['L', 'R'].map(sd => { const d = document.createElement('div'); d.className = 'thSpEdge'; d.style.cssText = 'position:fixed;top:0;bottom:calc(84px + env(safe-area-inset-bottom,0px));width:24px;z-index:2147483006;display:none;' + (sd === 'L' ? 'left:0' : 'right:0'); document.body.appendChild(d); return d; });
  function sync() {
    if (window.__thDragging) return;   /* the highlight stays on the current page until the drag ends */
    const bar = $q('#mobileFloatingBar'); if (!bar) return;
    const cur = curKey(), id = BTN[cur];
    edges.forEach(d => { d.style.display = cur === 'space' ? 'block' : 'none'; });
    [...bar.children].forEach(b => { if (b.id) b.classList.toggle('th-on', b.id === id); });
    document.documentElement.classList.add('th-tabs');
  }
  setInterval(sync, 80); document.addEventListener('click', () => setTimeout(sync, 0), true); sync();

  function closeAll() {
    try { if ($q('#thLib.open') && window.closeLibrary) closeLibrary(); } catch (e) { }
    try { if ($q('#thCal.open') && window.closeCal) closeCal(); } catch (e) { }
    try { if (window.thMessenger && thMessenger.state().open) thMessenger.hide(); } catch (e) { }
    try { if ($q('#pop.open')) closePop(); } catch (e) { }
    try { if ($q('#thDays.open')) thDays.close(); } catch (e) { }
    try { if ($q('#thSpace.open')) thSpace.close(); } catch (e) { }
    try { if ($q('#asm:not([hidden])') && window.Panels) Panels.min(); } catch (e) { }
    try { if ($q('#rqm.open,#rqn.open,#rqo.open')) closeRq(); } catch (e) { }
    try { const x = $q('#thSet.open .tsx'); if (x) x.click(); } catch (e) { }
    try { const m = $q('#thMenu.open'); if (m) m.classList.remove('open'); } catch (e) { }
    try { thDetClose(); } catch (e) { }
  }
  let spPrev = 'home';   /* the page you were on before you opened Space */
  function exitSpace() { const p = spPrev && spPrev !== 'space' ? spPrev : 'home'; go(p); }   /* closing Space saves the board first */
  function go(k) {
    if (!pages().includes(k)) return;
    const c0 = curKey();
    if (c0 === k) { if (k === 'space') exitSpace(); return; }   /* tap Space again = exit */
    if (k === 'space') spPrev = c0;
    closeAll();
    try {
      if (k === 'feed') openFeed($('feedBtn'));
      else if (k === 'msgr') thMessenger.open();
      else if (k === 'days') thDays.open();
      else if (k === 'space') thSpace.open();
      else if (k === 'edit') window.openStar && window.openStar();
    } catch (e) { console.warn('[nav]', k, e); }
    if (window.thFpSync) thFpSync(); sync();
  }
  /* tapping a bar button = go to that page (+ keeps its own menu) */
  const barEl = $q('#mobileFloatingBar');
  if (barEl) barEl.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-bk]'); if (!b || b.parentNode !== barEl) return;
    const k = PAGES.find(x => BTN[x] === b.id); if (!k) return;
    e.stopPropagation(); e.preventDefault(); go(k);
  }, true);

  { const tsx = $q('#thSpace .tsx'); if (tsx) tsx.addEventListener('click', () => setTimeout(() => { if (curKey() !== 'space' && spPrev && spPrev !== 'home') go(spPrev); }, 80)); }
  window.addEventListener('message', e => { if (e.data && e.data.type === 'thabit-board-exit') exitSpace(); });

  let sx = 0, sy = 0, st0 = 0, ok = false;
  const BLOCK = '.tbl,input,textarea,select,iframe,svg.c2,.avcv,.mbh,.mbt,.thdots,[data-bk],.mgr-b,.mgr-in,.mgr-comp,.thsel-ui,[contenteditable="true"],#thCal,#thFpBar';
  const MODALS = '.ssm.open,.mdl.open,.lgp.open,.avm.open,#thDet.open,#thCal.open,#thLib.open,#asm:not([hidden]),#rqm.open,#rqn.open,#rqo.open';
  const hScroll = t => { for (let e = t; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.position === 'fixed') break; if (/(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 2) return true; } return false; };
  /* ---------- swipe: the page follows the finger, the next page slides in beside it ---------- */
  const elOf = k => k === 'feed' ? $q('#pop') : k === 'days' ? $q('#thDays') : k === 'space' ? $q('#thSpace') : k === 'msgr' ? $q('.mgr-pop') : k === 'edit' ? ($q('#thSet') || $q('#thMenu')) : null;   /* More = the #thSet page */
  function opn(k) {
    try {
      if (k === 'feed') openFeed($('feedBtn'));
      else if (k === 'msgr') thMessenger.open();
      else if (k === 'days') thDays.open();
      else if (k === 'space') thSpace.open();
      else if (k === 'edit') window.openStar && window.openStar();
    } catch (e) { console.warn('[nav]', k, e); }
  }
  function shut(k) {   /* closes ONE page (closeAll closes everything) */
    try {
      if (k === 'feed') { if ($q('#pop.open')) closePop(); }
      else if (k === 'days') thDays.close();
      else if (k === 'space') thSpace.close();
      else if (k === 'msgr') thMessenger.hide();
      else if (k === 'edit') { const x = $q('#thSet.open .tsx'); if (x) x.click(); const m = $q('#thMenu.open'); if (m) m.classList.remove('open'); }
    } catch (e) { }
  }
  const put = (el, x, ms) => { if (!el) return; el.style.setProperty('transition', ms ? 'transform ' + ms + 'ms cubic-bezier(.2,.8,.25,1)' : 'none', 'important'); el.style.setProperty('transform', 'translate3d(' + x + 'px,0,0)', 'important'); };
  const clr = el => { if (!el) return; ['transform', 'transition', 'z-index', 'will-change'].forEach(p => el.style.removeProperty(p)); };
  const DRAG_START = 10;     /* px of horizontal movement before the page starts to follow the finger (was 70) */
  const COMMIT = 0.22;       /* share of the screen width you must pass to switch page (a quick flick also switches) */
  let dg = null, lx = 0, lt = 0, vx = 0;
  function dragStart(dx) {
    const ps = pages(), i = ps.indexOf(curKey()); if (i < 0 || ps.length < 2) return null;
    const n = ((dx < 0) !== SWAP) ? i + 1 : i - 1; if (n < 0 || n >= ps.length) return null;
    const ck = ps[i], nk = ps[n], ce = elOf(ck), side = dx < 0 ? 1 : -1, w = innerWidth;
    if (ck !== 'home' && !ce) return null;
    let ne = null;
    if (nk !== 'home') {
      opn(nk); ne = elOf(nk);
      if (!ne || getComputedStyle(ne).display === 'none') { shut(nk); return null; }
    }
    [ce, ne].forEach(el => { if (el) { el.style.setProperty('will-change', 'transform', 'important'); } });
    if (ce) ce.style.setProperty('z-index', '2147482000', 'important');
    if (ne) ne.style.setProperty('z-index', '2147482001', 'important');
    put(ne, side * w, 0);
    window.__thDragging = true; window.__thDrag = { a: BTN[ck], b: BTN[nk], t: 0, live: true };
    return { ck, nk, ce, ne, side, w };
  }
  function dragMove(dx) {
    dx = dg.side > 0 ? Math.min(0, dx) : Math.max(0, dx);
    put(dg.ce, dx, 0); put(dg.ne, dg.side * dg.w + dx, 0);
    if (window.__thDrag) window.__thDrag.t = Math.min(1, Math.abs(dx) / (dg.w * 0.35));
    return dx;
  }
  function dragEnd(dx) {
    const d = dg; dg = null; if (!d) return;
    dx = d.side > 0 ? Math.min(0, dx) : Math.max(0, dx);
    const go1 = Math.abs(dx) > d.w * COMMIT || (Math.abs(vx) > 0.45 && Math.abs(dx) > 24 && Math.sign(vx) === Math.sign(dx));
    if (d.nk === 'space') spPrev = d.ck;
    if (window.__thDrag) { window.__thDrag.live = false; window.__thDrag.t = go1 ? 1 : 0; }
    if (go1) {
      put(d.ne, 0, 230); put(d.ce, -d.side * d.w, 230);
      setTimeout(() => { shut(d.ck); clr(d.ce); clr(d.ne); window.__thDragging = false; sync(); window.__thDrag = null; if (window.thFpSync) thFpSync(); }, 245);
    } else {
      put(d.ce, 0, 200); put(d.ne, d.side * d.w, 200);
      setTimeout(() => { shut(d.nk); clr(d.ce); clr(d.ne); window.__thDragging = false; sync(); window.__thDrag = null; if (window.thFpSync) thFpSync(); }, 215);
    }
  }
  window.addEventListener('touchstart', e => {   /* window + capture: runs before the pages' own "ignore taps on the empty edge" handler */
    ok = e.touches.length === 1 && !dg && !(e.target.closest && e.target.closest(BLOCK)) && !document.querySelector(MODALS) && !hScroll(e.target);
    if (!ok) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; st0 = Date.now(); lx = sx; lt = st0; vx = 0;
  }, { passive: true, capture: true });
  window.addEventListener('touchmove', e => {
    if (!ok || !e.touches[0]) return;
    const x = e.touches[0].clientX, dx = x - sx, dy = e.touches[0].clientY - sy, now = Date.now();
    if (now > lt) vx = (x - lx) / (now - lt); lx = x; lt = now;
    if (!dg) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) { ok = false; return; }   /* it is a vertical scroll */
      if (Math.abs(dx) < DRAG_START || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      dg = dragStart(dx); if (!dg) { ok = false; return; }
    }
    if (e.cancelable) e.preventDefault();
    dragMove(dx);
  }, { passive: false, capture: true });
  document.addEventListener('touchend', e => {
    if (!ok) return; ok = false;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (dg) { dragEnd(dx); return; }
    /* quick flick that finished before the page started following the finger */
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.4 || Date.now() - st0 > 700) return;
    const ps = pages(), i = ps.indexOf(curKey()); if (i < 0 || ps.length < 2) return;
    const n = ((dx < 0) !== SWAP) ? i + 1 : i - 1;
    if (n < 0 || n >= ps.length) return;
    go(ps[n]);
  }, { passive: true });
  document.addEventListener('touchcancel', () => { if (dg) { ok = false; dragEnd(0); } }, { passive: true });
})();

/* ===== Feed = full-width page between the header and the bar; header + bar = the same light glass; no dots, no name in the header ===== */
(function () {
  const old = document.getElementById('thFeedGlass'); if (old) old.remove();
  const st = document.createElement('style'); st.id = 'thFeedGlass';
  st.textContent = `
/* header and bar: ONE glass look (very light blur), no dots, nothing inside the header */
html body #mobileFloatingBar:not(#z):not(#y):not(#w),
html body #thBrand:not(#z):not(#y):not(#w),
html body .thHdr:not(#z):not(#y):not(#w){
  background:rgba(24,28,32,.30)!important;background-color:rgba(24,28,32,.30)!important;background-image:none!important;
  -webkit-backdrop-filter:blur(6px) saturate(1.3)!important;backdrop-filter:blur(6px) saturate(1.3)!important;
  border:0!important;box-shadow:none!important;outline:0!important}
html body.light-theme #mobileFloatingBar:not(#z):not(#y):not(#w),
html body.light-theme #thBrand:not(#z):not(#y):not(#w),
html body.light-theme .thHdr:not(#z):not(#y):not(#w){
  background:rgba(255,255,255,.38)!important;background-color:rgba(255,255,255,.38)!important;background-image:none!important;
  border:0!important;box-shadow:none!important}
html body #thBrand:not(#z):not(#y):not(#w),html body .thHdr:not(#z):not(#y):not(#w){font-size:0!important;color:transparent!important;z-index:2147483004!important}
/* logo (wherever it lives) stays UNDER the header glass */
html body>[class*="logo"],html body>[id*="logo"]{z-index:2147483002!important}
/* feed: the first cell starts at the standard gap under the header */
html body #pop.open:not(#z) .pcs{padding-top:var(--th-gap)!important}
:root{--th-hd:calc(env(safe-area-inset-top,0px) + 52px);--th-gap:44px}
/* STANDARD distance between the header and the first cell, on every page */
html body .thsec{padding-top:calc(var(--th-hd) + var(--th-gap))!important}
html body #thDays.open:not(#z),html body #thSet.open:not(#z){padding-top:calc(var(--th-hd) + var(--th-gap))!important}
/* header: the old header element is REMOVED; #thGH is a pane of glass in its place (same as the bar: no background, no border, no dots, no logo) */
html body #thBrand:not(#z):not(#y):not(#w){display:none!important}
#thGH{position:fixed;left:0;right:0;top:0;height:var(--th-hd);z-index:2147483004;pointer-events:none;overflow:hidden}
#thGH .gl{position:absolute;inset:0;background:rgba(24,28,32,.30);-webkit-backdrop-filter:blur(6px) saturate(1.3);backdrop-filter:blur(6px) saturate(1.3)}
body.light-theme #thGH .gl{background:rgba(255,255,255,.38)}
/* title of the page you are on, written on the glass (first quarter, left); the name only on More / Account (right) */
#thGH .ttl{position:absolute;right:16px;top:env(safe-area-inset-top,0px);height:52px;display:flex;align-items:center;max-width:46%;font:700 17px/1 Cairo,Inter,system-ui,sans-serif;letter-spacing:.01em;color:#fff;white-space:nowrap;text-shadow:0 1px 8px rgba(0,0,0,.35)}
#thGH .nm{position:absolute;left:16px;top:env(safe-area-inset-top,0px);height:52px;display:flex;align-items:center;max-width:46%;overflow:hidden;text-overflow:ellipsis;font:600 14px/1 Cairo,Inter,system-ui,sans-serif;color:#fff;white-space:nowrap;opacity:.9}
body.light-theme #thGH .ttl,body.light-theme #thGH .nm{color:#0f172a;text-shadow:none}
/* (logo is OFF for now. To bring it back: see the note next to  g.innerHTML  and add these styles)
#thGH .lgw{position:absolute;left:16px;top:50%;transform:translateY(-42%);width:34px;height:34px;filter:drop-shadow(0 0 5px rgba(56,189,248,.95)) drop-shadow(0 0 14px rgba(56,189,248,.55))}
#thGH .lg{width:100%;height:100%;-webkit-mask:var(--thlogo) center/contain no-repeat;mask:var(--thlogo) center/contain no-repeat;background:linear-gradient(135deg,#a5f3fc,#38bdf8 45%,#3b82f6 75%,#22d3ee)} */
/* the new glass header can never turn into the old one, whoever tags it */
html body #thGH:not(#z):not(#y):not(#w),html body #thGH.thHdr:not(#z):not(#y):not(#w){background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;visibility:visible!important;opacity:1!important;display:block!important}
html body #thGH:not(#z):not(#y):not(#w) *{visibility:visible!important}
html body #thGH:not(#z):not(#y):not(#w) .gl{background:rgba(24,28,32,.30)!important}
html body.light-theme #thGH:not(#z):not(#y):not(#w) .gl{background:rgba(255,255,255,.38)!important}
html body #thGH:not(#z):not(#y):not(#w) .gl{-webkit-backdrop-filter:blur(6px) saturate(1.3)!important;backdrop-filter:blur(6px) saturate(1.3)!important}
#rngNote{display:none!important}
/* standard top distance for the messenger too */
html body .mgr-pop:not(#z){padding-top:calc(var(--th-hd) + var(--th-gap))!important}
/* header: the glass is a layer on top, the logo (with its normal glow) sits UNDER it */
html body #thBrand:not(#z):not(#y):not(#w),html body.light-theme #thBrand:not(#z):not(#y):not(#w){background:transparent!important;background-color:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
html body #thBrand:not(#z):not(#y):not(#w)::after{content:""!important;display:block!important;position:absolute!important;inset:0!important;z-index:5!important;pointer-events:none!important;background:rgba(24,28,32,.30)!important;-webkit-backdrop-filter:blur(6px) saturate(1.3)!important;backdrop-filter:blur(6px) saturate(1.3)!important}
html body.light-theme #thBrand:not(#z):not(#y):not(#w)::after{background:rgba(255,255,255,.38)!important}
/* bar: the glass is a layer on top of a small light that travels under the active button */
html body #mobileFloatingBar:not(#z):not(#y):not(#w),html body.light-theme #mobileFloatingBar:not(#z):not(#y):not(#w){background:transparent!important;background-color:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
html body #mobileFloatingBar:not(#z):not(#y):not(#w)::after{content:""!important;display:block!important;position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;border-radius:inherit;background:rgba(24,28,32,.30)!important;-webkit-backdrop-filter:blur(6px) saturate(1.3)!important;backdrop-filter:blur(6px) saturate(1.3)!important}
html body.light-theme #mobileFloatingBar:not(#z):not(#y):not(#w)::after{background:rgba(255,255,255,.38)!important}
html body #mobileFloatingBar:not(#z):not(#y):not(#w)>:not(.thSweepBox){z-index:2}
/* light streak that passes behind the glass: bar = at start and then every 15 s, header = once at start */
.thSweepBox{position:absolute;inset:0;overflow:hidden;border-radius:inherit;z-index:0;pointer-events:none}
.thSweep{position:absolute;top:-20%;bottom:-20%;left:0;width:34%;opacity:0;transform:translateX(-130%);background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.22) 45%,rgba(167,243,208,.30) 58%,rgba(255,255,255,0));filter:blur(7px)}
.thSweep.go{animation:thSweepGo 2.6s ease-in-out}
@keyframes thSweepGo{0%{opacity:0;transform:translateX(-130%)}12%{opacity:1}88%{opacity:1}100%{opacity:0;transform:translateX(330%)}}
@media(prefers-reduced-motion:reduce){.thSweep{display:none}}
html body #thBrand:not(#z):not(#y):not(#w) :is(.thb-n,[class*="dot"],[class*="name"],h1,h2,h3,p,small){display:none!important}
html body #thBrand:not(#z):not(#y):not(#w) :is(img,svg,picture,canvas,[class*="logo"],[id*="logo"]){visibility:visible!important;z-index:1!important}
/* the feed page: separate rounded cards with a gap between them (as before), a bit narrower from the sides; the limit at the top is the header, at the bottom the bar; cards slide under the glass */
html body #pop.open:not(#z){position:fixed!important;inset:0!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;
  padding:var(--th-hd,calc(58px + env(safe-area-inset-top,0px))) 0 var(--th-bar,calc(96px + env(safe-area-inset-bottom,0px)))!important;
  overflow-y:auto!important;-webkit-overflow-scrolling:touch;justify-content:flex-start!important;align-items:stretch!important;border-radius:0!important}
html body #pop.open:not(#z) .pcs{margin:0!important;padding:var(--th-gap) 22px 0!important;width:100%!important;max-width:none!important;gap:10px!important;box-sizing:border-box!important}`;
  document.head.appendChild(st);
  /* real heights of the header and the bar, so the feed starts / ends exactly at them */
  function measure() {
    try {
      const r = document.documentElement, h = document.getElementById('thBrand'), b = document.getElementById('mobileFloatingBar');
      if (b) { const y = b.getBoundingClientRect(); if (y.height > 10) r.style.setProperty('--th-bar', Math.round(innerHeight - y.top) + 'px'); }
    } catch (e) { }
  }
  /* the glass header (logo behind the glass) */
  (function () { if (document.getElementById('thGH')) return; const g = document.createElement('div'); g.id = 'thGH'; document.documentElement.classList.add('th-gh'); /* LOGO IS OFF FOR NOW. To bring it back, use:  g.innerHTML = '<div class="lgw"><div class="lg"></div></div><div class="gl"></div>';  (the .lgw / .lg styles are still in the CSS above) */
    g.innerHTML = '<div class="gl"></div><div class="ttl"></div><div class="nm"></div>'; document.body.appendChild(g); })();
  /* the old header must never exist: remove it now and whenever anything adds it again */
  (function () {
    const kill = () => { const o = document.getElementById('thBrand'); if (o) o.remove(); };
    kill(); new MutationObserver(kill).observe(document.documentElement, { childList: true, subtree: false });
    new MutationObserver(kill).observe(document.body, { childList: true });
  })();
  /* page title on the glass; the name shows only on More / Account */
  const TTLS = {
    en: { homeBtn: 'Home', feedBtn: 'Feed', daysBtn: 'Time', mgrBtn: 'Messenger', barEdit: 'More', spaceBtn: 'Space' },
    ar: { homeBtn: 'الرئيسية', feedBtn: 'المنشورات', daysBtn: 'الوقت', mgrBtn: 'المحادثات', barEdit: 'المزيد', spaceBtn: 'المساحة' },
    eg: { homeBtn: 'الرئيسية', feedBtn: 'الفيد', daysBtn: 'تايم', mgrBtn: 'الماسنجر', barEdit: 'المزيد', spaceBtn: 'المساحة' }
  };
  const curL = () => { const l = (typeof lang === 'string' && lang) || 'en'; return TTLS[l] ? l : 'en'; };
  let lastOn = '';
  let tt = '', tn = '';
  setInterval(() => {
    try {
      const gh = document.getElementById('thGH'); if (!gh) return;
      const on = document.querySelector('#mobileFloatingBar > .th-on'), t = on ? (TTLS[curL()][on.id] || '') : ''; if (on) lastOn = on.id;
      gh.classList.remove('thHdr'); gh.dataset.l = curL();
      const te = gh.querySelector('.ttl'); if (!t && lastOn) tt = TTLS[curL()][lastOn] || tt; if (t) tt = t;   /* a popup turns every button off: keep the last title, never blank */
      if (tt) { try { thRollTitle(te, tt, curL()); } catch (e) { if (te.textContent !== tt) te.textContent = tt; } }
      let n = tn; if (on) { n = ''; if (on.id === 'barEdit') n = (window.Thabit && Thabit.getName && Thabit.getName()) || ''; tn = n; }
      const ne = gh.querySelector('.nm'); if (ne.textContent !== n) ne.textContent = n;
    } catch (e) { }
  }, 40);
  /* light streak behind the glass */
  function mkSweep(host, first) {
    if (!host || host.querySelector(':scope > .thSweepBox')) return host && host.querySelector(':scope > .thSweepBox .thSweep');
    const bx = document.createElement('div'); bx.className = 'thSweepBox'; bx.innerHTML = '<div class="thSweep"></div>';
    host.insertBefore(bx, host.firstChild); return bx.firstChild;
  }
  function fire(el) { if (!el) return; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }
  let barSw = null, hdrSw = null;
  function sweepInit() {
    const bar = document.getElementById('mobileFloatingBar'), gh = document.getElementById('thGH');
    if (!barSw && bar) { barSw = mkSweep(bar); setTimeout(() => fire(barSw), 700); setInterval(() => { if (!document.hidden) { barSw = mkSweep(bar) || barSw; fire(barSw); } }, 15000); }
    if (!hdrSw && gh) { hdrSw = mkSweep(gh); setTimeout(() => fire(hdrSw), 700); }   /* header: once, at start */
  }
  /* while the page is loading / refreshing: a flash keeps passing under the header and the bar */
  setInterval(() => { if (document.documentElement.classList.contains('thsk-on')) { sweepInit(); fire(barSw); fire(hdrSw); } }, 1700);
  sweepInit(); const _si = setInterval(() => { sweepInit(); if (barSw && hdrSw) clearInterval(_si); }, 400);
  measure(); setInterval(measure, 500); window.addEventListener('resize', measure); window.addEventListener('load', measure);
})();


/* ==========================================================
   Pull down (top -> bottom) = refresh ONLY the page / widget you are on. No circle, no indicator.
   Home -> load(), Feed -> refreshNotes(), Messenger -> reload messages, Days -> redraw, Space -> reload its frame.
   Appended at the END of dashboard.js. Delete this block to go back (the old spiral pull then works again).
   ========================================================== */
(function () {
  if (window.__thPP) return; window.__thPP = 1;
  const MIN = 90;
  const vis = e => e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const activeId = () => { const o = document.querySelector('#mobileFloatingBar > .th-on'); return o ? o.id : ''; };
  const winTop = () => Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0) <= 2;
  function scrolledInside(t) {
    for (let e = t; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.scrollTop > 2) return true;
    }
    return false;
  }
  let busy = false;
  async function refreshCurrent() {
    if (busy) return; busy = true;
    try {
      const id = activeId(), jobs = [];
      if (id === 'spaceBtn') {
        const fr = document.querySelector('#thSpace iframe');
        if (fr) { try { fr.contentWindow.location.reload(); } catch (e) { const u = fr.src; fr.src = 'about:blank'; setTimeout(() => { fr.src = u; }, 30); } }
      } else {
        if (id === 'mgrBtn' && window.thMessenger && thMessenger.reload) jobs.push(thMessenger.reload());
        if (id === 'daysBtn' && window.thDays && document.querySelector('#thDays.open')) { try { thDays.open(); } catch (e) { } }
        if (typeof refreshNotes === 'function') jobs.push(refreshNotes());
        if ((id === 'homeBtn' || !id) && window.thSkel) window.thSkel(true);
        jobs.push(load());                      /* the data of the whole dashboard, whichever page you are on */
      }
      await Promise.allSettled(jobs);
    } catch (e) { console.warn('[pull refresh]', e); }
    setTimeout(() => { busy = false; }, 600);
  }
  /* ---------- the pull circle: comes down from BEHIND the header, follows the finger; the icon of the page you are on draws itself
     (white) as you pull. Full = it turns green, pops, goes back behind the header, then the page refreshes. Let go early = it un-draws and hides. ---------- */
  const pst = document.createElement('style'); pst.id = 'thPtrCss';
  pst.textContent = `
#thPtr{position:fixed;top:0;left:50%;margin-left:-24px;width:48px;height:48px;border-radius:50%;z-index:2147483003;display:grid;place-items:center;background:#161b22;border:1.5px solid rgba(255,255,255,.35);box-shadow:0 8px 22px rgba(0,0,0,.45);opacity:0;pointer-events:none;will-change:transform;transform:translate3d(0,-120px,0)}
body.light-theme #thPtr{background:#fff;border-color:rgba(15,23,42,.25);box-shadow:0 8px 22px rgba(15,23,42,.2)}
#thPtr svg{width:28px;height:28px;display:block;overflow:visible;fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
body.light-theme #thPtr svg{stroke:#0f172a}
#thPtr svg path{stroke-dasharray:1;stroke-dashoffset:1}
#thPtr.done svg{stroke:#34d399!important}
body.light-theme #thPtr.done svg{stroke:#059669!important}
#thPtr.pop{animation:thPtrPop .38s cubic-bezier(.3,1.7,.5,1)}
@keyframes thPtrPop{0%{scale:1}45%{scale:1.28}100%{scale:1}}
@media(prefers-reduced-motion:reduce){#thPtr.pop{animation:none}}`;
  document.head.appendChild(pst);
  const ring = document.createElement('div'); ring.id = 'thPtr'; ring.setAttribute('aria-hidden', 'true'); document.body.appendChild(ring);
  const ICONS = {
    homeBtn: ['M3.5 11.2 12 4l8.5 7.2', 'M5.5 9.6v9.6a.8.8 0 0 0 .8.8h11.4a.8.8 0 0 0 .8-.8V9.6', 'M9.8 20v-5a.8.8 0 0 1 .8-.8h2.8a.8.8 0 0 1 .8.8v5'],
    feedBtn: ['M12 3L15.06 7.79L20.56 9.22L16.95 13.61L17.29 19.28L12 17.2L6.71 19.28L7.05 13.61L3.44 9.22L8.94 7.79Z'],
    daysBtn: ['M4.5 6.5h15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1z', 'M3.5 10.5h17', 'M8.5 3.5v4', 'M15.5 3.5v4'],
    mgrBtn: ['M21.4 3.3 2.9 10.4c-.9.3-.9 1.5 0 1.8l4.6 1.6 1.8 5.5c.3.9 1.4 1 1.9.3l2.4-2.6 4.6 3.4c.7.5 1.6.1 1.8-.7L22.9 4.8c.2-1-.7-1.9-1.5-1.5z', 'M7.6 13.8 17.4 7'],
    barEdit: ['M12 4.5v15', 'M4.5 12h15'],
    spaceBtn: ['M4 20v-3.8L16.2 4a1.9 1.9 0 0 1 2.7 0l1.1 1.1a1.9 1.9 0 0 1 0 2.7L7.8 20z', 'M13.6 6.7l3.7 3.7']
  };
  let paths = [], iconId = '';
  function setIcon(id) {                  /* the icon of the page you are on (Home by default) */
    id = ICONS[id] ? id : 'homeBtn'; if (id === iconId) return; iconId = id;
    ring.innerHTML = '<svg viewBox="0 0 24 24">' + ICONS[id].map(d => '<path pathLength="1" d="' + d + '"/>').join('') + '</svg>';
    paths = [...ring.querySelectorAll('path')];
  }
  const hdrH = () => { const h = document.getElementById('thGH'); return h ? h.getBoundingClientRect().height : 52; };
  const TH = 84, MAXP = 112;
  function draw(p) {                      /* p = how far the circle has been pulled (px) */
    const k = Math.max(0, Math.min(1, p / TH)), n = paths.length;
    ring.style.opacity = p <= 1 ? 0 : 1;
    ring.style.transform = 'translate3d(0,' + Math.round(hdrH() - 54 + p * 0.95) + 'px,0)';   /* p = 0: fully behind the header */
    paths.forEach((el, j) => { const f = Math.max(0, Math.min(1, k * n - j)); el.style.strokeDashoffset = 1 - f; });
  }
  let anim = 0;
  function glide(from, to, ms, done) {    /* smooth slide of the pull value */
    cancelAnimationFrame(anim); const t0 = performance.now();
    (function f(now) {
      const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 2);
      draw(from + (to - from) * e);
      if (t < 1) anim = requestAnimationFrame(f); else if (done) done();
    })(t0);
  }
  let g = null, cur = 0, running = false;
  document.addEventListener('touchstart', e => {
    g = null;
    if (busy || running || e.touches.length !== 1) return;
    const t0 = e.target;
    if (t0.closest && t0.closest('input,textarea,select,[contenteditable="true"],#mobileFloatingBar,.thsel-ui,iframe')) return;
    if (document.querySelector('.ssm.open,.mdl.open,.lgp.open,.avm.open,#thDet.open,#thCal.open,#thLib.open,#asm:not([hidden]),#rqm.open,#rqn.open,#rqo.open')) return;
    const id = activeId();
    if (id !== 'spaceBtn' && !scrolledInside(t0) && (id === 'homeBtn' || !id) && !winTop()) return;
    if (scrolledInside(t0)) return;
    const t = e.touches[0]; g = { x: t.clientX, y: t.clientY, on: false }; cancelAnimationFrame(anim);
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!g) return;
    const t = e.touches[0], dy = t.clientY - g.y, dx = t.clientX - g.x;
    if (!g.on) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) { g = null; return; }      /* a sideways swipe: not ours */
      if (dy < 10) { if (dy < -8) g = null; return; }                                  /* not pulling down yet */
      if (!winTop() && activeId() !== 'spaceBtn' && (activeId() === 'homeBtn' || !activeId())) { g = null; return; }
      g.on = true; ring.classList.remove('done', 'pop'); setIcon(activeId() || 'homeBtn');
    }
    cur = Math.max(0, Math.min(MAXP, (dy - 10) * 0.7));
    if (e.cancelable) e.preventDefault();
    draw(cur);                                                                          /* going back up un-draws it by itself */
  }, { passive: false });
  function release() {
    const was = g; g = null; if (!was || !was.on) return;
    if (cur >= TH) {
      running = true; glide(cur, TH, 120, () => {
        draw(TH); ring.classList.add('done'); ring.classList.remove('pop'); void ring.offsetWidth; ring.classList.add('pop');   /* green + a small pop */
        setTimeout(() => glide(TH, 0, 300, () => {                                      /* back behind the header... */
          ring.classList.remove('done', 'pop'); running = false;
          refreshCurrent();                                                              /* ...then the refresh */
        }), 420);
      });
    } else {
      glide(cur, 0, 120 + cur * 5);                                                     /* not finished: un-draws and hides */
    }
    cur = 0;
  }
  document.addEventListener('touchend', release, { passive: true });
  document.addEventListener('touchcancel', release, { passive: true });
})();


/* ==========================================================
   Main widgets (Feed, Messenger, Days, Space, More) = FULL PAGES on every screen size (phone, tablet, computer).
   - the page background fills the whole screen (solid, nothing of Home behind it); the container stays in the middle, readable
   - tapping the background does nothing: you leave a page only by going to another page (bar / swipe) or leaving the app
   - no inner title that repeats the header (the header already says where you are)
   - pop-ups INSIDE a page keep working as before (they are not touched)
   - a solid "void" layer sits under the pages, so while you swipe between two pages you never see Home between / behind them
   Appended at the END of dashboard.js. Delete this block to go back.
   ========================================================== */
(function () {
  if (window.__thPages) return; window.__thPages = 1;
  const st = document.createElement('style'); st.id = 'thPagesCss';
  st.textContent = `
:root{--thp-bg:#000}
body.light-theme{--thp-bg:#f4f6f9}
/* the void under the pages */
#thVoid{position:fixed;inset:0;z-index:10020;background:var(--thp-bg);display:none;pointer-events:auto}
html.thp-on #thVoid{display:block}
/* each page: whole screen, solid background, header above and bar below stay free */
html body #pop.open:not(#z),html body #thSet.open:not(#z),html body #thDays.open:not(#z),html body .mgr-pop:not(#z){
  position:fixed!important;inset:0!important;left:0!important;top:0!important;right:0!important;bottom:0!important;width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;margin:0!important;border-radius:0!important;border:0!important;box-shadow:none!important;box-sizing:border-box!important;
  background:var(--thp-bg)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
/* FIX: the void (z 10020) was above the Feed page (#pop, z 10001) and hid it; pages must sit above the void, the bar/header above pages */
html body #pop.open:not(#z){z-index:10025!important}
html body .mgr-pop:not(#z){z-index:2147483001!important}
html body #mobileFloatingBar:not(#z){z-index:2147483003!important}
html body #thSpace.open:not(#z){background:var(--thp-bg)!important}
html body #thSet.open:not(#z),html body #thDays.open:not(#z){display:flex!important;justify-content:center!important;align-items:flex-start!important;overflow:auto!important;padding-bottom:calc(96px + env(safe-area-inset-bottom))!important}
html body #thSpace{padding-top:var(--th-hd,calc(52px + env(safe-area-inset-top)))!important;padding-bottom:calc(84px + env(safe-area-inset-bottom))!important;box-sizing:border-box!important}
/* the container: in the middle, a sensible width on wide screens */
html body #thSet .tsc,html body #thDays .tsc{width:min(480px,100%)!important;margin:0 auto auto!important}
html body #pop.open .pcs{margin:0 auto!important;width:100%!important;max-width:480px!important}
html body .mgr-pop>*{width:min(560px,100%);align-self:center;box-sizing:border-box}
html body .mgr-pop{align-items:center}
html body .mgr-pop .mgr-list,html body .mgr-pop .mgr-cells{flex:1 1 auto;min-height:0}
/* no repeated titles / no close buttons: the header says where you are, the bar moves you */
html body #thSet .tsh,html body #thDays .tsh,html body .mgr-pop .mgr-h>b,html body #thSpace .tsx,html body .mgr-veil{display:none!important}
html body .mgr-pop .mgr-h{background:transparent!important;padding-top:0!important;padding-bottom:0!important;min-height:0}
html body .mgr-pop .mgr-h [data-x]{display:none!important}
`;
  document.head.appendChild(st);

  const v = document.createElement('div'); v.id = 'thVoid'; document.body.appendChild(v);
  const vis = e => e && e.getClientRects().length > 0 && getComputedStyle(e).display !== 'none';
  const anyPage = () => !!(document.querySelector('#pop.open,#thSet.open,#thDays.open,#thSpace.open') || [...document.querySelectorAll('.mgr-pop')].some(vis));
  let last = null;
  setInterval(() => {
    const d = window.__thDrag, toHome = !!(d && (d.a === 'homeBtn' || d.b === 'homeBtn')), on = anyPage() && !toHome;
    if (on !== last) { last = on; document.documentElement.classList.toggle('thp-on', on); }
  }, 80);

  /* a tap on the empty background of a page never closes it (every screen size); the void swallows taps too */
  const IDS = ['pop', 'thSet', 'thDays', 'thSpace', 'thVoid'];
  ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'click'].forEach(ev => document.addEventListener(ev, e => {
    const t = e.target;
    if (t && (IDS.includes(t.id) || (t.classList && (t.classList.contains('mgr-veil') || t.classList.contains('mgr-pop'))))) { e.stopImmediatePropagation(); if (e.cancelable && ev === 'click') e.preventDefault(); }
  }, true));
  /* Escape no longer closes a main page either */
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && anyPage() && !document.querySelector('.ssm.open,#thCal.open,#thLib.open,#thDet.open,#asm:not([hidden])')) { e.stopImmediatePropagation(); } }, true);
})();

/* ==========================================================
   Frosted glass (header + bar): ONE flat tint everywhere (no darker band in the middle), no borders, no lines, blurred and see-through.
   Dark theme = white writing, light theme = dark writing. Page title in the header: English on the LEFT, Arabic on the RIGHT, and it
   rolls in letter after letter (no pop). Old brand/logo leftovers under the header are removed.
   Appended at the END of dashboard.js. Delete this block to go back.
   ========================================================== */
(function () {
  if (document.getElementById('thWhiteGlass')) return;
  const st = document.createElement('style'); st.id = 'thWhiteGlass';
  st.textContent = `
/* the glass: one flat tint, same from top to bottom */
html body #thGH:not(#z):not(#y):not(#w):not(#v) .gl,
html body #mobileFloatingBar:not(#z):not(#y):not(#w):not(#v)::after{
  background:rgba(255,255,255,.09)!important;background-image:none!important;
  -webkit-backdrop-filter:blur(20px) saturate(1.8)!important;backdrop-filter:blur(20px) saturate(1.8)!important;
  border:0!important;box-shadow:none!important;outline:0!important}
html body.light-theme #thGH:not(#z):not(#y):not(#w):not(#v) .gl,
html body.light-theme #mobileFloatingBar:not(#z):not(#y):not(#w):not(#v)::after{background:rgba(255,255,255,.5)!important;background-image:none!important}
/* no borders / lines on the header or the bar, top or bottom */
html body #thGH:not(#z):not(#y):not(#w):not(#v),html body #thGH:not(#z):not(#y):not(#w):not(#v) .gl,
html body #mobileFloatingBar:not(#z):not(#y):not(#w):not(#v),html body.light-theme #mobileFloatingBar:not(#z):not(#y):not(#w):not(#v),
html body #mobileFloatingBar:not(#z):not(#y):not(#w):not(#v)::before{border:0!important;border-top:0!important;border-bottom:0!important;box-shadow:none!important;outline:0!important}
/* writing: white on the dark theme, dark on the light theme */
html body #thGH:not(#z):not(#y):not(#w):not(#v) .ttl,html body #thGH:not(#z):not(#y):not(#w):not(#v) .nm{color:#fff!important;text-shadow:0 1px 8px rgba(0,0,0,.35)!important}
html body.light-theme #thGH:not(#z):not(#y):not(#w):not(#v) .ttl,html body.light-theme #thGH:not(#z):not(#y):not(#w):not(#v) .nm{color:#0f172a!important;text-shadow:none!important}
html.th-tabs body #mobileFloatingBar:not(#y):not(#x):not(#w)>[data-bk]:not(.th-on):not(#z){color:#fff!important;opacity:1!important}
html.th-tabs body.light-theme #mobileFloatingBar:not(#y):not(#x):not(#w)>[data-bk]:not(.th-on):not(#z){color:#0f172a!important}
html body #mobileFloatingBar:not(#y):not(#x):not(#w)>.th-on:not(#z),
html body #mobileFloatingBar:not(#y):not(#x):not(#w)>.th-on:not(#z) svg,
html body #mobileFloatingBar:not(#y):not(#x):not(#w)>.th-on:not(#z) i{color:#34d399!important;opacity:1!important}
html body.light-theme #mobileFloatingBar:not(#y):not(#x):not(#w)>.th-on:not(#z),
html body.light-theme #mobileFloatingBar:not(#y):not(#x):not(#w)>.th-on:not(#z) svg,
html body.light-theme #mobileFloatingBar:not(#y):not(#x):not(#w)>.th-on:not(#z) i{color:#059669!important}
/* title side follows the language: English = left (the page name), Arabic = right; the profile name goes to the other side */
html body #thGH[data-l="en"]:not(#z):not(#y) .ttl{left:16px!important;right:auto!important}
html body #thGH[data-l="en"]:not(#z):not(#y) .nm{left:auto!important;right:16px!important}
html body #thGH:not([data-l="en"]):not(#z):not(#y) .ttl{right:16px!important;left:auto!important}
html body #thGH:not([data-l="en"]):not(#z):not(#y) .nm{left:16px!important;right:auto!important}
/* the title slides in from the left, slowly and softly (no pop, no letter by letter) */
#thGH .ttl.thIn{animation:thTtlIn .9s cubic-bezier(.22,.8,.3,1) both}
@keyframes thTtlIn{from{opacity:0;transform:translateX(-38px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){#thGH .ttl.thIn{animation:none!important}}
/* the colour of the active button fills in slowly, together with the title coming in (no sudden switch) */
html body #mobileFloatingBar:not(#z):not(#y):not(#x)>[data-bk],
html body #mobileFloatingBar:not(#z):not(#y):not(#x)>[data-bk] svg,
html body #mobileFloatingBar:not(#z):not(#y):not(#x)>[data-bk] i,
html body #mobileFloatingBar:not(#z):not(#y):not(#x)>[data-bk] .thl,
html body #mobileFloatingBar:not(#z):not(#y):not(#x)>[data-bk] svg *{transition:color .9s ease,opacity .9s ease,stroke .9s ease,fill .9s ease,transform .18s cubic-bezier(.2,.9,.3,1.4)!important}
/* old brand / logo / header leftovers must not exist (they showed as blurred writing under the header) */
html body #thBrand,html body .thb-n,html body>[class*="logo"],html body>[id*="logo"],html body .thHdr:not(#thGH){display:none!important}`;
  document.head.appendChild(st);
  window.thRollTitle = function (te, text, l) {
    const d = l !== 'en' ? 'r' : 'l';
    if (te.dataset.full === text && te.dataset.d === d) return;
    te.dataset.full = text; te.dataset.d = d; te.dir = d === 'r' ? 'rtl' : 'ltr';
    te.textContent = text; te.classList.remove('thIn'); void te.offsetWidth; te.classList.add('thIn');
  };
})();

/* ==========================================================
   Bar icons: same line weight as the Home icon (1.7px), Time (was Days) a bit smaller, Messenger = paper plane, pen a bit bigger.
   Appended at the END of dashboard.js. Delete this block to go back.
   ========================================================== */
(function () {
  if (document.getElementById('thIconWeight')) return;
  const st = document.createElement('style'); st.id = 'thIconWeight';
  const B = 'html body #mobileFloatingBar:not(#z):not(#y):not(#x)';
  st.textContent = `
${B} #feedBtn .fstar{width:25px!important;height:25px!important}
${B} #feedBtn .fstar path{stroke-width:1.65!important;stroke-linejoin:round!important;stroke-linecap:round!important}
${B} #daysBtn>svg.dys{width:23px!important;height:23px!important}
${B} #daysBtn .dys .fr{stroke-width:2.1!important}
${B} #daysBtn .dys .rg{stroke-width:2.3!important}
${B} #daysBtn .dys text{font-weight:800!important;font-size:10.5px!important}
${B} #mgrBtn .mgr-ico{width:25px!important;height:25px!important;background:none!important;background-color:transparent!important;-webkit-mask:none!important;mask:none!important;display:block}
${B} #mgrBtn .mgr-ico svg.mgp{width:100%;height:100%;display:block;overflow:visible;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linejoin:round;stroke-linecap:round}
${B} #barEdit svg.plusout{width:25px!important;height:25px!important}
${B} #barEdit svg.plusout path{stroke-width:1.65!important}
${B} #spaceBtn svg.spco{width:28px!important;height:28px!important}
${B} #spaceBtn svg.spco *{stroke-width:1.5!important}`;
  document.head.appendChild(st);
  const PLANE = '<svg class="mgp" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 3.3 2.9 10.4c-.9.3-.9 1.5 0 1.8l4.6 1.6 1.8 5.5c.3.9 1.4 1 1.9.3l2.4-2.6 4.6 3.4c.7.5 1.6.1 1.8-.7L22.9 4.8c.2-1-.7-1.9-1.5-1.5z"/><path d="M7.6 13.8 17.4 7"/></svg>';
  function plane() { const i = document.querySelector('#mgrBtn .mgr-ico'); if (i && !i.querySelector('svg.mgp')) i.innerHTML = PLANE; }
  plane(); setInterval(plane, 700);
})();
