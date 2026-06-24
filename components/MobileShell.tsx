"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cx, IconButton } from "./ui";
import { Icon, IconName } from "./Icon";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

/** Phone-shaped frame on desktop, full-bleed on mobile. */
export function MobileShell({
  children,
  nav,
  accent = "brand",
}: {
  children: ReactNode;
  nav: NavItem[];
  accent?: "brand" | "accent";
}) {
  const pathname = usePathname();
  const showNav = nav.some((n) => n.href === pathname);
  const activeColor = accent === "brand" ? "text-brand-700" : "text-accent-600";

  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col bg-surface-sunken sm:my-4 sm:min-h-[calc(100dvh-2rem)] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-line sm:shadow-raised">
      <div className={cx("flex-1 overflow-y-auto", showNav && "pb-[88px]")}>{children}</div>
      {showNav && (
        <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-line bg-white/95 shadow-nav backdrop-blur-lg sm:absolute">
          <div className="grid grid-cols-3 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold transition",
                    active ? activeColor : "text-ink-faint",
                  )}
                >
                  <span className={cx("flex h-9 w-14 items-center justify-center rounded-full transition", active && (accent === "brand" ? "bg-brand-50" : "bg-accent-50"))}>
                    <Icon name={item.icon} size={22} strokeWidth={active ? 2.1 : 1.75} />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export function TopBar({
  title,
  back,
  right,
}: {
  title?: string;
  back?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 bg-surface-sunken/85 px-4 py-3 backdrop-blur-lg">
      {back && (
        <IconButton onClick={back} aria-label="Back">
          <Icon name="chevronLeft" size={20} className="text-ink" />
        </IconButton>
      )}
      {title ? <h1 className="flex-1 truncate text-[17px] font-bold tracking-tight">{title}</h1> : <div className="flex-1" />}
      {right}
    </div>
  );
}
