import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Hash, 
  TrendingUp,
  Globe,
  Lock,
  Clock,
  Star
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchResult {
  id: string;
  type: 'group' | 'user' | 'hashtag';
  name: string;
  description?: string;
  image?: string;
  memberCount?: number;
  visibility?: 'public' | 'private' | 'secret';
  category?: string;
  location?: string;
  isVerified?: boolean;
  isFollowing?: boolean;
  joinStatus?: 'joined' | 'pending' | 'not_joined';
}

const trendingTags = [
  { tag: 'morningyoga', count: 2543 },
  { tag: 'hiitworkout', count: 1876 },
  { tag: 'mindfulness', count: 1654 },
  { tag: 'strengthtraining', count: 1432 },
  { tag: 'running', count: 1298 },
  { tag: 'wellness', count: 987 },
];

const recommendedGroups: SearchResult[] = [
  {
    id: '1',
    type: 'group',
    name: 'Morning Yoga Warriors',
    description: 'Start your day with mindful yoga practice. All levels welcome!',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    memberCount: 1247,
    visibility: 'public',
    category: 'Yoga & Mindfulness',
    location: 'San Francisco, CA',
    joinStatus: 'joined',
  },
  {
    id: '2',
    type: 'group',
    name: 'HIIT Champions',
    description: 'High-intensity interval training for serious fitness enthusiasts',
    image: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    memberCount: 892,
    visibility: 'public',
    category: 'HIIT & Cardio',
    location: 'Los Angeles, CA',
    joinStatus: 'not_joined',
  },
  {
    id: '3',
    type: 'group',
    name: 'Mindful Runners',
    description: 'Combining running with mindfulness practices',
    image: 'https://images.pexels.com/photos/3756165/pexels-photo-3756165.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    memberCount: 634,
    visibility: 'private',
    category: 'Running & Cardio',
    location: 'New York, NY',
    joinStatus: 'pending',
  },
];

const popularUsers: SearchResult[] = [
  {
    id: '1',
    type: 'user',
    name: 'Sarah Johnson',
    description: 'Certified Yoga Instructor | Wellness Coach',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '2',
    type: 'user',
    name: 'Mike Chen',
    description: 'Personal Trainer | Nutrition Expert',
    image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    isVerified: true,
    isFollowing: true,
  },
];

