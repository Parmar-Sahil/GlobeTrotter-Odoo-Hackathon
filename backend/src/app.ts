import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.config';
import { errorHandler } from './middlewares/error.middleware';
import { sendSuccess, sendError } from './utils/response.util';

// Module Routers
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import destinationRouter from './modules/destination/destination.router';
import activityRouter from './modules/activity/activity.router';
import tripRouter from './modules/trip/trip.router';
import communityRouter from './modules/community/community.router';
import adminRouter from './modules/admin/admin.router';

const app = express();

// Security and Logging Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  return sendSuccess(res, { timestamp: new Date().toISOString() }, 'GlobeTrotter API is running');
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/destinations', destinationRouter);
app.use('/api/activities', activityRouter);
app.use('/api/trips', tripRouter);
app.use('/api/community', communityRouter);
app.use('/api/admin', adminRouter);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  return sendError(res, `Route ${req.method} ${req.path} not found`, 404);
});

// Global Error Handler
app.use(errorHandler);

export default app;
