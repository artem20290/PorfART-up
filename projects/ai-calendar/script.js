const monthYearElement = document.getElementById('monthYear');
const daysContainer = document.getElementById('daysContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const prevYearBtn = document.getElementById('prevYearBtn');
const nextYearBtn = document.getElementById('nextYearBtn');
const yearButtonsContainer = document.querySelector('.year-buttons');
const currentDateElement = document.getElementById('currentDate');
const weekLabelElement = document.querySelector('.week-label');
const weekdaysContainer = document.querySelector('.weekdays');

let currentDate = new Date();
let markedDates = {};
let calendarMode = 'days'; // days | months


// Быстрый tooltip для праздников (кастомный, чтобы не ждать системную подсказку)
let holidayTooltipEl = null;
let holidayTooltipTimer = null;
let holidayTooltipTarget = null;
let reminderEditorEl = null;
let reminderEditorDate = null;
let reminderEditorTarget = null;

// ---------------------- Праздники и выходные ----------------------
// Федеральные нерабочие праздничные дни РФ (ст. 112 ТК РФ)
let FEDERAL_HOLIDAYS_FIXED = [
    { m: 1, d: 1, name: 'Новый год (каникулы)' },
    { m: 1, d: 2, name: 'Новогодние каникулы' },
    { m: 1, d: 3, name: 'Новогодние каникулы' },
    { m: 1, d: 4, name: 'Новогодние каникулы' },
    { m: 1, d: 5, name: 'Новогодние каникулы' },
    { m: 1, d: 6, name: 'Новогодние каникулы' },
    { m: 1, d: 7, name: 'Рождество Христово' },
    { m: 1, d: 8, name: 'Новогодние каникулы' },
    { m: 2, d: 23, name: 'День защитника Отечества' },
    { m: 3, d: 8, name: 'Международный женский день' },
    { m: 5, d: 1, name: 'Праздник Весны и Труда' },
    { m: 5, d: 9, name: 'День Победы' },
    { m: 5, d: 11, name: 'Выходной день' },
    { m: 6, d: 12, name: 'День России' },
    { m: 11, d: 4, name: 'День народного единства' },
    { m: 12, d: 31, name: 'Выходной день' },
];

// Региональные праздники (фиксированные)
let REGIONAL_FIXED = [];

// Региональные праздники по годам: { 2026: [{ m, d, name }] }
let REGIONAL_BY_YEAR = {};

// ---------------------- Корпоративные и профессиональные праздники ----------------------
// Дни основания предприятий (фиксированные)
const COMPANY_FOUNDATION_DAYS = [
    { m: 2, d: 11, name: 'SB — День основания' },
    { m: 3, d: 16, name: 'Завод «Альфа» — День основания' },
    { m: 4, d: 8, name: 'Завод «Бета» — День основания' },
    { m: 5, d: 14, name: 'Завод «Гамма» — День основания' },
    { m: 6, d: 10, name: 'Завод «Дельта» — День основания' },
    { m: 7, d: 22, name: 'Завод «Эпсилон» — День основания' },
    { m: 8, d: 26, name: 'Комплекс «Зета» — День основания' },
    { m: 9, d: 3, name: 'Завод «Эта» — День основания' },
    { m: 10, d: 7, name: 'Завод «Тета» — День основания' },
    { m: 10, d: 23, name: 'Завод «Йота» — День основания' },
    { m: 11, d: 12, name: 'Завод «Каппа» — День основания' },
    { m: 12, d: 4, name: 'Завод «Лямбда» — День основания' },
];

// Профессиональные праздники (фиксированные даты)
const PROFESSIONAL_HOLIDAYS_FIXED = [
    { m: 6, d: 30, name: 'День экономиста' },
    { m: 9, d: 8, name: 'День финансиста' },
    { m: 5, d: 24, name: 'День кадрового работника (HR)' },
    { m: 5, d: 20, name: 'День метрологии' },
    { m: 5, d: 31, name: 'День химика ' },
    { m: 9, d: 9, name: 'День тестировщика (QA-инженера)' },
    { m: 9, d: 28, name: 'День работника атомной промышленности' },
    { m: 12, d: 22, name: 'День энергетика' },
    { m: 10, d: 30, name: 'День инженера' },
    { m: 11, d: 10, name: 'День бухгалтера' },
    { m: 12, d: 2, name: 'День банковского работника' },
    { m: 12, d: 3, name: 'День юриста' },
    { m: 12, d: 28, name: 'День аудитора' },
];

// Хелперы для "плавающих" праздников
function getLastWeekdayOfMonth(year, monthIndex0, weekday0) {
    const d = new Date(year, monthIndex0 + 1, 0); // последний день месяца
    while (d.getDay() !== weekday0) d.setDate(d.getDate() - 1);
    return d;
}

function getNthWeekdayOfMonth(year, monthIndex0, weekday0, n) {
    const d = new Date(year, monthIndex0, 1);
    let count = 0;
    while (true) {
        if (d.getDay() === weekday0) count++;
        if (count === n) return new Date(d);
        d.setDate(d.getDate() + 1);
    }
}

function getDayOfYearDate(year, dayOfYear1based) {
    const d = new Date(year, 0, 1);
    d.setDate(dayOfYear1based);
    return d;
}

function getProfessionalMovableHoliday(date) {
    const y = date.getFullYear();

    // День работника торговли — последняя суббота июля
    const tradeDay = getLastWeekdayOfMonth(y, 6, 6);

    // День химика — последнее воскресенье мая
    const chemistDay = getLastWeekdayOfMonth(y, 4, 0);

    // День работника нефтяной и газовой промышленности — первое воскресенье сентября
    const oilGasDay = getNthWeekdayOfMonth(y, 8, 0, 1);

    // День геолога — первое воскресенье апреля
    const geologistDay = getNthWeekdayOfMonth(y, 3, 0, 1);

    // День работников газовой промышленности — третье воскресенье октября
    const gasIndustryDay = getNthWeekdayOfMonth(y, 9, 0, 3);

    // День машиностроителя — последнее воскресенье сентября
    const machinistDay = getLastWeekdayOfMonth(y, 8, 0);

    // День изобретателя и рационализатора — последняя суббота июня
    const inventorDay = getLastWeekdayOfMonth(y, 5, 6);

    // День системного администратора — последняя пятница июля
    const sysAdminDay = getLastWeekdayOfMonth(y, 6, 5);

    // День безопасного интернета — второй вторник февраля
    const saferInternetDay = getNthWeekdayOfMonth(y, 1, 2, 2);

    // День программиста — 256-й день года (в високосный год — 255-й)
    const isLeap = (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));
    const programmerDay = getDayOfYearDate(y, isLeap ? 255 : 256);

    const rules = [
        { date: tradeDay, name: 'День работника торговли' },
        { date: chemistDay, name: 'День химика' },
        { date: oilGasDay, name: 'День работника нефтяной и газовой промышленности' },
        { date: geologistDay, name: 'День геолога' },
        { date: gasIndustryDay, name: 'День работников газовой промышленности' },
        { date: machinistDay, name: 'День машиностроителя' },
        { date: inventorDay, name: 'День инженера' },
        { date: sysAdminDay, name: 'День системного администратора (SysAdmin Day)' },
        { date: saferInternetDay, name: 'День безопасного интернета' },
        { date: programmerDay, name: 'День программиста' },
    ];

    return rules.find(r =>
        r.date.getFullYear() === date.getFullYear() &&
        r.date.getMonth() === date.getMonth() &&
        r.date.getDate() === date.getDate()
    ) || null;
}

