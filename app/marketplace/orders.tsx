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
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MessageCircle } from 'lucide-react-native';

import MarketplaceService, { MarketplaceOrder } from '@/services/marketplaceService';

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load orders (mock implementation since the service doesn't have this method yet)
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Since MarketplaceService doesn't have a getUserOrders method, 
      // we'll create mock data for now
      const mockOrders: MarketplaceOrder[] = [
        {
          id: '1',
          item_id: 'item-1',
          buyer_id: 'user-1',
          seller_id: 'seller-1',
          quantity: 2,
          total_price: 99.98,
          status: 'confirmed',
          shipping_address: '123 Main St, City, State 12345',
          notes: 'Please ring doorbell',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          item: {
            id: 'item-1',
            title: 'Premium Protein Powder',
            description: 'High quality whey protein',
            category: 'supplements',
            price: 49.99,
            currency: 'USD',
            images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'],
            seller_id: 'seller-1',
            is_available: true,
            is_featured: false,
            created_at: new Date().toISOString(),
          }
        },
        {
          id: '2',
          item_id: 'item-2',
          buyer_id: 'user-1',
          seller_id: 'seller-2',
          quantity: 1,
          total_price: 149.99,
          status: 'shipped',
          shipping_address: '123 Main St, City, State 12345',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          item: {
            id: 'item-2',
            title: 'Adjustable Dumbbells Set',
            description: 'Professional grade adjustable dumbbells',
            category: 'equipment',
            price: 149.99,
            currency: 'USD',
            images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'],
            seller_id: 'seller-2',
            is_available: true,
            is_featured: true,
            created_at: new Date().toISOString(),
          }
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrders();
  }, [loadOrders]);

  const handleOrderPress = useCallback((order: MarketplaceOrder) => {
    // Navigate to order details screen when implemented
    Alert.alert('Order Details', `Order ${order.id}\nStatus: ${order.status}`);
  }, []);

  const handleContactSeller = useCallback((order: MarketplaceOrder) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: order.seller_id }
    });
  }, []);

  const handleViewItem = useCallback((order: MarketplaceOrder) => {
    router.push(`/(tabs)/marketplace` as any);
  }, []);

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {orders.length > 0 ? (
          orders.map((order) => {
            const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Package;
            const statusColor = statusColors[order.status as keyof typeof statusColors] || '#6B7280';

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order)}
              >
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>Order #{order.id}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <StatusIcon size={16} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {getStatusLabel(order.status)}
                    </Text>
                  </View>
                </View>

                {/* Item Info */}
                {order.item && (
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{order.item.title}</Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemQuantity}>Quantity: {order.quantity}</Text>
                      <Text style={styles.itemPrice}>
                        {formatPrice(order.total_price, order.item.currency)}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Shipping Address */}
                {order.shipping_address && (
                  <View style={styles.shippingInfo}>
                    <Text style={styles.shippingLabel}>Shipping to:</Text>
                    <Text style={styles.shippingAddress}>{order.shipping_address}</Text>
                  </View>
                )}

                {/* Order Actions */}
                <View style={styles.orderActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewItem(order)}
                  >
                    <Package size={16} color="#6366F1" />
                    <Text style={styles.actionButtonText}>View Item</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleContactSeller(order)}
                  >
                    <MessageCircle size={16} color="#6366F1" />
                    <Text style={styles.actionButtonText}>Contact Seller</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Package size={64} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Your orders will appear here once you make a purchase.
            </Text>
            <TouchableOpacity 
              style={styles.browseButton} 
              onPress={() => router.push('/(tabs)/marketplace' as any)}
            >
              <Text style={styles.browseButtonText}>Start Shopping</Text>
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
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  shippingInfo: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  shippingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  shippingAddress: {
    fontSize: 14,
    color: '#111827',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6366F1',
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
