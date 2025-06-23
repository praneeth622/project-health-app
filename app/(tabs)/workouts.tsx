import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Filter, Play, Calendar, Users } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const workoutCategories = [
  { id: 1, name: 'Bicep', participants: 120, level: 'Beginner' },
  { id: 2, name: 'Body-Back', participants: 95, level: 'Intermediate' },
  { id: 3, name: 'Body-Butt', participants: 87, level: 'Advanced' },
  { id: 4, name: 'Legs and Core', participants: 156, level: 'Beginner' },
  { id: 5, name: 'Pectoral machine', participants: 78, level: 'Intermediate' },
  { id: 6, name: 'Legs & Core', participants: 143, level: 'Advanced' },
  { id: 7, name: 'Weight bench', participants: 92, level: 'Beginner' },
  { id: 8, name: 'Weight loss', participants: 234, level: 'All Levels' },
  { id: 9, name: 'Woman up front', participants: 67, level: 'Intermediate' },
];




const workoutTypes = [
  { name: 'Upper Body', icon: '💪' },
  { name: 'Middle Body', icon: '🏋️' },
  { name: 'Lower Body', icon: '🦵' },
];

export default function WorkoutsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workouts</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Join Community Card */}
        <View style={styles.communityCard}>
          <View style={styles.communityIcon}>
            <Users size={32} color="#FF6B82" />
          </View>
          <Text style={styles.communityTitle}>Join the Community</Text>
          <Text style={styles.communityDescription}>
            Our community of experts will help you achieve your goals
          </Text>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>

        {/* Get Started Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Started</Text>
          
          {/* Workout Categories List */}
          {workoutCategories.map((workout) => (
            <TouchableOpacity key={workout.id} style={styles.workoutItem}>
              <View style={styles.workoutIcon}>
                <Play size={16} color="#FF6B82" />
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutLevel}>{workout.level}</Text>
              </View>
              <View style={styles.workoutStats}>
                <Text style={styles.workoutParticipants}>{workout.participants}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Workout Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.typesContainer}>
            {workoutTypes.map((type, index) => (
              <TouchableOpacity key={index} style={styles.typeCard}>
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={styles.typeName}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Level Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level</Text>
          <View style={styles.levelContainer}>
            <TouchableOpacity style={[styles.levelButton, styles.levelActive]}>
              <Text style={[styles.levelText, styles.levelActiveText]}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.levelButton}>
              <Text style={styles.levelText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.levelButton}>
              <Text style={styles.levelText}>Advanced</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>⭐</Text>
              <Text style={styles.categoryName}>Special</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>🏖️</Text>
              <Text style={styles.categoryName}>Beach Rea...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>💪</Text>
              <Text style={styles.categoryName}>Full - Body</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>🏆</Text>
              <Text style={styles.categoryName}>Challenge</Text>
            </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
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
  communityCard: {
    backgroundColor: '#FFF7ED',
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  communityIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  communityTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  communityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: '#FF6B82',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  workoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  workoutLevel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  workoutStats: {
    alignItems: 'flex-end',
  },
  workoutParticipants: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF6B82',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    textAlign: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 4,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  levelActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  levelActiveText: {
    color: '#111827',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FF6B82',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});