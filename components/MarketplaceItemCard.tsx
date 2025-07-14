import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Heart, MapPin, Star, Eye, ShoppingCart, CheckCircle, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MarketplaceItem } from '@/services/marketplaceService';

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  onPress: (item: MarketplaceItem) => void;
  onFavorite?: (item: MarketplaceItem) => void;
  onAddToCart?: (item: MarketplaceItem) => void;
  showActions?: boolean;
}

export default function MarketplaceItemCard({ 
  item, 
  onPress, 
  onFavorite, 
  onAddToCart,
  showActions = true 
}: MarketplaceItemCardProps) {
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case 'new': return '#10B981';
      case 'like_new': return '#3B82F6';
      case 'good': return '#F59E0B';
      case 'fair': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getConditionLabel = (condition?: string) => {
    switch (condition) {
      case 'new': return 'New';
      case 'like_new': return 'Like New';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      default: return 'Unknown';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: item.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image' 
          }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Featured Badge */}
        {item.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}

        {/* Condition Badge */}
        {item.condition && (
          <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) }]}>
            <Text style={styles.conditionText}>{getConditionLabel(item.condition)}</Text>
          </View>
        )}

        {/* Actions Overlay */}
        {showActions && (
          <View style={styles.actionsOverlay}>
            {onFavorite && (
              <TouchableOpacity 
                style={[styles.actionButton, item.is_favorited && styles.favorited]}
                onPress={() => onFavorite(item)}
              >
                <Heart 
                  size={18} 
                  color={item.is_favorited ? '#EF4444' : '#FFF'} 
                  fill={item.is_favorited ? '#EF4444' : 'transparent'} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Price */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price}>{formatPrice(item.price, item.currency)}</Text>
        </View>

        {/* Category */}
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Location and Stats */}
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            {item.location && (
              <>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.location}>{item.location}</Text>
              </>
            )}
          </View>
          
          <View style={styles.stats}>
            {item.views_count !== undefined && (
              <View style={styles.stat}>
                <Eye size={12} color="#6B7280" />
                <Text style={styles.statText}>{item.views_count}</Text>
              </View>
            )}
            
            {item.favorites_count !== undefined && (
              <View style={styles.stat}>
                <Heart size={12} color="#6B7280" />
                <Text style={styles.statText}>{item.favorites_count}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Seller Info */}
        {item.seller && (
          <View style={styles.sellerInfo}>
            <Image 
              source={{ 
                uri: item.seller.profile_image || 'https://via.placeholder.com/30x30?text=U' 
              }}
              style={styles.sellerAvatar}
            />
            <Text style={styles.sellerName}>{item.seller.name}</Text>
            {item.seller.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
            {item.seller.rating && (
              <View style={styles.rating}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{item.seller.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {showActions && onAddToCart && (
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => onAddToCart(item)}
          >
            <ShoppingCart size={16} color="#FFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Enhanced Compact Card Design
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
  },
  // Compact Image Container
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: '#F8FAFC',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
  },
  // Enhanced Badge Styles
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.3,
  },
  conditionBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Modern Action Buttons
  actionsOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  favorited: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  // Compact Content Layout
  content: {
    padding: 14,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginRight: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-ExtraBold',
    color: '#10B981',
    letterSpacing: -0.3,
  },
  // Enhanced Category Design
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#6366F1',
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  // Compact Description
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  // Redesigned Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  location: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 3,
    fontFamily: 'Inter-Medium',
  },
  // Compact Stats
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statText: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
  },
  // Compact Seller Info
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#FAFBFC',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: '#E2E8F0',
  },
  sellerName: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Inter-ExtraBold',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    color: '#F59E0B',
    fontFamily: 'Inter-Bold',
  },
  // Enhanced Add to Cart Button
  addToCartButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.2,
  },
});
