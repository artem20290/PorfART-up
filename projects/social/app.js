/* eslint-disable no-unused-vars */
const AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250';
const AVATARS = {
  konstantin: AVATAR,
  olga: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  dmitry: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  maria: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
  alexey: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=150',
  elena: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=150',
  alexander: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  andrey: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
  ekaterina: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  mariaIvanova: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  anna: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  alexanderAlt: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
  groupChat: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
  officeChat: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150',
  devChat: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=150',
};
const POST_SCHOOL = 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600';
const POST_WORK = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600';

const USER = {
  name: 'Константиновский Константин Константинович',
  avatar: AVATAR,
  birthday: '26 февраля',
  businessTrip: 'В командировке до 12 сентября',
  city: 'Москва',
  profession: 'Менеджер по закупкам',
  department: 'корпоративные коммуникации',
};

const WIDGETS = [
  { id: 'greetings', count: '11', label: 'Поздрав.', fullLabel: 'Поздравления', description: 'Поздравления от коллег с днем рождения и профессиональными успехами.' },
  { id: 'thanks', count: '12', label: 'Спасибо!', fullLabel: 'Благодарности', description: 'Корпоративные награды и "Спасибо" за помощь в кросс-функциональных проектах.' },
  { id: 'colleagues', count: '264', label: 'Коллеги', fullLabel: 'Коллеги и контакты', description: 'Активные контакты в корпоративной сети.' },
  { id: 'subscribers', count: '1 087', label: 'Подпис.', fullLabel: 'Подписчики', description: 'Сотрудники, следящие за новостями и публикациями Константина.' },
  { id: 'photos', count: '783', label: 'Фото', fullLabel: 'Фотоальбомы', description: 'Фотографии с конференций, тимбилдингов и командировок.' },
  { id: 'videos', count: '6', label: 'Видео', fullLabel: 'Видеозаписи', description: 'Записи вебинаров и презентаций по закупочным процедурам.' },
  { id: 'files', count: '42', label: 'Файлы', fullLabel: 'Документы и шаблоны', description: 'Регламенты, тендерная документация и публичные отчеты.' },
  { id: 'groups', count: '54', label: 'Группы', fullLabel: 'Корпоративные группы', description: 'Проектные команды, клуб любителей бега, IT-инновации и др.' },
];

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: 'Константин Константинов...',
    time: 'Сегодня в 12:34',
    text: 'Не ходить на собрания и не обращать внимания на оценки. Как пережить школу.\n\n«Валялся на полу», «веселился», «громко смеялся». Каких только замечаний не увидишь в дневнике школьника.\n\nМногие родители переживают из-за школьных оценок больше, чем сами дети. Но психологи советуют сместить фокус на психологический комфорт, любознательность и развитие критического мышления. Важно помнить, что школьный дневник — это инструмент обучения, а не приговор будущему успеху! 📚✨',
    image: POST_SCHOOL,
    views: 230,
    likes: '99,9K',
    likesCount: 99900,
    isLiked: false,
    commentsCount: 3,
    repostsCount: 1,
    comments: [
      { id: 'c1', author: 'Мария Смирнова', avatar: AVATARS.maria, text: 'Очень актуально! У моего сына в 5 классе постоянно такие смешные замечания от классного руководителя 😃', time: '12:45' },
      { id: 'c2', author: 'Алексей Воронов', avatar: AVATARS.alexey, text: 'Согласен на 100%. Сам в школе был троечником по физике, а сейчас руковожу инженерным отделом.', time: '13:02' },
      { id: 'c3', author: 'Елена Петрова (HR)', avatar: AVATARS.elena, text: 'Константин, спасибо за статью! Обязательно поделимся ею в нашем родительском корпоративном клубе 👏', time: '13:15' },
    ],
  },
  {
    id: 'post-2',
    author: 'Константин Константинов...',
    time: 'Вчера в 16:20',
    text: '🚀 Успешно завершили первый этап масштабного тендера на поставку IT-оборудования и серверных мощностей для нашего нового дата-центра в Казани!\n\nОсобая благодарность нашей кросс-функциональной команде. Мы смогли снизить первоначальную стоимость контракта на 14.5% без потери в качестве.\n\nПродолжаем двигаться вперед к цифровой трансформации нашего холдинга! 💪💼',
    image: POST_WORK,
    views: 1420,
    likes: '1,2K',
    likesCount: 1240,
    isLiked: true,
    commentsCount: 18,
    repostsCount: 12,
    comments: [
      { id: 'c2-1', author: 'Дмитрий Соколов (IT Директор)', avatar: AVATARS.dmitry, text: 'Колоссальная работа, Константин! Серверы ждем с нетерпением 🔥', time: 'Вчера в 17:05' },
    ],
  },
  {
    id: 'post-3',
    author: 'Константин Константинов...',
    time: '3 дня назад',
    text: '🎉 Ровно 5 лет назад я переступил порог нашего офиса на Тверской в качестве младшего специалиста по закупкам.\n\nЗа эти годы было проведено более 350 тендеров, заключено контрактов на общую сумму свыше 4 млрд рублей.\n\nСпасибо каждому, кто делает нашу компанию лучшим местом для профессионального роста! ❤️🏆',
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
  { name: 'Дмитрий Соколов', role: 'IT Директор', avatar: AVATARS.dmitry, status: 'online' },
  { name: 'Мария Смирнова', role: 'Главный бухгалтер', avatar: AVATARS.maria, status: 'offline' },
  { name: 'Алексей Воронов', role: 'Руководитель R&D', avatar: AVATARS.alexey, status: 'online' },
  { name: 'Елена Петрова', role: 'HR Бизнес-партнер', avatar: AVATARS.elena, status: 'busy' },
];

