import Link from "next/link"
import { auth } from "@/lib/auth"
import { Check } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { buildMetadata } from "@/lib/seo"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = buildMetadata({
  title: "Wedding Invitation Pricing Plans",
  description:
    "Free and Pro wedding invitation plans. Create one free invitation or unlock unlimited cards, premium themes, background music, and more.",
  path: "/pricing",
})

export default async function PricingPage() {
  const session = await auth()

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "1 invitation card",
        "Basic themes (Gold, Ivory)",
        "3D card animation",
        "Shareable link",
        "RSVP collection",
        "Countdown timer",
      ],
      cta: "Get started",
      href: "/sign-up",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per wedding",
      features: [
        "Unlimited invitations",
        "All themes & templates",
        "Background music player",
        "Photo gallery",
        "Custom fonts",
        "Priority support",
        "Export RSVP as CSV",
        "Analytics dashboard",
      ],
      cta: "Coming soon",
      href: "#",
      popular: true,
    },
    {
      name: "Studio",
      price: "$29",
      period: "per month",
      features: [
        "Everything in Pro",
        "Multiple weddings",
        "Client management",
        "White-label option",
        "API access",
        "Custom branding",
      ],
      cta: "Coming soon",
      href: "#",
      popular: false,
    },
  ]

  return (
    <div className={mt.page}>
      <section className={`bg-neutral-50/80 ${mt.pageViewport}`}>
        <div className={mt.containerNarrow}>
          <header className={mt.pageHeader}>
            <h1 className={mt.heading}>Simple, transparent plans</h1>
            <p className={`${mt.subheading} mx-auto mt-2 max-w-md`}>
              Start free. Upgrade when you&apos;re ready.{" "}
              <Link href="/about" className={mt.link}>
                Learn more →
              </Link>
            </p>
          </header>

          <div className={`${mt.pageMain} grid gap-4 md:grid-cols-3 md:gap-5`}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg md:p-7 ${
                  plan.popular
                    ? "border-indigo-300 ring-2 ring-indigo-100"
                    : "border-neutral-200/80 hover:border-neutral-300"
                }`}
              >
                {plan.popular && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${mt.badgePopular}`}>
                    Most popular
                  </span>
                )}
                <h3 className={type.planName}>{plan.name}</h3>
                <div className="mb-4 mt-1">
                  <span className={type.price}>{plan.price}</span>
                  {plan.period && <span className={`ml-1 ${type.priceMeta}`}>{plan.period}</span>}
                </div>
                <ul className="mb-5 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 ${type.small}`}>
                      <Check size={16} className="mt-0.5 shrink-0 text-indigo-600" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.href === "#" ? (
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    size="md"
                    tone="light"
                    className="w-full"
                    disabled
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <ButtonLink
                    href={plan.href}
                    variant={plan.popular ? "primary" : "outline"}
                    size="md"
                    tone="light"
                    className="w-full"
                  >
                    {plan.cta}
                  </ButtonLink>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${mt.pageBelowFold} ${mt.gradientFeature} ${mt.sectionTight}`}>
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className={`${type.h2} text-white`}>Everything you need for your big day</h2>
          <p className={`${type.promoSub} mx-auto mt-3 max-w-xl`}>
            Animated 3D reveals, RSVP tracking, WhatsApp updates, and beautiful themes — all in one place.
          </p>
          <div className="mt-8">
            <Link
              href={session ? "/dashboard/invitations/new" : "/sign-up"}
              className={`inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 ${type.btn} text-indigo-700 shadow-md transition hover:bg-neutral-50`}
            >
              {session ? "Create your invitation" : "Get started free"}
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter session={!!session} />
    </div>
  )
}
