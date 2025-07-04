import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Search, 
  Filter, 
  Trophy, 
  Users, 
  Target, 
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Award,
  Crown,
  Droplet,
  MapPin,
  Scale
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ChallengeService, Challenge, ChallengeFilters } from '@/services/challengeService';
import CircularProgress from '@/components/CircularProgress';

type TabType = 'discover' | 'my-challenges' | 'trending';

const ChallengesScreen = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [trendingChallenges, setTrendingChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ChallengeFilters>({});

  useEffect(() => {
    loadChallenges();
  }, [activeTab, selectedFilter]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'discover') {
        const response = await ChallengeService.getPublicChallenges(selectedFilter, { page: 1, limit: 20 });
        setChallenges(response.data);
      } else if (activeTab === 'my-challenges') {
        const response = await ChallengeService.getUserChallenges(undefined, { page: 1, limit: 20 });
        setUserChallenges(response.data);
      } else if (activeTab === 'trending') {
        // Since there's no specific trending endpoint, we'll use public challenges with filters
        const response = await ChallengeService.getPublicChallenges({ status: 'active' }, { page: 1, limit: 10 });
        setTrendingChallenges(response.data);
      }
    } catch (error: any) {
      console.error('Failed to load challenges:', error);
      Alert.alert('Error', error.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  }, [activeTab, selectedFilter]);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await ChallengeService.joinChallenge(challengeId);
      Alert.alert('Success', 'You have joined the challenge!', [
        { text: 'View Challenge', onPress: () => router.push(`/challenges/${challengeId}` as any) },
        { text: 'OK' }
      ]);
      await loadChallenges();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join challenge');
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return colors.textSecondary as string;
    }
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'steps': return Target;
      case 'water': return Droplet;
      case 'exercise': return Zap;
      case 'weight_loss': return Scale;
      case 'distance': return MapPin;
      case 'time': return Clock;
      default: return Trophy;
    }
  };

  const renderChallengeCard = (challenge: Challenge) => {
    const IconComponent = getCategoryIcon(challenge.category);
    const difficultyColor = getDifficultyColor(challenge.difficulty);
    const progress = challenge.user_progress?.progress_percentage || 0;
    
    return (
      <TouchableOpacity
        key={challenge.id}
        style={styles.challengeCard}
        onPress={() => router.push(`/challenges/${challenge.id}` as any)}
      >
        {challenge.image_url && (
          <Image source={{ uri: challenge.image_url }} style={styles.challengeImage} />
        )}
        
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <IconComponent size={16} color={colors.primary} />
            <Text style={styles.categoryText}>{challenge.category.replace('_', ' ')}</Text>
          </View>
          
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + '20' }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {challenge.difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription} numberOfLines={2}>
          {challenge.description}
        </Text>

        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Users size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{challenge.participants_count}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{challenge.duration_days}d</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{challenge.target_value} {challenge.target_unit}</Text>
          </View>
        </View>

        {challenge.is_participating && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
            </View>
            <CircularProgress
              progress={progress}
              size={50}
              strokeWidth={4}
              color={colors.primary}
            />
          </View>
        )}

        <View style={styles.cardActions}>
          {challenge.is_participating ? (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push(`/challenges/${challenge.id}` as any)}
            >
              <Text style={styles.primaryButtonText}>View Progress</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleJoinChallenge(challenge.id)}
            >
              <Text style={styles.secondaryButtonText}>Join Challenge</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push(`/challenges/${challenge.id}/leaderboard` as any)}
          >
            <Trophy size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {challenge.creator && (
          <View style={styles.creatorInfo}>
            <Image 
              source={{ uri: challenge.creator.profile_image || 'https://via.placeholder.com/40' }} 
              style={styles.creatorAvatar} 
            />
            <Text style={styles.creatorName}>by {challenge.creator.name}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    const currentChallenges = activeTab === 'discover' ? challenges : 
                            activeTab === 'my-challenges' ? userChallenges : 
                            trendingChallenges;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      );
    }

    if (currentChallenges.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Trophy size={60} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>
            {activeTab === 'my-challenges' ? 'No Challenges Yet' : 'No Challenges Found'}
          </Text>
          <Text style={styles.emptyDescription}>
            {activeTab === 'my-challenges' 
              ? 'Join some challenges to start your fitness journey!'
              : 'Try adjusting your filters or check back later for new challenges.'
            }
          </Text>
          {activeTab === 'my-challenges' && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setActiveTab('discover')}
            >
              <Text style={styles.primaryButtonText}>Discover Challenges</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <ScrollView 
        contentContainerStyle={styles.challengesList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {currentChallenges.map(renderChallengeCard)}
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.background,
    },
    challengesList: {
      padding: 20,
      gap: 16,
    },
    challengeCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    challengeImage: {
      width: '100%',
      height: 120,
      borderRadius: 12,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },
    categoryText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
      textTransform: 'capitalize',
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    difficultyText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      textTransform: 'capitalize',
    },
    challengeTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    challengeDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    challengeStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    progressSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    progressHeader: {
      flex: 1,
    },
    progressLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    progressPercentage: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    cardActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: colors.surfaceVariant,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    creatorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    creatorAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    creatorName: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/challenges/search' as any)}
          >
            <Search size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/challenges/create')}
          >
            <Plus size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
            Discover
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-challenges' && styles.activeTab]}
          onPress={() => setActiveTab('my-challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'my-challenges' && styles.activeTabText]}>
            My Challenges
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}
        >
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
            Trending
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderTabContent()}
    </SafeAreaView>
  );
};

export default ChallengesScreen;
