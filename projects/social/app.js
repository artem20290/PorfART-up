/* eslint-disable no-unused-vars */
const AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250';
const AVATARS = {
  konstantin: AVATAR,
  olga: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  dmitry: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  maria: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  alexey: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  elena: 'https://images.unsplash.com/photo-1487412720507-e7ab68c7cd8d?auto=format&fit=crop&q=80&w=150',
  alexander: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  andrey: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
  ekaterina: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  mariaIvanova: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  anna: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  alexanderAlt: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
  groupChat: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=150',
  officeChat: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150',
  devChat: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=150',
};
/* Офисные кадры с сотрудниками */
const POST_SCHOOL = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600';
const POST_WORK = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600';
const POST_SERVERS = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600';
const POST_OFFICE = 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=600';
const POST_DESK = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600';
const POST_BOOKS = 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=600';

const USER = {
  name: 'Константиновский Константин Константинович',
  short: 'Константин К.',
  handle: '@konstantin',
  avatar: AVATAR,
  birthday: '26 февраля',
  businessTrip: 'В командировке до 12 сентября',
  city: 'Москва',
  profession: 'Менеджер по закупкам',
  department: 'Корпоративные коммуникации',
  email: 'k.konstantinovsky@holding.local',
  phone: '+7 (495) 000-12-34',
  manager: 'Александрова Ольга',
  experience: 'В компании с 2021 · 5 лет',
  about: 'Веду тендеры по IT и инфраструктуре, работаю с кросс-функциональными командами и подрядчиками.',
};

const SB = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  'help-circle': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'chevron-left': '<path d="M15 18l-6-6 6-6"/>',
  'chevron-right': '<path d="M9 6l6 6-6 6"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
};

function sb(id, size) {
  const s = size || 18;
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SB[id] || ''}</svg>`;
}

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: 'Константин К.',
    time: 'Сегодня в 12:34',
    text: 'Как провести планёрку за 20 минут и не потерять суть.\n\nКороткие стендапы на заводе и в офисе работают лучше длинных совещаний: один статус, один риск, один следующий шаг. Так команда быстрее выходит на линию и меньше тонет в переписке.',
    image: POST_SCHOOL,
    views: 230,
    likes: '99,9K',
    likesCount: 99900,
    isLiked: false,
    commentsCount: 3,
    repostsCount: 1,
    comments: [
      { id: 'c1', author: 'Мария Смирнова', avatar: AVATARS.maria, text: 'Очень актуально. У нас на участке уже перешли на короткий формат.', time: '12:45' },
      { id: 'c2', author: 'Алексей Воронов', avatar: AVATARS.alexey, text: 'Согласен. В R&D так же: меньше слайдов — больше решений.', time: '13:02' },
      { id: 'c3', author: 'Елена Петрова', avatar: AVATARS.elena, text: 'Константин, спасибо. Возьмём в онбординг для новых сотрудников.', time: '13:15' },
    ],
  },
  {
    id: 'post-2',
    author: 'Константин К.',
    time: 'Вчера в 16:20',
    text: 'Завершили первый этап тендера на поставку IT-оборудования для инженерного центра в Казани. Стоимость контракта снизили на 14,5% без потери качества.',
    image: POST_WORK,
    views: 1420,
    likes: '1,2K',
    likesCount: 1240,
    isLiked: true,
    commentsCount: 18,
    repostsCount: 12,
    comments: [
      { id: 'c2-1', author: 'Дмитрий Соколов', avatar: AVATARS.dmitry, text: 'Колоссальная работа. Серверы ждём.', time: 'Вчера в 17:05' },
    ],
  },
  {
    id: 'post-3',
    author: 'Константин К.',
    time: '3 дня назад',
    text: 'Ровно 5 лет назад я пришёл в офис на Тверской младшим специалистом по закупкам. За эти годы — больше 350 тендеров. Спасибо каждому, кто делает компанию местом роста.',
    views: 3890,
    likes: '4,5K',
    likesCount: 4500,
    isLiked: false,
    commentsCount: 42,
    repostsCount: 5,
    comments: [],
  },
];

const COLLEAGUES = [
  { name: 'Александрова Ольга', role: 'Директор по закупкам', avatar: AVATARS.olga, status: 'online' },
  { name: 'Дмитрий Соколов', role: 'IT-директор', avatar: AVATARS.dmitry, status: 'online' },
  { name: 'Мария Смирнова', role: 'Главный бухгалтер', avatar: AVATARS.maria, status: 'offline' },
  { name: 'Алексей Воронов', role: 'Руководитель R&D', avatar: AVATARS.alexey, status: 'online' },
  { name: 'Елена Петрова', role: 'HR-партнёр', avatar: AVATARS.elena, status: 'busy' },
];

const CHATS = [
  { name: 'Александр Александров', avatar: AVATARS.alexander, online: true, message: 'Спасибо', time: '2 ч', badge: 137 },
  { name: 'Лучший чат', avatar: AVATARS.groupChat, message: 'Алеся: кто идёт завтра', time: '3 ч', badge: 2 },
  { name: 'Андрей Бобр', avatar: AVATARS.andrey, fromMe: true, message: 'Зачем нам это?', time: '4 ч', unread: true },
  { name: 'Екатерина Партищенко', avatar: AVATARS.ekaterina, message: 'Привет. Завтра идёшь?', time: '6 ч', badge: 1 },
  { name: 'Тест чат', avatar: AVATARS.officeChat, message: 'Андрей: джира работает', time: '16 ч', badge: 56 },
  { name: 'Мария Иванова', avatar: AVATARS.mariaIvanova, online: true, fromMe: true, message: 'Спасибо, и вам', time: '1 д', read: true },
];

const NOTIFICATIONS = [
  { icon: 'heart', text: 'Мария Смирнова и 42 коллеги оценили вашу запись.', time: '10 мин', unread: true },
  { icon: 'message', text: 'Алексей Воронов оставил комментарий.', time: '1 час', unread: true },
  { icon: 'check-circle', text: 'Заявка на командировку одобрена.', time: 'Вчера', unread: false },
  { icon: 'user', text: '5 новых подписчиков из логистики.', time: '2 дня', unread: false },
];

const TRENDS = [
  { title: 'Инженерный центр в Казани', meta: '142 обсуждения', time: '2 ч' },
  { title: 'Цифровая трансформация', meta: '89 обсуждений', time: '5 ч' },
  { title: 'Охрана труда на площадке', meta: '36 обсуждений', time: '1 д' },
  { title: 'Тендеры квартала', meta: '24 обсуждения', time: '2 д' },
];

const CATEGORIES = [
  { name: 'Закупки', value: 72 },
  { name: 'Команда', value: 54 },
  { name: 'Обучение', value: 38 },
  { name: 'Производство', value: 24 },
];

const HOURS = [
  ['08', 28], ['10', 46], ['12', 70], ['14', 92], ['16', 64], ['18', 40], ['20', 22],
];

const state = {
  posts: JSON.parse(JSON.stringify(INITIAL_POSTS)),
  notifications: JSON.parse(JSON.stringify(NOTIFICATIONS)),
  activeTab: 'home',
  seenTab: 'home',
  expandedPosts: {},
  openComments: {},
  showTripTip: false,
  selectedWidget: null,
  overlay: null,
  newPostText: '',
  draftImage: '',
  audience: 'all',
  mentions: [],
  search: '',
  focusSearch: false,
  invited: false,
  reminded: false,
  qrContacts: false,
  storyId: 0,
  seenStories: {},
  reelId: 0,
  reelLiked: {},
  toast: '',
};

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}

function formatLikes(n) {
  if (n >= 100000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')}K`;
  return n.toLocaleString('ru-RU');
}

