import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Save,
  Activity, 
  Droplets, 
  Footprints, 
  Scale, 
  Moon
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import HealthLogsService, { CreateHealthLogRequest } from '@/services/healthLogsService';

const healthMetrics = [
  {
    type: 'steps' as const,
    icon: Footprints,
    label: 'Steps',
    color: '#4ECDC4',
    unit: 'steps',
    placeholder: 'Enter steps count',
    examples: ['5000', '10000', '15000']
  },
  {
    type: 'water' as const,
    icon: Droplets,
    label: 'Water Intake',
    color: '#3B82F6',
    unit: 'glasses',
    placeholder: 'Enter glasses of water',
    examples: ['4', '6', '8']
  },
  {
    type: 'exercise' as const,
    icon: Activity,
    label: 'Exercise Duration',
    color: '#F59E0B',
    unit: 'minutes',
    placeholder: 'Enter exercise duration',
    examples: ['30', '45', '60']
  },
  {
    type: 'weight' as const,
    icon: Scale,
    label: 'Weight',
    color: '#8B5CF6',
    unit: 'kg',
    placeholder: 'Enter weight',
    examples: ['65.5', '70.2', '68.8']
  },
  {
    type: 'sleep' as const,
    icon: Moon,
    label: 'Sleep Duration',
    color: '#6B7280',
    unit: 'hours',
    placeholder: 'Enter sleep duration',
    examples: ['6', '7.5', '8']
  }
];

export default function CreateHealthLogScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const initialType = params.type as string || 'steps';
  
  const [selectedType, setSelectedType] = useState<'steps' | 'water' | 'exercise' | 'weight' | 'sleep'>(
    initialType as any || 'steps'
  );
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedMetric = healthMetrics.find(metric => metric.type === selectedType)!;

  const handleSave = async () => {
    if (!value || isNaN(Number(value))) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    setIsLoading(true);
    try {
      const logData: CreateHealthLogRequest = {
        type: selectedType,
        value: Number(value),
        unit: selectedMetric.unit,
        date: selectedDate,
        notes: notes.trim() || undefined
      };

      await HealthLogsService.createHealthLog(logData);
      
      Alert.alert(
        'Success', 
        `${selectedMetric.label} logged successfully!`,
        [{ 
          text: 'OK', 
          onPress: () => router.back()
        }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log health data');
    } finally {
      setIsLoading(false);
    }
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
    saveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    saveButtonDisabled: {
      backgroundColor: colors.surfaceVariant,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontFamily: 'Inter-SemiBold',
      marginLeft: 4,
    },
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 12,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    metricOption: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    metricOptionSelected: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    metricIcon: {
      marginBottom: 8,
    },
    metricLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      textAlign: 'center',
    },
    metricLabelSelected: {
      color: colors.primary,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    dateInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginLeft: 8,
    },
    exampleValues: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    exampleButton: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    exampleText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    textArea: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    selectedMetricInfo: {
      backgroundColor: selectedMetric.color + '20',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedMetricText: {
      flex: 1,
      marginLeft: 12,
    },
    selectedMetricTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: selectedMetric.color,
    },
    selectedMetricUnit: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

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
          <Text style={styles.headerTitle}>Log Health Data</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!value || isLoading) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!value || isLoading}
        >
          <Save size={16} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContent}>
          {/* Metric Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Metric</Text>
            <View style={styles.metricsGrid}>
              {healthMetrics.map((metric) => {
                const IconComponent = metric.icon;
                const isSelected = selectedType === metric.type;
                
                return (
                  <TouchableOpacity
                    key={metric.type}
                    style={[
                      styles.metricOption,
                      isSelected && styles.metricOptionSelected
                    ]}
                    onPress={() => setSelectedType(metric.type)}
                  >
                    <View style={styles.metricIcon}>
                      <IconComponent 
                        size={24} 
                        color={isSelected ? colors.primary : metric.color} 
                      />
                    </View>
                    <Text style={[
                      styles.metricLabel,
                      isSelected && styles.metricLabelSelected
                    ]}>
                      {metric.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Metric Info */}
          <View style={styles.selectedMetricInfo}>
            <selectedMetric.icon size={24} color={selectedMetric.color} />
            <View style={styles.selectedMetricText}>
              <Text style={styles.selectedMetricTitle}>{selectedMetric.label}</Text>
              <Text style={styles.selectedMetricUnit}>Measured in {selectedMetric.unit}</Text>
            </View>
          </View>

          {/* Value Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Value *</Text>
            <TextInput
              style={styles.input}
              placeholder={selectedMetric.placeholder}
              placeholderTextColor={colors.textSecondary}
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
            />
            <View style={styles.exampleValues}>
              {selectedMetric.examples.map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.exampleButton}
                  onPress={() => setValue(example)}
                >
                  <Text style={styles.exampleText}>{example}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={styles.dateText}>
                {new Date(selectedDate).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Add any additional notes about this entry..."
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
