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
      photoT: 'Send a photo of your writing', photoB: 'Upload photo', thanks: 'Thank you!', thanks2: 'You can open anything else now.', more: 'I want more', mistake: 'I did this by mistake', nomind: 'No problem, thank you anyway.', libEmpty: 'No photos yet.', libNote: 'Photos stay here for this session.', bad: 'Could not read the photo. Please try again.', menu: 'Menu', sPhotos: 'Photos', sAudio: 'Audio', sPass: 'Passages', sLinks: 'Links', audEmpty: 'No audio clips yet.', tabMsg: 'Messenger recordings', tabTask: 'Task recordings', taskEmpty: 'No task recordings yet.', sessN: 'Mirror session #', passEmpty: 'No passages yet.', linkEmpty: 'No links yet.', tabPhTask: 'Task photos', tabPhMsg: 'Messenger photos', tabLater: 'Later', laterMsg: 'Available here later.', phMsgEmpty: 'No messenger photos yet.', libDel: 'Remove' },
    ar: { passage: 'القطعة', word: 'كلمة بكلمة', hint: 'اضغط على أي كلمة لتسمعها، ثم اكتب ما تسمعه بالضبط.', ph: 'اكتب هنا ما تسمعه…', done: 'أنهيت', loading: 'نجهّز لك النص…',
      photoT: 'أرسل صورة لما كتبته', photoB: 'رفع صورة', thanks: 'شكرًا لك!', thanks2: 'يمكنك الآن فتح أي شيء آخر.', more: 'أريد المزيد', mistake: 'فتحتها بالخطأ', nomind: 'لا مشكلة، شكرًا لك على كل حال.', libEmpty: 'لا توجد صور بعد.', libNote: 'تبقى الصور هنا خلال هذه الجلسة.', bad: 'تعذّرت قراءة الصورة. حاول مرة أخرى.', menu: 'القائمة', sPhotos: 'الصور', sAudio: 'مقاطع صوتية', sPass: 'القطع', sLinks: 'الروابط', audEmpty: 'لا توجد مقاطع صوتية بعد.', tabMsg: 'تسجيلات المرسال', tabTask: 'تسجيلات المهام', taskEmpty: 'لا توجد تسجيلات مهام بعد.', sessN: 'جلسة مماراة رقم', passEmpty: 'لا توجد قطع بعد.', linkEmpty: 'لا توجد روابط بعد.', tabPhTask: 'صور المهام', tabPhMsg: 'صور المرسال', tabLater: 'لاحقًا', laterMsg: 'هيتوفر هنا لاحقًا.', phMsgEmpty: 'لا توجد صور من المرسال بعد.', libDel: 'إزالة' }
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
async function startTask(more) {
    const all = await dictWords(), pick = [];
    while (pick.length < DICT.count && all.length) pick.push(all.splice(Math.floor(Math.random() * all.length), 1)[0]);
    pick.forEach((x, n) => { x.p = n === pick.length - 1 ? '.' : ((n === 2 || n === 5) ? ',' : ''); });
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
    const T = DT[thx.L], card = el => { b.innerHTML = '<div class="pcard dpc">' + el + '</div>'; return b.firstChild; };
    if (t.stage === 'photo') {
      const c = card('<div class="dmsg big">' + T.photoT + '</div><label class="btn dup">' + T.photoB + '<input type="file" accept="image/*" hidden></label>');
      c.querySelector('input').onchange = e => {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        t.done = true; t.stage = 'thanks'; thx.MOD.library.passSave(t, true); dictSave(t); drawDict(b, t);   /* thanks at once, the saving happens quietly */
        savePhoto(f).then(ok => { if (!ok) toast(T.bad); });
      }; return;
    }
    if (t.stage === 'thanks') {
      const c = card('<div class="dmsg big">' + T.thanks + '</div><div class="dmsg">' + T.thanks2 + '</div><button class="btn dmore" type="button">' + T.more + '</button>');
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
function savePhoto(file) {
    return new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => { const im = new Image(); im.onload = () => {
        const s = Math.min(1, 1000 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s);
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        const d = cv.toDataURL('image/jpeg', .7);
        try { const a = JSON.parse(localStorage.getItem(DICT.photos) || '[]'); a.unshift({ d, at: Date.now() }); a.length = Math.min(a.length, 12); for (;;) { try { localStorage.setItem(DICT.photos, JSON.stringify(a)); break; } catch (e) { if (!a.length) break; a.pop(); } } } catch (e) { }
        res(true); }; im.onerror = () => res(false); im.src = fr.result; };
      fr.onerror = () => res(false); fr.readAsDataURL(file);
    });
  }
function toast(m) { const d = document.createElement('div'); d.className = 'dtoast'; d.textContent = m; thx.W.appendChild(d); setTimeout(() => d.remove(), 3500); }

    /* ---- اللي index.html والملفات التانية بتستخدمه من الزرار ده ---- */
    return {
      id: 'dict', render: function (b) { b.innerHTML = ''; renderDict(b); },
      get DICT() { return DICT; },
      get DT() { return DT; },
      get updBadge() { return updBadge; }
    };
  };
})();
