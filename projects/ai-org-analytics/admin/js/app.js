import { runPlanAndExecute, runReact } from "./agent.js";
import { loadLlmConfig, saveLlmConfig, resetLlmConfig } from "./llm.js";
import { getKnowledgeStore } from "./rag.js";
import { ORG_FACTS } from "./data/org-facts.js";
import { PROMPT_VERSION } from "./prompts.js";
import { buildSapRegistry, hasLiveOrg } from "./sap-om.js";

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

function renderFacts() {
  const box = $("#fact-list");
  const live = hasLiveOrg();
  const reg = buildSapRegistry(ORG_FACTS);
  const units = reg.units;
  const persons = reg.persons.slice(0, 40);
  const banner = live
    ? `<p class="muted" style="margin:0 0 10px">Источник: <b>live OM/PA</b> с оргкарты · O=${reg?.om?.otypeO} · P=${reg?.om?.otypeP}</p>`
    : `<p class="muted" style="margin:0 0 10px">Источник: <b>fallback registry</b> (откройте оргкарту, чтобы подтянуть live)</p>`;
  const rows = [
    banner,
    ...units.map(
      (u) =>
        `<div class="row">
          <div><b>${u.name}</b> · KOSTL ${u.costCenter || "—"}</div>
          <div class="muted">O ${u.id}` +
        (u.headcount != null ? ` · ${u.headcount} чел.` : "") +
        (u.avgKpi != null ? ` · avg KPI ${u.avgKpi}` : "") +
        `</div>
        </div>`,
    ),
    ...persons.map((e) => {
      const kpi = e.kpi;
      const name = e.fullName;
      const pos = e.plansText || e.position;
      const unit = e.orgehText || e.unit;
      const pernr = e.pernr || e.personnelNumber || e.id;
      const cc = e.costCenter || "—";
      return `<div class="row ${kpi != null && kpi < 45 ? "is-late" : ""}">
          <div><b>${name}</b> · PERNR ${pernr} · KPI ${kpi ?? "—"}</div>
          <div>${pos || "—"}</div>
          <div class="muted">${unit || "—"} · KOSTL ${cc} · mgr ${e.managerId || "—"}</div>
        </div>`;
    }),
  ];
  box.innerHTML = rows.join("");
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
    resetLlmConfig();
    fillSettingsForm();
    syncStatusFromConfig();
    $("#settings-hint").textContent =
      "Сброшено к defaults (local-fallback, Plan-and-Execute, RAG on).";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#agent-settings").hidden) openSettings(false);
  });
}

async function runCase() {
  const cfg = loadLlmConfig();
  const mode = cfg.mode === "react" ? "react" : "plan-execute";
  const task =
    $("#task-input").value.trim() || "Сводка по оргструктуре и зонам риска";

  openSettings(false);
  $("#trace").innerHTML = "";
  $("#answer").innerHTML = "";
  $("#meta").textContent = "";
  $("#run").disabled = true;

  const runner = mode === "react" ? runReact : runPlanAndExecute;

  try {
    await runner(task, (ev) => {
      if (ev.type === "phase") pushTrace(ev.label, "phase");
      if (ev.type === "plan") {
        pushTrace(
          `План: ${ev.plan.steps.map((s) => s.tool).join(" → ")}`,
          "phase",
        );
      }
      if (ev.type === "react") {
        pushTrace(`Thought: ${ev.thought}<br>Action: <code>${ev.action}</code>`, "phase");
      }
      if (ev.type === "observation") pushTrace(`Observation: ${ev.observation}`, "obs");
      if (ev.type === "step_done") {
        const o = ev.observe?.observe || ev.observe?.observation || "";
        const cls = ev.step?.tool === "rag_retrieve" ? "rag" : "ok";
        pushTrace(`✓ ${ev.step?.tool}: ${o}`, cls);
      }
      if (ev.type === "final") {
        $("#answer").innerHTML = mdLite(ev.answer);
        const m = ev.meta || {};
        $("#meta").textContent = [
          m.architecture,
          m.scenario && `сценарий ${m.scenario}`,
          m.provider,
          m.model,
          m.ragSources?.length ? `RAG: ${m.ragSources.join(", ")}` : null,
          m.promptVersion,
        ]
          .filter(Boolean)
          .join(" · ");
      }
    });
  } catch (err) {
    pushTrace(`Ошибка: ${err.message || err}`, "err");
  } finally {
    $("#run").disabled = false;
  }
}

async function boot() {
  renderFacts();
  bindSettings();
  try {
    const kb = await getKnowledgeStore();
    $("#index-meta").textContent = `RAG индекс: ${kb.docCount} док. · ${kb.chunkCount} чанков · prompts ${PROMPT_VERSION}`;
  } catch (e) {
    $("#index-meta").textContent = "RAG индекс: ошибка загрузки";
  }

  document.querySelectorAll("[data-chip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("#task-input").value = btn.getAttribute("data-chip");
    });
  });
  $("#run").addEventListener("click", runCase);
}

boot();
