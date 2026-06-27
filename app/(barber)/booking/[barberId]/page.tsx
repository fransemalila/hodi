"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, FileText } from "lucide-react";
import { Button, Textarea } from "@/components/barber/ui";
import { services, timeSlots, SERVICE_FEE, tzs } from "@/lib/barber-data";

export default function BookingScreen({ params }: { params: { barberId: string } }) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("02:00 PM");
  const [location] = useState("Masaki, Dar es Salaam");
  const [notes, setNotes] = useState("");

  const total = selectedService.price + SERVICE_FEE;

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#0F3D2E] px-6 pb-6 pt-12">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
        </div>
      </div>

      <div className="flex-1 space-y-6 px-6 py-6">
        {/* Select Service */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">Select Service</h2>
          <div className="space-y-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`flex w-full items-center justify-between rounded-xl p-4 transition-all ${
                  selectedService.id === service.id ? "bg-[#0F3D2E] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="font-medium">{service.name}</span>
                <span className="font-semibold">{tzs(service.price)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Select Date */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0F3D2E]">
            <Calendar className="h-5 w-5" /> Select Date
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {["Today", "Tomorrow", "Feb 26", "Feb 27"].map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`rounded-xl py-3 font-medium transition-all ${selectedDate === date ? "bg-[#0F3D2E] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* Select Time */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0F3D2E]">
            <Clock className="h-5 w-5" /> Select Time
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`rounded-xl py-3 text-sm font-medium transition-all ${selectedTime === time ? "bg-[#0F3D2E] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0F3D2E]">
            <MapPin className="h-5 w-5" /> Your Location
          </h2>
          <div className="mb-3 rounded-xl bg-gray-50 p-4">
            <p className="font-medium text-gray-700">{location}</p>
          </div>
          <button className="text-sm font-medium text-[#C9A227] hover:underline">Change Location</button>
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0F3D2E]">
            <FileText className="h-5 w-5" /> Additional Notes
          </h2>
          <Textarea
            placeholder="E.g., Apartment number, gate code, special requests..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-24 resize-none rounded-xl"
          />
        </div>

        {/* Price Summary */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">Price Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>{selectedService.name}</span>
              <span className="font-medium">{tzs(selectedService.price)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Service Fee</span>
              <span className="font-medium">{tzs(SERVICE_FEE)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span className="font-bold text-[#0F3D2E]">Total</span>
              <span className="text-xl font-bold text-[#0F3D2E]">{tzs(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={() => router.push("/tracking/1")}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90"
        >
          Confirm Booking - {tzs(total)}
        </Button>
      </div>
    </div>
  );
}
