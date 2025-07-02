import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Heart, MapPin, Star, Eye, ShoppingCart } from 'lucide-react-native';
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  conditionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  actionsOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favorited: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  sellerName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
