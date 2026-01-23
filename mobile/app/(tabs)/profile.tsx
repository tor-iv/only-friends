import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Settings,
  ChevronRight,
  Users,
  Grid3X3,
  LogOut,
  Edit2,
} from "lucide-react-native";
import { Avatar, Card, CardContent, Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { getConnections } from "@/lib/connections";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const [connectionCount, setConnectionCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, [user?.id]);

  const loadStats = async () => {
    if (!user?.id) return;

    try {
      // Get connection count
      const connections = await getConnections();
      setConnectionCount(connections.length);

      // Get post count
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("archived_at", null);

      setPostCount(count || 0);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const displayName = profile?.display_name || "User";

  return (
    <ScrollView className="flex-1 bg-cream">
      {/* Profile Header */}
      <View className="items-center pt-6 pb-4 px-4">
        <Avatar
          name={displayName}
          imageUrl={profile?.avatar_url}
          size="xl"
        />
        <Text
          className="mt-4 text-2xl font-bold text-charcoal-400"
          style={{ fontFamily: "Lora_700Bold" }}
        >
          {displayName}
        </Text>
        {profile?.bio && (
          <Text
            className="mt-2 text-center text-charcoal-400 px-8"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {profile.bio}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => router.push("/edit-profile")}
          className="mt-4 flex-row items-center bg-forest-500 px-4 py-2 rounded-lg"
        >
          <Edit2 color="white" size={16} />
          <Text
            className="ml-2 text-white font-semibold"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className="flex-row justify-center gap-8 py-4 border-y border-cream-400">
        <View className="items-center">
          <Text
            className="text-xl font-bold text-charcoal-400"
            style={{ fontFamily: "Cabin_700Bold" }}
          >
            {postCount}
          </Text>
          <Text
            className="text-sm text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Posts
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/connections")}
          className="items-center"
        >
          <Text
            className="text-xl font-bold text-charcoal-400"
            style={{ fontFamily: "Cabin_700Bold" }}
          >
            {connectionCount}
          </Text>
          <Text
            className="text-sm text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {profile?.connection_cap
              ? `of ${profile.connection_cap}`
              : "Connections"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View className="p-4">
        <Card className="mb-4">
          <CardContent className="p-0">
            <MenuItem
              icon={<Grid3X3 color={colors.forest[500]} size={20} />}
              title="My Posts"
              onPress={() => {}}
            />
            <MenuItem
              icon={<Users color={colors.forest[500]} size={20} />}
              title="Connections"
              onPress={() => router.push("/connections")}
            />
            <MenuItem
              icon={<Settings color={colors.forest[500]} size={20} />}
              title="Settings"
              onPress={() => router.push("/settings")}
              showBorder={false}
            />
          </CardContent>
        </Card>

        <Button variant="destructive" onPress={handleLogout}>
          <View className="flex-row items-center">
            <LogOut color="white" size={18} />
            <Text
              className="ml-2 text-white font-semibold"
              style={{ fontFamily: "Cabin_600SemiBold" }}
            >
              Log Out
            </Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showBorder?: boolean;
}

function MenuItem({ icon, title, onPress, showBorder = true }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between p-4 ${
        showBorder ? "border-b border-cream-200" : ""
      }`}
    >
      <View className="flex-row items-center">
        {icon}
        <Text
          className="ml-3 text-base text-charcoal-400"
          style={{ fontFamily: "Cabin_500Medium" }}
        >
          {title}
        </Text>
      </View>
      <ChevronRight color={colors.charcoal[300]} size={20} />
    </TouchableOpacity>
  );
}