const CHATS = [
  { name: 'Александр Александров', avatar: AVATARS.alexander, online: true, message: 'Спасибо))', time: '2ч', badge: 137 },
  { name: 'Лучший чат', avatar: AVATARS.groupChat, message: 'Алеся: кто идет завтра на ...', time: '3ч', badge: 2 },
  { name: 'Андрей Бобр', avatar: AVATARS.andrey, fromMe: true, message: 'Зачем нам это?', time: '4ч', unread: true },
  { name: 'Екатерина Партищенко', avatar: AVATARS.ekaterina, message: 'Привет! Завтра идёшь на ...', time: '6ч', badge: 1 },
  { name: 'Тест чат', avatar: AVATARS.officeChat, message: 'Андрей: джира работает!', time: '16ч', badge: 56 },
  { name: 'Мария Иванова', avatar: AVATARS.mariaIvanova, online: true, fromMe: true, message: 'Спасибо, и Вам!', time: '1д', read: true },
];

const NOTIFICATIONS = [
  { icon: 'heart', color: '#ea483e', bg: '#fef2f2', text: 'Мария Смирнова и 42 коллеги оценили вашу запись.', time: '10 мин', unread: true },
  { icon: 'message', color: '#008c95', bg: '#edf7f7', text: 'Алексей Воронов оставил комментарий.', time: '1 час', unread: true },
  { icon: 'check', color: '#99cc00', bg: '#edf7f7', text: 'Заявка на командировку одобрена.', time: 'Вчера', unread: false },
  { icon: 'user', color: '#33bbbb', bg: '#edf7f7', text: '5 новых подписчиков из логистики.', time: '2 дня', unread: false },
];

const state = {
  posts: JSON.parse(JSON.stringify(INITIAL_POSTS)),
  activeTab: 'news',
  expandedPosts: {},
  openComments: {},
  showTripTip: false,
  selectedWidget: null,
  isNewPostOpen: false,
  isQrOpen: false,
  isHelpOpen: false,
  newPostText: '',
};

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function formatLikes(n) {
  if (n >= 100000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')}K`;
  return n.toLocaleString('ru-RU');
}

function getMoscowTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const moscow = new Date(utc + 3600000 * 3);
  return `${String(moscow.getHours()).padStart(2, '0')}:${String(moscow.getMinutes()).padStart(2, '0')}`;
}

