/* Small "Guest" circle + popup (name, phone, email, "remember me") for the pages after the landing.
   Add <script src="js/thabit-guest.js"></script> at the end of the page. It does nothing if the visitor is not a guest.
   It sits fixed at the top right: move it with the .thg / .thgp rules once the final layout is known. */
(function () {
  var g; try { g = JSON.parse(sessionStorage.getItem('thabitGuest') || 'null'); } catch (e) { }
  if (!g) return;
  var K = 'thabitGuestToken', lang = '', light = false;
  try { lang = localStorage.getItem('thLandLang') || ''; light = localStorage.getItem('thThemeChoice') === 'light'; } catch (e) { }
  var ar = (lang || document.documentElement.lang || '').indexOf('ar') === 0;
  var S = ar ? { b: 'ضيف', t: 'أنت تتصفح كضيف', n: 'الاسم', p: 'الهاتف', e: 'البريد', r: 'تذكّرني في المرة القادمة' } : { b: 'Guest', t: 'You are browsing as a guest', n: 'Name', p: 'Phone', e: 'Email', r: 'Remember me next time' };
  function rpc(fn, body) {
    if (typeof REPORT_SUPABASE_URL === 'undefined' || typeof sbHeaders === 'undefined') return Promise.resolve(null);
    return fetch(REPORT_SUPABASE_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: sbHeaders(), body: JSON.stringify(body) }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  var ink = light ? '#1c1a16' : '#ece8df', bg = light ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.12)', bd = light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.2)';
  var st = document.createElement('style');
  st.textContent = '.thg,.thgp{position:fixed;z-index:900;color:' + ink + ';background:' + bg + ';border:1px solid ' + bd + ';-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);font-family:Inter,Cairo,system-ui,sans-serif}' +
    '.thg{top:12px;right:12px;width:42px;height:42px;border-radius:50%;cursor:pointer;font-weight:700;font-size:.66rem;padding:0}' +
    '.thgp{top:62px;right:12px;width:min(300px,calc(100vw - 24px));padding:16px;border-radius:18px;font-size:.85rem;line-height:1.7;display:none}.thgp.on{display:block}' +
    '.thgp b{display:block;font-size:.95rem;margin-bottom:6px}.thgp label{display:flex;gap:8px;align-items:center;margin-top:10px;cursor:pointer;font-weight:600}';
  document.head.appendChild(st);
  var b = document.createElement('button'); b.className = 'thg'; b.type = 'button'; b.textContent = S.b;
  var p = document.createElement('div'); p.className = 'thgp'; p.dir = ar ? 'rtl' : 'ltr';
  var esc = function (v) { var d = document.createElement('i'); d.textContent = v || ''; return d.innerHTML; };
  p.innerHTML = '<b>' + S.t + '</b>' + S.n + ': ' + esc(g.firstName + ' ' + g.lastName) + '<br>' + S.p + ': <span dir="ltr">' + esc(g.phone) + '</span><br>' + S.e + ': <span dir="ltr">' + esc(g.email) + '</span><label><input type="checkbox" id="thgR"> ' + S.r + '</label>';
  document.body.appendChild(b); document.body.appendChild(p);
  var cb = p.querySelector('#thgR'); try { cb.checked = !!localStorage.getItem(K); } catch (e) { }
  b.onclick = function (e) { e.stopPropagation(); p.classList.toggle('on'); };
  document.addEventListener('click', function (e) { if (!p.contains(e.target)) p.classList.remove('on'); });
  cb.onchange = function () {
    if (cb.checked) rpc('guest_remember', { p_first: g.firstName, p_last: g.lastName, p_phone: g.phone, p_email: g.email }).then(function (t) { if (typeof t === 'string') try { localStorage.setItem(K, t); } catch (e) { } else cb.checked = false; });
    else { var t = ''; try { t = localStorage.getItem(K) || ''; localStorage.removeItem(K); } catch (e) { } if (t) rpc('guest_forget', { p_token: t }); }
  };
})();