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
const RT = window.ThabitRich || { inline: s => s, strip: s => s, render: s => s };   // formatted text (richtext.js)
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Trainer view: the admin panel opens dashboard.html#vt=<temporary token>. Read-only, never touches the trainee's real login. */
const VT = ((location.hash || '').match(/vt=([A-Za-z0-9]+)/) || [])[1] || null, VIEW = !!VT;
if (VIEW) document.documentElement.classList.add('viewmode');
const VIEW_BLOCK = ['trainee_check_item', 'trainee_set_task', 'trainee_raise_hand', 'trainee_send_request', 'trainee_notifications_read', 'trainee_mark_notifs_read', 'trainee_logout'];
const tok = () => VIEW ? VT : (() => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } })();
const rpc = (fn, body) => (VIEW && VIEW_BLOCK.includes(fn)) ? Promise.resolve(null) : fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

function setLanguage(l) {
  lang = l; try { localStorage.setItem('thabit_lang', l); } catch (e) {}
  ['Ar', 'En', 'Eg'].forEach(x => $('floatBtn' + x).classList.toggle('active', x.toLowerCase() === l));
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
  const t = tok(); try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('currentTrainee'); } catch (e) {}
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
  let s = `<svg class="c2" viewBox="0 0 ${W} ${H}" data-l="${L}" data-b="${H - B}">`;
  [0, S.max / 2, S.max].forEach(g => s += `<text class="tx" x="${L - 6}" y="${y(g) + o.f / 3}" text-anchor="end" font-size="${o.f}">${Math.round(g)}</text>`);
  S.bk.forEach((b, i) => { if (i % step === 0) s += `<text class="tx" x="${x(i)}" y="${H - 3}" text-anchor="middle" font-size="${o.f}">${b.label}</text>`; });
  keys.forEach(k => {
    s += `<path class="ln ${k}" fill="none" stroke-width="${o.w}" d="${smooth(S.cum[k].map((v, i) => [x(i), y(v)]))}"/>`;
    if (k !== 'avg') S.bk.forEach((b, i) => { if (b.rows.some(r => r[k] != null && r[k] !== '')) { const cx = x(i), cy = y(S.cum[k][i]), at = `data-k="${k}" data-i="${i}" data-cx="${cx}" data-cy="${cy}"`;
      s += `<circle class="dot ${k}" cx="${cx}" cy="${cy}" r="${o.r}" ${at}/><circle class="dot hit" cx="${cx}" cy="${cy}" r="${o.hit}" ${at}/>`; } });
  });
  return s + '<line class="xh xv" style="display:none"/><line class="xh xz" style="display:none"/></svg>';
}
function kpi(key, rows, all, S) {
  const t = T[lang], vals = rows.map(r => r[key]).filter(v => v != null && v !== '').map(Number).filter(Number.isFinite);
  let h = `<div class="thabit-card dcard"><h4>${t[key]}</h4>`;
  if (!vals.length) return h + `<div class="sm">${t.none}</div>${chart(S, [key], { W: 300, H: 150, L: 30, f: 9, w: 2, r: 4, hit: 15, lab: 5 })}</div>`;
  const cur = vals[vals.length - 1];
  const before = all.filter(r => r[key] != null && !rows.includes(r)).map(r => Number(r[key]));
  const base = before.length ? before[before.length - 1] : vals[0];
  return h + `<div class="big">${cur} <span class="sm">/ 10</span></div>${delta(+(cur - base).toFixed(2))}${chart(S, [key], { W: 300, H: 150, L: 30, f: 9, w: 2, r: 4, hit: 15, lab: 5 })}<div class="sm" id="why_${key}">${t.tap}</div></div>`;
}
function overall(rows, S) {
  const t = T[lang], ra = r => { const v = MET.map(m => r[m]).filter(x => x != null).map(Number); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; };
  const vals = rows.map(ra).filter(v => v != null);
  if (!vals.length) return `<h4>${t.overall}</h4><div class="sm">${t.none}</div>`;
  const cur = vals[vals.length - 1], base = vals.length > 1 ? vals[vals.length - 2] : cur;
  const col = { performance: '#ef4444', attitude: '#3b82f6', soft_skills: '#10b981', compliance: '#f97316', attendance: '#06b6d4', avg: 'var(--avg)' };
  return `<h4>${t.overall}</h4><div class="big">${cur} <span class="sm">/ 10</span></div>${delta(+(cur - base).toFixed(1))}` +
    `<div class="lg">${[...MET, 'avg'].map(k => `<span><i style="background:${col[k]}"></i>${k === 'avg' ? t.avg : t[k]}</span>`).join('')}</div>` +
    chart(S, [...MET, 'avg'], { W: 700, H: 300, L: 40, f: 13, w: 4, r: 6, hit: 20, lab: 10 });
}
const listCard = (title, rows, fn) => { const it = rows.slice().reverse().map(fn).filter(Boolean).join('');
  return `<div class="thabit-card dcard"><h4>${title}</h4><div class="lst caps">${it || `<div class="sm">${T[lang].none}</div>`}</div></div>`; };
