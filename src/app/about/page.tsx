import Link from "next/link"
import { auth } from "@/lib/auth"
import { Crown, Heart, Sparkles, Share2, Layers, Users, Zap } from "lucide-react"
import { buildMetadata } from "@/lib/seo"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"
import { AboutHero } from "@/components/marketing/about-hero"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = buildMetadata({
  title: "About Eternally Yours",
  description:
    "Learn how Eternally Yours helps couples create elegant digital wedding invitations with premium design, animation, and RSVP tools.",
  path: "/about",
})

const values = [
  {
    icon: Heart,
    title: "Made for love stories",
    desc: "Every invitation should feel as personal and beautiful as the couple it celebrates.",
  },
  {
    icon: Sparkles,
    title: "Delight in every detail",
    desc: "3D card reveals, premium themes, and thoughtful animations that guests remember.",
  },
  {
    icon: Share2,
    title: "Share without limits",
    desc: "One link for WhatsApp, email, or QR — your guests open it anywhere, on any device.",
  },
  {
    icon: Crown,
    title: "Premium by default",
    desc: "Elegant design, live preview editing, and RSVP tools built in from day one.",
  },
]

const pillars = [
  {
    icon: Layers,
    title: "Beautiful templates",
    desc: "Start from Classic Royal, Mehndi Garden, Noor Nikah, and more — then customize everything.",
  },
  {
    icon: Users,
    title: "Built for couples & families",
    desc: "Collect RSVPs, share updates, and keep every guest informed from one dashboard.",
  },
  {
    icon: Zap,
    title: "Ready in minutes",
    desc: "No design skills or printing costs. Publish a shareable invitation the same day.",
  },
]

export default async function AboutPage() {
  const session = await auth()
  const ctaHref = session ? "/dashboard/invitations/new" : "/sign-up"

  return (
    <div className={mt.page}>
      <AboutHero ctaHref={ctaHref} />

      {/* Below the fold */}
      <section className={`${mt.pageBelowFold} ${mt.pageSection} bg-white`}>
        <div className={`${mt.containerNarrow} grid items-center gap-8 lg:grid-cols-2`}>
          <div>
            <h2 className={type.h2}>We believe every wedding invitation should feel extraordinary</h2>
            <p className={`${type.body} mt-3`}>
              Eternally Yours was born from a simple idea: your love story deserves more than a plain message or a PDF.
              We built a platform where couples create animated, shareable invitations that feel as special as the day
              itself.
            </p>
            <p className={`${type.body} mt-3`}>
              From the 3D card-opening reveal to RSVP collection and WhatsApp sharing — every feature is designed to
              help you celebrate with elegance and ease.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={ctaHref} className={mt.pillCta}>
                {session ? "Create invitation" : "Get started free"}
              </Link>
              <Link href="/templates" className={mt.secondaryBtn}>
                Browse templates
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4f6df5] via-[#7c3aed] to-[#ec4899] p-6 text-white shadow-xl shadow-indigo-500/20 md:p-8">
            <p className={`${type.promoLg} text-white`}>
              &ldquo;Because your love story is worth the extra effort.&rdquo;
            </p>
            <p className={`${type.promoSub} mt-3`}>
              Join thousands of couples who chose a digital invitation that guests actually remember.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-neutral-50/80 py-10 md:py-12">
        <div className={mt.containerNarrow}>
          <h2 className={`${type.h2} text-center`}>Everything you need in one place</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {pillars.map((item) => (
              <div key={item.title} className={mt.cardStaticCompact}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <item.icon size={20} strokeWidth={2} />
                </span>
                <h3 className={`${type.h5} mt-3`}>{item.title}</h3>
                <p className={`${type.small} mt-2`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${mt.pageSection} bg-white`}>
        <div className={mt.containerNarrow}>
          <h2 className={`${type.h2} text-center`}>What we stand for</h2>
          <p className={`${mt.subheading} mx-auto mt-2 max-w-xl text-center`}>
            Our values guide every template, animation, and feature we ship.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <item.icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <h3 className={type.h5}>{item.title}</h3>
                  <p className={`${type.small} mt-1.5`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${mt.pageBelowFold} ${mt.promoBand} ${mt.sectionTight} text-center`}>
        <p className={`${mt.promo} mx-auto max-w-2xl px-4`}>
          Ready to create something your guests will never forget?
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={ctaHref} className={mt.pillCta}>
            {session ? "Open builder" : "Get started free"}
          </Link>
          <Link
            href="/contact"
            className={`inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 ${type.btn} text-white transition hover:bg-white/20`}
          >
            Contact us
          </Link>
        </div>
      </section>

      <LandingFooter session={!!session} />
    </div>
  )
}
