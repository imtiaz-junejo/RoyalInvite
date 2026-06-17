import { ButtonLink } from "@/components/ui/button"
import { templateBuilderHref, type MarketingTemplate } from "@/lib/template-marketing"
import { type } from "@/lib/typography"
import { Sparkles, ArrowRight } from "lucide-react"

type TemplateCardProps = {
  template: MarketingTemplate
  createHref: string
}

export function TemplateCard({ template: t, createHref }: TemplateCardProps) {
  const href = templateBuilderHref(createHref, t.key)

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10">
      <div className="relative">
        {t.tag && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-2.5 py-1 shadow-lg">
            {t.tag === "New" && <Sparkles className="h-3 w-3 text-white" />}
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
              {t.tag}
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-neutral-900/80 px-2.5 py-1 backdrop-blur-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">
            Free
          </span>
        </div>

        <div
          className={`relative flex h-44 flex-col items-center justify-center overflow-hidden bg-gradient-to-br px-6 md:h-52 ${t.gradient}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
          <div className="relative z-10 text-center">
            <p
              className={`${type.h3} font-bold text-white drop-shadow-lg`}
              style={{ color: t.accent }}
            >
              {t.name}
            </p>
            <p className={`${type.small} mt-3 max-w-xs text-center leading-relaxed text-white/80`}>
              {t.desc}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className={`truncate ${type.cardTitle}`}>{t.name}</p>
          <p className={`mt-0.5 truncate ${type.caption}`}>{t.theme}</p>
        </div>
        <ButtonLink
          href={href}
          variant="primary"
          size="sm"
          tone="light"
          className="group/btn gap-1.5"
        >
          <span>Use</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </ButtonLink>
      </div>
    </div>
  )
}
