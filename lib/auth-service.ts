import { supabase, UserProfile, FitnessGoal, UserInterest, AuthError, OnboardingData } from './supabase';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

export class AuthService {
  // Email & Password Authentication with automatic profile creation
  static async signUpWithEmail(
    email: string, 
    password: string, 
    fullName: string
  ): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: { message: error.message } };
      }

      // Profile creation will be handled by database trigger
      // or during onboarding flow after database setup
      if (data.user) {
        // Try to create profile, but don't fail signup if it doesn't work
        try {
          await ProfileService.createUserProfile(data.user.id, {
            email: data.user.email || email,
            full_name: fullName,
            provider: 'email',
            onboarding_completed: false,
            onboarding_step: 0,
            is_profile_public: true,
            show_age: true,
            show_location: true,
          });
        } catch (profileError) {
          // Log error but don't fail signup
          console.warn('Profile creation failed, will be handled later:', profileError);
        }
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      return { 
        user: null, 
        session: null, 
        error: { message: 'An unexpected error occurred during sign up' } 
      };
    }
  }

  static async signInWithEmail(
    email: string, 
    password: string
  ): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error: { message: error.message } };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      return { 
        user: null, 
        session: null, 
        error: { message: 'An unexpected error occurred during sign in' } 
      };
    }
  }

  // Password Reset
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to send reset password email' } };
    }
  }

  // Sign Out
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to sign out' } };
    }
  }

  // Get Current Session
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      return null;
    }
  }

  // Get Current User
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      return null;
    }
  }

  // Auth State Listener
  static onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export class ProfileService {
  // Enhanced Create User Profile with onboarding support
  static async createUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
    try {
      const defaultProfile: Partial<UserProfile> = {
        id: userId,
        onboarding_completed: false,
        onboarding_step: 0,
        is_profile_public: true,
        show_age: true,
        show_location: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profileData,
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        return { profile: null, error: { message: error.message } };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { 
        profile: null, 
        error: { message: 'Failed to create user profile' } 
      };
    }
  }

  // Complete onboarding with comprehensive data
  static async completeOnboarding(
    userId: string,
    onboardingData: OnboardingData
  ): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
    try {
      // Update profile with onboarding data
      const profileUpdate: Partial<UserProfile> = {
        gender: onboardingData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say',
        age: onboardingData.age,
        height_cm: onboardingData.height_cm,
        weight_kg: onboardingData.weight_kg,
        bio: onboardingData.bio,
        fitness_level: onboardingData.fitness_level as 'beginner' | 'intermediate' | 'advanced',
        onboarding_completed: true,
        onboarding_step: 100, // Completed
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileUpdate)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: { message: error.message } };
      }

      // Add goals and interests if provided
      if (onboardingData.fitness_goals && onboardingData.fitness_goals.length > 0) {
        await this.addUserGoals(userId, onboardingData.fitness_goals);
      }

      if (onboardingData.interests && onboardingData.interests.length > 0) {
        await this.addUserInterests(userId, onboardingData.interests);
      }

      return { profile: data, error: null };
    } catch (error) {
      return { 
        profile: null, 
        error: { message: 'Failed to complete onboarding' } 
      };
    }
  }

  // Update onboarding step
  static async updateOnboardingStep(
    userId: string,
    step: number,
    stepData?: Partial<OnboardingData>
  ): Promise<{ error: AuthError | null }> {
    try {
      const updateData: Partial<UserProfile> = {
        onboarding_step: step,
        updated_at: new Date().toISOString(),
        ...(stepData?.gender && { gender: stepData.gender as any }),
        ...(stepData?.age && { age: stepData.age }),
        ...(stepData?.height_cm && { height_cm: stepData.height_cm }),
        ...(stepData?.weight_kg && { weight_kg: stepData.weight_kg }),
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update onboarding step' } };
    }
  }

  // Update User Profile
  static async updateUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: { message: error.message } };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { 
        profile: null, 
        error: { message: 'Failed to update user profile' } 
      };
    }
  }

  // Get User Profile
  static async getUserProfile(userId: string): Promise<{ 
    profile: UserProfile | null; 
    error: AuthError | null 
  }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { profile: null, error: { message: error.message } };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { 
        profile: null, 
        error: { message: 'Failed to fetch user profile' } 
      };
    }
  }

  // Upload Profile Picture
  static async uploadProfilePicture(
    userId: string,
    imageUri: string
  ): Promise<{ url: string | null; error: AuthError | null }> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      
      const fileName = `profile-${userId}-${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        return { url: null, error: { message: error.message } };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(data.path);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { 
        url: null, 
        error: { message: 'Failed to upload profile picture' } 
      };
    }
  }

  // Upload Cover Image
  static async uploadCoverImage(
    userId: string,
    imageUri: string
  ): Promise<{ url: string | null; error: AuthError | null }> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      
      const fileName = `cover-${userId}-${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('cover-images')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        return { url: null, error: { message: error.message } };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('cover-images')
        .getPublicUrl(data.path);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { 
        url: null, 
        error: { message: 'Failed to upload cover image' } 
      };
    }
  }

  // Enhanced Add User Interests with categorization
  static async addUserInterests(
    userId: string,
    interests: string[]
  ): Promise<{ interests: UserInterest[] | null; error: AuthError | null }> {
    try {
      // First, delete existing interests
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', userId);

      // Categorize interests (you can enhance this mapping)
      const interestCategories: Record<string, string> = {
        'Yoga': 'fitness',
        'Running': 'fitness',
        'Weightlifting': 'fitness',
        'Swimming': 'fitness',
        'Cycling': 'fitness',
        'Pilates': 'fitness',
        'CrossFit': 'fitness',
        'Boxing': 'fitness',
        'Dancing': 'fitness',
        'Hiking': 'fitness',
        'Tennis': 'fitness',
        'Basketball': 'fitness',
        'Soccer': 'fitness',
        'Martial Arts': 'fitness',
        'Rock Climbing': 'fitness',
        'Gymnastics': 'fitness',
        'Nutrition': 'nutrition',
        'Cooking': 'nutrition',
        'Meal Planning': 'nutrition',
        'Meditation': 'wellness',
        'Mindfulness': 'wellness',
        'Sleep': 'wellness',
        'Stress Management': 'wellness',
        'Mental Health': 'wellness',
      };

      // Then insert new interests
      const interestData = interests.map(interest => ({
        user_id: userId,
        interest_name: interest,
        interest_category: (interestCategories[interest] || 'lifestyle') as 'fitness' | 'nutrition' | 'wellness' | 'lifestyle',
        created_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('user_interests')
        .insert(interestData)
        .select();

      if (error) {
        return { interests: null, error: { message: error.message } };
      }

      return { interests: data, error: null };
    } catch (error) {
      return { 
        interests: null, 
        error: { message: 'Failed to add user interests' } 
      };
    }
  }

  // Enhanced Add User Goals with better structure
  static async addUserGoals(
    userId: string,
    goals: string[]
  ): Promise<{ goals: FitnessGoal[] | null; error: AuthError | null }> {
    try {
      // First, delete existing goals
      await supabase
        .from('fitness_goals')
        .delete()
        .eq('user_id', userId);

      // Then insert new goals
      const goalData = goals.map((goal, index) => ({
        user_id: userId,
        goal_name: goal,
        goal_type: (index === 0 ? 'primary' : 'secondary') as 'primary' | 'secondary',
        is_achieved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('fitness_goals')
        .insert(goalData)
        .select();

      if (error) {
        return { goals: null, error: { message: error.message } };
      }

      return { goals: data, error: null };
    } catch (error) {
      return { 
        goals: null, 
        error: { message: 'Failed to add user goals' } 
      };
    }
  }

  // Get User Interests
  static async getUserInterests(userId: string): Promise<{ 
    interests: UserInterest[] | null; 
    error: AuthError | null 
  }> {
    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        return { interests: null, error: { message: error.message } };
      }

      return { interests: data, error: null };
    } catch (error) {
      return { 
        interests: null, 
        error: { message: 'Failed to fetch user interests' } 
      };
    }
  }

  // Get User Goals
  static async getUserGoals(userId: string): Promise<{ 
    goals: FitnessGoal[] | null; 
    error: AuthError | null 
  }> {
    try {
      const { data, error } = await supabase
        .from('fitness_goals')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        return { goals: null, error: { message: error.message } };
      }

      return { goals: data, error: null };
    } catch (error) {
      return { 
        goals: null, 
        error: { message: 'Failed to fetch user goals' } 
      };
    }
  }
}
