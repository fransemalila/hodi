"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import type {
  Booking,
  BookingStatus,
  CustomerProfile,
  PaymentMethod,
  Provider,
  ProviderStatus,
  Review,
  SavedLocation,
} from "./types";
import {
  BOOKING_CHARGE,
  defaultLocations,
  pendingProvider,
  providers as seedProviders,
  seedBookings,
  serviceById,
} from "./mock-data";

interface NewBookingInput {
  serviceId: string;
  providerId: string;
  servicePrice: number;
  location: SavedLocation;
  scheduledFor: "now" | string;
  notes?: string;
  paymentMethod?: PaymentMethod;
}

interface StoreState {
  /** False until localStorage has been read; gate redirects on this. */
  hydrated: boolean;
  bookings: Booking[];
  providers: Provider[];
  profile: CustomerProfile;
  isAuthed: boolean;
  onboarded: boolean;

  // customer actions
  completeOnboarding: () => void;
  signIn: (name: string, phone: string, referralCode?: string) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<CustomerProfile, "name" | "defaultLocationId">>) => void;
  addLocation: (loc: Omit<SavedLocation, "id">) => SavedLocation;
  removeLocation: (id: string) => void;
  createBooking: (input: NewBookingInput) => Booking;
  cancelBooking: (id: string, by: NonNullable<Booking["cancelledBy"]>) => void;
  payBooking: (id: string, method: PaymentMethod, payerPhone?: string) => void;
  rateBooking: (id: string, review: Review, tip?: number) => void;

  // shared / provider / admin actions
  advanceStatus: (id: string, status: BookingStatus) => void;
  setProviderStatus: (id: string, status: ProviderStatus) => void;
  setVerification: (id: string, v: Provider["verification"]) => void;
  assignProvider: (bookingId: string, providerId: string) => void;
  resetDemo: () => void;
}

const StoreCtx = createContext<StoreState | null>(null);

const LS_KEY = "hodi.store.v2";

interface Persisted {
  bookings: Booking[];
  profile: CustomerProfile;
  isAuthed: boolean;
  onboarded: boolean;
  providerStatuses: Record<string, ProviderStatus>;
  verifications: Record<string, Provider["verification"]>;
}

const defaultProfile: CustomerProfile = {
  name: "Asha",
  phone: "+255 712 000 111",
  lang: "sw",
  locations: defaultLocations,
  defaultLocationId: defaultLocations[0].id,
};

function nextId(prefix: string) {
  return prefix + "_" + Math.random().toString(36).slice(2, 8);
}

/** Normalise Tanzanian numbers to "+255 7XX XXX XXX". */
export function normalizePhone(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("255")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 9);
  return `+255 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`.trim();
}

