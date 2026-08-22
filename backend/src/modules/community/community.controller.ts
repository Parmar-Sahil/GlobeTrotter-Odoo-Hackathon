import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import { CommunityFacade } from './community.facade';
import { sendSuccess } from '../../utils/response.util';

export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const post = await CommunityFacade.createPost(userId, req.body);
    return sendSuccess(res, post, 'Community post created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

export const getPostsFeed = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user?.userId;
    const { posts, isGrouped, meta } = await CommunityFacade.getPostsFeed(req.query, currentUserId);
    return sendSuccess(
      res,
      posts,
      isGrouped ? 'Posts fetched and grouped successfully' : 'Community feed fetched successfully',
      200,
      meta
    );
  } catch (error) {
    return next(error);
  }
};

export const getPostById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user?.userId;
    const post = await CommunityFacade.getPostById(req.params.id, currentUserId);
    return sendSuccess(res, post, 'Post details fetched successfully');
  } catch (error) {
    return next(error);
  }
};

export const toggleLike = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await CommunityFacade.togglePostLike(req.params.id, userId);
    return sendSuccess(res, result, result.message);
  } catch (error) {
    return next(error);
  }
};

export const addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { content } = req.body;
    const comment = await CommunityFacade.addComment(req.params.id, userId, content);
    return sendSuccess(res, comment, 'Comment added successfully', 201);
  } catch (error) {
    return next(error);
  }
};

export const getComments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { comments, meta } = await CommunityFacade.getPostComments(req.params.id, req.query);
    return sendSuccess(res, comments, 'Comments fetched successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};
