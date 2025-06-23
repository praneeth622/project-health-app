import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, Play, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface WorkoutCardProps {
  title: string;
  week: string;
  workoutNumber: string;
  nextExercise: string;
  backgroundColor?: string;
  onPress?: () => void;
}

export default function WorkoutCard({ title, week, workoutNumber, nextExercise, backgroundColor, onPress }: WorkoutCardProps) {
  const { colors } = useTheme();
  const cardBg = backgroundColor || colors.accent;

  const styles = StyleSheet.create({
    container: {
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginVertical: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'flex-start',
    },
    week: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.background,
      opacity: 0.8,
      marginBottom: 4,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.background,
      marginBottom: 4,
    },
    workoutNumber: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.background,
      opacity: 0.9,
      marginBottom: 16,
    },
    nextExercise: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
    },
    playIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    nextExerciseText: {
      flex: 1,
    },
    nextLabel: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 2,
    },
    nextExerciseName: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
  });
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: cardBg }]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Zap size={20} color={colors.background} />
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.week}>{week}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.workoutNumber}>{workoutNumber}</Text>
        
        <View style={styles.nextExercise}>
          <View style={styles.playIcon}>
            <Play size={12} color={cardBg} />
          </View>
          <View style={styles.nextExerciseText}>
            <Text style={styles.nextLabel}>Next exercise</Text>
            <Text style={styles.nextExerciseName}>{nextExercise}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

