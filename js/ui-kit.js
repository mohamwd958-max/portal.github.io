/* ============================================================
   UI KIT (ui-kit.js)  -  مكتبة تأثيرات الواجهة
   ------------------------------------------------------------
   الفكرة: كل تأثير بلوك كامل ومستقل، وفوقه كومنت فيه كلمات مفتاحية.
   علامة البداية (FX: الاسم) وعلامة النهاية (END FX: الاسم)، كل واحدة بين أقواس مربعة.

   للبحث:  دوّر على أي كلمة من الـ keywords، أو على علامة البداية باسم التأثير.
   للحذف:  امسح من علامة البداية لحد علامة النهاية بنفس الاسم.
   الإعدادات: كل تأثير عنده CFG جواه، ودي الحاجة الوحيدة اللي بتتغير من مشروع لمشروع.
   تأثير جديد: ضيفه بنفس الشكل، وضيف سطر ليه في الفهرس اللي تحت.
   ============================================================ */


/* ============================================================
   [SECTION: KIT-INDEX] فهرس التأثيرات
   طريقة القراءة (للـ AI): اقرا الفهرس ده بس. دوّر على الرقم أو الاسم أو أي اسم بديل،
   وبعدين افتح الأسطر المحددة بس (من → إلى) وماتقراش باقي الملف.
   الأسطر = من أول سطر في البلوك (خط الفاصل) لحد سطر علامة النهاية.
   لما تضيف أو تمسح تأثير: حدّث الأسطر هنا (دوّر على علامة البداية [FX: الاسم]).
   ------------------------------------------------------------
   [1] real-click
       أسماء تانية : ريل كليك، press، tap، button-press، ضغط الزرار
       الأسطر      : 85 → 218         (علامة: [FX: real-click])
       الاستدعاء   : RealClick.init()
       بيعمل إيه   : الزرار ينزل لما تدوس ويرجع لما تسيبه، والسحب أو الخروج من حدوده بيلغي الفعل

   [2] slide-select
       أسماء تانية : سلايد سيلكت، سكرول كليك، scrub-select، drag-to-select، press-slide،
                     slide-to-select، touch-scrub، fisheye، dock، تمرير الاختيار
       الأسطر      : 221 → 337         (علامة: [FX: slide-select])
       الاستدعاء   : SlideSelect.init()  + data-slide-select على الحاوية
       بيعمل إيه   : تدوس وتسحب على مجموعة زراير، اللي تحت صباعك يكبر (من غير بوردر) واللي حواليه يتبعدوا عنه
                     بنسبة بتقل مع البعد، والفعل بيحصل على اللي ترفع عليه بس، وبيفضل محدد بخلفية أفتح

   [3] mono-horizontal-swipe
       أسماء تانية : مونو هورايزون سوايب، mono-swipe، mono-h-swipe، page-swipe، blur-swipe،
                     single-page-swipe، سوايب الصفحات، سوايب أفقي، الديسكريبشن والبلور
       الأسطر      : 340 → 472         (علامة: [FX: mono-horizontal-swipe])
       الاستدعاء   : MonoSwipe.init()  + data-mono-swipe على الحاوية، data-page على كل صفحة، data-desc على الديسكريبشن
       بيعمل إيه   : صفحة واحدة ظاهرة، تسحب أفقياً فالجديدة تغطي القديمة. الديسكريبشن القديم يرجع عكس دخوله
                     بفيد وبلور، الصفحة القديمة تتغبّش لحد ما تختفي، والجديد يظهر. بيتبع اتجاه dir (RTL/LTR)
   [4] mono-vertical-swipe
       أسماء تانية : مونو فيرتيكال سوايب، mono-v-swipe، vertical-swipe، page-swipe-v، blur-swipe-v،
                     سوايب رأسي، سوايب عمودي، الديسكريبشن والبلور (رأسي)
       الأسطر      : 475 → 606         (علامة: [FX: mono-vertical-swipe])
       الاستدعاء   : MonoVSwipe.init()  + data-mono-vswipe على الحاوية، data-page على كل صفحة، data-desc على الديسكريبشن
       بيعمل إيه   : نفس رقم 3 بالظبط بس رأسي: تسحب لفوق فالصفحة الجديدة تطلع من تحت وتغطي القديمة،
                     نفس توقيتات الفيد والبلور. السحب لتحت بيرجّع للصفحة اللي قبلها
   [5] in-order-show
       أسماء تانية : إن أوردر شو، order-show، ordered-reveal، staggered-reveal، stagger-in، cells-reveal،
                     generator-reveal، wave-in، ظهور بالترتيب، ظهور السيلز
       الأسطر      : 609 → 708         (علامة: [FX: in-order-show])
       الاستدعاء   : OrderShow.init()  + data-order-show على الحاوية، data-order-trigger="#idالحاوية" على الزرار
       بيعمل إيه   : عناصر الحاوية (سيلز/زراير/صور) تطلع ورا بعض من ورا الزرار اللي اتداس عليه بحسب مكانه
                     (شمال/يمين/فوق/تحت)، كل واحد يبدأ بلور وشفاف ثم يبوب كأنه بيعدي مطب ويكمل ويقف. بيظبط نفسه على مقاس كل عنصر تلقائي
                     (صغير/عريض/كبير)، والكروت العريضة مع زرار شمال/يمين بتدخل أفقي في صفها بالترتيب من فوق. بيشتغل أول مرة وعند الريلود
   [6] skeleton
       أسماء تانية : سكيلتون، skeleton-loader، loading-placeholder، placeholder، loading، لودينج،
                     data-loading، sticky-note، typewriter، chart-draw، notification-badge، badge-counter، عداد النوتيفيكيشن
       الأسطر      : 711 → 964         (علامة: [FX: skeleton])
       الاستدعاء   : Skeleton.init()  ثم  Skeleton.show(el) / Skeleton.hide(el) / Skeleton.wrap(el, promise)  + data-skel="image|chart|text"
                     وللعداد: Skeleton.badge.show(btn) / .set(btn, n) / .clear(btn)
       بيعمل إيه   : أي مكان بيستنى داتا بيتفرّغ ويتحط مكانه حركة لحد ما الداتا توصل: صورة = ستيكي نوت بلوجو بتاعنا (ركنها مثني)،
                     تشارت = خط رأسي ثم أفقي ثم منحنى، نص = كتابة حرف حرف. الصفحة شغالة، والحركة بتقف لما تدوس على أي حاجة.
                     من غير ألوان: اللون أبيض/رصاصي مطفي حسب الخلفية وبيتبع الثيم. العداد: دايرة على الزرار بتعد من 70 بالراحة
                     وأول ما الرقم الحقيقي يوصل تنزل له بسرعة ودراما (0 أو وصلت صفر = تتشال)

   [7] under-construction
       أسماء تانية : أندر كونستركشن، under-maintenance، maintenance، hammer، hammer-strike، مطرقة، شاكوش، صيانة، تحت الصيانة، تحت الإنشاء
       الأسطر      : 967 → 1111         (علامة: [FX: under-construction])
       الاستدعاء   : UnderConstruction.init()  ثم  UnderConstruction.play(root, { first })  + data-maint على الزرار/الاختيار تحت الصيانة
       بيعمل إيه   : مطرقة صغيرة 2D (خطوط فاضية) فوق أول حافة الزرار، بتترفع بالراحة وتدق بقوة على جزء الحافة اللي تحتها فينوّر ويطلع شرار.
                     زرار واحد: دقتين أول مرة ودقة بعد الريفرش. أكتر من زرار: الأول بس بيتدق دقة، والباقي مطارق مايلة بتظهر بفيد
   [8] typography-thabit-1  (الخط: ثابت 1)
       أسماء تانية : ثابت 1، thabit 1، thabit-1، typography، تايبوجرافي، الخط، الخطوط، font، حجم الخط،
                     Inter، Cairo، Playfair Display، خطوط صفحة landing
       الأسطر      : 1114 → 1218         (علامة: [FX: typography-thabit-1])
       الاستدعاء   : Typography.init()  + class="t-brand | t-title | t-body | t-btn ..." (20 role)
       بيعمل إيه   : خط ثابت 1: Inter للإنجليزي، Cairo للعربي، Playfair للعناوين الكبيرة، html 90%. نسخة العربي بتتفعّل من lang="ar"

   ============================================================ */
/* [END SECTION: KIT-INDEX] */


/* ============================================================
   [FX: real-click]
   keywords: real click, ريل كليك, ضغط الزرار, زرار بينزل, press, tap, button press, scale down, swipe cancel
   what:  أي زرار لما تدوس عليه ينزل (scale) ولما ترفع صباعك يرجع بنفس السرعة أو أسرع.
          الدوسة السريعة والطويلة نفس الشكل (النزول بيكمل لحد الآخر دايماً).
          لو رفعت بسحب (swipe)، أو صباعك طلع برّه حدود الزرار: الزرار يرجع لفوق والفعل (click) ما يحصلش.
   usage: RealClick.init()                       ← مرة واحدة، بيشتغل على أي زرار حتى اللي يتضاف بعدين
          RealClick.init({ scale: 0.9 })         ← تغيير أي قيمة من CFG
          data-no-realclick على أي عنصر           ← يستثنيه هو وأولاده
          data-realclick على أي عنصر مش زرار      ← يضمّه للتأثير
   events: realclick:cancel بيطلع على العنصر لما الفعل يتلغى، و event.detail.reason = left | swipe | cancel
   needs: متصفح حديث (بيستخدم خاصية scale و Web Animations). مش محتاج CSS. العنصر لازم يبقى مش inline.
   ============================================================ */
