/* =====================================================================
   SIDEBAR BUTTON: finance  (الاسم بالعربي: كتمنَّص)
   الأيقونة + الاسم + شاشة الفواتير: الفاتورة الحالية، الفواتير السابقة، تحميل PDF، مشاركة، والدفع ورفع الإيصال.
   البيانات من Supabase: trainee_bills / trainee_bill_claim / trainee_bill_receipt.
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.finance = function (ctx) {
    const ICON = '<path d="M4 7a2 2 0 0 1 2-2h11v3"/><path d="M4 7v10a2 2 0 0 0 2 2h12.5a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 18.5 8H6a2 2 0 0 1-2-1z"/><circle cx="16.2" cy="13.5" r="1.1" fill="currentColor"/>';
    ctx.IC.finance = ICON;
    ctx.STR.en.i_finance = 'Finance'; ctx.STR.ar.i_finance = '\u0643\u062A\u0645\u0646\u064E\u0651\u0635';
    const button = '<button type="button" class="sdi st sup lbl" data-k="finance"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg><span data-t="i_finance"></span></button>';

    const URL_ = 'https://vkfexceitwjmxncwceqb.supabase.co';
    const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI';
    const tok = () => { try { return localStorage.getItem('thabit_trainee_token'); } catch (e) { return null; } };
    const rpc = (n, body) => fetch(URL_ + '/rest/v1/rpc/' + n, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.status === 204 ? null : r.json(); });

    const TX = {
      en: { prev: 'Previous bills', noBills: 'No bills yet.', noPrev: 'No previous bills yet.', load: 'Loading…', err: 'Could not load your bills.', retry: 'Try again',
        inv: m => 'Invoice for ' + m, sub: 'Subscription', disc: 'Discount', total: 'Total', cur: 'EGP',
        intro: (a, m) => 'The amount due is ' + a + ' EGP for your ' + m + ' subscription.',
        ask: d => 'Kindly pay on or before the 7th of ' + d + '.',
        paidOn: d => 'Payment received on ' + d + '.', thanks: 'Thank you for your trust in us.',
        paid: 'Paid', late: 'Overdue', rcv: 'Receipt received. We will review it and confirm your payment.',
        dl: 'Download PDF', sh: 'Share', pay: 'I paid / I want to pay', want: 'I want to pay', did: 'I already paid',
        numT: 'Send the amount to this number (Vodafone Cash or InstaPay):', copy: 'Copy', copied: 'Copied ✓',
        waiting: 'We are waiting for you to upload the screenshot of the payment receipt.', didT: 'Please upload the receipt or proof of payment.',
        pick: 'Choose the receipt image', up: 'Uploading…', done: 'Receipt sent ✓ We will confirm shortly.', big: 'File is too large (max 8 MB).', fail: 'Upload failed, try again.' },
      ar: { prev: 'فواتيري السابقة', noBills: 'لا توجد فواتير بعد.', noPrev: 'لا توجد فواتير سابقة بعد.', load: 'جاري التحميل…', err: 'تعذّر تحميل الفواتير.', retry: 'حاول تاني',
        inv: m => 'فاتورة شهر ' + m, sub: 'الاشتراك', disc: 'الخصم', total: 'الإجمالي', cur: 'جنيه مصري',
        intro: (a, m) => 'المطلوب منك مبلغ ' + a + ' جنيه مصري عن اشتراك شهر ' + m + '.',
        ask: d => 'يرجى السداد بحلول يوم أو قبل السابع من ' + d + '.',
        paidOn: d => 'تم استلام المبلغ بتاريخ ' + d + '.', thanks: 'شكرًا لك على ثقتك بنا',
        paid: 'تم السداد', late: 'متأخرة', rcv: 'وصلنا الإيصال، هنراجعه ونأكد الدفع.',
        dl: 'تحميل PDF', sh: 'مشاركة', pay: 'دفعت / عايز أدفع', want: 'عايز أدفع', did: 'دفعت',
        numT: 'حوّل المبلغ على الرقم ده (فودافون كاش أو إنستا باي):', copy: 'نسخ', copied: 'اتنسخ ✓',
        waiting: 'هنستنى منك صورة (سكرين شوت) إيصال الدفع.', didT: 'ابعت صورة الإيصال أو وصل الاستلام اللي بيثبت الدفع.',
        pick: 'اختار صورة الإيصال', up: 'جاري الرفع…', done: 'اتبعت الإيصال ✓ هنأكد الدفع قريب.', big: 'الملف كبير (الحد الأقصى 8 ميجا).', fail: 'فشل الرفع، حاول تاني.' }
    };
    const CSS = `
      .fin-w{width:100%;max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:22px;padding:30px 0 30px}
      .fin-c{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:20px;background:var(--pcard);border:1px solid var(--sbd);color:var(--ink)}
      .fin-l{font:800 14px Cairo,Inter,sans-serif;color:var(--ink)}
      .fin-e{font:600 13.5px Cairo,Inter,sans-serif;color:var(--ink2);padding:2px 0}
      .fin-h{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;background:none;border:0;padding:0;margin:0;cursor:pointer;color:var(--ink);font:800 14px Cairo,Inter,sans-serif;text-align:start}
      .fin-h svg{width:18px;height:18px;flex:none;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s}
      .fin-h[aria-expanded="true"] svg{transform:rotate(180deg)}
      .fin-b[hidden],.fin-pay[hidden],.fin-up[hidden],.fin-num[hidden]{display:none}
      .fin-rc{display:flex;flex-direction:column;gap:10px;padding:22px;border-radius:18px;border:1.5px solid var(--sbd);background:var(--pcard);color:var(--ink);font:600 13.5px/1.9 Cairo,Inter,sans-serif}
      .fin-br{font:800 22px Inter,sans-serif;direction:ltr;text-align:left}
      .fin-nm{font:700 15px Cairo,Inter,sans-serif;direction:ltr;text-align:left;unicode-bidi:plaintext}
      .fin-iv{font:700 13.5px Cairo,Inter,sans-serif;color:var(--ink2);direction:ltr;text-align:left;unicode-bidi:plaintext}
      .fin-ln{display:flex;justify-content:space-between;gap:10px;color:var(--ink2)}.fin-ln b{color:var(--ink);font-weight:800}
      .fin-ln.t{border-top:1px solid var(--sbd);padding-top:8px;margin-top:4px;font-size:15px}
      .fin-p{margin:4px 0 0;color:var(--ink)}.fin-th{font-weight:800;margin-top:6px}
      .fin-st{align-self:flex-start;padding:2px 12px;border-radius:999px;font:800 12px Cairo,Inter,sans-serif;border:1px solid currentColor}.fin-st.ok{color:#22c55e}.fin-st.late{color:#ef4444}
      .fin-ac{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
      .fin-btn{display:inline-flex;align-items:center;justify-content:center;height:38px;padding:0 16px;border-radius:19px;border:1px solid var(--sbd);background:transparent;color:var(--ink);font:800 12.5px Cairo,Inter,sans-serif;cursor:pointer}
      .fin-btn.pr{background:#f97316;border-color:#f97316;color:#fff}
      .fin-pay{display:flex;flex-direction:column;gap:10px;padding-top:6px}
      .fin-num{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:14px;border:1px dashed var(--sbd)}
      .fin-num span{font:800 17px Inter,sans-serif;direction:ltr;letter-spacing:.04em}
      .fin-msg{color:var(--ink2);font:600 12.5px/1.8 Cairo,Inter,sans-serif}
    `;
    let DATA = null, ERR = false, BOX = null;

    const mlabel = (per, ar) => new Intl.DateTimeFormat(ar ? 'ar-EG-u-nu-latn' : 'en-US', { month: 'long', year: 'numeric' }).format(new Date(per + '-01T12:00:00'));
    const dlabel = (d, ar) => { try { return new Intl.DateTimeFormat(ar ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d)); } catch (e) { return ''; } };
    const num = v => String(Number(v)).replace(/\.0+$/, '');
    const cairoToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
    const isLate = b => b.status !== 'paid' && cairoToday() > String(b.due_on).slice(0, 10);

    /* ---------- one bill, as a receipt in a single border ---------- */
    function billHtml(b, T, ar) {
      const esc = ctx.esc, m = mlabel(b.period, ar), amt = num(b.amount);
      const lines = '<div class="fin-ln"><span>' + esc(T.sub) + '</span><b>' + esc(num(b.base) + ' ' + T.cur) + '</b></div>' +
        (Number(b.discount) > 0 ? '<div class="fin-ln"><span>' + esc(T.disc) + '</span><b>-' + esc(num(b.discount) + ' ' + T.cur) + '</b></div>' : '') +
        '<div class="fin-ln t"><span>' + esc(T.total) + '</span><b>' + esc(amt + ' ' + T.cur) + '</b></div>';
      const status = b.status === 'paid' ? '<span class="fin-st ok">' + esc(T.paid) + '</span>' : isLate(b) ? '<span class="fin-st late">' + esc(T.late) + '</span>' : '';
      const para = b.status === 'paid' ? T.paidOn(dlabel(b.paid_at || b.due_on, ar)) : T.intro(amt, m) + ' ' + T.ask(m);
      let pay = '';
      if (b.status !== 'paid') {
        pay = b.status === 'receipt_sent' ? '<div class="fin-msg">' + esc(T.rcv) + '</div>' :
          '<button type="button" class="fin-btn pr" data-fin="payopen">' + esc(T.pay) + '</button>' +
          '<div class="fin-pay" hidden data-bill="' + b.id + '">' +
            '<div class="fin-ac"><button type="button" class="fin-btn" data-fin="want">' + esc(T.want) + '</button><button type="button" class="fin-btn" data-fin="did">' + esc(T.did) + '</button></div>' +
            '<div class="fin-num" hidden><span>' + esc(DATA.pay_number) + '</span><button type="button" class="fin-btn" data-fin="copy">' + esc(T.copy) + '</button></div>' +
            '<div class="fin-msg" data-fin-note></div>' +
            '<div class="fin-up" hidden><label class="fin-btn pr">' + esc(T.pick) + '<input type="file" accept="image/*,application/pdf" hidden data-fin="file"></label></div>' +
          '</div>';
      }
      return '<div class="fin-rc" dir="' + (ar ? 'rtl' : 'ltr') + '">' +
        '<div class="fin-br">Thabit</div><div class="fin-nm">' + esc(DATA.name || '') + '</div><div class="fin-iv">' + esc(T.inv(m)) + '</div>' + status + lines +
        '<p class="fin-p">' + esc(para) + '</p><div class="fin-th">' + esc(T.thanks) + '</div>' +
        '<div class="fin-ac"><button type="button" class="fin-btn" data-fin="dl" data-id="' + b.id + '">' + esc(T.dl) + '</button><button type="button" class="fin-btn" data-fin="share" data-id="' + b.id + '">' + esc(T.sh) + '</button></div>' + pay + '</div>';
    }

    /* ---------- PDF: the bill is drawn on a canvas (so Arabic is shaped by the browser), then wrapped in a one-page PDF ---------- */
    async function drawBill(b, T, ar) {
      try { await Promise.all([document.fonts.load('700 40px Cairo'), document.fonts.load('400 30px Cairo')]); } catch (e) { }
      const W = 1240, H = 1754, M = 110, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
      c.fillStyle = '#fff'; c.fillRect(0, 0, W, H);
      const RT = /[\u0600-\u06FF]/;
      const tx = (s, x, y, font, col, al) => { c.font = font; c.fillStyle = col; c.textAlign = al; c.direction = RT.test(s) ? 'rtl' : 'ltr'; c.fillText(s, x, y); };
      const wrap = (s, w) => { const out = []; let cur = ''; s.split(' ').forEach(x => { const t = cur ? cur + ' ' + x : x; if (c.measureText(t).width > w && cur) { out.push(cur); cur = x; } else cur = t; }); if (cur) out.push(cur); return out; };
      const m = mlabel(b.period, ar), amt = num(b.amount), F = 'Cairo, Inter, sans-serif';
      tx('Thabit', M, 160, '800 70px Inter, sans-serif', '#111', 'left');
      tx(DATA.name || '', M, 235, '700 44px ' + F, '#111', 'left');
      tx(T.inv(m), M, 295, '600 38px ' + F, '#555', 'left');
      const row = (l, v, y, bold) => { const f = (bold ? '800 ' : '600 ') + (bold ? 42 : 38) + 'px ' + F;
        tx(l, ar ? W - M : M, y, f, '#444', ar ? 'right' : 'left'); tx(v, ar ? M : W - M, y, f, '#111', ar ? 'left' : 'right'); };
      let y = 470; row(T.sub, num(b.base) + ' ' + T.cur, y); y += 70;
      if (Number(b.discount) > 0) { row(T.disc, '-' + num(b.discount) + ' ' + T.cur, y); y += 70; }
      c.fillStyle = '#ccc'; c.fillRect(M, y - 38, W - 2 * M, 2); y += 22; row(T.total, amt + ' ' + T.cur, y, true); y += 120;
      const para = b.status === 'paid' ? T.paidOn(dlabel(b.paid_at || b.due_on, ar)) : T.intro(amt, m) + ' ' + T.ask(m);
      c.font = '600 38px ' + F;
      wrap(para, W - 2 * M).forEach(l => { tx(l, ar ? W - M : M, y, '600 38px ' + F, '#222', ar ? 'right' : 'left'); y += 66; });
      y += 70; tx(T.thanks, ar ? W - M : M, y, '800 42px ' + F, '#111', ar ? 'right' : 'left');
      if (b.status === 'paid') tx(T.paid, ar ? W - M : M, y + 90, '800 48px ' + F, '#16a34a', ar ? 'right' : 'left');
      return cv;
    }
    function makePdf(cv) {
      const bin = atob(cv.toDataURL('image/jpeg', 0.92).split(',')[1]), jpg = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) jpg[i] = bin.charCodeAt(i);
      const enc = new TextEncoder(), parts = [], off = []; let len = 0;
      const put = u => { parts.push(u); len += u.length; }, s = x => put(enc.encode(x));
      const obj = (n, fn) => { off[n] = len; s(n + ' 0 obj\n'); fn(); s('endobj\n'); };
      s('%PDF-1.4\n');
      obj(1, () => s('<< /Type /Catalog /Pages 2 0 R >>\n'));
      obj(2, () => s('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n'));
      obj(3, () => s('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\n'));
      const content = 'q 595 0 0 842 0 0 cm /Im0 Do Q';
      obj(4, () => s('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream\n'));
      obj(5, () => { s('<< /Type /XObject /Subtype /Image /Width ' + cv.width + ' /Height ' + cv.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpg.length + ' >>\nstream\n'); put(jpg); s('\nendstream\n'); });
      const xr = len; s('xref\n0 6\n0000000000 65535 f \n'); for (let i = 1; i <= 5; i++) s(String(off[i]).padStart(10, '0') + ' 00000 n \n');
      s('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF');
      return new Blob(parts, { type: 'application/pdf' });
    }
    async function pdfFor(id) {
      const L = ctx.lang(), ar = L !== 'en', T = TX[L] || TX.ar, b = DATA.bills.find(x => String(x.id) === String(id)); if (!b) return null;
      return { blob: makePdf(await drawBill(b, T, ar)), name: 'Thabit-Bill-' + b.period + '.pdf' };
    }
    function saveBlob(f) { const a = document.createElement('a'); a.href = URL.createObjectURL(f.blob); a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 1500); }

    /* ---------- payment: copy the number -> wait for the receipt screenshot -> upload ---------- */
    async function upload(file, bill, pay, T) {
      const note = pay.querySelector('[data-fin-note]');
      if (file.size > 8 * 1024 * 1024) { note.textContent = T.big; return; }
      note.textContent = T.up;
      try {
        const ext = ({ 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic', 'application/pdf': 'pdf' })[file.type] || 'jpg';
        const path = 'r/' + DATA.tid + '/' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2)) + '.' + ext;
        const r = await fetch(URL_ + '/storage/v1/object/receipts/' + path, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': file.type || 'image/jpeg' }, body: file });
        if (!r.ok) throw new Error(r.status);
        if (!(await rpc('trainee_bill_receipt', { p_token: tok(), p_bill: bill, p_path: path }))) throw new Error('receipt');
        note.textContent = T.done; await load(); setTimeout(paint, 1200);
      } catch (e) { note.textContent = T.fail; }
    }
    function onClick(e) {
      const el = e.target.closest('[data-fin]'); if (!el || !BOX) return;
      const L = ctx.lang(), T = TX[L] || TX.ar, k = el.dataset.fin, rc = el.closest('.fin-rc');
      if (k === 'retry') { load().then(paint); return; }
      if (k === 'dl' || k === 'share') {
        pdfFor(el.dataset.id).then(f => {
          if (!f) return;
          if (k === 'share' && navigator.canShare && navigator.share) {
            const file = new File([f.blob], f.name, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: f.name }).catch(() => { }); return; }
          }
          saveBlob(f);
        }).catch(() => { });
        return;
      }
      if (!rc) return;
      const pay = rc.querySelector('.fin-pay'); if (!pay) return;
      const bill = +pay.dataset.bill, note = pay.querySelector('[data-fin-note]'), up = pay.querySelector('.fin-up'), numBox = pay.querySelector('.fin-num');
      if (k === 'payopen') { pay.hidden = !pay.hidden; }
      else if (k === 'want') { numBox.hidden = false; up.hidden = true; note.textContent = T.numT; rpc('trainee_bill_claim', { p_token: tok(), p_bill: bill, p_kind: 'pay' }).catch(() => { }); }
      else if (k === 'did') { numBox.hidden = true; up.hidden = false; note.textContent = T.didT; rpc('trainee_bill_claim', { p_token: tok(), p_bill: bill, p_kind: 'paid' }).catch(() => { }); }
      else if (k === 'copy') {
        const done = () => { el.textContent = T.copied; up.hidden = false; note.textContent = T.waiting; };
        const txt = DATA.pay_number;
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done);
        else { try { const a = document.createElement('textarea'); a.value = txt; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); } catch (x) { } done(); }
      }
    }
    function onChange(e) {
      const f = e.target.closest('[data-fin="file"]'); if (!f || !f.files[0]) return;
      const pay = f.closest('.fin-pay'); upload(f.files[0], +pay.dataset.bill, pay, TX[ctx.lang()] || TX.ar);
    }

    function paint() {
      if (!BOX) return;
      const L = ctx.lang(), T = TX[L] || TX.ar, ar = L !== 'en', esc = ctx.esc, b = BOX;
      if (!ctx.R.getElementById('thFinCss')) { const st = document.createElement('style'); st.id = 'thFinCss'; st.textContent = CSS; ctx.R.appendChild(st); }
      b.classList.remove('full');
      let body;
      if (ERR) body = '<div class="fin-c"><div class="fin-e">' + esc(T.err) + '</div><button type="button" class="fin-btn" data-fin="retry">' + esc(T.retry) + '</button></div>';
      else if (!DATA) body = '<div class="fin-c"><div class="fin-e">' + esc(T.load) + '</div></div>';
      else {
        const bills = DATA.bills || [], cur = bills[0], prev = bills.slice(1);
        body = (cur ? billHtml(cur, T, ar) : '<div class="fin-c"><div class="fin-e">' + esc(T.noBills) + '</div></div>') +
          '<div class="fin-c"><div class="fin-l">' + esc(T.prev) + '</div>' + (prev.length ? prev.map(x =>
            '<div class="fin-h2"><button type="button" class="fin-h" aria-expanded="false" data-fin="tog"><span>' + esc(mlabel(x.period, ar)) + (x.status === 'paid' ? ' ✓' : '') + '</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button><div class="fin-b" hidden>' + billHtml(x, T, ar) + '</div></div>').join('') : '<div class="fin-e">' + esc(T.noPrev) + '</div>') + '</div>';
      }
      b.innerHTML = '<div class="fin-w" dir="' + (ar ? 'rtl' : 'ltr') + '">' + body + '</div>';
    }
    async function load() {
      try { const t = tok(); if (!t) throw new Error('no token'); const r = await rpc('trainee_bills', { p_token: t }); if (!r) throw new Error('empty'); DATA = r; ERR = false; }
      catch (e) { ERR = true; }
    }
    function render(b) {
      if (BOX !== b) { BOX = b; b.addEventListener('click', e => { const h = e.target.closest('[data-fin="tog"]'); if (h) { const o = h.getAttribute('aria-expanded') === 'true'; h.setAttribute('aria-expanded', o ? 'false' : 'true'); h.nextElementSibling.hidden = o; return; } onClick(e); }); b.addEventListener('change', onChange); }
      paint(); load().then(paint);
    }

    return { id: 'finance', button: button, render: render };
  };
})();
