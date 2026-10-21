/* preview bundle — single source: src/ */
var process = { env: { NODE_ENV: "production", NEXT_PUBLIC_PREVIEW: "1", NEXT_PUBLIC_AI_PROVIDER: "local" } };
const { useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef, createContext, useContext, memo, Component, Fragment } = React;
const { createRoot, createPortal } = ReactDOM;


// --- src/lib/mock-data.ts ---
// Генерация табельного номера SAP
function perno() {
    return String(Math.floor(100000 + Math.random() * 900000));
}
// Случайное число в диапазоне
function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Склоняемость дат
function daysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
}
// Генерация сотрудников: Правление → Предприятия → Директора → Сотрудники
const ENTERPRISES = [
    { orgId: "org-002", name: "Завод «Альфа»", city: "Северогорск", budget: 120000000 },
    { orgId: "org-003", name: "Завод «Бета»", city: "Новоград", budget: 95000000 },
    { orgId: "org-004", name: "Завод «Дельта»", city: "Кедроград", budget: 70000000 },
    { orgId: "org-005", name: "Завод «Омега»", city: "Озероград", budget: 55000000 },
    { orgId: "org-006", name: "Завод «Гамма»", city: "Среднеград", budget: 65000000 },
    { orgId: "org-007", name: "Корпоративный центр", city: "Москва", budget: 80000000 },
    { orgId: "org-008", name: "Цифровые решения", city: "Москва", budget: 48000000 },
    { orgId: "org-009", name: "Коннект Сервис", city: "Москва", budget: 42000000 },
    { orgId: "org-010", name: "Исследовательский центр", city: "Москва", budget: 56000000 },
    { orgId: "org-011", name: "Инфраструктурная компания", city: "Северогорск", budget: 68000000 },
    { orgId: "org-012", name: "Торговый дом", city: "Москва", budget: 35000000 },
];
const DIGITAL_ORG_ID = "org-008";
const DIGITAL_TARGET = 250;
const DIGITAL_GROUPS = [
    {
        name: "Группа корпоративных систем",
        products: [
            { name: "SAP HCM Portal", weight: 3 },
            { name: "ERP Integration Hub", weight: 2 },
            { name: "MDM Контур", weight: 2 },
            { name: "ЭДО Холдинг", weight: 1 },
        ],
    },
    {
        name: "Группа данных и AI",
        products: [
            { name: "Org Analytics", weight: 3 },
            { name: "MLOps Platform", weight: 2 },
            { name: "Data Lake", weight: 2 },
            { name: "AI Assistant", weight: 3 },
            { name: "BI Self-Service", weight: 2 },
        ],
    },
    {
        name: "Группа производственных продуктов",
        products: [
            { name: "MES Connector", weight: 2 },
            { name: "Digital Twin", weight: 2 },
            { name: "OEE Monitor", weight: 1 },
            { name: "Predictive Maintenance", weight: 2 },
        ],
    },
    {
        name: "Группа платформы",
        products: [
            { name: "Cloud Platform", weight: 2 },
            { name: "CI/CD Factory", weight: 2 },
            { name: "Observability", weight: 1 },
            { name: "API Gateway", weight: 2 },
        ],
    },
    {
        name: "Группа клиентских решений",
        products: [
            { name: "B2B Portal", weight: 2 },
            { name: "Mobile Workforce", weight: 2 },
            { name: "Partner Hub", weight: 1 },
        ],
    },
];
const DIGITAL_POSITIONS = [
    "Backend-разработчик", "Frontend-разработчик", "Fullstack-разработчик",
    "QA инженер", "DevOps инженер", "Data Engineer", "Data Scientist",
    "Системный аналитик", "Product Analyst", "UI/UX дизайнер",
    "Scrum Master", "Технический писатель", "Security Engineer", "ML Engineer",
];
const TARGET_TOTAL = 1000;
function allocateEnterpriseTargets() {
    const slots = TARGET_TOTAL - 1 - DIGITAL_TARGET;
    const others = ENTERPRISES.filter((e) => e.orgId !== DIGITAL_ORG_ID);
    const budgetSum = others.reduce((s, e) => s + e.budget, 0);
    const targets = others.map((e) => ({
        ent: e,
        target: Math.max(32, Math.round((e.budget / budgetSum) * slots * (0.86 + Math.random() * 0.28))),
    }));
    let sum = targets.reduce((s, t) => s + t.target, 0);
    const diff = slots - sum;
    targets.sort((a, b) => b.target - a.target)[0].target += diff;
    targets.push({ ent: ENTERPRISES.find((e) => e.orgId === DIGITAL_ORG_ID), target: DIGITAL_TARGET });
    return targets;
}
function generateDigitalEnterprise(ent, employees, ctx) {
    const { makeEmp, nextId, uniqueName } = ctx;
    const entName = ent.name;
    const entOrgId = ent.orgId;
    const target = DIGITAL_TARGET;
    const entId = nextId();
    employees.push(makeEmp(entId, {
        fullName: "Волков Дмитрий Игоревич",
        position: "Генеральный директор предприятия",
        department: entName,
        orgUnitId: entOrgId,
        managerId: `ent-${entOrgId}`,
        salary: rnd(850000, 1200000),
        metrics: { absenteeismDays: rnd(0, 2), lateCount: rnd(0, 2), sickDays: rnd(0, 8), workloadPercent: rnd(75, 98), teamSize: DIGITAL_GROUPS.length, budgetResponsibility: rnd(80000000, 120000000), criticalIncidents: 0 },
        kpi: { performanceScore: rnd(78, 96), lastReviewDate: daysAgo(rnd(10, 45)), tasksCompleted: rnd(30, 50), tasksOverdue: rnd(0, 2), overtimeHours: rnd(15, 45) },
    }));
    let localCount = 1;
    const productSlots = [];
    for (let g = 0; g < DIGITAL_GROUPS.length; g++) {
        const group = DIGITAL_GROUPS[g];
        const deptOrgId = `org-18${g}`;
        const groupDirId = nextId();
        employees.push(makeEmp(groupDirId, {
            fullName: uniqueName(),
            position: "Директор группы",
            department: `${entName} · ${group.name}`,
            orgUnitId: deptOrgId,
            managerId: entId,
            salary: rnd(420000, 620000),
            metrics: { absenteeismDays: rnd(0, 4), lateCount: rnd(0, 4), sickDays: rnd(0, 10), workloadPercent: rnd(65, 100), teamSize: group.products.length, budgetResponsibility: rnd(12000000, 35000000), criticalIncidents: rnd(0, 2) },
            kpi: { performanceScore: rnd(62, 94), lastReviewDate: daysAgo(rnd(10, 75)), tasksCompleted: rnd(18, 42), tasksOverdue: rnd(0, 5), overtimeHours: rnd(8, 40) },
        }));
        localCount++;
        for (const product of group.products) {
            const productOwnerId = nextId();
            employees.push(makeEmp(productOwnerId, {
                fullName: uniqueName(),
                position: "Руководитель продукта",
                department: `${entName} · ${group.name} · ${product.name}`,
                orgUnitId: deptOrgId,
                managerId: groupDirId,
                salary: rnd(300000, 450000),
                metrics: { absenteeismDays: rnd(0, 5), lateCount: rnd(0, 5), sickDays: rnd(0, 12), workloadPercent: rnd(55, 95), teamSize: rnd(4, 14), budgetResponsibility: rnd(2000000, 12000000), criticalIncidents: rnd(0, 2) },
                kpi: { performanceScore: rnd(58, 92), lastReviewDate: daysAgo(rnd(10, 80)), tasksCompleted: rnd(15, 38), tasksOverdue: rnd(0, 6), overtimeHours: rnd(5, 35) },
            }));
            localCount++;
            productSlots.push({ productOwnerId, deptOrgId, groupName: group.name, productName: product.name, weight: product.weight });
        }
    }
    let remaining = Math.max(0, target - localCount);
    const totalWeight = productSlots.reduce((s, p) => s + p.weight, 0);
    let assigned = 0;
    for (let i = 0; i < productSlots.length; i++) {
        const slot = productSlots[i];
        const staffCount = i === productSlots.length - 1 ? remaining - assigned : Math.round((slot.weight / totalWeight) * remaining);
        assigned += staffCount;
        for (let s = 0; s < staffCount; s++) {
            const isLowPerformer = Math.random() < 0.15;
            employees.push(makeEmp(nextId(), {
                fullName: uniqueName(),
                position: DIGITAL_POSITIONS[rnd(0, DIGITAL_POSITIONS.length - 1)],
                department: `${entName} · ${slot.groupName} · ${slot.productName}`,
                orgUnitId: slot.deptOrgId,
                managerId: slot.productOwnerId,
                salary: rnd(120000, 280000),
                employmentStatus: Math.random() < 0.04 ? "suspended" : "active",
                kpi: isLowPerformer
                    ? { performanceScore: rnd(22, 44), lastReviewDate: daysAgo(rnd(30, 150)), tasksCompleted: rnd(0, 10), tasksOverdue: rnd(5, 18), overtimeHours: rnd(0, 6) }
                    : undefined,
                metrics: isLowPerformer
                    ? { absenteeismDays: rnd(4, 20), lateCount: rnd(4, 18), sickDays: rnd(0, 15), workloadPercent: rnd(15, 40), teamSize: 0, budgetResponsibility: 0, criticalIncidents: rnd(1, 5) }
                    : undefined,
            }));
        }
    }
}
function generateEmployees() {
    const deptTemplates = [
        "Департамент ИТ и цифровизации",
        "Департамент производства",
        "Департамент финансов",
        "Департамент HR и администрации",
        "Департамент закупок",
        "Департамент качества",
        "Департамент логистики",
        "Департамент коммерции",
    ];
    const functionTemplates = [
        "Закупки и снабжение",
        "Качество",
        "Логистика",
        "Планирование",
        "Коммерция",
        "Техническая поддержка",
        "Аналитика",
        "Охрана труда",
        "Производственный участок",
        "Сервис",
        "Разработка",
        "Контроль",
    ];
    const positions = [
        "Ведущий инженер",
        "Старший инженер",
        "Инженер",
        "Аналитик",
        "Менеджер проектов",
        "Системный администратор",
        "DevOps инженер",
        "Data Scientist",
        "SAP-консультант",
        "Специалист по безопасности",
        "HR-менеджер",
        "Бухгалтер",
        "Техник",
        "Оператор",
        "Специалист",
        "Экономист",
        "Юрист",
        "Метролог",
        "Лаборант",
        "Диспетчер",
    ];
    const firstNames = [
        "Александр", "Михаил", "Дмитрий", "Сергей", "Андрей", "Николай",
        "Елена", "Ольга", "Анна", "Екатерина", "Ирина", "Татьяна",
        "Владимир", "Игорь", "Павел", "Максим", "Артём", "Денис", "Роман", "Юрий",
        "Наталья", "Мария", "Светлана", "Виктор", "Константин", "Олег", "Григорий", "Вадим", "Алина", "Дарья",
    ];
    const lastNames = [
        "Петров", "Иванов", "Сидоров", "Кузнецов", "Смирнов", "Попов",
        "Васильев", "Соколов", "Михайлов", "Новиков", "Фёдоров", "Морозов",
        "Волков", "Алексеев", "Истомин", "Козлов", "Егоров", "Голубев", "Зайцев", "Богданов",
        "Орлов", "Семёнов", "Павлов", "Лебедев", "Королёв", "Макаров", "Никитин", "Захаров", "Степанов", "Романов",
    ];
    const employees = [];
    const usedNames = new Set();
    let nameSerial = 0;
    function uniqueName() {
        const base = `${lastNames[rnd(0, lastNames.length - 1)]} ${firstNames[rnd(0, firstNames.length - 1)]}`;
        let name = base;
        while (usedNames.has(name))
            name = `${base} ${++nameSerial}`;
        usedNames.add(name);
        return name;
    }
    function makeEmp(id, partial) {
        const isLow = (partial.kpi?.performanceScore ?? rnd(55, 98)) < 45;
        return {
            personnelNumber: perno(),
            salary: rnd(80000, 220000),
            hireDate: `202${rnd(1, 5)}-0${rnd(1, 9)}-${String(rnd(1, 28)).padStart(2, "0")}`,
            employmentStatus: "active",
            kpi: {
                performanceScore: rnd(55, 98),
                lastReviewDate: daysAgo(rnd(10, 90)),
                tasksCompleted: rnd(10, 40),
                tasksOverdue: rnd(0, 8),
                overtimeHours: rnd(0, 40),
            },
            metrics: {
                absenteeismDays: rnd(0, 5),
                lateCount: rnd(0, 5),
                sickDays: rnd(0, 15),
                workloadPercent: rnd(50, 95),
                teamSize: 0,
                budgetResponsibility: 0,
                criticalIncidents: rnd(0, 2),
            },
            sap: {
                infotype0001: partial.position,
                infotype0008: `G${rnd(10, 18)}`,
                infotype0027: `CC-${id.slice(-4)}`,
                lastChanged: daysAgo(rnd(5, 60)),
            },
            ...partial,
            id,
            kpi: partial.kpi ?? {
                performanceScore: isLow ? rnd(20, 48) : rnd(55, 98),
                lastReviewDate: daysAgo(rnd(10, 120)),
                tasksCompleted: isLow ? rnd(0, 12) : rnd(15, 40),
                tasksOverdue: isLow ? rnd(4, 18) : rnd(0, 5),
                overtimeHours: rnd(0, 40),
            },
            metrics: partial.metrics ?? {
                absenteeismDays: isLow ? rnd(3, 20) : rnd(0, 5),
                lateCount: isLow ? rnd(3, 15) : rnd(0, 5),
                sickDays: rnd(0, 20),
                workloadPercent: isLow ? rnd(15, 45) : rnd(50, 95),
                teamSize: partial.metrics?.teamSize ?? 0,
                budgetResponsibility: partial.metrics?.budgetResponsibility ?? 0,
                criticalIncidents: isLow ? rnd(1, 6) : rnd(0, 2),
            },
        };
    }
    let empCounter = 1;
    const nextId = () => `emp-${String(++empCounter).padStart(4, "0")}`;
    employees.push({
        id: "emp-001",
        personnelNumber: "000001",
        fullName: "Иванов Сергей Петрович",
        position: "Генеральный директор",
        department: "ПАО «Управляющая компания»",
        orgUnitId: "org-001",
        managerId: null,
        salary: 1500000,
        hireDate: "2015-03-15",
        employmentStatus: "active",
        kpi: { performanceScore: 92, lastReviewDate: daysAgo(30), tasksCompleted: 45, tasksOverdue: 0, overtimeHours: 60 },
        metrics: { absenteeismDays: 0, lateCount: 0, sickDays: 2, workloadPercent: 95, teamSize: ENTERPRISES.length, budgetResponsibility: 500000000, criticalIncidents: 0 },
        sap: { infotype0001: "CEO", infotype0008: "G20", infotype0027: "CC-0001", lastChanged: daysAgo(30) },
    });
    const enterpriseTargets = allocateEnterpriseTargets();
    for (let i = 0; i < enterpriseTargets.length; i++) {
        const { ent, target } = enterpriseTargets[i];
        if (ent.orgId === DIGITAL_ORG_ID) {
            generateDigitalEnterprise(ent, employees, { makeEmp, nextId, uniqueName });
            continue;
        }
        const entOrgId = ent.orgId;
        const entId = nextId();
        employees.push(makeEmp(entId, {
            fullName: i === 0 ? "Смирнов Александр Викторович" : uniqueName(),
            position: "Генеральный директор предприятия",
            department: ent.name,
            orgUnitId: entOrgId,
            managerId: `ent-${entOrgId}`,
            salary: rnd(700000, 1100000),
            metrics: { absenteeismDays: rnd(0, 3), lateCount: rnd(0, 3), sickDays: rnd(0, 10), workloadPercent: rnd(70, 98), teamSize: rnd(3, 6), budgetResponsibility: rnd(50000000, 150000000), criticalIncidents: rnd(0, 1) },
            kpi: { performanceScore: rnd(65, 95), lastReviewDate: daysAgo(rnd(10, 60)), tasksCompleted: rnd(25, 50), tasksOverdue: rnd(0, 4), overtimeHours: rnd(10, 50) },
        }));
        let localCount = 1;
        const funcHeads = [];
        const numDepts = target >= 150 ? rnd(4, 5) : target >= 110 ? rnd(3, 4) : target >= 75 ? rnd(3, 3) : rnd(2, 3);
        const depts = [...deptTemplates].sort(() => Math.random() - 0.5).slice(0, numDepts);
        for (let j = 0; j < depts.length; j++) {
            const deptName = depts[j];
            const deptOrgId = `org-${String(100 + i * 10 + j).padStart(3, "0")}`;
            const dirId = nextId();
            employees.push(makeEmp(dirId, {
                fullName: uniqueName(),
                position: "Директор департамента",
                department: `${ent.name} · ${deptName}`,
                orgUnitId: deptOrgId,
                managerId: entId,
                salary: rnd(350000, 550000),
                metrics: { absenteeismDays: rnd(0, 5), lateCount: rnd(0, 6), sickDays: rnd(0, 12), workloadPercent: rnd(60, 100), teamSize: rnd(4, 12), budgetResponsibility: rnd(5000000, 40000000), criticalIncidents: rnd(0, 3) },
                kpi: { performanceScore: rnd(50, 92), lastReviewDate: daysAgo(rnd(10, 90)), tasksCompleted: rnd(15, 45), tasksOverdue: rnd(0, 8), overtimeHours: rnd(5, 50) },
            }));
            localCount++;
            const numLeads = target >= 140 ? rnd(3, 5) : target >= 100 ? rnd(2, 4) : rnd(2, 3);
            for (let k = 0; k < numLeads; k++) {
                const leadId = nextId();
                employees.push(makeEmp(leadId, {
                    fullName: uniqueName(),
                    position: "Руководитель направления",
                    department: `${ent.name} · ${deptName}`,
                    orgUnitId: deptOrgId,
                    managerId: dirId,
                    salary: rnd(220000, 380000),
                    metrics: { absenteeismDays: rnd(0, 8), lateCount: rnd(0, 10), sickDays: rnd(0, 18), workloadPercent: rnd(45, 100), teamSize: rnd(2, 6), budgetResponsibility: rnd(500000, 8000000), criticalIncidents: rnd(0, 4) },
                }));
                localCount++;
                const numFuncs = target >= 140 ? rnd(4, 7) : target >= 90 ? rnd(3, 5) : rnd(2, 4);
                const funcs = [...functionTemplates].sort(() => Math.random() - 0.5).slice(0, numFuncs);
                for (const funcName of funcs) {
                    const funcId = nextId();
                    employees.push(makeEmp(funcId, {
                        fullName: uniqueName(),
                        position: "Руководитель функции",
                        department: `${ent.name} · ${deptName} · ${funcName}`,
                        orgUnitId: deptOrgId,
                        managerId: leadId,
                        salary: rnd(170000, 300000),
                        metrics: { absenteeismDays: rnd(0, 6), lateCount: rnd(0, 8), sickDays: rnd(0, 14), workloadPercent: rnd(50, 95), teamSize: rnd(2, 5), budgetResponsibility: rnd(300000, 5000000), criticalIncidents: rnd(0, 3) },
                    }));
                    localCount++;
                    funcHeads.push({ funcId, deptOrgId, deptName, funcName });
                }
            }
        }
        let remaining = Math.max(0, target - localCount);
        if (!funcHeads.length)
            continue;
        const baseStaff = Math.floor(remaining / funcHeads.length);
        let extra = remaining % funcHeads.length;
        for (const fh of funcHeads) {
            let staffCount = baseStaff + (extra-- > 0 ? 1 : 0);
            while (staffCount-- > 0) {
                const isLowPerformer = Math.random() < 0.2;
                const pos = positions[rnd(0, positions.length - 1)];
                employees.push(makeEmp(nextId(), {
                    fullName: uniqueName(),
                    position: pos,
                    department: `${ent.name} · ${fh.deptName} · ${fh.funcName}`,
                    orgUnitId: fh.deptOrgId,
                    managerId: fh.funcId,
                    salary: rnd(80000, 210000),
                    employmentStatus: Math.random() < 0.06 ? "suspended" : "active",
                    kpi: isLowPerformer
                        ? { performanceScore: rnd(18, 48), lastReviewDate: daysAgo(rnd(30, 180)), tasksCompleted: rnd(0, 12), tasksOverdue: rnd(6, 22), overtimeHours: rnd(0, 8) }
                        : undefined,
                    metrics: isLowPerformer
                        ? { absenteeismDays: rnd(5, 28), lateCount: rnd(5, 25), sickDays: rnd(0, 20), workloadPercent: rnd(12, 42), teamSize: 0, budgetResponsibility: 0, criticalIncidents: rnd(2, 8) }
                        : undefined,
                }));
            }
        }
    }
    for (const e of employees) {
        const directs = employees.filter((x) => x.managerId === e.id).length;
        if (directs > 0)
            e.metrics.teamSize = directs;
    }
    return employees;
}
function buildOrgUnits(employees) {
    const units = [
        { id: "org-001", name: "ПАО «Управляющая компания»", parentId: null, headId: "emp-001", costCenter: "CC-0001", budget: 500000000 },
    ];
    for (const ent of ENTERPRISES) {
        const head = employees.find((e) => e.orgUnitId === ent.orgId && e.position === "Генеральный директор предприятия");
        units.push({ id: ent.orgId, name: ent.name, city: ent.city, parentId: "org-001", headId: head?.id ?? null, costCenter: `CC-${ent.orgId.slice(-3)}`, budget: ent.budget });
    }
    const deptUnits = new Map();
    for (const e of employees) {
        if ((e.position === "Директор департамента" || e.position === "Директор группы") && !deptUnits.has(e.orgUnitId)) {
            const entOrg = units.find((u) => u.id === employees.find((x) => x.id === e.managerId)?.orgUnitId);
            deptUnits.set(e.orgUnitId, {
                id: e.orgUnitId,
                name: e.department.split(" · ")[1] ?? e.department,
                parentId: entOrg?.id ?? "org-001",
                headId: e.id,
                costCenter: `CC-${e.orgUnitId.slice(-3)}`,
                budget: rnd(15000000, 45000000),
            });
        }
    }
    units.push(...deptUnits.values());
    return units;
}
const ORG_DATA_SEED = 20261021;
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const __orgRand = Math.random;
Math.random = mulberry32(ORG_DATA_SEED);
const employees = generateEmployees();
// Демо-якоря для AI-ассистента: Петров + «неэффективные»
(function injectDemoPeople() {
    const beta = ENTERPRISES.find((e) => e.orgId === "org-003") || ENTERPRISES[1];
    const betaGm = employees.find((e) => e.orgUnitId === beta.orgId && e.position === "Генеральный директор предприятия");
    const alphaGm = employees.find((e) => e.orgUnitId === "org-002" && e.position === "Генеральный директор предприятия");
    function pushDemo(partial) {
        if (employees.some((e) => e.fullName === partial.fullName))
            return;
        const id = `emp-demo-${String(employees.length).padStart(4, "0")}`;
        employees.push({
            id,
            personnelNumber: String(900000 + employees.length),
            salary: partial.salary,
            hireDate: "2019-06-12",
            employmentStatus: "active",
            fullName: partial.fullName,
            position: partial.position,
            department: partial.department,
            orgUnitId: partial.orgUnitId,
            managerId: partial.managerId,
            kpi: partial.kpi,
            metrics: partial.metrics,
            sap: { infotype0001: partial.position, infotype0008: "G12", infotype0027: `CC-${id.slice(-4)}`, lastChanged: daysAgo(14) },
        });
    }
    pushDemo({
        fullName: "Петров Алексей Сергеевич",
        position: "Ведущий инженер",
        department: `${beta.name} · Производство`,
        orgUnitId: beta.orgId,
        managerId: betaGm?.id ?? "emp-001",
        salary: 145000,
        kpi: { performanceScore: 34, lastReviewDate: daysAgo(45), tasksCompleted: 6, tasksOverdue: 14, overtimeHours: 4 },
        metrics: { absenteeismDays: 12, lateCount: 9, sickDays: 8, workloadPercent: 28, teamSize: 0, budgetResponsibility: 0, criticalIncidents: 3 },
    });
    pushDemo({
        fullName: "Петрова Мария Ивановна",
        position: "Аналитик",
        department: `${beta.name} · Планирование`,
        orgUnitId: beta.orgId,
        managerId: betaGm?.id ?? "emp-001",
        salary: 118000,
        kpi: { performanceScore: 81, lastReviewDate: daysAgo(20), tasksCompleted: 28, tasksOverdue: 1, overtimeHours: 12 },
        metrics: { absenteeismDays: 1, lateCount: 0, sickDays: 2, workloadPercent: 78, teamSize: 0, budgetResponsibility: 0, criticalIncidents: 0 },
    });
    pushDemo({
        fullName: "Сидоров Игорь Николаевич",
        position: "Специалист",
        department: "Завод «Альфа» · Логистика",
        orgUnitId: "org-002",
        managerId: alphaGm?.id ?? "emp-001",
        salary: 98000,
        kpi: { performanceScore: 29, lastReviewDate: daysAgo(70), tasksCompleted: 3, tasksOverdue: 18, overtimeHours: 0 },
        metrics: { absenteeismDays: 18, lateCount: 14, sickDays: 11, workloadPercent: 22, teamSize: 0, budgetResponsibility: 0, criticalIncidents: 4 },
    });
    // Дубль роли PLANS в той же ORGEH (Бета · Ведущий инженер)
    pushDemo({
        fullName: "Орлов Никита Андреевич",
        position: "Ведущий инженер",
        department: `${beta.name} · Производство`,
        orgUnitId: beta.orgId,
        managerId: betaGm?.id ?? "emp-001",
        salary: 142000,
        kpi: { performanceScore: 71, lastReviewDate: daysAgo(18), tasksCompleted: 22, tasksOverdue: 2, overtimeHours: 10 },
        metrics: { absenteeismDays: 2, lateCount: 1, sickDays: 1, workloadPercent: 74, teamSize: 0, budgetResponsibility: 0, criticalIncidents: 0 },
    });
    // Дыра: битая ссылка на руководителя
    pushDemo({
        fullName: "Белов Артём Сергеевич",
        position: "Инженер по качеству",
        department: "Завод «Альфа» · Качество",
        orgUnitId: "org-002",
        managerId: "emp-DOES-NOT-EXIST",
        salary: 110000,
        kpi: { performanceScore: 55, lastReviewDate: daysAgo(40), tasksCompleted: 14, tasksOverdue: 4, overtimeHours: 6 },
        metrics: { absenteeismDays: 3, lateCount: 2, sickDays: 1, workloadPercent: 60, teamSize: 0, budgetResponsibility: 0, criticalIncidents: 1 },
    });
    // Дыра: нет managerId у не-корневого
    pushDemo({
        fullName: "Тихонова Ольга Викторовна",
        position: "Экономист",
        department: `${beta.name} · Экономика`,
        orgUnitId: beta.orgId,
        managerId: null,
        salary: 125000,
        kpi: { performanceScore: 66, lastReviewDate: daysAgo(25), tasksCompleted: 19, tasksOverdue: 2, overtimeHours: 8 },
        metrics: { absenteeismDays: 0, lateCount: 0, sickDays: 1, workloadPercent: 70, teamSize: 0, budgetResponsibility: 0, criticalIncidents: 0 },
    });
})();
// Cost center mismatch: IT0027 ≠ OM KOSTL оргединицы
(function injectCostCenterMismatch() {
    const petrova = employees.find((e) => e.fullName === "Петрова Мария Ивановна");
    if (petrova) {
        petrova.sap = petrova.sap || {};
        petrova.sap.infotype0027 = "CC-WRONG-77";
    }
})();
const orgUnits = buildOrgUnits(employees);
Math.random = __orgRand;
function orgStructureSignature(list) {
    let h = 2166136261;
    const parts = list.map((e) => e.id + ":" + (e.managerId || "") + ":" + e.fullName).sort();
    const s = parts.join("|");
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
}
const ORG_STRUCTURE_SIG = orgStructureSignature(employees);
const mockOrgData = {
    employees,
    orgUnits,
    metadata: {
        company: "ПАО «Управляющая компания»",
        extractedAt: new Date().toISOString(),
        systemType: "SAP_ERP_HCM",
        totalEmployees: employees.length,
        totalBudget: orgUnits.reduce((sum, u) => sum + u.budget, 0),
    },
};
// Аналитические функции
function getDepartmentStats(orgData, deptId) {
    const childUnitIds = new Set(orgData.orgUnits.filter((u) => u.parentId === deptId).map((u) => u.id));
    const deptEmployees = orgData.employees.filter((e) => e.orgUnitId === deptId || childUnitIds.has(e.orgUnitId));
    if (deptEmployees.length === 0)
        return null;
    const avgKpi = deptEmployees.reduce((s, e) => s + e.kpi.performanceScore, 0) /
        deptEmployees.length;
    const totalSalary = deptEmployees.reduce((s, e) => s + e.salary, 0);
    const totalAbsenteeism = deptEmployees.reduce((s, e) => s + e.metrics.absenteeismDays, 0);
    const totalOverdue = deptEmployees.reduce((s, e) => s + e.kpi.tasksOverdue, 0);
    const totalIncidents = deptEmployees.reduce((s, e) => s + e.metrics.criticalIncidents, 0);
    const lowPerformers = deptEmployees.filter((e) => e.kpi.performanceScore < 45);
    const highPerformers = deptEmployees.filter((e) => e.kpi.performanceScore > 80);
    // Оценка «дровяности» отдела (0-100, где 100 = пора сокращать)
    const deadwoodScore = Math.round((50 - avgKpi / 2) * 0.35 +
        (lowPerformers.length / Math.max(deptEmployees.length, 1)) * 100 * 0.25 +
        (totalOverdue / Math.max(deptEmployees.length * 5, 1)) * 100 * 0.2 +
        (totalAbsenteeism / Math.max(deptEmployees.length * 2, 1)) * 100 * 0.1 +
        (totalIncidents / Math.max(deptEmployees.length, 1)) * 100 * 0.1);
    const efficiencyScore = Math.min(100, Math.max(0, Math.round((avgKpi / 100) * 55 + (highPerformers.length / Math.max(deptEmployees.length, 1)) * 45)));
    return {
        deptId,
        deptName: orgData.orgUnits.find((u) => u.id === deptId)?.name ?? "",
        headCount: deptEmployees.length,
        avgKpi: Math.round(avgKpi),
        totalSalary,
        totalAbsenteeism,
        totalOverdue,
        totalIncidents,
        lowPerformers: lowPerformers.length,
        highPerformers: highPerformers.length,
        deadwoodScore: Math.min(100, Math.max(0, deadwoodScore)),
        efficiencyScore,
        potentialSavings: lowPerformers.reduce((s, e) => s + e.salary, 0),
        topDeadwood: lowPerformers
            .sort((a, b) => a.kpi.performanceScore - b.kpi.performanceScore)
            .slice(0, 3)
            .map((e) => ({
            id: e.id,
            name: e.fullName,
            position: e.position,
            kpi: e.kpi.performanceScore,
            salary: e.salary,
            absenteeismDays: e.metrics.absenteeismDays,
            criticalIncidents: e.metrics.criticalIncidents,
            recommendationScore: Math.round((50 - e.kpi.performanceScore) * 0.5 +
                e.metrics.absenteeismDays * 2 +
                e.metrics.criticalIncidents * 5),
        })),
    };
}
// Нормализация токена ФИО (Петрова/Петрову → петров)
function normalizeNameToken(raw) {
    let s = String(raw || "").toLowerCase().replace(/ё/g, "е").trim();
    if (s.length < 2)
        return s;
    // Женские / падежные формы фамилий на -ов/-ев/-ин: только последняя гласная
    if (s.length >= 5 && /(ова|ева|ина|ына|ову|еву|ину|ыну|овым|евым|иным|овой|евой|иной)$/.test(s)) {
        if (/(овым|евым|иным|овой|евой|иной)$/.test(s))
            return s.replace(/(ым|ой|ей)$/, "");
        return s.slice(0, -1); // Петрова → петров
    }
    const endings = [
        "ого", "ему", "ому", "ыми", "ими",
        "ых", "их", "ым", "им", "ой", "ей", "ом", "ем", "ую", "юю", "ая", "яя", "ые", "ие",
    ];
    for (const end of endings) {
        if (s.length - end.length >= 4 && s.endsWith(end)) {
            s = s.slice(0, -end.length);
            break;
        }
    }
    if (s.length >= 4 && /[аяуюе]$/.test(s)) {
        const base = s.slice(0, -1);
        if (/(ов|ев|ин|ын)$/.test(base))
            s = base;
    }
    return s;
}
function extractSearchTokens(query) {
    const stop = new Set([
        "найди", "найти", "покажи", "открой", "кто", "такой", "такая", "где", "про", "мне",
        "сотрудник", "сотрудника", "сотрудницу", "человека", "расскажи", "информация", "по",
        "его", "её", "ee", "карточку", "профиль", "пожалуйста", "можно", "ли",
    ]);
    return String(query || "")
        .toLowerCase()
        .replace(/ё/g, "е")
        .split(/[^a-zа-я0-9]+/i)
        .map((t) => t.trim())
        .filter((t) => t.length >= 2 && !stop.has(t))
        .map(normalizeNameToken)
        .filter(Boolean);
}
// Быстрый поиск в орг-структуре по текстовому запросу (с учётом склонений)
function searchEmployees(orgData, query) {
    const tokens = extractSearchTokens(query);
    const raw = String(query || "").toLowerCase().replace(/ё/g, "е").trim();
    if (!tokens.length && raw.length < 2)
        return [];
    const scored = [];
    for (const e of orgData.employees) {
        const name = e.fullName.toLowerCase().replace(/ё/g, "е");
        const parts = name.split(/\s+/);
        const surname = normalizeNameToken(parts[0] || "");
        const pos = (e.position || "").toLowerCase();
        const dep = (e.department || "").toLowerCase();
        let score = 0;
        for (const t of tokens) {
            if (!t)
                continue;
            if (surname === t || (parts[0] || "") === t)
                score += 12;
            else if (surname.startsWith(t) || t.startsWith(surname) || (surname.length >= 4 && t.length >= 4 && surname.slice(0, 5) === t.slice(0, 5)))
                score += 9;
            else if (parts.some((p) => normalizeNameToken(p) === t || p.startsWith(t)))
                score += 6;
            else if (name.includes(t))
                score += 4;
            else if (pos.includes(t) || dep.includes(t))
                score += 2;
            else if (e.personnelNumber.includes(t))
                score += 3;
        }
        if (!tokens.length && (name.includes(raw) || pos.includes(raw) || dep.includes(raw)))
            score += 3;
        if (score > 0 && String(e.id || "").startsWith("emp-demo"))
            score += 20; // демо-якоря ассистента выше в выдаче
        if (score > 0)
            scored.push({ e, score });
    }
    scored.sort((a, b) => b.score - a.score || a.e.fullName.localeCompare(b.e.fullName, "ru"));
    return scored.map((x) => x.e);
}
// Форматирование ФИО: "Фамилия Имя Отчество" → "Фамилия И.О."
function formatShortName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1)
        return fullName;
    const [surname, ...rest] = parts;
    const initials = rest.map((n) => n[0] + ".").join("");
    return `${surname} ${initials}`;
}


