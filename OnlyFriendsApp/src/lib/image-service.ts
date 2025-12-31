import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { storage } from "./storage";

// Types
export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  mimeType?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Configuration
const API_BASE_URL = __DEV__
  ? "http://localhost:8000"
  : "https://api.onlyfriends.app";

const MAX_IMAGE_DIMENSION = 1920;
const COMPRESSION_QUALITY = 0.8;

/**
 * Pick an image from the photo library
 */
export async function pickImage(
  options: {
    aspect?: [number, number];
    allowsEditing?: boolean;
  } = {}
): Promise<ImagePickerResult | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Permission to access photo library was denied");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: 1, // We'll compress later
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType,
  };
}

/**
 * Take a photo with the camera
 */
export async function takePhoto(
  options: {
    aspect?: [number, number];
    allowsEditing?: boolean;
  } = {}
): Promise<ImagePickerResult | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Permission to access camera was denied");
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: 1,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType,
  };
}

/**
 * Compress an image before upload
 */
export async function compressImage(
  uri: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<string> {
  const maxWidth = options.maxWidth ?? MAX_IMAGE_DIMENSION;
  const maxHeight = options.maxHeight ?? MAX_IMAGE_DIMENSION;
  const quality = options.quality ?? COMPRESSION_QUALITY;

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: {
          width: maxWidth,
          height: maxHeight,
        },
      },
    ],
    {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return result.uri;
}

/**
 * Upload an image to the backend with progress tracking
 */
export async function uploadImage(
  uri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    // Get auth token
    const accessToken = await storage.getAccessToken();

    if (!accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    // Compress image before upload
    const compressedUri = await compressImage(uri);

    // Create form data
    const formData = new FormData();
    const filename = compressedUri.split("/").pop() || "image.jpg";

    formData.append("file", {
      uri: compressedUri,
      name: filename,
      type: "image/jpeg",
    } as unknown as Blob);

    // Upload using XMLHttpRequest for progress tracking
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          });
        }
      });

      xhr.addEventListener("load", () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && response.success) {
            resolve({ success: true, url: response.url });
          } else {
            resolve({
              success: false,
              error: response.detail || "Upload failed",
            });
          }
        } catch {
          resolve({ success: false, error: "Failed to parse response" });
        }
      });

      xhr.addEventListener("error", () => {
        resolve({ success: false, error: "Network error" });
      });

      xhr.open("POST", `${API_BASE_URL}/upload/`);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      xhr.send(formData);
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Pick an image and upload it in one step
 */
export async function pickAndUploadImage(
  options: {
    aspect?: [number, number];
    allowsEditing?: boolean;
    onProgress?: (progress: UploadProgress) => void;
  } = {}
): Promise<UploadResult> {
  const image = await pickImage({
    aspect: options.aspect,
    allowsEditing: options.allowsEditing,
  });

  if (!image) {
    return { success: false, error: "No image selected" };
  }

  return uploadImage(image.uri, options.onProgress);
}

export const imageService = {
  pickImage,
  takePhoto,
  compressImage,
  uploadImage,
  pickAndUploadImage,
};
