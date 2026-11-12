/* ==========================================================
   Thabit Board — js/board.js
   لوحة لانهائية: قلم/هايلايتر/ممحاتين (فلاي أوت جنب القلم)، نص وستيكي بالسحب
   بحجم خط تلقائي، مقابض تكبير كاملة، أسهم متصلة بالعناصر، قفل،
   صور ولقطات شاشة (كاملة أو قص جزء)، تراجع/إعادة، لوحات متعددة، تصدير.
   التخزين حالياً محلي (localStorage). مكان ربط السيرفر: كائن Backend.
   ========================================================== */
(() => {
'use strict';

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const root = document.documentElement;
const body = document.body;
const cv = $('#cv'), ctx = cv.getContext('2d');
const mctx = document.createElement('canvas').getContext('2d');
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RTL = /[\u0590-\u08FF]/;
const FONT = '"Cairo", system-ui, sans-serif';
const CFG = { minZoom: .02, maxZoom: 8, maxImg: 1600, saveDelay: 600 };
const COLORS = ['auto', '#e5484d', '#f76b15', '#f5c518', '#30a46c', '#3e63dd', '#8e4ec6'];
const STICKY = ['#fff2a8', '#ffd1dc', '#c8f0d2', '#cfe3ff', '#e5d4ff'];
const PEN_SIZES = [2, 5, 12], ER_SIZES = [16, 36, 72];
const ICON_X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const SIDES = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
const CORNERS = ['nw', 'ne', 'se', 'sw'], EDGES = ['n', 'e', 's', 'w'];
const CURSORS = { nw: 'nwse-resize', se: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize', p1: 'crosshair', p2: 'crosshair', cend: 'crosshair', dot: 'crosshair' };
const isInk = t => t === 'pen' || t === 'hl' || t === 'eraser';

/* Backend: لما تربط السيرفر، حط الدوال هنا (login / load / save / list) */
const Backend = { enabled: false };

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
};

/* ---------- state ---------- */
const S = { tool: 'select', shape: 'rect', color: 'auto', width: 5, sticky: STICKY[0], touchDraw: false, space: false, erMode: 'part', erSize: 36, penOpen: true };
let cam = { x: innerWidth / 2, y: innerHeight / 2, z: 1 };
let objs = [], imgs = {}, imgCache = {};
let sel = null, undo = [], redo = [], editing = null, placing = null;
const mouse = { x: 0, y: 0, on: false };
let boards = LS.get('thabit_index', []), cur = null;
const params = new URLSearchParams(location.search);
const viewMode = params.get('mode') === 'view';
if (viewMode) body.classList.add('view');
const canEdit = () => !viewMode;

/* ---------- theme / toast / status ---------- */
const ink = () => root.dataset.theme === 'dark' ? '#f3f3f6' : '#1a1a1f';
const col = c => c === 'auto' ? ink() : c;
function setTheme(t) {
  root.dataset.theme = t;
  LS.set('thabit_theme', t);
  const m = document.querySelector('meta[name=theme-color]');
  if (m) m.content = t === 'dark' ? '#17171b' : '#ffffff';
  renderProps(); renderPen(); draw();
}
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600);
}
function status(s, txt) { $('#status').dataset.s = s; $('#statusTxt').textContent = txt; }

/* ---------- history ---------- */
const snap = () => JSON.stringify(objs, (k, v) => k[0] === '_' ? undefined : v);
function checkpoint() { undo.push(snap()); if (undo.length > 100) undo.shift(); redo = []; syncUndo(); }
function doUndo() { closeEditor(); if (!undo.length) return; redo.push(snap()); objs = JSON.parse(undo.pop()); sel = null; afterHistory(); }
function doRedo() { closeEditor(); if (!redo.length) return; undo.push(snap()); objs = JSON.parse(redo.pop()); sel = null; afterHistory(); }
function afterHistory() { syncUndo(); dirty(); draw(); renderProps(); }
function syncUndo() { $('#btnUndo').disabled = !undo.length; $('#btnRedo').disabled = !redo.length; }

/* ---------- geometry ---------- */
const toWorld = (sx, sy) => ({ x: (sx - cam.x) / cam.z, y: (sy - cam.y) / cam.z });
const getObj = id => objs.find(o => o.id === id);
const BOXED = o => o.t === 'n' || o.t === 'i' || o.t === 't' || (o.t === 'sh' && (o.k === 'rect' || o.k === 'ellipse'));
function cleanConns() {
  const ids = new Set(objs.map(o => o.id));
  objs = objs.filter(o => o.t !== 'c' || (ids.has(o.from.id) && (!o.to || ids.has(o.to.id))));
}
function sidePt(o, side) {
  const b = bounds(o);
  return side === 'n' ? { x: b.x + b.w / 2, y: b.y } : side === 's' ? { x: b.x + b.w / 2, y: b.y + b.h }
    : side === 'e' ? { x: b.x + b.w, y: b.y + b.h / 2 } : { x: b.x, y: b.y + b.h / 2 };
}
/* هندسة السهم المتصل: منحنى بيزيه بيلتوي حسب جهة الخروج والدخول */
function connGeom(c) {
  const a = getObj(c.from.id); if (!a) return null;
  const p0 = sidePt(a, c.from.side), n0 = SIDES[c.from.side]; let p1, n1 = null;
  if (c.to) { const t = getObj(c.to.id); if (!t) return null; p1 = sidePt(t, c.to.side); n1 = SIDES[c.to.side]; }
  else p1 = { x: c.tx, y: c.ty };
  const d = Math.hypot(p1.x - p0.x, p1.y - p0.y), k = clamp(d * .45, 24, 600);
  const c1 = { x: p0.x + n0[0] * k, y: p0.y + n0[1] * k };
  const c2 = n1 ? { x: p1.x + n1[0] * k, y: p1.y + n1[1] * k } : { x: p1.x, y: p1.y };
  const from = n1 ? c2 : c1;
  return { p0, c1, c2, p1, ang: Math.atan2(p1.y - from.y, p1.x - from.x) };
}
const bez = (g, t) => {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * g.p0.x + b * g.c1.x + c * g.c2.x + d * g.p1.x, y: a * g.p0.y + b * g.c1.y + c * g.c2.y + d * g.p1.y };
};

/* حجم الخط التلقائي: أكبر خط يدخل جوه البوكس */
function wrapLines(c, text, maxW) {
  const out = [];
  for (const para of (text || '').split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const t = line ? line + ' ' + word : word;
      if (line && c.measureText(t).width > maxW) { out.push(line); line = word; } else line = t;
    }
    out.push(line);
  }
  return out;
}
const padOf = o => o.t === 'n' ? 14 : 6;
const fitCache = new Map();
function fitSize(o) {
  if (o.t === 't' && !o.fit) return o.fs;
  const pad = padOf(o), cap = o.t === 'n' ? o.h * .22 : 1e9;
  const hi0 = Math.max(6, Math.min(cap, o.h - 2 * pad) / 1.35);
  if (!(o.text || '').trim()) return hi0;
  const key = o.t + '|' + o.text + '|' + Math.round(o.w) + '|' + Math.round(o.h);
  const hit = fitCache.get(key); if (hit) return hit;
  let lo = 6, hi = hi0;
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2; mctx.font = `500 ${mid}px ${FONT}`;
    if (wrapLines(mctx, o.text, o.w - 2 * pad).length * mid * 1.35 <= o.h - 2 * pad) lo = mid; else hi = mid;
  }
  if (fitCache.size > 600) fitCache.clear();
  fitCache.set(key, lo); return lo;
}
function growText(o) { /* نص بدون fit: الارتفاع بيزيد مع الكتابة */
  mctx.font = `500 ${o.fs}px ${FONT}`;
  o.h = Math.max(o.fs * 1.35 + 12, wrapLines(mctx, o.text, o.w - 12).length * o.fs * 1.35 + 12);
}

