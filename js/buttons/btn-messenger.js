/* =====================================================================
   SIDEBAR BUTTON: messenger
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي (مع الـbadge) + اسم الصفحة اللي بيفتحها + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-messenger.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.messenger = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M21.4 3.3 2.9 10.4c-.9.3-.9 1.5 0 1.8l4.6 1.6 1.8 5.5c.3.9 1.4 1 1.9.3l2.4-2.6 4.6 3.4c.7.5 1.6.1 1.8-.7L22.9 4.8c.2-1-.7-1.9-1.5-1.5z"/><path d="M7.6 13.8 17.4 7"/>';
    ctx.IC.messenger = ICON;
    ctx.STR.en.i_messenger = 'Messenger'; ctx.STR.ar.i_messenger = 'المرسال';
    const button = '<button type="button" class="sdi st" data-k="messenger" data-title="i_messenger"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg><i class="bdg" id="msgBdg"></i></button>';

    /* ---- the screen ---- */
    function render(b) { /* الصفحة بتتفتح كـ iframe دائم من index.html (page) */ }

    /* page: الملف اللي بيتفتح في منطقة العرض (iframe دائم بيديره index.html) */
    return { id: 'messenger', button: button, page: 'messenger.html', render: render };
  };
})();
