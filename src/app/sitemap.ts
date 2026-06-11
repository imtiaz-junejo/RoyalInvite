import { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"
import { prisma } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/templates"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/pricing"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic published invitation pages
  let invitationPages: MetadataRoute.Sitemap = []
  try {
    const invitations = await prisma.invitation.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })

    invitationPages = invitations.map((inv) => ({
      url: absoluteUrl(`/invite/${inv.slug}`),
      lastModified: inv.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch {
    // If DB is not available (e.g., build time), skip dynamic pages
  }

  return [...staticPages, ...invitationPages]
}
