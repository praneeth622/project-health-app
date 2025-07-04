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
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Zap,
  Calendar,
  Activity,
  Droplets,
  Footprints,
  Scale,
  Moon,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import HealthLogsService from '@/services/healthLogsService';

interface Insight {
  id: string;
  type: 'achievement' | 'trend' | 'goal' | 'recommendation';
  title: string;
  description: string;
  icon: any;
  color: string;
  action?: string;
}

interface WeeklyInsights {
  streaks: number;
  mostActiveDay: string;
  improvements: string[];
  recommendations: string[];
  achievements: string[];
}

export default function HealthInsightsScreen() {
  const { colors } = useTheme();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      
      // Get weekly summary and generate insights
      const weeklySummary = await HealthLogsService.getWeeklySummary();
      const todayLogs = await HealthLogsService.getTodayHealthLogs();
      
      if (weeklySummary) {
        const generatedInsights = generateInsights(weeklySummary, todayLogs);
        setInsights(generatedInsights);
        
        const weeklyData = generateWeeklyInsights(weeklySummary);
        setWeeklyInsights(weeklyData);
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
      Alert.alert('Error', 'Failed to load health insights');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (summary: any, todayLogs: any[]): Insight[] => {
    const insights: Insight[] = [];

    // Steps insights
    if (summary.steps.average > 8000) {
      insights.push({
        id: 'steps-achievement',
        type: 'achievement',
        title: 'Great Walking Habit!',
        description: `You're averaging ${Math.round(summary.steps.average).toLocaleString()} steps per day this week.`,
        icon: Award,
        color: '#10B981'
      });
    } else if (summary.steps.average < 5000) {
      insights.push({
        id: 'steps-recommendation',
        type: 'recommendation',
        title: 'Increase Daily Steps',
        description: 'Try to add a 10-minute walk to your daily routine to boost your step count.',
        icon: Footprints,
        color: '#F59E0B',
        action: 'Log Steps'
      });
    }

    // Water insights
    if (summary.water.average >= 7) {
      insights.push({
        id: 'water-achievement',
        type: 'achievement',
        title: 'Excellent Hydration!',
        description: `You're drinking ${summary.water.average.toFixed(1)} glasses of water daily on average.`,
        icon: Droplets,
        color: '#3B82F6'
      });
    } else {
      insights.push({
        id: 'water-goal',
        type: 'goal',
        title: 'Hydration Goal',
        description: 'Aim for 8 glasses of water daily for optimal health.',
        icon: Target,
        color: '#3B82F6',
        action: 'Log Water'
      });
    }

    // Exercise insights
    if (summary.exercise.total > 300) {
      insights.push({
        id: 'exercise-achievement',
        type: 'achievement',
        title: 'Weekly Exercise Goal Met!',
        description: `You've exercised for ${summary.exercise.total} minutes this week.`,
        icon: Zap,
        color: '#F59E0B'
      });
    }

    // Sleep insights
    if (summary.sleep.average >= 7.5) {
      insights.push({
        id: 'sleep-achievement',
        type: 'achievement',
        title: 'Great Sleep Pattern!',
        description: `You're getting ${summary.sleep.average.toFixed(1)} hours of sleep on average.`,
        icon: Moon,
        color: '#6B7280'
      });
    }

    // Today's progress
    const todaySteps = todayLogs.find(log => log.type === 'steps');
    if (todaySteps && todaySteps.value > 10000) {
      insights.push({
        id: 'today-steps',
        type: 'achievement',
        title: 'Daily Step Goal Achieved!',
        description: `You've reached ${todaySteps.value.toLocaleString()} steps today.`,
        icon: CheckCircle,
        color: '#10B981'
      });
    }

    return insights;
  };

  const generateWeeklyInsights = (summary: any): WeeklyInsights => {
    return {
      streaks: Math.floor(Math.random() * 7) + 1, // Mock streak calculation
      mostActiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)],
      improvements: [
        'Steps increased by 15% this week',
        'Water intake is more consistent',
        'Sleep quality has improved'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      recommendations: [
        'Try morning stretches to improve flexibility',
        'Add 2 more glasses of water to your daily routine',
        'Consider a 30-minute evening walk'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      achievements: [
        'Completed 5 workout sessions',
        'Maintained consistent sleep schedule',
        'Hit daily step goal 6 out of 7 days'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  };

  const handleInsightAction = (insight: Insight) => {
    if (insight.action === 'Log Steps') {
      router.push('/health/create?type=steps' as any);
    } else if (insight.action === 'Log Water') {
      router.push('/health/create?type=water' as any);
    }
  };

  const renderInsightCard = (insight: Insight) => {
    const IconComponent = insight.icon;
    
    return (
      <TouchableOpacity
        key={insight.id}
        style={[styles.insightCard, { borderLeftColor: insight.color }]}
        onPress={() => insight.action && handleInsightAction(insight)}
      >
        <View style={styles.insightHeader}>
          <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
            <IconComponent size={20} color={insight.color} />
          </View>
          <View style={styles.insightBadge}>
            <Text style={[styles.insightBadgeText, { color: insight.color }]}>
              {insight.type.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightDescription}>{insight.description}</Text>
        
        {insight.action && (
          <View style={styles.insightAction}>
            <Text style={[styles.actionText, { color: insight.color }]}>
              {insight.action} →
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWeeklyOverview = () => {
    if (!weeklyInsights) return null;

    return (
      <View style={styles.weeklyOverview}>
        <Text style={styles.sectionTitle}>This Week's Overview</Text>
        
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{weeklyInsights.streaks}</Text>
            <Text style={styles.overviewLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{weeklyInsights.mostActiveDay}</Text>
            <Text style={styles.overviewLabel}>Most Active Day</Text>
          </View>
        </View>

        {weeklyInsights.improvements.length > 0 && (
          <View style={styles.insightSection}>
            <Text style={styles.insightSectionTitle}>🎯 Improvements</Text>
            {weeklyInsights.improvements.map((improvement, index) => (
              <View key={index} style={styles.insightItem}>
                <TrendingUp size={16} color="#10B981" />
                <Text style={styles.insightItemText}>{improvement}</Text>
              </View>
            ))}
          </View>
        )}

        {weeklyInsights.achievements.length > 0 && (
          <View style={styles.insightSection}>
            <Text style={styles.insightSectionTitle}>🏆 Achievements</Text>
            {weeklyInsights.achievements.map((achievement, index) => (
              <View key={index} style={styles.insightItem}>
                <Award size={16} color="#F59E0B" />
                <Text style={styles.insightItemText}>{achievement}</Text>
              </View>
            ))}
          </View>
        )}

        {weeklyInsights.recommendations.length > 0 && (
          <View style={styles.insightSection}>
            <Text style={styles.insightSectionTitle}>💡 Recommendations</Text>
            {weeklyInsights.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.insightItem}>
                <Info size={16} color="#3B82F6" />
                <Text style={styles.insightItemText}>{recommendation}</Text>
              </View>
            ))}
          </View>
        )}
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
    scrollContent: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    insightCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
    },
    insightHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    insightIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    insightBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      backgroundColor: colors.surfaceVariant,
    },
    insightBadgeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
    },
    insightTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    insightDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    insightAction: {
      marginTop: 12,
    },
    actionText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
    weeklyOverview: {
      marginBottom: 24,
    },
    overviewGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    overviewCard: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    overviewValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    overviewLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    insightSection: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    insightSectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 12,
    },
    insightItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    insightItemText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginLeft: 8,
      flex: 1,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Insights</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>Loading insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Insights</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {renderWeeklyOverview()}
        
        <Text style={styles.sectionTitle}>Personal Insights</Text>
        {insights.map(renderInsightCard)}
        
        {insights.length === 0 && (
          <View style={styles.overviewCard}>
            <Info size={32} color={colors.textSecondary} />
            <Text style={[styles.overviewLabel, { marginTop: 12 }]}>
              Keep logging your health data to see personalized insights!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
