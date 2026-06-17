import { type } from "@/lib/typography"

/** Shared light/dark UI tokens — dashboard & admin */
export const dashboardTheme = {
  page: "min-h-screen bg-neutral-50 font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
  shell: "min-h-screen bg-neutral-50 font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
  container: "mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8",
  containerNarrow: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8",
  containerWide: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8",

  card: "rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900",
  cardStatic: "rounded-xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900",
  cardDashed: "rounded-xl border-2 border-dashed border-neutral-300 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-900",

  heading: type.h2,
  headingSm: type.h4,
  subheading: `${type.secondary} text-neutral-500 dark:text-neutral-400`,
  label: type.label,

  tableWrap: "overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900",
  tableHead: "bg-neutral-50 text-left dark:bg-neutral-800/50",
  tableHeadCell: `px-3 py-2.5 ${type.label}`,
  tableRow: "border-b border-neutral-100 transition-colors hover:bg-neutral-50/80 dark:border-neutral-800 dark:hover:bg-neutral-800/50",
  tableCell: `px-3 py-2.5 ${type.secondary} text-neutral-700 dark:text-neutral-300`,

  statCard: "rounded-xl border border-neutral-200/80 bg-white p-3.5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900",
  statValue: type.stat,
  statLabel: type.statLabel,

  badgePublished: `rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 ${type.badge} text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400`,
  badgeDraft: `rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 ${type.badge} text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400`,
  badgePro: `rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 ${type.badge} text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-400`,
  badgeFree: `rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 ${type.badge} text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400`,

  divider: "border-neutral-200 dark:border-neutral-800",
  muted: "text-neutral-500 dark:text-neutral-400",
  link: type.link,

  builderAside: "flex h-full flex-col overflow-hidden border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900",
  builderAsideScroll: "scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth",
  builderPreview: "flex h-full min-h-0 flex-col overflow-hidden",
  builderPreviewScroll: "scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth",
} as const