const RealClick = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    selector: 'button, [role="button"], .btn, [data-realclick]',   // مين يشتغل عليه التأثير
    optOut: '[data-no-realclick]',                                  // مين يتستثنى
    scale: 0.94,          // حجم الزرار وهو نازل
    downMs: 110,          // زمن النزول
    upMs: 100,            // زمن الرجوع (نفس النزول أو أسرع)
    minHoldMs: 120,       // أقل وقت يفضل فيه نازل، عشان الدوسة السريعة ما تقطعش النزول
    easingDown: 'cubic-bezier(.2,.7,.3,1)',
    easingUp: 'ease-out',
    moveTolerance: 10,    // لو صباعك اتحرك أكتر من كده (px) يبقى swipe مش ضغطة
    respectReducedMotion: true   // لو الجهاز مفعّل "تقليل الحركة" التأثير البصري يتوقف (الفعل بيشتغل عادي)
  };

  const state = new WeakMap();   // حالة كل زرار: الأنيميشن الحالي ومؤقت الرجوع
  let active = null;             // الدوسة الشغالة دلوقتي
  let suppress = null;           // لو لازم نمنع الـ click اللي جاي بعد swipe
  let inited = false;

  const get = (el) => { let s = state.get(el); if (!s) { s = { anim: null, token: 0, timer: 0 }; state.set(el, s); } return s; };
  const reduced = () => CFG.respectReducedMotion && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disabled = (el) => el.disabled || el.getAttribute('aria-disabled') === 'true';
  const curScale = (el) => { const n = parseFloat(getComputedStyle(el).scale); return isFinite(n) ? n : 1; };
  const notify = (el, reason) => el.dispatchEvent(new CustomEvent('realclick:cancel', { bubbles: true, detail: { reason } }));

  function inside(el, x, y) {
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  /* ---- الأنيميشن: بيستخدم scale المستقل، فمش بيلمس transform ولا transition الموجودين على الزرار ---- */
  function down(el) {
    if (reduced()) return;
    const s = get(el);
    s.token++; clearTimeout(s.timer);
    const from = curScale(el);
    const next = el.animate([{ scale: from }, { scale: CFG.scale }], { duration: CFG.downMs, easing: CFG.easingDown, fill: 'forwards' });
    if (s.anim) s.anim.cancel();
    s.anim = next;
  }

  function up(el, delay) {
    const s = get(el);
    if (!s.anim) return;
    const tk = ++s.token; clearTimeout(s.timer);
    const go = () => {
      if (s.token !== tk) return;                       // اتدس تاني قبل ما نرجع: الأحدث يكسب
      const from = curScale(el);
      const back = el.animate([{ scale: from }, { scale: 1 }], { duration: CFG.upMs, easing: CFG.easingUp, fill: 'forwards' });
      if (s.anim) s.anim.cancel();
      s.anim = back;
      back.onfinish = () => { if (s.anim === back) { back.cancel(); s.anim = null; } };   // نمسح الأثر ويرجع الزرار لطبيعته
    };
    delay > 0 ? (s.timer = setTimeout(go, delay)) : go();
  }

  /* ---- مراقبة الصباع/الماوس ---- */
  function onDown(e) {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const el = e.target.closest && e.target.closest(CFG.selector);
    if (!el || el.closest(CFG.optOut) || disabled(el)) return;
    suppress = null;
    if (active) { up(active.el, 0); active = null; }
    active = { el, id: e.pointerId, x: e.clientX, y: e.clientY, t0: performance.now(), moved: false, left: false };
    down(el);
  }

  function onMove(e) {
    if (!active || e.pointerId !== active.id) return;
    if (!active.moved && Math.hypot(e.clientX - active.x, e.clientY - active.y) > CFG.moveTolerance) active.moved = true;
    if (!active.left && !inside(active.el, e.clientX, e.clientY)) {   // خرج برّه الحدود: يرجع فوراً ومفيش فعل
      active.left = true;
      up(active.el, 0);
      notify(active.el, 'left');
    }
  }

  function onUp(e) {
    if (!active || e.pointerId !== active.id) return;
    const a = active; active = null;
    if (a.moved || a.left) {
      suppress = { el: a.el, until: performance.now() + 500 };        // نمنع الـ click اللي المتصفح هيبعته
      if (!a.left) notify(a.el, 'swipe');
    }
    if (!a.left) up(a.el, Math.max(0, CFG.minHoldMs - (performance.now() - a.t0)));
  }

  function onCancel(e) {                                                // المتصفح خد الحركة (سكرول مثلاً)
    if (!active || e.pointerId !== active.id) return;
    const a = active; active = null;
    up(a.el, 0);
    if (!a.left) notify(a.el, 'cancel');
  }

  function onClickCapture(e) {
    if (!suppress) return;
    if (performance.now() > suppress.until) { suppress = null; return; }
    if (suppress.el.contains(e.target)) {
      e.preventDefault(); e.stopImmediatePropagation();                 // الزرار ما يتفعّلش
      suppress = null;
    }
  }

  function onBlur() { if (active) { up(active.el, 0); active = null; } }

  function init(overrides) {
    if (overrides) Object.assign(CFG, overrides);
    if (inited) return;
    inited = true;
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerup', onUp, { capture: true, passive: true });
    document.addEventListener('pointercancel', onCancel, { capture: true, passive: true });
    document.addEventListener('click', onClickCapture, true);
    window.addEventListener('blur', onBlur);
  }

  return { init, CFG };
})();
/* [END FX: real-click] */


/* ============================================================
   [FX: slide-select]
   keywords: slide select, سلايد سيلكت, سكرول كليك, scrub select, drag to select, press slide, touch scrub, تمرير الاختيار, segmented, tabs, fisheye, dock
   what:  مجموعة زراير جوه حاوية. تدوس على زرار: يكبر (من غير أي بوردر) والزراير اللي حواليه تتبعد عنه
          عشان ما يلزقش فيهم: اللي جنبه يتبعد أكتر، واللي بعده أقل، وهكذا (إحساس إن اللي تحت صباعك هو القريب بس).
          تسحب على زرار تاني من غير ما ترفع: نفس الشيء بيحصل عليه والأول يرجع لحجمه. تسحب برّه كل الزراير: الكل عادي.
          ترفع على زرار: الفعل (click) بيحصل عليه هو بس، ويفضل محدد بخلفية أفتح من أخواته (أو أغمق لو لونه فاتح أصلاً)
          وبحجم أكبر شوية. ترفع برّه: ما يحصلش حاجة والتحديد القديم يرجع.
   usage: SlideSelect.init()                     ← مرة واحدة
          <div data-slide-select> ...زراير... </div>
          SlideSelect.init({ grow: 0.4, spread: 14 })   ← تغيير أي قيمة من CFG
          الزرار المحدد حالياً عليه attribute اسمه data-selected
   events: slideselect:change بيطلع على الزرار اللي اتحدد
   needs: متصفح حديث (scale و translate و color-mix). بيحط touch-action:none على الحاوية (السكرول بإصبعك فوقها بيتقفل).
          بيكتب transition و scale و translate و background-color inline على الزراير.
          ماتستخدمهوش مع RealClick على نفس الزراير: حط data-no-realclick على الحاوية.
   ============================================================ */
const SlideSelect = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    group: '[data-slide-select]',                  // الحاوية
    item: 'button, [role="button"], .btn',         // الزراير اللي جواها
    grow: 0.25,        // تكبير اللي تحت الصباع (0.25 = 125% من حجمه)
    selGrow: 0.05,     // تكبير المحدد بعد الاختيار
    spread: 10,        // المسافة الإضافية (px) حوالين اللي تحت الصباع
    fall: 0.5,         // كل خطوة بعد، المسافة الإضافية بتقل للنسبة دي
    reach: 4,          // أبعد عدد زراير بيتأثر بالمسافة الإضافية
    tone: 0.18,        // قد إيه خلفية المحدد تفتح (أو تغمق لو فاتحة) 0..1
    ms: 140            // سرعة الانتقال
  };

  let cur = null;      // الدوسة الشغالة: { g: الحاوية, id }
  let inited = false;
  const bases = new WeakMap();                     // لون خلفية كل زرار الأصلي

  const items = (g) => [...g.querySelectorAll(CFG.item)];
  const ok = (el) => !el.disabled && el.getAttribute('aria-disabled') !== 'true';
  const under = (g, x, y) => {                     // الزرار اللي تحت الصباع (جوه نفس الحاوية)
    const el = document.elementFromPoint(x, y)?.closest(CFG.item);
    return el && g.contains(el) && ok(el) ? el : null;
  };

  function tone(el) {                              // خلفية المحدد: أفتح من الأصلية، أو أغمق لو الأصلية فاتحة
    const b = bases.get(el), m = b.match(/[\d.]+/g).map(Number);
    const light = (m.length > 3 ? m[3] : 1) > 0.1 && 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2] > 186;
    return `color-mix(in srgb, ${b} ${100 - CFG.tone * 100}%, ${light ? '#000' : '#fff'})`;
  }

  /* press=true: اللي تحت الصباع بيكبر والباقي بيتبعد عنه. press=false: المحدد بس بحجم أكبر شوية */
  function paint(g, hot, press) {
    const all = items(g), h = all.indexOf(hot);
    const c = (e) => [e.offsetLeft + e.offsetWidth / 2, e.offsetTop + e.offsetHeight / 2];
    const [hx, hy] = h < 0 ? [0, 0] : c(hot);
    all.forEach((el, i) => {
      if (!bases.has(el)) bases.set(el, getComputedStyle(el).backgroundColor);
      let s = !press && el.hasAttribute('data-selected') ? 1 + CFG.selGrow : 1, x = 0, y = 0;
      if (press && el === hot) s = 1 + CFG.grow;
      else if (press && h >= 0) {                  // بعّده عن اللي تحت الصباع بنفس اتجاهه
        const [cx, cy] = c(el), vx = cx - hx, vy = cy - hy, len = Math.hypot(vx, vy) || 1, ux = vx / len, uy = vy / len;
        const d = Math.min(Math.abs(i - h), CFG.reach);
        const mag = (Math.abs(ux) * hot.offsetWidth / 2 + Math.abs(uy) * hot.offsetHeight / 2) * CFG.grow   // مساحة التكبير
                  + CFG.spread * (1 - CFG.fall ** d) / (1 - CFG.fall);                                      // الفاصل: أكبر جنبه وبيقل
        x = ux * mag; y = uy * mag;
      }
      el.style.transition = `scale ${CFG.ms}ms ease, translate ${CFG.ms}ms ease, background-color ${CFG.ms}ms ease`;
      el.style.scale = s === 1 ? '' : s;
      el.style.translate = x || y ? `${x}px ${y}px` : '';
      el.style.backgroundColor = el.hasAttribute('data-selected') ? tone(el) : '';
    });
  }

  function onDown(e) {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const g = e.target.closest?.(CFG.group);
    const el = g && under(g, e.clientX, e.clientY);
    if (!el) return;
    cur = { g, id: e.pointerId };
    paint(g, el, true);
  }

  function onMove(e) {
    if (cur && e.pointerId === cur.id) paint(cur.g, under(cur.g, e.clientX, e.clientY), true);
  }

  function onUp(e) {
    if (!cur || e.pointerId !== cur.id) return;
    const g = cur.g, hot = e.type === 'pointerup' ? under(g, e.clientX, e.clientY) : null;   // cancel = ولا فعل
    cur = null;
    if (hot) { items(g).forEach((i) => i.removeAttribute('data-selected')); hot.setAttribute('data-selected', ''); }
    paint(g, null, false);
    if (hot) { hot.dispatchEvent(new CustomEvent('slideselect:change', { bubbles: true })); hot.click(); }
  }

  /* الـ click الطبيعي بيتمنع (المتصفح مش بيبعته صح لو بدأت على زرار وخلصت على غيره)، واحنا بنعمله بإيدينا فوق */
  function onClick(e) {
    if (e.isTrusted && e.detail > 0 && e.target.closest?.(CFG.group) && e.target.closest(CFG.item)) {
      e.preventDefault(); e.stopImmediatePropagation();
    }
  }

  function init(overrides) {
    if (overrides) Object.assign(CFG, overrides);
    if (inited) return;
    inited = true;
    const st = document.createElement('style');
    st.textContent = `${CFG.group}{touch-action:none;-webkit-user-select:none;user-select:none}`;
    document.head.append(st);
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerup', onUp, { capture: true, passive: true });
    document.addEventListener('pointercancel', onUp, { capture: true, passive: true });
    document.addEventListener('click', onClick, true);
  }

  return { init, CFG };
})();
/* [END FX: slide-select] */