function getHolidayInfo(date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    // федеральные
    const fed = FEDERAL_HOLIDAYS_FIXED.find(x => x.m === m && x.d === d);
    if (fed) return { name: fed.name, kind: 'holiday', scope: 'RF' };

    // региональные
    const regFixed = REGIONAL_FIXED.find(x => x.m === m && x.d === d);
    if (regFixed) return { name: regFixed.name, kind: 'holiday', scope: 'REG' };

    const byYear = REGIONAL_BY_YEAR[y];
    const regMovable = Array.isArray(byYear) ? byYear.find(x => x.m === m && x.d === d) : null;
    if (regMovable) return { name: regMovable.name, kind: 'holiday', scope: 'REG' };



    // корпоративные даты (SB) — дни основания предприятий
    const corp = COMPANY_FOUNDATION_DAYS.find(x => x.m === m && x.d === d);
    if (corp) return { name: corp.name, kind: 'holiday', scope: 'CORP' };
    
    // профессиональные (фиксированные)
    const profFixed = PROFESSIONAL_HOLIDAYS_FIXED.find(x => x.m === m && x.d === d);
    if (profFixed) return { name: profFixed.name, kind: 'holiday', scope: 'PRO' };
    
    // профессиональные (плавающие)
    const profMovable = getProfessionalMovableHoliday(date);
    if (profMovable) return { name: profMovable.name, kind: 'holiday', scope: 'PRO' };

    return null;
}

function isWeekend(date) {
    const day = date.getDay(); // 0 вс, 6 сб
    return day === 0 || day === 6;
}

// ISO-неделя (Пн — первый день недели)
function getISOWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

function applyDayClassesAndTooltip(dayElement, date) {
    const holiday = getHolidayInfo(date);
    if (holiday) {
        dayElement.classList.add('holiday');
        if (holiday.scope === 'CORP' || holiday.scope === 'PRO') dayElement.classList.add('corp-holiday');

        // "Выходной праздник" — для указанных нерабочих праздников (федеральные + региональные),
        // даже если дата выпадает на будний день.
        const isDayOffHoliday = (holiday.scope === 'RF' || holiday.scope === 'REG');

        const tooltipText = isDayOffHoliday
            ? `Выходной: ${holiday.name}`
            : (isWeekend(date) ? `Выходной: ${holiday.name}` : holiday.name);

        // Не используем title, чтобы не появлялась стандартная подсказка браузера с задержкой.
        dayElement.setAttribute('data-holiday-tooltip', tooltipText);

        const ariaPrefix = isDayOffHoliday ? 'Выходной праздник. ' : (isWeekend(date) ? 'Выходной. ' : '');
        dayElement.setAttribute('aria-label', `${dayElement.getAttribute('aria-label')}. ${ariaPrefix}Праздник: ${holiday.name}`);
    } else if (isWeekend(date)) {
        dayElement.classList.add('weekend');
        // Для выходных используем тот же быстрый tooltip (показывается сверху курсора)
        dayElement.setAttribute('data-holiday-tooltip', 'Выходной');
        dayElement.setAttribute('aria-label', `${dayElement.getAttribute('aria-label')}. Выходной`);
    }
}

function ensureHolidayTooltip() {
    if (holidayTooltipEl) return;
    holidayTooltipEl = document.createElement('div');
    holidayTooltipEl.className = 'holiday-tooltip';
    holidayTooltipEl.setAttribute('role', 'tooltip');
    holidayTooltipEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(holidayTooltipEl);
}

function showHolidayTooltip(text, clientX, clientY) {
    ensureHolidayTooltip();
    holidayTooltipEl.textContent = text;
    // Сверху курсора (чуть выше и по центру)
    const offsetY = 12;
    const offsetX = 6;

    // Сначала ставим примерно, потом подстраиваем по размерам
    holidayTooltipEl.style.left = `${clientX + offsetX}px`;
    holidayTooltipEl.style.top = `${clientY - offsetY}px`;

    // Подгоняем так, чтобы tooltip уходил вверх от курсора
    const rect = holidayTooltipEl.getBoundingClientRect();
    const left = Math.max(8, Math.min(clientX - rect.width / 2, window.innerWidth - rect.width - 8));
    const top = Math.max(8, clientY - rect.height - 12);
    holidayTooltipEl.style.left = `${left}px`;
    holidayTooltipEl.style.top = `${top}px`;

    holidayTooltipEl.classList.add('show');
    holidayTooltipEl.setAttribute('aria-hidden', 'false');
}

function hideHolidayTooltip() {
    if (!holidayTooltipEl) return;
    holidayTooltipEl.classList.remove('show');
    holidayTooltipEl.setAttribute('aria-hidden', 'true');
}

function ensureReminderEditor() {
    if (reminderEditorEl) return reminderEditorEl;

    const editor = document.createElement('div');
    editor.className = 'reminder-editor';
    editor.setAttribute('aria-hidden', 'true');
    editor.innerHTML = `
        <textarea class="reminder-editor-input" maxlength="300" placeholder="Введите напоминание..."></textarea>
        <div class="reminder-editor-actions">
            <button type="button" class="reminder-save-btn">Сохранить</button>
            <button type="button" class="reminder-cancel-btn">Отмена</button>
        </div>
    `;

    const saveBtn = editor.querySelector('.reminder-save-btn');
    const cancelBtn = editor.querySelector('.reminder-cancel-btn');
    const input = editor.querySelector('.reminder-editor-input');

    if (saveBtn instanceof HTMLElement) {
        saveBtn.addEventListener('click', async () => {
            if (!reminderEditorDate || !(input instanceof HTMLTextAreaElement)) return;
            const text = input.value.trim();
            if (!text) {
                hideReminderEditor();
                return;
            }
            await setDateReminder(reminderEditorDate, text);
            hideReminderEditor();
        });
    }

    if (cancelBtn instanceof HTMLElement) {
        cancelBtn.addEventListener('click', () => hideReminderEditor());
    }

    if (input instanceof HTMLTextAreaElement) {
        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                hideReminderEditor();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const text = input.value.trim();
                if (reminderEditorDate && text) {
                    await setDateReminder(reminderEditorDate, text);
                }
                hideReminderEditor();
            }
        });
    }

    document.body.appendChild(editor);
    reminderEditorEl = editor;
    return reminderEditorEl;
}

