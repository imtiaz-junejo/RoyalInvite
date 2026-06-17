"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { type } from "@/lib/typography"
import { Crown, Zap, Check, ArrowLeft, CreditCard, Calendar, TrendingUp } from "lucide-react"
import { showToast } from "@/components/ui/toast"

interface BillingClientProps {
  userName: string
  userEmail: string
  tier: "free" | "pro"
  invitationCount: number
}

export function BillingClient({ userName, userEmail, tier, invitationCount }: BillingClientProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isPro = tier === "pro"
  const limit = isPro ? Infinity : 5
  const usagePercent = isPro ? 10 : Math.min((invitationCount / 5) * 100, 100)

  const handleTierChange = async (newTier: "free" | "pro") => {
    setLoading(true)
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      })

      const data = await res.json()

      if (res.ok) {
        showToast(data.message || "Plan updated successfully!")
        router.refresh()
      } else {
        showToast(data.error || "Failed to update plan", "error")
      }
    } catch {
      showToast("Failed to update plan", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={dt.containerNarrow}>
      <div className="mb-6">
        <a href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft size={14} />
          Back to Dashboard
        </a>
      </div>

      <div className="flex items-center gap-3 border-b border-neutral-200/60 pb-6 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <CreditCard className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950">
            Billing & Subscription
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your plan and view usage statistics.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className={`${type.h4} mb-1`}>Current Plan</h2>
                <p className={type.secondary}>
                  {isPro ? "You have unlimited access to all features." : "You're on the free plan with 5 invitations."}
                </p>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                isPro ? "bg-indigo-100 text-indigo-700" : "bg-neutral-100 text-neutral-600"
              }`}>
                {tier}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={type.label}>Usage</span>
                <span className={`${type.caption} font-mono font-bold`}>
                  {invitationCount} / {isPro ? "∞" : limit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isPro ? "bg-indigo-500" : usagePercent >= 100 ? "bg-red-500" : "bg-indigo-500"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className={`${type.caption} mt-2`}>
                {isPro ? "Unlimited invitations" : `${5 - invitationCount} invitations remaining`}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <h3 className={`${type.h4} mb-4`}>Compare Plans</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <PlanCard
                name="Free"
                price="$0"
                icon={Zap}
                features={[
                  "5 invitation cards",
                  "Basic themes",
                  "3D card animation",
                  "Shareable link",
                  "RSVP collection",
                ]}
                current={!isPro}
                onSelect={() => handleTierChange("free")}
                loading={loading}
                disabled={!isPro}
              />
              <PlanCard
                name="Pro"
                price="$9"
                period="one-time"
                icon={Crown}
                features={[
                  "Unlimited invitations",
                  "All 12 themes",
                  "Background music",
                  "Photo gallery",
                  "Edit anytime",
                  "Priority support",
                ]}
                current={isPro}
                onSelect={() => handleTierChange("pro")}
                loading={loading}
                disabled={isPro}
                popular
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <h3 className={`${type.h5} mb-3`}>Account Details</h3>
            <div className="space-y-3">
              <div>
                <p className={type.label}>Name</p>
                <p className={type.bodyStrong}>{userName}</p>
              </div>
              <div>
                <p className={type.label}>Email</p>
                <p className={type.bodyStrong}>{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <h3 className={`${type.h5} mb-3`}>Billing History</h3>
            <div className="text-center py-4">
              <Calendar className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className={type.secondary}>No billing history yet.</p>
              <p className={`${type.caption} mt-1`}>
                {isPro ? "Thank you for supporting us!" : "Upgrade to Pro to get started."}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h3 className={`${type.h5} text-indigo-900`}>Why upgrade?</h3>
            </div>
            <ul className="space-y-2 mt-3">
              {[
                "Unlimited invitations",
                "All 12 premium themes",
                "Edit anytime",
                "Background music",
                "Photo gallery",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-indigo-900">
                  <Check size={14} className="text-indigo-600 shrink-0" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanCard({
  name,
  price,
  period,
  icon: Icon,
  features,
  current,
  onSelect,
  loading,
  disabled,
  popular,
}: {
  name: string
  price: string
  period?: string
  icon: typeof Zap
  features: string[]
  current: boolean
  onSelect: () => void
  loading: boolean
  disabled: boolean
  popular?: boolean
}) {
  return (
    <div className={`rounded-xl border p-4 ${
      current
        ? "border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-100"
        : popular
        ? "border-indigo-200 bg-white"
        : "border-neutral-200 bg-white"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          current || popular ? "bg-indigo-500" : "bg-neutral-100"
        }`}>
          <Icon className={`h-4 w-4 ${current || popular ? "text-white" : "text-neutral-600"}`} />
        </div>
        <div>
          <h4 className={type.cardTitle}>{name}</h4>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold ${current || popular ? "text-indigo-600" : "text-neutral-900"}`}>
              {price}
            </span>
            {period && <span className={type.caption}>{period}</span>}
          </div>
        </div>
      </div>

      <ul className="space-y-1.5 mb-4">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-neutral-700">
            <Check size={12} className="text-indigo-500 shrink-0" strokeWidth={3} />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={disabled || loading}
        className={`w-full rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
          current
            ? "bg-indigo-100 text-indigo-700 cursor-default"
            : popular
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-95"
            : "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"
        }`}
      >
        {current ? "Current Plan" : loading ? "Processing..." : `Switch to ${name}`}
      </button>
    </div>
  )
}
