/* Calendar screen for the Calendar button.
   Put in js/buttons/ and load it right AFTER btn-calendar.js (home.html below already does).
   It keeps the button, icon and names from btn-calendar.js, removes "under construction" and adds the screen. */
(function () {
  'use strict';
  /* ---- the rules (change here only) ---- */
  var WEEKLY_OFF = [4, 5];            // JS getDay(): 4 = Thursday, 5 = Friday
  var SESSIONS = 20;                  // sessions in a normal month
  var SESSIONS_28 = 17;               // sessions in a 28-day month
  /* Week starts on Saturday. */

  var TXT = {
    en: { dow: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], ses: 'Sessions', wk: 'Weekly off', end: 'Month-end break', day: 'Session day',
          today: 'Today', run: 'Longest break', to: 'to', days: 'days', prev: 'Previous month', next: 'Next month' },
    ar: { dow: ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'], ses: 'جلسات', wk: 'إجازة أسبوعية', end: 'إجازة نهاية الشهر', day: 'يوم جلسة',
          today: 'اليوم', run: 'أطول إجازة متصلة', to: 'إلى', days: 'أيام', prev: 'الشهر السابق', next: 'الشهر التالي' }
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
    '@media(max-width:420px){.tcal-dow,.tcal-row{gap:6px}.tcal-d{border-radius:12px;font-size:13px}}';

  function ensureCss(root) {
    if (root.querySelector && root.querySelector('#thCalCss')) return;
    var s = document.createElement('style'); s.id = 'thCalCss'; s.textContent = CSS; root.appendChild(s);
  }

  var B = window.ThabitBtn = window.ThabitBtn || {};
  var orig = B.calendar;
  B.calendar = function (api) {
    var mod = (typeof orig === 'function' ? orig(api) : null) || {};
    mod.maint = false;
    if (typeof mod.button === 'string') mod.button = mod.button.replace(/\sdata-maint(=("[^"]*"|'[^']*'))?/g, '');
    mod.full = function () { return false; };
    mod.plan = plan;
    mod.render = function (b) {
      ensureCss(api.R);
      var now = new Date(), v = { y: now.getFullYear(), m: now.getMonth() };
      function lang() { return String(api.lang() || 'en').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en'; }
      function draw() {
        var L = lang(), t = TXT[L], P = plan(v.y, v.m), ar = L === 'ar';
        var nf = function (n) { return ar ? n.toLocaleString('ar-EG') : String(n); };
        var lead = (new Date(v.y, v.m, 1).getDay() + 1) % 7, cells = [], i, r, c, h = '';
        for (i = 0; i < lead; i++) cells.push(null);
        P.days.forEach(function (x) { cells.push(x); });
        while (cells.length % 7) cells.push(null);
        for (r = 0; r < cells.length / 7; r++) {
          h += '<div class="tcal-row">';
          for (c = 0; c < 7; c++) {
            var x = cells[r * 7 + c];
            if (!x) { h += '<i class="tcal-d tcal-x"></i>'; continue; }
            var isToday = x.d === now.getDate() && v.m === now.getMonth() && v.y === now.getFullYear();
            h += '<div class="tcal-d' + (x.t === 'w' ? ' tcal-w' : x.t === 'e' ? ' tcal-e' : '') + (isToday ? ' tcal-today' : '') + '">' + nf(x.d) + '</div>';
          }
          h += '</div>';
        }
        var title = new Date(v.y, v.m, 1).toLocaleDateString(ar ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
        b.innerHTML = '<section class="tcal-card"><div class="tcal">' +
          '<div class="tcal-h"><button type="button" class="tcal-n" data-a="p" aria-label="' + t.prev + '">' + (ar ? '›' : '‹') + '</button>' +
          '<div class="tcal-t">' + title + '</div>' +
          '<button type="button" class="tcal-n" data-a="n" aria-label="' + t.next + '">' + (ar ? '‹' : '›') + '</button></div>' +
          '<div class="tcal-dow">' + t.dow.map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>' +
          '<div class="tcal-rows">' + h + '</div>' +
          '<div class="tcal-s"><div><b>' + nf(P.sessions) + '</b> ' + t.ses + ' · <b>' + nf(P.wk) + '</b> ' + t.wk + ' · <b>' + nf(P.end) + '</b> ' + t.end + '</div>' +
          '<div>' + t.run + ': <b>' + nf(P.run.from) + '</b> ' + t.to + ' <b>' + nf(P.run.to) + '</b> (' + nf(P.run.len) + ' ' + t.days + ')</div></div>' +
          '<div class="tcal-lg"><span><i class="tcal-sw"></i>' + t.day + '</span><span><i class="tcal-sw tcal-w"></i>' + t.wk + '</span><span><i class="tcal-sw tcal-e"></i>' + t.end + '</span></div>' +
          '<button type="button" class="tcal-td" data-a="t">' + t.today + '</button></div></section>';
        b.querySelector('[data-a="p"]').onclick = function () { v.m--; if (v.m < 0) { v.m = 11; v.y--; } draw(); };
        b.querySelector('[data-a="n"]').onclick = function () { v.m++; if (v.m > 11) { v.m = 0; v.y++; } draw(); };
        b.querySelector('[data-a="t"]').onclick = function () { v.y = now.getFullYear(); v.m = now.getMonth(); draw(); };
      }
      draw();
    };
    return mod;
  };
})();
