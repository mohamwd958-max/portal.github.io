/* Thabit PWA: registers the service worker and shows a small "install the app" banner.
 * Android/Chrome: one-tap install button. iPhone/Safari: short how-to (Safari has no install prompt).
 * Nothing is shown when the app is already running installed.
 */
(function () {
  'use strict';

  // 1) Service worker (path is relative so it also works under a GitHub Pages sub-folder)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function () {});
    });
  }

  var SHOW_BANNER = !!(document.currentScript && document.currentScript.hasAttribute('data-banner'));

  // 2) Install banner
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone || !SHOW_BANNER) return;

  var DISMISS_KEY = 'thabitInstallDismissedAt';
  var DISMISS_DAYS = 7;
  try {
    var t = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
    if (t && Date.now() - t < DISMISS_DAYS * 86400000) return;
  } catch (e) {}

  var TEXT = {
    en: { install: 'Install app', later: 'Not now', msg: 'Install Thabit on your phone for one-tap access.',
          ios: 'To install: tap the Share button, then "Add to Home Screen".' },
    ar: { install: 'تثبيت التطبيق', later: 'لاحقاً', msg: 'ثبّت تطبيق ثابت على هاتفك للدخول بضغطة واحدة.',
          ios: 'للتثبيت: اضغط زر المشاركة ثم "إضافة إلى الشاشة الرئيسية".' },
    eg: { install: 'نزّل التطبيق', later: 'مش دلوقتي', msg: 'نزّل تطبيق ثابت على تليفونك وادخل بضغطة واحدة.',
          ios: 'عشان تنزّله: دوس على زرار المشاركة وبعدين "Add to Home Screen".' }
  };

  function currentLang() {
    var l = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    if (l.indexOf('eg') === 0 || l === 'ar-eg') return 'eg';
    if (l.indexOf('ar') === 0) return 'ar';
    return 'en';
  }

  var deferred = null;
  var bar = null;

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
    if (bar) { bar.remove(); bar = null; }
  }

  function show(mode) {
    if (bar) return;
    var lang = currentLang();
    var tx = TEXT[lang];
    var rtl = lang !== 'en';

    bar = document.createElement('div');
    bar.setAttribute('role', 'dialog');
    bar.dir = rtl ? 'rtl' : 'ltr';
    bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;display:flex;align-items:center;gap:10px;' +
      'padding:12px 14px;border-radius:16px;background:#111;color:#fff;box-shadow:0 8px 30px rgba(0,0,0,.35);' +
      'font:14px/1.4 Cairo,system-ui,sans-serif;max-width:480px;margin:0 auto';

    var img = document.createElement('img');
    img.src = 'icons/icon-192.png';
    img.alt = '';
    img.style.cssText = 'width:40px;height:40px;border-radius:10px;background:#fff;flex:none';

    var p = document.createElement('div');
    p.style.cssText = 'flex:1;min-width:0';
    p.textContent = mode === 'ios' ? tx.ios : tx.msg;

    bar.appendChild(img);
    bar.appendChild(p);

    if (mode === 'prompt') {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = tx.install;
      b.style.cssText = 'border:0;border-radius:10px;padding:9px 14px;background:#fff;color:#000;font:inherit;font-weight:700;cursor:pointer;flex:none';
      b.addEventListener('click', function () {
        if (!deferred) return;
        deferred.prompt();
        deferred.userChoice.finally(function () { deferred = null; if (bar) { bar.remove(); bar = null; } });
      });
      bar.appendChild(b);
    }

    var x = document.createElement('button');
    x.type = 'button';
    x.textContent = tx.later;
    x.style.cssText = 'border:0;background:transparent;color:#bbb;font:inherit;cursor:pointer;flex:none;padding:6px';
    x.addEventListener('click', dismiss);
    bar.appendChild(x);

    document.body.appendChild(bar);
  }

  // Android / desktop Chrome
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    show('prompt');
  });

  window.addEventListener('appinstalled', function () {
    if (bar) { bar.remove(); bar = null; }
  });

  // iPhone / iPad Safari
  var ua = navigator.userAgent || '';
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
  if (isIOS && isSafari) {
    window.addEventListener('load', function () { setTimeout(function () { show('ios'); }, 2500); });
  }

  // 3) Exit guard (installed app only): the first back swipe asks, the second one (within 3 s) leaves the app
  (function () {
    var standaloneNow = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (!standaloneNow || window.top !== window) return;

    var MSG = {
      en: 'Are you sure you want to get out? Swipe back again to exit.',
      ar: 'هل أنت متأكد أنك تريد الخروج؟ اسحب مرة أخرى للخروج.',
      eg: 'متأكد إنك عايز تخرج؟ اسحب مرة كمان عشان تخرج.'
    };
    var armed = false, timer = null, toast = null;

    function lang() {
      var l = 'en';
      try { l = localStorage.getItem('thabit_lang') || 'en'; } catch (e) {}
      return MSG[l] ? l : 'en';
    }
    function hide() {
      armed = false;
      clearTimeout(timer);
      if (toast) { toast.remove(); toast = null; }
    }
    function show() {
      hide();
      toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.dir = lang() === 'en' ? 'ltr' : 'rtl';
      toast.textContent = MSG[lang()];
      toast.style.cssText = 'position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 90px);transform:translateX(-50%);' +
        'z-index:2147483000;max-width:calc(100vw - 32px);padding:11px 18px;border-radius:14px;background:#111;color:#fff;' +
        'font:600 14px/1.5 Cairo,system-ui,sans-serif;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.45);' +
        'border:1px solid rgba(255,255,255,.25)';
      document.body.appendChild(toast);
      armed = true;
      timer = setTimeout(hide, 3000);
    }
    function arm() { try { history.pushState({ thabitGuard: 1 }, '', location.href); } catch (e) {} }

    function init() {
      arm();
      window.addEventListener('popstate', function () {
        if (document.querySelector('.mt')) return;   // maintenance screen has its own back handling
        if (armed) { hide(); history.back(); return; }   // second swipe: really leave
        arm();                                           // first swipe: stay and ask
        show();
      });
    }
    if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
  })();
})();
