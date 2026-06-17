import type { Track } from '../../types';
import { Card, CardBody } from '../../components/ui/Card';

interface PrizesSectionProps { tracks: Track[] }

const medals = ['🥇', '🥈', '🥉'];
const placeSuffix = ['1st Place', '2nd Place', '3rd Place'];

export function PrizesSection({ tracks }: PrizesSectionProps) {
  const trackColors = ['from-brand-purple to-indigo-600', 'from-brand-cyan to-teal-600', 'from-amber-500 to-orange-600'];
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-ink font-mono mb-3 text-center">
          <span className="text-brand-purple">./</span>prizes_and_tracks
        </h2>
        <p className="text-center text-ink-muted text-sm font-mono mb-12">$50,000 total across all tracks</p>
        <div className="grid md:grid-cols-3 gap-6">
          {tracks.map((track, i) => (
            <Card key={track.id} glow className="overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${trackColors[i % trackColors.length]}`} />
              <CardBody>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-ink font-mono">{track.name}</h3>
                  <p className="text-sm text-ink-muted mt-1">{track.description}</p>
                </div>
                <div className="space-y-3">
                  {[track.prize_first, track.prize_second, track.prize_third].map((prize, j) => (
                    <div key={j} className="flex items-center justify-between py-2 border-t border-surface-border first:border-t-0">
                      <span className="text-sm font-mono text-ink-muted">{medals[j]} {placeSuffix[j]}</span>
                      <span className={`text-lg font-bold font-mono ${j === 0 ? 'text-amber-400' : j === 1 ? 'text-slate-300' : 'text-amber-700'}`}>
                        ${prize.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs font-mono text-brand-cyan hover:underline">View problem statement →</summary>
                  <p className="mt-3 text-xs text-ink-muted leading-relaxed">{track.problem_statement}</p>
                </details>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
