export type Tier = "free" | "pro"

export interface TierConfig {
  key: Tier
  name: string
  maxInvitations: number
  hasMusic: boolean
  hasGallery: boolean
  hasCustomFonts: boolean
  hasAllThemes: boolean
  price: string
  features: string[]
}

export const tiers: Record<Tier, TierConfig> = {
  free: {
    key: "free",
    name: "Free",
    maxInvitations: 5,
    hasMusic: false,
    hasGallery: false,
    hasCustomFonts: false,
    hasAllThemes: false,
    price: "$0",
    features: [
      "5 invitation cards",
      "Basic themes (Gold, Ivory)",
      "3D card animation",
      "Shareable link",
      "RSVP collection",
      "Countdown timer",
      "No edits after creation",
    ],
  },
  pro: {
    key: "pro",
    name: "Pro",
    maxInvitations: Infinity,
    hasMusic: true,
    hasGallery: true,
    hasCustomFonts: true,
    hasAllThemes: true,
    price: "$9",
    features: [
      "Unlimited invitations",
      "All themes (Gold, Rose, Emerald, Ivory)",
      "Background music player",
      "Photo gallery",
      "Custom fonts",
      "Priority support",
      "Export RSVP as CSV",
      "Analytics dashboard",
    ],
  },
}

export function canCreateInvitation(currentCount: number, tier: Tier): boolean {
  return currentCount < tiers[tier].maxInvitations
}

export function canEditInvitation(tier: Tier): boolean {
  return tier === "pro"
}

export function canUseMusic(tier: Tier): boolean {
  return tiers[tier].hasMusic
}

export function canUseGallery(tier: Tier): boolean {
  return tiers[tier].hasGallery
}

export function canUseAllThemes(tier: Tier): boolean {
  return tiers[tier].hasAllThemes
}
