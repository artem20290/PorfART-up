// Детерминированный набор данных квартала Q3 2025.
// Факт-таблица — строки заказов (PO lines) -> заказы -> поставщики -> категории.

export type Reason =
  | "Нет контракта"
  | "Контракт истёк"
  | "Аварийная закупка"
  | "Вне каталога"
  | "Единственный поставщик"
  | "Превышение лимита";

export const REASONS: Reason[] = [
  "Нет контракта",
  "Контракт истёк",
  "Аварийная закупка",
  "Вне каталога",
  "Единственный поставщик",
  "Превышение лимита",
];

export type POLine = {
  id: string;
  item: string;
  code: string;
  qty: number;
  unit: string;
  unitPrice: number;
  benchmark: number;
  amount: number;
  offContract: boolean;
};

export type Approval = {
  name: string;
  role: string;
  at: string;
  note: string;
};

export type PO = {
  id: string;
  supplierId: string;
  supplier: string;
  category: string;
  owner: string;
  site: string;
  date: string;
  amount: number;
  offAmount: number;
  offContract: boolean;
  reason: Reason | null;
  contract: string | null;
  lines: POLine[];
  approvals: Approval[];
};

export type Supplier = {
  id: string;
  name: string;
  inn: string;
  category: string;
  spend: number;
  offAmount: number;
  coverage: number; // 0..1
  offContract: boolean;
  reason: Reason | null;
  owner: string;
  poCount: number;
  contract: string | null;
  since: number;
  risk: "Низкий" | "Средний" | "Высокий";
};

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20250903);
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const between = (a: number, b: number) => a + rnd() * (b - a);

export const OWNERS = [
  "К. Лебедев",
  "А. Волкова",
  "М. Новиков",
  "Е. Соколова",
  "И. Павлов",
  "С. Кузнецов",
  "О. Фёдорова",
  "Р. Ершов",
  "Н. Зайцева",
  "П. Григорьев",
];

export const SITES = [
  "Альфа",
  "Бета",
  "Гамма",
  "Дельта",
  "Эпсилон",
  "Зета",
  "Эта",
  "Тета",
];

type CatDef = {
  name: string;
  short: string;
  weight: number;
  suppliers: string[];
  items: [string, string, string, number][];
};