function bounds(o) {
  if (o.t === 's') {
    let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
    for (const p of o.pts) { a = Math.min(a, p[0]); b = Math.min(b, p[1]); c = Math.max(c, p[0]); d = Math.max(d, p[1]); }
    const r = o.w / 2; return { x: a - r, y: b - r, w: c - a + o.w, h: d - b + o.w };
  }
  if (o.t === 'sh') return { x: Math.min(o.x1, o.x2), y: Math.min(o.y1, o.y2), w: Math.abs(o.x2 - o.x1), h: Math.abs(o.y2 - o.y1) };
  if (o.t === 'c') {
    const g = connGeom(o); if (!g) return { x: 0, y: 0, w: 0, h: 0 };
    let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
    for (let i = 0; i <= 20; i++) { const p = bez(g, i / 20); a = Math.min(a, p.x); b = Math.min(b, p.y); c = Math.max(c, p.x); d = Math.max(d, p.y); }
    return { x: a, y: b, w: c - a, h: d - b };
  }
  return { x: o.x, y: o.y, w: o.w, h: o.h };
}
function setBox(o, b) {
  if (o.t === 'sh') { o.x1 = b.x; o.y1 = b.y; o.x2 = b.x + b.w; o.y2 = b.y + b.h; }
  else { o.x = b.x; o.y = b.y; o.w = b.w; o.h = b.h; }
}
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
  let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = clamp(t, 0, 1);
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function hit(o, x, y, tol) {
  if (o.t === 's') {
    const p = o.pts, r = o.w / 2 + tol;
    if (p.length === 1) return Math.hypot(x - p[0][0], y - p[0][1]) <= r;
    for (let i = 0; i < p.length - 1; i++) if (segDist(x, y, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]) <= r) return true;
    return false;
  }
  if (o.t === 'c') {
    const g = connGeom(o); if (!g) return false;
    let prev = bez(g, 0);
    for (let i = 1; i <= 40; i++) { const q = bez(g, i / 40); if (segDist(x, y, prev.x, prev.y, q.x, q.y) <= o.w / 2 + tol) return true; prev = q; }
    return false;
  }
  if (o.t === 'sh' && (o.k === 'line' || o.k === 'arrow')) return segDist(x, y, o.x1, o.y1, o.x2, o.y2) <= o.w / 2 + tol;
  const b = bounds(o);
  return x >= b.x - tol && x <= b.x + b.w + tol && y >= b.y - tol && y <= b.y + b.h + tol;
}
function union(list) {
  const l = list.filter(o => o.t !== 'c' || connGeom(o));
  if (!l.length) return null;
  let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
  for (const o of l) { const r = bounds(o); a = Math.min(a, r.x); b = Math.min(b, r.y); c = Math.max(c, r.x + r.w); d = Math.max(d, r.y + r.h); }
  return { x: a, y: b, w: c - a, h: d - b };
}

/* ---------- مقابض التحكم ---------- */
function hlist(o) { /* مقابض التكبير (إحداثيات العالم) */
  if (o.lock) return [];
  if (BOXED(o)) {
    const b = bounds(o), mx = b.x + b.w / 2, my = b.y + b.h / 2, r = b.x + b.w, bt = b.y + b.h;
    return [['nw', b.x, b.y], ['n', mx, b.y], ['ne', r, b.y], ['e', r, my], ['se', r, bt], ['s', mx, bt], ['sw', b.x, bt], ['w', b.x, my]].map(([id, x, y]) => ({ id, x, y }));
  }
  if (o.t === 'sh') return [{ id: 'p1', x: o.x1, y: o.y1 }, { id: 'p2', x: o.x2, y: o.y2 }];
  if (o.t === 'c') { const g = connGeom(o); return g ? [{ id: 'cend', x: g.p1.x, y: g.p1.y }] : []; }
  return [];
}
function dotsOf(o) { /* نقط خروج الأسهم (إحداثيات الشاشة) */
  if (!BOXED(o)) return [];
  return Object.keys(SIDES).map(sd => {
    const p = sidePt(o, sd), n = SIDES[sd];
    return { side: sd, x: cam.x + p.x * cam.z + n[0] * 24, y: cam.y + p.y * cam.z + n[1] * 24 };
  });
}
function hitHandle(o, sx, sy) {
  for (const d of dotsOf(o)) if (Math.hypot(d.x - sx, d.y - sy) < 12) return { k: 'dot', id: 'dot', side: d.side };
  for (const h of hlist(o)) if (Math.hypot(cam.x + h.x * cam.z - sx, cam.y + h.y * cam.z - sy) < 11) return { k: 'h', id: h.id };
  return null;
}
function resizeBox(b, h, p, minS) {
  let l = b.x, t = b.y, r = b.x + b.w, bt = b.y + b.h;
  if (h.length === 2) { /* ركن: تكبير متناسب */
    const ox = h.includes('w') ? r : l, oy = h.includes('n') ? bt : t;
    const sc = Math.max(Math.abs(p.x - ox) / Math.max(b.w, 1), Math.abs(p.y - oy) / Math.max(b.h, 1), minS / Math.max(Math.min(b.w, b.h), 1));
    const nw = Math.max(b.w, 1) * sc, nh = Math.max(b.h, 1) * sc;
    if (h.includes('w')) { r = ox; l = r - nw; } else { l = ox; r = l + nw; }
    if (h.includes('n')) { bt = oy; t = bt - nh; } else { t = oy; bt = t + nh; }
  } else { /* حافة: تمدد في اتجاه واحد */
    if (h === 'w') l = Math.min(p.x, r - minS); if (h === 'e') r = Math.max(p.x, l + minS);
    if (h === 'n') t = Math.min(p.y, bt - minS); if (h === 's') bt = Math.max(p.y, t + minS);
  }
  return { x: l, y: t, w: r - l, h: bt - t };
}

/* ---------- drawing ---------- */
function getImg(ref) {
  let im = imgCache[ref];
  if (!im) { im = imgCache[ref] = new Image(); im.crossOrigin = 'anonymous'; im.onload = draw; im.src = imgs[ref] || ''; }
  return im;
}
function drawBoxText(c, o, color) {
  const pad = padOf(o), s = fitSize(o);
  c.save(); c.beginPath(); c.rect(o.x, o.y, o.w, o.h); c.clip();
  c.font = `500 ${s}px ${FONT}`; c.textBaseline = 'top'; c.fillStyle = color;
  wrapLines(c, o.text, o.w - 2 * pad).forEach((ln, i) => {
    const r = RTL.test(ln); c.direction = r ? 'rtl' : 'ltr'; c.textAlign = r ? 'right' : 'left';
    c.fillText(ln, r ? o.x + o.w - pad : o.x + pad, o.y + pad + i * s * 1.35);
  });
  c.restore();
}
function arrowHead(c, x, y, a, w) {
  const h = Math.max(12, w * 4);
  c.moveTo(x - h * Math.cos(a - .45), y - h * Math.sin(a - .45)); c.lineTo(x, y); c.lineTo(x - h * Math.cos(a + .45), y - h * Math.sin(a + .45));
}
function drawObj(c, o) {
  if (o._edit && o.t !== 'n') return;
  c.save();
  if (o.t === 's') {
    c.lineCap = c.lineJoin = 'round'; c.strokeStyle = c.fillStyle = col(o.color); c.lineWidth = o.w;
    if (o.hl) { c.globalAlpha = .35; c.lineCap = 'butt'; }
    const p = o.pts; c.beginPath();
    if (p.length === 1) { c.arc(p[0][0], p[0][1], o.w / 2, 0, 7); c.fill(); }
    else {
      c.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length - 1; i++) c.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2);
      c.lineTo(p[p.length - 1][0], p[p.length - 1][1]); c.stroke();
    }
  } else if (o.t === 'sh') {
    c.lineCap = c.lineJoin = 'round'; c.strokeStyle = col(o.color); c.lineWidth = o.w; c.beginPath();
    const b = bounds(o);
    if (o.k === 'rect') c.roundRect(b.x, b.y, b.w, b.h, Math.min(8, b.w / 4, b.h / 4));
    else if (o.k === 'ellipse') c.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, b.h / 2, 0, 0, 7);
    else { c.moveTo(o.x1, o.y1); c.lineTo(o.x2, o.y2); if (o.k === 'arrow') arrowHead(c, o.x2, o.y2, Math.atan2(o.y2 - o.y1, o.x2 - o.x1), o.w); }
    c.stroke();
  } else if (o.t === 'c') {
    const g = connGeom(o);
    if (g) {
      c.lineCap = c.lineJoin = 'round'; c.strokeStyle = col(o.color); c.lineWidth = o.w; c.beginPath();
      c.moveTo(g.p0.x, g.p0.y); c.bezierCurveTo(g.c1.x, g.c1.y, g.c2.x, g.c2.y, g.p1.x, g.p1.y);
      arrowHead(c, g.p1.x, g.p1.y, g.ang, o.w); c.stroke();
    }
  } else if (o.t === 't') {
    drawBoxText(c, o, col(o.color));
  } else if (o.t === 'n') {
    c.shadowColor = 'rgba(0,0,0,.18)'; c.shadowBlur = 10; c.shadowOffsetY = 3;
    c.fillStyle = o.color; c.beginPath(); c.roundRect(o.x, o.y, o.w, o.h, 6); c.fill();
    c.shadowColor = 'transparent';
    if (!o._edit) drawBoxText(c, o, '#1a1a1f');
  } else if (o.t === 'i') {
    const im = getImg(o.ref);
    if (im.complete && im.naturalWidth) c.drawImage(im, o.x, o.y, o.w, o.h);
    else { c.fillStyle = 'rgba(128,128,128,.2)'; c.fillRect(o.x, o.y, o.w, o.h); }
  }
  c.restore();
}

