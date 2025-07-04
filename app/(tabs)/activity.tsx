import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import UserHeader from '@/components/UserHeader';
import CircularProgress from '@/components/CircularProgress';
import HealthLogger from '@/components/HealthLogger';
import { MapPin, Trophy, Medal, Award, Target, Flame, Footprints, Clock, TrendingUp, Calendar, BarChart3, Activity, Plus } from 'lucide-react-native';
import { Colors, useTheme } from '@/contexts/ThemeContext';
import HealthLogsService, { HealthLog } from '@/services/healthLogsService';

const { width } = Dimensions.get('window');

export default function ActivityScreen() {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState('Today');
  const [showHealthLogger, setShowHealthLogger] = useState(false);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const styles = createStyles(colors);
  
  const tabs = ['Today', 'Week', 'Month'];

  // Fetch today's health logs
  const fetchTodayLogs = useCallback(async () => {
    try {
      const logs = await HealthLogsService.getTodayHealthLogs();
      setHealthLogs(logs);
    } catch (error) {
      console.error('Failed to fetch health logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayLogs();
  }, [fetchTodayLogs]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodayLogs();
    setRefreshing(false);
  }, [fetchTodayLogs]);

  const handleLogCreated = useCallback((log: HealthLog) => {
    // Refresh the data
    fetchTodayLogs();
  }, [fetchTodayLogs]);

  // Calculate daily stats from health logs
  const getDailyStatsFromLogs = useCallback(() => {
    const stepsLog = healthLogs.find(log => log.type === 'steps');
    const waterLog = healthLogs.find(log => log.type === 'water');
    const exerciseLog = healthLogs.find(log => log.type === 'exercise');
    const sleepLog = healthLogs.find(log => log.type === 'sleep');

    return [
      { 
        label: 'Steps', 
        value: stepsLog ? stepsLog.value.toLocaleString() : '0', 
        target: '10,000', 
        icon: Footprints, 
        color: '#4ECDC4', 
        progress: stepsLog ? Math.min((stepsLog.value / 10000) * 100, 100) : 0 
      },
      { 
        label: 'Water', 
        value: waterLog ? waterLog.value.toString() : '0', 
        target: '8', 
        icon: Target, 
        color: '#3B82F6', 
        progress: waterLog ? Math.min((waterLog.value / 8) * 100, 100) : 0 
      },
      { 
        label: 'Exercise', 
        value: exerciseLog ? exerciseLog.value.toString() : '0', 
        target: '60', 
        icon: Flame, 
        color: '#F59E0B', 
        progress: exerciseLog ? Math.min((exerciseLog.value / 60) * 100, 100) : 0 
      },
      { 
        label: 'Sleep', 
        value: sleepLog ? sleepLog.value.toString() : '0', 
        target: '8', 
        icon: Clock, 
        color: '#8B5CF6', 
        progress: sleepLog ? Math.min((sleepLog.value / 8) * 100, 100) : 0 
      }
    ];
  }, [healthLogs]);

  const dailyStats = getDailyStatsFromLogs();

  const recentActivities = [
    { time: '2 hours ago', activity: 'Morning Run', duration: '25 min', calories: '142 kcal', icon: '🏃‍♀️' },
    { time: '5 hours ago', activity: 'Yoga Session', duration: '45 min', calories: '98 kcal', icon: '🧘‍♀️' },
    { time: 'Yesterday', activity: 'Strength Training', duration: '60 min', calories: '256 kcal', icon: '💪' },
    { time: '2 days ago', activity: 'Swimming', duration: '40 min', calories: '198 kcal', icon: '🏊‍♀️' }  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Enhanced Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
          <Text style={styles.headerSubtitle}>Track your daily progress</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/health/create' as any)}
          >
            <Plus size={20} color={colors.background} />
          </TouchableOpacity>
        </View>

        {/* Time Period Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Stats Grid */}
        <View style={styles.statsGrid}>
          {dailyStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.8}>
                <View style={styles.statHeader}>
                  <View style={styles.statLabelRow}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                      <IconComponent size={18} color={stat.color} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <Text style={styles.statBadgeText}>{stat.progress}%</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>
                  {stat.value}
                  {stat.label === 'Distance' && <Text style={styles.statTarget}> km</Text>}
                  {stat.label === 'Active Time' && <Text style={styles.statTarget}> min</Text>}
                </Text>
                <Text style={styles.statTarget}>Goal: {stat.target}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${stat.progress}%`, backgroundColor: stat.color }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Enhanced Challenge Card */}
        <TouchableOpacity 
          style={styles.challengeCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/challenges/index')}
        >
          <View style={styles.challengeHeader}>
            <View style={styles.challengeIcon}>
              <Text style={styles.challengeEmoji}>🎯</Text>
            </View>
            <View style={styles.challengeTitleContainer}>
              <Text style={styles.challengeTitle}>Challenges</Text>
              <Text style={styles.challengeSubtitle}>Join & Compete</Text>
            </View>
            <View style={styles.challengeBadge}>
              <Text style={styles.challengeBadgeText}>NEW</Text>
            </View>
          </View>
          <Text style={styles.challengeDescription}>
            Discover exciting health challenges and compete with others!
          </Text>
          <View style={styles.challengeProgress}>
            <Text style={styles.challengeProgressText}>Tap to explore challenges</Text>
            <Text style={styles.challengeRemainingText}>Find your next goal</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.challengeProgressBar}>
              <View style={[styles.progressFill, { width: '85%', backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.progressDots}>
              <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.surfaceVariant }]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Enhanced Circular Progress */}
        <View style={styles.progressSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <TouchableOpacity style={styles.progressMenuButton}>
              <Text style={styles.progressMenuText}>•••</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressContainer}>
            <CircularProgress
              size={200}
              progress={81}
              strokeWidth={12}
              color={colors.primary}
              backgroundColor={colors.surfaceVariant}
            >
              <View style={styles.progressContent}>
                <Text style={styles.progressValue}>524</Text>
                <Text style={styles.progressLabel}>Calories Burned</Text>
                <Text style={styles.progressTarget}>Goal: 650 kcal</Text>
              </View>
            </CircularProgress>
            <View style={styles.progressStats}>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>81%</Text>
                <Text style={styles.progressStatLabel}>Complete</Text>
              </View>
              <View style={styles.progressStatDivider} />
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>126</Text>
                <Text style={styles.progressStatLabel}>Remaining</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities Timeline */}
        <View style={styles.activitiesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
              <TrendingUp size={16} color={colors.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          {recentActivities.map((activity, index) => (
            <TouchableOpacity key={index} style={styles.activityItem} activeOpacity={0.7}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>{activity.icon}</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.activity}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.activityDuration}>{activity.duration}</Text>
                <Text style={styles.activityCalories}>{activity.calories}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Awards Section */}
        <View style={styles.awardsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
              <BarChart3 size={16} color={colors.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>You've earned 6/12 achievements this month.</Text>
          
          <View style={styles.awardsGrid}>
            <View style={[styles.awardCard, styles.awardActive]}>
              <View style={styles.awardIconContainer}>
                <Trophy size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.awardTitle, styles.awardActiveTitle]}>7-Day Streak</Text>
              <Text style={[styles.awardSubtitle, styles.awardActiveSubtitle]}>Consistency Master</Text>
              <View style={styles.awardProgress}>
                <View style={styles.awardProgressBar}>
                  <View style={[styles.awardProgressFill, { width: '100%' }]} />
                </View>
              </View>
            </View>
            <View style={[styles.awardCard, styles.awardActive]}>
              <View style={styles.awardIconContainer}>
                <Medal size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.awardTitle, styles.awardActiveTitle]}>Goal Crusher</Text>
              <Text style={[styles.awardSubtitle, styles.awardActiveSubtitle]}>200% Target</Text>
              <View style={styles.awardProgress}>
                <View style={styles.awardProgressBar}>
                  <View style={[styles.awardProgressFill, { width: '100%' }]} />
                </View>
              </View>
            </View>
            <View style={[styles.awardCard, styles.awardActive]}>
              <View style={styles.awardIconContainer}>
                <Award size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.awardTitle, styles.awardActiveTitle]}>New Record</Text>
              <Text style={[styles.awardSubtitle, styles.awardActiveSubtitle]}>Personal Best</Text>
              <View style={styles.awardProgress}>
                <View style={styles.awardProgressBar}>
                  <View style={[styles.awardProgressFill, { width: '100%' }]} />
                </View>
              </View>
            </View>
            <View style={styles.awardCard}>
              <View style={[styles.awardIconContainer, { backgroundColor: colors.surfaceVariant }]}>
                <Target size={24} color={colors.textSecondary} />
              </View>
              <Text style={styles.awardTitle}>Marathon Ready</Text>
              <Text style={styles.awardSubtitle}>Complete 42km total</Text>
              <View style={styles.awardProgress}>
                <View style={styles.awardProgressBar}>
                  <View style={[styles.awardProgressFill, { width: '60%', backgroundColor: colors.primary }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Enhanced Location & Stats */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.locationText}>Ottawa, Canada</Text>
          </View>
          <View style={styles.locationStats}>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatValue}>2,847</Text>
              <Text style={styles.locationStatLabel}>Active Users</Text>
            </View>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatValue}>15.2k</Text>
              <Text style={styles.locationStatLabel}>Total Steps</Text>
            </View>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatValue}>#3</Text>
              <Text style={styles.locationStatLabel}>Your Rank</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Week Winner */}
        <View style={styles.winnerContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Week Champion</Text>
            <TouchableOpacity>
              <TrendingUp size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.winnerCard}>
            <View style={styles.winnerInfo}>
              <View style={styles.winnerAvatar}>
                <Text style={styles.winnerInitials}>AO</Text>
              </View>
              <View style={styles.winnerDetails}>
                <Text style={styles.winnerName}>Alfred Owen</Text>
                <Text style={styles.winnerStats}>12 workouts • 847 min</Text>
              </View>
            </View>
            <View style={styles.winnerTime}>
              <Text style={styles.winnerTimeText}>🏆 Champion</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Route */}
        <View style={styles.routeContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Route</Text>
            <TouchableOpacity>
              <Calendar size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.routeCard}>
            <View style={styles.routeMap}>
              <View style={styles.routeMapPlaceholder}>
                <View style={styles.routePoint} />
                <View style={styles.routePath} />
              </View>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeDistance}>6.2 km</Text>
              <Text style={styles.routeCalories}>524 kcal burned</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Join Button */}
        <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
          <Activity size={22} color="#FFFFFF" style={{ marginRight: 10 }} />
          <Text style={styles.joinButtonText}>Start New Activity</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Health Logger Modal */}
      <HealthLogger
        visible={showHealthLogger}
        onClose={() => setShowHealthLogger(false)}
        onLogCreated={handleLogCreated}
      />
    </SafeAreaView>
  );
}
  const styles = ({colors}: {colors: Colors}) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 28,
      backgroundColor: colors.cardBackground,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    tabContainer: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 28,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 16,
      padding: 6,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    tab: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      borderRadius: 12,
    },
    activeTab: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      marginBottom: 24,
      gap: 8,
    },
    statCard: {
      width: (width - 48) / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    statBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statBadgeText: {
      fontSize: 11,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    statTarget: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    challengeCard: {
      backgroundColor: colors.cardBackground,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    challengeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    challengeIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    challengeEmoji: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
    },
    challengeTitleContainer: {
      flex: 1,
    },
    challengeTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 2,
    },
    challengeSubtitle: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    challengeBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    challengeBadgeText: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    challengeDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
    challengeProgress: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    challengeProgressText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    challengeRemainingText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    challengeProgressBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressDots: {
      flexDirection: 'row',
      gap: 4,
    },
    progressDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    progressSection: {
      marginBottom: 32,
    },
    progressContainer: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 20,
    },
    progressContent: {
      alignItems: 'center',
    },
    progressValue: {
      fontSize: 36,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    progressLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      marginTop: 8,
    },
    progressTarget: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      marginTop: 4,
    },
    progressStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    progressStatItem: {
      flex: 1,
      alignItems: 'center',
    },
    progressStatValue: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    progressStatLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 4,
    },
    progressStatDivider: {
      width: 1,
      height: 32,
      backgroundColor: colors.surfaceVariant,
      marginHorizontal: 16,
    },
    progressMenuButton: {
      padding: 4,
    },
    progressMenuText: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.textSecondary,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary + '10',
      borderRadius: 16,
    },
    awardIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    awardProgress: {
      marginTop: 8,
      width: '100%',
    },
    awardProgressBar: {
      height: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 2,
      overflow: 'hidden',
    },
    awardProgressFill: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    seeAllText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    awardsContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    awardsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    awardCard: {
      width: (width - 64) / 2,
      backgroundColor: colors.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    awardActive: {
      backgroundColor: colors.primary,
    },
    awardTitle: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 4,
    },
    awardActiveTitle: {
      color: '#FFFFFF',
    },
    awardSubtitle: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
    },
    awardActiveSubtitle: {
      color: '#FFFFFF',
      opacity: 0.8,
    },
    activitiesContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    activityIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    activityIconText: {
      fontSize: 20,
    },
    activityInfo: {
      flex: 1,
    },
    activityName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    activityTime: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    activityStats: {
      alignItems: 'flex-end',
    },
    activityDuration: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 2,
    },
    activityCalories: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    locationCard: {
      backgroundColor: colors.cardBackground,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    locationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    locationText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 8,
    },
    locationStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    locationStat: {
      alignItems: 'center',
    },
    locationStatValue: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    locationStatLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    winnerContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    winnerCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    winnerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    winnerAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    winnerInitials: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    winnerDetails: {
      justifyContent: 'center',
    },
    winnerName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    winnerStats: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    winnerTime: {
      alignItems: 'flex-end',
    },
    winnerTimeText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    routeContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    routeCard: {
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    routeMap: {
      flex: 1,
      height: 60,
      marginRight: 16,
    },
    routeMapPlaceholder: {
      flex: 1,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    routePoint: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    routePath: {
      position: 'absolute',
      width: 2,
      height: 30,
      backgroundColor: colors.primary,
      top: 15,
      borderRadius: 1,
    },
    routeInfo: {
      alignItems: 'flex-end',
    },
    routeDistance: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    routeCalories: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    joinButton: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      marginHorizontal: 20,
      marginBottom: 32,
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    addButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    joinButtonText: {
      fontSize: 17,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    }
  });
  
  const createStyles = (colors: Colors) => styles({colors});