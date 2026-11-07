/* Thabit trainee dashboard: token -> Supabase RPC. No sheet, no direct table reads. */
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
const VIEW_BLOCK = ['trainee_check_item', 'trainee_set_task', 'trainee_raise_hand', 'trainee_send_request', 'trainee_notifications_read', 'trainee_mark_notifs_read', 'trainee_logout'];
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
  [0, S.max / 2, S.max].forEach(g => s += `<text class="tx" x="${L - 6}" y="${y(g) + o.f / 3}" text-anchor="end" font-size="${o.f}">${Math.round(g)}</text>`);
  S.bk.forEach((b, i) => { if (i % step === 0) s += `<text class="tx" x="${x(i)}" y="${H - 3}" text-anchor="middle" font-size="${o.f}">${b.label}</text>`; });
  keys.forEach(k => {
    const li = keys.indexOf(k);
    s += `<path class="ln ${k}" pathLength="1" style="--li:${li}${o.grad && k === 'avg' ? ';stroke:url(#thOvG)' : ''}" fill="none" stroke-width="${o.w}" d="${smooth(S.cum[k].map((v, i) => [x(i), y(v)]))}"/>`;
    if (k !== 'avg') S.bk.forEach((b, i) => { if (b.rows.some(r => r[k] != null && r[k] !== '')) { const cx = x(i), cy = y(S.cum[k][i]), at = `data-k="${k}" data-i="${i}" data-cx="${cx}" data-cy="${cy}"`;
      s += `<circle class="dot ${k}" style="--d:${(n < 2 ? 0 : i / (n - 1)).toFixed(3)};--li:${li}" cx="${cx}" cy="${cy}" r="${o.r}" ${at}/><circle class="dot hit" cx="${cx}" cy="${cy}" r="${o.hit}" ${at}/>`; } });
  });
  return s + '<line class="xh xv" style="display:none"/><line class="xh xz" style="display:none"/></svg>';
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
function rqLabels() {
  const t = rqT();
  $('rqLWhat').textContent = t.what; $('rqWhat').placeholder = t.whatPh; $('rqLMsg').textContent = t.msg;
  rqFollowUI(false);
}
function rqFollowUI(reset) {
  const t = rqT(), ty = $('rqType').value, c = $('rqFollow'), old = $('rqFollowVal'), keep = !reset && old && c.dataset.type === ty ? old.value : '';
  c.dataset.type = ty;
  const star = ' <b style="color:#f87171">*</b>';
  if (ty === 'financial') c.innerHTML = `<label class="rql">${t.fin}${star}</label><input type="date" id="rqFollowVal" min="${ymd(new Date())}" value="${keep}">`;
  else if (ty === 'session') c.innerHTML = `<label class="rql">${t.ses}${star}</label><select id="rqFollowVal"><option value="">—</option>${t.durs.map(d => `<option value="${d[0]}"${d[0] === keep ? ' selected' : ''}>${d[1]}</option>`).join('')}</select>`;
  else c.innerHTML = '';
}

