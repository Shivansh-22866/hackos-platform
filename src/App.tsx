import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { EventListingPage } from './pages/EventListingPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { RegistrationFlow } from './pages/RegistrationFlow';
import { TeamDashboard } from './pages/TeamDashboard';
import { ProjectSubmissionPage } from './pages/ProjectSubmissionPage';
import { JudgeDashboard } from './pages/JudgeDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { useAuthStore } from './store/authStore';

// Simple role-guard HOC
function RequireRole({ role, children }: { role: string; children: JSX.Element }) {
  const { currentUser } = useAuthStore();
  if (!currentUser || currentUser.role !== role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-mono">
        <p className="text-2xl">🔒</p>
        <p className="text-ink-muted text-sm">This page requires the <strong className="text-brand-purple">{role}</strong> role.</p>
        <p className="text-xs text-ink-faint">Use the "Switch Role" button in the navbar to switch.</p>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface text-ink flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventListingPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/register/:eventId" element={<RegistrationFlow />} />

            {/* Participant */}
            <Route path="/dashboard/team" element={
              <RequireRole role="participant"><TeamDashboard /></RequireRole>
            } />
            <Route path="/dashboard/project/:eventId" element={
              <RequireRole role="participant"><ProjectSubmissionPage /></RequireRole>
            } />

            {/* Judge */}
            <Route path="/dashboard/judge" element={
              <RequireRole role="judge"><JudgeDashboard /></RequireRole>
            } />

            {/* Organizer */}
            <Route path="/dashboard/organizer" element={
              <RequireRole role="organizer"><OrganizerDashboard /></RequireRole>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
