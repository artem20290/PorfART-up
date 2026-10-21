/* SB Agent golden eval — briefs must resolve to SB templates + compliance OK */
(function (global) {
  const GOLDEN = [
    {
      id: "requests",
      brief: "Портал заявок",
      expectTemplate: "template-request",
      expectComponentsAny: ["AppShell", "Filter Bar", "Advanced DataTable"],
    },
    {
      id: "procurement",
      brief: "Дашборд KPI для закупок",
      expectTemplate: "template-dashboard",
      expectComponentsAny: ["AppShell", "Stats"],
    },
    {
      id: "catalog",
      brief: "Каталог продукции",
      expectTemplate: "template-catalog",
      expectComponentsAny: ["TreeView", "Virtual List", "AppShell"],
    },
    {
      id: "intent-tickets",
      brief: "Собери экран тикетов helpdesk со списком",
      expectTemplate: "template-request",
      expectComponentsAny: ["AppShell"],
    },
    {
      id: "intent-analytics",
      brief: "Нужна аналитика KPI и метрики",
      expectTemplate: "template-dashboard",
      expectComponentsAny: ["Stats"],
    },
    {
      id: "dark-theme",
      brief: "Тёмная тема",
      expectTheme: "dark",
      skipBuild: true,
    },
    {
      id: "policy-recall",
      brief: "Политика SB",
      expectKind: "policy",
      skipBuild: true,
    },
    {
      id: "reject-outside",
      brief: "Собери что-нибудь красивое в стиле Material",
      expectClarifyOrScenario: true,
      skipBuild: true,
    },
  ];

  function runCase(test) {
    const agent = global.SbAgent;
    if (!agent) return { id: test.id, ok: false, error: "SbAgent missing" };

    const project = test.skipBuild
      ? agent.loadProject()
      : agent.emptyProject();
    const session = agent.emptySession();
    const result = agent.runTurn(project, session, test.brief);
    const p = result.project;
    const plan = result.plan || {};
    const failures = [];

    if (test.expectKind && plan.kind !== test.expectKind) {
      failures.push(`kind: got ${plan.kind}, want ${test.expectKind}`);
    }
    if (test.expectTheme && p.theme !== test.expectTheme) {
      failures.push(`theme: got ${p.theme}, want ${test.expectTheme}`);
    }
    if (test.expectTemplate && p.templateId !== test.expectTemplate) {
      failures.push(`template: got ${p.templateId}, want ${test.expectTemplate}`);
    }
    if (test.expectComponentsAny && test.expectComponentsAny.length) {
      const set = new Set(p.components || []);
      const hit = test.expectComponentsAny.some((n) => set.has(n));
      if (!hit) failures.push("components missing any of " + test.expectComponentsAny.join(", "));
    }
    if (test.expectClarifyOrScenario) {
      const clarified = !!(plan.clarify && plan.clarify.length) || !!(plan.suggestions && plan.suggestions.length) || plan.kind === "build";
      // Outside DS prose should not invent non-SB template freely without grounding —
      // either clarify OR land on an SB scenario/intent build.
      if (!clarified && !p.templateId) failures.push("expected clarify or SB template");
      if (p.templateId && !agent.getTemplate(p.templateId)) failures.push("non-SB template");
    }

    if (!test.skipBuild || test.expectTemplate) {
      const compliance = agent.validateProjectAgainstSb(p);
      if (p.templateId && !compliance.ok) {
        failures.push("compliance: " + compliance.issues.join("; "));
      }
    }

    // Every executed tool must be in registry
    (result.trace || []).forEach((t) => {
      if (!agent.TOOLS[t.tool]) failures.push("unknown tool " + t.tool);
    });

    return {
      id: test.id,
      brief: test.brief,
      ok: failures.length === 0,
      failures,
      templateId: p.templateId,
      components: p.components,
      planner: plan.planner,
      kind: plan.kind,
    };
  }

  function runEval() {
    const results = GOLDEN.map(runCase);
    const passed = results.filter((r) => r.ok).length;
    return {
      passed,
      total: results.length,
      ok: passed === results.length,
      summary: `${passed}/${results.length} golden OK`,
      results,
    };
  }

  global.SbAgentEval = { GOLDEN, runCase, runEval };
})(window);
