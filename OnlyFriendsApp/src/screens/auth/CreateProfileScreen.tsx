import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Avatar } from "../../components/ui";
import { apiClient } from "../../lib";
import { useAuth } from "../../contexts";
import { colors } from "../../theme";
import type { AuthStackParamList } from "../../types/navigation";

type CreateProfileNavigationProp = NativeStackNavigationProp<AuthStackParamList, "CreateProfile">;
type CreateProfileRouteProp = RouteProp<AuthStackParamList, "CreateProfile">;

export function CreateProfileScreen() {
  const navigation = useNavigation<CreateProfileNavigationProp>();
  const route = useRoute<CreateProfileRouteProp>();
  const { setTokensAndUser } = useAuth();
  const { phone } = route.params;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProfile = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const result = await apiClient.register({
        phone_number: phone,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || undefined,
        password,
      });

      if (result.success && result.data) {
        // Store tokens - this will trigger navigation to main app via AuthContext
        await setTokensAndUser(result.data);
      } else {
        setErrors({ general: result.error || "Registration failed" });
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
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
            <View className="mb-6">
              <Text className="text-3xl font-serif-bold text-forest-500 mb-2">
                Create your profile
              </Text>
              <Text className="text-charcoal-300 font-sans text-base">
                Tell us a bit about yourself
              </Text>
            </View>

            {/* Profile picture */}
            <TouchableOpacity className="items-center mb-6">
              <View className="relative">
                <Avatar size="xl" name={`${firstName} ${lastName}`} />
                <View className="absolute bottom-0 right-0 bg-forest-500 rounded-full p-2">
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </View>
              <Text className="text-forest-500 font-sans-semibold mt-2">
                Add photo
              </Text>
            </TouchableOpacity>

            {/* Form */}
            <View className="gap-2">
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }}
                    error={errors.firstName}
                    autoCapitalize="words"
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }}
                    error={errors.lastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <Input
                label="Email (optional)"
                placeholder="john@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
              />

              <Input
                label="Password"
                placeholder="At least 8 characters"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                error={errors.password}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                error={errors.confirmPassword}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              {errors.general && (
                <Text className="text-red-500 text-sm font-sans text-center">
                  {errors.general}
                </Text>
              )}

              <Button
                fullWidth
                size="lg"
                loading={loading}
                onPress={handleCreateProfile}
                className="mt-4"
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
