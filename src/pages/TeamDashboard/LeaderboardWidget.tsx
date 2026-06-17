import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { useLeaderboardStore } from '../../store/leaderboardStore';
import { useLeaderboardWS } from '../../hooks/useWebSocket';
import { clsx } from 'clsx';
import { LayoutGroup, motion } from 'framer-motion';

interface LeaderboardWidgetProps {
  eventId: string;
  myTeamId?: string;
}

export function LeaderboardWidget({ eventId, myTeamId }: LeaderboardWidgetProps) {
  const { entries, isPublished, lastUpdated } = useLeaderboardStore();
  useLeaderboardWS(eventId);

  const sortedEntries = [...entries].sort(
  (a, b) => a.current_rank - b.current_rank
  );

  if (!isPublished) {
    return (
      <Card>
        <CardBody className="text-center py-10">
          <p className="text-3xl mb-3">🔒</p>
          <p className="text-sm font-mono text-ink-muted">
            Leaderboard is hidden until judging ends
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink font-mono">Leaderboard</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-ink-faint">
              {lastUpdated
                ? `Updated ${new Date(lastUpdated).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Live'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        <LayoutGroup>
          <motion.ul layout className="divide-y divide-surface-border">
            {sortedEntries.map((entry) => {
              const isMe = entry.team_id === myTeamId;
              const isUp = entry.rank_delta < 0;
              const isDown = entry.rank_delta > 0;

              return (
                <motion.li
                  key={entry.team_id}
                  layout
                  transition={{
                    layout: {
                      type: 'spring',
                      stiffness: 600,
                      damping: 45,
                    },
                  }}
                  className={clsx(
                    'flex items-center gap-4 px-6 py-3',
                    isMe
                      ? 'bg-brand-purple/10 border-l-2 border-brand-purple'
                      : 'hover:bg-surface-overlay/30'
                  )}
                >
                  {/* Rank */}
                  <div className="w-7 text-center">
                    <span
                      className={clsx(
                        'text-sm font-mono font-bold',
                        entry.current_rank <= 3
                          ? 'text-amber-400'
                          : 'text-ink-muted'
                      )}
                    >
                      {entry.current_rank}
                    </span>
                  </div>

                  {/* Delta */}
                  <div className="w-5 text-center">
                    {isUp && <span className="text-emerald-400 text-xs">▲</span>}
                    {isDown && <span className="text-red-400 text-xs">▼</span>}
                    {!isUp && !isDown && <span className="text-ink-faint text-xs">–</span>}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        'text-sm font-mono truncate',
                        isMe
                          ? 'text-brand-purple font-semibold'
                          : 'text-ink'
                      )}
                    >
                      {entry.team_name}{isMe && ' (you)'}
                    </p>
                    <p className="text-[10px] font-mono text-ink-faint">
                      {entry.track_name}
                    </p>
                  </div>

                  {/* Score */}
                  <span className="text-sm font-mono font-bold text-ink tabular-nums">
                    {entry.total_score}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </LayoutGroup>
      </CardBody>
    </Card>
  );
}