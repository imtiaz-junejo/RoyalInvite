import Link from "next/link"
import type { ReactNode } from "react"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"
import { siteConfig } from "@/lib/site"

type AuthPageShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthPageShell({ title, subtitle, children, footer }: AuthPageShellProps) {
  return (
    <div className={mt.authPage}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="type-nav-brand inline-flex items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg shadow-sm"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #7c3aed 45%, #2563eb 100%)",
              }}
              aria-hidden
            >
              <span className="text-white">💍</span>
            </span>
            <span>{siteConfig.name}</span>
          </Link>
        </div>

        <div className={mt.authCard}>
          <div className="mb-8 text-center">
            <h1 className={type.h3}>{title}</h1>
            <p className={`${type.small} mt-2 text-neutral-500`}>{subtitle}</p>
          </div>
          {children}
          <p className={`${type.small} mt-6 text-center text-neutral-500`}>{footer}</p>
        </div>
      </div>
    </div>
  )
}
