import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Users, Shield } from "lucide-react-native";
import { Button } from "@/components/ui";
import {
  requestContactsPermission,
  syncContactHashes,
} from "@/lib/contacts";

export default function ContactsPermissionScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAllowAccess = async () => {
    setIsLoading(true);

    try {
      const granted = await requestContactsPermission();

      if (granted) {
        // Sync contact hashes to database
        const result = await syncContactHashes();

        if (result.success) {
          // Navigate to main app
          router.replace("/(tabs)");
        } else {
          Alert.alert(
            "Sync Error",
            "We couldn't sync your contacts. You can try again later in Settings.",
            [
              {
                text: "Continue Anyway",
                onPress: () => router.replace("/(tabs)"),
              },
            ]
          );
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Without contacts access, you won't be able to find friends who are already on Only Friends. You can enable this later in Settings.",
          [
            {
              text: "Skip for Now",
              onPress: () => router.replace("/(tabs)"),
            },
            {
              text: "Try Again",
              onPress: handleAllowAccess,
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting contacts:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Contacts?",
      "Without contacts access, you won't be able to find friends who are already on Only Friends. You can enable this later in Settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          onPress: () => router.replace("/(tabs)"),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 justify-center">
        {/* Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-forest-100 items-center justify-center">
            <Users color="#2D4F37" size={48} />
          </View>
        </View>

        {/* Header */}
        <View className="items-center mb-8">
          <Text
            className="text-2xl font-bold text-charcoal-400 mb-3"
            style={{ fontFamily: "Lora_700Bold" }}
          >
            Find your friends
          </Text>
          <Text
            className="text-charcoal-300 text-center leading-6"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Only Friends connects you with people already in your contacts.
            We'll find friends who have your number saved too.
          </Text>
        </View>

        {/* Privacy Note */}
        <View className="bg-forest-50 rounded-xl p-4 mb-8 flex-row items-start">
          <Shield color="#2D4F37" size={20} className="mt-1" />
          <View className="flex-1 ml-3">
            <Text
              className="text-forest-600 font-medium mb-1"
              style={{ fontFamily: "Cabin_600SemiBold" }}
            >
              Your privacy is protected
            </Text>
            <Text
              className="text-forest-500 text-sm leading-5"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              We hash your contacts on-device and never store raw phone numbers.
              Only mutual matches can connect.
            </Text>
          </View>
        </View>

        {/* Allow Access Button */}
        <Button onPress={handleAllowAccess} isLoading={isLoading} className="mb-4">
          Allow Access
        </Button>

        {/* Skip Link */}
        <TouchableOpacity onPress={handleSkip} className="items-center py-3">
          <Text
            className="text-forest-400 text-sm"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