/* ============================================================
   [FX: mono-horizontal-swipe]
   keywords: mono horizontal swipe, مونو هورايزون سوايب, mono swipe, page swipe, blur swipe, سوايب الصفحات, description blur, rtl, ltr
   what:  حاوية فيها صفحات، واحدة بس ظاهرة. السحب الأفقي بيغطي القديمة بالجديدة (p = نسبة التغطية).
          الربع الأول (p < q1): ديسكريبشن القديمة يرجع عكس اتجاه دخوله + فيد + بلور على الكلمة نفسها (من غير بوكس).
          من q1 لـ q2: الصفحة القديمة تتغبّش لحد ما تختفي تماماً.
          من q1 لـ q3: ديسكريبشن الجديدة يظهر (من نفس اتجاه دخوله).
          ترفع صباعك: لو عدّيت commit أو السحبة سريعة تكمل وتغطي، غير كده ترجع.
          اتجاه الدخول بيتبع dir الحاوية: LTR الكلام يدخل شمال←يمين والسحب للأمام شمال، RTL العكس.
          أول ظهور للصفحة الأولى فيه intro بطيء متوسط للديسكريبشن.
   usage: <div data-mono-swipe dir="rtl">
            <section data-page><h1 data-desc>...</h1></section>
            <section data-page>...</section>
          </div>
          MonoSwipe.init()                       ← مرة واحدة
          MonoSwipe.init({ introMs: 500 })       ← تغيير أي قيمة من CFG
          MonoSwipe.mount(box)                   ← لو الحاوية اتضافت بعد init
   events: monoswipe:change على الحاوية، و event.detail.index = رقم الصفحة الجديدة
   needs: متصفح حديث. بيحط position/overflow/touch-action:pan-y (السكرول الرأسي شغال) على الحاوية والصفحات.
          الأفقي بس دلوقتي، الرأسي يتضاف بعدين.
   ============================================================ */
const MonoSwipe = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    box: '[data-mono-swipe]', page: '[data-page]', desc: '[data-desc]',
    q: [0.25, 0.5, 0.75],  // q1 القديم يختفي ويبدأ الجديد | q2 القديمة تتغبّش تماماً | q3 الجديد يكتمل
    shift: 40,             // مسافة حركة الديسكريبشن (px)
    descBlur: 8,           // أقصى بلور للديسكريبشن (px)
    pageBlur: 24,          // أقصى بلور للصفحة القديمة (px)
    introMs: 700,          // مدة intro الديسكريبشن
    settleMs: 320,         // مدة إكمال السحبة أو رجوعها
    commit: 0.3,           // أقل تغطية عشان تكمل
    flick: 0.5             // أو سرعة (px/ms) تعتبر سحبة سريعة
  };

  const st = new WeakMap();
  let cur = null, inited = false;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = (u) => 1 - (1 - u) ** 3;
  const dirOf = (box) => (getComputedStyle(box).direction === 'rtl' ? 1 : -1);   // اتجاه دخول الكلام: RTL=+1 (من اليمين)، LTR=-1 (من الشمال)
  const clear = (pg) => [pg, pg.querySelector(CFG.desc)].forEach((el) => el && ['transform', 'filter', 'opacity', 'zIndex'].forEach((k) => (el.style[k] = '')));

  function show(pg, e, r) {                  // e: 0 مخفي → 1 ظاهر (ديسكريبشن الصفحة)
    const d = pg.querySelector(CFG.desc);
    if (!d) return;
    d.style.opacity = e;
    d.style.transform = `translateX(${r * CFG.shift * (1 - e)}px)`;
    d.style.filter = e < 1 ? `blur(${CFG.descBlur * (1 - e)}px)` : '';
  }

  function render(S, p) {
    const [a, b, c] = CFG.q, old = S.pages[S.i], nw = S.pages[S.j], k = clamp((p - a) / (b - a));
    nw.style.display = ''; nw.style.zIndex = 2; old.style.zIndex = 1;
    nw.style.transform = `translateX(${S.side * (1 - p) * 100}%)`;
    old.style.filter = k ? `blur(${k * CFG.pageBlur}px)` : '';
    old.style.opacity = 1 - k;
    show(old, 1 - clamp(p / a), S.r);
    show(nw, clamp((p - a) / (c - a)), S.r);
  }

  function run(from, to, ms, fn, done) {
    const t0 = performance.now();
    const f = (t) => { const u = clamp((t - t0) / ms); fn(from + (to - from) * ease(u)); u < 1 ? requestAnimationFrame(f) : done && done(); };
    requestAnimationFrame(f);
  }

  function reset(S) {                         // يخفي كل الصفحات إلا الحالية وينضّف الستايلات
    S.pages.forEach((pg, k) => { clear(pg); pg.style.display = k === S.i ? '' : 'none'; });
    S.j = null;
  }

  function finish(S, ok) {
    if (ok) { S.i = S.j; S.box.dispatchEvent(new CustomEvent('monoswipe:change', { bubbles: true, detail: { index: S.i } })); }
    reset(S); S.busy = false;
  }

  function mount(box) {
    if (st.has(box)) return;
    const S = { box, pages: [...box.querySelectorAll(':scope > ' + CFG.page)], i: 0, j: null, side: 0, r: dirOf(box), busy: false };
    st.set(box, S); reset(S);
    run(0, 1, CFG.introMs, (e) => show(S.pages[0], e, S.r), () => clear(S.pages[0]));   // intro
  }

  /* ---- مراقبة السحب ---- */
  function onDown(e) {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const box = e.target.closest?.(CFG.box), S = box && st.get(box);
    if (!S || S.busy) return;
    S.r = dirOf(box);
    cur = { S, id: e.pointerId, x: e.clientX, y: e.clientY, t0: performance.now(), lock: false, p: 0 };
  }

  function onMove(e) {
    if (!cur || e.pointerId !== cur.id) return;
    const S = cur.S, dx = e.clientX - cur.x, dy = e.clientY - cur.y;
    if (!cur.lock) {
      if (Math.hypot(dx, dy) < 8) return;
      if (Math.abs(dx) < Math.abs(dy)) { cur = null; return; }           // حركة رأسية: سيبها للسكرول
      cur.lock = true; S.box.setPointerCapture(e.pointerId);
    }
    const next = dx * S.r > 0, j = S.i + (next ? 1 : -1);                // الاتجاه الأمامي = ناحية دخول الكلام
    if (j !== S.j) { reset(S); S.j = j; S.side = next ? -S.r : S.r; }   // غيّر اتجاهه وسط السحب
    if (!S.pages[j]) { cur.p = 0; return; }                              // مفيش صفحة في الناحية دي
    cur.p = clamp(Math.abs(dx) / S.box.offsetWidth);
    render(S, cur.p);
  }

  function onUp(e) {
    if (!cur || e.pointerId !== cur.id) return;
    const { S, p, t0 } = cur; cur = null;
    if (!S.pages[S.j]) return;
    const ok = e.type === 'pointerup' && (p > CFG.commit || (p * S.box.offsetWidth) / (performance.now() - t0) > CFG.flick);
    S.busy = true;
    run(p, ok ? 1 : 0, CFG.settleMs, (v) => render(S, v), () => finish(S, ok));
  }

  function init(overrides) {
    if (overrides) Object.assign(CFG, overrides);
    if (inited) return;
    inited = true;
    const s = document.createElement('style');
    s.textContent = `${CFG.box}{position:relative;overflow:hidden;touch-action:pan-y}${CFG.box}>${CFG.page}{position:absolute;inset:0;overflow-y:auto}`;
    document.head.append(s);
    document.querySelectorAll(CFG.box).forEach(mount);
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerup', onUp, { capture: true, passive: true });
    document.addEventListener('pointercancel', onUp, { capture: true, passive: true });
  }

  return { init, mount, CFG, go(box, d) { const S = st.get(box); if (!S || S.busy || !S.pages[S.i + d]) return; S.busy = true; S.r = dirOf(box); reset(S); S.j = S.i + d; S.side = d > 0 ? -S.r : S.r; run(0, 1, CFG.settleMs + 120, (v) => render(S, v), () => finish(S, true)); } };  /* go(box, +1/-1): تنقل برمجي بنفس التأثير للزراير */
})();
/* [END FX: mono-horizontal-swipe] */


/* ============================================================
   [FX: mono-vertical-swipe]
   keywords: mono vertical swipe, مونو فيرتيكال سوايب, mono v swipe, vertical swipe, سوايب رأسي, سوايب عمودي, page swipe vertical, blur swipe
   what:  نفس mono-horizontal-swipe بس على المحور الرأسي (الكود مستقل عنه).
          تسحب لفوق: الصفحة الجديدة تطلع من تحت وتغطي القديمة. تسحب لتحت: ترجع للي قبلها.
          p = نسبة التغطية. p < q1: ديسكريبشن القديمة يرجع عكس دخوله بفيد وبلور (على الكلمة نفسها من غير بوكس).
          q1 → q2: الصفحة القديمة تتغبّش لحد ما تختفي. q1 → q3: ديسكريبشن الجديدة يظهر.
          ترفع صباعك: لو عدّيت commit أو السحبة سريعة تكمل، غير كده ترجع. أول ظهور فيه intro للديسكريبشن.
          الديسكريبشن بيدخل من فوق لتحت (descFrom = -1)، غيّرها لـ 1 عشان يدخل من تحت.
   usage: <div data-mono-vswipe style="height:100vh">
            <section data-page><h1 data-desc>...</h1></section>
            <section data-page>...</section>
          </div>
          MonoVSwipe.init()                      ← مرة واحدة
          MonoVSwipe.init({ introMs: 500 })      ← تغيير أي قيمة من CFG
          MonoVSwipe.mount(box)                  ← لو الحاوية اتضافت بعد init
   events: monovswipe:change على الحاوية، و event.detail.index = رقم الصفحة الجديدة
   needs: متصفح حديث. الحاوية لازم يبقى لها ارتفاع. بيحط touch-action:pan-x، والصفحات overflow:hidden
          (مفيش سكرول رأسي جوه الصفحة لأنه هيتعارض مع السحب).
   ============================================================ */