function hideReminderEditor() {
    if (!reminderEditorEl) return;
    reminderEditorEl.classList.remove('show');
    reminderEditorEl.setAttribute('aria-hidden', 'true');
    reminderEditorDate = null;
    reminderEditorTarget = null;
}

function showReminderEditor(dayElement, date) {
    const editor = ensureReminderEditor();
    const input = editor.querySelector('.reminder-editor-input');
    if (!(input instanceof HTMLTextAreaElement)) return;

    input.value = getDateReminder(date);

    const dayRect = dayElement.getBoundingClientRect();
    const editorWidth = 230;
    const estimatedHeight = 118;
    const margin = 8;
    const left = Math.max(8, Math.min(dayRect.left + dayRect.width / 2 - editorWidth / 2, window.innerWidth - editorWidth - 8));
    let top = dayRect.top - estimatedHeight - margin;
    if (top < 8) {
        top = dayRect.bottom + margin;
    }

    editor.style.width = `${editorWidth}px`;
    editor.style.left = `${left}px`;
    editor.style.top = `${top}px`;
    editor.classList.add('show');
    editor.setAttribute('aria-hidden', 'false');
    reminderEditorDate = new Date(date);
    reminderEditorTarget = dayElement;

    setTimeout(() => {
        input.focus();
        input.select();
    }, 0);
}

function scheduleHolidayTooltip(targetEl, e) {
    const text = targetEl?.getAttribute('data-holiday-tooltip');
    if (!text) return;

    if (holidayTooltipTimer) {
        clearTimeout(holidayTooltipTimer);
        holidayTooltipTimer = null;
    }

    holidayTooltipTarget = targetEl;
    // Быстрее (по умолчанию у browser tooltip задержка заметно больше)
    holidayTooltipTimer = setTimeout(() => {
        holidayTooltipTimer = null;
        if (holidayTooltipTarget === targetEl) {
            showHolidayTooltip(text, e.clientX, e.clientY);
        }
    }, 120);
}

function updateHolidayTooltipPosition(e) {
    if (!holidayTooltipEl || !holidayTooltipEl.classList.contains('show')) return;
    // Обновляем позицию, чтобы подсказка "следовала" за курсором
    showHolidayTooltip(holidayTooltipEl.textContent, e.clientX, e.clientY);
}

function cancelHolidayTooltip() {
    if (holidayTooltipTimer) {
        clearTimeout(holidayTooltipTimer);
        holidayTooltipTimer = null;
    }
    holidayTooltipTarget = null;
    hideHolidayTooltip();
}

function isSameCalendarDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
 
function resetToRealDateAlways() {
    goToCurrentDate();
    updateRealDate();
}



async function loadHolidayData() {
    try {
        if (window.calendarAPI && typeof window.calendarAPI.getHolidayConfig === 'function') {
            const config = await window.calendarAPI.getHolidayConfig();
            if (config && typeof config === 'object') {
                FEDERAL_HOLIDAYS_FIXED = Array.isArray(config.federalFixed) ? config.federalFixed : FEDERAL_HOLIDAYS_FIXED;
                REGIONAL_FIXED = Array.isArray(config.regionalFixed) ? config.regionalFixed : REGIONAL_FIXED;
                REGIONAL_BY_YEAR = (config.regionalByYear && typeof config.regionalByYear === 'object')
                    ? config.regionalByYear
                    : REGIONAL_BY_YEAR;
            }
        }
    } catch (error) {
        console.error('Ошибка при загрузке внешнего holiday config:', error);
    }
}

const ASSET_BASE = 'assets/';

async function applyExternalAssetImage(imgId, assetFileName) {
    const img = document.getElementById(imgId);
    if (!img || !assetFileName) return;

    try {
        if (window.calendarAPI && typeof window.calendarAPI.getAssetImageDataUrl === 'function') {
            const dataUrl = await window.calendarAPI.getAssetImageDataUrl(assetFileName);
            if (dataUrl) {
                img.src = dataUrl;
                return;
            }
        }
    } catch (error) {
        console.error(`Ошибка при загрузке внешней картинки ${assetFileName}:`, error);
    }

    img.src = `${ASSET_BASE}${assetFileName}`;
}

async function applyExternalImages() {
    const blueSquareImg = document.getElementById('blueSquareImage');
    if (blueSquareImg) {
        try {
            if (window.calendarAPI && typeof window.calendarAPI.getBlueSquareImageDataUrl === 'function') {
                const dataUrl = await window.calendarAPI.getBlueSquareImageDataUrl();
                if (dataUrl) {
                    blueSquareImg.src = dataUrl;
                } else {
                    blueSquareImg.src = `${ASSET_BASE}blue-square.png`;
                }
            } else {
                blueSquareImg.src = `${ASSET_BASE}blue-square.png`;
            }
        } catch (error) {
            console.error('Ошибка при загрузке внешней картинки blue-square:', error);
            blueSquareImg.src = `${ASSET_BASE}blue-square.png`;
        }
    }

    await Promise.all([
        applyExternalAssetImage('vkusBtnIcon', 'vkus.png'),
        applyExternalAssetImage('plannerBtnIcon', 'planner.png')
    ]);
}

// Инициализация данных
async function initApp() {
    try {
        // Загрузка отмеченных дат и внешнего списка праздников
        await Promise.all([
            loadMarkedDates(),
            loadHolidayData()
        ]);
    } catch (error) {
        // В корпоративном режиме не используем localStorage как fallback-хранилище.
        console.error('Ошибка при инициализации/загрузке данных:', error);
        markedDates = {};
    }

    await applyExternalImages();

    // Инициализация календаря (даже если загрузка не удалась)
    renderCalendar();
    updateRealDate();
    setupEventListeners();
    setupQuickActions();

    console.log('Приложение инициализировано');
}

// Загрузка отмеченных дат
async function loadMarkedDates() {
    if (window.calendarAPI && typeof window.calendarAPI.getMarkedDates === 'function') {
        const savedDates = await window.calendarAPI.getMarkedDates();
        markedDates = savedDates || {};
        return;
    }
    // В корпоративном режиме не используем localStorage как fallback-хранилище.
    throw new Error('Storage API недоступно (calendarAPI.getMarkedDates)');
}

