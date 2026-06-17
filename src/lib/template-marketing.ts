import { templates, themes, type TemplateKey } from "@/lib/themes"

const marketingMeta: Record<
  TemplateKey,
  { desc: string; gradient: string; tag?: string }
> = {
  royal: {
    desc: "Regal gold tones and timeless formality for classic weddings.",
    gradient: "from-[#1a1208] via-[#2d2010] to-[#1a1208]",
    tag: "Popular",
  },
  floral: {
    desc: "Romantic blush gradients inspired by garden celebrations.",
    gradient: "from-[#2d0f1c] via-[#5c1f38] to-[#2d0f1c]",
  },
  modern: {
    desc: "Clean ivory minimalism for contemporary couples.",
    gradient: "from-[#ece5d5] via-[#ddd3ba] to-[#e8e0d0]",
  },
  mehndi: {
    desc: "Vibrant mehndi celebration with multi-event schedules.",
    gradient: "from-[#4a1942] via-[#8b2e5c] to-[#2d0f1c]",
    tag: "Cultural",
  },
  nikah: {
    desc: "Elegant emerald styling for Nikah and reception events.",
    gradient: "from-[#022c22] via-[#064e3b] to-[#041a0e]",
    tag: "Cultural",
  },
  heritage: {
    desc: "Grand Indian heritage with royal gold and full wedding week.",
    gradient: "from-[#1a1208] via-[#4a380c] to-[#2d2010]",
    tag: "Popular",
  },
  midnight: {
    desc: "Sophisticated midnight elegance with celestial accents.",
    gradient: "from-[#0f172a] via-[#1e293b] to-[#0f172a]",
    tag: "New",
  },
  bohemian: {
    desc: "Free-spirited boho vibes with earthy warmth and natural beauty.",
    gradient: "from-[#78350f] via-[#92400e] to-[#451a03]",
    tag: "New",
  },
  tropical: {
    desc: "Vibrant tropical paradise with ocean blues and sunset hues.",
    gradient: "from-[#064e3b] via-[#047857] to-[#065f46]",
    tag: "New",
  },
  vintage: {
    desc: "Timeless vintage charm with sepia tones and romantic lace details.",
    gradient: "from-[#44403c] via-[#57534e] to-[#292524]",
    tag: "New",
  },
  arabesque: {
    desc: "Opulent Arabian nights with rich gold and intricate patterns.",
    gradient: "from-[#4a1d96] via-[#6d28d9] to-[#3b0764]",
    tag: "New",
  },
  celestial: {
    desc: "Cosmic wonder with starry nights and ethereal moonlight.",
    gradient: "from-[#1e1b4b] via-[#312e81] to-[#0f0d3d]",
    tag: "New",
  },
}

export type MarketingTemplate = {
  key: TemplateKey
  name: string
  theme: string
  gradient: string
  accent: string
  desc: string
  tag?: string
}

export const invitationTemplates: MarketingTemplate[] = (
  Object.keys(templates) as TemplateKey[]
).map((key) => {
  const t = templates[key]
  const meta = marketingMeta[key]
  return {
    key,
    name: t.name,
    theme: t.theme,
    gradient: meta.gradient,
    accent: themes[t.theme].accent,
    desc: meta.desc,
    tag: meta.tag,
  }
})

export function templateBuilderHref(
  baseHref: string,
  templateKey: TemplateKey
): string {
  const sep = baseHref.includes("?") ? "&" : "?"
  return `${baseHref}${sep}template=${templateKey}`
}
