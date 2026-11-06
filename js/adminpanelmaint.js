/* ==========================================================
   Admin: "update" (maintenance) actions.
   Load AFTER adminpanel.js.
   They no longer have their own buttons: they live inside the "Announcements" menu
   (on a trainee card, or on the bulk bar for everyone selected) and call these with the ids:
     mtSend(ids)  -> their dashboard becomes the black "we are upgrading the page" screen
     mtEnd(ids)   -> removes it; their page reloads by itself within 15 seconds
   Called without ids they fall back to the current selection.
   It uses the existing `notifications` table (kind 'message', meta {"maintenance": true}).
   No new SQL. Sending twice never duplicates.
   ========================================================== */
(function () {
  'use strict';
  var TITLE = 'تحديث الصفحة', BODY = 'الصفحة تحت التحديث حالياً. من فضلك انتظر حتى إشعار آخر.';

  var idsOf = function (ids) { return (ids && ids.length ? Array.from(ids) : Array.from(mpState.sel)).map(String); };
  var inList = function (ids) { return 'trainee_id=in.(' + ids.map(enc).join(',') + ')'; };

  window.mtSend = async function (ids) {
    ids = idsOf(ids); if (!ids.length) return;
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

  window.mtEnd = async function (ids) {
    ids = idsOf(ids); if (!ids.length) return;
    if (!confirm('تنهي التحديث وترجّع الداشبورد لـ ' + ids.length + ' طالب؟')) return;
    try {
      var res = await sbFetch('notifications?kind=eq.message&meta->>maintenance=eq.true&' + inList(ids), { method: 'DELETE', headers: { Prefer: 'return=representation' } });
      var rows = await res.json().catch(function () { return []; });
      showToast(Array.isArray(rows) && rows.length ? 'اترجعت الداشبورد لـ ' + new Set(rows.map(function (r) { return r.trainee_id; })).size + ' طالب ✓' : 'مفيش حد من المحددين كان تحت التحديث');
    } catch (e) { showToast('فشل: ' + e.message, true); }
  };
})();
