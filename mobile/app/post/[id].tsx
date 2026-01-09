import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PostCard } from "../../components";
import { Avatar } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { Post, Comment } from "../../types";

function formatTimestamp(dateString: string): string {
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

interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  postOwnerId: string;
  onDelete: (commentId: string) => void;
}

function CommentItem({ comment, currentUserId, postOwnerId, onDelete }: CommentItemProps) {
  const canDelete = comment.user_id === currentUserId || postOwnerId === currentUserId;
  const fullName = `${comment.user_first_name} ${comment.user_last_name}`;

  const handleLongPress = () => {
    if (!canDelete) return;

    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(comment.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={0.9}
      className="flex-row px-4 py-3"
    >
      <Avatar
        name={fullName}
        imageUrl={comment.user_avatar_url}
        size="sm"
      />
      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className="font-semibold text-charcoal-400">
            {fullName}
          </Text>
          <Text className="ml-2 text-xs text-charcoal-300">
            {formatTimestamp(comment.created_at)}
          </Text>
        </View>
        <Text className="text-charcoal-400 mt-1">
          {comment.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PostDetailScreen() {
  const router = useRouter();
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    const [postResult, commentsResult] = await Promise.all([
      apiClient.getPost(postId),
      apiClient.getPostComments(postId),
    ]);

    if (postResult.success && postResult.data) {
      setPost(postResult.data);
    }
    if (commentsResult.success && commentsResult.data) {
      setComments(commentsResult.data);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLikeToggle = async (postId: string, isLiked: boolean) => {
    if (isLiked) {
      await apiClient.likePost(postId);
    } else {
      await apiClient.unlikePost(postId);
    }
  };

  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleDeletePost = async () => {
    if (!postId) return;

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
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || submitting || !postId) return;

    setSubmitting(true);
    const result = await apiClient.addComment(postId, commentText.trim());

    if (result.success && result.data) {
      setComments((prev) => [...prev, result.data!]);
      setCommentText("");
      if (post) {
        setPost({ ...post, comments_count: post.comments_count + 1 });
      }
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) return;

    const result = await apiClient.deleteComment(postId, commentId);
    if (result.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (post) {
        setPost({ ...post, comments_count: post.comments_count - 1 });
      }
    }
  };

  const renderHeader = () => {
    if (!post) return null;

    return (
      <View>
        <PostCard
          post={post}
          currentUserId={user?.id ?? ""}
          onLikeToggle={handleLikeToggle}
          onCommentPress={() => {}}
          onUserPress={handleUserPress}
          onDeletePress={handleDeletePost}
        />
        <View className="px-4 py-3 border-b border-cream-400">
          <Text className="font-semibold text-charcoal-400">
            Comments ({post.comments_count})
          </Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View className="items-center py-8 px-6">
        <Text className="text-charcoal-300 text-center">
          No comments yet. Be the first to comment!
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
          </TouchableOpacity>
          <Text className="ml-4 font-bold text-lg text-charcoal-400">
            Post
          </Text>
        </View>

        {/* Comments list */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              currentUserId={user?.id ?? ""}
              postOwnerId={post?.user_id ?? ""}
              onDelete={handleDeleteComment}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment input */}
        <View className="flex-row items-center px-4 py-3 border-t border-cream-400 bg-cream-300">
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor={colors.charcoal[300]}
            className="flex-1 text-charcoal-400 bg-white rounded-full px-4 py-2 mr-2"
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!commentText.trim() || submitting}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={24}
              color={
                commentText.trim() && !submitting
                  ? colors.forest[500]
                  : colors.charcoal[300]
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
