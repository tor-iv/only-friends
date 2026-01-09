import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { X, ImageIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/ui";

export default function CreatePostScreen() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      Alert.alert("Error", "Please add some content or an image");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual post creation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "Post created!");
      setContent("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-cream"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 p-4">
          {/* Text Input */}
          <TextInput
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            className="min-h-[150] text-base text-charcoal-400 bg-white rounded-lg p-4 border border-cream-400"
            style={{ fontFamily: "Cabin_400Regular", textAlignVertical: "top" }}
            placeholderTextColor="#999"
          />

          {/* Image Preview */}
          {image && (
            <View className="mt-4 relative">
              <Image
                source={{ uri: image }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={removeImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 items-center justify-center"
              >
                <X color="white" size={20} />
              </TouchableOpacity>
            </View>
          )}

          {/* Add Image Button */}
          <TouchableOpacity
            onPress={pickImage}
            className="mt-4 flex-row items-center justify-center py-3 border border-cream-400 rounded-lg bg-white"
          >
            <ImageIcon color="#2D4F37" size={20} />
            <Text
              className="ml-2 text-forest-500"
              style={{ fontFamily: "Cabin_500Medium" }}
            >
              Add Photo
            </Text>
          </TouchableOpacity>

          {/* Post Button */}
          <View className="mt-6">
            <Button
              onPress={handlePost}
              isLoading={isLoading}
              disabled={!content.trim() && !image}
            >
              Post
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
