import { ButtonLink } from "@/components/ui/button"
import { mt } from "@/lib/marketing-theme"
import { templateBuilderHref, type MarketingTemplate } from "@/lib/template-marketing"
import { type } from "@/lib/typography"

type TemplateCardProps = {
  template: MarketingTemplate
  createHref: string
}

export function TemplateCard({ template: t, createHref }: TemplateCardProps) {
  const href = templateBuilderHref(createHref, t.key)

  return (
    <div className={mt.card}>
      <div className="relative">
        {t.tag && (
          <span className={`absolute left-3 top-3 z-10 ${mt.badgePopular}`}>{t.tag}</span>
        )}
        <span className={`absolute right-3 top-3 z-10 ${mt.badgeFree}`}>Free</span>
        <div
          className={`flex h-32 flex-col items-center justify-center bg-gradient-to-br px-4 md:h-36 ${t.gradient}`}
          role="img"
          aria-label={`${t.name} invitation template preview`}
        >
          <p className={`${type.h4} font-semibold text-white/95`} style={{ color: t.accent }}>
            {t.name}
          </p>
          <p className={`${type.caption} mt-2 max-w-xs text-center text-white/75`}>{t.desc}</p>
        </div>
      </div>
      <div className={`${mt.cardBody} flex items-center justify-between gap-3`}>
        <p className={type.cardTitle}>{t.name}</p>
        <ButtonLink href={href} variant="outline" size="sm" tone="light">
          Use template
        </ButtonLink>
      </div>
    </div>
  )
}
