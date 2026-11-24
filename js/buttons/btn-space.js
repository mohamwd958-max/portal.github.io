/* =====================================================================
   SIDEBAR BUTTON: space
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + المساحة الحرة كلها + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-space.js"></script>
   و index.html بينده عليه بـ thx = كل الأدوات المشتركة اللي بيدّيها index.html (R, W, L, STR, esc, MOD, openLayer ...)
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.space = function (thx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M4 20v-3.8L16.2 4a1.9 1.9 0 0 1 2.7 0l1.1 1.1a1.9 1.9 0 0 1 0 2.7L7.8 20z"/><path d="M13.6 6.7l3.7 3.7"/>';
    thx.IC.space = ICON;
    thx.STR.en.i_space = 'Free Space'; thx.STR.ar.i_space = 'المساحة الحرة';

    /* ---- the screen: الكود اتنقل من index.html زي ما هو (المساحة الحرة) ---- */
/* ---------- Free Space (the pen): same page as the old Space button in the dashboard ---------- */
  const SPACE_SOON = true;   /* true = the "under development" page; false = the real board (board.html?student=1) */

  const SPT = { en: { d: 'On this page you can pick up a pen and start drawing your own free space however you like.', s: 'This page is still being updated and is under development. It will be available very soon.' }, ar: { d: 'في هذه الصفحة تستطيع أن تلتقط قلمًا وتبدأ برسم مساحتك الحرة كيفما شئت.', s: 'لا زالت هذه الصفحة تحت التحديث أو قيد التطوير، وستكون متاحة في أقرب وقت.' } };
function gearD(cx, cy, R, r, n) { const p = 2 * Math.PI / n; let d = ''; for (let i = 0; i < n; i++) { const a = i * p, pt = (rad, k) => (cx + rad * Math.cos(a + k * p)).toFixed(2) + ' ' + (cy + rad * Math.sin(a + k * p)).toFixed(2); d += (i ? 'A' + r + ' ' + r + ' 0 0 1 ' + pt(r, -.26) + ' ' : 'M' + pt(r, -.26) + ' ') + 'L' + pt(R, -.15) + ' L' + pt(R, .15) + ' L' + pt(r, .26) + ' '; } return d + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(-.26 * p)).toFixed(2) + ' ' + (cy + r * Math.sin(-.26 * p)).toFixed(2) + 'Z'; }
const spark = (x, y, s) => 'M' + x + ' ' + (y - s) + 'Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + 'Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'Z';
function renderSpace(b) {
    if (!SPACE_SOON) { b.innerHTML = ''; b.classList.add('full'); const f = document.createElement('iframe'); f.className = 'dframe'; f.title = 'Space'; f.setAttribute('allow', 'clipboard-read; clipboard-write; display-capture; fullscreen'); f.src = 'board.html?student=1'; b.appendChild(f); return; }
    if (!thx.R.getElementById('thSpCss')) { const st = document.createElement('style'); st.id = 'thSpCss'; st.textContent = `
      .tsoon{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px 26px;text-align:center}
      .tsoon svg{width:min(250px,70vw);height:auto;overflow:visible;flex:none}
      .tsoon .gl{fill:url(#tsGlow)}.tsoon .g1{fill:none;stroke:#d97706;stroke-width:3.2;stroke-linejoin:round}.tsoon .g1r{fill:none;stroke:#d97706;stroke-width:3}.tsoon .g1c{fill:#d97706}
      .tsoon .g2{fill:none;stroke:var(--ink2);stroke-width:2.2;stroke-linejoin:round}.tsoon .orb{fill:none;stroke:#fbbf24;stroke-width:1.4;stroke-dasharray:1 6;stroke-linecap:round;opacity:.4}
      .tsoon .sp1{fill:var(--ink2)}.tsoon .sp2{fill:#fbbf24}.tsoon .dt{fill:#fbbf24;opacity:.7}
      #W:not(.light) .tsoon .g1,#W:not(.light) .tsoon .g1r{stroke:#fbbf24;filter:drop-shadow(0 0 6px rgba(251,191,36,.7))}#W:not(.light) .tsoon .g1c{fill:#fbbf24}
      .tsoon .td{max-width:340px;font:600 .98rem/1.7 Cairo,Inter,sans-serif;color:var(--ink)}
      .tsoon .ts{max-width:340px;padding:8px 16px;border-radius:16px;font:700 .82rem/1.6 Cairo,Inter,sans-serif;color:#b45309;background:rgba(245,158,11,.12);border:1px solid rgba(180,83,9,.3)}
      #W:not(.light) .tsoon .ts{color:#fbbf24;background:rgba(251,191,36,.08);border-color:rgba(251,191,36,.3)}`; thx.R.appendChild(st); }
    const T = SPT[thx.L === 'ar' ? 'ar' : 'en'];
    b.innerHTML = '<div class="tsoon" dir="' + (thx.L === 'ar' ? 'rtl' : 'ltr') + '"><svg viewBox="0 0 240 190" aria-hidden="true"><defs><radialGradient id="tsGlow"><stop offset="0" stop-color="#fbbf24" stop-opacity=".38"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient></defs>'
      + '<circle class="gl" cx="100" cy="108" r="92"/><circle class="orb" cx="100" cy="108" r="76"/>'
      + '<path class="g1" d="' + gearD(100, 108, 50, 41, 12) + '"/><circle class="g1r" cx="100" cy="108" r="20"/><circle class="g1c" cx="100" cy="108" r="6.5"/>'
      + '<path class="g2" d="' + gearD(168, 58, 28, 23, 10) + '"/><circle class="g2" cx="168" cy="58" r="8"/>'
      + '<path class="sp1" d="' + spark(34, 70, 7) + '"/><path class="sp2" d="' + spark(216, 128, 10) + '"/>'
      + '<circle class="dt" cx="58" cy="34" r="1.6"/><circle class="dt" cx="196" cy="22" r="1.4"/><circle class="dt" cx="22" cy="140" r="1.4"/><circle class="dt" cx="150" cy="172" r="1.6"/></svg>'
      + '<p class="td"></p><p class="ts"></p></div>';
    b.querySelector('.td').textContent = T.d; b.querySelector('.ts').textContent = T.s;
  }

    /* ---- اللي index.html والملفات التانية بتستخدمه من الزرار ده ---- */
    return {
      id: 'space', render: function (b) { if (SPACE_SOON) thx.ucPage(b, null); else renderSpace(b); },
      get SPACE_SOON() { return SPACE_SOON; }
    };
  };
})();
