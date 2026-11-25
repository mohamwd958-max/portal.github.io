/* =====================================================================
   قاموسك  (ydict)  -  المحتوى
   بيستبدل الشاشة بالحاويات الجاهزة من lists-core.js، وبيشيل علامة "تحت الإنشاء" (maint) و page من الزرار.
   الأيقونة والاسم وباقي الزرار بيفضلوا زي ما هما في js/buttons/btn-ydict.js (الملف ده ما بيلمسوش).
   لازم يتحمّل بعد btn-ydict.js و lists-core.js
   ===================================================================== */
(function () {
  var B = window.ThabitBtn = window.ThabitBtn || {}, base = B.ydict;
  B.ydict = function (ctx) {
    var m = (base ? base(ctx) : null) || {};
    delete m.maint; delete m.page;   /* no more under construction */
    var s = window.ThabitLists.screen(ctx, ['qol']);
    m.render = s.render; m.stop = s.stop; m.full = s.full;
    return m;
  };
})();