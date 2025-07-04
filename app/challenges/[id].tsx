import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChallengeService, Challenge, ChallengeProgress } from '@/services/challengeService';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userProgress, setUserProgress] = useState<ChallengeProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadChallengeDetails = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      
      // Load challenge details
      const challengeData = await ChallengeService.getChallengeById(id);
      setChallenge(challengeData);

      // Check if user is a participant and load progress
      if (user) {
        try {
          const progressData = await ChallengeService.getUserProgress(id, user.id);
          setUserProgress(progressData);
          setIsParticipant(true);
        } catch (error) {
          // User is not a participant
          setIsParticipant(false);
          setUserProgress(null);
        }
      }
    } catch (error) {
      console.error('Error loading challenge details:', error);
      Alert.alert('Error', 'Failed to load challenge details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChallengeDetails();
    setRefreshing(false);
  };

  const handleJoinChallenge = async () => {
    if (!challenge || !user) return;

    try {
      setIsJoining(true);
      await ChallengeService.joinChallenge(challenge.id);
      
      Alert.alert('Success', 'You have joined the challenge!');
      await loadChallengeDetails(); // Reload to get updated data
    } catch (error) {
      console.error('Error joining challenge:', error);
      Alert.alert('Error', 'Failed to join challenge');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveChallenge = () => {
    Alert.alert(
      'Leave Challenge',
      'Are you sure you want to leave this challenge? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: confirmLeaveChallenge },
      ]
    );
  };

  const confirmLeaveChallenge = async () => {
    if (!challenge || !user) return;

    try {
      setIsLeaving(true);
      await ChallengeService.leaveChallenge(challenge.id);
      
      Alert.alert('Success', 'You have left the challenge');
      await loadChallengeDetails(); // Reload to get updated data
    } catch (error) {
      console.error('Error leaving challenge:', error);
      Alert.alert('Error', 'Failed to leave challenge');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleUpdateProgress = () => {
    if (!challenge) return;
    router.push(`/challenges/progress?id=${challenge.id}`);
  };

  const handleViewLeaderboard = () => {
    if (!challenge) return;
    router.push(`/challenges/leaderboard?id=${challenge.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return colors.text;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#2196F3';
      case 'active': return '#4CAF50';
      case 'completed': return '#9E9E9E';
      default: return colors.text;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDaysRemaining = () => {
    if (!challenge) return 0;
    const endDate = new Date(challenge.end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  useEffect(() => {
    loadChallengeDetails();
  }, [id]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      flex: 1,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    creator: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#fff',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    content: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 24,
    },
    progressCard: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    progressValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    progressStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    progressStat: {
      alignItems: 'center',
    },
    actionsContainer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    primaryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
    },
    dangerButton: {
      backgroundColor: '#F44336',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    dangerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
    },
  });

  if (isLoading && !challenge) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Challenge not found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.creator}>Created by {challenge.creator?.name || 'Unknown'}</Text>
          
          <View style={styles.tagContainer}>
            <View style={[styles.tag, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={styles.tagText}>{challenge.difficulty}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: getStatusColor(challenge.status) }]}>
              <Text style={styles.tagText}>{challenge.status}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.primary }]}>
              <Text style={styles.tagText}>{challenge.category}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.participants_count}</Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.duration_days} days</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{calculateDaysRemaining()}</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.target_value}</Text>
              <Text style={styles.statLabel}>{challenge.target_unit}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{challenge.description}</Text>

          {/* User Progress (if participant) */}
          {isParticipant && userProgress && (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Your Progress</Text>
                <Text style={styles.progressValue}>
                  {userProgress.current_value} / {challenge.target_value} {challenge.target_unit}
                </Text>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(userProgress.progress_percentage, 100)}%` }
                  ]} 
                />
              </View>

              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.statValue}>{userProgress.progress_percentage.toFixed(1)}%</Text>
                  <Text style={styles.statLabel}>Complete</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.statValue}>{userProgress.progress_percentage.toFixed(1)}%</Text>
                  <Text style={styles.statLabel}>Progress</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.statValue}>
                    {new Date(userProgress.last_updated).toLocaleDateString()}
                  </Text>
                  <Text style={styles.statLabel}>Last Update</Text>
                </View>
              </View>
            </View>
          )}

          {/* Challenge Details */}
          <Text style={styles.sectionTitle}>Challenge Details</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.statValue}>{formatDate(challenge.start_date)}</Text>
                <Text style={styles.statLabel}>Start Date</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.statValue}>{formatDate(challenge.end_date)}</Text>
                <Text style={styles.statLabel}>End Date</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.statValue}>{challenge.is_public ? 'Public' : 'Private'}</Text>
                <Text style={styles.statLabel}>Visibility</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {!isParticipant ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleJoinChallenge}
            disabled={isJoining}
          >
            <Text style={styles.primaryButtonText}>
              {isJoining ? 'Joining...' : 'Join Challenge'}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleUpdateProgress}
            >
              <Text style={styles.primaryButtonText}>Update Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleViewLeaderboard}
            >
              <Ionicons name="trophy" size={20} color={colors.text} />
              <Text style={styles.secondaryButtonText}>View Leaderboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleLeaveChallenge}
              disabled={isLeaving}
            >
              <Text style={styles.dangerButtonText}>
                {isLeaving ? 'Leaving...' : 'Leave Challenge'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
