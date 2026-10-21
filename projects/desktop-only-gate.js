/**
 * Mobile stub for desktop-first demos.
 * Shows a full-screen notice on narrow viewports.
 */
(function () {
  var MQ = "(max-width: 900px)";

  function isMobile() {
    try {
      if (window.matchMedia && window.matchMedia(MQ).matches) return true;
    } catch (e) {}
    return Math.min(window.innerWidth || 0, window.documentElement.clientWidth || 0) <= 900;
  }

  function titlesFromPath() {
    var path = (location.pathname || "").toLowerCase();
    if (path.indexOf("ai-org") !== -1) return "AI Аналитика Орг Структуры";
    if (path.indexOf("service-reports") !== -1) return "Отчёты сервисных показателей";
    if (path.indexOf("procurement") !== -1) return "Портал закупок";
    if (path.indexOf("porucheniya") !== -1 || path.indexOf("focus") !== -1) return "Платформа поручений";
    if (path.indexOf("flotatsiya") !== -1 || path.indexOf("flotat") !== -1) return "Карта процесса флотации";
    return document.title || "Демо";
  }

  function portfolioHref() {
    try {
      var path = location.pathname || "";
      var idx = path.toLowerCase().indexOf("/projects/");
      if (idx >= 0) {
        var after = path.slice(idx + "/projects/".length).split("/").filter(Boolean);
        // Drop filename if present (*.html)
        if (after.length && /\.html?$/i.test(after[after.length - 1])) after = after.slice(0, -1);
        var ups = after.length + 1;
        return new Array(ups + 1).join("../") + "index.html";
      }
    } catch (e) {}
    return "../../index.html";
  }

  function mount() {
    var existing = document.getElementById("pf-desktop-only-gate");
    if (existing) {
      existing.style.display = "flex";
      document.documentElement.classList.add("pf-desktop-only-active");
      return;
    }

    var title = titlesFromPath();
    var gate = document.createElement("div");
    gate.id = "pf-desktop-only-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.style.cssText =
      "display:flex;position:fixed;inset:0;z-index:2147483000;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:linear-gradient(160deg,#0b2a30 0%,#123a45 45%,#0b2a30 100%);color:#cfdee1;font-family:Inter,system-ui,sans-serif;text-align:center;";
    gate.innerHTML =
      '<div class="pf-dog-card" style="max-width:360px;width:100%">' +
      '<div class="pf-dog-mark" style="width:48px;height:48px;margin:0 auto 18px;border-radius:12px;background:#008f95;color:#fff;font-weight:800;font-size:14px;letter-spacing:0.04em;display:flex;align-items:center;justify-content:center">SB</div>' +
      '<h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;font-weight:700;color:#fff">' +
      title +
      "</h1>" +
      '<p style="margin:0 0 10px;font-size:15px;line-height:1.45;color:#a8bcc2">Это демо лучше смотрится на компьютере.</p>' +
      '<p style="font-size:13px;color:#8ba0a6;margin:0 0 22px">Откройте страницу на десктопе — или вернитесь в портфолио.</p>' +
      '<a class="pf-dog-btn" target="_parent" href="' +
      portfolioHref() +
      '" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:12px;background:#008f95;color:#fff;font-weight:700;font-size:15px;text-decoration:none">В портфолио</a>' +
      "</div>";

    var style = document.getElementById("pf-desktop-only-gate-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "pf-desktop-only-gate-style";
      style.textContent =
        "html.pf-desktop-only-active,html.pf-desktop-only-active body{overflow:hidden!important;height:100%!important;touch-action:none}" +
        "html.pf-desktop-only-active body > :not(#pf-desktop-only-gate){visibility:hidden!important;pointer-events:none!important}" +
        "#pf-desktop-only-gate{visibility:visible!important;pointer-events:auto!important}";
      (document.head || document.documentElement).appendChild(style);
    }

    document.documentElement.classList.add("pf-desktop-only-active");
    (document.body || document.documentElement).appendChild(gate);
  }

  function unmount() {
    document.documentElement.classList.remove("pf-desktop-only-active");
    var g = document.getElementById("pf-desktop-only-gate");
    var s = document.getElementById("pf-desktop-only-gate-style");
    if (g) g.remove();
    if (s) s.remove();
  }

  function sync() {
    if (isMobile()) mount();
    else unmount();
  }

  function boot() {
    sync();
    if (window.matchMedia) {
      try {
        window.matchMedia(MQ).addEventListener("change", sync);
      } catch (e) {
        try {
          window.matchMedia(MQ).addListener(sync);
        } catch (e2) {}
      }
    }
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    // Re-assert after SPA boot paints over the page
    setTimeout(sync, 0);
    setTimeout(sync, 400);
    setTimeout(sync, 1200);
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