let raf = 0;
function draw() { if (!raf) raf = requestAnimationFrame(render); }
function drawSelection(o) {
  const b = bounds(o), z = cam.z, X = v => cam.x + v * z, Y = v => cam.y + v * z;
  ctx.lineWidth = 1.5; ctx.strokeStyle = '#4262ff';
  if (BOXED(o)) ctx.strokeRect(X(b.x), Y(b.y), b.w * z, b.h * z);
  else if (o.t === 's') { ctx.setLineDash([5, 4]); ctx.strokeRect(X(b.x) - 4, Y(b.y) - 4, b.w * z + 8, b.h * z + 8); ctx.setLineDash([]); }
  for (const h of hlist(o)) {
    const x = X(h.x), y = Y(h.y); ctx.fillStyle = '#fff'; ctx.beginPath();
    if (CORNERS.includes(h.id)) ctx.rect(x - 5.5, y - 5.5, 11, 11);
    else if (h.id === 'n' || h.id === 's') ctx.roundRect(x - 10, y - 3.5, 20, 7, 3.5);
    else if (h.id === 'e' || h.id === 'w') ctx.roundRect(x - 3.5, y - 10, 7, 20, 3.5);
    else ctx.arc(x, y, 6, 0, 7);
    ctx.fill(); ctx.stroke();
  }
  for (const d of dotsOf(o)) {
    ctx.beginPath(); ctx.arc(d.x, d.y, 8, 0, 7); ctx.fillStyle = '#4262ff'; ctx.fill();
    ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
  }
}
function render() {
  raf = 0;
  const dpr = devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.setTransform(dpr * cam.z, 0, 0, dpr * cam.z, dpr * cam.x, dpr * cam.y);
  for (const o of objs) drawObj(ctx, o);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (sel && canEdit() && !sel._edit) drawSelection(sel);
  if (g && g.k === 'conn' && g.hover) { /* تلميح: نقط الاتصال على العنصر الهدف */
    for (const sd of Object.keys(SIDES)) {
      const p = sidePt(g.hover, sd); ctx.beginPath(); ctx.arc(cam.x + p.x * cam.z, cam.y + p.y * cam.z, 6, 0, 7);
      ctx.fillStyle = '#4262ff'; ctx.fill();
    }
  }
  if (g && g.k === 'box' && g.rect) {
    const r = g.rect; ctx.setLineDash([6, 4]); ctx.strokeStyle = '#4262ff'; ctx.lineWidth = 1.5;
    ctx.strokeRect(cam.x + r.x * cam.z, cam.y + r.y * cam.z, r.w * cam.z, r.h * cam.z); ctx.setLineDash([]);
  }
  if (placing && mouse.on) {
    const pw = placing.w * cam.z, ph = placing.h * cam.z;
    ctx.globalAlpha = .85; ctx.drawImage(placing.src, mouse.x - pw / 2, mouse.y - ph / 2, pw, ph); ctx.globalAlpha = 1;
    ctx.strokeStyle = '#4262ff'; ctx.lineWidth = 1.5; ctx.strokeRect(mouse.x - pw / 2, mouse.y - ph / 2, pw, ph);
  } else if (S.tool === 'eraser' && S.erMode === 'part' && mouse.on && canEdit()) {
    ctx.beginPath(); ctx.arc(mouse.x, mouse.y, S.erSize / 2, 0, 7);
    ctx.fillStyle = 'rgba(128,128,128,.15)'; ctx.fill(); ctx.strokeStyle = ink(); ctx.lineWidth = 1.5; ctx.stroke();
  }
  syncGrid();
  $('#zoomPct').textContent = Math.round(cam.z * 100) + '%';
}
/* الشبكة اللانهائية: الـ CSS بيقرأ المتغيرات دي */
function syncGrid() {
  let size = 100 * cam.z;
  while (size < 40) size *= 5;
  while (size > 200) size /= 5;
  root.style.setProperty('--gs', size + 'px');
  root.style.setProperty('--gx', (cam.x % size) + 'px');
  root.style.setProperty('--gy', (cam.y % size) + 'px');
}
function resize() {
  const dpr = devicePixelRatio || 1;
  cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
  renderPen(); draw();
}

/* ---------- camera ---------- */
function zoomAt(sx, sy, nz) {
  nz = clamp(nz, CFG.minZoom, CFG.maxZoom);
  const wx = (sx - cam.x) / cam.z, wy = (sy - cam.y) / cam.z;
  cam.z = nz; cam.x = sx - wx * nz; cam.y = sy - wy * nz; draw(); dirty(true);
}
function fit() {
  const b = union(objs);
  if (!b) { cam = { x: innerWidth / 2, y: innerHeight / 2, z: 1 }; draw(); return; }
  const pad = 90, z = clamp(Math.min((innerWidth - pad * 2) / Math.max(b.w, 1), (innerHeight - pad * 2) / Math.max(b.h, 1)), CFG.minZoom, 2);
  cam.z = z; cam.x = innerWidth / 2 - (b.x + b.w / 2) * z; cam.y = innerHeight / 2 - (b.y + b.h / 2) * z; draw(); dirty(true);
}
cv.addEventListener('wheel', e => {
  e.preventDefault(); closeEditor();
  const mouseWheel = e.deltaX === 0 && Math.abs(e.deltaY) >= 50 && Number.isInteger(e.deltaY);
  if (e.ctrlKey || e.metaKey || mouseWheel) zoomAt(e.clientX, e.clientY, cam.z * Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0015)));
  else { cam.x -= e.deltaX; cam.y -= e.deltaY; draw(); dirty(true); }
}, { passive: false });

/* ---------- pointer gestures ---------- */
const ptrs = new Map();
let g = null, pinch = null;

function cancelGesture() {
  if (g && (g.k === 'draw' || g.k === 'shape')) { objs = objs.filter(o => o !== g.o); undo.pop(); syncUndo(); }
  g = null; draw();
}
function startPinch() {
  const [a, b] = [...ptrs.values()];
  pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, cam: { ...cam } };
}
function movePinch() {
  const [a, b] = [...ptrs.values()];
  const d = Math.hypot(a.x - b.x, a.y - b.y) || 1, cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
  const z = clamp(pinch.cam.z * d / pinch.d, CFG.minZoom, CFG.maxZoom);
  const wx = (pinch.cx - pinch.cam.x) / pinch.cam.z, wy = (pinch.cy - pinch.cam.y) / pinch.cam.z;
  cam.z = z; cam.x = cx - wx * z; cam.y = cy - wy * z; draw();
}
function objAt(w, skipId) {
  for (let i = objs.length - 1; i >= 0; i--) { const o = objs[i]; if (BOXED(o) && o.id !== skipId && hit(o, w.x, w.y, 6 / cam.z)) return o; }
  return null;
}
function nearestSide(o, w) {
  let best = 'n', bd = 1e9;
  for (const sd of Object.keys(SIDES)) { const p = sidePt(o, sd), d = Math.hypot(p.x - w.x, p.y - w.y); if (d < bd) { bd = d; best = sd; } }
  return best;
}

