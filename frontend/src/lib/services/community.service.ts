import apiClient from "../api";
import { ApiResponse } from "@/types";

export interface CommunityPost {
  id: string;
  tripId?: string;
  userId: string;
  title: string;
  body: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  trip?: any;
  comments?: any[];
}

export interface CreatePostDto {
  tripId?: string;
  title: string;
  body: string;
}

export const communityService = {
  async getPosts(params?: { page?: number; limit?: number }): Promise<{ posts: CommunityPost[]; meta?: any }> {
    const res = await apiClient.get<ApiResponse<CommunityPost[]>>("/community/posts", {
      params,
    });
    return {
      posts: res.data.data || [],
      meta: (res.data as any).meta,
    };
  },

  async createPost(data: CreatePostDto): Promise<CommunityPost> {
    const res = await apiClient.post<ApiResponse<CommunityPost>>("/community/posts", data);
    return res.data.data!;
  },

  async toggleLike(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const res = await apiClient.post<ApiResponse<{ liked: boolean; likesCount: number }>>(
      `/community/posts/${postId}/like`
    );
    return res.data.data!;
  },

  async addComment(postId: string, content: string): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `/community/posts/${postId}/comments`,
      { content }
    );
    return res.data.data!;
  },
};
