import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

interface NotificationToggleProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function NotificationToggle({ label, description, value, onValueChange }: NotificationToggleProps) {
  return (
    <View className="flex-row items-center px-4 py-4 bg-white">
      <View className="flex-1 mr-4">
        <Text className="font-semibold text-charcoal-400">{label}</Text>
        <Text className="text-xs text-charcoal-300 mt-1">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.charcoal[200], true: colors.forest[400] }}
        thumbColor={colors.white}
      />
    </View>
  );
}

export default function NotificationPreferencesScreen() {
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [likes, setLikes] = useState(true);
  const [comments, setComments] = useState(true);
  const [friendRequests, setFriendRequests] = useState(true);
  const [messages, setMessages] = useState(true);
  const [stories, setStories] = useState(true);

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
          Notifications
        </Text>
      </View>

      <ScrollView className="flex-1">
        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          General
        </Text>

        <NotificationToggle
          label="Push Notifications"
          description="Enable or disable all push notifications"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />

        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          Activity
        </Text>

        <NotificationToggle
          label="Likes"
          description="When someone likes your post"
          value={likes}
          onValueChange={setLikes}
        />

        <View className="h-px bg-cream-400" />

        <NotificationToggle
          label="Comments"
          description="When someone comments on your post"
          value={comments}
          onValueChange={setComments}
        />

        <View className="h-px bg-cream-400" />

        <NotificationToggle
          label="Friend Requests"
          description="When someone sends you a friend request"
          value={friendRequests}
          onValueChange={setFriendRequests}
        />

        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          Messages & Stories
        </Text>

        <NotificationToggle
          label="Messages"
          description="When you receive a new message"
          value={messages}
          onValueChange={setMessages}
        />

        <View className="h-px bg-cream-400" />

        <NotificationToggle
          label="Stories"
          description="When a friend posts a new story"
          value={stories}
          onValueChange={setStories}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
