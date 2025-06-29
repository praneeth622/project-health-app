import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

export default function WeightSelection() {
  const [weight, setWeight] = useState(58);
  const { colors } = useTheme();
  const { updateOnboardingStep } = useAuth();
  const sliderPosition = useSharedValue(((58 - 40) / 120) * 100); // Initial position for weight 58kg

  const handleContinue = async () => {
    // Save the weight selection
    await updateOnboardingStep(4, { weight_kg: weight });
    router.push('/onboarding/goals');
  };

  const updateWeight = (percentage: number) => {
    // Weight range: 40kg to 160kg
    const newWeight = Math.round(40 + (percentage / 100) * 120);
    const clampedWeight = Math.max(40, Math.min(160, newWeight));
    setWeight(clampedWeight);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // Optional: Add haptic feedback
    })
    .onUpdate((event) => {
      const sliderWidth = 280; // Fixed width for consistent calculations
      const currentX = sliderPosition.value * sliderWidth / 100;
      const newX = Math.max(0, Math.min(sliderWidth, currentX + event.translationX));
      const newPosition = (newX / sliderWidth) * 100;
      sliderPosition.value = newPosition;
      runOnJS(updateWeight)(newPosition);
    })
    .onEnd(() => {
      // Optional: Add completion feedback
    });

  const animatedSliderFillStyle = useAnimatedStyle(() => ({
    width: `${sliderPosition.value}%`,
  }));

  const animatedSliderThumbStyle = useAnimatedStyle(() => ({
    left: `${sliderPosition.value}%`,
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 40,
    },
    backButton: {
      width: 44, // Increased for better touch target
      height: 44, // Increased for better touch target
      borderRadius: 22,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },
    header: {
      alignItems: 'center',
      marginBottom: 80,
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
    },
    weightContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    weightValue: {
      fontSize: 72,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
    },
    weightUnit: {
      fontSize: 24,
      fontFamily: 'Poppins-Medium',
      color: colors.textSecondary,
      marginBottom: 60,
    },
    slider: {
      width: 280, // Fixed width for consistent calculations
      height: 4,
      position: 'relative',
      marginBottom: 16,
      alignSelf: 'center',
    },
    sliderTrack: {
      width: 280,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
    },
    sliderFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 4,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    sliderThumb: {
      position: 'absolute',
      top: -8,
      left: -10, // Centered thumb
      width: 20,
      height: 20,
      backgroundColor: colors.primary,
      borderRadius: 10,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    weightLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 280,
      alignSelf: 'center',
    },
    weightLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    continueButton: {
      backgroundColor: colors.primary,
      borderRadius: 50,
      width: 56,
      height: 56,
      minWidth: 56, // Ensure minimum touch target
      minHeight: 56, // Ensure minimum touch target
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
          <Text style={styles.title}>Tell us your weight</Text>
        </View>

        <View style={styles.weightContainer}>
          <Text 
            style={styles.weightValue}
            accessibilityLabel={`Current weight is ${weight} kilograms`}
            accessibilityRole="text"
          >
            {weight}
          </Text>
          <Text style={styles.weightUnit}>kg</Text>
          <GestureDetector gesture={panGesture}>
            <View 
              style={styles.slider}
              accessibilityRole="adjustable"
              accessibilityLabel="Weight slider"
              accessibilityHint="Drag to adjust your weight"
            >
              <View style={styles.sliderTrack} />
              <Animated.View style={[styles.sliderFill, animatedSliderFillStyle]} />
              <Animated.View style={[styles.sliderThumb, animatedSliderThumbStyle]} />
            </View>
          </GestureDetector>
          <View style={styles.weightLabels}>
            <Text style={styles.weightLabel}>40</Text>
            <Text style={styles.weightLabel}>160</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to goals selection"
          accessibilityHint="Proceed to final step"
          activeOpacity={0.7}
        >
          <ArrowRight size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

