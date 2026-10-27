/* ==========================================================
   ThabitRich: shared renderer for formatted text (admin preview + trainee dashboard).
   The field value stays PLAIN TEXT with tiny markers, so Supabase columns,
   the archive and CSV export keep working unchanged:

     **bold**   __italic__   ++underline++
     {{gold:colored text}}   (gold green red blue purple orange gray)
     [[word]]   a "Hyperlinked" word (its recording plays on tap in the dashboard)

   Layout syntax that already existed is kept:
     blank line = new capsule · "1." / "a." numbered line · "-" or "•" bullet · " | " thin divider
   ========================================================== */
(function (g) {
  var COLORS = ['gold', 'green', 'red', 'blue', 'purple', 'orange', 'gray'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* inline markers -> HTML (input is already escaped) */
  function inline(s) {
    s = s.replace(/\{\{(gold|green|red|blue|purple|orange|gray):([\s\S]+?)\}\}/g, '<span class="rt-c-$1">$2</span>');
    s = s.replace(/\[\[([^\[\]\n]+?)\]\]/g, function (_, w) {
      return '<span class="rt-link" data-word="' + w.replace(/<[^>]*>/g, '').trim() + '" role="button" tabindex="0">' + w + '</span>';
    });
    s = s.replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>');
    s = s.replace(/__([\s\S]+?)__/g, '<i>$1</i>');
    s = s.replace(/\+\+([\s\S]+?)\+\+/g, '<u>$1</u>');
    return s;
  }

  function renderLine(raw) {
    var label = '', body = raw;
    var m = /^\s*(\d+|[a-y])([.)])\s+([\s\S]*)$/i.exec(raw);
    if (m) { label = m[1] + m[2]; body = m[3]; }
    else if ((m = /^\s*[-•]\s+([\s\S]*)$/.exec(raw))) { label = '•'; body = m[1]; }
    var cells = body.split(/\s*\|\s*/).filter(function (c) { return c.length; });
    var html = cells.map(function (c) { return '<span class="rt-txt" dir="auto">' + inline(esc(c)) + '</span>'; })
      .join('<span class="rt-sep" aria-hidden="true"></span>');
    return '<div class="rt-ln">' + (label ? '<span class="rt-no">' + esc(label) + '</span>' : '') + html + '</div>';
  }

  /* text -> HTML */
  function render(text) {
    var t = String(text == null ? '' : text).replace(/\r/g, '').trim();
    if (!t) return '';
    var caps = t.split(/\n\s*\n/).map(function (block) {
      var lines = block.split('\n').filter(function (l) { return l.trim(); });
      return '<div class="rt-cap">' + lines.map(renderLine).join('') + '</div>';
    });
    return '<div class="rt-body">' + caps.join('') + '</div>';
  }

  /* text -> text without markers (for one-line summaries and exports) */
  function strip(text) {
    return String(text == null ? '' : text)
      .replace(/\{\{(?:gold|green|red|blue|purple|orange|gray):([\s\S]+?)\}\}/g, '$1')
      .replace(/\[\[([^\[\]\n]+?)\]\]/g, '$1')
      .replace(/\*\*([\s\S]+?)\*\*/g, '$1')
      .replace(/__([\s\S]+?)__/g, '$1')
      .replace(/\+\+([\s\S]+?)\+\+/g, '$1');
  }

  /* the words marked as Hyperlinked (unique, in order) */
  function links(text) {
    var out = [], seen = {}, re = /\[\[([^\[\]\n]+?)\]\]/g, m;
    while ((m = re.exec(String(text || '')))) { var w = m[1].trim(); if (w && !seen[w.toLowerCase()]) { seen[w.toLowerCase()] = 1; out.push(w); } }
    return out;
  }

  var api = { render: render, strip: strip, links: links, inline: inline, esc: esc, COLORS: COLORS };
  g.ThabitRich = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
