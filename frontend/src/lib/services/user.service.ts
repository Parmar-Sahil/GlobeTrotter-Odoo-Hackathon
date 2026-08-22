import apiClient from "../api";
import { User, Trip, ApiResponse } from "@/types";

export const userService = {
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    city?: string;
    country?: string;
    preferredLanguage?: string;
    currency?: string;
  }): Promise<User> {
    const res = await apiClient.put<ApiResponse<User>>("/users/profile", data);
    return res.data.data!;
  },

  async getPreplannedTrips(): Promise<Trip[]> {
    const res = await apiClient.get<ApiResponse<Trip[]>>(
      "/users/preplanned-trips"
    );
    return res.data.data || [];
  },

  async getPreviousTrips(): Promise<Trip[]> {
    const res = await apiClient.get<ApiResponse<Trip[]>>(
      "/users/previous-trips"
    );
    return res.data.data || [];
  },
};
