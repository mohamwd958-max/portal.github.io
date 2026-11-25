/* =====================================================================
   الموارد  (res)  -  المحتوى
   بيستبدل الشاشة بالحاويات الجاهزة من lists-core.js، وبيشيل علامة "تحت الإنشاء" (maint) و page من الزرار.
   الأيقونة والاسم وباقي الزرار بيفضلوا زي ما هما في js/buttons/btn-res.js (الملف ده ما بيلمسوش).
   لازم يتحمّل بعد btn-res.js و lists-core.js و res-scratch.js
   ===================================================================== */
(function () {
  var B = window.ThabitBtn = window.ThabitBtn || {}, base = B.res;
  B.res = function (ctx) {
    var m = (base ? base(ctx) : null) || {};
    delete m.maint; delete m.page;   /* no more under construction */
    var s = window.ThabitLists.screen(ctx, ['tefl', 'notes', 'scratch']);
    m.render = s.render; m.stop = s.stop; m.full = s.full;
    return m;
  };
})();