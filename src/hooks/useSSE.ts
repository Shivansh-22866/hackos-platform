import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import type { Announcement } from '../types';

const SIMULATED_ALERTS: Omit<Announcement, 'id' | 'created_at'>[] = [
  { event_id: 'event-1', created_by: 'user-4', title: 'Pro tip: test on mobile', body: 'Judges will be evaluating your demo on both desktop and mobile. Make sure it is responsive!', target_type: 'broadcast' },
  { event_id: 'event-1', created_by: 'user-4', title: 'API rate limits reminder', body: 'The OpenAI API sandbox has a 60 req/min limit. Plan your calls accordingly.', target_type: 'broadcast' },
];

/** Simulates an SSE connection by pushing announcements every ~30s */
export function useSSE(eventId: string | undefined): void {
  const { addAnnouncement } = useNotificationStore();
  const indexRef = useRef(0);

  useEffect(() => {
    if (!eventId) return;

    const interval = setInterval(() => {
      const template = SIMULATED_ALERTS[indexRef.current % SIMULATED_ALERTS.length];
      const announcement: Announcement = {
        ...template,
        id: `sse-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      addAnnouncement(announcement);
      indexRef.current += 1;
    }, 30_000);

    return () => clearInterval(interval);
  }, [eventId, addAnnouncement]);
}
