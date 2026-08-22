import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import { TripFacade } from './trip.facade';
import { sendSuccess } from '../../utils/response.util';

export const createTrip = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const trip = await TripFacade.createTrip(userId, req.body);
    return sendSuccess(res, trip, 'Trip created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

export const getMyTrips = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { trips, meta } = await TripFacade.getUserTrips(userId, req.query);
    return sendSuccess(res, trips, 'Trips fetched successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};

export const getTripById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const trip = await TripFacade.getTripById(req.params.id, userId);
    return sendSuccess(res, trip, 'Trip details fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const updateTrip = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const trip = await TripFacade.updateTrip(req.params.id, userId, req.body);
    return sendSuccess(res, trip, 'Trip updated successfully');
  } catch (error) {
    return next(error);
  }
};

export const deleteTrip = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await TripFacade.deleteTrip(req.params.id, userId);
    return sendSuccess(res, result, 'Trip deleted successfully');
  } catch (error) {
    return next(error);
  }
};

export const addSection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const section = await TripFacade.addSectionToTrip(req.params.id, userId, req.body);
    return sendSuccess(res, section, 'Section added to trip successfully', 201);
  } catch (error) {
    return next(error);
  }
};

export const addItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const item = await TripFacade.addItemToSection(req.params.sectionId, userId, req.body);
    return sendSuccess(res, item, 'Item added to section successfully', 201);
  } catch (error) {
    return next(error);
  }
};

export const getItinerary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const itinerary = await TripFacade.getTripItinerary(req.params.id);
    return sendSuccess(res, itinerary, 'Trip itinerary fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const getBudgetSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const budgetSummary = await TripFacade.getBudgetSummary(req.params.id);
    return sendSuccess(res, budgetSummary, 'Trip budget summary fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const getCalendar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined;
    const events = await TripFacade.getUserCalendarEvents(userId, year, month);
    return sendSuccess(res, events, 'Calendar events fetched successfully');
  } catch (error) {
    return next(error);
  }
};
