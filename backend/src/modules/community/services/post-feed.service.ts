import { prisma } from '../../../config/prisma.config';
import { parsePagination, buildMeta } from '../../../utils/pagination.util';
import { Prisma } from '@prisma/client';

export const createPost = async (
  userId: string,
  data: {
    tripId?: string;
    title: string;
    content: string;
    imageUrl?: string;
    location?: string;
    category?: string;
  }
) => {
  return await prisma.communityPost.create({
    data: {
      userId,
      tripId: data.tripId || null,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || null,
      location: data.location || null,
      category: data.category || 'Travel Experience',
    },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      location: true,
      category: true,
      likesCount: true,
      viewsCount: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true },
      },
    },
  });
};

export const getPostsFeed = async (query: any, currentUserId?: string) => {
  const { page, limit, skip } = parsePagination(query);
  const { search, category, groupBy, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const whereClause: Prisma.CommunityPostWhereInput = {};

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { location: { contains: search } },
    ];
  }

  if (category) {
    whereClause.category = { equals: category };
  }

  const orderBy = { [sortBy]: sortOrder };

  const [posts, totalItems] = await Promise.all([
    prisma.communityPost.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        location: true,
        category: true,
        likesCount: true,
        viewsCount: true,
        createdAt: true,
        user: {
          select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true },
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

  // Bulk check if current user liked these posts (Rule 2: zero DB queries in loops)
  let userLikedPostIdsSet = new Set<string>();
  if (currentUserId && posts.length > 0) {
    const postIds = posts.map((p) => p.id);
    const userLikes = await prisma.postLike.findMany({
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
    isLiked: userLikedPostIdsSet.has(post.id),
  }));

  // Handle in-memory grouping if requested
  let groupedData: Record<string, typeof formattedPosts> | null = null;
  if (groupBy === 'category') {
    groupedData = formattedPosts.reduce((acc, p) => {
      const key = p.category || 'General';
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {} as Record<string, typeof formattedPosts>);
  } else if (groupBy === 'location') {
    groupedData = formattedPosts.reduce((acc, p) => {
      const key = p.location || 'Unknown Location';
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {} as Record<string, typeof formattedPosts>);
  }

  const meta = buildMeta(totalItems, page, limit);

  return {
    posts: groupedData || formattedPosts,
    isGrouped: !!groupedData,
    meta,
  };
};

export const getPostById = async (postId: string, currentUserId?: string) => {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      location: true,
      category: true,
      likesCount: true,
      viewsCount: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true },
      },
      trip: {
        select: { id: true, title: true, startDate: true, endDate: true },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!post) {
    throw new Error('Community post not found');
  }

  let isLiked = false;
  if (currentUserId) {
    const like = await prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId: currentUserId } },
      select: { id: true },
    });
    isLiked = !!like;
  }

  // Non-blocking view count update
  prisma.communityPost.update({
    where: { id: postId },
    data: { viewsCount: { increment: 1 } },
  }).catch((err) => console.error('Failed to update post viewsCount:', err));

  return { ...post, isLiked };
};