cv.addEventListener('pointerdown', e => {
  closeEditor();
  cv.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (placing && e.button === 0) { placeShot(e.clientX, e.clientY); return; }
  if (ptrs.size === 2) { cancelGesture(); startPinch(); return; }
  if (ptrs.size > 2) return;
  const touch = e.pointerType === 'touch';
  const w = toWorld(e.clientX, e.clientY);
  const tool = S.tool;
  const pan = e.button === 1 || e.button === 2 || tool === 'hand' || S.space || !canEdit() || (touch && !S.touchDraw);
  const startPan = () => { g = { k: 'pan', id: e.pointerId, sx: e.clientX, sy: e.clientY, cx: cam.x, cy: cam.y }; body.dataset.panning = '1'; };
  if (pan) { startPan(); return; }
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  const tol = 8 / cam.z;

  if (tool === 'pen' || tool === 'hl') {
    checkpoint();
    const o = { id: uid(), t: 's', pts: [[w.x, w.y]], color: S.color, w: tool === 'hl' ? S.width * 3 : S.width, hl: tool === 'hl' };
    objs.push(o); g = { k: 'draw', id: e.pointerId, o };
  } else if (tool === 'shape') {
    checkpoint();
    const o = { id: uid(), t: 'sh', k: S.shape, x1: w.x, y1: w.y, x2: w.x, y2: w.y, color: S.color, w: 4 };
    objs.push(o); g = { k: 'shape', id: e.pointerId, o };
  } else if (tool === 'eraser') {
    g = { k: 'erase', id: e.pointerId, did: false, last: w };
    S.erMode === 'obj' ? eraseAt(w, tol, g) : erasePart(w, w, g);
  } else if (tool === 'text' || tool === 'sticky') {
    g = { k: 'box', id: e.pointerId, x0: w.x, y0: w.y, sx: e.clientX, sy: e.clientY, rect: null };
  } else { /* select */
    if (sel) {
      const hh = hitHandle(sel, e.clientX, e.clientY);
      if (hh && hh.k === 'dot') {
        checkpoint();
        const c = { id: uid(), t: 'c', from: { id: sel.id, side: hh.side }, to: null, tx: w.x, ty: w.y, color: S.color, w: 3 };
        objs.push(c); g = { k: 'conn', id: e.pointerId, o: c, isNew: true, sx: e.clientX, sy: e.clientY, hover: null }; return;
      }
      if (hh && hh.id === 'cend') { g = { k: 'conn', id: e.pointerId, o: sel, isNew: false, did: false, hover: null }; return; }
      if (hh) { g = { k: 'hresize', id: e.pointerId, o: sel, h: hh.id, orig: JSON.parse(JSON.stringify(sel)), did: false }; return; }
    }
    let found = null;
    for (let i = objs.length - 1; i >= 0; i--) if (hit(objs[i], w.x, w.y, tol)) { found = objs[i]; break; }
    sel = found; renderProps(); draw();
    if (found && !found.lock && found.t !== 'c') g = { k: 'move', id: e.pointerId, o: found, orig: JSON.parse(JSON.stringify(found)), w, did: false };
    else startPan();
  }
});

function eraseAt(w, tol, gg) {
  for (let i = objs.length - 1; i >= 0; i--) {
    if (!objs[i].lock && hit(objs[i], w.x, w.y, tol)) {
      if (!gg.did) { checkpoint(); gg.did = true; }
      if (sel === objs[i]) sel = null;
      objs.splice(i, 1); cleanConns(); draw(); break;
    }
  }
}
/* ممحاة الجزء: بتقص الخطوط (قلم/هايلايتر) وتسيب الباقي */
function densify(p, step) {
  const out = [p[0]];
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1], b = p[i], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step) || 1;
    for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
  }
  return out;
}
function erasePart(a, b, gg) {
  const r = S.erSize / 2 / cam.z, steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (r / 2)));
  for (let i = 0; i <= steps; i++) cutAt(a.x + (b.x - a.x) * i / steps, a.y + (b.y - a.y) * i / steps, r, gg);
}
function cutAt(cx, cy, r, gg) {
  for (let i = objs.length - 1; i >= 0; i--) {
    const o = objs[i]; if (o.t !== 's' || o.lock) continue;
    const bb = bounds(o), rr = r + o.w / 2;
    if (cx < bb.x - rr || cx > bb.x + bb.w + rr || cy < bb.y - rr || cy > bb.y + bb.h + rr) continue;
    const pts = densify(o.pts, Math.max(rr / 2, .5)), runs = []; let run = [], cut = false;
    for (const q of pts) {
      if (Math.hypot(q[0] - cx, q[1] - cy) < rr) { cut = true; if (run.length) runs.push(run); run = []; } else run.push(q);
    }
    if (!cut) continue;
    if (run.length) runs.push(run);
    if (!gg.did) { checkpoint(); gg.did = true; }
    if (sel === o) sel = null;
    objs.splice(i, 1, ...runs.filter(x => x.length > 1).map(x => ({ ...o, id: uid(), pts: x })));
    draw();
  }
}
function applyMove(o, orig, dx, dy) {
  if (o.t === 's') o.pts = orig.pts.map(p => [p[0] + dx, p[1] + dy]);
  else if (o.t === 'sh') { o.x1 = orig.x1 + dx; o.x2 = orig.x2 + dx; o.y1 = orig.y1 + dy; o.y2 = orig.y2 + dy; }
  else if (o.t !== 'c') { o.x = orig.x + dx; o.y = orig.y + dy; }
}

cv.addEventListener('pointermove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true;
  if (placing || (S.tool === 'eraser' && S.erMode === 'part')) draw();
  if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && ptrs.size >= 2) { movePinch(); return; }
  if (!g) { /* شكل المؤشر فوق المقابض */
    if (S.tool === 'select' && sel && canEdit()) { const hh = hitHandle(sel, e.clientX, e.clientY); cv.style.cursor = hh ? CURSORS[hh.id] : ''; }
    return;
  }
  if (g.id !== e.pointerId) return;
  const w = toWorld(e.clientX, e.clientY);
  if (g.k === 'pan') { cam.x = g.cx + e.clientX - g.sx; cam.y = g.cy + e.clientY - g.sy; draw(); }
  else if (g.k === 'draw') {
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (evs.length ? evs : [e])) { const p = toWorld(ev.clientX, ev.clientY); g.o.pts.push([p.x, p.y]); }
    draw();
  }
  else if (g.k === 'shape') {
    g.o.x2 = w.x; g.o.y2 = w.y;
    if (e.shiftKey && (g.o.k === 'rect' || g.o.k === 'ellipse')) { const s = Math.max(Math.abs(w.x - g.o.x1), Math.abs(w.y - g.o.y1)); g.o.x2 = g.o.x1 + Math.sign(w.x - g.o.x1 || 1) * s; g.o.y2 = g.o.y1 + Math.sign(w.y - g.o.y1 || 1) * s; }
    draw();
  }
  else if (g.k === 'box') {
    g.rect = { x: Math.min(g.x0, w.x), y: Math.min(g.y0, w.y), w: Math.abs(w.x - g.x0), h: Math.abs(w.y - g.y0) }; draw();
  }
  else if (g.k === 'erase') { if (S.erMode === 'obj') eraseAt(w, 8 / cam.z, g); else { erasePart(g.last, w, g); g.last = w; } }
  else if (g.k === 'move') {
    const dx = w.x - g.w.x, dy = w.y - g.w.y;
    if (!g.did && Math.hypot(dx, dy) * cam.z < 3) return;
    if (!g.did) { checkpoint(); g.did = true; }
    applyMove(g.o, g.orig, dx, dy); draw();
  }
  else if (g.k === 'hresize') {
    if (!g.did) { checkpoint(); g.did = true; }
    const o = g.o;
    if (g.h === 'p1') { o.x1 = w.x; o.y1 = w.y; }
    else if (g.h === 'p2') { o.x2 = w.x; o.y2 = w.y; }
    else {
      const nb = resizeBox({ ...bounds(g.orig) }, g.h, w, 14 / cam.z);
      setBox(o, nb);
      if (o.t === 't' && !o.fit) { o.fit = true; delete o.fs; }
    }
    draw();
  }
  else if (g.k === 'conn') {
    if (!g.isNew && !g.did) { checkpoint(); g.did = true; }
    const o = g.o, hov = objAt(w, o.from.id);
    if (hov) { o.to = { id: hov.id, side: nearestSide(hov, w) }; g.hover = hov; }
    else { o.to = null; o.tx = w.x; o.ty = w.y; g.hover = null; }
    draw();
  }
});

