/* Thabit trainee dashboard: token -> Supabase RPC. No sheet, no direct table reads. */
const SB = "https://vkfexceitwjmxncwceqb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
const TOKEN_KEY = 'thabit_trainee_token', PORTAL = 'index.html';
const T = {
  en: { hi: 'Welcome, ', today: 'Today', week: '7 days', month: '30 days', all: 'Since start', last: 'Last session', info: 'My info', req: 'Send a request', hist: 'Sessions', send: 'Send', sessions: 'Sessions',
        performance: 'Performance', attitude: 'Attitude', soft_skills: 'Soft skills', tefl: 'TEFL', qol: 'QOL', none: 'No data yet', ph: 'Write your request...', overall: 'Overall progress', avg: 'Average', tap: 'Tap a dot to see why', revision: 'Revision', attendance: 'Attendance', metrics: 'Scores & details', todo: 'To-Do', donet: 'Done tasks', alldone: 'All caught up ✓', handtip: 'Not sure about a task? Tap the ! next to it and tell me.', handq: 'What is unclear about this task?', sent: 'Sent ✓', fail: 'Could not send, try again', year: 'Year', duration: 'Time in program', subs: 'Sessions & sub titles', notes: 'Notes' },
  ar: { hi: 'أهلاً ', today: 'اليوم', week: '٧ أيام', month: '٣٠ يوم', all: 'منذ البداية', last: 'آخر جلسة', info: 'بياناتي', req: 'إرسال طلب', hist: 'الجلسات', send: 'إرسال', sessions: 'الجلسات',
        performance: 'الأداء', attitude: 'السلوك', soft_skills: 'المهارات الشخصية', tefl: 'TEFL', qol: 'QOL', none: 'لا توجد بيانات بعد', ph: 'اكتب طلبك...', overall: 'التقدم العام', avg: 'المتوسط', tap: 'اضغط على نقطة لمعرفة السبب', revision: 'المراجعة', attendance: 'الحضور', metrics: 'الأرقام والتفاصيل', todo: 'المهام', donet: 'المهام المنتهية', alldone: 'خلصت كل المهام ✓', handtip: 'مش فاهم تاسك؟ اضغط على ! اللي جنبها وقولي.', handq: 'إيه اللي مش واضح في التاسك دي؟', sent: 'اتبعت ✓', fail: 'ما اتبعتش، حاول تاني', year: 'سنة', duration: 'وقت البرنامج', subs: 'الجلسات والعناوين', notes: 'ملاحظات' },
};
T.eg = Object.assign({}, T.ar, { hi: 'أهلاً يا ', last: 'آخر جلسة ليك' });
let D = null, range = 'week', lang = 'en', CUR = [], SER = null;
const $ = id => document.getElementById(id);
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tok = () => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } };
const rpc = (fn, body) => fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

