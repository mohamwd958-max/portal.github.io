/* =====================================================================
   SIDEBAR BUTTON: consult
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + صفحة "قريبًا" + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-consult.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.consult = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5z"/>';
    ctx.IC.consult = ICON;
    ctx.STR.en.i_consult = 'Personal Consultation'; ctx.STR.ar.i_consult = 'الاستشارة الشخصية';

    /* ---- the screen ---- */
    function render(b) { b.innerHTML = '<div class="pcard" data-t="soonc"></div>'; b.firstChild.textContent = ctx.STR[ctx.lang()].soonc; }

    return { id: 'consult', render: render };
  };
})();
