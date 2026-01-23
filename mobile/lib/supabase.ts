import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { secureStorage } from "./storage";
import type { Database } from "../types/database";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => secureStorage.getItem(key),
      setItem: (key, value) => secureStorage.setItem(key, value),
      removeItem: (key) => secureStorage.removeItem(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper to get public URL for storage items
export function getStorageUrl(bucket: "avatars" | "posts", path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Helper to upload file to storage
export async function uploadFile(
  bucket: "avatars" | "posts",
  path: string,
  file: Blob | ArrayBuffer,
  contentType: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  return getStorageUrl(bucket, data.path);
}

// Helper to delete file from storage
export async function deleteFile(
  bucket: "avatars" | "posts",
  path: string
): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Delete error:", error);
    return false;
  }

  return true;
}