// --- src/lib/org-ai.ts ---
function getVerdict(emp) {
    const reasons = [];
    if (emp.employmentStatus === "suspended")
        return "Сотрудник уже отстранён.";
    if (emp.kpi.performanceScore < 30)
        reasons.push("критически низкий KPI");
    else if (emp.kpi.performanceScore < 45)
        reasons.push("низкий KPI");
    else if (emp.kpi.performanceScore < 55)
        reasons.push("KPI ниже целевого");
    if (emp.kpi.tasksOverdue > 5)
        reasons.push(`много просроченных задач (${emp.kpi.tasksOverdue})`);
    if (emp.metrics.absenteeismDays > 10)
        reasons.push(`частые прогулы (${emp.metrics.absenteeismDays} дн.)`);
    if (emp.metrics.criticalIncidents > 0)
        reasons.push(`критические инциденты (${emp.metrics.criticalIncidents})`);
    const canFire = emp.kpi.performanceScore < 45 && emp.employmentStatus === "active";
    if (canFire && reasons.length >= 2) {
        return `ДА, рекомендуется уволить.\n\nПричины: ${reasons.join("; ")}.`;
    }
    if (emp.kpi.performanceScore < 60 && reasons.length >= 1) {
        return `ПОД ВОПРОСОМ. Факторы риска: ${reasons.join("; ")}. Рекомендуется дополнительная оценка эффективности.`;
    }
    return "НЕТ, не рекомендуется увольнять. KPI в норме, критических нарушений нет.";
}
function empSummary(emp) {
    return `**${emp.fullName}** — ${emp.position}, ${emp.department}.\n\n**Показатели:** KPI ${emp.kpi.performanceScore}/100 | Выполнено: ${emp.kpi.tasksCompleted} | Просрочено: ${emp.kpi.tasksOverdue} | Прогулы: ${emp.metrics.absenteeismDays} дн.`;
}
function generateAIResponse(prompt, orgData) {
    const departments = orgData.orgUnits.filter((u) => u.parentId !== null);
    const deptStats = departments
        .map((d) => getDepartmentStats(orgData, d.id))
        .filter(Boolean);
    const byRisk = [...deptStats].sort((a, b) => b.deadwoodScore - a.deadwoodScore);
    const byEfficiency = [...deptStats].sort((a, b) => b.efficiencyScore - a.efficiencyScore);
    const worstDepts = byRisk.slice(0, 5);
    const bestDepts = byEfficiency.slice(0, 5);
    const active = orgData.employees.filter((e) => e.employmentStatus === "active");
    const lowPerf = active
        .filter((e) => e.kpi.performanceScore < 45)
        .sort((a, b) => a.kpi.performanceScore - b.kpi.performanceScore);
    const highPerf = active
        .filter((e) => e.kpi.performanceScore > 80)
        .sort((a, b) => b.kpi.performanceScore - a.kpi.performanceScore);
    const avgKpi = Math.round(active.reduce((s, e) => s + e.kpi.performanceScore, 0) / Math.max(active.length, 1));
    const savings = lowPerf.reduce((s, e) => s + e.salary, 0);
    const fmtMoney = (n) => (n / 1e6).toFixed(1).replace(".0", "") + " млн ₽";
    const q = prompt.toLowerCase().replace(/ё/g, "е");
    const tokens = extractSearchTokens(prompt);
    const looksLikePersonQuery = tokens.some((t) => t.length >= 4) &&
        (q.includes("кто") || q.includes("найд") || q.includes("покаж") || q.includes("открой") ||
            q.includes("сотрудник") || q.includes("профиль") || q.includes("карточ") ||
            q.includes("петров") || q.includes("сидоров") || tokens.length <= 3);

    // Поиск сотрудника по ФИО / должности в свободном тексте
    const found = searchEmployees(orgData, prompt);
    if (found.length === 1 && (looksLikePersonQuery || found[0].fullName.toLowerCase().split(/\s+/).some((p) => {
        const stem = normalizeNameToken(p);
        return stem.length > 3 && (q.includes(stem) || q.includes(p));
    }))) {
        const emp = found[0];
        return `${empSummary(emp)}\n\n**Вердикт:** ${getVerdict(emp)}\n\n*Анализ по данным SAP ERP HCM*`;
    }
    if (found.length > 1 && looksLikePersonQuery) {
        const top = found.slice(0, 5);
        return `**Нашёл ${found.length} совпадений** по запросу «${prompt}»:\n\n` +
            top.map((e, i) => `${i + 1}. **${e.fullName}** — ${e.position}, KPI ${e.kpi.performanceScore}/100 · ${e.department}`).join("\n") +
            `\n\nУточните ФИО или скажите «открой ${top[0].fullName.split(" ")[0]}», чтобы открыть карточку.\n\n*Источник: SAP ERP HCM*`;
    }

    if (q.includes("рекоменд") || (q.includes("орг") && q.includes("измен")) || q.includes("что делать") || q.includes("план")) {
        return `**Рекомендации по организационным изменениям**

1. **Приоритет оптимизации:** ${worstDepts.slice(0, 3).map((d) => d.deptName).join(", ")}
   — высокий индекс риска (${worstDepts[0]?.deadwoodScore}/100 в лидере списка).

2. **Кадровый резерв:** ${highPerf.slice(0, 3).map((e) => formatShortName(e.fullName)).join(", ") || "нет данных"}
   — KPI выше 80, кандидаты на развитие / ротацию.

3. **Потенциал экономии ФОТ:** до **${fmtMoney(savings)}/год** за счёт ${lowPerf.length} позиций с KPI &lt; 45.

4. **Шаги:**
   - провести оценку эффективности в зонах риска;
   - пересмотреть нагрузку и роли;
   - зафиксировать KPI и контрольные точки на квартал.

*Источник: SAP ERP HCM · ${orgData.metadata.totalEmployees} сотрудников*`;
    }

    if (q.includes("оптимиз") || q.includes("эконом") || q.includes("фота") || q.includes("бюджет") || q.includes("сократ")) {
        return `**Потенциал оптимизации**

**Зоны с максимальным эффектом:**
${worstDepts.slice(0, 4).map((d, i) => `${i + 1}. **${d.deptName}** — риск ${d.deadwoodScore}/100, низкий KPI: ${d.lowPerformers} чел., экономия до ${fmtMoney(d.potentialSavings)}`).join("\n")}

**Сводка:**
- Позиций к пересмотру: **${lowPerf.length}**
- Потенциал экономии ФОТ: **${fmtMoney(savings)}/год**
- Средний KPI по компании: **${avgKpi}/100**

**Вывод:** Начать с «${worstDepts[0]?.deptName}» — наибольший индекс риска и концентрация низких показателей.

*Источник: SAP ERP HCM*`;
    }

    if (q.includes("низк") || q.includes("производител") || q.includes("мертв") || q.includes("риск") ||
        q.includes("проблем") || q.includes("выяв") || q.includes("неэффект") || q.includes("не эффект") ||
        q.includes("плох") || q.includes("слабые") || q.includes("аутсайдер") || q.includes("кто тянет") ||
        q.includes("отстающ") || q.includes("отстают")) {
        const namedLow = lowPerf.slice(0, 8);
        return `**Неэффективные зоны и сотрудники**

**Подразделения в зоне риска:**
${worstDepts.slice(0, 5).map((d, i) => `${i + 1}. **${d.deptName}** — индекс риска **${d.deadwoodScore}/100**, ср. KPI ${d.avgKpi}, просрочек: ${d.totalOverdue}`).join("\n")}

**Сотрудники с низкой эффективностью (KPI &lt; 45):**
${namedLow.map((e, i) => `${i + 1}. **${e.fullName}** — KPI **${e.kpi.performanceScore}**, просрочено ${e.kpi.tasksOverdue}, прогулы ${e.metrics.absenteeismDays} дн. · ${e.department}`).join("\n")}

**Вывод:** ${lowPerf.length} сотрудников ниже порога. Для разбора карточки скажите, например: «Найди Петрова» или «Открой ${namedLow[0]?.fullName.split(" ")[0] || "сотрудника"}».

*Источник: SAP ERP HCM*`;
    }

    if (q.includes("эффектив") || q.includes("анализ") || q.includes("топ") || q.includes("рейтинг") || q.includes("лучш")) {
        return `**Анализ эффективности подразделений**

**ТОП по эффективности:**
${bestDepts.slice(0, 5).map((d, i) => `${i + 1}. **${d.deptName}** — индекс ${d.efficiencyScore}/100, KPI ${d.avgKpi}, high-performers: ${d.highPerformers}`).join("\n")}

**Аутсайдеры:**
${worstDepts.slice(0, 3).map((d, i) => `${i + 1}. **${d.deptName}** — риск ${d.deadwoodScore}/100, KPI ${d.avgKpi}`).join("\n")}

**По компании:** средний KPI **${avgKpi}**, high-performers: **${highPerf.length}**, ниже порога: **${lowPerf.length}**.

*Источник: SAP ERP HCM*`;
    }

    if (q.includes("сколько") || q.includes("числен") || q.includes("штат") || q.includes("сотрудник") || q.includes("обзор") || q.includes("сводк")) {
        return `**Сводка по оргструктуре**

- Компания: **${orgData.metadata.company}**
- Сотрудников: **${orgData.metadata.totalEmployees}**
- Подразделений: **${departments.length}**
- Средний KPI: **${avgKpi}/100**
- KPI &lt; 45: **${lowPerf.length}** · KPI &gt; 80: **${highPerf.length}**
- Бюджет оргструктуры: **${fmtMoney(orgData.metadata.totalBudget)}**

**Лучшее подразделение:** ${bestDepts[0]?.deptName} (${bestDepts[0]?.efficiencyScore}/100)
**Зона риска:** ${worstDepts[0]?.deptName} (риск ${worstDepts[0]?.deadwoodScore}/100)

*Источник: SAP ERP HCM*`;
    }

    return `**ОргАналитика — ответ по запросу**

Запрос: «${prompt}»

**Ключевые факты:**
- Средний KPI: **${avgKpi}/100**
- В зоне риска: **${worstDepts[0]?.deptName}** (индекс ${worstDepts[0]?.deadwoodScore}/100)
- Лучшее подразделение: **${bestDepts[0]?.deptName}** (${bestDepts[0]?.efficiencyScore}/100)
- Позиций с KPI &lt; 45: **${lowPerf.length}** (потенциал экономии ${fmtMoney(savings)}/год)

**Могу детализировать:** эффективность, зоны низкой производительности, потенциал оптимизации, рекомендации по орг. изменениям или конкретного сотрудника.

*Анализ выполнен по данным SAP ERP HCM*`;
}


