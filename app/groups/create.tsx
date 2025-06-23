import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Globe, Users, Lock, MapPin, Hash } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

type GroupVisibility = 'public' | 'private' | 'secret';
type GroupCategory = 'fitness' | 'yoga' | 'running' | 'cycling' | 'weightlifting' | 'sports' | 'wellness' | 'nutrition';

const categories = [
  { id: 'fitness', name: 'General Fitness', icon: '💪' },
  { id: 'yoga', name: 'Yoga & Mindfulness', icon: '🧘‍♀️' },
  { id: 'running', name: 'Running & Cardio', icon: '🏃‍♂️' },
  { id: 'cycling', name: 'Cycling', icon: '🚴‍♀️' },
  { id: 'weightlifting', name: 'Weightlifting', icon: '🏋️‍♂️' },
  { id: 'sports', name: 'Sports & Games', icon: '⚽' },
  { id: 'wellness', name: 'Health & Wellness', icon: '🌱' },
  { id: 'nutrition', name: 'Nutrition & Diet', icon: '🥗' },
];

export default function CreateGroupScreen() {
  const { colors } = useTheme();
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    location: '',
    rules: '',
    tags: '',
  });
  const [visibility, setVisibility] = useState<GroupVisibility>('public');
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory>('fitness');
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const handleCreate = () => {
    if (!groupData.name.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    if (!groupData.description.trim()) {
      Alert.alert('Error', 'Please enter a group description');
      return;
    }
    
    Alert.alert('Success', 'Group created successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const getVisibilityIcon = (vis: GroupVisibility) => {
    switch (vis) {
      case 'public':
        return <Globe size={20} color={visibility === vis ? colors.background : colors.textSecondary} />;
      case 'private':
        return <Users size={20} color={visibility === vis ? colors.background : colors.textSecondary} />;
      case 'secret':
        return <Lock size={20} color={visibility === vis ? colors.background : colors.textSecondary} />;
    }
  };

  const getVisibilityDescription = (vis: GroupVisibility) => {
    switch (vis) {
      case 'public':
        return 'Anyone can see the group, its members, and their posts';
      case 'private':
        return 'Anyone can see the group, but only members can see posts';
      case 'secret':
        return 'Only members can see the group and its posts';
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
    createButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    createButtonDisabled: {
      opacity: 0.5,
    },
    createButtonText: {
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
    coverImageContainer: {
      width: '100%',
      height: 160,
      borderRadius: 12,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    coverImage: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    coverImagePlaceholder: {
      alignItems: 'center',
    },
    coverImageText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 8,
    },
    coverImageSubtext: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      marginTop: 4,
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
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    rulesArea: {
      height: 120,
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
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    categoryCard: {
      width: '47%',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    categoryCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    categoryIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    categoryName: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      textAlign: 'center',
    },
    visibilityOptions: {
      gap: 12,
    },
    visibilityOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    visibilityOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    visibilityIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    visibilityIconContainerUnselected: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    visibilityContent: {
      flex: 1,
    },
    visibilityTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
      textTransform: 'capitalize',
    },
    visibilityDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    tagsHint: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      marginTop: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
        <TouchableOpacity 
          style={[
            styles.createButton, 
            (!groupData.name.trim() || !groupData.description.trim()) && styles.createButtonDisabled
          ]} 
          onPress={handleCreate}
          disabled={!groupData.name.trim() || !groupData.description.trim()}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cover Image</Text>
          <TouchableOpacity 
            style={styles.coverImageContainer}
            onPress={() => Alert.alert('Coming Soon', 'Image picker will be implemented')}
          >
            {coverImage ? (
              <Image source={{ uri: coverImage }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverImagePlaceholder}>
                <Camera size={32} color={colors.textSecondary} />
                <Text style={styles.coverImageText}>Add Cover Image</Text>
                <Text style={styles.coverImageSubtext}>Recommended: 1200x600px</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Group Name *</Text>
            <TextInput
              style={styles.input}
              value={groupData.name}
              onChangeText={(text) => setGroupData({...groupData, name: text})}
              placeholder="Enter group name"
              placeholderTextColor={colors.textTertiary}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={groupData.description}
              onChangeText={(text) => setGroupData({...groupData, description: text})}
              placeholder="Describe what your group is about..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={500}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={groupData.location}
                onChangeText={(text) => setGroupData({...groupData, location: text})}
                placeholder="Add location (optional)"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tags</Text>
            <View style={styles.inputWithIcon}>
              <Hash size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={groupData.tags}
                onChangeText={(text) => setGroupData({...groupData, tags: text})}
                placeholder="Add tags separated by commas"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <Text style={styles.tagsHint}>e.g., yoga, meditation, beginner-friendly</Text>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected
                ]}
                onPress={() => setSelectedCategory(category.id as GroupCategory)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.visibilityOptions}>
            {(['public', 'private', 'secret'] as GroupVisibility[]).map((vis) => (
              <TouchableOpacity
                key={vis}
                style={[
                  styles.visibilityOption,
                  visibility === vis && styles.visibilityOptionSelected
                ]}
                onPress={() => setVisibility(vis)}
              >
                <View style={[
                  styles.visibilityIconContainer,
                  visibility !== vis && styles.visibilityIconContainerUnselected
                ]}>
                  {getVisibilityIcon(vis)}
                </View>
                <View style={styles.visibilityContent}>
                  <Text style={styles.visibilityTitle}>{vis}</Text>
                  <Text style={styles.visibilityDescription}>
                    {getVisibilityDescription(vis)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Rules</Text>
          <TextInput
            style={[styles.input, styles.rulesArea]}
            value={groupData.rules}
            onChangeText={(text) => setGroupData({...groupData, rules: text})}
            placeholder="Set community guidelines and rules for your group..."
            placeholderTextColor={colors.textTertiary}
            multiline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