function img(src, cls) {
  return `<img class="${cls || ''}" src="${src}" alt="" onerror="this.style.visibility='hidden'">`;
}

function iconBtn(id, action, badge) {
  return `<button class="icon-btn" type="button" data-action="${action}">${sb(id)}${badge ? `<span class="badge">${badge}</span>` : ''}</button>`;
}

function row(icon, title, sub, side, action, extra) {
  const tag = action ? 'button' : 'div';
  return `<${tag} class="row" type="button" ${action ? `data-action="${action}"` : ''} ${extra || ''}>
    <span class="sq muted">${icon}</span>
    <span class="row-main"><span class="row-title">${esc(title)}</span>${sub ? `<span class="row-sub">${esc(sub)}</span>` : ''}</span>
    <span class="row-side">${side || ''}</span>
  </${tag}>`;
}

function renderHero() {
  const post = state.posts.reduce((best, p) => (p.likesCount > best.likesCount ? p : best), state.posts[0]);
  if (!post) return '';
  const line = post.text.split('\n').find(Boolean) || '';
  return `<button class="hero press" type="button" data-action="open-post" data-id="${post.id}">
    <div class="hero-scanner" aria-hidden="true"></div>
    <div class="hero-content">
      <div class="hero-top">
        <div class="hero-kicker">Пост дня</div>
        <div class="hero-stats">
          <span class="hero-num">${esc(post.likes)}</span>
          <span class="hero-sub">откликов</span>
        </div>
      </div>
      <div class="hero-title">${esc(line)}</div>
    </div>
  </button>`;
}

function renderActions() {
  const items = [
    ['create', 'assets/qa/create.png', 'Создать пост'],
    ['stories', 'assets/qa/stories.png', 'Сторис'],
    ['reels', 'assets/qa/reels.png', 'Reels'],
    ['live', 'assets/qa/live.png', 'Live'],
  ];
  return `<div class="qa-grid">${items.map(([action, src, label]) => `
    <button class="qa" type="button" data-action="${action}">
      <span class="qa-icon qa-icon--img">${img(src)}</span>
      <span class="qa-label">${label}</span>
    </button>`).join('')}</div>`;
}

function storyList() {
  return [
    { id: 'me', name: 'Вы', avatar: USER.avatar, mine: true },
    { id: 'olga', name: 'Ольга', avatar: AVATARS.olga, image: POST_WORK, time: '2 ч', text: 'Финал переговоров по инженерному центру. Контракт собрали без потери качества.' },
    { id: 'dmitry', name: 'Дмитрий', avatar: AVATARS.dmitry, image: POST_SERVERS, time: '4 ч', text: 'Серверы для Казани подтверждаем. Ждём отгрузку на следующей неделе.' },
    { id: 'maria', name: 'Мария', avatar: AVATARS.maria, image: POST_OFFICE, time: '6 ч', text: 'Закрыли сверку по кварталу. Спасибо закупкам за быстрые ответы.' },
    { id: 'alexey', name: 'Алексей', avatar: AVATARS.alexey, image: POST_DESK, time: '8 ч', text: 'На стенде R&D показываем новый контур. Заходите после планёрки.' },
    { id: 'elena', name: 'Елена', avatar: AVATARS.elena, image: POST_BOOKS, time: '1 д', text: 'На смене разбираем правила безопасной работы у линии. Короткий инструктаж — меньше простоев.' },
  ];
}

function renderStories() {
  const people = storyList();
  return `<div class="stories no-scrollbar">${people.map((p, i) => `
    <button class="story ${p.mine || state.seenStories[p.id] ? 'seen' : ''}" type="button" data-action="story" data-id="${i}">
      <span class="story-avatar">${img(p.avatar)}</span>
      ${p.mine ? `<span class="story-plus">${sb('plus', 10)}</span>` : ''}
      <span class="story-name">${esc(p.name)}</span>
    </button>`).join('')}</div>`;
}

