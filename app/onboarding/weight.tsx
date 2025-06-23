import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

export default function WeightSelection() {
  const [weight, setWeight] = useState(58);

  const handleContinue = () => {
    router.push('/onboarding/goals');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>HealYou</Text>
          <Text style={styles.title}>Tell us your weight</Text>
        </View>

        <View style={styles.weightContainer}>
          <Text style={styles.weightValue}>{weight}</Text>
          <Text style={styles.weightUnit}>kg</Text>
          <View style={styles.slider}>
            <View style={styles.sliderTrack} />
            <View style={[styles.sliderFill, { width: `${((weight - 40) / 120) * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${((weight - 40) / 120) * 100}%` }]} />
          </View>
          <View style={styles.weightLabels}>
            <Text style={styles.weightLabel}>40</Text>
            <Text style={styles.weightLabel}>160</Text>
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
  weightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 72,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
  },
  weightUnit: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
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
  weightLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  weightLabel: {
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