const MonoVSwipe = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    box: '[data-mono-vswipe]', page: '[data-page]', desc: '[data-desc]',
    q: [0.25, 0.5, 0.75],  // q1 القديم يختفي ويبدأ الجديد | q2 القديمة تتغبّش تماماً | q3 الجديد يكتمل
    fwd: -1,               // اتجاه صباعك للصفحة اللي بعدها: -1 لفوق، 1 لتحت
    descFrom: -1,          // الديسكريبشن بيدخل من: -1 فوق، 1 تحت
    shift: 40,             // مسافة حركة الديسكريبشن (px)
    descBlur: 8,           // أقصى بلور للديسكريبشن (px)
    pageBlur: 24,          // أقصى بلور للصفحة القديمة (px)
    introMs: 700,          // مدة intro الديسكريبشن
    settleMs: 320,         // مدة إكمال السحبة أو رجوعها
    commit: 0.3,           // أقل تغطية عشان تكمل
    flick: 0.5             // أو سرعة (px/ms) تعتبر سحبة سريعة
  };

  const st = new WeakMap();
  let cur = null, inited = false;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = (u) => 1 - (1 - u) ** 3;
  const clear = (pg) => [pg, pg.querySelector(CFG.desc)].forEach((el) => el && ['transform', 'filter', 'opacity', 'zIndex'].forEach((k) => (el.style[k] = '')));

  function show(pg, e) {                     // e: 0 مخفي → 1 ظاهر (ديسكريبشن الصفحة)
    const d = pg.querySelector(CFG.desc);
    if (!d) return;
    d.style.opacity = e;
    d.style.transform = `translateY(${CFG.descFrom * CFG.shift * (1 - e)}px)`;
    d.style.filter = e < 1 ? `blur(${CFG.descBlur * (1 - e)}px)` : '';
  }

  function render(S, p) {
    const [a, b, c] = CFG.q, old = S.pages[S.i], nw = S.pages[S.j], k = clamp((p - a) / (b - a));
    nw.style.display = ''; nw.style.zIndex = 2; old.style.zIndex = 1;
    nw.style.transform = `translateY(${S.side * (1 - p) * 100}%)`;
    old.style.filter = k ? `blur(${k * CFG.pageBlur}px)` : '';
    old.style.opacity = 1 - k;
    show(old, 1 - clamp(p / a));
    show(nw, clamp((p - a) / (c - a)));
  }

  function run(from, to, ms, fn, done) {
    const t0 = performance.now();
    const f = (t) => { const u = clamp((t - t0) / ms); fn(from + (to - from) * ease(u)); u < 1 ? requestAnimationFrame(f) : done && done(); };
    requestAnimationFrame(f);
  }

  function reset(S) {                         // يخفي كل الصفحات إلا الحالية وينضّف الستايلات
    S.pages.forEach((pg, k) => { clear(pg); pg.style.display = k === S.i ? '' : 'none'; });
    S.j = null;
  }

  function finish(S, ok) {
    if (ok) { S.i = S.j; S.box.dispatchEvent(new CustomEvent('monovswipe:change', { bubbles: true, detail: { index: S.i } })); }
    reset(S); S.busy = false;
  }

  function mount(box) {
    if (st.has(box)) return;
    const S = { box, pages: [...box.querySelectorAll(':scope > ' + CFG.page)], i: 0, j: null, side: 0, busy: false };
    st.set(box, S); reset(S);
    run(0, 1, CFG.introMs, (e) => show(S.pages[0], e), () => clear(S.pages[0]));   // intro
  }

  /* ---- مراقبة السحب ---- */
  function onDown(e) {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const box = e.target.closest?.(CFG.box), S = box && st.get(box);
    if (!S || S.busy) return;
    cur = { S, id: e.pointerId, x: e.clientX, y: e.clientY, t0: performance.now(), lock: false, p: 0 };
  }

  function onMove(e) {
    if (!cur || e.pointerId !== cur.id) return;
    const S = cur.S, dx = e.clientX - cur.x, dy = e.clientY - cur.y;
    if (!cur.lock) {
      if (Math.hypot(dx, dy) < 8) return;
      if (Math.abs(dy) < Math.abs(dx)) { cur = null; return; }           // حركة أفقية: سيبها
      cur.lock = true; S.box.setPointerCapture(e.pointerId);
    }
    const next = dy * CFG.fwd > 0, j = S.i + (next ? 1 : -1);
    if (j !== S.j) { reset(S); S.j = j; S.side = next ? -CFG.fwd : CFG.fwd; }   // غيّر اتجاهه وسط السحب
    if (!S.pages[j]) { cur.p = 0; return; }                              // مفيش صفحة في الناحية دي
    cur.p = clamp(Math.abs(dy) / S.box.offsetHeight);
    render(S, cur.p);
  }

  function onUp(e) {
    if (!cur || e.pointerId !== cur.id) return;
    const { S, p, t0 } = cur; cur = null;
    if (!S.pages[S.j]) return;
    const ok = e.type === 'pointerup' && (p > CFG.commit || (p * S.box.offsetHeight) / (performance.now() - t0) > CFG.flick);
    S.busy = true;
    run(p, ok ? 1 : 0, CFG.settleMs, (v) => render(S, v), () => finish(S, ok));
  }

  function init(overrides) {
    if (overrides) Object.assign(CFG, overrides);
    if (inited) return;
    inited = true;
    const s = document.createElement('style');
    s.textContent = `${CFG.box}{position:relative;overflow:hidden;touch-action:pan-x}${CFG.box}>${CFG.page}{position:absolute;inset:0;overflow:hidden}`;
    document.head.append(s);
    document.querySelectorAll(CFG.box).forEach(mount);
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerup', onUp, { capture: true, passive: true });
    document.addEventListener('pointercancel', onUp, { capture: true, passive: true });
  }

  return { init, mount, CFG, go(box, d) { const S = st.get(box); if (!S || S.busy || !S.pages[S.i + d]) return; S.busy = true; reset(S); S.j = S.i + d; S.side = d > 0 ? -CFG.fwd : CFG.fwd; run(0, 1, CFG.settleMs + 120, (v) => render(S, v), () => finish(S, true)); } };  /* go(box, +1/-1): تنقل برمجي بنفس التأثير للزراير والويل */
})();
/* [END FX: mono-vertical-swipe] */


/* ============================================================
   [FX: in-order-show]
   keywords: in order show, order show, ان أوردر شو, ظهور بالترتيب, ordered reveal, staggered reveal, stagger in, cells reveal, generator reveal, wave in, cards, images, grid
   what:  عناصر الحاوية (سيلز/زراير/صور) بتظهر ورا بعض بالترتيب، كل واحد بيطلع من ورا الزرار اللي دوست عليه
          (كأن تحت الزرار جنريتور) ويمشي لمكانه. الاتجاه بيتحدد بمكان الزرار: شمال → من الشمال لليمين،
          يمين → العكس، تحت → من تحت لفوق، فوق → من فوق لتحت.
          حركة كل عنصر: يبدأ صغير وشفاف وبلور، البلور والشفافية بيروحوا في أول ربع المشوار،
          وبعدها يبوب (يكبر ويرجع لحجمه ببطء واضح للعين) كأنه بيعدي على مطب، وبعد كده يكمل بخط عادي ويقف.
          التالي بيتحرك بعده بفرق صغير. كله سريع ولذيذ (حوالي نص ثانية للعنصر).
          الكروت العريضة (عرضها أكتر من 60% من الحاوية) لما الزرار على الشمال أو اليمين: بتدخل أفقي في صفها بالظبط
          من غير ميل، الأول من فوق وتحته اللي بعده وهكذا (والطولانية نفس الشيء مع زرار فوق أو تحت).
          التأثير بيظبط نفسه تلقائي على مقاس كل عنصر (صغير/عريض/طويل/كبير) من غير ما تقوله:
          البوب والانكماش محدودين بالبكسل فالكارد الكبير ما بيتضخمش، والمشوار الأطول بياخد وقت أطول (لحد msMax).
          بيشتغل أول ما الصفحة تفتح، وكل ما محتوى الحاوية يتغيّر (ريلود)، ومن الكود بـ play().
   usage: OrderShow.init()                       ← مرة واحدة
          <div id="list" data-order-show data-order-from="#btn">...العناصر...</div>   ← الزرار الافتراضي لأول مرة
          <button data-order-trigger="#list">ريلود</button>   ← أي زرار تدوس عليه يبقى هو مصدر الخروج ناحية المرة الجاية
          OrderShow.play(box, buttonEl)          ← تشغيل يدوي
          OrderShow.init({ gap: 40, bump: 0.25 })   ← تغيير أي قيمة من CFG
   needs: متصفح حديث (Web Animations و translate/scale). العناصر هي الأولاد المباشرين للحاوية.
          لو مفيش زرار معروف الخروج بيبقى من منتصف الحافة التحتانية للحاوية.
          الريلود بيتلقط تلقائي بتغيّر أولاد الحاوية (MutationObserver)، فاعمل الريلود وهو هيشغل لوحده.
   ============================================================ */
