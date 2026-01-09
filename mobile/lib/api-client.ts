import { secureStorage, STORAGE_KEYS } from "./storage";
import type {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  User,
  Post,
  Comment,
  Story,
  StoryGroup,
  CreatePostRequest,
  CreateStoryRequest,
  Friend,
  FriendRequest,
  Conversation,
  Message,
} from "../types";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async getAccessToken(): Promise<string | null> {
    return secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private async getRefreshToken(): Promise<string | null> {
    return secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
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

  private async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const result = await this.request<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    // Handle token expiration
    if (!result.success && result.error?.includes("expired")) {
      const refreshed = await this.refreshToken();
      if (refreshed.success) {
        // Retry with new token
        const newToken = await this.getAccessToken();
        return this.request<T>(endpoint, {
          ...options,
          headers: {
            Authorization: `Bearer ${newToken}`,
            ...options.headers,
          },
        });
      }
    }

    return result;
  }

  // ============ Auth Endpoints ============

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

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = await this.getRefreshToken();

    if (!refreshToken) {
      return { success: false, error: "No refresh token" };
    }

    const result = await this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (result.success && result.data?.access_token && result.data?.refresh_token) {
      await this.setTokens(result.data.access_token, result.data.refresh_token);
    }

    return result;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.authenticatedRequest<User>("/auth/me", {
      method: "GET",
    });
  }

  // ============ User Endpoints ============

  async getProfile(): Promise<ApiResponse<User>> {
    return this.authenticatedRequest<User>("/users/me", {
      method: "GET",
    });
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.authenticatedRequest<User>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.authenticatedRequest<User>(`/users/${userId}`, {
      method: "GET",
    });
  }

  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return this.authenticatedRequest<User[]>(`/users/search/${encodeURIComponent(query)}`, {
      method: "GET",
    });
  }

  // ============ Posts Endpoints ============

  async getFeed(limit = 20, offset = 0): Promise<ApiResponse<Post[]>> {
    return this.authenticatedRequest<Post[]>(`/posts/?limit=${limit}&offset=${offset}`, {
      method: "GET",
    });
  }

  async createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
    return this.authenticatedRequest<Post>("/posts/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return this.authenticatedRequest<Post>(`/posts/${postId}`, {
      method: "GET",
    });
  }

  async deletePost(postId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/posts/${postId}`, {
      method: "DELETE",
    });
  }

  // ============ Likes Endpoints ============

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

  async getPostLikes(postId: string, limit = 50, offset = 0): Promise<ApiResponse<User[]>> {
    return this.authenticatedRequest<User[]>(
      `/posts/${postId}/likes?limit=${limit}&offset=${offset}`,
      { method: "GET" }
    );
  }

  // ============ Comments Endpoints ============

  async getPostComments(postId: string, limit = 50, offset = 0): Promise<ApiResponse<Comment[]>> {
    return this.authenticatedRequest<Comment[]>(
      `/posts/${postId}/comments?limit=${limit}&offset=${offset}`,
      { method: "GET" }
    );
  }

  async addComment(postId: string, content: string): Promise<ApiResponse<Comment>> {
    return this.authenticatedRequest<Comment>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(postId: string, commentId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
  }

  // ============ Stories Endpoints ============

  async getStories(): Promise<ApiResponse<StoryGroup[]>> {
    return this.authenticatedRequest<StoryGroup[]>("/stories/", {
      method: "GET",
    });
  }

  async createStory(data: CreateStoryRequest): Promise<ApiResponse<Story>> {
    return this.authenticatedRequest<Story>("/stories/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getStory(storyId: string): Promise<ApiResponse<Story>> {
    return this.authenticatedRequest<Story>(`/stories/${storyId}`, {
      method: "GET",
    });
  }

  async viewStory(storyId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/stories/${storyId}/view`, {
      method: "POST",
    });
  }

  async deleteStory(storyId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/stories/${storyId}`, {
      method: "DELETE",
    });
  }

  // ============ Messages Endpoints ============

  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.authenticatedRequest<Conversation[]>("/messages/", {
      method: "GET",
    });
  }

  async getMessages(userId: string, limit = 50, offset = 0): Promise<ApiResponse<Message[]>> {
    return this.authenticatedRequest<Message[]>(
      `/messages/${userId}?limit=${limit}&offset=${offset}`,
      { method: "GET" }
    );
  }

  async sendMessage(
    recipientId: string,
    content: string,
    imageUrl?: string
  ): Promise<ApiResponse<Message>> {
    return this.authenticatedRequest<Message>("/messages/", {
      method: "POST",
      body: JSON.stringify({
        recipient_id: recipientId,
        content,
        image_url: imageUrl,
        message_type: imageUrl ? "image" : "text",
      }),
    });
  }

  async markMessageRead(messageId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/messages/${messageId}/read`, {
      method: "PUT",
    });
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return this.authenticatedRequest<{ count: number }>("/messages/unread/count", {
      method: "GET",
    });
  }

  // ============ Friends Endpoints ============

  async getFriends(): Promise<ApiResponse<Friend[]>> {
    return this.authenticatedRequest<Friend[]>("/friends/", {
      method: "GET",
    });
  }

  async sendFriendRequest(recipientId: string): Promise<ApiResponse> {
    return this.authenticatedRequest("/friends/request", {
      method: "POST",
      body: JSON.stringify({ recipient_id: recipientId }),
    });
  }

  async getFriendRequests(type: "received" | "sent" = "received"): Promise<ApiResponse<FriendRequest[]>> {
    return this.authenticatedRequest<FriendRequest[]>(`/friends/requests?type=${type}`, {
      method: "GET",
    });
  }

  async respondToFriendRequest(
    requestId: string,
    status: "accepted" | "rejected"
  ): Promise<ApiResponse> {
    return this.authenticatedRequest(`/friends/requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async removeFriend(friendId: string): Promise<ApiResponse> {
    return this.authenticatedRequest(`/friends/${friendId}`, {
      method: "DELETE",
    });
  }

  async getFriendSuggestions(limit = 10): Promise<ApiResponse<User[]>> {
    return this.authenticatedRequest<User[]>(`/friends/suggestions?limit=${limit}`, {
      method: "GET",
    });
  }

  // ============ Upload Endpoints ============

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

// Re-export types for convenience
export type {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  User,
  Post,
  Comment,
  Story,
  StoryGroup,
  CreatePostRequest,
  CreateStoryRequest,
  Friend,
  FriendRequest,
  Conversation,
  Message,
} from "../types";
