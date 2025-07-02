import apiClient from './api';
import { supabase } from '@/lib/supabase';

// Marketplace Types
export type MarketplaceCategory = 'supplements' | 'equipment' | 'apparel' | 'services' | 'nutrition' | 'programs' | 'accessories';
export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  price: number;
  currency: string;
  condition?: ItemCondition;
  location?: string;
  images: string[];
  seller_id: string;
  seller?: {
    id: string;
    name: string;
    profile_image?: string;
    rating?: number;
    verified?: boolean;
  };
  is_available: boolean;
  is_featured: boolean;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  views_count?: number;
  favorites_count?: number;
  is_favorited?: boolean;
}

export interface CreateMarketplaceItemRequest {
  title: string;
  description: string;
  category: MarketplaceCategory;
  price: number;
  currency?: string;
  condition?: ItemCondition;
  location?: string;
  images?: string[];
  tags?: string[];
}

export interface UpdateMarketplaceItemRequest {
  title?: string;
  description?: string;
  category?: MarketplaceCategory;
  price?: number;
  condition?: ItemCondition;
  location?: string;
  images?: string[];
  tags?: string[];
  is_available?: boolean;
}

export interface MarketplaceFilters {
  category?: MarketplaceCategory;
  min_price?: number;
  max_price?: number;
  condition?: ItemCondition;
  location?: string;
  search?: string;
  tags?: string[];
}

