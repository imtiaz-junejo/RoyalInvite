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
