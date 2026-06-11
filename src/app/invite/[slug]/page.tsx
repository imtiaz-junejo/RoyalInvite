import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { buildJsonLd, schemas } from "@/lib/seo"
import { absoluteUrl, siteConfig } from "@/lib/site"
import { parseEventSeriesText } from "@/lib/utils"
import PublicInvitationPage from "./invitation-client"

type Props = {
  params: Promise<{ slug: string }>
}

const getInvitation = cache(async (slug: string) => {
  return prisma.invitation.findUnique({
    where: { slug },
    include: {
      gallery: { orderBy: { order: "asc" } },
      scheduleItems: { orderBy: { order: "asc" } },
      guestbookEntries: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  })
})

function buildInvitationTitle(brideName: string, groomName: string) {
  return `${brideName} & ${groomName} Wedding Invitation`
}

function buildInvitationDescription(
  invitation: NonNullable<Awaited<ReturnType<typeof getInvitation>>>
) {
  return (
    invitation.message ||
    invitation.headline ||
    `Celebrate the wedding of ${invitation.brideName} and ${invitation.groomName} with this digital invitation from Eternally Yours.`
  )
}

function getInvitationImage(coverImage?: string | null) {
  if (!coverImage) {
    return absoluteUrl(siteConfig.ogImage)
  }

  return absoluteUrl(coverImage)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const invitation = await getInvitation(slug)
  const canonical = absoluteUrl(`/invite/${slug}`)

  if (!invitation) {
    return {
      title: "Invitation Not Found",
      description: "This invitation could not be found.",
      alternates: {
        canonical,
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = buildInvitationTitle(invitation.brideName, invitation.groomName)
  const description = buildInvitationDescription(invitation)
  const image = getInvitationImage(invitation.coverImage)
  const robots = invitation.isPublished
    ? { index: true, follow: true }
    : { index: false, follow: false }

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots,
  }
}

export default async function InvitePage({ params }: Props) {
  const { slug } = await params
  const invitation = await getInvitation(slug)

  if (!invitation) notFound()

  const eventSchema = invitation.isPublished
    ? schemas.event({
        name: buildInvitationTitle(invitation.brideName, invitation.groomName),
        description: buildInvitationDescription(invitation),
        startDate: invitation.eventDate.toISOString().split("T")[0],
        url: absoluteUrl(`/invite/${slug}`),
        image: invitation.coverImage ? getInvitationImage(invitation.coverImage) : undefined,
        venueName: invitation.venueName,
        venueAddress: invitation.venueAddress || undefined,
      })
    : null

  return (
    <>
      <PublicInvitationPage
        invitation={{
          brideName: invitation.brideName,
          groomName: invitation.groomName,
          title: invitation.title,
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
          scheduleText: invitation.scheduleItems.map((item) => `${item.time} | ${item.event}`).join("\n"),
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
          fontKey: invitation.fontKey as "cormorant" | "cinzel" | "lato",
          themeKey: invitation.themeKey as "gold" | "rose" | "emerald" | "ivory",
        }}
        slug={slug}
        invitationId={invitation.id}
        galleryImages={invitation.gallery.map((g) => ({ url: g.url, caption: g.caption || "" }))}
        scheduleItems={invitation.scheduleItems.map((item) => ({ time: item.time, event: item.event }))}
        eventSeriesItems={parseEventSeriesText(invitation.eventSeriesText || "")}
        guestbookEntries={invitation.guestbookEntries.map((entry) => ({
          id: entry.id,
          guestName: entry.guestName,
          message: entry.message,
          createdAt: entry.createdAt.toISOString(),
        }))}
      />
      {eventSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd(eventSchema) }}
        />
      )}
    </>
  )
}
