/* Thabit trainee dashboard: token -> Supabase RPC. No sheet, no direct table reads. */
const SB = "https://vkfexceitwjmxncwceqb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
const TOKEN_KEY = 'thabit_trainee_token', PORTAL = 'index.html';
const T = {
  en: { hi: 'Welcome, ', today: 'Today', week: '7 days', month: '30 days', all: 'Since start', last: 'Last session', info: 'My info', req: 'Send a request', hist: 'Sessions', send: 'Send', sessions: 'Sessions',
        performance: 'Performance', attitude: 'Attitude', soft_skills: 'Soft skills', tefl: 'TEFL', qol: 'QOL', none: 'No data yet', ph: 'Write your request...', overall: 'Overall progress', avg: 'Average', tap: 'Tap a dot to see why', revision: 'Revision', compliance: 'Compliance', attendance: 'Attendance', metrics: 'Scores & details', todo: 'To-Do', donet: 'Done tasks', alldone: 'All caught up ✓', handtip: 'Not sure about a task? Tap the ! next to it and tell me.', handq: 'What is unclear about this task?', sent: 'Sent ✓', fail: 'Could not send, try again', year: 'Year', duration: 'Time in program', subs: 'Sessions & sub titles', notes: 'Notes' },
  ar: { hi: 'أهلاً ', today: 'اليوم', week: '٧ أيام', month: '٣٠ يوم', all: 'منذ البداية', last: 'آخر جلسة', info: 'بياناتي', req: 'إرسال طلب', hist: 'الجلسات', send: 'إرسال', sessions: 'الجلسات',
        performance: 'الأداء', attitude: 'السلوك', soft_skills: 'المهارات الشخصية', tefl: 'TEFL', qol: 'QOL', none: 'لا توجد بيانات بعد', ph: 'اكتب طلبك...', overall: 'التقدم العام', avg: 'المتوسط', tap: 'اضغط على نقطة لمعرفة السبب', revision: 'المراجعة', compliance: 'الالتزام', attendance: 'الحضور', metrics: 'الأرقام والتفاصيل', todo: 'المهام', donet: 'المهام المنتهية', alldone: 'خلصت كل المهام ✓', handtip: 'مش فاهم تاسك؟ اضغط على ! اللي جنبها وقولي.', handq: 'إيه اللي مش واضح في التاسك دي؟', sent: 'اتبعت ✓', fail: 'ما اتبعتش، حاول تاني', year: 'سنة', duration: 'وقت البرنامج', subs: 'الجلسات والعناوين', notes: 'ملاحظات' },
};
T.eg = Object.assign({}, T.ar, { hi: 'أهلاً يا ', last: 'آخر جلسة ليك' });
let D = null, range = 'week', lang = 'en', CUR = [], SER = null;
const $ = id => document.getElementById(id);
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
  const d = new Date(r.supply_date + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0);
  const days = Math.round((n - d) / 864e5);
  return range === 'today' ? days === 0 : days >= 0 && days < ({ week: 7, month: 30, year: 365 })[range];
}
function spark(vals) {
  if (vals.length < 2) return '';
  const mn = Math.min(...vals), mx = Math.max(...vals), sp = (mx - mn) || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 300},${60 - ((v - mn) / sp) * 50}`).join(' ');
  return `<svg class="ch" viewBox="0 0 300 70" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
