import { Tabs } from 'expo-router';
import { Chrome as Home, Users, MessageCircle, User, Search, Activity, Dumbbell } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import React from 'react';

// Custom tab background component for better styling
const TabBackground = () => (
  <View style={styles.tabBackground}>
    <View style={styles.tabIndicator} />
  </View>
);

// Custom tab icon wrapper for enhanced styling
const TabIcon = ({ IconComponent, size, color, focused, fill }: {
  IconComponent: any;
  size: number;
  color: string;
  focused: boolean;
  fill?: string;
}) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
    {focused && <View style={styles.tabIconGlow} />}
    <IconComponent 
      size={size} 
      color={color} 
      strokeWidth={focused ? 2.5 : 2}
      fill={fill}
    />
    {focused && <View style={styles.tabIconDot} />}
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#2DD4BF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <TabBackground />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIcon 
              IconComponent={Home} 
              size={focused ? 28 : 24} 
              color={color} 
              focused={focused}
              fill={focused ? 'rgba(45, 212, 191, 0.1)' : 'none'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIcon 
              IconComponent={Search} 
              size={focused ? 28 : 24} 
              color={color} 
              focused={focused}
              fill={focused ? 'rgba(45, 212, 191, 0.1)' : 'none'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIcon 
              IconComponent={Activity} 
              size={focused ? 28 : 24} 
              color={color} 
              focused={focused}
              fill={focused ? 'rgba(45, 212, 191, 0.1)' : 'none'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIcon 
              IconComponent={Dumbbell} 
              size={focused ? 28 : 24} 
              color={color} 
              focused={focused}
              fill={focused ? 'rgba(45, 212, 191, 0.1)' : 'none'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIcon 
              IconComponent={User} 
              size={focused ? 28 : 24} 
              color={color} 
              focused={focused}
              fill={focused ? 'rgba(45, 212, 191, 0.1)' : 'none'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          href: null, // Hide from tab bar - accessible from Home or Discover
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          href: null, // Hide from tab bar - accessible from Profile or header
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Hide from tab bar - accessible from Profile
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    height: 95,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'relative',
  },
  tabBarLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    marginTop: 8,
    marginBottom: 0,
    letterSpacing: 0.3,
  },
  tabBarItem: {
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    position: 'relative',
  },
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: '#2DD4BF',
    borderRadius: 2,
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconActive: {
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
    transform: [{ scale: 1.05 }],
  },
  tabIconGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(45, 212, 191, 0.05)',
    zIndex: -1,
  },
  tabIconDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2DD4BF',
  },
});