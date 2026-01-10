export type UserRole = 'traveler' | 'admin_hr';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  department?: string;
  job_title?: string;
  employee_id?: string;
  timezone?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user_id: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  department?: string;
  job_title?: string;
  employee_id?: string;
  timezone?: string;
}

export interface TravelerProfile {
  id: string;
  user: string;
  passport_number: string;
  passport_issuing_country: string;
  passport_expiry_date: string;
  health_conditions?: string;
  frequent_traveler: boolean;
}

export interface Trip {
  id: string;
  traveler: string;
  destination: string;
  origin: string;
  departure_date: string;
  return_date: string;
  purpose?: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface RiskAnalysis {
  overall_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  political_risk: string;
  war_risk: string;
  health_risk: string;
  safety_notes: string;
  key_factors: string[];
  recommendations: string[];
  analyzed_at: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