const OrderShow = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    box: '[data-order-show]',                      // الحاوية
    trigger: '[data-order-trigger]',               // الزراير اللي بتحدد ناحية الخروج
    order: 'dom',          // dom: بترتيب العناصر | near: الأقرب للزرار الأول
    ms: 640,               // أقل زمن لكل عنصر
    gap: 80,               // الفرق بين بداية كل عنصر والتاني
    bump: 0.16,            // أقصى نسبة تكبير وهو بيبوب (للعناصر الصغيرة)
    maxGrow: 16,           // وأقصى زيادة بالبكسل على أطول ضلع، فالكارد الكبير ما بيتضخمش (البوب بيقل نسبياً)
    maxShrink: 60,         // أقصى انكماش بالبكسل في البداية (الكارد الكبير بيبدأ أقرب لحجمه)
    speed: 0.9,            // سرعة المشي px/ms: المشوار الأطول بياخد وقت أطول
    msMax: 1000,           // أقصى زمن للعنصر الواحد
    wide: 0.6,             // عنصر عرضه (أو ارتفاعه) أكبر من النسبة دي من الحاوية بيدخل على محور الزرار بس (من غير قطري)
    blur: 10,              // بلور البداية (px)
    clearAt: 0.25,         // البلور والشفافية بيخلصوا عند النسبة دي من المشوار
    peakAt: 0.55,          // نقطة أعلى البوب
    travel: 'cubic-bezier(.3,.7,.4,1)',   // منحنى المشي من الزرار لمكانه
    respectReducedMotion: true
  };

  const from = new WeakMap();                      // آخر زرار اتدوس لكل حاوية
  const seen = new WeakSet();
  const mid = (r) => [r.left + r.width / 2, r.top + r.height / 2];

  function play(box, src) {
    if (CFG.respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    src = src || from.get(box) || (box.dataset.orderFrom && document.querySelector(box.dataset.orderFrom));
    const kids = [...box.children];
    kids.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));   // نقيس من مكانهم الحقيقي
    const br = box.getBoundingClientRect();
    const o = src ? mid(src.getBoundingClientRect()) : [br.left + br.width / 2, br.bottom];   // نقطة الخروج
    const pts = kids.map((el) => mid(el.getBoundingClientRect()));
    const side = Math.abs(o[0] - (br.left + br.width / 2)) / br.width > Math.abs(o[1] - (br.top + br.height / 2)) / br.height;   // الزرار على الجنب؟
    const rank = kids.map((_, i) => i);
    if (CFG.order === 'near') rank.sort((a, b) => Math.hypot(pts[a][0] - o[0], pts[a][1] - o[1]) - Math.hypot(pts[b][0] - o[0], pts[b][1] - o[1]));

    kids.forEach((el, i) => {
      const [x, y] = pts[i], r = el.getBoundingClientRect(), big = Math.max(r.width, r.height) || 1;   // مقاس العنصر نفسه: بيظبط التأثير تلقائي
      let dx = o[0] - x, dy = o[1] - y;
      if (side ? r.width >= CFG.wide * br.width : r.height >= CFG.wide * br.height) side ? (dy = 0) : (dx = 0);   // العريض بيدخل في صفه بس
      const dist = Math.hypot(dx, dy), ms = Math.min(CFG.msMax, Math.max(CFG.ms, dist / CFG.speed));
      const delay = rank.indexOf(i) * CFG.gap;
      const s0 = Math.max(0.4, 1 - CFG.maxShrink / big), s1 = 1 - (1 - s0) / 6, peak = 1 + Math.min(CFG.bump, CFG.maxGrow / big);
      /* المشي: من ورا الزرار لمكانه */
      el.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }],
        { duration: ms, delay, easing: CFG.travel, fill: 'backwards' });
      /* الشكل: يظهر من البلور، يبوب، يرجع لحجمه */
      el.animate([
        { scale: s0, opacity: 0, filter: `blur(${CFG.blur}px)`, offset: 0, easing: 'ease-out' },
        { scale: s1, opacity: 1, filter: 'blur(0px)', offset: CFG.clearAt, easing: 'ease-in-out' },
        { scale: peak, offset: CFG.peakAt, easing: 'ease-in-out' },
        { scale: 1, offset: 1 }
      ], { duration: ms, delay, fill: 'backwards' });
    });
  }

  function mount(box) {
    if (seen.has(box)) return;
    seen.add(box);
    play(box);                                     // أول ظهور
    let t = 0;
    new MutationObserver(() => { cancelAnimationFrame(t); t = requestAnimationFrame(() => play(box)); }).observe(box, { childList: true });   // ريلود
  }

  function init(overrides) {
    if (overrides) Object.assign(CFG, overrides);
    document.addEventListener('click', (e) => {    // نسجل الزرار قبل ما الريلود بتاعك يشتغل (capture)
      const t = e.target.closest?.(CFG.trigger), box = t && document.querySelector(t.dataset.orderTrigger);
      if (box) from.set(box, t);
    }, true);
    document.querySelectorAll(CFG.box).forEach(mount);
  }

  return { init, play, mount, CFG };
})();
/* [END FX: in-order-show] */


/* ============================================================
   [FX: skeleton]
   keywords: skeleton, سكيلتون, skeleton loader, loading placeholder, placeholder, loading, لودينج, تحميل, data loading, sticky note, typewriter, chart draw,
             notification badge, badge counter, عداد النوتيفيكيشن, رقم الإشعارات, countdown, theme, dark, light, ثيم
   what:  أي مكان بياخد وقت يحمل (صورة، داتا مكتوبة، تشارت) بنفرّغه من اللي لسه هيوصل (من غير ما المقاس يتغير)
          وبنحط مكانه حركة بتفضل شغالة لحد ما الداتا توصل. الصفحة كلها شغالة عادي (سوايب، سكرول، ريفرش).
          لو دوست على أي حاجة تانية الحركة بتقف وهي ماسكة وترجع تكمل لما ترفع إيدك.
          الألوان: مفيش ألوان. السكيلتون بياخد لون واضح بحسب الخلفية اللي معروض عليها (أول خلفية مش شفافة فوق العنصر):
          خلفية غامقة = أبيض مطفي، خلفية فاتحة = أسود/رصاصي مطفي. ولما الثيم يتبدل (class / data-theme / prefers-color-scheme)
          اللون بيتغير بنعومة. الكتابة بنفس خط العنصر.
          • صورة: ستيكي نوت (لوجو بتاعنا جواها) بتنزل من فوق، تتلزق من الركن الأول ثم باقي الحافة العلوية ثم تنزل عادي
            لحد الآخر، وركنها السفلي مقصوص/مثني. حجمها نص مساحة الكارد في النص. الركن الأول يمين لو RTL وشمال لو LTR.
          • تشارت/رسمة: يترسم من الصفر: خط رأسي، بعده أفقي، بعده منحنى التشارت، وتتعاد.
          • داتا مكتوبة: بتتكتب حرف حرف: "Here we will share your information." أو بالعربي "سوف نشاركك بياناتك هنا." وتتعاد.
          • عداد النوتيفيكيشن (badge): دايرة صغيرة على ركن الزرار بتعد بالراحة من 70 لتحت لحد ما الرقم الحقيقي يوصل،
            وساعتها بتنزل (أو تطلع) بسرعة ودراما من الرقم اللي وصلته للرقم الحقيقي وتفضل عليه. لو العد وصل صفر قبل ما الداتا توصل
            بتتشال. لو الرقم الحقيقي صفر بتتشال. ماتشغلهاش غير لو الزرار فعلاً عنده نوتيفيكيشن (إنت اللي بتقرر وبتنادي show).
   usage: Skeleton.init()                        ← مرة واحدة
          <div class="card" data-skel="image">…</div>      ← النوع: image | chart | text (من غيرها بيتخمن من محتواه)
          Skeleton.show(card)                    ← ابدأ السكيلتون
          Skeleton.hide(card)                    ← الداتا وصلت: وقّفه واظهر المحتوى
          Skeleton.wrap(card, fetchPromise)      ← يبدأ ويقف لوحده لما الـ promise يخلص (نجح أو فشل)
          card.toggleAttribute('data-skel-loading', true/false)   ← بديل declarative
          data-skel-text="..." على العنصر         ← نص مخصص بدل الافتراضي
          Skeleton.init({ logo: '/img/logo.svg' })    ← لوجوك: كود SVG/HTML أو رابط صورة، وأي قيمة من CFG
          Skeleton.badge.show(btn)               ← الزرار عنده نوتيفيكيشن والرقم لسه جاي: ابدأ العد من 70
          Skeleton.badge.set(btn, 2)             ← الرقم الحقيقي وصل (0 = شيل الشارة). لو ماكانتش شغالة بتظهر على طول بالرقم
          Skeleton.badge.clear(btn)              ← شيل الشارة
   needs: متصفح حديث (Web Animations و clip-path و color-mix). بيحقن CSS صغير، وبيخلي العنصر position:relative لو كان static.
          لو الصورة <img> حطها جوه div واعمل data-skel على الـ div (الـ img نفسها مينفعش يتحط جواها حاجة).
          بيكتب color شفاف على العنصر أثناء التحميل (النص الأصلي بيتخفي). الشارة بتتحط جوه الزرار فمتبقاش overflow:hidden عليه.
   ============================================================ */
