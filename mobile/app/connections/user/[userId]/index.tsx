import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  MoreHorizontal,
} from "lucide-react-native";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  isConnectedWith,
  sendConnectionRequest,
  removeConnection,
  getConnections,
} from "@/lib/connections";
import { getUserPosts, getPostImageUrl } from "@/lib/posts";
import { colors } from "@/theme";
import type { Profile, Post } from "@/types/database";

export default function UserProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!userId) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      // Check connection status
      const connected = await isConnectedWith(userId);
      setIsConnected(connected);

      if (connected) {
        // Get connection ID for removal
        const connections = await getConnections();
        const conn = connections.find((c) => c.profile.id === userId);
        if (conn) {
          setConnectionId(conn.id);
        }

        // Load posts if connected
        const userPosts = await getUserPosts(userId);
        setPosts(userPosts);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleConnect = async () => {
    if (!userId) return;

    const result = await sendConnectionRequest(userId);

    if (result.success) {
      setIsPending(true);
    } else {
      Alert.alert("Error", result.error || "Failed to send request");
    }
  };

  const handleRemoveConnection = async () => {
    if (!connectionId) return;

    Alert.alert(
      "Remove Connection",
      `Remove ${profile?.display_name} as a connection? They won't be notified.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await removeConnection(connectionId);
            if (success) {
              setIsConnected(false);
              setConnectionId(null);
              setPosts([]);
            }
          },
        },
      ]
    );
  };

  const handleOptionsPress = () => {
    if (!isConnected) return;

    Alert.alert("Options", undefined, [
      {
        text: "Remove Connection",
        style: "destructive",
        onPress: handleRemoveConnection,
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.forest[500]} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
        <View className="flex-row items-center px-4 py-3 border-b border-cream-300 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.charcoal[400]} size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text
            className="text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            User not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-cream-300 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.charcoal[400]} size={24} />
        </TouchableOpacity>
        <Text
          className="text-lg font-semibold text-charcoal-400"
          style={{ fontFamily: "Cabin_600SemiBold" }}
        >
          {profile.display_name}
        </Text>
        {isConnected ? (
          <TouchableOpacity onPress={handleOptionsPress}>
            <MoreHorizontal color={colors.charcoal[400]} size={24} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center py-6 bg-white border-b border-cream-200">
          <Avatar
            name={profile.display_name}
            imageUrl={profile.avatar_url}
            size="xl"
          />
          <Text
            className="text-xl text-charcoal-400 mt-4"
            style={{ fontFamily: "Cabin_700Bold" }}
          >
            {profile.display_name}
          </Text>
          {profile.bio && (
            <Text
              className="text-charcoal-300 mt-1 px-6 text-center"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              {profile.bio}
            </Text>
          )}

          {/* Connection Button */}
          <View className="mt-4">
            {isConnected ? (
              <View className="flex-row items-center px-6 py-2 bg-cream-100 rounded-full">
                <Text
                  className="text-charcoal-400"
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  Connected
                </Text>
              </View>
            ) : isPending ? (
              <View className="flex-row items-center px-6 py-2 bg-cream-200 rounded-full">
                <Text
                  className="text-charcoal-400"
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  Request Sent
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleConnect}
                className="flex-row items-center px-6 py-2 bg-forest-500 rounded-full"
              >
                <UserPlus color="white" size={18} />
                <Text
                  className="ml-2 text-white"
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  Connect
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Posts Grid (only if connected) */}
        {isConnected && posts.length > 0 && (
          <View className="mt-2">
            <View className="px-4 py-2">
              <Text
                className="text-sm text-charcoal-300 uppercase"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                Posts
              </Text>
            </View>
            <View className="flex-row flex-wrap">
              {posts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  className="w-1/3 aspect-square p-0.5"
                  onPress={() => {
                    // Could navigate to post detail
                  }}
                >
                  <Image
                    source={{ uri: getPostImageUrl(post.image_path) }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Not Connected State */}
        {!isConnected && (
          <View className="items-center py-12 px-6">
            <Text
              className="text-charcoal-300 text-center"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              Connect with {profile.display_name} to see their posts
            </Text>
          </View>
        )}

        {/* Connected but no posts */}
        {isConnected && posts.length === 0 && (
          <View className="items-center py-12 px-6">
            <Text
              className="text-charcoal-300 text-center"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              {profile.display_name} hasn't posted anything yet
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
