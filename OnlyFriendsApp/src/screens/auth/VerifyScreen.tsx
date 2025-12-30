import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button, OTPInput } from "../../components/ui";
import { apiClient } from "../../lib";
import { useAuth } from "../../contexts";
import { colors } from "../../theme";
import type { AuthStackParamList } from "../../types/navigation";

type VerifyNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Verify">;
type VerifyRouteProp = RouteProp<AuthStackParamList, "Verify">;

const RESEND_TIMER = 60; // seconds

export function VerifyScreen() {
  const navigation = useNavigation<VerifyNavigationProp>();
  const route = useRoute<VerifyRouteProp>();
  const { setTokensAndUser } = useAuth();
  const { phone } = route.params;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.verifyPhoneNumber(phone, code);
      if (result.success && result.data) {
        if (result.data.is_new_user) {
          // New user - go to profile creation
          navigation.navigate("CreateProfile", { phone });
        } else {
          // Existing user - store tokens (this will trigger navigation to main app via AuthContext)
          await setTokensAndUser(result.data);
        }
      } else {
        setError(result.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.sendVerificationCode(phone);
      if (result.success) {
        setResendTimer(RESEND_TIMER);
        setCode("");
      } else {
        setError(result.error || "Failed to resend code");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, "").slice(-10);
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-300">
      <View className="flex-1 px-6 py-8">
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mb-6"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.charcoal[400]} />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-serif-bold text-forest-500 mb-2">
            Verify your number
          </Text>
          <Text className="text-charcoal-300 font-sans text-base">
            We sent a 6-digit code to{"\n"}
            <Text className="text-charcoal-400 font-sans-semibold">
              {formatPhone(phone)}
            </Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View className="mb-6">
          <OTPInput
            value={code}
            onChange={(value) => {
              setCode(value);
              setError(null);
            }}
            error={error || undefined}
          />
        </View>

        {/* Verify button */}
        <Button
          fullWidth
          size="lg"
          loading={loading}
          onPress={handleVerify}
          disabled={code.length !== 6}
        >
          Verify
        </Button>

        {/* Resend */}
        <View className="mt-6 items-center">
          {resendTimer > 0 ? (
            <Text className="text-charcoal-300 font-sans">
              Resend code in{" "}
              <Text className="text-forest-500 font-sans-semibold">
                {resendTimer}s
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text className="text-forest-500 font-sans-semibold">
                Resend code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Change number */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 items-center"
        >
          <Text className="text-charcoal-300 font-sans">
            Wrong number?{" "}
            <Text className="text-forest-500 font-sans-semibold">Change</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
