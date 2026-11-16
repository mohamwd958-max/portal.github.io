/* Thabit loading screen (the "skeleton" between pages).
   Put <script src="js/thabit-loader.js"></script> as the FIRST script in <head> of every page.
   Theme colour comes from localStorage 'thThemeChoice' (dark unless it says 'light').
   API: thLoader.show() -> fades in, returns a promise;  thLoader.hide();  thLoader.ready -> resolves when it is gone. */
(function () {
  if (window.thLoader) return;
  var dark = true; try { dark = localStorage.getItem('thThemeChoice') !== 'light'; } catch (e) { }
  var st = document.createElement('style');
  st.textContent = '#thld{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:' + (dark ? '#121419' : '#ebe7dd') + ';opacity:1;transition:opacity .5s ease}' +
    '#thld.off{opacity:0;pointer-events:none}' +
    '#thld i{display:block;width:min(120px,28vw);aspect-ratio:1;--b:' + (dark ? '#2c2f38' : '#c4bfb1') + ';--h:' + (dark ? '#f2eee5' : '#ffffff') + ';' +
    'background:linear-gradient(105deg,var(--b) 0,var(--b) 40%,var(--h) 50%,var(--b) 60%,var(--b) 100%) 150% 0/250% 100%;' +
    '-webkit-mask:url(assets/thabit-logo.png) center/contain no-repeat;mask:url(assets/thabit-logo.png) center/contain no-repeat;animation:thsw 3.6s ease-in-out infinite}' +
    '@keyframes thsw{0%{background-position:150% 0}55%,100%{background-position:-50% 0}}';
  var el = document.createElement('div'); el.id = 'thld'; el.innerHTML = '<i></i>';
  document.documentElement.appendChild(st); document.documentElement.appendChild(el);
  var at = Date.now(), hiding = false, done; var ready = new Promise(function (r) { done = r; });
  function hide() {
    if (hiding) return; hiding = true;
    setTimeout(function () { el.classList.add('off'); setTimeout(function () { el.style.display = 'none'; done(); }, 520); }, Math.max(0, 900 - (Date.now() - at)));
  }
  function show() {
    hiding = false; el.style.display = 'flex'; void el.offsetWidth; el.classList.remove('off');
    return new Promise(function (r) { setTimeout(r, 380); });
  }
  window.thLoader = { show: show, hide: hide, ready: ready };
  if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
  window.addEventListener('pageshow', function (e) { if (e.persisted) { hiding = true; el.classList.add('off'); el.style.display = 'none'; } });
  setTimeout(hide, 12000);   /* safety */
})();