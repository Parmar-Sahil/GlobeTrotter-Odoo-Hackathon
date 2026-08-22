import apiClient from "../api";
import { Destination, ApiResponse } from "@/types";

export const destinationService = {
  async getTopRegional(): Promise<Destination[]> {
    const res = await apiClient.get<ApiResponse<Destination[]>>(
      "/destinations/top-regional"
    );
    return res.data.data || [];
  },

  async search(params?: {
    query?: string;
    region?: string;
    country?: string;
    page?: number;
    limit?: number;
  }): Promise<{ destinations: Destination[]; meta?: any }> {
    const res = await apiClient.get<ApiResponse<Destination[]>>(
      "/destinations/search",
      { params }
    );
    return {
      destinations: res.data.data || [],
      meta: (res.data as any).meta,
    };
  },

  async getById(id: string): Promise<Destination> {
    const res = await apiClient.get<ApiResponse<Destination>>(
      `/destinations/${id}`
    );
    return res.data.data!;
  },

  async getSuggestions(id: string): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(
      `/destinations/${id}/suggestions`
    );
    return res.data.data;
  },
};
