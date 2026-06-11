import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireMobileUser } from "@/lib/mobile-auth"
import { sendWhatsappMessage } from "@/lib/whatsapp/gateway"

function buildInvitationUpdateMessage(invitation: { title: string; brideName: string; groomName: string }, message: string) {
  return [`${invitation.brideName} & ${invitation.groomName}`, invitation.title, "", message.trim(), "", "Sent from the official wedding invitation number."].join("\n")
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const message = String(body?.message || "").trim()

    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })
    if (message.length > 1000) return NextResponse.json({ error: "Message must be 1000 characters or less" }, { status: 400 })

    const invitation = await prisma.invitation.findFirst({ where: { id, userId: mobileUser.id }, select: { id: true, title: true, brideName: true, groomName: true } })
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

    const recipients = await prisma.rsvp.findMany({
      where: { invitationId: invitation.id, whatsappConsent: true, guestWhatsapp: { not: null } },
      select: { id: true, guestWhatsapp: true },
    })

    if (recipients.length === 0) return NextResponse.json({ error: "No WhatsApp recipients opted in for this invitation" }, { status: 400 })

    const text = buildInvitationUpdateMessage(invitation, message)
    let sent = 0
    let failed = 0

    for (const recipient of recipients) {
      const log = await prisma.whatsAppMessageLog.create({
        data: { invitationId: invitation.id, rsvpId: recipient.id, messageType: "manual_update", recipient: recipient.guestWhatsapp || "", message: text, status: "pending" },
      })

      try {
        const result = await sendWhatsappMessage({ to: recipient.guestWhatsapp || "", text })
        await prisma.whatsAppMessageLog.update({ where: { id: log.id }, data: { status: "sent", gatewayMessageId: result.messageId || null, sentAt: new Date() } })
        await prisma.rsvp.update({ where: { id: recipient.id }, data: { lastUpdateSentAt: new Date() } })
        sent += 1
      } catch (err: any) {
        await prisma.whatsAppMessageLog.update({ where: { id: log.id }, data: { status: "failed", error: String(err?.message || err).slice(0, 500) } })
        failed += 1
      }
    }

    return NextResponse.json({ ok: failed === 0, total: recipients.length, sent, failed })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
