import { useState } from 'react';
import { useRegistrationStore } from '../../store/registrationStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function Step2Team() {
  const { teamChoice, setTeamChoice, setStep } = useRegistrationStore();
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleNext = async () => {
    setError('');
    if (teamChoice.action === 'create') {
      if (!teamChoice.teamName?.trim()) { setError('Team name is required'); return; }
      setStep(3);
    } else {
      if (!teamChoice.inviteCode?.trim()) { setError('Invite code is required'); return; }
      setVerifying(true);
      try {
        const res = await fetch(`/api/teams/by-invite/${teamChoice.inviteCode}`);
        if (!res.ok) { setError('Invite code not found. Check the code and try again.'); return; }
        const team = (await res.json()) as { id: string };
        setTeamChoice({ teamId: team.id });
        setStep(3);
      } catch {
        setError('Could not verify invite code. Please try again.');
      } finally {
        setVerifying(false);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink font-mono">Team setup</h2>
        <p className="text-sm text-ink-muted mt-1">Create a new team or join an existing one via invite code.</p>
      </div>

      {/* Toggle */}
      <div className="flex rounded-xl overflow-hidden border border-surface-border">
        {(['create', 'join'] as const).map((action) => (
          <button
            key={action}
            onClick={() => { setTeamChoice({ action, teamName: '', inviteCode: '', teamId: '' }); setError(''); }}
            className={`flex-1 py-3 text-sm font-mono font-medium transition-all ${teamChoice.action === action ? 'bg-brand-purple text-white' : 'bg-surface-raised text-ink-muted hover:text-ink'}`}
          >
            {action === 'create' ? '+ Create team' : '↗ Join via code'}
          </button>
        ))}
      </div>

      {teamChoice.action === 'create' ? (
        <Input
          label="Team name"
          placeholder="Alpha Builders"
          value={teamChoice.teamName ?? ''}
          onChange={(e) => setTeamChoice({ teamName: e.target.value })}
          hint="Your teammates will use the invite code generated after registration"
          autoFocus
        />
      ) : (
        <Input
          label="Invite code"
          placeholder="HACK-ALPHA-42"
          value={teamChoice.inviteCode ?? ''}
          onChange={(e) => setTeamChoice({ inviteCode: e.target.value.toUpperCase() })}
          hint="Get this from your team leader"
          autoFocus
        />
      )}

      {error && <p className="text-sm text-red-400 font-mono">{error}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">← Back</Button>
        <Button onClick={() => void handleNext()} loading={verifying} className="flex-1">Continue →</Button>
      </div>
    </div>
  );
}
