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
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    genderOptionSelected: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primary,
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
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    continueButtonDisabled: {
      backgroundColor: colors.divider,
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedGender && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedGender}
        >
          <ArrowRight size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}