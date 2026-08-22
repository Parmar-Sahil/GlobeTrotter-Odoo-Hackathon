import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.config';
import { env } from '../../config/env.config';
import { JwtPayload } from '../../types';

export const registerUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  bio?: string;
}) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
    select: { id: true, email: true, username: true },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new Error('Email address is already in use');
    }
    throw new Error('Username is already taken');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      avatarUrl: data.avatarUrl || null,
      phoneNumber: data.phoneNumber || null,
      city: data.city || null,
      country: data.country || null,
      bio: data.bio || null,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      avatarUrl: true,
      phoneNumber: true,
      city: true,
      country: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return { user, token };
};

export const loginUser = async (usernameOrEmail: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      firstName: true,
      lastName: true,
      username: true,
      avatarUrl: true,
      phoneNumber: true,
      city: true,
      country: true,
      bio: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getCurrentUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      avatarUrl: true,
      phoneNumber: true,
      city: true,
      country: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          trips: true,
          communityPosts: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User profile not found');
  }

  return user;
};
