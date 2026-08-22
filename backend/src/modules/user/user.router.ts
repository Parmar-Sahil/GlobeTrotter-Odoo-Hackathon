import { Router } from 'express';
import * as userController from './user.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { updateProfileSchema } from './user.schema';

const router = Router();

router.put('/profile', authenticate, validateRequest(updateProfileSchema), userController.updateProfile);
router.get('/preplanned-trips', userController.getPreplannedTrips);
router.get('/previous-trips', authenticate, userController.getPreviousTrips);

export default router;