const MET = ['performance', 'attitude', 'soft_skills', 'compliance', 'attendance'];
const MD = [], TK = [], mk = (title, text) => MD.push([title, text]) - 1;
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
  if (range === 'all') { if (rows.length) { st = new Date(rows[0].supply_date + 'T00:00:00'); const l = new Date(rows[rows.length - 1].supply_date + 'T00:00:00'); if (l > en) en = l; } }
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
  const t = T[lang], all = D.rows, rows = CUR = all.filter(inRange), p = D.profile || {}, S = SER = series(rows);
  MD.length = 0; TK.length = 0;
  $('hello').textContent = t.hi + (p.trainee || ''); if (window.Thabit) Thabit.setProfile(p.trainee); $('kAccT').textContent = t.metrics;
  $('rng').innerHTML = ['today', 'week', 'month', 'year', 'all'].map(k => `<button class="${k === range ? 'on' : ''}" onclick="range='${k}';render()">${t[k]}</button>`).join('');
  $('kpis').innerHTML = `<div class="thabit-card dcard" onclick="openSessions()" role="button" tabindex="0" style="display:flex;gap:14px;cursor:pointer"><div style="flex:1"><h4>${t.sessions} <i class="fa-solid fa-up-right-from-square" style="font-size:.75em;opacity:.55"></i></h4><div class="big">${rows.length}</div></div><div style="flex:1;border-inline-start:1px solid var(--border-color);padding-inline-start:14px"><h4>${t.duration}</h4><div class="big">${fmtDur(rows.reduce((a, r) => a + mins(r), 0))}</div></div></div>` + MET.map(k => kpi(k, rows, all, S)).join('');
  $('overall').innerHTML = overall(rows, S);
  $('lists').innerHTML = tasksCard() + itemsCard('dandana') + cap(rows, 'notes', t.notes) + cap(rows, 'tefl', 'TEFL') + cap(rows, 'qol', 'QOL');
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
}
const fetchDone = () => rpc('trainee_done_tasks', { p_token: tok() }).then(a => Array.isArray(a) ? a : []).catch(() => []);
const cap = (rows, key, title) => {
  const it = rows.slice().reverse().filter(r => r[key]).map(r => `<button type="button" class="cap" onclick="openModal(${mk(r.supply_date + ' · ' + title, r[key])})"><span class="dt">${r.supply_date}</span><span dir="auto">${esc(rtStrip(String(r[key])).replace(/\s+/g, ' ').slice(0, 70))}</span></button>`).join('');
  return `<div class="thabit-card dcard"><h4>${title}</h4><div class="lst">${it || `<div class="sm">${T[lang].none}</div>`}</div></div>`;
};
/* ===== Rich notes: 1. / a. = related ideas, "-" = separate points, blank line = new capsule ===== */
const escv = s => (window.ThabitRich ? ThabitRich.inline(esc(s)) : esc(s)).replace(/(<[^>]+>)|\s*\|\s*/g, (m, tag) => tag ? tag : '<i class="vb"></i>');   // markers first, then "|" -> divider (never inside a tag)
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

