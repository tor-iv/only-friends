import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Phone, Trash2 } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme";

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Final Confirmation",
      "This will permanently delete:\n\n- Your profile\n- All your posts\n- All your connections\n\nAre you absolutely sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: executeDeleteAccount,
        },
      ]
    );
  };

  const executeDeleteAccount = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      // Delete profile (will cascade to posts, connections, etc.)
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      // Sign out (this will also navigate to auth)
      await signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "Not set";
    // Simple formatting: +1 (XXX) XXX-XXXX
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone;
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-300 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft color={colors.charcoal[400]} size={24} />
        </TouchableOpacity>
        <Text
          className="flex-1 text-center text-lg text-charcoal-400 mr-6"
          style={{ fontFamily: "Cabin_600SemiBold" }}
        >
          Account
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Phone Number Section */}
        <View className="mt-4 bg-white border-y border-cream-200">
          <View className="flex-row items-center px-4 py-4">
            <View className="w-10 h-10 rounded-full bg-forest-100 items-center justify-center">
              <Phone color={colors.forest[500]} size={20} />
            </View>
            <View className="ml-3 flex-1">
              <Text
                className="text-sm text-charcoal-300"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Phone Number
              </Text>
              <Text
                className="text-charcoal-400 mt-0.5"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                {formatPhoneNumber(profile?.phone_number || user?.phone)}
              </Text>
            </View>
          </View>
          <View className="px-4 pb-3">
            <Text
              className="text-xs text-charcoal-300"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              Your phone number is used to sign in and cannot be changed.
            </Text>
          </View>
        </View>

        {/* Account Info */}
        <View className="px-4 py-3 mt-4">
          <Text
            className="text-xs text-charcoal-300 uppercase"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Account Created
          </Text>
          <Text
            className="text-charcoal-400 mt-1"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown"}
          </Text>
        </View>

        {/* Delete Account Section */}
        <View className="mt-8">
          <View className="px-4 py-2">
            <Text
              className="text-xs text-charcoal-300 uppercase"
              style={{ fontFamily: "Cabin_600SemiBold" }}
            >
              Danger Zone
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={deleting}
            className="flex-row items-center px-4 py-4 bg-white border-y border-cream-200"
          >
            <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
              {deleting ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Trash2 color="#DC2626" size={20} />
              )}
            </View>
            <View className="ml-3 flex-1">
              <Text
                className="text-red-600"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                Delete Account
              </Text>
              <Text
                className="text-xs text-charcoal-300 mt-0.5"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Permanently delete your account and all data
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
