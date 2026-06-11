import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { invitationSchema } from "@/lib/validations"
import { generateSlug, parseGalleryText, parseScheduleText } from "@/lib/utils"
import { canCreateInvitation, canEditInvitation, tiers } from "@/lib/tier-config"
import { requireMobileUser } from "@/lib/mobile-auth"
import { serializeMobileInvitation } from "@/lib/mobile-invitations"

export async function GET(req: NextRequest) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const invitations = await prisma.invitation.findMany({
    where: { userId: mobileUser.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { rsvps: true, views: true, guestbookEntries: true } } },
  })

  const tier = (mobileUser.tier as "free" | "pro") || "free"
  return NextResponse.json({
    user: mobileUser,
    tier,
    editable: canEditInvitation(tier),
    canCreateMore: canCreateInvitation(invitations.length, tier),
    limit: tiers[tier].maxInvitations === Infinity ? null : tiers[tier].maxInvitations,
    invitations: invitations.map((invitation) => serializeMobileInvitation(invitation, req)),
  })
}

export async function POST(req: NextRequest) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const validated = invitationSchema.parse(await req.json())
    const user = await prisma.user.findUnique({
      where: { id: mobileUser.id },
      include: { _count: { select: { invitations: true } } },
    })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const tier = (user.tier as "free" | "pro") || "free"
    if (!canCreateInvitation(user._count.invitations, tier)) {
      return NextResponse.json({ error: "Free tier allows up to 5 invitations. Upgrade to Pro for unlimited invitations and editing." }, { status: 403 })
    }

    const { scheduleText, secondaryLanguage, galleryText, ...invitationData } = validated
    const scheduleItems = parseScheduleText(scheduleText)
    const galleryItems = parseGalleryText(galleryText)

    let slug = generateSlug(`${validated.title}-${validated.brideName}-${validated.groomName}`)
    let counter = 1
    while (await prisma.invitation.findUnique({ where: { slug } })) {
      slug = `${slug}-${counter}`
      counter++
    }

    const invitation = await prisma.invitation.create({
      data: {
        userId: mobileUser.id,
        slug,
        ...invitationData,
        galleryText: galleryText || null,
        secondaryLanguage: secondaryLanguage || null,
        eventDate: new Date(`${validated.eventDate}T00:00:00`),
        gallery: galleryItems.length
          ? { create: galleryItems.map((item, index) => ({ url: item.url, caption: item.caption || null, order: index })) }
          : undefined,
        scheduleItems: scheduleItems.length
          ? { create: scheduleItems.map((item, index) => ({ time: item.time, event: item.event, order: index })) }
          : undefined,
      },
      include: { _count: { select: { rsvps: true, views: true, guestbookEntries: true } } },
    })

    return NextResponse.json({ invitation: serializeMobileInvitation(invitation, req), editable: canEditInvitation(tier), tier }, { status: 201 })
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
