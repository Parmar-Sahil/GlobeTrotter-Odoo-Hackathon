# GlobeTrotter Backend REST API

High-performance Express + TypeScript REST API powering the **GlobeTrotter** travel planning platform for the **Odoo Hackathon**.

---

## ⚡ Key Highlights & Architecture

- **14-Table Normalized Database**: Users, Password Reset Tokens, Cities, Activities, Saved Destinations, Trips, Trip Stops, Itinerary Items, Daily Budgets, Community Posts, Comments, Likes, Trip Shares, Search Logs.
- **Extreme API Optimization**: Selective Prisma `select`/`include` projections with response times under **3ms**.
- **Zero N+1 Queries**: Bulk data batching using `where: { id: { in: ids } }`, parallelized `Promise.all`, and in-memory `Set`/`Map` lookups.
- **Clean Architecture (< 500 Lines per File)**: Domain-driven modules with **Facade Pattern** (`TripFacade`, `CommunityFacade`).
- **100% Test Coverage Verification**: Automated 18-endpoint test runner (`npm run test:api`).

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Generate Prisma Client
npx prisma generate

# 4. Push schema & seed test data
npx prisma db push
npm run prisma:seed

# 5. Start development server
npm run dev
```

The server runs on **`http://localhost:5001`**.

---

## 🧪 Run Automated Integration Tests

```bash
npm run test:api
```

---

## 📬 Postman Collection

Import `GlobeTrotter_Postman_Collection.json` located in the root directory into Postman.
