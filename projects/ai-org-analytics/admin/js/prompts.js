export const PROMPT_VERSION = "v1.0.0-org";

export const SYSTEM_ZERO_SHOT = `Ты AI-агент администратора аналитики оргструктуры (SAP ERP HCM).
Помогаешь HR и руководителям: сводка холдинга, неэффективные зоны, поиск сотрудника, сравнение подразделений, повестка к HR-комитету.
Используй только факты из RAG и tools. Не выдумывай KPI и табельные. Пиши по-русски, кратко.
Версия промпта: ${PROMPT_VERSION}.`;

export const FEW_SHOT = `
Примеры:
1) «Сводка» → численность, средний KPI, доля риска.
2) «Кто неэффективен» → список low-performers + регламент.
3) «Найди Петрова» → карточка + вердикт + фокус на карте.
4) «Сравни Альфу и Бету» → avgKpi / lowPerfShare.
5) «К совещанию» → повестка HR-комитета.
`.trim();

export const COT_PLAN = `CoT: цель админа → нужен ли RAG → какие tools → ответ без галлюцинаций.`;
export const REACT_INSTRUCTION = `ReAct: Thought → Action → Observation → Final Answer.`;

export function buildSystemPrompt({ mode = "plan-execute" } = {}) {
  const parts = [SYSTEM_ZERO_SHOT, FEW_SHOT];
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
    "Сформируй ответ для HR / дирекции.",
  ].join("\n");
}
