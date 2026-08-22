import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response.js";

export const notFoundHandler = (req: Request, res: Response) => {
  return ApiResponse.error(
    res,
    `Route ${req.method} ${req.originalUrl} not found`,
    [],
    404
  );
};
