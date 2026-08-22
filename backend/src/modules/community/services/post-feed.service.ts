import { prisma } from '../../../config/prisma.config';
import { parsePagination, buildMeta } from '../../../utils/pagination.util';
import { Prisma } from '@prisma/client';
import { PostStatus } from '../../../types/enums';

export const createPost = async (
  userId: string,
  data: {
    tripId?: string;
    activityId?: string;
    cityId?: string;
    title?: string;
    content?: string;
    body?: string;
    imageUrl?: string;
    imageUrls?: string[];
    tags?: string[];
    location?: string;
    category?: string;
  }
) => {
  const images = data.imageUrls || (data.imageUrl ? [data.imageUrl] : []);
  const tagsList = data.tags || (data.category ? [data.category] : []);

  return await prisma.communityPost.create({
    data: {
      userId,
      tripId: data.tripId || null,
      activityId: data.activityId || null,
      cityId: data.cityId || null,
      title: data.title || null,
      body: data.body || data.content || '',
      imageUrls: JSON.stringify(images),
      tags: JSON.stringify(tagsList),
      status: PostStatus.PUBLISHED,
    },
    select: {
      id: true,
      title: true,
      body: true,
      imageUrls: true,
      tags: true,
      status: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, profilePhotoUrl: true },
      },
    },
  });
};

export const getPostsFeed = async (query: any, currentUserId?: string) => {
  const { page, limit, skip } = parsePagination(query);
  const { search, category, groupBy, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const whereClause: Prisma.CommunityPostWhereInput = {
    status: PostStatus.PUBLISHED,
    deletedAt: null,
  };

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { body: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  const orderBy = { [sortBy]: sortOrder };

  const [posts, totalItems] = await Promise.all([
    prisma.communityPost.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        body: true,
        imageUrls: true,
        tags: true,
        status: true,
        createdAt: true,
        user: {
          select: { id: true, firstName: true, lastName: true, username: true, profilePhotoUrl: true },
        },
        city: {
          select: { id: true, name: true, country: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.communityPost.count({ where: whereClause }),
  ]);

  let userLikedPostIdsSet = new Set<string>();
  if (currentUserId && posts.length > 0) {
    const postIds = posts.map((p) => p.id);
    const userLikes = await prisma.communityPostLike.findMany({
      where: {
        userId: currentUserId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });
    userLikedPostIdsSet = new Set(userLikes.map((l) => l.postId));
  }

  const formattedPosts = posts.map((post) => ({
    ...post,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    isLiked: userLikedPostIdsSet.has(post.id),
  }));

  const meta = buildMeta(totalItems, page, limit);

  return {
    posts: formattedPosts,
    isGrouped: false,
    meta,
  };
};

export const getPostById = async (postId: string, currentUserId?: string) => {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      body: true,
      imageUrls: true,
      tags: true,
      status: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, profilePhotoUrl: true },
      },
      trip: {
        select: { id: true, name: true, startDate: true, endDate: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  if (!post) {
    throw new Error('Community post not found');
  }

  let isLiked = false;
  if (currentUserId) {
    const like = await prisma.communityPostLike.findUnique({
      where: { postId_userId: { postId, userId: currentUserId } },
      select: { postId: true },
    });
    isLiked = !!like;
  }

  return { ...post, likesCount: post._count.likes, isLiked };
};
