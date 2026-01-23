'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, auth } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  phone_number: string;
  is_verified: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Profile fields (from profiles table)
  display_name?: string;
  avatar_url?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendVerificationCode: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneNumber: (phoneNumber: string, code: string) => Promise<{
    success: boolean;
    error?: string;
    isNewUser?: boolean;
    phoneNumber?: string;
  }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { session: currentSession, error } = await auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }

        if (currentSession) {
          setSession(currentSession);
          setSupabaseUser(currentSession.user);

          // Try to fetch user profile from database
          await loadUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      setSupabaseUser(newSession?.user ?? null);

      if (newSession?.user) {
        await loadUserProfile(newSession.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Get user from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      // Also try to get profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userData && !userError) {
        setUser({
          id: userData.id,
          phone_number: userData.phone_number || '',
          is_verified: userData.is_verified || false,
          is_active: userData.is_active || true,
          created_at: userData.created_at || undefined,
          updated_at: userData.updated_at || undefined,
          // Profile fields
          display_name: profileData?.display_name || undefined,
          avatar_url: profileData?.avatar_url || undefined,
          bio: profileData?.bio || undefined,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const sendVerificationCode = async (phoneNumber: string) => {
    try {
      const { error } = await auth.sendOtp(phoneNumber);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false, error: 'Failed to send verification code' };
    }
  };

  const verifyPhoneNumber = async (phoneNumber: string, code: string) => {
    try {
      const { data, error } = await auth.verifyOtp(phoneNumber, code);

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setSupabaseUser(data.user);
        setSession(data.session);

        // Check if user exists in our users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single();

        const isNewUser = !existingUser;

        if (!isNewUser) {
          await loadUserProfile(data.user.id);
        }

        return {
          success: true,
          isNewUser,
          phoneNumber,
        };
      }

      return { success: false, error: 'Verification failed' };
    } catch (error) {
      console.error('Error verifying phone number:', error);
      return { success: false, error: 'Failed to verify phone number' };
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshAuth = async () => {
    try {
      const { session: currentSession } = await auth.getSession();
      if (currentSession?.user) {
        setSession(currentSession);
        setSupabaseUser(currentSession.user);
        await loadUserProfile(currentSession.user.id);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    isLoading,
    isAuthenticated: !!supabaseUser,
    sendVerificationCode,
    verifyPhoneNumber,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
