/* Thabit Messenger: its own page (messenger.html). Same chat engine and same database calls as before, no dashboard inside. */
const SB = "https://vkfexceitwjmxncwceqb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
const TOKEN_KEY = 'thabit_trainee_token';
const BADGE_ONLY = new URLSearchParams(location.search).has('badge');   /* hidden helper copy used by the portal only to show the unread number */
let lang = 'en'; try { lang = localStorage.getItem('thabit_lang') || 'en'; } catch (e) { }
const $ = id => document.getElementById(id);
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Trainer view: the admin panel opens dashboard.html#vt=<temporary token>. Read-only, never touches the trainee's real login. */
const VT = ((location.hash || '').match(/vt=([A-Za-z0-9]+)/) || [])[1] || null, VIEW = !!VT;
if (VIEW) document.documentElement.classList.add('viewmode');
const VIEW_BLOCK = ['trainee_check_item', 'trainee_set_item_time', 'trainee_set_task', 'trainee_raise_hand', 'trainee_send_request', 'trainee_day_request', 'trainee_msg_mark', 'trainee_submit_report', 'trainee_notifications_read', 'trainee_mark_notifs_read', 'trainee_msg_send', 'trainee_msg_mark_read', 'trainee_logout'];
const tok = () => VIEW ? VT : (() => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } })();
const rpc = (fn, body) => (VIEW && VIEW_BLOCK.includes(fn)) ? Promise.resolve(null) : fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());
function itToast(m) { const e = document.createElement('div'); e.className = 'ittoast'; e.textContent = m; document.body.appendChild(e); setTimeout(() => e.remove(), 2400); }
let D = { profile: null };   /* only the profile is needed here (country / time zone) */
const TZ_CAIRO = 'Africa/Cairo';
const TZ_LIST = [
  { rx: /مصر|egypt|cairo|القاهر|الاسكندر|اسكندر|alexandria|giza|الجيز/, tz: TZ_CAIRO, n: { en: 'Cairo time', ar: 'بتوقيت القاهرة', eg: 'بتوقيت القاهرة' } },
  { rx: /سعود|saudi|\bksa\b|riyadh|رياض|jeddah|جده|mecca|makkah|مكه|medina|madinah|المدينه المنوره|dammam|دمام|khobar|الخبر|tabuk|تبوك|abha|ابها/, tz: 'Asia/Riyadh', n: { en: 'Mecca time', ar: 'بتوقيت مكة المكرمة', eg: 'بتوقيت مكة المكرمة' } },
  { rx: /امارات|emirates|\buae\b|dubai|دبي|abu ?dhabi|ابو ?ظبي|sharjah|شارقه|ajman|عجمان/, tz: 'Asia/Dubai', n: { en: 'UAE time', ar: 'بتوقيت الإمارات', eg: 'بتوقيت الإمارات' } },
  { rx: /كويت|kuwait/, tz: 'Asia/Kuwait', n: { en: 'Kuwait time', ar: 'بتوقيت الكويت', eg: 'بتوقيت الكويت' } },
  { rx: /قطر|qatar|doha|الدوحه/, tz: 'Asia/Qatar', n: { en: 'Qatar time', ar: 'بتوقيت قطر', eg: 'بتوقيت قطر' } },
  { rx: /بحرين|bahrain|manama|المنامه/, tz: 'Asia/Bahrain', n: { en: 'Bahrain time', ar: 'بتوقيت البحرين', eg: 'بتوقيت البحرين' } },
  { rx: /\boman\b|muscat|مسقط|سلطنه عمان/, tz: 'Asia/Muscat', n: { en: 'Oman time', ar: 'بتوقيت عُمان', eg: 'بتوقيت عُمان' } },
  { rx: /اردن|jordan|amman/, tz: 'Asia/Amman', n: { en: 'Jordan time', ar: 'بتوقيت الأردن', eg: 'بتوقيت الأردن' } },
  { rx: /عراق|iraq|baghdad|بغداد/, tz: 'Asia/Baghdad', n: { en: 'Iraq time', ar: 'بتوقيت العراق', eg: 'بتوقيت العراق' } },
  { rx: /ليبيا|libya|tripoli|طرابلس/, tz: 'Africa/Tripoli', n: { en: 'Libya time', ar: 'بتوقيت ليبيا', eg: 'بتوقيت ليبيا' } },
  { rx: /تركيا|turkey|turkiye|istanbul|اسطنبول/, tz: 'Europe/Istanbul', n: { en: 'Turkey time', ar: 'بتوقيت تركيا', eg: 'بتوقيت تركيا' } },
  { rx: /بريطانيا|انجلترا|\buk\b|united kingdom|england|britain|london|لندن/, tz: 'Europe/London', n: { en: 'UK time', ar: 'بتوقيت بريطانيا', eg: 'بتوقيت بريطانيا' } },
  { rx: /المانيا|germany|berlin|برلين/, tz: 'Europe/Berlin', n: { en: 'Germany time', ar: 'بتوقيت ألمانيا', eg: 'بتوقيت ألمانيا' } }
];
const TZ_DST = { en: ['summer time', 'winter time'], ar: ['توقيت صيفي', 'توقيت شتوي'], eg: ['توقيت صيفي', 'توقيت شتوي'] };
const tzNorm = v => String(v == null ? '' : v).toLowerCase().replace(/[ً-ٟـ]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
function traineeZone() {
  const p = (D && D.profile) || {}, x = tzNorm(p.location);
  return (x && TZ_LIST.find(z => z.rx.test(x))) || TZ_LIST[0];
}
/* page plumbing */
const toParent = m => { try { if (window.parent && window.parent !== window) { window.parent.postMessage(m, '*'); return true; } } catch (e) { } return false; };
function applyTheme(light) { document.body.classList.toggle('light-theme', !!light); document.body.classList.toggle('dark-theme', !light); }
try { applyTheme(localStorage.getItem('thabit_theme') === 'light'); } catch (e) { }
if (!BADGE_ONLY) { document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl'; }

if (BADGE_ONLY) {
  const post = n => toParent({ type: 'thabit-messenger-badge', count: n });
  const poll = async () => {
    if (document.hidden || !tok()) return;
    const r = await rpc('trainee_msg_list', { p_token: tok(), p_after: 0 }).catch(() => null);
    if (r && r.ok && Array.isArray(r.messages)) post(new Set(r.messages.filter(x => x.sender === 'trainer' && !x.read_at).map(x => x.sender_id || 'trainer')).size);
  };
  setTimeout(poll, 800); setInterval(poll, 10000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
  window.addEventListener('message', e => { if (e.data && e.data.type === 'thabit-badge-refresh') poll(); });
}
(function () {
  if (window.__thMsgr || BADGE_ONLY) return; window.__thMsgr = 1;

  const L = {
    en: { reply: 'Reply', copy: 'Copy', share: 'Share', copied: 'Copied ✓', msgr: 'Messenger', ph: 'Message', rto: 'Replying to', photo: 'Photo', link: 'Link', shot: 'Screenshot', video: 'Video', min: 'Minimize', close: 'Close' },
    ar: { reply: 'رد', copy: 'نسخ', share: 'مشاركة', copied: 'تم النسخ ✓', msgr: 'ميسنجر', ph: 'اكتب رسالة', rto: 'رد على', photo: 'صورة', link: 'رابط', shot: 'لقطة شاشة', video: 'فيديو', min: 'تصغير', close: 'إغلاق' },
    eg: { reply: 'ريبلاي', copy: 'كوبي', share: 'شير', copied: 'اتنسخ ✓', msgr: 'ميسنجر', ph: 'اكتب رسالة', rto: 'رد على', photo: 'صورة', link: 'لينك', shot: 'سكرين شوت', video: 'فيديو', min: 'تصغير', close: 'قفل' }
  };
  const T = () => L[(typeof lang === 'string' && lang) || 'en'] || L.en;
  const LIBL = () => ({ en: 'Library', ar: 'المكتبة', eg: 'المكتبة' }[(typeof lang === 'string' && lang) || 'en'] || 'Library');
  const LIBSVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/></svg>';
  const css = document.createElement('style'); css.id = 'mgrCss';
  css.textContent = `
.mgr-veil{position:fixed;inset:0;z-index:2147483000;background:rgba(2,6,23,.55);display:none}
.mgr-pop{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483001;width:min(400px,94vw);height:min(560px,86vh);display:none;flex-direction:column;background:#0b141a;color:#e9edef;border:1px solid rgba(255,255,255,.14);border-radius:20px;overflow:hidden;box-shadow:0 18px 54px rgba(0,0,0,.6);direction:ltr}
.mgr-h{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#202c33}
.mgr-av{width:34px;height:34px;border-radius:50%;background:rgba(31,182,255,.2);color:rgb(31,182,255);display:flex;align-items:center;justify-content:center;font-size:16px}
.mgr-h b{flex:1;font-size:15px}
.mgr-hb{width:30px;height:30px;border-radius:50%;border:0;background:transparent;color:#aebac1;font-size:13px;cursor:pointer}
.mgr-hb:hover{background:rgba(255,255,255,.08)}
.mgr-list{flex:1;overflow:auto;padding:12px 10px;display:flex;flex-direction:column;gap:4px;background:#0b141a}
.mgr-day{align-self:center;margin:8px 0;padding:3px 10px;border-radius:8px;background:#182229;color:#8696a0;font-size:11px}
.mgr-b{align-self:flex-end;max-width:82%;padding:6px 8px 4px;border-radius:10px 10px 2px 10px;background:#005c4b;color:#e9edef}
.mgr-t{font-size:14px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}
.mgr-m{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:2px;font-size:10px;color:rgba(233,237,239,.6)}
.mgr-tk{font-size:11px;color:#8696a0}.mgr-b.seen .mgr-tk{color:#53bdeb}
.mgr-q{border-inline-start:3px solid rgb(31,182,255);background:rgba(0,0,0,.22);border-radius:6px;padding:4px 8px;margin-bottom:4px;font-size:12px;color:#c5d0d6;max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere}
.mgr-quote{display:flex;align-items:flex-start;gap:8px;padding:6px 12px;background:#182229;color:#aebac1;font-size:12px}
.mgr-quote span{flex:1;min-width:0;max-height:34vh;overflow-y:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.45}
.mgr-att{display:flex;justify-content:space-around;padding:10px 8px;background:#182229;border-top:1px solid rgba(255,255,255,.06)}
.mgr-ab{display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:none;color:#aebac1;font-size:10px;cursor:pointer}
.mgr-ab i{width:42px;height:42px;border-radius:50%;background:#2a3942;display:flex;align-items:center;justify-content:center;font-size:17px;color:rgb(31,182,255)}
.mgr-comp{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#202c33}
.mgr-ic{width:40px;height:40px;flex:none;border-radius:50%;border:0;background:#2a3942;color:#aebac1;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.mgr-ic:active{transform:scale(.92)}
.mgr-in{flex:1;min-width:0;height:40px;border-radius:20px;border:0;outline:0;padding:0 14px;background:#2a3942;color:#e9edef;font:inherit;font-size:14px}
.mgr-in::placeholder{color:#8696a0}
.mgr-send{background:rgb(31,182,255);color:#06283d}
.mgr-tab{position:fixed;right:0;top:40%;z-index:2147483000;display:none;flex-direction:column;align-items:center;gap:2px;padding:6px 4px;background:#202c33;border:1px solid rgba(255,255,255,.14);border-right:0;border-radius:14px 0 0 14px;box-shadow:0 6px 18px rgba(0,0,0,.45)}
.mgr-tab button{width:34px;height:34px;border:0;border-radius:50%;background:transparent;color:rgb(31,182,255);font-size:17px;cursor:pointer}
.mgr-tab button.x{height:24px;font-size:11px;color:#8696a0}`;
  document.head.appendChild(css);

  /* ---------- Messenger ---------- */
  const M = { mode: 'closed', built: false, quote: '', lastDay: '', nested: false, msgs: [], sig: '', loaded: false, busy: false, sending: false, timer: null };   /* nested = opened from inside something (Reply): only then it may park as a tab */
  const el = {};
  function build() {
    if (M.built) return; M.built = true; const t = T();
    el.veil = document.createElement('div'); el.veil.className = 'mgr-veil';
    el.pop = document.createElement('div'); el.pop.className = 'mgr-pop'; el.pop.dataset.view = 'list';
    el.pop.innerHTML = `<div class="mgr-h"><button type="button" class="mgr-hb" data-back hidden aria-label="${t.close}"><i class="fa-solid fa-chevron-left"></i></button><button type="button" class="mgr-hb mgr-lib" data-lib aria-label="${LIBL()}" title="${LIBL()}">${LIBSVG}</button><span class="mgr-hav mgr-logo" data-hav hidden></span><b data-title dir="auto"></b>
        <button type="button" class="mgr-hb" data-x aria-label="${t.close}" title="${t.close}"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="mgr-cells" data-cells></div>
      <div class="mgr-chat">
      <div class="mgr-list" data-list></div>
      <div class="mgr-quote" data-quote hidden><i class="fa-solid fa-reply"></i><span dir="auto"></span><button type="button" class="mgr-hb" data-qx aria-label="${t.close}"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="mgr-att" data-att hidden>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-image"></i>${t.photo}</button>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-link"></i>${t.link}</button>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-camera"></i>${t.shot}</button>
        <button type="button" class="mgr-ab"><i class="fa-solid fa-video"></i>${t.video}</button></div>
      <div class="mgr-comp"><button type="button" class="mgr-ic" data-mic aria-label="record"><i class="fa-solid fa-microphone"></i></button>
        <textarea class="mgr-in" data-in rows="1" dir="auto" placeholder="${t.ph}" enterkeyhint="send" autocomplete="off" autocapitalize="sentences"></textarea>
        <span class="mgr-sc"><button type="button" class="mgr-ic mgr-send" data-send hidden aria-label="send"><i class="fa-solid fa-paper-plane"></i></button>
        <button type="button" class="mgr-ic mgr-nl" data-nl aria-label="new line"><i class="fa-solid fa-turn-down fa-rotate-90"></i></button></span>
        <button type="button" class="mgr-ic" data-clip aria-label="attach"><i class="fa-solid fa-paperclip"></i></button></div>
      </div>`;
    document.body.append(el.veil, el.pop);
    const q = s => el.pop.querySelector(s);
    el.list = q('[data-list]'); el.in = q('[data-in]'); el.send = q('[data-send]'); el.att = q('[data-att]'); el.quote = q('[data-quote]');
    el.list.addEventListener('click', e => { if (!e.target.closest('.mgr-b,.mgr-eri')) mkClose(); });   /* tap anywhere else = the emoji bar goes and the spacing is back */
    el.title = q('[data-title]'); el.hav = q('[data-hav]'); el.back = q('[data-back]'); el.cells = q('[data-cells]');
    el.veil.addEventListener('pointerdown', leave);                /* tap outside: nested = park as a tab, from the bar = just hide (draft stays) */
    q('[data-x]').onclick = () => askClose();
    q('[data-lib]').onclick = () => { toParent({ type: 'thabit-open-page', page: 'library' }); };
    el.back.onclick = () => { M.nested = false; setView('list'); };
    q('[data-clip]').onclick = () => { el.att.hidden = !el.att.hidden; };
    el.att.querySelectorAll('.mgr-ab').forEach(b => b.onclick = () => { el.att.hidden = true; });   /* look only */
    q('[data-mic]').onclick = () => { };                                                           /* look only */
    q('[data-qx]').onclick = () => setQuote('');
    el.in.addEventListener('input', () => { el.send.hidden = !el.in.value.trim(); mDraftSet(el.in.value); fitIn(); });
    el.in.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
    el.send.onclick = sendMsg;
    /* auto-grow */
    window.fitIn = () => { const mx = Math.round(((window.visualViewport && visualViewport.height) || innerHeight) * 0.4); el.in.style.setProperty('height', 'auto', 'important'); el.in.style.setProperty('height', Math.min(Math.max(el.in.scrollHeight, 40), mx) + 'px', 'important'); el.in.style.overflowY = el.in.scrollHeight > mx ? 'auto' : 'hidden'; };
    /* restore the draft (like WhatsApp) */
    { const dv = mDraft(); if (dv) { el.in.value = dv; el.send.hidden = false; fitIn(); } }
    /* new-line button: tap = one line, hold = a new line every ~0.3s */
    { const nl = q('[data-nl]'); let tm = null, iv = null;
      const ins = () => { const a = el.in, st = a.selectionStart == null ? a.value.length : a.selectionStart, en = a.selectionEnd == null ? st : a.selectionEnd; a.setRangeText('\n', st, en, 'end'); a.dispatchEvent(new Event('input')); a.scrollTop = a.scrollHeight; };
      const stop = () => { clearTimeout(tm); clearInterval(iv); tm = iv = null; };
      nl.addEventListener('pointerdown', e => { e.preventDefault(); try { nl.setPointerCapture(e.pointerId); } catch (x) { } stop(); ins(); tm = setTimeout(() => { iv = setInterval(ins, 320); }, 450); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => nl.addEventListener(ev, stop));
      nl.addEventListener('contextmenu', e => e.preventDefault()); }
    /* phone keyboard: only when you tap the field; the field rides on top of the keyboard, the newest message stays right above it */
    { const vv = window.visualViewport;
      const fitVV = () => { if (!mgrPhone() || !vv || el.pop.style.display === 'none') return; el.pop.style.setProperty('height', vv.height + 'px', 'important'); el.pop.style.setProperty('top', vv.offsetTop + 'px', 'important'); if (document.activeElement === el.in) el.list.scrollTop = el.list.scrollHeight; };
      if (vv) { vv.addEventListener('resize', fitVV); vv.addEventListener('scroll', () => { window.scrollTo(0, 0); fitVV(); }); }
      el.in.addEventListener('focus', () => setTimeout(() => { fitVV(); el.list.scrollTop = el.list.scrollHeight; }, 250));
      el.in.addEventListener('blur', () => setTimeout(fitVV, 250));
      let ty = 0; el.list.addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
      el.list.addEventListener('touchmove', e => { if (document.activeElement === el.in && e.touches[0].clientY - ty > 14) el.in.blur(); }, { passive: true }); }   /* pull the messages down to read older ones = the keyboard goes away */
  }
  const DK = () => 'thabit_mdraft:' + String(tok() || 'x').slice(0, 16);
  const mDraft = () => { try { return (typeof VIEW !== 'undefined' && VIEW) ? '' : (localStorage.getItem(DK()) || ''); } catch (e) { return ''; } };
  const mDraftSet = v => { try { if (typeof VIEW !== 'undefined' && VIEW) return; v && v.trim() ? localStorage.setItem(DK(), v) : localStorage.removeItem(DK()); } catch (e) { } };
  const DLB = () => ({ en: 'Draft', ar: 'مسودة', eg: 'مسودة' }[(typeof lang === 'string' && lang) || 'en'] || 'Draft');
  const hasDraft = () => !!(el.in && el.in.value.trim());   /* only what the student typed counts as a change */
  /* tap outside / minimize: a tab only for a nested Messenger; one opened from the bar button is simply hidden (nothing is cleared) */
  function leave() { if (M.nested) askClose(); else setMode('closed'); }   /* no tabs anywhere: nested = same as X (asks only if something was typed); from the bar = just hides, the draft stays */
  function discard() { el.in.value = ''; el.send.hidden = true; mDraftSet(''); fitIn(); setQuote(''); }
  const CF = { en: ['Are you sure? Some things are not saved.', 'Discard', 'Stay'], ar: ['هل أنت متأكد؟ هناك أشياء لم تُحفظ.', 'تجاهل', 'ابقَ'], eg: ['متأكد؟ فيه حاجات لسه ما اتحفظتش.', 'امسح وقفل', 'استنى'] };
  function askClose() {
    if (true) { M.nested = false; M.view = 'list'; setQuote(''); setMode('closed'); return; }
    setMode('open');
    const c = CF[(typeof lang === 'string' && lang) || 'en'] || CF.en;
    const o = document.createElement('div');
    o.style.cssText = 'position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;background:rgba(2,6,23,.7);padding:20px';
    o.innerHTML = '<div style="background:#202c33;border-radius:16px;padding:18px;max-width:300px;text-align:center"><div dir="auto" style="font-weight:700;margin-bottom:14px"></div><div style="display:flex;gap:8px;justify-content:center"><button type="button" data-y class="mgr-ic" style="width:auto;padding:0 16px;font-size:13px;background:#b42318;color:#fff"></button><button type="button" data-n class="mgr-ic" style="width:auto;padding:0 16px;font-size:13px"></button></div></div>';
    o.querySelector('div>div').textContent = c[0]; o.querySelector('[data-y]').textContent = c[1]; o.querySelector('[data-n]').textContent = c[2];
    o.querySelector('[data-n]').onclick = () => o.remove();
    o.querySelector('[data-y]').onclick = () => { o.remove(); discard(); M.nested = false; M.view = 'list'; setMode('closed'); };
    el.pop.appendChild(o);
  }
  /* ---------- Messages are stored in Supabase (trainee_messages), shown WhatsApp-style, in the trainee's own country time ---------- */
  const MX = {
    en: { today: 'Today', yest: 'Yesterday', fail: 'Could not send, try again', voice: 'Voice message', photo: 'Photo' },
    ar: { today: 'اليوم', yest: 'أمس', fail: 'تعذر الإرسال، حاول مرة أخرى', voice: 'رسالة صوتية', photo: 'صورة' },
    eg: { today: 'النهاردة', yest: 'امبارح', fail: 'معرفناش نبعت، جرب تاني', voice: 'رسالة صوتية', photo: 'صورة' }
  };
  const MXT = () => MX[(typeof lang === 'string' && lang) || 'en'] || MX.en;
  const mTz = () => { try { return traineeZone().tz; } catch (e) { return 'Africa/Cairo'; } };
  const mLoc = () => (typeof lang === 'string' && lang === 'en') ? 'en-GB' : 'ar-EG';
  const mDayKey = iso => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: mTz() }).format(new Date(iso)); } catch (e) { return String(iso).slice(0, 10); } };
  function mDayLabel(iso) {
    const k = mDayKey(iso), now = Date.now(), t = MXT();
    if (k === mDayKey(new Date(now).toISOString())) return t.today;
    if (k === mDayKey(new Date(now - 864e5).toISOString())) return t.yest;
    try { return new Date(iso).toLocaleDateString(mLoc(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: mTz() }); } catch (e) { return k; }
  }
  const mTime = iso => { try { return new Date(iso).toLocaleTimeString(mLoc(), { hour: '2-digit', minute: '2-digit', timeZone: mTz() }); } catch (e) { return ''; } };
  (function () { const s = document.createElement('style'); s.textContent = '.mgr-b.in{align-self:flex-start;background:#202c33;border-radius:10px 10px 10px 2px}.mgr-b a{color:#53bdeb;text-decoration:underline;overflow-wrap:anywhere}.mgr-send:disabled{opacity:.5}'; document.head.appendChild(s); })();
  (function () {
    const s = document.createElement('style'); s.id = 'mgrCss2'; s.textContent = `
.mgr-pop [hidden]{display:none!important}
.mgr-logo{background:#fff url(data:image/png;base64,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) center/contain no-repeat!important;border:0!important}
.mgr-hav{width:32px;height:32px;border-radius:50%;flex:none}
.mgr-chat{flex:1;min-height:0;display:flex;flex-direction:column}
.mgr-pop[data-view=list] .mgr-chat{display:none}
.mgr-pop[data-view=chat] .mgr-cells{display:none}
.mgr-cells{flex:1;overflow:auto;padding:6px 0;background:#0b141a}
.mgr-cell{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:11px 14px;border:0;background:transparent;color:#e9edef;font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mgr-cell:active{background:rgba(255,255,255,.06)}
.mgr-cell.soon{cursor:default;opacity:.7;border-top:1px solid rgba(255,255,255,.06)}
.mgr-cell.soon:active{background:transparent}
.mgr-ca{width:46px;height:46px;flex:none;border-radius:50%;background:#2a3942;color:#8696a0;display:flex;align-items:center;justify-content:center;font-size:19px}
.mgr-cell.soon .mgr-ca{background:transparent;border:1.5px dashed #54656f}
.mgr-cb{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.mgr-c1,.mgr-c2{display:flex;align-items:center;gap:6px;min-width:0}
.mgr-c1 b{flex:1;min-width:0;font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mgr-c1 em{font-style:normal;font-size:11px;color:#8696a0;flex:none}
.mgr-cp{flex:1;min-width:0;font-size:13px;color:#8696a0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mgr-cp.wrap{white-space:normal;line-height:1.45}
.mgr-cell.unr .mgr-c1 b,.mgr-cell.unr .mgr-cp{font-weight:800;color:#fff}
.mgr-cell.unr .mgr-c1 em{font-weight:800;color:#2dd4bf}
.mgr-cn{flex:none;min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:#2dd4bf;color:#06283d;font:800 11px/20px Inter,Cairo,sans-serif;text-align:center}
.mgr-dots{display:inline-flex;align-items:center;gap:2px;flex:none}
.mgr-dots i{display:block;width:4.5px;height:4.5px;border-radius:50%;background:#8696a0}
.mgr-dots.green i{background:#22c55e}
.mgr-dots.red i{background:#ef4444}
.mgr-m .mgr-dots{margin-inline-start:2px}
#mgrNum{display:none;position:absolute!important;top:9px;left:calc(50% + 12px);z-index:5;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:999px;background:#ef4444;color:#fff;-webkit-text-fill-color:#fff;font:800 9px/16px Inter,Cairo,sans-serif;text-align:center;box-shadow:0 0 0 2px #181c20,0 2px 6px rgba(239,68,68,.55);pointer-events:none}
#mgrNum.on{display:block}
#mgrNum.l2{font-size:8px}
#mgrNum.bump{animation:mgrBump .4s cubic-bezier(.3,1.7,.5,1)}
@keyframes mgrBump{0%{transform:scale(.4)}100%{transform:scale(1)}}
body.light-theme #mgrNum{box-shadow:0 0 0 2px #f4f6f9,0 2px 6px rgba(239,68,68,.55)}`;
    document.head.appendChild(s);
  })();

  /* texts of the new list view */
  const MY = {
    en: { title: 'Thabit Messenger', req: 'Requests', reqSub: 'Send a request or a report', asst: 'Assistant', asstSub: 'Your words and practice', more: 'You can add more members', soon: 'You can chat with other trainees from here later. Soon, God willing.' },
    ar: { title: 'ثابت ميسنجر', req: 'الطلبات', reqSub: 'ابعت طلب أو تقرير', asst: 'المساعد', asstSub: 'كلماتك وتدريبك', more: 'تقدر تضيف أعضاء آخرين', soon: 'تقدر تتواصل مع متدربين آخرين من هنا لاحقًا. قريبًا إن شاء الله' },
    eg: { title: 'ثابت ميسنجر', req: 'الطلبات', reqSub: 'ابعت طلب أو تقرير', asst: 'المساعد', asstSub: 'كلماتك وتدريبك', more: 'تقدر تضيف ناس تانية', soon: 'هتقدر تكلم متدربين تانيين من هنا بعدين. قريب إن شاء الله' }
  };
  const MYT = () => MY[(typeof lang === 'string' && lang) || 'en'] || MY.en;
  /* the name shown for the trainer (set window.TH_TRAINER_NAME to change it) */
  const TN = () => window.TH_TRAINER_NAME || ({ en: 'Fadawy', ar: 'فداوي', eg: 'فداوي' }[(typeof lang === 'string' && lang) || 'en'] || 'Trainer');
  const mIsUnread = x => x.sender === 'trainer' && !x.read_at;
  const mUnreadList = () => M.msgs.filter(mIsUnread);

  /* read marks: two grey dots = reached the database, two green dots = the trainer read it, one red dot = did not reach us */
  function mDots(m) {
    let st, n = 2;
    if (m._st === 'fail') { st = 'red'; n = 1; }
    else if (m._st === 'pending') { const old = Date.now() - new Date(m.created_at).getTime() > 1500; st = old ? 'red' : 'gray'; n = 1; }
    else if (m.read_at) st = 'green';
    else { st = 'gray'; if (!(m.delivered_at || M.peerOnline)) n = 1; }   /* saved, but the other side has not opened the app: one dot */
    return '<span class="mgr-dots ' + st + '">' + (n === 1 ? '<i></i>' : '<i></i><i></i>') + '</span>';
  }
  /* ---------- message actions: tap = reactions + Reply / Delete, swipe right = Reply, Delete for me / for everyone ---------- */
  const AXT = {
    en: { edited: 'edited', del: 'This message was deleted', reply: 'Reply', delete: 'Delete', ttl: 'Delete message?', forMe: 'Delete for me', forAll: 'Delete for everyone', cancel: 'Cancel' },
    ar: { edited: 'معدّلة', del: 'تم حذف هذه الرسالة', reply: 'رد', delete: 'حذف', ttl: 'حذف الرسالة؟', forMe: 'حذف لدي', forAll: 'حذف للجميع', cancel: 'إلغاء' },
    eg: { edited: 'معدّلة', del: 'الرسالة دي اتمسحت', reply: 'رد', delete: 'مسح', ttl: 'تمسح الرسالة؟', forMe: 'مسح عندي', forAll: 'مسح للكل', cancel: 'إلغاء' }
  };
  const AX = () => AXT[(typeof lang === 'string' && lang) || 'en'] || AXT.en;
  const MKK = () => 'thabit_mmk:' + String(tok() || 'x').slice(0, 16);
  const mkAll = () => { if (!M.mk) { try { M.mk = JSON.parse(localStorage.getItem(MKK()) || '{}') || {}; } catch (e) { M.mk = {}; } } return M.mk; };
  const mkOf = id => mkAll()[String(id)] || {};
  const mkSave = () => { try { localStorage.setItem(MKK(), JSON.stringify(M.mk)); } catch (e) { } };
  const mkSet = (id, patch) => { const a = mkAll(); a[String(id)] = Object.assign({}, a[String(id)] || {}, patch); mkSave(); };
  const mkSend = (kind, id, emoji, text) => { if (VIEW) return; const a = { p_token: tok(), p_message_id: String(id), p_kind: kind, p_emoji: emoji || null }; if (kind === 'edit') a.p_text = String(text || '').slice(0, 4000); rpc('trainee_msg_mark', a).catch(() => null); };
  /* the database is the master copy: deletions and the trainer's reactions come from there; nothing is ever erased from it */
  async function mkPull() {
    if (VIEW || !tok() || Date.now() < (M.mkOff || 0) || Date.now() - (M.mkAt || 0) < 2900) return; M.mkAt = Date.now();
    const r = await rpc('trainee_msg_marks_list', { p_token: tok() }).catch(() => null);
    if (!(r && r.ok && Array.isArray(r.marks))) { M.mkOff = Date.now() + 60000; return; }
    const srv = {}; r.marks.forEach(x => { const id = String(x.message_id), o = srv[id] = srv[id] || {};
      if (x.kind === 'del_all') o.all = 1; else if (x.kind === 'del_me' && x.side !== 'trainer') o.me = 1; else if (x.kind === 'react') { if (x.side === 'trainer') o.rr = x.emoji; else o.rt = x.emoji; } else if (x.kind === 'edit') o.ed = x.body; });
    const all = mkAll(); let ch = false;
    new Set([...Object.keys(all), ...Object.keys(srv)]).forEach(id => {
      const l = all[id] || {}, v = srv[id] || {}, n = Object.assign({}, l);
      n.all = l.all || v.all || 0; n.me = l.me || v.me || 0; n.rr = v.rr || ''; n.ed = (l.edAt && Date.now() - l.edAt < 10000) ? l.ed : (v.ed || l.ed || '');
      if (!(l.rtAt && Date.now() - l.rtAt < 10000)) n.rt = v.rt || '';
      if (JSON.stringify(n) !== JSON.stringify(l)) { all[id] = n; ch = true; }
    });
    if (ch) { mkSave(); mRender(); lRender(); }
  }
  const EMO = '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😎 🤩 🥳 😏 😒 😔 😢 😭 😤 😡 🤯 😱 😮 😴 🤔 🙄 😬 🤗 🤝 👍 👎 👏 🙌 🙏 💪 👌 ✌️ 🤞 👀 ❤️ 🧡 💛 💚 💙 💜 🖤 💔 💯 🔥 ✨ ⭐ 🎉 ✅ ❌ ❓ ❗ 💡 📌 📚 📝 ⏰ 🎯 🚀 ☕ 🌹'.split(' ');
  function closeOv() { const o = el.pop && el.pop.querySelector('.mgr-ov'); if (o) o.remove(); }
  function ovNew() { closeOv(); const ov = document.createElement('div'); ov.className = 'mgr-ov'; ov.addEventListener('pointerdown', e => { if (e.target === ov) closeOv(); }); el.pop.appendChild(ov); return ov; }
  function mkClose() { closeOv(); const tb = el.pop && el.pop.querySelector('.mgr-tb'); if (tb) tb.remove(); document.body.classList.remove('thb-act'); const had = M.erId != null || M.selId != null; M.erId = null; M.selId = null; if (had) mRender(); }
  function closeAct() { mkClose(); }
  function mkReact(m, e) { const cur = mkOf(m.id).rt; if (cur === e) { mkSet(m.id, { rt: '', rtAt: Date.now() }); mkSend('unreact', m.id); } else { mkSet(m.id, { rt: e, rtAt: Date.now() }); mkSend('react', m.id, e); } closeAct(); mRender(); }
  function mkReply(m) { closeAct(); const q = (m.kind === 'audio' ? MXT().voice : m.kind === 'image' ? MXT().photo : (mkOf(m.id).ed || m.body || '')); setQuote(q); try { el.in.focus({ preventScroll: true }); } catch (e) { } }
  function mkDelete(m) {
    const a = AX(), mine = m.sender !== 'trainer', ov = ovNew();
    const sh = document.createElement('div'); sh.className = 'mgr-ds';
    const h = document.createElement('div'); h.className = 'mgr-dt'; h.textContent = a.ttl; sh.appendChild(h);
    const add = (label, cls, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls || ''; b.textContent = label; b.onclick = fn; sh.appendChild(b); };
    add(a.forMe, 'd', () => { mkSet(m.id, { me: 1 }); mkSend('del_me', m.id); closeAct(); mRender(); lRender(); });
    if (mine) add(a.forAll, 'd', () => { mkSet(m.id, { all: 1 }); mkSend('del_all', m.id); closeAct(); mRender(); lRender(); });   /* only YOUR messages can be deleted for everyone */
    add(a.cancel, '', closeAct);
    ov.appendChild(sh);
  }
  function mkPicker(m) {
    const ov = ovNew();
    const pk = document.createElement('div'); pk.className = 'mgr-pk';
    EMO.forEach(e => { const b = document.createElement('button'); b.type = 'button'; b.textContent = e; b.onclick = () => mkReact(m, e); pk.appendChild(b); });
    ov.appendChild(pk);
  }
  /* tap = the reactions bar right under that message (no blur, the messages below simply move down) */
  function mkBar(m) {
    const mine = m.sender !== 'trainer', mk = mkOf(m.id), bar = document.createElement('div'); bar.className = 'mgr-eri'; bar.style.alignSelf = mine ? 'flex-end' : 'flex-start';
    ['👍', '❤️', '😂', '😮', '😢', '🙏'].forEach(e => { const x = document.createElement('button'); x.type = 'button'; x.textContent = e; if (mk.rt === e) x.className = 'on'; x.onclick = ev => { ev.stopPropagation(); mkReact(m, e); }; bar.appendChild(x); });
    const pl = document.createElement('button'); pl.type = 'button'; pl.className = 'pl'; pl.innerHTML = '<i class="fa-solid fa-plus"></i>'; pl.onclick = ev => { ev.stopPropagation(); mkPicker(m); }; bar.appendChild(pl);
    return bar;
  }
  /* long press = the top bar: a pencil (edit, only your own messages) and a bin */
  function mkTop(m) {
    mkClose(); M.selId = m.id; const mine = m.sender !== 'trainer';
    const tb = document.createElement('div'); tb.className = 'mgr-tb';
    const bt = (icon, fn, cls) => { const x = document.createElement('button'); x.type = 'button'; x.className = cls || ''; x.innerHTML = '<i class="fa-solid ' + icon + '"></i>'; x.onclick = fn; return x; };
    const L = document.createElement('div'); L.appendChild(bt('fa-xmark', mkClose));
    const R = document.createElement('div');
    if (mine && (!m.kind || m.kind === 'text')) R.appendChild(bt('fa-pen', () => mkEdit(m)));
    R.appendChild(bt('fa-trash', () => mkDelete(m), 'rd'));
    tb.append(L, R); el.pop.appendChild(tb); document.body.classList.add('thb-act'); mRender();
  }
  function mkEdit(m) {
    const cur = mkOf(m.id).ed || m.body || ''; mkClose();
    if (M.prevDraft == null) M.prevDraft = el.in.value;
    M.editId = m.id; el.in.value = cur; el.send.hidden = !cur.trim(); fitIn();
    el.quote.hidden = false; el.quote.querySelector('span').textContent = '✎ ' + cur;
    try { el.in.focus({ preventScroll: true }); } catch (e) { }
  }
  function mkApplyEdit() {
    const v = el.in.value.trim(); if (!v) return; const id = M.editId;
    mkSet(id, { ed: v, edAt: Date.now() }); mkSend('edit', id, null, v);
    el.in.value = M.prevDraft || ''; M.prevDraft = null; M.editId = null; el.send.hidden = !el.in.value.trim(); fitIn(); setQuote(''); mRender(); lRender();
  }
  function mAttach(b, m, mk) {
    if (String(M.selId) === String(m.id)) b.classList.add('sel');
    if (mk.rt || mk.rr) { const rx = document.createElement('div'); rx.className = 'mgr-rx'; rx.textContent = (mk.rr || '') + (mk.rt || ''); b.appendChild(rx); b.classList.add('hasrx'); }
    if (m._st || VIEW) return;
    let sx = 0, sy = 0, dx = 0, on = false, mv = false, lt = null;
    const lp = () => { b.dataset.lp = '1'; setTimeout(() => { delete b.dataset.lp; }, 600); mkTop(m); };
    b.addEventListener('touchstart', e => { if (e.touches.length !== 1) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; on = true; mv = false; b.style.transition = 'none'; clearTimeout(lt); lt = setTimeout(lp, 480); }, { passive: true });
    b.addEventListener('touchmove', e => { if (!on) return; const x = e.touches[0].clientX - sx, y = e.touches[0].clientY - sy; if (Math.abs(x) > 8 || Math.abs(y) > 8) clearTimeout(lt); if (!mv && Math.abs(y) > Math.abs(x)) { on = false; return; } if (x <= 0) { dx = 0; if (mv) b.style.transform = ''; return; } if (x > 8) mv = true; dx = Math.min(x, 90); if (mv) b.style.transform = 'translateX(' + dx + 'px)'; }, { passive: true });
    b.addEventListener('touchend', () => { clearTimeout(lt); if (!on && !mv) return; on = false; b.style.transition = 'transform .2s'; b.style.transform = ''; if (mv) { b.dataset.sw = '1'; setTimeout(() => { delete b.dataset.sw; }, 450); } if (dx >= 60 && !mkOf(m.id).all) mkReply(m); dx = 0; mv = false; }, { passive: true });
    b.addEventListener('touchcancel', () => { clearTimeout(lt); on = false; }, { passive: true });
    b.addEventListener('contextmenu', e => { e.preventDefault(); if (!b.dataset.lp) lp(); });
    b.addEventListener('click', e => {
      if (b.dataset.sw || b.dataset.lp) return; if (e.target.closest && e.target.closest('a')) return;
      const now = Date.now();
      if (M.lastTap && String(M.lastTap.id) === String(m.id) && now - M.lastTap.t < 320) { M.lastTap = null; if (mkOf(m.id).rt !== '👌') mkReact(m, '👌'); else mkClose(); return; }   /* double tap = OK 👌 */
      M.lastTap = { id: m.id, t: now };
      const was = String(M.erId) === String(m.id); mkClose(); if (was) return;
      M.erId = m.id; mRender(); const br = el.list.querySelector('.mgr-eri'); if (br && br.scrollIntoView) br.scrollIntoView({ block: 'nearest' });
    });
  }
  function mBubble(m) {
    const b = document.createElement('div'), mine = m.sender !== 'trainer', t = MXT(), mk0 = mkOf(m.id);
    if (mk0.all || mk0.me) {
      b.className = 'mgr-b del' + (mine ? '' : ' in'); b.dataset.id = m.id;
      const tx0 = document.createElement('div'); tx0.className = 'mgr-t'; tx0.dir = 'auto'; tx0.innerHTML = '<i class="fa-solid fa-ban"></i> <span></span>'; tx0.lastChild.textContent = AX().del; b.appendChild(tx0);
      const mm0 = document.createElement('div'); mm0.className = 'mgr-m'; mm0.innerHTML = '<span></span>'; mm0.firstChild.textContent = mTime(m.created_at); b.appendChild(mm0);
      return b;
    }
    b.className = 'mgr-b' + (mine ? '' : ' in') + (mine && m.read_at ? ' seen' : ''); b.dataset.id = m.id;
    if (m.quote) { const qq = document.createElement('div'); qq.className = 'mgr-q'; qq.dir = 'auto'; qq.textContent = m.quote; b.appendChild(qq); }
    const tx = document.createElement('div'); tx.className = 'mgr-t'; tx.dir = 'auto';
    if (m.kind === 'link' || m.kind === 'audio' || m.kind === 'image') {
      const u = m.kind === 'link' ? m.body : m.url;
      if (/^https?:\/\//i.test(u || '')) { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = m.kind === 'link' ? u : (m.kind === 'audio' ? t.voice : t.photo); tx.appendChild(a); }
      else tx.textContent = m.body || '';
    } else tx.textContent = m.body || '';
    if (mk0.ed && (!m.kind || m.kind === 'text')) tx.textContent = mk0.ed;
    b.appendChild(tx);
    const mm = document.createElement('div'); mm.className = 'mgr-m';
    mm.innerHTML = '<span></span>' + (mine ? mDots(m) : '');
    mm.firstChild.textContent = mTime(m.created_at) + (mk0.ed ? ' · ' + AX().edited : ''); b.appendChild(mm);
    mAttach(b, m, mk0);
    if (m._st === 'fail') { b.style.cursor = 'pointer'; b.onclick = () => { m._st = 'pending'; m.created_at = new Date().toISOString(); mRender(); mPost(m); }; }   /* tap a red message = try again */
    return b;
  }
  function mRender() {
    if (!el.list) return;
    const l = el.list, atEnd = l.scrollHeight - l.scrollTop - l.clientHeight < 80 || !M.loaded; let day = '';
    l.innerHTML = '';
    M.msgs.forEach(m => {
      const k = mDayKey(m.created_at);
      if (k !== day) { day = k; const d = document.createElement('div'); d.className = 'mgr-day'; d.textContent = mDayLabel(m.created_at); l.appendChild(d); }
      l.appendChild(mBubble(m));
      if (String(M.erId) === String(m.id)) l.appendChild(mkBar(m));
    });
    M.loaded = true; if (atEnd) l.scrollTop = l.scrollHeight;
  }
  /* the number on the Messenger button = how many PEOPLE sent something not read yet (not how many messages) */
  function mBadge() {
    toParent({ type: 'thabit-messenger-badge', count: new Set(mUnreadList().map(x => x.sender_id || 'trainer')).size });
    const b = document.getElementById('mgrNum'); if (!b) return;
    const n = new Set(mUnreadList().map(x => x.sender_id || 'trainer')).size;
    const txt = n > 99 ? '99+' : (n ? String(n) : '');
    if (b.textContent !== txt) { b.textContent = txt; b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump'); }
    b.classList.toggle('on', n > 0); b.classList.toggle('l2', txt.length > 1);
  }
  function mCellTime(iso) {
    const k = mDayKey(iso), now = Date.now();
    if (k === mDayKey(new Date(now).toISOString())) return mTime(iso);
    if (k === mDayKey(new Date(now - 864e5).toISOString())) return MXT().yest;
    try { return new Date(iso).toLocaleDateString(mLoc(), { day: 'numeric', month: 'numeric', year: '2-digit', timeZone: mTz() }); } catch (e) { return k; }
  }
  /* the list: the trainer first (bold when something is unread), then a "soon" cell */
  function lRender() {
    if (!el.cells) return; const t = MYT(), last = M.msgs[M.msgs.length - 1], un = mUnreadList().length;
    let prev = '', tm = '';
    if (last) { prev = last.kind === 'audio' ? MXT().voice : last.kind === 'image' ? MXT().photo : (last.body || ''); tm = mCellTime(last.created_at); }
    if (last && (mkOf(last.id).all || mkOf(last.id).me)) prev = AX().del;
    const dr = mDraft(); if (dr) { prev = dr.replace(/\s+/g, ' '); tm = ''; }
    el.cells.dir = (typeof lang === 'string' && lang === 'en') ? 'ltr' : 'rtl';
    el.cells.innerHTML = `<button type="button" class="mgr-cell${un ? ' unr' : ''}" data-open>
        <span class="mgr-ca mgr-logo"></span>
        <span class="mgr-cb"><span class="mgr-c1"><b dir="auto">${esc(TN())}</b><em>${esc(tm)}</em></span>
          <span class="mgr-c2">${!dr && last && last.sender !== 'trainer' ? mDots(last) : ''}<span class="mgr-cp" dir="auto">${dr ? `<i class="mgr-dr">${DLB()}: </i>` : ''}${esc(prev)}</span>${un ? `<span class="mgr-cn">${un}</span>` : ''}</span></span></button>
      <button type="button" class="mgr-cell" data-req><span class="mgr-ca" style="color:#38bdf8"><i class="fa-solid fa-paper-plane"></i></span>
        <span class="mgr-cb"><span class="mgr-c1"><b dir="auto">${esc(t.req)}</b></span><span class="mgr-c2"><span class="mgr-cp" dir="auto">${esc(t.reqSub)}</span></span></span></button>
      <button type="button" class="mgr-cell" data-as><span class="mgr-ca" style="color:#34d399"><i class="fa-solid fa-microphone-lines"></i></span>
        <span class="mgr-cb"><span class="mgr-c1"><b dir="auto">${esc(t.asst)}</b></span><span class="mgr-c2"><span class="mgr-cp" dir="auto">${esc(t.asstSub)}</span></span></span></button>`;
    el.cells.querySelector('[data-open]').onclick = () => setView('chat');
    /* Requests / Assistant: the Messenger steps aside (phone: stays underneath so Back returns to it) and the other screen opens */
    const away = () => { if (mgrPhone()) { M.susp = true; el.pop.style.display = 'none'; } else setMode('closed'); };
    el.cells.querySelector('[data-req]').onclick = () => { toParent({ type: 'thabit-open-page', page: 'dash', then: 'requests' }); };
    el.cells.querySelector('[data-as]').onclick = () => { toParent({ type: 'thabit-open-page', page: 'dash', then: 'assistant' }); };
  }
  const mgrPhone = () => matchMedia('(max-width:820px) and (pointer:coarse)').matches;
  const mRenderAll = () => { mBadge(); lRender(); mRender(); };
  const mSig = a => a.filter(x => !x._st).map(x => x.id + ':' + (x.read_at ? 1 : 0) + (x.delivered_at ? 1 : 0)).join(',') + '|' + (M.peerOnline ? 1 : 0);
  /* the trainer's messages count as read only while his conversation is really open on screen */
  function mMarkRead() {
    if (VIEW || !tok() || M.mode !== 'open' || M.view !== 'chat') return;
    const un = mUnreadList(); if (!un.length) return;
    rpc('trainee_msg_mark_read', { p_token: tok() }).then(r => {
      if (r && r.ok === false) return;
      const now = new Date().toISOString(); un.forEach(x => { x.read_at = now; }); M.sig = mSig(M.msgs); mRenderAll();
    }).catch(() => null);
  }
  async function mLoad() {
    if (M.busy || !tok()) return; M.busy = true;
    try {
      const r = await rpc('trainee_msg_list', { p_token: tok(), p_after: 0 }).catch(() => null);
      if (r && r.ok && Array.isArray(r.messages)) {
        const sig = mSig(r.messages);
        if (sig !== M.sig || !M.fetched) { M.msgs = r.messages.concat(M.msgs.filter(x => x._st)); M.sig = sig; M.fetched = true; mRenderAll(); }
        mMarkRead(); mkPull();
      }
    } finally { M.busy = false; }
  }
  function setView(v) {
    M.view = v; if (!el.pop) return; el.pop.dataset.view = v;
    el.title.textContent = v === 'chat' ? TN() : '';   /* the page name is already shown outside the card */ el.back.hidden = v !== 'chat'; el.hav.hidden = v !== 'chat';
    if (v === 'chat') { mRender(); el.list.scrollTop = el.list.scrollHeight; if (!mgrPhone()) setTimeout(() => { try { el.in.focus({ preventScroll: true }); } catch (e) { } }, 60); mMarkRead(); }
    else lRender();
  }
  function setMode(m) {
    if (m !== 'open') { toParent({ type: 'thabit-close-page', page: 'messenger' }); m = 'open'; M.view = M.nested ? M.view : 'list'; }
    build(); const was = M.mode; M.mode = m; M.susp = false;
    el.veil.style.display = m === 'open' ? 'block' : 'none';
    el.pop.style.display = m === 'open' ? 'flex' : 'none';
    if (m !== 'open') { el.att.hidden = true; clearInterval(M.timer); M.timer = null; }
    if (m === 'open') {
      setView(M.view || 'list');
      if (was !== 'open') { mLoad(); clearInterval(M.timer); M.timer = setInterval(() => { if (document.hidden) return; const gap = M.view === 'chat' ? 1500 : 5000; if (Date.now() - (M.lastPoll || 0) >= gap - 50) { M.lastPoll = Date.now(); mLoad(); } }, 500); }   /* chat open = a check every 1.5s (a new message shows up almost at once); the list = every 5s */
    }
  }
  function setQuote(s) {
    if (!s && M.editId) { M.editId = null; if (M.prevDraft != null) { el.in.value = M.prevDraft; M.prevDraft = null; fitIn(); el.send.hidden = !el.in.value.trim(); } }
    M.quote = s || ''; el.quote.hidden = !M.quote; el.quote.querySelector('span').textContent = M.quote;
  }
  async function mPost(tmp) {
    const r = await rpc('trainee_msg_send', { p_token: tok(), p_kind: 'text', p_body: tmp.body, p_quote: tmp.quote || null }).catch(() => null);
    const i = M.msgs.indexOf(tmp);
    if (r && r.ok && r.message) { if (i >= 0) M.msgs.splice(i, 1); if (!M.msgs.some(x => x.id === r.message.id)) M.msgs.push(r.message); }
    else { tmp._st = 'fail'; itToast(MXT().fail); }          /* stays in the chat with a red dot; tap it to send again */
    M.sig = mSig(M.msgs); M.loaded = false; mRenderAll();
  }
  function sendMsg() {
    if (M.editId) return mkApplyEdit();
    const v = el.in.value.trim(); if (!v) return;
    const tmp = { id: 't' + Date.now() + Math.random().toString(36).slice(2, 6), sender: 'trainee', kind: 'text', body: v, quote: M.quote || null, created_at: new Date().toISOString(), _st: 'pending' };
    M.msgs.push(tmp); el.in.value = ''; el.send.hidden = true; mDraftSet(''); fitIn(); setQuote(''); M.loaded = false; mRenderAll();
    setTimeout(() => { if (tmp._st === 'pending') mRender(); }, 1600);   /* still not sent after 1.6s -> the dot turns red */
    mPost(tmp);
  }
  function openMessenger(quote) { build(); M.nested = quote !== undefined; if (quote !== undefined) M.view = 'chat'; setMode('open'); if (quote !== undefined) setQuote(quote); }   /* Reply goes straight into the chat with the quote */
  window.thMessenger = {
    open: openMessenger, dock: () => leave(), close: () => askClose(),
    state: () => ({ open: M.mode === 'open', chat: M.view === 'chat' }),
    back: () => { if (M.view === 'chat') { M.nested = false; setView('list'); } },      /* chat -> the list */
    hide: () => { M.nested = false; setMode('closed'); },                              /* closes it, the typed draft stays */
    suspend: on => { if (!el.pop) return; if (on && M.mode === 'open') { M.susp = true; el.pop.style.display = 'none'; } else if (M.susp) { M.susp = false; if (M.mode === 'open') el.pop.style.display = 'flex'; } },
    name: () => TN(),
    msgs: () => M.msgs.slice(),
    reload: () => mLoad(), refresh: () => mRenderAll(),
    visible: () => M.mode === 'open' && !M.susp
  };
  /* presence: any sign of life (touch, mouse, key, scroll, copy...) in the last 10s = online. Never from the admin "view as" page. */
  let lastAct = Date.now();
  ['pointerdown', 'pointermove', 'touchstart', 'touchmove', 'keydown', 'scroll', 'wheel', 'click', 'input', 'copy', 'paste', 'focus'].forEach(ev => window.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true, capture: true }));
  /* every 10s: tell the server whether the student is active, and learn whether the trainer is online */
  const ping = () => {
    if (VIEW || !tok() || document.hidden) return;
    rpc('trainee_presence_ping', { p_token: tok(), p_active: Date.now() - lastAct <= 10500 }).then(r => {
      if (r && r.ok) { const on = !!r.trainer_online; if (on !== M.peerOnline) { M.peerOnline = on; mRenderAll(); } }
    }).catch(() => null);
  };
  setTimeout(ping, 2000); setInterval(ping, 10000);
  setInterval(() => { if (M.mode === 'open' && M.view === 'chat') ping(); }, 3000);   /* chat open: online / read status refreshes every 3s instead of 10s */
  /* background check: the number on the button stays right even while the pop-up is closed */
  setTimeout(() => { if (!document.hidden) mLoad(); }, 1500);
  setInterval(() => { if (!document.hidden && M.mode !== 'open') mLoad(); }, 10000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) mLoad(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && M.mode === 'open') leave(); }, true);

  /* ---------- page mode ---------- */
  const pcss = document.createElement('style');
  pcss.textContent = `html,body{margin:0;height:100%;overflow:hidden;background:transparent;font-family:Inter,Cairo,sans-serif}
.mgr-veil{display:none!important}
.mgr-pop{left:0!important;top:0!important;transform:none!important;width:100%!important;max-width:none!important;height:100%!important;height:100dvh!important;border-radius:20px!important;border:0!important;box-shadow:none!important}
.mgr-comp{padding-bottom:calc(8px + env(safe-area-inset-bottom))!important}`;
  document.head.appendChild(pcss);
  window.addEventListener('message', e => {
    const d = e.data; if (!d) return;
    if (d.type === 'thabit-theme') applyTheme(d.theme === 'light');
    else if (d.type === 'thabit-messenger-quote') { window.thMessenger.open(String(d.quote || '')); }
  });
  /* the time zone follows the trainee's country: read the profile once, then repaint */
  if (!VIEW && tok()) rpc('trainee_dashboard', { p_token: tok() }).then(r => { if (r && r.profile) { D.profile = r.profile; try { window.thMessenger.refresh(); } catch (e) { } } }).catch(() => null);
  window.thMessenger.open();
  window.addEventListener('pageshow', () => { try { window.thMessenger.reload(); } catch (e) { } });
})();
