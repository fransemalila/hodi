# Hodi — Frontend

On-demand home grooming for Dar es Salaam. _"Uber for barbers"_, mobile-first, Swahili + English.

This repo is the **frontend** for all three surfaces, in one Next.js app:

| Surface | Route | Audience | Layout |
|---|---|---|---|
| **Customer app** | `/customer` | People booking a service | Mobile PWA |
| **Provider app** | `/provider` | Barbers / groomers | Mobile PWA |
| **Admin panel** | `/admin` | Hodi ops team | Desktop dashboard |

A launcher at `/` lets you jump between them (demo convenience).

## Stack
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- Installable **PWA** (`public/manifest.webmanifest`)
- **Bilingual** SW/EN — Swahili is default (`lib/i18n.tsx`)
- **Mock-data layer** (`lib/mock-data.ts`) + a `localStorage`-persisted store (`lib/store.tsx`). No backend needed to click through every flow. Types in `lib/types.ts` mirror the eventual API, so screens won't need rewriting when the real backend lands.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel
1. Push this repo to GitHub/GitLab.
2. Import into Vercel — it auto-detects Next.js. No config needed.
3. Build command `next build`, output handled automatically.

## What's implemented (MVP)
**Customer:** phone-OTP auth (mock), home + service browsing, search/filter, provider profiles,
3-step booking flow (service → when → where → pay), price breakdown with **Booking charge**,
mobile-money + cash payment selection, booking tracking timeline, ratings, booking history,
saved locations, **referral code** field, language toggle.

**Provider:** availability toggle, incoming requests with accept/reject countdown, job status
updates (on the way → arrived → in progress → completed), cash-received confirmation,
customer location + maps/call buttons, earnings dashboard with commission breakdown.

**Admin:** overview KPIs, provider management (approve/suspend, NIDA review),
booking management with **intervention** (reassign provider, override status, contact both sides),
service & pricing controls (min/max, commission %, booking charge), reports (bookings, revenue,
service popularity, top providers).

### Founder feedback from the PRD, applied
- Catalog reduced to **4 services** (men's haircut, beard, kids' haircut, basic women's styling).
- Customer-facing fee renamed **"Booking charge"** (not "platform cost").
- Referral code field at signup.
- Admin can assign provider, override pricing, and contact both sides.

## Not in the frontend (needs backend / integrations — see PRD)
- Real **OTP/SMS** (Beem / Africa's Talking) and **push** (Firebase FCM)
- **Payments** (Selcom / AzamPay STK push) — UI selects a method; settlement is server-side
- **Maps** (Google Maps / Mapbox) — currently a styled placeholder
- **Auth/session**, real database, provider auto-matching, NIDA verification API

## Project layout
```
app/
  page.tsx              launcher
  customer/             customer PWA (home, book, providers, bookings, account, auth)
  provider/             provider PWA (dashboard, jobs, earnings)
  admin/                admin dashboard (overview, providers, bookings, services, reports)
components/             shared UI (ui.tsx, cards, MobileShell, etc.)
lib/                    types, i18n, mock-data, store, formatting
```
