import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2).max(100),
  role: z.enum(['worker', 'employer']),
  preferred_language: z.enum(['en', 'hi']).default('en'),
  // Employer-only
  company_name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const workerProfileSchema = z.object({
  district: z.string().optional(),
  state: z.string().optional(),
  skills: z.array(z.string()).default([]),
  work_categories: z.array(z.string()).default([]),
  experience_years: z.number().int().min(0).max(60).default(0),
  expected_wage: z.number().min(0).default(0),
  wage_unit: z.enum(['hourly', 'daily', 'monthly']).default('daily'),
  availability: z.string().default('flexible'),
  education_level: z.enum(['none','primary','secondary','higher_secondary','graduate','vocational']).default('none'),
  training_interests: z.array(z.string()).default([]),
});

export const jobCreateSchema = z.object({
  title: z.string().min(3).max(200),
  category: z.string().min(2).max(100),
  location_district: z.string().min(2),
  location_state: z.string().min(2),
  wage_min: z.number().min(0),
  wage_max: z.number().min(0),
  wage_unit: z.enum(['hourly', 'daily', 'monthly']),
  employment_type: z.enum(['full_time','part_time','contract','daily_wage','gig']),
  required_skills: z.array(z.string()).default([]),
  description: z.string().max(5000).default(''),
  application_method: z.string().default('apply_online'),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const jobSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  employment_type: z.string().optional(),
  wage_unit: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(50).default(12),
});

export const applicationCreateSchema = z.object({
  cover_note: z.string().max(1000).optional(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  session_id: z.number().int().optional(),
  language: z.enum(['en', 'hi']).default('en'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});
