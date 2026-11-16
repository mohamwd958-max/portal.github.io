/* Thabit navigation guard — include FIRST in <head> of every page:
     <script src="js/nav.js"></script>                      (normal pages)
     <script src="js/nav.js" data-page="landing"></script>  (landing.html)
     <script src="js/nav.js" data-page="login"></script>    (index.html)
   Rules
   - Landing opens only on the first open of the app, or after logout.
   - Guest: landing -> pages (normal history), Back goes one step at a time until the landing; Back from the landing leaves the app.
     Closing the app and opening it again -> landing again (guest flag lives in sessionStorage, which dies with the app).
   - Logged in: the login uses location.replace, so the landing is not in history and Back leaves the app.
   - A guest is always told that nothing is saved. */
(function () {
  'use strict';
  var me = document.currentScript, page = (me && me.getAttribute('data-page')) || 'app';
  var LANDING = 'landing.html', HOME = 'home.html';
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { } return null; }
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function loggedIn() {
    if (ls('thabit_trainee_token')) return true;
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/staff/i.test(k) && /(session|token)/i.test(k) && localStorage.getItem(k)) return true; } } catch (e) { }
    try { for (var j = 0; j < sessionStorage.length; j++) { var k2 = sessionStorage.key(j); if (/staff/i.test(k2) && /(session|token)/i.test(k2)) return true; } } catch (e) { }
    return false;
  }
  var T = {
    en: 'You are browsing as a guest. Your information is not saved — once you leave the app you may need to enter again.',
    ar: 'أنت تتصفح كضيف. معلوماتك لن تُحفظ، وبمجرد خروجك من التطبيق قد تحتاج للدخول مرة أخرى.',
    eg: 'إنت داخل كضيف. معلوماتك مش هتتحفظ، ومجرد ما تطلع من التطبيق ممكن تحتاج تدخل تاني.'
  };
  function lang() { var l = ''; try { l = (window.currentLang || ls('thLang') || ls('lang') || document.documentElement.lang || 'en'); } catch (e) { } l = String(l).toLowerCase().slice(0, 2); return T[l] ? l : 'en'; }

  window.thGuestMode = function () { ss('thGuestSession', '1'); };
  window.thGuestNotice = function () { return T[lang()]; };
  window.thLogout = function () {
    ['thabit_trainee_token', 'currentTrainee', 'thLastPage'].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) { } });
    try { for (var i = localStorage.length - 1; i >= 0; i--) { var k = localStorage.key(i); if (/staff/i.test(k)) localStorage.removeItem(k); } } catch (e) { }
    try { for (var j = sessionStorage.length - 1; j >= 0; j--) { var k2 = sessionStorage.key(j); if (/staff/i.test(k2)) sessionStorage.removeItem(k2); } } catch (e) { }
    ss('thGuestSession', null); ss('thLanded', null);
    location.replace(LANDING);
  };

  function guard() {
    var li = loggedIn(), guest = ss('thGuestSession') === '1';
    if (page === 'landing') {
      if (li) { location.replace(ls('thLastPage') || HOME); return; }
      ss('thGuestSession', null); ss('thLanded', '1'); return;
    }
    if (li) { ss('thGuestSession', null); return; }
    if (page === 'login') { if (!ss('thLanded') && !guest) location.replace(LANDING); return; }   /* the portal/login page itself */
    if (!guest) { location.replace(LANDING); return; }                                           /* first open / after logout */
    notice(); track();
  }
  /* statistics: tell the server which page (and section) the guest opened */
  var lastTracked = '';
  function track() {
    try {
      var g = JSON.parse(ls('thGuest') || '{}'); if (!g.id || typeof REPORT_SUPABASE_URL === 'undefined' || typeof sbHeaders === 'undefined') return;
      var pg = (location.pathname.split('/').pop() || 'index.html') + (location.hash || '');
      if (pg === lastTracked) return; lastTracked = pg;
      fetch(REPORT_SUPABASE_URL + '/rest/v1/rpc/guest_track', { method: 'POST', headers: sbHeaders(), body: JSON.stringify({ p_guest_id: g.id, p_page: pg }), keepalive: true }).catch(function () { });
    } catch (e) { }
  }
  window.addEventListener('hashchange', function () { if (ss('thGuestSession') === '1' && !loggedIn()) track(); });
  /* portal.js loads after this file, so send once the page is ready */
  window.addEventListener('load', function () { lastTracked = ''; if (ss('thGuestSession') === '1' && !loggedIn()) track(); });
  function notice() {
    function show() {
      if (document.getElementById('thGuestNote')) return;
      var d = document.createElement('div'); d.id = 'thGuestNote'; d.setAttribute('role', 'status');
      d.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(72px + env(safe-area-inset-bottom,0px));width:min(92vw,380px);box-sizing:border-box;z-index:2147483000;padding:12px 38px 12px 14px;border-radius:14px;background:rgba(15,23,42,.92);color:#f1f5f9;font:600 12.5px/1.55 Inter,Cairo,sans-serif;text-align:center;box-shadow:0 8px 28px rgba(0,0,0,.3)';
      d.textContent = T[lang()];
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Close');
      x.style.cssText = 'position:absolute;top:6px;right:8px;background:none;border:0;color:inherit;font-size:20px;line-height:1;cursor:pointer';
      x.onclick = function () { d.remove(); }; d.appendChild(x); document.body.appendChild(d);
      setTimeout(function () { if (d.parentNode) d.remove(); }, 9000);
    }
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  }
  guard();
  /* coming back with the Back button (page restored from memory): run the rules again, so a logged-out user never sees a stale page */
  window.addEventListener('pageshow', function (e) { if (e.persisted) guard(); });
})();
