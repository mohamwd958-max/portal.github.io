/* Thabit Feed: its own page (feed.html). The notifications and the payment reminder that used to open inside the dashboard. */
const SB = "https://vkfexceitwjmxncwceqb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
const TOKEN_KEY = 'thabit_trainee_token';
const BADGE_ONLY = new URLSearchParams(location.search).has('badge');   /* hidden helper copy used by the portal only to show the unread number */
let lang = 'en'; try { lang = localStorage.getItem('thabit_lang') || 'en'; } catch (e) { }
const $ = id => document.getElementById(id);
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Trainer view: the admin panel opens dashboard.html#vt=<temporary token>. Read-only, never touches the trainee's real login. */
const VT = ((location.hash || '').match(/vt=([A-Za-z0-9]+)/) || [])[1] || null, VIEW = !!VT;
const VIEW_BLOCK = ['trainee_check_item', 'trainee_set_item_time', 'trainee_set_task', 'trainee_raise_hand', 'trainee_send_request', 'trainee_day_request', 'trainee_msg_mark', 'trainee_submit_report', 'trainee_notifications_read', 'trainee_mark_notifs_read', 'trainee_msg_send', 'trainee_msg_mark_read', 'trainee_logout'];
const tok = () => VIEW ? VT : (() => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } })();
const rpc = (fn, body) => (VIEW && VIEW_BLOCK.includes(fn)) ? Promise.resolve(null) : fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());
let USER_TZ = 'Africa/Cairo';
function cairoNow() {
  const g = {}; new Intl.DateTimeFormat('en-GB', { timeZone: USER_TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).forEach(x => g[x.type] = +x.value);
  return Date.UTC(g.year, g.month - 1, g.day, g.hour, g.minute, g.second);
}
const itToday = () => new Date(cairoNow()).toISOString().slice(0, 10);
let D = { notes: [], bill: null };
const NTX = {
  en: { feed: 'Feed', notes: 'Notifications', msg: 'Message from your trainer', word: w => `Your word “${w}” is ready. You can listen to it now.`, reply: 'The trainer replied to your request', billT: 'Payment', cur: 'EGP',
        past: (p, t, s, due) => `A gentle reminder that there is an amount of <b>${p}</b> EGP from last month, which makes the total due <b>${t}</b> EGP. Please make sure to pay this amount before <b>${due}</b>.`,
        tot: (s, due) => `A gentle reminder that this month's subscription is <b>${s}</b> EGP. Please make sure to pay it before <b>${due}</b>.`,
        left: n => n <= 0 ? 'Today is the last day' : n === 1 ? 'Only 1 day left' : n + ' days left' },
  ar: { feed: 'فيد', notes: 'الإشعارات', msg: 'رسالة من المدرب', word: w => `كلمتك «${w}» جاهزة، تقدر تسمعها الآن.`, reply: 'رد المدرب على طلبك', billT: 'المدفوعات', cur: 'جنيه',
        past: (p, t, s, due) => `تذكير لطيف بأن هناك مبلغًا من الشهر السابق بقيمة <b>${p}</b> جنيه، وهذا يجعل الإجمالي المطلوب <b>${t}</b> جنيه. رجاءً تأكد من دفع هذا المبلغ المستحق قبل يوم <b>${due}</b>.`,
        tot: (s, due) => `تذكير لطيف بأن مبلغ اشتراك هذا الشهر <b>${s}</b> جنيه. رجاءً تأكد من دفعه قبل يوم <b>${due}</b>.`,
        left: n => n <= 0 ? 'اليوم هو آخر يوم' : n === 1 ? 'باقي يوم واحد' : n === 2 ? 'باقي يومان' : 'باقي ' + n + ' أيام' },
  eg: { feed: 'فيد', notes: 'الإشعارات', msg: 'رسالة من المدرب', word: w => `كلمتك «${w}» جاهزة، تقدر تسمعها دلوقتي.`, reply: 'المدرب رد على طلبك', billT: 'المدفوعات', cur: 'جنيه',
        past: (p, t, s, due) => `تذكير لطيف إن فيه مبلغ من الشهر اللي فات بقيمة <b>${p}</b> جنيه، وده بيخلي الإجمالي المطلوب <b>${t}</b> جنيه. ياريت تتأكد إنك تدفع المبلغ المستحق ده قبل يوم <b>${due}</b>.`,
        tot: (s, due) => `تذكير لطيف إن اشتراك الشهر ده <b>${s}</b> جنيه. ياريت تتأكد إنك تدفعه قبل يوم <b>${due}</b>.`,
        left: n => n <= 0 ? 'النهاردة آخر يوم' : n === 1 ? 'باقي يوم واحد' : n === 2 ? 'باقي يومين' : 'باقي ' + n + ' أيام' }
};
const NT = () => NTX[lang] || NTX.en;
const fetchNotes = () => rpc('trainee_notifications', { p_token: tok() }).then(a => { if (!Array.isArray(a)) console.warn('[feed] trainee_notifications failed:', a); return Array.isArray(a) ? a : []; }).catch(e => { console.warn('[feed] trainee_notifications error:', e); return []; });
const fetchBill = () => rpc('trainee_billing', { p_token: tok() }).then(b => b && typeof b === 'object' && !Array.isArray(b) && !b.message && !b.code ? b : null).catch(() => null);
function billState() {
  const b = D && D.bill; if (!b) return null;
  { const c = new Date(cairoNow()); if (b.paid_month && b.paid_month === `${c.getUTCFullYear()}-${String(c.getUTCMonth() + 1).padStart(2, '0')}`) return null; }   // marked paid this month by the admin: no payment reminder (resets next month)
  const num = v => { const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0; };
  const sub = num(b.subscription), past = num(b.past_due); if (!sub && !past) return null;
  const n = new Date(cairoNow()), day = n.getUTCDate(), last = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 0)).getUTCDate();
  const win = day > last - 5 || day <= 7;                  // last 5 days of the month, until the 7th
  if (!win) return null;                                   // after the 7th nothing is sent (even with an old balance)
  const y = n.getUTCFullYear(), mo = n.getUTCMonth(), prevLast = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const start = day > 7 ? Date.UTC(y, mo, last - 4) : Date.UTC(y, mo - 1, prevLast - 4);   // first day of the window
  if (Math.round((Date.UTC(y, mo, day) - start) / 864e5) % 2) return null;               // every 2 days
  if (thn_isAcked('bill:' + itToday())) return null;           // pressed "Understood" today: not again today
  return { sub, past, total: sub + past, win, early: day <= 7 };
}
function billDue() {   // the next 7th, as d/m/yyyy (7/11/2026)
  const n = new Date(cairoNow()); let y = n.getUTCFullYear(), m = n.getUTCMonth() + 1;
  if (n.getUTCDate() > 7) { m++; if (m > 12) { m = 1; y++; } }
  return `7/${m}/${y}`;
}
function billLeft() {   // days until the next 7th
  const n = new Date(cairoNow()), m = n.getUTCMonth() + (n.getUTCDate() > 7 ? 1 : 0);
  return Math.round((Date.UTC(n.getUTCFullYear(), m, 7) - Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate())) / 864e5);
}
/* ===== Notification cards: collapsed (type only) -> tap = details + "Understood" -> check mark, thanks, gone.
   Counted in the Feed button: the trainer's notifications + the automatic payment reminder. Nothing else. ===== */
