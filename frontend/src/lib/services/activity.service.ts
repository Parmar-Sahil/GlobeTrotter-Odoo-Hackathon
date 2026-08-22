import apiClient from "../api";
import { Activity, ActivityCategory, ApiResponse } from "@/types";

export const activityService = {
  async search(params?: {
    query?: string;
    destinationId?: string;
    category?: ActivityCategory;
    minCost?: number;
    maxCost?: number;
    page?: number;
    limit?: number;
  }): Promise<{ activities: Activity[]; meta?: any }> {
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
