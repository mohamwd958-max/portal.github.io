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
      en: { prev: 'Previous bills', noPrev: 'No previous bills yet.', due: 'Amount due', status: 'Status', none: 'No dues', owed: 'Payment due', cur: 'EGP' },
      ar: { prev: 'فواتيري السابقة', noPrev: 'لا توجد فواتير سابقة بعد.', due: 'المستحق', status: 'الحالة', none: 'لا توجد مستحقات', owed: 'يوجد مستحق', cur: 'جنيه مصري' }
    };
    /* The bills. current = this month's bill (due 0 for now), previous = the older bills. */
    const BILLS = { current: { due: 0 }, previous: [] };
    const CSS = `
      .fin-w{width:100%;max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:28px;padding:36px 0 30px}
      .fin-c{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:20px;background:var(--pcard);border:1px solid var(--sbd);color:var(--ink)}
      .fin-l{font:800 14px Cairo,Inter,sans-serif;color:var(--ink)}
      .fin-e{font:600 13.5px Cairo,Inter,sans-serif;color:var(--ink2);padding:2px 0}
      .fin-h{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;background:none;border:0;padding:0;margin:0;cursor:pointer;color:var(--ink);font:800 14px Cairo,Inter,sans-serif;text-align:start}
      .fin-h svg{width:18px;height:18px;flex:none;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s}
      .fin-h[aria-expanded="true"] svg{transform:rotate(180deg)}
      .fin-b{display:flex;flex-direction:column;gap:10px;padding-top:4px}
      .fin-b[hidden]{display:none}
      .fin-r{display:flex;justify-content:space-between;gap:10px;font:600 13.5px Cairo,Inter,sans-serif;color:var(--ink2)}
      .fin-r b{font-weight:800;color:var(--ink)}
    `;
    function render(b) {
      const L = ctx.lang(), T = TX[L] || TX.ar, ar = L !== 'en', esc = ctx.esc;
      if (!ctx.R.getElementById('thFinCss')) { const st = document.createElement('style'); st.id = 'thFinCss'; st.textContent = CSS; ctx.R.appendChild(st); }
      b.classList.remove('full');

      const month = new Intl.DateTimeFormat(ar ? 'ar-EG-u-nu-latn' : 'en-US', { month: 'long', year: 'numeric' }).format(new Date());
      const due = (BILLS.current && BILLS.current.due) || 0;
      const statusTxt = due > 0 ? T.owed : T.none;

      b.innerHTML = '<div class="fin-w" dir="' + (ar ? 'rtl' : 'ltr') + '">' +
        '<div class="fin-c">' +
          '<button type="button" class="fin-h" aria-expanded="false">' +
            '<span>' + esc(month) + '</span>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
          '</button>' +
          '<div class="fin-b" hidden>' +
            '<div class="fin-r"><span>' + esc(T.due) + '</span><b>' + esc(due + ' ' + T.cur) + '</b></div>' +
            '<div class="fin-r"><span>' + esc(T.status) + '</span><b>' + esc(statusTxt) + '</b></div>' +
          '</div>' +
        '</div>' +
        '<div class="fin-c"><div class="fin-l">' + esc(T.prev) + '</div><div class="fin-e">' + esc(T.noPrev) + '</div></div></div>';

      const head = b.querySelector('.fin-h'), body = b.querySelector('.fin-b');
      head.addEventListener('click', function () {
        const open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open;
      });
    }

    return { id: 'finance', button: button, render: render };
  };
})();
