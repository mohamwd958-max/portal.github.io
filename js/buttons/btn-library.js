/* =====================================================================
   SIDEBAR BUTTON: library
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + المكتبة كلها + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/ (جنب index.html)، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/btn-library.js"></script>
   و index.html بينده عليه بـ thx = كل الأدوات المشتركة اللي بيدّيها index.html (R, W, L, STR, esc, MOD, openLayer ...)
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.library = function (thx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v17H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H13v17h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>';
    thx.IC.library = ICON;
    thx.STR.en.i_library = 'Media Library'; thx.STR.ar.i_library = 'مكتبة الوسائط';

    /* ---- the screen: الكود اتنقل من index.html زي ما هو (المكتبة) ---- */
/* ---- numbered passages (kept in the library) ---- */
  const PASS_KEY = 'thDictPass';
const passList = () => { try { return JSON.parse(localStorage.getItem(PASS_KEY) || '[]') || []; } catch (e) { return []; } };
const passNext = () => Math.max(passList().reduce((m, p) => Math.max(m, p.n || 0), 0), (DB.items || []).reduce((m, x) => Math.max(m, x.n || 0), 0)) + 1;
function passSave(t, photo) {
    if (!t || !t.tokens) return;
    const a = passList().filter(p => p.n !== t.n);
    a.push({ n: t.n || (a.length + 1), text: t.tokens.map(x => x.w + (x.p || '')).join(' '), answer: t.text || '', photo: !!photo, at: Date.now(), sy: 0 });
    a.sort((x, y) => x.n - y.n);
    try { localStorage.setItem(PASS_KEY, JSON.stringify(a)); } catch (e) { }
    libSync();
  }
/* a session made with the "+" button in the dictation page (photo or hand-written text), kept under its own number */
function passAdd(n, answer, photo) {
    const a = passList().filter(p => p.n !== n);
    a.push({ n, text: '', answer: answer || '', photo: !!photo, manual: true, at: Date.now(), sy: 0 });
    a.sort((x, y) => x.n - y.n);
    try { localStorage.setItem(PASS_KEY, JSON.stringify(a)); } catch (e) { }
    libSync();
  }

/* ================= Supabase storage for the library (table media_library + bucket "library"; everything goes through token RPCs) =================
   Local copies (localStorage / IndexedDB) are only a quick cache and an offline queue: whatever is not on the server yet is sent by libSync(). */
const PH_KEY = 'thDictPhotos';
const lTok = () => { try { return localStorage.getItem('thabit_trainee_token'); } catch (e) { return null; } };
const lRpc = (fn, body) => fetch(REPORT_SUPABASE_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: sbHeaders(), body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
const pubUrl = path => REPORT_SUPABASE_URL + '/storage/v1/object/public/library/' + path;
let DB = { tid: null, items: [], t: 0 };
async function dbLoad(force) {
    if (!force && DB.tid && Date.now() - DB.t < 15000) return DB;
    const tk = lTok(); if (!tk) throw new Error('no token');
    const j = await lRpc('trainee_lib_list', { p_token: tk });
    if (!j || !j.tid) throw new Error('auth');
    DB = { tid: j.tid, items: j.items || [], t: Date.now() };
    return DB;
  }
function dataUrlToBlob(d) { const m = /^data:([^;,]+)(;base64)?,(.*)$/.exec(d || ''); if (!m) throw new Error('bad data'); const bin = m[2] ? atob(m[3]) : decodeURIComponent(m[3]), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: m[1] }); }
const extOf = t => { t = String(t || '').split(';')[0]; return /jpeg|jpg/.test(t) ? 'jpg' : /png/.test(t) ? 'png' : /webp/.test(t) ? 'webp' : /webm/.test(t) ? 'webm' : /mpeg|mp3/.test(t) ? 'mp3' : /mp4|m4a/.test(t) ? 'm4a' : /ogg/.test(t) ? 'ogg' : /wav/.test(t) ? 'wav' : 'bin'; };
async function upBlob(blob) {
    const path = 'l/' + DB.tid + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + extOf(blob.type);
    const r = await fetch(REPORT_SUPABASE_URL + '/storage/v1/object/library/' + path, { method: 'POST', headers: Object.assign({}, sbHeaders(), { 'Content-Type': String(blob.type || 'application/octet-stream').split(';')[0], 'x-upsert': 'false' }), body: blob });
    if (!r.ok) throw new Error('upload ' + r.status);
    return path;
  }
