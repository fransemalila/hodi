"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Star, MapPin, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { barberById, reviews } from "@/lib/barber-data";

export default function BarberProfileScreen({ params }: { params: { id: string } }) {
  const router = useRouter();
  const barber = barberById(params.id);

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <div className="flex-1">
        {/* Header Image */}
        <div className="relative h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={barber.image} alt={barber.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="mb-2 text-3xl font-bold text-white">{barber.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
                <Star className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                <span className="font-semibold text-white">{barber.rating}</span>
                <span className="text-sm text-white/80">({barber.reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{barber.distance} away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <Award className="mb-2 h-6 w-6 text-[#C9A227]" />
              <p className="text-2xl font-bold text-[#0F3D2E]">{barber.experience}</p>
              <p className="text-sm text-gray-600">Experience</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <CheckCircle className="mb-2 h-6 w-6 text-[#C9A227]" />
              <p className="text-2xl font-bold text-[#0F3D2E]">{barber.completedJobs}+</p>
              <p className="text-sm text-gray-600">Jobs Completed</p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#0F3D2E]">About</h2>
            <p className="leading-relaxed text-gray-700">{barber.about}</p>
          </div>

          <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#0F3D2E]">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {barber.specialties.map((s, i) => (
                <span key={i} className="rounded-full bg-[#0F3D2E]/5 px-4 py-2 text-sm font-medium text-[#0F3D2E]">{s}</span>
              ))}
            </div>
          </div>

          <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#0F3D2E]">Portfolio</h2>
            <div className="grid grid-cols-3 gap-3">
              {barber.portfolio.map((image, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={image} alt={`Portfolio ${i + 1}`} className="h-24 w-full rounded-xl object-cover" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F3D2E]">Reviews</h2>
              <button className="text-sm font-medium text-[#C9A227]">See All</button>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-[#0F3D2E]">{review.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="mb-1 text-sm text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={() => router.push(`/booking/${barber.id}`)}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
