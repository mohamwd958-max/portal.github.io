/* =====================================================================
   SIDEBAR BUTTON: dash  (العلامات الحيوية / Vital Signs)
   الملف ده هو الزرار كله دلوقتي: الأيقونة + الاسم (EN/AR) + الشاشة نفسها.
   مفيش iframe ومفيش dashboard.js ولا dashboard.html: الزرار بيجيب الداتا بنفسه ويرسم جوه الـlayer مباشرة.

   اللي فضل من الداشبورد القديم (وأي حاجة تانية اتشالت):
     1) الـchart (التقدم العام + كروت الدرجات الخمسة) + فلتر الفترة (النهارده / الأسبوع / الشهر / الشهر اللي فات)
     2) الحاويات الصغيرة: الملاحظات + النصوص (TEFL) + الكلمات والأصوات (QOL)
     3) جهاز النطق: دوس على كلمة تسمع نطقها (مشغّل صغير: play / seek)

   لازم يتحط في js/buttons/ زي ما هو، وبيتحمّل قبل الـscript الرئيسي.
   home.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage, esc, MOD, cfg, tidyFrame, W ... }
   وبيقرا من الـlocalStorage نفس التوكن اللي home.html بيستخدمه: thabit_trainee_token
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
    const MET = ['performance', 'attitude', 'soft_skills', 'compliance', 'attendance'];
    const DAYS = { week: 7, month: 30, year: 365 };

    /* ---- small texts ---- */
    const T = {
      en: { today: 'Today', week: 'This week', month: 'This month', lmonth: 'Last month', all: 'Since start', sessions: 'Sessions', duration: 'Time in program',
        performance: 'Performance', attitude: 'Attitude', soft_skills: 'Soft skills', compliance: 'Compliance', attendance: 'Attendance',
        overall: 'Overall progress', none: 'No data yet', tap: 'Tap a dot to see why', notes: 'Notes', tefl: 'Passages', qol: 'Words and sounds',
        ear: 'Pronunciation', metrics: 'Scores & details', more: 'Progress details',  last: 'Last day counted: ', loading: 'Loading…', login: 'Please log in again.', fail: 'Could not load your data. Try again.',
        wmiss: 'No recording for this word yet', wfail: 'Could not load the recording', h: 'h', m: 'min' },
      ar: { today: 'اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر', lmonth: 'الشهر الماضي', all: 'منذ البداية', sessions: 'الجلسات', duration: 'وقت البرنامج',
        performance: 'الأداء', attitude: 'السلوك', soft_skills: 'المهارات الشخصية', compliance: 'الالتزام', attendance: 'الحضور',
        overall: 'التقدم العام', none: 'لا توجد بيانات بعد', tap: 'اضغط على نقطة لمعرفة السبب', notes: 'ملاحظات', tefl: 'النصوص', qol: 'الكلمات والأصوات',
        ear: 'النطق', metrics: 'الأرقام والتفاصيل', more: 'تفاصيل التقدم',  last: 'آخر يوم محسوب: ', loading: 'جاري التحميل…', login: 'سجّل دخول من جديد.', fail: 'تعذر تحميل بياناتك، حاول تاني.',
        wmiss: 'لا يوجد تسجيل لهذه الكلمة بعد', wfail: 'تعذر تحميل التسجيل', h: 'س', m: 'د' }
    };
    const lg = () => (ctx.lang() === 'ar' ? 'ar' : 'en');
    const tt = () => T[lg()];
    const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    /* ---- state ---- */
    let D = null, range = 'week', manual = false, CUR = [], SER = null, TZ = 'Africa/Cairo';
    let wrap = null, root = null, played = false, tick = null, mo = null, lastLang = null, loadId = 0;
    const WP = { urls: [], i: 0, a: null, word: '', tk: 0 };

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
    const avgOf = r => { const v = MET.map(m => r[m]).filter(x => x != null).map(Number); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; };

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
      cum.avg = bk.map((_, i) => +(MET.reduce((a, k) => a + cum[k][i], 0) / MET.length).toFixed(1));
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
      const W = o.W, H = o.H, L = o.L, R = 22, Tp = 12, B = o.f + 10, n = S.bk.length, step = Math.ceil(n / o.lab);
      const x = i => n < 2 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (n - 1), y = v => Tp + (1 - v / S.max) * (H - Tp - B);
      let s = '<svg class="c2' + (played ? '' : ' ci') + '" viewBox="0 0 ' + W + ' ' + H + '" data-l="' + L + '" data-b="' + (H - B) + '">';
      if (o.grad) s += '<defs><linearGradient id="thOvG" gradientUnits="userSpaceOnUse" x1="' + L + '" y1="0" x2="' + (W - R) + '" y2="0"><stop offset="0" stop-color="#ff5d55"/><stop offset=".34" stop-color="#ffc247"/><stop offset=".67" stop-color="#22d3a6"/><stop offset="1" stop-color="#4c8dff"/></linearGradient></defs>';
      let tx = ''; [0, S.max / 2, S.max].forEach(g => tx += '<text class="tx" x="' + (L - 6) + '" y="' + (y(g) + o.f / 3) + '" text-anchor="end" font-size="' + o.f + '">' + Math.round(g) + '</text>');
      S.bk.forEach((b, i) => { if (i % step === 0) tx += '<text class="tx" x="' + x(i) + '" y="' + (H - 3) + '" text-anchor="middle" font-size="' + o.f + '">' + b.label + '</text>'; });
      keys.forEach(k => {
        const li = keys.indexOf(k);
        s += '<path class="ln ' + k + '" pathLength="1" style="--li:' + li + (o.grad && k === 'avg' ? ';stroke:url(#thOvG)' : '') + '" fill="none" stroke-width="' + o.w + '" d="' + smooth(S.cum[k].map((v, i) => [x(i), y(v)])) + '"/>';
        if (k !== 'avg') S.bk.forEach((b, i) => { if (b.rows.some(r => r[k] != null && r[k] !== '')) {
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
    function overall(rows, S) {
      const t = tt(), vals = rows.map(avgOf).filter(v => v != null);
      if (!vals.length) return '<h4>' + t.overall + '</h4><div class="sm">' + t.none + '</div>';
      const cur = vals[vals.length - 1], base = vals.length > 1 ? vals[vals.length - 2] : cur;
      return '<h4>' + t.overall + '</h4><div class="big">' + cur + ' <span class="sm">/ 10</span></div>' + delta(+(cur - base).toFixed(1)) + chart(S, ['avg'], { W: 700, H: 300, L: 40, f: 13, w: 3, r: 3.4, hit: 20, lab: 10, grad: true });
    }

    /* ---- Notes / Passages / Words: small containers (text only) ---- */
    const EAR_DEF = { qol: 1, tefl: 0, notes: 0 };
    const earOn = k => { let s = {}; try { s = JSON.parse(localStorage.getItem('thabit_ear') || '{}') || {}; } catch (e) { } return k in s ? !!s[k] : !!EAR_DEF[k]; };
    const earSet = (k, v) => { let s = {}; try { s = JSON.parse(localStorage.getItem('thabit_ear') || '{}') || {}; } catch (e) { } s[k] = v ? 1 : 0; try { localStorage.setItem('thabit_ear', JSON.stringify(s)); } catch (e) { } };
    const plain = s => window.ThabitRich && ThabitRich.strip ? ThabitRich.strip(s) : String(s == null ? '' : s);
    const inl = s => window.ThabitRich && ThabitRich.inline ? ThabitRich.inline(esc(s)) : esc(s);
    const LNK = /\[([^\]\n]{1,200})\]\((https?:\/\/[^\s)]{3,2000})\)/g;
    /* ear on: every word (outside tags) becomes tappable -> the pronouncer. If ThabitRich is loaded it makes its own .vx words, so we don't double-wrap. */
    const wordify = h => window.ThabitRich ? h : h.replace(/(<[^>]+>)|([^<\s]+)/g, (m, tag, w) => tag ? tag : '<span class="vx" role="button" tabindex="0" data-word="' + esc(w.replace(/&[a-z#0-9]+;/gi, '')) + '">' + w + '</span>');
    function escv(s, ear) {
      s = String(s == null ? '' : s); let out = '', last = 0, m; LNK.lastIndex = 0;
      const f = x => { const h = inl(x).replace(/(<[^>]+>)|\s*\|\s*/g, (mm, tag) => tag ? tag : '<i class="vb"></i>'); return ear ? wordify(h) : h; };
      while ((m = LNK.exec(s))) { out += f(s.slice(last, m.index)) + '<a class="alk" href="' + esc(m[2]) + '" target="_blank" rel="noopener noreferrer">' + esc(m[1]) + '</a>'; last = m.index + m[0].length; }
      return out + f(s.slice(last));
    }
    function rich(txt, ear) {
      return String(txt || '').trim().split(/\n\s*\n/).filter(b => b.trim()).map(b => {
        const ls = b.split('\n').map(l => l.trimEnd()).filter(l => l.trim()), NUM = /^\s*(\d+|[a-zA-Z])[.)]\s+/, BUL = /^\s*[-•*]\s+/;
        if (ls.every(l => NUM.test(l))) return '<ol class="rl" dir="auto"' + (/^\s*[a-zA-Z][.)]/.test(ls[0]) ? ' type="a"' : '') + '>' + ls.map(l => '<li>' + escv(l.replace(NUM, ''), ear) + '</li>').join('') + '</ol>';
        if (ls.every(l => BUL.test(l))) return '<ul class="rl" dir="auto">' + ls.map(l => '<li>' + escv(l.replace(BUL, ''), ear) + '</li>').join('') + '</ul>';
        return '<p class="rp" dir="auto">' + ls.map(l => escv(l, ear)).join('<br>') + '</p>';
      }).join('');
    }
    const EARSVG = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 9a4 4 0 1 1 8 0c0 2.2-1.4 3.1-2.5 4.2-.9.9-1.5 1.7-1.5 3a3.2 3.2 0 0 1-3.2 3.2"/><path d="M13.5 9a.5.5 0 1 1 1 0c0 .8-.6 1.1-1 1.5"/><path d="M4.6 9.2a5.6 5.6 0 0 0 0 5.6M2 7.4a8.8 8.8 0 0 0 0 9.2"/></svg>';
    const LISTS = {};
    function cap(rows, key, title) {
      const t = tt(), on = earOn(key);
      const list = LISTS[key] = rows.slice().reverse().filter(r => r[key]).map(r => ({ date: r.supply_date, text: String(r[key]) }));
      const it = list.map((x, n) => '<div class="cap" data-n="' + n + '"><span class="dt">' + esc(x.date) + '</span><span class="ct" dir="auto">' + esc(plain(x.text).replace(/\s+/g, ' ').slice(0, 70)) + '</span></div>').join('');
      return '<div class="card earc" data-key="' + key + '"><div class="earh"><h4>' + title + '</h4><div class="earbar"><button type="button" class="ear' + (on ? ' on' : '') + '" data-ear="' + key + '" aria-pressed="' + on + '" aria-label="' + t.ear + '" title="' + t.ear + '">' + EARSVG + '</button></div></div><div class="lst">' + (it || '<div class="sm">' + t.none + '</div>') + '</div></div>';
    }
    /* one cell and a quarter of the next one; nothing scrolls inside, a tap anywhere on the container opens all of it */
    function fitCaps() {
      if (!root) return;
      root.querySelectorAll('.earc .lst').forEach(l => {
        const c = [...l.children].filter(x => x.classList.contains('cap')); l.style.maxHeight = '';
        if (!c.length || !c[0].offsetHeight) return;
        if (c.length < 2) { l.style.maxHeight = 'none'; return; }
        l.style.maxHeight = (c[0].offsetHeight + (parseFloat(getComputedStyle(c[0]).marginBottom) || 0) + c[1].offsetHeight * 0.25) + 'px';
      });
    }

    /* ---- the screen ---- */
    const ARR = '<svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" fill="currentColor"/><g class="pq"><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" fill="none" stroke="#fbbf24" stroke-width="1.6"/><path d="M17.25 15.6v3.8M15.35 17.5h3.8" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round"/></g></svg>';
    function paint() {
      if (!root || !D) return;
      const keep = root.scrollTop, t = tt();
      autoApply();
      const all = D.rows, rows = CUR = all.filter(inRange), S = SER = series(rows), last = rows.length ? rows[rows.length - 1].supply_date : '';
      let h = '<div class="rrow"><div class="sm note">' + (range !== 'today' && last ? t.last + esc(last) : '') + '</div><div class="rng"><button type="button" class="thrb' + (range === 'lmonth' ? ' lm' : '') + '" aria-haspopup="true" aria-label="' + esc(t[range]) + '"><span>' + esc(t[range]) + '</span></button></div></div>';
      h += '<div class="card ov">' + overall(rows, S) + '</div>';
      h += '<button type="button" class="tharr" aria-label="' + esc(t.more) + '">' + ARR + '</button>';
      h += '<div class="grid lists">' + cap(all, 'notes', t.notes) + cap(all, 'tefl', t.tefl) + cap(all, 'qol', t.qol) + '</div>';
      root.innerHTML = h; root.scrollTop = keep;
      requestAnimationFrame(fitCaps); setTimeout(fitCaps, 350);
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
    /* ---- details pop-up: the five score cards (only when the small button under the chart is pressed) ---- */
    function closeDet() { const e = wrap && wrap.querySelector('.det'); if (e) e.remove(); }
    function openDet() {
      closeDet(); closeRov(true); if (!D) return;
      const t = tt(), rows = CUR, all = D.rows, S = SER, el = document.createElement('div'); el.className = 'ov2 det';
      el.innerHTML = '<div class="tdb"><button type="button" class="tdx" aria-label="Close">×</button><div class="tdh"><b>' + t.metrics + '</b><span>' + esc(t[range] + ' · ' + rows.length + ' ' + t.sessions + ' · ' + fmtDur(rows.reduce((a, r) => a + mins(r), 0))) + '</span></div><div class="grid">' + MET.map(k => kpi(k, rows, all, S)).join('') + '</div></div>';
      wrap.appendChild(el);
    }
    /* ---- container pop-up: every entry of Notes / Passages / Words, the tapped one first in view ---- */
    function closeCm() { const e = wrap && wrap.querySelector('.cm'); if (e) e.remove(); }
    function openCm(key, n) {
      closeCm(); const t = tt(), on = earOn(key), title = key === 'notes' ? t.notes : key === 'tefl' ? t.tefl : t.qol, list = LISTS[key] || [];
      const el = document.createElement('div'); el.className = 'ov2 cm';
      el.innerHTML = '<div class="cmb"><button type="button" class="tdx cmx" aria-label="Close">×</button><h4 class="cmh">' + esc(title) + '</h4><div class="cml">' + (list.map((x, i) => '<div class="ce" data-n="' + i + '"><div class="dt">' + esc(x.date) + '</div>' + rich(x.text, on) + '</div>').join('') || '<div class="sm">' + t.none + '</div>') + '</div></div>';
      wrap.appendChild(el);
      const l = el.querySelector('.cml'), c = l.querySelector('.ce[data-n="' + n + '"]'); if (c) l.scrollTop = c.offsetTop - 4;
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
      TZ = tzFromProfile(d.profile); D = d; if (!silent) manual = false; paint();
    }

    /* ---- chart dot tap: crosshair + tooltip + the reason under the card ---- */
    function dotTap(d) {
      const t = tt(), sv = d.closest('svg'), cx = +d.dataset.cx, cy = +d.dataset.cy, gl = +sv.dataset.l, gb = +sv.dataset.b, xv = sv.querySelector('.xv'), xz = sv.querySelector('.xz');
      if (xv && xz && isFinite(cx) && isFinite(cy)) { xv.setAttribute('x1', cx); xv.setAttribute('x2', cx); xv.setAttribute('y1', cy); xv.setAttribute('y2', gb); xz.setAttribute('x1', gl); xz.setAttribute('x2', cx); xz.setAttribute('y1', cy); xz.setAttribute('y2', cy); xv.style.display = ''; xz.style.display = ''; }
      const i = +d.dataset.i, k = d.dataset.k, b = SER.bk[i], v = SER.cum[k][i], r = b.rows[b.rows.length - 1];
      const sc = b.rows.reduce((a, x) => a + (Number(x[k]) || 0), 0);
      const host = d.closest('.tdb') || root; let tip = host.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip); }
      const rr = host.getBoundingClientRect(), bx = d.getBoundingClientRect();
      tip.textContent = b.label + ' · ' + t[k] + ' ' + v + ' (+' + sc + ')';
      tip.style.left = (bx.left + bx.width / 2 - rr.left + host.scrollLeft) + 'px'; tip.style.top = (bx.top - rr.top + host.scrollTop - 8) + 'px'; tip.hidden = false;
      const w = host.querySelector('[data-why="' + k + '"]'), why = k === 'performance' ? (r.why || r.performance_details) : k === 'attendance' ? (r.attendance_details || r.attendance_why) : r[k + '_details'];
      if (w) w.innerHTML = esc(b.label) + ' · +' + sc + ' → ' + v + (why ? '<br><span dir="auto">' + esc(why) + '</span>' : '');
    }

    /* ---- the pronouncer (tap a word -> its recording from words_table) ---- */
    const fmtS = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    const PLAY = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', PAUSE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
    function wpClose() { WP.tk++; if (WP.a) { try { WP.a.pause(); } catch (e) { } WP.a = null; } const el = wrap && wrap.querySelector('.wp'); if (el) el.remove(); }
    function wpMsg(m) { const el = wrap && wrap.querySelector('.wp'); if (!el) return; el.querySelector('.wpr').style.display = 'none'; const x = el.querySelector('.wpm'); x.textContent = m; x.hidden = false; }
    function wpLoad(auto) {
      const el = wrap && wrap.querySelector('.wp'); if (!el) return;
      if (WP.a) { try { WP.a.pause(); } catch (e) { } }
      const a = WP.a = new Audio(WP.urls[WP.i]), my = WP.tk;
      const pb = el.querySelector('.wpp'), sk = el.querySelector('input'), tm = el.querySelector('.wpt'), part = el.querySelector('.wpn');
      let drag = false; const live = () => my === WP.tk && WP.a === a;
      const sync = () => { if (!live()) return; const d = a.duration || 0; if (!drag) sk.value = d ? Math.round(a.currentTime / d * 1000) : 0; tm.textContent = fmtS(a.currentTime) + ' / ' + fmtS(d); };
      const icon = () => { if (live()) pb.innerHTML = a.paused ? PLAY : PAUSE; };
      part.textContent = WP.urls.length > 1 ? (WP.i + 1) + '/' + WP.urls.length : '';
      a.ontimeupdate = sync; a.onloadedmetadata = sync; a.onplay = icon; a.onpause = icon;
      a.onended = () => { if (!live()) return; if (WP.i < WP.urls.length - 1) { WP.i++; setTimeout(() => { if (my === WP.tk) wpLoad(true); }, 350); } else { a.currentTime = 0; sync(); icon(); } };
      a.onerror = () => { if (live()) wpMsg(tt().wfail); };
      pb.onclick = () => { if (a.paused) a.play().catch(() => { }); else a.pause(); };
      sk.oninput = () => { drag = true; if (a.duration) { a.currentTime = sk.value / 1000 * a.duration; tm.textContent = fmtS(a.currentTime) + ' / ' + fmtS(a.duration); } };
      sk.onchange = () => { drag = false; };
      sk.value = 0; sync(); icon(); if (auto) a.play().catch(() => { });
    }
    const wpClean = v => !v ? '' : String(v).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"\u201C\u201D\u2018\u2019]/g, '').replace(/\s+/g, ' ').trim();
    const wpParts = v => String(v || '').split(/[,\u060C\n]+/).map(x => x.trim()).filter(Boolean);
    const wpCache = {}; let wpKeyOK = true;
    async function wpQuery(qs) {
      const r = await fetch(SB + '/rest/v1/words_table?select=audio_url&audio_url=not.is.null&limit=1&' + qs, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
      if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
      const rows = await r.json(); return Array.isArray(rows) && rows[0] ? rows[0].audio_url : null;
    }
    async function wpLookup(word) {
      const c = wpClean(word); if (!c) return null; if (wpCache[c]) return wpCache[c];
      let u = null;
      if (wpKeyOK) { try { u = await wpQuery('word_key=eq.' + encodeURIComponent(c)); } catch (e) { if (e.status === 400 || e.status === 404) wpKeyOK = false; else throw e; } }
      if (!u) u = await wpQuery('word=ilike.' + encodeURIComponent(String(word).trim().replace(/[\\%_]/g, m => '\\' + m)));
      if (u) wpCache[c] = u; return u;
    }
    async function wpResolve(text) {
      const u = await wpLookup(text); if (u) return [u];
      const parts = wpParts(text); if (parts.length < 2) return null;
      const us = await Promise.all(parts.map(wpLookup)); return us.every(Boolean) ? us : null;
    }
    async function wpOpen(word) {
      word = String(word == null ? '' : word).trim(); if (!word || !wrap) return;
      wpClose();
      const my = ++WP.tk; WP.word = word; WP.urls = []; WP.i = 0;
      const el = document.createElement('div'); el.className = 'wp';
      el.innerHTML = '<div class="wpw" dir="auto">' + esc(word) + '</div><div class="wpr" dir="ltr"><button type="button" class="wpb wpp" aria-label="Play/Pause">' + PLAY + '</button><input type="range" min="0" max="1000" value="0" aria-label="Seek"><span class="wpt">0:00 / 0:00</span><span class="wpn"></span></div><div class="wpm" dir="auto" hidden></div>';
      wrap.appendChild(el);
      let urls; try { urls = await wpResolve(word); } catch (e) { urls = undefined; }
      if (my !== WP.tk) return;
      if (!urls) { wpMsg(urls === null ? tt().wmiss : tt().wfail); return; }
      WP.urls = urls; wpLoad(true);
    }

    /* ---- look (scoped to this screen only; colours follow the shell's theme variables) ---- */
    const CSS = `
.vsw{position:relative;height:100%;color:var(--ink);font-family:Cairo,Inter,system-ui,sans-serif}
.vs{position:relative;height:100%;overflow:auto;padding:12px 12px 40px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.vs::-webkit-scrollbar{display:none}
.vsw .card{max-width:1100px;margin:0 auto 20px;padding:16px;border-radius:22px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
.vsw .card.msg{text-align:center;color:var(--ink2);padding:36px 16px}
.vsw h4{margin:0 0 6px;font:800 13.5px Cairo,Inter,sans-serif;color:var(--ink)}
.vsw .big{font:800 26px/1.15 Inter,Cairo,sans-serif}.vsw .sm{font:500 12px/1.5 Cairo,Inter,sans-serif;color:var(--ink2)}.vsw .big .sm{font-size:13px}
.vsw .up{color:#22c55e;font:700 12px Inter,sans-serif}.vsw .down{color:#ef4444;font:700 12px Inter,sans-serif}.vsw .flat{color:var(--ink2);font:700 12px Inter,sans-serif}
.vsw .rrow{max-width:1100px;margin:0 auto 8px;display:grid;grid-template-columns:1fr auto;column-gap:10px;align-items:center}.vsw .rrow .note{margin:0}
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
.vsw .tharr{display:flex;align-items:center;justify-content:center;width:48px;height:48px;margin:14px auto 22px;padding:0;border-radius:50%;border:1px solid var(--gbd);background:var(--gbg);color:var(--ink);cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .2s,transform .2s;-webkit-tap-highlight-color:transparent}
.vsw .tharr:hover{background:rgba(251,191,36,.18)}.vsw .tharr:active{transform:scale(.92)}.vsw .tharr svg{display:block;overflow:visible}
.vsw .tharr .pq{transform-box:fill-box;transform-origin:center;animation:vsPls 2s ease-in-out infinite}
@keyframes vsPls{0%,60%,100%{transform:scale(1) rotate(0)}30%{transform:scale(1.22) rotate(90deg)}}
.vsw .ov2{position:absolute;inset:0;z-index:25;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.45);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);animation:vsIn .25s ease-out}
#W.light .vsw .ov2{background:rgba(255,255,255,.4)}
.vsw .tdb,.vsw .cmb{position:relative;box-sizing:border-box;width:min(1000px,100%);max-height:100%;overflow:auto;border-radius:24px;padding:18px 14px 14px;background:rgba(15,23,42,.94);color:#e2e8f0;border:1px solid rgba(148,163,184,.25);box-shadow:0 20px 60px rgba(0,0,0,.5);overscroll-behavior:contain;scrollbar-width:none;animation:vsPop .32s cubic-bezier(.2,.9,.3,1.15)}
#W.light .vsw .tdb,#W.light .vsw .cmb{background:rgba(255,255,255,.97);color:#0f172a}
.vsw .tdb h4,.vsw .cmb h4{color:inherit}.vsw .tdb .sm,.vsw .cmb .sm{color:inherit;opacity:.7}.vsw .tdb .card{background:rgba(148,163,184,.1)}
@keyframes vsPop{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:none}}
.vsw .tdh{display:flex;flex-direction:column;gap:2px;margin:0 36px 12px;text-align:center}.vsw .tdh span{font-size:.78rem;opacity:.7}
.vsw .tdx{position:absolute;top:8px;inset-inline-end:10px;z-index:2;width:30px;height:30px;border:0;border-radius:50%;background:rgba(148,163,184,.18);color:inherit;font-size:1.2rem;line-height:1;cursor:pointer}
.vsw .tdb .grid{margin-bottom:0}.vsw .cmb{width:min(560px,100%);max-height:100%;display:flex;flex-direction:column;padding-top:16px}.vsw .cmh{text-align:center;margin:0 36px 10px;font-size:15px}
.vsw .cml{position:relative;overflow:auto;scrollbar-width:none}.vsw .cml::-webkit-scrollbar{display:none}
.vsw .ce{margin:0 0 12px;padding:10px;border-radius:16px;background:rgba(148,163,184,.1)}.vsw .ce .dt{margin-bottom:4px;color:inherit;opacity:.65;font:700 11px Inter,sans-serif;direction:ltr;text-align:start}
.vsw .grid{max-width:1100px;margin:0 auto 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px 10px}.vsw .grid .card{margin:0}
.vsw .lists{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
@media(max-width:600px){.vsw .lists{grid-template-columns:1fr 1fr}.vsw .lists>:first-child{grid-column:1/-1}}
.vsw svg.c2{display:block;width:100%;height:auto;margin-top:6px;overflow:visible}.vsw .ov svg.c2{max-height:min(40vh,380px)}
.vsw svg.c2 .tx{fill:var(--ink2);pointer-events:none}.vsw svg.c2 .xh{stroke:var(--ink2);stroke-width:1;stroke-dasharray:3 3;pointer-events:none}
.vsw svg.c2 .ln{stroke-linecap:round;stroke-linejoin:round}.vsw svg.c2 .dot{stroke:none;cursor:pointer}.vsw svg.c2 .dot.hit{fill:transparent}
.vsw .ln.performance,.vsw .dot.performance{stroke:#ef4444;fill:#ef4444}.vsw .ln.attitude,.vsw .dot.attitude{stroke:#3b82f6;fill:#3b82f6}.vsw .ln.soft_skills,.vsw .dot.soft_skills{stroke:#10b981;fill:#10b981}
.vsw .ln.compliance,.vsw .dot.compliance{stroke:#f97316;fill:#f97316}.vsw .ln.attendance,.vsw .dot.attendance{stroke:#06b6d4;fill:#06b6d4}.vsw .ln{fill:none!important}
.vsw svg.c2.ci .ln{stroke-dasharray:1;stroke-dashoffset:1}.vsw svg.c2.ci .dot:not(.hit){opacity:0}
.vsw svg.c2.ci.go .ln{animation:vsLn 1.6s cubic-bezier(.45,.05,.2,1) forwards;animation-delay:calc(var(--li,0)*.12s)}
.vsw svg.c2.ci.go .dot:not(.hit){animation:vsDot .5s ease forwards;animation-delay:calc(var(--d,0)*1.4s + .2s)}
@keyframes vsLn{to{stroke-dashoffset:0}}@keyframes vsDot{to{opacity:1}}
@media(prefers-reduced-motion:reduce){.vsw svg.c2.ci .ln{stroke-dasharray:none;stroke-dashoffset:0;animation:none!important}.vsw svg.c2.ci .dot:not(.hit){opacity:1;animation:none!important}.vsw .tharr .pq,.vsw .ear.shk,.vsw .ear.cls{animation:none!important}}
.vsw .why{margin-top:6px;min-height:18px}
.vsw .tip{position:absolute;z-index:5;transform:translate(-50%,-100%);padding:4px 9px;border-radius:9px;background:var(--btn);color:var(--onbtn);font:700 11px Inter,Cairo,sans-serif;white-space:nowrap;pointer-events:none}
.vsw .earc{min-height:190px;padding:16px 14px 14px;border-radius:28px;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.vsw .earh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}.vsw .earh h4{margin:0;font-size:14.5px}
.vsw .ear{width:38px;height:38px;flex:none;border-radius:50%;border:1px solid var(--gbd);background:var(--chip);color:var(--ink2);display:grid;place-items:center;padding:0;cursor:pointer;transition:background .35s,color .35s,border-color .35s}
.vsw .ear.on{background:rgba(52,211,153,.18);border-color:#34d399;color:#34d399}
.vsw .ear.shk{animation:vsShk .7s ease}.vsw .ear.cls{animation:vsCls .5s ease}
@keyframes vsShk{0%,100%{transform:rotate(0) scale(1)}15%{transform:rotate(-16deg) scale(1.12)}35%{transform:rotate(13deg) scale(1.12)}55%{transform:rotate(-8deg) scale(1.05)}75%{transform:rotate(4deg)}}
@keyframes vsCls{0%{transform:scale(1.1)}100%{transform:scale(1)}}
.vsw .lst{overflow:hidden}
.vsw .cap{display:block;box-sizing:border-box;width:100%;padding:9px 12px;margin:0 0 8px;border-radius:16px;background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.22);text-align:center;font:600 13px Cairo,Inter,sans-serif;color:var(--ink)}
.vsw .cap .dt{display:block;margin-bottom:2px;color:var(--ink2);font:700 12px Inter,sans-serif}.vsw .cap .ct{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vsw .rp,.vsw .rl{margin:0 0 8px;padding:8px 12px;border-radius:12px;background:rgba(148,163,184,.1);font:500 13px/1.7 Cairo,Inter,sans-serif}.vsw .rl{padding-inline-start:30px}
.vsw .vx{cursor:pointer;border-radius:4px;color:#38bdf8}.vsw .vx:hover{background:rgba(56,189,248,.15)}.vsw .alk{color:#38bdf8}.vsw .vb{display:inline-block;width:1px;height:.9em;margin:0 8px;background:currentColor;opacity:.5;vertical-align:middle}
.vsw>.wp{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);width:min(92%,360px);z-index:40;box-sizing:border-box;padding:12px 14px;border-radius:16px;background:rgba(15,23,42,.97);color:#e2e8f0;border:1px solid rgba(148,163,184,.3);box-shadow:0 12px 36px rgba(0,0,0,.45)}
#W.light .vsw>.wp{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}
.wpw{font-weight:700;margin-bottom:8px;text-align:center;overflow-wrap:anywhere}.wpr{display:flex;align-items:center;gap:8px}
.wpb{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:#34d399;color:#06281b;cursor:pointer;display:flex;align-items:center;justify-content:center}
.vsw .wp input[type=range]{flex:1;min-width:0;accent-color:#34d399}.wpt{flex:none;font-size:.68rem;opacity:.75;font-variant-numeric:tabular-nums}.wpn{flex:none;font-size:.68rem;opacity:.6}.wpm{font-size:.82rem;text-align:center;opacity:.85}`;

    let onResize = null;
    function render(b) {
      stop();
      b.innerHTML = '<style>' + CSS + '</style><div class="vsw"><div class="vs"></div></div>';
      wrap = b.querySelector('.vsw'); root = b.querySelector('.vs'); lastLang = lg();
      wrap.addEventListener('click', e => {
        const q = s => (e.target.closest ? e.target.closest(s) : null);
        wrap.querySelectorAll('.tip').forEach(x => { x.hidden = true; });
        wrap.querySelectorAll('svg .xh').forEach(l => { l.style.display = 'none'; });
        let x;
        if ((x = q('.ear'))) {   /* turn the pronunciation on (green + a little shake) or off */
          e.stopPropagation(); const k = x.dataset.ear, on = !earOn(k); earSet(k, on);
          x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); x.classList.remove('shk', 'cls'); void x.offsetWidth; x.classList.add(on ? 'shk' : 'cls'); setTimeout(() => x.classList.remove('shk', 'cls'), 1100); return;
        }
        if ((x = q('.vx'))) { e.preventDefault(); wpOpen(x.dataset.word); return; }
        if (q('.rov')) { if ((x = q('.thro'))) { range = x.dataset.k; manual = true; closeRov(true); paint(); } else closeRov(); return; }
        if ((x = q('.thrb'))) { openRov(x); return; }
        if (q('.tharr')) { openDet(); return; }
        if (q('.det')) { if ((x = q('.dot'))) { dotTap(x); return; } if (q('.tdx') || !q('.tdb')) closeDet(); return; }
        if (q('.cm')) { if (q('.cmx') || !q('.cmb')) closeCm(); else if (!q('.wp')) wpClose(); return; }
        if ((x = q('.dot'))) { dotTap(x); return; }
        if ((x = q('.earc'))) { const c = q('.cap'); openCm(x.dataset.key, c ? +c.dataset.n : 0); return; }
        if (!q('.wp')) wpClose();
      });
      wrap.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeRov(); closeDet(); closeCm(); return; }
        if (e.key !== 'Enter' && e.key !== ' ') return; const x = e.target.closest && e.target.closest('.vx'); if (x) { e.preventDefault(); wpOpen(x.dataset.word); }
      });
      onResize = () => fitCaps(); window.addEventListener('resize', onResize);
      tick = setInterval(() => { if (D && root && ((!manual && range !== 'all') || (manual && !opts().includes(range)))) paint(); }, 30000);   /* a new day / month starts by itself */
      try { const W = ctx.W; if (W && window.MutationObserver) { mo = new MutationObserver(() => { if (lg() !== lastLang) { lastLang = lg(); paint(); } }); mo.observe(W, { attributes: true, attributeFilter: ['dir', 'class'] }); } } catch (e) { }
      if (D) { paint(); load(true); } else load();   /* cached data shows at once, fresh data replaces it quietly */
    }
    function stop() {
      closeRov(true); closeDet(); closeCm(); wpClose();
      if (onResize) { window.removeEventListener('resize', onResize); onResize = null; }
      if (tick) { clearInterval(tick); tick = null; } if (mo) { mo.disconnect(); mo = null; } wrap = null; root = null; loadId++;
    }

    /* full: الشاشة بتاخد الـlayer كله (بتسكرول جواها) */
    return { id: 'dash', render: render, stop: stop, full: function () { return true; } };
  };
})();