export default function SearchScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'groups' | 'users' | 'hashtags'>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    
    if (query.length > 2) {
      // Simulate search API call
      const results: SearchResult[] = [
        ...recommendedGroups.filter(group => 
          group.name.toLowerCase().includes(query.toLowerCase()) ||
          group.description?.toLowerCase().includes(query.toLowerCase())
        ),
        ...popularUsers.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.description?.toLowerCase().includes(query.toLowerCase())
        ),
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe size={12} color={colors.success} />;
      case 'private':
        return <Users size={12} color={colors.warning} />;
      case 'secret':
        return <Lock size={12} color={colors.error} />;
      default:
        return null;
    }
  };

  const getJoinStatusColor = (status: string) => {
    switch (status) {
      case 'joined':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'not_joined':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getJoinStatusText = (status: string) => {
    switch (status) {
      case 'joined':
        return 'Joined';
      case 'pending':
        return 'Pending';
      case 'not_joined':
        return 'Join';
      default:
        return 'Join';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 48,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    filterChipTextActive: {
      color: colors.background,
    },
    section: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    seeAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary,
      borderRadius: 16,
    },
    seeAllText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    trendingContainer: {
      paddingHorizontal: 20,
    },
    trendingGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    trendingTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
    },
    trendingTagText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    trendingCount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    resultsContainer: {
      paddingHorizontal: 20,
    },
    resultCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    resultImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    resultContent: {
      flex: 1,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    resultName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      flex: 1,
    },
    verifiedIcon: {
      marginLeft: 6,
    },
    resultDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
    resultMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    resultActions: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    joinButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    joinedButton: {
      backgroundColor: colors.success + '20',
      borderColor: colors.success,
    },
    pendingButton: {
      backgroundColor: colors.warning + '20',
      borderColor: colors.warning,
    },
    followButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    followingButton: {
      backgroundColor: colors.surfaceVariant,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    actionButtonTextSecondary: {
      color: colors.textSecondary,
    },
    visibilityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    horizontalList: {
      paddingHorizontal: 20,
    },
    groupCard: {
      width: 280,
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginRight: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    groupCardImage: {
      width: '100%',
      height: 120,
    },
    groupCardContent: {
      padding: 16,
    },
    groupCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    groupCardName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      flex: 1,
    },
    groupCardDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    groupCardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    emptyMessage: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search groups, people, or tags..."
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isSearching && (
          <View style={styles.filterContainer}>
            {['all', 'groups', 'users', 'hashtags'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.filterChipActive
                ]}
                onPress={() => setActiveFilter(filter as any)}
              >
                <Text style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.filterChipTextActive
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!isSearching ? (
          <>
            {/* Trending Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Tags</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.trendingContainer}>
                <View style={styles.trendingGrid}>
                  {trendingTags.map((tag, index) => (
                    <TouchableOpacity key={index} style={styles.trendingTag}>
                      <Hash size={14} color={colors.primary} />
                      <Text style={styles.trendingTagText}>{tag.tag}</Text>
                      <Text style={styles.trendingCount}>({tag.count})</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Recommended Groups */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended Groups</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                {recommendedGroups.map((group) => (
                  <TouchableOpacity key={group.id} style={styles.groupCard}>
                    <Image source={{ uri: group.image }} style={styles.groupCardImage} />
                    <View style={styles.groupCardContent}>
                      <View style={styles.groupCardHeader}>
                        <Text style={styles.groupCardName}>{group.name}</Text>
                        <View style={styles.visibilityBadge}>
                          {getVisibilityIcon(group.visibility!)}
                        </View>
                      </View>
                      <Text style={styles.groupCardDescription} numberOfLines={2}>
                        {group.description}
                      </Text>
                      <View style={styles.groupCardFooter}>
                        <View style={styles.metaItem}>
                          <Users size={14} color={colors.textSecondary} />
                          <Text style={styles.metaText}>{group.memberCount?.toLocaleString()} members</Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            group.joinStatus === 'joined' ? styles.joinedButton :
                            group.joinStatus === 'pending' ? styles.pendingButton :
                            styles.joinButton
                          ]}
                        >
                          <Text style={[
                            styles.actionButtonText,
                            group.joinStatus === 'joined' && { color: colors.success },
                            group.joinStatus === 'pending' && { color: colors.warning }
                          ]}>
                            {getJoinStatusText(group.joinStatus!)}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Popular Users */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Users</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.resultsContainer}>
                {popularUsers.map((user) => (
                  <TouchableOpacity key={user.id} style={styles.resultCard}>
                    <Image source={{ uri: user.image }} style={styles.resultImage} />
                    <View style={styles.resultContent}>
                      <View style={styles.resultHeader}>
                        <Text style={styles.resultName}>{user.name}</Text>
                        {user.isVerified && (
                          <Star size={16} color={colors.warning} fill={colors.warning} style={styles.verifiedIcon} />
                        )}
                      </View>
                      <Text style={styles.resultDescription}>{user.description}</Text>
                    </View>
                    <View style={styles.resultActions}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          user.isFollowing ? styles.followingButton : styles.followButton
                        ]}
                      >
                        <Text style={[
                          styles.actionButtonText,
                          user.isFollowing && styles.actionButtonTextSecondary
                        ]}>
                          {user.isFollowing ? 'Following' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Search Results
          <View style={styles.resultsContainer}>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <TouchableOpacity key={result.id} style={styles.resultCard}>
                  <Image source={{ uri: result.image }} style={styles.resultImage} />
                  <View style={styles.resultContent}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultName}>{result.name}</Text>
                      {result.isVerified && (
                        <Star size={16} color={colors.warning} fill={colors.warning} style={styles.verifiedIcon} />
                      )}
                    </View>
                    <Text style={styles.resultDescription}>{result.description}</Text>
                    {result.type === 'group' && (
                      <View style={styles.resultMeta}>
                        <View style={styles.metaItem}>
                          <Users size={12} color={colors.textSecondary} />
                          <Text style={styles.metaText}>{result.memberCount?.toLocaleString()} members</Text>
                        </View>
                        {result.location && (
                          <View style={styles.metaItem}>
                            <MapPin size={12} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{result.location}</Text>
                          </View>
                        )}
                        <View style={styles.visibilityBadge}>
                          {getVisibilityIcon(result.visibility!)}
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={styles.resultActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        result.type === 'group' ? (
                          result.joinStatus === 'joined' ? styles.joinedButton :
                          result.joinStatus === 'pending' ? styles.pendingButton :
                          styles.joinButton
                        ) : (
                          result.isFollowing ? styles.followingButton : styles.followButton
                        )
                      ]}
                    >
                      <Text style={[
                        styles.actionButtonText,
                        result.type === 'group' ? (
                          result.joinStatus === 'joined' && { color: colors.success } ||
                          result.joinStatus === 'pending' && { color: colors.warning }
                        ) : (
                          result.isFollowing && styles.actionButtonTextSecondary
                        )
                      ]}>
                        {result.type === 'group' 
                          ? getJoinStatusText(result.joinStatus!)
                          : (result.isFollowing ? 'Following' : 'Follow')
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              searchQuery.length > 2 && (
                <View style={styles.emptyState}>
                  <Search size={48} color={colors.textTertiary} style={styles.emptyIcon} />
                  <Text style={styles.emptyTitle}>No results found</Text>
                  <Text style={styles.emptyMessage}>
                    Try searching with different keywords or check your spelling
                  </Text>
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