function endPointer(e) {
  ptrs.delete(e.pointerId);
  if (pinch && ptrs.size < 2) { pinch = null; dirty(true); }
  if (!g || g.id !== e.pointerId) return;
  const gg = g; g = null; delete body.dataset.panning;
  if (gg.k === 'pan') dirty(true);
  else if (gg.k === 'shape') {
    const o = gg.o;
    if (Math.hypot(o.x2 - o.x1, o.y2 - o.y1) * cam.z < 4) { objs = objs.filter(x => x !== o); undo.pop(); syncUndo(); }
    else if (e.type === 'pointerup') { sel = null; dirty(); }
  }
  else if (gg.k === 'conn') {
    if (gg.isNew) {
      if (Math.hypot(e.clientX - gg.sx, e.clientY - gg.sy) < 8) { objs = objs.filter(x => x !== gg.o); undo.pop(); syncUndo(); }
      else { sel = gg.o; dirty(); renderProps(); }
    } else if (gg.did) dirty();
  }
  else if (gg.k === 'draw' || gg.k === 'erase' || gg.k === 'move' || gg.k === 'hresize') { if (gg.k === 'draw' || gg.did) dirty(); }
  else if (gg.k === 'box' && e.type === 'pointerup') createBox(gg, Math.hypot(e.clientX - gg.sx, e.clientY - gg.sy) < 14);
  draw();
}
/* نص/ستيكي: بالسحب بتحدد البوكس والخط بيتظبط له، وبالضغطة بيتعمل حجم منطقي حسب الزوم */
function createBox(gg, click) {
  const f = clamp(1 / Math.sqrt(cam.z), .2, 6), isText = S.tool === 'text';
  let o;
  checkpoint();
  if (isText) {
    if (click) { const fs = 26 * f; o = { id: uid(), t: 't', x: gg.x0, y: gg.y0, w: 320 * f, h: fs * 1.35 + 12, text: '', color: S.color, fit: false, fs, _new: true }; }
    else o = { id: uid(), t: 't', ...gg.rect, text: '', color: S.color, fit: true, _new: true };
  } else {
    const r = click ? { x: gg.x0 - 100 * f, y: gg.y0 - 100 * f, w: 200 * f, h: 200 * f } : gg.rect;
    o = { id: uid(), t: 'n', ...r, text: '', color: S.sticky, _new: true };
  }
  objs.push(o); setTool('select'); sel = o; edit(o);
}
cv.addEventListener('pointerup', endPointer);
cv.addEventListener('pointercancel', endPointer);
cv.addEventListener('dblclick', e => {
  if (!canEdit()) return;
  const w = toWorld(e.clientX, e.clientY);
  for (let i = objs.length - 1; i >= 0; i--) {
    const o = objs[i];
    if ((o.t === 't' || o.t === 'n') && hit(o, w.x, w.y, 4 / cam.z)) { checkpoint(); sel = o; edit(o); return; }
  }
});
cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('pointerleave', () => { mouse.on = false; draw(); });

/* ---------- text editor ---------- */
function edit(o) {
  closeEditor();
  const isN = o.t === 'n', pad = padOf(o), ta = document.createElement('textarea'), st = ta.style;
  ta.dir = 'auto'; ta.spellcheck = false; ta.value = o.text || '';
  o._edit = true; draw();
  st.fontFamily = FONT; st.lineHeight = '1.35'; st.fontWeight = '500'; st.color = isN ? '#1a1a1f' : col(o.color);
  st.whiteSpace = 'pre-wrap'; st.overflow = 'hidden';
  const place = () => {
    if (o.t === 't' && !o.fit) growText(o);
    const z = cam.z;
    st.left = cam.x + o.x * z + 'px'; st.top = cam.y + o.y * z + 'px';
    st.width = o.w * z + 'px'; st.height = o.h * z + 'px'; st.padding = pad * z + 'px';
    st.fontSize = fitSize(o) * z + 'px'; st.background = isN ? o.color : 'transparent'; st.borderRadius = isN ? '6px' : '4px';
  };
  const done = () => {
    if (!ta.isConnected) return;
    ta.remove(); editing = null; delete o._edit;
    if (!(o.text || '').trim()) {
      objs = objs.filter(x => x !== o); if (sel === o) sel = null;
      if (o._new) { undo.pop(); syncUndo(); }
    }
    delete o._new; dirty(); draw(); renderProps();
  };
  ta.addEventListener('input', () => { o.text = ta.value; place(); });
  ta.addEventListener('blur', done);
  ta.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Escape' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); ta.blur(); }
  });
  $('#editLayer').appendChild(ta); place(); ta.focus(); editing = { ta, o };
}
function closeEditor() { if (editing) editing.ta.blur(); }

/* ---------- tools & flyouts ---------- */
function setTool(t) {
  closeEditor(); placing = null; S.tool = t; body.dataset.tool = t; body.dataset.er = S.erMode; delete body.dataset.placing;
  document.querySelectorAll('.t[data-tool]').forEach(b => b.classList.toggle('on', b.dataset.tool === t || (b.dataset.tool === 'pen' && isInk(t))));
  if (t !== 'shape') $('#shapePop').hidden = true;
  if (t !== 'select') { sel = null; cv.style.cursor = ''; }
  renderProps(); renderPen(); draw();
}
function togglePop(pop, btn, show) {
  show = show ?? pop.hidden;
  document.querySelectorAll('.pop').forEach(p => p.hidden = true);
  pop.hidden = !show; if (!show) return;
  if (innerWidth > 720) {
    const r = btn.getBoundingClientRect();
    pop.style.left = r.right + 10 + 'px'; pop.style.top = r.top + r.height / 2 + 'px'; pop.style.transform = 'translateY(-50%)';
  } else pop.style.left = pop.style.top = pop.style.transform = '';
}
document.querySelectorAll('.t[data-tool]').forEach(b => b.addEventListener('click', () => {
  const t = b.dataset.tool;
  if (t === 'pen') { if (isInk(S.tool)) { S.penOpen = !S.penOpen; renderPen(); } else { S.penOpen = true; setTool('pen'); } return; }
  if (t === 'shape') { if (S.tool === 'shape') togglePop($('#shapePop'), b); else { setTool('shape'); togglePop($('#shapePop'), b, true); } return; }
  setTool(t);
}));
document.querySelectorAll('[data-shape]').forEach(b => b.addEventListener('click', () => {
  S.shape = b.dataset.shape; setTool('shape'); $('#shapePop').hidden = true;
  document.querySelectorAll('[data-shape]').forEach(x => x.classList.toggle('on', x === b));
}));

/* الفلاي أوت اللي بيطلع جنب القلم: أنواع الأقلام والممحاة + الألوان + الأحجام */
function renderPen() {
  const pop = $('#penPop');
  pop.hidden = !(isInk(S.tool) && S.penOpen && canEdit());
  if (pop.hidden) return;
  const cur = S.tool === 'eraser' ? (S.erMode === 'part' ? 'er-part' : 'er-obj') : S.tool;
  pop.querySelectorAll('[data-ink]').forEach(b => b.classList.toggle('on', b.dataset.ink === cur));
  let h = '';
  if (cur === 'pen' || cur === 'hl') {
    h += COLORS.map(c => `<button class="cdot ${c === S.color ? 'on' : ''}" data-c="${c}" title="لون"><i style="background:${c === 'auto' ? ink() : c}"></i></button>`).join('');
    h += '<i class="sep"></i>' + PEN_SIZES.map(s => `<button class="sdot ${s === S.width ? 'on' : ''}" data-w="${s}" title="سُمك"><i style="width:${s + 3}px;height:${s + 3}px"></i></button>`).join('');
  } else if (cur === 'er-part') {
    h += ER_SIZES.map(s => `<button class="sdot ${s === S.erSize ? 'on' : ''}" data-es="${s}" title="حجم الممحاة"><i style="width:${s / 3 + 4}px;height:${s / 3 + 4}px;background:transparent;border:2px solid var(--ink)"></i></button>`).join('');
  }
  $('#inkOpts').innerHTML = h; $('#inkOpts').hidden = !h;
  if (innerWidth > 720) {
    const r = document.querySelector('.t[data-tool="pen"]').getBoundingClientRect();
    pop.style.left = r.right + 10 + 'px';
    pop.style.top = clamp(r.top - 8, 8, Math.max(8, innerHeight - pop.offsetHeight - 8)) + 'px';
  } else { pop.style.left = pop.style.top = ''; }
}
$('#penPop').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.ink) {
    if (d.ink === 'er-part') { S.erMode = 'part'; setTool('eraser'); }
    else if (d.ink === 'er-obj') { S.erMode = 'obj'; setTool('eraser'); }
    else setTool(d.ink);
  }
  else if (d.c) S.color = d.c;
  else if (d.w) S.width = +d.w;
  else if (d.es) S.erSize = +d.es;
  renderPen(); renderProps(); draw();
});

