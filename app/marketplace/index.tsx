import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, TrendingUp, Heart, ShoppingBag } from 'lucide-react-native';

import MarketplaceItemCard from '@/components/MarketplaceItemCard';
import MarketplaceSearch from '@/components/MarketplaceSearch';
import MarketplaceService, { 
  MarketplaceItem, 
  MarketplaceFilters,
  MarketplaceCategory 
} from '@/services/marketplaceService';

const categories: { value: MarketplaceCategory; label: string; icon: string }[] = [
  { value: 'supplements', label: 'Supplements', icon: '💊' },
  { value: 'equipment', label: 'Equipment', icon: '🏋️' },
  { value: 'apparel', label: 'Apparel', icon: '👕' },
  { value: 'services', label: 'Services', icon: '🤝' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { value: 'programs', label: 'Programs', icon: '📋' },
  { value: 'accessories', label: 'Accessories', icon: '🎒' },
];

export default function MarketplaceScreen() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | null>(null);

  // Load items
  const loadItems = useCallback(async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const searchFilters = {
        ...filters,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await MarketplaceService.getItems(searchFilters, {
        page,
        limit: 20,
      });

      // Ensure response.data is an array
      const responseData = Array.isArray(response.data) ? response.data : [];

      if (page === 1 || isRefresh) {
        setItems(responseData);
      } else {
        setItems(prev => [...(prev || []), ...responseData]);
      }

      setHasMore(page < (response.total_pages || 1));
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load marketplace items:', error);
      
      // On error, ensure items is still an array
      if (page === 1 || isRefresh) {
        setItems([]);
      }
      
      Alert.alert('Error', 'Failed to load marketplace items. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [filters, searchQuery, selectedCategory]);

  // Initial load
  useEffect(() => {
    loadItems(1, true);
  }, [filters, searchQuery, selectedCategory]);

  // Refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadItems(1, true);
  }, [loadItems]);

  // Load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadItems(currentPage + 1);
    }
  }, [loadingMore, hasMore, currentPage, loadItems]);

  // Search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Filters
  const handleFiltersChange = useCallback((newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Category selection
  const handleCategorySelect = useCallback((category: MarketplaceCategory | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  // Item interactions
  const handleItemPress = useCallback((item: MarketplaceItem) => {
    router.push(`/marketplace/${item.id}` as any);
  }, []);

  const handleFavorite = useCallback(async (item: MarketplaceItem) => {
    try {
      if (item.is_favorited) {
        await MarketplaceService.removeFromFavorites(item.id);
      } else {
        await MarketplaceService.addToFavorites(item.id);
      }
      
      // Update item in state
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, is_favorited: !i.is_favorited }
          : i
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  }, []);

  const handleAddToCart = useCallback((item: MarketplaceItem) => {
    // Navigate to purchase/order screen
    router.push({
      pathname: '/marketplace/purchase' as any,
      params: { itemId: item.id }
    });
  }, []);

  const handleCreateItem = useCallback(() => {
    router.push('/marketplace/create' as any);
  }, []);

  if (loading && (!items || items.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading marketplace...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Marketplace</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/marketplace/stats' as any)}>
              <TrendingUp size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/marketplace/favorites' as any)}>
              <Heart size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/marketplace/orders' as any)}>
              <ShoppingBag size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateItem}>
              <Plus size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <MarketplaceSearch
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
      />

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === null && styles.categoryItemActive,
            ]}
            onPress={() => handleCategorySelect(null)}
          >
            <Text style={styles.categoryIcon}>🏪</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.categoryTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryItem,
                selectedCategory === category.value && styles.categoryItemActive,
              ]}
              onPress={() => handleCategorySelect(category.value)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.value && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Items List */}
      <ScrollView
        style={styles.itemsList}
        contentContainerStyle={styles.itemsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Featured Section */}
        {selectedCategory === null && searchQuery === '' && (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>Featured Items</Text>
            </View>
          </View>
        )}

        {/* Items Grid */}
        {items && items.length > 0 ? (
          <>
            {items.map((item) => (
              <MarketplaceItemCard
                key={item.id}
                item={item}
                onPress={handleItemPress}
                onFavorite={handleFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
            
            {/* Load More Indicator */}
            {loadingMore && (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={styles.loadMoreText}>Loading more items...</Text>
              </View>
            )}
            
            {/* End Message */}
            {!hasMore && items && items.length > 0 && (
              <View style={styles.endMessageContainer}>
                <Text style={styles.endMessage}>You've reached the end!</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters to find what you're looking for.
            </Text>
            <TouchableOpacity style={styles.createFirstButton} onPress={handleCreateItem}>
              <Plus size={20} color="#FFF" />
              <Text style={styles.createFirstButtonText}>List Your First Item</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    width: 44,
    height: 44,
    backgroundColor: '#6366F1',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesSection: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    minWidth: 80,
  },
  categoryItemActive: {
    backgroundColor: '#6366F1',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  itemsList: {
    flex: 1,
  },
  itemsContainer: {
    padding: 20,
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  loadMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#6B7280',
  },
  endMessageContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  endMessage: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createFirstButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
