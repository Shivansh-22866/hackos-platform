import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ProjectQueue } from './ProjectQueue';
import { ScoringPanel } from './ScoringPanel';
import type { JudgeScore } from '../../types';

export function JudgeDashboard() {
  const { currentUser } = useAuthStore();
  const [scores, setScores] = useState<JudgeScore[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/judge-scores?judgeId=${currentUser.id}`);
      const data = (await res.json()) as JudgeScore[];
      setScores(data);
      if (data.length > 0 && !selectedProjectId) setSelectedProjectId(data[0].project_id);
    } finally { setLoading(false); }
  }, [currentUser, selectedProjectId]);

  useEffect(() => { void fetchScores(); }, [fetchScores]);

  const handleScored = (updated: JudgeScore) => {
    setScores((prev) => prev.map((s) => s.project_id === updated.project_id ? { ...s, ...updated } : s));
  };

  const selectedScore = scores.find((s) => s.project_id === selectedProjectId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-1">Judge Panel</p>
        <h1 className="text-3xl font-bold text-ink font-mono"><span className="text-brand-purple">./</span>review_queue</h1>
        <p className="text-sm text-ink-muted font-mono mt-1">HackOS 2026 · {currentUser?.name}</p>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 h-96 rounded-xl bg-surface-raised animate-pulse" />
          <div className="lg:col-span-3 h-96 rounded-xl bg-surface-raised animate-pulse" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6" style={{ height: '75vh' }}>
          {/* Queue */}
          <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-raised overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-surface-border">
              <h2 className="text-sm font-bold text-ink font-mono">Assigned projects</h2>
            </div>
            <ProjectQueue scores={scores} selectedId={selectedProjectId} onSelect={setSelectedProjectId} />
          </div>

          {/* Scoring panel */}
          <div className="lg:col-span-3 rounded-xl border border-surface-border bg-surface-raised overflow-hidden flex flex-col">
            {selectedProjectId ? (
              <ScoringPanel
                projectId={selectedProjectId}
                existingScore={selectedScore}
                judgeId={currentUser?.id ?? ''}
                onScored={handleScored}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm font-mono text-ink-faint">Select a project to begin reviewing</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
