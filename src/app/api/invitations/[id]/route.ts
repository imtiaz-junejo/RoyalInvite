import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { invitationSchema } from "@/lib/validations"
import { canEditInvitation } from "@/lib/tier-config"
import { parseGalleryText, parseScheduleText } from "@/lib/utils"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const validated = invitationSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { tier: true } })
    const tier = (user?.tier as "free" | "pro") || "free"
    if (!canEditInvitation(tier)) {
      return NextResponse.json(
        { error: "Free tier invitations are locked after creation. Upgrade to Pro to edit invitations." },
        { status: 403 }
      )
    }

    // Verify ownership
    const existing = await prisma.invitation.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { scheduleText, secondaryLanguage, galleryText, ...invitationData } = validated
    const scheduleItems = parseScheduleText(scheduleText)
    const galleryItems = parseGalleryText(galleryText)

    const invitation = await prisma.invitation.update({
      where: { id },
      data: {
        ...invitationData,
        galleryText: galleryText || null,
        secondaryLanguage: secondaryLanguage || null,
        eventDate: new Date(validated.eventDate + "T00:00:00"),
        gallery: {
          deleteMany: {},
          create: galleryItems.map((item, index) => ({
            url: item.url,
            caption: item.caption || null,
            order: index,
          })),
        },
        scheduleItems: {
          deleteMany: {},
          create: scheduleItems.map((item, index) => ({
            time: item.time,
            event: item.event,
            order: index,
          })),
        },
      },
      include: {
        scheduleItems: { orderBy: { order: "asc" } },
        gallery: { orderBy: { order: "asc" } },
      },
    })

    return NextResponse.json(invitation)
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const existing = await prisma.invitation.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.invitation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
