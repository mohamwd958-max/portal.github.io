/* =====================================================================
   SIDEBAR BUTTON: view  (وجهة نظرك / Your Viewpoint)
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   الشاشة فيها زرارين:
   1) اقترح علينا  -> كارت واحد بيكتب فيه الاقتراح (بيطلّع event اسمه 'thabit:view-submit' زي ما كان).
   2) قيّمنا       -> بيفتح من يوم 25 لآخر الشهر (بتوقيت القاهرة، والسيرفر هو اللي بيقرر).
      الطالب بيختار من 1 لـ 5 نجوم ويكتب رأيه في الخدمة كلها: تقييم واحد في الشهر + تعديل واحد بس.
      بيتحفظ في Supabase (trainee_reviews) وبيروح للأدمن في Inbound يقبله أو يرفضه،
      واللي بيتقبل بس بيظهر في صفحة الـlanding باسمه الأول ورتبته.
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.view = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z"/>';
    ctx.IC.view = ICON;
    ctx.STR.en.i_view = 'Your Viewpoint'; ctx.STR.ar.i_view = 'وجهة نظرك';
    const button = '<button type="button" class="sdi st" data-k="view" data-title="i_view"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg></button>';

    /* ---- data (same project + token as the rest of the app) ---- */
    const SB = 'https://vkfexceitwjmxncwceqb.supabase.co';
    const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI';
    const tok = () => { try { return localStorage.getItem('thabit_trainee_token'); } catch (e) { return null; } };
    const rpc = (fn, body) => fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(r => r.json().catch(() => null).then(d => { if (!r.ok) throw new Error((d && d.message) || ('HTTP ' + r.status)); return d; }));
    const NOTE_KEY = 'thViewNote';   /* the first-time note was closed */

    const TX = {
      en: {
        sug: 'Suggest to us', sugSub: 'Suggestions to improve the site',
        rev: 'Rate us', revSub: 'Your stars and your opinion of the whole service',
        revClosed: m => 'Opens on ' + m + ' 25, until the end of the month',
        revSent: 'Your review for this month was sent', revEditable: 'You can still edit it once',
        back: 'Back', send: 'Send', save: 'Save the edit', edit: 'Edit my review (once)', noEdit: 'You used your one edit this month',
        sugTitle: 'Your suggestion', sugPh: 'Write your suggestion here...',
        revTitle: 'Your review', revPh: 'What do you think of the service?',
        stars: 'How many stars?',
        agree: 'I agree that my review, my first name and my rank appear on the landing page',
        pvTitle: 'This is how it will appear', pvEmpty: 'Your review will appear here...',
        yourName: 'Your name', thanks: 'Thank you, we received it.',
        st: { pending: 'Waiting for review', accepted: 'Published on the landing page', rejected: 'Not published' },
        note: 'You can leave one review a month, from the 25th to the end of the month, and edit it once. It is about the whole service, not just this month. We read it first, then it appears on our landing page with your first name and your rank.',
        ok: 'Got it', loading: 'Loading…', login: 'Please log in again.', fail: 'Something went wrong: ',
        rk: { trainee: 'Trainee', trainer: 'Trainer', admin: 'Admin' }
      },
      ar: {
        sug: 'اقترح علينا', sugSub: 'اقتراحات لتحسين الموقع',
        rev: 'قيّمنا', revSub: 'نجومك ورأيك في الخدمة كلها',
        revClosed: m => 'يفتح يوم 25 ' + m + ' لحد آخر الشهر',
        revSent: 'تقييمك للشهر ده اتبعت', revEditable: 'لسه تقدر تعدّله مرة واحدة',
        back: 'رجوع', send: 'إرسال', save: 'احفظ التعديل', edit: 'عدّل تقييمي (مرة واحدة)', noEdit: 'استخدمت التعديل بتاع الشهر ده',
        sugTitle: 'اقتراحك', sugPh: 'اكتب اقتراحك هنا...',
        revTitle: 'تقييمك', revPh: 'إيه رأيك في الخدمة؟',
        stars: 'كام نجمة؟',
        agree: 'موافق إن تقييمي واسمي الأول ورتبتي يظهروا في صفحة الـlanding',
        pvTitle: 'كده هيظهر', pvEmpty: 'تقييمك هيظهر هنا...',
        yourName: 'اسمك', thanks: 'شكرًا ليك، وصلنا.',
        st: { pending: 'مستني المراجعة', accepted: 'اتنشر في صفحة الموقع', rejected: 'ما اتنشرش' },
        note: 'ليك تقييم واحد في الشهر، من يوم 25 لآخر الشهر، وتقدر تعدّله مرة واحدة. التقييم عن الخدمة كلها مش عن الشهر ده بس. بنقراه الأول، وبعدين بيظهر في صفحة الموقع باسمك الأول ورتبتك.',
        ok: 'فهمت', loading: 'جاري التحميل…', login: 'سجّل دخول من جديد.', fail: 'حصلت مشكلة: ',
        rk: { trainee: 'متدرب', trainer: 'مدرب', admin: 'أدمن' }
      }
    };

    const CSS = `
      .vw-w{width:100%;max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:14px;padding:6px 0 30px}
      .vw-b{display:flex;flex-direction:column;gap:4px;align-items:flex-start;text-align:start;width:100%;padding:18px;border-radius:20px;background:var(--pcard);border:1px solid var(--sbd);color:var(--ink);cursor:pointer;font:800 15px Cairo,Inter,sans-serif}
      .vw-b small{font:600 12.5px Cairo,Inter,sans-serif;color:var(--ink2)}
      .vw-b[disabled]{opacity:.6;cursor:not-allowed}
      .vw-c{display:flex;flex-direction:column;gap:14px;padding:18px;border-radius:20px;background:var(--pcard);border:1px solid var(--sbd);color:var(--ink)}
      .vw-back{align-self:flex-start;background:none;border:0;padding:0;cursor:pointer;color:var(--ink2);font:700 13px Cairo,Inter,sans-serif}
      .vw-l{font:800 14px Cairo,Inter,sans-serif;color:var(--ink)}
      .vw-n{font:600 13px/1.7 Cairo,Inter,sans-serif;color:var(--ink2)}
      .vw-t{width:100%;min-height:130px;resize:vertical;box-sizing:border-box;border-radius:14px;border:1px solid var(--sbd);background:transparent;color:var(--ink);padding:12px;font:600 14px Cairo,Inter,sans-serif}
      .vw-ck{display:flex;gap:10px;align-items:flex-start;cursor:pointer;font:600 13px Cairo,Inter,sans-serif;color:var(--ink)}
      .vw-ck input{margin-top:3px;flex:none}
      .vw-pv{display:flex;flex-direction:column;gap:8px}
      .vw-card{display:flex;gap:10px;padding:14px;border-radius:16px;border:1px dashed var(--sbd)}
      .vw-av{width:38px;height:38px;flex:none;border-radius:50%;background:var(--sbd);display:grid;place-items:center;font:800 15px Cairo,Inter,sans-serif;color:var(--ink)}
      .vw-who{font:800 13.5px Cairo,Inter,sans-serif;color:var(--ink)}
      .vw-who span{font-weight:600;color:var(--ink2)}
      .vw-tx{font:600 13.5px Cairo,Inter,sans-serif;color:var(--ink);white-space:pre-wrap;word-break:break-word;margin-top:3px}
      .vw-tx.e{color:var(--ink2)}
      .vw-send{padding:13px;border-radius:14px;border:0;cursor:pointer;background:var(--ink);color:var(--pcard);font:800 14px Cairo,Inter,sans-serif}
      .vw-send.gh{background:transparent;color:var(--ink);border:1px solid var(--sbd)}
      .vw-send[disabled]{opacity:.4;cursor:not-allowed}
      .vw-st{display:flex;gap:6px;justify-content:center}
      .vw-st button{width:46px;height:46px;border:0;background:transparent;cursor:pointer;padding:4px;-webkit-tap-highlight-color:transparent;transition:transform .25s cubic-bezier(.2,.9,.3,1.4)}
      .vw-st button:active{transform:scale(.88)}
      .vw-st svg,.vw-sm svg{width:100%;height:100%;fill:none;stroke:var(--ink2);stroke-width:1.5;stroke-linejoin:round}
      .vw-st button.on svg,.vw-sm svg.on{fill:#fbbf24;stroke:#fbbf24}
      .vw-sm{display:inline-flex;gap:2px;vertical-align:middle}.vw-sm svg{width:14px;height:14px}
      .vw-tag{align-self:flex-start;padding:3px 10px;border-radius:999px;background:var(--sbd);font:700 11.5px Cairo,Inter,sans-serif;color:var(--ink)}
      .vw-tag.accepted{background:rgba(34,197,94,.18);color:#22c55e}.vw-tag.rejected{background:rgba(239,68,68,.15);color:#ef4444}
      .vw-note{padding:14px 16px;border-radius:16px;border:1px solid rgba(251,191,36,.45);background:rgba(251,191,36,.08);display:flex;flex-direction:column;gap:10px}
      .vw-note button{align-self:flex-end;border:0;background:transparent;color:#fbbf24;font:800 13px Cairo,Inter,sans-serif;cursor:pointer;padding:2px 4px}
    `;
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const STAR = '<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z"/>';
    const starsRow = n => '<span class="vw-sm">' + [1, 2, 3, 4, 5].map(i => '<svg viewBox="0 0 24 24" class="' + (i <= n ? 'on' : '') + '">' + STAR + '</svg>').join('') + '</span>';

    function render(b) {
      const L = ctx.lang(), T = TX[L] || TX.ar, ar = L !== 'en', dir = ar ? 'rtl' : 'ltr';
      if (!ctx.R.getElementById('thViewCss')) { const st = document.createElement('style'); st.id = 'thViewCss'; st.textContent = CSS; ctx.R.appendChild(st); }
      b.classList.remove('full');
      const prof = window.thProfile || {}, u = (ctx.cfg && ctx.cfg.getUser && ctx.cfg.getUser()) || {};
      const first = String(prof.trainee || u.name || u.username || '').trim().split(/\s+/)[0] || T.yourName;
      const rank = T.rk[prof.rank] || T.rk.trainee;
      const monthName = new Intl.DateTimeFormat(ar ? 'ar-EG' : 'en-US', { month: 'long', timeZone: 'Africa/Cairo' }).format(new Date());
      let W = null, view = 'menu', sent = false, busy = false;
      const wrap = inner => { b.innerHTML = '<div class="vw-w" dir="' + dir + '">' + inner + '</div>'; };
      const alive = () => b.isConnected && ctx.lang() === L;

      async function loadW() {
        if (!tok()) { W = { err: T.login }; return; }
        try { W = await rpc('trainee_review_get', { p_token: tok() }); if (!W) W = { err: T.login }; } catch (e) { W = { err: T.fail + e.message }; }
      }

      function menu() {
        view = 'menu';
        let dis = true, sub = T.loading;
        if (W && W.err) sub = W.err;
        else if (W && !W.open) sub = T.revClosed(monthName);
        else if (W && W.review) { dis = false; sub = T.revSent + ' · ' + (T.st[W.review.status] || ''); }
        else if (W) { dis = false; sub = T.revSub; }
        wrap('<button type="button" class="vw-b" data-go="sug">' + esc(T.sug) + '<small>' + esc(T.sugSub) + '</small></button>' +
          '<button type="button" class="vw-b" data-go="rev"' + (dis ? ' disabled' : '') + '>' + esc(T.rev) + '<small>' + esc(sub) + '</small></button>');
        b.querySelectorAll('[data-go]').forEach(x => x.addEventListener('click', () => { if (x.disabled) return; view = x.dataset.go; sent = false; view === 'sug' ? sugForm() : revView(false); }));
      }

      /* ---- suggestion (unchanged behaviour) ---- */
      function sugForm() {
        const head = '<button type="button" class="vw-back">' + esc(T.back) + '</button>';
        if (sent) { wrap('<div class="vw-c">' + head + '<div class="vw-l">' + esc(T.thanks) + '</div></div>'); b.querySelector('.vw-back').onclick = menu; return; }
        wrap('<div class="vw-c">' + head + '<div class="vw-l">' + esc(T.sugTitle) + '</div><textarea class="vw-t" placeholder="' + esc(T.sugPh) + '"></textarea><button type="button" class="vw-send" disabled>' + esc(T.send) + '</button></div>');
        const ta = b.querySelector('.vw-t'), send = b.querySelector('.vw-send');
        ta.oninput = () => { send.disabled = !ta.value.trim(); };
        b.querySelector('.vw-back').onclick = menu;
        send.onclick = () => {
          if (send.disabled) return;
          document.dispatchEvent(new CustomEvent('thabit:view-submit', { detail: { type: 'suggestion', text: ta.value.trim() } }));
          sent = true; sugForm();
        };
      }

      /* ---- review: the student's own review this month, or the form ---- */
      function revView(editing) {
        const r = W && W.review, head = '<button type="button" class="vw-back">' + esc(T.back) + '</button>';
        let noteShown = false; try { noteShown = localStorage.getItem(NOTE_KEY) === '1'; } catch (e) { }
        const note = noteShown ? '' : '<div class="vw-note"><div class="vw-n" style="color:var(--ink)">' + esc(T.note) + '</div><button type="button" class="vw-nok">' + esc(T.ok) + '</button></div>';
        if (r && !editing) {
          wrap(note + '<div class="vw-c">' + head + '<div class="vw-l">' + esc(T.revTitle) + '</div><span class="vw-tag ' + esc(r.status) + '">' + esc(T.st[r.status] || r.status) + '</span>' +
            '<div class="vw-card"><div class="vw-av">' + esc(first.charAt(0)) + '</div><div><div class="vw-who">' + esc(first) + ' <span>· ' + esc(rank) + '</span></div>' + starsRow(r.stars) + '<div class="vw-tx">' + esc(r.body) + '</div></div></div>' +
            (r.edits < 1 ? '<div class="vw-n">' + esc(T.revEditable) + '</div><button type="button" class="vw-send gh" data-edit="1">' + esc(T.edit) + '</button>' : '<div class="vw-n">' + esc(T.noEdit) + '</div>') + '</div>');
          wire(); const e = b.querySelector('[data-edit]'); if (e) e.onclick = () => revView(true);
          return;
        }
        let stars = r ? r.stars : 0;
        wrap(note + '<div class="vw-c">' + head + '<div class="vw-l">' + esc(T.revTitle) + '</div>' +
          '<div class="vw-n" style="text-align:center">' + esc(T.stars) + '</div><div class="vw-st">' + [1, 2, 3, 4, 5].map(i => '<button type="button" data-s="' + i + '" aria-label="' + i + '"><svg viewBox="0 0 24 24">' + STAR + '</svg></button>').join('') + '</div>' +
          '<textarea class="vw-t" maxlength="1500" placeholder="' + esc(T.revPh) + '">' + esc(r ? r.body : '') + '</textarea>' +
          '<label class="vw-ck"><input type="checkbox" class="vw-ok"><span>' + esc(T.agree) + '</span></label>' +
          '<div class="vw-pv"><div class="vw-n">' + esc(T.pvTitle) + '</div><div class="vw-card"><div class="vw-av">' + esc(first.charAt(0)) + '</div><div><div class="vw-who">' + esc(first) + ' <span>· ' + esc(rank) + '</span></div><span class="vw-pvs"></span><div class="vw-tx e">' + esc(T.pvEmpty) + '</div></div></div></div>' +
          '<button type="button" class="vw-send" disabled>' + esc(r ? T.save : T.send) + '</button><div class="vw-n vw-msg" role="status"></div></div>');
        wire();
        const ta = b.querySelector('.vw-t'), ok = b.querySelector('.vw-ok'), send = b.querySelector('.vw-send'), tx = b.querySelector('.vw-tx'), pvs = b.querySelector('.vw-pvs'), msg = b.querySelector('.vw-msg');
        const sync = () => {
          const has = ta.value.trim().length > 0;
          b.querySelectorAll('.vw-st button').forEach(x => x.classList.toggle('on', +x.dataset.s <= stars));
          pvs.innerHTML = stars ? starsRow(stars) : '';
          tx.textContent = has ? ta.value.trim() : T.pvEmpty; tx.classList.toggle('e', !has);
          send.disabled = busy || !(has && stars && ok.checked);
        };
        b.querySelector('.vw-st').onclick = e => { const x = e.target.closest('[data-s]'); if (x) { stars = +x.dataset.s; sync(); } };
        ta.oninput = sync; ok.onchange = sync; sync();
        send.onclick = async () => {
          if (send.disabled) return;
          busy = true; sync(); msg.textContent = T.loading;
          try { W = await rpc('trainee_review_save', { p_token: tok(), p_stars: stars, p_body: ta.value.trim() }); busy = false; if (alive()) revView(false); }
          catch (e) { busy = false; if (alive()) { msg.textContent = T.fail + e.message; sync(); } }
        };
      }
      function wire() {
        const bk = b.querySelector('.vw-back'); if (bk) bk.onclick = menu;
        const n = b.querySelector('.vw-nok'); if (n) n.onclick = () => { try { localStorage.setItem(NOTE_KEY, '1'); } catch (e) { } const c = b.querySelector('.vw-note'); if (c) c.remove(); };
      }

      menu();
      loadW().then(() => { if (alive() && view === 'menu') menu(); });
    }

    return { id: 'view', button: button, render: render };
  };
})();
