"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

function cx(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 ease-spring active:scale-[0.98] focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-40 disabled:pointer-events-none";
  const sizes: Record<Size, string> = {
    sm: "px-3 py-2 text-[13px]",
    md: "px-4 py-3 text-sm",
    lg: "px-5 py-3.5 text-[15px]",
  };
  const variants: Record<Variant, string> = {
    primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-xs",
    secondary: "bg-white text-ink border border-line hover:border-ink-faint/40 hover:bg-surface-sunken",
    ghost: "bg-transparent text-ink-soft hover:bg-black/[0.04]",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    accent: "bg-accent-500 text-brand-900 hover:bg-accent-600 shadow-xs",
  };
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function IconButton({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(
        "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition hover:bg-surface-sunken active:scale-95",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cx(
        "rounded-xl2 border border-line bg-surface shadow-card",
        onClick && "cursor-pointer transition-all duration-150 hover:border-ink-faint/30 hover:shadow-raised active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-sunken text-ink-soft border-line",
    green: "bg-brand-50 text-brand-700 border-brand-100",
    amber: "bg-accent-50 text-accent-600 border-accent-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const avatarGradients: Record<string, string> = {
  brand: "from-brand-500 to-brand-700",
  accent: "from-accent-400 to-accent-600",
  purple: "from-violet-500 to-purple-700",
  blue: "from-sky-500 to-blue-700",
  rose: "from-rose-400 to-rose-600",
  amber: "from-amber-400 to-amber-600",
};

export function Avatar({
  name,
  color = "brand",
  size = 44,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  // Accept either a gradient key (e.g. "brand") or a raw bg class (e.g. "bg-white/20").
  const isRawClass = color.startsWith("bg-") || color.includes("/");
  const bg = isRawClass ? color : "bg-gradient-to-br " + (avatarGradients[color] ?? avatarGradients.brand);
  return (
    <div
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-1 ring-black/[0.04]",
        bg,
      )}
      style={{ width: size, height: size, fontSize: size * 0.37 }}
    >
      {initials}
    </div>
  );
}

export function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} stars`}>
      <Icon name="star" filled size={size} className="text-accent-400" />
      <span className="font-semibold text-ink" style={{ fontSize: size }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export function StatusDot({ status }: { status: "online" | "busy" | "offline" }) {
  const color =
    status === "online" ? "bg-brand-500" : status === "busy" ? "bg-accent-500" : "bg-ink-faint";
  return (
    <span className={cx("inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white", color)} />
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cx("label-caps text-2xs font-bold text-ink-muted", className)}>{children}</h2>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-500 focus:shadow-focus",
        props.className,
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-500 focus:shadow-focus",
        props.className,
      )}
    />
  );
}

export { cx };
