import type { ReactNode } from "react";
import { X, ChevronDown, Search } from "lucide-react";
import { cn } from "../utils/cn";

export function Panel({
  title,
  eyebrow,
  subtitle,
  right,
  children,
  className,
  bodyClass,
  dark,
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
  dark?: boolean;
}) {
  return (
    <section className={cn("sb-card shadow-true spend-panel", dark && "is-dark", className)}>
      {(title || right) && (
        <header className="sb-card-header spend-panel-head">
          <div className="min-w-0">
            {eyebrow && (
              <div className={cn("eyebrow mb-1", dark ? "text-[#7ee8ec]" : "text-brand")}>{eyebrow}</div>
            )}
            <h2 className={cn("tpl-panel-title", dark && "text-white")}>{title}</h2>
            {subtitle && (
              <p className={cn("tpl-panel-sub", dark && "text-white/55")}>
                {subtitle}
              </p>
            )}
          </div>
          {right && <div className="shrink-0 pt-0.5">{right}</div>}
        </header>
      )}
      <div className={cn("flex-1 min-h-0", bodyClass)}>{children}</div>
    </section>
  );
}

export function SectionHead({
  index,
  title,
  lead,
  right,
}: {
  index: string;
  title: string;
  lead?: string;
  right?: ReactNode;
}) {
  return (
    <div className="tpl-panel-head">
      <div>
        <div className="eyebrow mb-1 text-brand">{index}</div>
        <h2 className="tpl-panel-title">{title}</h2>
        {lead && <p className="tpl-panel-sub">{lead}</p>}
      </div>
      {right}
    </div>
  );
}

export function Flag({
  children,
  tone = "alert",
  dot,
}: {
  children: ReactNode;
  tone?: "alert" | "warn" | "ok" | "mute" | "dark";
  dot?: boolean;
}) {
  const tones = {
    alert: "tag tag-danger",
    warn: "tag tag-warn",
    ok: "tag tag-success",
    mute: "tag tag-neutral",
    dark: "tag tag-promo",
  };
  return (
    <span className={tones[tone]}>
      {dot && (
        <span
          className={cn(
            "h-[5px] w-[5px] shrink-0 rounded-full bg-current",
            tone === "alert" && "animate-pulsedot",
          )}
        />
      )}
      {children}
    </span>
  );
}

export function MiniBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "alert" | "ink" }) {
  const bg = { brand: undefined, alert: "var(--danger)", ink: "var(--text-secondary)" }[tone];
  return (
    <div className="progress" style={{ height: 6 }}>
      <div
        className="progress-bar"
        style={{
          width: `${Math.min(100, Math.max(0, value * 100))}%`,
          ...(bg ? { background: bg } : null),
        }}
      />
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  size = "sm",
  className,
  icon,
  disabled,
}: {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "line" | "solid" | "alert" | "onDark";
  size?: "sm" | "xs" | "lg";
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  const v = {
    ghost: "btn-ghost",
    line: "btn-secondary",
    solid: "btn-primary",
    alert: "btn-danger",
    onDark: "btn-ghost",
  }[variant];
  const s = { xs: "btn-xs", sm: "btn-s", lg: "btn-m" }[size];
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cn("btn", v, s, className)}>
      {icon}
      {children}
    </button>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "ink",
  hint,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "ink" | "alert" | "brand";
  hint?: string;
}) {
  const c = { ink: "text-ink", alert: "text-alert", brand: "text-brand" }[tone];
  const change = tone === "alert" ? "is-down" : tone === "brand" ? "is-up" : "is-neutral";
  return (
    <div className="sb-stat" title={hint}>
      <div className="sb-stat-label">{label}</div>
      <div className={cn("sb-stat-value", c)}>{value}</div>
      {sub && <div className={cn("sb-stat-change", change)}>{sub}</div>}
    </div>
  );
}

export function Th({
  children,
  align = "left",
  className,
  onClick,
  active,
  dir,
}: {
  children?: ReactNode;
  align?: "left" | "right";
  className?: string;
  onClick?: () => void;
  active?: boolean;
  dir?: "asc" | "desc";
}) {
  return (
    <th
      onClick={onClick}
      className={cn(
        align === "right" ? "text-right" : "text-left",
        onClick && "cursor-pointer",
        active && "text-brand",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {active && <ChevronDown className={cn("h-3 w-3 transition-transform", dir === "asc" && "rotate-180")} />}
      </span>
    </th>
  );
}

export function CloseBtn({ onClick, dark }: { onClick: () => void; dark?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={cn("live-drawer-close", dark && "text-white/70")} aria-label="Закрыть">
      <X className="h-5 w-5" />
    </button>
  );
}

export function FieldSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="sb-search-input">
      <Search className="sb-search-input-icon h-4 w-4" />
      <input
        className="sb-search-input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value ? (
        <button type="button" className="sb-search-input-clear" onClick={() => onChange("")} aria-label="Очистить">
          ×
        </button>
      ) : null}
    </div>
  );
}

export function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: ReactNode }[];
}) {
  return (
    <div className="sb-chips size-s view-outlined">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={cn("sb-chip", value === o.id && "is-selected")}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="switch-wrap">
      <span className="switch size-s">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="slider" />
      </span>
      <span className="switch-label">{label}</span>
    </label>
  );
}

export function TableShell({
  children,
  compact,
  className,
}: {
  children: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("sb-table", compact && "sb-table--compact")}>
      <div className={cn("sb-table-scroll", className)}>{children}</div>
    </div>
  );
}
