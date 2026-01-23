import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile } from "@/lib/supabase";
import { colors } from "@/theme";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, profile, updateProfile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleChangePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      if (!image || !user) return;

      setUploadingAvatar(true);

      // Upload to Supabase storage
      const fileName = `${user.id}/avatar-${Date.now()}.jpg`;
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const url = await uploadFile("avatars", fileName, blob, "image/jpeg");

      if (url) {
        setAvatarUrl(url);
      } else {
        Alert.alert("Error", "Failed to upload photo");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to change photo");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display name is required");
      return;
    }

    if (displayName.trim().length < 2) {
      Alert.alert("Error", "Name must be at least 2 characters");
      return;
    }

    if (displayName.trim().length > 30) {
      Alert.alert("Error", "Name must be 30 characters or less");
      return;
    }

    if (bio.length > 100) {
      Alert.alert("Error", "Bio must be 100 characters or less");
      return;
    }

    setLoading(true);

    try {
      const result = await updateProfile({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
      });

      if (result.success) {
        await refreshProfile();
        router.back();
      } else {
        Alert.alert("Error", result.error || "Failed to update profile");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-cream-300 bg-white">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X color={colors.charcoal[400]} size={28} />
          </TouchableOpacity>
          <Text
            className="font-bold text-lg text-charcoal-400"
            style={{ fontFamily: "Cabin_600SemiBold" }}
          >
            Edit Profile
          </Text>
          <Button
            onPress={handleSave}
            disabled={loading || !displayName.trim()}
            isLoading={loading}
            size="sm"
          >
            Save
          </Button>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Avatar Section */}
          <View className="items-center py-6 bg-white border-b border-cream-200">
            <TouchableOpacity onPress={handleChangePhoto} disabled={uploadingAvatar}>
              <Avatar name={displayName} imageUrl={avatarUrl} size="xl" />
              <View className="absolute bottom-0 right-0 bg-forest-500 rounded-full p-2">
                <Camera color="white" size={16} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleChangePhoto}
              disabled={uploadingAvatar}
              className="mt-3"
            >
              <Text
                className="text-forest-500"
                style={{ fontFamily: "Cabin_500Medium" }}
              >
                {uploadingAvatar ? "Uploading..." : "Change Photo"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="px-4 py-4 space-y-4">
            <View className="mb-4">
              <Text
                className="font-semibold text-charcoal-400 mb-2"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                Display Name
              </Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="How friends see you"
                placeholderTextColor={colors.charcoal[300]}
                maxLength={30}
                className="bg-white border border-cream-300 rounded-lg px-4 py-3 text-charcoal-400"
                style={{ fontFamily: "Cabin_400Regular" }}
              />
              <Text
                className="text-xs text-charcoal-300 mt-1 text-right"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                {displayName.length}/30
              </Text>
            </View>

            <View>
              <Text
                className="font-semibold text-charcoal-400 mb-2"
                style={{ fontFamily: "Cabin_600SemiBold" }}
              >
                Bio
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="A little about yourself..."
                placeholderTextColor={colors.charcoal[300]}
                multiline
                maxLength={100}
                className="bg-white border border-cream-300 rounded-lg px-4 py-3 text-charcoal-400 min-h-[100px]"
                style={{ textAlignVertical: "top", fontFamily: "Cabin_400Regular" }}
              />
              <Text
                className="text-xs text-charcoal-300 mt-1 text-right"
                style={{ fontFamily: "Cabin_400Regular" }}
              >
                {bio.length}/100
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
