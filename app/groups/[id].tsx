import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Users, 
  Settings, 
  Heart, 
  MessageCircle, 
  Share, 
  Camera, 
  Send,
  MoreHorizontal,
  Pin,
  Flag,
  UserMinus,
  Globe,
  Lock
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAdmin?: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isPinned?: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedDate: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: { name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isAdmin: true },
    content: 'Welcome everyone to our Morning Yoga Warriors group! 🧘‍♀️ Let\'s start each day with mindful movement and positive energy. What\'s your favorite morning yoga routine?',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    isLiked: true,
    isPinned: true,
  },
  {
    id: '2',
    author: { name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
    content: 'Just finished an amazing sunrise session at the beach! The combination of yoga and ocean waves is absolutely magical. Highly recommend trying it if you live near the coast.',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    timestamp: '5 hours ago',
    likes: 18,
    comments: 5,
    isLiked: false,
  },
  {
    id: '3',
    author: { name: 'Emma Wilson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
    content: 'Day 7 of my morning yoga challenge! Feeling stronger and more flexible already. Who else is following along? Let\'s motivate each other! 💪',
    timestamp: '1 day ago',
    likes: 32,
    comments: 12,
    isLiked: true,
  },
];

export default function GroupDetailScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'about'>('posts');
  const [newPost, setNewPost] = useState('');
  const [isJoined, setIsJoined] = useState(true);
  const [posts, setPosts] = useState(mockPosts);

  const groupInfo = {
    name: 'Morning Yoga Warriors',
    description: 'Start your day with mindful yoga practice. All levels welcome! Join us for daily motivation and tips.',
    memberCount: 1247,
    visibility: 'public' as const,
    category: 'Yoga & Mindfulness',
    location: 'San Francisco, CA',
    rules: [
      'Be respectful and supportive to all members',
      'Keep posts relevant to yoga and wellness',
      'No spam or self-promotion without permission',
      'Share your progress and encourage others',
    ],
    admins: ['Sarah Johnson', 'Alex Rodriguez'],
    coverImage: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2',
  };

  const handleJoinToggle = () => {
    if (isJoined) {
      Alert.alert(
        'Leave Group',
        'Are you sure you want to leave this group?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => setIsJoined(false) }
        ]
      );
    } else {
      setIsJoined(true);
      Alert.alert('Joined!', 'Welcome to the group!');
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: { 
        name: 'You', 
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' 
      },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false,
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    Alert.alert('Success', 'Your post has been shared!');
  };

  const handlePostAction = (postId: string, action: 'pin' | 'flag' | 'remove') => {
    switch (action) {
      case 'pin':
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, isPinned: !post.isPinned } : post
        ));
        Alert.alert('Success', 'Post pinned to top');
        break;
      case 'flag':
        Alert.alert('Reported', 'Thank you for reporting this post. We\'ll review it.');
        break;
      case 'remove':
        Alert.alert(
          'Remove Post',
          'Are you sure you want to remove this post?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => {
              setPosts(posts.filter(post => post.id !== postId));
            }}
          ]
        );
        break;
    }
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
      paddingBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    coverImage: {
      width: '100%',
      height: 200,
    },
    groupInfo: {
      padding: 20,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    groupName: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      flex: 1,
    },
    visibilityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    visibilityText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.success,
      textTransform: 'capitalize',
    },
    groupMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    groupDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 16,
    },
    joinButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginBottom: 16,
    },
    joinButtonJoined: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
    },
    joinButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    joinButtonTextJoined: {
      color: colors.textSecondary,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
      fontFamily: 'Inter-SemiBold',
    },
    tabContent: {
      flex: 1,
    },
    postsContainer: {
      padding: 20,
    },
    createPostContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    createPostHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    createPostInput: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      minHeight: 60,
      textAlignVertical: 'top',
      marginBottom: 12,
    },
    createPostActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mediaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
    },
    mediaButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    postButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    postButtonDisabled: {
      opacity: 0.5,
    },
    postButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    postCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pinnedPost: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    postUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    postUserAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    postUserDetails: {
      flex: 1,
    },
    postUserName: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    postUserNameText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    adminBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    adminBadgeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: colors.background,
    },
    postTime: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    postMenuButton: {
      padding: 4,
    },
    pinnedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 8,
    },
    pinnedText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    postContent: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      lineHeight: 24,
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
      borderTopColor: colors.divider,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    likedButton: {
      backgroundColor: colors.error + '15',
    },
    actionText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    likedText: {
      color: colors.error,
    },
    aboutContainer: {
      padding: 20,
    },
    aboutSection: {
      marginBottom: 24,
    },
    aboutTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    aboutText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 24,
    },
    ruleItem: {
      flexDirection: 'row',
      marginBottom: 8,
      paddingRight: 16,
    },
    ruleNumber: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
      marginRight: 12,
      minWidth: 20,
    },
    ruleText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 24,
      flex: 1,
    },
    adminList: {
      gap: 8,
    },
    adminItem: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
  });

  const renderPostMenu = (post: Post) => {
    Alert.alert(
      'Post Options',
      'Choose an action',
      [
        { text: 'Pin Post', onPress: () => handlePostAction(post.id, 'pin') },
        { text: 'Report Post', onPress: () => handlePostAction(post.id, 'flag') },
        { text: 'Remove Post', onPress: () => handlePostAction(post.id, 'remove'), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderPosts = () => (
    <View style={styles.postsContainer}>
      {isJoined && (
        <View style={styles.createPostContainer}>
          <View style={styles.createPostHeader}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
              style={styles.userAvatar}
            />
            <Text style={{ fontSize: 16, fontFamily: 'Inter-Regular', color: colors.textSecondary }}>
              Share something with the group...
            </Text>
          </View>
          <TextInput
            style={styles.createPostInput}
            value={newPost}
            onChangeText={setNewPost}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textTertiary}
            multiline
          />
          <View style={styles.createPostActions}>
            <TouchableOpacity style={styles.mediaButton}>
              <Camera size={16} color={colors.textSecondary} />
              <Text style={styles.mediaButtonText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.postButton, !newPost.trim() && styles.postButtonDisabled]}
              onPress={handleCreatePost}
              disabled={!newPost.trim()}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {posts.map((post) => (
        <View key={post.id} style={[styles.postCard, post.isPinned && styles.pinnedPost]}>
          {post.isPinned && (
            <View style={styles.pinnedBadge}>
              <Pin size={14} color={colors.primary} />
              <Text style={styles.pinnedText}>Pinned Post</Text>
            </View>
          )}
          
          <View style={styles.postHeader}>
            <View style={styles.postUserInfo}>
              <Image source={{ uri: post.author.avatar }} style={styles.postUserAvatar} />
              <View style={styles.postUserDetails}>
                <View style={styles.postUserName}>
                  <Text style={styles.postUserNameText}>{post.author.name}</Text>
                  {post.author.isAdmin && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>ADMIN</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.postTime}>{post.timestamp}</Text>
              </View>
            </View>
            {isJoined && (
              <TouchableOpacity 
                style={styles.postMenuButton}
                onPress={() => renderPostMenu(post)}
              >
                <MoreHorizontal size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.postContent}>{post.content}</Text>
          
          {post.image && (
            <Image source={{ uri: post.image }} style={styles.postImage} />
          )}

          <View style={styles.postActions}>
            <TouchableOpacity 
              style={[styles.actionButton, post.isLiked && styles.likedButton]}
              onPress={() => handleLikePost(post.id)}
            >
              <Heart 
                size={18} 
                color={post.isLiked ? colors.error : colors.textSecondary}
                fill={post.isLiked ? colors.error : 'none'}
              />
              <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={18} color={colors.textSecondary} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share size={18} color={colors.textSecondary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Description</Text>
        <Text style={styles.aboutText}>{groupInfo.description}</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Group Rules</Text>
        {groupInfo.rules.map((rule, index) => (
          <View key={index} style={styles.ruleItem}>
            <Text style={styles.ruleNumber}>{index + 1}.</Text>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Admins</Text>
        <View style={styles.adminList}>
          {groupInfo.admins.map((admin, index) => (
            <Text key={index} style={styles.adminItem}>• {admin}</Text>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <Image source={{ uri: groupInfo.coverImage }} style={styles.coverImage} />

        {/* Group Info */}
        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{groupInfo.name}</Text>
            <View style={styles.visibilityBadge}>
              <Globe size={12} color={colors.success} />
              <Text style={styles.visibilityText}>{groupInfo.visibility}</Text>
            </View>
          </View>

          <View style={styles.groupMeta}>
            <View style={styles.metaItem}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{groupInfo.memberCount.toLocaleString()} members</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{groupInfo.category}</Text>
            </View>
          </View>

          <Text style={styles.groupDescription}>{groupInfo.description}</Text>

          <TouchableOpacity 
            style={[styles.joinButton, isJoined && styles.joinButtonJoined]}
            onPress={handleJoinToggle}
          >
            <Text style={[styles.joinButtonText, isJoined && styles.joinButtonTextJoined]}>
              {isJoined ? 'Joined' : 'Join Group'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'about' && renderAbout()}
      </ScrollView>
    </SafeAreaView>
  );
}
