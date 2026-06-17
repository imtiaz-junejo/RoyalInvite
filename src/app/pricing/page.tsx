import Link from "next/link"
import { auth } from "@/lib/auth"
import { Check, Crown, Zap, Building2 } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { buildMetadata } from "@/lib/seo"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"
import { LandingFooter } from "@/components/landing/landing-footer"
import { prisma } from "@/lib/db"
import { UpgradeButtonClient } from "@/components/dashboard/upgrade-button-client"

export const metadata = buildMetadata({
  title: "Wedding Invitation Pricing Plans",
  description:
    "Free and Pro wedding invitation plans. Create up to 5 free invitations or unlock unlimited cards, premium themes, background music, and more.",
  path: "/pricing",
})

export default async function PricingPage() {
  const session = await auth()
  let currentTier: "free" | "pro" = "free"

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    })
    currentTier = (user?.tier as "free" | "pro") || "free"
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      icon: Zap,
      features: [
        "5 invitation cards",
        "Basic themes (Gold, Ivory)",
        "3D card animation",
        "Shareable link",
        "RSVP collection",
        "Countdown timer",
        "No edits after creation",
      ],
      cta: session ? (currentTier === "free" ? "Current Plan" : "Downgrade") : "Get started",
      href: session ? "#" : "/sign-up",
      popular: false,
      tier: "free" as const,
    },
    {
      name: "Pro",
      price: "$9",
      period: "one-time",
      icon: Crown,
      features: [
        "Unlimited invitations",
        "All 12 themes & templates",
        "Background music player",
        "Photo gallery",
        "Custom fonts",
        "Edit anytime",
        "Priority support",
        "Export RSVP as CSV",
        "Analytics dashboard",
      ],
      cta: currentTier === "pro" ? "Current Plan" : session ? "Upgrade Now" : "Start with Pro",
      href: "#",
      popular: true,
      tier: "pro" as const,
    },
    {
      name: "Studio",
      price: "$29",
      period: "per month",
      icon: Building2,
      features: [
        "Everything in Pro",
        "Multiple weddings",
        "Client management",
        "White-label option",
        "API access",
        "Custom branding",
        "Dedicated support",
      ],
      cta: "Coming soon",
      href: "#",
      popular: false,
      tier: "studio" as const,
    },
  ]

  return (
    <div className={mt.page}>
      <section className={`relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/80`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.06)_0%,transparent_50%)]" />

        <div className={`relative ${mt.containerNarrow} ${mt.pageViewportCentered}`}>
          <header className={mt.pageHeader}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur-sm">
              <Crown className="h-3.5 w-3.5" />
              <span>Simple, Transparent Pricing</span>
            </div>
            <h1 className={`${mt.heading} bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent`}>
              Choose your perfect plan
            </h1>
            <p className={`${mt.subheading} mx-auto mt-3 max-w-md`}>
              Start free with 5 invitations. Upgrade to Pro for unlimited access to all features.
            </p>
          </header>

          <div className={`${mt.pageMain} grid gap-5 md:grid-cols-3`}>
            {plans.map((plan) => {
              const Icon = plan.icon
              const isCurrentPlan = session && plan.tier === currentTier
              const isDisabled = plan.href === "#" || isCurrentPlan

              return (
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

                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      plan.popular
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                        : "bg-neutral-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${plan.popular ? "text-white" : "text-neutral-600"}`} />
                    </div>
                    <h3 className={type.planName}>{plan.name}</h3>
                  </div>

                  <div className="mb-4">
                    <span className={type.price}>{plan.price}</span>
                    {plan.period && <span className={`ml-1 ${type.priceMeta}`}>{plan.period}</span>}
                  </div>

                  <ul className="mb-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 ${type.small}`}>
                        <Check size={16} className="mt-0.5 shrink-0 text-indigo-600" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.tier === "studio" ? (
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      size="md"
                      tone="light"
                      className="w-full"
                      disabled
                    >
                      {plan.cta}
                    </Button>
                  ) : isCurrentPlan ? (
                    <Button
                      variant="outline"
                      size="md"
                      tone="light"
                      className="w-full"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <UpgradeButton
                      plan={plan}
                      isSignedIn={!!session}
                      currentTier={currentTier}
                    />
                  )}
                </div>
              )
            })}
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

function UpgradeButton({
  plan,
  isSignedIn,
  currentTier,
}: {
  plan: { name: string; tier: "free" | "pro"; cta: string; popular: boolean }
  isSignedIn: boolean
  currentTier: "free" | "pro"
}) {
  if (!isSignedIn) {
    return (
      <ButtonLink
        href={plan.tier === "pro" ? "/sign-up?plan=pro" : "/sign-up"}
        variant={plan.popular ? "primary" : "outline"}
        size="md"
        tone="light"
        className="w-full"
      >
        {plan.cta}
      </ButtonLink>
    )
  }

  return <UpgradeButtonClient targetTier={plan.tier} currentTier={currentTier} label={plan.cta} popular={plan.popular} />
}
