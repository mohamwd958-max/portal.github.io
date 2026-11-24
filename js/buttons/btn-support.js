/* =====================================================================
   SIDEBAR BUTTON: support
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي + رسالة الصفحة + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-support.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.support = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M4 14v-2.5a8 8 0 0 1 16 0V14"/><rect x="2.8" y="13" width="3.6" height="5.6" rx="1.4"/><rect x="17.6" y="13" width="3.6" height="5.6" rx="1.4"/><path d="M19.4 18.6c0 1.9-1.7 3-4.2 3H13"/>';
    ctx.IC.support = ICON;
    ctx.STR.en.i_support = 'Support'; ctx.STR.ar.i_support = 'الدعم';
    ctx.STR.en.supportMsg = 'All the information and all the policies will be shown here, and you will find the answers to every question that may come to mind about the program and the services we offer. Coming soon.'; ctx.STR.ar.supportMsg = 'ستُعرض هنا جميع البيانات وجميع السياسات، وستجد هنا إجابات جميع الأسئلة التي قد تخطر في بالك عن البرنامج والخدمات التي نقدمها، قريبًا.';
    const button = '<button type="button" class="sdi st sup lbl" data-k="support"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg><span data-t="i_support"></span></button>';

    /* ---- the screen ---- */
    function render(b) { ctx.ucPage(b, 'supportMsg'); }

    return { id: 'support', button: button, render: render };
  };
})();
