import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Verify: { phone: string };
  ForgotPassword: undefined;
  CreateProfile: { phone: string };
  ContactsAccess: undefined;
  InviteFriends: undefined;
  PendingProgress: undefined;
};

// Home Stack (nested in tab)
export type HomeStackParamList = {
  HomeFeed: undefined;
  Search: undefined;
  PostDetail: { postId: string };
  StoryViewer: { storyId: string; userId: string };
  UserProfile: { userId: string };
};

// Create Stack (nested in tab)
export type CreateStackParamList = {
  CreateChoice: undefined;
  CreatePost: undefined;
  CreateStory: undefined;
};

// Profile Stack (nested in tab)
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Friends: undefined;
  FriendDetail: { userId: string };
  Messages: undefined;
  Conversation: { conversationId: string; userId: string };
  NewMessage: undefined;
  Notifications: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  PrivacySettings: undefined;
  NotificationPreferences: undefined;
  BlockedAccounts: undefined;
  HelpSupport: undefined;
  About: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Navigator (switches between Auth and Main)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Screen props types
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

export type CreateStackScreenProps<T extends keyof CreateStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CreateStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

// Declare global navigation types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
