import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { AuthService, ProfileService } from '@/lib/auth-service';
import { UserProfile, AuthError, OnboardingData } from '@/lib/supabase';

interface AuthContextType {
  // Auth State
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  
  // Auth Methods
  signUp: (email: string, password: string, fullName: string) => Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }>;

  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  
  // Profile Methods
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{
    profile: UserProfile | null;
    error: AuthError | null;
  }>;
  uploadProfilePicture: (imageUri: string) => Promise<{
    url: string | null;
    error: AuthError | null;
  }>;
  uploadCoverImage: (imageUri: string) => Promise<{
    url: string | null;
    error: AuthError | null;
  }>;
  
  // Enhanced onboarding methods
  completeOnboarding: (onboardingData: OnboardingData) => Promise<{
    profile: UserProfile | null;
    error: AuthError | null;
  }>;
  updateOnboardingStep: (step: number, stepData?: Partial<OnboardingData>) => Promise<{
    error: AuthError | null;
  }>;
  
  // User Interests & Goals
  addUserInterests: (interests: string[]) => Promise<{ error: AuthError | null }>;
  addUserGoals: (goals: string[]) => Promise<{ error: AuthError | null }>;
  
  // Refresh Methods
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentSession = await AuthService.getCurrentSession();
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          await loadUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { profile, error } = await ProfileService.getUserProfile(userId);
      if (profile && !error) {
        setProfile(profile);
      } else if (error) {
        console.error('Error loading profile:', error.message);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signUpWithEmail(email, password, fullName);
      
      if (result.user && !result.error) {
        // Create user profile
        const profileData = {
          email,
          full_name: fullName,
        };
        
        await ProfileService.createUserProfile(result.user.id, profileData);
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await AuthService.signInWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const result = await AuthService.signOut();
      if (!result.error) {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return { profile: null, error: { message: 'No authenticated user' } };
    }

    const result = await ProfileService.updateUserProfile(user.id, profileData);
    
    if (result.profile && !result.error) {
      setProfile(result.profile);
    }
    
    return result;
  };

  const uploadProfilePicture = async (imageUri: string) => {
    if (!user) {
      return { url: null, error: { message: 'No authenticated user' } };
    }

    const result = await ProfileService.uploadProfilePicture(user.id, imageUri);
    
    if (result.url && !result.error) {
      // Update profile with new picture URL
      await updateProfile({ profile_picture_url: result.url });
    }
    
    return result;
  };

  const uploadCoverImage = async (imageUri: string) => {
    if (!user) {
      return { url: null, error: { message: 'No authenticated user' } };
    }

    const result = await ProfileService.uploadCoverImage(user.id, imageUri);
    
    if (result.url && !result.error) {
      // Update profile with new cover image URL
      await updateProfile({ cover_image_url: result.url });
    }
    
    return result;
  };

  const addUserInterests = async (interests: string[]) => {
    if (!user) {
      return { error: { message: 'No authenticated user' } };
    }

    const { error } = await ProfileService.addUserInterests(user.id, interests);
    return { error };
  };

  const addUserGoals = async (goals: string[]) => {
    if (!user) {
      return { error: { message: 'No authenticated user' } };
    }

    const { error } = await ProfileService.addUserGoals(user.id, goals);
    return { error };
  };

  const completeOnboarding = async (onboardingData: OnboardingData) => {
    if (!user) {
      return { profile: null, error: { message: 'No authenticated user' } };
    }

    const result = await ProfileService.completeOnboarding(user.id, onboardingData);
    
    if (result.profile && !result.error) {
      setProfile(result.profile);
    }
    
    return result;
  };

  const updateOnboardingStep = async (step: number, stepData?: Partial<OnboardingData>) => {
    if (!user) {
      return { error: { message: 'No authenticated user' } };
    }

    return await ProfileService.updateOnboardingStep(user.id, step, stepData);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    uploadProfilePicture,
    uploadCoverImage,
    completeOnboarding,
    updateOnboardingStep,
    addUserInterests,
    addUserGoals,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
