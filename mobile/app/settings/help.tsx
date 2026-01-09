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

interface HelpItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  onPress: () => void;
}

function HelpItem({ icon, label, description, onPress }: HelpItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4 bg-white"
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 rounded-full bg-forest-100 items-center justify-center">
        <Ionicons name={icon} size={20} color={colors.forest[500]} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-charcoal-400">{label}</Text>
        <Text className="text-xs text-charcoal-300 mt-1">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.charcoal[300]} />
    </TouchableOpacity>
  );
}

export default function HelpSupportScreen() {
  const router = useRouter();

  const handleEmail = () => {
    Linking.openURL("mailto:support@onlyfriends.app");
  };

  const handleFAQ = () => {
    Linking.openURL("https://onlyfriends.app/faq");
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://onlyfriends.app/privacy");
  };

  const handleTerms = () => {
    Linking.openURL("https://onlyfriends.app/terms");
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
          Help & Support
        </Text>
      </View>

      <ScrollView className="flex-1">
        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          Get Help
        </Text>

        <HelpItem
          icon="help-circle-outline"
          label="FAQ"
          description="Find answers to common questions"
          onPress={handleFAQ}
        />

        <View className="h-px bg-cream-400" />

        <HelpItem
          icon="mail-outline"
          label="Contact Support"
          description="Email us for assistance"
          onPress={handleEmail}
        />

        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          Legal
        </Text>

        <HelpItem
          icon="document-text-outline"
          label="Privacy Policy"
          description="Learn how we handle your data"
          onPress={handlePrivacyPolicy}
        />

        <View className="h-px bg-cream-400" />

        <HelpItem
          icon="shield-checkmark-outline"
          label="Terms of Service"
          description="Our terms and conditions"
          onPress={handleTerms}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
