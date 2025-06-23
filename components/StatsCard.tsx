import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function StatsCard({ title, value, subtitle, backgroundColor, textColor }: StatsCardProps) {
  const { colors } = useTheme();
  
  const cardBg = backgroundColor || colors.accent;
  const cardTextColor = textColor || '#FFFFFF';
  
  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      <Text style={[styles.title, { color: cardTextColor }]}>{title}</Text>
      <Text style={[styles.value, { color: cardTextColor }]}>{value}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: cardTextColor }]}>{subtitle}</Text>}
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