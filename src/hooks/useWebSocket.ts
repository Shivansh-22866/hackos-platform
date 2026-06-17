import { useEffect, useRef } from 'react';
import { useLeaderboardStore } from '../store/leaderboardStore';
import type { LeaderboardEntry } from '../types';

export function useLeaderboardWS(eventId: string | undefined): void {
  const { entries, setEntries, updateEntry, isPublished } = useLeaderboardStore();
  const entriesRef = useRef(entries);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    if (!eventId) return;

    const init = async () => {
      try {
        const res = await fetch(`/api/leaderboard/${eventId}`);
        const data = (await res.json()) as LeaderboardEntry[];
        setEntries(data);
      } catch(err) { 
        console.error(err)
       }
    };
    void init();

    const interval = setInterval(() => {
      if (!isPublished || entriesRef.current.length < 2) return;
      const current = [...entriesRef.current];
      const idx = Math.floor(Math.random() * (current.length - 1));
      const a = current[idx];
      const b = current[idx + 1];
      const updatedA: LeaderboardEntry = { ...a, current_rank: b.current_rank, previous_rank: a.current_rank, rank_delta: b.current_rank - a.current_rank };
      const updatedB: LeaderboardEntry = { ...b, current_rank: a.current_rank, previous_rank: b.current_rank, rank_delta: a.current_rank - b.current_rank };
      updateEntry(updatedA);
      updateEntry(updatedB);
    }, 6_000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, isPublished]);
}
