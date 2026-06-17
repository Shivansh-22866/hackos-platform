import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card, CardBody } from '../../components/ui/Card';
import type { Judge, Track } from '../../types';

export function JudgeAssignment() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const load = async () => {
      const [judgesRes, tracksRes] = await Promise.all([
        fetch('/api/judges?eventId=event-1'),
        fetch('/api/events/event-1/tracks'),
      ]);
      setJudges((await judgesRes.json()) as Judge[]);
      setTracks((await tracksRes.json()) as Track[]);
    };
    void load();
  }, []);

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-ink font-mono mb-1">Judge–track assignments</h3>
        <p className="text-xs text-ink-faint font-mono">Manage which judges review which tracks.</p>
      </div>
      {judges.length === 0 ? (
        <p className="text-xs font-mono text-ink-faint">No judges assigned yet.</p>
      ) : (
        judges.map((judge) => (
          <Card key={judge.id}>
            <CardBody>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-mono font-bold text-ink">{judge.user?.name ?? judge.id}</p>
                  <p className="text-xs font-mono text-ink-faint">{judge.user?.email}</p>
                </div>
                <Badge variant={judge.is_active ? 'active' : 'closed'}>{judge.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div>
                <p className="text-[10px] font-mono text-ink-faint uppercase tracking-widest mb-2">Assigned tracks</p>
                <div className="flex flex-wrap gap-2">
                  {tracks.map((track) => {
                    const assigned = judge.assigned_tracks.includes(track.id);
                    return (
                      <span
                        key={track.id}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${assigned ? 'border-brand-cyan/50 bg-brand-cyan/10 text-brand-cyan' : 'border-surface-border text-ink-faint'}`}
                      >
                        {assigned ? '✓ ' : ''}{track.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
}
