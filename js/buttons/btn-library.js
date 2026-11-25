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
const passNext = () => passList().reduce((m, p) => Math.max(m, p.n || 0), 0) + 1;
function passSave(t, photo) {
    if (!t || !t.tokens) return;
    const a = passList().filter(p => p.n !== t.n);
    a.push({ n: t.n || (a.length + 1), text: t.tokens.map(x => x.w + (x.p || '')).join(' '), answer: t.text || '', photo: !!photo, at: Date.now() });
    a.sort((x, y) => x.n - y.n);
    try { localStorage.setItem(PASS_KEY, JSON.stringify(a)); } catch (e) { }
  }
/* a session made with the "+" button in the dictation page (photo or hand-written text), kept under its own number */
function passAdd(n, answer, photo) {
    const a = passList().filter(p => p.n !== n);
    a.push({ n, text: '', answer: answer || '', photo: !!photo, manual: true, at: Date.now() });
    a.sort((x, y) => x.n - y.n);
    try { localStorage.setItem(PASS_KEY, JSON.stringify(a)); } catch (e) { }
  }
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
    const T = thx.MOD.dict.DT[thx.L]; let a = []; try { a = JSON.parse(localStorage.getItem(thx.MOD.dict.DICT.photos) || '[]'); } catch (e) { }
    const ps = passList(), empty = m => '<div class="dmsg">' + m + '</div>';
    const sw = (items, on) => '<div class="lsw">' + items.map(x => '<button type="button"' + (x[0] === on ? ' class="on"' : '') + ' data-a="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    b.innerHTML = '<div class="pcard dpc dlib"><div class="lpages">' +
      '<section class="lpg lpp lph">' + sw([['task', T.tabPhTask], ['msg', T.tabPhMsg]], 'task') + '<div class="lpb"></div></section>' +
      '<section class="lpg lpa">' + sw([['task', T.tabTask], ['later', T.tabLater]], 'task') + '<div class="lab"></div></section>' +
      '<section class="lpg">' + (ps.length ? '<div class="lcol">' + ps.map(p => '<div class="lpc"><b>' + (p.manual ? thx.MOD.dict.sessName(p.n) : T.passage + ' #' + p.n) + '</b>' + (p.text ? '<p>' + thx.esc(p.text) + '</p>' : '') + (p.answer ? '<p class="la" dir="auto">' + thx.esc(p.answer) + '</p>' : '') + '</div>').join('') + '</div>' : empty(T.passEmpty)) + '</section>' +
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
    const showPh = async k => {
      phK = k; ph.querySelectorAll('.lsw button').forEach(x => x.classList.toggle('on', x.dataset.a === k));
      if (k === 'task') { phB.innerHTML = a.length ? '<div class="dgrid" style="--cols:' + libCols + '">' + a.map(p => p.s ? '<figure class="lfig"><img alt="" draggable="false" src="' + p.d + '"><figcaption>' + thx.esc(thx.MOD.dict.sessName(p.n)) + '</figcaption></figure>' : '<img alt="" draggable="false" src="' + p.d + '">').join('') + '</div>' : empty(T.libEmpty); return; }
      if (LM) drawMsgPh(); else phB.innerHTML = '';
      await libMsgLoad(); drawMsgPh();
    };
    ph.querySelector('.lsw').addEventListener('click', e => { const x = e.target.closest('button'); if (x) showPh(x.dataset.a); });
    b.querySelector('.dlib').addEventListener('click', e => {
      const x = e.target.closest('.ltx');
      if (x) { const t = x.closest('[data-id]'); if (t) { libHide(t.dataset.id); drawMsgPh(); drawLinks(); } return; }
      const im = e.target.closest('.ltile img'); if (im) window.open(im.src, '_blank', 'noopener');
    });
    showPh('task'); drawLinks();
    libMsgLoad().then(() => { drawLinks(); drawMsgPh(); });
    /* audio: task recordings (the mirror room) | a second part that comes later. Voice messages stay in the messenger only. */
    const pa = b.querySelector('.lpa');
    if (pa) {
      const lab = pa.querySelector('.lab');
      const show = async k => {
        pa.querySelectorAll('.lsw button').forEach(x => x.classList.toggle('on', x.dataset.a === k));
        if (k === 'later') { lab.innerHTML = empty(T.laterMsg); return; }
        lab.innerHTML = '';
        const all = (await thx.MOD.mirror.mirDb.all(thx.MOD.mirror.uKey())).filter(x => x.state === 'done').sort((x, y) => y.n - x.n);
        if (!lab.isConnected || !pa.querySelector('.lsw button.on[data-a="task"]')) return;
        lab.innerHTML = all.length ? '<div class="lcol">' + all.map(x => '<div class="lpc"><b>' + T.sessN + ' #' + x.n + '</b>' + libAud(x) + (x.text ? '<p class="la">' + thx.esc(x.text) + '</p>' : '') + '</div>').join('') + '</div>' : empty(T.taskEmpty);
      };
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
      get LIB() { return LIB; },
      get libI() { return libI; },
      set libI(v) { libI = v; },
      get libGo() { return libGo; }
    };
  };
})();
