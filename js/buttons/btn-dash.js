/* =====================================================================
   SIDEBAR BUTTON: dash  (العلامات الحيوية / Vital Signs)
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + الشاشة نفسها. مفيش iframe ولا dashboard.js.

   الشاشة = الأرقام بس:
     فلتر الفترة (دايرة: النهارده / الأسبوع / الشهر / الشهر الماضي) + بوكس المجموع (الخمس درجات مع بعض، من 50، بألوان الطيف) + الجلسات والوقت + كروت الدرجات الخمسة
     (دوس على أي نقطة في الـchart تشوف السبب).

   اتنقلوا لأماكنهم الجديدة (وما بقاش ليهم وجود هنا):
     الملاحظات + النصوص (TEFL) + الخربشات  ->  الموارد   (js/buttons/btn-res-content.js + res-scratch.js)
     الكلمات والأصوات + جهاز النطق          ->  قاموسك   (js/buttons/btn-ydict-content.js)
     الكود المشترك بتاعهم                   ->  js/buttons/lists-core.js

   بيقرا من نفس التوكن اللي home.html بيستخدمه: thabit_trainee_token
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.dash = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>';
    ctx.IC.dash = ICON;
    ctx.STR.en.i_dash = 'Vital Signs'; ctx.STR.ar.i_dash = 'العلامات الحيوية';

    /* ---- data source (Supabase RPC, same as before) ---- */
    const SB = "https://vkfexceitwjmxncwceqb.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
    const TOKEN_KEY = 'thabit_trainee_token';
    /* الالتزام مخفي مؤقتًا: عشان يرجع ضيفه تاني بين performance و attendance */
    const MET = ['performance', 'attitude', 'soft_skills', 'attendance'];
    const DAYS = { week: 7, month: 30, year: 365 };

    /* ---- small texts ---- */
    const T = {
      en: { today: 'Today', week: 'This week', month: 'This month', lmonth: 'Last month', sessions: 'Sessions', duration: 'Time in program',
        performance: 'Performance', attitude: 'Attitude', soft_skills: 'Soft skills', compliance: 'Compliance', attendance: 'Attendance',
        overall: 'All vital signs', total: 'Total', none: 'No data yet', tap: 'Tap a dot to see why', last: 'Last day counted: ',
        loading: 'Loading…', login: 'Please log in again.', fail: 'Could not load your data. Try again.', h: 'h', m: 'min' },
      ar: { today: 'اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر', lmonth: 'الشهر الماضي', sessions: 'الجلسات', duration: 'وقت البرنامج',
        performance: 'الأداء', attitude: 'السلوك', soft_skills: 'المهارات الشخصية', compliance: 'الالتزام', attendance: 'الحضور',
        overall: 'العلامات الحيوية كلها', total: 'المجموع', none: 'لا توجد بيانات بعد', tap: 'اضغط على نقطة لمعرفة السبب', last: 'آخر يوم محسوب: ',
        loading: 'جاري التحميل…', login: 'سجّل دخول من جديد.', fail: 'تعذر تحميل بياناتك، حاول تاني.', h: 'س', m: 'د' }
    };
    Object.assign(T.en, { total: 'Average', overall: 'Overall average', stats: 'Insights', strong: 'Strong points', weak: 'Weak points', topbtn: 'Most used', missed: 'Sessions missed', tasks: 'Tasks',
      ontime: 'On time', late: 'Late', miss: 'Not done', open: 'Open', good: 'On track', warn: 'Needs attention', risk: 'At risk', noTasks: 'No tasks in this period', none2: 'Not enough data', last2: 'Last: ', noMiss: 'No missed sessions' });
    Object.assign(T.ar, { total: 'المتوسط', overall: 'المتوسط العام', stats: 'إحصائيات', strong: 'نقاط القوة', weak: 'نقاط الضعف', topbtn: 'الأكثر استخدامًا', missed: 'جلسات فائتة', tasks: 'المهام',
      ontime: 'في وقتها', late: 'متأخرة', miss: 'لم تتم', open: 'مفتوحة', good: 'ماشي كويس', warn: 'محتاج انتباه', risk: 'في خطر', noTasks: 'لا توجد مهام في هذه الفترة', none2: 'بيانات غير كافية', last2: 'آخرها: ', noMiss: 'لا توجد جلسات فائتة' });
    const lg = () => (ctx.lang() === 'ar' ? 'ar' : 'en');
    const tt = () => T[lg()];
    const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    /* ---- state ---- */
    let D = null, range = 'week', manual = false, CUR = [], SER = null, TZ = 'Africa/Cairo';
    let wrap = null, root = null, played = false, tick = null, mo = null, lastLang = null, loadId = 0;

    const tok = () => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } };
    const rpc = (fn, body) => fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });

    /* ---- clock (the trainee's own country: Cairo or Riyadh) ---- */
    function tzFromProfile(p) {
      const x = String((p && (p.location || p.residence_mostly)) || '').toLowerCase();
      return /سعود|ksa|saudi|riyadh|الرياض|jeddah|جدة|مكة|makkah|mecca|medina|المدينة|dammam|الدمام|khobar|الخبر/.test(x) ? 'Asia/Riyadh' : 'Africa/Cairo';
    }
    function cairoNow() {
      const g = {}; new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).forEach(x => g[x.type] = +x.value);
      return Date.UTC(g.year, g.month - 1, g.day, g.hour, g.minute, g.second);
    }
    const itToday = () => new Date(cairoNow()).toISOString().slice(0, 10);

    /* ---- ranges: today / week (Sat-Fri) / this month / last month ---- */
    function thWin() {
      if (range !== 'week' && range !== 'month' && range !== 'lmonth') return null;
      const n = new Date(cairoNow()), y = n.getUTCFullYear(), m = n.getUTCMonth(), d = n.getUTCDate(), f = x => x.toISOString().slice(0, 10), td = f(n);
      if (range === 'month') return { s: f(new Date(Date.UTC(y, m, 1))), e: td };
      if (range === 'lmonth') return { s: f(new Date(Date.UTC(y, m - 1, 1))), e: f(new Date(Date.UTC(y, m, 0))) };
      return { s: f(new Date(Date.UTC(y, m, d - (n.getUTCDay() + 1) % 7))), e: td };
    }
    function inRange(r) {
      if (range === 'all') return true;
      if (range === 'today') return r.supply_date === itToday();
      const W = thWin(); if (W) return r.supply_date >= W.s && r.supply_date <= W.e;
      const d = new Date(r.supply_date + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0);
      const days = Math.round((n - d) / 864e5); return days >= 0 && days < DAYS[range];
    }
    const hasToday = () => !!(D && D.rows.some(r => r.supply_date === itToday()));
    function has(k) { const keep = range; range = k; const ok = !!(D && D.rows.some(inRange)); range = keep; return ok; }
    function opts() { const o = []; if (hasToday()) o.push('today'); o.push('week', 'month'); if (has('lmonth')) o.push('lmonth'); return o; }
    function auto() { if (hasToday()) return 'today'; for (const k of ['week', 'month', 'lmonth']) if (has(k)) return k; return 'week'; }
    function autoApply() { if (!D) return; if (!manual || !opts().includes(range)) { range = auto(); manual = false; } }

    /* ---- numbers ---- */
    const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const hm = v => { const p = String(v || '').split(':'); return p.length > 1 ? (+p[0]) * 60 + (+p[1]) : null; };
    const mins = r => { if (r.total_minutes != null) return Number(r.total_minutes) || 0; const a = hm(r.start_time), b = hm(r.end_time); return a == null || b == null ? 0 : (b >= a ? b - a : b + 1440 - a); };
    const fmtDur = m => { const t = tt(); return m < 60 ? m + ' ' + t.m : Math.floor(m / 60) + t.h + (m % 60 ? ' ' + (m % 60) + t.m : ''); };
    const delta = d => '<div class="' + (d > 0 ? 'up' : d < 0 ? 'down' : 'flat') + '">' + (d > 0 ? '▲ +' : d < 0 ? '▼ ' : '■ ') + d + '</div>';
    const avgOf = r => { const v = MET.map(m => r[m]).filter(x => x != null && x !== '').map(Number).filter(Number.isFinite); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; };   /* متوسط الدرجات (من 10) */

    /* ---- the chart: cumulative series, days (<=31) or months; y max = 10 x days ---- */
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
      { let s2 = 0; cum.total = bk.map(b => { b.rows.forEach(r => { const a = avgOf(r); if (a != null) s2 += a; }); return +s2.toFixed(1); }); }
      return { bk, cum, max: 10 * days };
    }
    function smooth(p) {
      const n = p.length; if (n < 2) return '';
      let d = 'M' + p[0][0] + ',' + p[0][1]; if (n === 2) return d + 'L' + p[1][0] + ',' + p[1][1];
      const dx = [], m = [], t = [];
      for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
      t[0] = m[0]; t[n - 1] = m[n - 2];
      for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
      for (let i = 0; i < n - 1; i++) { const h = dx[i] / 3; d += 'C' + (p[i][0] + h) + ',' + (p[i][1] + t[i] * h) + ' ' + (p[i + 1][0] - h) + ',' + (p[i + 1][1] - t[i + 1] * h) + ' ' + p[i + 1][0] + ',' + p[i + 1][1]; }
      return d;
    }
    function chart(S, keys, o) {
      const W = o.W, H = o.H, L = o.L, R = 22, Tp = 12, B = o.f + 10, n = S.bk.length, step = Math.ceil(n / o.lab), MX = S.max * (o.mul || 1);
      const x = i => n < 2 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (n - 1), y = v => Tp + (1 - v / MX) * (H - Tp - B);
      let s = '<svg class="c2' + (played ? '' : ' ci') + '" viewBox="0 0 ' + W + ' ' + H + '" data-l="' + L + '" data-b="' + (H - B) + '">';
      if (o.grad) s += '<defs><linearGradient id="thOvG" gradientUnits="userSpaceOnUse" x1="' + L + '" y1="0" x2="' + (W - R) + '" y2="0"><stop offset="0.0" stop-color="#ff3b6b"/><stop offset="0.167" stop-color="#ff9f1c"/><stop offset="0.333" stop-color="#ffe14d"/><stop offset="0.5" stop-color="#2ee59d"/><stop offset="0.667" stop-color="#35c4ff"/><stop offset="0.833" stop-color="#5b7cff"/><stop offset="1.0" stop-color="#b45cff"/></linearGradient></defs>';
      let tx = ''; [0, MX / 2, MX].forEach(g => tx += '<text class="tx" x="' + (L - 6) + '" y="' + (y(g) + o.f / 3) + '" text-anchor="end" font-size="' + o.f + '">' + Math.round(g) + '</text>');
      S.bk.forEach((b, i) => { if (i % step === 0) tx += '<text class="tx" x="' + x(i) + '" y="' + (H - 3) + '" text-anchor="middle" font-size="' + o.f + '">' + b.label + '</text>'; });
      keys.forEach(k => {
        const li = keys.indexOf(k);
        s += '<path class="ln ' + k + '" pathLength="1" style="--li:' + li + (o.grad && k === 'total' ? ';stroke:url(#thOvG)' : '') + '" fill="none" stroke-width="' + o.w + '" d="' + smooth(S.cum[k].map((v, i) => [x(i), y(v)])) + '"/>';
        S.bk.forEach((b, i) => { if (k === 'total' ? b.rows.some(r => avgOf(r) != null) : b.rows.some(r => r[k] != null && r[k] !== '')) {
          const cx = x(i), cy = y(S.cum[k][i]), at = 'data-k="' + k + '" data-i="' + i + '" data-cx="' + cx + '" data-cy="' + cy + '"';
          s += '<circle class="dot ' + k + '" style="--d:' + (n < 2 ? 0 : i / (n - 1)).toFixed(3) + ';--li:' + li + '" cx="' + cx + '" cy="' + cy + '" r="' + o.r + '" ' + at + '/><circle class="dot hit" cx="' + cx + '" cy="' + cy + '" r="' + o.hit + '" ' + at + '/>'; } });
      });
      return s + tx + '<line class="xh xv" style="display:none"/><line class="xh xz" style="display:none"/></svg>';
    }
    function kpi(key, rows, all, S) {
      const t = tt(), vals = rows.map(r => r[key]).filter(v => v != null && v !== '').map(Number).filter(Number.isFinite);
      const ch = chart(S, [key], { W: 300, H: 150, L: 30, f: 9, w: 1.6, r: 2.6, hit: 15, lab: 5 });
      let h = '<div class="card"><h4>' + t[key] + '</h4>';
      if (!vals.length) return h + '<div class="sm">' + t.none + '</div>' + ch + '</div>';
      const cur = vals[vals.length - 1];
      const before = all.filter(r => r[key] != null && !rows.includes(r)).map(r => Number(r[key]));
      const base = before.length ? before[before.length - 1] : vals[0];
      return h + '<div class="big">' + cur + ' <span class="sm">/ 10</span></div>' + delta(+(cur - base).toFixed(2)) + ch + '<div class="sm why" data-why="' + key + '">' + t.tap + '</div></div>';
    }
    /* the box on top: the average of the scores (out of 10), drawn in the colours of the spectrum; follows the same filter */
    function overall(rows, S) {
      const t = tt(), vals = rows.map(avgOf).filter(v => v != null), h = '<h4 class="rb">' + t.overall + '</h4>';
      if (!vals.length) return h + '<div class="sm">' + t.none + '</div>';
      const cur = vals[vals.length - 1], base = vals.length > 1 ? vals[vals.length - 2] : cur;
      return h + '<div class="big"><span class="rb">' + cur + '</span> <span class="sm">/ 10</span></div>' + delta(+(cur - base).toFixed(1)) + chart(S, ['total'], { W: 700, H: 280, L: 40, f: 11, w: 1.6, r: 2.4, hit: 16, lab: 10, grad: true });
    }

    /* ---- insights under the cards ---- */
    let BTN = [];
    function taskStats() {
      const now = D.now + (Date.now() - (D.t0 || Date.now())), c = { ok: 0, late: 0, miss: 0, open: 0 };
      (D.items || []).filter(i => i.kind === 'task' && inRange({ supply_date: i.date })).forEach(i => {
        const p = i.plan, n = p && p.n_eff, ch = i.checks || []; if (!p || !n) return;
        const done = ch.length >= n, ontime = ch.length > 0 && ch.every(x => { const o = p.opens && p.opens[x.no - 1]; return o != null && x.at - o <= 3600000; });
        if (done) c[ontime ? 'ok' : 'late']++; else if (now > p.deadline) c[ch.length ? 'late' : 'miss']++; else c.open++;
      });
      return c;
    }
    function stats(rows) {
      const t = tt(), L = lg(), cm = '<div class="sm">' + t.none2 + '</div>';
      const av = MET.map(k => { const v = rows.map(r => r[k]).filter(x => x != null && x !== '').map(Number).filter(Number.isFinite); return v.length ? { k, a: +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) } : null; }).filter(Boolean).sort((a, b) => b.a - a.a);
      const strong = av.slice(0, Math.min(2, Math.ceil(av.length / 2))), weak = av.length > 1 ? av.slice(-Math.min(2, Math.floor(av.length / 2))).reverse() : [];
      const chip = (x, cls) => '<div class="chip ' + cls + '"><span>' + t[x.k] + '</span><b>' + x.a + '</b></div>';
      const wp = rows.slice().reverse().map(r => String(r.weak_points || '').trim()).find(Boolean);
      let h = '<h4 class="rb sh">' + t.stats + '</h4><div class="grid ins">';
      h += '<div class="card"><h4>' + t.strong + '</h4>' + (strong.length ? strong.map(x => chip(x, 'g')).join('') : cm) + '</div>';
      h += '<div class="card"><h4>' + t.weak + '</h4>' + (weak.length ? weak.map(x => chip(x, 'r')).join('') : cm) + (wp ? '<div class="sm" dir="auto" style="margin-top:8px">' + esc(wp.length > 160 ? wp.slice(0, 160) + '…' : wp) + '</div>' : '') + '</div>';
      const tb = BTN.filter(b => b !== 'dash').slice(0, 5);
      h += '<div class="card"><h4>' + t.topbtn + '</h4>' + (tb.length ? tb.map((b, i) => '<div class="chip"><span>' + (i + 1) + '. ' + esc((ctx.STR[L] && ctx.STR[L]['i_' + b]) || b) + '</span></div>').join('') : cm) + '</div>';
      const ms = rows.filter(r => r.attendance != null && r.attendance !== '' && Number(r.attendance) === 0);
      h += '<div class="card"><h4>' + t.missed + '</h4><div class="big">' + ms.length + '</div>' + (ms.length ? '<div class="sm">' + t.last2 + esc(ms[ms.length - 1].supply_date) + '</div>' : '<div class="sm">' + t.noMiss + '</div>') + '</div>';
      const k = taskStats(), fin = k.ok + k.late + k.miss, ratio = fin ? k.ok / fin : null;
      const v = ratio == null ? '' : ratio >= .75 ? '<div class="up">● ' + t.good + '</div>' : ratio >= .5 ? '<div class="warn">● ' + t.warn + '</div>' : '<div class="down">● ' + t.risk + '</div>';
      h += '<div class="card"><h4>' + t.tasks + '</h4>' + (fin + k.open ? '<div class="chip g"><span>' + t.ontime + '</span><b>' + k.ok + '</b></div><div class="chip w"><span>' + t.late + '</span><b>' + k.late + '</b></div><div class="chip r"><span>' + t.miss + '</span><b>' + k.miss + '</b></div><div class="chip"><span>' + t.open + '</span><b>' + k.open + '</b></div>' + v : '<div class="sm">' + t.noTasks + '</div>') + '</div>';
      return h + '</div>';
    }

    /* ---- the screen ---- */
    function paint() {
      if (!root || !D) return;
      const keep = root.scrollTop, t = tt();
      autoApply();
      const all = D.rows, rows = CUR = all.filter(inRange), S = SER = series(rows), last = rows.length ? rows[rows.length - 1].supply_date : '';
      let h = '<div class="rrow"><div class="sm note">' + (range !== 'today' && last ? t.last + esc(last) : '') + '</div><div class="rng"><button type="button" class="thrb' + (range === 'lmonth' ? ' lm' : '') + '" aria-haspopup="true" aria-label="' + esc(t[range]) + '"><span>' + esc(t[range]) + '</span></button></div></div>';
      h += '<div class="card ov">' + overall(rows, S) + '</div>';
      h += '<div class="card two"><div><h4>' + t.sessions + '</h4><div class="big">' + rows.length + '</div></div><div class="sep"><h4>' + t.duration + '</h4><div class="big">' + fmtDur(rows.reduce((a, r) => a + mins(r), 0)) + '</div></div></div>';
      h += '<div class="grid">' + MET.map(k => kpi(k, rows, all, S)).join('') + '</div>' + stats(rows);
      root.innerHTML = h; root.scrollTop = keep;
      if (!played) { played = true; setTimeout(() => { if (root) root.querySelectorAll('svg.c2.ci').forEach(e => e.classList.add('go')); }, 60); }
    }
    /* ---- time button: pressed -> the page blurs, the other options spiral out around it as round buttons ---- */
    let rovBtn = null;
    function closeRov(now) {
      const ov = wrap && wrap.querySelector('.rov'); if (!ov) return;
      if (rovBtn) { rovBtn.style.visibility = ''; rovBtn = null; }
      if (now) { ov.remove(); return; }
      ov.classList.add('out'); setTimeout(() => ov.remove(), 180);
    }
    function openRov(btn) {
      closeRov(true);
      const t = tt(), wr = wrap.getBoundingClientRect(), r = btn.getBoundingClientRect(), W = wr.width, H = wr.height, S = 54, R = 98;
      const bx = r.left - wr.left, by = r.top - wr.top, cx = bx + r.width / 2, cy = by + r.height / 2, toLeft = cx > W / 2, others = opts().filter(k => k !== range), step = 38;
      const ov = document.createElement('div'); ov.className = 'rov';
      ov.innerHTML = '<button type="button" class="thrb pressed' + (range === 'lmonth' ? ' lm' : '') + '" style="left:' + bx + 'px;top:' + by + 'px;width:' + r.width + 'px;height:' + r.height + 'px"><span>' + esc(t[range]) + '</span></button>'
        + others.map((k, i) => {
          const a = (90 + (toLeft ? 1 : -1) * (i + 1) * step) * Math.PI / 180, x = Math.max(S / 2 + 8, Math.min(W - S / 2 - 8, cx + R * Math.cos(a))), y = Math.max(S / 2 + 8, Math.min(H - S / 2 - 8, cy + R * Math.sin(a)));
          return '<button type="button" class="thro' + (k === 'lmonth' ? ' lm' : '') + '" data-k="' + k + '" data-a="' + ((toLeft ? 1 : -1) * (i + 1) * step) + '" style="left:' + (x - S / 2) + 'px;top:' + (y - S / 2) + 'px"><span>' + esc(t[k]) + '</span></button>';
        }).join('');
      wrap.appendChild(ov); btn.style.visibility = 'hidden'; rovBtn = btn;
      requestAnimationFrame(() => { const c = ov.querySelector('.pressed'); if (c) c.classList.add('big'); });
      ov.querySelectorAll('.thro').forEach((b, i) => {
        const da = +b.dataset.a, pts = [];
        for (let q = 0; q <= 8; q++) { const p = q / 8, ang = (90 + da * p) * Math.PI / 180, fa = (90 + da) * Math.PI / 180; pts.push({ transform: 'translate(' + (R * p * Math.cos(ang) - R * Math.cos(fa)) + 'px,' + (R * p * Math.sin(ang) - R * Math.sin(fa)) + 'px) scale(' + (.3 + .7 * p) + ')', opacity: Math.min(1, p * 3) }); }
        if (b.animate) b.animate(pts, { duration: 520, delay: i * 70, easing: 'cubic-bezier(.2,.8,.25,1)', fill: 'backwards' });
      });
    }
    function say(msg) { if (root) root.innerHTML = '<div class="card msg">' + esc(msg) + '</div>'; }
    async function load(silent) {
      const id = ++loadId, t = tt();
      if (!tok()) { if (!silent) say(t.login); return; }
      if (!silent) say(t.loading);
      let d = null; try { d = await rpc('trainee_dashboard', { p_token: tok() }); } catch (e) { if (id === loadId && !silent) say(t.fail); return; }
      if (id !== loadId) return;
      if (!d || !d.profile) { if (!silent) say(t.login); return; }
      d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0')));
      d.t0 = Date.now(); try { BTN = await rpc('trainee_top_buttons', { p_token: tok(), p_limit: 8 }); } catch (e) { }
      if (id !== loadId) return;
      TZ = tzFromProfile(d.profile); D = d; if (!silent) manual = false; paint();
    }

    function dotTap(d) {
      const t = tt(), sv = d.closest('svg'), cx = +d.dataset.cx, cy = +d.dataset.cy, gl = +sv.dataset.l, gb = +sv.dataset.b, xv = sv.querySelector('.xv'), xz = sv.querySelector('.xz');
      if (xv && xz && isFinite(cx) && isFinite(cy)) { xv.setAttribute('x1', cx); xv.setAttribute('x2', cx); xv.setAttribute('y1', cy); xv.setAttribute('y2', gb); xz.setAttribute('x1', gl); xz.setAttribute('x2', cx); xz.setAttribute('y1', cy); xz.setAttribute('y2', cy); xv.style.display = ''; xz.style.display = ''; }
      const i = +d.dataset.i, k = d.dataset.k, b = SER.bk[i], v = SER.cum[k][i], r = b.rows[b.rows.length - 1];
      const sc = b.rows.reduce((a, x) => a + (k === 'total' ? (avgOf(x) || 0) : (Number(x[k]) || 0)), 0);
      const host = root; let tip = host.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip); }
      const rr = host.getBoundingClientRect(), bx = d.getBoundingClientRect();
      tip.textContent = b.label + ' · ' + t[k] + ' ' + v + ' (+' + sc + ')';
      tip.style.left = (bx.left + bx.width / 2 - rr.left + host.scrollLeft) + 'px'; tip.style.top = (bx.top - rr.top + host.scrollTop - 8) + 'px'; tip.hidden = false;
      const w = host.querySelector('[data-why="' + k + '"]'), why = k === 'performance' ? (r.why || r.performance_details) : k === 'attendance' ? (r.attendance_details || r.attendance_why) : r[k + '_details'];
      if (w) w.innerHTML = esc(b.label) + ' · +' + sc + ' → ' + v + (why ? '<br><span dir="auto">' + esc(why) + '</span>' : '');
    }

    /* ---- look (scoped to this screen only; colours follow the shell's theme variables) ---- */
    const CSS = `
.vsw{position:relative;height:100%;color:var(--ink);font-family:Cairo,Inter,system-ui,sans-serif}
.vs{position:relative;height:100%;overflow:auto;padding:16px 16px 48px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.vs::-webkit-scrollbar{display:none}
.vsw .card{max-width:1100px;margin:0 auto 32px;padding:18px;border-radius:22px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
.vsw .card.msg{text-align:center;color:var(--ink2);padding:36px 16px}
.vsw h4{margin:0 0 6px;font:800 13.5px Cairo,Inter,sans-serif;color:var(--ink)}
.vsw .big{font:800 26px/1.15 Inter,Cairo,sans-serif}.vsw .sm{font:500 12px/1.5 Cairo,Inter,sans-serif;color:var(--ink2)}.vsw .big .sm{font-size:13px}
.vsw .up{color:#22c55e;font:700 12px Inter,sans-serif}.vsw .down{color:#ef4444;font:700 12px Inter,sans-serif}.vsw .flat{color:var(--ink2);font:700 12px Inter,sans-serif}
.vsw .rrow{max-width:1100px;margin:0 auto 14px;display:grid;grid-template-columns:1fr auto;column-gap:10px;align-items:center}.vsw .rrow .note{margin:0}
.vsw .thrb{box-sizing:border-box;width:48px;height:48px;padding:3px;margin:0;border-radius:50%;border:2px solid #fff;background:#000;color:#fff;display:grid;place-items:center;text-align:center;cursor:pointer;font:700 9.5px/1.15 Inter,Cairo,sans-serif;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.4);transition:transform .3s cubic-bezier(.2,.9,.3,1.3),background .25s,color .25s,border-color .25s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vsw .thrb span,.vsw .thro span{display:block;max-width:100%;overflow-wrap:anywhere;text-wrap:balance}.vsw .rng .thrb:active{transform:scale(.93)}
#W.light .vsw .thrb{background:#fff;color:#000;border-color:#000;box-shadow:0 6px 18px rgba(15,23,42,.22)}
.vsw .thrb.lm,.vsw .thro.lm{color:#fb923c;border-color:#fb923c}
.vsw .rov{position:absolute;inset:0;z-index:30;background:rgba(2,6,23,.4);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);animation:vsIn .2s ease-out}
#W.light .vsw .rov{background:rgba(255,255,255,.35)}.vsw .rov.out{opacity:0;transition:opacity .18s}
.vsw .rov .thrb.pressed{position:absolute;z-index:31;background:#fff;color:#000;border-color:#fff;box-shadow:0 16px 44px rgba(0,0,0,.55)}
#W.light .vsw .rov .thrb.pressed{background:#000;color:#fff;border-color:#000}
.vsw .rov .thrb.pressed.lm{background:#fb923c;color:#1a0f00;border-color:#fb923c}.vsw .rov .thrb.pressed.big{transform:scale(1.25)}
.vsw .thro{position:absolute;z-index:31;box-sizing:border-box;width:54px;height:54px;padding:3px;border-radius:50%;border:2px solid #fff;background:#000;color:#fff;display:grid;place-items:center;text-align:center;cursor:pointer;font:700 10.5px/1.15 Inter,Cairo,sans-serif;overflow:hidden;box-shadow:0 10px 26px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vsw .thro:active{transform:scale(.92)}#W.light .vsw .thro{background:#fff;color:#000;border-color:#000;box-shadow:0 10px 26px rgba(15,23,42,.25)}
@keyframes vsIn{from{opacity:0}to{opacity:1}}
.vsw .two{display:flex;gap:14px}.vsw .two>div{flex:1}.vsw .sep{border-inline-start:1px solid var(--sbd);padding-inline-start:14px}
.vsw .grid{max-width:1100px;margin:0 auto 32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),340px));justify-content:center;gap:32px 28px}.vsw .grid .card{margin:0}
.vsw svg.c2{display:block;width:100%;height:auto;margin-top:6px;overflow:visible}.vsw .ov svg.c2{max-height:min(40vh,380px)}
.vsw svg.c2 .tx{fill:var(--ink2);pointer-events:none}.vsw svg.c2 .xh{stroke:var(--ink2);stroke-width:1;stroke-dasharray:3 3;pointer-events:none}
.vsw svg.c2 .ln{stroke-linecap:round;stroke-linejoin:round}.vsw svg.c2 .dot{stroke:none;cursor:pointer}.vsw svg.c2 .dot.hit{fill:transparent}
.vsw .ln.performance,.vsw .dot.performance{stroke:#ef4444;fill:#ef4444}.vsw .ln.attitude,.vsw .dot.attitude{stroke:#3b82f6;fill:#3b82f6}.vsw .ln.soft_skills,.vsw .dot.soft_skills{stroke:#10b981;fill:#10b981}
.vsw .ln.compliance,.vsw .dot.compliance{stroke:#f97316;fill:#f97316}.vsw .ln.attendance,.vsw .dot.attendance{stroke:#06b6d4;fill:#06b6d4}.vsw .ln{fill:none!important}
.vsw svg.c2.ci .ln{stroke-dasharray:1;stroke-dashoffset:1}.vsw svg.c2.ci .dot:not(.hit){opacity:0}
.vsw svg.c2.ci.go .ln{animation:vsLn 1.6s cubic-bezier(.45,.05,.2,1) forwards;animation-delay:calc(var(--li,0)*.12s)}
.vsw svg.c2.ci.go .dot:not(.hit){animation:vsDot .5s ease forwards;animation-delay:calc(var(--d,0)*1.4s + .2s)}
@keyframes vsLn{to{stroke-dashoffset:0}}@keyframes vsDot{to{opacity:1}}
@media(prefers-reduced-motion:reduce){.vsw svg.c2.ci .ln{stroke-dasharray:none;stroke-dashoffset:0;animation:none!important}.vsw svg.c2.ci .dot:not(.hit){opacity:1;animation:none!important}}
.vsw .why{margin-top:6px;min-height:18px}
.vsw .ov{position:relative;border-color:transparent}
.vsw .ov::before{content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1.5px;background:linear-gradient(90deg,#ff3b6b,#ff9f1c,#ffe14d,#2ee59d,#35c4ff,#5b7cff,#b45cff);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.vsw .rb{background:linear-gradient(90deg,#ff3b6b,#ff9f1c,#ffe14d,#2ee59d,#35c4ff,#5b7cff,#b45cff);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.vsw .dot.total{fill:url(#thOvG)}
.vsw .ov h4.rb{display:inline-block;font-size:15px}
.vsw .sh{font-size:15px;max-width:1100px;margin:0 auto 12px;display:block}.vsw .ins{margin-top:0}
.vsw .chip{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 11px;margin-top:6px;border-radius:12px;background:rgba(127,127,127,.12);font:600 12.5px Cairo,Inter,sans-serif}
.vsw .chip b{font:800 13px Inter,sans-serif}.vsw .chip.g b{color:#22c55e}.vsw .chip.r b{color:#ef4444}.vsw .chip.w b{color:#f59e0b}.vsw .warn{color:#f59e0b;font:700 12px Cairo,Inter,sans-serif;margin-top:8px}.vsw .ins .up,.vsw .ins .down{margin-top:8px;font-family:Cairo,Inter,sans-serif}
.vsw .tip{position:absolute;z-index:5;transform:translate(-50%,-100%);padding:4px 9px;border-radius:9px;background:var(--btn);color:var(--onbtn);font:700 11px Inter,Cairo,sans-serif;white-space:nowrap;pointer-events:none}`;

    function render(b) {
      stop();
      b.innerHTML = '<style>' + CSS + '</style><div class="vsw"><div class="vs"></div></div>';
      wrap = b.querySelector('.vsw'); root = b.querySelector('.vs'); lastLang = lg();
      wrap.addEventListener('click', e => {
        const q = s => (e.target.closest ? e.target.closest(s) : null);
        wrap.querySelectorAll('.tip').forEach(x => { x.hidden = true; });
        wrap.querySelectorAll('svg .xh').forEach(l => { l.style.display = 'none'; });
        let x;
        if (q('.rov')) { if ((x = q('.thro'))) { range = x.dataset.k; manual = true; closeRov(true); paint(); } else closeRov(); return; }
        if ((x = q('.thrb'))) { openRov(x); return; }
        if ((x = q('.dot'))) dotTap(x);
      });
      wrap.addEventListener('keydown', e => { if (e.key === 'Escape') closeRov(); });
      tick = setInterval(() => { if (D && root && ((!manual && range !== 'all') || (manual && !opts().includes(range)))) paint(); }, 30000);   /* a new day / month starts by itself */
      try { const W = ctx.W; if (W && window.MutationObserver) { mo = new MutationObserver(() => { if (lg() !== lastLang) { lastLang = lg(); paint(); } }); mo.observe(W, { attributes: true, attributeFilter: ['dir', 'class'] }); } } catch (e) { }
      if (D) { paint(); load(true); } else load();   /* cached data shows at once, fresh data replaces it quietly */
    }
    function stop() {
      closeRov(true);
      if (tick) { clearInterval(tick); tick = null; } if (mo) { mo.disconnect(); mo = null; } wrap = null; root = null; loadId++;
    }

    /* full: الشاشة بتاخد الـlayer كله (بتسكرول جواها) */
    return { id: 'dash', render: render, stop: stop, full: function () { return true; } };
  };
})();
