import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

export default function AgeSelection() {
  const [age, setAge] = useState(20);

  const handleContinue = () => {
    router.push('/onboarding/height');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>HealYou</Text>
          <Text style={styles.title}>Tell us your age</Text>
        </View>

        <View style={styles.ageContainer}>
          <Text style={styles.ageValue}>{age}</Text>
          <View style={styles.slider}>
            <View style={styles.sliderTrack} />
            <View style={[styles.sliderFill, { width: `${((age - 15) / 70) * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${((age - 15) / 70) * 100}%` }]} />
          </View>
          <View style={styles.ageLabels}>
            <Text style={styles.ageLabel}>15</Text>
            <Text style={styles.ageLabel}>85</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
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
    marginBottom: 80,
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
  ageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageValue: {
    fontSize: 72,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 60,
  },
  slider: {
    width: '100%',
    height: 4,
    position: 'relative',
    marginBottom: 16,
  },
  sliderTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  sliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    backgroundColor: '#2DD4BF',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    backgroundColor: '#2DD4BF',
    borderRadius: 10,
    marginLeft: -10,
  },
  ageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ageLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
});