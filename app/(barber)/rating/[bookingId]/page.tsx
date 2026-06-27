"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle } from "lucide-react";
import { Button, Textarea } from "@/components/barber/ui";
import { barbers, tzs } from "@/lib/barber-data";

const tips = [
  { amount: 2000, label: "2,000" },
  { amount: 5000, label: "5,000" },
  { amount: 10000, label: "10,000" },
];

const ratingLabels = ["Tap to rate", "Poor", "Below Average", "Average", "Good", "Excellent!"];

export default function RatingScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push("/home"), 2000);
  };

  if (submitted) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-white px-6">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="mb-3 text-center text-3xl font-bold text-[#0F3D2E]">Thank You!</h1>
        <p className="mb-2 text-center text-lg text-gray-600">Your feedback has been submitted</p>
        <p className="text-center text-sm text-gray-500">We appreciate your time and trust in HODI</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="rounded-b-[32px] bg-[#0F3D2E] px-6 pb-8 pt-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <CheckCircle className="h-10 w-10 text-[#C9A227]" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Service Completed!</h1>
          <p className="text-white/80">How was your experience?</p>
        </div>
      </div>

      <div className="flex-1 space-y-6 px-6 py-6">
        {/* Rating */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-center text-lg font-bold text-[#0F3D2E]">Rate Your Barber</h2>
          <div className="mb-2 flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`h-12 w-12 ${star <= (hoveredRating || rating) ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">{ratingLabels[rating]}</p>
        </div>

        {/* Comment */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">Share Your Experience</h2>
          <Textarea
            placeholder="Tell us what you liked or what could be improved..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-32 resize-none rounded-xl"
          />
        </div>

        {/* Tips */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-[#0F3D2E]">Add a Tip (Optional)</h2>
          <p className="mb-4 text-sm text-gray-600">Show your appreciation for great service</p>
          <div className="mb-3 grid grid-cols-3 gap-3">
            {tips.map((tip) => (
              <button
                key={tip.amount}
                onClick={() => setSelectedTip(tip.amount)}
                className={`rounded-xl py-4 font-semibold transition-all ${selectedTip === tip.amount ? "bg-[#0F3D2E] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
              >
                {tip.label} TZS
              </button>
            ))}
          </div>
          {selectedTip && (
            <button onClick={() => setSelectedTip(null)} className="w-full text-sm text-gray-500 transition-colors hover:text-[#0F3D2E]">
              Remove tip
            </button>
          )}
        </div>

        {/* Barber */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0F3D2E] to-[#0F3D2E]/90 p-6 text-white shadow-sm">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={barbers[0].image} alt="Barber" className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <h3 className="mb-1 text-lg font-bold">{barbers[0].name}</h3>
              <p className="text-sm text-white/80">Your barber today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
        >
          Submit Review{selectedTip ? ` & Tip ${tzs(selectedTip)}` : ""}
        </Button>
      </div>
    </div>
  );
}
