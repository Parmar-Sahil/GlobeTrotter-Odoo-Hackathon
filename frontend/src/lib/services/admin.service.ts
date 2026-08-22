import apiClient from "../api";
import { User, ApiResponse } from "@/types";

export const adminService = {
  async getUsers(params?: { page?: number; limit?: number }): Promise<{ users: User[]; meta?: any }> {
    const res = await apiClient.get<ApiResponse<User[]>>("/admin/users", {
      params,
    });
    return {
      users: res.data.data || [],
      meta: (res.data as any).meta,
    };
  },

  async getPopularCitiesAnalytics(): Promise<any> {
    const res = await apiClient.get("/admin/analytics/popular-cities");
    return res.data.data;
  },

  async getPopularActivitiesAnalytics(): Promise<any> {
    const res = await apiClient.get("/admin/analytics/popular-activities");
    return res.data.data;
  },

  async getUserTrendsAnalytics(): Promise<any> {
    const res = await apiClient.get("/admin/analytics/user-trends");
    return res.data.data;
  },
};
