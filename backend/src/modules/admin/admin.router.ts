import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { updateUserStatusSchema, adminQuerySchema } from './admin.schema';
import { Role } from '../../types/enums';

const router = Router();

// Protect all admin routes with JWT auth and ADMIN role requirement
router.use(authenticate, requireRole(Role.ADMIN));

router.get('/users', validateRequest(adminQuerySchema), adminController.getUsers);
router.patch('/users/:userId/status', validateRequest(updateUserStatusSchema), adminController.updateUserStatus);

// Analytics endpoints for Screen 12
router.get('/analytics/popular-cities', adminController.getPopularCities);
router.get('/analytics/popular-activities', adminController.getPopularActivities);
router.get('/analytics/user-trends', adminController.getUserTrends);

export default router;
