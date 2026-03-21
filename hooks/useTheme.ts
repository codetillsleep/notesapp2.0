"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * useTheme
 * Single source of truth for dark/light mode.
 * Reads from localStorage on mount, syncs with document class,
 * and provides a stable toggle function.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;

    // Initialise from localStorage or current class
    const stored = localStorage.getItem("theme");
    const initialDark =
      stored !== null ? stored === "dark" : root.classList.contains("dark");

    setIsDark(initialDark);
    root.classList.toggle("dark", initialDark);

    // Keep state in sync if something else mutates the class
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { isDark, toggle } as const;
}
