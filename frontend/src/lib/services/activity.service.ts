import apiClient from "../api";
import { Activity, ActivityCategory, ApiResponse } from "@/types";

export interface ActivitySearchParams {
  city?: string;
  query?: string;
  destinationId?: string;
  category?: ActivityCategory | string;
  minCost?: number;
  maxCost?: number;
  sortBy?: "popularityScore" | "cost" | "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
  groupBy?: "category" | "city";
  page?: number;
  limit?: number;
}

export const activityService = {
  async search(params?: ActivitySearchParams): Promise<{ activities: Activity[]; meta?: any }> {
    const res = await apiClient.get<ApiResponse<Activity[]>>(
      "/activities/search",
      { params }
    );
    return {
      activities: res.data.data || [],
      meta: (res.data as any).meta,
    };
  },

  async getById(id: string): Promise<Activity> {
    const res = await apiClient.get<ApiResponse<Activity>>(`/activities/${id}`);
    return res.data.data!;
  },
};
