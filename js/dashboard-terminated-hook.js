/* ==========================================================
   TERMINATED HOOK: paste at the VERY END of dashboard.js (after the tracking patch)
   Needs:  <script src="js/terminated_screen.js"></script>  in dashboard.html, BEFORE dashboard.js
   If the trainee's status_as_of_today means "terminated": the session is ended on this device and the
   full-page screen is shown instead of the dashboard. The trainer's view-only popup is never blocked.
   ========================================================== */
{
  const _render0 = render;
  render = function () {
    const st = D && D.profile && D.profile.status_as_of_today;
    if (!VIEW && window.ThabitTerminated && ThabitTerminated.is(st)) {
      if (!window._trmDone) {
        window._trmDone = true;
        const t = tok();
        try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('currentTrainee'); localStorage.removeItem('thabit_intro_tok'); } catch (e) {}
        if (t) { try { rpc('trainee_logout', { p_token: t }); } catch (e) {} }
        ThabitTerminated.show();
      }
      return;                      // never paint the dashboard for a terminated trainee
    }
    return _render0.apply(this, arguments);
  };
}
