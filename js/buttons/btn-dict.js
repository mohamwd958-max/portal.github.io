/* =====================================================================
   SIDEBAR BUTTON: dict
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + مساعد الإملاء كله + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-dict.js"></script>
   و index.html بينده عليه بـ thx = كل الأدوات المشتركة اللي بيدّيها index.html (R, W, L, STR, esc, MOD, openLayer ...)
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.dict = function (thx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 6.5h4M10 10h4M10 13.5h4"/>';
    thx.IC.dict = ICON;
    thx.STR.en.i_dict = 'Dictation Assistant'; thx.STR.ar.i_dict = 'مساعد الإملاء';

    /* ---- the screen: الكود اتنقل من index.html زي ما هو (مساعد الإملاء) ---- */
/* ================= Dictation Pal + Library ================= */
  const DICT = { bucket: 'words-and-passages', prefix: '', count: 10, key: 'thDictTask', photos: 'thDictPhotos' };   /* <- bucket / folder of the word recordings */

  const DFALL = 'time people water light house green music river paper garden window summer story friend market bridge cloud dream school morning'.split(' ');
const DT = {
    en: { passage: 'Passage', word: 'Word by word', hint: 'Tap a word to hear it, then write exactly what you hear.', ph: 'Write what you hear here…', done: "I'm done", loading: 'Preparing your text…',
      photoT: 'Send a photo of your writing', photoB: 'Upload photo', thanks: 'Thank you!', thanks2: 'You can open anything else now.', more: 'I want more', mistake: 'I did this by mistake', nomind: 'No problem, thank you anyway.', libEmpty: 'No photos yet.', libNote: 'Photos stay here for this session.', bad: 'Could not read the photo. Please try again.', menu: 'Menu', sPhotos: 'Photos', sAudio: 'Audio', sPass: 'Passages', sLinks: 'Links', audEmpty: 'No audio clips yet.', tabMsg: 'Messenger recordings', tabTask: 'Task recordings', taskEmpty: 'No task recordings yet.', sessN: 'Mirror session #', passEmpty: 'No passages yet.', linkEmpty: 'No links yet.', tabPhTask: 'Task photos', tabPhMsg: 'Messenger photos', tabLater: 'Later', laterMsg: 'Available here later.', phMsgEmpty: 'No messenger photos yet.', libDel: 'Remove', dsT: 'Dictation session #', dsPlus: 'New dictation session', dsSub: 'Upload a photo or write your text, then save.', dsPhoto: 'Upload photo', dsWrite: 'Write it', dsPick: 'Tap to choose a photo', dsWph: 'Write your text here…', dsSave: 'Save', dsCancel: 'Cancel', dsSaved: 'Saved as' },
    ar: { passage: 'القطعة', word: 'كلمة بكلمة', hint: 'اضغط على أي كلمة لتسمعها، ثم اكتب ما تسمعه بالضبط.', ph: 'اكتب هنا ما تسمعه…', done: 'أنهيت', loading: 'نجهّز لك النص…',
      photoT: 'أرسل صورة لما كتبته', photoB: 'رفع صورة', thanks: 'شكرًا لك!', thanks2: 'يمكنك الآن فتح أي شيء آخر.', more: 'أريد المزيد', mistake: 'فتحتها بالخطأ', nomind: 'لا مشكلة، شكرًا لك على كل حال.', libEmpty: 'لا توجد صور بعد.', libNote: 'تبقى الصور هنا خلال هذه الجلسة.', bad: 'تعذّرت قراءة الصورة. حاول مرة أخرى.', menu: 'القائمة', sPhotos: 'الصور', sAudio: 'مقاطع صوتية', sPass: 'القطع', sLinks: 'الروابط', audEmpty: 'لا توجد مقاطع صوتية بعد.', tabMsg: 'تسجيلات المرسال', tabTask: 'تسجيلات المهام', taskEmpty: 'لا توجد تسجيلات مهام بعد.', sessN: 'جلسة مماراة رقم', passEmpty: 'لا توجد قطع بعد.', linkEmpty: 'لا توجد روابط بعد.', tabPhTask: 'صور المهام', tabPhMsg: 'صور المرسال', tabLater: 'لاحقًا', laterMsg: 'هيتوفر هنا لاحقًا.', phMsgEmpty: 'لا توجد صور من المرسال بعد.', libDel: 'إزالة', dsT: 'جلسة إملاء رقم ', dsPlus: 'جلسة إملاء جديدة', dsSub: 'ارفع صورة أو اكتب نصك، ثم اضغط حفظ.', dsPhoto: 'رفع صورة', dsWrite: 'كتابة', dsPick: 'اضغط لاختيار صورة', dsWph: 'اكتب نصك هنا…', dsSave: 'حفظ', dsCancel: 'إلغاء', dsSaved: 'تم الحفظ باسم' }
  };
