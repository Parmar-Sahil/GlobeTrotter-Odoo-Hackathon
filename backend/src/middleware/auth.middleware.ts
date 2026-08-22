import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import { ApiResponse } from "../utils/api-response.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.error(res, "Authentication token required", [], 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.error(res, "Invalid or expired token", [], 401);
  }
};