function render() {

  thAutoApply();   // Today only when a session was taken today; otherwise This week (until the trainee picks something himself)
  const t = T[lang], all = D.rows, rows = CUR = all.filter(inRange), p = D.profile || {}, S = SER = series(rows);
  MD.length = 0; TK.length = 0;
  $('hello').textContent = t.hi + (p.trainee || ''); if (window.Thabit) Thabit.setProfile(p.trainee); $('kAccT').textContent = t.metrics;
  thRangeUI();
  { const last = rows.length ? rows[rows.length - 1].supply_date : '', n = $('rngNote');
    if (n) { n.hidden = range === 'today' || !last; n.textContent = (lang === 'en' ? 'Last day counted: ' : 'آخر يوم محسوب: ') + last; } }
  $('kpis').innerHTML = `<div class="thabit-card dcard" onclick="openSessions()" role="button" tabindex="0" style="display:flex;gap:14px;cursor:pointer"><div style="flex:1"><h4>${t.sessions} <i class="fa-solid fa-up-right-from-square" style="font-size:.75em;opacity:.55"></i></h4><div class="big">${rows.length}</div></div><div style="flex:1;border-inline-start:1px solid var(--border-color);padding-inline-start:14px"><h4>${t.duration}</h4><div class="big">${fmtDur(rows.reduce((a, r) => a + mins(r), 0))}</div></div></div>` + MET.map(k => kpi(k, rows, all, S)).join('');
  $('overall').innerHTML = overall(rows, S); thDetRefresh();
  $('lists').innerHTML = tasksCard() + itemsCard('dandana') + cap(all, 'notes', t.notes) + cap(all, 'tefl', 'TEFL') + cap(all, 'qol', 'QOL'); thListsApply();   // the time filter affects the charts only: Notes / TEFL / QOL always show everything
  ['Info', 'Req'].forEach(k => $('t' + k).textContent = t[k.toLowerCase()]);
  $('rqBtn').textContent = t.send; $('rqMsg').placeholder = t.ph; rqLabels();
  const L = all[all.length - 1], line = sessLine;
  const IF = [['status_as_of_today','Status'],['current_plan','Current plan'],['days_a_week','Days / week'],['session_time','Session time'],['place','Place'],['subscription','Subscription'],['due_date','Due date'],
    ['joining_date','Joined'],['first_session','First session'],['birth_date','Birth date'],['education_on_joining','Education on joining'],['schooling','Schooling'],['location','Location'],['residence_mostly','Residence'],
    ['first_thabit_scoring','First Thabit scoring'],['first_approved_english_test','First English test'],['first_psychological_approved_test','First psychological test'],['preferred_phone','Phone'],['preferred_email','Email']];
  $('info').innerHTML = line('Group', L && L.group_name) + IF.map(f => line(f[1], p[f[0]])).join('');
  $('rqList').innerHTML = (D.requests || []).map(r => `<div class="row"><span>${esc(r.message)}<br><span class="sm">${esc(r.type)} · ${esc(r.status)}</span></span><b>${esc(r.admin_reply || '')}</b></div>`).join('');
  renderSessions(rows);
  watchTodo();
  renderAvatar();
  requestAnimationFrame(fitCaps);
}
const fetchDone = () => rpc('trainee_done_tasks', { p_token: tok() }).then(a => Array.isArray(a) ? a : []).catch(() => []);
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
const itShown = x => { const k = itState(x).k; return k !== 'done' && (k !== 'closed' || itClosedToday(x)); };
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
const tlHtml = (p, d, s) => {
  const o = p && p.opens; if (!o || o.length < 2) return '';
  const a = o[0], span = o[o.length - 1] - a; if (!(span > 0)) return '';
  return `<div class="itt" dir="ltr">${o.map((t, j) => `<div class="ittp" style="left:${((t - a) / span * 100).toFixed(2)}%"><i class="${j < d ? 'on' : (j === d && s.k === 'open' ? 'nx' : '')}"></i><span class="${j % 2 ? 'lo2' : ''}">${fmtOpen(t)}</span></div>`).join('')}</div>`;
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

function itemRow(it) {
  const t = itT(), s = itState(it), p = it.plan, n = p ? p.n_eff : it.repeats, d = (it.checks || []).length;
  const ap = appSplit(it.body), atts = ap.app && Array.isArray(ap.app.l) ? ap.app.l.filter(a => a && attOk(a.u)) : [];
  const i = TK.push({ date: it.date, no: (it.kind === 'dandana' ? 100 : 0) + it.no, text: [it.title, it.badge, ap.text.replace(/\[([^\]\n]+)\]\(https?:\/\/[^\s)]+\)/g, '$1')].filter(Boolean).join(' - ') }) - 1;
  const icon = { done: 'fa-check', open: '', lock: 'fa-lock', wait: 'fa-hourglass-half', closed: 'fa-ban' }[s.k];
  const hi = it.priority === 'high' ? '<span class="hi">HIGH</span>' : '';
  const head = it.kind === 'dandana'
    ? `<b dir="ltr">${esc(it.title || '')}</b>${it.badge ? `<i class="itv"></i><span class="itar" dir="rtl">${esc(it.badge)}</span>` : ''}`
    : `<b dir="auto">${esc(it.title || '')}</b>${hi}${it.badge ? `<i class="itv"></i><span class="itbd" dir="auto">${esc(it.badge)}</span>` : ''}`;
  const dots = Array.from({ length: n }, (_, j) => `<i class="${j < d ? 'on' : (j === d && s.k === 'open' ? 'nx' : '')}"></i>`).join('<b></b>');
  const endAt = p && p.custom && p.range_end ? p.range_end : (p && p.deadline);   // range-based items show the end of the range
  const status = s.k === 'lock' ? `${t.opens} ${fmtOpen(s.o)}${p && p.estimated ? t.est : ''}` : s.k === 'open' ? t.ready : s.k === 'closed' ? closedText(it) : s.k === 'wait' ? t.waiting : '';
  return `<div class="itm"><button type="button" class="itc ${s.k}" ${s.k === 'open' ? `onclick="checkItem(${it.id})"` : 'disabled'} aria-label="check">${icon ? `<i class="fa-solid ${icon}"></i>` : ''}</button>`
    + `<div class="itb2"><div class="ith">${head}</div>${ap.text ? `<div class="itd rich">${rich(ap.text)}</div>` : ''}${appExtra(it, ap.app, atts, endAt)}`
    + (tlHtml(p, d, s) ? `<div class="itl2">${tlHtml(p, d, s)}<span class="sm">${d}/${n}</span></div>` : `<div class="itl">${dots}<span class="sm" style="margin-inline-start:8px">${d}/${n}</span></div>`)
    + `<div class="itg"><span style="width:${Math.round(100 * d / n)}%"></span></div>`
    + (status ? `<div class="its">${esc(status)}</div>` : '')
    + ((s.k === 'lock' || s.k === 'open') && p ? `<div class="its cd" data-dl="${endAt}">${cdHtml(endAt)}</div>` : '') + `</div>`
    + `<button type="button" class="hnd${HAND_NEW ? ' wv' : ''}" onclick="raiseHand(${i})" aria-label="Help">!</button></div>`;
}
const TKT = {
  en: { tasks: 'Tasks', urgent: 'Urgent', prev: 'Previous', log: 'Log', logT: 'Done tasks', none: 'Nothing here' },
  ar: { tasks: 'المهام', urgent: 'عاجل', prev: 'السابقة', log: 'السجل', logT: 'المهام المنجزة', none: 'لا يوجد شيء' },
  eg: { tasks: 'التاسكس', urgent: 'عاجل', prev: 'اللي فاتت', log: 'السجل', logT: 'التاسكس الخلصانة', none: 'مفيش حاجة' }
};
function tasksCard() {
  const t = TKT[lang] || TKT.en, its = (D.items || []).filter(x => x.kind === 'task');
  if (!its.length) return '';
  const today = itToday(), pend = its.filter(itShown);
  const urg = pend.filter(x => x.date === today || x.priority === 'high').sort((a, b) => (b.priority === 'high') - (a.priority === 'high') || b.date.localeCompare(a.date) || a.no - b.no);
  const prv = pend.filter(x => !(x.date === today || x.priority === 'high'));
  const group = list => { const by = {}; list.forEach(x => (by[x.date] = by[x.date] || []).push(x));
    return Object.keys(by).sort().reverse().map(dt => `<div class="it"><div class="dt">${dt}</div>${by[dt].sort((a, b) => a.no - b.no).map(itemRow).join('')}</div>`).join(''); };
  const sec = (cls, title, list) => `<div class="tkc ${cls}"><div class="tkt">${title}<b>${list.length || ''}</b></div>${list.length ? group(list) : `<div class="sm">${t.none}</div>`}</div>`;
  return `<div class="thabit-card dcard" id="taskCard">${holBanner()}<div class="tkh"><h4>${t.tasks}</h4><button type="button" class="logb" onclick="openLog()"><i class="fa-solid fa-clock-rotate-left"></i> ${t.log}</button></div>`
    + `<div class="tk2">${sec('urg', t.urgent, urg)}${sec('prv', t.prev, prv)}</div></div>`;
}
function openLog() {
  const t = TKT[lang] || TKT.en, t2 = itT(), fin = (D.items || []).filter(x => (x.kind === 'task' || x.kind === 'dandana') && ['done', 'closed'].includes(itState(x).k)).sort((a, b) => b.date.localeCompare(a.date) || a.no - b.no);
  $('logT').textContent = t.logT;
  $('logList').innerHTML = fin.length ? fin.map(x => `<div class="ssi" role="button" tabindex="0" style="cursor:pointer" onclick="openLogItem(${x.id})" onkeydown="if(event.key==='Enter')openLogItem(${x.id})"><div class="ssd"><b dir="auto">${esc(x.title || '')}</b><span>${esc(x.date)}</span><i>${(x.checks || []).length}/${x.plan ? x.plan.n_eff : x.repeats}</i></div>${x.badge ? `<div class="sst" dir="auto">${esc(x.badge)}</div>` : ''}<div class="sss"><span style="${itState(x).k === 'done' ? 'color:#34d399' : 'color:#fb7185'}">${itState(x).k === 'done' ? t2.done : t2.missed}</span>${x.kind === 'dandana' ? `<span>${esc(t2.dnd)}</span>` : ''}${itState(x).k === 'closed' ? `<span>${esc(closedText(x))}</span>` : ''}</div></div>`).join('') : `<div class="sm">${t.none}</div>`;
  $('logm').classList.add('open');
}
/* tap any finished / missed item in the log: its full details (text, attachments, dates, status) open in the pop-up */
function openLogItem(id) {
  const x = (D.items || []).find(i => i.id === id); if (!x) return;
  const t2 = itT(), s = itState(x), p = x.plan, n = p ? p.n_eff : x.repeats, d = (x.checks || []).length;
  const ap = appSplit(x.body), atts = ap.app && Array.isArray(ap.app.l) ? ap.app.l.filter(a => a && attOk(a.u)) : [];
  const endAt = p && p.custom && p.range_end ? p.range_end : (p && p.deadline);
  $('mdl').dataset.ear = ''; $('mT').textContent = x.title || '';
  $('mB').innerHTML = `<div class="sm" style="margin-bottom:8px">${esc(x.date)}${x.badge ? ' · <span dir="auto">' + esc(x.badge) + '</span>' : ''}</div>`
    + (ap.text ? `<div class="rich" dir="auto">${rich(ap.text)}</div>` : '')
    + appExtra(x, ap.app, atts, endAt)
    + `<div class="sss" style="margin-top:10px"><span style="${s.k === 'done' ? 'color:#34d399' : 'color:#fb7185'}">${s.k === 'done' ? t2.done : t2.missed}</span><span>${d}/${n}</span>${s.k === 'closed' ? `<span>${esc(closedText(x))}</span>` : ''}</div>`;
  $('mdl').classList.add('open');
}
function closeLog() { $('logm').classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLog(); });
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
  if (f && Array.isArray(f.items)) D.items = f.items;
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
  const task = (k, dn) => { const i = TK.push(k) - 1; return `<div class="tk${dn ? ' dn' : ''}"><input type="checkbox" ${dn ? 'checked' : ''} onchange="toggleTask(${i},this.checked)"><div class="tkb" dir="auto">${k.type || k.det ? `<div><b>${esc(k.type)}</b> <span class="sm">${esc(k.det)}</span></div>` : ''}<div>${esc(k.text)}</div></div><button type="button" class="hnd${HAND_NEW ? ' wv' : ''}" onclick="raiseHand(${i})" aria-label="Help">!</button></div>`; };
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
  const m = MD[i]; $('mdl').dataset.ear = m[2] && earOn(m[2]) ? '1' : ''; $('mT').textContent = m[0];
  $('mB').innerHTML = m[3] ? `<div class="rich">${m[3].map((x, n) => `<div class="cti" data-n="${n}"><div class="dt ctd">${esc(x.date)}</div>${richC(x.text)}</div>`).join('')}</div>` : `<div class="rich">${richC(m[1])}</div>`;
  $('mdl').classList.add('open');
  const box = document.querySelector('#mdl .mbox'), t = m[3] && focus ? $('mB').querySelector(`.cti[data-n="${focus}"]`) : null;
  box.scrollTop = t ? t.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 8 : 0;
}
function closeModal() { $('mdl').classList.remove('open'); }
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
  if (!d || !d.profile) { if (VIEW) { $('hello').textContent = lang === 'en' ? 'Could not open this trainee (view link expired). Close and open it again.' : 'تعذر فتح الطالب (انتهى الرابط). أغلق وافتحه من جديد.'; return; }
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    $('hello').innerHTML = `<a href="${PORTAL}" style="color:#fbbf24">${tok() === null ? 'Please log in from the portal first →' : 'Session not valid, log in again →'}</a>`;
    console.warn('Thabit dashboard: no valid session', d);
    if (location.protocol !== 'file:') setTimeout(() => { location.href = PORTAL; }, 2500);
    return; }
  d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0'))); applyPrefLang(d.profile); D = d; range = 'today'; D.done = await fetchDone(); D.notes = await fetchNotes(); D.bill = await fetchBill(); render(); try { initFloat(); } catch (e) { console.error('[feed]', e); try { chartsGo(); } catch (x) {} }
}



