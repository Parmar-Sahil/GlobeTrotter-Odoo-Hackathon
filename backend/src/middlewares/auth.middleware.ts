import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { prisma } from '../config/prisma.config';
import { AuthenticatedRequest, JwtPayload } from '../types';
import { sendError } from '../utils/response.util';
import { Role } from '../types/enums';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token missing or invalid format', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Fast selective check for active user status (Mandatory Directive 1 & 5)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user || user.status !== 'active') {
      return sendError(res, 'User account not found or deactivated', 401);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token', 401);
  }
};

export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (decoded?.userId) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
    return next();
  } catch (error) {
    return next();
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized access', 401);
    }

    if (!roles.includes(req.user.role as Role)) {
      return sendError(res, 'Access forbidden: Insufficient permissions', 403);
    }

    return next();
  };
};
