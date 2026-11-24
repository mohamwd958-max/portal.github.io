/* =====================================================================
   SIDEBAR BUTTON: translate
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + صفحة "قريبًا" + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-translate.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.translate = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<circle cx="10" cy="14" r="8"/><ellipse cx="10" cy="14" rx="3.3" ry="8"/><path d="M2 14h16M3.2 9.5h13.6M3.2 18.5h13.6"/><path d="M19 2.5a3 3 0 0 1 3 3c0 2.2-3 5-3 5s-3-2.8-3-5a3 3 0 0 1 3-3z"/><circle cx="19" cy="5.5" r=".9"/>';
    ctx.IC.translate = ICON;
    ctx.STR.en.i_translate = 'Translation'; ctx.STR.ar.i_translate = 'الترجمة';

    /* ---- the screen ---- */
    function render(b) { b.innerHTML = '<div class="pcard" data-t="soonc"></div>'; b.firstChild.textContent = ctx.STR[ctx.lang()].soonc; }

    return { id: 'translate', render: render };
  };
})();
