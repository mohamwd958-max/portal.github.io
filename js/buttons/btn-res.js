/* =====================================================================
   SIDEBAR BUTTON: res  (الموارد / Resources)
   الملف ده هو الزرار كله: الأيقونة + الاسم (EN/AR) + الشاشة بتاعته.
   الشاشة = 3 كروت: TEFL (النصوص) + نوتس (الملاحظات) + خربشات.
   (TEFL والنوتس اتنقلوا هنا من العلامات الحيوية. الكود المشترك بتاعهم في js/buttons/lists-core.js)

   الخربشات لسه مش متوصّلة بمصدر: غيّر SCR_RPC تحت لما نعرف بتيجي منين.

   لازم يتحط في فولدر js/buttons/، وبيتحمّل قبل الـscript الرئيسي:  <script src="js/buttons/btn-res.js"></script>
   ومعاه js/buttons/lists-core.js (لازم يكون موجود ومتحمّل في home.html).
   ===================================================================== */
(function () {
  window.ThabitBtn = window.ThabitBtn || {};
  window.ThabitBtn.res = function (ctx) {
    /* ---- identity: icon + names ---- */
    const ICON = '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2.2h8A1.5 1.5 0 0 1 20.5 9.7V17.5A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"/>';
    ctx.IC.res = ICON;
    ctx.STR.en.i_res = 'Resources'; ctx.STR.ar.i_res = 'الموارد';
    ctx.STR.en.tefl = 'TEFL'; ctx.STR.ar.tefl = 'TEFL';
    ctx.STR.en.notes = 'Notes'; ctx.STR.ar.notes = 'نوتس';
    ctx.STR.en.scrib = 'Scribbles'; ctx.STR.ar.scrib = 'خربشات';

    /* ---- the 3 cards (TEFL + Notes read their column from trainee_dashboard; Scribbles has its own source) ---- */
    const SCR_RPC = null;   /* <-- اسم الـRPC (بياخد { p_token } ويرجّع مصفوفة)، أو حقل scratches جوه نتيجة trainee_dashboard. كل عنصر: { image_url | url | image | src, title?, date | created_at } */
    const okImg = u => /^(https?:\/\/|data:image\/)/i.test(String(u || ''));
    const L = window.ThabitLists;
    if (L) {
      L.add({ key: 'tefl', col: 'tefl', title: { en: ctx.STR.en.tefl, ar: ctx.STR.ar.tefl } });
      L.add({ key: 'notes', col: 'notes', title: { en: ctx.STR.en.notes, ar: ctx.STR.ar.notes } });
      L.add({
        key: 'scrib', noear: true, title: { en: ctx.STR.en.scrib, ar: ctx.STR.ar.scrib }, none: { en: 'No scribbles yet', ar: 'لسه مفيش خربشات' },
        css: '.vsw .scrv{overflow:auto;max-height:60vh;border-radius:12px;background:rgba(148,163,184,.08);text-align:center;cursor:zoom-in}.vsw .scrimg{max-width:100%;height:auto;display:inline-block}.vsw .scrv.scrz{cursor:zoom-out}.vsw .scrv.scrz .scrimg{max-width:none}',
        list: (D, api) => (Array.isArray(D.scratches) ? Promise.resolve(D.scratches) : (SCR_RPC ? api.rpc(SCR_RPC, { p_token: api.tok() }).catch(() => []) : Promise.resolve([])))
          .then(a => (Array.isArray(a) ? a : []).map(x => ({ url: x.image_url || x.url || x.image || x.src || '', title: x.title || '', date: String(x.date || x.created_at || '').slice(0, 10) })).filter(x => okImg(x.url)).sort((a, b) => b.date.localeCompare(a.date))),
        preview: x => x.title || '🖼',
        body: (x, esc) => (x.title ? '<div class="sm" dir="auto" style="margin-bottom:6px">' + esc(x.title) + '</div>' : '') + '<div class="scrv"><img class="scrimg" src="' + esc(x.url) + '" alt="" loading="lazy"></div>'
      });
    }
    const S = L ? L.screen(ctx, ['tefl', 'notes', 'scrib']) : null;

    /* ---- the screen ---- */
    function render(b) { if (S) S.render(b); else ctx.ucPage(b, null, [['tefl', null], ['notes', null], ['scrib', null]]); }

    return { id: 'res', render: render, stop: S ? S.stop : undefined, full: function () { return !!S; } };
  };
})();
