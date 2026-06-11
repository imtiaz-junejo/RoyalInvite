import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { ButtonLink } from "@/components/ui/button"
import { Mail, Check, X, HelpCircle, ScanLine, MessageCircle } from "lucide-react"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { formatEventDate } from "@/lib/ssr"
import ExportCsvButton from "./export-csv-button"
import WhatsAppUpdateForm from "./whatsapp-update-form"

export default async function RsvpViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { id } = await params

  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!invitation) notFound()

  const rsvps = await prisma.rsvp.findMany({
    where: { invitationId: id },
    orderBy: { createdAt: "desc" },
  })

  const stats = {
    total: rsvps.length,
    guestCount: rsvps.reduce((sum, rsvp) => sum + (rsvp.guestCount || 1), 0),
    attending: rsvps.filter((r) => r.attendanceStatus === "attending").length,
    notAttending: rsvps.filter((r) => r.attendanceStatus === "not_attending").length,
    maybe: rsvps.filter((r) => r.attendanceStatus === "maybe").length,
    checkedIn: rsvps.filter((r) => r.checkedInAt).length,
    whatsappReady: rsvps.filter((r) => r.whatsappConsent && r.guestWhatsapp).length,
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "attending":
        return <Check size={14} className="text-emerald-600" />
      case "not_attending":
        return <X size={14} className="text-red-600" />
      case "maybe":
        return <HelpCircle size={14} className="text-amber-600" />
      default:
        return null
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case "attending":
        return "Attending"
      case "not_attending":
        return "Not Attending"
      case "maybe":
        return "Maybe"
      default:
        return status
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      attending: "border-emerald-200 bg-emerald-50 text-emerald-700",
      not_attending: "border-red-200 bg-red-50 text-red-700",
      maybe: "border-amber-200 bg-amber-50 text-amber-800",
    }
    return (
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors[status] || ""}`}
      >
        {statusLabel(status)}
      </span>
    )
  }

  const chip = "rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-medium text-neutral-600"

  return (
    <div className={dt.containerNarrow}>
        <div className="mb-8">
          <h1 className={dt.heading}>{invitation.title}</h1>
          <p className={`${dt.subheading} mt-2`}>
            {invitation.brideName} & {invitation.groomName}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-6">
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Total</p>
            <p className={dt.statValue}>{stats.total}</p>
          </div>
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Attending</p>
            <p className={`${dt.statValue} text-emerald-600`}>{stats.attending}</p>
          </div>
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Guests</p>
            <p className={`${dt.statValue} text-sky-600`}>{stats.guestCount}</p>
          </div>
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Declined</p>
            <p className={`${dt.statValue} text-red-600`}>{stats.notAttending}</p>
          </div>
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Maybe</p>
            <p className={`${dt.statValue} text-amber-600`}>{stats.maybe}</p>
          </div>
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Checked in</p>
            <p className={`${dt.statValue} text-brand-600`}>{stats.checkedIn}</p>
          </div>
        </div>

        <div className="mb-6">
          <ButtonLink href={`/dashboard/invitations/${id}/check-in`} variant="outline" size="md" tone="light">
            <ScanLine size={14} /> Open check-in mode
          </ButtonLink>
        </div>

        <WhatsAppUpdateForm invitationId={id} recipientCount={stats.whatsappReady} />

        <div className={dt.tableWrap}>
          <div className={`flex items-center justify-between border-b ${dt.divider} px-5 py-4`}>
            <h2 className={dt.headingSm}>All responses</h2>
            {rsvps.length > 0 && <ExportCsvButton rsvps={rsvps} slug={invitation.slug} />}
          </div>

          {rsvps.length === 0 ? (
            <div className="py-16 text-center">
              <Mail size={32} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold text-neutral-700">No RSVP responses yet</p>
              <p className={`${dt.subheading} mt-1`}>Guests will appear here when they respond</p>
            </div>
          ) : (
            <div className={`divide-y ${dt.divider}`}>
              {rsvps.map((rsvp) => (
                <div key={rsvp.id} className="px-5 py-4 transition-colors hover:bg-neutral-50/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        {statusIcon(rsvp.attendanceStatus)}
                        <span className="text-lg font-semibold text-neutral-900">{rsvp.guestName}</span>
                      </div>
                      {rsvp.guestEmail && (
                        <p className={`${dt.subheading} mb-1 text-xs`}>{rsvp.guestEmail}</p>
                      )}
                      <div className="mb-1.5 flex flex-wrap gap-2">
                        <span className={chip}>
                          {rsvp.guestCount || 1} guest{(rsvp.guestCount || 1) !== 1 ? "s" : ""}
                        </span>
                        {rsvp.mealPreference && <span className={chip}>Meal: {rsvp.mealPreference}</span>}
                        {rsvp.checkedInAt && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                            Checked in
                          </span>
                        )}
                        {rsvp.whatsappConsent && rsvp.guestWhatsapp && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-medium text-brand-700">
                            <MessageCircle size={11} /> WhatsApp: {rsvp.guestWhatsapp}
                          </span>
                        )}
                        {rsvp.whatsappConsent && !rsvp.guestWhatsapp && (
                          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-700">
                            WhatsApp consent, number missing
                          </span>
                        )}
                        {!rsvp.whatsappConsent && (
                          <span className={chip}>No WhatsApp consent</span>
                        )}
                      </div>
                      {rsvp.message && (
                        <p className="text-sm italic text-neutral-600">&ldquo;{rsvp.message}&rdquo;</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {statusBadge(rsvp.attendanceStatus)}
                      <span className="text-[10px] text-neutral-400">
                        {formatEventDate(rsvp.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  )
}