function renderPost(post) {
  const isLong = post.text.length > 160;
  const expanded = state.expandedPosts[post.id];
  const display = !isLong || expanded ? post.text : `${post.text.slice(0, 160)}…`;
  const open = state.openComments[post.id];
  return `<article class="card post">
    <div class="post-head">
      <span class="avatar">${img(USER.avatar)}</span>
      <div style="min-width:0"><div class="post-name">${esc(post.author)}</div><div class="post-time">${esc(post.time)}</div></div>
    </div>
    <div class="post-body">${esc(display).replace(/\n/g, '<br>')}</div>
    ${isLong ? `<button class="post-more" type="button" data-action="expand" data-id="${post.id}">${expanded ? 'Свернуть' : 'Показать полностью'}</button>` : ''}
    ${post.image ? `<div class="post-photo">${img(post.image)}</div>` : ''}
    <div class="post-bar" style="margin-top:8px;padding-top:8px;display:flex;flex-direction:row;align-items:center;justify-content:space-between">
      <div class="post-actions" style="display:flex;flex-direction:row;align-items:center;gap:12px">
        <button class="action-btn ${post.isLiked ? 'liked' : ''}" type="button" data-action="like" data-id="${post.id}" style="display:inline-flex;flex-direction:row;align-items:center;gap:4px;height:22px;font-size:12px">${sb('heart', 14)}<span>${esc(post.likes)}</span></button>
        <button class="action-btn" type="button" data-action="comments" data-id="${post.id}" style="display:inline-flex;flex-direction:row;align-items:center;gap:4px;height:22px;font-size:12px">${sb('message', 14)}<span>${post.commentsCount || post.comments.length}</span></button>
        <button class="action-btn" type="button" style="display:inline-flex;flex-direction:row;align-items:center;gap:4px;height:22px;font-size:12px">${sb('external-link', 14)}<span>${post.repostsCount || 0}</span></button>
      </div>
      <div class="action-btn" style="display:inline-flex;flex-direction:row;align-items:center;gap:3px;height:22px;font-size:12px">${sb('eye', 14)}<span>${post.views}</span></div>
    </div>
    ${open ? `<div class="comments">
      <div class="comments-title">Комментарии ${post.comments.length}</div>
      ${post.comments.length ? post.comments.map((c) => `
        <div class="comment">
          ${img(c.avatar)}
          <div style="min-width:0;flex:1">
            <div style="display:flex;justify-content:space-between;gap:8px"><span class="comment-author">${esc(c.author)}</span><span class="comment-time">${esc(c.time)}</span></div>
            <div class="comment-text">${esc(c.text)}</div>
          </div>
        </div>`).join('') : '<p class="empty-note">Пока нет комментариев</p>'}
      <form class="comment-form" data-action="comment" data-id="${post.id}">
        <input class="comment-input" name="comment" placeholder="Комментарий" required>
        <button class="comment-send" type="submit">${sb('arrow-right', 16)}</button>
      </form>
    </div>` : ''}
  </article>`;
}

function renderCta() {
  return `<button class="cta ${state.invited ? 'done' : ''}" type="button" data-action="invite">
    <span class="cta-icon">${sb('users')}</span>
    <span class="cta-copy">
      <span class="cta-title">${state.invited ? 'Приглашение отправлено' : 'Пригласи друга'}</span>
      <span class="cta-sub">${state.invited ? 'Ссылка скопирована в буфер' : 'Premium внутри «Синтеза»'}</span>
    </span>
    <span class="cta-arrow">${state.invited ? sb('check', 14) : sb('arrow-right', 14)}</span>
  </button>`;
}

function renderHome() {
  return `<div class="block">${renderHero()}</div>
    <div class="block">${renderActions()}</div>
    <div class="block"><div class="section-title">Сторис</div>${renderStories()}</div>
    <div class="block"><div class="section-title">Лента</div>${state.posts.map(renderPost).join('')}</div>
    <div class="block">${renderCta()}</div>`;
}

function renderExplore() {
  const q = state.search.trim().toLowerCase();
  const trends = TRENDS.filter((t) => !q || t.title.toLowerCase().includes(q) || t.meta.toLowerCase().includes(q));
  return `<div class="block"><label class="search">${sb('search')}<input id="explore-search" value="${esc(state.search)}" placeholder="Поиск по «Синтезу»"></label></div>
    <div class="block"><div class="section-title">Тренды</div>
      <div class="card list">${trends.length ? trends.map((t) => row(sb('bar-chart'), t.title, t.meta, t.time)).join('') : '<p class="empty-note">Ничего не нашлось</p>'}</div>
    </div>
    <div class="block"><div class="section-title">Категории</div>
      <div class="card">${CATEGORIES.map((c) => `<div class="cat"><div class="cat-top"><span>${esc(c.name)}</span><span>${c.value}%</span></div><div class="track"><div class="fill" style="--w:${c.value}%"></div></div></div>`).join('')}</div>
    </div>
    <div class="block"><div class="section-title">Активность</div>
      <div class="card hours">${HOURS.map(([h, v]) => `<div class="hour"><div class="hour-track"><div class="hour-fill" style="--h:${v}%"></div></div><span>${h}</span></div>`).join('')}</div>
    </div>
    <div class="block"><div class="section-title">Сервисы</div>
      <div class="card list">
        ${row(sb('help-circle'), 'Обучение в «Синтезе»', 'Как устроена лента', sb('chevron-right', 16))}
        ${row(sb('check-circle'), 'Преимущества работы в SB', 'Для сотрудников', sb('chevron-right', 16))}
        ${row(sb('star'), 'Столовые', 'Корпоративное питание', sb('chevron-right', 16))}
        ${row(sb('truck'), 'Командировки', 'Портал заявок', sb('chevron-right', 16))}
      </div>
    </div>`;
}

function renderChats() {
  return `<div class="block"><div class="card list">${CHATS.map((c) => `
    <button class="row" type="button" data-action="mention-open" data-name="${esc(c.name)}">
      <span class="avatar">${img(c.avatar)}${c.online ? '<i class="online"></i>' : ''}</span>
      <span class="row-main">
        <span class="row-title">${esc(c.name)}</span>
        <span class="row-sub">${c.fromMe ? 'Вы: ' : ''}${esc(c.message)}</span>
      </span>
      <span class="row-side">${c.badge ? `<span class="pill">${c.badge}</span>` : c.unread ? '<i class="dot" style="display:inline-block"></i>' : ''}<div style="margin-top:4px">${esc(c.time)}</div></span>
    </button>`).join('')}</div></div>`;
}

