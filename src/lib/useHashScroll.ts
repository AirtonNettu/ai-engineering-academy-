import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Run after the destination page and its asynchronous content have committed. */
export function useHashScroll(ready = true): void {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!ready || !hash) return;
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [hash, pathname, ready]);
}
