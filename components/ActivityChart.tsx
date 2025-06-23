import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.value / maxValue) * 100,
                    backgroundColor: item.isHighlighted ? '#FF6B82' : '#F3F4F6',
                  },
                ]}
              />
              {item.isHighlighted && (
                <View style={styles.highlightLabel}>
                  <Text style={styles.highlightText}>Dumbbell</Text>
                  <Text style={styles.highlightValue}>628 Kcal</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  chartContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  barContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: 12,
    minHeight: 8,
  },
  highlightLabel: {
    position: 'absolute',
    bottom: 130,
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  highlightText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  highlightValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});