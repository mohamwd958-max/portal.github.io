/* ==========================================================
   Voice-lit words (paste at the END of dashboard.js)
   Any word / phrase on the dashboard that has a recording in Supabase words_table
   lights up in ONE fixed colour (same in dark and light theme) and plays on tap.
   - scans: Tasks, Dandana, Notes, TEFL, QOL (#lists), the full-text modal (#mB),
     and the Dandana / Notifications cards inside the feed
   - matching = same as the Assistant: wpClean(text) == words_table.word_key
     (longest phrase wins, up to 6 words)
   - words uploaded today or yesterday (Cairo days) get a tiny "press" hint,
     once per page load, when they first scroll into view
   - nothing to maintain: new uploads show up on the next refresh / re-render
     (and the page re-checks by itself every 2 minutes)
   Needs the column words_table.word_key (already used by the Assistant).
   created_at is optional: without it the lighting works, only the hint is skipped.
   ========================================================== */
(function () {
  'use strict';
  var C_QOL = '224,38,138', C_OTH = '31,182,255';   // QOL = pink, every other place = phosphor blue (R,G,B). Fixed in dark and light theme.
  var MAXN = 6, BATCH = 40, PAR = 4, MAXKEYS = 800, TTL_HIT = 600000, TTL_MISS = 120000, HINT_DAYS = 1;
  var ROOTS = '#lists, #mB, #pop .pc[data-cid="dnd"], #pop .pc[data-cid="notes"]';
  var SKIP = 'script,style,textarea,input,select,option,code,pre,.cpb,.hnd,.itc,.vx,.rt-link,.aww,.dt,.sm,.tkt,.its,.cd,.cdn,.hi,.nth,.logb,summary,h3,h4,.awn,.billb,.billl';
  var HAS = /\[\[[^\[\]\n]+?\]\]|\*\*[\s\S]+?\*\*|__[\s\S]+?__|\+\+[\s\S]+?\+\+|\{\{(?:gold|green|red|blue|purple|orange|gray):[\s\S]+?\}\}/;   // left for the rich-text converter
  var TOKEN = /[\p{L}\p{M}\p{N}]+(?:['\u2019\-][\p{L}\p{M}\p{N}]+)*/gu;
  var GAP = /^[ \t\u00a0]+$/;

  var cache = {}; try { cache = JSON.parse(sessionStorage.getItem('thabitVoiceLit') || '{}') || {}; } catch (e) { cache = {}; }
  var hasCreated = true, disabled = false, running = false, again = false, hinted = new Set(), io = null, mo = null, timer = null;

  (function () { var s = document.createElement('style'); s.id = 'vxCss'; s.textContent = [
    '.vx{font-weight:600;cursor:pointer;background:none;-webkit-tap-highlight-color:transparent}',
    '.vx.vq{color:rgb(' + C_QOL + ')!important;text-shadow:0 0 8px rgba(' + C_QOL + ',.6)}',
    '.vx.vo{color:rgb(' + C_OTH + ')!important;text-shadow:0 0 8px rgba(' + C_OTH + ',.65)}',
    '.vx.vq.vx-tap{animation:vxTapQ 1.2s ease-out 1}',
    '.vx.vo.vx-tap{animation:vxTapO 1.2s ease-out 1}',
    '@keyframes vxTapQ{0%,100%{text-shadow:0 0 8px rgba(' + C_QOL + ',.6)}22%{text-shadow:0 0 4px rgba(' + C_QOL + ',1),0 0 16px rgba(' + C_QOL + ',1)}}',
    '@keyframes vxTapO{0%,100%{text-shadow:0 0 8px rgba(' + C_OTH + ',.65)}22%{text-shadow:0 0 4px rgba(' + C_OTH + ',1),0 0 16px rgba(' + C_OTH + ',1)}}',
    '@media(prefers-reduced-motion:reduce){.vx.vx-tap{animation:none}}'].join(''); document.head.appendChild(s); })();

  function keyOf(s) { var k = wpClean(s); return k.length >= 2 && !/^\d+$/.test(k) ? k : ''; }
  function fresh(k) { var c = cache[k]; return !!c && Date.now() - c.t < (c.f ? TTL_HIT : TTL_MISS); }
  function save() { try { sessionStorage.setItem('thabitVoiceLit', JSON.stringify(cache)); } catch (e) {} }
  function isNew(ms) {
    if (!ms) return false;
    var d = (Date.parse(itToday()) - Date.parse(cairoDay(new Date(ms).toISOString()))) / 864e5;
    return d >= 0 && d <= HINT_DAYS;
  }

  /* ---------- Supabase lookup: 40 keys per request ---------- */
  function q(keys, withC) {
    var list = keys.map(function (k) { return '"' + k + '"'; }).join(',');
    return fetch(SB + '/rest/v1/words_table?select=' + (withC ? 'word_key,created_at' : 'word_key') + '&audio_url=not.is.null&word_key=in.(' + encodeURIComponent(list) + ')',
      { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  }
  async function one(b) {
    try {
      var r = await q(b, hasCreated);
      if (!r.ok && r.status === 400 && hasCreated) { hasCreated = false; r = await q(b, false); }   // no created_at column: lighting still works
      if (!r.ok) { if (r.status === 400) { disabled = true; console.warn('[voice-lit] words_table.word_key is missing, feature is off'); } return; }
      var rows = await r.json(), now = Date.now(), found = {};
      (Array.isArray(rows) ? rows : []).forEach(function (x) {
        var c = x.created_at ? Date.parse(x.created_at) || 0 : 0;
        if (!found[x.word_key] || (c && c < found[x.word_key].c)) found[x.word_key] = { f: 1, c: c, t: now };
      });
      b.forEach(function (k) { cache[k] = found[k] || { f: 0, c: 0, t: now }; });
    } catch (e) { console.warn('[voice-lit] lookup failed', e); }   // not cached, so it is retried next time
  }
  async function lookup(keys) {
    var bs = []; for (var i = 0; i < keys.length; i += BATCH) bs.push(keys.slice(i, i + BATCH));
    for (var j = 0; j < bs.length; j += PAR) await Promise.all(bs.slice(j, j + PAR).map(one));
  }

  /* ---------- text nodes -> words ---------- */
  function collect() {
    var out = [];
    document.querySelectorAll(ROOTS).forEach(function (root) {
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
        var v = n.nodeValue, p = n.parentElement;
        if (v.length < 2 || !p || !/\p{L}/u.test(v) || HAS.test(v) || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      } });
      while (w.nextNode()) out.push(w.currentNode);
    });
    return out;
  }
  function toks(v) { var a = [], m; TOKEN.lastIndex = 0; while ((m = TOKEN.exec(v))) a.push({ s: m.index, e: m.index + m[0].length }); return a; }
  function gapsOk(v, t, i, n) { for (var j = i + 1; j < i + n; j++) if (!GAP.test(v.slice(t[j - 1].e, t[j].s))) return false; return true; }

  /* QOL = the QOL card in the dashboard, or the full-text modal opened from it (its title says QOL) */
  function isQol(n) {
    var p = n.parentElement; if (!p) return false;
    if (p.closest('#mB')) { var t = document.getElementById('mT'); return !!t && /\bQOL\b/i.test(t.textContent); }
    var c = p.closest('.dcard'), h = c && c.querySelector('h4');
    return !!h && /^QOL$/i.test(h.textContent.trim());
  }
  function apply(nodes) {
    nodes.forEach(function (x) {
      x.q = isQol(x.n);
      if (!x.n.isConnected || x.n.nodeValue !== x.v) return;
      var v = x.v, t = x.t, frag = document.createDocumentFragment(), pos = 0, hit = false, i = 0;
      while (i < t.length) {
        var got = 0;
        for (var n = Math.min(MAXN, t.length - i); n >= 1; n--) {
          if (!gapsOk(v, t, i, n)) continue;
          var s = v.slice(t[i].s, t[i + n - 1].e), k = keyOf(s), c = k && cache[k];
          if (c && c.f) {
            if (t[i].s > pos) frag.appendChild(document.createTextNode(v.slice(pos, t[i].s)));
            var sp = document.createElement('span');
            sp.className = 'vx ' + (x.q ? 'vq' : 'vo') + (isNew(c.c) ? ' vxn' : '');
            sp.setAttribute('data-word', s); sp.setAttribute('data-k', k); sp.setAttribute('role', 'button'); sp.setAttribute('tabindex', '0');
            sp.textContent = s; frag.appendChild(sp);
            pos = t[i + n - 1].e; hit = true; got = n; break;
          }
        }
        i += got || 1;
      }
      if (hit) { if (pos < v.length) frag.appendChild(document.createTextNode(v.slice(pos))); x.n.replaceWith(frag); }
    });
  }

  /* ---------- the tiny "press" hint: once per page load, when the word first scrolls into view ---------- */
  function watchHints() {
    document.querySelectorAll('.vx.vxn:not([data-vo])').forEach(function (el) {
      el.setAttribute('data-vo', '1');
      if (hinted.has(el.getAttribute('data-k'))) return;
      if (!('IntersectionObserver' in window)) { tap(el, 0); return; }
      io = io || new IntersectionObserver(function (ents) {
        var n = 0;
        ents.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); tap(en.target, n++); } });
      }, { threshold: 0.6 });
      io.observe(el);
    });
  }
  function tap(el, idx) {
    var k = el.getAttribute('data-k'); if (hinted.has(k)) return; hinted.add(k);
    setTimeout(function () { el.classList.add('vx-tap'); setTimeout(function () { el.classList.remove('vx-tap'); }, 1400); }, idx * 160);
  }

  /* ---------- run ---------- */
  async function run() {
    if (disabled) return;
    if (running) { again = true; return; }
    running = true;
    try {
      var nodes = collect().map(function (n) { var v = n.nodeValue; return { n: n, v: v, t: toks(v) }; }).filter(function (x) { return x.t.length; });
      var need = {}, cnt = 0;
      nodes.forEach(function (x) {
        for (var i = 0; i < x.t.length; i++) for (var n = 1; n <= MAXN && i + n <= x.t.length; n++) {
          if (!gapsOk(x.v, x.t, i, n)) break;
          var k = keyOf(x.v.slice(x.t[i].s, x.t[i + n - 1].e));
          if (k && !fresh(k) && !need[k] && cnt < MAXKEYS) { need[k] = 1; cnt++; }
        }
      });
      var ks = Object.keys(need);
      if (ks.length) { await lookup(ks); save(); }
      if (disabled) return;
      if (mo) mo.disconnect();                       // our own edits must not trigger us again
      try { apply(nodes); watchHints(); } finally { if (mo) watch(); }
    } catch (e) { console.error('[voice-lit]', e); }
    finally { running = false; if (again) { again = false; schedule(300); } }
  }
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(run, ms == null ? 400 : ms); }   // a bit after the rich-text converter, so [[..]] / ** markers are never split
  function watch() { mo.observe(document.body, { childList: true, subtree: true, characterData: true }); }

  /* tap = play the recording (same player as the Words list) */
  document.addEventListener('click', function (e) {
    var s = e.target && e.target.closest && e.target.closest('.vx'); if (!s) return;
    e.preventDefault(); e.stopPropagation(); wpOpen(s.getAttribute('data-word'));
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var s = e.target && e.target.closest && e.target.closest('.vx'); if (s) { e.preventDefault(); wpOpen(s.getAttribute('data-word')); }
  });

  function start() {
    mo = new MutationObserver(function () { schedule(); });
    watch(); schedule(600);
    setInterval(function () { if (!document.hidden) schedule(0); }, 120000);     // picks up new uploads while the page stays open
    document.addEventListener('visibilitychange', function () { if (!document.hidden) schedule(200); });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
