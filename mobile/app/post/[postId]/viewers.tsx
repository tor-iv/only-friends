import { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { SeenByList } from "@/components/SeenByList";
import { getPostViewers } from "@/lib/posts";
import type { Profile } from "@/types/database";

interface ViewerWithTime extends Profile {
  viewed_at: string;
}

export default function PostViewersScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const [viewers, setViewers] = useState<ViewerWithTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadViewers = useCallback(async () => {
    if (!postId) return;

    try {
      const result = await getPostViewers(postId);
      setViewers(result.viewers);
    } catch (error) {
      console.error("Error loading viewers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadViewers();
  }, [loadViewers]);

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/connections/user/${userId}`);
    },
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-300 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mr-4"
        >
          <ArrowLeft color="#2D4F37" size={24} />
        </TouchableOpacity>
        <Text
          className="text-lg text-charcoal-400 font-semibold"
          style={{ fontFamily: "Cabin_600SemiBold" }}
        >
          Seen by
        </Text>
      </View>

      {/* Viewers List */}
      <View className="flex-1 bg-white">
        <SeenByList
          viewers={viewers}
          isLoading={isLoading}
          onUserPress={handleUserPress}
        />
      </View>
    </SafeAreaView>
  );
}
