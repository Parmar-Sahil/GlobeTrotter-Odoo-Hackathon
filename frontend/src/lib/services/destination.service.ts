import apiClient from "../api";
import { Destination, ApiResponse } from "@/types";

export interface DestinationSearchParams {
  search?: string;
  query?: string;
  region?: string;
  country?: string;
  sortBy?: "popularityScore" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const destinationService = {
  async getTopRegional(): Promise<Destination[]> {
    const res = await apiClient.get<ApiResponse<Destination[]>>(
      "/destinations/top-regional"
    );
    return res.data.data || [];
  },

  async search(params?: DestinationSearchParams): Promise<{ destinations: Destination[]; meta?: any }> {
    const formattedParams: any = { ...params };
    if (params?.query && !params?.search) {
      formattedParams.search = params.query;
    }
    const res = await apiClient.get<ApiResponse<Destination[]>>(
      "/destinations/search",
      { params: formattedParams }
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
