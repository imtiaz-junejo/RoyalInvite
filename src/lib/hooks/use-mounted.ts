"use client"

import { useEffect, useState } from "react"

/**
 * Returns true after mount. SSR and the first client paint both receive `false`,
 * keeping the initial DOM identical for hydration.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
