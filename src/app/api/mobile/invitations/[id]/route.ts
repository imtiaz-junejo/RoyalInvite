import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { invitationSchema } from "@/lib/validations"
import { canEditInvitation } from "@/lib/tier-config"
import { parseGalleryText, parseScheduleText } from "@/lib/utils"
import { requireMobileUser } from "@/lib/mobile-auth"
import { invitationFormPayload, serializeMobileInvitation } from "@/lib/mobile-invitations"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: mobileUser.id },
    include: {
      scheduleItems: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
      _count: { select: { rsvps: true, views: true, guestbookEntries: true } },
    },
  })
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ invitation: serializeMobileInvitation(invitation, req), form: invitationFormPayload(invitation), editable: canEditInvitation((mobileUser.tier as "free" | "pro") || "free") })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const tier = (mobileUser.tier as "free" | "pro") || "free"
    if (!canEditInvitation(tier)) return NextResponse.json({ error: "Free tier invitations are locked after creation. Upgrade to Pro to edit invitations." }, { status: 403 })

    const { id } = await params
    const existing = await prisma.invitation.findFirst({ where: { id, userId: mobileUser.id }, select: { id: true } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const validated = invitationSchema.parse(await req.json())
    const { scheduleText, secondaryLanguage, galleryText, ...invitationData } = validated
    const scheduleItems = parseScheduleText(scheduleText)
    const galleryItems = parseGalleryText(galleryText)

    const invitation = await prisma.invitation.update({
      where: { id },
      data: {
        ...invitationData,
        galleryText: galleryText || null,
        secondaryLanguage: secondaryLanguage || null,
        eventDate: new Date(`${validated.eventDate}T00:00:00`),
        gallery: { deleteMany: {}, create: galleryItems.map((item, index) => ({ url: item.url, caption: item.caption || null, order: index })) },
        scheduleItems: { deleteMany: {}, create: scheduleItems.map((item, index) => ({ time: item.time, event: item.event, order: index })) },
      },
      include: { _count: { select: { rsvps: true, views: true, guestbookEntries: true } } },
    })

    return NextResponse.json({ invitation: serializeMobileInvitation(invitation, req), editable: true, tier })
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const deleted = await prisma.invitation.deleteMany({ where: { id, userId: mobileUser.id } })
  if (!deleted.count) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
