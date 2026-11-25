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
        ear: 'Pronunciation', last: 'Last day counted: ', loading: 'Loading…', login: 'Please log in again.', fail: 'Could not load your data. Try again.',
        wmiss: 'No recording for this word yet', wfail: 'Could not load the recording', h: 'h', m: 'min' },
      ar: { today: 'اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر', lmonth: 'الشهر الماضي', all: 'منذ البداية', sessions: 'الجلسات', duration: 'وقت البرنامج',
        performance: 'الأداء', attitude: 'السلوك', soft_skills: 'المهارات الشخصية', compliance: 'الالتزام', attendance: 'الحضور',
        overall: 'التقدم العام', none: 'لا توجد بيانات بعد', tap: 'اضغط على نقطة لمعرفة السبب', notes: 'ملاحظات', tefl: 'النصوص', qol: 'الكلمات والأصوات',
        ear: 'النطق', last: 'آخر يوم محسوب: ', loading: 'جاري التحميل…', login: 'سجّل دخول من جديد.', fail: 'تعذر تحميل بياناتك، حاول تاني.',
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
    const EARSVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>';
    function cap(rows, key, title) {
      const t = tt(), on = earOn(key);
      const list = rows.slice().reverse().filter(r => r[key]).map(r => ({ date: r.supply_date, text: String(r[key]) }));
      const it = list.map(x => '<div class="capi"><button type="button" class="cap" aria-expanded="false"><span class="dt">' + esc(x.date) + '</span><span dir="auto">' + esc(plain(x.text).replace(/\s+/g, ' ').slice(0, 70)) + '</span></button><div class="capb" hidden>' + rich(x.text, on) + '</div></div>').join('');
      return '<div class="card"><div class="earh"><h4>' + title + '</h4><button type="button" class="ear' + (on ? ' on' : '') + '" data-ear="' + key + '" aria-pressed="' + on + '" aria-label="' + t.ear + '" title="' + t.ear + '">' + EARSVG + '</button></div><div class="lst">' + (it || '<div class="sm">' + t.none + '</div>') + '</div></div>';
    }

    /* ---- the screen ---- */
    function paint() {
      if (!root || !D) return;
      const keep = root.scrollTop, t = tt();
      autoApply();
      const all = D.rows, rows = CUR = all.filter(inRange), S = SER = series(rows), last = rows.length ? rows[rows.length - 1].supply_date : '';
      let h = '<div class="rbar">' + opts().map(k => '<button type="button" class="rb' + (k === range ? ' on' : '') + (k === 'lmonth' ? ' lm' : '') + '" data-k="' + k + '">' + esc(t[k]) + '</button>').join('') + '</div>';
      if (range !== 'today' && last) h += '<div class="sm note">' + t.last + esc(last) + '</div>';
      h += '<div class="card two"><div><h4>' + t.sessions + '</h4><div class="big">' + rows.length + '</div></div><div class="sep"><h4>' + t.duration + '</h4><div class="big">' + fmtDur(rows.reduce((a, r) => a + mins(r), 0)) + '</div></div></div>';
      h += '<div class="card ov">' + overall(rows, S) + '</div>';
      h += '<div class="grid">' + MET.map(k => kpi(k, rows, all, S)).join('') + '</div>';
      h += '<div class="grid">' + cap(all, 'notes', t.notes) + cap(all, 'tefl', t.tefl) + cap(all, 'qol', t.qol) + '</div><div class="tip" hidden></div>';
      root.innerHTML = h; root.scrollTop = keep;
      if (!played) { played = true; setTimeout(() => { if (root) root.querySelectorAll('svg.c2.ci').forEach(e => e.classList.add('go')); }, 60); }
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
      const tip = root.querySelector('.tip'), rr = root.getBoundingClientRect(), bx = d.getBoundingClientRect();
      tip.textContent = b.label + ' · ' + t[k] + ' ' + v + ' (+' + sc + ')';
      tip.style.left = (bx.left + bx.width / 2 - rr.left + root.scrollLeft) + 'px'; tip.style.top = (bx.top - rr.top + root.scrollTop - 8) + 'px'; tip.hidden = false;
      const w = root.querySelector('[data-why="' + k + '"]'), why = k === 'performance' ? (r.why || r.performance_details) : k === 'attendance' ? (r.attendance_details || r.attendance_why) : r[k + '_details'];
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
.vsw{position:relative;height:100%;color:var(--ink)}
.vs{position:relative;height:100%;overflow:auto;padding:12px 12px 40px;scrollbar-width:none;-webkit-overflow-scrolling:touch;font-family:Cairo,Inter,system-ui,sans-serif}
.vs::-webkit-scrollbar{display:none}
.vs .card{max-width:1100px;margin:0 auto 12px;padding:16px;border-radius:22px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
.vs .card.msg{text-align:center;color:var(--ink2);padding:36px 16px}
.vs h4{margin:0 0 6px;font:800 13.5px Cairo,Inter,sans-serif;color:var(--ink)}
.vs .big{font:800 26px/1.15 Inter,Cairo,sans-serif}.vs .sm{font:500 12px/1.5 Cairo,Inter,sans-serif;color:var(--ink2)}.vs .big .sm{font-size:13px}
.vs .note{max-width:1100px;margin:-4px auto 10px;padding:0 6px}
.vs .up{color:#22c55e;font:700 12px Inter,sans-serif}.vs .down{color:#ef4444;font:700 12px Inter,sans-serif}.vs .flat{color:var(--ink2);font:700 12px Inter,sans-serif}
.vs .rbar{max-width:1100px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap}
.vs .rb{height:34px;padding:0 14px;border-radius:17px;border:1px solid var(--gbd);background:var(--gbg);color:var(--ink);font:700 12px Cairo,Inter,sans-serif;cursor:pointer;transition:background .25s,color .25s}
.vs .rb.on{background:var(--btn);color:var(--onbtn);border-color:var(--btn)}.vs .rb.lm{color:#fb923c;border-color:#fb923c}.vs .rb.lm.on{background:#fb923c;color:#1a0f00}
.vs .two{display:flex;gap:14px}.vs .two>div{flex:1}.vs .sep{border-inline-start:1px solid var(--sbd);padding-inline-start:14px}
.vs .grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.vs .grid .card{margin:0}
.vs svg.c2{display:block;width:100%;height:auto;margin-top:6px;overflow:visible}
.vs svg.c2 .tx{fill:var(--ink2);pointer-events:none}.vs svg.c2 .xh{stroke:var(--ink2);stroke-width:1;stroke-dasharray:3 3;pointer-events:none}
.vs svg.c2 .ln{stroke-linecap:round;stroke-linejoin:round}.vs svg.c2 .dot{stroke:none;cursor:pointer}.vs svg.c2 .dot.hit{fill:transparent}
.vs .ln.performance,.vs .dot.performance{stroke:#ef4444;fill:#ef4444}.vs .ln.attitude,.vs .dot.attitude{stroke:#3b82f6;fill:#3b82f6}.vs .ln.soft_skills,.vs .dot.soft_skills{stroke:#10b981;fill:#10b981}
.vs .ln.compliance,.vs .dot.compliance{stroke:#f97316;fill:#f97316}.vs .ln.attendance,.vs .dot.attendance{stroke:#06b6d4;fill:#06b6d4}.vs .ln{fill:none!important}
.vs svg.c2.ci .ln{stroke-dasharray:1;stroke-dashoffset:1}.vs svg.c2.ci .dot:not(.hit){opacity:0}
.vs svg.c2.ci.go .ln{animation:vsLn 1.6s cubic-bezier(.45,.05,.2,1) forwards;animation-delay:calc(var(--li,0)*.12s)}
.vs svg.c2.ci.go .dot:not(.hit){animation:vsDot .5s ease forwards;animation-delay:calc(var(--d,0)*1.4s + .2s)}
@keyframes vsLn{to{stroke-dashoffset:0}}@keyframes vsDot{to{opacity:1}}
@media(prefers-reduced-motion:reduce){.vs svg.c2.ci .ln{stroke-dasharray:none;stroke-dashoffset:0;animation:none!important}.vs svg.c2.ci .dot:not(.hit){opacity:1;animation:none!important}}
.vs .why{margin-top:6px;min-height:18px}
.vs .tip{position:absolute;z-index:5;transform:translate(-50%,-100%);padding:4px 9px;border-radius:9px;background:var(--btn);color:var(--onbtn);font:700 11px Inter,Cairo,sans-serif;white-space:nowrap;pointer-events:none}
.vs .earh{display:flex;align-items:center;justify-content:space-between;gap:8px}.vs .earh h4{margin:0}
.vs .ear{width:32px;height:32px;border-radius:50%;border:1px solid var(--gbd);background:transparent;color:var(--ink2);display:grid;place-items:center;cursor:pointer}
.vs .ear.on{background:#34d399;color:#06281b;border-color:#34d399}
.vs .lst{margin-top:8px;max-height:260px;overflow:auto;scrollbar-width:none}.vs .lst::-webkit-scrollbar{display:none}
.vs .cap{display:flex;gap:10px;align-items:baseline;width:100%;padding:9px 10px;margin:0 0 6px;border:0;border-radius:12px;background:var(--chip);color:var(--ink);text-align:start;cursor:pointer;font:500 12.5px Cairo,Inter,sans-serif}
.vs .cap .dt{flex:none;color:var(--ink2);font:600 11px Inter,sans-serif;direction:ltr}.vs .cap span[dir]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vs .capi.open .cap span[dir]{white-space:normal}.vs .capb{padding:4px 4px 10px}
.vs .rp,.vs .rl{margin:0 0 8px;padding:8px 12px;border-radius:12px;background:rgba(148,163,184,.1);font:500 13px/1.7 Cairo,Inter,sans-serif}.vs .rl{padding-inline-start:30px}
.vs .vx{cursor:pointer;border-radius:4px;color:#38bdf8}.vs .vx:hover{background:rgba(56,189,248,.15)}.vs .alk{color:#38bdf8}.vs .vb{display:inline-block;width:1px;height:.9em;margin:0 8px;background:var(--ink2);vertical-align:middle}
.vs .wp,.vsw>.wp{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);width:min(92%,360px);z-index:20;padding:12px 14px;border-radius:16px;background:var(--pn);color:var(--ink);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(26px);backdrop-filter:blur(26px);box-shadow:0 12px 36px rgba(0,0,0,.35)}
.wpw{font-weight:700;margin-bottom:8px;text-align:center;overflow-wrap:anywhere}.wpr{display:flex;align-items:center;gap:8px}
.wpb{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:#34d399;color:#06281b;cursor:pointer;display:flex;align-items:center;justify-content:center}
.vsw .wp input[type=range]{flex:1;min-width:0;accent-color:#34d399}.wpt{flex:none;font-size:.68rem;opacity:.75;font-variant-numeric:tabular-nums}.wpn{flex:none;font-size:.68rem;opacity:.6}.wpm{font-size:.82rem;text-align:center;opacity:.85}`;

    function render(b) {
      stop();
      b.innerHTML = '<style>' + CSS + '</style><div class="vsw"><div class="vs"></div></div>';
      wrap = b.querySelector('.vsw'); root = b.querySelector('.vs'); lastLang = lg();
      wrap.addEventListener('click', e => {
        const q = e.target.closest ? e.target.closest.bind(e.target) : null; if (!q) return;
        const tip = root.querySelector('.tip'); if (tip) tip.hidden = true;
        root.querySelectorAll('svg .xh').forEach(l => l.style.display = 'none');
        let x;
        if ((x = q('.vx'))) { e.preventDefault(); wpOpen(x.dataset.word); return; }
        if ((x = q('.dot'))) { dotTap(x); return; }
        if ((x = q('.rb'))) { range = x.dataset.k; manual = true; paint(); return; }
        if ((x = q('.ear'))) { earSet(x.dataset.ear, !earOn(x.dataset.ear)); paint(); return; }
        if ((x = q('.cap'))) { const it = x.closest('.capi'), o = !it.classList.contains('open'); it.classList.toggle('open', o); x.setAttribute('aria-expanded', o); it.querySelector('.capb').hidden = !o; return; }
        if (!q('.wp')) wpClose();
      });
      wrap.addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const x = e.target.closest && e.target.closest('.vx'); if (x) { e.preventDefault(); wpOpen(x.dataset.word); } });
      tick = setInterval(() => { if (D && root && range !== 'all' && !manual) paint(); else if (D && root && manual && !opts().includes(range)) paint(); }, 30000);   /* a new day / month starts by itself */
      try { const W = ctx.W; if (W && window.MutationObserver) { mo = new MutationObserver(() => { if (lg() !== lastLang) { lastLang = lg(); paint(); } }); mo.observe(W, { attributes: true, attributeFilter: ['dir', 'class'] }); } } catch (e) { }
      if (D) { paint(); load(true); } else load();   /* cached data shows at once, fresh data replaces it quietly */
    }
    function stop() { wpClose(); if (tick) { clearInterval(tick); tick = null; } if (mo) { mo.disconnect(); mo = null; } wrap = null; root = null; loadId++; }

    /* full: الشاشة بتاخد الـlayer كله (بتسكرول جواها) */
    return { id: 'dash', render: render, stop: stop, full: function () { return true; } };
  };
})();
