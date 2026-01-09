import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "../../components/ui";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { User } from "../../types";

export default function FriendDetailScreen() {
  const router = useRouter();
  const { id: userId } = useLocalSearchParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!userId) return;

    const result = await apiClient.getUserById(userId);
    if (result.success && result.data) {
      setUser(result.data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleMessage = () => {
    router.push(`/messages/${userId}`);
  };

  const handleRemoveFriend = () => {
    if (!userId) return;

    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${user?.first_name} ${user?.last_name} as a friend?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const result = await apiClient.removeFriend(userId);
            if (result.success) {
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${user?.first_name} ${user?.last_name}? They won't be able to see your profile or contact you.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            // Implement block functionality
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.forest[500]} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
        <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-charcoal-300">User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-lg text-charcoal-400 mr-6">
          {fullName}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center py-6 bg-white">
          <Avatar name={fullName} imageUrl={user.avatar_url} size="lg" />
          <Text className="text-xl font-bold text-charcoal-400 mt-4">
            {fullName}
          </Text>
          {user.username && (
            <Text className="text-charcoal-300">@{user.username}</Text>
          )}
          {user.bio && (
            <Text className="text-charcoal-400 text-center px-8 mt-3">
              {user.bio}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View className="px-4 py-4 flex-row gap-3">
          <View className="flex-1">
            <Button onPress={handleMessage}>
              Message
            </Button>
          </View>
        </View>

        {/* Info Section */}
        <View className="mt-4">
          <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2">
            Info
          </Text>

          {user.phone_number && (
            <View className="flex-row items-center px-4 py-4 bg-white">
              <Ionicons name="call-outline" size={20} color={colors.charcoal[400]} />
              <Text className="ml-3 text-charcoal-400">{user.phone_number}</Text>
            </View>
          )}

          {user.email && (
            <>
              <View className="h-px bg-cream-400" />
              <View className="flex-row items-center px-4 py-4 bg-white">
                <Ionicons name="mail-outline" size={20} color={colors.charcoal[400]} />
                <Text className="ml-3 text-charcoal-400">{user.email}</Text>
              </View>
            </>
          )}
        </View>

        {/* Danger Zone */}
        <View className="mt-8 px-4 pb-8">
          <TouchableOpacity
            onPress={handleRemoveFriend}
            className="py-3 items-center"
          >
            <Text className="text-red-600">Remove Friend</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBlock}
            className="py-3 items-center"
          >
            <Text className="text-red-600">Block User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
