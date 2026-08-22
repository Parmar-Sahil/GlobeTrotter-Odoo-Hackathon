import { prisma } from '../../../config/prisma.config';
import { parsePagination, buildMeta } from '../../../utils/pagination.util';

export const togglePostLike = async (postId: string, userId: string) => {
  const existingLike = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId } },
    select: { id: true },
  });

  if (existingLike) {
    // Unlike post
    await prisma.$transaction([
      prisma.postLike.delete({ where: { id: existingLike.id } }),
      prisma.communityPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
    return { isLiked: false, message: 'Post unliked successfully' };
  } else {
    // Like post
    await prisma.$transaction([
      prisma.postLike.create({
        data: { postId, userId },
      }),
      prisma.communityPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);
    return { isLiked: true, message: 'Post liked successfully' };
  }
};

export const addComment = async (postId: string, userId: string, content: string) => {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    throw new Error('Community post not found');
  }

  return await prisma.postComment.create({
    data: {
      postId,
      userId,
      content,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true },
      },
    },
  });
};

export const getPostComments = async (postId: string, query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const [comments, totalItems] = await Promise.all([
    prisma.postComment.findMany({
      where: { postId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.postComment.count({ where: { postId } }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { comments, meta };
};
