"use client"

import { useCallback, useEffect, useState } from "react"
import { isBrowser } from "@/lib/ssr"

/**
 * localStorage hook that reads only after mount to avoid SSR/client HTML mismatches.
 */
export function useSafeLocalStorage(
  key: string,
  initialValue = "",
): [string, (value: string) => void] {
  const [stored, setStored] = useState(initialValue)

  useEffect(() => {
    if (!isBrowser()) return
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) setStored(item)
    } catch {
      // ignore quota / privacy errors
    }
  }, [key])

  const setValue = useCallback(
    (value: string) => {
      setStored(value)
      if (!isBrowser()) return
      try {
        window.localStorage.setItem(key, value)
      } catch {
        // ignore
      }
    },
    [key],
  )

  return [stored, setValue]
}
