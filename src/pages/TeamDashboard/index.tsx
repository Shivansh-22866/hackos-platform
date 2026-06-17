import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { TeamOverview } from './TeamOverview';
import { SubmissionTracker } from './SubmissionTracker';
import { AnnouncementsFeed } from './AnnouncementsFeed';
import { LeaderboardWidget } from './LeaderboardWidget';
import type { Team, User, Track, Project } from '../../types';

const EVENT_ID = 'event-1';
const SUBMISSION_DEADLINE = '2026-07-12T09:00:00Z';

export function TeamDashboard() {
  const { currentUser } = useAuthStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [track, setTrack] = useState<Track | undefined>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Load team (Alice is in team-1)
        const teamRes = await fetch('/api/teams/team-1');
        const teamData = (await teamRes.json()) as Team & { member_details: User[] };
        setTeam(teamData);
        setMembers(teamData.member_details ?? []);

        // Load track
        const tracksRes = await fetch(`/api/events/${EVENT_ID}/tracks`);
        const tracks = (await tracksRes.json()) as Track[];
        setTrack(tracks.find((t) => t.id === teamData.track_id));

        // Load project
        const projRes = await fetch(`/api/projects?teamId=team-3`);
        const projects = (await projRes.json()) as Project[];
        setProject(projects[0] ?? null);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-56 rounded-xl bg-surface-raised animate-pulse" />)}
      </div>
    );
  }

  if (!team) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-3xl mb-4">🚀</p>
        <h1 className="text-xl font-bold text-ink font-mono mb-2">Not registered yet</h1>
        <p className="text-ink-muted text-sm mb-6">Register for an event to see your team dashboard.</p>
        <Link to="/events" className="text-brand-cyan font-mono text-sm hover:underline">Browse events →</Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-1">Team Dashboard</p>
        <h1 className="text-3xl font-bold text-ink font-mono">
          <span className="text-brand-purple">./</span>my_team
        </h1>
        <p className="text-sm text-ink-muted font-mono mt-1">HackOS 2026 · {track?.name ?? 'Track'} track</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Team + Submission */}
        <div className="space-y-6">
          <TeamOverview team={team} members={members} track={track} />
          <SubmissionTracker project={project} deadlineDate={SUBMISSION_DEADLINE} />
        </div>

        {/* Center: Announcements */}
        <div>
          <AnnouncementsFeed eventId={EVENT_ID} />
        </div>

        {/* Right: Leaderboard */}
        <div>
          <LeaderboardWidget eventId={EVENT_ID} myTeamId={team.id} />
        </div>
      </div>
    </main>
  );
}
