import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/ui";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { Post } from "../../types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../types/navigation";

const { width } = Dimensions.get("window");
const POST_SIZE = (width - 4) / 3; // 3 columns with 2px gaps

type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList, "Profile">;

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavProp>();
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [friendCount, setFriendCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      // Load user's posts
      const postsResult = await apiClient.getFeed(100, 0);
      if (postsResult.success && postsResult.data) {
        // Filter to only current user's posts
        const myPosts = postsResult.data.filter(
          (post) => post.user_id === user?.id
        );
        setPosts(myPosts);
        setPostCount(myPosts.length);
      }

      // Load friends count
      const friendsResult = await apiClient.getFriends();
      if (friendsResult.success && friendsResult.data) {
        setFriendCount(Array.isArray(friendsResult.data) ? friendsResult.data.length : 0);
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const fullName = user ? `${user.first_name} ${user.last_name}` : "";

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

  const renderHeader = () => (
    <View className="bg-cream-300">
      {/* Profile Header */}
      <View className="items-center pt-6 pb-4">
        <Avatar name={fullName} imageUrl={user?.avatar_url} size="lg" />
        <Text className="font-serif-bold text-2xl text-charcoal-400 mt-3">
          {fullName}
        </Text>
        {user?.username && (
          <Text className="font-sans text-charcoal-300 mt-1">
            @{user.username}
          </Text>
        )}
        {user?.bio && (
          <Text className="font-sans text-charcoal-400 text-center mt-2 px-8">
            {user.bio}
          </Text>
        )}
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-center gap-8 py-4 border-y border-cream-400">
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("Friends")}
        >
          <Text className="font-sans-bold text-xl text-charcoal-400">
            {friendCount}
          </Text>
          <Text className="font-sans text-charcoal-300 text-sm">Friends</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text className="font-sans-bold text-xl text-charcoal-400">
            {postCount}
          </Text>
          <Text className="font-sans text-charcoal-300 text-sm">Posts</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center gap-3 py-4 px-4">
        <TouchableOpacity
          className="flex-1 bg-forest-500 py-3 rounded-full items-center"
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text className="font-sans-semibold text-white">Edit Profile</Text>
        </TouchableOpacity>
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
      <Text className="font-sans text-charcoal-300 text-sm text-center mt-1">
        Share your first moment with friends
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-cream-400">
        <View style={{ width: 40 }} />
        <Text className="font-serif-bold text-lg text-charcoal-400">
          Profile
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="settings-outline" size={24} color={colors.charcoal[400]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyPosts : null}
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
