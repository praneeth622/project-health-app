import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChallengeService } from '../../services/challengeService';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user: {
    id: string;
    name: string;
    profile_image?: string;
  };
  current_value: number;
  progress_percentage: number;
  is_completed: boolean;
  completed_at?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  target_value: number;
  target_unit: string;
  end_date: string;
}

export default function ChallengeLeaderboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [challengeData, leaderboardData] = await Promise.all([
        ChallengeService.getChallengeById(id!),
        ChallengeService.getChallengeLeaderboard(id!),
      ]);
      setChallenge(challengeData);
      setLeaderboard(leaderboardData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const leaderboardData = await ChallengeService.getChallengeLeaderboard(id!);
      setLeaderboard(leaderboardData.data);
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
      Alert.alert('Error', 'Failed to refresh leaderboard');
    } finally {
      setRefreshing(false);
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { backgroundColor: '#FFD700', color: '#FFFFFF' }; // Gold
      case 2:
        return { backgroundColor: '#C0C0C0', color: '#FFFFFF' }; // Silver
      case 3:
        return { backgroundColor: '#CD7F32', color: '#FFFFFF' }; // Bronze
      default:
        return { backgroundColor: '#F0F0F0', color: '#666666' };
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => (
    <View style={styles.leaderboardItem}>
      <View style={[styles.rankBadge, getRankStyle(item.rank)]}>
        <Text style={[styles.rankText, { color: getRankStyle(item.rank).color }]}>
          {getRankIcon(item.rank)}
        </Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.user.name}</Text>
        <Text style={styles.progressText}>
          {item.current_value} / {challenge?.target_value} {challenge?.target_unit}
        </Text>
        <Text style={styles.percentageText}>
          {item.progress_percentage.toFixed(1)}% complete
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(item.progress_percentage, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.lastUpdated}>
          {item.is_completed ? 'Completed' : 'In Progress'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.subtitle}>Leaderboard</Text>
        <Text style={styles.challengeInfo}>
          Target: {challenge.target_value} {challenge.target_unit}
        </Text>
        <Text style={styles.challengeInfo}>
          Ends: {new Date(challenge.end_date).toLocaleDateString()}
        </Text>
      </View>

      {leaderboard.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No participants yet</Text>
          <Text style={styles.emptySubtext}>
            Be the first to join this challenge!
          </Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.user_id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => (
            <View style={styles.statsHeader}>
              <Text style={styles.statsText}>
                {leaderboard.length} participant{leaderboard.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Challenge</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  challengeInfo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  statsHeader: {
    padding: 16,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  leaderboardItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  percentageText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  progressContainer: {
    width: 80,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  lastUpdated: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  emptyText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});