const dictLoad = () => { try { return JSON.parse(localStorage.getItem(DICT.key) || 'null'); } catch (e) { return null; } };
function setBd(k, on) { const it = thx.R.querySelector('.sdi[data-k="' + k + '"]'); if (!it) return; let bd = it.querySelector('.sdbd'); if (on && !bd) { bd = document.createElement('b'); bd.className = 'sdbd'; bd.textContent = '1'; it.appendChild(bd); } else if (!on && bd) bd.remove(); }
function updBadge() { const t = dictLoad(), a = !!(t && !t.done), m = thx.MOD.mirror.mirIsOpen(); setBd('dict', a); setBd('mirror', m); thx.sbDot.base = a || m; thx.sbDot(); }
function dictSave(t) { try { t ? localStorage.setItem(DICT.key, JSON.stringify(t)) : localStorage.removeItem(DICT.key); } catch (e) { } updBadge(); }
/* audio: every word is preloaded when the text is made, so a tap plays at once (a spoken-voice fallback is used if a recording is missing) */
  const aud = {};
const prep = ts => ts.forEach(x => { if (x.url && !aud[x.url]) { const a = new Audio(x.url); a.preload = 'auto'; aud[x.url] = a; } });
function tts(w) { try { const u = new SpeechSynthesisUtterance(w); u.lang = 'en-US'; u.rate = .9; speechSynthesis.speak(u); } catch (e) { } }
function say(x) {
    try { speechSynthesis.cancel(); } catch (e) { }
    Object.values(aud).forEach(a => { try { a.pause(); } catch (e) { } });
    const a = x.url && aud[x.url];
    if (!a) return tts(x.w);
    try { a.currentTime = 0; } catch (e) { }
    const p = a.play(); if (p && p.catch) p.catch(() => tts(x.w));
  }
async function dictWords() {
    try {
      const r = await fetch(REPORT_SUPABASE_URL + '/storage/v1/object/list/' + DICT.bucket, { method: 'POST', headers: sbHeaders(), body: JSON.stringify({ prefix: DICT.prefix, limit: 1000, offset: 0 }) });
      if (r.ok) {
        const j = await r.json();
        const out = (j || []).filter(f => f && f.name && /\.(mp3|wav|ogg|m4a|aac)$/i.test(f.name)).map(f => ({
          w: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim(),
          url: REPORT_SUPABASE_URL + '/storage/v1/object/public/' + DICT.bucket + '/' + (DICT.prefix ? DICT.prefix + '/' : '') + encodeURIComponent(f.name) })).filter(x => x.w && x.w.indexOf(' ') < 0);
        if (out.length >= DICT.count) return out;
      }
    } catch (e) { }
    return DFALL.map(w => ({ w, url: '' }));
  }
/* how many words: the number the trainer typed in the admin panel for the Dictation task (latest active one), else the default */
async function dictTaskCount() {
    try {
      const tk = localStorage.getItem('thabit_trainee_token'); if (!tk) return null;
      const r = await fetch(REPORT_SUPABASE_URL + '/rest/v1/rpc/trainee_tool_tasks', { method: 'POST', headers: sbHeaders(), body: JSON.stringify({ p_token: tk }) });
      const j = await r.json();
      const l = (Array.isArray(j) ? j : []).filter(x => x && x.tool === 'dict' && x.words).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
      return l.length ? Number(l[0].words) : null;
    } catch (e) { return null; }
  }
