/* AI-ассистент доски поручений — локальный, как Org AI (без LLM). */
(function () {
  var STATUSES = ["В работе", "Просрочено", "Завершено", "Отменено"];
  var QUICK = [
    "Что просрочено?",
    "Найди Петрова",
    "Высокий приоритет",
    "Сводка по доске",
  ];
  var THINK = [
    "Сверяю реестр поручений…",
    "Смотрю сроки и статусы…",
    "Ищу совпадения по ФИО…",
    "Собираю сводку по холдингу…",
  ];

  var state = {
    messages: [],
    loading: false,
    minimized: false,
    voiceListening: false,
    pos: { x: 0, y: 0 },
    thinkIdx: 0,
  };

  var recognition = null;
  var MIC_SVG =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
  var MIC_OFF_SVG =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';

  function ensureRecognition() {
    if (recognition) return recognition;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    recognition = new SR();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = function (event) {
      var text = (event.results[0] && event.results[0][0] && event.results[0][0].transcript) || "";
      state.voiceListening = false;
      syncVoiceUi();
      if (text.trim()) send(text.trim());
    };
    recognition.onerror = function () {
      state.voiceListening = false;
      syncVoiceUi();
    };
    recognition.onend = function () {
      state.voiceListening = false;
      syncVoiceUi();
    };
    return recognition;
  }

  function syncVoiceUi() {
    var panel = $("#poru-ai-panel");
    if (!panel) return;
    var mic = panel.querySelector("[data-mic]");
    var input = panel.querySelector("[data-input]");
    if (mic) {
      mic.classList.toggle("is-listening", state.voiceListening);
      mic.innerHTML = state.voiceListening ? MIC_OFF_SVG : MIC_SVG;
      mic.title = state.voiceListening ? "Остановить" : "Голосовой ввод";
      mic.setAttribute("aria-pressed", state.voiceListening ? "true" : "false");
    }
    if (input) {
      input.placeholder = state.voiceListening
        ? "Говорите…"
        : "Например: что просрочено? найди Петрова…";
      input.disabled = state.loading || state.voiceListening;
    }
  }

  function toggleVoice() {
    var rec = ensureRecognition();
    if (!rec) {
      alert("Голосовой ввод не поддерживается в этом браузере. Используйте Chrome.");
      return;
    }
    if (state.voiceListening) {
      try {
        rec.stop();
      } catch (e) {}
      state.voiceListening = false;
      syncVoiceUi();
      return;
    }
    if (state.loading) return;
    try {
      rec.start();
      state.voiceListening = true;
      syncVoiceUi();
    } catch (e) {
      state.voiceListening = false;
      syncVoiceUi();
    }
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function parseCard(el) {
    var text = (el.textContent || "").replace(/\s+/g, " ").trim();
    var idMatch = text.match(/ПП-2026-\d+/);
    if (!idMatch) return null;
    var id = idMatch[0];
    var status = STATUSES.find(function (s) {
      return text.indexOf(s) !== -1;
    }) || "В работе";
    var titleEl = el.querySelector(".text-\\[13px\\], [class*='text-[13px]']");
    var descEl = el.querySelector(".text-\\[14px\\], [class*='text-[14px]']");
    var title = titleEl ? titleEl.textContent.trim() : "";
    var desc = descEl ? descEl.textContent.trim() : "";
    if (!title) {
      var after = text.slice(text.indexOf(id) + id.length);
      STATUSES.forEach(function (s) {
        after = after.replace(s, " ");
      });
      title = after.trim().slice(0, 80);
    }
    var tags = $all("span", el)
      .map(function (s) {
        return (s.textContent || "").trim();
      })
      .filter(function (t) {
        return t.length > 1 && t.length < 28 && STATUSES.indexOf(t) === -1 && t !== id && !/^\d/.test(t) && !/завершили|исполнител/i.test(t);
      });
    var uniq = [];
    tags.forEach(function (t) {
      if (uniq.indexOf(t) === -1 && uniq.length < 6) uniq.push(t);
    });
    var dateMatch = text.match(/\d{2}\.\d{2}\.\d{4}/);
    var progressMatch = text.match(/(\d+)\s*\/\s*(\d+)\s*·\s*(\d+)\s*%/);
    return {
      id: id,
      status: status,
      title: title,
      desc: desc,
      tags: uniq,
      date: dateMatch ? dateMatch[0] : "",
      progress: progressMatch
        ? { done: +progressMatch[1], total: +progressMatch[2], pct: +progressMatch[3] }
        : null,
      el: el,
      hay: (id + " " + title + " " + desc + " " + uniq.join(" ") + " " + status).toLowerCase(),
    };
  }

  function collectTasks() {
    var cards = $all('[role="button"].cursor-pointer, .cursor-pointer[role="button"]').filter(function (el) {
      return /ПП-2026-\d+/.test(el.textContent || "");
    });
    var seen = {};
    var out = [];
    cards.forEach(function (el) {
      var t = parseCard(el);
      if (!t || seen[t.id]) return;
      seen[t.id] = true;
      out.push(t);
    });
    return out;
  }

  function clickStatusTab(label) {
    var btn = $all("button").find(function (b) {
      var t = (b.textContent || "").replace(/\s+/g, " ").trim();
      return t === label || t.indexOf(label) === 0;
    });
    if (btn) btn.click();
    return !!btn;
  }

  function clickQuickFilter(label) {
    var btn = $all("button").find(function (b) {
      var t = (b.textContent || "").replace(/\s+/g, " ").trim();
      return t.indexOf(label) === 0;
    });
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  }

  function boardSearchInput() {
    return (
      $('header input[type="search"]') ||
      $('input[type="search"]') ||
      $('input[placeholder*="Поиск"]')
    );
  }

  /** Пишет в шапочный поиск React-приложения — доска фильтруется сама. */
  function setBoardSearch(value) {
    var input = boardSearchInput();
    if (!input) return false;
    var next = String(value || "");
    var desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
    if (desc && desc.set) desc.set.call(input, next);
    else input.value = next;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    try {
      input.dispatchEvent(new InputEvent("input", { bubbles: true, data: next, inputType: "insertText" }));
    } catch (e) {}
    return true;
  }

  function extractSearchTerm(prompt) {
    var raw = String(prompt || "").replace(/ё/g, "е").trim();
    var cleaned = raw
      .replace(/^(найди|найти|покажи|открой|поиск|найти\s+по)\s+/i, "")
      .replace(/\s+(пожалуйста|плиз|pls)$/i, "")
      .replace(/[?!.,]+$/g, "")
      .trim();
    // «Найди Петрова» / «Петров» / «поручения Петрова»
    var person = cleaned.match(/\b([А-Яа-яA-Za-z]{3,})(?:а|у|ой|ым|ом|е)?\b/);
    function titleCase(s) {
      s = String(s || "");
      return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
    }
    if (/петров|сидоров|иванов|козлов|смирнов/i.test(cleaned)) {
      // Оставляем форму из запроса («Петрова») — так точнее фильтрует поиск доски
      var known = cleaned.match(/(петров|сидоров|иванов|козлов|смирнов)[а-яa-z]*/i);
      if (known) return titleCase(known[0]);
    }
    if (cleaned.length >= 2 && cleaned.length < 40) return titleCase(cleaned);
    return person ? titleCase(person[1]) : cleaned;
  }

  function flashTasks(tasks) {
    (tasks || []).slice(0, 8).forEach(function (task, i) {
      if (!task || !task.el) return;
      setTimeout(function () {
        if (i === 0) task.el.scrollIntoView({ behavior: "smooth", block: "center" });
        task.el.classList.add("poru-ai-flash");
        setTimeout(function () {
          task.el.classList.remove("poru-ai-flash");
        }, 2000);
      }, i * 60);
    });
  }

  function openTask(task) {
    if (!task || !task.el) return false;
    task.el.scrollIntoView({ behavior: "smooth", block: "center" });
    task.el.classList.add("poru-ai-flash");
    setTimeout(function () {
      task.el.classList.remove("poru-ai-flash");
    }, 1800);
    setTimeout(function () {
      task.el.click();
    }, 220);
    return true;
  }

  function fmtTask(t) {
    var prog = t.progress ? " · " + t.progress.pct + "%" : "";
    return "**" + t.id + "** · " + t.status + prog + "\n" + t.title + (t.date ? "\nСрок: " + t.date : "");
  }

  function searchTasks(tasks, q) {
    var tokens = String(q || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .split(/[^a-zа-я0-9-]+/i)
      .filter(function (t) {
        return t.length >= 3;
      });
    if (!tokens.length) return [];
    return tasks
      .map(function (t) {
        var score = 0;
        tokens.forEach(function (tok) {
          if (t.hay.indexOf(tok) !== -1) score += tok.length;
          if (t.id.toLowerCase().indexOf(tok) !== -1) score += 20;
        });
        return { t: t, score: score };
      })
      .filter(function (x) {
        return x.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .map(function (x) {
        return x.t;
      });
  }

  function generateReply(prompt, tasks) {
    var q = String(prompt || "").toLowerCase().replace(/ё/g, "е");
    var overdue = tasks.filter(function (t) {
      return t.status === "Просрочено";
    });
    var active = tasks.filter(function (t) {
      return t.status === "В работе";
    });
    var done = tasks.filter(function (t) {
      return t.status === "Завершено";
    });
    var cancelled = tasks.filter(function (t) {
      return t.status === "Отменено";
    });
    var high = tasks.filter(function (t) {
      return /высокий|приоритет|критич/i.test(t.hay) || (t.progress && t.progress.pct < 30 && t.status === "В работе");
    });

    if (/сводк|обзор|сколько|статистик|доске/.test(q)) {
      return (
        "**Сводка по доске поручений**\n\n" +
        "— Всего в выборке: **" + tasks.length + "**\n" +
        "— В работе: **" + active.length + "**\n" +
        "— Просрочено: **" + overdue.length + "**\n" +
        "— Завершено: **" + done.length + "**\n" +
        "— Отменено: **" + cancelled.length + "**\n\n" +
        (overdue[0] ? "Критично: **" + overdue[0].id + "** — " + overdue[0].title + "\n\n" : "") +
        "*Источник: реестр поручений Холдинга*"
      );
    }

    if (/просроч|дедлайн|срыв|опозда/.test(q)) {
      clickStatusTab("Просрочено");
      if (!overdue.length) {
        return "Сейчас **нет просроченных** в видимой выборке. Переключил фильтр «Просрочено».";
      }
      return (
        "**Просроченные поручения (" + overdue.length + ")**\n\n" +
        overdue
          .slice(0, 6)
          .map(function (t, i) {
            return i + 1 + ". **" + t.id + "** — " + t.title + (t.date ? " · было " + t.date : "");
          })
          .join("\n") +
        "\n\nОткрыл фильтр **Просрочено**. Скажите «открой " +
        overdue[0].id +
        "», чтобы раскрыть карточку.\n\n*Реестр поручений*"
      );
    }

    if (/высокий приоритет|приоритет|критич/.test(q)) {
      clickQuickFilter("Высокий приоритет");
      var list = high.length ? high : active.slice(0, 5);
      return (
        "**Высокий приоритет / внимание**\n\n" +
        list
          .slice(0, 6)
          .map(function (t, i) {
            return i + 1 + ". **" + t.id + "** — " + t.title + " · " + t.status;
          })
          .join("\n") +
        "\n\n*Применил быстрый фильтр на доске*"
      );
    }

    if (/мои задач|мне назнач|мои поручен/.test(q)) {
      clickQuickFilter("Мои задачи");
      return (
        "Открыл фильтр **Мои задачи** на доске.\n\n" +
        "В работе сейчас видно **" + active.length + "** активных поручений. Уточните номер (ПП-2026-…) или фамилию исполнителя."
      );
    }

    if (/рекоменд|что делать|план|фокус/.test(q)) {
      return (
        "**Рекомендации по контролю поручений**\n\n" +
        "1. Закрыть просрочку: **" + (overdue[0] ? overdue[0].id + " — " + overdue[0].title : "нет") + "**\n" +
        "2. Проверить низкий прогресс в работе (" + active.filter(function (t) { return t.progress && t.progress.pct < 40; }).length + " шт.)\n" +
        "3. Зафиксировать статус по предприятиям с просрочкой\n\n" +
        "*Демо-агент по данным доски*"
      );
    }

    // Open by id / «открой …»
    var rawId = (prompt.match(/ПП-2026-\d+/i) || [])[0];
    if (rawId || /открой|открыть|покажи карточ|карточку/.test(q)) {
      var task = rawId
        ? tasks.find(function (t) {
            return t.id.toLowerCase() === rawId.toLowerCase();
          })
        : searchTasks(tasks, prompt)[0];
      if (task) {
        openTask(task);
        return "Открыл поручение на доске:\n\n" + fmtTask(task) + "\n\n*Карточка раскрыта*";
      }
    }

    // Person / keyword search → пишем в фильтр поиска на доске
    if (
      /найд|покаж|поиск|петров|сидоров|иванов|завод|бета|альфа|гамма|esg|цифров|энерго/.test(q) ||
      q.split(/\s+/).length <= 4
    ) {
      var term = extractSearchTerm(prompt);
      var found = searchTasks(tasks, term || prompt);
      if (!found.length && term !== prompt) found = searchTasks(tasks, prompt);
      if (found.length) {
        clickStatusTab("Все");
        // Берём форму ФИО с карточки — «Петрова» фильтрует точнее, чем «Петров»
        var filterTerm = term || prompt;
        var fromCard = (found[0].title + " " + found[0].hay).match(
          /(петров|сидоров|иванов|козлов|смирнов)[а-яa-z]*/i
        );
        if (fromCard) filterTerm = fromCard[0].charAt(0).toUpperCase() + fromCard[0].slice(1);
        setBoardSearch(filterTerm);
        flashTasks(found);
        return (
          "**Фильтр:** поиск «**" +
          filterTerm +
          "**» · найдено **" +
          found.length +
          "**\n\n" +
          found
            .slice(0, 6)
            .map(function (t, i) {
              return i + 1 + ". **" + t.id + "** — " + t.title + " · " + t.status;
            })
            .join("\n") +
          "\n\nНа доске оставлены карточки по этому запросу. Скажите «открой " +
          found[0].id +
          "», чтобы раскрыть.\n\n*Поиск в шапке*"
        );
      }
      if (term) {
        clickStatusTab("Все");
        setBoardSearch(term);
        return (
          "В поиске выставил «**" +
          term +
          "**», но в текущей выборке совпадений нет. Сбросьте предприятие слева или уточните ФИО.\n\n*Поиск в шапке*"
        );
      }
    }

    if (/в работе|активн/.test(q)) {
      clickStatusTab("В работе");
      return (
        "**В работе: " + active.length + "**\n\n" +
        active
          .slice(0, 5)
          .map(function (t, i) {
            return i + 1 + ". **" + t.id + "** — " + t.title;
          })
          .join("\n") +
        "\n\n*Фильтр «В работе»*"
      );
    }

    return (
      "**Ассистент доски поручений**\n\n" +
      "Запрос: «" + prompt + "»\n\n" +
      "Сейчас на доске **" + tasks.length + "** поручений, просрочено **" + overdue.length + "**.\n\n" +
      "Могу: найти по ФИО/номеру, показать просрочку, высокий приоритет, сводку или открыть карточку.\n\n" +
      "*Локальный агент · без LLM*"
    );
  }

  function formatHtml(text, tasks) {
    var parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);
    return parts
      .map(function (part) {
        var m = part.match(/^\*\*([^*]+)\*\*$/);
        if (!m) {
          return part
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\n/g, "<br>");
        }
        var label = m[1];
        var task = tasks.find(function (t) {
          return t.id === label || t.title === label;
        });
        if (task) {
          return (
            '<button type="button" class="poru-ai-link" data-task-id="' +
            task.id +
            '">' +
            label.replace(/</g, "&lt;") +
            "</button>"
          );
        }
        return "<strong>" + label.replace(/</g, "&lt;") + "</strong>";
      })
      .join("");
  }

  function ensurePanel() {
    var existing = $("#poru-ai-panel");
    if (existing) return existing;

    var panel = document.createElement("div");
    panel.id = "poru-ai-panel";
    panel.className = "poru-ai-panel";
    panel.innerHTML =
      '<div class="poru-ai-head" data-drag>' +
      '  <div class="poru-ai-badge" data-min title="Свернуть">AI</div>' +
      '  <div class="poru-ai-titles" data-min>' +
      "    <strong>AI-ассистент</strong>" +
      '    <span data-status>Онлайн · Доска поручений</span>' +
      "  </div>" +
      '  <button type="button" class="poru-ai-icon-btn" data-clear title="Сбросить">↺</button>' +
      '  <button type="button" class="poru-ai-icon-btn" data-min title="Свернуть">▾</button>' +
      "</div>" +
      '<div class="poru-ai-body" data-chat></div>' +
      '<div class="poru-ai-chips" data-chips></div>' +
      '<div class="poru-ai-composer">' +
      '  <button type="button" class="poru-ai-mic" data-mic title="Голосовой ввод" aria-label="Голосовой ввод" aria-pressed="false">' +
      MIC_SVG +
      "</button>" +
      '  <input type="text" data-input placeholder="Например: что просрочено? найди Петрова…" />' +
      '  <button type="button" class="poru-ai-send" data-send>→</button>' +
      "</div>";
    document.body.appendChild(panel);

    // chips
    var chips = panel.querySelector("[data-chips]");
    QUICK.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "poru-ai-chip";
      b.textContent = q;
      b.addEventListener("click", function () {
        if (state.loading) return;
        send(q);
      });
      chips.appendChild(b);
    });

    // drag
    var dragging = false;
    var start = { x: 0, y: 0 };
    var head = panel.querySelector("[data-drag]");
    head.addEventListener("mousedown", function (e) {
      if (e.target.closest("button")) return;
      dragging = true;
      start.x = e.clientX - state.pos.x;
      start.y = e.clientY - state.pos.y;
      e.preventDefault();
    });
    document.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      state.pos.x = e.clientX - start.x;
      state.pos.y = e.clientY - start.y;
      panel.style.transform = "translate(" + state.pos.x + "px," + state.pos.y + "px)";
    });
    document.addEventListener("mouseup", function () {
      dragging = false;
    });

    panel.querySelectorAll("[data-min]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (e.target.closest("[data-clear]")) return;
        state.minimized = !state.minimized;
        panel.classList.toggle("is-min", state.minimized);
        var minBtn = panel.querySelectorAll("[data-min].poru-ai-icon-btn");
        if (minBtn[0]) minBtn[0].textContent = state.minimized ? "▴" : "▾";
      });
    });

    panel.querySelector("[data-clear]").addEventListener("click", function () {
      state.messages = [
        {
          role: "assistant",
          text:
            "**Готов помочь.** Найду поручение, покажу просрочку или сверю сводку по доске.\n\nНапример: «Что просрочено?» или «Найди Петрова».",
        },
      ];
      renderChat();
    });

    var input = panel.querySelector("[data-input]");
    var sendBtn = panel.querySelector("[data-send]");
    var micBtn = panel.querySelector("[data-mic]");
    function trySend() {
      var v = (input.value || "").trim();
      if (!v || state.loading || state.voiceListening) return;
      input.value = "";
      send(v);
    }
    sendBtn.addEventListener("click", trySend);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        trySend();
      }
    });
    micBtn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleVoice();
    });

    panel.addEventListener("click", function (e) {
      var link = e.target.closest("[data-task-id]");
      if (!link) return;
      var tasks = collectTasks();
      var task = tasks.find(function (t) {
        return t.id === link.getAttribute("data-task-id");
      });
      if (task) openTask(task);
    });

    return panel;
  }

  function renderChat() {
    var panel = ensurePanel();
    var chat = panel.querySelector("[data-chat]");
    var tasks = collectTasks();
    chat.innerHTML = "";
    state.messages.forEach(function (msg) {
      var row = document.createElement("div");
      row.className = "poru-ai-msg is-" + msg.role;
      if (msg.role === "assistant") {
        row.innerHTML =
          '<div class="poru-ai-avatar">AI</div><div class="poru-ai-bubble">' +
          formatHtml(msg.text, tasks) +
          "</div>";
      } else {
        row.innerHTML =
          '<div class="poru-ai-bubble">' +
          formatHtml(msg.text, []) +
          '</div><div class="poru-ai-avatar">Я</div>';
      }
      chat.appendChild(row);
    });
    if (state.loading) {
      var think = document.createElement("div");
      think.className = "poru-ai-thinking";
      think.innerHTML =
        '<span class="poru-ai-spinner"></span><span>' + THINK[state.thinkIdx % THINK.length] + "</span>";
      chat.appendChild(think);
    }
    chat.scrollTop = chat.scrollHeight;
    var status = panel.querySelector("[data-status]");
    if (status) status.textContent = state.loading ? "Думаю…" : "Онлайн · Доска поручений";
    $all(".poru-ai-chip", panel).forEach(function (c) {
      c.disabled = state.loading || state.voiceListening;
    });
    panel.querySelector("[data-send]").disabled = state.loading || state.voiceListening;
    var mic = panel.querySelector("[data-mic]");
    if (mic) mic.disabled = state.loading;
    syncVoiceUi();
  }

  function send(text) {
    state.messages.push({ role: "user", text: text });
    state.loading = true;
    state.thinkIdx = 0;
    renderChat();
    var tick = setInterval(function () {
      state.thinkIdx += 1;
      renderChat();
    }, 900);

    setTimeout(function () {
      clearInterval(tick);
      var tasks = collectTasks();
      var reply = generateReply(text, tasks);
      state.messages.push({ role: "assistant", text: reply });
      state.loading = false;
      renderChat();
    }, 480 + Math.random() * 720);
  }

  function boot() {
    ensurePanel();
    state.messages = [
      {
        role: "assistant",
        text:
          "**Привет!** Я AI-ассистент доски поручений Холдинга.\n\nМогу **найти поручение** (Петров, номер ПП-…), показать **просрочку**, высокий приоритет и открыть карточку на доске.\n\nПопробуйте быстрые запросы ниже — или напишите свой.",
      },
    ];
    renderChat();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 500);
    });
  } else {
    setTimeout(boot, 500);
  }
})();
