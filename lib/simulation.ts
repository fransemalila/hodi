"use client";

import { useEffect, useState } from "react";
import { useStore } from "./store";
import type { Booking, BookingStatus } from "./types";

// Demo-only: until the backend pushes real status events, the customer app
// moves an on-demand booking through its lifecycle on a timer. The provider
// app (same browser, any tab) can still advance it manually at any point.

/** Seconds spent in each status before auto-advancing. */
const STEP: Partial<Record<BookingStatus, { next: BookingStatus; secs: number }>> = {
  pending: { next: "accepted", secs: 4 },
  accepted: { next: "on_the_way", secs: 4 },
  on_the_way: { next: "arrived", secs: 36 },
  arrived: { next: "in_progress", secs: 6 },
  in_progress: { next: "completed", secs: 15 },
};

/** Minutes shown as the ETA when the barber sets off. */
export const START_ETA_MIN = 12;

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function useBookingSimulation(booking: Booking | undefined) {
  const { advanceStatus } = useStore();
  const now = useNow();

  const since = booking ? (now - new Date(booking.updatedAt ?? booking.createdAt).getTime()) / 1000 : 0;
  const step = booking ? STEP[booking.status] : undefined;
  // Scheduled bookings stop at "accepted" until their time (or a manual nudge).
  const holds = booking?.scheduledFor !== "now" && booking?.status === "accepted";

  useEffect(() => {
    if (!booking || !step || holds) return;
    if (since >= step.secs) advanceStatus(booking.id, step.next);
  }, [booking, step, holds, since, advanceStatus]);

  const travelSecs = STEP.on_the_way!.secs;
  const progress =
    booking?.status === "on_the_way"
      ? Math.min(since / travelSecs, 1)
      : booking && ["arrived", "in_progress", "completed"].includes(booking.status)
        ? 1
        : 0;
  const etaMin = Math.max(1, Math.ceil(START_ETA_MIN * (1 - progress)));

  return { progress, etaMin };
}
