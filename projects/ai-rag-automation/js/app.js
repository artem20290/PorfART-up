import { runPlanAndExecute, runReact } from "./agent.js";
import { loadLlmConfig, saveLlmConfig } from "./llm.js";
import { getKnowledgeStore } from "./rag.js";
import { TASKS } from "./data/tasks.js";
import { PROMPT_VERSION } from "./prompts.js";

const $ = (s) => document.querySelector(s);

function mdLite(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/\n/g, "<br>");
}

function renderTasks() {
  const box = $("#task-list");
  box.innerHTML = TASKS.map(
    (t) =>
      `<div class="row ${t.status === "Просрочено" ? "is-late" : ""}">
        <div><b>${t.id}</b> · ${t.status} · ${t.priority}</div>
        <div>${t.title}</div>
        <div class="muted">${t.assignee} · ${t.enterprise} · срок ${t.due}${
          t.daysOverdue ? ` · −${t.daysOverdue}д` : ""
        }</div>
      </div>`,
  ).join("");
}

function pushTrace(html, cls = "") {
  const el = document.createElement("div");
  el.className = `trace-item ${cls}`;
  el.innerHTML = html;
  $("#trace").appendChild(el);
  el.scrollIntoView({ block: "nearest" });
}

function syncStatusFromConfig() {
  const cfg = loadLlmConfig();
  const via = cfg.endpoint ? `API · ${cfg.model || "model"}` : "local-fallback";
  const arch = cfg.mode === "react" ? "ReAct" : "Plan-and-Execute";
  const rag = cfg.ragEnabled === false ? "RAG off" : "RAG on";
  $("#agent-status").textContent = `Онлайн · ${via} · ${arch} · ${rag}`;
  $("#run-hint").textContent = `${arch} · ${rag} · prompts ${PROMPT_VERSION}`;
}

function fillSettingsForm() {
  const cfg = loadLlmConfig();
  $("#mode").value = cfg.mode === "react" ? "react" : "plan-execute";
  $("#ragEnabled").checked = cfg.ragEnabled !== false;
  $("#endpoint").value = cfg.endpoint || "";
  $("#apiKey").value = cfg.apiKey || "";
  $("#model").value = cfg.model || "gpt-4o-mini";
  $("#temperature").value = cfg.temperature ?? 0.2;
}

function openSettings(open) {
  const panel = $("#agent-settings");
  const btn = $("#btn-settings");
  const body = $("#agent-body");
  if (open) {
    fillSettingsForm();
    panel.hidden = false;
    body.classList.add("is-dimmed");
    btn.setAttribute("aria-expanded", "true");
    btn.classList.add("is-active");
  } else {
    panel.hidden = true;
    body.classList.remove("is-dimmed");
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("is-active");
  }
}

function bindSettings() {
  fillSettingsForm();
  syncStatusFromConfig();

  $("#btn-settings").addEventListener("click", () => {
    openSettings($("#agent-settings").hidden);
  });
  $("#btn-settings-close").addEventListener("click", () => openSettings(false));

  $("#save-cfg").addEventListener("click", () => {
    saveLlmConfig({
      mode: $("#mode").value,
      ragEnabled: $("#ragEnabled").checked,
      endpoint: $("#endpoint").value.trim(),
      apiKey: $("#apiKey").value.trim(),
      model: $("#model").value.trim() || "gpt-4o-mini",
      temperature: Number($("#temperature").value) || 0.2,
    });
    syncStatusFromConfig();
    openSettings(false);
    pushTrace("Настройки агента сохранены.", "ok");
  });

  $("#reset-cfg").addEventListener("click", () => {
    localStorage.removeItem("rag-poc-llm-config");
    fillSettingsForm();
    syncStatusFromConfig();
    $("#settings-hint").textContent = "Сброшено к defaults (local-fallback, Plan-and-Execute, RAG on).";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#agent-settings").hidden) openSettings(false);
  });
}

async function runCase() {
  const cfg = loadLlmConfig();
  const mode = cfg.mode === "react" ? "react" : "plan-execute";
  const task =
    $("#task-input").value.trim() ||
    "Найди просроченные поручения и сформируй отчёт для дирекции";

  openSettings(false);
  $("#trace").innerHTML = "";
  $("#answer").innerHTML = "<p class='muted'>Выполняю пайплайн…</p>";
  $("#run").disabled = true;

  const onEvent = (ev) => {
    if (ev.type === "phase") pushTrace(`<b>${ev.label}</b>`, "phase");
    if (ev.type === "plan") {
      pushTrace(
        `План (${ev.plan.steps.length} шагов, prompts ${ev.plan.promptVersion}):<br>` +
          ev.plan.steps.map((s) => `${s.id}. <code>${s.tool}</code> — ${s.why}`).join("<br>"),
      );
    }
    if (ev.type === "react") {
      pushTrace(
        `<span class="tag">Thought</span> ${ev.thought}<br><span class="tag">Action</span> <code>${ev.action}</code>`,
      );
    }
    if (ev.type === "observation") {
      pushTrace(`<span class="tag">Observation</span> ${ev.observation}`, "obs");
    }
    if (ev.type === "step_start") pushTrace(`→ <code>${ev.step.tool}</code>…`);
    if (ev.type === "step_done") {
      pushTrace(`✓ <code>${ev.step.tool}</code>: ${ev.observe?.observe || "ok"}`, "ok");
      if (ev.ragChunks) {
        pushTrace(
          "RAG hits:<br>" +
            ev.ragChunks
              .map(
                (c) =>
                  `• <i>${c.metadata?.source}</i> (${(c.score || 0).toFixed(2)}) — ${c.pageContent.slice(0, 90)}…`,
              )
              .join("<br>"),
          "rag",
        );
      }
    }
    if (ev.type === "final") {
      $("#answer").innerHTML = mdLite(ev.answer);
      const m = ev.meta || {};
      $("#meta").textContent = [
        `scenario: ${m.scenario || "—"}`,
        `architecture: ${m.architecture}`,
        `provider: ${m.provider}`,
        `model: ${m.model}`,
        `temperature: ${m.temperature}`,
        `prompts: ${m.promptVersion}`,
        `RAG: ${(m.ragSources || []).length ? m.ragSources.join(" · ") : "off / empty"}`,
      ].join(" · ");
      syncStatusFromConfig();
    }
  };

  try {
    if (mode === "react") await runReact(task, onEvent);
    else await runPlanAndExecute(task, onEvent);
  } catch (e) {
    $("#answer").innerHTML = `<p class="err">${e.message || e}</p>`;
  } finally {
    $("#run").disabled = false;
  }
}

async function boot() {
  renderTasks();
  bindSettings();
  const idx = await getKnowledgeStore();
  $("#index-meta").textContent = `RAG index: ${idx.docCount} docs → ${idx.chunkCount} chunks · MemoryVectorStore · prompts ${PROMPT_VERSION}`;
  $("#run").addEventListener("click", runCase);
  document.querySelectorAll("[data-chip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("#task-input").value = btn.getAttribute("data-chip");
      runCase();
    });
  });
}

boot();
