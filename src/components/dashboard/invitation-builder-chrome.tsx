"use client"

import type { ReactNode } from "react"
import { Sparkles } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { InvitationBuilderPreviewPanel } from "@/components/dashboard/invitation-builder-preview-panel"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { type } from "@/lib/typography"

const BUILDER_HEIGHT = "h-[calc(100vh-var(--site-nav-height))]"

type InvitationBuilderChromeProps = {
  mode: "new" | "edit"
  aside: ReactNode
  preview: ReactNode
  toolbar?: ReactNode
}

export function InvitationBuilderChrome({ aside, preview, toolbar }: InvitationBuilderChromeProps) {
  return (
    <div className={`${BUILDER_HEIGHT} overflow-hidden bg-neutral-50`}>
      <div
        className={`grid ${BUILDER_HEIGHT} grid-rows-2 overflow-hidden lg:grid-cols-[minmax(280px,380px)_1fr] lg:grid-rows-1`}
      >
        <aside className={`${dt.builderAside} min-h-0 border-b border-neutral-200 lg:border-b-0`}>
          <div className="shrink-0 border-b border-neutral-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4f6df5] to-[#7a5af1] text-white shadow-sm">
                <Sparkles size={16} />
              </span>
              <div>
                <h2 className={type.h5}>Invitation builder</h2>
                <p className={type.caption}>Design and preview in real time</p>
              </div>
            </div>
          </div>
          <div className={dt.builderAsideScroll}>{aside}</div>
        </aside>

        <section className="relative z-[1] flex min-h-0 flex-col overflow-hidden">
          {toolbar && (
            <div className="relative z-[2] shrink-0 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="flex flex-wrap justify-center gap-2">{toolbar}</div>
            </div>
          )}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 py-2 sm:px-3 sm:py-3">
            <InvitationBuilderPreviewPanel>{preview}</InvitationBuilderPreviewPanel>
          </div>
        </section>
      </div>
    </div>
  )
}

export function BuilderToolbarButton({
  children,
  onClick,
  href,
  variant = "outline",
}: {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: "outline" | "primary"
}) {
  const className = "gap-1.5"
  if (href) {
    const openInNewTab = href.startsWith("http") || href.startsWith("/invite")
    return (
      <ButtonLink
        href={href}
        variant={variant}
        size="sm"
        tone="light"
        className={className}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </ButtonLink>
    )
  }
  return (
    <Button variant={variant} size="sm" tone="light" className={className} onClick={onClick}>
      {children}
    </Button>
  )
}
