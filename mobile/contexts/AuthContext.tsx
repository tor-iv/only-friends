import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, AuthResponse, User } from "@/lib/api-client";
import { secureStorage, storage, STORAGE_KEYS } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    phoneNumber: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    phone_number: string;
    email?: string;
    first_name: string;
    last_name: string;
    username?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendVerificationCode: (
    phoneNumber: string
  ) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneNumber: (
    phoneNumber: string,
    code: string
  ) => Promise<{
    success: boolean;
    error?: string;
    isNewUser?: boolean;
    phoneNumber?: string;
  }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      const accessToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const storedUser = await storage.getObject<User>(STORAGE_KEYS.USER_DATA);

      if (accessToken && refreshToken && storedUser) {
        // Verify token is still valid
        const response = await apiClient.getCurrentUser();

        if (response.success && response.data) {
          setUser(response.data);
          await storage.setObject(STORAGE_KEYS.USER_DATA, response.data);
        } else {
          // Try to refresh token
          const refreshResponse = await apiClient.refreshToken(refreshToken);
          if (refreshResponse.success && refreshResponse.data) {
            await storeTokens(refreshResponse.data);

            // Get user data with new token
            const userResponse = await apiClient.getCurrentUser();
            if (userResponse.success && userResponse.data) {
              setUser(userResponse.data);
              await storage.setObject(STORAGE_KEYS.USER_DATA, userResponse.data);
            } else {
              await clearStoredAuth();
            }
          } else {
            await clearStoredAuth();
          }
        }
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearStoredAuth = async () => {
    await secureStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER_DATA);
    setUser(null);
  };

  const storeTokens = async (authResponse: AuthResponse) => {
    if (authResponse.access_token) {
      await secureStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        authResponse.access_token
      );
    }
    if (authResponse.refresh_token) {
      await secureStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        authResponse.refresh_token
      );
    }
  };

  const storeAuthData = async (authResponse: AuthResponse, userData?: User) => {
    await storeTokens(authResponse);

    if (userData) {
      await storage.setObject(STORAGE_KEYS.USER_DATA, userData);
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
        // Existing user - store tokens first
        await storeTokens(authData);

        // Then get full user data
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          await storeAuthData(authData, userResponse.data);
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
        // Store tokens first
        await storeTokens(authData);

        // Get full user data
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          await storeAuthData(authData, userResponse.data);
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
        // Store tokens first
        await storeTokens(authData);

        // Get full user data
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          await storeAuthData(authData, userResponse.data);
        }
      }

      return { success: true };
    }

    return {
      success: false,
      error: response.error,
    };
  };

  const logout = async () => {
    await clearStoredAuth();
  };

  const refreshAuth = async () => {
    const refreshToken = await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      const response = await apiClient.refreshToken(refreshToken);

      if (response.success && response.data) {
        await storeTokens(response.data);

        // Get updated user data
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          await storage.setObject(STORAGE_KEYS.USER_DATA, userResponse.data);
        }
      } else {
        await clearStoredAuth();
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
