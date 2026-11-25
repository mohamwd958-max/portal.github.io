/* =====================================================================
   SHARED SCREEN: lists-core.js
   الكود المشترك للحاويات الصغيرة (كروت فيها كبسولات + نافذة بتفتح المحتوى كله + زرار النطق الأخضر + مشغّل النطق).
   اتنقل من العلامات الحيوية (btn-dash.js) ومابقاش موجود هناك.

   بيستخدمه:  الموارد (الملاحظات + النصوص TEFL + الخربشات)   و   قاموسك (الكلمات والأصوات)
   الاستخدام:  var s = ThabitLists.screen(ctx, ['tefl', 'notes', 'scratch']);   // s = { render, stop, full }
   حاوية جديدة:  ThabitLists.add({ key, title:{en,ar}, col:'اسم العمود في trainee_dashboard' })   (أو list/preview/body زي res-scratch.js)

   لازم يتحمّل قبل btn-res-content.js و btn-ydict-content.js و res-scratch.js.
   بيقرا من نفس التوكن اللي home.html بيستخدمه: thabit_trainee_token
   ===================================================================== */
(function () {
  const SB = "https://vkfexceitwjmxncwceqb.supabase.co";
  const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
  const TOKEN_KEY = 'thabit_trainee_token';

  /* the same cleaning the table's word_key uses; shared by the pronouncer and by the words_table index */
  const wpClean = v => !v ? '' : String(v).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”‘’]/g, '').replace(/\s+/g, ' ').trim();
  const wpCache = {};

  /* ---- words_table: single words / phrases typed by hand, each with a recording (looked up by their text) ----
     We load them once (cached 30 s) so the text can be scanned: only the words that exist here get tapped. */
  const WI = { ix: null, at: 0, p: null };
  function wiLoad() {
    if (WI.p) return WI.p;
    return (WI.p = (async () => {
      const map = new Map(), first = new Set(); let max = 1, off = 0;
      for (let pg = 0; pg < 80; pg++) {
        const r = await fetch(SB + '/rest/v1/words_table?select=word,audio_url&audio_url=not.is.null&order=word.asc&limit=1000&offset=' + off, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const rows = await r.json(); if (!Array.isArray(rows) || !rows.length) break;
        rows.forEach(x => {
          const k = wpClean(x.word); if (!k || !x.audio_url || map.has(k)) return;
          map.set(k, { word: String(x.word), url: x.audio_url }); wpCache[k] = x.audio_url;
          const p = k.split(' '); first.add(p[0]); if (p.length > max) max = p.length;
        });
        off += rows.length;
      }
      WI.ix = { map: map, first: first, max: max }; WI.at = Date.now(); return WI.ix;
    })().finally(() => { WI.p = null; }));
  }
  function wiGet() {
    if (WI.ix && Date.now() - WI.at > 30000 && !WI.p) wiLoad().catch(() => { });
    return WI.ix ? Promise.resolve(WI.ix) : wiLoad();
  }

  /* ---- voice notes of THIS trainee (table voice_notes) ----
     one row = one picked area of text with a recording:  trainee_id | scope ('<date>|<key>', e.g. '2026-11-23|tefl') | word (the picked text) | occ | start_idx | audio_url
     The container opens an entry of scope '<date>|<key>' -> we take that trainee's rows for that scope and mark exactly those areas (a word, a sentence or the whole passage). */
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const REC = { tid: null, by: null, at: 0, p: null };
  function recTid(prof) {
    let c = {}; try { c = JSON.parse(localStorage.getItem('currentTrainee') || '{}') || {}; } catch (e) { }
    prof = prof || {};
    return [prof.trainee_id, prof.id, c.trainee_id, c.id].map(x => String(x || '')).find(x => UUID.test(x)) || null;
  }
  function recLoad(tid) {
    if (REC.p && REC.tid === tid) return REC.p;
    REC.tid = tid;
    return (REC.p = (async () => {
      const by = new Map(); let off = 0;
      for (let pg = 0; pg < 60; pg++) {
        const r = await fetch(SB + '/rest/v1/voice_notes?select=scope,word,occ,start_idx,audio_url,duration&trainee_id=eq.' + encodeURIComponent(tid) + '&status=eq.active&lost_from=is.null&audio_url=not.is.null&order=scope.asc,start_idx.asc&limit=1000&offset=' + off, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const rows = await r.json(); if (!Array.isArray(rows) || !rows.length) break;
        rows.forEach(x => { const k = String(x.scope || ''); if (!by.has(k)) by.set(k, []); by.get(k).push(x); }); off += rows.length;
      }
      REC.by = by; REC.at = Date.now(); return by;
    })().finally(() => { REC.p = null; }));
  }
  /* cached; a newer copy is fetched quietly when the cached one is older than 30 s (it shows on the next open) */
  function recGet(tid) {
    if (REC.by && REC.tid === tid) { if (Date.now() - REC.at > 30000 && !REC.p) recLoad(tid).catch(() => { }); return Promise.resolve(REC.by); }
    REC.by = null; return recLoad(tid);
  }
  const T = {
    en: { none: 'No data yet', ear: 'Pronunciation', loading: 'Loading…', login: 'Please log in again.', fail: 'Could not load your data. Try again.', wmiss: 'No recording for this word yet', wfail: 'Could not load the recording', qPlus: 'Add words or sentences', qToday: 'Today:', qSess: 'Your session today should be number', qNoSess: "I couldn't determine today's session number. Add it by hand.", qLast: 'Your last session was number', qNum: 'Session number', qTip: 'It is best to put each sentence on its own, so reviewing and studying it is easier.', qAr: 'Arabic', qEn: 'English', qAdd: 'Add another', qRm: 'Remove', qSave: 'Save', qCancel: 'Cancel', qDone: 'Done', qSure: 'Are you sure this is everything for this session?', qYes: 'Yes, save it', qBack: 'Go back', qSaved: 'Saved', qFail: 'Could not save. Try again.' },
    ar: { none: 'لا توجد بيانات بعد', ear: 'النطق', loading: 'جاري التحميل…', login: 'سجّل دخول من جديد.', fail: 'تعذر تحميل بياناتك، حاول تاني.', wmiss: 'لا يوجد تسجيل لهذه الكلمة بعد', wfail: 'تعذر تحميل التسجيل', qPlus: 'إضافة كلمات أو جمل', qToday: 'اليوم:', qSess: 'جلستك اليوم المفروض تكون جلسة رقم', qNoSess: 'لم أستطع تحديد رقم جلسة اليوم، أضفه يدويًا.', qLast: 'آخر جلسة لك كانت رقم', qNum: 'رقم الجلسة', qTip: 'يُفضَّل أن تضع كل جملة على حدة حتى تكون مراجعتك ومذاكرتك لها أسهل.', qAr: 'عربي', qEn: 'English', qAdd: 'إضافة أخرى', qRm: 'حذف', qSave: 'حفظ', qCancel: 'إلغاء', qDone: 'تم', qSure: 'هل أنت متأكد أن هذا كل شيء لهذه الجلسة؟', qYes: 'نعم، احفظها', qBack: 'رجوع', qSaved: 'تم الحفظ', qFail: 'تعذّر الحفظ، حاول مرة أخرى.' }
  };
  const REG = {
    notes: { key: 'notes', col: 'notes', title: { en: 'Notes', ar: 'ملاحظات' } },
    tefl: { key: 'tefl', col: 'tefl', title: { en: 'Passages', ar: 'النصوص' } },
    qol: { key: 'qol', col: 'qol', title: { en: 'Words and sounds', ar: 'الكلمات والأصوات' } }
  };
  window.ThabitLists = {
    add: function (def) { if (def && def.key) REG[def.key] = def; },
    screen: function (ctx, keys) {
    const lg = () => (ctx.lang() === 'ar' ? 'ar' : 'en');
    const tt = () => T[lg()];
    const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let D = null, wrap = null, root = null, mo = null, lastLang = null, loadId = 0, onResize = null, cmTk = 0;
    const LISTS = {}, EXTRA = {};
    const WP = { urls: [], i: 0, a: null, word: '', tk: 0 };
    const tok = () => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } };
    const rpc = (fn, body) => fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    const defs = () => keys.map(k => REG[k]).filter(Boolean);
    const ttl = d => (d.title && (d.title[lg()] || d.title.en)) || d.key;

    const EAR_DEF = { qol: 1, tefl: 0, notes: 0 };
    const earOn = k => { let s = {}; try { s = JSON.parse(localStorage.getItem('thabit_ear') || '{}') || {}; } catch (e) { } return k in s ? !!s[k] : !!EAR_DEF[k]; };
    const earSet = (k, v) => { let s = {}; try { s = JSON.parse(localStorage.getItem('thabit_ear') || '{}') || {}; } catch (e) { } s[k] = v ? 1 : 0; try { localStorage.setItem('thabit_ear', JSON.stringify(s)); } catch (e) { } };
    const plain = s => window.ThabitRich && ThabitRich.strip ? ThabitRich.strip(s) : String(s == null ? '' : s);
    const inl = s => window.ThabitRich && ThabitRich.inline ? ThabitRich.inline(esc(s)) : esc(s);
    const LNK = /\[([^\]\n]{1,200})\]\((https?:\/\/[^\s)]{3,2000})\)/g;
    /* ear on: ONLY the areas that have a voice note become tappable (see place() + mark() below). The old "every word is tappable" wrapping is gone: it made all the text blue. */
    const wordify = h => h;
    function escv(s, ear) {
      s = String(s == null ? '' : s); let out = '', last = 0, m; LNK.lastIndex = 0;
      const f = x => { const h = inl(x).replace(/(<[^>]+>)|\s*\|\s*/g, (mm, tag) => tag ? tag : '<i class="vb"></i>'); return ear ? wordify(h) : h; };
      while ((m = LNK.exec(s))) { out += f(s.slice(last, m.index)) + '<a class="alk" href="' + esc(m[2]) + '" target="_blank" rel="noopener noreferrer">' + esc(m[1]) + '</a>'; last = m.index + m[0].length; }
      return out + f(s.slice(last));
    }
    function rich(txt, ear) {
      return String(txt || '').trim().split(/\n\s*\n/).filter(b => b.trim()).map(b => {
        const ls = b.split('\n').map(l => l.trimEnd()).filter(l => l.trim()), NUM = /^\s*(\d+|[a-zA-Z])[.)]\s+/, BUL = /^\s*[-•*]\s+/;
        if (ls.every(l => NUM.test(l))) return '<ol class="rl" dir="auto"' + (/^\s*[a-zA-Z][.)]/.test(ls[0]) ? ' type="a"' : '') + '>' + ls.map(l => '<li>' + escv(l.replace(NUM, ''), ear) + '</li>').join('') + '</ol>';
        if (ls.every(l => BUL.test(l))) return '<ul class="rl" dir="auto">' + ls.map(l => '<li>' + escv(l.replace(BUL, ''), ear) + '</li>').join('') + '</ul>';
        return '<p class="rp" dir="auto">' + ls.map(l => escv(l, ear)).join('<br>') + '</p>';
      }).join('');
    }
    /* ---- find each recorded area inside an entry's text and wrap it (one area = ONE tappable piece, even if it spans lines or several words) ----
       1) place(): the area is found where start_idx says (checked against the word); if the text no longer matches there, the occ-th occurrence of the word is used; if neither is found the row is skipped.
          Private marker characters are put around each area in the raw text, so the normal rich() formatting (paragraphs, lists, links, bars) still runs.
       2) mark(): the markers become <span class="vx" data-url=...>; when an area crosses a tag (new line, list item...) the span is closed and re-opened so the HTML stays valid. */
    const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    function place(raw, rows) {
      const hit = [];
      rows.forEach(r => {
        const w = String(r.word == null ? '' : r.word); if (!w.trim() || !r.audio_url) return;
        const pat = w.trim().split(/\s+/).map(reEsc).join('\\s+'), lead = w.length - w.replace(/^\s+/, '').length;
        const si = parseInt(r.start_idx, 10), occ = Math.max(0, parseInt(r.occ, 10) || 0);
        let s = -1, e = -1, m;
        [si, si + lead].forEach(p => { if (s < 0 && isFinite(p) && p >= 0 && p < raw.length && (m = new RegExp('^(?:' + pat + ')').exec(raw.slice(p)))) { s = p; e = p + m[0].length; } });
        if (s < 0) { const g = new RegExp(pat, 'g'); let n = 0; while ((m = g.exec(raw))) { if (n++ === occ) { s = m.index; e = s + m[0].length; break; } if (!m[0].length) g.lastIndex++; } }
        if (s >= 0) hit.push({ s: s, e: e, r: r });
      });
      hit.sort((a, b) => (b.e - b.s) - (a.e - a.s));   /* overlapping areas: the longer one wins */
      const ok = []; hit.forEach(h => { if (!ok.some(o => h.s < o.e && o.s < h.e)) ok.push(h); });
      ok.sort((a, b) => a.s - b.s);
      let out = '', last = 0; const recs = [];
      ok.forEach(h => { out += raw.slice(last, h.s) + '' + recs.length + '' + raw.slice(h.s, h.e) + ''; last = h.e; recs.push(h.r); });
      return { text: out + raw.slice(last), recs: recs };
    }
    function mark(h, recs) {
      let out = '', cur = null, op = false;
      h.split(/(<[^>]+>|\d+|)/).forEach(p => {
        if (!p) return;
        let m;
        if ((m = /^(\d+)$/.exec(p))) { cur = recs[+m[1]]; return; }
        if (p === '') { if (op) { out += '</span>'; op = false; } cur = null; return; }
        if (/^<[^>]+>$/.test(p)) { if (op) { out += '</span>'; op = false; } out += p; return; }
        if (cur && !op) { out += '<span class="vx" role="button" tabindex="0" data-word="' + esc(cur.word) + '" data-url="' + esc(cur.audio_url) + '">'; op = true; }
        out += p;
      });
      return out + (op ? '</span>' : '');
    }
    const preloadRec = () => { try { if (window.ThabitRich || !keys.some(k => REG[k] && !REG[k].noear && !REG[k].body && earOn(k))) return; const tid = recTid(D && D.profile); if (tid) recGet(tid).catch(() => { }); wiGet().catch(() => { }); } catch (e) { } };
    /* single words (table words_table): every token of the text that exists there (alone, or as a phrase) becomes tappable. Areas already marked as voice notes, links and tags are left alone. */
    const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    function markWords(h, ix) {
      const re = /(<span class="vx"[\s\S]*?<\/span>)|(<a\b[^>]*>[\s\S]*?<\/a>)|(<[^>]+>)|([^<\s]+)/g, T = []; let m, gap = false;
      while ((m = re.exec(h))) {
        if (m[4] === undefined) { gap = true; continue; }
        const k = wpClean(unesc(m[4])); if (!k) continue;
        T.push({ s: m.index, e: m.index + m[4].length, k: k, g: gap }); gap = false;
      }
      const spans = []; let i = 0;
      while (i < T.length) {
        if (!ix.first.has(T[i].k)) { i++; continue; }
        let hit = null;
        for (let L = Math.min(ix.max, T.length - i); L >= 1 && !hit; L--) {
          let broken = false; for (let j = i + 1; j < i + L; j++) if (T[j].g) { broken = true; break; }
          if (broken) continue;   /* a phrase never crosses a tag / link / voice-note area */
          const ent = ix.map.get(T.slice(i, i + L).map(t => t.k).join(' ')); if (ent) hit = { L: L, ent: ent };
        }
        if (!hit) { i++; continue; }
        spans.push({ s: T[i].s, e: T[i + hit.L - 1].e, ent: hit.ent }); i += hit.L;
      }
      if (!spans.length) return h;
      let out = '', last = 0;
      spans.forEach(x => { out += h.slice(last, x.s) + '<span class="vx" role="button" tabindex="0" data-word="' + esc(x.ent.word) + '" data-url="' + esc(x.ent.url) + '">' + h.slice(x.s, x.e) + '</span>'; last = x.e; });
      return out + h.slice(last);
    }
    const EARSVG = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 9a4 4 0 1 1 8 0c0 2.2-1.4 3.1-2.5 4.2-.9.9-1.5 1.7-1.5 3a3.2 3.2 0 0 1-3.2 3.2"/><path d="M13.5 9a.5.5 0 1 1 1 0c0 .8-.6 1.1-1 1.5"/><path d="M4.6 9.2a5.6 5.6 0 0 0 0 5.6M2 7.4a8.8 8.8 0 0 0 0 9.2"/></svg>';
    /* ---- the cards ---- */
    const entries = d => d.col ? D.rows.slice().reverse().filter(r => r[d.col]).map(r => ({ date: r.supply_date, text: String(r[d.col]) })) : (EXTRA[d.key] || []);
    const preview = (d, x) => d.preview ? d.preview(x) : plain(x.text).replace(/\s+/g, ' ');
    function cap(d) {
      const t = tt(), key = d.key, on = !d.noear && earOn(key), list = LISTS[key] = entries(d);
      const none = (d.none && (d.none[lg()] || d.none.en)) || t.none;
      const it = list.map((x, n) => '<div class="cap" data-n="' + n + '"><span class="dt">' + esc(x.date) + '</span><span class="ct" dir="auto">' + esc(String(preview(d, x)).slice(0, 70)) + '</span></div>').join('');
      const ear = d.noear ? '' : '<div class="earbar"><button type="button" class="ear' + (on ? ' on' : '') + '" data-ear="' + key + '" aria-pressed="' + on + '" aria-label="' + t.ear + '" title="' + t.ear + '">' + EARSVG + '</button></div>';
      return '<div class="card earc" data-key="' + key + '"><div class="earh"><h4>' + esc(ttl(d)) + '</h4>' + ear + '</div><div class="lst">' + (it || '<div class="sm">' + esc(none) + '</div>') + '</div></div>';
    }
    /* one cell and a quarter of the next one; nothing scrolls inside, a tap anywhere on the container opens all of it */
    function fitCaps() {
      if (!root) return;
      root.querySelectorAll('.earc .lst').forEach(l => {
        const c = [...l.children].filter(x => x.classList.contains('cap')); l.style.maxHeight = '';
        if (!c.length || !c[0].offsetHeight) return;
        if (c.length < 2) { l.style.maxHeight = 'none'; return; }
        l.style.maxHeight = (c[0].offsetHeight + (parseFloat(getComputedStyle(c[0]).marginBottom) || 0) + c[1].offsetHeight * 0.25) + 'px';
      });
    }
    function paint() {
      if (!root || !D) return;
      const keep = root.scrollTop, ds = defs();
      root.innerHTML = '<div class="grid lists' + (ds.length === 1 ? ' one' : ' stack') + '">' + ds.map(cap).join('') + '</div>';
      root.scrollTop = keep; requestAnimationFrame(fitCaps); setTimeout(fitCaps, 350);
    }
    function closeCm() { cmTk++; const e = wrap && wrap.querySelector('.cm'); if (e) e.remove(); }
    function openCm(key, n) {
      closeCm(); const t = tt(), d = REG[key]; if (!d) return; const on = !d.noear && earOn(key), list = LISTS[key] || [], my = cmTk;
      /* two sources of recordings, voice notes WIN over single words:
         1) table voice_notes  = areas you picked inside a text (a word, a sentence, the whole passage), per trainee + scope '<date>|<key>'
         2) table words_table  = single words / phrases you typed and recorded (looked up by their text)
         If they are not loaded yet the entry opens plain and gets its blue parts a moment later. */
      const act = on && !d.body && !window.ThabitRich;
      const tid = act ? recTid(D && D.profile) : null;
      if (act && !tid) { try { console.warn('[lists-core] trainee id not found (profile.id / trainee_id): voice notes cannot be marked'); } catch (e) { } }
      const hadV = tid && REC.tid === tid ? REC.by : null, hadW = act ? WI.ix : null;
      const ce = (by, wx) => list.map((x, i) => {
        let h; const raw = String(x.text == null ? '' : x.text);
        if (d.body) h = d.body(x, esc);
        else {
          const rows = tid && by ? by.get(String(x.date || '').slice(0, 10) + '|' + key) : null;
          if (rows && rows.length) { const p = place(raw, rows); h = mark(rich(p.text, on), p.recs); } else h = rich(raw, on);
          if (act && wx) h = markWords(h, wx);   /* single words: only in the text that no voice note already covers */
        }
        return '<div class="ce" data-n="' + i + '"><div class="dt">' + esc(x.date) + '</div>' + h + '</div>';
      }).join('') || '<div class="sm">' + t.none + '</div>';
      const el = document.createElement('div'); el.className = 'ov2 cm';
      el.innerHTML = '<div class="cmb"><button type="button" class="tdx cmx" aria-label="Close">×</button><h4 class="cmh">' + esc(ttl(d)) + '</h4><div class="cml">' + ce(hadV, hadW) + '</div></div>';
      wrap.appendChild(el);
      const l = el.querySelector('.cml'), c = l.querySelector('.ce[data-n="' + n + '"]'); if (c) l.scrollTop = c.offsetTop - 4;
      if (act) {
        const bad = what => e => { try { console.warn('[lists-core] could not load ' + what, e); } catch (x) { } return null; };
        Promise.all([tid ? recGet(tid).catch(bad('voice_notes')) : null, wiGet().catch(bad('words_table'))]).then(r => {
          const by = r[0] || hadV, wx = r[1] || hadW;
          if ((by === hadV && wx === hadW) || my !== cmTk || !el.isConnected) return;
          const cl = el.querySelector('.cml'), top = cl.scrollTop; cl.innerHTML = ce(by, wx); cl.scrollTop = top;
        });
      }
    }
    function say(msg) { if (root) root.innerHTML = '<div class="card msg">' + esc(msg) + '</div>'; }
    async function load(silent) {
      const id = ++loadId, t = tt();
      if (!tok()) { if (!silent) say(t.login); return; }
      if (!silent) say(t.loading);
      let d = null; try { d = await rpc('trainee_dashboard', { p_token: tok() }); } catch (e) { if (id === loadId && !silent) say(t.fail); return; }
      if (id !== loadId) return;
      if (!d || !d.profile) { if (!silent) say(t.login); return; }
      d.rows = (d.rows || []).slice().sort((a, b) => (a.supply_date + String(a.session_number).padStart(5, '0')).localeCompare(b.supply_date + String(b.session_number).padStart(5, '0')));
      for (const k of keys) { const x = REG[k]; if (x && x.list) { try { EXTRA[k] = await x.list(d, { rpc: rpc, tok: tok }); } catch (e) { EXTRA[k] = []; } } }
      if (id !== loadId) return;
      D = d; paint(); preloadRec();
    }

    /* ---- the pronouncer (tap a word -> its recording from words_table) ---- */
    const fmtS = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    const PLAY = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', PAUSE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
    function wpClose() { WP.tk++; if (WP.a) { try { WP.a.pause(); } catch (e) { } WP.a = null; } const el = wrap && wrap.querySelector('.wp'); if (el) el.remove(); }
    function wpMsg(m) { const el = wrap && wrap.querySelector('.wp'); if (!el) return; el.querySelector('.wpr').style.display = 'none'; const x = el.querySelector('.wpm'); x.textContent = m; x.hidden = false; }
    function wpLoad(auto) {
      const el = wrap && wrap.querySelector('.wp'); if (!el) return;
      if (WP.a) { try { WP.a.pause(); } catch (e) { } }
      const a = WP.a = new Audio(WP.urls[WP.i]), my = WP.tk;
      const pb = el.querySelector('.wpp'), sk = el.querySelector('input'), tm = el.querySelector('.wpt'), part = el.querySelector('.wpn');
      let drag = false; const live = () => my === WP.tk && WP.a === a;
      const sync = () => { if (!live()) return; const d = a.duration || 0; if (!drag) sk.value = d ? Math.round(a.currentTime / d * 1000) : 0; tm.textContent = fmtS(a.currentTime) + ' / ' + fmtS(d); };
      const icon = () => { if (live()) pb.innerHTML = a.paused ? PLAY : PAUSE; };
      part.textContent = WP.urls.length > 1 ? (WP.i + 1) + '/' + WP.urls.length : '';
      a.ontimeupdate = sync; a.onloadedmetadata = sync; a.onplay = icon; a.onpause = icon;
      a.onended = () => { if (!live()) return; if (WP.i < WP.urls.length - 1) { WP.i++; setTimeout(() => { if (my === WP.tk) wpLoad(true); }, 350); } else { a.currentTime = 0; sync(); icon(); } };
      a.onerror = () => { if (live()) wpMsg(tt().wfail); };
      pb.onclick = () => { if (a.paused) a.play().catch(() => { }); else a.pause(); };
      sk.oninput = () => { drag = true; if (a.duration) { a.currentTime = sk.value / 1000 * a.duration; tm.textContent = fmtS(a.currentTime) + ' / ' + fmtS(a.duration); } };
      sk.onchange = () => { drag = false; };
      sk.value = 0; sync(); icon(); if (auto) a.play().catch(() => { });
    }
    const wpParts = v => String(v || '').split(/[,\u060C\n]+/).map(x => x.trim()).filter(Boolean);
    let wpKeyOK = true;
    async function wpQuery(qs) {
      const r = await fetch(SB + '/rest/v1/words_table?select=audio_url&audio_url=not.is.null&limit=1&' + qs, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
      if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
      const rows = await r.json(); return Array.isArray(rows) && rows[0] ? rows[0].audio_url : null;
    }
    async function wpLookup(word) {
      const c = wpClean(word); if (!c) return null; if (wpCache[c]) return wpCache[c];
      let u = null;
      if (wpKeyOK) { try { u = await wpQuery('word_key=eq.' + encodeURIComponent(c)); } catch (e) { if (e.status === 400 || e.status === 404) wpKeyOK = false; else throw e; } }
      if (!u) u = await wpQuery('word=ilike.' + encodeURIComponent(String(word).trim().replace(/[\\%_]/g, m => '\\' + m)));
      if (u) wpCache[c] = u; return u;
    }
    async function wpResolve(text) {
      const u = await wpLookup(text); if (u) return [u];
      const parts = wpParts(text); if (parts.length < 2) return null;
      const us = await Promise.all(parts.map(wpLookup)); return us.every(Boolean) ? us : null;
    }
    async function wpOpen(word, url) {   /* url given (a marked area) = play exactly that row's recording; no url = look the word up by its text */
      word = String(word == null ? '' : word).trim(); if (!word || !wrap) return;
      wpClose();
      const my = ++WP.tk; WP.word = word; WP.urls = []; WP.i = 0;
      const el = document.createElement('div'); el.className = 'wp';
      el.innerHTML = '<div class="wpw" dir="auto">' + esc(word) + '</div><div class="wpr" dir="ltr"><button type="button" class="wpb wpp" aria-label="Play/Pause">' + PLAY + '</button><input type="range" min="0" max="1000" value="0" aria-label="Seek"><span class="wpt">0:00 / 0:00</span><span class="wpn"></span></div><div class="wpm" dir="auto" hidden></div>';
      wrap.appendChild(el);
      let urls; if (url) urls = [url]; else { try { urls = await wpResolve(word); } catch (e) { urls = undefined; } }
      if (my !== WP.tk) return;
      if (!urls) { wpMsg(urls === null ? tt().wmiss : tt().wfail); return; }
      WP.urls = urls; wpLoad(true);
    }


    /* ---- "+" on Your Dictionary: add words / sentences for today's session (Arabic | English halves, numbered rows) ---- */
    const QMAX = 9999;
    const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const QK = () => 'thabit_qol_sess:' + String(tok() || 'x').slice(0, 16);
    /* today's session number: the one already saved for today > a session already dated today > the last past session + 1. Nothing found = the person types it. */
    function qInfo() {
      const today = ymd(new Date()), rows = (D && Array.isArray(D.rows)) ? D.rows : [];
      const num = r => { const n = parseInt(r && r.session_number, 10); return isFinite(n) && n >= 1 && n <= QMAX ? n : null; };
      const dk = r => String(r.supply_date || '').slice(0, 10);
      const ok = rows.filter(r => num(r) !== null && dk(r)), past = ok.filter(r => dk(r) < today), now = ok.filter(r => dk(r) === today);
      const lastR = past.length ? past[past.length - 1] : null;   /* rows are sorted oldest -> newest */
      let saved = null; try { const x = JSON.parse(localStorage.getItem(QK()) || 'null'); if (x && x.date === today && x.n >= 1) saved = x.n; } catch (e) { }
      const n = saved || (now.length ? Math.max.apply(null, now.map(num)) : (lastR ? num(lastR) + 1 : null));
      return { today: today, n: n, last: lastR ? { n: num(lastR), date: dk(lastR) } : null };
    }
    /* WHERE THE SESSION IS KEPT: not decided yet. Until it is, a copy waits in this device's storage (thabit_qol_drafts).
       To plug the real destination later, define  window.ThabitQolSave = function (rec) { ... return a promise }   rec = { date, n, items: [{ ar, en }], at } */
    const QSAVE = rec => typeof window.ThabitQolSave === 'function' ? Promise.resolve(window.ThabitQolSave(rec)).then(() => true) : new Promise(res => { try { const a = JSON.parse(localStorage.getItem('thabit_qol_drafts') || '[]'); a.push(rec); localStorage.setItem('thabit_qol_drafts', JSON.stringify(a)); } catch (e) { } res(true); });
    function qolPlus() {
      const t = tt(), p = document.createElement('button'); p.type = 'button'; p.className = 'qplus'; p.title = t.qPlus; p.setAttribute('aria-label', t.qPlus);
      p.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'; p.onclick = e => { e.stopPropagation(); qolOpen(); }; wrap.appendChild(p);
    }
    function qolOpen() {
      if (!wrap || wrap.querySelector('.qs')) return;
      const t = tt(), L = lg(), info = qInfo(), el = document.createElement('div'); el.className = 'ov2 qs';
      const dtxt = new Date().toLocaleDateString(L === 'ar' ? 'ar-EG' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), dir = L === 'ar' ? 'rtl' : 'ltr';
      el.innerHTML = '<div class="qsb" dir="' + dir + '"><button type="button" class="tdx qx" aria-label="Close">×</button>' +
        '<h4>' + esc(t.qPlus) + '</h4><div class="qd">' + esc(t.qToday) + ' ' + esc(dtxt) + '</div>' +
        (info.n ? '<div class="qi">' + esc(t.qSess) + ' <b>#' + info.n + '</b></div>' : '<div class="qi warn">' + esc(t.qNoSess) + '</div>') +
        (info.last ? '<div class="qi2">' + esc(t.qLast) + ' #' + info.last.n + ' · ' + esc(info.last.date) + '</div>' : '') +
        '<label class="qn"><span>' + esc(t.qNum) + '</span><input type="number" inputmode="numeric" min="1" max="' + QMAX + '" step="1" value="' + (info.n || '') + '"></label>' +
        '<p class="qtip">' + esc(t.qTip) + '</p><div class="qrows"></div>' +
        '<button type="button" class="qadd">+ ' + esc(t.qAdd) + '</button>' +
        '<div class="qact"><button type="button" class="qbtn qsv" disabled>' + esc(t.qSave) + '</button><button type="button" class="qbtn g qcn">' + esc(t.qCancel) + '</button></div></div>';
      wrap.appendChild(el);
      const q = s => el.querySelector(s), box = q('.qsb'), rows = q('.qrows'), inp = q('.qn input'), sv = q('.qsv'), items = [{ ar: '', en: '' }];
      const numOK = () => { const v = inp.value.trim(); return /^\d{1,4}$/.test(v) && +v >= 1 && +v <= QMAX; };
      const filled = () => items.filter(x => x.ar.trim() || x.en.trim());
      const ready = () => { sv.disabled = !(numOK() && filled().length); };
      const drawRows = () => {
        rows.innerHTML = items.map((x, i) => '<div class="qr"><span class="qb">' + (i + 1) + '</span><div class="qf" dir="ltr">' +
          '<button type="button" class="qp' + (x.en ? ' has' : '') + '" data-i="' + i + '" data-s="en" dir="ltr">' + esc(x.en || t.qEn) + '</button>' +
          '<button type="button" class="qp' + (x.ar ? ' has' : '') + '" data-i="' + i + '" data-s="ar" dir="rtl">' + esc(x.ar || t.qAr) + '</button></div>' +
          (items.length > 1 ? '<button type="button" class="qrm" data-rm="' + i + '" aria-label="' + esc(t.qRm) + '">×</button>' : '') + '</div>').join('');
        ready();
      };
      /* a small pop-up on top of the big one (the keyboard opens here) */
      function layer(html, wire) { const s = document.createElement('div'); s.className = 'qe'; s.innerHTML = '<div class="qeb" dir="' + dir + '">' + html + '</div>'; el.appendChild(s); wire(s, () => s.remove()); }
      function edit(i, side) {
        const ar = side === 'ar';
        layer('<h5>' + esc(ar ? t.qAr : t.qEn) + '</h5><textarea dir="' + (ar ? 'rtl' : 'ltr') + '" rows="3" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="' + esc(ar ? t.qAr : t.qEn) + '"></textarea>' +
          '<div class="qact"><button type="button" class="qbtn qdn">' + esc(t.qDone) + '</button><button type="button" class="qbtn g qno">' + esc(t.qCancel) + '</button></div>', (s, rm) => {
          const ta = s.querySelector('textarea'); ta.value = items[i][side];
          const done = () => { items[i][side] = ta.value.replace(/\s*\n+\s*/g, ' ').trim(); rm(); drawRows(); };
          s.querySelector('.qdn').onclick = done; s.querySelector('.qno').onclick = rm;
          s.addEventListener('click', e => { if (e.target === s) rm(); });
          ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); done(); } });
          setTimeout(() => { ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) { } }, 60);
        });
      }
      function confirmSave() {
        layer('<p>' + esc(t.qSure) + '</p><div class="qact"><button type="button" class="qbtn qyes">' + esc(t.qYes) + '</button><button type="button" class="qbtn g qbk">' + esc(t.qBack) + '</button></div><div class="qm"></div>', (s, rm) => {
          s.querySelector('.qbk').onclick = rm; s.addEventListener('click', e => { if (e.target === s) rm(); });
          s.querySelector('.qyes').onclick = async function () {
            const yes = this; yes.disabled = true;
            const n = +inp.value.trim(), rec = { date: info.today, n: n, items: filled().map(x => ({ ar: x.ar.trim(), en: x.en.trim() })), at: Date.now() };
            try { await QSAVE(rec); } catch (e) { yes.disabled = false; s.querySelector('.qm').textContent = t.qFail; return; }
            try { localStorage.setItem(QK(), JSON.stringify({ date: info.today, n: n })); } catch (e) { }   /* the number stays for today */
            s.remove(); box.innerHTML = '<div class="qok">✓</div><h4>' + esc(t.qSaved) + '</h4>'; setTimeout(close, 1300);
          };
        });
      }
      function onKey(e) { if (e.key !== 'Escape') return; const s = el.querySelector('.qe'); if (s) s.remove(); else close(); }
      function close() { document.removeEventListener('keydown', onKey); el.remove(); }
      document.addEventListener('keydown', onKey);
      el.addEventListener('click', e => { if (e.target === el) close(); });
      q('.qx').onclick = close; q('.qcn').onclick = close;
      q('.qadd').onclick = () => { items.push({ ar: '', en: '' }); drawRows(); const l = rows.lastElementChild; if (l && l.scrollIntoView) l.scrollIntoView({ block: 'nearest' }); };
      rows.addEventListener('click', e => {
        const p = e.target.closest('.qp'), r = e.target.closest('[data-rm]');
        if (p) edit(+p.dataset.i, p.dataset.s); else if (r) { items.splice(+r.dataset.rm, 1); if (!items.length) items.push({ ar: '', en: '' }); drawRows(); }
      });
      inp.addEventListener('input', ready); sv.onclick = confirmSave; drawRows();
    }

    /* ---- look (scoped to this screen only; colours follow the shell's theme variables) ---- */
    const CSS = `
.vsw{position:relative;height:100%;color:var(--ink);font-family:Cairo,Inter,system-ui,sans-serif}
.vs{position:relative;height:100%;overflow:auto;padding:12px 12px 40px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.vs::-webkit-scrollbar{display:none}
.vsw .card{max-width:1100px;margin:0 auto 20px;padding:16px;border-radius:22px;background:var(--pcard);border:1px solid var(--sbd);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
.vsw .card.msg{text-align:center;color:var(--ink2);padding:36px 16px}
.vsw h4{margin:0 0 6px;font:800 13.5px Cairo,Inter,sans-serif;color:var(--ink)}
.vsw .big{font:800 26px/1.15 Inter,Cairo,sans-serif}.vsw .sm{font:500 12px/1.5 Cairo,Inter,sans-serif;color:var(--ink2)}.vsw .big .sm{font-size:13px}
@keyframes vsIn{from{opacity:0}to{opacity:1}}
.vsw .ov2{position:absolute;inset:0;z-index:25;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.45);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);animation:vsIn .25s ease-out}
#W.light .vsw .ov2{background:rgba(255,255,255,.4)}
.vsw .cmb{position:relative;box-sizing:border-box;width:min(1000px,100%);max-height:100%;overflow:auto;border-radius:24px;padding:18px 14px 14px;background:rgba(15,23,42,.94);color:#e2e8f0;border:1px solid rgba(148,163,184,.25);box-shadow:0 20px 60px rgba(0,0,0,.5);overscroll-behavior:contain;scrollbar-width:none;animation:vsPop .32s cubic-bezier(.2,.9,.3,1.15)}
#W.light .vsw .cmb{background:rgba(255,255,255,.97);color:#0f172a}
.vsw .cmb h4{color:inherit}.vsw .cmb .sm{color:inherit;opacity:.7}
@keyframes vsPop{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:none}}
.vsw .tdx{position:absolute;top:8px;inset-inline-end:10px;z-index:2;width:30px;height:30px;border:0;border-radius:50%;background:rgba(148,163,184,.18);color:inherit;font-size:1.2rem;line-height:1;cursor:pointer}
.vsw .cml{position:relative;overflow:auto;scrollbar-width:none}.vsw .cml::-webkit-scrollbar{display:none}
.vsw .ce{margin:0 0 12px;padding:10px;border-radius:16px;background:rgba(148,163,184,.1)}.vsw .ce .dt{margin-bottom:4px;color:inherit;opacity:.65;font:700 11px Inter,sans-serif;direction:ltr;text-align:start}
.vsw .grid{max-width:1100px;margin:0 auto 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px 10px}.vsw .grid .card{margin:0}
.vsw .lists{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
@media(max-width:600px){.vsw .lists{grid-template-columns:1fr 1fr}.vsw .lists>:first-child{grid-column:1/-1}}
.vsw .earc{min-height:190px;padding:16px 14px 14px;border-radius:28px;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.vsw .earh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}.vsw .earh h4{margin:0;font-size:14.5px}
.vsw .ear{width:38px;height:38px;flex:none;border-radius:50%;border:1px solid var(--gbd);background:var(--chip);color:var(--ink2);display:grid;place-items:center;padding:0;cursor:pointer;transition:background .35s,color .35s,border-color .35s}
.vsw .ear.on{background:rgba(52,211,153,.18);border-color:#34d399;color:#34d399}
.vsw .ear.shk{animation:vsShk .7s ease}.vsw .ear.cls{animation:vsCls .5s ease}
@keyframes vsShk{0%,100%{transform:rotate(0) scale(1)}15%{transform:rotate(-16deg) scale(1.12)}35%{transform:rotate(13deg) scale(1.12)}55%{transform:rotate(-8deg) scale(1.05)}75%{transform:rotate(4deg)}}
@keyframes vsCls{0%{transform:scale(1.1)}100%{transform:scale(1)}}
.vsw .lst{overflow:hidden}
.vsw .cap{display:block;box-sizing:border-box;width:100%;padding:9px 12px;margin:0 0 8px;border-radius:16px;background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.22);text-align:center;font:600 13px Cairo,Inter,sans-serif;color:var(--ink)}
.vsw .cap .dt{display:block;margin-bottom:2px;color:var(--ink2);font:700 12px Inter,sans-serif}.vsw .cap .ct{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vsw .rp,.vsw .rl{margin:0 0 8px;padding:8px 12px;border-radius:12px;background:rgba(148,163,184,.1);font:500 13px/1.7 Cairo,Inter,sans-serif}.vsw .rl{padding-inline-start:30px}
.vsw .vx{cursor:pointer;border-radius:4px;color:#38bdf8}.vsw .vx:hover{background:rgba(56,189,248,.15)}.vsw .alk{color:#38bdf8}.vsw .vb{display:inline-block;width:1px;height:.9em;margin:0 8px;background:currentColor;opacity:.5;vertical-align:middle}
.vsw>.wp{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);width:min(92%,360px);z-index:40;box-sizing:border-box;padding:12px 14px;border-radius:16px;background:rgba(15,23,42,.97);color:#e2e8f0;border:1px solid rgba(148,163,184,.3);box-shadow:0 12px 36px rgba(0,0,0,.45)}
#W.light .vsw>.wp{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.15)}
.wpw{font-weight:700;margin-bottom:8px;text-align:center;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.wpr{display:flex;align-items:center;gap:8px}
.wpb{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:#34d399;color:#06281b;cursor:pointer;display:flex;align-items:center;justify-content:center}
.vsw .wp input[type=range]{flex:1;min-width:0;accent-color:#34d399}.wpt{flex:none;font-size:.68rem;opacity:.75;font-variant-numeric:tabular-nums}.wpn{flex:none;font-size:.68rem;opacity:.6}.wpm{font-size:.82rem;text-align:center;opacity:.85}
.vsw .lists.one{max-width:560px}
.vsw>.qplus{position:absolute;top:14px;right:14px;z-index:6;width:34px;height:34px;padding:0;border-radius:50%;border:1px solid var(--gbd);background:var(--chip);color:var(--ink2);display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:scale .6s var(--ease),color .3s,border-color .3s,box-shadow .3s}
.vsw>.qplus svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;transition:rotate .6s var(--ease)}
@media(hover:hover){.vsw>.qplus:hover{scale:1.1;color:#34d399;border-color:#34d399;box-shadow:0 0 14px rgba(52,211,153,.35)}.vsw>.qplus:hover svg{rotate:90deg}}
.vsw>.qplus:active{scale:.92;transition:scale .3s ease-out}
.vsw .qsb{position:relative;box-sizing:border-box;width:min(520px,100%);max-height:100%;overflow:auto;border-radius:24px;padding:20px 16px 16px;background:#17171a;color:#e2e8f0;border:1px solid rgba(148,163,184,.25);box-shadow:0 20px 60px rgba(0,0,0,.5);overscroll-behavior:contain;scrollbar-width:none;animation:vsPop .32s cubic-bezier(.2,.9,.3,1.15)}
#W.light .vsw .qsb{background:rgba(255,255,255,.97);color:#0f172a}
.vsw .qsb::-webkit-scrollbar{display:none}
.vsw .qsb h4{margin:0 0 4px;font:800 16px Cairo,Inter,sans-serif;color:inherit;text-align:center}
.vsw .qd{text-align:center;font:700 12.5px Cairo,Inter,sans-serif;opacity:.75;margin-bottom:10px}
.vsw .qi{text-align:center;font:700 13.5px Cairo,Inter,sans-serif;margin-bottom:4px}.vsw .qi b{color:#34d399}.vsw .qi.warn{color:#fbbf24}
.vsw .qi2{text-align:center;font:600 11.5px Cairo,Inter,sans-serif;opacity:.6;margin-bottom:10px}
.vsw .qn{display:flex;align-items:center;justify-content:center;gap:10px;margin:8px 0 10px;font:700 12.5px Cairo,Inter,sans-serif}
.vsw .qn input{width:84px;height:38px;border-radius:12px;border:1px solid rgba(148,163,184,.35);background:rgba(148,163,184,.12);color:inherit;text-align:center;font:800 15px Inter,sans-serif;outline:0}.vsw .qn input:focus{border-color:#34d399}
.vsw .qtip{margin:0 0 12px;padding:9px 12px;border-radius:14px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);font:600 12px/1.6 Cairo,Inter,sans-serif;text-align:center}
.vsw .qr{display:flex;align-items:stretch;gap:8px;margin-bottom:8px}
.vsw .qb{flex:none;align-self:center;width:26px;height:26px;border-radius:50%;border:1px solid rgba(52,211,153,.6);display:flex;align-items:center;justify-content:center;font:800 12px Inter,sans-serif;color:#34d399}
.vsw .qf{flex:1;min-width:0;display:grid;grid-template-columns:1fr 1fr;border-radius:16px;border:1px solid rgba(148,163,184,.35);background:rgba(148,163,184,.1);overflow:hidden}
.vsw .qp{min-height:46px;padding:10px 12px;border:0;background:transparent;color:inherit;opacity:.55;font:600 13px/1.5 Cairo,Inter,sans-serif;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .3s,opacity .3s}
.vsw .qp.has{opacity:1;font-weight:700}.vsw .qp+.qp{border-left:1px solid rgba(148,163,184,.35)}
@media(hover:hover){.vsw .qp:hover{background:rgba(148,163,184,.16)}}
.vsw .qrm{flex:none;align-self:center;width:26px;height:26px;padding:0;border:0;border-radius:50%;background:rgba(148,163,184,.18);color:inherit;cursor:pointer;font-size:15px;line-height:1}
.vsw .qadd{display:block;width:100%;height:40px;margin:4px 0 12px;border-radius:14px;border:1.5px dashed rgba(148,163,184,.45);background:transparent;color:inherit;font:700 13px Cairo,Inter,sans-serif;cursor:pointer}
.vsw .qact{display:flex;flex-direction:column;gap:8px}
.vsw .qbtn{height:42px;border-radius:14px;border:0;font:800 13.5px Cairo,Inter,sans-serif;cursor:pointer;background:#34d399;color:#06281b}.vsw .qbtn.g{background:rgba(148,163,184,.18);color:inherit}.vsw .qbtn:disabled{opacity:.35;cursor:default}
.vsw .qe{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:vsIn .2s ease-out}
.vsw .qeb{width:min(420px,100%);box-sizing:border-box;padding:18px 16px 14px;border-radius:20px;background:#1f1f24;color:#e2e8f0;border:1px solid rgba(148,163,184,.25);box-shadow:0 16px 44px rgba(0,0,0,.5);animation:vsPop .3s cubic-bezier(.2,.9,.3,1.15)}
#W.light .vsw .qeb{background:#fff;color:#0f172a}
.vsw .qeb h5{margin:0 0 10px;font:800 13.5px Cairo,Inter,sans-serif;text-align:center}
.vsw .qeb textarea{width:100%;box-sizing:border-box;min-height:84px;padding:11px 12px;border-radius:14px;border:1px solid rgba(148,163,184,.35);background:rgba(148,163,184,.1);color:inherit;font:600 15px/1.5 Cairo,Inter,sans-serif;outline:0;resize:none}.vsw .qeb textarea:focus{border-color:#34d399}
.vsw .qeb p{margin:0 0 14px;text-align:center;font:700 14px/1.7 Cairo,Inter,sans-serif}.vsw .qeb .qact{margin-top:12px}.vsw .qeb p+.qact{margin-top:0}
.vsw .qm{min-height:18px;margin-top:8px;text-align:center;color:#f87171;font:600 12px Cairo,Inter,sans-serif}
.vsw .qok{width:54px;height:54px;margin:8px auto 10px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(52,211,153,.18);color:#34d399;font-size:28px}
.vsw .lists.stack{display:flex;flex-direction:column;gap:20px;width:100%;max-width:560px;margin:auto}
.vsw .lists.stack>.card{width:100%;margin:0}
.vs:has(>.lists.stack){display:flex;flex-direction:column}
.vsw .sm{font:500 12px/1.5 Cairo,Inter,system-ui,sans-serif;color:var(--ink2)}`;

    function render(b) {
      stop();
      b.innerHTML = '<style>' + CSS + defs().map(d => d.css || '').join('') + '</style><div class="vsw"><div class="vs"></div></div>';
      wrap = b.querySelector('.vsw'); root = b.querySelector('.vs'); lastLang = lg();
      if (keys.indexOf('qol') > -1) qolPlus();   /* the "+" exists only on Your Dictionary */
      wrap.addEventListener('click', e => {
        const q = s => (e.target.closest ? e.target.closest(s) : null);
        let x;
        if ((x = q('.ear'))) {   /* turn the pronunciation on (green + a little shake) or off */
          e.stopPropagation(); const k = x.dataset.ear, on = !earOn(k); earSet(k, on); if (on) preloadRec();
          x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); x.classList.remove('shk', 'cls'); void x.offsetWidth; x.classList.add(on ? 'shk' : 'cls'); setTimeout(() => x.classList.remove('shk', 'cls'), 1100); return;
        }
        if ((x = q('.vx'))) { e.preventDefault(); wpOpen(x.dataset.word, x.dataset.url); return; }
        if ((x = q('.scrv'))) { x.classList.toggle('scrz'); return; }
        if (q('.cm')) { if (q('.cmx') || !q('.cmb')) closeCm(); else if (!q('.wp')) wpClose(); return; }
        if ((x = q('.earc'))) { const c = q('.cap'); openCm(x.dataset.key, c ? +c.dataset.n : 0); return; }
        if (!q('.wp')) wpClose();
      });
      wrap.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeCm(); return; }
        if (e.key !== 'Enter' && e.key !== ' ') return; const x = e.target.closest && e.target.closest('.vx'); if (x) { e.preventDefault(); wpOpen(x.dataset.word, x.dataset.url); }
      });
      onResize = () => fitCaps(); window.addEventListener('resize', onResize);
      try { const W = ctx.W; if (W && window.MutationObserver) { mo = new MutationObserver(() => { if (lg() !== lastLang) { lastLang = lg(); paint(); } }); mo.observe(W, { attributes: true, attributeFilter: ['dir', 'class'] }); } } catch (e) { }
      if (D) { paint(); load(true); } else load();   /* cached data shows at once, fresh data replaces it quietly */
    }
    function stop() {
      closeCm(); wpClose();
      if (onResize) { window.removeEventListener('resize', onResize); onResize = null; }
      if (mo) { mo.disconnect(); mo = null; } wrap = null; root = null; loadId++;
    }
    return { render: render, stop: stop, full: function () { return true; } };
    }
  };
})();
