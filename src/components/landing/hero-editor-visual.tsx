import Image from "next/image"
import { Cinzel, Great_Vibes } from "next/font/google"
import { Printer } from "lucide-react"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const palette = [
  { color: "#2e083c", label: "Royal purple" },
  { color: "#4a2868", label: "Plum" },
  { color: "#c9a050", label: "Gold" },
  { color: "#e8c878", label: "Champagne" },
]

const card = {
  header: "THE WEDDING OF",
  bride: "Emily",
  groom: "James",
  month: "MAY",
  day: "20",
  weekday: "WEDNESDAY",
  time: "AT 4 PM",
  year: "2026",
}

const REF_W = 574
const REF_H = 817
const CARD_W = 250
const CARD_H = Math.round((REF_H / REF_W) * CARD_W)

const gold = {
  color: "#d4a84b",
  textShadow: "0 1px 0 #7a5c12, 0 2px 4px rgba(0,0,0,0.45), 0 -1px 0 #f0d080",
} as const

function DottedLine({ width }: { width: number }) {
  return (
    <svg width={width} height={4} aria-hidden className="block">
      <line
        x1="0"
        y1="2"
        x2={width}
        y2="2"
        stroke="#c9a050"
        strokeWidth="1.2"
        strokeDasharray="2 3"
      />
    </svg>
  )
}

function PurpleGoldInvitationCard() {
  return (
    <div
      className="relative overflow-hidden shadow-[4px_6px_18px_rgba(0,0,0,0.35)]"
      style={{
        width: CARD_W,
        height: CARD_H,
        background:
          "radial-gradient(ellipse 85% 70% at 50% 38%, #5a2878 0%, #2e083c 48%, #180428 100%)",
      }}
    >
      {/* Typography — rendered on the purple background */}
      <div className="absolute inset-0 z-10">
        <p
          className={`${cinzel.className} absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold uppercase leading-none`}
          style={{
            ...gold,
            top: "15.5%",
            fontSize: "9.5px",
            letterSpacing: "0.2em",
          }}
        >
          {card.header}
        </p>

        <p
          className={`${greatVibes.className} absolute whitespace-nowrap leading-none`}
          style={{
            ...gold,
            top: "24%",
            left: "19%",
            fontSize: "40px",
          }}
        >
          {card.bride}
        </p>

        <p
          className={`${cinzel.className} absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold uppercase leading-none`}
          style={{
            ...gold,
            top: "38%",
            fontSize: "7px",
            letterSpacing: "0.12em",
          }}
        >
          AND
        </p>

        <p
          className={`${greatVibes.className} absolute whitespace-nowrap leading-none`}
          style={{
            ...gold,
            top: "34.5%",
            right: "12%",
            fontSize: "40px",
          }}
        >
          {card.groom}
        </p>

        <p
          className={`${cinzel.className} absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold uppercase leading-none`}
          style={{
            ...gold,
            top: "52.5%",
            fontSize: "10.5px",
            letterSpacing: "0.26em",
          }}
        >
          {card.month}
        </p>

        <div
          className="absolute left-1/2 flex -translate-x-1/2 items-center justify-between"
          style={{ top: "57.5%", width: "78%" }}
        >
          <div className="flex w-[30%] flex-col items-center gap-[2px]">
            <DottedLine width={58} />
            <p
              className={`${cinzel.className} whitespace-nowrap font-bold uppercase leading-none`}
              style={{ ...gold, fontSize: "6.5px", letterSpacing: "0.04em" }}
            >
              {card.weekday}
            </p>
            <DottedLine width={58} />
          </div>

          <p
            className={`${cinzel.className} shrink-0 font-bold leading-none`}
            style={{ ...gold, fontSize: "46px" }}
          >
            {card.day}
          </p>

          <div className="flex w-[30%] flex-col items-center gap-[2px]">
            <DottedLine width={58} />
            <p
              className={`${cinzel.className} whitespace-nowrap font-bold uppercase leading-none`}
              style={{ ...gold, fontSize: "6.5px", letterSpacing: "0.02em" }}
            >
              {card.time}
            </p>
            <DottedLine width={58} />
          </div>
        </div>

        <p
          className={`${cinzel.className} absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-semibold leading-none`}
          style={{
            ...gold,
            top: "75%",
            fontSize: "9.5px",
            letterSpacing: "0.06em",
          }}
        >
          {card.year}
        </p>
      </div>

      {/* Gold border frame — black center is transparent via screen blend */}
      <Image
        src="/images/purple-gold-ornaments.png"
        alt=""
        width={REF_W}
        height={REF_H}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full mix-blend-screen"
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
            <span className="font-sans text-base italic leading-none text-neutral-800">Ag</span>
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