// Сохранение отмеченных дат
async function saveMarkedDates() {
    try {
        if (window.calendarAPI && typeof window.calendarAPI.saveMarkedDates === 'function') {
            const result = await window.calendarAPI.saveMarkedDates(markedDates);
            if (!result || result.success !== true) {
                throw new Error(result?.error || 'Не удалось сохранить данные');
            }
            return;
        }
        // В корпоративном режиме не используем localStorage как fallback-хранилище.
        throw new Error('Storage API недоступно (calendarAPI.saveMarkedDates)');
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
    }
}

// Обновление кнопок годов
function updateYearButtons() {
    const currentYear = currentDate.getFullYear();
    yearButtonsContainer.innerHTML = '';

    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
        const button = document.createElement('button');
        button.className = 'year-btn';
        button.textContent = i;
        button.setAttribute('data-year', i);
        button.setAttribute('aria-label', `Год ${i}`);

        if (i === currentYear) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            currentDate.setFullYear(i);
            renderCalendar();
        });

        yearButtonsContainer.appendChild(button);
    }
}

// Ключ даты
function getDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// Отметка/снятие отметки даты
async function toggleDateMark(date) {
    const dateKey = getDateKey(date);

    if (markedDates[dateKey]) {
        delete markedDates[dateKey];
    } else {
        markedDates[dateKey] = {
            marked: true,
            timestamp: Date.now(),
            color: '#008D97' // Цвет SB
        };
    }

    await saveMarkedDates();
    renderCalendar();
}

function isDateMarked(date) {
    const dateKey = getDateKey(date);
    return !!markedDates[dateKey];
}

function getDateReminder(date) {
    const dateKey = getDateKey(date);
    const entry = markedDates[dateKey];
    if (!entry || typeof entry.reminder !== 'string') return '';
    return entry.reminder.trim();
}

async function setDateReminder(date, reminderText) {
    const dateKey = getDateKey(date);
    const currentEntry = markedDates[dateKey] || {};
    const normalizedReminder = reminderText.trim();
    if (!normalizedReminder) return;

    markedDates[dateKey] = {
        ...currentEntry,
        marked: true,
        timestamp: Date.now(),
        color: currentEntry.color || '#008D97',
        reminder: normalizedReminder
    };

    await saveMarkedDates();
    renderCalendar();
}

function appendDayTooltip(dayElement, extraText) {
    if (!extraText) return;

    const existingTooltip = dayElement.getAttribute('data-holiday-tooltip');
    const tooltipText = existingTooltip ? `${existingTooltip}\n${extraText}` : extraText;

    dayElement.setAttribute('data-holiday-tooltip', tooltipText);
    dayElement.setAttribute('aria-label', `${dayElement.getAttribute('aria-label')}. ${extraText.replace(/\n/g, '. ')}`);
}

function parseRussianMonthName(name) {
    const value = name.toLowerCase().replace(/ё/g, 'е');
    if (/январ/.test(value)) return 0;
    if (/феврал/.test(value)) return 1;
    if (/март/.test(value)) return 2;
    if (/апрел/.test(value)) return 3;
    if (/^май|^мая|^мае/.test(value)) return 4;
    if (/^июн/.test(value)) return 5;
    if (/^июл/.test(value)) return 6;
    if (/август/.test(value)) return 7;
    if (/сентябр/.test(value)) return 8;
    if (/октябр/.test(value)) return 9;
    if (/ноябр/.test(value)) return 10;
    if (/декабр/.test(value)) return 11;
    return null;
}

function inferMeetingYear(day, month) {
    const now = new Date();
    let year = currentDate.getFullYear();
    const candidate = new Date(year, month, day);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (candidate < todayStart) year += 1;
    return year;
}

function normalizeMeetingParticipants(raw) {
    if (!raw) return '';

    return raw
        .replace(/\s+(?:и|with)\s+/gi, ', ')
        .split(/[,;]+/)
        .flatMap((part) => part.trim().split(/\s+/))
        .map((part) => part.trim())
        .filter(Boolean)
        .join(', ');
}

function parsePlannerMeetingCommand(text) {
    const raw = text.trim();
    if (!raw) return null;

    const normalized = raw.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ');
    const isMeetingCommand = /(создай|создать|запланир|назнач|оформ|добав).{0,24}встреч/.test(normalized)
        || /встреч.{0,24}(на|\d)/.test(normalized);
    if (!isMeetingCommand) return null;

    let day = null;
    let month = null;
    let year = null;

    const dayMonthMatch = normalized.match(
        /(\d{1,2})\s*(?:[-–]?(?:го|е|\.)?\s*)?(январ\w*|феврал\w*|март\w*|апрел\w*|ма[йя]\w*|июн\w*|июл\w*|август\w*|сентябр\w*|октябр\w*|ноябр\w*|декабр\w*)/
    );
    if (dayMonthMatch) {
        day = parseInt(dayMonthMatch[1], 10);
        month = parseRussianMonthName(dayMonthMatch[2]);
    }

    if (day === null || month === null) {
        const numericMatch = normalized.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/);
        if (numericMatch) {
            day = parseInt(numericMatch[1], 10);
            month = parseInt(numericMatch[2], 10) - 1;
            if (numericMatch[3]) {
                year = parseInt(numericMatch[3], 10);
                if (year < 100) year += 2000;
            }
        }
    }

    if (day === null || month === null) return null;

    const yearMatch = normalized.match(/\b(20\d{2})\b/);
    if (yearMatch) year = parseInt(yearMatch[1], 10);
    if (!year) year = inferMeetingYear(day, month);

    let topic = '';
    const topicMatch = raw.match(/(?:тема(?:\s+встречи)?|по\s+теме)\s*[:\-–]?\s*(.+?)(?=(?:,\s*)?(?:участник|с\s+участник)|$)/i);
    if (topicMatch) topic = topicMatch[1].trim();

    let participants = '';
    const participantsMatch = raw.match(/(?:участник\w*|с\s+участник\w*)\s*[:\-–]?\s*(.+)$/i);
    if (participantsMatch) participants = normalizeMeetingParticipants(participantsMatch[1]);

    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;

    return { date, topic, participants };
}

async function createMeetingFromPlanner({ date, topic, participants }) {
    const dateKey = getDateKey(date);

    markedDates[dateKey] = {
        marked: true,
        timestamp: Date.now(),
        color: '#008D97',
        meetingTopic: topic.slice(0, 200),
        meetingParticipants: participants.slice(0, 500)
    };

    await saveMarkedDates();
    currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    calendarMode = 'days';
    renderCalendar();
}

async function tryApplyPlannerMeetingCommand(text) {
    const parsed = parsePlannerMeetingCommand(text);
    if (!parsed) return false;

    await createMeetingFromPlanner(parsed);
    return true;
}

