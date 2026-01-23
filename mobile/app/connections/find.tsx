import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, UserPlus, Users, Gift, Search } from "lucide-react-native";
import { Avatar, Button } from "@/components/ui";
import { getMutualMatches, sendConnectionRequest } from "@/lib/connections";
import { hasContactsPermission, syncContactHashes } from "@/lib/contacts";
import { colors } from "@/theme";
import type { Profile } from "@/types/database";

export default function FindFriendsScreen() {
  const router = useRouter();

  const [matches, setMatches] = useState<Profile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [hasPermission, setHasPermission] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadMatches = useCallback(async () => {
    try {
      // Check permission first
      const permission = await hasContactsPermission();
      setHasPermission(permission);

      if (permission) {
        const mutualMatches = await getMutualMatches();
        setMatches(mutualMatches);
      }
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const handleSyncContacts = async () => {
    setIsSyncing(true);
    try {
      const result = await syncContactHashes();
      if (result.success) {
        await loadMatches();
        Alert.alert("Success", `Synced ${result.synced} contacts`);
      } else {
        Alert.alert("Error", result.error || "Failed to sync contacts");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sync contacts");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnect = async (userId: string) => {
    const result = await sendConnectionRequest(userId);

    if (result.success) {
      setPendingRequests((prev) => new Set(prev).add(userId));
    } else {
      Alert.alert("Error", result.error || "Failed to send request");
    }
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

  // No permission state
  if (!hasPermission) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-cream-300 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.charcoal[400]} size={24} />
          </TouchableOpacity>
          <Text
            className="flex-1 text-center text-lg font-semibold text-charcoal-400 mr-6"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Find Friends
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Search color={colors.charcoal[300]} size={48} />
          <Text
            className="text-xl text-charcoal-400 text-center mt-4"
            style={{ fontFamily: "Lora_600SemiBold" }}
          >
            Enable Contacts
          </Text>
          <Text
            className="text-charcoal-300 text-center mt-2"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            To find friends, we need access to your contacts. Enable this in your device settings.
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
          Find Friends
        </Text>
        <TouchableOpacity onPress={handleSyncContacts} disabled={isSyncing}>
          {isSyncing ? (
            <ActivityIndicator size="small" color={colors.forest[500]} />
          ) : (
            <Search color={colors.forest[500]} size={24} />
          )}
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View className="px-4 py-3 bg-forest-50 border-b border-forest-100">
        <Text
          className="text-sm text-forest-600 text-center"
          style={{ fontFamily: "Cabin_400Regular" }}
        >
          People who have your number and are on Only Friends
        </Text>
      </View>

      {/* Matches List */}
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isPending = pendingRequests.has(item.id);

          return (
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-cream-200">
              <TouchableOpacity
                onPress={() => handleUserPress(item.id)}
                className="flex-row items-center flex-1"
              >
                <Avatar
                  name={item.display_name}
                  imageUrl={item.avatar_url}
                  size="md"
                />
                <View className="ml-3 flex-1">
                  <Text
                    className="font-semibold text-charcoal-400"
                    style={{ fontFamily: "Cabin_600SemiBold" }}
                  >
                    {item.display_name}
                  </Text>
                  {item.bio && (
                    <Text
                      className="text-sm text-charcoal-300"
                      style={{ fontFamily: "Cabin_400Regular" }}
                      numberOfLines={1}
                    >
                      {item.bio}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleConnect(item.id)}
                disabled={isPending}
                className={`flex-row items-center px-4 py-2 rounded-full ${
                  isPending ? "bg-cream-200" : "bg-forest-500"
                }`}
              >
                {isPending ? (
                  <Text
                    className="text-charcoal-400"
                    style={{ fontFamily: "Cabin_500Medium" }}
                  >
                    Requested
                  </Text>
                ) : (
                  <>
                    <UserPlus color="white" size={16} />
                    <Text
                      className="ml-1 text-white"
                      style={{ fontFamily: "Cabin_500Medium" }}
                    >
                      Connect
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
              No matches yet
            </Text>
            <Text
              className="text-charcoal-300 text-center mt-2 mb-6"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              Invite friends to join Only Friends!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/connections/invite")}
              className="flex-row items-center px-6 py-3 bg-forest-500 rounded-full"
            >
              <Gift color="white" size={18} />
              <Text
                className="ml-2 text-white font-medium"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                Invite Friends
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
