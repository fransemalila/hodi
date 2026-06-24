"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { Icon, IconName } from "@/components/Icon";
import { cx } from "@/components/ui";

export default function Launcher() {
  const { t, lang } = useI18n();

  const roles: { href: string; title: string; desc: string; icon: IconName; tone: string }[] = [
    { href: "/customer", title: t("customerApp"), desc: t("customerAppDesc"), icon: "user", tone: "bg-brand-600" },
    { href: "/provider", title: t("providerApp"), desc: t("providerAppDesc"), icon: "scissors", tone: "bg-accent-500" },
    { href: "/admin", title: t("adminApp"), desc: t("adminAppDesc"), icon: "grid", tone: "bg-ink" },
  ];

  return (
    <main className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col overflow-hidden px-6 py-8">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-60 w-60 rounded-full bg-accent-100/50 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-lg font-extrabold text-white shadow-xs">
            H
          </div>
          <span className="text-xl font-extrabold tracking-tight">Hodi</span>
        </div>
        <LangToggle />
      </div>

      <div className="relative mt-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-2xs font-semibold text-ink-soft shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Dar es Salaam · Beta
        </div>
        <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-tight">
          {t("appTagline")}
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">{t("chooseExperience")}</p>
      </div>

      <div className="relative mt-7 grid gap-3">
        {roles.map((r) => (
          <Link key={r.href} href={r.href}>
            <div className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-150 hover:border-ink-faint/30 hover:shadow-raised active:scale-[0.99]">
              <div className={cx("flex h-12 w-12 items-center justify-center rounded-xl text-white", r.tone)}>
                <Icon name={r.icon} size={22} />
              </div>
              <div className="flex-1">
                <div className="font-bold tracking-tight">{r.title}</div>
                <div className="text-[13px] text-ink-muted">{r.desc}</div>
              </div>
              <Icon name="chevronRight" size={18} className="text-ink-faint transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="relative mt-auto flex items-center justify-center gap-2 pt-10 text-2xs text-ink-faint">
        <Icon name="shieldCheck" size={14} />
        {t("demoNote")}
      </div>
    </main>
  );
}
