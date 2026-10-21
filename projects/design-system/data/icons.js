/* ============================================
   SB design systems — Icon Pack
   Stroke icons, viewBox 0 0 24 24, currentColor
   ============================================ */
const iconCategories = ['Навигация', 'Действия', 'Файлы', 'Коммуникация', 'Интерфейс', 'Статус'];

const iconPack = [
  { id: 'menu', name: 'Меню', category: 'Навигация', paths: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>' },
  { id: 'arrow-left', name: 'Стрелка влево', category: 'Навигация', paths: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>' },
  { id: 'arrow-right', name: 'Стрелка вправо', category: 'Навигация', paths: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>' },
  { id: 'arrow-up', name: 'Стрелка вверх', category: 'Навигация', paths: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>' },
  { id: 'arrow-down', name: 'Стрелка вниз', category: 'Навигация', paths: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>' },
  { id: 'chevron-left', name: 'Шеврон влево', category: 'Навигация', paths: '<path d="M15 18l-6-6 6-6"/>' },
  { id: 'chevron-right', name: 'Шеврон вправо', category: 'Навигация', paths: '<path d="M9 6l6 6-6 6"/>' },
  { id: 'chevron-up', name: 'Шеврон вверх', category: 'Навигация', paths: '<path d="M18 15l-6-6-6 6"/>' },
  { id: 'chevron-down', name: 'Шеврон вниз', category: 'Навигация', paths: '<path d="M6 9l6 6 6-6"/>' },
  { id: 'home', name: 'Главная', category: 'Навигация', paths: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { id: 'external-link', name: 'Внешняя ссылка', category: 'Навигация', paths: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>' },

  { id: 'plus', name: 'Добавить', category: 'Действия', paths: '<path d="M12 5v14"/><path d="M5 12h14"/>' },
  { id: 'minus', name: 'Убрать', category: 'Действия', paths: '<path d="M5 12h14"/>' },
  { id: 'close', name: 'Закрыть', category: 'Действия', paths: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
  { id: 'edit', name: 'Редактировать', category: 'Действия', paths: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
  { id: 'trash', name: 'Удалить', category: 'Действия', paths: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>' },
  { id: 'copy', name: 'Копировать', category: 'Действия', paths: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' },
  { id: 'download', name: 'Скачать', category: 'Действия', paths: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>' },
  { id: 'upload', name: 'Загрузить', category: 'Действия', paths: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>' },
  { id: 'search', name: 'Поиск', category: 'Действия', paths: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
  { id: 'filter', name: 'Фильтр', category: 'Действия', paths: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>' },
  { id: 'refresh', name: 'Обновить', category: 'Действия', paths: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>' },
  { id: 'settings', name: 'Настройки', category: 'Действия', paths: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  { id: 'check', name: 'Галочка', category: 'Действия', paths: '<polyline points="20 6 9 17 4 12"/>' },

  { id: 'file', name: 'Файл', category: 'Файлы', paths: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
  { id: 'file-text', name: 'Документ', category: 'Файлы', paths: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>' },
  { id: 'folder', name: 'Папка', category: 'Файлы', paths: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' },
  { id: 'paperclip', name: 'Вложение', category: 'Файлы', paths: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>' },
  { id: 'image', name: 'Изображение', category: 'Файлы', paths: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>' },

  { id: 'mail', name: 'Почта', category: 'Коммуникация', paths: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
  { id: 'message', name: 'Сообщение', category: 'Коммуникация', paths: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { id: 'bell', name: 'Уведомления', category: 'Коммуникация', paths: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
  { id: 'phone', name: 'Телефон', category: 'Коммуникация', paths: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' },
  { id: 'mic', name: 'Микрофон', category: 'Коммуникация', paths: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>' },
  { id: 'mic-off', name: 'Микрофон выкл.', category: 'Коммуникация', paths: '<line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" y1="19" x2="12" y2="22"/>' },

  { id: 'calendar', name: 'Календарь', category: 'Интерфейс', paths: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  { id: 'clock', name: 'Часы', category: 'Интерфейс', paths: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
  { id: 'eye', name: 'Показать', category: 'Интерфейс', paths: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'eye-off', name: 'Скрыть', category: 'Интерфейс', paths: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>' },
  { id: 'star', name: 'Избранное', category: 'Интерфейс', paths: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { id: 'bookmark', name: 'Закладка', category: 'Интерфейс', paths: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>' },
  { id: 'heart', name: 'Лайк', category: 'Интерфейс', paths: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
  { id: 'user', name: 'Пользователь', category: 'Интерфейс', paths: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { id: 'users', name: 'Группа', category: 'Интерфейс', paths: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { id: 'grid', name: 'Сетка', category: 'Интерфейс', paths: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
  { id: 'monitor', name: 'Монитор', category: 'Интерфейс', paths: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { id: 'list', name: 'Список', category: 'Интерфейс', paths: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
  { id: 'more-horizontal', name: 'Ещё', category: 'Интерфейс', paths: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>' },
  { id: 'globe', name: 'Сайт', category: 'Интерфейс', paths: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  { id: 'briefcase', name: 'Проект', category: 'Интерфейс', paths: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' },
  { id: 'layers', name: 'Слои', category: 'Интерфейс', paths: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },

  { id: 'info', name: 'Информация', category: 'Статус', paths: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' },
  { id: 'alert-circle', name: 'Предупреждение', category: 'Статус', paths: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
  { id: 'check-circle', name: 'Успех', category: 'Статус', paths: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
  { id: 'x-circle', name: 'Ошибка', category: 'Статус', paths: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' },
  { id: 'help-circle', name: 'Помощь', category: 'Статус', paths: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },

  { id: 'lock', name: 'Замок', category: 'Интерфейс', paths: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  { id: 'package', name: 'Посылка', category: 'Файлы', paths: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>' },
  { id: 'bar-chart', name: 'Аналитика', category: 'Интерфейс', paths: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>' },
  { id: 'map-pin', name: 'Метка', category: 'Навигация', paths: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>' },
  { id: 'inbox', name: 'Входящие', category: 'Коммуникация', paths: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>' },
  { id: 'sun', name: 'Светлая тема', category: 'Интерфейс', paths: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>' },
  { id: 'moon', name: 'Тёмная тема', category: 'Интерфейс', paths: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' },
  { id: 'contrast', name: 'Контраст', category: 'Интерфейс', paths: '<circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 2a10 10 0 0 1 0 20"/>' },
  { id: 'truck', name: 'Логистика', category: 'Интерфейс', paths: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  { id: 'factory', name: 'Производство', category: 'Интерфейс', paths: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>' },
  { id: 'recycle', name: 'Экология', category: 'Интерфейс', paths: '<polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>' },
  { id: 'chevrons-up-down', name: 'Сортировка', category: 'Навигация', paths: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>' },
  { id: 'zap', name: 'Анимация', category: 'Интерфейс', paths: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' }
];

function getIcon(id) {
  return iconPack.find(i => i.id === id);
}

function renderIconSvg(icon, size) {
  const s = size || 18;
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.paths}</svg>`;
}

function icon(id, size, extraClass) {
  const ic = getIcon(id);
  if (!ic) return '';
  const cls = extraClass ? `bi ${extraClass}` : 'bi';
  return `<span class="${cls}">${renderIconSvg(ic, size || 18)}</span>`;
}

function pageIcon(id, size) {
  return icon(id, size || 18, 'sl-icon-svg');
}

function hydrateIcons(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-icon]').forEach(el => {
    const ic = getIcon(el.dataset.icon);
    if (!ic) return;
    const size = parseInt(el.dataset.iconSize, 10) || 18;
    el.classList.add('bi');
    if (!el.querySelector('svg')) el.innerHTML = renderIconSvg(ic, size);
  });
}

function iconSvgSnippet(icon) {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icon.paths}</svg>`;
}

function brandLogo() {
  return `<img src="logo-mark.png" alt="SB" class="sb-appshell-logo-img sb-brand-mark" width="30" height="30" />`;
}
