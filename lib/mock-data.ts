import type { Service, Provider, Booking, SavedLocation } from "./types";

// MVP catalog reduced to 4 services per the founder's feedback on the PRD:
// men's haircut, beard, kids' haircut, basic women's styling.
export const services: Service[] = [
  {
    id: "svc_haircut",
    category: "barbering",
    name: { sw: "Kunyoa Nywele (Wanaume)", en: "Men's Haircut" },
    description: {
      sw: "Kunyoa na kupiga deki nywele kwa ustadi.",
      en: "A clean, sharp cut and line-up.",
    },
    minPrice: 5000,
    maxPrice: 15000,
    durationMin: 30,
    durationMax: 45,
    emoji: "💈",
  },
  {
    id: "svc_beard",
    category: "barbering",
    name: { sw: "Kupunguza Ndevu", en: "Beard Trim & Shaping" },
    description: {
      sw: "Kupunguza na kupanga ndevu vizuri.",
      en: "Trim and shape for a tidy beard.",
    },
    minPrice: 3000,
    maxPrice: 8000,
    durationMin: 15,
    durationMax: 25,
    emoji: "🧔🏾",
  },
  {
    id: "svc_kids",
    category: "barbering",
    name: { sw: "Kunyoa Watoto (chini ya 12)", en: "Kids' Haircut (under 12)" },
    description: {
      sw: "Huduma ya upole kwa watoto.",
      en: "A gentle, patient cut for children.",
    },
    minPrice: 3000,
    maxPrice: 8000,
    durationMin: 20,
    durationMax: 30,
    emoji: "🧒🏾",
  },
  {
    id: "svc_styling",
    category: "grooming",
    name: { sw: "Urembo wa Kawaida (Wanawake)", en: "Basic Women's Styling" },
    description: {
      sw: "Kusuka na kupanga nywele — mtindo wa kawaida.",
      en: "Simple styling and finishing — basic looks.",
    },
    minPrice: 10000,
    maxPrice: 25000,
    durationMin: 30,
    durationMax: 60,
    emoji: "💇🏾‍♀️",
  },
];

export const serviceById = (id: string) => services.find((s) => s.id === id)!;

export const providers: Provider[] = [
  {
    id: "prv_juma",
    name: "Juma Mwinyi",
    photo: "brand",
    rating: 4.9,
    reviewCount: 214,
    distanceKm: 1.2,
    status: "online",
    verification: "verified",
    nidaVerified: true,
    serviceIds: ["svc_haircut", "svc_beard", "svc_kids"],
    prices: { svc_haircut: 10000, svc_beard: 5000, svc_kids: 6000 },
    bio: {
      sw: "Kinyozi mwenye uzoefu wa miaka 8, Kinondoni.",
      en: "Experienced barber of 8 years, based in Kinondoni.",
    },
    yearsExperience: 8,
    area: "Kinondoni",
    completedJobs: 612,
  },
  {
    id: "prv_baraka",
    name: "Baraka Joseph",
    photo: "accent",
    rating: 4.7,
    reviewCount: 98,
    distanceKm: 2.6,
    status: "online",
    verification: "verified",
    nidaVerified: true,
    serviceIds: ["svc_haircut", "svc_beard"],
    prices: { svc_haircut: 8000, svc_beard: 4000 },
    bio: {
      sw: "Mtaalamu wa deki na ndevu, Mbezi Beach.",
      en: "Specialist in line-ups and beards, Mbezi Beach.",
    },
    yearsExperience: 5,
    area: "Mbezi Beach",
    completedJobs: 274,
  },
  {
    id: "prv_neema",
    name: "Neema Hassan",
    photo: "purple",
    rating: 4.8,
    reviewCount: 156,
    distanceKm: 3.1,
    status: "busy",
    verification: "verified",
    nidaVerified: true,
    serviceIds: ["svc_styling", "svc_kids"],
    prices: { svc_styling: 18000, svc_kids: 7000 },
    bio: {
      sw: "Mrembo wa nywele za wanawake na watoto, Ilala.",
      en: "Women's and kids' stylist, based in Ilala.",
    },
    yearsExperience: 6,
    area: "Ilala",
    completedJobs: 389,
  },
  {
    id: "prv_amani",
    name: "Amani Kileo",
    photo: "blue",
    rating: 4.6,
    reviewCount: 61,
    distanceKm: 4.4,
    status: "online",
    verification: "verified",
    nidaVerified: true,
    serviceIds: ["svc_haircut", "svc_kids", "svc_beard"],
    prices: { svc_haircut: 9000, svc_kids: 5000, svc_beard: 5000 },
    bio: {
      sw: "Kinyozi kijana, mhitimu wa VETA, Kariakoo.",
      en: "Young barber, VETA graduate, Kariakoo.",
    },
    yearsExperience: 3,
    area: "Kariakoo",
    completedJobs: 142,
  },
  {
    id: "prv_zawadi",
    name: "Zawadi Mushi",
    photo: "rose",
    rating: 4.9,
    reviewCount: 203,
    distanceKm: 5.8,
    status: "offline",
    verification: "verified",
    nidaVerified: true,
    serviceIds: ["svc_styling"],
    prices: { svc_styling: 22000 },
    bio: {
      sw: "Mtaalamu wa mitindo ya nywele, Masaki.",
      en: "Styling professional, Masaki.",
    },
    yearsExperience: 9,
    area: "Masaki",
    completedJobs: 511,
  },
];

