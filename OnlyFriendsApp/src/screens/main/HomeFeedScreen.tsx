import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PostCard, StoryRow } from "../../components";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { Post, StoryGroup } from "../../types";
import type { HomeStackParamList } from "../../types/navigation";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "HomeFeed">;

const POSTS_LIMIT = 20;

export function HomeFeedScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchFeed = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset;

    const result = await apiClient.getFeed(POSTS_LIMIT, currentOffset);

    if (result.success && result.data) {
      if (reset) {
        setPosts(result.data);
        setOffset(POSTS_LIMIT);
      } else {
        setPosts((prev) => [...prev, ...result.data!]);
        setOffset((prev) => prev + POSTS_LIMIT);
      }
      setHasMore(result.data.length === POSTS_LIMIT);
    }
  }, [offset]);

  const fetchStories = useCallback(async () => {
    const result = await apiClient.getStories();
    if (result.success && result.data) {
      setStoryGroups(result.data);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchFeed(true), fetchStories()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchFeed(true), fetchStories()]);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    await fetchFeed(false);
    setLoadingMore(false);
  };

  const handleLikeToggle = async (postId: string, isLiked: boolean) => {
    if (isLiked) {
      await apiClient.likePost(postId);
    } else {
      await apiClient.unlikePost(postId);
    }
  };

  const handleCommentPress = (postId: string) => {
    navigation.navigate("PostDetail", { postId });
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate("UserProfile", { userId });
  };

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await apiClient.deletePost(postId);
            if (result.success) {
              setPosts((prev) => prev.filter((p) => p.id !== postId));
            }
          },
        },
      ]
    );
  };

  const handleStoryPress = (userId: string) => {
    const storyGroup = storyGroups.find((g) => g.user_id === userId);
    if (storyGroup && storyGroup.stories.length > 0) {
      navigation.navigate("StoryViewer", {
        storyId: storyGroup.stories[0].id,
        userId,
      });
    }
  };

  const handleCreateStory = () => {
    // Navigate to create story - this will be in the CreateTab
    // For now, we can show an alert
    Alert.alert("Create Story", "Story creation coming soon!");
  };

  // Check if current user has an active story
  const currentUserHasStory = storyGroups.some(
    (group) => group.user_id === user?.id
  );

  const renderHeader = () => {
    if (!user) return null;

    return (
      <StoryRow
        storyGroups={storyGroups}
        currentUser={user}
        currentUserHasStory={currentUserHasStory}
        onStoryPress={handleStoryPress}
        onCreateStory={handleCreateStory}
      />
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View className="flex-1 items-center justify-center py-20 px-6">
        <Text className="text-6xl mb-4">📸</Text>
        <Text className="text-xl font-serif-bold text-charcoal-400 text-center mb-2">
          No posts yet
        </Text>
        <Text className="font-sans text-charcoal-300 text-center">
          When your friends share posts, they'll appear here. Start by adding some friends!
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={colors.forest[500]} />
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
      <View className="px-4 py-3 border-b border-cream-400 bg-cream-300">
        <Text className="text-2xl font-serif-bold text-forest-500">
          Only Friends
        </Text>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id ?? ""}
            onLikeToggle={handleLikeToggle}
            onCommentPress={handleCommentPress}
            onUserPress={handleUserPress}
            onDeletePress={handleDeletePost}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.forest[500]}
            colors={[colors.forest[500]]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={posts.length === 0 ? { flex: 1 } : undefined}
      />
    </SafeAreaView>
  );
}
