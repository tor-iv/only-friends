import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

export function AboutScreen() {
  const navigation = useNavigation();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      // Handle error
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-400">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-serif-bold text-lg text-charcoal-400 mr-6">
          About
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* App Info */}
        <View className="items-center py-8">
          <View className="w-20 h-20 rounded-2xl bg-forest-500 items-center justify-center mb-4">
            <Text className="text-white font-serif-bold text-3xl">OF</Text>
          </View>
          <Text className="font-serif-bold text-2xl text-charcoal-400">
            Only Friends
          </Text>
          <Text className="font-sans text-charcoal-300 mt-1">
            Version 1.0.0
          </Text>
        </View>

        {/* Description */}
        <View className="px-6 pb-6">
          <Text className="font-sans text-charcoal-400 text-center leading-6">
            Only Friends is a private social network where you connect with real
            friends through phone contacts. Share moments, send messages, and
            stay connected with the people who matter most.
          </Text>
        </View>

        {/* Links */}
        <View className="bg-white">
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            onPress={() => handleOpenLink("https://onlyfriends.app")}
          >
            <Ionicons name="globe-outline" size={22} color={colors.charcoal[400]} />
            <Text className="flex-1 ml-3 font-sans text-charcoal-400">
              Website
            </Text>
            <Ionicons name="open-outline" size={18} color={colors.charcoal[300]} />
          </TouchableOpacity>
          <View className="h-px bg-cream-400" />
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            onPress={() => handleOpenLink("https://twitter.com/onlyfriends")}
          >
            <Ionicons name="logo-twitter" size={22} color={colors.charcoal[400]} />
            <Text className="flex-1 ml-3 font-sans text-charcoal-400">
              Twitter
            </Text>
            <Ionicons name="open-outline" size={18} color={colors.charcoal[300]} />
          </TouchableOpacity>
          <View className="h-px bg-cream-400" />
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            onPress={() => handleOpenLink("https://instagram.com/onlyfriends")}
          >
            <Ionicons name="logo-instagram" size={22} color={colors.charcoal[400]} />
            <Text className="flex-1 ml-3 font-sans text-charcoal-400">
              Instagram
            </Text>
            <Ionicons name="open-outline" size={18} color={colors.charcoal[300]} />
          </TouchableOpacity>
        </View>

        {/* Rate & Share */}
        <View className="bg-white mt-4">
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            onPress={() => {
              // This would open the app store
            }}
          >
            <Ionicons name="star-outline" size={22} color={colors.charcoal[400]} />
            <Text className="flex-1 ml-3 font-sans text-charcoal-400">
              Rate Only Friends
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.charcoal[300]} />
          </TouchableOpacity>
          <View className="h-px bg-cream-400" />
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            onPress={() => {
              // This would open share sheet
            }}
          >
            <Ionicons name="share-outline" size={22} color={colors.charcoal[400]} />
            <Text className="flex-1 ml-3 font-sans text-charcoal-400">
              Share with Friends
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.charcoal[300]} />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View className="items-center py-8">
          <Text className="font-sans text-charcoal-300 text-sm">
            Made with love
          </Text>
          <Text className="font-sans text-charcoal-300 text-xs mt-2">
            &copy; 2025 Only Friends. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