function renderProfile() {
  return `<div class="block">
      <div class="cover">${img(POST_WORK)}</div>
      <div class="profile-avatar">${img(USER.avatar)}</div>
      <div class="profile-id"><h2 class="profile-name">${esc(USER.short)}</h2><span class="verify">${sb('check', 12)}</span></div>
      <div class="profile-handle">${esc(USER.handle)} · ${esc(USER.city)}</div>
    </div>
    <div class="block"><div class="card stats">
      <button class="stat" type="button"><b>${state.posts.length}</b><span>Посты</span></button>
      <button class="stat" type="button" data-action="widget" data-widget="subscribers"><b>1 087</b><span>Подписчики</span></button>
      <button class="stat" type="button" data-action="widget" data-widget="colleagues"><b>264</b><span>Подписки</span></button>
    </div></div>
    <div class="block"><div class="grid">${state.posts.map((p) => `
      <button class="grid-cell" type="button" data-action="open-post" data-id="${p.id}">
        ${p.image ? img(p.image) : `<span>${esc(p.text.slice(0, 80))}</span>`}
      </button>`).join('')}</div></div>
    <div class="block"><div class="card list">
      ${row(sb('briefcase'), USER.profession, 'Должность')}
      ${row(sb('users'), USER.department, 'Функция')}
      ${row(sb('map-pin'), USER.city, 'Город')}
      ${row(sb('calendar'), USER.businessTrip, state.showTripTip ? 'Казань, инженерный центр' : 'Статус', '', 'toggle-trip')}
      ${row(sb('user'), USER.manager, 'Руководитель')}
      ${row(sb('zap'), USER.experience, 'Стаж')}
      ${row(sb('message'), USER.email, 'Почта')}
      ${row(sb('bell'), USER.phone, 'Телефон')}
      ${row(sb('file'), USER.about, 'О себе')}
    </div></div>`;
}

function renderSettings() {
  const account = [
    [sb('users'), 'Группы', 'groups'],
    [sb('user'), 'Сотрудники', 'colleagues'],
    [sb('calendar'), 'Календарь', ''],
    [sb('image'), 'Фото', 'photos'],
    [sb('monitor'), 'Видео', 'videos'],
    [sb('file'), 'Файлы', 'files'],
    [sb('bookmark'), 'Закладки', ''],
    [sb('zap'), 'SB-коин', ''],
    [sb('layers'), 'Структура компании', ''],
    [sb('factory'), 'О компании', ''],
  ];
  const privacy = [
    [sb('bell'), 'Уведомления', 'notifications'],
    [sb('globe'), 'Язык приложения', ''],
    [sb('help-circle'), 'Обратная связь', ''],
    [sb('grid'), 'QR-код', 'qr'],
  ];
  const menu = (items) => items.map(([ic, label, id]) => row(ic, label, '', sb('chevron-right', 16), 'settings-item', `data-id="${id}"`)).join('');
  return `<div class="block"><div class="card who">
      <span class="who-avatar">${img(USER.avatar)}</span>
      <span class="row-main">
        <span class="row-title" style="display:flex;align-items:center;gap:8px">${esc(USER.short)} <span class="verify">${sb('check', 12)}</span></span>
        <span class="row-sub">${esc(USER.handle)}</span>
      </span>
    </div></div>
    <div class="block"><div class="card stats">
      <div class="stat"><b>${state.posts.length}</b><span>Посты</span></div>
      <div class="stat"><b>1 087</b><span>Подписчики</span></div>
      <div class="stat"><b>264</b><span>Подписки</span></div>
    </div></div>
    <div class="block"><div class="section-title">Аккаунт</div><div class="card list">${menu(account)}</div></div>
    <div class="block"><div class="section-title">Конфиденциальность</div><div class="card list">${menu(privacy)}</div></div>`;
}

function renderScreen() {
  if (state.activeTab === 'explore') return renderExplore();
  if (state.activeTab === 'chats') return renderChats();
  if (state.activeTab === 'profile') return renderProfile();
  if (state.activeTab === 'settings') return renderSettings();
  return renderHome();
}

function renderTopbar() {
  const titles = { home: 'Главная', explore: 'Поиск', chats: 'Чаты', profile: 'Профиль', settings: 'Настройки' };
  const unread = state.notifications.filter((n) => n.unread).length;
  const actions = state.activeTab === 'home'
    ? iconBtn('bell', 'notifications', unread || '') + iconBtn('grid', 'qr')
    : state.activeTab === 'chats'
      ? iconBtn('edit', 'create')
      : '';
  return `<h1>${titles[state.activeTab] || ''}</h1><div class="topbar-actions">${actions}</div>`;
}

function renderBottomNav() {
  const tabs = [
    ['home', 'home', 'Главная'],
    ['explore', 'search', 'Поиск'],
    ['chats', 'message', 'Чаты', '3'],
    ['profile', 'user', 'Профиль'],
    ['settings', 'menu', 'Ещё'],
  ];
  return tabs.map(([id, ic, label, badge]) => `
    <button class="tab ${state.activeTab === id ? 'active' : ''}" type="button" data-action="tab" data-tab="${id}">
      ${sb(ic, 20)}
      <span class="tab-label">${label}</span>
      ${badge ? `<span class="tab-badge ${String(badge).length <= 1 ? 'tab-badge-dot' : ''}">${badge}</span>` : ''}
    </button>`).join('');
}

function sheetHead(title, action, right) {
  return `<div class="sheet-head"><button class="icon-btn" type="button" data-action="${action}">${sb('chevron-left')}</button><h2>${esc(title)}</h2>${right || ''}</div>`;
}

