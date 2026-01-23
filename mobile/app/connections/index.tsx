import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  UserPlus,
  Users,
  Gift,
  Check,
  X,
} from "lucide-react-native";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import {
  getConnections,
  getPendingRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  getConnectionCount,
} from "@/lib/connections";
import { colors } from "@/theme";
import type { ConnectionWithProfile, PendingRequest } from "@/types/database";

// Union type for SectionList items
type SectionItem = PendingRequest | ConnectionWithProfile;
type SectionType =
  | { title: string; data: PendingRequest[]; type: "pending" }
  | { title: string; data: ConnectionWithProfile[]; type: "connections" };

export default function ConnectionsScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  const [connections, setConnections] = useState<ConnectionWithProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const connectionCap = profile?.connection_cap || 15;

  const loadData = useCallback(async () => {
    try {
      const [connectionsData, pendingData, countData] = await Promise.all([
        getConnections(),
        getPendingRequests(),
        getConnectionCount(),
      ]);

      // Sort connections alphabetically
      connectionsData.sort((a, b) =>
        a.profile.display_name.localeCompare(b.profile.display_name)
      );

      setConnections(connectionsData);
      setPendingRequests(pendingData);
      setConnectionCount(countData);
    } catch (error) {
      console.error("Error loading connections:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAcceptRequest = async (request: PendingRequest) => {
    // Check cap before accepting
    if (connectionCount >= connectionCap) {
      Alert.alert(
        "Connection Limit Reached",
        `You've reached your limit of ${connectionCap} connections. Remove a connection or invite friends to unlock more!`,
        [
          { text: "Manage Connections", onPress: () => {} },
          {
            text: "Invite Friends",
            onPress: () => router.push("/connections/invite"),
          },
        ]
      );
      return;
    }

    const result = await acceptConnectionRequest(request.id);
    if (result.success) {
      loadData();
    } else {
      Alert.alert("Error", result.error || "Failed to accept request");
    }
  };

  const handleDeclineRequest = async (request: PendingRequest) => {
    Alert.alert("Decline Request", `Decline connection from ${request.requester.display_name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          const success = await declineConnectionRequest(request.id);
          if (success) {
            loadData();
          }
        },
      },
    ]);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/connections/user/${userId}`);
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

  const sections: SectionType[] = [
    ...(pendingRequests.length > 0
      ? [{ title: "Pending Requests", data: pendingRequests, type: "pending" as const }]
      : []),
    { title: "Your Connections", data: connections, type: "connections" as const },
  ];

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
          Connections
        </Text>
        <TouchableOpacity onPress={() => router.push("/connections/invite")}>
          <Gift color={colors.forest[500]} size={24} />
        </TouchableOpacity>
      </View>

      {/* Connection Count */}
      <View className="px-4 py-3 bg-white border-b border-cream-300">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Users color={colors.charcoal[400]} size={20} />
            <Text
              className="ml-2 text-charcoal-400"
              style={{ fontFamily: "Cabin_500Medium" }}
            >
              {connectionCount} of {connectionCap} connections
            </Text>
          </View>
          {connectionCount < connectionCap && (
            <TouchableOpacity
              onPress={() => router.push("/connections/find")}
              className="flex-row items-center"
            >
              <UserPlus color={colors.forest[500]} size={18} />
              <Text
                className="ml-1 text-forest-500"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                Find Friends
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress bar */}
        <View className="mt-2 h-2 bg-cream-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-forest-500 rounded-full"
            style={{ width: `${Math.min((connectionCount / connectionCap) * 100, 100)}%` }}
          />
        </View>
      </View>

      {/* Connections List */}
      <SectionList<SectionItem, SectionType>
        sections={sections as any}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <View className="px-4 py-2 bg-cream-100">
            <Text
              className="text-sm text-charcoal-300 uppercase"
              style={{ fontFamily: "Cabin_600SemiBold" }}
            >
              {section.title}
              {section.type === "pending" && ` (${section.data.length})`}
            </Text>
          </View>
        )}
        renderItem={({ item, section }) => {
          if (section.type === "pending") {
            const request = item as PendingRequest;
            return (
              <View className="flex-row items-center px-4 py-3 bg-white border-b border-cream-200">
                <TouchableOpacity
                  onPress={() => handleUserPress(request.requester.id)}
                  className="flex-row items-center flex-1"
                >
                  <Avatar
                    name={request.requester.display_name}
                    imageUrl={request.requester.avatar_url}
                    size="md"
                  />
                  <View className="ml-3 flex-1">
                    <Text
                      className="font-semibold text-charcoal-400"
                      style={{ fontFamily: "Cabin_600SemiBold" }}
                    >
                      {request.requester.display_name}
                    </Text>
                    <Text
                      className="text-sm text-charcoal-300"
                      style={{ fontFamily: "Cabin_400Regular" }}
                    >
                      Wants to connect
                    </Text>
                  </View>
                </TouchableOpacity>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => handleDeclineRequest(request)}
                    className="w-10 h-10 items-center justify-center rounded-full bg-cream-200 mr-2"
                  >
                    <X color={colors.charcoal[400]} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAcceptRequest(request)}
                    className="w-10 h-10 items-center justify-center rounded-full bg-forest-500"
                  >
                    <Check color="white" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          const connection = item as ConnectionWithProfile;
          return (
            <TouchableOpacity
              onPress={() => handleUserPress(connection.profile.id)}
              className="flex-row items-center px-4 py-3 bg-white border-b border-cream-200"
              activeOpacity={0.7}
            >
              <Avatar
                name={connection.profile.display_name}
                imageUrl={connection.profile.avatar_url}
                size="md"
              />
              <View className="flex-1 ml-3">
                <Text
                  className="font-semibold text-charcoal-400"
                  style={{ fontFamily: "Cabin_600SemiBold" }}
                >
                  {connection.profile.display_name}
                </Text>
                {connection.profile.bio && (
                  <Text
                    className="text-sm text-charcoal-300"
                    style={{ fontFamily: "Cabin_400Regular" }}
                    numberOfLines={1}
                  >
                    {connection.profile.bio}
                  </Text>
                )}
              </View>
              <ChevronRight color={colors.charcoal[300]} size={20} />
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.forest[500]}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Users color={colors.charcoal[300]} size={48} />
            <Text
              className="text-lg font-bold text-charcoal-400 text-center mt-4"
              style={{ fontFamily: "Lora_600SemiBold" }}
            >
              No connections yet
            </Text>
            <Text
              className="text-charcoal-300 text-center mt-2"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              Find friends from your contacts or invite someone to join!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/connections/find")}
              className="mt-4 px-6 py-3 bg-forest-500 rounded-full"
            >
              <Text
                className="text-white font-medium"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                Find Friends
              </Text>
            </TouchableOpacity>
          </View>
        }
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}
