import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, ScrollView } from 'react-native';
import { 
  Plus, 
  Activity, 
  Droplets, 
  Footprints, 
  Scale, 
  Moon, 
  X, 
  Check,
  TrendingUp,
  Calendar
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import HealthLogsService, { CreateHealthLogRequest, HealthLog } from '@/services/healthLogsService';

interface HealthLoggerProps {
  onLogCreated?: (log: HealthLog) => void;
  initialType?: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  visible?: boolean;
  onClose?: () => void;
}

const healthMetrics = [
  {
    type: 'steps' as const,
    icon: Footprints,
    label: 'Steps',
    color: '#4ECDC4',
    unit: 'steps',
    placeholder: 'Enter steps count'
  },
  {
    type: 'water' as const,
    icon: Droplets,
    label: 'Water',
    color: '#3B82F6',
    unit: 'glasses',
    placeholder: 'Enter glasses of water'
  },
  {
    type: 'exercise' as const,
    icon: Activity,
    label: 'Exercise',
    color: '#F59E0B',
    unit: 'minutes',
    placeholder: 'Enter exercise duration'
  },
  {
    type: 'weight' as const,
    icon: Scale,
    label: 'Weight',
    color: '#8B5CF6',
    unit: 'kg',
    placeholder: 'Enter weight'
  },
  {
    type: 'sleep' as const,
    icon: Moon,
    label: 'Sleep',
    color: '#6B7280',
    unit: 'hours',
    placeholder: 'Enter sleep duration'
  }
];

export default function HealthLogger({ 
  onLogCreated, 
  initialType, 
  visible = false, 
  onClose 
}: HealthLoggerProps) {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState<'steps' | 'water' | 'exercise' | 'weight' | 'sleep'>(
    initialType || 'steps'
  );
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(visible);

  const selectedMetric = healthMetrics.find(metric => metric.type === selectedType)!;

  React.useEffect(() => {
    setShowModal(visible);
  }, [visible]);

  const handleClose = () => {
    setShowModal(false);
    onClose?.();
    // Reset form
    setValue('');
    setNotes('');
  };

  const handleSubmit = async () => {
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
        notes: notes.trim() || undefined
      };

      const newLog = await HealthLogsService.createHealthLog(logData);
      
      Alert.alert(
        'Success', 
        `${selectedMetric.label} logged successfully!`,
        [{ text: 'OK', onPress: handleClose }]
      );
      
      onLogCreated?.(newLog);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log health data');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modal: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    metricSelector: {
      marginBottom: 24,
    },
    selectorLabel: {
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
      fontFamily: 'Inter-SemiBold',
    },
    inputSection: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    inputContainerFocused: {
      borderColor: colors.primary,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginRight: 8,
    },
    unit: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    notesInput: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      textAlignVertical: 'top',
      minHeight: 80,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    notesInputFocused: {
      borderColor: colors.primary,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: colors.surfaceVariant,
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    submitButtonDisabled: {
      backgroundColor: colors.border,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    cancelButtonText: {
      color: colors.text,
    },
    submitButtonText: {
      color: colors.background,
    },
    quickActions: {
      marginBottom: 24,
    },
    quickActionsTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      marginBottom: 12,
    },
    quickActionButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    quickActionButton: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    quickActionText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
  });

  const getQuickActions = () => {
    switch (selectedType) {
      case 'steps':
        return ['5000', '10000', '15000'];
      case 'water':
        return ['4', '6', '8'];
      case 'exercise':
        return ['15', '30', '60'];
      case 'weight':
        return [];
      case 'sleep':
        return ['6', '7', '8'];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <Modal
      visible={showModal}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.modal} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log Health Data</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Metric Selector */}
          <View style={styles.metricSelector}>
            <Text style={styles.selectorLabel}>Select Metric</Text>
            <View style={styles.metricsGrid}>
              {healthMetrics.map((metric) => {
                const isSelected = selectedType === metric.type;
                const IconComponent = metric.icon;
                
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

          {/* Value Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              {selectedMetric.label} Value
            </Text>
            <View style={[
              styles.inputContainer,
              value && styles.inputContainerFocused
            ]}>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholder={selectedMetric.placeholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>{selectedMetric.unit}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Quick Values</Text>
              <View style={styles.quickActionButtons}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action}
                    style={styles.quickActionButton}
                    onPress={() => setValue(action)}
                  >
                    <Text style={styles.quickActionText}>
                      {action} {selectedMetric.unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Notes Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[
                styles.notesInput,
                notes && styles.notesInputFocused
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (!value || isLoading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!value || isLoading}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {isLoading ? 'Logging...' : 'Log Data'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
