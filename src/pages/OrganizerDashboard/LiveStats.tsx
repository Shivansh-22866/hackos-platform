import { useEffect, useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';

interface Stat { label: string; value: number; suffix?: string; color: string }

export function LiveStats() {
  const [stats, setStats] = useState({ registrations: 847, teams: 212, submissions: 67, judges: 1 });

  // Simulate live registration ticks
  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) => ({ ...s, registrations: s.registrations + Math.floor(Math.random() * 2) }));
    }, 7_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/events/event-1/registrations');
      const regs = (await res.json()) as unknown[];
      setStats((s) => ({ ...s, registrations: Math.max(s.registrations, regs.length) }));
    };
    void load();
  }, []);

  const items: Stat[] = [
    { label: 'Registrations', value: stats.registrations, color: 'text-brand-cyan' },
    { label: 'Teams formed', value: stats.teams, color: 'text-brand-purple' },
    { label: 'Submissions', value: stats.submissions, color: 'text-amber-400' },
    { label: 'Active judges', value: stats.judges, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ label, value, suffix, color }) => (
        <Card key={label}>
          <CardBody className="text-center py-6">
            <p className={`text-4xl font-bold font-mono tabular-nums ${color}`}>
              {value.toLocaleString()}{suffix}
            </p>
            <p className="text-xs font-mono text-ink-faint mt-2 uppercase tracking-widest">{label}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