const item = (r, body) => `<div class="it"><div class="dt">${r.supply_date}</div>${body}</div>`;

/* ===== Sessions popup (opened from the Sessions card at the top) ===== */
const LF = [['supply_date','Date'],['session_number','Session #'],['group_name','Group'],['session_title','Title'],['sub_title','Sub title'],['start_time','Start'],['end_time','End'],
  ['compliance','Compliance'],['revision','Revision'],['revision_details','Revision details'],['notes','Notes'],['tefl','TEFL'],['qol','QOL'],['attitude','Attitude'],['attitude_details','Attitude details'],
  ['soft_skills','Soft skills'],['soft_skills_details','Soft skills details'],['attendance','Attendance'],['attendance_details','Attendance details'],['performance','Performance'],['why','Why'],['performance_details','Performance details'],
  ['weak_points','Weak points'],['tasks','Tasks'],['left_overs','Left overs'],['plans','Plans']];
const sessLine = (a, b) => !b ? '' : String(b).length > 90 ? `<div class="row"><span class="sm">${a}</span><b class="more" dir="auto" onclick="openModal(${mk(a, b)})">${esc(RT.strip(String(b)).slice(0, 90))}…</b></div>` : `<div class="row"><span class="sm">${a}</span><b dir="auto">${RT.inline(esc(b))}</b></div>`;
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
      + (r.session_title ? `<div class="sst" dir="auto">${RT.inline(esc(r.session_title))}</div>` : '')
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
}
const fetchDone = () => rpc('trainee_done_tasks', { p_token: tok() }).then(a => Array.isArray(a) ? a : []).catch(() => []);
const cap = (rows, key, title) => {
  const it = rows.slice().reverse().filter(r => r[key]).map(r => `<button type="button" class="cap" onclick="openModal(${mk(r.supply_date + ' · ' + title, r[key])})"><span class="dt">${r.supply_date}</span><span dir="auto">${esc(RT.strip(String(r[key])).replace(/\s+/g, ' ').slice(0, 70))}</span></button>`).join('');
  return `<div class="thabit-card dcard"><h4>${title}</h4><div class="lst">${it || `<div class="sm">${T[lang].none}</div>`}</div></div>`;
};
/* ===== Rich notes: 1. / a. = related ideas, "-" = separate points, blank line = new capsule ===== */
const escv = s => RT.inline(esc(s)).replace(/\s*\|\s*/g, '<i class="vb"></i>');
function rich(txt) {
  return String(txt || '').trim().split(/\n\s*\n/).filter(b => b.trim()).map(b => {
    const ls = b.split('\n').map(l => l.trimEnd()).filter(l => l.trim()), NUM = /^\s*(\d+|[a-zA-Z])[.)]\s+/, BUL = /^\s*[-•*]\s+/;
    if (ls.every(l => NUM.test(l))) return `<ol class="rl" dir="auto"${/^\s*[a-zA-Z][.)]/.test(ls[0]) ? ' type="a"' : ''}>${ls.map(l => `<li>${escv(l.replace(NUM, ''))}</li>`).join('')}</ol>`;
    if (ls.every(l => BUL.test(l))) return `<ul class="rl" dir="auto">${ls.map(l => `<li>${escv(l.replace(BUL, ''))}</li>`).join('')}</ul>`;
    return `<p class="rp" dir="auto">${ls.map(escv).join('<br>')}</p>`;
  }).join('');
}

