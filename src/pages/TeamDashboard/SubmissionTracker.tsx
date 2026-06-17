import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Countdown } from '../../components/ui/Countdown';
import { Button } from '../../components/ui/Button';
import type { Project, ProjectStatus } from '../../types';

interface SubmissionTrackerProps {
  project: Project | null;
  deadlineDate: string;
}

const CHECKLIST = [
  { key: 'title', label: 'Project title', check: (p: Project) => !!p.title },
  { key: 'description', label: 'Description', check: (p: Project) => p.description.length > 20 },
  { key: 'github_url', label: 'GitHub repository', check: (p: Project) => !!p.github_url },
  { key: 'tech_stack', label: 'Tech stack listed', check: (p: Project) => p.tech_stack.length > 0 },
  { key: 'demo_url', label: 'Demo URL', check: (p: Project) => !!p.demo_url },
  { key: 'video_url', label: 'Demo video', check: (p: Project) => !!p.video_url },
];

export function SubmissionTracker({ project, deadlineDate }: SubmissionTrackerProps) {
  const isPastDeadline = new Date() > new Date(deadlineDate);
  const done = project ? CHECKLIST.filter((c) => c.check(project)).length : 0;
  const pct = Math.round((done / CHECKLIST.length) * 100);

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-ink font-mono">Submission</h3>
          {project && <Badge variant={project.status as ProjectStatus}>{project.status.replace('_', ' ')}</Badge>}
        </div>

        {project?.status === 'submitted' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-mono text-sm font-semibold text-emerald-400">Submitted!</p>
            <p className="text-xs text-ink-faint font-mono mt-1">
              {project.submitted_at ? new Date(project.submitted_at).toLocaleString() : ''}
            </p>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-ink-faint mb-1.5">
                <span>{done}/{CHECKLIST.length} required fields</span>
                <span className={pct === 100 ? 'text-emerald-400' : 'text-brand-purple'}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-400' : 'bg-brand-purple'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-1.5 mb-5">
              {CHECKLIST.map((c) => {
                const checked = project ? c.check(project) : false;
                return (
                  <li key={c.key} className="flex items-center gap-2 text-xs font-mono">
                    <span className={checked ? 'text-emerald-400' : 'text-surface-border'}>
                      {checked ? '✓' : '○'}
                    </span>
                    <span className={checked ? 'text-ink-muted line-through' : 'text-ink-muted'}>{c.label}</span>
                  </li>
                );
              })}
            </ul>

            {!isPastDeadline ? (
              <>
                <Countdown targetDate={deadlineDate} label="Time left" size="sm" className="mb-4" />
                <Link to="/dashboard/project/event-1">
                  <Button variant="primary" size="sm" className="w-full">
                    {project ? 'Continue editing →' : 'Start submission →'}
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-xs text-red-400 font-mono text-center">Deadline passed — submissions locked</p>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
