import Link from "next/link"
import { auth } from "@/lib/auth"
import { buildMetadata } from "@/lib/seo"
import { invitationTemplates, mt } from "@/lib/marketing-theme"
import { TemplateCard } from "@/components/marketing/template-card"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = buildMetadata({
  title: "Wedding Invitation Templates",
  description:
    "Browse six premium wedding invitation templates — Classic Royal, Floral Romance, Mehndi Garden, Noor Nikah, Heritage Royale, and Modern Minimal.",
  path: "/templates",
})

export default async function TemplatesPage() {
  const session = await auth()
  const createHref = session ? "/dashboard/invitations/new" : "/sign-up"

  return (
    <div className={mt.page}>
      <section className={`bg-neutral-50/80 ${mt.pageViewportCentered}`}>
        <div className={mt.container}>
          <header className={mt.pageHeader}>
            <h1 className={mt.heading}>Elegant wedding invitation templates</h1>
            <p className={`${mt.subheading} mx-auto mt-1.5 max-w-xl`}>
              Choose a design and personalize every detail.{" "}
              <Link href="/pricing" className={mt.link}>
                See all features →
              </Link>
            </p>
          </header>

          <div className={`${mt.pageMainTight} grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3`}>
            {invitationTemplates.map((t) => (
              <TemplateCard key={t.key} template={t} createHref={createHref} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${mt.pageBelowFold} ${mt.promoBand} ${mt.sectionTight} text-center`}>
        <p className={`${mt.promo} mx-auto max-w-2xl px-4`}>
          Pick a template, personalize every detail, and share a stunning animated invitation in minutes.
        </p>
        <div className="mt-6">
          <Link href={createHref} className={mt.pillCta}>
            {session ? "Open builder" : "Start creating free"}
          </Link>
        </div>
      </section>

      <LandingFooter session={!!session} />
    </div>
  )
}
