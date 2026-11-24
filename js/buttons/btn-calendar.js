/* =====================================================================
   SIDEBAR BUTTON: Calendar (التقويم)
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + شاشة الـCalendar بالكامل (أسبوع / يوم / شهر / سنة + Events).
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-calendar.js"></script>
   والـindex.html بينده عليه كده:  ThabitBtn.calendar({ R, lang, STR })
     R    = الـshadow root بتاع التطبيق
     lang = دالة بترجّع اللغة الحالية ('en' أو 'ar')
     STR  = جدول النصوص (الزرار بيضيف فيه اسمه i_calendar)
   وبيرجّع: { button, render(body), stop(), CAL_TZ }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.calendar = function (ctx) {
    const R = ctx.R, lang = ctx.lang, STR = ctx.STR;

    /* ---- identity: icon + name ---- */
    const ICON = '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/>';
    const TITLE = { en: 'Calendar', ar: 'التقويم' };
    STR.en.i_calendar = TITLE.en; STR.ar.i_calendar = TITLE.ar;
    const button = '<button type="button" class="sdi st" data-k="calendar" data-title="i_calendar"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg></button>';

    /* ---- the screen ---- */
  /* ---------- Calendar: a calendar cell (week / day / month / year, zoomable), two detail cells for the chosen day, and an Events cell.
                 Lessons: Sat/Mon/Wed 7:00 PM Egypt time. Optional: Sun/Tue. Off: Thu/Fri.
                 Demo rules: the 2nd week of every month is suspended; February is "not active" in the year view.
                 Wording follows time: past ("was supposed to"), today ("is supposed to"), future ("is supposed to ... hasn't come yet"). ---------- */
  let calStop = () => { }, calSt = null;
  const CAL = {
    en: { days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], full: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      time: 'Session time', status: 'Status', eg: 'Egypt', mk: 'Makkah', left: 'Time left for the session', live: 'Your session is live now', done: "Today's session has ended", past: 'This day has passed', opt: 'Optional day',
      tl: { p: 'The session was supposed to be at', n: 'Your session is supposed to be at', f: 'Your session is supposed to be at' },
      fnote: "This day hasn't come yet, and I can't know whether you'll attend.",
      inDays: n => 'In ' + n + (n === 1 ? ' day' : ' days'),
      offT: { p: 'It was a day off', n: "You're off today — enjoy your time!", f: 'It will be a day off' }, offS: { p: 'There was no session on this day.', f: 'There will be no session on this day.' }, see: n => 'See you on ' + n + ', God willing.',
      susp: { p: 'You were suspended', n: 'Suspended', f: 'You will be suspended' }, suspS: { p: 'There were no sessions that week.', n: 'No sessions this week.', f: 'There will be no sessions that week.' },
      gW: { p: 'You were suspended during this specific week', n: 'You are suspended this specific week', f: 'You will be suspended during this specific week' }, gWs: 'You can still open it to see the days.',
      gM: { p: 'You were not active this month', n: 'You are not active this month', f: 'You will not be active this month' }, gMs: 'Open it to see which weeks are affected.', cont: 'Continue',
      back: 'Back', zin: 'Zoom in', zout: 'Zoom out', prev: 'Previous', next: 'Next', a1: 'Set day off', a2: 'Request excuse', a3: 'Swap day', a4: 'Change time',
      ev: 'Events', evs: 'Recent sessions', sess: 'Session', start: 'Started', lasted: n => 'Lasted ' + n + ' min', prog: 'Progress', nonotes: 'No notes for this session.',
      top: ['Present perfect vs past simple', 'Phrasal verbs: daily routines', 'Listening drill: short dialogues', 'Pronunciation: stress and rhythm', 'Conditionals (type 1 and 2)', 'Vocabulary: travel and directions', 'Reading: a short news article', 'Speaking practice: role play'],
      notes: ['Good pace. Review the irregular verbs.', 'Needs more practice with word order.', 'Great listening accuracy.', 'Work on the "th" sounds.', 'Understood the rules well; keep practicing.', '', 'Read fluently; slow down on long sentences.', 'Confident speaking, with minor grammar slips.'] },
    ar: { days: ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'], full: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      time: 'موعد الجلسة', status: 'الحالة', eg: 'مصر', mk: 'مكة المكرمة', left: 'متبقي على الجلسة', live: 'جلستك جارية الآن', done: 'انتهت جلسة اليوم', past: 'مضى هذا اليوم', opt: 'يوم اختياري',
      tl: { p: 'كان يُفترض أن تكون الجلسة الساعة', n: 'يُفترض أن تكون جلستك الساعة', f: 'يُفترض أن تكون جلستك الساعة' },
      fnote: 'لم يأتِ هذا اليوم بعد، ولا أعرف إن كنت ستحضر.',
      inDays: n => n === 1 ? 'بعد يوم' : n === 2 ? 'بعد يومين' : n <= 10 ? 'بعد ' + n + ' أيام' : 'بعد ' + n + ' يومًا',
      offT: { p: 'كان يوم إجازة', n: 'أنت في إجازة اليوم، استمتع بوقتك!', f: 'سيكون يوم إجازة' }, offS: { p: 'لم تكن هناك جلسة في هذا اليوم.', f: 'لن تكون هناك جلسة في هذا اليوم.' }, see: n => 'لقاؤنا يوم ' + n + ' إن شاء الله.',
      susp: { p: 'كنت موقوفًا', n: 'موقوف', f: 'ستكون موقوفًا' }, suspS: { p: 'لم تكن هناك جلسات في ذلك الأسبوع.', n: 'لا جلسات هذا الأسبوع.', f: 'لن تكون هناك جلسات في ذلك الأسبوع.' },
      gW: { p: 'كنت موقوفًا (Suspended) في هذا الأسبوع تحديدًا', n: 'أنت موقوف (Suspended) هذا الأسبوع تحديدًا', f: 'ستكون موقوفًا (Suspended) في هذا الأسبوع تحديدًا' }, gWs: 'يمكنك فتحه لرؤية الأيام.',
      gM: { p: 'لم تكن نشطًا في هذا الشهر', n: 'أنت غير نشط في هذا الشهر', f: 'لن تكون نشطًا في هذا الشهر' }, gMs: 'افتحه لتعرف أي الأسابيع متأثرة.', cont: 'متابعة',
      back: 'رجوع', zin: 'تكبير', zout: 'تصغير', prev: 'السابق', next: 'التالي', a1: 'تحويل اليوم إلى إجازة', a2: 'طلب عذر', a3: 'تبديل اليوم', a4: 'تغيير الميعاد',
      ev: 'الأحداث', evs: 'آخر الجلسات', sess: 'الجلسة', start: 'بدأت', lasted: n => 'استمرت ' + n + ' دقيقة', prog: 'التقدم', nonotes: 'لا توجد ملاحظات لهذه الجلسة.',
      top: ['المضارع التام مقابل الماضي البسيط', 'الأفعال المركبة: الروتين اليومي', 'تدريب استماع: حوارات قصيرة', 'النطق: النبر والإيقاع', 'الجمل الشرطية (النوع 1 و2)', 'مفردات: السفر والاتجاهات', 'قراءة: مقال إخباري قصير', 'تدريب محادثة: لعب أدوار'],
      notes: ['إيقاع جيد. راجع الأفعال الشاذة.', 'يحتاج مزيدًا من التدريب على ترتيب الكلمات.', 'دقة ممتازة في الاستماع.', 'اعمل على أصوات "th".', 'فهمت القواعد جيدًا؛ واصل التدريب.', '', 'قراءة سلسة؛ تمهّل في الجمل الطويلة.', 'محادثة واثقة مع أخطاء نحوية بسيطة.'] }
  };
  const CAL_KIND = ['lesson', 'opt', 'lesson', 'opt', 'lesson', 'off', 'off'];   /* index 0 = Saturday */
  const CAL_HOUR = 19, CAL_MIN = 60, CAL_TZ = { eg: 'Africa/Cairo', mk: 'Asia/Riyadh' }, CAL_INACTIVE = [1], DAY = 864e5;
  const CAL_START = [2, 0, 5, 1, 0, 3, 0, 4], CAL_LEN = [58, 62, 55, 60, 65, 57, 61, 59], CAL_LAST = 24;   /* made-up demo numbers */
  const cwd = n => (((n + 5) % 7) + 7) % 7, cdate = n => new Date(n * DAY), cnum = (y, m, d) => Math.round(Date.UTC(y, m, d) / DAY);
  const wstart = n => n - cwd(n), csusp = ws => { const d = cdate(ws).getUTCDate(); return d >= 8 && d <= 14; };
  function calNow() {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: CAL_TZ.eg, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const o = {}; f.formatToParts(new Date()).forEach(x => { o[x.type] = x.value; });
    return { n: cnum(+o.year, +o.month - 1, +o.day), sec: (+o.hour % 24) * 3600 + (+o.minute) * 60 + (+o.second) };
  }
  function cairoInst(n) {
    let t = n * DAY + (CAL_HOUR - 2) * 36e5;
    const h = +new Intl.DateTimeFormat('en-GB', { timeZone: CAL_TZ.eg, hourCycle: 'h23', hour: '2-digit' }).format(new Date(t));
    if (h !== CAL_HOUR) t += (CAL_HOUR - h) * 36e5; return new Date(t);
  }
  function monWeeks(y, m) { const f = cnum(y, m, 1), l = cnum(y, m + 1, 0), o = []; for (let s = f + ((7 - cwd(f)) % 7); s <= l; s += 7) o.push(s); return o; }
  function calSessions(nw) {   /* the latest finished lesson sessions (suspended weeks have none) */
    const out = []; let n = nw.sec >= CAL_HOUR * 3600 + CAL_MIN * 60 ? nw.n : nw.n - 1;
    for (; out.length < 8 && n > nw.n - 150; n--) if (CAL_KIND[cwd(n)] === 'lesson' && !csusp(wstart(n))) out.push({ n, no: CAL_LAST - out.length });
    return out;
  }
  function renderCal(b) {
    if (!R.getElementById('thCalCss')) {
      const st = document.createElement('style'); st.id = 'thCalCss';
      st.textContent = `
      .cal-w{min-height:100%;display:flex;flex-direction:column;gap:14px;padding:2px 0 24px}
      .cal-dg{display:grid;grid-template-columns:1fr 1fr;gap:14px}.cal-dg.one{grid-template-columns:1fr}.cal-dg:empty{display:none}
      .cal-c{min-width:0;min-height:96px;padding:10px 12px;border-radius:20px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);display:flex;flex-direction:column;justify-content:space-between;gap:8px;color:var(--ink)}
      .cal-c.cal-cw{justify-content:flex-start;touch-action:none}
      .cal-z{gap:6px}.cal-z .cal-b{width:36px;height:36px;font-size:22px;font-weight:600}
      #calBody{display:block}
      .cal-c.bad{border:2px solid #ef4444}
      .cal-l{font:700 11px/1.5 Cairo,Inter,sans-serif;color:var(--ink2);letter-spacing:.02em}
      .cal-h{display:flex;align-items:center;gap:6px}
      .cal-t{flex:1;min-width:0;text-align:center;font:800 13px Cairo,Inter,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;unicode-bidi:plaintext}
      .cal-z{display:flex;gap:4px;margin-inline-start:4px}
      .cal-b{flex:none;width:26px;height:26px;padding:0;border-radius:50%;border:1px solid var(--sbd);background:transparent;color:var(--ink);font:700 15px/1 Inter,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center}
      .cal-b:disabled{opacity:.3;cursor:default}
      @media(hover:hover){.cal-b:not(:disabled):hover{background:var(--chip)}}
      .cal-wk{display:flex;align-items:center;gap:6px;height:56px;padding:3px 4px;border-radius:18px;border:2px solid transparent;user-select:none;-webkit-user-select:none}
      .cal-wk.susp{border-color:#ef4444}
      .cal-d{flex:1;min-width:0;height:36px;padding:0;border-radius:12px;border:1.5px solid var(--sbd);background:rgba(255,255,255,.6);color:#1c1a16;font:700 11px Cairo,Inter,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;white-space:nowrap;transition:height .15s ease,background-color .15s ease}
      #W:not(.light) .cal-d{background:rgba(255,255,255,.88)}
      .cal-d.off:not(.sel){opacity:.4}
      .cal-d.sel{flex:1.25;height:46px;font-size:13px;font-weight:800;border-color:var(--ink)}
      .cal-d.sel.lesson{background:#34d399;color:#04291c}
      .cal-d.sel.opt{background:#fb923c;color:#2b1100}
      .cal-d.sel.off{background:#ef4444;color:#fff}
      .cal-d.big{flex:1;height:54px;flex-direction:column;gap:2px;font-size:15px}.cal-d.big small{font:600 11px Cairo,Inter,sans-serif;opacity:.8}
      .cal-gate{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 8px;text-align:center;border:2px solid #ef4444;border-radius:18px}
      .cal-gate b{font:800 15px/1.4 Cairo,Inter,sans-serif;color:#ef4444}.cal-gate span{font:600 12.5px Cairo,Inter,sans-serif;color:var(--ink2)}
      .cal-go{height:34px;padding:0 22px;border-radius:999px;border:0;background:var(--btn);color:var(--onbtn);font:800 12.5px Cairo,Inter,sans-serif;cursor:pointer}
      .cal-mh{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:2px 4px 0;font:700 10.5px Cairo,Inter,sans-serif;color:var(--ink2);text-align:center}
      .cal-wr{display:grid;grid-template-columns:repeat(7,1fr);width:100%;height:40px;padding:0 4px;margin-top:6px;align-items:center;text-align:center;border:1.5px solid var(--sbd);border-radius:14px;background:transparent;color:var(--ink);font:700 12px Inter,sans-serif;cursor:pointer}
      @media(hover:hover){.cal-wr:hover{background:var(--chip)}}
      .cal-wr.susp{border:2px solid #ef4444}
      .cal-wr span.o{opacity:.3}.cal-wr span.t{width:26px;height:26px;line-height:23px;margin:auto;border-radius:8px;border:1.5px solid var(--ink)}
      .cal-ym{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:6px}
      .cal-ym button{height:44px;border-radius:14px;border:1.5px solid var(--sbd);background:transparent;color:var(--ink);font:700 12.5px Cairo,Inter,sans-serif;cursor:pointer}
      @media(hover:hover){.cal-ym button:hover{background:var(--chip)}}
      .cal-ym button.bad{border:2px solid #ef4444}.cal-ym button.cur{background:var(--chip)}
      .cal-big{font:800 22px/1 Inter,Cairo,sans-serif;direction:ltr;unicode-bidi:plaintext;text-align:start}
      .cal-tz{display:flex;gap:4px}
      .cal-tz button{flex:1;height:24px;padding:0 6px;border-radius:999px;border:1px solid var(--sbd);background:transparent;color:var(--ink2);font:700 10.5px Cairo,Inter,sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .cal-tz button.on{background:var(--btn);color:var(--onbtn);border-color:transparent}
      .cal-st{font:800 14px/1.3 Cairo,Inter,sans-serif}
      .cal-cd{font:800 22px/1 Inter,Cairo,sans-serif;direction:ltr;font-variant-numeric:tabular-nums;text-align:start}
      .cal-tag{font:700 10.5px/1.5 Cairo,Inter,sans-serif;color:var(--ink2)}
      .cal-off{justify-content:center;gap:4px}
      .cal-off b{font:800 15px/1.4 Cairo,Inter,sans-serif}.cal-off span{font:600 12.5px/1.4 Cairo,Inter,sans-serif;color:var(--ink2)}
      .cal-off.bad b{color:#ef4444}
      .cal-act{display:flex;flex-wrap:wrap;gap:8px}.cal-act:empty{display:none}
      .cal-act button{height:36px;padding:0 16px;border-radius:999px;border:1px solid var(--sbd);background:var(--pcard);color:var(--ink);font:700 12px Cairo,Inter,sans-serif;cursor:pointer}
      @media(hover:hover){.cal-act button:hover{background:var(--chip)}}
      #calEv{margin-top:10px}
      .cal-ev{min-height:320px;padding:14px;justify-content:flex-start;gap:12px}
      .cal-evh b{display:block;font:800 16px Cairo,Inter,sans-serif}.cal-evh span{font:600 11.5px Cairo,Inter,sans-serif;color:var(--ink2)}
      .cal-evl{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}
      .ev{display:flex;flex-direction:column;gap:7px;padding:12px;border-radius:16px;border:1.5px solid var(--sbd);background:var(--chip)}
      .ev.on{border-color:var(--ink)}
      .ev-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.ev-h b{font:800 13.5px Cairo,Inter,sans-serif}.ev-h span{font:600 11px Cairo,Inter,sans-serif;color:var(--ink2);unicode-bidi:plaintext}
      .ev-m{display:flex;flex-wrap:wrap;gap:6px}.ev-m i{font:700 10.5px Cairo,Inter,sans-serif;font-style:normal;padding:3px 9px;border-radius:999px;border:1px solid var(--sbd);color:var(--ink2)}
      .ev-t{font:700 12.5px/1.45 Cairo,Inter,sans-serif}.ev-n{font:500 12px/1.5 Cairo,Inter,sans-serif;color:var(--ink2)}
      .ev-p{display:flex;align-items:center;gap:8px;font:700 10.5px Cairo,Inter,sans-serif;color:var(--ink2)}.ev-p u{flex:1;height:6px;border-radius:999px;background:var(--sbd);overflow:hidden;text-decoration:none}.ev-p u i{display:block;height:100%;border-radius:999px;background:var(--ink)}
      @media(max-width:640px){.cal-c{min-height:92px}.cal-ym{grid-template-columns:repeat(3,1fr)}.cal-d.sel{font-size:12px}.cal-evl{grid-template-columns:1fr}}
      `;
      R.appendChild(st);
    }
    const keep = calSt; calStop();
    const t0 = calNow().n, d0 = cdate(t0);
    let tz = 'eg'; try { tz = localStorage.getItem('thCalTz') === 'mk' ? 'mk' : 'eg'; } catch (e) { }
    const S = calSt = keep || { view: 'week', sel: t0, mon: { y: d0.getUTCFullYear(), m: d0.getUTCMonth() }, yr: d0.getUTCFullYear(), gate: csusp(wstart(t0)) ? 'w' : null, stack: [] };
    const pad = n => String(n).padStart(2, '0'), cd = l => pad(Math.floor(l / 3600)) + ':' + pad(Math.floor(l % 3600 / 60)) + ':' + pad(l % 60);
    const phaseOf = l => l > 0 ? 'w' : (-l < CAL_MIN * 60 ? 'l' : 'd');
    const loc = () => lang() === 'ar' ? 'ar-u-nu-latn' : 'en-US';
    const fmt = (n, o) => new Intl.DateTimeFormat(loc(), Object.assign({ timeZone: 'UTC' }, o)).format(cdate(n));
    const clock = d => new Intl.DateTimeFormat(loc(), { timeZone: CAL_TZ[tz], hour: 'numeric', minute: '2-digit', hour12: true }).format(d);
    const snap = () => ({ view: S.view, sel: S.sel, mon: { y: S.mon.y, m: S.mon.m }, yr: S.yr });
    const monOf = n => ({ y: cdate(n).getUTCFullYear(), m: cdate(n).getUTCMonth() });
    const wt = (ws, td) => ws + 6 < td ? 'p' : ws <= td ? 'n' : 'f', mt = (y, m, td) => cnum(y, m + 1, 0) < td ? 'p' : cnum(y, m, 1) <= td ? 'n' : 'f';
    const btn = (a, label, txt, extra) => '<button type="button" class="cal-b" data-a="' + a + '" title="' + label + '" aria-label="' + label + '"' + (extra || '') + '>' + txt + '</button>';

    function head(T) {
      const v = S.view; let ti;
      if (v === 'week') { const ws = wstart(S.sel); ti = fmt(ws, { day: 'numeric', month: 'short' }) + ' – ' + fmt(ws + 6, { day: 'numeric', month: 'short', year: 'numeric' }); }
      else if (v === 'day') ti = fmt(S.sel, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
      else if (v === 'month') ti = fmt(cnum(S.mon.y, S.mon.m, 1), { month: 'long', year: 'numeric' });
      else ti = String(S.yr);
      const pv = lang() === 'ar' ? '›' : '‹', nx = lang() === 'ar' ? '‹' : '›';
      return '<div class="cal-h">' + (S.stack.length ? btn('back', T.back, lang() === 'ar' ? '→' : '←') : '') + btn('prev', T.prev, pv) + '<span class="cal-t">' + ti + '</span>' + btn('next', T.next, nx) +
        '<span class="cal-z">' + btn('zout', T.zout, '−', v === 'year' ? ' disabled' : '') + btn('zin', T.zin, '+', v === 'day' ? ' disabled' : '') + '</span></div>';
    }
    function body(T, td) {
      const v = S.view;
      if (S.gate) { const w = S.gate === 'w', k = w ? wt(wstart(S.sel), td) : mt(S.mon.y, S.mon.m, td); return '<div class="cal-gate"><b>' + (w ? T.gW[k] : T.gM[k]) + '</b><span>' + (w ? T.gWs : T.gMs) + '</span><button type="button" class="cal-go" data-a="cont">' + T.cont + '</button></div>'; }
      if (v === 'week') {
        const ws = wstart(S.sel); let h = '<div class="cal-wk' + (csusp(ws) ? ' susp' : '') + '">';
        for (let i = 0; i < 7; i++) { const n = ws + i; h += '<button type="button" class="cal-d ' + CAL_KIND[i] + (n === S.sel ? ' sel' : '') + '" data-a="day" data-n="' + n + '">' + T.days[i] + '</button>'; }
        return h + '</div>';
      }
      if (v === 'day') { const k = CAL_KIND[cwd(S.sel)]; return '<div class="cal-wk' + (csusp(wstart(S.sel)) ? ' susp' : '') + '"><button type="button" class="cal-d big sel ' + k + '">' + T.full[cwd(S.sel)] + '<small>' + fmt(S.sel, { day: 'numeric', month: 'long' }) + '</small></button></div>'; }
      if (v === 'month') {
        let h = '<div class="cal-mb"><div class="cal-mh">' + T.days.map(x => '<span>' + x + '</span>').join('') + '</div>';
        monWeeks(S.mon.y, S.mon.m).forEach(ws => {
          h += '<button type="button" class="cal-wr' + (csusp(ws) ? ' susp' : '') + '" data-a="wk" data-n="' + ws + '">';
          for (let i = 0; i < 7; i++) { const n = ws + i, o = cdate(n).getUTCMonth() !== S.mon.m; h += '<span class="' + (o ? 'o ' : '') + (n === td ? 't' : '') + '">' + cdate(n).getUTCDate() + '</span>'; }
          h += '</button>';
        });
        return h + '</div>';
      }
      const tdm = monOf(td); let h = '<div class="cal-ym">';
      for (let m = 0; m < 12; m++) h += '<button type="button" class="' + (CAL_INACTIVE.includes(m) ? 'bad ' : '') + (tdm.y === S.yr && tdm.m === m ? 'cur' : '') + '" data-a="mo" data-m="' + m + '">' + fmt(cnum(S.yr, m, 1), { month: 'long' }) + '</button>';
      return h + '</div>';
    }
    function details(T, nw) {
      const n = S.sel, wd = cwd(n), kind = CAL_KIND[wd], td = nw.n, left = CAL_HOUR * 3600 - nw.sec, ph = phaseOf(left);
      const dk = n < td ? 'p' : n > td ? 'f' : 'n', ts = n < td ? 'p' : n > td ? 'f' : (ph === 'd' ? 'p' : 'n');
      if (kind === 'off') {
        if (dk === 'n') { let nx = wd; do { nx = (nx + 1) % 7; } while (CAL_KIND[nx] !== 'lesson'); return { cls: 'one', h: '<div class="cal-c cal-off"><b>' + T.offT.n + '</b><span>' + T.see(T.full[nx]) + '</span></div>' }; }
        return { cls: 'one', h: '<div class="cal-c cal-off"><b>' + T.offT[dk] + '</b><span>' + T.offS[dk] + '</span></div>' };
      }
      if (csusp(wstart(n))) return { cls: 'one', h: '<div class="cal-c cal-off bad"><b>' + T.susp[dk] + '</b><span>' + T.suspS[dk] + '</span></div>' };
      let h = '<div class="cal-c"><div class="cal-l">' + T.tl[ts] + '</div><div class="cal-big">' + clock(cairoInst(n)) + '</div><div class="cal-tz"><button type="button" data-a="tz" data-tz="eg" class="' + (tz === 'eg' ? 'on' : '') + '">' + T.eg + '</button><button type="button" data-a="tz" data-tz="mk" class="' + (tz === 'mk' ? 'on' : '') + '">' + T.mk + '</button></div></div>';
      let st;
      if (dk === 'n') st = ph === 'w' ? '<div class="cal-st">' + T.left + '</div><div class="cal-cd" id="calCd">' + cd(left) + '</div>' : ph === 'l' ? '<div class="cal-st" style="color:#34d399">' + T.live + '</div>' : '<div class="cal-st">' + T.done + '</div>';
      else if (dk === 'f') st = '<div class="cal-st">' + T.inDays(n - td) + '</div><div class="cal-tag">' + T.fnote + '</div>'; else st = '<div class="cal-st">' + T.past + '</div>';
      h += '<div class="cal-c"><div class="cal-l">' + T.status + '</div>' + st + (kind === 'opt' ? '<div class="cal-tag">' + T.opt + '</div>' : '') + '</div>';
      return { cls: '', h, act: n >= td };
    }
    b.innerHTML = '<div class="cal-w"><div id="calTop"></div><div class="cal-dg" id="calDet"></div><div class="cal-act" id="calAct"></div><div class="cal-c cal-ev" id="calEv"></div></div>';
    const top = b.querySelector('#calTop'), detEl = b.querySelector('#calDet'), actEl = b.querySelector('#calAct'), evEl = b.querySelector('#calEv');
    let lastPh = '', lastDay = 0;
    function paintTop() { const nw = calNow(); top.innerHTML = '<div class="cal-c cal-cw">' + head(CAL[lang()]) + '<div id="calBody">' + body(CAL[lang()], nw.n) + '</div></div>'; }
    function paintDet() {
      const T = CAL[lang()], nw = calNow(); lastDay = nw.n; lastPh = phaseOf(CAL_HOUR * 3600 - nw.sec);
      const det = !S.gate && (S.view === 'week' || S.view === 'day') ? details(T, nw) : null;
      detEl.className = 'cal-dg' + (det && det.cls ? ' ' + det.cls : ''); detEl.innerHTML = det ? det.h : '';
      actEl.innerHTML = det && det.act ? '<button type="button">' + T.a1 + '</button><button type="button">' + T.a2 + '</button><button type="button">' + T.a3 + '</button><button type="button">' + T.a4 + '</button>' : '';
      paintEv(T, nw);
    }
    function paintEv(T, nw) {
      let h = '<div class="cal-evh"><b>' + T.ev + '</b><span>' + T.evs + '</span></div><div class="cal-evl">';
      calSessions(nw).forEach(x => {
        const i = x.no % 8, inst = cairoInst(x.n), prog = Math.min(100, Math.round(20 + x.no * 2.6));
        h += '<div class="ev' + (x.n === S.sel ? ' on' : '') + '"><div class="ev-h"><b>' + T.sess + ' #' + x.no + '</b><span>' + fmt(x.n, { weekday: 'short', day: 'numeric', month: 'short' }) + '</span></div>' +
          '<div class="ev-m"><i>' + T.start + ' ' + clock(new Date(inst.getTime() + CAL_START[i] * 6e4)) + '</i><i>' + T.lasted(CAL_LEN[i]) + '</i></div>' +
          '<div class="ev-t">' + T.top[i] + '</div><div class="ev-n">' + (T.notes[i] || T.nonotes) + '</div>' +
          '<div class="ev-p"><span>' + T.prog + '</span><u><i style="width:' + prog + '%"></i></u><span>' + prog + '%</span></div></div>';
      });
      evEl.innerHTML = h + '</div>';
    }
    const paint = () => { paintTop(); paintDet(); };
    /* ---- motion: zoom between levels (shapes grow / fold into each other), slide between neighbours ---- */
    const LVL = { year: 0, month: 1, week: 2, day: 3 }, EASE = 'cubic-bezier(.22,1,.36,1)';
    const still = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q1 = x => top.querySelector(x);
    function flip(el, r0, ms) {
      if (!el || !r0) return; const r1 = el.getBoundingClientRect(); if (!r1.width || !r1.height) return;
      el.animate([{ transformOrigin: '0 0', transform: 'translate(' + (r0.left - r1.left) + 'px,' + (r0.top - r1.top) + 'px) scale(' + (r0.width / r1.width) + ',' + (r0.height / r1.height) + ')' }, { transformOrigin: '0 0', transform: 'none' }], { duration: ms || 460, easing: EASE });
    }
    const fadeIn = (els, delay) => els.forEach(x => x.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: delay || 90, easing: 'ease-out', fill: 'backwards' }));
    function go(mut, dir) {
      const ov = S.view; mut(); const nv = S.view;
      if (still()) return paint();
      const kind = LVL[nv] > LVL[ov] ? 'in' : LVL[nv] < LVL[ov] ? 'out' : dir, ws = wstart(S.sel); let src = null;
      if (kind === 'in') src = ov === 'week' ? q1('.cal-d.sel') : ov === 'month' ? q1('.cal-wr[data-n="' + ws + '"]') : q1('.cal-ym button[data-m="' + S.mon.m + '"]');
      else if (kind === 'out') src = ov === 'day' ? q1('.cal-d.big') : ov === 'week' ? q1('.cal-wk') : q1('.cal-mb');
      const r0 = src ? src.getBoundingClientRect() : null;
      paint();
      let ok = false;
      if (r0 && (kind === 'in' || kind === 'out')) {
        if (nv === 'day') { const d = q1('.cal-d.big'); if (d) { flip(d, r0); ok = true; } }
        else if (nv === 'week' && kind === 'in') { const w = q1('.cal-wk'); if (w) { flip(w, r0); fadeIn([...w.children], 160); ok = true; } }
        else if (nv === 'week') { const cs = [...top.querySelectorAll('.cal-d')]; cs.forEach(c => { flip(c, r0); if (!c.classList.contains('sel')) fadeIn([c], 0); }); ok = cs.length > 0; }
        else if (nv === 'month' && kind === 'in') { const m = q1('.cal-mb'); if (m) { flip(m, r0); ok = true; } }
        else if (nv === 'month') { const r = q1('.cal-wr[data-n="' + ws + '"]'); if (r) { flip(r, r0); fadeIn([...top.querySelectorAll('.cal-wr,.cal-mh')].filter(x => x !== r)); ok = true; } }
        else if (nv === 'year') { const t = q1('.cal-ym button[data-m="' + S.mon.m + '"]'); if (t) { flip(t, r0); fadeIn([...top.querySelectorAll('.cal-ym button')].filter(x => x !== t)); ok = true; } }
      }
      const body = q1('#calBody');
      if (!ok && body) {
        if (kind === 'n' || kind === 'p') { const sg = ((kind === 'n') !== (lang() === 'ar')) ? 1 : -1; body.animate([{ opacity: 0, transform: 'translateX(' + sg * 40 + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: EASE }); }
        else body.animate([{ opacity: 0, transform: 'scale(' + (kind === 'in' ? .92 : 1.08) + ')' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: EASE });
      }
      detEl.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 300 });
    }
    const gm = m => { S.gate = CAL_INACTIVE.includes(m) ? 'm' : null; };
    const doStep = k => go(() => {
      if (S.view === 'week') { S.sel += 7 * k; S.gate = csusp(wstart(S.sel)) ? 'w' : null; }
      else if (S.view === 'day') { S.sel += k; S.gate = null; }
      else if (S.view === 'month') { const d = new Date(Date.UTC(S.mon.y, S.mon.m + k, 1)); S.mon = { y: d.getUTCFullYear(), m: d.getUTCMonth() }; gm(S.mon.m); }
      else S.yr += k;
    }, k > 0 ? 'n' : 'p');
    const doZin = () => { if (S.view === 'day') return; go(() => {
      S.stack.push(snap());
      if (S.view === 'week') { S.view = 'day'; S.gate = null; }
      else if (S.view === 'month') { const ws = monWeeks(S.mon.y, S.mon.m), cw = wstart(S.sel), w = ws.includes(cw) ? cw : ws[0]; if (cw !== w) S.sel = w; S.view = 'week'; S.gate = csusp(w) ? 'w' : null; }
      else { const m = monOf(S.sel); S.mon = { y: S.yr, m: m.y === S.yr ? m.m : 0 }; S.view = 'month'; gm(S.mon.m); }
    }); };
    const doZout = () => { if (S.view === 'year') return; go(() => {
      S.stack = []; S.gate = null;
      if (S.view === 'day') S.view = 'week'; else if (S.view === 'week') { S.mon = monOf(wstart(S.sel)); S.view = 'month'; } else { S.yr = S.mon.y; S.view = 'year'; }
    }); };

    /* slide-to-select: press a day and slide; the day under the finger becomes the chosen one without lifting */
    function pick(x) {
      const chips = [...top.querySelectorAll('.cal-d[data-n]')]; let best = null, bd = 1e9;
      chips.forEach(c => { const r = c.getBoundingClientRect(), d = x < r.left ? r.left - x : x > r.right ? x - r.right : 0; if (d < bd) { bd = d; best = c; } });
      if (!best) return; const n = +best.dataset.n; if (n === S.sel) return;
      S.sel = n; chips.forEach(c => c.classList.toggle('sel', +c.dataset.n === n)); paintDet();
    }
    /* swipes: left/right = previous/next, up = zoom in, down = zoom out (a slide that starts on a week day only selects days) */
    let g = null;
    top.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const chip = S.view === 'week' && !S.gate ? e.target.closest('.cal-d[data-n]') : null;
      g = { x: e.clientX, y: e.clientY, axis: '', chip: !!chip };
      if (chip) { try { q1('.cal-wk').setPointerCapture(e.pointerId); } catch (x) { } pick(e.clientX); }
    });
    top.addEventListener('pointermove', e => {
      if (!g) return; const dx = e.clientX - g.x, dy = e.clientY - g.y;
      if (!g.axis) { if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (!g.chip || g.axis === 'y') { try { top.setPointerCapture(e.pointerId); } catch (x) { } } }
      if (g.chip && g.axis === 'x') pick(e.clientX);
    });
    top.addEventListener('pointerup', e => {
      const q = g; g = null; if (!q || !q.axis) return;
      const dx = e.clientX - q.x, dy = e.clientY - q.y;
      if (q.axis === 'x') { if (q.chip || Math.abs(dx) < 40) return; doStep((dx > 0) === (lang() === 'ar') ? 1 : -1); }
      else if (Math.abs(dy) >= 40) { if (dy < 0) doZin(); else doZout(); }
    });
    top.addEventListener('pointercancel', () => { g = null; });
    top.addEventListener('click', e => {
      const t = e.target.closest('[data-a]'); if (!t) return; const a = t.dataset.a;
      if (a === 'tz') { tz = t.dataset.tz; try { localStorage.setItem('thCalTz', tz); } catch (x) { } return paint(); }
      if (a === 'cont') { S.gate = null; return paint(); }
      if (a === 'day') { S.sel = +t.dataset.n; return paint(); }
      if (a === 'back') return go(() => { const p = S.stack.pop(); if (p) { S.view = p.view; S.sel = p.sel; S.mon = p.mon; S.yr = p.yr; S.gate = null; } });
      if (a === 'wk') return go(() => { S.stack.push(snap()); const ws = +t.dataset.n; S.view = 'week'; if (wstart(S.sel) !== ws) S.sel = ws; S.gate = csusp(ws) ? 'w' : null; });
      if (a === 'mo') return go(() => { S.stack.push(snap()); S.mon = { y: S.yr, m: +t.dataset.m }; S.view = 'month'; gm(S.mon.m); });
      if (a === 'prev') return doStep(-1);
      if (a === 'next') return doStep(1);
      if (a === 'zin') return doZin();
      if (a === 'zout') return doZout();
    });
    paint();
    const tm = setInterval(() => {
      const nw = calNow(), ph = phaseOf(CAL_HOUR * 3600 - nw.sec);
      if (nw.n !== lastDay || ph !== lastPh) return paint();
      const el = top.parentNode.querySelector('#calCd'); if (el) el.textContent = cd(CAL_HOUR * 3600 - nw.sec);
    }, 1000);
    calStop = () => { clearInterval(tm); calStop = () => { }; calSt = null; };
  }

    return { id: 'calendar', button: button, render: renderCal, stop: function () { calStop(); }, CAL_TZ: CAL_TZ };
  };
})();
