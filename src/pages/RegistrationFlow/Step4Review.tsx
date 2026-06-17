import { useEffect, useState } from 'react';
import { useRegistrationStore } from '../../store/registrationStore';
import { Button } from '../../components/ui/Button';
import type { Track } from '../../types';

export function Step4Review() {
  const { personalInfo, teamChoice, selectedTrackId, setStep, submit, submitting, eventId } = useRegistrationStore();
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/events/${eventId}/tracks`);
      const tracks = (await res.json()) as Track[];
      setTrack(tracks.find((t) => t.id === selectedTrackId) ?? null);
    };
    void load();
  }, [eventId, selectedTrackId]);

  const handleSubmit = async () => {
    try { await submit(); }
    catch { /* error handled in store */ }
  };

  const rows: { label: string; value: string; step: 1 | 2 | 3 }[] = [
    { label: 'Name', value: personalInfo.name, step: 1 },
    { label: 'Email', value: personalInfo.email, step: 1 },
    { label: 'Institution', value: personalInfo.college_or_org, step: 1 },
    { label: 'Team', value: teamChoice.action === 'create' ? `Create: ${teamChoice.teamName ?? ''}` : `Join via: ${teamChoice.inviteCode ?? ''}`, step: 2 },
    { label: 'Track', value: track?.name ?? '—', step: 3 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink font-mono">Review & submit</h2>
        <p className="text-sm text-ink-muted mt-1">Confirm your details before registering.</p>
      </div>
      <div className="rounded-xl border border-surface-border overflow-hidden">
        {rows.map(({ label, value, step }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3 border-b border-surface-border last:border-b-0 hover:bg-surface-overlay/50">
            <span className="text-xs font-mono text-ink-muted w-24 shrink-0">{label}</span>
            <span className="text-sm font-mono text-ink flex-1 mx-4">{value || <span className="text-ink-faint italic">—</span>}</span>
            <button onClick={() => setStep(step)} className="text-xs font-mono text-brand-purple hover:underline shrink-0">Edit</button>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-muted font-mono border border-surface-border rounded-lg px-4 py-3 bg-surface-raised/50">
        By registering you agree to the hackathon rules and code of conduct.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(3)} className="flex-1" disabled={submitting}>← Back</Button>
        <Button onClick={() => void handleSubmit()} loading={submitting} className="flex-1">Confirm Registration</Button>
      </div>
    </div>
  );
}
