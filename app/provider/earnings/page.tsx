"use client";

import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { CURRENT_PROVIDER_ID } from "@/lib/current";
import { serviceById, COMMISSION_RATE } from "@/lib/mock-data";
import { localized, tzs, formatDate } from "@/lib/format";
import { Card, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";
import { TopBar } from "@/components/MobileShell";

export default function Earnings() {
  const { t, lang } = useI18n();
  const { bookings } = useStore();

  const completed = bookings.filter(
    (b) => b.providerId === CURRENT_PROVIDER_ID && b.status === "completed",
  );

  const gross = completed.reduce((s, b) => s + b.servicePrice, 0);
  const commission = Math.round(gross * COMMISSION_RATE);
  const net = gross - commission;

  return (
    <div className="animate-fade-up">
      <TopBar title={t("pEarnings")} />
      <div className="px-5">
        {/* Net payout hero */}
        <Card className="overflow-hidden">
          <div className="relative overflow-hidden bg-brand-700 p-5 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center gap-1.5 text-[13px] text-white/70">
              <Icon name="wallet" size={15} /> {t("netPayout")} · {t("monthEarnings")}
            </div>
            <div className="relative mt-1 text-[32px] font-extrabold tracking-tight">{tzs(net)}</div>
            <div className="relative mt-3 flex items-center justify-between border-t border-white/15 pt-3 text-[13px]">
              <span className="text-white/70">{t("commission")} ({Math.round(COMMISSION_RATE * 100)}%)</span>
              <span className="font-semibold">− {tzs(commission)}</span>
            </div>
          </div>
        </Card>

        {/* Period chips */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {[
            { label: t("todayEarnings"), value: net },
            { label: t("weekEarnings"), value: net },
            { label: t("monthEarnings"), value: net },
          ].map((p, i) => (
            <Card key={i} className="p-3 text-center">
              <div className="text-2xs text-ink-muted">{p.label}</div>
              <div className="mt-1 text-[13px] font-extrabold tracking-tight text-brand-700">{tzs(p.value)}</div>
            </Card>
          ))}
        </div>

        {/* Transactions */}
        <SectionLabel className="mb-2.5 mt-6">{t("jobsDone")}</SectionLabel>
        <div className="grid gap-2.5 pb-6">
          {completed.map((b) => {
            const svc = serviceById(b.serviceId);
            const fee = Math.round(b.servicePrice * COMMISSION_RATE);
            return (
              <Card key={b.id} className="flex items-center gap-3 p-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <ServiceIcon serviceId={svc.id} />
                </span>
                <div className="flex-1">
                  <div className="font-semibold tracking-tight">{localized(svc.name, lang)}</div>
                  <div className="text-[13px] text-ink-muted">{b.customerName} · {formatDate(b.createdAt, lang)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand-700">+{tzs(b.servicePrice - fee)}</div>
                  <div className="text-2xs text-ink-faint">−{tzs(fee)}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
