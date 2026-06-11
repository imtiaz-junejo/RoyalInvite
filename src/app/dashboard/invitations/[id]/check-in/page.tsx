import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import CheckInClient from "./check-in-client"

export default async function InvitationCheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { id } = await params
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
    include: {
      rsvps: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          guestName: true,
          guestCount: true,
          attendanceStatus: true,
          checkInCode: true,
          checkedInAt: true,
        },
      },
    },
  })

  if (!invitation) redirect("/dashboard")

  return (
    <CheckInClient
      invitation={{ id: invitation.id, title: invitation.title, slug: invitation.slug }}
      rsvps={invitation.rsvps.map((rsvp) => ({
        id: rsvp.id,
        guestName: rsvp.guestName,
        guestCount: rsvp.guestCount,
        attendanceStatus: rsvp.attendanceStatus,
        checkInCode: rsvp.checkInCode,
        checkedInAt: rsvp.checkedInAt ? rsvp.checkedInAt.toISOString() : null,
      }))}
    />
  )
}
