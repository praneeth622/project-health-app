import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function NotificationBadge({ 
  count, 
  size = 'medium',
  position = 'top-right' 
}: NotificationBadgeProps) {
  const { colors } = useTheme();

  if (count <= 0) return null;

  const sizeStyles = {
    small: { width: 16, height: 16, borderRadius: 8 },
    medium: { width: 20, height: 20, borderRadius: 10 },
    large: { width: 24, height: 24, borderRadius: 12 }
  };

  const textSizes = {
    small: 10,
    medium: 11,
    large: 12
  };

  const positionStyles = {
    'top-right': { top: -8, right: -8 },
    'top-left': { top: -8, left: -8 },
    'bottom-right': { bottom: -8, right: -8 },
    'bottom-left': { bottom: -8, left: -8 }
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      backgroundColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
      minWidth: sizeStyles[size].width,
      height: sizeStyles[size].height,
      borderRadius: sizeStyles[size].borderRadius,
      paddingHorizontal: count > 9 ? 4 : 0,
      ...positionStyles[position],
    },
    text: {
      color: colors.background,
      fontSize: textSizes[size],
      fontFamily: 'Inter-Bold',
      lineHeight: textSizes[size] + 2,
    }
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
}
