"use client"

import { useMounted } from "./use-mounted"

/**
 * True after the component mounts on the client.
 * Use to enable browser-only behavior in event handlers or effects —
 * never swap JSX trees based on this during the initial render.
 */
export function useIsClient(): boolean {
  return useMounted()
}