function setLanguage(l) {
  lang = l; try { localStorage.setItem('thabit_lang', l); } catch (e) {}
  ['Ar', 'En', 'Eg'].forEach(x => $('floatBtn' + x).classList.toggle('active', x.toLowerCase() === l));
  const r = $('htmlRoot'); r.lang = l; r.dir = l === 'en' ? 'ltr' : 'rtl';
  if (D) render();
}
function toggleTheme() {
  const light = $('bodyRoot').classList.toggle('light-theme');
  $('themeIcon').className = 'fa-solid text-sm ' + (light ? 'fa-sun' : 'fa-moon');
  try { localStorage.setItem('thabit_theme', light ? 'light' : 'dark'); } catch (e) {}
}
async function logout() {
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
const MET = ['performance', 'attitude', 'soft_skills', 'revision', 'attendance'];
const MD = [], TK = [], mk = (title, text) => MD.push([title, text]) - 1;
let HAND_NEW = true, DTL_OPEN = false; try { HAND_NEW = !localStorage.getItem('thabit_hand_seen'); } catch (e) {}
function val(r, k) {
  if (k === 'avg') { const v = MET.map(m => r[m]).filter(x => x != null).map(Number); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; }
  return r[k] == null ? null : Number(r[k]);
}
const DAYS = { week: 7, month: 30, year: 365 };
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const hm = v => { const p = String(v || '').split(':'); return p.length > 1 ? (+p[0]) * 60 + (+p[1]) : null; };
const mins = r => { const a = hm(r.start_time), b = hm(r.end_time); return a == null || b == null ? 0 : (b >= a ? b - a : b + 1440 - a); };
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
  let s = `<svg class="c2" viewBox="0 0 ${W} ${H}">`;
  [0, S.max / 2, S.max].forEach(g => s += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}"/><text class="tx" x="${L - 6}" y="${y(g) + o.f / 3}" text-anchor="end" font-size="${o.f}">${Math.round(g)}</text>`);
  S.bk.forEach((b, i) => { if (i % step === 0) s += `<text class="tx" x="${x(i)}" y="${H - 3}" text-anchor="middle" font-size="${o.f}">${b.label}</text>`; });
  const show = range === 'today';
  keys.forEach(k => {
    s += `<path class="ln ${k}" fill="none" stroke-width="${o.w}" d="${smooth(S.cum[k].map((v, i) => [x(i), y(v)]))}"/>`;
    if (k !== 'avg') S.bk.forEach((b, i) => { if (b.rows.length) s += `<circle class="dot ${k}${show ? '' : ' hit'}" cx="${x(i)}" cy="${y(S.cum[k][i])}" r="${show ? o.r : 10}" data-k="${k}" data-i="${i}"/>`; });
  });
  return s + '</svg>';
}
function kpi(key, rows, all, S) {
  const t = T[lang], vals = rows.map(r => r[key]).filter(v => v != null && v !== '').map(Number).filter(Number.isFinite);
  let h = `<div class="thabit-card dcard"><h4>${t[key]}</h4>`;
  if (!vals.length) return h + `<div class="sm">${t.none}</div>${chart(S, [key], { W: 300, H: 150, L: 30, f: 9, w: 2, r: 4, lab: 5 })}</div>`;
  const cur = vals[vals.length - 1];
  const before = all.filter(r => r[key] != null && !rows.includes(r)).map(r => Number(r[key]));
  const base = before.length ? before[before.length - 1] : vals[0];
  return h + `<div class="big">${cur} <span class="sm">/ 10</span></div>${delta(+(cur - base).toFixed(2))}${chart(S, [key], { W: 300, H: 150, L: 30, f: 9, w: 2, r: 4, lab: 5 })}<div class="sm" id="why_${key}">${t.tap}</div></div>`;
}
function overall(rows, S) {
  const t = T[lang], ra = r => { const v = MET.map(m => r[m]).filter(x => x != null).map(Number); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; };
  const vals = rows.map(ra).filter(v => v != null);
  if (!vals.length) return `<h4>${t.overall}</h4><div class="sm">${t.none}</div>`;
  const cur = vals[vals.length - 1], base = vals.length > 1 ? vals[vals.length - 2] : cur;
  const col = { performance: '#ef4444', attitude: '#3b82f6', soft_skills: '#10b981', revision: '#f97316', attendance: '#06b6d4', avg: 'var(--avg)' };
  return `<h4>${t.overall}</h4><div class="big">${cur} <span class="sm">/ 10</span></div>${delta(+(cur - base).toFixed(1))}` +
    `<div class="lg">${[...MET, 'avg'].map(k => `<span><i style="background:${col[k]}"></i>${k === 'avg' ? t.avg : t[k]}</span>`).join('')}</div>` +
    chart(S, [...MET, 'avg'], { W: 700, H: 300, L: 40, f: 13, w: 4, r: 7, lab: 10 });
}
const listCard = (title, rows, fn) => { const it = rows.slice().reverse().map(fn).filter(Boolean).join('');
  return `<div class="thabit-card dcard"><h4>${title}</h4><div class="lst caps">${it || `<div class="sm">${T[lang].none}</div>`}</div></div>`; };
const item = (r, body) => `<div class="it"><div class="dt">${r.supply_date}</div>${body}</div>`;

