import apiClient from './api';
import { supabase } from '@/lib/supabase';

// Challenge Types
export type ChallengeType = 'individual' | 'group';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type ChallengeCategory = 'steps' | 'water' | 'exercise' | 'weight_loss' | 'distance' | 'time' | 'custom';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  duration_days: number;
  target_value: number;
  target_unit: string;
  is_public: boolean;
  status: ChallengeStatus;
  start_date: string;
  end_date: string;
  created_by: string;
  creator?: {
    id: string;
    name: string;
    profile_image?: string;
  };
  participants_count: number;
  max_participants?: number;
  prize_description?: string;
  rules?: string;
  tags?: string[];
  image_url?: string;
  created_at: string;
  updated_at?: string;
  is_participating?: boolean;
  user_progress?: ChallengeProgress;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  duration_days: number;
  target_value: number;
  target_unit: string;
  is_public: boolean;
  start_date: string;
  max_participants?: number;
  prize_description?: string;
  rules?: string;
  tags?: string[];
  image_url?: string;
}

export interface UpdateChallengeRequest {
  title?: string;
  description?: string;
  type?: ChallengeType;
  category?: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
  duration_days?: number;
  target_value?: number;
  target_unit?: string;
  is_public?: boolean;
  start_date?: string;
  max_participants?: number;
  prize_description?: string;
  rules?: string;
  tags?: string[];
  image_url?: string;
  status?: ChallengeStatus;
}

export interface ChallengeProgress {
  id: string;
  challenge_id: string;
  user_id: string;
  current_value: number;
  progress_percentage: number;
  last_updated: string;
  is_completed: boolean;
  completed_at?: string;
  notes?: string;
  user?: {
    id: string;
    name: string;
    profile_image?: string;
  };
}

