/* =====================================================================
   خربشات / Scratches  (جزء من الموارد)
   صور ورسومات من سبورة المدرّب. بتظهر كحاوية في الموارد جنب الملاحظات والنصوص.
   لسه مش متوصّلة بمصدر: لما تعرف بتيجي منين قولّي، أو غيّر SCR_RPC تحت.

   مصدر الداتا (واحد من الاتنين):
     1) SCR_RPC = اسم الـRPC في Supabase (بياخد { p_token } ويرجّع مصفوفة)
     2) أو حقل  scratches  جوه نتيجة trainee_dashboard
   كل عنصر: { image_url | url | image | src, title?, date | created_at }

   لازم يتحمّل بعد lists-core.js وقبل btn-res-content.js
   ===================================================================== */
(function () {
  if (!window.ThabitLists) return;
  var SCR_RPC = null;   /* <-- اسم الـRPC هنا لما نعرف المصدر */
  var ok = function (u) { return /^(https?:\/\/|data:image\/)/i.test(String(u || '')); };
  window.ThabitLists.add({
    key: 'scratch', noear: true,
    title: { en: 'Scratches', ar: 'خربشات' },
    none: { en: 'No scratches yet', ar: 'لسه مفيش خربشات' },
    css: '.vsw .scrv{overflow:auto;max-height:60vh;border-radius:12px;background:rgba(148,163,184,.08);text-align:center;cursor:zoom-in}' +
         '.vsw .scrimg{max-width:100%;height:auto;display:inline-block}.vsw .scrv.scrz{cursor:zoom-out}.vsw .scrv.scrz .scrimg{max-width:none}',
    list: function (D, api) {
      var get = Array.isArray(D.scratches) ? Promise.resolve(D.scratches) : (SCR_RPC ? api.rpc(SCR_RPC, { p_token: api.tok() }).catch(function () { return []; }) : Promise.resolve([]));
      return get.then(function (a) {
        return (Array.isArray(a) ? a : []).map(function (x) { return { url: x.image_url || x.url || x.image || x.src || '', title: x.title || '', date: String(x.date || x.created_at || '').slice(0, 10) }; })
          .filter(function (x) { return ok(x.url); }).sort(function (a, b) { return b.date.localeCompare(a.date); });
      });
    },
    preview: function (x) { return x.title || '🖼'; },
    body: function (x, esc) { return (x.title ? '<div class="sm" dir="auto" style="margin-bottom:6px">' + esc(x.title) + '</div>' : '') + '<div class="scrv"><img class="scrimg" src="' + esc(x.url) + '" alt="" loading="lazy"></div>'; }
  });
})();