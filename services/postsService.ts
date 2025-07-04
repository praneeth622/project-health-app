import apiClient from './api';
import { supabase } from '@/lib/supabase';

// Post Types
export type PostType = 'text' | 'image' | 'video' | 'workout' | 'health';
export type PostPrivacy = 'public' | 'friends' | 'private';

export interface Post {
  id: string;
  content: string;
  type: PostType;
  privacy: PostPrivacy;
  image_urls?: string[];
  video_url?: string;
  workout_data?: {
    workout_id: string;
    workout_name: string;
    duration_minutes: number;
    calories_burned?: number;
  };
  health_data?: {
    metric_type: string;
    value: number;
    unit: string;
  };
  tags?: string[];
  location?: string;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_by: string;
  author?: {
    id: string;
    name: string;
    username: string;
    profile_image?: string;
    is_verified?: boolean;
  };
  created_at: string;
  updated_at?: string;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_following_author?: boolean;
}

export interface CreatePostRequest {
  content: string;
  type: PostType;
  privacy: PostPrivacy;
  image_urls?: string[];
  video_url?: string;
  workout_data?: {
    workout_id: string;
    workout_name: string;
    duration_minutes: number;
    calories_burned?: number;
  };
  health_data?: {
    metric_type: string;
    value: number;
    unit: string;
  };
  tags?: string[];
  location?: string;
}

export interface UpdatePostRequest {
  content?: string;
  privacy?: PostPrivacy;
  tags?: string[];
  location?: string;
}

export interface PostFilters {
  type?: PostType;
  author_id?: string;
  tags?: string[];
  location?: string;
  date_from?: string;
  date_to?: string;
}

export interface PostStats {
  post_id: string;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_views: number;
  engagement_rate: number;
  like_breakdown: {
    today: number;
    week: number;
    month: number;
  };
  comment_breakdown: {
    today: number;
    week: number;
    month: number;
  };
  demographic_data?: {
    age_groups: Record<string, number>;
    locations: Record<string, number>;
  };
}

