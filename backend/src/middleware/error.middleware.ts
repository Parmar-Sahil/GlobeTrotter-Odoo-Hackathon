import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiResponse } from "../utils/api-response.js";
import config from "../config/env.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map(
      (e) => `${e.path.join(".")}: ${e.message}`
    );
    return ApiResponse.error(res, "Validation failed", errorMessages, 400);
  }

  const statusCode = (err as { statusCode?: number }).statusCode || 500;
  const message = err.message || "Internal server error";

  const errorDetails =
    config.nodeEnv === "development" ? [err.stack || err.message] : [];

  return ApiResponse.error(res, message, errorDetails, statusCode);
};
