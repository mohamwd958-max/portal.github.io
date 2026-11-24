/* =====================================================================
   SIDEBAR BUTTON: finance
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي + شاشة الفواتير + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-finance.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage, esc, MOD }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.finance = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M4 7a2 2 0 0 1 2-2h11v3"/><path d="M4 7v10a2 2 0 0 0 2 2h12.5a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 18.5 8H6a2 2 0 0 1-2-1z"/><circle cx="16.2" cy="13.5" r="1.1" fill="currentColor"/>';
    ctx.IC.finance = ICON;
    ctx.STR.en.i_finance = 'Finance'; ctx.STR.ar.i_finance = 'المالية';
    const button = '<button type="button" class="sdi st sup lbl" data-k="finance"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg><span data-t="i_finance"></span></button>';

    /* ---- the screen ---- */
    const TX = {
      en: { cur: 'EGP', finCur: 'Current month', due: 'Amount due', status: 'Status', none: 'No dues', prev: 'My previous bills', noPrev: 'No previous bills yet.' },
      ar: { cur: 'جنيه مصري', finCur: 'الشهر الحالي', due: 'المستحق', status: 'الحالة', none: 'لا توجد مستحقات', prev: 'فواتيري السابقة', noPrev: 'لا توجد فواتير سابقة بعد.' }
    };
    const CSS = `
      .fin-w{width:100%;max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:14px;padding:6px 0 30px}
      .fin-c{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:20px;background:var(--pcard);border:1px solid var(--sbd);color:var(--ink)}
      .fin-l{font:700 12px Cairo,Inter,sans-serif;color:var(--ink2)}
      .fin-t{font:800 22px Cairo,Inter,sans-serif}
      .fin-r{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding-top:10px;border-top:1px solid var(--sbd);font:600 13.5px Cairo,Inter,sans-serif}
      .fin-r span{color:var(--ink2)}
      .fin-e{font:600 13.5px Cairo,Inter,sans-serif;color:var(--ink2);padding:6px 0}
    `;
    function render(b) {
      const L = ctx.lang(), T = TX[L], ar = L === 'ar', esc = ctx.esc;
      if (!ctx.R.getElementById('thFinCss')) { const st = document.createElement('style'); st.id = 'thFinCss'; st.textContent = CSS; ctx.R.appendChild(st); }
      let mon = ''; try { mon = new Intl.DateTimeFormat(ar ? 'ar-EG-u-nu-latn' : 'en-US', { timeZone: (ctx.MOD.calendar.CAL_TZ || { eg: 'Africa/Cairo' }).eg, month: 'long', year: 'numeric' }).format(new Date()); } catch (e) { }
      b.classList.remove('full');
      b.innerHTML = '<div class="fin-w" dir="' + (ar ? 'rtl' : 'ltr') + '"><div class="fin-c"><div class="fin-l">' + esc(T.finCur) + '</div><div class="fin-t">' + esc(mon) + '</div>' +
        '<div class="fin-r"><span>' + esc(T.due) + '</span><b>0 ' + esc(T.cur) + '</b></div><div class="fin-r"><span>' + esc(T.status) + '</span><b>' + esc(T.none) + '</b></div></div>' +
        '<div class="fin-c"><div class="fin-l">' + esc(T.prev) + '</div><div class="fin-e">' + esc(T.noPrev) + '</div></div></div>';
    }

    return { id: 'finance', button: button, render: render };
  };
})();
