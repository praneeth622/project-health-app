import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function StatsCard({ title, value, subtitle, backgroundColor = '#FF6B82', textColor = '#FFFFFF' }: StatsCardProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    minHeight: 100,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    opacity: 0.9,
  },
  value: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
});