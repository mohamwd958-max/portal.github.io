/* =====================================================================
   SIDEBAR BUTTON: res
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + نصوص الكروت + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-res.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.res = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2.2h8A1.5 1.5 0 0 1 20.5 9.7V17.5A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"/>';
    ctx.IC.res = ICON;
    ctx.STR.en.i_res = 'Resources'; ctx.STR.ar.i_res = 'الموارد';
    ctx.STR.en.tefl = 'TEFL'; ctx.STR.ar.tefl = 'TEFL';
    ctx.STR.en.notes = 'Notes'; ctx.STR.ar.notes = 'نوتس';
    ctx.STR.en.scrib = 'Scribbles'; ctx.STR.ar.scrib = 'خربشات';

    /* ---- the screen ---- */
    function render(b) { ctx.ucPage(b, null, [['tefl', null], ['notes', null], ['scrib', null]]); }

    return { id: 'res', render: render };
  };
})();
