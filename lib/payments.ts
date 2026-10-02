import type { PaymentMethod } from "./types";

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  /** Short mark shown in the coloured tile. */
  short: string;
  tile: string;
  mobileMoney: boolean;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "mpesa", name: "M-Pesa", short: "M", tile: "bg-gradient-to-br from-red-500 to-red-600", mobileMoney: true },
  { id: "airtel", name: "Airtel Money", short: "A", tile: "bg-gradient-to-br from-rose-600 to-red-700", mobileMoney: true },
  { id: "tigopesa", name: "Tigo Pesa", short: "T", tile: "bg-gradient-to-br from-sky-500 to-blue-700", mobileMoney: true },
  { id: "halopesa", name: "HaloPesa", short: "H", tile: "bg-gradient-to-br from-orange-400 to-orange-600", mobileMoney: true },
  { id: "cash", name: "Cash", short: "TZS", tile: "bg-gradient-to-br from-[#0F3D2E] to-[#246b52]", mobileMoney: false },
];

export const paymentName = (id: PaymentMethod, lang: "sw" | "en" = "en") =>
  id === "cash" ? (lang === "sw" ? "Taslimu" : "Cash") : (PAYMENT_OPTIONS.find((p) => p.id === id)?.name ?? id);
