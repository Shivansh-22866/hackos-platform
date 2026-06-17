export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-sm text-ink-faint">
          <span className="text-brand-purple">hack</span>OS 2026 — Pre-implementation draft
        </p>
        <div className="flex items-center gap-6 text-xs font-mono text-ink-faint">
          <a href="#" className="hover:text-ink transition-colors">Privacy</a>
          <a href="#" className="hover:text-ink transition-colors">Rules</a>
          <a href="#" className="hover:text-ink transition-colors">Contact</a>
          <a href="#" className="hover:text-ink transition-colors">Discord</a>
        </div>
      </div>
    </footer>
  );
}
