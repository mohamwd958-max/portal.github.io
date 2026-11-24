/* =====================================================================
   SIDEBAR BUTTON: dash
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + شاشة Vital Signs (iframe) + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-dash.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage, esc, MOD, cfg, tidyFrame }
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.dash = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>';
    ctx.IC.dash = ICON;
    ctx.STR.en.i_dash = 'Vital Signs'; ctx.STR.ar.i_dash = 'العلامات الحيوية';

    /* ---- the screen ---- */
    function render(b) {
      if (!ctx.cfg.dashRoute) { b.innerHTML = '<div class="pcard" data-t="soonc"></div>'; b.firstChild.textContent = ctx.STR[ctx.lang()].soonc; return; }
      b.innerHTML = '';
      const f = document.createElement('iframe'); f.className = 'dframe'; f.title = 'Vital Signs'; f.src = ctx.cfg.dashRoute();
      f.addEventListener('load', () => { ctx.tidyFrame(f); }); b.appendChild(f);
    }

    /* full: الشاشة بتتفتح full-page (iframe) لو الـcfg.dashRoute موجود */
    return { id: 'dash', render: render, full: function () { return !!ctx.cfg.dashRoute; } };
  };
})();
