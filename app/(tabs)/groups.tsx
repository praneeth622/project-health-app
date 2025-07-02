import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Lock, Globe, Settings, AlertCircle, Wifi, WifiOff } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { GroupService } from '@/services/groupService';
import { Group, MemberRole } from '@/services/api';
import NetworkUtils from '@/utils/networkUtils';

// Mock data for fallback when server is down
const mockGroups: (Group & { my_role: MemberRole })[] = [
  {
    id: 'mock-1',
    name: 'Morning Yoga Warriors',
    description: 'Start your day with mindful yoga practice. All levels welcome!',
    category: 'yoga',
    type: 'public', // Changed from 'visibility' to 'type'
    location: 'San Francisco, CA',
    member_count: 1247,
    admin_id: 'admin-1',
    image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2', // Changed from 'cover_image' to 'image_url'
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-07-01T12:00:00Z',
    is_active: true,
    my_role: 'admin' as MemberRole,
  },
  {
    id: 'mock-2',
    name: 'HIIT Fitness Club',
    description: 'High-intensity interval training for maximum results',
    category: 'fitness',
    type: 'public', // Changed from 'visibility' to 'type'
    member_count: 892,
    admin_id: 'admin-2',
    image_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2', // Changed from 'cover_image' to 'image_url'
    created_at: '2024-02-20T10:30:00Z',
    updated_at: '2024-07-01T15:30:00Z',
    is_active: true,
    my_role: 'member' as MemberRole,
  },
  {
    id: 'mock-3',
    name: 'Running Enthusiasts',
    description: 'Join us for weekly runs and marathons around the city',
    category: 'running',
    type: 'private', // Changed from 'visibility' to 'type'
    member_count: 345,
    admin_id: 'admin-3',
    image_url: 'https://images.pexels.com/photos/1552267/pexels-photo-1552267.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2', // Changed from 'cover_image' to 'image_url'
    created_at: '2024-03-10T07:15:00Z',
    updated_at: '2024-06-30T18:45:00Z',
    is_active: true,
    my_role: 'moderator' as MemberRole,
  },
];

const pendingRequests = [
  {
    id: 1,
    groupName: 'Runners Club',
    requesterName: 'John Doe',
    requesterAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    time: '2 hours ago',
  },
  {
    id: 2,
    groupName: 'Yoga Masters',
    requesterName: 'Sarah Wilson',
    requesterAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    time: '5 hours ago',
  },
];

