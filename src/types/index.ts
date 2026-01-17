export type UserRole = 'traveler' | 'admin';

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
  id: number;
  traveler: number;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  purpose: string;
  accommodation: string;
  transport_mode: string;
  created_at: string;
}

export interface RiskAnalysis {
  status: string;
  message: string;
  analysis: {
    status: string;
    trip_id: number;
    destination: string;
    travel_dates: {
      start: string;
      end: string;
      duration_days: number;
    };
    traveler: {
      id: number;
      health_conditions: string;
      frequent_traveler: boolean;
    };
    overall_risk_score: number;
    risk_level: 'Low' | 'Medium' | 'High';
    risk_score_breakdown: Record<string, number>;
    top_risks: string[];
    agent_reports: Record<string, {
      agent_name: string;
      status: string;
      risk_score: number;
      risk_level: string;
      [key: string]: unknown;
    }>;
    consolidated_recommendations: string[];
    executive_summary: string;
  };
  report_saved: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
