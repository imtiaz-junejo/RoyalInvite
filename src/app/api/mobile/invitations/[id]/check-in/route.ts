import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { checkInSchema } from "@/lib/validations"
import { requireMobileUser } from "@/lib/mobile-auth"
import { serializeMobileRsvp } from "@/lib/mobile-invitations"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const validated = checkInSchema.parse(await req.json())
    const invitation = await prisma.invitation.findFirst({ where: { id, userId: mobileUser.id }, select: { id: true } })
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

    const where = validated.rsvpId
      ? { id: validated.rsvpId, invitationId: invitation.id }
      : validated.code
        ? { checkInCode: validated.code, invitationId: invitation.id }
        : null

    if (!where) return NextResponse.json({ error: "RSVP id or code is required" }, { status: 400 })

    const updated = await prisma.rsvp.updateMany({ where, data: { checkedInAt: new Date() } })
    if (!updated.count) return NextResponse.json({ error: "Guest not found" }, { status: 404 })

    const rsvp = await prisma.rsvp.findFirst({ where })
    return NextResponse.json({ rsvp: rsvp ? serializeMobileRsvp(rsvp) : null })
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
