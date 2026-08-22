import { Router } from 'express';
import * as communityController from './community.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createPostSchema, searchPostSchema, createCommentSchema } from './community.schema';

const router = Router();

router.get('/posts', validateRequest(searchPostSchema), communityController.getPostsFeed);
router.post('/posts', authenticate, validateRequest(createPostSchema), communityController.createPost);
router.get('/posts/:id', communityController.getPostById);
router.post('/posts/:id/like', authenticate, communityController.toggleLike);
router.post('/posts/:id/comments', authenticate, validateRequest(createCommentSchema), communityController.addComment);
router.get('/posts/:id/comments', communityController.getComments);

export default router;
