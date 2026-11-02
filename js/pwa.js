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

  // 2) Install banner
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) return;

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
})();
