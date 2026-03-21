/**
 * theme.ts
 * Centralised Tailwind class strings.
 * Change a class here → it updates everywhere.
 *
 * Usage:
 *   import { t } from "@/lib/theme"
 *   <div className={t.card(isDark)}>...</div>
 */

export const t = {
  // ─── Surfaces ────────────────────────────────────────────────────────────
  /** Primary page background */
  bg: (dark: boolean) => (dark ? "bg-[#0a0d1a]" : "bg-white"),

  /** Slightly elevated card / panel */
  card: (dark: boolean) =>
    dark
      ? "bg-white/5 border border-white/10"
      : "bg-gray-50 border border-gray-200",

  /** Floating dropdown / popover */
  popover: (dark: boolean) =>
    dark
      ? "bg-[#1a1d2e] border border-white/10"
      : "bg-white border border-gray-200",

  // ─── Nav ─────────────────────────────────────────────────────────────────
  nav: (dark: boolean) =>
    dark ? "bg-[#0a0d1a]/80 border-white/5" : "bg-white/80 border-gray-200",

  navLink: (dark: boolean) =>
    dark
      ? "text-gray-300 hover:text-white hover:bg-white/5"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",

  // ─── Text ─────────────────────────────────────────────────────────────────
  heading: (dark: boolean) => (dark ? "text-white" : "text-gray-900"),
  subtext: (dark: boolean) => (dark ? "text-gray-400" : "text-gray-600"),
  muted: (dark: boolean) => (dark ? "text-gray-500" : "text-gray-500"),

  // ─── Interactive ──────────────────────────────────────────────────────────
  iconBtn: (dark: boolean) =>
    dark ? "hover:bg-white/5 text-gray-400" : "hover:bg-gray-100 text-gray-600",

  ghostBtn: (dark: boolean) =>
    dark
      ? "bg-white/5 text-gray-400 hover:bg-white/10"
      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200",

  input: (dark: boolean) =>
    dark
      ? "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/50"
      : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500/50",

  // ─── Accents ──────────────────────────────────────────────────────────────
  accent: "text-indigo-400",
  accentLight: "text-indigo-600",
  accentBg: "bg-indigo-500/10",

  /** Primary CTA gradient button */
  gradientBtn:
    "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:scale-105",

  /** Selected pill / card gradient */
  selectedPill:
    "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105",

  // ─── Utility ──────────────────────────────────────────────────────────────
  /** Disabled state */
  disabled: (dark: boolean) =>
    dark
      ? "bg-white/5 text-gray-600 cursor-not-allowed"
      : "bg-gray-200 text-gray-400 cursor-not-allowed",

  /** Hover row inside a dropdown */
  dropdownRow: (dark: boolean) =>
    dark ? "hover:bg-white/5" : "hover:bg-gray-50",
} as const;