async function dbAdd(o) {
    await dbLoad();
    let path = null, size = 0;
    if (o.blob) { path = await upBlob(o.blob); size = o.blob.size; }
    await lRpc('trainee_lib_add', { p_token: lTok(), p_kind: o.kind, p_source: o.source || 'dictation', p_n: o.n == null ? null : o.n, p_title: o.title || null, p_body: o.body || null, p_answer: o.answer || null, p_path: path, p_size: size, p_meta: o.meta || {}, p_ext_key: o.ext_key || null });
    DB.t = 0;
  }
const localPhotos = () => { try { return JSON.parse(localStorage.getItem(PH_KEY) || '[]') || []; } catch (e) { return []; } };
const saveLocalPhotos = a => { try { localStorage.setItem(PH_KEY, JSON.stringify(a)); } catch (e) { } };
/* a photo (data URL) goes straight to the server; if that fails it waits on this device and is sent later */
async function photoAdd(d, meta) {
    meta = meta || {};
    try { await dbLoad(); await dbAdd({ kind: 'photo', source: 'dictation', n: meta.n, blob: dataUrlToBlob(d), meta: meta.s ? { s: 1 } : {}, ext_key: 'ph-' + Date.now() }); return true; }
    catch (e) { const a = localPhotos(); a.unshift(Object.assign({ d, at: Date.now() }, meta)); saveLocalPhotos(a.slice(0, 12)); return true; }
  }
let syncing = null;
function libSync() {
    if (syncing) return syncing;
    return (syncing = (async () => {
      try {
        if (!lTok()) return;
        await dbLoad(true);
        /* passages written here and not on the server yet */
        for (const p of passList()) if (!p.sy) { try { await dbAdd({ kind: 'passage', source: 'dictation', n: p.n, body: p.text, answer: p.answer, meta: { manual: !!p.manual, photo: !!p.photo }, ext_key: null }); const a = passList(); const q = a.find(x => x.n === p.n); if (q) { q.sy = 1; localStorage.setItem(PASS_KEY, JSON.stringify(a)); } } catch (e) { } }
        /* photos that waited on this device */
        const keep = [];
        for (const p of localPhotos()) { try { await dbAdd({ kind: 'photo', source: 'dictation', n: p.n, blob: dataUrlToBlob(p.d), meta: p.s ? { s: 1 } : {}, ext_key: 'ph-' + p.at }); } catch (e) { keep.push(p); } }
        saveLocalPhotos(keep);
        /* mirror-room recordings kept in this browser */
        try {
          const M = thx.MOD.mirror, all = (await M.mirDb.all(M.uKey())).filter(x => x.state === 'done');
          for (const x of all) {
            const ps = x.parts || [];
            for (let i = 0; i < ps.length; i++) {
              const key = 'mir-' + x.n + '-' + i; if (DB.items.some(d => d.ext_key === key)) continue;
              try { await dbAdd({ kind: 'audio', source: 'mirror', n: x.n, answer: x.text || null, blob: ps[i], meta: { part: i }, ext_key: key }); DB.items.push({ ext_key: key }); } catch (e) { }
            }
          }
        } catch (e) { }
        await dbLoad(true);
      } catch (e) { } finally { syncing = null; }
    })());
  }
setTimeout(libSync, 1500);
/* ---- library: 4 side-by-side pages (swipe left/right); the section names live in the top row next to the menu button ---- */
  const LIB = ['sPhotos', 'sAudio', 'sPass', 'sLinks'];
let libI = 0, libCols = 3;
const libPages = () => thx.R.querySelector('.lpages');
function libGo(i) { const p = libPages(); if (p) p.scrollTo({ left: (thx.W.dir === 'rtl' ? -1 : 1) * i * p.clientWidth, behavior: 'smooth' }); }
let libUrls = [];
function libAud(s) { return (s.parts || []).map(p => { const u = URL.createObjectURL(p); libUrls.push(u); return '<audio controls preload="none" src="' + u + '"></audio>'; }).join(''); }
/* ---- messenger photos / links are read straight from the messages: nothing extra is stored. "Remove" only hides one from the library, on this device ---- */
  const LHK = () => 'thLibHide:' + String(localStorage.getItem('thabit_trainee_token') || 'x').slice(0, 16);
