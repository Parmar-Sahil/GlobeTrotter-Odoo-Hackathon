import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as userService from './user.service';
import { sendSuccess } from '../../utils/response.util';

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    return sendSuccess(res, updatedUser, 'Profile updated successfully', 200);
  } catch (error) {
    return next(error);
  }
};

export const getPreplannedTrips = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trips, meta } = await userService.getUserPreplannedTrips(req.query);
    return sendSuccess(res, trips, 'Preplanned trips fetched successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};

export const getPreviousTrips = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { trips, meta } = await userService.getUserPreviousTrips(userId, req.query);
    return sendSuccess(res, trips, 'Previous trips fetched successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};
