import type { ReactNode } from "react"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div data-dashboard className="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      {children}
    </div>
  )
}
