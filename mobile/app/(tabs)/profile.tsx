import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  Settings,
  ChevronRight,
  Users,
  Grid3X3,
  LogOut,
} from "lucide-react-native";
import { Avatar, Card, CardContent, Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const displayName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "User";

  return (
    <ScrollView className="flex-1 bg-cream">
      {/* Profile Header */}
      <View className="items-center pt-6 pb-4 px-4">
        <Avatar
          source={user?.avatar_url}
          fallback={displayName}
          size="xl"
        />
        <Text
          className="mt-4 text-2xl font-bold text-charcoal-400"
          style={{ fontFamily: "Lora_700Bold" }}
        >
          {displayName}
        </Text>
        {user?.username && (
          <Text
            className="text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            @{user.username}
          </Text>
        )}
        {user?.bio && (
          <Text
            className="mt-2 text-center text-charcoal-400 px-8"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {user.bio}
          </Text>
        )}
      </View>

      {/* Stats */}
      <View className="flex-row justify-center gap-8 py-4 border-y border-cream-400">
        <View className="items-center">
          <Text
            className="text-xl font-bold text-charcoal-400"
            style={{ fontFamily: "Cabin_700Bold" }}
          >
            0
          </Text>
          <Text
            className="text-sm text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Posts
          </Text>
        </View>
        <View className="items-center">
          <Text
            className="text-xl font-bold text-charcoal-400"
            style={{ fontFamily: "Cabin_700Bold" }}
          >
            0
          </Text>
          <Text
            className="text-sm text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Friends
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View className="p-4">
        <Card className="mb-4">
          <CardContent className="p-0">
            <MenuItem
              icon={<Grid3X3 color="#2D4F37" size={20} />}
              title="My Posts"
              onPress={() => {}}
            />
            <MenuItem
              icon={<Users color="#2D4F37" size={20} />}
              title="Friends"
              onPress={() => {}}
            />
            <MenuItem
              icon={<Settings color="#2D4F37" size={20} />}
              title="Settings"
              onPress={() => {}}
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
      <ChevronRight color="#999" size={20} />
    </TouchableOpacity>
  );
}
