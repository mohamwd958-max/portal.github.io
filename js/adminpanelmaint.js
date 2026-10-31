/* ==========================================================
   Admin: "update" (maintenance) buttons on the Dashboard window's selection bar.
   Load AFTER adminpanel.js (and adminpanel-rich.js).
   Select trainees (or "تحديد الكل"), then:
     [تحديث]          -> their dashboard becomes the black "we are upgrading the page" screen
     [إنهاء التحديث]  -> removes it; their page reloads by itself within 15 seconds
   It uses the existing `notifications` table (kind 'message', meta {"maintenance": true}).
   No new SQL. Sending twice never duplicates.
   ========================================================== */
(function () {
  'use strict';
  var TITLE = 'تحديث الصفحة', BODY = 'الصفحة تحت التحديث حالياً. من فضلك انتظر حتى إشعار آخر.';
  var prev = window.mpPaintBar;
  if (typeof prev !== 'function') { console.warn('adminpanel-maint: load it after adminpanel.js'); return; }

  window.mpPaintBar = function () {
    prev.apply(this, arguments);
    var b = document.getElementById('mpBar'); if (!b) return;
    var n = mpState.sel.size, dis = n ? '' : ' disabled';
    b.insertAdjacentHTML('beforeend', '<span class="ws-sep"></span>'
      + '<button type="button" class="ds-b amber"' + dis + ' onclick="mtSend()" title="يعرض للطلاب المحددين صفحة: الصفحة تحت التحديث"><i class="fa-solid fa-screwdriver-wrench"></i> تحديث</button>'
      + '<button type="button" class="ds-b ghost"' + dis + ' onclick="mtEnd()" title="يرجّع الداشبورد للطلاب المحددين">إنهاء التحديث</button>');
  };

  var idsOf = function () { return [...mpState.sel].map(String); };
  var inList = function (ids) { return 'trainee_id=in.(' + ids.map(enc).join(',') + ')'; };

  window.mtSend = async function () {
    var ids = idsOf(); if (!ids.length) return;
    if (!confirm('تقفل الداشبورد على ' + ids.length + ' طالب وتظهر لهم "الصفحة تحت التحديث"؟\nهتفضل كده لحد ما تدوس "إنهاء التحديث".')) return;
    try {
      var have = await fetchAllRows('notifications?select=trainee_id&kind=eq.message&meta->>maintenance=eq.true&' + inList(ids));
      var got = new Set(have.map(function (r) { return String(r.trainee_id); }));
      var out = ids.filter(function (id) { return !got.has(id); })
        .map(function (id) { return { trainee_id: id, kind: 'message', title: TITLE, body: BODY, meta: { maintenance: true } }; });
      if (out.length) await sbFetch('notifications', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(out) });
      showToast('اتقفلت الداشبورد على ' + ids.length + ' طالب ✓ (بتظهر عندهم خلال 15 ثانية)');
    } catch (e) { showToast('فشل: ' + e.message, true); }
  };

  window.mtEnd = async function () {
    var ids = idsOf(); if (!ids.length) return;
    if (!confirm('تنهي التحديث وترجّع الداشبورد لـ ' + ids.length + ' طالب؟')) return;
    try {
      var res = await sbFetch('notifications?kind=eq.message&meta->>maintenance=eq.true&' + inList(ids), { method: 'DELETE', headers: { Prefer: 'return=representation' } });
      var rows = await res.json().catch(function () { return []; });
      showToast(Array.isArray(rows) && rows.length ? 'اترجعت الداشبورد لـ ' + new Set(rows.map(function (r) { return r.trainee_id; })).size + ' طالب ✓' : 'مفيش حد من المحددين كان تحت التحديث');
    } catch (e) { showToast('فشل: ' + e.message, true); }
  };

  if (document.getElementById('mpBar')) window.mpPaintBar();
})();