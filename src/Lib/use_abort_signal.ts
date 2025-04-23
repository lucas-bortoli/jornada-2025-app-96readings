import { useEffect, useMemo } from "react";

export default function useAbortSignal() {
  const abortController = useMemo(() => new AbortController(), []);

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  return abortController.signal;
}
