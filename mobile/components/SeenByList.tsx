import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "./ui";
import { colors } from "../theme";
import type { Profile } from "@/types/database";

interface ViewerWithTime extends Profile {
  viewed_at: string;
}

interface SeenByListProps {
  viewers: ViewerWithTime[];
  isLoading?: boolean;
  onUserPress?: (userId: string) => void;
  onClose?: () => void;
}

function formatViewTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function SeenByList({
  viewers,
  isLoading,
  onUserPress,
  onClose,
}: SeenByListProps) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <ActivityIndicator size="large" color={colors.forest[500]} />
      </View>
    );
  }

  if (viewers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text
          className="text-charcoal-300"
          style={{ fontFamily: "Cabin_400Regular" }}
        >
          No one has seen this post yet
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={viewers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onUserPress?.(item.id)}
          activeOpacity={onUserPress ? 0.7 : 1}
          className="flex-row items-center px-4 py-3 border-b border-cream-200"
        >
          <Avatar name={item.display_name} imageUrl={item.avatar_url} size="md" />
          <View className="ml-3 flex-1">
            <Text
              className="text-charcoal-400 font-medium"
              style={{ fontFamily: "Cabin_600SemiBold" }}
            >
              {item.display_name}
            </Text>
            {item.bio && (
              <Text
                className="text-charcoal-300 text-sm"
                style={{ fontFamily: "Cabin_400Regular" }}
                numberOfLines={1}
              >
                {item.bio}
              </Text>
            )}
          </View>
          <Text
            className="text-charcoal-300 text-xs"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {formatViewTime(item.viewed_at)}
          </Text>
        </TouchableOpacity>
      )}
      ListHeaderComponent={
        <View className="px-4 py-3 border-b border-cream-300 bg-cream-50">
          <Text
            className="text-charcoal-400 font-medium"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Seen by {viewers.length}
          </Text>
        </View>
      }
    />
  );
}