function render() {
  const t = T[lang], all = D.rows, rows = CUR = all.filter(inRange), p = D.profile || {}, S = SER = series(rows);
  MD.length = 0; TK.length = 0;
  $('hello').textContent = t.hi + (p.trainee || ''); $('kAccT').textContent = t.metrics;
  $('rng').innerHTML = ['today', 'week', 'month', 'year', 'all'].map(k => `<button class="${k === range ? 'on' : ''}" onclick="range='${k}';render()">${t[k]}</button>`).join('');
  $('kpis').innerHTML = `<div class="thabit-card dcard" style="display:flex;gap:14px"><div style="flex:1"><h4>${t.sessions}</h4><div class="big">${rows.length}</div></div><div style="flex:1;border-inline-start:1px solid var(--border-color);padding-inline-start:14px"><h4>${t.duration}</h4><div class="big">${fmtDur(rows.reduce((a, r) => a + mins(r), 0))}</div></div></div>` + MET.map(k => kpi(k, rows, all, S)).join('');
  $('overall').innerHTML = overall(rows, S);
  $('lists').innerHTML = todoCard(all) + cap(rows, 'notes', t.notes) + cap(rows, 'tefl', 'TEFL') + cap(rows, 'qol', 'QOL');
  ['Last', 'Info', 'Req', 'Hist'].forEach(k => $('t' + k).textContent = t[k.toLowerCase()]);
  $('rqBtn').textContent = t.send; $('rqMsg').placeholder = t.ph;
  const L = all[all.length - 1], line = (a, b) => !b ? '' : String(b).length > 90 ? `<div class="row"><span class="sm">${a}</span><b class="more" dir="auto" onclick="openModal(${mk(a, b)})">${esc(String(b).slice(0, 90))}…</b></div>` : `<div class="row"><span class="sm">${a}</span><b>${esc(b)}</b></div>`;
  const LF = [['supply_date','Date'],['session_number','Session #'],['group_name','Group'],['session_title','Title'],['sub_title','Sub title'],['start_time','Start'],['end_time','End'],
    ['revision','Revision'],['revision_details','Revision details'],['notes','Notes'],['tefl','TEFL'],['qol','QOL'],['attitude','Attitude'],['attitude_details','Attitude details'],
    ['soft_skills','Soft skills'],['soft_skills_details','Soft skills details'],['performance','Performance'],['why','Why'],['performance_details','Performance details'],
    ['weak_points','Weak points'],['tasks','Tasks'],['left_overs','Left overs'],['plans','Plans']];
  $('last').innerHTML = L ? LF.map(f => line(f[1], L[f[0]])).join('') : `<div class="sm">${t.none}</div>`;
  const IF = [['status_as_of_today','Status'],['current_plan','Current plan'],['days_a_week','Days / week'],['session_time','Session time'],['place','Place'],['subscription','Subscription'],['due_date','Due date'],
    ['joining_date','Joined'],['first_session','First session'],['birth_date','Birth date'],['education_on_joining','Education on joining'],['schooling','Schooling'],['location','Location'],['residence_mostly','Residence'],
    ['first_thabit_scoring','First Thabit scoring'],['first_approved_english_test','First English test'],['first_psychological_approved_test','First psychological test'],['preferred_phone','Phone'],['preferred_email','Email']];
  $('info').innerHTML = line('Group', L && L.group_name) + IF.map(f => line(f[1], p[f[0]])).join('');
  $('rqList').innerHTML = (D.requests || []).map(r => `<div class="row"><span>${esc(r.message)}<br><span class="sm">${esc(r.type)} · ${esc(r.status)}</span></span><b>${esc(r.admin_reply || '')}</b></div>`).join('');
  $('hist').innerHTML = rows.length ? '<table><tr><th>Date</th><th>#</th><th>Title</th><th>Perf.</th><th>Att.</th><th>Soft</th><th class="hm">TEFL</th><th class="hm">QOL</th></tr>' +
    rows.slice().reverse().map(r => `<tr><td>${r.supply_date}</td><td>${r.session_number}</td><td>${esc(r.session_title)}</td><td>${r.performance ?? ''}</td><td>${r.attitude ?? ''}</td><td>${r.soft_skills ?? ''}</td><td class="hm">${esc(r.tefl)}</td><td class="hm">${esc(r.qol)}</td></tr>`).join('') + '</table>' : `<div class="sm">${t.none}</div>`;
  watchTodo();
}
const fetchDone = () => rpc('trainee_done_tasks', { p_token: tok() }).then(a => Array.isArray(a) ? a : []).catch(() => []);
const cap = (rows, key, title) => {
  const it = rows.slice().reverse().filter(r => r[key]).map(r => `<button type="button" class="cap" onclick="openModal(${mk(r.supply_date + ' · ' + title, r[key])})"><span class="dt">${r.supply_date}</span><span dir="auto">${esc(String(r[key]).replace(/\s+/g, ' ').slice(0, 70))}</span></button>`).join('');
  return `<div class="thabit-card dcard"><h4>${title}</h4><div class="lst">${it || `<div class="sm">${T[lang].none}</div>`}</div></div>`;
};
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
function openModal(i) { $('mT').textContent = MD[i][0]; $('mB').innerHTML = `<div dir="auto" style="white-space:pre-wrap">${esc(MD[i][1])}</div>`; $('mdl').classList.add('open'); }
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
  const c = $('todoCard'), tip = $('handTip'); if (!c || !tip) return;
  const go = () => { tip.classList.add('show'); setTimeout(() => { try { localStorage.setItem('thabit_hand_seen', '1'); } catch (e) {} }, 10000); };
  if (!window.IntersectionObserver) return go();
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { go(); o.disconnect(); } }, { threshold: .6 }).observe(c);
}
async function load() {
  const d = tok() ? await rpc('trainee_dashboard', { p_token: tok() }).catch(() => null) : null;
  if (!d || !d.profile) { try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    $('hello').innerHTML = `<a href="${PORTAL}" style="color:#fbbf24">${tok() === null ? 'Please log in from the portal first →' : 'Session not valid, log in again →'}</a>`;
    console.warn('Thabit dashboard: no valid session', d);
    if (location.protocol !== 'file:') setTimeout(() => { location.href = PORTAL; }, 2500);
    return; }
  d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0'))); D = d; D.done = await fetchDone(); render(); initFloat();
}
async function sendReq() {
  const m = $('rqMsg').value.trim(); if (!m) return;
  const ok = await rpc('trainee_send_request', { p_token: tok(), p_type: $('rqType').value, p_message: m });
  if (ok === true) { $('rqMsg').value = ''; load(); }
}
window.addEventListener('DOMContentLoaded', () => {
  try { if (localStorage.getItem('thabit_theme') === 'light') { $('bodyRoot').classList.add('light-theme'); $('themeIcon').className = 'fa-solid fa-sun text-sm'; } } catch (e) {}
  let l = 'en'; try { l = localStorage.getItem('thabit_lang') || 'en'; } catch (e) {}
  setLanguage(l); load();
});

