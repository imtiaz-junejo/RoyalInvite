import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Button, ButtonLink } from "@/components/ui/button"
import { formatEventDate } from "@/lib/ssr"
import { Plus, Eye, Pencil, ExternalLink, Mail, Lock, BarChart3, ScanLine } from "lucide-react"
import { CopyLinkButton, DeleteButton } from "@/components/dashboard-actions"
import { canCreateInvitation, canEditInvitation, tiers } from "@/lib/tier-config"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { type } from "@/lib/typography"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  const invitations = await prisma.invitation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { rsvps: true, views: true, guestbookEntries: true } } },
  })

  const totalViews = invitations.reduce((sum, invitation) => sum + invitation._count.views, 0)

  const tier = (user?.tier as "free" | "pro") || "free"
  const tierLabel = tier === "pro" ? "Pro" : "Free"
  const editable = canEditInvitation(tier)
  const canCreateMore = canCreateInvitation(invitations.length, tier)

  return (
    <div className={dt.containerWide}>
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className={dt.heading}>Welcome, {session.user.name || "Guest"}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className={dt.subheading}>
                {invitations.length} invitation{invitations.length !== 1 ? "s" : ""} created
              </p>
              <p className={`${dt.subheading} flex items-center gap-1.5`}>
                <BarChart3 size={14} className="text-indigo-500" />
                {totalViews} total views
              </p>
              <span className={tier === "pro" ? dt.badgePro : dt.badgeFree}>{tierLabel} Tier</span>
              {tier === "free" && (
                <span className={type.caption}>
                  ({invitations.length}/{tiers.free.maxInvitations} used)
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.role === "admin" && (
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
              <Button variant="outline" size="md" tone="light" disabled>
                <Lock size={14} />
                Free Limit Reached
              </Button>
            )}
          </div>
        </div>

        {invitations.length === 0 ? (
          <div className={dt.cardDashed}>
            <p className="mb-4 text-4xl">💌</p>
            <h2 className={dt.headingSm}>No Invitations Yet</h2>
            <p className={`${dt.subheading} mx-auto mt-2 max-w-sm`}>
              Create your first beautiful wedding invitation.
            </p>
            <ButtonLink href="/dashboard/invitations/new" variant="primary" size="md" tone="light" className="mt-6">
              <Plus size={16} />
              Create Invitation
            </ButtonLink>
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
  )
}
