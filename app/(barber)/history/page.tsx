"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { bookingHistory } from "@/lib/barber-data";

export default function BookingHistoryScreen() {
  const router = useRouter();
  const totalSpent = bookingHistory.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="min-h-full bg-gray-50 pb-6">
      {/* Header */}
      <div className="rounded-b-[32px] bg-[#0F3D2E] px-6 pb-6 pt-12">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/home")} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Booking History</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-1 text-3xl font-bold text-[#0F3D2E]">{bookingHistory.length}</p>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-1 text-3xl font-bold text-[#0F3D2E]">{totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Spent (TZS)</p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {bookingHistory.map((booking) => (
            <div key={booking.id} className="rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booking.barberImage} alt={booking.barberName} className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="mb-1 font-bold text-[#0F3D2E]">{booking.barberName}</h3>
                  <p className="mb-2 font-medium text-gray-700">{booking.service}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < booking.rating ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#0F3D2E]">{booking.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">TZS</p>
                </div>
              </div>

              <div className="mb-4 space-y-2 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{booking.date}</span>
                  <Clock className="ml-2 h-4 w-4 text-gray-500" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{booking.location}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => router.push("/barber/1")} className="h-11 flex-1 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90">
                  Rebook
                </Button>
                <Button className="h-11 flex-1 rounded-full border-2 border-[#0F3D2E] text-[#0F3D2E] hover:bg-[#0F3D2E]/5">
                  View Receipt
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
