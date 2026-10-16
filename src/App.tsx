import { useCallback, useState } from 'react';
import ProjectPage from './pages/ProjectPage';
import { projects } from './data/projects';

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const openProject = useCallback((id: string) => setActiveId(id), []);
  const activeProject = activeId ? projects.find((p) => p.id === activeId) : null;

  if (activeProject) {
    return <ProjectPage project={activeProject} onBack={() => setActiveId(null)} />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div className="fit-bg fixed inset-0 -z-10" />
      <div className="fit-blob fit-blob--a" aria-hidden />
      <div className="fit-blob fit-blob--b" aria-hidden />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <a href="/" className="flex items-center gap-3 text-white no-underline">
          <span className="grid size-11 place-items-center rounded-[14px] bg-[#d5ff5f] text-[#010101]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 8h4v2H8v4h2v2H6V8Zm8 0h4v8h-2v-2h-2V8Zm2 2h-2v2h2v-2Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight md:text-xl">Артём Крецкий</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/85 md:flex">
          <a href="#works" className="transition-colors hover:text-white">
            Работы
          </a>
          <a href="#contact" className="transition-colors hover:text-white">
            Контакт
          </a>
        </nav>
        <a href="#contact" className="fit-btn-ghost text-[14px]">
          Связаться
        </a>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-end gap-10 px-6 pb-16 pt-4 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24 lg:pt-8">
        <div className="fit-rise max-w-xl pb-2">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
            Product · UI/UX · Creative Dev
          </p>
          <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[0.98] tracking-tight text-white">
            Крецкий
            <br />
            Артём
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-white/85 md:text-[1.05rem]">
            Продуктовый дизайнер: дизайн-система SB design systems, корпоративные сервисы
            сотрудников — мобильная корпоративная соцсеть «Синтез», Платформа поручений, AI-календарь, — а также портал закупок, HR-аналитика SAP HCM,
            сервисная отчётность и интерактивные производственные схемы.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#works" className="fit-btn">
              <svg width="20" height="22" viewBox="0 0 20 24" fill="none" aria-hidden>
                <path
                  d="M10 2c1.2 2.4 2 4.2 2 6.2 0 1.7-.7 3.2-1.8 4.3C11.4 13.7 12 15.2 12 17c0 2.8-1.4 4.6-2 5-.6-.4-2-2.2-2-5 0-1.8.6-3.3 1.8-4.5C8.7 11.4 8 9.9 8 8.2 8 6.2 8.8 4.4 10 2Z"
                  fill="#010101"
                />
              </svg>
              LETS GO
            </a>
            <a href="#contact" className="fit-btn-ghost gap-2">
              CV
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="fit-rise-2 relative mx-auto w-full max-w-[28rem] lg:mx-0 lg:justify-self-end">
          <div className="relative overflow-hidden rounded-[40px] shadow-[0_28px_70px_rgba(20,35,50,0.35)]">
            <div className="aspect-[4/5] w-full">
              <img
                src="/images/profile.jpg"
                alt="Крецкий Артём"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-6 pb-6">
              <div>
                <p className="text-[28px] font-medium leading-none text-white md:text-[32px]">Day 7</p>
                <p className="mt-2 text-sm font-medium text-[#e2e2e2]">Открыт к новым проектам</p>
              </div>
              <a href="#works" className="fit-btn-ghost h-10 min-h-0 px-5 text-[15px]">
                GO
              </a>
            </div>
          </div>
        </div>
      </section>



      <section id="works" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Training log</p>
            <h2 className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none text-white">
              Избранные работы
            </h2>
          </div>
          <p className="max-w-xs text-sm font-medium text-white/75">
            SaaS, корпоративные продукты и живые демо — кликните карточку, чтобы открыть кейс.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => openProject(p.id)}
              className="fit-card group overflow-hidden text-left"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-[#d6dfe2]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-80" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#010101]">
                  {p.year}
                </span>
              </div>
              <div className="px-6 pb-6 pt-5">
                <h3 className="text-[28px] font-medium leading-tight text-[#010101]">{p.title}</h3>
                <p className="mt-2 text-sm font-semibold text-[#595959]">{p.subtitle}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#9f9f9f]">
                    {p.role}
                  </span>
                  <span className="inline-flex h-10 items-center rounded-full bg-[#d5ff5f] px-4 text-sm font-medium text-[#010101] transition-transform group-hover:scale-105">
                    GO
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-20">
        <div className="overflow-hidden rounded-[40px] bg-white text-[#010101] shadow-[0_28px_70px_rgba(20,35,50,0.22)]">
          <div className="grid md:grid-cols-[1.2fr_0.8fr]">
            <div className="px-8 py-10 md:px-12 md:py-14">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#595959]">Cool Down</p>
              <h3 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05]">
                Есть идея?
                <br />
                Давайте её оживим.
              </h3>
              <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-[#9f9f9f]">
                Отвечаю в течение 24 часов. Работаю с брендами, стартапами и агентствами.
              </p>
              <a href="mailto:hello@alex.design" className="fit-btn mt-8 max-w-xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 3.5c.4 1.6.8 3.4.4 4.6-.3.9-1 1.5-1.7 2.1.9.8 2.1 2 2.1 3.8 0 2.2-1.1 3.7-1.6 4.1-.5-.4-1.6-1.9-1.6-4.1 0-1.8 1.1-3 2-3.8-.7-.6-1.3-1.2-1.6-2.1-.4-1.2 0-3 .4-4.6Z"
                    fill="#010101"
                  />
                  <circle cx="12" cy="6" r="1.2" fill="#010101" opacity=".35" />
                </svg>
                Relax!
              </a>
            </div>
            <div className="flex flex-col justify-center gap-3 border-t border-[#e8eef1] bg-[#d6dfe2]/55 px-8 py-8 md:border-l md:border-t-0 md:px-10 md:py-12">
              <a
                href="mailto:hello@alex.design"
                className="rounded-[20px] bg-white px-5 py-4 transition-transform hover:-translate-y-0.5"
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#595959]">Email</div>
                <div className="mt-1 text-lg font-medium">hello@alex.design</div>
              </a>
              <a
                href="#"
                className="rounded-[20px] bg-white px-5 py-4 transition-transform hover:-translate-y-0.5"
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#595959]">Telegram</div>
                <div className="mt-1 text-lg font-medium">@alex_design</div>
              </a>
              <div className="flex flex-wrap gap-4 px-1 pt-2 text-sm font-semibold text-[#595959]">
                <a
                  href="https://www.figma.com/design/GtwEWYySQdH6Lkf4vtcZiQ/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE-%D0%90%D0%9A?node-id=0-1&t=sPY125p3ItN31LXS-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#010101]"
                >
                  Figma
                </a>
                <a href="#" className="hover:text-[#010101]">
                  Behance
                </a>
                <a href="#" className="hover:text-[#010101]">
                  GitHub
                </a>
                <a href="#" className="hover:text-[#010101]">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-white/70">
          <div>© 2026 Крецкий Артём</div>
          <a
            href="https://www.figma.com/design/GtwEWYySQdH6Lkf4vtcZiQ/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE-%D0%90%D0%9A?node-id=0-1&t=sPY125p3ItN31LXS-1"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Портфолио в Figma
          </a>
        </div>
      </section>
    </div>
  );
}