document.addEventListener('click', e => {
  const tip = $('barTip'), d = e.target.closest && e.target.closest('.dot');
  if (!d) { tip.classList.remove('show'); return; }
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
  const rows = D.rows.filter(r => r.dandana && String(r.dandana).trim()); if (!rows.length) return null;
  const r = rows[rows.length - 1], sc = schedule();
  if (sc) { const n = nextAfter(sc, Date.parse(r.supply_date + 'T00:00:00Z') + 864e5); if (n && cairoNow() >= n - 5 * 36e5) return null; }
  return { r, items: String(r.dandana).split(/[\/\n]+/).map(x => x.trim()).filter(Boolean) };
}
const fmtT = sc => `${(sc.h % 12) || 12}:${String(sc.m).padStart(2, '0')} ${sc.h < 12 ? 'AM' : 'PM'}`;
function nextCard(s) {
  const t = TX(), when = s.n === 1 ? t.tom(fmtT(s.sc)) : t.inD(s.n, fmtT(s.sc));
  if (s.st === 'count') return { html: `<h3>${t.nxt}</h3><div>${t.startsIn}</div><div class="cdn cd" data-t="${s.nxt}">--:--:--</div>` };
  return { cls: s.st === 'off' ? 'rest' : '', html: `<h3>${t.nxt}</h3>${s.st === 'off' ? `<div class="cdn">${t.rip}</div>` : ''}<div>${when}</div>` };
}
const dndCard = d => ({ html: `<h3>${TX().dnd}</h3><div dir="auto">${d.items.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div><div class="sm" style="margin-top:8px">${d.r.supply_date}</div>` });
function openPop(cards, from) {
  const o = $('pop'); o.innerHTML = cards.map(c => `<div class="pc ${c.cls || ''}"><button type="button" class="x">×</button>${c.html}</div>`).join(''); o.classList.add('open');
  if (from) { const b = from.getBoundingClientRect(); o.querySelectorAll('.pc').forEach(c => { const r = c.getBoundingClientRect(); c.style.setProperty('--dx', (b.left + b.width / 2 - r.left - r.width / 2) + 'px'); c.style.setProperty('--dy', (b.top + b.height / 2 - r.top - r.height / 2) + 'px'); }); }
}
const closePop = () => { $('pop').classList.remove('open'); $('pop').innerHTML = ''; };
function initFloat() {
  const s = nxState(), d = dndState();
  $('nxBtn').hidden = !s; $('dnBtn').hidden = !d;
  if (window._popDone) return; window._popDone = true;
  setTimeout(() => {
    const s2 = nxState(), d2 = dndState(), c = [];
    if (s2 && s2.st === 'count') c.push(nextCard(s2));
    if (d2) c.push(dndCard(d2));
    if (c.length) openPop(c, s2 && s2.st === 'count' ? $('nxBtn') : $('dnBtn'));
  }, 2200);
}
window.addEventListener('DOMContentLoaded', () => {
  let pts = []; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, r = i % 2 ? 20 : 24; pts.push((26 + r * Math.sin(a)).toFixed(1) + ',' + (26 - r * Math.cos(a)).toFixed(1)); }
  $('dnBtn').innerHTML = `<svg viewBox="0 0 52 52" width="52" height="52"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs><polygon points="${pts.join(' ')}" fill="url(#sg)" stroke="#bfdbfe" stroke-width="1.2" stroke-linejoin="round"/><text x="26" y="34" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="Cairo,sans-serif">د</text></svg>`;
  $('dnBtn').onclick = e => { e.stopPropagation(); const d = dndState(); if (d) openPop([dndCard(d)], $('dnBtn')); };
  $('nxBtn').onclick = e => { e.stopPropagation(); const s = nxState(); if (s) openPop([nextCard(s)], $('nxBtn')); };
  setInterval(() => { const n = cairoNow(); document.querySelectorAll('.cd').forEach(e => { const x = Math.max(0, Math.floor((+e.dataset.t - n) / 1000)); e.textContent = [Math.floor(x / 3600), Math.floor(x % 3600 / 60), x % 60].map(v => String(v).padStart(2, '0')).join(':'); }); }, 1000);
});

