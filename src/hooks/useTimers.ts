import { useCallback, useEffect, useRef } from "react";

/** setTimeout helpers that are cleared automatically when the component unmounts. */
export function useTimers() {
  const timers = useRef<number[]>([]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  return { schedule, clear };
}
