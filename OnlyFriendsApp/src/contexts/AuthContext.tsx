import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient, storage } from "../lib";
import type { User, AuthResponse } from "../types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setTokensAndUser: (authResponse: AuthResponse) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const accessToken = await storage.getAccessToken();
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      // Try to get current user
      const result = await apiClient.getCurrentUser();
      if (result.success && result.data) {
        setUser(result.data);
        await storage.setUser(result.data);
      } else {
        // Token might be expired, try to refresh
        const refreshResult = await apiClient.refreshToken();
        if (refreshResult.success) {
          const userResult = await apiClient.getCurrentUser();
          if (userResult.success && userResult.data) {
            setUser(userResult.data);
            await storage.setUser(userResult.data);
          } else {
            await storage.clearAll();
          }
        } else {
          await storage.clearAll();
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
      await storage.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (phone: string, password: string) => {
    try {
      const result = await apiClient.login(phone, password);
      if (result.success && result.data) {
        await setTokensAndUser(result.data);
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    } catch (error) {
      return { success: false, error: "Something went wrong" };
    }
  }, []);

  const logout = useCallback(async () => {
    await storage.clearAll();
    setUser(null);
  }, []);

  const setTokensAndUser = useCallback(async (authResponse: AuthResponse) => {
    if (authResponse.access_token && authResponse.refresh_token) {
      await storage.setTokens(authResponse.access_token, authResponse.refresh_token);
    }

    // Fetch full user profile
    const userResult = await apiClient.getCurrentUser();
    if (userResult.success && userResult.data) {
      setUser(userResult.data);
      await storage.setUser(userResult.data);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const result = await apiClient.getCurrentUser();
    if (result.success && result.data) {
      setUser(result.data);
      await storage.setUser(result.data);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        setTokensAndUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