const thn_NCX = {
  en: { money: 'Finance', system: 'Dashboard', note: 'Notification', update: 'Update', alert: 'Important', reply: 'Reply', tap: 'Tap to read', ok: 'Understood', thanks: 'Thank you' },
  ar: { money: 'مالي', system: 'لوحة البيانات', note: 'إشعار', update: 'تحديث', alert: 'مهم', reply: 'رد', tap: 'اضغط للقراءة', ok: 'فهمت', thanks: 'شكراً لك' },
  eg: { money: 'مالي', system: 'لوحة البيانات', note: 'إشعار', update: 'تحديث', alert: 'مهم', reply: 'رد', tap: 'دوس واقرا', ok: 'فهمت', thanks: 'شكراً ليك' }
};
const thn_NCT = () => thn_NCX[lang] || thn_NCX.en;
const thn_ACKK = 'thabit_ack', thn_OPNK = 'thabit_nopen'; let thn_ACKS = {};
try { thn_ACKS = JSON.parse(localStorage.getItem(thn_ACKK) || '{}') || {}; } catch (e) { thn_ACKS = {}; }
const thn_isAcked = k => k in thn_ACKS;
function thn_ackSet(k) {
  thn_ACKS[k] = Date.now(); const cut = Date.now() - 40 * 864e5; Object.keys(thn_ACKS).forEach(x => { if (thn_ACKS[x] < cut) delete thn_ACKS[x]; });
  if (!VIEW) try { localStorage.setItem(thn_ACKK, JSON.stringify(thn_ACKS)); } catch (e) {}
}
function thn_openedSet(k) {   // remembers that the details were opened (first time only), on this device
  if (VIEW) return; try { const o = JSON.parse(localStorage.getItem(thn_OPNK) || '{}') || {}; if (!o[k]) { o[k] = Date.now(); localStorage.setItem(thn_OPNK, JSON.stringify(o)); } } catch (e) {}
}
const thn_nKey = n => n.id != null ? 'n' + n.id : n.kind + '|' + n.created_at;
function noteText(n) {
  const t = NT(), m = n.meta || {};
  if (n.kind === 'request_reply') return { h: esc(t.reply), b: m.reply ? rich(m.reply) : '' };
  return { h: esc(n.title || t.msg), b: rich(n.body || '') };
}
/* one icon per notification category: general = bell, financial = wallet, system = gear, app update = arrow, policy / restriction = warning, reply to a request = chat bubble.
   Category comes from notification.meta.category (money | system | update | alert | reply | note) or, if absent, from its kind. */
