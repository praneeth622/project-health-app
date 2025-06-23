import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

export default function GenderSelection() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      router.push('/onboarding/age');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#2DD4BF',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    textAlign: 'center',
  },
  options: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  genderOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderOptionSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FB923C',
  },
  genderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  genderEmoji: {
    fontSize: 40,
  },
  genderText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  genderTextSelected: {
    color: '#FB923C',
  },
  genderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  genderSubtextSelected: {
    color: '#FB923C',
  },
  continueButton: {
    backgroundColor: '#2DD4BF',
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});