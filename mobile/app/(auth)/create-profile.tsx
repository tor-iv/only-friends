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
import { ArrowLeft } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile } from "@/lib/supabase";

export default function CreateProfileScreen() {
  const router = useRouter();
  const { user, createProfile } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Please enter your name");
      return false;
    }
    if (displayName.trim().length < 2) {
      Alert.alert("Error", "Name must be at least 2 characters");
      return false;
    }
    if (displayName.trim().length > 30) {
      Alert.alert("Error", "Name must be 30 characters or less");
      return false;
    }
    if (!profileImage) {
      Alert.alert("Error", "Please add a profile photo");
      return false;
    }
    if (bio.length > 100) {
      Alert.alert("Error", "Bio must be 100 characters or less");
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert("Error", "Not authenticated. Please start over.");
      router.replace("/(auth)");
      return;
    }

    setIsLoading(true);

    try {
      // Upload profile image
      let avatarUrl: string | null = null;

      if (profileImage) {
        const fileName = `${user.id}/avatar.jpg`;
        const response = await fetch(profileImage);
        const blob = await response.blob();

        avatarUrl = await uploadFile("avatars", fileName, blob, "image/jpeg");

        if (!avatarUrl) {
          Alert.alert("Error", "Failed to upload profile photo. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      const result = await createProfile({
        display_name: displayName.trim(),
        avatar_url: avatarUrl!,
        bio: bio.trim() || undefined,
      });

      if (result.success) {
        // Go to contacts permission screen
        router.replace("/(auth)/contacts");
      } else {
        Alert.alert("Error", result.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
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
                Set up your profile
              </Text>
              <Text
                className="text-charcoal-300 mt-2 text-center"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Add a photo and name so friends recognize you
              </Text>
            </View>

            {/* Profile Picture */}
            <View className="items-center mb-6">
              <ProfilePictureUpload
                imageUri={profileImage}
                onImageSelected={setProfileImage}
              />
              <Text
                className="text-xs text-charcoal-300 mt-2"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                Required
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Display Name */}
              <View className="mb-4">
                <Input
                  label="Display Name"
                  placeholder="How friends see you"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  maxLength={30}
                />
                <Text
                  className="text-xs text-charcoal-300 mt-1 text-right"
                  style={{ fontFamily: "Cabin_400Regular" }}
                >
                  {displayName.length}/30
                </Text>
              </View>

              {/* Bio */}
              <View className="mb-4">
                <Input
                  label="Bio (optional)"
                  placeholder="A little about yourself"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  maxLength={100}
                  className="h-20"
                  textAlignVertical="top"
                />
                <Text
                  className="text-xs text-charcoal-300 mt-1 text-right"
                  style={{ fontFamily: "Cabin_400Regular" }}
                >
                  {bio.length}/100
                </Text>
              </View>
            </View>

            {/* Continue Button */}
            <View className="mt-6 mb-8">
              <Button
                onPress={handleContinue}
                isLoading={isLoading}
                disabled={!displayName.trim() || !profileImage}
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
