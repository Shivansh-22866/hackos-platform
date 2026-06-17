import { create } from 'zustand';
import type { LeaderboardEntry } from '../types';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  isPublished: boolean;
  lastUpdated: Date | null;
  setEntries: (entries: LeaderboardEntry[]) => void;
  updateEntry: (entry: LeaderboardEntry) => void;
  setPublished: (published: boolean) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  isPublished: true,
  lastUpdated: null,
  setEntries: (entries) => set({ entries, lastUpdated: new Date() }),
  updateEntry: (entry) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.team_id === entry.team_id ? entry : e)),
      lastUpdated: new Date(),
    })),
  setPublished: (isPublished) => set({ isPublished }),
}));