const THN_ICON = { money: 'fa-wallet', system: 'fa-gear', note: 'fa-bell', update: 'fa-circle-arrow-up', alert: 'fa-triangle-exclamation', reply: 'fa-comment-dots' };
function noteCat(n) {
  const m = (n && n.meta) || {}, c = String(m.category || m.cat || '').toLowerCase(), k = String((n && n.kind) || '').toLowerCase();
  if (THN_ICON[c]) return c;
  if (/pay|bill|money|financ|fee|subscri|discount|promo|offer|coupon|voucher|refund|invoice|price|cost|wallet|cash|credit|debt|balance|due|salary|scholar/.test(k) || /خصم|تخفيض|فلوس|دفع|سداد|مدفوع|مصاريف|مصروف|اشتراك|فاتور|مبلغ|رسوم|استرداد|مستحق|منح|عرض خاص|discount|payment|refund|invoice|\bfee|\begp\b/i.test(String((n && n.title) || ''))) return 'money';
  if (k === 'request_reply') return 'reply';
  if (/policy|restrict/.test(k)) return 'alert';
  if (/update/.test(k)) return 'update';
  if (/system|maint/.test(k)) return 'system';
  return 'note';
}
function thn_nCard(key, cat, headHtml, bodyHtml, dt, read) {
  const c = thn_NCT(), rd = read == null ? (key in thn_opened()) : !!read;
  const snip = (() => { const d = document.createElement('div'); d.innerHTML = bodyHtml || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140); })();
  return { id: 'n:' + key, noX: true, cnt: !rd, isNew: !rd, cls: 'nf ' + cat + (rd ? ' read' : ' unread'),
    html: `<div class="nfh" role="button" tabindex="0"><span class="nfi ${cat}"><i class="fa-solid ${THN_ICON[cat] || 'fa-bell'}"></i></span><div class="nfm"><div class="nfc" dir="auto">${headHtml || c[cat]}</div><div class="nft2" dir="auto">${esc(snip)}</div></div><span class="nfd">${esc(dt)}</span><i class="fa-solid fa-chevron-down nfv"></i></div>`
      + `<div class="nfb" hidden><div class="rich" dir="auto">${bodyHtml}</div></div>` };
}
function billCard(s) {
  const t = NT(), fmt = v => String(v), due = billDue(), left = billLeft();
  const body = `<div class="billb" dir="auto">${s.past > 0 ? t.past(fmt(s.past), fmt(s.total), fmt(s.sub), due) : t.tot(fmt(s.sub), due)}</div>`
    + (left <= 2 ? `<div class="billl" dir="auto"><i class="fa-regular fa-clock"></i> ${t.left(left)}</div>` : '');
  return thn_nCard('bill:' + itToday(), 'money', t.billT, body, itToday());
}
/* the trainer's notifications: not read, not "Understood" on this device, and younger than 24 hours */
const WORD_KINDS = ['assistant_words', 'word_ready'];
/* local notes written by the dashboard itself (e.g. a dispute result) live on this device */
const NK = 'thabit_local_notes';
window.thLocalNotes = () => { try { return (JSON.parse(localStorage.getItem(NK) || '[]') || []).filter(n => n && Date.now() - Date.parse(n.created_at) < 864e5); } catch (e) { return []; } };
const thn_opened = () => { try { return JSON.parse(localStorage.getItem(thn_OPNK) || '{}') || {}; } catch (e) { return {}; } };
const thn_isRead = n => !!n.read_at || thn_isAcked(thn_nKey(n)) || (thn_nKey(n) in thn_opened());
function thn_noteList() {
  const now = Date.now();
  return (((D && D.notes) || []).concat(window.thLocalNotes ? thLocalNotes() : [])).filter(n => !WORD_KINDS.includes(n.kind))
    .slice().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}
