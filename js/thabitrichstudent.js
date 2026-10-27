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

  /* identical to the Assistant's cleanWordString */
  function clean(str) { return !str ? '' : String(str).trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”]/g, ''); }
  function splitParts(s) { return String(s || '').split(/[,،\n]+/).map(function (x) { return x.trim(); }).filter(Boolean); }

  var cache = null, cacheAt = 0, counts = {}, audio = null, token = 0, current = null, io = null, mo = null, bound = false;
  try { counts = JSON.parse(sessionStorage.getItem('thabitRichPlays') || '{}') || {}; } catch (e) { counts = {}; }
  function saveCounts() { try { sessionStorage.setItem('thabitRichPlays', JSON.stringify(counts)); } catch (e) {} }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function getList() {
    if (cache && Date.now() - cacheAt < 60000) return Promise.resolve(cache);
    return fetch(cfg.supabaseUrl + '/rest/v1/' + cfg.table + '?select=word,audio_url', { headers: { apikey: cfg.anonKey, Authorization: 'Bearer ' + cfg.anonKey } })
      .then(function (r) { return r.json(); })
      .then(function (d) { cache = Array.isArray(d) ? d : []; cacheAt = Date.now(); return cache; });
  }
  function findAudio(list, part) {
    var c = clean(part), url = null;
    list.forEach(function (r) { if (r.word && r.audio_url && clean(r.word) === c) url = r.audio_url; });
    return url;
  }
  function resolve(list, text) {
    var whole = findAudio(list, text);
    if (whole) return [whole];
    var parts = splitParts(text);
    if (parts.length < 2) return null;
    var urls = parts.map(function (p) { return findAudio(list, p); });
    return urls.every(Boolean) ? urls : null;
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
    getList().then(function (list) {
      if (my !== token) return;
      var urls = resolve(list, word);
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
    play: play, stop: stop
  };
})(window);