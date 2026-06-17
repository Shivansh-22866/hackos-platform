import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

const ROLE_LABELS: Record<UserRole, string> = {
  participant: 'Participant',
  judge: 'Judge',
  organizer: 'Organizer',
};

const ROLE_COLORS: Record<UserRole, string> = {
  participant: 'text-brand-cyan',
  judge: 'text-amber-400',
  organizer: 'text-brand-purple',
};

export function Navbar() {
  const { currentUser, switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    if (role === 'judge') navigate('/dashboard/judge');
    else if (role === 'organizer') navigate('/dashboard/organizer');
    else navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-surface-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-mono font-bold text-lg">
          <span className="text-brand-purple">hack</span>
          <span className="text-ink">OS</span>
          <span className="hidden sm:inline text-ink-faint text-xs font-normal ml-2 border border-surface-border rounded px-1.5 py-0.5">v2026</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/events" className="text-sm text-ink-muted hover:text-ink transition-colors font-mono">Events</Link>
          {currentUser?.role === 'participant' && (
            <>
              <Link to="/dashboard/team" className="text-sm text-ink-muted hover:text-ink transition-colors font-mono">My Team</Link>
              <Link to="/dashboard/project/event-1" className="text-sm text-ink-muted hover:text-ink transition-colors font-mono">Submit</Link>
            </>
          )}
          {currentUser?.role === 'judge' && (
            <Link to="/dashboard/judge" className="text-sm text-ink-muted hover:text-ink transition-colors font-mono">Review Queue</Link>
          )}
          {currentUser?.role === 'organizer' && (
            <Link to="/dashboard/organizer" className="text-sm text-ink-muted hover:text-ink transition-colors font-mono">Control Panel</Link>
          )}
        </div>

        {/* Role switcher (demo) */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-ink-faint font-mono">{currentUser.name.split(' ')[0]}</span>
              <span className={`text-xs font-mono font-semibold ${ROLE_COLORS[currentUser.role]}`}>
                [{ROLE_LABELS[currentUser.role]}]
              </span>
            </div>
          )}
          <div className="relative group">
            <button className="text-xs font-mono text-ink-muted border border-surface-border rounded-lg px-3 py-1.5 hover:border-brand-purple hover:text-ink transition-all">
              Switch Role ▾
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col w-36 rounded-xl border border-surface-border bg-surface-raised shadow-xl shadow-black/50 overflow-hidden">
              {(['participant', 'judge', 'organizer'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className="px-4 py-2.5 text-left text-xs font-mono hover:bg-surface-overlay transition-colors text-ink-muted hover:text-ink"
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
