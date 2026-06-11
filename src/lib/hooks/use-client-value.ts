"use client"

import { useEffect, useState } from "react"

/**
 * Returns `serverValue` during SSR/first paint, then `clientValue` after mount.
 * Use when client-only data must not change the initial hydrated HTML.
 */
export function useClientValue<T>(serverValue: T, getClientValue: () => T): T {
  const [value, setValue] = useState(serverValue)

  useEffect(() => {
    setValue(getClientValue())
  }, [getClientValue])

  return value
}
