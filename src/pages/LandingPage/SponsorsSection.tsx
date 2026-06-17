import type { Event } from '../../types';

const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];
const tierStyles: Record<string, string> = {
  platinum: 'text-slate-200 border-slate-400/40',
  gold: 'text-amber-300 border-amber-400/40',
  silver: 'text-slate-400 border-slate-500/40',
  bronze: 'text-amber-700 border-amber-700/40',
};

interface SponsorsSectionProps { sponsors: Event['sponsors'] }

export function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  if (sponsors.length === 0) return null;
  const byTier = tierOrder.reduce<Record<string, typeof sponsors>>((acc, tier) => {
    const group = sponsors.filter((s) => s.tier === tier);
    if (group.length > 0) acc[tier] = group;
    return acc;
  }, {});

  return (
    <section className="py-20 px-4 border-t border-surface-border">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-10">Backed by</p>
        {Object.entries(byTier).map(([tier, group]) => (
          <div key={tier} className="mb-8">
            <p className={`text-xs font-mono uppercase tracking-widest mb-4 ${tierStyles[tier]}`}>{tier}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {group.map((s) => (
                <div key={s.name} className={`px-6 py-3 rounded-xl border bg-surface-raised font-mono font-bold text-sm ${tierStyles[tier]}`}>
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
