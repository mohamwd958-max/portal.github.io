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

function goToPortal() { window.location.href = 'portal/portal.html'; }

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
    const pageLabels = {home:'', dashboardMain:'Dashboard', voices:'Upload Voice to the Database', reports:'Reports', mods:'Modifications', sub:'Dashboard'};
    setAdminPageTitle(pageLabels[v] || '');
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
function getSignedInAccessToken() {
    // Restore the user's Supabase access token from the Admin Panel session
    // if another script/view has cleared the in-memory variable.
    if (window.SB_ACCESS_TOKEN && String(window.SB_ACCESS_TOKEN).split('.').length === 3) {
        try {
            const payload = JSON.parse(atob(window.SB_ACCESS_TOKEN.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload.role === 'authenticated' && payload.exp > nowSec()) return window.SB_ACCESS_TOKEN;
        } catch (e) {}
    }
    try {
        const s = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY) || 'null');
        const token = s && (s.access_token || s.access);
        if (token && token.split('.').length === 3) {
            const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload.role === 'authenticated' && payload.exp > nowSec()) {
                window.SB_ACCESS_TOKEN = token;
                return token;
            }
        }
    } catch (e) {}
    return null;
}
function sbHeaders(extra) {
    const token = getSignedInAccessToken();
    if (!token) throw new Error('جلسة تسجيل الدخول غير موجودة أو انتهت. سجّل الدخول من لوحة الإدارة مرة أخرى.');
    return Object.assign({
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + token,
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
    { key: 'revision', type: 'text', w: 'w-20' },
    { key: 'revision_details', type: 'text', w: 'w-32' },
    { key: 'notes', type: 'text', w: 'w-32' },
    { key: 'tefl', type: 'text', w: 'w-20' },
    { key: 'qol', type: 'text', w: 'w-20' },
    { key: 'attitude', type: 'number', w: 'w-16', min: 1, max: 10 },
    { key: 'attitude_details', type: 'text', w: 'w-32' },
    { key: 'soft_skills', type: 'number', w: 'w-16' },
    { key: 'soft_skills_details', type: 'text', w: 'w-32' },
    { key: 'performance', type: 'number', w: 'w-16' },
    { key: 'why', type: 'text', w: 'w-24' },
    { key: 'performance_details', type: 'text', w: 'w-32' },
    { key: 'weak_points', type: 'text', w: 'w-32' },
    { key: 'tasks', type: 'text', w: 'w-32' },
    { key: 'left_overs', type: 'text', w: 'w-32' },
    { key: 'plans', type: 'text', w: 'w-32' }
];

let supplyState = { students: [], records: [], range: null };
let archiveState = { rows: [], cols: [], from: '', to: '' };

const INPUT_CLS = 'bg-slate-950 border border-slate-700 rounded p-1 text-xs text-white';

function supplyCell(f, idx, existing, st, defaultDate, range) {
    let val = existing[f.key];
    if (f.key === 'supply_date') val = val || defaultDate;
    if (f.key === 'group_name') val = val || st.group || '';
    let attrs = '';
    if (f.key === 'supply_date') {
        attrs = ` min="${range.min}" max="${range.max}" onchange="onSupplyDateChange(${idx})" title="اختر يوماً من السبت للخميس هذا الأسبوع"`;
    } else if (f.min !== undefined) {
        attrs = ` min="${f.min}" max="${f.max}"`;
    }
    return `<td class="p-2"><input type="${f.type}" id="ds_${f.key}_${idx}"${attrs} value="${esc(val)}" class="${INPUT_CLS} ${f.w}"></td>`;
}

// لما تغيّر التاريخ في صف: نحمّل بيانات اليوم ده لو متسجلة (عشان ما تكتبش فوقها بالغلط)
window.onSupplyDateChange = function (idx) {
    const st = supplyState.students[idx];
    const date = document.getElementById(`ds_supply_date_${idx}`).value;
    const rec = supplyState.records.find(r => String(r.trainee_id) === String(st.id) && r.supply_date === date) || {};
    SUPPLY_FIELDS.forEach(f => {
        if (f.key === 'supply_date') return;
        const el = document.getElementById(`ds_${f.key}_${idx}`);
        if (!el) return;
        let v = rec[f.key];
        if (f.key === 'group_name') v = v || st.group || '';
        el.value = (v === null || v === undefined) ? '' : v;
    });
};

function readSupplyForm(idx) {
    const body = {};
    SUPPLY_FIELDS.forEach(f => {
        const el = document.getElementById(`ds_${f.key}_${idx}`);
        const v = el ? el.value.trim() : '';
        if (v === '') body[f.key] = null;
        else if (f.type === 'number') body[f.key] = Number.isNaN(Number(v)) ? null : Number(v);
        else body[f.key] = v;
    });
    return body;
}

async function renderDailySupply(backBtnHtml) {
    const subContainer = document.getElementById('adminDynamicSubContainer');
    subContainer.innerHTML = `${backBtnHtml}<div class="text-center py-6 text-amber-400">جاري تحميل الطلاب وسجلات الأسبوع...</div>`;

    const range = getCurrentWeekRange();
    let students, records;
    try {
        students = await fetchStudentsFromSupabase();
        records = await fetchDailySupplyForWeek(range);
    } catch (e) {
        subContainer.innerHTML = `${backBtnHtml}<div class="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm">تعذر تحميل البيانات: ${esc(e.message)}</div>`;
        return;
    }
    if (!students.length) {
        subContainer.innerHTML = `${backBtnHtml}<div class="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-sm">مفيش طلاب راجعين من جدول ${esc(PROFILES_TABLE)}. لو فيه طلاب فعلاً في الجدول يبقى الصلاحيات أو الـ RLS مانعة القراءة.</div>`;
        return;
    }

    supplyState = { students, records, range };

    const today = localDateStr(new Date());
    const defaultDate = (today >= range.min && today <= range.max) ? today : range.min;

    let tableRows = '';
    students.forEach((st, idx) => {
        const name = st.trainee || st.name || 'طالب';
        const existing = records.find(r => String(r.trainee_id) === String(st.id) && r.supply_date === defaultDate) || {};
        const cells = SUPPLY_FIELDS.map(f => supplyCell(f, idx, existing, st, defaultDate, range)).join('');
        tableRows += `
            <tr class="border-b border-slate-800 hover:bg-slate-950/50 transition">
                <td class="p-2 font-bold text-amber-300 sticky left-0 bg-slate-900">${esc(name)}</td>
                ${cells}
                <td class="p-2"><button type="button" onclick="saveDailySuplyRow(${idx}, this)" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold">حفظ وأرشفة</button></td>
            </tr>`;
    });

    const heads = SUPPLY_FIELDS.map(f => `<th class="p-2">${f.key}${f.key === 'supply_date' ? ' (السبت-الخميس)' : ''}</th>`).join('');

    subContainer.innerHTML = `${backBtnHtml}
        <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center flex-wrap gap-2">
                <h4 class="text-amber-400 font-bold text-base"><i class="fa-solid fa-calendar-days"></i> إدارة جدول DailySupply (الأسبوع الحالي: من السبت للخميس)</h4>
                <span class="text-xs text-slate-400">💡 الحفظ بيحدّث سجل اليوم ده ويحفظ نسخته في الأرشيف.</span>
            </div>
            <div class="overflow-x-auto border border-slate-700 rounded-xl max-h-[70vh]">
                <table class="w-full text-left text-xs text-slate-300">
                    <thead class="bg-slate-950 text-amber-300 uppercase text-[10px] sticky top-0">
                        <tr>
                            <th class="p-2 sticky left-0 bg-slate-950">trainee name</th>
                            ${heads}
                            <th class="p-2">إجراء</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        </div>`;
}

window.saveDailySuplyRow = async function (idx, btn) {
    const st = supplyState.students[idx];
    if (!st) { showToast('حصلت مشكلة في تحديد الطالب، افتح الصفحة تاني', true); return; }
    const name = st.trainee || st.name || 'طالب';
    if (st.id === undefined || st.id === null || st.id === '') {
        showToast('الطالب ده مالوش id في جدول ' + PROFILES_TABLE, true);
        return;
    }

    const supplyBody = Object.assign({ trainee_id: st.id }, readSupplyForm(idx));
    if (!supplyBody.supply_date) { showToast('اختار التاريخ الأول', true); return; }

    if (btn) btn.disabled = true;
    const key = `trainee_id=eq.${encodeURIComponent(st.id)}&supply_date=eq.${encodeURIComponent(supplyBody.supply_date)}`;

    // 1) السجل الأساسي في daily_supply
    let saved;
    try {
        saved = await upsertByKey(DAILY_SUPPLY_TABLE, key, supplyBody);
    } catch (e) {
        showToast('فشل الحفظ: ' + e.message, true);
        if (btn) btn.disabled = false;
        return;
    }

    // تحديث النسخة المحلية عشان تغيير التاريخ ورجوعه يعرض اللي اتحفظ
    supplyState.records = supplyState.records.filter(r =>
        !(String(r.trainee_id) === String(st.id) && r.supply_date === supplyBody.supply_date));
    supplyState.records.push(saved || supplyBody);

    // 2) نسخة الأرشيف
    try {
        await upsertByKey(ARCHIVE_TABLE, key, Object.assign({}, supplyBody, { name }));
        showToast(`تم حفظ وأرشفة سجل (${name}) ✓`);
    } catch (e) {
        showToast(`اتحفظ في daily_supply لكن الأرشفة فشلت: ${e.message}`, true, true);
    }
    if (btn) btn.disabled = false;
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

/* ==========================================================
   Student list + movable student windows
   ========================================================== */
const BASIC_INFO_COLUMNS = [
  'id','trainee','status_as_of_today','personal_skills_weakness_points','personal_skills_strength_points',
  'linguistic_lacking','linguistic_strengths','current_plan','consistency_issues','specification',
  'birth_date','most_recent_picture_url','education_on_joining','schooling','location','residence_mostly',
  'first_thabit_scoring','first_approved_english_test','first_psychological_approved_test','preferred_phone',
  'preferred_email','days_a_week','session_time','place','subscription','due_date','joining_date','first_session',
  'created_at','updated_at','preferred name'
];
const BASIC_INFO_LABELS = {
 id:'ID', trainee:'Student / Trainee', status_as_of_today:'Status as of Today',
 personal_skills_weakness_points:'Personal Skills — Weakness Points', personal_skills_strength_points:'Personal Skills — Strength Points',
 linguistic_lacking:'Linguistic Lacking', linguistic_strengths:'Linguistic Strengths', current_plan:'Current Plan',
 consistency_issues:'Consistency Issues', specification:'Specification', birth_date:'Birth Date',
 most_recent_picture_url:'Most Recent Picture URL', education_on_joining:'Education on Joining', schooling:'Schooling',
 location:'Location', residence_mostly:'Residence Mostly', first_thabit_scoring:'First Thabit Scoring',
 first_approved_english_test:'First Approved English Test', first_psychological_approved_test:'First Psychological Approved Test',
 preferred_phone:'Preferred Phone', preferred_email:'Preferred Email', days_a_week:'Days a Week', session_time:'Session Time',
 place:'Place', subscription:'Subscription', due_date:'Due Date', joining_date:'Joining Date', first_session:'First Session',
 created_at:'Created At', updated_at:'Updated At', 'preferred name':'Preferred Name'
};
let studentWindowZ = 10000;
const studentWindowState = new Map();

function setAdminPageTitle(label) {
  const h = document.getElementById('uiAdminPageTitle');
  if (h) h.textContent = label || '';
}
function studentWindowStyles() {
 if (document.getElementById('studentWindowStyles')) return;
 const st = document.createElement('style'); st.id='studentWindowStyles'; st.textContent = `
 #uiAdminPageTitle{font-size:14px;color:#fbbf24;font-weight:800;text-align:center;flex:1;padding:0 12px;}
 .student-float{position:fixed;z-index:10000;left:50%;top:50%;transform:translate(-50%,-50%);width:min(920px,calc(100vw - 36px));height:min(78vh,760px);background:#0f172a;color:#e2e8f0;border:1px solid #475569;border-radius:16px;box-shadow:0 25px 90px #000b;display:flex;flex-direction:column;overflow:hidden}
 .student-float-head{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#111c30;border-bottom:1px solid #334155;cursor:move;user-select:none;touch-action:none}
 .student-float-title{font-weight:800;color:#fbbf24;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 .student-float-body{padding:16px;overflow:auto;flex:1;min-height:0}
 .student-grid{width:100%;border-collapse:collapse;font-size:13px}.student-grid th,.student-grid td{border-bottom:1px solid #334155;padding:10px;text-align:left;vertical-align:top}.student-grid th{color:#fbbf24;background:#111827;position:sticky;top:0}
 .student-action{border:1px solid #64748b;background:#334155;color:#fff;border-radius:8px;padding:6px 11px;font-weight:700;margin:2px;cursor:pointer}.student-action.primary{background:#b77908;border-color:#fbbf24;color:#111827}.student-action:disabled{opacity:.5;cursor:not-allowed}
 .student-field{display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:12px;align-items:start;padding:9px 0;border-bottom:1px solid #263449}.student-field label{font-size:12px;color:#cbd5e1;padding-top:8px;overflow-wrap:anywhere}.student-value{width:100%;background:#020617;border:1px solid #334155;border-radius:7px;color:#e2e8f0;padding:8px;min-width:0}.student-value[readonly]{opacity:.85}
 .student-text-edit{min-height:56px;resize:vertical;cursor:pointer}.student-text-edit:focus{outline:1px solid #fbbf24}.student-float-foot{padding:12px 16px;border-top:1px solid #334155;display:flex;justify-content:flex-end;gap:8px;background:#111c30}
 .student-textarea{width:100%;min-height:55vh;resize:vertical;background:#020617;border:1px solid #475569;border-radius:8px;color:#f8fafc;padding:12px;line-height:1.6;white-space:pre-wrap}
 @media(max-width:640px){.student-float{width:calc(100vw - 16px);height:86vh}.student-field{grid-template-columns:1fr;gap:4px}.student-float-head{padding:10px}.student-float-body{padding:10px}}
 `; document.head.appendChild(st);
}
function makeStudentWindow(title, body, opts={}) {
 studentWindowStyles();
 const id='student-window-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
 const win=document.createElement('section'); win.className='student-float'; win.id=id; win.style.zIndex=String(++studentWindowZ);
 win.dataset.dirty='false'; win.dataset.title=title;
 win.innerHTML=`<header class="student-float-head"><div class="student-float-title">${esc(title)}</div><button type="button" class="student-action" data-win-min title="Move aside">↘</button><button type="button" class="student-action" data-win-close title="Close">✕</button></header><div class="student-float-body">${body}</div>${opts.footer===false?'':`<footer class="student-float-foot">${opts.footer||''}</footer>`}`;
 document.body.appendChild(win); studentWindowState.set(id,{dirty:false});
 win.addEventListener('pointerdown',()=>{win.style.zIndex=String(++studentWindowZ)});
 const head=win.querySelector('.student-float-head'); let drag=null;
 head.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const r=win.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:r.left,top:r.top};win.style.transform='none';head.setPointerCapture(e.pointerId)});
 head.addEventListener('pointermove',e=>{if(!drag)return;win.style.left=Math.max(0,Math.min(innerWidth-win.offsetWidth,drag.left+e.clientX-drag.x))+'px';win.style.top=Math.max(0,Math.min(innerHeight-70,drag.top+e.clientY-drag.y))+'px'});
 head.addEventListener('pointerup',()=>drag=null); head.addEventListener('pointercancel',()=>drag=null);
 win.querySelector('[data-win-min]').onclick=()=>{win.style.transform='none';win.style.left=Math.max(8,innerWidth-win.offsetWidth-24)+'px';win.style.top=Math.max(8,Math.min(innerHeight-win.offsetHeight-12,80+document.querySelectorAll('.student-float').length*24))+'px'};
 win.querySelector('[data-win-close]').onclick=()=>closeStudentWindow(win);
 return win;
}
function closeStudentWindow(win){
 if(win.dataset.dirty==='true'&&!confirm('فيه تغييرات لسه ما اتحفظتش. متأكد إنك عايز تقفل النافذة من غير حفظ؟'))return;
 studentWindowState.delete(win.id);win.remove();
}
function markStudentWindowDirty(win,dirty=true){win.dataset.dirty=dirty?'true':'false';}
function openLongTextEditor(parentWin, label, initialValue, onSave){
 const body=`<p style="margin:0 0 10px;color:#cbd5e1">${esc(label)} — اكتب أو عدّل النص هنا. تقدر تشوف كل السطور.</p><textarea class="student-textarea" id="longTextValue">${esc(initialValue||'')}</textarea>`;
 const child=makeStudentWindow('Edit text — '+label,body,{footer:'<button class="student-action" data-cancel>Cancel</button><button class="student-action primary" data-save>Save text</button>'});
 child.querySelector('[data-cancel]').onclick=()=>closeStudentWindow(child);
 child.querySelector('[data-save]').onclick=()=>{onSave(child.querySelector('#longTextValue').value);child.remove();};
}
function basicInfoFieldHtml(row,key,editable){
 const label=BASIC_INFO_LABELS[key]||key; const val=row[key]??'';
 if(!editable || ['id','created_at','updated_at'].includes(key))return `<div class="student-field"><label>${esc(label)}</label><div class="student-value" style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(val)||'<span style="color:#64748b">—</span>'}</div></div>`;
 const dateType=['birth_date','due_date','joining_date','first_session'].includes(key);
 const cls='student-value '+(!dateType?'student-text-edit':'');
 return `<div class="student-field"><label for="edit-${esc(key)}">${esc(label)}</label>${dateType?`<input class="${cls}" id="edit-${esc(key)}" data-col="${esc(key)}" type="date" value="${esc(val)}">`:`<textarea class="${cls}" id="edit-${esc(key)}" data-col="${esc(key)}" rows="2" readonly title="Click to edit in a larger text window">${esc(val)}</textarea>`}</div>`;
}
async function loadBasicInfoRows(){
 const res=await sbFetch(`${PROFILES_TABLE}?select=*&order=trainee.asc`); const rows=await res.json(); return Array.isArray(rows)?rows:[];
}
async function renderStudentList(){
 const body=`<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px"><input id="studentSearch" class="student-value" style="max-width:360px" placeholder="Search student name or status"><span id="studentCount" style="color:#94a3b8;font-size:12px"></span></div><div id="studentListContent">Loading students…</div>`;
 const win=makeStudentWindow('View Student Page',body,{footer:'<button class="student-action" data-refresh>Refresh list</button>'});
 const content=win.querySelector('#studentListContent');
 async function load(){content.textContent='Loading students…';try{const rows=await loadBasicInfoRows();win.__rows=rows;draw(rows); }catch(e){content.innerHTML=`<p style="color:#fda4af">Could not load students: ${esc(e.message)}</p><p style="color:#94a3b8;font-size:12px">تأكد إن حساب الأدمن عنده SELECT على public.basic_info.</p>`}}
 function draw(rows){const q=(win.querySelector('#studentSearch').value||'').toLowerCase();const filtered=rows.filter(r=>String(r.trainee||'').toLowerCase().includes(q)||String(r.status_as_of_today||'').toLowerCase().includes(q));win.querySelector('#studentCount').textContent=`${filtered.length} student(s)`;if(!filtered.length){content.innerHTML='<p style="padding:20px;text-align:center;color:#94a3b8">No students found.</p>';return;}content.innerHTML=`<table class="student-grid"><thead><tr><th>Student / Trainee</th><th>Status as of Today</th><th>Action</th></tr></thead><tbody>${filtered.map(r=>`<tr><td>${esc(r.trainee||'(Unnamed student)')}</td><td style="white-space:pre-wrap">${esc(r.status_as_of_today||'—')}</td><td><button class="student-action primary" data-view="${esc(r.id)}">View</button><button class="student-action" data-edit="${esc(r.id)}">Edit</button></td></tr>`).join('')}</tbody></table>`;content.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>openStudentRecord(win.__rows.find(r=>r.id===b.dataset.view),false));content.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openStudentRecord(win.__rows.find(r=>r.id===b.dataset.edit),true));}
 win.querySelector('#studentSearch').addEventListener('input',()=>draw(win.__rows||[]));win.querySelector('[data-refresh]').onclick=load;load();
}
function openStudentRecord(row,editable){
 if(!row){showToast('مش لاقي سجل الطالب المطلوب',true);return;}
 const keys=BASIC_INFO_COLUMNS.filter(k=>Object.prototype.hasOwnProperty.call(row,k));
 const body=`<div style="color:#94a3b8;font-size:12px;margin-bottom:12px">${editable?'Editing only this student. Changes are saved to public.basic_info.':'Read-only profile preview from public.basic_info. The full trainee dashboard needs a secure admin-preview RPC.'}</div><div>${keys.map(k=>basicInfoFieldHtml(row,k,editable)).join('')}</div>`;
 const win=makeStudentWindow((editable?'Edit Student — ':'View Student — ')+(row.trainee||'Unnamed student'),body,{footer:editable?'<button class="student-action" data-cancel>Cancel</button><button class="student-action primary" data-save>Save changes</button>':'<button class="student-action" data-close>Close</button>'});
 win.__row=row;win.__dirty=false;
 if(editable){win.querySelectorAll('textarea[data-col]').forEach(el=>el.addEventListener('click',()=>openLongTextEditor(win,BASIC_INFO_LABELS[el.dataset.col]||el.dataset.col,el.value,v=>{el.value=v;markStudentWindowDirty(win,true)})));
 win.querySelectorAll('input[data-col]').forEach(el=>el.addEventListener('change',()=>markStudentWindowDirty(win,true)));
 win.querySelector('[data-cancel]').onclick=()=>closeStudentWindow(win);
 win.querySelector('[data-save]').onclick=async()=>{const patch={};win.querySelectorAll('[data-col]').forEach(el=>patch[el.dataset.col]=el.value===''?null:el.value);patch.updated_at=new Date().toISOString();const btn=win.querySelector('[data-save]');btn.disabled=true;try{const res=await sbFetch(`${PROFILES_TABLE}?id=eq.${encodeURIComponent(row.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});const saved=await res.json();if(!Array.isArray(saved)||!saved.length)throw new Error('No row was updated. Check UPDATE policy/RLS.');markStudentWindowDirty(win,false);win.__dirty=false;showToast('تم حفظ بيانات '+(row.trainee||'الطالب')+' بنجاح');win.remove();}catch(e){showToast('فشل حفظ بيانات الطالب: '+e.message,true);btn.disabled=false;}};
 }else win.querySelector('[data-close]').onclick=()=>closeStudentWindow(win);
}
async function openDashboardSubView(actionType) {
 const dashboardMainEl=document.getElementById('adminViewDashboardMain');const subContainer=document.getElementById('adminDynamicSubContainer');const panelBox=document.getElementById('adminPanel');
 if(dashboardMainEl)dashboardMainEl.style.display='none';if(subContainer)subContainer.style.display='block';if(panelBox)panelBox.style.maxWidth='96vw';
 const labels={masterProfiles:'Trainee Master Profile',view:'View Student Page',modify:'Modify Student Data',dailySupply:'Insert Daily Supply',exception:'Insert Exception / Request',archive:'Archive'};
 setAdminPageTitle(labels[actionType]||actionType);
 const backBtnHtml=`<div class="tha-btns" style="margin-bottom:12px"><button type="button" class="tha-b gray" onclick="showAdminView('dashboardMain')"><i class="fa-solid fa-arrow-left"></i> رجوع</button></div>`;
 if(actionType==='view'||actionType==='modify'||actionType==='masterProfiles') { if(subContainer)subContainer.style.display='none'; return renderStudentList(); }
 if(actionType==='dailySupply')return renderDailySupply(backBtnHtml);if(actionType==='archive')return renderArchive(backBtnHtml);
 subContainer.innerHTML=`${backBtnHtml}<div class="tha-note text-center py-6">الصفحة دي لسه مش متوصلة بكود (${esc(actionType)}).</div>`;
}

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
    showLoginScreen('');
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
const WL = { due: [], broken: [], trash: [] };
const stOf = r => String(r.status || '').toLowerCase();

async function refreshWordLists() {
    try {
        const [due, brk] = await Promise.all([
            fetchAllRows('due_words_table?select=*&order=created_at.desc'),
            fetchAllRows('broken_words_table?select=*&order=created_at.desc')
        ]);
        const active = r => stOf(r) !== 'trash' && stOf(r) !== 'done';
        WL.due = due.filter(active);
        WL.broken = brk.filter(active);
        WL.trash = [].concat(
            due.filter(r => stOf(r) === 'trash').map(r => Object.assign({ _t: 'due_words_table' }, r)),
            brk.filter(r => stOf(r) === 'trash').map(r => Object.assign({ _t: 'broken_words_table' }, r)));
        renderWordLists();
    } catch (e) { showToast('تعذّر تحميل قوايم الكلمات: ' + e.message, true); }
}

function wordRow(r, kind, i) {
    const btn = (fn, ic, title) => `<button type="button" title="${title}" class="px-2 py-1 rounded-lg bg-slate-700 text-[11px]" onclick="${fn}('${kind}',${i})"><i class="fa-solid ${ic}"></i></button>`;
    const acts = kind === 'trash'
        ? btn('restoreFromTrash', 'fa-rotate-left', 'Restore') + btn('purgeFromTrash', 'fa-xmark', 'Delete forever')
        : btn('useListedWord', 'fa-microphone', 'Record') + btn('trashListedWord', 'fa-trash', 'Trash');
    return `<div class="flex items-center justify-between gap-2 text-xs bg-slate-800/60 rounded-lg p-2">
      <div class="min-w-0"><b dir="auto" class="break-words">${esc(r.word)}</b>
      <div class="text-[10px] text-slate-400">${esc(r.trainee_name || '')} · ${esc(fmtDT(r.created_at))}</div></div>
      <div class="flex gap-1 flex-none">${acts}</div></div>`;
}
function renderWordLists() {
    const put = (id, cnt, list, kind, empty) => {
        const c = $id(id); if (c) c.innerHTML = list.length ? list.map((r, i) => wordRow(r, kind, i)).join('') : `<span class="text-xs text-slate-500 text-center py-2">${empty}</span>`;
        const n = $id(cnt); if (n) n.textContent = list.length;
    };
    put('dueWordsContainer', 'dueWordsCount', WL.due, 'due', 'No pending words right now.');
    put('brokenWordsContainer', 'brokenWordsCount', WL.broken, 'broken', 'مفيش كلمات مكسورة.');
    put('trashWordsContainer', 'trashCount', WL.trash, 'trash', 'Trash is empty.');
    const b = $id('voicesBadge'), pending = WL.due.length + WL.broken.length;
    if (b) { b.textContent = pending; b.style.display = pending ? 'inline-flex' : 'none'; }
}
const tableOf = kind => kind === 'due' ? 'due_words_table' : 'broken_words_table';
function useListedWord(kind, i) {
    const r = WL[kind][i]; if (!r) return;
    const inp = $id('newWordInput'); inp.value = r.word; checkIfWordExistsInDb(r.word); inp.focus();
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
// after a word is recorded, close any open reports about it
async function markWordHandled(word) {
    for (const t of ['due_words_table', 'broken_words_table']) {
        try {
            await sbFetch(`${t}?word=ilike.${enc(likeEsc(word))}&or=(status.is.null,status.neq.trash)`, { method: 'PATCH', body: JSON.stringify({ status: 'done' }) });
        } catch (e) { /* status values may be restricted; ignore */ }
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
    play.onclick = () => { if (ADM.existing && ADM.existing.audio_url) new Audio(ADM.existing.audio_url).play().catch(() => showToast('مش قادر أشغّل الصوت', true)); };
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
        const list = WL.due.slice().sort((x, y) => String(x.created_at).localeCompare(String(y.created_at))).slice(0, 30);
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
