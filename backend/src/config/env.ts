import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/globetrotter",
  jwt: {
    secret: process.env.JWT_SECRET || "default-dev-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
} as const;

export default config;
