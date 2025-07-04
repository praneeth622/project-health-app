import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChallengeService } from '../../services/challengeService';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  target_value: number;
  target_unit: string;
  start_date: string;
  end_date: string;
}

interface UserProgress {
  current_value: number;
}

export default function ChallengeProgressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progress, setProgress] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const challengeData = await ChallengeService.getChallengeById(id!);
      setChallenge(challengeData);
      
      // Try to get user progress
      try {
        const progressData = await ChallengeService.getUserProgress(id!, 'current-user'); // Will be handled by service
        setUserProgress(progressData);
        setProgress(progressData.current_value?.toString() || '0');
      } catch (error) {
        setUserProgress(null);
        setProgress('0');
      }
    } catch (error) {
      console.error('Error loading challenge:', error);
      Alert.alert('Error', 'Failed to load challenge details');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    if (!challenge || !progress.trim()) {
      Alert.alert('Error', 'Please enter a valid progress value');
      return;
    }

    const progressValue = parseFloat(progress);
    if (isNaN(progressValue) || progressValue < 0) {
      Alert.alert('Error', 'Please enter a valid positive number');
      return;
    }

    try {
      setUpdating(true);
      await ChallengeService.updateProgress({
        challenge_id: challenge.id,
        current_value: progressValue,
      });
      Alert.alert('Success', 'Progress updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update progress. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getProgressPercentage = () => {
    if (!challenge || !userProgress) return 0;
    return Math.min((userProgress.current_value / challenge.target_value) * 100, 100);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading challenge...</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Challenge not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>{challenge.description}</Text>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Current Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {userProgress?.current_value || 0} / {challenge.target_value} {challenge.target_unit}
          </Text>
          <Text style={styles.progressPercentage}>
            {getProgressPercentage().toFixed(1)}% Complete
          </Text>
        </View>
      </View>

      <View style={styles.updateSection}>
        <Text style={styles.sectionTitle}>Update Progress</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Enter your current progress ({challenge.target_unit}):
          </Text>
          <TextInput
            style={styles.input}
            value={progress}
            onChangeText={setProgress}
            placeholder={`e.g., ${userProgress?.current_value || 0}`}
            keyboardType="numeric"
            editable={!updating}
          />
        </View>

        <View style={styles.challengeInfo}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Challenge Type:</Text> {challenge.type}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Target:</Text> {challenge.target_value} {challenge.target_unit}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>End Date:</Text>{' '}
            {new Date(challenge.end_date).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.buttonDisabled]}
          onPress={updateProgress}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Update Progress</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={updating}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: '#666666',
  },
  updateSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  challengeInfo: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#1C1C1E',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
