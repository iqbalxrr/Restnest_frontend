import { useEffect, useState } from "react";

/**
 * Returns true only after the component has hydrated on the client.
 * Use this to avoid Zustand persist hydration mismatches in SSR.
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