// --- src/lib/org-context.tsx ---
const OrgContext = createContext(null);
function useOrg() {
    const ctx = useContext(OrgContext);
    if (!ctx)
        throw new Error("useOrg: wrap tree in PreviewOrgProvider or OrgAppProvider");
    return ctx;
}


// --- src/lib/preview-org-provider.tsx ---
function PreviewOrgProvider({ children }) {
    const [orgData] = useState(mockOrgData);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "**Привет!** Я корпоративный AI-ассистент по оргструктуре SAP ERP HCM.\n\nМогу **найти сотрудника** (например, Петрова), показать **неэффективные зоны**, сравнить подразделения и открыть карточку на оргкарте.\n\nВ настройках — архитектура (Plan-and-Execute / ReAct), **RAG** и подключение LLM. Полный кабинет: чип **Администратор**.",
        },
    ]);
    const [aiLoading, setAiLoading] = useState(false);
    const [agentStatus, setAgentStatus] = useState("Онлайн · SAP ERP HCM");
    const [filterDeptId, setFilterDeptId] = useState(null);
    const [filterLevel, setFilterLevel] = useState("all");
    const [voiceListening, setVoiceListening] = useState(false);
    useEffect(() => {
        const sync = () => {
            const ag = window.OrgAdminAgent;
            if (ag && typeof ag.setLiveOrg === "function") {
                ag.setLiveOrg(orgData);
            }
            if (ag && ag.statusLabel)
                setAgentStatus(ag.statusLabel());
        };
        sync();
        window.addEventListener("org-admin-agent-ready", sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener("org-admin-agent-ready", sync);
            window.removeEventListener("storage", sync);
        };
    }, [orgData]);
    const revealEmployee = useCallback((emp) => {
        if (!emp)
            return;
        setFilterDeptId(emp.orgUnitId && String(emp.orgUnitId).startsWith("org-") ? (emp.orgUnitId === "org-001" ? null : emp.orgUnitId) : null);
        // Не сбрасываем на «все» — пирамида ветки, а не 1000 карточек в ряд
        setFilterLevel("all");
        setSelectedEmployee(emp);
    }, []);
    const sendMessage = useCallback(async (text) => {
        const lower = text.toLowerCase().replace(/ё/g, "е").trim();
        const searchTriggers = ["найди", "покажи", "открой", "найти", "кто такой", "кто такая", "где", "карточку", "профиль"];
        const isSearch = searchTriggers.some((t) => lower.startsWith(t) || lower.includes(" " + t + " ")) ||
            /^(петров|сидоров|иванов|смирнов)/i.test(lower);
        const isIneff = /неэффект|не эффект|низк|производител|мертв|риск|проблем|выяв|плох|слабые|аутсайдер|кто тянет|отстающ|отстают/.test(lower);
        setMessages((m) => [...m, { role: "user", text }]);
        setAiLoading(true);

        // Фокус на карте (UI) — как раньше
        if (isSearch) {
            const namePart = text.replace(/^(найди|покажи|открой|найти|кто такой|кто такая|где|карточку|профиль)\s*/i, "").trim() || text;
            const found = searchEmployees(orgData, namePart.length >= 2 ? namePart : text);
            if (found.length) {
                let pick = found[0];
                const wantFemalePetrova = /петрова\s+[а-яё]/i.test(lower);
                const demoHit = found.find((e) => String(e.id || "").startsWith("emp-demo") &&
                    (wantFemalePetrova ? /^Петрова\s/.test(e.fullName) : /^Петров\s/.test(e.fullName)));
                if (demoHit)
                    pick = demoHit;
                else if (wantFemalePetrova) {
                    const female = found.find((e) => /^Петрова\s/.test(e.fullName));
                    if (female)
                        pick = female;
                }
                else if (/петров/i.test(lower)) {
                    const male = found.find((e) => /^Петров\s/.test(e.fullName));
                    if (male)
                        pick = male;
                }
                revealEmployee(pick);
            }
        }
        else if (isIneff) {
            const active = orgData.employees.filter((e) => e.employmentStatus === "active");
            const lowPerf = active
                .filter((e) => e.kpi.performanceScore < 45)
                .sort((a, b) => a.kpi.performanceScore - b.kpi.performanceScore);
            const demoLow = lowPerf.find((e) => String(e.id || "").startsWith("emp-demo")) || lowPerf[0];
            if (demoLow)
                revealEmployee(demoLow);
        }
        else {
            const softFound = searchEmployees(orgData, text);
            if (softFound.length && extractSearchTokens(text).some((t) => t.length >= 5) && softFound.length <= 8) {
                const looksName = softFound[0].fullName.toLowerCase().split(/\s+/).some((p) => lower.includes(normalizeNameToken(p)) || lower.includes(p));
                if (looksName)
                    revealEmployee(softFound[0]);
            }
        }

        // RAG / Plan-and-Execute / ReAct через кабинет администратора
        const agent = window.OrgAdminAgent;
        if (agent && agent.ready && typeof agent.run === "function") {
            try {
                if (agent.statusLabel)
                    setAgentStatus(agent.statusLabel());
                const result = await agent.run(text);
                if (result.focusEmployee && result.focusEmployee.fullName) {
                    const mapHit = searchEmployees(orgData, result.focusEmployee.fullName);
                    if (mapHit[0])
                        revealEmployee(mapHit[0]);
                }
                let answer = result.answer || "Пустой ответ агента.";
                if (result.meta) {
                    const bits = [result.meta.architecture, result.meta.provider, result.meta.ragSources?.length ? `RAG ×${result.meta.ragSources.length}` : null].filter(Boolean);
                    if (bits.length)
                        answer += `\n\n_${bits.join(" · ")}_`;
                }
                setMessages((m) => [...m, { role: "assistant", text: answer }]);
                setAiLoading(false);
                return;
            }
            catch (err) {
                console.warn("OrgAdminAgent failed, fallback", err);
            }
        }

        await new Promise((r) => setTimeout(r, 450 + Math.random() * 700));
        if (isSearch) {
            const namePart = text.replace(/^(найди|покажи|открой|найти|кто такой|кто такая|где|карточку|профиль)\s*/i, "").trim() || text;
            const found = searchEmployees(orgData, namePart.length >= 2 ? namePart : text);
            if (found.length === 1) {
                setMessages((m) => [...m, { role: "assistant", text: `Нашёл и открыл на оргкарте:\n\n${empSummary(found[0])}\n\n**Вердикт:** ${getVerdict(found[0])}\n\n*Карточка и KPI — в панели справа*` }]);
                setAiLoading(false);
                return;
            }
            if (found.length > 1) {
                const pick = found[0];
                const list = found.slice(0, 5).map((e, i) => `${i + 1}. **${e.fullName}** — KPI ${e.kpi.performanceScore}, ${e.position}`).join("\n");
                setMessages((m) => [...m, { role: "assistant", text: `Нашёл **${found.length}** совпадений. Перенёс карту на **${pick.fullName}**.\n\n${list}\n\n${empSummary(pick)}\n\n**Вердикт:** ${getVerdict(pick)}` }]);
                setAiLoading(false);
                return;
            }
            setMessages((m) => [...m, { role: "assistant", text: `Не нашёл сотрудника по запросу «${namePart}».` }]);
            setAiLoading(false);
            return;
        }
        const reply = generateAIResponse(text, orgData);
        setMessages((m) => [...m, { role: "assistant", text: reply }]);
        setAiLoading(false);
    }, [orgData, revealEmployee]);
    const value = useMemo(() => ({
        orgData,
        selectedEmployee,
        selectEmployee: setSelectedEmployee,
        revealEmployee,
        messages,
        aiLoading,
        sendMessage,
        clearMessages: () => setMessages([
            {
                role: "assistant",
                text: "**Готов помочь.** Найду сотрудника, покажу неэффективные зоны или разберу подразделение. Например: «Найди Петрова» или «Кто неэффективен?»",
            },
        ]),
        filterDeptId,
        setFilterDeptId,
        filterLevel,
        setFilterLevel,
        aiProvider: "local",
        setAIProvider: () => { },
        voiceListening,
        setVoiceListening,
        agentStatus,
        refreshAgentStatus: () => {
            const ag = window.OrgAdminAgent;
            if (ag && ag.statusLabel)
                setAgentStatus(ag.statusLabel());
        },
    }), [orgData, selectedEmployee, messages, aiLoading, sendMessage, revealEmployee, filterDeptId, filterLevel, voiceListening, agentStatus]);
    return React.createElement(OrgContext.Provider, { value: value }, children);
}