const Skeleton = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    attr: 'data-skel-loading',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12h7M12 8.5v7"/></svg>',   // غيّره للوجو بتاعك
    onDark: '#b9bcc4',     // لون السكيلتون على خلفية غامقة (أبيض مطفي)
    onLight: '#52555d',    // لون السكيلتون على خلفية فاتحة (رصاصي غامق مطفي)
    themeMs: 350,          // زمن تغيّر اللون لما الثيم يتبدل
    noteSize: 0.5,         // حجم الستيكي نوت من حجم الكارد
    fold: 22,              // حجم الركن المثني (px)
    corner: 'auto',        // الركن الأول: auto (RTL=right, LTR=left) | left | right
    noteMs: 900,           // زمن نزول وتلزيق الستيكي نوت
    chartMs: 2400,         // دورة رسم التشارت
    charMs: 25,            // سرعة الكتابة (ms للحرف)
    holdMs: 900,           // وقفة بعد ما الكتابة تكمل قبل ما تتعاد
    outMs: 200,            // زمن اختفاء السكيلتون لما الداتا توصل
    text: { en: 'Here we will share your information.', ar: 'سوف نشاركك بياناتك هنا.' },
    badgeFrom: 70,         // العداد يبدأ من كام
    badgeTickMs: 140,      // زمن النقصان بالراحة (ms للرقم)
    badgeFastMs: 650,      // زمن النزول السريع للرقم الحقيقي
    pauseOnPress: true,    // الحركة تقف لما تدوس على أي حاجة وترجع لما ترفع
    respectReducedMotion: true
  };

  const act = new Map();           // العناصر الشغالة: { layer, timer, pos }
  const bd = new Map();            // شارات النوتيفيكيشن الشغالة: { b, v, timer, raf, pos }
  let held = [], paused = false, inited = false;
  const mk = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; return d; };
  const reduced = () => CFG.respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- اللون: بيتحدد من الخلفية اللي العنصر معروض عليها ---- */
  const px = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { px.clearRect(0, 0, 1, 1); px.fillStyle = '#000'; px.fillStyle = c; px.fillRect(0, 0, 1, 1); return px.getImageData(0, 0, 1, 1).data; };
  const lum = (d) => 0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2];
  const dark = (el) => {
    for (let n = el; n; n = n.parentElement) { const d = rgba(getComputedStyle(n).backgroundColor); if (d[3] > 128) return lum(d) < 140; }
    return lum(rgba(getComputedStyle(document.body).color)) > 140;   // مفيش خلفية خالص: نقيس من لون النص
  };
  function paint(el, r) {
    const dk = dark(el), c = dk ? CFG.onDark : CFG.onLight, p = r.layer.querySelector('.sk-paper');
    r.layer.style.color = c;
    if (p) { p.style.background = c; p.style.color = dk ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.6)'; }
  }
  function paintB(el, r) {
    const dk = dark(el);
    r.b.style.background = dk ? CFG.onDark : CFG.onLight;
    r.b.style.color = dk ? 'rgba(0,0,0,.7)' : 'rgba(255,255,255,.85)';
  }

  /* ---- شكل كل نوع ---- */
  const draw = {
    image(L, rtl) {                  // ستيكي نوت
      const left = (CFG.corner === 'auto' ? (rtl ? 'right' : 'left') : CFG.corner) === 'left', s = left ? -1 : 1, F = CFG.fold, H = `calc(100% - ${F}px)`;
      const fin = left ? `polygon(0 0,100% 0,100% 100%,${F}px 100%,0 ${H})` : `polygon(0 0,100% 0,100% ${H},${H} 100%,0 100%)`;   // الشكل النهائي بالركن المقصوص
      const a = left ? 'polygon(0 0,0 0,0 14%,0 14%,0 14%)' : 'polygon(100% 0,100% 0,100% 14%,100% 14%,100% 14%)';              // أول لزقة في الركن الأول
      const mid = 'polygon(0 0,100% 0,100% 14%,0 14%,0 14%)';                                                                     // الحافة العلوية كلها
      const logo = /^\s*</.test(CFG.logo) ? CFG.logo : `<img src="${CFG.logo}" alt="">`;
      const note = mk('sk-note'), paper = mk('sk-paper', `<div class="sk-logo">${logo}</div>`), fold = mk('sk-fold');
      Object.assign(note.style, { width: CFG.noteSize * 100 + '%', height: CFG.noteSize * 100 + '%', transformOrigin: left ? '0 0' : '100% 0' });
      Object.assign(fold.style, { width: F + 'px', height: F + 'px', [left ? 'left' : 'right']: 0, clipPath: left ? 'polygon(0 0,100% 100%,100% 0)' : 'polygon(100% 0,0 100%,0 0)' });
      paper.append(fold); note.append(paper); L.append(note);
      if (reduced()) { paper.style.clipPath = fin; fold.style.opacity = 1; return; }
      note.animate([
        { transform: `translateY(-40%) rotate(${10 * s}deg)`, opacity: 0, offset: 0 },
        { transform: `translateY(-6%) rotate(${6 * s}deg)`, opacity: 1, offset: 0.3 },
        { transform: `translateY(0) rotate(${4 * s}deg)`, offset: 0.55 },
        { transform: `translateY(0) rotate(${-1.5 * s}deg)`, offset: 0.8 },
        { transform: 'rotate(0deg)', offset: 1 }
      ], { duration: CFG.noteMs, easing: 'ease-out', fill: 'both' });
      note.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${0.6 * s}deg)` }],      // تمايل خفيف وهي مستنية الداتا
        { duration: 2600, delay: CFG.noteMs, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
      paper.animate([{ clipPath: a }, { clipPath: mid, offset: 0.35 }, { clipPath: fin }], { duration: CFG.noteMs, easing: 'ease-out', fill: 'both' });
      fold.animate([{ opacity: 0 }, { opacity: 0, offset: 0.85 }, { opacity: 1 }], { duration: CFG.noteMs, fill: 'both' });
    },

    chart(L) {                       // خط رأسي ← أفقي ← منحنى، وتتعاد
      L.innerHTML = '<svg viewBox="0 0 100 60" style="width:70%;height:80%;opacity:.55" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
        + '<path pathLength="1" d="M8 6V54"/><path pathLength="1" d="M8 54H96"/><path pathLength="1" d="M8 44C20 40 26 20 38 26S58 44 70 24 88 12 96 10"/></svg>';
      if (reduced()) return;
      const T = [[0, 0.18], [0.18, 0.36], [0.36, 0.8]];
      L.querySelectorAll('path').forEach((p, i) => {
        const [a, b] = T[i];
        p.style.strokeDasharray = 1;
        p.animate([
          { strokeDashoffset: 1, opacity: 1, offset: 0 },
          { strokeDashoffset: 1, offset: a, easing: 'ease-in-out' },
          { strokeDashoffset: 0, offset: b },
          { strokeDashoffset: 0, opacity: 1, offset: 0.9 },
          { strokeDashoffset: 0, opacity: 0, offset: 1 }
        ], { duration: CFG.chartMs, iterations: Infinity });
      });
    },

    text(L, rtl, r, el) {            // كتابة حرف حرف وتتعاد
      const s = el.dataset.skelText || (rtl ? CFG.text.ar : CFG.text.en), t = mk('sk-text'), tn = document.createTextNode('');
      t.append(tn); L.append(t);
      if (reduced()) { tn.data = s; return; }
      t.append(Object.assign(document.createElement('span'), { className: 'sk-caret' }));
      let i = 0;
      const tick = () => {
        if (!el.isConnected || !act.has(el)) return stop(el);
        let wait = CFG.charMs;
        if (!paused) { tn.data = s.slice(0, i); if (i++ >= s.length) { i = 0; wait = CFG.holdMs; } }
        r.timer = setTimeout(tick, wait);
      };
      tick();
    }
  };

  function start(el) {
    if (act.has(el)) return;
    const cs = getComputedStyle(el), rtl = cs.direction === 'rtl';
    const kind = el.dataset.skel || (el.querySelector('img,picture,video') ? 'image' : el.querySelector('canvas,svg') ? 'chart' : 'text');
    const r = { layer: mk('sk-layer'), pos: cs.position === 'static', timer: 0 };
    if (r.pos) el.style.position = 'relative';
    act.set(el, r);
    el.setAttribute('data-skel-on', ''); el.append(r.layer);
    (draw[kind] || draw.text)(r.layer, rtl, r, el);
    paint(el, r);
  }

  function stop(el) {
    const r = act.get(el);
    if (!r) return;
    act.delete(el); clearTimeout(r.timer);
    r.layer.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    el.removeAttribute('data-skel-on');            // المحتوى الحقيقي يظهر تحت الـ layer وهو بيتلاشى
    const end = () => { r.layer.remove(); if (r.pos) el.style.position = ''; };
    r.layer.animate({ opacity: [1, 0] }, { duration: CFG.outMs, fill: 'forwards' }).finished.then(end, end);
  }

  const show = (el) => { el.setAttribute(CFG.attr, ''); start(el); };
  const hide = (el) => { el.removeAttribute(CFG.attr); stop(el); };
  const wrap = (el, p) => { show(el); return Promise.resolve(p).finally(() => hide(el)); };

  /* ---- عداد النوتيفيكيشن ---- */
  const pop = (b) => { if (!reduced()) b.animate({ scale: [1, 1.3, 1] }, { duration: 260, easing: 'ease-out' }); };

  function badgeMake(el, v) {
    const r = { b: mk('sk-badge'), v, timer: 0, raf: 0, pos: getComputedStyle(el).position === 'static' };
    if (r.pos) el.style.position = 'relative';
    r.b.textContent = v; bd.set(el, r); el.append(r.b); paintB(el, r);
    return r;
  }

  function badgeClear(el) {
    const r = bd.get(el);
    if (!r) return;
    bd.delete(el); clearInterval(r.timer); cancelAnimationFrame(r.raf);
    const end = () => { r.b.remove(); if (r.pos && !bd.has(el)) el.style.position = ''; };
    r.b.animate({ opacity: [1, 0], scale: [1, 0.6] }, { duration: CFG.outMs, fill: 'forwards' }).finished.then(end, end);
  }

  function badgeShow(el) {                          // الرقم لسه جاي: عد بالراحة من الأول
    if (bd.has(el) || reduced()) return;
    const r = badgeMake(el, CFG.badgeFrom);
    r.timer = setInterval(() => {
      if (!el.isConnected) return badgeClear(el);
      if (paused) return;
      r.b.textContent = --r.v;
      if (r.v <= 0) badgeClear(el);                 // وصل صفر من غير ما الداتا توصل: مفيش نوتيفيكيشن
    }, CFG.badgeTickMs);
  }

  function badgeSet(el, n) {                        // الرقم الحقيقي وصل
    n = Math.max(0, Math.round(n) || 0);
    if (!n) return badgeClear(el);
    const r = bd.get(el);
    if (!r) { pop(badgeMake(el, n).b); return; }
    clearInterval(r.timer); cancelAnimationFrame(r.raf);
    if (reduced() || r.v === n) { r.b.textContent = r.v = n; return pop(r.b); }
    const from = r.v, t0 = performance.now();
    const step = (t) => {                           // نزول سريع: يتسارع ثم يفرمل على الرقم
      const k = Math.min(1, (t - t0) / CFG.badgeFastMs), e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
      r.b.textContent = r.v = Math.round(from + (n - from) * e);
      if (k < 1) r.raf = requestAnimationFrame(step); else pop(r.b);
    };
    r.raf = requestAnimationFrame(step);
  }

  function hold(v) {                               // وقّف الحركة وهو ماسك، وكمّل لما يرفع
    if (paused === v) return;
    paused = v;
    if (v) { held = [...act.values()].flatMap((r) => r.layer.getAnimations({ subtree: true })).filter((a) => a.playState === 'running'); held.forEach((a) => a.pause()); }
    else { held.forEach((a) => a.play()); held = []; }
  }

  function init(overrides) {
    if (overrides) Object.assign(CFG, overrides);
    if (inited) return;
    inited = true;
    const st = document.createElement('style');
    st.textContent = `[data-skel-on]{color:transparent!important}[data-skel-on]>:not(.sk-layer){visibility:hidden!important}`
      + `.sk-layer,.sk-paper,.sk-badge{transition:color ${CFG.themeMs}ms,background-color ${CFG.themeMs}ms}`
      + `.sk-layer{position:absolute;inset:0;z-index:1;display:grid;place-items:center;overflow:hidden;border-radius:inherit;pointer-events:none;font:inherit;background:color-mix(in srgb,currentColor 7%,transparent)}`
      + `.sk-note{position:relative;filter:drop-shadow(0 6px 10px rgba(0,0,0,.28))}`
      + `.sk-paper{position:absolute;inset:0;display:grid;place-items:center}`
      + `.sk-logo{width:40%;max-width:64px;opacity:.7}.sk-logo>*{display:block;width:100%;height:auto}`
      + `.sk-fold{position:absolute;bottom:0;background:linear-gradient(135deg,rgba(255,255,255,.4),rgba(0,0,0,.2));opacity:0}`
      + `.sk-text{padding:16px;text-align:center;opacity:.65;line-height:1.6}`
      + `.sk-caret{display:inline-block;width:2px;height:1em;margin-inline-start:2px;vertical-align:-.15em;background:currentColor;animation:sk-blink 1s steps(1) infinite}`
      + `.sk-badge{position:absolute;top:-7px;inset-inline-end:-7px;z-index:2;box-sizing:border-box;min-width:20px;height:20px;padding:0 6px;border-radius:10px;display:grid;place-items:center;pointer-events:none;font-family:inherit;font-size:11px;font-weight:600;line-height:1;font-variant-numeric:tabular-nums}`
      + `@keyframes sk-blink{50%{opacity:0}}`;
    document.head.append(st);
    new MutationObserver((ms) => ms.forEach((m) => (m.target.hasAttribute(CFG.attr) ? start(m.target) : stop(m.target))))
      .observe(document.documentElement, { attributes: true, attributeFilter: [CFG.attr], subtree: true });
    document.querySelectorAll(`[${CFG.attr}]`).forEach(start);
    if (CFG.pauseOnPress) {
      document.addEventListener('pointerdown', () => hold(true), { capture: true, passive: true });
      ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, () => hold(false), { capture: true, passive: true }));
    }
    /* الثيم اتبدل: ألوان السكيلتون تتحدّث بنعومة (مرتين، عشان لو الصفحة نفسها بتتحول بترانزيشن) */
    const retone = () => { act.forEach((r, el) => paint(el, r)); bd.forEach((r, el) => paintB(el, r)); };
    const later = () => { setTimeout(retone, 60); setTimeout(retone, CFG.themeMs + 150); };
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', later);
    const mo = new MutationObserver(later);
    [document.documentElement, document.body].forEach((n) => mo.observe(n, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme', 'style'] }));
  }

  return { init, show, hide, wrap, badge: { show: badgeShow, set: badgeSet, clear: badgeClear }, CFG };
})();
/* [END FX: skeleton] */


/* ============================================================
   [FX: under-construction]
   keywords: under construction, under maintenance, maintenance, تحت الصيانة, تحت الإنشاء, صيانة, مطرقة, شاكوش, hammer, hammer strike, sparks, شرار
   what:  أي زرار/اختيار تحت الصيانة (data-maint) بتظهر فوقه مطرقة صغيرة مرسومة جانبي (2D، خطوط فاضية من جوه).
          المطرقة بتقف عند أول حافته العلوية (يمين لو RTL وشمال لو LTR) وبتترفع بالراحة، وساعتها بيظهر جزء صغير من الحافة تحتها،
          وبعدين بتنزل بسرعة وقوة على الجزء ده: بينوّر نور خفيف ويطلع منه شرار صغير، وتميل في وقفتها الأخيرة.
          • زرار واحد بس تحت الصيانة: دقتين متقاربتين أول مرة، ودقة واحدة بعد الريفرش.
          • أكتر من زرار: أول زرار بس بيتدق عليه دقة واحدة، وبعد ما تخلص باقي المطارق تظهر فوق الباقيين بفيد خفيف، مايلة، من غير دق.
          اللون زي السكيلتون: أبيض مطفي على خلفية غامقة، ورصاصي غامق على الفاتحة، ويتبع الثيم.
   usage: UnderConstruction.init()                          ← مرة واحدة (play بيناديها لو نسيتها)
          <button data-maint>…</button>                     ← علّم الزرار أو الاختيار اللي تحت الصيانة
          UnderConstruction.play(root)                      ← شغّل على كل data-maint جوه root (الويدجت اللي اتفتحت). أول مرة في الجلسة = أول مرة، وبعدها = ريفرش
          UnderConstruction.play(root, { first: true })     ← فرض "أول مرة" (true) أو "ريفرش" (false)
          UnderConstruction.clear(root)                     ← شيل المطارق (بيتناده لوحده قبل كل play)
   needs: متصفح حديث (Web Animations و rotate المستقلة). المطرقة بتتحط جوه الزرار نفسه فمتبقاش overflow:hidden عليه، وبيبقى position:relative لو كان static.
          "أول مرة" متخزنة في sessionStorage (مفتاح uc-seen).
   ============================================================ */
const UnderConstruction = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    selector: '[data-maint]',   // اللي تحت الصيانة
    size: 40,                   // عرض المطرقة (px)
    offset: 10,                 // بعدها عن بداية الحافة (px)
    tilt: -32,                  // ميلتها وهي واقفة (درجات)
    raise: -68,                 // زاوية رفعها قبل الدقة
    hits: 2,                    // دقات الزرار الوحيد أول مرة (غير كده دقة واحدة)
    riseMs: 480,                // زمن الرفعة الأولى (التانية نصها)
    downMs: 110,                // زمن النزلة (سريعة)
    gapMs: 140,                 // وقفة صغيرة بين الدقتين
    fadeMs: 320,                // فيد ظهور المطرقة
    stagger: 90,                // فرق ظهور باقي المطارق
    onDark: '#b9bcc4',          // لون المطرقة على خلفية غامقة
    onLight: '#52555d',         // لون المطرقة على خلفية فاتحة
    themeMs: 350,
    storeKey: 'uc-seen',
    respectReducedMotion: true
  };

  const live = new Map();       // el → { el, box, seg, hm, svg, pos, dead }
  let inited = false;
  const reduced = () => CFG.respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---- اللون من الخلفية (نفس فكرة السكيلتون) ---- */
  const px = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { px.clearRect(0, 0, 1, 1); px.fillStyle = '#000'; px.fillStyle = c; px.fillRect(0, 0, 1, 1); return px.getImageData(0, 0, 1, 1).data; };
  const lum = (d) => 0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2];
  const dark = (el) => {
    for (let n = el; n; n = n.parentElement) { const d = rgba(getComputedStyle(n).backgroundColor); if (d[3] > 128) return lum(d) < 140; }
    return lum(rgba(getComputedStyle(document.body).color)) > 140;
  };
  const tint = (h) => { h.box.style.color = dark(h.el.parentElement || h.el) ? CFG.onDark : CFG.onLight; };

  /* ---- حركة: القيمة النهائية تتكتب الأول، والأنيميشن بيعدّي عليها ---- */
  const go = (el, prop, from, to, ms, ease = 'ease-in-out') => { el.style[prop] = to; return el.animate({ [prop]: [from, to] }, { duration: ms, easing: ease }).finished.catch(() => {}); };
  const rot = (el, a, b, ms, ease) => go(el, 'rotate', a + 'deg', b + 'deg', ms, ease);

  function build(el) {
    const cs = getComputedStyle(el), rtl = cs.direction === 'rtl', pos = cs.position === 'static';
    if (pos) el.style.position = 'relative';
    const box = document.createElement('div');
    box.className = 'uc'; box.setAttribute('aria-hidden', 'true');
    box.style.cssText = `--w:${CFG.size}px;inset-inline-start:${CFG.offset}px`;
    box.innerHTML = `<i class="uc-seg"></i><span class="uc-h" style="transform:scaleX(${rtl ? -1 : 1})">`
      + '<svg viewBox="0 0 48 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">'
      + '<rect x="3" y="10.5" width="31" height="3" rx="1.5"/><rect x="31" y="8" width="3.5" height="8" rx="1"/><rect x="34" y="1.5" width="12" height="21" rx="2.5"/></svg></span>';
    el.append(box);
    const h = { el, box, pos, seg: box.firstChild, hm: box.lastChild, svg: box.querySelector('svg'), dead: false };
    h.svg.style.rotate = CFG.tilt + 'deg';
    tint(h); live.set(el, h);
    return h;
  }

  function impact(h) {              // نور خفيف على الحافة + شرار صغير لفوق
    h.seg.animate([
      { opacity: 0.6, boxShadow: '0 0 0 0 currentColor' },
      { opacity: 1, boxShadow: '0 0 12px 3px currentColor', offset: 0.2 },
      { opacity: 0.6, boxShadow: '0 0 0 0 currentColor' }
    ], { duration: 420, easing: 'ease-out' });
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('i'), ang = -(15 + Math.random() * 150), dist = 12 + Math.random() * 14;
      s.className = 'uc-sp'; h.box.append(s);
      s.animate([
        { transform: `rotate(${ang}deg) translateX(2px) scaleX(.3)`, opacity: 1 },
        { transform: `rotate(${ang}deg) translateX(${dist}px) scaleX(1)`, opacity: 0 }
      ], { duration: 300 + Math.random() * 150, easing: 'ease-out' }).finished.then(() => s.remove(), () => s.remove());
    }
  }

  async function strike(h, n) {
    await go(h.hm, 'opacity', 0, 1, CFG.fadeMs);
    go(h.seg, 'opacity', 0, 0.6, 250);                         // الحتة اللي تحت المطرقة بتظهر لما ترتفع
    let a = CFG.tilt;
    for (let i = 0; i < n && !h.dead; i++) {
      await rot(h.svg, a, CFG.raise, i ? CFG.riseMs / 2 : CFG.riseMs, 'cubic-bezier(.35,0,.2,1)');   // رفعة هادية
      await rot(h.svg, CFG.raise, 0, CFG.downMs, 'cubic-bezier(.6,0,1,.5)');                         // نزلة بقوة
      if (h.dead) return;
      impact(h);
      a = -9; await rot(h.svg, 0, a, 100, 'ease-out');                                                // ارتداد صغير
      if (i < n - 1) await sleep(CFG.gapMs);
    }
    if (!h.dead) await rot(h.svg, a, CFG.tilt, 380, 'ease-out');                                      // وقفتها الأخيرة المايلة
  }

  function clear(root = document) {
    live.forEach((h, el) => {
      if (!root.contains(el)) return;
      h.dead = true; h.box.remove(); if (h.pos) el.style.position = ''; live.delete(el);
    });
  }

  const seen = () => { try { const v = sessionStorage.getItem(CFG.storeKey); sessionStorage.setItem(CFG.storeKey, '1'); return !!v; } catch { return false; } };

  async function play(root = document, opts = {}) {
    init();
    clear(root);
    const els = [...root.querySelectorAll(CFG.selector)].filter((el) => el.getClientRects().length);
    if (!els.length) return;
    const first = opts.first ?? !seen();
    const hs = els.map(build);
    if (reduced()) { hs.forEach((h) => { h.hm.style.opacity = 1; }); hs[0].seg.style.opacity = 0.6; return; }
    await strike(hs[0], els.length === 1 && first ? CFG.hits : 1);
    hs.slice(1).forEach((h, i) => setTimeout(() => go(h.hm, 'opacity', 0, 1, CFG.fadeMs), i * CFG.stagger));   // الباقيين: فيد بس
  }

  function init(overrides) {
    if (overrides) Object.assign(CFG, overrides);
    if (inited) return;
    inited = true;
    const st = document.createElement('style');
    st.textContent = `.uc{position:absolute;top:0;width:var(--w);height:0;z-index:3;pointer-events:none;transition:color ${CFG.themeMs}ms}`
      + `.uc-h{position:absolute;bottom:-1px;inset-inline-start:0;width:100%;height:calc(var(--w)/2);opacity:0}`
      + `.uc-h svg{display:block;width:100%;height:100%;overflow:visible;transform-origin:6.25% 50%}.uc svg *{vector-effect:non-scaling-stroke}`
      + `.uc-seg{position:absolute;top:-1px;inset-inline-start:58%;width:46%;height:2px;border-radius:2px;opacity:0;background:currentColor}`
      + `.uc-sp{position:absolute;top:0;inset-inline-start:81%;width:7px;height:1.5px;border-radius:1px;opacity:0;transform-origin:0 50%;background:currentColor}`;
    document.head.append(st);
    const later = () => { setTimeout(() => live.forEach(tint), 60); setTimeout(() => live.forEach(tint), CFG.themeMs + 150); };
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', later);
    const mo = new MutationObserver(later);
    [document.documentElement, document.body].forEach((n) => mo.observe(n, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme', 'style'] }));
  }

  return { init, play, clear, CFG };
})();
/* [END FX: under-construction] */


/* ============================================================
   [FX: typography-thabit-1]
   keywords: typography-thabit-1, ثابت 1, ثابت١, thabit 1, thabit-1, الخط بتاع ثابت, typography, تايبوجرافي, خط, الخطوط, font, fonts, font size, حجم الخط, Inter, Cairo, Playfair Display, خط ثابت, thabit fonts, landing fonts
   what:  كل تفاصيل الخط بتاعة صفحة landing (ثابت): العائلات، الأحجام، الأوزان، ارتفاع السطر، تباعد الحروف، وحالة العربي.
          مأخوذة من landing.html (القيم النهائية بعد كل الـoverrides). كل قيمة تتغير من CFG بس.
   usage: Typography.init()                      ← مرة واحدة: بيحمّل الخطوط ويضيف الـCSS
          <html lang="ar"> أو class="ar" على body ← بيفعّل نسخة العربي تلقائيًا
          class="t-brand" | t-hello | t-tag | t-title | t-question | t-question-sub | t-input | t-label
                 | t-label-float | t-message | t-alert | t-btn | t-btn-top | t-btn-large | t-card-btn
                 | t-body | t-body-lg | t-small | t-micro | t-hint
          Typography.init({ roles: { brand: { en: { size: '2.4rem' } } } })   ← تغيير أي قيمة
          Typography.css()                        ← بيرجّع نص الـCSS لو عايزه في ملف .css
   needs: إنترنت لتحميل Google Fonts. الأحجام بالـrem وأساس الصفحة html{font-size:90%} (يعني 1rem = 14.4px).
   ============================================================ */
const Typography = (() => {
  /* ---- الإعدادات: دي الحاجات الوحيدة اللي بتتغير ---- */
  const CFG = {
    googleFonts: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,500;1,700&family=Inter:wght@400;500;600;700;800&family=Cairo:wght@400;600;700;800;900&display=swap',
    htmlSize: '90%',                       // أساس الحجم: 1rem = 14.4px
    smoothing: 'antialiased',
    stacks: {
      en: "Inter, Cairo, system-ui, sans-serif",          // الإنجليزي (الأساس)
      ar: "Cairo, Inter, system-ui, sans-serif",          // العربي: Cairo الأول
      display: "'Playfair Display', Georgia, serif"       // العناوين الكبيرة (Welcome to / Thabit / الشعار)
    },
    arSelector: ':is(.ar, [lang^="ar"])',  // إمتى نفعّل نسخة العربي
    /* كل role: en = الأساس، ar = اللي بيتغير في العربي فقط. family = en | ar | display */
    roles: {
      hello:       { en: { family: 'display', style: 'italic', weight: 700, size: 'clamp(1.3rem,4.6vw,2rem)', line: 1,   ls: '.5px' },
                     ar: { family: 'ar', style: 'normal', weight: 800, line: 1.2, ls: '0' } },
      brand:       { en: { family: 'display', style: 'normal', weight: 800, size: 'clamp(3.2rem,15vw,7rem)', line: 1,    ls: '-.02em' },
                     ar: { family: 'ar', weight: 900, line: 1.15, ls: '0' } },
      tag:         { en: { family: 'display', style: 'italic', weight: 700, size: 'clamp(1.05rem,3.6vw,1.5rem)', line: 1.5, ls: '0' },
                     ar: { family: 'ar', style: 'normal', weight: 800, size: 'clamp(1.1rem,3.8vw,1.5rem)', line: 1.6 } },
      title:       { en: { family: 'en', weight: 700, size: '1.2rem',  line: 'normal' },  ar: { family: 'ar' } },
      question:    { en: { family: 'en', weight: 600, size: '1rem',    line: 1.4 },       ar: { family: 'ar' } },
      questionSub: { en: { family: 'en', weight: 600, size: '.88rem',  line: 1.4 },       ar: { family: 'ar' } },
      input:       { en: { family: 'en', weight: 500, size: '.92rem',  line: 'normal' },  ar: { family: 'ar' } },
      label:       { en: { family: 'en', weight: 500, size: '.92rem',  line: 'normal' },  ar: { family: 'ar' } },
      labelFloat:  { en: { family: 'en', weight: 700, size: '.72rem',  line: 'normal' },  ar: { family: 'ar' } },
      message:     { en: { family: 'en', weight: 600, size: '.72rem',  line: 'normal' },  ar: { family: 'ar' } },
      alert:       { en: { family: 'en', weight: 600, size: '.8rem',   line: 1.4 },       ar: { family: 'ar' } },
      btn:         { en: { family: 'en', weight: 800, size: '.92rem',  line: 'normal' },  ar: { family: 'ar' } },
      btnTop:      { en: { family: 'en', weight: 700, size: '.8rem',   line: 'normal' },  ar: { family: 'ar' } },
      btnLarge:    { en: { family: 'en', weight: 700, size: '1.05rem', line: 'normal' },  ar: { family: 'ar' } },
      cardBtn:     { en: { family: 'en', weight: 700, size: '1rem',    line: 'normal' },  ar: { family: 'ar' } },
      body:        { en: { family: 'en', weight: 500, size: '.88rem',  line: 1.6 },       ar: { family: 'ar' } },
      bodyLg:      { en: { family: 'en', weight: 500, size: '1rem',    line: 1.7 },       ar: { family: 'ar' } },
      small:       { en: { family: 'en', weight: 600, size: '.78rem',  line: 'normal' },  ar: { family: 'ar' } },
      micro:       { en: { family: 'en', weight: 700, size: '.66rem',  line: 'normal', ls: '.05em', transform: 'uppercase' },
                     ar: { family: 'ar', size: '.74rem', ls: '0', transform: 'none' } },
      hint:        { en: { family: 'en', weight: 600, size: '.84rem',  line: 1.55 },      ar: { family: 'ar' } }
    }
  };

  const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  const fam = (k) => 'var(--font-' + (k === 'display' ? 'display' : k) + ')';

  function decl(r) {
    const o = [];
    if (r.family)    o.push('font-family:' + fam(r.family));
    if (r.style)     o.push('font-style:' + r.style);
    if (r.weight)    o.push('font-weight:' + r.weight);
    if (r.size)      o.push('font-size:' + r.size);
    if (r.line != null) o.push('line-height:' + r.line);
    if (r.ls != null)   o.push('letter-spacing:' + r.ls);
    if (r.transform) o.push('text-transform:' + r.transform);
    return o.join(';');
  }

  function css() {
    const S = CFG.stacks, AR = CFG.arSelector;
    let out = ':root{--font-en:' + S.en + ';--font-ar:' + S.ar + ';--font-display:' + S.display + '}\n' +
      'html{font-size:' + CFG.htmlSize + '}\n' +
      'body{font-family:var(--font-en);-webkit-font-smoothing:' + CFG.smoothing + '}\n' +
      'body.ar,html[lang^="ar"] body{font-family:var(--font-ar)}\n';
    Object.keys(CFG.roles).forEach((name) => {
      const r = CFG.roles[name], cls = '.t-' + kebab(name);
      out += cls + '{' + decl(r.en) + '}\n';
      out += AR + ' ' + cls + '{' + decl(Object.assign({}, r.en, r.ar)) + '}\n';
    });
    return out;
  }

  function init(overrides) {
    if (overrides) {
      if (overrides.roles) Object.keys(overrides.roles).forEach((k) => {
        const cur = CFG.roles[k] || { en: {}, ar: {} }, o = overrides.roles[k];
        CFG.roles[k] = { en: Object.assign({}, cur.en, o.en), ar: Object.assign({}, cur.ar, o.ar) };
      });
      Object.keys(overrides).forEach((k) => { if (k !== 'roles') CFG[k] = typeof CFG[k] === 'object' && !Array.isArray(CFG[k]) ? Object.assign(CFG[k], overrides[k]) : overrides[k]; });
    }
    if (!document.querySelector('link[data-ui-kit-fonts]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = CFG.googleFonts; l.setAttribute('data-ui-kit-fonts', '');
      document.head.appendChild(l);
    }
    let st = document.getElementById('ui-kit-typography');
    if (!st) { st = document.createElement('style'); st.id = 'ui-kit-typography'; document.head.appendChild(st); }
    st.textContent = css();
  }

  return { init, css, CFG };
})();
/* [END FX: typography-thabit-1] */