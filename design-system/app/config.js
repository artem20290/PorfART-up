/* ============================================
   COMPONENT CATEGORIES
   ============================================ */
const categoryOrder = [
  { key: 'Action', label: 'Action / Form', desc: 'Кнопки, поля ввода, элементы форм. Базовые интерактивные элементы для построения форм и пользовательских действий.', extraKeys: ['Form'] },
  { key: 'Typography', label: 'Typography', desc: 'Текстовые компоненты: заголовки, параграфы, подписи с типографической шкалой.' },
  { key: 'Layout', label: 'Layout / Content', desc: 'Карточки, сетки, контентные модули. Компоненты для структурирования и подачи контента.', extraKeys: ['Disclosure', 'Content'] },
  { key: 'Navigation', label: 'Navigation', desc: 'Навигационные элементы: шапка, табы, хлебные крошки, пагинация.' },
  { key: 'Data display', label: 'Data display', desc: 'Отображение данных: теги, таблицы, аватары, бейджи-счётчики.' },
  { key: 'Overlay', label: 'Overlay / Feedback', desc: 'Оверлеи и обратная связь: модалки, тултипы, уведомления, индикаторы загрузки.', extraKeys: ['Feedback'] }
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function componentPageIdFor(comp) {
  const cat = categoryOrder.find(c => [c.key, ...(c.extraKeys || [])].includes(comp.category));
  return cat ? `cat-${cat.key.toLowerCase().replace(/\s/g, '-')}` : 'home';
}

function componentDomId(comp) {
  return `component-${slugify(comp.name)}`;
}

/* ========== FAVORITES ========== */
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('ds-favorites') || '[]'); } catch { return []; }
}
function favoriteKey(name, variantId) {
  return variantId ? `${name}#${variantId}` : name;
}
function parseFavoriteKey(key) {
  const i = String(key).lastIndexOf('#');
  if (i < 0) return { name: key, variantId: null };
  return { name: key.slice(0, i), variantId: key.slice(i + 1) };
}
function toggleFavorite(name, variantId) {
  const key = favoriteKey(name, variantId);
  const fav = getFavorites();
  const idx = fav.indexOf(key);
  if (idx >= 0) fav.splice(idx, 1); else fav.push(key);
  localStorage.setItem('ds-favorites', JSON.stringify(fav));
}
function isFavorite(name, variantId) {
  return getFavorites().includes(favoriteKey(name, variantId));
}
window.isFavorite = isFavorite;
window.toggleFavorite = toggleFavorite;
window.favoriteKey = favoriteKey;
window.parseFavoriteKey = parseFavoriteKey;

function uniqueComponents(list) {
  const seen = new Set();
  const result = [];
  for (let i = list.length - 1; i >= 0; i--) {
    const key = `${list[i].category}::${list[i].name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.unshift(list[i]);
  }
  return result;
}

const uniqueComponentsList = uniqueComponents(components);

function resolveFavorite(key) {
  const { name, variantId } = parseFavoriteKey(key);
  const comp = uniqueComponentsList.find(c => c.name === name);
  if (!comp) return null;
  const variant = variantId ? comp.variants?.find(v => v.id === variantId) : null;
  return { comp, variant, key };
}
window.resolveFavorite = resolveFavorite;

const propDescriptionMap = {
  items: 'Массив элементов для отображения.',
  value: 'Текущее выбранное значение компонента.',
  onChange: 'Callback, вызываемый при изменении значения.',
  label: 'Основная подпись или текст компонента.',
  placeholder: 'Текст-заполнитель до ввода или выбора значения.',
  disabled: 'Отключает интерактивность компонента.',
  size: 'Размер компонента.',
  view: 'Визуальный вариант оформления.',
  form: 'Форма углов/скругления компонента.',
  status: 'Семантический статус и цветовое состояние.',
  state: 'Визуальное состояние компонента.',
  iconLeft: 'Иконка слева от текста.',
  iconRight: 'Иконка справа от текста.',
  onlyIcon: 'Режим кнопки только с иконкой.',
  groups: 'Группы для визуального разделения элементов.',
  options: 'Список вариантов выбора.',
  rows: 'Количество строк textarea.',
  cols: 'Количество колонок textarea.',
  step: 'Шаг изменения значения.',
  min: 'Минимальное допустимое значение.',
  max: 'Максимальное допустимое значение.',
  totalPages: 'Общее количество страниц.',
  currentPage: 'Текущая активная страница.',
  visibleCount: 'Количество видимых страниц в пагинации.',
  tone: 'Цветовой тон компонента.',
  count: 'Числовое значение счётчика.',
  title: 'Заголовок компонента.',
  text: 'Текстовое содержимое.',
  message: 'Текст уведомления или сообщения.',
};

const KIT_VERSION = '0.2.0';

const STATUS_CLASS = { stable: 'tag-success', beta: 'tag-warning', planned: 'tag-neutral' };

function getComponentStatus(comp) {
  if (comp.status === 'stable' || comp.status === 'beta' || comp.status === 'planned') {
    return comp.status;
  }
  const hasDemo = !!(comp.demo && comp.demo.length > 50);
  const hasAi = !!comp.aiPrompt;
  if (hasDemo && hasAi) return 'stable';
  if (hasAi || hasDemo) return 'beta';
  return 'planned';
}

function isComponentLive(comp) {
  if (!comp.demo || comp.demo.length < 50) return false;
  if (comp.demo.includes('live-demo-badge')) return true;
  const markers = [
    'data-live-', 'data-password', 'data-phone', 'data-pin', 'data-counter',
    'data-banner', 'data-empty', 'data-error', 'data-toolbar', 'data-filter',
    'data-list', 'data-timeline', 'data-calendar', 'data-mega', 'data-notif',
    'data-file-preview', 'data-signature', 'data-split', 'data-adv-table',
    'data-search-input', 'data-rating', 'data-stats', 'data-donut', 'data-bar-chart',
    'data-line-chart', 'data-chips', 'data-collapse', 'data-spoiler', 'data-vtabs',
    'data-form-wizard', 'data-activity', 'data-sb-table', 'data-combobox',
    'data-autocomplete', 'data-steps', 'data-copyable', 'data-alert',
    'data-virtual-list', 'data-live-tree', 'data-doc-viewer', 'data-kanban'
  ];
  return markers.some(m => comp.demo.includes(m));
}

