import React from "react";
import { View, Text, Image, ViewProps } from "react-native";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends ViewProps {
  source?: string | null;
  fallback?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; imageSize: number }> = {
  xs: { container: "w-6 h-6", text: "text-xs", imageSize: 24 },
  sm: { container: "w-8 h-8", text: "text-sm", imageSize: 32 },
  md: { container: "w-10 h-10", text: "text-base", imageSize: 40 },
  lg: { container: "w-12 h-12", text: "text-lg", imageSize: 48 },
  xl: { container: "w-16 h-16", text: "text-xl", imageSize: 64 },
};

export function Avatar({
  source,
  fallback,
  size = "md",
  className,
  style,
  ...props
}: AvatarProps) {
  const sizeConfig = sizeStyles[size];

  // Get initials from fallback
  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (source) {
    return (
      <View
        className={`${sizeConfig.container} rounded-full overflow-hidden bg-cream-400 ${className || ""}`}
        style={style}
        {...props}
      >
        <Image
          source={{ uri: source }}
          style={{
            width: sizeConfig.imageSize,
            height: sizeConfig.imageSize,
          }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View
      className={`${sizeConfig.container} rounded-full items-center justify-center bg-forest-100 ${className || ""}`}
      style={style}
      {...props}
    >
      <Text
        className={`${sizeConfig.text} font-semibold text-forest-600`}
        style={{ fontFamily: "Cabin_600SemiBold" }}
      >
        {getInitials(fallback)}
      </Text>
    </View>
  );
}

export default Avatar;
