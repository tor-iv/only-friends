import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "./ui";
import { colors } from "../theme";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLikeToggle: (postId: string, isLiked: boolean) => Promise<void>;
  onCommentPress: (postId: string) => void;
  onUserPress: (userId: string) => void;
  onDeletePress?: (postId: string) => void;
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

export function PostCard({
  post,
  currentUserId,
  onLikeToggle,
  onCommentPress,
  onUserPress,
  onDeletePress,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiking, setIsLiking] = useState(false);

  const isOwnPost = post.user_id === currentUserId;
  const fullName = `${post.user_first_name} ${post.user_last_name}`;

  const handleLikePress = async () => {
    if (isLiking) return;

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => prev + (newIsLiked ? 1 : -1));
    setIsLiking(true);

    try {
      await onLikeToggle(post.id, newIsLiked);
    } catch {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => prev + (newIsLiked ? -1 : 1));
    } finally {
      setIsLiking(false);
    }
  };

  const handleOptionsPress = () => {
    if (!isOwnPost || !onDeletePress) return;

    Alert.alert(
      "Post Options",
      "What would you like to do?",
      [
        {
          text: "Delete Post",
          style: "destructive",
          onPress: () => onDeletePress(post.id),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View className="bg-white border-b border-cream-400">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => onUserPress(post.user_id)}
          activeOpacity={0.7}
          className="flex-row items-center flex-1"
        >
          <Avatar
            name={fullName}
            imageUrl={post.user_avatar_url}
            size="sm"
          />
          <View className="ml-3 flex-1">
            <Text className="font-sans-semibold text-charcoal-400">
              {fullName}
            </Text>
            <Text className="text-xs font-sans text-charcoal-300">
              {formatTimestamp(post.created_at)}
              {post.location && ` \u00B7 ${post.location}`}
            </Text>
          </View>
        </TouchableOpacity>

        {isOwnPost && onDeletePress && (
          <TouchableOpacity
            onPress={handleOptionsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.charcoal[300]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {post.content && (
        <Text className="px-4 pb-3 font-sans text-charcoal-400 leading-5">
          {post.content}
        </Text>
      )}

      {/* Image */}
      {post.image_url && (
        <Image
          source={{ uri: post.image_url }}
          className="w-full"
          style={{ aspectRatio: 1 }}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={handleLikePress}
          activeOpacity={0.7}
          className="flex-row items-center mr-5"
          disabled={isLiking}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? colors.forest[500] : colors.charcoal[400]}
          />
          {likesCount > 0 && (
            <Text className="ml-1 font-sans-medium text-charcoal-400">
              {likesCount}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onCommentPress(post.id)}
          activeOpacity={0.7}
          className="flex-row items-center mr-5"
        >
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={colors.charcoal[400]}
          />
          {post.comments_count > 0 && (
            <Text className="ml-1 font-sans-medium text-charcoal-400">
              {post.comments_count}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          <Ionicons
            name="share-outline"
            size={22}
            color={colors.charcoal[400]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
