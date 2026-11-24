/* =====================================================================
   SIDEBAR BUTTON: view
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + زرار الشريط العلوي + نصوص الكروت + الشاشة بتاعته.
   لو عايز تعدّل في الزرار ده، ابعت الملف ده بس.

   لازم يتحط في فولدر js/buttons/، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/buttons/btn-view.js"></script>
   و index.html بينده عليه بـ ctx = { R, $, lang, STR, IC, ucPage, userName? }

   الشاشة فيها زرارين:
   1) اقترح علينا  -> كارت واحد بيكتب فيه الاقتراح.
   2) أضف تعليقًا  -> بيفتح أول كل شهر (أول OPEN_DAYS أيام) وبيعلّق على الشهر اللي خلص.
      التعليق بيظهر للناس في صفحة الـlanding، ولازم المتدرب يوافق على كده وعلى ظهور اسمه عشان يكمّل.
   لما يتبعت أي حاجة، الملف بيطلّع event اسمه 'thabit:view-submit' على document وفيه detail = { type, text, month, role, showName, name }
   ومن هناك تربطه بالسيرفر/الداتابيز.
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.view = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z"/>';
    ctx.IC.view = ICON;
    ctx.STR.en.i_view = 'Your Viewpoint'; ctx.STR.ar.i_view = 'وجهة نظرك';
    const button = '<button type="button" class="sdi st" data-k="view" data-title="i_view"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON + '</svg></button>';

    /* ---- settings ---- */
    const OPEN_DAYS = 7;          /* التعليق بيفتح أول كام يوم من الشهر */
    const ROLE = 'trainee';       /* الصفة الافتراضية */

    const TX = {
      en: {
        sug: 'Suggest to us', sugSub: 'Suggestions to improve the site',
        cmt: 'Add a comment', cmtSub: 'Your comment on the program for last month',
        cmtOpenOn: function (day, m) { return 'Opens on ' + m + ' 1 for your comment on ' + day; },
        cmtDone: function (m) { return 'Your comment on ' + m + ' was sent. Thank you!'; },
        back: 'Back', send: 'Send',
        sugTitle: 'Your suggestion', sugPh: 'Write your suggestion here...',
        cmtTitle: function (m) { return 'Your comment on ' + m; }, cmtPh: 'Write your comment about the program here...',
        notice: 'Your comment will be shown to visitors on our landing page.',
        agree: 'I agree that my comment and my name appear on the landing page',
        pvTitle: 'This is how it will appear', pvEmpty: 'Your comment will appear here...',
        yourName: 'Your name', trainee: 'Trainee', thanks: 'Thank you, we received it.'
      },
      ar: {
        sug: 'اقترح علينا', sugSub: 'اقتراحات لتحسين الموقع',
        cmt: 'أضف تعليقًا', cmtSub: 'تعليقك على البرنامج عن الشهر اللي فات',
        cmtOpenOn: function (day, m) { return 'يفتح يوم 1 ' + m + ' عشان تعلّق على ' + day; },
        cmtDone: function (m) { return 'تم إرسال تعليقك عن ' + m + '. شكرًا ليك!'; },
        back: 'رجوع', send: 'إرسال',
        sugTitle: 'اقتراحك', sugPh: 'اكتب اقتراحك هنا...',
        cmtTitle: function (m) { return 'تعليقك عن ' + m; }, cmtPh: 'اكتب تعليقك عن البرنامج هنا...',
        notice: 'تعليقك هيظهر للناس في صفحة الـlanding بتاعتنا.',
        agree: 'موافق إن تعليقي واسمي يظهروا في صفحة الـlanding',
        pvTitle: 'كده هيظهر', pvEmpty: 'تعليقك هيظهر هنا...',
        yourName: 'اسمك', trainee: 'متدرب', thanks: 'شكرًا ليك، وصلنا.'
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
      .vw-n{font:600 13px Cairo,Inter,sans-serif;color:var(--ink2)}
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
      .vw-send[disabled]{opacity:.4;cursor:not-allowed}
    `;
    const esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

    function render(b) {
      const L = ctx.lang(), T = TX[L] || TX.ar, ar = L !== 'en';
      if (!ctx.R.getElementById('thViewCss')) { const st = document.createElement('style'); st.id = 'thViewCss'; st.textContent = CSS; ctx.R.appendChild(st); }
      b.classList.remove('full');

      const now = new Date();
      const fmt = function (d, o) { return new Intl.DateTimeFormat(ar ? 'ar-EG-u-nu-latn' : 'en-US', o).format(d); };
      const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevLbl = fmt(prevD, { month: 'long', year: 'numeric' });                         /* الشهر اللي خلص */
      const prevKey = prevD.getFullYear() + '-' + (prevD.getMonth() + 1);
      const curLbl = fmt(now, { month: 'long', year: 'numeric' });                            /* الشهر الحالي */
      const nextMon = fmt(new Date(now.getFullYear(), now.getMonth() + 1, 1), { month: 'long' });
      const isOpen = now.getDate() <= OPEN_DAYS;
      const LS = 'thViewCmt';
      let doneKey = ''; try { doneKey = localStorage.getItem(LS) || ''; } catch (e) {}
      const name = (ctx.userName || '').trim();

      let view = 'menu', sent = false;

      function menu() {
        const already = isOpen && doneKey === prevKey;
        const cmtDisabled = !isOpen || already;
        const cmtSub = !isOpen ? T.cmtOpenOn(curLbl, nextMon) : already ? T.cmtDone(prevLbl) : T.cmtSub;
        b.innerHTML = '<div class="vw-w" dir="' + (ar ? 'rtl' : 'ltr') + '">' +
          '<button type="button" class="vw-b" data-go="sug">' + esc(T.sug) + '<small>' + esc(T.sugSub) + '</small></button>' +
          '<button type="button" class="vw-b" data-go="cmt"' + (cmtDisabled ? ' disabled' : '') + '>' + esc(T.cmt) + '<small>' + esc(cmtSub) + '</small></button></div>';
        b.querySelectorAll('[data-go]').forEach(function (x) {
          x.addEventListener('click', function () { if (x.disabled) return; view = x.getAttribute('data-go'); sent = false; form(); });
        });
      }

      function form() {
        const isC = view === 'cmt';
        const head = '<button type="button" class="vw-back">' + esc(T.back) + '</button>';
        if (sent) {
          b.innerHTML = '<div class="vw-w" dir="' + (ar ? 'rtl' : 'ltr') + '"><div class="vw-c">' + head + '<div class="vw-l">' + esc(isC ? T.cmtDone(prevLbl) : T.thanks) + '</div></div></div>';
          b.querySelector('.vw-back').addEventListener('click', function () { view = 'menu'; menu(); });
          return;
        }
        const shownName = name || T.yourName;
        b.innerHTML = '<div class="vw-w" dir="' + (ar ? 'rtl' : 'ltr') + '"><div class="vw-c">' + head +
          '<div class="vw-l">' + esc(isC ? T.cmtTitle(prevLbl) : T.sugTitle) + '</div>' +
          (isC ? '<div class="vw-n">' + esc(T.notice) + '</div>' : '') +
          '<textarea class="vw-t" placeholder="' + esc(isC ? T.cmtPh : T.sugPh) + '"></textarea>' +
          (isC ? '<label class="vw-ck"><input type="checkbox" class="vw-ok"><span>' + esc(T.agree) + '</span></label>' +
            '<div class="vw-pv"><div class="vw-n">' + esc(T.pvTitle) + '</div><div class="vw-card"><div class="vw-av">' + esc(shownName.charAt(0)) + '</div>' +
            '<div><div class="vw-who">' + esc(shownName) + ' <span>· ' + esc(T.trainee) + '</span></div><div class="vw-tx e">' + esc(T.pvEmpty) + '</div></div></div></div>' : '') +
          '<button type="button" class="vw-send" disabled>' + esc(T.send) + '</button></div></div>';

        const ta = b.querySelector('.vw-t'), ok = b.querySelector('.vw-ok'), send = b.querySelector('.vw-send'), tx = b.querySelector('.vw-tx');
        function sync() {
          const has = ta.value.trim().length > 0;
          send.disabled = !(has && (!isC || ok.checked));
          if (tx) { tx.textContent = has ? ta.value.trim() : T.pvEmpty; tx.classList.toggle('e', !has); }
        }
        ta.addEventListener('input', sync);
        if (ok) ok.addEventListener('change', sync);
        b.querySelector('.vw-back').addEventListener('click', function () { view = 'menu'; menu(); });
        send.addEventListener('click', function () {
          if (send.disabled) return;
          document.dispatchEvent(new CustomEvent('thabit:view-submit', { detail: {
            type: isC ? 'comment' : 'suggestion', text: ta.value.trim(),
            month: isC ? prevKey : null, role: isC ? ROLE : null, showName: isC, name: isC ? name : null
          } }));
          if (isC) { try { localStorage.setItem(LS, prevKey); } catch (e) {} doneKey = prevKey; }
          sent = true; form();
        });
      }

      menu();
    }

    return { id: 'view', button: button, render: render };
  };
})();