function getMeetingEntry(date) {
    const entry = markedDates[getDateKey(date)];
    if (!entry) return null;
    if (!entry.meetingTopic && !entry.meetingParticipants) return null;

    return {
        topic: typeof entry.meetingTopic === 'string' ? entry.meetingTopic.trim() : '',
        participants: typeof entry.meetingParticipants === 'string' ? entry.meetingParticipants.trim() : ''
    };
}

function applyMeetingTooltip(dayElement, date) {
    const meeting = getMeetingEntry(date);
    if (!meeting) return;

    const lines = ['Встреча создана'];
    if (meeting.topic) lines.push(`Тема: ${meeting.topic}`);
    if (meeting.participants) lines.push(`Участники: ${meeting.participants}`);

    appendDayTooltip(dayElement, lines.join('\n'));
}

function applyReminderTooltip(dayElement, date) {
    const reminder = getDateReminder(date);
    if (!reminder) return;

    appendDayTooltip(dayElement, `Напоминание: ${reminder}`);
}

function getDateFromDayElement(dayElement) {
    if (!(dayElement instanceof HTMLElement)) return null;
    const isoDate = dayElement.getAttribute('data-date-iso');
    if (!isoDate) return null;
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
}

function goToCurrentDate() {
    currentDate = new Date();
    renderCalendar();
    console.log('Переход к текущей дате:', currentDate);
}

function markDay(dayElement, dayNumber, month, year) {
    let actualYear = year;
    let actualMonth = month;

    if (month < 0) {
        actualYear = year - 1;
        actualMonth = 11;
    } else if (month > 11) {
        actualYear = year + 1;
        actualMonth = 0;
    } else {
        actualMonth = month;
    }

    const date = new Date(actualYear, actualMonth, dayNumber);
    toggleDateMark(date);
}

function updateRealDate() {
    const now = new Date();

    const datePartRaw = now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }); // пример: "четверг, 12 февраля 2026 г."

    const datePart = datePartRaw
        ? (datePartRaw.charAt(0).toUpperCase() + datePartRaw.slice(1))
        : datePartRaw;

    const timePart = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    }); // "11:34"

    currentDateElement.textContent = `${datePart} ${timePart}`;
}

function updateTodayHighlight() {
    const today = new Date();
    const days = daysContainer.querySelectorAll('.current-month');

    days.forEach(day => {
        day.classList.remove('today');
    });

    days.forEach(day => {
        const dayNumber = parseInt(day.textContent, 10);
        if (currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            dayNumber === today.getDate()) {
            day.classList.add('today');
        }
    });
}

function updateMarkedDates() {
    const days = daysContainer.querySelectorAll('.current-month, .other-month');

    days.forEach(day => {
        day.classList.remove('marked');

        const dayNumber = parseInt(day.textContent, 10);
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();

        if (day.classList.contains('other-month')) {
            if (dayNumber > 20) {
                if (month === 0) {
                    year--;
                    month = 11;
                } else {
                    month--;
                }
            } else {
                if (month === 11) {
                    year++;
                    month = 0;
                } else {
                    month++;
                }
            }
        }

        const date = new Date(year, month, dayNumber);
        if (isDateMarked(date)) {
            day.classList.add('marked');
        }
    });
}


function renderCalendar() {
    if (calendarMode === 'months') {
        renderMonthPicker();
        return;
    }
    daysContainer.classList.remove('month-picker-mode');
    if (weekdaysContainer) weekdaysContainer.classList.remove('month-picker-mode');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    updateYearButtons();

    monthYearElement.textContent = `${currentDate.toLocaleString('ru-RU', { month: 'long' })} ${year}`;
    monthYearElement.setAttribute('aria-label', `Календарь на ${monthYearElement.textContent}. Нажмите, чтобы выбрать месяц`);

    daysContainer.innerHTML = '';

    const firstOfMonth = new Date(year, month, 1);
    const firstDayIndex = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1; // Пн=0 ... Вс=6

    // Дата, с которой начинается сетка (понедельник первой отображаемой недели)
    const gridStart = new Date(year, month, 1);
    gridStart.setDate(gridStart.getDate() - firstDayIndex);

    // Рисуем столько недель, сколько нужно для месяца (5 или 6)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeksCount = Math.ceil((firstDayIndex + daysInMonth) / 7);

    for (let week = 0; week < weeksCount; week++) {
        const weekStart = new Date(gridStart);
        weekStart.setDate(gridStart.getDate() + week * 7);

        // Ячейка номера недели
        const weekCell = document.createElement('div');
        weekCell.classList.add('week-number');
        const isoWeek = getISOWeekNumber(weekStart);
        weekCell.textContent = `${isoWeek}`;
        weekCell.setAttribute('aria-label', `Неделя ${isoWeek}`);
        daysContainer.appendChild(weekCell);

        // 7 дней недели
        for (let dow = 0; dow < 7; dow++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + dow);

            const dayElement = document.createElement('div');
            dayElement.textContent = date.getDate();
            dayElement.setAttribute('role', 'button');
            dayElement.setAttribute('tabindex', '0');
            dayElement.setAttribute('data-date-iso', date.toISOString());

            const inCurrentMonth = date.getMonth() === month;
            dayElement.classList.add(inCurrentMonth ? 'current-month' : 'other-month');

            const ariaBase = inCurrentMonth
                ? `День ${date.getDate()}`
                : `День ${date.getDate()} другого месяца`;
            dayElement.setAttribute('aria-label', ariaBase);

            // Выходные/праздники + tooltip
            applyDayClassesAndTooltip(dayElement, date);
            applyMeetingTooltip(dayElement, date);
            applyReminderTooltip(dayElement, date);

            // Клики/клавиатура для отметок (двойной клик / Enter / Space)
            addDayClickHandlers(dayElement, date.getDate(), date.getMonth(), date.getFullYear());

            daysContainer.appendChild(dayElement);
        }
    }

    updateTodayHighlight();
    updateMarkedDates();
}

function renderMonthPicker() {
    const year = currentDate.getFullYear();
    updateYearButtons();

    monthYearElement.textContent = `Выбор месяца ${year}`;
    monthYearElement.setAttribute('aria-label', `Выбор месяца на ${year} год. Нажмите, чтобы вернуться к календарю`);
    daysContainer.innerHTML = '';
    daysContainer.classList.add('month-picker-mode');
    if (weekdaysContainer) weekdaysContainer.classList.add('month-picker-mode');

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    monthNames.forEach((monthName, monthIndex) => {
        const monthElement = document.createElement('div');
        monthElement.className = 'month-cell';
        monthElement.textContent = monthName;
        monthElement.setAttribute('role', 'button');
        monthElement.setAttribute('tabindex', '0');
        monthElement.setAttribute('aria-label', `Открыть ${monthName} ${year}`);

        if (monthIndex === currentDate.getMonth()) {
            monthElement.classList.add('active-month');
        }

        const openMonth = () => {
            currentDate.setMonth(monthIndex);
            calendarMode = 'days';
            if (weekLabelElement) weekLabelElement.textContent = 'Неделя';
            daysContainer.classList.remove('month-picker-mode');
            renderCalendar();
        };

        monthElement.addEventListener('click', openMonth);
        monthElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMonth();
            }
        });

        daysContainer.appendChild(monthElement);
    });
}


