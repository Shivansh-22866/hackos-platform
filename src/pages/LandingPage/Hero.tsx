import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Countdown } from '../../components/ui/Countdown';
import type { Event } from '../../types';
import DotBackground from './DotBackground';

interface HeroProps { event: Event }

export function Hero({ event }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 px-4 min-h-screen pointer-events-auto">

      <DotBackground/>

      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/50 to-surface" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-brand-purple/40 bg-brand-purple/10 font-mono text-xs text-brand-purple">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE — Submissions open
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-ink mb-4">
          <span className="text-brand-purple font-mono">hack</span>
          <span className="font-mono">OS</span>
          <span className="block text-3xl sm:text-4xl font-normal text-ink-muted mt-2 font-sans">
            {event.tagline}
          </span>
        </h1>

        {/* Dates */}
        <p className="mt-4 text-base text-ink-muted font-mono">
          {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          {' — '}
          {new Date(event.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          <span className="mx-3 text-surface-border">·</span>
          <span className="text-brand-cyan">{event.participant_count.toLocaleString()} registered</span>
        </p>

        {/* Countdown */}
        <div className="mt-10 flex justify-center">
          <Countdown targetDate={event.end_date} label="Deadline" size="lg" />
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={event.cta_url} className='z-20'>
            <Button size="lg" variant="primary">Register Now</Button>
          </Link>
          <Link to={`/events/${event.id}`} className='z-20'>
            <Button size="lg" variant="secondary">View Details</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
          {[
            { label: 'prize pool', value: '$50K' },
            { label: 'tracks', value: '3' },
            { label: 'max team', value: `${event.team_max_size} devs` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-ink font-mono">{value}</p>
              <p className="text-xs text-ink-faint font-mono uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
