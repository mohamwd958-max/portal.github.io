/* ==========================================================
   THABIT SYSTEM - ADMIN PANEL DASHBOARD & SUPABASE SCRIPT
   ================================================          */

(function () {
    var LOGO = '<g transform="translate(2.00 4.12) scale(0.10237) translate(-49.5 -12.5)"><path d="M322.8 24.2L317.2 21.0L312.3 19.8L307.5 19.8L301.5 21.0L292.8 24.5L281.8 31.8L273.3 39.7L258.0 55.3L243.5 68.2L235.8 72.8L231.3 74.5L223.0 76.2L216.3 76.0L209.8 74.2L204.7 71.3L200.2 67.0L197.5 62.7L195.8 58.7L194.7 52.3L194.7 47.0L195.8 40.8L197.0 39.0L199.0 33.0L203.3 27.0L211.2 19.8L219.7 15.2L223.3 14.2L224.7 12.5L216.8 13.0L208.3 15.0L207.2 16.0L199.0 19.7L193.0 24.2L188.0 29.0L183.7 34.7L178.7 44.0L175.7 55.3L176.0 65.8L178.8 75.5L180.5 78.8L183.8 83.2L188.8 87.8L194.5 91.3L198.0 93.0L204.5 94.5L211.7 95.2L221.7 94.5L228.7 92.8L239.2 87.8L252.0 79.0L262.8 68.2L274.0 55.3L282.3 47.2L288.0 42.7L296.5 38.0L302.8 37.3L305.3 38.7L307.3 42.7L307.3 49.7L302.7 64.2L293.5 82.5L291.2 85.7L290.3 88.0L286.7 93.3L284.2 98.3L281.8 101.3L279.8 105.5L277.2 108.8L275.2 113.0L272.5 116.3L262.7 132.7L259.8 135.8L220.2 139.0L210.8 139.2L203.7 140.3L194.3 140.7L186.8 141.8L152.0 143.7L144.0 145.0L102.3 148.0L100.2 148.8L96.3 153.2L95.5 155.2L93.2 157.7L91.0 161.3L82.5 171.5L81.8 173.2L68.5 190.2L66.5 193.5L64.0 196.0L63.3 197.7L59.3 202.3L59.5 203.8L74.8 203.3L81.0 202.2L89.2 201.8L97.8 200.7L134.5 198.7L141.2 197.5L150.0 197.3L155.7 196.5L156.8 196.8L156.8 198.2L144.8 214.8L142.3 217.5L137.2 225.3L128.7 236.0L128.0 237.7L125.3 240.7L114.0 256.8L82.0 299.3L72.2 308.8L67.2 312.3L57.3 316.7L50.5 318.5L49.5 319.7L49.7 321.2L51.8 321.5L59.5 320.5L101.0 318.5L114.2 317.0L127.5 313.8L132.2 310.7L136.7 306.0L175.8 243.2L178.3 240.2L180.7 235.7L208.0 193.3L210.3 192.3L220.2 191.3L223.3 191.5L224.3 193.0L222.0 196.0L219.3 201.2L211.5 213.0L201.5 230.2L188.2 251.2L187.5 253.2L180.5 263.8L173.8 276.2L169.8 282.0L160.5 298.5L158.7 304.0L158.7 310.2L160.7 315.5L165.2 319.7L170.2 321.5L175.5 321.3L179.2 320.0L182.5 318.0L187.8 313.5L215.8 283.8L234.7 265.3L251.8 251.5L259.0 248.0L261.0 248.0L262.8 249.2L263.8 254.0L263.0 259.7L258.7 272.5L255.7 285.2L254.8 299.0L255.7 305.3L258.7 312.7L263.3 318.2L269.8 321.3L275.3 322.5L279.3 322.7L286.0 321.5L294.5 318.2L301.5 313.5L308.8 307.0L317.8 296.3L327.2 281.5L330.7 273.0L332.0 271.0L334.0 264.3L335.0 263.0L335.3 260.7L336.5 258.5L337.0 253.3L335.7 252.7L333.8 254.2L330.0 262.5L325.7 270.2L323.2 273.3L321.3 277.2L315.0 285.8L306.7 294.8L300.0 300.0L293.8 303.0L286.5 303.0L283.5 300.5L282.0 297.2L282.0 286.5L284.7 274.7L286.0 272.2L287.8 263.8L290.5 257.0L293.7 242.0L294.0 234.3L293.7 229.8L290.3 223.3L287.2 220.8L282.7 218.8L275.8 218.8L270.0 220.5L265.5 222.3L254.3 229.5L235.8 245.2L226.5 254.5L224.7 257.2L205.8 277.3L204.8 277.7L204.5 276.5L218.7 252.3L221.2 249.0L228.0 236.7L235.2 225.7L235.7 224.0L249.0 203.2L249.5 201.5L255.5 191.7L257.7 189.0L259.8 188.2L266.8 188.2L274.5 186.8L295.7 185.3L308.8 185.0L316.5 183.7L324.0 183.5L332.0 182.3L341.5 182.0L347.7 181.2L368.2 180.3L373.2 179.3L374.8 178.2L376.8 173.7L377.8 172.7L379.8 167.7L381.2 166.2L396.3 135.7L398.3 130.7L401.0 126.5L401.0 124.8L385.3 125.5L379.8 126.5L370.7 126.8L362.7 128.0L328.8 130.0L322.2 131.2L314.5 131.3L304.2 132.7L293.5 133.2L292.2 132.3L292.5 130.8L295.2 127.8L297.2 123.7L299.5 120.7L313.5 97.3L322.7 79.2L326.2 69.5L327.3 67.8L330.5 55.2L331.3 47.2L330.7 39.0L327.2 28.8Z" fill="currentColor" stroke="none"/></g>';
    var mandala = [0,45,90,135,180,225,270,315].map(function (a) {
        return '<ellipse cx="20" cy="10.5" rx="2.8" ry="6.5" transform="rotate(' + a + ' 20 20)"/>';
    }).join('') + '<circle cx="20" cy="20" r="2.2"/>';
    var icons = {
        th: LOGO,
        sun: '<circle cx="20" cy="20" r="6"/><path d="M20 4v4M20 32v4M4 20h4M32 20h4M8.7 8.7l2.8 2.8M28.5 28.5l2.8 2.8M8.7 31.3l2.8-2.8M28.5 11.5l2.8-2.8"/>',
        moon: '<path transform="translate(3 3) scale(1.4)" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
        eye: '<path d="M3 20c5-8 11-12 17-12s12 4 17 12c-5 8-11 12-17 12S8 28 3 20z"/><circle cx="20" cy="20" r="5.5"/><circle cx="20" cy="20" r="1.8"/>',
        bolt: '<path d="M23 4L9 22h9l-2 14 15-19h-9z"/>',
        T: '<text x="20" y="31" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="900" font-size="32" stroke-width="1.4">T</text>',
        small: '<text x="20" y="28" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="900" font-size="22" stroke-width="1.3">th</text>',
        ain: '<text x="20" y="29" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="700" font-size="30" stroke-width="1.2">\u0639</text>',
        tha: '<text x="20" y="29" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="700" font-size="30" stroke-width="1.2">\u062b</text>',
        note: '<path d="M14 29V9l16-4v20"/><ellipse cx="10.5" cy="29" rx="4.5" ry="3.5"/><ellipse cx="26.5" cy="25" rx="4.5" ry="3.5"/>',
        mic: '<rect x="15.5" y="5" width="9" height="17" rx="4.5"/><path d="M10 19a10 10 0 0 0 20 0M20 29v6M14 35h12"/>',
        doc: '<rect x="9" y="5" width="22" height="30" rx="3"/><path d="M14 14h12M14 20h12M14 26h7"/>',
        bulb: '<path d="M15 29h10M17 34h6M20 5a10 10 0 0 0-6 18c1.2 1 2 2.6 2 4.5v1.5h8v-1.5c0-1.9.8-3.5 2-4.5A10 10 0 0 0 20 5z"/>',
        mandala: mandala,
        book: '<path d="M20 11c-4-3-9-4-14-3v22c5-1 10 0 14 3 4-3 9-4 14-3V8c-5-1-10 0-14 3zM20 11v22"/>',
        target: '<circle cx="20" cy="20" r="13"/><circle cx="20" cy="20" r="8"/><circle cx="20" cy="20" r="3"/>'
    };
    var names = Object.keys(icons);
    var STEP = 60, N = 6, TILE = STEP * N, SCALE = 0.72;
    var angles = [-14, -6, 0, 7, 13, -9, 4];
    var defs = '';
    names.forEach(function (n) {
        defs += '<g id="thi-' + n + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[n] + '</g>';
    });
    var uses = '';
    for (var r = 0; r < N; r++) {
        for (var c = 0; c < N; c++) {
            var id = names[(r * 5 + c * 3) % names.length];
            var x = (r % 2 ? 45 : 15) + c * STEP;
            var y = 30 + r * STEP;
            var a = angles[(r * 3 + c * 5) % angles.length];
            uses += '<use href="#thi-' + id + '" transform="translate(' + x + ' ' + y + ') rotate(' + a + ') scale(' + SCALE + ') translate(-20 -20)"/>';
        }
    }
    var svg = '<svg id="thabitBg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' + defs + '<pattern id="thabitTile" width="' + TILE + '" height="' + TILE + '" patternUnits="userSpaceOnUse">' + uses + '</pattern></defs>' +
        '<rect width="100%" height="100%" fill="url(#thabitTile)"/></svg>';
    document.body.insertAdjacentHTML('afterbegin', svg);
})();

const SUPABASE_URL = "https://vkfexceitwjmxncwceqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";

const PROFILES_TABLE = "basic_info";
const DAILY_SUPPLY_TABLE = "daily_supply";
const ARCHIVE_TABLE = "archive";

function esc(v) {
    return String(v === null || v === undefined ? '' : v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function showToast(message, isError = false, orange = false) {
    const toast = document.getElementById('generalToast');
    const msg = document.getElementById('generalToastMsg');
    const icon = document.getElementById('generalToastIcon');
    if (!toast || !msg) { alert(message); return; }
    msg.textContent = message;
    const cls = isError ? (orange ? 't-orange' : 't-red') : 't-success';
    toast.className = 'show ' + cls;
    if (icon) {
        icon.className = isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
    }
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.className = '';
    }, isError ? 8000 : 3000);
}

function goToPortal() { window.location.href = 'index.html'; }

window.addEventListener('DOMContentLoaded', async () => {
    const authHome = document.getElementById('thaAuthHome');
    if (authHome) authHome.onclick = goToPortal;
    document.querySelectorAll('.admin-collapsible-section').forEach(e => { e.style.display = 'none'; });
    let s = loadAdminSession();
    if (s && s.expires_at - nowSec() < 120) { s = (await refreshAdminSession()) ? loadAdminSession() : null; }
    if (s) { window.SB_ACCESS_TOKEN = s.access_token; showAuthModal(false); openAdminMainPanel(); refreshWordLists(); }
    else showLoginScreen('');
    setInterval(() => { const t = loadAdminSession(); if (t && t.expires_at - nowSec() < 600) refreshAdminSession(); }, 240000);
});

function showAuthModal(show) {
    const authBox = document.getElementById('thaAuth');
    if (authBox) authBox.classList.toggle('open', show);
}

function openAdminMainPanel() {
    const modalOverlay = document.getElementById('adminModalOverlay');
    if (modalOverlay) modalOverlay.classList.add('open');
    showAdminView('home');
}

function toggleAdminPanel() {
    const o = document.getElementById('adminModalOverlay');
    if (o) o.classList.toggle('open');
}

function showAdminView(v) {
    const panelBox = document.getElementById('adminPanel');
    if (panelBox) panelBox.style.maxWidth = '680px';
    const homeEl = document.getElementById('adminHome');
    const voicesEl = document.getElementById('adminViewVoices');
    const reportsEl = document.getElementById('adminViewReports');
    const modsEl = document.getElementById('adminViewMods');
    const dashboardMainEl = document.getElementById('adminViewDashboardMain');
    const subContainer = document.getElementById('adminDynamicSubContainer');

    if (homeEl) homeEl.style.display = v === 'home' ? 'flex' : 'none';
    if (voicesEl) voicesEl.style.display = v === 'voices' ? 'block' : 'none';
    if (reportsEl) reportsEl.style.display = v === 'reports' ? 'block' : 'none';
    if (modsEl) modsEl.style.display = v === 'mods' ? 'block' : 'none';
    if (dashboardMainEl) dashboardMainEl.style.display = v === 'dashboardMain' ? 'flex' : 'none';
    if (subContainer) subContainer.style.display = v === 'sub' ? 'block' : 'none';
}

/* ==========================================================
   Supabase helpers
   ========================================================== */

// لما نضيف تسجيل دخول: خزّن توكن المستخدم في window.SB_ACCESS_TOKEN وكل الطلبات هتستخدمه تلقائياً
function sbHeaders(extra) {
    return Object.assign({
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + (window.SB_ACCESS_TOKEN || SUPABASE_ANON_KEY),
        'Content-Type': 'application/json'
    }, extra || {});
}

function friendlyError(txt) {
    try {
        const j = JSON.parse(txt);
        if (j.code === '42501') return 'الصلاحيات ناقصة على الجدول (42501). شغّل سكريبت الـ SQL في Supabase.';
        if (j.code === 'PGRST204') return 'عمود غير موجود في الجدول: ' + (j.message || '');
        if (j.code === '42703') return 'عمود غير موجود: ' + (j.message || '');
        return (j.message || txt) + (j.hint ? ' | ' + j.hint : '');
    } catch (e) { return txt; }
}

async function sbFetch(path, opts) {
    opts = opts || {};
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, Object.assign({}, opts, { headers: sbHeaders(opts.headers) }));
    if (res.status === 401 && window.SB_ACCESS_TOKEN) onSessionExpired();
    if (!res.ok) throw new Error(friendlyError(await res.text()));
    return res;
}

// يحدّث السجل لو موجود (بنفس المفتاح) وإلا يضيف سجل جديد
async function upsertByKey(table, keyFilter, body) {
    const hdr = { 'Prefer': 'return=representation' };
    let res = await sbFetch(`${table}?${keyFilter}`, { method: 'PATCH', headers: hdr, body: JSON.stringify(body) });
    let rows = await res.json();
    if (Array.isArray(rows) && rows.length) return rows[0];
    res = await sbFetch(table, { method: 'POST', headers: hdr, body: JSON.stringify(body) });
    rows = await res.json();
    return Array.isArray(rows) ? rows[0] : rows;
}

// يجيب كل الصفوف على دفعات (Supabase بيرجع 1000 صف كحد أقصى في الطلب)
async function fetchAllRows(path) {
    const PAGE = 1000;
    const rows = [];
    for (let offset = 0; ; offset += PAGE) {
        const res = await sbFetch(`${path}&limit=${PAGE}&offset=${offset}`);
        const part = await res.json();
        if (!Array.isArray(part)) break;
        rows.push(...part);
        if (part.length < PAGE) break;
    }
    return rows;
}

