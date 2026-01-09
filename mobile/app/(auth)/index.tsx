import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

const COUNTRY_CODES = [
  { code: "+1", label: "US" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "AU" },
  { code: "+33", label: "FR" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { sendVerificationCode } = useAuth();
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleGetStarted = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setIsLoading(true);
    const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;

    try {
      const result = await sendVerificationCode(fullPhoneNumber);
      if (result.success) {
        router.push({
          pathname: "/(auth)/verify",
          params: { phoneNumber: fullPhoneNumber },
        });
      } else {
        Alert.alert("Error", result.error || "Failed to send verification code");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center">
            {/* Logo */}
            <View className="items-center mb-12">
              <Text
                className="text-5xl font-bold text-forest-500"
                style={{ fontFamily: "Lora_700Bold" }}
              >
                Only Friends
              </Text>
            </View>

            {/* Phone Input */}
            <View className="mb-6">
              <View className="flex-row">
                {/* Country Code Selector */}
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                  className="h-12 px-3 rounded-l-lg border border-r-0 border-cream-400 bg-white items-center justify-center"
                >
                  <Text
                    className="text-base text-charcoal-400"
                    style={{ fontFamily: "Cabin_500Medium" }}
                  >
                    {countryCode}
                  </Text>
                </TouchableOpacity>

                {/* Phone Number Input */}
                <View className="flex-1">
                  <Input
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    className="rounded-l-none"
                  />
                </View>
              </View>

              {/* Country Code Dropdown */}
              {showCountryPicker && (
                <View className="absolute top-14 left-0 z-10 bg-white border border-cream-400 rounded-lg shadow-lg">
                  {COUNTRY_CODES.map((country) => (
                    <TouchableOpacity
                      key={country.label}
                      onPress={() => {
                        setCountryCode(country.code);
                        setShowCountryPicker(false);
                      }}
                      className="px-4 py-3 border-b border-cream-200"
                    >
                      <Text
                        className="text-charcoal-400"
                        style={{ fontFamily: "Cabin_400Regular" }}
                      >
                        {country.code} ({country.label})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text
                className="text-xs text-charcoal-300 mt-2"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                We'll send a verification code to this number
              </Text>
            </View>

            {/* Get Started Button */}
            <Button
              onPress={handleGetStarted}
              isLoading={isLoading}
              className="mb-4"
            >
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
