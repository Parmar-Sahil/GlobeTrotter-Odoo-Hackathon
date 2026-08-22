# 🌍 GlobeTrotter - Travel Planning Platform

Personalized multi-city travel planning and itinerary management application built for the **Odoo Hackathon**.

---

## 🎯 Overview & Key Features

GlobeTrotter enables travelers to discover destinations, plan multi-day itineraries, track budgets, schedule calendar trips, and share travel experiences.

### 📱 12 Wireframe Screens Covered:
- **Screen 1 & 2**: Login & Registration Screens (Bcrypt password security, JWT auth, user profiles).
- **Screen 3**: Main Landing Page (Banner, regional destination selections, top cities).
- **Screen 4**: Create a New Trip (Date selection, place picker, activity suggestions).
- **Screen 5**: Build Itinerary Screen (Section-based planning: travel, hotels, activities).
- **Screen 6**: User Trip Listing (Filter by `upcoming`, `ongoing`, `completed`, `draft`).
- **Screen 7**: User Profile Pages (Profile details, preplanned templates & past trips).
- **Screen 8**: Activity & City Search (Multi-criteria search, category filters, sorting, grouping).
- **Screen 9**: Itinerary View with Budget Section (Day-by-day activity timelines, expenses, over-budget alerts).
- **Screen 10**: Community Tab Screen (Travel experience reviews, likes, comments).
- **Screen 11**: Calendar View Screen (Scheduled trip ranges tagged on a calendar).
- **Screen 12**: Admin Panel Screen (User management, popular cities & activities analytics, user trends).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **State & Data Fetching**: TanStack React Query, Axios
- **Forms & Validation**: React Hook Form, Zod
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express.js (TypeScript)
- **Database ORM**: Prisma ORM
- **Security & Utilities**: Bcrypt, JsonWebToken, Helmet, Morgan, CORS, Zod

### Database
- **Provider**: PostgreSQL (Neon.tech / Supabase cloud) / SQLite (Local testing)
- **Schema**: 14-Table Normalized Database Architecture

---

## 📂 Project Structure

```text
GlobeTrotter/
├── frontend/                        # Next.js App Router Frontend
├── backend/                         # Express + TypeScript Backend
│   ├── prisma/
│   │   ├── schema.prisma            # Official 14-Table Prisma Schema
│   │   └── seed.ts                  # Database Seeder
│   ├── scripts/
│   │   └── test-api.ts              # Automated 18-Endpoint Integration Test Suite
│   └── src/
│       ├── config/                  # Environment & Prisma singletons
│       ├── middlewares/             # Auth, error & Zod validation middlewares
│       ├── modules/                 # Auth, User, Destination, Activity, Trip, Community, Admin
│       ├── types/                   # Shared TypeScript interfaces & enums
│       ├── utils/                   # Pagination & response helpers
│       ├── app.ts                   # Express Application setup
│       └── server.ts                # HTTP Server entry point
├── GlobeTrotter_Postman_Collection.json # Postman Collection v2.1.0
├── .gitignore
└── README.md
```

---

## 🗄️ Database Architecture (14 Tables)

The backend implements a production-grade 14-table database schema:
1. `users` – User credentials, profiles, roles (`user`, `admin`), and status.
2. `password_reset_tokens` – Tokens for password reset requests.
3. `cities` – Destinations with cost index, coordinates (`latitude`, `longitude`), and popularity scores.
4. `activities` – Activity catalog with estimated costs, duration in minutes, and ratings.
5. `saved_destinations` – Bookmarked cities per user.
6. `trips` – Multi-day itineraries with statuses (`draft`, `upcoming`, `ongoing`, `completed`, `archived`) & visibility.
7. `trip_stops` – Multi-city itinerary stops within a trip.
8. `itinerary_items` – Individual activity, transport, accommodation, meal, & expense items.
9. `trip_daily_budgets` – Per-day budget allocations for over-budget monitoring.
10. `community_posts` – Travel reviews & experience stories.
11. `community_post_comments` – Threaded comments supporting nested replies (`parent_id`).
12. `community_post_likes` – Post likes tracking.
13. `trip_shares` – Public link sharing (`UUID` tokens) & friend sharing.
14. `search_logs` – Search query analytics for destination & activity trends.

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Sync schema to database & seed test data
npx prisma db push
npm run prisma:seed

# Run Development Server
npm run dev
```
The API server will run at **`http://localhost:5001`**.

### 2. Run Automated API Integration Tests

To test all 18 endpoints across all 12 screens automatically:
```bash
cd backend
npm run test:api
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Run Development Server
npm run dev
```
The frontend application will be accessible at **`http://localhost:3000`**.

---

## 📬 Postman API Collection

Import [`GlobeTrotter_Postman_Collection.json`](./GlobeTrotter_Postman_Collection.json) into Postman to test all endpoints interactively.

---

## 🔍 API Health Check

Verify that the backend API is running properly:
```bash
curl http://localhost:5001/api/health
```
Expected response:
```json
{
  "success": true,
  "message": "GlobeTrotter API is running",
  "data": {
    "timestamp": "2026-08-22T13:30:00.000Z"
  }
}
```
