import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity, 
  Droplets, 
  Footprints, 
  Scale, 
  Moon,
  Target,
  Zap,
  Award
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import HealthLogsService, { HealthLogStats } from '@/services/healthLogsService';
import ActivityChart from '@/components/ActivityChart';

const { width } = Dimensions.get('window');

interface StatsData {
  type: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  stats: HealthLogStats | null;
  loading: boolean;
}

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
    type: 'weight' as const,
    icon: Scale,
    label: 'Weight',
    color: '#8B5CF6',
    unit: 'kg',
    target: 70
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

const periods = [
  { key: 'week', label: '7 Days', days: 7 },
  { key: 'month', label: '30 Days', days: 30 },
  { key: 'year', label: '1 Year', days: 365 },
];

export default function HealthStatsDetailScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const metricType = params.type as string || 'steps';
  
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [statsData, setStatsData] = useState<StatsData[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedMetric = healthMetrics.find(m => m.type === metricType) || healthMetrics[0];

  useEffect(() => {
    loadStatsData();
  }, [selectedPeriod]);

  const loadStatsData = async () => {
    try {
      setLoading(true);
      const period = periods.find(p => p.key === selectedPeriod)!;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - period.days);

      const statsPromises = healthMetrics.map(async (metric) => {
        try {
          const stats = await HealthLogsService.getHealthStats(
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0],
            metric.type
          );
          
          return {
            type: metric.type,
            stats,
            loading: false
          };
        } catch (error) {
          console.error(`Failed to load stats for ${metric.type}:`, error);
          return {
            type: metric.type,
            stats: null,
            loading: false
          };
        }
      });

      const results = await Promise.all(statsPromises);
      setStatsData(results);
    } catch (error) {
      console.error('Failed to load stats data:', error);
      Alert.alert('Error', 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const renderMetricStats = (metric: typeof healthMetrics[0], stats: HealthLogStats | null) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={metric.type} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
            <IconComponent size={24} color={metric.color} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricTarget}>Target: {metric.target} {metric.unit}</Text>
          </View>
        </View>

        {stats ? (
          <View style={styles.metricContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: metric.color }]}>
                  {stats.average_value.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Daily Avg</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: metric.color }]}>
                  {stats.max_value.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Best Day</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: metric.color }]}>
                  {stats.total_logs}
                </Text>
                <Text style={styles.statLabel}>Total Logs</Text>
              </View>
            </View>

            <View style={styles.trendContainer}>
              <View style={styles.trendInfo}>
                {stats.trend === 'up' && <TrendingUp size={16} color="#10B981" />}
                {stats.trend === 'down' && <TrendingDown size={16} color="#EF4444" />}
                {stats.trend === 'stable' && <Target size={16} color="#6B7280" />}
                <Text style={[
                  styles.trendText,
                  { color: stats.trend === 'up' ? '#10B981' : stats.trend === 'down' ? '#EF4444' : '#6B7280' }
                ]}>
                  {stats.trend === 'up' ? 'Improving' : stats.trend === 'down' ? 'Declining' : 'Stable'}
                </Text>
              </View>
              
              <Text style={styles.periodText}>
                {new Date(stats.period_start).toLocaleDateString()} - {new Date(stats.period_end).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
      </View>
    );
  };

  const renderMainMetricChart = () => {
    const mainStats = statsData.find(s => s.type === selectedMetric.type);
    if (!mainStats?.stats) return null;

    // Generate sample chart data based on the period
    const period = periods.find(p => p.key === selectedPeriod)!;
    const chartData = Array.from({ length: Math.min(period.days, 30) }, (_, i) => ({
      day: i === 0 ? 'Today' : `${i}d ago`,
      value: Math.random() * 100,
      isHighlighted: i === 0
    }));

    return (
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{selectedMetric.label} Trend</Text>
          <View style={styles.chartLegend}>
            <View style={[styles.legendDot, { backgroundColor: selectedMetric.color }]} />
            <Text style={styles.legendText}>Daily Progress</Text>
          </View>
        </View>
        <ActivityChart data={chartData} maxValue={100} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      margin: 16,
      padding: 4,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    activePeriodButton: {
      backgroundColor: colors.background,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    periodButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    activePeriodButtonText: {
      color: colors.text,
      fontFamily: 'Inter-SemiBold',
    },
    scrollContent: {
      padding: 16,
    },
    chartSection: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    chartTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    chartLegend: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    metricsGrid: {
      gap: 16,
    },
    metricCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    metricIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    metricInfo: {
      flex: 1,
    },
    metricLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    metricTarget: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    metricContent: {
      gap: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 16,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    trendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    trendInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    trendText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 6,
    },
    periodText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    noDataContainer: {
      padding: 20,
      alignItems: 'center',
    },
    noDataText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Statistics</Text>
      </View>

      <View style={styles.periodSelector}>
        {periods.map((period) => {
          const isActive = selectedPeriod === period.key;
          return (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                isActive && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodButtonText,
                isActive && styles.activePeriodButtonText
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.scrollContent}>
        {renderMainMetricChart()}
        
        <Text style={styles.sectionTitle}>All Metrics</Text>
        <View style={styles.metricsGrid}>
          {healthMetrics.map((metric) => {
            const data = statsData.find(s => s.type === metric.type);
            return renderMetricStats(metric, data?.stats || null);
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
