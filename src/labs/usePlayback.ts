import { useEffect } from 'react';
export function usePlayback(playing: boolean, tick: () => void, delay = 100) {
  useEffect(() => {
    if (!playing) return;
    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const timer = window.setInterval(
      tick,
      reduced ? Math.max(delay, 500) : delay,
    );
    return () => window.clearInterval(timer);
  }, [playing, tick, delay]);
}
