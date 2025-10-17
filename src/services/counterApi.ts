import { type AxiosResponse } from 'axios';
import { COUNTER_ENDPOINTS } from './endpoints';
import api from './api';

// Counter/Customer related interfaces
export interface Counter {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  territoryId: string;
  type: 'retailer' | 'distributor' | 'dealer';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CounterSearchParams {
  search?: string;
  territoryId?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CounterResponse {
  counters: Counter[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateCounterData {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  territoryId: string;
  type: 'retailer' | 'distributor' | 'dealer';
}

export interface UpdateCounterData extends Partial<CreateCounterData> {
  status?: 'active' | 'inactive';
}

// Counter API service
export const counterApi = {
  // Get all counters
  getAll: async (params?: CounterSearchParams): Promise<CounterResponse> => {
    try {
      const response: AxiosResponse<CounterResponse> = await api.get(COUNTER_ENDPOINTS.GET_ALL, { params });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to fetch counters',
        status: error.response?.status || 500,
      };
    }
  },

  // Get counter by ID
  getById: async (id: string): Promise<Counter> => {
    try {
      const response: AxiosResponse<{ counter: Counter }> = await api.get(COUNTER_ENDPOINTS.GET_BY_ID(id));
      return response.data.counter;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to fetch counter',
        status: error.response?.status || 500,
      };
    }
  },

  // Create new counter
  create: async (counterData: CreateCounterData): Promise<Counter> => {
    try {
      const response: AxiosResponse<{ counter: Counter }> = await api.post(COUNTER_ENDPOINTS.CREATE, counterData);
      return response.data.counter;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to create counter',
        status: error.response?.status || 500,
      };
    }
  },

  // Update counter
  update: async (id: string, counterData: UpdateCounterData): Promise<Counter> => {
    try {
      const response: AxiosResponse<{ counter: Counter }> = await api.put(COUNTER_ENDPOINTS.UPDATE(id), counterData);
      return response.data.counter;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to update counter',
        status: error.response?.status || 500,
      };
    }
  },

  // Delete counter
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(COUNTER_ENDPOINTS.DELETE(id));
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to delete counter',
        status: error.response?.status || 500,
      };
    }
  },

  // Search counters
  search: async (searchQuery: string): Promise<Counter[]> => {
    try {
      const response: AxiosResponse<{ counters: Counter[] }> = await api.get(COUNTER_ENDPOINTS.SEARCH, {
        params: { q: searchQuery }
      });
      return response.data.counters;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to search counters',
        status: error.response?.status || 500,
      };
    }
  },

  // Get counters by territory
  getByTerritory: async (territoryId: string): Promise<Counter[]> => {
    try {
      const response: AxiosResponse<{ counters: Counter[] }> = await api.get(COUNTER_ENDPOINTS.GET_BY_TERRITORY(territoryId));
      return response.data.counters;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to fetch counters by territory',
        status: error.response?.status || 500,
      };
    }
  },
};

export default counterApi;