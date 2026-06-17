/**
 * Compact typography system — Inter, navbar-aligned proportions.
 * Body 15px · Secondary 14px · Small 13px · Caption 12px
 */
export const type = {
  h1: "font-sans text-h1 font-semibold tracking-tight text-neutral-950 dark:text-neutral-50",
  h2: "font-sans text-h2 font-semibold tracking-tight text-neutral-950 dark:text-neutral-50",
  h3: "font-sans text-h3 font-semibold tracking-tight text-neutral-950 dark:text-neutral-50",
  h4: "font-sans text-h4 font-semibold tracking-tight text-neutral-950 dark:text-neutral-50",
  h5: "font-sans text-h5 font-semibold tracking-tight text-neutral-950 dark:text-neutral-50",

  body: "font-sans text-body font-normal leading-body text-neutral-700 dark:text-neutral-300",
  secondary: "font-sans text-secondary font-normal leading-body text-neutral-600 dark:text-neutral-400",
  /** @deprecated use type.secondary */
  bodyLg: "font-sans text-secondary font-normal leading-body text-neutral-600 dark:text-neutral-400",
  bodyStrong: "font-sans text-body font-medium text-neutral-800 dark:text-neutral-200",
  small: "font-sans text-small font-normal leading-snug text-neutral-600 dark:text-neutral-400",
  caption: "font-sans text-caption font-normal leading-normal text-neutral-500 dark:text-neutral-500",

  eyebrow: "font-sans text-caption font-semibold uppercase tracking-eyebrow text-neutral-500 dark:text-neutral-400",
  label: "font-sans text-caption font-semibold uppercase tracking-eyebrow text-neutral-500 dark:text-neutral-400",

  link: "font-sans text-secondary font-medium text-[#2563eb] hover:underline dark:text-[#60a5fa]",
  linkInline: "font-sans text-body font-medium text-[#2563eb] hover:underline dark:text-[#60a5fa]",

  /** Navbar — use `.type-nav*` CSS classes in markup (SSR-stable; see globals.css) */
  nav: "type-nav",
  navBrand: "type-nav-brand",
  navCta: "type-nav-cta",

  btn: "font-sans text-secondary font-semibold",
  btnMd: "font-sans text-body font-semibold",
  /** @deprecated use type.btnMd */
  btnLg: "font-sans text-body font-semibold",

  price: "font-sans text-h2 font-semibold tabular-nums tracking-tight text-neutral-950 dark:text-neutral-50",
  priceMeta: "font-sans text-secondary text-neutral-500 dark:text-neutral-400",
  planName: "font-sans text-caption font-semibold uppercase tracking-eyebrow text-neutral-500 dark:text-neutral-400",

  promo: "font-sans text-secondary font-semibold leading-snug text-white",
  promoLg: "font-sans text-h3 font-semibold leading-snug tracking-tight text-white",
  promoSub: "font-sans text-secondary font-normal leading-relaxed text-white/90",

  stat: "font-sans text-h4 font-semibold tabular-nums tracking-tight text-neutral-950 dark:text-neutral-50",
  statLabel: "font-sans text-caption font-medium uppercase tracking-eyebrow text-neutral-500 dark:text-neutral-400",

  badge: "font-sans text-caption font-semibold uppercase tracking-wide",
  chip: "font-sans text-caption font-medium",

  cardTitle: "font-sans text-secondary font-semibold text-neutral-900 dark:text-neutral-100",
  cardBody: "font-sans text-secondary font-normal leading-relaxed text-neutral-600 dark:text-neutral-400",

  quote: "font-sans text-h4 font-medium italic leading-snug tracking-tight text-neutral-800 dark:text-neutral-200",
  templatePreview: "font-sans text-h5 font-semibold tracking-tight",
  templatePreviewSub: "font-sans text-caption leading-snug text-white/75",

  footerCol: "font-sans text-secondary font-semibold text-neutral-900 dark:text-neutral-100",
  footerLink: "font-sans text-secondary text-neutral-700 hover:text-neutral-950 hover:underline dark:text-neutral-300 dark:hover:text-neutral-100",
  footerMeta: "font-sans text-caption text-neutral-600 dark:text-neutral-400",

  error: "font-sans text-secondary text-red-700 dark:text-red-400",
  muted: "font-sans text-secondary text-neutral-500 dark:text-neutral-500",
} as const

export const typeDark = {
  h1: "font-sans text-h2 font-semibold tracking-tight text-gold-400",
  h2: "font-sans text-h4 font-semibold tracking-tight text-gold-200",
  h3: "font-sans text-h5 font-semibold text-gold-200/90",
  body: "font-sans text-secondary leading-body text-[#fdf8f0]/70",
  bodyStrong: "font-sans text-secondary font-medium text-[#fdf8f0]/85",
  label: "font-sans text-caption font-semibold uppercase tracking-eyebrow text-gold-200/80",
  link: "font-sans text-secondary font-medium text-gold-400 hover:underline",
  btn: "font-sans text-secondary font-semibold",
} as const
