import { useCountdown } from '../../hooks/useCountdown';
import { clsx } from 'clsx';

interface CountdownProps {
  targetDate: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Countdown({ targetDate, label = 'Submission closes in', size = 'md', className }: CountdownProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  const numClass = clsx('font-mono font-bold text-ink tabular-nums', {
    'text-2xl': size === 'sm',
    'text-4xl': size === 'md',
    'text-5xl': size === 'lg',
  });
  const unitClass = 'text-xs font-mono text-ink-muted mt-1';
  const blockClass = 'flex flex-col items-center';

  if (isExpired) {
    return (
      <div className={clsx('flex items-center gap-2 font-mono text-red-400', className)}>
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        Submissions closed
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {label && <p className="text-xs font-mono text-ink-muted uppercase tracking-widest">{label}</p>}
      <div className="flex items-end gap-3">
        {days > 0 && (
          <>
            <div className={blockClass}><span className={numClass}>{String(days).padStart(2, '0')}</span><span className={unitClass}>days</span></div>
            <span className={clsx(numClass, 'mb-5 opacity-30')}>:</span>
          </>
        )}
        <div className={blockClass}><span className={numClass}>{String(hours).padStart(2, '0')}</span><span className={unitClass}>hrs</span></div>
        <span className={clsx(numClass, 'mb-5 opacity-30')}>:</span>
        <div className={blockClass}><span className={numClass}>{String(minutes).padStart(2, '0')}</span><span className={unitClass}>min</span></div>
        <span className={clsx(numClass, 'mb-5 opacity-30')}>:</span>
        <div className={blockClass}><span className={numClass}>{String(seconds).padStart(2, '0')}</span><span className={unitClass}>sec</span></div>
      </div>
    </div>
  );
}
