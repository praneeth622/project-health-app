import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

export default function AgeSelection() {
  const [age, setAge] = useState(20);
  const { colors } = useTheme();
  const sliderPosition = useSharedValue(((20 - 15) / 70) * 100); // Initial position for age 20

  const handleContinue = () => {
    router.push('/onboarding/height');
  };

  const updateAge = (percentage: number) => {
    const newAge = Math.round(15 + (percentage / 100) * 70);
    const clampedAge = Math.max(15, Math.min(85, newAge));
    setAge(clampedAge);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // Optional: Add haptic feedback or visual feedback here
    })
    .onUpdate((event) => {
      const sliderWidth = 280; // More accurate slider width (accounting for padding)
      const currentX = sliderPosition.value * sliderWidth / 100;
      const newX = Math.max(0, Math.min(sliderWidth, currentX + event.translationX));
      const newPosition = (newX / sliderWidth) * 100;
      sliderPosition.value = newPosition;
      runOnJS(updateAge)(newPosition);
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
    ageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ageValue: {
      fontSize: 72,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
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
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    ageLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 280,
      alignSelf: 'center',
    },
    ageLabel: {
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
            <ArrowLeft size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.logo}>HealYou</Text>
            <Text style={styles.title}>Tell us your age</Text>
          </View>

          <View style={styles.ageContainer}>
            <Text 
              style={styles.ageValue}
              accessibilityLabel={`Current age is ${age} years old`}
              accessibilityRole="text"
            >
              {age}
            </Text>
            <GestureDetector gesture={panGesture}>
              <View 
                style={styles.slider}
                accessibilityRole="adjustable"
                accessibilityLabel="Age slider"
                accessibilityHint="Drag to adjust your age"
              >
                <View style={styles.sliderTrack} />
                <Animated.View style={[styles.sliderFill, animatedSliderFillStyle]} />
                <Animated.View style={[styles.sliderThumb, animatedSliderThumbStyle]} />
              </View>
            </GestureDetector>
            <View style={styles.ageLabels}>
              <Text style={styles.ageLabel}>15</Text>
              <Text style={styles.ageLabel}>85</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue to height selection"
            accessibilityHint="Proceed to next step"
            activeOpacity={0.7}
          >
            <ArrowRight size={24} color={colors.background} />        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