function itemRow(it) {
  const t = itT(), s = itState(it), p = it.plan, n = p ? p.n_eff : it.repeats, d = (it.checks || []).length;
  const i = TK.push({ date: it.date, no: (it.kind === 'dandana' ? 100 : 0) + it.no, text: [it.title, it.badge, it.body].filter(Boolean).join(' - ') }) - 1;
  const icon = { done: 'fa-check', open: '', lock: 'fa-lock', wait: 'fa-hourglass-half', closed: 'fa-ban' }[s.k];
  const hi = it.priority === 'high' ? '<span class="hi">HIGH</span>' : '';
  const head = it.kind === 'dandana'
    ? `<b dir="ltr">${esc(it.title || '')}</b>${it.badge ? `<i class="itv"></i><span class="itar" dir="rtl">${esc(it.badge)}</span>` : ''}`
    : `<b dir="auto">${esc(it.title || '')}</b>${hi}${it.badge ? `<i class="itv"></i><span class="itbd" dir="auto">${esc(it.badge)}</span>` : ''}`;
  const dots = Array.from({ length: n }, (_, j) => `<i class="${j < d ? 'on' : (j === d && s.k === 'open' ? 'nx' : '')}"></i>`).join('<b></b>');
  const endAt = p && p.custom && p.range_end ? p.range_end : (p && p.deadline);   // range-based items show the end of the range
  const status = s.k === 'lock' ? `${t.opens} ${fmtOpen(s.o)}${p && p.estimated ? t.est : ''}` : s.k === 'open' ? t.ready : s.k === 'closed' ? closedText(it) : s.k === 'wait' ? t.waiting : '';
  return `<div class="itm"><button type="button" class="itc ${s.k}" ${s.k === 'open' ? `onclick="checkItem(${it.id})"` : 'disabled'} aria-label="check">${icon ? `<i class="fa-solid ${icon}"></i>` : ''}</button>`
    + `<div class="itb2"><div class="ith">${head}</div>${it.body ? `<div class="itd rich">${rich(it.body)}</div>` : ''}`
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
  const t = TKT[lang] || TKT.en, t2 = itT(), fin = (D.items || []).filter(x => x.kind === 'task' && ['done', 'closed'].includes(itState(x).k)).sort((a, b) => b.date.localeCompare(a.date) || a.no - b.no);
  $('logT').textContent = t.logT;
  $('logList').innerHTML = fin.length ? fin.map(x => `<div class="ssi"><div class="ssd"><b dir="auto">${esc(x.title || '')}</b><span>${esc(x.date)}</span><i>${(x.checks || []).length}/${x.plan ? x.plan.n_eff : x.repeats}</i></div>${x.badge ? `<div class="sst" dir="auto">${esc(x.badge)}</div>` : ''}<div class="sss"><span style="${itState(x).k === 'done' ? 'color:#34d399' : 'color:#fb7185'}">${itState(x).k === 'done' ? t2.done : t2.missed}</span>${itState(x).k === 'closed' ? `<span>${esc(closedText(x))}</span>` : ''}</div></div>`).join('') : `<div class="sm">${t.none}</div>`;
  $('logm').classList.add('open');
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
function openModal(i) { $('mT').textContent = MD[i][0]; $('mB').innerHTML = `<div class="rich">${richC(MD[i][1])}</div>`; $('mdl').classList.add('open'); }
function closeModal() { $('mdl').classList.remove('open'); }
function raiseHand(i) {
  const k = TK[i], t = T[lang]; HAND_NEW = false; try { localStorage.setItem('thabit_hand_seen', '1'); } catch (e) {}
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
  const d = tok() ? await rpc('trainee_dashboard', { p_token: tok() }).catch(() => null) : null;
  if (!d || !d.profile) { if (VIEW) { $('hello').textContent = lang === 'en' ? 'Could not open this trainee (view link expired). Close and open it again.' : 'تعذر فتح الطالب (انتهى الرابط). أغلق وافتحه من جديد.'; return; }
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    $('hello').innerHTML = `<a href="${PORTAL}" style="color:#fbbf24">${tok() === null ? 'Please log in from the portal first →' : 'Session not valid, log in again →'}</a>`;
    console.warn('Thabit dashboard: no valid session', d);
    if (location.protocol !== 'file:') setTimeout(() => { location.href = PORTAL; }, 2500);
    return; }
  d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0'))); applyPrefLang(d.profile); D = d; D.done = await fetchDone(); D.notes = await fetchNotes(); D.bill = await fetchBill(); render(); try { initFloat(); } catch (e) { console.error('[feed]', e); try { chartsGo(); } catch (x) {} }
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
function nextCard(s) {
  const t = TX(), when = s.n === 1 ? t.tom(fmtT(s.sc)) : t.inD(s.n, fmtT(s.sc));
  if (s.st === 'count') return { id: 'nxt', noX: true, isNew: false, html: `<h3>${t.nxt}</h3><div>${t.startsIn}</div><div class="cdn cd" data-t="${s.nxt}">--:--:--</div>` };
  return { id: 'nxt', noX: true, isNew: false, cls: s.st === 'off' ? 'rest' : '', html: `<h3>${t.nxt}</h3>${s.st === 'off' ? `<div class="cdn">${t.rip}</div>` : ''}<div>${when}</div>` };
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
  if (!win && !past) return null;
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
const billNew = () => { try { return localStorage.getItem('thabit_bill_read') !== itToday(); } catch (e) { return false; } };
function billCard(s) {
  const t = NT(), fmt = v => String(v), due = billDue(), left = billLeft();
  return { id: 'bill', cls: 'bill', isNew: billNew(), html: `<h3>${t.billT}</h3><div class="billb" dir="auto">${s.past > 0 ? t.past(fmt(s.past), fmt(s.total), fmt(s.sub), due) : t.tot(fmt(s.sub), due)}</div>`
    + (left <= 2 ? `<div class="billl" dir="auto"><i class="fa-regular fa-clock"></i> ${t.left(left)}</div>` : '') };
}
function noteText(n) {
  const t = NT(), m = n.meta || {};
  if (n.kind === 'word_ready') return { h: '', b: esc(t.word(m.word || '')) };
  if (n.kind === 'request_reply') return { h: esc(t.reply), b: m.reply ? richC(m.reply) : '' };
  return { h: esc(n.title || t.msg), b: richC(n.body || '') };
}
function notesCard(list, unreadOnly) {
  const t = NT(), loc = lang === 'en' ? 'en-GB' : 'ar-EG';
  const items = list.slice(0, 8).map(n => { const x = noteText(n); let dt = ''; try { dt = new Date(n.created_at).toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) {}
    return `<div class="nt${n.read_at ? '' : ' un'}"><div class="dt">${esc(dt)}</div>${x.h ? `<div class="nth" dir="auto">${x.h}</div>` : ''}<div class="rich" dir="auto">${x.b}</div></div>`; }).join('');
  return { id: 'notes', isNew: list.some(n => !n.read_at), html: `<h3>${t.notes}</h3><div class="ntl">${items}</div>` };
}
const cairoDay = iso => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date(iso)); } catch (e) { return ''; } };
const WORD_KINDS = ['assistant_words', 'word_ready'];