/* the words come from the database (words_table): only entries that really have a recording */
async function dictBank() {
    try {
      const r = await fetch(REPORT_SUPABASE_URL + '/rest/v1/words_table?select=word,audio_url&audio_url=not.is.null&limit=2000', { headers: sbHeaders() });
      if (r.ok) { const j = await r.json(); return (j || []).filter(x => x && x.word && x.audio_url).map(x => ({ w: String(x.word).trim(), url: x.audio_url })); }
    } catch (e) { }
    return [];
  }
async function startTask(more) {
    const [rows, want] = await Promise.all([dictBank(), dictTaskCount()]), N = want || DICT.count;
    const norm = s => String(s).toLowerCase().replace(/[^a-z0-9'’-]/g, ''), PU = /[.,;:!?]+$/;
    const singles = rows.filter(x => !/\s/.test(x.w)), map = new Map(); singles.forEach(x => { const k = norm(x.w); if (k && !map.has(k)) map.set(k, x); });
    /* first choice: a real sentence from the database with exactly N words, every word having its own recording */
    const sent = rows.filter(x => /\s/.test(x.w)).map(x => { const ws = x.w.split(/\s+/), tk = ws.map(w => { const s = map.get(norm(w)); return s ? { w: w.replace(PU, ''), url: s.url, p: (w.match(PU) || [''])[0] } : null; }); return tk.length === N && tk.every(Boolean) ? tk : null; }).filter(Boolean);
    let pick = [];
    if (sent.length) { pick = sent[Math.floor(Math.random() * sent.length)]; if (!pick[pick.length - 1].p) pick[pick.length - 1].p = '.'; }
    else {
      const all = singles.slice();
      while (pick.length < N && all.length) pick.push(Object.assign({}, all.splice(Math.floor(Math.random() * all.length), 1)[0]));
      if (pick.length < N) { const f = DFALL.filter(w => !pick.some(x => x.w === w)); while (pick.length < N && f.length) pick.push({ w: f.shift(), url: '' }); }
      pick.forEach((x, n) => { x.p = n === pick.length - 1 ? '.' : ((n === 2 || n === 5) ? ',' : ''); });
    }
    prep(pick);
    dictSave({ n: thx.MOD.library.passNext(), tokens: pick, mode: 'passage', i: 0, stage: 'work', more: !!more, text: '', done: false });
  }
async function renderDict(b) {
    const T = DT[thx.L]; let t = dictLoad();
    if (!t || t.done) { b.innerHTML = '<div class="pcard dpc"><div class="dmsg">' + T.loading + '</div></div>'; await startTask(false); t = dictLoad(); if (thx.cur !== 'dict' || !b.isConnected) return; }
    else prep(t.tokens);
    drawDict(b, t);
  }
function drawDict(b, t) {
    const T = DT[thx.L], card = el => { b.innerHTML = '<div class="pcard dpc">' + el + '</div>'; addPlus(b); return b.firstChild; };
    if (t.stage === 'photo') {
      const c = card('<div class="dmsg big">' + T.photoT + '</div><label class="btn dup">' + T.photoB + '<input type="file" accept="image/*" hidden></label>');
      c.querySelector('input').onchange = e => {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        t.done = true; t.stage = 'thanks'; thx.MOD.library.passSave(t, true); dictSave(t); drawDict(b, t);   /* thanks at once, the saving happens quietly */
        savePhoto(f).then(ok => { if (!ok) toast(T.bad); });
      }; return;
    }
    if (t.stage === 'thanks') {
      const real = (t.tokens || []).map(x => x.w + (x.p || '')).join(' '), c = card('<div class="dmsg big">' + T.thanks + '</div>' + (real ? '<div class="dmsg" dir="ltr" style="font-weight:700;opacity:.9">' + thx.esc(real) + '</div>' : '') + '<div class="dmsg">' + T.thanks2 + '</div><button class="btn dmore" type="button">' + T.more + '</button>');
      c.querySelector('.dmore').onclick = async () => { await startTask(true); if (thx.cur === 'dict' && b.isConnected) drawDict(b, dictLoad()); }; return;
    }
    if (t.stage === 'nomind') { card('<div class="dmsg big">' + T.nomind + '</div>'); return; }
    const m = t.mode, tk = t.tokens;
    let stage;
    if (m === 'passage') stage = '<div class="dpas">' + tk.map((x, n) => '<span class="dw" data-n="' + n + '"><i>' + thx.esc(x.w) + '</i></span>' + (x.p ? '<span class="dpn">' + x.p + '</span>' : '')).join(' ') + '</div>';
    else { const x = tk[t.i]; stage = '<div class="dsw"><button class="dar" id="dPrev" type="button"' + (t.i ? '' : ' disabled') + '>&#8249;</button><div class="dwb"><span class="dw big" data-n="' + t.i + '"><i>' + thx.esc(x.w) + '</i></span>' + (x.p ? '<span class="dpn big">' + x.p + '</span>' : '') + '</div><button class="dar" id="dNext" type="button"' + (t.i < tk.length - 1 ? '' : ' disabled') + '>&#8250;</button></div><div class="dcnt">' + (t.i + 1) + ' / ' + tk.length + '</div>'; }
    const c = card('<div class="dnum">' + T.passage + (t.n ? ' #' + t.n : '') + '</div><div class="dtabs"><button type="button" data-m="passage" class="' + (m === 'passage' ? 'on' : '') + '">' + T.passage + '</button><button type="button" data-m="word" class="' + (m === 'word' ? 'on' : '') + '">' + T.word + '</button></div><div class="dhint">' + T.hint + '</div><div class="dmid">' + stage + '</div>' +
      '<textarea class="dta" rows="3" placeholder="' + T.ph + '" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" enterkeyhint="done"></textarea><div class="dact">' + (t.more ? '<button type="button" class="dmis">' + T.mistake + '</button>' : '') + '<button class="btn dfin" type="button">' + T.done + '</button></div>');
    const ta = c.querySelector('.dta'); c.classList.add('ddict'); ta.value = t.text || ''; let pv0 = ta.value;
    /* typing only: no paste, no drop, no suggestion/auto-correct inserts (more than one character at once is undone) */
    const BLK = /^(insertFromPaste|insertFromDrop|insertFromYank|insertFromPasteAsQuotation|insertReplacementText|insertTranspose|historyUndo|historyRedo)$/;
    ta.addEventListener('beforeinput', e => { const k = e.inputType || ''; if (BLK.test(k) || (k === 'insertText' && e.data && e.data.length > 1)) e.preventDefault(); });
    ['paste', 'drop', 'dragover'].forEach(ev => ta.addEventListener(ev, e => e.preventDefault()));
    ta.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && /^[vyz]$/i.test(e.key)) e.preventDefault(); });
    ta.oninput = () => { if (ta.value.length - pv0.length > 1) ta.value = pv0; pv0 = ta.value; t.text = ta.value; dictSave(t); };
    c.querySelectorAll('.dtabs button').forEach(bt => bt.onclick = () => { t.mode = bt.dataset.m; dictSave(t); drawDict(b, t); });
    const go = d => { const n = t.i + d; if (n < 0 || n >= tk.length) return; t.i = n; dictSave(t); drawDict(b, t); say(tk[n]); };
    c.addEventListener('click', e => { const w = e.target.closest('.dw'); if (w && !c._drag) say(tk[+w.dataset.n]); });
    const pv = c.querySelector('#dPrev'), nx = c.querySelector('#dNext'); if (pv) pv.onclick = () => go(-1); if (nx) nx.onclick = () => go(1);
    const wb = c.querySelector('.dwb');
    if (wb) { let x0 = null; wb.addEventListener('pointerdown', e => { x0 = e.clientX; c._drag = false; }); wb.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) { c._drag = true; go(dx < 0 ? 1 : -1); } }); wb.addEventListener('pointercancel', () => { x0 = null; }); }   /* swipe right-to-left = next */
    c.querySelector('.dfin').onclick = () => {
      if ((t.text || '').trim()) { t.done = true; t.stage = 'thanks'; thx.MOD.library.passSave(t, false); }   /* wrote it: no photo needed */
      else t.stage = 'photo';                                                                   /* wrote nothing: a photo is a must */
      dictSave(t); drawDict(b, t);
    };
    const ms = c.querySelector('.dmis'); if (ms) ms.onclick = () => { dictSave(null); drawDict(b, { stage: 'nomind' }); };
  }
