import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  BarChart3, 
  Activity, 
  Calendar,
  TrendingUp,
  Settings,
  Bell,
  Footprints,
  Droplets,
  Scale,
  Moon,
  Target,
  Flame
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import HealthLogger from '@/components/HealthLogger';
import HealthLogsList from '@/components/HealthLogsList';
import HealthStats from '@/components/HealthStats';
import CircularProgress from '@/components/CircularProgress';
import HealthLogsService, { HealthLog } from '@/services/healthLogsService';

type HealthTab = 'overview' | 'logs' | 'stats';

const healthTabs = [
  { key: 'overview' as const, label: 'Overview', icon: Activity },
  { key: 'logs' as const, label: 'Logs', icon: Calendar },
  { key: 'stats' as const, label: 'Stats', icon: BarChart3 },
];

const quickActions = [
  { type: 'steps', icon: Footprints, label: 'Steps', color: '#4ECDC4' },
  { type: 'water', icon: Droplets, label: 'Water', color: '#3B82F6' },
  { type: 'exercise', icon: Activity, label: 'Exercise', color: '#F59E0B' },
  { type: 'weight', icon: Scale, label: 'Weight', color: '#8B5CF6' },
  { type: 'sleep', icon: Moon, label: 'Sleep', color: '#6B7280' },
];

const { width } = Dimensions.get('window');

