import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function OnboardingWelcome() {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'space-between',
      paddingTop: 40,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
    },
    logo: {
      fontSize: 32,
      fontFamily: 'Poppins-Bold',
      color: colors.primary,
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    illustration: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    illustrationCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    illustrationEmoji: {
      fontSize: 80,
    },
    continueButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 56,
      minHeight: 56, // Ensure minimum touch target
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      paddingHorizontal: 16, // Add horizontal padding for better responsiveness
    },
    continueButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text 
            style={styles.logo}
            accessibilityRole="header"
          >
            HealYou
          </Text>
          <Text 
            style={styles.title}
            accessibilityRole="header"
          >
            Let's get to know you better
          </Text>
          <Text style={styles.subtitle}>
            We'll ask you a few questions to personalize your fitness experience
          </Text>
        </View>

        <View style={styles.illustration}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationEmoji}>🏃‍♀️</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/onboarding/gender')}
          accessibilityRole="button"
          accessibilityLabel="Get Started with onboarding"
          accessibilityHint="Navigate to gender selection screen"
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Get Started</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}