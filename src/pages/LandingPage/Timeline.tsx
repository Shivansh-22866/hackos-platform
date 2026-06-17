import type { Event } from '../../types';

interface TimelineProps { event: Event }

const milestones = (e: Event) => [
  { label: 'Registration Opens', date: e.registration_open, done: true },
  { label: 'Hackathon Begins', date: e.start_date, done: new Date() >= new Date(e.start_date) },
  { label: 'Submission Deadline', date: e.end_date, done: new Date() >= new Date(e.end_date) },
  { label: 'Judging Starts', date: e.judging_start, done: new Date() >= new Date(e.judging_start) },
  { label: 'Results Announced', date: e.results_date, done: new Date() >= new Date(e.results_date) },
];

export function Timeline({ event }: TimelineProps) {
  const items = milestones(event);
  return (
    <section className="py-20 px-4 bg-surface-raised/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-ink font-mono mb-12 text-center">
          <span className="text-brand-purple">./</span>timeline
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-surface-border" />
          <ol className="space-y-8">
            {items.map((item, i) => (
              <li key={i} className="relative flex items-start gap-6 pl-14">
                {/* Node */}
                <div className={`absolute left-4 w-4 h-4 rounded-full border-2 flex items-center justify-center ${item.done ? 'border-brand-purple bg-brand-purple' : 'border-surface-border bg-surface'}`}>
                  {item.done && <span className="text-white text-[8px]">✓</span>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink font-mono">{item.label}</p>
                  <p className="text-xs text-ink-muted font-mono mt-0.5">
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
