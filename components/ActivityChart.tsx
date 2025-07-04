import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface ActivityData {
  day: string;
  value: number;
  isHighlighted?: boolean;
}

interface ActivityChartProps {
  data: ActivityData[];
  maxValue: number;
}

export default function ActivityChart({ data, maxValue }: ActivityChartProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginVertical: 16,
      paddingHorizontal: 20,
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 140,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    barContainer: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      justifyContent: 'flex-end',
    },
    barWrapper: {
      height: 100,
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'relative',
      marginBottom: 8,
    },
    bar: {
      width: 20,
      borderRadius: 10,
      minHeight: 4,
    },
    barShadow: {
      position: 'absolute',
      bottom: 0,
      width: 20,
      height: '100%',
      borderRadius: 10,
      opacity: 0.1,
    },
    dayLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    highlightedDayLabel: {
      color: colors.primary,
      fontFamily: 'Inter-Bold',
    },
    highlightLabel: {
      position: 'absolute',
      bottom: 110,
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: 'center',
      minWidth: 60,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    highlightLabelArrow: {
      position: 'absolute',
      bottom: -4,
      width: 0,
      height: 0,
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderTopWidth: 4,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: colors.primary,
    },
    highlightText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontFamily: 'Inter-Bold',
    },
    highlightValue: {
      color: '#FFFFFF',
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      marginTop: 2,
    },
    chartStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 11,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const averageValue = Math.round(totalValue / data.length);
  const maxDayValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const barHeight = Math.max((item.value / maxValue) * 80, 4);
          const isHighlighted = item.isHighlighted;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                {/* Shadow bar */}
                <View
                  style={[
                    styles.barShadow,
                    {
                      backgroundColor: colors.surfaceVariant,
                    },
                  ]}
                />
                {/* Actual bar */}
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isHighlighted 
                        ? colors.primary 
                        : item.value > averageValue 
                        ? colors.accent 
                        : colors.primary + '60',
                    },
                  ]}
                />
                {/* Highlight tooltip */}
                {/* {isHighlighted && (
                  <View style={styles.highlightLabel}>
                    <Text style={styles.highlightText}>Active Day</Text>
                    <Text style={styles.highlightValue}>{item.value}% Goal</Text>
                    <View style={styles.highlightLabelArrow} />
                  </View>
                )} */}
              </View>
              <Text 
                style={[
                  styles.dayLabel, 
                  isHighlighted && styles.highlightedDayLabel
                ]}
              >
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
      
      {/* Chart Statistics */}
      <View style={styles.chartStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageValue}%</Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{maxDayValue}%</Text>
          <Text style={styles.statLabel}>Best Day</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalValue}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
      </View>
    </View>
  );
}

