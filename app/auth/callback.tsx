// NOTE: This OAuth callback handler is currently not used since social authentication has been removed.
// It's kept for future use when social authentication (Google, Apple, etc.) is re-implemented.
// The callback handles post-authentication redirects from OAuth providers.

import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AuthCallback() {
  const { refreshProfile, user, profile } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Refresh profile to handle OAuth user creation
        await refreshProfile();
        
        // Small delay to ensure profile is loaded
        setTimeout(() => {
          if (user) {
            // Check if onboarding is completed
            if (profile?.onboarding_completed) {
              router.replace('/(tabs)');
            } else {
              router.replace('/onboarding');
            }
          } else {
            router.replace('/(auth)/login');
          }
        }, 1000);
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/(auth)/login');
      }
    };

    handleCallback();
  }, [user, profile]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: colors.background 
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ 
        marginTop: 16, 
        fontSize: 16, 
        color: colors.text,
        fontFamily: 'Inter-Medium'
      }}>
        Completing sign in...
      </Text>
    </View>
  );
}
