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
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

const COUNTRY_CODES = [
  { code: "+1", label: "US" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "AU" },
  { code: "+33", label: "FR" },
];

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setIsLoading(true);

    const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;

    try {
      const result = await login(fullPhoneNumber, password);
      if (!result.success) {
        setError(result.error || "Invalid phone number or password");
      }
      // If successful, the auth context will redirect to home
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

            {/* Header */}
            <View className="items-center mb-8">
              <Text
                className="text-3xl font-bold text-charcoal-400 mb-2"
                style={{ fontFamily: "Lora_700Bold" }}
              >
                Welcome Back
              </Text>
              <Text
                className="text-charcoal-300"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Log in to connect with your friends
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Phone Number */}
              <View className="mb-4">
                <Text
                  className="mb-2 text-sm font-medium text-charcoal-400"
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  Phone Number
                </Text>
                <View className="flex-row">
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
                  <View className="flex-1">
                    <Input
                      placeholder="(555) 123-4567"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      className="rounded-l-none"
                    />
                  </View>
                </View>
                {showCountryPicker && (
                  <View className="absolute top-20 left-0 z-10 bg-white border border-cream-400 rounded-lg shadow-lg">
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
              </View>

              {/* Password */}
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text
                    className="text-sm font-medium text-charcoal-400"
                    style={{ fontFamily: "Cabin_500Medium" }}
                  >
                    Password
                  </Text>
                  <TouchableOpacity>
                    <Text
                      className="text-xs text-forest-500"
                      style={{ fontFamily: "Cabin_400Regular" }}
                    >
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="relative">
                  <Input
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff color="#999" size={20} />
                    ) : (
                      <Eye color="#999" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error */}
              {error ? (
                <Text
                  className="text-sm text-red-500 text-center mb-4"
                  style={{ fontFamily: "Cabin_400Regular" }}
                >
                  {error}
                </Text>
              ) : null}

              {/* Login Button */}
              <Button
                onPress={handleLogin}
                isLoading={isLoading}
                className="mb-4"
              >
                Log In
              </Button>

              {/* Sign Up Link */}
              <View className="items-center">
                <Text
                  className="text-sm text-charcoal-300"
                  style={{ fontFamily: "Cabin_400Regular" }}
                >
                  Don't have an account?{" "}
                  <Text
                    className="text-forest-500"
                    onPress={() => router.replace("/(auth)")}
                  >
                    Sign up
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
