import { cn } from "@/lib/utils"
import { type } from "@/lib/typography"

type LandingFeatureRowProps = {
  title: string
  children: React.ReactNode
  visual: React.ReactNode
  reverse?: boolean
}

export function LandingFeatureRow({
  title,
  children,
  visual,
  reverse = false,
}: LandingFeatureRowProps) {
  return (
    <section className="border-b border-neutral-100 bg-white py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div
          className={cn(
            "grid items-center gap-8 md:grid-cols-2 lg:gap-10",
            reverse && "[&>div:first-child]:md:order-2 [&>div:last-child]:md:order-1"
          )}
        >
          <div>
            <h2 className={type.h2}>{title}</h2>
            <div className={`${type.secondary} mt-4 space-y-3`}>{children}</div>
          </div>
          <div>{visual}</div>
        </div>
      </div>
    </section>
  )
}
