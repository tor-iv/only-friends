import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";

export function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { user, refreshUser, logout } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSaveEmail = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      const result = await apiClient.updateProfile({ email: email.trim() });
      if (result.success) {
        await refreshUser();
        Alert.alert("Success", "Email updated successfully");
      } else {
        Alert.alert("Error", result.error || "Failed to update email");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Delete",
              "All your data will be permanently deleted. Type DELETE to confirm.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Account",
                  style: "destructive",
                  onPress: () => {
                    // In a real app, this would call a delete account API
                    logout();
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
          </TouchableOpacity>
          <Text className="flex-1 text-center font-serif-bold text-lg text-charcoal-400 mr-6">
            Account Settings
          </Text>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Phone Number (Read-only) */}
          <View className="px-4 py-4 bg-white mt-4">
            <Text className="font-sans-semibold text-charcoal-400 mb-2">
              Phone Number
            </Text>
            <Text className="font-sans text-charcoal-300">
              {user?.phone_number}
            </Text>
            <Text className="font-sans text-xs text-charcoal-300 mt-1">
              Contact support to change your phone number
            </Text>
          </View>

          {/* Email */}
          <View className="px-4 py-4 bg-white mt-4">
            <Text className="font-sans-semibold text-charcoal-400 mb-2">
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.charcoal[300]}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-cream-100 border border-cream-400 rounded-lg px-4 py-3 font-sans text-charcoal-400"
            />
            <View className="mt-3">
              <Button
                onPress={handleSaveEmail}
                disabled={loading || email === user?.email}
                loading={loading}
                size="sm"
              >
                Update Email
              </Button>
            </View>
          </View>

          {/* Change Password */}
          <TouchableOpacity className="px-4 py-4 bg-white mt-4 flex-row items-center justify-between">
            <View>
              <Text className="font-sans-semibold text-charcoal-400">
                Change Password
              </Text>
              <Text className="font-sans text-xs text-charcoal-300 mt-1">
                Update your password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.charcoal[300]} />
          </TouchableOpacity>

          {/* Delete Account */}
          <View className="mt-8 px-4">
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="py-4 items-center"
            >
              <Text className="font-sans text-red-600">Delete Account</Text>
            </TouchableOpacity>
            <Text className="font-sans text-xs text-charcoal-300 text-center mt-2">
              Permanently delete your account and all data
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
