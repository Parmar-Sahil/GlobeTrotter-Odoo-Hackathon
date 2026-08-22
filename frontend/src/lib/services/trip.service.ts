import apiClient from "../api";
import {
  Trip,
  ItinerarySection,
  ItineraryItem,
  BudgetSummary,
  ApiResponse,
} from "@/types";

export interface CreateTripDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  budgetLimit?: number;
  currency?: string;
  coverImage?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "FRIENDS";
}

export interface UpdateTripDto extends Partial<CreateTripDto> {
  status?: "PLANNING" | "ONGOING" | "COMPLETED" | "CANCELLED";
}

export interface AddSectionDto {
  destinationId?: string;
  title: string;
  date?: string;
  arrivalDate?: string;
  departureDate?: string;
  order?: number;
}

export interface AddItemDto {
  activityId?: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  cost?: number;
  order?: number;
  category?: string;
}

export const tripService = {
  async getMyTrips(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ trips: Trip[]; meta?: any }> {
    const res = await apiClient.get<ApiResponse<Trip[]>>("/trips/my-trips", {
      params,
    });
    return {
      trips: res.data.data || [],
      meta: (res.data as any).meta,
    };
  },

  async getTripById(id: string): Promise<Trip> {
    const res = await apiClient.get<ApiResponse<Trip>>(`/trips/${id}`);
    return res.data.data!;
  },

  async createTrip(data: CreateTripDto): Promise<Trip> {
    const res = await apiClient.post<ApiResponse<Trip>>("/trips", data);
    return res.data.data!;
  },

  async updateTrip(id: string, data: UpdateTripDto): Promise<Trip> {
    const res = await apiClient.put<ApiResponse<Trip>>(`/trips/${id}`, data);
    return res.data.data!;
  },

  async deleteTrip(id: string): Promise<void> {
    await apiClient.delete(`/trips/${id}`);
  },

  async addSection(tripId: string, data: AddSectionDto): Promise<ItinerarySection> {
    const res = await apiClient.post<ApiResponse<ItinerarySection>>(
      `/trips/${tripId}/sections`,
      data
    );
    return res.data.data!;
  },

  async addItem(sectionId: string, data: AddItemDto): Promise<ItineraryItem> {
    const res = await apiClient.post<ApiResponse<ItineraryItem>>(
      `/trips/sections/${sectionId}/items`,
      data
    );
    return res.data.data!;
  },

  async getItinerary(tripId: string): Promise<{ sections: ItinerarySection[] }> {
    const res = await apiClient.get<ApiResponse<{ sections: ItinerarySection[] }>>(
      `/trips/${tripId}/itinerary`
    );
    return res.data.data || { sections: [] };
  },

  async getBudgetSummary(tripId: string): Promise<BudgetSummary> {
    const res = await apiClient.get<ApiResponse<BudgetSummary>>(
      `/trips/${tripId}/budget-summary`
    );
    return res.data.data!;
  },

  async getCalendar(year?: number, month?: number): Promise<any> {
    const res = await apiClient.get("/trips/calendar", {
      params: { year, month },
    });
    return res.data.data;
  },
};