function thn_noteCardN(n) {
  const loc = lang === 'en' ? 'en-GB' : 'ar-EG', x = noteText(n); let dt = '';
  try { dt = new Date(n.created_at).toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) {}
  return thn_nCard(thn_nKey(n), noteCat(n), x.h, x.b, dt, thn_isRead(n));
}
const escv0 = s => (window.ThabitRich ? ThabitRich.inline(esc(s)) : esc(s)).replace(/(<[^>]+>)|\s*\|\s*/g, (m, tag) => tag ? tag : '<i class="vb"></i>');   // markers first, then "|" -> divider (never inside a tag)
/* [text](https://link) = a real link the student can tap, inside any rich text */
const LNK_RE = /\[([^\]\n]{1,200})\]\((https?:\/\/[^\s)]{3,2000})\)/g;
const escv = s => {
  s = String(s == null ? '' : s); let out = '', last = 0, m; LNK_RE.lastIndex = 0;
  while ((m = LNK_RE.exec(s))) { out += escv0(s.slice(last, m.index)) + `<a class="alk" href="${esc(m[2])}" target="_blank" rel="noopener noreferrer">${esc(m[1])}</a>`; last = m.index + m[0].length; }
  return out + escv0(s.slice(last));
};
function rich(txt) {
  return String(txt || '').trim().split(/\n\s*\n/).filter(b => b.trim()).map(b => {
    const ls = b.split('\n').map(l => l.trimEnd()).filter(l => l.trim()), NUM = /^\s*(\d+|[a-zA-Z])[.)]\s+/, BUL = /^\s*[-•*]\s+/;
    if (ls.every(l => NUM.test(l))) return `<ol class="rl" dir="auto"${/^\s*[a-zA-Z][.)]/.test(ls[0]) ? ' type="a"' : ''}>${ls.map(l => `<li>${escv(l.replace(NUM, ''))}</li>`).join('')}</ol>`;
    if (ls.every(l => BUL.test(l))) return `<ul class="rl" dir="auto">${ls.map(l => `<li>${escv(l.replace(BUL, ''))}</li>`).join('')}</ul>`;
    return `<p class="rp" dir="auto">${ls.map(escv).join('<br>')}</p>`;
  }).join('');
}

