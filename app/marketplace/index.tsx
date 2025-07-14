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
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, TrendingUp, Heart, ShoppingBag, Star, Award, Users, Clock, Sparkles, Zap } from 'lucide-react-native';

import MarketplaceItemCard from '@/components/MarketplaceItemCard';
import MarketplaceSearch from '@/components/MarketplaceSearch';
import { useTheme } from '@/contexts/ThemeContext';
import MarketplaceService, { 
  MarketplaceItem, 
  MarketplaceFilters,
  MarketplaceCategory 
} from '@/services/marketplaceService';

const { width } = Dimensions.get('window');

const categories: { value: MarketplaceCategory; label: string; icon: string; gradient: string[] }[] = [
  { value: 'supplements', label: 'Supplements', icon: '💊', gradient: ['#FF6B6B', '#FF8E8E'] },
  { value: 'equipment', label: 'Equipment', icon: '🏋️', gradient: ['#4ECDC4', '#44A08D'] },
  { value: 'apparel', label: 'Apparel', icon: '👕', gradient: ['#A8E6CF', '#7FB069'] },
  { value: 'services', label: 'Services', icon: '🤝', gradient: ['#FFD93D', '#FF9F1C'] },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗', gradient: ['#6BCF7F', '#4CAF50'] },
  { value: 'programs', label: 'Programs', icon: '📋', gradient: ['#74B9FF', '#0984E3'] },
  { value: 'accessories', label: 'Accessories', icon: '🎒', gradient: ['#A29BFE', '#6C5CE7'] },
];

export default function MarketplaceScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | null>(null);

  // Create dynamic styles based on theme
  const createStyles = (colors: any) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.textSecondary,
      fontFamily: 'Inter-Medium',
    },
    // Enhanced Header Design - Modern & Compact
    headerGradient: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    titleIconContainer: {
      width: 44,
      height: 44,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 22,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 2,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.85)',
      fontFamily: 'Inter-Medium',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 6,
    },
    headerButton: {
      width: 36,
      height: 36,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    createButton: {
      width: 36,
      height: 36,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    // Compact Stats Container
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      gap: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    statIconContainer: {
      width: 28,
      height: 28,
      backgroundColor: '#F59E0B' + '20',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    statValue: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: 'Inter-Medium',
    },
    // Enhanced Categories Section
    categoriesSection: {
      backgroundColor: colors.surface,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    categoriesContainer: {
      paddingHorizontal: 20,
      gap: 10,
    },
    categoryItem: {
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: colors.background,
      minWidth: 70,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    categoryItemActive: {
      transform: [{ scale: 1.05 }],
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    categoryIconWrapper: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      backgroundColor: colors.background,
    },
    categoryIconWrapperActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    categoryIcon: {
      fontSize: 16,
    },
    categoryText: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    categoryTextActive: {
      color: '#FFFFFF',
    },
    // Items List & Grid - Enhanced for Compact Cards
    itemsList: {
      flex: 1,
      backgroundColor: colors.background,
    },
    itemsContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 20,
    },
    // Enhanced Featured Section
    featuredSection: {
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      letterSpacing: -0.2,
    },
    // Enhanced Loading States
    loadMoreContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      gap: 10,
    },
    loadMoreText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: 'Inter-Medium',
    },
    endMessageContainer: {
      alignItems: 'center',
      paddingVertical: 28,
    },
    endMessage: {
      fontSize: 15,
      color: colors.textSecondary,
      fontFamily: 'Inter-SemiBold',
      letterSpacing: 0.1,
    },
    // Enhanced Empty State
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 22,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 28,
      lineHeight: 22,
      fontFamily: 'Inter-Regular',
    },
    createFirstButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 16,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    createFirstButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontFamily: 'Inter-Bold',
      letterSpacing: 0.2,
    },
  });

  const styles = createStyles(colors);

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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading marketplace...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Compact Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primary + '90']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <View style={styles.titleIconContainer}>
                <ShoppingBag size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>Marketplace</Text>
                <Text style={styles.subtitle}>Discover health products</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/marketplace/stats' as any)}>
                <TrendingUp size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/marketplace/favorites' as any)}>
                <Heart size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/marketplace/orders' as any)}>
                <ShoppingBag size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateItem}>
                <Plus size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Compact Stats Cards Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Star size={16} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#10B981' + '20' }]}>
            <Award size={16} color="#10B981" />
          </View>
          <Text style={styles.statValue}>1.2k</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#6366F1' + '20' }]}>
            <Users size={16} color="#6366F1" />
          </View>
          <Text style={styles.statValue}>850</Text>
          <Text style={styles.statLabel}>Sellers</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <MarketplaceSearch
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
      />

      {/* Enhanced Compact Categories */}
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
            <LinearGradient
              colors={selectedCategory === null ? [colors.primary, colors.primary + 'DD'] : [colors.background, colors.background]}
              style={[styles.categoryIconWrapper, selectedCategory === null && styles.categoryIconWrapperActive]}
            >
              <Text style={styles.categoryIcon}>🏪</Text>
            </LinearGradient>
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
            <LinearGradient
              colors={selectedCategory === category.value ? [category.gradient[0], category.gradient[1]] : [colors.background, colors.background]}
              style={[
                styles.categoryIconWrapper,
                selectedCategory === category.value && styles.categoryIconWrapperActive,
              ]}
            >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              </LinearGradient>
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

      {/* Enhanced Items List */}
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
              <Sparkles size={18} color={colors.primary} />
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
                <ActivityIndicator size="small" color={colors.primary} />
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
            <Zap size={40} color={colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters to find what you're looking for.
            </Text>
            <LinearGradient
              colors={[colors.primary, colors.primary + 'DD']}
              style={styles.createFirstButton}
            >
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={handleCreateItem}>
                <Plus size={16} color="#FFF" />
                <Text style={styles.createFirstButtonText}>List Your First Item</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


