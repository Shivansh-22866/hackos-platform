import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useEventStore } from '../../store/eventStore';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { EventStatus } from '../../types';

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Closed', value: 'closed' },
];

export function EventListingPage() {
  const { events, loading, fetchEvents } = useEventStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const load = useCallback(() => {
    void fetchEvents({ status: status === 'all' ? undefined : status, search: search || undefined });
  }, [fetchEvents, status, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink font-mono"><span className="text-brand-purple">./</span>events</h1>
        <p className="text-ink-muted text-sm mt-1 font-mono">Discover and register for hackathons.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-4 py-2 rounded-lg text-xs font-mono border transition-all ${status === opt.value ? 'border-brand-purple text-brand-purple bg-brand-purple/10' : 'border-surface-border text-ink-muted hover:border-ink-faint'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={load}>Search</Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 rounded-xl bg-surface-raised animate-pulse" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 font-mono text-ink-faint">No events found. Try a different filter.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="group">
              <div className="h-full rounded-xl border border-surface-border bg-surface-raised hover:border-brand-purple/50 hover:shadow-lg hover:shadow-brand-purple/10 transition-all p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold text-ink font-mono group-hover:text-brand-purple transition-colors">{event.title}</h2>
                  <Badge variant={event.status as EventStatus} dot />
                </div>
                <p className="text-sm text-ink-muted line-clamp-3 flex-1">{event.description}</p>
                <div className="pt-4 border-t border-surface-border space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-ink-faint">Participants</span>
                    <span className="text-brand-cyan">{event.participant_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-ink-faint">Deadline</span>
                    <span className="text-ink-muted">
                      {new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-ink-faint">Team size</span>
                    <span className="text-ink-muted">{event.team_min_size}–{event.team_max_size} members</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-brand-purple group-hover:underline">View details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
