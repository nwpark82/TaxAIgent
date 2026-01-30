import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, userApi } from '@/lib/api';

interface User {
  id: number;
  email: string | null;
  name: string | null;
  provider: string;
  business_type?: string;
  business_category?: string;
}

interface Subscription {
  plan_code: string;
  plan_name: string;
  status: string;
}

interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  kakaoLogin: (accessToken: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      subscription: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          const { access_token, refresh_token, user } = response.data;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch full user data with subscription
          await get().fetchUser();
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.detail || '로그인에 실패했습니다',
          });
          throw error;
        }
      },

      signup: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.signup({ email, password, name });
          const { access_token, refresh_token, user } = response.data;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch full user data with subscription
          await get().fetchUser();
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.detail || '회원가입에 실패했습니다',
          });
          throw error;
        }
      },

      kakaoLogin: async (accessToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.kakaoLogin(accessToken);
          const { access_token, refresh_token, user } = response.data;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch full user data with subscription
          await get().fetchUser();
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.detail || '카카오 로그인에 실패했습니다',
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          subscription: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchUser: async () => {
        try {
          const response = await userApi.getMe();
          const { subscription, ...user } = response.data;

          set({
            user,
            subscription,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token might be invalid
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        subscription: state.subscription,
      }),
    }
  )
);
