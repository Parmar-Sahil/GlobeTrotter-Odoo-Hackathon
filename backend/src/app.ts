import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/env.js";
import routes from "./routes/index.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    })
  );

  // Request logging
  if (config.nodeEnv !== "test") {
    app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
  }

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api", routes);

  // 404 Not Found Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;
