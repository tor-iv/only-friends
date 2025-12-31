import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

interface SettingsToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function SettingsToggle({ label, description, value, onValueChange }: SettingsToggleProps) {
  return (
    <View className="flex-row items-center px-4 py-4 bg-white">
      <View className="flex-1 mr-4">
        <Text className="font-sans-semibold text-charcoal-400">{label}</Text>
        {description && (
          <Text className="font-sans text-xs text-charcoal-300 mt-1">
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.cream[400], true: colors.forest[400] }}
        thumbColor={value ? colors.forest[500] : colors.cream[300]}
      />
    </View>
  );
}

function SettingsDivider() {
  return <View className="h-px bg-cream-400" />;
}

export function NotificationPreferencesScreen() {
  const navigation = useNavigation();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [friendRequests, setFriendRequests] = useState(true);
  const [postLikes, setPostLikes] = useState(true);
  const [postComments, setPostComments] = useState(true);
  const [storyViews, setStoryViews] = useState(false);
  const [friendPosts, setFriendPosts] = useState(false);

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
          Notifications
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Push Notifications */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Push Notifications
        </Text>
        <SettingsToggle
          label="Enable Push Notifications"
          description="Receive notifications on your device"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />

        {/* Messages */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Messages
        </Text>
        <SettingsToggle
          label="New Messages"
          value={newMessages}
          onValueChange={setNewMessages}
        />

        {/* Social */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Social
        </Text>
        <SettingsToggle
          label="Friend Requests"
          value={friendRequests}
          onValueChange={setFriendRequests}
        />
        <SettingsDivider />
        <SettingsToggle
          label="Post Likes"
          value={postLikes}
          onValueChange={setPostLikes}
        />
        <SettingsDivider />
        <SettingsToggle
          label="Post Comments"
          value={postComments}
          onValueChange={setPostComments}
        />
        <SettingsDivider />
        <SettingsToggle
          label="Story Views"
          value={storyViews}
          onValueChange={setStoryViews}
        />

        {/* Activity */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Activity
        </Text>
        <SettingsToggle
          label="Friend Posts"
          description="Get notified when friends post"
          value={friendPosts}
          onValueChange={setFriendPosts}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
