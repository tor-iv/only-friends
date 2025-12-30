import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Button } from "../../components/ui";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";

const { width } = Dimensions.get("window");

const BACKGROUND_COLORS = [
  "#000000",
  colors.forest[500],
  colors.forest[700],
  "#1E3A8A", // Blue
  "#7C3AED", // Purple
  "#DC2626", // Red
  "#EA580C", // Orange
  "#CA8A04", // Yellow
];

type StoryMode = "text" | "image";

export function CreateStoryScreen() {
  const navigation = useNavigation();

  const [mode, setMode] = useState<StoryMode>("text");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState(BACKGROUND_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const canPost =
    mode === "text" ? content.trim().length > 0 : imageUri !== null;

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to add images to your story."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setMode("image");
    }
  };

  const handlePost = async () => {
    if (!canPost || loading) return;

    setLoading(true);

    try {
      const result = await apiClient.createStory({
        content: mode === "text" ? content.trim() : undefined,
        image_url: mode === "image" ? imageUri! : undefined,
        background_color: mode === "text" ? backgroundColor : undefined,
      });

      if (result.success) {
        navigation.goBack();
      } else {
        Alert.alert("Error", result.error || "Failed to create story");
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
        "Discard Story?",
        "You have unsaved changes. Are you sure you want to discard this story?",
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

  const handleSwitchToText = () => {
    setMode("text");
    setImageUri(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-charcoal-400" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={handleCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>

        <Text className="font-serif-bold text-lg text-white">New Story</Text>

        <Button
          onPress={handlePost}
          disabled={!canPost || loading}
          loading={loading}
          size="sm"
        >
          Share
        </Button>
      </View>

      {/* Preview */}
      <View
        className="flex-1 mx-4 rounded-2xl overflow-hidden"
        style={{ backgroundColor: mode === "text" ? backgroundColor : "black" }}
      >
        {mode === "image" && imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center px-8">
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Type your story..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              multiline
              maxLength={200}
              className="font-serif-bold text-2xl text-white text-center"
              style={{ textAlign: "center", lineHeight: 36 }}
            />
          </View>
        )}
      </View>

      {/* Bottom controls */}
      <View className="px-4 py-4">
        {mode === "text" ? (
          <>
            {/* Background color picker */}
            <Text className="text-white/70 text-xs font-sans mb-2">
              Background Color
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {BACKGROUND_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setBackgroundColor(color)}
                  className="mr-2"
                >
                  <View
                    className={`w-10 h-10 rounded-full ${
                      backgroundColor === color
                        ? "border-2 border-white"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : null}

        {/* Mode switcher */}
        <View className="flex-row items-center justify-center gap-4">
          <TouchableOpacity
            onPress={handleSwitchToText}
            className={`flex-row items-center px-4 py-2 rounded-full ${
              mode === "text" ? "bg-white/20" : ""
            }`}
          >
            <Ionicons
              name="text"
              size={20}
              color={mode === "text" ? "white" : "rgba(255,255,255,0.5)"}
            />
            <Text
              className={`ml-2 font-sans ${
                mode === "text" ? "text-white" : "text-white/50"
              }`}
            >
              Text
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePickImage}
            className={`flex-row items-center px-4 py-2 rounded-full ${
              mode === "image" ? "bg-white/20" : ""
            }`}
          >
            <Ionicons
              name="image"
              size={20}
              color={mode === "image" ? "white" : "rgba(255,255,255,0.5)"}
            />
            <Text
              className={`ml-2 font-sans ${
                mode === "image" ? "text-white" : "text-white/50"
              }`}
            >
              Photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
