import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function HeightSelection() {
  const [height, setHeight] = useState("5'3");
  const { colors } = useTheme();

  const handleContinue = () => {
    router.push('/onboarding/weight');
  };

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
    heightContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heightValue: {
      fontSize: 72,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
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
      width: 20,
      height: 20,
      backgroundColor: colors.primary,
      borderRadius: 10,
      marginLeft: -10,
    },
    heightLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    heightLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>HealYou</Text>
          <Text style={styles.title}>Tell us your height</Text>
        </View>

        <View style={styles.heightContainer}>
          <Text style={styles.heightValue}>{height}</Text>
          <View style={styles.slider}>
            <View style={styles.sliderTrack} />
            <View style={[styles.sliderFill, { width: '45%' }]} />
            <View style={[styles.sliderThumb, { left: '45%' }]} />
          </View>
          <View style={styles.heightLabels}>
            <Text style={styles.heightLabel}>4'0</Text>
            <Text style={styles.heightLabel}>7'0</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <ArrowRight size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

