import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, Clock, Users, Camera } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme";

interface NotificationToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function NotificationToggle({
  icon,
  label,
  description,
  value,
  onValueChange,
}: NotificationToggleProps) {
  return (
    <View className="flex-row items-center px-4 py-4 bg-white">
      <View className="w-10 h-10 rounded-full bg-cream-100 items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1 mr-4">
        <Text
          className="text-charcoal-400"
          style={{ fontFamily: "Cabin_500Medium" }}
        >
          {label}
        </Text>
        <Text
          className="text-xs text-charcoal-300 mt-0.5"
          style={{ fontFamily: "Cabin_400Regular" }}
        >
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.charcoal[200], true: colors.forest[400] }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const TIME_OPTIONS = [
  { label: "8:00 AM", value: "08:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "4:00 PM", value: "16:00" },
  { label: "8:00 PM", value: "20:00" },
];

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [connectionRequests, setConnectionRequests] = useState(true);
  const [screenshotAlerts, setScreenshotAlerts] = useState(true);
  const [dailyDigestTime, setDailyDigestTime] = useState(
    profile?.notification_time || "20:00"
  );

  useEffect(() => {
    if (profile?.notification_time) {
      setDailyDigestTime(profile.notification_time);
    }
  }, [profile?.notification_time]);

  const handleTimeChange = async (time: string) => {
    if (!user) return;

    setDailyDigestTime(time);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ notification_time: time })
        .eq("id", user.id);

      if (error) throw error;

      await refreshProfile();
    } catch (error) {
      console.error("Error updating notification time:", error);
      Alert.alert("Error", "Failed to update notification time");
      // Revert on error
      setDailyDigestTime(profile?.notification_time || "20:00");
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-cream-300 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft color={colors.charcoal[400]} size={24} />
        </TouchableOpacity>
        <Text
          className="flex-1 text-center text-lg text-charcoal-400 mr-6"
          style={{ fontFamily: "Cabin_600SemiBold" }}
        >
          Notifications
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* General Section */}
        <View className="px-4 py-2 mt-4">
          <Text
            className="text-xs text-charcoal-300 uppercase"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            General
          </Text>
        </View>

        <View className="bg-white border-y border-cream-200">
          <NotificationToggle
            icon={<Bell color={colors.charcoal[400]} size={20} />}
            label="Push Notifications"
            description="Enable or disable all push notifications"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
        </View>

        {/* Activity Section */}
        <View className="px-4 py-2 mt-4">
          <Text
            className="text-xs text-charcoal-300 uppercase"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Activity
          </Text>
        </View>

        <View className="bg-white border-y border-cream-200">
          <NotificationToggle
            icon={<Users color={colors.charcoal[400]} size={20} />}
            label="Connection Requests"
            description="When someone sends you a connection request"
            value={connectionRequests}
            onValueChange={setConnectionRequests}
          />
          <View className="h-px bg-cream-200 ml-16" />
          <NotificationToggle
            icon={<Camera color={colors.charcoal[400]} size={20} />}
            label="Screenshot Alerts"
            description="When someone screenshots your post"
            value={screenshotAlerts}
            onValueChange={setScreenshotAlerts}
          />
        </View>

        {/* Daily Digest Section */}
        <View className="px-4 py-2 mt-4">
          <Text
            className="text-xs text-charcoal-300 uppercase"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Daily Digest
          </Text>
        </View>

        <View className="bg-white border-y border-cream-200 px-4 py-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-cream-100 items-center justify-center mr-3">
              <Clock color={colors.charcoal[400]} size={20} />
            </View>
            <View className="flex-1">
              <Text
                className="text-charcoal-400"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                Reminder Time
              </Text>
              <Text
                className="text-xs text-charcoal-300 mt-0.5"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                When to remind you to check in with friends
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 mt-2">
            {TIME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleTimeChange(option.value)}
                className={`px-4 py-2 rounded-full ${
                  dailyDigestTime === option.value
                    ? "bg-forest-500"
                    : "bg-cream-100"
                }`}
              >
                <Text
                  className={
                    dailyDigestTime === option.value
                      ? "text-white"
                      : "text-charcoal-400"
                  }
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Text */}
        <View className="px-4 py-3">
          <Text
            className="text-xs text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Only Friends sends a daily reminder to check in with your friends.
            We don't spam you with unnecessary notifications.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
