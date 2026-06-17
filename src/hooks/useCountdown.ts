import { useState, useEffect } from 'react';

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  total: number;
}

export function useCountdown(targetDate: string): CountdownParts {
  const calculate = (): CountdownParts => {
    const total = new Date(targetDate).getTime() - Date.now();
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, total: 0 };
    return {
      days: Math.floor(total / 86_400_000),
      hours: Math.floor((total % 86_400_000) / 3_600_000),
      minutes: Math.floor((total % 3_600_000) / 60_000),
      seconds: Math.floor((total % 60_000) / 1_000),
      isExpired: false,
      total,
    };
  };

  const [parts, setParts] = useState<CountdownParts>(calculate);

  useEffect(() => {
    if (parts.isExpired) return;
    const id = setInterval(() => setParts(calculate()), 1_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return parts;
}
