import { Request, Response, NextFunction } from 'express';
import * as destinationService from './destination.service';
import { sendSuccess } from '../../utils/response.util';

export const getTopRegional = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await destinationService.getTopRegionalDestinations();
    return sendSuccess(res, data, 'Top regional selections fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinations, meta } = await destinationService.searchDestinations(req.query);
    return sendSuccess(res, destinations, 'Destinations fetched successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destination = await destinationService.getDestinationById(req.params.id);
    return sendSuccess(res, destination, 'Destination details fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const getSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suggestions = await destinationService.getDestinationSuggestions(req.params.id);
    return sendSuccess(res, suggestions, 'Destination suggestions fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destination = await destinationService.createDestination(req.body);
    return sendSuccess(res, destination, 'Destination created successfully', 201);
  } catch (error) {
    return next(error);
  }
};
