// Bust browser image cache on every full page load
const ASSET_T = Date.now();
const img = (name) => `images/projects/${name}?t=${ASSET_T}`;

export const projects = [
  {
    id: 'design-system',
    title: 'SB design systems',
    subtitle: 'Корпоративная дизайн-система',
    image: img('design-system.png'),
    cover: img('design-system.png'),
    year: '2025',
    role: 'Продуктовый дизайнер, Разработчик',
    tools: ['Figma', 'React', 'Design Tokens'],
    description: [
      'Корпоративная дизайн-система SB design systems объединяет токены, компоненты и шаблоны страниц в единую визуальную основу для цифровых продуктов холдинга. Моя идея — вынести систему из Figma в живую виртуальную среду, где с компонентами можно по-настоящему взаимодействовать.',
      'Разработчики и вайбкодеры могут брать отсюда промпт-описания элементов или готовый код и сразу собирать интерфейсы. Система стала общим языком дизайнеров и разработчиков и упростила масштабирование UI без потери качества.',
    ],
    highlights: ['Живая среда вместо статичных макетов', 'Промпты и код для сборки UI', 'Токены, компоненты и шаблоны'],
    gallery: [img('design-system.png')],
  },
  {
    id: 'sintez',
    title: 'Мобильная корпоративная соцсеть «Синтез»',
    subtitle: 'Корпоративная социальная сеть',
    image: img('sintez.png'),
    cover: img('sintez.png'),
    year: '2025',
    role: 'Ведущий дизайнер',
    tools: ['Figma', 'Mobile UI'],
    description: [
      '«Синтез» — мобильная корпоративная соцсеть SB для повседневной коммуникации сотрудников: лента новостей, профиль, чаты, уведомления и доступ к внутренним сервисам. Продукт помогает держать людей в курсе событий компании и быстрее находить нужные контакты.',
      'В роли ведущего дизайнера руководил командой дизайнеров и вёл коммуникацию с разработкой и аналитиками — от постановки задач до согласования решений и передачи в реализацию. Интерфейс выстроен вокруг привычных мобильных паттернов и фирменного стиля бренда: виджеты на главном экране дают быстрый вход в ключевые сценарии, а структура приложения снижает порог входа для пользователей с разным уровнем цифровой зрелости.',
    ],
    highlights: ['Лента, профиль и виджеты сотрудника', 'Чаты, уведомления и сервисы', 'Мобильный UI в фирменном стиле SB'],
    gallery: [img('sintez.png')],
    demo: 'projects/social/index.html',
  },
  {
    id: 'ai-org-analytics',
    title: 'AI Аналитика Орг Структуры',
    subtitle: 'SAP ERP HCM — платформа',
    image: img('ai-org-analytics.png'),
    cover: img('ai-org-analytics.png'),
    year: '2025',
    role: 'Продуктовый дизайнер, Разработчик',
    tools: ['Figma', 'React', 'Data Viz'],
    description: [
      'С этим проектом мы выиграли внутренний хакатон компании. Платформа аналитики организационной структуры на базе SAP ERP HCM: оргкарта, KPI подразделений и карточки сотрудников с ключевыми метриками. Цель — дать HR и руководителям прозрачную картину эффективности и структуру компании.',
      'Отдельный акцент — AI-ассистент, который помогает находить нужного сотрудника или отдел, интерпретировать данные, сравнивать подразделения и формулировать выводы. Интерфейс сочетает визуализацию структуры с детальной аналитикой на уровне человека и команды.',
    ],
    highlights: ['Оргструктура и аналитика эффективности', 'Карточки сотрудников с KPI', 'AI-ассистент для HR-аналитики'],
    gallery: [img('ai-org-analytics.png')],
  },
  {
    id: 'focus',
    title: 'Платформа поручений',
    subtitle: 'Доска поручений SB',
    image: img('focus.png'),
    cover: img('focus.png'),
    year: '2025',
    role: 'Продуктовый дизайнер, Разработчик',
    tools: ['Figma', 'React'],
    description: [
      'Платформа поручений — корпоративная доска для управления задачами по предприятиям холдинга. Основная моя идея — сделать работу с поручениями в виде канбана: статусы видны сразу, задачи легко двигать по колонкам, а руководители держат картину инициатив в одном месте.',
      'Дополнительно — дорожная карта, фильтры и группировка. Особое внимание уделено контролю сроков: сводки по статусам, просрочкам и загрузке помогают вовремя реагировать на риски. Интерфейс рассчитан на большой объём поручений и быстрый переход от обзора к деталям.',
    ],
    highlights: ['Канбан как основная идея', 'Дорожная карта, фильтры и группировка', 'Сводка по статусам и просрочкам'],
    gallery: [img('focus.png')],
    demo: 'projects/porucheniya/index.html',
  },
  {
    id: 'service-reports',
    title: 'Отчеты сервисных показателей',
    subtitle: 'Редактор презентаций и отчётов',
    image: img('service-reports.png'),
    cover: img('service-reports.png'),
    year: '2025',
    role: 'Продуктовый дизайнер, Разработчик',
    tools: ['Figma', 'React'],
    description: [
      'Ко мне пришли с задачей улучшить визуальное представление данных в PDF-презентации. Проанализировав процесс, я предложил другой подход — автоматизированный сервис, который сам собирает данные и показывает их. Платформа для сборки отчётов по сервисным показателям: Incident, Request, УС (уровень сервиса) и другие блоки собираются в модульную презентацию. Пользователь может настраивать слайды, просматривать графики и сводные таблицы в едином рабочем пространстве.',
      'Редактор упрощает подготовку регулярной отчётности и снижает ручную работу с данными. Готовый материал экспортируется в PDF, сохраняя структуру и визуальную иерархию для презентаций руководству.',
    ],
    highlights: ['Модульная структура отчётов', 'Графики и сводные таблицы', 'Редактор презентаций'],
    gallery: [img('service-reports.png')],
  },
  {
    id: 'ai-calendar',
    title: 'Корпоративный AI календарь',
    subtitle: 'Планировщик и корпоративные события',
    image: img('ai-calendar.png'),
    cover: img('ai-calendar.png'),
    year: '2026',
    role: 'Продуктовый дизайнер, Разработчик',
    tools: [],
    description: [
      'После перехода на Windows 11 по требованиям безопасности привычный календарь на рабочем столе отключили — и весь холдинг остался без него. Моя идея была сделать собственный корпоративный календарь и вернуть людям привычные удобные функции: годовой и месячный обзор, события компании и встроенный планировщик.',
      'В итоге получился продукт, благодаря которому компании не пришлось покупать коробочное решение, — это сэкономило примерно 90 млн рублей, и за это меня премировали. Визуальный язык опирается на фирменный стиль SB, включая брендового персонажа. Интерфейс сочетает обзорный и детальный режимы — от картины года к конкретным встречам и задачам.',
    ],
    highlights: ['Годовой и месячный вид', 'Планировщик и корпоративные события', 'Фирменный UI SB'],
    gallery: [img('ai-calendar.png')],
  },
  {
    id: 'procurement-management-portal-design',
    title: 'Портал «Управление закупками»',
    subtitle: 'SB',
    image: img('procurement-management-portal-design.png'),
    cover: img('procurement-management-portal-design.png'),
    year: '2025',
    role: 'Продуктовый дизайнер, Разработчик',
    tools: ['Figma', 'React', 'ECharts'],
    description: [
      'Я спроектировал и собрал рабочее место дирекции по закупкам холдинга: вместо разрозненных отчётов — единый портал, где видно spend квартала, покрытие контрактами и поставщиков вне условий. Сильная сторона решения — treemap расходов и каскадные фильтры: от картины квартала можно провалиться в категорию, поставщика и заказ, не теряя контекст.',
      'Отдельно я заложил сценарий «решения до совещания»: бенчмарки цен показывают, где переплачиваем, а назначения действий сразу считают, как меры поднимут покрытие контрактами. Аудит фиксирует отклонения и согласования в неизменяемом протоколе — так портал не только показывает проблему, но и доводит её до исполнения.',
    ],
    highlights: ['Treemap и каскадные фильтры', 'Действия до совещания с прогнозом эффекта', 'Бенчмарки цен и аудит отклонений'],
    gallery: [img('procurement-management-portal-design.png')],
    demo: 'projects/procurement-management-portal-design/demo.html',
  },
  {
    id: 'flotatsiya',
    title: 'Карта процесса Флотации',
    subtitle: 'Интерактивная схема обогатительного процесса',
    image: img('flotatsiya.png'),
    cover: img('flotatsiya.png'),
    year: '2026',
    role: 'Продуктовый дизайнер, Разработчик',
    tools: ['Figma', 'React', 'Leaflet'],
    description: [
      'Ко мне обратились с задачей визуализировать процесс флотации. Была разработана интерактивная карта, которую представили на форуме «Майнекс Россия 2025 — Горный форум»; сейчас она используется для обучения сотрудников. Карта показывает полный маршрут руды: от поступления сырья до медного концентрата. На схеме связаны дробление, измельчение, грохочение, классификация, основная и контрольная флотация, сгущение, фильтрование и сушка.',
      'Пользователь может масштабировать схему, искать оборудование и открывать узлы для деталей. Визуализация помогает быстрее понимать технологическую цепочку и находить нужный участок процесса.',
    ],
    highlights: ['Интерактивная технологическая схема', 'Поиск оборудования по карте', 'Узлы от руды до концентрата'],
    gallery: [img('flotatsiya.png')],
    demo: 'projects/flotatsiya/index.html',
  },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function projectSummary(p) {
  const text = Array.isArray(p.description) ? p.description[0] : p.description;
  return text || p.subtitle;
}

let worksCarousel = null;

function destroyWorksCarousel() {
  if (!worksCarousel) return;
  if (worksCarousel.raf) cancelAnimationFrame(worksCarousel.raf);
  worksCarousel.cleanups.forEach((fn) => fn());
  worksCarousel = null;
}

function renderWorksList() {
  const root = document.getElementById('works-carousel');
  const track = document.getElementById('works-list');
  const viewport = document.getElementById('works-viewport');
  const dotsEl = document.getElementById('works-dots');
  const counterEl = document.getElementById('works-counter');
  const prevBtn = document.getElementById('works-prev');
  const nextBtn = document.getElementById('works-next');
  const hintEl = document.getElementById('works-hint');
  if (!root || !track || !viewport) return;

  destroyWorksCarousel();

  const n = projects.length;
  const mq = window.matchMedia('(max-width: 720px)');
  const isMobile = () => mq.matches;

  track.innerHTML = projects.map((p) => (
    '<article class="ryn-work-shell pf-work-shell">' +
      '<div class="pf-work-slide">' +
        '<button type="button" class="pf-work-card" data-project-id="' + escapeHtml(p.id) + '">' +
          '<img class="pf-work-img ryn-work-img" src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.title) + '" loading="lazy" draggable="false" />' +
        '</button>' +
        '<div class="pf-work-body">' +
          '<h3>' + escapeHtml(p.title) + '</h3>' +
          '<p>' + escapeHtml(projectSummary(p)) + '</p>' +
          '<button type="button" class="pf-btn-orange ryn-btn-case" data-project-id="' + escapeHtml(p.id) + '">Смотреть кейс ↗</button>' +
        '</div>' +
      '</div>' +
    '</article>'
  )).join('');

  if (dotsEl) {
    dotsEl.innerHTML = projects.map((_, i) =>
      '<button type="button" class="ryn-works-dot pf-works-dot" role="tab" aria-label="Слайд ' + (i + 1) + '" data-index="' + i + '"></button>'
    ).join('');
  }

  const cards = Array.from(track.querySelectorAll('.pf-work-shell'));
  const cleanups = [];
  let frontIndex = 0;
  let mode = '';

  function syncUI() {
    if (dotsEl) {
      dotsEl.querySelectorAll('.ryn-works-dot, .pf-works-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === frontIndex);
        dot.setAttribute('aria-selected', i === frontIndex ? 'true' : 'false');
      });
    }
    if (counterEl) {
      counterEl.textContent = String(frontIndex + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    }
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
    if (hintEl) {
      hintEl.textContent = mode === 'mobile'
        ? 'Свайпните влево · все проекты'
        : 'Тяните по кругу · все проекты видны';
    }
  }

  function openProjectFrom(el, e) {
    e.preventDefault();
    e.stopPropagation();
    const id = el.getAttribute('data-project-id');
    if (id) showProject(id);
  }

  track.querySelectorAll('[data-project-id]').forEach((btn) => {
    const onClick = (e) => openProjectFrom(btn, e);
    const onPointerDownBtn = (e) => {
      e.stopPropagation();
    };
    btn.addEventListener('click', onClick);
    btn.addEventListener('pointerdown', onPointerDownBtn);
    cleanups.push(
      () => btn.removeEventListener('click', onClick),
      () => btn.removeEventListener('pointerdown', onPointerDownBtn),
    );
  });

  function startMobile() {
    mode = 'mobile';
    root.classList.add('is-mobile-works');
    cards.forEach((card) => {
      card.style.transform = '';
      card.style.opacity = '';
      card.style.zIndex = '';
      card.classList.add('is-front');
    });

    function nearestIndex() {
      const mid = viewport.scrollLeft + viewport.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    function goTo(targetIndex) {
      const card = cards[targetIndex];
      if (!card) return;
      const left = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
      viewport.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      frontIndex = targetIndex;
      syncUI();
    }

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const next = nearestIndex();
        if (next !== frontIndex) {
          frontIndex = next;
          syncUI();
        }
      });
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => viewport.removeEventListener('scroll', onScroll));

    if (dotsEl) {
      dotsEl.querySelectorAll('.ryn-works-dot, .pf-works-dot').forEach((dot) => {
        const onClick = () => goTo(Number(dot.getAttribute('data-index')));
        dot.addEventListener('click', onClick);
        cleanups.push(() => dot.removeEventListener('click', onClick));
      });
    }
    if (prevBtn) {
      const onPrev = () => goTo((frontIndex - 1 + n) % n);
      prevBtn.addEventListener('click', onPrev);
      cleanups.push(() => prevBtn.removeEventListener('click', onPrev));
    }
    if (nextBtn) {
      const onNext = () => goTo((frontIndex + 1) % n);
      nextBtn.addEventListener('click', onNext);
      cleanups.push(() => nextBtn.removeEventListener('click', onNext));
    }

    frontIndex = 0;
    syncUI();
    requestAnimationFrame(() => goTo(0));
  }

  function startDesktop() {
    mode = 'desktop';
    root.classList.remove('is-mobile-works');
    cards.forEach((card) => card.classList.remove('is-front'));

    let angle = 0;
    let velocity = 0.012;
    const autoSpeed = 0.012;
    let dragging = false;
    let lastX = 0;
    let moved = 0;
    let radius = 360;
    let running = true;
    let hoverPaused = false;
    let captureId = null;

    function measure() {
      const vw = viewport.clientWidth || window.innerWidth;
      const w = Math.min(340, vw * 0.62);
      radius = Math.max(300, Math.min(460, Math.round(w * 1.12 + n * 6)));
    }

    function layoutRing() {
      const step = (Math.PI * 2) / n;
      let best = 0;
      let bestDepth = -Infinity;
      cards.forEach((card, i) => {
        const a = (angle * Math.PI) / 180 + i * step;
        const x = Math.sin(a) * radius;
        const z = Math.cos(a) * radius;
        const depth = Math.cos(a);
        const scale = 0.62 + Math.max(0, depth) * 0.38;
        card.style.transform =
          'translate(-50%, -50%) translate3d(' + x.toFixed(2) + 'px, 0, ' + z.toFixed(2) + 'px) rotateY(' +
          (-(a * 180) / Math.PI).toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
        card.style.opacity = String(0.45 + Math.max(0, depth) * 0.55);
        card.style.zIndex = String(Math.round(40 + depth * 80));
        card.classList.toggle('is-front', depth > 0.82);
        if (depth > bestDepth) {
          bestDepth = depth;
          best = i;
        }
      });
      if (best !== frontIndex) {
        frontIndex = best;
        syncUI();
      }
    }

    function goTo(targetIndex) {
      const step = 360 / n;
      const current = ((-angle % 360) + 360) % 360;
      const desired = ((-targetIndex * step) % 360 + 360) % 360;
      let delta = desired - current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      angle -= delta;
      velocity = 0;
      layoutRing();
      syncUI();
    }

    function tick() {
      if (!running) return;
      if (!dragging && !hoverPaused) {
        angle += velocity;
        velocity += (autoSpeed - velocity) * 0.04;
      }
      angle = ((angle % 360) + 360) % 360;
      layoutRing();
      worksCarousel.raf = requestAnimationFrame(tick);
    }

    const onTrackOver = (e) => {
      const onFront = !!e.target.closest('.pf-work-shell.is-front');
      hoverPaused = onFront;
      if (onFront) velocity = 0;
    };
    const onTrackLeave = () => { hoverPaused = false; };
    track.addEventListener('pointerover', onTrackOver);
    track.addEventListener('pointerleave', onTrackLeave);
    cleanups.push(
      () => track.removeEventListener('pointerover', onTrackOver),
      () => track.removeEventListener('pointerleave', onTrackLeave),
    );

    if (dotsEl) {
      dotsEl.querySelectorAll('.ryn-works-dot, .pf-works-dot').forEach((dot) => {
        const onClick = () => goTo(Number(dot.getAttribute('data-index')));
        dot.addEventListener('click', onClick);
        cleanups.push(() => dot.removeEventListener('click', onClick));
      });
    }
    if (prevBtn) {
      const onPrev = () => goTo((frontIndex - 1 + n) % n);
      prevBtn.addEventListener('click', onPrev);
      cleanups.push(() => prevBtn.removeEventListener('click', onPrev));
    }
    if (nextBtn) {
      const onNext = () => goTo((frontIndex + 1) % n);
      nextBtn.addEventListener('click', onNext);
      cleanups.push(() => nextBtn.removeEventListener('click', onNext));
    }

    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('[data-project-id]')) return;
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      velocity = 0;
      root.classList.add('is-dragging');
    }
    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6 && captureId == null && viewport.setPointerCapture) {
        captureId = e.pointerId;
        try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (moved <= 6) return;
      angle -= dx * 0.28;
      velocity = -dx * 0.02;
      layoutRing();
    }
    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      if (captureId != null && viewport.releasePointerCapture) {
        try { viewport.releasePointerCapture(captureId); } catch (_) {}
      }
      captureId = null;
      moved = 0;
    }

    viewport.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    cleanups.push(
      () => viewport.removeEventListener('pointerdown', onPointerDown),
      () => window.removeEventListener('pointermove', onPointerMove),
      () => window.removeEventListener('pointerup', onPointerUp),
      () => window.removeEventListener('pointercancel', onPointerUp),
    );

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) + Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const d = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      angle += d * 0.05;
      velocity = d * 0.002;
      layoutRing();
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    cleanups.push(() => viewport.removeEventListener('wheel', onWheel));
    cleanups.push(() => { running = false; });

    measure();
    layoutRing();
    syncUI();
    worksCarousel.raf = requestAnimationFrame(tick);
  }

  const onModeChange = () => {
    renderWorksList();
  };
  if (mq.addEventListener) mq.addEventListener('change', onModeChange);
  else mq.addListener(onModeChange);
  cleanups.push(() => {
    if (mq.removeEventListener) mq.removeEventListener('change', onModeChange);
    else mq.removeListener(onModeChange);
  });

  worksCarousel = { cleanups, raf: 0 };
  if (isMobile()) startMobile();
  else startDesktop();
}

