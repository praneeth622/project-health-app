import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'group_invite' | 'workout_reminder' | 'achievement' | 'event' | 'message';
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
  avatar?: string;
  actionUser?: string;
  groupName?: string;
  workoutName?: string;
  achievementType?: string;
  eventName?: string;
  postId?: string;
  userId?: string;
  groupId?: string;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: string) => Notification[];
  pushEnabled: boolean;
  soundEnabled: boolean;
  setPushEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: 'New Like',
      message: 'Sarah liked your post about morning workout',
      time: '2 min ago',
      timestamp: Date.now() - 2 * 60 * 1000,
      read: false,
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      actionUser: 'Sarah Johnson',
      postId: '123'
    },
    {
      id: '2',
      type: 'comment',
      title: 'New Comment',
      message: 'Mike commented on your workout progress',
      time: '5 min ago',
      timestamp: Date.now() - 5 * 60 * 1000,
      read: false,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      actionUser: 'Mike Chen',
      postId: '124'
    },
    {
      id: '3',
      type: 'group_invite',
      title: 'Group Invitation',
      message: 'You were invited to join "Morning Runners"',
      time: '10 min ago',
      timestamp: Date.now() - 10 * 60 * 1000,
      read: false,
      groupName: 'Morning Runners',
      groupId: 'group_1'
    },
    {
      id: '4',
      type: 'follow',
      title: 'New Follower',
      message: 'Emma started following you',
      time: '15 min ago',
      timestamp: Date.now() - 15 * 60 * 1000,
      read: true,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      actionUser: 'Emma Wilson',
      userId: 'user_1'
    },
    {
      id: '5',
      type: 'workout_reminder',
      title: 'Workout Reminder',
      message: 'Time for your evening cardio session',
      time: '30 min ago',
      timestamp: Date.now() - 30 * 60 * 1000,
      read: true,
      workoutName: 'Cardio Blast'
    },
    {
      id: '6',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You completed 7 days of consistent workouts',
      time: '1 hour ago',
      timestamp: Date.now() - 60 * 60 * 1000,
      read: true,
      achievementType: '7-Day Streak'
    },
    {
      id: '7',
      type: 'message',
      title: 'New Message',
      message: 'Alex sent you a message',
      time: '2 hours ago',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      read: true,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      actionUser: 'Alex Thompson',
      userId: 'user_2'
    }
  ]);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60 * 1000) {
      return 'just now';
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} min ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: Date.now(),
      time: 'just now'
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Simulate push notification if enabled
    if (pushEnabled) {
      console.log('Push notification sent:', newNotification.title);
    }

    // Simulate sound if enabled
    if (soundEnabled) {
      console.log('Notification sound played');
    }
  }, [pushEnabled, soundEnabled]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter(notif => notif.type === type);
  }, [notifications]);

  // Update time strings periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => 
        prev.map(notif => ({
          ...notif,
          time: formatTime(notif.timestamp)
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);
  // Simulate receiving notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add notifications for demo purposes
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const notificationTypes = ['like', 'comment', 'follow', 'workout_reminder', 'achievement'] as const;
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
          const sampleNotifications = {
          like: {
            type: 'like' as const,
            title: 'New Like',
            message: 'Someone liked your post',
            time: 'just now',
            read: false,
          },
          comment: {
            type: 'comment' as const,
            title: 'New Comment',
            message: 'Someone commented on your post',
            time: 'just now',
            read: false,
          },
          follow: {
            type: 'follow' as const,
            title: 'New Follower',
            message: 'Someone started following you',
            time: 'just now',
            read: false,
          },
          workout_reminder: {
            type: 'workout_reminder' as const,
            title: 'Workout Reminder',
            message: 'Time for your scheduled workout',
            time: 'just now',
            read: false,
          },
          achievement: {
            type: 'achievement' as const,
            title: 'Achievement Unlocked!',
            message: 'You reached a new milestone',
            time: 'just now',
            read: false,
          }
        };

        addNotification(sampleNotifications[randomType]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    pushEnabled,
    soundEnabled,
    setPushEnabled,
    setSoundEnabled,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