export function isValidTzPhone(input: string): boolean {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("255")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return /^[67]\d{8}$/.test(d);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [profile, setProfile] = useState<CustomerProfile>(defaultProfile);
  const [isAuthed, setIsAuthed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [providerStatuses, setProviderStatuses] = useState<Record<string, ProviderStatus>>({});
  const [verifications, setVerifications] = useState<Record<string, Provider["verification"]>>({});
  const [hydrated, setHydrated] = useState(false);
  // Last JSON we wrote or read, so cross-tab updates don't echo back.
  const lastJson = useRef<string>("");

  const apply = useCallback((p: Partial<Persisted>) => {
    setBookings(p.bookings ?? seedBookings);
    setProfile({ ...defaultProfile, ...(p.profile ?? {}) });
    setIsAuthed(p.isAuthed ?? false);
    setOnboarded(p.onboarded ?? false);
    setProviderStatuses(p.providerStatuses ?? {});
    setVerifications(p.verifications ?? {});
  }, []);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        lastJson.current = raw;
        apply(JSON.parse(raw) as Persisted);
      }
    } catch {
      /* ignore corrupt or blocked storage */
    }
    setHydrated(true);
  }, [apply]);

  // keep tabs in sync (e.g. customer app in one tab, provider app in another)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LS_KEY || !e.newValue || e.newValue === lastJson.current) return;
      try {
        lastJson.current = e.newValue;
        apply(JSON.parse(e.newValue) as Persisted);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [apply]);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    const data: Persisted = { bookings, profile, isAuthed, onboarded, providerStatuses, verifications };
    const json = JSON.stringify(data);
    if (json === lastJson.current) return;
    lastJson.current = json;
    try {
      localStorage.setItem(LS_KEY, json);
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [bookings, profile, isAuthed, onboarded, providerStatuses, verifications, hydrated]);

  const providers = useMemo<Provider[]>(() => {
    return [...seedProviders, pendingProvider].map((p) => ({
      ...p,
      status: providerStatuses[p.id] ?? p.status,
      verification: verifications[p.id] ?? p.verification,
    }));
  }, [providerStatuses, verifications]);

  const patchBooking = (id: string, patch: (b: Booking) => Partial<Booking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch(b) } : b)));

  const now = () => new Date().toISOString();

  const value: StoreState = {
    hydrated,
    bookings,
    providers,
    profile,
    isAuthed,
    onboarded,

    completeOnboarding: () => setOnboarded(true),

    signIn: (name, phone, referralCode) => {
      setProfile((prev) => ({ ...prev, name: name.trim() || prev.name, phone, referralCode }));
      setIsAuthed(true);
      setOnboarded(true);
    },

    signOut: () => setIsAuthed(false),

    updateProfile: (patch) => setProfile((prev) => ({ ...prev, ...patch })),

    addLocation: (loc) => {
      const created: SavedLocation = { ...loc, id: nextId("loc") };
      setProfile((prev) => ({ ...prev, locations: [...prev.locations, created] }));
      return created;
    },

    removeLocation: (id) =>
      setProfile((prev) => {
        const locations = prev.locations.filter((l) => l.id !== id);
        return {
          ...prev,
          locations,
          defaultLocationId: prev.defaultLocationId === id ? locations[0]?.id : prev.defaultLocationId,
        };
      }),

    createBooking: (input) => {
      const booking: Booking = {
        id: nextId("bk"),
        serviceId: input.serviceId,
        providerId: input.providerId,
        customerName: profile.name,
        customerPhone: profile.phone,
        location: input.location,
        scheduledFor: input.scheduledFor,
        notes: input.notes,
        servicePrice: input.servicePrice,
        bookingCharge: BOOKING_CHARGE,
        total: input.servicePrice + BOOKING_CHARGE,
        paymentMethod: input.paymentMethod ?? "mpesa",
        paymentStatus: "unpaid",
        status: "pending",
        createdAt: now(),
        updatedAt: now(),
      };
      setBookings((prev) => [booking, ...prev]);
      return booking;
    },

    cancelBooking: (id, by) => patchBooking(id, () => ({ status: "cancelled", cancelledBy: by, updatedAt: now() })),

    payBooking: (id, method, payerPhone) =>
      patchBooking(id, () => ({ paymentMethod: method, paymentStatus: "paid", paidAt: now(), payerPhone })),

    rateBooking: (id, review, tip) => patchBooking(id, () => ({ review, tip: tip || undefined })),

    advanceStatus: (id, status) =>
      patchBooking(id, (b) => ({
        status,
        updatedAt: now(),
        // Cash is settled in hand when the provider completes the job.
        ...(status === "completed" && b.paymentMethod === "cash" && b.paymentStatus !== "paid"
          ? { paymentStatus: "paid" as const, paidAt: now() }
          : {}),
      })),

    setProviderStatus: (id, status) => setProviderStatuses((prev) => ({ ...prev, [id]: status })),

    setVerification: (id, v) => setVerifications((prev) => ({ ...prev, [id]: v })),

    assignProvider: (bookingId, providerId) =>
      patchBooking(bookingId, (b) => {
        const servicePrice = providers.find((p) => p.id === providerId)?.prices[b.serviceId] ?? b.servicePrice;
        return {
          providerId,
          status: b.status === "pending" ? "accepted" : b.status,
          servicePrice,
          total: servicePrice + b.bookingCharge,
          updatedAt: now(),
        };
      }),

    resetDemo: () => {
      try {
        localStorage.removeItem(LS_KEY);
      } catch {
        /* ignore */
      }
      lastJson.current = "";
      apply({});
    },
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// Convenience selectors
export function useService(id: string) {
  return serviceById(id);
}

/** Bookings that belong to the signed-in customer, newest first. */
export function useMyBookings() {
  const { bookings, profile } = useStore();
  return useMemo(
    () =>
      bookings
        .filter((b) => b.customerPhone === profile.phone)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [bookings, profile.phone],
  );
}

export const ACTIVE_STATUSES: BookingStatus[] = ["pending", "accepted", "on_the_way", "arrived", "in_progress"];
