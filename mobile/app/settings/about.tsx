import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

export default function AboutScreen() {
  const router = useRouter();

  const handleWebsite = () => {
    Linking.openURL("https://onlyfriends.app");
  };

  const handleInstagram = () => {
    Linking.openURL("https://instagram.com/onlyfriendsapp");
  };

  const handleTwitter = () => {
    Linking.openURL("https://twitter.com/onlyfriendsapp");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-lg text-charcoal-400 mr-6">
          About
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* App Logo and Name */}
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-3xl bg-forest-500 items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">OF</Text>
          </View>
          <Text className="text-2xl font-bold text-charcoal-400">
            Only Friends
          </Text>
          <Text className="text-charcoal-300 mt-1">
            Version 1.0.0
          </Text>
        </View>

        {/* Description */}
        <View className="px-6 mb-8">
          <Text className="text-charcoal-400 text-center leading-6">
            Only Friends is a private social network designed for meaningful connections.
            Share moments with the people who matter most.
          </Text>
        </View>

        {/* Social Links */}
        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2">
          Follow Us
        </Text>

        <TouchableOpacity
          onPress={handleWebsite}
          className="flex-row items-center px-4 py-4 bg-white"
        >
          <Ionicons name="globe-outline" size={22} color={colors.charcoal[400]} />
          <Text className="flex-1 ml-3 text-charcoal-400">Website</Text>
          <Ionicons name="open-outline" size={18} color={colors.charcoal[300]} />
        </TouchableOpacity>

        <View className="h-px bg-cream-400" />

        <TouchableOpacity
          onPress={handleInstagram}
          className="flex-row items-center px-4 py-4 bg-white"
        >
          <Ionicons name="logo-instagram" size={22} color={colors.charcoal[400]} />
          <Text className="flex-1 ml-3 text-charcoal-400">Instagram</Text>
          <Ionicons name="open-outline" size={18} color={colors.charcoal[300]} />
        </TouchableOpacity>

        <View className="h-px bg-cream-400" />

        <TouchableOpacity
          onPress={handleTwitter}
          className="flex-row items-center px-4 py-4 bg-white"
        >
          <Ionicons name="logo-twitter" size={22} color={colors.charcoal[400]} />
          <Text className="flex-1 ml-3 text-charcoal-400">Twitter</Text>
          <Ionicons name="open-outline" size={18} color={colors.charcoal[300]} />
        </TouchableOpacity>

        {/* Copyright */}
        <View className="items-center py-8">
          <Text className="text-charcoal-300 text-sm">
            Made with love
          </Text>
          <Text className="text-charcoal-300 text-xs mt-2">
            © 2024 Only Friends. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
