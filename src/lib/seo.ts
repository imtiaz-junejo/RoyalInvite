import type { Metadata } from "next"
import { absoluteUrl, siteConfig } from "./site"

export interface PageMeta {
  title: string
  description: string
  path: string
  noIndex?: boolean
  openGraph?: Partial<Metadata["openGraph"]>
  twitter?: Partial<Metadata["twitter"]>
}

/**
 * Builds complete Next.js metadata for a public page.
 * Centralizes title, description, canonical, OG, Twitter, and robots policy.
 */
export function buildMetadata(meta: PageMeta): Metadata {
  const canonical = absoluteUrl(meta.path)
  const ogImageUrl = absoluteUrl(siteConfig.ogImage)
  const robots = meta.noIndex
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      }

  const base: Metadata = {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1024,
          height: 1024,
          alt: siteConfig.name,
        },
      ],
      locale: siteConfig.locale,
      ...meta.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
      ...meta.twitter,
    },
    robots,
  }

  return base
}

/**
 * Injects a JSON-LD script tag safely into JSX.
 * Usage: dangerouslySetInnerHTML={{ __html: buildJsonLd(schema) }}
 */
export function buildJsonLd(schema: unknown): string {
  return JSON.stringify(schema)
}

/**
 * Common JSON-LD schemas for this site
 */
export const schemas = {
  organization() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: absoluteUrl(siteConfig.ogImage),
      contactPoint: {
        "@type": "ContactPoint",
        email: siteConfig.social.email,
        contactType: "customer support",
      },
    }
  },

  webApplication() {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: siteConfig.name,
      description: siteConfig.description,
      url: absoluteUrl("/"),
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
    }
  },

  website() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    }
  },

  event(data: {
    name: string
    description: string
    startDate: string
    url: string
    image?: string
    venueName?: string
    venueAddress?: string
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      url: data.url,
      ...(data.image ? { image: [data.image] } : {}),
      ...(data.venueName
        ? {
            location: {
              "@type": "Place",
              name: data.venueName,
              ...(data.venueAddress ? { address: data.venueAddress } : {}),
            },
          }
        : {}),
      organizer: {
        "@type": "Organization",
        name: siteConfig.name,
        url: absoluteUrl("/"),
      },
    }
  },

  faqPage(items: { question: string; answer: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }
  },
}
