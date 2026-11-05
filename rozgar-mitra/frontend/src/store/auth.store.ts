import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@shared/index';
import i18n from '@/i18n';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        i18n.changeLanguage(user.preferred_language);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set((state) => ({
          user: state.user ? { ...state.user, preferred_language: lang } : null,
        }));
      },
    }),
    { name: 'km-auth' }
  )
);
