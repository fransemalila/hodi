"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Star, MapPin, Award, CheckCircle, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { Protected, ProviderPhoto } from "@/components/barber/shell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { seedReviews, serviceById } from "@/lib/mock-data";
import { localized, timeAgo, tzs } from "@/lib/format";

export default function BarberProfilePage({ params }: { params: { id: string } }) {
  return (
    <Protected>
      <BarberProfileScreen id={params.id} />
    </Protected>
  );
}

function BarberProfileScreen({ id }: { id: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const { t, lang } = useI18n();
  const { providers, bookings } = useStore();
  const barber = providers.find((p) => p.id === id && p.verification === "verified");
  const [serviceId, setServiceId] = useState<string | null>(search.get("service"));
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviews = useMemo(() => {
    if (!barber) return [];
    const live = bookings
      .filter((b) => b.providerId === barber.id && b.review)
      .map((b) => ({
        key: b.id,
        name: b.customerName,
        rating: b.review!.rating,
        comment: b.review!.comment ?? "",
        when: timeAgo(b.review!.createdAt, lang),
      }));
    const seeded = seedReviews
      .filter((r) => r.providerId === barber.id)
      .map((r, i) => ({
        key: `seed${i}`,
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        when: timeAgo(new Date(Date.now() - r.daysAgo * 86400000).toISOString(), lang),
      }));
    return [...live, ...seeded];
  }, [barber, bookings, lang]);

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

  const selected = serviceId && barber.serviceIds.includes(serviceId) ? serviceId : barber.serviceIds[0];
  const canBook = barber.status !== "offline";
  const shown = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <div className="flex-1">
        {/* Header Image */}
        <div className="relative h-80">
          <ProviderPhoto provider={barber} className="h-full w-full text-6xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          <button
            onClick={() => router.back()}
            aria-label={t("back")}
            className="absolute left-6 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white">{barber.name}</h1>
              {barber.nidaVerified && <ShieldCheck className="h-6 w-6 text-[#C9A227]" />}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
                <Star className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                <span className="font-semibold text-white">{barber.rating.toFixed(1)}</span>
                <span className="text-sm text-white/80">({barber.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {barber.distanceKm} km {t("away")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <Award className="mb-2 h-6 w-6 text-[#C9A227]" />
              <p className="text-2xl font-bold text-[#0F3D2E]">
                {barber.yearsExperience} {t("years")}
              </p>
              <p className="text-sm text-gray-600">{t("experience")}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <CheckCircle className="mb-2 h-6 w-6 text-[#C9A227]" />
              <p className="text-2xl font-bold text-[#0F3D2E]">{barber.completedJobs}+</p>
              <p className="text-sm text-gray-600">{t("jobsCompleted")}</p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#0F3D2E]">{t("servicesPrices")}</h2>
            <div className="space-y-2">
              {barber.serviceIds.map((sid) => {
                const s = serviceById(sid);
                const on = sid === selected;
                return (
                  <button
                    key={sid}
                    onClick={() => setServiceId(sid)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3.5 text-left transition-all ${
                      on ? "bg-[#0F3D2E] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{localized(s.name, lang)}</span>
                      <span className={`block text-xs ${on ? "text-white/70" : "text-gray-500"}`}>
                        {s.durationMin}–{s.durationMax} {t("minutes")}
                      </span>
                    </span>
                    <span className="font-semibold">{tzs(barber.prices[sid])}</span>
                    {on && <Check className="h-4 w-4 text-[#C9A227]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#0F3D2E]">{t("about")}</h2>
            <p className="leading-relaxed text-gray-700">{localized(barber.bio, lang)}</p>
          </div>

          {barber.specialties && barber.specialties.length > 0 && (
            <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-[#0F3D2E]">{t("specialties")}</h2>
              <div className="flex flex-wrap gap-2">
                {barber.specialties.map((s, i) => (
                  <span key={i} className="rounded-full bg-[#0F3D2E]/5 px-4 py-2 text-sm font-medium text-[#0F3D2E]">
                    {localized(s, lang)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {barber.portfolio && barber.portfolio.length > 0 && (
            <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-[#0F3D2E]">{t("portfolio")}</h2>
              <div className="grid grid-cols-3 gap-3">
                {barber.portfolio.map((image, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={image} alt={`${t("portfolio")} ${i + 1}`} className="h-24 w-full rounded-xl object-cover" />
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F3D2E]">{t("reviewsTitle")}</h2>
              {reviews.length > 3 && (
                <button onClick={() => setShowAllReviews((v) => !v)} className="text-sm font-medium text-[#a3801d]">
                  {showAllReviews ? t("showLess") : t("showAll")}
                </button>
              )}
            </div>
            {reviews.length === 0 && <p className="text-sm text-gray-500">{t("noReviews")}</p>}
            <div className="space-y-4">
              {shown.map((review) => (
                <div key={review.key} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-[#0F3D2E]">{review.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                  </div>
                  {review.comment && <p className="mb-1 text-sm text-gray-700">{review.comment}</p>}
                  <p className="text-xs text-gray-500">{review.when}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={() => router.push(`/booking/${barber.id}?service=${selected}`)}
          disabled={!canBook}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
        >
          {canBook ? `${t("bookNow")} · ${tzs(barber.prices[selected])}` : t("notAvailable")}
        </Button>
      </div>
    </div>
  );
}
