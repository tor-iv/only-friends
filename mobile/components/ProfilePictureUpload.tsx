import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Camera, User } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

interface ProfilePictureUploadProps {
  imageUri?: string | null;
  onImageSelected: (uri: string) => void;
}

export default function ProfilePictureUpload({
  imageUri,
  onImageSelected,
}: ProfilePictureUploadProps) {
  const pickImage = async () => {
    // Ask for permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to upload a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your camera to take a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const handlePress = () => {
    Alert.alert("Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="items-center justify-center"
    >
      <View className="relative">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-24 h-24 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-cream-400 items-center justify-center">
            <User color="#2D4F37" size={40} />
          </View>
        )}
        <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-forest-500 items-center justify-center border-2 border-white">
          <Camera color="white" size={16} />
        </View>
      </View>
      <Text
        className="mt-2 text-sm text-forest-500"
        style={{ fontFamily: "Cabin_500Medium" }}
      >
        Add Photo
      </Text>
    </TouchableOpacity>
  );
}
