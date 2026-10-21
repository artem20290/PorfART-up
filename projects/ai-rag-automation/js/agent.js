import { retrieve, getKnowledgeStore } from "./rag.js";
import {
  executeTool,
  TOOL_SPECS,
  detectScenario,
  planStepsForScenario,
} from "./tools.js";
import { chatCompletions, loadLlmConfig } from "./llm.js";
import { buildSystemPrompt, buildUserPrompt, PROMPT_VERSION } from "./prompts.js";

/**
 * Кабинет администратора: полный набор сценариев доски,
 * не только отчёт по просрочкам.
 */

export async function runPlanAndExecute(userTask, onEvent) {
  const emit = (type, payload) => onEvent && onEvent({ type, ...payload, ts: Date.now() });
  const cfg = loadLlmConfig();
  const ragOn = cfg.ragEnabled !== false;
  const scenario = detectScenario(userTask);

  if (ragOn) await getKnowledgeStore();
  emit("phase", {
    name: "plan",
    label: `Plan-and-Execute · сценарий «${scenario.id}»`,
  });

  const plan = {
    architecture: "Plan-and-Execute",
    scenario: scenario.id,
    promptVersion: PROMPT_VERSION,
    steps: planStepsForScenario(scenario, ragOn),
  };
  emit("plan", { plan });

  let ragChunks = [];
  let toolWire = [];
  const observations = [];

  for (const step of plan.steps) {
    emit("step_start", { step });

    if (step.tool === "rag_retrieve") {
      const rag = await retrieve(userTask, 4);
      ragChunks = rag.hits;
      toolWire.push(rag.wire);
      observations.push({ tool: "rag_retrieve", observe: `${rag.hits.length} chunks` });
      emit("step_done", { step, observe: observations.at(-1), ragChunks });
      continue;
    }

    if (step.tool === "llm_synthesize") {
      const messages = [
        { role: "system", content: buildSystemPrompt({ mode: "plan-execute" }) },
        { role: "assistant", content: toolWire.join("\n") },
        {
          role: "user",
          content: buildUserPrompt({
            task: userTask,
            scenario: scenario.id,
            ragChunks,
            toolResults: observations.map((o) => `${o.tool}: ${o.observe}`).join("\n"),
          }),
        },
      ];
      const llm = await chatCompletions({ messages, temperature: 0.2 });
      observations.push({ tool: "llm_synthesize", observe: llm.provider });
      emit("step_done", { step, observe: observations.at(-1), llm });
      emit("final", {
        answer: llm.content,
        meta: {
          architecture: "Plan-and-Execute",
          scenario: scenario.id,
          promptVersion: PROMPT_VERSION,
          provider: llm.provider,
          model: llm.model,
          temperature: llm.temperature,
          tools: TOOL_SPECS.map((t) => t.name),
          ragSources: ragChunks.map((c) => c.metadata?.source),
        },
      });
      return;
    }

    const out = executeTool(step.tool, step.args || {}, {
      ragChunks,
      scenario: scenario.id,
      userTask,
    });
    if (out.wire) toolWire.push(out.wire);
    observations.push({ tool: step.tool, observe: out.observe, data: out.data });
    emit("step_done", { step, observe: observations.at(-1), toolResult: out });
  }
}

export async function runReact(userTask, onEvent) {
  const emit = (type, payload) => onEvent && onEvent({ type, ...payload, ts: Date.now() });
  const cfg = loadLlmConfig();
  const ragOn = cfg.ragEnabled !== false;
  const scenario = detectScenario(userTask);
  emit("phase", { name: "react", label: `ReAct · сценарий «${scenario.id}»` });

  const trajectory = [];
  let ragChunks = [];
  let toolWire = [];

  const steps = planStepsForScenario(scenario, ragOn).filter((s) => s.tool !== "llm_synthesize");

  for (const step of steps) {
    const thought =
      step.tool === "rag_retrieve"
        ? "Нужен контекст регламентов."
        : `Выполняю ${step.tool}: ${step.why}`;
    emit("react", { thought, action: step.tool, input: step.args || {} });

    if (step.tool === "rag_retrieve") {
      const rag = await retrieve(userTask, 4);
      ragChunks = rag.hits;
      toolWire.push(rag.wire);
      trajectory.push({ thought, action: step.tool, observation: `${rag.hits.length} docs` });
      emit("observation", { observation: trajectory.at(-1).observation, ragChunks });
      continue;
    }

    const out = executeTool(step.tool, step.args || {}, {
      ragChunks,
      scenario: scenario.id,
      userTask,
    });
    if (out.wire) toolWire.push(out.wire);
    trajectory.push({ thought, action: step.tool, observation: out.observe });
    emit("observation", { observation: out.observe, data: out.data });
  }

  const messages = [
    { role: "system", content: buildSystemPrompt({ mode: "react" }) },
    { role: "assistant", content: toolWire.join("\n") },
    {
      role: "user",
      content:
        `ReAct trajectory:\n` +
        trajectory.map((t, i) => `${i + 1}. Thought: ${t.thought}\nAction: ${t.action}\nObs: ${t.observation}`).join("\n") +
        `\n\n` +
        buildUserPrompt({
          task: userTask,
          scenario: scenario.id,
          ragChunks,
          toolResults: trajectory.map((t) => `${t.action}: ${t.observation}`).join("\n"),
        }),
    },
  ];
  const llm = await chatCompletions({ messages, temperature: 0.2 });
  emit("final", {
    answer: llm.content,
    meta: {
      architecture: "ReAct",
      scenario: scenario.id,
      promptVersion: PROMPT_VERSION,
      provider: llm.provider,
      model: llm.model,
      temperature: llm.temperature,
      trajectory,
      ragSources: ragChunks.map((c) => c.metadata?.source),
    },
  });
}
