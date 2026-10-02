import type { Service, Lang } from "./types";

/** Format a number as Tanzanian Shillings, e.g. 12000 -> "TZS 12,000". */
export function tzs(amount: number): string {
  return "TZS " + amount.toLocaleString("en-US");
}

export function priceRange(service: Service): string {
  return `${tzs(service.minPrice)} – ${tzs(service.maxPrice)}`;
}

export function durationRange(service: Service): string {
  return `${service.durationMin}–${service.durationMax} min`;
}

export function localized(value: { sw: string; en: string }, lang: Lang): string {
  return value[lang];
}

/** Relative-ish time label for the mock data. */
export function timeAgo(iso: string, lang: Lang): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return lang === "sw" ? "sasa hivi" : "just now";
  if (mins < 60) return lang === "sw" ? `dakika ${mins} zilizopita` : `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return lang === "sw" ? `saa ${hrs} zilizopita` : `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return lang === "sw" ? `siku ${days} zilizopita` : `${days}d ago`;
}

export function formatDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "Today, 14:00" / "Leo, 14:00" style label for a scheduled ISO time. */
export function formatWhen(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const time = d.toLocaleTimeString(lang === "sw" ? "sw-TZ" : "en-GB", { hour: "2-digit", minute: "2-digit" });
  const day = same(d, today)
    ? lang === "sw" ? "Leo" : "Today"
    : same(d, tomorrow)
      ? lang === "sw" ? "Kesho" : "Tomorrow"
      : d.toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  return `${day}, ${time}`;
}

export function formatDateTime(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleString(lang === "sw" ? "sw-TZ" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Human receipt number derived from a booking id, e.g. bk_x7a2q1 -> HD-X7A2Q1. */
export function receiptNo(bookingId: string): string {
  return "HD-" + bookingId.replace(/^bk_/, "").toUpperCase();
}
