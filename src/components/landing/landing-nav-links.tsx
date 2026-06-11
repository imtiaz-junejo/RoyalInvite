import Link from "next/link"

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

/** Shared list layout — typography via `.type-nav` in globals.css (SSR-stable). */
const listBase = "flex items-center gap-6 lg:gap-8 type-nav"

export function LandingNavLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={className ? `${listBase} ${className}` : listBase}>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="transition-colors hover:text-neutral-900">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
