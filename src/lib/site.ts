// Centralized site configuration
// All SEO metadata should reference this file

const siteDomain = (
  process.env.APP_URL ||
  process.env.NEXTAUTH_URL ||
  "https://invite.sikanderkumbhar.com"
).replace(/\/+$/, "")

export const siteConfig = {
  name: "Eternally Yours",
  tagline: "Premium Wedding Invitations",
  description:
    "Create beautiful, shareable wedding invitations with stunning 3D animations and elegant themes.",
  domain: siteDomain,
  ogImage: "/invitation-icon-2.png",
  locale: "en_US",
  type: "website",
  social: {
    email: "hello@sikanderkumbhar.com",
  },
  creator: "SikanderKumbhar",
} as const

export type SiteConfig = typeof siteConfig

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, `${siteConfig.domain}/`).toString()
}
