import { Tabs } from 'expo-router';
import { Chrome as Home, Users, MessageCircle, User, Search, Activity, Dumbbell, Bell, ShoppingBag } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Custom tab background component for better styling
const TabBackground = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.tabBackground, { backgroundColor: colors.tabBarBackground }]}>
      <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />
    </View>
  );
};

// Custom tab icon wrapper for enhanced styling
const TabIcon = ({ IconComponent, size, color, focused, fill }: {
  IconComponent: any;
  size: number;
  color: string;
  focused: boolean;
  fill?: string;
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.tabIconContainer, focused && { backgroundColor: `${colors.primary}14` }]}>
      {focused && <View style={[styles.tabIconGlow, { backgroundColor: `${colors.primary}0D` }]} />}
      <IconComponent 
        size={size} 
        color={color} 
        strokeWidth={focused ? 2.5 : 2}
        fill={fill}
      />
      {focused && <View style={[styles.tabIconDot, { backgroundColor: colors.primary }]} />}
    </View>
  );
};

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { 
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          shadowColor: colors.shadow,
        }],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
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
              fill={focused ? `${colors.primary}1A` : 'none'}
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
              fill={focused ? `${colors.primary}1A` : 'none'}
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
              fill={focused ? `${colors.primary}1A` : 'none'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIcon 
              IconComponent={ShoppingBag} 
              size={focused ? 28 : 24} 
              color={color} 
              focused={focused}
              fill={focused ? `${colors.primary}1A` : 'none'}
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
              fill={focused ? `${colors.primary}1A` : 'none'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ size, color, focused }) => (
            <TabIcon 
              IconComponent={Bell} 
              size={focused ? 28 : 24} 
              color={color} 
              focused={focused}
              fill={focused ? `${colors.primary}1A` : 'none'}
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
              fill={focused ? `${colors.primary}1A` : 'none'}
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
    borderTopWidth: 1,
    height: 95,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 12,
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
    borderRadius: 2,
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    zIndex: -1,
  },
  tabIconDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});