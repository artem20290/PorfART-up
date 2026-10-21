(function () {
  var MQ = window.matchMedia("(max-width: 767.98px)");
  var SHORT_TITLE = "Поручения";
  var FULL_TITLE = "Платформа поручений";

  function ensureBackdrop() {
    var el = document.querySelector(".poru-backdrop");
    if (!el) {
      el = document.createElement("button");
      el.type = "button";
      el.className = "poru-backdrop";
      el.setAttribute("aria-label", "Закрыть меню предприятий");
      el.addEventListener("click", closeDrawer);
      document.body.appendChild(el);
    }
    return el;
  }

  function toggleBtn() {
    return document.querySelector('button[aria-label="Переключить боковую панель"]');
  }

  function isDrawerOpen() {
    var aside = document.querySelector(".poru-sidebar");
    if (!aside) return false;
    if (aside.classList.contains("w-0")) return false;
    if (aside.classList.contains("w-[260px]")) return true;
    return aside.getBoundingClientRect().width > 40;
  }

  function closeDrawer() {
    if (!MQ.matches || !isDrawerOpen()) return;
    var btn = toggleBtn();
    if (btn) btn.click();
  }

  function syncDrawer() {
    var backdrop = ensureBackdrop();
    if (!MQ.matches) {
      backdrop.classList.remove("is-open");
      document.documentElement.style.removeProperty("overflow");
      return;
    }
    var open = isDrawerOpen();
    backdrop.classList.toggle("is-open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  }

  function syncBrandTitle() {
    var title = document.querySelector("header a .font-medium.truncate, header a span.truncate");
    if (!title) return;
    if (MQ.matches) {
      if (title.textContent.trim() === FULL_TITLE || title.textContent.indexOf("Платформа") === 0) {
        title.textContent = SHORT_TITLE;
        title.setAttribute("data-poru-short", "1");
      }
    } else if (title.getAttribute("data-poru-short") === "1") {
      title.textContent = FULL_TITLE;
      title.removeAttribute("data-poru-short");
    }
  }

  function fixListCards() {
    if (!MQ.matches) return;
    document.querySelectorAll(".poru-main tbody tr").forEach(function (tr) {
      tr.style.setProperty("display", "flex", "important");
      tr.style.setProperty("flex-direction", "column", "important");
      tr.style.setProperty("height", "auto", "important");
    });
  }

  function polishToolbar() {
    if (!MQ.matches) return;
    var tb = document.querySelector(".poru-toolbar");
    if (!tb) return;
    // Status tabs strip: scroll + clipped rounded edges
    var tabs = [...tb.children].find(function (el) {
      var c = el.className + "";
      return c.indexOf("items-center") !== -1 && c.indexOf("border") !== -1 && c.indexOf("rounded") !== -1;
    });
    if (tabs) {
      tabs.classList.add("poru-status-tabs");
      tabs.style.setProperty("width", "100%", "important");
      tabs.style.setProperty("max-width", "100%", "important");
      tabs.style.setProperty("overflow-x", "auto", "important");
      tabs.style.setProperty("overflow-y", "hidden", "important");
      tabs.style.setProperty("border-radius", "12px", "important");
      tabs.style.setProperty("flex-wrap", "nowrap", "important");
      tabs.style.setProperty("box-sizing", "border-box", "important");
      [...tabs.children].forEach(function (btn) {
        btn.style.setProperty("flex", "0 0 auto", "important");
        btn.style.setProperty("white-space", "nowrap", "important");
        btn.style.setProperty("border-radius", "0", "important");
      });
    }
    var actions = tb.querySelector(".ml-auto");
    if (!actions) return;
    actions.style.setProperty("display", "grid", "important");
    actions.style.setProperty("grid-template-columns", "1fr 1fr", "important");
    actions.style.setProperty("width", "100%", "important");
    actions.style.setProperty("margin-left", "0", "important");
    actions.style.setProperty("gap", "8px", "important");
    [...actions.children].forEach(function (btn) {
      btn.style.setProperty("width", "100%", "important");
      btn.style.setProperty("height", "44px", "important");
      btn.style.setProperty("min-height", "44px", "important");
      btn.style.setProperty("padding", "0 12px", "important");
      btn.style.setProperty("border-radius", "10px", "important");
      btn.style.setProperty("display", "inline-flex", "important");
      btn.style.setProperty("align-items", "center", "important");
      btn.style.setProperty("justify-content", "center", "important");
      btn.style.setProperty("gap", "8px", "important");
      btn.style.setProperty("box-sizing", "border-box", "important");
      // reveal hidden label spans
      btn.querySelectorAll("span.hidden").forEach(function (s) {
        s.style.setProperty("display", "inline", "important");
        s.classList.remove("hidden");
      });
    });
  }

  function polishFiltersSheet() {
    if (!MQ.matches) return;
    var wrap = [...document.querySelectorAll(".fixed")].find(function (el) {
      return (el.className + "").indexOf("z-[65]") !== -1;
    });
    if (!wrap) return;
    wrap.style.setProperty("align-items", "flex-end", "important");
    wrap.style.setProperty("justify-content", "stretch", "important");
    wrap.style.setProperty("padding", "0", "important");
    wrap.style.setProperty("flex-direction", "column", "important");

    // kids: [0]=dim backdrop, [1]=actual panel
    var kids = [...wrap.children];
    var backdrop = kids.find(function (c) {
      return (c.className + "").indexOf("absolute") !== -1 && c.children.length === 0;
    });
    var panel = kids.find(function (c) {
      return (c.className + "").indexOf("max-w-") !== -1 || (c.className + "").indexOf("bg-[var(--surface)]") !== -1;
    }) || kids[kids.length - 1];

    if (backdrop) {
      backdrop.classList.remove("poru-filters-sheet");
      backdrop.style.setProperty("background", "rgba(0,17,34,0.45)", "important");
    }
    if (!panel) return;
    panel.classList.add("poru-filters-sheet");
    panel.style.setProperty("position", "relative", "important");
    panel.style.setProperty("width", "100%", "important");
    panel.style.setProperty("max-width", "100%", "important");
    panel.style.setProperty("height", "auto", "important");
    panel.style.setProperty("max-height", "min(88dvh, 100%)", "important");
    panel.style.setProperty("margin-top", "auto", "important");
    panel.style.setProperty("border-radius", "16px 16px 0 0", "important");
    panel.style.setProperty("overflow-y", "auto", "important");
    panel.style.setProperty("overflow-x", "hidden", "important");
    panel.style.setProperty("align-self", "stretch", "important");

    panel.querySelectorAll("button").forEach(function (btn) {
      var t = (btn.textContent || "").trim();
      if (t === "Карточки" || t === "Список" || t === "Дорожная карта") {
        btn.style.setProperty("width", "100%", "important");
        btn.style.setProperty("min-height", "44px", "important");
        btn.style.setProperty("border-radius", "10px", "important");
        btn.style.setProperty("justify-content", "flex-start", "important");
        btn.style.setProperty("box-sizing", "border-box", "important");
      }
      if (t === "Compact" || t === "Standard" || t.indexOf("Компакт") === 0 || t.indexOf("Стандарт") === 0) {
        btn.style.setProperty("flex", "1 1 50%", "important");
        btn.style.setProperty("min-height", "40px", "important");
        btn.style.setProperty("justify-content", "center", "important");
      }
      // Sort rows
      if (/^По /.test(t)) {
        btn.classList.add("poru-sort-btn");
        btn.style.setProperty("width", "100%", "important");
        btn.style.setProperty("min-height", "48px", "important");
        btn.style.setProperty("height", "auto", "important");
        btn.style.setProperty("padding", "12px 14px", "important");
        btn.style.setProperty("border-radius", "12px", "important");
        btn.style.setProperty("border", "1px solid var(--border)", "important");
        btn.style.setProperty("background", "var(--surface)", "important");
        btn.style.setProperty("box-sizing", "border-box", "important");
        btn.style.setProperty("display", "flex", "important");
        btn.style.setProperty("align-items", "center", "important");
        btn.style.setProperty("justify-content", "space-between", "important");
        btn.style.setProperty("gap", "12px", "important");
        btn.style.setProperty("margin-top", "8px", "important");
        btn.querySelectorAll("svg").forEach(function (svg) {
          svg.style.setProperty("width", "18px", "important");
          svg.style.setProperty("height", "18px", "important");
          svg.style.setProperty("flex-shrink", "0", "important");
        });
      }
      // Quick filters — keep React nodes, style count badge
      if (/Просрочено|Сегодня|На этой неделе|Мои задачи|Высокий приоритет/.test(t)) {
        btn.classList.add("poru-quick-btn");
        btn.style.setProperty("width", "100%", "important");
        btn.style.setProperty("min-height", "48px", "important");
        btn.style.setProperty("height", "auto", "important");
        btn.style.setProperty("padding", "12px 14px", "important");
        btn.style.setProperty("border-radius", "12px", "important");
        btn.style.setProperty("border", "1px solid var(--border)", "important");
        btn.style.setProperty("background", "var(--surface)", "important");
        btn.style.setProperty("box-sizing", "border-box", "important");
        btn.style.setProperty("display", "flex", "important");
        btn.style.setProperty("align-items", "center", "important");
        btn.style.setProperty("justify-content", "flex-start", "important");
        btn.style.setProperty("gap", "12px", "important");
        btn.style.setProperty("margin-top", "8px", "important");
        var countSpan = [...btn.querySelectorAll("span")].find(function (s) {
          return /^\d+$/.test((s.textContent || "").trim());
        });
        if (countSpan) {
          countSpan.classList.add("poru-filter-count");
          countSpan.style.setProperty("display", "inline-flex", "important");
          countSpan.style.setProperty("align-items", "center", "important");
          countSpan.style.setProperty("justify-content", "center", "important");
          countSpan.style.setProperty("min-width", "28px", "important");
          countSpan.style.setProperty("height", "24px", "important");
          countSpan.style.setProperty("padding", "0 8px", "important");
          countSpan.style.setProperty("border-radius", "999px", "important");
          countSpan.style.setProperty("font-size", "12px", "important");
          countSpan.style.setProperty("font-weight", "700", "important");
          countSpan.style.setProperty("background", "var(--surface-2)", "important");
          countSpan.style.setProperty("border", "1px solid var(--border)", "important");
          countSpan.style.setProperty("margin-left", "auto", "important");
        }
        btn.querySelectorAll("svg").forEach(function (svg) {
          svg.style.setProperty("width", "18px", "important");
          svg.style.setProperty("height", "18px", "important");
          svg.style.setProperty("flex-shrink", "0", "important");
        });
      }
    });

    // Density toggle full width
    panel.querySelectorAll(".flex.items-center.border").forEach(function (row) {
      if (row.querySelector("button") && /Compact|Standard|Компакт|Стандарт/.test(row.textContent || "")) {
        row.style.setProperty("width", "100%", "important");
        row.style.setProperty("display", "flex", "important");
        [...row.children].forEach(function (b) {
          b.style.setProperty("flex", "1 1 0", "important");
          b.style.setProperty("justify-content", "center", "important");
        });
      }
    });

    // Filters sheet close button
    var fClose = panel.querySelector(".sticky button, [class*='sticky'] button");
    if (fClose && !(fClose.textContent || "").trim()) {
      fClose.classList.add("poru-filters-close");
      fClose.style.setProperty("width", "44px", "important");
      fClose.style.setProperty("height", "44px", "important");
      fClose.style.setProperty("min-width", "44px", "important");
      fClose.style.setProperty("padding", "0", "important");
      fClose.style.setProperty("display", "inline-flex", "important");
      fClose.style.setProperty("align-items", "center", "important");
      fClose.style.setProperty("justify-content", "center", "important");
      fClose.style.setProperty("border-radius", "12px", "important");
      fClose.style.setProperty("background", "var(--surface-2)", "important");
      fClose.style.setProperty("border", "1px solid var(--border)", "important");
    }
  }

  function polishDetailModal() {
    if (!MQ.matches) return;
    [50, 55, 60].forEach(function (z) {
      var wrap = [...document.querySelectorAll(".fixed")].find(function (el) {
        return (el.className + "").indexOf("z-[" + z + "]") !== -1 || (z === 50 && /\bz-50\b/.test(el.className));
      });
      if (!wrap) return;
      if ((wrap.className + "").indexOf("z-[65]") !== -1) return;

      wrap.style.setProperty("align-items", "flex-end", "important");
      wrap.style.setProperty("justify-content", "stretch", "important");
      wrap.style.setProperty("padding", "0", "important");

      var panel = [...wrap.children].find(function (c) {
        return (c.className + "").indexOf("relative") !== -1;
      });
      if (!panel) return;
      panel.classList.add("poru-detail-sheet");
      panel.style.setProperty("width", "100%", "important");
      panel.style.setProperty("max-width", "100%", "important");
      panel.style.setProperty("height", "min(90dvh, 100%)", "important");
      panel.style.setProperty("max-height", "min(90dvh, 100%)", "important");
      panel.style.setProperty("border-radius", "18px 18px 0 0", "important");
      panel.style.setProperty("margin", "0", "important");
      panel.style.setProperty("margin-top", "auto", "important");
      panel.style.setProperty("display", "flex", "important");
      panel.style.setProperty("flex-direction", "column", "important");
      panel.style.setProperty("overflow", "hidden", "important");
      panel.style.setProperty("box-shadow", "0 -12px 40px rgba(0,17,34,0.22)", "important");

      // Header: id left, close as 44×44
      var header = [...panel.children].find(function (c) {
        return (c.className + "").indexOf("border-b") !== -1 && (c.className + "").indexOf("flex") !== -1;
      });
      if (header) {
        header.style.setProperty("align-items", "center", "important");
        header.style.setProperty("gap", "10px", "important");
        header.style.setProperty("padding", "8px 14px 12px", "important");
        var closeBtn = header.querySelector("button");
        if (closeBtn) {
          closeBtn.classList.add("poru-detail-close");
          closeBtn.style.setProperty("width", "44px", "important");
          closeBtn.style.setProperty("min-width", "44px", "important");
          closeBtn.style.setProperty("max-width", "44px", "important");
          closeBtn.style.setProperty("height", "44px", "important");
          closeBtn.style.setProperty("min-height", "44px", "important");
          closeBtn.style.setProperty("padding", "0", "important");
          closeBtn.style.setProperty("flex", "0 0 44px", "important");
          closeBtn.style.setProperty("display", "inline-flex", "important");
          closeBtn.style.setProperty("align-items", "center", "important");
          closeBtn.style.setProperty("justify-content", "center", "important");
          closeBtn.style.setProperty("border-radius", "12px", "important");
          closeBtn.style.setProperty("background", "var(--surface-2)", "important");
          closeBtn.style.setProperty("border", "1px solid var(--border)", "important");
          closeBtn.querySelectorAll("svg").forEach(function (svg) {
            svg.style.setProperty("width", "20px", "important");
            svg.style.setProperty("height", "20px", "important");
          });
        }
        var left = header.querySelector(".flex.items-center.gap-3, .flex.items-center");
        if (left) {
          left.style.setProperty("flex", "1 1 auto", "important");
          left.style.setProperty("min-width", "0", "important");
          left.style.setProperty("flex-wrap", "wrap", "important");
          left.style.setProperty("gap", "8px", "important");
          // keep only id in header left; move status out
          var statusPill = left.querySelector(".inline-flex.items-center.gap-1\\.5.rounded-\\[20px\\], span.inline-flex");
          if (!statusPill) {
            statusPill = [...left.querySelectorAll("span")].find(function (s) {
              return /В работе|Просрочено|Завершено|Отменено/.test(s.textContent || "");
            });
          }
          if (statusPill && !panel.querySelector(".poru-detail-meta")) {
            // will attach below with due
            statusPill.setAttribute("data-poru-status", "1");
          }
        }
      }

      // Meta row: status + due ABOVE title
      var h2 = panel.querySelector("h2");
      if (h2 && !panel.querySelector(".poru-detail-meta")) {
        var meta = document.createElement("div");
        meta.className = "poru-detail-meta";

        var statusEl =
          panel.querySelector("[data-poru-status]") ||
          (header &&
            [...header.querySelectorAll("span")].find(function (s) {
              return /В работе|Просрочено|Завершено|Отменено/.test(s.textContent || "");
            }));
        if (statusEl) {
          var statusClone = statusEl.cloneNode(true);
          statusClone.removeAttribute("data-poru-status");
          meta.appendChild(statusClone);
          // hide original in header to avoid duplicate horizontal layout
          statusEl.style.setProperty("display", "none", "important");
        }

        // Deadline: «Срок исполнения» block (date may sit next to svg)
        var dueText = "";
        var srokLabel = [...panel.querySelectorAll("div, span, p, label")].find(function (el) {
          var t = (el.textContent || "").trim();
          return el.children.length === 0 && /^Срок исполнения$/i.test(t);
        });
        if (srokLabel) {
          var block = srokLabel.parentElement;
          var dateEl = block && [...block.querySelectorAll("div, span")].find(function (el) {
            return /^\d{2}\.\d{2}\.\d{4}$/.test((el.textContent || "").trim());
          });
          if (dateEl) {
            var dm = (dateEl.textContent || "").trim().match(/\d{2}\.\d{2}\.\d{4}/);
            if (dm) dueText = dm[0];
          }
        }
        if (!dueText) {
          var boldDue = [...panel.querySelectorAll("[class*='font-bold']")].find(function (el) {
            return /^\d{2}\.\d{2}\.\d{4}$/.test((el.textContent || "").trim());
          });
          if (boldDue) {
            var bm = (boldDue.textContent || "").trim().match(/\d{2}\.\d{2}\.\d{4}/);
            if (bm) dueText = bm[0];
          }
        }
        if (dueText) {
          var due = document.createElement("span");
          due.className = "poru-detail-due";
          due.textContent = "Срок " + dueText;
          meta.appendChild(due);
        }

        if (meta.childNodes.length) {
          // Above titles: first child of title column
          var titleCol = h2.parentNode;
          titleCol.insertBefore(meta, titleCol.firstChild);
        }
      }

      // Footer actions only
      var footers = panel.querySelectorAll("[class*='border-t'].flex");
      footers.forEach(function (ft) {
        if ((ft.className + "").indexOf("border-b") !== -1) return;
        ft.style.setProperty("flex-direction", "column-reverse", "important");
        ft.style.setProperty("flex-wrap", "nowrap", "important");
        ft.style.setProperty("align-items", "stretch", "important");
        ft.style.setProperty("gap", "8px", "important");
        ft.style.setProperty("padding", "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))", "important");
        [...ft.children].forEach(function (ch) {
          ch.style.setProperty("width", "100%", "important");
          ch.style.setProperty("max-width", "100%", "important");
          if ((ch.className + "").includes("flex") && ch.querySelector("button")) {
            ch.style.setProperty("display", "flex", "important");
            ch.style.setProperty("flex-direction", "column", "important");
            ch.style.setProperty("gap", "8px", "important");
          }
        });
        ft.querySelectorAll("button").forEach(function (b) {
          b.style.setProperty("width", "100%", "important");
          b.style.setProperty("min-height", "48px", "important");
          b.style.setProperty("justify-content", "center", "important");
          b.style.setProperty("border-radius", "12px", "important");
        });
      });

      panel.querySelectorAll(".grid.grid-cols-12, [class*='grid-cols-12']").forEach(function (g) {
        g.style.setProperty("grid-template-columns", "1fr", "important");
        g.style.setProperty("gap", "14px", "important");
        g.style.setProperty("padding", "12px 14px 20px", "important");
      });
      panel.querySelectorAll("[class*='col-span-']").forEach(function (c) {
        c.style.setProperty("grid-column", "1 / -1", "important");
      });
      // Put sidebar meta (protocol/enterprise) right after title block — before tree
      var mainCol = panel.querySelector("[class*='lg:col-span-8'], [class*='col-span-12'][class*='lg:col-span-8']");
      var sideCol = panel.querySelector("[class*='lg:col-span-4']");
      if (mainCol && sideCol && mainCol.parentElement === sideCol.parentElement) {
        // already stacked by grid 1col; tighten side cards
        sideCol.style.setProperty("order", "-1", "important");
        // Actually user wants status/date above title — side info can stay below title content.
        // Keep natural order: title first, then side meta as compact chips row is enough.
        sideCol.style.removeProperty("order");
      }
      panel.querySelectorAll("h2").forEach(function (h) {
        h.style.setProperty("font-size", "17px", "important");
        h.style.setProperty("line-height", "1.35", "important");
        h.style.setProperty("margin-top", "0", "important");
      });

      // Executor tree: status above avatar, full width for text
      panel.querySelectorAll(".flex.items-start.justify-between.gap-3").forEach(function (row) {
        var avatar = row.querySelector(".rounded-full");
        var statusCol = row.querySelector(".text-right.shrink-0, .shrink-0.text-right");
        if (!statusCol) {
          statusCol = [...row.children].find(function (c) {
            return /В работе|Просрочено|Завершено|Отменено/.test(c.textContent || "") &&
              !(c.className + "").includes("items-center");
          });
        }
        if (!avatar || !statusCol) return;
        row.classList.add("poru-tree-row");
        row.style.setProperty("display", "flex", "important");
        row.style.setProperty("flex-direction", "column", "important");
        row.style.setProperty("align-items", "stretch", "important");
        row.style.setProperty("gap", "8px", "important");
        statusCol.classList.add("poru-tree-status");
        statusCol.style.setProperty("order", "-1", "important");
        statusCol.style.setProperty("text-align", "left", "important");
        statusCol.style.setProperty("align-self", "flex-start", "important");
        statusCol.style.setProperty("flex-shrink", "0", "important");
        statusCol.style.setProperty("width", "auto", "important");
        var person = [...row.children].find(function (c) {
          return c !== statusCol && c.querySelector(".rounded-full");
        });
        if (person) {
          person.classList.add("poru-tree-person");
          person.style.setProperty("width", "100%", "important");
          person.style.setProperty("min-width", "0", "important");
          person.style.setProperty("flex", "1 1 auto", "important");
          var textCol = person.querySelector(".min-w-0");
          if (textCol) {
            textCol.style.setProperty("flex", "1 1 auto", "important");
            textCol.style.setProperty("min-width", "0", "important");
            textCol.style.setProperty("overflow-wrap", "anywhere", "important");
            textCol.style.setProperty("word-break", "break-word", "important");
          }
        }
      });

      // Ensure card top is visible
      var scroller = panel.querySelector(".overflow-auto, [class*='overflow-auto'], [class*='overflow-y']");
      if (scroller && scroller.scrollTop > 0 && !panel.getAttribute("data-poru-scrolled")) {
        scroller.scrollTop = 0;
        panel.setAttribute("data-poru-scrolled", "1");
      }
    });
  }

  function polishAll() {
    syncDrawer();
    syncBrandTitle();
    fixListCards();
    polishToolbar();
    polishFiltersSheet();
    polishDetailModal();
  }

  var fixTimer = null;
  var obs = new MutationObserver(function () {
    if (fixTimer) clearTimeout(fixTimer);
    fixTimer = setTimeout(polishAll, 40);
  });

  function boot() {
    ensureBackdrop();
    var root = document.getElementById("root") || document.body;
    obs.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style"] });
    polishAll();

    MQ.addEventListener("change", polishAll);
    window.addEventListener("resize", syncDrawer);

    document.addEventListener(
      "click",
      function (e) {
        var t = e.target;
        if (!(t instanceof Element)) return;
        if (t.closest(".poru-sidebar button")) setTimeout(closeDrawer, 30);
        setTimeout(polishAll, 60);
      },
      true
    );

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
    setTimeout(polishAll, 80);
    setTimeout(polishAll, 300);
  }
})();
