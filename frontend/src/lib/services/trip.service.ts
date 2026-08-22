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

export interface UpdateItemDto extends Partial<AddItemDto> {
  stopId?: string;
}

export interface UpdateSectionDto extends Partial<AddSectionDto> {}

export const tripService = {
  async getMyTrips(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ trips: Trip[]; meta?: any }> {
    const res = await apiClient.get<ApiResponse<any[]>>("/trips/my-trips", {
      params,
    });
    const rawTrips = res.data.data || [];
    const trips: Trip[] = rawTrips.map((t: any) => ({
      ...t,
      title: t.name || t.title || "Untitled Trip",
      name: t.name || t.title || "Untitled Trip",
      coverImage: t.coverPhotoUrl || t.coverImage || null,
      coverPhotoUrl: t.coverPhotoUrl || t.coverImage || null,
      budgetLimit: t.totalBudget || t.budgetLimit || 0,
      totalBudget: t.totalBudget || t.budgetLimit || 0,
      destinationCount: t._count?.stops ?? t.stops?.length ?? 0,
    }));
    return {
      trips,
      meta: (res.data as any).meta,
    };
  },

  async getTripById(id: string): Promise<Trip> {
    const res = await apiClient.get<ApiResponse<any>>(`/trips/${id}`);
    const t = res.data.data!;
    return {
      ...t,
      title: t.name || t.title || "Untitled Trip",
      name: t.name || t.title || "Untitled Trip",
      coverImage: t.coverPhotoUrl || t.coverImage || null,
      coverPhotoUrl: t.coverPhotoUrl || t.coverImage || null,
      budgetLimit: t.totalBudget || t.budgetLimit || 0,
      totalBudget: t.totalBudget || t.budgetLimit || 0,
      destinationCount: t._count?.stops ?? t.stops?.length ?? 0,
    };
  },

  async createTrip(data: CreateTripDto): Promise<Trip> {
    const payload: any = {
      title: data.title,
      name: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      totalBudget: data.totalBudget || data.budgetLimit || 0,
      budgetLimit: data.budgetLimit || data.totalBudget || 0,
      coverImage: data.coverImage,
      coverPhotoUrl: data.coverImage,
      notes: data.description,
      description: data.description,
      destinationId: data.destinationId || data.cityId,
      cityId: data.cityId || data.destinationId,
    };
    const res = await apiClient.post<ApiResponse<any>>("/trips", payload);
    const t = res.data.data!;
    return {
      ...t,
      title: t.name || t.title || data.title,
      name: t.name || t.title || data.title,
      coverImage: t.coverPhotoUrl || t.coverImage || data.coverImage || null,
      coverPhotoUrl: t.coverPhotoUrl || t.coverImage || data.coverImage || null,
      budgetLimit: t.totalBudget || t.budgetLimit || data.budgetLimit || 0,
      totalBudget: t.totalBudget || t.budgetLimit || data.budgetLimit || 0,
    };
  },

  async updateTrip(id: string, data: UpdateTripDto): Promise<Trip> {
    const payload: any = {
      ...data,
      name: data.title,
      coverPhotoUrl: data.coverImage,
      totalBudget: data.totalBudget || data.budgetLimit,
    };
    const res = await apiClient.put<ApiResponse<any>>(`/trips/${id}`, payload);
    const t = res.data.data!;
    return {
      ...t,
      title: t.name || t.title || "Untitled Trip",
      name: t.name || t.title || "Untitled Trip",
      coverImage: t.coverPhotoUrl || t.coverImage || null,
      coverPhotoUrl: t.coverPhotoUrl || t.coverImage || null,
      budgetLimit: t.totalBudget || t.budgetLimit || 0,
      totalBudget: t.totalBudget || t.budgetLimit || 0,
    };
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

  async updateSection(
    sectionId: string,
    data: UpdateSectionDto
  ): Promise<ItinerarySection> {
    const res = await apiClient.put<ApiResponse<ItinerarySection>>(
      `/trips/sections/${sectionId}`,
      data
    );
    return res.data.data!;
  },

  async deleteSection(sectionId: string): Promise<void> {
    await apiClient.delete(`/trips/sections/${sectionId}`);
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

  async updateItem(
    itemId: string,
    data: UpdateItemDto
  ): Promise<ItineraryItem> {
    const payload: any = {
      ...data,
      costEstimate: data.costEstimate || data.cost,
      cost: data.cost || data.costEstimate,
    };
    const res = await apiClient.put<ApiResponse<ItineraryItem>>(
      `/trips/items/${itemId}`,
      payload
    );
    return res.data.data!;
  },

  async deleteItem(itemId: string): Promise<void> {
    await apiClient.delete(`/trips/items/${itemId}`);
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

  async copyTrip(sourceTrip: Trip): Promise<Trip> {
    // 1. Create base cloned trip
    const newTrip = await this.createTrip({
      title: `${sourceTrip.title} (Copy)`,
      description: sourceTrip.description || undefined,
      startDate: sourceTrip.startDate,
      endDate: sourceTrip.endDate,
      budgetLimit: sourceTrip.budgetLimit || undefined,
      coverImage: sourceTrip.coverImage || undefined,
      visibility: "PRIVATE",
    });

    // 2. Clone all stops and scheduled activities
    if (sourceTrip.sections && sourceTrip.sections.length > 0) {
      for (const sec of sourceTrip.sections) {
        const newSec = await this.addSection(newTrip.id, {
          title: sec.title || sec.destination?.name || "Travel Stop",
          destinationId: sec.destinationId || undefined,
          arrivalDate: sec.arrivalDate || undefined,
          departureDate: sec.departureDate || undefined,
        });

        if (sec.items && sec.items.length > 0) {
          for (const item of sec.items) {
            await this.addItem(newSec.id, {
              title: item.title,
              description: item.description || undefined,
              activityId: item.activityId || undefined,
              category: item.category || (item.activity?.category as any) || undefined,
              startTime: item.startTime || undefined,
              endTime: item.endTime || undefined,
              durationMinutes: item.durationMinutes || undefined,
              cost: item.cost || undefined,
            });
          }
        }
      }
    }

    return newTrip;
  },
};
