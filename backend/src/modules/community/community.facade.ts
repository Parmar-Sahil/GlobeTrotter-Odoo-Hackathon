import * as postFeedService from './services/post-feed.service';
import * as postInteractionService from './services/post-interaction.service';

export class CommunityFacade {
  static async createPost(userId: string, data: any) {
    return await postFeedService.createPost(userId, data);
  }

  static async getPostsFeed(query: any, currentUserId?: string) {
    return await postFeedService.getPostsFeed(query, currentUserId);
  }

  static async getPostById(postId: string, currentUserId?: string) {
    return await postFeedService.getPostById(postId, currentUserId);
  }

  static async togglePostLike(postId: string, userId: string) {
    return await postInteractionService.togglePostLike(postId, userId);
  }

  static async addComment(postId: string, userId: string, content: string) {
    return await postInteractionService.addComment(postId, userId, content);
  }

  static async getPostComments(postId: string, query: any) {
    return await postInteractionService.getPostComments(postId, query);
  }
}
