import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireMobileUser } from "@/lib/mobile-auth"
import { serializeMobileRsvp } from "@/lib/mobile-invitations"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const invitation = await prisma.invitation.findFirst({ where: { id, userId: mobileUser.id }, select: { id: true } })
  if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

  const rsvps = await prisma.rsvp.findMany({ where: { invitationId: id }, orderBy: { createdAt: "desc" } })
  const attending = rsvps.filter((rsvp) => rsvp.attendanceStatus === "attending")
  const maybe = rsvps.filter((rsvp) => rsvp.attendanceStatus === "maybe")
  const declined = rsvps.filter((rsvp) => rsvp.attendanceStatus === "not_attending")
  const checkedIn = rsvps.filter((rsvp) => rsvp.checkedInAt)
  const optedIn = rsvps.filter((rsvp) => rsvp.whatsappConsent && rsvp.guestWhatsapp)

  return NextResponse.json({
    stats: {
      total: rsvps.length,
      attending: attending.length,
      maybe: maybe.length,
      declined: declined.length,
      expectedGuestCount: attending.reduce((sum, rsvp) => sum + rsvp.guestCount, 0),
      checkedIn: checkedIn.length,
      whatsappOptedIn: optedIn.length,
    },
    rsvps: rsvps.map(serializeMobileRsvp),
  })
}