// --- src/preview/BootErrorBoundary.tsx ---
class BootErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return (React.createElement("pre", { style: { padding: 24, color: "#ffb4a8", fontFamily: "monospace", whiteSpace: "pre-wrap" } }, this.state.error.stack || String(this.state.error)));
        }
        return this.props.children;
    }
}


// --- src/lib/ds-tokens.ts ---
/** SB UI Kit — токены из STYLE-GUIDE.md */
const S = {
    primary: "#008f95",
    primaryHover: "#007a85",
    primaryPressed: "#006b74",
    primaryLight: "rgba(0,143,149,0.08)",
    success: "#1f8f53",
    successBg: "rgba(222, 245, 232, 0.72)",
    warning: "#e2a326",
    warningBg: "rgba(251, 240, 212, 0.72)",
    danger: "#c53b3b",
    dangerBg: "rgba(247, 222, 222, 0.72)",
    dangerText: "#8b2a2a",
    accentOrange: "#e67e22",
    shell: "#0b2a30",
    shellText: "#cfdee1",
    shellTextMuted: "#8ba0a6",
    white: "#ffffff",
    /** @deprecated use primary */
    dnk: "#008f95",
    /** @deprecated use primary */
    mint: "#008f95",
    /** @deprecated use danger */
    accent: "#c53b3b",
    /** @deprecated use shell */
    dark: "#0b2a30",
};
const glassBackdrop = "blur(8px) saturate(1.05)";
const themeTokens = {
    light: {
        bg: "#eef2f4",
        flowBg: "#eef2f4",
        flowDot: "rgba(0,143,149,0.06)",
        glassBackdrop,
        shellBg: "#0b2a30",
        shellBorder: "rgba(255,255,255,0.08)",
        headerBg: "#0b2a30",
        headerBorder: "rgba(255,255,255,0.08)",
        headerText: "#cfdee1",
        headerTextSecondary: "#8ba0a6",
        panelBg: "#0b2a30",
        panelBorder: "rgba(255,255,255,0.08)",
        panelText: "#cfdee1",
        panelTextSecondary: "#8ba0a6",
        panelCardBg: "rgba(255,255,255,0.06)",
        panelCardBorder: "rgba(255,255,255,0.08)",
        surfaceBg: "rgba(255, 255, 255, 0.36)",
        surfaceBorder: "rgba(215, 222, 225, 0.5)",
        text: "#123a45",
        textSecondary: "#41636a",
        textAccent: "#008f95",
        cardBg: "rgba(255, 255, 255, 0.32)",
        cardBorder: "rgba(215, 222, 225, 0.55)",
        dangerBg: "rgba(247, 222, 222, 0.55)",
        dangerBorder: "rgba(197,59,59,0.35)",
        dangerText: "#8b2a2a",
        inputBg: "rgba(255, 255, 255, 0.38)",
        inputBorder: "rgba(215, 222, 225, 0.6)",
        chatUserBg: "rgba(0, 143, 149, 0.88)",
        chatAssistantBg: "rgba(255, 255, 255, 0.3)",
        chatAssistantBorder: "rgba(215, 222, 225, 0.5)",
        separatorColor: "rgba(215, 222, 225, 0.45)",
        nodeBg: "rgba(255, 255, 255, 0.38)",
        nodeBorder: "rgba(215, 222, 225, 0.6)",
        nodeShadow: "0 8px 24px rgba(24,34,40,0.08)",
        minimapBg: "rgba(255,255,255,0.75)",
        minimapBorder: "#d7dee1",
        minimapMask: "rgba(242,247,246,0.6)",
        aiHeaderBg: "rgba(255, 255, 255, 0.62)",
        aiPanelBg: "rgba(255, 255, 255, 0.78)",
        quickActionBg: "rgba(0,143,149,0.1)",
        quickActionBorder: "rgba(0,143,149,0.22)",
        quickActionText: "#008f95",
        radiusSm: 6,
        radiusMd: 10,
        radiusLg: 14,
        shadowCard: "0 8px 20px rgba(24,34,40,0.07)",
        shadowHover: "0 12px 28px rgba(24,34,40,0.12)",
        shadowLg: "0 16px 40px rgba(24,34,40,0.12)",
        bentoPad: 12,
        bentoGap: 10,
        bentoRadius: 20,
        bentoCellRadius: 14,
        bentoPanelBg: "#0b2a30",
        bentoBorder: "rgba(255,255,255,0.1)",
        bentoShadow: "0 12px 40px rgba(11,42,48,0.18), 0 2px 8px rgba(11,42,48,0.08)",
        bentoCellBg: "rgba(255,255,255,0.07)",
        bentoCellBorder: "rgba(255,255,255,0.1)",
        bentoSelectBg: "#1a3c44",
        bentoSelectOptionBg: "#132f36",
        bentoSelectText: "#cfdee1",
    },
    dark: {
        bg: "#0b2a30",
        flowBg: "#132f36",
        flowDot: "rgba(0,143,149,0.1)",
        glassBackdrop,
        shellBg: "#0b2a30",
        shellBorder: "#1f4b55",
        headerBg: "#0b2a30",
        headerBorder: "#1f4b55",
        headerText: "#cfdee1",
        headerTextSecondary: "#8ba0a6",
        panelBg: "#0b2a30",
        panelBorder: "#1f4b55",
        panelText: "#cfdee1",
        panelTextSecondary: "#8ba0a6",
        panelCardBg: "#1a3c44",
        panelCardBorder: "#1f4b55",
        surfaceBg: "rgba(19, 47, 54, 0.42)",
        surfaceBorder: "rgba(31, 75, 85, 0.45)",
        text: "#cfdee1",
        textSecondary: "#8ba0a6",
        textAccent: "#008f95",
        cardBg: "rgba(26, 60, 68, 0.38)",
        cardBorder: "rgba(31, 75, 85, 0.45)",
        dangerBg: "rgba(197,59,59,0.18)",
        dangerBorder: "rgba(197,59,59,0.35)",
        dangerText: "#f7dede",
        inputBg: "rgba(26, 60, 68, 0.4)",
        inputBorder: "rgba(31, 75, 85, 0.45)",
        chatUserBg: "rgba(0, 143, 149, 0.88)",
        chatAssistantBg: "rgba(26, 60, 68, 0.32)",
        chatAssistantBorder: "rgba(31, 75, 85, 0.45)",
        separatorColor: "rgba(31, 75, 85, 0.4)",
        nodeBg: "rgba(19, 47, 54, 0.4)",
        nodeBorder: "rgba(31, 75, 85, 0.45)",
        nodeShadow: "0 8px 24px rgba(0,0,0,0.28)",
        minimapBg: "rgba(11,42,48,0.75)",
        minimapBorder: "#1f4b55",
        minimapMask: "rgba(11,42,48,0.6)",
        aiHeaderBg: "rgba(26, 60, 68, 0.72)",
        aiPanelBg: "rgba(19, 47, 54, 0.85)",
        quickActionBg: "rgba(0,143,149,0.14)",
        quickActionBorder: "rgba(0,143,149,0.28)",
        quickActionText: "#008f95",
        radiusSm: 6,
        radiusMd: 10,
        radiusLg: 14,
        shadowCard: "0 8px 20px rgba(0,0,0,0.28)",
        shadowHover: "0 12px 28px rgba(0,0,0,0.38)",
        shadowLg: "0 16px 40px rgba(0,0,0,0.42)",
        bentoPad: 12,
        bentoGap: 10,
        bentoRadius: 20,
        bentoCellRadius: 14,
        bentoPanelBg: "#0f3239",
        bentoBorder: "rgba(255,255,255,0.08)",
        bentoShadow: "0 16px 48px rgba(0,0,0,0.45), 0 2px 12px rgba(0,0,0,0.25)",
        bentoCellBg: "rgba(255,255,255,0.05)",
        bentoCellBorder: "rgba(255,255,255,0.08)",
        bentoSelectBg: "#1a3c44",
        bentoSelectOptionBg: "#132f36",
        bentoSelectText: "#cfdee1",
    },
};
/** inline glass для React style */
function glass(t) {
    return { backdropFilter: t.glassBackdrop, WebkitBackdropFilter: t.glassBackdrop };
}


// --- src/lib/use-theme.ts ---
function useTheme() {
    const [theme, setThemeState] = useState("light");
    useEffect(() => {
        const saved = localStorage.getItem("ds-theme");
        if (saved === "dark" || saved === "light") {
            setThemeState(saved);
        }
        document.documentElement.dataset.theme = saved === "dark" ? "dark" : "light";
    }, []);
    const setTheme = useCallback((t) => {
        setThemeState(t);
        localStorage.setItem("ds-theme", t);
        document.documentElement.dataset.theme = t;
    }, []);
    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            localStorage.setItem("ds-theme", next);
            document.documentElement.dataset.theme = next;
            return next;
        });
    }, []);
    return { theme, setTheme, toggleTheme };
}


// --- src/lib/org-graph.ts ---
const NODE_W = 190;
const NODE_H = 108;
const ENT_W = 210;
const ENT_H = 88;
/** Вертикальный шаг пирамиды: родитель выше, дети строго ниже */
const LAYOUT_GAP_Y = 196;
const SIB_GAP = 36;
/** Если прямых подчинённых много — раскладка сеткой вниз, а не одной бесконечной полосой */
const MAX_KIDS_PER_ROW = 7;
const APEX_ID = "emp-001";
function entNodeId(orgId) {
    return `ent-${orgId}`;
}
function nodeDims(node) {
    return node.kind === "enterprise" ? { w: ENT_W, h: ENT_H } : { w: NODE_W, h: NODE_H };
}
function roleRank(item) {
    if (item.kind === "enterprise")
        return 0;
    const p = (item.employee?.position || "").toLowerCase();
    if (p.includes("генеральный директор") && !p.includes("предприятия"))
        return 0;
    if (p.includes("генеральный директор предприятия"))
        return 1;
    if (p.includes("директор"))
        return 2;
    if (p.includes("руководитель направления") || p.includes("руководитель продукта") || p.includes("директор группы"))
        return 3;
    if (p.includes("руководитель функции"))
        return 4;
    return 5;
}
function isDescendantOf(emp, ancestorId, allEmployees) {
    const byId = new Map(allEmployees.map((e) => [e.id, e]));
    let cur = emp;
    while (cur?.managerId) {
        if (cur.managerId === ancestorId)
            return true;
        cur = byId.get(cur.managerId);
    }
    return false;
}
function buildGraph(orgData, filterDeptId, filterLevel) {
    let employees = [...orgData.employees];
    const enterprises = orgData.orgUnits.filter((u) => u.parentId === "org-001");
    if (filterDeptId) {
        const childUnitIds = new Set(orgData.orgUnits.filter((u) => u.parentId === filterDeptId).map((u) => u.id));
        const entMatch = enterprises.some((e) => e.id === filterDeptId);
        employees = employees.filter((e) => {
            if (e.orgUnitId === filterDeptId || childUnitIds.has(e.orgUnitId))
                return true;
            if (entMatch) {
                const gm = orgData.employees.find((x) => x.orgUnitId === filterDeptId && x.position === "Генеральный директор предприятия");
                if (gm && (e.id === gm.id || isDescendantOf(e, gm.id, orgData.employees)))
                    return true;
            }
            return false;
        });
    }
    const empIds = new Set(employees.map((e) => e.id));
    const items = employees.map((e) => ({
        id: e.id,
        parentId: e.managerId,
        kind: "employee",
        employee: e,
    }));
    for (const ent of enterprises) {
        const gm = orgData.employees.find((e) => e.orgUnitId === ent.id && e.position === "Генеральный директор предприятия");
        if (gm && empIds.has(gm.id)) {
            const eid = entNodeId(ent.id);
            if (!items.some((i) => i.id === eid)) {
                items.push({ id: eid, parentId: APEX_ID, kind: "enterprise", enterprise: ent });
            }
            // ГД предприятия висит под карточкой предприятия → пирамида: CEO → предприятие → ГД → …
            const gmItem = items.find((i) => i.id === gm.id);
            if (gmItem)
                gmItem.parentId = eid;
        }
    }
    const itemsById = new Map(items.map((i) => [i.id, i]));
    const getDepth = (id) => {
        let depth = 0;
        let cur = itemsById.get(id);
        const seen = new Set();
        while (cur?.parentId) {
            if (seen.has(cur.id))
                break;
            seen.add(cur.id);
            depth++;
            cur = itemsById.get(cur.parentId);
            if (!cur)
                break;
        }
        return depth;
    };
    let visible = items;
    if (filterLevel === "enterprises")
        visible = items.filter((i) => getDepth(i.id) <= 2);
    else if (filterLevel === "directors")
        visible = items.filter((i) => getDepth(i.id) <= 3);
    else if (filterLevel === "managers")
        visible = items.filter((i) => getDepth(i.id) <= 4);
    else if (filterLevel === "functions")
        visible = items.filter((i) => getDepth(i.id) <= 5);
    const visibleIds = new Set(visible.map((i) => i.id));
    // Сироты и оборванные связи → под вершину (CEO), чтобы не было горизонтального «леса корней»
    for (const item of visible) {
        if (item.id === APEX_ID) {
            item.parentId = null;
            continue;
        }
        if (!item.parentId || !visibleIds.has(item.parentId)) {
            let climb = itemsById.get(item.id);
            let resolved = null;
            const seen = new Set();
            while (climb?.parentId && !seen.has(climb.id)) {
                seen.add(climb.id);
                if (visibleIds.has(climb.parentId)) {
                    resolved = climb.parentId;
                    break;
                }
                climb = itemsById.get(climb.parentId);
            }
            item.parentId = resolved || (visibleIds.has(APEX_ID) ? APEX_ID : null);
        }
    }
    const childrenMap = new Map();
    for (const item of visible) {
        const pid = item.parentId && visibleIds.has(item.parentId) ? item.parentId : "__root__";
        if (!childrenMap.has(pid))
            childrenMap.set(pid, []);
        childrenMap.get(pid).push(item);
    }
    for (const [, kids] of childrenMap) {
        kids.sort((a, b) => roleRank(a) - roleRank(b) || String(a.employee?.fullName || a.enterprise?.name || "").localeCompare(String(b.employee?.fullName || b.enterprise?.name || ""), "ru"));
    }
    const subtreeWidth = new Map();
    /** Сетка вниз только если все дети — листья (иначе пирамида «плывёт» по Y) */
    function packAsGrid(kids) {
        return kids.length > MAX_KIDS_PER_ROW && kids.every((c) => !(childrenMap.get(c.id) || []).length);
    }
    function calcWidth(id) {
        if (subtreeWidth.has(id))
            return subtreeWidth.get(id);
        const item = itemsById.get(id);
        const selfW = item ? nodeDims(item).w : NODE_W;
        const kids = childrenMap.get(id) || [];
        if (!kids.length) {
            subtreeWidth.set(id, selfW);
            return selfW;
        }
        kids.forEach((c) => calcWidth(c.id));
        let w;
        if (packAsGrid(kids)) {
            const rows = [];
            for (let i = 0; i < kids.length; i += MAX_KIDS_PER_ROW)
                rows.push(kids.slice(i, i + MAX_KIDS_PER_ROW));
            w = Math.max(selfW, ...rows.map((row) => row.reduce((s, c) => s + subtreeWidth.get(c.id), 0) + (row.length - 1) * SIB_GAP));
        }
        else {
            w = Math.max(selfW, kids.reduce((s, c) => s + subtreeWidth.get(c.id), 0) + (kids.length - 1) * SIB_GAP);
        }
        subtreeWidth.set(id, w);
        return w;
    }
    const positionMap = new Map();
    function layout(id, x, y) {
        const item = itemsById.get(id);
        const dims = item ? nodeDims(item) : { w: NODE_W, h: NODE_H };
        positionMap.set(id, { x: x - dims.w / 2, y });
        const kids = childrenMap.get(id) || [];
        if (!kids.length)
            return;
        if (packAsGrid(kids)) {
            const rows = [];
            for (let i = 0; i < kids.length; i += MAX_KIDS_PER_ROW)
                rows.push(kids.slice(i, i + MAX_KIDS_PER_ROW));
            let rowY = y + LAYOUT_GAP_Y;
            rows.forEach((row) => {
                const rowW = row.reduce((s, c) => s + subtreeWidth.get(c.id), 0) + (row.length - 1) * SIB_GAP;
                let cx = x - rowW / 2;
                for (const c of row) {
                    const cw = subtreeWidth.get(c.id);
                    layout(c.id, cx + cw / 2, rowY);
                    cx += cw + SIB_GAP;
                }
                rowY += dims.h + 28;
            });
            return;
        }
        const totalW = kids.reduce((s, c) => s + subtreeWidth.get(c.id), 0) + (kids.length - 1) * SIB_GAP;
        let cx = x - totalW / 2;
        for (const c of kids) {
            const cw = subtreeWidth.get(c.id);
            layout(c.id, cx + cw / 2, y + LAYOUT_GAP_Y);
            cx += cw + SIB_GAP;
        }
    }
    // Одна вершина пирамиды: CEO, если есть; иначе единственный корень
    let rootKids = childrenMap.get("__root__") || [];
    if (visibleIds.has(APEX_ID)) {
        const apex = visible.find((i) => i.id === APEX_ID);
        const others = rootKids.filter((i) => i.id !== APEX_ID);
        if (apex && others.length) {
            for (const o of others) {
                o.parentId = APEX_ID;
                if (!childrenMap.has(APEX_ID))
                    childrenMap.set(APEX_ID, []);
                childrenMap.get(APEX_ID).push(o);
            }
            childrenMap.get(APEX_ID).sort((a, b) => roleRank(a) - roleRank(b));
            childrenMap.set("__root__", [apex]);
            rootKids = [apex];
            subtreeWidth.clear();
        }
    }
    if (rootKids.length) {
        rootKids.forEach((c) => calcWidth(c.id));
        const totalW = rootKids.reduce((s, c) => s + subtreeWidth.get(c.id), 0) + (rootKids.length - 1) * SIB_GAP;
        let cx = 0;
        const shiftX = 80;
        for (const c of rootKids) {
            const cw = subtreeWidth.get(c.id);
            layout(c.id, shiftX + cx + cw / 2, 48);
            cx += cw + SIB_GAP;
        }
    }
    const nodes = [];
    const edges = [];
    for (const item of visible) {
        const pos = positionMap.get(item.id) || { x: 0, y: 48 };
        if (item.kind === "enterprise") {
            nodes.push({ id: item.id, kind: "enterprise", enterprise: item.enterprise, x: pos.x, y: pos.y });
        }
        else {
            nodes.push({ id: item.id, kind: "employee", employee: item.employee, x: pos.x, y: pos.y });
        }
        if (item.parentId && visibleIds.has(item.parentId)) {
            const emp = item.kind === "employee" ? item.employee : null;
            const isLow = emp && emp.kpi.performanceScore < 45 && emp.employmentStatus === "active";
            const isWarning = emp && emp.kpi.performanceScore >= 45 && emp.kpi.performanceScore < 60 && emp.employmentStatus === "active";
            edges.push({
                id: `e-${item.parentId}-${item.id}`,
                source: item.parentId,
                target: item.id,
                color: item.kind === "enterprise" ? S.primary : isLow ? S.danger : isWarning ? S.warning : "rgba(0,143,149,0.45)",
                width: item.kind === "enterprise" ? 2 : isLow ? 2.5 : 1.5,
            });
        }
    }
    return { nodes, edges };
}
function getDescendantIds(rootId, edges) {
    const childrenMap = new Map();
    for (const e of edges) {
        if (!childrenMap.has(e.source))
            childrenMap.set(e.source, []);
        childrenMap.get(e.source).push(e.target);
    }
    const result = new Set();
    const queue = [...(childrenMap.get(rootId) || [])];
    while (queue.length) {
        const id = queue.shift();
        if (result.has(id))
            continue;
        result.add(id);
        queue.push(...(childrenMap.get(id) || []));
    }
    return result;
}
function smoothEdge(x1, y1, x2, y2) {
    const mid = (y1 + y2) / 2;
    return `M ${x1} ${y1} L ${x1} ${mid} L ${x2} ${mid} L ${x2} ${y2}`;
}


