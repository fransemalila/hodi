"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Button, Textarea } from "./ui";
import { Icon } from "./Icon";

export function RatingSheet({
  bookingId,
  onClose,
}: {
  bookingId: string;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { rateBooking } = useStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  function submit() {
    rateBooking(bookingId, {
      rating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-md rounded-t-3xl bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/10" />
        <h2 className="text-center text-lg font-extrabold">{t("howWasIt")}</h2>
        <div className="my-5 flex justify-center gap-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="transition active:scale-90"
              style={{ color: n <= rating ? "#f97e15" : "#dfe5e2" }}
              aria-label={`${n} stars`}
            >
              <Icon name="star" filled size={36} strokeWidth={0} />
            </button>
          ))}
        </div>
        <Textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("writeReview")}
        />
        <Button onClick={submit} className="mt-4 w-full">
          {t("submitRating")}
        </Button>
      </div>
    </div>
  );
}
