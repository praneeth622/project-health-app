import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, MapPin, Calendar, Plus, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface InterestTag {
  id: string;
  name: string;
}

const fitnessInterests = [
  'Yoga', 'Running', 'Weightlifting', 'Swimming', 'Cycling', 'Pilates', 
  'CrossFit', 'Boxing', 'Dancing', 'Hiking', 'Tennis', 'Basketball',
  'Soccer', 'Martial Arts', 'Rock Climbing', 'Gymnastics'
];

const fitnessGoals = [
  'Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'Strength',
  'Wellness', 'Competition', 'Rehabilitation', 'Stress Relief', 'Fun'
];

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const [profileData, setProfileData] = useState({
    name: 'Linh Nguyen',
    bio: 'Fitness enthusiast | Yoga lover | Spreading positivity through wellness 🌟',
    location: 'San Francisco, CA',
    birthday: 'March 15, 1995',
    website: '',
    phoneNumber: '',
  });
  
  const [selectedInterests, setSelectedInterests] = useState<InterestTag[]>([
    { id: '1', name: 'Yoga' },
    { id: '2', name: 'Running' },
    { id: '3', name: 'Weightlifting' },
  ]);
  
  const [selectedGoals, setSelectedGoals] = useState<InterestTag[]>([
    { id: '1', name: 'Weight Loss' },
    { id: '2', name: 'Wellness' },
  ]);

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    router.back();
  };

  const toggleInterest = (interest: string) => {
    const exists = selectedInterests.find(item => item.name === interest);
    if (exists) {
      setSelectedInterests(selectedInterests.filter(item => item.name !== interest));
    } else {
      setSelectedInterests([...selectedInterests, { id: Date.now().toString(), name: interest }]);
    }
  };

  const toggleGoal = (goal: string) => {
    const exists = selectedGoals.find(item => item.name === goal);
    if (exists) {
      setSelectedGoals(selectedGoals.filter(item => item.name !== goal));
    } else {
      setSelectedGoals([...selectedGoals, { id: Date.now().toString(), name: goal }]);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    saveButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    saveButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
    },
    profileImageSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    coverPhotoContainer: {
      width: '100%',
      height: 120,
      borderRadius: 12,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    coverPhotoText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 8,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bioInput: {
      height: 80,
      textAlignVertical: 'top',
    },
    inputWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: {
      marginRight: 12,
    },
    textInput: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    tagChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tagText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    tagTextSelected: {
      color: colors.background,
    },
    selectedTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    selectedTag: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary,
      borderRadius: 16,
      gap: 6,
    },
    selectedTagText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.background,
    },
    removeTagButton: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    goalChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
    },
    goalChipSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    goalText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    goalTextSelected: {
      color: colors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color={colors.background} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.coverPhotoContainer}>
            <Camera size={32} color={colors.textSecondary} />
            <Text style={styles.coverPhotoText}>Add Cover Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={profileData.name}
              onChangeText={(text) => setProfileData({...profileData, name: text})}
              placeholder="Enter your name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profileData.bio}
              onChangeText={(text) => setProfileData({...profileData, bio: text})}
              placeholder="Tell others about yourself..."
              placeholderTextColor={colors.textTertiary}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={profileData.location}
                onChangeText={(text) => setProfileData({...profileData, location: text})}
                placeholder="Add your location"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Birthday</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={profileData.birthday}
                onChangeText={(text) => setProfileData({...profileData, birthday: text})}
                placeholder="Add your birthday"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website</Text>
            <TextInput
              style={styles.input}
              value={profileData.website}
              onChangeText={(text) => setProfileData({...profileData, website: text})}
              placeholder="Add your website"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* Fitness Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Goals</Text>
          
          {selectedGoals.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {selectedGoals.map((goal) => (
                <View key={goal.id} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{goal.name}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => toggleGoal(goal.name)}
                  >
                    <X size={10} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.tagsContainer}>
            {fitnessGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalChip,
                  selectedGoals.find(item => item.name === goal) && styles.goalChipSelected
                ]}
                onPress={() => toggleGoal(goal)}
              >
                <Text style={[
                  styles.goalText,
                  selectedGoals.find(item => item.name === goal) && styles.goalTextSelected
                ]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          
          {selectedInterests.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {selectedInterests.map((interest) => (
                <View key={interest.id} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{interest.name}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => toggleInterest(interest.name)}
                  >
                    <X size={10} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.tagsContainer}>
            {fitnessInterests.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.tagChip,
                  selectedInterests.find(item => item.name === interest) && styles.tagChipSelected
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.tagText,
                  selectedInterests.find(item => item.name === interest) && styles.tagTextSelected
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
