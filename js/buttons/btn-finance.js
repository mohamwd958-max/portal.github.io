/* =====================================================================
   SIDEBAR BUTTON: finance
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي + شاشة الفواتير + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/buttons/، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/buttons/btn-finance.js"></script>
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

    /* ---- the screen: two places only: the current bill, and the previous bills ---- */
    const TX = {
      en: { cur: 'Current bill', curEmpty: 'No bill yet. Your bill is issued on the 25th of each month.', prev: 'Previous bills', noPrev: 'No previous bills yet.' },
      ar: { cur: 'الفاتورة الحالية', curEmpty: 'لا توجد فاتورة بعد. تصدر فاتورتك يوم 25 من كل شهر.', prev: 'فواتيري السابقة', noPrev: 'لا توجد فواتير سابقة بعد.' }
    };
    /* The bills. Nothing has been issued yet, so both are empty.
       Later: current = the bill raised on the 25th of the month (stays empty until then), previous = the older bills. The bill's design goes in renderBill (not built yet). */
    const BILLS = { current: null, previous: [] };
    const CSS = `
      .fin-w{width:100%;max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:14px;padding:6px 0 30px}
      .fin-c{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:20px;background:var(--pcard);border:1px solid var(--sbd);color:var(--ink)}
      .fin-l{font:800 14px Cairo,Inter,sans-serif;color:var(--ink)}
      .fin-e{font:600 13.5px Cairo,Inter,sans-serif;color:var(--ink2);padding:2px 0}
    `;
    function render(b) {
      const L = ctx.lang(), T = TX[L] || TX.ar, ar = L !== 'en', esc = ctx.esc;
      if (!ctx.R.getElementById('thFinCss')) { const st = document.createElement('style'); st.id = 'thFinCss'; st.textContent = CSS; ctx.R.appendChild(st); }
      b.classList.remove('full');
      b.innerHTML = '<div class="fin-w" dir="' + (ar ? 'rtl' : 'ltr') + '">' +
        '<div class="fin-c"><div class="fin-l">' + esc(T.cur) + '</div><div class="fin-e">' + esc(T.curEmpty) + '</div></div>' +
        '<div class="fin-c"><div class="fin-l">' + esc(T.prev) + '</div><div class="fin-e">' + esc(T.noPrev) + '</div></div></div>';
    }

    return { id: 'finance', maint: true, button: button, render: render };
  };
})();
