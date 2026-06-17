import Link from "next/link"
import Image from "next/image"
import { Bell, User } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { type } from "@/lib/typography"
import { LandingNavLinks } from "./landing-nav-links"
import { LandingNavMobile } from "./landing-nav-mobile"
import { ThemeToggle } from "@/components/theme-toggle"

/** Matches `h-14` / `sm:h-[3.75rem]` — use for full-height layouts below the global nav */
export const SITE_NAV_HEIGHT = "3.75rem"

export type LandingNavUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

type LandingNavProps = {
  session: boolean
  user?: LandingNavUser | null
}

function initialFromUser(user: LandingNavUser | null | undefined) {
  const name = (user?.name ?? "").trim()
  if (name.length > 0) return name[0]!.toUpperCase()
  const email = (user?.email ?? "").trim()
  if (email.length > 0) return email[0]!.toUpperCase()
  return "?"
}

export function LandingNav({ session, user }: LandingNavProps) {
  const initial = initialFromUser(user ?? null)

  return (
    <header
      id="site-nav"
      className="sticky top-0 z-[100] shrink-0 border-b border-neutral-200/80 bg-white/95 shadow-sm shadow-neutral-900/5 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 dark:border-neutral-800 dark:bg-neutral-950/95 dark:shadow-black/20 dark:supports-[backdrop-filter]:bg-neutral-950/90"
    >
      <div className="flex h-14 w-full items-center justify-between gap-3 px-4 sm:h-[3.75rem] sm:px-6 lg:px-8 xl:px-10">
        <Link href="/" className="type-nav-brand flex shrink-0 items-center gap-2 py-1">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #7c3aed 45%, #2563eb 100%)",
            }}
            aria-hidden
          >
            <span className="text-white">💍</span>
          </span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 justify-center px-4 md:flex" aria-label="Main">
          <LandingNavLinks />
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <ThemeToggle />
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="type-nav-cta rounded-full bg-gradient-to-r from-[#4f6df5] to-[#7a5af1] px-3.5 py-2 text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95 sm:px-4"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                aria-label="Notifications"
              >
                <Bell className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.75} />
              </Link>
              <Link
                href="/dashboard/settings"
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed] ${type.small} font-semibold text-white ring-2 ring-white shadow-sm dark:ring-neutral-900`}
                aria-label="Account"
              >
                {user?.image && user.image.trim() !== "" ? (
                  <Image
                    src={user.image}
                    alt={user.name ? `${user.name} profile` : "Profile"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span aria-hidden>{initial}</span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="type-nav rounded-full px-3 py-2 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="type-nav-cta rounded-full bg-gradient-to-r from-[#4f6df5] to-[#7a5af1] px-3.5 py-2 text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95 sm:px-4"
              >
                Start creating
              </Link>
              <Link
                href="/sign-in"
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                aria-label="Notifications"
              >
                <Bell className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.75} />
              </Link>
              <Link
                href="/sign-in"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 ring-2 ring-white transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-900 dark:hover:bg-neutral-700"
                aria-label="Account"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
              </Link>
            </>
          )}
        </div>
      </div>
      <LandingNavMobile mobileLinks={<LandingNavLinks className="flex-col items-start gap-3" />} />
    </header>
  )
}
