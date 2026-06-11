"use client"

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type InvitationPreviewScalerProps = {
  children: ReactNode
  className?: string
  fillRatio?: number
}

const DEFAULT_FILL_RATIO = 0.98

export function InvitationPreviewScaler({
  children,
  className,
  fillRatio = DEFAULT_FILL_RATIO,
}: InvitationPreviewScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [layout, setLayout] = useState({ width: 0, height: 0 })

  const recalculate = useCallback(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const availableWidth = container.clientWidth
    const availableHeight = container.clientHeight
    const contentWidth = content.offsetWidth
    const contentHeight = content.offsetHeight

    if (availableWidth <= 0 || availableHeight <= 0 || contentWidth <= 0 || contentHeight <= 0) {
      return
    }

    const scaleX = (availableWidth * fillRatio) / contentWidth
    const scaleY = (availableHeight * fillRatio) / contentHeight
    const nextScale = Math.min(scaleX, scaleY, 1)

    setScale(nextScale)
    setLayout({ width: contentWidth, height: contentHeight })
  }, [fillRatio])

  useLayoutEffect(() => {
    recalculate()

    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const observer = new ResizeObserver(() => recalculate())
    observer.observe(container)
    observer.observe(content)

    return () => observer.disconnect()
  }, [recalculate, children])

  const scaledWidth = layout.width > 0 ? layout.width * scale : undefined
  const scaledHeight = layout.height > 0 ? layout.height * scale : undefined

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full items-center justify-center overflow-hidden", className)}
    >
      <div className="shrink-0 overflow-hidden" style={{ width: scaledWidth, height: scaledHeight }}>
        <div
          className="origin-top-left"
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
            width: layout.width || undefined,
            height: layout.height || undefined,
          }}
        >
          <div ref={contentRef} className="inline-block">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
