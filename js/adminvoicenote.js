/* ==========================================================
   Voice notes - Part 1 (paste at the END of adminpanel.js)
   Select any text inside a text field -> small "ملاحظة صوتية" button appears -> record -> save.
   The recording belongs to THIS trainee + THIS field + THIS day + THIS occurrence of the word only.
   ========================================================== */
(function () {
  if (window.__vnInit) return; window.__vnInit = 1;
  const VN = { sel: null, fab: null, ov: null, rec: null, stream: null, blob: null, tm: null, secs: 0 };

  const st = document.createElement('style');
  st.textContent = `
#vnFab{position:fixed;z-index:2147483600;display:none;align-items:center;gap:6px;padding:6px 13px;border-radius:999px;background:#2563eb;color:#fff;font:700 12px Cairo,Inter,sans-serif;border:1px solid rgba(255,255,255,.45);box-shadow:0 8px 22px rgba(0,0,0,.5);cursor:pointer;white-space:nowrap}
.vn-ov{z-index:2147483500!important}
.vn-w{font-size:18px;font-weight:800;color:#fbbf24;padding:8px 12px;border-radius:10px;background:#020617;border:1px solid #334155;overflow-wrap:anywhere;max-height:90px;overflow:auto}
.vn-i{font-size:11px;color:#94a3b8;margin:6px 0 10px}
.vn-r{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.vn-t{font:700 13px ui-monospace,Menlo,Consolas,monospace;color:#fbbf24;min-width:48px}
.vn-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #1e293b;font-size:12px}
.vn-row:last-child{border:0}
.vn-row b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}`;
  document.head.appendChild(st);

  const validEl = a => !!a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && (!a.type || a.type === 'text' || a.type === 'search')));

  /* which trainee / field / day is this text field? (null = not supported yet) */
  function ctxOf(el) {
    const id = (el.dataset && el.dataset.vnHid) || el.id || ''; let m;
    if ((m = /^ds_(.+)_(\d+)$/.exec(id))) {
      const i = +m[2], s = supplyState.students[i], d = dsDate(i);
      if (s && d) return { tid: String(s.id), scope: d + '|' + m[1], who: s.trainee || '', where: m[1] + ' · ' + d };
    }
    if ((m = /^dsi_(title|badge|body)$/.exec(id)) && typeof dsItemCtx !== 'undefined' && dsItemCtx && dsItemCtx.open) {
      const c = dsItemCtx, s = supplyState.students[c.idx];
      if (s) return { tid: String(s.id), scope: `${c.date}|${c.kind}:${c.open}:${m[1]}`, who: s.trainee || '', where: `${c.kind} ${c.open} · ${m[1]} · ${c.date}` };
    }
    return null;
  }

  /* ---------- floating button ---------- */
  const fab = VN.fab = document.createElement('button');
  fab.type = 'button'; fab.id = 'vnFab'; fab.innerHTML = '<i class="fa-solid fa-microphone"></i> ملاحظة صوتية';
  document.body.appendChild(fab);
  fab.addEventListener('mousedown', e => e.preventDefault());
  fab.addEventListener('click', () => { if (VN.sel) openRec(VN.sel); });
  const hide = () => { fab.style.display = 'none'; };

  function check() {
    const a = document.activeElement;
    if (a && (a === fab || (a.closest && a.closest('.vn-ov')))) return;
    if (!validEl(a)) { hide(); return; }
    const s = a.selectionStart, e = a.selectionEnd;
    if (s == null || s === e) { hide(); return; }
    const raw = a.value.slice(s, e); if (!raw.trim()) { hide(); return; }
    const ctx = ctxOf(a); if (!ctx) { hide(); return; }
    const st0 = s + (raw.length - raw.trimStart().length), en0 = e - (raw.length - raw.trimEnd().length);
    VN.sel = { el: a, start: st0, end: en0, word: a.value.slice(st0, en0), text: a.value, ctx };
    const r = a.getBoundingClientRect();
    fab.style.display = 'inline-flex';
    const w = fab.offsetWidth;
    fab.style.left = Math.min(innerWidth - w - 8, Math.max(8, r.right - w)) + 'px';
    fab.style.top = (r.top - 38 >= 8 ? r.top - 38 : Math.min(innerHeight - 44, r.bottom + 6)) + 'px';
  }
  let ct = 0; const later = () => { clearTimeout(ct); ct = setTimeout(check, 60); };
  ['select', 'keyup', 'mouseup', 'touchend'].forEach(ev => document.addEventListener(ev, later, true));
  document.addEventListener('selectionchange', later);
  window.addEventListener('scroll', later, true);

  /* the big text editor popup has no id: tell it which hidden field it edits */
  const _pop = window.dsTextPop;
  if (typeof _pop === 'function') window.dsTextPop = function (hid) {
    const r = _pop.apply(this, arguments);
    const ov = [...document.querySelectorAll('.ds-ov')].pop(), ta = ov && ov.querySelector('textarea.ds-ta');
    if (ta) ta.dataset.vnHid = hid;
    return r;
  };

  /* ---------- recorder window ---------- */
  const q = s => VN.ov && VN.ov.querySelector(s);
  const mmss = n => String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');

  function closeRec() {
    clearInterval(VN.tm);
    try { if (VN.rec && VN.rec.state === 'recording') VN.rec.stop(); } catch (e) {}
    if (VN.stream) { VN.stream.getTracks().forEach(t => t.stop()); VN.stream = null; }
    if (VN.ov) { VN.ov.remove(); VN.ov = null; }
    VN.rec = null; VN.blob = null;
  }

  async function toggleRec() {
    if (VN.rec && VN.rec.state === 'recording') { VN.rec.stop(); return; }
    try {
      const stream = VN.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream), ch = [];
      rec.ondataavailable = e => { if (e.data && e.data.size) ch.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop()); clearInterval(VN.tm);
        if (!VN.ov) return;
        VN.blob = new Blob(ch, { type: rec.mimeType || 'audio/webm' });
        const a = q('audio'); a.src = URL.createObjectURL(VN.blob); a.hidden = false;
        q('[data-rec]').innerHTML = '<i class="fa-solid fa-rotate-right"></i> إعادة التسجيل';
        q('[data-save]').disabled = false;
      };
      VN.rec = rec; VN.blob = null; rec.start(); VN.secs = 0;
      q('[data-rec]').innerHTML = '<i class="fa-solid fa-stop"></i> إيقاف';
      q('audio').hidden = true; q('[data-save]').disabled = true; q('.vn-t').textContent = '00:00';
      VN.tm = setInterval(() => { VN.secs++; const t = q('.vn-t'); if (t) t.textContent = mmss(VN.secs); }, 1000);
    } catch (e) { showToast('مفيش صلاحية للميكروفون', true); }
  }

  async function loadList(c) {
    const box = q('[data-list]'); if (!box) return;
    try {
      const rows = await (await sbFetch(`voice_notes?select=*&trainee_id=eq.${enc(c.tid)}&scope=eq.${enc(c.scope)}&status=eq.active&order=created_at.asc`)).json();
      if (!q('[data-list]')) return;
      box.innerHTML = Array.isArray(rows) && rows.length ? rows.map(n => `<div class="vn-row"><b dir="auto">${esc(n.word)}</b><span class="ds-tag">#${(n.occ || 0) + 1}</span><span class="ds-tag">${esc(mmss(Math.round(n.duration || 0)))}</span>
          <button type="button" class="ds-b blue" data-p="${esc(n.audio_url)}" data-w="${esc(n.word)}"><i class="fa-solid fa-play"></i></button>
          <button type="button" class="ds-b red" data-d="${n.id}" data-u="${esc(n.audio_url)}"><i class="fa-solid fa-trash"></i></button></div>`).join('')
        : '<span class="text-xs text-slate-500">مفيش ملاحظات صوتية في الفيلد ده لسه.</span>';
      box.querySelectorAll('[data-p]').forEach(b => b.onclick = () => adminAudioPop(b.dataset.p, b.dataset.w));
      box.querySelectorAll('[data-d]').forEach(b => b.onclick = async () => {
        if (!confirm('تمسح الملاحظة الصوتية دي؟')) return;
        try {
          await mutate(`voice_notes?id=eq.${enc(b.dataset.d)}`, 'DELETE');
          const old = urlToPath(b.dataset.u);
          if (old) fetch(`${SUPABASE_URL}/storage/v1/object/audio-files/${old.split('/').map(enc).join('/')}`, { method: 'DELETE', headers: sbHeaders() }).catch(() => {});
          showToast('اتمسحت ✓'); loadList(c);
        } catch (e) { showToast('فشل المسح: ' + e.message, true); }
      });
    } catch (e) { box.innerHTML = `<span class="text-xs" style="color:#fb7185">تعذر التحميل: ${esc(e.message)} (شغّل 08_voice_notes.sql لو لسه)</span>`; }
  }

  function openRec(sel) {
    closeRec(); hide();
    const c = sel.ctx, w = sel.word.slice(0, 200);
    let occ = 0, p = sel.text.indexOf(sel.word);
    while (p !== -1 && p < sel.start) { occ++; p = sel.text.indexOf(sel.word, p + 1); }
    const ov = VN.ov = document.createElement('div'); ov.className = 'ds-ov vn-ov';
    ov.innerHTML = `<div class="ds-box" style="max-width:580px;margin-top:6vh">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
        <b style="color:#fbbf24;font-size:14px"><i class="fa-solid fa-microphone"></i> ملاحظة صوتية · ${esc(c.who)}</b>
        <button type="button" class="ds-b ghost" data-x>إغلاق</button></div>
      <div class="vn-w" dir="auto">${esc(w)}</div>
      <div class="vn-i" dir="auto">${esc(c.where)} · التكرار رقم ${occ + 1} من الكلمة دي في النص. الصوت ده بيشتغل على المكان ده بس.</div>
      <div class="vn-r"><button type="button" class="ds-b red" data-rec><i class="fa-solid fa-microphone"></i> تسجيل</button><span class="vn-t">00:00</span><audio controls hidden style="height:32px"></audio></div>
      <div style="display:flex;gap:8px"><button type="button" class="ds-b green" data-save disabled>حفظ</button><button type="button" class="ds-b ghost" data-x>إلغاء</button></div>
      <div style="margin-top:14px;padding-top:10px;border-top:1px solid #1e293b"><div class="ds-lbl">الملاحظات الصوتية الحالية في الفيلد ده</div><div data-list>...</div></div></div>`;
    document.body.appendChild(ov);
    ov.addEventListener('mousedown', e => { if (e.target === ov) closeRec(); });
    ov.querySelectorAll('[data-x]').forEach(b => b.onclick = closeRec);
    q('[data-rec]').onclick = toggleRec;
    q('[data-save]').onclick = async () => {
      if (!VN.blob) return;
      const btn = q('[data-save]'); btn.disabled = true;
      try {
        const key = `trainee_id=eq.${enc(c.tid)}&scope=eq.${enc(c.scope)}&word=eq.${enc(w)}&occ=eq.${occ}&status=eq.active`;
        const old = await (await sbFetch(`voice_notes?select=audio_url&${key}`)).json();
        const url = await uploadBlobToBucket(VN.blob, 'vn-' + w);
        const body = { trainee_id: c.tid, scope: c.scope, word: w, occ, start_idx: sel.start, audio_url: url, duration: VN.secs, status: 'active', updated_at: new Date().toISOString() };
        await upsertByKey('voice_notes', key, body);
        (Array.isArray(old) ? old : []).forEach(o => { const pth = urlToPath(o.audio_url); if (pth && o.audio_url !== url) fetch(`${SUPABASE_URL}/storage/v1/object/audio-files/${pth.split('/').map(enc).join('/')}`, { method: 'DELETE', headers: sbHeaders() }).catch(() => {}); });
        showToast('اتحفظت الملاحظة الصوتية ✓');
        VN.blob = null; q('audio').hidden = true; q('.vn-t').textContent = '00:00'; q('[data-rec]').innerHTML = '<i class="fa-solid fa-microphone"></i> تسجيل';
        loadList(c);
      } catch (e) { showToast('فشل الحفظ: ' + e.message + ' (شغّل 08_voice_notes.sql لو لسه)', true); btn.disabled = false; }
    };
    loadList(c);
  }
})();