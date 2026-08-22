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
  cityId?: string;
  destinationId?: string;
  description?: string;
  startDate: string;
  endDate: string;
  totalBudget?: number;
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
  cityId?: string;
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  arrivalDate?: string;
  departureDate?: string;
  order?: number;
}

export interface AddItemDto {
  activityId?: string;
  title: string;
  itemType?: "activity" | "transport" | "accommodation" | "meal" | "other";
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  cost?: number;
  costEstimate?: number;
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
    const payload: any = {
      ...data,
      totalBudget: data.totalBudget || data.budgetLimit,
      budgetLimit: data.budgetLimit || data.totalBudget,
      cityId: data.cityId || data.destinationId,
    };
    const res = await apiClient.post<ApiResponse<Trip>>("/trips", payload);
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
    const payload: any = {
      ...data,
      cityId: data.cityId || data.destinationId,
      destinationId: data.destinationId || data.cityId,
      startDate: data.startDate || data.arrivalDate || data.date,
      endDate: data.endDate || data.departureDate || data.date,
    };
    const res = await apiClient.post<ApiResponse<ItinerarySection>>(
      `/trips/${tripId}/sections`,
      payload
    );
    return res.data.data!;
  },

  async addItem(sectionId: string, data: AddItemDto): Promise<ItineraryItem> {
    const payload: any = {
      ...data,
      costEstimate: data.costEstimate || data.cost,
      cost: data.cost || data.costEstimate,
      itemType: data.itemType || "activity",
    };
    const res = await apiClient.post<ApiResponse<ItineraryItem>>(
      `/trips/sections/${sectionId}/items`,
      payload
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
