import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Hash,
  Globe,
  Users,
  Lock,
  Target,
  Trophy,
  Dumbbell,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { PostsService, PostType, PostPrivacy as PostVisibility, CreatePostRequest } from '@/services/postsService';

interface WorkoutData {
  workout_id: string;
  workout_name: string;
  duration_minutes: number;
  calories_burned?: number;
}

interface AchievementData {
  achievement_type: string;
  title: string;
  description: string;
  value?: number;
  unit: string;
}

interface HealthData {
  metric_type: string;
  value: number;
  unit: string;
}

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const [postData, setPostData] = useState({
    content: '',
    type: 'text' as PostType,
    privacy: 'public' as PostVisibility, // We'll convert this to visibility when sending the request
  });
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    workout_id: '',
    workout_name: '',
    duration_minutes: 0,
    calories_burned: undefined,
  });
  const [achievementData, setAchievementData] = useState<AchievementData>({
    achievement_type: '',
    title: '',
    description: '',
    value: undefined,
    unit: '',
  });
  const [healthData, setHealthData] = useState<HealthData>({
    metric_type: '',
    value: 0,
    unit: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!postData.content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    if (postData.type === 'workout' && (!workoutData.workout_name.trim() || workoutData.duration_minutes <= 0)) {
      Alert.alert('Error', 'Please provide workout name and duration for your workout');
      return;
    }

    if (postData.type === 'health' && (!healthData.metric_type.trim() || !healthData.value || !healthData.unit.trim())) {
      Alert.alert('Error', 'Please provide metric type, value, and unit for your health post');
      return;
    }

    try {
      setSubmitting(true);

      const postPayload = {
        ...postData,
        content: postData.content.trim(),
        visibility: postData.privacy as PostVisibility || 'public', // Use visibility instead of privacy
        ...(tags.length > 0 && { tags }),
        media_urls: [], // Initialize with empty array
        metadata: {
          ...(location.trim() && { location: location.trim() })
        },
        ...(postData.type === 'workout' && { 
          workout_data: workoutData,
          metadata: {
            workout_type: workoutData.workout_name,
            duration_minutes: workoutData.duration_minutes,
            calories_burned: workoutData.calories_burned
          }
        }),
        ...(postData.type === 'health' && { 
          health_data: healthData,
          metadata: {
            metric_type: healthData.metric_type,
            value: healthData.value,
            unit: healthData.unit
          }
        }),
      };

      await PostsService.createPost(postPayload);
      
      Alert.alert('Success', 'Your post has been created!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const getPrivacyIcon = (privacy: PostVisibility) => {
    switch (privacy) {
      case 'public':
        return <Globe size={16} color={colors.success} />;
      case 'friends':
        return <Users size={16} color={colors.warning} />;
      case 'private':
        return <Lock size={16} color={colors.error} />;
      default:
        return <Globe size={16} color={colors.success} />;
    }
  };

  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case 'workout':
        return <Target size={20} color={colors.primary} />;
      case 'health':
        return <Trophy size={20} color={colors.warning} />;
      case 'image':
        return <Camera size={20} color={colors.success} />;
      default:
        return <Hash size={20} color={colors.textSecondary} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>
        <TouchableOpacity
          style={[styles.publishButton, !postData.content.trim() && styles.publishButtonDisabled]}
          onPress={handleCreatePost}
          disabled={!postData.content.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={[styles.publishButtonText, { color: colors.surface }]}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Type Selector */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Post Type</Text>
          <View style={styles.postTypeContainer}>
            {(['text', 'image', 'workout', 'health'] as PostType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.postTypeButton,
                  { borderColor: colors.border },
                  postData.type === type && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setPostData(prev => ({ ...prev, type }))}
              >
                {getPostTypeIcon(type)}
                <Text style={[
                  styles.postTypeText,
                  { color: postData.type === type ? colors.surface : colors.text }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content Input */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.contentInput, { color: colors.text, borderColor: colors.border }]}
            value={postData.content}
            onChangeText={(text) => setPostData(prev => ({ ...prev, content: text }))}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textTertiary}
            multiline
            autoFocus
          />
        </View>

        {/* Workout Data Section */}
        {postData.type === 'workout' && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Workout Details</Text>
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={workoutData.workout_name}
              onChangeText={(text) => setWorkoutData(prev => ({ ...prev, workout_name: text }))}
              placeholder="Workout name (e.g., Morning Run, Yoga Session)"
              placeholderTextColor={colors.textTertiary}
            />

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={workoutData.workout_id}
              onChangeText={(text) => setWorkoutData(prev => ({ ...prev, workout_id: text }))}
              placeholder="Workout ID (optional)"
              placeholderTextColor={colors.textTertiary}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.inputHalf, { color: colors.text, borderColor: colors.border }]}
                value={workoutData.duration_minutes.toString()}
                onChangeText={(text) => setWorkoutData(prev => ({ 
                  ...prev, 
                  duration_minutes: text ? parseInt(text, 10) || 0 : 0 
                }))}
                placeholder="Duration (mins)"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.inputHalf, { color: colors.text, borderColor: colors.border }]}
                value={workoutData.calories_burned?.toString() || ''}
                onChangeText={(text) => setWorkoutData(prev => ({ 
                  ...prev, 
                  calories_burned: text ? parseInt(text, 10) : undefined 
                }))}
                placeholder="Calories (optional)"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {/* Health Data Section */}
        {postData.type === 'health' && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Metrics</Text>
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={healthData.metric_type}
              onChangeText={(text) => setHealthData(prev => ({ ...prev, metric_type: text }))}
              placeholder="Metric type (e.g., Weight, Blood Pressure, Steps)"
              placeholderTextColor={colors.textTertiary}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.inputHalf, { color: colors.text, borderColor: colors.border }]}
                value={healthData.value.toString()}
                onChangeText={(text) => setHealthData(prev => ({ 
                  ...prev, 
                  value: text ? parseFloat(text) || 0 : 0 
                }))}
                placeholder="Value"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.inputHalf, { color: colors.text, borderColor: colors.border }]}
                value={healthData.unit}
                onChangeText={(text) => setHealthData(prev => ({ ...prev, unit: text }))}
                placeholder="Unit (kg, mmHg, etc.)"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>
        )}

        {/* Location */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.locationInput, { color: colors.text }]}
              value={location}
              onChangeText={setLocation}
              placeholder="Add location (optional)"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* Tags */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
          
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.tagText, { color: colors.surface }]}>#{tag}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => handleRemoveTag(tag)}
                  >
                    <X size={12} color={colors.surface} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Hash size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.tagInput, { color: colors.text }]}
              value={currentTag}
              onChangeText={setCurrentTag}
              placeholder="Add tags"
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.addTagButton, { backgroundColor: colors.primary }]}
              onPress={handleAddTag}
            >
              <Text style={[styles.addTagButtonText, { color: colors.surface }]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy</Text>
          <View style={styles.privacyContainer}>
            {(['public', 'friends', 'private'] as PostVisibility[]).map((privacy) => (
              <TouchableOpacity
                key={privacy}
                style={[
                  styles.privacyButton,
                  { borderColor: colors.border },
                  postData.privacy === privacy && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setPostData(prev => ({ ...prev, privacy }))}
              >
                {getPrivacyIcon(privacy)}
                <Text style={[
                  styles.privacyText,
                  { color: postData.privacy === privacy ? colors.surface : colors.text }
                ]}>
                  {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Media Options */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Media</Text>
          <TouchableOpacity
            style={[styles.mediaButton, { borderColor: colors.border }]}
            onPress={() => Alert.alert('Coming Soon', 'Image upload will be implemented')}
          >
            <Camera size={20} color={colors.textSecondary} />
            <Text style={[styles.mediaButtonText, { color: colors.textSecondary }]}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  postTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  postTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 20,
  },
  postTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
  },
  addTagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addTagButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeTagButton: {
    padding: 2,
  },
  privacyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 16,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
