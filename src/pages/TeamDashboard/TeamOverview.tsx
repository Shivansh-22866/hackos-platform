import { useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import type { Team, User, Track } from '../../types';

interface TeamOverviewProps {
  team: Team;
  members: User[];
  track: Track | undefined;
}

export function TeamOverview({ team, members, track }: TeamOverviewProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(team.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card glow>
        <CardBody>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-1">Your Team</p>
              <h2 className="text-xl font-bold text-ink font-mono">{team.summary || 'Team Alpha'}</h2>
            </div>
            {track && <Badge variant="purple">{track.name}</Badge>}
          </div>

          {/* Members */}
          <div className="space-y-2 mb-5">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-2 border-t border-surface-border first:border-t-0">
                <div className="w-7 h-7 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-xs font-mono text-brand-purple font-bold">
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink font-mono truncate">
                    {m.name}
                    {m.id === team.leader_id && (
                      <span className="ml-2 text-[10px] text-amber-400 border border-amber-400/30 px-1.5 py-0.5 rounded font-mono">Leader</span>
                    )}
                  </p>
                  <p className="text-xs text-ink-faint truncate">{m.college_or_org}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Invite */}
          <div className="rounded-lg border border-dashed border-surface-border bg-surface p-3">
            <p className="text-xs font-mono text-ink-faint mb-2">Invite teammates</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-brand-cyan select-all blur-sm hover:blur-none transition-all cursor-pointer" onClick={() => setShowCode(true)}>
                {team.invite_code}
              </code>
              <button
                onClick={() => void handleCopy()}
                className="text-xs font-mono text-ink-muted border border-surface-border rounded px-2 py-1 hover:text-ink hover:border-brand-purple transition-all"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={showCode} onClose={() => setShowCode(false)} title="Invite Code">
        <p className="text-sm text-ink-muted mb-4">Share this code with teammates so they can join during registration.</p>
        <div className="bg-surface rounded-xl p-6 text-center">
          <code className="text-3xl font-mono font-bold text-brand-cyan tracking-wider">{team.invite_code}</code>
        </div>
        <button onClick={() => void handleCopy()} className="mt-4 w-full py-2 rounded-lg border border-surface-border font-mono text-sm text-ink-muted hover:text-ink hover:border-brand-purple transition-all">
          {copied ? '✓ Copied to clipboard' : 'Copy to clipboard'}
        </button>
      </Modal>
    </>
  );
}
