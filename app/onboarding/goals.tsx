import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Target, Heart, Zap, Scale } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const goals = [
  { id: 'weight-loss', title: 'Weight Loss', icon: Scale, color: '#EF4444' },
  { id: 'muscle-gain', title: 'Muscle Gain', icon: Zap, color: '#F59E0B' },
  { id: 'endurance', title: 'Endurance', icon: Heart, color: '#10B981' },
  { id: 'general-fitness', title: 'General Fitness', icon: Target, color: '#8B5CF6' },
];

export default function GoalsSelection() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { completeOnboarding, profile } = useAuth();

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleComplete = async () => {
    if (selectedGoals.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one fitness goal to continue.');
      return;
    }

    setLoading(true);
    try {
      // Get goal names instead of IDs
      const goalNames = selectedGoals.map(goalId => 
        goals.find(goal => goal.id === goalId)?.title || goalId
      );

      // Prepare onboarding data from the user's journey
      const onboardingData = {
        gender: profile?.gender,
        age: profile?.age,
        height_cm: profile?.height_cm,
        weight_kg: profile?.weight_kg,
        fitness_goals: goalNames,
        fitness_level: 'beginner' as const, // Default level, could be collected in another step
      };

      const { error } = await completeOnboarding(onboardingData);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Welcome to HealYou!', 
          'Your profile has been set up successfully. Let\'s start your fitness journey!',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 40,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.primary,
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    goalsContainer: {
      flex: 1,
      gap: 16,
      marginBottom: 40,
    },
    goalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 16,
      padding: 20,
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    goalOptionSelected: {
      backgroundColor: colors.primary + '10',
      borderColor: colors.primary,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    goalIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    goalText: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
    },
    goalTextSelected: {
      color: colors.primary,
    },
    completeButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 56,
      minHeight: 56, // Ensure minimum touch target
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      paddingHorizontal: 16, // Add horizontal padding for better responsiveness
    },
    completeButtonDisabled: {
      backgroundColor: colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    completeButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Return to previous screen"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>HealYou</Text>
          <Text style={styles.title}>What are your fitness goals?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <View style={styles.goalsContainer}>
          {goals.map((goal) => {
            const IconComponent = goal.icon;
            const isSelected = selectedGoals.includes(goal.id);
            
            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  isSelected && styles.goalOptionSelected,
                ]}
                onPress={() => toggleGoal(goal.id)}
                accessibilityRole="button"
                accessibilityLabel={`${goal.title} fitness goal`}
                accessibilityHint={isSelected ? 'Tap to deselect this goal' : 'Tap to select this goal'}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
                  <IconComponent size={24} color={colors.background} />
                </View>
                <Text style={[
                  styles.goalText,
                  isSelected && styles.goalTextSelected,
                ]}>
                  {goal.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            selectedGoals.length === 0 && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={selectedGoals.length === 0 || loading}
          accessibilityRole="button"
          accessibilityLabel="Complete onboarding setup"
          accessibilityHint="Finish setup and enter the main app"
          accessibilityState={{ disabled: selectedGoals.length === 0 || loading }}
          activeOpacity={selectedGoals.length === 0 || loading ? 1 : 0.8}
        >
          <Text style={styles.completeButtonText}>
            {loading ? 'Setting up your profile...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

