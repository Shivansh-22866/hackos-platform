import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { Registration, RegistrationStatus } from '../../types';

export function RegistrationTable() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/events/event-1/registrations');
        setRegs((await res.json()) as Registration[]);
      } finally { setLoading(false); }
    };
    void load();
  }, []);

  const filtered = regs.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.user?.name?.toLowerCase().includes(q) ||
      r.user?.email?.toLowerCase().includes(q) ||
      r.user?.college_or_org?.toLowerCase().includes(q) ||
      r.track?.name?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Institution', 'Track', 'Team', 'Status', 'Registered'];
    const rows = filtered.map((r) => [
      r.user?.name ?? '',
      r.user?.email ?? '',
      r.user?.college_or_org ?? '',
      r.track?.name ?? '',
      r.team_id ?? '—',
      r.status,
      new Date(r.registered_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hackos-registrations.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input placeholder="Search by name, email, institution, track…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>↓ Export CSV</Button>
      </div>

      <div className="rounded-xl border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-overlay/50">
              <tr>
                {['Name', 'Email', 'Institution', 'Track', 'Team ID', 'Status', 'Registered'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono font-semibold text-ink-faint uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                Array.from({ length: 4 }, (_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }, (__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 rounded bg-surface-overlay animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-ink-faint font-mono text-xs">No records match your search.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-overlay/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-ink text-xs whitespace-nowrap">{r.user?.name ?? '—'}</td>
                    <td className="px-4 py-3 font-mono text-ink-muted text-xs whitespace-nowrap">{r.user?.email ?? '—'}</td>
                    <td className="px-4 py-3 font-mono text-ink-muted text-xs whitespace-nowrap">{r.user?.college_or_org ?? '—'}</td>
                    <td className="px-4 py-3 font-mono text-ink-muted text-xs whitespace-nowrap">{r.track?.name ?? '—'}</td>
                    <td className="px-4 py-3 font-mono text-ink-faint text-xs">{r.team_id ?? '—'}</td>
                    <td className="px-4 py-3"><Badge variant={r.status as RegistrationStatus} dot /></td>
                    <td className="px-4 py-3 font-mono text-ink-faint text-xs whitespace-nowrap">
                      {new Date(r.registered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-2 border-t border-surface-border bg-surface-overlay/30">
            <p className="text-xs font-mono text-ink-faint">{filtered.length} of {regs.length} records</p>
          </div>
        )}
      </div>
    </div>
  );
}
