import { type AxiosResponse } from 'axios';
import { VISIT_ENDPOINTS } from './endpoints';
import api from './api';

// Visit related interfaces
export interface Visit {
  id: string;
  userId: string;
  counterId: string;
  counterName: string;
  counterCode: string;
  purpose: 'Site Service' | 'New Site' | 'Site Conversion';
  remarks: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  status: 'ongoing' | 'completed' | 'cancelled';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitData {
  counterId: string;
  purpose: 'Site Service' | 'New Site' | 'Site Conversion';
  remarks: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface UpdateVisitData {
  purpose?: 'Site Service' | 'New Site' | 'Site Conversion';
  remarks?: string;
  images?: string[];
}

export interface VisitSearchParams {
  userId?: string;
  counterId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  purpose?: string;
  page?: number;
  limit?: number;
}

export interface VisitResponse {
  visits: Visit[];
  total: number;
  page: number;
  totalPages: number;
}

export interface VisitStats {
  totalVisits: number;
  completedVisits: number;
  ongoingVisits: number;
  averageDuration: number;
  visitsByPurpose: Record<string, number>;
}

// Visit API service
export const visitApi = {
  // Get all visits
  getAll: async (params?: VisitSearchParams): Promise<VisitResponse> => {
    try {
      const response: AxiosResponse<VisitResponse> = await api.get(VISIT_ENDPOINTS.GET_ALL, {
        params,
      });
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to fetch visits',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Get visit by ID
  getById: async (id: string): Promise<Visit> => {
    try {
      const response: AxiosResponse<{ visit: Visit }> = await api.get(
        VISIT_ENDPOINTS.GET_BY_ID(id)
      );
      return response.data.visit;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to fetch visit',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Start a new visit
  startVisit: async (visitData: CreateVisitData): Promise<Visit> => {
    try {
      const response: AxiosResponse<{ visit: Visit }> = await api.post(
        VISIT_ENDPOINTS.START_VISIT,
        visitData
      );
      return response.data.visit;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to start visit',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Update visit
  update: async (id: string, visitData: UpdateVisitData): Promise<Visit> => {
    try {
      const response: AxiosResponse<{ visit: Visit }> = await api.put(
        VISIT_ENDPOINTS.UPDATE(id),
        visitData
      );
      return response.data.visit;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to update visit',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // End a visit
  endVisit: async (id: string, finalRemarks?: string): Promise<Visit> => {
    try {
      const response: AxiosResponse<{ visit: Visit }> = await api.put(
        VISIT_ENDPOINTS.END_VISIT(id),
        {
          finalRemarks,
        }
      );
      return response.data.visit;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to end visit',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Get current ongoing visits
  getCurrentVisits: async (): Promise<Visit[]> => {
    try {
      const response: AxiosResponse<{ visits: Visit[] }> = await api.get(
        VISIT_ENDPOINTS.GET_CURRENT_VISITS
      );
      return response.data.visits;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to fetch current visits',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Get visits by date
  getByDate: async (date: string): Promise<Visit[]> => {
    try {
      const response: AxiosResponse<{ visits: Visit[] }> = await api.get(
        VISIT_ENDPOINTS.GET_VISITS_BY_DATE(date)
      );
      return response.data.visits;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to fetch visits by date',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Get visits by user
  getByUser: async (userId: string): Promise<Visit[]> => {
    try {
      const response: AxiosResponse<{ visits: Visit[] }> = await api.get(
        VISIT_ENDPOINTS.GET_VISITS_BY_USER(userId)
      );
      return response.data.visits;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to fetch visits by user',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Get visits by counter
  getByCounter: async (counterId: string): Promise<Visit[]> => {
    try {
      const response: AxiosResponse<{ visits: Visit[] }> = await api.get(
        VISIT_ENDPOINTS.GET_VISITS_BY_COUNTER(counterId)
      );
      return response.data.visits;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to fetch visits by counter',
        status: apiError?.response?.status || 500,
      };
    }
  },

  // Delete visit
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(VISIT_ENDPOINTS.DELETE(id));
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Failed to delete visit',
        status: apiError?.response?.status || 500,
      };
    }
  },
};

export default visitApi;
