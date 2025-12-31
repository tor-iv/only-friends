import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/ui";
import { colors } from "../../theme";
import type { User } from "../../types";

interface BlockedUser {
  id: string;
  user: User;
  blocked_at: string;
}

export function BlockedAccountsScreen() {
  const navigation = useNavigation();

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlockedUsers = useCallback(async () => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate an empty list
      setBlockedUsers([]);
    } catch (error) {
      console.error("Failed to load blocked users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlockedUsers();
  }, [loadBlockedUsers]);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${user.user.first_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          onPress: () => {
            setBlockedUsers((prev) => prev.filter((u) => u.id !== user.id));
          },
        },
      ]
    );
  };

  const renderBlockedUser = ({ item }: { item: BlockedUser }) => {
    const fullName = `${item.user.first_name} ${item.user.last_name}`;

    return (
      <View className="flex-row items-center px-4 py-3 bg-white">
        <Avatar name={fullName} imageUrl={item.user.avatar_url} size="md" />
        <View className="flex-1 ml-3">
          <Text className="font-sans-semibold text-charcoal-400">{fullName}</Text>
          {item.user.username && (
            <Text className="font-sans text-charcoal-300 text-sm">
              @{item.user.username}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="bg-cream-400 px-4 py-2 rounded-full"
          onPress={() => handleUnblock(item)}
        >
          <Text className="font-sans-semibold text-charcoal-400 text-sm">
            Unblock
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSeparator = () => <View className="h-px bg-cream-400 ml-16" />;

  const renderEmptyList = () => (
    <View className="items-center justify-center py-16">
      <Ionicons name="ban-outline" size={48} color={colors.charcoal[300]} />
      <Text className="font-sans text-charcoal-400 mt-4 text-center">
        No blocked accounts
      </Text>
      <Text className="font-sans text-charcoal-300 text-sm text-center mt-1 px-8">
        When you block someone, they won't be able to see your profile or contact you
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream-300 items-center justify-center">
        <ActivityIndicator size="large" color={colors.forest[500]} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-serif-bold text-lg text-charcoal-400 mr-6">
          Blocked Accounts
        </Text>
      </View>

      <FlatList
        data={blockedUsers}
        renderItem={renderBlockedUser}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
