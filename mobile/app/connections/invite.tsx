import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import {
  ArrowLeft,
  Gift,
  Copy,
  Share2,
  Users,
  Unlock,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getMyInviteCode, getInviteStats } from "@/lib/invites";
import { colors } from "@/theme";

export default function InviteFriendsScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [stats, setStats] = useState({
    usedInvites: 0,
    currentCap: 15,
    nextCapUnlock: null as { cap: number; invitesNeeded: number } | null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [code, inviteStats] = await Promise.all([
        getMyInviteCode(),
        getInviteStats(),
      ]);

      setInviteCode(code);
      setStats(inviteStats);
    } catch (error) {
      console.error("Error loading invite data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopy = async () => {
    if (!inviteCode) return;

    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!inviteCode) return;

    try {
      await Share.share({
        message: `Join me on Only Friends! Use my invite code: ${inviteCode}\n\nDownload the app: https://onlyfriends.app`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
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
          Invite Friends
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* Icon */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-forest-100 items-center justify-center">
            <Gift color={colors.forest[500]} size={40} />
          </View>
        </View>

        {/* Title */}
        <Text
          className="text-2xl text-center text-charcoal-400 mb-2"
          style={{ fontFamily: "Lora_700Bold" }}
        >
          Share Only Friends
        </Text>
        <Text
          className="text-center text-charcoal-300 mb-8"
          style={{ fontFamily: "Cabin_400Regular" }}
        >
          Invite friends to join and unlock more connections!
        </Text>

        {/* Invite Code Box */}
        <View className="bg-white rounded-xl p-6 mb-6 border border-cream-300">
          <Text
            className="text-sm text-charcoal-300 text-center mb-2"
            style={{ fontFamily: "Cabin_500Medium" }}
          >
            Your invite code
          </Text>
          <Text
            className="text-3xl text-center text-forest-500 tracking-widest mb-4"
            style={{ fontFamily: "Cabin_700Bold" }}
          >
            {inviteCode || "------"}
          </Text>

          <View className="flex-row justify-center space-x-3">
            <TouchableOpacity
              onPress={handleCopy}
              className="flex-row items-center px-4 py-2 bg-cream-100 rounded-lg mr-3"
            >
              <Copy color={colors.charcoal[400]} size={18} />
              <Text
                className="ml-2 text-charcoal-400"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                {copied ? "Copied!" : "Copy"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center px-4 py-2 bg-forest-500 rounded-lg"
            >
              <Share2 color="white" size={18} />
              <Text
                className="ml-2 text-white"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="bg-white rounded-xl p-4 mb-6 border border-cream-300">
          <View className="flex-row items-center mb-3">
            <Users color={colors.forest[500]} size={20} />
            <Text
              className="ml-2 text-charcoal-400"
              style={{ fontFamily: "Cabin_500Medium" }}
            >
              {stats.usedInvites} friend{stats.usedInvites !== 1 ? "s" : ""} joined from your
              invites
            </Text>
          </View>

          {stats.nextCapUnlock && (
            <View className="flex-row items-center">
              <Unlock color={colors.forest[500]} size={20} />
              <Text
                className="ml-2 text-charcoal-400"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Invite {stats.nextCapUnlock.invitesNeeded} more to unlock{" "}
                {stats.nextCapUnlock.cap} connections
              </Text>
            </View>
          )}

          {!stats.nextCapUnlock && stats.currentCap === 50 && (
            <View className="flex-row items-center">
              <Unlock color={colors.forest[500]} size={20} />
              <Text
                className="ml-2 text-forest-500"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                Max connections unlocked!
              </Text>
            </View>
          )}
        </View>

        {/* Cap Tiers Info */}
        <View className="bg-cream-100 rounded-xl p-4">
          <Text
            className="text-sm text-charcoal-400 mb-3"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Connection Tiers
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text
                className="text-charcoal-300"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Start
              </Text>
              <Text
                className={`${stats.currentCap >= 15 ? "text-forest-500" : "text-charcoal-300"}`}
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                15 connections
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text
                className="text-charcoal-300"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                2 invites
              </Text>
              <Text
                className={`${stats.currentCap >= 25 ? "text-forest-500" : "text-charcoal-300"}`}
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                25 connections
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text
                className="text-charcoal-300"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                5 invites
              </Text>
              <Text
                className={`${stats.currentCap >= 35 ? "text-forest-500" : "text-charcoal-300"}`}
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                35 connections
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text
                className="text-charcoal-300"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                10 invites
              </Text>
              <Text
                className={`${stats.currentCap >= 50 ? "text-forest-500" : "text-charcoal-300"}`}
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                50 connections (max)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
