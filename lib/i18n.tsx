"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "./types";

// Swahili is the default per the PRD. Strings cover the app chrome; service
// names and provider bios carry their own {sw,en} fields in the data.
const dict = {
  // generic
  back: { sw: "Rudi", en: "Back" },
  next: { sw: "Endelea", en: "Next" },
  confirm: { sw: "Thibitisha", en: "Confirm" },
  cancel: { sw: "Ghairi", en: "Cancel" },
  save: { sw: "Hifadhi", en: "Save" },
  search: { sw: "Tafuta", en: "Search" },
  total: { sw: "Jumla", en: "Total" },
  close: { sw: "Funga", en: "Close" },
  continue: { sw: "Endelea", en: "Continue" },

  // roles / launcher
  appTagline: { sw: "Huduma za urembo, mlangoni kwako.", en: "Grooming services, at your door." },
  chooseExperience: { sw: "Chagua sehemu ya kuanza", en: "Choose where to start" },
  customerApp: { sw: "Mteja", en: "Customer" },
  customerAppDesc: { sw: "Agiza huduma nyumbani", en: "Book a service at home" },
  providerApp: { sw: "Mtoa huduma", en: "Provider" },
  providerAppDesc: { sw: "Pokea na simamia kazi", en: "Receive & manage jobs" },
  adminApp: { sw: "Admin", en: "Admin" },
  adminAppDesc: { sw: "Dashibodi ya uendeshaji", en: "Operations dashboard" },
  demoNote: {
    sw: "Toleo la onyesho — taarifa ni za majaribio.",
    en: "Demo build — data is mock.",
  },

  // customer nav
  navHome: { sw: "Nyumbani", en: "Home" },
  navBookings: { sw: "Oda", en: "Bookings" },
  navAccount: { sw: "Akaunti", en: "Account" },

  // home
  greeting: { sw: "Habari", en: "Hi" },
  whatService: { sw: "Unahitaji huduma gani leo?", en: "What do you need today?" },
  categories: { sw: "Aina za huduma", en: "Categories" },
  nearbyProviders: { sw: "Watoa huduma karibu nawe", en: "Providers near you" },
  seeAll: { sw: "Ona zote", en: "See all" },
  online: { sw: "Yupo mtandaoni", en: "Online" },
  busy: { sw: "Ana shughuli", en: "Busy" },
  offline: { sw: "Hayupo", en: "Offline" },

  // services
  barbering: { sw: "Kunyoa", en: "Barbering" },
  grooming: { sw: "Urembo", en: "Grooming" },
  from: { sw: "Kuanzia", en: "From" },

  // provider profile
  reviews: { sw: "maoni", en: "reviews" },
  yearsExp: { sw: "miaka ya uzoefu", en: "yrs experience" },
  jobsDone: { sw: "kazi zilizokamilika", en: "jobs done" },
  nidaVerified: { sw: "Amethibitishwa (NIDA)", en: "NIDA verified" },
  servicesOffered: { sw: "Huduma anazotoa", en: "Services offered" },
  bookNow: { sw: "Agiza sasa", en: "Book now" },

  // booking flow
  book: { sw: "Agiza", en: "Book" },
  stepService: { sw: "Huduma", en: "Service" },
  stepWhen: { sw: "Muda", en: "When" },
  stepWhere: { sw: "Mahali", en: "Where" },
  stepPay: { sw: "Lipa", en: "Pay" },
  whenService: { sw: "Lini unahitaji huduma?", en: "When do you need it?" },
  rightNow: { sw: "Sasa hivi", en: "Right now" },
  within: { sw: "Ndani ya dakika 30–60", en: "Within 30–60 min" },
  schedule: { sw: "Panga muda", en: "Schedule" },
  pickTime: { sw: "Chagua tarehe na saa", en: "Pick date & time" },
  whereService: { sw: "Huduma itolewe wapi?", en: "Where should we come?" },
  savedLocations: { sw: "Mahali ulipohifadhi", en: "Saved locations" },
  addNote: { sw: "Ongeza maelezo ya mahali", en: "Add a location note" },
  notePlaceholder: {
    sw: "mf. Nyumba ya ghorofa tatu, kando ya duka la Mama Happiness",
    en: "e.g. 3-storey house, next to Mama Happiness's shop",
  },
  specialNotes: { sw: "Maelezo ya ziada (hiari)", en: "Special notes (optional)" },
  specialNotesPlaceholder: {
    sw: "mf. Mtoto wangu ana miaka 4",
    en: "e.g. My child is 4 years old",
  },
  paymentMethod: { sw: "Njia ya malipo", en: "Payment method" },
  cashLabel: { sw: "Lipa kwa taslimu", en: "Pay with cash" },
  cashDesc: { sw: "Mlipe mtoa huduma moja kwa moja", en: "Pay the provider directly" },
  priceBreakdown: { sw: "Mchanganuo wa bei", en: "Price breakdown" },
  serviceFee: { sw: "Gharama ya huduma", en: "Service fee" },
  bookingCharge: { sw: "Gharama ya kuagiza", en: "Booking charge" },
  confirmAndPay: { sw: "Thibitisha na ulipe", en: "Confirm & pay" },
  confirmBooking: { sw: "Thibitisha oda", en: "Confirm booking" },

  // booking status / tracking
  bookingConfirmed: { sw: "Oda imethibitishwa!", en: "Booking confirmed!" },
  waitingProvider: { sw: "Tunamtafuta mtoa huduma…", en: "Finding your provider…" },
  statusPending: { sw: "Inasubiri kukubaliwa", en: "Awaiting acceptance" },
  statusAccepted: { sw: "Imekubaliwa", en: "Accepted" },
  statusOnTheWay: { sw: "Yuko njiani", en: "On the way" },
  statusArrived: { sw: "Amefika", en: "Arrived" },
  statusInProgress: { sw: "Kazi inaendelea", en: "In progress" },
  statusCompleted: { sw: "Imekamilika", en: "Completed" },
  statusCancelled: { sw: "Imeghairiwa", en: "Cancelled" },
  trackBooking: { sw: "Fuatilia oda", en: "Track booking" },
  callProvider: { sw: "Piga simu", en: "Call provider" },

  // rating
  rateService: { sw: "Kadiria huduma", en: "Rate the service" },
  howWasIt: { sw: "Huduma ilikuwaje?", en: "How was it?" },
  writeReview: { sw: "Andika maoni (hiari)", en: "Write a review (optional)" },
  submitRating: { sw: "Tuma", en: "Submit" },

  // bookings list
  myBookings: { sw: "Oda zangu", en: "My bookings" },
  active: { sw: "Zinazoendelea", en: "Active" },
  past: { sw: "Zilizopita", en: "Past" },
  noBookings: { sw: "Huna oda bado", en: "No bookings yet" },
  bookAgain: { sw: "Agiza tena", en: "Book again" },
  rate: { sw: "Kadiria", en: "Rate" },

  // account / auth
  account: { sw: "Akaunti", en: "Account" },
  language: { sw: "Lugha", en: "Language" },
  swahili: { sw: "Kiswahili", en: "Swahili" },
  english: { sw: "Kiingereza", en: "English" },
  myLocations: { sw: "Mahali pangu", en: "My locations" },
  referAFriend: { sw: "Mwalike rafiki", en: "Refer a friend" },
  logOut: { sw: "Toka", en: "Log out" },
  signIn: { sw: "Ingia", en: "Sign in" },
  phoneNumber: { sw: "Namba ya simu", en: "Phone number" },
  sendOtp: { sw: "Tuma msimbo", en: "Send code" },
  enterOtp: { sw: "Weka msimbo wa OTP", en: "Enter OTP code" },
  otpSent: { sw: "Tumetuma msimbo kwa SMS", en: "We sent a code by SMS" },
  verify: { sw: "Thibitisha", en: "Verify" },
  yourName: { sw: "Jina lako", en: "Your name" },
  referralOptional: { sw: "Msimbo wa rufaa (hiari)", en: "Referral code (optional)" },
  welcomeToHodi: { sw: "Karibu Hodi", en: "Welcome to Hodi" },
  signInToContinue: { sw: "Ingia ili uendelee", en: "Sign in to continue" },

  // provider app
  pDashboard: { sw: "Dashibodi", en: "Dashboard" },
  pJobs: { sw: "Kazi", en: "Jobs" },
  pEarnings: { sw: "Mapato", en: "Earnings" },
  goOnline: { sw: "Uko mtandaoni", en: "You're online" },
  goOffline: { sw: "Hauko mtandaoni", en: "You're offline" },
  newRequest: { sw: "Ombi jipya la kazi", en: "New job request" },
  accept: { sw: "Kubali", en: "Accept" },
  reject: { sw: "Kataa", en: "Reject" },
  acceptWindow: { sw: "Sekunde za kukubali", en: "to accept" },
  todaysJobs: { sw: "Kazi za leo", en: "Today's jobs" },
  updateStatus: { sw: "Sasisha hali", en: "Update status" },
  markOnTheWay: { sw: "Niko njiani", en: "I'm on the way" },
  markArrived: { sw: "Nimefika", en: "Arrived" },
  markInProgress: { sw: "Anza kazi", en: "Start job" },
  markCompleted: { sw: "Maliza kazi", en: "Complete job" },
  cashReceived: { sw: "Nimepokea taslimu", en: "Cash received" },
  openInMaps: { sw: "Fungua kwenye Ramani", en: "Open in Maps" },
  callCustomer: { sw: "Piga simu kwa mteja", en: "Call customer" },
  todayEarnings: { sw: "Mapato ya leo", en: "Today" },
  weekEarnings: { sw: "Wiki hii", en: "This week" },
  monthEarnings: { sw: "Mwezi huu", en: "This month" },
  netPayout: { sw: "Malipo halisi", en: "Net payout" },
  commission: { sw: "Kamisheni ya jukwaa", en: "Platform commission" },
  available: { sw: "Upatikanaji", en: "Availability" },

  // admin
  overview: { sw: "Muhtasari", en: "Overview" },
  users: { sw: "Watumiaji", en: "Users" },
  providers: { sw: "Watoa huduma", en: "Providers" },
  bookings: { sw: "Oda", en: "Bookings" },
  servicesPricing: { sw: "Huduma & Bei", en: "Services & Pricing" },
  reports: { sw: "Ripoti", en: "Reports" },
} as const;

export type TKey = keyof typeof dict;

interface I18nContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const Ctx = createContext<I18nContext | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sw");

  useEffect(() => {
    const saved = localStorage.getItem("hodi.lang") as Lang | null;
    if (saved === "sw" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("hodi.lang", l);
  };

  const t = (key: TKey) => dict[key][lang];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
