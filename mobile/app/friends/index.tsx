import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/ui";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { Friend, User } from "../../types";

export default function FriendsListScreen() {
  const router = useRouter();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFriends = useCallback(async () => {
    const result = await apiClient.getFriends();
    if (result.success && result.data) {
      setFriends(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  };

  const handleFriendPress = (userId: string) => {
    router.push(`/friends/${userId}`);
  };

  const filteredFriends = friends.filter((friend) => {
    if (!searchQuery.trim()) return true;
    const fullName = `${friend.user.first_name} ${friend.user.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const renderItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      onPress={() => handleFriendPress(item.user.id)}
      className="flex-row items-center px-4 py-3 bg-white"
      activeOpacity={0.7}
    >
      <Avatar
        name={`${item.user.first_name} ${item.user.last_name}`}
        imageUrl={item.user.avatar_url}
        size="md"
      />
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-charcoal-400">
          {item.user.first_name} {item.user.last_name}
        </Text>
        {item.user.username && (
          <Text className="text-sm text-charcoal-300">
            @{item.user.username}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.charcoal[300]} />
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View className="flex-1 items-center justify-center py-20 px-6">
        <Ionicons name="people-outline" size={48} color={colors.charcoal[300]} />
        <Text className="text-lg font-bold text-charcoal-400 text-center mt-4">
          {searchQuery ? "No friends found" : "No friends yet"}
        </Text>
        <Text className="text-charcoal-300 text-center mt-2">
          {searchQuery
            ? "Try a different search term"
            : "Start connecting with friends!"}
        </Text>
      </View>
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
          Friends
        </Text>
      </View>

      {/* Search */}
      <View className="px-4 py-3 bg-white border-b border-cream-400">
        <View className="flex-row items-center bg-cream-200 rounded-lg px-3 py-2">
          <Ionicons name="search" size={18} color={colors.charcoal[300]} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search friends..."
            placeholderTextColor={colors.charcoal[300]}
            className="flex-1 ml-2 text-charcoal-400"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.charcoal[300]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Friends count */}
      <View className="px-4 py-2">
        <Text className="text-charcoal-300 text-sm">
          {filteredFriends.length} friend{filteredFriends.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Friends list */}
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View className="h-px bg-cream-400" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.forest[500]}
          />
        }
        contentContainerStyle={filteredFriends.length === 0 ? { flex: 1 } : undefined}
      />
    </SafeAreaView>
  );
}
