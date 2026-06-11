import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { canEditInvitation } from "@/lib/tier-config"
import { formatScheduleText } from "@/lib/utils"
import EditInvitationClient from "./edit-client"

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { tier: true } })
  const tier = (user?.tier as "free" | "pro") || "free"
  if (!canEditInvitation(tier)) redirect("/dashboard")

  const { id } = await params
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
    include: { gallery: { orderBy: { order: "asc" } }, scheduleItems: { orderBy: { order: "asc" } } },
  })

  if (!invitation) notFound()

  return (
    <EditInvitationClient
      invitation={{
        id: invitation.id,
        title: invitation.title,
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        headline: invitation.headline || "",
        secondaryHeadline: invitation.secondaryHeadline || "",
        eventDate: invitation.eventDate.toISOString().split("T")[0],
        eventTime: invitation.eventTime,
        venueName: invitation.venueName,
        venueAddress: invitation.venueAddress || "",
        googleMapsLink: invitation.googleMapsLink || "",
        message: invitation.message || "",
        secondaryMessage: invitation.secondaryMessage || "",
        storyTitle: invitation.storyTitle || "",
        storyText: invitation.storyText || "",
        secondaryStoryTitle: invitation.secondaryStoryTitle || "",
        secondaryStoryText: invitation.secondaryStoryText || "",
        galleryText: invitation.galleryText || "",
        eventSeriesTitle: invitation.eventSeriesTitle || "",
        eventSeriesText: invitation.eventSeriesText || "",
        mealOptions: invitation.mealOptions || "",
        scheduleText: formatScheduleText(invitation.scheduleItems),
        primaryLanguage: invitation.primaryLanguage as any,
        secondaryLanguage: (invitation.secondaryLanguage || "") as any,
        rsvpContact: invitation.rsvpContact || "",
        rsvpDeadline: invitation.rsvpDeadline || "",
        dressCode: invitation.dressCode || "",
        familyNames: invitation.familyNames || "",
        coverImage: invitation.coverImage || "",
        musicTitle: invitation.musicTitle || "",
        musicArtist: invitation.musicArtist || "",
        musicUrl: invitation.musicUrl || "",
        fontKey: invitation.fontKey,
        themeKey: invitation.themeKey,
        templateKey: invitation.templateKey,
        isPublished: invitation.isPublished,
        slug: invitation.slug,
      }}
    />
  )
}
