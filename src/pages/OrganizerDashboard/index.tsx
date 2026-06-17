import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LiveStats } from './LiveStats';
import { RegistrationTable } from './RegistrationTable';
import { AnnouncementForm } from './AnnouncementForm';
import { JudgeAssignment } from './JudgeAssignment';

type Tab = 'overview' | 'registrations' | 'announcements' | 'judges';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'registrations', label: 'Registrations' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'judges', label: 'Judges' },
];

export function OrganizerDashboard() {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-12">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-1">
          Organizer Panel
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-mono">
          <span className="text-brand-purple">./</span>control_panel
        </h1>
        <p className="text-sm text-ink-muted font-mono mt-1">
          HackOS 2026 · {currentUser?.name}
        </p>
      </div>

      {/* Tabs (mobile scrollable) */}
      <div className="mb-6 lg:mb-8 border-b border-surface-border overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-mono border-b-2 transition-all -mb-px whitespace-nowrap ${
                activeTab === id
                  ? 'border-brand-purple text-brand-purple'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6 lg:space-y-8">
            <LiveStats />

            <div className="rounded-xl border border-surface-border bg-surface-raised p-4 sm:p-6">
              <h2 className="text-sm font-bold text-ink font-mono mb-4">
                Event timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono">
                {[
                  { label: 'Hackathon started', date: '2026-07-10T09:00:00Z', done: true },
                  { label: 'Submissions close', date: '2026-07-12T09:00:00Z', done: false },
                  { label: 'Results announced', date: '2026-07-12T18:00:00Z', done: false },
                ].map((m) => (
                  <div
                    key={m.label}
                    className={`p-3 sm:p-4 rounded-lg border ${
                      m.done
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-surface-border bg-surface'
                    }`}
                  >
                    <p className={m.done ? 'text-emerald-400' : 'text-ink-muted'}>
                      {m.label}
                    </p>
                    <p className="text-ink-faint mt-1">
                      {new Date(m.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registrations' && <RegistrationTable />}
        {activeTab === 'announcements' && <AnnouncementForm />}
        {activeTab === 'judges' && <JudgeAssignment />}
      </div>
    </main>
  );
}
