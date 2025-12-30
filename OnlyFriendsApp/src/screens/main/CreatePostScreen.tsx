import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Button, Avatar } from "../../components/ui";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";

const MAX_CONTENT_LENGTH = 2000;

export function CreatePostScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canPost = content.trim().length > 0 || imageUri !== null;
  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CONTENT_LENGTH;

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to add images to your post."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handlePost = async () => {
    if (!canPost || isOverLimit || loading) return;

    setLoading(true);

    try {
      // TODO: Upload image to storage and get URL
      // For now, we'll just use the local URI as a placeholder
      const result = await apiClient.createPost({
        content: content.trim(),
        image_url: imageUri ?? undefined,
      });

      if (result.success) {
        // Go back or navigate to home
        navigation.goBack();
      } else {
        Alert.alert("Error", result.error || "Failed to create post");
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (content.trim() || imageUri) {
      Alert.alert(
        "Discard Post?",
        "You have unsaved changes. Are you sure you want to discard this post?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const fullName = user ? `${user.first_name} ${user.last_name}` : "";

  return (
    <SafeAreaView className="flex-1 bg-cream-300" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-cream-400">
          <TouchableOpacity onPress={handleCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text className="font-sans text-charcoal-400">Cancel</Text>
          </TouchableOpacity>

          <Text className="font-serif-bold text-lg text-charcoal-400">
            New Post
          </Text>

          <Button
            onPress={handlePost}
            disabled={!canPost || isOverLimit || loading}
            loading={loading}
            size="sm"
          >
            Post
          </Button>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* User info */}
          <View className="flex-row items-center px-4 pt-4">
            <Avatar name={fullName} imageUrl={user?.avatar_url} size="md" />
            <Text className="ml-3 font-sans-semibold text-charcoal-400">
              {fullName}
            </Text>
          </View>

          {/* Content input */}
          <View className="px-4 pt-4">
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.charcoal[300]}
              multiline
              maxLength={MAX_CONTENT_LENGTH + 100} // Allow some overflow for visual feedback
              className="font-sans text-charcoal-400 text-base min-h-[120px]"
              style={{ textAlignVertical: "top" }}
              autoFocus
            />
          </View>

          {/* Character count */}
          <View className="px-4 pt-2">
            <Text
              className={`text-xs font-sans text-right ${
                isOverLimit ? "text-red-500" : "text-charcoal-300"
              }`}
            >
              {characterCount}/{MAX_CONTENT_LENGTH}
            </Text>
          </View>

          {/* Image preview */}
          {imageUri && (
            <View className="px-4 pt-4">
              <View className="relative">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full rounded-lg"
                  style={{ aspectRatio: 1 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom toolbar */}
        <View className="flex-row items-center px-4 py-3 border-t border-cream-400">
          <TouchableOpacity
            onPress={handlePickImage}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="image-outline" size={24} color={colors.forest[500]} />
            <Text className="ml-2 font-sans text-forest-500">Add Photo</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
