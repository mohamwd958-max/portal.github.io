/* ==========================================================
   terminated_screen.js: full-page "credentials not valid" screen for TERMINATED trainees.
   Standalone: load it on any page (portal login + trainee dashboard):
       <script src="js/terminated_screen.js"></script>
   Use:   ThabitTerminated.show()            -> covers the whole page
          ThabitTerminated.is(statusText)    -> true if a status text means "terminated"
   Preview without a real terminated trainee: open any page that loads this file with  #preview-terminated  at the end of the URL.
   Image: assets/terminated.jpg
   ========================================================== */
(function () {
  const IMG = 'assets/terminated.jpg', PORTAL = 'index.html';
  const MSG_EN = 'These credentials are not valid for some reason.';
  const SUB_EN = 'Kindly contact your Thabit trainer for more information.';
  const MSG_AR = 'بيانات الدخول دي مش صالحة لسبب ما.';
  const SUB_AR = 'من فضلك تواصل مع مدرب ثابت بتاعك لمعرفة التفاصيل.';

  const is = s => /terminat|منته|ملغ|مفصول/i.test(String(s == null ? '' : s));

  function css() {
    if (document.getElementById('trmCss')) return;
    const s = document.createElement('style'); s.id = 'trmCss';
    s.textContent = `
#trm{position:fixed;inset:0;z-index:2147483647;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center;opacity:0;animation:trmIn 1.2s ease forwards;font-family:Cairo,Inter,system-ui,sans-serif}
#trm .bg{position:absolute;inset:-4%;background:#000 url('${IMG}') center/cover no-repeat;filter:brightness(.55) contrast(1.08);transform:scale(1.02);animation:trmZoom 28s ease-in-out infinite alternate}
#trm .vg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,0) 0%,rgba(0,0,0,.35) 45%,rgba(0,0,0,.92) 100%)}
#trm .fl{position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,rgba(255,196,60,.16),transparent 55%);mix-blend-mode:screen;animation:trmFlick 5.5s steps(1) infinite}
#trm .tx{position:relative;z-index:2;max-width:min(680px,88vw);text-align:center;color:#f4efe6;padding:0 6px;margin-top:34vh}
#trm .m1{font-size:clamp(1.15rem,3.4vw,1.75rem);font-weight:800;letter-spacing:.4px;line-height:1.5;text-shadow:0 2px 24px rgba(0,0,0,.95),0 0 2px #000;opacity:0;animation:trmUp 1.4s ease .9s forwards}
#trm .m2{margin-top:12px;font-size:clamp(.9rem,2.6vw,1.1rem);font-weight:500;color:#e9c46a;line-height:1.7;text-shadow:0 2px 18px rgba(0,0,0,.95);opacity:0;animation:trmUp 1.4s ease 2.1s forwards}
#trm .ar{margin-top:18px;font-size:clamp(.78rem,2.2vw,.95rem);color:#cbbfa9;line-height:1.8;direction:rtl;text-shadow:0 2px 14px #000;opacity:0;animation:trmUp 1.4s ease 3.3s forwards}
#trm a.bk{display:inline-block;margin-top:26px;padding:9px 22px;border:1px solid rgba(233,196,106,.55);border-radius:999px;color:#e9c46a;font-size:.8rem;font-weight:700;letter-spacing:1px;text-decoration:none;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);opacity:0;animation:trmUp 1.2s ease 4.4s forwards;transition:background .2s,color .2s}
#trm a.bk:hover{background:#e9c46a;color:#111}
@keyframes trmIn{to{opacity:1}}
@keyframes trmUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes trmZoom{from{transform:scale(1.02) translate(0,0)}to{transform:scale(1.14) translate(-1.2%,-1%)}}
@keyframes trmFlick{0%,100%{opacity:.9}7%{opacity:.35}9%{opacity:.95}41%{opacity:.8}43%{opacity:.25}46%{opacity:.9}78%{opacity:.7}}
html.trm-lock,html.trm-lock body{overflow:hidden!important}
@media(prefers-reduced-motion:reduce){#trm,#trm .bg,#trm .fl,#trm .m1,#trm .m2,#trm .ar,#trm a.bk{animation:none!important;opacity:1!important;transform:none!important}}`;
    document.head.appendChild(s);
  }

  function show(opts) {
    opts = opts || {};
    if (document.getElementById('trm')) return;
    css();
    const root = document.createElement('div');
    root.id = 'trm'; root.setAttribute('role', 'alert');
    root.innerHTML = `<div class="bg"></div><div class="vg"></div><div class="fl"></div>
      <div class="tx" dir="ltr">
        <div class="m1">${MSG_EN}</div>
        <div class="m2">${SUB_EN}</div>
        <div class="ar">${MSG_AR}<br>${SUB_AR}</div>
        ${opts.noBack ? '' : `<a class="bk" href="${opts.portal || PORTAL}">BACK TO PORTAL</a>`}
      </div>`;
    document.documentElement.classList.add('trm-lock');
    (document.body || document.documentElement).appendChild(root);
    // nothing underneath should be reachable by keyboard
    try { Array.from(document.body.children).forEach(c => { if (c !== root) { c.setAttribute('inert', ''); c.setAttribute('aria-hidden', 'true'); } }); } catch (e) {}
  }

  window.ThabitTerminated = { show, is };

  if (/preview-terminated/.test(location.hash || '')) {
    const go = () => show({ noBack: false });
    if (document.body) go(); else window.addEventListener('DOMContentLoaded', go);
  }
})();
