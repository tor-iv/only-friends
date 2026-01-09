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
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Button, Input } from "@/components/ui";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";

export default function CreateProfileScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "Please enter your first name");
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert("Error", "Please enter your last name");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "Please create a password");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found. Please start over.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload profile image if selected
      let avatarUrl: string | undefined;
      if (profileImage) {
        const formData = new FormData();
        const filename = profileImage.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("file", {
          uri: profileImage,
          name: filename,
          type,
        } as any);

        const uploadResult = await apiClient.uploadImage(formData);
        if (uploadResult.success && uploadResult.data) {
          avatarUrl = uploadResult.data.url;
        }
      }

      const result = await register({
        phone_number: phoneNumber,
        email: email || undefined,
        first_name: firstName,
        last_name: lastName,
        password,
      });

      if (result.success) {
        // Registration successful - auth context will redirect to home
      } else {
        Alert.alert("Error", result.error || "Registration failed");
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
            <View className="items-center mb-6">
              <Text
                className="text-2xl font-bold text-charcoal-400"
                style={{ fontFamily: "Lora_700Bold" }}
              >
                Create Your Profile
              </Text>
            </View>

            {/* Profile Picture */}
            <View className="items-center mb-6">
              <ProfilePictureUpload
                imageUri={profileImage}
                onImageSelected={setProfileImage}
              />
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Name Row */}
              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Input
                    label="First Name"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Last Name"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Input
                  label="Email (optional)"
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View className="mb-4">
                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Confirm Password */}
              <View className="mb-4">
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {/* Birthday */}
              <View className="mb-4">
                <Text
                  className="mb-2 text-sm font-medium text-charcoal-400"
                  style={{ fontFamily: "Cabin_500Medium" }}
                >
                  Birthday (optional)
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="h-12 px-4 rounded-lg border border-cream-400 bg-white flex-row items-center"
                >
                  <Calendar color="#999" size={18} />
                  <Text
                    className={`ml-2 ${birthday ? "text-charcoal-400" : "text-charcoal-200"}`}
                    style={{ fontFamily: "Cabin_400Regular" }}
                  >
                    {birthday ? format(birthday, "MMMM d, yyyy") : "Select your birthday"}
                  </Text>
                </TouchableOpacity>
                <Text
                  className="text-xs text-charcoal-300 mt-1"
                  style={{ fontFamily: "Cabin_400Regular" }}
                >
                  Your birthday will be shared with friends on your special day.
                </Text>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={birthday || new Date(2000, 0, 1)}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1924, 0, 1)}
                />
              )}
            </View>

            {/* Continue Button */}
            <View className="mt-6 mb-8">
              <Button onPress={handleContinue} isLoading={isLoading}>
                Continue
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
