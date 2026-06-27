"use client";

import { useRouter } from "next/navigation";
import { Scissors, Star, MapPin, Clock, History, Menu } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { services, barbers, tzs } from "@/lib/barber-data";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="rounded-b-[32px] bg-[#0F3D2E] px-6 pb-8 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm text-[#C9A227]">Karibu,</p>
            <h1 className="text-2xl font-bold text-white">John Doe</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/history")} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
              <History className="h-5 w-5 text-white" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 text-white/80">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">Masaki, Dar es Salaam</span>
        </div>

        <Button onClick={() => router.push("/barber/1")} className="h-14 w-full rounded-full bg-[#C9A227] text-lg font-semibold text-[#0F3D2E] hover:bg-[#C9A227]/90">
          <Scissors className="mr-2 h-5 w-5" />
          Book a Barber
        </Button>
      </div>

      {/* Services */}
      <div className="px-6 py-6">
        <h2 className="mb-4 text-xl font-bold text-[#0F3D2E]">Services</h2>
        <div className="mb-6 grid grid-cols-3 gap-3">
          {services.map((service) => (
            <button key={service.id} className="rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 text-3xl">{service.icon}</div>
              <p className="mb-1 text-xs font-medium leading-tight text-gray-700">{service.name}</p>
              <p className="text-xs font-semibold text-[#C9A227]">{tzs(service.price)}</p>
            </button>
          ))}
        </div>

        {/* Available Barbers */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0F3D2E]">Available Barbers</h2>
          <button className="text-sm font-medium text-[#C9A227]">See All</button>
        </div>

        <div className="space-y-4">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              onClick={() => router.push(`/barber/${barber.id}`)}
              className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex gap-4">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={barber.image} alt={barber.name} className="h-20 w-20 rounded-2xl object-cover" />
                  {barber.available && (
                    <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-[#0F3D2E]">{barber.name}</h3>
                  <div className="mb-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                    <span className="text-sm font-medium text-gray-700">{barber.rating}</span>
                    <span className="text-sm text-gray-500">({barber.reviews})</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{barber.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{barber.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${barber.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {barber.available ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
