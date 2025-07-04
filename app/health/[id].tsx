import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Edit2,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  User,
  Activity, 
  Droplets, 
  Footprints, 
  Scale, 
  Moon
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import HealthLogsService, { HealthLog, UpdateHealthLogRequest } from '@/services/healthLogsService';

const getHealthMetricIcon = (type: string) => {
  switch (type) {
    case 'steps': return Footprints;
    case 'water': return Droplets;
    case 'exercise': return Activity;
    case 'weight': return Scale;
    case 'sleep': return Moon;
    default: return Activity;
  }
};

const getHealthMetricColor = (type: string) => {
  switch (type) {
    case 'steps': return '#4ECDC4';
    case 'water': return '#3B82F6';
    case 'exercise': return '#F59E0B';
    case 'weight': return '#8B5CF6';
    case 'sleep': return '#6B7280';
    default: return '#4ECDC4';
  }
};

const getHealthMetricLabel = (type: string) => {
  switch (type) {
    case 'steps': return 'Steps';
    case 'water': return 'Water Intake';
    case 'exercise': return 'Exercise Duration';
    case 'weight': return 'Weight';
    case 'sleep': return 'Sleep Duration';
    default: return 'Health Metric';
  }
};

export default function HealthLogDetailScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const logId = params.id as string;
  
  const [healthLog, setHealthLog] = useState<HealthLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHealthLog();
  }, [logId]);

  const loadHealthLog = async () => {
    try {
      setLoading(true);
      const log = await HealthLogsService.getHealthLogById(logId);
      if (log) {
        setHealthLog(log);
        setEditValue(log.value.toString());
        setEditNotes(log.notes || '');
      } else {
        Alert.alert('Error', 'Health log not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Failed to load health log:', error);
      Alert.alert('Error', 'Failed to load health log', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (healthLog) {
      setEditValue(healthLog.value.toString());
      setEditNotes(healthLog.notes || '');
    }
  };

  const handleSaveEdit = async () => {
    if (!healthLog || !editValue || isNaN(Number(editValue))) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    setSaving(true);
    try {
      const updateData: UpdateHealthLogRequest = {
        value: Number(editValue),
        notes: editNotes.trim() || undefined
      };

      const updatedLog = await HealthLogsService.updateHealthLog(healthLog.id, updateData);
      if (updatedLog) {
        setHealthLog(updatedLog);
        setIsEditing(false);
        Alert.alert('Success', 'Health log updated successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update health log');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Health Log',
      'Are you sure you want to delete this health log? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDelete
        }
      ]
    );
  };

  const confirmDelete = async () => {
    if (!healthLog) return;

    try {
      await HealthLogsService.deleteHealthLog(healthLog.id);
      Alert.alert('Success', 'Health log deleted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete health log');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      backgroundColor: colors.surfaceVariant,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editButton: {
      backgroundColor: colors.primary,
    },
    deleteButton: {
      backgroundColor: '#EF4444',
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.surfaceVariant,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      padding: 20,
    },
    metricHeader: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      alignItems: 'center',
    },
    metricIcon: {
      marginBottom: 12,
    },
    metricType: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    metricValue: {
      fontSize: 32,
      fontFamily: 'Inter-Black',
      marginBottom: 4,
    },
    metricUnit: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    section: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoIcon: {
      marginRight: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    infoLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    editInput: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editInputFocused: {
      borderColor: colors.primary,
    },
    notesInput: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    noNotes: {
      fontStyle: 'italic',
      color: colors.textSecondary,
    },
    editActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    editActionButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    editActionButtonSecondary: {
      backgroundColor: colors.surfaceVariant,
    },
    editActionText: {
      color: '#FFFFFF',
      fontFamily: 'Inter-SemiBold',
      marginLeft: 4,
    },
    editActionTextSecondary: {
      color: colors.text,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Health Log</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!healthLog) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Health Log</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.textSecondary }}>Health log not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const IconComponent = getHealthMetricIcon(healthLog.type);
  const metricColor = getHealthMetricColor(healthLog.type);
  const metricLabel = getHealthMetricLabel(healthLog.type);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Log</Text>
        </View>
        
        {!isEditing && (
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
            >
              <Edit2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Trash2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {isEditing && (
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveEdit}
              disabled={saving}
            >
              <Save size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelEdit}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContent}>
          {/* Metric Display */}
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <IconComponent size={48} color={metricColor} />
            </View>
            <Text style={styles.metricType}>{metricLabel}</Text>
            {isEditing ? (
              <TextInput
                style={[styles.editInput, { fontSize: 32, textAlign: 'center' }]}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="numeric"
                placeholder="Enter value"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={[styles.metricValue, { color: metricColor }]}>
                {healthLog.value.toLocaleString()}
              </Text>
            )}
            <Text style={styles.metricUnit}>{healthLog.unit}</Text>
          </View>

          {/* Log Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Log Information</Text>
            
            <View style={styles.infoRow}>
              <Calendar size={20} color={colors.textSecondary} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoText}>{formatDate(healthLog.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Clock size={20} color={colors.textSecondary} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Time Logged</Text>
                <Text style={styles.infoText}>{formatTime(healthLog.created_at)}</Text>
              </View>
            </View>

            {healthLog.updated_at && healthLog.updated_at !== healthLog.created_at && (
              <View style={styles.infoRow}>
                <Edit2 size={20} color={colors.textSecondary} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Last Updated</Text>
                  <Text style={styles.infoText}>{formatTime(healthLog.updated_at)}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {isEditing ? (
              <TextInput
                style={styles.notesInput}
                value={editNotes}
                onChangeText={setEditNotes}
                placeholder="Add notes about this entry..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={[
                styles.infoText,
                !healthLog.notes && styles.noNotes
              ]}>
                {healthLog.notes || 'No notes added'}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
