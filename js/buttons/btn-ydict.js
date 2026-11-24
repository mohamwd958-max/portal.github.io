/* =====================================================================
   SIDEBAR BUTTON: ydict
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + رسالة الصفحة + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-ydict.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.ydict = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M12 6.5C10.4 5.2 8.2 4.6 4.5 4.8v13.2c3.7-.2 5.9.4 7.5 1.7 1.6-1.3 3.8-1.9 7.5-1.7V4.8c-3.7-.2-5.9.4-7.5 1.7z"/><path d="M12 6.5v13.2"/><path d="M15.9 8.2l.55 1.15 1.25.18-.9.88.22 1.25-1.12-.6-1.12.6.22-1.25-.9-.88 1.25-.18z" fill="currentColor" stroke="none"/>';
    ctx.IC.ydict = ICON;
    ctx.STR.en.i_ydict = 'Your Dictionary'; ctx.STR.ar.i_ydict = 'قاموسك';
    ctx.STR.en.ydictMsg = 'All your important words that you can practise and improve your pronunciation of over time will be collected here, so that, with time, you have a dictionary built especially for you.'; ctx.STR.ar.ydictMsg = 'ستجد هنا جميع كلماتك المهمة التي يمكنك التدرّب عليها وتحسين نطقها مع الوقت، وستُطلب منك هنا، بحيث يتكوّن لديك مع الوقت قاموس مبنيّ خصيصًا لك أنت.';

    /* ---- the screen ---- */
    function render(b) { ctx.ucPage(b, 'ydictMsg'); }

    return { id: 'ydict', render: render };
  };
})();