/* Order: Next session first, then the cards with something new, then the rest. Each card = ONE notification (badge counts cards, not messages). */
function feedCards() {
  const s = nxState(), d = dndState(), bs = billState(), as = asCard(), rest = [];
  const notes = ((D && D.notes) || []).filter(n => !WORD_KINDS.includes(n.kind));
  if (as) rest.push(as);
  if (d) rest.push(dndCard(d));
  if (notes.length) rest.push(notesCard(notes));
  if (bs) rest.push(billCard(bs));
  return [...(s ? [nextCard(s)] : []), ...rest.filter(c => c.isNew), ...rest.filter(c => !c.isNew)];
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
const feedCount = () => feedCards().filter(c => c.noX || c.isNew).length;


function updateFeed() {
  const btn = $('feedBtn'), cards = feedCards(), n = cards.filter(c => c.noX || c.isNew).length, bd = $('feedBadge'), fn = $('feedNum');
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
    if (c.length) openPop(c, btn); else { INTRO.hold = false; updateFeed(); chartsGo(); }
  }, 1150);
}
function refreshNotes() {
  if (!D || INTRO.hold) return Promise.resolve();
  const before = feedCount();
  return fetchNotes().then(list => { D.notes = list; updateFeed(); if (feedCount() > before) glowFeed(); });
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
    $('dock').innerHTML = mins.map(id => `<div class="aswrap"><button type="button" class="dk" data-p="${id}" style="background:${DEF[id].color}" aria-label="${TTL[id][L()]}" title="${TTL[id][L()]}">${DEF[id].svg || `<i class="fa-solid ${DEF[id].icon}"></i>`}</button><span class="dkx" data-x="${id}" role="button" tabindex="0" aria-label="Close" title="Close">×</span>${id === 'assistant' ? '<div class="asn" id="asNudge" role="button" tabindex="0" hidden></div>' : ''}</div>`).join('');
    $('dock').querySelectorAll('.dk').forEach(b => b.onclick = e => open(b.dataset.p, e));
    $('dock').querySelectorAll('.dkx').forEach(x => { x.onclick = e => { e.stopPropagation(); dismiss(x.dataset.x); }; x.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(x.dataset.x); } }; });
    const n = $('asNudge'); if (n) n.onclick = e => open('assistant', e);
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
    if (el.dataset.mb) return;
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
const syncLock = () => document.documentElement.classList.toggle('bgl', bgLocked());
function pkScroller(t, dy) {   // a scrollable element inside the feed / player that can still move in this direction
  const host = t && t.closest ? t.closest('#pop, #wp') : null; if (!host) return null;
  for (let e = t; e; e = e.parentElement) {
    const oy = getComputedStyle(e).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && e.scrollHeight > e.clientHeight + 1 && (dy > 0 ? e.scrollTop + e.clientHeight < e.scrollHeight - 1 : e.scrollTop > 0)) return e;
    if (e === host) break;
  }
  return null;
}
document.addEventListener('wheel', e => { if (bgLocked() && !pkScroller(e.target, e.deltaY)) e.preventDefault(); }, { passive: false });
let pkY = 0;
document.addEventListener('touchstart', e => { pkY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchmove', e => {
  if (!bgLocked()) return;
  const y = e.touches[0].clientY, dy = pkY - y; pkY = y;
  if (e.target.closest && e.target.closest('input[type=range]')) return;
  if (!pkScroller(e.target, dy)) e.preventDefault();
}, { passive: false });
window.addEventListener('DOMContentLoaded', () => {
  const p = $('pop'); if (p) new MutationObserver(syncLock).observe(p, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(syncLock).observe(document.body, { childList: true });   // the player (#wp) is added to / removed from body
  syncLock();
});

/* ===== Peek hint for every long text area: the last line shows half-cut until the first scroll, then it settles to the normal size ===== */
const PK_BOXES = '.lst, .ntl, #mB, #ssList, #logList';      // scroll boxes that already have a height from the CSS: keep that height, only add the hint
const PK_TEXT = [['.nt .rich', 5], ['.itd.rich', 5]];      // text blocks: capped at 5 lines (a 6th line starts -> hint + scroll)
function peekEl(el, lines) {
  if (el.dataset.pk) return;
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




function openLang(btn) {
  const pop = $('langPop'), r = btn.getBoundingClientRect(), others = ['en', 'ar', 'eg'].filter(x => x !== lang);
  const lbl = { en: 'EN', ar: 'عربي', eg: 'مصري' };
  const up = r.top > 130, list = (up ? others.slice().reverse() : others);
  const left = Math.max(32, Math.min(innerWidth - 32, r.left + r.width / 2));
  pop.innerHTML = `<div class="lgs" style="left:${left}px;${up ? 'bottom:' + (innerHeight - r.top + 10) : 'top:' + (r.bottom + 10)}px" dir="ltr">${list.map(x => `<button type="button" class="lgi" data-l="${x}">${lbl[x]}</button>`).join('')}</div>`;
  pop.classList.add('open');
  pop.querySelectorAll('.lgi').forEach(b => b.onclick = e => { e.stopPropagation(); const l = b.dataset.l; closeLang(); if (l !== lang) setLanguage(l); });
}




function closeLang() { $('langPop').classList.remove('open'); $('langPop').innerHTML = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLang(); closeBarOpts(); } });

