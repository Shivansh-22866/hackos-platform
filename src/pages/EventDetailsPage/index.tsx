import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEventStore } from '../../store/eventStore';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Countdown } from '../../components/ui/Countdown';
import { Card, CardBody } from '../../components/ui/Card';
import type { EventStatus, Track } from '../../types';

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, tracks, fetchEventById, fetchTracksByEventId } = useEventStore();
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    void fetchEventById(id);
    void fetchTracksByEventId(id);
  }, [id, fetchEventById, fetchTracksByEventId]);

  useEffect(() => {
    if (selectedEvent) setParticipantCount(selectedEvent.participant_count);
  }, [selectedEvent]);

  // Simulate live participant count increments
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipantCount((c) => c + Math.floor(Math.random() * 2));
    }, 8_000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    if (!id) return;
    if (currentUser?.role === 'participant') navigate(`/register/${id}`);
    else navigate(`/register/${id}`);
  };

  if (!selectedEvent) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-ink-muted animate-pulse">Loading event...</div>;
  }

  const eventTracks: Track[] = tracks[selectedEvent.id] ?? [];
  const isClosed = selectedEvent.status === 'closed';

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={selectedEvent.status as EventStatus} dot />
            <span className="text-xs font-mono text-ink-faint">
              {new Date(selectedEvent.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-ink font-mono mb-2">{selectedEvent.title}</h1>
          <p className="text-lg text-ink-muted mb-4">{selectedEvent.tagline}</p>
          <div className="flex flex-wrap gap-4 text-sm font-mono text-ink-muted">
            <span>Team: {selectedEvent.team_min_size}–{selectedEvent.team_max_size} members</span>
            <span className="text-surface-border">|</span>
            <span className="text-brand-cyan">{participantCount.toLocaleString()} registered</span>
          </div>
        </div>

        {/* Sticky CTA card */}
        <Card className="lg:w-72 h-fit" glow>
          <CardBody>
            {!isClosed ? (
              <>
                <Countdown targetDate={selectedEvent.end_date} label="Closes in" size="sm" />
                <Button className="w-full mt-5" onClick={handleCTA}>
                  {currentUser?.role === 'participant' ? 'Register Now' : 'View Registration'}
                </Button>
                <p className="text-xs text-ink-faint font-mono mt-2 text-center">Free to participate</p>
              </>
            ) : (
              <>
                <p className="font-mono text-sm text-red-400 font-semibold mb-2">Submissions Closed</p>
                <p className="text-xs text-ink-muted">This event has ended. Results were announced on {new Date(selectedEvent.results_date).toLocaleDateString()}.</p>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-ink font-mono mb-4"><span className="text-brand-purple">./</span>about</h2>
            <p className="text-ink-muted leading-relaxed">{selectedEvent.description}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink font-mono mb-4"><span className="text-brand-purple">./</span>tracks</h2>
            <div className="flex gap-2 mb-4 flex-wrap">
              {eventTracks.map((t, i) => (
                <button key={t.id} onClick={() => setActiveTrack(i)} className={`px-4 py-1.5 rounded-lg text-xs font-mono border transition-all ${i === activeTrack ? 'border-brand-purple text-brand-purple bg-brand-purple/10' : 'border-surface-border text-ink-muted'}`}>{t.name}</button>
              ))}
            </div>
            {eventTracks[activeTrack] && (
              <Card>
                <CardBody>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-ink font-mono">{eventTracks[activeTrack].name}</h3>
                    <span className="text-amber-400 font-mono font-bold text-sm">${eventTracks[activeTrack].prize_first.toLocaleString()} top prize</span>
                  </div>
                  <p className="text-sm text-ink-muted mb-4">{eventTracks[activeTrack].description}</p>
                  <div className="border-t border-surface-border pt-4">
                    <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-2">Problem Statement</p>
                    <p className="text-sm text-ink-muted leading-relaxed">{eventTracks[activeTrack].problem_statement}</p>
                  </div>
                </CardBody>
              </Card>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink font-mono mb-4"><span className="text-brand-purple">./</span>rules</h2>
            <ul className="space-y-2">
              {selectedEvent.rules.split('\n').map((rule, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink-muted font-mono">
                  <span className="text-brand-purple shrink-0">›</span>{rule}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardBody>
              <h3 className="text-sm font-bold text-ink font-mono mb-4">Resources</h3>
              {selectedEvent.resources.length === 0 ? (
                <p className="text-xs text-ink-faint font-mono">Resources will appear here once the event starts.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedEvent.resources.map((r) => (
                    <li key={r.label}>
                      <a href={r.url} className="text-sm font-mono text-brand-cyan hover:underline flex items-center gap-2">
                        <span className="text-ink-faint">↗</span>{r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="text-sm font-bold text-ink font-mono mb-3">Eligibility</h3>
              <p className="text-xs text-ink-muted font-mono leading-relaxed">{selectedEvent.eligibility_criteria}</p>
            </CardBody>
          </Card>
          <div className="text-center">
            <Link to="/events" className="text-xs font-mono text-ink-faint hover:text-ink transition-colors">← Back to all events</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
