import { create } from 'zustand';
import {
  getStoredAuth,
  clearStoredAuth,
  auth as authApi,
  type AuthUser,
  type UserProfile,
  type ApiClientError,
} from './api-client';

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Initialise from localStorage on mount
  init(): void;

  login(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<void>;
  logout(): void;
  setProfile(profile: UserProfile): void;
  clearError(): void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  isLoading: false,
  error: null,

  init() {
    const stored = getStoredAuth();
    if (stored && stored.expiresAt > Date.now() + 60_000) {
      set({ user: stored.user });
    } else {
      clearStoredAuth();
    }
  },

  async login(email, password) {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.login(email, password);
      set({ user: result.user, isLoading: false });
    } catch (err) {
      const msg = (err as ApiClientError).message ?? 'Login failed';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  async register(email, password) {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.register(email, password);
      set({ user: result.user, isLoading: false });
    } catch (err) {
      const msg = (err as ApiClientError).message ?? 'Registration failed';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  logout() {
    authApi.logout();
    set({ user: null, profile: null, error: null });
  },

  setProfile(profile) {
    set({ profile });
  },

  clearError() {
    set({ error: null });
  },
}));
