import apiClient from "../api";
import { AuthResponse, User, ApiResponse } from "@/types";

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  bio?: string;
}

export interface LoginDto {
  usernameOrEmail?: string;
  email?: string;
  password: string;
}

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data);
    const authData = res.data.data!;
    if (authData.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.user));
      }
    }
    return authData;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const payload = {
      usernameOrEmail: data.usernameOrEmail || data.email,
      password: data.password,
    };
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    const authData = res.data.data!;
    if (authData.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.user));
      }
    }
    return authData;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<{ user: User } | User>>("/auth/me");
    const data: any = res.data.data;
    if (data?.user) {
      return data.user;
    }
    return data as User;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },
};
