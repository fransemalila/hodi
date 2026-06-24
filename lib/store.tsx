"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  paymentMethod: PaymentMethod;
}

interface StoreState {
  bookings: Booking[];
  providers: Provider[];
  profile: CustomerProfile;
  isAuthed: boolean;

  // customer actions
  signIn: (name: string, phone: string, referralCode?: string) => void;
  signOut: () => void;
  createBooking: (input: NewBookingInput) => Booking;
  rateBooking: (id: string, review: Review) => void;

  // shared / provider / admin actions
  advanceStatus: (id: string, status: BookingStatus) => void;
  setProviderStatus: (id: string, status: ProviderStatus) => void;
  setVerification: (id: string, v: Provider["verification"]) => void;
  assignProvider: (bookingId: string, providerId: string) => void;
}

const StoreCtx = createContext<StoreState | null>(null);

const LS_KEY = "hodi.store.v1";

interface Persisted {
  bookings: Booking[];
  profile: CustomerProfile;
  isAuthed: boolean;
  providerStatuses: Record<string, ProviderStatus>;
  verifications: Record<string, Provider["verification"]>;
}

const defaultProfile: CustomerProfile = {
  name: "Asha",
  phone: "+255 712 000 111",
  lang: "sw",
  locations: defaultLocations,
};

function nextId() {
  return "bk_" + Math.random().toString(36).slice(2, 8);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [profile, setProfile] = useState<CustomerProfile>(defaultProfile);
  const [isAuthed, setIsAuthed] = useState(false);
  const [providerStatuses, setProviderStatuses] = useState<Record<string, ProviderStatus>>({});
  const [verifications, setVerifications] = useState<Record<string, Provider["verification"]>>({});
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        setBookings(p.bookings ?? seedBookings);
        setProfile(p.profile ?? defaultProfile);
        setIsAuthed(p.isAuthed ?? false);
        setProviderStatuses(p.providerStatuses ?? {});
        setVerifications(p.verifications ?? {});
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    const data: Persisted = { bookings, profile, isAuthed, providerStatuses, verifications };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [bookings, profile, isAuthed, providerStatuses, verifications, hydrated]);

  const providers = useMemo<Provider[]>(() => {
    return [...seedProviders, pendingProvider].map((p) => ({
      ...p,
      status: providerStatuses[p.id] ?? p.status,
      verification: verifications[p.id] ?? p.verification,
    }));
  }, [providerStatuses, verifications]);

  const signIn: StoreState["signIn"] = (name, phone, referralCode) => {
    setProfile((prev) => ({ ...prev, name, phone, referralCode }));
    setIsAuthed(true);
  };

  const signOut = () => setIsAuthed(false);

  const createBooking: StoreState["createBooking"] = (input) => {
    const booking: Booking = {
      id: nextId(),
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
      paymentMethod: input.paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const rateBooking: StoreState["rateBooking"] = (id, review) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, review } : b)));
  };

  const advanceStatus: StoreState["advanceStatus"] = (id, status) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const setProviderStatus: StoreState["setProviderStatus"] = (id, status) => {
    setProviderStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const setVerification: StoreState["setVerification"] = (id, v) => {
    setVerifications((prev) => ({ ...prev, [id]: v }));
  };

  const assignProvider: StoreState["assignProvider"] = (bookingId, providerId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              providerId,
              status: b.status === "pending" ? "accepted" : b.status,
              servicePrice:
                providerById(providers, providerId)?.prices[b.serviceId] ?? b.servicePrice,
            }
          : b,
      ),
    );
  };

  const value: StoreState = {
    bookings,
    providers,
    profile,
    isAuthed,
    signIn,
    signOut,
    createBooking,
    rateBooking,
    advanceStatus,
    setProviderStatus,
    setVerification,
    assignProvider,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function providerById(list: Provider[], id: string) {
  return list.find((p) => p.id === id);
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
