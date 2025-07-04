import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, Heart, MessageCircle, Share, Users, Bell, Activity, Calendar, Target, TrendingUp, Award, Zap, Clock, MapPin, ShoppingBag } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBadge from '@/components/NotificationBadge';
import StatsCard from '@/components/StatsCard';
import ActivityChart from '@/components/ActivityChart';
import WorkoutCard from '@/components/WorkoutCard';
import MarketplaceSection from '@/components/MarketplaceSection';
import { HomeService, User, HealthLog, Challenge } from '@/services/homeService';
import { PostService, Post } from '@/services/postService';

const { width } = Dimensions.get('window');

// Default goal targets
const DEFAULT_GOALS = {
  steps: 10000,
  water: 8,
  exercise: 60
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  
  // Define styles at the top of the component
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
      fontFamily: 'Inter-Medium',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    greeting: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    date: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    seeAllText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    statsSection: {
      marginTop: 8,
      marginBottom: 24,
    },
    statsScrollView: {
      marginBottom: 8,
    },
    statsContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    goalCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    goalIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    goalTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      flex: 1,
    },
    goalProgress: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    goalProgressText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    goalProgressPercentage: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    goalProgressBar: {
      height: 6,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 3,
      overflow: 'hidden',
    },
    goalProgressFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    goalMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    goalCurrent: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    goalTarget: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    motivationCard: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    motivationText: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    motivationSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    chartSection: {
      marginBottom: 24,
    },
    workoutSection: {
      marginBottom: 24,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      marginBottom: 24,
      gap: 8,
    },
    quickActionCard: {
      width: (width - 48) / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    quickActionTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      textAlign: 'center',
    },
    upcomingSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    eventCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    eventTimeContainer: {
      width: 65,
      height: 65,
      borderRadius: 14,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    eventTimeHour: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-Bold',
    },
    eventTimeAmPm: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      opacity: 0.9,
    },
    eventTimeDay: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      opacity: 0.8,
      marginTop: 2,
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 6,
    },
    eventDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventTypeContainer: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      marginRight: 8,
    },
    eventType: {
      fontSize: 13,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    eventParticipants: {
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#4ADE80',
      marginRight: 6,
    },
    eventMoreButton: {
      position: 'absolute',
      right: 16,
      top: 16,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    achievementsSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    achievementCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },

    // New enhanced styles for Active Challenges
    challengesContainer: {
      marginBottom: 24,
    },
    challengeScroll: {
      paddingLeft: 20,
      paddingRight: 8,
    },
    challengeCard: {
      width: width * 0.7,
      backgroundColor: colors.cardBackground,
      borderRadius: 18,
      marginRight: 12,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      marginBottom: 5,
      marginTop: 5,
    },
    challengeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },
    challengeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    challengeIcon: {
      fontSize: 24,
    },
    challengeContent: {
      flex: 1,
    },
    challengeTitle: {
      fontSize: 17,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 3,
    },
    challengeDescription: {
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 12,
    },
    challengeProgress: {
      padding: 16,
      paddingTop: 6,
      paddingBottom: 18,
    },
    challengeProgressBar: {
      height: 8,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 4,
      marginBottom: 12,
    },
    challengeProgressFill: {
      height: '100%',
      borderRadius: 4,
    },
    challengeProgressDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    challengeValue: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    challengePercentage: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    challengeBadge: {
      position: 'absolute',
      top: 16,
      right: 16,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    challengeBadgeText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 4,
    },

    // Enhanced styles for Quick Navigation
    quickNavContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      marginHorizontal: 20,
      marginBottom: 24,
      paddingVertical: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 8,
    },
    quickNavTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 20,
      marginBottom: 16,
    },
    quickNavGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
    },
    quickNavItem: {
      width: '25%',
      alignItems: 'center',
      paddingVertical: 12,
    },
    quickNavIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 4,
    },
    quickNavText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    achievementsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    eventsContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    
    // Enhanced styles for Upcoming Events
    eventsContainerNew: {
      marginBottom: 24,
    },
    eventCardNew: {
      backgroundColor: colors.cardBackground,
      borderRadius: 18,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      marginLeft: 2,
      marginRight: 2,
    },
    eventTimeContainerNew: {
      width: 68,
      height: 68,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    eventTimeHourNew: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Inter-Bold',
    },
    eventTimeAmPmNew: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      opacity: 0.9,
    },
    eventTimeDayNew: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      opacity: 0.8,
      marginTop: 2,
    },
    eventInfoNew: {
      flex: 1,
    },
    eventTitleNew: {
      fontSize: 17,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 6,
    },
    eventDetailsNew: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventTypeContainerNew: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 10,
    },
    eventTypeNew: {
      fontSize: 13,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    eventParticipantsNew: {
      fontSize: 13,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventIndicatorNew: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#4ADE80',
      marginRight: 8,
    },
    eventJoinButtonNew: {
      position: 'absolute',
      right: 16,
      top: 18,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: colors.primary,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    eventJoinTextNew: {
      fontSize: 13,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },

    // Enhanced styles for Quick Navigation - New UI
    quickNavContainerNew: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      marginHorizontal: 20,
      marginBottom: 24,
      paddingVertical: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 8,
    },
    quickNavTitleNew: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 20,
      marginBottom: 16,
    },
    quickNavGridNew: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
    },
    quickNavItemNew: {
      width: '25%',
      alignItems: 'center',
      paddingVertical: 12,
    },
    quickNavIconNew: {
      width: 52,
      height: 52,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 4,
    },
    quickNavTextNew: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
  });
  
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activityData, setActivityData] = useState<{ day: string; value: number; isHighlighted: boolean; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);

  // Mock data for features not yet integrated
  const quickActions = [
    { id: 1, title: 'Start Workout', icon: Zap, color: '#FF6B6B', route: '/(tabs)/workouts' },
    { id: 2, title: 'Track Food', icon: Target, color: '#4ECDC4', route: '/(tabs)/nutrition' },
    { id: 3, title: 'Social Posts', icon: MessageCircle, color: '#8B5CF6', route: '/posts' },
    { id: 4, title: 'Marketplace', icon: ShoppingBag, color: '#10B981', route: '/(tabs)/marketplace' },
    { id: 5, title: 'Set Reminder', icon: Clock, color: '#F59E0B', route: '/(tabs)/settings' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Morning Yoga', time: '07:00 AM', type: 'Group Class', participants: 12, day: 'Today' },
    { id: 2, title: 'HIIT Training', time: '06:00 PM', type: 'Personal', participants: 1, day: 'Today' },
    { id: 3, title: 'Weekend Hike', time: '09:00 AM', type: 'Community', participants: 24, day: 'Sat' },
  ];

  const featuredWorkouts = [
    {
      title: 'Morning Cardio',
      week: 'Week 3',
      workoutNumber: 'Workout 1',
      nextExercise: 'High Intensity Interval',
      backgroundColor: '#FF6B6B',
    },
    {
      title: 'Strength Training',
      week: 'Week 2',
      workoutNumber: 'Workout 4',
      nextExercise: 'Upper Body Focus',
      backgroundColor: '#4ECDC4',
    },
  ];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Load user profile first using the new authenticated method
      const userData = await HomeService.getCurrentUserProfile();
      setUser(userData);

      // Load user's health data (userId is now optional and will use authenticated user)
      const [healthLogsData, challengesData, weeklyStats] = await Promise.all([
        HomeService.getTodayHealthLogs(),
        HomeService.getUserChallenges(),
        HomeService.getWeeklyStats()
      ]);

      setHealthLogs(healthLogsData);
      setChallenges(challengesData);
      
      // Process weekly stats for activity chart
      if (weeklyStats) {
        setActivityData(processWeeklyStats(weeklyStats));
      } else {
        // Fallback to mock data
        setActivityData([
          { day: 'Mon', value: 65, isHighlighted: false },
          { day: 'Tue', value: 78, isHighlighted: false },
          { day: 'Wed', value: 92, isHighlighted: true },
          { day: 'Thu', value: 88, isHighlighted: false },
          { day: 'Fri', value: 76, isHighlighted: false },
          { day: 'Sat', value: 85, isHighlighted: false },
          { day: 'Sun', value: 91, isHighlighted: false },
        ]);
      }

    } catch (error: any) {
      console.error('Failed to load home data:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load data. Please try again.';
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage = 'Authentication failed. Please sign in again.';
      } else if (error.message?.includes('No authenticated user')) {
        errorMessage = 'Please sign in to continue.';
      }
      
      Alert.alert('Error', errorMessage, [
        {
          text: 'Retry',
          onPress: () => loadHomeData()
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const processWeeklyStats = (stats: any) => {
    // Process API stats into chart format
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      value: stats.daily_averages?.[index] || 0,
      isHighlighted: index === new Date().getDay() - 1
    }));
  };

  const calculateTodayGoals = () => {
    if (!healthLogs.length) {
      // Return mock data if no health logs
      return [
        { id: 1, title: 'Complete 10,000 steps', progress: 0, current: 0, target: 10000, icon: '👟', color: '#4ECDC4' },
        { id: 2, title: 'Drink 8 glasses of water', progress: 0, current: 0, target: 8, icon: '💧', color: '#3B82F6' },
        { id: 3, title: 'Exercise for 60 minutes', progress: 0, current: 0, target: 60, icon: '💪', color: '#F59E0B' },
      ];
    }

    const stepsLog = healthLogs.find(log => log.type === 'steps');
    const waterLog = healthLogs.find(log => log.type === 'water');
    const exerciseLog = healthLogs.find(log => log.type === 'exercise');

    const stepsProgress = stepsLog ? (stepsLog.value / DEFAULT_GOALS.steps) * 100 : 0;
    const waterProgress = waterLog ? (waterLog.value / DEFAULT_GOALS.water) * 100 : 0;
    const exerciseProgress = exerciseLog ? (exerciseLog.value / DEFAULT_GOALS.exercise) * 100 : 0;

    return [
      {
        id: 1,
        title: 'Complete 10,000 steps',
        progress: Math.min(stepsProgress, 100),
        current: stepsLog?.value || 0,
        target: DEFAULT_GOALS.steps,
        icon: '👟',
        color: '#4ECDC4'
      },
      {
        id: 2,
        title: 'Drink 8 glasses of water',
        progress: Math.min(waterProgress, 100),
        current: waterLog?.value || 0,
        target: DEFAULT_GOALS.water,
        icon: '💧',
        color: '#3B82F6'
      },
      {
        id: 3,
        title: 'Exercise for 60 minutes',
        progress: Math.min(exerciseProgress, 100),
        current: exerciseLog?.value || 0,
        target: DEFAULT_GOALS.exercise,
        icon: '💪',
        color: '#F59E0B'
      }
    ];
  };

  const processAchievements = () => {
    if (!challenges.length) {
      // Return mock achievements
      return [
        { id: 1, title: '7-Day Streak', description: 'Workout every day', icon: '🔥', earned: false },
        { id: 2, title: 'Early Bird', description: 'Morning workouts', icon: '🌅', earned: false },
        { id: 3, title: 'Goal Crusher', description: 'Exceed daily target', icon: '🎯', earned: false },
        { id: 4, title: 'Social Butterfly', description: 'Join 5 group workouts', icon: '🦋', earned: false },
      ];
    }

    return challenges.slice(0, 4).map(challenge => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      icon: getChallengeeIcon(challenge.type),
      earned: false // You'll need to implement progress checking
    }));
  };

  const getChallengeeIcon = (type: string) => {
    const icons = {
      'individual': '🎯',
      'group': '👥',
      'workout': '💪',
      'nutrition': '🥗'
    } as const;
    return icons[type as keyof typeof icons] || '⭐';
  };

  const todayGoals = calculateTodayGoals();
  const achievements = processAchievements();

  // Calculate overall progress
  const overallProgress = todayGoals.reduce((sum, goal) => sum + goal.progress, 0) / todayGoals.length;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading your health data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ 
              uri: user?.profile_image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' 
            }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.greeting}>Hello {user?.name || 'User'}!</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <MessageCircle size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/(tabs)/notifications')}
          >
            <Bell size={24} color={colors.textSecondary} />
            {unreadCount > 0 && <NotificationBadge count={unreadCount} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Daily Goals Progress */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Goals</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/activity')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.statsScrollView}
            contentContainerStyle={styles.statsContent}
          >
            {todayGoals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                </View>
                <View style={styles.goalProgress}>
                  <Text style={styles.goalProgressText}>
                    {goal.current} / {goal.target}
                  </Text>
                  <Text style={styles.goalProgressPercentage}>{Math.round(goal.progress)}%</Text>
                </View>
                <View style={styles.goalProgressBar}>
                  <View 
                    style={[
                      styles.goalProgressFill, 
                      { width: `${goal.progress}%`, backgroundColor: goal.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Motivation Card */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            {overallProgress >= 80 ? "You're crushing it! 🎉" : "Keep going! 💪"}
          </Text>
          <Text style={styles.motivationSubtext}>
            You've completed {Math.round(overallProgress)}% of your daily goals. 
            {overallProgress >= 80 ? " Amazing work!" : " You've got this!"}
          </Text>
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <TouchableOpacity>
              <TrendingUp size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <ActivityChart data={activityData} maxValue={100} />
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <IconComponent size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Featured Workouts */}
        <View style={styles.workoutSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Training</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/workouts')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {featuredWorkouts.map((workout, index) => (
            <WorkoutCard
              key={index}
              title={workout.title}
              week={workout.week}
              workoutNumber={workout.workoutNumber}
              nextExercise={workout.nextExercise}
              backgroundColor={workout.backgroundColor}
              onPress={() => router.push('/(tabs)/workouts')}
            />
          ))}
        </View>

        {/* Marketplace Section */}
        <MarketplaceSection />

        {/* Active Challenges - Enhanced UI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Challenges</Text>
          <TouchableOpacity onPress={() => router.push('/challenges/index')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengeScroll}
        >
          {achievements.map((achievement, index) => {
            // Mock progress data for each challenge
            const progress = Math.floor(Math.random() * 80) + 10; // Random progress between 10-90%
            const colors = ['#FF6B6B', '#4ECDC4', '#8B5CF6', '#10B981'];
            const color = colors[index % colors.length];
            
            return (
              <TouchableOpacity 
                key={achievement.id} 
                style={styles.challengeCard}
                onPress={() => router.push('/challenges/index')}
              >
                <View style={styles.challengeHeader}>
                  <View style={[styles.challengeIconContainer, { backgroundColor: color }]}>
                    <Text style={styles.challengeIcon}>{achievement.icon}</Text>
                  </View>
                  <View style={styles.challengeContent}>
                    <Text style={styles.challengeTitle}>{achievement.title}</Text>
                    <Text style={styles.challengeDescription}>{achievement.description}</Text>
                  </View>
                </View>
                <View style={styles.challengeProgress}>
                  <View style={styles.challengeProgressBar}>
                    <View 
                      style={[
                        styles.challengeProgressFill, 
                        { width: `${progress}%`, backgroundColor: color }
                      ]} 
                    />
                  </View>
                  <View style={styles.challengeProgressDetails}>
                    <Text style={styles.challengeValue}>
                      {Math.round(progress / 100 * 7)}/7 days
                    </Text>
                    <Text style={styles.challengePercentage}>{progress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Upcoming Events - Enhanced UI */}
        <View style={styles.eventsContainerNew}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/groups')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCardNew}>
              <View style={styles.eventTimeContainerNew}>
                <Text style={styles.eventTimeHourNew}>{event.time.split(' ')[0]}</Text>
                <Text style={styles.eventTimeAmPmNew}>{event.time.split(' ')[1] || ''}</Text>
                <Text style={styles.eventTimeDayNew}>{event.day}</Text>
              </View>
              <View style={styles.eventInfoNew}>
                <Text style={styles.eventTitleNew}>{event.title}</Text>
                <View style={styles.eventDetailsNew}>
                  <View style={styles.eventTypeContainerNew}>
                    <Text style={styles.eventTypeNew}>{event.type}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.eventIndicatorNew} />
                    <Text style={styles.eventParticipantsNew}>
                      {event.participants} participant{event.participants !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.eventJoinButtonNew}>
                <Text style={styles.eventJoinTextNew}>Join</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Navigation - Enhanced UI */}
        <View style={styles.quickNavContainerNew}>
          <Text style={styles.quickNavTitleNew}>Quick Navigation</Text>
          <View style={styles.quickNavGridNew}>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push('/(tabs)/groups')}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#4A6FFF' }]}>
                <Users size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push('/(tabs)/messages')}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#FF6B6B' }]}>
                <MessageCircle size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push({ pathname: '/search' as any })}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#8B5CF6' }]}>
                <Search size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push('/(tabs)/discover')}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#10B981' }]}>
                <Activity size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Discover</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push('/(tabs)/workouts')}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#F59E0B' }]}>
                <Zap size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Workouts</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push('/challenges/index')}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#EC4899' }]}>
                <Award size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Challenges</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push('/(tabs)/marketplace')}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#6366F1' }]}>
                <ShoppingBag size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickNavItemNew}
              onPress={() => router.push('/reminders')}
            >
              <View style={[styles.quickNavIconNew, { backgroundColor: '#0EA5E9' }]}>
                <Clock size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.quickNavTextNew}>Reminders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}