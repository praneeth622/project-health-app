import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { 
  Activity, 
  Droplets, 
  Footprints, 
  Scale, 
  Moon, 
  Edit2,
  Trash2,
  Calendar,
  TrendingUp,
  Filter,
  ChevronRight
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import HealthLogsService, { HealthLog } from '@/services/healthLogsService';

interface HealthLogsListProps {
  userId?: string;
  type?: 'steps' | 'water' | 'exercise' | 'weight' | 'sleep';
  limit?: number;
  onLogUpdated?: (log: HealthLog) => void;
  onLogDeleted?: (logId: string) => void;
  showActions?: boolean;
}

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

const formatHealthValue = (log: HealthLog): string => {
  const { value, unit, type } = log;
  
  switch (type) {
    case 'steps':
      return `${value.toLocaleString()} ${unit}`;
    case 'water':
      return `${value} ${unit}`;
    case 'exercise':
      return `${value} ${unit}`;
    case 'weight':
      return `${value} ${unit}`;
    case 'sleep':
      return `${value} ${unit}`;
    default:
      return `${value} ${unit}`;
  }
};

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default function HealthLogsList({ 
  userId, 
  type, 
  limit = 50,
  onLogUpdated,
  onLogDeleted,
  showActions = true
}: HealthLogsListProps) {
  const { colors } = useTheme();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'steps' | 'water' | 'exercise' | 'weight' | 'sleep' | 'all'>(type || 'all');

  const fetchLogs = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      let fetchedLogs: HealthLog[] = [];
      
      if (filterType === 'all') {
        const result = await HealthLogsService.getUserHealthLogs(userId, 1, limit);
        fetchedLogs = result.health_logs;
      } else {
        // Get logs for the last 30 days for specific type
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        fetchedLogs = await HealthLogsService.getHealthLogsInRange(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          userId,
          filterType
        );
      }
      
      // Sort by date (newest first)
      fetchedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Failed to fetch health logs:', error);
      Alert.alert('Error', 'Failed to load health logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, filterType, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs(false);
  };

  const handleDelete = async (log: HealthLog) => {
    Alert.alert(
      'Delete Health Log',
      `Are you sure you want to delete this ${log.type} entry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await HealthLogsService.deleteHealthLog(log.id);
              setLogs(logs.filter(l => l.id !== log.id));
              onLogDeleted?.(log.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete health log');
            }
          }
        }
      ]
    );
  };

  const renderHealthLog = ({ item }: { item: HealthLog }) => {
    const IconComponent = getHealthMetricIcon(item.type);
    const iconColor = getHealthMetricColor(item.type);
    
    return (
      <TouchableOpacity 
        style={styles.logItem}
        onPress={() => router.push(`/health/${item.id}` as any)}
      >
        <View style={styles.logIcon}>
          <IconComponent size={20} color={iconColor} />
        </View>
        
        <View style={styles.logContent}>
          <View style={styles.logHeader}>
            <Text style={styles.logType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <Text style={styles.logDate}>
              {formatRelativeDate(item.date)}
            </Text>
          </View>
          
          <Text style={styles.logValue}>
            {formatHealthValue(item)}
          </Text>
          
          {item.notes && (
            <Text style={styles.logNotes} numberOfLines={2}>
              {item.notes}
            </Text>
          )}
        </View>
        
        <View style={styles.logActions}>
          {showActions && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDelete(item);
              }}
            >
              <Trash2 size={16} color={colors.error || '#EF4444'} />
            </TouchableOpacity>
          )}
          <ChevronRight size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Activity size={48} color={colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>No Health Logs</Text>
      <Text style={styles.emptyStateText}>
        {filterType === 'all' 
          ? 'Start logging your health data to see your progress!'
          : `No ${filterType} logs found. Start tracking to see your progress!`
        }
      </Text>
    </View>
  );

  const filterOptions = [
    { key: 'all', label: 'All', icon: Filter },
    { key: 'steps', label: 'Steps', icon: Footprints },
    { key: 'water', label: 'Water', icon: Droplets },
    { key: 'exercise', label: 'Exercise', icon: Activity },
    { key: 'weight', label: 'Weight', icon: Scale },
    { key: 'sleep', label: 'Sleep', icon: Moon },
  ] as const;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    filterContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
    },
    filterScrollView: {
      flexDirection: 'row',
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    filterButtonActive: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginLeft: 8,
    },
    filterTextActive: {
      color: colors.primary,
      fontFamily: 'Inter-SemiBold',
    },
    listContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    logItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    logIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    logContent: {
      flex: 1,
    },
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    logType: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    logDate: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    logValue: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
      marginBottom: 4,
    },
    logNotes: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    logActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.emptyStateText, { marginTop: 16 }]}>
          Loading health logs...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            const isActive = filterType === item.key;
            const IconComponent = item.icon;
            
            return (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive
                ]}
                onPress={() => setFilterType(item.key as any)}
              >
                <IconComponent 
                  size={16} 
                  color={isActive ? colors.primary : colors.text} 
                />
                <Text style={[
                  styles.filterText,
                  isActive && styles.filterTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Health Logs List */}
      <FlatList
        style={styles.listContainer}
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderHealthLog}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
