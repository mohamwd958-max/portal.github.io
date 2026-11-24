/* =====================================================================
   SIDEBAR BUTTON: feed
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي (مع الـbadge) + اسم الصفحة اللي بيفتحها + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-feed.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.feed = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/>';
    ctx.IC.feed = ICON;
    ctx.STR.en.i_feed = 'Feed'; ctx.STR.ar.i_feed = 'التطورات';
    const button = '<button type="button" class="sdi st" data-k="feed" data-title="i_feed"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg><i class="bdg" id="feedBdg"></i></button>';

    /* ---- the screen ---- */
    function render(b) { /* الصفحة بتتفتح كـ iframe دائم من index.html (page) */ }

    /* page: الملف اللي بيتفتح في منطقة العرض (iframe دائم بيديره index.html) */
    return { id: 'feed', button: button, page: 'feed.html', render: render };
  };
})();
