# GlobeTrotter Backend

Express + TypeScript REST API for GlobeTrotter travel planning platform.

## Tech Stack
- Node.js & Express.js
- TypeScript
- PostgreSQL & Prisma ORM
- Zod, Helmet, Morgan, CORS, Bcrypt, JsonWebToken

## Setup & Running

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Run development server
npm run dev
```

The API will be running at [http://localhost:5000](http://localhost:5000).

Health Check endpoint:
[http://localhost:5000/api/health](http://localhost:5000/api/health)
