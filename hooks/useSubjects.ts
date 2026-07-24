"use client";
import { useState, useEffect } from "react";
import { getSubjects } from "@/lib/subjectsCache";

export interface UseSubjectsResult {
  subjects: any[];
  loading: boolean;
  error: string | null;
  /** true when data was served from the module cache (no network call) */
  fromCache: boolean;
}

/**
 * useSubjects — thin hook over the module-level subjectsCache singleton.
 *
 * Calling this from multiple components (TopBar + SubjectPage) fires only
 * ONE network request total, because they share the same singleton cache
 * and the in-flight promise deduplication.
 */
export function useSubjects(): UseSubjectsResult {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const { data, fromCache: hit } = await getSubjects();
        if (!cancelled) {
          setSubjects(data || []);
          setFromCache(hit);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load subjects");
          console.error("❌ useSubjects error:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { subjects, loading, error, fromCache };
}
