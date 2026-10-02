"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle } from "lucide-react";
import { Button, Textarea } from "@/components/barber/ui";
import { Protected, ProviderPhoto } from "@/components/barber/shell";
import { useI18n, TKey } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { tzs } from "@/lib/format";

const TIPS = [2000, 5000, 10000];
const RATING_LABELS: TKey[] = ["tapToRate", "r1", "r2", "r3", "r4", "r5"];

export default function RatingPage({ params }: { params: { bookingId: string } }) {
  return (
    <Protected>
      <RatingScreen id={params.bookingId} />
    </Protected>
  );
}

function RatingScreen({ id }: { id: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const { bookings, providers, profile, rateBooking } = useStore();
  const booking = bookings.find((b) => b.id === id && b.customerPhone === profile.phone);

  const [rating, setRating] = useState(booking?.review?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(booking?.review?.comment ?? "");
  const [tip, setTip] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!booking) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-gray-600">{t("bookingNotFound")}</p>
        <Button onClick={() => router.push("/home")} className="h-12 rounded-full bg-[#0F3D2E] px-6 text-white">
          {t("backHome")}
        </Button>
      </div>
    );
  }

  const barber = providers.find((p) => p.id === booking.providerId)!;

  const submit = () => {
    rateBooking(
      booking.id,
      { rating, comment: comment.trim() || undefined, createdAt: new Date().toISOString() },
      tip ?? undefined,
    );
    setSubmitted(true);
    setTimeout(() => router.replace("/home"), 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6">
        <div className="mb-6 flex h-24 w-24 animate-fade-up items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="mb-3 text-center text-3xl font-bold text-[#0F3D2E]">{t("thankYou")}</h1>
        <p className="mb-2 text-center text-lg text-gray-600">{t("feedbackSent")}</p>
        <p className="text-center text-sm text-gray-500">{t("appreciate")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <div className="rounded-b-[32px] bg-[#0F3D2E] px-6 pb-8 pt-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <CheckCircle className="h-10 w-10 text-[#C9A227]" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">{t("serviceCompleted")}</h1>
          <p className="text-white/80">{t("howWasExperience")}</p>
        </div>
      </div>

      <div className="flex-1 space-y-5 px-6 py-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-center text-lg font-bold text-[#0F3D2E]">{t("rateYourBarber")}</h2>
          <div className="mb-2 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                aria-label={`${star}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star className={`h-11 w-11 ${star <= (hovered || rating) ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">{t(RATING_LABELS[hovered || rating])}</p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">{t("shareExperience")}</h2>
          <Textarea
            placeholder={t("reviewPh")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            className="min-h-32 resize-none rounded-xl"
          />
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-[#0F3D2E]">{t("addTip")}</h2>
          <p className="mb-4 text-sm text-gray-600">{t("tipDesc")}</p>
          <div className="mb-3 grid grid-cols-3 gap-3">
            {TIPS.map((amount) => (
              <button
                key={amount}
                onClick={() => setTip(tip === amount ? null : amount)}
                className={`rounded-xl py-4 text-sm font-semibold transition-all ${
                  tip === amount ? "bg-[#0F3D2E] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {amount.toLocaleString()} TZS
              </button>
            ))}
          </div>
          {tip && (
            <button onClick={() => setTip(null)} className="w-full text-sm text-gray-500 transition-colors hover:text-[#0F3D2E]">
              {t("removeTip")}
            </button>
          )}
        </section>

        <section className="rounded-2xl bg-gradient-to-r from-[#0F3D2E] to-[#14543f] p-6 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <ProviderPhoto provider={barber} className="h-16 w-16 rounded-2xl text-lg" />
            <div>
              <h3 className="mb-1 text-lg font-bold">{barber.name}</h3>
              <p className="text-sm text-white/80">{t("yourBarberToday")}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={submit}
          disabled={rating === 0}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
        >
          {t("submitReview")}
          {tip ? ` ${t("andTip")} ${tzs(tip)}` : ""}
        </Button>
      </div>
    </div>
  );
}
