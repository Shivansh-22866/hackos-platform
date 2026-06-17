import { Link } from 'react-router-dom';
import { useRegistrationStore } from '../../store/registrationStore';
import { Button } from '../../components/ui/Button';

export function Step5Confirmation() {
  const { confirmationId, personalInfo, reset } = useRegistrationStore();

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
        ✓
      </div>
      <div>
        <h2 className="text-2xl font-bold text-ink font-mono">You're registered!</h2>
        <p className="text-ink-muted text-sm mt-2">
          Welcome to HackOS 2026, <strong className="text-ink">{personalInfo.name}</strong>.
        </p>
      </div>
      <div className="rounded-xl border border-surface-border bg-surface-raised px-6 py-5">
        <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-2">Confirmation ID</p>
        <p className="text-lg font-mono font-bold text-brand-cyan break-all">{confirmationId}</p>
        <p className="text-xs text-ink-faint mt-2">Save this code — you may need it for support.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/dashboard/team" className="flex-1">
          <Button variant="primary" className="w-full" onClick={reset}>Go to Team Dashboard →</Button>
        </Link>
        <Link to="/events" className="flex-1">
          <Button variant="secondary" className="w-full">Browse Events</Button>
        </Link>
      </div>
    </div>
  );
}
