/* =====================================================================
   SIDEBAR BUTTON: compass
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + رسالة الصفحة + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-compass.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.compass = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z"/>';
    ctx.IC.compass = ICON;
    ctx.STR.en.i_compass = 'Compass'; ctx.STR.ar.i_compass = 'البوصلة';
    ctx.STR.en.compassMsg = 'Your road map will be shown here: where you are now and where you should go next.'; ctx.STR.ar.compassMsg = 'هنا هتظهر خريطة طريقك: إنت فين دلوقتي وإنت رايح فين.';

    /* ---- the screen ---- */
    function render(b) { ctx.ucPage(b, 'compassMsg'); }

    return { id: 'compass', render: render };
  };
})();
