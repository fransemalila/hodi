"use client";

import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { services, serviceById, avatarColors, COMMISSION_RATE } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";
import { Avatar, Card, Stars } from "@/components/ui";
import { ServiceIcon } from "@/components/cards";

export default function AdminReports() {
  const { t, lang } = useI18n();
  const { bookings, providers } = useStore();
  const completed = bookings.filter((b) => b.status === "completed");

  // Bookings per weekday (mock distribution for the demo)
  const week = lang === "sw"
    ? ["Jtt", "Jnn", "Jnp", "Alh", "Iju", "Jms", "Jpl"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekData = [12, 18, 15, 22, 30, 41, 26];
  const maxWeek = Math.max(...weekData);

  // Service popularity
  const svcCounts = services.map((s) => ({
    service: s,
    count: 4 + (s.id === "svc_haircut" ? 38 : s.id === "svc_beard" ? 24 : s.id === "svc_kids" ? 12 : 9),
  }));
  const maxSvc = Math.max(...svcCounts.map((s) => s.count));

  // Top providers
  const top = [...providers]
    .filter((p) => p.verification === "verified")
    .sort((a, b) => b.completedJobs - a.completedJobs)
    .slice(0, 5);

  const totalRevenue = Math.round(completed.reduce((s, b) => s + b.servicePrice * COMMISSION_RATE, 0));

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">{t("reports")}</h1>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {/* Bookings per day */}
        <Card className="p-5">
          <div className="text-sm font-bold">
            {lang === "sw" ? "Oda kwa siku" : "Bookings per day"}
          </div>
          <div className="mt-4 flex h-40 items-end gap-2">
            {weekData.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="text-xs font-semibold text-ink-muted">{v}</div>
                <div
                  className="w-full rounded-t-md bg-brand-600"
                  style={{ height: `${(v / maxWeek) * 100}%` }}
                />
                <div className="text-[10px] text-ink-muted">{week[i]}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue */}
        <Card className="p-5">
          <div className="text-sm font-bold">{lang === "sw" ? "Mapato" : "Revenue"}</div>
          <div className="mt-4 grid gap-3">
            {[
              { label: "GMV", value: tzs(completed.reduce((s, b) => s + b.total, 0)), pct: 100, color: "bg-brand-200" },
              { label: lang === "sw" ? "Kamisheni" : "Commission", value: tzs(totalRevenue), pct: 60, color: "bg-brand-600" },
              { label: lang === "sw" ? "Malipo kwa watoa huduma" : "Provider payouts", value: tzs(completed.reduce((s, b) => s + Math.round(b.servicePrice * (1 - COMMISSION_RATE)), 0)), pct: 80, color: "bg-accent-500" },
            ].map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">{r.label}</span>
                  <span className="font-bold">{r.value}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-black/[0.06]">
                  <div className={`h-2 rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Service popularity */}
        <Card className="p-5">
          <div className="text-sm font-bold">
            {lang === "sw" ? "Huduma maarufu" : "Service popularity"}
          </div>
          <div className="mt-4 grid gap-3">
            {svcCounts.map(({ service, count }) => (
              <div key={service.id}>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-ink-soft">
                    <ServiceIcon serviceId={service.id} size={15} /> {localized(service.name, lang)}
                  </span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-black/[0.06]">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: `${(count / maxSvc) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top providers */}
        <Card className="p-5">
          <div className="text-sm font-bold">
            {lang === "sw" ? "Watoa huduma bora" : "Top providers"}
          </div>
          <div className="mt-4 grid gap-3">
            {top.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-center font-extrabold text-ink-muted">{i + 1}</span>
                <Avatar name={p.name} color={avatarColors[p.photo]} size={36} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-ink-muted">{p.completedJobs} {t("jobsDone")}</div>
                </div>
                <Stars rating={p.rating} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
