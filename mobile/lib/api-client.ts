import { secureStorage, STORAGE_KEYS } from "./storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VerificationRequest {
  phone_number: string;
}

export interface VerificationCheck {
  phone_number: string;
  code: string;
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
  bio?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  is_temporary: boolean;
  expires_at?: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    username?: string;
    avatar_url?: string;
  };
}

export interface Story {
  id: string;
  user_id: string;
  content?: string;
  image_url?: string;
  background_color?: string;
  expires_at: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: "text" | "image" | "system";
  image_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  last_message?: Message;
  unread_count: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async getAccessToken(): Promise<string | null> {
    return secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || data.message || "An error occurred",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Authentication endpoints
  async sendVerificationCode(phoneNumber: string): Promise<ApiResponse> {
    return this.request("/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  async verifyPhoneNumber(
    phoneNumber: string,
    code: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/verify-phone", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber, code }),
    });
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(
    phoneNumber: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber, password }),
    });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = await this.getAccessToken();
    if (!token) {
      return { success: false, error: "No access token" };
    }
    return this.request<User>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Authenticated request helper
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAccessToken();
    if (!token) {
      return { success: false, error: "No access token" };
    }
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  // Posts
  async getPosts(limit = 20, offset = 0): Promise<ApiResponse<Post[]>> {
    return this.authenticatedRequest<Post[]>(
      `/posts/?limit=${limit}&offset=${offset}`
    );
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return this.authenticatedRequest<Post>(`/posts/${postId}`);
  }

  async createPost(data: {
    content: string;
    image_url?: string;
    is_temporary?: boolean;
  }): Promise<ApiResponse<Post>> {
    return this.authenticatedRequest<Post>("/posts/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async likePost(postId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/posts/${postId}/like`, {
      method: "POST",
    });
  }

  async unlikePost(postId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/posts/${postId}/like`, {
      method: "DELETE",
    });
  }

  // Stories
  async getStories(): Promise<ApiResponse<Story[]>> {
    return this.authenticatedRequest<Story[]>("/stories/");
  }

  async createStory(data: {
    content?: string;
    image_url?: string;
    background_color?: string;
  }): Promise<ApiResponse<Story>> {
    return this.authenticatedRequest<Story>("/stories/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async viewStory(storyId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/stories/${storyId}/view`, {
      method: "POST",
    });
  }

  // Messages
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.authenticatedRequest<Conversation[]>("/messages/");
  }

  async getMessages(userId: string): Promise<ApiResponse<Message[]>> {
    return this.authenticatedRequest<Message[]>(`/messages/${userId}`);
  }

  async sendMessage(
    recipientId: string,
    content: string
  ): Promise<ApiResponse<Message>> {
    return this.authenticatedRequest<Message>("/messages/", {
      method: "POST",
      body: JSON.stringify({ recipient_id: recipientId, content }),
    });
  }

  // Friends
  async getFriends(): Promise<ApiResponse<User[]>> {
    return this.authenticatedRequest<User[]>("/friends/");
  }

  async sendFriendRequest(userId: string): Promise<ApiResponse> {
    return this.authenticatedRequest("/friends/request", {
      method: "POST",
      body: JSON.stringify({ recipient_id: userId }),
    });
  }

  async respondToFriendRequest(
    requestId: string,
    accept: boolean
  ): Promise<ApiResponse> {
    return this.authenticatedRequest(`/friends/requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify({ status: accept ? "accepted" : "rejected" }),
    });
  }

  // Search
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return this.authenticatedRequest<User[]>(
      `/users/search/${encodeURIComponent(query)}`
    );
  }

  // Profile
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.authenticatedRequest<User>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Upload
  async uploadImage(formData: FormData): Promise<ApiResponse<{ url: string }>> {
    const token = await this.getAccessToken();
    if (!token) {
      return { success: false, error: "No access token" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || "Upload failed",
        };
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload error",
      };
    }
  }
}

export const apiClient = new ApiClient();