const toParent = m => { try { if (window.parent && window.parent !== window) { window.parent.postMessage(m, '*'); return true; } } catch (e) { } return false; };
const FT = {
  en: { title: 'Feed', empty: 'No notifications yet.', older: 'See previous notifications', copy: 'Copy', share: 'Share', reply: 'Reply', copied: 'Copied ✓' },
  ar: { title: 'التطورات', empty: 'لا توجد إشعارات بعد.', older: 'عرض الإشعارات السابقة', copy: 'نسخ', share: 'مشاركة', reply: 'رد', copied: 'تم النسخ ✓' },
  eg: { title: 'التطورات', empty: 'مفيش إشعارات لسه.', older: 'شوف الإشعارات السابقة', copy: 'كوبي', share: 'شير', reply: 'ريبلاي', copied: 'اتنسخ ✓' }
};
const FX = () => FT[lang] || FT.en;
const THN_MAX = 8;

/* what the page shows: unread on top, then read (newest first inside each group); the payment reminder comes first */
function feedCards() {
  const bs = billState(), nts = thn_noteList().map(thn_noteCardN);
  if (bs) nts.unshift(billCard(bs));
  return nts.sort((a, b) => (b.cnt ? 1 : 0) - (a.cnt ? 1 : 0));
}
const unreadCount = () => feedCards().filter(c => c.cnt).length;
let lastSig = '', lastBadge = -1;
const sigOf = () => feedCards().map(c => c.id + (c.cnt ? 'u' : 'r')).join(',') + '|' + lang;
function postBadge() { const n = unreadCount(); if (n !== lastBadge) { lastBadge = n; toParent({ type: 'thabit-feed-badge', count: n }); } }

function applyTheme(light) { document.body.classList.toggle('light-theme', !!light); document.body.classList.toggle('dark-theme', !light); }
try { applyTheme(localStorage.getItem('thabit_theme') === 'light'); } catch (e) { }

