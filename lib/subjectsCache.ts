/**
 * lib/subjectsCache.ts
 *
 * Module-level singleton that caches the full subjects array for the
 * lifetime of a browser tab session (15-minute stale time).
 */

const STALE_MS = 15 * 60 * 1000; // 15 minutes

interface CacheEntry {
  data: any[];
  fetchedAt: number;
}

interface SubjectsCache {
  entry: CacheEntry | null;
  /** Deduplication: stores the in-flight promise so concurrent callers share it */
  inflight: Promise<{ data: any[]; fromCache: boolean }> | null;
}

const cache: SubjectsCache = {
  entry: null,
  inflight: null,
};

/**
 * Returns all subjects. Serves from cache if data is fresh (<15 min old).
 * Concurrent calls while a fetch is in-flight all share the same Promise.
 */
export async function getSubjects(): Promise<{ data: any[]; fromCache: boolean }> {
  // 1. Serve from cache if data is fresh
  if (cache.entry && Date.now() - cache.entry.fetchedAt < STALE_MS) {
    return { data: cache.entry.data, fromCache: true };
  }

  // 2. Reuse an in-flight fetch (deduplication)
  if (cache.inflight) {
    return cache.inflight;
  }

  // 3. Start a new fetch (with 1 retry for transient network hiccups)
  cache.inflight = (async () => {
    try {
      let res: Response | null = null;
      try {
        res = await fetch("/api/subjects", { cache: "no-store" });
      } catch {
        // Retry once after a short delay
        await new Promise((r) => setTimeout(r, 500));
        res = await fetch("/api/subjects", { cache: "no-store" });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load subjects`);
      const data = await res.json();
      cache.entry = { data: data || [], fetchedAt: Date.now() };
      return { data: cache.entry.data, fromCache: false };
    } finally {
      cache.inflight = null;
    }
  })();

  return cache.inflight;
}

/** Call this if you know server data has changed (e.g. after an admin update). */
export function invalidateSubjectsCache(): void {
  cache.entry = null;
}
