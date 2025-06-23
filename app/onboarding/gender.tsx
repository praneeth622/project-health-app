import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function GenderSelection() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const { colors } = useTheme();

  const handleContinue = () => {
    if (selectedGender) {
      router.push('/onboarding/age');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 20,
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
      marginBottom: 48,
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
    options: {
      flex: 1,
      gap: 16,
    },
    genderOption: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 16,
      padding: 24,
      minHeight: 120, // Ensure adequate touch target size
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    genderOptionSelected: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primary,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    genderIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    genderEmoji: {
      fontSize: 32,
    },
    genderText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    genderTextSelected: {
      color: colors.primary,
    },
    genderSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    genderSubtextSelected: {
      color: colors.textSecondary,
    },
    footer: {
      gap: 12,
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
    continueButtonDisabled: {
      backgroundColor: colors.divider,
      shadowOpacity: 0,
      elevation: 0,
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
          <Text style={styles.title}>Tell us your gender</Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              selectedGender === 'male' && styles.genderOptionSelected,
            ]}
            onPress={() => setSelectedGender('male')}
            accessibilityRole="button"
            accessibilityLabel="Select Male"
            accessibilityHint="Choose male as your gender"
            accessibilityState={{ selected: selectedGender === 'male' }}
            activeOpacity={0.7}
          >
            <View style={styles.genderIcon}>
              <Text style={styles.genderEmoji}>👨</Text>
            </View>
            <Text style={[
              styles.genderText,
              selectedGender === 'male' && styles.genderTextSelected,
            ]}>
              Male
            </Text>
            <Text style={[
              styles.genderSubtext,
              selectedGender === 'male' && styles.genderSubtextSelected,
            ]}>
              You have chosen the platform as male!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderOption,
              selectedGender === 'female' && styles.genderOptionSelected,
            ]}
            onPress={() => setSelectedGender('female')}
            accessibilityRole="button"
            accessibilityLabel="Select Female"
            accessibilityHint="Choose female as your gender"
            accessibilityState={{ selected: selectedGender === 'female' }}
            activeOpacity={0.7}
          >
            <View style={styles.genderIcon}>
              <Text style={styles.genderEmoji}>👩</Text>
            </View>
            <Text style={[
              styles.genderText,
              selectedGender === 'female' && styles.genderTextSelected,
            ]}>
              Female
            </Text>
            <Text style={[
              styles.genderSubtext,
              selectedGender === 'female' && styles.genderSubtextSelected,
            ]}>
              You have chosen the platform as female!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderOption,
              selectedGender === 'other' && styles.genderOptionSelected,
            ]}
            onPress={() => setSelectedGender('other')}
            accessibilityRole="button"
            accessibilityLabel="Select Other"
            accessibilityHint="Choose other as your gender"
            accessibilityState={{ selected: selectedGender === 'other' }}
            activeOpacity={0.7}
          >
            <View style={styles.genderIcon}>
              <Text style={styles.genderEmoji}>🧑</Text>
            </View>
            <Text style={[
              styles.genderText,
              selectedGender === 'other' && styles.genderTextSelected,
            ]}>
              Other
            </Text>
            <Text style={[
              styles.genderSubtext,
              selectedGender === 'other' && styles.genderSubtextSelected,
            ]}>
              You have chosen other as your gender preference!
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedGender && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedGender}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
          accessibilityHint="Proceed to age selection"
          accessibilityState={{ disabled: !selectedGender }}
          activeOpacity={!selectedGender ? 1 : 0.7}
        >
          <ArrowRight size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}