// One provider that is "pending" verification — used by the admin panel demo.
export const pendingProvider: Provider = {
  id: "prv_rehema",
  name: "Rehema Salum",
  photo: "amber",
  rating: 0,
  reviewCount: 0,
  distanceKm: 0,
  status: "offline",
  verification: "pending",
  nidaVerified: false,
  serviceIds: ["svc_styling", "svc_kids"],
  prices: { svc_styling: 15000, svc_kids: 6000 },
  bio: {
    sw: "Mhitimu mpya wa VETA, anasubiri uthibitisho.",
    en: "New VETA graduate, awaiting verification.",
  },
  yearsExperience: 1,
  area: "Temeke",
  completedJobs: 0,
};

export const providerById = (id: string) =>
  [...providers, pendingProvider].find((p) => p.id === id)!;

export const defaultLocations: SavedLocation[] = [
  {
    id: "loc_home",
    label: "Nyumbani",
    landmark: "Karibu na Shoppers Plaza, Mbezi Beach",
    note: "Nyumba ya ghorofa mbili, lango la kijani",
    lat: -6.74,
    lng: 39.18,
  },
  {
    id: "loc_office",
    label: "Ofisi",
    landmark: "Mlimani City, Sam Nujoma Rd",
    lat: -6.77,
    lng: 39.22,
  },
];

export const BOOKING_CHARGE = 2000;
export const COMMISSION_RATE = 0.18; // 18% — within the admin-configurable 15–20%

// Seed bookings for the demo (history + an active one + an incoming request).
export const seedBookings: Booking[] = [
  {
    id: "bk_1000",
    serviceId: "svc_haircut",
    providerId: "prv_juma",
    customerName: "Daudi K.",
    customerPhone: "+255 754 222 333",
    location: {
      id: "loc_req",
      label: "Nyumbani",
      landmark: "Karibu na Mlimani City, Sam Nujoma Rd",
      note: "Geti la bluu, ghorofa ya pili",
      lat: -6.77,
      lng: 39.22,
    },
    scheduledFor: "now",
    notes: "Naomba uje haraka kidogo",
    servicePrice: 10000,
    bookingCharge: BOOKING_CHARGE,
    total: 12000,
    paymentMethod: "mpesa",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 40).toISOString(),
  },
  {
    id: "bk_1001",
    serviceId: "svc_haircut",
    providerId: "prv_juma",
    customerName: "Asha M.",
    customerPhone: "+255 712 000 111",
    location: defaultLocations[0],
    scheduledFor: "now",
    notes: "",
    servicePrice: 10000,
    bookingCharge: BOOKING_CHARGE,
    total: 12000,
    paymentMethod: "mpesa",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    review: { rating: 5, comment: "Kazi safi sana!", createdAt: new Date().toISOString() },
  },
  {
    id: "bk_1002",
    serviceId: "svc_beard",
    providerId: "prv_baraka",
    customerName: "Asha M.",
    customerPhone: "+255 712 000 111",
    location: defaultLocations[1],
    scheduledFor: "now",
    notes: "",
    servicePrice: 4000,
    bookingCharge: BOOKING_CHARGE,
    total: 6000,
    paymentMethod: "cash",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    review: { rating: 4, createdAt: new Date().toISOString() },
  },
];

// Icon name (see components/Icon.tsx) per service and category.
export const serviceIcons: Record<string, string> = {
  svc_haircut: "scissors",
  svc_beard: "razor",
  svc_kids: "child",
  svc_styling: "sparkles",
};
export const categoryIcons: Record<string, string> = {
  barbering: "scissors",
  grooming: "sparkles",
};

// Avatar gradient keys keyed by Provider.photo (consumed by <Avatar color=…>).
export const avatarColors: Record<string, string> = {
  brand: "brand",
  accent: "accent",
  purple: "purple",
  blue: "blue",
  rose: "rose",
  amber: "amber",
};
