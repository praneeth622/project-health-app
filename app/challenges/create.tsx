import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Target, Users, Clock, Trophy } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ChallengeService, CreateChallengeRequest, ChallengeCategory, ChallengeDifficulty, ChallengeType } from '@/services/challengeService';

const CreateChallengeScreen = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [challengeData, setChallengeData] = useState<CreateChallengeRequest>({
    title: '',
    description: '',
    type: 'individual',
    category: 'steps',
    difficulty: 'easy',
    duration_days: 7,
    target_value: 10000,
    target_unit: 'steps',
    is_public: true,
    start_date: new Date().toISOString().split('T')[0],
    max_participants: undefined,
    prize_description: '',
    rules: '',
    tags: [],
    image_url: ''
  });

  const categories: { id: ChallengeCategory; name: string; icon: string; units: string[] }[] = [
    { id: 'steps', name: 'Steps', icon: '👟', units: ['steps'] },
    { id: 'water', name: 'Water Intake', icon: '💧', units: ['glasses', 'liters', 'ml'] },
    { id: 'exercise', name: 'Exercise', icon: '💪', units: ['minutes', 'hours', 'sessions'] },
    { id: 'weight_loss', name: 'Weight Loss', icon: '⚖️', units: ['kg', 'lbs', 'pounds'] },
    { id: 'distance', name: 'Distance', icon: '🏃', units: ['km', 'miles', 'meters'] },
    { id: 'time', name: 'Time-based', icon: '⏱️', units: ['minutes', 'hours', 'days'] },
    { id: 'custom', name: 'Custom', icon: '🎯', units: ['count', 'points', 'units'] }
  ];

  const difficulties: { id: ChallengeDifficulty; name: string; description: string; color: string }[] = [
    { id: 'easy', name: 'Easy', description: 'Perfect for beginners', color: '#10B981' },
    { id: 'medium', name: 'Medium', description: 'Moderate challenge', color: '#F59E0B' },
    { id: 'hard', name: 'Hard', description: 'For experienced users', color: '#EF4444' }
  ];

  const durations = [
    { days: 1, label: '1 Day' },
    { days: 3, label: '3 Days' },
    { days: 7, label: '1 Week' },
    { days: 14, label: '2 Weeks' },
    { days: 21, label: '3 Weeks' },
    { days: 30, label: '1 Month' },
    { days: 60, label: '2 Months' },
    { days: 90, label: '3 Months' }
  ];

  const handleCreate = async () => {
    // Validation
    if (!challengeData.title.trim()) {
      Alert.alert('Error', 'Please enter a challenge title');
      return;
    }
    if (!challengeData.description.trim()) {
      Alert.alert('Error', 'Please enter a challenge description');
      return;
    }
    if (challengeData.target_value <= 0) {
      Alert.alert('Error', 'Target value must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      
      const newChallenge = await ChallengeService.createChallenge(challengeData);
      
      Alert.alert('Success', 'Challenge created successfully!', [
        { 
          text: 'View Challenge', 
          onPress: () => router.replace(`/challenges/${newChallenge.id}` as any)
        },
        { 
          text: 'Create Another', 
          onPress: () => {
            // Reset form
            setChallengeData({
              title: '',
              description: '',
              type: 'individual',
              category: 'steps',
              difficulty: 'easy',
              duration_days: 7,
              target_value: 10000,
              target_unit: 'steps',
              is_public: true,
              start_date: new Date().toISOString().split('T')[0],
              max_participants: undefined,
              prize_description: '',
              rules: '',
              tags: [],
              image_url: ''
            });
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === challengeData.category);
  const selectedDifficulty = difficulties.find(diff => diff.id === challengeData.difficulty);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      flex: 1,
    },
    createButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
    createButtonDisabled: {
      backgroundColor: colors.border,
    },
    createButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    optionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    optionCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      minWidth: 100,
      flex: 1,
    },
    optionCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    optionIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    optionTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    flex1: {
      flex: 1,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    toggleLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    toggleDescription: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    unitPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    unitOption: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitOptionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    unitText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    unitTextSelected: {
      color: colors.background,
    },
    durationGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    durationOption: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 80,
      alignItems: 'center',
    },
    durationOptionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    durationText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    durationTextSelected: {
      color: colors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Challenge</Text>
        <TouchableOpacity 
          style={[
            styles.createButton, 
            (!challengeData.title.trim() || !challengeData.description.trim() || loading) && styles.createButtonDisabled
          ]}
          onPress={handleCreate}
          disabled={!challengeData.title.trim() || !challengeData.description.trim() || loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Challenge title"
            placeholderTextColor={colors.textTertiary}
            value={challengeData.title}
            onChangeText={(text) => setChallengeData({...challengeData, title: text})}
            maxLength={100}
          />
          
          <TextInput
            style={[styles.input, styles.textArea, { marginTop: 12 }]}
            placeholder="Describe your challenge..."
            placeholderTextColor={colors.textTertiary}
            value={challengeData.description}
            onChangeText={(text) => setChallengeData({...challengeData, description: text})}
            multiline
            maxLength={500}
          />
        </View>

        {/* Challenge Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenge Type</Text>
          <View style={styles.optionGrid}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                challengeData.type === 'individual' && styles.optionCardSelected
              ]}
              onPress={() => setChallengeData({...challengeData, type: 'individual'})}
            >
              <Text style={styles.optionIcon}>👤</Text>
              <Text style={styles.optionTitle}>Individual</Text>
              <Text style={styles.optionDescription}>Personal challenge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                challengeData.type === 'group' && styles.optionCardSelected
              ]}
              onPress={() => setChallengeData({...challengeData, type: 'group'})}
            >
              <Text style={styles.optionIcon}>👥</Text>
              <Text style={styles.optionTitle}>Group</Text>
              <Text style={styles.optionDescription}>Team challenge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.optionGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.optionCard,
                  challengeData.category === category.id && styles.optionCardSelected
                ]}
                onPress={() => {
                  setChallengeData({
                    ...challengeData, 
                    category: category.id,
                    target_unit: category.units[0] // Set default unit
                  });
                }}
              >
                <Text style={styles.optionIcon}>{category.icon}</Text>
                <Text style={styles.optionTitle}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Unit Selection */}
          {selectedCategory && (
            <View style={styles.unitPicker}>
              {selectedCategory.units.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitOption,
                    challengeData.target_unit === unit && styles.unitOptionSelected
                  ]}
                  onPress={() => setChallengeData({...challengeData, target_unit: unit})}
                >
                  <Text style={[
                    styles.unitText,
                    challengeData.target_unit === unit && styles.unitTextSelected
                  ]}>
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <View style={styles.optionGrid}>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty.id}
                style={[
                  styles.optionCard,
                  challengeData.difficulty === difficulty.id && styles.optionCardSelected
                ]}
                onPress={() => setChallengeData({...challengeData, difficulty: difficulty.id})}
              >
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: difficulty.color,
                  marginBottom: 8
                }} />
                <Text style={styles.optionTitle}>{difficulty.name}</Text>
                <Text style={styles.optionDescription}>{difficulty.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationGrid}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration.days}
                style={[
                  styles.durationOption,
                  challengeData.duration_days === duration.days && styles.durationOptionSelected
                ]}
                onPress={() => setChallengeData({...challengeData, duration_days: duration.days})}
              >
                <Text style={[
                  styles.durationText,
                  challengeData.duration_days === duration.days && styles.durationTextSelected
                ]}>
                  {duration.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Target */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Target value"
              placeholderTextColor={colors.textTertiary}
              value={challengeData.target_value.toString()}
              onChangeText={(text) => {
                const value = parseInt(text) || 0;
                setChallengeData({...challengeData, target_value: value});
              }}
              keyboardType="numeric"
            />
            <View style={{
              backgroundColor: colors.surfaceVariant,
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderRadius: 12,
              minWidth: 80,
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: 16,
                fontFamily: 'Inter-Medium',
                color: colors.text
              }}>
                {challengeData.target_unit}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.toggleContainer}>
            <View>
              <Text style={styles.toggleLabel}>Public Challenge</Text>
              <Text style={styles.toggleDescription}>Anyone can discover and join</Text>
            </View>
            <Switch
              value={challengeData.is_public}
              onValueChange={(value) => setChallengeData({...challengeData, is_public: value})}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={challengeData.is_public ? colors.primary : colors.textSecondary}
            />
          </View>

          {challengeData.type === 'group' && (
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Max participants (optional)"
              placeholderTextColor={colors.textTertiary}
              value={challengeData.max_participants?.toString() || ''}
              onChangeText={(text) => {
                const value = parseInt(text) || undefined;
                setChallengeData({...challengeData, max_participants: value});
              }}
              keyboardType="numeric"
            />
          )}
        </View>

        {/* Optional Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optional Details</Text>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Prize or reward description (optional)"
            placeholderTextColor={colors.textTertiary}
            value={challengeData.prize_description}
            onChangeText={(text) => setChallengeData({...challengeData, prize_description: text})}
            multiline
          />
          
          <TextInput
            style={[styles.input, styles.textArea, { marginTop: 12 }]}
            placeholder="Challenge rules (optional)"
            placeholderTextColor={colors.textTertiary}
            value={challengeData.rules}
            onChangeText={(text) => setChallengeData({...challengeData, rules: text})}
            multiline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateChallengeScreen;