/* ===== Assistant popup (same widget, shown over the dashboard) =====
   states: closed -> open -> minimized (floating button) -> open ... ; X = closed (frame destroyed) */
(function () {
  const SRC = 'assistant.html';
  const NUDGE_EVERY = 5 * 60 * 1000;   // 5 minutes
  const NUDGE_SHOW = 15 * 1000;        // bubble stays 15s
  const MSG = { en: 'I am sleepy :) ', ar: 'أريد أن أرتاح قليلا ', eg: 'لسه محتاجني؟' };
  const TTL = { en: 'Assistant', ar: 'المساعد', eg: 'المساعد' };
  let state = 'closed', loadedKey = null, nudgeT = null, hideT = null;
  const L = () => (typeof lang !== 'undefined' && MSG[lang]) ? lang : 'en';
  const key = () => L() + (document.body.classList.contains('light-theme') ? 'l' : 'd');

  function hideNudge() { clearTimeout(hideT); $('asNudge').hidden = true; $('asBtn').classList.remove('shk'); }
  function stopTimers() { clearTimeout(nudgeT); hideNudge(); }
  function scheduleNudge() {
    clearTimeout(nudgeT);
    nudgeT = setTimeout(() => {
      if (state !== 'min') return;
      if (!document.hidden) {
        const n = $('asNudge'), b = $('asBtn');
        n.textContent = MSG[L()]; n.hidden = false;
        b.classList.remove('shk'); void b.offsetWidth; b.classList.add('shk');
        hideT = setTimeout(hideNudge, NUDGE_SHOW);
      }
      scheduleNudge();
    }, NUDGE_EVERY);
  }
  function lockScroll(on) { document.documentElement.style.overflow = on ? 'hidden' : ''; }

  window.openAssistant = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const f = $('asFrame');
    // load lazily on first open; reload only if language/theme changed since it loaded
    if (!f.getAttribute('src') || loadedKey !== key()) { f.src = SRC; loadedKey = key(); }
    stopTimers();
    $('asm').hidden = false; $('asWrap').hidden = true;
    $('asBtn').title = TTL[L()];
    state = 'open'; lockScroll(true);
  };
  window.minimizeAssistant = function () {
    if (state !== 'open') return;
    $('asm').hidden = true; $('asWrap').hidden = false; $('asBtn').title = TTL[L()];
    state = 'min'; lockScroll(false); scheduleNudge();
  };
  window.closeAssistant = function () {
    $('asm').hidden = true; $('asWrap').hidden = true;
    $('asFrame').removeAttribute('src'); loadedKey = null;
    state = 'closed'; lockScroll(false); stopTimers();
  };
  $('asNudge').addEventListener('click', openAssistant);
  $('asNudge').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openAssistant(e); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') minimizeAssistant(); });
})();
