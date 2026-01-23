import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Ticket } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { validateInviteCode } from "@/lib/invites";

export default function InviteCodeScreen() {
  const router = useRouter();
  const { setPendingInviteCodeId } = useAuth();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!code.trim()) {
      setError("Please enter your invite code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await validateInviteCode(code);

      if (result.valid && result.inviteId) {
        // Store the invite code ID for claiming after profile creation
        setPendingInviteCodeId(result.inviteId);
        router.push("/(auth)/login");
      } else {
        setError(result.error || "Invalid invite code");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center py-4"
          >
            <ArrowLeft color="#2D4F37" size={20} />
            <Text
              className="ml-2 text-forest-500"
              style={{ fontFamily: "Cabin_500Medium" }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <View className="flex-1 justify-center">
            {/* Icon */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-forest-100 items-center justify-center">
                <Ticket color="#2D4F37" size={36} />
              </View>
            </View>

            {/* Header */}
            <View className="items-center mb-8">
              <Text
                className="text-2xl font-bold text-charcoal-400 mb-2"
                style={{ fontFamily: "Lora_700Bold" }}
              >
                Enter your invite code
              </Text>
              <Text
                className="text-charcoal-300 text-center"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Only Friends is invite-only. Ask a friend for their code to join.
              </Text>
            </View>

            {/* Code Input */}
            <View className="mb-6">
              <Input
                placeholder="Enter code (e.g., XXXX-XXXX)"
                value={code}
                onChangeText={(text) => {
                  setCode(text.toUpperCase());
                  setError("");
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                className="text-center text-lg tracking-widest"
              />
              {error ? (
                <Text
                  className="text-sm text-red-500 text-center mt-2"
                  style={{ fontFamily: "Cabin_400Regular" }}
                >
                  {error}
                </Text>
              ) : null}
            </View>

            {/* Continue Button */}
            <Button
              onPress={handleContinue}
              isLoading={isLoading}
              disabled={!code.trim()}
            >
              Continue
            </Button>
          </View>

          {/* No Code Link */}
          <View className="pb-8 items-center">
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Invite Only",
                  "Only Friends is invite-only to keep the community authentic. Ask a friend who's already on the app to share their invite code with you.",
                  [{ text: "Got it" }]
                )
              }
            >
              <Text
                className="text-sm text-forest-400"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Don't have a code?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