export const CATEGORIES: CatDef[] = [
  {
    name: "МТР и запчасти",
    short: "МТР",
    weight: 4.6,
    suppliers: [
      "ПромАрматура-Урал",
      "ТехноСнаб НН",
      "Ремкомплект Сибирь",
      "СтальТрейд Групп",
      "Подшипник-Центр",
      "НасосМаш Поволжье",
      "ГидроДеталь Про",
      "Арматурный Двор",
    ],
    items: [
      ["Клапан регулирующий DN80 PN40", "VLV-080-40", "шт", 1840],
      ["Задвижка стальная DN150", "VLV-150-ST", "шт", 2360],
      ["Подшипник роликовый 22320", "BRG-22320", "шт", 184],
      ["Уплотнение торцевое SIC/SIC", "SEL-SIC-70", "компл", 940],
      ["Насос центробежный 65/40", "PMP-6540", "шт", 7120],
      ["Фланец воротниковый DN100", "FLG-100-16", "шт", 96],
    ],
  },
  {
    name: "Логистика и транспорт",
    short: "Логистика",
    weight: 3.1,
    suppliers: [
      "ТрансЛогистик Восток",
      "РейлКарго Сервис",
      "АвтоЛайн Экспедиция",
      "ПортФлот Терминал",
      "Цистерна-Оператор",
      "МультиМодал НН",
    ],
    items: [
      ["Перевозка ж/д цистерна 60 т", "RAIL-60T", "рейс", 3180],
      ["Автоперевозка тент 20 т", "TRK-20T", "рейс", 1240],
      ["Перевалка на терминале", "TRM-HND", "тонна", 38],
      ["Аренда полувагона", "RAIL-GON", "сутки", 64],
      ["Экспедирование ВЭД", "FWD-EXP", "партия", 810],
    ],
  },
  {
    name: "ИТ и телеком",
    short: "ИТ",
    weight: 1.9,
    suppliers: [
      "СофтИнтегратор",
      "ДатаЛинк Системс",
      "КлаудХаб",
      "СерверПро Дистрибуция",
      "ИБ-Периметр",
    ],
    items: [
      ["Лицензия SCADA, годовая", "LIC-SCADA", "шт", 2450],
      ["Сервер 2U 2×CPU 512GB", "SRV-2U-512", "шт", 11800],
      ["Работы по интеграции", "SVC-INT", "чел-ч", 74],
      ["Канал связи 1 Гбит/с", "NET-1G", "мес", 1350],
      ["Подписка EDR, рабочее место", "LIC-EDR", "шт", 42],
    ],
  },
  {
    name: "Строительство и СМР",
    short: "СМР",
    weight: 3.4,
    suppliers: [
      "СтройМонтаж Индустрия",
      "ПромСтрой Альянс",
      "Изоляция-Сервис",
      "КранМонтажТех",
      "АнтикорЗащита",
      "ГенПодряд Восток",
    ],
    items: [
      ["Монтаж технологических трубопроводов", "SMR-PIP", "тонна", 1980],
      ["Изоляция теплотрасс", "SMR-ISO", "м²", 46],
      ["Антикоррозийное покрытие", "SMR-AKZ", "м²", 31],
      ["Аренда крана 100 т", "EQP-CRN", "смена", 1420],
      ["Строительные леса", "EQP-SCF", "м²·мес", 12],
    ],
  },
  {
    name: "Химсырьё и катализаторы",
    short: "Химсырьё",
    weight: 2.4,
    suppliers: [
      "КатализПром",
      "ХимРеагент Групп",
      "Оксид-Синтез",
      "Полимер Добавки",
      "СпецХим Трейд",
    ],
    items: [
      ["Катализатор гидрирования", "CAT-HYD", "кг", 148],
      ["Антиоксидант 1010", "ADD-1010", "кг", 11.4],
      ["Ингибитор коррозии", "CHM-INH", "кг", 7.9],
      ["Каустическая сода", "CHM-NAOH", "тонна", 612],
      ["Осушитель, молекулярные сита", "CHM-SIE", "кг", 9.2],
    ],
  },
  {
    name: "Энергия и утилиты",
    short: "Энергия",
    weight: 1.6,
    suppliers: ["ЭнергоСбыт Регион", "ТеплоГенерация", "ВодоканалСервис", "ГазПоставка ТК"],
    items: [
      ["Электроэнергия, пик", "UTL-EL-P", "МВт·ч", 58],
      ["Пар 13 бар", "UTL-STM", "тонна", 21],
      ["Техническая вода", "UTL-H2O", "м³", 0.9],
      ["Газ технологический", "UTL-GAS", "тыс. м³", 92],
    ],
  },
  {
    name: "Профессиональные услуги",
    short: "Услуги",
    weight: 1.1,
    suppliers: ["Аудит и Консалтинг ПРО", "Инжиниринг Бюро", "Лаборатория НК", "ЮрПартнёр"],
    items: [
      ["Консультационные услуги", "SVC-CNS", "чел-день", 720],
      ["Неразрушающий контроль", "SVC-NDT", "стык", 34],
      ["Проектные работы", "SVC-DSG", "чел-ч", 58],
      ["Юридическое сопровождение", "SVC-LEG", "чел-ч", 96],
    ],
  },
  {
    name: "Упаковка и тара",
    short: "Упаковка",
    weight: 0.8,
    suppliers: ["БигБэг Индустрия", "ПленкаПласт", "ПаллетПром", "ТараСнаб"],
    items: [
      ["Биг-бэг 1000 кг", "PKG-BB1000", "шт", 4.6],
      ["Плёнка стретч 23 мкм", "PKG-STR", "кг", 1.9],
      ["Поддон EUR", "PKG-PAL", "шт", 12.4],
      ["Мешок п/п 25 кг", "PKG-BAG", "тыс. шт", 168],
    ],
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

const CONTRACT_PREFIX = ["РД", "ДГ", "РС", "ДП"];

function makeInn() {
  // 77… — нейтральный московский префикс (не региональный код площадок)
  let s = "77";
  for (let i = 0; i < 8; i++) s += Math.floor(rnd() * 10);
  // Контрольная цифра намеренно неверная — номер не может совпасть с реальным ИНН
  const w = [2, 4, 10, 3, 5, 9, 4, 6, 8];
  const sum = w.reduce((acc, k, i) => acc + k * Number(s[i]), 0);
  const check = (sum % 11) % 10;
  return s.slice(0, 9) + ((check + 1) % 10);
}

function dateInQ3(_i: number) {
  const day = 1 + Math.floor(rnd() * 91);
  const d = new Date(Date.UTC(2025, 6, day));
  return d.toISOString().slice(0, 10);
}

// ---- Генерация поставщиков -------------------------------------------------

const suppliers: Supplier[] = [];
let sid = 0;
CATEGORIES.forEach((cat, ci) => {
  cat.suppliers.forEach((name, si) => {
    sid++;
    const base = cat.weight * between(0.35, 1.5);
    const offFlag = (si + ci) % 3 !== 2 ? rnd() < 0.52 : rnd() < 0.3;
    suppliers.push({
      id: "SUP-" + String(1000 + sid),
      name,
      inn: makeInn(),
      category: cat.name,
      spend: base,
      offAmount: 0,
      coverage: 1,
      offContract: offFlag,
      reason: offFlag ? pick(REASONS) : null,
      owner: OWNERS[(si * 3 + ci) % OWNERS.length],
      poCount: 0,
      contract: offFlag && rnd() < 0.4 ? null : `${pick(CONTRACT_PREFIX)}-2024-${1200 + sid}`,
      since: 2012 + Math.floor(rnd() * 12),
      risk: offFlag ? (rnd() < 0.35 ? "Высокий" : "Средний") : rnd() < 0.2 ? "Средний" : "Низкий",
    });
  });
});

// ровно 34 поставщика вне контракта
const flagged = suppliers.filter((s) => s.offContract);
flagged.sort((a, b) => b.spend - a.spend);
flagged.forEach((s, i) => {
  if (i >= 34) {
    s.offContract = false;
    s.reason = null;
  }
});
let idx = 0;
while (suppliers.filter((s) => s.offContract).length < 34 && idx < suppliers.length) {
  const s = suppliers[idx++];
  if (!s.offContract) {
    s.offContract = true;
    s.reason = REASONS[idx % REASONS.length];
  }
}

// эталонный кейс из брифа: 12 заказов на 640 тыс. $ полностью вне контракта
const TOTAL_SPEND = 18_400_000;
const OFF_TOTAL = 2_024_000;
const HERO_SPEND = 640_000;

const hero = suppliers.find((s) => s.name === "ПромАрматура-Урал")!;
hero.offContract = true;
hero.reason = "Нет контракта";
hero.contract = null;
hero.owner = "А. Волкова";
hero.risk = "Высокий";
hero.poCount = 12;

// масштабирование остальных поставщиков так, чтобы итог был ровно 18,4 млн $
const others = suppliers.filter((s) => s !== hero);
const rawSum = others.reduce((a, s) => a + s.spend, 0);
let acc = 0;
others.forEach((s, i) => {
  s.spend = Math.round((s.spend / rawSum) * (TOTAL_SPEND - HERO_SPEND));
  if (i === others.length - 1) s.spend += TOTAL_SPEND - HERO_SPEND - acc - s.spend;
  acc += s.spend;
});
hero.spend = HERO_SPEND;
hero.offAmount = HERO_SPEND;
hero.coverage = 0;

// сумма вне контракта у остальных — ровно (2,024 − 0,640) млн $
const offSuppliers = others.filter((s) => s.offContract);
const offBase = offSuppliers.reduce((a, s) => a + s.spend, 0);
let accOff = 0;
offSuppliers.forEach((s, i) => {
  const jitter = 0.5 + ((i * 37) % 100) / 100;
  s.offAmount = Math.max(4000, Math.round(Math.min(s.spend * 0.9, (s.spend / offBase) * (OFF_TOTAL - HERO_SPEND) * jitter)));
  accOff += s.offAmount;
});
const kOff = (OFF_TOTAL - HERO_SPEND) / accOff;
let accOff2 = 0;
offSuppliers.forEach((s, i) => {
  s.offAmount = Math.round(Math.min(s.spend * 0.94, s.offAmount * kOff));
  if (i === offSuppliers.length - 1) {
    s.offAmount = Math.max(0, Math.min(Math.round(s.spend * 0.94), OFF_TOTAL - HERO_SPEND - accOff2));
  }
  accOff2 += s.offAmount;
  s.coverage = 1 - s.offAmount / s.spend;
});

// ---- Генерация заказов -----------------------------------------------------

const pos: PO[] = [];
let poSeq = 4600;

function makeLines(cat: CatDef, amount: number, off: boolean, count: number, forceDelta?: number): POLine[] {
  const lines: POLine[] = [];
  const weights: number[] = [];
  for (let i = 0; i < count; i++) weights.push(between(0.4, 1.4));
  const wsum = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < count; i++) {
    const item = cat.items[Math.floor(rnd() * cat.items.length)];
    const lineAmt = Math.round((weights[i] / wsum) * amount);
    const bench = item[3];
    const deviation = forceDelta !== undefined && i === 0 ? forceDelta : off ? between(-0.03, 0.28) : between(-0.06, 0.05);
    const unitPrice = bench * (1 + deviation);
    const qty = Math.max(1, Math.round(lineAmt / unitPrice));
    lines.push({
      id: `L${i + 1}`,
      item: item[0],
      code: item[1],
      qty,
      unit: item[2],
      unitPrice: Math.round(unitPrice * 100) / 100,
      benchmark: bench,
      amount: Math.round(qty * unitPrice),
      offContract: off && deviation > 0.06,
    });
  }
  // сводим сумму строк ровно к сумме заказа
  const diff = amount - lines.reduce((a, l) => a + l.amount, 0);
  const last = lines[lines.length - 1];
  last.amount = Math.max(1, last.amount + diff);
  last.qty = Math.max(1, Math.round(last.amount / last.unitPrice));
  last.unitPrice = Math.round((last.amount / last.qty) * 100) / 100;
  return lines;
}

function makeApprovals(off: boolean, amount: number, date: string): Approval[] {
  const a1 = pick(OWNERS);
  let a2 = pick(OWNERS);
  while (a2 === a1) a2 = pick(OWNERS);
  const list: Approval[] = [
    { name: a1, role: "Руководитель направления", at: date + " 09:41", note: "Согласовано по лимиту" },
    { name: a2, role: "Менеджер по категории", at: date + " 14:07", note: off ? "Проверка контракта не выполнена" : "Контракт подтверждён" },
  ];
  if (amount > 120_000) {
    list.push({ name: pick(OWNERS), role: "Директор по закупкам", at: date + " 17:22", note: "Согласовано сверх лимита" });
  }
  return list;
}

suppliers.forEach((s) => {
  const cat = CATEGORIES.find((c) => c.name === s.category)!;
  const count = s.poCount || Math.max(3, Math.min(18, Math.round(s.spend / between(28_000, 90_000))));
  s.poCount = count;
  const weights: number[] = [];
  for (let i = 0; i < count; i++) weights.push(between(0.5, 1.6));
  const wsum = weights.reduce((a, b) => a + b, 0);
  let offLeft = s.offAmount;
  for (let i = 0; i < count; i++) {
    poSeq += Math.max(1, Math.floor(rnd() * 7));
    const amount = Math.round((weights[i] / wsum) * s.spend);
    // распределяем сумму вне контракта по части заказов
    let offAmount = 0;
    const offShareHere = s.coverage === 0 ? amount : Math.min(offLeft, Math.round(amount * (rnd() < 0.62 ? between(0.5, 1) : 0)));
    offAmount = Math.max(0, Math.min(offLeft, offShareHere));
    offLeft -= offAmount;
    const off = offAmount > amount * 0.25;
    const date = dateInQ3(i);
    pos.push({
      id: `PO-2025-0${poSeq}`,
      supplierId: s.id,
      supplier: s.name,
      category: s.category,
      owner: rnd() < 0.68 ? s.owner : pick(OWNERS),
      site: pick(SITES),
      date,
      amount,
      offAmount,
      offContract: off,
      reason: off ? s.reason ?? pick(REASONS) : null,
      contract: off ? null : s.contract,
      lines: makeLines(cat, amount, off, 2 + Math.floor(rnd() * 3)),
      approvals: makeApprovals(off, amount, date),
    });
  }
  // остаток вне контракта — на первый заказ
  if (offLeft > 0) {
    const p = pos.filter((p) => p.supplierId === s.id).sort((a, b) => b.amount - a.amount)[0];
    if (p) {
      p.offAmount = Math.min(p.amount, p.offAmount + offLeft);
      p.offContract = true;
      p.reason = p.reason ?? s.reason ?? "Нет контракта";
      p.contract = null;
    }
  }
});

// у каждого поставщика вне контракта должен быть хотя бы один помеченный заказ
suppliers
  .filter((s) => s.offAmount > 0)
  .forEach((s) => {
    const own = pos.filter((p) => p.supplierId === s.id);
    if (own.some((p) => p.offContract)) return;
    const target = own.sort((a, b) => b.offAmount - a.offAmount || b.amount - a.amount)[0];
    if (!target) return;
    target.offContract = true;
    target.reason = s.reason ?? "Нет контракта";
    target.contract = null;
    if (target.offAmount === 0) {
      const move = Math.min(target.amount, s.offAmount);
      target.offAmount = move;
    }
  });

// эталонный заказ из брифа: клапаны МТР, +23 % к согласованной цене
const heroPos = pos.filter((p) => p.supplierId === hero.id);
const heroPO = heroPos.sort((a, b) => b.amount - a.amount)[0];
heroPO.id = "PO-2025-04871";
heroPO.date = "2025-08-14";
heroPO.owner = "А. Волкова";
heroPO.site = "Альфа";
heroPO.reason = "Нет контракта";
heroPO.offContract = true;
heroPO.contract = null;
heroPO.approvals = [
  { name: "А. Волкова", role: "Менеджер по категории", at: "2025-08-14 09:41", note: "Создан заказ, срочная потребность" },
  { name: "М. Новиков", role: "Руководитель направления", at: "2025-08-14 11:12", note: "Согласовано без проверки контракта" },
  { name: "О. Фёдорова", role: "Начальник ремонтной службы", at: "2025-08-14 16:03", note: "Согласовано без проверки контракта" },
];
heroPO.lines = [
  {
    id: "L1",
    item: "Клапан регулирующий DN80 PN40",
    code: "VLV-080-40",
    qty: 24,
    unit: "шт",
    unitPrice: 2263.2,
    benchmark: 1840,
    amount: 54317,
    offContract: true,
  },
  {
    id: "L2",
    item: "Задвижка стальная DN150",
    code: "VLV-150-ST",
    qty: 12,
    unit: "шт",
    unitPrice: 2761.2,
    benchmark: 2360,
    amount: 33134,
    offContract: true,
  },
  {
    id: "L3",
    item: "Уплотнение торцевое SIC/SIC",
    code: "SEL-SIC-70",
    qty: 30,
    unit: "компл",
    unitPrice: 968.2,
    benchmark: 940,
    amount: 29046,
    offContract: false,
  },
  {
    id: "L4",
    item: "Фланец воротниковый DN100",
    code: "FLG-100-16",
    qty: 140,
    unit: "шт",
    unitPrice: 112.3,
    benchmark: 96,
    amount: 15722,
    offContract: true,
  },
];
heroPO.amount = heroPO.lines.reduce((a, l) => a + l.amount, 0);
heroPO.offAmount = heroPO.amount;

// остальные 11 заказов эталонного поставщика пересобираем так,
// чтобы суммарно по поставщику осталось ровно 640 тыс. $
{
  const heroCat = CATEGORIES.find((c) => c.name === hero.category)!;
  const rest = pos.filter((p) => p.supplierId === hero.id && p.id !== heroPO.id);
  const target = HERO_SPEND - heroPO.amount;
  const cur = rest.reduce((a, p) => a + p.amount, 0) || 1;
  let accRest = 0;
  rest.forEach((p, i) => {
    let amt = Math.max(3200, Math.round((p.amount / cur) * target));
    if (i === rest.length - 1) amt = Math.max(1000, target - accRest);
    accRest += amt;
    p.amount = amt;
    p.offAmount = amt;
    p.offContract = true;
    p.reason = "Нет контракта";
    p.contract = null;
    p.lines = makeLines(heroCat, amt, true, 2 + (i % 3));
  });
}

export const SUPPLIERS = suppliers;
export const POS = pos;
export const HERO_SUPPLIER_ID = hero.id;
export const HERO_PO_ID = heroPO.id;

export const TOTALS = {
  spend: POS.reduce((a, p) => a + p.amount, 0),
  off: POS.reduce((a, p) => a + p.offAmount, 0),
  offSuppliers: SUPPLIERS.filter((s) => s.offContract).length,
  pos: POS.length,
};

export const QUARTER_TREND = [
  { q: "Q4 2024", coverage: 0.81 },
  { q: "Q1 2025", coverage: 0.84 },
  { q: "Q2 2025", coverage: 0.86 },
  { q: "Q3 2025", coverage: 0.89 },
];

export type ActionType = "Пересмотр условий" | "Подключение к контракту" | "Блокировка поставщика" | "Запрос обоснования";

export const ACTION_TYPES: ActionType[] = [
  "Пересмотр условий",
  "Подключение к контракту",
  "Блокировка поставщика",
  "Запрос обоснования",
];

export type Action = {
  id: string;
  type: ActionType;
  supplierId: string;
  supplier: string;
  poId: string | null;
  assignee: string;
  due: string;
  value: number;
  note: string;
  status: "Назначено" | "В работе" | "Закрыто";
  created: string;
};

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  event: string;
  detail: string;
  scope: string;
};

