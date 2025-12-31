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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "../../components/ui";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/api-client";
import { pickImage, uploadImage } from "../../lib/image-service";
import { colors } from "../../theme";

export function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleChangePhoto = async () => {
    try {
      const image = await pickImage({ aspect: [1, 1], allowsEditing: true });
      if (!image) return;

      setUploadingAvatar(true);
      const result = await uploadImage(image.uri);

      if (result.success && result.url) {
        setAvatarUrl(result.url);
      } else {
        Alert.alert("Error", result.error || "Failed to upload photo");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to change photo");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First name and last name are required");
      return;
    }

    setLoading(true);

    try {
      const result = await apiClient.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        avatar_url: avatarUrl || undefined,
      });

      if (result.success) {
        await refreshUser();
        navigation.goBack();
      } else {
        Alert.alert("Error", result.error || "Failed to update profile");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-cream-400">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={colors.charcoal[400]} />
          </TouchableOpacity>
          <Text className="font-serif-bold text-lg text-charcoal-400">
            Edit Profile
          </Text>
          <Button onPress={handleSave} disabled={loading} loading={loading} size="sm">
            Save
          </Button>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Avatar Section */}
          <View className="items-center py-6">
            <TouchableOpacity onPress={handleChangePhoto} disabled={uploadingAvatar}>
              <Avatar name={fullName} imageUrl={avatarUrl} size="lg" />
              <View className="absolute bottom-0 right-0 bg-forest-500 rounded-full p-2">
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleChangePhoto}
              disabled={uploadingAvatar}
              className="mt-3"
            >
              <Text className="font-sans text-forest-500">
                {uploadingAvatar ? "Uploading..." : "Change Photo"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="px-4 gap-4">
            <View>
              <Text className="font-sans-semibold text-charcoal-400 mb-2">
                First Name
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor={colors.charcoal[300]}
                className="bg-white border border-cream-400 rounded-lg px-4 py-3 font-sans text-charcoal-400"
              />
            </View>

            <View>
              <Text className="font-sans-semibold text-charcoal-400 mb-2">
                Last Name
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor={colors.charcoal[300]}
                className="bg-white border border-cream-400 rounded-lg px-4 py-3 font-sans text-charcoal-400"
              />
            </View>

            <View>
              <Text className="font-sans-semibold text-charcoal-400 mb-2">
                Username
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="username"
                placeholderTextColor={colors.charcoal[300]}
                autoCapitalize="none"
                className="bg-white border border-cream-400 rounded-lg px-4 py-3 font-sans text-charcoal-400"
              />
              <Text className="font-sans text-xs text-charcoal-300 mt-1">
                This is how friends can find you
              </Text>
            </View>

            <View>
              <Text className="font-sans-semibold text-charcoal-400 mb-2">
                Bio
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Write something about yourself..."
                placeholderTextColor={colors.charcoal[300]}
                multiline
                maxLength={150}
                className="bg-white border border-cream-400 rounded-lg px-4 py-3 font-sans text-charcoal-400 min-h-[100px]"
                style={{ textAlignVertical: "top" }}
              />
              <Text className="font-sans text-xs text-charcoal-300 mt-1 text-right">
                {bio.length}/150
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