function addDayClickHandlers(dayElement, dayNumber, month, year) {
    let clickTimer = null;

    const clickedDate = () => new Date(year, month, dayNumber);

    dayElement.addEventListener('click', (e) => {        if (e.detail === 1) {
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
            }
            clickTimer = setTimeout(() => {
                clickTimer = null;
                // Одиночный левый клик - только фокусировка
                dayElement.focus();
            }, 300);
        }
    });

    dayElement.addEventListener('dblclick', (e) => {
        e.preventDefault();        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
        }
        markDay(dayElement, dayNumber, month, year);
    });

    // Поддержка клавиатуры
    dayElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();            markDay(dayElement, dayNumber, month, year);
        }
    });

    // Правый клик обрабатывается делегированно на контейнере daysContainer
}

function setupQuickActions() {
    const quickActions = document.getElementById('quickActions');
    if (!quickActions) return;

    const QUICK_ACTION_SUGGESTION_RULES = [
        {
            match: (text) => {
                const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
                const hasCertificate = /(2\s*[-–]?\s*ндфл|ндфл)/i.test(normalized);
                const hasOrderIntent = /(заказ|оформ|получ|нужн|справк|выпис)/i.test(normalized);
                return hasCertificate && (hasOrderIntent || normalized.includes('справ'));
            },
            items: [
                'Справка 2-НДФЛ за текущий год',
                'Справка 2-НДФЛ за предыдущий год',
                'Справка 2-НДФЛ для предоставления в банк'
            ]
        }
    ];

    const panels = {
        vkus: {
            activeClass: 'is-vkus-active',
            btn: document.getElementById('vkusBtn'),
            expanded: document.getElementById('vkusExpanded'),
            wrap: document.getElementById('vkusInputWrap'),
            input: document.getElementById('vkusInput'),
            micBtn: document.getElementById('vkusMicBtn'),
            closeBtn: document.getElementById('vkusCloseBtn'),
            suggestions: document.getElementById('vkusSuggestions'),
            placeholder: 'Голосовой текст...',
            listeningPlaceholder: 'Слушаю... говорите запрос'
        },
        planner: {
            activeClass: 'is-planner-active',
            btn: document.getElementById('plannerBtn'),
            expanded: document.getElementById('plannerExpanded'),
            wrap: document.getElementById('plannerInputWrap'),
            input: document.getElementById('plannerInput'),
            micBtn: document.getElementById('plannerMicBtn'),
            closeBtn: document.getElementById('plannerCloseBtn'),
            suggestions: document.getElementById('plannerSuggestions'),
            placeholder: 'Голосовой запрос...',
            listeningPlaceholder: 'Слушаю... говорите запрос'
        }
    };

    let activePanel = null;
    let isListening = false;
    let wantListening = false;
    let finalizedTranscript = '';
    let micStream = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let interimTimer = null;
    let speechRequestSeq = 0;
    let isTranscribing = false;

    const preferredMimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
        .find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || '';

    function getPanel(name) {
        const panel = panels[name];
        if (!panel || !panel.btn || !panel.expanded || !panel.wrap || !panel.input || !panel.micBtn || !panel.suggestions) {
            return null;
        }
        return panel;
    }

    function findSuggestionItems(text) {
        const query = text.trim();
        if (!query) return null;

        for (const rule of QUICK_ACTION_SUGGESTION_RULES) {
            if (rule.match(query)) return rule.items;
        }
        return null;
    }

    function hideSuggestions(panel) {
        if (!panel || !panel.suggestions) return;
        panel.suggestions.hidden = true;
        panel.suggestions.innerHTML = '';
        panel.expanded.classList.remove('has-suggestions');
    }

    function renderSuggestions(panel, items) {
        if (!panel || !panel.suggestions || !Array.isArray(items) || items.length === 0) {
            hideSuggestions(panel);
            return;
        }

        panel.suggestions.innerHTML = '';
        items.forEach((label) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'quick-action-suggestion';
            option.textContent = label;
            option.setAttribute('role', 'option');
            option.addEventListener('click', () => {
                panel.input.value = label;
                finalizedTranscript = label;
                hideSuggestions(panel);
                panel.input.focus();
            });
            panel.suggestions.appendChild(option);
        });

        panel.suggestions.hidden = false;
        panel.expanded.classList.add('has-suggestions');
    }

    function updatePanelSuggestions(panel, panelName) {
        if (!panel) return;
        if (panelName !== 'vkus') {
            hideSuggestions(panel);
            return;
        }

        const items = findSuggestionItems(panel.input.value);
        if (items) {
            renderSuggestions(panel, items);
        } else {
            hideSuggestions(panel);
        }
    }

    async function applyPlannerInput(panel) {
        if (!panel || panel !== panels.planner) return false;
        const text = panel.input.value.trim();
        if (!text) return false;

        const created = await tryApplyPlannerMeetingCommand(text);
        if (!created) return false;

        panel.input.value = '';
        finalizedTranscript = '';
        hideSuggestions(panel);
        return true;
    }

    async function ensureMicStream() {
        if (micStream) return micStream;
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
            throw new Error('unsupported');
        }
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        return micStream;
    }

    async function releaseMicStream() {
        if (interimTimer) {
            clearInterval(interimTimer);
            interimTimer = null;
        }

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try {
                mediaRecorder.stop();
            } catch { /* ignore */ }
        }
        mediaRecorder = null;
        audioChunks = [];

        if (micStream) {
            micStream.getTracks().forEach((track) => track.stop());
            micStream = null;
        }
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result !== 'string') {
                    reject(new Error('read-failed'));
                    return;
                }
                resolve(reader.result.split(',')[1] || '');
            };
            reader.onerror = () => reject(reader.error || new Error('read-failed'));
            reader.readAsDataURL(blob);
        });
    }

    function applyTranscriptToPanel(text, isFinal) {
        if (!activePanel) return;
        const cleaned = String(text || '').trim();
        if (!cleaned) return;

        if (isFinal) {
            activePanel.input.value = cleaned;
            finalizedTranscript = cleaned;
        } else {
            const prefix = finalizedTranscript.trim();
            activePanel.input.value = prefix ? `${prefix} ${cleaned}`.trim() : cleaned;
        }

        updatePanelSuggestions(activePanel, activePanel === panels.vkus ? 'vkus' : 'planner');
    }

    function setSpeechErrorPlaceholder(errorCode) {
        if (!activePanel) return;
        if (errorCode === 'missing-api-key') {
            activePanel.input.placeholder = 'Добавьте ключ в config/speech-keys.json';
        } else if (errorCode === 'network') {
            activePanel.input.placeholder = 'Нет связи для распознавания речи';
        } else if (errorCode === 'api-error') {
            activePanel.input.placeholder = 'Ошибка Speech API — проверьте ключ';
        } else {
            activePanel.input.placeholder = 'Не удалось распознать речь';
        }
    }

    async function transcribeRecordedAudio(isFinal = false) {
        if (!activePanel || isTranscribing || !audioChunks.length) return;
        if (!window.calendarAPI || typeof window.calendarAPI.recognizeSpeechAudio !== 'function') return;

        const blob = new Blob(audioChunks, { type: preferredMimeType || 'audio/webm' });
        if (!blob.size) return;

        const requestId = ++speechRequestSeq;
        isTranscribing = true;

        try {
            const audioBase64 = await blobToBase64(blob);
            const result = await window.calendarAPI.recognizeSpeechAudio({
                audioBase64,
                mimeType: preferredMimeType || blob.type || 'audio/webm',
                isFinal
            });

            if (requestId !== speechRequestSeq || !activePanel) return;

            if (!result || !result.ok) {
                if (isFinal) setSpeechErrorPlaceholder(result && result.error);
                return;
            }

            applyTranscriptToPanel(result.transcript, isFinal);
        } catch (error) {
            console.error('Ошибка распознавания речи:', error);
            if (isFinal) setSpeechErrorPlaceholder('network');
        } finally {
            isTranscribing = false;
        }
    }

    function setListeningState(listening) {
        if (!activePanel) return;

        isListening = listening;
        activePanel.micBtn.classList.toggle('is-listening', listening);
        activePanel.wrap.classList.toggle('is-listening', listening);
        activePanel.input.placeholder = listening
            ? activePanel.listeningPlaceholder
            : activePanel.placeholder;
    }

    async function openPanel(name) {
        const panel = getPanel(name);
        if (!panel) return;

        if (isListening || wantListening) {
            await stopListening(false);
        } else {
            await releaseMicStream();
        }

        Object.values(panels).forEach((item) => {
            if (!item.btn || !item.expanded || !item.wrap || !item.input || !item.micBtn) return;
            item.btn.hidden = false;
            item.expanded.hidden = true;
            item.input.value = '';
            item.input.placeholder = item.placeholder;
            item.micBtn.classList.remove('is-listening');
            item.wrap.classList.remove('is-listening');
            hideSuggestions(item);
        });

        activePanel = panel;
        finalizedTranscript = '';
        quickActions.classList.remove('is-vkus-active', 'is-planner-active');
        quickActions.classList.add(panel.activeClass);
        panel.btn.hidden = true;
        panel.expanded.hidden = false;
        panel.input.placeholder = panel.placeholder;
        panel.input.focus();
    }

    async function closeActivePanel() {
        if (isListening || wantListening) {
            await stopListening(false);
        } else {
            await releaseMicStream();
        }

        Object.values(panels).forEach((panel) => {
            if (!panel.btn || !panel.expanded || !panel.wrap || !panel.input || !panel.micBtn) return;
            panel.btn.hidden = false;
            panel.expanded.hidden = true;
            panel.input.value = '';
            panel.input.placeholder = panel.placeholder;
            panel.micBtn.classList.remove('is-listening');
            panel.wrap.classList.remove('is-listening');
            hideSuggestions(panel);
        });

        quickActions.classList.remove('is-vkus-active', 'is-planner-active');
        finalizedTranscript = '';
        activePanel = null;
    }

    async function startListening() {
        if (!activePanel) return;

        if (typeof MediaRecorder === 'undefined') {
            activePanel.input.placeholder = 'Запись звука недоступна';
            activePanel.input.focus();
            return;
        }

        if (!window.calendarAPI || typeof window.calendarAPI.recognizeSpeechAudio !== 'function') {
            activePanel.input.placeholder = 'Распознавание речи недоступно';
            activePanel.input.focus();
            return;
        }

        let speechStatus = null;
        try {
            speechStatus = await window.calendarAPI.getSpeechStatus();
        } catch (error) {
            console.error('Ошибка проверки Speech API:', error);
        }

        if (!speechStatus || !speechStatus.configured) {
            activePanel.input.placeholder = 'Добавьте ключ в config/speech-keys.json';
            activePanel.input.focus();
            return;
        }

        try {
            await ensureMicStream();
        } catch (error) {
            console.error('Ошибка доступа к микрофону:', error);
            activePanel.input.placeholder = 'Нет доступа к микрофону';
            return;
        }

        finalizedTranscript = activePanel.input.value.trim();
        if (finalizedTranscript) finalizedTranscript += ' ';

        audioChunks = [];
        wantListening = true;
        speechRequestSeq++;

        const recorderOptions = preferredMimeType ? { mimeType: preferredMimeType } : undefined;
        mediaRecorder = new MediaRecorder(micStream, recorderOptions);
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size) audioChunks.push(event.data);
        };
        mediaRecorder.onerror = () => {
            wantListening = false;
            setListeningState(false);
            if (activePanel) activePanel.input.placeholder = 'Не удалось записать звук';
        };

        try {
            mediaRecorder.start(1000);
        } catch (error) {
            console.error('Ошибка запуска MediaRecorder:', error);
            wantListening = false;
            await releaseMicStream();
            activePanel.input.placeholder = 'Не удалось запустить микрофон';
            return;
        }

        interimTimer = setInterval(() => {
            if (wantListening) transcribeRecordedAudio(false);
        }, 2500);

        setListeningState(true);
        activePanel.input.focus();
    }

    async function stopListening(applyPlannerOnStop = true) {
        wantListening = false;

        if (interimTimer) {
            clearInterval(interimTimer);
            interimTimer = null;
        }

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try {
                mediaRecorder.stop();
            } catch { /* ignore */ }
        }

        setListeningState(false);
        await transcribeRecordedAudio(true);
        await releaseMicStream();

        if (applyPlannerOnStop && activePanel === panels.planner) {
            const created = await applyPlannerInput(activePanel);
            if (created) await closeActivePanel();
        }
    }

    Object.entries(panels).forEach(([name, panel]) => {
        if (!getPanel(name)) return;

        panel.btn.addEventListener('click', () => openPanel(name));

        panel.input.addEventListener('input', () => {
            updatePanelSuggestions(panel, name);
        });

        panel.input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' && name === 'planner') {
                e.preventDefault();
                if (isListening || wantListening) {
                    await stopListening(true);
                    return;
                }
                const created = await applyPlannerInput(panel);
                if (created) {
                    await closeActivePanel();
                    return;
                }
            }

            if (e.key === 'Escape') {
                e.preventDefault();
                if (!panel.suggestions.hidden) {
                    hideSuggestions(panel);
                    return;
                }
                closeActivePanel();
            }
        });

        if (panel.closeBtn) {
            panel.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeActivePanel();
            });
        }

        panel.micBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (panel.expanded.hidden) {
                openPanel(name);
            } else if (activePanel !== panel) {
                openPanel(name);
            }

            if (isListening || wantListening) {
                stopListening();
                return;
            }

            await startListening();
        });
    });
}

