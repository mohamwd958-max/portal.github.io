/* =====================================================================
   SIDEBAR BUTTON: digital
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + صفحة "قريبًا" + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-digital.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.digital = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M7 11a4 4 0 0 1 .6-7.9A5 5 0 0 1 17 5a3.5 3.5 0 0 1 0 6z"/><rect x="3.5" y="15" width="4" height="5" rx="1"/><rect x="10" y="15" width="4" height="5" rx="1"/><rect x="16.5" y="15" width="4" height="5" rx="1"/>';
    ctx.IC.digital = ICON;
    ctx.STR.en.i_digital = 'Digital Solutions'; ctx.STR.ar.i_digital = 'الحلول الرقمية';

    /* ---- the screen ---- */
    function render(b) { b.innerHTML = '<div class="pcard" data-t="soonc"></div>'; b.firstChild.textContent = ctx.STR[ctx.lang()].soonc; }

    return { id: 'digital', render: render };
  };
})();
