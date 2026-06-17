"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button, ButtonLink } from "@/components/ui/button"
import { formatEventDate } from "@/lib/ssr"
import { Plus, Eye, Pencil, ExternalLink, Mail, Lock, BarChart3, ScanLine, Crown } from "lucide-react"
import { CopyLinkButton, DeleteButton } from "@/components/dashboard-actions"
import { canEditInvitation, tiers } from "@/lib/tier-config"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { type } from "@/lib/typography"
import { LimitReachedModal } from "@/components/dashboard/limit-reached-modal"

interface Invitation {
  id: string
  title: string
  slug: string
  brideName: string
  groomName: string
  eventDate: Date
  isPublished: boolean
  _count: {
    rsvps: number
    views: number
    guestbookEntries: number
  }
}

interface DashboardClientProps {
  userName: string
  invitations: Invitation[]
  totalViews: number
  tier: "free" | "pro"
  invitationCount: number
  isAdmin: boolean
}

export function DashboardClient({
  userName,
  invitations,
  totalViews,
  tier,
  invitationCount,
  isAdmin,
}: DashboardClientProps) {
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const tierLabel = tier === "pro" ? "Pro" : "Free"
  const editable = canEditInvitation(tier)
  const canCreateMore = invitationCount < tiers[tier].maxInvitations

  useEffect(() => {
    if (searchParams.get("limit") === "true") {
      setLimitModalOpen(true)
    }
  }, [searchParams])

  const handleNewInvitation = () => {
    if (!canCreateMore) {
      setLimitModalOpen(true)
    } else {
      window.location.href = "/dashboard/invitations/new"
    }
  }

  return (
    <>
      <div className={dt.containerWide}>
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className={dt.heading}>Welcome, {userName || "Guest"}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className={dt.subheading}>
                {invitationCount} invitation{invitationCount !== 1 ? "s" : ""} created
              </p>
              <p className={`${dt.subheading} flex items-center gap-1.5`}>
                <BarChart3 size={14} className="text-indigo-500" />
                {totalViews} total views
              </p>
              <span className={tier === "pro" ? dt.badgePro : dt.badgeFree}>{tierLabel} Tier</span>
              {tier === "free" && (
                <span className={type.caption}>
                  ({invitationCount}/{tiers.free.maxInvitations} used)
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <ButtonLink href="/dashboard/admin" variant="outline" size="md" tone="light">
                Admin
              </ButtonLink>
            )}
            {canCreateMore ? (
              <ButtonLink href="/dashboard/invitations/new" variant="primary" size="md" tone="light">
                <Plus size={16} />
                New Invitation
              </ButtonLink>
            ) : (
              <button
                onClick={handleNewInvitation}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-300 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95"
              >
                <Crown size={14} />
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {!canCreateMore && tier === "free" && (
          <div className="mb-6 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">You've reached your free limit</h3>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    You've used all {tiers.free.maxInvitations} free invitations. Upgrade to Pro for unlimited invitations and premium features.
                  </p>
                </div>
              </div>
              <ButtonLink href="/pricing" variant="primary" size="sm" tone="light">
                Upgrade Now
              </ButtonLink>
            </div>
          </div>
        )}

        {invitations.length === 0 ? (
          <div className={dt.cardDashed}>
            <p className="mb-4 text-4xl">💌</p>
            <h2 className={dt.headingSm}>No Invitations Yet</h2>
            <p className={`${dt.subheading} mx-auto mt-2 max-w-sm`}>
              Create your first beautiful wedding invitation.
            </p>
            <button
              onClick={handleNewInvitation}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95"
            >
              <Plus size={16} />
              Create Invitation
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {invitations.map((inv) => (
              <div key={inv.id} className={dt.card}>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className={`truncate ${type.h5}`}>{inv.title}</h3>
                      {inv.isPublished ? (
                        <span className={dt.badgePublished}>Published</span>
                      ) : (
                        <span className={dt.badgeDraft}>Draft</span>
                      )}
                    </div>
                    <p className={dt.subheading}>
                      {inv.brideName} & {inv.groomName} · {formatEventDate(inv.eventDate)}
                    </p>
                    <p className={`mt-1 ${type.caption}`}>
                      {inv._count.rsvps} RSVP{inv._count.rsvps !== 1 ? "s" : ""} · {inv._count.views} views ·{" "}
                      {inv._count.guestbookEntries} wishes
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <ButtonLink href={`/invite/${inv.slug}`} variant="ghost" size="sm" tone="light" title="Preview">
                      <Eye size={14} />
                    </ButtonLink>
                    {editable ? (
                      <ButtonLink href={`/dashboard/invitations/${inv.id}/edit`} variant="ghost" size="sm" tone="light" title="Edit">
                        <Pencil size={14} />
                      </ButtonLink>
                    ) : (
                      <Button variant="ghost" size="sm" tone="light" title="Upgrade to Pro to edit" disabled>
                        <Pencil size={14} />
                      </Button>
                    )}
                    <ButtonLink href={`/dashboard/invitations/${inv.id}/rsvps`} variant="ghost" size="sm" tone="light" title="View RSVPs">
                      <Mail size={14} />
                      <span className="ml-0.5 text-[10px]">{inv._count.rsvps}</span>
                    </ButtonLink>
                    <ButtonLink href={`/dashboard/invitations/${inv.id}/check-in`} variant="ghost" size="sm" tone="light" title="Guest Check-In">
                      <ScanLine size={14} />
                    </ButtonLink>
                    {inv.isPublished && (
                      <>
                        <CopyLinkButton slug={inv.slug} />
                        <ButtonLink href={`/invite/${inv.slug}`} variant="primary" size="sm" tone="light">
                          <ExternalLink size={14} />
                        </ButtonLink>
                      </>
                    )}
                    <DeleteButton id={inv.id} />
                  </div>
                </div>
                {!editable && (
                  <p className={`mt-3 flex items-center gap-1.5 ${type.caption}`}>
                    <Lock size={12} /> Free tier invitations are locked after creation. Upgrade to Pro to edit them.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <LimitReachedModal
        open={limitModalOpen}
        onOpenChange={setLimitModalOpen}
        currentCount={invitationCount}
        limit={tiers.free.maxInvitations}
      />
    </>
  )
}
