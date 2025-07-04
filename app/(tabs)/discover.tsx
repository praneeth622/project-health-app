import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Users, Star, MessageSquare, TrendingUp, Hash } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

const categories = ['All', 'Yoga', 'Weight Loss', 'Cardio', 'Strength', 'Running'];

const groups = [
  {
    id: 1,
    name: 'Morning Yoga Warriors',
    category: 'Yoga',
    members: 1247,
    location: 'New York, NY',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2',
    rating: 4.8,
    isPrivate: false,
  },
  {
    id: 2,
    name: 'Weight Loss Journey',
    category: 'Weight Loss',
    members: 892,
    location: 'Los Angeles, CA',
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2',
    rating: 4.6,
    isPrivate: false,
  },
  {
    id: 3,
    name: 'HIIT Enthusiasts',
    category: 'Cardio',
    members: 634,
    location: 'Chicago, IL',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2',
    rating: 4.9,
    isPrivate: true,
  },
];

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Discover Groups</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surfaceVariant }]}>
          <Filter size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}>
            <Search size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search groups, activities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Groups</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingContent}
          >
            {groups.slice(0, 2).map((group) => (
              <TouchableOpacity key={group.id} style={styles.trendingCard}>
                <Image source={{ uri: group.image }} style={styles.trendingImage} />
                <View style={styles.trendingOverlay}>
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingName}>{group.name}</Text>
                    <View style={styles.trendingMeta}>
                      <Users size={14} color="#FFFFFF" />
                      <Text style={styles.trendingMembers}>{group.members}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Groups</Text>
          <View style={styles.groupsList}>
            {groups.map((group) => (
              <TouchableOpacity key={group.id} style={styles.groupCard}>
                <Image source={{ uri: group.image }} style={styles.groupImage} />
                <View style={styles.groupInfo}>
                  <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <View style={styles.groupRating}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{group.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.groupCategory}>{group.category}</Text>
                  <View style={styles.groupMeta}>
                    <View style={styles.groupLocation}>
                      <MapPin size={14} color="#6B7280" />
                      <Text style={styles.locationText}>{group.location}</Text>
                    </View>
                    <View style={styles.groupMembers}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.membersText}>{group.members} members</Text>
                    </View>
                  </View>
                  {group.isPrivate && (
                    <View style={styles.privateTag}>
                      <Text style={styles.privateText}>Private</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  categoryButtonActive: {
    backgroundColor: '#2DD4BF',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  trendingContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  trendingCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  trendingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  trendingName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    flex: 1,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingMembers: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  groupsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  groupImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  groupRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  groupCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2DD4BF',
    marginBottom: 8,
  },
  groupMeta: {
    gap: 4,
  },
  groupLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  membersText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  privateTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  privateText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
});