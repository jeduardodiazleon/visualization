(function () {
  "use strict";

  var APPS = window.APPS || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function href(app) { return "viewer.html?app=" + encodeURIComponent(app.id); }
  function isLive(app) { return app.status !== "draft"; }

  /* ---------- Home ---------- */
  function renderHome() {
    var grid = document.getElementById("grid");
    if (!grid) return;

    var live = APPS.filter(isLive).length;
    var liveEl = document.getElementById("live-count");
    if (liveEl) liveEl.textContent = (live === 1 ? "1 live dashboard" : live + " live dashboards") + ", refreshed daily";
    var countEl = document.getElementById("count");
    if (countEl) countEl.textContent = APPS.length === 1 ? "1 visualizer" : APPS.length + " visualizers";

    APPS.forEach(function (app, i) {
      var card = document.createElement("article");
      card.className = "card";
      var open = isLive(app);
      card.innerHTML =
        (app.thumbnail
          ? '<figure class="shot"><a href="' + href(app) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(app.thumbnail) + '" alt="" loading="lazy"></a>' +
            "<figcaption><b>Fig. " + (i + 1) + "</b>" + esc(app.tool) + (open ? "" : ", in preparation") + "</figcaption></figure>"
          : "") +
        '<div class="card-body">' +
          '<h3><a href="' + href(app) + '">' + esc(app.title) + "</a></h3>" +
          '<p class="summary">' + esc(app.summary) + "</p>" +
          '<dl class="meta">' +
            "<div><dt>Source</dt><dd>" + esc(app.source) + "</dd></div>" +
            "<div><dt>Coverage</dt><dd>" + esc(app.coverage) + "</dd></div>" +
            "<div><dt>Refresh</dt><dd>" + esc(app.refresh) + "</dd></div>" +
          "</dl>" +
          (app.pages && app.pages.length
            ? '<ul class="pages" aria-label="Pages in this dashboard">' + app.pages.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>"
            : "") +
          '<div class="actions">' +
            (open ? '<a class="btn" href="' + href(app) + '">Open visualizer</a>' : "") +
            (app.link && open ? '<a class="btn ghost" href="' + esc(app.link) + '" target="_blank" rel="noopener">Open in Looker Studio</a>' : "") +
          "</div>" +
        "</div>";
      grid.appendChild(card);
    });

    var slot = document.createElement("article");
    slot.className = "card slot";
    slot.innerHTML =
      '<div class="card-body"><h3>Next visualizer</h3>' +
      "<p>New dashboards appear here as they are published.</p></div>";
    grid.appendChild(slot);
  }

  /* ---------- Viewer ---------- */
  function renderViewer() {
    var root = document.getElementById("viewer");
    if (!root) return;
    var id = new URLSearchParams(location.search).get("app");
    var app = APPS.filter(function (a) { return a.id === id; })[0];

    if (!app) {
      document.title = "Visualizer not found · Visualization";
      root.innerHTML =
        '<div class="wrap missing"><h1>Visualizer not found</h1>' +
        "<p>This address does not match any visualizer in the catalog. " +
        'Go back to the <a href="./">catalog</a> and choose one from there.</p></div>';
      return;
    }

    document.title = app.title + " · Visualization";
    root.innerHTML =
      '<header class="v-head"><div class="wrap">' +
        '<a class="back" href="./">Back to the catalog</a>' +
        "<h1>" + esc(app.title) + "</h1>" +
        '<div class="v-row">' +
          '<p class="summary">' + esc(app.summary) + "</p>" +
          '<dl class="meta">' +
            "<div><dt>Source</dt><dd>" + esc(app.source) + "</dd></div>" +
            "<div><dt>Coverage</dt><dd>" + esc(app.coverage) + "</dd></div>" +
            "<div><dt>Refresh</dt><dd>" + esc(app.refresh) + "</dd></div>" +
          "</dl>" +
        "</div>" +
      "</div></header>" +
      '<section class="stage" aria-label="Interactive visualizer"><div class="frame">' +
        '<iframe title="' + esc(app.title) + '" src="' + esc(app.embed) + '" height="' + (app.height || 900) + '" loading="lazy" allowfullscreen ' +
        'sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>' +
      "</div>" +
      '<p class="hint">Use the page selector inside the report to switch between ' +
        (app.pages ? esc(app.pages.join(", ").replace(/, ([^,]*)$/, " and $1").toLowerCase()) : "sections") + ". " +
        (app.link ? 'If it does not load, <a href="' + esc(app.link) + '" target="_blank" rel="noopener">open it in Looker Studio</a>.' : "") +
      "</p></section>" +
      (app.notes && app.notes.length
        ? '<section class="notes"><div class="wrap notes-grid"><h2>How it was built</h2><ol>' +
          app.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ol></div></section>"
        : "");
  }

  renderHome();
  renderViewer();
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
