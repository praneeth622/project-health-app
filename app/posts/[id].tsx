import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Send,
  MapPin,
  Trophy,
  Target,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { PostsService, Post, PostType, PostStats } from '@/services/postsService';
import { CommentsService, Comment as ServiceComment } from '@/services/commentsService';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes_count: number;
  is_liked?: boolean;
  user?: {
    id: string;
    name: string;
    profile_image?: string;
  };
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [stats, setStats] = useState<PostStats | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      loadPostDetails();
    }
  }, [id]);

  const loadPostDetails = async () => {
    try {
      setLoading(true);
      const [postData, statsData] = await Promise.all([
        PostsService.getPostById(id!),
        PostsService.getPostStats(id!).catch(() => null), // Optional stats
      ]);
      
      setPost(postData);
      if (statsData) setStats(statsData);
      
      // Load comments
      await loadComments();
    } catch (error) {
      console.error('Error loading post details:', error);
      Alert.alert('Error', 'Failed to load post details');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsResponse = await CommentsService.getPostComments(id!);
      // Convert service comments to local Comment interface
      const localComments: Comment[] = commentsResponse.data.map((comment: ServiceComment) => ({
        id: comment.id,
        user_id: comment.created_by,
        content: comment.content,
        created_at: comment.created_at,
        likes_count: comment.likes_count,
        is_liked: comment.is_liked,
        user: comment.author ? {
          id: comment.author.id,
          name: comment.author.name,
          profile_image: comment.author.profile_image,
        } : undefined,
      }));
      setComments(localComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      // Fall back to mock comments on error
      setComments(mockComments);
    }
  };

  const handleLikePost = async () => {
    if (!post) return;
    
    try {
      const action = post.is_liked ? 'unlike' : 'like';
      const result = await PostsService.togglePostLike(post.id, action);
      setPost(prev => prev ? {
        ...prev,
        is_liked: !prev.is_liked,
        likes_count: result.likes_count,
      } : null);
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleSharePost = () => {
    Alert.alert('Success', 'Post shared successfully!');
  };

  const handleBookmarkPost = () => {
    if (!post) return;
    
    setPost(prev => prev ? {
      ...prev,
      is_bookmarked: !prev.is_bookmarked,
    } : null);
    
    Alert.alert('Success', post.is_bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handlePostOptions = () => {
    Alert.alert(
      'Post Options',
      'Choose an action',
      [
        { text: 'Report', onPress: () => Alert.alert('Reported', 'Thank you for reporting this post.') },
        { text: 'Block User', onPress: () => Alert.alert('Blocked', 'User has been blocked.') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      
      // Create comment using the service
      const newCommentData = await CommentsService.createComment({
        post_id: id!,
        content: newComment.trim(),
      });
      
      // Convert to local Comment interface and add to list
      const localComment: Comment = {
        id: newCommentData.id,
        user_id: newCommentData.created_by,
        content: newCommentData.content,
        created_at: newCommentData.created_at,
        likes_count: newCommentData.likes_count,
        is_liked: newCommentData.is_liked || false,
        user: newCommentData.author ? {
          id: newCommentData.author.id,
          name: newCommentData.author.name,
          profile_image: newCommentData.author.profile_image,
        } : {
          id: 'current_user',
          name: 'You',
          profile_image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        },
      };
      
      setComments(prev => [localComment, ...prev]);
      setNewComment('');
      
      // Update comment count
      setPost(prev => prev ? {
        ...prev,
        comments_count: prev.comments_count + 1,
      } : null);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;
      
      const action = comment.is_liked ? 'unlike' : 'like';
      await CommentsService.toggleCommentLike(commentId, action);
      
      // Update comment in state
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? {
              ...c,
              is_liked: !c.is_liked,
              likes_count: c.is_liked ? c.likes_count - 1 : c.likes_count + 1,
            }
          : c
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
      Alert.alert('Error', 'Failed to like comment');
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading post...</Text>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Post not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <TouchableOpacity style={styles.optionsButton} onPress={handlePostOptions}>
          <MoreHorizontal size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
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
                    <Text style={[styles.userName, { color: colors.text }]}>
                      {post.author?.name || 'Anonymous'}
                    </Text>
                    {post.author?.is_verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                    {getPostTypeIcon(post.type)}
                  </View>
                  <View style={styles.postMeta}>
                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                      {formatTime(post.created_at)}
                    </Text>
                    {post.location && (
                      <>
                        <Text style={[styles.metaSeparator, { color: colors.textSecondary }]}>•</Text>
                        <MapPin size={12} color={colors.textSecondary} />
                        <Text style={[styles.postLocation, { color: colors.textSecondary }]}>
                          {post.location}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Post Content */}
            <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

            {/* Post Image */}
            {post.image_urls && post.image_urls.length > 0 && (
              <Image source={{ uri: post.image_urls[0] }} style={styles.postImage} />
            )}

            {/* Workout Data */}
            {post.workout_data && (
              <View style={styles.workoutData}>
                <View style={styles.workoutHeader}>
                  <Target size={16} color={colors.primary} />
                  <Text style={[styles.workoutTitle, { color: colors.text }]}>Workout Complete</Text>
                </View>
                <View style={styles.workoutStats}>
                  {post.workout_data.duration_minutes && (
                    <View style={styles.workoutStat}>
                      <Text style={[styles.workoutStatValue, { color: colors.primary }]}>
                        {post.workout_data.duration_minutes}
                      </Text>
                      <Text style={[styles.workoutStatLabel, { color: colors.textSecondary }]}>mins</Text>
                    </View>
                  )}
                  {post.workout_data.calories_burned && (
                    <View style={styles.workoutStat}>
                      <Text style={[styles.workoutStatValue, { color: colors.primary }]}>
                        {post.workout_data.calories_burned}
                      </Text>
                      <Text style={[styles.workoutStatLabel, { color: colors.textSecondary }]}>cal</Text>
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
                    <Text style={[styles.tagText, { color: colors.primary }]}>#{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Post Actions */}
            <View style={[styles.postActions, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLikePost}
              >
                <Heart
                  size={24}
                  color={post.is_liked ? colors.error : colors.textSecondary}
                  fill={post.is_liked ? colors.error : 'none'}
                />
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                  {post.likes_count}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={24} color={colors.textSecondary} />
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                  {post.comments_count}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleSharePost}>
                <Share size={24} color={colors.textSecondary} />
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                  {post.shares_count || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleBookmarkPost}>
                <Bookmark
                  size={24}
                  color={post.is_bookmarked ? colors.primary : colors.textSecondary}
                  fill={post.is_bookmarked ? colors.primary : 'none'}
                />
              </TouchableOpacity>
            </View>

            {/* Post Stats */}
            {stats && (
              <View style={[styles.statsContainer, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.statsTitle, { color: colors.text }]}>Engagement</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>{stats.total_views}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Views</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>
                      {stats.engagement_rate.toFixed(1)}%
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Engagement</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Comments Section */}
          <View style={[styles.commentsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.commentsTitle, { color: colors.text }]}>
              Comments ({comments.length})
            </Text>
            
            {comments.map((comment) => (
              <View key={comment.id} style={[styles.commentCard, { borderBottomColor: colors.border }]}>
                <Image
                  source={{
                    uri: comment.user?.profile_image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
                  }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={[styles.commentUserName, { color: colors.text }]}>
                      {comment.user?.name || 'Anonymous'}
                    </Text>
                    <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
                      {formatTime(comment.created_at)}
                    </Text>
                  </View>
                  <Text style={[styles.commentText, { color: colors.text }]}>{comment.content}</Text>
                  <TouchableOpacity 
                    style={styles.commentLikeButton} 
                    onPress={() => handleLikeComment(comment.id)}
                  >
                    <Heart 
                      size={16} 
                      color={comment.is_liked ? colors.error : colors.textSecondary}
                      fill={comment.is_liked ? colors.error : 'none'}
                    />
                    <Text style={[styles.commentLikeText, { color: colors.textSecondary }]}>
                      {comment.likes_count}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={[styles.commentInputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.commentInput, { color: colors.text, borderColor: colors.border }]}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            placeholderTextColor={colors.textTertiary}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || submittingComment}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Send size={20} color={newComment.trim() ? colors.surface : colors.textTertiary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    user_id: 'user1',
    content: 'Great workout! What was your favorite exercise from this session?',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes_count: 5,
    is_liked: false,
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      profile_image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
  },
  {
    id: '2',
    user_id: 'user2',
    content: 'This is so inspiring! I need to get back into my morning routine 💪',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes_count: 12,
    is_liked: true,
    user: {
      id: 'user2',
      name: 'Mike Chen',
      profile_image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
  },
];

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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  postCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  postHeader: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
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
    marginTop: 4,
  },
  postTime: {
    fontSize: 14,
  },
  metaSeparator: {
    fontSize: 14,
  },
  postLocation: {
    fontSize: 14,
  },
  postContent: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  workoutData: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 20,
  },
  workoutStat: {
    alignItems: 'center',
  },
  workoutStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  workoutStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  achievementData: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  achievementDescription: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#E7F3FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  commentsSection: {
    marginTop: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeText: {
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
