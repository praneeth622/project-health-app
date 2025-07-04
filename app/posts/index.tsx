import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Search,
  Filter,
  Camera,
  MapPin,
  Trophy,
  Target,
  X,
  Send,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { PostsService, Post, PostType, CreatePostRequest } from '@/services/postsService';

const { width } = Dimensions.get('window');

export default function SocialFeedScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'text' as PostType,
    location: '',
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      
      const response = await PostsService.getPublicPosts(
        {},
        { page: pageNum, limit: 20 }
      );
      
      if (append) {
        setPosts(prev => [...prev, ...response.data]);
      } else {
        setPosts(response.data);
      }
      
      setHasMorePosts(pageNum < response.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadPosts(1, false);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMorePosts) {
      setLoadingMore(true);
      loadPosts(page + 1, true);
    }
  }, [loadingMore, hasMorePosts, page]);

  const handleLikePost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const action = post.is_liked ? 'unlike' : 'like';
      const result = await PostsService.togglePostLike(postId, action);
      
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                is_liked: !p.is_liked,
                likes_count: result.likes_count,
              }
            : p
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    try {
      const postData: CreatePostRequest = {
        content: newPost.content.trim(),
        type: newPost.type,
        privacy: 'public',
        ...(newPost.location && { location: newPost.location }),
      };

      const createdPost = await PostsService.createPost(postData);
      
      setPosts(prev => [createdPost, ...prev]);
      setNewPost({ content: '', type: 'text', location: '' });
      setShowCreatePost(false);
      
      Alert.alert('Success', 'Your post has been shared!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handlePostOptions = (post: Post) => {
    Alert.alert(
      'Post Options',
      'Choose an action',
      [
        { text: 'Share', onPress: () => handleSharePost(post) },
        { text: 'Report', onPress: () => handleReportPost(post.id) },
        ...(post.author?.id === 'current_user_id' // Replace with actual user ID check
          ? [{ text: 'Delete', style: 'destructive' as const, onPress: () => handleDeletePost(post.id) }]
          : []
        ),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    );
  };

  const handleSharePost = (post: Post) => {
    Alert.alert('Success', 'Post shared successfully!');
  };

  const handleReportPost = (postId: string) => {
    Alert.alert('Reported', 'Thank you for reporting this post. We\'ll review it.');
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await PostsService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case 'workout':
        return <Target size={16} color={colors.primary} />;
      case 'health':
        return <Trophy size={16} color={colors.warning} />;
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const renderPost = ({ item: post }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: post.author?.profile_image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
            }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{post.author?.name || 'Anonymous'}</Text>
              {post.author?.is_verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
              {getPostTypeIcon(post.type)}
            </View>
            <View style={styles.postMeta}>
              <Text style={styles.postTime}>{formatTime(post.created_at)}</Text>
              {post.location && (
                <>
                  <Text style={styles.metaSeparator}>•</Text>
                  <MapPin size={12} color={colors.textSecondary} />
                  <Text style={styles.postLocation}>{post.location}</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => handlePostOptions(post)}
        >
          <MoreHorizontal size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Image */}
      {post.image_urls && post.image_urls.length > 0 && (
        <Image source={{ uri: post.image_urls[0] }} style={styles.postImage} />
      )}

      {/* Workout Data */}
      {post.workout_data && (
        <View style={styles.workoutData}>
          <View style={styles.workoutHeader}>
            <Target size={16} color={colors.primary} />
            <Text style={styles.workoutTitle}>Workout Complete</Text>
          </View>
          <View style={styles.workoutStats}>
            {post.workout_data.duration_minutes && (
              <View style={styles.workoutStat}>
                <Text style={styles.workoutStatValue}>{post.workout_data.duration_minutes}</Text>
                <Text style={styles.workoutStatLabel}>mins</Text>
              </View>
            )}
            {post.workout_data.calories_burned && (
              <View style={styles.workoutStat}>
                <Text style={styles.workoutStatValue}>{post.workout_data.calories_burned}</Text>
                <Text style={styles.workoutStatLabel}>cal</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={[styles.actionButton, post.is_liked && styles.likedButton]}
          onPress={() => handleLikePost(post.id)}
        >
          <Heart
            size={20}
            color={post.is_liked ? colors.error : colors.textSecondary}
            fill={post.is_liked ? colors.error : 'none'}
          />
          <Text style={[styles.actionText, post.is_liked && styles.likedText]}>
            {post.likes_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{post.shares_count || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Bookmark
            size={20}
            color={post.is_bookmarked ? colors.primary : colors.textSecondary}
            fill={post.is_bookmarked ? colors.primary : 'none'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Social Feed</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowCreatePost(true)}
          >
            <Plus size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreatePost(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity
              style={[styles.postButton, !newPost.content.trim() && styles.postButtonDisabled]}
              onPress={handleCreatePost}
              disabled={!newPost.content.trim()}
            >
              <Send size={20} color={newPost.content.trim() ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={[styles.postInput, { color: colors.text, borderColor: colors.border }]}
              value={newPost.content}
              onChangeText={(text) => setNewPost(prev => ({ ...prev, content: text }))}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textTertiary}
              multiline
              autoFocus
            />

            <TextInput
              style={[styles.locationInput, { color: colors.text, borderColor: colors.border }]}
              value={newPost.location}
              onChangeText={(text) => setNewPost(prev => ({ ...prev, location: text }))}
              placeholder="Add location (optional)"
              placeholderTextColor={colors.textTertiary}
            />

            <View style={styles.postTypeSelector}>
              <Text style={[styles.selectorLabel, { color: colors.text }]}>Post Type:</Text>
              <View style={styles.typeButtons}>
                {(['text', 'workout', 'achievement'] as PostType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      { borderColor: colors.border },
                      newPost.type === type && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setNewPost(prev => ({ ...prev, type }))}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      { color: newPost.type === type ? colors.surface : colors.text }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingVertical: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  verifiedBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#666666',
  },
  metaSeparator: {
    fontSize: 12,
    color: '#666666',
  },
  postLocation: {
    fontSize: 12,
    color: '#666666',
  },
  optionsButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1C1C1E',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 12,
  },
  workoutData: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutStat: {
    alignItems: 'center',
  },
  workoutStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  workoutStatLabel: {
    fontSize: 12,
    color: '#666666',
  },
  achievementData: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#E7F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  likedButton: {
    // styles for liked state
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  likedText: {
    color: '#FF3B30',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  postButton: {
    padding: 4,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  postInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  locationInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  postTypeSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
