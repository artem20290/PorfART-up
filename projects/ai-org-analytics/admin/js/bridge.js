/**
 * Мост для React-карты: window.OrgAdminAgent
 */
import { runAgent, runPlanAndExecute, runReact } from "./agent.js";
import { loadLlmConfig, saveLlmConfig, resetLlmConfig } from "./llm.js";
import { getKnowledgeStore } from "./rag.js";
import { PROMPT_VERSION } from "./prompts.js";
import { ORG_FACTS } from "./data/org-facts.js";
import { setLiveOrg, getLiveOrg, hasLiveOrg, buildSapRegistry } from "./sap-om.js";

function statusLabel() {
  const cfg = loadLlmConfig();
  const via = cfg.endpoint ? `API · ${cfg.model || "model"}` : "local-fallback";
  const arch = cfg.mode === "react" ? "ReAct" : "Plan-and-Execute";
  const rag = cfg.ragEnabled === false ? "RAG off" : "RAG on";
  const src = hasLiveOrg() ? "live OM/PA" : "fallback";
  return `Онлайн · ${via} · ${arch} · ${rag} · ${src}`;
}

window.OrgAdminAgent = {
  run: runAgent,
  runPlanAndExecute,
  runReact,
  loadLlmConfig,
  saveLlmConfig,
  resetLlmConfig,
  getKnowledgeStore,
  statusLabel,
  PROMPT_VERSION,
  ORG_FACTS,
  setLiveOrg,
  getLiveOrg,
  hasLiveOrg,
  buildSapRegistry: () => buildSapRegistry(ORG_FACTS),
  ready: true,
};

window.dispatchEvent(new CustomEvent("org-admin-agent-ready"));
