import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Target,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Activity,
  Droplets,
  Footprints,
  Scale,
  Moon,
  CheckCircle,
  Circle
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import CircularProgress from '@/components/CircularProgress';

interface HealthGoal {
  id: string;
  type: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  label: string;
  target: number;
  unit: string;
  current: number;
  icon: any;
  color: string;
  isActive: boolean;
}

const defaultGoals: Omit<HealthGoal, 'id' | 'current'>[] = [
  {
    type: 'steps',
    label: 'Daily Steps',
    target: 10000,
    unit: 'steps',
    icon: Footprints,
    color: '#4ECDC4',
    isActive: true
  },
  {
    type: 'water',
    label: 'Water Intake',
    target: 8,
    unit: 'glasses',
    icon: Droplets,
    color: '#3B82F6',
    isActive: true
  },
  {
    type: 'exercise',
    label: 'Exercise Time',
    target: 60,
    unit: 'minutes',
    icon: Activity,
    color: '#F59E0B',
    isActive: true
  },
  {
    type: 'weight',
    label: 'Target Weight',
    target: 70,
    unit: 'kg',
    icon: Scale,
    color: '#8B5CF6',
    isActive: false
  },
  {
    type: 'sleep',
    label: 'Sleep Duration',
    target: 8,
    unit: 'hours',
    icon: Moon,
    color: '#6B7280',
    isActive: true
  }
];

export default function HealthGoalsScreen() {
  const { colors } = useTheme();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    // Initialize with default goals and mock current values
    const initialGoals: HealthGoal[] = defaultGoals.map((goal, index) => ({
      ...goal,
      id: `goal-${index}`,
      current: Math.floor(Math.random() * goal.target * 1.2) // Mock current progress
    }));
    
    setGoals(initialGoals);
  };

  const handleEditGoal = (goal: HealthGoal) => {
    setEditingGoal(goal);
    setEditTarget(goal.target.toString());
    setShowEditModal(true);
  };

  const handleSaveGoal = () => {
    if (!editingGoal || !editTarget || isNaN(Number(editTarget))) {
      Alert.alert('Invalid Input', 'Please enter a valid target value');
      return;
    }

    const updatedGoals = goals.map(goal =>
      goal.id === editingGoal.id
        ? { ...goal, target: Number(editTarget) }
        : goal
    );

    setGoals(updatedGoals);
    setShowEditModal(false);
    setEditingGoal(null);
    setEditTarget('');
    
    Alert.alert('Success', 'Goal updated successfully!');
  };

  const handleToggleGoal = (goalId: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? { ...goal, isActive: !goal.isActive }
        : goal
    );
    
    setGoals(updatedGoals);
  };

  const calculateProgress = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const renderGoalCard = (goal: HealthGoal) => {
    const IconComponent = goal.icon;
    const progress = calculateProgress(goal.current, goal.target);
    const isCompleted = progress >= 100;

    return (
      <View key={goal.id} style={[
        styles.goalCard,
        !goal.isActive && styles.inactiveGoalCard
      ]}>
        <View style={styles.goalHeader}>
          <TouchableOpacity
            style={styles.goalToggle}
            onPress={() => handleToggleGoal(goal.id)}
          >
            {goal.isActive ? (
              <CheckCircle size={20} color={goal.color} />
            ) : (
              <Circle size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
          
          <View style={styles.goalInfo}>
            <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
              <IconComponent size={20} color={goal.color} />
            </View>
            <Text style={[
              styles.goalLabel,
              !goal.isActive && styles.inactiveText
            ]}>
              {goal.label}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditGoal(goal)}
          >
            <Edit2 size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.goalContent}>
          <View style={styles.progressSection}>
            <CircularProgress
              progress={progress}
              size={80}
              strokeWidth={8}
              color={goal.color}
              backgroundColor={colors.surfaceVariant}
            />
            <View style={styles.progressText}>
              <Text style={[styles.currentValue, { color: goal.color }]}>
                {goal.current.toLocaleString()}
              </Text>
              <Text style={styles.targetValue}>
                / {goal.target.toLocaleString()} {goal.unit}
              </Text>
              <Text style={[
                styles.progressPercent,
                isCompleted && { color: '#10B981' }
              ]}>
                {Math.round(progress)}%
              </Text>
            </View>
          </View>

          {isCompleted && (
            <View style={styles.completedBadge}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.completedText}>Goal Achieved!</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Goal</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowEditModal(false)}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {editingGoal && (
            <>
              <View style={styles.goalPreview}>
                <View style={[styles.goalIcon, { backgroundColor: editingGoal.color + '20' }]}>
                  <editingGoal.icon size={24} color={editingGoal.color} />
                </View>
                <Text style={styles.goalPreviewLabel}>{editingGoal.label}</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Value</Text>
                <TextInput
                  style={styles.input}
                  value={editTarget}
                  onChangeText={setEditTarget}
                  keyboardType="numeric"
                  placeholder={`Enter target ${editingGoal.unit}`}
                  placeholderTextColor={colors.textSecondary}
                />
                <Text style={styles.inputUnit}>{editingGoal.unit}</Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveGoal}
                >
                  <Save size={16} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    scrollContent: {
      padding: 16,
    },
    goalCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    inactiveGoalCard: {
      opacity: 0.6,
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    goalToggle: {
      marginRight: 12,
    },
    goalInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    goalIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    goalLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    inactiveText: {
      color: colors.textSecondary,
    },
    editButton: {
      padding: 8,
    },
    goalContent: {
      alignItems: 'center',
    },
    progressSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    progressText: {
      alignItems: 'center',
    },
    currentValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
    },
    targetValue: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    progressPercent: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginTop: 4,
    },
    completedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#10B981' + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginTop: 12,
    },
    completedText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#10B981',
      marginLeft: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    modalCloseButton: {
      padding: 4,
    },
    goalPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    goalPreviewLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
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
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputUnit: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: colors.surfaceVariant,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    saveButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 4,
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Goals</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {goals.map(renderGoalCard)}
        
        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Target size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No health goals set yet. Start by setting your first goal!
            </Text>
          </View>
        )}
      </ScrollView>

      {renderEditModal()}
    </SafeAreaView>
  );
}
