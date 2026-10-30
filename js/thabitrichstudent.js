/* ==========================================================
   Student side of the Hyperlinked words (loads AFTER richtext.js, BEFORE dashboard.js).
   - Finds every  <span class="rt-link" data-word="...">  on the page (also ones added later)
   - Gives each a gentle pulse the first time it scrolls into view
   - Tap = plays the recording from Supabase words_table, matched EXACTLY like the Assistant does
     (cleanWordString on both sides; "a, b" plays the parts one after another)
   - Every 3rd play of the same word -> small popup "let's practice it" with an Assistant button
   Call once:  ThabitRichStudent.init({ supabaseUrl, anonKey, getLang, onAssistant })
   ========================================================== */
(function (g) {
  'use strict';
  var cfg = { supabaseUrl: '', anonKey: '', table: 'words_table', every: 3, gap: 350, getLang: function () { return 'en'; }, onAssistant: null };
  var MSG = {
    en: { ready: 'You listened to “{w}” {n} times. Shall we practice it?', go: 'Assistant', later: 'Later', missing: 'No recording for this word yet', fail: 'Could not load the recording' },
    ar: { ready: 'استمعت إلى «{w}» {n} مرات. هل نتدرب عليها؟', go: 'المساعد', later: 'لاحقاً', missing: 'لا يوجد تسجيل لهذه الكلمة بعد', fail: 'تعذر تحميل التسجيل' },
    eg: { ready: 'سمعت «{w}» {n} مرات. تيجي نتدرب عليها؟', go: 'المساعد', later: 'بعدين', missing: 'الكلمة دي لسه مفيهاش صوت', fail: 'مقدرتش أحمّل الصوت' }
  };
  function M(k) { var l = 'en'; try { l = cfg.getLang(); } catch (e) {} return (MSG[l] || MSG.en)[k]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* identical to the Assistant's cleanWordString and to the SQL column words_table.word_key */
  function clean(str) { return !str ? '' : String(str).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"\u201C\u201D\u2018\u2019]/g, '').replace(/\s+/g, ' ').trim(); }
  function splitParts(s) { return String(s || '').split(/[,\u060C\n]+/).map(function (x) { return x.trim(); }).filter(Boolean); }

  var counts = {}, audio = null, token = 0, current = null, io = null, mo = null, bound = false;
  try { counts = JSON.parse(sessionStorage.getItem('thabitRichPlays') || '{}') || {}; } catch (e) { counts = {}; }
  function saveCounts() { try { sessionStorage.setItem('thabitRichPlays', JSON.stringify(counts)); } catch (e) {} }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* one small indexed query per word (the table can hold tens of thousands of rows); word_key column, ILIKE fallback */
  var urlCache = {}, wordKeyOK = true;
  function lookup(word) {
    var c = clean(word); if (!c) return Promise.resolve(null);
    var hit = urlCache[c]; if (hit && Date.now() - hit.t < 60000) return Promise.resolve(hit.u);
    var H = { apikey: cfg.anonKey, Authorization: 'Bearer ' + cfg.anonKey };
    var base = cfg.supabaseUrl + '/rest/v1/' + cfg.table + '?select=audio_url&audio_url=not.is.null&limit=1';
    var first = wordKeyOK
      ? fetch(base + '&word_key=eq.' + encodeURIComponent(c), { headers: H }).then(function (r) { if (!r.ok) { wordKeyOK = false; return null; } return r.json(); })
      : Promise.resolve(null);
    return first.then(function (rows) {
      if (rows !== null) return rows;
      return fetch(base + '&word=ilike.' + encodeURIComponent(String(word).trim().replace(/[\\%_]/g, function (m) { return '\\' + m; })), { headers: H })
        .then(function (r) { if (!r.ok) throw new Error('lookup'); return r.json(); });
    }).then(function (rows) {
      var u = Array.isArray(rows) && rows[0] ? rows[0].audio_url : null;
      urlCache[c] = { u: u, t: Date.now() }; return u;
    });
  }
  function resolveUrls(text) {                         // whole text first; "a, b" -> each part, only if every part exists
    return lookup(text).then(function (u) {
      if (u) return [u];
      var parts = splitParts(text); if (parts.length < 2) return null;
      return Promise.all(parts.map(lookup)).then(function (us) { return us.every(Boolean) ? us : null; });
    });
  }

  function toast(m) {
    var t = document.createElement('div'); t.className = 'rt-toast'; t.textContent = m; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }
  function popup(word, n) {
    var old = document.querySelector('.rt-pop'); if (old) old.remove();
    var el = document.createElement('div'); el.className = 'rt-pop'; el.setAttribute('dir', 'auto');
    el.innerHTML = '<p>' + esc(M('ready').replace('{w}', word).replace('{n}', n)) + '</p><div class="rt-pop-b">' +
      '<button type="button" class="go"><i class="fa-solid fa-microphone-lines"></i> ' + esc(M('go')) + '</button>' +
      '<button type="button">' + esc(M('later')) + '</button></div>';
    var bs = el.querySelectorAll('button');
    bs[0].onclick = function () { el.remove(); if (cfg.onAssistant) cfg.onAssistant(word); };
    bs[1].onclick = function () { el.remove(); };
    document.body.appendChild(el);
    setTimeout(function () { if (el.isConnected) el.remove(); }, 14000);
  }

  function stop() {
    token++;
    if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
    if (current) { current.classList.remove('rt-playing'); current = null; }
  }
  function playUrl(url, my) {
    return new Promise(function (res) {
      if (my !== token) return res();
      var a = new Audio(url); audio = a;
      a.onended = res; a.onerror = res;
      a.play().catch(res);
    });
  }
  function play(span) {
    var word = (span.getAttribute('data-word') || '').trim(); if (!word) return;
    stop();
    var my = token; current = span;
    span.classList.remove('rt-pulse'); span.classList.add('rt-playing');
    resolveUrls(word).then(function (urls) {
      if (my !== token) return;
      if (!urls) { stop(); toast(M('missing')); return; }
      var k = clean(word); counts[k] = (counts[k] || 0) + 1; saveCounts();
      var n = counts[k];
      return urls.reduce(function (p, u, i) {
        return p.then(function () { return my === token ? playUrl(u, my) : null; })
                .then(function () { return (i < urls.length - 1 && my === token) ? sleep(cfg.gap) : null; });
      }, Promise.resolve()).then(function () {
        if (my !== token) return;                       // interrupted by another tap
        span.classList.remove('rt-playing'); current = null;
        if (n % cfg.every === 0) popup(word, n);
      });
    }).catch(function () { if (my === token) { stop(); toast(M('fail')); } });
  }

  function watch(root) {      // one gentle pulse the first time a word is on screen
    var els = (root || document).querySelectorAll('.rt-link[data-word]:not([data-rtw])');
    if (!els.length) return;
    Array.prototype.forEach.call(els, function (x) {
      x.setAttribute('data-rtw', '1');
      if (!('IntersectionObserver' in g)) { x.classList.add('rt-pulse'); return; }
      io = io || new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('rt-pulse'); io.unobserve(en.target); } });
      }, { threshold: 0.6 });
      io.observe(x);
    });
  }
  function bind() {
    if (bound) return; bound = true;
    document.addEventListener('click', function (e) {
      var s = e.target.closest && e.target.closest('.rt-link[data-word]');
      if (s) { e.preventDefault(); e.stopPropagation(); play(s); }
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var s = e.target.closest && e.target.closest('.rt-link[data-word]');
      if (s) { e.preventDefault(); play(s); }
    });
    var t = null;
    mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { watch(document); }, 120); });
    mo.observe(document.body, { childList: true, subtree: true });
    watch(document);
  }

  g.ThabitRichStudent = {
    init: function (o) { for (var k in o) cfg[k] = o[k]; if (document.body) bind(); else document.addEventListener('DOMContentLoaded', bind); },
    play: play, stop: stop, resolve: resolveUrls
  };
})(window);
