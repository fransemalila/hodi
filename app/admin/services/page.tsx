"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { services as seedServices, BOOKING_CHARGE, COMMISSION_RATE } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";
import { Badge, Button, Card, Input, cx } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";

export default function AdminServices() {
  const { t, lang } = useI18n();
  const [services, setServices] = useState(
    seedServices.map((s) => ({ ...s, enabled: true })),
  );
  const [commission, setCommission] = useState(Math.round(COMMISSION_RATE * 100));
  const [bookingCharge, setBookingCharge] = useState(BOOKING_CHARGE);
  const [saved, setSaved] = useState(false);

  function update(id: string, patch: Partial<(typeof services)[number]>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setSaved(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">{t("servicesPricing")}</h1>
        <Button onClick={() => setSaved(true)} size="sm">
          {saved ? <><Icon name="check" size={15} strokeWidth={2.5} /> {lang === "sw" ? "Imehifadhiwa" : "Saved"}</> : t("save")}
        </Button>
      </div>

      {/* Global pricing controls */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <div className="text-sm font-bold">{t("commission")}</div>
          <div className="mt-1 text-xs text-ink-muted">
            {lang === "sw" ? "Asilimia kwa kila oda (15–20%)" : "Per completed booking (15–20%)"}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="range"
              min={10}
              max={25}
              value={commission}
              onChange={(e) => { setCommission(+e.target.value); setSaved(false); }}
              className="flex-1 accent-brand-700"
            />
            <span className="w-12 text-right text-lg font-extrabold text-brand-700">{commission}%</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-bold">{t("bookingCharge")}</div>
          <div className="mt-1 text-xs text-ink-muted">
            {lang === "sw" ? "Gharama ya ziada kwa mteja (TZS)" : "Flat fee added to the customer (TZS)"}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              type="number"
              value={bookingCharge}
              onChange={(e) => { setBookingCharge(+e.target.value); setSaved(false); }}
              className="w-32"
            />
            <span className="text-sm text-ink-muted">{tzs(bookingCharge)}</span>
          </div>
        </Card>
      </div>

      {/* Services */}
      <h2 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wide text-ink-muted">
        {lang === "sw" ? "Huduma" : "Services"}
      </h2>
      <div className="grid gap-2.5">
        {services.map((s) => (
          <Card key={s.id} className={cx("p-4", !s.enabled && "opacity-50")}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <ServiceIcon serviceId={s.id} size={18} />
              </span>
              <div className="min-w-[160px] flex-1">
                <div className="font-semibold tracking-tight">{localized(s.name, lang)}</div>
                <Badge tone="neutral" className="mt-1 capitalize">{s.category}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <PriceBox
                  label={lang === "sw" ? "Chini" : "Min"}
                  value={s.minPrice}
                  onChange={(v) => update(s.id, { minPrice: v })}
                />
                <span className="text-ink-muted">–</span>
                <PriceBox
                  label={lang === "sw" ? "Juu" : "Max"}
                  value={s.maxPrice}
                  onChange={(v) => update(s.id, { maxPrice: v })}
                />
              </div>
              <button
                onClick={() => update(s.id, { enabled: !s.enabled })}
                className={cx(
                  "relative h-7 w-12 rounded-full transition",
                  s.enabled ? "bg-brand-600" : "bg-black/15",
                )}
                aria-label="toggle"
              >
                <span
                  className={cx(
                    "absolute top-0.5 h-6 w-6 rounded-full bg-white transition",
                    s.enabled ? "left-[22px]" : "left-0.5",
                  )}
                />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PriceBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wide text-ink-muted">{label}</span>
      <input
        type="number"
        value={value}
        step={1000}
        onChange={(e) => onChange(+e.target.value)}
        className="w-24 rounded-lg border border-black/10 px-2 py-1.5 text-sm outline-none focus:border-brand-600"
      />
    </label>
  );
}
