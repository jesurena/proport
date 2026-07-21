import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types/user';

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    is_head: boolean;
    is_adel: boolean;
    is_developer: boolean;
    setToken: (token: string | null) => void;
    setUser: (user: AuthUser | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            is_head: false,
            is_adel: false,
            is_developer: false,
            setToken: (token) => set({ token }),
            setUser: (user) => set({
                user,
                is_head: user?.is_head ?? false,
                is_adel: user?.is_adel ?? false,
                is_developer: user?.is_developer ?? false,
            }),
            logout: () => set({ token: null, user: null, is_head: false, is_adel: false, is_developer: false }),
        }),
        {
            name: 'proport-auth',
        }
    )
);
