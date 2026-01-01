import React from "react";
import { View, Image, Text } from "react-native";
import { colors } from "../../theme";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: string | null;
  imageUrl?: string | null; // Alias for source
  name?: string;
  size?: AvatarSize;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: number; text: string; status: number }> = {
  xs: { container: 24, text: "text-xs", status: 8 },
  sm: { container: 32, text: "text-sm", status: 10 },
  md: { container: 48, text: "text-lg", status: 12 },
  lg: { container: 64, text: "text-2xl", status: 16 },
  xl: { container: 96, text: "text-4xl", status: 20 },
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({
  source,
  imageUrl,
  name,
  size = "md",
  showOnlineStatus = false,
  isOnline = false,
  className = "",
}: AvatarProps) {
  const sizeConfig = sizeMap[size];
  const containerSize = sizeConfig.container;
  const imageSource = source || imageUrl;

  return (
    <View className={`relative ${className}`}>
      {imageSource ? (
        <Image
          source={{ uri: imageSource }}
          style={{
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
          }}
          className="bg-cream-400"
        />
      ) : (
        <View
          style={{
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
          }}
          className="bg-forest-200 items-center justify-center"
        >
          <Text className={`text-forest-600 font-sans-bold ${sizeConfig.text}`}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {showOnlineStatus && (
        <View
          style={{
            width: sizeConfig.status,
            height: sizeConfig.status,
            borderRadius: sizeConfig.status / 2,
            borderWidth: 2,
            borderColor: colors.cream[300],
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          className={isOnline ? "bg-green-500" : "bg-charcoal-300"}
        />
      )}
    </View>
  );
}
