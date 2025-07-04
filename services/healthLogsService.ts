import apiClient from './api';
import { supabase } from '@/lib/supabase';

export interface HealthLog {
  id: string;
  user_id: string;
  type: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  value: number;
  unit: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface HealthLogStats {
  total_logs: number;
  average_value: number;
  max_value: number;
  min_value: number;
  trend: 'up' | 'down' | 'stable';
  period_start: string;
  period_end: string;
}

export interface CreateHealthLogRequest {
  type: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  value: number;
  unit: string;
  date?: string;
  notes?: string;
}

export interface UpdateHealthLogRequest {
  type?: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  value?: number;
  unit?: string;
  date?: string;
  notes?: string;
}

export interface HealthLogFilters {
  type?: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  start_date?: string;
  end_date?: string;
}

/**
 * Health Logs API Service
 * Provides comprehensive health logging and tracking functionality
 */
export class HealthLogsService {
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
   * Create a new health log entry
   * POST /health-logs
   */
  static async createHealthLog(logData: CreateHealthLogRequest): Promise<HealthLog> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('🔄 Creating health log:', logData.type, logData.value);
      
      const requestData = {
        user_id: userId,
        type: logData.type,
        value: logData.value,
        unit: logData.unit,
        date: logData.date || new Date().toISOString(),
        notes: logData.notes || `Logged via mobile app`
      };