/* شريط الخصائص (تحت): بيظهر مع النص/الستيكي/الأشكال أو لما تحدد عنصر */
function renderProps() {
  const bar = $('#propBar'), o = sel, t = S.tool;
  const toolShows = ['text', 'sticky', 'shape'].includes(t) || (t === 'eraser' && S.erMode === 'part');
  if (!canEdit() || (!o && !toolShows)) { bar.hidden = true; return; }
  const kind = o ? o.t : t === 'eraser' ? 'er' : t === 'text' ? 't' : t === 'sticky' ? 'n' : 'sh';
  const curCol = o ? o.color : (kind === 'n' ? S.sticky : S.color);
  let h = '';
  if (kind === 'er') h += `<label>حجم الممحاة <input type="range" min="8" max="200" data-p="er" value="${S.erSize}"></label>`;
  if (kind !== 'i' && kind !== 'er') h += (kind === 'n' ? STICKY : COLORS).map(c => `<button class="sw ${c === curCol ? 'on' : ''}" data-c="${c}" style="background:${c === 'auto' ? ink() : c}"></button>`).join('');
  if (kind === 's' || kind === 'sh' || kind === 'c') h += `<i class="sep"></i><label>السُمك <input type="range" min="1" max="40" data-p="w" value="${o ? o.w : S.width}"></label>`;
  if (o) {
    const lock = o.lock ? '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>' : '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-1.5"/>';
    h += `<i class="sep"></i><button class="ib ${o.lock ? 'on' : ''}" data-act="lock" title="${o.lock ? 'فك القفل' : 'قفل العنصر'}"><svg viewBox="0 0 24 24">${lock}</svg></button>`;
    if (o.t !== 'c') h += `<button class="ib" data-act="dup" title="نسخ (Ctrl+D)"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>`;
    h += `<button class="ib" data-act="del" title="حذف (Delete)"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button>`;
  }
  bar.innerHTML = h; bar.hidden = !h;
}
$('#propBar').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.c) {
    if (sel) { checkpoint(); sel.color = b.dataset.c; dirty(); draw(); }
    else if (S.tool === 'sticky') S.sticky = b.dataset.c; else S.color = b.dataset.c;
    renderProps();
  } else if (b.dataset.act === 'del') delSel();
  else if (b.dataset.act === 'dup') dupSel();
  else if (b.dataset.act === 'lock' && sel) { checkpoint(); sel.lock = !sel.lock; dirty(); draw(); renderProps(); }
});
$('#propBar').addEventListener('pointerdown', e => { if (e.target.dataset.p && sel) checkpoint(); });
$('#propBar').addEventListener('input', e => {
  const p = e.target.dataset.p; if (!p) return;
  const v = +e.target.value;
  if (p === 'er') { S.erSize = v; renderPen(); draw(); return; }
  if (sel) { sel[p] = v; dirty(); draw(); } else S.width = v;
});
function delSel() { if (!sel) return; checkpoint(); objs = objs.filter(o => o !== sel); cleanConns(); sel = null; dirty(); draw(); renderProps(); }
function dupSel() {
  if (!sel || sel.t === 'c') return; checkpoint();
  const c = JSON.parse(JSON.stringify(sel, (k, v) => k[0] === '_' ? undefined : v)); c.id = uid(); delete c.lock;
  applyMove(c, c, 24, 24); objs.push(c); sel = c; dirty(); draw(); renderProps();
}

/* top bars */
$('#btnTheme').onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
$('#btnFull').onclick = () => document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen?.().catch(() => {});
$('#btnUndo').onclick = doUndo;
$('#btnRedo').onclick = doRedo;
$('#btnZoomIn').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, cam.z * 1.25);
$('#btnZoomOut').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, cam.z / 1.25);
$('#zoomPct').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, 1);
$('#btnFit').onclick = fit;
$('#btnTouch').onclick = e => { S.touchDraw = !S.touchDraw; e.currentTarget.classList.toggle('on', S.touchDraw); toast(S.touchDraw ? 'الإصبع يرسم ويحرّك' : 'الإصبع يحرّك اللوحة فقط'); };
$('#btnImage').onclick = () => togglePop($('#imgPop'), $('#btnImage'));
document.querySelectorAll('[data-img]').forEach(b => b.addEventListener('click', () => {
  $('#imgPop').hidden = true;
  const k = b.dataset.img;
  k === 'file' ? $('#fileIn').click() : startScreenshot(k);
}));
$('#fileIn').onchange = e => { [...e.target.files].forEach(f => addImage(f)); e.target.value = ''; };
$('#btnExportV').onclick = exportPng;

/* ---------- images & screenshots ---------- */
function packImage(src, w, h, mime, max = CFG.maxImg) {
  const k = Math.min(1, max / Math.max(w, h)), c = document.createElement('canvas');
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  const ref = uid(); imgs[ref] = c.toDataURL(mime, .88);
  return { ref, c };
}
function addImage(file, at) {
  if (!file || !file.type.startsWith('image/')) return;
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const { ref, c } = packImage(im, im.naturalWidth, im.naturalHeight, file.type === 'image/png' ? 'image/png' : 'image/jpeg');
      const w = Math.min(c.width, 500 / cam.z), h = w * c.height / c.width;
      const p = at || toWorld(innerWidth / 2, innerHeight / 2);
      checkpoint();
      const o = { id: uid(), t: 'i', ref, x: p.x - w / 2, y: p.y - h / 2, w, h };
      objs.push(o); setTool('select'); sel = o; dirty(); draw(); renderProps();
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}
async function captureFrame() {
  if (!navigator.mediaDevices?.getDisplayMedia) { toast('المتصفح ده مش بيدعم لقطة الشاشة'); return null; }
  let stream;
  try { stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false, selfBrowserSurface: 'exclude' }); }
  catch { toast('تم إلغاء اللقطة'); return null; }
  try {
    const v = document.createElement('video'); v.srcObject = stream; v.muted = true; v.playsInline = true;
    await v.play();
    if (!v.videoWidth) await new Promise(r => v.onloadedmetadata = r);
    await new Promise(r => setTimeout(r, 450));
    const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    return c;
  } catch { toast('فشلت اللقطة'); return null; }
  finally { stream.getTracks().forEach(t => t.stop()); }
}
/* القص: الشاشة كلها بتظلم وأنت بتحدد المنطقة بالسحب، زي قص الكمبيوتر بالظبط */
function snip(src) {
  return new Promise(resolve => {
    const W = innerWidth, H = innerHeight, dpr = devicePixelRatio || 1;
    const c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
    Object.assign(c.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', zIndex: 500, cursor: 'crosshair', touchAction: 'none' });
    const x = c.getContext('2d'); x.scale(dpr, dpr);
    const s = Math.min(W / src.width, H / src.height), dw = src.width * s, dh = src.height * s, dx = (W - dw) / 2, dy = (H - dh) / 2;
    let a = null, b = null;
    const rect = () => {
      const l = clamp(Math.min(a.x, b.x), dx, dx + dw), t = clamp(Math.min(a.y, b.y), dy, dy + dh);
      return { x: l, y: t, w: clamp(Math.max(a.x, b.x), dx, dx + dw) - l, h: clamp(Math.max(a.y, b.y), dy, dy + dh) - t };
    };
    const paint = () => {
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.drawImage(src, dx, dy, dw, dh);
      x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(0, 0, W, H);
      if (a && b) {
        const r = rect(); x.save(); x.beginPath(); x.rect(r.x, r.y, r.w, r.h); x.clip(); x.drawImage(src, dx, dy, dw, dh); x.restore();
        x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.strokeRect(r.x, r.y, r.w, r.h);
      } else {
        x.fillStyle = '#fff'; x.font = `600 16px ${FONT}`; x.textAlign = 'center'; x.direction = 'rtl';
        x.fillText('اسحب لتحديد المنطقة — Esc للإلغاء', W / 2, 40);
      }
    };
    const finish = out => { c.remove(); document.removeEventListener('keydown', onKey, true); resolve(out); };
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); finish(null); } };
    c.addEventListener('pointerdown', e => { c.setPointerCapture(e.pointerId); a = b = { x: e.clientX, y: e.clientY }; paint(); });
    c.addEventListener('pointermove', e => { if (a) { b = { x: e.clientX, y: e.clientY }; paint(); } });
    c.addEventListener('pointerup', () => {
      if (!a) return;
      const r = rect(); if (r.w < 6 || r.h < 6) { a = b = null; paint(); return; }
      const sw = Math.round(r.w / s), sh = Math.round(r.h / s), out = document.createElement('canvas');
      out.width = sw; out.height = sh;
      out.getContext('2d').drawImage(src, (r.x - dx) / s, (r.y - dy) / s, r.w / s, r.h / s, 0, 0, sw, sh);
      finish(out);
    });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(c); paint();
  });
}
async function startScreenshot(mode) {
  const full = await captureFrame(); if (!full) return;
  let c = full;
  if (mode === 'snip') { c = await snip(full); if (!c) { toast('تم إلغاء القص'); return; } }
  const { ref, c: pc } = packImage(c, c.width, c.height, mode === 'snip' ? 'image/png' : 'image/jpeg', 2000);
  const disp = Math.min(pc.width / (devicePixelRatio || 1), innerWidth * .6);
  setTool('select'); sel = null;
  placing = { ref, src: pc, w: disp / cam.z, h: disp * pc.height / pc.width / cam.z };
  body.dataset.placing = '1';
  if (!mouse.on) { mouse.x = innerWidth / 2; mouse.y = innerHeight / 2; mouse.on = true; }
  draw(); renderProps(); toast('دوس في أي مكان لوضع اللقطة (Esc للإلغاء)');
}
function placeShot(sx, sy) {
  const p = placing; placing = null; delete body.dataset.placing;
  const w = toWorld(sx, sy); checkpoint();
  const o = { id: uid(), t: 'i', ref: p.ref, x: w.x - p.w / 2, y: w.y - p.h / 2, w: p.w, h: p.h };
  objs.push(o); sel = o; dirty(); draw(); renderProps();
}
document.addEventListener('paste', e => {
  if (!canEdit() || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  for (const it of e.clipboardData?.items || []) if (it.kind === 'file' && it.type.startsWith('image/')) { addImage(it.getAsFile()); e.preventDefault(); }
});
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
  e.preventDefault(); if (!canEdit()) return;
  [...e.dataTransfer.files].forEach(f => addImage(f, toWorld(e.clientX, e.clientY)));
});

