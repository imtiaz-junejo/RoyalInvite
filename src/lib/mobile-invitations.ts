import { Invitation, Rsvp } from "@prisma/client"

type InvitationWithCounts = Invitation & {
  _count?: { rsvps: number; views: number; guestbookEntries: number }
  rsvps?: Rsvp[]
}

export function publicInvitationUrl(req: Request, slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  return `${baseUrl.replace(/\/$/, "")}/invite/${slug}`
}

export function serializeMobileInvitation(invitation: InvitationWithCounts, req?: Request) {
  const rsvps = invitation.rsvps || []
  const attending = rsvps.filter((rsvp) => rsvp.attendanceStatus === "attending")
  const checkedIn = rsvps.filter((rsvp) => rsvp.checkedInAt)

  return {
    id: invitation.id,
    title: invitation.title,
    slug: invitation.slug,
    brideName: invitation.brideName,
    groomName: invitation.groomName,
    eventDate: invitation.eventDate.toISOString().slice(0, 10),
    eventTime: invitation.eventTime,
    venueName: invitation.venueName,
    venueAddress: invitation.venueAddress,
    themeKey: invitation.themeKey,
    templateKey: invitation.templateKey,
    isPublished: invitation.isPublished,
    publicUrl: req ? publicInvitationUrl(req, invitation.slug) : `/invite/${invitation.slug}`,
    rsvpCount: invitation._count?.rsvps ?? rsvps.length,
    viewCount: invitation._count?.views ?? 0,
    guestbookCount: invitation._count?.guestbookEntries ?? 0,
    attendingCount: attending.length,
    expectedGuestCount: attending.reduce((sum, rsvp) => sum + rsvp.guestCount, 0),
    checkedInCount: checkedIn.length,
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
  }
}

export function invitationFormPayload(invitation: any) {
  return {
    title: invitation.title,
    brideName: invitation.brideName,
    groomName: invitation.groomName,
    headline: invitation.headline || "",
    secondaryHeadline: invitation.secondaryHeadline || "",
    eventDate: invitation.eventDate.toISOString().slice(0, 10),
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
    scheduleText: (invitation.scheduleItems || []).map((item: any) => `${item.time} | ${item.event}`).join("\n"),
    primaryLanguage: invitation.primaryLanguage,
    secondaryLanguage: invitation.secondaryLanguage || "",
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
    customStyles: invitation.customStyles || "",
    isPublished: invitation.isPublished,
  }
}

export function serializeMobileRsvp(rsvp: Rsvp) {
  return {
    id: rsvp.id,
    guestName: rsvp.guestName,
    guestEmail: rsvp.guestEmail,
    guestCount: rsvp.guestCount,
    mealPreference: rsvp.mealPreference,
    guestWhatsapp: rsvp.whatsappConsent ? rsvp.guestWhatsapp : null,
    whatsappConsent: rsvp.whatsappConsent,
    checkInCode: rsvp.checkInCode,
    checkedInAt: rsvp.checkedInAt?.toISOString() || null,
    attendanceStatus: rsvp.attendanceStatus,
    message: rsvp.message,
    createdAt: rsvp.createdAt.toISOString(),
  }
}
