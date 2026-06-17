import { type } from "@/lib/typography"

export { invitationTemplates, templateBuilderHref } from "@/lib/template-marketing"
export type { MarketingTemplate } from "@/lib/template-marketing"

/** Shared marketing / landing UI tokens */
export const mt = {
  page: "min-h-screen bg-white font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
  container: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
  containerNarrow: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8",
  pageHero: "py-3 sm:py-4",
  pageHeroCompact: "py-2 sm:py-2.5",
  /** First viewport: offset below navbar + fill screen above footer/promo */
  pageViewport:
    "min-h-[calc(100svh-var(--site-nav-height))] pt-[var(--page-offset-top)] pb-6 sm:pb-8",
  pageHeader: "mx-auto max-w-3xl text-center",
  pageHeaderNarrow: "mx-auto max-w-2xl text-center",
  pageHeaderLeft: "max-w-2xl",
  pageMain: "mt-5 sm:mt-6",
  pageMainTight: "mt-3 sm:mt-4",
  /** Centered first viewport with less top offset (templates, etc.) */
  pageViewportCentered:
    "flex min-h-[calc(100svh-var(--site-nav-height))] flex-col justify-center pt-[clamp(3rem,2.25rem+2vw,4.5rem)] pb-4 sm:pb-5",
  /** Sections that should appear only after scrolling past the first viewport */
  pageBelowFold: "border-t border-neutral-100 dark:border-neutral-800",
  pageSection: "py-5 md:py-6",
  section: "py-10 md:py-12",
  sectionTight: "py-8 md:py-10",

  eyebrow: type.eyebrow,
  heading: type.h1,
  headingSm: type.h2,
  headingCard: type.h4,
  subheading: `${type.secondary} text-neutral-600 dark:text-neutral-400`,
  body: type.body,
  muted: type.muted,
  link: type.link,
  linkInline: type.linkInline,

  card: "overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-neutral-900/8 dark:border-neutral-800 dark:bg-neutral-900",
  cardBody: "p-4",
  cardStatic: "rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900",
  cardStaticCompact: "rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900",

  pillCta: `inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4f6df5] via-[#6366f1] to-[#7a5af1] px-5 py-2.5 ${type.btn} text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95`,
  secondaryBtn: `inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 ${type.btn} text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-700`,
  promo: type.promo,
  promoLg: type.promoLg,
  promoSub: type.promoSub,

  badgeFree: `rounded-full bg-neutral-900/85 px-2 py-0.5 ${type.badge} text-white dark:bg-neutral-700`,
  badgePopular: `rounded-full bg-gradient-to-r from-[#4f6df5] to-[#7a5af1] px-2 py-0.5 ${type.badge} text-white`,

  gradientFeature: "bg-gradient-to-r from-[#c4b5fd] via-[#f0abfc] to-[#fb7185]",
  promoBand: "bg-[#7a5af1]",

  authPage:
    "flex min-h-[calc(100svh-var(--site-nav-height))] items-center justify-center bg-neutral-50 px-4 py-8 sm:px-6 dark:bg-neutral-900",
  authCard:
    "w-full max-w-md rounded-xl border border-neutral-200/80 bg-white p-6 shadow-lg shadow-neutral-900/5 sm:p-7 dark:border-neutral-800 dark:bg-neutral-900",
  errorAlert: `rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 ${type.error} dark:border-red-800 dark:bg-red-950`,
} as const
