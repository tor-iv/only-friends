import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { MoreHorizontal, Eye } from "lucide-react-native";
import { Avatar } from "./ui";
import { colors } from "../theme";
import { getPostImageUrl } from "@/lib/posts";
import type { PostWithAuthor } from "@/types/database";

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId: string;
  onUserPress: (userId: string) => void;
  onDeletePress?: (postId: string) => void;
  onSeenByPress?: (postId: string) => void;
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatSeenBy(
  viewCount: number,
  viewers?: { display_name: string }[],
  isOwnPost?: boolean
): string {
  if (viewCount === 0) {
    return isOwnPost ? "No one has seen this yet" : "";
  }

  if (!viewers || viewers.length === 0) {
    return `Seen by ${viewCount}`;
  }

  if (viewers.length === 1) {
    return `Seen by ${viewers[0].display_name}`;
  }

  if (viewers.length === 2) {
    return `Seen by ${viewers[0].display_name} and ${viewers[1].display_name}`;
  }

  const remaining = viewCount - 2;
  if (remaining > 0) {
    return `Seen by ${viewers[0].display_name}, ${viewers[1].display_name}, +${remaining}`;
  }

  return `Seen by ${viewers[0].display_name} and ${viewers[1].display_name}`;
}

export function PostCard({
  post,
  currentUserId,
  onUserPress,
  onDeletePress,
  onSeenByPress,
}: PostCardProps) {
  const isOwnPost = post.user_id === currentUserId;
  const displayName = post.author?.display_name || "Unknown";
  const avatarUrl = post.author?.avatar_url;
  const imageUrl = getPostImageUrl(post.image_path);
  const viewCount = post.view_count || 0;

  const handleOptionsPress = () => {
    if (!isOwnPost || !onDeletePress) return;

    Alert.alert("Post Options", "What would you like to do?", [
      {
        text: "Delete Post",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Delete Post?",
            "This will permanently delete this post.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDeletePress(post.id),
              },
            ]
          );
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleSeenByPress = () => {
    if (isOwnPost && onSeenByPress && viewCount > 0) {
      onSeenByPress(post.id);
    }
  };

  return (
    <View className="bg-white mb-2">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => onUserPress(post.user_id)}
          activeOpacity={0.7}
          className="flex-row items-center flex-1"
        >
          <Avatar name={displayName} imageUrl={avatarUrl} size="sm" />
          <View className="ml-3 flex-1">
            <Text
              className="font-semibold text-charcoal-400"
              style={{ fontFamily: "Cabin_600SemiBold" }}
            >
              {displayName}
            </Text>
            <Text
              className="text-xs text-charcoal-300"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              {formatTimestamp(post.created_at)}
            </Text>
          </View>
        </TouchableOpacity>

        {isOwnPost && onDeletePress && (
          <TouchableOpacity
            onPress={handleOptionsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="p-1"
          >
            <MoreHorizontal color={colors.charcoal[300]} size={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Image */}
      <Image
        source={{ uri: imageUrl }}
        className="w-full"
        style={{ aspectRatio: 1 }}
        resizeMode="cover"
      />

      {/* Caption */}
      {post.caption && (
        <View className="px-4 pt-3">
          <Text
            className="text-charcoal-400 leading-5"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            <Text style={{ fontFamily: "Cabin_600SemiBold" }}>{displayName}</Text>{" "}
            {post.caption}
          </Text>
        </View>
      )}

      {/* Seen By */}
      <TouchableOpacity
        onPress={handleSeenByPress}
        disabled={!isOwnPost || viewCount === 0}
        activeOpacity={isOwnPost && viewCount > 0 ? 0.7 : 1}
        className="flex-row items-center px-4 py-3"
      >
        <Eye
          color={viewCount > 0 ? colors.charcoal[400] : colors.charcoal[200]}
          size={16}
        />
        <Text
          className={`ml-2 text-sm ${
            viewCount > 0 ? "text-charcoal-400" : "text-charcoal-200"
          }`}
          style={{ fontFamily: "Cabin_400Regular" }}
        >
          {formatSeenBy(viewCount, post.viewers, isOwnPost)}
        </Text>
        {isOwnPost && viewCount > 0 && (
          <Text
            className="ml-1 text-sm text-forest-500"
            style={{ fontFamily: "Cabin_500Medium" }}
          >
            View
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
