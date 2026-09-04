# Waypoint — Travel Booking App

[![CI](https://github.com/anish0714/travel-app/actions/workflows/ci.yml/badge.svg)](https://github.com/anish0714/travel-app/actions/workflows/ci.yml)

A full-stack travel booking platform for flights and hotels across Canada, built as a portfolio project. Real Canadian airports, airlines, and hotels; a booking flow with actual seat-inventory holds; JWT auth with guest checkout; a loyalty program with real tier discounts.

## Stack

- **Backend**: Node.js, Express, PostgreSQL, Prisma
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Auth**: JWT (bcrypt-hashed passwords)

## Project structure

```
backend/    Express API + Prisma schema, migrations, and seed data
frontend/   Next.js app (search, hotel detail, booking, auth pages)
```

## Getting started

### 1. Database

Install PostgreSQL 17+ locally (or point `DATABASE_URL` at a hosted instance, e.g. Neon) and create a database:

```bash
psql -U postgres -c "CREATE DATABASE travelapp;"
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npm run db:migrate      # applies the schema
npm run db:seed         # loads real airports, hotels, airlines, and flights
npm run dev              # http://localhost:4000
```

Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL, defaults to http://localhost:4000
npm run dev                          # http://localhost:3000
```

## Seed data

Running `npm run db:seed` (in `backend/`) loads:

- **15 real Canadian airports** — YYZ, YTZ, YVR, YUL, YYC, YOW, YEG, YWG, YHZ, YXE, YQB, YYJ, YQR, YFC, YYT
- **4 real airlines** — Air Canada, WestJet, Porter Airlines, Flair Airlines
- **A 61-route domestic network** modeled on each carrier's real focus (AC national, WS Calgary-hub, PD Eastern Canada, F8 ultra-low-cost leisure), generating a rolling 7-day flight schedule with fares
- **41 real hotels** across 10 cities and 3 rating tiers (Fairmont/luxury, Holiday Inn/mid, Comfort Inn/budget), each with room types and rate plans
- **3 real insurance providers** — TuGo, Manulife, Allianz Global Assistance — one plan per tier (Basic/Standard/Premium)

## API reference

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Get a JWT |
| GET | `/users/me` | Current user (auth required) |
| GET | `/airports?city=` | Airport lookup |
| GET | `/airlines` | Airline lookup |
| GET | `/hotels?city=&minRating=&maxRating=` | Hotel search |
| GET | `/hotels/:id` | Hotel detail with rooms + rate plans |
| GET | `/flights?origin=&destination=&date=` | Flight search with fares |
| GET | `/insurance-plans?tripCost=` | Insurance catalog (with `tripCost`, includes the actual premium for that trip) |
| POST | `/bookings` | Create a booking (auth optional — guest checkout via `guestEmail`). Items can mix `FLIGHT`, `HOTEL`, and `INSURANCE` — insurance is priced against the other items' subtotal in the same request. For a signed-in traveler, applies their loyalty tier's discount and returns how many points they earned |
| GET | `/bookings/me` | Current user's bookings (auth required) |
| GET | `/bookings/:id` | Booking detail (owner or staff only for account-linked bookings) |

## Loyalty program

Every signed-in booking earns 5 points per dollar actually paid. Points accumulate on the user's account and auto-upgrade their tier, which discounts the flight/hotel subtotal (never insurance) on every future booking — applied and recorded automatically inside the booking transaction, no separate step required.

| Tier | Points required | Discount |
|---|---|---|
| None | 0 | — |
| Silver | 1,000 | 3% |
| Gold | 5,000 | 7% |
| Platinum | 15,000 | 12% |

See [backend/src/lib/loyalty.js](backend/src/lib/loyalty.js).

## Database schema

17 tables covering users, airports/airlines/flights/flight_fares, suppliers/hotels/hotel_rooms/hotel_rate_plans, bookings/booking_items/travelers, payments, insurance_plans/insurance_policies, and reviews. See [backend/prisma/schema.prisma](backend/prisma/schema.prisma).
