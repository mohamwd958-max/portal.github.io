/* Tags every ROUND button (any border-radius >= 6px) with .nm-btn so neumorphic.css can raise it.
   Square buttons (sharp corners) are skipped. List items / checks / the Feed star are skipped too. */
(function () {
  var SKIP = '.cpb,.cap,.itc,.mbb,.fl button,.feed,.more,.tk,.hit,[data-nonm]';
  function round(el) {
    var r = getComputedStyle(el).borderTopLeftRadius || '0';
    return r.indexOf('%') > -1 ? parseFloat(r) > 0 : parseFloat(r) >= 6;
  }
  function tag(root) {
    (root || document).querySelectorAll('button,[role="button"],a.circle-badge-btn').forEach(function (el) {
      if (el.matches(SKIP)) return;
      el.classList.toggle('nm-btn', round(el));
    });
  }
  var t = null;
  function later() { clearTimeout(t); t = setTimeout(function () { tag(); }, 80); }
  function start() { tag(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('load', later);
})();
