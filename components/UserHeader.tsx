import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

interface UserHeaderProps {
  userName: string;
  date: string;
  showMore?: boolean;
  showCalendar?: boolean;
}

export default function UserHeader({ userName, date, showMore = false, showCalendar = true }: UserHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hello {userName}!</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {showCalendar && (
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
        {showMore && (
          <TouchableOpacity style={styles.actionButton}>
            <MoreHorizontal size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
});