export interface LikePostRequest {
  post_id: string;
  action: 'like' | 'unlike';
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

export class PostsService {
  // Get current authenticated user's ID
  private static async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }
      return user?.id || null;
    } catch (error) {
      console.error('Error in getCurrentUserId:', error);
      return null;
    }
  }

  /**
   * Create a new post
   * POST /posts
   */
  static async createPost(postData: CreatePostRequest): Promise<Post> {
    try {
      // Validate required fields
      if (!postData.content.trim()) {
        throw new Error('Post content is required');
      }

      console.log('🔄 Creating new post:', postData.type);
      const response = await apiClient.post('/posts', {
        ...postData,
        content: postData.content.trim(),
      });
      console.log('✅ Post created successfully:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating post:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  }

  /**
   * Get all public posts
   * GET /posts/public
   */
  static async getPublicPosts(
    filters?: PostFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Post>> {
    try {
      console.log('🔄 Fetching public posts with filters:', filters);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      if (filters?.type) params.append('type', filters.type);
      if (filters?.author_id) params.append('author_id', filters.author_id);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.date_from) params.append('date_from', filters.date_from);
      if (filters?.date_to) params.append('date_to', filters.date_to);
      if (filters?.tags) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }

      const queryString = params.toString();
      const url = queryString ? `/posts/public?${queryString}` : '/posts/public';
      
      const response = await apiClient.get(url);
      console.log(`✅ Fetched ${response.data.data.length} public posts`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching public posts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch public posts');
    }
  }

  /**
   * Get posts by a specific user
   * GET /posts/user/{userId}
   */
  static async getPostsByUser(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Post>> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔄 Fetching posts by user:', targetUserId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/posts/user/${targetUserId}?${queryString}` : `/posts/user/${targetUserId}`;
      
      const response = await apiClient.get(url);
      console.log(`✅ Fetched ${response.data.data.length} posts for user:`, targetUserId);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching user posts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }

  /**
   * Search posts by content or tags
   * GET /posts/search
   */
  static async searchPosts(
    query: string,
    filters?: PostFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Post>> {
    try {
      if (!query.trim()) {
        throw new Error('Search query is required');
      }

      console.log('🔄 Searching posts with query:', query);
      
      const params = new URLSearchParams();
      params.append('q', query.trim());
      
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      if (filters?.type) params.append('type', filters.type);
      if (filters?.author_id) params.append('author_id', filters.author_id);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.date_from) params.append('date_from', filters.date_from);
      if (filters?.date_to) params.append('date_to', filters.date_to);
      if (filters?.tags) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }

      const response = await apiClient.get(`/posts/search?${params.toString()}`);
      console.log(`✅ Found ${response.data.data.length} posts matching query:`, query);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error searching posts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to search posts');
    }
  }

  /**
   * Get post by ID
   * GET /posts/{id}
   */
  static async getPostById(postId: string): Promise<Post> {
    try {
      console.log('🔄 Fetching post:', postId);
      const response = await apiClient.get(`/posts/${postId}`);
      console.log('✅ Post fetched successfully:', response.data.content?.substring(0, 50) + '...');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching post:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch post');
    }
  }

  /**
   * Update post by ID
   * PATCH /posts/{id}
   */
  static async updatePost(postId: string, updateData: UpdatePostRequest): Promise<Post> {
    try {
      console.log('🔄 Updating post:', postId, updateData);
      const response = await apiClient.patch(`/posts/${postId}`, updateData);
      console.log('✅ Post updated successfully:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating post:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update post');
    }
  }

  /**
   * Delete post by ID
   * DELETE /posts/{id}
   */
  static async deletePost(postId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Deleting post:', postId);
      const response = await apiClient.delete(`/posts/${postId}`);
      console.log('✅ Post deleted successfully:', postId);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error deleting post:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete post');
    }
  }

  /**
   * Like or unlike a post
   * POST /posts/like
   */
  static async togglePostLike(postId: string, action: 'like' | 'unlike'): Promise<{ success: boolean; likes_count: number }> {
    try {
      console.log(`🔄 ${action === 'like' ? 'Liking' : 'Unliking'} post:`, postId);
      const response = await apiClient.post('/posts/like', {
        post_id: postId,
        action,
      });
      console.log(`✅ Post ${action}d successfully:`, postId);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error ${action}ing post:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || `Failed to ${action} post`);
    }
  }

  /**
   * Get post engagement statistics
   * GET /posts/{id}/stats
   */
  static async getPostStats(postId: string): Promise<PostStats> {
    try {
      console.log('🔄 Fetching post stats:', postId);
      const response = await apiClient.get(`/posts/${postId}/stats`);
      console.log('✅ Post stats fetched successfully:', postId);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching post stats:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch post stats');
    }
  }

  /**
   * Get trending posts (custom method)
   * This could be implemented as a filter on public posts
   */
  static async getTrendingPosts(
    timeframe: 'day' | 'week' | 'month' = 'week',
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Post>> {
    try {
      console.log('🔄 Fetching trending posts for timeframe:', timeframe);
      
      const params = new URLSearchParams();
      params.append('trending', 'true');
      params.append('timeframe', timeframe);
      
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());

      const response = await apiClient.get(`/posts/public?${params.toString()}`);
      console.log(`✅ Fetched ${response.data.data.length} trending posts`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching trending posts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch trending posts');
    }
  }

  /**
   * Get posts from followed users (feed)
   * This could be implemented as a custom endpoint or filter
   */
  static async getFeedPosts(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Post>> {
    try {
      console.log('🔄 Fetching feed posts');
      
      const params = new URLSearchParams();
      params.append('feed', 'true');
      
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());

      const response = await apiClient.get(`/posts/public?${params.toString()}`);
      console.log(`✅ Fetched ${response.data.data.length} feed posts`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching feed posts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch feed posts');
    }
  }

  /**
   * Report a post (custom method)
   */
  static async reportPost(
    postId: string, 
    reason: string, 
    description?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Reporting post:', postId, 'for reason:', reason);
      const response = await apiClient.post(`/posts/${postId}/report`, {
        reason,
        description: description?.trim(),
      });
      console.log('✅ Post reported successfully:', postId);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error reporting post:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to report post');
    }
  }

  /**
   * Bookmark/unbookmark a post (custom method)
   */
  static async togglePostBookmark(
    postId: string, 
    action: 'bookmark' | 'unbookmark'
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🔄 ${action === 'bookmark' ? 'Bookmarking' : 'Unbookmarking'} post:`, postId);
      const response = await apiClient.post(`/posts/${postId}/bookmark`, {
        action,
      });
      console.log(`✅ Post ${action}ed successfully:`, postId);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error ${action}ing post:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || `Failed to ${action} post`);
    }
  }
}
