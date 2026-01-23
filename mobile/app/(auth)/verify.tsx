import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/ui";
import OtpInput from "@/components/OtpInput";
import { useAuth } from "@/contexts/AuthContext";

const COUNTDOWN_SECONDS = 300; // 5 minutes

export default function VerifyScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const { verifyOtp, sendOtp } = useAuth();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const maskPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 7) return phone;
    return `+${cleaned.slice(0, 2)} (***) ***-${cleaned.slice(-4)}`;
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit code");
      return;
    }

    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyOtp(phoneNumber, otp);

      if (result.success) {
        if (result.isNewUser) {
          // New user - go to profile creation
          router.replace("/(auth)/create-profile");
        }
        // Existing user - auth state will redirect via root layout
      } else {
        Alert.alert("Error", result.error || "Invalid verification code");
        setOtp("");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) return;

    setCanResend(false);
    setCountdown(COUNTDOWN_SECONDS);

    try {
      const result = await sendOtp(phoneNumber);
      if (result.success) {
        Alert.alert("Success", "A new code has been sent to your phone");
      } else {
        Alert.alert("Error", result.error || "Failed to resend code");
        setCanResend(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend code");
      setCanResend(true);
    }
  };

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
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
            {/* Header */}
            <View className="items-center mb-8">
              <Text
                className="text-2xl font-bold text-charcoal-400 mb-2"
                style={{ fontFamily: "Lora_700Bold" }}
              >
                Enter the code
              </Text>
              <Text
                className="text-charcoal-300 text-center"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Sent to {maskPhoneNumber(phoneNumber || "")}
              </Text>
            </View>

            {/* OTP Input */}
            <View className="mb-8">
              <OtpInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleOtpComplete}
              />
            </View>

            {/* Countdown & Resend */}
            <View className="items-center mb-8">
              <Text
                className="text-sm text-charcoal-300 mb-2"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Code expires in{" "}
                <Text style={{ fontFamily: "Cabin_600SemiBold" }}>
                  {formatTime(countdown)}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={!canResend}
                className={canResend ? "" : "opacity-50"}
              >
                <Text
                  className={`text-sm ${canResend ? "text-forest-500" : "text-charcoal-300"}`}
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  Resend code
                </Text>
              </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <Button
              onPress={handleVerify}
              isLoading={isLoading}
              disabled={otp.length !== 6}
            >
              Verify
            </Button>

            {/* Wrong Number Link */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center mt-4"
            >
              <Text
                className="text-sm text-forest-400"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Wrong number?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
