const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
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

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async sendVerificationCode(phoneNumber: string): Promise<ApiResponse> {
    return this.request('/auth/send-verification', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  async verifyPhoneNumber(phoneNumber: string, code: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, code }),
    });
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(phoneNumber: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, password }),
    });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getCurrentUser(accessToken: string): Promise<ApiResponse> {
    return this.request('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Utility method to set auth header for authenticated requests
  async authenticatedRequest<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });
  }
}

export const apiClient = new ApiClient();
