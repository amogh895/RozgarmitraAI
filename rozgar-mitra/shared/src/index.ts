// ─── Shared domain types ─────────────────────────────────────────────────────
// Used by both frontend and backend. Keep this file pure TypeScript – no runtime
// dependencies – so it can be imported from both environments.

// ── Roles & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'worker' | 'employer' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  full_name: string;
  preferred_language: 'en' | 'hi';
  created_at: string;
}

export interface TokenPayload {
  sub: number;        // user id
  role: UserRole;
  email: string;
  iat: number;
  exp: number;
}

// ── Worker Profile ────────────────────────────────────────────────────────────

export type EducationLevel =
  | 'none'
  | 'primary'
  | 'secondary'
  | 'higher_secondary'
  | 'graduate'
  | 'vocational';

export type WageUnit = 'hourly' | 'daily' | 'monthly';

export interface WorkerProfile {
  id: number;
  user_id: number;
  full_name: string;
  preferred_language: 'en' | 'hi';
  district?: string;
  state?: string;
  skills: string[];          // JSON array stored as text
  work_categories: string[]; // JSON array
  experience_years: number;
  expected_wage: number;
  wage_unit: WageUnit;
  availability: string;      // e.g. 'weekdays', 'immediate', 'flexible'
  education_level: EducationLevel;
  training_interests: string[];
  created_at: string;
  updated_at: string;
}

// ── Employer Profile ──────────────────────────────────────────────────────────

export interface EmployerProfile {
  id: number;
  user_id: number;
  company_name: string;
  industry: string;
  district?: string;
  state?: string;
  contact_phone?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export type JobStatus = 'draft' | 'pending' | 'active' | 'closed' | 'rejected';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'daily_wage' | 'gig';

export interface Job {
  id: number;
  employer_id: number;
  employer_name: string;
  title: string;
  category: string;
  location_district: string;
  location_state: string;
  wage_min: number;
  wage_max: number;
  wage_unit: WageUnit;
  employment_type: EmploymentType;
  required_skills: string[];
  description: string;
  application_method: string;
  posted_date: string;
  expiry_date: string;
  status: JobStatus;
  is_demo: boolean;
}

export interface JobMatchScore {
  job_id: number;
  score: number;           // 0–100
  matched_skills: string[];
  missing_skills: string[];
  location_match: boolean;
  wage_match: boolean;
  category_match: boolean;
  explanation: string;
}

// ── Applications ──────────────────────────────────────────────────────────────

export type ApplicationStatus = 'applied' | 'viewed' | 'shortlisted' | 'rejected' | 'hired';

export interface JobApplication {
  id: number;
  job_id: number;
  worker_id: number;
  status: ApplicationStatus;
  cover_note?: string;
  applied_at: string;
  updated_at: string;
}

// ── Government Schemes ────────────────────────────────────────────────────────

export type SchemeStatus = 'unverified' | 'verified' | 'discontinued';

export interface GovernmentScheme {
  id: number;
  name: string;
  issuing_authority: string;
  summary: string;
  eligibility_conditions: string;
  documents_required: string;
  benefits: string;
  geographic_coverage: string;
  official_url: string;
  last_verified_date: string;
  status: SchemeStatus;
}

// ── Training Courses ──────────────────────────────────────────────────────────

export type CourseMode = 'online' | 'offline' | 'hybrid';
export type CourseStatus = 'unverified' | 'verified' | 'discontinued';

export interface TrainingCourse {
  id: number;
  provider: string;
  title: string;
  category: string;
  duration_hours: number;
  mode: CourseMode;
  eligibility: string;
  cost_inr: number;
  location?: string;
  official_url: string;
  skills_taught: string[];
  status: CourseStatus;
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: number;
  session_id: number;
  role: MessageRole;
  content: string;
  sources?: string[];      // source attribution for RAG responses
  created_at: string;
}

export interface ChatSession {
  id: number;
  worker_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

// ── API Helpers ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccess<T = void> {
  success: true;
  data?: T;
  message?: string;
}
