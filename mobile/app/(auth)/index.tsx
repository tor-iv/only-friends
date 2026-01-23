import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Button } from "@/components/ui";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(auth)/invite-code");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 justify-center">
        {/* Logo */}
        <View className="items-center mb-12">
          <Text
            className="text-5xl font-bold text-forest-500"
            style={{ fontFamily: "Lora_700Bold" }}
          >
            Only Friends
          </Text>
          <Text
            className="text-lg text-charcoal-300 mt-2"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Share with people who matter
          </Text>
        </View>

        {/* Value Props */}
        <View className="mb-12 space-y-4">
          <View className="flex-row items-center py-3">
            <View className="w-10 h-10 rounded-full bg-forest-100 items-center justify-center mr-4">
              <Text className="text-forest-500 text-lg">1</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-charcoal-400 font-medium"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                No algorithms
              </Text>
              <Text
                className="text-charcoal-300 text-sm"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Just posts from your real friends
              </Text>
            </View>
          </View>

          <View className="flex-row items-center py-3">
            <View className="w-10 h-10 rounded-full bg-forest-100 items-center justify-center mr-4">
              <Text className="text-forest-500 text-lg">2</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-charcoal-400 font-medium"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                No likes or comments
              </Text>
              <Text
                className="text-charcoal-300 text-sm"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Just "seen by" — know who cares
              </Text>
            </View>
          </View>

          <View className="flex-row items-center py-3">
            <View className="w-10 h-10 rounded-full bg-forest-100 items-center justify-center mr-4">
              <Text className="text-forest-500 text-lg">3</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-charcoal-400 font-medium"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                Contact-based connections
              </Text>
              <Text
                className="text-charcoal-300 text-sm"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Only connect with people you know
              </Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <Button onPress={handleGetStarted} className="mb-4">
          <Text
            className="text-white font-semibold text-base mr-2"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Get Started
          </Text>
          <ChevronRight color="white" size={18} />
        </Button>

        {/* Login Link */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="items-center py-2"
        >
          <Text
            className="text-forest-400 text-sm"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Policy */}
      <View className="pb-8 items-center">
        <TouchableOpacity>
          <Text
            className="text-xs text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
