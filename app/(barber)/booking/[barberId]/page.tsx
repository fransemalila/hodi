"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, MapPin, FileText, Zap, Plus, Check } from "lucide-react";
import { Button, Textarea } from "@/components/barber/ui";
import { PageHeader, Protected, ProviderPhoto, Sheet } from "@/components/barber/shell";
import { LocationForm } from "@/components/barber/LocationForm";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { BOOKING_CHARGE, serviceById } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";

const SLOT_HOURS = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18];
const DAYS_AHEAD = 5;

function slotDate(dayOffset: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export default function BookingPage({ params }: { params: { barberId: string } }) {
  return (
    <Protected>
      <BookingScreen barberId={params.barberId} />
    </Protected>
  );
}

function BookingScreen({ barberId }: { barberId: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const { t, lang } = useI18n();
  const { providers, profile, createBooking, updateProfile } = useStore();
  const barber = providers.find((p) => p.id === barberId && p.verification === "verified");

  const initialService = search.get("service");
  const [serviceId, setServiceId] = useState<string>(
    barber && initialService && barber.serviceIds.includes(initialService) ? initialService : barber?.serviceIds[0] ?? "",
  );
  const canNow = barber?.status === "online";
  const [mode, setMode] = useState<"now" | "later">(canNow ? "now" : "later");
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState<number | null>(null);
  const [locationId, setLocationId] = useState(profile.defaultLocationId ?? profile.locations[0]?.id);
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(
    () =>
      Array.from({ length: DAYS_AHEAD }, (_, i) => {
        const d = slotDate(i, 12);
        const label =
          i === 0
            ? t("today")
            : i === 1
              ? t("tomorrow")
              : d.toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { weekday: "short" });
        return { offset: i, label, sub: d.getDate() };
      }),
    [t, lang],
  );

  // A slot needs at least an hour's notice.
  const slotOpen = (h: number) => slotDate(day, h).getTime() > Date.now() + 60 * 60 * 1000;
  const openSlots = SLOT_HOURS.filter(slotOpen);

  if (!barber) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-gray-600">{t("noMatch")}</p>
        <Button onClick={() => router.push("/home")} className="h-12 rounded-full bg-[#0F3D2E] px-6 text-white">
          {t("backHome")}
        </Button>
      </div>
    );
  }

  const service = serviceById(serviceId);
  const price = barber.prices[serviceId];
  const total = price + BOOKING_CHARGE;
  const location = profile.locations.find((l) => l.id === locationId);
  const timeChosen = mode === "now" ? canNow : hour != null && slotOpen(hour);
  const ready = !!location && timeChosen && !submitting;

  const confirm = () => {
    if (!ready || !location) return;
    setSubmitting(true);
    const booking = createBooking({
      serviceId,
      providerId: barber.id,
      servicePrice: price,
      location,
      scheduledFor: mode === "now" ? "now" : slotDate(day, hour!).toISOString(),
      notes: notes.trim() || undefined,
    });
    updateProfile({ defaultLocationId: location.id });
    router.replace(`/tracking/${booking.id}`);
  };

  const chip = (on: boolean) =>
    `rounded-xl font-medium transition-all ${on ? "bg-[#0F3D2E] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <PageHeader title={t("bookAppointment")}>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
          <ProviderPhoto provider={barber} className="h-12 w-12 rounded-xl text-sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{barber.name}</p>
            <p className="text-xs text-white/70">
              ★ {barber.rating.toFixed(1)} · {barber.distanceKm} km · {barber.area}
            </p>
          </div>
        </div>
      </PageHeader>

      <div className="flex-1 space-y-5 px-6 py-6">
        {/* Service */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">{t("selectService")}</h2>
          <div className="space-y-2">
            {barber.serviceIds.map((sid) => {
              const s = serviceById(sid);
              return (
                <button key={sid} onClick={() => setServiceId(sid)} className={`flex w-full items-center justify-between p-4 ${chip(serviceId === sid)}`}>
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{s.emoji}</span>
                    {localized(s.name, lang)}
                  </span>
                  <span className="font-semibold">{tzs(barber.prices[sid])}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* When */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0F3D2E]">
            <Calendar className="h-5 w-5" /> {t("whenService")}
          </h2>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => canNow && setMode("now")}
              disabled={!canNow}
              className={`flex flex-col items-start gap-0.5 p-4 text-left disabled:cursor-not-allowed disabled:opacity-40 ${chip(mode === "now")}`}
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <Zap className="h-4 w-4" /> {t("rightNow")}
              </span>
              <span className={`text-xs ${mode === "now" ? "text-white/70" : "text-gray-500"}`}>{t("within")}</span>
            </button>
            <button onClick={() => setMode("later")} className={`flex flex-col items-start gap-0.5 p-4 text-left ${chip(mode === "later")}`}>
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="h-4 w-4" /> {t("schedule")}
              </span>
              <span className={`text-xs ${mode === "later" ? "text-white/70" : "text-gray-500"}`}>{t("pickTime")}</span>
            </button>
          </div>

          {mode === "later" && (
            <div className="animate-fade-up">
              <p className="mb-2 text-sm font-medium text-gray-600">{t("selectDate")}</p>
              <div className="mb-4 grid grid-cols-5 gap-2">
                {days.map((d) => (
                  <button
                    key={d.offset}
                    onClick={() => {
                      setDay(d.offset);
                      setHour(null);
                    }}
                    className={`flex flex-col items-center py-2.5 ${chip(day === d.offset)}`}
                  >
                    <span className="text-[11px] leading-tight">{d.label}</span>
                    <span className="text-lg font-bold leading-tight">{d.sub}</span>
                  </button>
                ))}
              </div>
              <p className="mb-2 text-sm font-medium text-gray-600">{t("selectTime")}</p>
              {openSlots.length === 0 ? (
                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">{t("noSlots")}</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {SLOT_HOURS.map((h) => {
                    const open = slotOpen(h);
                    return (
                      <button
                        key={h}
                        disabled={!open}
                        onClick={() => setHour(h)}
                        className={`py-3 text-sm disabled:cursor-not-allowed disabled:opacity-30 ${chip(hour === h)}`}
                      >
                        {String(h).padStart(2, "0")}:00
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Location */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0F3D2E]">
            <MapPin className="h-5 w-5" /> {t("whereService")}
          </h2>
          <div className="space-y-2">
            {profile.locations.map((l) => {
              const on = l.id === locationId;
              return (
                <button
                  key={l.id}
                  onClick={() => setLocationId(l.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border-2 p-3.5 text-left transition ${
                    on ? "border-[#0F3D2E] bg-[#0F3D2E]/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-[#0F3D2E]">{l.label}</span>
                    <span className="block text-sm text-gray-600">{l.landmark}</span>
                    {l.note && <span className="mt-0.5 block text-xs text-gray-500">{l.note}</span>}
                  </span>
                  {on && <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0F3D2E]" />}
                </button>
              );
            })}
          </div>
          <button onClick={() => setAdding(true)} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#a3801d] hover:underline">
            <Plus className="h-4 w-4" /> {t("addLocation")}
          </button>
        </section>

        {/* Notes */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0F3D2E]">
            <FileText className="h-5 w-5" /> {t("additionalNotes")}
          </h2>
          <Textarea
            placeholder={t("notesPh")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={280}
            className="min-h-24 resize-none rounded-xl"
          />
        </section>

        {/* Price */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">{t("priceSummary")}</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>{localized(service.name, lang)}</span>
              <span className="font-medium">{tzs(price)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{t("bookingCharge")}</span>
              <span className="font-medium">{tzs(BOOKING_CHARGE)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span className="font-bold text-[#0F3D2E]">{t("total")}</span>
              <span className="text-xl font-bold text-[#0F3D2E]">{tzs(total)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={confirm}
          disabled={!ready}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
        >
          {!location ? t("addLocationFirst") : `${t("confirmBooking")} · ${tzs(total)}`}
        </Button>
      </div>

      <Sheet open={adding} onClose={() => setAdding(false)} title={t("addLocation")}>
        <LocationForm
          onSaved={(loc) => {
            setLocationId(loc.id);
            setAdding(false);
          }}
        />
      </Sheet>
    </div>
  );
}
