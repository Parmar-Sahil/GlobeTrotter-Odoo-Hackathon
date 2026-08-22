import { Router } from 'express';
import * as activityController from './activity.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';
import { searchActivitySchema, createActivitySchema } from './activity.schema';
import { Role } from '../../types/enums';

const router = Router();

router.get('/search', validateRequest(searchActivitySchema), activityController.search);
router.get('/:id', activityController.getById);
router.post(
  '/',
  authenticate,
  requireRole(Role.ADMIN),
  validateRequest(createActivitySchema),
  activityController.create
);

export default router;
