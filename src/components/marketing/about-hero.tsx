"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useMounted } from "@/lib/hooks/use-mounted"
import { ArrowRight, Layers, Share2, Sparkles } from "lucide-react"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"

const highlights = [
  {
    value: "6+",
    label: "Premium templates",
    icon: Layers,
    gradient: "from-indigo-500 via-indigo-600 to-blue-700",
    shadow: "shadow-indigo-500/30",
    iconBg: "bg-white/20",
  },
  {
    value: "3D",
    label: "Card reveal animation",
    icon: Sparkles,
    gradient: "from-violet-500 via-purple-600 to-fuchsia-700",
    shadow: "shadow-violet-500/30",
    iconBg: "bg-white/20",
  },
  {
    value: "1",
    label: "Link to share everywhere",
    icon: Share2,
    gradient: "from-rose-500 via-pink-600 to-rose-700",
    shadow: "shadow-rose-500/30",
    iconBg: "bg-white/20",
  },
] as const

const journeySteps = [
  { label: "Pick a template", detail: "Royal, Floral, Minimal & more" },
  { label: "Personalize every detail", detail: "Names, dates, photos, music" },
  { label: "Share one link", detail: "WhatsApp, email, or QR code" },
] as const

const floatingCards = [
  { gradient: "from-amber-200 to-amber-500", h: "h-14", w: "w-10", delay: 0 },
  { gradient: "from-rose-300 to-rose-500", h: "h-16", w: "w-11", delay: 0.35 },
  { gradient: "from-indigo-300 to-indigo-500", h: "h-12", w: "w-9", delay: 0.7 },
] as const

type AboutHeroProps = {
  ctaHref: string
}

export function AboutHero({ ctaHref }: AboutHeroProps) {
  const mounted = useMounted()

  return (
    <section
      className={`relative flex min-h-[calc(100svh-var(--site-nav-height))] flex-col overflow-hidden border-b border-neutral-100 bg-gradient-to-b from-indigo-50/80 via-white to-white pt-[var(--page-offset-top)] pb-6 sm:pb-8`}
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-24 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl"
        aria-hidden
      />

      <div className={`${mt.containerNarrow} relative flex flex-1 flex-col`}>
        <motion.header
          className={mt.pageHeader}
          initial={mounted ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className={mt.heading}>Your story deserves a beautiful beginning</h1>
          <p className={`${mt.subheading} mx-auto mt-2 max-w-2xl`}>
            Eternally Yours helps couples create stunning, animated wedding invitations — no design skills or printing
            costs required.
          </p>
        </motion.header>

        <div className={`${mt.pageMain} grid grid-cols-3 gap-3 sm:gap-4`}>
          {highlights.map((item, index) => (
            <motion.div
              key={item.label}
              initial={mounted ? { opacity: 0, y: 20, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.12 + index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-xl bg-gradient-to-br ${item.gradient} px-3 py-4 text-center text-white shadow-lg ${item.shadow} sm:px-4 sm:py-5`}
            >
              <span
                className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg} text-white`}
              >
                <item.icon size={18} strokeWidth={2} />
              </span>
              <p className="font-sans text-2xl font-semibold tabular-nums tracking-tight text-white sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 font-sans text-[0.7rem] font-medium leading-snug text-white/90 sm:text-xs">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-auto w-full pt-6 sm:pt-8"
          initial={mounted ? { opacity: 0, y: 28 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="overflow-hidden rounded-2xl border border-indigo-100/80 bg-white/90 p-4 shadow-lg shadow-indigo-500/10 backdrop-blur-sm sm:p-5">
            <p className={`${type.eyebrow} text-center text-indigo-500`}>How it works</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-3">
              {journeySteps.map((step, index) => (
                <div key={step.label} className="contents">
                  <div className="flex items-start gap-3 rounded-xl bg-neutral-50/80 p-3 sm:flex-col sm:items-center sm:p-4 sm:text-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className={type.bodyStrong}>{step.label}</p>
                      <p className={`${type.caption} mt-0.5`}>{step.detail}</p>
                    </div>
                  </div>
                  {index < journeySteps.length - 1 && (
                    <ArrowRight
                      className="mx-auto hidden h-4 w-4 shrink-0 text-indigo-300 sm:block"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link href={ctaHref} className={mt.pillCta}>
                Start creating
              </Link>
              <Link href="/templates" className={mt.secondaryBtn}>
                View templates
              </Link>
            </div>
          </div>

          <div
            className="pointer-events-none relative mx-auto mt-5 flex h-20 max-w-md items-end justify-center gap-4"
            aria-hidden
          >
            {floatingCards.map((card) => (
              <motion.div
                key={card.gradient}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: card.delay,
                }}
                className={`${card.h} ${card.w} rounded-lg bg-gradient-to-br ${card.gradient} shadow-md ring-1 ring-white/40`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