function getProjectDemoPath(p) {
  const path = p.demo || `projects/${p.id}/index.html`;
  return path + (path.includes('?') ? '&' : '?') + 'v=20260923-ryn';
}

function showHome() {
  document.getElementById('home').classList.remove('hidden');
  document.getElementById('detail').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  requestAnimationFrame(() => renderWorksList());
}

window.showHome = showHome;

function renderTools(tools) {
  return tools.map(t => '<span class="tag">' + escapeHtml(t) + '</span>').join('');
}

const FS_EXPAND = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
const FS_EXIT = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';

function bindFullscreen(btn, wrap) {
  const sync = () => {
    const active = document.fullscreenElement === wrap;
    btn.innerHTML = active ? FS_EXIT : FS_EXPAND;
    btn.setAttribute('aria-label', active ? 'Выйти из полноэкранного режима' : 'Развернуть на весь экран');
  };
  btn.addEventListener('click', () => {
    if (document.fullscreenElement === wrap) document.exitFullscreen();
    else wrap.requestFullscreen();
  });
  document.addEventListener('fullscreenchange', sync);
  sync();
}

window.showProject = function(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  destroyWorksCarousel();
  document.getElementById('home').classList.add('hidden');
  document.getElementById('detail').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });

  document.getElementById('detail-meta').textContent = p.year + ' · ' + p.role;
  document.getElementById('detail-body').innerHTML =
    '<div class="detail-hero"><h1>' + escapeHtml(p.title) + '</h1></div>' +
    '<div class="info-grid">' +
      '<div><div class="info-label">Год</div><div class="info-val">' + escapeHtml(p.year) + '</div></div>' +
      '<div><div class="info-label">Роль</div><div class="info-val">' + escapeHtml(p.role) + '</div></div>' +
      (p.tools && p.tools.length
        ? '<div><div class="info-label">Инструменты</div><div class="tags">' + renderTools(p.tools) + '</div></div>'
        : '') +
    '</div>' +
    '<div class="desc-block"><div class="section-label">О проекте</div>' +
      (Array.isArray(p.description) ? p.description : [p.description])
        .map((para) => '<p class="desc-text">' + escapeHtml(para) + '</p>')
        .join('') +
    '</div>';

  const preview = document.getElementById('detail-preview');
  const demoPath = getProjectDemoPath(p);

  preview.innerHTML = '<div class="project-preview-placeholder">Загрузка демо…</div>';
  fetch(demoPath, { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) throw new Error('missing');
      preview.innerHTML =
        '<div class="project-preview-inner" id="preview-fs-wrap">' +
          '<button type="button" class="project-fullscreen-btn" id="preview-fs-btn" aria-label="Развернуть на весь экран">' + FS_EXPAND + '</button>' +
          '<iframe src="' + demoPath + '" title="' + escapeHtml(p.title) + ' demo" loading="lazy"></iframe>' +
        '</div>';
      bindFullscreen(document.getElementById('preview-fs-btn'), document.getElementById('preview-fs-wrap'));
    })
    .catch(() => {
      preview.innerHTML =
        '<div class="project-preview-placeholder"><p>Демо для <strong>' + escapeHtml(p.title) + '</strong> ещё не подключено.</p>' +
        '<code>npm run build → скопируйте dist/ в projects/' + escapeHtml(p.id) + '/</code></div>';
    });
};

document.addEventListener('DOMContentLoaded', () => {
  renderWorksList();
});
