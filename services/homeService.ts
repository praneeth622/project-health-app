import apiClient from './api';

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
  // Get current user profile
  static async getCurrentUser(): Promise<User> {
    try {
      // For now, we'll use a mock user ID - replace with actual auth user ID
      const mockUserId = 'user-uuid-1';
      const response = await apiClient.get(`/users/${mockUserId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  // Get user's health logs for today's goals
  static async getTodayHealthLogs(userId: string): Promise<HealthLog[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiClient.get(`/health-logs/user/${userId}/range`, {
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
  static async getWeeklyStats(userId: string) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      
      const response = await apiClient.get(`/health-logs/user/${userId}/stats`, {
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
  static async getUserChallenges(userId: string): Promise<Challenge[]> {
    try {
      const response = await apiClient.get(`/challenges/user/${userId}`);
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
  static async logHealthData(userId: string, type: string, value: number, unit: string): Promise<HealthLog> {
    try {
      const response = await apiClient.post('/health-logs', {
        user_id: userId,
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
}