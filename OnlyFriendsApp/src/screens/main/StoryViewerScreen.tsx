import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/ui";
import { apiClient } from "../../lib/api-client";
import { colors } from "../../theme";
import type { Story, StoryGroup } from "../../types";
import type { HomeStackParamList } from "../../types/navigation";

type RouteProps = RouteProp<HomeStackParamList, "StoryViewer">;

const { width, height } = Dimensions.get("window");
const STORY_DURATION = 5000; // 5 seconds per story

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function StoryViewerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { userId, storyId } = route.params;

  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const fetchStories = useCallback(async () => {
    const result = await apiClient.getStories();
    if (result.success && result.data) {
      setStoryGroups(result.data);

      // Find the starting group and story index
      const groupIndex = result.data.findIndex((g) => g.user_id === userId);
      if (groupIndex !== -1) {
        setCurrentGroupIndex(groupIndex);

        const storyIndex = result.data[groupIndex].stories.findIndex(
          (s) => s.id === storyId
        );
        setCurrentStoryIndex(storyIndex !== -1 ? storyIndex : 0);
      }
    }
    setLoading(false);
  }, [userId, storyId]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];
  const fullName = currentGroup
    ? `${currentGroup.user_first_name} ${currentGroup.user_last_name}`
    : "";

  // Mark story as viewed
  useEffect(() => {
    if (currentStory && !currentStory.is_viewed) {
      apiClient.viewStory(currentStory.id);
    }
  }, [currentStory?.id]);

  // Progress animation
  useEffect(() => {
    if (!currentStory || isPaused) return;

    progressAnim.setValue(0);

    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        goToNextStory();
      }
    });

    return () => {
      animationRef.current?.stop();
    };
  }, [currentStory?.id, isPaused]);

  const goToNextStory = () => {
    if (!currentGroup) return;

    if (currentStoryIndex < currentGroup.stories.length - 1) {
      // Next story in same group
      setCurrentStoryIndex((prev) => prev + 1);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      // Next group
      setCurrentGroupIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      // End of all stories
      navigation.goBack();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      // Previous story in same group
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentGroupIndex > 0) {
      // Previous group, last story
      setCurrentGroupIndex((prev) => prev - 1);
      setCurrentStoryIndex(
        storyGroups[currentGroupIndex - 1].stories.length - 1
      );
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
    animationRef.current?.stop();
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const handleTap = (event: { nativeEvent: { locationX: number } }) => {
    const { locationX } = event.nativeEvent;
    if (locationX < width / 3) {
      goToPrevStory();
    } else {
      goToNextStory();
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  if (loading || !currentStory || !currentGroup) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "black" }}
        className="items-center justify-center"
      >
        <StatusBar barStyle="light-content" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: currentStory.background_color }}>
      <StatusBar barStyle="light-content" />

      {/* Story content */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleTap}
        style={{ flex: 1 }}
      >
        {currentStory.image_url ? (
          <Image
            source={{ uri: currentStory.image_url }}
            style={{ width, height }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center px-8">
            <Text
              className="text-white text-2xl font-serif-bold text-center"
              style={{ lineHeight: 36 }}
            >
              {currentStory.content}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Overlay header */}
      <View
        className="absolute top-0 left-0 right-0 pt-12 px-4"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
        }}
      >
        {/* Progress bars */}
        <View className="flex-row mb-3">
          {currentGroup.stories.map((story, index) => (
            <View
              key={story.id}
              className="flex-1 h-1 bg-white/30 rounded-full mx-0.5 overflow-hidden"
            >
              <Animated.View
                className="h-full bg-white rounded-full"
                style={{
                  width:
                    index < currentStoryIndex
                      ? "100%"
                      : index === currentStoryIndex
                      ? progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        })
                      : "0%",
                }}
              />
            </View>
          ))}
        </View>

        {/* User info */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Avatar
              name={fullName}
              imageUrl={currentGroup.user_avatar_url}
              size="sm"
            />
            <Text className="ml-2 font-sans-semibold text-white">
              {fullName}
            </Text>
            <Text className="ml-2 font-sans text-white/70 text-xs">
              {formatTimestamp(currentStory.created_at)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Views count (for own stories) */}
      {currentStory.views_count > 0 && (
        <View className="absolute bottom-8 left-0 right-0 items-center">
          <View className="flex-row items-center bg-black/30 rounded-full px-3 py-1">
            <Ionicons name="eye-outline" size={16} color="white" />
            <Text className="ml-1 font-sans text-white text-sm">
              {currentStory.views_count}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
