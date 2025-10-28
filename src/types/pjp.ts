// Shared types for PJP components

export interface Counter {
  id: number;
  name: string;
  code: string;
  counterID?: string;
  counterName?: string;
  visitDate?: string;
  remarks?: string;
}

export interface PJPItem {
  id: number;
  counterID: string;
  counterName: string;
  visitDate: string;
  remarks: string;
  visitTime?: string;
}

export interface PJPDetails {
  name: string;
  code: string;
  status: string;
  visitCount: number;
  address: string;
  contactPerson: string;
  phone: string;
  lastVisit: string;
  visitTime: string;
  category: string;
  territory: string;
  region: string;
  notes: string;
}