export interface MarketplaceReview {
  id: string;
  item_id: string;
  reviewer_id: string;
  reviewer?: {
    id: string;
    name: string;
    profile_image?: string;
  };
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CreateReviewRequest {
  item_id: string;
  rating: number;
  comment?: string;
}

export interface MarketplaceOrder {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  shipping_address?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  item?: MarketplaceItem;
}

export interface CreateOrderRequest {
  item_id: string;
  quantity: number;
  shipping_address?: string;
  notes?: string;
}

export interface MarketplaceStats {
  total_items: number;
  total_sellers: number;
  categories_count: Record<MarketplaceCategory, number>;
  average_price: number;
  trending_categories: MarketplaceCategory[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class MarketplaceService {
  // Get current authenticated user's ID
  private static async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch (error) {
      console.error('Failed to get current user ID:', error);
      return null;
    }
  }

  /**
   * Create a new marketplace item
   * POST /marketplace
   */
  static async createItem(itemData: CreateMarketplaceItemRequest): Promise<MarketplaceItem> {
    try {
      // Validate required fields
      if (!itemData.title.trim()) {
        throw new Error('Item title is required');
      }
      if (!itemData.description.trim()) {
        throw new Error('Item description is required');
      }
      if (itemData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const response = await apiClient.post('/marketplace', {
        ...itemData,
        currency: itemData.currency || 'USD'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create marketplace item:', error);
      throw error;
    }
  }

  /**
   * Get all marketplace items with filters
   * GET /marketplace
   */
  static async getItems(
    filters?: MarketplaceFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MarketplaceItem>> {
    try {
      const response = await apiClient.get('/marketplace', {
        params: {
          ...filters,
          ...pagination
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
      throw error;
    }
  }

  /**
   * Get marketplace statistics
   * GET /marketplace/stats
   */
  static async getStats(): Promise<MarketplaceStats> {
    try {
      const response = await apiClient.get('/marketplace/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch marketplace stats:', error);
      throw error;
    }
  }

  /**
   * Get marketplace items for a specific user
   * GET /marketplace/user/{userId}
   */
  static async getUserItems(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MarketplaceItem>> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      const response = await apiClient.get(`/marketplace/user/${targetUserId}`, {
        params: pagination
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user marketplace items:', error);
      throw error;
    }
  }

  /**
   * Get marketplace item by ID
   * GET /marketplace/{id}
   */
  static async getItemById(itemId: string): Promise<MarketplaceItem> {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }

      const response = await apiClient.get(`/marketplace/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch marketplace item:', error);
      throw error;
    }
  }

  /**
   * Update marketplace item
   * PATCH /marketplace/{id}
   */
  static async updateItem(
    itemId: string,
    updateData: UpdateMarketplaceItemRequest
  ): Promise<MarketplaceItem> {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }

      // Validate update data
      if (updateData.price !== undefined && updateData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const response = await apiClient.patch(`/marketplace/${itemId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Failed to update marketplace item:', error);
      throw error;
    }
  }

  /**
   * Delete marketplace item
   * DELETE /marketplace/{id}
   */
  static async deleteItem(itemId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }

      const response = await apiClient.delete(`/marketplace/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete marketplace item:', error);
      throw error;
    }
  }

  /**
   * Create a review for marketplace item
   * POST /marketplace/reviews
   */
  static async createReview(reviewData: CreateReviewRequest): Promise<MarketplaceReview> {
    try {
      if (!reviewData.item_id) {
        throw new Error('Item ID is required');
      }
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const response = await apiClient.post('/marketplace/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  }

  /**
   * Get reviews for marketplace item
   * GET /marketplace/{id}/reviews
   */
  static async getItemReviews(
    itemId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MarketplaceReview>> {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }

      const response = await apiClient.get(`/marketplace/${itemId}/reviews`, {
        params: pagination
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch item reviews:', error);
      throw error;
    }
  }

  /**
   * Add item to favorites
   * POST /marketplace/{id}/favorite
   */
  static async addToFavorites(itemId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }

      const response = await apiClient.post(`/marketplace/${itemId}/favorite`);
      return response.data;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      throw error;
    }
  }

  /**
   * Remove item from favorites
   * DELETE /marketplace/{id}/favorite
   */
  static async removeFromFavorites(itemId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }

      const response = await apiClient.delete(`/marketplace/${itemId}/favorite`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      throw error;
    }
  }

  /**
   * Get user favorites
   * GET /marketplace/favorites/{userId}
   */
  static async getUserFavorites(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MarketplaceItem>> {
    try {
      const targetUserId = userId || await this.getCurrentUserId();
      if (!targetUserId) {
        throw new Error('No user ID available');
      }

      const response = await apiClient.get(`/marketplace/favorites/${targetUserId}`, {
        params: pagination
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user favorites:', error);
      throw error;
    }
  }

  /**
   * Create an order for marketplace item
   * POST /marketplace/orders
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<MarketplaceOrder> {
    try {
      if (!orderData.item_id) {
        throw new Error('Item ID is required');
      }
      if (orderData.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const response = await apiClient.post('/marketplace/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  /**
   * Search marketplace items
   */
  static async searchItems(
    query: string,
    filters?: MarketplaceFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MarketplaceItem>> {
    const searchFilters = {
      ...filters,
      search: query
    };
    return this.getItems(searchFilters, pagination);
  }

  /**
   * Get items by category
   */
  static async getItemsByCategory(
    category: MarketplaceCategory,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MarketplaceItem>> {
    return this.getItems({ category }, pagination);
  }

  /**
   * Get featured items
   */
  static async getFeaturedItems(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MarketplaceItem>> {
    // Note: This would need backend support for featured items filtering
    return this.getItems({}, pagination);
  }

  /**
   * Validate marketplace item data
   */
  static validateItemData(data: Partial<CreateMarketplaceItemRequest>): string[] {
    const errors: string[] = [];

    if (data.title !== undefined) {
      if (!data.title.trim()) {
        errors.push('Title is required');
      } else if (data.title.length > 100) {
        errors.push('Title must be less than 100 characters');
      }
    }

    if (data.description !== undefined) {
      if (!data.description.trim()) {
        errors.push('Description is required');
      } else if (data.description.length > 2000) {
        errors.push('Description must be less than 2000 characters');
      }
    }

    if (data.price !== undefined && data.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (data.images && data.images.length > 10) {
      errors.push('Maximum of 10 images allowed');
    }

    if (data.tags && data.tags.length > 20) {
      errors.push('Maximum of 20 tags allowed');
    }

    return errors;
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  /**
   * Format item for display
   */
  static formatItemForDisplay(item: MarketplaceItem) {
    return {
      ...item,
      formattedPrice: this.formatPrice(item.price, item.currency),
      tagsArray: Array.isArray(item.tags) 
        ? item.tags
        : item.tags 
          ? String(item.tags).split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : [],
      createdAtFormatted: new Date(item.created_at).toLocaleDateString(),
      isNew: item.condition === 'new',
      hasDiscount: false, // Could be calculated based on original price
    };
  }
}

export default MarketplaceService;