/* ---------- export ---------- */
function download(href, name) { const a = document.createElement('a'); a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
function exportPng() {
  const b = union(objs); if (!b) { toast('اللوحة فاضية'); return; }
  const pad = 40, sc = Math.min(2, 8000 / Math.max(b.w + pad * 2, b.h + pad * 2));
  const c = document.createElement('canvas'); c.width = Math.round((b.w + pad * 2) * sc); c.height = Math.round((b.h + pad * 2) * sc);
  const x = c.getContext('2d'); x.fillStyle = root.dataset.theme === 'dark' ? '#17171b' : '#ffffff'; x.fillRect(0, 0, c.width, c.height);
  x.setTransform(sc, 0, 0, sc, (pad - b.x) * sc, (pad - b.y) * sc);
  objs.forEach(o => drawObj(x, o));
  c.toBlob(bl => { const u = URL.createObjectURL(bl); download(u, (cur?.name || 'board') + '.png'); setTimeout(() => URL.revokeObjectURL(u), 4000); });
}
function exportJson() {
  const u = URL.createObjectURL(new Blob([JSON.stringify({ name: cur.name, objs: JSON.parse(snap()), imgs })], { type: 'application/json' }));
  download(u, (cur.name || 'board') + '.thabit.json'); setTimeout(() => URL.revokeObjectURL(u), 4000);
}
function importJson(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result); if (!Array.isArray(d.objs)) throw 0;
      checkpoint(); objs = d.objs; imgs = d.imgs || {}; imgCache = {}; sel = null; dirty(); fit(); toast('تم الاستيراد');
    } catch { toast('ملف غير صالح'); }
  };
  r.readAsText(file);
}

/* ---------- storage & boards ---------- */
/* وضعين: محلي (localStorage) للزوار، وسحابي (Supabase) لما الأدمن يدخل: كل لوحة سطر في جدول space_boards */
let cloud = null;                    /* { fetch, url, key, token } بيجي من board-admin.js بعد لوجن الأدمن */
const CLOUD_MAIN = 'admin-main';
let saveT, camT, unsaved = false, failed = false, loadSeq = 0;
const jobs = new Map();
let pumping = false;
const hasAdminSession = () => { try { const x = JSON.parse(sessionStorage.getItem('thabit_admin_session') || 'null'); return !!(x && x.refresh_token); } catch { return false; } };

function dirty(camOnly) {
  if (!cur) return;
  if (cloud) {
    if (camOnly) { clearTimeout(camT); camT = setTimeout(saveCam, 2500); return; }
    unsaved = true; status('saving', 'جارٍ الحفظ…');
    clearTimeout(saveT); saveT = setTimeout(saveNow, 1200); return;
  }
  status('saving', 'جارٍ الحفظ…');
  clearTimeout(saveT); saveT = setTimeout(saveNow, CFG.saveDelay);
}
function saveNow() {
  if (!cur) return;
  if (cloud) { clearTimeout(saveT); queueCloud(); return; }
  const used = {}; objs.forEach(o => { if (o.t === 'i' && imgs[o.ref]) used[o.ref] = imgs[o.ref]; });
  const ok = LS.set('thabit_b_' + cur.id, { objs: JSON.parse(snap()), imgs: used, cam });
  cur.updated = Date.now(); LS.set('thabit_index', boards);
  ok ? status('saved', 'تم الحفظ') : (status('offline', 'مساحة التخزين ممتلئة'), toast('المتصفح رفض الحفظ، قلل الصور أو صدّر اللوحة'));
}

