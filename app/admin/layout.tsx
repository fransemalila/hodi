"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { Icon, IconName } from "@/components/Icon";
import { cx } from "@/components/ui";
import { LogoTile, Wordmark } from "@/components/brand/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();

  const nav: { href: string; label: string; icon: IconName }[] = [
    { href: "/admin", label: t("overview"), icon: "grid" },
    { href: "/admin/providers", label: t("providers"), icon: "users" },
    { href: "/admin/bookings", label: t("bookings"), icon: "receipt" },
    { href: "/admin/services", label: t("servicesPricing"), icon: "tag" },
    { href: "/admin/reports", label: t("reports"), icon: "barChart" },
  ];

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="flex min-h-[100dvh] bg-surface-sunken">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-line bg-white p-4 md:flex">
        <Link href="/admin" className="mb-7 flex flex-col gap-1.5 px-2 pt-2">
          <Wordmark className="h-7 w-auto self-start" />
          <div className="label-caps text-2xs font-semibold text-ink-faint">Admin Console</div>
        </Link>
        <nav className="grid gap-1">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active ? "bg-brand-700 text-white shadow-xs" : "text-ink-soft hover:bg-surface-sunken",
                )}
              >
                <Icon name={n.icon} size={19} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center justify-between rounded-xl border border-line p-2 pl-3">
          <span className="text-2xs font-medium text-ink-muted">Ops team</span>
          <LangToggle />
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2.5 md:hidden">
          <Link href="/admin" className="mr-1 shrink-0" aria-label="HODI Admin">
            <LogoTile size={32} />
          </Link>
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold",
                  active ? "bg-brand-700 text-white" : "text-ink-soft",
                )}
              >
                <Icon name={n.icon} size={15} /> {n.label}
              </Link>
            );
          })}
        </div>
        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
