import { Request, Response, NextFunction } from 'express';
import * as activityService from './activity.service';
import { sendSuccess } from '../../utils/response.util';

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activities, isGrouped, meta } = await activityService.searchActivities(req.query);
    return sendSuccess(
      res,
      activities,
      isGrouped ? 'Activities fetched and grouped successfully' : 'Activities fetched successfully',
      200,
      meta
    );
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await activityService.getActivityById(req.params.id);
    return sendSuccess(res, activity, 'Activity details fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await activityService.createActivity(req.body);
    return sendSuccess(res, activity, 'Activity created successfully', 201);
  } catch (error) {
    return next(error);
  }
};
