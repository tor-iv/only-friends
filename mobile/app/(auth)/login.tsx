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
import { ArrowLeft, Phone } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

const COUNTRY_CODES = [
  { code: "+1", label: "US" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "AU" },
  { code: "+33", label: "FR" },
  { code: "+49", label: "DE" },
  { code: "+81", label: "JP" },
];

export default function PhoneEntryScreen() {
  const router = useRouter();
  const { sendOtp } = useAuth();

  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleContinue = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    // Basic validation
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    setIsLoading(true);

    const fullPhoneNumber = `${countryCode}${cleanedNumber}`;

    try {
      const result = await sendOtp(fullPhoneNumber);

      if (result.success) {
        router.push({
          pathname: "/(auth)/verify",
          params: { phoneNumber: fullPhoneNumber },
        });
      } else {
        setError(result.error || "Failed to send verification code");
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
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
                  <Phone color="#2D4F37" size={36} />
                </View>
              </View>

              {/* Header */}
              <View className="items-center mb-8">
                <Text
                  className="text-2xl font-bold text-charcoal-400 mb-2"
                  style={{ fontFamily: "Lora_700Bold" }}
                >
                  What's your number?
                </Text>
                <Text
                  className="text-charcoal-300 text-center"
                  style={{ fontFamily: "Cabin_400Regular" }}
                >
                  We'll send you a code to verify it's really you.
                </Text>
              </View>

              {/* Phone Input */}
              <View className="mb-6 relative z-10">
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
                      placeholder="(555) 123-4567"
                      value={phoneNumber}
                      onChangeText={(text) => {
                        setPhoneNumber(text);
                        setError("");
                      }}
                      keyboardType="phone-pad"
                      className="rounded-l-none"
                    />
                  </View>
                </View>

                {/* Country Code Dropdown */}
                {showCountryPicker && (
                  <View className="absolute top-14 left-0 z-20 bg-white border border-cream-400 rounded-lg shadow-lg">
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

                {error ? (
                  <Text
                    className="text-sm text-red-500 mt-2"
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
                disabled={!phoneNumber.trim()}
              >
                Continue
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
