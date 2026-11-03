/* ==========================================================
   Voice notes - Part 1 (paste at the END of dashboard.js)
   A word the trainer recorded a note for turns green and plays HIS recording (only that exact spot),
   instead of the general words_table pronunciation. Works in Tasks, Dandana and the Notes / TEFL / QOL pop-up.
   ========================================================== */
(function () {
  if (window.__vnDash) return; window.__vnDash = 1;
  const VN = { notes: [], started: false, sig: '' };

  const st = document.createElement('style');
  st.textContent = `
.vnw{font-weight:600;cursor:pointer;-webkit-tap-highlight-color:transparent}
.vnw.vo{color:rgb(31,182,255)!important;text-shadow:0 0 8px rgba(31,182,255,.65)}
.vnw.vq{color:rgb(224,38,138)!important;text-shadow:0 0 8px rgba(224,38,138,.6)}
.vnw .vx,.vnw .rt-link{color:inherit!important;text-shadow:none!important;pointer-events:none!important}`;
  document.head.appendChild(st);

  async function fetchVN() {
    const p = (D && D.profile) || {};
    const first = a => (Array.isArray(a) ? a : []).find(x => x && x.trainee_id != null);
    let id = p.id != null ? p.id : p.trainee_id;
    if (id == null) { const f = first(D && D.rows) || first(D && D.items) || first(D && D.notes); if (f) id = f.trainee_id; }
    const flt = id != null ? `trainee_id=eq.${encodeURIComponent(id)}` : (p.trainee ? `trainee_name=eq.${encodeURIComponent(String(p.trainee).trim())}` : null);
    if (!flt) { console.warn('[voice notes] no trainee id or name. profile keys:', Object.keys(p)); return null; }
    try {
      const r = await fetch(`${SB}/rest/v1/voice_notes?select=id,scope,word,occ,audio_url,duration&${flt}&status=eq.active`, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
      if (!r.ok) { console.warn('[voice notes] read failed', r.status, await r.text().catch(() => '')); return null; }
      const j = await r.json(); return Array.isArray(j) ? j : null;
    } catch (e) { return null; }
  }
  async function refresh() {
    const rows = await fetchVN(); if (!rows) return;
    const sig = rows.map(n => n.id + n.audio_url).sort().join('|');
    if (sig === VN.sig) return;
    VN.sig = sig; VN.notes = rows; render();
  }

  /* wrap one text container: the nth occurrence of each noted word becomes a clickable span */
  function wrap(box, scope) {
    if (!box || box.dataset.vnd) return;
    const list = VN.notes.filter(n => n.scope === scope); if (!list.length) return;
    box.dataset.vnd = '1';
    const w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('.vnw') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const segs = []; let full = '';
    while (w.nextNode()) { const n = w.currentNode; segs.push({ n, s: full.length, e: full.length + n.nodeValue.length }); full += n.nodeValue; }
    const ranges = [];
    list.forEach(note => {
      let p = full.indexOf(note.word), c = 0;
      while (p !== -1 && c < (note.occ || 0)) { p = full.indexOf(note.word, p + 1); c++; }
      if (p !== -1) ranges.push({ s: p, e: p + note.word.length, id: note.id });
    });
    ranges.sort((a, b) => a.s - b.s);
    const ok = []; let last = -1; ranges.forEach(r => { if (r.s >= last) { ok.push(r); last = r.e; } });
    ok.reverse().forEach(r => {
      segs.filter(g => g.e > r.s && g.s < r.e).forEach(g => {
        const a = Math.max(r.s, g.s) - g.s, b = Math.min(r.e, g.e) - g.s;
        let mid = a > 0 ? g.n.splitText(a) : g.n;
        if (b - a < mid.nodeValue.length) mid.splitText(b - a);
        const sp = document.createElement('span');
        sp.className = 'vnw ' + (/\|qol$/.test(scope) ? 'vq' : 'vo'); sp.setAttribute('data-vn', r.id); sp.setAttribute('role', 'button'); sp.setAttribute('tabindex', '0');
        mid.parentNode.insertBefore(sp, mid); sp.appendChild(mid);
      });
    });
  }

  function applyItems() {
    if (!VN.notes.length) return;
    document.querySelectorAll('.itm[data-vn]').forEach(el => {
      const base = el.getAttribute('data-vn');
      [['title', '.ith b'], ['badge', '.ith .itbd, .ith .itar'], ['body', '.itd']].forEach(f => wrap(el.querySelector(f[1]), base + ':' + f[0]));
    });
  }

  /* tag every task / dandana row with its date + kind + number */
  const _itemRow = itemRow;
  itemRow = function (it) {
    const h = _itemRow.apply(this, arguments);
    return String(h).replace('<div class="itm">', `<div class="itm" data-vn="${esc(it.date)}|${esc(it.kind)}:${esc(it.no)}">`);
  };

  const _render = render;
  render = function () {
    const r = _render.apply(this, arguments);
    applyItems();
    if (D && !VN.started) { VN.started = true; refresh(); }
    return r;
  };

  /* Notes / TEFL / QOL: highlight inside the full-text pop-up */
  const _openModal = openModal;
  openModal = function (i) {
    const r = _openModal.apply(this, arguments);
    try {
      const m = MD[i];
      if (m && m[3] && m[2] && VN.notes.length) {
        document.querySelectorAll('#mB .cti').forEach(c => { const x = m[3][+c.dataset.n]; if (x) wrap(c, x.date + '|' + m[2]); });
      }
    } catch (e) { console.warn('[voice notes]', e); }
    return r;
  };

  /* play this exact recording with the same mini player the words list uses */
  /* open the SAME smart widget (dashboardsmartwidget.js) but feed it the trainer's recording instead of the words_table one */
  VN.force = null;
  const _wpResolve = wpResolve;
  wpResolve = function (text) {
    if (VN.force && VN.force.word === text) { const u = VN.force.url; VN.force = null; return Promise.resolve([u]); }
    return _wpResolve.apply(this, arguments);
  };
  function play(n) {
    VN.force = { word: n.word, url: n.audio_url };
    setTimeout(() => { VN.force = null; }, 4000);
    window.wpOpen(n.word);
  }
  /* window capture = runs before every other click handler on the page (so the general word player never fires on these words) */
  window.addEventListener('click', e => {
    const s = e.target && e.target.closest && e.target.closest('.vnw'); if (!s) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const n = VN.notes.find(x => String(x.id) === s.getAttribute('data-vn')); if (n) play(n);
  }, true);
  window.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const s = e.target && e.target.closest && e.target.closest('.vnw'); if (!s) return;
    e.preventDefault(); const n = VN.notes.find(x => String(x.id) === s.getAttribute('data-vn')); if (n) play(n);
  }, true);

  setInterval(() => { if (!document.hidden && D) refresh(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && D) refresh(); });
  if (D && !VN.started) { VN.started = true; refresh(); }
})();