export const SEED_ACTIONS: Action[] = [
  {
    id: "ACT-2041",
    type: "Подключение к контракту",
    supplierId: SUPPLIERS[3].id,
    supplier: SUPPLIERS[3].name,
    poId: null,
    assignee: "К. Лебедев",
    due: "2025-10-10",
    value: Math.round(SUPPLIERS[3].offAmount || 84000),
    note: "Перевести номенклатуру на рамочное соглашение РД-2024-1188.",
    status: "В работе",
    created: "2025-09-22",
  },
  {
    id: "ACT-2042",
    type: "Пересмотр условий",
    supplierId: SUPPLIERS[9].id,
    supplier: SUPPLIERS[9].name,
    poId: null,
    assignee: "Н. Зайцева",
    due: "2025-10-03",
    value: Math.round(SUPPLIERS[9].offAmount || 61000),
    note: "Тариф выше бенчмарка на 14 %, вынести на переговоры.",
    status: "Назначено",
    created: "2025-09-24",
  },
];

export const SEED_AUDIT: AuditEvent[] = [
  { id: "A-9001", at: "2025-09-25 08:14", actor: "Система", event: "Загрузка данных ERP", detail: "Импортировано 1 248 строк заказов, период 01.07–30.09", scope: "Квартал" },
  { id: "A-9002", at: "2025-09-25 08:16", actor: "Система", event: "Сверка с реестром договоров", detail: "Сопоставлено 89,0 % расходов, 11,0 % без согласованных условий", scope: "Квартал" },
  { id: "A-9003", at: "2025-09-24 17:40", actor: "Н. Зайцева", event: "Назначено действие ACT-2042", detail: "Пересмотр условий, срок 03.10.2025", scope: "Поставщик" },
  { id: "A-9004", at: "2025-09-22 12:05", actor: "К. Лебедев", event: "Назначено действие ACT-2041", detail: "Подключение к контракту, срок 10.10.2025", scope: "Поставщик" },
  { id: "A-9005", at: "2025-09-19 10:31", actor: "А. Волкова", event: "Комментарий к заказу PO-2025-04871", detail: "Срочная потребность ремонтной службы, контракт не проверен", scope: "Заказ" },
];