function savePhoto(file, meta) {
    return new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => { const im = new Image(); im.onload = () => {
        const s = Math.min(1, 1000 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s);
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        const d = cv.toDataURL('image/jpeg', .7);
        try { const a = JSON.parse(localStorage.getItem(DICT.photos) || '[]'); a.unshift(Object.assign({ d, at: Date.now() }, meta || {})); a.length = Math.min(a.length, 12); for (;;) { try { localStorage.setItem(DICT.photos, JSON.stringify(a)); break; } catch (e) { if (!a.length) break; a.pop(); } } } catch (e) { }
        res(true); }; im.onerror = () => res(false); im.src = fr.result; };
      fr.onerror = () => res(false); fr.readAsDataURL(file);
    });
  }
function toast(m) { const d = document.createElement('div'); d.className = 'dtoast'; d.textContent = m; thx.W.appendChild(d); setTimeout(() => d.remove(), 3500); }


    /* ---- "+" : a new dictation session. The person uploads a photo OR writes the text by hand, then saves.
       The name ("Dictation session #N") is made automatically from the last saved number + 1, and the saved item keeps that same name. ---- */
    (function () {
      const st = document.createElement('style'); st.id = 'thDictPlusCss';
      st.textContent = `
        #lbody>.dplus{position:absolute;top:14px;right:14px;z-index:3;width:34px;height:34px;padding:0;border-radius:50%;border:1px solid var(--gbd);background:var(--chip);color:var(--ink2);display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:scale .6s var(--ease),color .3s,border-color .3s,box-shadow .3s}
        #lbody>.dplus svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;transition:rotate .6s var(--ease)}
        @media(hover:hover){#lbody>.dplus:hover{scale:1.1;color:#34d399;border-color:#34d399;box-shadow:0 0 14px rgba(52,211,153,.35)}#lbody>.dplus:hover svg{rotate:90deg}}
        #lbody>.dplus:active{scale:.92;transition:scale .3s ease-out}
        .dsov{z-index:90}
        .dsp{max-height:calc(100dvh - 40px);overflow-y:auto;scrollbar-width:none}.dsp::-webkit-scrollbar{display:none}
        .dsp h3{font:800 18px Cairo,Inter,sans-serif;margin:0 0 4px;color:#34d399}
        .dsp .dtabs{margin:0 0 14px}
        .dsdrop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:150px;padding:18px;border:1.5px dashed var(--gbd);border-radius:18px;background:var(--gfield);color:var(--ink2);font:700 13px Cairo,Inter,sans-serif;cursor:pointer;overflow:hidden;transition:border-color .3s,color .3s}
        .dsdrop:hover{border-color:#34d399;color:var(--ink)}
        .dsdrop svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
        .dsdrop img{display:none;max-width:100%;max-height:190px;border-radius:12px;object-fit:contain}
        .dsdrop.has{border-style:solid;padding:10px}.dsdrop.has img{display:block}.dsdrop.has svg,.dsdrop.has span{display:none}
        .dsp .dta{min-height:150px;direction:inherit;unicode-bidi:plaintext;text-align:start}
        .dsp .dsact{display:flex;flex-direction:column;gap:10px;margin-top:16px}
        .dsp .btn:disabled{opacity:.35;cursor:default;scale:1}`;
      thx.R.appendChild(st);
    })();
    function sessName(n) { return DT[thx.L].dsT + n; }
    function sessNext() {
      let m = thx.MOD.library.passNext() - 1;                                   /* last saved passage / session number */
      try { JSON.parse(localStorage.getItem(DICT.photos) || '[]').forEach(x => { if (x.n > m) m = x.n; }); } catch (e) { }
      const t = dictLoad(); if (t && !t.done && t.n > m) m = t.n;               /* a text still in progress keeps its number */
      return m + 1;
    }
    function addPlus(b) {
      const T = DT[thx.L], p = document.createElement('button'); p.type = 'button'; p.className = 'dplus'; p.title = T.dsPlus; p.setAttribute('aria-label', T.dsPlus);
      p.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'; p.onclick = openSess; b.appendChild(p);
    }
    function openSess() {
      if (thx.W.querySelector('.dsov')) return;
      const T = DT[thx.L], n = sessNext(), name = sessName(n), ov = document.createElement('div'); ov.className = 'ov dsov on';
      ov.innerHTML = '<div class="pop dsp" role="dialog" aria-modal="true"><h3>' + thx.esc(name) + '</h3><p>' + T.dsSub + '</p>' +
        '<div class="dtabs"><button type="button" data-m="photo" class="on">' + T.dsPhoto + '</button><button type="button" data-m="write">' + T.dsWrite + '</button></div>' +
        '<label class="dsdrop"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V5M7.5 9.5 12 5l4.5 4.5"/><path d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15"/></svg><span>' + T.dsPick + '</span><img alt=""><input type="file" accept="image/*" hidden></label>' +
        '<textarea class="dta" rows="6" placeholder="' + T.dsWph + '" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false"></textarea>' +
        '<div class="dsact"><button class="btn dsave" type="button" disabled>' + T.dsSave + '</button><button class="btn ghost dscan" type="button">' + T.dsCancel + '</button></div></div>';
      thx.W.appendChild(ov);
      const q = s => ov.querySelector(s), drop = q('.dsdrop'), im = q('.dsdrop img'), inp = q('input'), ta = q('.dta'), sv = q('.dsave');
      let mode = 'photo', file = null, url = null;
      const ready = () => { sv.disabled = !(mode === 'photo' ? file : ta.value.trim()); };
      const show = () => {
        drop.style.display = mode === 'photo' ? '' : 'none'; ta.style.display = mode === 'write' ? '' : 'none';
        ov.querySelectorAll('.dtabs button').forEach(x => x.classList.toggle('on', x.dataset.m === mode)); ready();
      };
      function onKey(e) { if (e.key === 'Escape') close(); }
      function close() { document.removeEventListener('keydown', onKey); if (url) { try { URL.revokeObjectURL(url); } catch (e) { } } ov.remove(); }
      document.addEventListener('keydown', onKey);
      ov.addEventListener('click', e => { if (e.target === ov) close(); });
      q('.dscan').onclick = close;
      ov.querySelectorAll('.dtabs button').forEach(x => x.onclick = () => { mode = x.dataset.m; show(); if (mode === 'write') ta.focus(); });
      inp.onchange = e => {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        if (url) { try { URL.revokeObjectURL(url); } catch (x) { } }
        file = f; url = URL.createObjectURL(f); im.src = url; drop.classList.add('has'); ready();
      };
      /* typing only, same rule as the dictation text box: no paste / drop / auto-inserted suggestions */
      const BLK = /^(insertFromPaste|insertFromDrop|insertFromYank|insertFromPasteAsQuotation|insertReplacementText|insertTranspose|historyUndo|historyRedo)$/;
      ta.addEventListener('beforeinput', e => { const k = e.inputType || ''; if (BLK.test(k) || (k === 'insertText' && e.data && e.data.length > 1)) e.preventDefault(); });
      ['paste', 'drop', 'dragover'].forEach(ev => ta.addEventListener(ev, e => e.preventDefault()));
      ta.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && /^[vyz]$/i.test(e.key)) e.preventDefault(); });
      ta.addEventListener('input', ready);
      sv.onclick = async () => {
        sv.disabled = true;
        if (mode === 'photo') { const ok = await savePhoto(file, { n, s: 1 }); if (!ok) { toast(T.bad); ready(); return; } }   /* photo -> Media Library > Photos (with its name) */
        thx.MOD.library.passAdd(n, mode === 'write' ? ta.value.trim() : '', mode === 'photo');                               /* every session -> Media Library > Passages (with its name) */
        close(); toast(T.dsSaved + ' ' + name);
      };
      show();
    }

    /* ---- اللي index.html والملفات التانية بتستخدمه من الزرار ده ---- */
    return {
      id: 'dict', render: function (b) { b.innerHTML = ''; renderDict(b); },
      get DICT() { return DICT; },
      get DT() { return DT; },
      get updBadge() { return updBadge; },
      get sessName() { return sessName; }
    };
  };
})();
