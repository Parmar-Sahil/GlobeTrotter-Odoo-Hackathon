import { Router } from 'express';
import * as destinationController from './destination.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';
import { createDestinationSchema, searchDestinationSchema } from './destination.schema';
import { Role } from '../../types/enums';

const router = Router();

router.get('/top-regional', destinationController.getTopRegional);
router.get('/search', validateRequest(searchDestinationSchema), destinationController.search);
router.get('/:id', destinationController.getById);
router.get('/:id/suggestions', destinationController.getSuggestions);
router.post(
  '/',
  authenticate,
  requireRole(Role.ADMIN),
  validateRequest(createDestinationSchema),
  destinationController.create
);

export default router;
