import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, Heart, MessageCircle, Share, Users, Bell } from 'lucide-react-native';
import { router } from 'expo-router';

const posts = [
  {
    id: 1,
    user: {
      name: 'Linh Nguyen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      time: '2s ago',
    },
    content: 'I am very happy to be with CaFit in training sessions and how about you?',
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    likes: 121,
    comments: 34,
  },
];

const stories = [
  { id: 1, name: 'Add Story', avatar: '', isAdd: true },
  { id: 2, name: 'Emma', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: 3, name: 'Alex', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: 4, name: 'Sarah', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: 5, name: 'Mike', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.greeting}>Hello Linh!</Text>
            <Text style={styles.date}>Thursday, 08 July</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <MessageCircle size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Bell size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
          contentContainerStyle={styles.storiesContent}
        >
          {stories.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              {story.isAdd ? (
                <View style={styles.addStoryButton}>
                  <Plus size={24} color="#2DD4BF" />
                </View>
              ) : (
                <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
              )}
              <Text style={styles.storyName}>{story.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Navigation */}
        <View style={styles.quickNavContainer}>
          <TouchableOpacity 
            style={styles.quickNavItem}
            onPress={() => router.push('/(tabs)/groups')}
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#2DD4BF' }]}>
              <Users size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickNavText}>Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickNavItem}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#FF6B82' }]}>
              <MessageCircle size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickNavText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem}>
            <View style={[styles.quickNavIcon, { backgroundColor: '#8B5CF6' }]}>
              <Search size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickNavText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>Search friends or neighbors</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Posts */}
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image source={{ uri: post.user.avatar }} style={styles.postUserAvatar} />
                <View style={styles.postUserInfo}>
                  <Text style={styles.postUserName}>{post.user.name}</Text>
                  <Text style={styles.postTime}>{post.user.time}</Text>
                </View>
              </View>

              <Text style={styles.postContent}>{post.content}</Text>

              <Image source={{ uri: post.image }} style={styles.postImage} />

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Heart size={20} color="#6B7280" />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={20} color="#6B7280" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share size={20} color="#6B7280" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storiesContainer: {
    marginBottom: 20,
  },
  storiesContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
  },
  addStoryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
    borderColor: '#2DD4BF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#2DD4BF',
  },
  storyName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    textAlign: 'center',
  },
  quickNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
    marginBottom: 20,
  },
  quickNavItem: {
    alignItems: 'center',
  },
  quickNavIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickNavText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
});