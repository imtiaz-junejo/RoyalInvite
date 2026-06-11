"use client"

import { useState, type ReactNode } from "react"
import { Menu, X } from "lucide-react"

type LandingNavMobileProps = {
  /** Server-rendered links passed from `LandingNav` — avoids bundling nav markup in the client. */
  mobileLinks: ReactNode
}

export function LandingNavMobile({ mobileLinks }: LandingNavMobileProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-neutral-200/80 md:hidden">
      <button
        type="button"
        className="type-nav flex w-full items-center justify-between px-4 py-2.5"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-main-nav"
      >
        Menu
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <nav id="mobile-main-nav" className="border-t border-neutral-100 px-4 py-3" aria-label="Main mobile">
          {mobileLinks}
        </nav>
      )}
    </div>
  )
}
