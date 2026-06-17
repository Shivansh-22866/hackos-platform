import { useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { useNotificationStore } from '../../store/notificationStore';
import { useSSE } from '../../hooks/useSSE';

interface AnnouncementsFeedProps { eventId: string }

export function AnnouncementsFeed({ eventId }: AnnouncementsFeedProps) {
  const { announcements, unreadCount, setAnnouncements, markAllRead } = useNotificationStore();

  // Start SSE simulation
  useSSE(eventId);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/announcements?eventId=${eventId}`);
      const data = (await res.json()) as typeof announcements;
      setAnnouncements(data);
    };
    void load();
  }, [eventId, setAnnouncements]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) +
      ' · ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-ink font-mono">Announcements</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono bg-brand-purple text-white rounded-full px-1.5 py-0.5">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-mono text-ink-faint hover:text-ink transition-colors">
              Mark read
            </button>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {announcements.length === 0 ? (
          <p className="text-center py-8 text-xs text-ink-faint font-mono">No announcements yet.</p>
        ) : (
          <ul className="divide-y divide-surface-border max-h-80 overflow-y-auto">
            {announcements.map((ann) => (
              <li key={ann.id} className="px-6 py-4 hover:bg-surface-overlay/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <p className="text-sm font-semibold text-ink font-mono">{ann.title}</p>
                  <span className="text-[10px] font-mono text-ink-faint shrink-0 mt-0.5">{formatTime(ann.created_at)}</span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">{ann.body}</p>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
