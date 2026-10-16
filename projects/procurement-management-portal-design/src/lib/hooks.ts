import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { init, type ECharts, type EChartsOption } from "./mini-echarts";

export type ChartHandlers = { onClick?: (id: string, depth: number) => void };

/** Инициализация графиков с обновлением, ресайзом и уничтожением. */
export function useEchart(
  buildOption: () => EChartsOption,
  deps: unknown[],
  handlers?: ChartHandlers,
) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useLayoutEffect(() => {
    if (!hostRef.current) return;
    const chart = init(hostRef.current);
    chartRef.current = chart;
    chart.on("click", (params: any) => {
      const id = params?.data?.id;
      if (id) handlersRef.current?.onClick?.(String(id), Number(params?.data?.depth ?? 0));
    });
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(hostRef.current);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.setOption(buildOption(), { notMerge: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { hostRef, chartRef };
}

/** Появление блока при прокрутке. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    [el, ...kids].forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Плавный набор числа — для ключевых показателей. */
export function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const t0 = performance.now();
    const from = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(from + (target - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return v;
}

/** Узкая полоса прокрутки времени: какой шаг цикла активен. */
export function useStepClock(length: number, interval = 3200) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setStep((s) => (s + 1) % length), interval);
    return () => clearInterval(id);
  }, [length, interval, paused]);
  return { step, setStep, paused, setPaused };
}
