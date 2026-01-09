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

interface PrivacyToggleProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function PrivacyToggle({ label, description, value, onValueChange }: PrivacyToggleProps) {
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

export default function PrivacySettingsScreen() {
  const router = useRouter();

  const [privateAccount, setPrivateAccount] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);

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
          Privacy
        </Text>
      </View>

      <ScrollView className="flex-1">
        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          Account Privacy
        </Text>

        <PrivacyToggle
          label="Private Account"
          description="Only approved friends can see your posts and stories"
          value={privateAccount}
          onValueChange={setPrivateAccount}
        />

        <View className="h-px bg-cream-400" />

        <PrivacyToggle
          label="Show Online Status"
          description="Let friends see when you're active"
          value={showOnlineStatus}
          onValueChange={setShowOnlineStatus}
        />

        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          Messaging
        </Text>

        <PrivacyToggle
          label="Read Receipts"
          description="Let others know when you've read their messages"
          value={showReadReceipts}
          onValueChange={setShowReadReceipts}
        />

        <Text className="font-semibold text-xs text-charcoal-300 uppercase px-4 py-2 mt-4">
          Interactions
        </Text>

        <PrivacyToggle
          label="Allow Tagging"
          description="Let friends tag you in posts and stories"
          value={allowTagging}
          onValueChange={setAllowTagging}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
