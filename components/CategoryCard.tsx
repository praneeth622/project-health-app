import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  backgroundColor?: string;
  onPress?: () => void;
}

export default function CategoryCard({ title, icon, backgroundColor, onPress }: CategoryCardProps) {
  const { colors } = useTheme();
  
  const cardBg = backgroundColor || colors.accent;
  
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: cardBg }]} onPress={onPress}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});