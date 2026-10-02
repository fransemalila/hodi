// Domain types for Hodi. These mirror what the real backend API will return,
// so screens built against mock data won't need rewriting when the API lands.

export type Lang = "sw" | "en";

export type ServiceCategory = "barbering" | "grooming";

export interface Service {
  id: string;
  category: ServiceCategory;
  name: { sw: string; en: string };
  description: { sw: string; en: string };
  /** Price range in TZS (provider sets their own within admin min/max). */
  minPrice: number;
  maxPrice: number;
  durationMin: number;
  durationMax: number;
  emoji: string;
}

export type ProviderStatus = "online" | "busy" | "offline";
export type VerificationStatus = "pending" | "verified" | "suspended";

export interface Provider {
  id: string;
  name: string;
  photo: string; // initials-based avatar colour key
  rating: number;
  reviewCount: number;
  distanceKm: number;
  status: ProviderStatus;
  verification: VerificationStatus;
  nidaVerified: boolean;
  serviceIds: string[];
  /** Provider's own price per service id, within the admin range. */
  prices: Record<string, number>;
  bio: { sw: string; en: string };
  yearsExperience: number;
  area: string;
  completedJobs: number;
  /** Profile photo URL. Falls back to an initials avatar when absent. */
  image?: string;
  portfolio?: string[];
  specialties?: { sw: string; en: string }[];
  phone?: string;
  /** How they travel to the customer, e.g. "Boda boda · MC 123 ABC". */
  vehicle?: string;
}

export interface SavedLocation {
  id: string;
  label: string; // e.g. "Nyumbani", "Ofisi"
  landmark: string;
  note?: string;
  lat: number;
  lng: number;
}

export type PaymentMethod = "mpesa" | "tigopesa" | "airtel" | "halopesa" | "cash";

export type PaymentStatus = "unpaid" | "paid";

export type BookingStatus =
  | "pending" // waiting for provider to accept
  | "accepted"
  | "on_the_way"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Review {
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  providerId: string;
  customerName: string;
  customerPhone: string;
  location: SavedLocation;
  scheduledFor: "now" | string; // ISO string for scheduled
  notes?: string;
  servicePrice: number;
  bookingCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paidAt?: string;
  /** Mobile-money number the STK push was sent to. */
  payerPhone?: string;
  tip?: number;
  status: BookingStatus;
  createdAt: string;
  /** Last time the status changed; drives the live-tracking simulation. */
  updatedAt?: string;
  cancelledBy?: "customer" | "provider" | "admin";
  review?: Review;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  lang: Lang;
  referralCode?: string;
  locations: SavedLocation[];
  /** Id of the location used by default when booking. */
  defaultLocationId?: string;
}
