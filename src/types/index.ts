export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BusinessStatusModel {
  id?: number;
  idBusiness: number | string;
  active: boolean;
  businessImageUrl?: string | null;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}
