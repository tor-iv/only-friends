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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../types/navigation";

type PrivacyNavProp = NativeStackNavigationProp<ProfileStackParamList, "PrivacySettings">;

interface SettingsToggleProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function SettingsToggle({ label, description, value, onValueChange }: SettingsToggleProps) {
  return (
    <View className="flex-row items-center px-4 py-4 bg-white">
      <View className="flex-1 mr-4">
        <Text className="font-sans-semibold text-charcoal-400">{label}</Text>
        <Text className="font-sans text-xs text-charcoal-300 mt-1">
          {description}
        </Text>
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

export function PrivacySettingsScreen() {
  const navigation = useNavigation<PrivacyNavProp>();

  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [showBirthday, setShowBirthday] = useState(true);
  const [shareLocation, setShareLocation] = useState(false);

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
          Privacy
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Account Privacy */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Account Privacy
        </Text>
        <SettingsToggle
          label="Private Account"
          description="Only approved friends can see your posts"
          value={isPrivateAccount}
          onValueChange={setIsPrivateAccount}
        />

        {/* Activity Status */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Activity Status
        </Text>
        <SettingsToggle
          label="Show Online Status"
          description="Let friends see when you're active"
          value={showOnlineStatus}
          onValueChange={setShowOnlineStatus}
        />
        <SettingsDivider />
        <SettingsToggle
          label="Read Receipts"
          description="Let others know when you've read their messages"
          value={readReceipts}
          onValueChange={setReadReceipts}
        />

        {/* Personal Info */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Personal Information
        </Text>
        <SettingsToggle
          label="Show Birthday"
          description="Display your birthday on your profile"
          value={showBirthday}
          onValueChange={setShowBirthday}
        />
        <SettingsDivider />
        <SettingsToggle
          label="Share Location"
          description="Include location in your posts"
          value={shareLocation}
          onValueChange={setShareLocation}
        />

        {/* Blocked Accounts */}
        <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300 mt-4">
          Blocked Users
        </Text>
        <TouchableOpacity
          className="flex-row items-center px-4 py-4 bg-white"
          onPress={() => navigation.navigate("BlockedAccounts")}
        >
          <Text className="flex-1 font-sans text-charcoal-400">
            Blocked Accounts
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.charcoal[300]} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
