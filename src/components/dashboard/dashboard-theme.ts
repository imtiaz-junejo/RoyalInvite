import { type } from "@/lib/typography"

/** Shared light UI tokens — dashboard & admin */
export const dashboardTheme = {
  page: "min-h-screen bg-neutral-50 font-sans text-neutral-900",
  shell: "min-h-screen bg-neutral-50 font-sans text-neutral-900",
  container: "mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8",
  containerNarrow: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8",
  containerWide: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8",

  card: "rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
  cardStatic: "rounded-xl border border-neutral-200/80 bg-white shadow-sm",
  cardDashed: "rounded-xl border-2 border-dashed border-neutral-300 bg-white p-6 text-center",

  heading: type.h2,
  headingSm: type.h4,
  subheading: `${type.secondary} text-neutral-500`,
  label: type.label,

  tableWrap: "overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm",
  tableHead: "bg-neutral-50 text-left",
  tableHeadCell: `px-3 py-2.5 ${type.label}`,
  tableRow: "border-b border-neutral-100 transition-colors hover:bg-neutral-50/80",
  tableCell: `px-3 py-2.5 ${type.secondary} text-neutral-700`,

  statCard: "rounded-xl border border-neutral-200/80 bg-white p-3.5 text-center shadow-sm",
  statValue: type.stat,
  statLabel: type.statLabel,

  badgePublished: `rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 ${type.badge} text-emerald-700`,
  badgeDraft: `rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 ${type.badge} text-amber-800`,
  badgePro: `rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 ${type.badge} text-indigo-700`,
  badgeFree: `rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 ${type.badge} text-neutral-600`,

  divider: "border-neutral-200",
  muted: "text-neutral-500",
  link: type.link,

  builderAside: "flex h-full flex-col overflow-hidden border-r border-neutral-200 bg-white",
  builderAsideScroll: "scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth",
  builderPreview: "flex h-full min-h-0 flex-col overflow-hidden",
  builderPreviewScroll: "scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth",
} as const
