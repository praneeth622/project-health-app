import apiClient from './api';

// Notification Types
export type NotificationType = 
  | 'comment'
  | 'like'
  | 'follow'
  | 'mention'
  | 'workout'
  | 'achievement'
  | 'reminder'
  | 'challenge'
  | 'group'
  | 'friend_request'
  | 'message'
  | 'system'
  | 'custom'
  | 'update'
  | 'marketing';

export type NotificationChannel = 'push' | 'email' | 'in_app';

// Statistics for notifications
export interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  read_count: number;
  recent_activity: {
    last_24h: number;
    last_7d: number;
  };
  by_type: Record<string, number>;
}

// Notification preference settings
export interface NotificationPreferences {
  preferences?: Record<NotificationType, {
    push?: {
      enabled: boolean;
      quiet_hours?: {
        enabled: boolean;
        start_time: string;
        end_time: string;
      };
    };
    email?: {
      enabled: boolean;
    };
    in_app?: {
      enabled: boolean;
    };
  }>;
}

// Base notification object
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user_id: string;
  reference_id?: string;
  reference_type?: string;
  metadata?: Record<string, any>;
}

// Request for sending bulk notifications
export interface SendBulkNotificationsRequest {
  title: string;
  message: string;
  type: NotificationType;
  target: 'all' | 'specific';
  recipients?: string[];
  schedule_time?: string;
  scheduled_at?: string;
  metadata?: {
    [key: string]: any;
  };
}

// Request for updating preferences
export interface UpdateNotificationPreferencesRequest {
  channel?: NotificationChannel;
  type?: NotificationType;
  enabled?: boolean;
  global?: boolean;
  global_settings?: {
    [key: string]: any;
  };
  quiet_hours?: {
    enabled?: boolean;
    start_time?: string;
    end_time?: string;
  };
  preferences?: {
    [key: string]: any;
  };
}

// Parameters for fetching notifications
export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  is_read?: boolean;
  start_date?: string;
  end_date?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Notification Service Class
class NotificationServiceClass {
  /**
   * Get a list of notifications
   * @param params Query parameters
   */
  async getNotifications(params: GetNotificationsParams = {}): Promise<PaginatedResponse<Notification>> {
    try {
      const response = await apiClient.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await apiClient.get('/notifications/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   * @param data Preference data to update
   */
  async updateNotificationPreferences(data: UpdateNotificationPreferencesRequest): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.patch('/notifications/preferences', data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Mark notifications as read
   * @param ids Notification IDs to mark as read
   */
  async markAsRead(ids: string[]): Promise<void> {
    try {
      await apiClient.post('/notifications/mark-read', { notification_ids: ids });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/notifications/mark-all-read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Send bulk notifications
   * @param data Bulk notification data
   */
  async sendBulkNotifications(data: SendBulkNotificationsRequest): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient.post('/notifications/bulk', data);
      return response.data;
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param id Notification ID to delete
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<void> {
    try {
      await apiClient.delete('/notifications');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
}

// Export singleton instance
const NotificationsService = new NotificationServiceClass();
export default NotificationsService;
