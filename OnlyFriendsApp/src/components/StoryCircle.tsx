import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "./ui";
import { colors } from "../theme";

type StoryCircleSize = "sm" | "md" | "lg";

interface StoryCircleProps {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  hasUnviewed: boolean;
  isOwn?: boolean;
  hasStory?: boolean;
  size?: StoryCircleSize;
  onPress: () => void;
}

const sizeMap: Record<StoryCircleSize, { container: number; avatar: "sm" | "md" | "lg"; ring: number }> = {
  sm: { container: 56, avatar: "sm", ring: 2 },
  md: { container: 72, avatar: "md", ring: 3 },
  lg: { container: 88, avatar: "lg", ring: 3 },
};

export function StoryCircle({
  userId,
  firstName,
  lastName,
  avatarUrl,
  hasUnviewed,
  isOwn = false,
  hasStory = true,
  size = "md",
  onPress,
}: StoryCircleProps) {
  const dimensions = sizeMap[size];
  const fullName = `${firstName} ${lastName}`;
  const displayName = isOwn ? "Your Story" : firstName;

  const renderRing = () => {
    if (isOwn && !hasStory) {
      // No ring for own story if no active story
      return null;
    }

    if (hasUnviewed) {
      // Gradient ring for unviewed stories
      return (
        <LinearGradient
          colors={[colors.forest[400], colors.forest[600], colors.forest[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.ring,
            {
              width: dimensions.container,
              height: dimensions.container,
              borderRadius: dimensions.container / 2,
            },
          ]}
        />
      );
    }

    // Gray ring for viewed stories
    return (
      <View
        style={[
          styles.ring,
          styles.viewedRing,
          {
            width: dimensions.container,
            height: dimensions.container,
            borderRadius: dimensions.container / 2,
          },
        ]}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="items-center"
      style={{ width: dimensions.container + 16 }}
    >
      <View
        className="items-center justify-center"
        style={{
          width: dimensions.container,
          height: dimensions.container,
        }}
      >
        {renderRing()}
        <View
          className="absolute items-center justify-center bg-cream-300"
          style={{
            width: dimensions.container - dimensions.ring * 4,
            height: dimensions.container - dimensions.ring * 4,
            borderRadius: (dimensions.container - dimensions.ring * 4) / 2,
          }}
        >
          <Avatar
            name={fullName}
            imageUrl={avatarUrl}
            size={dimensions.avatar}
          />
        </View>

        {/* Add button for own story */}
        {isOwn && (
          <View
            className="absolute bg-forest-500 items-center justify-center"
            style={[
              styles.addButton,
              {
                right: 0,
                bottom: 0,
              },
            ]}
          >
            <Ionicons name="add" size={14} color="white" />
          </View>
        )}
      </View>

      <Text
        className="text-xs font-sans text-charcoal-400 mt-1 text-center"
        numberOfLines={1}
      >
        {displayName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
  },
  viewedRing: {
    borderWidth: 2,
    borderColor: colors.charcoal[200],
  },
  addButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.cream[300],
  },
});
