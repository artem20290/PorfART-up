const tokenGroups = [
  {
    title: 'Цвета',
    desc: 'Семантическая палитра — primary, фоны, текст и статусы.',
    components: ['Button', 'Badge', 'Tag / Chip', 'Switch', 'Progress Bar', 'Toast / Notification', 'ColorPicker'],
    items: [
      { name: 'Primary', var: '--primary', value: '#008f95', desc: 'CTA, ссылки, focus', type: 'color' },
      { name: 'Primary Hover', var: '--primary-hover', value: '#007a85', desc: 'Наведение', type: 'color' },
      { name: 'Primary Pressed', var: '--primary-pressed', value: '#006b74', desc: 'Нажатие', type: 'color' },
      { name: 'Primary Light', var: '--primary-light', value: 'rgba(0,143,149,0.08)', desc: 'Ghost hover, highlight', type: 'color' },
      { name: 'Accent Orange', var: '--accent-orange', value: '#e67e22', desc: 'Промо, бейджи', type: 'color' },
      { name: 'Background', var: '--bg', value: '#f2f7f6', desc: 'Фон страницы', type: 'color' },
      { name: 'Surface', var: '--surface', value: '#ffffff', desc: 'Карточки, модули', type: 'color' },
      { name: 'Neutral BG', var: '--neutral-bg', value: '#eef2f4', desc: 'Чипы, disabled, зебра', type: 'color' },
      { name: 'Text Main', var: '--text-main', value: '#123a45', desc: 'Основной текст', type: 'color' },
      { name: 'Text Secondary', var: '--text-secondary', value: '#41636a', desc: 'Вторичный текст', type: 'color' },
      { name: 'Border', var: '--border', value: '#d7dee1', desc: 'Разделители, рамки', type: 'color' },
      { name: 'Success', var: '--success', value: '#1f8f53', desc: 'Статус: ок', type: 'color' },
      { name: 'Warning', var: '--warning', value: '#e2a326', desc: 'Статус: внимание', type: 'color' },
      { name: 'Danger', var: '--danger', value: '#c53b3b', desc: 'Статус: ошибка', type: 'color' }
    ]
  },
  {
    title: 'Типографика',
    desc: 'Шкала размеров и начертаний для интерфейса.',
    components: ['Text', 'Navbar / Header', 'Breadcrumbs', 'Data Table', 'Steps'],
    items: [
      { name: 'H1', var: '--fs-h1', value: '40px / 700', desc: 'Заголовок страницы', type: 'type', sample: 'Заголовок H1', size: '40px', weight: 700 },
      { name: 'H2', var: '--fs-h2', value: '24px / 700', desc: 'Секции', type: 'type', sample: 'Заголовок H2', size: '24px', weight: 700 },
      { name: 'H3', var: '--fs-h3', value: '18px / 700', desc: 'Подсекции, карточки', type: 'type', sample: 'Заголовок H3', size: '18px', weight: 700 },
      { name: 'Body', var: '--fs-body', value: '16px / 400', desc: 'Основной текст', type: 'type', sample: 'Обычный текст абзаца', size: '16px', weight: 400 },
      { name: 'Label', var: '--fs-label', value: '14px / 600', desc: 'Лейблы полей', type: 'type', sample: 'Название поля', size: '14px', weight: 600 },
      { name: 'Caption', var: '--fs-caption', value: '13px / 400', desc: 'Подписи, даты', type: 'type', sample: 'Текст подписи', size: '13px', weight: 400 },
      { name: 'Overline', var: '--fs-overline', value: '11px / 700', desc: 'Кикер, метки секций', type: 'type', sample: 'SECTION LABEL', size: '11px', weight: 700 }
    ],
    note: 'Шрифт: Inter → Roboto → Arial · line-height: 1.5'
  },
  {
    title: 'Отступы (spacing)',
    desc: '8-point сетка для padding, margin и gap.',
    components: ['Card', 'Modal / Dialog', 'Collapse', 'Spoiler', 'Tabs', 'Drawer / SidePanel'],
    items: [
      { name: 'sp-1', var: '--sp-1', value: '8px', desc: 'Минимальный gap', type: 'space', px: 8 },
      { name: 'sp-2', var: '--sp-2', value: '12px', desc: 'Внутри чипов', type: 'space', px: 12 },
      { name: 'sp-3', var: '--sp-3', value: '16px', desc: 'Стандартный padding', type: 'space', px: 16 },
      { name: 'sp-4', var: '--sp-4', value: '20px', desc: 'Заголовки карточек', type: 'space', px: 20 },
      { name: 'sp-5', var: '--sp-5', value: '24px', desc: 'Между блоками', type: 'space', px: 24 },
      { name: 'sp-6', var: '--sp-6', value: '32px', desc: 'Секции страницы', type: 'space', px: 32 }
    ],
    note: 'Контейнер: max 1100px · gap между карточками 24–32px'
  },
  {
    title: 'Границы, радиусы, тени',
    desc: 'Визуальная глубина, скругления и разделители.',
    components: ['Button', 'Input / TextField', 'Card', 'Modal / Dialog', 'Popover', 'SearchInput', 'Avatar', 'Tag / Chip'],
    items: [
      { name: 'Radius none', var: '--r-none', value: '0', desc: 'Таблицы, strict grid', type: 'radius', px: 0 },
      { name: 'Radius xs', var: '--r-xs', value: '4px', desc: 'Tags, badges, tooltip', type: 'radius', px: 4 },
      { name: 'Radius sm', var: '--r-sm', value: '6px', desc: 'Кнопки, инпуты', type: 'radius', px: 6 },
      { name: 'Radius md', var: '--r-md', value: '10px', desc: 'Карточки, dropdown', type: 'radius', px: 10 },
      { name: 'Radius lg', var: '--r-lg', value: '14px', desc: 'Крупные модули', type: 'radius', px: 14 },
      { name: 'Radius xl', var: '--r-xl', value: '20px', desc: 'Modal, drawer, hero', type: 'radius', px: 20 },
      { name: 'Radius 2xl', var: '--r-2xl', value: '28px', desc: 'Round cards, tiles', type: 'radius', px: 28 },
      { name: 'Radius pill', var: '--r-pill', value: '100px', desc: 'SearchInput, chips', type: 'radius', px: 100 },
      { name: 'Radius full', var: '--r-full', value: '50%', desc: 'Аватары, icon-only кнопки', type: 'radius-circle' },

      { name: 'Border width', var: '--border-w', value: '1px', desc: 'Стандартная толщина линии', type: 'border-width', px: 1 },
      { name: 'Border width thick', var: '--border-w-thick', value: '2px', desc: 'Акцент, selected row', type: 'border-width', px: 2 },
      { name: 'Border default', var: '--border-default', value: '1px solid var(--border)', desc: 'Поля, карточки, разделители', type: 'border', border: '1px solid #d7dee1' },
      { name: 'Border strong', var: '--border-strong', value: '2px solid #b8c4c8', desc: 'Выделенные блоки', type: 'border', border: '2px solid #b8c4c8' },
      { name: 'Border primary', var: '--border-primary', value: '1px solid var(--primary)', desc: 'Active, selected', type: 'border', border: '1px solid #008f95' },
      { name: 'Border dashed', var: '--border-dashed', value: '1px dashed var(--border)', desc: 'Upload, dropzone', type: 'border', border: '1px dashed #d7dee1' },
      { name: 'Border focus ring', var: '--border-focus', value: '0 0 0 3px rgba(0,143,149,0.25)', desc: 'Focus outline полей', type: 'focus-ring', shadow: '0 0 0 3px rgba(0,143,149,0.25)' },

      { name: 'Shadow none', var: '--shadow-none', value: 'none', desc: 'Flat UI, nested blocks', type: 'shadow', shadow: 'none' },
      { name: 'Shadow xs', var: '--shadow-xs', value: '0 1px 2px rgba(24,34,40,.05)', desc: 'Tags, chips, subtle lift', type: 'shadow', shadow: '0 1px 2px rgba(24,34,40,0.05)' },
      { name: 'Shadow sm', var: '--shadow-sm', value: '0 2px 8px rgba(24,34,40,.06)', desc: 'Dropdown, popover', type: 'shadow', shadow: '0 2px 8px rgba(24,34,40,0.06)' },
      { name: 'Shadow card', var: '--shadow-card', value: '0 8px 20px rgba(24,34,40,.07)', desc: 'Карточки', type: 'shadow', shadow: '0 8px 20px rgba(24,34,40,0.07)' },
      { name: 'Shadow hover', var: '--shadow-hover', value: '0 12px 28px rgba(24,34,40,.12)', desc: 'Hover карточек', type: 'shadow', shadow: '0 12px 28px rgba(24,34,40,0.12)' },
      { name: 'Shadow lg', var: '--shadow-lg', value: '0 16px 40px rgba(24,34,40,.15)', desc: 'Modal, drawer, lightbox', type: 'shadow', shadow: '0 16px 40px rgba(24,34,40,0.15)' },
      { name: 'Shadow inner', var: '--shadow-inner', value: 'inset 0 2px 4px rgba(24,34,40,.06)', desc: 'Inset поля, pressed', type: 'shadow', shadow: 'inset 0 2px 4px rgba(24,34,40,0.06)' },
      { name: 'Shadow primary', var: '--shadow-primary', value: '0 8px 24px rgba(0,143,149,0.25)', desc: 'Primary CTA glow', type: 'shadow', shadow: '0 8px 24px rgba(0,143,149,0.25)' },

      { name: 'Scrollbar size', var: '--scrollbar-size', value: '6px', desc: 'Sidebar, длинные списки', type: 'scrollbar', scrollSize: 6 },
      { name: 'Scrollbar thumb', var: '--scrollbar-thumb', value: 'rgba(0,143,149,0.32)', desc: 'Ползунок (светлая тема)', type: 'scrollbar', scrollKind: 'thumb' },
      { name: 'Scrollbar track', var: '--scrollbar-track', value: 'rgba(0,143,149,0.06)', desc: 'Трек (светлая тема)', type: 'scrollbar', scrollKind: 'track' }
    ],
    note: 'Радиусы: none → 2xl + pill/full · Границы · Тени · Scrollbars'
  },
  {
    title: 'Размеры компонентов',
    desc: 'Высоты кнопок, полей ввода и иконок.',
    components: ['Button', 'Input / TextField', 'Dropdown / Select', 'Checkbox', 'Avatar', 'Counter / Stepper'],
    items: [
      { name: 'Button xs', var: '--btn-h-xs', value: '26px', desc: 'Компактные действия', type: 'size', px: 26 },
      { name: 'Button s', var: '--btn-h-s', value: '32px', desc: 'Таблицы, формы', type: 'size', px: 32 },
      { name: 'Button m', var: '--btn-h-m', value: '40px', desc: 'Основной размер', type: 'size', px: 40 },
      { name: 'Button l', var: '--btn-h-l', value: '48px', desc: 'Hero CTA', type: 'size', px: 48 },
      { name: 'Input', var: '--input-h', value: '40px', desc: 'TextField, Select', type: 'size', px: 40 },
      { name: 'Icon sm', var: '--icon-sm', value: '16px', desc: 'Внутри кнопок', type: 'size', px: 16 },
      { name: 'Icon md', var: '--icon-md', value: '20px', desc: 'Навигация, поля', type: 'size', px: 20 },
      { name: 'Avatar sm', var: '--avatar-sm', value: '32px', desc: 'Списки, таблицы', type: 'size', px: 32 },
      { name: 'Avatar lg', var: '--avatar-lg', value: '48px', desc: 'Профиль, карточки', type: 'size', px: 48 }
    ]
  },
  {
    title: 'Анимация',
    desc: 'Длительность, easing, затухание прозрачности и насыщенность цвета.',
    components: ['Modal / Dialog', 'Drawer / SidePanel', 'Toast / Notification', 'Skeleton', 'Loader / Spinner', 'ProgressSpin', 'Popover'],
    items: [
      { name: 'Fast', section: 'Длительность', var: '--duration-fast', value: '150ms', desc: 'Hover, toggle', type: 'motion', ms: 150 },
      { name: 'Normal', section: 'Длительность', var: '--duration', value: '250ms', desc: 'Открытие панелей', type: 'motion', ms: 250 },
      { name: 'Slow', section: 'Длительность', var: '--duration-slow', value: '400ms', desc: 'Модалки, drawer', type: 'motion', ms: 400 },
      { name: 'Easing', section: 'Кривая', var: '--easing', value: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Стандартная кривая', type: 'easing' },
      { name: 'Fade In', section: 'Прозрачность', var: '--anim-fade-in', value: 'opacity 0 → 1', desc: 'Появление элемента', type: 'fade', variant: 'in', ms: 2000 },
      { name: 'Fade Out', section: 'Прозрачность', var: '--anim-fade-out', value: 'opacity 1 → 0', desc: 'Скрытие элемента', type: 'fade', variant: 'out', ms: 2000 },
      { name: 'Fade Pulse', section: 'Прозрачность', value: 'opacity 0.2 ↔ 1', desc: 'Пульсация прозрачности', type: 'fade', variant: 'pulse', ms: 1600 },
      { name: 'Fade Soft', section: 'Прозрачность', value: 'opacity 0.35 ↔ 0.9', desc: 'Мягкое мерцание', type: 'fade', variant: 'soft', ms: 2200 },
      { name: 'Saturate In', section: 'Насыщенность', var: '--anim-saturate-in', value: 'saturate 0 → 1.2', desc: 'Раскрытие цвета', type: 'saturate', variant: 'in', ms: 2000 },
      { name: 'Saturate Out', section: 'Насыщенность', var: '--anim-saturate-out', value: 'saturate 1.2 → 0', desc: 'Обесцвечивание', type: 'saturate', variant: 'out', ms: 2000 },
      { name: 'Saturate Pulse', section: 'Насыщенность', value: 'saturate 0.15 ↔ 1.4', desc: 'Пульсация насыщенности', type: 'saturate', variant: 'pulse', ms: 1600 },
      { name: 'Saturate Boost', section: 'Насыщенность', value: 'saturate 0.6 ↔ 1.5', desc: 'Усиление цвета', type: 'saturate', variant: 'boost', ms: 1800 }
    ]
  }
];
