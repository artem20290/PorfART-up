import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

function I({ size = 24, className, children, strokeWidth = 2, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function AlertTriangle(p: IconProps) {
  return (
    <I {...p}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </I>
  );
}
export function ArrowLeft(p: IconProps) {
  return (
    <I {...p}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </I>
  );
}
export function ArrowRight(p: IconProps) {
  return (
    <I {...p}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </I>
  );
}
export function ArrowUpRight(p: IconProps) {
  return (
    <I {...p}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </I>
  );
}
export function BadgeCheck(p: IconProps) {
  return (
    <I {...p}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </I>
  );
}
export function Ban(p: IconProps) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </I>
  );
}
export function BarChart3(p: IconProps) {
  return (
    <I {...p}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </I>
  );
}
export function Boxes(p: IconProps) {
  return (
    <I {...p}>
      <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
      <path d="m7 16.5-4.74-2.85" />
      <path d="m7 16.5 5-3" />
      <path d="M7 16.5v5.17" />
      <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
      <path d="m7 8.5 5-3 5 3-5 3-5-3Z" />
    </I>
  );
}
export function Building2(p: IconProps) {
  return (
    <I {...p}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </I>
  );
}
export function Calendar(p: IconProps) {
  return (
    <I {...p}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </I>
  );
}
export function CalendarClock(p: IconProps) {
  return (
    <I {...p}>
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </I>
  );
}
export function CheckCircle2(p: IconProps) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </I>
  );
}
export function ChevronDown(p: IconProps) {
  return (
    <I {...p}>
      <path d="m6 9 6 6 6-6" />
    </I>
  );
}
export function ChevronRight(p: IconProps) {
  return (
    <I {...p}>
      <path d="m9 18 6-6-6-6" />
    </I>
  );
}
export function CircleCheck(p: IconProps) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </I>
  );
}
export function Clock3(p: IconProps) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6h4" />
    </I>
  );
}
export function Download(p: IconProps) {
  return (
    <I {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </I>
  );
}
export function FilePlus2(p: IconProps) {
  return (
    <I {...p}>
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M3 15h6" />
      <path d="M6 12v6" />
    </I>
  );
}
export function FileStack(p: IconProps) {
  return (
    <I {...p}>
      <path d="M21 7h-3a2 2 0 0 1-2-2V2" />
      <path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z" />
      <path d="M3 12V2.5C3 1.7 3.7 1 4.5 1h6.8" />
      <path d="M3 16v6.5c0 .8.7 1.5 1.5 1.5h7c.8 0 1.5-.7 1.5-1.5V16" />
    </I>
  );
}
export function Filter(p: IconProps) {
  return (
    <I {...p}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </I>
  );
}
export function Gauge(p: IconProps) {
  return (
    <I {...p}>
      <path d="m12 14 4-2" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </I>
  );
}
export function GitCompareArrows(p: IconProps) {
  return (
    <I {...p}>
      <circle cx="5" cy="6" r="3" />
      <path d="M12 6h5a2 2 0 0 1 2 2v7" />
      <path d="m15 9 3-3-3-3" />
      <circle cx="19" cy="18" r="3" />
      <path d="M12 18H7a2 2 0 0 1-2-2V9" />
      <path d="m9 15-3 3 3 3" />
    </I>
  );
}
export function Hexagon(p: IconProps) {
  return (
    <I {...p}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </I>
  );
}
export function Layers(p: IconProps) {
  return (
    <I {...p}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.26a1 1 0 0 0 0 1.8l8.58 4.08a2 2 0 0 0 1.66 0l8.58-4.07a1 1 0 0 0 0-1.8Z" />
      <path d="m22 12.64-9.17 4.36a2 2 0 0 1-1.66 0L2 12.64" />
      <path d="m22 17.64-9.17 4.36a2 2 0 0 1-1.66 0L2 17.64" />
    </I>
  );
}
export function LayoutGrid(p: IconProps) {
  return (
    <I {...p}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </I>
  );
}
export function Link2(p: IconProps) {
  return (
    <I {...p}>
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </I>
  );
}
export function Plus(p: IconProps) {
  return (
    <I {...p}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </I>
  );
}
export function RefreshCw(p: IconProps) {
  return (
    <I {...p}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </I>
  );
}
export function Scale(p: IconProps) {
  return (
    <I {...p}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </I>
  );
}
export function ScrollText(p: IconProps) {
  return (
    <I {...p}>
      <path d="M15 12h-5" />
      <path d="M15 8h-5" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
    </I>
  );
}
export function Search(p: IconProps) {
  return (
    <I {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </I>
  );
}
export function ShieldAlert(p: IconProps) {
  return (
    <I {...p}>
      <path d="M20 13c0 5-3.5 7.5-8 10.5C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </I>
  );
}
export function ShieldCheck(p: IconProps) {
  return (
    <I {...p}>
      <path d="M20 13c0 5-3.5 7.5-8 10.5C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </I>
  );
}
export function SlidersHorizontal(p: IconProps) {
  return (
    <I {...p}>
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </I>
  );
}
export function Sparkles(p: IconProps) {
  return (
    <I {...p}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </I>
  );
}
export function Table(p: IconProps) {
  return (
    <I {...p}>
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </I>
  );
}
export function UserCheck(p: IconProps) {
  return (
    <I {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </I>
  );
}
export function X(p: IconProps) {
  return (
    <I {...p}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </I>
  );
}