function icon(name) {
  const icons = {
    arrowLeft: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    qr: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>',
    link: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    cake: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01"/></svg>',
    plane: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
    mapPin: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    briefcase: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    message: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    share: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
    eye: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    more: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    x: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    check: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>',
    news: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.7778 2H4.22222C3 2 2 3 2 4.22222V19.7778C2 21 3 22 4.22222 22H19.7778C21 22 22 21 22 19.7778V4.22222C22 3 21 2 19.7778 2ZM19.7778 19.7778H4.22222V8.66667H19.7778V19.7778ZM4.22222 6.44444V4.22222H19.7778V6.44444H4.22222ZM6.44444 10.8889H17.5556V13.1111H6.44444V10.8889ZM6.44444 15.3333H14.2222V17.5556H6.44444V15.3333Z" fill="currentColor"/></svg>',
    grid: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.582 7.90514C11.806 7.1291 11.806 5.8709 12.582 5.09486L16.0949 1.58203C16.8709 0.805991 18.1291 0.805991 18.9051 1.58203L22.418 5.09486C23.194 5.8709 23.194 7.1291 22.418 7.90514L18.9051 11.418C18.1291 12.194 16.8709 12.194 16.0949 11.418L12.582 7.90514ZM13.9872 6.5L17.5 2.98716L21.0128 6.5L17.5 10.0128L13.9872 6.5Z" fill="currentColor"/></svg>',
    chats: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.44054 15.2087L5.86571 18.1922L9.71341 16.6944L10.3238 16.8008C10.8618 16.8946 11.4225 16.9444 12 16.9444C16.6921 16.9444 19.7778 13.8462 19.7778 10.8333C19.7778 7.82042 16.6921 4.72222 12 4.72222C7.30788 4.72222 4.22222 7.82042 4.22222 10.8333C4.22222 12.1129 4.73088 13.3428 5.68547 14.3846L6.44054 15.2087ZM3.87812 21.3505C3.46146 21.5127 3.03531 21.1365 3.12258 20.6836L3.28678 19.8314L4.04699 15.8858C2.76276 14.4842 2 12.733 2 10.8333C2 6.23096 6.47715 2.5 12 2.5C17.5228 2.5 22 6.23096 22 10.8333C22 15.4357 17.5228 19.1667 12 19.1667C11.2946 19.1667 10.6063 19.1058 9.94215 18.99L3.87812 21.3505Z" fill="currentColor"/></svg>',
    bell: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.1682 17.4277L18.7228 16.0385V10.6538C18.7228 7.34769 16.8853 4.58 13.6809 3.84769V3.11538C13.6809 2.22154 12.9302 1.5 12.0002 1.5C11.0702 1.5 10.3195 2.22154 10.3195 3.11538V3.84769C7.10387 4.58 5.27755 7.33692 5.27755 10.6538V16.0385L3.83218 17.4277C3.12631 18.1062 3.6193 19.2692 4.61649 19.2692H19.3727C20.3811 19.2692 20.8741 18.1062 20.1682 17.4277ZM16.4819 17.1154H7.51843V10.6538C7.51843 7.98308 9.2103 5.80769 12.0002 5.80769C14.7901 5.80769 16.4819 7.98308 16.4819 10.6538V17.1154ZM12.0002 22.5C13.2327 22.5 14.2411 21.5308 14.2411 20.3462H9.75931C9.75931 20.9174 9.9954 21.4652 10.4157 21.8692C10.8359 22.2731 11.4059 22.5 12.0002 22.5Z" fill="currentColor"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 18.8406C3 19.4809 3.44772 20 4 20H20C20.5523 20 21 19.4809 21 18.8406C21 18.2003 20.5523 17.6812 20 17.6812H4C3.44772 17.6812 3 18.2003 3 18.8406ZM3 12C3 12.6403 3.44772 13.1594 4 13.1594H20C20.5523 13.1594 21 12.6403 21 12C21 11.3597 20.5523 10.8406 20 10.8406H4C3.44772 10.8406 3 11.3597 3 12ZM4 4C3.44772 4 3 4.51909 3 5.15942C3 5.79975 3.44772 6.31884 4 6.31884H20C20.5523 6.31884 21 5.79975 21 5.15942C21 4.51909 20.5523 4 20 4H4Z" fill="currentColor"/></svg>',
    smartphone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
    sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    grad: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    calendar: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    image: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    video: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
    file: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
    bookmark: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>',
    help: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    globe: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    person: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
    userPlus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
    paperclip: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    chevron: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  };
  return icons[name] || '';
}

function renderProfileHeader() {
  return `
    <div class="profile-header">
      <div class="avatar-wrap">
        <div class="avatar"><img src="${USER.avatar}" alt="" onerror="this.src='${AVATAR}'"></div>
        <div class="online-dot animate-pulse"></div>
      </div>
      <h1 class="profile-name">${esc(USER.name)}</h1>
      <div class="profile-meta">${icon('cake')}<span>${esc(USER.birthday)}</span></div>
      <div class="profile-meta" style="position:relative">
        <button class="profile-meta" data-action="toggle-trip" style="padding:0">${icon('plane')}<span>${esc(USER.businessTrip)}</span></button>
        ${state.showTripTip ? `<div class="trip-tip"><div class="trip-tip-title">${icon('mapPin')}<span>г. Казань, Дата-центр №2</span></div><p style="opacity:0.8">Финальный раунд переговоров по IT-оборудованию.</p></div>` : ''}
      </div>
    </div>`;
}