function renderCreate() {
  const audiences = [['all', 'Все'], ['friends', 'Друзья'], ['close', 'Близкие']];
  const photos = [
    ['work', POST_WORK],
    ['school', POST_SCHOOL],
    ['office', POST_OFFICE],
    ['desk', POST_DESK],
  ];
  const can = state.newPostText.trim().length > 0;
  return `<div class="sheet">
    ${sheetHead('Новая запись', 'close', '')}
    <div class="sheet-body">
      <div class="composer-author">
        <span class="avatar">${img(USER.avatar)}</span>
        <div>
          <div class="post-name">${esc(USER.short)}</div>
          <div class="post-time">${esc(USER.profession)}</div>
        </div>
      </div>
      <div class="card" style="margin-top:16px"><textarea class="composer" id="new-post-text" placeholder="Что нового у команды?">${esc(state.newPostText)}</textarea></div>
      ${state.draftImage ? `<div class="draft-preview">${img(state.draftImage)}<button class="story-x" type="button" data-action="draft-clear" aria-label="Убрать фото">${sb('close', 14)}</button></div>` : ''}
      <div class="kicker" style="margin-top:24px">Фото</div>
      <div class="photo-pick no-scrollbar">${photos.map(([id, src]) => `
        <button type="button" class="${state.draftImage === src ? 'on' : ''}" data-action="draft-photo" data-src="${src}" aria-label="Фото ${id}">${img(src)}</button>`).join('')}</div>
      <div class="kicker" style="margin-top:24px">Кому видно</div>
      <div class="chips" style="margin-top:12px">${audiences.map(([id, label]) => `
        <button class="chip ${state.audience === id ? 'on' : ''}" type="button" data-action="audience" data-id="${id}">${label}</button>`).join('')}</div>
      <div class="kicker" style="margin-top:24px">Упомянуть</div>
      <div class="mentions no-scrollbar" style="margin-top:12px">${[
        { name: 'Ольга Александрова', avatar: AVATARS.olga },
        { name: 'Дмитрий Соколов', avatar: AVATARS.dmitry },
        { name: 'Мария Смирнова', avatar: AVATARS.maria },
        { name: 'Алексей Воронов', avatar: AVATARS.alexey },
        { name: 'Елена Петрова', avatar: AVATARS.elena },
        { name: 'Андрей Бобр', avatar: AVATARS.andrey },
      ].map((c) => `
        <button class="mention ${state.mentions.includes(c.name) ? 'on' : ''}" type="button" data-action="mention" data-name="${esc(c.name)}">
          <span class="avatar">${img(c.avatar)}</span>
          <span>${esc(c.name.split(' ')[0])}</span>
        </button>`).join('')}</div>
    </div>
    <div class="sheet-publish-wrap">
      <button class="sheet-publish" type="button" data-action="publish-post" ${can ? '' : 'disabled'}>Опубликовать</button>
    </div>
  </div>`;
}

function renderNotifications() {
  return `<div class="sheet">
    ${sheetHead('Уведомления', 'close', '<button class="linkish" type="button" data-action="read-all">Прочитать все</button>')}
    <div class="sheet-body"><div class="card list">${state.notifications.map((n, i) => `
      <div class="row">
        <span class="sq muted">${sb(n.icon)}</span>
        <span class="row-main"><span class="row-title">${esc(n.text)}</span><span class="row-sub">${esc(n.time)}</span></span>
        ${n.unread ? '<span class="dot"></span>' : ''}
      </div>`).join('')}</div></div>
  </div>`;
}

function renderQr() {
  return `<div class="sheet">
    ${sheetHead('QR-код', 'close')}
    <div class="sheet-body">
      <div class="qr-box"><img src="assets/Moe_Epsilon_QR_code_vector%201.png" alt=""></div>
      <button class="publish block" type="button" data-action="show-contacts">${state.qrContacts ? 'Контакты' : 'Показать контакты'}</button>
      ${state.qrContacts ? `<div class="card list block">
        ${row(sb('user'), USER.short, USER.handle)}
        ${row(sb('briefcase'), USER.profession, USER.department)}
        ${row(sb('map-pin'), USER.city, USER.birthday)}
      </div>` : ''}
    </div>
  </div>`;
}

function renderStory() {
  const people = storyList();
  const p = people[state.storyId] || people[0];
  const bars = people.map((item, i) => {
    const cls = i < state.storyId ? 'done' : i === state.storyId ? 'now' : '';
    return `<span class="story-bar ${cls}"><i></i></span>`;
  }).join('');
  const media = p.mine
    ? `<div class="story-empty">${img(p.avatar, 'big')}<h3>Пока нет истории</h3><p>Короткое фото или новость для коллег</p><button class="publish" type="button" data-action="create">Создать</button></div>`
    : `${img(p.image, 'story-bg')}<p class="story-caption">${esc(p.text)}</p>`;
  return `<div class="story-view">
    ${media}
    <div class="story-scrim"></div>
    <div class="story-top">
      <div class="story-bars">${bars}</div>
      <div class="story-meta">
        ${img(p.avatar)}
        <div><b>${esc(p.mine ? 'Ваша история' : p.name)}</b>${p.time ? `<span>${esc(p.time)}</span>` : ''}</div>
        <button class="story-x" type="button" data-action="close" aria-label="Закрыть">${sb('close', 16)}</button>
      </div>
    </div>
    <button class="story-hit left" type="button" data-action="story-prev" aria-label="Назад"></button>
    <button class="story-hit right" type="button" data-action="story-next" aria-label="Дальше"></button>
  </div>`;
}

function reelList() {
  return [
    { id: 'r1', author: 'Ольга Александрова', avatar: AVATARS.olga, image: POST_WORK, time: '2 ч', text: 'Финал переговоров по инженерному центру в Казани. Контракт собрали без потери качества.', likes: 1240 },
    { id: 'r2', author: 'Константин К.', avatar: USER.avatar, image: POST_SCHOOL, time: '5 ч', text: 'Планёрка на 20 минут: статус, риск, следующий шаг — и команда снова в работе.', likes: 860 },
    { id: 'r3', author: 'Дмитрий Соколов', avatar: AVATARS.dmitry, image: POST_SERVERS, time: '8 ч', text: 'Стенд R&D: за минуту показываем новый контур.', likes: 430 },
    { id: 'r4', author: 'Елена Петрова', avatar: AVATARS.elena, image: POST_BOOKS, time: '1 д', text: 'Инструктаж на площадке: безопасность у линии без лишней бюрократии.', likes: 210 },
  ];
}

