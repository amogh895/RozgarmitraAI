import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
  baseURL: '/api',
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Typed API helpers ─────────────────────────────────────────────────────────

export const authApi = {
  register: (data: object) => api.post('/auth/register', data),
  login: (data: object) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const usersApi = {
  getWorkerProfile: () => api.get('/users/me/worker-profile'),
  updateWorkerProfile: (data: object) => api.put('/users/me/worker-profile', data),
  getEmployerProfile: () => api.get('/users/me/employer-profile'),
  deleteAccount: () => api.delete('/users/me'),
};

export const jobsApi = {
  search: (params: object) => api.get('/jobs', { params }),
  getById: (id: number) => api.get(`/jobs/${id}`),
  getMatch: (id: number) => api.get(`/jobs/${id}/match`),
  apply: (id: number, data: object) => api.post(`/jobs/${id}/apply`, data),
  saveJob: (id: number) => api.post(`/jobs/${id}/save`),
  unsaveJob: (id: number) => api.delete(`/jobs/${id}/save`),
  getSaved: () => api.get('/jobs/me/saved'),
  getApplications: () => api.get('/jobs/me/applications'),
  getCategories: () => api.get('/jobs/categories'),
  // Employer
  getMyJobs: () => api.get('/jobs/employer/my-jobs'),
  createJob: (data: object) => api.post('/jobs/employer/create', data),
  updateJob: (id: number, data: object) => api.put(`/jobs/employer/${id}`, data),
  closeJob: (id: number) => api.post(`/jobs/employer/${id}/close`),
  getApplicants: (id: number) => api.get(`/jobs/employer/${id}/applicants`),
  updateAppStatus: (appId: number, status: string) => api.patch(`/jobs/applications/${appId}/status`, { status }),
};

export const chatApi = {
  status: () => api.get('/chat/status'),
  sendMessage: (data: object) => api.post('/chat/message', data),
  getSessions: () => api.get('/chat/sessions'),
  getSession: (id: number) => api.get(`/chat/sessions/${id}`),
};

export const schemesApi = {
  list: (params?: object) => api.get('/schemes', { params }),
  getById: (id: number) => api.get(`/schemes/${id}`),
  checkEligibility: (id: number) => api.post(`/schemes/${id}/check-eligibility`),
};

export const trainingApi = {
  list: (params?: object) => api.get('/training', { params }),
  getById: (id: number) => api.get(`/training/${id}`),
  enroll: (id: number) => api.post(`/training/${id}/enroll`),
  getProgress: () => api.get('/training/me/progress'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getPendingJobs: () => api.get('/admin/jobs/pending'),
  moderateJob: (id: number, status: string) => api.patch(`/jobs/admin/${id}/status`, { status }),
  getUsers: () => api.get('/admin/users'),
  setUserStatus: (id: number, is_active: boolean) => api.patch(`/admin/users/${id}/status`, { is_active }),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};