/* ===== Customize pop-up (content to be decided) ===== */
function openBarOpts() {
  const T2 = { en: ['Customize', 'Hold any icon in the bar and drag it to change its place.'], ar: ['تخصيص', 'اضغط مطولاً على أي أيقونة في الشريط واسحبها لتغيير مكانها.'], eg: ['تخصيص', 'دوس مطولاً على أي أيقونة في الشريط واسحبها عشان تغيّر مكانها.'] }[lang] || ['Customize', ''];
  $('boT').textContent = T2[0]; $('boN').textContent = T2[1]; $('barOpts').classList.add('open');
}
function closeBarOpts() { $('barOpts').classList.remove('open'); }

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
  const linkOf = e => e.target && e.target.closest && e.target.closest('.rt-link[data-word]');
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
  var ROOTS = '#lists, #mB, #pop .pc[data-cid="dnd"], #pop .pc[data-cid="notes"]';
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



/* ===== Ear icon on containers that hold spoken words (outside the pop-ups only) ===== */
(function () {
  const WORD = '.vx, .rt-link', BOX = '.cap, .nt, .itm, .rcap, .dnr, .row', ACTIVE = '#mdl, #pop';
  let t = 0;
  function mark() {
    document.querySelectorAll('.has-ear').forEach(b => { if (!b.querySelector(WORD)) b.classList.remove('has-ear'); });
    document.querySelectorAll(WORD).forEach(w => { if (w.closest(ACTIVE)) return; const b = w.closest(BOX); if (b) b.classList.add('has-ear'); });
  }
  const run = () => { clearTimeout(t); t = setTimeout(mark, 120); };
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', run);
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