function renderReels() {
  const list = reelList();
  const r = list[state.reelId] || list[0];
  const liked = !!state.reelLiked[r.id];
  const likes = r.likes + (liked ? 1 : 0);
  const bars = list.map((item, i) => {
    const cls = i < state.reelId ? 'done' : i === state.reelId ? 'now' : '';
    return `<span class="story-bar ${cls}"><i></i></span>`;
  }).join('');
  return `<div class="story-view reel-view">
    ${img(r.image, 'story-bg')}
    <div class="story-scrim"></div>
    <div class="story-top">
      <div class="story-bars">${bars}</div>
      <div class="story-meta">
        <div><b>Reels</b><span>${state.reelId + 1} из ${list.length}</span></div>
        <button class="story-x" type="button" data-action="close" aria-label="Закрыть">${sb('close', 16)}</button>
      </div>
    </div>
    <div class="reel-bottom">
      <div class="reel-author">${img(r.avatar)}<div><b>${esc(r.author)}</b><span>${esc(r.time)}</span></div></div>
      <p>${esc(r.text)}</p>
    </div>
    <div class="reel-rail">
      <button type="button" class="${liked ? 'on' : ''}" data-action="reel-like">${sb('heart', 22)}<span>${formatLikes(likes)}</span></button>
      <button type="button">${sb('message', 22)}<span>18</span></button>
      <button type="button">${sb('eye', 22)}<span>2,4K</span></button>
    </div>
    <button class="story-hit left" type="button" data-action="reel-prev" aria-label="Назад"></button>
    <button class="story-hit right" type="button" data-action="reel-next" aria-label="Дальше"></button>
  </div>`;
}

function renderLive() {
  return `<div class="live-card">
    <div class="live-hero" style="display:flex;align-items:center;justify-content:center;background:var(--bg-green);color:var(--primary)">${sb('zap', 28)}</div>
    <h3>Эфир отдела закупок</h3>
    <p>Сегодня в 16:00 · Москва</p>
    <button class="publish block" type="button" data-action="remind">${state.reminded ? 'Напомним' : 'Напомнить'}</button>
  </div>`;
}

function renderWidgetModal() {
  const map = {
    subscribers: { fullLabel: 'Подписчики', count: '1 087', id: 'subscribers' },
    colleagues: { fullLabel: 'Подписки', count: '264', id: 'colleagues' },
    photos: { fullLabel: 'Фото', count: '783', id: 'photos' },
    videos: { fullLabel: 'Видео', count: '6', id: 'videos' },
    files: { fullLabel: 'Файлы', count: '42', id: 'files' },
    groups: { fullLabel: 'Группы', count: '54', id: 'groups' },
  };
  const w = map[state.selectedWidget];
  if (!w) return '';
  let body = '';
  if (w.id === 'photos') {
    body = `<div class="grid" style="padding:8px">${[POST_WORK, POST_SCHOOL, POST_OFFICE, POST_DESK].map((u) => `<div class="grid-cell">${img(u)}</div>`).join('')}</div>`;
  } else if (w.id === 'colleagues' || w.id === 'subscribers' || w.id === 'groups') {
    body = `<div class="list">${COLLEAGUES.map((c) => `
      <div class="row"><span class="avatar">${img(c.avatar)}</span><span class="row-main"><span class="row-title">${esc(c.name)}</span><span class="row-sub">${esc(c.role)}</span></span></div>`).join('')}</div>`;
  } else if (w.id === 'files') {
    body = `<div class="list">
      ${row(sb('file'), 'Регламент закупок 2026', '4,2 МБ')}
      ${row(sb('file'), 'Шаблон заявки', '1,8 МБ')}
      ${row(sb('file'), 'Отчёт квартала', '8,5 МБ')}
    </div>`;
  } else {
    body = `<p class="empty-note" style="padding:16px">Записи вебинаров и презентаций. Всего ${esc(w.count)}.</p>`;
  }
  return `<div class="modal-card" onclick="event.stopPropagation()">
    <div class="modal-card-header"><div style="display:flex;align-items:center"><span class="modal-card-title">${esc(w.fullLabel)}</span><span class="modal-count">${esc(w.count)}</span></div>
      <button class="icon-btn" type="button" data-action="close-widget">${sb('chevron-left')}</button></div>
    <div class="modal-card-body">${body}</div>
    <div class="modal-card-footer"><button class="publish" type="button" data-action="close-widget">Закрыть</button></div>
  </div>`;
}

function renderOverlay() {
  if (state.selectedWidget) return renderWidgetModal();
  if (state.overlay === 'create') return renderCreate();
  if (state.overlay === 'notifications') return renderNotifications();
  if (state.overlay === 'qr') return renderQr();
  if (state.overlay === 'story') return renderStory();
  if (state.overlay === 'reels') return renderReels();
  if (state.overlay === 'live') return renderLive();
  return '';
}

function bindDynamic() {
  const textarea = document.getElementById('new-post-text');
  if (textarea) {
    textarea.addEventListener('input', (e) => {
      state.newPostText = e.target.value;
      const publish = document.querySelector('[data-action="publish-post"]');
      if (publish) publish.disabled = !state.newPostText.trim();
    });
    textarea.focus();
    const len = textarea.value.length;
    textarea.selectionStart = textarea.selectionEnd = len;
  }
  const search = document.getElementById('explore-search');
  if (search) {
    search.addEventListener('input', (e) => {
      state.search = e.target.value;
      state.focusSearch = true;
      render();
    });
    if (state.focusSearch) {
      search.focus();
      const len = search.value.length;
      search.selectionStart = search.selectionEnd = len;
      state.focusSearch = false;
    }
  }
}

