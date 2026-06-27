// Self-contained data for the customer barber app (ported from the Figma
// prototype). Kept standalone so the screens mirror the prototype 1:1.

export const BRAND = {
  green: "#0F3D2E",
  gold: "#C9A227",
};

export const SERVICE_FEE = 2000;

export interface Service {
  id: number;
  name: string;
  icon: string;
  price: number;
}

export const services: Service[] = [
  { id: 1, name: "Haircut", icon: "✂️", price: 15000 },
  { id: 2, name: "Haircut + Beard", icon: "💈", price: 20000 },
  { id: 3, name: "Beard Grooming", icon: "🧔", price: 12000 },
  { id: 4, name: "Kids Haircut", icon: "👶", price: 10000 },
  { id: 5, name: "VIP Grooming", icon: "⭐", price: 35000 },
];

export interface Barber {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  available: boolean;
  experience: string;
  completedJobs: number;
  specialties: string[];
  about: string;
  image: string;
  portfolio: string[];
  phone: string;
  vehicle: string;
}

const IMG = {
  emmanuel:
    "https://images.unsplash.com/flagged/photo-1573137707067-95ae9d7bc599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYmFyYmVyJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxOTMxOTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  daniel:
    "https://images.unsplash.com/photo-1668752600261-e56e7f3780b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3QlMjBtYW58ZW58MXx8fHwxNzcxOTMxOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  joseph:
    "https://images.unsplash.com/photo-1686671805337-7d8aa64b965f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwbWFuJTIwaGFpcmN1dCUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzcxOTMxOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

const PORTFOLIO = [
  "https://images.unsplash.com/photo-1643837832861-ba85d3b046d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGJhcmJlciUyMGN1dHRpbmclMjBoYWlyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTg0OTkwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1686671805337-7d8aa64b965f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwbWFuJTIwaGFpcmN1dCUyMGJhcmJlcnNob3B8ZW58MXx8fHwxNzcxOTMxOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1678356163587-6bb3afb89679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjB0b29scyUyMHNjaXNzb3JzJTIwY29tYnxlbnwxfHx8fDE3NzE5MDM5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

export const barbers: Barber[] = [
  {
    id: 1,
    name: "Emmanuel Mwangi",
    rating: 4.9,
    reviews: 234,
    distance: "1.2 km",
    available: true,
    experience: "8 years",
    completedJobs: 1250,
    specialties: ["Fade", "Beard Styling", "Traditional Cuts", "Kids Haircut"],
    about:
      "Professional barber with over 8 years of experience. Specialized in modern fades and classic African styles. Certified by Tanzania Barbers Association.",
    image: IMG.emmanuel,
    portfolio: PORTFOLIO,
    phone: "+255 712 345 678",
    vehicle: "Silver Toyota - DAR 1234",
  },
  {
    id: 2,
    name: "Daniel Kamau",
    rating: 4.8,
    reviews: 189,
    distance: "2.5 km",
    available: true,
    experience: "5 years",
    completedJobs: 720,
    specialties: ["Fade", "Line-up", "Beard Trim"],
    about:
      "Skilled barber with 5 years of experience delivering crisp fades and clean line-ups across Dar es Salaam.",
    image: IMG.daniel,
    portfolio: PORTFOLIO,
    phone: "+255 713 222 333",
    vehicle: "Blue Bajaji - DAR 5678",
  },
  {
    id: 3,
    name: "Joseph Otieno",
    rating: 4.7,
    reviews: 156,
    distance: "3.1 km",
    available: false,
    experience: "6 years",
    completedJobs: 890,
    specialties: ["Traditional Cuts", "Kids Haircut", "Hot Towel Shave"],
    about:
      "Experienced grooming professional known for patient kids' cuts and relaxing hot-towel shaves.",
    image: IMG.joseph,
    portfolio: PORTFOLIO,
    phone: "+255 714 444 555",
    vehicle: "White Toyota - DAR 9012",
  },
];

export const barberById = (id: string | number) =>
  barbers.find((b) => b.id === Number(id)) ?? barbers[0];

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  { id: 1, name: "Michael Ndege", rating: 5, comment: "Excellent service! Very professional and skilled.", date: "2 days ago" },
  { id: 2, name: "Sarah Mwita", rating: 5, comment: "Best barber in Dar! Always on time and does amazing work.", date: "1 week ago" },
  { id: 3, name: "James Msomi", rating: 4, comment: "Great haircut, very friendly and professional.", date: "2 weeks ago" },
];

export interface HistoryItem {
  id: number;
  barberName: string;
  barberImage: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: string;
  rating: number;
}

export const bookingHistory: HistoryItem[] = [
  { id: 1, barberName: "Emmanuel Mwangi", barberImage: IMG.emmanuel, service: "Haircut + Beard", date: "Feb 20, 2026", time: "02:00 PM", location: "Masaki, Dar es Salaam", price: 22000, status: "completed", rating: 5 },
  { id: 2, barberName: "Daniel Kamau", barberImage: IMG.daniel, service: "Haircut", date: "Feb 10, 2026", time: "11:00 AM", location: "Masaki, Dar es Salaam", price: 17000, status: "completed", rating: 4 },
  { id: 3, barberName: "Emmanuel Mwangi", barberImage: IMG.emmanuel, service: "VIP Grooming", date: "Jan 28, 2026", time: "04:00 PM", location: "Oysterbay, Dar es Salaam", price: 37000, status: "completed", rating: 5 },
  { id: 4, barberName: "Joseph Otieno", barberImage: IMG.joseph, service: "Haircut + Beard", date: "Jan 15, 2026", time: "10:00 AM", location: "Masaki, Dar es Salaam", price: 22000, status: "completed", rating: 5 },
];

export const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

export const tzs = (n: number) => n.toLocaleString() + " TZS";
