import { create } from 'zustand';
import type { Announcement } from '../types';

interface NotificationState {
  announcements: Announcement[];
  unreadCount: number;
  setAnnouncements: (items: Announcement[]) => void;
  addAnnouncement: (item: Announcement) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  announcements: [],
  unreadCount: 0,
  setAnnouncements: (announcements) => set({ announcements, unreadCount: announcements.length }),
  addAnnouncement: (item) =>
    set((state) => ({
      announcements: [item, ...state.announcements],
      unreadCount: state.unreadCount + 1,
    })),
  markAllRead: () => set({ unreadCount: 0 }),
}));
