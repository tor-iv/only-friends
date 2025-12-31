import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "../../components/ui";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { User, Post } from "../../types";
import type { ProfileStackParamList } from "../../types/navigation";

const { width } = Dimensions.get("window");
const POST_SIZE = (width - 4) / 3;

type FriendDetailRoute = RouteProp<ProfileStackParamList, "FriendDetail">;

interface UserProfile extends User {
  friend_count?: number;
  post_count?: number;
  is_friend?: boolean;
  is_friend_request_sent?: boolean;
}

export function FriendDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<FriendDetailRoute>();
  const { userId } = route.params;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // Load user profile
      const profileResult = await apiClient.getUserById(userId);
      if (profileResult.success && profileResult.data) {
        setProfile(profileResult.data as UserProfile);
      }

      // Load user's posts (from feed, filtered)
      const postsResult = await apiClient.getFeed(100, 0);
      if (postsResult.success && postsResult.data) {
        const userPosts = postsResult.data.filter(
          (post) => post.user_id === userId
        );
        setPosts(userPosts);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSendFriendRequest = async () => {
    setActionLoading(true);
    try {
      const result = await apiClient.sendFriendRequest(userId);
      if (result.success) {
        setProfile((prev) =>
          prev ? { ...prev, is_friend_request_sent: true } : null
        );
        Alert.alert("Success", "Friend request sent!");
      } else {
        Alert.alert("Error", result.error || "Failed to send friend request");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${profile?.first_name} as a friend?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setActionLoading(true);
            try {
              const result = await apiClient.removeFriend(userId);
              if (result.success) {
                setProfile((prev) =>
                  prev ? { ...prev, is_friend: false } : null
                );
              } else {
                Alert.alert("Error", result.error || "Failed to remove friend");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      className="bg-cream-400"
      style={{ width: POST_SIZE, height: POST_SIZE, margin: 1 }}
      activeOpacity={0.8}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-forest-100 p-2">
          <Text
            className="text-charcoal-400 font-sans text-xs text-center"
            numberOfLines={4}
          >
            {item.content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream-300 items-center justify-center">
        <ActivityIndicator size="large" color={colors.forest[500]} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-cream-300">
        <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans text-charcoal-300">User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`;

  const renderHeader = () => (
    <View className="bg-cream-300">
      {/* Profile Header */}
      <View className="items-center pt-6 pb-4">
        <Avatar name={fullName} imageUrl={profile.avatar_url} size="lg" />
        <Text className="font-serif-bold text-2xl text-charcoal-400 mt-3">
          {fullName}
        </Text>
        {profile.username && (
          <Text className="font-sans text-charcoal-300 mt-1">
            @{profile.username}
          </Text>
        )}
        {profile.bio && (
          <Text className="font-sans text-charcoal-400 text-center mt-2 px-8">
            {profile.bio}
          </Text>
        )}
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-center gap-8 py-4 border-y border-cream-400">
        <View className="items-center">
          <Text className="font-sans-bold text-xl text-charcoal-400">
            {profile.friend_count || 0}
          </Text>
          <Text className="font-sans text-charcoal-300 text-sm">Friends</Text>
        </View>
        <View className="items-center">
          <Text className="font-sans-bold text-xl text-charcoal-400">
            {posts.length}
          </Text>
          <Text className="font-sans text-charcoal-300 text-sm">Posts</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center gap-3 py-4 px-4">
        {profile.is_friend ? (
          <>
            <TouchableOpacity
              className="flex-1 bg-forest-500 py-3 rounded-full items-center"
              disabled={actionLoading}
            >
              <Text className="font-sans-semibold text-white">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-cream-400 py-3 px-4 rounded-full items-center"
              onPress={handleRemoveFriend}
              disabled={actionLoading}
            >
              <Ionicons name="person-remove-outline" size={20} color={colors.charcoal[400]} />
            </TouchableOpacity>
          </>
        ) : profile.is_friend_request_sent ? (
          <View className="flex-1 bg-cream-400 py-3 rounded-full items-center">
            <Text className="font-sans-semibold text-charcoal-400">Request Sent</Text>
          </View>
        ) : (
          <Button
            onPress={handleSendFriendRequest}
            disabled={actionLoading}
            loading={actionLoading}
            className="flex-1"
          >
            Add Friend
          </Button>
        )}
      </View>

      {/* Posts Section Header */}
      <View className="flex-row items-center justify-center py-3 border-b border-cream-400">
        <Ionicons name="grid-outline" size={20} color={colors.charcoal[400]} />
        <Text className="font-sans-semibold text-charcoal-400 ml-2">Posts</Text>
      </View>
    </View>
  );

  const renderEmptyPosts = () => (
    <View className="items-center justify-center py-16">
      <Ionicons name="camera-outline" size={48} color={colors.charcoal[300]} />
      <Text className="font-sans text-charcoal-300 mt-4 text-center">
        No posts yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      {/* Header Bar */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-serif-bold text-lg text-charcoal-400 mr-6">
          {fullName}
        </Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyPosts}
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
