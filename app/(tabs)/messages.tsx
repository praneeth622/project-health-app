import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, MoveHorizontal as MoreHorizontal, Users, MessageCircle, Phone, Video } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

const conversations = [
  {
    id: 1,
    name: 'Tillie Larson',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'I hope you are well.',
    time: '2s ago',
    isOnline: true,
    unread: 0,
    type: 'direct',
  },
  {
    id: 2,
    name: 'Morning Yoga Warriors',
    avatar: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'Sarah: Great session today everyone! 🧘‍♀️',
    time: '1 min',
    isOnline: false,
    unread: 3,
    type: 'group',
    memberCount: 1247,
  },
  {
    id: 3,
    name: 'Jordan Jordan',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'Are you ready for this after...',
    time: '2 mins',
    isOnline: false,
    unread: 0,
    type: 'direct',
  },
  {
    id: 4,
    name: 'HIIT Champions',
    avatar: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'Mike: Who\'s joining tomorrow\'s 6 AM session?',
    time: '5 mins',
    isOnline: true,
    unread: 1,
    type: 'group',
    memberCount: 892,
  },
  {
    id: 5,
    name: 'Christine Gonzales',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'I hope you are well.',
    time: '1 day',
    isOnline: false,
    unread: 0,
    type: 'direct',
  },
];

const activeUsers = [
  { id: 1, name: 'Add', avatar: null, isAdd: true },
  { id: 2, name: 'Emma', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: 3, name: 'Alex', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: 4, name: 'Sarah', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: 5, name: 'Mike', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
];

export default function MessagesScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMessage = () => {
    Alert.alert(
      'New Message',
      'Choose message type',
      [
        { text: 'Direct Message', onPress: () => Alert.alert('Coming Soon', 'Direct message composer will be implemented') },
        { text: 'Group Chat', onPress: () => Alert.alert('Coming Soon', 'Group chat creator will be implemented') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleConversationPress = (conversation: any) => {
    // Navigate to chat screen with conversation details
    router.push({ pathname: '/chat/[id]', params: { id: conversation.id } });
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
    title: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
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
    activeUsersContainer: {
      marginBottom: 24,
    },
    activeUsersContent: {
      paddingHorizontal: 20,
      gap: 16,
    },
    activeUserItem: {
      alignItems: 'center',
    },
    addUserButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + '10',
      borderWidth: 2,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    activeUserAvatarContainer: {
      position: 'relative',
      marginBottom: 8,
    },
    activeUserAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.success,
      borderWidth: 2,
      borderColor: colors.background,
    },
    activeUserName: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      textAlign: 'center',
    },
    conversationsContainer: {
      paddingHorizontal: 20,
    },
    conversationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: 12,
    },
    conversationAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    conversationInfo: {
      flex: 1,
    },
    conversationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    conversationName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    conversationTime: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    lastMessage: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    unreadBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    unreadText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.background,
    },
    groupIndicator: {
      position: 'absolute',
      bottom: -2,
      left: -2,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    memberCount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations"
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={handleCreateMessage}>
            <Plus size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Active Users */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeUsersContainer}
          contentContainerStyle={styles.activeUsersContent}
        >
          {activeUsers.map((user) => (
            <TouchableOpacity key={user.id} style={styles.activeUserItem}>
              {user.isAdd ? (
                <View style={styles.addUserButton}>
                  <Plus size={24} color={colors.primary} />
                </View>
              ) : (
                <View style={styles.activeUserAvatarContainer}>
                  <Image source={{ uri: user.avatar! }} style={styles.activeUserAvatar} />
                  <View style={styles.onlineIndicator} />
                </View>
              )}
              <Text style={styles.activeUserName}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conversations */}
        <View style={styles.conversationsContainer}>
          {filteredConversations.map((conversation) => (
            <TouchableOpacity 
              key={conversation.id} 
              style={styles.conversationItem}
              onPress={() => handleConversationPress(conversation)}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: conversation.avatar }} style={styles.conversationAvatar} />
                {conversation.isOnline && <View style={styles.onlineIndicator} />}
                {conversation.type === 'group' && (
                  <View style={styles.groupIndicator}>
                    <Users size={12} color={colors.background} />
                  </View>
                )}
              </View>
              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>
                    {conversation.name}
                    {conversation.type === 'group' && conversation.memberCount && (
                      <Text style={styles.memberCount}> ({conversation.memberCount})</Text>
                    )}
                  </Text>
                  <Text style={styles.conversationTime}>{conversation.time}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
              </View>
              {conversation.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conversation.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

