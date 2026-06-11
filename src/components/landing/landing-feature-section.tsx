import Link from "next/link"
import type { ReactNode } from "react"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"

type LandingFeatureSectionProps = {
  title: string
  description: string
  visual: ReactNode
  ctaHref: string
  ctaLabel: string
  visualFirst?: boolean
}

export function LandingFeatureSection({
  title,
  description,
  visual,
  ctaHref,
  ctaLabel,
  visualFirst = false,
}: LandingFeatureSectionProps) {
  const textBlock = (
    <div className={visualFirst ? "md:order-2" : undefined}>
      <h2 className={type.h2}>{title}</h2>
      <p className={`${type.secondary} mt-3 max-w-xl`}>{description}</p>
    </div>
  )

  const visualBlock = (
    <div className={visualFirst ? "md:order-1" : undefined}>{visual}</div>
  )

  return (
    <section className="border-b border-neutral-100 bg-white py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          {textBlock}
          {visualBlock}
        </div>
        <div className="mt-14 flex justify-center md:mt-16">
          <Link href={ctaHref} className={mt.pillCta}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
