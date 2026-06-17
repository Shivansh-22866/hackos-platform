import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'active' | 'upcoming' | 'closed' | 'confirmed' | 'pending' | 'cancelled' | 'submitted' | 'draft' | 'not_started' | 'scored' | 'in_review' | 'purple' | 'cyan';

const styles: Record<BadgeVariant, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  upcoming: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
  closed: 'bg-ink-faint/30 text-ink-muted border-surface-border',
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  submitted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  draft: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  not_started: 'bg-ink-faint/30 text-ink-muted border-surface-border',
  scored: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  in_review: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30',
  purple: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
  cyan: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30',
};

const labels: Partial<Record<BadgeVariant, string>> = {
  not_started: 'Not Started',
  in_review: 'In Review',
};

interface BadgeProps {
  variant: BadgeVariant;
  children?: ReactNode;
  dot?: boolean;
}

export function Badge({ variant, children, dot = false }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-medium rounded-full border', styles[variant])}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children ?? labels[variant] ?? variant.charAt(0).toUpperCase() + variant.slice(1)}
    </span>
  );
}