export interface UpdateProgressRequest {
  challenge_id: string;
  current_value: number;
  notes?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user: {
    id: string;
    name: string;
    profile_image?: string;
  };
  current_value: number;
  progress_percentage: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface ChallengeFilters {
  category?: ChallengeCategory;
  type?: ChallengeType;
  difficulty?: ChallengeDifficulty;
  status?: ChallengeStatus;
  search?: string;
  tags?: string[];
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

export class ChallengeService {
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
   * Create a new challenge
   * POST /challenges
   */
  static async createChallenge(challengeData: CreateChallengeRequest): Promise<Challenge> {
    try {
      // Validate required fields
      if (!challengeData.title.trim()) {
        throw new Error('Challenge title is required');
      }
      if (!challengeData.description.trim()) {
        throw new Error('Challenge description is required');
      }
      if (challengeData.duration_days <= 0) {
        throw new Error('Duration must be greater than 0 days');
      }
      if (challengeData.target_value <= 0) {
        throw new Error('Target value must be greater than 0');
      }

      console.log('🔄 Creating new challenge:', challengeData.title);
      const response = await apiClient.post('/challenges', challengeData);
      console.log('✅ Challenge created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating challenge:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create challenge');
    }
  }

  /**
   * Get all public challenges
   * GET /challenges/public
   */
  static async getPublicChallenges(
    filters?: ChallengeFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Challenge>> {
    try {
      console.log('🔄 Fetching public challenges with filters:', filters);
      
      const params = new URLSearchParams();
      
      // Add filters
      if (filters?.category) params.append('category', filters.category);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      
      // Add pagination
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/challenges/public?${queryString}` : '/challenges/public';
      
      const response = await apiClient.get(url);
      console.log('✅ Public challenges fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching public challenges:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch public challenges');
    }
  }

  /**
   * Get challenges created by a specific user
   * GET /challenges/creator/{creatorId}
   */
  static async getChallengesByCreator(
    creatorId?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Challenge>> {
    try {
      const targetCreatorId = creatorId || await this.getCurrentUserId();
      if (!targetCreatorId) {
        throw new Error('No creator ID available');
      }

      console.log('🔄 Fetching challenges by creator:', targetCreatorId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/challenges/creator/${targetCreatorId}?${queryString}` : `/challenges/creator/${targetCreatorId}`;
      
      const response = await apiClient.get(url);
      console.log('✅ Creator challenges fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching creator challenges:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch creator challenges');
    }
  }

  /**
   * Get challenges that a user is participating in
   * GET /challenges/user/{userId}
   */
  static async getUserChallenges(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Challenge>> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔄 Fetching user challenges:', targetUserId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/challenges/user/${targetUserId}?${queryString}` : `/challenges/user/${targetUserId}`;
      
      const response = await apiClient.get(url);
      console.log('✅ User challenges fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching user challenges:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user challenges');
    }
  }

  /**
   * Get challenge by ID
   * GET /challenges/{id}
   */
  static async getChallengeById(challengeId: string): Promise<Challenge> {
    try {
      console.log('🔄 Fetching challenge by ID:', challengeId);
      const response = await apiClient.get(`/challenges/${challengeId}`);
      console.log('✅ Challenge fetched successfully:', response.data.title);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching challenge:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch challenge');
    }
  }

  /**
   * Update challenge by ID
   * PATCH /challenges/{id}
   */
  static async updateChallenge(challengeId: string, updateData: UpdateChallengeRequest): Promise<Challenge> {
    try {
      console.log('🔄 Updating challenge:', challengeId, updateData);
      const response = await apiClient.patch(`/challenges/${challengeId}`, updateData);
      console.log('✅ Challenge updated successfully:', response.data.title);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating challenge:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update challenge');
    }
  }

  /**
   * Delete challenge by ID
   * DELETE /challenges/{id}
   */
  static async deleteChallenge(challengeId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Deleting challenge:', challengeId);
      const response = await apiClient.delete(`/challenges/${challengeId}`);
      console.log('✅ Challenge deleted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error deleting challenge:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete challenge');
    }
  }

  /**
   * Join a challenge
   * POST /challenges/{id}/join
   */
  static async joinChallenge(challengeId: string): Promise<ChallengeProgress> {
    try {
      console.log('🔄 Joining challenge:', challengeId);
      const response = await apiClient.post(`/challenges/${challengeId}/join`);
      console.log('✅ Successfully joined challenge');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error joining challenge:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to join challenge');
    }
  }

  /**
   * Leave a challenge
   * DELETE /challenges/{id}/leave/{userId}
   */
  static async leaveChallenge(challengeId: string, userId?: string): Promise<{ success: boolean; message: string }> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔄 Leaving challenge:', challengeId);
      const response = await apiClient.delete(`/challenges/${challengeId}/leave/${targetUserId}`);
      console.log('✅ Successfully left challenge');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error leaving challenge:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to leave challenge');
    }
  }

  /**
   * Update progress for a challenge
   * POST /challenges/progress
   */
  static async updateProgress(progressData: UpdateProgressRequest): Promise<ChallengeProgress> {
    try {
      console.log('🔄 Updating challenge progress:', progressData);
      const response = await apiClient.post('/challenges/progress', progressData);
      console.log('✅ Progress updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating progress:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update progress');
    }
  }

  /**
   * Get user progress for a specific challenge
   * GET /challenges/{id}/progress/{userId}
   */
  static async getUserProgress(challengeId: string, userId?: string): Promise<ChallengeProgress> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔄 Fetching user progress for challenge:', challengeId, 'user:', targetUserId);
      const response = await apiClient.get(`/challenges/${challengeId}/progress/${targetUserId}`);
      console.log('✅ User progress fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching user progress:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user progress');
    }
  }

  /**
   * Get challenge leaderboard
   * GET /challenges/{id}/leaderboard
   */
  static async getChallengeLeaderboard(
    challengeId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<LeaderboardEntry>> {
    try {
      console.log('🔄 Fetching challenge leaderboard:', challengeId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/challenges/${challengeId}/leaderboard?${queryString}` : `/challenges/${challengeId}/leaderboard`;
      
      const response = await apiClient.get(url);
      console.log('✅ Challenge leaderboard fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching challenge leaderboard:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch challenge leaderboard');
    }
  }

  /**
   * Search challenges
   */
  static async searchChallenges(
    query: string,
    filters?: Omit<ChallengeFilters, 'search'>,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Challenge>> {
    try {
      console.log('🔄 Searching challenges with query:', query);
      
      const searchFilters: ChallengeFilters = {
        ...filters,
        search: query
      };
      
      return await this.getPublicChallenges(searchFilters, pagination);
    } catch (error: any) {
      console.error('❌ Error searching challenges:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to search challenges');
    }
  }

  /**
   * Get challenge statistics
   */
  static async getChallengeStats(challengeId: string): Promise<{
    participants_count: number;
    completion_rate: number;
    average_progress: number;
    active_participants: number;
    days_remaining?: number;
  }> {
    try {
      console.log('🔄 Fetching challenge stats for:', challengeId);
      const response = await apiClient.get(`/challenges/${challengeId}/stats`);
      console.log('✅ Challenge stats fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching challenge stats:', error.response?.data || error.message);
      // If stats endpoint doesn't exist, calculate basic stats from challenge data
      const challenge = await this.getChallengeById(challengeId);
      return {
        participants_count: challenge.participants_count || 0,
        completion_rate: 0,
        average_progress: 0,
        active_participants: challenge.participants_count || 0
      };
    }
  }
}
