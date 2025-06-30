import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://chfjrlxvzyinoegnjqhd.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmpybHh2enlpbm9lZ25qcWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDkyMDcsImV4cCI6MjA2NTgyNTIwN30.UgD5buq6VGEzsg_6Wdes6XbuouxC8wL2vsJPgrSmV5A';

// Validate environment variables (simplified for debugging)
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  throw new Error(
    '❌ Invalid EXPO_PUBLIC_SUPABASE_URL.\n\n' +
    `Current value: ${supabaseUrl}\n\n` +
    '🔧 Please check your .env file for a valid Supabase URL'
  );
}

if (!supabaseAnonKey || supabaseAnonKey.length < 100) {
  throw new Error(
    '❌ Invalid EXPO_PUBLIC_SUPABASE_ANON_KEY.\n\n' +
    `Current value: ${supabaseAnonKey ? 'Found but too short' : 'Missing'}\n\n` +
    '🔧 Please check your .env file for a valid Supabase anon key'
  );
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  location?: string;
  birthday?: string;
  website?: string;
  phone_number?: string;
  profile_picture_url?: string;
  cover_image_url?: string;
  // Enhanced profile fields
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  // Privacy settings
  is_profile_public?: boolean;
  show_age?: boolean;
  show_location?: boolean;
  // Social auth metadata
  provider?: 'email' | 'google' | 'apple';
  provider_id?: string;
  // Onboarding completion
  onboarding_completed?: boolean;
  onboarding_step?: number;
  created_at: string;
  updated_at: string;
}

export interface FitnessGoal {
  id: string;
  user_id: string;
  goal_name: string;
  goal_type: 'primary' | 'secondary';
  target_value?: number;
  target_unit?: string;
  target_date?: string;
  is_achieved?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserInterest {
  id: string;
  user_id: string;
  interest_name: string;
  interest_category: 'fitness' | 'nutrition' | 'wellness' | 'lifestyle';
  proficiency_level?: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}

export interface OnboardingData {
  gender?: string;
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  fitness_goals?: string[];
  interests?: string[];
  fitness_level?: string;
  bio?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
