# GlobeTrotter

Personalized multi-city travel planning application built for the Odoo Hackathon.

## Project Structure

```text
GlobeTrotter/
│
├── frontend/     # Next.js App Router, TypeScript, Tailwind CSS, TanStack Query
├── backend/      # Node.js, Express, TypeScript, REST API, Prisma ORM
├── .gitignore    # Root Git ignore rules
└── README.md     # Project documentation
```

## Tech Stack

### Frontend:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Axios
- TanStack React Query
- React Hook Form
- Zod
- Lucide React

### Backend:
- Node.js
- Express.js
- TypeScript
- REST API
- Prisma ORM
- Zod, Helmet, Morgan, CORS, Bcrypt, JsonWebToken

### Database:
- PostgreSQL
- Prisma ORM

---

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.local.example .env.local
   ```

---

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

---

## Database Setup

1. Configure your PostgreSQL database connection string in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/globetrotter"
   ```
2. Generate Prisma Client:
   ```bash
   cd backend
   npx prisma generate
   ```

---

## Environment Variables

### Frontend (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL`: Base URL for the Express backend API (e.g., `http://localhost:5000/api`).

### Backend (`backend/.env`):
- `PORT`: Express server port (default: `5000`).
- `NODE_ENV`: Environment mode (`development` or `production`).
- `DATABASE_URL`: PostgreSQL connection URL for Prisma.
- `JWT_SECRET`: Secret key used for signing JWT tokens.
- `JWT_EXPIRES_IN`: Expiration duration for JWT tokens (default: `7d`).
- `CLIENT_URL`: URL of the frontend client for CORS configuration (default: `http://localhost:3000`).

---

## Running Locally

### Frontend:
```bash
cd frontend
npm run dev
```
Accessible at: [http://localhost:3000](http://localhost:3000)

### Backend:
```bash
cd backend
npm run dev
```
Accessible at: [http://localhost:5000](http://localhost:5000)

---

## Health Check

Verify that the backend is running properly:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "GlobeTrotter API is running"
}
```
