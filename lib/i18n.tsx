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


  // ── customer app ──────────────────────────────────────────────
  tagline: { sw: "Tunakuletea kinyozi mlangoni", en: "We bring the barber to your door" },
  skip: { sw: "Ruka", en: "Skip" },
  getStarted: { sw: "Anza sasa", en: "Get started" },
  ob1Title: { sw: "Agiza kinyozi wakati wowote", en: "Request a barber anytime" },
  ob1Desc: { sw: "Vinyozi wataalamu waliothibitishwa, tayari kukuhudumia popote ulipo.", en: "Verified professional barbers, ready to serve you wherever you are." },
  ob2Title: { sw: "Fuatilia hadi mlangoni", en: "Track arrival to your door" },
  ob2Desc: { sw: "Ona kinyozi wako akija moja kwa moja, ujue atafika lini.", en: "Follow your barber live so you know exactly when they'll arrive." },
  ob3Title: { sw: "Lipa kwa simu kwa urahisi", en: "Pay easily with mobile money" },
  ob3Desc: { sw: "M-Pesa, Airtel Money, Tigo Pesa, HaloPesa au taslimu.", en: "M-Pesa, Airtel Money, Tigo Pesa, HaloPesa or cash." },

  welcomeBack: { sw: "Karibu", en: "Welcome" },
  enterPhone: { sw: "Weka namba yako ya simu ili uendelee", en: "Enter your phone number to continue" },
  invalidPhone: { sw: "Weka namba sahihi ya simu (mf. 712 345 678)", en: "Enter a valid number (e.g. 712 345 678)" },
  otpSentTo: { sw: "Tumetuma msimbo wa tarakimu 6 kwa", en: "We sent a 6-digit code to" },
  demoOtpHint: { sw: "Onyesho: weka tarakimu 6 zozote", en: "Demo: enter any 6 digits" },
  resendIn: { sw: "Tuma tena baada ya", en: "Resend in" },
  resendCode: { sw: "Tuma msimbo tena", en: "Resend code" },
  changeNumber: { sw: "Badilisha namba", en: "Change number" },
  whatsYourName: { sw: "Tukuite nani?", en: "What should we call you?" },
  nameHint: { sw: "Kinyozi wako ataona jina hili", en: "Your barber will see this name" },
  termsPrefix: { sw: "Kwa kuendelea, unakubali", en: "By continuing, you agree to our" },
  terms: { sw: "Masharti", en: "Terms" },
  and: { sw: "na", en: "and" },
  privacy: { sw: "Sera ya Faragha", en: "Privacy Policy" },

  karibu: { sw: "Karibu,", en: "Welcome," },
  bookABarber: { sw: "Agiza kinyozi", en: "Book a barber" },
  servicesTitle: { sw: "Huduma", en: "Services" },
  all: { sw: "Zote", en: "All" },
  availableBarbers: { sw: "Vinyozi walio karibu", en: "Barbers near you" },
  searchBarbers: { sw: "Tafuta kinyozi au eneo", en: "Search barber or area" },
  noMatch: { sw: "Hakuna kinyozi anayelingana", en: "No barbers match" },
  activeBooking: { sw: "Oda inaendelea", en: "Booking in progress" },
  view: { sw: "Ona", en: "View" },
  away: { sw: "kutoka kwako", en: "away" },
  serviceAt: { sw: "Huduma itafanyika", en: "Service at" },

  experience: { sw: "Uzoefu", en: "Experience" },
  years: { sw: "miaka", en: "years" },
  jobsCompleted: { sw: "Kazi zilizokamilika", en: "Jobs completed" },
  about: { sw: "Kuhusu", en: "About" },
  specialties: { sw: "Utaalamu", en: "Specialties" },
  portfolio: { sw: "Kazi zake", en: "Portfolio" },
  reviewsTitle: { sw: "Maoni", en: "Reviews" },
  noReviews: { sw: "Hakuna maoni bado", en: "No reviews yet" },
  servicesPrices: { sw: "Huduma na bei", en: "Services & prices" },
  notAvailable: { sw: "Hapatikani kwa sasa", en: "Not available right now" },
  daysAgo: { sw: "siku zilizopita", en: "days ago" },
  showAll: { sw: "Ona zote", en: "Show all" },
  showLess: { sw: "Punguza", en: "Show less" },

  bookAppointment: { sw: "Agiza huduma", en: "Book appointment" },
  selectService: { sw: "Chagua huduma", en: "Select service" },
  selectDate: { sw: "Chagua siku", en: "Select date" },
  selectTime: { sw: "Chagua saa", en: "Select time" },
  today: { sw: "Leo", en: "Today" },
  tomorrow: { sw: "Kesho", en: "Tomorrow" },
  yourLocation: { sw: "Mahali pako", en: "Your location" },
  addLocation: { sw: "Ongeza mahali", en: "Add location" },
  locationLabel: { sw: "Jina la mahali", en: "Label" },
  locationLabelPh: { sw: "mf. Nyumbani, Ofisi", en: "e.g. Home, Office" },
  landmark: { sw: "Alama ya karibu / mtaa", en: "Landmark / street" },
  landmarkPh: { sw: "mf. Karibu na Shoppers Plaza, Mikocheni", en: "e.g. Near Shoppers Plaza, Mikocheni" },
  locationNote: { sw: "Maelezo ya kufika (hiari)", en: "Directions (optional)" },
  additionalNotes: { sw: "Maelezo ya ziada", en: "Additional notes" },
  notesPh: { sw: "mf. Namba ya nyumba, geti, maombi maalum…", en: "e.g. House number, gate code, special requests…" },
  priceSummary: { sw: "Muhtasari wa bei", en: "Price summary" },
  noSlots: { sw: "Hakuna nafasi leo. Chagua siku nyingine.", en: "No slots left today. Pick another day." },
  addLocationFirst: { sw: "Ongeza mahali kwanza", en: "Add a location first" },

  findingBarber: { sw: "Tunamthibitisha kinyozi…", en: "Confirming your barber…" },
  acceptedTitle: { sw: "Amekubali oda yako", en: "Your barber accepted" },
  onTheWayTitle: { sw: "Kinyozi yuko njiani", en: "Barber is on the way" },
  arrivedTitle: { sw: "Kinyozi amefika!", en: "Your barber has arrived!" },
  inProgressTitle: { sw: "Huduma inaendelea", en: "Service in progress" },
  completedTitle: { sw: "Huduma imekamilika", en: "Service complete" },
  cancelledTitle: { sw: "Oda imeghairiwa", en: "Booking cancelled" },
  scheduledTitle: { sw: "Oda imepangwa", en: "Booking scheduled" },
  minutes: { sw: "dakika", en: "min" },
  readyToServe: { sw: "Tayari kukuhudumia", en: "Ready to serve" },
  getsReady: { sw: "Anajiandaa kuondoka", en: "Getting ready to leave" },
  enjoy: { sw: "Furahia huduma yako", en: "Enjoy your service" },
  cancelBooking: { sw: "Ghairi oda", en: "Cancel booking" },
  cancelConfirm: { sw: "Una uhakika unataka kughairi oda hii?", en: "Are you sure you want to cancel this booking?" },
  keepBooking: { sw: "Hapana, endelea", en: "No, keep it" },
  yesCancel: { sw: "Ndiyo, ghairi", en: "Yes, cancel" },
  proceedToPayment: { sw: "Endelea kulipa", en: "Proceed to payment" },
  backHome: { sw: "Rudi nyumbani", en: "Back to home" },
  service: { sw: "Huduma", en: "Service" },
  time: { sw: "Muda", en: "Time" },
  location: { sw: "Mahali", en: "Location" },
  message: { sw: "Ujumbe", en: "Message" },
  bookingNotFound: { sw: "Oda haikupatikana", en: "Booking not found" },

  payment: { sw: "Malipo", en: "Payment" },
  paymentSummary: { sw: "Muhtasari wa malipo", en: "Payment summary" },
  totalAmount: { sw: "Jumla ya kulipa", en: "Total amount" },
  selectPaymentMethod: { sw: "Chagua njia ya malipo", en: "Select payment method" },
  mobileMoneyNumber: { sw: "Namba ya pesa kwa simu", en: "Mobile money number" },
  payNow: { sw: "Lipa", en: "Pay" },
  cashPaid: { sw: "Nimelipa taslimu", en: "I paid in cash" },
  processing: { sw: "Inashughulikiwa…", en: "Processing…" },
  checkPhone: { sw: "Angalia simu yako na uweke PIN kuthibitisha", en: "Check your phone and enter your PIN to confirm" },
  paymentSuccess: { sw: "Malipo yamekamilika", en: "Payment successful" },
  howToPay: { sw: "Jinsi ya kulipa", en: "How it works" },
  pay1: { sw: "Bonyeza \"Lipa\" hapa chini", en: "Tap \"Pay\" below" },
  pay2: { sw: "Utapokea ombi la malipo kwenye simu", en: "You'll get a payment prompt on your phone" },
  pay3: { sw: "Weka PIN yako ya pesa kwa simu", en: "Enter your mobile money PIN" },
  pay4: { sw: "Thibitisha malipo", en: "Confirm the payment" },
  cashHint: { sw: "Mpe kinyozi kiasi kamili kisha thibitisha hapa.", en: "Hand the barber the exact amount, then confirm here." },
  securePayment: { sw: "Malipo salama", en: "Secure payment" },
  secureDesc: { sw: "Hatuhifadhi PIN yako. Malipo yanafanyika kupitia mtandao wako wa simu.", en: "We never store your PIN. Payments run through your mobile network." },
  alreadyPaid: { sw: "Oda hii imeshalipwa", en: "This booking is already paid" },

  serviceCompleted: { sw: "Huduma imekamilika!", en: "Service completed!" },
  howWasExperience: { sw: "Huduma ilikuwaje?", en: "How was your experience?" },
  rateYourBarber: { sw: "Mkadirie kinyozi wako", en: "Rate your barber" },
  tapToRate: { sw: "Gusa kukadiria", en: "Tap to rate" },
  r1: { sw: "Mbaya", en: "Poor" },
  r2: { sw: "Chini ya wastani", en: "Below average" },
  r3: { sw: "Wastani", en: "Average" },
  r4: { sw: "Nzuri", en: "Good" },
  r5: { sw: "Bora kabisa!", en: "Excellent!" },
  shareExperience: { sw: "Tuambie zaidi", en: "Share your experience" },
  reviewPh: { sw: "Nini kilikufurahisha au kiboreshwe nini?", en: "What did you like, or what could be better?" },
  addTip: { sw: "Ongeza bakshishi (hiari)", en: "Add a tip (optional)" },
  tipDesc: { sw: "Bakshishi yote inaenda kwa kinyozi", en: "100% of your tip goes to your barber" },
  removeTip: { sw: "Ondoa bakshishi", en: "Remove tip" },
  yourBarberToday: { sw: "Kinyozi wako leo", en: "Your barber today" },
  submitReview: { sw: "Tuma maoni", en: "Submit review" },
  andTip: { sw: "na bakshishi", en: "& tip" },
  thankYou: { sw: "Asante!", en: "Thank you!" },
  feedbackSent: { sw: "Maoni yako yametumwa", en: "Your feedback has been submitted" },
  appreciate: { sw: "Tunashukuru kwa kuiamini HODI", en: "We appreciate your trust in HODI" },

  totalBookings: { sw: "Oda zote", en: "Total bookings" },
  totalSpent: { sw: "Jumla uliyotumia", en: "Total spent" },
  rebook: { sw: "Agiza tena", en: "Rebook" },
  receipt: { sw: "Risiti", en: "Receipt" },
  rateNow: { sw: "Kadiria sasa", en: "Rate now" },
  bookFirst: { sw: "Agiza kinyozi wako wa kwanza leo.", en: "Book your first barber today." },
  track: { sw: "Fuatilia", en: "Track" },
  payNowShort: { sw: "Lipa sasa", en: "Pay now" },

  receiptNo: { sw: "Namba ya risiti", en: "Receipt no." },
  date: { sw: "Tarehe", en: "Date" },
  paidWith: { sw: "Imelipwa kwa", en: "Paid with" },
  paid: { sw: "Imelipwa", en: "Paid" },
  unpaid: { sw: "Haijalipwa", en: "Unpaid" },
  tip: { sw: "Bakshishi", en: "Tip" },
  print: { sw: "Chapisha / Hifadhi PDF", en: "Print / Save PDF" },
  barber: { sw: "Kinyozi", en: "Barber" },
  customer: { sw: "Mteja", en: "Customer" },
  thanksForChoosing: { sw: "Asante kwa kuchagua HODI.", en: "Thank you for choosing HODI." },

  editProfile: { sw: "Hariri wasifu", en: "Edit profile" },
  name: { sw: "Jina", en: "Name" },
  defaultLabel: { sw: "Chaguo-msingi", en: "Default" },
  makeDefault: { sw: "Fanya chaguo-msingi", en: "Make default" },
  remove: { sw: "Ondoa", en: "Remove" },
  referDesc: { sw: "Rafiki yako akiagiza mara ya kwanza, nyote mnapata TZS 2,000.", en: "When a friend books for the first time, you both get TZS 2,000." },
  share: { sw: "Shiriki", en: "Share" },
  copied: { sw: "Imenakiliwa!", en: "Copied!" },
  demoSurfaces: { sw: "Programu nyingine (onyesho)", en: "Other apps (demo)" },
  resetDemo: { sw: "Weka upya data ya onyesho", en: "Reset demo data" },
  help: { sw: "Msaada", en: "Help & support" },

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
    try {
      const saved = localStorage.getItem("hodi.lang") as Lang | null;
      if (saved === "sw" || saved === "en") setLangState(saved);
    } catch {
      /* storage blocked: stay on the default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("hodi.lang", l);
    } catch {
      /* ignore */
    }
  };

  const t = (key: TKey) => dict[key][lang];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
