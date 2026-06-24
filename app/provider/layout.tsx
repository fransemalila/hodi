"use client";

import { useI18n } from "@/lib/i18n";
import { MobileShell, NavItem } from "@/components/MobileShell";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const nav: NavItem[] = [
    { href: "/provider", label: t("pDashboard"), icon: "grid" },
    { href: "/provider/jobs", label: t("pJobs"), icon: "scissors" },
    { href: "/provider/earnings", label: t("pEarnings"), icon: "wallet" },
  ];
  return (
    <MobileShell nav={nav} accent="accent">
      {children}
    </MobileShell>
  );
}
