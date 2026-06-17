import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Input';
import type { JudgeScore, Project } from '../../types';

interface ScoringPanelProps {
  projectId: string;
  existingScore: JudgeScore | undefined;
  judgeId: string;
  onScored: (score: JudgeScore) => void;
}

const CRITERIA = [
  { key: 'innovation' as const, label: 'Innovation', description: 'Originality and creativity of the solution' },
  { key: 'technical' as const, label: 'Technical execution', description: 'Code quality, architecture, and complexity' },
  { key: 'impact' as const, label: 'Impact', description: 'Real-world value and potential reach' },
  { key: 'presentation' as const, label: 'Presentation', description: 'Clarity of demo, pitch deck, and documentation' },
];

type ScoreKey = 'innovation' | 'technical' | 'impact' | 'presentation';

export function ScoringPanel({ projectId, existingScore, judgeId, onScored }: ScoringPanelProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [scores, setScores] = useState<Record<ScoreKey, number>>({ innovation: 0, technical: 0, impact: 0, presentation: 0 });
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      setProject((await res.json()) as Project);
    };
    void load();
  }, [projectId]);

  useEffect(() => {
    if (existingScore) {
      setScores({ innovation: existingScore.innovation, technical: existingScore.technical, impact: existingScore.impact, presentation: existingScore.presentation });
      setComments(existingScore.comments ?? '');
    } else {
      setScores({ innovation: 0, technical: 0, impact: 0, presentation: 0 });
      setComments('');
    }
  }, [existingScore, projectId]);

  const total = scores.innovation + scores.technical + scores.impact + scores.presentation;
  const isLocked = existingScore?.review_status === 'scored';

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/judge-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judge_id: judgeId, project_id: projectId, ...scores, comments }),
      });
      const saved_score = (await res.json()) as JudgeScore;
      onScored(saved_score);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  if (!project) {
    return <div className="flex-1 flex items-center justify-center font-mono text-ink-faint animate-pulse">Loading project…</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Project details */}
      <div className="px-6 py-5 border-b border-surface-border">
        <h2 className="text-xl font-bold text-ink font-mono mb-1">{project.title}</h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack.map((t) => (
            <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple">{t}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline">↗ GitHub</a>}
          {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline">↗ Live demo</a>}
          {project.video_url && <a href={project.video_url} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline">↗ Video</a>}
        </div>
      </div>

      {/* Scoring */}
      <div className="flex-1 px-6 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink font-mono">Scoring</h3>
          <div className="text-center">
            <span className={`text-2xl font-bold font-mono tabular-nums ${total >= 32 ? 'text-emerald-400' : total >= 20 ? 'text-amber-400' : 'text-ink'}`}>{total}</span>
            <span className="text-sm font-mono text-ink-faint">/40</span>
          </div>
        </div>

        {CRITERIA.map(({ key, label, description }) => (
          <div key={key}>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-xs font-mono font-semibold text-ink">{label}</label>
              <span className="text-sm font-mono font-bold text-brand-purple">{scores[key]}<span className="text-ink-faint">/10</span></span>
            </div>
            <p className="text-[10px] text-ink-faint font-mono mb-2">{description}</p>
            <input
              type="range" min={0} max={10} step={1}
              value={scores[key]}
              onChange={(e) => setScores((s) => ({ ...s, [key]: Number(e.target.value) }))}
              disabled={isLocked}
              className="w-full accent-brand-purple cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[10px] font-mono text-ink-faint mt-0.5">
              <span>0</span><span>5</span><span>10</span>
            </div>
          </div>
        ))}

        <Textarea
          label="Judge notes (optional)"
          placeholder="Strengths, weaknesses, suggestions for improvement…"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          disabled={isLocked}
        />

        {!isLocked ? (
          <Button onClick={() => void handleSave()} loading={saving} className="w-full">
            {saved ? '✓ Score saved!' : 'Submit score →'}
          </Button>
        ) : (
          <Card>
            <div className="px-4 py-3 text-center">
              <p className="text-xs font-mono text-emerald-400">✓ Score locked — {total}/40</p>
              <p className="text-[10px] text-ink-faint mt-1">Scored {existingScore?.scored_at ? new Date(existingScore.scored_at).toLocaleString() : ''}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
