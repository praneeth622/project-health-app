import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Crown, Shield, Users, MoreHorizontal, MessageCircle, Phone, Video } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  isOnline: boolean;
  lastActive: string;
  mutualFriends?: number;
}

const mockMembers: GroupMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'admin',
    isOnline: true,
    lastActive: '2 minutes ago',
    mutualFriends: 12,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'moderator',
    isOnline: false,
    lastActive: '1 hour ago',
    mutualFriends: 8,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    isOnline: true,
    lastActive: '5 minutes ago',
    mutualFriends: 15,
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    isOnline: false,
    lastActive: '3 hours ago',
    mutualFriends: 5,
  },
  {
    id: '5',
    name: 'Jessica Lee',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    isOnline: true,
    lastActive: 'Online',
    mutualFriends: 20,
  },
  {
    id: '6',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    isOnline: false,
    lastActive: '1 day ago',
    mutualFriends: 3,
  },
];

export default function GroupMembersScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'admins' | 'online'>('all');

  const groupInfo = {
    name: 'Morning Yoga Warriors',
    memberCount: 1247,
  };

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'admins' && (member.role === 'admin' || member.role === 'moderator')) ||
      (selectedFilter === 'online' && member.isOnline);
    
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown size={14} color={colors.warning} fill={colors.warning} />;
      case 'moderator':
        return <Shield size={14} color={colors.info} />;
      default:
        return <Users size={14} color={colors.textSecondary} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return colors.warning;
      case 'moderator':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const handleMemberPress = (member: GroupMember) => {
    router.push({ pathname: '/chat/[id]', params: { id: member.id } });
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
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 48,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    filtersContainer: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeFilterButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    activeFilterText: {
      color: colors.background,
    },
    membersList: {
      paddingHorizontal: 20,
    },
    memberCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    memberAvatarContainer: {
      position: 'relative',
      marginRight: 12,
    },
    memberAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.success,
      borderWidth: 2,
      borderColor: colors.background,
    },
    memberInfo: {
      flex: 1,
    },
    memberHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    memberName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginRight: 8,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      gap: 4,
    },
    roleText: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      textTransform: 'capitalize',
    },
    memberMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    lastActive: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    mutualFriends: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.primary,
    },
    memberActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.surfaceVariant,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
      textTransform: 'uppercase',
    },
  });

  // Group members by role for better organization
  const adminMembers = filteredMembers.filter(m => m.role === 'admin');
  const moderatorMembers = filteredMembers.filter(m => m.role === 'moderator');
  const regularMembers = filteredMembers.filter(m => m.role === 'member');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{groupInfo.name}</Text>
          <Text style={styles.headerSubtitle}>
            {groupInfo.memberCount.toLocaleString()} members
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        {[
          { key: 'all', label: 'All Members' },
          { key: 'admins', label: 'Admins & Mods' },
          { key: 'online', label: 'Online' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.activeFilterText,
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Members List */}
      <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
        {/* Admins */}
        {adminMembers.length > 0 && selectedFilter === 'all' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Admins</Text>
            </View>
            {adminMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberCard}
                onPress={() => handleMemberPress(member)}
              >
                <View style={styles.memberAvatarContainer}>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                  {member.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.roleBadge}>
                      {getRoleIcon(member.role)}
                      <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                        {member.role}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.memberMeta}>
                    <Text style={styles.lastActive}>
                      {member.isOnline ? 'Online' : `Last seen ${member.lastActive}`}
                    </Text>
                    {member.mutualFriends && (
                      <Text style={styles.mutualFriends}>
                        {member.mutualFriends} mutual friends
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.memberActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Moderators */}
        {moderatorMembers.length > 0 && selectedFilter === 'all' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Moderators</Text>
            </View>
            {moderatorMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberCard}
                onPress={() => handleMemberPress(member)}
              >
                <View style={styles.memberAvatarContainer}>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                  {member.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.roleBadge}>
                      {getRoleIcon(member.role)}
                      <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                        {member.role}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.memberMeta}>
                    <Text style={styles.lastActive}>
                      {member.isOnline ? 'Online' : `Last seen ${member.lastActive}`}
                    </Text>
                    {member.mutualFriends && (
                      <Text style={styles.mutualFriends}>
                        {member.mutualFriends} mutual friends
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.memberActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Regular Members */}
        {regularMembers.length > 0 && (
          <>
            {selectedFilter === 'all' && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Members</Text>
              </View>
            )}
            {(selectedFilter === 'all' ? regularMembers : filteredMembers).map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberCard}
                onPress={() => handleMemberPress(member)}
              >
                <View style={styles.memberAvatarContainer}>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                  {member.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {selectedFilter !== 'all' && member.role !== 'member' && (
                      <View style={styles.roleBadge}>
                        {getRoleIcon(member.role)}
                        <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                          {member.role}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.memberMeta}>
                    <Text style={styles.lastActive}>
                      {member.isOnline ? 'Online' : `Last seen ${member.lastActive}`}
                    </Text>
                    {member.mutualFriends && (
                      <Text style={styles.mutualFriends}>
                        {member.mutualFriends} mutual friends
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.memberActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
