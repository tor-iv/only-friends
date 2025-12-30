import React from "react";
import { View, ScrollView } from "react-native";
import { StoryCircle } from "./StoryCircle";
import type { StoryGroup, User } from "../types";

interface StoryRowProps {
  storyGroups: StoryGroup[];
  currentUser: User;
  currentUserHasStory: boolean;
  onStoryPress: (userId: string) => void;
  onCreateStory: () => void;
}

export function StoryRow({
  storyGroups,
  currentUser,
  currentUserHasStory,
  onStoryPress,
  onCreateStory,
}: StoryRowProps) {
  // Find current user's story group if it exists
  const currentUserStoryGroup = storyGroups.find(
    (group) => group.user_id === currentUser.id
  );

  // Filter out current user from the list (will be shown first)
  const otherStoryGroups = storyGroups.filter(
    (group) => group.user_id !== currentUser.id
  );

  const handleOwnStoryPress = () => {
    if (currentUserHasStory) {
      onStoryPress(currentUser.id);
    } else {
      onCreateStory();
    }
  };

  return (
    <View className="border-b border-cream-400 bg-cream-300">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 12 }}
      >
        {/* Current user's story - always first */}
        <StoryCircle
          userId={currentUser.id}
          firstName={currentUser.first_name}
          lastName={currentUser.last_name}
          avatarUrl={currentUser.avatar_url}
          hasUnviewed={currentUserStoryGroup?.has_unviewed ?? false}
          isOwn={true}
          hasStory={currentUserHasStory}
          onPress={handleOwnStoryPress}
        />

        {/* Other users' stories */}
        {otherStoryGroups.map((group) => (
          <StoryCircle
            key={group.user_id}
            userId={group.user_id}
            firstName={group.user_first_name}
            lastName={group.user_last_name}
            avatarUrl={group.user_avatar_url}
            hasUnviewed={group.has_unviewed}
            onPress={() => onStoryPress(group.user_id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
