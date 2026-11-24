/* =====================================================================
   SIDEBAR BUTTON: store
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي + رسالة الصفحة + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-store.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.store = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9"/><path d="M5 12v8h14v-8M10 20v-4.5h4V20"/>';
    ctx.IC.store = ICON;
    ctx.STR.en.i_store = 'Our Store'; ctx.STR.ar.i_store = 'متجرنا';
    ctx.STR.en.storeMsg = 'We will showcase our products here when they become available.'; ctx.STR.ar.storeMsg = 'سنعرض منتجاتنا هنا حين تتوفر.';
    const button = '<button type="button" class="sdi st" data-k="store" data-title="storeMsg"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg></button>';

    /* ---- the screen ---- */
    function render(b) { ctx.ucPage(b, 'storeMsg'); }

    return { id: 'store', button: button, render: render };
  };
})();
