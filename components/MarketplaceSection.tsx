import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { ShoppingBag, Star, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  isFeatured?: boolean;
}

interface MarketplaceSectionProps {
  title?: string;
  items?: MarketplaceItem[];
}

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Premium Protein Powder',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    rating: 4.8,
    category: 'Supplements',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Adjustable Dumbbells',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    rating: 4.9,
    category: 'Equipment',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Yoga Mat Premium',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    rating: 4.7,
    category: 'Accessories',
  },
];

export default function MarketplaceSection({ 
  title = "Health Marketplace", 
  items = mockItems 
}: MarketplaceSectionProps) {
  const handleItemPress = (item: MarketplaceItem) => {
    router.push(`/marketplace/${item.id}` as any);
  };

  const handleViewAll = () => {
    router.push('/(tabs)/marketplace' as any);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ShoppingBag size={24} color="#10B981" />
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <TrendingUp size={16} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Items */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsContainer}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.itemCard, index === 0 && styles.firstItem]}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              {item.isFeatured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              )}
            </View>
            
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              
              <View style={styles.itemFooter}>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* View All Card */}
        <TouchableOpacity style={styles.viewAllCard} onPress={handleViewAll}>
          <View style={styles.viewAllIconContainer}>
            <ShoppingBag size={32} color="#10B981" />
          </View>
          <Text style={styles.viewAllCardTitle}>View All</Text>
          <Text style={styles.viewAllCardSubtitle}>Browse marketplace</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  itemsContainer: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: 200,
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
  firstItem: {
    marginLeft: 0,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 18,
  },
  itemCategory: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  viewAllCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    width: 160,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  viewAllIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#ECFDF5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  viewAllCardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
