import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Countdown } from '../../components/ui/Countdown';
import type { Project, ProjectStatus } from '../../types';

const DEADLINE = '2026-07-12T09:00:00Z';
const TEAM_ID = 'team-3';

interface FormState {
  title: string;
  description: string;
  techInput: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  video_url: string;
  pitch_deck_url: string;
}

interface Errors {
  title?: string;
  description?: string;
  github_url?: string;
  tech_stack?: string;
}

export function ProjectSubmissionPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const isPastDeadline = new Date() > new Date(DEADLINE);

  const [form, setForm] = useState<FormState>({
    title: '', description: '', techInput: '', tech_stack: [],
    github_url: '', demo_url: '', video_url: '', pitch_deck_url: '',
  });

  const set = (partial: Partial<FormState>) => setForm((f) => ({ ...f, ...partial }));

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/projects?teamId=${TEAM_ID}`);
      const projects = (await res.json()) as Project[];
      const p = projects[0] ?? null;
      if (p) {
        setProject(p);
        set({
          title: p.title, description: p.description,
          tech_stack: p.tech_stack, github_url: p.github_url ?? '',
          demo_url: p.demo_url ?? '', video_url: p.video_url ?? '',
          pitch_deck_url: p.pitch_deck_url ?? '',
        });
      }
    };
    void load();
  }, [eventId]);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.title.trim()) e.title = 'Project name is required';
    if (form.description.trim().length < 30) e.description = 'Description must be at least 30 characters';
    if (!form.github_url.trim()) e.github_url = 'GitHub URL is required';
    if (form.tech_stack.length === 0) e.tech_stack = 'Add at least one technology';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTag = () => {
    const tag = form.techInput.trim();
    if (tag && !form.tech_stack.includes(tag)) set({ tech_stack: [...form.tech_stack, tag], techInput: '' });
  };

  const removeTag = (tag: string) => set({ tech_stack: form.tech_stack.filter((t) => t !== tag) });

  const handleSave = useCallback(async (status: ProjectStatus = 'draft') => {
    setSaving(true);
    try {
      const payload = {
        team_id: TEAM_ID, event_id: eventId ?? 'event-1',
        title: form.title, description: form.description,
        tech_stack: form.tech_stack, github_url: form.github_url || undefined,
        demo_url: form.demo_url || undefined, video_url: form.video_url || undefined,
        pitch_deck_url: form.pitch_deck_url || undefined, status,
      };
      if (project) {
        const res = await fetch(`/api/projects/${project.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setProject((await res.json()) as Project);
      } else {
        const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setProject((await res.json()) as Project);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }, [form, project, eventId]);

  const handleSubmit = async () => {
    if (!validate()) { setShowConfirm(false); return; }
    setSubmitting(true);
    try {
      const payload = {
        team_id: TEAM_ID, event_id: eventId ?? 'event-1',
        title: form.title, description: form.description, tech_stack: form.tech_stack,
        github_url: form.github_url || undefined, demo_url: form.demo_url || undefined,
        video_url: form.video_url || undefined, status: 'submitted' as const,
        submitted_at: new Date().toISOString(),
      };
      if (project) {
        const res = await fetch(`/api/projects/${project.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setProject((await res.json()) as Project);
      }
    } finally { setSubmitting(false); setShowConfirm(false); }
  };

  const isSubmitted = project?.status === 'submitted';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-1">HackOS 2026</p>
          <h1 className="text-3xl font-bold text-ink font-mono"><span className="text-brand-purple">./</span>submit_project</h1>
        </div>
        <div className="flex items-center gap-3">
          {project && <Badge variant={project.status as ProjectStatus}>{project.status.replace('_', ' ')}</Badge>}
          {saved && <span className="text-xs font-mono text-emerald-400 animate-pulse">✓ Saved</span>}
          {!isSubmitted && !isPastDeadline && (
            <Countdown targetDate={DEADLINE} label="" size="sm" />
          )}
        </div>
      </div>

      {/* Deadline alert */}
      {isPastDeadline && !isSubmitted && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4">
          <p className="text-sm font-mono text-red-400 font-semibold">Submission window has closed.</p>
          <p className="text-xs text-red-300/70 mt-1">The deadline passed. No new submissions are accepted.</p>
        </div>
      )}

      {isSubmitted && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4">
          <p className="text-sm font-mono text-emerald-400 font-semibold">✓ Project submitted successfully!</p>
          <p className="text-xs text-emerald-300/70 mt-1">
            Submitted at {project?.submitted_at ? new Date(project.submitted_at).toLocaleString() : ''}. Judges will review soon.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader><h2 className="text-sm font-bold text-ink font-mono">Project details</h2></CardHeader>
            <CardBody className="space-y-5">
              <Input label="Project name *" placeholder="StudyMind AI" value={form.title} onChange={(e) => set({ title: e.target.value })} error={errors.title} disabled={isSubmitted} />
              <Textarea label="Description *" placeholder="Describe what you built, the problem it solves, and your approach..." value={form.description} onChange={(e) => set({ description: e.target.value })} error={errors.description} rows={5} disabled={isSubmitted} />

              {/* Tech stack tags */}
              <div>
                <label className="block text-sm font-medium text-ink-muted font-mono mb-1.5">Tech stack *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tech_stack.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-brand-purple/15 border border-brand-purple/30 text-brand-purple">
                      {tag}
                      {!isSubmitted && <button onClick={() => removeTag(tag)} className="hover:text-white ml-0.5">×</button>}
                    </span>
                  ))}
                </div>
                {!isSubmitted && (
                  <div className="flex gap-2">
                    <Input placeholder="React, Python, Solidity..." value={form.techInput} onChange={(e) => set({ techInput: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} error={errors.tech_stack} className="flex-1" />
                    <Button variant="secondary" size="sm" onClick={addTag}>Add</Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-sm font-bold text-ink font-mono">Links</h2></CardHeader>
            <CardBody className="space-y-4">
              <Input label="GitHub repository *" placeholder="https://github.com/your-team/project" value={form.github_url} onChange={(e) => set({ github_url: e.target.value })} error={errors.github_url} disabled={isSubmitted} />
              <Input label="Live demo URL" placeholder="https://your-demo.vercel.app" value={form.demo_url} onChange={(e) => set({ demo_url: e.target.value })} disabled={isSubmitted} />
              <Input label="Demo video URL" placeholder="https://youtube.com/watch?v=..." value={form.video_url} onChange={(e) => set({ video_url: e.target.value })} hint="YouTube, Loom, or any public video link" disabled={isSubmitted} />
              <Input label="Pitch deck URL" placeholder="https://drive.google.com/..." value={form.pitch_deck_url} onChange={(e) => set({ pitch_deck_url: e.target.value })} disabled={isSubmitted} />
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-3">
              {!isSubmitted && !isPastDeadline ? (
                <>
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => void handleSave('draft')} loading={saving}>
                    {saving ? 'Saving…' : '↓ Save draft'}
                  </Button>
                  <Button size="sm" className="w-full" onClick={() => { if (validate()) setShowConfirm(true); }}>
                    Submit project →
                  </Button>
                  <p className="text-[10px] text-ink-faint font-mono text-center">
                    Submission is final. You can edit until the deadline.
                  </p>
                </>
              ) : !isSubmitted ? (
                <p className="text-xs font-mono text-red-400 text-center">Deadline passed</p>
              ) : (
                <p className="text-xs font-mono text-emerald-400 text-center">✓ Submitted</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-xs font-mono font-bold text-ink mb-3">Judging rubric</h3>
              {[['Innovation', '25%'], ['Technical', '25%'], ['Impact', '25%'], ['Presentation', '25%']].map(([c, w]) => (
                <div key={c} className="flex justify-between py-2 border-t border-surface-border first:border-t-0 text-xs font-mono">
                  <span className="text-ink-muted">{c}</span>
                  <span className="text-brand-cyan">{w}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-surface-border bg-surface-raised shadow-2xl p-8">
            <h2 className="text-xl font-bold text-ink font-mono mb-3">Confirm submission</h2>
            <p className="text-sm text-ink-muted mb-6">
              You can still update your submission until the deadline. This action confirms your entry in the judging queue.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button className="flex-1" loading={submitting} onClick={() => void handleSubmit()}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
