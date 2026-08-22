import { Response } from "express";

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  errors?: string[];
}

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string = "Operation successful",
    data?: T,
    statusCode: number = 200
  ) {
    const payload: { success: true; message: string; data?: T } = {
      success: true,
      message,
    };

    if (data !== undefined) {
      payload.data = data;
    }

    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    message: string = "Something went wrong",
    errors: string[] = [],
    statusCode: number = 500
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
