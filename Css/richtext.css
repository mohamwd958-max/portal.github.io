/* ==========================================================
   Thabit rich text: shared by the admin panel (preview) and the dashboard.
   Colors are NAMES (gold, green...) with one shade per theme, so text stays
   readable when the theme flips. Every pair was checked for >= 4.5:1 contrast
   against the site's dark (#030712 / #0b1220 / #0f172a) and light
   (#ffffff / #f8fafc / #f1f5f9) backgrounds.
   ========================================================== */
:root {
  --rt-gold: #fbbf24; --rt-green: #34d399; --rt-red: #fb7185; --rt-blue: #60a5fa;
  --rt-purple: #c4b5fd; --rt-orange: #fb923c; --rt-gray: #94a3b8; --rt-link: #38bdf8;
}
body.light-theme, .rt-light {
  --rt-gold: #a16207; --rt-green: #047857; --rt-red: #be123c; --rt-blue: #1d4ed8;
  --rt-purple: #6d28d9; --rt-orange: #c2410c; --rt-gray: #475569; --rt-link: #0369a1;
}
.rt-dark {
  --rt-gold: #fbbf24; --rt-green: #34d399; --rt-red: #fb7185; --rt-blue: #60a5fa;
  --rt-purple: #c4b5fd; --rt-orange: #fb923c; --rt-gray: #94a3b8; --rt-link: #38bdf8;
}
.rt-c-gold { color: var(--rt-gold); }   .rt-c-green { color: var(--rt-green); }
.rt-c-red { color: var(--rt-red); }     .rt-c-blue { color: var(--rt-blue); }
.rt-c-purple { color: var(--rt-purple); } .rt-c-orange { color: var(--rt-orange); }
.rt-c-gray { color: var(--rt-gray); }

/* a "Hyperlinked" word: different colour + underline; the dashboard plays its recording on tap */
.rt-link { color: var(--rt-link); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.5px; cursor: pointer; }

/* rendered body: capsules (blocks), lines, numbering, separators */
.rt-body { display: flex; flex-direction: column; gap: 8px; line-height: 1.8; overflow-wrap: anywhere; }
.rt-cap { padding: 8px 12px; border-radius: 12px; background: rgba(148,163,184,.10); border: 1px solid rgba(148,163,184,.22); }
.rt-ln { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 10px; }
.rt-no { flex: none; font-weight: 800; color: var(--rt-gold); min-width: 1.4em; }
.rt-sep { align-self: stretch; width: 1px; min-height: 1em; background: currentColor; opacity: .25; margin: 0 4px; }
.rt-txt { min-width: 0; }
/* ---------- student side: Hyperlinked words ---------- */
.rt-link[data-word] { border-radius: 4px; padding: 0 2px; transition: background-color .2s; }
.rt-link[data-word]:hover, .rt-link[data-word]:focus-visible { background: color-mix(in srgb, var(--rt-link) 18%, transparent); outline: none; }
.rt-link.rt-pulse { animation: rtPulse 1.5s ease-in-out 3; }
.rt-link.rt-playing { background: color-mix(in srgb, var(--rt-link) 28%, transparent); }
@keyframes rtPulse { 0%, 100% { background-color: transparent; } 50% { background-color: color-mix(in srgb, var(--rt-link) 30%, transparent); } }
@media (prefers-reduced-motion: reduce) { .rt-link.rt-pulse { animation: none; } }

.rt-pop { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 2147483000; width: min(92vw, 380px); padding: 14px 16px; border-radius: 16px; background: #0f172a; color: #f1f5f9; border: 1px solid rgba(251,191,36,.6); box-shadow: 0 20px 60px rgba(0,0,0,.55); font-family: 'Cairo','Inter',sans-serif; animation: rtPopIn .28s ease; }
body.light-theme .rt-pop { background: #fff; color: #0f172a; border-color: #a16207; }
@keyframes rtPopIn { from { opacity: 0; transform: translate(-50%, 14px); } to { opacity: 1; transform: translate(-50%, 0); } }
.rt-pop p { font-weight: 700; font-size: .9rem; line-height: 1.6; margin: 0 0 10px; }
.rt-pop-b { display: flex; gap: 8px; }
.rt-pop-b button { flex: 1; padding: 9px 12px; border-radius: 10px; border: 0; cursor: pointer; font: 800 .8rem 'Cairo',sans-serif; color: #fff; background: #475569; }
.rt-pop-b button.go { background: #2563eb; }
.rt-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 2147483000; padding: 10px 16px; border-radius: 12px; background: #b45309; color: #fff; font: 700 .85rem 'Cairo',sans-serif; }