async function sendReq() {
  const t = rqT(), ty = $('rqType').value, what = $('rqWhat').value.trim(), det = $('rqMsg').value.trim(), fv = $('rqFollowVal') ? $('rqFollowVal').value : '';
  if (!what) { alert(t.needWhat); $('rqWhat').focus(); return; }
  if (!det) { alert(t.needMsg); $('rqMsg').focus(); return; }
  if (ty !== 'other' && !fv) { alert(t.need); $('rqFollowVal').focus(); return; }
  let tail = '';
  if (ty === 'financial') tail = `\n\n[PAYMENT DATE] ${fv}`;
  if (ty === 'session') { const d = RQT.en.durs.find(x => x[0] === fv); tail = `\n\n[EXPECTED DURATION] ${d ? d[1] : fv}`; }
  const msg = `[REQUEST] ${what}\n[DETAILS] ${det}${tail}`.slice(0, 2000);
  const ok = await rpc('trainee_send_request', { p_token: tok(), p_type: ty, p_message: msg });
  if (ok === true) { $('rqWhat').value = ''; $('rqMsg').value = ''; rqFollowUI(true); load(); }
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
function cairoNow() {
  const g = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).forEach(x => g[x.type] = +x.value);
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
  en: { money: 'Payment', system: 'System', note: 'Notification', update: 'Update', alert: 'Important', reply: 'Reply', tap: 'Tap to read', ok: 'Understood', thanks: 'Thank you' },
  ar: { money: 'المدفوعات', system: 'النظام', note: 'إشعار', update: 'تحديث', alert: 'مهم', reply: 'رد', tap: 'اضغط للقراءة', ok: 'فهمت', thanks: 'شكراً لك' },
  eg: { money: 'الفلوس', system: 'السيستم', note: 'إشعار', update: 'تحديث', alert: 'مهم', reply: 'رد', tap: 'دوس واقرا', ok: 'فهمت', thanks: 'شكراً ليك' }
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
function thn_nCard(key, cat, headHtml, bodyHtml, dt) {
  const c = thn_NCT();
  return { id: 'n:' + key, noX: true, cnt: true, isNew: true, cls: 'nf ' + cat,
    html: `<div class="nfh" role="button" tabindex="0"><span class="nfi ${cat}"><i class="fa-solid ${ THN_ICON[cat] || 'fa-bell' }"></i></span><div class="nfm"><div class="nfc">${c[cat]}</div><div class="nft2">${c.tap}</div></div><span class="nfd">${esc(dt)}</span><i class="fa-solid fa-chevron-down nfv"></i></div>`
      + `<div class="nfb" hidden>${headHtml ? `<div class="nth" dir="auto">${headHtml}</div>` : ''}<div class="rich" dir="auto">${bodyHtml}</div><button type="button" class="ackb btn2">${c.ok}</button></div>` };
}
function thn_toggleNf(pc) {
  const on = !pc.classList.contains('open'); pc.classList.toggle('open', on); pc.querySelector('.nfb').hidden = !on;
  if (on) thn_openedSet(pc.dataset.cid.slice(2));
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
function thn_noteList() {
  const now = Date.now();
  return ((D && D.notes) || []).filter(n => !WORD_KINDS.includes(n.kind) && !n.read_at && !thn_isAcked(thn_nKey(n)) && !(now - Date.parse(n.created_at) >= 864e5))
    .slice().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}
function thn_noteCardN(n) {
  const loc = lang === 'en' ? 'en-GB' : 'ar-EG', x = noteText(n); let dt = '';
  try { dt = new Date(n.created_at).toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) {}
  return thn_nCard(thn_nKey(n), noteCat(n), x.h, x.b, dt);
}
(function () { const st = document.createElement('style'); st.textContent = `
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
  return [...(s ? [nextCard(s)] : []), ...nts];   // the feed holds ONLY the next session + notifications (Dandana / Assistant words are not here); only notification cards (cnt) are counted
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
const impUnread = () => thn_noteList().filter(n => isImp(n) && !IMP_SEEN.has(impKey(n)));
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
    if (cur) { mins.push(cur); }                         // the one that was open becomes a tab
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
    mins.push(cur); cur = null; $('asm').hidden = true; lock(false); dock();
    if (mins.includes('assistant')) nudge();
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
    { html: '<i class="fa-solid fa-user"></i>', title: ar ? 'ملفي' : 'Profile', label: ar ? 'ملفي' : 'Profile', on: () => Panels.open('profile') },
    { html: '<i class="fa-solid fa-right-from-bracket" style="color:#f43f5e"></i>', title: ar ? 'تسجيل الخروج' : 'Log out', label: ar ? 'تسجيل الخروج' : 'Log out', on: () => window.logout && window.logout() }
  ]);
}
function setView(v) { try { localStorage.setItem('thabit_view', v); } catch (e) {} try { (window.top || window).location.reload(); } catch (e) { location.reload(); } }
function viewSubList() {
  const ar = lang !== 'en', wide = innerWidth > 700, U = UIT[lang] || UIT.en;
  return [
    { html: wide ? '<i class="fa-solid fa-mobile-screen"></i>' : '<i class="fa-solid fa-desktop"></i>', title: wide ? (ar ? 'شكل التليفون' : 'Phone view') : (ar ? 'شكل الديسكتوب' : 'Desktop view'), on: () => setView(wide ? 'phone' : 'desktop') },
    { html: '<i class="fa-solid fa-text-height"></i>', title: U.zoom, keep: 1, on: () => startAdjust('zoom') },
    { html: '<i class="fa-solid fa-sun"></i>', title: U.bri, keep: 1, on: () => startAdjust('bri') }
  ];
}
function openStar(btn) {
  const ar = lang !== 'en';
  pickOpen(btn || $('barEdit'), [
    { html: '<i class="fa-solid fa-pen"></i>', title: ar ? 'تخصيص' : 'Customize', sub: () => ({ key: 'cust', list: barSubList() }) },
    { html: '<i class="fa-solid fa-eye"></i>', title: ar ? 'العرض' : 'View', sub: () => ({ key: 'view', list: viewSubList() }) }
  ]);
}
function openPlus(btn) {
  const ar = lang !== 'en';
  pickOpen(btn || $('plusBtn'), [
    { html: '<span class="plA">' + ASSIST_SVG_SM + '</span>', title: ar ? 'المساعد' : 'Assistant', label: ar ? 'المساعد' : 'Assistant', on: () => Panels.open('assistant') },
    { html: '<span class="plS"><i class="fa-solid fa-paper-plane"></i></span>', title: ar ? 'إرسال طلب' : 'Send request', label: ar ? 'إرسال طلب' : 'Send request', on: () => openRq() }
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
const THB_BAR_DEF = ['reload', 'assist', 'lang', 'theme', 'logout', 'feed'];
function barOrder() {
  let o = []; try { o = JSON.parse(localStorage.getItem('thabit_bar_order') || '[]'); } catch (e) {}
  o = (Array.isArray(o) ? o : []).filter(k => THB_BAR_DEF.includes(k)); THB_BAR_DEF.forEach(k => { if (!o.includes(k)) o.push(k); }); return o;
}
function layoutBar() {
  const bar = $('mobileFloatingBar'), els = {}, edit = $('barEdit');
  bar.querySelectorAll(':scope > [data-bk]').forEach(e => els[e.dataset.bk] = e);
  bar.querySelectorAll(':scope > .bar-divider').forEach(d => d.remove());
  const list = barOrder().map(k => els[k]).filter(e => e && !e.hidden);
  list.forEach((e, i) => { bar.appendChild(e); if (i < list.length - 1) { const d = document.createElement('div'); d.className = 'bar-divider'; bar.appendChild(d); } });
  const d = document.createElement('div'); d.className = 'bar-divider'; bar.appendChild(d); bar.appendChild(edit);
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
    it.style.transform = '';
    const sib = items().filter(x => x !== it); let before = 0;
    sib.forEach(x => { if (ctr(x, ax) < p) before++; });
    const di = drag.rev ? sib.length - before : before;
    if (sib.length) { const ref = di < sib.length ? sib[di] : sib[sib.length - 1].nextSibling; if (it.nextSibling !== ref && it !== ref) bar.insertBefore(it, ref); }
    const d = p - ctr(it, ax);
    it.style.transform = (ax === 'x' ? 'translateX(' : 'translateY(') + d + 'px) scale(1.15)';
  }
  function end() {
    clearTimeout(timer);
    if (!drag) return;
    const it = drag.it; drag = null;
    it.style.transform = ''; it.classList.remove('lifting'); bar.classList.remove('dragging');
    try { localStorage.setItem('thabit_bar_order', JSON.stringify(items().map(x => x.dataset.bk))); } catch (e) {}
    layoutBar(); swallow = true; setTimeout(() => { swallow = false; }, 400);
  }
  bar.addEventListener('pointerdown', e => {
    const it = e.target.closest && e.target.closest('[data-bk]'); if (!it || it.parentNode !== bar) return;
    sx = e.clientX; sy = e.clientY; clearTimeout(timer); timer = setTimeout(() => begin(it, e), 450);
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
function openRq() { const m = $('rqm'); if (!m) return; const t = $('tReq'); if (t) $('rqmT').textContent = t.textContent; m.classList.add('open'); }
function closeRq() { const m = $('rqm'); if (m) m.classList.remove('open'); }
window.openRq = openRq; window.closeRq = closeRq;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeRq(); });

/* ===== Touch = scroll. A finger that moves is a scroll, never a click: only a real tap or a long press (finger stays still) can act ===== */
(function () {
  let sx = 0, sy = 0, moved = false;
  document.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; moved = false; }, { passive: true, capture: true });
  document.addEventListener('touchmove', e => { if (moved) return; const t = e.touches[0]; if (Math.abs(t.clientX - sx) > 8 || Math.abs(t.clientY - sy) > 8) moved = true; }, { passive: true, capture: true });
  document.addEventListener('click', e => { if (moved && e.isTrusted) { e.stopImmediatePropagation(); e.preventDefault(); } moved = false; }, true);
})();


/* ===== Ghost: hides / shows the side bar. Sits low on the right, away from the phone's back / home gestures and the feed button ===== */
(function () {
  const bar = $('mobileFloatingBar'); if (!bar) return;
  const st = document.createElement('style');
  st.textContent = '#thGhost{position:fixed;left:auto;right:10px;top:60%;width:24px;height:27px;padding:0;border:0;background:none;z-index:65;cursor:pointer;touch-action:none;-webkit-tap-highlight-color:transparent;filter:drop-shadow(0 3px 7px rgba(0,0,0,.5));animation:ghFloat 3.2s ease-in-out infinite;transition:filter .3s}#thGhost svg{display:block;width:100%;height:100%}@keyframes ghFloat{50%{transform:translateY(-4px)}}@media(prefers-reduced-motion:reduce){#thGhost{animation:none}}';
  document.head.appendChild(st);
  const g = document.createElement('button'); g.type = 'button'; g.id = 'thGhost'; g.setAttribute('aria-label', 'Toggle menu');
  g.innerHTML = '<svg viewBox="0 0 32 36" aria-hidden="true"><defs><filter id="thEyeGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M16 2C8.5 2 4 8 4 16v16l4.4-3.4L12 32l4-3.4 4 3.4 3.6-3.4L28 32V16C28 8 23.5 2 16 2z" fill="#fff" stroke="rgba(0,0,0,.28)" stroke-width="1"/><ellipse cx="12" cy="15" rx="2.1" ry="3" fill="#111"/><ellipse cx="20" cy="15" rx="2.1" ry="3" fill="#111"/></svg>';
  document.body.appendChild(g);
  /* position: left or right edge only, any height except the bottom strip (phone gestures live there). Long-press + drag to move. */
  const GK = 'thabit_ghost_pos', GH = 27, GW = 24;
  /* lowest the ghost may sit = the same bottom line the bar uses (16px + the phone's safe area), so it never goes below the bar */
  const BOT = () => { const p = document.createElement('div'); p.style.cssText = 'position:fixed;bottom:0;left:0;height:env(safe-area-inset-bottom,0px);visibility:hidden;pointer-events:none'; document.body.appendChild(p); const h = p.offsetHeight; p.remove(); return 16 + h; };
  const GM = { en: "The ghost can't go lower than the bar.", ar: 'لا يمكن إنزال الشبح أسفل من مستوى الشريط.', eg: 'ما ينفعش تنزّل الشبح أنزل من مستوى الشريط.' };
  const gget = () => { try { const o = JSON.parse(localStorage.getItem(GK) || 'null'); if (o && (o.s === 'l' || o.s === 'r') && isFinite(o.y)) return o; } catch (e) {} return null; };
  const gplace = o => {
    o = o || gget() || { s: 'r', y: innerHeight - 190 };
    const k = thK(), y = Math.max(10, Math.min(innerHeight - BOT() - GH * k, o.y));
    g.style.top = y / k + 'px'; g.style.bottom = 'auto';
    if (o.s === 'l') { g.style.left = '10px'; g.style.right = 'auto'; } else { g.style.right = '10px'; g.style.left = 'auto'; }
    return { s: o.s, y };
  };
  gplace(); window.addEventListener('resize', () => gplace());
  let lp = null, drag = null, dragMoved = false;
  function endGhostDrag() {
    const d = drag; drag = null; g.classList.remove('drag'); if (!d) return;
    const r = g.getBoundingClientRect();
    if (r.bottom > innerHeight - BOT() + 2) { itToast(GM[lang] || GM.en); gplace(d.prev); return; }
    const o = { s: (r.left + r.width / 2) < innerWidth / 2 ? 'l' : 'r', y: r.top };
    try { localStorage.setItem(GK, JSON.stringify(o)); } catch (e) {}
    gplace(o);
  }
  let anim = null, hid = false;
  const reduce = () => window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  const save = () => { try { localStorage.setItem('thabit_bar_hid', hid ? '1' : '0'); } catch (e) {} };
  const mid = r => [r.left + r.width / 2, r.top + r.height / 2];
  const rootEl = document.documentElement;
  function hideBar(now) {
    if (hid) return; hid = true; save(); rootEl.classList.add('bar-hid'); if (typeof closeLang === 'function') closeLang();
    if (anim) { anim.cancel(); anim = null; }
    const fin = () => { if (hid) { bar.hidden = true; g.classList.add('on'); } };   // only now do the ghost's eyes light up
    if (now || reduce() || !bar.animate) { fin(); return; }
    anim = bar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: 'ease-out', fill: 'forwards' });
    anim.onfinish = () => { fin(); if (anim) { anim.cancel(); anim = null; } };
  }
  function showBar() {
    if (!hid) return; hid = false; save(); g.classList.remove('on'); rootEl.classList.remove('bar-hid');
    if (anim) { anim.cancel(); anim = null; }
    bar.hidden = false;
    if (reduce() || !bar.animate) return;
    anim = bar.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out' });
    anim.onfinish = () => { anim = null; };
  }
  /* a tap toggles; while the bar is hidden, the first drag that starts on the ghost brings it straight back */
  let sx = 0, sy = 0, down = false, swiped = false;
  g.addEventListener('pointerdown', e => {
    sx = e.clientX; sy = e.clientY; down = true; swiped = false; dragMoved = false; clearTimeout(lp);
    const r = g.getBoundingClientRect();
    lp = setTimeout(() => { if (!down) return; drag = { dx: sx - r.left, dy: sy - r.top, prev: gplace(gget() || { s: (r.left + r.width / 2) < innerWidth / 2 ? 'l' : 'r', y: r.top }) }; dragMoved = true; g.classList.add('drag'); try { g.setPointerCapture(e.pointerId); } catch (x) {} try { navigator.vibrate && navigator.vibrate(12); } catch (x) {} }, 380);
  });
  g.addEventListener('pointermove', e => {
    if (drag) { const k = thK(); g.style.left = Math.max(4, Math.min(innerWidth - GW * k - 4, e.clientX - drag.dx)) / k + 'px'; g.style.right = 'auto'; g.style.top = Math.max(4, Math.min(innerHeight - GH * k - 4, e.clientY - drag.dy)) / k + 'px'; return; }
    if (down && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) clearTimeout(lp);
    if (!down || swiped || !hid) return; if (Math.hypot(e.clientX - sx, e.clientY - sy) > 10) { swiped = true; showBar(); } });
  ['pointerup', 'pointercancel'].forEach(ev => g.addEventListener(ev, () => { down = false; clearTimeout(lp); endGhostDrag(); }));
  g.addEventListener('click', e => { e.stopPropagation(); if (dragMoved) { dragMoved = false; return; } if (swiped) { swiped = false; return; } hid ? showBar() : hideBar(); });
  try { if (localStorage.getItem('thabit_bar_hid') === '1') hideBar(true); } catch (e) {}
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


/* ===== Ghost: eyes light up in the Feed colours while the bar is tucked inside it ===== */
(function () { const st = document.createElement('style'); st.textContent = `
#thGhost.drag{animation:none!important;transform:scale(1.18);filter:drop-shadow(0 8px 16px rgba(0,0,0,.55))!important}
#thGhost.on{animation:ghFloat 3.2s ease-in-out infinite}
#thGhost.on ellipse{animation:ghEye 2.4s linear infinite;filter:url(#thEyeGlow)}
@keyframes ghEye{0%,100%{fill:#ff5d55}25%{fill:#4c8dff}50%{fill:#22d3a6}75%{fill:#ffc247}}
@keyframes ghGlow{0%,100%{filter:drop-shadow(0 0 8px #ff5d55)}25%{filter:drop-shadow(0 0 8px #4c8dff)}50%{filter:drop-shadow(0 0 8px #22d3a6)}75%{filter:drop-shadow(0 0 8px #ffc247)}}
@media(prefers-reduced-motion:reduce){#thGhost.on,#thGhost.on ellipse{animation:none}#thGhost.on ellipse{fill:#22d3a6}}`; document.head.appendChild(st); })();

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
  if (key === 'plus') return [t3('The Assistant: listen to words and send what you are missing', 'المساعد: استمع إلى الكلمات وأرسل ما ينقصك', 'المساعد: تسمع منه الكلمات وتبعتله اللي ناقصك'), t3('Send a request to your trainer: session time, payments or anything else', 'أرسل طلبًا إلى المدرب: موعد الجلسة أو المدفوعات أو غير ذلك', 'ابعت طلب للمدرب: معاد السيشن أو الفلوس أو أي حاجة تانية')];
  if (key === 'star') return [t3('Customize: move the bar to the left, right, bottom or anywhere you like', 'تخصيص: انقل الشريط لليسار أو اليمين أو الأسفل أو أي مكان تريده', 'تخصيص: انقل الشريط شمال أو يمين أو تحت أو أي مكان تحبه'), t3('View: phone / desktop view, text and icon size, and brightness', 'العرض: شكل التليفون أو الديسكتوب، وحجم الأيقونات والخطوط، والسطوع', 'العرض: شكل التليفون أو الديسكتوب، وحجم الأيقونات والخط، والسطوع')];
  if (key === 'view') { const wide = innerWidth > 700; return [wide ? t3('Phone view: shows the site the way it looks on a phone', 'شكل التليفون: يعرض الموقع كما يظهر على الهاتف', 'شكل التليفون: بيعرض الموقع زي ما بيبان على التليفون') : t3('Desktop view: shows the full desktop layout (the bar stays big)', 'شكل الديسكتوب: يعرض التصميم الكامل للكمبيوتر (ويبقى الشريط كبيرًا)', 'شكل الديسكتوب: بيعرض التصميم الكامل بتاع الكمبيوتر (والشريط بيفضل كبير)'), t3('Text & icon size: make everything bigger or smaller and watch it live', 'حجم الأيقونات والخطوط: كبّر كل شيء أو صغّره وشاهد النتيجة مباشرة', 'حجم الأيقونات والخط: كبّر أو صغّر كل حاجة وشوف النتيجة على طول'), t3('Brightness of this app only (not your phone)', 'سطوع هذا التطبيق فقط (وليس هاتفك)', 'سطوع التطبيق ده بس (مش سطوع تليفونك)')]; }
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
const uiGet = () => { try { const o = JSON.parse(localStorage.getItem(UI_KEY) || 'null') || {}; return { zoom: isFinite(o.zoom) ? +o.zoom : 1, bri: isFinite(o.bri) ? +o.bri : 1 }; } catch (e) { return Object.assign({}, UI_DEF); } };
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
  wrap.appendChild(s1); s1.appendChild(rr); s1.appendChild(ov);
  const ar = document.createElement('button'); ar.type = 'button'; ar.id = 'thArrow'; ar.className = 'tharr'; ar.innerHTML = '<svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><g class="pq"><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" fill="none" stroke="#fbbf24" stroke-width="1.6"/><path d="M17.25 15.6v3.8M15.35 17.5h3.8" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round"/></g></svg>'; ar.setAttribute('aria-label', (thRX[lang] || thRX.en).more);
  ar.addEventListener('click', () => thDetOpen()); s1.appendChild(ar);
  const l2 = document.createElement('div'); l2.className = 'grid'; l2.id = 'lists2'; s3.appendChild(l2); wrap.appendChild(s3);
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
const THL_KEYS = ['notes', 'tefl', 'qol'];
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

dashvoicenote.js