/* ---------- copy / share / reply row inside an opened notification ---------- */
const txt = e => e ? (e.innerText || e.textContent || '').trim() : '';
async function copyText(s) {
  try { await navigator.clipboard.writeText(s); return true; } catch (e) { }
  try { const a = document.createElement('textarea'); a.value = s; a.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok; } catch (e) { return false; }
}
function toast(m) { const t = document.createElement('div'); t.className = 'opx-toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }
function optBar() {
  const w = document.createElement('div'); w.className = 'opx-bar'; const t = FX();
  w.innerHTML = [['reply', 'fa-solid fa-reply'], ['copy', 'fa-regular fa-copy'], ['share', 'fa-solid fa-share-nodes']].map(o => `<button type="button" class="opx-i" data-id="${o[0]}" aria-label="${t[o[0]]}" title="${t[o[0]]}"><i class="${o[1]}"></i></button>`).join('');
  return w;
}
async function optAct(id, pc) {
  const text = [txt(pc.querySelector('.nfc')), txt(pc.querySelector('.nfb .rich'))].filter(Boolean).join('\n');
  if (id === 'reply') { if (!toParent({ type: 'thabit-open-page', page: 'messenger', quote: text })) location.href = 'messenger.html'; return; }
  if (id === 'copy') { if (await copyText(text)) toast(FX().copied); return; }
  if (navigator.share) { try { await navigator.share({ text }); } catch (e) { } return; }
  if (await copyText(text)) toast(FX().copied);
}

/* ---------- paint ---------- */
function toggleNf(pc) {
  const list = $('feedList');
  if (!pc.classList.contains('open')) list.querySelectorAll('.pc.nf.open').forEach(o => { if (o !== pc) { o.classList.remove('open'); const b = o.querySelector('.nfb'); if (b) b.hidden = true; } });   // one at a time
  const on = !pc.classList.contains('open'); pc.classList.toggle('open', on); pc.querySelector('.nfb').hidden = !on;
  if (on) { thn_openedSet(pc.dataset.cid.slice(2)); pc.classList.remove('unread'); pc.classList.add('read'); lastSig = sigOf(); postBadge(); }
}
let animFirst = true;
function paint() {
  const t = FX(), list = $('feedList'), cards = feedCards();
  const keep = new Set([...list.querySelectorAll('.pc.nf.open')].map(x => x.dataset.cid));
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl'; document.documentElement.lang = lang === 'en' ? 'en' : 'ar';
  document.title = t.title;
  list.innerHTML = cards.map(c => `<div class="pc ${c.cls || ''}" data-cid="${c.id || ''}">${c.html}</div>`).join('');
  $('feedEmpty').hidden = cards.length > 0; $('feedEmpty').textContent = t.empty;
  list.querySelectorAll('.pc.nf').forEach(pc => {
    const nb = pc.querySelector('.nfb'); if (nb) nb.insertBefore(optBar(), null);
    if (keep.has(pc.dataset.cid)) { pc.classList.add('open'); nb.hidden = false; }
    pc.addEventListener('click', e => {
      const o = e.target.closest && e.target.closest('.opx-i'); if (o) { e.preventDefault(); optAct(o.dataset.id, pc); return; }
      if (!pc.classList.contains('open') || e.target.closest('.nfh')) toggleNf(pc);
    });
    pc.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('nfh')) { e.preventDefault(); toggleNf(pc); } });
  });
  const nf = [...list.querySelectorAll('.pc.nf')];
  if (nf.length > THN_MAX) {
    const rest = nf.slice(THN_MAX); rest.forEach(c => { c.hidden = true; });
    const b = document.createElement('button'); b.type = 'button'; b.className = 'seeold'; b.textContent = t.older;
    b.onclick = () => { rest.forEach(c => { c.hidden = false; }); b.remove(); }; list.appendChild(b);
  }
  if (animFirst && cards.length) { animFirst = false; list.querySelectorAll('.pc').forEach((c, i) => { c.style.setProperty('--d', Math.min(i, 12) * 90 + 'ms'); c.classList.add('drop'); c.addEventListener('animationend', () => c.classList.remove('drop'), { once: true }); }); }
  lastSig = sigOf(); postBadge();
}

