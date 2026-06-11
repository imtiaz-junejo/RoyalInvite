import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Shield } from "lucide-react"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import WhatsAppSenderPanel from "./whatsapp-sender-panel"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== "admin") redirect("/dashboard")
  return { session, user }
}

export default async function AdminWhatsAppPage() {
  await requireAdmin()

  const [recipientCount, sentCount, failedCount] = await Promise.all([
    prisma.rsvp.count({ where: { whatsappConsent: true, guestWhatsapp: { not: null } } }),
    prisma.whatsAppMessageLog.count({ where: { status: "sent" } }),
    prisma.whatsAppMessageLog.count({ where: { status: "failed" } }),
  ])

  return (
    <div className={dt.containerWide}>
        <div className="mb-8">
          <h1 className={dt.heading}>Shared application sender</h1>
          <p className={`${dt.subheading} mt-2 max-w-2xl`}>
            Connect and monitor the single WhatsApp number used for all invitation reminders and updates.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Opted-in recipients" value={recipientCount} />
          <StatCard label="Messages sent" value={sentCount} />
          <StatCard label="Failed sends" value={failedCount} danger={failedCount > 0} />
        </div>

        <div className={`${dt.card} mb-8`}>
          <div className="flex items-start gap-3">
            <Shield size={18} className="mt-0.5 text-brand-600" />
            <div>
              <h2 className={`${dt.headingSm} mb-2`}>Sender rules</h2>
              <p className={`${dt.subheading} leading-relaxed`}>
                This sender belongs to the application. Hosts cannot connect their own numbers or access QR controls.
                Guest messages are still scoped per invitation by RSVP consent.
              </p>
            </div>
          </div>
        </div>

        <WhatsAppSenderPanel />
    </div>
  )
}

function StatCard({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className={dt.statCard}>
      <p className={dt.statLabel}>{label}</p>
      <p className={`${dt.statValue} ${danger ? "text-red-600" : ""}`}>{value}</p>
    </div>
  )
}