const libHidden = () => { try { return JSON.parse(localStorage.getItem(LHK()) || '[]') || []; } catch (e) { return []; } };
const libHide = id => { const h = libHidden(); if (!h.includes(String(id))) h.push(String(id)); try { localStorage.setItem(LHK(), JSON.stringify(h.slice(-2000))); } catch (e) { } };
let LM = null;
async function libMsgLoad() {
    if (LM && LM.ok && Date.now() - LM.t < 15000) return LM;
    const out = { photos: [], links: [], t: Date.now(), ok: false }, tk = localStorage.getItem('thabit_trainee_token');
    if (!tk) return out;
    const call = (fn, body) => fetch(REPORT_SUPABASE_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: sbHeaders(), body: JSON.stringify(body) }).then(r => r.json()).catch(() => null);
    const [r, mk] = await Promise.all([call('trainee_msg_list', { p_token: tk, p_after: 0 }), call('trainee_msg_marks_list', { p_token: tk })]);
    if (!(r && r.ok && Array.isArray(r.messages))) return out;
    const gone = new Set(((mk && mk.marks) || []).filter(x => x.kind === 'del_all').map(x => String(x.message_id)));
    r.messages.forEach(m => {
      if (gone.has(String(m.id))) return;
      const at = Date.parse(m.created_at) || 0;
      if (m.kind === 'image' && m.url) out.photos.push({ id: String(m.id), url: m.url, at });
      else if (m.kind === 'link' && /^https?:\/\//i.test(m.body || '')) out.links.push({ id: m.id + '#0', url: m.body, at });
      else if ((!m.kind || m.kind === 'text') && m.body) (m.body.match(/https?:\/\/[^\s<>"']+/gi) || []).forEach((u, i) => out.links.push({ id: m.id + '#' + (i + 1), url: u.replace(/[.,;:!?)\]]+$/, ''), at }));
    });
    out.photos.sort((x, y) => y.at - x.at); out.links.sort((x, y) => y.at - x.at); out.ok = true;
    return (LM = out);
  }
const libDay = at => new Date(at).toLocaleDateString(thx.L === 'ar' ? 'ar-EG' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const libByDay = items => { const g = []; items.forEach(x => { const d = libDay(x.at), l = g[g.length - 1]; if (l && l.d === d) l.a.push(x); else g.push({ d, a: [x] }); }); return g; };
function renderLib(b) {
    libUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) { } }); libUrls = [];
    const T = thx.MOD.dict.DT[thx.L];
    const empty = m => '<div class="dmsg">' + m + '</div>';
    const sw = (items, on) => '<div class="lsw">' + items.map(x => '<button type="button"' + (x[0] === on ? ' class="on"' : '') + ' data-a="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    b.innerHTML = '<div class="pcard dpc dlib"><div class="lpages">' +
      '<section class="lpg lpp lph">' + sw([['task', T.tabPhTask], ['msg', T.tabPhMsg]], 'task') + '<div class="lpb"></div></section>' +
      '<section class="lpg lpa">' + sw([['task', T.tabTask], ['later', T.tabLater]], 'task') + '<div class="lab"></div></section>' +
      '<section class="lpg"><div class="lppb"></div></section>' +
      '<section class="lpg lpl"><div class="lpb"></div></section></div></div>';
    const pg = libPages();
    pg.scrollTo({ left: (thx.W.dir === 'rtl' ? -1 : 1) * libI * pg.clientWidth, behavior: 'instant' });
    pg.addEventListener('scroll', () => { const i = Math.round(Math.abs(pg.scrollLeft) / (pg.clientWidth || 1)); if (i !== libI && i >= 0 && i < LIB.length) { libI = i; thx.crumb(); } }, { passive: true });
    /* photos: task photos (kept on this device) | messenger photos (sent or received, newest day first) */
    const ph = b.querySelector('.lph'), phB = ph.querySelector('.lpb'), lkB = b.querySelector('.lpl .lpb');
    let phK = 'task';
    const drawMsgPh = () => {
      if (phK !== 'msg' || !phB.isConnected) return;
      const hid = libHidden(), items = ((LM && LM.photos) || []).filter(p => !hid.includes(p.id));
      phB.innerHTML = items.length ? libByDay(items).map(g => '<div class="lday">' + thx.esc(g.d) + '</div><div class="dgrid" style="--cols:' + libCols + '">' + g.a.map(p => '<div class="ltile" data-id="' + thx.esc(p.id) + '"><img alt="" draggable="false" loading="lazy" src="' + thx.esc(p.url) + '"><button type="button" class="ltx" aria-label="' + T.libDel + '">✕</button></div>').join('') + '</div>').join('') : empty(T.phMsgEmpty);
    };
    const drawLinks = () => {
      if (!lkB.isConnected) return;
      const hid = libHidden(), items = ((LM && LM.links) || []).filter(x => !hid.includes(x.id));
      lkB.innerHTML = items.length ? '<div class="lcol">' + libByDay(items).map(g => '<div class="lday">' + thx.esc(g.d) + '</div>' + g.a.map(x => '<div class="lpc lk" data-id="' + thx.esc(x.id) + '"><a href="' + thx.esc(x.url) + '" target="_blank" rel="noopener noreferrer">' + thx.esc(x.url) + '</a><button type="button" class="ltx" aria-label="' + T.libDel + '">✕</button></div>').join('')).join('') + '</div>' : empty(T.linkEmpty);
    };
    const taskPh = () => DB.items.filter(x => x.kind === 'photo' && x.source === 'dictation' && x.path).map(x => ({ src: pubUrl(x.path), s: x.meta && x.meta.s, n: x.n }))
      .concat(localPhotos().map(p => ({ src: p.d, s: p.s, n: p.n })));
    const drawTaskPh = () => {
      if (phK !== 'task' || !phB.isConnected) return;
      const a = taskPh();
      phB.innerHTML = a.length ? '<div class="dgrid" style="--cols:' + libCols + '">' + a.map(p => p.s ? '<figure class="lfig"><img alt="" draggable="false" loading="lazy" src="' + thx.esc(p.src) + '"><figcaption>' + thx.esc(thx.MOD.dict.sessName(p.n)) + '</figcaption></figure>' : '<img alt="" draggable="false" loading="lazy" src="' + thx.esc(p.src) + '">').join('') + '</div>' : empty(T.libEmpty);
    };
    const drawPass = () => {
      const box = b.querySelector('.lppb'); if (!box || !box.isConnected) return;
      const dbp = DB.items.filter(x => x.kind === 'passage').map(x => ({ n: x.n, text: x.body, answer: x.answer, manual: !!(x.meta && x.meta.manual) })), have = new Set(dbp.map(p => p.n));
      const ps = dbp.concat(passList().filter(p => !have.has(p.n))).sort((x, y) => x.n - y.n);
      box.innerHTML = ps.length ? '<div class="lcol">' + ps.map(p => '<div class="lpc"><b>' + (p.manual ? thx.MOD.dict.sessName(p.n) : T.passage + ' #' + p.n) + '</b>' + (p.text ? '<p>' + thx.esc(p.text) + '</p>' : '') + (p.answer ? '<p class="la" dir="auto">' + thx.esc(p.answer) + '</p>' : '') + '</div>').join('') + '</div>' : empty(T.passEmpty);
    };
    const showPh = async k => {
      phK = k; ph.querySelectorAll('.lsw button').forEach(x => x.classList.toggle('on', x.dataset.a === k));
      if (k === 'task') { drawTaskPh(); return; }
      if (LM) drawMsgPh(); else phB.innerHTML = '';
      await libMsgLoad(); drawMsgPh();
    };
    ph.querySelector('.lsw').addEventListener('click', e => { const x = e.target.closest('button'); if (x) showPh(x.dataset.a); });
    b.querySelector('.dlib').addEventListener('click', e => {
      const x = e.target.closest('.ltx');
      if (x) { const t = x.closest('[data-id]'); if (t) { libHide(t.dataset.id); drawMsgPh(); drawLinks(); } return; }
      const im = e.target.closest('.ltile img'); if (im) window.open(im.src, '_blank', 'noopener');
    });
    showPh('task'); drawLinks(); drawPass();
    libMsgLoad().then(() => { drawLinks(); drawMsgPh(); });
    libSync().then(() => { drawTaskPh(); drawPass(); const on = b.querySelector('.lpa .lsw button.on'); if (on && on.dataset.a === 'task' && b.querySelector('.lpa')._show) b.querySelector('.lpa')._show('task'); });
    /* audio: task recordings (the mirror room) | a second part that comes later. Voice messages stay in the messenger only. */
    const pa = b.querySelector('.lpa');
    if (pa) {
      const lab = pa.querySelector('.lab');
      const show = async k => {
        pa.querySelectorAll('.lsw button').forEach(x => x.classList.toggle('on', x.dataset.a === k));
        if (k === 'later') { lab.innerHTML = empty(T.laterMsg); return; }
        lab.innerHTML = '';
        let loc = []; try { loc = (await thx.MOD.mirror.mirDb.all(thx.MOD.mirror.uKey())).filter(x => x.state === 'done'); } catch (e) { }
        if (!lab.isConnected || !pa.querySelector('.lsw button.on[data-a="task"]')) return;
        const g = {}; DB.items.filter(x => x.kind === 'audio' && x.path).sort((x, y) => (x.meta && x.meta.part || 0) - (y.meta && y.meta.part || 0)).forEach(x => { (g[x.n] = g[x.n] || { n: x.n, urls: [], text: '' }).urls.push(pubUrl(x.path)); if (x.answer) g[x.n].text = x.answer; });
        const all = Object.values(g).map(x => ({ n: x.n, html: x.urls.map(u => '<audio controls preload="none" src="' + thx.esc(u) + '"></audio>').join(''), text: x.text }))
          .concat(loc.filter(x => !g[x.n]).map(x => ({ n: x.n, html: libAud(x), text: x.text }))).sort((x, y) => y.n - x.n);
        lab.innerHTML = all.length ? '<div class="lcol">' + all.map(x => '<div class="lpc"><b>' + T.sessN + ' #' + x.n + '</b>' + x.html + (x.text ? '<p class="la">' + thx.esc(x.text) + '</p>' : '') + '</div>').join('') + '</div>' : empty(T.taskEmpty);
      };
      pa._show = show;
      pa.querySelector('.lsw').addEventListener('click', e => { const x = e.target.closest('button'); if (x) show(x.dataset.a); });
      show('task');
    }
    /* photos: spread two fingers = bigger pictures (fewer per row), pinch = smaller pictures, more side by side (Ctrl + wheel on a computer) */
    {
      const pts = new Map(); let d0 = 0, c0 = libCols;
      const dist = () => { const v = [...pts.values()]; return Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y) || 1; };
      const setC = n => { n = Math.max(1, Math.min(7, n)); if (n === libCols) return; libCols = n; ph.querySelectorAll('.dgrid').forEach(g => g.style.setProperty('--cols', n)); };
      ph.addEventListener('pointerdown', e => { pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pts.size === 2) { d0 = dist(); c0 = libCols; } });
      ph.addEventListener('pointermove', e => { if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pts.size === 2) setC(Math.round(c0 / (dist() / d0))); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => ph.addEventListener(ev, e => pts.delete(e.pointerId)));
      ph.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); setC(libCols + (e.deltaY > 0 ? 1 : -1)); }, { passive: false });
    }
  }

    {   /* name tag under a photo saved from a dictation session */
      const st = document.createElement('style'); st.id = 'thLibNameCss';
      st.textContent = '.lfig{position:relative;width:100%;margin:0}.lfig img{display:block;width:100%}.lfig figcaption{position:absolute;left:0;right:0;bottom:0;padding:16px 6px 6px;border-radius:0 0 10px 10px;text-align:center;font:700 10.5px Cairo,Inter,sans-serif;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.72))}.lpc p[dir=auto]{unicode-bidi:plaintext}';
      thx.R.appendChild(st);
    }
    /* ---- اللي index.html والملفات التانية بتستخدمه من الزرار ده ---- */
    return {
      id: 'library', render: renderLib,
      get passNext() { return passNext; },
      get passSave() { return passSave; },
      get passAdd() { return passAdd; },
      get photoAdd() { return photoAdd; },
      get libSync() { return libSync; },
      get LIB() { return LIB; },
      get libI() { return libI; },
      set libI(v) { libI = v; },
      get libGo() { return libGo; }
    };
  };
})();
