(function () {
  "use strict";

  var APPS = window.APPS || [];
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- Small helpers ---------- */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function smoothPath(pts) {
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i], mx = (p0[0] + p1[0]) / 2;
      d += " C" + mx.toFixed(1) + " " + p0[1].toFixed(1) + " " + mx.toFixed(1) + " " +
        p1[1].toFixed(1) + " " + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
    }
    return d;
  }
  function walk(rand, n, start, drift, vol) {
    var v = start, out = [];
    for (var i = 0; i < n; i++) {
      v += drift + (rand() - 0.5) * vol;
      out.push(Math.max(0.05, Math.min(0.95, v)));
    }
    return out;
  }

  /* ---------- Generated cover figure ("plate") ---------- */
  var INK = "#0b2545", TEAL = "#1f6f78", OCHRE = "#c9952b", RULE = "#c3d0de", GRID = "#e6edf3";

  function plate(app, opts) {
    opts = opts || {};
    var W = 400, H = 300, L = 44, R = 14, T = 16, B = 34;
    var pw = W - L - R, ph = H - T - B;
    var rand = rng(hash(app.id));
    var svg = el("svg", {
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label": "Schematic cover figure for " + app.title,
      class: opts.animate ? "draw" : ""
    });

    // inner grid
    for (var gx = 0; gx <= 8; gx++) {
      var x = L + (pw * gx) / 8;
      el("line", { x1: x, y1: T, x2: x, y2: T + ph, stroke: GRID, "stroke-width": 1 }, svg);
    }
    for (var gy = 0; gy <= 5; gy++) {
      var y = T + (ph * gy) / 5;
      el("line", { x1: L, y1: y, x2: L + pw, y2: y, stroke: GRID, "stroke-width": 1 }, svg);
    }
    // axes + ticks
    el("path", { d: "M" + L + " " + T + " V" + (T + ph) + " H" + (L + pw), fill: "none", stroke: INK, "stroke-width": 1.4 }, svg);
    for (var tx = 0; tx <= 8; tx++) {
      var xx = L + (pw * tx) / 8;
      el("line", { x1: xx, y1: T + ph, x2: xx, y2: T + ph + 5, stroke: INK, "stroke-width": 1 }, svg);
    }
    for (var ty = 0; ty <= 5; ty++) {
      var yy = T + (ph * ty) / 5;
      el("line", { x1: L - 5, y1: yy, x2: L, y2: yy, stroke: INK, "stroke-width": 1 }, svg);
      var lab = el("text", { x: L - 9, y: yy + 4, "text-anchor": "end", "font-size": 11, fill: "#6b7f98", "font-family": "IBM Plex Sans Condensed, sans-serif" }, svg);
      lab.textContent = String((5 - ty) * 20);
    }

    var n = 25, X = function (i) { return L + (pw * i) / (n - 1); };
    var Y = function (v) { return T + ph * (1 - v); };
    var kind = app.plate || "lines";
    var colors = [INK, TEAL, OCHRE];

    if (kind === "bars") {
      var a = walk(rand, n, 0.35, 0.004, 0.12), b = walk(rand, n, 0.25, 0, 0.08);
      var bw = (pw / n) * 0.62;
      for (var i = 0; i < n; i++) {
        var h1 = ph * a[i] * 0.6, h2 = ph * b[i] * 0.45;
        el("rect", { x: X(i) - bw / 2, y: T + ph - h1, width: bw, height: h1, fill: INK }, svg);
        el("rect", { x: X(i) - bw / 2, y: T + ph - h1 - h2, width: bw, height: h2, fill: OCHRE }, svg);
      }
    } else if (kind === "area") {
      var s1 = walk(rand, n, 0.34, -0.003, 0.06),
          s2 = walk(rand, n, 0.2, 0.001, 0.05),
          s3 = walk(rand, n, 0.12, 0.001, 0.04);
      var base = new Array(n).fill(0);
      [s1, s2, s3].forEach(function (s, k) {
        var top = s.map(function (v, i) { return Math.min(0.97, base[i] + v); });
        var up = top.map(function (v, i) { return [X(i), Y(v)]; });
        var down = base.map(function (v, i) { return [X(i), Y(v)]; }).reverse();
        var d = smoothPath(up) + " L" + down.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") + " Z";
        el("path", { d: d, fill: colors[k], "fill-opacity": k === 0 ? 0.16 : 0.22, stroke: "none" }, svg);
        var line = el("path", { d: smoothPath(up), fill: "none", stroke: colors[k], "stroke-width": 2, class: "series" }, svg);
        base = top;
        line.dataset.series = "1";
      });
    } else {
      [0.62, 0.45, 0.28].forEach(function (start, k) {
        var s = walk(rand, n, start, (rand() - 0.5) * 0.01, 0.09);
        el("path", { d: smoothPath(s.map(function (v, i) { return [X(i), Y(v)]; })), fill: "none", stroke: colors[k], "stroke-width": 2.2, class: "series" }, svg);
      });
    }
    return svg;
  }

  function measureSeries(svg) {
    svg.querySelectorAll("path.series").forEach(function (p) {
      p.style.setProperty("--len", Math.ceil(p.getTotalLength()));
    });
  }

  function viewerHref(app) { return "viewer.html?app=" + encodeURIComponent(app.id); }

  /* ---------- Home page ---------- */
  function renderHome() {
    var heroFig = document.getElementById("hero-figure");
    if (heroFig && APPS.length) {
      var svg = plate({ id: "catalog-frontispiece", title: "this catalog", plate: "lines" }, { animate: true });
      heroFig.insertBefore(svg, heroFig.firstChild);
      measureSeries(svg);
      heroFig.querySelector("figcaption").innerHTML =
        "<b>Frontispiece</b> Each visualizer in the catalog gets a schematic cover like this one. " +
        "The real series live inside each dashboard.";
    }

    var count = document.getElementById("count");
    if (count) count.textContent = APPS.length === 1 ? "1 visualizer" : APPS.length + " visualizers";

    var list = document.getElementById("catalog-list");
    if (!list) return;

    APPS.forEach(function (app, i) {
      var art = document.createElement("article");
      art.className = "entry";
      art.innerHTML =
        '<figure class="plate"><div class="frame"></div>' +
        "<figcaption><b>Fig. " + (i + 1) + "</b> " + esc(app.tool) + "</figcaption></figure>" +
        "<div>" +
        '<h3><a href="' + viewerHref(app) + '">' + esc(app.title) + "</a></h3>" +
        '<p class="summary">' + esc(app.summary) + "</p>" +
        '<dl class="facts">' +
        "<div><dt>Source</dt><dd>" + esc(app.source) + "</dd></div>" +
        "<div><dt>Coverage</dt><dd>" + esc(app.coverage) + "</dd></div>" +
        "<div><dt>Refresh</dt><dd>" + esc(app.refresh) + "</dd></div>" +
        "</dl>" +
        '<ul class="topics">' + (app.topics || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<div class="actions">' +
        '<a class="btn" href="' + viewerHref(app) + '">Open visualizer</a>' +
        (app.link ? '<a class="btn ghost" href="' + esc(app.link) + '" target="_blank" rel="noopener">Open in Looker Studio</a>' : "") +
        "</div></div>";
      art.querySelector(".frame").appendChild(plate(app));
      list.appendChild(art);
    });

    var empty = document.createElement("article");
    empty.className = "entry empty";
    empty.innerHTML =
      '<figure class="plate"><div class="frame">Fig. ' + (APPS.length + 1) + "</div></figure>" +
      "<div><h3>Next visualizer in preparation</h3>" +
      '<p class="summary">New dashboards are added to this catalog as they are published.</p></div>';
    list.appendChild(empty);
  }

  /* ---------- Viewer page ---------- */
  function renderViewer() {
    var root = document.getElementById("viewer");
    if (!root) return;
    var id = new URLSearchParams(location.search).get("app");
    var app = APPS.filter(function (a) { return a.id === id; })[0];

    if (!app) {
      root.innerHTML =
        '<div class="wrap missing"><h1>Visualizer not found</h1>' +
        "<p>The address does not match any visualizer in the catalog. " +
        'Go back to the <a href="./">list of visualizers</a> and choose one from there.</p></div>';
      document.title = "Visualizer not found · Visualization";
      return;
    }

    document.title = app.title + " · Visualization";
    root.innerHTML =
      '<header class="viewer-head"><div class="wrap">' +
      '<a class="back" href="./">Back to all visualizers</a>' +
      "<h1>" + esc(app.title) + "</h1>" +
      '<p class="summary">' + esc(app.summary) + "</p>" +
      '<dl class="facts">' +
      "<div><dt>Source</dt><dd>" + esc(app.source) + "</dd></div>" +
      "<div><dt>Coverage</dt><dd>" + esc(app.coverage) + "</dd></div>" +
      "<div><dt>Refresh</dt><dd>" + esc(app.refresh) + "</dd></div>" +
      "</dl></div></header>" +
      '<section class="stage" aria-label="Interactive visualizer"><div class="sheet">' +
      '<iframe title="' + esc(app.title) + '" src="' + esc(app.embed) + '" height="' + (app.height || 900) + '" ' +
      'loading="lazy" allowfullscreen ' +
      'sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>' +
      "</div>" +
      '<p class="hint">Use the page selector inside the report to move between sections. ' +
      (app.link ? 'If it does not load, <a href="' + esc(app.link) + '" target="_blank" rel="noopener">open it in Looker Studio</a>.' : "") +
      "</p></section>" +
      (app.notes && app.notes.length
        ? '<section class="notes"><div class="wrap notes-grid"><h2>Methodological notes</h2><ol>' +
          app.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") +
          "</ol></div></section>"
        : "");
  }

  renderHome();
  renderViewer();
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