export default function HealthScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<HealthTab>('overview');
  const [showLogger, setShowLogger] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logsKey, setLogsKey] = useState(0); // Force refresh logs
  const [todayLogs, setTodayLogs] = useState<HealthLog[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const [logs, summary] = await Promise.all([
        HealthLogsService.getTodayHealthLogs(),
        HealthLogsService.getWeeklySummary()
      ]);
      setTodayLogs(logs);
      setWeeklySummary(summary);
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogCreated = useCallback((log: HealthLog) => {
    // Refresh the logs list and data
    setLogsKey(prev => prev + 1);
    loadHealthData();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHealthData();
    setLogsKey(prev => prev + 1);
    setRefreshing(false);
  }, []);

  const getDailyProgress = () => {
    const stepsLog = todayLogs.find(log => log.type === 'steps');
    const waterLog = todayLogs.find(log => log.type === 'water');
    const exerciseLog = todayLogs.find(log => log.type === 'exercise');
    const sleepLog = todayLogs.find(log => log.type === 'sleep');

    return [
      {
        id: 'steps',
        label: 'Steps',
        value: stepsLog?.value || 0,
        target: 10000,
        unit: 'steps',
        icon: Footprints,
        color: '#4ECDC4',
        progress: stepsLog ? Math.min((stepsLog.value / 10000) * 100, 100) : 0
      },
      {
        id: 'water',
        label: 'Water',
        value: waterLog?.value || 0,
        target: 8,
        unit: 'glasses',
        icon: Droplets,
        color: '#3B82F6',
        progress: waterLog ? Math.min((waterLog.value / 8) * 100, 100) : 0
      },
      {
        id: 'exercise',
        label: 'Exercise',
        value: exerciseLog?.value || 0,
        target: 60,
        unit: 'minutes',
        icon: Activity,
        color: '#F59E0B',
        progress: exerciseLog ? Math.min((exerciseLog.value / 60) * 100, 100) : 0
      },
      {
        id: 'sleep',
        label: 'Sleep',
        value: sleepLog?.value || 0,
        target: 8,
        unit: 'hours',
        icon: Moon,
        color: '#6B7280',
        progress: sleepLog ? Math.min((sleepLog.value / 8) * 100, 100) : 0
      }
    ];
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Quick Log</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <TouchableOpacity
              key={action.type}
              style={[styles.quickActionButton, { backgroundColor: action.color + '20' }]}
              onPress={() => setShowLogger(true)}
            >
              <IconComponent size={24} color={action.color} />
              <Text style={[styles.quickActionText, { color: action.color }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderTodayProgress = () => {
    const dailyProgress = getDailyProgress();
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <TouchableOpacity onPress={() => setActiveTab('logs')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressGrid}>
          {dailyProgress.map((item) => {
            const IconComponent = item.icon;
            return (
              <View key={item.id} style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <IconComponent size={20} color={item.color} />
                  <Text style={styles.progressLabel}>{item.label}</Text>
                </View>
                
                <View style={styles.progressContent}>
                  <CircularProgress
                    progress={item.progress}
                    size={60}
                    strokeWidth={6}
                    color={item.color}
                  />
                  <View style={styles.progressText}>
                    <Text style={[styles.progressValue, { color: item.color }]}>
                      {item.value.toLocaleString()}
                    </Text>
                    <Text style={styles.progressTarget}>/ {item.target} {item.unit}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderWeeklySummary = () => {
    if (!weeklySummary) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Footprints size={24} color="#4ECDC4" />
            <Text style={styles.summaryValue}>
              {(weeklySummary.steps.total / 1000).toFixed(1)}K
            </Text>
            <Text style={styles.summaryLabel}>Total Steps</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Droplets size={24} color="#3B82F6" />
            <Text style={styles.summaryValue}>
              {weeklySummary.water.total}
            </Text>
            <Text style={styles.summaryLabel}>Glasses Water</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Flame size={24} color="#F59E0B" />
            <Text style={styles.summaryValue}>
              {weeklySummary.exercise.total}
            </Text>
            <Text style={styles.summaryLabel}>Minutes Active</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderOverview = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setShowLogger(true)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#4ECDC4' + '20' }]}>
              <Plus size={24} color="#4ECDC4" />
            </View>
            <Text style={styles.quickActionText}>Add Health Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setActiveTab('stats')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B' + '20' }]}>
              <TrendingUp size={24} color="#F59E0B" />
            </View>
            <Text style={styles.quickActionText}>View Trends</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Health Stats Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <TouchableOpacity onPress={() => setActiveTab('stats')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <HealthStats userId={undefined} />
      </View>

      {/* Recent Logs Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => setActiveTab('logs')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentLogsContainer}>
          <HealthLogsList 
            key={`preview-${logsKey}`}
            limit={5}
            showActions={false}
            onLogUpdated={handleLogCreated}
          />
        </View>
      </View>

      {/* Health Challenges */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Health Challenges</Text>
          <TouchableOpacity onPress={() => router.push('/challenges/index')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.challengePromptCard}
          onPress={() => router.push('/challenges/index')}
        >
          <View style={styles.challengePromptIcon}>
            <Text style={styles.challengePromptEmoji}>🎯</Text>
          </View>
          <View style={styles.challengePromptContent}>
            <Text style={styles.challengePromptTitle}>Join Health Challenges</Text>
            <Text style={styles.challengePromptDescription}>
              Compete with others and achieve your health goals together!
            </Text>
          </View>
          <View style={styles.challengePromptArrow}>
            <Text style={styles.challengePromptArrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderLogs = () => (
    <HealthLogsList 
      key={`full-${logsKey}`}
      onLogUpdated={handleLogCreated}
      onLogDeleted={() => setLogsKey(prev => prev + 1)}
    />
  );

  const renderStats = () => (
    <HealthStats userId={undefined} />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'logs':
        return renderLogs();
      case 'stats':
        return renderStats();
      default:
        return renderOverview();
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
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fabButton: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 1000,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    tabContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tabIcon: {
      marginRight: 8,
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
      fontFamily: 'Inter-SemiBold',
    },
    tabContentContainer: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    seeAllText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    quickActions: {
      flexDirection: 'row',
      gap: 16,
    },
    quickAction: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    quickActionText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      textAlign: 'center',
    },
    recentLogsContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    quickActionButton: {
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginRight: 12,
    },
    progressGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'space-between',
    },
    progressCard: {
      flex: 1,
      minWidth: '48%',
      padding: 16,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    progressLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    progressContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    progressText: {
      flex: 1,
    },
    progressValue: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
    },
    progressTarget: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    summaryGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    summaryValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginTop: 8,
    },
    summaryLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    challengePromptCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    challengePromptIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    challengePromptEmoji: {
      fontSize: 24,
    },
    challengePromptContent: {
      flex: 1,
    },
    challengePromptTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    challengePromptDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    challengePromptArrow: {
      marginLeft: 12,
    },
    challengePromptArrowText: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Health</Text>
          <Text style={styles.headerSubtitle}>Track your wellness journey</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Bell size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {healthTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComponent = tab.icon;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <View style={styles.tabContent}>
                <IconComponent 
                  size={18} 
                  color={isActive ? colors.primary : colors.textSecondary}
                  style={styles.tabIcon}
                />
                <Text style={[
                  styles.tabText,
                  isActive && styles.tabTextActive
                ]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContentContainer}>
        {renderTabContent()}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => setShowLogger(true)}
      >
        <Plus size={24} color={colors.background} />
      </TouchableOpacity>

      {/* Health Logger Modal */}
      <HealthLogger
        visible={showLogger}
        onClose={() => setShowLogger(false)}
        onLogCreated={handleLogCreated}
      />
    </SafeAreaView>
  );
}