function setupEventListeners() {
    // Кнопки навигации
    prevBtn.addEventListener('click', () => {
        if (calendarMode === 'months') {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        if (calendarMode === 'months') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        renderCalendar();
    });

    prevYearBtn.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() - 5);
        renderCalendar();
    });

    nextYearBtn.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() + 5);
        renderCalendar();
    });

    if (monthYearElement) {
        monthYearElement.setAttribute('role', 'button');
        monthYearElement.setAttribute('tabindex', '0');

        const togglePickerMode = () => {
            calendarMode = calendarMode === 'days' ? 'months' : 'days';
            if (calendarMode === 'days') {
                daysContainer.classList.remove('month-picker-mode');
                if (weekdaysContainer) weekdaysContainer.classList.remove('month-picker-mode');
            }
            renderCalendar();
        };

        monthYearElement.addEventListener('click', (e) => {
            e.preventDefault();
            togglePickerMode();
        });

        monthYearElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePickerMode();
            }
        });
    }

    // Click на реальную дату
    currentDateElement.addEventListener('click', goToCurrentDate);
    const realDateBlock = document.querySelector('.real-date');
    if (realDateBlock) realDateBlock.addEventListener('click', goToCurrentDate);

    // Подписка на события от main (через безопасный preload API)
    if (window.calendarAPI && typeof window.calendarAPI.on === 'function') {
        try {
            window.calendarAPI.on('goto-current-date', () => {
                // При каждом открытии/вызове из трея обновляем и календарь, и блок с датой/временем
                resetToRealDateAlways();
            });
        } catch (e) {
            console.error('Ошибка при подписке на события:', e);
        }
    }

    // Возврат на реальную дату при повторном открытии/разворачивании окна
    // (в Electron hide/show часто триггерит visibilitychange)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            resetToRealDateAlways();
        } else {
            // при скрытии убираем подсказку
            cancelHolidayTooltip();
        }
    });
    window.addEventListener('focus', () => {
        resetToRealDateAlways();
    });

    // Быстрые подсказки для праздников: делегирование на контейнер
    if (daysContainer) {
        const getDayCellFromEventTarget = (target) => {
            if (!(target instanceof HTMLElement)) return null;
            const dayCell = target.closest('.current-month, .other-month');
            return dayCell instanceof HTMLElement ? dayCell : null;
        };

        daysContainer.addEventListener('contextmenu', async (e) => {
            const dayEl = getDayCellFromEventTarget(e.target);
            if (!dayEl) return;

            e.preventDefault();
            e.stopPropagation();

            const clicked = getDateFromDayElement(dayEl);
            if (!clicked) return;
            hideHolidayTooltip();
            showReminderEditor(dayEl, clicked);
        });

        daysContainer.addEventListener('mousemove', (e) => {
            // держим подсказку над курсором
            updateHolidayTooltipPosition(e);
        });

        daysContainer.addEventListener('mouseover', (e) => {
            const dayEl = getDayCellFromEventTarget(e.target);
            if (!dayEl) return;
            const holidayText = dayEl.getAttribute('data-holiday-tooltip');
            if (holidayText) {
                scheduleHolidayTooltip(dayEl, e);
            }
        });

        daysContainer.addEventListener('mouseout', (e) => {
            const related = e.relatedTarget;
            // если ушли с элемента праздника — убираем
            if (holidayTooltipTarget && related instanceof HTMLElement) {
                if (holidayTooltipTarget.contains(related)) return;
            }
            cancelHolidayTooltip();
        });
    }

    document.addEventListener('mousedown', (e) => {
        if (!reminderEditorEl || !reminderEditorEl.classList.contains('show')) return;
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (reminderEditorEl.contains(target)) return;
        if (reminderEditorTarget && reminderEditorTarget.contains(target)) return;
        hideReminderEditor();
    });

    window.addEventListener('resize', hideReminderEditor);
    window.addEventListener('scroll', hideReminderEditor, true);
}

