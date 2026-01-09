// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface AuthResponse {
  user_id: string;
  phone_number: string;
  is_verified: boolean;
  is_new_user: boolean;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}

export interface User {
  id: string;
  phone_number: string;
  email?: string;
  first_name: string;
  last_name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  birthday?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  phone_number: string;
  email?: string;
  first_name: string;
  last_name: string;
  username?: string;
  password: string;
}

export interface LoginRequest {
  phone_number: string;
  password: string;
}

// Post types
export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  location?: string;
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  // User info from join
  user_first_name: string;
  user_last_name: string;
  user_username?: string;
  user_avatar_url?: string;
}

export interface CreatePostRequest {
  content: string;
  image_url?: string;
  location?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // User info from join
  user_first_name: string;
  user_last_name: string;
  user_avatar_url?: string;
}

// Story types
export interface Story {
  id: string;
  user_id: string;
  content?: string;
  image_url?: string;
  background_color: string;
  views_count: number;
  is_viewed: boolean;
  expires_at: string;
  created_at: string;
  // User info from join
  user_first_name: string;
  user_last_name: string;
  user_avatar_url?: string;
}

export interface StoryGroup {
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  user_avatar_url?: string;
  stories: Story[];
  has_unviewed: boolean;
}

export interface CreateStoryRequest {
  content?: string;
  image_url?: string;
  background_color?: string;
}

// Message types
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  image_url?: string;
  message_type: "text" | "image" | "system";
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant: User;
  last_message?: Message;
  unread_count: number;
  updated_at: string;
}

// Friend types
export interface Friend {
  id: string;
  user: User;
  status: "pending" | "accepted" | "blocked";
  created_at: string;
}

export interface FriendRequest {
  id: string;
  requester: User;
  addressee: User;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

// Notification types
export interface AppNotification {
  id: string;
  user_id: string;
  type: "comment" | "friend_request" | "story" | "message" | "system";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  phone_number: string;
  status: "not_on_app" | "pending" | "connected";
}
