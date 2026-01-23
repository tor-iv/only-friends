import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile, ProfileInsert } from "@/types/database";

interface AuthContextType {
  // Supabase user (auth state)
  user: User | null;
  // Profile data (from profiles table)
  profile: Profile | null;
  // Loading states
  isLoading: boolean;
  isProfileLoading: boolean;
  // Derived states
  isAuthenticated: boolean;
  hasProfile: boolean;
  // Auth methods
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (
    phoneNumber: string,
    token: string
  ) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  signOut: () => Promise<void>;
  // Profile methods
  createProfile: (data: {
    display_name: string;
    avatar_url: string;
    bio?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (
    data: Partial<Pick<Profile, "display_name" | "avatar_url" | "bio" | "notification_time">>
  ) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  // Invite code tracking (for new user flow)
  pendingInviteCodeId: string | null;
  setPendingInviteCodeId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [pendingInviteCodeId, setPendingInviteCodeId] = useState<string | null>(null);

  // Fetch profile for a user
  const fetchProfile = useCallback(async (userId: string) => {
    setIsProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Profile doesn't exist yet (new user)
        if (error.code === "PGRST116") {
          setProfile(null);
          return null;
        }
        console.error("Error fetching profile:", error);
        setProfile(null);
        return null;
      }

      setProfile(data);
      await storage.setObject(STORAGE_KEYS.USER_DATA, data);
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);

        if (session?.user) {
          setUser(session.user);

          // Fetch profile on sign in
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            await fetchProfile(session.user.id);
          }
        } else {
          setUser(null);
          setProfile(null);
          await storage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Send OTP to phone number
  const sendOtp = async (phoneNumber: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send verification code",
      };
    }
  };

  // Verify OTP
  const verifyOtp = async (phoneNumber: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token,
        type: "sms",
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Check if this is a new user (no profile yet)
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        const isNewUser = !profileData;

        return { success: true, isNewUser };
      }

      return { success: false, error: "Verification failed" };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify code",
      };
    }
  };

  // Create profile for new user
  const createProfile = async (data: {
    display_name: string;
    avatar_url: string;
    bio?: string;
  }) => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      // Get phone number from user metadata
      const phoneNumber = user.phone;
      if (!phoneNumber) {
        return { success: false, error: "Phone number not found" };
      }

      const profileData: ProfileInsert = {
        id: user.id,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        bio: data.bio || null,
        phone_number: phoneNumber,
      };

      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        return { success: false, error: error.message };
      }

      // Claim the invite code if one was used
      if (pendingInviteCodeId) {
        await supabase
          .from("invite_codes")
          .update({
            used_by_user_id: user.id,
            used_at: new Date().toISOString(),
          })
          .eq("id", pendingInviteCodeId);

        setPendingInviteCodeId(null);
      }

      setProfile(newProfile);
      await storage.setObject(STORAGE_KEYS.USER_DATA, newProfile);

      return { success: true };
    } catch (error) {
      console.error("Error creating profile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create profile",
      };
    }
  };

  // Update existing profile
  const updateProfile = async (
    data: Partial<Pick<Profile, "display_name" | "avatar_url" | "bio" | "notification_time">>
  ) => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(updatedProfile);
      await storage.setObject(STORAGE_KEYS.USER_DATA, updatedProfile);

      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setPendingInviteCodeId(null);
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isProfileLoading,
    isAuthenticated: !!user,
    hasProfile: !!profile,
    sendOtp,
    verifyOtp,
    signOut,
    createProfile,
    updateProfile,
    refreshProfile,
    pendingInviteCodeId,
    setPendingInviteCodeId,
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
