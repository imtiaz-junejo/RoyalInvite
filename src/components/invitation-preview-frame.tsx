"use client"

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  INVITATION_PREVIEW_DESIGN_WIDTH,
  INVITATION_PREVIEW_FILL_RATIO,
} from "@/lib/invitation-preview"

export type InvitationPreviewFrameProps = {
  children: ReactNode
  className?: string
  designWidth?: number
  fillRatio?: number
  allowScroll?: boolean
}

type LayoutState = {
  scale: number
  contentHeight: number
  fillWidth: number
  fillHeight: number
  scrollable: boolean
}

const INITIAL_LAYOUT: LayoutState = {
  scale: 1,
  contentHeight: 0,
  fillWidth: 0,
  fillHeight: 0,
  scrollable: false,
}

/** SSR-safe: identical initial markup on server and client; scale updates in useLayoutEffect only. */
export function InvitationPreviewFrame({
  children,
  className,
  designWidth = INVITATION_PREVIEW_DESIGN_WIDTH,
  fillRatio = INVITATION_PREVIEW_FILL_RATIO,
  allowScroll = true,
}: InvitationPreviewFrameProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<LayoutState>(INITIAL_LAYOUT)

  const recalculate = useCallback(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return

    const availW = viewport.clientWidth
    const availH = viewport.clientHeight
    if (availW <= 0 || availH <= 0) return

    const fillW = availW * fillRatio
    const fillH = availH * fillRatio
    const contentHeight = content.offsetHeight
    if (contentHeight <= 0) return

    const scaleFitBoth = Math.min(fillW / designWidth, fillH / contentHeight)
    const scaleFitWidth = fillW / designWidth

    let scale = scaleFitBoth
    let scrollable = false

    if (allowScroll && contentHeight * scaleFitBoth > fillH + 0.5) {
      scale = scaleFitWidth
      scrollable = true
    }

    setLayout({
      scale,
      contentHeight,
      fillWidth: fillW,
      fillHeight: fillH,
      scrollable,
    })
  }, [allowScroll, designWidth, fillRatio])

  useLayoutEffect(() => {
    recalculate()

    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return

    const resizeObserver = new ResizeObserver(() => recalculate())
    resizeObserver.observe(viewport)
    resizeObserver.observe(content)

    const mutationObserver = new MutationObserver(() => recalculate())
    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [recalculate, children])

  const scaledWidth = designWidth * layout.scale
  const scaledHeight = layout.contentHeight * layout.scale

  return (
    <div
      ref={viewportRef}
      className={cn(
        "flex h-full w-full min-h-0 min-w-0 items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "shrink-0",
          layout.scrollable &&
            "scrollbar-hidden max-h-full overflow-x-hidden overflow-y-auto overscroll-contain",
        )}
        style={{
          width: scaledWidth || designWidth,
          maxHeight: layout.scrollable ? layout.fillHeight : undefined,
        }}
      >
        <div
          className="relative"
          style={{
            width: scaledWidth || designWidth,
            height: scaledHeight || undefined,
          }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left transition-transform duration-150 ease-out"
            style={{
              width: designWidth,
              transform: layout.scale !== 1 ? `scale(${layout.scale})` : undefined,
            }}
          >
            <div ref={contentRef} className="w-full" style={{ width: designWidth }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** @deprecated Use `InvitationPreviewFrame` */
export const InvitationPreviewScaler = InvitationPreviewFrame
