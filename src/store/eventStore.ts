import { create } from 'zustand';
import type { Event, Track } from '../types';

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  tracks: Record<string, Track[]>;
  loading: boolean;
  error: string | null;
  fetchEvents: (params?: { status?: string; search?: string }) => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  fetchTracksByEventId: (id: string) => Promise<void>;
  setSelectedEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  selectedEvent: null,
  tracks: {},
  loading: false,
  error: null,

  fetchEvents: async (params) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const res = await fetch(`/api/events?${query.toString()}`);
      const data = (await res.json()) as Event[];
      set({ events: data, loading: false });
    } catch {
      set({ error: 'Failed to load events', loading: false });
    }
  },

  fetchEventById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/events/${id}`);
      const data = (await res.json()) as Event;
      set({ selectedEvent: data, loading: false });
    } catch {
      set({ error: 'Failed to load event', loading: false });
    }
  },

  fetchTracksByEventId: async (id) => {
    try {
      const res = await fetch(`/api/events/${id}/tracks`);
      const data = (await res.json()) as Track[];
      set({ tracks: { ...get().tracks, [id]: data } });
    } catch {
      set({ error: 'Failed to load tracks' });
    }
  },

  setSelectedEvent: (event) => set({ selectedEvent: event }),
}));
