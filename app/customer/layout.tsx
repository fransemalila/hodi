"use client";

import { useI18n } from "@/lib/i18n";
import { MobileShell, NavItem } from "@/components/MobileShell";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const nav: NavItem[] = [
    { href: "/customer", label: t("navHome"), icon: "home" },
    { href: "/customer/bookings", label: t("navBookings"), icon: "receipt" },
    { href: "/customer/account", label: t("navAccount"), icon: "user" },
  ];
  return (
    <MobileShell nav={nav} accent="brand">
      {children}
    </MobileShell>
  );
}
