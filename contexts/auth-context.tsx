'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, AuthResponse } from '@/lib/api-client';

interface User {
  id: string;
  phone_number: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    phone_number: string;
    email?: string;
    first_name: string;
    last_name: string;
    username?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  sendVerificationCode: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneNumber: (phoneNumber: string, code: string) => Promise<{ 
    success: boolean; 
    error?: string; 
    isNewUser?: boolean;
    phoneNumber?: string;
  }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_STORAGE_KEY = 'auth_user';

interface StoredTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedTokens && storedUser) {
        const tokens: StoredTokens = JSON.parse(storedTokens);
        const userData: User = JSON.parse(storedUser);

        // Verify token is still valid
        const response = await apiClient.getCurrentUser(tokens.access_token);
        
        if (response.success) {
          setUser(userData);
        } else {
          // Try to refresh token
          const refreshResponse = await apiClient.refreshToken(tokens.refresh_token);
          if (refreshResponse.success && refreshResponse.data) {
            const newTokens = refreshResponse.data;
            localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newTokens));
            
            // Get user data with new token
            const userResponse = await apiClient.getCurrentUser(newTokens.access_token);
            if (userResponse.success) {
              setUser(userResponse.data);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userResponse.data));
            } else {
              clearStoredAuth();
            }
          } else {
            clearStoredAuth();
          }
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const storeAuthData = (authResponse: AuthResponse, userData?: User) => {
    if (authResponse.access_token && authResponse.refresh_token) {
      const tokens: StoredTokens = {
        access_token: authResponse.access_token,
        refresh_token: authResponse.refresh_token,
        token_type: authResponse.token_type || 'Bearer',
      };
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    }

    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    }
  };

  const sendVerificationCode = async (phoneNumber: string) => {
    const response = await apiClient.sendVerificationCode(phoneNumber);
    return {
      success: response.success,
      error: response.error,
    };
  };

  const verifyPhoneNumber = async (phoneNumber: string, code: string) => {
    const response = await apiClient.verifyPhoneNumber(phoneNumber, code);
    
    if (response.success && response.data) {
      const authData = response.data;
      
      if (!authData.is_new_user && authData.access_token) {
        // Existing user - get full user data and store auth
        const userResponse = await apiClient.getCurrentUser(authData.access_token);
        if (userResponse.success) {
          storeAuthData(authData, userResponse.data);
        }
      }
      
      return {
        success: true,
        isNewUser: authData.is_new_user,
        phoneNumber: authData.phone_number,
      };
    }

    return {
      success: false,
      error: response.error,
    };
  };

  const register = async (data: {
    phone_number: string;
    email?: string;
    first_name: string;
    last_name: string;
    username?: string;
    password: string;
  }) => {
    const response = await apiClient.register(data);
    
    if (response.success && response.data) {
      const authData = response.data;
      
      if (authData.access_token) {
        // Get full user data
        const userResponse = await apiClient.getCurrentUser(authData.access_token);
        if (userResponse.success) {
          storeAuthData(authData, userResponse.data);
        }
      }
      
      return { success: true };
    }

    return {
      success: false,
      error: response.error,
    };
  };

  const login = async (phoneNumber: string, password: string) => {
    const response = await apiClient.login(phoneNumber, password);
    
    if (response.success && response.data) {
      const authData = response.data;
      
      if (authData.access_token) {
        // Get full user data
        const userResponse = await apiClient.getCurrentUser(authData.access_token);
        if (userResponse.success) {
          storeAuthData(authData, userResponse.data);
        }
      }
      
      return { success: true };
    }

    return {
      success: false,
      error: response.error,
    };
  };

  const logout = () => {
    clearStoredAuth();
  };

  const refreshAuth = async () => {
    const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedTokens) {
      const tokens: StoredTokens = JSON.parse(storedTokens);
      const response = await apiClient.refreshToken(tokens.refresh_token);
      
      if (response.success && response.data) {
        const newTokens = response.data;
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newTokens));
        
        // Get updated user data
        const userResponse = await apiClient.getCurrentUser(newTokens.access_token);
        if (userResponse.success) {
          setUser(userResponse.data);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userResponse.data));
        }
      } else {
        clearStoredAuth();
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    sendVerificationCode,
    verifyPhoneNumber,
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
