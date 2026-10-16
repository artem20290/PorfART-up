import { useEffect, useRef, useState } from 'react';
import type { Project } from '../data/projects';
import { getProjectDemoPath } from '../utils/projectDemo';

interface Props {
  project: Project;
  onBack: () => void;
}

export default function ProjectPage({ project, onBack }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [project.id]);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-zinc-600/25 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-zinc-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-zinc-700/20 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              ←
            </span>
            <span>Все работы</span>
          </button>
          <div className="text-xs uppercase tracking-[0.3em] text-white/50 hidden md:block">
            {project.year} · {project.role}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-light leading-[0.95] bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          {project.title}
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-12 pt-2 grid md:grid-cols-3 gap-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Год</div>
          <div className="text-2xl font-light">{project.year}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Роль</div>
          <div className="text-2xl font-light">{project.role}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Инструменты</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {project.tools.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-sm backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-12">
        <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-400/80 mb-3">О проекте</div>
        <div className="space-y-4">
          {project.description.map((paragraph, i) => (
            <p
              key={i}
              className="text-base md:text-lg font-light leading-relaxed text-white/85"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <ProjectDemo project={project} />
    </div>
  );
}

function ProjectDemo({ project }: { project: Project }) {
  const demoPath = getProjectDemoPath(project);
  // cache-bust so iframe always picks up demo updates (e.g. AI assistant)
  const demoSrc = `${demoPath}?v=20260923-footer-full`;
  const [ready, setReady] = useState<'loading' | 'ok' | 'missing'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setReady('loading');
    const controller = new AbortController();
    fetch(demoPath, { method: 'GET', cache: 'no-store', signal: controller.signal })
      .then((res) => setReady(res.ok ? 'ok' : 'missing'))
      .catch((err) => {
        if (err?.name !== 'AbortError') setReady('missing');
      });
    return () => controller.abort();
  }, [demoPath]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (document.fullscreenElement === containerRef.current) {
        document.exitFullscreen();
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement === containerRef.current) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  if (ready === 'loading') {
    return (
      <section className="w-full min-h-screen bg-[#0c0c0e] flex items-center justify-center text-white/50">
        Загрузка демо…
      </section>
    );
  }

  if (ready === 'missing') {
    return (
      <section className="w-full min-h-screen bg-[#0c0c0e] flex items-center justify-center p-12 text-center text-white/55">
        <div>
          <p>Демо для <strong className="text-white/80">{project.title}</strong> ещё не подключено.</p>
          <code className="block mt-3 px-4 py-3 rounded-lg bg-white/5 text-sm text-white/75">
            npm run build → скопируйте dist/ в projects/{project.id}/
          </code>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen bg-[#0c0c0e]">
      <div
        ref={containerRef}
        className={`relative w-full bg-[#0c0c0e] ${isFullscreen ? 'flex h-full min-h-0 flex-col' : 'min-h-screen'}`}
      >
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Выйти из полноэкранного режима' : 'Развернуть на весь экран'}
          className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#0c0c0e]/80 text-white/90 backdrop-blur-md transition hover:scale-[1.04] hover:border-white/35 hover:bg-white/10"
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenExpandIcon />}
        </button>
        <iframe
          src={demoSrc}
          title={`${project.title} demo`}
          className={`block w-full border-0 bg-[#0c0c0e] ${isFullscreen ? 'h-full min-h-0 flex-1' : 'h-screen'}`}
          loading="lazy"
        />
      </div>
    </section>
  );
}

function FullscreenExpandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function FullscreenExitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}