export default function GroupsScreen() {
  const [activeTab, setActiveTab] = useState<'my-groups' | 'requests'>('my-groups');
  const [myGroups, setMyGroups] = useState<(Group & { my_role: MemberRole })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { colors } = useTheme();

  // Load user's groups with improved error handling and network utilities
  const loadMyGroups = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setIsOfflineMode(false);

      // Use the network utility for smart retry and offline handling
      const result = await NetworkUtils.executeWithRetry(
        () => GroupService.getMyGroups(1, 20),
        { groups: mockGroups, pagination: { page: 1, limit: 20, total: mockGroups.length, total_pages: 1 } },
        3
      );

      setMyGroups(result.data.groups);
      setIsOfflineMode(result.isOffline);
      
      if (result.isOffline && result.error) {
        setError(result.error);
      }
      
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Error loading groups:', error);
      
      // Use network utility to format user-friendly error message
      const userFriendlyError = NetworkUtils.formatErrorForUser(error);
      setError(userFriendlyError);
      setMyGroups([]); // Clear groups on unrecoverable errors
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMyGroups();
  }, []);

  const handleRefresh = () => {
    loadMyGroups(true);
  };

  const handleRetry = () => {
    if (retryCount >= 3) {
      // After 3 retries, suggest using offline mode
      Alert.alert(
        'Connection Issues',
        'Unable to connect to server after multiple attempts. Would you like to continue in offline mode?',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setRetryCount(0);
              loadMyGroups();
            }
          },
          {
            text: 'Offline Mode',
            onPress: () => {
              setMyGroups(mockGroups);
              setIsOfflineMode(true);
              setError('Working offline with cached data');
            }
          }
        ]
      );
    } else {
      // Add progressive delay between retries
      setTimeout(() => {
        loadMyGroups();
      }, NetworkUtils.getRetryDelay(retryCount));
    }
  };

  const handleGroupPress = (groupId: string) => {
    if (isOfflineMode && groupId.startsWith('mock-')) {
      Alert.alert(
        'Offline Mode',
        'You are currently in offline mode. Some features may not be available.',
        [
          { text: 'OK' },
          { 
            text: 'Try Online', 
            onPress: () => {
              setRetryCount(0);
              loadMyGroups();
            }
          }
        ]
      );
      return;
    }
    router.push({ pathname: '/groups/[id]', params: { id: groupId } });
  };

  const handleCreateGroup = () => {
    router.push('/groups/create');
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe size={16} color="#10B981" />;
      case 'private':
        return <Users size={16} color="#F59E0B" />;
      case 'invite_only':
        return <Lock size={16} color="#EF4444" />;
      default:
        return <Globe size={16} color="#10B981" />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
    },
    createButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    groupsList: {
      paddingHorizontal: 20,
      gap: 16,
    },
    groupCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    groupImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 12,
    },
    groupInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    groupName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    settingsButton: {
      padding: 4,
    },
    groupMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    groupMembers: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    membersText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    groupVisibility: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    visibilityText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    adminBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      marginBottom: 4,
    },
    adminText: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      color: colors.warning,
    },
    newPostsBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.info + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    newPostsText: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      color: colors.info,
    },
    requestsList: {
      paddingHorizontal: 20,
      gap: 16,
    },
    requestCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    requesterAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    requestInfo: {
      flex: 1,
      marginRight: 12,
    },
    requestText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      lineHeight: 20,
      marginBottom: 4,
    },
    requesterName: {
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    groupNameText: {
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    requestTime: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    requestActions: {
      gap: 8,
    },
    approveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    approveText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    declineButton: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    declineText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 12,
    },
    errorContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    errorText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.error,
      textAlign: 'center',
      marginBottom: 16,
    },
    offlineBanner: {
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    offlineText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.warning,
      flex: 1,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    enhancedErrorContainer: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    errorIcon: {
      marginBottom: 16,
    },
    errorTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.error,
      marginBottom: 8,
    },
    errorSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    errorActions: {
      flexDirection: 'row',
      gap: 12,
    },
    secondaryButton: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    createFirstButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    createFirstText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    moderatorBadge: {
      backgroundColor: colors.info + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    moderatorText: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: colors.info,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateGroup}
        >
          <Plus size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <View style={styles.offlineBanner}>
          <WifiOff size={20} color={colors.warning} />
          <Text style={styles.offlineText}>
            Working offline. Some features may be limited.
          </Text>
          <TouchableOpacity onPress={() => loadMyGroups()}>
            <Wifi size={20} color={colors.warning} />
          </TouchableOpacity>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-groups' && styles.activeTab]}
          onPress={() => setActiveTab('my-groups')}
        >
          <Text style={[styles.tabText, activeTab === 'my-groups' && styles.activeTabText]}>
            My Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests ({pendingRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'my-groups' ? (
          <View style={styles.groupsList}>
            {isLoading && !isRefreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading your groups...</Text>
              </View>
            ) : error && !isOfflineMode ? (
              <View style={styles.enhancedErrorContainer}>
                <AlertCircle size={48} color={colors.error} style={styles.errorIcon} />
                <Text style={styles.errorTitle}>Connection Error</Text>
                <Text style={styles.errorSubtitle}>
                  {retryCount >= 3 
                    ? 'We\'re having trouble connecting to the server. You can continue in offline mode or try again.'
                    : error
                  }
                </Text>
                <View style={styles.errorActions}>
                  <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryText}>
                      {retryCount >= 3 ? 'Try Again' : 'Retry'}
                    </Text>
                  </TouchableOpacity>
                  {retryCount >= 2 && (
                    <TouchableOpacity 
                      style={styles.secondaryButton} 
                      onPress={() => {
                        setMyGroups(mockGroups);
                        setIsOfflineMode(true);
                        setError('Working offline with cached data');
                      }}
                    >
                      <Text style={styles.secondaryButtonText}>Offline Mode</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : myGroups.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Users size={48} color={colors.textTertiary} />
                <Text style={styles.emptyTitle}>No Groups Yet</Text>
                <Text style={styles.emptySubtitle}>Join or create your first group to get started!</Text>
                <TouchableOpacity style={styles.createFirstButton} onPress={handleCreateGroup}>
                  <Text style={styles.createFirstText}>Create Group</Text>
                </TouchableOpacity>
              </View>
            ) : (
              myGroups.map((group) => (
                <TouchableOpacity 
                  key={group.id} 
                  style={styles.groupCard}
                  onPress={() => handleGroupPress(group.id)}
                >
                  <Image 
                    source={{ uri: group.image_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2' }} 
                    style={styles.groupImage} 
                  />
                  <View style={styles.groupInfo}>
                    <View style={styles.groupHeader}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      {group.my_role === 'admin' && (
                        <TouchableOpacity 
                          style={styles.settingsButton}
                          onPress={() => router.push({ pathname: '/groups/admin/[id]', params: { id: group.id }})}
                        >
                          <Settings size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.groupMeta}>
                      <View style={styles.groupMembers}>
                        <Users size={14} color={colors.textSecondary} />
                        <Text style={styles.membersText}>{group.member_count} members</Text>
                      </View>
                      <View style={styles.groupVisibility}>
                        {getVisibilityIcon(group.type)}
                        <Text style={styles.visibilityText}>
                          {group.type.charAt(0).toUpperCase() + group.type.slice(1)}
                        </Text>
                      </View>
                    </View>
                    {group.my_role === 'admin' && (
                      <View style={styles.adminBadge}>
                        <Text style={styles.adminText}>Admin</Text>
                      </View>
                    )}
                    {group.my_role === 'moderator' && (
                      <View style={styles.moderatorBadge}>
                        <Text style={styles.moderatorText}>Moderator</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <View style={styles.requestsList}>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <View key={request.id} style={styles.requestCard}>
                  <Image source={{ uri: request.requesterAvatar }} style={styles.requesterAvatar} />
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestText}>
                      <Text style={styles.requesterName}>{request.requesterName}</Text>
                      {' wants to join '}
                      <Text style={styles.groupNameText}>{request.groupName}</Text>
                    </Text>
                    <Text style={styles.requestTime}>{request.time}</Text>
                  </View>
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.approveButton}>
                      <Text style={styles.approveText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No pending requests</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

