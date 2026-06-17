import { clsx } from 'clsx';
import { Badge } from '../../components/ui/Badge';
import type { JudgeScore, ReviewStatus } from '../../types';

interface ProjectQueueProps {
  scores: JudgeScore[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProjectQueue({ scores, selectedId, onSelect }: ProjectQueueProps) {
  const total = scores.length;
  const scored = scores.filter((s) => s.review_status === 'scored').length;

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="px-4 py-3 border-b border-surface-border bg-surface-raised">
        <div className="flex justify-between text-xs font-mono text-ink-faint mb-1.5">
          <span>Review progress</span>
          <span className="text-brand-cyan">{scored}/{total}</span>
        </div>
        <div className="h-1 rounded-full bg-surface-border overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-cyan transition-all duration-500"
            style={{ width: total > 0 ? `${(scored / total) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto divide-y divide-surface-border">
        {scores.length === 0 ? (
          <li className="text-center py-12 text-xs text-ink-faint font-mono">No projects assigned yet</li>
        ) : (
          scores.map((score) => {
            const proj = score.project;
            const isSelected = selectedId === score.project_id;
            return (
              <li key={score.id}>
                <button
                  onClick={() => onSelect(score.project_id)}
                  className={clsx(
                    'w-full text-left px-4 py-4 hover:bg-surface-overlay transition-colors',
                    isSelected && 'bg-brand-purple/10 border-l-2 border-brand-purple'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-mono font-semibold text-ink line-clamp-1">
                      {proj?.title ?? 'Untitled Project'}
                    </p>
                    <Badge variant={score.review_status as ReviewStatus} />
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2">{proj?.description ?? ''}</p>
                  {score.review_status === 'scored' && (
                    <p className="text-xs font-mono text-amber-400 mt-2">
                      Total: {score.innovation + score.technical + score.impact + score.presentation}/40
                    </p>
                  )}
                  {proj?.tech_stack && proj.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.tech_stack.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-surface-border text-ink-faint">{t}</span>
                      ))}
                    </div>
                  )}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
