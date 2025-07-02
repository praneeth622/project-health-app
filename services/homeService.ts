import apiClient from './api';
import { supabase } from '@/lib/supabase';

// Types based on your API schema
export interface User {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  bio: string;
  health_goals: {
    weight_loss: boolean;
    muscle_gain: boolean;
    endurance: boolean;
    fitness?: boolean;
  };
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  height: number;
  weight: number;
  is_active: boolean;
  created_at: string;
}

export interface HealthLog {
  id: string;
  user_id: string;
  type: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  value: number;
  unit: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group';
  difficulty: 'easy' | 'medium' | 'hard';
  duration_days: number;
  target_value: number;
  target_unit: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'workout' | 'achievement';
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export class HomeService {
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

  // Get current user profile using authenticated user ID
  static async getCurrentUser(): Promise<User> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        throw new Error('No authenticated user found');
      }

      console.log('🔍 Fetching user profile for ID:', userId);
      console.log('🔍 User ID type:', typeof userId);
      console.log('🔍 User ID length:', userId.length);
      
      const response = await apiClient.get(`/users/${userId}`);
      console.log('✅ User profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      throw error;
    }
  }

  // Alternative method to get user profile using the /me endpoint
  static async getCurrentUserProfile(): Promise<User> {
    try {
      console.log('🔍 Fetching current user profile via /me endpoint');
      const response = await apiClient.get('/users/me/profile');
      console.log('✅ User profile via /me response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch user profile via /me:', error);
      console.log('🔄 Falling back to ID-based method...');
      // Fallback to the ID-based method
      return this.getCurrentUser();
    }
  }

  // Get user's health logs for today's goals
  static async getTodayHealthLogs(userId?: string): Promise<HealthLog[]> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      const today = new Date().toISOString().split('T')[0];
      const response = await apiClient.get(`/health-logs/user/${targetUserId}/range`, {
        params: {
          start_date: today,
          end_date: today
        }
      });
      return response.data.health_logs || [];
    } catch (error) {
      console.error('Failed to fetch health logs:', error);
      return [];
    }
  }

  // Get user's health statistics for activity chart
  static async getWeeklyStats(userId?: string) {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      
      const response = await apiClient.get(`/health-logs/user/${targetUserId}/stats`, {
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          type: 'exercise'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch weekly stats:', error);
      return null;
    }
  }

  // Get user's active challenges (achievements)
  static async getUserChallenges(userId?: string): Promise<Challenge[]> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      const response = await apiClient.get(`/challenges/user/${targetUserId}`);
      return response.data.challenges || [];
    } catch (error) {
      console.error('Failed to fetch user challenges:', error);
      return [];
    }
  }

  // Get recent public posts for community feed
  static async getRecentPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
    try {
      const response = await apiClient.get('/posts/public', {
        params: { page, limit }
      });
      return response.data.posts || [];
    } catch (error) {
      console.error('Failed to fetch recent posts:', error);
      return [];
    }
  }

  // Create a health log entry
  static async logHealthData(type: string, value: number, unit: string, userId?: string): Promise<HealthLog> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      const response = await apiClient.post('/health-logs', {
        user_id: targetUserId,
        type,
        value,
        unit,
        date: new Date().toISOString(),
        notes: `Logged from mobile app`
      });
      return response.data;
    } catch (error) {
      console.error('Failed to log health data:', error);
      throw error;
    }
  }

  // Verify authentication token with backend
  static async verifyToken(): Promise<any> {
    try {
      console.log('🔍 Verifying token with backend...');
      const response = await apiClient.post('/auth/verify-token');
      console.log('✅ Token verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to verify token:', error);
      throw error;
    }
  }


}