async function fetchStudentsFromSupabase() {
    // بنقرا الاسم والـ id بس (باقي بيانات basic_info، زي الماليات، مش لازم الـ anon key تشوفها)
    const res = await sbFetch(`${PROFILES_TABLE}?select=id,trainee&order=trainee.asc`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function fetchDailySupplyForWeek(range) {
    const res = await sbFetch(`${DAILY_SUPPLY_TABLE}?select=*&supply_date=gte.${range.min}&supply_date=lte.${range.max}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

/* ==========================================================
   Dates
   ========================================================== */

function localDateStr(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// نطاق الأسبوع الحالي: من السبت إلى الخميس
function getCurrentWeekRange() {
    const d = new Date();
    const idx = (d.getDay() + 1) % 7; // السبت = 0 ... الجمعة = 6
    const sat = new Date(d.getFullYear(), d.getMonth(), d.getDate() - idx);
    const thu = new Date(sat.getFullYear(), sat.getMonth(), sat.getDate() + 5);
    return { min: localDateStr(sat), max: localDateStr(thu) };
}

/* ==========================================================
   Daily Supply
   ========================================================== */

const SUPPLY_FIELDS = [
    { key: 'group_name', type: 'text', w: 'w-24' },
    { key: 'supply_date', type: 'date', w: 'w-36' },
    { key: 'session_number', type: 'number', w: 'w-16' },
    { key: 'session_title', type: 'text', w: 'w-32' },
    { key: 'sub_title', type: 'text', w: 'w-28' },
    { key: 'start_time', type: 'time', w: 'w-24' },
    { key: 'end_time', type: 'time', w: 'w-24' },
    { key: 'around_h', type: 'number', w: 'w-14', min: 0, max: 23 },
    { key: 'around_m', type: 'number', w: 'w-14', min: 0, max: 59 },
    { key: 'revision', type: 'text', w: 'w-20' },
    { key: 'revision_details', type: 'text', w: 'w-32' },
    { key: 'notes', type: 'text', w: 'w-32' },
    { key: 'tefl', type: 'text', w: 'w-20' },
    { key: 'qol', type: 'text', w: 'w-20' },
    { key: 'attitude', type: 'number', w: 'w-16', min: 1, max: 10 },
    { key: 'attitude_details', type: 'text', w: 'w-32' },
    { key: 'soft_skills', type: 'number', w: 'w-16' },
    { key: 'soft_skills_details', type: 'text', w: 'w-32' },
    { key: 'attendance', type: 'number', w: 'w-16', min: 1, max: 10 },
    { key: 'attendance_details', type: 'text', w: 'w-32' },
    { key: 'performance', type: 'number', w: 'w-16' },
    { key: 'why', type: 'text', w: 'w-24' },
    { key: 'performance_details', type: 'text', w: 'w-32' },
    { key: 'weak_points', type: 'text', w: 'w-32' },
    { key: 'tasks', type: 'text', w: 'w-32' },
    { key: 'left_overs', type: 'text', w: 'w-32' },
    { key: 'plans', type: 'text', w: 'w-32' }
];

let supplyState = { students: [], records: [], range: null, parts: [], items: [] };
let archiveState = { rows: [], cols: [], from: '', to: '' };

const INPUT_CLS = 'bg-slate-950 border border-slate-700 rounded p-1 text-xs text-white';
const DS_PART_KEYS = ['start_time', 'end_time', 'around_h', 'around_m', 'notes'];
const DS_ZERO = k => k === 'around_h' || k === 'around_m';
const dsNum = v => (v === null || v === undefined || v === '') ? null : (Number(v) || 0);
const dsAround = (h, m) => (Number(h) || 0) * 60 + (Number(m) || 0);
const dsUI = {};   // idx -> { type, part, locked }

/* ---------- styles (self-contained, sit above every other layer) ---------- */
(function () {
    if (document.getElementById('dsCss')) return;
    const s = document.createElement('style');
    s.id = 'dsCss';
    s.textContent = `
.ds-pf{min-height:28px;width:11rem;padding:4px 8px;border:1px solid #334155;border-radius:6px;background:#020617;color:#e2e8f0;font-size:12px;cursor:text;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ds-pf.empty{color:#64748b}
.ds-locked{opacity:.5;pointer-events:none}
.ds-seg{display:inline-flex;border:1px solid #475569;border-radius:999px;overflow:hidden;font-size:11px;font-weight:700}
.ds-seg button{padding:4px 10px;color:#94a3b8;background:transparent}
.ds-seg button.on{background:#f59e0b;color:#0f172a}
.ds-chips{display:flex;gap:6px;align-items:center}
.ds-chip{width:26px;height:26px;border-radius:50%;border:1px solid #475569;color:#94a3b8;font-size:12px;font-weight:700;position:relative}
.ds-chip.on{background:#f59e0b;color:#0f172a;border-color:#f59e0b}
.ds-chip.saved::after{content:'';position:absolute;top:-3px;right:-3px;width:9px;height:9px;border-radius:50%;background:#10b981;border:1px solid #0f172a}
.ds-b{padding:5px 12px;border-radius:8px;font-size:12px;font-weight:700;color:#fff;background:#475569;white-space:nowrap}
.ds-b:disabled{opacity:.35;cursor:not-allowed}
.ds-b.on{background:#d97706!important;color:#fff!important;border-color:#d97706!important}
.ds-b.green{background:#059669}.ds-b.amber{background:#d97706}.ds-b.blue{background:#2563eb}.ds-b.red{background:#be123c}.ds-b.ghost{background:transparent;border:1px solid #475569;color:#cbd5e1}
.ds-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(2,6,23,.85);display:flex;align-items:flex-start;justify-content:center;padding:8px;overflow:auto;-webkit-overflow-scrolling:touch}
.ds-box{width:min(940px,100%);background:#0f172a;border:1px solid rgba(245,158,11,.45);border-radius:14px;padding:14px;color:#e2e8f0;font-family:Cairo,Inter,sans-serif}
.ds-ta{width:100%;min-height:min(46vh,420px);background:#020617;border:1px solid #334155;border-radius:10px;color:#fff;font-size:16px;line-height:1.75;padding:12px;resize:vertical;font-family:inherit}
.ds-in{width:100%;background:#020617;border:1px solid #334155;border-radius:8px;color:#fff;font-size:16px;padding:8px 10px;font-family:inherit}
.ds-slot{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid #1e293b;border-radius:10px;background:#020617}
.ds-slot.saved{border-color:rgba(16,185,129,.45)}
.ds-no{width:26px;height:26px;border-radius:50%;background:#1e293b;color:#fbbf24;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;flex:none}
.ds-tag{font-size:10px;padding:2px 8px;border-radius:999px;background:#1e293b;color:#94a3b8}
.ds-form{border:1px solid rgba(245,158,11,.5);border-radius:10px;padding:10px;background:#0b1220;display:flex;flex-direction:column;gap:8px}
.ds-lbl{font-size:11px;color:#94a3b8;font-weight:700;margin-bottom:2px;display:block}`;
    document.head.appendChild(s);
})();

/* ---------- helpers ---------- */
function dsMinutes(s, e) {
    const p = v => { const m = /^(\d{1,2}):(\d{2})/.exec(v || ''); return m ? (+m[1]) * 60 + (+m[2]) : null; };
    const a = p(s), b = p(e);
    if (a === null || b === null) return null;
    return b >= a ? b - a : b + 1440 - a;
}
const dsT5 = v => (v ? String(v).slice(0, 5) : '');
const dsKey = (st, date) => `trainee_id=eq.${encodeURIComponent(st.id)}&supply_date=eq.${encodeURIComponent(date)}`;
const dsRec = (st, date) => supplyState.records.find(r => String(r.trainee_id) === String(st.id) && r.supply_date === date) || null;
const dsPartsOf = (st, date) => supplyState.parts.filter(p => String(p.trainee_id) === String(st.id) && p.supply_date === date);
const dsItemsOf = (st, date, kind) => supplyState.items.filter(i => String(i.trainee_id) === String(st.id) && i.supply_date === date && i.kind === kind);
const dsEl = (k, idx) => document.getElementById(`ds_${k}_${idx}`);
const dsDate = idx => (dsEl('supply_date', idx) || {}).value || '';

/* ---------- wide text popup (every text field) ---------- */
function dsRefreshPf(id) {
    const h = document.getElementById(id), pf = document.getElementById(id + '_pf');
    if (!h || !pf) return;
    const lines = String(h.value || '').split('\n').filter(l => l.trim());
    pf.textContent = lines.length ? lines[0] + (lines.length > 1 ? '  …' : '') : 'اضغط للكتابة…';
    pf.classList.toggle('empty', !lines.length);
}

window.dsTextPop = function (hiddenId, label) {
    const hid = document.getElementById(hiddenId);
    if (!hid) return;
    const ov = document.createElement('div');
    ov.className = 'ds-ov';
    ov.innerHTML = `
      <div class="ds-box">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">
          <b style="color:#fbbf24;font-size:14px">${esc(label)}</b>
          <button type="button" class="ds-b green" data-done>تم ✓</button>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
          <button type="button" class="ds-b ghost" data-cap="add">+ كبسولة</button>
          <span style="font-size:11px;color:#94a3b8">عدد الكبسولات</span>
          <select data-capn class="ds-in" style="width:auto;padding:4px 8px;font-size:13px"><option>1</option><option>2</option><option>3</option><option>4</option></select>
          <button type="button" class="ds-b ghost" data-cap="make">ابدأ</button>
          <span style="width:1px;height:20px;background:#334155;margin:0 4px"></span>
          <button type="button" class="ds-b ghost on" data-sty="num">1. أرقام</button>
          <button type="button" class="ds-b ghost" data-sty="dot">• نقط</button>
          <button type="button" class="ds-b ghost" data-sty="dash">- شرطات</button>
          <span style="width:1px;height:20px;background:#334155;margin:0 4px"></span>
          <button type="button" class="ds-b ghost" data-bar title="عمود فاصل بين الكلام في نفس السطر"><span style="display:inline-block;width:2px;height:15px;background:currentColor;opacity:.4;vertical-align:middle"></span> فاصل</button>
        </div>
        <textarea class="ds-ta" dir="auto" spellcheck="true" autocorrect="on" autocapitalize="sentences" placeholder="اكتب هنا…"></textarea>
        <div style="font-size:11px;color:#64748b;margin-top:6px;line-height:1.6">
          سطر يبدأ بـ <b>1.</b> أو <b>a.</b> = أفكار مرتبطة (بيكمّل الترقيم لوحده مع Enter) ·
          سطر يبدأ بـ <b>-</b> = نقطة مستقلة · سطر فاضي = كبسولة جديدة منفصلة · <b>|</b> = عمود فاصل بين كلام في نفس السطر
        </div>
      </div>`;
    document.body.appendChild(ov);
    const ta = ov.querySelector('textarea');
    ta.value = hid.value || '';
    setTimeout(() => { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 30);

    const close = () => {
        hid.value = ta.value.replace(/[ \t]+$/gm, '').trim();
        dsRefreshPf(hiddenId);
        document.removeEventListener('keydown', onKey, true);
        ov.remove();
    };
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    document.addEventListener('keydown', onKey, true);
    ov.addEventListener('mousedown', e => { if (e.target === ov) close(); });
    ov.addEventListener('touchstart', e => { if (e.target === ov) close(); }, { passive: true });
    ov.querySelector('[data-done]').onclick = close;

    const next = (tok) => {
        if (/^\d+$/.test(tok)) return String(+tok + 1);
        return String.fromCharCode(tok.charCodeAt(0) + 1);
    };
    const lineInfo = () => {
        const v = ta.value, pos = ta.selectionStart;
        const ls = v.lastIndexOf('\n', pos - 1) + 1;
        return { v, pos, ls, line: v.slice(ls, pos) };
    };
    ta.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
        const { pos, ls, line } = lineInfo();
        let m = line.match(/^(\s*)(\d+|[a-y])([.)])\s(.*)$/i);
        let ins = null;
        if (m) {
            if (!m[4].trim()) { e.preventDefault(); ta.setRangeText('', ls, pos, 'end'); return; }
            ins = `\n${m[1]}${next(m[2])}${m[3]} `;
        } else if ((m = line.match(/^(\s*)([-•])\s(.*)$/))) {
            if (!m[3].trim()) { e.preventDefault(); ta.setRangeText('', ls, pos, 'end'); return; }
            ins = `\n${m[1]}${m[2]} `;
        }
        if (ins) { e.preventDefault(); ta.setRangeText(ins, pos, ta.selectionEnd, 'end'); }
    });
    /* capsules = blocks separated by a blank line; style = numbers / dots / dashes; | = thin divider */
    let style = 'num';
    const mark = n => style === 'num' ? n + '. ' : style === 'dot' ? '\u2022 ' : '- ';
    const lineRange = () => { const v = ta.value, a = v.lastIndexOf('\n', ta.selectionStart - 1) + 1; let e = v.indexOf('\n', ta.selectionEnd); if (e < 0) e = v.length; return { v, a, e }; };
    const restyle = () => {
        const { v, a, e } = lineRange();
        if (!v.slice(a, e).trim()) { ta.setRangeText(mark(1), a, e, 'end'); return; }
        let n = 0;
        const out = v.slice(a, e).split('\n').map(l => { if (!l.trim()) { n = 0; return l; } n++; return mark(n) + l.replace(/^\s*(?:\d+|[a-zA-Z])[.)]\s+|^\s*[-\u2022*]\s+/, ''); }).join('\n');
        ta.setRangeText(out, a, e, 'end');
    };
    ov.querySelectorAll('[data-sty]').forEach(b => b.onclick = () => {
        style = b.dataset.sty;
        ov.querySelectorAll('[data-sty]').forEach(x => x.classList.toggle('on', x === b));
        restyle(); ta.focus();
    });
    ov.querySelector('[data-cap=add]').onclick = () => {
        const { v, e } = lineRange();
        ta.setRangeText(v.trim() ? '\n\n' + mark(1) : mark(1), e, e, 'end'); ta.focus();
    };
    ov.querySelector('[data-cap=make]').onclick = () => {
        const n = +ov.querySelector('[data-capn]').value || 1, base = ta.value.trimEnd();
        const first = (base ? base.length + 2 : 0) + mark(1).length;
        ta.value = (base ? base + '\n\n' : '') + Array.from({ length: n }, () => mark(1)).join('\n\n');
        ta.focus(); ta.setSelectionRange(first, first);
    };
    ov.querySelector('[data-bar]').onclick = () => { ta.setRangeText(' | ', ta.selectionStart, ta.selectionEnd, 'end'); ta.focus(); };
};

function dsPopCell(f, idx) {
    const id = `ds_${f.key}_${idx}`;
    return `<td class="p-2"><input type="hidden" id="${id}" value="">
        <div id="${id}_pf" class="ds-pf empty" onclick="dsTextPop('${id}','${esc(f.key)}')">اضغط للكتابة…</div></td>`;
}

function dsFieldCell(f, idx, range) {
    if (f.type === 'text') return dsPopCell(f, idx);
    let attrs = '';
    if (f.key === 'supply_date') attrs = ` min="${range.min}" max="${range.max}" onchange="onSupplyDateChange(${idx})" title="اختر يوماً من السبت للخميس هذا الأسبوع"`;
    else if (f.min !== undefined) attrs = ` min="${f.min}" max="${f.max}"`;
    return `<td class="p-2"><input type="${f.type}" id="ds_${f.key}_${idx}"${attrs} class="${INPUT_CLS} ${f.w}"></td>`;
}

/* ---------- row state: load / lock / paint ---------- */
function dsSetField(f, idx, v) {
    const el = dsEl(f.key, idx);
    if (!el) return;
    el.value = (v === null || v === undefined) ? '' : v;
    if (f.type === 'text') dsRefreshPf(el.id);
}

function dsLoadRow(idx, date) {
    const st = supplyState.students[idx];
    const rec = dsRec(st, date) || {};
    const parts = dsPartsOf(st, date).sort((a, b) => a.part_no - b.part_no);
    const type = rec.session_type === 'separated' ? 'separated' : 'mono';
    const ui = dsUI[idx] = { type, part: parts.length ? parts[parts.length - 1].part_no : 1, locked: !!rec.trainee_id };
    SUPPLY_FIELDS.forEach(f => {
        if (f.key === 'supply_date' || f.key === 'tasks' || !dsEl(f.key, idx)) return;
        let v = rec[f.key];
        if (f.key === 'group_name') v = v || st.group || '';
        if (type === 'separated' && DS_PART_KEYS.includes(f.key)) {
            const p = parts.find(x => x.part_no === ui.part);
            v = p ? p[f.key] : '';
        }
        if (DS_ZERO(f.key) && (v === null || v === undefined || v === '')) v = 0;
        dsSetField(f, idx, v);
    });
    dsPaint(idx);
}

function dsPaint(idx) {
    const st = supplyState.students[idx], ui = dsUI[idx], date = dsDate(idx);
    const rec = dsRec(st, date), saved = dsPartsOf(st, date).map(p => p.part_no);

    const seg = document.getElementById(`ds_type_${idx}`);
    if (seg) seg.innerHTML = `<div class="ds-seg ${ui.locked ? 'ds-locked' : ''}">
        <button type="button" class="${ui.type === 'mono' ? 'on' : ''}" onclick="dsSetType(${idx},'mono')">Mono</button>
        <button type="button" class="${ui.type === 'separated' ? 'on' : ''}" onclick="dsSetType(${idx},'separated')">Separated</button></div>`;

    const pc = document.getElementById(`ds_parts_${idx}`);
    if (pc) pc.innerHTML = ui.type === 'separated'
        ? `<div class="ds-chips">${[1, 2, 3, 4].map(n => `<button type="button" class="ds-chip ${ui.part === n ? 'on' : ''} ${saved.includes(n) ? 'saved' : ''}" onclick="dsPickPart(${idx},${n})">${n}</button>`).join('')}</div>`
        : '<span class="text-slate-600">—</span>';

    SUPPLY_FIELDS.forEach(f => {
        if (f.key === 'tasks') return;
        const el = dsEl(f.key, idx);
        if (!el) return;
        if (f.type === 'text') document.getElementById(el.id + '_pf').classList.toggle('ds-locked', ui.locked);
        else el.disabled = ui.locked;
    });
    const row = document.getElementById(`ds_row_${idx}`);
    if (row) {
        row.querySelector('[data-act=save]').disabled = ui.locked;
        row.querySelector('[data-act=edit]').disabled = !ui.locked;
        const ar = row.querySelector('[data-act=archive]');
        ar.disabled = !(rec && ui.locked && !rec.archived_at);
        ar.textContent = rec && rec.archived_at ? 'مؤرشف ✓' : 'Archive';
    }
    ['task', 'dandana'].forEach(k => {
        const b = document.getElementById(`ds_${k}_btn_${idx}`);
        if (b) b.textContent = `${k === 'task' ? 'Tasks' : 'دندنة'} (${dsItemsOf(st, date, k).length})`;
    });
}

function dsStash(idx) {   // keep what's typed for the visible part
    const ui = dsUI[idx];
    if (ui.type !== 'separated') return null;
    const o = {};
    DS_PART_KEYS.forEach(k => { const el = dsEl(k, idx); o[k] = el ? el.value.trim() || null : null; });
    return o;
}

window.dsSetType = function (idx, type) {
    const ui = dsUI[idx];
    if (ui.locked) { showToast('اضغط Edit الأول عشان تغيّر النوع', true, true); return; }
    if (ui.type === type) return;
    ui.type = type;
    if (type === 'separated') ui.part = 1;
    dsPaint(idx);
};

window.dsPickPart = function (idx, n) {
    const st = supplyState.students[idx], ui = dsUI[idx], date = dsDate(idx);
    const savedNos = dsPartsOf(st, date).map(p => p.part_no);
    const isSaved = savedNos.includes(n);
    if (ui.locked && !isSaved) { ui.locked = false; }          // new part: unlock to start it
    ui.part = n;
    const p = dsPartsOf(st, date).find(x => x.part_no === n) || {};
    DS_PART_KEYS.forEach(k => {
        const f = SUPPLY_FIELDS.find(x => x.key === k);
        dsSetField(f, idx, isSaved && p[k] != null ? p[k] : (DS_ZERO(k) ? 0 : ''));
    });
    dsPaint(idx);
};

window.onSupplyDateChange = function (idx) { dsLoadRow(idx, dsDate(idx)); };

function dsReadFields(idx) {
    const body = {};
    SUPPLY_FIELDS.forEach(f => {
        const el = dsEl(f.key, idx);
        if (!el || f.key === 'tasks') return;
        const v = el.value.trim();
        if (v === '') body[f.key] = null;
        else if (f.type === 'number') body[f.key] = Number.isNaN(Number(v)) ? null : Number(v);
        else body[f.key] = v;
    });
    return body;
}

/* ---------- render ---------- */
async function renderDailySupply(backBtnHtml) {
    const subContainer = document.getElementById('adminDynamicSubContainer');
    subContainer.innerHTML = `${backBtnHtml}<div class="text-center py-6 text-amber-400">جاري تحميل الطلاب وسجلات الأسبوع...</div>`;

    const range = getCurrentWeekRange();
    let students, records, parts = [], items = [];
    try {
        students = await fetchStudentsFromSupabase();
        records = await fetchDailySupplyForWeek(range);
    } catch (e) {
        subContainer.innerHTML = `${backBtnHtml}<div class="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm">تعذر تحميل البيانات: ${esc(e.message)}</div>`;
        return;
    }
    try {
        const q = `select=*&supply_date=gte.${range.min}&supply_date=lte.${range.max}`;
        parts = await (await sbFetch(`daily_supply_parts?${q}`)).json();
        items = await (await sbFetch(`supply_items?${q}`)).json();
    } catch (e) {
        showToast('شغّل 01_schema.sql في Supabase الأول (الأجزاء والتاسكس مش جاهزين): ' + e.message, true, true);
    }
    if (!students.length) {
        subContainer.innerHTML = `${backBtnHtml}<div class="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-sm">مفيش طلاب راجعين من جدول ${esc(PROFILES_TABLE)}. لو فيه طلاب فعلاً في الجدول يبقى الصلاحيات أو الـ RLS مانعة القراءة.</div>`;
        return;
    }
    supplyState = { students, records, range, parts: Array.isArray(parts) ? parts : [], items: Array.isArray(items) ? items : [] };

    const today = localDateStr(new Date());
    const defaultDate = (today >= range.min && today <= range.max) ? today : range.min;

    // column layout: type toggle before session_title, parts right after it, tasks/dandana replace the old tasks box
    const cols = [];
    SUPPLY_FIELDS.forEach(f => {
        if (f.key === 'tasks') {
            cols.push({ head: 'tasks', cell: i => `<td class="p-2"><button type="button" id="ds_task_btn_${i}" class="ds-b blue" onclick="dsOpenItems(${i},'task')">Tasks</button></td>` });
            cols.push({ head: 'دندنة', cell: i => `<td class="p-2"><button type="button" id="ds_dandana_btn_${i}" class="ds-b blue" onclick="dsOpenItems(${i},'dandana')">دندنة</button></td>` });
            return;
        }
        if (f.key === 'session_title') cols.push({ head: 'session_type', cell: i => `<td class="p-2" id="ds_type_${i}"></td>` });
        cols.push({ head: f.key + (f.key === 'supply_date' ? ' (السبت-الخميس)' : ''), cell: i => dsFieldCell(f, i, range) });
        if (f.key === 'session_title') cols.push({ head: 'parts', cell: i => `<td class="p-2" id="ds_parts_${i}"></td>` });
    });

    let tableRows = '';
    students.forEach((st, idx) => {
        tableRows += `
            <tr id="ds_row_${idx}" class="border-b border-slate-800 hover:bg-slate-950/50 transition">
                <td class="p-2 font-bold text-amber-300 sticky left-0 bg-slate-900">${esc(st.trainee || st.name || 'طالب')}</td>
                ${cols.map(c => c.cell(idx)).join('')}
                <td class="p-2"><div style="display:flex;gap:6px">
                    <button type="button" data-act="save" class="ds-b green" onclick="dsSave(${idx}, this)">Save</button>
                    <button type="button" data-act="edit" class="ds-b amber" onclick="dsEdit(${idx})">Edit</button>
                    <button type="button" data-act="archive" class="ds-b blue" onclick="dsArchive(${idx}, this)">Archive</button></div></td>
            </tr>`;
    });

    subContainer.innerHTML = `${backBtnHtml}
        <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center flex-wrap gap-2">
                <h4 class="text-amber-400 font-bold text-base"><i class="fa-solid fa-calendar-days"></i> إدارة جدول DailySupply (الأسبوع الحالي: من السبت للخميس)</h4>
                <span class="text-xs text-slate-400">💡 Save بيحفظ بس · Edit بيرجّع التعديل · Archive يدوي، وأي يوم عدّى بيتأرشف لوحده 12 بالليل بتوقيت القاهرة.</span>
            </div>
            <div class="overflow-x-auto border border-slate-700 rounded-xl max-h-[70vh]">
                <table class="w-full text-left text-xs text-slate-300">
                    <thead class="bg-slate-950 text-amber-300 uppercase text-[10px] sticky top-0">
                        <tr><th class="p-2 sticky left-0 bg-slate-950">trainee name</th>
                            ${cols.map(c => `<th class="p-2">${esc(c.head)}</th>`).join('')}
                            <th class="p-2">إجراء</th></tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        </div>`;
    students.forEach((st, idx) => {
        dsEl('supply_date', idx).value = defaultDate;
        dsLoadRow(idx, defaultDate);
    });
}

/* ---------- Save / Edit / Archive ---------- */
window.dsSave = async function (idx, btn) {
    const st = supplyState.students[idx], ui = dsUI[idx];
    if (!st) { showToast('حصلت مشكلة في تحديد الطالب، افتح الصفحة تاني', true); return; }
    const name = st.trainee || st.name || 'طالب';
    if (st.id === undefined || st.id === null || st.id === '') { showToast('الطالب ده مالوش id في جدول ' + PROFILES_TABLE, true); return; }
    const base = dsReadFields(idx);
    const date = base.supply_date;
    if (!date) { showToast('اختار التاريخ الأول', true); return; }

    const body = Object.assign({ trainee_id: st.id }, base, { session_type: ui.type, archived_at: null });
    let partBody = null, merged = null;
    if (ui.type === 'separated') {
        const cur = dsStash(idx);
        if (!cur.start_time && !cur.end_time && !cur.notes && !(dsAround(cur.around_h, cur.around_m) > 0)) { showToast(`الجزء ${ui.part} فاضي، اكتب وقت أو ملاحظات الأول`, true); return; }
        partBody = { trainee_id: st.id, supply_date: date, part_no: ui.part, start_time: cur.start_time, end_time: cur.end_time, around_h: dsNum(cur.around_h), around_m: dsNum(cur.around_m), notes: cur.notes, updated_at: new Date().toISOString() };
        merged = {};
        dsPartsOf(st, date).forEach(p => { merged[p.part_no] = p; });
        merged[ui.part] = partBody;
        const nos = Object.keys(merged).map(Number).sort((a, b) => a - b);
        const starts = nos.map(n => dsT5(merged[n].start_time)).filter(Boolean).sort();
        const ends = nos.map(n => dsT5(merged[n].end_time)).filter(Boolean).sort();
        body.start_time = starts[0] || null;
        body.end_time = ends.length ? ends[ends.length - 1] : null;
        body.around_h = null; body.around_m = null;      // around lives on each part
        body.total_minutes = nos.reduce((s, n) => s + (dsAround(merged[n].around_h, merged[n].around_m) || dsMinutes(merged[n].start_time, merged[n].end_time) || 0), 0) || null;
        body.parts_count = nos.length;
        const nt = nos.filter(n => (merged[n].notes || '').trim()).map(n => `الجزء ${n}:\n${merged[n].notes.trim()}`);
        body.notes = nt.length ? nt.join('\n\n') : null;
    } else {
        body.total_minutes = dsAround(base.around_h, base.around_m) || dsMinutes(base.start_time, base.end_time);
        body.parts_count = 1;
    }

    if (btn) btn.disabled = true;
    let saved;
    try {
        saved = await upsertByKey(DAILY_SUPPLY_TABLE, dsKey(st, date), body);
        if (partBody) {
            const pr = await upsertByKey('daily_supply_parts', `${dsKey(st, date)}&part_no=eq.${ui.part}`, partBody);
            supplyState.parts = supplyState.parts.filter(p => !(String(p.trainee_id) === String(st.id) && p.supply_date === date && p.part_no === ui.part));
            supplyState.parts.push(pr || partBody);
        } else if (dsPartsOf(st, date).length) {
            await sbFetch(`daily_supply_parts?${dsKey(st, date)}`, { method: 'DELETE' });
            supplyState.parts = supplyState.parts.filter(p => !(String(p.trainee_id) === String(st.id) && p.supply_date === date));
        }
    } catch (e) {
        showToast('فشل الحفظ: ' + e.message, true);
        if (btn) btn.disabled = false;
        return;
    }
    supplyState.records = supplyState.records.filter(r => !(String(r.trainee_id) === String(st.id) && r.supply_date === date));
    supplyState.records.push(saved || body);
    ui.locked = true;
    dsPaint(idx);
    showToast(ui.type === 'separated' ? `اتحفظ الجزء ${ui.part} (${name}) ✓` : `اتحفظ سجل (${name}) ✓`);
};

window.dsEdit = function (idx) {
    const st = supplyState.students[idx], ui = dsUI[idx], date = dsDate(idx);
    if (ui.type !== 'separated') { ui.locked = false; dsPaint(idx); return; }
    const saved = dsPartsOf(st, date).sort((a, b) => a.part_no - b.part_no);
    if (!saved.length) { ui.locked = false; dsPaint(idx); return; }
    const ov = document.createElement('div');
    ov.className = 'ds-ov';
    ov.innerHTML = `<div class="ds-box" style="max-width:420px;margin-top:12vh">
        <b style="color:#fbbf24;display:block;margin-bottom:10px">عايز تعدّل أنهي جزء؟</b>
        <div style="display:flex;flex-direction:column;gap:8px">
        ${saved.map(p => `<button type="button" class="ds-b amber" style="padding:10px" data-p="${p.part_no}">الجزء ${p.part_no}${p.start_time || p.end_time ? ` · ${dsT5(p.start_time)}–${dsT5(p.end_time)}` : ''}</button>`).join('')}
        <button type="button" class="ds-b ghost" data-p="0">إلغاء</button></div></div>`;
    document.body.appendChild(ov);
    ov.addEventListener('mousedown', e => { if (e.target === ov) ov.remove(); });
    ov.querySelectorAll('[data-p]').forEach(b => b.onclick = () => {
        const n = +b.dataset.p;
        ov.remove();
        if (!n) return;
        ui.locked = false;
        dsPickPart(idx, n);
    });
};

window.dsArchive = async function (idx, btn) {
    const st = supplyState.students[idx], ui = dsUI[idx], date = dsDate(idx), rec = dsRec(st, date);
    if (!rec || !ui.locked) { showToast('احفظ الأول، وبعدها اعمل Archive', true, true); return; }
    if (btn) btn.disabled = true;
    try {
        const res = await sbFetch('rpc/archive_supply_row', { method: 'POST', body: JSON.stringify({ p_trainee_id: String(st.id), p_date: date }) });
        if ((await res.json()) !== true) throw new Error('السجل مش موجود');
        rec.archived_at = new Date().toISOString();
        showToast(`اتأرشف (${st.trainee || st.name || 'طالب'}) ✓`);
    } catch (e) {
        showToast('فشلت الأرشفة: ' + e.message + ' (شغّل 01_schema.sql لو لسه)', true);
    }
    dsPaint(idx);
};

/* ---------- Tasks & دندنة editor (10 numbered slots) ---------- */
const DS_ITEM_CFG = {
    task: {
        title: 'Tasks', repLabel: 'عدد مرات المراجعة (1–5)',
        fields: [
            { k: 'title', l: 'اسم التاسك', ph: 'مثال: Mix and Match', rows: 1, dir: 'auto' },
            { k: 'badge', l: 'معلومة إضافية (بتظهر كوسم صغير)', ph: 'مثال: تمرين / عدد التكرار', rows: 1, dir: 'auto' },
            { k: 'body', l: 'الوصف (Description)', ph: '', rows: 6, dir: 'auto' }]
    },
    dandana: {
        title: 'دندنة', repLabel: 'عدد مرات المراجعة (1–5)',
        fields: [
            { k: 'title', l: 'Description (English)', ph: '', rows: 2, dir: 'ltr' },
            { k: 'badge', l: 'Arabic', ph: '', rows: 2, dir: 'rtl' },
            { k: 'body', l: 'Notes / ملاحظات', ph: '', rows: 4, dir: 'auto' }]
    }
};
let dsItemCtx = null;

window.dsOpenItems = function (idx, kind) {
    const date = dsDate(idx);
    if (!date) { showToast('اختار التاريخ الأول', true); return; }
    dsItemCtx = { idx, kind, date, open: null, ov: document.createElement('div') };
    dsItemCtx.ov.className = 'ds-ov';
    dsItemCtx.ov.addEventListener('mousedown', e => { if (e.target === dsItemCtx.ov) dsCloseItems(); });
    document.body.appendChild(dsItemCtx.ov);
    dsItemsRender();
};

window.dsCloseItems = function () {
    if (!dsItemCtx) return;
    dsItemCtx.ov.remove();
    const idx = dsItemCtx.idx;
    dsItemCtx = null;
    dsPaint(idx);
};

function dsItemsRender() {
    const c = dsItemCtx, cfg = DS_ITEM_CFG[c.kind], st = supplyState.students[c.idx];
    const have = dsItemsOf(st, c.date, c.kind);
    const slots = [];
    for (let n = 1; n <= 10; n++) {
        const it = have.find(x => x.item_no === n);
        if (c.open === n) {
            slots.push(`<div class="ds-form">
                <div style="display:flex;align-items:center;gap:8px"><span class="ds-no">${n}</span><b style="color:#fbbf24;font-size:13px">${esc(cfg.title)} ${n}</b></div>
                ${cfg.fields.map(f => `<div><span class="ds-lbl">${esc(f.l)}</span>
                    ${f.rows > 1 ? `<textarea id="dsi_${f.k}" rows="${f.rows}" dir="${f.dir}" spellcheck="true" class="ds-in" placeholder="${esc(f.ph)}"></textarea>`
                                 : `<input id="dsi_${f.k}" dir="${f.dir}" spellcheck="true" class="ds-in" placeholder="${esc(f.ph)}">`}</div>`).join('')}
                <div><span class="ds-lbl">${esc(cfg.repLabel)}</span>
                    <select id="dsi_rep" class="ds-in" style="width:auto">${[1, 2, 3, 4, 5].map(r => `<option value="${r}">${r}</option>`).join('')}</select></div>
                ${c.kind === 'task' ? `<div><span class="ds-lbl">Priority</span><select id="dsi_pri" class="ds-in" style="width:auto"><option value="normal">Normal</option><option value="high">High priority (Urgent)</option></select></div>` : ''}
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <button type="button" class="ds-b green" onclick="dsItemSave(${n})">Save</button>
                    <button type="button" class="ds-b ghost" onclick="dsItemOpen(null)">إلغاء</button>
                    ${it ? `<button type="button" class="ds-b red" onclick="dsItemDelete(${n})">حذف</button>` : ''}</div></div>`);
        } else if (it) {
            slots.push(`<div class="ds-slot saved"><span class="ds-no">${n}</span>
                <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" dir="auto">${esc(it.title || (it.body || '').split('\n')[0] || '—')}</div>
                ${it.badge ? `<div style="font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" dir="auto">${esc(String(it.badge).split('\n')[0])}</div>` : ''}</div>
                ${it.priority === 'high' ? '<span class="ds-tag" style="background:#be123c;color:#fff">HIGH</span>' : ''}<span class="ds-tag">×${it.repeats}</span><span class="ds-tag" style="color:#34d399">Done</span>
                <button type="button" class="ds-b amber" onclick="dsItemOpen(${n})">تعديل</button></div>`);
        } else {
            slots.push(`<button type="button" class="ds-slot" style="color:#64748b;width:100%;text-align:start" onclick="dsItemOpen(${n})"><span class="ds-no" style="color:#64748b">${n}</span> + فاضي</button>`);
        }
    }
    c.ov.innerHTML = `<div class="ds-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <b style="color:#fbbf24;font-size:15px">${esc(cfg.title)} · ${esc(st.trainee || st.name || '')} · ${esc(c.date)}</b>
            <button type="button" class="ds-b ghost" onclick="dsCloseItems()">إغلاق</button></div>
        <div style="display:flex;flex-direction:column;gap:8px">${slots.join('')}</div></div>`;
    if (c.open) {
        const it = have.find(x => x.item_no === c.open) || {};
        cfg.fields.forEach(f => { document.getElementById('dsi_' + f.k).value = it[f.k] || ''; });
        document.getElementById('dsi_rep').value = it.repeats || 1;
        const pri = document.getElementById('dsi_pri'); if (pri) pri.value = it.priority || 'normal';
        const first = document.getElementById('dsi_' + cfg.fields[0].k);
        if (first) setTimeout(() => first.focus(), 30);
    }
}

window.dsItemOpen = function (n) { dsItemCtx.open = n; dsItemsRender(); };

window.dsItemSave = async function (n) {
    const c = dsItemCtx, cfg = DS_ITEM_CFG[c.kind], st = supplyState.students[c.idx];
    const body = { trainee_id: st.id, supply_date: c.date, kind: c.kind, item_no: n, updated_at: new Date().toISOString() };
    cfg.fields.forEach(f => { body[f.k] = document.getElementById('dsi_' + f.k).value.trim() || null; });
    body.repeats = Math.min(5, Math.max(1, +document.getElementById('dsi_rep').value || 1));
    const pri = document.getElementById('dsi_pri'); if (pri) body.priority = pri.value;
    if (!body.title && !body.body) { showToast('اكتب الاسم أو الوصف الأول', true, true); return; }
    try {
        const row = await upsertByKey('supply_items', `${dsKey(st, c.date)}&kind=eq.${c.kind}&item_no=eq.${n}`, body);
        supplyState.items = supplyState.items.filter(i => !(String(i.trainee_id) === String(st.id) && i.supply_date === c.date && i.kind === c.kind && i.item_no === n));
        supplyState.items.push(row || body);
        c.open = null;
        dsItemsRender();
        showToast(`اتحفظ ${cfg.title} ${n} ✓`);
    } catch (e) { showToast('فشل الحفظ: ' + e.message, true); }
};

window.dsItemDelete = async function (n) {
    const c = dsItemCtx, st = supplyState.students[c.idx];
    if (!confirm('تحذف العنصر ده؟ (بيتمسح معاه سجل تشيكات الطالب)')) return;
    try {
        await sbFetch(`supply_items?${dsKey(st, c.date)}&kind=eq.${c.kind}&item_no=eq.${n}`, { method: 'DELETE' });
        supplyState.items = supplyState.items.filter(i => !(String(i.trainee_id) === String(st.id) && i.supply_date === c.date && i.kind === c.kind && i.item_no === n));
        c.open = null;
        dsItemsRender();
    } catch (e) { showToast('فشل الحذف: ' + e.message, true); }
};

/* ==========================================================
   Archive
   ========================================================== */

function pickArchiveCols(rows) {
    const keys = rows.length ? Object.keys(rows[0]) : [];
    const first = ['name', 'supply_date'].concat(SUPPLY_FIELDS.map(f => f.key).filter(k => k !== 'supply_date'));
    const cols = first.filter(k => keys.includes(k));
    keys.forEach(k => {
        if (!cols.includes(k) && k !== 'id' && k !== 'trainee_id') cols.push(k);
    });
    return cols;
}

async function renderArchive(backBtnHtml) {
    const subContainer = document.getElementById('adminDynamicSubContainer');
    subContainer.innerHTML = `${backBtnHtml}<div class="text-center py-6 text-amber-400">جاري تحميل الأرشيف...</div>`;

    let students = [];
    try { students = await fetchStudentsFromSupabase(); } catch (e) { /* الفلتر شغال حتى من غير قائمة الطلاب */ }
    const opts = students.map(st => `<option value="${esc(st.id)}">${esc(st.trainee || st.name || '')}</option>`).join('');

    const lab = 'text-xs flex flex-col gap-1';
    subContainer.innerHTML = `${backBtnHtml}
        <div class="flex flex-col gap-3">
            <h4 class="text-amber-400 font-bold text-base"><i class="fa-solid fa-box-archive"></i> أرشيف DailySupply</h4>
            <div class="tha-btns">
                <button type="button" class="tha-b blue" onclick="archiveQuick('today')">اليوم</button>
                <button type="button" class="tha-b blue" onclick="archiveQuick('week')">هذا الأسبوع</button>
                <button type="button" class="tha-b blue" onclick="archiveQuick('month')">هذا الشهر</button>
                <button type="button" class="tha-b blue" onclick="archiveQuick('year')">هذه السنة</button>
                <button type="button" class="tha-b blue" onclick="archiveQuick('all')">الكل</button>
            </div>
            <div class="flex flex-wrap gap-3 items-end">
                <label class="${lab}">من <input type="date" id="arcFrom" class="${INPUT_CLS}"></label>
                <label class="${lab}">إلى <input type="date" id="arcTo" class="${INPUT_CLS}"></label>
                <label class="${lab}">شهر معين <input type="month" id="arcMonth" onchange="archiveMonthPicked(this.value)" class="${INPUT_CLS}"></label>
                <label class="${lab}">الطالب
                    <select id="arcStudent" class="${INPUT_CLS}"><option value="">الكل</option>${opts}</select>
                </label>
                <button type="button" class="tha-b" onclick="loadArchive()"><i class="fa-solid fa-magnifying-glass"></i> عرض</button>
                <button type="button" class="tha-b gray" onclick="exportArchiveCsv()"><i class="fa-solid fa-file-csv"></i> تصدير CSV</button>
            </div>
            <div id="arcInfo" class="tha-note"></div>
            <div id="arcResult" class="overflow-x-auto border border-slate-700 rounded-xl max-h-[60vh]"></div>
        </div>`;
    archiveQuick('week');
}

window.archiveQuick = function (kind) {
    const now = new Date();
    let from = '', to = '';
    if (kind === 'today') { from = to = localDateStr(now); }
    else if (kind === 'week') { const r = getCurrentWeekRange(); from = r.min; to = r.max; }
    else if (kind === 'month') {
        from = localDateStr(new Date(now.getFullYear(), now.getMonth(), 1));
        to = localDateStr(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    }
    else if (kind === 'year') { from = `${now.getFullYear()}-01-01`; to = `${now.getFullYear()}-12-31`; }
    document.getElementById('arcFrom').value = from;
    document.getElementById('arcTo').value = to;
    document.getElementById('arcMonth').value = '';
    loadArchive();
};

window.archiveMonthPicked = function (v) {
    if (!v) return;
    const [y, m] = v.split('-').map(Number);
    document.getElementById('arcFrom').value = localDateStr(new Date(y, m - 1, 1));
    document.getElementById('arcTo').value = localDateStr(new Date(y, m, 0));
    loadArchive();
};

window.loadArchive = async function () {
    const from = document.getElementById('arcFrom').value;
    const to = document.getElementById('arcTo').value;
    const stu = document.getElementById('arcStudent').value;
    const info = document.getElementById('arcInfo');
    const result = document.getElementById('arcResult');

    let q = `${ARCHIVE_TABLE}?select=*&order=supply_date.desc,trainee_id.asc`;
    if (from) q += `&supply_date=gte.${encodeURIComponent(from)}`;
    if (to) q += `&supply_date=lte.${encodeURIComponent(to)}`;
    if (stu) q += `&trainee_id=eq.${encodeURIComponent(stu)}`;

    info.textContent = 'جاري التحميل...';
    result.innerHTML = '';
    try {
        const rows = await fetchAllRows(q);
        const cols = pickArchiveCols(rows);
        archiveState = { rows, cols, from, to };

        if (!rows.length) {
            info.textContent = 'مفيش سجلات في الفترة دي.';
            return;
        }
        const LIMIT = 500;
        const shown = rows.slice(0, LIMIT);
        info.textContent = `${rows.length} سجل` + (rows.length > LIMIT ? ` (معروض أول ${LIMIT}، والتصدير بيشمل الكل)` : '');

        const head = cols.map(c => `<th class="p-2">${esc(c)}</th>`).join('');
        const body = shown.map(r =>
            `<tr class="border-b border-slate-800">${cols.map(c => `<td class="p-2 whitespace-nowrap">${esc(r[c])}</td>`).join('')}</tr>`
        ).join('');
        result.innerHTML = `<table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950 text-amber-300 text-[10px] sticky top-0"><tr>${head}</tr></thead>
            <tbody>${body}</tbody></table>`;
    } catch (e) {
        info.textContent = '';
        result.innerHTML = `<div class="p-4 text-rose-300 text-sm">تعذر تحميل الأرشيف: ${esc(e.message)}</div>`;
    }
};

function csvCell(v) {
    let s = (v === null || v === undefined) ? '' : String(v);
    if (/^[=+@]|^-(?!\d)/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
}

window.exportArchiveCsv = function () {
    const { rows, cols, from, to } = archiveState;
    if (!rows.length) { showToast('مفيش بيانات للتصدير، اضغط عرض الأول', true); return; }
    const lines = [cols.join(',')].concat(rows.map(r => cols.map(c => csvCell(r[c])).join(',')));
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `archive_${from || 'all'}_${to || 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

/* ==========================================================
   Dashboard sub views
   ========================================================== */

async function openDashboardSubView(actionType) {
    const dashboardMainEl = document.getElementById('adminViewDashboardMain');
    const subContainer = document.getElementById('adminDynamicSubContainer');
    const panelBox = document.getElementById('adminPanel');

    if (dashboardMainEl) dashboardMainEl.style.display = 'none';
    if (subContainer) subContainer.style.display = 'block';
    if (panelBox) panelBox.style.maxWidth = '96vw';

    const backBtnHtml = `<div class="tha-btns" style="margin-bottom:12px"><button type="button" class="tha-b gray" onclick="showAdminView('dashboardMain')"><i class="fa-solid fa-arrow-left"></i> رجوع</button></div>`;

    if (actionType === 'dailySupply') return renderDailySupply(backBtnHtml);
    if (actionType === 'masterProfiles') return renderMasterProfiles(backBtnHtml);
    if (actionType === 'archive') return renderArchive(backBtnHtml);

    subContainer.innerHTML = `${backBtnHtml}<div class="tha-note text-center py-6">الصفحة دي لسه مش متوصلة بكود (${esc(actionType)}).</div>`;
}


/* ==========================================================
   Trainee Master Profile  +  per-trainee Daily Supply popup (|DS)
   ========================================================== */
(function () {
    if (document.getElementById('mpCss')) return;
    const s = document.createElement('style');
    s.id = 'mpCss';
    s.textContent = `
.mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:10px}
.mp-card{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid #1e293b;border-radius:14px;background:#0b1220}
.mp-av{width:46px;height:46px;border-radius:50%;background:#1e293b;color:#fbbf24;font-weight:800;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.mp-av img{width:100%;height:100%;object-fit:cover}
.mp-nm{flex:1;min-width:0}.mp-nm b{display:block;font-size:13px;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-nm small{display:block;font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-late{color:#fb7185!important;font-weight:700}
.ds-cur{display:inline-flex;align-items:center;gap:2px;padding:5px 10px;border-radius:8px;border:1px solid #475569;background:#020617;color:#fbbf24;font:700 12px/1 ui-monospace,Menlo,Consolas,monospace;cursor:pointer}
.ds-cur:hover{border-color:#fbbf24}
.ds-caret{display:inline-block;width:2px;height:14px;background:#fbbf24;animation:dsBlink 1s steps(1) infinite}
@keyframes dsBlink{50%{opacity:0}}
.mp-sec{margin-top:14px}.mp-sec>h5{font-size:12px;color:#fbbf24;font-weight:800;margin-bottom:8px;letter-spacing:.5px}
.mp-fields{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.mp-fields .ds-pf{width:100%;box-sizing:border-box}
.mp-fields input[type=date]{width:100%;background:#020617;border:1px solid #334155;border-radius:6px;color:#fff;padding:5px 8px;font-size:13px}`;
    document.head.appendChild(s);
})();

const dsToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
const dsAddDays = (str, n) => new Date(Date.parse(str + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);
const dsDayLabel = (date, i) => {
    let wd = '';
    try { wd = new Date(date + 'T12:00:00Z').toLocaleDateString('ar-EG', { weekday: 'long', timeZone: 'UTC' }); } catch (e) {}
    const tag = i === 0 ? 'اليوم' : i === 1 ? 'امبارح' : wd;
    return `<div>${esc(tag)}</div><div style="font-size:10px;color:#94a3b8;font-weight:600">${esc(date)}</div>`;
};

/* ---------- shared column / row builders ---------- */
function dsCols(range, fixedDate) {
    const cols = [];
    SUPPLY_FIELDS.forEach(f => {
        if (f.key === 'tasks') {
            cols.push({ head: 'tasks', cell: i => `<td class="p-2"><button type="button" id="ds_task_btn_${i}" class="ds-b blue" onclick="dsOpenItems(${i},'task')">Tasks</button></td>` });
            cols.push({ head: 'دندنة', cell: i => `<td class="p-2"><button type="button" id="ds_dandana_btn_${i}" class="ds-b blue" onclick="dsOpenItems(${i},'dandana')">دندنة</button></td>` });
            return;
        }
        if (f.key === 'session_title') cols.push({ head: 'session_type', cell: i => `<td class="p-2" id="ds_type_${i}"></td>` });
        if (f.key === 'supply_date' && fixedDate) cols.push({ head: 'supply_date', cell: i => `<td class="p-2"><input type="date" id="ds_supply_date_${i}" readonly tabindex="-1" class="${INPUT_CLS} w-36" style="pointer-events:none;opacity:.7"></td>` });
        else cols.push({ head: f.key, cell: i => dsFieldCell(f, i, range) });
        if (f.key === 'session_title') cols.push({ head: 'parts', cell: i => `<td class="p-2" id="ds_parts_${i}"></td>` });
    });
    return cols;
}
function dsRowHtml(idx, labelHtml, cols) {
    return `<tr id="ds_row_${idx}" class="border-b border-slate-800 hover:bg-slate-950/50 transition">
        <td class="p-2 font-bold text-amber-300 sticky left-0 bg-slate-900" style="min-width:84px">${labelHtml}</td>
        ${cols.map(c => c.cell(idx)).join('')}
        <td class="p-2"><div style="display:flex;gap:6px">
            <button type="button" data-act="save" class="ds-b green" onclick="dsSave(${idx}, this)">Save</button>
            <button type="button" data-act="edit" class="ds-b amber" onclick="dsEdit(${idx})">Edit</button>
            <button type="button" data-act="archive" class="ds-b blue" onclick="dsArchive(${idx}, this)">Archive</button></div></td></tr>`;
}
async function dsFetchRange(id, from, to) {
    const q = `trainee_id=eq.${encodeURIComponent(id)}&supply_date=gte.${from}&supply_date=lte.${to}`;
    const get = async t => { const j = await (await sbFetch(`${t}?select=*&${q}`)).json(); return Array.isArray(j) ? j : []; };
    const [records, parts, items] = await Promise.all([get(DAILY_SUPPLY_TABLE), get('daily_supply_parts').catch(() => []), get('supply_items').catch(() => [])]);
    return { records, parts, items };
}

/* ---------- |DS : Daily Supply popup for ONE trainee ---------- */
let dsStu = null;
window.closeStudentSupply = function () { if (dsStu) { dsStu.ov.remove(); document.removeEventListener('keydown', dsStu.onKey, true); dsStu = null; } };

window.openStudentSupply = async function (id) {
    closeStudentSupply();
    const st = (mpState.list.find(x => String(x.id) === String(id))) || { id, trainee: '' };
    const today = dsToday(), dates = [0, 1, 2, 3].map(n => dsAddDays(today, -n));
    const ov = document.createElement('div');
    ov.className = 'ds-ov';
    ov.innerHTML = `<div class="ds-box" style="width:min(1500px,99vw)"><div class="text-center py-6 text-amber-400">جاري التحميل...</div></div>`;
    document.body.appendChild(ov);
    const onKey = e => { if (e.key === 'Escape' && !document.querySelector('.ds-ov ~ .ds-ov')) closeStudentSupply(); };
    document.addEventListener('keydown', onKey, true);
    dsStu = { ov, st, onKey, shown: dates.length, more: false };

    let data;
    try { data = await dsFetchRange(id, dates[dates.length - 1], today); }
    catch (e) { ov.firstElementChild.innerHTML = `<div class="p-4 text-rose-300 text-sm">تعذر التحميل: ${esc(e.message)}</div>`; return; }

    const range = { min: dsAddDays(today, -31), max: today };
    supplyState = { students: dates.map(() => st), records: data.records, range, parts: data.parts, items: data.items };
    dsStu.cols = dsCols(range, true);
    dsStu.today = today;
    ov.firstElementChild.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
            <b style="color:#fbbf24;font-size:15px;display:flex;align-items:center;gap:8px"><span class="ds-cur" style="pointer-events:none"><i class="ds-caret"></i>DS</span> ${esc(st.trainee || '')}</b>
            <button type="button" class="ds-b ghost" onclick="closeStudentSupply()">إغلاق</button></div>
        <div class="overflow-x-auto border border-slate-700 rounded-xl" style="max-height:74vh">
            <table class="w-full text-left text-xs text-slate-300">
                <thead class="bg-slate-950 text-amber-300 uppercase text-[10px] sticky top-0"><tr><th class="p-2">day</th>${dsStu.cols.map(c => `<th class="p-2">${esc(c.head)}</th>`).join('')}<th class="p-2">إجراء</th></tr></thead>
                <tbody id="dsStuBody">${dates.map((d, i) => dsRowHtml(i, dsDayLabel(d, i), dsStu.cols)).join('')}</tbody></table></div>
        <div style="text-align:center;margin-top:10px"><button type="button" id="dsMoreBtn" class="ds-b ghost" onclick="dsMore()">More · باقي الشهر</button></div>`;
    dates.forEach((d, i) => { dsEl('supply_date', i).value = d; dsLoadRow(i, d); });
};

window.dsMore = async function () {
    if (!dsStu || dsStu.more) return;
    const btn = document.getElementById('dsMoreBtn'); if (btn) btn.disabled = true;
    const start = supplyState.students.length, from = dsAddDays(dsStu.today, -30), to = dsAddDays(dsStu.today, -start);
    const dates = []; for (let n = start; n <= 30; n++) dates.push(dsAddDays(dsStu.today, -n));
    try {
        const data = await dsFetchRange(dsStu.st.id, from, to);
        supplyState.records.push(...data.records); supplyState.parts.push(...data.parts); supplyState.items.push(...data.items);
    } catch (e) { showToast('تعذر تحميل باقي الشهر: ' + e.message, true); if (btn) btn.disabled = false; return; }
    dsStu.more = true;
    const body = document.getElementById('dsStuBody');
    dates.forEach((d, k) => {
        const idx = start + k; supplyState.students.push(dsStu.st);
        body.insertAdjacentHTML('beforeend', dsRowHtml(idx, dsDayLabel(d, idx), dsStu.cols));
        dsEl('supply_date', idx).value = d; dsLoadRow(idx, d);
    });
    if (btn) btn.remove();
};

/* ---------- Master profiles ---------- */
const MP_SECTIONS = [
    ['Identity', [['trainee', 'text', 'Name'], ['preferred name', 'text', 'Preferred name'], ['birth_date', 'date', 'Birth date'], ['location', 'text', 'Location'], ['residence_mostly', 'text', 'Residence (mostly)'], ['preferred_phone', 'text', 'Phone'], ['preferred_email', 'text', 'Email'], ['most_recent_picture_url', 'text', 'Picture URL']]],
    ['Sessions & subscription', [['days_a_week', 'text', 'Days a week'], ['session_time', 'text', 'Session time'], ['place', 'text', 'Place'], ['first_session', 'date', 'First session'], ['joining_date', 'date', 'Joining date'], ['subscription', 'text', 'Subscription'], ['due_date', 'date', 'Due date']]],
    ['Background', [['education_on_joining', 'text', 'Education on joining'], ['schooling', 'text', 'Schooling'], ['specification', 'text', 'Specification']]],
    ['First assessments', [['first_thabit_scoring', 'text', 'First Thabit scoring'], ['first_approved_english_test', 'text', 'First approved English test'], ['first_psychological_approved_test', 'text', 'First psychological test']]],
    ['Status & plan', [['status_as_of_today', 'text', 'Status as of today'], ['current_plan', 'text', 'Current plan'], ['consistency_issues', 'text', 'Consistency issues']]],
    ['Skills', [['personal_skills_strength_points', 'text', 'Personal strengths'], ['personal_skills_weakness_points', 'text', 'Personal weaknesses'], ['linguistic_strengths', 'text', 'Linguistic strengths'], ['linguistic_lacking', 'text', 'Linguistic lacking']]]
];
const mpState = { list: [], q: '', selecting: false, sel: new Set() };
const mpId = k => 'mp_' + k.replace(/\W/g, '_');

async function renderMasterProfiles(backBtnHtml) {
    const sub = document.getElementById('adminDynamicSubContainer');
    sub.innerHTML = `${backBtnHtml}<div class="text-center py-6 text-amber-400">جاري تحميل الطلبة...</div>`;
    try {
        const j = await (await sbFetch(`${PROFILES_TABLE}?select=*&order=trainee.asc`)).json();
        mpState.list = Array.isArray(j) ? j : [];
    } catch (e) {
        sub.innerHTML = `${backBtnHtml}<div class="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm">تعذر التحميل: ${esc(e.message)}</div>`;
        return;
    }
    mpState.q = '';
    sub.innerHTML = `${backBtnHtml}
        <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between gap-2 flex-wrap">
                <h4 class="text-amber-400 font-bold text-base"><i class="fa-solid fa-id-card"></i> Trainee Master Profile</h4>
                <input id="mpSearch" placeholder="ابحث بالاسم..." class="${INPUT_CLS}" style="min-width:200px;font-size:13px;padding:6px 10px" oninput="mpSearch(this.value)">
            </div>
            <div class="flex items-center gap-2 flex-wrap" id="mpBar"></div>
            <div class="mp-grid" id="mpGrid"></div>
        </div>`;
    mpPaintList();
}
window.mpSearch = q => { mpState.q = String(q || '').trim().toLowerCase(); mpPaintList(); };

function mpPaintList() {
    const g = document.getElementById('mpGrid'); if (!g) return;
    const today = dsToday();
    const rows = mpState.list.filter(r => !mpState.q || `${r.trainee || ''} ${r['preferred name'] || ''}`.toLowerCase().includes(mpState.q));
    g.innerHTML = rows.map(r => {
        const late = r.due_date && r.due_date < today;
        const ini = esc(String(r.trainee || '?').trim().charAt(0).toUpperCase());
        const on = mpState.sel.has(String(r.id));
        return `<div class="mp-card${mpState.selecting ? ' sel-mode' : ''}${on ? ' mp-sel' : ''}"${mpState.selecting ? ` onclick="mpToggleSel('${esc(r.id)}',event)"` : ''}>${mpState.selecting ? `<input type="checkbox" class="mp-ck" ${on ? 'checked' : ''} tabindex="-1">` : ''}
            <div class="mp-av">${r.most_recent_picture_url ? `<img src="${esc(r.most_recent_picture_url)}" alt="" onerror="this.remove()">` : ini}</div>
            <div class="mp-nm"><b dir="auto">${esc(r.trainee || '')}</b>
                <small dir="auto">${esc([r['preferred name'], r.subscription].filter(Boolean).join(' · '))}</small>
                <small class="${late ? 'mp-late' : ''}">${r.due_date ? 'Due ' + esc(r.due_date) + (late ? ' (متأخر)' : '') : ''}</small></div>
            <div style="display:flex;flex-direction:column;gap:6px;align-items:stretch">
                <button type="button" class="ds-cur" title="Insert Daily Supply" onclick="openStudentSupply('${esc(r.id)}')"><i class="ds-caret"></i>DS</button>
                <button type="button" class="ds-b amber" onclick="mpOpen('${esc(r.id)}')">Profile</button>
                <button type="button" class="ds-b blue" title="إشعار" onclick="openStudentNotify('${esc(r.id)}')"><i class="fa-solid fa-bell"></i> إشعار</button>
                <button type="button" class="ds-b green" title="Dashboard View" onclick="openStudentDashboard('${esc(r.id)}')"><i class="fa-solid fa-eye"></i> Dashboard</button></div></div>`;
    }).join('') || '<div class="tha-note">مفيش نتائج.</div>';
    mpPaintBar();
}

let mpCur = null;
window.mpClose = function () { if (mpCur) { mpCur.ov.remove(); mpCur = null; } };
window.mpOpen = function (id) {
    mpClose();
    const r = mpState.list.find(x => String(x.id) === String(id)); if (!r) return;
    const ov = document.createElement('div');
    ov.className = 'ds-ov';
    ov.addEventListener('mousedown', e => { if (e.target === ov) mpClose(); });
    const fieldHtml = ([k, type, label]) => type === 'date'
        ? `<div><span class="ds-lbl">${esc(label)}</span><input type="date" id="${mpId(k)}"></div>`
        : `<div><span class="ds-lbl">${esc(label)}</span><input type="hidden" id="${mpId(k)}"><div id="${mpId(k)}_pf" class="ds-pf empty" onclick="dsTextPop('${mpId(k)}','${esc(label)}')">اضغط للكتابة…</div></div>`;
    ov.innerHTML = `<div class="ds-box" style="width:min(980px,100%)">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <b style="color:#fbbf24;font-size:15px">${esc(r.trainee || '')}</b>
            <div style="display:flex;gap:8px"><button type="button" class="ds-b green" id="mpSaveBtn" onclick="mpSave()">Save</button><button type="button" class="ds-b ghost" onclick="mpClose()">إغلاق</button></div></div>
        ${MP_SECTIONS.map(([t, fs]) => `<div class="mp-sec"><h5>${esc(t)}</h5><div class="mp-fields">${fs.map(fieldHtml).join('')}</div></div>`).join('')}
        <div class="text-slate-500" style="font-size:11px;margin-top:14px">id: ${esc(r.id)} · created: ${esc(String(r.created_at || '').slice(0, 10))} · updated: ${esc(String(r.updated_at || '').slice(0, 16).replace('T', ' '))}</div></div>`;
    document.body.appendChild(ov);
    mpCur = { ov, id };
    MP_SECTIONS.forEach(([, fs]) => fs.forEach(([k, type]) => {
        const el = document.getElementById(mpId(k)); if (!el) return;
        el.value = r[k] == null ? '' : String(r[k]);
        if (type !== 'date') dsRefreshPf(mpId(k));
    }));
};

window.mpSave = async function () {
    if (!mpCur) return;
    const body = {};
    MP_SECTIONS.forEach(([, fs]) => fs.forEach(([k]) => { const v = document.getElementById(mpId(k)).value.trim(); body[k] = v === '' ? null : v; }));
    if (!body.trainee) { showToast('الاسم مطلوب', true, true); return; }
    body.updated_at = new Date().toISOString();
    const btn = document.getElementById('mpSaveBtn'); if (btn) btn.disabled = true;
    try {
        const res = await sbFetch(`${PROFILES_TABLE}?id=eq.${encodeURIComponent(mpCur.id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(body) });
        const rows = await res.json();
        if (!Array.isArray(rows) || !rows.length) throw new Error('لم يتم تحديث أي سجل (تأكد من صلاحيات الجدول)');
        const i = mpState.list.findIndex(x => String(x.id) === String(mpCur.id));
        if (i >= 0) mpState.list[i] = rows[0];
        mpPaintList();
        showToast('اتحفظت بيانات ' + (rows[0].trainee || '') + ' ✓');
        mpClose();
    } catch (e) { showToast('فشل الحفظ: ' + e.message, true); if (btn) btn.disabled = false; }
};

/* ==========================================================
   Admin auth (Supabase email + password). The panel only works with a
   signed-in session: tables are readable/writable by "authenticated" only.
   ========================================================== */
const ADMIN_SESSION_KEY = 'thabit_admin_session';
const nowSec = () => Math.floor(Date.now() / 1000);
function saveAdminSession(s) {
    window.SB_ACCESS_TOKEN = s.access_token;
    try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
            access_token: s.access_token, refresh_token: s.refresh_token,
            expires_at: s.expires_at || (nowSec() + (s.expires_in || 3600))
        }));
    } catch (e) {}
}
function loadAdminSession() { try { return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY) || 'null'); } catch (e) { return null; } }
function clearAdminSession() { window.SB_ACCESS_TOKEN = undefined; try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch (e) {} }
async function authRequest(grant, body) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grant}`, {
        method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error_description || j.msg || j.message || 'Login failed');
    return j;
}
async function refreshAdminSession() {
    const s = loadAdminSession();
    if (!s || !s.refresh_token) return false;
    try { saveAdminSession(await authRequest('refresh_token', { refresh_token: s.refresh_token })); return true; } catch (e) { return false; }
}
function showLoginScreen(msg) {
    clearAdminSession();
    const o = document.getElementById('adminModalOverlay'); if (o) o.classList.remove('open');
    showAuthModal(true);
    const err = document.getElementById('thaAuthErr'); if (err) err.textContent = msg || '';
}
function onSessionExpired() { showLoginScreen('انتهت الجلسة، سجّل دخول تاني'); }
function handleLoginEnter(e) { if (e && e.key === 'Enter') handleAdminLogin(); }
async function handleAdminLogin() {
    const email = (document.getElementById('thaEmail').value || '').trim();
    const pass = document.getElementById('thaPass').value || '';
    const err = document.getElementById('thaAuthErr'), btn = document.getElementById('thaAuthOk');
    if (!email || !pass) { if (err) err.textContent = 'اكتب الإيميل والباسورد'; return; }
    if (btn) btn.disabled = true;
    try {
        saveAdminSession(await authRequest('password', { email, password: pass }));
        document.getElementById('thaPass').value = '';
        if (err) err.textContent = '';
        showAuthModal(false); openAdminMainPanel(); refreshWordLists();
    } catch (e) { if (err) err.textContent = e.message; }
    if (btn) btn.disabled = false;
}
async function adminLogout() {
    try { if (window.SB_ACCESS_TOKEN) await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: sbHeaders() }); } catch (e) {}
    clearAdminSession();                       // امسح الجلسة قبل ما نسيب الصفحة، عشان البورتال ما يرجّعنيش تاني
    window.location.replace('index.html');     // تسجيل الخروج بيودّي على البورتال
}

/* ==========================================================
   Helpers
   ========================================================== */
const $id = id => document.getElementById(id);
const enc = encodeURIComponent;
const likeEsc = s => String(s).replace(/[\\%_]/g, m => '\\' + m);
function fmtDT(v) {
    if (!v) return '';
    const s = String(v), d = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s + 'Z');
    return isNaN(d) ? s : d.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

/* word lists: "النهاردة · 2:05 PM" / "امبارح · 9:30 AM" / "الأربعاء · 4:10 PM" (Cairo time, 12-hour clock) */
function fmtWordDT(v) {
    if (!v) return '';
    const s = String(v), d = typeof v === 'number' ? new Date(v) : new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s + 'Z');
    if (isNaN(d)) return s;
    const TZ = 'Africa/Cairo';
    const day = d.toLocaleDateString('en-CA', { timeZone: TZ }), today = dsToday();
    const diff = Math.round((Date.parse(today + 'T00:00:00Z') - Date.parse(day + 'T00:00:00Z')) / 864e5);
    let label;
    if (diff === 0) label = 'النهاردة';
    else if (diff === 1) label = 'امبارح';
    else {
        label = d.toLocaleDateString('ar-EG', { weekday: 'long', timeZone: TZ });
        if (diff > 6 || diff < 0) label += ' ' + day.slice(8, 10) + '/' + day.slice(5, 7);   // old ones: add dd/mm so the weekday is not ambiguous
    }
    const tm = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ });
    return label + ' · ' + tm;
}

/* ==========================================================
   Reports (table: reports)
   ========================================================== */
async function loadReportsList() {
    const box = $id('reportsContainer'); if (!box) return;
    box.textContent = '...';
    try {
        const rows = await fetchAllRows('reports?select=*&order=created_at.desc');
        box.innerHTML = rows.length ? rows.map(r => `
          <div style="border:1px solid rgba(148,163,184,.3);border-radius:12px;padding:10px;margin-bottom:8px;text-align:start">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:.75rem">
              <b dir="auto">${esc(r.name)}</b>
              <span style="opacity:.7">${esc(r.page || '')} · ${esc(fmtDT(r.created_at))}</span>
              <button type="button" class="tha-b gray" style="padding:2px 8px" onclick="deleteReport('${esc(r.id)}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div dir="auto" style="margin-top:6px;white-space:pre-wrap;font-size:.85rem">${esc(r.problem)}</div>
          </div>`).join('') : 'مفيش تقارير.';
    } catch (e) { box.textContent = ''; showToast('تعذّر تحميل التقارير: ' + e.message, true); }
}
// PATCH/DELETE that FAILS LOUDLY: with RLS a blocked write returns 0 rows and no error,
// which looked like "the button does nothing". Here 0 affected rows = visible error.
async function mutate(path, method, body) {
    const res = await sbFetch(path, { method, headers: { Prefer: 'return=representation' }, body: body ? JSON.stringify(body) : undefined });
    const rows = await res.json().catch(() => []);
    if (!Array.isArray(rows) || !rows.length) throw new Error('محصلش أي تغيير (غالبًا صلاحيات RLS أو السجل مش موجود)');
    return rows;
}
async function deleteReport(id) {
    if (!confirm('تمسح التقرير ده؟')) return;
    try { await mutate(`reports?id=eq.${enc(id)}`, 'DELETE'); showToast('اتمسح ✓'); loadReportsList(); }
    catch (e) { showToast('فشل المسح: ' + e.message, true); }
}

/* ==========================================================
   Voices: word lists (due_words_table / broken_words_table; trash = status 'trash')
   ========================================================== */
const WL = { due: [], broken: [], trash: [], have: new Map() };   // have: cleaned word -> audio url
const stOf = r => String(r.status || '').toLowerCase();
const wkey = s => String(s || '').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”’‘]/g, '').replace(/\s+/g, ' ').trim();   // same as the Assistant and the SQL column words_table.word_key

/* ---------- mini audio player: play / pause / seek bar; tapping anywhere else stops it and closes it ---------- */
function closeAdminAudioPop() { if (window._admAP) { window._admAP.close(); window._admAP = null; } }
function adminAudioPop(url, label) {
    closeAdminAudioPop();
    const a = new Audio(url), el = document.createElement('div');
    const tf = n => { n = Math.max(0, Math.floor(n || 0)); return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); };
    el.id = 'admAudioPop';
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483200;width:min(92vw,360px);padding:12px 14px;border-radius:16px;background:#0f172a;color:#f1f5f9;border:1px solid rgba(245,158,11,.55);box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:Cairo,Inter,sans-serif';
    el.innerHTML = '<div dir="auto" style="font-weight:800;font-size:.8rem;margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(label || '') + '</div>'
        + '<div style="display:flex;align-items:center;gap:10px"><button type="button" data-pp style="width:36px;height:36px;flex:none;border-radius:50%;border:0;background:#f59e0b;color:#0f172a;cursor:pointer"><i class="fa-solid fa-play"></i></button>'
        + '<input type="range" min="0" max="1000" value="0" step="1" data-seek style="flex:1;min-width:0;accent-color:#f59e0b">'
        + '<span data-tm style="font:600 .7rem monospace;min-width:70px;text-align:end">0:00 / 0:00</span></div>';
    document.body.appendChild(el);
    const pp = el.querySelector('[data-pp]'), sk = el.querySelector('[data-seek]'), tm = el.querySelector('[data-tm]');
    let drag = false;
    const icon = () => { pp.innerHTML = '<i class="fa-solid ' + (a.paused ? 'fa-play' : 'fa-pause') + '"></i>'; };
    const tick = () => {
        const d = isFinite(a.duration) ? a.duration : 0;
        if (!drag) sk.value = d ? Math.round(a.currentTime / d * 1000) : 0;
        tm.textContent = tf(a.currentTime) + ' / ' + tf(d);
    };
    a.addEventListener('timeupdate', tick); a.addEventListener('loadedmetadata', tick);
    a.addEventListener('play', icon); a.addEventListener('pause', icon); a.addEventListener('ended', () => { icon(); tick(); });
    pp.onclick = () => {
        if (a.ended || (isFinite(a.duration) && a.currentTime >= a.duration - 0.05)) a.currentTime = 0;
        a.paused ? a.play().catch(() => showToast('مش قادر أشغّل الصوت', true)) : a.pause();
    };
    sk.addEventListener('pointerdown', () => { drag = true; });
    sk.addEventListener('pointerup', () => { drag = false; });
    sk.addEventListener('input', () => { if (isFinite(a.duration)) { a.currentTime = sk.value / 1000 * a.duration; tick(); } });
    const off = e => { if (!el.contains(e.target)) close(); };
    const esc2 = e => { if (e.key === 'Escape') close(); };
    function close() { try { a.pause(); a.removeAttribute('src'); a.load(); } catch (e) {} el.remove(); document.removeEventListener('pointerdown', off, true); document.removeEventListener('keydown', esc2); if (window._admAP && window._admAP.el === el) window._admAP = null; }
    setTimeout(() => document.addEventListener('pointerdown', off, true), 0);
    document.addEventListener('keydown', esc2);
    window._admAP = { close, el };
    icon(); a.play().catch(() => showToast('مش قادر أشغّل الصوت', true));
}
async function playWordPop(word) {
    try {
        const r = await (await sbFetch(`words_table?select=word,audio_url&word=ilike.${enc(likeEsc(String(word).trim()))}&limit=1`)).json();
        if (Array.isArray(r) && r[0] && r[0].audio_url) adminAudioPop(r[0].audio_url, r[0].word);
        else showToast('الكلمة دي مالهاش صوت في الداتابيز', true);
    } catch (e) { showToast('فشل: ' + e.message, true); }
}

/* ---------- split a sentence into the pieces worth recording (word groups that belong together stay together) ----------
   Add your own fixed expressions to COLLOC (lower case, one per entry) and they will always stay as one piece. */
const COLLOC = ["i'm done with", 'set a plan', 'the best of', 'best for', 'look forward to', 'in order to', 'a lot of', 'lots of', 'be able to', 'going to', 'used to', 'have to', 'want to', 'need to', 'kind of', 'sort of', 'as soon as', 'according to', 'because of', 'instead of', 'such as', 'a bit of', 'a couple of', 'out of', 'one of the', 'how about', 'what about', 'thank you', 'good morning', 'good night', 'good evening', 'as well as', 'on time', 'in time', 'at least', 'at last', 'of course', 'right now', 'for example', 'by the way', 'take care', 'take part in', 'get up', 'wake up', 'pick up', 'turn on', 'turn off', 'give up', 'find out', 'look at', 'look for', 'look after', 'come back', 'go on', 'carry on', 'make sure', 'make a decision', 'take a break', 'do your best', 'keep in touch', 'get along with', 'deal with', 'work on', 'think about', 'talk about', 'depend on', 'agree with', 'be about to', 'would like to', 'is going to', 'are going to'].map(c => c.split(' ')).sort((a, b) => b.length - a.length);
const STOPW = new Set("all a an the and or but so if as is am are was were be been being do does did has have had will would can could should may might shall must i me my mine you your yours he him his she her hers it its we us our ours they them their theirs this that these those there here some any very too just also then than what who whom which when where why how not no yes i'm i'll i've i'd you're you've you'll you'd he's she's it's we're we've we'll they're they've they'll that's there's what's let's".split(' '));
const PREPW = new Set('with for of in on at by from about into over under up down out off to through after before around between against'.split(' '));
function splitUnits(text) {
    const toks = String(text || '').replace(/[’‘]/g, "'").split(/\s+/).map(t => t.replace(/^['"-]+|['"-]+$/g, '')).filter(Boolean);
    if (toks.length < 2) return [];
    const low = toks.map(t => t.toLowerCase()), units = [];
    let i = 0, adj = false;
    while (i < toks.length) {
        let hit = 0;
        for (const c of COLLOC) { if (i + c.length <= toks.length && c.every((w, k) => low[i + k] === w)) { hit = c.length; break; } }
        if (hit) { units.push(toks.slice(i, i + hit).join(' ')); adj = false; i += hit; continue; }
        const t = low[i];
        if (STOPW.has(t) || t.length < 2) { adj = false; i++; continue; }
        if (PREPW.has(t)) { if (adj && units.length) units[units.length - 1] += ' ' + toks[i]; adj = false; i++; continue; }
        units.push(toks[i]); adj = true; i++;
    }
    const whole = wkey(text), seen = new Set();
    return units.filter(u => { const k = wkey(u); if (!k || k === whole || seen.has(k)) return false; seen.add(k); return true; });
}
const pendingUnits = text => splitUnits(text).filter(u => !WL.have.has(wkey(u)));

/* which of these words already have a recording? One small query per 40 words (words_table can hold tens of thousands of rows).
   Needs the column words_table.word_key; without it, falls back to reading the whole table (slow for big tables). */
async function fetchHave(keys) {
    const m = new Map(), list = Array.from(keys).filter(Boolean);
    if (!list.length) return m;
    try {
        for (let i = 0; i < list.length; i += 40) {
            const inList = list.slice(i, i + 40).map(k => '"' + k.replace(/"/g, '') + '"').join(',');
            const rows = await (await sbFetch(`words_table?select=word_key,audio_url&word_key=in.(${enc(inList)})`)).json();
            if (!Array.isArray(rows)) throw new Error('no word_key');
            rows.forEach(r => m.set(r.word_key, r.audio_url || ''));
        }
        return m;
    } catch (e) {
        const all = await fetchAllRows('words_table?select=word,audio_url').catch(() => []);
        all.forEach(r => m.set(wkey(r.word), r.audio_url || ''));
        return m;
    }
}
async function refreshWordLists() {
    try {
        const [due, brk] = await Promise.all([
            fetchAllRows('due_words_table?select=*&order=created_at.desc'),
            fetchAllRows('broken_words_table?select=*&order=created_at.desc')
        ]);
        const keys = new Set();
        due.concat(brk).forEach(r => { if (stOf(r) === 'trash' || stOf(r) === 'done') return; keys.add(wkey(r.word)); splitUnits(r.word).forEach(u => keys.add(wkey(u))); });
        WL.have = await fetchHave(keys);
        const active = r => stOf(r) !== 'trash' && stOf(r) !== 'done';
        WL.due = due.filter(active).sort((a, b) => (b.priority === 'high') - (a.priority === 'high'));
        WL.broken = brk.filter(active);
        WL.trash = [].concat(
            due.filter(r => stOf(r) === 'trash').map(r => Object.assign({ _t: 'due_words_table' }, r)),
            brk.filter(r => stOf(r) === 'trash').map(r => Object.assign({ _t: 'broken_words_table' }, r)));
        renderWordLists();
    } catch (e) { showToast('تعذّر تحميل قوايم الكلمات: ' + e.message, true); }
}

(function () {
    if (document.getElementById('wlCss')) return;
    const s = document.createElement('style'); s.id = 'wlCss';
    s.textContent = '.wl-g{border-radius:12px;background:rgba(30,41,59,.55);padding:6px 8px}.wl-sum{display:flex;align-items:center;gap:8px;cursor:pointer;list-style:none;font-size:10px;color:#94a3b8}.wl-sum::-webkit-details-marker{display:none}'
        + '.wl-ln{flex:1;height:1px;background:rgba(148,163,184,.35)}.wl-nm{font-weight:700;color:#cbd5e1}.wl-ct{opacity:.7}'
        + '.wl-grid{display:grid;grid-template-columns:1fr 1fr;margin-top:6px}.wl-col{display:flex;flex-direction:column;gap:3px;padding:0 8px 0 0;min-width:0}.wl-col.wl-r{padding:0 0 0 8px;border-left:1px solid rgba(148,163,184,.35)}'
        + '.wl-it{display:flex;align-items:center;gap:4px;font-size:11.5px;line-height:1.5}.wl-t{flex:1;min-width:0;overflow-wrap:anywhere;cursor:pointer}.wl-t:hover{color:#fbbf24}.wl-it.wl-done .wl-t{opacity:.5}.wl-it i.fa-check{color:#34d399;font-size:10px}'
        + '.wl-it{flex-wrap:wrap;user-select:none}.wl-url{flex-basis:100%;display:flex;gap:4px;align-items:center;font-size:9.5px;opacity:.75;user-select:text}.wl-url span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
        + '.wl-tb{display:flex;align-items:center;gap:8px;margin-bottom:6px}.wl-sel{background:rgba(245,158,11,.22)!important;outline:1px solid #f59e0b;border-radius:6px}.wl-row{user-select:none}'
        + '.wl-b{padding:1px 6px;border-radius:6px;background:rgba(71,85,105,.8);font-size:10px;color:#e2e8f0}.wl-em{font-size:10px;opacity:.5}';
    document.head.appendChild(s);
})();

const tmsOf = v => { const s = String(v || ''); const d = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s + 'Z'); return d.getTime() || 0; };
function groupWordRows(list) {
    const key = r => String(r.trainee_id || r.trainee_name || '');
    const arr = list.map((r, i) => ({ r, i })).sort((a, b) => key(a.r).localeCompare(key(b.r)) || tmsOf(a.r.created_at) - tmsOf(b.r.created_at));
    const groups = [];
    arr.forEach(x => {
        const g = groups[groups.length - 1], t = tmsOf(x.r.created_at);
        if (g && g.key === key(x.r) && t - g.last <= 8000) { g.items.push(x); g.last = t; } else groups.push({ key: key(x.r), name: x.r.trainee_name || '', first: t, last: t, items: [x] });
    });
    return groups.sort((a, b) => b.last - a.last);
}
const urlLine = w => {          // just a small "URL" copy button on the row; the link itself stays hidden
    const u = WL.have.get(wkey(w));
    return u ? `<button type="button" class="wl-b" title="Copy URL" data-u="${esc(u)}" onclick="copyWordUrl(this)" style="font-size:9px;display:inline-flex;align-items:center;gap:3px"><i class="fa-regular fa-copy"></i> URL</button>` : '';
};
function copyWordUrl(b) {
    const u = b.dataset.u || '';
    const fb = () => { const t = document.createElement('textarea'); t.value = u; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} t.remove(); showToast(ok ? 'اتنسخ ✓' : 'مقدرتش أنسخ', !ok); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(() => showToast('اتنسخ ✓'), fb); else fb();
}
const wlBar = kind => `<div class="wl-tb"><button type="button" class="wl-b" onclick="wlSelectAll('${kind}')"><i class="fa-regular fa-square-check"></i> تحديد الكل</button><span class="wl-em">Ctrl+click · اسحب مربع · كليك يمين</span></div>`;
function groupedHtml(kind, empty) {
    const list = WL[kind];
    if (!list.length) return `<span class="text-xs text-slate-500 text-center py-2">${empty}</span>`;
    return wlBar(kind) + groupWordRows(list).map((g, gi) => {
        const sents = [], words = [], seen = new Set();
        g.items.forEach(({ r, i }) => { const w = String(r.word || '').trim(); if (!w) return; seen.add(wkey(w)); (/\s/.test(w) ? sents : words).push({ r, i, w }); });
        const derived = [], doneL = [];
        sents.forEach(s => splitUnits(s.w).forEach(u => { const k = wkey(u); if (seen.has(k)) return; seen.add(k); (WL.have.has(k) ? doneL : derived).push(u); }));
        const high = g.items.some(x => x.r.priority === 'high');
        const trash = i => `<button type="button" class="wl-b" title="Trash" onclick="trashListedWord('${kind}',${i})"><i class="fa-solid fa-trash"></i></button>`;
        const play = w => kind === 'broken' ? `<button type="button" class="wl-b" title="Play" data-w="${esc(w)}" onclick="playWordPop(this.dataset.w)"><i class="fa-solid fa-volume-high"></i></button>` : '';
        const item = ({ i, w }) => { const have = WL.have.has(wkey(w)); return `<div class="wl-it${have ? ' wl-done' : ''}" data-sel="${kind}:${i}"><span class="wl-t" dir="auto" onclick="useListedWord('${kind}',${i})">${esc(w)}</span>${have ? '<i class="fa-solid fa-check"></i>' : ''}${play(w)}${trash(i)}${urlLine(w)}</div>`; };
        const dItem = u => `<div class="wl-it"><span class="wl-t" dir="auto" data-w="${esc(u)}" onclick="useWordText(this.dataset.w)">${esc(u)}</span></div>`;
        const doneBox = doneL.length ? `<details class="wl-em"><summary style="cursor:pointer">+${doneL.length} مسجّلة ✓</summary>${doneL.map(u => `<div class="wl-it wl-done"><span class="wl-t" dir="auto">${esc(u)}</span>${urlLine(u)}</div>`).join('')}</details>` : '';
        return `<details class="wl-g"${gi < 2 ? ' open' : ''}><summary class="wl-sum"><span class="wl-ln"></span><span class="wl-nm">${esc(g.name)} · ${esc(fmtWordDT(g.last))}</span>${high ? '<span class="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold">HIGH</span>' : ''}<span class="wl-ct">${sents.length} جمل · ${words.length + derived.length} كلمات</span><span class="wl-ln"></span></summary>`
            + `<div class="wl-grid" dir="ltr"><div class="wl-col">${sents.map(item).join('') || '<span class="wl-em">—</span>'}</div>`
            + `<div class="wl-col wl-r">${words.map(item).join('')}${derived.map(dItem).join('')}${doneBox}${words.length + derived.length + doneL.length ? '' : '<span class="wl-em">—</span>'}</div></div></details>`;
    }).join('');
}

function wordRow(r, kind, i) {
    const btn = (fn, ic, title) => `<button type="button" title="${title}" class="px-2 py-1 rounded-lg bg-slate-700 text-[11px]" onclick="${fn}('${kind}',${i})"><i class="fa-solid ${ic}"></i></button>`;
    const acts = kind === 'trash'
        ? btn('restoreFromTrash', 'fa-rotate-left', 'Restore') + btn('purgeFromTrash', 'fa-xmark', 'Delete forever')
        : btn('useListedWord', 'fa-microphone', 'Record') + btn('trashListedWord', 'fa-trash', 'Trash');
    return `<div class="wl-row flex items-center justify-between gap-2 text-xs bg-slate-800/60 rounded-lg p-2" data-sel="${kind}:${i}">
      <div class="min-w-0"><b dir="auto" class="break-words">${esc(r.word)}</b>${r.priority === 'high' ? ' <span class="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold">HIGH</span>' : ''}
      <div class="text-[10px] text-slate-400">${esc(r.trainee_name || '')} · ${esc(fmtWordDT(r.created_at))}</div></div>
      <div class="flex gap-1 flex-none">${acts}</div></div>`;
}
function renderWordLists() {
    Object.keys(SEL).forEach(k => SEL[k].clear());
    const put = (id, cnt, list, kind, empty) => {
        const c = $id(id);
        if (c) {
            c.innerHTML = kind === 'trash' ? (list.length ? wlBar(kind) + list.map((r, i) => wordRow(r, kind, i)).join('') : `<span class="text-xs text-slate-500 text-center py-2">${empty}</span>`) : groupedHtml(kind, empty);
            c.style.maxHeight = '60vh';
        }
        const n = $id(cnt); if (n) n.textContent = list.length;
    };
    put('dueWordsContainer', 'dueWordsCount', WL.due, 'due', 'No pending words right now.');
    put('brokenWordsContainer', 'brokenWordsCount', WL.broken, 'broken', 'مفيش كلمات مكسورة.');
    put('trashWordsContainer', 'trashCount', WL.trash, 'trash', 'Trash is empty.');
    const b = $id('voicesBadge'), pending = WL.due.length + WL.broken.length;
    if (b) { b.textContent = pending; b.style.display = pending ? 'inline-flex' : 'none'; }
    updateSelBar();
}

/* ==========================================================
   Selection (due / broken / trash): Ctrl+click, drag a rectangle, right-click menu, Select all, bulk Trash / Restore / Delete forever
   ========================================================== */
const SEL = { due: new Set(), broken: new Set(), trash: new Set() };
const selCount = () => SEL.due.size + SEL.broken.size + SEL.trash.size;
const selKind = () => ['due', 'broken', 'trash'].find(k => SEL[k].size) || null;
function selPaint() {
    document.querySelectorAll('[data-sel]').forEach(el => { const p = el.dataset.sel.split(':'); el.classList.toggle('wl-sel', !!SEL[p[0]] && SEL[p[0]].has(+p[1])); });
    updateSelBar();
}
function selSet(k, i, on) {
    Object.keys(SEL).forEach(x => { if (x !== k) SEL[x].clear(); });
    const s = SEL[k], v = on === undefined ? !s.has(i) : on;
    v ? s.add(i) : s.delete(i);
}
function wlSelectAll(kind) { Object.keys(SEL).forEach(x => SEL[x].clear()); WL[kind].forEach((_, i) => SEL[kind].add(i)); selPaint(); }
function selClear() { Object.keys(SEL).forEach(k => SEL[k].clear()); selPaint(); }
function selGroup(det) {
    const els = Array.prototype.slice.call(det.querySelectorAll('[data-sel]')); if (!els.length) return;
    const ps = els.map(el => el.dataset.sel.split(':')), all = ps.every(p => SEL[p[0]].has(+p[1]));
    ps.forEach(p => selSet(p[0], +p[1], !all)); selPaint();
}
async function wlBulk(op) {
    const kind = selKind(); if (!kind) return;
    const rows = Array.from(SEL[kind]).map(i => WL[kind][i]).filter(Boolean); if (!rows.length) return;
    if (op === 'purge' && !confirm('تمسح ' + rows.length + ' نهائي؟')) return;
    if (op === 'trash' && rows.length > 1 && !confirm('تنقل ' + rows.length + ' للسلة؟')) return;
    const byT = {};
    rows.forEach(r => { const t = kind === 'trash' ? r._t : tableOf(kind); (byT[t] = byT[t] || []).push(r.id); });
    try {
        for (const t in byT) {
            const q = `${t}?id=in.(${byT[t].map(enc).join(',')})`;
            if (op === 'purge') await mutate(q, 'DELETE'); else await mutate(q, 'PATCH', { status: op === 'trash' ? 'trash' : 'pending' });
        }
        showToast(op === 'trash' ? 'اتنقلت للسلة ✓' : op === 'restore' ? 'اترجعت ✓' : 'اتمسحت نهائي ✓');
        selClear(); refreshWordLists();
    } catch (e) { showToast('فشل: ' + e.message, true); }
}
function updateSelBar() {
    let bar = $id('wlSelBar');
    const n = selCount(), kind = selKind();
    if (!n) { if (bar) bar.style.display = 'none'; return; }
    if (!bar) {
        bar = document.createElement('div'); bar.id = 'wlSelBar';
        bar.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483100;display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;padding:8px 12px;border-radius:14px;background:#0f172a;color:#f1f5f9;border:1px solid rgba(245,158,11,.6);box-shadow:0 16px 50px rgba(0,0,0,.6);font:700 .78rem Cairo,sans-serif;max-width:94vw';
        document.body.appendChild(bar);
    }
    const b = (fn, t, c) => `<button type="button" class="wl-b" style="padding:6px 10px;font-size:.75rem;${c || ''}" onclick="${fn}">${t}</button>`;
    bar.innerHTML = `<span>${n} محدد</span>` + b(`wlSelectAll('${kind}')`, 'تحديد الكل')
        + (kind === 'trash' ? b("wlBulk('restore')", 'استرجاع', 'background:#059669') + b("wlBulk('purge')", 'مسح نهائي', 'background:#e11d48') : b("wlBulk('trash')", 'نقل للسلة', 'background:#e11d48'))
        + b('selClear()', 'إلغاء');
    bar.style.display = 'flex';
}
function closeCtx() { const m = $id('wlCtx'); if (m) m.remove(); }
function showCtx(x, y, kind, det) {
    closeCtx();
    const m = document.createElement('div'); m.id = 'wlCtx';
    m.style.cssText = 'position:fixed;z-index:2147483150;min-width:190px;padding:6px;border-radius:12px;background:#0f172a;border:1px solid rgba(148,163,184,.45);box-shadow:0 16px 50px rgba(0,0,0,.6);font:700 .78rem Cairo,sans-serif;color:#f1f5f9';
    const n = SEL[kind].size, it = (fn, t, c) => `<div data-f="${fn}" style="padding:7px 10px;border-radius:8px;cursor:pointer;${c || ''}" onmouseover="this.style.background='rgba(148,163,184,.2)'" onmouseout="this.style.background=''">${t}</div>`;
    m.innerHTML = it('all', 'تحديد الكل في القايمة') + (det ? it('grp', 'تحديد المجموعة دي') : '') + (selCount() ? it('clr', 'إلغاء التحديد') : '')
        + (n ? (kind === 'trash' ? it('restore', `↩ استرجاع المحدد (${n})`) + it('purge', `✖ مسح نهائي (${n})`, 'color:#fb7185') : it('trash', `🗑 نقل المحدد للسلة (${n})`, 'color:#fb7185')) : '');
    document.body.appendChild(m);
    const r = m.getBoundingClientRect();
    m.style.left = Math.max(6, Math.min(x, innerWidth - r.width - 6)) + 'px'; m.style.top = Math.max(6, Math.min(y, innerHeight - r.height - 6)) + 'px';
    m.addEventListener('click', e => {
        const f = e.target.closest('[data-f]'); if (!f) return; closeCtx();
        ({ all: () => wlSelectAll(kind), grp: () => det && selGroup(det), clr: selClear, trash: () => wlBulk('trash'), restore: () => wlBulk('restore'), purge: () => wlBulk('purge') })[f.dataset.f]();
    });
    setTimeout(() => { document.addEventListener('pointerdown', function off(e) { if (!m.contains(e.target)) { closeCtx(); document.removeEventListener('pointerdown', off, true); } }, true); }, 0);
}
function initWordSelect() {
    [['dueWordsContainer', 'due'], ['brokenWordsContainer', 'broken'], ['trashWordsContainer', 'trash']].forEach(([id, kind]) => {
        const c = $id(id); if (!c || c._sel) return; c._sel = 1;
        c.addEventListener('click', e => {
            if (c._dragged) { c._dragged = false; e.preventDefault(); e.stopPropagation(); return; }
            const multi = e.ctrlKey || e.metaKey, sm = e.target.closest('summary.wl-sum');
            if (sm && multi) { e.preventDefault(); e.stopPropagation(); selGroup(sm.parentElement); return; }
            const it = e.target.closest('[data-sel]'); if (!it) return;
            if (multi || (selCount() && !e.target.closest('button'))) {
                e.preventDefault(); e.stopPropagation();
                const p = it.dataset.sel.split(':'); selSet(p[0], +p[1]); selPaint();
            }
        }, true);
        c.addEventListener('pointerdown', e => {
            if (e.button !== 0 || e.target.closest('button,input,summary,a')) return;
            c._m = { x: e.clientX, y: e.clientY, on: false, add: e.ctrlKey || e.metaKey, pid: e.pointerId, base: null };
        });
        c.addEventListener('pointermove', e => {
            const m = c._m; if (!m) return;
            if (!m.on) {
                if (Math.hypot(e.clientX - m.x, e.clientY - m.y) < 8) return;
                m.on = true; m.base = m.add ? new Set(SEL[kind]) : new Set();
                m.box = document.createElement('div');
                m.box.style.cssText = 'position:fixed;z-index:2147483100;border:1.5px dashed #f59e0b;background:rgba(245,158,11,.14);border-radius:4px;pointer-events:none';
                document.body.appendChild(m.box);
                try { c.setPointerCapture(m.pid); } catch (_) {}
                document.body.style.userSelect = 'none'; try { getSelection().removeAllRanges(); } catch (_) {}
            }
            const l = Math.min(m.x, e.clientX), t = Math.min(m.y, e.clientY), r = Math.max(m.x, e.clientX), b = Math.max(m.y, e.clientY);
            m.box.style.left = l + 'px'; m.box.style.top = t + 'px'; m.box.style.width = (r - l) + 'px'; m.box.style.height = (b - t) + 'px';
            Object.keys(SEL).forEach(x => { if (x !== kind) SEL[x].clear(); });
            SEL[kind] = new Set(m.base);
            c.querySelectorAll('[data-sel]').forEach(el => {
                const q = el.getBoundingClientRect();
                if (q.width && q.height && q.left < r && q.right > l && q.top < b && q.bottom > t) SEL[kind].add(+el.dataset.sel.split(':')[1]);
            });
            selPaint();
        });
        const end = () => { const m = c._m; c._m = null; if (m && m.on) { m.box.remove(); document.body.style.userSelect = ''; c._dragged = true; setTimeout(() => { c._dragged = false; }, 0); } };
        c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
        c.addEventListener('contextmenu', e => {
            e.preventDefault();
            const it = e.target.closest('[data-sel]');
            if (it) { const p = it.dataset.sel.split(':'); if (!SEL[p[0]].has(+p[1])) { if (!(e.ctrlKey || e.metaKey)) Object.keys(SEL).forEach(x => SEL[x].clear()); selSet(p[0], +p[1], true); selPaint(); } }
            showCtx(e.clientX, e.clientY, kind, e.target.closest('details.wl-g'));
        });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCtx(); if (selCount()) selClear(); } });
}
window.addEventListener('DOMContentLoaded', initWordSelect);
const tableOf = kind => kind === 'due' ? 'due_words_table' : 'broken_words_table';
function useListedWord(kind, i) {
    const r = WL[kind][i]; if (!r) return;
    const inp = $id('newWordInput'); inp.value = r.word; checkIfWordExistsInDb(r.word); inp.focus();
}
function useWordText(text) {
    const inp = $id('newWordInput'); if (!inp) return;
    inp.value = text; checkIfWordExistsInDb(text); inp.focus();
    try { inp.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
}
async function setRowStatus(table, id, status) {
    await mutate(`${table}?id=eq.${enc(id)}`, 'PATCH', { status });
}
async function trashListedWord(kind, i) {
    const r = WL[kind][i]; if (!r) return;
    try { await setRowStatus(tableOf(kind), r.id, 'trash'); showToast('اتنقلت للسلة ✓'); refreshWordLists(); } catch (e) { showToast('فشل: ' + e.message, true); }
}
async function restoreFromTrash(_k, i) {
    const r = WL.trash[i]; if (!r) return;
    try { await setRowStatus(r._t, r.id, 'pending'); refreshWordLists(); } catch (e) { showToast(e.message, true); }
}
async function purgeFromTrash(_k, i) {
    const r = WL.trash[i]; if (!r || !confirm('تمسح الكلمة نهائي؟')) return;
    try { await mutate(`${r._t}?id=eq.${enc(r.id)}`, 'DELETE'); showToast('اتمسحت نهائي ✓'); refreshWordLists(); } catch (e) { showToast('فشل المسح: ' + e.message, true); }
}
// after a word / sentence is recorded: tell the trainee, then move its requests straight to the Trash Bin.
// A sentence whose individual words are not all recorded yet stays until they are (so its words do not disappear from the list).
async function markWordHandled(word) {
    try { await notifyWordReady(word); } catch (e) { /* the notice is best-effort */ }
    if (!WL.have.has(wkey(word))) WL.have.set(wkey(word), '');
    for (const t of ['due_words_table', 'broken_words_table']) {
        let rows = [];
        try { rows = await (await sbFetch(`${t}?select=*&word=ilike.${enc(likeEsc(word))}&or=(status.is.null,status.neq.trash)`)).json(); } catch (e) { continue; }
        for (const r of (Array.isArray(rows) ? rows : [])) {
            if (stOf(r) === 'trash' || pendingUnits(r.word).length) continue;
            try { await setRowStatus(t, r.id, 'trash'); } catch (e) { /* status values may be restricted; ignore */ }
        }
    }
    for (const [t, list] of [['due_words_table', WL.due], ['broken_words_table', WL.broken]]) {      // a sentence is finished once it and all its words are recorded
        for (const r of list) {
            const w = String(r.word || '').trim();
            if (!/\s/.test(w) || !WL.have.has(wkey(w)) || pendingUnits(w).length) continue;
            try { await setRowStatus(t, r.id, 'trash'); } catch (e) { /* ignore */ }
        }
    }
}
function toggleAdminSection(secId, iconId) {
    const s = $id(secId), ic = $id(iconId); if (!s) return;
    s.classList.toggle('collapsed');
    const closed = s.classList.contains('collapsed');
    s.style.display = closed ? 'none' : 'flex';
    if (ic) ic.style.transform = closed ? '' : 'rotate(180deg)';
}

/* ==========================================================
   Voices: one word = one URL (table: words_table, bucket: audio-files)
   - new word  -> record + add
   - existing  -> "update" (new recording replaces the old URL) or "rename" (new text, same URL)
   ========================================================== */
const ADM = { existing: null, action: 'update', blob: null, rec: null, timer: null };
const urlToPath = u => { const m = String(u || '').match(/\/storage\/v1\/object\/public\/audio-files\/(.+)$/); return m ? decodeURIComponent(m[1]) : null; };

function updateSaveState() {
    const btn = $id('saveToSupabaseBtn'); if (!btn) return;
    const rn = $id('renameWordInput');
    const ok = ADM.existing && ADM.action === 'rename' ? !!(rn && rn.value.trim()) : !!ADM.blob;
    btn.disabled = !ok;
    const lbl = $id('uiUploadSaveBtn');
    if (lbl) lbl.textContent = ADM.existing ? (ADM.action === 'rename' ? 'Rename word' : 'Update voice') : 'Upload & Save to Database';
}
function ensureConflictUI() {
    const box = $id('dbWordConflictBox'); if (!box || $id('renameWordInput')) return;
    const play = document.createElement('button');
    play.type = 'button'; play.id = 'playCurrentBtn'; play.textContent = '▶ الصوت الحالي';
    play.className = 'self-start py-1 px-3 rounded-lg bg-slate-800 text-xs font-semibold';
    play.onclick = () => { if (ADM.existing && ADM.existing.audio_url) adminAudioPop(ADM.existing.audio_url, ADM.existing.word); };
    const rn = document.createElement('input');
    rn.id = 'renameWordInput'; rn.placeholder = 'الكلمة الجديدة (الصوت يفضل زي ما هو)';
    rn.className = 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm hidden';
    rn.addEventListener('input', updateSaveState);
    box.appendChild(play); box.appendChild(rn);
}
let _chkT;
function checkIfWordExistsInDb(v) {
    clearTimeout(_chkT);
    _chkT = setTimeout(async () => {
        const w = String(v || '').trim(), box = $id('dbWordConflictBox');
        ADM.existing = null;
        if (!w) { if (box) box.classList.add('hidden'); updateSaveState(); return; }
        try {
            const r = await (await sbFetch(`words_table?select=word,audio_url&word=ilike.${enc(likeEsc(w))}&limit=1`)).json();
            if (Array.isArray(r) && r.length) { ADM.existing = r[0]; if (box) box.classList.remove('hidden'); setConflictAction(ADM.action || 'update'); }
            else { if (box) box.classList.add('hidden'); updateSaveState(); }
        } catch (e) { /* ignore */ }
    }, 300);
}
function setConflictAction(a) {
    ensureConflictUI();
    ADM.action = a === 'rename' ? 'rename' : 'update';
    const on = 'flex-1 py-1.5 px-3 rounded-lg bg-amber-600 text-white text-xs font-semibold transition';
    const off = 'flex-1 py-1.5 px-3 rounded-lg bg-slate-800 text-xs font-semibold transition';
    const u = $id('btnActionReplace'), r = $id('btnActionExplain');
    if (u) { u.className = ADM.action === 'update' ? on : off; u.textContent = 'Update voice'; }
    if (r) { r.className = ADM.action === 'rename' ? on : off; r.textContent = 'Rename word'; }
    const rn = $id('renameWordInput'); if (rn) rn.classList.toggle('hidden', ADM.action !== 'rename');
    const t = $id('conflictWarningText'); if (t) t.textContent = 'الكلمة موجودة. تحدّث الصوت (الـ URL القديم يتشال)، ولا تغيّر الكلمة وتسيب الصوت؟';
    updateSaveState();
}
function handleAdminInputEnter(e) { if (e && e.key === 'Enter') pronounceAdminGoogleTranslation(); }
function pronounceAdminGoogleTranslation() {
    const w = ($id('newWordInput').value || '').trim(); if (!w) return;
    const lang = /[\u0600-\u06FF]/.test(w) ? 'ar' : 'en';
    new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${enc(w)}`).play().catch(() => showToast('مش قادر أشغّل النطق', true));
}
async function toggleAdminRecording() {
    if (ADM.rec && ADM.rec.state === 'recording') { ADM.rec.stop(); return; }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const rec = new MediaRecorder(stream), chunks = [];
        rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = () => {
            stream.getTracks().forEach(t => t.stop()); clearInterval(ADM.timer);
            ADM.blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
            const a = $id('adminAudioPlayback'); a.src = URL.createObjectURL(ADM.blob); a.classList.remove('hidden');
            $id('adminRecordIcon').className = 'fa-solid fa-microphone';
            updateSaveState();
        };
        ADM.rec = rec; rec.start();
        $id('adminRecordIcon').className = 'fa-solid fa-stop';
        let s = 0; $id('adminTimer').textContent = '00:00';
        ADM.timer = setInterval(() => { s++; $id('adminTimer').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000);
    } catch (e) { showToast('مفيش صلاحية للميكروفون', true); }
}
async function uploadBlobToBucket(blob, word) {
    const type = (blob.type || 'audio/webm').split(';')[0];
    const ext = /mp4|aac/.test(type) ? 'm4a' : /ogg/.test(type) ? 'ogg' : 'webm';
    const slug = word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'word';
    const fname = `${Date.now()}_${slug}.${ext}`;
    const up = await fetch(`${SUPABASE_URL}/storage/v1/object/audio-files/${fname}`, {
        method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + window.SB_ACCESS_TOKEN, 'Content-Type': type, 'x-upsert': 'true' }, body: blob
    });
    if (!up.ok) throw new Error(friendlyError(await up.text()));
    return `${SUPABASE_URL}/storage/v1/object/public/audio-files/${fname}`;
}
async function uploadAndSaveToSupabase() {
    const word = ($id('newWordInput').value || '').trim();
    if (!word) { showToast('اكتب الكلمة الأول', true); return; }
    if (!window.SB_ACCESS_TOKEN) { onSessionExpired(); return; }
    const btn = $id('saveToSupabaseBtn'); btn.disabled = true;
    const ex = ADM.existing;
    try {
        if (ex && ADM.action === 'rename') {
            const nw = ($id('renameWordInput').value || '').trim();
            if (!nw) throw new Error('اكتب الكلمة الجديدة');
            if (nw === ex.word) throw new Error('الكلمة الجديدة نفس القديمة');
            await mutate(`words_table?word=eq.${enc(ex.word)}`, 'PATCH', { word: nw });
            await markWordHandled(nw);
            showToast('اتغيّرت الكلمة، والصوت زي ما هو ✓');
        } else {
            if (!ADM.blob) throw new Error('سجّل الصوت الأول');
            const url = await uploadBlobToBucket(ADM.blob, word);
            if (ex) {
                await mutate(`words_table?word=eq.${enc(ex.word)}`, 'PATCH', { audio_url: url });
                const old = urlToPath(ex.audio_url);   // the old URL is replaced; remove its file too (best effort)
                if (old) fetch(`${SUPABASE_URL}/storage/v1/object/audio-files/${old.split('/').map(enc).join('/')}`, { method: 'DELETE', headers: sbHeaders() }).catch(() => {});
                showToast('اتحدّث الصوت ✓');
            } else {
                await sbFetch('words_table', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ word, audio_url: url }) });
                showToast('اتضافت الكلمة ✓');
            }
            await markWordHandled(word);
        }
        ADM.blob = null; ADM.existing = null;
        $id('adminAudioPlayback').classList.add('hidden'); $id('adminTimer').textContent = '00:00';
        $id('newWordInput').value = ''; const rn = $id('renameWordInput'); if (rn) rn.value = '';
        $id('dbWordConflictBox').classList.add('hidden');
        updateSaveState(); refreshWordLists();
    } catch (e) { showToast('فشل الحفظ: ' + e.message, true); updateSaveState(); }
}

/* ===== suggestions: empty field -> oldest pending due words first ===== */
function initWordSuggest() {
    const inp = $id('newWordInput'); if (!inp || inp._sg) return; inp._sg = 1;
    const dd = document.createElement('div');
    dd.id = 'wordSuggest';
    dd.style.cssText = 'display:none;max-height:180px;overflow:auto;border:1px solid rgba(148,163,184,.35);border-radius:12px;background:#0f172a';
    inp.parentElement.parentElement.appendChild(dd);
    const hide = () => { dd.style.display = 'none'; };
    const show = () => {
        if (inp.value.trim()) return hide();
        const list = WL.due.slice().sort((x, y) => ((y.priority === 'high') - (x.priority === 'high')) || String(x.created_at).localeCompare(String(y.created_at))).slice(0, 30);
        if (!list.length) return hide();
        dd.innerHTML = list.map((r, i) => `<div data-i="${i}" style="padding:8px 12px;cursor:pointer;font-size:.8rem;display:flex;justify-content:space-between;gap:8px;border-bottom:1px solid rgba(148,163,184,.15)"><b dir="auto">${esc(r.word)}</b><span style="opacity:.6;font-size:.7rem">${esc(r.trainee_name || '')} · ${esc(fmtDT(r.created_at))}</span></div>`).join('');
        dd._list = list; dd.style.display = 'block';
    };
    dd.addEventListener('mousedown', e => {
        const row = e.target.closest('[data-i]'); if (!row) return;
        e.preventDefault(); inp.value = dd._list[+row.dataset.i].word; hide(); checkIfWordExistsInDb(inp.value);
    });
    inp.addEventListener('focus', show);
    inp.addEventListener('input', show);
    inp.addEventListener('blur', () => setTimeout(hide, 150));
}
window.addEventListener('DOMContentLoaded', initWordSuggest);

// load data when a view opens
(function () {
    const orig = showAdminView;
    showAdminView = function (v) {
        orig(v);
        if (v === 'voices') refreshWordLists();
        if (v === 'reports') loadReportsList();
    };
})();


/* ==========================================================
   Notifications (table: notifications)
   - "إشعار" button on every trainee card, Select + bulk message on top
   - a recorded word / done report notifies the trainee automatically
   ========================================================== */
(function () {
    if (document.getElementById('ntCss')) return;
    const s = document.createElement('style');
    s.id = 'ntCss';
    s.textContent = `
.mp-card.sel-mode{cursor:pointer}.mp-card.mp-sel{border-color:#f59e0b;background:rgba(245,158,11,.09)}
.mp-ck{width:20px;height:20px;accent-color:#f59e0b;flex:none;pointer-events:none}
.nt-feed{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin-top:10px}
.nt-fc{border:1px solid #1e293b;border-radius:14px;background:#0b1220;padding:12px}
.nt-fc h6{font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:6px;letter-spacing:.4px}
.nt-big{font-size:1.25rem;font-weight:800;color:#fbbf24}
.nt-chip{display:inline-block;margin:3px;padding:4px 10px;border-radius:999px;background:rgba(59,130,246,.18);border:1px solid rgba(59,130,246,.55);font-size:12px}
.nt-prev{margin-top:8px;padding:10px 12px;border-radius:12px;background:rgba(148,163,184,.08);border:1px dashed #334155;font-size:13px;white-space:pre-wrap;line-height:1.7}
.nt-row{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid #1e293b;font-size:12px}.nt-row:last-child{border:0}
.nt-names{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}`;
    document.head.appendChild(s);
})();

function mpPaintBar() {
    const b = document.getElementById('mpBar'); if (!b) return;
    const n = mpState.sel.size, on = mpState.selecting;
    b.innerHTML = `<button type="button" class="ds-b ${on ? 'on' : ''}" onclick="mpToggleSelect()"><i class="fa-solid fa-square-check"></i> Select</button>`
        + (on ? `<button type="button" class="ds-b ghost" onclick="mpSelectAll()">الكل</button><span class="text-xs text-slate-400">${n} محدد</span>` : '')
        + `<button type="button" class="ds-b blue" ${on && n ? '' : 'disabled'} onclick="openNotifyMany()"><i class="fa-solid fa-bell"></i> إشعار / Message${on && n ? ' (' + n + ')' : ''}</button>`;
}
window.mpToggleSelect = function () { mpState.selecting = !mpState.selecting; mpState.sel.clear(); mpPaintList(); };
window.mpToggleSel = function (id, ev) {
    if (ev && ev.target && ev.target.closest('button')) return;
    id = String(id); if (mpState.sel.has(id)) mpState.sel.delete(id); else mpState.sel.add(id);
    mpPaintList();
};
window.mpSelectAll = function () {
    const rows = mpState.list.filter(r => !mpState.q || `${r.trainee || ''} ${r['preferred name'] || ''}`.toLowerCase().includes(mpState.q)).map(r => String(r.id));
    const all = rows.length && rows.every(id => mpState.sel.has(id));
    rows.forEach(id => all ? mpState.sel.delete(id) : mpState.sel.add(id));
    mpPaintList();
};

/* ---- feed preview for ONE trainee (next session + dandana, same logic the trainee sees) ---- */
const NT_DAYRX = [/sun|اح?د|(^|[\s,\/])حد/i, /mon|اتنين|[إا]ثنين/i, /tue|تلات|ثلاث/i, /wed|[اأ]ربع/i, /thu|خميس/i, /fri|جمع/i, /sat|سبت/i];
function ntCairoNow() {
    const g = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).forEach(x => g[x.type] = +x.value);
    return Date.UTC(g.year, g.month - 1, g.day, g.hour, g.minute, g.second);
}
function ntNextSession(p, rows) {
    const txt = [p.days_a_week, p.session_time].join(' ');
    let days = NT_DAYRX.map((r, i) => r.test(txt) ? i : -1).filter(i => i >= 0);
    if (!days.length) days = [...new Set(rows.map(r => new Date(r.supply_date + 'T00:00:00Z').getUTCDay()))];
    let h = null, m = 0;
    const mt = String(p.session_time || '').match(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|ص|م)?/i);
    if (mt) { h = +mt[1]; m = +(mt[2] || 0); const x = (mt[3] || '').toLowerCase(); if ((x === 'pm' || x === 'م') && h < 12) h += 12; else if ((x === 'am' || x === 'ص') && h === 12) h = 0; else if (!x && h >= 1 && h <= 8) h += 12; if (h > 23) h = null; }
    if (h == null) { const L = rows.find(r => r.start_time); if (L) { h = +L.start_time.slice(0, 2); m = +L.start_time.slice(3, 5); } }
    if (h == null || !days.length) return null;
    const now = ntCairoNow(), d0 = new Date(now); d0.setUTCHours(0, 0, 0, 0);
    for (let i = 0; i < 15; i++) {
        const d = new Date(d0.getTime() + i * 864e5); if (!days.includes(d.getUTCDay())) continue;
        const t = d.getTime() + (h * 60 + m) * 6e4; if (t > now) return { t, now, h, m };
    }
    return null;
}
async function ntFeedHtml(r) {
    let rows = [], di = [];
    try { rows = await (await sbFetch(`daily_supply?select=supply_date,start_time&trainee_id=eq.${enc(r.id)}&order=supply_date.desc&limit=8`)).json(); } catch (e) { }
    try { di = await (await sbFetch(`supply_items?select=supply_date,title,badge,item_no&trainee_id=eq.${enc(r.id)}&kind=eq.dandana&order=supply_date.desc,item_no.asc&limit=40`)).json(); } catch (e) { }
    rows = Array.isArray(rows) ? rows : []; di = Array.isArray(di) ? di : [];
    const ns = ntNextSession(r, rows);
    let nsHtml = '<span class="text-slate-500 text-xs">مفيش معاد محدد (days_a_week / session_time فاضيين)</span>';
    if (ns) {
        const d = new Date(ns.t), wd = d.toLocaleDateString('ar-EG', { weekday: 'long', timeZone: 'UTC' }), tm = `${(ns.h % 12) || 12}:${String(ns.m).padStart(2, '0')} ${ns.h < 12 ? 'ص' : 'م'}`;
        const mins = Math.max(0, Math.floor((ns.t - ns.now) / 6e4)), dd = Math.floor(mins / 1440), hh = Math.floor((mins % 1440) / 60);
        nsHtml = `<div class="nt-big">${esc(wd)} ${esc(tm)}</div><div class="text-xs text-slate-400">بعد ${dd ? dd + ' يوم ' : ''}${hh} ساعة · ${esc(d.toISOString().slice(0, 10))}</div>`;
    }
    const last = di.length ? di[0].supply_date : null, dl = last ? di.filter(x => x.supply_date === last) : [];
    const dHtml = dl.length ? dl.map(x => `<span class="nt-chip" dir="auto">${esc([x.title, x.badge].filter(Boolean).join(' - '))}</span>`).join('') + `<div class="text-[11px] text-slate-500 mt-1">${esc(last)}</div>` : '<span class="text-slate-500 text-xs">مفيش دندنة لسه</span>';
    return `<div class="nt-fc"><h6>NEXT SESSION · الجلسة الجاية</h6>${nsHtml}</div><div class="nt-fc"><h6>DANDANA · دندنة</h6>${dHtml}</div>`;
}

/* ---- composer ---- */
let ntCur = null;
window.ntClose = function () { if (ntCur) { ntCur.ov.remove(); ntCur = null; } };
window.openStudentNotify = id => openNotify([String(id)]);
window.openNotifyMany = () => { const ids = [...mpState.sel]; if (ids.length) openNotify(ids); };

async function openNotify(ids) {
    ntClose();
    const st = ids.map(id => mpState.list.find(x => String(x.id) === String(id))).filter(Boolean);
    if (!st.length) return;
    const single = st.length === 1;
    const ov = document.createElement('div');
    ov.className = 'ds-ov';
    ov.addEventListener('mousedown', e => { if (e.target === ov) ntClose(); });
    ov.innerHTML = `<div class="ds-box" style="width:min(780px,100%)">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <b style="color:#fbbf24;font-size:15px"><i class="fa-solid fa-bell"></i> ${single ? esc(st[0].trainee || '') : st.length + ' طلاب'}</b>
            <button type="button" class="ds-b ghost" onclick="ntClose()">إغلاق</button></div>
        ${single ? '<div class="nt-feed" id="ntFeed"><div class="tha-note">جاري تحميل الفيد...</div></div>'
                 : `<div class="nt-names">${st.map(s => `<span class="nt-chip" dir="auto">${esc(s.trainee || '')}</span>`).join('')}</div>`}
        <div class="mp-sec"><h5>إشعار جديد</h5>
            <span class="ds-lbl">العنوان (اختياري)</span><input id="ntTitle" class="ds-in" maxlength="80" dir="auto">
            <span class="ds-lbl" style="margin-top:8px">الرسالة</span>
            <input type="hidden" id="ntBody">
            <div id="ntBody_pf" class="ds-pf empty" style="width:100%;box-sizing:border-box;min-height:44px;padding:10px" onclick="dsTextPop('ntBody','الرسالة')">اضغط للكتابة (كبسولات، ترقيم، نقط...)</div>
            <div class="nt-prev" id="ntPrev" style="display:none" dir="auto"></div>
            <div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="ds-b green" id="ntSend" onclick="ntSend()"><i class="fa-solid fa-paper-plane"></i> إرسال${single ? '' : ' للكل (' + st.length + ')'}</button></div>
        </div>
        ${single ? '<div class="mp-sec"><h5>آخر الإشعارات المبعوتة</h5><div id="ntSent" class="text-xs text-slate-500">...</div></div>' : ''}</div>`;
    document.body.appendChild(ov);
    ntCur = { ov, ids: st.map(s => String(s.id)), single };
    if (single) {
        ntFeedHtml(st[0]).then(h => { const f = document.getElementById('ntFeed'); if (f) f.innerHTML = h; });
        ntLoadSent();
    }
}
async function ntLoadSent() {
    const c = ntCur; if (!c || !c.single) return;
    const box = document.getElementById('ntSent'); if (!box) return;
    try {
        const rows = await (await sbFetch(`notifications?select=*&trainee_id=eq.${enc(c.ids[0])}&order=created_at.desc&limit=6`)).json();
        window.ntRows = {}; (Array.isArray(rows) ? rows : []).forEach(n => window.ntRows[n.id] = n);
        box.innerHTML = Array.isArray(rows) && rows.length ? rows.map(n => `<div class="nt-row" style="align-items:center"><span dir="auto" style="flex:1;min-width:0">${esc(n.kind === 'word_ready' ? 'كلمة جاهزة: ' + ((n.meta || {}).word || '') : (n.title || String(n.body || '').split('\n')[0] || ''))}</span><span class="text-slate-500" style="white-space:nowrap">${n.read_at ? '✓ ' : ''}${esc(fmtDT(n.created_at))}</span>${n.kind === 'message' ? `<button type="button" class="ds-b blue" title="تعديل" onclick="ntEdit(${n.id})"><i class="fa-solid fa-pen"></i></button>` : ''}<button type="button" class="ds-b" style="color:#f43f5e!important" title="مسح" onclick="ntDel(${n.id})"><i class="fa-solid fa-trash"></i></button></div>`).join('') : 'لسه مفيش إشعارات اتبعتت.';
    } catch (e) { box.textContent = 'تعذر التحميل: ' + e.message; }
}
function ntPreview() {
    const b = document.getElementById('ntBody'), p = document.getElementById('ntPrev'); if (!b || !p) return;
    const v = b.value.trim(); p.style.display = v ? '' : 'none'; p.textContent = v.replace(/\s*\|\s*/g, '   |   ');
}
{   // refresh the preview whenever the capsule editor closes
    const _drp = dsRefreshPf;
    dsRefreshPf = function (id) { _drp(id); if (id === 'ntBody') ntPreview(); };
}
window.ntSend = async function () {
    const c = ntCur; if (!c) return;
    const body = document.getElementById('ntBody').value.trim(), title = document.getElementById('ntTitle').value.trim();
    if (!body) { showToast('اكتب الرسالة الأول', true, true); return; }
    const btn = document.getElementById('ntSend'); btn.disabled = true;
    try {
        if (c.editId) {
            await sbFetch(`notifications?id=eq.${enc(c.editId)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ title: title || null, body }) });
            showToast('اتعدّل الإشعار ✓'); ntEditDone();
        } else {
            await sbFetch('notifications', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(c.ids.map(id => ({ trainee_id: id, kind: 'message', title: title || null, body }))) });
            showToast(c.ids.length > 1 ? `اتبعت الإشعار لـ ${c.ids.length} طلاب ✓` : 'اتبعت الإشعار ✓');
        }
        document.getElementById('ntBody').value = ''; document.getElementById('ntTitle').value = ''; dsRefreshPf('ntBody');
        const pf = document.getElementById('ntBody_pf'); if (pf) { pf.textContent = 'اضغط للكتابة (كبسولات، ترقيم، نقط...)'; pf.classList.add('empty'); }
        ntLoadSent();
    } catch (e) { showToast('فشل الإرسال: ' + e.message + ' (شغّل 02_notifications.sql لو لسه)', true); }
    btn.disabled = false;
};

/* ---- automatic: a recorded word -> notify every trainee who reported it ---- */
async function notifyWordReady(word) {
    const targets = [];
    for (const t of ['due_words_table', 'broken_words_table']) {
        let rows = [];
        try { rows = await (await sbFetch(`${t}?select=*&word=ilike.${enc(likeEsc(word))}&or=(status.is.null,status.neq.trash)`)).json(); } catch (e) { continue; }
        if (Array.isArray(rows)) rows.filter(r => !['done', 'trash'].includes(stOf(r))).forEach(r => targets.push(r));
    }
    if (!targets.length) return 0;
    let studs = mpState.list.length ? mpState.list : [];
    if (!studs.length) { try { studs = await fetchStudentsFromSupabase(); } catch (e) { studs = []; } }
    const nm = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const byName = new Map(studs.map(s => [nm(s.trainee), String(s.id)]));
    const seen = new Set(), out = [];
    targets.forEach(r => {
        const id = r.trainee_id ? String(r.trainee_id) : byName.get(nm(r.trainee_name));
        if (id && !seen.has(id)) { seen.add(id); out.push({ trainee_id: id, kind: 'word_ready', meta: { word } }); }
    });
    if (!out.length) return 0;
    await sbFetch('notifications', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(out) });
    return out.length;
}


/* ==========================================================
   Dashboard View: the trainee's dashboard exactly as he sees it, in a popup.
   A short-lived token is created by admin_view_token (admin only); the dashboard
   opens it read-only, so no login and nothing is written for the trainee.
   ========================================================== */
window.dvClose = function () { const o = document.getElementById('dvOv'); if (o) o.remove(); document.removeEventListener('keydown', dvKey); };
function dvKey(e) { if (e.key === 'Escape') dvClose(); }
window.addEventListener('message', e => { if (e.data && e.data.thabitView === 'close') dvClose(); });
window.openStudentDashboard = async function (id) {
    const s = mpState.list.find(x => String(x.id) === String(id)); if (!s) return;
    dvClose();
    const ov = document.createElement('div');
    ov.id = 'dvOv'; ov.className = 'tha-modal open'; ov.style.cssText = 'z-index:200003;padding:10px;align-items:stretch';
    ov.addEventListener('mousedown', e => { if (e.target === ov) dvClose(); });
    ov.innerHTML = `<div style="position:relative;width:min(1180px,100%);margin:auto;height:100%;border-radius:20px;overflow:hidden;background:var(--nm-bg,#0f172a);box-shadow:0 30px 80px rgba(0,0,0,.7);display:flex;flex-direction:column">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-bottom:1px solid rgba(148,163,184,.25)">
            <b style="color:#fbbf24;font-size:13px"><i class="fa-solid fa-eye"></i> ${esc(s.trainee || '')} <span style="opacity:.6;font-weight:600">· view only</span></b>
            <button type="button" class="ds-b ghost" onclick="dvClose()">إغلاق ✕</button></div>
        <div id="dvBody" style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center"><span class="tha-note">جاري التحميل...</span></div></div>`;
    document.body.appendChild(ov);
    document.addEventListener('keydown', dvKey);
    try {
        const r = await sbFetch('rpc/admin_view_token', { method: 'POST', body: JSON.stringify({ p_trainee: String(id) }) });
        const tk = await r.json();
        if (typeof tk !== 'string' || !/^[A-Za-z0-9]+$/.test(tk)) throw new Error((tk && tk.message) || 'no token');
        const body = document.getElementById('dvBody'); if (!body) return;
        body.innerHTML = '';
        const f = document.createElement('iframe');
        f.title = 'Trainee dashboard'; f.style.cssText = 'width:100%;height:100%;border:0;background:transparent';
        f.src = 'dashboard.html#vt=' + tk;
        body.appendChild(f);
    } catch (e) {
        const body = document.getElementById('dvBody');
        if (body) body.innerHTML = `<div class="tha-note" style="color:#f43f5e;padding:20px;text-align:center">تعذر فتح الداشبورد: ${esc(e.message)}<br>(شغّل 05_view_dashboard.sql لو لسه)</div>`;
    }
};

function ntEditDone() {
    if (ntCur) ntCur.editId = null;
    const b = document.getElementById('ntSend');
    if (b) b.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال' + (ntCur && !ntCur.single ? ' للكل (' + ntCur.ids.length + ')' : '');
}
window.ntEdit = function (id) {
    const n = (window.ntRows || {})[id]; if (!n || !ntCur) return;
    ntCur.editId = id;
    document.getElementById('ntTitle').value = n.title || '';
    document.getElementById('ntBody').value = n.body || '';
    dsRefreshPf('ntBody');
    const b = document.getElementById('ntSend'); if (b) b.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> حفظ التعديل';
    document.getElementById('ntTitle').focus();
};
window.ntDel = async function (id) {
    if (!confirm('تمسح الإشعار ده؟ هيختفي من داشبورد الطالب.')) return;
    try {
        await sbFetch(`notifications?id=eq.${enc(id)}`, { method: 'DELETE' });
        showToast('اتمسح الإشعار ✓');
        if (ntCur && String(ntCur.editId) === String(id)) ntEditDone();
        ntLoadSent();
    } catch (e) { showToast('فشل المسح: ' + e.message, true); }
};

/* ==========================================================
   Tasks / Dandana "Functionality" (paste at the END of adminpanel.js)
   Top = the task itself. Bottom = Range, repeats, As of (+Now), draggable timeline,
   and today's saved functions that can be re-used on other items.
   ========================================================== */
(function () {
  if (document.getElementById('fxCss')) return;
  const s = document.createElement('style'); s.id = 'fxCss';
  s.textContent = `
.ds-fx{border:1px solid rgba(245,158,11,.35);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;background:#080e1c}
.ds-fx-h{color:#fbbf24;font-weight:800;font-size:13px}
.ds-fns{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.ds-fn{flex:none;width:150px;text-align:start;border:1px solid #334155;border-radius:10px;padding:8px;background:#020617;color:#e2e8f0;display:flex;flex-direction:column;gap:3px;cursor:pointer}
.ds-fn:hover{border-color:#f59e0b}
.ds-fn b{font-size:12px}
.ds-fn small{font-size:10px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ds-fn svg{width:100%;height:12px}
.ds-t2{position:relative;height:104px;margin:8px 44px 0}
.ds-t2-line{position:absolute;left:0;right:0;top:51px;height:3px;background:#334155;border-radius:2px}
.ds-t2-cap{position:absolute;top:44px;width:2px;height:17px;background:#64748b;margin-left:-1px}
.ds-t2-p{position:absolute;top:0;width:0;height:104px}
.ds-t2-d{position:absolute;left:-10px;top:43px;width:20px;height:20px;border-radius:50%;background:#f59e0b;border:2px solid #0f172a;cursor:grab;touch-action:none;box-sizing:border-box;z-index:2}
.ds-t2-d:active{cursor:grabbing;transform:scale(1.2)}
.ds-t2-l{position:absolute;left:0;transform:translateX(-50%);bottom:62px;white-space:nowrap;text-align:center;font-size:12px;line-height:1.25;background:#0f172a;border:1px solid #475569;border-radius:8px;padding:3px 8px;color:#e2e8f0}
.ds-t2-l.lo{bottom:auto;top:62px}
.ds-t2-l small{display:block;font-size:10px;color:#fbbf24}`;
  document.head.appendChild(s);
})();

/* ---------- helpers (Cairo wall-clock everywhere) ---------- */
const fxWall = ms => new Date(ms).toISOString().slice(0, 19);
const fxFromWall = s => { const m = String(s || '').match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/); return m ? Date.parse(m[1] + 'T' + m[2] + ':00Z') : NaN; };
const fxNow = () => Math.floor(ntCairoNow() / 6e4) * 6e4;
const fxClock = ms => { const d = new Date(ms), h = d.getUTCHours(); return `${(h % 12) || 12}:${String(d.getUTCMinutes()).padStart(2, '0')} ${h < 12 ? 'ص' : 'م'}`; };
const fxNewDay = (o, A) => new Date(o).toISOString().slice(0, 10) !== new Date(A).toISOString().slice(0, 10);
const fxWd = o => { try { return new Date(o).toLocaleDateString('ar-EG', { weekday: 'long', timeZone: 'UTC' }); } catch (e) { return ''; } };
const fxLabel = (o, A) => `<b>${fxClock(o)}</b>${fxNewDay(o, A) ? `<small>يوم جديد · ${fxWd(o)}</small>` : ''}`;
const fxEven = n => n < 2 ? [0] : Array.from({ length: n }, (_, i) => i / (n - 1));
const fxOpens = (A, R, fr) => fr.map(x => Math.round((A + x * R * 36e5) / 6e4) * 6e4);
function fxFracs(it) {
  const A = fxFromWall(it.as_of), R = +it.range_hours;
  const ops = (Array.isArray(it.opens_at) ? it.opens_at : []).map(fxFromWall);
  if (!Number.isFinite(A) || !(R > 0) || !ops.length || ops.some(o => !Number.isFinite(o))) return null;
  return ops.map(o => Math.min(1, Math.max(0, (o - A) / (R * 36e5))));
}

/* ---------- today's saved functions ---------- */
let fxFns = [];
async function fxFnLoad() {
  try {
    const r = await (await sbFetch(`supply_functions?select=*&fn_date=eq.${dsToday()}&order=created_at.asc`)).json();
    fxFns = Array.isArray(r) ? r : [];
  } catch (e) {
    fxFns = [];
    if (!window.__fxWarn) { window.__fxWarn = 1; showToast('شغّل SQL جدول supply_functions الأول (' + e.message + ')', true, true); }
  }
}
function fxFnStripPaint() {
  const box = document.getElementById('dsi_fns'); if (!box) return;
  if (!fxFns.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="ds-lbl">فانكشنات النهارده · دوس على واحدة تطبّقها هنا</div><div class="ds-fns">${fxFns.map((fn, i) =>
    `<button type="button" class="ds-fn" onclick="fxFnUse(${i})">
      <svg viewBox="0 0 100 12"><line x1="4" y1="6" x2="96" y2="6" stroke="#475569" stroke-width="1.5"/>${(fn.fractions || []).map(x => `<circle cx="${(4 + x * 92).toFixed(1)}" cy="6" r="3" fill="#f59e0b"/>`).join('')}</svg>
      <b>${esc(fn.range_hours)}h · ×${esc(fn.repeats)}</b><small dir="auto">${esc(fn.label || '')}</small></button>`).join('')}</div>`;
}
window.fxFnUse = function (i) {
  const c = dsItemCtx, fn = fxFns[i]; if (!c || !c.f || !fn) return;
  const f = c.f;
  f.range = +fn.range_hours; f.n = +fn.repeats; f.fr = (fn.fractions || []).map(Number);
  document.getElementById('dsi_range').value = f.range;
  document.getElementById('dsi_rep').value = f.n;
  fxTlPaint();
};
async function fxFnSave(f, label) {
  const fr = f.fr.map(x => Math.round(x * 1000) / 1000), sig = `${f.range}|${f.n}|${fr.join(',')}`;
  try {
    const row = await upsertByKey('supply_functions', `fn_date=eq.${dsToday()}&sig=eq.${encodeURIComponent(sig)}`,
      { fn_date: dsToday(), kind: dsItemCtx ? dsItemCtx.kind : null, range_hours: f.range, repeats: f.n, fractions: fr, sig, label: label || null });
    fxFns = fxFns.filter(x => x.sig !== sig); fxFns.push(row || { range_hours: f.range, repeats: f.n, fractions: fr, sig, label });
  } catch (e) { console.warn('function not saved', e); }
}

/* ---------- timeline ---------- */
function fxTlPaint() {
  const c = dsItemCtx, box = document.getElementById('dsi_tl'); if (!c || !c.f || !box) return;
  const f = c.f, R = f.range, A = f.asOf != null ? f.asOf : fxNow();
  const note = document.getElementById('dsi_asnote');
  if (note) note.textContent = f.asOf != null ? `ثابت من: ${fxClock(f.asOf)}${fxNewDay(f.asOf, fxNow()) ? ' · ' + fxWd(f.asOf) : ''}` : 'فاضي: هيتحسب من وقت الـ Save (المعاينة بالوقت الحالي)';
  if (!(R > 0)) { box.innerHTML = '<div style="font-size:11px;color:#64748b">اكتب الـ Range بالساعات عشان يظهر التايم لاين.</div>'; return; }
  if (!f.fr || f.fr.length !== f.n) f.fr = fxEven(f.n);
  const span = R * 36e5, end = A + span, ops = fxOpens(A, R, f.fr);
  box.innerHTML = `<div class="ds-t2" dir="ltr"><div class="ds-t2-line"></div><i class="ds-t2-cap" style="left:0"></i><i class="ds-t2-cap" style="left:100%"></i>${ops.map((o, i) =>
      `<div class="ds-t2-p" style="left:${f.fr[i] * 100}%"><i class="ds-t2-d" data-i="${i}"></i><div class="ds-t2-l${i % 2 ? ' lo' : ''}">${fxLabel(o, A)}</div></div>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:11px;color:#94a3b8;margin-top:2px">
      <span>يبدأ: ${fxClock(A)}</span>
      <span>اسحب أي نقطة تحركها</span>
      <span>ينتهي الرينج: ${fxClock(end)}${fxNewDay(end, A) ? ' · يوم جديد (' + fxWd(end) + ')' : ''}</span></div>
    ${f.fr.some((x, i) => Math.abs(x - fxEven(f.n)[i]) > 0.0005) ? '<button type="button" class="ds-b ghost" style="margin-top:6px" onclick="fxEvenReset()">توزيع متساوي</button>' : ''}`;
  box.querySelectorAll('.ds-t2-d').forEach(d => {
    const i = +d.dataset.i; let drag = false;
    d.onpointerdown = e => { drag = true; d.setPointerCapture(e.pointerId); e.preventDefault(); };
    d.onpointermove = e => {
      if (!drag) return;
      const r = box.querySelector('.ds-t2').getBoundingClientRect();
      const fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      let ms = Math.round((A + fx * span) / 3e5) * 3e5;
      const lo = i ? ops[i - 1] + 3e5 : A, hi = i < ops.length - 1 ? ops[i + 1] - 3e5 : end;
      if (lo > hi) return;
      ms = Math.max(lo, Math.min(hi, ms));
      ops[i] = ms; f.fr[i] = (ms - A) / span;
      const p = d.parentElement; p.style.left = (f.fr[i] * 100) + '%'; p.querySelector('.ds-t2-l').innerHTML = fxLabel(ms, A);
    };
    d.onpointerup = d.onpointercancel = () => { if (drag) { drag = false; fxTlPaint(); } };
  });
}
window.fxEvenReset = () => { const c = dsItemCtx; if (c && c.f) { c.f.fr = null; fxTlPaint(); } };

/* ---------- form events ---------- */
window.dsFormChange = function () {
  const c = dsItemCtx; if (!c || !c.f) return; const f = c.f;
  const R = parseFloat(document.getElementById('dsi_range').value) || 0;
  const n = +document.getElementById('dsi_rep').value || 1;
  const a = fxFromWall(document.getElementById('dsi_asof').value);
  f.asOf = Number.isFinite(a) ? a : null;
  if (n !== f.n) f.fr = null;          // new count -> even spread again; a new range keeps the dragged shape
  f.range = R; f.n = n;
  fxTlPaint();
};
window.fxAsNow = function () {
  const c = dsItemCtx; if (!c || !c.f) return;
  c.f.asOf = fxNow();
  document.getElementById('dsi_asof').value = fxWall(c.f.asOf).slice(0, 16);
  fxTlPaint();
};
window.fxAsClear = function () {
  const c = dsItemCtx; if (!c || !c.f) return;
  c.f.asOf = null; document.getElementById('dsi_asof').value = '';
  fxTlPaint();
};
window.dsApplyBox = () => { const b = document.getElementById('dsi_apply'); if (b) b.style.display = b.style.display === 'none' ? 'block' : 'none'; };
window.dsApplyToggle = (key, on) => { const s = dsItemCtx.f.apply; on ? s.add(key) : s.delete(key); };
window.dsApplyAll = on => document.querySelectorAll('#dsi_apply input[data-k]').forEach(i => { i.checked = on; dsApplyToggle(i.dataset.k, on); });

/* load today's functions whenever the Tasks / Dandana popup opens */
(function () {
  const orig = window.dsOpenItems;
  window.dsOpenItems = function (idx, kind) {
    orig(idx, kind);
    fxFnLoad().then(fxFnStripPaint);
  };
})();

/* ---------- render (overrides the older versions) ---------- */
function dsItemsRender() {
  const c = dsItemCtx, cfg = DS_ITEM_CFG[c.kind], st = supplyState.students[c.idx];
  const have = dsItemsOf(st, c.date, c.kind);
  const others = ['task', 'dandana'].flatMap(k => dsItemsOf(st, c.date, k).filter(x => !(k === c.kind && x.item_no === c.open)));
  const slots = [];
  for (let n = 1; n <= 10; n++) {
    const it = have.find(x => x.item_no === n);
    if (c.open === n) {
      slots.push(`<div class="ds-form">
        <div style="display:flex;align-items:center;gap:8px"><span class="ds-no">${n}</span><b style="color:#fbbf24;font-size:13px">${esc(cfg.title)} ${n}</b></div>
        ${cfg.fields.map(f => `<div><span class="ds-lbl">${esc(f.l)}</span>
          ${f.rows > 1 ? `<textarea id="dsi_${f.k}" rows="${f.rows}" dir="${f.dir}" spellcheck="true" class="ds-in" placeholder="${esc(f.ph)}"></textarea>`
                       : `<input id="dsi_${f.k}" dir="${f.dir}" spellcheck="true" class="ds-in" placeholder="${esc(f.ph)}">`}</div>`).join('')}
        ${c.kind === 'task' ? `<div><span class="ds-lbl">Priority · الأهمية</span><select id="dsi_pri" class="ds-in" style="width:auto"><option value="normal">Normal</option><option value="high">High priority (Urgent)</option></select></div>` : ''}

        <div class="ds-fx">
          <div class="ds-fx-h"><i class="fa-solid fa-sliders"></i> Functionality · طريقة العمل</div>
          <div id="dsi_fns"></div>
          <div><span class="ds-lbl">1) Range · المدى بالساعات</span>
            <input id="dsi_range" type="number" min="0.5" max="720" step="0.5" inputmode="decimal" class="ds-in" style="max-width:200px" placeholder="مثال: 12" oninput="dsFormChange()"></div>
          <div><span class="ds-lbl">2) عدد مرات التكرار (1–5)</span>
            <select id="dsi_rep" class="ds-in" style="width:auto" onchange="dsFormChange()">${[1, 2, 3, 4, 5].map(r => `<option value="${r}">${r}</option>`).join('')}</select></div>
          <div><span class="ds-lbl">3) As of · منذ</span>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <input id="dsi_asof" type="datetime-local" class="ds-in" style="width:auto" oninput="dsFormChange()" onchange="dsFormChange()">
              <button type="button" class="ds-b blue" onclick="fxAsNow()">Now</button>
              <button type="button" class="ds-b ghost" onclick="fxAsClear()">مسح</button></div>
            <div id="dsi_asnote" style="font-size:11px;color:#94a3b8;margin-top:4px"></div></div>
          <div id="dsi_tl"></div>
          ${others.length ? `<div><button type="button" class="ds-b ghost" onclick="dsApplyBox()">Apply to · طبّق على…</button>
            <div id="dsi_apply" style="display:none;margin-top:8px">
              <label style="display:flex;gap:8px;align-items:center;font-size:12px;margin-bottom:6px"><input type="checkbox" onchange="dsApplyAll(this.checked)"> الكل</label>
              ${others.map(o => `<label style="display:flex;gap:8px;align-items:center;font-size:12px;margin-bottom:4px"><input type="checkbox" data-k="${o.kind}:${o.item_no}" onchange="dsApplyToggle(this.dataset.k,this.checked)">
                <span class="ds-tag">${o.kind === 'task' ? 'Task' : 'دندنة'} ${o.item_no}</span><span dir="auto" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.title || (o.body || '').split('\n')[0] || '—')}</span></label>`).join('')}
              <div style="font-size:10px;color:#64748b">بيتنسخ الرينج وعدد التكرار وشكل التوزيع. الـ As of بتاع كل واحدة بيفضل بتاعها، ولو مالهاش بياخد الـ As of بتاعك.</div></div></div>` : ''}
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="ds-b green" onclick="dsItemSave(${n})">Save</button>
          <button type="button" class="ds-b ghost" onclick="dsItemOpen(null)">إلغاء</button>
          ${it ? `<button type="button" class="ds-b red" onclick="dsItemDelete(${n})">حذف</button>` : ''}</div></div>`);
    } else if (it) {
      slots.push(`<div class="ds-slot saved"><span class="ds-no">${n}</span>
        <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" dir="auto">${esc(it.title || (it.body || '').split('\n')[0] || '—')}</div>
        ${it.badge ? `<div style="font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" dir="auto">${esc(String(it.badge).split('\n')[0])}</div>` : ''}</div>
        ${it.priority === 'high' ? '<span class="ds-tag" style="background:#be123c;color:#fff">HIGH</span>' : ''}${it.range_hours != null ? `<span class="ds-tag">${esc(it.range_hours)}h</span>` : ''}<span class="ds-tag">×${it.repeats}</span><span class="ds-tag" style="color:#34d399">Done</span>
        <button type="button" class="ds-b amber" onclick="dsItemOpen(${n})">تعديل</button></div>`);
    } else {
      slots.push(`<button type="button" class="ds-slot" style="color:#64748b;width:100%;text-align:start" onclick="dsItemOpen(${n})"><span class="ds-no" style="color:#64748b">${n}</span> + فاضي</button>`);
    }
  }
  c.ov.innerHTML = `<div class="ds-box">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <b style="color:#fbbf24;font-size:15px">${esc(cfg.title)} · ${esc(st.trainee || st.name || '')} · ${esc(c.date)}</b>
      <button type="button" class="ds-b ghost" onclick="dsCloseItems()">إغلاق</button></div>
    <div style="display:flex;flex-direction:column;gap:8px">${slots.join('')}</div></div>`;
  if (c.open) {
    const it = have.find(x => x.item_no === c.open) || {};
    cfg.fields.forEach(f => { document.getElementById('dsi_' + f.k).value = it[f.k] || ''; });
    const pri = document.getElementById('dsi_pri'); if (pri) pri.value = it.priority || 'normal';
    document.getElementById('dsi_range').value = c.f.range || '';
    document.getElementById('dsi_rep').value = c.f.n;
    document.getElementById('dsi_asof').value = c.f.asOf != null ? fxWall(c.f.asOf).slice(0, 16) : '';
    fxTlPaint(); fxFnStripPaint();
    const first = document.getElementById('dsi_' + cfg.fields[0].k);
    if (first) setTimeout(() => first.focus(), 30);
  }
}

window.dsItemOpen = function (n) {
  const c = dsItemCtx; c.open = n;
  if (n) {
    const st = supplyState.students[c.idx], it = dsItemsOf(st, c.date, c.kind).find(x => x.item_no === n) || {};
    const reps = it.repeats || 1, A = fxFromWall(it.as_of), hasRange = it.range_hours != null, fr = hasRange ? fxFracs(it) : null;
    c.f = { range: hasRange ? +it.range_hours : 0, n: reps, asOf: hasRange && Number.isFinite(A) ? A : null,
            fr: fr && fr.length === reps ? fr : null, apply: new Set() };
  }
  dsItemsRender();
};

/* ---------- save ---------- */
window.dsItemSave = async function (n) {
  const c = dsItemCtx, cfg = DS_ITEM_CFG[c.kind], st = supplyState.students[c.idx];
  dsFormChange();
  const f = c.f;
  const body = { trainee_id: st.id, supply_date: c.date, kind: c.kind, item_no: n, updated_at: new Date().toISOString() };
  cfg.fields.forEach(x => { body[x.k] = document.getElementById('dsi_' + x.k).value.trim() || null; });
  const pri = document.getElementById('dsi_pri'); if (pri) body.priority = pri.value;
  if (!body.title && !body.body) { showToast('اكتب الاسم أو الوصف الأول', true, true); return; }
  if (!(f.range > 0)) { showToast('اختار الـ Range (عدد الساعات) الأول', true, true); document.getElementById('dsi_range').focus(); return; }
  if (!f.fr || f.fr.length !== f.n) f.fr = fxEven(f.n);
  const A = f.asOf != null ? f.asOf : fxNow();           // empty As of = the moment of Save
  const timing = { repeats: f.n, range_hours: f.range, as_of: fxWall(A), opens_at: fxOpens(A, f.range, f.fr).map(fxWall) };
  Object.assign(body, timing);
  try {
    const row = await upsertByKey('supply_items', `${dsKey(st, c.date)}&kind=eq.${c.kind}&item_no=eq.${n}`, body);
    supplyState.items = supplyState.items.filter(i => !(String(i.trainee_id) === String(st.id) && i.supply_date === c.date && i.kind === c.kind && i.item_no === n));
    supplyState.items.push(row || body);
    await fxFnSave(f, body.title);
    let applied = 0;
    for (const key of f.apply) {
      const [k, no] = key.split(':');
      const tgt = dsItemsOf(st, c.date, k).find(x => x.item_no === +no), tA0 = tgt ? fxFromWall(tgt.as_of) : NaN, tA = Number.isFinite(tA0) ? tA0 : A;
      const shared = { repeats: f.n, range_hours: f.range, as_of: fxWall(tA), opens_at: fxOpens(tA, f.range, f.fr).map(fxWall), updated_at: body.updated_at };
      try {
        const r = await (await sbFetch(`supply_items?${dsKey(st, c.date)}&kind=eq.${k}&item_no=eq.${+no}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(shared) })).json();
        if (Array.isArray(r) && r[0]) {
          supplyState.items = supplyState.items.filter(i => !(String(i.trainee_id) === String(st.id) && i.supply_date === c.date && i.kind === k && i.item_no === +no));
          supplyState.items.push(r[0]); applied++;
        }
      } catch (e) { showToast('فشل التطبيق على ' + key + ': ' + e.message, true); }
    }
    c.open = null;
    dsItemsRender();
    showToast(`اتحفظ ${cfg.title} ${n} ✓` + (applied ? ` · واتطبّق على ${applied}` : ''));
  } catch (e) { showToast('فشل الحفظ: ' + e.message, true); }
};

/* ==========================================================
   Patch 2 (paste at the END of adminpanel.js, AFTER patch 1)
   A "Function" button next to Edit on every saved Task / Dandana:
   shows the function as it was set, and "Apply to" copies it to the
   other tasks / dandana of the same trainee on the same day.
   ========================================================== */

/* ---------- Function button next to Edit ---------- */
const fxPrevRender = dsItemsRender;
dsItemsRender = function () {
  fxPrevRender();
  const c = dsItemCtx; if (!c) return;
  c.ov.querySelectorAll('.ds-slot.saved').forEach(row => {
    if (row.querySelector('[data-fx]')) return;
    const no = +((row.querySelector('.ds-no') || {}).textContent);
    const edit = row.querySelector('button.amber');
    if (!no || !edit) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ds-b blue'; b.dataset.fx = '1'; b.textContent = 'Function';
    b.onclick = () => fxFnView(no);
    row.insertBefore(b, edit);
  });
};

/* ---------- read-only timeline ---------- */
function fxTlStatic(A, R, fr) {
  const span = R * 36e5, end = A + span, ops = fxOpens(A, R, fr);
  return `<div class="ds-t2" dir="ltr"><div class="ds-t2-line"></div><i class="ds-t2-cap" style="left:0"></i><i class="ds-t2-cap" style="left:100%"></i>${ops.map((o, i) =>
      `<div class="ds-t2-p" style="left:${fr[i] * 100}%"><i class="ds-t2-d" style="cursor:default"></i><div class="ds-t2-l${i % 2 ? ' lo' : ''}">${fxLabel(o, A)}</div></div>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:11px;color:#94a3b8;margin-top:2px">
      <span>يبدأ: ${fxClock(A)}${fxNewDay(A, fxNow()) ? ' · ' + fxWd(A) : ''}</span>
      <span>ينتهي الرينج: ${fxClock(end)}${fxNewDay(end, A) ? ' · يوم جديد (' + fxWd(end) + ')' : ''}</span></div>`;
}

/* ---------- copy one item's function to others ---------- */
async function fxApplyFn(st, date, src, keys) {
  const A = fxFromWall(src.as_of), R = +src.range_hours, fr = fxFracs(src);
  if (!fr || !(R > 0) || !Number.isFinite(A)) { showToast('الفانكشن دي مش كاملة، افتح تعديل واعمل Save الأول', true, true); return 0; }
  let ok = 0;
  for (const key of keys) {
    const [k, no] = key.split(':');
    const tgt = dsItemsOf(st, date, k).find(x => x.item_no === +no);
    const t0 = tgt ? fxFromWall(tgt.as_of) : NaN, tA = Number.isFinite(t0) ? t0 : A;     // each item keeps its own As of
    const body = { repeats: src.repeats, range_hours: R, as_of: fxWall(tA), opens_at: fxOpens(tA, R, fr).map(fxWall), updated_at: new Date().toISOString() };
    try {
      const r = await (await sbFetch(`supply_items?${dsKey(st, date)}&kind=eq.${k}&item_no=eq.${+no}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(body) })).json();
      if (Array.isArray(r) && r[0]) {
        supplyState.items = supplyState.items.filter(i => !(String(i.trainee_id) === String(st.id) && i.supply_date === date && i.kind === k && i.item_no === +no));
        supplyState.items.push(r[0]); ok++;
      }
    } catch (e) { showToast('فشل التطبيق على ' + key + ': ' + e.message, true); }
  }
  return ok;
}

/* ---------- the Function popup ---------- */
window.fxFnClose = function () { if (window.__fxOv) { window.__fxOv.remove(); window.__fxOv = null; } };
window.fxFnView = function (no) {
  const c = dsItemCtx; if (!c) return;
  const st = supplyState.students[c.idx], it = dsItemsOf(st, c.date, c.kind).find(x => x.item_no === no); if (!it) return;
  fxFnClose();
  const others = ['task', 'dandana'].flatMap(k => dsItemsOf(st, c.date, k).filter(x => !(k === c.kind && x.item_no === no)));
  const A = fxFromWall(it.as_of), R = +it.range_hours, fr = it.range_hours != null ? fxFracs(it) : null;
  const ov = document.createElement('div'); ov.className = 'ds-ov';
  ov.addEventListener('mousedown', e => { if (e.target === ov) fxFnClose(); });
  const head = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
      <b style="color:#fbbf24;font-size:14px" dir="auto">Function · ${esc(it.title || (it.body || '').split('\n')[0] || ('#' + no))}</b>
      <button type="button" class="ds-b ghost" onclick="fxFnClose()">إغلاق</button></div>`;
  let body;
  if (!fr) {
    body = '<div class="tha-note" style="padding:14px">العنصر ده مالوش فانكشن (اتسجل بالنظام القديم). افتح تعديل، اختار Range، واعمل Save.</div>';
  } else {
    body = `<div class="ds-fx">
        <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="ds-tag">Range ${esc(R)}h</span><span class="ds-tag">×${esc(it.repeats)}</span><span class="ds-tag">As of ${esc(fxClock(A))}</span></div>
        ${fxTlStatic(A, R, fr)}
      </div>
      ${others.length ? `<div class="ds-fx" style="margin-top:10px">
        <div class="ds-fx-h">Apply to · طبّق الفانكشن دي على</div>
        <label style="display:flex;gap:8px;align-items:center;font-size:12px"><input type="checkbox" id="fxAll"> الكل</label>
        ${others.map(o => `<label style="display:flex;gap:8px;align-items:center;font-size:12px"><input type="checkbox" class="fxPick" data-k="${o.kind}:${o.item_no}">
          <span class="ds-tag">${o.kind === 'task' ? 'Task' : 'دندنة'} ${o.item_no}</span><span dir="auto" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.title || (o.body || '').split('\n')[0] || '—')}</span>
          ${o.range_hours != null ? `<span class="ds-tag">${esc(o.range_hours)}h ×${esc(o.repeats)}</span>` : ''}</label>`).join('')}
        <div style="font-size:10px;color:#64748b">بيتنسخ الرينج وعدد التكرار وشكل التوزيع. الـ As of بتاع كل واحدة بيفضل بتاعها، ولو مالهاش بياخد As of العنصر ده.</div>
        <div><button type="button" class="ds-b green" id="fxApplyBtn">Apply to</button></div></div>`
      : '<div style="font-size:11px;color:#64748b;margin-top:10px">مفيش تاسكس أو دندنات تانية عند الطالب ده في اليوم ده عشان تطبّق عليها.</div>'}`;
  }
  ov.innerHTML = `<div class="ds-box" style="max-width:760px;margin-top:6vh">${head}${body}</div>`;
  document.body.appendChild(ov); window.__fxOv = ov;
  const all = ov.querySelector('#fxAll');
  if (all) all.onchange = () => ov.querySelectorAll('.fxPick').forEach(i => { i.checked = all.checked; });
  const btn = ov.querySelector('#fxApplyBtn');
  if (btn) btn.onclick = async () => {
    const keys = [...ov.querySelectorAll('.fxPick:checked')].map(i => i.dataset.k);
    if (!keys.length) { showToast('اختار عنصر واحد على الأقل', true, true); return; }
    btn.disabled = true;
    const n = await fxApplyFn(st, c.date, it, keys);
    fxFnClose();
    if (dsItemCtx) dsItemsRender();
    if (n) showToast(`اتطبّقت الفانكشن على ${n} ✓`);
  };
};

/* ==========================================================
   Patch 3: windows workspace (paste at the END of adminpanel.js)
   - every launcher button opens its own widget, side by side; you close each one yourself
   - Dashboard window: trainee cards always selectable; bulk Notification / Task / Monthly obligations
   - Notification, Task, Monthly obligations, Profile and DS open as windows too
   ========================================================== */
(function () {
  if (document.getElementById('wsCss')) return;
  const s = document.createElement('style'); s.id = 'wsCss';
  s.textContent = `
#adminPanel.ws-wide{max-width:98vw!important;width:98vw}
.ws-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;padding:8px;border:1px solid #1e293b;border-radius:14px;background:#0b1220}
.ws-lb{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;border:1px solid #475569;color:#e2e8f0;font-weight:700;font-size:13px;background:transparent}
.ws-lb:hover{border-color:#fbbf24}.ws-lb.on{background:#f59e0b;border-color:#f59e0b;color:#0f172a}
.ws-row{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap}
.ws-w{flex:1 1 380px;min-width:min(340px,100%);max-width:100%;border:1px solid rgba(245,158,11,.4);border-radius:14px;background:#0f172a;overflow:hidden;display:flex;flex-direction:column}
.ws-w.ws-2{flex:2 1 620px}.ws-w.ws-3{flex:1 1 100%}
.ws-h{display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(245,158,11,.12);border-bottom:1px solid rgba(148,163,184,.25);color:#fbbf24;font-size:13px}
.ws-x{width:26px;height:26px;border-radius:8px;border:1px solid rgba(148,163,184,.4);color:#e2e8f0;font-size:11px}
.ws-x:hover{border-color:#f59e0b}
.ws-bd{padding:10px;overflow:auto;max-height:78vh}
.ws-w.ws-fold .ws-bd{display:none}
.ws-sep{width:1px;height:22px;background:#334155;margin:0 4px}
.ws-nm{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}`;
  document.head.appendChild(s);
})();

const WSD = {
  dash: { t: 'Dashboard · الطلاب', i: 'fa-gauge-high', w: 2 },
  arc: { t: 'Archive · الأرشيف', i: 'fa-box-archive', w: 2 },
  rep: { t: 'Reports · البلاغات', i: 'fa-flag', w: 1 },
  voi: { t: 'Upload voices', i: 'fa-cloud-arrow-up', w: 1 },
  nt: { t: 'إشعار', i: 'fa-bell', w: 1 },
  tk: { t: 'Task', i: 'fa-list-check', w: 1 },
  mo: { t: 'Monthly obligations', i: 'fa-calendar-check', w: 1 },
  prof: { t: 'Profile', i: 'fa-id-card', w: 2 },
  ds: { t: 'Daily Supply', i: 'fa-pen-to-square', w: 3 }
};
const WS_REFRESH = { dash: 1, arc: 1, rep: 1, voi: 1 };
const WSE = {};
let tkCur = null, moCur = null;

function wsEnsure(k) {
  if (WSE[k]) return WSE[k];
  const d = WSD[k], el = document.createElement('section');
  el.className = 'ws-w ws-' + d.w; el.id = 'ws_' + k;
  const rf = WS_REFRESH[k] ? '<button type="button" class="ws-x" data-rf title="تحديث"><i class="fa-solid fa-rotate"></i></button>' : '';
  el.innerHTML = `<div class="ws-h"><i class="fa-solid ${d.i}"></i><b data-wt>${esc(d.t)}</b><span style="flex:1"></span>${rf}<button type="button" class="ws-x" data-fold title="طي / فتح"><i class="fa-solid fa-chevron-up"></i></button><button type="button" class="ws-x" data-cls title="إغلاق"><i class="fa-solid fa-xmark"></i></button></div><div class="ws-bd"></div>`;
  el.querySelector('[data-cls]').onclick = () => closeWin(k);
  el.querySelector('[data-fold]').onclick = () => el.classList.toggle('ws-fold');
  const r = el.querySelector('[data-rf]'); if (r) r.onclick = () => wsLoad(k);
  $id('adminWs').appendChild(el);
  return (WSE[k] = { el, body: el.querySelector('.ws-bd'), loaded: false });
}
function wsTitle(k, t) { wsEnsure(k).el.querySelector('[data-wt]').textContent = t; }
function wsLoad(k) {
  const w = WSE[k]; if (!w) return;
  if (k === 'dash') return renderMasterProfilesIn(w.body);
  if (k === 'arc') return renderArchiveIn(w.body);
  if (k === 'rep') {
    const v = $id('adminViewReports');
    if (v) { if (v.parentNode !== w.body) w.body.appendChild(v); v.style.display = 'block'; }
    return loadReportsList();
  }
  if (k === 'voi') {
    const v = $id('adminViewVoices');
    if (v) { if (v.parentNode !== w.body) w.body.appendChild(v); v.style.display = 'block'; }
    return refreshWordLists();
  }
}
function openWin(k) {
  const w = wsEnsure(k);
  w.el.style.display = ''; w.el.classList.remove('ws-fold');
  document.querySelectorAll('.ws-lb[data-ws="' + k + '"]').forEach(b => b.classList.add('on'));
  if (!w.loaded && WS_REFRESH[k]) { w.loaded = true; wsLoad(k); }
  setTimeout(() => { try { w.el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { } }, 60);
  return w;
}
function closeWin(k) {
  const w = WSE[k]; if (!w) return;
  w.el.style.display = 'none';
  document.querySelectorAll('.ws-lb[data-ws="' + k + '"]').forEach(b => b.classList.remove('on'));
  if (k === 'nt') ntCur = null;
  if (k === 'prof') mpCur = null;
  if (k === 'ds') dsStu = null;
  if (k === 'tk') tkCur = null;
  if (k === 'mo') moCur = null;
}
window.openWin = openWin; window.closeWin = closeWin;
window.toggleWin = function (k) { const w = WSE[k]; if (w && w.el.style.display !== 'none') closeWin(k); else openWin(k); };

showAdminView = function (v) {
  if (v === 'home') { if (!Object.keys(WSE).some(k => WSE[k].el.style.display !== 'none')) openWin('dash'); return; }
  const m = { dashboardMain: 'dash', voices: 'voi', reports: 'rep', archive: 'arc' };
  if (m[v]) openWin(m[v]);
};
openAdminMainPanel = function () {
  const o = $id('adminModalOverlay'); if (o) o.classList.add('open');
  const p = $id('adminPanel'); if (p) p.classList.add('ws-wide');
  showAdminView('home');
};

/* ---------- Dashboard window: trainee list (always selectable) ---------- */
async function renderMasterProfilesIn(sub) {
  sub.innerHTML = '<div class="text-center py-6 text-amber-400">جاري تحميل الطلبة...</div>';
  try {
    const j = await (await sbFetch(`${PROFILES_TABLE}?select=*&order=trainee.asc`)).json();
    mpState.list = Array.isArray(j) ? j : [];
  } catch (e) {
    sub.innerHTML = `<div class="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm">تعذر التحميل: ${esc(e.message)}</div>`;
    return;
  }
  mpState.q = ''; mpState.selecting = true;
  sub.innerHTML = `<div class="flex flex-col gap-3">
      <input id="mpSearch" placeholder="ابحث بالاسم..." class="${INPUT_CLS}" style="width:100%;font-size:13px;padding:6px 10px" oninput="mpSearch(this.value)">
      <div class="flex items-center gap-2 flex-wrap" id="mpBar"></div>
      <div class="mp-grid" id="mpGrid"></div></div>`;
  mpPaintList();
}
window.mpClearSel = function () { mpState.sel.clear(); mpPaintList(); };
mpPaintBar = function () {
  const b = $id('mpBar'); if (!b) return;
  const n = mpState.sel.size, one = n === 1 ? [...mpState.sel][0] : null;
  const btn = (cls, fn, ic, txt, on) => `<button type="button" class="ds-b ${cls}" ${on ? '' : 'disabled'} onclick="${fn}"><i class="fa-solid ${ic}"></i> ${txt}</button>`;
  b.innerHTML = btn('ghost', 'mpSelectAll()', 'fa-square-check', 'تحديد الكل', true)
    + (n ? btn('ghost', 'mpClearSel()', 'fa-xmark', 'إلغاء', true) : '')
    + `<span class="text-xs text-slate-400">${n} محدد</span><span class="ws-sep"></span>`
    + btn('blue', 'openNotifyMany()', 'fa-bell', 'إشعار', n)
    + btn('blue', 'openBulkTask()', 'fa-list-check', 'Task', n)
    + btn('amber', 'openMonthly()', 'fa-calendar-check', 'Monthly obligations', n)
    + (one ? '<span class="ws-sep"></span>' + btn('green', `openStudentDashboard('${esc(one)}')`, 'fa-eye', 'Dashboard', 1) + btn('amber', `mpOpen('${esc(one)}')`, 'fa-id-card', 'Profile', 1) + btn('ghost', `openStudentSupply('${esc(one)}')`, 'fa-pen-to-square', 'DS', 1) : '');
};

/* ---------- Archive window ---------- */
async function renderArchiveIn(sub) {
  sub.innerHTML = '<div class="text-center py-6 text-amber-400">جاري تحميل الأرشيف...</div>';
  let students = [];
  try { students = await fetchStudentsFromSupabase(); } catch (e) { }
  const opts = students.map(st => `<option value="${esc(st.id)}">${esc(st.trainee || st.name || '')}</option>`).join('');
  const lab = 'text-xs flex flex-col gap-1';
  sub.innerHTML = `<div class="flex flex-col gap-3">
      <div class="tha-btns">
        <button type="button" class="tha-b blue" onclick="archiveQuick('today')">اليوم</button>
        <button type="button" class="tha-b blue" onclick="archiveQuick('week')">هذا الأسبوع</button>
        <button type="button" class="tha-b blue" onclick="archiveQuick('month')">هذا الشهر</button>
        <button type="button" class="tha-b blue" onclick="archiveQuick('year')">هذه السنة</button>
        <button type="button" class="tha-b blue" onclick="archiveQuick('all')">الكل</button></div>
      <div class="flex flex-wrap gap-3 items-end">
        <label class="${lab}">من <input type="date" id="arcFrom" class="${INPUT_CLS}"></label>
        <label class="${lab}">إلى <input type="date" id="arcTo" class="${INPUT_CLS}"></label>
        <label class="${lab}">شهر معين <input type="month" id="arcMonth" onchange="archiveMonthPicked(this.value)" class="${INPUT_CLS}"></label>
        <label class="${lab}">الطالب <select id="arcStudent" class="${INPUT_CLS}"><option value="">الكل</option>${opts}</select></label>
        <button type="button" class="tha-b" onclick="loadArchive()"><i class="fa-solid fa-magnifying-glass"></i> عرض</button>
        <button type="button" class="tha-b gray" onclick="exportArchiveCsv()"><i class="fa-solid fa-file-csv"></i> تصدير CSV</button></div>
      <div id="arcInfo" class="tha-note"></div>
      <div id="arcResult" class="overflow-x-auto border border-slate-700 rounded-xl" style="max-height:60vh"></div></div>`;
  archiveQuick('week');
}

/* ---------- shared schedule fields (Range / repeats / As of) ---------- */
function fxSched(p) {
  const R = parseFloat($id(p + 'Range').value) || 0, n = +$id(p + 'Rep').value || 1, a = fxFromWall($id(p + 'AsOf').value);
  const A = Number.isFinite(a) ? a : fxNow(), fr = fxEven(n);
  return { R, n, A, opens: R > 0 ? fxOpens(A, R, fr) : [] };
}
window.schedPreview = function (p) {
  const el = $id(p + 'Prev'); if (!el) return;
  const s = fxSched(p);
  if (!(s.R > 0)) { el.textContent = 'اكتب الـ Range بالساعات عشان يظهر الجدول.'; return; }
  const end = s.A + s.R * 36e5, tag = o => fxClock(o) + (fxNewDay(o, s.A) ? ' (' + fxWd(o) + ')' : '');
  el.innerHTML = `يبدأ ${esc(fxClock(s.A))} · ينتهي ${esc(tag(end))}<br>مرات الفتح: ${s.opens.map(o => esc(tag(o))).join(' · ')}`;
};
window.schedNow = function (p) { $id(p + 'AsOf').value = fxWall(fxNow()).slice(0, 16); schedPreview(p); };
window.schedClear = function (p) { $id(p + 'AsOf').value = ''; schedPreview(p); };
const schedFields = (p, range, rep) => `
  <div><span class="ds-lbl">Range · المدى بالساعات</span><input id="${p}Range" type="number" min="0.5" max="720" step="0.5" inputmode="decimal" class="ds-in" style="max-width:200px" value="${range}" oninput="schedPreview('${p}')"></div>
  <div><span class="ds-lbl">عدد مرات التكرار (1–5)</span><select id="${p}Rep" class="ds-in" style="width:auto" onchange="schedPreview('${p}')">${[1, 2, 3, 4, 5].map(r => `<option value="${r}"${r === rep ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
  <div><span class="ds-lbl">As of · منذ (فاضي = وقت الإرسال)</span><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="${p}AsOf" type="datetime-local" class="ds-in" style="width:auto" oninput="schedPreview('${p}')" onchange="schedPreview('${p}')"><button type="button" class="ds-b blue" onclick="schedNow('${p}')">Now</button><button type="button" class="ds-b ghost" onclick="schedClear('${p}')">مسح</button></div></div>
  <div class="nt-prev" id="${p}Prev"></div>`;
const wsChips = st => `<div class="ws-nm">${st.map(s => `<span class="nt-chip" dir="auto">${esc(s.trainee || '')}</span>`).join('')}</div>`;
const wsPicked = ids => ids.map(id => mpState.list.find(x => String(x.id) === String(id))).filter(Boolean);
const PF_EMPTY = 'اضغط للكتابة (كبسولات، ترقيم، نقط...)';

/* ---------- Notification window ---------- */
ntClose = function () { closeWin('nt'); };
window.ntClose = ntClose;
openNotify = async function (ids) {
  const st = wsPicked(ids); if (!st.length) return;
  const single = st.length === 1;
  const w = wsEnsure('nt');
  wsTitle('nt', single ? 'إشعار · ' + (st[0].trainee || '') : 'إشعار · ' + st.length + ' طلاب');
  w.body.innerHTML = `${single ? '<div class="nt-feed" id="ntFeed"><div class="tha-note">جاري تحميل الفيد...</div></div>' : wsChips(st)}
    <div class="mp-sec"><h5>إشعار جديد</h5>
      <span class="ds-lbl">العنوان (اختياري)</span><input id="ntTitle" class="ds-in" maxlength="80" dir="auto">
      <span class="ds-lbl" style="margin-top:8px">الرسالة</span>
      <input type="hidden" id="ntBody">
      <div id="ntBody_pf" class="ds-pf empty" style="width:100%;box-sizing:border-box;min-height:44px;padding:10px" onclick="dsTextPop('ntBody','الرسالة')">${PF_EMPTY}</div>
      <div class="nt-prev" id="ntPrev" style="display:none" dir="auto"></div>
      <div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="ds-b green" id="ntSend" onclick="ntSend()"><i class="fa-solid fa-paper-plane"></i> إرسال${single ? '' : ' للكل (' + st.length + ')'}</button></div></div>
    ${single ? '<div class="mp-sec"><h5>آخر الإشعارات المبعوتة</h5><div id="ntSent" class="text-xs text-slate-500">...</div></div>' : ''}`;
  ntCur = { ov: w.el, ids: st.map(s => String(s.id)), single };
  openWin('nt');
  if (single) { ntFeedHtml(st[0]).then(h => { const f = $id('ntFeed'); if (f) f.innerHTML = h; }); ntLoadSent(); }
};

/* ---------- bulk Task window ---------- */
window.openBulkTask = function () {
  const st = wsPicked([...mpState.sel]); if (!st.length) return;
  const w = wsEnsure('tk');
  wsTitle('tk', 'Task · ' + st.length + (st.length === 1 ? ' طالب' : ' طلاب'));
  w.body.innerHTML = `${wsChips(st)}
    <div class="ds-form">
      <div><span class="ds-lbl">اسم التاسك</span><input id="tkTitle" class="ds-in" dir="auto" spellcheck="true" placeholder="مثال: Mix and Match"></div>
      <div><span class="ds-lbl">معلومة إضافية (بتظهر كوسم صغير)</span><input id="tkBadge" class="ds-in" dir="auto" placeholder="مثال: تمرين / عدد التكرار"></div>
      <div><span class="ds-lbl">الوصف (Description)</span><input type="hidden" id="tkBody"><div id="tkBody_pf" class="ds-pf empty" style="width:100%;box-sizing:border-box;min-height:44px;padding:10px" onclick="dsTextPop('tkBody','الوصف')">${PF_EMPTY}</div></div>
      <div><span class="ds-lbl">Priority · الأهمية</span><select id="tkPri" class="ds-in" style="width:auto"><option value="normal">Normal</option><option value="high">High priority (Urgent)</option></select></div>
      <div class="ds-fx"><div class="ds-fx-h"><i class="fa-solid fa-sliders"></i> Functionality · طريقة العمل</div>${schedFields('tk', 12, 1)}</div>
      <div><button type="button" class="ds-b green" id="tkSend" onclick="tkSend()"><i class="fa-solid fa-paper-plane"></i> ابعت التاسك لـ ${st.length}</button></div>
      <div style="font-size:10px;color:#64748b">بيتحط في أول خانة فاضية (1–10) عند كل طالب النهارده، وبياخد نفس الجدول الزمني.</div>
    </div>`;
  tkCur = { ids: st.map(s => String(s.id)), st };
  openWin('tk'); schedPreview('tk');
};
window.tkSend = async function () {
  const c = tkCur; if (!c) return;
  const title = $id('tkTitle').value.trim() || null, badge = $id('tkBadge').value.trim() || null, body = $id('tkBody').value.trim() || null;
  if (!title && !body) { showToast('اكتب اسم التاسك أو الوصف الأول', true, true); return; }
  const sc = fxSched('tk');
  if (!(sc.R > 0)) { showToast('اكتب الـ Range بالساعات الأول', true, true); return; }
  const btn = $id('tkSend'); btn.disabled = true;
  try {
    const today = dsToday();
    const have = await fetchAllRows(`supply_items?select=trainee_id,item_no&kind=eq.task&supply_date=eq.${today}&trainee_id=in.(${c.ids.map(enc).join(',')})`);
    const used = {}; have.forEach(r => { (used[String(r.trainee_id)] = used[String(r.trainee_id)] || new Set()).add(r.item_no); });
    const rows = [], skipped = [], now = new Date().toISOString(), pri = $id('tkPri').value;
    c.st.forEach(s => {
      const u = used[String(s.id)] || new Set(); let n = 1; while (n <= 10 && u.has(n)) n++;
      if (n > 10) { skipped.push(s.trainee || ''); return; }
      rows.push({ trainee_id: s.id, supply_date: today, kind: 'task', item_no: n, title, badge, body, priority: pri, repeats: sc.n, range_hours: sc.R, as_of: fxWall(sc.A), opens_at: sc.opens.map(fxWall), updated_at: now });
    });
    if (rows.length) await sbFetch('supply_items', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(rows) });
    showToast(`اتبعت التاسك لـ ${rows.length} طالب ✓` + (skipped.length ? ` · الخانات ممتلئة عند: ${skipped.join('، ')}` : ''), skipped.length > 0, true);
  } catch (e) { showToast('فشل إرسال التاسك: ' + e.message, true); }
  btn.disabled = false;
};

/* ---------- Monthly obligations window (high-priority timed notification) ---------- */
const MO_TITLE = 'التكليفات الشهرية · Monthly obligations';
const MO_BODY = `1. اختبار الإنجليزي EF SET | https://www.efset.org/

2. اختبار الشخصية 16 Personalities بالعربي | https://www.16personalities.com/ar

لازم تخلّص الاتنين في المهلة اللي قدامك، وابعت لي النتيجة أول ما تخلّص.`;
window.openMonthly = function () {
  const st = wsPicked([...mpState.sel]); if (!st.length) return;
  const w = wsEnsure('mo');
  wsTitle('mo', 'Monthly obligations · ' + st.length + (st.length === 1 ? ' طالب' : ' طلاب'));
  w.body.innerHTML = `${wsChips(st)}
    <div class="ds-form">
      <div class="ds-tag" style="align-self:flex-start;background:#be123c;color:#fff">HIGH PRIORITY · بيوصل في الإشعارات</div>
      <div><span class="ds-lbl">العنوان</span><input id="moTitle" class="ds-in" maxlength="80" dir="auto"></div>
      <div><span class="ds-lbl">الرسالة (تقدر تعدّلها)</span><input type="hidden" id="moBody"><div id="moBody_pf" class="ds-pf empty" style="width:100%;box-sizing:border-box;min-height:44px;padding:10px" onclick="dsTextPop('moBody','الرسالة')">${PF_EMPTY}</div></div>
      <div class="ds-fx"><div class="ds-fx-h"><i class="fa-solid fa-hourglass-half"></i> المهلة · التذكيرات</div>${schedFields('mo', 72, 3)}</div>
      <div><button type="button" class="ds-b amber" id="moSend" onclick="moSend()"><i class="fa-solid fa-paper-plane"></i> ابعت التكليفات لـ ${st.length}</button></div>
    </div>`;
  $id('moTitle').value = MO_TITLE; $id('moBody').value = MO_BODY; dsRefreshPf('moBody');
  moCur = { ids: st.map(s => String(s.id)), st };
  openWin('mo'); schedPreview('mo');
};
window.moSend = async function () {
  const c = moCur; if (!c) return;
  const title = $id('moTitle').value.trim() || MO_TITLE, body = $id('moBody').value.trim();
  if (!body) { showToast('الرسالة فاضية', true, true); return; }
  const sc = fxSched('mo');
  if (!(sc.R > 0)) { showToast('اكتب المهلة بالساعات الأول', true, true); return; }
  if (!confirm('تبعت التكليفات الشهرية لـ ' + c.st.length + ' طالب؟')) return;
  const btn = $id('moSend'); btn.disabled = true;
  const meta = { priority: 'high', obligation: 'monthly', range_hours: sc.R, repeats: sc.n, as_of: fxWall(sc.A), opens_at: sc.opens.map(fxWall), deadline: fxWall(sc.A + sc.R * 36e5) };
  try {
    await sbFetch('notifications', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(c.st.map(s => ({ trainee_id: s.id, kind: 'message', title, body, meta }))) });
    showToast(`اتبعتت التكليفات الشهرية لـ ${c.st.length} طالب ✓`);
  } catch (e) { showToast('فشل الإرسال: ' + e.message, true); }
  btn.disabled = false;
};

/* ---------- Profile window ---------- */
mpClose = function () { closeWin('prof'); };
window.mpClose = mpClose;
mpOpen = function (id) {
  const r = mpState.list.find(x => String(x.id) === String(id)); if (!r) return;
  const w = wsEnsure('prof'); wsTitle('prof', 'Profile · ' + (r.trainee || ''));
  const fieldHtml = ([k, type, label]) => type === 'date'
    ? `<div><span class="ds-lbl">${esc(label)}</span><input type="date" id="${mpId(k)}"></div>`
    : `<div><span class="ds-lbl">${esc(label)}</span><input type="hidden" id="${mpId(k)}"><div id="${mpId(k)}_pf" class="ds-pf empty" onclick="dsTextPop('${mpId(k)}','${esc(label)}')">اضغط للكتابة…</div></div>`;
  w.body.innerHTML = `<div style="display:flex;justify-content:flex-end"><button type="button" class="ds-b green" id="mpSaveBtn" onclick="mpSave()">Save</button></div>
    ${MP_SECTIONS.map(([t, fs]) => `<div class="mp-sec"><h5>${esc(t)}</h5><div class="mp-fields">${fs.map(fieldHtml).join('')}</div></div>`).join('')}
    <div class="text-slate-500" style="font-size:11px;margin-top:14px">id: ${esc(r.id)} · created: ${esc(String(r.created_at || '').slice(0, 10))} · updated: ${esc(String(r.updated_at || '').slice(0, 16).replace('T', ' '))}</div>`;
  mpCur = { ov: w.el, id };
  openWin('prof');
  MP_SECTIONS.forEach(([, fs]) => fs.forEach(([k, type]) => {
    const el = $id(mpId(k)); if (!el) return;
    el.value = r[k] == null ? '' : String(r[k]);
    if (type !== 'date') dsRefreshPf(mpId(k));
  }));
};

/* ---------- DS window ---------- */
closeStudentSupply = function () { closeWin('ds'); };
window.closeStudentSupply = closeStudentSupply;
openStudentSupply = async function (id) {
  const st = (mpState.list.find(x => String(x.id) === String(id))) || { id, trainee: '' };
  const today = dsToday(), dates = [0, 1, 2, 3].map(n => dsAddDays(today, -n));
  const w = wsEnsure('ds'); wsTitle('ds', 'DS · ' + (st.trainee || ''));
  w.body.innerHTML = '<div class="text-center py-6 text-amber-400">جاري التحميل...</div>';
  openWin('ds');
  dsStu = { ov: w.el, st, onKey: null, shown: dates.length, more: false };
  let data;
  try { data = await dsFetchRange(id, dates[dates.length - 1], today); }
  catch (e) { w.body.innerHTML = `<div class="p-4 text-rose-300 text-sm">تعذر التحميل: ${esc(e.message)}</div>`; return; }
  const range = { min: dsAddDays(today, -31), max: today };
  supplyState = { students: dates.map(() => st), records: data.records, range, parts: data.parts, items: data.items };
  dsStu.cols = dsCols(range, true); dsStu.today = today;
  w.body.innerHTML = `<div class="overflow-x-auto border border-slate-700 rounded-xl" style="max-height:70vh">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="bg-slate-950 text-amber-300 uppercase text-[10px] sticky top-0"><tr><th class="p-2">day</th>${dsStu.cols.map(c => `<th class="p-2">${esc(c.head)}</th>`).join('')}<th class="p-2">إجراء</th></tr></thead>
        <tbody id="dsStuBody">${dates.map((d, i) => dsRowHtml(i, dsDayLabel(d, i), dsStu.cols)).join('')}</tbody></table></div>
    <div style="text-align:center;margin-top:10px"><button type="button" id="dsMoreBtn" class="ds-b ghost" onclick="dsMore()">More · باقي الشهر</button></div>`;
  dates.forEach((d, i) => { dsEl('supply_date', i).value = d; dsLoadRow(i, d); });
};


/* ==========================================================
   Patch 4: manual "paid" status (paste at the END of adminpanel.js, after patch 3)
   basic_info.paid_month = 'YYYY-MM' of the month he paid (Cairo time). Paid = paid_month equals the
   current month, so it resets by itself next month. basic_info.paid_at = optional payment date.
   Marking paid sends ONE thank-you notification per trainee per month.
   ========================================================== */
const PAY_THANKS = 'شكرًا على دفع المستحقات الشهرية.';
const payMonth = () => dsToday().slice(0, 7);
const isPaid = r => !!r && r.paid_month === payMonth();

async function paySet(ids, paid, dateStr) {
  ids = ids.map(String); if (!ids.length) return;
  const month = payMonth();
  const body = paid
    ? { paid_month: month, paid_at: dateStr ? dateStr + 'T12:00:00Z' : new Date().toISOString(), updated_at: new Date().toISOString() }
    : { paid_month: null, paid_at: null, updated_at: new Date().toISOString() };
  let rows;
  try { rows = await mutate(`${PROFILES_TABLE}?id=in.(${ids.map(enc).join(',')})`, 'PATCH', body); }
  catch (e) { showToast('فشل تسجيل الدفع: ' + e.message + ' (شغّل 06_paid.sql لو لسه)', true); return; }
  rows.forEach(r => { const i = mpState.list.findIndex(x => String(x.id) === String(r.id)); if (i >= 0) mpState.list[i] = r; });
  mpPaintList();
  if (mpCur) payBoxPaint();
  if (!paid) { showToast('اتسجّل إنهم لم يدفعوا ✓'); return; }
  let sent = 0;
  try {
    const have = await fetchAllRows(`notifications?select=trainee_id&kind=eq.message&meta->>thanks_month=eq.${month}&trainee_id=in.(${ids.map(enc).join(',')})`);
    const got = new Set(have.map(r => String(r.trainee_id)));
    const out = rows.filter(r => !got.has(String(r.id))).map(r => ({ trainee_id: r.id, kind: 'message', title: 'شكرًا لك', body: PAY_THANKS, meta: { thanks_month: month } }));
    if (out.length) await sbFetch('notifications', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(out) });
    sent = out.length;
  } catch (e) { showToast('اتسجّل الدفع، بس رسالة الشكر ما اتبعتتش: ' + e.message, true, true); return; }
  showToast(`اتسجّل الدفع لـ ${rows.length} ✓` + (sent ? ` · وراح شكر لـ ${sent}` : ' · (الشكر اتبعت قبل كده الشهر ده)'));
}
window.payMark = function (id, paid) {
  const d = document.getElementById('payDate');
  paySet([id], paid, d && d.value ? d.value : '');
};
window.payMarkSel = function (paid) {
  const ids = [...mpState.sel]; if (!ids.length) return;
  if (!confirm((paid ? 'تسجّل إنهم دفعوا' : 'تسجّل إنهم لم يدفعوا') + ' (' + ids.length + ' طالب) عن شهر ' + payMonth() + '؟')) return;
  paySet(ids, paid, '');
};

/* trainee cards: paid students are never shown as late */
mpPaintList = function () {
  const g = document.getElementById('mpGrid'); if (!g) return;
  const today = dsToday();
  const rows = mpState.list.filter(r => !mpState.q || `${r.trainee || ''} ${r['preferred name'] || ''}`.toLowerCase().includes(mpState.q));
  g.innerHTML = rows.map(r => {
    const paid = isPaid(r), late = !paid && r.due_date && r.due_date < today;
    const ini = esc(String(r.trainee || '?').trim().charAt(0).toUpperCase());
    const on = mpState.sel.has(String(r.id));
    return `<div class="mp-card${mpState.selecting ? ' sel-mode' : ''}${on ? ' mp-sel' : ''}"${mpState.selecting ? ` onclick="mpToggleSel('${esc(r.id)}',event)"` : ''}>${mpState.selecting ? `<input type="checkbox" class="mp-ck" ${on ? 'checked' : ''} tabindex="-1">` : ''}
      <div class="mp-av">${r.most_recent_picture_url ? `<img src="${esc(r.most_recent_picture_url)}" alt="" onerror="this.remove()">` : ini}</div>
      <div class="mp-nm"><b dir="auto">${esc(r.trainee || '')}</b>
        <small dir="auto">${esc([r['preferred name'], r.subscription].filter(Boolean).join(' · '))}</small>
        <small class="${late ? 'mp-late' : ''}">${r.due_date ? 'Due ' + esc(r.due_date) + (late ? ' (متأخر)' : '') : ''}</small>
        <small style="color:${paid ? '#34d399' : '#94a3b8'}">${paid ? '✓ دفع ' + esc(payMonth()) : 'لم يدفع ' + esc(payMonth())}</small></div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:stretch">
        <button type="button" class="ds-cur" title="Insert Daily Supply" onclick="openStudentSupply('${esc(r.id)}')"><i class="ds-caret"></i>DS</button>
        <button type="button" class="ds-b amber" onclick="mpOpen('${esc(r.id)}')">Profile</button>
        <button type="button" class="ds-b blue" title="إشعار" onclick="openStudentNotify('${esc(r.id)}')"><i class="fa-solid fa-bell"></i> إشعار</button>
        <button type="button" class="ds-b green" title="Dashboard View" onclick="openStudentDashboard('${esc(r.id)}')"><i class="fa-solid fa-eye"></i> Dashboard</button></div></div>`;
  }).join('') || '<div class="tha-note">مفيش نتائج.</div>';
  mpPaintBar();
};

/* bulk bar: paid / not paid for the selected */
{
  const prevBar = mpPaintBar;
  mpPaintBar = function () {
    prevBar();
    const b = document.getElementById('mpBar'), n = mpState.sel.size; if (!b) return;
    b.insertAdjacentHTML('beforeend', '<span class="ws-sep"></span>'
      + `<button type="button" class="ds-b green" ${n ? '' : 'disabled'} onclick="payMarkSel(true)"><i class="fa-solid fa-circle-check"></i> دفع</button>`
      + `<button type="button" class="ds-b ghost" ${n ? '' : 'disabled'} onclick="payMarkSel(false)">لم يدفع</button>`);
  };
}

/* Profile window: payment section */
function payBoxPaint() {
  const box = document.getElementById('payBox'); if (!box || !mpCur) return;
  const r = mpState.list.find(x => String(x.id) === String(mpCur.id)); if (!r) return;
  const paid = isPaid(r), id = esc(r.id);
  box.innerHTML = `<h5>Payment · الدفع (${esc(payMonth())})</h5>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <span class="ds-tag" style="background:${paid ? '#059669' : '#be123c'};color:#fff">${paid ? 'دفع' + (r.paid_at ? ' · ' + esc(String(r.paid_at).slice(0, 10)) : '') : 'لم يدفع'}</span>
      ${paid ? `<button type="button" class="ds-b ghost" onclick="payMark('${id}',false)">إلغاء الدفع</button>`
             : `<input type="date" id="payDate" title="تاريخ الدفع (اختياري)"><button type="button" class="ds-b green" onclick="payMark('${id}',true)"><i class="fa-solid fa-circle-check"></i> تم الدفع</button>`}
    </div>
    <div style="font-size:10px;color:#64748b;margin-top:6px">التاريخ اختياري. بعد الدفع بيوصله إشعار شكر مرة واحدة، وبيرجع "لم يدفع" لوحده الشهر الجاي.</div>`;
}
{
  const prevOpen = mpOpen;
  mpOpen = function (id) {
    prevOpen(id);
    if (!mpCur) return;
    const w = WSE.prof; if (!w) return;
    const d = document.createElement('div'); d.className = 'mp-sec'; d.id = 'payBox';
    w.body.insertBefore(d, w.body.children[1] || null);
    payBoxPaint();
  };
}


/* ==========================================================
   Patch 5 (paste at the END of adminpanel.js, after patches 3 and 4)
   - trainee list grouped by status: Active on top, then Pending, Past, Terminated, each with a divider;
     inside each group the profiles you open most come first
   - new windows: Database (Supabase + Cloudflare) and Highlights (Financial / Attendance / Red flags)
   ========================================================== */
(function () {
  if (document.getElementById('p5Css')) return;
  const s = document.createElement('style'); s.id = 'p5Css';
  s.textContent = `.mp-card.mp-dim{opacity:.7}
.p5-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}
.p5-c{border:1px solid #1e293b;border-radius:14px;background:#0b1220;padding:12px}
.p5-c h6{font-size:12px;font-weight:800;color:#fbbf24;margin-bottom:8px}
.p5-r{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid #1e293b;font-size:12px}.p5-r:last-child{border:0}
.p5-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#64748b;margin-inline-end:6px}`;
  document.head.appendChild(s);
})();

/* ---------- status + open counts ---------- */
/* status_as_of_today (free text) -> group.
   Known: active / pending / paused / past / terminated (English or Arabic words).
   Empty = active. Anything else you type (e.g. "On hold") becomes its own group named exactly as you typed it. */
function mpStatusInfo(r) {
  const raw = String(r.status_as_of_today || '').trim(), s = raw.toLowerCase();
  if (!s) return { key: 'active', label: '' };
  if (/terminat|منته|ملغ|مفصول/.test(s)) return { key: 'terminated', label: raw };
  if (/paus|موقوف|متوقف|ايقاف|إيقاف|وقف/.test(s)) return { key: 'paused', label: raw };
  if (/past|سابق|قديم/.test(s)) return { key: 'past', label: raw };
  if (/pend|انتظار|منتظر|معلق/.test(s)) return { key: 'pending', label: raw };
  if (/^(active|نشط|شغال|شغّال|فعال|مفعل)/.test(s)) return { key: 'active', label: raw };
  return { key: 'x:' + s.replace(/\s+/g, ' '), label: raw };
}
const mpStatus = r => mpStatusInfo(r).key;
const OC_KEY = 'thabit_open_counts';
function ocGet() { try { return JSON.parse(localStorage.getItem(OC_KEY) || '{}') || {}; } catch (e) { return {}; } }
function ocBump(id) { try { const c = ocGet(); c[String(id)] = (c[String(id)] || 0) + 1; localStorage.setItem(OC_KEY, JSON.stringify(c)); } catch (e) { } }
{
  const wrap = name => { const f = window[name]; if (typeof f !== 'function') return; window[name] = function (id) { ocBump(id); return f.apply(this, arguments); }; };
  ['mpOpen', 'openStudentSupply', 'openStudentDashboard', 'openStudentNotify'].forEach(wrap);
}

function mpCardHtml(r, today) {
  const paid = isPaid(r), late = !paid && r.due_date && r.due_date < today, st = mpStatus(r);
  const ini = esc(String(r.trainee || '?').trim().charAt(0).toUpperCase());
  const on = mpState.sel.has(String(r.id));
  return `<div class="mp-card${mpState.selecting ? ' sel-mode' : ''}${on ? ' mp-sel' : ''}${st === 'past' || st === 'terminated' || st === 'paused' ? ' mp-dim' : ''}"${mpState.selecting ? ` onclick="mpToggleSel('${esc(r.id)}',event)"` : ''}>${mpState.selecting ? `<input type="checkbox" class="mp-ck" ${on ? 'checked' : ''} tabindex="-1">` : ''}
      <div class="mp-av">${r.most_recent_picture_url ? `<img src="${esc(r.most_recent_picture_url)}" alt="" onerror="this.remove()">` : ini}</div>
      <div class="mp-nm"><b dir="auto">${esc(r.trainee || '')}</b>
        <small dir="auto">${esc([r['preferred name'], r.subscription].filter(Boolean).join(' · '))}</small>
        <small class="${late ? 'mp-late' : ''}">${r.due_date ? 'Due ' + esc(r.due_date) + (late ? ' (متأخر)' : '') : ''}</small>
        <small style="color:${paid ? '#34d399' : '#94a3b8'}">${paid ? '✓ دفع ' + esc(payMonth()) : 'لم يدفع ' + esc(payMonth())}</small></div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:stretch">
        <button type="button" class="ds-cur" title="Insert Daily Supply" onclick="openStudentSupply('${esc(r.id)}')"><i class="ds-caret"></i>DS</button>
        <button type="button" class="ds-b amber" onclick="mpOpen('${esc(r.id)}')">Profile</button>
        <button type="button" class="ds-b blue" title="إشعار" onclick="openStudentNotify('${esc(r.id)}')"><i class="fa-solid fa-bell"></i> إشعار</button>
        <button type="button" class="ds-b green" title="Dashboard View" onclick="openStudentDashboard('${esc(r.id)}')"><i class="fa-solid fa-eye"></i> Dashboard</button></div></div>`;
}
const MP_GROUPS = [['active', 'Active · شغّالين'], ['pending', 'Pending · منتظرين'], ['paused', 'Paused · موقوفين'], ['past', 'Past · سابقين'], ['terminated', 'Terminated · منتهي']];
mpPaintList = function () {
  const g = document.getElementById('mpGrid'); if (!g) return;
  const today = dsToday(), cnt = ocGet();
  const rows = mpState.list.filter(r => !mpState.q || `${r.trainee || ''} ${r['preferred name'] || ''}`.toLowerCase().includes(mpState.q));
  const byOpens = (a, b) => (cnt[String(b.id)] || 0) - (cnt[String(a.id)] || 0) || String(a.trainee || '').localeCompare(String(b.trainee || ''));
  /* known groups first, then one group per custom status text */
  const groups = MP_GROUPS.map(([k, label]) => [k, label]);
  const custom = new Map();
  rows.forEach(r => { const i = mpStatusInfo(r); if (i.key.startsWith('x:') && !custom.has(i.key)) custom.set(i.key, i.label); });
  [...custom.entries()].sort((a, b) => a[1].localeCompare(b[1])).forEach(([k, label]) => groups.push([k, label]));
  let html = '', first = true;
  groups.forEach(([k, label]) => {
    const part = rows.filter(r => mpStatus(r) === k).sort(byOpens);
    if (!part.length) return;
    html += `<div style="grid-column:1/-1;display:flex;align-items:center;gap:8px;margin:${first ? '0' : '12px'} 0 2px;color:#94a3b8;font-size:11px;font-weight:800"><span style="flex:1;height:1px;background:#334155"></span><span dir="auto">${esc(label)} · ${part.length}</span><span style="flex:1;height:1px;background:#334155"></span></div>`;
    html += part.map(r => mpCardHtml(r, today)).join('');
    first = false;
  });
  g.innerHTML = html || '<div class="tha-note">مفيش نتائج.</div>';
  mpPaintBar();
};

/* quick status buttons inside the Profile window (you can still type any custom status) */
{
  const prevOpen6 = mpOpen;
  mpOpen = function (id) {
    prevOpen6(id);
    if (!mpCur) return;
    const hid = $id(mpId('status_as_of_today')); if (!hid || hid.parentElement.querySelector('.p6-st')) return;
    const bar = document.createElement('div'); bar.className = 'p6-st'; bar.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-top:4px';
    ['Active', 'Pending', 'Paused', 'Past', 'Terminated'].forEach(v => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'ds-b ghost'; b.style.cssText = 'padding:2px 8px;font-size:10px'; b.textContent = v;
      b.onclick = () => { hid.value = v; dsRefreshPf(mpId('status_as_of_today')); };
      bar.appendChild(b);
    });
    hid.parentElement.appendChild(bar);
  };
}

/* ---------- new windows ---------- */
WSD.db = { t: 'Database · الداتابيز', i: 'fa-database', w: 2 };
WSD.hl = { t: 'Highlights', i: 'fa-star', w: 2 };
WS_REFRESH.db = 1; WS_REFRESH.hl = 1;
{
  const prevLoad = wsLoad;
  wsLoad = function (k) {
    if (k === 'db') return dbRender();
    if (k === 'hl') return hlRender();
    return prevLoad(k);
  };
}

async function dbCount(t) {
  try {
    const res = await sbFetch(`${t}?select=*&limit=1`, { headers: { Prefer: 'count=exact' } });
    const n = (res.headers.get('content-range') || '').split('/')[1];
    return n && n !== '*' ? n : '?';
  } catch (e) { return null; }
}
async function dbRender() {
  const w = WSE.db; if (!w) return;
  const ref = (String(SUPABASE_URL).match(/^https:\/\/([^.]+)\./) || [])[1] || '';
  const TABLES = [PROFILES_TABLE, DAILY_SUPPLY_TABLE, ARCHIVE_TABLE, 'supply_items', 'notifications', 'reports', 'words_table', 'due_words_table', 'broken_words_table'];
  w.body.innerHTML = `<div class="p5-g">
    <div class="p5-c"><h6><span class="p5-dot" id="dbDot"></span>Supabase</h6>
      <div id="dbRows" class="text-xs text-slate-400">جاري الفحص...</div>
      <div style="margin-top:10px"><a class="ds-b blue" style="display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="https://supabase.com/dashboard/project/${esc(ref)}"><i class="fa-solid fa-arrow-up-right-from-square"></i> فتح لوحة Supabase</a></div></div>
    <div class="p5-c"><h6><span class="p5-dot"></span>Cloudflare</h6>
      <div class="text-xs text-slate-400" style="line-height:1.8">لسه مش متوصّل بالأدمن. هنا هتظهر الملفات (الصوت والفيديو) اللي بتتخزن على Cloudflare ولينكاتها لما نوصّله.</div>
      <div style="margin-top:10px"><a class="ds-b ghost" style="display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="https://dash.cloudflare.com/"><i class="fa-solid fa-arrow-up-right-from-square"></i> فتح Cloudflare</a></div></div></div>`;
  const counts = await Promise.all(TABLES.map(dbCount));
  const rows = $id('dbRows'), dot = $id('dbDot'); if (!rows) return;
  const okAny = counts.some(c => c !== null);
  if (dot) dot.style.background = okAny ? '#10b981' : '#e11d48';
  rows.innerHTML = TABLES.map((t, i) => `<div class="p5-r"><span dir="ltr">${esc(t)}</span><b style="color:${counts[i] === null ? '#fb7185' : '#e2e8f0'}">${counts[i] === null ? 'تعذر' : esc(counts[i])}</b></div>`).join('');
}

async function hlRender() {
  const w = WSE.hl; if (!w) return;
  w.body.innerHTML = '<div class="text-center py-6 text-amber-400">جاري التحميل...</div>';
  if (!mpState.list.length) {
    try { const j = await (await sbFetch(`${PROFILES_TABLE}?select=*&order=trainee.asc`)).json(); mpState.list = Array.isArray(j) ? j : []; }
    catch (e) { w.body.innerHTML = `<div class="p-4 text-rose-300 text-sm">تعذر التحميل: ${esc(e.message)}</div>`; return; }
  }
  const today = dsToday(), act = mpState.list.filter(r => mpStatus(r) === 'active');
  /* paid = anyone who paid this month (any status: the money is already with you); unpaid = Active only */
  const paid = mpState.list.filter(isPaid), unpaid = act.filter(r => !isPaid(r)), late = unpaid.filter(r => r.due_date && r.due_date < today);
  /* amount per student = the biggest number found in the "subscription" text (Arabic digits and 1,500 supported) */
  const amt = r => {
    const t = String(r.subscription || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[,٬]/g, '');
    const m = t.match(/\d+(?:[.٫]\d+)?/g); if (!m) return null;
    return Math.max(...m.map(x => parseFloat(x.replace('٫', '.'))));
  };
  const fmt = n => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const total = paid.reduce((t, r) => t + (amt(r) || 0), 0), noAmt = paid.filter(r => amt(r) === null);
  const chip = (r, bad) => `<span class="nt-chip" dir="auto" style="${bad ? 'background:rgba(244,63,94,.15);border-color:rgba(244,63,94,.5)' : ''}">${esc(r.trainee || '')}</span>`;
  const paidChip = r => `<span class="nt-chip" dir="auto" style="background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.45)">${esc(r.trainee || '')}${amt(r) !== null ? ' · ' + esc(fmt(amt(r))) : ''}</span>`;
  w.body.innerHTML = `<div class="p5-g">
    <div class="p5-c"><h6><i class="fa-solid fa-coins"></i> Financial · ${esc(payMonth())}</h6>
      <div class="p5-r"><span>دفعوا</span><b style="color:#34d399">${paid.length}</b></div>
      <div style="font-size:11px;color:#34d399;margin:4px 0 6px">الإجمالي اللي المفروض يكون معاك دلوقتي: <b style="font-size:14px">${esc(fmt(total))}</b></div>
      ${paid.length ? `<div style="margin-bottom:6px">${paid.map(paidChip).join('')}</div>` : ''}
      ${noAmt.length ? `<div class="text-[10px]" style="color:#fbbf24;margin-bottom:6px">مفيش رقم في الـ Subscription عند: ${noAmt.map(r => esc(r.trainee || '')).join('، ')} (مش محسوبين في الإجمالي)</div>` : ''}
      <div class="p5-r"><span>لم يدفعوا</span><b>${unpaid.length}</b></div>
      <div class="p5-r"><span>متأخرين عن الـ Due</span><b style="color:#fb7185">${late.length}</b></div>
      ${unpaid.length ? `<div style="margin-top:8px">${unpaid.map(r => chip(r, late.includes(r))).join('')}</div>` : ''}
      <div class="text-[10px] text-slate-500" style="margin-top:8px">الإجمالي = مجموع قيمة الـ Subscription للي دفعوا الشهر ده (أي حالة). "لم يدفعوا" محسوبة على الـ Active بس.</div></div>
    <div class="p5-c"><h6><i class="fa-solid fa-calendar-check"></i> Attendance · الحضور</h6>
      <div class="text-xs text-slate-400" style="line-height:1.8">مكانه جاهز. قولي إيه اللي يظهر هنا بالتفصيل.</div></div>
    <div class="p5-c"><h6><i class="fa-solid fa-flag"></i> Red flags</h6>
      <div class="text-xs text-slate-400" style="line-height:1.8">مكانه جاهز. قولي إيه اللي يعتبر Red flag وأظهره هنا.</div></div></div>`;
}
