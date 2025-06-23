import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, MapPin, Bell, Users, Volume2, Shield, Moon, Sun, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const friends = [
  { id: 1, name: 'Joseph Martinez', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', isActive: true },
  { id: 2, name: 'Wayne Caldwell', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', isActive: true },
  { id: 3, name: 'Wayne Leonard', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', isActive: true },
  { id: 4, name: 'Mildred Castillo', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', isActive: false },
];

export default function SettingsScreen() {
  const { theme, colors, isDark, setTheme, toggleTheme } = useTheme();
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} color={colors.textSecondary} />;
      case 'dark':
        return <Moon size={20} color={colors.textSecondary} />;
      default:
        return <Smartphone size={20} color={colors.textSecondary} />;
    }
  };
  
  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      default:
        return 'System';
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
    placeholder: {
      width: 40,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
    },
    sectionHeader: {
      marginBottom: 16,
    },
    accountCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      padding: 16,
      borderRadius: 12,
    },
    accountAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    accountStatus: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.accent,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    settingText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginLeft: 12,
    },
    themeSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    themeOptions: {
      flexDirection: 'row',
      marginLeft: 'auto',
      gap: 8,
    },
    themeOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.surfaceVariant,
    },
    themeOptionActive: {
      backgroundColor: colors.primary,
    },
    themeOptionText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    themeOptionTextActive: {
      color: colors.background,
    },
    inviteText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    friendAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    friendName: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    editProfileCard: {
      backgroundColor: colors.surfaceVariant,
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
    },
    editAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignSelf: 'center',
      marginBottom: 20,
    },
    editInfo: {
      alignItems: 'center',
    },
    editName: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 20,
    },
    inputField: {
      width: '100%',
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    inputValue: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.accountCard}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
              style={styles.accountAvatar}
            />
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Linh Nguyen</Text>
              <Text style={styles.accountStatus}>Pro</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.themeSelector}>
            {getThemeIcon()}
            <Text style={styles.settingText}>{getThemeText()}</Text>
            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[styles.themeOption, theme === 'light' && styles.themeOptionActive]}
                onPress={() => setTheme('light')}
              >
                <Text style={[
                  styles.themeOptionText,
                  theme === 'light' && styles.themeOptionTextActive
                ]}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeOption, theme === 'dark' && styles.themeOptionActive]}
                onPress={() => setTheme('dark')}
              >
                <Text style={[
                  styles.themeOptionText,
                  theme === 'dark' && styles.themeOptionTextActive
                ]}>Dark</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeOption, theme === 'system' && styles.themeOptionActive]}
                onPress={() => setTheme('system')}
              >
                <Text style={[
                  styles.themeOptionText,
                  theme === 'system' && styles.themeOptionTextActive
                ]}>Auto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <MapPin size={20} color={colors.textTertiary} />
            <Text style={styles.settingText}>Location</Text>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Bell size={20} color={colors.textTertiary} />
            <Text style={styles.settingText}>Notification</Text>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Users size={20} color={colors.textTertiary} />
            <Text style={styles.settingText}>Close Friends</Text>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Volume2 size={20} color={colors.textTertiary} />
            <Text style={styles.settingText}>Sounds</Text>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Shield size={20} color={colors.textTertiary} />
            <Text style={styles.settingText}>Privacy</Text>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Close Friends Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Close Friends</Text>
            <TouchableOpacity>
              <Text style={styles.inviteText}>Invite your friends to get a free exercise right away</Text>
            </TouchableOpacity>
          </View>
          
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendItem}>
              <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
              <Text style={styles.friendName}>{friend.name}</Text>
              <Switch
                value={friend.isActive}
                onValueChange={() => {}}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={friend.isActive ? colors.background : colors.surfaceVariant}
              />
            </View>
          ))}
        </View>

        {/* Edit Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit profile</Text>
          
          <View style={styles.editProfileCard}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
              style={styles.editAvatar}
            />
            <View style={styles.editInfo}>
              <Text style={styles.editName}>Linh Nguyen</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Full name</Text>
                <Text style={styles.inputValue}>Linh Nguyen</Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <Text style={styles.inputValue}>Aug 8, 1997</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

