import { useEffect, useState } from 'react';
import { Hero } from './Hero';
import { Timeline } from './Timeline';
import { PrizesSection } from './PrizesSection';
import { SponsorsSection } from './SponsorsSection';
import type { Event, Track } from '../../types';

const FAQ = [
  { q: 'Do I need a team before registering?', a: 'No — you can register solo and join or form a team during registration step 2.' },
  { q: 'What happens if I miss the deadline?', a: 'Submissions lock the moment the deadline passes. No grace period is given. Save your work early.' },
  { q: 'Can I use pre-existing code?', a: 'All core functionality must be built during the hackathon. Libraries, boilerplates, and open-source packages are allowed.' },
  { q: 'How is judging scored?', a: 'Judges score on four dimensions: Innovation (25%), Technical execution (25%), Impact (25%), and Presentation (25%).' },
];

export function LandingPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const load = async () => {
      const [evRes, trRes] = await Promise.all([
        fetch('/api/events/event-1'),
        fetch('/api/events/event-1/tracks'),
      ]);
      setEvent((await evRes.json()) as Event);
      setTracks((await trRes.json()) as Track[]);
    };
    void load();
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-ink-muted animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Hero event={event} />
      <Timeline event={event} />
      <PrizesSection tracks={tracks} />

      {/* About */}
      <section className="py-20 px-4 bg-surface-raised/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-ink font-mono mb-6"><span className="text-brand-purple">./</span>about</h2>
          <p className="text-ink-muted leading-relaxed">{event.description}</p>
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-ink font-mono mb-3">Rules</h3>
              <ul className="space-y-2">
                {event.rules.split('\n').map((r, i) => (
                  <li key={i} className="text-xs text-ink-muted font-mono flex gap-2">
                    <span className="text-brand-purple">›</span>{r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink font-mono mb-3">Eligibility</h3>
              <p className="text-xs text-ink-muted font-mono leading-relaxed">{event.eligibility_criteria}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-ink font-mono mb-8"><span className="text-brand-purple">./</span>faq</h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-surface-border bg-surface-raised overflow-hidden">
                <summary className="cursor-pointer px-6 py-4 font-mono text-sm text-ink flex items-center justify-between list-none hover:bg-surface-overlay transition-colors">
                  {q}
                  <span className="text-brand-purple group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-6 pb-4 pt-2 text-sm text-ink-muted font-mono">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SponsorsSection sponsors={event.sponsors} />
    </main>
  );
}
