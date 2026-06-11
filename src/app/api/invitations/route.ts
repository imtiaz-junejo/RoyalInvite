import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { invitationSchema } from "@/lib/validations"
import { generateSlug, parseGalleryText, parseScheduleText } from "@/lib/utils"
import { canCreateInvitation } from "@/lib/tier-config"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const validated = invitationSchema.parse(body)

    // Check user tier limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { _count: { select: { invitations: true } } },
    })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const tier = (user.tier as "free" | "pro") || "free"
    if (!canCreateInvitation(user._count.invitations, tier)) {
      return NextResponse.json(
        { error: "Free tier allows up to 5 invitations. Upgrade to Pro for unlimited invitations and editing." },
        { status: 403 }
      )
    }

    const { scheduleText, secondaryLanguage, galleryText, ...invitationData } = validated
    const scheduleItems = parseScheduleText(scheduleText)
    const galleryItems = parseGalleryText(galleryText)

    // Create a unique slug
    let slug = generateSlug(`${validated.title}-${validated.brideName}-${validated.groomName}`)
    let counter = 1
    while (await prisma.invitation.findUnique({ where: { slug } })) {
      slug = `${slug}-${counter}`
      counter++
    }

    const invitation = await prisma.invitation.create({
      data: {
        userId: session.user.id,
        slug,
        ...invitationData,
        galleryText: galleryText || null,
        secondaryLanguage: secondaryLanguage || null,
        eventDate: new Date(validated.eventDate + "T00:00:00"),
        gallery: galleryItems.length
          ? {
              create: galleryItems.map((item, index) => ({
                url: item.url,
                caption: item.caption || null,
                order: index,
              })),
            }
          : undefined,
        scheduleItems: scheduleItems.length
          ? {
              create: scheduleItems.map((item, index) => ({
                time: item.time,
                event: item.event,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        scheduleItems: { orderBy: { order: "asc" } },
        gallery: { orderBy: { order: "asc" } },
      },
    })

    return NextResponse.json({ invitation, editable: tier === "pro", tier }, { status: 201 })
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
