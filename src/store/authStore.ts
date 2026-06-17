import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthState {
  currentUser: User | null;
  setUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: MOCK_USERS[0],
  setUser: (user) => set({ currentUser: user }),
  switchRole: (role) => {
    const user = MOCK_USERS.find((u) => u.role === role) ?? null;
    set({ currentUser: user });
  },
  logout: () => set({ currentUser: null }),
}));
