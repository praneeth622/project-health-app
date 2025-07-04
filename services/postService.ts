import apiClient from './api';
import { supabase } from '@/lib/supabase';

// Post Types
export type PostType = 'text' | 'image' | 'workout' | 'achievement' | 'challenge';
export type PostPrivacy = 'public' | 'friends' | 'private';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: PostType;
  privacy: PostPrivacy;
  image_url?: string;
  workout_data?: WorkoutData;
  achievement_data?: AchievementData;
  challenge_id?: string;
  tags?: string[];
  location?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at?: string;
  user?: PostUser;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface PostUser {
  id: string;
  name: string;
  username?: string;
  profile_image?: string;
  is_verified?: boolean;
}

export interface WorkoutData {
  exercise_type: string;
  duration_minutes?: number;
  calories_burned?: number;
  distance_km?: number;
  notes?: string;
}

export interface AchievementData {
  achievement_type: string;
  title: string;
  description: string;
  icon?: string;
  value?: number;
  unit?: string;
}

export interface CreatePostRequest {
  content: string;
  type: PostType;
  privacy?: PostPrivacy;
  image_url?: string;
  workout_data?: WorkoutData;
  achievement_data?: AchievementData;
  challenge_id?: string;
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
  user_id?: string;
  challenge_id?: string;
  tags?: string[];
  location?: string;
  start_date?: string;
  end_date?: string;
}

export interface PostStats {
  likes_count: number;
  comments_count: number;
  shares_count: number;
  reach: number;
  engagement_rate: number;
}

export interface LikePostRequest {
  post_id: string;
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

export class PostService {
  // Get current authenticated user's ID
  private static async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch (error) {
      console.error('Failed to get current user ID:', error);
      return null;
    }
  }

  /**
   * Create a new post
   * POST /posts
   */
  static async createPost(postData: CreatePostRequest): Promise<Post> {
    try {
      console.log('🔄 Creating new post:', postData.type);
      
      // Validate required fields
      if (!postData.content.trim()) {
        throw new Error('Post content is required');
      }

      const response = await apiClient.post('/posts', {
        ...postData,
        privacy: postData.privacy || 'public',
      });
      
      console.log('✅ Post created successfully:', response.data);
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
      if (filters?.challenge_id) params.append('challenge_id', filters.challenge_id);
      if (filters?.tags) params.append('tags', filters.tags.join(','));
      if (filters?.location) params.append('location', filters.location);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);
      
      const queryString = params.toString();
      const url = queryString ? `/posts/public?${queryString}` : '/posts/public';
      
      const response = await apiClient.get(url);
      console.log('✅ Public posts fetched successfully:', response.data);
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
  static async getUserPosts(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Post>> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔄 Fetching posts for user:', targetUserId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/posts/user/${targetUserId}?${queryString}` : `/posts/user/${targetUserId}`;
      
      const response = await apiClient.get(url);
      console.log('✅ User posts fetched successfully:', response.data);
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
      console.log('🔄 Searching posts with query:', query);
      
      const params = new URLSearchParams();
      params.append('q', query);
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.user_id) params.append('user_id', filters.user_id);
      if (filters?.tags) params.append('tags', filters.tags.join(','));
      
      const response = await apiClient.get(`/posts/search?${params.toString()}`);
      console.log('✅ Post search completed successfully:', response.data);
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
      console.log('🔄 Fetching post by ID:', postId);
      const response = await apiClient.get(`/posts/${postId}`);
      console.log('✅ Post fetched successfully:', response.data.content);
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
      console.log('✅ Post updated successfully:', response.data.content);
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
      console.log('✅ Post deleted successfully');
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
  static async toggleLikePost(postId: string): Promise<{ is_liked: boolean; likes_count: number }> {
    try {
      console.log('🔄 Toggling like for post:', postId);
      const response = await apiClient.post('/posts/like', { post_id: postId });
      console.log('✅ Post like toggled successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error toggling post like:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to toggle post like');
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
      console.log('✅ Post stats fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching post stats:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch post stats');
    }
  }

  /**
   * Get posts for current user's feed (following users)
   * GET /posts/feed
   */
  static async getFeedPosts(pagination?: PaginationParams): Promise<PaginatedResponse<Post>> {
    try {
      console.log('🔄 Fetching feed posts');
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/posts/feed?${queryString}` : '/posts/feed';
      
      const response = await apiClient.get(url);
      console.log('✅ Feed posts fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching feed posts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch feed posts');
    }
  }

  /**
   * Create a workout post
   */
  static async createWorkoutPost(
    content: string,
    workoutData: WorkoutData,
    privacy: PostPrivacy = 'public'
  ): Promise<Post> {
    return this.createPost({
      content,
      type: 'workout',
      privacy,
      workout_data: workoutData,
    });
  }

  /**
   * Create an achievement post
   */
  static async createAchievementPost(
    content: string,
    achievementData: AchievementData,
    privacy: PostPrivacy = 'public'
  ): Promise<Post> {
    return this.createPost({
      content,
      type: 'achievement',
      privacy,
      achievement_data: achievementData,
    });
  }

  /**
   * Create a challenge-related post
   */
  static async createChallengePost(
    content: string,
    challengeId: string,
    privacy: PostPrivacy = 'public'
  ): Promise<Post> {
    return this.createPost({
      content,
      type: 'challenge',
      privacy,
      challenge_id: challengeId,
    });
  }
}
