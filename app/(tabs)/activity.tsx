import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserHeader from '@/components/UserHeader';
import CircularProgress from '@/components/CircularProgress';
import { MapPin, Trophy, Medal, Award } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ActivityScreen() {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <UserHeader userName="Linh" date="Thursday, 08 July" showMore />
        
        {/* Steps Challenge */}
        <View style={[styles.challengeCard, { backgroundColor: colors.surface }]}>
          <View style={styles.challengeHeader}>
            <View style={[styles.challengeIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.challengeEmoji}>👟</Text>
            </View>
            <Text style={[styles.challengeTitle, { color: colors.text }]}>Steps 2,000+</Text>
          </View>
          <Text style={[styles.challengeSubtitle, { color: colors.text }]}>Let's keep going</Text>
          <Text style={[styles.challengeDescription, { color: colors.textSecondary }]}>Keep participating in weekly challenges</Text>
        </View>

        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <CircularProgress
            size={200}
            progress={75}
            strokeWidth={8}
            color="#FF6B82"
          >
            <View style={styles.progressContent}>
              <Text style={styles.progressValue}>2900</Text>
              <Text style={styles.progressLabel}>Kcal</Text>
            </View>
          </CircularProgress>
        </View>

        {/* Location Info */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#6B7280" />
            <Text style={styles.locationText}>Ottawa, Canada</Text>
          </View>
          <View style={styles.locationStats}>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatValue}>12,456</Text>
              <Text style={styles.locationStatLabel}>Active Today</Text>
            </View>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatValue}>Oct 12,456</Text>
              <Text style={styles.locationStatLabel}>Active Today</Text>
            </View>
          </View>
        </View>

        {/* Awards Section */}
        <View style={styles.awardsContainer}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <Text style={styles.sectionSubtitle}>You've earned 4/10 of all Rewards.</Text>
          
          <View style={styles.awardsGrid}>
            <View style={[styles.awardCard, styles.awardActive]}>
              <Trophy size={24} color="#FFFFFF" />
              <Text style={styles.awardTitle}>7-Workout Week</Text>
              <Text style={styles.awardSubtitle}>Week</Text>
            </View>
            <View style={[styles.awardCard, styles.awardActive]}>
              <Medal size={24} color="#FFFFFF" />
              <Text style={styles.awardTitle}>Move Goal 200%</Text>
              <Text style={styles.awardSubtitle}>Record</Text>
            </View>
            <View style={[styles.awardCard, styles.awardActive]}>
              <Award size={24} color="#FFFFFF" />
              <Text style={styles.awardTitle}>New Move Record</Text>
              <Text style={styles.awardSubtitle}>Move Str</Text>
            </View>
            <View style={styles.awardCard}>
              <Trophy size={24} color="#D1D5DB" />
              <Text style={[styles.awardTitle, styles.awardInactive]}>Longest Move Str</Text>
              <Text style={[styles.awardSubtitle, styles.awardInactive]}>Move Str</Text>
            </View>
          </View>
        </View>

        {/* Week Winner */}
        <View style={styles.winnerContainer}>
          <Text style={styles.sectionTitle}>Week winner</Text>
          <View style={styles.winnerCard}>
            <View style={styles.winnerInfo}>
              <View style={styles.winnerAvatar}>
                <Text style={styles.winnerInitials}>AO</Text>
              </View>
              <View style={styles.winnerDetails}>
                <Text style={styles.winnerName}>Alfred Owen</Text>
                <Text style={styles.winnerStats}>8 workouts</Text>
              </View>
            </View>
            <View style={styles.winnerTime}>
              <Text style={styles.winnerTimeText}>⏱️ 4h 20 min</Text>
            </View>
          </View>
        </View>

        {/* Your Route */}
        <View style={styles.routeContainer}>
          <Text style={styles.sectionTitle}>Your rute</Text>
          <View style={styles.routeCard}>
            <View style={styles.routeMap}>
              <View style={styles.routeMapPlaceholder}>
                <View style={styles.routePoint} />
                <View style={styles.routePath} />
              </View>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeDistance}>20.4 km</Text>
              <Text style={styles.routeCalories}>620.68 Kcal</Text>
            </View>
          </View>
        </View>

        {/* Join Button */}
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  challengeCard: {
    backgroundColor: '#FFF7ED',
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B82',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeEmoji: {
    fontSize: 16,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  challengeSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  locationCard: {
    backgroundColor: '#F9FAFB',
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationStat: {
    alignItems: 'center',
  },
  locationStatValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  locationStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  awardsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  awardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  awardCard: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  awardActive: {
    backgroundColor: '#FF6B82',
  },
  awardTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  awardSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  awardInactive: {
    color: '#9CA3AF',
  },
  winnerContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  winnerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B82',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  winnerInitials: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  winnerDetails: {
    justifyContent: 'center',
  },
  winnerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  winnerStats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  winnerTime: {
    alignItems: 'flex-end',
  },
  winnerTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  routeContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  routeCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeMap: {
    flex: 1,
    height: 60,
    marginRight: 16,
  },
  routeMapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  routePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B82',
  },
  routePath: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: '#FF6B82',
    top: 15,
    borderRadius: 1,
  },
  routeInfo: {
    alignItems: 'flex-end',
  },
  routeDistance: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  routeCalories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  joinButton: {
    backgroundColor: '#FF6B82',
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});