"use client"

import { useMounted } from "@/lib/hooks/use-mounted"

type ThemeMode = "light" | "dark"

/**
 * Returns the resolved theme only after mount.
 * During SSR and the first client paint, returns `defaultTheme` for stable HTML.
 */
export function useHydrationSafeTheme(
  resolvedTheme: ThemeMode | undefined,
  defaultTheme: ThemeMode = "light",
): ThemeMode {
  const mounted = useMounted()
  if (!mounted) return defaultTheme
  return resolvedTheme ?? defaultTheme
}
