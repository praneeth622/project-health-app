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
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    eventTime: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    eventMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    eventType: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    eventParticipants: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    workoutSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    workoutCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    workoutTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    workoutWeek: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: '#FFFFFF',
      opacity: 0.8,
      marginBottom: 12,
    },
    workoutNext: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.9,
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
    achievementIcon: {
      fontSize: 24,
      marginRight: 16,
    },
    achievementContent: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    achievementDescription: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    achievementEarned: {
      opacity: 1,
    },
    achievementNotEarned: {
      opacity: 0.5,
    },
    quickNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.cardBackground,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    quickNavItem: {
      alignItems: 'center',
    },
    quickNavIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
    eventInfo: {
      flex: 1,
      marginLeft: 15,
    },
    eventDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    eventTimeText: {
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
      color: '#ffffff',
    },
    quickNavContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#1a1a1a',
      borderRadius: 15,
      marginHorizontal: 20,
      marginBottom: 20,
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
    { id: 3, title: 'Marketplace', icon: ShoppingBag, color: '#10B981', route: '/(tabs)/marketplace' },
    { id: 4, title: 'Set Reminder', icon: Clock, color: '#F59E0B', route: '/(tabs)/settings' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Morning Yoga', time: '07:00 AM', type: 'Group Class', participants: 12 },
    { id: 2, title: 'HIIT Training', time: '06:00 PM', type: 'Personal', participants: 1 },
    { id: 3, title: 'Weekend Hike', time: 'Sat 09:00 AM', type: 'Community', participants: 24 },
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

        {/* Recent Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Challenges</Text>
          <TouchableOpacity>
            <Award size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard, 
                achievement.earned && styles.achievementEarned
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/groups')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={styles.eventTime}>
                <Text style={styles.eventTimeText}>{event.time}</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventType}>{event.type}</Text>
                  <Text style={styles.eventParticipants}>
                    {event.participants} participant{event.participants !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Navigation */}
        <View style={styles.quickNavContainer}>
          <TouchableOpacity 
            style={styles.quickNavItem}
            onPress={() => router.push('/(tabs)/groups')}
          >
            <View style={[styles.quickNavIcon, { backgroundColor: colors.primary }]}>
              <Users size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickNavText}>Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickNavItem}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <View style={[styles.quickNavIcon, { backgroundColor: colors.accent }]}>
              <MessageCircle size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickNavText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickNavItem}
            onPress={() => router.push({ pathname: '/search' as any })}
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#8B5CF6' }]}>
              <Search size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickNavText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickNavItem}
            onPress={() => router.push('/(tabs)/discover')}
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#FF6B6B' }]}>
              <Activity size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickNavText}>Discover</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}