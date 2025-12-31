import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/ui";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { User } from "../../types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../types/navigation";

type FriendsNavProp = NativeStackNavigationProp<ProfileStackParamList, "Friends">;

interface FriendItemData {
  id: string;
  user: User;
}

export function FriendsListScreen() {
  const navigation = useNavigation<FriendsNavProp>();

  const [friends, setFriends] = useState<FriendItemData[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<FriendItemData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFriends = useCallback(async () => {
    try {
      const result = await apiClient.getFriends();
      if (result.success && result.data) {
        const friendsData = Array.isArray(result.data) ? result.data : [];
        setFriends(friendsData);
        setFilteredFriends(friendsData);
      }
    } catch (error) {
      console.error("Failed to load friends:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = friends.filter((friend) => {
        const fullName = `${friend.user.first_name} ${friend.user.last_name}`.toLowerCase();
        const username = friend.user.username?.toLowerCase() || "";
        return fullName.includes(query) || username.includes(query);
      });
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFriends();
    setRefreshing(false);
  };

  const renderFriendItem = ({ item }: { item: FriendItemData }) => {
    const fullName = `${item.user.first_name} ${item.user.last_name}`;

    return (
      <TouchableOpacity
        className="flex-row items-center px-4 py-3 bg-white"
        onPress={() => navigation.navigate("FriendDetail", { userId: item.user.id })}
        activeOpacity={0.7}
      >
        <Avatar name={fullName} imageUrl={item.user.avatar_url} size="md" />
        <View className="flex-1 ml-3">
          <Text className="font-sans-semibold text-charcoal-400">{fullName}</Text>
          {item.user.username && (
            <Text className="font-sans text-charcoal-300 text-sm">
              @{item.user.username}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.charcoal[300]} />
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => <View className="h-px bg-cream-400 ml-16" />;

  const renderEmptyList = () => (
    <View className="items-center justify-center py-16">
      <Ionicons name="people-outline" size={48} color={colors.charcoal[300]} />
      <Text className="font-sans text-charcoal-300 mt-4 text-center">
        {searchQuery ? "No friends found" : "No friends yet"}
      </Text>
      {!searchQuery && (
        <Text className="font-sans text-charcoal-300 text-sm text-center mt-1">
          Connect with friends to see them here
        </Text>
      )}
    </View>
  );

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
          Friends
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-cream-300">
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 border border-cream-400">
          <Ionicons name="search" size={20} color={colors.charcoal[300]} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search friends..."
            placeholderTextColor={colors.charcoal[300]}
            className="flex-1 ml-2 font-sans text-charcoal-400"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.charcoal[300]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Friends List */}
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={!loading ? renderEmptyList : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.forest[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
