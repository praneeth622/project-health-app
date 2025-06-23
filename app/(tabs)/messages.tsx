import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

const conversations = [
  {
    id: 1,
    name: 'Tillie Larson',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'I hope you are well.',
    time: '2s ago',
    isOnline: true,
    unread: 0,
  },
  {
    id: 2,
    name: 'Lovely friends 😊',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'This afternoon at 5:30PM',
    time: '1 min',
    isOnline: false,
    unread: 1,
    isGroup: true,
  },
  {
    id: 3,
    name: 'Jordan Jordan',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'Are you ready for this after...',
    time: '2 mins',
    isOnline: false,
    unread: 0,
  },
  {
    id: 4,
    name: 'Jay Bowen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'Hi guys, How is going?',
    time: '5 mins',
    isOnline: true,
    unread: 0,
  },
  {
    id: 5,
    name: 'Christine Gonzales',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'I hope you are well.',
    time: '1 day',
    isOnline: false,
    unread: 0,
  },
  {
    id: 6,
    name: 'Don Richardson',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: 'This afternoon at 5:30PM',
    time: '1 day',
    isOnline: false,
    unread: 0,
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends or neighbors"
              placeholderTextColor="#9CA3AF"
            />
          </View>
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
                  <Plus size={24} color="#2DD4BF" />
                </View>
              ) : (
                <View style={styles.activeUserAvatarContainer}>
                  <Image source={{ uri: user.avatar }} style={styles.activeUserAvatar} />
                  <View style={styles.onlineIndicator} />
                </View>
              )}
              <Text style={styles.activeUserName}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conversations */}
        <View style={styles.conversationsContainer}>
          {conversations.map((conversation) => (
            <TouchableOpacity key={conversation.id} style={styles.conversationItem}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: conversation.avatar }} style={styles.conversationAvatar} />
                {conversation.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>{conversation.name}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#111827',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
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
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
    borderColor: '#2DD4BF',
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
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  activeUserName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
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
    borderBottomColor: '#F3F4F6',
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
    color: '#111827',
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});