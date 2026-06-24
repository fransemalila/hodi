"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { Icon, IconName } from "@/components/Icon";
import { cx } from "@/components/ui";

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
        <Link href="/" className="mb-7 flex items-center gap-2.5 px-2 pt-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 font-extrabold text-white">H</div>
          <div>
            <div className="font-extrabold leading-none tracking-tight">Hodi</div>
            <div className="label-caps mt-0.5 text-2xs font-semibold text-ink-faint">Admin Console</div>
          </div>
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
          <Link href="/" className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-sm font-extrabold text-white">H</Link>
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
