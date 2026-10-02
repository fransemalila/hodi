"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, CalendarCheck, Home, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { Provider } from "@/lib/types";
import { cn } from "./ui";

/** Redirects to /login once the store has hydrated and nobody is signed in. */
export function useRequireAuth() {
  const { hydrated, isAuthed } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !isAuthed) router.replace("/login");
  }, [hydrated, isAuthed, router]);
  return hydrated && isAuthed;
}

/** Wrap a protected screen: renders a spinner until auth is known. */
export function Protected({ children }: { children: ReactNode }) {
  const ready = useRequireAuth();
  if (!ready) return <ScreenSpinner />;
  return <>{children}</>;
}

export function ScreenSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0F3D2E]/15 border-t-[#0F3D2E]" />
    </div>
  );
}

/** Green page header with a back button and title. */
export function PageHeader({
  title,
  onBack,
  right,
  rounded = false,
  children,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  rounded?: boolean;
  children?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className={cn("bg-[#0F3D2E] px-6 pb-6 pt-12", rounded && "rounded-b-[32px]")}>
      <div className="flex items-center gap-4">
        <button
          onClick={onBack ?? (() => router.back())}
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="flex-1 truncate text-2xl font-bold text-white">{title}</h1>
        {right}
      </div>
      {children}
    </div>
  );
}

const NAV = [
  { href: "/home", key: "navHome", icon: Home },
  { href: "/history", key: "navBookings", icon: CalendarCheck },
  { href: "/account", key: "navAccount", icon: User },
] as const;

/** Bottom tab bar for the top-level customer screens. */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <nav className="sticky bottom-0 z-30 mt-auto border-t border-gray-200 bg-white/95 backdrop-blur-lg">
      <div className="grid grid-cols-3 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {NAV.map(({ href, key, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-semibold transition",
                active ? "text-[#0F3D2E]" : "text-gray-400 hover:text-gray-600",
              )}
            >
              <span className={cn("flex h-8 w-14 items-center justify-center rounded-full transition", active && "bg-[#0F3D2E]/10")}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.8} />
              </span>
              {t(key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const AVATAR_BG: Record<string, string> = {
  brand: "from-[#0F3D2E] to-[#246b52]",
  accent: "from-[#C9A227] to-[#a3801d]",
  purple: "from-violet-500 to-violet-700",
  blue: "from-sky-500 to-sky-700",
  rose: "from-rose-400 to-rose-600",
  amber: "from-amber-400 to-amber-600",
};

/** Provider photo, or a gradient initials tile when there's no photo. */
export function ProviderPhoto({ provider, className }: { provider: Provider; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (provider.image && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={provider.image} alt={provider.name} onError={() => setFailed(true)} className={cn("object-cover", className)} />;
  }
  const initials = provider.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br font-bold text-white",
        AVATAR_BG[provider.photo] ?? AVATAR_BG.brand,
        className,
      )}
      aria-label={provider.name}
    >
      <span className="text-[1.1em]">{initials}</span>
    </div>
  );
}

/** Bottom sheet modal, constrained to the phone frame. */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => setRoot(document.getElementById("sheet-root")), []);
  if (!open || !root) return null;
  return createPortal(
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" className="absolute inset-0 bg-black/40 animate-fade-up" onClick={onClose} />
      <div className="relative max-h-[85%] w-full overflow-y-auto rounded-t-[28px] bg-white p-6 pb-8 shadow-2xl animate-fade-up">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />
        {title && <h2 className="mb-4 text-xl font-bold text-[#0F3D2E]">{title}</h2>}
        {children}
      </div>
    </div>,
    root,
  );
}
