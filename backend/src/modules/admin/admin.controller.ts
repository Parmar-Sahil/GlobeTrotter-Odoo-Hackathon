import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as adminService from './admin.service';
import { sendSuccess } from '../../utils/response.util';

export const getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { users, meta } = await adminService.getUsersList(req.query);
    return sendSuccess(res, users, 'Users fetched successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.updateUserStatus(req.params.userId, req.body);
    return sendSuccess(res, user, 'User status updated successfully');
  } catch (error) {
    return next(error);
  }
};

export const getPopularCities = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const analytics = await adminService.getPopularCitiesAnalytics();
    return sendSuccess(res, analytics, 'Popular cities analytics fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const getPopularActivities = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const analytics = await adminService.getPopularActivitiesAnalytics();
    return sendSuccess(res, analytics, 'Popular activities analytics fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const getUserTrends = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const analytics = await adminService.getUserTrendsAnalytics();
    return sendSuccess(res, analytics, 'User trends analytics fetched successfully');
  } catch (error) {
    return next(error);
  }
};
