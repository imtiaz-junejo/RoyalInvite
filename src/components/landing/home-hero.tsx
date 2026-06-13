import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"
import { HeroEditorVisual } from "@/components/landing/hero-editor-visual"

type HomeHeroProps = {
  session: boolean
}

export function HomeHero({ session }: HomeHeroProps) {
  const ctaHref = session ? "/dashboard/invitations/new" : "/sign-up"

  return (
    <section className="flex min-h-0 flex-1 flex-col justify-center border-b border-neutral-100 bg-white">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12 md:py-12 lg:gap-14 lg:px-8 xl:px-10">
        {/* Left — premium copy */}
        <div className="max-w-xl">
          <Link href="/" className="type-nav-brand inline-flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base shadow-sm"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #7c3aed 45%, #2563eb 100%)",
              }}
              aria-hidden
            >
              <span className="text-white">💍</span>
            </span>
            <span className="text-secondary font-semibold">{siteConfig.name}</span>
          </Link>

          <p className={`${type.eyebrow} mt-5`}>Premium wedding invitations</p>

          <h1 className={`${type.h1} mt-2`}>Craft invitations your guests will remember.</h1>

          <p className={`${type.body} mt-4 max-w-lg text-neutral-600`}>
            {siteConfig.name} is a premium invitation studio for couples who want more than a
            message — elegant templates, 3D card reveals, refined typography, and shareable links
            crafted in minutes.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Link href={ctaHref} className={mt.pillCta}>
              Create your invitation
            </Link>
            <Link href="/templates" className={mt.secondaryBtn}>
              View templates
            </Link>
          </div>

          <p className={`${type.caption} mt-4 text-neutral-500`}>
            Premium themes · 3D card animation · RSVP collection · Share anywhere
          </p>
        </div>

        {/* Right — editor mockup */}
        <div className="relative flex justify-center md:justify-end">
          <HeroEditorVisual />
        </div>
      </div>
    </section>
  )
}
