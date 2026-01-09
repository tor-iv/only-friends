import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/ui";
import { colors } from "../../theme";

interface BlockedUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

// Mock data for blocked users
const MOCK_BLOCKED_USERS: BlockedUser[] = [];

export default function BlockedAccountsScreen() {
  const router = useRouter();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(MOCK_BLOCKED_USERS);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${user.first_name} ${user.last_name}?`,
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

  const renderItem = ({ item }: { item: BlockedUser }) => (
    <View className="flex-row items-center px-4 py-3 bg-white">
      <Avatar
        name={`${item.first_name} ${item.last_name}`}
        imageUrl={item.avatar_url}
        size="md"
      />
      <Text className="flex-1 ml-3 font-semibold text-charcoal-400">
        {item.first_name} {item.last_name}
      </Text>
      <TouchableOpacity
        onPress={() => handleUnblock(item)}
        className="px-4 py-2 rounded-lg bg-cream-400"
      >
        <Text className="text-charcoal-400 font-medium">Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20 px-6">
      <Ionicons name="ban-outline" size={48} color={colors.charcoal[300]} />
      <Text className="text-lg font-bold text-charcoal-400 text-center mt-4">
        No blocked accounts
      </Text>
      <Text className="text-charcoal-300 text-center mt-2">
        When you block someone, they'll appear here
      </Text>
    </View>
  );

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
          Blocked Accounts
        </Text>
      </View>

      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View className="h-px bg-cream-400" />}
        contentContainerStyle={blockedUsers.length === 0 ? { flex: 1 } : undefined}
      />
    </SafeAreaView>
  );
}
