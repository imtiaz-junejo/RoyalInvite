import Link from "next/link"
import { auth } from "@/lib/auth"
import { buildMetadata, buildJsonLd, schemas } from "@/lib/seo"
import {
  Crown,
  Sparkles,
  Share2,
  Music,
  Heart,
  Clock,
  Plus,
} from "lucide-react"
import { LandingFooter } from "@/components/landing/landing-footer"
import { HomeHero } from "@/components/landing/home-hero"
import { LandingFeatureSections } from "@/components/landing/landing-feature-sections"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"

export const metadata = buildMetadata({
  title: "Premium Wedding Invitation Builder",
  description:
    "Create beautiful animated wedding invitations with 3D card reveals, elegant themes, and shareable links — free to start.",
  path: "/",
})

export default async function HomePage() {
  const session = await auth()

  const faqItems = [
    {
      question: "Is it free to create an invitation?",
      answer:
        "Yes! Sign up and create your first invitation completely free.",
    },
    {
      question: "Can I customize the design?",
      answer:
        "Absolutely. Choose themes, fonts, colors, music, cover images, gallery photos, and every text detail.",
    },
    {
      question: "How do guests view my invitation?",
      answer:
        "You get a unique shareable URL. Guests open it on any device and see your beautiful animated invitation.",
    },
    {
      question: "Can I collect RSVPs?",
      answer:
        "Yes. Your invitation includes an RSVP form. Responses appear in your dashboard.",
    },
    {
      question: "Can I add background music?",
      answer:
        "Yes. Provide a direct MP3 URL and your invitation will play it.",
    },
  ]

  const features = [
    {
      icon: Crown,
      title: "Premium Themes",
      desc: "Royal Gold, Rose Blush, Emerald Night, and Minimal Ivory — each handcrafted.",
    },
    {
      icon: Sparkles,
      title: "3D Card Animation",
      desc: "A beautiful card-opening reveal that delights every guest.",
    },
    {
      icon: Share2,
      title: "Share Anywhere",
      desc: "Unique links, QR codes, WhatsApp, and email sharing built in.",
    },
    {
      icon: Music,
      title: "Background Music",
      desc: "Add your special song to set the mood as guests open your invitation.",
    },
    {
      icon: Heart,
      title: "RSVP Collection",
      desc: "Guests can respond directly. Track responses from your dashboard.",
    },
    {
      icon: Clock,
      title: "Countdown Timer",
      desc: "Build anticipation with a live countdown to your special day.",
    },
  ]

  const templates = [
    { name: "Classic Royal", gradient: "from-[#1a1208] to-[#2d2010]", accent: "#c9a84c" },
    { name: "Floral Romance", gradient: "from-[#2d0f1c] to-[#5c1f38]", accent: "#e8739a" },
    { name: "Modern Minimal", gradient: "from-[#ece5d5] to-[#ddd3ba]", accent: "#8b6914" },
  ]

  const discoverLinks = [
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ]

  return (
    <div className={mt.page}>
      <div className="flex min-h-[calc(100svh-var(--site-nav-height))] flex-col bg-white">
        <HomeHero session={!!session} />
      </div>

      <section
        id="features"
        className={`relative overflow-hidden ${mt.gradientFeature} ${mt.section}`}
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
          <h2 className={`${type.h2} text-center text-white`}>Why Couples Choose Us</h2>
          <p className={`${type.promoSub} mx-auto mt-3 max-w-xl text-center`}>
            Every detail designed to make your invitation as special as your love story.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-4 shadow-md shadow-neutral-900/8"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <feature.icon size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className={type.h4}>{feature.title}</h3>
                    <p className={`${type.cardBody} mt-2`}>{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`border-b border-neutral-100 bg-white ${mt.section}`}>
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={type.h2}>Elegant Wedding Invitation Templates</h2>
            <p className={`${mt.subheading} mx-auto mt-3 max-w-2xl`}>
              Start from a preset and make it yours.{" "}
              <Link href="/templates" className={mt.link}>
                Browse all templates →
              </Link>
            </p>
          </div>

          <form action="/templates" method="get" className="mx-auto mt-8 max-w-xl">
            <label htmlFor="landing-search" className="sr-only">
              Search templates
            </label>
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
              <span className="text-neutral-400" aria-hidden>
                🔍
              </span>
              <input
                id="landing-search"
                name="q"
                type="search"
                placeholder="Search wedding invitation templates"
                className={`min-w-0 flex-1 bg-transparent ${type.small} text-neutral-800 outline-none placeholder:text-neutral-400`}
              />
              <button
                type="submit"
                className={`rounded-full bg-neutral-900 px-4 py-2 ${type.badge} text-white`}
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={session ? "/dashboard/invitations/new" : "/sign-up"}
              className="group flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
                <Plus className="h-7 w-7 text-neutral-500 transition group-hover:text-indigo-600" strokeWidth={1.75} />
              </div>
              <p className={`${type.link} mt-4`}>Start from scratch</p>
            </Link>

            {templates.map((t) => (
              <Link key={t.name} href="/templates" className="group block min-h-[280px]">
                <div className={`${mt.card} flex h-full min-h-[280px] flex-col`}>
                  <div className="relative flex min-h-0 flex-1 flex-col">
                    <span className={`absolute right-3 top-3 z-10 ${mt.badgeFree}`}>Free</span>
                    <div
                      className={`flex flex-1 items-center justify-center bg-gradient-to-br ${t.gradient}`}
                      role="img"
                      aria-label={`${t.name} wedding invitation template preview`}
                    >
                      <span className={`${type.templatePreview} text-white/90`} style={{ color: t.accent }}>
                        Preview
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={type.cardTitle}>{t.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <h3 className={type.h5}>Discover even more</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {discoverLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full bg-neutral-100 px-4 py-2 ${type.badge} text-neutral-700 transition hover:bg-neutral-200`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingFeatureSections />

      <section className={`${mt.promoBand} ${mt.sectionTight} text-center`}>
        <p className={`${mt.promoLg} mx-auto max-w-4xl px-4`}>
          Create stunning animated wedding invitations with 3D card reveals, elegant themes, and shareable links — in
          minutes.
        </p>
      </section>

      <section id="faq" className={`border-t border-neutral-200 bg-[#f4f4f4] ${mt.section}`}>
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h2 className={`${type.h2} text-center`}>Frequently Asked Questions</h2>
          <div className="mt-8 space-y-3">
            {faqItems.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm"
              >
                <h3 className={type.h4}>{faq.question}</h3>
                <p className={`${type.cardBody} mt-3`}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`bg-white ${mt.section} text-center`}>
        <div className="mx-auto max-w-xl px-4 md:px-6">
          <h2 className={type.h2}>Your Story Deserves Beauty</h2>
          <p className={`${mt.subheading} mt-3`}>
            Create your wedding invitation in minutes. Share it with the world.{" "}
            <Link href="/pricing" className={mt.link}>
              See pricing →
            </Link>
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildJsonLd(schemas.faqPage(faqItems)),
        }}
      />

      <LandingFooter session={!!session} />
    </div>
  )
}
