import Link from "next/link"
import { getCopyrightYear } from "@/lib/ssr"
import { ChevronDown, Facebook, Instagram, Linkedin } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { type } from "@/lib/typography"

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type LandingFooterProps = {
  session?: boolean
}

const footerColumns = [
  {
    title: "For couples & families",
    links: [
      { href: "/templates", label: "Wedding invitation templates" },
      { href: "/sign-up", label: "Create your invitation" },
      { href: "/templates", label: "Premium themes" },
      { href: "/#features", label: "3D card animation" },
      { href: "/#features", label: "Shareable invitation links" },
      { href: "/#features", label: "RSVP collection" },
      { href: "/templates", label: "View all templates" },
    ],
  },
  {
    title: "Invitation features",
    links: [
      { href: "/#features", label: "Animated card reveals" },
      { href: "/#features", label: "Background music" },
      { href: "/#features", label: "Photo gallery" },
      { href: "/#features", label: "Countdown timer" },
      { href: "/#features", label: "WhatsApp & email sharing" },
      { href: "/pricing", label: "Free & Pro plans" },
      { href: "/pricing", label: "View all features" },
    ],
  },
  {
    title: "Plans & account",
    links: [
      { href: "/pricing", label: "Pricing plans" },
      { href: "/sign-up", label: "Get started free" },
      { href: "/sign-in", label: "Sign in" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/invitations/new", label: "Create new invitation" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Help & contact" },
      { href: "/#faq", label: "Frequently asked questions" },
      { href: "/about", label: "About Eternally Yours" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "/contact", label: "Send a message" },
      { href: `mailto:${siteConfig.social.email}`, label: siteConfig.social.email },
      { href: "/contact", label: "Product feedback" },
    ],
  },
]

const featuredThemes = [
  { name: "Classic Royal", accent: "#c9a84c", short: "CR" },
  { name: "Floral Romance", accent: "#e8739a", short: "FR" },
  { name: "Emerald Night", accent: "#3dd68c", short: "EN" },
  { name: "Minimal Ivory", accent: "#8b6914", short: "MI" },
]

function resolveHref(href: string, label: string, session?: boolean) {
  if (href.startsWith("mailto:") || href.startsWith("/#")) return href
  if (href === "/dashboard" && !session) return "/sign-in"
  if (href === "/dashboard/invitations/new" && !session) return "/sign-up"
  if (href === "/sign-up" && session) {
    if (label === "Create your invitation" || label === "Create new invitation") {
      return "/dashboard/invitations/new"
    }
    return "/dashboard"
  }
  return href
}

function FooterLink({
  href,
  label,
  session,
}: {
  href: string
  label: string
  session?: boolean
}) {
  const resolved = resolveHref(href, label, session)

  if (resolved.startsWith("mailto:")) {
    return (
      <a href={resolved} className={type.footerLink}>
        {label}
      </a>
    )
  }

  return (
    <Link href={resolved} className={type.footerLink}>
      {label}
    </Link>
  )
}

export function LandingFooter({ session }: LandingFooterProps) {
  const year = getCopyrightYear()

  return (
    <footer className="border-t border-neutral-200 bg-[#f5f5f5]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className={type.footerCol}>{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <FooterLink href={link.href} label={link.label} session={session} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-y border-neutral-200/90 bg-[#f5f5f5]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-4 px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
          <span className={type.footerCol}>Featured themes</span>
          <ul className="flex flex-wrap items-center gap-5">
            {featuredThemes.map((theme) => (
              <li key={theme.name}>
                <Link
                  href="/templates"
                  className={`flex items-center gap-2 ${type.footerLink} transition-colors`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${type.caption} font-bold text-white shadow-sm`}
                    style={{ backgroundColor: theme.accent }}
                    aria-hidden
                  >
                    {theme.short}
                  </span>
                  {theme.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#f5f5f5]">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className={`flex flex-wrap items-center gap-4 ${type.small} text-neutral-700`}>
              <span className="inline-flex items-center gap-1 font-medium">
                English (US)
                <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
              </span>
              <span className="hidden text-neutral-300 sm:inline" aria-hidden>
                |
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                United States
                <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
              </span>
            </div>

            <ul className="flex items-center gap-4" aria-label="Social media">
              {[
                { href: "/contact", label: "Facebook", Icon: Facebook },
                { href: "/contact", label: "Instagram", Icon: Instagram },
                { href: "/contact", label: "X", Icon: XIcon },
                { href: "/contact", label: "LinkedIn", Icon: Linkedin },
              ].map(({ href, label, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-neutral-600 transition-colors hover:text-neutral-900"
                    aria-label={label}
                  >
                    {label === "X" ? (
                      <Icon className="h-[1.15rem] w-[1.15rem]" />
                    ) : (
                      <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/"
              className="type-nav-brand flex items-center gap-2"
              aria-label={siteConfig.name}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-md text-base shadow-sm"
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

          <div className={`mt-6 flex flex-col gap-4 border-t border-neutral-200/80 pt-6 ${type.footerMeta} sm:flex-row sm:flex-wrap sm:items-center sm:justify-between`}>
            <p>
              Copyright © {year} {siteConfig.creator} Invite. All rights reserved.
            </p>
            <nav className="flex flex-wrap items-center gap-x-1 gap-y-2" aria-label="Legal">
              <Link href="/privacy" className="hover:text-neutral-900 hover:underline">
                Privacy
              </Link>
              <span className="px-1 text-neutral-400">/</span>
              <Link href="/terms" className="hover:text-neutral-900 hover:underline">
                Terms of Use
              </Link>
              <span className="px-1 text-neutral-400">/</span>
              <Link href="/contact" className="hover:text-neutral-900 hover:underline">
                Contact
              </Link>
              <span className="px-1 text-neutral-400">/</span>
              <Link href="/privacy" className="hover:text-neutral-900 hover:underline">
                Cookie preferences
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
