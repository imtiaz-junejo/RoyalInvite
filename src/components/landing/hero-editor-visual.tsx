import Image from "next/image"
import { Printer } from "lucide-react"

const palette = [
  { color: "#2e083c", label: "Royal purple" },
  { color: "#4a2868", label: "Plum" },
  { color: "#c9a050", label: "Gold" },
  { color: "#e8c878", label: "Champagne" },
]

const REF_W = 574
const REF_H = 817
const CARD_W = 250
const CARD_H = Math.round((REF_H / REF_W) * CARD_W)

function PurpleGoldInvitationCard() {
  return (
    <div
      className="relative overflow-hidden shadow-[4px_6px_18px_rgba(0,0,0,0.35)]"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <Image
        src="/images/purple-gold-invitation-card.png"
        alt="Wedding invitation preview"
        width={REF_W}
        height={REF_H}
        className="h-full w-full"
        priority
        draggable={false}
      />
    </div>
  )
}

export function HeroEditorVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] select-none lg:max-w-[340px]" aria-hidden>
      <div className="relative flex items-center justify-center py-2 sm:py-4">
        <div className="absolute left-0 top-0 z-30 w-[72px] rounded-lg border border-neutral-200/80 bg-white p-2 shadow-[0_6px_24px_rgba(0,0,0,0.1)] sm:left-1 sm:top-1">
          <div className="flex items-center justify-center gap-2">
            <span className="font-serif text-base italic leading-none text-neutral-800">Ag</span>
            <span className="font-sans text-base font-semibold leading-none text-neutral-800">AG</span>
          </div>
        </div>

        <div className="absolute -left-1 top-[40%] z-30 sm:left-0">
          <div className="flex items-center gap-1.5 rounded-full bg-[#5b5bd6] px-3 py-2 text-white shadow-[0_6px_20px_rgba(91,91,214,0.4)]">
            <Printer className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="font-sans text-xs font-semibold">Print</span>
          </div>
        </div>

        <div className="relative z-10">
          <PurpleGoldInvitationCard />
        </div>

        <div className="absolute bottom-1 right-0 z-30 rounded-lg border border-neutral-200/80 bg-white p-2 shadow-[0_6px_24px_rgba(0,0,0,0.1)] sm:bottom-2 sm:right-1">
          <div className="grid grid-cols-2 gap-1">
            {palette.map((swatch) => (
              <span
                key={swatch.label}
                className="h-7 w-7 rounded-md border border-black/5 sm:h-8 sm:w-8"
                style={{ backgroundColor: swatch.color }}
                title={swatch.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
