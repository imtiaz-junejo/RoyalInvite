"use client"

import type { ReactNode } from "react"
import { InvitationPreviewFrame } from "@/components/invitation-preview-frame"

type InvitationBuilderPreviewPanelProps = {
  children: ReactNode
}

/** Client boundary for ResizeObserver-based preview scaling (SSR-safe initial markup). */
export function InvitationBuilderPreviewPanel({ children }: InvitationBuilderPreviewPanelProps) {
  return (
    <InvitationPreviewFrame className="min-h-0 flex-1">{children}</InvitationPreviewFrame>
  )
}
