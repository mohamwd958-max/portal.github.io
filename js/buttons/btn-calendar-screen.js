/* Calendar screen for the Calendar button.
   Put in js/buttons/ and load it right AFTER btn-calendar.js (home.html below already does).
   It keeps the button, icon and names from btn-calendar.js, removes "under construction" and adds the screen.
   The screen also shows attendance, official holidays and leave (Supabase), and sends "I can't attend" requests. */
(function () {
  'use strict';
  /* ---- the rules (change here only) ---- */
  var WEEKLY_OFF = [4, 5];            // JS getDay(): 4 = Thursday, 5 = Friday
  var SESSIONS = 20;                  // sessions in a normal month
  var SESSIONS_28 = 17;               // sessions in a 28-day month
  /* Week starts on Saturday. */
  var SB_URL = 'https://vkfexceitwjmxncwceqb.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI';   // public (anon) key
  var HOLD_MS = 350;                  // long press before drag-selecting by finger
  var MAX_DAYS = 60;                  // most days in one request (the database has the same limit)

  var TXT = {
    en: { dow: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], ses: 'Sessions', wk: 'Weekly off', end: 'Month-end break', day: 'Session day',
          today: 'Today', run: 'Longest break', to: 'to', days: 'days', prev: 'Previous month', next: 'Next month',
          att: 'Attended', abs: 'Did not attend', lv: 'Planned leave', pnd: 'Waiting for approval', hol: 'Official holiday', off: 'Holiday (off)', hols: 'Official holidays this month', expected: 'expected date',
          sesN: 'Session', res: 'Open Resources', none: 'Nothing recorded for this day.', hint: 'Tap a coming day to select it, or press and hold, then drag over several days.',
          picked: 'Selected days', why: 'Short reason', send: "I can't attend — send to my trainer", clear: 'Clear', sending: 'Sending…', sent: 'Sent. Waiting for your trainer.', loading: 'Loading…', retry: 'Try again',
          fail: 'Could not load your days.', e_session: 'Please sign in again.', e_details: 'Write a short reason first.', e_dates: 'Only coming days can be sent.', e_already: 'One of these days already has a request or approved leave. Reload and try again.',
          e_limit: 'Too many requests. Try again later.', e_holiday: 'One of these days is a holiday.', e_net: 'Not sent. Check your connection and try again.', e_max: 'You can select up to 60 days at once.' },
    ar: { dow: ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'], ses: 'جلسات', wk: 'إجازة أسبوعية', end: 'إجازة نهاية الشهر', day: 'يوم جلسة',
          today: 'اليوم', run: 'أطول إجازة متصلة', to: 'إلى', days: 'أيام', prev: 'الشهر السابق', next: 'الشهر التالي',
          att: 'حضرت', abs: 'لم تحضر', lv: 'إجازة مخططة', pnd: 'في انتظار الموافقة', hol: 'إجازة رسمية', off: 'إجازة', hols: 'الإجازات الرسمية هذا الشهر', expected: 'موعد متوقع',
          sesN: 'جلسة رقم', res: 'فتح الموارد', none: 'لا يوجد شيء مسجل في هذا اليوم.', hint: 'اضغط على يوم قادم لاختياره، أو اضغط مطولًا ثم اسحب على عدة أيام.',
          picked: 'الأيام المختارة', why: 'سبب مختصر', send: 'لن أستطيع الحضور — إرسال للمدرب', clear: 'مسح الاختيار', sending: 'جارٍ الإرسال…', sent: 'تم الإرسال، في انتظار رد المدرب.', loading: 'جارٍ التحميل…', retry: 'إعادة المحاولة',
          fail: 'تعذر تحميل أيامك.', e_session: 'سجّل الدخول من جديد.', e_details: 'اكتب سببًا مختصرًا أولًا.', e_dates: 'يمكن إرسال الأيام القادمة فقط.', e_already: 'يوم من هذه الأيام عليه طلب أو إجازة مقبولة. أعد التحميل وحاول مرة أخرى.',
          e_limit: 'طلبات كثيرة، حاول لاحقًا.', e_holiday: 'يوم من هذه الأيام إجازة.', e_net: 'لم يتم الإرسال. تأكد من الاتصال وحاول مرة أخرى.', e_max: 'يمكنك اختيار 60 يومًا بحد أقصى في المرة الواحدة.' }
  };

  /* Plan one month. Weekly off days are fixed. If the month has more working days than the target,
     the extra days become a month-end break glued to the LAST Thursday/Friday pair:
     first the days after that Friday (up to the month's end), then the days before that Thursday. */
  function plan(y, m) {
    var N = new Date(y, m + 1, 0).getDate(), D = [], i, d, w;
    for (d = 1; d <= N; d++) { w = new Date(y, m, d).getDay(); D.push({ d: d, w: w, t: WEEKLY_OFF.indexOf(w) > -1 ? 'w' : 'k' }); }
    var C = D.filter(function (x) { return x.t === 'k'; }).length;
    var R = Math.max(0, C - (N === 28 ? SESSIONS_28 : SESSIONS));
    var a = -1;
    for (i = N - 1; i >= 0; i--) { if (D[i].w === 4) { a = i; break; } }
    if (a < 0) a = N - 1;
    var f = (a + 1 < N && D[a + 1].w === 5) ? a + 1 : a;
    for (i = f + 1; i < N && R > 0; i++) { if (D[i].t === 'k') { D[i].t = 'e'; R--; } }
    for (i = a - 1; i >= 0 && R > 0; i--) { if (D[i].t === 'k') { D[i].t = 'e'; R--; } }
    var from = a, to = f;
    while (from > 0 && D[from - 1].t !== 'k') from--;
    while (to < N - 1 && D[to + 1].t !== 'k') to++;
    return {
      days: D,
      sessions: D.filter(function (x) { return x.t === 'k'; }).length,
      wk: D.filter(function (x) { return x.t === 'w'; }).length,
      end: D.filter(function (x) { return x.t === 'e'; }).length,
      run: { from: D[from].d, to: D[to].d, len: to - from + 1 }
    };
  }

  var CSS = '' +
    '.tcal-card{box-sizing:border-box;width:100%;min-height:100%;padding:24px 18px 28px;border-radius:28px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);color:var(--ink);font-family:Cairo,Inter,sans-serif}' +
    '.tcal{max-width:560px;margin:0 auto}' +
    '.tcal-h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:20px}' +
    '.tcal-t{flex:1;text-align:center;font:800 19px Cairo,Inter,sans-serif}' +
    '.tcal-n{width:40px;height:40px;border-radius:50%;border:1px solid var(--sbd);background:var(--chip);color:var(--ink);font:700 20px/1 Inter,sans-serif;cursor:pointer}' +
    '.tcal-dow,.tcal-row{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}' +
    '.tcal-dow{margin-bottom:10px;text-align:center;font:700 11.5px Cairo,Inter,sans-serif;color:var(--ink2)}' +
    '.tcal-rows{display:flex;flex-direction:column;gap:14px}' +
    '.tcal-d{box-sizing:border-box;aspect-ratio:1;border-radius:14px;display:flex;align-items:center;justify-content:center;border:1px solid var(--sbd);background:var(--chip);color:var(--ink);font:700 14px Inter,Cairo,sans-serif}' +
    '.tcal-x{border:0;background:none}' +
    '.tcal-w{background:rgba(96,165,250,.2);border-color:rgba(96,165,250,.5)}' +
    '.tcal-e{background:rgba(251,191,36,.24);border-color:rgba(251,191,36,.6)}' +
    '.tcal-today{outline:2px solid var(--ink);outline-offset:2px}' +
    '.tcal-s{display:grid;gap:8px;margin-top:24px;text-align:center;font:600 13.5px Cairo,Inter,sans-serif;color:var(--ink2)}' +
    '.tcal-s b{color:var(--ink)}' +
    '.tcal-lg{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 18px;margin-top:16px;font:600 12px Cairo,Inter,sans-serif;color:var(--ink2)}' +
    '.tcal-sw{display:inline-block;width:14px;height:14px;border-radius:5px;vertical-align:-2px;margin-inline-end:6px;border:1px solid var(--sbd)}' +
    '.tcal-td{display:block;margin:16px auto 0;padding:8px 18px;border-radius:999px;border:1px solid var(--sbd);background:var(--chip);color:var(--ink);font:700 12.5px Cairo,Inter,sans-serif;cursor:pointer}' +
    'button.tcal-d{position:relative;flex-direction:column;padding:0;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}' +
    '.tcal-d small{font:700 9px/1.2 Inter,Cairo,sans-serif;opacity:.9}' +
    '.tcal-rows.drag{cursor:grabbing}' +
    '.tcal-past{opacity:.7}' +
    '.tcal-h1{background:#f59e0b;border-color:#f59e0b;color:#111}' +
    '.tcal-att{background:#16a34a;border-color:#16a34a;color:#fff;opacity:1}' +
    '.tcal-abs{background:#dc2626;border-color:#dc2626;color:#fff;opacity:1}' +
    '.tcal-lv{background:#2563eb;border-color:#2563eb;color:#fff}' +
    '.tcal-pnd{border:2px dashed #2563eb}' +
    '.tcal-hol:after{content:"";position:absolute;top:4px;right:5px;width:7px;height:7px;border-radius:50%;background:#f59e0b;box-shadow:0 0 0 1px rgba(0,0,0,.25)}' +
    'button.tcal-d.tcal-sel{background:var(--ink);border-color:var(--ink);color:var(--pcard,#fff);opacity:1;transform:scale(.93)}' +
    '#W.light button.tcal-d.tcal-sel{color:#fff}#W:not(.light) button.tcal-d.tcal-sel{color:#111}' +
    '.tcal-open{box-shadow:0 0 0 3px #a78bfa}' +
    '.tcal-box{margin-top:16px;padding:14px;border-radius:18px;border:1px solid var(--sbd);background:var(--chip);font:600 13.5px/1.7 Cairo,Inter,sans-serif;text-align:start;overflow-wrap:anywhere}' +
    '.tcal-box h4{margin:0 0 6px;font:800 14px Cairo,Inter,sans-serif}' +
    '.tcal-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.tcal-tags span{padding:2px 10px;border-radius:999px;border:1px solid var(--sbd)}' +
    '.tcal-ses{padding:6px 0;border-top:1px solid var(--sbd)}' +
    '.tcal-box textarea{box-sizing:border-box;width:100%;min-height:70px;margin:8px 0;padding:10px 12px;border-radius:14px;border:1px solid var(--sbd);background:transparent;color:var(--ink);font:600 14px Cairo,Inter,sans-serif;resize:vertical}' +
    '.tcal-b{display:block;box-sizing:border-box;width:100%;min-height:44px;margin-top:8px;padding:8px 14px;border-radius:999px;border:1px solid var(--sbd);background:transparent;color:var(--ink);font:800 13.5px Cairo,Inter,sans-serif;cursor:pointer}' +
    '.tcal-b.go{background:#16a34a;border-color:#16a34a;color:#fff}.tcal-b:disabled{opacity:.5;cursor:default}' +
    '.tcal-msg{margin-top:12px;text-align:center;font:700 13px Cairo,Inter,sans-serif}' +
    '.tcal-hint{margin-top:12px;text-align:center;font:600 12px Cairo,Inter,sans-serif;color:var(--ink2)}' +
    '@media(max-width:420px){.tcal-dow,.tcal-row{gap:6px}.tcal-d{border-radius:12px;font-size:13px}}';

  function ensureCss(root) {
    if (root.querySelector && root.querySelector('#thCalCss')) return;
    var s = document.createElement('style'); s.id = 'thCalCss'; s.textContent = CSS; root.appendChild(s);
  }

  function token() { try { return localStorage.getItem('thabit_trainee_token') || ''; } catch (e) { return ''; } }
  function rpc(fn, body) {
    return fetch(SB_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.text().then(function (x) { if (!r.ok) throw new Error(x); return x ? JSON.parse(x) : null; }); });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  /* "today" in Cairo (summer and winter time are handled by the time zone), whatever the device zone is */
  function cairoToday() { return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' }); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var ICON = '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>';
  var B = window.ThabitBtn = window.ThabitBtn || {};
  var orig = B.calendar;
  B.calendar = function (api) {
    var mod = (typeof orig === 'function' ? orig(api) : null) || {};
    /* Self-sufficient: if btn-calendar.js is missing, this file supplies the icon, the names and the sidebar button itself. */
    try {
      api.IC.calendar = api.IC.calendar || ICON;
      api.STR.en.i_calendar = api.STR.en.i_calendar || 'Calendar';
      api.STR.ar.i_calendar = api.STR.ar.i_calendar || 'التقويم';
    } catch (e) { }
    mod.maint = false;
    if (typeof mod.button === 'string' && mod.button) mod.button = mod.button.replace(/\sdata-maint(=("[^"]*"|'[^']*'))?/g, '');
    else mod.button = '<button type="button" class="sdi st" data-k="calendar" data-title="i_calendar"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg></button>';
    mod.full = function () { return false; };
    mod.plan = plan;
    var cleanup = null;
    var prevStop = mod.stop;
    mod.stop = function () { if (cleanup) cleanup(); if (typeof prevStop === 'function') prevStop(); };
    mod.render = function (b) {
      ensureCss(api.R);
      if (cleanup) cleanup();
      var T0 = cairoToday(), v = { y: +T0.slice(0, 4), m: +T0.slice(5, 7) - 1 };
      var S = { data: null, err: false, sel: {}, open: null, reason: '', msg: '', busy: false, seq: 0, dead: false };
      var P = null, G = null;   // month plan, running gesture
      function lang() { return String(api.lang() || 'en').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en'; }
      function nf(n) { return lang() === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n); }
      function longDay(d) { return new Date(d + 'T12:00:00Z').toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }); }
      function today() { return (S.data && S.data.today) || cairoToday(); }
      function selected() { return Object.keys(S.sel).sort(); }
      function info(d) {
        var x = S.data || { sessions: [], absent: [], leave: [], pending: [], holidays: [] };
        var plan1 = P.days[+d.slice(8) - 1], hol = x.holidays.filter(function (h) { return h.day === d; })[0] || null;
        var abs = x.absent.indexOf(d) > -1;
        var ses = abs || d > today() ? [] : x.sessions.filter(function (s) { return s.day === d && s.attended; });
        return { t: plan1.t, hol: hol, abs: abs, ses: ses, att: ses.length > 0, lv: x.leave.indexOf(d) > -1, pnd: x.pending.indexOf(d) > -1 };
      }
      /* a day can be selected only if it is in the future, is a session day, is not a definite holiday and has no leave or request yet */
      function canPick(d) {
        if (!S.data || S.busy || !token() || d <= today()) return false;
        var q = info(d);
        return q.t === 'k' && !(q.hol && q.hol.definite_off) && !q.lv && !q.pnd;
      }
      function load() {
        var seq = ++S.seq, last = new Date(v.y, v.m + 1, 0).getDate();
        S.data = null; S.err = false; draw();
        if (!token()) return;
        rpc('trainee_calendar', { p_token: token(), p_from: iso(v.y, v.m, 1), p_to: iso(v.y, v.m, last) }).then(function (r) {
          if (seq !== S.seq || S.dead) return;
          if (!r) { S.err = true; } else { S.data = r; selected().forEach(function (d) { if (d.slice(0, 7) === iso(v.y, v.m, 1).slice(0, 7) && !canPick(d)) delete S.sel[d]; }); }
          draw();
        }).catch(function () { if (seq !== S.seq || S.dead) return; S.err = true; draw(); });
      }
      function dayPanel(t) {
        var d = S.open; if (!d || !S.data || d.slice(0, 7) !== iso(v.y, v.m, 1).slice(0, 7)) return '';
        var q = info(d), tags = [];
        if (q.abs) tags.push(t.abs); else if (q.att) tags.push(t.att);
        if (q.lv) tags.push(t.lv);
        if (q.pnd) tags.push(t.pnd);
        if (q.t === 'w') tags.push(t.wk); if (q.t === 'e') tags.push(t.end);
        if (q.hol) tags.push((q.hol.definite_off ? t.off : t.hol) + ': ' + q.hol.name);
        var h = '<div class="tcal-box" data-panel><h4>' + longDay(d) + '</h4>';
        if (tags.length) h += '<div class="tcal-tags">' + tags.map(function (x) { return '<span dir="auto">' + esc(x) + '</span>'; }).join('') + '</div>';
        h += q.ses.map(function (s) {
          return '<div class="tcal-ses" dir="auto"><b>' + t.sesN + (s.no != null ? ' ' + nf(s.no) : '') + '</b>' + (s.title ? ' · ' + esc(s.title) : '') + (s.sub ? ' · ' + esc(s.sub) : '') +
            (s.start ? '<br><span dir="ltr">' + esc(String(s.start).slice(0, 5)) + (s.end ? ' – ' + esc(String(s.end).slice(0, 5)) : '') + '</span>' : '') + '</div>';
        }).join('');
        if (q.ses.length) h += '<button type="button" class="tcal-b" data-a="res">' + t.res + '</button>';
        if (!tags.length && !q.ses.length) h += '<div>' + t.none + '</div>';
        return h + '</div>';
      }
      function sendPanel(t) {
        var l = selected(); if (!l.length) return '';
        return '<div class="tcal-box" data-send><h4>' + t.picked + ': <span data-count>' + nf(l.length) + '</span></h4><div class="tcal-tags" data-chips>' +
          l.map(function (d) { return '<span>' + longDay(d) + '</span>'; }).join('') + '</div>' +
          '<textarea maxlength="1500" dir="auto" placeholder="' + t.why + '" aria-label="' + t.why + '"' + (S.busy ? ' disabled' : '') + '>' + esc(S.reason) + '</textarea>' +
          '<button type="button" class="tcal-b go" data-a="send"' + (S.busy ? ' disabled' : '') + '>' + (S.busy ? t.sending : t.send) + '</button>' +
          '<button type="button" class="tcal-b" data-a="clear"' + (S.busy ? ' disabled' : '') + '>' + t.clear + '</button></div>';
      }
      function draw() {
        var L = lang(), t = TXT[L], ar = L === 'ar';
        P = plan(v.y, v.m);
        var now = today(), lead = (new Date(v.y, v.m, 1).getDay() + 1) % 7, cells = [], i, r, c, h = '', na = 0, nx = 0;
        for (i = 0; i < lead; i++) cells.push(null);
        P.days.forEach(function (x) { cells.push(x); });
        while (cells.length % 7) cells.push(null);
        for (r = 0; r < cells.length / 7; r++) {
          h += '<div class="tcal-row">';
          for (c = 0; c < 7; c++) {
            var x = cells[r * 7 + c];
            if (!x) { h += '<i class="tcal-d tcal-x"></i>'; continue; }
            var d = iso(v.y, v.m, x.d), q = info(d), cls = x.t === 'w' ? ' tcal-w' : x.t === 'e' ? ' tcal-e' : '';
            if (q.abs) nx++; else if (q.att) na++;
            var state = q.abs ? 'abs' : q.att ? 'att' : q.lv ? 'lv' : (q.hol && q.hol.definite_off) ? 'h1' : '';
            if (state) cls += ' tcal-' + state;
            if (q.pnd) cls += ' tcal-pnd';
            if (q.hol) cls += ' tcal-hol';
            if (d < now) cls += ' tcal-past';
            if (d === now) cls += ' tcal-today';
            if (d === S.open) cls += ' tcal-open';
            if (S.sel[d]) cls += ' tcal-sel';
            var nos = q.ses.filter(function (s) { return s.no != null; }).map(function (s) { return '#' + s.no; }).join(' ');
            var label = [longDay(d), q.abs ? t.abs : q.att ? t.att : '', q.lv ? t.lv : '', q.pnd ? t.pnd : '', q.hol ? q.hol.name : '', x.t === 'w' ? t.wk : x.t === 'e' ? t.end : ''].filter(Boolean).join('، ');
            h += '<button type="button" class="tcal-d' + cls + '" data-d="' + d + '" aria-label="' + esc(label) + '" aria-pressed="' + (!!S.sel[d]) + '">' + nf(x.d) + (nos ? '<small dir="ltr">' + nos + '</small>' : '') + '</button>';
          }
          h += '</div>';
        }
        var title = new Date(v.y, v.m, 1).toLocaleDateString(ar ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
        var hols = S.data && S.data.holidays.length ? '<div class="tcal-box"><h4>' + t.hols + '</h4>' + S.data.holidays.map(function (o) {
          return '<div dir="auto">' + longDay(o.day) + ': <b>' + esc(o.name) + '</b>' + (o.definite_off ? ' — ' + t.off : '') + (o.tentative ? ' (' + t.expected + ')' : '') + '</div>';
        }).join('') + '</div>' : '';
        var status = S.err ? '<div class="tcal-msg">' + t.fail + '<button type="button" class="tcal-b" data-a="retry">' + t.retry + '</button></div>' :
          !token() ? '<div class="tcal-msg">' + t.e_session + '</div>' : !S.data ? '<div class="tcal-msg">' + t.loading + '</div>' : '<div class="tcal-hint">' + t.hint + '</div>';
        function sw(cls, label) { return '<span><i class="tcal-sw ' + cls + '"></i>' + label + '</span>'; }
        b.innerHTML = '<section class="tcal-card"><div class="tcal">' +
          '<div class="tcal-h"><button type="button" class="tcal-n" data-a="p" aria-label="' + t.prev + '">' + (ar ? '›' : '‹') + '</button>' +
          '<div class="tcal-t">' + title + '</div>' +
          '<button type="button" class="tcal-n" data-a="n" aria-label="' + t.next + '">' + (ar ? '‹' : '›') + '</button></div>' +
          '<div class="tcal-dow">' + t.dow.map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>' +
          '<div class="tcal-rows">' + h + '</div>' + status +
          '<div class="tcal-msg" role="status" aria-live="polite">' + (S.msg ? t[S.msg] : '') + '</div>' +
          sendPanel(t) + dayPanel(t) +
          '<div class="tcal-s"><div><b>' + nf(P.sessions) + '</b> ' + t.ses + ' · <b>' + nf(P.wk) + '</b> ' + t.wk + ' · <b>' + nf(P.end) + '</b> ' + t.end + '</div>' +
          '<div>' + t.run + ': <b>' + nf(P.run.from) + '</b> ' + t.to + ' <b>' + nf(P.run.to) + '</b> (' + nf(P.run.len) + ' ' + t.days + ')</div>' +
          (S.data ? '<div>' + t.att + ': <b>' + nf(na) + '</b> · ' + t.abs + ': <b>' + nf(nx) + '</b></div>' : '') + '</div>' +
          '<div class="tcal-lg">' + sw('', t.day) + sw('tcal-w', t.wk) + sw('tcal-e', t.end) + sw('tcal-att', t.att) + sw('tcal-abs', t.abs) + sw('tcal-lv', t.lv) + sw('tcal-pnd', t.pnd) + sw('tcal-h1', t.off) + '</div>' +
          hols + '<button type="button" class="tcal-td" data-a="t">' + t.today + '</button></div></section>';
        wire();
      }
      /* ---- selecting days: tap toggles; long press (mouse: press) then drag paints the same change on every day the pointer passes over ---- */
      function setSel(d, on) {
        if (!canPick(d) || !!S.sel[d] === on) return;
        if (on && selected().length >= MAX_DAYS) { S.msg = 'e_max'; return; }
        if (on) S.sel[d] = 1; else delete S.sel[d];
        var el = b.querySelector('[data-d="' + d + '"]');
        if (el) { el.classList.toggle('tcal-sel', on); el.setAttribute('aria-pressed', String(on)); }
      }
      function tap(d) {
        S.msg = '';
        if (canPick(d)) { S.open = info(d).hol ? d : null; setSel(d, !S.sel[d]); }
        else S.open = S.open === d ? null : d;
        draw();
      }
      function cellAt(px, py) {
        var root = api.R && api.R.elementFromPoint ? api.R : document, el = root.elementFromPoint(px, py);
        return el && el.closest ? el.closest('button.tcal-d') : null;
      }
      function paintTo(px, py) {   // also fills the days skipped by a fast finger
        var n = Math.max(1, Math.ceil(Math.max(Math.abs(px - G.lx), Math.abs(py - G.ly)) / 12)), i, el;
        for (i = 1; i <= n; i++) { el = cellAt(G.lx + (px - G.lx) * i / n, G.ly + (py - G.ly) * i / n); if (el) setSel(el.getAttribute('data-d'), G.on); }
        G.lx = px; G.ly = py;
      }
      function startDrag() {
        if (!G || G.drag || !canPick(G.d)) return;
        clearTimeout(G.timer);
        G.drag = true; G.on = !S.sel[G.d]; S.msg = '';
        setSel(G.d, G.on);
        var rows = b.querySelector('.tcal-rows'); if (rows) rows.classList.add('drag');
        try { if (G.touch && navigator.vibrate) navigator.vibrate(15); } catch (e) { }
      }
      function down(e) {
        if (e.button > 0 || e.isPrimary === false) return;
        var el = e.target.closest('button.tcal-d'); if (!el) return;
        endGesture(false);
        G = { d: el.getAttribute('data-d'), id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, drag: false, moved: false, on: true, touch: e.pointerType !== 'mouse' };
        G.timer = setTimeout(startDrag, HOLD_MS);
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', cancel);
      }
      function move(e) {
        if (!G || e.pointerId !== G.id) return;
        if (!G.drag) {
          if (Math.abs(e.clientX - G.x) < 10 && Math.abs(e.clientY - G.y) < 10) return;
          if (G.touch) { G.moved = true; clearTimeout(G.timer); return; }   // a quick swipe is a scroll
          var el = cellAt(e.clientX, e.clientY);
          if (el && el.getAttribute('data-d') === G.d) return;
          G.moved = true; startDrag();
          if (!G.drag) return;
        }
        paintTo(e.clientX, e.clientY);
      }
      function endGesture(apply) {
        if (!G) return;
        var g = G; G = null; clearTimeout(g.timer);
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel);
        if (g.drag) draw(); else if (apply && !g.moved) tap(g.d);
      }
      function up(e) { if (G && e.pointerId === G.id) endGesture(true); }
      function cancel(e) { if (G && e.pointerId === G.id) endGesture(false); }
      function send() {
        var l = selected(), why = S.reason.trim();
        if (!l.length || S.busy) return;
        if (!why) { S.msg = 'e_details'; draw(); return; }
        S.busy = true; S.msg = ''; draw();
        rpc('trainee_request_leave', { p_token: token(), p_dates: l, p_details: why }).then(function (r) {
          S.busy = false;
          if (r && r.ok) { S.sel = {}; S.reason = ''; S.msg = 'sent'; if (!S.dead) load(); return; }
          S.msg = 'e_' + ((r && r.error) || 'net');
          if (!TXT.en[S.msg]) S.msg = 'e_net';
          if (!S.dead) draw();
        }).catch(function (e) { S.busy = false; S.msg = /holiday_day/.test(e.message) ? 'e_holiday' : 'e_net'; if (!S.dead) draw(); });
      }
      function go(y, m) { v.y = y; v.m = m; S.open = null; S.msg = ''; load(); }
      function wire() {
        var q = function (s) { return b.querySelector(s); };
        q('[data-a="p"]').onclick = function () { var x = new Date(v.y, v.m - 1, 1); go(x.getFullYear(), x.getMonth()); };
        q('[data-a="n"]').onclick = function () { var x = new Date(v.y, v.m + 1, 1); go(x.getFullYear(), x.getMonth()); };
        q('[data-a="t"]').onclick = function () { var n = today(); go(+n.slice(0, 4), +n.slice(5, 7) - 1); };
        if (q('[data-a="retry"]')) q('[data-a="retry"]').onclick = load;
        var rows = q('.tcal-rows');
        rows.addEventListener('pointerdown', down);
        rows.addEventListener('touchmove', function (e) { if (G && G.drag) e.preventDefault(); }, { passive: false });   // no scrolling while selecting
        rows.addEventListener('contextmenu', function (e) { e.preventDefault(); });
        rows.addEventListener('click', function (e) { var el = e.target.closest('button.tcal-d'); if (el && e.detail === 0) tap(el.getAttribute('data-d')); });   // keyboard
        if (q('[data-send] textarea')) q('[data-send] textarea').oninput = function () { S.reason = this.value; if (S.msg === 'e_details') { S.msg = ''; q('[role="status"]').textContent = ''; } };
        if (q('[data-a="send"]')) q('[data-a="send"]').onclick = send;
        if (q('[data-a="clear"]')) q('[data-a="clear"]').onclick = function () { S.sel = {}; S.reason = ''; S.msg = ''; draw(); };
        if (q('[data-a="res"]')) q('[data-a="res"]').onclick = function () {
          var s = info(S.open).ses[0];
          window.thSessionFocus = s ? { day: s.day, no: s.no } : null;   // the Resources screen can use this to jump to the session
          if (api.openLayer) api.openLayer('res');
        };
      }
      cleanup = function () { endGesture(false); S.dead = true; cleanup = null; };
      load();
    };
    return mod;
  };
})();