      const response = await apiClient.post('/health-logs', requestData);
      console.log('✅ Health log created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating health log:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create health log');
    }
  }

  /**
   * Get health logs for current user
   * GET /health-logs/user/{userId}
   */
  static async getUserHealthLogs(
    userId?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ health_logs: HealthLog[]; pagination: any }> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔍 Fetching health logs for user:', targetUserId);
      
      const response = await apiClient.get(`/health-logs/user/${targetUserId}`, {
        params: { page, limit }
      });
      
      console.log('✅ Health logs fetched successfully:', response.data);
      return {
        health_logs: response.data.health_logs || [],
        pagination: response.data.pagination || {}
      };
    } catch (error: any) {
      console.error('❌ Error fetching health logs:', error.response?.data || error.message);
      return { health_logs: [], pagination: {} };
    }
  }

  /**
   * Get health logs within date range
   * GET /health-logs/user/{userId}/range
   */
  static async getHealthLogsInRange(
    startDate: string,
    endDate: string,
    userId?: string,
    type?: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep'
  ): Promise<HealthLog[]> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔍 Fetching health logs in range:', startDate, 'to', endDate);
      
      const params: any = {
        start_date: startDate,
        end_date: endDate
      };
      
      if (type) {
        params.type = type;
      }

      const response = await apiClient.get(`/health-logs/user/${targetUserId}/range`, {
        params
      });
      
      console.log('✅ Health logs in range fetched successfully');
      return response.data.health_logs || [];
    } catch (error: any) {
      console.error('❌ Error fetching health logs in range:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Get health statistics for user
   * GET /health-logs/user/{userId}/stats
   */
  static async getHealthStats(
    startDate: string,
    endDate: string,
    type: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep',
    userId?: string
  ): Promise<HealthLogStats | null> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      console.log('🔍 Fetching health stats for:', type);
      
      const response = await apiClient.get(`/health-logs/user/${targetUserId}/stats`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          type
        }
      });
      
      console.log('✅ Health stats fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching health stats:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get today's health logs
   */
  static async getTodayHealthLogs(userId?: string): Promise<HealthLog[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getHealthLogsInRange(today, today, userId);
  }

  /**
   * Get this week's health logs
   */
  static async getWeekHealthLogs(userId?: string): Promise<HealthLog[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    return this.getHealthLogsInRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      userId
    );
  }

  /**
   * Get health log by ID
   * GET /health-logs/{id}
   */
  static async getHealthLogById(logId: string): Promise<HealthLog | null> {
    try {
      console.log('🔍 Fetching health log by ID:', logId);
      const response = await apiClient.get(`/health-logs/${logId}`);
      console.log('✅ Health log fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching health log:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Update health log by ID
   * PATCH /health-logs/{id}
   */
  static async updateHealthLog(logId: string, updateData: UpdateHealthLogRequest): Promise<HealthLog | null> {
    try {
      console.log('🔄 Updating health log:', logId);
      const response = await apiClient.patch(`/health-logs/${logId}`, updateData);
      console.log('✅ Health log updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating health log:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update health log');
    }
  }

  /**
   * Delete health log by ID
   * DELETE /health-logs/{id}
   */
  static async deleteHealthLog(logId: string): Promise<boolean> {
    try {
      console.log('🔄 Deleting health log:', logId);
      await apiClient.delete(`/health-logs/${logId}`);
      console.log('✅ Health log deleted successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Error deleting health log:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete health log');
    }
  }

  /**
   * Quick log methods for common health metrics
   */
  static async logSteps(steps: number, date?: string): Promise<HealthLog> {
    return this.createHealthLog({
      type: 'steps',
      value: steps,
      unit: 'steps',
      date,
      notes: 'Daily step count'
    });
  }

  static async logWater(glasses: number, date?: string): Promise<HealthLog> {
    return this.createHealthLog({
      type: 'water',
      value: glasses,
      unit: 'glasses',
      date,
      notes: 'Water intake'
    });
  }

  static async logExercise(minutes: number, date?: string, exerciseType?: string): Promise<HealthLog> {
    return this.createHealthLog({
      type: 'exercise',
      value: minutes,
      unit: 'minutes',
      date,
      notes: exerciseType ? `${exerciseType} workout` : 'Exercise session'
    });
  }

  static async logWeight(weight: number, date?: string): Promise<HealthLog> {
    return this.createHealthLog({
      type: 'weight',
      value: weight,
      unit: 'kg',
      date,
      notes: 'Weight measurement'
    });
  }

  static async logSleep(hours: number, date?: string): Promise<HealthLog> {
    return this.createHealthLog({
      type: 'sleep',
      value: hours,
      unit: 'hours',
      date,
      notes: 'Sleep duration'
    });
  }

  /**
   * Get daily progress for common metrics
   */
  static async getDailyProgress(date?: string): Promise<{
    steps: HealthLog | null;
    water: HealthLog | null;
    exercise: HealthLog | null;
    weight: HealthLog | null;
    sleep: HealthLog | null;
  }> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const logs = await this.getHealthLogsInRange(targetDate, targetDate);
    
    return {
      steps: logs.find(log => log.type === 'steps') || null,
      water: logs.find(log => log.type === 'water') || null,
      exercise: logs.find(log => log.type === 'exercise') || null,
      weight: logs.find(log => log.type === 'weight') || null,
      sleep: logs.find(log => log.type === 'sleep') || null,
    };
  }

  /**
   * Get weekly summary for analytics
   */
  static async getWeeklySummary(userId?: string): Promise<{
    steps: { total: number; average: number; logs: HealthLog[] };
    water: { total: number; average: number; logs: HealthLog[] };
    exercise: { total: number; average: number; logs: HealthLog[] };
    weight: { latest: number | null; logs: HealthLog[] };
    sleep: { total: number; average: number; logs: HealthLog[] };
  }> {
    const logs = await this.getWeekHealthLogs(userId);
    
    const groupedLogs = {
      steps: logs.filter(log => log.type === 'steps'),
      water: logs.filter(log => log.type === 'water'),
      exercise: logs.filter(log => log.type === 'exercise'),
      weight: logs.filter(log => log.type === 'weight'),
      sleep: logs.filter(log => log.type === 'sleep'),
    };

    return {
      steps: {
        total: groupedLogs.steps.reduce((sum, log) => sum + log.value, 0),
        average: groupedLogs.steps.length > 0 ? 
          groupedLogs.steps.reduce((sum, log) => sum + log.value, 0) / groupedLogs.steps.length : 0,
        logs: groupedLogs.steps
      },
      water: {
        total: groupedLogs.water.reduce((sum, log) => sum + log.value, 0),
        average: groupedLogs.water.length > 0 ? 
          groupedLogs.water.reduce((sum, log) => sum + log.value, 0) / groupedLogs.water.length : 0,
        logs: groupedLogs.water
      },
      exercise: {
        total: groupedLogs.exercise.reduce((sum, log) => sum + log.value, 0),
        average: groupedLogs.exercise.length > 0 ? 
          groupedLogs.exercise.reduce((sum, log) => sum + log.value, 0) / groupedLogs.exercise.length : 0,
        logs: groupedLogs.exercise
      },
      weight: {
        latest: groupedLogs.weight.length > 0 ? 
          groupedLogs.weight.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].value : null,
        logs: groupedLogs.weight
      },
      sleep: {
        total: groupedLogs.sleep.reduce((sum, log) => sum + log.value, 0),
        average: groupedLogs.sleep.length > 0 ? 
          groupedLogs.sleep.reduce((sum, log) => sum + log.value, 0) / groupedLogs.sleep.length : 0,
        logs: groupedLogs.sleep
      }
    };
  }
}

export default HealthLogsService;
