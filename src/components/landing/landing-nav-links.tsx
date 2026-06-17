import Link from "next/link"
import { cn } from "@/lib/utils"

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

/** Shared list layout — `.type-nav` from globals.css (identical SSR + client class string). */
const listBase = "flex items-center gap-6 lg:gap-8 type-nav"

export function LandingNavLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={cn(listBase, className)}>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
