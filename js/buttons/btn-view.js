/* =====================================================================
   SIDEBAR BUTTON: view
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي + نصوص الكروت + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-view.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.view = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z"/>';
    ctx.IC.view = ICON;
    ctx.STR.en.i_view = 'Your Viewpoint'; ctx.STR.ar.i_view = 'وجهة نظرك';
    ctx.STR.en.rat = 'Ratings'; ctx.STR.ar.rat = 'التقييمات';
    ctx.STR.en.sug = 'Suggestions'; ctx.STR.ar.sug = 'اقتراحات';
    ctx.STR.en.sugD = 'Suggestions to improve the site'; ctx.STR.ar.sugD = 'اقتراحات لتحسين الموقع';
    const button = '<button type="button" class="sdi st" data-k="view" data-title="i_view"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg></button>';

    /* ---- the screen ---- */
    function render(b) { ctx.ucPage(b, null, [['rat', null], ['sug', 'sugD']]); }

    return { id: 'view', button: button, render: render };
  };
})();
