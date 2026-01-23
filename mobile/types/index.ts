// Re-export all database types
export * from "./database";

// API Response types (for legacy compatibility)
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation types
export type RootStackParamList = {
  "(auth)": undefined;
  "(auth)/index": undefined;
  "(auth)/invite-code": undefined;
  "(auth)/login": undefined;
  "(auth)/verify": { phoneNumber: string };
  "(auth)/create-profile": undefined;
  "(auth)/contacts": undefined;
  "(tabs)": undefined;
  "(tabs)/index": undefined;
  "(tabs)/create": undefined;
  "(tabs)/profile": undefined;
  "connections": undefined;
  "connections/invite": undefined;
  "connections/find": undefined;
  "connections/user/[userId]": { userId: string };
  "post/[postId]/viewers": { postId: string };
};

// Notification types (for push notifications)
export interface PushNotificationData {
  type: "connection_request" | "daily_digest" | "screenshot_alert";
  title: string;
  body: string;
  data?: Record<string, unknown>;
}
