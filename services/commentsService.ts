import apiClient from './api';

// Comment Types
export interface Comment {
  id: string;
  post_id: string;
  content: string;
  created_by: string;
  author?: {
    id: string;
    name: string;
    username: string;
    profile_image?: string;
  };
  likes_count: number;
  replies_count: number;
  parent_comment_id?: string;
  is_liked?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateCommentRequest {
  post_id: string;
  content: string;
  parent_comment_id?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class CommentsService {
  /**
   * Get comments for a post
   * GET /posts/{postId}/comments
   */
  static async getPostComments(
    postId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Comment>> {
    try {
      console.log('🔄 Fetching comments for post:', postId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/posts/${postId}/comments?${queryString}` : `/posts/${postId}/comments`;
      
      const response = await apiClient.get(url);
      console.log(`✅ Fetched ${response.data.data.length} comments`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching comments:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }

  /**
   * Create a new comment
   * POST /posts/{postId}/comments
   */
  static async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    try {
      if (!commentData.content.trim()) {
        throw new Error('Comment content is required');
      }

      console.log('🔄 Creating comment for post:', commentData.post_id);
      const response = await apiClient.post(`/posts/${commentData.post_id}/comments`, {
        content: commentData.content.trim(),
        parent_comment_id: commentData.parent_comment_id,
      });
      console.log('✅ Comment created successfully:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating comment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create comment');
    }
  }

  /**
   * Update a comment
   * PATCH /comments/{commentId}
   */
  static async updateComment(commentId: string, updateData: UpdateCommentRequest): Promise<Comment> {
    try {
      console.log('🔄 Updating comment:', commentId);
      const response = await apiClient.patch(`/comments/${commentId}`, updateData);
      console.log('✅ Comment updated successfully:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating comment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update comment');
    }
  }

  /**
   * Delete a comment
   * DELETE /comments/{commentId}
   */
  static async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Deleting comment:', commentId);
      const response = await apiClient.delete(`/comments/${commentId}`);
      console.log('✅ Comment deleted successfully:', commentId);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error deleting comment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  }

  /**
   * Like or unlike a comment
   * POST /comments/{commentId}/like
   */
  static async toggleCommentLike(
    commentId: string, 
    action: 'like' | 'unlike'
  ): Promise<{ success: boolean; likes_count: number }> {
    try {
      console.log(`🔄 ${action === 'like' ? 'Liking' : 'Unliking'} comment:`, commentId);
      const response = await apiClient.post(`/comments/${commentId}/like`, { action });
      console.log(`✅ Comment ${action}d successfully:`, commentId);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error ${action}ing comment:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || `Failed to ${action} comment`);
    }
  }

  /**
   * Report a comment
   * POST /comments/{commentId}/report
   */
  static async reportComment(
    commentId: string, 
    reason: string, 
    description?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Reporting comment:', commentId, 'for reason:', reason);
      const response = await apiClient.post(`/comments/${commentId}/report`, {
        reason,
        description: description?.trim(),
      });
      console.log('✅ Comment reported successfully:', commentId);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error reporting comment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to report comment');
    }
  }

  /**
   * Get replies to a comment
   * GET /comments/{commentId}/replies
   */
  static async getCommentReplies(
    commentId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Comment>> {
    try {
      console.log('🔄 Fetching replies for comment:', commentId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/comments/${commentId}/replies?${queryString}` : `/comments/${commentId}/replies`;
      
      const response = await apiClient.get(url);
      console.log(`✅ Fetched ${response.data.data.length} replies`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching replies:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch replies');
    }
  }
}