/* ---- cloud: كل حفظ بيتصور لحظتها (لقطة) وبيتبعت بالترتيب، فتبديل اللوحة وسط الحفظ مش بيخلّط حاجة ---- */
function queueCloud() {
  const used = {}; objs.forEach(o => { if (o.t === 'i' && imgs[o.ref]) used[o.ref] = imgs[o.ref]; });
  unsaved = false;
  jobs.set(cur.id, { b: cur, objs: JSON.parse(snap()), imgs: used, cam: { ...cam } });
  pump();
}
async function dataToBlob(u) { return (await fetch(u)).blob(); }
async function uploadImg(boardId, ref, dataUrl) {
  const blob = await dataToBlob(dataUrl), type = blob.type || 'image/jpeg';
  const ext = /png/.test(type) ? 'png' : /webp/.test(type) ? 'webp' : 'jpg';
  const path = `${boardId}/${ref}.${ext}`;
  const r = await fetch(`${cloud.url}/storage/v1/object/space-images/${path}`, {
    method: 'POST', headers: { apikey: cloud.key, Authorization: 'Bearer ' + cloud.token(), 'Content-Type': type, 'x-upsert': 'true' }, body: blob
  });
  if (!r.ok) throw new Error(await r.text());
  return `${cloud.url}/storage/v1/object/public/space-images/${path}`;
}
async function pump() {
  if (pumping) return; pumping = true; failed = false;
  while (jobs.size && cloud) {
    const [id, j] = jobs.entries().next().value; jobs.delete(id);
    try {
      for (const o of j.objs) if (o.t === 'i' && j.imgs[o.ref] && j.imgs[o.ref].startsWith('data:')) {
        try {
          const url = await uploadImg(id, o.ref, j.imgs[o.ref]);
          j.imgs[o.ref] = url; if (cur === j.b && imgs[o.ref]) imgs[o.ref] = url;   /* الصورة بقت لينك مش base64 */
        } catch (e) { toast('تعذّر رفع صورة (هتتحفظ جوه اللوحة): ' + e.message); }
      }
      const b = j.b;
      await cloud.fetch('space_boards?on_conflict=id', {
        method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ id, name: b.name || '', kind: b.kind || 'free', trainee_id: b.trainee_id || null, data: { objs: j.objs, imgs: j.imgs }, cam: j.cam, updated_at: new Date().toISOString() })
      });
      b.updated = Date.now();
    } catch (e) { status('offline', 'فشل الحفظ'); toast('فشل حفظ السبيس: ' + e.message); unsaved = true; failed = true; }
  }
  pumping = false;
  if (!jobs.size && cur && !failed) status('saved', 'تم الحفظ');
}
async function saveCam() {
  if (!cloud || !cur) return;
  try { await cloud.fetch('space_boards?id=eq.' + encodeURIComponent(cur.id), { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ cam }) }); } catch {}
}
function mapRow(r) { return { id: r.id, name: r.name, kind: r.kind, trainee_id: r.trainee_id, updated: Date.parse(r.updated_at) || 0 }; }
async function enterCloud(api) {
  if (cloud) return;
  if (cur) saveNow();                               /* آخر حاجة اتعملت محليًا تتحفظ محليًا قبل التحويل */
  clearTimeout(saveT); saveT = 0;
  cloud = api; cur = null; objs = []; imgs = {}; imgCache = {}; sel = null;
  status('saving', 'جارٍ تحميل السبيس…');
  try {
    const rows = await (await api.fetch('space_boards?select=id,name,kind,trainee_id,updated_at&order=updated_at.desc')).json();
    let list = (Array.isArray(rows) ? rows : []).map(mapRow);
    if (!list.some(b => b.id === CLOUD_MAIN)) {
      const main = { id: CLOUD_MAIN, name: 'Space', kind: 'main', updated: Date.now() };
      await api.fetch('space_boards?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ id: main.id, name: main.name, kind: main.kind, data: {} }) });
      list.unshift(main);
    }
    boards = list.sort((a, b) => (b.id === CLOUD_MAIN) - (a.id === CLOUD_MAIN));
    const want2 = new URLSearchParams(location.search).get('b');
    await openBoard(boards.some(b => b.id === want2) ? want2 : CLOUD_MAIN);
  } catch (e) {
    cloud = null; status('offline', 'فشل تحميل السبيس');
    toast('تعذّر تحميل السبيس: ' + e.message + ' (شغّل 01_space.sql في Supabase لو لسه)');
  }
}

function newBoard(name) {
  const b = { id: uid(), name: name || 'لوحة بدون اسم', updated: Date.now() };
  if (cloud) { b.kind = 'free'; boards.push(b); return b; }
  boards.unshift(b); LS.set('thabit_index', boards); return b;
}
async function openBoard(id) {
  closeEditor(); if (cur) saveNow();
  const b = boards.find(x => x.id === id); if (!b) return;
  const seq = ++loadSeq;
  let d = null;
  if (cloud) {
    status('saving', 'جارٍ التحميل…');
    try {
      const r = await (await cloud.fetch('space_boards?select=data,cam&id=eq.' + encodeURIComponent(id))).json();
      const row = Array.isArray(r) && r[0];
      d = row ? { objs: row.data && row.data.objs, imgs: row.data && row.data.imgs, cam: row.cam } : null;
    } catch (e) { toast('تعذّر تحميل اللوحة: ' + e.message); status('offline', 'فشل التحميل'); return; }
    if (seq !== loadSeq) return;
  } else d = LS.get('thabit_b_' + id, null);
  cur = b; objs = d?.objs || []; imgs = d?.imgs || {}; imgCache = {};
  objs.forEach(o => { /* ترقية النصوص القديمة لشكل البوكس */
    if (o.t === 't' && o.w == null) { const fs = o.size || 28; mctx.font = `500 ${fs}px ${FONT}`; const ls = (o.text || '').split('\n'); o.fs = fs; o.fit = false; o.w = Math.max(80, ...ls.map(l => mctx.measureText(l).width)) + 12; o.h = ls.length * fs * 1.35 + 12; }
  });
  cam = d?.cam || { x: innerWidth / 2, y: innerHeight / 2, z: 1 };
  undo = []; redo = []; sel = null; syncUndo();
  $('#title').value = b.name;
  try { const q = new URLSearchParams(location.search); q.set('b', id); history.replaceState(null, '', '?' + q.toString()); } catch {}
  status('saved', 'تم الحفظ'); draw(); renderProps();
}
function deleteBoard(id) {
  if (cloud) {
    if (id === CLOUD_MAIN) { toast('السبيس الرئيسية ما تتمسحش'); return; }
    cloud.fetch('space_boards?id=eq.' + encodeURIComponent(id), { method: 'DELETE' }).catch(e => toast('فشل المسح: ' + e.message));
    boards = boards.filter(b => b.id !== id); jobs.delete(id);
    if (cur && cur.id === id) { cur = null; openBoard(CLOUD_MAIN); }
    return;
  }
  boards = boards.filter(b => b.id !== id); LS.set('thabit_index', boards);
  try { localStorage.removeItem('thabit_b_' + id); } catch {}
  if (cur && cur.id === id) { cur = null; if (!boards.length) newBoard(); openBoard(boards[0].id); }
}
async function flush() { if (cloud && cur && unsaved) saveNow(); while (pumping || jobs.size) await new Promise(r => setTimeout(r, 100)); }
window.ThabitBoard = { flush, enterCloud, isCloud: () => !!cloud, current: () => cur };
$('#title').addEventListener('input', e => { if (cur) { cur.name = e.target.value; dirty(); } });
if (viewMode) { $('#title').readOnly = true; const k = $('#kindTag'); k.hidden = false; k.textContent = 'عرض فقط'; }

/* panels */
const boardsP = $('#boardsPanel'), shareP = $('#sharePanel');
function renderBoards() {
  boardsP.innerHTML = '<b>لوحاتي</b>' + boards.map(b => `<div class="row ${cur && b.id === cur.id ? 'on' : ''}" data-id="${b.id}"><span class="grow">${esc(b.name || 'بدون اسم')}</span>${b.id === CLOUD_MAIN ? '' : `<button class="ib" data-del="${b.id}" title="حذف">${ICON_X}</button>`}</div>`).join('') + '<button class="pill dark" id="newBoardBtn">+ لوحة جديدة</button>';
}
boardsP.addEventListener('click', e => {
  const del = e.target.closest('[data-del]');
  if (del) { if (confirm('حذف اللوحة نهائياً؟')) { deleteBoard(del.dataset.del); renderBoards(); } return; }
  if (e.target.closest('#newBoardBtn')) { saveNow(); openBoard(newBoard().id).then(() => { if (cloud) saveNow(); }); boardsP.hidden = true; return; }
  const row = e.target.closest('[data-id]'); if (row) { openBoard(row.dataset.id); boardsP.hidden = true; }
});
$('#btnBoards').onclick = () => { shareP.hidden = true; renderBoards(); boardsP.hidden = !boardsP.hidden; };
function renderShare() {
  const link = location.origin + location.pathname + '?b=' + cur.id + '&mode=view';
  shareP.innerHTML = `<b>مشاركة</b><small>${cloud ? 'اللوحة محفوظة في السحابة. روابط الجلسات المشتركة جاية في المرحلة 3' : 'الرابط بيفتح على نفس الجهاز لحد ما نربط السيرفر'}</small><input id="shLink" readonly dir="ltr" value="${esc(link)}"><button class="pill dark" id="shCopy">نسخ الرابط</button><hr><button class="pill" id="shPng">حفظ كصورة</button><button class="pill" id="shExp">تصدير ملف</button><button class="pill" id="shImp">استيراد ملف</button>`;
}
shareP.addEventListener('click', e => {
  const id = e.target.closest('button')?.id;
  if (id === 'shCopy') navigator.clipboard?.writeText($('#shLink').value).then(() => toast('تم نسخ الرابط'), () => { $('#shLink').select(); toast('انسخه يدوياً'); });
  else if (id === 'shPng') exportPng();
  else if (id === 'shExp') exportJson();
  else if (id === 'shImp') { const f = document.createElement('input'); f.type = 'file'; f.accept = '.json'; f.onchange = () => f.files[0] && importJson(f.files[0]); f.click(); }
});
$('#btnShare').onclick = () => { boardsP.hidden = true; renderShare(); shareP.hidden = !shareP.hidden; };
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('.sheet, #btnBoards, #btnShare')) { boardsP.hidden = true; shareP.hidden = true; }
  if (!e.target.closest('.pop, #btnShapes, #btnImage')) document.querySelectorAll('.pop').forEach(p => p.hidden = true);
});

/* login (جاهز للربط) */
$('#loginForm').addEventListener('submit', e => { e.preventDefault(); $('#lgErr').textContent = Backend.enabled ? '' : 'السيرفر غير مربوط بعد'; });

/* ---------- keyboard ---------- */
const typing = e => /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
document.addEventListener('keydown', e => {
  if (typing(e)) return;
  const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
  if (e.code === 'Space') { S.space = true; e.preventDefault(); return; }
  if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? doRedo() : doUndo(); return; }
  if (mod && k === 'y') { e.preventDefault(); doRedo(); return; }
  if (mod && k === 'd') { e.preventDefault(); canEdit() && dupSel(); return; }
  if (mod) return;
  if (e.shiftKey && e.key === '!') { fit(); return; }
  if (k === 'delete' || k === 'backspace') { canEdit() && delSel(); return; }
  if (k === 'escape') { sel = null; setTool('select'); return; }
  const tools = { v: 'select', h: 'hl', p: 'pen', e: 'eraser', t: 'text', s: 'sticky' };
  const shapes = { r: 'rect', o: 'ellipse', a: 'arrow', l: 'line' };
  if (!canEdit()) { if (k === 'v') setTool('select'); return; }
  if (tools[k]) setTool(tools[k]);
  else if (shapes[k]) { S.shape = shapes[k]; setTool('shape'); }
});
document.addEventListener('keyup', e => { if (e.code === 'Space') S.space = false; });

/* ---------- init ---------- */
addEventListener('resize', resize);
addEventListener('beforeunload', e => {
  if (cloud) { if (unsaved || jobs.size || pumping) { saveNow(); e.preventDefault(); e.returnValue = ''; } return; }
  saveNow();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && cloud && unsaved) saveNow(); });
addEventListener('online', () => status('saved', 'متصل'));
addEventListener('offline', () => status('offline', 'بدون إنترنت'));

setTheme(LS.get('thabit_theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
if (!boards.length) newBoard();
resize();
const want = params.get('b');
if (want && !boards.some(b => b.id === want) && !params.has('admin') && !hasAdminSession()) {
  if (viewMode) { $('#goneTxt').textContent = 'اللوحة غير موجودة على هذا الجهاز'; $('#gone').hidden = false; }
  else boards.unshift({ id: want, name: 'لوحة بدون اسم', updated: Date.now() });
}
openBoard(boards.some(b => b.id === want) ? want : boards[0].id);
setTool('select');
})();
