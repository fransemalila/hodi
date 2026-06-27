"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, MessageSquare, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { barbers } from "@/lib/barber-data";

const barber = barbers[0];

export default function LiveTrackingScreen({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const [eta, setEta] = useState(12);
  const [status, setStatus] = useState<"on_way" | "arrived">("on_way");

  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          setStatus("arrived");
          return 0;
        }
        return prev - 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-full bg-gray-50">
      {/* Map Area */}
      <div className="relative h-[60vh] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1638447841552-8194177a5536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMG1hcCUyMG5hdmlnYXRpb258ZW58MXx8fHwxNzcxODU3MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Map"
            className="h-full w-full object-cover opacity-50"
          />
        </div>

        {/* Barber Location Marker */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-[#0F3D2E] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={barber.image} alt={barber.name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#C9A227]">
              <Navigation className="h-4 w-4 rotate-45 text-white" />
            </div>
          </div>
        </div>

        {/* Your Location Marker */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#0F3D2E] shadow-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Route Line */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <line x1="50%" y1="33%" x2="50%" y2="calc(100% - 80px)" stroke="#0F3D2E" strokeWidth="3" strokeDasharray="10,10" opacity="0.5" />
        </svg>
      </div>

      {/* Status Card */}
      <div className="absolute left-6 right-6 top-12 rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm text-gray-600">{status === "on_way" ? "Barber is on the way" : "Barber has arrived!"}</p>
            <p className="text-2xl font-bold text-[#0F3D2E]">{status === "on_way" ? `${eta} min` : "Ready to serve"}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10">
            {status === "on_way" ? <Navigation className="h-8 w-8 text-[#C9A227]" /> : <MapPin className="h-8 w-8 text-[#C9A227]" />}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 rounded-t-[32px] bg-white shadow-2xl">
        <div className="px-6 pb-8 pt-6">
          <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-300" />
          <div className="mb-6 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={barber.image} alt={barber.name} className="h-16 w-16 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-bold text-[#0F3D2E]">{barber.name}</h3>
              <p className="text-sm text-gray-600">{barber.vehicle}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3D2E] transition-colors hover:bg-[#0F3D2E]/90">
                <Phone className="h-5 w-5 text-white" />
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227] transition-colors hover:bg-[#C9A227]/90">
                <MessageSquare className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-gray-600">Service</span>
              <span className="font-semibold text-[#0F3D2E]">Haircut + Beard</span>
            </div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold text-[#0F3D2E]">Today, 02:00 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Location</span>
              <span className="font-semibold text-[#0F3D2E]">Masaki, DSM</span>
            </div>
          </div>

          {status === "arrived" && (
            <Button
              onClick={() => router.push(`/payment/${params.bookingId}`)}
              className="mb-3 h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90"
            >
              Service Complete - Proceed to Payment
            </Button>
          )}
          <Button
            onClick={() => router.push("/home")}
            className="h-14 w-full rounded-full border-2 border-[#0F3D2E] text-lg text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