/* ===== Per-capsule copy: every block (separated by a blank line) gets its own copy button ===== */
const richC = txt => String(txt || '').trim().split(/\n\s*\n/).filter(b => b.trim()).map(b => `<div class="rcap">${rich(b)}${cpBtn(RT.strip(b.trim()))}</div>`).join('');
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
const isHoliday = () => { const n = new Date(cairoNow()), w = n.getUTCDay(); return (w === 4 && n.getUTCHours() >= 12) || w === 5; };
const holBanner = () => isHoliday() ? `<div class="hol"><i class="fa-solid fa-umbrella-beach"></i> ${itT().hol}</div>` : '';
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
  d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0'))); D = d; D.done = await fetchDone(); D.notes = await fetchNotes(); D.bill = await fetchBill(); render(); initFloat();
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
  for (let i = 0; i < 15; i++) { const d = new Date(d0.getTime() + i * 864e5); if (!sc.days.includes(d.getUTCDay())) continue; const t = d.getTime() + (sc.h * 60 + sc.m) * 6e4; if (t > from) return t; }
  return null;
}
function nxState() {
  const sc = schedule(); if (!sc) return null;
  const now = cairoNow(), t0 = Math.floor(now / 864e5) * 864e5, isDay = sc.days.includes(new Date(now).getUTCDay()), nxt = nextAfter(sc, now);
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
  if (s.st === 'count') return { html: `<h3>${t.nxt}</h3><div>${t.startsIn}</div><div class="cdn cd" data-t="${s.nxt}">--:--:--</div>` };
  return { cls: s.st === 'off' ? 'rest' : '', html: `<h3>${t.nxt}</h3>${s.st === 'off' ? `<div class="cdn">${t.rip}</div>` : ''}<div>${when}</div>` };
}
const dndCard = d => ({ html: `<h3>${TX().dnd}</h3><div dir="auto">${d.items.map(x => `<div class="dnr"><span class="chip">${esc(x)}</span>${cpBtn(x)}</div>`).join('')}</div><div class="sm" style="margin-top:8px">${d.r.supply_date}</div>` });
function openPop(cards, from) {
  const o = $('pop'); o.innerHTML = cards.filter(Boolean).map(c => `<div class="pc ${c.cls || ''}">${c.noX ? '' : '<button type="button" class="x">×</button>'}${c.html}</div>`).join(''); o.classList.add('open');
  if (from) { const b = from.getBoundingClientRect(); o.querySelectorAll('.pc').forEach(c => { const r = c.getBoundingClientRect(); c.style.setProperty('--dx', (b.left + b.width / 2 - r.left - r.width / 2) + 'px'); c.style.setProperty('--dy', (b.top + b.height / 2 - r.top - r.height / 2) + 'px'); }); }
}
const closePop = () => { $('pop').classList.remove('open'); $('pop').innerHTML = ''; };
/* ===== Feed: next session + dandana + notifications + payment, all inside ONE button ===== */
const NTX = {
  en: { feed: 'Feed', notes: 'Notifications', msg: 'Message from your trainer', word: w => `Your word “${w}” is ready. You can listen to it now.`, reply: 'The trainer replied to your request', billT: 'Payment', cur: 'EGP',
        past: (p, t, s, due) => `A gentle reminder that there is an amount of <b>${p}</b> EGP from last month, which makes the total due <b>${t}</b> EGP. Please make sure to pay this amount before <b>${due}</b>.`,
        tot: (s, due) => `A gentle reminder that this month's subscription is <b>${s}</b> EGP. Please make sure to pay it before <b>${due}</b>.` },
  ar: { feed: 'فيد', notes: 'الإشعارات', msg: 'رسالة من المدرب', word: w => `كلمتك «${w}» جاهزة، تقدر تسمعها الآن.`, reply: 'رد المدرب على طلبك', billT: 'المدفوعات', cur: 'جنيه',
        past: (p, t, s, due) => `تذكير لطيف بأن هناك مبلغًا من الشهر السابق بقيمة <b>${p}</b> جنيه، وهذا يجعل الإجمالي المطلوب <b>${t}</b> جنيه. رجاءً تأكد من دفع هذا المبلغ المستحق قبل يوم <b>${due}</b>.`,
        tot: (s, due) => `تذكير لطيف بأن مبلغ اشتراك هذا الشهر <b>${s}</b> جنيه. رجاءً تأكد من دفعه قبل يوم <b>${due}</b>.` },
  eg: { feed: 'فيد', notes: 'الإشعارات', msg: 'رسالة من المدرب', word: w => `كلمتك «${w}» جاهزة، تقدر تسمعها دلوقتي.`, reply: 'المدرب رد على طلبك', billT: 'المدفوعات', cur: 'جنيه',
        past: (p, t, s, due) => `تذكير لطيف إن فيه مبلغ من الشهر اللي فات بقيمة <b>${p}</b> جنيه، وده بيخلي الإجمالي المطلوب <b>${t}</b> جنيه. ياريت تتأكد إنك تدفع المبلغ المستحق ده قبل يوم <b>${due}</b>.`,
        tot: (s, due) => `تذكير لطيف إن اشتراك الشهر ده <b>${s}</b> جنيه. ياريت تتأكد إنك تدفعه قبل يوم <b>${due}</b>.` }
};
const NT = () => NTX[lang] || NTX.en;
const fetchNotes = () => rpc('trainee_notifications', { p_token: tok() }).then(a => { if (!Array.isArray(a)) console.warn('[feed] trainee_notifications failed:', a); return Array.isArray(a) ? a : []; }).catch(e => { console.warn('[feed] trainee_notifications error:', e); return []; });
const fetchBill = () => rpc('trainee_billing', { p_token: tok() }).then(b => b && typeof b === 'object' && !Array.isArray(b) && !b.message && !b.code ? b : null).catch(() => null);
function billState() {
  const b = D && D.bill; if (!b) return null;
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
function billCard(s) {
  const t = NT(), fmt = v => String(v), due = billDue();
  return { cls: 'bill', html: `<h3>${t.billT}</h3><div class="billb" dir="auto">${s.past > 0 ? t.past(fmt(s.past), fmt(s.total), fmt(s.sub), due) : t.tot(fmt(s.sub), due)}</div>` };
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
  return { html: `<h3>${t.notes}</h3><div class="ntl">${items}</div>` };
}
const unreadCount = () => (D && D.notes || []).filter(n => !n.read_at).length;

function feedCards() {
  const c = [], s = nxState(), d = dndState(), bs = billState(), notes = ((D && D.notes) || []).filter(n => n.kind !== 'assistant_words'), as = asCard();
  if (s) c.push(nextCard(s));
  if (as) c.push(as);
  if (d) c.push(dndCard(d));
  if (notes.length) c.push(notesCard(notes));
  if (bs) c.push(billCard(bs));
  return c;
}
function updateFeed() {
  const btn = $('feedBtn'), n = unreadCount(), bd = $('feedBadge');
  btn.hidden = !feedCards().length; btn.setAttribute('aria-label', NT().feed);
  bd.hidden = !n; bd.textContent = n > 9 ? '9+' : n;
}
function openFeed(from) {
  const c = feedCards(); if (!c.length) return;
  openPop(c, from);
  if (unreadCount()) { (D.notes || []).forEach(n => { if (!n.read_at) n.read_at = new Date().toISOString(); }); updateFeed(); rpc('trainee_notifications_read', { p_token: tok() }).catch(() => {}); }
}
function initFloat() {
  updateFeed();
  const btn = $('feedBtn');
  if (!window._popDone) {
    window._popDone = true;
    setTimeout(() => {
      const s2 = nxState(), d2 = dndState(), bs = billState(), c = [], un = (D.notes || []).filter(n => !n.read_at && n.kind !== 'assistant_words'), as2 = asCard();
      if (s2 && s2.st === 'count') c.push(nextCard(s2));
      if (as2) c.push(as2);          // always shown with Next session until the trainee closes it
      if (d2) c.push(dndCard(d2));
      if (un.length) c.push(notesCard(un));
      let seen = ''; try { seen = localStorage.getItem('thabit_bill_seen') || ''; } catch (e) {}
      if (bs && seen !== itToday()) { c.push(billCard(bs)); try { localStorage.setItem('thabit_bill_seen', itToday()); } catch (e) {} }   // payment note: once a day
      if (c.length) { openPop(c, btn); if (un.length) { D.notes.forEach(n => { if (!n.read_at) n.read_at = new Date().toISOString(); }); updateFeed(); rpc('trainee_notifications_read', { p_token: tok() }).catch(() => {}); } }
    }, 2200);
  }
  if (!window._ntPoll) window._ntPoll = setInterval(async () => { if (!D) return; D.notes = await fetchNotes(); updateFeed(); }, 60000);
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
  let cur = null, loadedKey = null, nudgeT = null, hideT = null, pendingWord = null; const mins = [];
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
      if (!f.getAttribute('src') || loadedKey !== key()) { f.src = SRC + (pendingWord ? '?word=' + encodeURIComponent(pendingWord) : ''); loadedKey = key(); }
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
  /* open the Assistant with a word already typed in (used by Hyperlinked words) */
  function openWith(word) {
    const f = $('asFrame'), loaded = f.getAttribute('src') && loadedKey === key();
    if (!loaded) { pendingWord = word; open('assistant'); pendingWord = null; return; }
    open('assistant');
    try {
      const w = f.contentWindow, inp = w.document.getElementById('wordInput');
      if (inp) { inp.value = word; if (w.checkMainWordStatus) w.checkMainWordStatus(); }
    } catch (e) { f.src = SRC + '?word=' + encodeURIComponent(word); }
  }
  return { open, min, close, dismiss, openWith };
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

/* ===== Assistant notifications: shown with Next session until the trainee closes them ===== */
const ASX = {
  en: { t: 'Assistant notifications', b: w => `Your words (${w}) have been uploaded. You can listen to them in the Assistant.`, open: 'Open Assistant', sep: ', ' },
  ar: { t: 'إشعارات المساعد', b: w => `كلماتك (${w}) تم رفعها. تقدر تسمعها من المساعد.`, open: 'افتح المساعد', sep: '، ' },
  eg: { t: 'إشعارات المساعد', b: w => `كلماتك (${w}) اترفعت. تقدر تسمعها من المساعد.`, open: 'افتح المساعد', sep: '، ' }
};
const asDis = () => { try { return JSON.parse(localStorage.getItem('thabit_as_dis') || '{}'); } catch (e) { return {}; } };
const asActive = () => { const d = asDis(); return ((D && D.notes) || []).filter(n => n.kind === 'assistant_words' && ((n.meta || {}).words || []).length && d[n.id] !== n.created_at); };
function asCard() {
  const l = asActive(); if (!l.length) return null;
  const t = ASX[lang] || ASX.en, words = [...new Set(l.flatMap(n => n.meta.words))];
  return { noX: true, cls: 'as', html: `<button type="button" class="x" aria-label="Dismiss" onclick="event.stopPropagation();asDismiss(this)">×</button><h3>${t.t}</h3>`
    + `<div dir="auto">${t.b(words.map(w => '«' + esc(w) + '»').join(t.sep))}</div>`
    + `<div style="margin-top:10px"><button type="button" class="btn2" onclick="event.stopPropagation();closePop();Panels.open('assistant',event)">${t.open}</button></div>` };
}
function asDismiss(btn) {
  if (!VIEW) { const d = asDis(); asActive().forEach(n => d[n.id] = n.created_at); try { localStorage.setItem('thabit_as_dis', JSON.stringify(d)); } catch (e) {} }
  const card = btn.closest('.pc'); if (card) card.remove();
  if (!document.querySelector('#pop .pc')) closePop();
  updateFeed();
}

/* ===== Hyperlinked words: tap = play the recording from Supabase (same lookup as the Assistant); after 3 plays offer practice ===== */
if (window.ThabitRichStudent) ThabitRichStudent.init({
  supabaseUrl: SB, anonKey: KEY, getLang: () => lang,
  onAssistant: w => Panels.openWith(w)
});
