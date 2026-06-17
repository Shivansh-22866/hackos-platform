import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { useNotificationStore } from '../../store/notificationStore';
import type { Announcement, TargetType } from '../../types';

const TARGET_OPTS: { label: string; value: TargetType }[] = [
  { label: 'Everyone (broadcast)', value: 'broadcast' },
  { label: 'Specific role', value: 'role' },
  { label: 'Specific team', value: 'team' },
];

export function AnnouncementForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetType, setTargetType] = useState<TargetType>('broadcast');
  const [targetId, setTargetId] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const { addAnnouncement } = useNotificationStore();

  const validate = () => {
    const e: { title?: string; body?: string } = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!body.trim()) e.body = 'Message body is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: 'event-1', created_by: 'user-4', title, body, target_type: targetType, target_id: targetId || undefined }),
      });
      const newAnn = (await res.json()) as Announcement;
      addAnnouncement(newAnn);
      setTitle(''); setBody(''); setTargetId('');
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally { setSending(false); }
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-6 space-y-5 max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-ink font-mono mb-1">Broadcast announcement</h3>
        <p className="text-xs text-ink-faint font-mono">Messages are pushed to participants in real time via SSE.</p>
      </div>

      {/* Target */}
      <div>
        <label className="block text-xs font-mono font-semibold text-ink-muted mb-2">Audience</label>
        <div className="flex gap-2 flex-wrap">
          {TARGET_OPTS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setTargetType(opt.value); setTargetId(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${targetType === opt.value ? 'border-brand-purple text-brand-purple bg-brand-purple/10' : 'border-surface-border text-ink-muted hover:border-ink-faint'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {targetType !== 'broadcast' && (
          <div className="mt-3">
            <Input
              placeholder={targetType === 'team' ? 'team-1, team-2…' : 'participant, judge, organizer'}
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              hint={targetType === 'role' ? 'Enter role name' : 'Enter team ID'}
            />
          </div>
        )}
      </div>

      <Input label="Title *" placeholder="Important: deadline approaching" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
      <Textarea label="Message *" placeholder="Write your announcement here…" value={body} onChange={(e) => setBody(e.target.value)} error={errors.body} rows={4} />

      <div className="flex items-center gap-3">
        <Button onClick={() => void handleSend()} loading={sending} size="sm">
          {sent ? '✓ Sent!' : '→ Broadcast now'}
        </Button>
        {sent && <span className="text-xs font-mono text-emerald-400">Pushed to participants</span>}
      </div>
    </div>
  );
}
