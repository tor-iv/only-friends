import { View, Text, FlatList, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { Card, CardContent, Avatar } from "@/components/ui";

// Mock data for now
const MOCK_POSTS = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: null,
    },
    content: "Just had the best coffee at that new cafe downtown!",
    timeAgo: "2h ago",
    likes: 12,
    comments: 3,
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: null,
    },
    content: "Weekend hiking vibes. Nature is the best therapy.",
    timeAgo: "4h ago",
    likes: 24,
    comments: 8,
  },
  {
    id: "3",
    user: {
      name: "Emma Wilson",
      avatar: null,
    },
    content: "Finally finished that book I've been reading for months. Highly recommend 'The Midnight Library'!",
    timeAgo: "6h ago",
    likes: 18,
    comments: 5,
  },
];

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="mb-4 mx-4">
      <CardContent className="pt-4">
        <View className="flex-row items-center mb-3">
          <Avatar fallback={post.user.name} size="md" />
          <View className="ml-3">
            <Text
              className="text-base font-semibold text-charcoal-400"
              style={{ fontFamily: "Cabin_600SemiBold" }}
            >
              {post.user.name}
            </Text>
            <Text
              className="text-xs text-charcoal-300"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              {post.timeAgo}
            </Text>
          </View>
        </View>
        <Text
          className="text-base text-charcoal-400 mb-3"
          style={{ fontFamily: "Cabin_400Regular" }}
        >
          {post.content}
        </Text>
        <View className="flex-row items-center">
          <Text
            className="text-sm text-charcoal-300 mr-4"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {post.likes} likes
          </Text>
          <Text
            className="text-sm text-charcoal-300"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {post.comments} comments
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View className="flex-1 bg-cream">
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2D4F37"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text
              className="text-lg text-charcoal-300 text-center"
              style={{ fontFamily: "Cabin_400Regular" }}
            >
              No posts yet. Add some friends to see their posts!
            </Text>
          </View>
        }
      />
    </View>
  );
}