function showNotification(title, message) {
    // В корпоративном режиме запрос разрешений отключён на уровне main-process.
    // Поэтому показываем уведомление только если разрешение уже выдано политиками/настройками ОС.
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: 'assets/logo-mark.png'
        });
    } else {
        // Безопасный no-op
        console.log('[notify]', title, message);
    }
}

// Таймеры живого обновления даты/времени
let realDateTimer = null;
let dayRefreshTimer = null;
let lastRenderedTodayKey = '';

function getTodayKey(date = new Date()) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function startLiveDateTimeUpdates() {
    if (realDateTimer) clearInterval(realDateTimer);
    if (dayRefreshTimer) clearInterval(dayRefreshTimer);

    updateRealDate();

    realDateTimer = setInterval(() => {
        updateRealDate();
    }, 1000);

    lastRenderedTodayKey = getTodayKey();
    dayRefreshTimer = setInterval(() => {
        const nowKey = getTodayKey();
        if (nowKey !== lastRenderedTodayKey) {
            lastRenderedTodayKey = nowKey;
            updateRealDate();

            if (currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()) {
                updateTodayHighlight();
            }
        }
    }, 1000);
}

const UI_BASE_WIDTH = 350;
const UI_BASE_HEIGHT = 632;
const UI_SCALE_MIN = 0.7;
const UI_SCALE_MAX = 2.2;
const UI_VERTICAL_INSET = 144;
const UI_HORIZONTAL_INSET = 40;

function updateUIScale() {
    const availableWidth = Math.max(window.innerWidth - UI_HORIZONTAL_INSET, UI_BASE_WIDTH * UI_SCALE_MIN);
    const availableHeight = Math.max(window.innerHeight - UI_VERTICAL_INSET, UI_BASE_HEIGHT * UI_SCALE_MIN);
    const scale = Math.min(
        availableWidth / UI_BASE_WIDTH,
        availableHeight / UI_BASE_HEIGHT,
        UI_SCALE_MAX
    );
    const clamped = Math.max(scale, UI_SCALE_MIN);
    document.documentElement.style.setProperty('--ui-scale', String(clamped));
    hideReminderEditor();
}

function setupUIScale() {
    updateUIScale();
    window.addEventListener('resize', updateUIScale);
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupUIScale();
    startLiveDateTimeUpdates();
});