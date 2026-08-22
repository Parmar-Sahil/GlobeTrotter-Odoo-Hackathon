import { prisma } from '../../../config/prisma.config';
import { parsePagination, buildMeta } from '../../../utils/pagination.util';

export const togglePostLike = async (postId: string, userId: string) => {
  const existingLike = await prisma.communityPostLike.findUnique({
    where: { postId_userId: { postId, userId } },
    select: { postId: true },
  });

  if (existingLike) {
    await prisma.communityPostLike.delete({
      where: { postId_userId: { postId, userId } },
    });
    return { isLiked: false, message: 'Post unliked successfully' };
  } else {
    await prisma.communityPostLike.create({
      data: { postId, userId },
    });
    return { isLiked: true, message: 'Post liked successfully' };
  }
};

export const addComment = async (
  postId: string,
  userId: string,
  content: string,
  parentId?: string
) => {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    throw new Error('Community post not found');
  }

  return await prisma.communityPostComment.create({
    data: {
      postId,
      userId,
      parentId: parentId || null,
      body: content,
    },
    select: {
      id: true,
      body: true,
      parentId: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, profilePhotoUrl: true },
      },
    },
  });
};

export const getPostComments = async (postId: string, query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const [comments, totalItems] = await Promise.all([
    prisma.communityPostComment.findMany({
      where: { postId, deletedAt: null },
      select: {
        id: true,
        body: true,
        parentId: true,
        createdAt: true,
        user: {
          select: { id: true, firstName: true, lastName: true, username: true, profilePhotoUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.communityPostComment.count({ where: { postId, deletedAt: null } }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { comments, meta };
};
