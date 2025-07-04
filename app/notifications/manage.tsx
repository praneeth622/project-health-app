import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationsService from '@/services/notificationsService';
import { 
  NotificationType, 
  NotificationStats as ServiceNotificationStats,
  NotificationPreferences as ServiceNotificationPreferences,
  NotificationChannel
} from '@/services/notificationsService';
import { 
  ArrowLeft, 
  Bell, 
  Send, 
  Settings, 
  Users, 
  TrendingUp,
  Check,
  X,
  Plus,
  Calendar,
  Filter
} from 'lucide-react-native';
interface BulkNotification {
  title: string;
  message: string;
  type: NotificationType;
  target: 'all' | 'specific';
  recipients?: string;
  schedule_time?: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  today: number;
  this_week: number;
  by_type: Record<string, number>;
}

interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
  types: Record<NotificationType, {
    push: boolean;
    email: boolean;
    in_app: boolean;
  }>;
}

export default function NotificationsManage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notifications } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<'inbox' | 'stats' | 'bulk' | 'preferences'>('inbox');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Notification Stats
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);
  
  // Notification Preferences
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  
  // Bulk Notification Form
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [bulkNotification, setBulkNotification] = useState<BulkNotification>({
    title: '',
    message: '',
    type: 'custom',
    target: 'all',
  });
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      marginTop: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    tabNavigation: {
      flexDirection: 'row',
      backgroundColor: colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    tabContent: {
      flex: 1,
      padding: 20,
    },
    tabTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    inboxHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButtonText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    notificationsList: {
      flex: 1,
    },
    notificationItem: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    notificationTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    notificationTime: {
      fontSize: 12,
    },
    notificationMessage: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 8,
    },
    notificationMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    notificationTarget: {
      fontSize: 12,
      fontWeight: '600',
    },
    unreadBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      marginTop: 4,
    },
    typeBreakdown: {
      padding: 16,
      borderRadius: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    typeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    typeName: {
      fontSize: 14,
    },
    typeCount: {
      fontSize: 14,
      fontWeight: '600',
    },
    bulkHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
    },
    addButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    bulkForm: {
      padding: 20,
      borderRadius: 8,
      marginBottom: 20,
    },
    formTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      marginBottom: 12,
    },
    textArea: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      marginBottom: 12,
      textAlignVertical: 'top',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    radioGroup: {
      flexDirection: 'row',
      gap: 20,
      marginBottom: 16,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      marginRight: 8,
    },
    radioLabel: {
      fontSize: 14,
    },
    formActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    sendButton: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    preferencesContainer: {
      gap: 16,
    },
    preferenceSection: {
      padding: 16,
      borderRadius: 8,
    },
    preferenceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    preferenceLabel: {
      fontSize: 14,
    },
    channelLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginVertical: 16,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    timeInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      marginHorizontal: 8,
    },
    typeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    typeLabel: {
      fontSize: 14,
    },
    channelToggles: {
      flexDirection: 'row',
      gap: 16,
    },
    channelSwitch: {
      alignItems: 'center',
    },
    channelSwitchLabel: {
      fontSize: 12,
      marginTop: 4,
    }
  });
  
  // Initial data loading
  useEffect(() => {
    loadNotificationData();
  }, []);
  
  // Refresh notification data
  const loadNotificationData = async () => {
    try {
      setLoading(true);
      // Load notification stats
      const serviceStats = await NotificationsService.getNotificationStats();
      
      // Map service stats to our interface
      const stats: NotificationStats = {
        total: serviceStats.total_notifications || 0,
        unread: serviceStats.unread_count || 0,
        read: serviceStats.read_count || 0,
        today: serviceStats.recent_activity?.last_24h || 0,
        this_week: serviceStats.recent_activity?.last_7d || 0,
        by_type: serviceStats.by_type || {},
      };
      
      setNotificationStats(stats);
      
      // Load notification preferences from service
      const servicePrefs = await NotificationsService.getNotificationPreferences();
      
      // Transform to our format
      const prefs: NotificationPreferences = {
        push_enabled: servicePrefs.preferences?.comment?.push?.enabled || false,
        email_enabled: servicePrefs.preferences?.comment?.email?.enabled || false,
        in_app_enabled: servicePrefs.preferences?.comment?.in_app?.enabled || false,
        quiet_hours: {
          enabled: servicePrefs.preferences?.comment?.push?.quiet_hours?.enabled || false,
          start_time: servicePrefs.preferences?.comment?.push?.quiet_hours?.start_time || '22:00',
          end_time: servicePrefs.preferences?.comment?.push?.quiet_hours?.end_time || '07:00',
        },
        types: {} as Record<NotificationType, { push: boolean; email: boolean; in_app: boolean }>,
      };
      
      // Transform notification type preferences
      Object.keys(servicePrefs.preferences || {}).forEach(typeKey => {
        // Create a type guard for excluded keys
        const excludedKeys = ['quiet_hours', 'push', 'email', 'in_app'];
        if (!excludedKeys.includes(typeKey)) {
          const type = typeKey as NotificationType;
          prefs.types[type] = {
            push: servicePrefs.preferences?.[type]?.push?.enabled || false,
            email: servicePrefs.preferences?.[type]?.email?.enabled || false,
            in_app: servicePrefs.preferences?.[type]?.in_app?.enabled || false,
          };
        }
      });
      
      setNotificationPreferences(prefs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading notification data:', error);
      Alert.alert('Error', 'Failed to load notification data. Please try again.');
      setLoading(false);
    }
  };
  
  // Pull to refresh
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadNotificationData();
      setRefreshing(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setRefreshing(false);
    }
  };
  
  // Send bulk notification
  const handleSendBulkNotification = async () => {
    try {
      if (!bulkNotification.title.trim() || !bulkNotification.message.trim()) {
        Alert.alert('Error', 'Title and message are required.');
        return;
      }
      
      setSendingBulk(true);
      
      // Prepare recipients list if targeting specific users
      const recipientsList = bulkNotification.target === 'specific' && bulkNotification.recipients
        ? bulkNotification.recipients.split(',').map(id => id.trim())
        : undefined;
      
      await NotificationsService.sendBulkNotifications({
        title: bulkNotification.title,
        message: bulkNotification.message,
        type: bulkNotification.type,
        target: bulkNotification.target,
        recipients: recipientsList,
        scheduled_at: bulkNotification.schedule_time,
        metadata: {
          sender_id: 'admin',
          campaign_id: `bulk-${Date.now()}`,
          template_id: 'bulk-notification'
        }
      });
      
      Alert.alert('Success', 'Bulk notification sent successfully!');
      setSendingBulk(false);
      setShowBulkForm(false);
      setBulkNotification({
        title: '',
        message: '',
        type: 'custom',
        target: 'all',
      });
      
      // Refresh data
      loadNotificationData();
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      Alert.alert('Error', 'Failed to send bulk notification. Please try again.');
      setSendingBulk(false);
    }
  };
  
  // Update notification preference
  const handleUpdatePreference = async (type: NotificationType, channel: NotificationChannel, enabled: boolean) => {
    try {
      await NotificationsService.updateNotificationPreferences({
        global_settings: {
          enabled: true,
          marketing_enabled: true,
          recommendations_enabled: true,
          social_enabled: true,
          health_reminders_enabled: true
        },
        preferences: {
          [type]: {
            [channel]: {
              enabled: enabled
            }
          }
        }
      });
      
      // Update local state
      setNotificationPreferences(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          types: {
            ...prev.types,
            [type]: {
              ...prev.types[type],
              [channel]: enabled
            }
          }
        };
      });
      
      Alert.alert('Success', 'Notification preference updated!');
    } catch (error) {
      console.error('Error updating preference:', error);
      Alert.alert('Error', 'Failed to update preference. Please try again.');
    }
  };

  // Update global notification preference
  const updateGlobalPreference = async (channel: NotificationChannel, enabled: boolean) => {
    try {
      await NotificationsService.updateNotificationPreferences({
        channel,
        enabled,
        global: true
      });
      
      // Update local state
      setNotificationPreferences(prev => {
        if (!prev) return prev;
        
        if (channel === 'push') {
          return { ...prev, push_enabled: enabled };
        } else if (channel === 'email') {
          return { ...prev, email_enabled: enabled };
        } else if (channel === 'in_app') {
          return { ...prev, in_app_enabled: enabled };
        }
        
        return prev;
      });
    } catch (error) {
      console.error(`Error updating ${channel} preference:`, error);
      Alert.alert('Error', `Failed to update ${channel} preference. Please try again.`);
    }
  };

  // Update quiet hours settings
  const updateQuietHours = async (settings: { enabled: boolean, start_time?: string, end_time?: string }) => {
    try {
      await NotificationsService.updateNotificationPreferences({
        global_settings: {
          enabled: settings.enabled,
          marketing_enabled: true,
          recommendations_enabled: true,
          social_enabled: true,
          health_reminders_enabled: true
        },
        preferences: {
          quiet_hours: {
            enabled: settings.enabled,
            start_time: settings.start_time,
            end_time: settings.end_time
          }
        }
      });
      
      // Update local state
      setNotificationPreferences(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          quiet_hours: {
            ...prev.quiet_hours,
            ...settings
          }
        };
      });
    } catch (error) {
      console.error('Error updating quiet hours:', error);
      Alert.alert('Error', 'Failed to update quiet hours. Please try again.');
    }
  };
  
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notification Management</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading notification data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Render Inbox Tab
  const renderInboxTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.inboxHeader}>
          <Text style={[styles.tabTitle, { color: colors.text }]}>Recent Notifications</Text>
          
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={16} color={colors.textSecondary} />
            <Text style={[styles.headerButtonText, { color: colors.textSecondary }]}>Filter</Text>
          </TouchableOpacity>
        </View>
        
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No notifications yet</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Notifications will appear here when users receive them.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.slice(0, 10).map(notification => (
              <View key={notification.id} style={[styles.notificationItem, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={[styles.notificationTitle, { color: colors.text }]}>{notification.title}</Text>
                    <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>{notification.time}</Text>
                  </View>
                  
                  <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>{notification.message}</Text>
                  
                  <View style={styles.notificationMeta}>
                    <Text style={[styles.notificationTarget, { color: colors.primary }]}>
                      {notification.actionUser || notification.groupName || 'System'}
                    </Text>
                    
                    {!notification.read && (
                      <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };
  
  // Render Stats Tab
  const renderStatsTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={[styles.tabTitle, { color: colors.text }]}>Notification Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Bell size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{notificationStats?.total || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <TrendingUp size={24} color={colors.info} />
            <Text style={[styles.statValue, { color: colors.text }]}>{notificationStats?.today || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Check size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>{notificationStats?.read || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Read</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Bell size={24} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>{notificationStats?.unread || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unread</Text>
          </View>
        </View>
        
        <View style={[styles.typeBreakdown, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications by Type</Text>
          
          {notificationStats?.by_type && Object.entries(notificationStats.by_type).map(([type, count]) => (
            <View key={type} style={[styles.typeItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.typeName, { color: colors.text }]}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
              </Text>
              <Text style={[styles.typeCount, { color: colors.primary }]}>{count}</Text>
            </View>
          ))}
          
          {(!notificationStats?.by_type || Object.keys(notificationStats.by_type).length === 0) && (
            <Text style={{ color: colors.textSecondary }}>No notification type data available.</Text>
          )}
        </View>
      </View>
    );
  };
  
  // Render Bulk Tab
  const renderBulkTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.bulkHeader}>
          <Text style={[styles.tabTitle, { color: colors.text }]}>Bulk Notifications</Text>
          
          {!showBulkForm && (
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowBulkForm(true)}
            >
              <Plus size={16} color="white" />
              <Text style={styles.addButtonText}>New</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {showBulkForm ? (
          <View style={[styles.bulkForm, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Send Bulk Notification</Text>
            
            <Text style={[styles.label, { color: colors.text }]}>Notification Title</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Enter title"
              placeholderTextColor={colors.textTertiary}
              value={bulkNotification.title}
              onChangeText={(text) => setBulkNotification(prev => ({ ...prev, title: text }))}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Message</Text>
            <TextInput
              style={[styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Enter message"
              placeholderTextColor={colors.textTertiary}
              value={bulkNotification.message}
              onChangeText={(text) => setBulkNotification(prev => ({ ...prev, message: text }))}
              multiline={true}
              numberOfLines={4}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Notification Type</Text>
            <View style={[styles.radioGroup]}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setBulkNotification(prev => ({ ...prev, type: 'custom' }))}
              >
                <View style={[
                  styles.radioCircle, 
                  { 
                    borderColor: colors.primary,
                    backgroundColor: bulkNotification.type === 'custom' ? colors.primary : 'transparent'
                  }
                ]} />
                <Text style={[styles.radioLabel, { color: colors.text }]}>Custom</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setBulkNotification(prev => ({ ...prev, type: 'update' }))}
              >
                <View style={[
                  styles.radioCircle, 
                  { 
                    borderColor: colors.primary,
                    backgroundColor: bulkNotification.type === 'update' ? colors.primary : 'transparent'
                  }
                ]} />
                <Text style={[styles.radioLabel, { color: colors.text }]}>Update</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setBulkNotification(prev => ({ ...prev, type: 'marketing' }))}
              >
                <View style={[
                  styles.radioCircle, 
                  { 
                    borderColor: colors.primary,
                    backgroundColor: bulkNotification.type === 'marketing' ? colors.primary : 'transparent'
                  }
                ]} />
                <Text style={[styles.radioLabel, { color: colors.text }]}>Marketing</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.label, { color: colors.text }]}>Target Recipients</Text>
            <View style={[styles.radioGroup]}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setBulkNotification(prev => ({ ...prev, target: 'all' }))}
              >
                <View style={[
                  styles.radioCircle, 
                  { 
                    borderColor: colors.primary,
                    backgroundColor: bulkNotification.target === 'all' ? colors.primary : 'transparent'
                  }
                ]} />
                <Text style={[styles.radioLabel, { color: colors.text }]}>All Users</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setBulkNotification(prev => ({ ...prev, target: 'specific' }))}
              >
                <View style={[
                  styles.radioCircle, 
                  { 
                    borderColor: colors.primary,
                    backgroundColor: bulkNotification.target === 'specific' ? colors.primary : 'transparent'
                  }
                ]} />
                <Text style={[styles.radioLabel, { color: colors.text }]}>Specific Users</Text>
              </TouchableOpacity>
            </View>
            
            {bulkNotification.target === 'specific' && (
              <>
                <Text style={[styles.label, { color: colors.text }]}>User IDs (comma separated)</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
                  placeholder="user1, user2, user3"
                  placeholderTextColor={colors.textTertiary}
                  value={bulkNotification.recipients}
                  onChangeText={(text) => setBulkNotification(prev => ({ ...prev, recipients: text }))}
                />
              </>
            )}
            
            <Text style={[styles.label, { color: colors.text }]}>Schedule (Optional)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="YYYY-MM-DD HH:MM:SS (leave blank to send now)"
              placeholderTextColor={colors.textTertiary}
              value={bulkNotification.schedule_time}
              onChangeText={(text) => setBulkNotification(prev => ({ ...prev, schedule_time: text }))}
            />
            
            <View style={styles.formActions}>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => {
                  setShowBulkForm(false);
                  setBulkNotification({
                    title: '',
                    message: '',
                    type: 'custom',
                    target: 'all',
                  });
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={handleSendBulkNotification}
                disabled={sendingBulk}
              >
                {sendingBulk ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Send size={16} color="white" />
                    <Text style={styles.sendButtonText}>Send</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Send size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Send to Multiple Users</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Create and send notifications to all users or specific groups.
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Render Preferences Tab
  const renderPreferencesTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={[styles.tabTitle, { color: colors.text }]}>Notification Settings</Text>
        
        <View style={styles.preferencesContainer}>
          {/* Global Notification Settings */}
          <View style={[styles.preferenceSection, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Global Settings</Text>
            
            <View style={[styles.preferenceItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.preferenceLabel, { color: colors.text }]}>Push Notifications</Text>
              <Switch
                value={notificationPreferences?.push_enabled || false}
                onValueChange={(value) => {
                  setNotificationPreferences(prev => prev ? { ...prev, push_enabled: value } : null);
                  // Update setting in backend
                  updateGlobalPreference('push', value);
                }}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notificationPreferences?.push_enabled ? colors.primary : colors.textTertiary}
              />
            </View>
            
            <View style={[styles.preferenceItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.preferenceLabel, { color: colors.text }]}>Email Notifications</Text>
              <Switch
                value={notificationPreferences?.email_enabled || false}
                onValueChange={(value) => {
                  setNotificationPreferences(prev => prev ? { ...prev, email_enabled: value } : null);
                  // Update setting in backend
                  updateGlobalPreference('email', value);
                }}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notificationPreferences?.email_enabled ? colors.primary : colors.textTertiary}
              />
            </View>
            
            <View style={[styles.preferenceItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.preferenceLabel, { color: colors.text }]}>In-App Notifications</Text>
              <Switch
                value={notificationPreferences?.in_app_enabled || false}
                onValueChange={(value) => {
                  setNotificationPreferences(prev => prev ? { ...prev, in_app_enabled: value } : null);
                  // Update setting in backend
                  updateGlobalPreference('in_app', value);
                }}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notificationPreferences?.in_app_enabled ? colors.primary : colors.textTertiary}
              />
            </View>
            
            <View style={[styles.preferenceItem, { borderBottomWidth: 0 }]}>
              <Text style={[styles.preferenceLabel, { color: colors.text }]}>Quiet Hours</Text>
              <Switch
                value={notificationPreferences?.quiet_hours.enabled || false}
                onValueChange={(value) => {
                  setNotificationPreferences(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      quiet_hours: {
                        ...prev.quiet_hours,
                        enabled: value
                      }
                    };
                  });
                  // Update setting in backend
                  updateQuietHours({ enabled: value });
                }}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notificationPreferences?.quiet_hours.enabled ? colors.primary : colors.textTertiary}
              />
            </View>
            
            {notificationPreferences?.quiet_hours.enabled && (
              <View style={styles.timeRow}>
                <Text style={[{ color: colors.text }]}>From</Text>
                <TextInput
                  style={[styles.timeInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
                  value={notificationPreferences?.quiet_hours.start_time || '22:00'}
                  onChangeText={(text) => {
                    setNotificationPreferences(prev => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        quiet_hours: {
                          ...prev.quiet_hours,
                          start_time: text
                        }
                      };
                    });
                  }}
                  placeholder="22:00"
                  placeholderTextColor={colors.textTertiary}
                />
                <Text style={[{ color: colors.text }]}>To</Text>
                <TextInput
                  style={[styles.timeInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
                  value={notificationPreferences?.quiet_hours.end_time || '07:00'}
                  onChangeText={(text) => {
                    setNotificationPreferences(prev => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        quiet_hours: {
                          ...prev.quiet_hours,
                          end_time: text
                        }
                      };
                    });
                  }}
                  placeholder="07:00"
                  placeholderTextColor={colors.textTertiary}
                />
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    if (!notificationPreferences) return;
                    // Save quiet hours settings
                    updateQuietHours({
                      enabled: true,
                      start_time: notificationPreferences.quiet_hours.start_time,
                      end_time: notificationPreferences.quiet_hours.end_time
                    });
                    Alert.alert('Success', 'Quiet hours updated!');
                  }}
                >
                  <Text style={styles.addButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Per-Type Notification Settings */}
          <View style={[styles.preferenceSection, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Types</Text>
            
            <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>
              Configure which channels you want to receive notifications on for each type
            </Text>
            
            {notificationPreferences?.types && Object.entries(notificationPreferences.types).map(([type, channels]) => (
              <View key={type} style={[styles.typeRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.typeLabel, { color: colors.text }]}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                </Text>
                
                <View style={styles.channelToggles}>
                  <View style={styles.channelSwitch}>
                    <Switch
                      value={channels.push}
                      onValueChange={(value) => handleUpdatePreference(type as NotificationType, 'push', value)}
                      trackColor={{ false: colors.border, true: colors.primaryLight }}
                      thumbColor={channels.push ? colors.primary : colors.textTertiary}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={[styles.channelSwitchLabel, { color: colors.textSecondary }]}>Push</Text>
                  </View>
                  
                  <View style={styles.channelSwitch}>
                    <Switch
                      value={channels.email}
                      onValueChange={(value) => handleUpdatePreference(type as NotificationType, 'email', value)}
                      trackColor={{ false: colors.border, true: colors.primaryLight }}
                      thumbColor={channels.email ? colors.primary : colors.textTertiary}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={[styles.channelSwitchLabel, { color: colors.textSecondary }]}>Email</Text>
                  </View>
                  
                  <View style={styles.channelSwitch}>
                    <Switch
                      value={channels.in_app}
                      onValueChange={(value) => handleUpdatePreference(type as NotificationType, 'in_app', value)}
                      trackColor={{ false: colors.border, true: colors.primaryLight }}
                      thumbColor={channels.in_app ? colors.primary : colors.textTertiary}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={[styles.channelSwitchLabel, { color: colors.textSecondary }]}>In-App</Text>
                  </View>
                </View>
              </View>
            ))}
            
            {(!notificationPreferences?.types || Object.keys(notificationPreferences.types).length === 0) && (
              <Text style={{ color: colors.textSecondary }}>No notification types configured.</Text>
            )}
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notification Management</Text>
      </View>
      
      <View style={[styles.tabNavigation, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'inbox' && styles.activeTab]} 
          onPress={() => setActiveTab('inbox')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'inbox' ? colors.primary : colors.textSecondary }]}>Inbox</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'stats' && styles.activeTab]} 
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'stats' ? colors.primary : colors.textSecondary }]}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'bulk' && styles.activeTab]} 
          onPress={() => setActiveTab('bulk')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'bulk' ? colors.primary : colors.textSecondary }]}>Bulk Send</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'preferences' && styles.activeTab]} 
          onPress={() => setActiveTab('preferences')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'preferences' ? colors.primary : colors.textSecondary }]}>Preferences</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {activeTab === 'inbox' && renderInboxTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'bulk' && renderBulkTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
      </ScrollView>
    </SafeAreaView>
  );
}
