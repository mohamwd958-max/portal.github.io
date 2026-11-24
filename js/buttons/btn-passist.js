/* =====================================================================
   SIDEBAR BUTTON: passist
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + رسالة الصفحة + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-passist.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.passist = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M5 21v-4.2C3.9 15.5 3.3 13.7 3.3 11.8 3.3 7.3 6.6 3.5 10.9 3.5c2.9 0 5.1 1.5 6 3.8l1.3 3.2-1.7.9.3 1.5-.7.6.7.8-.4 1.3c-.2.9-1 1.5-1.9 1.5h-1.8V21"/><path d="M20 11.4l2.1-1M20.4 13.6h2.4M20 15.8l2.1 1"/>';
    ctx.IC.passist = ICON;
    ctx.STR.en.i_passist = 'Pronunciation Assistant'; ctx.STR.ar.i_passist = 'مساعد النطق';
    ctx.STR.en.passistMsg = 'Your Pronunciation Assistant will be here soon.'; ctx.STR.ar.passistMsg = 'مساعد النطق سيكون هنا قريبًا.';

    /* ---- the screen ---- */
    function render(b) { ctx.ucPage(b, 'passistMsg'); }

    return { id: 'passist', render: render };
  };
})();
