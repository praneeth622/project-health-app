import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { Search, Filter, X, DollarSign, MapPin, Tag } from 'lucide-react-native';
import { MarketplaceCategory, ItemCondition, MarketplaceFilters } from '@/services/marketplaceService';

interface MarketplaceSearchProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: MarketplaceFilters) => void;
  currentFilters: MarketplaceFilters;
}

const categories: { value: MarketplaceCategory; label: string }[] = [
  { value: 'supplements', label: 'Supplements' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'services', label: 'Services' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'programs', label: 'Programs' },
  { value: 'accessories', label: 'Accessories' },
];

const conditions: { value: ItemCondition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

export default function MarketplaceSearch({
  onSearch,
  onFiltersChange,
  currentFilters,
}: MarketplaceSearchProps) {
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<MarketplaceFilters>(currentFilters);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: MarketplaceFilters = {};
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setShowFilters(false);
  };

  const updateFilter = (key: keyof MarketplaceFilters, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.category) count++;
    if (currentFilters.condition) count++;
    if (currentFilters.min_price || currentFilters.max_price) count++;
    if (currentFilters.location) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search marketplace..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={activeFiltersCount > 0 ? "#FFF" : "#6B7280"} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeFiltersContainer}
          contentContainerStyle={styles.activeFiltersContent}
        >
          {currentFilters.category && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                {categories.find(c => c.value === currentFilters.category)?.label}
              </Text>
              <TouchableOpacity onPress={() => updateFilter('category', undefined)}>
                <X size={14} color="#6366F1" />
              </TouchableOpacity>
            </View>
          )}
          
          {currentFilters.condition && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                {conditions.find(c => c.value === currentFilters.condition)?.label}
              </Text>
              <TouchableOpacity onPress={() => updateFilter('condition', undefined)}>
                <X size={14} color="#6366F1" />
              </TouchableOpacity>
            </View>
          )}
          
          {(currentFilters.min_price || currentFilters.max_price) && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                ${currentFilters.min_price || 0} - ${currentFilters.max_price || '∞'}
              </Text>
              <TouchableOpacity onPress={() => {
                updateFilter('min_price', undefined);
                updateFilter('max_price', undefined);
              }}>
                <X size={14} color="#6366F1" />
              </TouchableOpacity>
            </View>
          )}
          
          {currentFilters.location && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{currentFilters.location}</Text>
              <TouchableOpacity onPress={() => updateFilter('location', undefined)}>
                <X size={14} color="#6366F1" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={handleClearFilters}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      style={[
                        styles.filterOption,
                        tempFilters.category === category.value && styles.filterOptionActive,
                      ]}
                      onPress={() => updateFilter('category', 
                        tempFilters.category === category.value ? undefined : category.value
                      )}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          tempFilters.category === category.value && styles.filterOptionTextActive,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Condition Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Condition</Text>
              <View style={styles.filterOptionsGrid}>
                {conditions.map((condition) => (
                  <TouchableOpacity
                    key={condition.value}
                    style={[
                      styles.filterOption,
                      tempFilters.condition === condition.value && styles.filterOptionActive,
                    ]}
                    onPress={() => updateFilter('condition',
                      tempFilters.condition === condition.value ? undefined : condition.value
                    )}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.condition === condition.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {condition.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Price Range</Text>
              <View style={styles.priceInputContainer}>
                <View style={styles.priceInput}>
                  <DollarSign size={16} color="#6B7280" />
                  <TextInput
                    style={styles.priceInputField}
                    placeholder="Min"
                    value={tempFilters.min_price?.toString() || ''}
                    onChangeText={(text) => updateFilter('min_price', text ? parseFloat(text) : undefined)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <Text style={styles.priceSeparator}>to</Text>
                <View style={styles.priceInput}>
                  <DollarSign size={16} color="#6B7280" />
                  <TextInput
                    style={styles.priceInputField}
                    placeholder="Max"
                    value={tempFilters.max_price?.toString() || ''}
                    onChangeText={(text) => updateFilter('max_price', text ? parseFloat(text) : undefined)}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Location Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Location</Text>
              <View style={styles.locationInputContainer}>
                <MapPin size={16} color="#6B7280" />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter location..."
                  value={tempFilters.location || ''}
                  onChangeText={(text) => updateFilter('location', text || undefined)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#6366F1',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFiltersContainer: {
    marginBottom: 8,
  },
  activeFiltersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearButton: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#FFF',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  priceInputField: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  priceSeparator: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
