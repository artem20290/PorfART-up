/**
 * Промпт-инжиниринг (версионируется в /prompts + git).
 */

export const PROMPT_VERSION = "v1.2.0";

export const SYSTEM_ZERO_SHOT = `Ты AI-агент кабинета администратора доски поручений холдинга.
Помогаешь администратору: сводка доски, просрочки, высокий приоритет, срез по исполнителю/предприятию, повестка к совещанию.
Используй только факты из RAG и tools. Не выдумывай ID. Пиши по-русски, кратко.
Версия промпта: ${PROMPT_VERSION}.`;

export const FEW_SHOT_REPORT = `
Примеры:
1) «Сводка по доске» → KPI статусов, доля просрочек vs SLA, топ-риск.
2) «Отчёт по просрочкам» → список ID + эскалация.
3) «Найди Петрова» → его поручения и статус нагрузки.
4) «Повестка к совещанию» → 4–5 пунктов для дирекции.
`.trim();

export const COT_PLAN = `CoT: цель админа → нужен ли RAG → какие tools → ответ без галлюцинаций.`;

export const REACT_INSTRUCTION = `ReAct: Thought → Action → Observation → Final Answer.`;

export function buildSystemPrompt({ mode = "plan-execute" } = {}) {
  const parts = [SYSTEM_ZERO_SHOT, FEW_SHOT_REPORT];
  if (mode === "react") parts.push(REACT_INSTRUCTION);
  if (mode === "plan-execute" || mode === "cot") parts.push(COT_PLAN);
  return parts.join("\n\n");
}

export function buildUserPrompt({ task, scenario, ragChunks, toolResults }) {
  const ragBlock = (ragChunks || [])
    .map(
      (c, i) =>
        `[${i + 1}] (${c.metadata?.source || c.id}, score=${(c.score || 0).toFixed(3)})\n${c.pageContent}`,
    )
    .join("\n\n");

  return [
    `Сценарий: ${scenario || "auto"}`,
    `Задача администратора: ${task}`,
    "",
    "### RAG context",
    ragBlock || "(пусто)",
    "",
    "### Tool results",
    toolResults || "(ещё нет)",
    "",
    "Сформируй ответ для администратора / дирекции.",
  ].join("\n");
}
