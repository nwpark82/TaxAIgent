import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  kakaoLogin: (accessToken: string) =>
    api.post('/auth/kakao', { access_token: accessToken }),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
};

// User API
export const userApi = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/users/me', data),
  updateBusiness: (data: {
    business_type?: string;
    business_category?: string;
    business_number?: string;
    annual_revenue?: number;
  }) => api.put('/users/me/business', data),
  getDashboard: () => api.get('/users/me/dashboard'),
  getUsage: () => api.get('/users/me/usage'),
};

// Chat API
export const chatApi = {
  ask: (data: { question: string; session_id?: string }) =>
    api.post('/chat/ask', data),
  getHistory: (params?: { page?: number; size?: number; session_id?: string }) =>
    api.get('/chat/history', { params }),
  addFeedback: (data: { chat_id: number; feedback: 'good' | 'bad' }) =>
    api.post('/chat/feedback', data),
};

// Expense API
export const expenseApi = {
  create: (data: {
    date: string;
    description: string;
    amount: number;
    vat_amount?: number;
    category_id?: number;
    payment_method?: string;
    evidence_type?: string;
    vendor?: string;
    memo?: string;
  }) => api.post('/expenses', data),

  getList: (params?: {
    page?: number;
    size?: number;
    start_date?: string;
    end_date?: string;
    category_id?: number;
    is_deductible?: boolean;
  }) => api.get('/expenses', { params }),

  getById: (id: number) => api.get(`/expenses/${id}`),

  update: (id: number, data: Partial<{
    date: string;
    description: string;
    amount: number;
    category_id: number;
    is_deductible: boolean;
    is_confirmed: boolean;
  }>) => api.put(`/expenses/${id}`, data),

  delete: (id: number) => api.delete(`/expenses/${id}`),

  classify: (id: number) => api.post(`/expenses/${id}/classify`),

  classifyPreview: (data: { description: string; amount?: number; vendor?: string }) =>
    api.post('/expenses/classify', data),
};

// Ledger API
export const ledgerApi = {
  getLedger: (params: { year: number; month?: number }) =>
    api.get('/ledger', { params }),

  exportLedger: (params: { year: number; month?: number; format?: 'excel' | 'csv' }) =>
    api.get('/ledger/export', { params, responseType: 'blob' }),

  getDashboard: () => api.get('/dashboard'),

  getCategories: () => api.get('/categories'),
};

export default api;