function renderProfileInfo() {
  const infoBase = 'assets/info/%D0%9F%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C/--item/Icons';
  const infoIcon = (file) =>
    `<img class="info-icon" src="${infoBase}/${encodeURIComponent(file)}" alt="" width="24" height="24">`;

  return `
    <div class="sep-8"></div><div class="sep-line"></div><div class="sep-8"></div>
    <div class="info-row">${infoIcon('City.svg')}<span style="padding-top:2px">${esc(USER.city)} (${getMoscowTime()})</span></div>
    <div class="info-row">${infoIcon('Profession.svg')}<span style="padding-top:2px">${esc(USER.profession)}</span></div>
    <div class="info-row">${infoIcon('Group.svg')}<span style="padding-top:2px">Функция: <span class="primary-text">${esc(USER.department)}</span></span></div>
    <div class="info-row">${infoIcon('Info.svg')}<span class="primary-text" style="padding-top:2px">Подробная информация</span></div>
    <div class="sep-8"></div>`;
}

function renderWidgets() {
  return `
    <div class="sep-8-secondary"></div>
    <div class="widgets-scroll">
      <div class="widgets-row no-scrollbar">
        ${WIDGETS.map(w => `<div class="widget-item" title="${esc(w.fullLabel)}"><div class="widget-count">${esc(w.count)}</div><div class="widget-label">${esc(w.label)}</div></div>`).join('')}
      </div>
    </div>
    <div class="sep-8-secondary"></div>`;
}

function renderCreatePostBar() {
  return `
    <div class="create-post">
      <div class="create-post-avatar"><img src="${USER.avatar}" alt="" onerror="this.src='${AVATAR}'"></div>
      <div class="create-post-input" data-action="new-post">Есть новости? Расскажите!</div>
    </div>
    <div class="sep-8-secondary"></div>`;
}

function renderPost(post) {
  const isLong = post.text.length > 200;
  const expanded = state.expandedPosts[post.id];
  const displayText = !isLong || expanded ? post.text : post.text.slice(0, 200) + '...';
  const commentsOpen = state.openComments[post.id];
  const postIcon = (file) =>
    `<img class="post-action-icon" src="assets/post/Icons/${encodeURIComponent(file)}" alt="" width="24" height="24">`;

  return `
    <article class="post" data-post-id="${post.id}">
      <div class="sep-8"></div>
      <div class="post-header">
        <div class="post-author">
          <div class="post-avatar"><img src="${USER.avatar}" alt="" onerror="this.src='${AVATAR}'"></div>
          <div><div class="post-author-name">${esc(post.author)}</div><div class="post-time">${esc(post.time)}</div></div>
        </div>
        <button>${icon('more')}</button>
      </div>
      <div class="post-text">${esc(displayText).replace(/\n/g, '<br>')}${isLong ? `<button class="post-expand" data-action="expand" data-id="${post.id}">${expanded ? 'Свернуть' : 'Показать полностью...'}</button>` : ''}</div>
      ${post.image ? `<div class="post-image"><img src="${post.image}" alt="" onerror="this.parentElement.style.display='none'"></div>` : ''}
      <div class="sep-8"></div><div class="sep-line" style="margin:0"></div>
      <div class="post-actions">
        <div class="post-actions-left">
          <button class="action-btn ${post.isLiked ? 'liked' : ''}" data-action="like" data-id="${post.id}">${postIcon('Like - off.svg')}<span>${esc(post.likes)}</span></button>
          <button class="action-btn" data-action="comments" data-id="${post.id}">${postIcon('Comment.svg')}<span>${post.commentsCount || post.comments.length}</span></button>
          <button class="action-btn">${postIcon('Repost.svg')}<span>${post.repostsCount || 0}</span></button>
        </div>
        <div class="post-views">${postIcon('Views.svg')}<span>${post.views}</span></div>
      </div>
      ${commentsOpen ? `
        <div class="comments-panel">
          <div class="comments-title">Комментарии (${post.comments.length})</div>
          ${post.comments.length ? post.comments.map(c => `
            <div class="comment-card">
              <img src="${c.avatar}" alt="" onerror="this.src='${AVATAR}'">
              <div style="min-width:0;flex:1">
                <div style="display:flex;justify-content:space-between"><span class="comment-author">${esc(c.author)}</span><span class="comment-time">${esc(c.time)}</span></div>
                <div class="comment-text">${esc(c.text)}</div>
              </div>
            </div>`).join('') : '<p style="text-align:center;font-size:12px;color:var(--bg-text-placeholder);padding:8px 0;font-style:italic">Пока нет комментариев.</p>'}
          <form class="comment-form" data-action="comment" data-id="${post.id}">
            <input class="comment-input" name="comment" placeholder="Написать комментарий..." required>
            <button class="comment-send" type="submit">${icon('send')}</button>
          </form>
        </div>` : ''}
      <div class="sep-8-secondary"></div>
    </article>`;
}

