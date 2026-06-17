"use client"

import { useState, type ReactNode } from "react"
import { Menu as MenuIcon, X as XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type LandingNavMobileProps = {
  /** Server-rendered links passed from `LandingNav` — avoids bundling nav markup in the client. */
  mobileLinks: ReactNode
}

export function LandingNavMobile({ mobileLinks }: LandingNavMobileProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-neutral-200/80 dark:border-neutral-800 md:hidden">
      <button
        type="button"
        className="type-nav flex w-full items-center justify-between px-4 py-2.5"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-main-nav"
      >
        {/* <span>Menu</span> */}
        Menu
        <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
          <MenuIcon className={cn("absolute h-5 w-5", open && "opacity-0")} />
          <XIcon className={cn("absolute h-5 w-5", !open && "opacity-0")} />
        </span>
      </button>
      <nav
        id="mobile-main-nav"
        className={cn("border-t border-neutral-100 px-4 py-3 dark:border-neutral-800", !open && "hidden")}
        aria-label="Main mobile"
        aria-hidden={!open}
      >
        {mobileLinks}
      </nav>
    </div>
  )
}
