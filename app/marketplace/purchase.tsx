import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard, MapPin, MessageCircle } from 'lucide-react-native';

import MarketplaceService, { MarketplaceItem, CreateOrderRequest } from '@/services/marketplaceService';

interface OrderForm {
  quantity: number;
  shippingAddress: string;
  notes: string;
}

export default function PurchaseScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    quantity: 1,
    shippingAddress: '',
    notes: '',
  });

  useEffect(() => {
    if (itemId) {
      loadItem();
    }
  }, [itemId]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const itemData = await MarketplaceService.getItemById(itemId!);
      setItem(itemData);
    } catch (error) {
      console.error('Failed to load item:', error);
      Alert.alert('Error', 'Failed to load item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof OrderForm, value: string | number) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotal = () => {
    if (!item) return 0;
    return item.price * orderForm.quantity;
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const handleSubmitOrder = async () => {
    if (!item) return;

    if (!orderForm.shippingAddress.trim()) {
      Alert.alert('Error', 'Please enter a shipping address.');
      return;
    }

    if (orderForm.quantity <= 0) {
      Alert.alert('Error', 'Quantity must be greater than 0.');
      return;
    }

    try {
      setSubmitting(true);

      const orderData: CreateOrderRequest = {
        item_id: item.id,
        quantity: orderForm.quantity,
        shipping_address: orderForm.shippingAddress.trim(),
        notes: orderForm.notes.trim() || undefined,
      };

      const order = await MarketplaceService.createOrder(orderData);

      Alert.alert(
        'Order Placed!',
        'Your order has been placed successfully. The seller will be notified.',
        [
          {
            text: 'View Orders',
            onPress: () => router.replace('/(tabs)/marketplace' as any)
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.replace('/(tabs)/marketplace' as any)
          }
        ]
      );
    } catch (error: any) {
      console.error('Failed to create order:', error);
      Alert.alert('Error', error.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSeller = () => {
    if (!item?.seller) return;
    router.push({
      pathname: '/chat/[id]',
      params: { id: item.seller.id }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Item not found</Text>
        <Text style={styles.errorSubtitle}>The requested item could not be found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>Purchase Item</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Item Summary */}
        <View style={styles.itemSummary}>
          <Text style={styles.sectionTitle}>Item Summary</Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPrice}>{formatPrice(item.price, item.currency)} each</Text>
            <Text style={styles.itemCategory}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateForm('quantity', Math.max(1, orderForm.quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{orderForm.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateForm('quantity', orderForm.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressInputContainer}>
            <MapPin size={20} color="#6B7280" />
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your full shipping address..."
              value={orderForm.shippingAddress}
              onChangeText={(text) => updateForm('shippingAddress', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special instructions or notes for the seller..."
            value={orderForm.notes}
            onChangeText={(text) => updateForm('notes', text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Seller Info */}
        {item.seller && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{item.seller.name}</Text>
              {item.seller.verified && (
                <Text style={styles.verifiedText}>✓ Verified Seller</Text>
              )}
              <TouchableOpacity style={styles.contactSellerButton} onPress={handleContactSeller}>
                <MessageCircle size={16} color="#6366F1" />
                <Text style={styles.contactSellerText}>Contact Seller</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order Total */}
        <View style={styles.totalSection}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal ({orderForm.quantity} item{orderForm.quantity > 1 ? 's' : ''})</Text>
            <Text style={styles.totalValue}>{formatPrice(calculateTotal(), item.currency)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>Contact seller</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatPrice(calculateTotal(), item.currency)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.placeOrderButton, submitting && styles.placeOrderButtonDisabled]}
          onPress={handleSubmitOrder}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <CreditCard size={20} color="#FFF" />
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  itemSummary: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  itemInfo: {
    paddingVertical: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: '#6366F1',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  addressInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  addressInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    minHeight: 60,
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sellerInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginBottom: 12,
  },
  contactSellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  contactSellerText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  totalSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  bottomActions: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeOrderButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  placeOrderButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
