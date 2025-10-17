// Main API instance
export { default as api } from './api';

// API Endpoints
export * from './endpoints';

// Authentication API
export { authApi } from './api';
export type { LoginResponse, ApiError } from './api';

// Counter/Customer API
export { counterApi } from './counterApi';
export type { 
  Counter, 
  CounterSearchParams, 
  CounterResponse, 
  CreateCounterData, 
  UpdateCounterData 
} from './counterApi';

// Visit API
export { visitApi } from './visitApi';
export type { 
  Visit, 
  CreateVisitData, 
  UpdateVisitData, 
  VisitSearchParams, 
  VisitResponse, 
  VisitStats 
} from './visitApi';

// Utility functions
export { buildUrl, buildUrlWithParams } from './endpoints';