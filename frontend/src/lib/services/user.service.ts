import apiClient from "../api";
import { User, Trip, ApiResponse } from "@/types";

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  profilePhotoUrl?: string;
  phone?: string;
  phoneNumber?: string;
  bio?: string;
  city?: string;
  country?: string;
  preferredLanguage?: string;
  language?: string;
  currency?: string;
}

export const userService = {
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const payload = {
      ...data,
      profilePhotoUrl: data.profilePhotoUrl || data.avatarUrl,
      avatarUrl: data.avatarUrl || data.profilePhotoUrl,
      phone: data.phone || data.phoneNumber,
      phoneNumber: data.phoneNumber || data.phone,
      language: data.language || data.preferredLanguage,
      preferredLanguage: data.preferredLanguage || data.language,
    };
    const res = await apiClient.put<ApiResponse<User>>("/users/profile", payload);
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
