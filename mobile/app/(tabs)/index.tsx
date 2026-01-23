import { View, Text, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { getFeed, markPostViewed, deletePost } from "@/lib/posts";
import type { PostWithAuthor } from "@/types/database";
import { Check } from "lucide-react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const viewedPosts = useRef<Set<string>>(new Set());
  const viewTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const loadPosts = useCallback(async () => {
    try {
      const feedPosts = await getFeed();
      setPosts(feedPosts);
    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, [loadPosts]);

  // Track post views - mark as viewed after 1 second of visibility
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: PostWithAuthor }> }) => {
      if (!user) return;

      // Clear timers for items no longer visible
      viewTimers.current.forEach((timer, postId) => {
        const stillVisible = viewableItems.some((item) => item.item.id === postId);
        if (!stillVisible) {
          clearTimeout(timer);
          viewTimers.current.delete(postId);
        }
      });

      // Start timers for newly visible items
      viewableItems.forEach(({ item }) => {
        const postId = item.id;

        // Skip if already viewed or timer already running
        if (viewedPosts.current.has(postId) || viewTimers.current.has(postId)) {
          return;
        }

        // Skip own posts
        if (item.user_id === user.id) {
          return;
        }

        // Start 1 second timer
        const timer = setTimeout(async () => {
          viewedPosts.current.add(postId);
          viewTimers.current.delete(postId);
          await markPostViewed(postId);
        }, 1000);

        viewTimers.current.set(postId, timer);
      });
    },
    [user]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      if (userId === user?.id) {
        router.push("/(tabs)/profile");
      } else {
        router.push(`/connections/user/${userId}`);
      }
    },
    [router, user]
  );

  const handleDeletePost = useCallback(
    async (postId: string) => {
      const success = await deletePost(postId);
      if (success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    },
    []
  );

  const handleSeenByPress = useCallback(
    (postId: string) => {
      router.push(`/post/${postId}/viewers`);
    },
    [router]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      viewTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#2D4F37" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id || ""}
            onUserPress={handleUserPress}
            onDeletePress={handleDeletePost}
            onSeenByPress={handleSeenByPress}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2D4F37"
          />
        }
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 0,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8 mt-20">
            <Text
              className="text-xl text-charcoal-400 text-center mb-2"
              style={{ fontFamily: "Lora_600SemiBold" }}
            >
              No posts yet
            </Text>
            <Text
              className="text-base text-charcoal-300 text-center"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              Connect with friends to see their posts, or share your first photo!
            </Text>
          </View>
        }
        ListFooterComponent={
          posts.length > 0 ? (
            <View className="items-center py-8">
              <View className="flex-row items-center">
                <Check color="#2D4F37" size={20} />
                <Text
                  className="text-forest-500 ml-2"
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  You're all caught up
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}
