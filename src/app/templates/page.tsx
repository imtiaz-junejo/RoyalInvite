import Link from "next/link"
import { auth } from "@/lib/auth"
import { buildMetadata } from "@/lib/seo"
import { invitationTemplates, mt } from "@/lib/marketing-theme"
import { TemplateCard } from "@/components/marketing/template-card"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Sparkles, Palette, Heart } from "lucide-react"

export const metadata = buildMetadata({
  title: "Wedding Invitation Templates",
  description:
    "Browse 12 premium wedding invitation templates — from classic royal to modern bohemian, tropical, vintage, and cultural designs.",
  path: "/templates",
})

export default async function TemplatesPage() {
  const session = await auth()
  const createHref = session ? "/dashboard/invitations/new" : "/sign-up"

  return (
    <div className={mt.page}>
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.06)_0%,transparent_50%)]" />

        <div className={`relative ${mt.container} py-8 sm:py-12`}>
          <header className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>12 Premium Templates</span>
            </div>
            <h1 className={`${mt.heading} bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent`}>
              Elegant wedding invitation templates
            </h1>
            <p className={`${mt.subheading} mx-auto mt-3 max-w-xl`}>
              Choose from our curated collection of beautiful designs and personalize every detail to match your love story.
            </p>
          </header>

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            <FilterPill icon={Palette} label="All Styles" active />
            <FilterPill label="Classic" />
            <FilterPill label="Modern" />
            <FilterPill label="Cultural" />
            <FilterPill label="Bohemian" />
            <FilterPill label="Tropical" />
          </div>
        </div>
      </section>

      <section className={`${mt.container} py-8 sm:py-10`}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {invitationTemplates.map((t) => (
            <TemplateCard key={t.key} template={t} createHref={createHref} />
          ))}
        </div>
      </section>

      <section className={`${mt.pageBelowFold} ${mt.promoBand} ${mt.sectionTight} text-center`}>
        <div className={`${mt.container} flex flex-col items-center gap-4`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Heart className="h-3.5 w-3.5" />
            <span>Free Forever</span>
          </div>
          <p className={`${mt.promoLg} mx-auto max-w-2xl px-4`}>
            Pick a template, personalize every detail, and share a stunning animated invitation in minutes.
          </p>
          <p className={`${mt.promoSub} mx-auto max-w-xl px-4`}>
            No credit card required. All templates are completely free to use.
          </p>
          <div className="mt-2">
            <Link href={createHref} className={mt.pillCta}>
              {session ? "Open builder" : "Start creating free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter session={!!session} />
    </div>
  )
}

function FilterPill({
  icon: Icon,
  label,
  active = false,
}: {
  icon?: typeof Palette
  label: string
  active?: boolean
}) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25"
          : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </button>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
