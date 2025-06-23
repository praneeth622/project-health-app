import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, Heart, MessageCircle, Share, Users, Bell, Activity, Calendar, Target, TrendingUp, Award, Zap, Clock, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationBadge from '@/components/NotificationBadge';
import StatsCard from '@/components/StatsCard';
import ActivityChart from '@/components/ActivityChart';
import WorkoutCard from '@/components/WorkoutCard';

const { width } = Dimensions.get('window');

const posts = [
  // Removed social posts - will be replaced with enhanced content
];

const todayGoals = [
  { id: 1, title: 'Complete 10,000 steps', progress: 85, current: 8547, target: 10000, icon: '👟', color: '#4ECDC4' },
  { id: 2, title: 'Drink 8 glasses of water', progress: 62, current: 5, target: 8, icon: '💧', color: '#3B82F6' },
  { id: 3, title: 'Exercise for 60 minutes', progress: 78, current: 47, target: 60, icon: '💪', color: '#F59E0B' },
];

const achievements = [
  { id: 1, title: '7-Day Streak', description: 'Workout every day', icon: '🔥', earned: true },
  { id: 2, title: 'Early Bird', description: 'Morning workouts', icon: '🌅', earned: true },
  { id: 3, title: 'Goal Crusher', description: 'Exceed daily target', icon: '🎯', earned: false },
  { id: 4, title: 'Social Butterfly', description: 'Join 5 group workouts', icon: '🦋', earned: false },
];

const quickActions = [
  { id: 1, title: 'Start Workout', icon: Zap, color: '#FF6B6B', route: '/(tabs)/workouts' },
  { id: 2, title: 'Track Food', icon: Target, color: '#4ECDC4', route: '/(tabs)/nutrition' },
  { id: 3, title: 'Log Weight', icon: TrendingUp, color: '#8B5CF6', route: '/(tabs)/profile' },
  { id: 4, title: 'Set Reminder', icon: Clock, color: '#F59E0B', route: '/(tabs)/settings' },
];

const upcomingEvents = [
  { id: 1, title: 'Morning Yoga', time: '07:00 AM', type: 'Group Class', participants: 12 },
  { id: 2, title: 'HIIT Training', time: '06:00 PM', type: 'Personal', participants: 1 },
  { id: 3, title: 'Weekend Hike', time: 'Sat 09:00 AM', type: 'Community', participants: 24 },
];

const activityData = [
  { day: 'Mon', value: 65, isHighlighted: false },
  { day: 'Tue', value: 78, isHighlighted: false },
  { day: 'Wed', value: 92, isHighlighted: true },
  { day: 'Thu', value: 88, isHighlighted: false },
  { day: 'Fri', value: 76, isHighlighted: false },
  { day: 'Sat', value: 85, isHighlighted: false },
  { day: 'Sun', value: 91, isHighlighted: false },
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

export default function HomeScreen() {
  const { colors } = useTheme();
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);
  
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
    statsCard: {
      width: 160,
    },
    chartSection: {
      marginBottom: 24,
    },
    workoutSection: {
      marginBottom: 24,
    },
    quickNavContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 20,
    },
    quickNavItem: {
      alignItems: 'center',
      flex: 1,
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
    goalCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 4,
      marginBottom: 12,
      width: width * 0.85,
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
      fontSize: 24,
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
    achievementsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 8,
      marginBottom: 24,
    },
    achievementCard: {
      width: (width - 48) / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    achievementEarned: {
      backgroundColor: colors.primary + '15',
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    achievementIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    achievementTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    achievementDescription: {
      fontSize: 11,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 8,
      marginBottom: 24,
    },
    quickActionCard: {
      width: (width - 48) / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
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
    eventsContainer: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    eventCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    eventTime: {
      backgroundColor: colors.primary + '20',
      borderRadius: 8,
      padding: 8,
      marginRight: 12,
      minWidth: 70,
      alignItems: 'center',
    },
    eventTimeText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    eventDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventType: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginRight: 8,
    },
    eventParticipants: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    motivationCard: {
      backgroundColor: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
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
      textAlign: 'center',
      marginBottom: 8,
    },
    motivationSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: '#FFFFFF',
      opacity: 0.9,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
      gap: 12,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 48,
      gap: 12,
    },
    searchPlaceholder: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.inputBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.greeting}>Hello Linh!</Text>
            <Text style={styles.date}>Thursday, 08 July</Text>
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
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.goalProgressPercentage}>{goal.progress}%</Text>
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
        <View style={[styles.motivationCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.motivationText}>You're doing great! 🎉</Text>
          <Text style={styles.motivationSubtext}>
            You've completed 85% of your daily goals. Keep it up!
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

        {/* Recent Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
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