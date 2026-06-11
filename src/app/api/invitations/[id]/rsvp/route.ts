import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { rsvpSchema } from "@/lib/validations"
import { parseMealOptions } from "@/lib/utils"
import { normalizeWhatsappNumber } from "@/lib/whatsapp/phone"

function generateCheckInCode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const validated = rsvpSchema.parse(body)

    const invitation = await prisma.invitation.findUnique({ where: { id } })
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

    const mealOptions = parseMealOptions(invitation.mealOptions || "")
    const mealPreference = validated.mealPreference || null
    if (mealPreference && mealOptions.length > 0 && !mealOptions.includes(mealPreference)) {
      return NextResponse.json({ error: "Invalid meal preference" }, { status: 400 })
    }

    const guestWhatsapp = normalizeWhatsappNumber(validated.guestWhatsapp)
    if (validated.whatsappConsent && !guestWhatsapp) {
      return NextResponse.json({ error: "Valid WhatsApp number is required for reminders" }, { status: 400 })
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: invitation.id,
        guestName: validated.guestName,
        guestEmail: validated.guestEmail || null,
        guestCount: validated.guestCount,
        mealPreference,
        guestWhatsapp,
        whatsappConsent: validated.whatsappConsent,
        checkInCode: generateCheckInCode(),
        attendanceStatus: validated.attendanceStatus,
        message: validated.message || null,
        responseSource: "invite-page",
      },
    })

    return NextResponse.json(rsvp, { status: 201 })
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const invitation = await prisma.invitation.findUnique({ where: { id } })
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

    const rsvps = await prisma.rsvp.findMany({
      where: { invitationId: invitation.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(rsvps)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
