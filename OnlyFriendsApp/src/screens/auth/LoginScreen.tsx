import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "../../components/ui";
import { apiClient } from "../../lib";
import { useAuth } from "../../contexts";
import { colors } from "../../theme";
import type { AuthStackParamList } from "../../types/navigation";

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();
  const { setTokensAndUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const getE164Phone = () => {
    const digits = phone.replace(/\D/g, "");
    return `+1${digits}`;
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhoneNumber(text));
    setError(null);
  };

  const handleContinue = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isNewUser) {
        // Send verification code for new user
        const result = await apiClient.sendVerificationCode(getE164Phone());
        if (result.success) {
          navigation.navigate("Verify", { phone: getE164Phone() });
        } else {
          setError(result.error || "Failed to send verification code");
        }
      } else {
        // Login existing user
        if (!password) {
          setError("Please enter your password");
          setLoading(false);
          return;
        }
        const result = await apiClient.login(getE164Phone(), password);
        if (result.success && result.data) {
          // Store tokens - this will trigger navigation to main app via AuthContext
          await setTokensAndUser(result.data);
        } else {
          setError(result.error || "Login failed");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
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
                {isNewUser ? "Create your account" : "Welcome back"}
              </Text>
              <Text className="text-charcoal-300 font-sans text-base">
                {isNewUser
                  ? "Enter your phone number to get started"
                  : "Sign in to your account"}
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <Input
                label="Phone Number"
                placeholder="(555) 555-5555"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                leftIcon="call-outline"
                autoFocus
              />

              {!isNewUser && (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon="lock-closed-outline"
                />
              )}

              {error && (
                <Text className="text-red-500 text-sm font-sans">{error}</Text>
              )}

              <Button
                fullWidth
                size="lg"
                loading={loading}
                onPress={handleContinue}
                className="mt-4"
              >
                {isNewUser ? "Continue" : "Sign In"}
              </Button>
            </View>

            {/* Toggle between new/existing user */}
            <TouchableOpacity
              onPress={() => {
                setIsNewUser(!isNewUser);
                setError(null);
              }}
              className="mt-6"
            >
              <Text className="text-center text-charcoal-300 font-sans">
                {isNewUser ? "Already have an account? " : "Don't have an account? "}
                <Text className="text-forest-500 font-sans-semibold">
                  {isNewUser ? "Sign in" : "Sign up"}
                </Text>
              </Text>
            </TouchableOpacity>

            {!isNewUser && (
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
                className="mt-4"
              >
                <Text className="text-center text-forest-500 font-sans-semibold">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
