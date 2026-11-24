/* =====================================================================
   SIDEBAR BUTTON: voice
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + صفحة "قريبًا" + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-voice.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.voice = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<rect x="9" y="2.5" width="6" height="10" rx="3"/><path d="M6 10.5a6 6 0 0 0 12 0M12 16.5V20M8.5 21h7"/>';
    ctx.IC.voice = ICON;
    ctx.STR.en.i_voice = 'Voice Over'; ctx.STR.ar.i_voice = 'التعليق الصوتي';

    /* ---- the screen ---- */
    function render(b) { b.innerHTML = '<div class="pcard" data-t="soonc"></div>'; b.firstChild.textContent = ctx.STR[ctx.lang()].soonc; }

    return { id: 'voice', render: render };
  };
})();
