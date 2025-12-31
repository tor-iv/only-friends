import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts";
import { colors } from "../../theme";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../types/navigation";

type SettingsNavProp = NativeStackNavigationProp<ProfileStackParamList, "Settings">;

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

function SettingsItem({
  icon,
  label,
  onPress,
  showArrow = true,
  danger = false,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4 bg-white"
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={22}
        color={danger ? "#DC2626" : colors.charcoal[400]}
      />
      <Text
        className={`flex-1 ml-3 font-sans ${
          danger ? "text-red-600" : "text-charcoal-400"
        }`}
      >
        {label}
      </Text>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.charcoal[300]} />
      )}
    </TouchableOpacity>
  );
}

function SettingsDivider() {
  return <View className="h-px bg-cream-400" />;
}

function SettingsSectionHeader({ title }: { title: string }) {
  return (
    <Text className="font-sans-semibold text-xs text-charcoal-300 uppercase px-4 py-2 bg-cream-300">
      {title}
    </Text>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNavProp>();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: logout,
        },
      ]
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
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Account Section */}
        <SettingsSectionHeader title="Account" />
        <SettingsItem
          icon="person-outline"
          label="Account Settings"
          onPress={() => navigation.navigate("AccountSettings")}
        />
        <SettingsDivider />
        <SettingsItem
          icon="lock-closed-outline"
          label="Privacy"
          onPress={() => navigation.navigate("PrivacySettings")}
        />
        <SettingsDivider />
        <SettingsItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => navigation.navigate("NotificationPreferences")}
        />
        <SettingsDivider />
        <SettingsItem
          icon="ban-outline"
          label="Blocked Accounts"
          onPress={() => navigation.navigate("BlockedAccounts")}
        />

        {/* Support Section */}
        <SettingsSectionHeader title="Support" />
        <SettingsItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => navigation.navigate("HelpSupport")}
        />
        <SettingsDivider />
        <SettingsItem
          icon="information-circle-outline"
          label="About"
          onPress={() => navigation.navigate("About")}
        />

        {/* Logout Section */}
        <View className="mt-6">
          <SettingsItem
            icon="log-out-outline"
            label="Log Out"
            onPress={handleLogout}
            showArrow={false}
            danger
          />
        </View>

        {/* App Version */}
        <View className="items-center py-8">
          <Text className="font-sans text-charcoal-300 text-sm">
            Only Friends v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
