import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, BellOff, Smartphone, Mail, Users, MessageCircle, Award, Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'general' | 'social' | 'activity';
}

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'push_enabled',
      title: 'Push Notifications',
      description: 'Receive notifications on this device',
      icon: Smartphone,
      enabled: true,
      category: 'general',
    },
    {
      id: 'email_enabled',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail,
      enabled: false,
      category: 'general',
    },
    {
      id: 'group_messages',
      title: 'Group Messages',
      description: 'New messages in your groups',
      icon: Users,
      enabled: true,
      category: 'social',
    },
    {
      id: 'direct_messages',
      title: 'Direct Messages',
      description: 'Private messages from other users',
      icon: MessageCircle,
      enabled: true,
      category: 'social',
    },
    {
      id: 'group_invites',
      title: 'Group Invitations',
      description: 'When you\'re invited to join a group',
      icon: Users,
      enabled: true,
      category: 'social',
    },
    {
      id: 'workout_reminders',
      title: 'Workout Reminders',
      description: 'Daily workout reminders and schedules',
      icon: Zap,
      enabled: true,
      category: 'activity',
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'When you earn new badges or reach goals',
      icon: Award,
      enabled: true,
      category: 'activity',
    },
    {
      id: 'weekly_summary',
      title: 'Weekly Summary',
      description: 'Your weekly activity and progress report',
      icon: Bell,
      enabled: false,
      category: 'activity',
    },
  ]);

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: '22:00',
    endTime: '07:00',
  });

  const toggleSetting = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const toggleQuietHours = () => {
    setQuietHours(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '20',
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 18,
    },
    quietHoursCard: {
      backgroundColor: colors.surface,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    quietHoursHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    quietHoursTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    quietHoursDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 16,
    },
    timeSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timeButton: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    timeText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    timeSeparator: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginHorizontal: 16,
    },
    notificationPreview: {
      backgroundColor: colors.surface,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    previewTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    previewText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    previewTime: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      marginTop: 4,
    },
  });

  const generalSettings = settings.filter(s => s.category === 'general');
  const socialSettings = settings.filter(s => s.category === 'social');
  const activitySettings = settings.filter(s => s.category === 'activity');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Preview */}
        <View style={styles.notificationPreview}>
          <Text style={styles.previewTitle}>Sample Notification</Text>
          <Text style={styles.previewText}>
            Sarah Johnson shared a new workout in Morning Yoga Warriors
          </Text>
          <Text style={styles.previewTime}>2 minutes ago</Text>
        </View>

        {/* Quiet Hours */}
        <View style={styles.quietHoursCard}>
          <View style={styles.quietHoursHeader}>
            <Text style={styles.quietHoursTitle}>Do Not Disturb</Text>
            <Switch
              value={quietHours.enabled}
              onValueChange={toggleQuietHours}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
          <Text style={styles.quietHoursDescription}>
            Silence notifications during these hours
          </Text>
          {quietHours.enabled && (
            <View style={styles.timeSelector}>
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeText}>{quietHours.startTime}</Text>
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>to</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeText}>{quietHours.endTime}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>General</Text>
          </View>
          {generalSettings.map((setting) => {
            const IconComponent = setting.icon;
            return (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <IconComponent size={20} color={colors.textSecondary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
            );
          })}
        </View>

        {/* Social Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Social</Text>
          </View>
          {socialSettings.map((setting) => {
            const IconComponent = setting.icon;
            return (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <IconComponent size={20} color={colors.textSecondary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
            );
          })}
        </View>

        {/* Activity Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity & Fitness</Text>
          </View>
          {activitySettings.map((setting) => {
            const IconComponent = setting.icon;
            return (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <IconComponent size={20} color={colors.textSecondary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
