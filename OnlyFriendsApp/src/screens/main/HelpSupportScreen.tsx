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

interface HelpItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}

function HelpItem({ icon, title, description, onPress }: HelpItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4 bg-white"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 rounded-full bg-forest-100 items-center justify-center">
        <Ionicons name={icon} size={20} color={colors.forest[500]} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="font-sans-semibold text-charcoal-400">{title}</Text>
        <Text className="font-sans text-xs text-charcoal-300 mt-1">
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.charcoal[300]} />
    </TouchableOpacity>
  );
}

function Divider() {
  return <View className="h-px bg-cream-400" />;
}

export function HelpSupportScreen() {
  const navigation = useNavigation();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      // Handle error
    });
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@onlyfriends.app?subject=Help%20Request").catch(
      () => {
        // Handle error
      }
    );
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
          Help & Support
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Help Center */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Help Center
        </Text>
        <HelpItem
          icon="book-outline"
          title="FAQ"
          description="Frequently asked questions"
          onPress={() => handleOpenLink("https://onlyfriends.app/faq")}
        />
        <Divider />
        <HelpItem
          icon="chatbubble-outline"
          title="Contact Support"
          description="Get help from our team"
          onPress={handleContactSupport}
        />
        <Divider />
        <HelpItem
          icon="bug-outline"
          title="Report a Problem"
          description="Let us know about any issues"
          onPress={() => handleOpenLink("https://onlyfriends.app/report")}
        />

        {/* Community */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Community
        </Text>
        <HelpItem
          icon="shield-outline"
          title="Community Guidelines"
          description="Learn about our community standards"
          onPress={() => handleOpenLink("https://onlyfriends.app/guidelines")}
        />
        <Divider />
        <HelpItem
          icon="warning-outline"
          title="Safety Center"
          description="Tips to stay safe online"
          onPress={() => handleOpenLink("https://onlyfriends.app/safety")}
        />

        {/* Legal */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Legal
        </Text>
        <HelpItem
          icon="document-text-outline"
          title="Terms of Service"
          description="Read our terms and conditions"
          onPress={() => handleOpenLink("https://onlyfriends.app/terms")}
        />
        <Divider />
        <HelpItem
          icon="lock-closed-outline"
          title="Privacy Policy"
          description="How we handle your data"
          onPress={() => handleOpenLink("https://onlyfriends.app/privacy")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
