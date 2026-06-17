import { useEffect, useState } from 'react';
import { useRegistrationStore } from '../../store/registrationStore';
import { Button } from '../../components/ui/Button';
import type { Track } from '../../types';

export function Step3Track() {
  const { setStep, selectedTrackId, setSelectedTrackId, eventId } = useRegistrationStore();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/events/${eventId}/tracks`);
      setTracks((await res.json()) as Track[]);
    };
    void load();
  }, [eventId]);

  const handleNext = () => {
    if (!selectedTrackId) { setError('Please select a track to continue.'); return; }
    setStep(4);
  };

  const trackColors = ['border-brand-purple/60 bg-brand-purple/5', 'border-brand-cyan/60 bg-brand-cyan/5', 'border-amber-500/60 bg-amber-500/5'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink font-mono">Choose your track</h2>
        <p className="text-sm text-ink-muted mt-1">Select the challenge your team will compete in. You can only register for one.</p>
      </div>
      <div className="space-y-3">
        {tracks.map((track, i) => (
          <button
            key={track.id}
            onClick={() => { setSelectedTrackId(track.id); setError(''); }}
            className={`w-full text-left rounded-xl border p-4 transition-all ${selectedTrackId === track.id ? `${trackColors[i % trackColors.length]} border-opacity-100 ring-1 ring-brand-purple` : 'border-surface-border hover:border-ink-faint bg-surface-raised'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-ink font-mono">{track.name}</span>
              <span className="text-sm font-mono text-amber-400 font-semibold">${track.prize_first.toLocaleString()} top</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">{track.description}</p>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">← Back</Button>
        <Button onClick={handleNext} className="flex-1">Review →</Button>
      </div>
    </div>
  );
}
