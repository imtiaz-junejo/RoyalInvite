"use client"

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  INVITATION_PREVIEW_DESIGN_HEIGHT,
  INVITATION_PREVIEW_DESIGN_WIDTH,
  INVITATION_PREVIEW_SCALE_SAFETY_MARGIN,
} from "@/lib/invitation-preview"

export type InvitationPreviewFrameProps = {
  children: ReactNode
  className?: string
  designWidth?: number
  designHeight?: number
  safetyMargin?: number
}

/** SSR-safe: identical initial markup on server and client; scale updates in useLayoutEffect only. */
export function InvitationPreviewFrame({
  children,
  className,
  designWidth = INVITATION_PREVIEW_DESIGN_WIDTH,
  designHeight = INVITATION_PREVIEW_DESIGN_HEIGHT,
  safetyMargin = INVITATION_PREVIEW_SCALE_SAFETY_MARGIN,
}: InvitationPreviewFrameProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const recalculate = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const availW = viewport.clientWidth
    const availH = viewport.clientHeight
    if (availW <= 0 || availH <= 0) return

    const scaleFitWidth = availW / designWidth
    const scaleFitHeight = availH / designHeight
    const finalScale = Math.min(scaleFitWidth, scaleFitHeight) * safetyMargin

    setScale(finalScale)
  }, [designWidth, designHeight, safetyMargin])

  useLayoutEffect(() => {
    recalculate()

    const viewport = viewportRef.current
    if (!viewport) return

    const resizeObserver = new ResizeObserver(() => recalculate())
    resizeObserver.observe(viewport)

    return () => resizeObserver.disconnect()
  }, [recalculate])

  const scaledWidth = designWidth * scale
  const scaledHeight = designHeight * scale

  return (
    <div
      ref={viewportRef}
      className={cn(
        "flex h-full w-full min-h-0 min-w-0 items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div
        className="relative shrink-0"
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 overflow-hidden transition-transform duration-150 ease-out"
          style={{
            width: designWidth,
            height: designHeight,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <div className="scrollbar-hidden h-full overflow-x-hidden overflow-y-auto overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/** @deprecated Use `InvitationPreviewFrame` */
export const InvitationPreviewScaler = InvitationPreviewFrame
