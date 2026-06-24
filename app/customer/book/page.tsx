"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById, services, avatarColors, BOOKING_CHARGE } from "@/lib/mock-data";
import type { PaymentMethod, SavedLocation } from "@/lib/types";
import { localized, tzs } from "@/lib/format";
import { Avatar, Button, Card, Input, SectionLabel, Stars, Textarea, cx } from "@/components/ui";
import { Icon, IconName } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { TopBar } from "@/components/MobileShell";

const STEPS = ["service", "when", "where", "pay"] as const;
type Step = (typeof STEPS)[number];

function BookingFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const { t, lang } = useI18n();
  const { providers, profile, createBooking } = useStore();

  const [serviceId, setServiceId] = useState<string>(sp.get("service") ?? services[0].id);
  const [providerId, setProviderId] = useState<string | null>(sp.get("provider"));
  const [step, setStep] = useState<Step>(sp.get("provider") ? "when" : "service");

  const [when, setWhen] = useState<"now" | "scheduled">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [location, setLocation] = useState<SavedLocation>(profile.locations[0]);
  const [locNote, setLocNote] = useState(profile.locations[0]?.note ?? "");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("mpesa");

  const service = serviceById(serviceId);

  const eligibleProviders = useMemo(
    () =>
      providers
        .filter((p) => p.verification === "verified" && p.serviceIds.includes(serviceId))
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [providers, serviceId],
  );

  const provider = providers.find((p) => p.id === providerId) ?? null;
  const servicePrice = provider ? provider.prices[serviceId] : service.minPrice;
  const total = servicePrice + BOOKING_CHARGE;
  const stepIndex = STEPS.indexOf(step);

  function goNext() {
    if (step === "service" && !providerId) return;
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  }
  function goBack() {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
    else router.back();
  }
  function confirm() {
    const loc = { ...location, note: locNote };
    const booking = createBooking({
      serviceId,
      providerId: providerId!,
      servicePrice,
      location: loc,
      scheduledFor: when === "now" ? "now" : scheduledAt || "now",
      notes,
      paymentMethod: payment,
    });
    router.push(`/customer/bookings/${booking.id}?new=1`);
  }

  const stepLabels: Record<Step, string> = {
    service: t("stepService"),
    when: t("stepWhen"),
    where: t("stepWhere"),
    pay: t("stepPay"),
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <TopBar title={t("book")} back={goBack} />

      {/* Stepper */}
      <div className="flex gap-1.5 px-5">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cx("h-1.5 flex-1 rounded-full transition-all duration-300", i <= stepIndex ? "bg-brand-600" : "bg-line")}
          />
        ))}
      </div>
      <div className="px-5 pt-2 text-2xs font-semibold uppercase tracking-wide text-ink-muted">
        {stepIndex + 1}/4 · {stepLabels[step]}
      </div>

      <div className="flex-1 px-5 py-4">
        {/* STEP: SERVICE + PROVIDER */}
        {step === "service" && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-extrabold tracking-tight">{localized(service.name, lang)}</h2>
            <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setServiceId(s.id);
                    setProviderId(null);
                  }}
                  className={cx(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-semibold transition",
                    s.id === serviceId ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-ink-soft",
                  )}
                >
                  <ServiceIcon serviceId={s.id} size={15} />
                  {localized(s.name, lang)}
                </button>
              ))}
            </div>

            <SectionLabel className="mb-2.5 mt-5">{t("nearbyProviders")}</SectionLabel>
            <div className="grid gap-2.5">
              {eligibleProviders.map((p) => (
                <Card
                  key={p.id}
                  onClick={() => setProviderId(p.id)}
                  className={cx("flex items-center gap-3.5 p-3.5", providerId === p.id && "!border-brand-600 ring-1 ring-brand-600")}
                >
                  <Avatar name={p.name} color={avatarColors[p.photo]} size={48} />
                  <div className="flex-1">
                    <div className="font-semibold tracking-tight">{p.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
                      <Stars rating={p.rating} size={12} />
                      <span className="text-ink-faint">·</span>
                      <span>{p.distanceKm} km</span>
                    </div>
                  </div>
                  <div className="font-bold text-brand-700">{tzs(p.prices[serviceId])}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP: WHEN */}
        {step === "when" && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-extrabold tracking-tight">{t("whenService")}</h2>
            <div className="mt-3 grid gap-2.5">
              <OptionCard
                icon="zap"
                active={when === "now"}
                onClick={() => setWhen("now")}
                title={t("rightNow")}
                desc={t("within")}
              />
              <OptionCard
                icon="calendar"
                active={when === "scheduled"}
                onClick={() => setWhen("scheduled")}
                title={t("schedule")}
                desc={t("pickTime")}
              />
              {when === "scheduled" && (
                <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              )}
            </div>
          </div>
        )}

        {/* STEP: WHERE */}
        {step === "where" && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-extrabold tracking-tight">{t("whereService")}</h2>
            <MapPlaceholder landmark={location.landmark} className="mt-3" />

            <SectionLabel className="mb-2.5 mt-4">{t("savedLocations")}</SectionLabel>
            <div className="grid gap-2.5">
              {profile.locations.map((loc) => (
                <Card
                  key={loc.id}
                  onClick={() => {
                    setLocation(loc);
                    setLocNote(loc.note ?? "");
                  }}
                  className={cx("flex items-center gap-3 p-3.5", location.id === loc.id && "!border-brand-600 ring-1 ring-brand-600")}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon name="pin" size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold">{loc.label}</div>
                    <div className="text-[13px] text-ink-muted">{loc.landmark}</div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{t("addNote")}</label>
              <Textarea rows={2} value={locNote} onChange={(e) => setLocNote(e.target.value)} placeholder={t("notePlaceholder")} />
            </div>
            <div className="mt-3">
              <label className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{t("specialNotes")}</label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("specialNotesPlaceholder")} />
            </div>
          </div>
        )}

        {/* STEP: PAY */}
        {step === "pay" && provider && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-extrabold tracking-tight">{t("paymentMethod")}</h2>
            <div className="mt-3 grid gap-2.5">
              {(
                [
                  { id: "mpesa", label: "M-Pesa", sub: "Vodacom", icon: "smartphone", tint: "bg-brand-50 text-brand-700" },
                  { id: "tigopesa", label: "Tigo Pesa", sub: "Tigo", icon: "smartphone", tint: "bg-blue-50 text-blue-700" },
                  { id: "airtel", label: "Airtel Money", sub: "Airtel", icon: "smartphone", tint: "bg-rose-50 text-rose-700" },
                  { id: "cash", label: t("cashLabel"), sub: t("cashDesc"), icon: "banknote", tint: "bg-accent-50 text-accent-600" },
                ] as const
              ).map((m) => (
                <Card
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={cx("flex items-center gap-3 p-3.5", payment === m.id && "!border-brand-600 ring-1 ring-brand-600")}
                >
                  <span className={cx("flex h-10 w-10 items-center justify-center rounded-xl", m.tint)}>
                    <Icon name={m.icon as IconName} size={20} />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold">{m.label}</div>
                    <div className="text-[13px] text-ink-muted">{m.sub}</div>
                  </div>
                  <span
                    className={cx(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2 transition",
                      payment === m.id ? "border-brand-600 bg-brand-600 text-white" : "border-line",
                    )}
                  >
                    {payment === m.id && <Icon name="check" size={12} strokeWidth={3} />}
                  </span>
                </Card>
              ))}
            </div>

            {/* Breakdown */}
            <Card className="mt-4 p-4">
              <SectionLabel className="mb-2.5">{t("priceBreakdown")}</SectionLabel>
              <Row label={`${localized(service.name, lang)}`} value={tzs(servicePrice)} />
              <Row label={t("bookingCharge")} value={tzs(BOOKING_CHARGE)} />
              <div className="my-2.5 border-t border-dashed border-line" />
              <Row label={t("total")} value={tzs(total)} bold />
            </Card>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="sticky bottom-0 border-t border-line bg-white/90 p-4 backdrop-blur-lg">
        {step !== "pay" ? (
          <Button onClick={goNext} size="lg" disabled={step === "service" && !providerId} className="w-full">
            {t("next")}
            {provider ? ` · ${tzs(total)}` : ""}
            <Icon name="arrowRight" size={18} />
          </Button>
        ) : (
          <Button onClick={confirm} size="lg" className="w-full">
            {payment === "cash" ? t("confirmBooking") : t("confirmAndPay")} · {tzs(total)}
          </Button>
        )}
      </div>
    </div>
  );
}

function OptionCard({
  icon,
  active,
  onClick,
  title,
  desc,
}: {
  icon: IconName;
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <Card onClick={onClick} className={cx("flex items-center gap-3.5 p-4", active && "!border-brand-600 ring-1 ring-brand-600")}>
      <span className={cx("flex h-11 w-11 items-center justify-center rounded-xl", active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700")}>
        <Icon name={icon} size={22} />
      </span>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-[13px] text-ink-muted">{desc}</div>
      </div>
    </Card>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={cx("text-sm", bold ? "font-bold text-ink" : "text-ink-soft")}>{label}</span>
      <span className={cx(bold ? "text-base font-extrabold text-brand-700" : "text-sm font-semibold text-ink")}>{value}</span>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-6 text-ink-muted">…</div>}>
      <BookingFlow />
    </Suspense>
  );
}
