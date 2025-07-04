import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Edit, MapPin, Calendar, Heart, MessageCircle, Share } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

const userPosts = [
  {
    id: 1,
    content: 'Just finished an amazing morning yoga session! Feeling energized and ready for the day 🧘‍♀️',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    likes: 45,
    comments: 12,
    time: '2 hours ago',
  },
  {
    id: 2,
    content: 'New personal record on my 5K run today! Consistency is key 🏃‍♀️',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    likes: 67,
    comments: 8,
    time: '1 day ago',
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surfaceVariant }]}>
            <Settings size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={[styles.editImageButton, { backgroundColor: colors.primary }]}>
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.profileName, { color: colors.text }]}>Linh Nguyen</Text>
          <Text style={[styles.profileBio, { color: colors.textSecondary }]}>
            Fitness enthusiast | Yoga lover | Spreading positivity through wellness 🌟
          </Text>

          <View style={styles.profileMeta}>
            <View style={styles.metaItem}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>San Francisco, CA</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Joined March 2023</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>1,247</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>892</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>156</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'posts' && { color: colors.primary }]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'posts' ? (
          <View style={styles.postsContainer}>
            {/* View All Posts Button */}
            <TouchableOpacity 
              style={[styles.viewAllPostsButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/posts/index')}
            >
              <Text style={styles.viewAllPostsText}>View All My Posts</Text>
            </TouchableOpacity>

            {userPosts.map((post) => (
              <TouchableOpacity 
                key={post.id} 
                style={[styles.postCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/posts/${post.id}` as any)}
              >
                <View style={styles.postHeader}>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
                    style={styles.postUserAvatar}
                  />
                  <View style={styles.postUserInfo}>
                    <Text style={[styles.postUserName, { color: colors.text }]}>Linh Nguyen</Text>
                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>{post.time}</Text>
                  </View>
                </View>

                <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

                <Image source={{ uri: post.image }} style={styles.postImage} />

                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Heart size={20} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={20} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={20} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.aboutContainer}>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Fitness Goals</Text>
              <View style={styles.goalsList}>
                <View style={styles.goalItem}>
                  <Text style={styles.goalText}>Weight Loss</Text>
                </View>
                <View style={styles.goalItem}>
                  <Text style={styles.goalText}>Muscle Gain</Text>
                </View>
                <View style={styles.goalItem}>
                  <Text style={styles.goalText}>Flexibility</Text>
                </View>
              </View>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Interests</Text>
              <View style={styles.interestsList}>
                <View style={styles.interestItem}>
                  <Text style={styles.interestText}>Yoga</Text>
                </View>
                <View style={styles.interestItem}>
                  <Text style={styles.interestText}>Running</Text>
                </View>
                <View style={styles.interestItem}>
                  <Text style={styles.interestText}>Meditation</Text>
                </View>
                <View style={styles.interestItem}>
                  <Text style={styles.interestText}>Nutrition</Text>
                </View>
              </View>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Achievements</Text>
              <View style={styles.achievementsList}>
                <View style={styles.achievementItem}>
                  <Text style={styles.achievementEmoji}>🏃‍♀️</Text>
                  <Text style={styles.achievementText}>Completed first 5K</Text>
                </View>
                <View style={styles.achievementItem}>
                  <Text style={styles.achievementEmoji}>🧘‍♀️</Text>
                  <Text style={styles.achievementText}>30-day yoga streak</Text>
                </View>
                <View style={styles.achievementItem}>
                  <Text style={styles.achievementEmoji}>💪</Text>
                  <Text style={styles.achievementText}>Lost 10 pounds</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2DD4BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  profileMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  editProfileButton: {
    backgroundColor: '#2DD4BF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2DD4BF',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2DD4BF',
  },
  postsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  postContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  aboutContainer: {
    paddingHorizontal: 20,
    gap: 24,
  },
  aboutSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  goalsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalItem: {
    backgroundColor: '#2DD4BF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  goalText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestItem: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  viewAllPostsButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  viewAllPostsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});