/* =====================================================================
   PAGE GATE (page-gate.js)  -  الصفحة ما تظهرش إلا لما الخلفية تجهز
   ---------------------------------------------------------------------
   المشكلة: الصفحة بتظهر بلون الخلفية الأساسي، وبعدها الخلفية الحقيقية (الجراديانت والصورة) بتتحط فجأة،
            فبيبان وميض أو تبديل.
   الحل:    الصفحة بتتخبّى (opacity 0) من أول لحظة، والمتصفح بيرسم لون الخلفية الأساسي بس، وأول ما الخلفية
            تجهز (الصور اتحمّلت واتفكّت) الصفحة بتظهر بفيد بطيء وهادي.

   الاستخدام: سطر واحد في أول الـ<head> (قبل أي سكريبت تاني) في أي صفحة أساسية:
                 <script src="js/page-gate.js"></script>
              ومفيش أي حاجة تانية تتكتب في الـHTML.

   من غير JavaScript: الصفحة بتظهر عادي (الإخفاء بيتحط من الملف ده نفسه).
   لو حاجة وقفت (صورة ما اتحمّلتش، إلخ): الصفحة بتظهر لوحدها بعد maxWaitMs، عمرها ما بتفضل مخفية.

   للتحكم من كود تاني:  ThabitGate.reveal()  ← أظهر الصفحة حالًا
   ===================================================================== */
(function () {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  var CFG = {
    maxWaitMs: 3000,        // أقصى وقت تستنى فيه (بعده الصفحة تظهر مهما حصل)
    fadeMs: 700,            // مدة الظهور (بطيء وهادي). 0 = يظهر فورًا
    easing: 'ease-out',
    waitForFonts: false,    // true = كمان تستنى الخطوط (ممكن يبطّأ لو النت ضعيف)
    waitForBackground: true,// تستنى صور الخلفية (body و html) تتحمّل وتتفك
    respectReducedMotion: true
  };

  var root = document.documentElement, done = false;
  var reduce = CFG.respectReducedMotion && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fade = reduce ? 0 : CFG.fadeMs;

  /* ---- 1) إخفاء من أول لحظة (قبل أي رسم) ---- */
  try {
    var st = document.createElement('style');
    st.id = 'thGateCss';
    st.textContent =
      'html.th-wait body{opacity:0!important}' +
      '@keyframes thGateIn{from{opacity:0}to{opacity:1}}' +
      'html.th-go body{animation:thGateIn ' + fade + 'ms ' + CFG.easing + ' both}';
    (document.head || root).appendChild(st);
    root.classList.add('th-wait');
  } catch (e) { return; }

  /* ---- 2) إظهار ---- */
  function reveal() {
    if (done) return;
    done = true;
    root.classList.remove('th-wait');
    if (fade > 0) {
      root.classList.add('th-go');
      setTimeout(function () { root.classList.remove('th-go'); }, fade + 80);
    }
  }
  window.ThabitGate = { reveal: reveal, CFG: CFG };
  setTimeout(reveal, CFG.maxWaitMs);   // الأمان: عمرها ما تفضل مخفية

  /* ---- 3) نستنى الخلفية ---- */
  function bgUrls() {
    var out = [];
    [document.body, root].forEach(function (el) {
      if (!el) return;
      var v = getComputedStyle(el).backgroundImage || '', re = /url\((['"]?)(.*?)\1\)/g, m;
      while ((m = re.exec(v))) if (m[2] && out.indexOf(m[2]) < 0) out.push(m[2]);
    });
    return out;
  }
  function load(u) {
    return new Promise(function (ok) {
      var i = new Image(); i.onload = i.onerror = function () { ok(); };
      i.src = u;
      if (i.decode) i.decode().then(ok, ok);
    });
  }
  function ready() {
    var jobs = [];
    if (CFG.waitForBackground) bgUrls().forEach(function (u) { jobs.push(load(u)); });
    if (CFG.waitForFonts && document.fonts && document.fonts.ready) jobs.push(document.fonts.ready);
    return Promise.all(jobs);
  }
  function go() {
    try {
      ready().then(function () {
        /* فريمين: علشان المتصفح يرسم الخلفية فعلًا قبل ما نظهر */
        requestAnimationFrame(function () { requestAnimationFrame(reveal); });
      }, reveal);
    } catch (e) { reveal(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
