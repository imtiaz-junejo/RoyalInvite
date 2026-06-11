/**
 * SSR / hydration utilities — use instead of ad-hoc typeof window checks.
 */

/** True only in the browser (never during SSR). */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/** Stable copyright year for server-rendered footers (set at build/runtime on server). */
export function getCopyrightYear(): number {
  return new Date().getFullYear()
}

/** Deterministic demo event date for builder defaults (avoids Date.now() SSR/client drift). */
export const BUILDER_DEFAULT_EVENT_DATE = "2026-12-15"

/** Locale-stable date formatting for SSR + hydration. */
export function formatEventDate(isoDate: string | Date): string {
  const d = typeof isoDate === "string" ? new Date(isoDate) : isoDate
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** Locale-stable date + time formatting for SSR + hydration. */
export function formatDateTime(isoDate: string | Date): string {
  const d = typeof isoDate === "string" ? new Date(isoDate) : isoDate
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  })
}