// --- src/lib/bento.ts ---
/** Bento — модульные «ячейки» с зазорами и скруглением */
function bentoPanel(t) {
    return {
        borderRadius: t.bentoRadius,
        background: t.bentoPanelBg,
        border: `1px solid ${t.bentoBorder}`,
        boxShadow: t.bentoShadow,
        overflow: "hidden",
    };
}
function bentoCell(t, extra) {
    return {
        borderRadius: t.bentoCellRadius,
        background: t.bentoCellBg,
        border: `1px solid ${t.bentoCellBorder}`,
        ...extra,
    };
}
function bentoInset(extra) {
    return {
        padding: 12,
        boxSizing: "border-box",
        ...extra,
    };
}
function bentoStack(gap = 10) {
    return { display: "flex", flexDirection: "column", gap };
}
function bentoGrid(cols = 2, gap = 10) {
    return { display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap };
}
function bentoCanvasFrame(t) {
    return {
        ...bentoPanel(t),
        background: t.flowBg,
        borderColor: t.bentoBorder,
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
    };
}


// --- src/components/org-chart/EmployeeCard.tsx ---
function EmployeeCard({ employee, theme, selected, onClick, }) {
    const t = themeTokens[theme];
    const isDeadwood = employee.kpi.performanceScore < 45 && employee.employmentStatus === "active";
    const isWarning = employee.kpi.performanceScore >= 45 && employee.kpi.performanceScore < 60;
    const isSuspended = employee.employmentStatus === "suspended";
    const isGm = employee.position === "Генеральный директор предприятия";
    const isFuncHead = employee.position === "Руководитель функции";
    const isProductHead = employee.position === "Руководитель продукта";
    const isGroupDir = employee.position === "Директор группы";
    const isTop = !employee.managerId;
    const bg = isSuspended
        ? t.cardBg
        : isDeadwood
            ? S.dangerBg
            : isWarning
                ? S.warningBg
                : isTop || isGm
                    ? "rgba(0,143,149,0.12)"
                    : t.nodeBg;
    const border = selected
        ? S.primary
        : isSuspended
            ? t.nodeBorder
            : isDeadwood
                ? S.danger
                : isWarning
                    ? S.warning
                    : isTop || isGm
                        ? S.primary
                        : t.nodeBorder;
    const initials = employee.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);
    return (React.createElement("div", { onClick: (e) => {
            e.stopPropagation();
            onClick();
        }, style: {
            width: NODE_W,
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: t.radiusMd,
            padding: "10px 12px",
            cursor: "grab",
            color: t.text,
            boxShadow: selected ? `0 0 0 3px rgba(0,143,149,0.25), ${t.nodeShadow}` : t.nodeShadow,
            userSelect: "none",
            transition: "box-shadow 0.15s ease",
            ...glass(t),
        } },
        isGm && (React.createElement("div", { style: { fontSize: 11, color: S.primary, fontWeight: 600, marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" } }, "\u0413\u0435\u043D. \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440")),
        isGroupDir && (React.createElement("div", { style: { fontSize: 11, color: S.primary, fontWeight: 600, marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" } }, "\u0414\u0438\u0440\u0435\u043A\u0442\u043E\u0440 \u0433\u0440\u0443\u043F\u043F\u044B")),
        isProductHead && (React.createElement("div", { style: { fontSize: 11, color: t.textAccent, fontWeight: 600, marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" } }, "\u041F\u0440\u043E\u0434\u0443\u043A\u0442")),
        isFuncHead && (React.createElement("div", { style: { fontSize: 11, color: t.textAccent, fontWeight: 600, marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" } }, "\u0420\u0443\u043A. \u0444\u0443\u043D\u043A\u0446\u0438\u0438")),
        React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 6 } },
            React.createElement("div", { style: {
                    width: 32,
                    height: 32,
                    borderRadius: t.radiusSm,
                    background: isDeadwood ? S.danger : isWarning ? S.warning : S.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                } }, initials),
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement("div", { style: { fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, formatShortName(employee.fullName)),
                React.createElement("div", { style: { fontSize: 10, opacity: 0.6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, isProductHead || isFuncHead ? employee.department.split(" · ").pop() : employee.position))),
        React.createElement("div", { style: { display: "flex", gap: 8, fontSize: 10, borderTop: `1px solid ${t.separatorColor}`, paddingTop: 6 } },
            React.createElement("span", { style: { fontWeight: 600, color: isDeadwood ? S.danger : isWarning ? S.warning : S.primary } }, employee.kpi.performanceScore),
            isDeadwood && (React.createElement("span", { style: { marginLeft: "auto", background: S.danger, color: "#fff", padding: "1px 8px", borderRadius: 4, fontWeight: 700, fontSize: 10 } }, "!")))));
}


// --- src/components/org-chart/EnterpriseCard.tsx ---
function EnterpriseCard({ enterprise, theme, selected, onClick, }) {
    const t = themeTokens[theme];
    return (React.createElement("div", { onClick: (e) => {
            e.stopPropagation();
            onClick();
        }, style: {
            width: ENT_W,
            background: "rgba(0,143,149,0.12)",
            border: `1px solid ${selected ? S.primary : t.nodeBorder}`,
            borderRadius: t.radiusMd,
            padding: "12px 14px",
            cursor: "grab",
            color: t.text,
            boxShadow: selected ? `0 0 0 3px rgba(0,143,149,0.25), ${t.nodeShadow}` : t.nodeShadow,
            userSelect: "none",
            textAlign: "center",
            transition: "box-shadow 0.15s ease",
            ...glass(t),
        } },
        React.createElement("div", { style: { fontSize: 11, color: S.primary, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" } }, "\u041F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u0435"),
        React.createElement("div", { style: { fontSize: 14, fontWeight: 700, lineHeight: 1.25, marginBottom: 4 } }, enterprise.name),
        enterprise.city && React.createElement("div", { style: { fontSize: 10, color: t.textSecondary } }, enterprise.city),
        enterprise.budget ? (React.createElement("div", { style: { fontSize: 10, color: t.textAccent, marginTop: 6, borderTop: `1px solid ${t.separatorColor}`, paddingTop: 6 } },
            (enterprise.budget / 1e6).toFixed(0),
            "M \u20BD")) : null));
}


// --- src/components/org-chart/OrgChartCanvas.tsx ---
const ORG_LAYOUT_KEY = "org-chart-layout-v2";
const orgLayoutApi = { save: null };
function readSavedLayout() {
    try {
        const raw = localStorage.getItem(ORG_LAYOUT_KEY);
        if (!raw)
            return null;
        const data = JSON.parse(raw);
        if (!data || !data.positions || data.sig !== ORG_STRUCTURE_SIG)
            return null;
        return data.positions;
    }
    catch (e) {
        return null;
    }
}
function positionsFromGraph(nodes, saved) {
    const map = new Map();
    for (const n of nodes) {
        const s = saved && saved[n.id];
        if (s && Number.isFinite(s.x) && Number.isFinite(s.y))
            map.set(n.id, { x: s.x, y: s.y });
        else
            map.set(n.id, { x: n.x, y: n.y });
    }
    return map;
}
function OrgChartCanvas({ graph, theme, selectEmployee, selectedEmployeeId, selectedEnterpriseId, orgData, }) {
    const t = themeTokens[theme];
    const containerRef = useRef(null);
    const [positions, setPositions] = useState(() => positionsFromGraph(graph.nodes, readSavedLayout()));
    const [transform, setTransform] = useState({ x: 60, y: 20, scale: 0.75 });
    const [interacting, setInteracting] = useState(null);
    const [layoutNote, setLayoutNote] = useState("");
    const dragRef = useRef(null);
    const panRef = useRef(null);
    /** После реального драга глушим click → иначе selectEmployee дёргает камеру */
    const suppressClickRef = useRef(false);
    useEffect(() => {
        setPositions(positionsFromGraph(graph.nodes, readSavedLayout()));
    }, [graph]);
    const nodesById = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph.nodes]);
    const fitView = useCallback(() => {
        const el = containerRef.current;
        if (!el || !graph.nodes.length)
            return;
        const { clientWidth, clientHeight } = el;
        if (clientWidth < 20 || clientHeight < 20)
            return;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const n of graph.nodes) {
            const p = positionsRef.current.get(n.id) ?? { x: n.x, y: n.y };
            const { w, h } = nodeDims(n);
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x + w);
            maxY = Math.max(maxY, p.y + h);
        }
        const bw = maxX - minX + 80;
        const bh = maxY - minY + 80;
        // Пирамида: не сжимаем в «горизонтальную нитку» — опираемся на высоту, мин. масштаб ~0.55
        const scaleH = (clientHeight / Math.max(bh, 1)) * 0.88;
        const scaleW = (clientWidth / Math.max(bw, 1)) * 0.92;
        const scale = Math.min(1.4, Math.max(0.08, Math.min(scaleH, scaleW)));
        const treeCx = (minX + maxX) / 2;
        setTransform({
            x: clientWidth / 2 - treeCx * scale,
            y: Math.max(20, (clientHeight - bh * scale) / 2 - minY * scale + 10),
            scale,
        });
    }, [graph]);
    useEffect(() => {
        fitView();
    }, [fitView]);
    useEffect(() => {
        const el = containerRef.current;
        if (!el || (el.clientWidth >= 20 && el.clientHeight >= 20))
            return;
        const ro = new ResizeObserver(() => {
            if (el.clientWidth >= 20 && el.clientHeight >= 20)
                fitView();
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [fitView]);
    // Перенос карты на выбранного сотрудника (из AI / клика)
    const focusSeq = useRef(0);
    const positionsRef = useRef(positions);
    positionsRef.current = positions;
    useEffect(() => {
        orgLayoutApi.save = () => {
            const positionsObj = {};
            positionsRef.current.forEach((p, id) => {
                positionsObj[id] = { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 };
            });
            localStorage.setItem(ORG_LAYOUT_KEY, JSON.stringify({
                sig: ORG_STRUCTURE_SIG,
                positions: positionsObj,
                savedAt: Date.now(),
            }));
            setLayoutNote("Раскладка сохранена");
            window.setTimeout(() => setLayoutNote(""), 1800);
        };
        return () => {
            orgLayoutApi.save = null;
        };
    }, []);
    useEffect(() => {
        if (!selectedEmployeeId)
            return;
        const el = containerRef.current;
        if (!el || el.clientWidth < 20)
            return;
        const node = graph.nodes.find((n) => n.id === selectedEmployeeId ||
            (n.kind === "employee" && n.employee && n.employee.id === selectedEmployeeId));
        if (!node)
            return;
        const seq = ++focusSeq.current;
        const run = () => {
            if (focusSeq.current !== seq)
                return;
            const pos = positionsRef.current.get(node.id) ?? { x: node.x, y: node.y };
            const { w, h } = nodeDims(node);
            const targetScale = 0.95;
            const cx = pos.x + w / 2;
            const cy = pos.y + h / 2;
            setTransform({
                scale: targetScale,
                x: el.clientWidth / 2 - cx * targetScale,
                y: Math.max(24, el.clientHeight * 0.38 - cy * targetScale),
            });
        };
        // после сброса фильтров граф/позиции обновляются кадром позже
        const t0 = requestAnimationFrame(() => {
            run();
            setTimeout(run, 120);
        });
        return () => cancelAnimationFrame(t0);
    }, [selectedEmployeeId, graph.nodes]);
    const toWorld = useCallback((clientX, clientY) => {
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: (clientX - rect.left - transform.x) / transform.scale,
            y: (clientY - rect.top - transform.y) / transform.scale,
        };
    }, [transform]);
    const endInteraction = useCallback(() => {
        dragRef.current = null;
        panRef.current = null;
        setInteracting(null);
    }, []);
    const onMouseMove = useCallback((e) => {
        const drag = dragRef.current;
        if (drag) {
            const { nodeId, ox, oy, start, descendantStarts } = drag;
            const world = toWorld(e.clientX, e.clientY);
            const nx = world.x - ox;
            const ny = world.y - oy;
            const dx = nx - start.x;
            const dy = ny - start.y;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3)
                suppressClickRef.current = true;
            setPositions((prev) => {
                const next = new Map(prev);
                next.set(nodeId, { x: nx, y: ny });
                for (const [id, sp] of descendantStarts) {
                    next.set(id, { x: sp.x + dx, y: sp.y + dy });
                }
                return next;
            });
            return;
        }
        const pan = panRef.current;
        if (pan) {
            if (Math.abs(e.clientX - pan.x) > 3 || Math.abs(e.clientY - pan.y) > 3)
                suppressClickRef.current = true;
            setTransform((tr) => ({ ...tr, x: pan.tx + (e.clientX - pan.x), y: pan.ty + (e.clientY - pan.y) }));
        }
    }, [toWorld]);
    useEffect(() => {
        if (!interacting)
            return;
        const onUp = () => endInteraction();
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onUp);
        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onUp);
        };
    }, [interacting, onMouseMove, endInteraction]);
    const handleNodeSelect = useCallback((employee) => {
        if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
        }
        if (employee)
            selectEmployee(employee);
    }, [selectEmployee]);
    const onMouseDown = (e) => {
        if (e.button !== 0)
            return;
        suppressClickRef.current = false;
        const nodeEl = e.target.closest("[data-node-id]");
        if (nodeEl) {
            const nodeId = nodeEl.dataset.nodeId;
            const pos = positions.get(nodeId);
            if (!pos)
                return;
            const world = toWorld(e.clientX, e.clientY);
            const descendantIds = getDescendantIds(nodeId, graph.edges);
            const descendantStarts = new Map();
            for (const id of descendantIds) {
                const p = positions.get(id);
                if (p)
                    descendantStarts.set(id, { ...p });
            }
            dragRef.current = { nodeId, ox: world.x - pos.x, oy: world.y - pos.y, start: { ...pos }, descendantStarts };
            setInteracting("drag");
            e.preventDefault();
            return;
        }
        panRef.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
        setInteracting("pan");
    };
    const onWheel = (e) => {
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        setTransform((tr) => {
            const scale = Math.min(5, Math.max(0.04, tr.scale * factor));
            const wx = (mx - tr.x) / tr.scale;
            const wy = (my - tr.y) / tr.scale;
            return { scale, x: mx - wx * scale, y: my - wy * scale };
        });
    };
    let canvasW = 4000, canvasH = 3000;
    for (const n of graph.nodes) {
        const p = positions.get(n.id) ?? { x: n.x, y: n.y };
        const { w, h } = nodeDims(n);
        canvasW = Math.max(canvasW, p.x + w + 200);
        canvasH = Math.max(canvasH, p.y + h + 200);
    }
    const dotBg = `radial-gradient(${t.flowDot} 1px, transparent 1px)`;
    return (React.createElement("div", { ref: containerRef, style: {
            flex: 1,
            minHeight: 0,
            width: "100%",
            overflow: "hidden",
            position: "relative",
            background: t.flowBg,
            cursor: interacting === "pan" || interacting === "drag" ? "grabbing" : "default",
        }, onMouseDown: onMouseDown, onMouseUp: endInteraction, onWheel: onWheel },
        layoutNote && React.createElement("div", { style: {
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 6,
                background: "#0b2a30",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 10,
                pointerEvents: "none",
            } }, layoutNote),
        React.createElement("div", { style: {
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: dotBg,
                backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
                backgroundPosition: `${transform.x}px ${transform.y}px`,
            } }),
        React.createElement("div", { style: {
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: "0 0",
                position: "absolute",
                top: 0,
                left: 0,
            } },
            React.createElement("svg", { width: canvasW, height: canvasH, style: { position: "absolute", top: 0, left: 0, pointerEvents: "none", overflow: "visible" } },
                React.createElement("defs", null,
                    React.createElement("marker", { id: "arrow", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" },
                        React.createElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "rgba(0,140,149,0.5)" }))),
                graph.edges.map((edge) => {
                    const sp = positions.get(edge.source);
                    const tp = positions.get(edge.target);
                    const src = nodesById.get(edge.source);
                    const tgt = nodesById.get(edge.target);
                    if (!sp || !tp || !src || !tgt)
                        return null;
                    const sd = nodeDims(src);
                    const td = nodeDims(tgt);
                    const x1 = sp.x + sd.w / 2;
                    const y1 = sp.y + sd.h;
                    const x2 = tp.x + td.w / 2;
                    const y2 = tp.y;
                    return (React.createElement("path", { key: edge.id, d: smoothEdge(x1, y1, x2, y2), stroke: edge.color, strokeWidth: edge.width, fill: "none", markerEnd: "url(#arrow)" }));
                })),
            graph.nodes.map((node) => {
                const p = positions.get(node.id) ?? { x: node.x, y: node.y };
                const isSelected = node.kind === "employee" ? selectedEmployeeId === node.id : selectedEnterpriseId === node.id;
                if (node.kind === "enterprise") {
                    const gm = orgData.employees.find((e) => e.orgUnitId === node.enterprise.id && e.position === "Генеральный директор предприятия");
                    return (React.createElement("div", { key: node.id, "data-node-id": node.id, style: { position: "absolute", left: p.x, top: p.y, zIndex: isSelected ? 2 : 1 } },
                        React.createElement(EnterpriseCard, { enterprise: node.enterprise, theme: theme, selected: isSelected, onClick: () => handleNodeSelect(gm) })));
                }
                return (React.createElement("div", { key: node.id, "data-node-id": node.id, style: { position: "absolute", left: p.x, top: p.y, zIndex: isSelected ? 2 : 1 } },
                    React.createElement(EmployeeCard, { employee: node.employee, theme: theme, selected: isSelected, onClick: () => handleNodeSelect(node.employee) })));
            })),
        React.createElement("div", { style: { position: "absolute", bottom: 16, left: 16, display: "flex", gap: 6, zIndex: 5 } }, [
            { label: "−", fn: () => setTransform((tr) => ({ ...tr, scale: Math.max(0.04, tr.scale * 0.85) })) },
            { label: "⊙", fn: () => fitView() },
            { label: "+", fn: () => setTransform((tr) => ({ ...tr, scale: Math.min(5, tr.scale * 1.15) })) },
        ].map((btn) => (React.createElement("button", { key: btn.label, onClick: btn.fn, style: {
                width: 32,
                height: 32,
                borderRadius: t.radiusSm,
                border: `1px solid ${t.surfaceBorder}`,
                background: t.surfaceBg,
                color: t.text,
                cursor: "pointer",
                fontSize: 16,
                boxShadow: t.shadowCard,
                ...glass(t),
            } }, btn.label))))));
}


// --- src/lib/analytics.ts ---
function getAnalytics(orgData) {
    const departments = orgData.orgUnits.filter((u) => u.parentId !== null);
    const deptStats = departments
        .map((d) => getDepartmentStats(orgData, d.id))
        .filter(Boolean);
    const allEmployees = orgData.employees.filter((e) => e.employmentStatus === "active");
    const allLow = allEmployees.filter((e) => e.kpi.performanceScore < 45);
    const potentialSavings = allLow.reduce((s, e) => s + e.salary, 0);
    return {
        departments: deptStats,
        summary: {
            totalEmployees: allEmployees.length,
            totalDepartments: departments.length,
            totalMonthlySalary: allEmployees.reduce((s, e) => s + e.salary, 0),
            lowPerformersCount: allLow.length,
            lowPerformersPercent: Math.round((allLow.length / allEmployees.length) * 100),
            potentialMonthlySavings: potentialSavings,
            potentialYearlySavings: potentialSavings * 12,
            averageKpi: Math.round(allEmployees.reduce((s, e) => s + e.kpi.performanceScore, 0) / allEmployees.length),
        },
    };
}


// --- src/preview/lucide-shim.tsx — SB design systems Icon Pack ---
function Icon({ size = 16, className, style, children }) {
    return (React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", className: className, style: style }, children));
}
function Send(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M5 12h14" }),
        React.createElement("path", { d: "m12 5 7 7-7 7" }));
}
function Mic(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" }),
        React.createElement("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
        React.createElement("line", { x1: "12", x2: "12", y1: "19", y2: "22" }));
}
function MicOff(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("line", { x1: "2", x2: "22", y1: "2", y2: "22" }),
        React.createElement("path", { d: "M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" }),
        React.createElement("path", { d: "M5 10v2a7 7 0 0 0 12 5" }),
        React.createElement("path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33" }),
        React.createElement("path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12" }),
        React.createElement("line", { x1: "12", x2: "12", y1: "19", y2: "22" }));
}
function Bot(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M12 8V4H8" }),
        React.createElement("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        React.createElement("path", { d: "M2 14h2M20 14h2M15 13v2M9 13v2" }));
}
function User(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
        React.createElement("circle", { cx: "12", cy: "7", r: "4" }));
}
function Loader2(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }));
}
function ChevronUp(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M18 15l-6-6-6 6" }));
}
function ChevronDown(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M6 9l6 6 6-6" }));
}
function ChevronRight(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M9 6l6 6-6 6" }));
}
function Trash2(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("polyline", { points: "23 4 23 10 17 10" }),
        React.createElement("polyline", { points: "1 20 1 14 7 14" }),
        React.createElement("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }));
}
function Settings(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
        React.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" }));
}
function CloseIcon(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }));
}
function Volume2(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("polygon", { points: "11 5 6.5 8.5 14.5 15.5 11 19 11 5" }),
        React.createElement("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
        React.createElement("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14" }));
}
function VolumeX(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("polygon", { points: "11 5 14.5 8.5 14.5 15.5 11 19 11 5" }),
        React.createElement("line", { x1: "22", x2: "16", y1: "9", y2: "15" }),
        React.createElement("line", { x1: "16", x2: "22", y1: "9", y2: "15" }));
}
function Cpu(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
        React.createElement("rect", { x: "9", y: "9", width: "6", height: "6" }),
        React.createElement("path", { d: "M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" }));
}
function TrendingDown(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("polyline", { points: "22 17 13.5 8.5 8.5 13.5 2 7" }),
        React.createElement("polyline", { points: "16 17 22 17 22 11" }));
}
function TrendingUp(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17" }),
        React.createElement("polyline", { points: "16 7 22 7 22 13" }));
}
function Users(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
        React.createElement("circle", { cx: "9", cy: "7", r: "4" }),
        React.createElement("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
        React.createElement("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }));
}
function Zap(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }));
}
function X(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M18 6 6 18" }),
        React.createElement("path", { d: "m6 6 12 12" }));
}
function AlertTriangle(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
        React.createElement("path", { d: "M12 9v4" }),
        React.createElement("path", { d: "M12 17h.01" }));
}
function Clock(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
        React.createElement("polyline", { points: "12 6 12 12 16 14" }));
}
function Calendar(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", ry: "2" }),
        React.createElement("line", { x1: "16", x2: "16", y1: "2", y2: "6" }),
        React.createElement("line", { x1: "8", x2: "8", y1: "2", y2: "6" }),
        React.createElement("line", { x1: "3", x2: "21", y1: "10", y2: "10" }));
}
function Briefcase(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("rect", { width: "20", height: "14", x: "2", y: "7", rx: "2", ry: "2" }),
        React.createElement("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }));
}
function ShieldAlert(p) {
    return React.createElement(Icon, { ...p },
        React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" }),
        React.createElement("path", { d: "M12 8v4" }),
        React.createElement("path", { d: "M12 16h.01" }));
}


// --- src/app/AnalyticsPanel.tsx ---
function AnalyticsPanel({ theme, defaultExpanded = false, previewMode = false, }) {
    const { orgData } = useOrg();
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [ratingMode, setRatingMode] = useState("risk");
    const t = themeTokens[theme];
    const pad = t.bentoPad;
    const analytics = useMemo(() => (orgData ? getAnalytics(orgData) : null), [orgData]);
    const rankedDepts = useMemo(() => {
        if (!analytics)
            return [];
        const list = [...analytics.departments];
        if (ratingMode === "positive")
            return list.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
        return list.sort((a, b) => b.deadwoodScore - a.deadwoodScore);
    }, [analytics, ratingMode]);
    if (!analytics)
        return null;
    const { summary } = analytics;
    const collapsedW = pad * 2 + 40;
    return (React.createElement("div", { style: {
            padding: `${pad}px 0 ${pad}px ${pad}px`,
            width: expanded ? 320 : collapsedW,
            flexShrink: 0,
            height: "100vh",
            boxSizing: "border-box",
            transition: "width 250ms ease",
        } },
        React.createElement("div", { className: "ds-side", "data-theme": theme },
            React.createElement("div", { style: { padding: 12, flexShrink: 0 } },
                React.createElement("button", { type: "button", className: "ds-collapse-btn", onClick: () => setExpanded(!expanded), "aria-label": expanded ? "Свернуть" : "Развернуть" }, expanded ? React.createElement(ChevronRight, { size: 18, className: "rotate-180" }) : (React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none" },
                    React.createElement("rect", { x: "2", y: "3", width: "16", height: "14", rx: "4", stroke: "currentColor", strokeWidth: "1.5" }),
                    React.createElement("path", { d: "M6 8h8M6 12h5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }))))),
            expanded && (React.createElement("div", { className: "ds-side-scroll" },
                React.createElement("div", { className: "ds-fp-head" },
                    React.createElement("span", null, "Фильтры"),
                    React.createElement("button", { type: "button", className: "ds-fp-reset", onClick: () => setRatingMode("risk") }, "Сбросить")),
                React.createElement("div", null,
                    React.createElement("h4", { className: "ds-section-title" }, "Сводка SAP ERP HCM"),
                    React.createElement("div", { className: "ds-stats-grid" }, [
                        { label: "Сотрудников", val: summary.totalEmployees, accent: false },
                        { label: "Средний KPI", val: summary.averageKpi, accent: false },
                        { label: "Низкая эфф-ть", val: `${summary.lowPerformersCount} (${summary.lowPerformersPercent}%)`, accent: true },
                        { label: "Подразделений", val: summary.totalDepartments, accent: false },
                    ].map((item, i) => (React.createElement("div", { key: i, className: item.accent ? "ds-stat is-accent" : "ds-stat" },
                        React.createElement("div", { className: "ds-stat-label" }, item.label),
                        React.createElement("div", { className: "ds-stat-val" }, item.val)))))),
                React.createElement("div", { className: "ds-toolbar" },
                    React.createElement("span", { className: "ds-toolbar-label" }, "Рейтинг:"),
                    React.createElement("button", { type: "button", className: ratingMode === "risk" ? "ds-toolbar-filter is-active" : "ds-toolbar-filter", onClick: () => setRatingMode("risk") }, "Риск"),
                    React.createElement("button", { type: "button", className: ratingMode === "positive" ? "ds-toolbar-filter is-active" : "ds-toolbar-filter", onClick: () => setRatingMode("positive") }, "Лидеры")),
                React.createElement("div", null,
                    React.createElement("h4", { className: "ds-section-title" }, "Подразделения"),
                    React.createElement("div", { className: "ds-list" }, rankedDepts.slice(0, 9).map((dept, i) => {
                        const isPositive = ratingMode === "positive";
                        const score = isPositive ? dept.efficiencyScore : dept.deadwoodScore;
                        const barColor = isPositive
                            ? (score >= 70 ? S.success : score >= 45 ? S.warning : S.danger)
                            : (score >= 60 ? S.danger : score >= 35 ? S.warning : S.success);
                        return (React.createElement("button", { type: "button", key: dept.deptId, className: "ds-list-item" },
                            React.createElement("div", { className: "ds-list-row" },
                                React.createElement("span", { className: "ds-list-label" }, `${i + 1}. ${dept.deptName.replace("Департамент ", "").replace("Группа ", "")}`),
                                React.createElement("span", { className: "ds-list-score", style: { color: barColor } }, score)),
                            React.createElement("div", { className: "ds-progress" },
                                React.createElement("i", { style: { width: `${score}%`, background: barColor } })),
                            React.createElement("div", { className: "ds-list-meta" },
                                React.createElement("span", null, React.createElement(Zap, { size: 10 }), " ", dept.avgKpi),
                                React.createElement("span", null, React.createElement(Users, { size: 10 }), " ", dept.headCount),
                                React.createElement("span", null, isPositive ? React.createElement(TrendingUp, { size: 10 }) : React.createElement(TrendingDown, { size: 10 }), " ", isPositive ? dept.highPerformers : dept.lowPerformers))));
                    }))),
                React.createElement("div", { className: "ds-side-foot" },
                    React.createElement("span", null, "SAP ERP HCM"),
                    React.createElement("span", null, new Date().toLocaleDateString("ru-RU"))))))));
}


// --- src/app/OrgPanel.tsx ---
const PANEL_W = 320;
const TRANSITION_MS = 250;
function kvRow(key, val, valClass) {
    return React.createElement("div", { className: "ds-kv-row" },
        React.createElement("span", { className: "ds-kv-key" }, key),
        React.createElement("span", { className: valClass || "ds-kv-val" }, val));
}
function OrgPanel({ theme }) {
    const { selectedEmployee, selectEmployee, orgData } = useOrg();
    const [emp, setEmp] = useState(null);
    const t = themeTokens[theme];
    const pad = t.bentoPad;
    const open = !!selectedEmployee;
    useEffect(() => {
        if (selectedEmployee || !orgData || !orgData.employees || !orgData.employees.length) return;
        const ceo = orgData.employees.find((e) => e.position === "Генеральный директор") || orgData.employees[0];
        selectEmployee(ceo);
    }, [orgData]);
    useLayoutEffect(() => {
        if (selectedEmployee) setEmp(selectedEmployee);
    }, [selectedEmployee]);
    useEffect(() => {
        if (selectedEmployee) return;
        const timer = setTimeout(() => setEmp(null), TRANSITION_MS);
        return () => clearTimeout(timer);
    }, [selectedEmployee]);
    if (!emp) {
        return React.createElement("div", {
            style: {
                padding: pad + "px " + pad + "px " + pad + "px 0",
                width: 0,
                flexShrink: 0,
                height: "100vh",
                boxSizing: "border-box",
                transition: "width " + TRANSITION_MS + "ms ease",
                overflow: "hidden",
            },
        });
    }
    const isDeadwood = emp.kpi.performanceScore < 45;
    const isWarning = emp.kpi.performanceScore >= 45 && emp.kpi.performanceScore < 60;
    const initials = emp.fullName.split(" ").map((n) => n[0]).join("");
    const avatarBg = isDeadwood ? S.danger : isWarning ? S.warning : S.primary;
    const scoreColor = isDeadwood ? S.danger : isWarning ? S.warning : S.primary;
    const tags = [
        React.createElement("span", {
            key: "kpi",
            className: isDeadwood ? "ds-tag is-danger" : isWarning ? "ds-tag is-warn" : "ds-tag",
        }, "KPI " + emp.kpi.performanceScore + "/100"),
    ];
    if (isDeadwood) {
        tags.push(React.createElement("span", { key: "dead", className: "ds-tag is-danger" },
            React.createElement(TrendingDown, { size: 12 }), " Требуется оценка"));
    }
    if (emp.employmentStatus === "suspended") {
        tags.push(React.createElement("span", { key: "sus", className: "ds-tag is-warn" },
            React.createElement(ShieldAlert, { size: 12 }), " Отстранён"));
    }
    const kpiChildren = [
        React.createElement("div", { className: "ds-kv-row", key: "eff" },
            React.createElement("span", { className: "ds-kv-key" }, React.createElement(Zap, { size: 12 }), " Эффективность"),
            React.createElement("span", { className: "ds-kv-val", style: { color: scoreColor } }, emp.kpi.performanceScore + "/100")),
        kvRow("Выполнено", emp.kpi.tasksCompleted),
        kvRow("Просрочено", emp.kpi.tasksOverdue, emp.kpi.tasksOverdue > 5 ? "ds-kv-val is-danger" : "ds-kv-val"),
        kvRow("Переработки", emp.kpi.overtimeHours + "ч"),
        kvRow("Обзор", emp.kpi.lastReviewDate),
    ];
    const riskItems = [
        { icon: React.createElement(Calendar, { size: 12 }), label: "Прогулы", val: emp.metrics.absenteeismDays + " дней", warn: emp.metrics.absenteeismDays > 10, mid: emp.metrics.absenteeismDays > 3 },
        { icon: React.createElement(Clock, { size: 12 }), label: "Опоздания", val: emp.metrics.lateCount + " раз", warn: emp.metrics.lateCount > 8, mid: emp.metrics.lateCount > 3 },
        { icon: React.createElement(AlertTriangle, { size: 12 }), label: "Крит. инциденты", val: emp.metrics.criticalIncidents, warn: emp.metrics.criticalIncidents > 3, mid: emp.metrics.criticalIncidents > 0 },
        { icon: React.createElement(Briefcase, { size: 12 }), label: "Загрузка", val: emp.metrics.workloadPercent + "%", warn: emp.metrics.workloadPercent < 40, mid: false },
    ].map((row, i) => React.createElement("div", { key: i, className: "ds-kv-row" },
        React.createElement("span", { className: "ds-kv-key" }, row.icon, " ", row.label),
        React.createElement("span", { className: row.warn ? "ds-kv-val is-danger" : row.mid ? "ds-kv-val is-warn" : "ds-kv-val" }, row.val)));
    const teamItems = [
        React.createElement("div", { key: "team", className: "ds-kv-row" },
            React.createElement("span", { className: "ds-kv-key" }, React.createElement(Users, { size: 12 }), " Подчинённые"),
            React.createElement("span", { className: "ds-kv-val" }, emp.metrics.teamSize)),
    ];
    if (emp.metrics.budgetResponsibility > 0) {
        teamItems.push(React.createElement("div", { key: "budget", className: "ds-kv-row" },
            React.createElement("span", { className: "ds-kv-key" }, "Бюджет"),
            React.createElement("span", { className: "ds-kv-val" }, (emp.metrics.budgetResponsibility / 1000000).toFixed(1) + "M ₽")));
    }
    const docs = [
        ["Инфотип 0001", emp.sap.infotype0001],
        ["Инфотип 0008", emp.sap.infotype0008],
        ["Инфотип 0027", emp.sap.infotype0027],
        ["Изменён", emp.sap.lastChanged],
    ].map(([label, value], i) => React.createElement("div", { key: i, className: "ds-attachment" },
        React.createElement("span", { className: "ds-attachment-icon" }, React.createElement(Briefcase, { size: 16 })),
        React.createElement("div", { className: "ds-attachment-body" },
            React.createElement("strong", null, label),
            React.createElement("span", null, value))));
    const panelBody = React.createElement("div", {
        className: "ds-side",
        "data-theme": theme,
        style: { width: PANEL_W, height: "100%" },
    },
        React.createElement("div", { className: "ds-side-scroll" },
            React.createElement("div", { className: "ds-product" },
                React.createElement("div", { className: "ds-product-top" },
                    React.createElement("div", { className: "ds-product-eyebrow" }, "SAP ERP HCM · карточка"),
                    React.createElement("button", { type: "button", className: "ds-product-close", onClick: () => selectEmployee(null), "aria-label": "Закрыть" },
                        React.createElement(X, { size: 16 }))),
                React.createElement("div", { className: "ds-product-main" },
                    React.createElement("div", { className: "ds-product-avatar", style: { background: avatarBg } }, initials),
                    React.createElement("div", null,
                        React.createElement("div", { className: "ds-product-name" }, formatShortName(emp.fullName)),
                        React.createElement("div", { className: "ds-product-meta" }, emp.position),
                        React.createElement("div", { className: "ds-product-sub" }, "Таб. № " + emp.personnelNumber + " · " + emp.department))),
                React.createElement("div", { className: "ds-tags" }, tags)),
            React.createElement("div", null,
                React.createElement("h4", { className: "ds-section-title" }, "Показатели KPI"),
                React.createElement("div", { className: "ds-kv" }, kpiChildren),
                React.createElement("div", { className: "ds-progress", style: { marginTop: 10 } },
                    React.createElement("i", { style: { width: emp.kpi.performanceScore + "%", background: scoreColor } }))),
            React.createElement("div", null,
                React.createElement("h4", { className: "ds-section-title" }, "Нарушения и риски"),
                React.createElement("div", { className: "ds-kv" }, riskItems)),
            React.createElement("div", null,
                React.createElement("h4", { className: "ds-section-title" }, "Команда"),
                React.createElement("div", { className: "ds-kv" }, teamItems)),
            React.createElement("div", null,
                React.createElement("h4", { className: "ds-section-title" }, "Документы SAP"),
                React.createElement("div", { className: "ds-attachments" }, docs))));
    return React.createElement("div", {
        style: {
            padding: pad + "px " + pad + "px " + pad + "px 0",
            width: open ? PANEL_W + pad : 0,
            flexShrink: 0,
            height: "100vh",
            boxSizing: "border-box",
            transition: "width " + TRANSITION_MS + "ms ease",
            overflow: "hidden",
            position: "relative",
            zIndex: 40,
        },
    }, panelBody);
}


// --- src/app/AIPanel.tsx ---
function renderAssistantText(text, orgData, revealEmployee) {
    const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        const m = part.match(/^\*\*([^*]+)\*\*$/);
        if (!m) {
            return React.createElement("span", { key: i, dangerouslySetInnerHTML: { __html: part.replace(/\n/g, "<br>") } });
        }
        const label = m[1].trim();
        const looksName = /[а-яё]/i.test(label) && label.length >= 5 && !/^\d/.test(label) &&
            !/подраздел|зонах|сводк|источник|вердикт|показател|сотрудник/i.test(label);
        let hit = null;
        if (looksName && orgData && revealEmployee) {
            const found = searchEmployees(orgData, label);
            hit = found.find((e) => e.fullName === label) ||
                found.find((e) => e.fullName.toLowerCase().startsWith(label.toLowerCase())) ||
                (label.split(/\s+/).length >= 2 ? found[0] : null);
        }
        if (hit) {
            return React.createElement("button", {
                key: i,
                type: "button",
                className: "ai-name-link",
                onClick: (e) => { e.stopPropagation(); revealEmployee(hit); },
                title: "Открыть на оргкарте и в панели",
            }, label);
        }
        return React.createElement("strong", { key: i }, label);
    });
}
function AIPanel({ theme, previewMode = false }) {
    const { messages, aiLoading, sendMessage, voiceListening, setVoiceListening, clearMessages, selectedEmployee, orgData, revealEmployee, agentStatus, refreshAgentStatus } = useOrg();
    const orgPanelShift = selectedEmployee ? PANEL_W + 48 : 0;
    const [input, setInput] = useState("");
    const [minimized, setMinimized] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [cfgMode, setCfgMode] = useState("plan-execute");
    const [cfgRag, setCfgRag] = useState(true);
    const [cfgEndpoint, setCfgEndpoint] = useState("");
    const [cfgApiKey, setCfgApiKey] = useState("");
    const [cfgModel, setCfgModel] = useState("gpt-4o-mini");
    const [cfgTemp, setCfgTemp] = useState(0.2);
    const [cfgHint, setCfgHint] = useState("Без endpoint ответ собирается локально: RAG + реестр.");
    const [autoSpeak, setAutoSpeak] = useState(true);
    const chatRef = useRef(null);
    const recognitionRef = useRef(null);
    const fillSettingsFromAgent = useCallback(() => {
        const ag = window.OrgAdminAgent;
        if (!ag || !ag.loadLlmConfig)
            return;
        const cfg = ag.loadLlmConfig();
        setCfgMode(cfg.mode === "react" ? "react" : "plan-execute");
        setCfgRag(cfg.ragEnabled !== false);
        setCfgEndpoint(cfg.endpoint || "");
        setCfgApiKey(cfg.apiKey || "");
        setCfgModel(cfg.model || "gpt-4o-mini");
        setCfgTemp(cfg.temperature ?? 0.2);
    }, []);
    const openSettings = useCallback((open) => {
        if (open)
            fillSettingsFromAgent();
        setSettingsOpen(open);
    }, [fillSettingsFromAgent]);
    const saveSettings = useCallback(() => {
        const ag = window.OrgAdminAgent;
        if (!ag || !ag.saveLlmConfig) {
            setCfgHint("Агент ещё загружается — подождите секунду.");
            return;
        }
        ag.saveLlmConfig({
            mode: cfgMode,
            ragEnabled: cfgRag,
            endpoint: cfgEndpoint.trim(),
            apiKey: cfgApiKey.trim(),
            model: cfgModel.trim() || "gpt-4o-mini",
            temperature: Number(cfgTemp) || 0.2,
        });
        if (refreshAgentStatus)
            refreshAgentStatus();
        setCfgHint("Сохранено.");
        setSettingsOpen(false);
    }, [cfgMode, cfgRag, cfgEndpoint, cfgApiKey, cfgModel, cfgTemp, refreshAgentStatus]);
    const resetSettings = useCallback(() => {
        const ag = window.OrgAdminAgent;
        if (ag && ag.resetLlmConfig)
            ag.resetLlmConfig();
        fillSettingsFromAgent();
        if (refreshAgentStatus)
            refreshAgentStatus();
        setCfgHint("Сброшено к defaults (local-fallback, Plan-and-Execute, RAG on).");
    }, [fillSettingsFromAgent, refreshAgentStatus]);
    // Drag state
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const posRef = useRef(pos);
    posRef.current = pos;
    const onMouseDown = useCallback((e) => {
        dragging.current = true;
        dragStart.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
        const onMouseMove = (ev) => {
            if (!dragging.current)
                return;
            setPos({ x: ev.clientX - dragStart.current.x, y: ev.clientY - dragStart.current.y });
        };
        const onMouseUp = () => {
            dragging.current = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, []);
    const t = themeTokens[theme];
    useEffect(() => {
        if (chatRef.current)
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages]);
    const lastAudioRef = useRef(null);
    // Авто-озвучка последнего ответа ассистента
    useEffect(() => {
        if (previewMode || !autoSpeak)
            return;
        const lastMsg = messages[messages.length - 1];
        if (!lastMsg || lastMsg.role !== "assistant")
            return;
        // Стопаем предыдущее аудио (Piper)
        if (lastAudioRef.current) {
            lastAudioRef.current.pause();
            lastAudioRef.current = null;
        }
        // Стопаем браузерный TTS
        window.speechSynthesis.cancel();
        const aborted = { current: false };
        const audioCtx = new AudioContext();
        fetch("/api/ai/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: lastMsg.text }),
        })
            .then((res) => {
            if (!res.ok || aborted.current)
                throw new Error("TTS failed");
            return res.blob();
        })
            .then((blob) => {
            if (aborted.current)
                return;
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            lastAudioRef.current = audio;
            audio.play();
            audio.onended = () => {
                URL.revokeObjectURL(url);
                if (lastAudioRef.current === audio)
                    lastAudioRef.current = null;
            };
        })
            .catch(() => {
            if (aborted.current)
                return;
            // Fallback: системный голос
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(lastMsg.text.replace(/\*\*/g, "").replace(/[•\-\n]/g, ". "));
            utterance.lang = "ru-RU";
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        });
        return () => {
            aborted.current = true;
            window.speechSynthesis.cancel();
            audioCtx.close();
        };
    }, [messages, autoSpeak, previewMode]);
    // Голосовой ввод
    useEffect(() => {
        const w = window;
        if (typeof window !== "undefined" && w.webkitSpeechRecognition) {
            const SR = w.webkitSpeechRecognition;
            const recognition = new SR();
            recognition.lang = "ru-RU";
            recognition.interimResults = false;
            recognition.continuous = false;
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setInput(text);
                setVoiceListening(false);
                if (text.trim()) {
                    sendMessage(text);
                    setInput("");
                }
            };
            recognition.onerror = () => setVoiceListening(false);
            recognition.onend = () => setVoiceListening(false);
            recognitionRef.current = recognition;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleVoiceToggle = () => {
        const rec = recognitionRef.current;
        if (!rec) {
            alert("Голосовой ввод не поддерживается в этом браузере. Используйте Chrome.");
            return;
        }
        if (voiceListening) {
            rec.stop();
            setVoiceListening(false);
        }
        else {
            try {
                rec.start();
                setVoiceListening(true);
            }
            catch { }
        }
    };
    const handleSend = () => {
        if (!input.trim() || aiLoading)
            return;
        sendMessage(input.trim());
        setInput("");
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const quickActions = [
        "Найди Петрова",
        "Покажи span of control",
        "Найди дубли ролей",
        "Найди дыры в подчинении",
        "Сверка cost center",
        "Администратор",
    ];
    const thinkingPhrases = [
        "Сверяю KPI в SAP ERP HCM…",
        "Подтягиваю регламенты (RAG)…",
        "Сравниваю подразделения…",
        "Собираю карточку сотрудника…",
    ];
    const [thinkIdx, setThinkIdx] = useState(0);
    useEffect(() => {
        if (!aiLoading)
            return;
        setThinkIdx(0);
        const id = setInterval(() => setThinkIdx((i) => (i + 1) % thinkingPhrases.length), 900);
        return () => clearInterval(id);
    }, [aiLoading]);
    const fieldStyle = {
        width: "100%",
        border: `1px solid ${t.inputBorder}`,
        borderRadius: 10,
        padding: "8px 10px",
        fontSize: 12,
        background: t.inputBg,
        color: t.text,
        marginBottom: 8,
    };
    const labelStyle = { display: "block", fontSize: 11, color: t.textSecondary, margin: "6px 0 4px" };
    return (React.createElement("div", { className: "fixed z-50 w-[440px] max-h-[85vh] border rounded-[14px] flex flex-col overflow-hidden ai-alive-panel", style: {
            left: `calc(100vw - 464px - ${orgPanelShift}px + ${pos.x}px)`,
            bottom: `calc(24px - ${pos.y}px)`,
            background: t.aiPanelBg,
            borderColor: t.surfaceBorder,
            boxShadow: t.shadowLg,
            transition: "left 250ms ease",
            ...glass(t),
            cursor: dragging.current ? "grabbing" : undefined,
        } },
        React.createElement("div", { onMouseDown: onMouseDown, className: "px-4 py-3 border-b flex items-center gap-2.5 cursor-grab active:cursor-grabbing select-none", style: { borderColor: t.separatorColor, background: t.aiHeaderBg, ...glass(t) } },
            React.createElement("div", { className: "w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold cursor-pointer", style: { background: S.primary, color: S.white }, onClick: () => setMinimized(!minimized) },
                "AI"),
            React.createElement("div", { className: "flex-1 cursor-pointer min-w-0", onClick: () => setMinimized(!minimized) },
                React.createElement("div", { className: "text-sm font-bold", style: { color: t.text } }, "AI-ассистент"),
                React.createElement("div", { className: "text-[10px] flex items-center gap-1.5", style: { color: t.textAccent } },
                    React.createElement("span", { className: "ai-online-dot" }),
                    aiLoading ? "Думаю…" : (agentStatus || "Онлайн · SAP ERP HCM"))),
            React.createElement("button", { onClick: (e) => { e.stopPropagation(); openSettings(!settingsOpen); }, className: "p-1.5 rounded-lg transition-all hover:opacity-80", style: { color: settingsOpen ? S.primary : t.textSecondary, background: t.cardBg }, title: "Настройки агента", "aria-expanded": settingsOpen },
                React.createElement(Settings, { size: 14 })),
            React.createElement("button", { onClick: (e) => { e.stopPropagation(); clearMessages(); }, className: "p-1.5 rounded-lg transition-all hover:opacity-80", style: { color: t.textSecondary, background: t.cardBg }, title: "Сбросить сессию" },
                React.createElement(Trash2, { size: 14 })),
            React.createElement("button", { style: { color: t.textSecondary }, className: "hover:opacity-70", onClick: () => setMinimized(!minimized) }, minimized ? React.createElement(ChevronUp, { size: 16 }) : React.createElement(ChevronDown, { size: 16 }))),
        !minimized && (React.createElement(React.Fragment, null,
            settingsOpen && React.createElement("div", { className: "absolute inset-x-0 top-[52px] bottom-0 z-10 overflow-auto p-4", style: { background: t.aiPanelBg, borderTop: `1px solid ${t.separatorColor}` } },
                React.createElement("div", { className: "flex items-center justify-between gap-2 mb-2" },
                    React.createElement("strong", { style: { color: t.text, fontSize: 14 } }, "Настройки агента"),
                    React.createElement("button", { type: "button", onClick: () => openSettings(false), className: "p-1.5 rounded-lg", style: { color: t.textSecondary, background: t.cardBg }, title: "Закрыть" },
                        React.createElement(CloseIcon, { size: 14 }))),
                React.createElement("p", { style: { fontSize: 12, color: t.textSecondary, marginBottom: 10 } }, "Plan-and-Execute / ReAct · RAG по регламентам HCM · опциональный LLM. Настройки общие с кабинетом администратора."),
                React.createElement("label", { style: labelStyle }, "Архитектура"),
                React.createElement("select", { value: cfgMode, onChange: (e) => setCfgMode(e.target.value), style: fieldStyle },
                    React.createElement("option", { value: "plan-execute" }, "Plan-and-Execute"),
                    React.createElement("option", { value: "react" }, "ReAct")),
                React.createElement("label", { style: { ...labelStyle, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } },
                    React.createElement("input", { type: "checkbox", checked: cfgRag, onChange: (e) => setCfgRag(e.target.checked) }),
                    "Подтягивать регламенты (RAG)"),
                React.createElement("div", { style: { margin: "12px 0 6px", fontSize: 12, fontWeight: 700, color: t.text } }, "Подключение LLM ", React.createElement("span", { style: { fontWeight: 400, color: t.textSecondary } }, "(опционально)")),
                React.createElement("label", { style: labelStyle }, "Endpoint"),
                React.createElement("input", { value: cfgEndpoint, onChange: (e) => setCfgEndpoint(e.target.value), placeholder: "https://api.openai.com/v1/chat/completions", style: fieldStyle, autoComplete: "off" }),
                React.createElement("label", { style: labelStyle }, "API key"),
                React.createElement("input", { type: "password", value: cfgApiKey, onChange: (e) => setCfgApiKey(e.target.value), placeholder: "sk-…", style: fieldStyle, autoComplete: "off" }),
                React.createElement("label", { style: labelStyle }, "Model"),
                React.createElement("input", { value: cfgModel, onChange: (e) => setCfgModel(e.target.value), style: fieldStyle }),
                React.createElement("label", { style: labelStyle }, "Temperature"),
                React.createElement("input", { type: "number", step: "0.1", min: "0", max: "2", value: cfgTemp, onChange: (e) => setCfgTemp(e.target.value), style: fieldStyle }),
                React.createElement("div", { className: "flex gap-2 mt-3" },
                    React.createElement("button", { type: "button", onClick: saveSettings, className: "px-3 py-2 rounded-lg text-xs font-bold", style: { background: S.primary, color: S.white, border: 0 } }, "Сохранить"),
                    React.createElement("button", { type: "button", onClick: resetSettings, className: "px-3 py-2 rounded-lg text-xs", style: { background: t.cardBg, color: t.text, border: `1px solid ${t.inputBorder}` } }, "Сбросить")),
                React.createElement("p", { style: { fontSize: 11, color: t.textSecondary, marginTop: 10 } }, cfgHint),
                React.createElement("button", { type: "button", onClick: () => { window.location.href = "./admin/index.html"; }, className: "mt-3 w-full px-3 py-2.5 rounded-lg text-xs font-bold", style: { background: "rgba(0,143,149,0.12)", color: S.primary, border: `1px solid rgba(0,143,149,0.25)` } }, "Перейти в раздел «Администратор»")),
            React.createElement("div", { ref: chatRef, className: "overflow-y-auto px-4 py-3 space-y-3", style: { maxHeight: "52vh", opacity: settingsOpen ? 0.35 : 1, pointerEvents: settingsOpen ? "none" : "auto" } },
                messages.map((msg, i) => (React.createElement("div", { key: i, className: `flex gap-2 ${msg.role === "user" ? "justify-end" : ""}` },
                    msg.role === "assistant" && (React.createElement("div", { className: "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5", style: { background: S.primary } },
                        React.createElement(Bot, { size: 12, style: { color: S.white } }))),
                    React.createElement("div", { className: "max-w-[85%] rounded-lg px-3 py-2 text-sm", style: {
                            background: msg.role === "user" ? t.chatUserBg : t.chatAssistantBg,
                            color: msg.role === "user" ? S.white : t.text,
                            border: msg.role === "user" ? "none" : `1px solid ${t.chatAssistantBorder}`,
                            ...(msg.role === "assistant" ? glass(t) : {}),
                        } },
                        React.createElement("div", null, msg.role === "assistant"
                            ? renderAssistantText(msg.text, orgData, revealEmployee)
                            : React.createElement("span", { dangerouslySetInnerHTML: { __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>") } }))),
                    msg.role === "user" && (React.createElement("div", { className: "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5", style: { background: S.primary } },
                        React.createElement(User, { size: 12, style: { color: S.white } })))))),
                aiLoading && (React.createElement("div", { className: "flex items-center gap-2 text-xs ai-thinking", style: { color: t.textSecondary } },
                    React.createElement(Loader2, { size: 12, className: "animate-spin" }),
                    thinkingPhrases[thinkIdx]))),
            !settingsOpen && React.createElement("div", { className: "px-3 pb-2 flex flex-wrap gap-1.5" }, quickActions.map((action) => (React.createElement("button", { key: action, onClick: () => {
                    if (action === "Администратор") {
                        openSettings(true);
                        return;
                    }
                    sendMessage(action);
                }, disabled: aiLoading, className: "text-[10px] px-2.5 py-1.5 rounded-full transition-all hover:opacity-80 border", style: { background: t.quickActionBg, borderColor: t.quickActionBorder, color: t.quickActionText } }, action)))),
            !settingsOpen && React.createElement("div", { className: "p-3 border-t flex items-center gap-2", style: { borderColor: t.separatorColor, background: t.cardBg, ...glass(t) } },
                React.createElement("button", { onClick: handleVoiceToggle, className: "p-2 rounded-lg transition-all", style: { background: voiceListening ? S.danger : t.cardBg, color: voiceListening ? S.white : t.textSecondary, border: `1px solid ${voiceListening ? S.danger : t.inputBorder}` } }, voiceListening ? React.createElement(MicOff, { size: 16 }) : React.createElement(Mic, { size: 16 })),
                React.createElement("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: voiceListening ? "Говорите..." : "Например: найди Петрова…", className: "flex-1 text-sm px-3 py-2 rounded-lg border focus:outline-none", style: { background: t.inputBg, borderColor: t.inputBorder, color: t.text }, disabled: aiLoading || voiceListening }),
                React.createElement("button", { onClick: handleSend, disabled: !input.trim() || aiLoading, className: "p-2 rounded-lg transition-all disabled:opacity-30", style: { background: input.trim() ? S.primary : t.cardBg, color: S.white } },
                    React.createElement(Send, { size: 16 })))))));
}


// --- src/components/bento/BentoHeader.tsx ---
function BentoSelect({ t, value, onChange, options, groups, maxWidth, }) {
    const [open, setOpen] = useState(false);
    const [menuPos, setMenuPos] = useState(null);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const flatOptions = useMemo(() => {
        if (options)
            return options;
        return groups?.flatMap((g) => g.options) ?? [];
    }, [options, groups]);
    const label = flatOptions.find((o) => o.value === value)?.label ?? value;
    useEffect(() => {
        if (!open)
            return;
        const onDoc = (e) => {
            const target = e.target;
            if (rootRef.current?.contains(target) || menuRef.current?.contains(target))
                return;
            setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);
    useLayoutEffect(() => {
        if (!open || !triggerRef.current) {
            setMenuPos(null);
            return;
        }
        const update = () => {
            if (!triggerRef.current)
                return;
            const rect = triggerRef.current.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        };
        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [open]);
    const triggerStyle = {
        fontSize: 12,
        padding: "8px 12px",
        borderRadius: t.bentoCellRadius,
        border: `1px solid ${t.bentoCellBorder}`,
        background: t.bentoSelectBg,
        color: t.bentoSelectText,
        minHeight: 36,
        outline: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        whiteSpace: "nowrap",
        fontFamily: "inherit",
        width: "100%",
        maxWidth,
    };
    const menuStyle = {
        position: "fixed",
        top: menuPos?.top ?? 0,
        left: menuPos?.left ?? 0,
        minWidth: menuPos?.width ?? undefined,
        maxWidth: maxWidth ? maxWidth + 80 : 280,
        maxHeight: 280,
        overflowY: "auto",
        borderRadius: t.bentoCellRadius,
        background: t.bentoSelectOptionBg,
        border: `1px solid ${t.bentoCellBorder}`,
        boxShadow: t.bentoShadow,
        padding: 4,
        zIndex: 10000,
    };
    const pick = (next) => {
        onChange(next);
        setOpen(false);
    };
    const renderOption = (opt) => {
        const selected = opt.value === value;
        return (React.createElement("button", { key: opt.value || "__all__", type: "button", onClick: () => pick(opt.value), style: {
                display: "block",
                width: "100%",
                textAlign: "left",
                border: "none",
                fontFamily: "inherit",
                fontSize: 12,
                padding: "8px 12px",
                borderRadius: t.bentoCellRadius - 4,
                cursor: "pointer",
                color: t.bentoSelectText,
                background: selected ? t.bentoSelectBg : "transparent",
                fontWeight: selected ? 600 : 400,
            } }, opt.label));
    };
    const menu = open && menuPos ? (React.createElement("div", { ref: menuRef, style: menuStyle },
        options?.map(renderOption),
        groups?.map((group) => (React.createElement("div", { key: group.label || "__root__" },
            group.label && (React.createElement("div", { style: {
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: t.headerTextSecondary,
                    padding: "6px 12px 4px",
                } }, group.label)),
            group.options.map(renderOption)))))) : null;
    return (React.createElement("div", { ref: rootRef, style: { position: "relative", maxWidth, flexShrink: 0 } },
        React.createElement("button", { ref: triggerRef, type: "button", onClick: () => setOpen((v) => !v), style: triggerStyle },
            React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, label),
            React.createElement("span", { style: { opacity: 0.7, fontSize: 10, flexShrink: 0 } }, open ? "▴" : "▾")),
        typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null));
}
function BentoHeader({ theme, orgData, filterDeptId, setFilterDeptId, filterLevel, setFilterLevel, onToggleTheme, onExport, exporting = false, previewMode = false, showLegend = false, logoSrc, }) {
    const t = themeTokens[theme];
    const gap = t.bentoGap;
    const deptGroups = useMemo(() => [
        { label: "", options: [{ value: "", label: "Все подразделения" }] },
        {
            label: "Предприятия",
            options: orgData.orgUnits
                .filter((u) => u.parentId === "org-001")
                .map((u) => ({ value: u.id, label: u.name })),
        },
        {
            label: "Департаменты",
            options: orgData.orgUnits
                .filter((u) => u.parentId && u.parentId !== "org-001")
                .map((u) => ({
                value: u.id,
                label: u.name.replace("Департамент ", "").replace("Группа ", ""),
            })),
        },
    ], [orgData.orgUnits]);
    const levelOptions = useMemo(() => [
        { value: "all", label: "Все уровни" },
        { value: "enterprises", label: "Предприятия" },
        { value: "directors", label: "Директора" },
        { value: "managers", label: "Руководители" },
        { value: "functions", label: "Функции" },
    ], []);
    return (React.createElement("div", { style: { ...bentoPanel(t), padding: gap, flexShrink: 0, overflowX: "auto" } },
        React.createElement("div", { style: {
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto auto",
                gap,
                alignItems: "stretch",
            } },
            React.createElement("div", { style: { ...bentoCell(t), padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, minWidth: 0 } },
                logoSrc && React.createElement("img", { src: logoSrc, alt: "SB", title: "Сохранить раскладку блоков", style: { height: 30, width: 30, flexShrink: 0, display: "block", objectFit: "contain", cursor: "pointer" }, onClick: (e) => { e.stopPropagation(); orgLayoutApi.save && orgLayoutApi.save(); } }),
                React.createElement("span", { style: { fontSize: 18, fontWeight: 500, color: t.headerText, lineHeight: 1.15, margin: 0, minWidth: 0 } }, "AI Аналитика Орг Структуры")),
            React.createElement("div", null),
            React.createElement("div", { style: { ...bentoCell(t), padding: "10px 14px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 } },
                showLegend && (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, [
                    { c: S.success, title: "Высокий" },
                    { c: S.warning, title: "Средний" },
                    { c: S.danger, title: "Низкий" },
                ].map(({ c, title }) => (React.createElement("span", { key: title, title: title, style: { width: 8, height: 8, borderRadius: 3, background: c, flexShrink: 0 } }))))),
                React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: t.headerText, whiteSpace: "nowrap" } },
                    orgData.metadata.totalEmployees,
                    " \u0441\u043E\u0442\u0440."),
                !previewMode && (React.createElement("span", { style: { fontSize: 12, color: t.headerTextSecondary, whiteSpace: "nowrap" } },
                    (orgData.metadata.totalBudget / 1000000).toFixed(0),
                    "M \u20BD"))),
            React.createElement("div", { style: { ...bentoCell(t), padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 } },
                React.createElement(BentoSelect, { t: t, value: filterDeptId ?? "", onChange: (v) => setFilterDeptId(v || null), groups: deptGroups, maxWidth: 150 }),
                React.createElement(BentoSelect, { t: t, value: filterLevel, onChange: (v) => setFilterLevel(v), options: levelOptions }),
                (filterDeptId || filterLevel !== "all") && (React.createElement("button", { onClick: () => { setFilterDeptId(null); setFilterLevel("all"); }, style: { ...bentoCell(t), width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: t.headerTextSecondary, cursor: "pointer", padding: 0 } }, "\u2715"))),
            React.createElement("div", { style: { ...bentoCell(t), padding: 6, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 } },
                onExport && (React.createElement("button", { onClick: onExport, disabled: exporting, style: {
                        ...bentoCell(t),
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "8px 14px",
                        color: t.headerText,
                        cursor: exporting ? "wait" : "pointer",
                        opacity: exporting ? 0.5 : 1,
                    } }, exporting ? "…" : "PPTX")),
                React.createElement("button", { onClick: onToggleTheme, style: {
                        ...bentoCell(t),
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: t.headerText,
                        cursor: "pointer",
                        fontSize: 16,
                        padding: 0,
                    } }, theme === "dark" ? "☀" : "🌙")))));
}


// --- src/preview/PreviewApp.tsx ---
function PreviewApp() {
    const { orgData, selectedEmployee, selectEmployee, filterDeptId, setFilterDeptId, filterLevel, setFilterLevel } = useOrg();
    const { theme, toggleTheme } = useTheme();
    const t = themeTokens[theme];
    const graph = useMemo(() => (orgData ? buildGraph(orgData, filterDeptId, filterLevel) : { nodes: [], edges: [] }), [orgData, filterDeptId, filterLevel]);
    const selectedEnterpriseId = useMemo(() => {
        if (!selectedEmployee || selectedEmployee.position !== "Генеральный директор предприятия")
            return null;
        return entNodeId(selectedEmployee.orgUnitId);
    }, [selectedEmployee]);
    if (!orgData)
        return null;
    const handleExport = () => alert("Экспорт PPTX — сделайте скриншот экрана.");
    return (React.createElement("div", { style: { display: "flex", height: "100vh", overflow: "hidden", background: t.bg, fontFamily: "Inter, Roboto, Arial, sans-serif", gap: t.bentoGap } },
        React.createElement(AnalyticsPanel, { theme: theme, defaultExpanded: true, previewMode: true }),
        React.createElement("div", { style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                padding: `${t.bentoPad}px ${t.bentoPad}px ${t.bentoPad}px 0`,
                gap: t.bentoGap,
                boxSizing: "border-box",
            } },
            React.createElement(BentoHeader, { theme: theme, orgData: orgData, filterDeptId: filterDeptId, setFilterDeptId: setFilterDeptId, filterLevel: filterLevel, setFilterLevel: setFilterLevel, onToggleTheme: toggleTheme, onExport: handleExport, previewMode: true, logoSrc: "logo-mark.png" }),
            React.createElement("div", { style: bentoCanvasFrame(t) },
                React.createElement(OrgChartCanvas, { graph: graph, theme: theme, selectEmployee: selectEmployee, selectedEmployeeId: selectedEmployee?.id, selectedEnterpriseId: selectedEnterpriseId, orgData: orgData }))),
        React.createElement(OrgPanel, { theme: theme }),
        React.createElement(AIPanel, { theme: theme, previewMode: true })));
}


// --- src/preview/entry.tsx ---
const savedTheme = localStorage.getItem("ds-theme");
if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.dataset.theme = savedTheme;
}
const rootEl = document.getElementById("root");
if (rootEl) {
    createRoot(rootEl).render(React.createElement(BootErrorBoundary, null,
        React.createElement(PreviewOrgProvider, null,
            React.createElement(PreviewApp, null))));
}

