import Link from "next/link"
import { cn } from "@/lib/utils"
import { type, typeDark } from "@/lib/typography"
import { ButtonHTMLAttributes, forwardRef, type ReactNode } from "react"

export type ButtonVariant = "primary" | "outline" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"
export type ButtonTone = "light" | "dark"

export type ButtonStyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  tone?: ButtonTone
  className?: string
}

const base =
  "inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"

const darkVariants = {
  primary: `bg-gold-500 text-[#0d0a04] hover:bg-gold-400 border border-gold-500 ${typeDark.btn}`,
  outline: `bg-transparent border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 ${typeDark.btn}`,
  ghost: `bg-transparent border border-transparent text-gold-400 hover:bg-white/10 ${typeDark.btn}`,
}

const lightVariants = {
  primary: `border-0 bg-gradient-to-r from-[#4f6df5] via-[#6366f1] to-[#7a5af1] text-white shadow-md shadow-indigo-500/20 hover:opacity-95 ${type.btn}`,
  outline: `border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 ${type.btn}`,
  ghost: `border border-transparent text-neutral-600 hover:bg-neutral-100 ${type.btn}`,
}

const sizes = {
  sm: `${type.caption} px-3 py-1.5 gap-1.5 font-semibold`,
  md: `${type.btn} px-4 py-2 gap-1.5`,
  lg: `${type.btnMd} px-5 py-2.5 gap-2`,
}

/** Deterministic button class string — safe for SSR and Link-as-button. */
export function getButtonClasses({
  variant = "outline",
  size = "md",
  tone = "dark",
  className,
}: ButtonStyleProps = {}) {
  const variants = tone === "light" ? lightVariants : darkVariants
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", tone = "dark", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={getButtonClasses({ variant, size, tone, className })}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

type ButtonLinkProps = ButtonStyleProps & {
  href: string
  children: ReactNode
  target?: string
  rel?: string
  title?: string
}

/** Valid link styled as a button — avoids invalid `<a><button>` nesting. */
export function ButtonLink({
  href,
  children,
  variant = "outline",
  size = "md",
  tone = "dark",
  className,
  target,
  rel,
  title,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      title={title}
      className={getButtonClasses({ variant, size, tone, className })}
    >
      {children}
    </Link>
  )
}

export { Button }