/* ---------- loading ---------- */
let busy = false;
async function refresh(force) {
  if (busy || !tok()) return; busy = true;
  try {
    const [n, b] = await Promise.all([fetchNotes(), fetchBill()]);
    D.notes = n; D.bill = b;
    if (BADGE_ONLY) postBadge(); else if (force || sigOf() !== lastSig) paint(); else postBadge();
  } finally { busy = false; }
}
window.addEventListener('message', e => {
  const d = e.data; if (!d) return;
  if (d.type === 'thabit-theme') applyTheme(d.theme === 'light');
  else if (d.type === 'thabit-feed-refresh' || d.type === 'thabit-badge-refresh') refresh(true);
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
setInterval(() => { if (!document.hidden) refresh(); }, 10000);

if (!BADGE_ONLY) {
  const st = document.createElement('style');
  st.textContent = `html,body{margin:0;min-height:100%}
body{font-family:Inter,Cairo,sans-serif}
#feedPage{max-width:520px;margin:0 auto;padding:18px 14px calc(40px + env(safe-area-inset-bottom))}
.fhead{display:flex;align-items:center;gap:10px;margin:6px 4px 16px}.fhead h1{margin:0;font-size:1.25rem;font-weight:800}
.fhead svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round;transform:rotate(-12deg)}
.pcs{width:100%;max-width:none;max-height:none;overflow:visible}
.pc{max-width:none;animation:none}
#feedEmpty{text-align:center;opacity:.65;padding:60px 10px;font-weight:600}
.seeold{border:0;background:rgba(148,163,184,.2);color:inherit;border-radius:14px;padding:10px 16px;font:700 .8rem Cairo,Inter,sans-serif;cursor:pointer;align-self:center}
.opx-bar{display:flex;align-items:center;gap:2px;margin-top:6px}
.opx-i{background:none;border:0;padding:6px 10px;color:inherit;opacity:.7;font-size:16px;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent}
.opx-i:hover{opacity:1}.opx-i:active{opacity:1;transform:scale(.88)}
.opx-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;background:rgba(15,23,42,.96);color:#fff;border:1px solid rgba(255,255,255,.2);padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700}
.pc .nxrow{display:flex;align-items:center;gap:16px;direction:ltr}
.pc .nxc{flex:none;display:flex;align-items:center;justify-content:center}
.pc .nxtx{flex:1;min-width:0}
.pc .nxtx h3{margin-top:0}
.pc.nf .nfv{font-size:.7rem;opacity:.6;transition:transform .2s}.pc.nf.open .nfv{transform:rotate(180deg);margin-inline-start:auto}
.pcs{gap:10px}
.pc{background:rgba(30,41,59,.5)!important;-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5);border:1px solid rgba(255,255,255,.14)!important;border-radius:22px!important;box-shadow:0 8px 24px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08)!important}
body.light-theme .pc{background:rgba(255,255,255,.6)!important;border-color:rgba(255,255,255,.75)!important;box-shadow:0 8px 24px rgba(15,23,42,.14),inset 0 1px 0 rgba(255,255,255,.9)!important}
.pc.nf{padding:12px 14px}
.pc.nf .nfh{display:flex;align-items:center;gap:11px;cursor:pointer}
.pc.nf .nfi{flex:none;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.95rem;color:#fff;background:linear-gradient(145deg,#94a3b8,#64748b);box-shadow:0 2px 6px rgba(0,0,0,.25)}
.pc.nf .nfi.money{background:linear-gradient(145deg,#fbbf24,#f59e0b)}
.pc.nf .nfi.system{background:linear-gradient(145deg,#94a3b8,#475569)}
.pc.nf .nfi.update{background:linear-gradient(145deg,#a78bfa,#7c3aed)}
.pc.nf .nfi.alert{background:linear-gradient(145deg,#fb7185,#e11d48)}
.pc.nf .nfi.reply{background:linear-gradient(145deg,#34d399,#059669)}
.pc.nf .nfi.note{background:linear-gradient(145deg,#60a5fa,#3b82f6)}
.pc.nf .nfm{flex:1;min-width:0}
.pc.nf .nfc{font-weight:700;font-size:.9rem;line-height:1.2}
.pc.nf .nft2{font-size:.74rem;opacity:.6;margin-top:1px}
.pc.nf.open .nft2{display:none}
.pc.nf .nfd{font-size:.7rem;opacity:.6;white-space:nowrap}
.pc.nf .nfb{margin-top:10px}.pc.nf .ackb{margin-top:12px;width:100%}
.pc.nf .nth{font-weight:700;margin-bottom:6px}
.pc.nf.acked{text-align:center;transition:opacity .35s,transform .35s}
.pc.nf.out{opacity:0;transform:scale(.96)}
.ackdone{padding:14px 0}.ackdone i{font-size:2.2rem;color:#34d399;animation:ackPop .5s cubic-bezier(.2,.8,.3,1.2)}.ackdone div{margin-top:8px;font-weight:700}
@keyframes ackPop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
.pc.nf.unread{background:rgba(96,165,250,.18)!important;border-color:rgba(96,165,250,.45)!important}
body.light-theme .pc.nf.unread{background:rgba(147,197,253,.4)!important;border-color:rgba(96,165,250,.6)!important}
.pc.drop{animation:cardDrop .6s cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0ms)}
@keyframes cardDrop{from{opacity:0;transform:translateY(-34px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(st);
  document.body.innerHTML = '<main id="feedPage"><div class="pcs" id="feedList"></div><div id="feedEmpty" hidden></div></main>';
  paint();
}
refresh(true);
