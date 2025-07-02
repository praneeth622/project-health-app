import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Send, ThumbsUp, Flag } from 'lucide-react-native';

import MarketplaceService, { 
  MarketplaceReview, 
  MarketplaceItem 
} from '@/services/marketplaceService';

interface CreateReviewRequest {
  item_id: string;
  rating: number;
  comment: string;
}

export default function ReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [newReview, setNewReview] = useState<CreateReviewRequest>({
    item_id: id || '',
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    if (id) {
      loadItemAndReviews();
    }
  }, [id]);

  const loadItemAndReviews = async () => {
    try {
      setLoading(true);
      const [itemData, reviewsData] = await Promise.all([
        MarketplaceService.getItemById(id!),
        MarketplaceService.getItemReviews(id!)
      ]);
      setItem(itemData);
      setReviews(reviewsData.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      Alert.alert('Error', 'Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async () => {
    if (newReview.rating === 0) {
      Alert.alert('Error', 'Please select a rating.');
      return;
    }

    if (!newReview.comment.trim()) {
      Alert.alert('Error', 'Please enter a comment.');
      return;
    }

    try {
      setSubmitting(true);
      const review = await MarketplaceService.createReview({
        ...newReview,
        comment: newReview.comment.trim(),
      });
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ item_id: id || '', rating: 0, comment: '' });
      setShowCreateReview(false);
      
      Alert.alert('Success', 'Your review has been posted.');
    } catch (error: any) {
      console.error('Failed to create review:', error);
      Alert.alert('Error', error.message || 'Failed to post review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, onPress?: (rating: number) => void, size: number = 20) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress && onPress(star)}
            disabled={!onPress}
          >
            <Star
              size={size}
              color={star <= rating ? '#F59E0B' : '#E5E7EB'}
              fill={star <= rating ? '#F59E0B' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      counts[review.rating as keyof typeof counts]++;
    });
    return counts;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  const averageRating = getAverageRating();
  const ratingCounts = getRatingCounts();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowCreateReview(true)}
        >
          <Send size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Item Info */}
        {item && (
          <View style={styles.itemSection}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemCategory}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
        )}

        {/* Rating Summary */}
        <View style={styles.summarySection}>
          <View style={styles.ratingOverview}>
            <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
            {renderStars(Math.round(averageRating), undefined, 24)}
            <Text style={styles.reviewCount}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</Text>
          </View>

          {/* Rating Breakdown */}
          <View style={styles.ratingBreakdown}>
            {[5, 4, 3, 2, 1].map((star) => (
              <View key={star} style={styles.ratingRow}>
                <Text style={styles.starLabel}>{star}</Text>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <View style={styles.ratingBar}>
                  <View 
                    style={[
                      styles.ratingBarFill, 
                      { width: `${reviews.length > 0 ? (ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100 : 0}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.ratingCount}>{ratingCounts[star as keyof typeof ratingCounts]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsSection}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>
                      {review.reviewer?.name || 'Anonymous'}
                    </Text>
                    <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
                  </View>
                  {renderStars(review.rating)}
                </View>
                
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}

                <View style={styles.reviewActions}>
                  <TouchableOpacity style={styles.reviewAction}>
                    <ThumbsUp size={16} color="#6B7280" />
                    <Text style={styles.reviewActionText}>Helpful</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reviewAction}>
                    <Flag size={16} color="#6B7280" />
                    <Text style={styles.reviewActionText}>Report</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Star size={64} color="#E5E7EB" />
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to review this item and help other buyers.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Review Modal */}
      <Modal
        visible={showCreateReview}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateReview(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateReview(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <TouchableOpacity 
              onPress={handleCreateReview}
              disabled={submitting || newReview.rating === 0}
            >
              <Text style={[
                styles.modalSubmit,
                (submitting || newReview.rating === 0) && styles.modalSubmitDisabled
              ]}>
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Rating Selection */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>How would you rate this item?</Text>
              {renderStars(newReview.rating, (rating) => setNewReview(prev => ({ ...prev, rating })), 32)}
            </View>

            {/* Comment Input */}
            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Tell us about your experience</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your thoughts about this item..."
                value={newReview.comment}
                onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>{newReview.comment.length}/500</Text>
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
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  itemSection: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  summarySection: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F3F4F6',
  },
  ratingOverview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  ratingBreakdown: {
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starLabel: {
    fontSize: 14,
    color: '#111827',
    width: 12,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  ratingCount: {
    fontSize: 14,
    color: '#6B7280',
    width: 24,
    textAlign: 'right',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewsSection: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewComment: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewActionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalSubmit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  modalSubmitDisabled: {
    color: '#9CA3AF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  commentSection: {
    flex: 1,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
});
