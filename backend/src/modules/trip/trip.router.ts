import { Router } from 'express';
import * as tripController from './trip.controller';
import { authenticate, optionalAuthenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createTripSchema,
  updateTripSchema,
  createSectionSchema,
  createItemSchema,
  tripQuerySchema,
} from './trip.schema';

const router = Router();

router.post('/', authenticate, validateRequest(createTripSchema), tripController.createTrip);
router.get('/my-trips', authenticate, validateRequest(tripQuerySchema), tripController.getMyTrips);
router.get('/calendar', authenticate, tripController.getCalendar);
router.get('/:id', optionalAuthenticate, tripController.getTripById);
router.put('/:id', authenticate, validateRequest(updateTripSchema), tripController.updateTrip);
router.delete('/:id', authenticate, tripController.deleteTrip);

// Itinerary Sections & Items
router.post('/:id/sections', authenticate, validateRequest(createSectionSchema), tripController.addSection);
router.put('/sections/:sectionId', authenticate, tripController.updateSection);
router.delete('/sections/:sectionId', authenticate, tripController.deleteSection);

router.post('/sections/:sectionId/items', authenticate, validateRequest(createItemSchema), tripController.addItem);
router.put('/items/:itemId', authenticate, tripController.updateItem);
router.delete('/items/:itemId', authenticate, tripController.deleteItem);

router.get('/:id/itinerary', optionalAuthenticate, tripController.getItinerary);
router.get('/:id/budget-summary', optionalAuthenticate, tripController.getBudgetSummary);

export default router;
