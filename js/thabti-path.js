/* Thabit path: compass screen + one Level & Skills window. Load AFTER js/buttons/btn-compass.js */
(function () {
  'use strict';
  var DEF = {"version":1,"levels":[{"key":"wood","name":{"ar":"المستوى الخشبي","en":"Wooden Level"},"desc":{"ar":"الأساس: الحروف والأصوات، وتركيب الكلمة من أصواتها.","en":"Foundation: letters and sounds, and building a word from them."},"milestones":[{"id":"wood1","name":"أسماء الحروف","weight":10},{"id":"wood2","name":"حروف العلة","weight":20},{"id":"wood3","name":"الأصوات الساكنة والمقاطع","weight":30},{"id":"wood4","name":"Digraphs","weight":20},{"id":"wood5","name":"أنماط حروف العلة","weight":20}]},{"key":"bronze","name":{"ar":"المستوى البرونزي","en":"Bronze Level"},"desc":{"ar":"القراءة والكتابة: تقرا نص جديد بنطق مفهوم، وتكتب اللي بتسمعه.","en":"Reading and writing: read a new text clearly and write what you hear."},"milestones":[{"id":"bronze1","name":"القراءة التوقيفية","weight":20},{"id":"bronze2","name":"الجمل القصيرة","weight":15},{"id":"bronze3","name":"القطع","weight":20},{"id":"bronze4","name":"الكتابة والتهجي","weight":20},{"id":"bronze5","name":"الإملاء","weight":20},{"id":"bronze6","name":"القاموس الشخصي","weight":5}]},{"key":"gold","name":{"ar":"المستوى الذهبي","en":"Gold Level"},"desc":{"ar":"رصف الجمل: تكوّن جملتك بنفسك وتسأل وتنفي وتحكي.","en":"Sentence building: make your own sentences, ask, deny and tell."},"milestones":[{"id":"gold1","name":"خريطة اللغة والضماير","weight":15},{"id":"gold2","name":"جملة الوصف (be)","weight":15},{"id":"gold3","name":"جملة الفعل","weight":10},{"id":"gold4","name":"أول جملة كاملة","weight":15},{"id":"gold5","name":"النفي والسؤال","weight":15},{"id":"gold6","name":"الماضي والمستقبل","weight":20},{"id":"gold7","name":"حروف الجر والربط","weight":10}]},{"key":"diamond","name":{"ar":"المستوى الألماسي","en":"Diamond Level"},"desc":{"ar":"الكلمات والمحادثة: تتكلم في مواضيع حياتك وترد في المواقف.","en":"Vocabulary and conversation: talk about your life and respond in real situations."},"milestones":[{"id":"diamond1","name":"الأفعال","weight":25},{"id":"diamond2","name":"الأسماء","weight":20},{"id":"diamond3","name":"الصفات","weight":10},{"id":"diamond4","name":"أدوات الحياة اليومية","weight":10},{"id":"diamond5","name":"المواضيع","weight":15},{"id":"diamond6","name":"المحادثة","weight":20}]},{"key":"legend","name":{"ar":"مستوى الأسطورة","en":"Legend Level"},"desc":{"ar":"أداء الصوت: النبرة والمشاعر وتقمص الشخصية.","en":"Voice acting: tone, emotions and becoming a character."},"milestones":[{"id":"legend1","name":"أدوات الصوت","weight":20},{"id":"legend2","name":"المشاعر الأساسية","weight":25},{"id":"legend3","name":"طبقات المشاعر","weight":15},{"id":"legend4","name":"التقمص","weight":25},{"id":"legend5","name":"مشهد من تأليفك","weight":15}]}],"system":[{"title":"الفكرة","body":"المستوى = موقع الطالب في المنهج (خلّص إيه)، مش تقييم قدرته. النسبة والانتقال بقرار المدرب. مفيش نقاط ولا معادلات. الالتزام (حضور ومهام) بيتسجل في الملف لوحده."},{"title":"المسارات","body":"الكامل (الأساسي). جمل عملية: الخشبي والبرونزي إجباري وينتهي في الذهبي، بإقرار من الطالب. المتخصص: اختياري بعد الأسطورة."},{"title":"تعريف المحترف","body":"يرد في أي موقف، بأكتر من أسلوب يناسب اللي قدامه، من غير ما يقف، بنطق سليم، وفاهم اللغة بتتكون إزاي."},{"title":"الأسبوع والشهر","body":"3 أيام أساسية ويومين ورشة ويومين أجازة. آخر أسبوع في الشهر 3 أيام: مراجعة، اختبار مفاجئ، تسجيل."},{"title":"المراجعة","body":"آخر الحصة، الحصة الجاية، بعد 3 أيام، أسبوع، 3 أسابيع، شهرين. المَعلَم: خلصت مبدئيًا ثم ثبتت. الطالب مبيعرفش ميعاد المراجعة."},{"title":"السماع","body":"مقطع 30–90 ثانية، مهمة واحدة معروفة قبلها، 3 مشاهدات: يتفرج، يحل، يردد."},{"title":"خطوط مستمرة","body":"خط اليد، غرفة المماراة، الدندنة، القاموس الشخصي والعنقدة، المراجعة المتأخرة، جمل النجاة، تسجيل شهري."},{"title":"قواعد المدرب","body":"ممنوع الضرب والتهديد والإهانة مع أي طالب، ولأي سبب. ولي الأمر على علم في حالة الأطفال. المحتوى مناسب للسن. من غير تحميل زيادة."}]};
  var COL = { wood: '#a9753f', bronze: '#cd7f32', gold: '#f7c948', diamond: '#5fd4f0', legend: '#a78bfa' };
  var SK = { creative: ['الملَكة الإبداعية', 'Creative flair'], rasf: ['القدرة على الرصف', 'Sentence building'], tone: ['القدرة على التلاعب بالنبرة', 'Tone control'] };
  var data = null, ctx = null;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) { e.textContent = text; e.dir = 'auto'; } return e; }
  function root() { var h = document.getElementById('thApp'); return h && h.shadowRoot; }
  function isAr() { var r = root(), w = r && r.getElementById('W'); return !!w && w.dir === 'rtl'; }
  function T(a, e) { return isAr() ? a : e; }
  function day(s) { var d = s ? new Date(s + 'T12:00:00') : new Date(); return d.toLocaleDateString(isAr() ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function levels() { return (data && data.levels && data.levels.length ? data.levels : DEF.levels); }
  /* Until the database part is applied, fall back to the level already on the profile (Wood by default) */
  function fallback() { var p = window.thProfile || {}; return { level: p.level || 'wood', percent: null, since: null, history: [], current: [], skills: p.skills || {} }; }
  function load() {
    var f = window.thPath ? window.thPath() : Promise.reject();
    return f.then(function (r) { if (!r || !r.level) throw 0; data = r; return r; }).catch(function () { data = fallback(); return data; });
  }
  function css() {
    var r = root(); if (!r || r.getElementById('thPathCss')) return;
    var s = el('style'); s.id = 'thPathCss';
    s.textContent = [
      '.tp{position:relative;min-height:100%;background:#000;color:#ece8df;padding:56px 16px 40px;box-sizing:border-box;direction:ltr}',
      '.tp-i{position:absolute;top:14px;right:14px;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.07);color:#ece8df;font:800 15px Inter,sans-serif;cursor:pointer}',
      '.tp-l{max-width:560px;margin:0 auto}',
      '.tp-row{display:grid;grid-template-columns:84px 28px 1fr;column-gap:8px}',
      '.tp-date{font:600 .72rem/1.5 Cairo,Inter,sans-serif;opacity:.65;text-align:right;padding-top:1px}',
      '.tp-line{position:relative;display:flex;justify-content:center}',
      '.tp-line:before{content:"";position:absolute;top:0;bottom:0;width:2px;background:rgba(255,255,255,.14)}',
      '.tp-row:first-child .tp-line:before{top:8px}.tp-row:last-child .tp-line:before{bottom:auto;height:8px}',
      '.tp-dot{position:relative;width:14px;height:14px;margin-top:3px;border-radius:50%;background:var(--c)}',
      '.tp-now .tp-dot{width:20px;height:20px;margin-top:0;box-shadow:0 0 0 5px rgba(255,255,255,.08),0 0 18px var(--c)}',
      '.tp-body{padding-bottom:34px;font-family:Cairo,Inter,sans-serif;text-align:start}',
      '.tp-body b{display:block;font-size:.95rem}.tp-sub{display:block;font-size:.78rem;opacity:.65;margin-top:2px}',
      '.tp-bar{height:7px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden;margin:12px 0 4px}.tp-bar i{display:block;height:100%;background:var(--c)}',
      '.tp-ms{display:flex;justify-content:space-between;gap:10px;font-size:.8rem;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08)}',
      '.tp-fut{filter:blur(4px);opacity:.4;user-select:none}.tp-fut .tp-dot{background:#8a8a8a}',
      '.tp-ov{position:fixed;inset:0;z-index:600;display:flex;align-items:safe center;justify-content:center;gap:14px;flex-wrap:wrap;padding:20px;overflow:auto;background:rgba(6,8,14,.82)}',
      '.tp-card{width:min(360px,100%);max-height:calc(100dvh - 40px);overflow:auto;box-sizing:border-box;padding:22px 18px;border-radius:24px;background:#14161d;color:#ece8df;border:1px solid rgba(255,255,255,.14);font-family:Cairo,Inter,sans-serif}',
      '.tp-card h3{margin:0 0 12px;text-align:center}',
      '.tp-it{display:flex;gap:10px;padding:10px;border-radius:14px;border:1px solid transparent}.tp-it.on{border-color:var(--c);background:rgba(255,255,255,.05)}',
      '.tp-it>i{flex:0 0 12px;height:12px;margin-top:6px;border-radius:50%;background:var(--c)}.tp-it span{display:block;font-size:.8rem;opacity:.72;line-height:1.7}',
      '.tp-x{display:block;margin:12px auto 0;padding:6px 22px;border-radius:99px;border:1px solid rgba(255,255,255,.2);background:none;color:inherit;cursor:pointer}'
    ].join('');
    r.appendChild(s);
  }
  function item(color, title, sub, on) {
    var it = el('div', 'tp-it' + (on ? ' on' : '')); it.style.setProperty('--c', color); it.appendChild(el('i'));
    var d = el('div'); d.appendChild(el('b', '', title)); if (sub) d.appendChild(el('span', '', sub)); it.appendChild(d); return it;
  }
  function openInfo() {
    css(); load().then(function () {
      var r = root(), W = r && r.getElementById('W'); if (!W || r.querySelector('.tp-ov')) return;
      var lang = isAr() ? 'ar' : 'en', ov = el('div', 'tp-ov'); ov.dir = isAr() ? 'rtl' : 'ltr';
      function close() { ov.remove(); document.removeEventListener('keydown', esc); }
      function esc(e) { if (e.key === 'Escape') close(); }
      function card(title) { var c = el('div', 'tp-card'); c.appendChild(el('h3', '', title)); ov.appendChild(c); return c; }
      var a = card(T('المستويات', 'Levels'));
      levels().forEach(function (l) { var on = l.key === data.level; a.appendChild(item(COL[l.key] || '#999', l.name[lang] + (on ? T(' · إنت هنا', ' · you are here') : ''), l.desc[lang], on)); });
      var note = (window.thProfile || {}).level_note; if (note) a.appendChild(el('p', 'tp-sub', note));
      var b = card(T('المهارات', 'Skills')), sk = data.skills || (window.thProfile || {}).skills || {}, have = Object.keys(SK).filter(function (k) { return Object.prototype.hasOwnProperty.call(sk, k); });
      have.forEach(function (k) { b.appendChild(item('#a78bfa', SK[k][isAr() ? 0 : 1], sk[k])); });
      if (!have.length) b.appendChild(el('p', 'tp-sub', T('لسه المدرب مسجلش مهارات.', 'No skills recorded yet.')));
      var x = el('button', 'tp-x', T('إغلاق', 'Close')); x.type = 'button'; x.onclick = close; b.appendChild(x);
      ov.onclick = function (e) { if (e.target === ov) close(); }; document.addEventListener('keydown', esc); W.appendChild(ov);
    });
  }
  function row(cls, date, color) {
    var w = el('div', 'tp-row ' + cls); w.style.setProperty('--c', color); w.appendChild(el('div', 'tp-date', date));
    var ln = el('div', 'tp-line'); ln.appendChild(el('span', 'tp-dot')); w.appendChild(ln);
    var body = el('div', 'tp-body'); w.appendChild(body); return { w: w, body: body };
  }
  function draw(box) {
    var lang = isAr() ? 'ar' : 'en', all = levels(), at = Math.max(0, all.map(function (l) { return l.key; }).indexOf(data.level));
    box.textContent = '';
    var q = el('button', 'tp-i', '!'); q.type = 'button'; q.title = T('المستويات', 'Levels'); q.onclick = openInfo; box.appendChild(q);
    var list = el('div', 'tp-l'); box.appendChild(list);
    /* past: dates and duration appear only if the admin tool recorded them */
    all.slice(0, at).forEach(function (l) {
      var h = (data.history || []).filter(function (x) { return x.level === l.key; }).pop() || {};
      var r = row('', h.to ? day(h.to) : '', COL[l.key]); r.body.appendChild(el('b', '', l.name[lang])); r.body.appendChild(el('span', 'tp-sub', T('خلصته ✓', 'Completed ✓')));
      if (h.from && h.to) { var n = Math.max(1, Math.round((new Date(h.to) - new Date(h.from)) / 864e5)); r.body.appendChild(el('span', 'tp-sub', T('المدة: ' + n + ' يوم', 'Time: ' + n + ' days'))); }
      list.appendChild(r.w);
    });
    var cur = all[at], now = row('tp-now', day(), COL[cur.key]); now.body.appendChild(el('b', '', cur.name[lang]));
    if (data.since) now.body.appendChild(el('span', 'tp-sub', T('بدأته ', 'Started ') + day(data.since)));
    if (data.percent != null) {
      var pc = Math.max(0, Math.min(100, Math.round(data.percent))), bar = el('div', 'tp-bar'), fill = el('i'); fill.style.width = pc + '%'; bar.appendChild(fill); now.body.appendChild(bar);
      now.body.appendChild(el('span', 'tp-sub', T('خلصت ' + pc + '% من المستوى', pc + '% of this level done')));
    }
    (data.current || []).forEach(function (m) { var d = el('div', 'tp-ms'); d.appendChild(el('span', '', m.name)); d.appendChild(el('span', '', m.state === 'done' ? '✓' : T('شغالين عليه', 'in progress'))); now.body.appendChild(d); });
    list.appendChild(now.w);
    /* the future is never shown: one blurred dot */
    if (at < all.length - 1 || data.percent !== 100) { var f = row('tp-fut', '', '#888'); f.body.appendChild(el('b', '', '▒▒▒▒▒▒▒')); f.body.setAttribute('aria-hidden', 'true'); list.appendChild(f.w); }
  }
  var timer = null;
  function render(b) {
    css(); b.textContent = ''; b.classList.add('full');
    var box = el('div', 'tp'); b.appendChild(box);
    load().then(function () { if (box.isConnected) draw(box); });
    clearInterval(timer); timer = setInterval(function () { if (!box.isConnected) return clearInterval(timer); load().then(function () { if (box.isConnected) draw(box); }); }, 60000);
  }
  var reg = window.ThabitBtn = window.ThabitBtn || {}, orig = reg.compass;
  reg.compass = function (c) {
    ctx = c; var m = (orig && orig(c)) || {};
    delete m.page; m.render = render; m.full = function () { return true; }; m.stop = function () { clearInterval(timer); };
    return m;
  };
  window.ThabitPath = { openInfo: openInfo };
})();