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
  const T = {
    en: { none: 'No data yet', ear: 'Pronunciation', loading: 'Loading…', login: 'Please log in again.', fail: 'Could not load your data. Try again.', wmiss: 'No recording for this word yet', wfail: 'Could not load the recording' },
    ar: { none: 'لا توجد بيانات بعد', ear: 'النطق', loading: 'جاري التحميل…', login: 'سجّل دخول من جديد.', fail: 'تعذر تحميل بياناتك، حاول تاني.', wmiss: 'لا يوجد تسجيل لهذه الكلمة بعد', wfail: 'تعذر تحميل التسجيل' }
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
    let D = null, wrap = null, root = null, mo = null, lastLang = null, loadId = 0, onResize = null;
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
    /* ear on: every word (outside tags) becomes tappable -> the pronouncer. If ThabitRich is loaded it makes its own .vx words, so we don't double-wrap. */
    const wordify = h => window.ThabitRich ? h : h.replace(/(<[^>]+>)|([^<\s]+)/g, (m, tag, w) => tag ? tag : '<span class="vx" role="button" tabindex="0" data-word="' + esc(w.replace(/&[a-z#0-9]+;/gi, '')) + '">' + w + '</span>');
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
      root.innerHTML = '<div class="grid lists' + (ds.length === 1 ? ' one' : '') + '">' + ds.map(cap).join('') + '</div>';
      root.scrollTop = keep; requestAnimationFrame(fitCaps); setTimeout(fitCaps, 350);
    }
    function closeCm() { const e = wrap && wrap.querySelector('.cm'); if (e) e.remove(); }
    function openCm(key, n) {
      closeCm(); const t = tt(), d = REG[key]; if (!d) return; const on = !d.noear && earOn(key), list = LISTS[key] || [];
      const el = document.createElement('div'); el.className = 'ov2 cm';
      el.innerHTML = '<div class="cmb"><button type="button" class="tdx cmx" aria-label="Close">×</button><h4 class="cmh">' + esc(ttl(d)) + '</h4><div class="cml">' + (list.map((x, i) => '<div class="ce" data-n="' + i + '"><div class="dt">' + esc(x.date) + '</div>' + (d.body ? d.body(x, esc) : rich(x.text, on)) + '</div>').join('') || '<div class="sm">' + t.none + '</div>') + '</div></div>';
      wrap.appendChild(el);
      const l = el.querySelector('.cml'), c = l.querySelector('.ce[data-n="' + n + '"]'); if (c) l.scrollTop = c.offsetTop - 4;
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
      D = d; paint();
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
    const wpClean = v => !v ? '' : String(v).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"\u201C\u201D\u2018\u2019]/g, '').replace(/\s+/g, ' ').trim();
    const wpParts = v => String(v || '').split(/[,\u060C\n]+/).map(x => x.trim()).filter(Boolean);
    const wpCache = {}; let wpKeyOK = true;
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
    async function wpOpen(word) {
      word = String(word == null ? '' : word).trim(); if (!word || !wrap) return;
      wpClose();
      const my = ++WP.tk; WP.word = word; WP.urls = []; WP.i = 0;
      const el = document.createElement('div'); el.className = 'wp';
      el.innerHTML = '<div class="wpw" dir="auto">' + esc(word) + '</div><div class="wpr" dir="ltr"><button type="button" class="wpb wpp" aria-label="Play/Pause">' + PLAY + '</button><input type="range" min="0" max="1000" value="0" aria-label="Seek"><span class="wpt">0:00 / 0:00</span><span class="wpn"></span></div><div class="wpm" dir="auto" hidden></div>';
      wrap.appendChild(el);
      let urls; try { urls = await wpResolve(word); } catch (e) { urls = undefined; }
      if (my !== WP.tk) return;
      if (!urls) { wpMsg(urls === null ? tt().wmiss : tt().wfail); return; }
      WP.urls = urls; wpLoad(true);
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
.wpw{font-weight:700;margin-bottom:8px;text-align:center;overflow-wrap:anywhere}.wpr{display:flex;align-items:center;gap:8px}
.wpb{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:#34d399;color:#06281b;cursor:pointer;display:flex;align-items:center;justify-content:center}
.vsw .wp input[type=range]{flex:1;min-width:0;accent-color:#34d399}.wpt{flex:none;font-size:.68rem;opacity:.75;font-variant-numeric:tabular-nums}.wpn{flex:none;font-size:.68rem;opacity:.6}.wpm{font-size:.82rem;text-align:center;opacity:.85}
.vsw .lists.one{max-width:560px}
.vsw .sm{font:500 12px/1.5 Cairo,Inter,system-ui,sans-serif;color:var(--ink2)}`;

    function render(b) {
      stop();
      b.innerHTML = '<style>' + CSS + defs().map(d => d.css || '').join('') + '</style><div class="vsw"><div class="vs"></div></div>';
      wrap = b.querySelector('.vsw'); root = b.querySelector('.vs'); lastLang = lg();
      wrap.addEventListener('click', e => {
        const q = s => (e.target.closest ? e.target.closest(s) : null);
        let x;
        if ((x = q('.ear'))) {   /* turn the pronunciation on (green + a little shake) or off */
          e.stopPropagation(); const k = x.dataset.ear, on = !earOn(k); earSet(k, on);
          x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); x.classList.remove('shk', 'cls'); void x.offsetWidth; x.classList.add(on ? 'shk' : 'cls'); setTimeout(() => x.classList.remove('shk', 'cls'), 1100); return;
        }
        if ((x = q('.vx'))) { e.preventDefault(); wpOpen(x.dataset.word); return; }
        if ((x = q('.scrv'))) { x.classList.toggle('scrz'); return; }
        if (q('.cm')) { if (q('.cmx') || !q('.cmb')) closeCm(); else if (!q('.wp')) wpClose(); return; }
        if ((x = q('.earc'))) { const c = q('.cap'); openCm(x.dataset.key, c ? +c.dataset.n : 0); return; }
        if (!q('.wp')) wpClose();
      });
      wrap.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeCm(); return; }
        if (e.key !== 'Enter' && e.key !== ' ') return; const x = e.target.closest && e.target.closest('.vx'); if (x) { e.preventDefault(); wpOpen(x.dataset.word); }
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