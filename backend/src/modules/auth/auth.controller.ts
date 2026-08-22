import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response.util';

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = await authService.loginUser(usernameOrEmail, password);
    return sendSuccess(res, result, 'Login successful', 200);
  } catch (error) {
    return next(error);
  }
};

export const me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const userProfile = await authService.getCurrentUserProfile(userId);
    return sendSuccess(res, userProfile, 'User profile fetched successfully', 200);
  } catch (error) {
    return next(error);
  }
};