const HERO_SCANNER_OPTS = {
  color1: '#10b981',
  color2: '#10b981',
  color3: '#FFFFFF',
  speed: 0.5,
  sweepSpeed: 0.25,
  sweepWidth: 1.6,
  trail: 0.5,
  ripple: 0.22,
  bandDensity: 11,
  glow: 0.6,
  scanDirection: 'vertical',
  colorSpread: 0.7,
  scanline: true,
  scanlineIntensity: 0.5,
  mouseInteraction: true,
  clickEffect: 'ping',
  reverse: false,
  scale: 1.5,
  frequency: 2,
  lineWidth: 1.2,
  brightness: 1,
  vignette: 0.3,
  grain: true,
  grainIntensity: 0.04,
  opacity: 1,
  mouseMode: 'repel',
  mouseRadius: 0.5,
  mouseStrength: 0.7,
  intro: true,
  lightMode: false,
};

let disposeHeroScanner = null;
let heroScannerPark = null;

function getHeroScannerPark() {
  if (heroScannerPark) return heroScannerPark;
  heroScannerPark = document.createElement('div');
  heroScannerPark.id = 'hero-scanner-park';
  heroScannerPark.setAttribute('aria-hidden', 'true');
  heroScannerPark.style.cssText = 'position:fixed;left:-9999px;top:0;width:320px;height:64px;opacity:0;pointer-events:none;';
  document.body.appendChild(heroScannerPark);
  return heroScannerPark;
}

function parkHeroScanner(sc) {
  const host = sc?.querySelector?.('.hero-scanner');
  if (!host?.querySelector('canvas')) return;
  getHeroScannerPark().appendChild(host);
}

function syncHeroScanner() {
  const host = document.querySelector('#screen-content .hero-scanner');
  const park = getHeroScannerPark();
  const parked = park.querySelector('.hero-scanner');
  if (!host) return;
  if (parked) {
    host.replaceWith(parked);
    return;
  }
  if (host.querySelector('canvas')) return;
  if (typeof mountScanner !== 'function') return;
  if (disposeHeroScanner) disposeHeroScanner();
  disposeHeroScanner = mountScanner(host, HERO_SCANNER_OPTS);
}

let pendingLikePop = null;
let enterTimer = 0;

function render() {
  const sc = document.getElementById('screen-content');
  const topbar = document.getElementById('topbar');
  const keep = state.seenTab === state.activeTab;
  const top = keep ? sc.scrollTop : 0;
  state.seenTab = state.activeTab;
  parkHeroScanner(sc);
  sc.classList.remove('is-entering');
  sc.innerHTML = renderScreen() + (state.toast ? `<div class="toast">${esc(state.toast)}</div>` : '');
  topbar.innerHTML = renderTopbar();
  document.getElementById('bottom-nav').innerHTML = renderBottomNav();
  const overlay = document.getElementById('overlay');
  const html = renderOverlay();
  const dim = state.selectedWidget || state.overlay === 'story' || state.overlay === 'reels' || state.overlay === 'live';
  overlay.className = 'overlay' + (html ? (dim && !state.overlay?.match(/create|notifications|qr/) ? ' dim' : state.selectedWidget ? ' dim' : ' sheet-mode') : '');
  if (state.selectedWidget) overlay.className = 'overlay dim';
  else if (state.overlay === 'story' || state.overlay === 'reels') overlay.className = 'overlay story-mode';
  else if (state.overlay === 'live') overlay.className = 'overlay dim';
  else if (state.overlay) overlay.className = 'overlay sheet-mode';
  else overlay.className = 'overlay';
  overlay.innerHTML = html;
  document.querySelector('.iphone-screen').classList.toggle('has-overlay', Boolean(html));
  if (keep) sc.scrollTop = top;
  bindDynamic();
  syncStoryTimer();
  syncHeroScanner();

  if (!keep) {
    clearTimeout(enterTimer);
    void sc.offsetWidth;
    sc.classList.add('is-entering');
    topbar.classList.remove('is-swap');
    void topbar.offsetWidth;
    topbar.classList.add('is-swap');
    enterTimer = setTimeout(() => {
      sc.classList.remove('is-entering');
      topbar.classList.remove('is-swap');
    }, 700);
  }

  if (pendingLikePop) {
    const btn = sc.querySelector(`.action-btn[data-action="like"][data-id="${pendingLikePop}"]`);
    if (btn) {
      btn.classList.add('pop');
      setTimeout(() => btn.classList.remove('pop'), 450);
    }
    pendingLikePop = null;
  }
}

let storyTimer = 0;
function syncStoryTimer() {
  clearTimeout(storyTimer);
  if (state.overlay === 'reels') {
    storyTimer = setTimeout(() => stepReel(1), 5000);
    return;
  }
  if (state.overlay !== 'story') return;
  const item = storyList()[state.storyId];
  if (!item || item.mine) return;
  storyTimer = setTimeout(() => stepStory(1), 4200);
}

function stepReel(dir) {
  const next = state.reelId + dir;
  if (next < 0) return;
  if (next >= reelList().length) {
    state.overlay = null;
    render();
    return;
  }
  state.reelId = next;
  render();
}

function openStory(index) {
  const list = storyList();
  const next = Math.max(0, Math.min(index, list.length - 1));
  state.storyId = next;
  state.overlay = 'story';
  state.seenStories[list[next].id] = true;
  render();
}

function stepStory(dir) {
  const next = state.storyId + dir;
  if (next < 0) return;
  if (next >= storyList().length) {
    state.overlay = null;
    render();
    return;
  }
  openStory(next);
}

function openWidget(id) {
  if (!id) {
    state.toast = 'Раздел откроется в следующей версии';
    render();
    setTimeout(() => { state.toast = ''; render(); }, 1600);
    return;
  }
  state.selectedWidget = id;
  render();
}

function handleClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) {
    if (e.target.id === 'overlay') {
      state.overlay = null;
      state.selectedWidget = null;
      state.qrContacts = false;
      render();
    }
    return;
  }
  const action = el.dataset.action;
  if (action === 'tab') {
    state.activeTab = el.dataset.tab;
    state.overlay = null;
    state.selectedWidget = null;
    state.seenTab = '';
    render();
    return;
  }
  if (action === 'create' || action === 'mention-open') {
    if (action === 'mention-open' && el.dataset.name && !state.mentions.includes(el.dataset.name)) state.mentions.push(el.dataset.name);
    state.overlay = 'create';
    render();
    return;
  }
  if (action === 'stories') { openStory(1); return; }
  if (action === 'story') { openStory(Number(el.dataset.id) || 0); return; }
  if (action === 'story-next') { stepStory(1); return; }
  if (action === 'story-prev') { stepStory(-1); return; }
  if (action === 'reels') { state.reelId = 0; state.overlay = 'reels'; render(); return; }
  if (action === 'reel-next') { stepReel(1); return; }
  if (action === 'reel-prev') { stepReel(-1); return; }
  if (action === 'reel-like') {
    const reel = reelList()[state.reelId];
    if (reel) state.reelLiked[reel.id] = !state.reelLiked[reel.id];
    render();
    return;
  }
  if (action === 'live') { state.overlay = 'live'; render(); return; }
  if (action === 'notifications') { state.overlay = 'notifications'; render(); return; }
  if (action === 'qr') { state.qrContacts = false; state.overlay = 'qr'; render(); return; }
  if (action === 'close') { state.overlay = null; state.qrContacts = false; render(); return; }
  if (action === 'close-widget') { state.selectedWidget = null; render(); return; }
  if (action === 'read-all') { state.notifications.forEach((n) => { n.unread = false; }); render(); return; }
  if (action === 'show-contacts') { state.qrContacts = true; render(); return; }
  if (action === 'remind') { state.reminded = true; render(); return; }
  if (action === 'invite') { state.invited = true; render(); return; }
  if (action === 'toggle-trip') { state.showTripTip = !state.showTripTip; render(); return; }
  if (action === 'audience') { state.audience = el.dataset.id; render(); return; }
  if (action === 'mention') {
    const name = el.dataset.name;
    const tag = `@${name.split(' ')[0]}`;
    if (state.mentions.includes(name)) {
      state.mentions = state.mentions.filter((n) => n !== name);
      state.newPostText = state.newPostText.replace(tag, '').replace(/[ \t]{2,}/g, ' ').trim();
    } else {
      state.mentions = state.mentions.concat(name);
      state.newPostText = `${state.newPostText.trim()} ${tag}`.trim();
    }
    render();
    return;
  }
  if (action === 'draft-photo') {
    state.draftImage = state.draftImage === el.dataset.src ? '' : el.dataset.src;
    render();
    return;
  }
  if (action === 'draft-clear') { state.draftImage = ''; render(); return; }
  if (action === 'widget') { openWidget(el.dataset.widget); return; }
  if (action === 'settings-item') {
    const id = el.dataset.id;
    if (id === 'notifications') { state.overlay = 'notifications'; render(); return; }
    if (id === 'qr') { state.qrContacts = false; state.overlay = 'qr'; render(); return; }
    openWidget(id);
    return;
  }
  if (action === 'open-post') {
    state.activeTab = 'home';
    state.seenTab = '';
    state.overlay = null;
    state.openComments[el.dataset.id] = true;
    render();
    return;
  }
  if (action === 'like') {
    const post = state.posts.find((p) => p.id === el.dataset.id);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
      post.likes = formatLikes(post.likesCount);
      if (post.isLiked) pendingLikePop = post.id;
      render();
    }
    return;
  }
  if (action === 'comments') {
    state.openComments[el.dataset.id] = !state.openComments[el.dataset.id];
    render();
    return;
  }
  if (action === 'expand') {
    state.expandedPosts[el.dataset.id] = !state.expandedPosts[el.dataset.id];
    render();
    return;
  }
  if (action === 'publish-post' && state.newPostText.trim()) {
    const who = { all: 'Все', friends: 'Друзья', close: 'Близкие' }[state.audience] || 'Все';
    state.posts.unshift({
      id: `post-${Date.now()}`,
      author: USER.short,
      time: `Только что · ${who}`,
      text: state.newPostText.trim(),
      image: state.draftImage || '',
      views: 1,
      likes: '0',
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      repostsCount: 0,
      comments: [],
    });
    state.newPostText = '';
    state.draftImage = '';
    state.mentions = [];
    state.overlay = null;
    state.activeTab = 'home';
    state.seenTab = '';
    render();
  }
}

function handleSubmit(e) {
  const form = e.target.closest('[data-action="comment"]');
  if (!form) return;
  e.preventDefault();
  const input = form.querySelector('input');
  const text = input.value.trim();
  if (!text) return;
  const post = state.posts.find((p) => p.id === form.dataset.id);
  if (!post) return;
  post.comments.unshift({ id: `c-${Date.now()}`, author: USER.short, avatar: USER.avatar, text, time: 'Только что' });
  post.commentsCount = post.comments.length;
  state.openComments[post.id] = true;
  render();
}

document.getElementById('screen-content').addEventListener('click', handleClick);
document.getElementById('screen-content').addEventListener('submit', handleSubmit);
document.getElementById('topbar').addEventListener('click', handleClick);
document.getElementById('bottom-nav').addEventListener('click', handleClick);
document.getElementById('overlay').addEventListener('click', handleClick);
document.getElementById('overlay').addEventListener('submit', handleSubmit);

const PHONE_W = 375;
const PHONE_H = 812;
const PHONE_PAD = 24;

function updatePhoneScale() {
  const aw = Math.max(window.innerWidth - PHONE_PAD, 1);
  const ah = Math.max(window.innerHeight - PHONE_PAD, 1);
  const scale = Math.min(aw / PHONE_W, ah / PHONE_H, 1);
  document.documentElement.style.setProperty('--ui-scale', String(scale));
}

updatePhoneScale();
window.addEventListener('resize', updatePhoneScale);
window.addEventListener('orientationchange', updatePhoneScale);

render();
