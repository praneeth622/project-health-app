import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity, 
  Droplets, 
  Footprints, 
  Scale, 
  Moon,
  Calendar,
  BarChart3
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import HealthLogsService, { HealthLogStats } from '@/services/healthLogsService';
import ActivityChart from './ActivityChart';

interface HealthStatsProps {
  userId?: string;
}

interface StatsPeriod {
  key: 'week' | 'month' | 'year';
  label: string;
  days: number;
}

const statsPeriods: StatsPeriod[] = [
  { key: 'week', label: '7 Days', days: 7 },
  { key: 'month', label: '30 Days', days: 30 },
  { key: 'year', label: '365 Days', days: 365 },
];

const healthMetrics = [
  {
    type: 'steps' as const,
    icon: Footprints,
    label: 'Steps',
    color: '#4ECDC4',
    unit: 'steps',
    target: 10000
  },
  {
    type: 'water' as const,
    icon: Droplets,
    label: 'Water',
    color: '#3B82F6',
    unit: 'glasses',
    target: 8
  },
  {
    type: 'exercise' as const,
    icon: Activity,
    label: 'Exercise',
    color: '#F59E0B',
    unit: 'minutes',
    target: 60
  },
  {
    type: 'sleep' as const,
    icon: Moon,
    label: 'Sleep',
    color: '#6B7280',
    unit: 'hours',
    target: 8
  }
];

const formatStatValue = (value: number, type: string): string => {
  switch (type) {
    case 'steps':
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
    case 'water':
    case 'exercise':
    case 'sleep':
      return value.toFixed(1);
    case 'weight':
      return value.toFixed(1);
    default:
      return value.toString();
  }
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    case 'stable': return Minus;
  }
};

const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean = true) => {
  if (trend === 'stable') return '#6B7280';
  if (trend === 'up') return isPositive ? '#10B981' : '#EF4444';
  if (trend === 'down') return isPositive ? '#EF4444' : '#10B981';
  return '#6B7280';
};

export default function HealthStats({ userId }: HealthStatsProps) {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>(statsPeriods[0]);
  const [stats, setStats] = useState<Record<string, HealthLogStats | null>>({});
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - selectedPeriod.days);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Fetch stats for each metric
      const statsPromises = healthMetrics.map(async (metric) => {
        const stat = await HealthLogsService.getHealthStats(
          startDateStr,
          endDateStr,
          metric.type,
          userId
        );
        return { type: metric.type, stat };
      });

      const results = await Promise.all(statsPromises);
      const statsMap: Record<string, HealthLogStats | null> = {};
      
      results.forEach(({ type, stat }) => {
        statsMap[type] = stat;
      });

      setStats(statsMap);

      // Generate chart data for steps (example)
      if (selectedPeriod.key === 'week') {
        const weeklyData = await HealthLogsService.getWeekHealthLogs(userId);
        const stepData = weeklyData.filter(log => log.type === 'steps');
        
        // Create daily data for the chart
        const dailySteps = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dayName = date.toLocaleDateString('en', { weekday: 'short' });
          const dateStr = date.toISOString().split('T')[0];
          
          const dayLog = stepData.find(log => log.date.split('T')[0] === dateStr);
          
          return {
            day: dayName,
            value: dayLog ? dayLog.value : 0,
            isHighlighted: i === 6 // Highlight today
          };
        });
        
        setChartData(dailySteps);
      }
    } catch (error) {
      console.error('Failed to fetch health stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (metric: typeof healthMetrics[0]) => {
    const stat = stats[metric.type];
    const IconComponent = metric.icon;
    
    const progress = stat ? (stat.average_value / metric.target) * 100 : 0;
    const TrendIcon = stat ? getTrendIcon(stat.trend) : Minus;
    const trendColor = stat ? getTrendColor(stat.trend, true) : '#6B7280';

    return (
      <View key={metric.type} style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: metric.color + '20' }]}>
            <IconComponent size={20} color={metric.color} />
          </View>
          <View style={styles.statTrend}>
            <TrendIcon size={16} color={trendColor} />
          </View>
        </View>

        <Text style={styles.statLabel}>{metric.label}</Text>
        
        <View style={styles.statValues}>
          <Text style={styles.statValue}>
            {stat ? formatStatValue(stat.average_value, metric.type) : '0'}
          </Text>
          <Text style={styles.statUnit}>{metric.unit}</Text>
        </View>

        <View style={styles.statDetails}>
          <Text style={styles.statDetailText}>
            Avg: {stat ? formatStatValue(stat.average_value, metric.type) : '0'}
          </Text>
          <Text style={styles.statDetailText}>
            Max: {stat ? formatStatValue(stat.max_value, metric.type) : '0'}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: metric.color
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress)}%
          </Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    periodSelector: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    periodButtons: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 4,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    periodButtonActive: {
      backgroundColor: colors.background,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    periodButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    periodButtonTextActive: {
      color: colors.text,
      fontFamily: 'Inter-SemiBold',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      gap: 16,
    },
    statCard: {
      width: '48%',
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statTrend: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    statValues: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    statUnit: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 4,
    },
    statDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statDetailText: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    progressBarBg: {
      flex: 1,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressText: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    chartSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    chartTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 16,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading health statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Statistics</Text>
        <Text style={styles.subtitle}>Track your progress and trends</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <View style={styles.periodButtons}>
          {statsPeriods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod.key === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod.key === period.key && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {healthMetrics.map(renderStatCard)}
      </View>

      {/* Weekly Chart */}
      {selectedPeriod.key === 'week' && chartData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Daily Steps This Week</Text>
          <ActivityChart 
            data={chartData}
            maxValue={15000}
          />
        </View>
      )}
    </ScrollView>
  );
}