function renderNews() {
  return `
    ${renderProfileHeader()}
    ${renderProfileInfo()}
    ${renderWidgets()}
    ${renderCreatePostBar()}
    ${state.posts.map(renderPost).join('')}
    <div class="feed-end">— Вы посмотрели все записи —</div>`;
}

function renderMenu() {
  const shortName = USER.name.split(' ').slice(0, 2).join(' ');
  const items = [
    ['users', 'Группы'], ['person', 'Сотрудники'], ['calendar', 'Календарь'],
    ['image', 'Фото'], ['video', 'Видео'], ['file', 'Файлы'], ['bookmark', 'Закладки'],
  ];
  const items2 = [
    ['coin', 'SB-коин'], ['briefcase', 'Структура компании'], ['company', 'О компании'],
  ];
  const items3 = [['help', 'Обратная связь'], ['globe', 'Язык приложения']];

  const menuIcons = {
    users: 'Group 2.svg',
    person: 'Person.svg',
    calendar: 'Event - out.svg',
    image: 'photo - out.svg',
    video: 'Video - out.svg',
    file: 'File - out.svg',
    bookmark: 'bookmarks - outline.svg',
    coin: 'coins.svg',
    briefcase: 'Briefcase.svg',
    company: 'company.svg',
    help: 'question.svg',
    globe: 'Language.svg',
  };
  const menuIcon = (key) => {
    const file = menuIcons[key];
    if (!file) return icon(key);
    return `<img class="menu-icon" src="assets/prof/Icons/${encodeURIComponent(file)}" alt="" width="24" height="24">`;
  };

  const row = (key, label) => `<div class="menu-item">${menuIcon(key)}<span>${label}</span></div>`;

  return `
    <div class="menu-profile">
      <div class="menu-profile-avatar"><img src="${USER.avatar}" alt=""></div>
      <div>
        <div class="menu-profile-name">${esc(shortName)}</div>
        <button class="menu-profile-link" data-action="tab" data-tab="news">Перейти в профиль</button>
      </div>
    </div>
    <div class="sep-12-line"></div>
    ${items.map(([k, l]) => row(k, l)).join('')}
    <div class="sep-8-secondary"></div>
    ${items2.map(([k, l]) => row(k, l)).join('')}
    <div class="sep-8-secondary"></div>
    ${items3.map(([k, l]) => row(k, l)).join('')}`;
}

