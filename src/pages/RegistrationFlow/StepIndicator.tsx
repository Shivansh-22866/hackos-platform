interface StepIndicatorProps {
  current: number;
  total: number;
  labels: string[];
  onBack?: (step: number) => void;
}

export function StepIndicator({ current, total, labels, onBack }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono text-ink-muted">Step {current} of {total}</p>
        <p className="text-xs font-mono text-brand-purple">{labels[current - 1]}</p>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <button
              key={i}
              onClick={() => done && onBack?.(step)}
              disabled={!done}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${active ? 'bg-brand-purple' : done ? 'bg-brand-purple/50 cursor-pointer hover:bg-brand-purple/70' : 'bg-surface-border'}`}
              aria-label={done ? `Go back to step ${step}: ${labels[i]}` : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