function renderChats() {
  return `
    <div class="chats-nav">Чаты<button class="nav-btn" style="position:absolute;right:16px;width:24px;height:24px" data-action="tab" data-tab="news">${icon('edit')}</button></div>
    <div class="sep-8"></div>
    ${CHATS.map(c => `
      <div class="chat-item">
        <div class="chat-avatar">
          <img src="${c.avatar}" alt="" onerror="this.src='${AVATAR}'">
          ${c.online ? '<div class="chat-online"></div>' : ''}
        </div>
        <div class="chat-info">
          <div class="chat-name">${esc(c.name)}</div>
          <div class="chat-preview">${c.fromMe ? '<span class="you">Вы: </span>' : ''}${esc(c.message)} • ${esc(c.time)}</div>
        </div>
        <div>${c.badge !== undefined ? `<span class="chat-badge">${c.badge}</span>` : c.unread ? '<div class="chat-unread"></div>' : c.read ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 12.5l3 3 6-7" stroke="var(--primary)" stroke-width="1.8"/><path d="M11 15l1 1 6-7" stroke="var(--primary)" stroke-width="1.8"/></svg>' : ''}</div>
      </div>`).join('')}
    <div class="sep-8"></div>`;
}

function renderServices() {
  const vcusIcon = (file) =>
    `<img class="services-asset-icon" src="assets/VCUS/${encodeURIComponent(file)}" alt="" width="36" height="36">`;
  const searchIcon = (file) =>
    `<img class="services-asset-icon" src="assets/V/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA/${encodeURIComponent(file)}" alt="" width="36" height="36">`;

  return `
    <div class="services-search-title">Поиск</div>
    <div class="services-search-box">${icon('search')}<span>Поиск по «Синтезу»</span></div>
    <div class="services-divider"></div>
    <div class="services-learning-wrap">
      <div class="services-card"><div class="services-card-icon">${searchIcon('Questions.svg')}</div><div class="services-card-title">Обучение по работе в «Синтезе»</div></div>
    </div>
    <div class="services-card green"><div class="services-card-icon services-card-icon-plain">${searchIcon('good.svg')}</div><div class="services-card-title">Преимущества работы в SB</div></div>
    <div class="services-section-title"><span>Сервисы</span><span style="color:var(--bg-text-placeholder);font-weight:600">2</span></div>
    <div class="services-tiles">
      <div class="service-tile"><div class="services-card-icon">${vcusIcon('VKUS.svg')}</div><div class="service-tile-label">Вкус</div></div>
      <div class="service-tile"><div class="services-card-icon services-card-icon-plain">${vcusIcon('Портал командирования.svg')}</div><div class="service-tile-label">Портал командирования</div></div>
    </div>`;
}

function renderNotifications() {
  const notifSvg = (paths) =>
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  const notifIcon = (type) => {
    if (type === 'heart') return notifSvg('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>');
    if (type === 'message') return notifSvg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>');
    if (type === 'check') return notifSvg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>');
    return notifSvg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>');
  };
  return `
    <div class="notif-header"><h2>Уведомления</h2><button class="notif-read-all">Прочитать все</button></div>
    ${NOTIFICATIONS.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}">
        <div class="notif-icon" style="background:${n.bg};color:${n.color}">${notifIcon(n.icon)}</div>
        <div><div class="notif-text">${esc(n.text)}</div><span class="notif-time">${esc(n.time)}</span></div>
        ${n.unread ? '<div class="notif-dot"></div>' : ''}
      </div>`).join('')}`;
}

function renderWidgetModal() {
  const w = state.selectedWidget;
  if (!w) return '';

  let body = '';
  if (w.id === 'photos') {
    const urls = [POST_WORK, POST_SCHOOL, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400'];
    body = `<p style="font-size:12px;color:var(--bg-text-text-secondary);margin-bottom:12px">Фотографии из командировок:</p><div class="photo-grid">${urls.map(u => `<img src="${u}" alt="">`).join('')}</div>`;
  } else if (w.id === 'colleagues' || w.id === 'subscribers') {
    body = COLLEAGUES.map(c => `
      <div class="colleague-row">
        <div class="colleague-info">
          <img src="${c.avatar}" alt="" onerror="this.src='${AVATAR}'">
          <div><div class="colleague-name">${esc(c.name)}</div><div class="colleague-role">${esc(c.role)}</div></div>
        </div>
        <button class="write-btn">Написать</button>
      </div>`).join('');
  } else if (w.id === 'greetings' || w.id === 'thanks') {
    body = `<div style="padding:12px;border-radius:12px;background:var(--bg-green);border:1px solid var(--message-bg-green-selected);font-size:12px;margin-bottom:8px"><strong>${esc(w.fullLabel)}</strong><br>Коллеги выразили признательность за отличную работу.</div>
      <div style="padding:12px;border-radius:12px;border:1px solid var(--line);font-size:12px;margin-bottom:8px"><strong>Ольга Александрова</strong> <span style="color:var(--bg-text-placeholder)">Вчера</span><br><em>⭐ «Спасибо за организацию переговоров!»</em></div>`;
  } else if (w.id === 'files') {
    body = [
      ['PDF', 'Регламент_закупок_2026.pdf', '4.2 MB', '#ea483e'],
      ['DOC', 'Шаблон_заявки_v3.docx', '1.8 MB', 'var(--primary)'],
      ['XLS', 'Отчет_Q1-Q2.xlsx', '8.5 MB', '#99cc00'],
    ].map(([ext, name, size, color]) => `
      <div class="colleague-row">
        <div class="colleague-info">
          <div style="width:36px;height:36px;border-radius:8px;background:${color};color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center">${ext}</div>
          <div><div class="colleague-name">${name}</div><div class="colleague-role">${size}</div></div>
        </div>
      </div>`).join('');
  } else {
    body = `<p style="font-size:12px;color:var(--bg-text-text-secondary)">${esc(w.description)} Всего: <strong style="color:var(--primary)">${esc(w.count)}</strong>.</p>`;
  }

  return `
    <div class="modal-overlay" data-action="close-widget">
      <div class="modal-card" onclick="event.stopPropagation()">
        <div class="modal-card-header">
          <div style="display:flex;align-items:center"><span class="modal-card-title">${esc(w.fullLabel)}</span><span class="modal-count-badge">${esc(w.count)}</span></div>
          <button class="modal-close-btn" data-action="close-widget">${icon('x')}</button>
        </div>
        <div class="modal-card-body">${body}</div>
        <div class="modal-card-footer"><button class="modal-ok-btn" data-action="close-widget">Закрыть</button></div>
      </div>
    </div>`;
}

function renderNewPostModal() {
  if (!state.isNewPostOpen) return '';
  const canPublish = state.newPostText.trim().length > 0;
  const displayName = USER.name.split(' ').slice(0, 3).join(' ');
  return `
    <div class="modal-full">
      <div class="modal-nav">
        <button class="modal-nav-btn left" data-action="close-new-post">${icon('x')}</button>
        <div class="modal-nav-title">${esc(displayName)}</div>
        <button class="modal-nav-btn right ${canPublish ? '' : 'disabled'}" data-action="publish-post" ${canPublish ? '' : 'disabled'}>${icon('check')}</button>
      </div>
      <div class="sep-line" style="margin:0"></div>
      <div class="modal-body" style="position:relative">
        ${!state.newPostText ? `<div class="modal-placeholder"><span class="cursor animate-pulse">|</span> Есть новости? Расскажите!</div>` : ''}
        <textarea class="modal-textarea" id="new-post-text" placeholder="">${esc(state.newPostText)}</textarea>
      </div>
      <div class="modal-bottom-bar">
        <div class="icons">${icon('paperclip')}${icon('message')}${icon('calendar')}</div>
        <div class="deferred-btn">${icon('clock')}<span>СЕЙЧАС</span>${icon('chevron')}</div>
      </div>
    </div>`;
}

function renderQrModal() {
  if (!state.isQrOpen) return '';
  return `
    <div class="modal-full">
      <div class="modal-nav">
        <button class="modal-nav-btn left" data-action="close-qr">${icon('x')}</button>
        <div class="modal-nav-title">QR-код</div>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="qr-box">
          <img class="qr-image" src="assets/Moe_Epsilon_QR_code_vector%201.png" alt="QR-код">
        </div>
        <button class="qr-contacts-btn" data-action="show-contacts">Показать контакты</button>
      </div>
    </div>`;
}

function renderHelpModal() {
  if (!state.isHelpOpen) return '';
  const features = [
    ['smartphone', 'iPhone 16 Pro в центре экрана', 'Контент внутри прокручивается как в реальном телефоне.', 'var(--primary)'],
    ['heart', 'Лайки и комментарии', 'Нажимайте на сердечко и открывайте комментарии.', '#ea483e'],
    ['edit', 'Создание публикаций', 'Нажмите «Есть новости? Расскажите!» чтобы опубликовать запись.', 'var(--primary)'],
    ['layers', 'Виджеты и 5 вкладок', 'Скролльте виджеты, кликайте на них и нижние иконки.', 'var(--primary)'],
  ];
  return `
    <div class="help-overlay" data-action="close-help">
      <div class="help-modal" onclick="event.stopPropagation()">
        <div class="help-header">
          <div style="display:flex;align-items:center">
            <div class="help-icon-wrap">${icon('sparkles')}</div>
            <h3>Возможности превью</h3>
          </div>
          <button class="modal-close-btn" data-action="close-help">${icon('x')}</button>
        </div>
        <div class="help-body">
          <p style="font-size:13px;color:var(--bg-text-text-secondary);margin-bottom:16px">Экран полностью интерактивен и воспроизводит дизайн-систему корпоративной соцсети.</p>
          ${features.map(([ic, title, desc, color]) => `
            <div class="help-feature">
              <div class="help-feature-icon" style="color:${color}">${icon(ic)}</div>
              <div><h4>${title}</h4><p>${desc}</p></div>
            </div>`).join('')}
        </div>
        <div class="help-footer"><button class="modal-ok-btn" data-action="close-help">Понятно!</button></div>
      </div>
    </div>`;
}

function renderScreenContent() {
  switch (state.activeTab) {
    case 'menu': return renderMenu();
    case 'chats': return renderChats();
    case 'services': return renderServices();
    case 'notifications': return renderNotifications();
    default: return renderNews();
  }
}

function renderBottomNav() {
  const tabs = [
    { id: 'news', icon: 'news' },
    { id: 'services', icon: 'grid' },
    { id: 'chats', icon: 'chats', badge: '3' },
    { id: 'notifications', icon: 'bell', badge: '12' },
    { id: 'menu', icon: 'menu' },
  ];
  return tabs.map(t => `
    <button class="bottom-nav-btn ${state.activeTab === t.id ? 'active' : ''}" data-action="tab" data-tab="${t.id}">
      <div style="position:relative">${icon(t.icon)}${t.badge ? `<span class="badge">${t.badge}</span>` : ''}</div>
    </button>`).join('');
}

function render() {
  document.getElementById('screen-content').innerHTML = renderScreenContent() + renderNewPostModal() + renderQrModal() + renderWidgetModal();
  document.getElementById('bottom-nav').innerHTML = renderBottomNav();
  document.getElementById('help-modal-root').innerHTML = renderHelpModal();

  const navBar = document.querySelector('.nav-bar');
  if (navBar) {
    navBar.hidden = state.activeTab !== 'news';
  }

  const textarea = document.getElementById('new-post-text');
  if (textarea) {
    textarea.focus();
    textarea.addEventListener('input', (e) => {
      state.newPostText = e.target.value;
      render();
      const ta = document.getElementById('new-post-text');
      if (ta) { ta.focus(); ta.selectionStart = ta.selectionEnd = ta.value.length; }
    });
  }
}

function handleClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'tab') { state.activeTab = el.dataset.tab; render(); return; }
  if (action === 'toggle-trip') { state.showTripTip = !state.showTripTip; render(); return; }
  if (action === 'new-post') { state.isNewPostOpen = true; render(); return; }
  if (action === 'close-new-post') { state.isNewPostOpen = false; state.newPostText = ''; render(); return; }
  if (action === 'close-qr') { state.isQrOpen = false; render(); return; }
  if (action === 'close-help') { state.isHelpOpen = false; render(); return; }
  if (action === 'close-widget') { state.selectedWidget = null; render(); return; }
  if (action === 'show-contacts') { alert('Контакты показаны'); return; }

  if (action === 'widget') {
    return;
  }

  if (action === 'like') {
    const post = state.posts.find(p => p.id === el.dataset.id);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
      post.likes = formatLikes(post.likesCount);
      render();
    }
    return;
  }

  if (action === 'comments') {
    const id = el.dataset.id;
    state.openComments[id] = !state.openComments[id];
    render();
    return;
  }

  if (action === 'expand') {
    const id = el.dataset.id;
    state.expandedPosts[id] = !state.expandedPosts[id];
    render();
    return;
  }

  if (action === 'publish-post' && state.newPostText.trim()) {
    state.posts.unshift({
      id: 'post-' + Date.now(),
      author: 'Константин Константинов...',
      time: 'Только что',
      text: state.newPostText.trim(),
      views: 1,
      likes: '0',
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      repostsCount: 0,
      comments: [],
    });
    state.newPostText = '';
    state.isNewPostOpen = false;
    state.activeTab = 'news';
    render();
    return;
  }
}

function handleSubmit(e) {
  const form = e.target.closest('[data-action="comment"]');
  if (!form) return;
  e.preventDefault();
  const input = form.querySelector('input');
  const text = input.value.trim();
  if (!text) return;
  const post = state.posts.find(p => p.id === form.dataset.id);
  if (post) {
    post.comments.unshift({
      id: 'c-' + Date.now(),
      author: 'Вы (Константин К.)',
      avatar: USER.avatar,
      text,
      time: 'Только что',
    });
    post.commentsCount = (post.commentsCount || post.comments.length);
    state.openComments[post.id] = true;
    render();
  }
}

document.getElementById('btn-qr').addEventListener('click', () => {
  state.isQrOpen = true;
  render();
});

document.getElementById('screen-content').addEventListener('click', handleClick);
document.getElementById('screen-content').addEventListener('submit', handleSubmit);
document.getElementById('bottom-nav').addEventListener('click', handleClick);
document.getElementById('help-modal-root').addEventListener('click', handleClick);

render();
setInterval(() => {
  if (state.activeTab === 'news') {
    const info = document.querySelector('.info-row span');
    if (info && info.textContent.includes(USER.city)) {
      info.textContent = `${USER.city} (${getMoscowTime()})`;
    }
  }
}, 30000);
